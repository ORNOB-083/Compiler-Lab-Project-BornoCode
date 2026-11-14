import Link from "next/link";
import { BookOpen, Code2, ExternalLink, Gamepad2, Heart, Play, Terminal } from "lucide-react";
import { GITHUB_URL } from "@/lib/bornocode";

export const metadata = {
    title: "About - BornoCode",
    description: "What BornoCode is, why it exists and what you can do with it today.",
};

const VALUES = [
    {
        icon: BookOpen,
        title: "Learn by doing",
        text: "Every concept on this site connects to a program you can run immediately — no setup, no install.",
    },
    {
        icon: Terminal,
        title: "A real language engine",
        text: "Programs run on an actual C++ interpreter, not a simulation. What you learn here is what the language does.",
    },
    {
        icon: Code2,
        title: "Honest documentation",
        text: "Only verified, working features are documented. Planned features are labelled as such.",
    },
];

const TIMELINE = [
    { phase: "Interpreter", text: "Lexer, parser and tree-walking interpreter written in C++ with 28 built-in functions." },
    { phase: "Playground", text: "A secure execution API and an online editor so anyone can run BornoCode in the browser." },
    { phase: "Learn & Games", text: "Guided lessons, quizzes and mini-games — coming soon." },
];

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <p className="font-mono text-sm font-medium text-indigo-600 dark:text-indigo-300">{"// about"}</p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Programming, in a language that feels closer to home.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                BornoCode is a Bangla-inspired programming language and an interactive learning
                platform. It exists to make programming feel less foreign to beginners — especially
                Bangla-speaking learners — by using familiar words like{" "}
                <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">jodi</code> (if),{" "}
                <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">jotokhon</code> (while)
                and <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">dekhao</code> (print)
                instead of only English keywords.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {VALUES.map((v) => (
                    <div
                        key={v.title}
                        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
                    >
                        <div className="grid size-11 place-items-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-300">
                            <v.icon className="size-5" />
                        </div>
                        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">{v.title}</h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {v.text}
                        </p>
                    </div>
                ))}
            </div>

            <h2 className="mt-14 text-2xl font-bold text-slate-900 dark:text-white">Where the project is</h2>
            <div className="mt-6 space-y-0">
                {TIMELINE.map((t, i) => (
                    <div key={t.phase} className="flex gap-5">
                        <div className="flex flex-col items-center">
                            <span
                                className={`mt-1.5 size-3 rounded-full ${
                                    i < 2 ? "bg-emerald-500" : "bg-amber-400"
                                }`}
                            />
                            {i < TIMELINE.length - 1 && (
                                <span className="w-px flex-1 bg-slate-200 dark:bg-white/10" />
                            )}
                        </div>
                        <div className="pb-8">
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                {t.phase}
                                {i === 2 && (
                                    <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                                        Planned
                                    </span>
                                )}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                {t.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110"
                >
                    <Play className="size-4" /> Try the Playground
                </Link>
                <Link
                    href="/docs"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300"
                >
                    <BookOpen className="size-4" /> Read the Docs
                </Link>
                <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300"
                >
                    <ExternalLink className="size-4" /> Source on GitHub
                </a>
            </div>

            <p className="mt-14 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Heart className="size-4 text-fuchsia-500" />
                BornoCode is a Compiler Lab project — built with C++17 and Next.js.
                <Gamepad2 className="ml-2 size-4 text-indigo-400" />
            </p>
        </div>
    );
}
