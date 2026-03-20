/**
 * Edit Page — /admin/pages/[id]
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/components/editor/tiptap-editor"), { ssr: false });

export default function EditPageForm() {
    const router = useRouter();
    const params = useParams();
    const pageId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        title: "", slug: "", content: "", seoTitle: "", seoDescription: "",
        city: "", service: "", status: "draft" as "draft" | "published",
    });

    useEffect(() => {
        fetch(`/api/admin/pages/${pageId}`)
            .then(r => r.json())
            .then(d => {
                if (d.page) {
                    setData({
                        title: d.page.title || "", slug: d.page.slug || "",
                        content: d.page.content || "", seoTitle: d.page.seoTitle || "",
                        seoDescription: d.page.seoDescription || "",
                        city: d.page.city || "", service: d.page.service || "",
                        status: d.page.status || "draft",
                    });
                }
                setLoading(false);
            })
            .catch(() => router.push("/admin/pages"));
    }, [pageId, router]);

    function updateField(field: string, value: string) {
        setData(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave(status?: "draft" | "published") {
        setSaving(true);
        const payload = { ...data };
        if (status) payload.status = status;

        const res = await fetch(`/api/admin/pages/${pageId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.error || "Opslaan mislukt");
        }
        setSaving(false);
    }

    if (loading) return <div className="p-8 text-center text-gray-400">Laden...</div>;

    return (
        <div className="p-6 lg:p-8 max-w-[1200px]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push("/admin/pages")} className="text-gray-400 hover:text-white text-sm">← Terug</button>
                    <h1 className="text-xl font-bold">Pagina bewerken</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleSave("draft")} disabled={saving} className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50">Concept</button>
                    <button onClick={() => handleSave("published")} disabled={saving} className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50">Publiceren</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-4">
                    <input type="text" value={data.title} onChange={e => updateField("title", e.target.value)} placeholder="Pagina titel..." className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-lg font-semibold text-white outline-none focus:border-amber-400" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">/</span>
                        <input type="text" value={data.slug} onChange={e => updateField("slug", e.target.value)} placeholder="pagina-slug" className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 outline-none focus:border-amber-400" />
                    </div>
                    <TipTapEditor content={data.content} onChange={(html) => updateField("content", html)} />
                </div>
                <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Locatie targeting</h3>
                        <input type="text" value={data.city} onChange={e => updateField("city", e.target.value)} placeholder="Stad" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400" />
                        <input type="text" value={data.service} onChange={e => updateField("service", e.target.value)} placeholder="Service" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400" />
                    </div>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SEO</h3>
                        <input type="text" value={data.seoTitle} onChange={e => updateField("seoTitle", e.target.value)} placeholder="SEO Titel" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400" />
                        <textarea value={data.seoDescription} onChange={e => updateField("seoDescription", e.target.value)} placeholder="Meta beschrijving" rows={3} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400 resize-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
