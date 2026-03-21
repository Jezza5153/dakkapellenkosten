/**
 * Admin Dashboard — /admin
 * Robust platform dashboard with independent data loading, graceful fallbacks,
 * and attention-needed indicators.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CrmStats {
    totalLeads: number;
    recentLeads30d: number;
    funnel: Record<string, number>;
    companyStats: { total: number; verified: number; withReviews: number; avgRating: string | null };
}

interface ArticleSummary {
    id: string; title: string; slug: string; status: string;
    category: string | null; seoTitle: string | null; seoDescription: string | null;
    featuredImage: string | null; updatedAt: string;
}

interface PageSummary {
    id: string; title: string; slug: string; status: string;
    city: string | null; seoTitle: string | null; seoDescription: string | null;
    updatedAt: string;
}

interface AuditEvent {
    id: string; action: string; entityType: string;
    entityTitle: string | null; actorName: string | null; createdAt: string;
}

interface OverdueData {
    totalAttentionItems: number;
    overdueFollowUps: { count: number; items: any[] };
    overdueTasks: { count: number; items: any[] };
    unassignedLeads: { count: number; items: any[] };
    noMatchLeads: { count: number; items: any[] };
}

// Safe fetch helper — never throws, returns fallback on failure
async function safeFetch<T>(url: string, fallback: T): Promise<T> {
    try {
        const res = await fetch(url);
        if (!res.ok) return fallback;
        return await res.json();
    } catch {
        return fallback;
    }
}

const DEFAULT_CRM: CrmStats = {
    totalLeads: 0, recentLeads30d: 0, funnel: {},
    companyStats: { total: 0, verified: 0, withReviews: 0, avgRating: null },
};

const DEFAULT_OVERDUE: OverdueData = {
    totalAttentionItems: 0,
    overdueFollowUps: { count: 0, items: [] },
    overdueTasks: { count: 0, items: [] },
    unassignedLeads: { count: 0, items: [] },
    noMatchLeads: { count: 0, items: [] },
};

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [crmStats, setCrmStats] = useState<CrmStats>(DEFAULT_CRM);
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [pages, setPages] = useState<PageSummary[]>([]);
    const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
    const [overdue, setOverdue] = useState<OverdueData>(DEFAULT_OVERDUE);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        let mounted = true;

        async function loadDashboard() {
            const errs: string[] = [];

            // Load all independently — never block on a single failure
            const [crm, articlesData, pagesData, auditData, overdueData] = await Promise.all([
                safeFetch<CrmStats | null>("/api/admin/crm/stats", null),
                safeFetch<{ articles?: ArticleSummary[] }>("/api/admin/articles?limit=50&sortBy=updatedAt&sortDir=desc", { articles: [] }),
                safeFetch<{ pages?: PageSummary[] }>("/api/admin/pages?limit=50&sortBy=updatedAt&sortDir=desc", { pages: [] }),
                safeFetch<{ events?: AuditEvent[] }>("/api/admin/audit-log?limit=10", { events: [] }),
                safeFetch<OverdueData>("/api/admin/leads/overdue", DEFAULT_OVERDUE),
            ]);

            if (!mounted) return;

            if (crm) setCrmStats(crm); else errs.push("CRM stats");
            setArticles(articlesData.articles || []);
            setPages(pagesData.pages || []);
            setAuditEvents(auditData.events || []);
            setOverdue(overdueData);
            setErrors(errs);
            setLoading(false);
        }

        loadDashboard();
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-4 animate-pulse">
                            <div className="h-3 bg-gray-700 rounded w-16 mb-2" />
                            <div className="h-6 bg-gray-700 rounded w-10" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 h-48 animate-pulse" />
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 h-48 animate-pulse" />
                </div>
            </div>
        );
    }

    // Derived data
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(a => a.status === "published").length;
    const draftArticles = articles.filter(a => a.status === "draft");
    const totalPages = pages.length;
    const publishedPages = pages.filter(p => p.status === "published").length;

    // Content health
    const missingSeoParts = articles.filter(a => a.status === "published" && (!a.seoTitle || !a.seoDescription));
    const missingImages = articles.filter(a => a.status === "published" && !a.featuredImage);
    const missingGeoSeo = pages.filter(p => p.status === "published" && (!p.seoTitle || !p.seoDescription));
    const healthIssues = missingSeoParts.length + missingImages.length + missingGeoSeo.length;

    // Recent activity
    const recentActivity = [
        ...articles.slice(0, 10).map(a => ({ type: "article" as const, id: a.id, title: a.title, status: a.status, updatedAt: a.updatedAt, href: `/admin/articles/${a.id}` })),
        ...pages.slice(0, 10).map(p => ({ type: "page" as const, id: p.id, title: p.title, status: p.status, updatedAt: p.updatedAt, href: `/admin/pages/${p.id}` })),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);

    const actionIcons: Record<string, string> = {
        create: "🆕", update: "✏️", delete: "🗑️", restore: "♻️",
        publish: "🚀", upload: "📤", status_change: "🔄",
        refund: "💰", adjustment: "💰", export: "📊",
    };

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-400 mt-0.5">Welkom terug. Hier is een overzicht van je platform.</p>
            </div>

            {/* Error banner */}
            {errors.length > 0 && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-4 text-sm text-red-300">
                    ⚠️ Kon niet laden: {errors.join(", ")}. Overige data wordt wel getoond.
                </div>
            )}

            {/* ── Attention Needed ─────────────────────────── */}
            {overdue.totalAttentionItems > 0 && (
                <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-amber-400 text-lg">🔔</span>
                        <h2 className="text-sm font-semibold text-amber-300">Aandacht nodig ({overdue.totalAttentionItems})</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {overdue.overdueFollowUps.count > 0 && (
                            <Link href="/admin/leads" className="bg-gray-800/60 rounded-lg p-3 hover:bg-gray-700/60 transition-colors">
                                <div className="text-lg font-bold text-red-400">{overdue.overdueFollowUps.count}</div>
                                <div className="text-[10px] text-gray-400">Verlopen follow-ups</div>
                            </Link>
                        )}
                        {overdue.overdueTasks.count > 0 && (
                            <Link href="/admin/leads" className="bg-gray-800/60 rounded-lg p-3 hover:bg-gray-700/60 transition-colors">
                                <div className="text-lg font-bold text-orange-400">{overdue.overdueTasks.count}</div>
                                <div className="text-[10px] text-gray-400">Verlopen taken</div>
                            </Link>
                        )}
                        {overdue.unassignedLeads.count > 0 && (
                            <Link href="/admin/leads" className="bg-gray-800/60 rounded-lg p-3 hover:bg-gray-700/60 transition-colors">
                                <div className="text-lg font-bold text-yellow-400">{overdue.unassignedLeads.count}</div>
                                <div className="text-[10px] text-gray-400">Niet-toegewezen leads</div>
                            </Link>
                        )}
                        {overdue.noMatchLeads.count > 0 && (
                            <Link href="/admin/leads" className="bg-gray-800/60 rounded-lg p-3 hover:bg-gray-700/60 transition-colors">
                                <div className="text-lg font-bold text-gray-400">{overdue.noMatchLeads.count}</div>
                                <div className="text-[10px] text-gray-400">Leads zonder match</div>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* ── KPI Cards ────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {[
                    { label: "Bedrijven", value: crmStats.companyStats.total, color: "text-blue-400", href: "/admin/companies" },
                    { label: "Geverifieerd", value: crmStats.companyStats.verified, color: "text-emerald-400", href: "/admin/companies" },
                    { label: "Totaal leads", value: crmStats.totalLeads, color: "text-yellow-400", href: "/admin/leads" },
                    { label: "Leads (30d)", value: crmStats.recentLeads30d, color: "text-yellow-400", href: "/admin/leads" },
                    { label: "Artikelen", value: `${publishedArticles}/${totalArticles}`, color: "text-amber-400", href: "/admin/articles" },
                    { label: "Pagina's", value: `${publishedPages}/${totalPages}`, color: "text-purple-400", href: "/admin/pages" },
                    { label: "Beoordeling", value: crmStats.companyStats.avgRating || "—", color: "text-cyan-400", href: "/admin/crm" },
                ].map(stat => (
                    <Link key={stat.label} href={stat.href}>
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-gray-600 transition-colors cursor-pointer">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            <div className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                {/* ── Left Column ─────────────────────────── */}
                <div className="space-y-6">
                    {/* Recent Content Activity */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <h2 className="text-sm font-semibold mb-3">Recente content</h2>
                        {recentActivity.length === 0 ? (
                            <p className="text-sm text-gray-500">Nog geen activiteit.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentActivity.map(item => (
                                    <Link
                                        key={`${item.type}-${item.id}`}
                                        href={item.href}
                                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-700/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="text-base shrink-0">{item.type === "article" ? "📝" : "📄"}</span>
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium truncate group-hover:text-amber-400 transition-colors">{item.title}</div>
                                                <div className="text-[10px] text-gray-500">{item.type === "article" ? "Artikel" : "Pagina"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                                item.status === "published" ? "bg-emerald-900/80 text-emerald-300" : "bg-gray-700 text-gray-400"
                                            }`}>
                                                {item.status === "published" ? "live" : "concept"}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(item.updatedAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Audit Activity Feed */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold">Audit trail</h2>
                            <Link href="/admin/audit-log" className="text-xs text-amber-400 hover:text-amber-300">Alles bekijken →</Link>
                        </div>
                        {auditEvents.length === 0 ? (
                            <p className="text-sm text-gray-500">Nog geen events.</p>
                        ) : (
                            <div className="space-y-2">
                                {auditEvents.slice(0, 6).map(event => (
                                    <div key={event.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-gray-700/30">
                                        <span className="text-base mt-0.5">{actionIcons[event.action] || "📋"}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm">
                                                <span className="font-medium text-gray-200">{event.actorName || "Systeem"}</span>
                                                <span className="text-gray-500 mx-1">→</span>
                                                <span className="text-gray-400">{event.action}</span>
                                                <span className="text-gray-500 mx-1">→</span>
                                                <span className="text-gray-300 font-medium truncate">{event.entityTitle || event.entityType}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-600 mt-0.5">
                                                {new Date(event.createdAt).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Column ────────────────────────── */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <h2 className="text-sm font-semibold mb-3">Snelle acties</h2>
                        <div className="space-y-2">
                            {[
                                { href: "/admin/articles/new", icon: "📝", label: "Nieuw artikel", sub: "Blog of kenniscentrum" },
                                { href: "/admin/pages/new", icon: "📄", label: "Nieuwe pagina", sub: "SEO landing of geo-page" },
                                { href: "/admin/media", icon: "🖼️", label: "Media uploaden", sub: "Afbeeldingen beheren" },
                                { href: "/admin/seo-health", icon: "🔍", label: "SEO Health", sub: "Content audit bekijken" },
                                { href: "/admin/settings", icon: "⚙️", label: "Instellingen", sub: "Platform configuratie" },
                            ].map(action => (
                                <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors group">
                                    <span className="text-lg">{action.icon}</span>
                                    <div>
                                        <div className="text-sm font-medium group-hover:text-amber-400 transition-colors">{action.label}</div>
                                        <div className="text-[10px] text-gray-500">{action.sub}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Lead Funnel */}
                    {Object.keys(crmStats.funnel).length > 0 && (
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                            <h2 className="text-sm font-semibold mb-3">Lead funnel</h2>
                            <div className="space-y-2">
                                {Object.entries(crmStats.funnel).map(([status, count]) => {
                                    const total = crmStats.totalLeads || 1;
                                    const pct = Math.round((count / total) * 100);
                                    const colors: Record<string, string> = {
                                        new: "bg-blue-500", matching: "bg-yellow-500",
                                        available: "bg-amber-500", fulfilled: "bg-emerald-500",
                                        expired: "bg-gray-500", cancelled: "bg-red-500",
                                    };
                                    return (
                                        <div key={status}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-400 capitalize">{status}</span>
                                                <span className="text-gray-500">{count} ({pct}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${colors[status] || "bg-gray-500"}`}
                                                    style={{ width: `${Math.max(pct, 2)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Drafts */}
                    {draftArticles.length > 0 && (
                        <div className="bg-gray-800 rounded-xl border border-yellow-700/40 p-5">
                            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <span className="text-yellow-400">⚠</span> Concepten ({draftArticles.length})
                            </h2>
                            <div className="space-y-1.5">
                                {draftArticles.slice(0, 5).map(draft => (
                                    <Link
                                        key={draft.id}
                                        href={`/admin/articles/${draft.id}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-sm"
                                    >
                                        <span className="truncate">{draft.title}</span>
                                        <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                                            {new Date(draft.updatedAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                                        </span>
                                    </Link>
                                ))}
                                {draftArticles.length > 5 && (
                                    <Link href="/admin/articles?status=draft" className="text-xs text-amber-400 hover:underline block pt-1">
                                        +{draftArticles.length - 5} meer →
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content Health */}
                    {healthIssues > 0 && (
                        <div className="bg-gray-800 rounded-xl border border-red-700/30 p-5">
                            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <span className="text-red-400">🔴</span> Content health ({healthIssues} issues)
                            </h2>
                            <div className="space-y-2 text-sm">
                                {missingSeoParts.length > 0 && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-yellow-400">⚠</span>
                                        {missingSeoParts.length} artikel(en) missen SEO title/description
                                    </div>
                                )}
                                {missingImages.length > 0 && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-yellow-400">⚠</span>
                                        {missingImages.length} artikel(en) missen featured image
                                    </div>
                                )}
                                {missingGeoSeo.length > 0 && (
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <span className="text-yellow-400">⚠</span>
                                        {missingGeoSeo.length} pagina&apos;s missen SEO fields
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
