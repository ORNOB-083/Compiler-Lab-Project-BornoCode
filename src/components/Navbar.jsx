"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" },
  { href: "/learn", label: "Learn", soon: true },
  { href: "/docs", label: "Docs" },
  { href: "/games", label: "Games", soon: true },
];

const activeDesktop =
  "rounded-lg bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300";
const idleDesktop =
  "rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white";
const activeMobile =
  "block rounded-lg bg-indigo-500/10 px-3 py-2.5 text-sm font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300";
const idleMobile =
  "block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/5";

function SoonBadge() {
  return (
    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
      Soon
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md dark:border-white/10 dark:bg-[#05050f]/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
            ব
          </span>
          <span className="font-mono text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Borno<span className="text-indigo-500 dark:text-indigo-400">Code</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              {l.soon ? (
                <span
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-400 dark:text-slate-500"
                >
                  {l.label}
                  <SoonBadge />
                </span>
              ) : (
                <Link href={l.href} className={isActive(l.href) ? activeDesktop : idleDesktop}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/playground"
            className="hidden rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 hover:brightness-110 sm:block"
          >
            Start Coding
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-lg border border-slate-300 text-slate-700 md:hidden dark:border-white/10 dark:text-slate-300"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 pb-4 pt-2 md:hidden dark:border-white/10 dark:bg-[#05050f]">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                {l.soon ? (
                  <span className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-400 dark:text-slate-500">
                    {l.label}
                    <SoonBadge />
                  </span>
                ) : (
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={isActive(l.href) ? activeMobile : idleMobile}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/playground"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-lg bg-linear-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            Start Coding
          </Link>
        </div>
      )}
    </header>
  );
}