/**
 * Subscription Checkout — POST /api/stripe/checkout
 * Creates a Stripe Checkout session for the yearly subscription
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createSubscriptionCheckout } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
    priceId: z.string().min(1, "Price ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const body = await request.json();
        const parsed = checkoutSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // Get user's company
        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
            with: { company: true },
        });

        if (!membership?.company) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 403 });
        }

        // Check existing subscription
        const existingSub = await db.query.subscriptions.findFirst({
            where: eq(schema.subscriptions.companyId, membership.companyId),
        });

        if (existingSub && ["active", "trialing"].includes(existingSub.status)) {
            return NextResponse.json({ error: "Je hebt al een actief abonnement" }, { status: 409 });
        }

        const checkoutSession = await createSubscriptionCheckout({
            companyId: membership.companyId,
            priceId: parsed.data.priceId,
            customerEmail: session.user.email || undefined,
            stripeCustomerId: existingSub?.stripeCustomerId || undefined,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[stripe/checkout] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
