/**
 * Redirects Manager — /admin/redirects
 * Create, view, delete 301/302 redirects
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface Redirect {
    id: string;
    fromPath: string;
    toPath: string;
    statusCode: number;
    hitCount: number;
    createdAt: string;
}

export default function RedirectsPage() {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(true);
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [total, setTotal] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [fromPath, setFromPath] = useState("");
    const [toPath, setToPath] = useState("");
    const [statusCode, setStatusCode] = useState(301);
    const [saving, setSaving] = useState(false);

    const loadRedirects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/redirects");
            if (res.ok) {
                const d = await res.json();
                setRedirects(d.redirects || []);
                setTotal(d.total || 0);
            }
        } catch {}
        setLoading(false);
    }, []);

    useEffect(() => { loadRedirects(); }, [loadRedirects]);

    async function handleCreate() {
        if (!fromPath.trim() || !toPath.trim()) return;
        setSaving(true);
        const res = await fetch("/api/admin/redirects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fromPath, toPath, statusCode }),
        });
        if (res.ok) {
            success("Redirect aangemaakt");
            setFromPath("");
            setToPath("");
            setShowForm(false);
            loadRedirects();
        } else {
            const d = await res.json();
            error(d.error || "Aanmaken mislukt");
        }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Redirect verwijderen?")) return;
        const res = await fetch(`/api/admin/redirects/${id}`, { method: "DELETE" });
        if (res.ok) {
            success("Redirect verwijderd");
            loadRedirects();
        } else {
            error("Verwijderen mislukt");
        }
    }

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Redirects" }]} />

            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold">🔀 Redirects</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{total} actieve redirects</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-500"
                >
                    {showForm ? "Annuleren" : "+ Nieuwe redirect"}
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-5">
                    <h3 className="text-sm font-semibold mb-3">Nieuwe redirect</h3>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Van pad</label>
                            <input
                                type="text"
                                value={fromPath}
                                onChange={e => setFromPath(e.target.value)}
                                placeholder="/oud-pad/pagina"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Naar pad</label>
                            <input
                                type="text"
                                value={toPath}
                                onChange={e => setToPath(e.target.value)}
                                placeholder="/nieuw-pad/pagina"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Type</label>
                            <select
                                value={statusCode}
                                onChange={e => setStatusCode(Number(e.target.value))}
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value={301}>301 Permanent</option>
                                <option value={302}>302 Tijdelijk</option>
                            </select>
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={saving || !fromPath.trim() || !toPath.trim()}
                            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-500 disabled:opacity-50"
                        >
                            {saving ? "..." : "Aanmaken"}
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="p-8 text-center text-gray-400">
                    <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                    Laden...
                </div>
            ) : redirects.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">🔀</div>
                    <p>Geen redirects</p>
                    <p className="text-xs mt-1">Maak een redirect aan wanneer je een pagina verplaatst</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {redirects.map(r => (
                        <div
                            key={r.id}
                            className="bg-gray-800 rounded-lg border border-gray-700 px-4 py-3 flex items-center gap-3"
                        >
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                                r.statusCode === 301 ? "bg-blue-900/50 text-blue-300" : "bg-yellow-900/50 text-yellow-300"
                            }`}>
                                {r.statusCode}
                            </span>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <code className="text-sm text-red-400 truncate">{r.fromPath}</code>
                                <span className="text-gray-600">→</span>
                                <code className="text-sm text-emerald-400 truncate">{r.toPath}</code>
                            </div>
                            <span className="text-xs text-gray-500">{r.hitCount} hits</span>
                            <button
                                onClick={() => handleDelete(r.id)}
                                className="text-gray-500 hover:text-red-400 text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
