/**
 * Credit Purchase Button — Client Component
 * Handles credit package purchase via Stripe Checkout
 */
"use client";

import { useState } from "react";

export function PurchaseButton({
    packageId,
    isPopular,
}: {
    packageId: string;
    isPopular: boolean;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlePurchase() {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/credits/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageId }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Er is iets misgegaan");
                setLoading(false);
                return;
            }

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch {
            setError("Netwerkfout. Probeer het opnieuw.");
            setLoading(false);
        }
    }

    return (
        <div>
            <button
                onClick={handlePurchase}
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${isPopular
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
                {loading ? "Laden..." : "Kopen"}
            </button>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
