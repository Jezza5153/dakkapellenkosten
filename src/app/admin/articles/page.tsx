/**
 * Articles List — /admin/articles
 * View, search, filter, and manage all articles
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Article {
    id: string;
    title: string;
    slug: string;
    status: string;
    category: string | null;
    publishedAt: string | null;
    updatedAt: string;
    author: { name: string } | null;
}

export default function ArticlesPage() {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    async function loadArticles() {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (search) params.set("search", search);

        const res = await fetch(`/api/admin/articles?${params}`);
        if (res.ok) {
            const data = await res.json();
            setArticles(data.articles);
            setTotal(data.total);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadArticles();
    }, [statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => loadArticles(), 300);
        return () => clearTimeout(timer);
    }, [search]);

    async function handleDelete() {
        if (!deleteId) return;
        await fetch(`/api/admin/articles/${deleteId}`, { method: "DELETE" });
        setDeleteId(null);
        loadArticles();
    }

    const statusColors: Record<string, string> = {
        draft: "bg-gray-700 text-gray-300",
        published: "bg-emerald-900 text-emerald-300",
        scheduled: "bg-blue-900 text-blue-300",
    };

    const statusLabels: Record<string, string> = {
        draft: "Concept",
        published: "Gepubliceerd",
        scheduled: "Ingepland",
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Artikelen</h1>
                    <p className="text-sm text-gray-400 mt-1">{total} artikelen totaal</p>
                </div>
                <Link
                    href="/admin/articles/new"
                    className="px-4 py-2.5 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 transition-colors"
                >
                    + Nieuw artikel
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Zoek op titel..."
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 w-64"
                />
                <div className="flex gap-1">
                    {["all", "draft", "published", "scheduled"].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                statusFilter === s
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-400 hover:text-gray-200"
                            }`}
                        >
                            {s === "all" ? "Alles" : statusLabels[s]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Laden...</div>
                ) : articles.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Geen artikelen gevonden.{" "}
                        <Link href="/admin/articles/new" className="text-amber-400 hover:underline">
                            Maak je eerste artikel
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-700">
                                <th className="px-4 py-3">Titel</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Categorie</th>
                                <th className="px-4 py-3">Auteur</th>
                                <th className="px-4 py-3">Gewijzigd</th>
                                <th className="px-4 py-3 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {articles.map(article => (
                                <tr
                                    key={article.id}
                                    className="hover:bg-gray-750 cursor-pointer"
                                    onClick={() => router.push(`/admin/articles/${article.id}`)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{article.title}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">/{article.slug}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[article.status]}`}>
                                            {statusLabels[article.status] || article.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{article.category || "—"}</td>
                                    <td className="px-4 py-3 text-gray-400">{article.author?.name || "—"}</td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {new Date(article.updatedAt).toLocaleDateString("nl-NL")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={e => { e.stopPropagation(); setDeleteId(article.id); }}
                                            className="text-red-400 hover:text-red-300 text-xs"
                                        >
                                            Verwijderen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-2">Artikel verwijderen?</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Dit kan niet ongedaan worden gemaakt.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                            >
                                Verwijderen
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                            >
                                Annuleren
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
