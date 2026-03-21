/**
 * Trash Restore API — POST to restore a trashed item
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/admin/audit";

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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { type, id } = await params;

    let title = "";

    if (type === "article") {
        const [item] = await db.update(schema.articles)
            .set({ deletedAt: null, deletedBy: null })
            .where(eq(schema.articles.id, id))
            .returning({ title: schema.articles.title });
        title = item?.title || "";
    } else if (type === "page") {
        const [item] = await db.update(schema.pages)
            .set({ deletedAt: null, deletedBy: null })
            .where(eq(schema.pages.id, id))
            .returning({ title: schema.pages.title });
        title = item?.title || "";
    } else if (type === "media") {
        const [item] = await db.update(schema.media)
            .set({ deletedAt: null, deletedBy: null })
            .where(eq(schema.media.id, id))
            .returning({ filename: schema.media.filename });
        title = item?.filename || "";
    } else {
        return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
    }

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "restore",
        entityType: type,
        entityId: id,
        entityTitle: title,
    });

    return NextResponse.json({ success: true });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { type, id } = await params;

    if (type === "article") {
        await db.delete(schema.articles).where(eq(schema.articles.id, id));
    } else if (type === "page") {
        await db.delete(schema.pages).where(eq(schema.pages.id, id));
    } else if (type === "media") {
        await db.delete(schema.media).where(eq(schema.media.id, id));
    } else {
        return NextResponse.json({ error: "Ongeldig type" }, { status: 400 });
    }

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "delete",
        entityType: type,
        entityId: id,
        entityTitle: `Permanent verwijderd (${type})`,
    });

    return NextResponse.json({ success: true });
}
