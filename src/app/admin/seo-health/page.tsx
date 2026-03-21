/**
 * SEO Health Center — /admin/seo-health
 * Comprehensive content health dashboard: missing SEO, missing images,
 * thin content, duplicate slugs, internal link opportunities
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";

interface Article {
    id: string;
    title: string;
    slug: string;
    status: string;
    category: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    featuredImage: string | null;
    content: string | null;
    updatedAt: string;
}

interface Page {
    id: string;
    title: string;
    slug: string;
    status: string;
    city: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    updatedAt: string;
}

interface Issue {
    type: "critical" | "warning" | "info";
    category: string;
    title: string;
    description: string;
    href: string;
    entityType: "article" | "page";
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(html: string): number {
    const text = stripHtml(html);
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
}

export default function SeoHealthPage() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<Article[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [activeTab, setActiveTab] = useState<"all" | "critical" | "warning" | "info">("all");

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/articles?limit=100&sortBy=updatedAt&sortDir=desc").then(r => r.ok ? r.json() : { articles: [] }),
            fetch("/api/admin/pages?limit=100&sortBy=updatedAt&sortDir=desc").then(r => r.ok ? r.json() : { pages: [] }),
        ]).then(([aData, pData]) => {
            setArticles(aData.articles || []);
            setPages(pData.pages || []);
            setLoading(false);
        });
    }, []);

    // Analyze content
    function getIssues(): Issue[] {
        const issues: Issue[] = [];
        const published = articles.filter(a => a.status === "published");
        const publishedPages = pages.filter(p => p.status === "published");

        // Articles — missing SEO
        for (const a of published) {
            if (!a.seoTitle) {
                issues.push({
                    type: "critical",
                    category: "SEO",
                    title: `Ontbrekende SEO titel: "${a.title}"`,
                    description: "Zonder SEO titel gebruikt Google de pagina titel, wat vaak te lang of niet geoptimaliseerd is.",
                    href: `/admin/articles/${a.id}`,
                    entityType: "article",
                });
            }
            if (!a.seoDescription) {
                issues.push({
                    type: "critical",
                    category: "SEO",
                    title: `Ontbrekende meta description: "${a.title}"`,
                    description: "Google laat een snippet zien uit je content, wat vaak niet ideaal is voor CTR.",
                    href: `/admin/articles/${a.id}`,
                    entityType: "article",
                });
            }
            if (a.seoTitle && a.seoTitle.length > 60) {
                issues.push({
                    type: "warning",
                    category: "SEO",
                    title: `SEO titel te lang (${a.seoTitle.length}/60): "${a.title}"`,
                    description: "Google kapt titels af na ±60 karakters. Inkorten voor betere weergave.",
                    href: `/admin/articles/${a.id}`,
                    entityType: "article",
                });
            }
            if (a.seoDescription && a.seoDescription.length > 155) {
                issues.push({
                    type: "warning",
                    category: "SEO",
                    title: `Meta description te lang (${a.seoDescription.length}/155): "${a.title}"`,
                    description: "Google kapt meta descriptions af na ±155 karakters.",
                    href: `/admin/articles/${a.id}`,
                    entityType: "article",
                });
            }
        }

        // Articles — missing image
        for (const a of published) {
            if (!a.featuredImage) {
                issues.push({
                    type: "warning",
                    category: "Afbeeldingen",
                    title: `Ontbrekende featured image: "${a.title}"`,
                    description: "Artikelen zonder afbeelding presteren minder in social shares en Google Discover.",
                    href: `/admin/articles/${a.id}`,
                    entityType: "article",
                });
            }
        }

        // Articles — thin content
        for (const a of published) {
            if (a.content) {
                const wc = wordCount(a.content);
                if (wc < 300) {
                    issues.push({
                        type: "warning",
                        category: "Content",
                        title: `Dunne content (${wc} woorden): "${a.title}"`,
                        description: "Artikelen onder 300 woorden ranken zelden goed. Overweeg uitbreiding.",
                        href: `/admin/articles/${a.id}`,
                        entityType: "article",
                    });
                }
            }
        }

        // Articles — missing category
        for (const a of published) {
            if (!a.category) {
                issues.push({
                    type: "info",
                    category: "Organisatie",
                    title: `Geen categorie: "${a.title}"`,
                    description: "Categorisering verbetert interne linking en gebruikerservaring.",
                    href: `/admin/articles/${a.id}`,
                    entityType: "article",
                });
            }
        }

        // Pages — missing SEO
        for (const p of publishedPages) {
            if (!p.seoTitle) {
                issues.push({
                    type: "critical",
                    category: "SEO",
                    title: `Pagina zonder SEO titel: "${p.title}"`,
                    description: "Geo-pagina's hebben een geoptimaliseerde titel nodig voor lokale ranking.",
                    href: `/admin/pages/${p.id}`,
                    entityType: "page",
                });
            }
            if (!p.seoDescription) {
                issues.push({
                    type: "critical",
                    category: "SEO",
                    title: `Pagina zonder meta description: "${p.title}"`,
                    description: "Meta descriptions zijn belangrijk voor CTR in zoekresultaten.",
                    href: `/admin/pages/${p.id}`,
                    entityType: "page",
                });
            }
        }

        // Duplicate slug check
        const allSlugs = [
            ...articles.map(a => ({ slug: a.slug, title: a.title, id: a.id, type: "article" as const })),
            ...pages.map(p => ({ slug: p.slug, title: p.title, id: p.id, type: "page" as const })),
        ];
        const slugCounts = allSlugs.reduce((acc, item) => {
            acc[item.slug] = (acc[item.slug] || []);
            acc[item.slug].push(item);
            return acc;
        }, {} as Record<string, typeof allSlugs>);

        for (const [slug, items] of Object.entries(slugCounts)) {
            if (items.length > 1) {
                issues.push({
                    type: "critical",
                    category: "Technisch",
                    title: `Duplicate slug: "/${slug}" (${items.length}x)`,
                    description: `Gebruikt door: ${items.map(i => i.title).join(", ")}. Dit veroorzaakt conflicten.`,
                    href: `/admin/articles`,
                    entityType: "article",
                });
            }
        }

        return issues;
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                Content analyseren...
            </div>
        );
    }

    const issues = getIssues();
    const critical = issues.filter(i => i.type === "critical");
    const warnings = issues.filter(i => i.type === "warning");
    const info = issues.filter(i => i.type === "info");
    const filtered = activeTab === "all" ? issues : issues.filter(i => i.type === activeTab);

    const publishedArticles = articles.filter(a => a.status === "published");
    const publishedPages = pages.filter(p => p.status === "published");
    const completeSeo = publishedArticles.filter(a => a.seoTitle && a.seoDescription).length;
    const score = publishedArticles.length > 0
        ? Math.round((completeSeo / publishedArticles.length) * 100)
        : 100;

    const scoreColor = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400";
    const scoreBg = score >= 80 ? "border-emerald-400/30" : score >= 50 ? "border-yellow-400/30" : "border-red-400/30";

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "SEO Health" }]} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">SEO Health Center</h1>
                <p className="text-sm text-gray-400 mt-0.5">Automatische content audit — {publishedArticles.length} artikelen, {publishedPages.length} pagina&apos;s geanalyseerd</p>
            </div>

            {/* Score + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`bg-gray-800 rounded-xl border-2 ${scoreBg} p-5 flex items-center gap-4`}>
                    <div className={`text-4xl font-black ${scoreColor}`}>{score}</div>
                    <div>
                        <div className="text-sm font-semibold">Health Score</div>
                        <div className="text-[10px] text-gray-500">SEO completeness</div>
                    </div>
                </div>
                <button
                    onClick={() => setActiveTab(activeTab === "critical" ? "all" : "critical")}
                    className={`bg-gray-800 rounded-xl border p-5 text-left transition-colors ${
                        activeTab === "critical" ? "border-red-400/50" : "border-gray-700 hover:border-gray-600"
                    }`}
                >
                    <div className="text-2xl font-bold text-red-400">{critical.length}</div>
                    <div className="text-xs text-gray-400">Kritiek</div>
                </button>
                <button
                    onClick={() => setActiveTab(activeTab === "warning" ? "all" : "warning")}
                    className={`bg-gray-800 rounded-xl border p-5 text-left transition-colors ${
                        activeTab === "warning" ? "border-yellow-400/50" : "border-gray-700 hover:border-gray-600"
                    }`}
                >
                    <div className="text-2xl font-bold text-yellow-400">{warnings.length}</div>
                    <div className="text-xs text-gray-400">Waarschuwingen</div>
                </button>
                <button
                    onClick={() => setActiveTab(activeTab === "info" ? "all" : "info")}
                    className={`bg-gray-800 rounded-xl border p-5 text-left transition-colors ${
                        activeTab === "info" ? "border-blue-400/50" : "border-gray-700 hover:border-gray-600"
                    }`}
                >
                    <div className="text-2xl font-bold text-blue-400">{info.length}</div>
                    <div className="text-xs text-gray-400">Suggesties</div>
                </button>
            </div>

            {/* Issues List */}
            {filtered.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
                    <span className="text-4xl block mb-3">🎉</span>
                    <h3 className="text-lg font-semibold text-emerald-400">Alles ziet er goed uit!</h3>
                    <p className="text-sm text-gray-400 mt-1">Geen {activeTab === "all" ? "problemen" : activeTab === "critical" ? "kritieke problemen" : "waarschuwingen"} gevonden.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((issue, i) => (
                        <Link
                            key={i}
                            href={issue.href}
                            className="flex items-start gap-3 p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors group"
                        >
                            <span className={`text-sm mt-0.5 shrink-0 ${
                                issue.type === "critical" ? "text-red-400" :
                                issue.type === "warning" ? "text-yellow-400" : "text-blue-400"
                            }`}>
                                {issue.type === "critical" ? "🔴" : issue.type === "warning" ? "🟡" : "🔵"}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium group-hover:text-amber-400 transition-colors">{issue.title}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{issue.description}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] text-gray-600 uppercase">{issue.category}</span>
                                <span className="text-[10px] text-gray-600">{issue.entityType === "article" ? "📝" : "📄"}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
