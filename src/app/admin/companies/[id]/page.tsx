/**
 * Company Detail — /admin/companies/[id]
 * Full profile view with contact info, verification, service area, linked leads
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface Company {
    id: string;
    name: string;
    slug: string | null;
    kvkNumber: string | null;
    vatId: string | null;
    description: string | null;
    logoUrl: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    serviceRadiusKm: number | null;
    specialisaties: string[] | null;
    materialen: string[] | null;
    certificeringen: string[] | null;
    garantieTermijn: string | null;
    foundedYear: number | null;
    yearsExperience: number | null;
    avgRating: string | null;
    reviewCount: number;
    isVerified: boolean;
    isPublic: boolean;
    createdAt: string;
}

interface LinkedLead {
    id: string;
    leadId: string;
    status: string;
    matchScore: number | null;
    distanceKm: string | null;
    acceptedAt: string | null;
    lead?: {
        naam: string;
        postcode: string;
        city: string | null;
        dakkapelType: string;
        status: string;
        createdAt: string;
    };
}

export default function CompanyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const companyId = params?.id as string;
    const { success, error } = useToast();

    const [company, setCompany] = useState<Company | null>(null);
    const [leads, setLeads] = useState<LinkedLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!companyId) return;
        fetch(`/api/admin/companies/${companyId}`)
            .then(r => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then(data => {
                setCompany(data.company);
                setLeads(data.matches || []);
                setLoading(false);
            })
            .catch(() => {
                router.push("/admin/companies");
            });
    }, [companyId, router]);

    async function toggleVerify() {
        if (!company) return;
        const res = await fetch(`/api/admin/companies/${company.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isVerified: !company.isVerified }),
        });
        if (res.ok) {
            setCompany(prev => prev ? { ...prev, isVerified: !prev.isVerified } : null);
            success(company.isVerified ? "Verificatie verwijderd" : "Bedrijf geverifieerd ✓");
        } else {
            error("Actie mislukt");
        }
    }

    async function togglePublic() {
        if (!company) return;
        const res = await fetch(`/api/admin/companies/${company.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPublic: !company.isPublic }),
        });
        if (res.ok) {
            setCompany(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null);
            success(company.isPublic ? "Bedrijf verborgen" : "Bedrijf publiek gemaakt");
        } else {
            error("Actie mislukt");
        }
    }

    if (loading || !company) {
        return (
            <div className="p-8 text-center text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                Laden...
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6 max-w-[1100px]">
            <Breadcrumbs items={[
                { label: "Bedrijven", href: "/admin/companies" },
                { label: company.name },
            ]} />

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-14 h-14 rounded-xl object-cover border border-gray-700" />
                    ) : (
                        <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-2xl">🏢</div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{company.name}</h1>
                            {company.isVerified && (
                                <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 text-xs font-medium rounded">✓ Geverifieerd</span>
                            )}
                            {!company.isPublic && (
                                <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs font-medium rounded">Verborgen</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {company.city}{company.postalCode && ` • ${company.postalCode}`}
                            {company.reviewCount > 0 && ` • ${company.avgRating}★ (${company.reviewCount} reviews)`}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={togglePublic}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            company.isPublic
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                        }`}
                    >
                        {company.isPublic ? "Verbergen" : "Publiek maken"}
                    </button>
                    <button
                        onClick={toggleVerify}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            company.isVerified
                                ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                                : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                        }`}
                    >
                        {company.isVerified ? "Unverify" : "Verifiëren"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                {/* Main Content */}
                <div className="space-y-5">
                    {/* Contact Info */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <h2 className="text-sm font-semibold text-gray-300 mb-3">Contact</h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {company.email && (
                                <div>
                                    <span className="text-xs text-gray-500 block">Email</span>
                                    <a href={`mailto:${company.email}`} className="text-amber-400 hover:underline">{company.email}</a>
                                </div>
                            )}
                            {company.phone && (
                                <div>
                                    <span className="text-xs text-gray-500 block">Telefoon</span>
                                    <a href={`tel:${company.phone}`} className="text-amber-400 hover:underline">{company.phone}</a>
                                </div>
                            )}
                            {company.website && (
                                <div>
                                    <span className="text-xs text-gray-500 block">Website</span>
                                    <a href={company.website} target="_blank" rel="noopener" className="text-amber-400 hover:underline">{company.website}</a>
                                </div>
                            )}
                            {company.address && (
                                <div>
                                    <span className="text-xs text-gray-500 block">Adres</span>
                                    <span className="text-gray-300">{company.address}</span>
                                </div>
                            )}
                            {company.kvkNumber && (
                                <div>
                                    <span className="text-xs text-gray-500 block">KVK</span>
                                    <span className="text-gray-300">{company.kvkNumber}</span>
                                </div>
                            )}
                            {company.vatId && (
                                <div>
                                    <span className="text-xs text-gray-500 block">BTW</span>
                                    <span className="text-gray-300">{company.vatId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Linked Leads */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <h2 className="text-sm font-semibold text-gray-300 mb-3">
                            Gekoppelde leads ({leads.length})
                        </h2>
                        {leads.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Nog geen leads gekoppeld.</p>
                        ) : (
                            <div className="space-y-2">
                                {leads.map(match => (
                                    <div key={match.id} className="flex items-center justify-between p-3 bg-gray-700/40 rounded-lg text-sm">
                                        <div>
                                            <span className="font-medium">{match.lead?.naam || "—"}</span>
                                            <span className="text-gray-500 ml-2 text-xs">
                                                {match.lead?.postcode} {match.lead?.city && `(${match.lead.city})`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {match.distanceKm && (
                                                <span className="text-xs text-gray-500">{match.distanceKm} km</span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                match.status === "accepted" ? "bg-emerald-900/80 text-emerald-300" :
                                                match.status === "won" ? "bg-purple-900/80 text-purple-300" :
                                                match.status === "declined" ? "bg-red-900/80 text-red-300" :
                                                "bg-gray-600 text-gray-300"
                                            }`}>
                                                {match.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status Card */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Service radius</span>
                                <span>{company.serviceRadiusKm || 30} km</span>
                            </div>
                            {company.yearsExperience && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ervaring</span>
                                    <span>{company.yearsExperience} jaar</span>
                                </div>
                            )}
                            {company.garantieTermijn && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Garantie</span>
                                    <span>{company.garantieTermijn}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Aangemeld</span>
                                <span>{new Date(company.createdAt).toLocaleDateString("nl-NL")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Specialisaties */}
                    {company.specialisaties && company.specialisaties.length > 0 && (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Specialisaties</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {company.specialisaties.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Materialen */}
                    {company.materialen && company.materialen.length > 0 && (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Materialen</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {company.materialen.map((m, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{m}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certificeringen */}
                    {company.certificeringen && company.certificeringen.length > 0 && (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Certificeringen</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {company.certificeringen.map((c, i) => (
                                    <span key={i} className="px-2 py-1 bg-emerald-900/40 text-emerald-300 rounded text-xs">{c}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {company.description && (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Beschrijving</h3>
                            <p className="text-sm text-gray-300 leading-relaxed">{company.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
