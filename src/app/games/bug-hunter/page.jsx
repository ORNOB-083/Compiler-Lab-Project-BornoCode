import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuizGame from "@/components/games/QuizGame";
import { BUG_QUESTIONS } from "@/lib/games";

export const metadata = { title: "Bug Hunter - BornoCode Games" };

export default function BugHunterPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <Link href="/games" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300">
                <ArrowLeft className="size-4" /> All games
            </Link>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Bug Hunter</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
                Every program below has exactly one bug — and every bug produces a real error in the
                interpreter. Pick what&rsquo;s wrong.
            </p>
            <div className="mt-6">
                <QuizGame questions={BUG_QUESTIONS} promptLabel="Program" />
            </div>
        </div>
    );
}
