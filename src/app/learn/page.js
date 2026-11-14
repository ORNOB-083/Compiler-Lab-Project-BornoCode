import Link from "next/link";
import { ArrowRight, Clock, Map } from "lucide-react";
import { LESSONS, MODULES } from "@/lib/lessons";

export const metadata = {
    title: "Learn - BornoCode",
    description: "Guided beginner lessons for the BornoCode programming language.",
};

export default function LearnPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <p className="font-mono text-sm font-medium text-violet-600 dark:text-violet-300">{"// learn"}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Learn BornoCode step by step
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
                Short lessons that each end with a runnable example and a quick quiz.
                Work through them in order — every code block is verified against the real interpreter.
            </p>

            <div className="mt-10 space-y-12">
                {MODULES.map((m, mi) => {
                    const lessons = LESSONS.filter((l) => l.module === m.id);
                    if (!lessons.length) return null;
                    return (
                        <section key={m.id}>
                            <div className="flex items-baseline gap-3">
                                <span className="grid size-8 place-items-center rounded-lg bg-linear-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
                                    {mi + 1}
                                </span>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{m.title}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{m.blurb}</p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {lessons.map((l, li) => {
                                    const globalIdx = LESSONS.indexOf(l) + 1;
                                    return (
                                        <Link
                                            key={l.slug}
                                            href={`/learn/${l.slug}`}
                                            className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-400/60 dark:border-white/10 dark:bg-white/[0.03]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="font-mono text-sm text-slate-400">
                                                    {String(globalIdx).padStart(2, "0")}
                                                </span>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                                                        {l.title}
                                                    </h3>
                                                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        <Clock className="size-3.5" /> {l.minutes} min · {l.objectives.length} goals · quiz
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight className="size-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-500 dark:text-slate-600" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="mt-14 flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5">
                <Map className="size-6 shrink-0 text-indigo-500" />
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    Finished the lessons? Head to the{" "}
                    <Link href="/games" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                        games section
                    </Link>{" "}
                    to practise keywords and trace code — or browse the full{" "}
                    <Link href="/docs" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                        documentation
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
