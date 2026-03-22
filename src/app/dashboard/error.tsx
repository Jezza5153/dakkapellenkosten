"use client";

/**
 * Dashboard Error Boundary — Catches unhandled errors in company dashboard.
 * Prevents full-page crashes for logged-in company users.
 */

import { useEffect } from "react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[dashboard] Uncaught error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Er is iets misgegaan
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Er is een onverwachte fout opgetreden. Probeer de pagina opnieuw te laden.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Opnieuw proberen
                    </button>
                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Terug naar dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
