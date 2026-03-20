/**
 * Articles API — GET (list) + POST (create)
 * Admin-only endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, ilike, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createArticleSchema = z.object({
    title: z.string().min(1).max(500),
    slug: z.string().min(1).max(500),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    featuredImage: z.string().optional(),
    category: z.string().optional(),
    seoTitle: z.string().max(200).optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
    status: z.enum(["draft", "published", "scheduled"]).default("draft"),
    publishedAt: z.string().optional(),
    scheduledAt: z.string().optional(),
});

async function requireAdmin(request?: NextRequest) {
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

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status && status !== "all") {
        conditions.push(eq(schema.articles.status, status as any));
    }
    if (search) {
        conditions.push(ilike(schema.articles.title, `%${search}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [articles, countResult] = await Promise.all([
        db.query.articles.findMany({
            where,
            orderBy: [desc(schema.articles.updatedAt)],
            limit,
            offset,
            with: { author: { columns: { name: true } } },
        }),
        db.select({ count: sql<number>`count(*)` })
            .from(schema.articles)
            .where(where),
    ]);

    return NextResponse.json({
        articles,
        total: Number(countResult[0]?.count || 0),
        page,
        limit,
    });
}

export async function POST(request: NextRequest) {
    const authResult = await requireAdmin();
    if ("error" in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const parsed = createArticleSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validatie mislukt", details: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await db.query.articles.findFirst({
        where: eq(schema.articles.slug, data.slug),
    });
    if (existing) {
        return NextResponse.json({ error: "Slug bestaat al" }, { status: 409 });
    }

    const [article] = await db.insert(schema.articles).values({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content || null,
        featuredImage: data.featuredImage || null,
        category: data.category || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        status: data.status,
        authorId: authResult.userId,
        publishedAt: data.status === "published" ? new Date() : (data.publishedAt ? new Date(data.publishedAt) : null),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
    }).returning();

    return NextResponse.json({ article }, { status: 201 });
}
