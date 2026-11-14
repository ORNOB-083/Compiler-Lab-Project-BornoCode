import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuizGame from "@/components/games/QuizGame";
import { KEYWORD_ROUNDS } from "@/lib/games";

export const metadata = { title: "Keyword Master - BornoCode Games" };

export default function KeywordMasterPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <Link href="/games" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300">
                <ArrowLeft className="size-4" /> All games
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Keyword Master</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Do you remember what each BornoCode keyword and built-in function does?
            </p>
            <div className="mt-6">
                <QuizGame questions={KEYWORD_ROUNDS} promptLabel="Round" />
            </div>
        </div>
    );
}
