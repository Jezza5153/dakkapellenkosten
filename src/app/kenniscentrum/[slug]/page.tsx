/**
 * Dynamic Blog Route — /kenniscentrum/[slug]
 * Renders articles from CMS database with full SEO (OG, Twitter, JSON-LD)
 * Includes related articles block and CTA per SEO master brief
 */

export const dynamic = "force-dynamic";

import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCTA } from "@/components/article-cta";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const article = await db.query.articles.findFirst({
        where: and(eq(schema.articles.slug, slug), eq(schema.articles.status, "published")),
    });
    if (!article) return {};
    const title = article.seoTitle || article.title;
    const description = article.seoDescription || article.excerpt || undefined;
    const canonical = article.canonicalUrl || `https://dakkapellenkosten.nl/kenniscentrum/${article.slug}`;
    return {
        title, description,
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "article", locale: "nl_NL", siteName: "DakkapellenKosten.nl", publishedTime: article.publishedAt?.toISOString(), modifiedTime: article.updatedAt?.toISOString(), section: article.category || undefined },
        twitter: { card: "summary_large_image", title, description },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;

    const article = await db.query.articles.findFirst({
        where: and(eq(schema.articles.slug, slug), eq(schema.articles.status, "published")),
        with: { author: { columns: { name: true } } },
    });
    if (!article) notFound();

    // Related articles (same category, exclude self)
    let related: any[] = [];
    if (article.category) {
        try {
            const all = await db.query.articles.findMany({
                where: and(eq(schema.articles.status, "published"), eq(schema.articles.category, article.category)),
                columns: { id: true, title: true, slug: true, category: true },
                limit: 5,
            });
            related = all.filter(a => a.slug !== slug).slice(0, 4);
        } catch { /* ignore */ }
    }

    const canonical = article.canonicalUrl || `https://dakkapellenkosten.nl/kenniscentrum/${article.slug}`;
    const jsonLd = [
        {
            "@context": "https://schema.org", "@type": "BlogPosting",
            headline: article.title,
            description: article.seoDescription || article.excerpt || "",
            datePublished: article.publishedAt?.toISOString(),
            dateModified: article.updatedAt?.toISOString(),
            author: { "@type": "Person", name: article.author?.name || "DakkapellenKosten.nl" },
            publisher: { "@id": "https://dakkapellenkosten.nl/#organization" },
            mainEntityOfPage: canonical,
            articleSection: article.category || undefined,
            inLanguage: "nl-NL",
            isAccessibleForFree: true,
        },
        {
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://dakkapellenkosten.nl/" },
                { "@type": "ListItem", position: 2, name: "Kenniscentrum", item: "https://dakkapellenkosten.nl/kenniscentrum/" },
                { "@type": "ListItem", position: 3, name: article.title, item: canonical },
            ],
        },
    ];

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#1E293B", minHeight: "100vh" }}>
                {/* Header */}
                <header style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8EEF4", padding: "0 24px", position: "sticky", top: 0, zIndex: 1000 }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#16324F" }}>
                            Dakkapellen<span style={{ color: "#F59E0B" }}>Kosten</span>.nl
                        </Link>
                        <nav style={{ display: "flex", gap: 20, alignItems: "center" }}>
                            <Link href="/kenniscentrum" style={{ textDecoration: "none", color: "#4B5563", fontSize: 14, fontWeight: 500 }}>Kenniscentrum</Link>
                            <Link href="/#offerte" style={{ padding: "10px 20px", background: "#F59E0B", color: "#1E293B", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                                Gratis offertes →
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Breadcrumbs */}
                <div style={{ maxWidth: 800, margin: "0 auto", padding: "16px 24px" }}>
                    <nav style={{ fontSize: 13, color: "#64748B" }}>
                        <Link href="/" style={{ color: "#24507A", textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 6px" }}>›</span>
                        <Link href="/kenniscentrum" style={{ color: "#24507A", textDecoration: "none" }}>Kenniscentrum</Link>
                        <span style={{ margin: "0 6px" }}>›</span>
                        <span>{article.title}</span>
                    </nav>
                </div>

                {/* Article */}
                <main style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 64px" }}>
                    <header style={{ marginBottom: 32 }}>
                        {article.category && (
                            <span style={{ display: "inline-block", padding: "4px 12px", background: "rgba(245,158,11,0.1)", color: "#D97706", borderRadius: 6, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
                                {article.category}
                            </span>
                        )}
                        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#16324F", lineHeight: 1.2, marginBottom: 12, letterSpacing: "-0.02em" }}>
                            {article.title}
                        </h1>
                        {article.excerpt && (
                            <p style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.6, marginBottom: 16 }}>
                                {article.excerpt}
                            </p>
                        )}
                        <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9CA3AF" }}>
                            {article.author?.name && <span>Door {article.author.name}</span>}
                            {article.publishedAt && (
                                <span>{new Date(article.publishedAt).toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric" })}</span>
                            )}
                        </div>
                    </header>

                    {article.featuredImage && (
                        <img src={article.featuredImage} alt={article.title}
                            style={{ width: "100%", borderRadius: 16, marginBottom: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    )}

                    {/* Article Content — Full typography styles */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        .article-content { font-size: 17px; line-height: 1.85; color: #374151; }
                        .article-content > *:first-child { margin-top: 0; }

                        /* Headings */
                        .article-content h2 {
                            font-size: 26px; font-weight: 800; color: #16324F; margin: 48px 0 16px;
                            line-height: 1.25; letter-spacing: -0.02em;
                            padding-bottom: 10px; border-bottom: 2px solid #F59E0B;
                        }
                        .article-content h3 {
                            font-size: 21px; font-weight: 700; color: #1E293B; margin: 36px 0 12px;
                            line-height: 1.3;
                        }
                        .article-content h4 {
                            font-size: 18px; font-weight: 600; color: #334155; margin: 28px 0 10px;
                        }

                        /* Paragraphs */
                        .article-content p { margin: 16px 0; }
                        .article-content p + p { margin-top: 20px; }

                        /* Links */
                        .article-content a {
                            color: #D97706; text-decoration: underline;
                            text-decoration-color: rgba(217,119,6,0.3);
                            transition: text-decoration-color 0.2s;
                        }
                        .article-content a:hover { text-decoration-color: #D97706; }

                        /* Lists */
                        .article-content ul {
                            list-style: none; padding-left: 0; margin: 20px 0;
                        }
                        .article-content ul li {
                            position: relative; padding-left: 24px; margin: 10px 0;
                        }
                        .article-content ul li::before {
                            content: ''; position: absolute; left: 2px; top: 11px;
                            width: 8px; height: 8px; border-radius: 50%;
                            background: #F59E0B;
                        }
                        .article-content ol {
                            padding-left: 24px; margin: 20px 0;
                            counter-reset: item;
                        }
                        .article-content ol li {
                            margin: 10px 0; counter-increment: item;
                            list-style: none; position: relative; padding-left: 8px;
                        }
                        .article-content ol li::before {
                            content: counter(item) '.';
                            position: absolute; left: -24px; top: 0;
                            font-weight: 700; color: #F59E0B;
                        }

                        /* Blockquotes */
                        .article-content blockquote {
                            margin: 28px 0; padding: 20px 24px;
                            border-left: 4px solid #F59E0B;
                            background: rgba(245,158,11,0.04);
                            border-radius: 0 12px 12px 0;
                            font-style: italic; color: #4B5563;
                        }
                        .article-content blockquote p { margin: 8px 0; }

                        /* Images */
                        .article-content img {
                            max-width: 100%; height: auto;
                            border-radius: 12px; margin: 28px 0;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                        }

                        /* Horizontal rules */
                        .article-content hr {
                            border: none; height: 2px; margin: 40px 0;
                            background: linear-gradient(to right, transparent, #E8EEF4, transparent);
                        }

                        /* Code blocks */
                        .article-content code {
                            background: #F1F5F9; padding: 2px 6px;
                            border-radius: 4px; font-size: 14px;
                            color: #B45309; font-family: 'JetBrains Mono', monospace;
                        }
                        .article-content pre {
                            background: #1E293B; padding: 20px 24px;
                            border-radius: 12px; overflow-x: auto;
                            margin: 24px 0;
                        }
                        .article-content pre code {
                            background: none; color: #E2E8F0; padding: 0;
                            font-size: 13px; line-height: 1.6;
                        }

                        /* Tables */
                        .article-content table {
                            width: 100%; border-collapse: collapse; margin: 24px 0;
                            border-radius: 8px; overflow: hidden;
                        }
                        .article-content th {
                            background: #16324F; color: white; padding: 12px 16px;
                            text-align: left; font-size: 13px; font-weight: 700;
                            text-transform: uppercase; letter-spacing: 0.04em;
                        }
                        .article-content td {
                            padding: 12px 16px; border-bottom: 1px solid #E8EEF4;
                            font-size: 15px;
                        }
                        .article-content tr:nth-child(even) td { background: #F7F9FC; }

                        /* Strong/Bold */
                        .article-content strong { font-weight: 700; color: #1E293B; }

                        /* Underline */
                        .article-content u {
                            text-decoration: underline;
                            text-decoration-color: #F59E0B;
                            text-underline-offset: 3px;
                        }

                        /* Spacing after featured image */
                        .article-content > h2:first-child { margin-top: 0; }
                    `}} />
                    <div className="article-content"
                        dangerouslySetInnerHTML={{ __html: article.content || "" }} />

                    {/* Related Articles */}
                    {related.length > 0 && (
                        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid #E8EEF4" }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#16324F", marginBottom: 16 }}>Gerelateerde artikelen</h3>
                            <div style={{ display: "grid", gap: 12 }}>
                                {related.map(r => (
                                    <Link key={r.id} href={`/kenniscentrum/${r.slug}`}
                                        style={{ textDecoration: "none", display: "block", padding: "14px 18px", background: "#F7F9FC", borderRadius: 10, border: "1px solid #E8EEF4", color: "#24507A", fontWeight: 600, fontSize: 15 }}>
                                        → {r.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Embedded Lead Form */}
                    <ArticleCTA />
                </main>

                {/* Footer */}
                <footer style={{ background: "#16324F", padding: "32px 24px", textAlign: "center", borderTop: "4px solid #F59E0B" }}>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        © {new Date().getFullYear()} DakkapellenKosten.nl — Alle rechten voorbehouden
                    </p>
                </footer>
            </div>
        </>
    );
}
