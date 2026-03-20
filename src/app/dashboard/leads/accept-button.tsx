/**
 * Lead Accept Button — Client Component
 * Handles lead acceptance via fetch() with proper JSON body
 */
"use client";

import { useState } from "react";

export function AcceptLeadButton({
    leadId,
    creditCost,
    hasEnoughCredits,
}: {
    leadId: string;
    creditCost: number;
    hasEnoughCredits: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success?: boolean; error?: string; message?: string } | null>(null);

    async function handleAccept() {
        if (!confirm(`Wil je deze lead accepteren? Er worden ${creditCost} credits afgeschreven.`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/leads/${leadId}/accept`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (!res.ok) {
                setResult({ error: data.error || "Er is iets misgegaan" });
            } else {
                setResult({ success: true, message: data.message });
                // Reload page to refresh data
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch {
            setResult({ error: "Netwerkfout. Probeer het opnieuw." });
        }
        setLoading(false);
    }

    if (result?.success) {
        return (
            <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
                ✓ {result.message || "Geaccepteerd!"}
            </span>
        );
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                onClick={handleAccept}
                disabled={!hasEnoughCredits || loading}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? "Bezig..." : !hasEnoughCredits ? "Onvoldoende credits" : "Lead accepteren"}
            </button>
            {result?.error && (
                <span className="text-xs text-red-600">{result.error}</span>
            )}
        </div>
    );
}
