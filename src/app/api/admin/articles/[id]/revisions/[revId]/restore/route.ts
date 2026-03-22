/**
 * Revision Restore API — POST to restore a specific revision
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { getRevision, createRevision } from "@/lib/admin/revisions";
import { logAudit } from "@/lib/admin/audit";


export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; revId: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id, revId } = await params;

    const revision = await getRevision(revId);
    if (!revision || revision.entityId !== id) {
        return NextResponse.json({ error: "Revisie niet gevonden" }, { status: 404 });
    }

    // Restore the content from the revision
    const updateData: any = {
        updatedAt: new Date(),
        updatedBy: authResult.userId,
    };
    if (revision.title) updateData.title = revision.title;
    if (revision.content !== null) updateData.content = revision.content;
    if (revision.excerpt !== null) updateData.excerpt = revision.excerpt;
    if (revision.seoTitle !== null) updateData.seoTitle = revision.seoTitle;
    if (revision.seoDescription !== null) updateData.seoDescription = revision.seoDescription;

    // Apply metadata fields if present
    if (revision.metadata && typeof revision.metadata === "object") {
        const meta = revision.metadata as Record<string, unknown>;
        if (meta.category !== undefined) updateData.category = meta.category;
        if (meta.status !== undefined) updateData.status = meta.status;
    }

    const entityType = revision.entityType as "article" | "page";

    if (entityType === "article") {
        await db.update(schema.articles)
            .set(updateData)
            .where(eq(schema.articles.id, id));
    } else {
        await db.update(schema.pages)
            .set(updateData)
            .where(eq(schema.pages.id, id));
    }

    // Create a new revision to mark the restore point
    await createRevision(entityType, id, {
        title: revision.title || "",
        content: revision.content || "",
        excerpt: revision.excerpt || "",
        seoTitle: revision.seoTitle || "",
        seoDescription: revision.seoDescription || "",
    }, authResult.userId);

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "restore",
        entityType,
        entityId: id,
        entityTitle: revision.title || "",
        diff: { revision: { old: null, new: revision.revisionNumber } },
    });

    return NextResponse.json({ success: true, restoredRevision: revision.revisionNumber });
}
