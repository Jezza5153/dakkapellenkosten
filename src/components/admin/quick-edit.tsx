/**
 * Quick Edit Modal — Inline editing from list views
 * Edit title, slug, status, category, SEO fields without leaving the list
 */
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/admin/toast";

interface QuickEditProps {
    open: boolean;
    type: "article" | "page";
    data: {
        id: string;
        title: string;
        slug: string;
        status: string;
        category?: string;
        seoTitle?: string;
        seoDescription?: string;
        city?: string;
        service?: string;
    };
    onClose: () => void;
    onSaved: () => void;
}

const CATEGORIES = [
    { value: "", label: "— Geen —" },
    { value: "kosten", label: "Kosten" },
    { value: "vergunning", label: "Vergunning" },
    { value: "materialen", label: "Materialen" },
    { value: "plaatsing", label: "Plaatsing" },
    { value: "onderhoud", label: "Onderhoud" },
    { value: "keuzehulp", label: "Keuzehulp" },
];

export default function QuickEdit({ open, type, data, onClose, onSaved }: QuickEditProps) {
    const { success, error } = useToast();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(data);

    useEffect(() => { setForm(data); }, [data]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    async function handleSave() {
        setSaving(true);
        const url = type === "article"
            ? `/api/admin/articles/${form.id}`
            : `/api/admin/pages/${form.id}`;

        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                success("Bijgewerkt ✓");
                onSaved();
                onClose();
            } else {
                const err = await res.json();
                error(err.error || "Opslaan mislukt");
            }
        } catch {
            error("Opslaan mislukt");
        }
        setSaving(false);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                    <h2 className="font-semibold">Snel bewerken</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                <div className="p-5 space-y-3">
                    {/* Title */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Titel</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Slug</label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Status */}
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Status</label>
                            <select
                                value={form.status}
                                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none cursor-pointer"
                            >
                                <option value="draft">Concept</option>
                                <option value="published">Gepubliceerd</option>
                                <option value="scheduled">Ingepland</option>
                            </select>
                        </div>

                        {/* Category (articles only) */}
                        {type === "article" && (
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Categorie</label>
                                <select
                                    value={form.category || ""}
                                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none cursor-pointer"
                                >
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                        )}

                        {/* City/Service (pages only) */}
                        {type === "page" && (
                            <>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Stad</label>
                                    <input
                                        type="text"
                                        value={form.city || ""}
                                        onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* SEO Title */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">SEO Titel</label>
                        <input
                            type="text"
                            value={form.seoTitle || ""}
                            onChange={e => setForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                            placeholder={form.title}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                        />
                        <div className={`text-[10px] mt-0.5 ${(form.seoTitle || form.title).length <= 60 ? "text-emerald-400" : "text-yellow-400"}`}>
                            {(form.seoTitle || form.title).length}/60
                        </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Meta beschrijving</label>
                        <textarea
                            value={form.seoDescription || ""}
                            onChange={e => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                            rows={2}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400 resize-none"
                        />
                        <div className={`text-[10px] mt-0.5 ${(form.seoDescription || "").length <= 155 ? "text-emerald-400" : "text-yellow-400"}`}>
                            {(form.seoDescription || "").length}/155
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-700">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                        Annuleren
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.title}
                        className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
                    >
                        {saving ? "..." : "Opslaan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
