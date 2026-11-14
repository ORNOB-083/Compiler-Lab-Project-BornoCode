// Compiles ../interpreter/bornocode.cpp into ../interpreter/bin/bornocode(.exe)
// Usage (from the web/ folder):  npm run build:interpreter
// Override the compiler with:    CXX=/path/to/g++ npm run build:interpreter
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "interpreter");
const bin = path.join(root, "bin");
const out = path.join(bin, process.platform === "win32" ? "bornocode.exe" : "bornocode");

mkdirSync(bin, { recursive: true });

// Bare "g++" may resolve to a Cygwin/MSYS g++ that cannot build native Windows
// binaries, so on Windows also try the common MSYS2 / MinGW install locations.
const candidates = [process.env.CXX, "g++", "c++", "clang++"].filter(Boolean);
if (process.platform === "win32") {
    for (const drive of ["C", "D"]) {
        for (const sub of ["ucrt64", "mingw64", "clang64"]) {
            candidates.push(`${drive}:/msys64/${sub}/bin/g++.exe`);
            candidates.push(`${drive}:/msys64/${sub}/bin/clang++.exe`);
        }
    }
    candidates.push("C:/MinGW/bin/g++.exe");
}

// Native Windows binaries need a mingw/windows-target compiler; a Cygwin or
// MSYS-target g++ would produce an .exe that cannot run without its runtime DLLs.
function isNativeCompiler(cxx) {
    const r = spawnSync(cxx, ["-dumpmachine"], { encoding: "utf8" });
    if (r.error || r.status !== 0) return true; // can't tell: let the build decide
    return !/cygwin|msys|linux|darwin/i.test(r.stdout || "");
}

const src = path.join(root, "bornocode.cpp").replace(/\\/g, "/");
const outArg = out.replace(/\\/g, "/");
// -static: the API runs the exe with a minimal environment, so it must not
// depend on libstdc++/libgcc DLLs living in the compiler's bin directory.
const args = ["-std=c++17", "-O2", "-static", src, "-o", outArg];

let lastError;
for (const cxx of candidates) {
    if (!isNativeCompiler(cxx)) {
        console.log(`skipping ${cxx} (not a native Windows toolchain)`);
        continue;
    }
    console.log(`${cxx} ` + args.join(" "));
    // Compilers like MSYS2's g++ need their own bin dir on PATH so cc1plus
    // can find libgmp/libmpfr/etc.
    const env = { ...process.env };
    if (cxx.includes("/")) {
        env.PATH = `${path.dirname(cxx)}${path.delimiter}${env.PATH ?? ""}`;
    }
    const r = spawnSync(cxx, args, { stdio: "inherit", env });
    if (!r.error && r.status === 0) {
        console.log("\nBuilt: " + out);
        process.exit(0);
    }
    lastError = r.error;
}

console.error(
    "\nCould not build the interpreter. Install a C++17 compiler " +
        "(MinGW-w64 / MSYS2 on Windows) or set CXX to its path.",
);
if (lastError) console.error(lastError.message);
process.exit(1);
