/**
 * CRM Intelligence — /admin/crm
 * Uses dedicated /api/admin/crm/stats for server-side aggregation
 * Uses /api/admin/leads/export for CSV download
 */
"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface CrmStats {
    totalLeads: number;
    recentLeads30d: number;
    funnel: Record<string, number>;
    monthlyTrend: Array<{ month: string; count: number }>;
    topCities: Array<{ city: string | null; count: number }>;
    typeDistribution: Array<{ type: string; count: number }>;
    companyStats: { total: number; verified: number; withReviews: number; avgRating: string | null };
}

const STATUS_LABELS: Record<string, string> = {
    new: "Nieuw", matching: "Matching", available: "Beschikbaar",
    fulfilled: "Vervuld", expired: "Verlopen", cancelled: "Geannuleerd",
};

const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-500", matching: "bg-yellow-500", available: "bg-purple-500",
    fulfilled: "bg-emerald-500", expired: "bg-gray-500", cancelled: "bg-red-500",
};

export default function CrmIntelligencePage() {
    const { success } = useToast();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CrmStats | null>(null);

    useEffect(() => {
        fetch("/api/admin/crm/stats")
            .then(r => r.ok ? r.json() : null)
            .then(d => { setStats(d); setLoading(false); });
    }, []);

    if (loading || !stats) {
        return (
            <div className="p-8 text-center text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                Analyseren...
            </div>
        );
    }

    const totalLeads = stats.totalLeads;
    const fulfilledLeads = stats.funnel["fulfilled"] || 0;
    const conversionRate = totalLeads > 0 ? Math.round((fulfilledLeads / totalLeads) * 100) : 0;
    const cancelledLeads = stats.funnel["cancelled"] || 0;
    const cancelRate = totalLeads > 0 ? Math.round((cancelledLeads / totalLeads) * 100) : 0;
    const cs = stats.companyStats;
    const maxMonthly = Math.max(...stats.monthlyTrend.map(m => m.count), 1);

    const funnelSteps = [
        { key: "new", label: "Nieuw" },
        { key: "matching", label: "Matching" },
        { key: "available", label: "Beschikbaar" },
        { key: "fulfilled", label: "Vervuld" },
    ];

    function handleExport() {
        window.open("/api/admin/leads/export", "_blank");
        success("Leads export gestart — bestand wordt gedownload");
    }

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "CRM Intelligence" }]} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">CRM Intelligence</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Lead analytics, conversie en marktinzichten</p>
                </div>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                    📥 Exporteer Leads CSV
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                    { label: "Totaal leads", value: totalLeads, color: "text-yellow-400" },
                    { label: "Conversie", value: `${conversionRate}%`, color: conversionRate >= 20 ? "text-emerald-400" : "text-yellow-400" },
                    { label: "Cancel rate", value: `${cancelRate}%`, color: cancelRate <= 10 ? "text-emerald-400" : "text-red-400" },
                    { label: "Bedrijven", value: cs.total, color: "text-blue-400" },
                    { label: "Geverifieerd", value: `${cs.verified}/${cs.total}`, color: "text-purple-400" },
                ].map(kpi => (
                    <div key={kpi.label} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{kpi.label}</div>
                        <div className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Funnel */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <h2 className="text-sm font-semibold mb-4">Lead Funnel</h2>
                    <div className="space-y-3">
                        {funnelSteps.map(step => {
                            const count = stats.funnel[step.key] || 0;
                            const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                            return (
                                <div key={step.key}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">{step.label}</span>
                                        <span className="text-gray-300 font-medium">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${STATUS_COLORS[step.key]}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="pt-2 border-t border-gray-700 space-y-2">
                            {["expired", "cancelled"].map(key => {
                                const count = stats.funnel[key] || 0;
                                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                                return (
                                    <div key={key} className="flex justify-between text-xs">
                                        <span className="text-gray-500">{STATUS_LABELS[key]}</span>
                                        <span className="text-gray-500">{count} ({pct}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Monthly Trend */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <h2 className="text-sm font-semibold mb-4">Leads per maand</h2>
                    <div className="flex items-end gap-2 h-40">
                        {stats.monthlyTrend.map(m => (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400 font-medium">{m.count}</span>
                                <div
                                    className="w-full bg-amber-500/80 rounded-t-sm transition-all min-h-[2px]"
                                    style={{ height: `${(m.count / maxMonthly) * 100}%` }}
                                />
                                <span className="text-[9px] text-gray-500">{m.month.slice(5)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Cities */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <h2 className="text-sm font-semibold mb-3">Top steden</h2>
                    <div className="space-y-2">
                        {stats.topCities.map((c, i) => (
                            <div key={c.city || i} className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 w-4 text-right">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300 truncate">{c.city || "Onbekend"}</span>
                                        <span className="text-gray-500 text-xs">{c.count}</span>
                                    </div>
                                    <div className="h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500/60 rounded-full"
                                            style={{ width: `${(c.count / (stats.topCities[0]?.count || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dakkapel Types */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <h2 className="text-sm font-semibold mb-3">Dakkapel types</h2>
                    <div className="space-y-2">
                        {stats.typeDistribution.map(t => {
                            const pct = totalLeads > 0 ? Math.round((t.count / totalLeads) * 100) : 0;
                            return (
                                <div key={t.type} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">{t.type}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500/60 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-xs text-gray-500 w-12 text-right">{t.count} ({pct}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Company Quality */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 lg:col-span-2">
                    <h2 className="text-sm font-semibold mb-3">Bedrijfskwaliteit</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Gem. rating</div>
                            <div className="text-xl font-bold text-yellow-400">{cs.avgRating || "—"} ★</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Geverifieerd</div>
                            <div className="text-xl font-bold text-emerald-400">
                                {cs.total > 0 ? Math.round((cs.verified / cs.total) * 100) : 0}%
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Met reviews</div>
                            <div className="text-xl font-bold text-blue-400">{cs.withReviews}/{cs.total}</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase">Laatste 30d leads</div>
                            <div className="text-xl font-bold text-purple-400">{stats.recentLeads30d}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
