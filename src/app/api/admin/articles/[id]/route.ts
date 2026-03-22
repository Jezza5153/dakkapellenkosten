/**
 * Article Detail API — GET / PUT / PATCH / DELETE
 * With audit logging, revision creation, and soft delete
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, ne } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";
import { logAudit, computeDiff } from "@/lib/admin/audit";
import { createRevision } from "@/lib/admin/revisions";

const updateArticleSchema = z.object({
    title: z.string().min(1).max(500).optional(),
    slug: z.string().min(1).max(500).optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    featuredImage: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    seoTitle: z.string().max(200).nullable().optional(),
    seoDescription: z.string().nullable().optional(),
    canonicalUrl: z.string().nullable().optional(),
    status: z.enum(["draft", "published", "scheduled"]).optional(),
    publishedAt: z.string().nullable().optional(),
    scheduledAt: z.string().nullable().optional(),
});


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    const article = await db.query.articles.findFirst({
        where: eq(schema.articles.id, id),
        with: { author: { columns: { name: true, email: true } } },
    });

    if (!article) {
        return NextResponse.json({ error: "Artikel niet gevonden" }, { status: 404 });
    }

    return NextResponse.json({ article });
}

async function handleUpdate(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateArticleSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validatie mislukt", details: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const data = parsed.data;

    // Check slug uniqueness
    if (data.slug) {
        const existing = await db.query.articles.findFirst({
            where: and(
                eq(schema.articles.slug, data.slug),
                ne(schema.articles.id, id)
            ),
        });
        if (existing) {
            return NextResponse.json({ error: "Slug bestaat al" }, { status: 409 });
        }
    }

    // Get current state for diff + revision
    const current = await db.query.articles.findFirst({
        where: eq(schema.articles.id, id),
    });
    if (!current) {
        return NextResponse.json({ error: "Artikel niet gevonden" }, { status: 404 });
    }

    const updateData: any = {
        updatedAt: new Date(),
        updatedBy: authResult.userId,
    };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt || null;
    if (data.content !== undefined) updateData.content = data.content || null;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;
    if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl;

    if (data.status !== undefined) {
        updateData.status = data.status;
        if (data.status === "published" && current.status !== "published" && !data.publishedAt) {
            updateData.publishedAt = new Date();
        }
    }
    if (data.publishedAt !== undefined) {
        updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    }
    if (data.scheduledAt !== undefined) {
        updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    }

    const [article] = await db.update(schema.articles)
        .set(updateData)
        .where(eq(schema.articles.id, id))
        .returning();

    if (!article) {
        return NextResponse.json({ error: "Artikel niet gevonden" }, { status: 404 });
    }

    // Create revision on explicit save (not autosave)
    const isAutosave = request.headers.get("x-autosave") === "true";
    if (!isAutosave) {
        await createRevision("article", id, {
            title: article.title,
            content: article.content || "",
            excerpt: article.excerpt || "",
            seoTitle: article.seoTitle || "",
            seoDescription: article.seoDescription || "",
            category: article.category || "",
            status: article.status,
        }, authResult.userId);
    }

    // Audit log
    const diff = computeDiff(
        current as any,
        article as any,
        ["title", "slug", "content", "status", "seoTitle", "seoDescription", "category", "excerpt"]
    );
    if (diff) {
        await logAudit({
            actorId: authResult.userId,
            actorName: authResult.userName,
            action: data.status === "published" && current.status !== "published" ? "publish" : "update",
            entityType: "article",
            entityId: id,
            entityTitle: article.title,
            diff,
        });
    }

    return NextResponse.json({ article });
}

export const PUT = handleUpdate;
export const PATCH = handleUpdate;

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    // Soft delete instead of hard delete
    const [article] = await db.update(schema.articles)
        .set({
            deletedAt: new Date(),
            deletedBy: authResult.userId,
        })
        .where(eq(schema.articles.id, id))
        .returning({ id: schema.articles.id, title: schema.articles.title });

    if (!article) {
        return NextResponse.json({ error: "Artikel niet gevonden" }, { status: 404 });
    }

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "delete",
        entityType: "article",
        entityId: id,
        entityTitle: article.title,
    });

    return NextResponse.json({ success: true });
}
