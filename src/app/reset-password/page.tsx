/**
 * Password Reset Page — /reset-password
 */
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) {
            setError("Wachtwoorden komen niet overeen");
            return;
        }
        if (password.length < 8) {
            setError("Wachtwoord moet minimaal 8 tekens zijn");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Er is iets misgegaan");
            } else {
                setSuccess(true);
            }
        } catch {
            setError("Netwerk fout");
        }
        setLoading(false);
    }

    if (!token) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
                <h2 className="text-lg font-bold text-red-700 mb-2">Ongeldige link</h2>
                <p className="text-sm text-red-600">Deze reset-link is ongeldig. Vraag een nieuwe aan.</p>
                <a href="/forgot-password" className="mt-4 inline-block text-sm font-medium text-emerald-600">
                    Opnieuw aanvragen →
                </a>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Wachtwoord gewijzigd!</h2>
                <p className="text-gray-500 mb-6">Je kunt nu inloggen met je nieuwe wachtwoord.</p>
                <a href="/login" className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 inline-block">
                    Inloggen
                </a>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                </h1>
                <p className="text-gray-500 mt-2">Nieuw wachtwoord instellen</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nieuw wachtwoord</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                            required minLength={8}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="Minimaal 8 tekens" />
                    </div>
                    <div>
                        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">Bevestig wachtwoord</label>
                        <input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="Herhaal wachtwoord" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                        {loading ? "Bezig..." : "Wachtwoord wijzigen"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Suspense fallback={<div className="text-gray-400">Laden...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
