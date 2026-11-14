import Link from "next/link";
import { ArrowRight, Bug, Eye, Keyboard, Clock } from "lucide-react";
import { GAMES } from "@/lib/games";

export const metadata = { title: "Games - BornoCode", description: "Mini-games to practise BornoCode." };

const ICONS = { keyboard: Keyboard, eye: Eye, bug: Bug };

export default function GamesPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <p className="font-mono text-sm font-medium text-fuchsia-600 dark:text-fuchsia-300">{"// games"}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Practice games</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-400">
                Short sessions that reinforce what you learned. Every question uses real BornoCode
                syntax — verified against the interpreter.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {GAMES.map((g) => {
                    const Icon = ICONS[g.icon];
                    return (
                        <Link key={g.slug} href={`/games/${g.slug}`}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-fuchsia-400/60 dark:border-white/10 dark:bg-white/[0.03]">
                            <div className="grid size-11 place-items-center rounded-xl bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300">
                                <Icon className="size-5" />
                            </div>
                            <h2 className="mt-4 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                                {g.title}
                                <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{g.tagline}</p>
                            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 font-semibold text-indigo-600 dark:text-indigo-300">{g.difficulty}</span>
                                <span className="flex items-center gap-1"><Clock className="size-3" />{g.minutes} min</span>
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
