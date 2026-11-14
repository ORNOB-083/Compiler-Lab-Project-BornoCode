"use client";

import { Moon, Sun } from "lucide-react";

// Icons switch with CSS (dark: variant), so there is no hydration mismatch.
export default function ThemeToggle() {
    function toggle() {
        const isDark = document.documentElement.classList.toggle("dark");
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch (e) { }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Toggle light and dark theme"
            className="grid size-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-300"
        >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
        </button>
    );
}