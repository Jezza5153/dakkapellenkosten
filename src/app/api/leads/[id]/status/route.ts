/**
 * Lead Status Update — PATCH /api/leads/[id]/status
 * Company marks a lead as contacted / won / lost
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const statusSchema = z.object({
    status: z.enum(["contacted", "won", "lost"]),
    declineReason: z.string().max(500).optional(),
});

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const { id: leadId } = await params;
        const body = await request.json();
        const parsed = statusSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Ongeldige status" }, { status: 400 });
        }

        // Get user's company
        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
        });

        if (!membership) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 403 });
        }

        // Find the lead match
        const leadMatch = await db.query.leadMatches.findFirst({
            where: and(
                eq(schema.leadMatches.leadId, leadId),
                eq(schema.leadMatches.companyId, membership.companyId),
            ),
        });

        if (!leadMatch) {
            return NextResponse.json({ error: "Lead niet gevonden" }, { status: 404 });
        }

        // Only accepted leads can be updated to contacted/won/lost
        if (!["accepted", "contacted"].includes(leadMatch.status)) {
            return NextResponse.json({ error: "Lead is nog niet geaccepteerd" }, { status: 409 });
        }

        const updates: Record<string, any> = {
            status: parsed.data.status,
        };

        switch (parsed.data.status) {
            case "contacted":
                updates.contactedAt = new Date();
                break;
            case "won":
                updates.wonAt = new Date();
                break;
            case "lost":
                updates.lostAt = new Date();
                if (parsed.data.declineReason) {
                    updates.declineReason = parsed.data.declineReason;
                }
                break;
        }

        // Update company avg response time if contacted
        if (parsed.data.status === "contacted" && leadMatch.acceptedAt) {
            const responseHrs = (Date.now() - new Date(leadMatch.acceptedAt).getTime()) / (1000 * 60 * 60);
            const company = await db.query.companies.findFirst({
                where: eq(schema.companies.id, membership.companyId),
            });
            if (company) {
                const currentAvg = company.avgResponseHrs || 0;
                const newAvg = currentAvg > 0 ? Math.round((currentAvg + responseHrs) / 2) : Math.round(responseHrs);
                await db.update(schema.companies).set({
                    avgResponseHrs: newAvg,
                    updatedAt: new Date(),
                }).where(eq(schema.companies.id, membership.companyId));
            }
        }

        await db.update(schema.leadMatches).set(updates).where(eq(schema.leadMatches.id, leadMatch.id));

        return NextResponse.json({ success: true, status: parsed.data.status });
    } catch (error) {
        console.error("[lead-status] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
