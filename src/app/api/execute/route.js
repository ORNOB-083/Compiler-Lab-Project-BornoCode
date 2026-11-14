// POST /api/execute
// Body:     { "source": "<BornoCode>", "stdin": "<optional text>" }
// Response: { success, stdout, stderr, error, exitCode, executionTimeMs }
//
// Runs the compiled C++ interpreter as a separate process (no shell, fixed arguments),
// in a throw-away temp folder, with time / size / rate limits.
//
// IMPORTANT: this protects against accidents and light abuse. For a PUBLIC website, also run
// this inside a container (Docker) with memory / CPU / process limits and no network.

import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const MAX_SOURCE_BYTES = 20_000;
const MAX_STDIN_BYTES = 4_000;
const MAX_OUTPUT_BYTES = 64_000;
const TIMEOUT_MS = 5_000;
const MAX_CONCURRENT = 4;
const RATE_LIMIT = 30; // runs per IP per minute
const RATE_WINDOW_MS = 60_000;

const hits = new Map(); // ip -> [timestamps]  (per server instance only)
let running = 0;

function interpreterPath() {
    if (process.env.BORNOCODE_BIN) return process.env.BORNOCODE_BIN;
    const exe = process.platform === "win32" ? "bornocode.exe" : "bornocode";
    // The Next.js app root is the repo root; the interpreter lives in ./interpreter
    return path.resolve(process.cwd(), "interpreter", "bin", exe);
}

function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) {
        for (const [key, times] of hits) {
            if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
        }
    }
    return recent.length > RATE_LIMIT;
}

function failure(type, message, status, extra = {}) {
    return Response.json(
        {
            success: false,
            stdout: "",
            stderr: "",
            error: { type, message, line: null, column: null },
            exitCode: null,
            executionTimeMs: 0,
            ...extra,
        },
        { status },
    );
}

function runInterpreter(bin, file, cwd, stdin) {
    return new Promise((resolve) => {
        const started = Date.now();
        let stdout = "";
        let stderr = "";
        let bytes = 0;
        let timedOut = false;
        let truncated = false;

        // Minimal environment: nothing from your .env or secrets is passed on.
        const env = { PATH: process.env.PATH || "" };
        if (process.env.SystemRoot) env.SystemRoot = process.env.SystemRoot;
        if (process.env.TZ) env.TZ = process.env.TZ;

        const child = spawn(bin, [file], {
            cwd,
            env,
            stdio: ["pipe", "pipe", "pipe"],
            windowsHide: true,
        });

        const kill = () => {
            try {
                child.kill("SIGKILL");
            } catch { }
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

        child.stdin.on("error", () => { }); // program may exit before reading input
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

export async function POST(request) {
    const ip = (request.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
    if (rateLimited(ip)) {
        return failure("RateLimit", "You are running code too fast. Wait a few seconds and try again.", 429);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return failure("BadRequest", "The request body must be JSON.", 400);
    }

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
        return failure("Busy", "The server is busy running other programs. Try again in a moment.", 503);
    }

    // Optional: forward to a standalone execution service (e.g. the Docker
    // image in execution-service/) for real process/container isolation.
    if (process.env.BORNOCODE_URL) {
        try {
            const res = await fetch(`${process.env.BORNOCODE_URL.replace(/\/$/, "")}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source, stdin }),
            });
            const data = await res.json().catch(() => null);
            if (data && typeof data === "object" && "success" in data) {
                return Response.json(data, { status: res.status >= 400 && res.status < 500 ? res.status : 200 });
            }
        } catch {
            return failure("InterpreterError", "The execution service is unreachable.", 502);
        }
    }

    const bin = interpreterPath();
    try {
        await access(bin, constants.X_OK);
    } catch {
        return failure(
            "InterpreterMissing",
            "The BornoCode interpreter is not built yet. Run: npm run build:interpreter",
            500,
        );
    }

    running++;
    let dir;
    try {
        dir = await mkdtemp(path.join(os.tmpdir(), "bornocode-"));
        const file = path.join(dir, "main.bc");
        await writeFile(file, source, "utf8");

        const r = await runInterpreter(bin, file, dir, stdin);

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
            return Response.json({
                ...base,
                success: false,
                error: {
                    type: "Timeout",
                    message: `The program was stopped after ${TIMEOUT_MS / 1000} seconds. Check for a loop that never ends.`,
                    line: null,
                    column: null,
                },
            });
        }

        if (r.truncated) {
            return Response.json({
                ...base,
                success: false,
                error: {
                    type: "OutputLimit",
                    message: "The program printed too much output and was stopped.",
                    line: null,
                    column: null,
                },
            });
        }

        // "BornoCode Error (line 4): Undefined variable 'y'"
        const m = r.stderr.match(/BornoCode Error \(line (\d+)\): (.*)/);
        if (m) {
            return Response.json({
                ...base,
                success: false,
                error: { type: "BornoCodeError", message: m[2].trim(), line: Number(m[1]), column: null },
            });
        }

        if (r.signal) {
            return Response.json({
                ...base,
                success: false,
                error: { type: "Crash", message: "The interpreter stopped unexpectedly.", line: null, column: null },
            });
        }

        if (r.code !== 0) {
            // e.g. the program called ber(3) on purpose
            return Response.json({
                ...base,
                success: false,
                error: { type: "ExitCode", message: `The program ended with exit code ${r.code}.`, line: null, column: null },
            });
        }

        return Response.json({ ...base, success: true, error: null });
    } catch {
        return failure("ServerError", "Something went wrong while running your program.", 500);
    } finally {
        running--;
        if (dir) rm(dir, { recursive: true, force: true }).catch(() => { });
    }
}