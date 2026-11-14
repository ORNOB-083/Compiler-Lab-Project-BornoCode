"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
    { href: "/docs", label: "Overview" },
    { href: "/docs/getting-started", label: "Getting Started" },
    { href: "/docs/keywords", label: "Keywords & Syntax" },
    { href: "/docs/functions", label: "Built-in Functions" },
];

export default function DocsNav() {
    const pathname = usePathname();

    return (
        <nav aria-label="Documentation" className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Documentation
            </p>
            <ul className="mt-3 flex flex-col gap-1">
                {PAGES.map((p) => {
                    const active = p.href === "/docs" ? pathname === "/docs" : pathname.startsWith(p.href);
                    return (
                        <li key={p.href}>
                            <Link
                                href={p.href}
                                className={
                                    active
                                        ? "block rounded-lg bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                                        : "block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                                }
                            >
                                {p.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
