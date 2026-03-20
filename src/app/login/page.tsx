/**
 * Login Page — /login
 */
"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified") === "true";
    const error = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setLoginError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setLoginError("Ongeldige inloggegevens. Probeer het opnieuw.");
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                </h1>
                <p className="text-gray-500 mt-2">Inloggen voor specialisten</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8">
                {verified && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6 text-sm text-emerald-700">
                        ✓ Je e-mailadres is geverifieerd! Je kunt nu inloggen.
                    </div>
                )}

                {error === "invalid_token" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
                        Ongeldige of verlopen verificatielink.
                    </div>
                )}

                {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            E-mailadres
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="naam@bedrijf.nl"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Wachtwoord
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Bezig met inloggen..." : "Inloggen"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm">
                    <a href="/forgot-password" className="text-emerald-600 hover:text-emerald-700">
                        Wachtwoord vergeten?
                    </a>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Nog geen account?{" "}
                    <a href="/signup" className="text-emerald-600 font-medium hover:text-emerald-700">
                        Account aanmaken
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <Suspense fallback={<div className="text-gray-400">Laden...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
