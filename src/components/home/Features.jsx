import { Bug, BookOpen, Target, Terminal } from "lucide-react";

// Full class strings per card so Tailwind can see them (each card has its own colour)
const FEATURES = [
    {
        icon: Terminal,
        title: "Write Code",
        text: "Experiment with BornoCode right in the browser and see real output.",
        iconBox: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
        hover: "hover:border-indigo-400/60",
    },
    {
        icon: BookOpen,
        title: "Learn Syntax",
        text: "Explore keywords and functions with short, working examples.",
        iconBox: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
        hover: "hover:border-violet-400/60",
    },
    {
        icon: Target,
        title: "Practice",
        text: "Test your understanding with quizzes and mini-games.",
        iconBox: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300",
        hover: "hover:border-fuchsia-400/60",
        soon: true,
    },
    {
        icon: Bug,
        title: "Understand Errors",
        text: "Clear messages with line numbers help you learn from every mistake.",
        iconBox: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
        hover: "hover:border-cyan-400/60",
    },
];

export default function Features() {
    return (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-2xl">
                <p className="font-mono text-sm font-medium text-violet-600 dark:text-violet-300">// what you can do</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Everything a beginner needs
                </h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((f) => (
                    <div
                        key={f.title}
                        className={`rounded-2xl border border-slate-200 bg-white p-6 transition-colors dark:border-white/10 dark:bg-white/[0.03] ${f.hover}`}
                    >
                        <div className={`grid size-11 place-items-center rounded-xl ${f.iconBox}`}>
                            <f.icon className="size-5" />
                        </div>
                        <h3 className="mt-5 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                            {f.title}
                            {f.soon && (
                                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                                    Soon
                                </span>
                            )}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}