/**
 * Companies List — /admin/companies
 * Uses dedicated /api/admin/companies with server-side search
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface Company {
    id: string;
    name: string;
    city: string | null;
    reviewCount: number;
    avgRating: string | null;
    isVerified: boolean;
    isPublic: boolean;
    createdAt: string;
}

export default function CompaniesPage() {
    const router = useRouter();
    const { success, error } = useToast();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const loadCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "50" });
            if (search) params.set("search", search);
            const res = await fetch(`/api/admin/companies?${params}`);
            if (res.ok) {
                const d = await res.json();
                setCompanies(d.companies || []);
                setTotal(d.total || 0);
            }
        } catch {}
        setLoading(false);
    }, [search, page]);

    useEffect(() => { loadCompanies(); }, [loadCompanies]);

    async function toggleVerify(company: Company, e: React.MouseEvent) {
        e.stopPropagation();
        const action = company.isVerified ? "unverify" : "verify";
        const res = await fetch(`/api/admin/companies/${company.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        if (res.ok) {
            setCompanies(prev =>
                prev.map(c => c.id === company.id ? { ...c, isVerified: !c.isVerified } : c)
            );
            success(company.isVerified ? "Verificatie verwijderd" : "Bedrijf geverifieerd ✓");
        } else {
            error("Actie mislukt");
        }
    }

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Bedrijven" }]} />

            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold">Bedrijven</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{total} bedrijven</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Zoek op naam of stad..."
                        className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 w-72 transition-colors"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                        Laden...
                    </div>
                ) : companies.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">Geen bedrijven gevonden.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 border-b border-gray-700">
                                    <th className="px-4 py-3">Bedrijf</th>
                                    <th className="px-4 py-3">Stad</th>
                                    <th className="px-4 py-3">Reviews</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Aangemeld</th>
                                    <th className="px-4 py-3 w-28"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {companies.map(company => (
                                    <tr
                                        key={company.id}
                                        onClick={() => router.push(`/admin/companies/${company.id}`)}
                                        className="cursor-pointer hover:bg-gray-750 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium">{company.name}</td>
                                        <td className="px-4 py-3 text-gray-400">{company.city || "—"}</td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                            {company.reviewCount > 0
                                                ? `${company.avgRating}★ (${company.reviewCount})`
                                                : "—"
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {company.isVerified && (
                                                    <span className="px-1.5 py-0.5 bg-emerald-900/80 text-emerald-300 text-xs rounded">✓ Verified</span>
                                                )}
                                                {company.isPublic && (
                                                    <span className="px-1.5 py-0.5 bg-blue-900/80 text-blue-300 text-xs rounded">Publiek</span>
                                                )}
                                                {!company.isVerified && !company.isPublic && (
                                                    <span className="text-xs text-gray-500">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                            {new Date(company.createdAt).toLocaleDateString("nl-NL")}
                                        </td>
                                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={e => toggleVerify(company, e)}
                                                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                                                    company.isVerified
                                                        ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                                                        : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                                                }`}
                                            >
                                                {company.isVerified ? "Unverify" : "Verifiëren"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
