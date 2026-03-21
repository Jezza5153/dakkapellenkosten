/**
 * Cron: Scheduled Publish — POST /api/cron/scheduled-publish
 * Publishes articles with scheduledAt in the past.
 * Secured with CRON_SECRET.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sql, lt, eq, and, isNotNull } from "drizzle-orm";
import { logAudit } from "@/lib/admin/audit";
import { cronLimiter } from "@/lib/admin/rate-limit";

export async function POST(request: NextRequest) {
    const limited = cronLimiter.check(request);
    if (limited) return limited;

    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();

        // Find articles that should be published
        const candidates = await db.query.articles.findMany({
            where: and(
                eq(schema.articles.status, "scheduled"),
                isNotNull(schema.articles.scheduledAt),
                lt(schema.articles.scheduledAt, now),
                sql`${schema.articles.deletedAt} IS NULL`
            ),
        });

        const published: string[] = [];

        for (const article of candidates) {
            await db.update(schema.articles)
                .set({
                    status: "published",
                    publishedAt: now,
                    updatedAt: now,
                })
                .where(eq(schema.articles.id, article.id));

            published.push(article.title);

            await logAudit({
                actorName: "Cron",
                action: "publish",
                entityType: "article",
                entityId: article.id,
                entityTitle: article.title,
                diff: {
                    status: { old: "scheduled", new: "published" },
                },
            });
        }

        return NextResponse.json({
            success: true,
            published: published.length,
            titles: published,
        });
    } catch (error) {
        console.error("[cron/scheduled-publish] Error:", error);
        return NextResponse.json({ error: "Publish failed" }, { status: 500 });
    }
}
