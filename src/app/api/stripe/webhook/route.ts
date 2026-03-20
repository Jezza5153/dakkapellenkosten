/**
 * Stripe Webhook — POST /api/stripe/webhook
 * Handles subscription lifecycle + credit purchase fulfillment
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, CREDIT_PACKAGES } from "@/lib/stripe";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { addCredits } from "@/lib/credits";
import { sendCreditPurchaseConfirmation } from "@/lib/email";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = getStripe().webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            // --- Credit purchase completed ---
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                if (session.metadata?.type === "credit_purchase") {
                    const companyId = session.metadata.companyId;
                    const packageId = session.metadata.packageId;
                    const credits = Number(session.metadata.credits);

                    if (companyId && credits > 0) {
                        const newBalance = await addCredits({
                            companyId,
                            amount: credits,
                            description: `Credit pakket: ${packageId} (${credits} credits)`,
                            stripePaymentIntentId: session.payment_intent as string,
                        });

                        // Send confirmation email
                        const company = await db.query.companies.findFirst({
                            where: eq(schema.companies.id, companyId),
                        });

                        if (company?.email) {
                            const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
                            await sendCreditPurchaseConfirmation({
                                to: company.email,
                                companyName: company.name,
                                credits,
                                amountEur: pkg ? `€${(pkg.priceCents / 100).toFixed(2)}` : `€${(session.amount_total! / 100).toFixed(2)}`,
                            }).catch(err => console.error("[webhook] Credit confirmation email failed:", err));
                        }
                    }
                }

                // Subscription created
                if (session.mode === "subscription" && session.metadata?.companyId) {
                    const companyId = session.metadata.companyId;
                    const subscriptionId = session.subscription as string;

                    // Upsert subscription
                    const existing = await db.query.subscriptions.findFirst({
                        where: eq(schema.subscriptions.companyId, companyId),
                    });

                    if (existing) {
                        await db.update(schema.subscriptions).set({
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: subscriptionId,
                            status: "active",
                            updatedAt: new Date(),
                        }).where(eq(schema.subscriptions.companyId, companyId));
                    } else {
                        await db.insert(schema.subscriptions).values({
                            companyId,
                            plan: "standard",
                            status: "active",
                            stripeCustomerId: session.customer as string,
                            stripeSubscriptionId: subscriptionId,
                        });
                    }
                }
                break;
            }

            // --- Subscription updated ---
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const companyId = subscription.metadata?.companyId;

                if (companyId) {
                    const statusMap: Record<string, string> = {
                        active: "active",
                        trialing: "trialing",
                        past_due: "past_due",
                        canceled: "canceled",
                        incomplete: "past_due",
                        incomplete_expired: "canceled",
                        unpaid: "past_due",
                        paused: "past_due",
                    };

                    const periodEnd = (subscription as any).current_period_end;
                    await db.update(schema.subscriptions).set({
                        status: (statusMap[subscription.status] || "active") as any,
                        currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
                        updatedAt: new Date(),
                    }).where(eq(schema.subscriptions.companyId, companyId));
                }
                break;
            }

            // --- Subscription deleted ---
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const companyId = subscription.metadata?.companyId;

                if (companyId) {
                    await db.update(schema.subscriptions).set({
                        status: "canceled",
                        updatedAt: new Date(),
                    }).where(eq(schema.subscriptions.companyId, companyId));
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[webhook] Error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
