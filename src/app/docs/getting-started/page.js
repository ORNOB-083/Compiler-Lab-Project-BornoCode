import Link from "next/link";
import CodeBlock from "@/components/docs/CodeBlock";

export const metadata = {
    title: "Getting Started - BornoCode Docs",
    description: "Run your first BornoCode program in the online playground.",
};

const STEPS = [
    {
        title: "Open the Playground",
        text: "Click “Start Coding” in the navigation, or go straight to the Playground page. No installation is needed — everything runs in your browser.",
    },
    {
        title: "Load a starter program",
        text: "Pick an example from the dropdown (Hello World is selected by default). You can also write your own code or reset at any time.",
    },
    {
        title: "Click Run",
        text: "Press the Run button, or use Ctrl + Enter inside the editor. The program runs on the server and the output appears in the panel on the right.",
    },
    {
        title: "Read the output",
        text: "Normal output is shown in the Output panel. Errors appear in a separate box with the line number, so you always know where to look.",
    },
    {
        title: "Change something and run again",
        text: "Edit a value, a string or a condition and press Run again. The fastest way to learn is to break things on purpose — the error messages are written for beginners.",
    },
];

const FIRST_PROGRAM = `// Your first BornoCode program
dekhao("Hello, BornoCode!");
dekhao("2 + 3 =", jog(2, 3));
nach();`;

const FIRST_OUTPUT = `Hello, BornoCode!
2 + 3 = 5
(dancing emoji)`;

export default function GettingStartedPage() {
    return (
        <div>
            <p className="font-mono text-sm font-medium text-indigo-600 dark:text-indigo-300">{"// getting started"}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Run your first program
            </h1>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                BornoCode programs are plain text files with a <code className="font-mono">.bc</code>{" "}
                extension. The Playground writes the file for you — you only type code.
            </p>

            <ol className="mt-8 space-y-5">
                {STEPS.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
                            {i + 1}
                        </span>
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">{s.title}</h2>
                            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.text}</p>
                        </div>
                    </li>
                ))}
            </ol>

            <h2 className="mt-12 text-xl font-bold text-slate-900 dark:text-white">Your first program</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                This is the default example in the Playground. Here is what each line does:
            </p>

            <div className="mt-4">
                <CodeBlock code={FIRST_PROGRAM} title="hello.bc" example="hello" />
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                    <code className="font-mono text-indigo-600 dark:text-indigo-300">{"// ..."}</code>{" "}
                    — a comment. Everything after <code className="font-mono">{"//"}</code> on that line is ignored.
                </li>
                <li>
                    <code className="font-mono text-indigo-600 dark:text-indigo-300">dekhao(...)</code>{" "}
                    — prints its arguments to the screen, separated by spaces.
                </li>
                <li>
                    <code className="font-mono text-indigo-600 dark:text-indigo-300">jog(2, 3)</code>{" "}
                    — the built-in <em>sum</em> function; it returns 5.
                </li>
                <li>
                    Every statement ends with a <code className="font-mono">;</code>.
                </li>
            </ul>

            <h3 className="mt-8 font-semibold text-slate-900 dark:text-white">Expected output</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-800 bg-[#0d0d1f] p-4 font-mono text-[13px] leading-6 text-emerald-300">
                {FIRST_OUTPUT}
            </pre>

            <div className="mt-10 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5">
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Next:</strong> learn the five
                    keywords and every operator in the{" "}
                    <Link href="/docs/keywords" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                        Keywords &amp; Syntax
                    </Link>{" "}
                    reference, or browse all{" "}
                    <Link href="/docs/functions" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">
                        built-in functions
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
