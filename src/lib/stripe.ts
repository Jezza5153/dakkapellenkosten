/**
 * Stripe Integration — DakkapellenKosten.nl
 */

import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("STRIPE_SECRET_KEY is not set");
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
    get: (_, prop) => {
        const instance = getStripe();
        return (instance as any)[prop];
    },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dakkapellenkosten.nl";

/**
 * Credit package tiers (staffelkorting)
 */
export const CREDIT_PACKAGES = [
    { id: "starter", credits: 25, priceCents: 2500, label: "Starter", pricePerCredit: "€1.00" },
    { id: "growth", credits: 120, priceCents: 10000, label: "Growth", pricePerCredit: "€0.83" },
    { id: "pro", credits: 350, priceCents: 25000, label: "Pro", pricePerCredit: "€0.71" },
    { id: "elite", credits: 800, priceCents: 50000, label: "Elite", pricePerCredit: "€0.63" },
] as const;

export type CreditPackageId = typeof CREDIT_PACKAGES[number]["id"];

export const LEAD_CREDIT_COST = Number(process.env.LEAD_CREDIT_COST) || 25;
export const MAX_COMPANIES_PER_LEAD = Number(process.env.MAX_COMPANIES_PER_LEAD) || 3;

/**
 * Create a Stripe Checkout session for subscription (~€27/mo yearly)
 */
export async function createSubscriptionCheckout({
    companyId,
    priceId,
    customerEmail,
    stripeCustomerId,
}: {
    companyId: string;
    priceId: string;
    customerEmail?: string;
    stripeCustomerId?: string;
}) {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${APP_URL}/dashboard?billing=success`,
        cancel_url: `${APP_URL}/dashboard?billing=cancelled`,
        metadata: { companyId },
        subscription_data: {
            metadata: { companyId },
        },
    };

    if (stripeCustomerId) {
        sessionParams.customer = stripeCustomerId;
    } else if (customerEmail) {
        sessionParams.customer_email = customerEmail;
    }

    return getStripe().checkout.sessions.create(sessionParams);
}

/**
 * Create a Stripe Checkout session for a one-time credit purchase
 */
export async function createCreditCheckout({
    companyId,
    packageId,
    customerEmail,
    stripeCustomerId,
}: {
    companyId: string;
    packageId: CreditPackageId;
    customerEmail?: string;
    stripeCustomerId?: string;
}) {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) throw new Error(`Invalid package: ${packageId}`);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: "payment",
        line_items: [{
            price_data: {
                currency: "eur",
                unit_amount: pkg.priceCents,
                product_data: {
                    name: `${pkg.credits} Credits — ${pkg.label}`,
                    description: `${pkg.credits} leadcredits voor DakkapellenKosten.nl`,
                },
            },
            quantity: 1,
        }],
        success_url: `${APP_URL}/dashboard/credits?purchase=success`,
        cancel_url: `${APP_URL}/dashboard/credits?purchase=cancelled`,
        metadata: {
            companyId,
            packageId,
            credits: String(pkg.credits),
            type: "credit_purchase",
        },
    };

    if (stripeCustomerId) {
        sessionParams.customer = stripeCustomerId;
    } else if (customerEmail) {
        sessionParams.customer_email = customerEmail;
    }

    return getStripe().checkout.sessions.create(sessionParams);
}

/**
 * Create a Customer Portal session for managing billing
 */
export async function createPortalSession(stripeCustomerId: string) {
    return getStripe().billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${APP_URL}/dashboard`,
    });
}
