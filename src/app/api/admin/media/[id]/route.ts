/**
 * Media Detail API — PATCH (update alt text) + DELETE
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return { userId: (session.user as any).id };
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

    const [updated] = await db.update(schema.media)
        .set({ altText: body.altText || null })
        .where(eq(schema.media.id, id))
        .returning();

    if (!updated) {
        return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

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

    const [deleted] = await db.delete(schema.media)
        .where(eq(schema.media.id, id))
        .returning({ id: schema.media.id });

    if (!deleted) {
        return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
