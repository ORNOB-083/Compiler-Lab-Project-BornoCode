"use client";

import { useRef } from "react";
import { tokenizeLine } from "@/lib/bornocode";

// One colour per token type
const COLORS = {
    keyword: "text-fuchsia-400",
    function: "text-cyan-300",
    string: "text-emerald-300",
    number: "text-amber-300",
    comment: "italic text-slate-500",
    plain: "text-slate-200",
};

const TEXT = "font-mono text-[13px] leading-6";

// A transparent <textarea> sits on top of a highlighted <pre>.
// Both use the same font, padding and scroll position, so they line up exactly.
export default function CodeEditor({ value, onChange, onRun }) {
    const taRef = useRef(null);
    const preRef = useRef(null);
    const gutterRef = useRef(null);

    const lines = value.split("\n");

    function syncScroll() {
        const ta = taRef.current;
        if (!ta) return;
        if (preRef.current) {
            preRef.current.scrollTop = ta.scrollTop;
            preRef.current.scrollLeft = ta.scrollLeft;
        }
        if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
    }

    // execCommand keeps the browser's undo history; fall back to a manual edit if unsupported.
    function insertText(ta, text) {
        ta.focus();
        if (document.execCommand && document.execCommand("insertText", false, text)) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        onChange(value.slice(0, start) + text + value.slice(end));
        requestAnimationFrame(() => {
            ta.selectionStart = ta.selectionEnd = start + text.length;
        });
    }

    function onKeyDown(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            onRun();
            return;
        }
        const ta = e.currentTarget;
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            insertText(ta, "    ");
        } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            // Auto-indent: keep the current indent, add 4 spaces after "{"
            const before = value.slice(0, ta.selectionStart);
            const line = before.slice(before.lastIndexOf("\n") + 1);
            const indent = line.match(/^[ \t]*/)[0];
            const extra = line.trimEnd().endsWith("{") ? "    " : "";
            e.preventDefault();
            insertText(ta, "\n" + indent + extra);
        } else if (e.key === "}" && ta.selectionStart === ta.selectionEnd) {
            // Typing "}" on an empty indented line: step back one level first
            const before = value.slice(0, ta.selectionStart);
            const line = before.slice(before.lastIndexOf("\n") + 1);
            if (line.length >= 4 && /^ +$/.test(line)) {
                e.preventDefault();
                ta.setSelectionRange(ta.selectionStart - 4, ta.selectionStart);
                insertText(ta, "}");
            }
        }
    }

    return (
        <div className="flex h-[420px] overflow-hidden rounded-b-2xl bg-[#0b0b1e]">
            {/* Line numbers */}
            <div
                ref={gutterRef}
                aria-hidden="true"
                className={`w-12 shrink-0 select-none overflow-hidden border-r border-white/10 pb-12 pr-3 pt-3 text-right text-slate-600 ${TEXT}`}
            >
                {lines.map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
            </div>

            <div className="relative flex-1">
                {/* Highlighted copy of the code */}
                <pre
                    ref={preRef}
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre pb-12 pl-3 pr-8 pt-3 ${TEXT}`}
                >
                    {lines.map((line, i) => (
                        <div key={i}>
                            {line === ""
                                ? "\u200b"
                                : tokenizeLine(line).map((tok, j) => (
                                    <span key={j} className={COLORS[tok.type]}>
                                        {tok.text}
                                    </span>
                                ))}
                        </div>
                    ))}
                </pre>

                {/* The real input (text is transparent, caret is visible) */}
                <textarea
                    ref={taRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onScroll={syncScroll}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    wrap="off"
                    aria-label="BornoCode editor"
                    className={`absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre bg-transparent pb-3 pl-3 pr-3 pt-3 text-transparent caret-white outline-none selection:bg-indigo-500/40 ${TEXT}`}
                />
            </div>
        </div>
    );
}