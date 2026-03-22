/**
 * Cron: Scheduled Publish + Lead Expiry + Lock Cleanup
 * POST /api/cron/scheduled-publish
 * 
 * Runs every 5 minutes. Handles:
 * 1. Publishing articles with scheduledAt in the past
 * 2. Expiring leads past their expiresAt
 * 3. Cleaning up expired content locks
 * 
 * Secured with CRON_SECRET (Bearer auth) + rate limiter.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sql, lt, lte, eq, and, isNotNull, isNull } from "drizzle-orm";
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

        // === 1. Scheduled Publishing ===
        const candidates = await db.query.articles.findMany({
            where: and(
                eq(schema.articles.status, "scheduled"),
                isNotNull(schema.articles.scheduledAt),
                lt(schema.articles.scheduledAt, now),
                isNull(schema.articles.deletedAt),
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

        // === 2. Lead Expiry ===
        const expiredLeads = await db
            .update(schema.leads)
            .set({
                status: "expired",
                updatedAt: now,
            })
            .where(and(
                isNotNull(schema.leads.expiresAt),
                lte(schema.leads.expiresAt, now),
                sql`${schema.leads.status} NOT IN ('fulfilled', 'cancelled', 'expired')`,
            ))
            .returning({ id: schema.leads.id, naam: schema.leads.naam, status: schema.leads.status });

        for (const lead of expiredLeads) {
            await logAudit({
                actorName: "Cron",
                action: "status_change",
                entityType: "lead",
                entityId: lead.id,
                entityTitle: lead.naam,
                diff: { status: { old: lead.status, new: "expired" } },
            });
        }

        // === 3. Content Lock Cleanup ===
        const expiredLocks = await db.delete(schema.contentLocks)
            .where(lt(schema.contentLocks.expiresAt, now))
            .returning({ id: schema.contentLocks.id });

        return NextResponse.json({
            success: true,
            published: published.length,
            titles: published,
            expiredLeads: expiredLeads.length,
            cleanedLocks: expiredLocks.length,
            timestamp: now.toISOString(),
        });
    } catch (error) {
        console.error("[cron/scheduled-publish] Error:", error);
        return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
    }
}

