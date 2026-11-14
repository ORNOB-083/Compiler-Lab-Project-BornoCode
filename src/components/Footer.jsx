import Link from "next/link";
import { GITHUB_URL } from "@/lib/bornocode";

const linkClass =
  "text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">
            Borno<span className="text-indigo-500 dark:text-indigo-400">Code</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A Bangla-inspired programming language for beginners. Built as a Compiler Lab project.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-300">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/playground" className={linkClass}>
                Playground
              </Link>
            </li>
            <li>
              <Link href="/docs" className={linkClass}>
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass}>
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Project</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                GitHub
              </a>
            </li>
            <li className="text-slate-600 dark:text-slate-400">
              Status:{" "}
              <span className="font-medium text-emerald-600 dark:text-emerald-300">early version</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-white/10">
        &copy; 2026 BornoCode. Made with C++ and Next.js.
      </div>
    </footer>
  );
}