/**
 * Article Editor — /admin/articles/new and /admin/articles/[id]
 * Full CMS editor with: autosave, Ctrl+S, unsaved warning, SEO always visible,
 * media picker, preview, view live, status chip, last saved timestamp
 */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";
import MediaPicker from "@/components/admin/media-picker";
import RevisionPanel from "@/components/admin/revision-panel";
import SlugChangePrompt from "@/components/admin/slug-change-prompt";
import PrePublishChecklist from "@/components/admin/pre-publish-checklist";
import LockBanner from "@/components/admin/lock-banner";

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
    publishAt: string;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(html: string): number {
    const text = stripHtml(html);
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
}

function readingTime(wordCount: number): string {
    const minutes = Math.ceil(wordCount / 200);
    return minutes <= 1 ? "< 1 min" : `${minutes} min`;
}

const CATEGORIES = [
    { value: "kosten", label: "Kosten" },
    { value: "vergunning", label: "Vergunning" },
    { value: "materialen", label: "Materialen" },
    { value: "plaatsing", label: "Plaatsing" },
    { value: "onderhoud", label: "Onderhoud" },
    { value: "keuzehulp", label: "Keuzehulp" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: "Concept", color: "bg-gray-600 text-gray-200" },
    published: { label: "Gepubliceerd", color: "bg-emerald-900/80 text-emerald-300" },
    scheduled: { label: "Ingepland", color: "bg-blue-900/80 text-blue-300" },
};

export default function ArticleEditor({ isNew = false }: { isNew?: boolean }) {
    const router = useRouter();
    const params = useParams();
    const articleId = params?.id as string | undefined;
    const { success, error, warning } = useToast();

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [dirty, setDirty] = useState(false);
    const [savedData, setSavedData] = useState<string>("");
    const [originalSlug, setOriginalSlug] = useState<string>("");
    const [showSlugPrompt, setShowSlugPrompt] = useState(false);
    const [showPrePublish, setShowPrePublish] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<"draft" | "published" | undefined>();
    const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

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
        publishAt: "",
    });

    // Load existing article
    useEffect(() => {
        if (!isNew && articleId) {
            fetch(`/api/admin/articles/${articleId}`)
                .then(r => r.json())
                .then(d => {
                    if (d.article) {
                        const loaded: ArticleData = {
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
                            publishAt: d.article.publishAt || "",
                        };
                        setData(loaded);
                        setSavedData(JSON.stringify(loaded));
                        setOriginalSlug(loaded.slug || "");
                        setAutoSlug(false);
                    }
                    setLoading(false);
                })
                .catch(() => router.push("/admin/articles"));
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
        setDirty(true);
    }, []);

    // Track dirty state
    useEffect(() => {
        if (savedData) {
            setDirty(JSON.stringify(data) !== savedData);
        }
    }, [data, savedData]);

    // ── Autosave (every 30s if dirty and not new) ──
    useEffect(() => {
        if (isNew || !dirty || !articleId) return;

        if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        autosaveTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/admin/articles/${articleId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "x-autosave": "true" },
                    body: JSON.stringify(data),
                });
                if (res.ok) {
                    setLastSaved(new Date());
                    setSavedData(JSON.stringify(data));
                    setDirty(false);
                }
            } catch {}
        }, 30000);

        return () => {
            if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        };
    }, [data, dirty, isNew, articleId]);

    // ── Ctrl/Cmd + S keyboard shortcut ──
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [data, isNew, articleId]);

    // ── Unsaved changes warning ──
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    async function handleSave(status?: "draft" | "published") {
        if (!data.title) return;

        // If publishing, show pre-publish checklist first
        if (status === "published" && data.status !== "published") {
            setPendingStatus(status);
            setShowPrePublish(true);
            return;
        }

        // If slug changed on published article, show slug change prompt
        if (!isNew && originalSlug && data.slug !== originalSlug && data.status === "published") {
            setPendingStatus(status);
            setShowSlugPrompt(true);
            return;
        }

        await doSave(status);
    }

    async function doSave(status?: "draft" | "published") {
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
                setLastSaved(new Date());
                setSavedData(JSON.stringify(payload));
                setOriginalSlug(payload.slug);
                setDirty(false);

                if (status === "published") {
                    success("Artikel gepubliceerd ✓");
                } else {
                    success("Opgeslagen ✓");
                }

                if (isNew && result.article?.id) {
                    router.push(`/admin/articles/${result.article.id}`);
                }
            } else {
                const err = await res.json();
                error(err.error || "Opslaan mislukt");
            }
        } catch {
            error("Opslaan mislukt — controleer je verbinding");
        }
        setSaving(false);
    }

    // SEO completeness
    const seoTitleLen = (data.seoTitle || data.title).length;
    const seoDescLen = data.seoDescription.length;
    const seoTitleColor = seoTitleLen === 0 ? "text-gray-500" : seoTitleLen <= 60 ? "text-emerald-400" : "text-yellow-400";
    const seoDescColor = seoDescLen === 0 ? "text-gray-500" : seoDescLen <= 155 ? "text-emerald-400" : "text-yellow-400";

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin" />
                <span className="ml-2">Laden...</span>
            </div>
        );
    }

    const statusInfo = statusLabels[data.status] || statusLabels.draft;

    return (
        <div className="p-4 lg:p-6 max-w-[1200px]">
            <Breadcrumbs items={[
                { label: "Artikelen", href: "/admin/articles" },
                { label: isNew ? "Nieuw artikel" : data.title || "Bewerken" },
            ]} />

            {/* Content Lock */}
            {!isNew && articleId && (
                <LockBanner entityType="article" entityId={articleId} />
            )}

            {/* Header Bar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (dirty && !confirm("Je hebt onopgeslagen wijzigingen. Wil je toch terug?")) return;
                            router.push("/admin/articles");
                        }}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        ← Terug
                    </button>
                    <h1 className="text-xl font-bold">
                        {isNew ? "Nieuw artikel" : "Artikel bewerken"}
                    </h1>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                    {dirty && (
                        <span className="text-xs text-yellow-400">● Niet opgeslagen</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {/* Last saved */}
                    {lastSaved && (
                        <span className="text-[10px] text-gray-500 hidden sm:flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            {lastSaved.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                    {/* Preview */}
                    {!isNew && (
                        <a
                            href={`/kenniscentrum/${data.slug}`}
                            target="_blank"
                            rel="noopener"
                            className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors hidden sm:inline-flex items-center gap-1.5"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Preview
                        </a>
                    )}
                    <button
                        onClick={() => handleSave("draft")}
                        disabled={saving || !data.title}
                        className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        {saving ? "..." : "Concept"}
                    </button>
                    <button
                        onClick={() => handleSave("published")}
                        disabled={saving || !data.title}
                        className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {saving ? "..." : data.status === "published" ? "Bijwerken" : "Publiceren"}
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-lg font-semibold text-white outline-none focus:border-amber-400 transition-colors"
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
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 resize-none transition-colors"
                    />

                    {/* Rich Text Editor */}
                    <TipTapEditor
                        content={data.content}
                        onChange={(html) => updateField("content", html)}
                        placeholder="Begin met schrijven..."
                    />

                    {/* Word Count + Reading Time */}
                    {(() => {
                        const wc = countWords(data.content);
                        return (
                            <div className="flex items-center gap-4 text-xs text-gray-500 px-1">
                                <span>{wc} {wc === 1 ? 'woord' : 'woorden'}</span>
                                <span>•</span>
                                <span>⏱ {readingTime(wc)} leestijd</span>
                                <span>•</span>
                                <span>{data.content.replace(/<[^>]*>/g, '').length} karakters</span>
                            </div>
                        );
                    })()}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Publish Panel — WordPress style */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Publiceren</h3>
                            <div className={`w-2.5 h-2.5 rounded-full ${data.status === 'published' ? 'bg-emerald-400' : data.status === 'scheduled' ? 'bg-blue-400' : 'bg-gray-500'}`} />
                        </div>
                        <div className="p-4 space-y-3">
                            {/* Status row */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Status</span>
                                <select
                                    value={data.status}
                                    onChange={e => updateField("status", e.target.value)}
                                    className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white outline-none cursor-pointer"
                                >
                                    <option value="draft">Concept</option>
                                    <option value="published">Gepubliceerd</option>
                                    <option value="scheduled">Ingepland</option>
                                </select>
                            </div>
                            {/* Visibility */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Zichtbaarheid</span>
                                <span className="text-xs text-gray-300">Openbaar</span>
                            </div>
                            {/* Schedule */}
                            {data.status === "scheduled" && (
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Publicatiedatum</label>
                                    <input
                                        type="datetime-local"
                                        value={data.publishAt}
                                        onChange={e => updateField("publishAt", e.target.value)}
                                        className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-white outline-none focus:border-amber-400 [color-scheme:dark]"
                                    />
                                    {data.publishAt && (
                                        <div className="text-[10px] text-amber-400/80 mt-1">
                                            ⏰ {new Date(data.publishAt).toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Action buttons inside panel */}
                        <div className="px-4 py-3 border-t border-gray-700 bg-gray-800/50 flex items-center justify-between">
                            <button
                                onClick={() => handleSave("draft")}
                                disabled={saving || !data.title}
                                className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                Bewaar concept
                            </button>
                            <button
                                onClick={() => handleSave("published")}
                                disabled={saving || !data.title}
                                className="px-3 py-1.5 bg-amber-500 text-gray-900 rounded text-xs font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
                            >
                                {data.status === "published" ? "Bijwerken" : "Publiceren"}
                            </button>
                        </div>
                    </div>

                    {/* Category — Dropdown instead of free text */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categorie</h3>
                        <select
                            value={data.category}
                            onChange={e => updateField("category", e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none cursor-pointer"
                        >
                            <option value="">— Selecteer categorie —</option>
                            {CATEGORIES.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Image — Media Picker */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                        <MediaPicker
                            value={data.featuredImage || undefined}
                            onChange={(media) => updateField("featuredImage", media?.url || "")}
                        />
                    </div>

                    {/* SEO Settings — Always visible */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SEO</h3>
                            {data.seoTitle && data.seoDescription ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">✓ Compleet</span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded-full">⚠ Onvolledig</span>
                            )}
                        </div>

                        {/* Google Snippet Preview */}
                        <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700">
                            <div className="text-[10px] text-gray-500 mb-1.5">Google preview</div>
                            <div className="text-sm text-blue-400 font-medium truncate">{data.seoTitle || data.title || "Artikel titel"}</div>
                            <div className="text-[11px] text-emerald-400 truncate">dakkapellenkosten.nl/kenniscentrum/{data.slug || "..."}</div>
                            <div className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">{data.seoDescription || "Voeg een meta beschrijving toe..."}</div>
                        </div>

                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">SEO Titel</label>
                                <input
                                    type="text"
                                    value={data.seoTitle}
                                    onChange={e => updateField("seoTitle", e.target.value)}
                                    placeholder={data.title || "SEO titel..."}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                                />
                                <div className={`text-[10px] mt-1 ${seoTitleColor}`}>
                                    {seoTitleLen}/60
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
                                <div className={`text-[10px] mt-1 ${seoDescColor}`}>
                                    {seoDescLen}/155
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
                    </div>

                    {/* Revisions */}
                    {!isNew && articleId && (
                        <RevisionPanel
                            entityType="article"
                            entityId={articleId}
                            onRestore={() => window.location.reload()}
                        />
                    )}

                    {/* View on site */}
                    {!isNew && data.status === "published" && (
                        <a
                            href={`/kenniscentrum/${data.slug}`}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
                        >
                            🌐 Bekijk op website
                        </a>
                    )}
                </div>
            </div>

            {/* Slug Change Prompt */}
            {showSlugPrompt && (
                <SlugChangePrompt
                    oldSlug={originalSlug}
                    newSlug={data.slug}
                    entityType="article"
                    onConfirm={() => {
                        setShowSlugPrompt(false);
                        doSave(pendingStatus);
                    }}
                    onCancel={() => {
                        setShowSlugPrompt(false);
                        setPendingStatus(undefined);
                    }}
                />
            )}

            {/* Pre-Publish Checklist */}
            {showPrePublish && (
                <PrePublishChecklist
                    title={data.title}
                    seoTitle={data.seoTitle}
                    seoDescription={data.seoDescription}
                    content={data.content}
                    featuredImage={data.featuredImage}
                    slug={data.slug}
                    onPublish={() => {
                        setShowPrePublish(false);
                        doSave(pendingStatus);
                    }}
                    onCancel={() => {
                        setShowPrePublish(false);
                        setPendingStatus(undefined);
                    }}
                />
            )}
        </div>
    );
}
