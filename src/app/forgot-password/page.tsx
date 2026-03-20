/**
 * Forgot Password Page — /forgot-password
 */
"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
        } catch { /* always show success */ }

        setSent(true);
        setLoading(false);
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
                    <div className="text-4xl mb-4">✉️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Controleer je e-mail</h2>
                    <p className="text-gray-500 mb-6">
                        Als dit e-mailadres bij ons bekend is, ontvang je een link om je wachtwoord te resetten.
                    </p>
                    <a href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                        Terug naar inloggen →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                    </h1>
                    <p className="text-gray-500 mt-2">Wachtwoord vergeten</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <p className="text-sm text-gray-500 mb-6">
                        Vul je e-mailadres in en we sturen je een link om een nieuw wachtwoord in te stellen.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
                            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                                required autoFocus
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                placeholder="naam@bedrijf.nl" />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                            {loading ? "Bezig..." : "Reset-link versturen"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <a href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                            Terug naar inloggen
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
