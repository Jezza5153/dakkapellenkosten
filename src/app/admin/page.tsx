/**
 * Admin Dashboard — /admin
 * Overview stats for admin panel
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardData {
    stats: {
        totalCompanies: number;
        activeSubscriptions: number;
        totalLeads: number;
        recentLeads30d: number;
        totalLeadsAccepted: number;
        totalCreditsInCirculation: number;
        totalCreditsSpent: number;
    };
    articleCount?: number;
    pageCount?: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/dashboard").then(r => {
                if (!r.ok) throw new Error("Geen toegang");
                return r.json();
            }),
            fetch("/api/admin/articles?limit=1").then(r => r.ok ? r.json() : { total: 0 }),
        ])
            .then(([dashboard, articles]) => {
                setData({
                    ...dashboard,
                    articleCount: articles.total || 0,
                });
                setLoading(false);
            })
            .catch(() => router.push("/dashboard"));
    }, [router]);

    if (loading || !data) {
        return (
            <div className="p-8 text-center text-gray-400">Laden...</div>
        );
    }

    const stats = [
        { label: "Bedrijven", value: data.stats.totalCompanies, color: "text-blue-400", href: "/admin/companies" },
        { label: "Actieve abonnementen", value: data.stats.activeSubscriptions, color: "text-emerald-400" },
        { label: "Totaal leads", value: data.stats.totalLeads, color: "text-yellow-400", href: "/admin/leads" },
        { label: "Leads (30d)", value: data.stats.recentLeads30d, color: "text-yellow-400", href: "/admin/leads" },
        { label: "Leads geaccepteerd", value: data.stats.totalLeadsAccepted, color: "text-emerald-400" },
        { label: "Credits in omloop", value: data.stats.totalCreditsInCirculation, color: "text-purple-400" },
        { label: "Artikelen", value: data.articleCount || 0, color: "text-amber-400", href: "/admin/articles" },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">Overzicht van het platform</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map(stat => {
                    const Card = (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors">
                            <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            <div className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
                        </div>
                    );
                    return stat.href ? (
                        <Link key={stat.label} href={stat.href}>{Card}</Link>
                    ) : (
                        <div key={stat.label}>{Card}</div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/articles/new"
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-amber-400/30 transition-colors group"
                >
                    <div className="text-2xl mb-2">📝</div>
                    <div className="font-semibold group-hover:text-amber-400 transition-colors">Nieuw artikel</div>
                    <div className="text-xs text-gray-400 mt-1">Schrijf een blog of kenniscentrum artikel</div>
                </Link>
                <Link
                    href="/admin/leads"
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-emerald-400/30 transition-colors group"
                >
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-semibold group-hover:text-emerald-400 transition-colors">Leads beheren</div>
                    <div className="text-xs text-gray-400 mt-1">Bekijk en beheer binnenkomende leads</div>
                </Link>
                <Link
                    href="/admin/companies"
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-blue-400/30 transition-colors group"
                >
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-semibold group-hover:text-blue-400 transition-colors">Bedrijven</div>
                    <div className="text-xs text-gray-400 mt-1">Beheer dakkapel specialisten</div>
                </Link>
            </div>
        </div>
    );
}
