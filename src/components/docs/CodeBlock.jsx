import { tokenizeLine } from "@/lib/bornocode";

const COLORS = {
    keyword: "text-fuchsia-400",
    function: "text-cyan-300",
    string: "text-emerald-300",
    number: "text-amber-300",
    comment: "italic text-slate-500",
    plain: "text-slate-200",
};

// Renders a small highlighted BornoCode snippet for documentation pages.
export default function CodeBlock({ code, title, example }) {
    const lines = code.replace(/\n$/, "").split("\n");

    return (
        <figure className="overflow-hidden rounded-xl border border-slate-800 bg-[#0d0d1f]">
            {title && (
                <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                    <span className="font-mono text-xs text-slate-400">{title}</span>
                    {example && (
                        <a
                            href={`/playground?example=${example}`}
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            Try in Playground →
                        </a>
                    )}
                </figcaption>
            )}
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
                <code>
                    {lines.map((line, i) => (
                        <span key={i} className="block">
                            {tokenizeLine(line).map((t, j) => (
                                <span key={j} className={COLORS[t.type]}>
                                    {t.text}
                                </span>
                            ))}
                            {"\n"}
                        </span>
                    ))}
                </code>
            </pre>
        </figure>
    );
}
