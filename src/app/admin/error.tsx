"use client";

/**
 * Admin Error Boundary — Catches unhandled errors in admin pages.
 * Prevents full-page crashes from taking down the entire admin panel.
 * Next.js automatically uses this for any error in /admin/* routes.
 */

import { useEffect } from "react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[admin] Uncaught error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                    Er is iets misgegaan
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                    Er is een onverwachte fout opgetreden. Probeer de pagina opnieuw te laden.
                    {error.digest && (
                        <span className="block mt-2 font-mono text-xs text-gray-600">
                            Fout ID: {error.digest}
                        </span>
                    )}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Opnieuw proberen
                    </button>
                    <button
                        onClick={() => window.location.href = "/admin"}
                        className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Terug naar dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
