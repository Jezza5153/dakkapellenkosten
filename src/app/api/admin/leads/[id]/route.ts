/**
 * Lead Detail API — GET / PATCH (update status)
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logAudit } from "@/lib/admin/audit";

const updateLeadSchema = z.object({
    status: z.enum(["new", "matching", "available", "fulfilled", "expired", "cancelled"]).optional(),
    assignedTo: z.string().nullable().optional(),
    followUpAt: z.string().nullable().optional(),
});

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin") return null;
    return {
        userId: (session.user as any).id || session.user.id,
        userName: (session.user as any).name || session.user.email || "Onbekend",
    };
}

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
    const parsed = updateLeadSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
    }

    // Get current for diff
    const current = await db.query.leads.findFirst({
        where: eq(schema.leads.id, id),
    });

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.status) updates.status = parsed.data.status;
    if (parsed.data.assignedTo !== undefined) updates.assignedTo = parsed.data.assignedTo;
    if (parsed.data.followUpAt !== undefined) {
        updates.followUpAt = parsed.data.followUpAt ? new Date(parsed.data.followUpAt) : null;
    }

    await db.update(schema.leads)
        .set(updates)
        .where(eq(schema.leads.id, id));

    // Audit log
    const changes: Record<string, any> = {};
    if (parsed.data.status && current?.status !== parsed.data.status) {
        changes.status = { old: current?.status, new: parsed.data.status };
    }
    if (parsed.data.assignedTo !== undefined) {
        changes.assignedTo = { old: null, new: parsed.data.assignedTo };
    }

    if (Object.keys(changes).length > 0) {
        await logAudit({
            actorId: authResult.userId,
            actorName: authResult.userName,
            action: "update",
            entityType: "lead",
            entityId: id,
            entityTitle: current?.naam || "",
            diff: changes,
        });
    }

    return NextResponse.json({ success: true });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    const lead = await db.query.leads.findFirst({
        where: eq(schema.leads.id, id),
    });

    if (!lead) {
        return NextResponse.json({ error: "Lead niet gevonden" }, { status: 404 });
    }

    const matches = await db.query.leadMatches.findMany({
        where: eq(schema.leadMatches.leadId, id),
        with: { company: { columns: { name: true, city: true } } },
    });

    return NextResponse.json({ lead, matches });
}
