/**
 * Media Detail API — PATCH (update alt text) + DELETE (soft delete)
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";


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

    const [updated] = await db.update(schema.media)
        .set({ altText: body.altText || null })
        .where(eq(schema.media.id, id))
        .returning();

    if (!updated) {
        return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "update",
        entityType: "media",
        entityId: id,
        entityTitle: updated.filename,
    });

    return NextResponse.json({ media: updated });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    // Soft delete
    const [deleted] = await db.update(schema.media)
        .set({ deletedAt: new Date(), deletedBy: authResult.userId })
        .where(eq(schema.media.id, id))
        .returning({ id: schema.media.id, filename: schema.media.filename });

    if (!deleted) {
        return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "delete",
        entityType: "media",
        entityId: id,
        entityTitle: deleted.filename,
    });

    return NextResponse.json({ success: true });
}
