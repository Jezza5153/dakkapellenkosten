/**
 * Credits Service — DakkapellenKosten.nl
 * Manages credit balances and transactions
 */

import { db, schema } from "@/db";
import { eq, sql } from "drizzle-orm";

/**
 * Get or create credit balance for a company
 */
export async function getCreditBalance(companyId: string): Promise<number> {
    const existing = await db.query.creditBalances.findFirst({
        where: eq(schema.creditBalances.companyId, companyId),
    });
    if (existing) return existing.balance;

    // Create initial balance
    await db.insert(schema.creditBalances).values({
        companyId,
        balance: 0,
        totalPurchased: 0,
        totalSpent: 0,
    });
    return 0;
}

/**
 * Add credits (after purchase or admin adjustment)
 */
export async function addCredits({
    companyId,
    amount,
    description,
    stripePaymentIntentId,
    adminUserId,
    type = "purchase",
}: {
    companyId: string;
    amount: number;
    description: string;
    stripePaymentIntentId?: string;
    adminUserId?: string;
    type?: "purchase" | "refund" | "adjustment";
}) {
    // Ensure balance row exists
    await getCreditBalance(companyId);

    // Update balance atomically
    const [updated] = await db
        .update(schema.creditBalances)
        .set({
            balance: sql`${schema.creditBalances.balance} + ${amount}`,
            totalPurchased: sql`${schema.creditBalances.totalPurchased} + ${amount}`,
            updatedAt: new Date(),
        })
        .where(eq(schema.creditBalances.companyId, companyId))
        .returning();

    // Record transaction
    await db.insert(schema.creditTransactions).values({
        companyId,
        type,
        amount,
        balanceAfter: updated.balance,
        description,
        stripePaymentIntentId,
        adminUserId,
    });

    return updated.balance;
}

/**
 * Spend credits on a lead. Returns true if successful, false if insufficient.
 */
export async function spendCredits({
    companyId,
    amount,
    description,
    leadMatchId,
}: {
    companyId: string;
    amount: number;
    description: string;
    leadMatchId: string;
}): Promise<{ success: boolean; newBalance: number }> {
    const currentBalance = await getCreditBalance(companyId);

    if (currentBalance < amount) {
        return { success: false, newBalance: currentBalance };
    }

    // Deduct atomically with a check
    const result = await db
        .update(schema.creditBalances)
        .set({
            balance: sql`${schema.creditBalances.balance} - ${amount}`,
            totalSpent: sql`${schema.creditBalances.totalSpent} + ${amount}`,
            updatedAt: new Date(),
        })
        .where(
            sql`${schema.creditBalances.companyId} = ${companyId} AND ${schema.creditBalances.balance} >= ${amount}`
        )
        .returning();

    if (result.length === 0) {
        return { success: false, newBalance: currentBalance };
    }

    // Record transaction
    await db.insert(schema.creditTransactions).values({
        companyId,
        type: "spend",
        amount: -amount,
        balanceAfter: result[0].balance,
        description,
        leadMatchId,
    });

    return { success: true, newBalance: result[0].balance };
}

/**
 * Admin: refund credits for a lead
 */
export async function refundCredits({
    companyId,
    amount,
    description,
    leadMatchId,
    adminUserId,
}: {
    companyId: string;
    amount: number;
    description: string;
    leadMatchId?: string;
    adminUserId: string;
}) {
    return addCredits({
        companyId,
        amount,
        description,
        adminUserId,
        type: "refund",
    });
}
