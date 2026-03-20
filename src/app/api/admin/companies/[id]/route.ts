/**
 * Admin Company Management — POST /api/admin/companies/[id]
 * Verify, unverify, or soft-delete a company
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const actionSchema = z.object({
    action: z.enum(["verify", "unverify", "delete", "restore"]),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const body = await request.json();
        const parsed = actionSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Ongeldige actie" }, { status: 400 });
        }

        const updates: Record<string, any> = { updatedAt: new Date() };

        switch (parsed.data.action) {
            case "verify":
                updates.isVerified = true;
                break;
            case "unverify":
                updates.isVerified = false;
                break;
            case "delete":
                updates.deletedAt = new Date();
                break;
            case "restore":
                updates.deletedAt = null;
                break;
        }

        await db.update(schema.companies).set(updates).where(eq(schema.companies.id, id));

        return NextResponse.json({ success: true, action: parsed.data.action });
    } catch (error) {
        console.error("[admin/companies] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
