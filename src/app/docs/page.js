import Link from "next/link";
import { ArrowRight, BookOpen, Braces, Keyboard, Play } from "lucide-react";

export const metadata = {
    title: "Documentation - BornoCode",
    description: "Learn BornoCode: getting started, keywords, syntax and built-in functions.",
};

const CARDS = [
    {
        href: "/docs/getting-started",
        icon: Play,
        title: "Getting Started",
        text: "Run your first BornoCode program in the browser in under a minute.",
    },
    {
        href: "/docs/keywords",
        icon: Keyboard,
        title: "Keywords & Syntax",
        text: "Every keyword, operator, comment style and statement the language supports.",
    },
    {
        href: "/docs/functions",
        icon: Braces,
        title: "Built-in Functions",
        text: "All 28 functions: math, strings, dates, input/output and fun extras.",
    },
];

export default function DocsPage() {
    return (
        <div>
            <p className="font-mono text-sm font-medium text-indigo-600 dark:text-indigo-300">{"// docs"}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                BornoCode documentation
            </h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
                BornoCode is a small Bangla-inspired programming language. This documentation only
                describes what the current interpreter actually supports — nothing is documented
                before it works.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {CARDS.map((c) => (
                    <Link
                        key={c.href}
                        href={c.href}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-400/60 dark:border-white/10 dark:bg-white/[0.03]"
                    >
                        <div className="grid size-10 place-items-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                            <c.icon className="size-5" />
                        </div>
                        <h2 className="mt-4 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                            {c.title}
                            <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {c.text}
                        </p>
                    </Link>
                ))}
            </div>

            <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <BookOpen className="size-5 text-violet-500" /> What BornoCode can do today
                </h2>
                <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-400">
                    <li>• Numbers, strings and true/false values</li>
                    <li>• Variables with <code className="font-mono text-indigo-600 dark:text-indigo-300">=</code> assignment</li>
                    <li>• Arithmetic, comparison and logic operators</li>
                    <li>• Conditions with <code className="font-mono">jodi</code> / <code className="font-mono">nahole</code></li>
                    <li>• Loops with <code className="font-mono">jotokhon</code></li>
                    <li>• 28 built-in functions for math, text, dates and fun</li>
                    <li>• User input with <code className="font-mono">nite()</code></li>
                    <li>• Output with <code className="font-mono">dekhao()</code></li>
                </ul>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Not yet supported: user-defined functions, for loops, arrays and break/continue.
                    These are planned — check back as the language grows.
                </p>
            </section>
        </div>
    );
}
