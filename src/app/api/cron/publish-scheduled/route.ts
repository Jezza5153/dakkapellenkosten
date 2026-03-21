/**
 * Scheduled Publish Cron — /api/cron/publish-scheduled
 * Publishes articles where scheduledAt <= NOW() and status = 'scheduled'
 * Run every 5 minutes via Vercel Cron or node-cron
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, lte, sql } from "drizzle-orm";
import { logAudit } from "@/lib/admin/audit";

export async function GET(request: NextRequest) {
    // Verify cron secret (for production security)
    const cronSecret = request.headers.get("x-cron-secret") || 
                       request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && cronSecret !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // Find articles that should be published
    const scheduledArticles = await db.query.articles.findMany({
        where: and(
            eq(schema.articles.status, "scheduled"),
            lte(schema.articles.scheduledAt!, now)
        ),
    });

    let publishedCount = 0;

    for (const article of scheduledArticles) {
        await db.update(schema.articles)
            .set({
                status: "published",
                publishedAt: now,
                updatedAt: now,
            })
            .where(eq(schema.articles.id, article.id));

        await logAudit({
            action: "publish",
            entityType: "article",
            entityId: article.id,
            entityTitle: article.title,
            actorName: "System (Scheduled)",
        });

        publishedCount++;
    }

    // Also handle lead expiry
    const expiredLeads = await db
        .update(schema.leads)
        .set({
            status: "expired",
            updatedAt: now,
        })
        .where(and(
            lte(schema.leads.expiresAt!, now),
            sql`${schema.leads.status} NOT IN ('fulfilled', 'cancelled', 'expired')`
        ))
        .returning({ id: schema.leads.id, naam: schema.leads.naam });

    for (const lead of expiredLeads) {
        await logAudit({
            action: "status_change",
            entityType: "lead",
            entityId: lead.id,
            entityTitle: lead.naam,
            actorName: "System (Auto-expire)",
            diff: { status: { old: "available", new: "expired" } },
        });
    }

    return NextResponse.json({
        ok: true,
        publishedArticles: publishedCount,
        expiredLeads: expiredLeads.length,
        timestamp: now.toISOString(),
    });
}
