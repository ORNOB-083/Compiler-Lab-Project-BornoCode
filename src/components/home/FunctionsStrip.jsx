import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNCTIONS } from "@/lib/bornocode";

export default function FunctionsStrip() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl">
                    <p className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-300">// the language</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {FUNCTIONS.length} built-in functions, Bangla names
                    </h2>
                    <p className="mt-3 text-slate-600 dark:text-slate-400">
                        Every standard function has a BornoCode name. Hover a chip to see what it does.
                    </p>
                </div>
                <Link
                    href="/docs"
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                    Read the docs <ArrowRight className="size-4" />
                </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2.5">
                {FUNCTIONS.map((f) => (
                    <li
                        key={f.name}
                        title={f.desc}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm hover:border-indigo-400/60 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-indigo-400/50"
                    >
                        <span className="text-slate-500">{f.english}</span>
                        <span className="text-violet-500">&rarr;</span>
                        <span className="font-semibold text-cyan-600 dark:text-cyan-300">{f.name}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}