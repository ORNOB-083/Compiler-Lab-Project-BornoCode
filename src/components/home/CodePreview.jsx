import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SAMPLE_CODE, SAMPLE_FILE, SAMPLE_OUTPUT, tokenizeLine } from "@/lib/bornocode";

// One colour per token type
const COLORS = {
    keyword: "text-fuchsia-400",
    function: "text-cyan-300",
    string: "text-emerald-300",
    number: "text-amber-300",
    comment: "italic text-slate-500",
    plain: "text-slate-200",
};

export default function CodePreview() {
    const lines = SAMPLE_CODE.split("\n");

    return (
        <div className="overflow-hidden rounded-2xl border border-indigo-500/30 bg-[#0b0b1e] shadow-2xl shadow-indigo-900/30">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-400/80" />
                    <span className="size-3 rounded-full bg-amber-400/80" />
                    <span className="size-3 rounded-full bg-emerald-400/80" />
                    <span className="ml-3 font-mono text-xs text-slate-400">{SAMPLE_FILE}</span>
                </div>
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                    Preview
                </span>
            </div>

            {/* Code */}
            <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6">
                <code>
                    {lines.map((line, i) => (
                        <div key={i} className="flex">
                            <span className="mr-4 w-5 shrink-0 select-none text-right text-slate-600">{i + 1}</span>
                            <span className="whitespace-pre">
                                {tokenizeLine(line).map((tok, j) => (
                                    <span key={j} className={COLORS[tok.type]}>
                                        {tok.text}
                                    </span>
                                ))}
                            </span>
                        </div>
                    ))}
                </code>
            </pre>

            {/* Output */}
            <div className="border-t border-white/10 bg-black/30 px-4 py-3">
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                    Output (sample)
                </p>
                <pre className="font-mono text-[13px] leading-6 text-slate-300">{SAMPLE_OUTPUT}</pre>
            </div>

            {/* Honest label: this preview does not run code */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-xs">
                <span className="text-slate-500">Static preview. It does not run code.</span>
                <Link
                    href="/playground"
                    className="flex items-center gap-1 font-medium text-indigo-300 hover:text-indigo-200"
                >
                    Open Playground <ArrowRight className="size-3.5" />
                </Link>
            </div>
        </div>
    );
}