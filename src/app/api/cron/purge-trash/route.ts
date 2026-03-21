/**
 * Trash Purge Cron — permanently deletes items trashed >30 days ago
 * Protected by CRON_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { isNotNull, lt, and, sql } from "drizzle-orm";
import { logAudit } from "@/lib/admin/audit";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    let purgedArticles = 0;
    let purgedPages = 0;
    let purgedMedia = 0;

    // Purge old trashed articles
    const deletedArticles = await db.delete(schema.articles)
        .where(and(
            isNotNull(schema.articles.deletedAt),
            lt(schema.articles.deletedAt!, thirtyDaysAgo)
        ))
        .returning({ id: schema.articles.id });
    purgedArticles = deletedArticles.length;

    // Purge old trashed pages
    const deletedPages = await db.delete(schema.pages)
        .where(and(
            isNotNull(schema.pages.deletedAt),
            lt(schema.pages.deletedAt!, thirtyDaysAgo)
        ))
        .returning({ id: schema.pages.id });
    purgedPages = deletedPages.length;

    // Purge old trashed media
    const deletedMedia = await db.delete(schema.media)
        .where(and(
            isNotNull(schema.media.deletedAt),
            lt(schema.media.deletedAt!, thirtyDaysAgo)
        ))
        .returning({ id: schema.media.id });
    purgedMedia = deletedMedia.length;

    const total = purgedArticles + purgedPages + purgedMedia;

    if (total > 0) {
        await logAudit({
            actorId: null,
            actorName: "System (cron)",
            action: "delete",
            entityType: "trash",
            entityTitle: `Auto-purge: ${purgedArticles} artikelen, ${purgedPages} pagina's, ${purgedMedia} media`,
        });
    }

    return NextResponse.json({
        success: true,
        purged: { articles: purgedArticles, pages: purgedPages, media: purgedMedia, total },
    });
}
