/**
 * Pages Management — /admin/pages
 * SEO landing page management
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageItem {
    id: string;
    title: string;
    slug: string;
    status: string;
    city: string | null;
    service: string | null;
    updatedAt: string;
}

export default function PagesListPage() {
    const router = useRouter();
    const [pages, setPages] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function loadPages() {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await fetch(`/api/admin/pages?${params}`);
        if (res.ok) {
            const data = await res.json();
            setPages(data.pages || []);
        }
        setLoading(false);
    }

    useEffect(() => { loadPages(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => loadPages(), 300);
        return () => clearTimeout(timer);
    }, [search]);

    async function handleDelete(id: string) {
        if (!confirm("Pagina verwijderen?")) return;
        await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
        loadPages();
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Pagina&apos;s</h1>
                    <p className="text-sm text-gray-400 mt-1">{pages.length} pagina&apos;s</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="px-4 py-2.5 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400"
                >
                    + Nieuwe pagina
                </Link>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Zoek op titel..."
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 w-64 mb-4"
            />

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Laden...</div>
                ) : pages.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">Geen pagina&apos;s gevonden.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-700">
                                <th className="px-4 py-3">Titel</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Stad</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Gewijzigd</th>
                                <th className="px-4 py-3 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {pages.map(page => (
                                <tr
                                    key={page.id}
                                    className="hover:bg-gray-750 cursor-pointer"
                                    onClick={() => router.push(`/admin/pages/${page.id}`)}
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{page.title}</div>
                                        <div className="text-xs text-gray-500">/{page.slug}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            page.status === "published"
                                                ? "bg-emerald-900 text-emerald-300"
                                                : "bg-gray-700 text-gray-300"
                                        }`}>
                                            {page.status === "published" ? "Gepubliceerd" : "Concept"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{page.city || "—"}</td>
                                    <td className="px-4 py-3 text-gray-400">{page.service || "—"}</td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {new Date(page.updatedAt).toLocaleDateString("nl-NL")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDelete(page.id); }}
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
        </div>
    );
}
