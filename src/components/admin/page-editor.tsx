/**
 * Page Editor — /admin/pages/new and /admin/pages/[id]
 * Full CMS editor for geo-pages: city/service targeting, SEO, structured data,
 * autosave, Ctrl+S, unsaved warning, media picker, word count
 */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";
import MediaPicker from "@/components/admin/media-picker";
import RevisionPanel from "@/components/admin/revision-panel";
import LockBanner from "@/components/admin/lock-banner";
import SlugChangePrompt from "@/components/admin/slug-change-prompt";
import PrePublishChecklist from "@/components/admin/pre-publish-checklist";

const TipTapEditor = dynamic(() => import("@/components/editor/tiptap-editor"), { ssr: false });

function slugify(text: string, city?: string): string {
    const base = city ? `${text} ${city}` : text;
    return base
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
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

interface PageData {
    title: string;
    slug: string;
    content: string;
    featuredImage: string;
    city: string;
    service: string;
    seoTitle: string;
    seoDescription: string;
    canonicalUrl: string;
    structuredData: string;
    status: "draft" | "published" | "scheduled";
}

const CITIES = [
    "", "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
    "Tilburg", "Groningen", "Almere", "Breda", "Nijmegen",
    "Haarlem", "Enschede", "Arnhem", "Amersfoort", "Apeldoorn",
    "Zaanstad", "Haarlemmermeer", "Zoetermeer", "Leiden", "Dordrecht",
    "Maastricht", "Zwolle", "Deventer", "Delft", "Alkmaar",
    "Venlo", "Leeuwarden", "Hilversum", "Emmen", "Assen",
];

const SERVICES = [
    "", "dakkapel-plaatsen", "dakkapel-kosten", "dakkapel-vergunning",
    "prefab-dakkapel", "traditionele-dakkapel", "kunststof-dakkapel",
    "houten-dakkapel", "dakkapel-op-maat",
];

const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: "Concept", color: "bg-gray-600 text-gray-200" },
    published: { label: "Gepubliceerd", color: "bg-emerald-900/80 text-emerald-300" },
    scheduled: { label: "Ingepland", color: "bg-blue-900/80 text-blue-300" },
};

export default function PageEditor({ isNew = false }: { isNew?: boolean }) {
    const router = useRouter();
    const params = useParams();
    const pageId = params?.id as string | undefined;
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
    const [pendingPublish, setPendingPublish] = useState(false);

    const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

    const [data, setData] = useState<PageData>({
        title: "",
        slug: "",
        content: "",
        featuredImage: "",
        city: "",
        service: "",
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "",
        structuredData: "",
        status: "draft",
    });

    // Load existing page
    useEffect(() => {
        if (!isNew && pageId) {
            fetch(`/api/admin/pages/${pageId}`)
                .then(r => r.ok ? r.json() : null)
                .then(d => {
                    if (d?.page) {
                        const p = d.page;
                        const pageData: PageData = {
                            title: p.title || "",
                            slug: p.slug || "",
                            content: p.content || "",
                            featuredImage: p.featuredImage || "",
                            city: p.city || "",
                            service: p.service || "",
                            seoTitle: p.seoTitle || "",
                            seoDescription: p.seoDescription || "",
                            canonicalUrl: p.canonicalUrl || "",
                            structuredData: p.structuredData ? JSON.stringify(p.structuredData, null, 2) : "",
                            status: p.status || "draft",
                        };
                        setData(pageData);
                        setSavedData(JSON.stringify(pageData));
                        setOriginalSlug(p.slug || "");
                        setAutoSlug(false);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    error("Pagina laden mislukt");
                    router.push("/admin/pages");
                });
        }
    }, [isNew, pageId, router, error]);

    // Track dirty state
    useEffect(() => {
        if (savedData) {
            setDirty(JSON.stringify(data) !== savedData);
        } else if (isNew) {
            setDirty(data.title.length > 0);
        }
    }, [data, savedData, isNew]);

    // Update slug when title or city changes
    useEffect(() => {
        if (autoSlug && data.title) {
            setData(prev => ({ ...prev, slug: slugify(prev.title, prev.city || undefined) }));
        }
    }, [data.title, data.city, autoSlug]);

    // Autosave every 30s
    useEffect(() => {
        if (dirty && !isNew) {
            autosaveTimer.current = setTimeout(() => {
                doSave(true);
            }, 30000);
        }
        return () => {
            if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
        };
    });

    // Ctrl/Cmd+S
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                doSave(false);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    // Unsaved changes warning
    useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            if (dirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [dirty]);

    // Public handleSave — intercepts for slug change + pre-publish
    function handlePublish() {
        if (data.status !== "published") {
            setPendingPublish(true);
            setShowPrePublish(true);
            return;
        }
        // If slug changed on published page
        if (!isNew && originalSlug && data.slug !== originalSlug && data.status === "published") {
            setShowSlugPrompt(true);
            return;
        }
        doSave(false);
    }

    const doSave = useCallback(async (isAutosave: boolean) => {
        if (saving) return;
        setSaving(true);

        // Parse structured data if provided
        let structuredDataObj = null;
        if (data.structuredData.trim()) {
            try {
                structuredDataObj = JSON.parse(data.structuredData);
            } catch {
                if (!isAutosave) error("Structured data is geen geldige JSON");
                setSaving(false);
                return;
            }
        }

        const body = {
            title: data.title,
            slug: data.slug,
            content: data.content,
            featuredImage: data.featuredImage || null,
            city: data.city || null,
            service: data.service || null,
            seoTitle: data.seoTitle || null,
            seoDescription: data.seoDescription || null,
            canonicalUrl: data.canonicalUrl || null,
            structuredData: structuredDataObj,
            status: pendingPublish ? "published" : data.status,
        };

        try {
            const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${pageId}`;
            const method = isNew ? "POST" : "PATCH";
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (isAutosave) headers["x-autosave"] = "true";

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(body),
            });

            if (res.ok) {
                const result = await res.json();
                setLastSaved(new Date());
                setSavedData(JSON.stringify(data));
                setOriginalSlug(data.slug);
                setDirty(false);
                setPendingPublish(false);

                if (pendingPublish) {
                    setData(prev => ({ ...prev, status: "published" }));
                    success("Pagina gepubliceerd ✓");
                } else if (isNew && result.page?.id) {
                    success("Pagina aangemaakt");
                    router.push(`/admin/pages/${result.page.id}`);
                } else if (!isAutosave) {
                    success("Pagina opgeslagen");
                }
            } else {
                if (!isAutosave) error("Opslaan mislukt");
            }
        } catch {
            if (!isAutosave) error("Opslaan mislukt");
        }
        setSaving(false);
    }, [data, isNew, pageId, saving, pendingPublish, router, success, error]);

    function updateField<K extends keyof PageData>(field: K, value: PageData[K]) {
        setData(prev => ({ ...prev, [field]: value }));
    }

    const wordCount = countWords(data.content);
    const seoTitleLen = data.seoTitle.length;
    const seoDescLen = data.seoDescription.length;

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                Laden...
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[
                { label: "Pagina's", href: "/admin/pages" },
                { label: isNew ? "Nieuwe pagina" : data.title || "Bewerken" },
            ]} />

            {/* Content Lock */}
            {!isNew && pageId && (
                <LockBanner entityType="page" entityId={pageId} />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold">{isNew ? "Nieuwe pagina" : "Pagina bewerken"}</h1>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusLabels[data.status]?.color}`}>
                        {statusLabels[data.status]?.label}
                    </span>
                    {dirty && <span className="text-xs text-yellow-500">● Niet opgeslagen</span>}
                </div>
                <div className="flex items-center gap-2">
                    {lastSaved && (
                        <span className="text-xs text-gray-500">
                            Opgeslagen {lastSaved.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    )}
                    {!isNew && data.status === "published" && (
                        <a
                            href={`/dakkapel/${data.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 text-xs bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                        >
                            Bekijk op site ↗
                        </a>
                    )}
                    <button
                        onClick={() => doSave(false)}
                        disabled={saving}
                        className="px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-500 disabled:opacity-50"
                    >
                        {saving ? "Opslaan..." : isNew ? "Aanmaken" : "Opslaan"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main editor */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Title */}
                    <input
                        type="text"
                        value={data.title}
                        onChange={e => updateField("title", e.target.value)}
                        placeholder="Pagina titel"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-lg font-semibold focus:border-amber-500 focus:outline-none"
                    />

                    {/* Slug */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">/dakkapel/</span>
                        <input
                            type="text"
                            value={data.slug}
                            onChange={e => { setAutoSlug(false); updateField("slug", e.target.value); }}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-400 focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    {/* Content */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg min-h-[400px]">
                        <TipTapEditor
                            content={data.content}
                            onChange={(html: string) => updateField("content", html)}
                        />
                    </div>

                    {/* Word count bar */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{wordCount} woorden</span>
                        <span>{readingTime(wordCount)} leestijd</span>
                        <span>{countWords(data.content) >= 300 ? "✅" : "⚠️"} Min. 300 woorden</span>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Status</h3>
                        <select
                            value={data.status}
                            onChange={e => updateField("status", e.target.value as PageData["status"])}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="draft">Concept</option>
                            <option value="published">Gepubliceerd</option>
                        </select>
                    </div>

                    {/* Geo targeting */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">🌍 Geo targeting</h3>
                        <label className="text-xs text-gray-500 block mb-1">Stad</label>
                        <select
                            value={data.city}
                            onChange={e => updateField("city", e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm mb-3"
                        >
                            <option value="">Geen stad (generiek)</option>
                            {CITIES.filter(Boolean).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <label className="text-xs text-gray-500 block mb-1">Service</label>
                        <select
                            value={data.service}
                            onChange={e => updateField("service", e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">Geen service</option>
                            {SERVICES.filter(Boolean).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured image */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <MediaPicker
                            value={data.featuredImage || undefined}
                            onChange={(val) => updateField("featuredImage", val?.url || "")}
                        />
                    </div>

                    {/* SEO Panel */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">🔍 SEO</h3>

                        <label className="text-xs text-gray-500 block mb-1">
                            SEO Titel
                            <span className={`float-right ${seoTitleLen > 60 ? "text-red-400" : seoTitleLen > 50 ? "text-yellow-400" : "text-emerald-400"}`}>
                                {seoTitleLen}/60
                            </span>
                        </label>
                        <input
                            type="text"
                            value={data.seoTitle}
                            onChange={e => updateField("seoTitle", e.target.value)}
                            placeholder="SEO titel voor Google"
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm mb-3 focus:border-amber-500 focus:outline-none"
                        />

                        <label className="text-xs text-gray-500 block mb-1">
                            Meta beschrijving
                            <span className={`float-right ${seoDescLen > 160 ? "text-red-400" : seoDescLen > 140 ? "text-yellow-400" : "text-emerald-400"}`}>
                                {seoDescLen}/160
                            </span>
                        </label>
                        <textarea
                            value={data.seoDescription}
                            onChange={e => updateField("seoDescription", e.target.value)}
                            placeholder="Beschrijving voor zoekresultaten"
                            rows={3}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm mb-3 focus:border-amber-500 focus:outline-none resize-none"
                        />

                        <label className="text-xs text-gray-500 block mb-1">Canonical URL</label>
                        <input
                            type="text"
                            value={data.canonicalUrl}
                            onChange={e => updateField("canonicalUrl", e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    {/* Structured Data */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">📋 Structured Data (JSON-LD)</h3>
                        <textarea
                            value={data.structuredData}
                            onChange={e => updateField("structuredData", e.target.value)}
                            placeholder='{"@type": "FAQPage", ...}'
                            rows={6}
                            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs font-mono focus:border-amber-500 focus:outline-none resize-none"
                        />
                        <p className="text-[10px] text-gray-600 mt-1">FAQ, HowTo, of LocalBusiness schema</p>
                    </div>

                    {/* Revisions */}
                    {!isNew && pageId && (
                        <RevisionPanel
                            entityType="page"
                            entityId={pageId}
                            onRestore={() => window.location.reload()}
                        />
                    )}
                </div>
            </div>

            {/* Slug Change Prompt */}
            {showSlugPrompt && (
                <SlugChangePrompt
                    oldSlug={originalSlug}
                    newSlug={data.slug}
                    entityType="page"
                    onConfirm={() => {
                        setShowSlugPrompt(false);
                        doSave(false);
                    }}
                    onCancel={() => {
                        setShowSlugPrompt(false);
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
                        doSave(false);
                    }}
                    onCancel={() => {
                        setShowPrePublish(false);
                        setPendingPublish(false);
                    }}
                />
            )}
        </div>
    );
}
