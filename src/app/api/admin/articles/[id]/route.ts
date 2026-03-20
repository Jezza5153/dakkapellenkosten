/**
 * Article Detail API — GET / PUT / DELETE
 * Admin-only endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, ne } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";

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

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) {
        return { error: "Niet ingelogd", status: 401 };
    }
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") {
        return { error: "Geen toegang", status: 403 };
    }
    return { session, userId: (session.user as any).id || session.user.id };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
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

    // Check slug uniqueness if changing slug
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

    const updateData: any = { updatedAt: new Date() };
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
        if (data.status === "published" && !data.publishedAt) {
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

    return NextResponse.json({ article });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { id } = await params;

    const [deleted] = await db.delete(schema.articles)
        .where(eq(schema.articles.id, id))
        .returning({ id: schema.articles.id });

    if (!deleted) {
        return NextResponse.json({ error: "Artikel niet gevonden" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
}
