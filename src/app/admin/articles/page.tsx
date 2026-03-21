/**
 * Articles List — /admin/articles
 * WordPress-style: status tabs, row hover actions, search, filters, sorting, pagination, bulk actions
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListTable, { type Column, type BulkAction, type FilterConfig } from "@/components/admin/list-table";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface Article {
    id: string;
    title: string;
    slug: string;
    status: string;
    category: string | null;
    featuredImage: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    publishedAt: string | null;
    updatedAt: string;
    author: { name: string } | null;
}

const statusLabels: Record<string, string> = {
    draft: "Concept",
    published: "Gepubliceerd",
    scheduled: "Ingepland",
};

const statusColors: Record<string, string> = {
    draft: "bg-gray-600 text-gray-200",
    published: "bg-emerald-900/80 text-emerald-300",
    scheduled: "bg-blue-900/80 text-blue-300",
};

/* ── Status counts type ── */
interface StatusCounts {
    all: number;
    published: number;
    draft: number;
    scheduled: number;
}

export default function ArticlesPage() {
    const router = useRouter();
    const { success, error } = useToast();

    const [articles, setArticles] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("updatedAt");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [statusCounts, setStatusCounts] = useState<StatusCounts>({ all: 0, published: 0, draft: 0, scheduled: 0 });
    const perPage = 20;

    const loadArticles = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({
            page: String(page),
            limit: String(perPage),
            sortBy,
            sortDir,
        });
        if (statusFilter) params.set("status", statusFilter);
        if (categoryFilter) params.set("category", categoryFilter);
        if (search) params.set("search", search);

        try {
            const res = await fetch(`/api/admin/articles?${params}`);
            if (res.ok) {
                const data = await res.json();
                setArticles(data.articles);
                setTotal(data.total);
                // Update status counts if API provides them
                if (data.statusCounts) {
                    setStatusCounts(data.statusCounts);
                } else {
                    // Fallback: use total for 'all'
                    setStatusCounts(prev => ({ ...prev, all: data.total }));
                }
            }
        } catch {}
        setLoading(false);
    }, [page, perPage, sortBy, sortDir, statusFilter, categoryFilter, search]);

    // Load counts separately (once)
    useEffect(() => {
        async function loadCounts() {
            try {
                const [allRes, pubRes, draftRes] = await Promise.all([
                    fetch("/api/admin/articles?limit=1"),
                    fetch("/api/admin/articles?limit=1&status=published"),
                    fetch("/api/admin/articles?limit=1&status=draft"),
                ]);
                const [allData, pubData, draftData] = await Promise.all([
                    allRes.ok ? allRes.json() : { total: 0 },
                    pubRes.ok ? pubRes.json() : { total: 0 },
                    draftRes.ok ? draftRes.json() : { total: 0 },
                ]);
                setStatusCounts({
                    all: allData.total || 0,
                    published: pubData.total || 0,
                    draft: draftData.total || 0,
                    scheduled: Math.max(0, (allData.total || 0) - (pubData.total || 0) - (draftData.total || 0)),
                });
            } catch {}
        }
        loadCounts();
    }, []);

    useEffect(() => { loadArticles(); }, [loadArticles]);

    // Debounced search
    const [searchInput, setSearchInput] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    function handleSort(key: string) {
        if (sortBy === key) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortDir("desc");
        }
        setPage(1);
    }

    function seoComplete(article: Article): boolean {
        return !!(article.seoTitle && article.seoDescription);
    }

    // Delete single article
    async function deleteArticle(id: string, title: string) {
        if (!confirm(`"${title}" verwijderen?`)) return;
        try {
            const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
            if (res.ok) { success("Artikel verwijderd"); loadArticles(); }
            else error("Verwijderen mislukt");
        } catch { error("Verwijderen mislukt"); }
    }

    const columns: Column<Article>[] = [
        {
            key: "title",
            label: "Titel",
            sortable: true,
            render: (row) => (
                <div className="group/row">
                    <div className="flex items-center gap-3">
                        {row.featuredImage ? (
                            <img src={row.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                                </svg>
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="font-medium truncate">{row.title}</div>
                            <div className="text-xs text-gray-500 truncate">/{row.slug}</div>
                            {/* Row hover actions — WordPress style */}
                            <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                <Link
                                    href={`/admin/articles/${row.id}`}
                                    className="text-[11px] text-amber-400 hover:text-amber-300"
                                    onClick={e => e.stopPropagation()}
                                >
                                    Bewerken
                                </Link>
                                <span className="text-gray-600 text-[11px]">|</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteArticle(row.id, row.title); }}
                                    className="text-[11px] text-red-400 hover:text-red-300"
                                >
                                    Verwijderen
                                </button>
                                {row.status === "published" && (
                                    <>
                                        <span className="text-gray-600 text-[11px]">|</span>
                                        <a
                                            href={`/kenniscentrum/${row.slug}`}
                                            target="_blank"
                                            rel="noopener"
                                            className="text-[11px] text-gray-400 hover:text-gray-300"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            Bekijk
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "w-28",
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[row.status] || "bg-gray-700 text-gray-300"}`}>
                    {statusLabels[row.status] || row.status}
                </span>
            ),
        },
        {
            key: "category",
            label: "Categorie",
            sortable: true,
            width: "w-28",
            render: (row) => (
                <span className="text-gray-400 text-xs capitalize">{row.category || "—"}</span>
            ),
        },
        {
            key: "seo",
            label: "SEO",
            width: "w-16",
            render: (row) => (
                <span title={seoComplete(row) ? "SEO compleet" : "SEO onvolledig"} className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                    seoComplete(row) ? "bg-emerald-900/50 text-emerald-400" : "bg-yellow-900/50 text-yellow-400"
                }`}>
                    {seoComplete(row) ? "✓" : "!"}
                </span>
            ),
        },
        {
            key: "updatedAt",
            label: "Gewijzigd",
            sortable: true,
            width: "w-28",
            render: (row) => (
                <div className="text-xs">
                    <div className="text-gray-400">{new Date(row.updatedAt).toLocaleDateString("nl-NL")}</div>
                    <div className="text-gray-600">{new Date(row.updatedAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
            ),
        },
    ];

    const bulkActions: BulkAction[] = [
        {
            label: "Publiceren",
            action: async (ids) => {
                const res = await fetch("/api/admin/articles/bulk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids, action: "publish" }),
                });
                if (res.ok) { success(`${ids.length} artikel(en) gepubliceerd`); loadArticles(); }
                else error("Publiceren mislukt");
            },
        },
        {
            label: "Concept",
            action: async (ids) => {
                const res = await fetch("/api/admin/articles/bulk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids, action: "draft" }),
                });
                if (res.ok) { success(`${ids.length} artikel(en) naar concept`); loadArticles(); }
                else error("Update mislukt");
            },
        },
        {
            label: "Verwijderen",
            variant: "danger",
            action: async (ids) => {
                if (!confirm(`${ids.length} artikel(en) definitief verwijderen?`)) return;
                const res = await fetch("/api/admin/articles/bulk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids, action: "delete" }),
                });
                if (res.ok) { success(`${ids.length} artikel(en) verwijderd`); loadArticles(); }
                else error("Verwijderen mislukt");
            },
        },
    ];

    /* ── Status tabs ── */
    const statusTabs = [
        { key: "", label: "Alle", count: statusCounts.all },
        { key: "published", label: "Gepubliceerd", count: statusCounts.published },
        { key: "draft", label: "Concept", count: statusCounts.draft },
        { key: "scheduled", label: "Ingepland", count: statusCounts.scheduled },
    ];

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Artikelen" }]} />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Artikelen</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{statusCounts.all} artikelen totaal</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="px-4 py-2.5 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-2"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Nieuw artikel
                </Link>
            </div>

            {/* ── Status Tab Bar (WordPress-style) ── */}
            <div className="flex items-center gap-1 mb-4 border-b border-gray-700 -mx-4 lg:-mx-6 px-4 lg:px-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => { setStatusFilter(tab.key); setPage(1); }}
                        className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                            statusFilter === tab.key
                                ? "border-amber-400 text-amber-400"
                                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                        }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                statusFilter === tab.key
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-gray-700 text-gray-400"
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <ListTable
                data={articles}
                columns={columns}
                total={total}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
                loading={loading}
                search={searchInput}
                onSearch={setSearchInput}
                searchPlaceholder="Zoek op titel..."
                bulkActions={bulkActions}
                onRowClick={(row) => router.push(`/admin/articles/${row.id}`)}
                emptyMessage="Geen artikelen gevonden."
                emptyAction={
                    <Link href="/admin/articles/new" className="text-amber-400 hover:underline text-sm">
                        Maak je eerste artikel →
                    </Link>
                }
            />
        </div>
    );
}
