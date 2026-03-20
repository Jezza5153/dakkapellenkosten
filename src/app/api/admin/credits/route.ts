/**
 * Admin Credit Adjustment — POST /api/admin/credits
 * Refund or adjust credits for a company
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { addCredits, refundCredits } from "@/lib/credits";
import { z } from "zod";

const adjustSchema = z.object({
    companyId: z.string().uuid(),
    amount: z.number().int(),
    type: z.enum(["refund", "adjustment"]),
    description: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(schema.users.id, session.user.id),
        });

        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Toegang geweigerd" }, { status: 403 });
        }

        const body = await request.json();
        const parsed = adjustSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
        }

        const { companyId, amount, type, description } = parsed.data;

        const newBalance = await addCredits({
            companyId,
            amount: Math.abs(amount),
            description: `[Admin] ${description}`,
            adminUserId: session.user.id,
            type,
        });

        return NextResponse.json({ success: true, newBalance });
    } catch (error) {
        console.error("[admin/credits] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
