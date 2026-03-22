/**
 * Media Usage API — GET /api/admin/media/[id]/usage
 * Shows where a media item is referenced (articles, pages)
 * Also provides intelligence: alt missing, oversized warnings
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, sql, ilike } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    // Get the media item
    const mediaItem = await db.query.media.findFirst({
        where: eq(schema.media.id, id),
    });

    if (!mediaItem) {
        return NextResponse.json({ error: "Media niet gevonden" }, { status: 404 });
    }

    // Find articles referencing this media (by URL in content or featuredImage)
    const articleRefs = await db.query.articles.findMany({
        where: sql`(${schema.articles.content} ILIKE ${'%' + mediaItem.url + '%'} OR ${schema.articles.featuredImage} = ${mediaItem.url}) AND ${schema.articles.deletedAt} IS NULL`,
        columns: { id: true, title: true, slug: true, status: true },
    });

    // Find pages referencing this media
    const pageRefs = await db.query.pages.findMany({
        where: sql`(${schema.pages.content} ILIKE ${'%' + mediaItem.url + '%'} OR ${schema.pages.featuredImage} = ${mediaItem.url}) AND ${schema.pages.deletedAt} IS NULL`,
        columns: { id: true, title: true, slug: true, status: true },
    });

    // Intelligence warnings
    const warnings: string[] = [];
    if (!mediaItem.altText) {
        warnings.push("Alt tekst ontbreekt — slecht voor SEO en toegankelijkheid");
    }
    if (mediaItem.sizeBytes && mediaItem.sizeBytes > 500 * 1024) {
        warnings.push(`Bestand is ${Math.round(mediaItem.sizeBytes / 1024)}KB — overweeg te comprimeren (<500KB)`);
    }
    if (mediaItem.width && mediaItem.width > 2000) {
        warnings.push(`Breedte is ${mediaItem.width}px — overweeg smaller formaat`);
    }

    const usedIn = [
        ...articleRefs.map(a => ({ type: "article" as const, id: a.id, title: a.title, href: `/admin/articles/${a.id}` })),
        ...pageRefs.map(p => ({ type: "page" as const, id: p.id, title: p.title, href: `/admin/pages/${p.id}` })),
    ];

    return NextResponse.json({
        media: mediaItem,
        usedIn,
        usageCount: usedIn.length,
        warnings,
        isOrphan: usedIn.length === 0,
    });
}
