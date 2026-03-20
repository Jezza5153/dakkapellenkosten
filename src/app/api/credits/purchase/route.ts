/**
 * Credits Purchase — POST /api/credits/purchase
 * Creates a Stripe Checkout session for credit packages
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createCreditCheckout, CREDIT_PACKAGES, type CreditPackageId } from "@/lib/stripe";
import { z } from "zod";

const purchaseSchema = z.object({
    packageId: z.enum(["starter", "growth", "pro", "elite"]),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = purchaseSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Ongeldig pakket" }, { status: 400 });
        }

        // Get user's company
        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
            with: { company: true },
        });

        if (!membership?.company) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 403 });
        }

        // Get Stripe customer ID from subscription
        const subscription = await db.query.subscriptions.findFirst({
            where: eq(schema.subscriptions.companyId, membership.companyId),
        });

        const checkoutSession = await createCreditCheckout({
            companyId: membership.companyId,
            packageId: parsed.data.packageId as CreditPackageId,
            customerEmail: session.user.email || undefined,
            stripeCustomerId: subscription?.stripeCustomerId || undefined,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[credits/purchase] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}

/**
 * GET /api/credits/purchase — Returns available packages
 */
export async function GET() {
    return NextResponse.json({ packages: CREDIT_PACKAGES });
}
