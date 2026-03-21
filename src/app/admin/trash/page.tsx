/**
 * Trash Page — /admin/trash
 * View and restore soft-deleted items
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface TrashItem {
    id: string;
    title?: string;
    filename?: string;
    slug?: string;
    city?: string;
    status?: string;
    url?: string;
    deletedAt: string;
}

type EntityType = "article" | "page" | "media";

function timeAgo(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffDay === 0) return "Vandaag";
    if (diffDay === 1) return "Gisteren";
    if (diffDay < 7) return `${diffDay}d geleden`;
    return d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default function TrashPage() {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<TrashItem[]>([]);
    const [pages, setPages] = useState<TrashItem[]>([]);
    const [media, setMedia] = useState<TrashItem[]>([]);
    const [tab, setTab] = useState<EntityType>("article");
    const [restoring, setRestoring] = useState<string | null>(null);

    const loadTrash = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/trash");
            if (res.ok) {
                const d = await res.json();
                setArticles(d.articles || []);
                setPages(d.pages || []);
                setMedia(d.media || []);
            }
        } catch {}
        setLoading(false);
    }, []);

    useEffect(() => { loadTrash(); }, [loadTrash]);

    async function handleRestore(type: EntityType, id: string) {
        setRestoring(id);
        const res = await fetch(`/api/admin/trash/${type}/${id}`, { method: "POST" });
        if (res.ok) {
            success("Hersteld");
            loadTrash();
        } else {
            error("Herstellen mislukt");
        }
        setRestoring(null);
    }

    async function handlePermanentDelete(type: EntityType, id: string) {
        if (!confirm("Weet je zeker dat je dit PERMANENT wilt verwijderen? Dit kan niet ongedaan worden.")) return;
        const res = await fetch(`/api/admin/trash/${type}/${id}`, { method: "DELETE" });
        if (res.ok) {
            success("Permanent verwijderd");
            loadTrash();
        } else {
            error("Verwijderen mislukt");
        }
    }

    const items = tab === "article" ? articles : tab === "page" ? pages : media;
    const totalCount = articles.length + pages.length + media.length;

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Prullenbak" }]} />
            <h1 className="text-2xl font-bold mb-1">🗑️ Prullenbak</h1>
            <p className="text-sm text-gray-400 mb-5">
                {totalCount} verwijderde items — herstel of verwijder permanent
            </p>

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
                {([
                    { key: "article" as EntityType, label: "Artikelen", count: articles.length },
                    { key: "page" as EntityType, label: "Pagina's", count: pages.length },
                    { key: "media" as EntityType, label: "Media", count: media.length },
                ]).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            tab === t.key
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:text-gray-300"
                        }`}
                    >
                        {t.label} ({t.count})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-400">
                    <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                    Laden...
                </div>
            ) : items.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">🗑️</div>
                    <p>Prullenbak is leeg</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3 flex items-center gap-3"
                        >
                            <div className="text-lg">
                                {tab === "article" ? "📄" : tab === "page" ? "📃" : "🖼️"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-200 truncate">
                                    {item.title || item.filename || "Zonder titel"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.slug && <span>/{item.slug}</span>}
                                    {item.city && <span> · {item.city}</span>}
                                    <span> · Verwijderd {timeAgo(item.deletedAt)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRestore(tab, item.id)}
                                disabled={restoring === item.id}
                                className="px-3 py-1.5 bg-emerald-700 text-emerald-200 rounded-lg text-xs hover:bg-emerald-600 disabled:opacity-50"
                            >
                                {restoring === item.id ? "..." : "♻️ Herstel"}
                            </button>
                            <button
                                onClick={() => handlePermanentDelete(tab, item.id)}
                                className="px-3 py-1.5 bg-red-900/50 text-red-300 rounded-lg text-xs hover:bg-red-800/70"
                            >
                                🗑️ Permanent
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
