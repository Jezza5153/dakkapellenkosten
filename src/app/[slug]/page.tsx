/**
 * Dynamic Geo-Page Route — /[slug]
 * Renders location-targeted SEO pages from CMS database
 * e.g. /dakkapel-amsterdam, /dakkapel-rotterdam
 */

export const dynamic = "force-dynamic";

import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { GeoCTA } from "@/components/geo-cta";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const page = await db.query.pages.findFirst({
        where: and(
            eq(schema.pages.slug, slug),
            eq(schema.pages.status, "published")
        ),
    });

    if (!page) return {};

    return {
        title: page.seoTitle || page.title,
        description: page.seoDescription || undefined,
        alternates: { canonical: `https://dakkapellenkosten.nl/${page.slug}` },
        openGraph: {
            title: page.seoTitle || page.title,
            description: page.seoDescription || undefined,
            url: `https://dakkapellenkosten.nl/${page.slug}`,
            type: "website",
            locale: "nl_NL",
            siteName: "DakkapellenKosten.nl",
        },
        twitter: {
            card: "summary_large_image",
            title: page.seoTitle || page.title,
            description: page.seoDescription || undefined,
        },
    };
}

export default async function GeoPage({ params }: PageProps) {
    const { slug } = await params;

    const page = await db.query.pages.findFirst({
        where: and(
            eq(schema.pages.slug, slug),
            eq(schema.pages.status, "published")
        ),
    });

    if (!page) notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.title,
        description: page.seoDescription || page.title,
        url: `https://dakkapellenkosten.nl/${page.slug}`,
        provider: {
            "@type": "Organization",
            "@id": "https://dakkapellenkosten.nl/#organization",
            name: "DakkapellenKosten.nl",
        },
        ...(page.city && {
            areaServed: {
                "@type": "City",
                name: page.city,
                "@id": `https://www.wikidata.org/wiki/${page.city}`,
            },
        }),
        ...(page.service && { serviceType: page.service }),
    };

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://dakkapellenkosten.nl/" },
            { "@type": "ListItem", position: 2, name: page.title, item: `https://dakkapellenkosten.nl/${page.slug}` },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }} />
            <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#1E293B" }}>
                {/* Header */}
                <header style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E8EEF4", padding: "0 24px", position: "sticky", top: 0, zIndex: 1000 }}>
                    <div style={{ maxWidth: 1200, margin: "0 auto", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#16324F" }}>
                            Dakkapellen<span style={{ color: "#F59E0B" }}>Kosten</span>.nl
                        </Link>
                        <Link href="/#offerte" style={{ padding: "10px 20px", background: "#F59E0B", color: "#1E293B", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                            Gratis offertes →
                        </Link>
                    </div>
                </header>

                {/* Breadcrumbs */}
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 24px" }}>
                    <nav style={{ fontSize: 13, color: "#64748B" }}>
                        <Link href="/" style={{ color: "#24507A", textDecoration: "none" }}>Home</Link>
                        <span style={{ margin: "0 6px" }}>›</span>
                        <span>{page.title}</span>
                    </nav>
                </div>

                {/* Hero */}
                <section style={{ background: "linear-gradient(165deg, #f0f4f9, #F7F9FC)", padding: "40px 24px 60px" }}>
                    <div style={{ maxWidth: 900, margin: "0 auto" }}>
                        {page.city && (
                            <span style={{ display: "inline-block", padding: "4px 12px", background: "rgba(36,80,122,0.1)", color: "#24507A", borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                                📍 {page.city}
                            </span>
                        )}
                        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#16324F", lineHeight: 1.2, marginBottom: 16 }}>
                            {page.title}
                        </h1>
                        {page.seoDescription && (
                            <p style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.6, marginBottom: 24, maxWidth: 700 }}>
                                {page.seoDescription}
                            </p>
                        )}
                        <Link href="/#offerte" style={{ display: "inline-block", padding: "14px 28px", background: "#F59E0B", color: "#1E293B", borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none" }}>
                            Vergelijk dakkapel offertes {page.city ? `in ${page.city}` : ""} →
                        </Link>
                    </div>
                </section>

                {/* Content */}
                <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
                    {page.content ? (
                        <>
                        <style dangerouslySetInnerHTML={{ __html: `
                            .article-content { font-size: 17px; line-height: 1.85; color: #374151; }
                            .article-content > *:first-child { margin-top: 0; }
                            .article-content h2 { font-size: 26px; font-weight: 800; color: #16324F; margin: 48px 0 16px; line-height: 1.25; letter-spacing: -0.02em; padding-bottom: 10px; border-bottom: 2px solid #F59E0B; }
                            .article-content h3 { font-size: 21px; font-weight: 700; color: #1E293B; margin: 36px 0 12px; line-height: 1.3; }
                            .article-content h4 { font-size: 18px; font-weight: 600; color: #334155; margin: 28px 0 10px; }
                            .article-content p { margin: 16px 0; }
                            .article-content a { color: #D97706; text-decoration: underline; text-decoration-color: rgba(217,119,6,0.3); }
                            .article-content a:hover { text-decoration-color: #D97706; }
                            .article-content ul { list-style: none; padding-left: 0; margin: 20px 0; }
                            .article-content ul li { position: relative; padding-left: 24px; margin: 10px 0; }
                            .article-content ul li::before { content: ''; position: absolute; left: 2px; top: 11px; width: 8px; height: 8px; border-radius: 50%; background: #F59E0B; }
                            .article-content ol { padding-left: 24px; margin: 20px 0; counter-reset: item; }
                            .article-content ol li { margin: 10px 0; counter-increment: item; list-style: none; position: relative; padding-left: 8px; }
                            .article-content ol li::before { content: counter(item) '.'; position: absolute; left: -24px; top: 0; font-weight: 700; color: #F59E0B; }
                            .article-content blockquote { margin: 28px 0; padding: 20px 24px; border-left: 4px solid #F59E0B; background: rgba(245,158,11,0.04); border-radius: 0 12px 12px 0; font-style: italic; color: #4B5563; }
                            .article-content blockquote p { margin: 8px 0; }
                            .article-content img { max-width: 100%; height: auto; border-radius: 12px; margin: 28px 0; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                            .article-content hr { border: none; height: 2px; margin: 40px 0; background: linear-gradient(to right, transparent, #E8EEF4, transparent); }
                            .article-content code { background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-size: 14px; color: #B45309; }
                            .article-content pre { background: #1E293B; padding: 20px 24px; border-radius: 12px; overflow-x: auto; margin: 24px 0; }
                            .article-content pre code { background: none; color: #E2E8F0; padding: 0; font-size: 13px; }
                            .article-content strong { font-weight: 700; color: #1E293B; }
                            .article-content u { text-decoration: underline; text-decoration-color: #F59E0B; text-underline-offset: 3px; }
                        `}} />
                        <div 
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: page.content }} 
                        />
                        </>
                    ) : (
                        <p style={{ color: "#9CA3AF", textAlign: "center" }}>Inhoud wordt binnenkort toegevoegd.</p>
                    )}
                </section>

                {/* Embedded Lead Form */}
                <GeoCTA city={page.city} />

                {/* Footer */}
                <footer style={{ background: "#16324F", padding: "32px 24px", textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        © {new Date().getFullYear()} DakkapellenKosten.nl — Alle rechten voorbehouden
                    </p>
                </footer>
            </div>
        </>
    );
}
