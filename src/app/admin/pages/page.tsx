/**
 * Pages List — /admin/pages
 * Full CMS list with ListTable: search, filters, sorting, pagination, bulk actions
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ListTable, { type Column, type BulkAction, type FilterConfig } from "@/components/admin/list-table";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface PageItem {
    id: string;
    title: string;
    slug: string;
    status: string;
    city: string | null;
    service: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    updatedAt: string;
}

export default function PagesListPage() {
    const router = useRouter();
    const { success, error } = useToast();

    const [pages, setPages] = useState<PageItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("updatedAt");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const perPage = 20;

    const loadPages = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({
            page: String(page),
            limit: String(perPage),
            sortBy,
            sortDir,
        });
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);

        try {
            const res = await fetch(`/api/admin/pages?${params}`);
            if (res.ok) {
                const data = await res.json();
                setPages(data.pages || []);
                setTotal(data.total || 0);
            }
        } catch {}
        setLoading(false);
    }, [page, perPage, sortBy, sortDir, statusFilter, search]);

    useEffect(() => { loadPages(); }, [loadPages]);

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

    function seoComplete(p: PageItem): boolean {
        return !!(p.seoTitle && p.seoDescription);
    }

    function geoComplete(p: PageItem): boolean {
        return !!(p.city && p.seoTitle && p.seoDescription);
    }

    const columns: Column<PageItem>[] = [
        {
            key: "title",
            label: "Titel",
            sortable: true,
            render: (row) => (
                <div>
                    <div className="font-medium">{row.title}</div>
                    <div className="text-xs text-gray-500">/{row.slug}</div>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "w-28",
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    row.status === "published"
                        ? "bg-emerald-900/80 text-emerald-300"
                        : "bg-gray-600 text-gray-200"
                }`}>
                    {row.status === "published" ? "Gepubliceerd" : "Concept"}
                </span>
            ),
        },
        {
            key: "city",
            label: "Stad",
            sortable: true,
            width: "w-28",
            render: (row) => (
                <span className="text-gray-400 text-xs">{row.city || "—"}</span>
            ),
        },
        {
            key: "service",
            label: "Service",
            width: "w-24",
            render: (row) => (
                <span className="text-gray-400 text-xs">{row.service || "—"}</span>
            ),
        },
        {
            key: "seo",
            label: "SEO",
            width: "w-16",
            render: (row) => {
                const complete = row.city ? geoComplete(row) : seoComplete(row);
                return (
                    <span className={`text-xs ${complete ? "text-emerald-400" : "text-yellow-400"}`}>
                        {complete ? "✓" : "⚠"}
                    </span>
                );
            },
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
            width: "w-16",
            render: (row) => (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {row.status === "published" && (
                        <a
                            href={`/${row.slug}`}
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
            ],
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
        },
    ];

    const bulkActions: BulkAction[] = [
        {
            label: "Publiceren",
            action: async (ids) => {
                for (const id of ids) {
                    await fetch(`/api/admin/pages/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "published" }),
                    });
                }
                success(`${ids.length} pagina('s) gepubliceerd`);
                loadPages();
            },
        },
        {
            label: "Concept",
            action: async (ids) => {
                for (const id of ids) {
                    await fetch(`/api/admin/pages/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "draft" }),
                    });
                }
                success(`${ids.length} pagina('s) naar concept`);
                loadPages();
            },
        },
        {
            label: "Verwijderen",
            variant: "danger",
            action: async (ids) => {
                if (!confirm(`${ids.length} pagina('s) definitief verwijderen?`)) return;
                for (const id of ids) {
                    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
                }
                success(`${ids.length} pagina('s) verwijderd`);
                loadPages();
            },
        },
    ];

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Pagina's" }]} />

            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold">Pagina&apos;s</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{total} pagina&apos;s totaal</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="px-4 py-2.5 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                    + Nieuwe pagina
                </Link>
            </div>

            <ListTable
                data={pages}
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
                searchPlaceholder="Zoek op titel of stad..."
                filters={filters}
                bulkActions={bulkActions}
                onRowClick={(row) => router.push(`/admin/pages/${row.id}`)}
                emptyMessage="Geen pagina's gevonden."
                emptyAction={
                    <Link href="/admin/pages/new" className="text-amber-400 hover:underline text-sm">
                        Maak je eerste pagina →
                    </Link>
                }
            />
        </div>
    );
}
