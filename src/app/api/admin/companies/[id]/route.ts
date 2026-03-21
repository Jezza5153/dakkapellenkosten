/**
 * Admin Company API — GET (detail) / PATCH (update) / POST (legacy actions)
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { logAudit } from "@/lib/admin/audit";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user?.id) return null;
    const user = await db.query.users.findFirst({
        where: eq(schema.users.id, session.user.id),
    });
    if (!user || user.role !== "admin") return null;
    return { userId: user.id, userName: user.name || user.email || "Onbekend" };
}

// GET — Full company detail with matches
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    const company = await db.query.companies.findFirst({
        where: eq(schema.companies.id, id),
    });

    if (!company) {
        return NextResponse.json({ error: "Bedrijf niet gevonden" }, { status: 404 });
    }

    const matches = await db.query.leadMatches.findMany({
        where: eq(schema.leadMatches.companyId, id),
        with: {
            lead: {
                columns: { naam: true, postcode: true, city: true, dakkapelType: true, status: true, createdAt: true },
            },
        },
    });

    return NextResponse.json({ company, matches });
}

// PATCH — Update company fields
const patchSchema = z.object({
    isVerified: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    description: z.string().optional(),
    serviceRadiusKm: z.number().optional(),
}).passthrough();

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
    }

    // Get current for diff
    const current = await db.query.companies.findFirst({
        where: eq(schema.companies.id, id),
    });

    const updates: Record<string, unknown> = { updatedAt: new Date(), ...parsed.data };
    await db.update(schema.companies).set(updates).where(eq(schema.companies.id, id));

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "update",
        entityType: "company",
        entityId: id,
        entityTitle: current?.name || "",
        diff: parsed.data as any,
    });

    return NextResponse.json({ success: true });
}

// POST — Legacy action-based mutations
const actionSchema = z.object({
    action: z.enum(["verify", "unverify", "delete", "restore"]),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = actionSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Ongeldige actie" }, { status: 400 });
    }

    const current = await db.query.companies.findFirst({
        where: eq(schema.companies.id, id),
    });

    const updates: Record<string, unknown> = { updatedAt: new Date() };

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

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: parsed.data.action === "delete" ? "delete" : parsed.data.action === "restore" ? "restore" : "update",
        entityType: "company",
        entityId: id,
        entityTitle: current?.name || "",
        diff: { action: { old: null, new: parsed.data.action } },
    });

    return NextResponse.json({ success: true, action: parsed.data.action });
}
