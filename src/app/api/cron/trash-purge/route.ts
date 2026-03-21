/**
 * Cron: Trash Purge — POST /api/cron/trash-purge
 * Permanently deletes soft-deleted items older than retention period.
 * Reads retention days from settings (default 30).
 * Secured with CRON_SECRET.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sql, lt, and, isNotNull } from "drizzle-orm";
import { logAudit } from "@/lib/admin/audit";
import { cronLimiter } from "@/lib/admin/rate-limit";

export async function POST(request: NextRequest) {
    // Rate limit: max 2 cron calls per minute
    const limited = cronLimiter.check(request);
    if (limited) return limited;

    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Read retention from settings (default 30 days)
        const retentionSetting = await db.query.settings.findFirst({
            where: sql`${schema.settings.key} = 'system.trashRetentionDays'`,
        });
        const retentionDays = (retentionSetting?.value as number) || 30;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - retentionDays);

        // Purge articles
        const deletedArticles = await db.delete(schema.articles)
            .where(and(
                isNotNull(schema.articles.deletedAt),
                lt(schema.articles.deletedAt, cutoff)
            ))
            .returning({ id: schema.articles.id, title: schema.articles.title });

        // Purge pages
        const deletedPages = await db.delete(schema.pages)
            .where(and(
                isNotNull(schema.pages.deletedAt),
                lt(schema.pages.deletedAt, cutoff)
            ))
            .returning({ id: schema.pages.id, title: schema.pages.title });

        // Purge media
        const deletedMedia = await db.delete(schema.media)
            .where(and(
                isNotNull(schema.media.deletedAt),
                lt(schema.media.deletedAt, cutoff)
            ))
            .returning({ id: schema.media.id, filename: schema.media.filename });

        const totalPurged = deletedArticles.length + deletedPages.length + deletedMedia.length;

        // Audit log
        if (totalPurged > 0) {
            await logAudit({
                actorName: "Cron",
                action: "trash_purge",
                entityType: "system",
                entityTitle: `${totalPurged} items verwijderd (retentie: ${retentionDays}d)`,
                diff: {
                    articles: { old: null, new: deletedArticles.length },
                    pages: { old: null, new: deletedPages.length },
                    media: { old: null, new: deletedMedia.length },
                },
            });
        }

        // Clean expired content locks
        await db.delete(schema.contentLocks)
            .where(lt(schema.contentLocks.expiresAt, new Date()));

        return NextResponse.json({
            success: true,
            retentionDays,
            purged: {
                articles: deletedArticles.length,
                pages: deletedPages.length,
                media: deletedMedia.length,
                total: totalPurged,
            },
        });
    } catch (error) {
        console.error("[cron/trash-purge] Error:", error);
        return NextResponse.json({ error: "Purge failed" }, { status: 500 });
    }
}
