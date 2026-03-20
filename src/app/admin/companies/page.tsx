/**
 * Admin Companies — /admin/companies
 * Company management (moved from main admin page)
 */
"use client";

import { useEffect, useState } from "react";

interface Company {
    id: string;
    name: string;
    email: string | null;
    city: string | null;
    isVerified: boolean;
    isPublic: boolean;
    reviewCount: number;
    avgRating: string | null;
    createdAt: string;
}

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/dashboard")
            .then(r => r.json())
            .then(d => {
                setCompanies(d.companies || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function toggleVerify(id: string, verified: boolean) {
        await fetch(`/api/admin/companies/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isVerified: !verified }),
        });
        setCompanies(prev => prev.map(c =>
            c.id === id ? { ...c, isVerified: !verified } : c
        ));
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Bedrijven</h1>
                <p className="text-sm text-gray-400 mt-1">{companies.length} bedrijven geregistreerd</p>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Laden...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-700">
                                <th className="px-4 py-3">Bedrijf</th>
                                <th className="px-4 py-3">Stad</th>
                                <th className="px-4 py-3">Reviews</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Acties</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {companies.map(company => (
                                <tr key={company.id} className="hover:bg-gray-750">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{company.name}</div>
                                        <div className="text-xs text-gray-500">{company.email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{company.city || "—"}</td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {company.reviewCount > 0
                                            ? `${company.avgRating}★ (${company.reviewCount})`
                                            : "—"
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            company.isVerified
                                                ? "bg-emerald-900 text-emerald-300"
                                                : "bg-gray-700 text-gray-400"
                                        }`}>
                                            {company.isVerified ? "Geverifieerd" : "Niet geverifieerd"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleVerify(company.id, company.isVerified)}
                                            className="text-xs text-amber-400 hover:text-amber-300"
                                        >
                                            {company.isVerified ? "Unverify" : "Verifiëren"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
