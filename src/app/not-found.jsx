"use client";
import Link from "next/link";
import { Terminal, Home, AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-4 font-sans selection:bg-[#8b5cf6]/30">

            {/* Background Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6]/20 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-[#d946ef]/20 blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-2xl">

                {/* Terminal Window */}
                <div className="overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b]/80 shadow-2xl backdrop-blur-xl">

                    {/* Terminal Header */}
                    <div className="flex items-center justify-between border-b border-[#27272a] bg-[#121214] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>
                            <div className="h-3 w-3 rounded-full bg-[#eab308]"></div>
                            <div className="h-3 w-3 rounded-full bg-[#22c55e]"></div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#52525b]">
                            <Terminal className="h-3.5 w-3.5" />
                            bornocode - error.sh
                        </div>
                        <div className="w-12"></div> {/* Spacer for symmetry */}
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 sm:p-8 font-mono text-sm sm:text-base">
                        <div className="flex flex-col gap-2">
                            <p className="text-[#a1a1aa]">
                                <span className="text-[#8b5cf6]">bornocode@dev</span>:<span className="text-[#3b82f6]">~/pages</span>$ run 404.bc
                            </p>

                            <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 p-4 text-[#f87171]">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-bold">Runtime Error (Line 404)</p>
                                    <p className="mt-1 text-[#fca5a5]">Page not found.</p>
                                    <p className="mt-2 text-xs text-[#f87171]/70">
                                        {'The requested URL was not found on this server. Check your spelling or return to the dashboard.'}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-[#a1a1aa]">
                                <span className="text-[#8b5cf6]">bornocode@dev</span>:<span className="text-[#3b82f6]">~/pages</span>$ <span className="inline-block h-4 w-2.5 animate-pulse bg-[#a1a1aa] align-middle"></span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8b5cf6]/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[#8b5cf6]/50 active:translate-y-0 sm:w-auto"
                    >
                        <Home className="h-4 w-4" />
                        Return to Homepage
                    </Link>

                    <Link
                        href="/playground"
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#27272a] bg-[#18181b] px-6 py-3 text-sm font-semibold text-[#f4f4f5] transition-all duration-200 hover:bg-[#27272a]/50 hover:border-[#52525b] sm:w-auto"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go to Playground
                    </Link>
                </div>

                {/* Giant 404 Background Text */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-[200px] font-black text-white/[0.02] sm:text-[300px]">
                    404
                </div>

            </div>
        </div>
    );
}