/**
 * Articles List — /admin/articles
 * Full CMS list with ListTable: search, filters, sorting, pagination, bulk actions
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
            }
        } catch {}
        setLoading(false);
    }, [page, perPage, sortBy, sortDir, statusFilter, categoryFilter, search]);

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

    // SEO completeness check
    function seoComplete(article: Article): boolean {
        return !!(article.seoTitle && article.seoDescription);
    }

    const columns: Column<Article>[] = [
        {
            key: "title",
            label: "Titel",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.featuredImage ? (
                        <img src={row.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs shrink-0">📝</div>
                    )}
                    <div className="min-w-0">
                        <div className="font-medium truncate">{row.title}</div>
                        <div className="text-xs text-gray-500 truncate">/{row.slug}</div>
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
                <span className="text-gray-400 text-xs">{row.category || "—"}</span>
            ),
        },
        {
            key: "seo",
            label: "SEO",
            width: "w-16",
            render: (row) => (
                <span className={`text-xs ${seoComplete(row) ? "text-emerald-400" : "text-yellow-400"}`}>
                    {seoComplete(row) ? "✓" : "⚠"}
                </span>
            ),
        },
        {
            key: "updatedAt",
            label: "Gewijzigd",
            sortable: true,
            width: "w-24",
            render: (row) => (
                <span className="text-gray-400 text-xs">
                    {new Date(row.updatedAt).toLocaleDateString("nl-NL")}
                </span>
            ),
        },
        {
            key: "actions",
            label: "",
            width: "w-20",
            render: (row) => (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {row.status === "published" && (
                        <a
                            href={`/kenniscentrum/${row.slug}`}
                            target="_blank"
                            rel="noopener"
                            className="text-gray-500 hover:text-amber-400 text-xs"
                            title="Bekijk op site"
                        >
                            🌐
                        </a>
                    )}
                </div>
            ),
        },
    ];

    const filters: FilterConfig[] = [
        {
            key: "status",
            label: "Alle statussen",
            options: [
                { value: "published", label: "Gepubliceerd" },
                { value: "draft", label: "Concept" },
                { value: "scheduled", label: "Ingepland" },
            ],
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
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

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Artikelen" }]} />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold">Artikelen</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{total} artikelen totaal</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="px-4 py-2.5 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                    + Nieuw artikel
                </Link>
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
                filters={filters}
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
