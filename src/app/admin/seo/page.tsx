/**
 * SEO Dashboard — /admin/seo
 * Overview of SEO settings, sitemap, and content stats
 */
"use client";

import { useEffect, useState } from "react";

export default function SeoDashboardPage() {
    const [stats, setStats] = useState({
        publishedArticles: 0, draftArticles: 0,
        publishedPages: 0, draftPages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/articles?status=published&limit=1").then(r => r.ok ? r.json() : { total: 0 }),
            fetch("/api/admin/articles?status=draft&limit=1").then(r => r.ok ? r.json() : { total: 0 }),
            fetch("/api/admin/pages?limit=1").then(r => r.ok ? r.json() : { pages: [] }),
        ]).then(([pubArticles, draftArticles, pagesData]) => {
            const allPages = pagesData.pages || [];
            setStats({
                publishedArticles: pubArticles.total || 0,
                draftArticles: draftArticles.total || 0,
                publishedPages: allPages.filter((p: any) => p.status === "published").length,
                draftPages: allPages.filter((p: any) => p.status === "draft").length,
            });
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400">Laden...</div>;

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">SEO</h1>
                <p className="text-sm text-gray-400 mt-1">Overzicht van content en SEO status</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <div className="text-xs text-gray-400 uppercase">Gepubliceerde artikelen</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.publishedArticles}</div>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <div className="text-xs text-gray-400 uppercase">Concept artikelen</div>
                    <div className="text-2xl font-bold text-yellow-400 mt-1">{stats.draftArticles}</div>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <div className="text-xs text-gray-400 uppercase">Gepubliceerde pagina&apos;s</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.publishedPages}</div>
                </div>
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                    <div className="text-xs text-gray-400 uppercase">Concept pagina&apos;s</div>
                    <div className="text-2xl font-bold text-yellow-400 mt-1">{stats.draftPages}</div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <a
                    href="/sitemap.xml"
                    target="_blank"
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
                >
                    <h3 className="font-medium mb-1">📋 Sitemap.xml</h3>
                    <p className="text-xs text-gray-400">Automatisch gegenereerd vanuit de database</p>
                </a>
                <a
                    href="/robots.txt"
                    target="_blank"
                    className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-gray-600 transition-colors"
                >
                    <h3 className="font-medium mb-1">🤖 Robots.txt</h3>
                    <p className="text-xs text-gray-400">Zoekmachine crawl instellingen</p>
                </a>
            </div>

            {/* SEO Tips */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4">SEO Checklist</h2>
                <div className="space-y-3 text-sm">
                    <label className="flex items-center gap-3 text-gray-300">
                        <input type="checkbox" checked readOnly className="rounded" />
                        Dynamische sitemap geactiveerd
                    </label>
                    <label className="flex items-center gap-3 text-gray-300">
                        <input type="checkbox" checked readOnly className="rounded" />
                        SEO titel &amp; meta beschrijving per artikel
                    </label>
                    <label className="flex items-center gap-3 text-gray-300">
                        <input type="checkbox" checked readOnly className="rounded" />
                        Canonical URL ondersteuning
                    </label>
                    <label className="flex items-center gap-3 text-gray-300">
                        <input type="checkbox" checked readOnly className="rounded" />
                        Interne link systeem via editor
                    </label>
                    <label className="flex items-center gap-3 text-gray-300">
                        <input type="checkbox" checked readOnly className="rounded" />
                        Gestructureerde slug systeem
                    </label>
                </div>
            </div>
        </div>
    );
}
