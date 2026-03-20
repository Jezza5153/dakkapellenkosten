/**
 * Kenniscentrum Index — /kenniscentrum
 * Lists all published articles from the CMS
 */

export const dynamic = "force-dynamic";

import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kenniscentrum — DakkapellenKosten.nl",
    description: "Alles wat je moet weten over dakkapellen: kosten, vergunningen, materialen, onderhoud en meer. Expert artikelen van DakkapellenKosten.nl.",
};

export default async function KenniscentrumPage() {
    let articles: any[] = [];
    try {
        articles = await db.query.articles.findMany({
            where: eq(schema.articles.status, "published"),
            orderBy: [desc(schema.articles.publishedAt)],
            columns: { id: true, title: true, slug: true, excerpt: true, category: true, publishedAt: true, featuredImage: true },
        });
    } catch {
        // DB not available yet — show empty state
    }

    return (
        <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#1E293B" }}>
            {/* Header */}
            <header style={{
                background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
                borderBottom: "1px solid #E8EEF4", padding: "0 24px", height: 72,
                display: "flex", alignItems: "center",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#16324F" }}>
                        Dakkapellen<span style={{ color: "#F59E0B" }}>Kosten</span>.nl
                    </Link>
                    <Link href="/" style={{ textDecoration: "none", fontSize: 14, color: "#4B5563" }}>
                        ← Terug naar home
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section style={{ background: "linear-gradient(165deg, #f0f4f9 0%, #F7F9FC 40%, #fff 100%)", padding: "60px 24px 40px", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#24507A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                    Kenniscentrum
                </p>
                <h1 style={{ fontSize: 36, fontWeight: 800, color: "#16324F", letterSpacing: "-0.02em", marginBottom: 12 }}>
                    Alles over dakkapellen
                </h1>
                <p style={{ fontSize: 16, color: "#64748B", maxWidth: 560, margin: "0 auto" }}>
                    Expert artikelen over kosten, vergunningen, materialen en onderhoud van dakkapellen.
                </p>
            </section>

            {/* Articles Grid */}
            <section style={{ padding: "48px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
                {articles.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 60, color: "#64748B" }}>
                        <p style={{ fontSize: 18, marginBottom: 8 }}>Nog geen artikelen gepubliceerd.</p>
                        <p style={{ fontSize: 14 }}>Artikelen verschijnen hier zodra ze in het CMS worden gepubliceerd.</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                        {articles.map(article => (
                            <Link
                                key={article.id}
                                href={`/kenniscentrum/${article.slug}`}
                                style={{
                                    textDecoration: "none", color: "inherit",
                                    background: "#fff", borderRadius: 16,
                                    border: "1px solid #E8EEF4", overflow: "hidden",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                }}
                            >
                                {article.featuredImage && (
                                    <img src={article.featuredImage} alt={article.title}
                                        style={{ width: "100%", height: 200, objectFit: "cover" }} />
                                )}
                                <div style={{ padding: 24 }}>
                                    {article.category && (
                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#24507A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            {article.category}
                                        </span>
                                    )}
                                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#16324F", margin: "6px 0 8px", lineHeight: 1.3 }}>
                                        {article.title}
                                    </h2>
                                    {article.excerpt && (
                                        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, margin: 0 }}>
                                            {article.excerpt.slice(0, 120)}...
                                        </p>
                                    )}
                                    {article.publishedAt && (
                                        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>
                                            {new Date(article.publishedAt).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
