import Link from "next/link";
import CodeBlock from "@/components/docs/CodeBlock";

export const metadata = {
    title: "Keywords & Syntax - BornoCode Docs",
    description: "Complete syntax reference for the BornoCode language.",
};

const KEYWORDS = [
    { kw: "jodi", meaning: "if — run a block when a condition is true", en: "if" },
    { kw: "nahole", meaning: "else — run a block when the condition is false", en: "else" },
    { kw: "jotokhon", meaning: "while — repeat a block while a condition stays true", en: "while" },
    { kw: "sotti", meaning: "true — the boolean true value", en: "true" },
    { kw: "mittha", meaning: "false — the boolean false value", en: "false" },
];

const OPERATORS = [
    { op: "+", desc: "Add" },
    { op: "-", desc: "Subtract (also unary minus)" },
    { op: "*", desc: "Multiply" },
    { op: "/", desc: "Divide" },
    { op: "%", desc: "Remainder (modulo)" },
    { op: "=", desc: "Assign a value to a variable" },
    { op: "==", desc: "Equal to" },
    { op: "!=", desc: "Not equal to" },
    { op: "<", desc: "Less than" },
    { op: "<=", desc: "Less than or equal" },
    { op: ">", desc: "Greater than" },
    { op: ">=", desc: "Greater than or equal" },
    { op: "&&", desc: "Logical and" },
    { op: "||", desc: "Logical or" },
    { op: "!", desc: "Logical not" },
];

function Section({ id, title, children }) {
    return (
        <section id={id} className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            {children}
        </section>
    );
}

export default function KeywordsPage() {
    return (
        <div>
            <p className="font-mono text-sm font-medium text-indigo-600 dark:text-indigo-300">{"// reference"}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Keywords &amp; syntax
            </h1>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                This page lists everything the current interpreter supports. If a feature is not on
                this page, it does not work yet.
            </p>

            <Section id="keywords" title="Keywords">
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 text-left text-slate-600 dark:bg-white/5 dark:text-slate-300">
                                <th className="px-4 py-2.5 font-mono font-semibold">Keyword</th>
                                <th className="px-4 py-2.5 font-semibold">Meaning</th>
                                <th className="px-4 py-2.5 font-semibold">Like English</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                            {KEYWORDS.map((k) => (
                                <tr key={k.kw}>
                                    <td className="px-4 py-2.5 font-mono font-medium text-fuchsia-500 dark:text-fuchsia-300">
                                        {k.kw}
                                    </td>
                                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{k.meaning}</td>
                                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">
                                        {k.en}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>

            <Section id="operators" title="Operators">
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {OPERATORS.map((o) => (
                        <div
                            key={o.op}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                            <code className="w-10 shrink-0 rounded-md bg-indigo-500/10 px-2 py-1 text-center font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                                {o.op}
                            </code>
                            <span className="text-sm text-slate-600 dark:text-slate-400">{o.desc}</span>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Operator precedence follows the usual rules: <code className="font-mono">!</code> and
                    unary <code className="font-mono">-</code> first, then <code className="font-mono">* / %</code>,
                    then <code className="font-mono">+ -</code>, then comparisons, then{" "}
                    <code className="font-mono">&&</code>, then <code className="font-mono">||</code>.
                </p>
            </Section>

            <Section id="values" title="Values">
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>
                        <strong className="text-slate-800 dark:text-slate-200">Numbers</strong> —{" "}
                        <code className="font-mono">42</code>, <code className="font-mono">3.14</code>,{" "}
                        <code className="font-mono">-7</code>
                    </li>
                    <li>
                        <strong className="text-slate-800 dark:text-slate-200">Strings</strong> —{" "}
                        <code className="font-mono">&quot;hello&quot;</code> or{" "}
                        <code className="font-mono">&apos;hello&apos;</code>
                    </li>
                    <li>
                        <strong className="text-slate-800 dark:text-slate-200">Booleans</strong> —{" "}
                        <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">sotti</code> and{" "}
                        <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">mittha</code>
                    </li>
                </ul>
            </Section>

            <Section id="variables" title="Variables">
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Variables are created by assigning a value with <code className="font-mono">=</code>.
                    Every statement ends with a semicolon.
                </p>
                <div className="mt-4">
                    <CodeBlock
                        title="variables.bc"
                        example="variables"
                        code={`name = "Borno";
age = 5;
dekhao(name, "is", age, "years old");`}
                    />
                </div>
            </Section>

            <Section id="conditions" title="Conditions — jodi / nahole">
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">jodi</code> runs a
                    block when its condition is true; <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">nahole</code>{" "}
                    runs a block otherwise. Blocks use curly braces.
                </p>
                <div className="mt-4">
                    <CodeBlock
                        title="conditions.bc"
                        example="conditions"
                        code={`score = 72;

jodi (score >= 80) {
    dekhao("Grade: A");
} nahole {
    jodi (score >= 60) {
        dekhao("Grade: B");
    } nahole {
        dekhao("Grade: C");
    }
}`}
                    />
                </div>
            </Section>

            <Section id="loops" title="Loops — jotokhon">
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    <code className="font-mono text-fuchsia-500 dark:text-fuchsia-300">jotokhon</code> is a
                    while loop: it repeats its block while the condition stays true. Make sure the
                    condition eventually becomes false, or the program will run until the 5-second
                    time limit stops it.
                </p>
                <div className="mt-4">
                    <CodeBlock
                        title="loops.bc"
                        example="loops"
                        code={`i = 1;
jotokhon (i <= 5) {
    dekhao(i);
    i = jog(i, 1);   // add 1 each round
}`}
                    />
                </div>
            </Section>

            <Section id="functions" title="Function calls">
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    BornoCode has 28 built-in functions — no user-defined functions yet. Arguments go
                    inside parentheses, separated by commas. See the{" "}
                    <Link href="/docs/functions" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                        function reference
                    </Link>
                    .
                </p>
                <div className="mt-4">
                    <CodeBlock
                        title="call.bc"
                        code={`dekhao(jog(2, 3));          // 5
dekhao(boro("bornocode"));   // BORNOCODE
dekhao(doro("hello"));       // 5`}
                    />
                </div>
            </Section>

            <Section id="comments" title="Comments">
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Three comment styles are supported. Comments are ignored when the program runs.
                </p>
                <div className="mt-4">
                    <CodeBlock
                        title="comments.bc"
                        code={`// line comment
dekhao("runs");   // this part is ignored

# hash comment also works
dekhao("still runs");

/* block
   comment */
dekhao("done");`}
                    />
                </div>
            </Section>

            <Section id="not-supported" title="Not supported yet">
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>User-defined functions</li>
                    <li>For loops</li>
                    <li>Arrays / lists</li>
                    <li>Break and continue</li>
                    <li>Classes / objects</li>
                </ul>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    These are planned features. Anything not listed on this page should be treated as
                    unsupported.
                </p>
            </Section>
        </div>
    );
}
