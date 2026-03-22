/**
 * Page Detail API — GET / PATCH / PUT / DELETE
 * Supports new fields: featuredImage, canonicalUrl, structuredData, publishedAt
 * Includes audit logging and revision creation
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, ne } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";
import { logAudit, computeDiff } from "@/lib/admin/audit";
import { createRevision } from "@/lib/admin/revisions";

const updatePageSchema = z.object({
    title: z.string().min(1).max(500).optional(),
    slug: z.string().min(1).max(500).optional(),
    content: z.string().optional(),
    featuredImage: z.string().nullable().optional(),
    seoTitle: z.string().max(200).nullable().optional(),
    seoDescription: z.string().nullable().optional(),
    canonicalUrl: z.string().nullable().optional(),
    structuredData: z.any().nullable().optional(),
    city: z.string().nullable().optional(),
    service: z.string().nullable().optional(),
    status: z.enum(["draft", "published", "scheduled"]).optional(),
});


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    const { id } = await params;

    const page = await db.query.pages.findFirst({
        where: and(eq(schema.pages.id, id), eq(schema.pages.deletedAt!, null as any)),
        with: { author: { columns: { name: true } } },
    });

    if (!page) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    return NextResponse.json({ page });
}

async function handleUpdate(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const parsed = updatePageSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
    }

    const data = parsed.data;

    // Check slug uniqueness
    if (data.slug) {
        const existing = await db.query.pages.findFirst({
            where: and(eq(schema.pages.slug, data.slug), ne(schema.pages.id, id)),
        });
        if (existing) return NextResponse.json({ error: "Slug bestaat al" }, { status: 409 });
    }

    // Get current state for diff + revision
    const current = await db.query.pages.findFirst({
        where: eq(schema.pages.id, id),
    });
    if (!current) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

    // Build update
    const updateData: any = {
        updatedAt: new Date(),
        updatedBy: authResult.userId,
    };
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) updateData[key] = value;
    });

    // Set publishedAt on first publish
    if (data.status === "published" && current.status !== "published") {
        updateData.publishedAt = new Date();
    }

    const [page] = await db.update(schema.pages)
        .set(updateData)
        .where(eq(schema.pages.id, id))
        .returning();

    // Create revision on explicit save
    const isAutosave = request.headers.get("x-autosave") === "true";
    if (!isAutosave) {
        await createRevision("page", id, {
            title: page.title,
            content: page.content || "",
            seoTitle: page.seoTitle || "",
            seoDescription: page.seoDescription || "",
            city: page.city || "",
            service: page.service || "",
            status: page.status,
        }, authResult.userId);
    }

    // Audit log
    const diff = computeDiff(
        current as any,
        page as any,
        ["title", "slug", "content", "status", "seoTitle", "seoDescription", "city", "service"]
    );
    if (diff) {
        await logAudit({
            actorId: authResult.userId,
            actorName: authResult.userName,
            action: data.status === "published" && current.status !== "published" ? "publish" : "update",
            entityType: "page",
            entityId: id,
            entityTitle: page.title,
            diff,
        });
    }

    return NextResponse.json({ page });
}

export const PUT = handleUpdate;
export const PATCH = handleUpdate;

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;

    // Soft delete
    const [page] = await db.update(schema.pages)
        .set({
            deletedAt: new Date(),
            deletedBy: authResult.userId,
        })
        .where(eq(schema.pages.id, id))
        .returning({ id: schema.pages.id, title: schema.pages.title });

    if (!page) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "delete",
        entityType: "page",
        entityId: id,
        entityTitle: page.title,
    });

    return NextResponse.json({ success: true });
}
