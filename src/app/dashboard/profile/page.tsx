/**
 * Company Profile Edit — /dashboard/profile
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CompanyData {
    name: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    city: string;
    postalCode: string;
    kvkNumber: string;
    serviceRadiusKm: number;
    specialisaties: string[];
    materialen: string[];
    garantieTermijn: string;
    foundedYear: number | null;
}

const SPECIALISATIE_OPTIONS = ["prefab", "traditioneel", "maatwerk"];
const MATERIAAL_OPTIONS = ["kunststof", "hout", "polyester", "aluminium", "staal"];

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [company, setCompany] = useState<CompanyData>({
        name: "", description: "", phone: "", email: "", website: "",
        address: "", city: "", postalCode: "", kvkNumber: "",
        serviceRadiusKm: 30, specialisaties: [], materialen: [],
        garantieTermijn: "", foundedYear: null,
    });

    useEffect(() => {
        fetch("/api/company/profile")
            .then(r => {
                if (!r.ok) throw new Error("Niet ingelogd");
                return r.json();
            })
            .then(data => {
                if (data.company) {
                    setCompany({
                        name: data.company.name || "",
                        description: data.company.description || "",
                        phone: data.company.phone || "",
                        email: data.company.email || "",
                        website: data.company.website || "",
                        address: data.company.address || "",
                        city: data.company.city || "",
                        postalCode: data.company.postalCode || "",
                        kvkNumber: data.company.kvkNumber || "",
                        serviceRadiusKm: data.company.serviceRadiusKm || 30,
                        specialisaties: data.company.specialisaties || [],
                        materialen: data.company.materialen || [],
                        garantieTermijn: data.company.garantieTermijn || "",
                        foundedYear: data.company.foundedYear || null,
                    });
                }
                setLoading(false);
            })
            .catch(() => router.push("/login"));
    }, [router]);

    async function handleSave() {
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("/api/company/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(company),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Opslaan mislukt");
            } else {
                setMessage("Profiel opgeslagen!");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch {
            setError("Netwerk fout");
        }
        setSaving(false);
    }

    function toggleArray(arr: string[], item: string): string[] {
        return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Laden...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900">
                            Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                        </h1>
                        <span className="text-sm text-gray-500">Dashboard</span>
                    </div>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
                    <a href="/dashboard" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Overzicht</a>
                    <a href="/dashboard/leads" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Leads</a>
                    <a href="/dashboard/credits" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Credits</a>
                    <a href="/dashboard/profile" className="py-3 border-b-2 border-emerald-600 text-sm font-medium text-emerald-700">Profiel</a>
                    <a href="/dashboard/analytics" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Analytics</a>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Bedrijfsprofiel</h2>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                        {saving ? "Opslaan..." : "Opslaan"}
                    </button>
                </div>

                {message && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-6 text-sm text-emerald-700">{message}</div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">{error}</div>
                )}

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Basisgegevens</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Bedrijfsnaam</label>
                                <input type="text" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">KvK-nummer</label>
                                <input type="text" value={company.kvkNumber} onChange={e => setCompany({ ...company, kvkNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Opgericht in</label>
                                <input type="number" value={company.foundedYear || ""} onChange={e => setCompany({ ...company, foundedYear: e.target.value ? Number(e.target.value) : null })}
                                    placeholder="bijv. 2005"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Garantietermijn</label>
                                <input type="text" value={company.garantieTermijn} onChange={e => setCompany({ ...company, garantieTermijn: e.target.value })}
                                    placeholder="bijv. 10 jaar"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm text-gray-600 mb-1">Beschrijving</label>
                            <textarea value={company.description} onChange={e => setCompany({ ...company, description: e.target.value })}
                                rows={4} placeholder="Vertel potentiële klanten over uw bedrijf..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Contactgegevens</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Telefoon</label>
                                <input type="tel" value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">E-mail</label>
                                <input type="email" value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Website</label>
                                <input type="url" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })}
                                    placeholder="https://"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Postcode</label>
                                <input type="text" value={company.postalCode} onChange={e => setCompany({ ...company, postalCode: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-1">Adres</label>
                                <input type="text" value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Plaats</label>
                                <input type="text" value={company.city} onChange={e => setCompany({ ...company, city: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Werkgebied radius (km)</label>
                                <input type="number" value={company.serviceRadiusKm} onChange={e => setCompany({ ...company, serviceRadiusKm: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Diensten & Specialisaties</h3>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Type dakkapel</label>
                            <div className="flex flex-wrap gap-2">
                                {SPECIALISATIE_OPTIONS.map(opt => (
                                    <button key={opt} type="button"
                                        onClick={() => setCompany({ ...company, specialisaties: toggleArray(company.specialisaties, opt) })}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${company.specialisaties.includes(opt)
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                    >
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Materialen</label>
                            <div className="flex flex-wrap gap-2">
                                {MATERIAAL_OPTIONS.map(opt => (
                                    <button key={opt} type="button"
                                        onClick={() => setCompany({ ...company, materialen: toggleArray(company.materialen, opt) })}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${company.materialen.includes(opt)
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                    >
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
