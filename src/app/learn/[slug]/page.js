import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Target } from "lucide-react";
import CodeBlock from "@/components/docs/CodeBlock";
import LessonQuiz from "@/components/learn/LessonQuiz";
import { LESSONS, MODULES, getLesson } from "@/lib/lessons";

export function generateStaticParams() {
    return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const lesson = getLesson(slug);
    return { title: lesson ? `${lesson.title} - BornoCode Learn` : "Lesson - BornoCode" };
}

const INLINE = /`([^`]+)`/g;

// Renders **bold** and `code` inside plain text.
function Rich({ text }) {
    const parts = [];
    let rest = text;
    let key = 0;
    while (rest.length) {
        const bold = rest.match(/\*\*([^*]+)\*\*/);
        const code = rest.match(INLINE);
        const bi = bold ? rest.indexOf(bold[0]) : -1;
        const ci = code ? rest.indexOf(code[0]) : -1;
        let idx = -1;
        let len = 0;
        let node = null;
        if (bi !== -1 && (ci === -1 || bi < ci)) {
            idx = bi; len = bold[0].length;
            node = <strong key={key++} className="font-semibold text-slate-900 dark:text-white">{bold[1]}</strong>;
        } else if (ci !== -1) {
            idx = ci; len = code[0].length;
            node = <code key={key++} className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[0.85em] text-indigo-700 dark:bg-white/10 dark:text-indigo-300">{code[1]}</code>;
        } else {
            parts.push(rest);
            break;
        }
        parts.push(rest.slice(0, idx), node);
        rest = rest.slice(idx + len);
    }
    return <>{parts}</>;
}

function renderList(text) {
    return text.split(/\*\*([^*]+)\*\*/).map((part, i) =>
        i % 2 ? <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part}</strong> : part
    );
}

export default async function LessonPage({ params }) {
    const { slug } = await params;
    const lesson = getLesson(slug);
    if (!lesson) notFound();

    const mod = MODULES.find((m) => m.id === lesson.module);
    const idx = LESSONS.indexOf(lesson);
    const prev = LESSONS[idx - 1];
    const next = LESSONS[idx + 1];

    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <Link
                href="/learn"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
            >
                <ArrowLeft className="size-4" /> All lessons
            </Link>

            <p className="mt-4 font-mono text-sm font-medium text-violet-600 dark:text-violet-300">
                {mod?.title} · Lesson {idx + 1} of {LESSONS.length}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {lesson.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="size-4" /> About {lesson.minutes} minutes
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Target className="size-4 text-indigo-500" /> By the end you can:
                </p>
                <ul className="mt-3 space-y-1.5">
                    {lesson.objectives.map((o) => (
                        <li key={o} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-indigo-400" />
                            <Rich text={o} />
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 space-y-8">
                {lesson.blocks.map((b, i) => {
                    if (b.type === "p")
                        return (
                            <p key={i} className="leading-relaxed text-slate-700 dark:text-slate-300">
                                <Rich text={b.text} />
                            </p>
                        );
                    if (b.type === "h3")
                        return (
                            <h2 key={i} className="text-xl font-bold text-slate-900 dark:text-white">
                                {b.text}
                            </h2>
                        );
                    if (b.type === "list")
                        return (
                            <ul key={i} className="space-y-2">
                                {b.items.map((item, j) => (
                                    <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                                        <Rich text={item} />
                                    </li>
                                ))}
                            </ul>
                        );
                    if (b.type === "code")
                        return <CodeBlock key={i} title={b.title} code={b.code} example={b.example} />;
                    if (b.type === "practice")
                        return (
                            <div key={i} className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5">
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                    Try it yourself
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-emerald-800/90 dark:text-emerald-200/90">
                                    <Rich text={b.text} />
                                </p>
                            </div>
                        );
                    return null;
                })}
            </div>

            <LessonQuiz questions={lesson.quiz} />

            <div className="mt-10 flex items-center justify-between gap-4">
                {prev ? (
                    <Link
                        href={`/learn/${prev.slug}`}
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300"
                    >
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                        {prev.title}
                    </Link>
                ) : <span />}
                {next ? (
                    <Link
                        href={`/learn/${next.slug}`}
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-right text-sm font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300"
                    >
                        {next.title}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                ) : (
                    <Link
                        href="/games"
                        className="group flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110"
                    >
                        Play the games
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}
            </div>
        </div>
    );
}
