/**
 * Analytics Dashboard — /dashboard/analytics
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AnalyticsData {
    overview: {
        totalLeadsReceived: number;
        totalLeadsAccepted: number;
        totalLeadsDeclined: number;
        totalContacted: number;
        totalWon: number;
        totalLost: number;
        acceptRate: number;
        conversionRate: number;
        avgResponseHrs: number;
    };
    credits: {
        balance: number;
        totalPurchased: number;
        totalSpent: number;
    };
    last30Days: {
        leadsReceived: number;
        leadsAccepted: number;
    };
    monthlyStats: Array<{
        month: string;
        notified: number;
        accepted: number;
        won: number;
    }>;
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        fetch("/api/company/analytics")
            .then(r => {
                if (!r.ok) throw new Error("Niet ingelogd");
                return r.json();
            })
            .then(d => { setData(d); setLoading(false); })
            .catch(() => router.push("/login"));
    }, [router]);

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Laden...</div>
            </div>
        );
    }

    const maxMonthly = Math.max(...data.monthlyStats.map(m => m.notified), 1);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
                    <h1 className="text-xl font-bold text-gray-900">
                        Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                    </h1>
                    <span className="text-sm text-gray-500">Dashboard</span>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
                    <a href="/dashboard" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Overzicht</a>
                    <a href="/dashboard/leads" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Leads</a>
                    <a href="/dashboard/credits" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Credits</a>
                    <a href="/dashboard/profile" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Profiel</a>
                    <a href="/dashboard/analytics" className="py-3 border-b-2 border-emerald-600 text-sm font-medium text-emerald-700">Analytics</a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="text-sm text-gray-500">Leads ontvangen</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{data.overview.totalLeadsReceived}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="text-sm text-gray-500">Leads geaccepteerd</div>
                        <div className="text-2xl font-bold text-emerald-700 mt-1">{data.overview.totalLeadsAccepted}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="text-sm text-gray-500">Accept ratio</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{data.overview.acceptRate}%</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <div className="text-sm text-gray-500">Gem. reactietijd</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{data.overview.avgResponseHrs}u</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Conversion Funnel */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Conversie funnel</h3>
                        <div className="space-y-3">
                            {[
                                { label: "Ontvangen", value: data.overview.totalLeadsReceived, color: "bg-gray-200" },
                                { label: "Geaccepteerd", value: data.overview.totalLeadsAccepted, color: "bg-blue-400" },
                                { label: "Benaderd", value: data.overview.totalContacted, color: "bg-emerald-400" },
                                { label: "Gewonnen", value: data.overview.totalWon, color: "bg-emerald-600" },
                                { label: "Verloren", value: data.overview.totalLost, color: "bg-red-400" },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <div className="w-24 text-sm text-gray-600">{item.label}</div>
                                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center px-2`}
                                            style={{ width: `${data.overview.totalLeadsReceived > 0 ? Math.max((item.value / data.overview.totalLeadsReceived) * 100, 4) : 0}%` }}
                                        >
                                            <span className="text-xs font-medium text-white">{item.value}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Credit Usage */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Credit verbruik</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Huidig saldo</span>
                                <span className="text-xl font-bold text-emerald-700">{data.credits.balance}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Totaal aangekocht</span>
                                <span className="text-lg font-medium text-gray-900">{data.credits.totalPurchased}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Totaal besteed</span>
                                <span className="text-lg font-medium text-gray-900">{data.credits.totalSpent}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Conversie ratio</span>
                                    <span className="text-xl font-bold text-gray-900">{data.overview.conversionRate}%</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Gewonnen projecten / geaccepteerde leads</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Chart */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Laatste 6 maanden</h3>
                    <div className="flex items-end gap-3 h-48">
                        {data.monthlyStats.map(month => (
                            <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "160px", justifyContent: "flex-end" }}>
                                    <div
                                        className="w-full bg-gray-200 rounded-t-md"
                                        style={{ height: `${(month.notified / maxMonthly) * 100}%`, minHeight: month.notified > 0 ? "4px" : "0" }}
                                        title={`Ontvangen: ${month.notified}`}
                                    />
                                    <div
                                        className="w-full bg-emerald-400 rounded-b-md"
                                        style={{ height: `${(month.accepted / maxMonthly) * 100}%`, minHeight: month.accepted > 0 ? "4px" : "0" }}
                                        title={`Geaccepteerd: ${month.accepted}`}
                                    />
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{month.month}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4 justify-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-gray-200 rounded" />
                            <span className="text-xs text-gray-500">Ontvangen</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-emerald-400 rounded" />
                            <span className="text-xs text-gray-500">Geaccepteerd</span>
                        </div>
                    </div>
                </div>

                {/* Last 30 Days */}
                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium text-emerald-800">Laatste 30 dagen</div>
                        <div className="text-xs text-emerald-600 mt-0.5">
                            {data.last30Days.leadsReceived} ontvangen · {data.last30Days.leadsAccepted} geaccepteerd
                        </div>
                    </div>
                    <a href="/dashboard/leads" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                        Leads bekijken →
                    </a>
                </div>
            </main>
        </div>
    );
}
