/**
 * Articles Bulk Actions — POST
 * Supports: publish, draft, delete (soft)
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logAudit } from "@/lib/admin/audit";

const bulkSchema = z.object({
    ids: z.array(z.string()).min(1),
    action: z.enum(["publish", "draft", "delete"]),
});

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const userId = (session.user as any).id || session.user.id;
    const userName = (session.user as any).name || session.user.email || "Onbekend";

    const body = await request.json();
    const parsed = bulkSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
    }

    const { ids, action } = parsed.data;

    switch (action) {
        case "publish":
            await db.update(schema.articles)
                .set({ status: "published", publishedAt: new Date(), updatedAt: new Date(), updatedBy: userId })
                .where(inArray(schema.articles.id, ids));
            break;
        case "draft":
            await db.update(schema.articles)
                .set({ status: "draft", updatedAt: new Date(), updatedBy: userId })
                .where(inArray(schema.articles.id, ids));
            break;
        case "delete":
            // Soft delete instead of hard delete
            await db.update(schema.articles)
                .set({ deletedAt: new Date(), deletedBy: userId })
                .where(inArray(schema.articles.id, ids));
            break;
    }

    // Log audit for bulk action
    await logAudit({
        actorId: userId,
        actorName: userName,
        action: action === "delete" ? "delete" : action === "publish" ? "publish" : "update",
        entityType: "article",
        entityTitle: `Bulk ${action} (${ids.length} artikelen)`,
        diff: { action: { old: null, new: action }, count: { old: null, new: ids.length } },
    });

    return NextResponse.json({ success: true, affected: ids.length });
}
