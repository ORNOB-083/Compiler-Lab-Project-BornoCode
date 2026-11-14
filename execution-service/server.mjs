// BornoCode execution service.
//
// A tiny HTTP wrapper around the compiled interpreter, meant to run inside a
// locked-down container. Accepts the same contract as /api/execute:
//
//   POST /execute   { "source": "...", "stdin": "..." }
//   -> { success, stdout, stderr, error, exitCode, executionTimeMs }
//
// Env:
//   PORT             listen port            (default 8080)
//   BORNOCODE_BIN    interpreter binary     (default ./bornocode or ./bornocode.exe)
//   MAX_SOURCE_BYTES source size limit      (default 20000)
//   MAX_STDIN_BYTES  stdin size limit       (default 4000)
//   MAX_OUTPUT_BYTES output size limit      (default 64000)
//   TIMEOUT_MS       per-run timeout        (default 5000)

import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const BIN =
    process.env.BORNOCODE_BIN ||
    path.join(here, process.platform === "win32" ? "bornocode.exe" : "bornocode");

const MAX_SOURCE_BYTES = Number(process.env.MAX_SOURCE_BYTES || 20_000);
const MAX_STDIN_BYTES = Number(process.env.MAX_STDIN_BYTES || 4_000);
const MAX_OUTPUT_BYTES = Number(process.env.MAX_OUTPUT_BYTES || 64_000);
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 5_000);
const MAX_CONCURRENT = 4;

let running = 0;

function failure(type, message, status, extra = {}) {
    return {
        status,
        body: {
            success: false,
            stdout: "",
            stderr: "",
            error: { type, message, line: null, column: null },
            exitCode: null,
            executionTimeMs: 0,
            ...extra,
        },
    };
}

function runInterpreter(file, cwd, stdin) {
    return new Promise((resolve) => {
        const started = Date.now();
        let stdout = "";
        let stderr = "";
        let bytes = 0;
        let timedOut = false;
        let truncated = false;

        const env = { PATH: process.env.PATH || "" };
        if (process.env.SystemRoot) env.SystemRoot = process.env.SystemRoot;
        if (process.env.TZ) env.TZ = process.env.TZ;

        const child = spawn(BIN, [file], {
            cwd,
            env,
            stdio: ["pipe", "pipe", "pipe"],
            windowsHide: true,
        });

        const kill = () => {
            try {
                child.kill("SIGKILL");
            } catch {}
        };

        const timer = setTimeout(() => {
            timedOut = true;
            kill();
        }, TIMEOUT_MS);

        const collect = (isErr) => (chunk) => {
            bytes += Buffer.byteLength(chunk);
            if (bytes > MAX_OUTPUT_BYTES) {
                if (!truncated) {
                    truncated = true;
                    kill();
                }
                return;
            }
            if (isErr) stderr += chunk;
            else stdout += chunk;
        };

        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");
        child.stdout.on("data", collect(false));
        child.stderr.on("data", collect(true));

        child.stdin.on("error", () => {});
        child.stdin.end(stdin);

        child.on("error", (spawnError) => {
            clearTimeout(timer);
            resolve({ spawnError });
        });

        child.on("close", (code, signal) => {
            clearTimeout(timer);
            resolve({ stdout, stderr, code, signal, timedOut, truncated, ms: Date.now() - started });
        });
    });
}

async function handleExecute(body) {
    const source = body?.source;
    const stdin = body?.stdin ?? "";
    if (typeof source !== "string" || typeof stdin !== "string") {
        return failure("BadRequest", '"source" and "stdin" must be text.', 400);
    }
    if (Buffer.byteLength(source) > MAX_SOURCE_BYTES) {
        return failure("TooLarge", `Your program is too long (limit ${MAX_SOURCE_BYTES} bytes).`, 413);
    }
    if (Buffer.byteLength(stdin) > MAX_STDIN_BYTES) {
        return failure("TooLarge", `Standard input is too long (limit ${MAX_STDIN_BYTES} bytes).`, 413);
    }
    if (source.includes("\0")) {
        return failure("BadRequest", "Source code cannot contain null characters.", 400);
    }
    if (running >= MAX_CONCURRENT) {
        return failure("Busy", "The service is busy running other programs. Try again in a moment.", 503);
    }

    running++;
    let dir;
    try {
        dir = await mkdtemp(path.join(os.tmpdir(), "bornocode-"));
        const file = path.join(dir, "main.bc");
        await writeFile(file, source, "utf8");

        const r = await runInterpreter(file, dir, stdin);

        if (r.spawnError) {
            return failure("InterpreterError", "Could not start the interpreter.", 500);
        }

        const base = {
            stdout: r.stdout,
            stderr: r.stderr,
            exitCode: r.code,
            executionTimeMs: r.ms,
        };

        if (r.timedOut) {
            return {
                status: 200,
                body: {
                    ...base,
                    success: false,
                    error: {
                        type: "Timeout",
                        message: `The program was stopped after ${TIMEOUT_MS / 1000} seconds. Check for a loop that never ends.`,
                        line: null,
                        column: null,
                    },
                },
            };
        }

        if (r.truncated) {
            return {
                status: 200,
                body: {
                    ...base,
                    success: false,
                    error: {
                        type: "OutputLimit",
                        message: "The program printed too much output and was stopped.",
                        line: null,
                        column: null,
                    },
                },
            };
        }

        const m = r.stderr.match(/BornoCode Error \(line (\d+)\): (.*)/);
        if (m) {
            return {
                status: 200,
                body: {
                    ...base,
                    success: false,
                    error: { type: "BornoCodeError", message: m[2].trim(), line: Number(m[1]), column: null },
                },
            };
        }

        if (r.signal) {
            return {
                status: 200,
                body: {
                    ...base,
                    success: false,
                    error: { type: "Crash", message: "The interpreter stopped unexpectedly.", line: null, column: null },
                },
            };
        }

        if (r.code !== 0) {
            return {
                status: 200,
                body: {
                    ...base,
                    success: false,
                    error: { type: "ExitCode", message: `The program ended with exit code ${r.code}.`, line: null, column: null },
                },
            };
        }

        return { status: 200, body: { ...base, success: true, error: null } };
    } finally {
        running--;
        if (dir) rm(dir, { recursive: true, force: true }).catch(() => {});
    }
}

const server = http.createServer(async (req, res) => {
    const send = (status, body) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(body));
    };

    if (req.method === "GET" && req.url === "/health") {
        return send(200, { ok: true });
    }

    if (req.method !== "POST" || !req.url.startsWith("/execute")) {
        return send(404, { error: "Not found. Use POST /execute or GET /health." });
    }

    let raw = "";
    for await (const chunk of req) {
        raw += chunk;
        if (raw.length > MAX_SOURCE_BYTES + MAX_STDIN_BYTES + 1024) {
            return send(413, { error: "Request too large." });
        }
    }

    let body;
    try {
        body = JSON.parse(raw || "{}");
    } catch {
        return send(400, { error: "Body must be JSON." });
    }

    try {
        const { status, body: out } = await handleExecute(body);
        send(status, out);
    } catch {
        send(500, {
            success: false,
            stdout: "",
            stderr: "",
            error: { type: "ServerError", message: "Something went wrong while running your program.", line: null, column: null },
            exitCode: null,
            executionTimeMs: 0,
        });
    }
});

server.listen(PORT, () => {
    console.log(`BornoCode execution service listening on :${PORT}`);
    console.log(`Interpreter: ${BIN}`);
});
