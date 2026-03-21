/**
 * Audit Log — /admin/audit-log
 * Real audit trail from audit_events table with filters
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import Link from "next/link";

interface AuditEvent {
    id: string;
    actorId: string | null;
    actorName: string | null;
    action: string;
    entityType: string;
    entityId: string | null;
    entityTitle: string | null;
    diff: Record<string, { old: unknown; new: unknown }> | null;
    ipAddress: string | null;
    createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
    create: "Aangemaakt",
    update: "Bijgewerkt",
    delete: "Verwijderd",
    restore: "Hersteld",
    publish: "Gepubliceerd",
    status_change: "Status gewijzigd",
    export: "Geëxporteerd",
    login: "Ingelogd",
};

const ACTION_ICONS: Record<string, string> = {
    create: "🆕",
    update: "✏️",
    delete: "🗑️",
    restore: "♻️",
    publish: "🚀",
    status_change: "🔄",
    export: "📥",
    login: "🔑",
};

const ENTITY_HREFS: Record<string, (id: string) => string> = {
    article: (id) => `/admin/articles/${id}`,
    page: (id) => `/admin/pages/${id}`,
    lead: (id) => `/admin/leads`,
    company: (id) => `/admin/companies/${id}`,
    media: (id) => `/admin/media`,
};

function timeAgo(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Zojuist";
    if (diffMin < 60) return `${diffMin}m geleden`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}u geleden`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay === 1) return "Gisteren";
    if (diffDay < 7) return `${diffDay}d geleden`;
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function AuditLogPage() {
    const [events, setEvents] = useState<AuditEvent[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [entityTypeFilter, setEntityTypeFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const perPage = 50;

    const loadEvents = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({
            page: String(page),
            limit: String(perPage),
        });
        if (entityTypeFilter) params.set("entityType", entityTypeFilter);
        if (actionFilter) params.set("action", actionFilter);

        try {
            const res = await fetch(`/api/admin/audit-log?${params}`);
            if (res.ok) {
                const d = await res.json();
                setEvents(d.events || []);
                setTotal(d.total || 0);
            }
        } catch {}
        setLoading(false);
    }, [page, entityTypeFilter, actionFilter]);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Audit Log" }]} />
            <h1 className="text-2xl font-bold mb-1">Audit Log</h1>
            <p className="text-sm text-gray-400 mb-5">Alle wijzigingen door gebruikers en systeem</p>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
                <select
                    value={entityTypeFilter}
                    onChange={e => { setEntityTypeFilter(e.target.value); setPage(1); }}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                >
                    <option value="">Alle types</option>
                    <option value="article">Artikelen</option>
                    <option value="page">Pagina&apos;s</option>
                    <option value="lead">Leads</option>
                    <option value="company">Bedrijven</option>
                    <option value="media">Media</option>
                    <option value="settings">Instellingen</option>
                </select>
                <select
                    value={actionFilter}
                    onChange={e => { setActionFilter(e.target.value); setPage(1); }}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm"
                >
                    <option value="">Alle acties</option>
                    <option value="create">Aangemaakt</option>
                    <option value="update">Bijgewerkt</option>
                    <option value="delete">Verwijderd</option>
                    <option value="publish">Gepubliceerd</option>
                    <option value="status_change">Status gewijzigd</option>
                    <option value="restore">Hersteld</option>
                </select>
                <span className="text-xs text-gray-500 self-center ml-auto">{total} events</span>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-400">
                    <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                    Laden...
                </div>
            ) : events.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">📋</div>
                    <p>Geen audit events gevonden</p>
                    <p className="text-xs mt-1">Events verschijnen hier zodra er wijzigingen worden gemaakt</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {events.map(event => {
                        const href = event.entityId && ENTITY_HREFS[event.entityType]
                            ? ENTITY_HREFS[event.entityType](event.entityId)
                            : null;
                        const isExpanded = expandedId === event.id;

                        return (
                            <div
                                key={event.id}
                                className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">{ACTION_ICONS[event.action] || "📝"}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium text-gray-200">
                                                {event.actorName || "System"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {ACTION_LABELS[event.action] || event.action}
                                            </span>
                                            <span className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">
                                                {event.entityType}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {href ? (
                                                <Link href={href} className="text-sm text-amber-400 hover:underline truncate">
                                                    {event.entityTitle || event.entityId}
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-gray-400 truncate">
                                                    {event.entityTitle || event.entityId || "—"}
                                                </span>
                                            )}
                                        </div>
                                        {/* Expandable diff */}
                                        {event.diff && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                                className="text-xs text-gray-500 hover:text-gray-300 mt-1"
                                            >
                                                {isExpanded ? "▼ Verberg wijzigingen" : "▶ Bekijk wijzigingen"}
                                            </button>
                                        )}
                                        {isExpanded && event.diff && (
                                            <div className="mt-2 bg-gray-900 rounded p-3 text-xs space-y-1">
                                                {Object.entries(event.diff).map(([field, { old: oldVal, new: newVal }]) => (
                                                    <div key={field}>
                                                        <span className="text-gray-500">{field}:</span>{" "}
                                                        <span className="text-red-400 line-through">{String(oldVal ?? "—")}</span>
                                                        {" → "}
                                                        <span className="text-emerald-400">{String(newVal ?? "—")}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap mt-0.5">
                                        {timeAgo(event.createdAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm disabled:opacity-40"
                    >
                        ←
                    </button>
                    <span className="text-sm text-gray-400">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm disabled:opacity-40"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
