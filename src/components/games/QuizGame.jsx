"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, X } from "lucide-react";

// Shared quiz engine for the mini-games: shows a prompt (optional code),
// 4 options, immediate feedback, running score, and a final summary.
export default function QuizGame({ questions, promptLabel = "Question" }) {
    const [idx, setIdx] = useState(0);
    const [picked, setPicked] = useState(null); // {oi, correct} | null
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const router = useRouter();

    const q = questions[idx];
    const last = idx === questions.length - 1;

    function choose(oi) {
        if (picked) return;
        const correct = oi === q.answer;
        setPicked({ oi, correct });
        if (correct) setScore((s) => s + 1);
    }

    function next() {
        if (last) setDone(true);
        else {
            setIdx((i) => i + 1);
            setPicked(null);
        }
    }

    function restart() {
        setIdx(0);
        setPicked(null);
        setScore(0);
        setDone(false);
    }

    if (done) {
        const pct = Math.round((score / questions.length) * 100);
        const msg =
            pct === 100 ? "Perfect! Flawless." :
            pct >= 75 ? "Great job — almost perfect." :
            pct >= 50 ? "Good effort — review the explanations." :
            "Keep practising — the lessons will help.";
        return (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-8 text-center">
                <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-300">{score}/{questions.length}</p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">{msg}</p>
                <div className="mt-6 flex justify-center gap-3">
                    <button onClick={restart} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-400 dark:border-white/10 dark:text-slate-300">
                        <RotateCcw className="size-4" /> Play again
                    </button>
                    <button onClick={() => router.push("/games")} className="rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white">
                        More games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {promptLabel} {idx + 1} / {questions.length} · Score {score}
                </p>
                <div className="flex gap-1">
                    {questions.map((_, i) => (
                        <span key={i} className={`h-1.5 w-6 rounded-full ${i < idx ? "bg-emerald-500" : i === idx ? "bg-indigo-500" : "bg-slate-300 dark:bg-white/15"}`} />
                    ))}
                </div>
            </div>

            {q.code !== undefined && (
                <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-[#0d0d1f] p-4 font-mono text-[13px] leading-6 text-slate-200">
                    {q.code}
                </pre>
            )}
            {q.prompt && <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{q.prompt}</p>}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                    let cls = "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-300";
                    if (picked) {
                        if (oi === q.answer) cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                        else if (oi === picked.oi) cls = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300";
                        else cls += " opacity-50";
                    }
                    return (
                        <button key={oi} type="button" disabled={!!picked} onClick={() => choose(oi)}
                            className={`flex items-center gap-2 whitespace-pre-line rounded-lg border px-4 py-3 text-left text-sm transition-colors ${cls}`}>
                            {picked && oi === q.answer && <Check className="size-4 shrink-0 text-emerald-500" />}
                            {picked && oi === picked.oi && oi !== q.answer && <X className="size-4 shrink-0 text-rose-500" />}
                            {opt}
                        </button>
                    );
                })}
            </div>

            {picked && (
                <div className="mt-4">
                    <p className={`rounded-xl border p-3 text-sm ${picked.correct ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200" : "border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-200"}`}>
                        {picked.correct ? "Correct! " : "Not quite. "}{q.explain}
                    </p>
                    <button onClick={next} className="mt-3 rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 px-5 py-2 text-sm font-semibold text-white">
                        {last ? "See results" : "Next question"}
                    </button>
                </div>
            )}
        </div>
    );
}
