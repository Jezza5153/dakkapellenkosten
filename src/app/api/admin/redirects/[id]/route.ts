/**
 * Redirect Detail API — DELETE a redirect
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";


export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;

    const [deleted] = await db.delete(schema.redirects)
        .where(eq(schema.redirects.id, id))
        .returning({ fromPath: schema.redirects.fromPath, toPath: schema.redirects.toPath });

    if (!deleted) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "delete",
        entityType: "redirect",
        entityTitle: `${deleted.fromPath} → ${deleted.toPath}`,
    });

    return NextResponse.json({ success: true });
}
