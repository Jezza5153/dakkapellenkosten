/**
 * Analytics API — GET /api/company/analytics
 * Returns company performance metrics
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq, and, gte, count, avg, sql } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
        });

        if (!membership) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 404 });
        }

        const companyId = membership.companyId;

        // All lead matches
        const allMatches = await db.query.leadMatches.findMany({
            where: eq(schema.leadMatches.companyId, companyId),
        });

        const totalNotified = allMatches.length;
        const totalAccepted = allMatches.filter(m => m.status === "accepted" || m.status === "contacted" || m.status === "won" || m.status === "lost").length;
        const totalDeclined = allMatches.filter(m => m.status === "declined").length;
        const totalContacted = allMatches.filter(m => m.status === "contacted" || m.status === "won" || m.status === "lost").length;
        const totalWon = allMatches.filter(m => m.status === "won").length;
        const totalLost = allMatches.filter(m => m.status === "lost").length;

        // Accept rate
        const acceptRate = totalNotified > 0
            ? Math.round((totalAccepted / totalNotified) * 100)
            : 0;

        // Conversion rate (won / accepted)
        const conversionRate = totalAccepted > 0
            ? Math.round((totalWon / totalAccepted) * 100)
            : 0;

        // Average response time (time between notifiedAt and acceptedAt)
        const acceptedWithTime = allMatches.filter(m => m.acceptedAt && m.notifiedAt);
        let avgResponseHrs = 0;
        if (acceptedWithTime.length > 0) {
            const totalHrs = acceptedWithTime.reduce((sum, m) => {
                const diff = new Date(m.acceptedAt!).getTime() - new Date(m.notifiedAt).getTime();
                return sum + (diff / (1000 * 60 * 60));
            }, 0);
            avgResponseHrs = Math.round((totalHrs / acceptedWithTime.length) * 10) / 10;
        }

        // Credit stats
        const creditBalance = await db.query.creditBalances.findFirst({
            where: eq(schema.creditBalances.companyId, companyId),
        });

        // Last 30 days stats
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentMatches = allMatches.filter(m => new Date(m.createdAt) >= thirtyDaysAgo);
        const recentAccepted = recentMatches.filter(m => ["accepted", "contacted", "won", "lost"].includes(m.status)).length;

        // Monthly breakdown (last 6 months)
        const monthlyStats = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date();
            start.setMonth(start.getMonth() - i, 1);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);

            const monthMatches = allMatches.filter(m => {
                const d = new Date(m.createdAt);
                return d >= start && d < end;
            });

            monthlyStats.push({
                month: start.toLocaleDateString("nl-NL", { month: "short", year: "numeric" }),
                notified: monthMatches.length,
                accepted: monthMatches.filter(m => ["accepted", "contacted", "won", "lost"].includes(m.status)).length,
                won: monthMatches.filter(m => m.status === "won").length,
            });
        }

        return NextResponse.json({
            overview: {
                totalLeadsReceived: totalNotified,
                totalLeadsAccepted: totalAccepted,
                totalLeadsDeclined: totalDeclined,
                totalContacted: totalContacted,
                totalWon: totalWon,
                totalLost: totalLost,
                acceptRate,
                conversionRate,
                avgResponseHrs,
            },
            credits: {
                balance: creditBalance?.balance ?? 0,
                totalPurchased: creditBalance?.totalPurchased ?? 0,
                totalSpent: creditBalance?.totalSpent ?? 0,
            },
            last30Days: {
                leadsReceived: recentMatches.length,
                leadsAccepted: recentAccepted,
            },
            monthlyStats,
        });
    } catch (error) {
        console.error("[analytics] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
