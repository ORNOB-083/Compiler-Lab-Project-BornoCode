"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Loader2, Play, RotateCcw } from "lucide-react";
import { DEFAULT_EXAMPLE, EXAMPLES } from "@/lib/examples";
import CodeEditor from "@/components/editor/CodeEditor";
// import CodeEditor from "./CodeEditor";

// Remove colour codes (rong) and the bell character (gaan) so output stays readable.
const ANSI = new RegExp("\\u001b\\[[0-9;]*m", "g");
const BELL = new RegExp("\\u0007", "g");
const clean = (s) => (s || "").replace(ANSI, "").replace(BELL, "");

export default function Playground() {
    const [exampleId, setExampleId] = useState(DEFAULT_EXAMPLE);
    const [code, setCode] = useState(EXAMPLES[DEFAULT_EXAMPLE].code);
    const [stdin, setStdin] = useState(EXAMPLES[DEFAULT_EXAMPLE].stdin ?? "");
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [problem, setProblem] = useState(null); // network / unexpected-response message
    const [copied, setCopied] = useState(false);

    function loadExample(id) {
        const ex = EXAMPLES[id];
        if (!ex) return;
        setExampleId(id);
        setCode(ex.code);
        setStdin(ex.stdin ?? "");
        setResult(null);
        setProblem(null);
    }

    // Open /playground?example=loops directly
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get("example");
        if (id && EXAMPLES[id]) loadExample(id);
    }, []);

    async function run() {
        if (running) return;
        setRunning(true);
        setResult(null);
        setProblem(null);
        try {
            const res = await fetch("/api/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ source: code, stdin }),
            });
            const data = await res.json().catch(() => null);
            if (data && typeof data === "object" && "success" in data) setResult(data);
            else setProblem(`The server sent an unexpected response (status ${res.status}).`);
        } catch {
            setProblem("Could not reach the server. Check your connection and try again.");
        } finally {
            setRunning(false);
        }
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    }

    function download() {
        const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "main.bc";
        a.click();
        URL.revokeObjectURL(url);
    }

    // ----- status line -----
    let status = { text: "Ready. Press Ctrl + Enter to run.", tone: "text-slate-500" };
    if (running) status = { text: "Running...", tone: "text-indigo-500 dark:text-indigo-300" };
    else if (problem) status = { text: "Could not run", tone: "text-rose-500 dark:text-rose-300" };
    else if (result?.success)
        status = { text: `Finished in ${result.executionTimeMs} ms (exit ${result.exitCode})`, tone: "text-emerald-600 dark:text-emerald-300" };
    else if (result?.error?.type === "ExitCode")
        status = { text: `Ended with exit code ${result.exitCode} in ${result.executionTimeMs} ms`, tone: "text-amber-600 dark:text-amber-300" };
    else if (result) status = { text: "Failed", tone: "text-rose-500 dark:text-rose-300" };

    const out = clean(result?.stdout);
    const err = result?.error;
    const isExitNote = err?.type === "ExitCode";

    const toolBtn =
        "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300";

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-sm font-medium text-indigo-600 dark:text-indigo-300">// playground</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                        Write and run BornoCode
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="example" className="sr-only">
                        Choose an example
                    </label>
                    <select
                        id="example"
                        value={exampleId}
                        onChange={(e) => loadExample(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-[#0b0b1e] dark:text-slate-300"
                    >
                        {Object.entries(EXAMPLES).map(([id, ex]) => (
                            <option key={id} value={id}>
                                {ex.title}
                            </option>
                        ))}
                    </select>

                    <button type="button" onClick={() => loadExample(exampleId)} className={toolBtn}>
                        <RotateCcw className="size-4" /> Reset
                    </button>
                    <button type="button" onClick={copy} className={toolBtn}>
                        {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                    <button type="button" onClick={download} className={toolBtn}>
                        <Download className="size-4" /> .bc
                    </button>
                    <button
                        type="button"
                        onClick={run}
                        disabled={running}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                        {running ? "Running" : "Run"}
                    </button>
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {/* ---------- Left: editor + stdin ---------- */}
                <div className="flex flex-col gap-4">
                    <section className="overflow-hidden rounded-2xl border border-indigo-500/30 shadow-xl shadow-indigo-900/10">
                        <div className="flex items-center justify-between bg-[#12122b] px-4 py-2.5">
                            <span className="font-mono text-xs text-slate-400">main.bc</span>
                            <span className="font-mono text-[11px] text-slate-500">Tab = 4 spaces</span>
                        </div>
                        <CodeEditor value={code} onChange={setCode} onRun={run} />  
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                        <label htmlFor="stdin" className="font-mono text-xs font-medium text-violet-600 dark:text-violet-300">
                            Standard input (optional)
                        </label>
                        <p className="mt-1 text-xs text-slate-500">
                            For programs that use nite(). One value per line, filled in before you press Run.
                        </p>
                        <textarea
                            id="stdin"
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                            rows={3}
                            spellCheck={false}
                            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 p-2.5 font-mono text-[13px] text-slate-800 outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-black/30 dark:text-slate-200"
                        />
                    </section>
                </div>

                {/* ---------- Right: output ---------- */}
                <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-white/10">
                        <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-300">Output</span>
                        <span aria-live="polite" className={`font-mono text-xs ${status.tone}`}>
                            {status.text}
                        </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-auto p-4">
                        {!result && !problem && !running && (
                            <p className="text-sm text-slate-500">Run your program to see the output here.</p>
                        )}

                        {problem && (
                            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
                                {problem}
                            </div>
                        )}

                        {result && (
                            <>
                                {out ? (
                                    <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-slate-800 dark:text-slate-200">
                                        {out}
                                    </pre>
                                ) : (
                                    result.success && <p className="text-sm text-slate-500">The program finished without printing anything.</p>
                                )}

                                {err && (
                                    <div
                                        className={
                                            isExitNote
                                                ? "rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200"
                                                : "rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-800 dark:text-rose-200"
                                        }
                                    >
                                        <p className="font-mono text-xs font-semibold uppercase tracking-wider">
                                            {err.type === "BornoCodeError" ? "Error" : err.type}
                                            {err.line ? ` on line ${err.line}` : ""}
                                        </p>
                                        <p className="mt-1">{err.message}</p>
                                    </div>
                                )}

                                {clean(result.stderr) && !err?.line && !isExitNote && (
                                    <pre className="whitespace-pre-wrap font-mono text-xs text-rose-600 dark:text-rose-300">
                                        {clean(result.stderr)}
                                    </pre>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}