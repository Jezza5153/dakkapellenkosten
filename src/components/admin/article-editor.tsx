/**
 * Article Editor — /admin/articles/new and /admin/articles/[id]
 * Shared component for creating and editing articles
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("@/components/editor/tiptap-editor"), { ssr: false });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

interface ArticleData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: string;
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    status: "draft" | "published" | "scheduled";
}

export default function ArticleEditor({ isNew = false }: { isNew?: boolean }) {
    const router = useRouter();
    const params = useParams();
    const articleId = params?.id as string | undefined;

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);
    const [showSeo, setShowSeo] = useState(false);

    const [data, setData] = useState<ArticleData>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        category: "",
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "",
        status: "draft",
    });

    // Load existing article
    useEffect(() => {
        if (!isNew && articleId) {
            fetch(`/api/admin/articles/${articleId}`)
                .then(r => r.json())
                .then(d => {
                    if (d.article) {
                        setData({
                            title: d.article.title || "",
                            slug: d.article.slug || "",
                            excerpt: d.article.excerpt || "",
                            content: d.article.content || "",
                            featuredImage: d.article.featuredImage || "",
                            category: d.article.category || "",
                            seoTitle: d.article.seoTitle || "",
                            seoDescription: d.article.seoDescription || "",
                            canonicalUrl: d.article.canonicalUrl || "",
                            status: d.article.status || "draft",
                        });
                        setAutoSlug(false);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    router.push("/admin/articles");
                });
        }
    }, [isNew, articleId, router]);

    // Auto-generate slug from title
    useEffect(() => {
        if (autoSlug && data.title) {
            setData(prev => ({ ...prev, slug: slugify(prev.title) }));
        }
    }, [data.title, autoSlug]);

    const updateField = useCallback((field: keyof ArticleData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);

    async function handleSave(status?: "draft" | "published") {
        setSaving(true);
        const payload = { ...data };
        if (status) payload.status = status;

        const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${articleId}`;
        const method = isNew ? "POST" : "PUT";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const result = await res.json();
                if (isNew && result.article?.id) {
                    router.push(`/admin/articles/${result.article.id}`);
                }
            } else {
                const err = await res.json();
                alert(err.error || "Opslaan mislukt");
            }
        } catch {
            alert("Opslaan mislukt");
        }
        setSaving(false);
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-400">Laden...</div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-[1200px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/admin/articles")}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        ← Terug
                    </button>
                    <h1 className="text-xl font-bold">
                        {isNew ? "Nieuw artikel" : "Artikel bewerken"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSave("draft")}
                        disabled={saving || !data.title}
                        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50"
                    >
                        {saving ? "..." : "Opslaan als concept"}
                    </button>
                    <button
                        onClick={() => handleSave("published")}
                        disabled={saving || !data.title}
                        className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50"
                    >
                        {saving ? "..." : "Publiceren"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Main Editor Column */}
                <div className="space-y-4">
                    {/* Title */}
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => updateField("title", e.target.value)}
                        placeholder="Artikel titel..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-lg font-semibold text-white outline-none focus:border-amber-400"
                    />

                    {/* Slug */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">/kenniscentrum/</span>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={e => { setAutoSlug(false); updateField("slug", e.target.value); }}
                            placeholder="artikel-slug"
                            className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 outline-none focus:border-amber-400"
                        />
                    </div>

                    {/* Excerpt */}
                    <textarea
                        value={data.excerpt}
                        onChange={e => updateField("excerpt", e.target.value)}
                        placeholder="Korte samenvatting (excerpt)..."
                        rows={2}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 resize-none"
                    />

                    {/* Rich Text Editor */}
                    <TipTapEditor
                        content={data.content}
                        onChange={(html) => updateField("content", html)}
                        placeholder="Begin met schrijven..."
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</h3>
                        <select
                            value={data.status}
                            onChange={e => updateField("status", e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none"
                        >
                            <option value="draft">Concept</option>
                            <option value="published">Gepubliceerd</option>
                            <option value="scheduled">Ingepland</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorie</h3>
                        <input
                            type="text"
                            value={data.category}
                            onChange={e => updateField("category", e.target.value)}
                            placeholder="bijv. kosten, materialen"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                        />
                    </div>

                    {/* Featured Image */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Uitgelichte afbeelding</h3>
                        <input
                            type="url"
                            value={data.featuredImage}
                            onChange={e => updateField("featuredImage", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                        />
                        {data.featuredImage && (
                            <img
                                src={data.featuredImage}
                                alt="Preview"
                                className="mt-2 rounded-lg w-full h-32 object-cover"
                            />
                        )}
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <button
                            onClick={() => setShowSeo(!showSeo)}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SEO Instellingen</h3>
                            <span className="text-gray-500 text-xs">{showSeo ? "▲" : "▼"}</span>
                        </button>

                        {showSeo && (
                            <div className="mt-3 space-y-3">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">SEO Titel</label>
                                    <input
                                        type="text"
                                        value={data.seoTitle}
                                        onChange={e => updateField("seoTitle", e.target.value)}
                                        placeholder={data.title || "SEO titel..."}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                                    />
                                    <div className="text-[10px] text-gray-500 mt-1">
                                        {(data.seoTitle || data.title).length}/60
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Meta beschrijving</label>
                                    <textarea
                                        value={data.seoDescription}
                                        onChange={e => updateField("seoDescription", e.target.value)}
                                        placeholder="Beschrijf dit artikel voor zoekmachines..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400 resize-none"
                                    />
                                    <div className="text-[10px] text-gray-500 mt-1">
                                        {data.seoDescription.length}/155
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Canonical URL</label>
                                    <input
                                        type="url"
                                        value={data.canonicalUrl}
                                        onChange={e => updateField("canonicalUrl", e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
