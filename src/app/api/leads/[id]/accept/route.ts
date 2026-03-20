/**
 * Lead Accept API — POST /api/leads/[id]/accept
 * Company accepts a lead: credits deducted, contact details revealed
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq, and, sql } from "drizzle-orm";
import { spendCredits } from "@/lib/credits";
import { LEAD_CREDIT_COST, MAX_COMPANIES_PER_LEAD } from "@/lib/stripe";
import { sendLeadAcceptedDetails } from "@/lib/email";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const { id: leadId } = await params;

        // Get user's company
        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
            with: { company: true },
        });

        if (!membership?.company) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 403 });
        }

        const companyId = membership.companyId;

        // Check subscription is active
        const subscription = await db.query.subscriptions.findFirst({
            where: eq(schema.subscriptions.companyId, companyId),
        });

        if (!subscription || !["active", "trialing"].includes(subscription.status)) {
            return NextResponse.json({ error: "Actief abonnement vereist" }, { status: 403 });
        }

        // Find the lead match for this company
        const leadMatch = await db.query.leadMatches.findFirst({
            where: and(
                eq(schema.leadMatches.leadId, leadId),
                eq(schema.leadMatches.companyId, companyId),
            ),
            with: { lead: true },
        });

        if (!leadMatch) {
            return NextResponse.json({ error: "Lead niet gevonden of niet aan jou toegewezen" }, { status: 404 });
        }

        if (leadMatch.status !== "notified") {
            return NextResponse.json({ error: "Deze lead is al verwerkt" }, { status: 409 });
        }

        // Check max companies per lead
        const lead = leadMatch.lead;
        if ((lead.acceptCount ?? 0) >= MAX_COMPANIES_PER_LEAD) {
            return NextResponse.json({ error: "Maximaal aantal bedrijven bereikt voor deze lead" }, { status: 409 });
        }

        // Deduct credits
        const { success, newBalance } = await spendCredits({
            companyId,
            amount: LEAD_CREDIT_COST,
            description: `Lead geaccepteerd: ${lead.naam} — ${lead.dakkapelType} dakkapel`,
            leadMatchId: leadMatch.id,
        });

        if (!success) {
            return NextResponse.json({
                error: "Onvoldoende credits",
                creditsRequired: LEAD_CREDIT_COST,
                currentBalance: newBalance,
            }, { status: 402 });
        }

        // Update lead match status
        await db.update(schema.leadMatches).set({
            status: "accepted",
            creditsCharged: LEAD_CREDIT_COST,
            acceptedAt: new Date(),
        }).where(eq(schema.leadMatches.id, leadMatch.id));

        // Increment accept count on lead
        await db.update(schema.leads).set({
            acceptCount: sql`${schema.leads.acceptCount} + 1`,
            updatedAt: new Date(),
        }).where(eq(schema.leads.id, leadId));

        // Check if lead is now fulfilled (3 companies accepted)
        const updatedLead = await db.query.leads.findFirst({
            where: eq(schema.leads.id, leadId),
        });

        if (updatedLead && (updatedLead.acceptCount ?? 0) >= MAX_COMPANIES_PER_LEAD) {
            await db.update(schema.leads).set({
                status: "fulfilled",
                updatedAt: new Date(),
            }).where(eq(schema.leads.id, leadId));
        }

        // Send lead details to company
        await sendLeadAcceptedDetails({
            to: membership.company.email || session.user.email || "",
            companyName: membership.company.name,
            customerName: lead.naam,
            customerEmail: lead.email,
            customerPhone: lead.telefoon,
            customerPostcode: lead.postcode,
            dakkapelType: lead.dakkapelType,
            breedte: lead.breedte,
            extraNotes: lead.extraNotes,
        }).catch(err => console.error("[lead-accept] Email failed:", err));

        return NextResponse.json({
            success: true,
            message: "Lead geaccepteerd! Contactgegevens zijn naar je e-mail gestuurd.",
            creditsDeducted: LEAD_CREDIT_COST,
            newBalance,
            customer: {
                naam: lead.naam,
                email: lead.email,
                telefoon: lead.telefoon,
                postcode: lead.postcode,
                dakkapelType: lead.dakkapelType,
                breedte: lead.breedte,
                extraNotes: lead.extraNotes,
            },
        });

    } catch (error) {
        console.error("[lead-accept] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
