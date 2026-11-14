"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

// Short multiple-choice quiz shown at the end of each lesson.
export default function LessonQuiz({ questions }) {
    const [answers, setAnswers] = useState({}); // qIndex -> chosen option index
    const [checked, setChecked] = useState({}); // qIndex -> bool

    const total = questions.length;
    const score = questions.reduce((n, q, i) => n + (checked[i] && answers[i] === q.answer ? 1 : 0), 0);
    const allChecked = questions.every((_, i) => checked[i]);

    function choose(qi, oi) {
        if (checked[qi]) return;
        setAnswers((a) => ({ ...a, [qi]: oi }));
        setChecked((c) => ({ ...c, [qi]: true }));
    }

    return (
        <div className="mt-10 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Quick quiz</h3>
                {allChecked && (
                    <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                        Score: {score}/{total}
                    </span>
                )}
            </div>

            <div className="mt-5 space-y-6">
                {questions.map((q, qi) => {
                    const isChecked = !!checked[qi];
                    const picked = answers[qi];
                    return (
                        <div key={qi}>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {qi + 1}. {q.q}
                            </p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {q.options.map((opt, oi) => {
                                    let cls =
                                        "border-slate-300 bg-white text-slate-700 hover:border-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-300";
                                    if (isChecked) {
                                        if (oi === q.answer)
                                            cls = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                                        else if (oi === picked)
                                            cls = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300";
                                        else cls += " opacity-50";
                                    }
                                    return (
                                        <button
                                            key={oi}
                                            type="button"
                                            disabled={isChecked}
                                            onClick={() => choose(qi, oi)}
                                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${cls}`}
                                        >
                                            {isChecked && oi === q.answer && <Check className="size-4 shrink-0 text-emerald-500" />}
                                            {isChecked && oi === picked && oi !== q.answer && <X className="size-4 shrink-0 text-rose-500" />}
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {isChecked && (
                                <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    {q.explain}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
