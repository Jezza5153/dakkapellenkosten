/**
 * Lead Submission API — POST /api/leads
 * Public endpoint: homeowners submit their dakkapel quote request.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendLeadConfirmation, sendNewLeadNotification } from "@/lib/email";
import { matchLeadToCompanies } from "@/lib/matching";

const leadSchema = z.object({
    dakkapelType: z.enum(["prefab", "traditioneel", "weet_niet"]),
    breedte: z.enum(["2m", "3m", "4m", "5m_plus", "weet_niet"]),
    materiaal: z.enum(["kunststof", "hout", "polyester", "aluminium", "weet_niet"]).optional(),
    postcode: z.string().regex(/^\d{4}\s?[A-Za-z]{2}$/, "Ongeldig postcode formaat"),
    city: z.string().max(100).optional(),
    naam: z.string().min(2, "Naam is verplicht").max(255),
    email: z.string().email("Ongeldig e-mailadres"),
    telefoon: z.string().min(8, "Ongeldig telefoonnummer").max(30),
    budgetMin: z.number().optional(),
    budgetMax: z.number().optional(),
    timeline: z.enum(["zo_snel_mogelijk", "1_3_maanden", "3_6_maanden", "6_plus_maanden", "weet_niet"]).optional(),
    extraNotes: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = leadSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validatie mislukt", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;

        // --- Fraud Protection ---

        // 1. Rate limit: max 3 leads per email per 24 hours
        const recentLeads = await db.query.leads.findMany({
            where: and(
                eq(schema.leads.email, data.email.toLowerCase()),
                gte(schema.leads.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000))
            ),
        });

        if (recentLeads.length >= 3) {
            return NextResponse.json(
                { error: "Je hebt recent al meerdere aanvragen ingediend. Probeer het later opnieuw." },
                { status: 429 }
            );
        }

        // 2. Duplicate check: same email + postcode + type within 1 hour
        const duplicate = recentLeads.find(
            l => l.postcode.replace(/\s/g, "") === data.postcode.replace(/\s/g, "") &&
                l.dakkapelType === data.dakkapelType &&
                (Date.now() - new Date(l.createdAt).getTime()) < 60 * 60 * 1000
        );

        if (duplicate) {
            return NextResponse.json(
                { error: "Een vergelijkbare aanvraag is recent al ingediend." },
                { status: 409 }
            );
        }

        // --- Create Lead ---
        const publicToken = randomBytes(32).toString("hex");
        const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
        const userAgent = request.headers.get("user-agent") || "";

        const [lead] = await db.insert(schema.leads).values({
            publicToken,
            status: "new",
            naam: data.naam,
            email: data.email.toLowerCase(),
            telefoon: data.telefoon,
            postcode: data.postcode.replace(/\s/g, "").toUpperCase(),
            city: data.city,
            dakkapelType: data.dakkapelType,
            breedte: data.breedte,
            materiaal: data.materiaal || null,
            budgetMinCents: data.budgetMin ? data.budgetMin * 100 : null,
            budgetMaxCents: data.budgetMax ? data.budgetMax * 100 : null,
            timeline: data.timeline || null,
            extraNotes: data.extraNotes || null,
            ipAddress,
            userAgent,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        }).returning();

        // --- Send confirmation to homeowner ---
        await sendLeadConfirmation({
            to: data.email,
            naam: data.naam,
            dakkapelType: data.dakkapelType,
            breedte: data.breedte,
            postcode: data.postcode,
        }).catch(err => console.error("[lead] Failed to send confirmation email:", err));

        // --- Match to companies ---
        try {
            const matches = await matchLeadToCompanies(lead.id);

            if (matches.length > 0) {
                // Update lead status
                await db.update(schema.leads).set({
                    status: "available",
                    matchCount: matches.length,
                    updatedAt: new Date(),
                }).where(eq(schema.leads.id, lead.id));

                // Create lead_matches and notify companies
                const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dakkapellenkosten.nl";

                for (const match of matches) {
                    await db.insert(schema.leadMatches).values({
                        leadId: lead.id,
                        companyId: match.companyId,
                        matchScore: match.matchScore,
                        distanceKm: String(match.distanceKm),
                        status: "notified",
                    });

                    // Notify company via email
                    await sendNewLeadNotification({
                        to: match.companyEmail,
                        companyName: match.companyName,
                        dakkapelType: data.dakkapelType,
                        breedte: data.breedte,
                        postcode: data.postcode.substring(0, 4) + "**", // anonymized
                        distanceKm: match.distanceKm,
                        dashboardUrl: `${appUrl}/dashboard/leads`,
                    }).catch(err => console.error("[lead] Failed to notify company:", err));
                }
            }
        } catch (matchErr) {
            console.error("[lead] Matching failed:", matchErr);
            // Lead is still created, matching can be retried
        }

        return NextResponse.json({
            success: true,
            message: "Je aanvraag is ontvangen! Je ontvangt binnen 48 uur reactie.",
        }, { status: 201 });

    } catch (error) {
        console.error("[lead] Error:", error);
        return NextResponse.json(
            { error: "Er is iets misgegaan. Probeer het opnieuw." },
            { status: 500 }
        );
    }
}
