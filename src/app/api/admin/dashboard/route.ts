/**
 * Admin API — Leads + Companies + Credits
 * GET /api/admin/dashboard — overview stats
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq, desc, count, sql, and, gte } from "drizzle-orm";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const user = await db.query.users.findFirst({
        where: eq(schema.users.id, session.user.id),
    });

    if (!user || user.role !== "admin") return null;
    return user;
}

export async function GET() {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Toegang geweigerd" }, { status: 403 });
        }

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        // Total counts
        const allCompanies = await db.query.companies.findMany();
        const allLeads = await db.query.leads.findMany({
            orderBy: [desc(schema.leads.createdAt)],
        });
        const allSubscriptions = await db.query.subscriptions.findMany();

        // Recent leads
        const recentLeads = allLeads.filter(l => new Date(l.createdAt) >= thirtyDaysAgo);

        // Active subscriptions
        const activeSubs = allSubscriptions.filter(s => s.status === "active" || s.status === "trialing");

        // Credit totals
        const allBalances = await db.query.creditBalances.findMany();
        const totalCreditsInCirculation = allBalances.reduce((sum, b) => sum + b.balance, 0);

        // Lead match stats
        const allMatches = await db.query.leadMatches.findMany();
        const totalAccepted = allMatches.filter(m => m.status === "accepted" || m.status === "contacted" || m.status === "won" || m.status === "lost").length;
        const totalCreditsSpent = allMatches.reduce((sum, m) => sum + (m.creditsCharged || 0), 0);

        // Recent leads with details (last 20)
        const recentLeadsList = allLeads.slice(0, 20).map(l => ({
            id: l.id,
            naam: l.naam,
            email: l.email,
            postcode: l.postcode,
            dakkapelType: l.dakkapelType,
            breedte: l.breedte,
            status: l.status,
            matchCount: l.matchCount,
            acceptCount: l.acceptCount,
            createdAt: l.createdAt,
        }));

        // Companies with subscription status
        const companiesList = await Promise.all(
            allCompanies.map(async (c) => {
                const sub = allSubscriptions.find(s => s.companyId === c.id);
                const balance = allBalances.find(b => b.companyId === c.id);
                const matchCount = allMatches.filter(m => m.companyId === c.id).length;

                return {
                    id: c.id,
                    name: c.name,
                    email: c.email,
                    city: c.city,
                    isVerified: c.isVerified,
                    subscriptionStatus: sub?.status || "none",
                    creditBalance: balance?.balance ?? 0,
                    totalLeads: matchCount,
                    createdAt: c.createdAt,
                };
            })
        );

        return NextResponse.json({
            stats: {
                totalCompanies: allCompanies.length,
                activeSubscriptions: activeSubs.length,
                totalLeads: allLeads.length,
                recentLeads30d: recentLeads.length,
                totalLeadsAccepted: totalAccepted,
                totalCreditsInCirculation: totalCreditsInCirculation,
                totalCreditsSpent: totalCreditsSpent,
            },
            leads: recentLeadsList,
            companies: companiesList,
        });
    } catch (error) {
        console.error("[admin] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
