/**
 * CRM Stats API — GET aggregated funnel, trends, city, type data
 * Replaces client-side computation from dashboard endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sql, eq, gte } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    // Status distribution (funnel)
    const statusCounts = await db
        .select({
            status: schema.leads.status,
            count: sql<number>`count(*)::int`,
        })
        .from(schema.leads)
        .groupBy(schema.leads.status);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await db
        .select({
            month: sql<string>`to_char(created_at, 'YYYY-MM')`,
            count: sql<number>`count(*)::int`,
        })
        .from(schema.leads)
        .where(gte(schema.leads.createdAt, sixMonthsAgo))
        .groupBy(sql`to_char(created_at, 'YYYY-MM')`)
        .orderBy(sql`to_char(created_at, 'YYYY-MM')`);

    // Top cities
    const topCities = await db
        .select({
            city: schema.leads.city,
            count: sql<number>`count(*)::int`,
        })
        .from(schema.leads)
        .groupBy(schema.leads.city)
        .orderBy(sql`count(*) DESC`)
        .limit(10);

    // Dakkapel type distribution
    const typeDistribution = await db
        .select({
            type: schema.leads.dakkapelType,
            count: sql<number>`count(*)::int`,
        })
        .from(schema.leads)
        .groupBy(schema.leads.dakkapelType)
        .orderBy(sql`count(*) DESC`);

    // Company stats
    const companyStats = await db
        .select({
            total: sql<number>`count(*)::int`,
            verified: sql<number>`count(*) FILTER (WHERE is_verified = true)::int`,
            withReviews: sql<number>`count(*) FILTER (WHERE review_count > 0)::int`,
            avgRating: sql<string>`round(avg(avg_rating::numeric), 1)::text`,
        })
        .from(schema.companies);

    // Total leads
    const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.leads);

    // Recent leads (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.leads)
        .where(gte(schema.leads.createdAt, thirtyDaysAgo));

    return NextResponse.json({
        totalLeads: totalResult[0]?.count || 0,
        recentLeads30d: recentResult[0]?.count || 0,
        funnel: Object.fromEntries(statusCounts.map(s => [s.status, s.count])),
        monthlyTrend,
        topCities,
        typeDistribution,
        companyStats: companyStats[0] || { total: 0, verified: 0, withReviews: 0, avgRating: null },
    });
}
