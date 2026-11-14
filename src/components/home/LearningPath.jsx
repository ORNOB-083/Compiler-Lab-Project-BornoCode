// Only topics the interpreter really supports are marked ready.
const STEPS = [
    { title: "First Program", hint: "dekhao()", color: "text-indigo-600 dark:text-indigo-300", ring: "border-indigo-400/50" },
    { title: "Variables", hint: "x = 10;", color: "text-violet-600 dark:text-violet-300", ring: "border-violet-400/50" },
    { title: "Conditions", hint: "jodi / nahole", color: "text-fuchsia-600 dark:text-fuchsia-300", ring: "border-fuchsia-400/50" },
    { title: "Loops", hint: "jotokhon", color: "text-cyan-600 dark:text-cyan-300", ring: "border-cyan-400/50" },
    { title: "Built-in Functions", hint: "jog, gun, ulto ...", color: "text-emerald-600 dark:text-emerald-300", ring: "border-emerald-400/50" },
    { title: "Your Own Functions", hint: "planned", color: "text-slate-500", ring: "border-slate-300 dark:border-white/10", soon: true },
];

export default function LearningPath() {
    return (
        <section className="border-y border-slate-200 bg-slate-100/60 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <p className="font-mono text-sm font-medium text-cyan-600 dark:text-cyan-300">// learning path</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    From your first line to real programs
                </h2>

                <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    {STEPS.map((s, i) => (
                        <li
                            key={s.title}
                            className={`rounded-2xl border bg-white p-4 dark:bg-white/[0.03] ${s.ring} ${s.soon ? "opacity-70" : ""}`}
                        >
                            <span className={`font-mono text-xs ${s.color}`}>{String(i + 1).padStart(2, "0")}</span>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{s.title}</p>
                            <p className={`mt-1 font-mono text-xs ${s.color}`}>{s.hint}</p>
                            {s.soon && (
                                <span className="mt-3 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
                                    Coming soon
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}