/**
 * Kenniscentrum Hub — /kenniscentrum
 * SEO cluster hub with category sections, pillar links, and article grid
 */

export const dynamic = "force-dynamic";

import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kenniscentrum — Alles over dakkapellen",
    description: "Alles wat je moet weten over dakkapellen: kosten, vergunningen, materialen, onderhoud, plaatsing en bespaartips. Expert artikelen van DakkapellenKosten.nl.",
    alternates: { canonical: "https://dakkapellenkosten.nl/kenniscentrum" },
    openGraph: {
        title: "Kenniscentrum — Alles over dakkapellen",
        description: "Expert artikelen over dakkapel kosten, vergunningen, materialen, onderhoud en plaatsing.",
        url: "https://dakkapellenkosten.nl/kenniscentrum",
        type: "website",
        locale: "nl_NL",
        siteName: "DakkapellenKosten.nl",
    },
};

const CLUSTERS = [
    { name: "Dakkapel kosten", icon: "💰", pillar: "wat-kost-een-dakkapel", desc: "Alle informatie over dakkapel prijzen per type, materiaal en breedte." },
    { name: "Vergunning & regels", icon: "📋", pillar: "vergunning-dakkapel-regels", desc: "Wanneer heb je een vergunning nodig en welke regels gelden?" },
    { name: "Materiaalvergelijking", icon: "🔨", pillar: "soorten-dakkapellen", desc: "Kunststof, hout, polyester of prefab? Vergelijk materialen." },
    { name: "Plaatsing & proces", icon: "🏗️", pillar: "dakkapel-laten-plaatsen", desc: "Van offerte tot oplevering: alles over het plaatsingsproces." },
    { name: "Onderhoud & problemen", icon: "🔧", pillar: "onderhoud-dakkapel", desc: "Hoe onderhoud je een dakkapel en welke problemen kun je tegenkomen?" },
    { name: "Keuzehulp", icon: "💡", pillar: "offerte-dakkapel-vergelijken", desc: "Tips voor het vergelijken van offertes en het kiezen van een specialist." },
];

export default async function KenniscentrumPage() {
    let articles: any[] = [];
    try {
        articles = await db.query.articles.findMany({
            where: eq(schema.articles.status, "published"),
            orderBy: [desc(schema.articles.publishedAt)],
            columns: { id: true, title: true, slug: true, excerpt: true, category: true, publishedAt: true },
        });
    } catch { /* DB not available */ }

    // Group by category
    const byCategory: Record<string, typeof articles> = {};
    for (const a of articles) {
        const cat = a.category || "Overig";
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(a);
    }

    // Recent 6
    const recent = articles.slice(0, 6);

    return (
        <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#1E293B", minHeight: "100vh" }}>
            {/* Header */}
            <header style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8EEF4", padding: "0 24px", position: "sticky", top: 0, zIndex: 1000 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#16324F" }}>
                        Dakkapellen<span style={{ color: "#F59E0B" }}>Kosten</span>.nl
                    </Link>
                    <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
                        <Link href="/" style={{ textDecoration: "none", color: "#4B5563", fontSize: 14 }}>Home</Link>
                        <Link href="/#offerte" style={{ padding: "10px 20px", background: "#F59E0B", color: "#1E293B", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                            Gratis offertes →
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Breadcrumbs */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
                <nav style={{ fontSize: 13, color: "#64748B" }}>
                    <Link href="/" style={{ color: "#24507A", textDecoration: "none" }}>Home</Link>
                    <span style={{ margin: "0 6px" }}>›</span>
                    <span>Kenniscentrum</span>
                </nav>
            </div>

            {/* Hero */}
            <section style={{ background: "linear-gradient(165deg, #f0f4f9, #F7F9FC)", padding: "40px 24px 48px", textAlign: "center" }}>
                <h1 style={{ fontSize: 38, fontWeight: 800, color: "#16324F", letterSpacing: "-0.02em", marginBottom: 12 }}>
                    Kenniscentrum Dakkapellen
                </h1>
                <p style={{ fontSize: 18, color: "#4B5563", maxWidth: 640, margin: "0 auto 32px", lineHeight: 1.6 }}>
                    Alles wat je moet weten over dakkapel kosten, vergunningen, materialen, plaatsing en onderhoud. 
                    Gebruik onze gidsen om beter geïnformeerd offertes te vergelijken.
                </p>

                {/* Cluster quick links */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, maxWidth: 800, margin: "0 auto" }}>
                    {CLUSTERS.map(c => (
                        <Link
                            key={c.name}
                            href={`/kenniscentrum/${c.pillar}`}
                            style={{
                                textDecoration: "none", padding: "16px 12px",
                                background: "white", borderRadius: 12, border: "1px solid #E8EEF4",
                                textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            }}
                        >
                            <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#16324F" }}>{c.name}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recently updated */}
            {recent.length > 0 && (
                <section style={{ padding: "48px 24px", maxWidth: 1200, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#16324F", marginBottom: 24 }}>
                        📌 Laatst bijgewerkt
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                        {recent.map(a => (
                            <ArticleCard key={a.id} article={a} />
                        ))}
                    </div>
                </section>
            )}

            {/* Category sections */}
            {CLUSTERS.map(cluster => {
                const catArticles = byCategory[cluster.name] || [];
                if (catArticles.length === 0) return null;
                return (
                    <section key={cluster.name} style={{ padding: "32px 24px 48px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid #E8EEF4" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            <span style={{ fontSize: 28 }}>{cluster.icon}</span>
                            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#16324F", margin: 0 }}>
                                {cluster.name}
                            </h2>
                        </div>
                        <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20, maxWidth: 600 }}>
                            {cluster.desc}
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                            {catArticles.slice(0, 6).map(a => (
                                <ArticleCard key={a.id} article={a} compact />
                            ))}
                        </div>
                        {catArticles.length > 6 && (
                            <p style={{ marginTop: 12, fontSize: 14 }}>
                                <Link href={`/kenniscentrum/${cluster.pillar}`} style={{ color: "#24507A", fontWeight: 600, textDecoration: "none" }}>
                                    Bekijk alle {catArticles.length} artikelen over {cluster.name.toLowerCase()} →
                                </Link>
                            </p>
                        )}
                    </section>
                );
            })}

            {/* CTA */}
            <section style={{ background: "linear-gradient(135deg, #16324F, #1a3a5c)", padding: "60px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 12 }}>
                    Klaar om dakkapel offertes te vergelijken?
                </h2>
                <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24, fontSize: 16 }}>
                    Gebruik onze kennisbank om beter geïnformeerd offertes aan te vragen. 100% gratis en vrijblijvend.
                </p>
                <Link href="/#offerte" style={{ display: "inline-block", padding: "16px 36px", background: "#F59E0B", color: "#1E293B", borderRadius: 12, fontWeight: 700, fontSize: 18, textDecoration: "none" }}>
                    Nu gratis offertes vergelijken →
                </Link>
            </section>

            {/* Footer */}
            <footer style={{ background: "#16324F", padding: "32px 24px", textAlign: "center", borderTop: "4px solid #F59E0B" }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                    © {new Date().getFullYear()} DakkapellenKosten.nl — Alle rechten voorbehouden
                </p>
            </footer>
        </div>
    );
}

function ArticleCard({ article, compact }: { article: any; compact?: boolean }) {
    return (
        <Link
            href={`/kenniscentrum/${article.slug}`}
            style={{
                textDecoration: "none", color: "inherit",
                background: "#fff", borderRadius: 12,
                border: "1px solid #E8EEF4", padding: compact ? "16px 20px" : "20px 24px",
                transition: "transform 0.15s, box-shadow 0.15s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                display: "block",
            }}
        >
            {article.category && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#24507A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {article.category}
                </span>
            )}
            <h3 style={{ fontSize: compact ? 15 : 17, fontWeight: 700, color: "#16324F", margin: "4px 0 6px", lineHeight: 1.3 }}>
                {article.title}
            </h3>
            {!compact && article.excerpt && (
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                    {article.excerpt.slice(0, 100)}...
                </p>
            )}
            {article.publishedAt && (
                <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
                    {new Date(article.publishedAt).toLocaleDateString("nl-NL", { year: "numeric", month: "short", day: "numeric" })}
                </p>
            )}
        </Link>
    );
}
