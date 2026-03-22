/**
 * Companies Stats API — GET /api/admin/companies/stats
 * Operational dashboard data: credits overview, service areas, activity metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, sql, desc, gte } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    // Per-company stats
    if (companyId) {
        const [
            company,
            creditBalance,
            recentTransactions,
            serviceAreas,
            photos,
            leadMatches,
            subscription,
        ] = await Promise.all([
            db.query.companies.findFirst({
                where: eq(schema.companies.id, companyId),
            }),
            db.query.creditBalances.findFirst({
                where: eq(schema.creditBalances.companyId, companyId),
            }),
            db.query.creditTransactions.findMany({
                where: eq(schema.creditTransactions.companyId, companyId),
                orderBy: [desc(schema.creditTransactions.createdAt)],
                limit: 10,
            }),
            db.query.serviceAreas.findMany({
                where: eq(schema.serviceAreas.companyId, companyId),
            }),
            db.query.companyPhotos.findMany({
                where: eq(schema.companyPhotos.companyId, companyId),
            }),
            db.query.leadMatches.findMany({
                where: eq(schema.leadMatches.companyId, companyId),
                orderBy: [desc(schema.leadMatches.createdAt)],
                limit: 20,
            }),
            db.query.subscriptions.findFirst({
                where: eq(schema.subscriptions.companyId, companyId),
            }),
        ]);

        if (!company) {
            return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
        }

        // Compute response/win rates
        const totalMatches = leadMatches.length;
        const accepted = leadMatches.filter(m => m.status === "accepted" || m.status === "contacted" || m.status === "won").length;
        const won = leadMatches.filter(m => m.status === "won").length;
        const responseRate = totalMatches > 0 ? Math.round((accepted / totalMatches) * 100) : 0;
        const winRate = accepted > 0 ? Math.round((won / accepted) * 100) : 0;

        return NextResponse.json({
            company,
            credits: {
                balance: creditBalance?.balance || 0,
                totalPurchased: creditBalance?.totalPurchased || 0,
                totalSpent: creditBalance?.totalSpent || 0,
            },
            recentTransactions,
            serviceAreas,
            photos,
            subscription: subscription ? {
                plan: subscription.plan,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd,
            } : null,
            metrics: {
                totalMatches,
                responseRate,
                winRate,
                recentLeads: leadMatches.slice(0, 5),
            },
        });
    }

    // System-wide company stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [overviewResult, subscriptionStats, creditStats] = await Promise.all([
        db.select({
            total: sql<number>`count(*)::int`,
            verified: sql<number>`count(*) FILTER (WHERE is_verified = true)::int`,
            public: sql<number>`count(*) FILTER (WHERE is_public = true)::int`,
            withPhotos: sql<number>`count(*) FILTER (WHERE id IN (SELECT company_id FROM company_photos))::int`,
            avgRating: sql<string>`round(avg(avg_rating::numeric) FILTER (WHERE avg_rating IS NOT NULL), 1)::text`,
        }).from(schema.companies).where(sql`${schema.companies.deletedAt} IS NULL`),

        db.select({
            active: sql<number>`count(*) FILTER (WHERE status = 'active')::int`,
            trialing: sql<number>`count(*) FILTER (WHERE status = 'trialing')::int`,
            pastDue: sql<number>`count(*) FILTER (WHERE status = 'past_due')::int`,
            canceled: sql<number>`count(*) FILTER (WHERE status = 'canceled')::int`,
        }).from(schema.subscriptions),

        db.select({
            totalCreditsInCirculation: sql<number>`coalesce(sum(balance), 0)::int`,
            totalPurchased: sql<number>`coalesce(sum(total_purchased), 0)::int`,
            totalSpent: sql<number>`coalesce(sum(total_spent), 0)::int`,
        }).from(schema.creditBalances),
    ]);

    return NextResponse.json({
        overview: overviewResult[0],
        subscriptions: subscriptionStats[0],
        credits: creditStats[0],
    });
}
