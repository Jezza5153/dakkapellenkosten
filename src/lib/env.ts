/**
 * Environment Validation — DakkapellenKosten.nl
 * Validates required environment variables on startup.
 * Import this at the top of src/app/layout.tsx to fail fast.
 */

const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
] as const;

const recommended = [
    { key: "STRIPE_SECRET_KEY", reason: "Stripe payments will fail" },
    { key: "STRIPE_WEBHOOK_SECRET", reason: "Webhook events will be rejected" },
    { key: "RESEND_API_KEY", reason: "Emails will not be sent" },
    { key: "CRON_SECRET", reason: "Cron endpoints will reject all requests" },
    { key: "NEXT_PUBLIC_APP_URL", reason: "Email links will use fallback domain" },
] as const;

const errors: string[] = [];
const warnings: string[] = [];

for (const key of required) {
    if (!process.env[key]) {
        errors.push(`❌ Missing required env: ${key}`);
    }
}

for (const { key, reason } of recommended) {
    if (!process.env[key]) {
        warnings.push(`⚠️  Missing recommended env: ${key} — ${reason}`);
    }
}

if (warnings.length > 0) {
    console.warn("\n[env] Environment warnings:");
    warnings.forEach(w => console.warn(`  ${w}`));
}

if (errors.length > 0) {
    console.error("\n[env] ❌ Missing required environment variables:");
    errors.forEach(e => console.error(`  ${e}`));

    if (process.env.NODE_ENV === "production") {
        throw new Error(
            `[env] Cannot start in production with missing required env vars:\n${errors.join("\n")}`
        );
    } else {
        console.warn("[env] ⚠️  Running in development mode — continuing despite missing vars\n");
    }
}

export {};
