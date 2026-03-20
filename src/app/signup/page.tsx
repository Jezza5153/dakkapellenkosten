/**
 * Signup Page — /signup
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const form = new FormData(e.currentTarget);
        const data = {
            name: form.get("name") as string,
            email: form.get("email") as string,
            password: form.get("password") as string,
            companyName: form.get("companyName") as string,
            phone: form.get("phone") as string,
            city: form.get("city") as string,
            postalCode: form.get("postalCode") as string,
        };

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Er is iets misgegaan");
                setLoading(false);
                return;
            }

            setSuccess(true);
        } catch {
            setError("Netwerk fout. Probeer het opnieuw.");
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8">
                        <div className="text-4xl mb-4">✉️</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Controleer je e-mail</h2>
                        <p className="text-gray-500 mb-6">
                            We hebben een verificatielink naar je e-mailadres gestuurd. Klik op de link om je account te activeren.
                        </p>
                        <a href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                            Ga naar inloggen →
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                    </h1>
                    <p className="text-gray-500 mt-2">Account aanmaken als dakkapel specialist</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Je naam</label>
                            <input id="name" name="name" type="text" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Jan de Vries" />
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam</label>
                            <input id="companyName" name="companyName" type="text" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="De Vries Dakkapellen B.V." />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mailadres</label>
                            <input id="email" name="email" type="email" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="info@bedrijf.nl" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
                            <input id="password" name="password" type="password" required minLength={8} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Minimaal 8 tekens" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefoonnummer</label>
                                <input id="phone" name="phone" type="tel" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="06-12345678" />
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Plaats</label>
                                <input id="city" name="city" type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Amsterdam" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                            <input id="postalCode" name="postalCode" type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="1234 AB" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                            {loading ? "Account aanmaken..." : "Account aanmaken"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Al een account?{" "}
                        <a href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                            Inloggen
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
