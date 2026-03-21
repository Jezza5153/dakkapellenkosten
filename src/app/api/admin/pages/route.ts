/**
 * Pages API — GET (list) + POST (create)
 * With pagination, sorting, filters, soft-delete filter, audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, asc, ilike, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logAudit } from "@/lib/admin/audit";

const createPageSchema = z.object({
    title: z.string().min(1).max(500),
    slug: z.string().min(1).max(500),
    content: z.string().optional(),
    seoTitle: z.string().max(200).optional(),
    seoDescription: z.string().optional(),
    canonicalUrl: z.string().optional(),
    structuredData: z.any().optional(),
    featuredImage: z.string().optional(),
    city: z.string().optional(),
    service: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
});

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return {
        userId: (session.user as any).id || session.user.id,
        userName: (session.user as any).name || session.user.email || "Onbekend",
    };
}

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortDir = searchParams.get("sortDir") || "desc";
    const pageNum = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (pageNum - 1) * limit;

    // Always exclude soft-deleted
    const conditions = [];
    conditions.push(sql`${schema.pages.deletedAt} IS NULL`);
    if (search) {
        conditions.push(ilike(schema.pages.title, `%${search}%`));
    }
    if (status && status !== "all") {
        conditions.push(eq(schema.pages.status, status as any));
    }

    const where = and(...conditions);

    // Dynamic sort
    const sortColumn = {
        title: schema.pages.title,
        status: schema.pages.status,
        city: schema.pages.city,
        updatedAt: schema.pages.updatedAt,
    }[sortBy] || schema.pages.updatedAt;
    const orderFn = sortDir === "asc" ? asc : desc;

    const [pages, countResult] = await Promise.all([
        db.query.pages.findMany({
            where,
            orderBy: [orderFn(sortColumn)],
            limit,
            offset,
        }),
        db.select({ count: sql<number>`count(*)` })
            .from(schema.pages)
            .where(where),
    ]);

    return NextResponse.json({
        pages,
        total: Number(countResult[0]?.count || 0),
        page: pageNum,
        perPage: limit,
    });
}

export async function POST(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Validatie mislukt", details: parsed.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const data = parsed.data;

    // Check slug uniqueness (including soft-deleted to avoid conflicts)
    const existing = await db.query.pages.findFirst({
        where: eq(schema.pages.slug, data.slug),
    });
    if (existing) {
        return NextResponse.json({ error: "Slug bestaat al" }, { status: 409 });
    }

    const [page] = await db.insert(schema.pages).values({
        title: data.title,
        slug: data.slug,
        content: data.content || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        structuredData: data.structuredData || null,
        featuredImage: data.featuredImage || null,
        city: data.city || null,
        service: data.service || null,
        status: data.status,
        authorId: authResult.userId,
        publishedAt: data.status === "published" ? new Date() : null,
    }).returning();

    // Audit log
    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "create",
        entityType: "page",
        entityId: page.id,
        entityTitle: data.title,
    });

    return NextResponse.json({ page }, { status: 201 });
}
