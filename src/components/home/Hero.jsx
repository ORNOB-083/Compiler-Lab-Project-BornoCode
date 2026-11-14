import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import CodePreview from "./CodePreview";

// Decorative floating snippets (real BornoCode names), hidden from screen readers
const FLOATERS = [
    { text: "jog(2, 3)", pos: "top-24 left-[44%]", delay: "0s", color: "text-indigo-500/60 dark:text-indigo-300/50" },
    { text: "dekhao()", pos: "bottom-6 left-[42%]", delay: "-2s", color: "text-fuchsia-500/60 dark:text-fuchsia-300/50" },
    { text: "jodi", pos: "top-12 right-[8%]", delay: "-4s", color: "text-violet-500/60 dark:text-violet-300/50" },
    { text: "nach()", pos: "bottom-10 right-[12%]", delay: "-1s", color: "text-cyan-500/60 dark:text-cyan-300/50" },
];

export default function Hero() {
    return (
        <section className="relative isolate overflow-hidden">
            {/* Aurora blobs */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-24 -top-32 size-96 animate-[aurora-1_18s_ease-in-out_infinite] rounded-full bg-indigo-500/25 blur-3xl dark:bg-indigo-600/30" />
                <div className="absolute right-0 top-10 size-[28rem] animate-[aurora-2_22s_ease-in-out_infinite] rounded-full bg-fuchsia-500/20 blur-3xl dark:bg-fuchsia-600/25" />
                <div className="absolute bottom-0 left-1/3 size-72 animate-[aurora-1_26s_ease-in-out_infinite] rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/15" />
                {FLOATERS.map((f) => (
                    <span
                        key={f.text}
                        style={{ animationDelay: f.delay }}
                        className={`absolute hidden animate-[float-code_7s_ease-in-out_infinite] font-mono text-sm lg:block ${f.pos} ${f.color}`}
                    >
                        {f.text}
                    </span>
                ))}
            </div>

            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-mono text-xs text-indigo-600 dark:text-indigo-300">
                        <Terminal className="size-3.5" />
                        Bangla-inspired programming language
                    </span>

                    <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                        Programming, in a language that feels{" "}
                        <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                            closer to home.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
                        Explore BornoCode, a Bangla-inspired programming language. Learn the basics, write your first
                        program and experiment in the online playground.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/playground"
                            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:brightness-110"
                        >
                            Start Coding <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="/docs"
                            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300"
                        >
                            Explore Documentation
                        </Link>
                    </div>

                    <dl className="mt-10 flex gap-8 font-mono text-sm">
                        <div>
                            <dt className="text-xs text-slate-500">Built-in functions</dt>
                            <dd className="mt-1 text-2xl font-bold text-cyan-600 dark:text-cyan-300">28</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-500">Engine</dt>
                            <dd className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-300">C++</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-500">File type</dt>
                            <dd className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-300">.bc</dd>
                        </div>
                    </dl>
                </div>

                <CodePreview />
            </div>
        </section>
    );
}