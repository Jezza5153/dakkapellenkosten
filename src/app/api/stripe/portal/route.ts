/**
 * Stripe Portal — POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for managing billing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { createPortalSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
        });

        if (!membership) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 403 });
        }

        const subscription = await db.query.subscriptions.findFirst({
            where: eq(schema.subscriptions.companyId, membership.companyId),
        });

        if (!subscription?.stripeCustomerId) {
            return NextResponse.json({ error: "Geen actief abonnement gevonden" }, { status: 404 });
        }

        const portalSession = await createPortalSession(subscription.stripeCustomerId);
        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error("[stripe/portal] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
