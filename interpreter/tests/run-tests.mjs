// Runs every case in tests/cases/ through the compiled interpreter and
// compares stdout (normalised) and exit code against expected.json.
// Usage:  node interpreter/tests/run-tests.mjs   (from the repo root)
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const casesDir = path.join(here, "cases");
const exe = path.join(here, "..", "bin", process.platform === "win32" ? "bornocode.exe" : "bornocode");

if (!existsSync(exe)) {
    console.error(`Interpreter not found at ${exe}\nRun: npm run build:interpreter`);
    process.exit(1);
}

function* walk(dir, prefix = "") {
    for (const name of readdirSync(dir).sort()) {
        const p = path.join(dir, name);
        if (statSync(p).isDirectory()) yield* walk(p, `${prefix}${name}/`);
        else if (name === "main.bc") yield `${prefix}${name}`;
    }
}

const norm = (s) => (s || "").replace(/\r\n/g, "\n");

let pass = 0;
let fail = 0;
const failures = [];

for (const rel of walk(casesDir)) {
    const dir = path.dirname(path.join(casesDir, rel));
    const name = path.relative(casesDir, dir).split(path.sep).join("/");
    const expected = JSON.parse(readFileSync(path.join(dir, "expected.json"), "utf8"));
    const stdin = existsSync(path.join(dir, "stdin.txt"))
        ? readFileSync(path.join(dir, "stdin.txt"), "utf8")
        : "";

    // Run in a throw-away dir so rakho()/tule() can't pollute the repo.
    const tmp = mkdtempSync(path.join(os.tmpdir(), "bc-test-"));
    const main = path.join(tmp, "main.bc");
    writeFileSync(main, readFileSync(path.join(dir, "main.bc"), "utf8"));

    const r = spawnSync(exe, [main], {
        cwd: tmp,
        input: stdin,
        encoding: "utf8",
        timeout: 10_000,
    });
    rmSync(tmp, { recursive: true, force: true });

    const stdout = norm(r.stdout);
    const stderr = norm(r.stderr);
    const problems = [];

    if (norm(expected.stdout) !== undefined && stdout !== norm(expected.stdout)) {
        problems.push(`stdout mismatch\n  expected: ${JSON.stringify(norm(expected.stdout))}\n  actual:   ${JSON.stringify(stdout)}`);
    }
    if (expected.exitCode !== undefined && r.status !== expected.exitCode) {
        problems.push(`exit code: expected ${expected.exitCode}, got ${r.status}`);
    }
    if (expected.stderrContains && !stderr.includes(expected.stderrContains)) {
        problems.push(`stderr missing ${JSON.stringify(expected.stderrContains)} (got ${JSON.stringify(stderr.trim())})`);
    }

    if (problems.length) {
        fail++;
        failures.push(`${name}\n  ${problems.join("\n  ")}`);
    } else {
        pass++;
        console.log(`  ok   ${name}`);
    }
}

console.log(`\n${pass} passed, ${fail} failed`);
if (failures.length) {
    console.log("\nFailures:\n" + failures.map((f) => "  - " + f).join("\n"));
    process.exit(1);
}
