/**
 * SEO Audit API — GET /api/admin/seo/audit
 * Server-side SEO analysis with cached snapshots
 * Replaces browser-side analysis with proper server aggregation
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return true;
}

interface SeoIssue {
    type: "error" | "warning" | "info";
    entity: "article" | "page";
    entityId: string;
    entityTitle: string;
    entitySlug: string;
    field: string;
    message: string;
}

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const issues: SeoIssue[] = [];

    // Fetch all published articles
    const articles = await db.query.articles.findMany({
        where: sql`${schema.articles.status} = 'published' AND ${schema.articles.deletedAt} IS NULL`,
        columns: {
            id: true, title: true, slug: true, seoTitle: true,
            seoDescription: true, featuredImage: true, content: true,
            canonicalUrl: true,
        },
    });

    // Fetch all published pages
    const pages = await db.query.pages.findMany({
        where: sql`${schema.pages.status} = 'published' AND ${schema.pages.deletedAt} IS NULL`,
        columns: {
            id: true, title: true, slug: true, seoTitle: true,
            seoDescription: true, featuredImage: true, content: true,
            canonicalUrl: true, structuredData: true,
        },
    });

    // Check articles
    for (const a of articles) {
        const base = { entity: "article" as const, entityId: a.id, entityTitle: a.title, entitySlug: a.slug };

        // Missing SEO title
        if (!a.seoTitle) {
            issues.push({ ...base, type: "error", field: "seoTitle", message: "SEO titel ontbreekt" });
        } else if (a.seoTitle.length > 60) {
            issues.push({ ...base, type: "warning", field: "seoTitle", message: `SEO titel te lang (${a.seoTitle.length}/60)` });
        }

        // Missing SEO description
        if (!a.seoDescription) {
            issues.push({ ...base, type: "error", field: "seoDescription", message: "Meta description ontbreekt" });
        } else if (a.seoDescription.length > 155) {
            issues.push({ ...base, type: "warning", field: "seoDescription", message: `Meta description te lang (${a.seoDescription.length}/155)` });
        }

        // Missing featured image
        if (!a.featuredImage) {
            issues.push({ ...base, type: "warning", field: "featuredImage", message: "Featured image ontbreekt" });
        }

        // Content length
        const wordCount = a.content ? a.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length : 0;
        if (wordCount < 300) {
            issues.push({ ...base, type: "warning", field: "content", message: `Content te kort (${wordCount} woorden, min 300)` });
        }

        // Title length
        if (a.title.length > 70) {
            issues.push({ ...base, type: "info", field: "title", message: `Titel erg lang (${a.title.length} tekens)` });
        }
    }

    // Check pages
    for (const p of pages) {
        const base = { entity: "page" as const, entityId: p.id, entityTitle: p.title, entitySlug: p.slug };

        if (!p.seoTitle) {
            issues.push({ ...base, type: "error", field: "seoTitle", message: "SEO titel ontbreekt" });
        } else if (p.seoTitle.length > 60) {
            issues.push({ ...base, type: "warning", field: "seoTitle", message: `SEO titel te lang (${p.seoTitle.length}/60)` });
        }

        if (!p.seoDescription) {
            issues.push({ ...base, type: "error", field: "seoDescription", message: "Meta description ontbreekt" });
        } else if (p.seoDescription.length > 155) {
            issues.push({ ...base, type: "warning", field: "seoDescription", message: `Meta description te lang (${p.seoDescription.length}/155)` });
        }

        if (!p.featuredImage) {
            issues.push({ ...base, type: "warning", field: "featuredImage", message: "Featured image ontbreekt" });
        }

        const wordCount = p.content ? p.content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length : 0;
        if (wordCount < 200) {
            issues.push({ ...base, type: "warning", field: "content", message: `Content te kort (${wordCount} woorden, min 200)` });
        }

        // Structured data check
        if (!p.structuredData) {
            issues.push({ ...base, type: "info", field: "structuredData", message: "Geen structured data (schema.org)" });
        }
    }

    // Aggregate stats
    const errors = issues.filter(i => i.type === "error").length;
    const warnings = issues.filter(i => i.type === "warning").length;
    const infos = issues.filter(i => i.type === "info").length;

    // Score calculation (simple: 100 - 5*errors - 2*warnings - 0.5*infos, min 0)
    const totalContent = articles.length + pages.length;
    const maxScore = 100;
    const score = Math.max(0, Math.round(maxScore - (errors * 5) - (warnings * 2) - (infos * 0.5)));

    return NextResponse.json({
        score,
        totalContent,
        issues,
        summary: { errors, warnings, infos },
        auditedAt: new Date().toISOString(),
    });
}
