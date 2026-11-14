import { FUNCTIONS } from "@/lib/bornocode";
import CodeBlock from "@/components/docs/CodeBlock";

export const metadata = {
    title: "Built-in Functions - BornoCode Docs",
    description: "Reference for all 28 BornoCode built-in functions.",
};

const GROUPS = [
    {
        title: "Math",
        blurb: "Numbers in, numbers out.",
        names: ["jog", "biyog", "gun", "vag", "shokti", "mulmul", "vagsesh", "nishchit", "jorbhaggo"],
    },
    {
        title: "Strings",
        blurb: "Text helpers for common string tasks.",
        names: ["jukto", "doro", "boro", "chhoto", "ulto"],
    },
    {
        title: "Dates & time",
        blurb: "Current time, dates and date math. Dates are text like “2026-09-05”.",
        names: ["ekhon", "tarikh", "dinjukto", "porthokko"],
    },
    {
        title: "Fun",
        blurb: "Playful extras — safe to ignore if you are here to learn.",
        names: ["nach", "hash", "gaan", "rong", "chinho"],
    },
    {
        title: "Input, output & program",
        blurb: "How programs talk to the user and end.",
        names: ["dekhao", "nite", "ber", "rakho", "tule"],
    },
];

const BY_NAME = Object.fromEntries(FUNCTIONS.map((f) => [f.name, f]));

const DEMO = `dekhao("sum      :", jog(4, 5));
dekhao("power    :", shokti(2, 10));
dekhao("concat   :", jukto("Born", "o", "Code"));
dekhao("uppercase:", boro("hello"));
dekhao("today    :", tarikh());`;

export default function FunctionsPage() {
    return (
        <div>
            <p className="font-mono text-sm font-medium text-indigo-600 dark:text-indigo-300">{"// reference"}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Built-in functions
            </h1>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                BornoCode ships with {FUNCTIONS.length} built-in functions. Call them like{" "}
                <code className="font-mono">name(arg1, arg2)</code>. The number of arguments each
                function accepts is shown in the table.
            </p>

            <div className="mt-6">
                <CodeBlock title="functions-demo.bc" code={DEMO} />
            </div>

            {GROUPS.map((g) => (
                <section key={g.title} className="mt-12">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{g.title}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{g.blurb}</p>
                    <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                        <table className="w-full min-w-[520px] text-sm">
                            <thead>
                                <tr className="bg-slate-100 text-left text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                    <th className="px-4 py-2.5 font-mono font-semibold">BornoCode</th>
                                    <th className="px-4 py-2.5 font-semibold">English name</th>
                                    <th className="px-4 py-2.5 font-semibold">What it does</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                                {g.names.map((n) => {
                                    const f = BY_NAME[n];
                                    if (!f) return null;
                                    return (
                                        <tr key={n}>
                                            <td className="px-4 py-2.5 font-mono font-medium text-cyan-600 dark:text-cyan-300">
                                                {f.name}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                                                {f.english}
                                            </td>
                                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                                                {f.desc}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            ))}

            <section className="mt-12 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                <h2 className="font-semibold text-amber-800 dark:text-amber-200">A few things to know</h2>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-amber-800 dark:text-amber-200/90">
                    <li><code className="font-mono">vag(a, 0)</code> raises a “Division by zero” error — guard it with a condition if needed.</li>
                    <li><code className="font-mono">nite()</code> reads one line from the Standard Input box in the Playground.</li>
                    <li><code className="font-mono">ber()</code> ends the program immediately; the exit code is optional.</li>
                    <li><code className="font-mono">dekhao()</code> accepts any number of arguments and prints them separated by spaces.</li>
                </ul>
            </section>
        </div>
    );
}
