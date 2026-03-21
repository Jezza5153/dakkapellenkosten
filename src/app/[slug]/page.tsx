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
                        <div 
                            className="article-content"
                            style={{ fontSize: 16, lineHeight: 1.8, color: "#374151" }}
                            dangerouslySetInnerHTML={{ __html: page.content }} 
                        />
                    ) : (
                        <p style={{ color: "#9CA3AF", textAlign: "center" }}>Inhoud wordt binnenkort toegevoegd.</p>
                    )}
                </section>

                {/* CTA */}
                <section style={{ background: "linear-gradient(135deg, #16324F, #1a3a5c)", padding: "60px 24px", textAlign: "center" }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 12 }}>
                        Klaar om dakkapel offertes te vergelijken{page.city ? ` in ${page.city}` : ""}?
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24, fontSize: 16 }}>
                        Ontvang binnen 48 uur tot 4 vrijblijvende offertes. 100% gratis.
                    </p>
                    <Link href="/#offerte" style={{ display: "inline-block", padding: "16px 36px", background: "#F59E0B", color: "#1E293B", borderRadius: 12, fontWeight: 700, fontSize: 18, textDecoration: "none" }}>
                        Nu gratis offertes vergelijken →
                    </Link>
                </section>

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
