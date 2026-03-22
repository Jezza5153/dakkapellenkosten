/**
 * Admin Credit Adjustment — POST /api/admin/credits
 * Refund or adjust credits for a company
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/admin/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { addCredits } from "@/lib/credits";
import { z } from "zod";
import { logAudit } from "@/lib/admin/audit";

const adjustSchema = z.object({
    companyId: z.string().uuid(),
    amount: z.number().int(),
    type: z.enum(["refund", "adjustment"]),
    description: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
    try {
        let admin;
        try {
            admin = await requireRole(["admin"]);
        } catch {
            return NextResponse.json({ error: "Toegang geweigerd" }, { status: 403 });
        }

        const body = await request.json();
        const parsed = adjustSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
        }

        const { companyId, amount, type, description } = parsed.data;

        // Get company name for audit
        const company = await db.query.companies.findFirst({
            where: eq(schema.companies.id, companyId),
            columns: { name: true },
        });

        const newBalance = await addCredits({
            companyId,
            amount: Math.abs(amount),
            description: `[Admin] ${description}`,
            adminUserId: admin.userId,
            type,
        });

        // Audit log
        await logAudit({
            actorId: admin.userId,
            actorName: admin.userName,
            action: type === "refund" ? "refund" : "adjustment",
            entityType: "credits",
            entityId: companyId,
            entityTitle: company?.name || companyId,
            diff: {
                amount: { old: null, new: amount },
                type: { old: null, new: type },
                description: { old: null, new: description },
                newBalance: { old: null, new: newBalance },
            },
        });

        return NextResponse.json({ success: true, newBalance });
    } catch (error) {
        console.error("[admin/credits] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
