/**
 * Pages API — GET (list) + POST (create)
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, ilike, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";

const createPageSchema = z.object({
    title: z.string().min(1).max(500),
    slug: z.string().min(1).max(500),
    content: z.string().optional(),
    seoTitle: z.string().max(200).optional(),
    seoDescription: z.string().optional(),
    city: z.string().optional(),
    service: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
});

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return { userId: (session.user as any).id || session.user.id };
}

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where = search ? ilike(schema.pages.title, `%${search}%`) : undefined;

    const [pages, countResult] = await Promise.all([
        db.query.pages.findMany({
            where,
            orderBy: [desc(schema.pages.updatedAt)],
            with: { author: { columns: { name: true } } },
        }),
        db.select({ count: sql<number>`count(*)` })
            .from(schema.pages)
            .where(where),
    ]);

    return NextResponse.json({
        pages,
        total: Number(countResult[0]?.count || 0),
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
        city: data.city || null,
        service: data.service || null,
        status: data.status,
        authorId: authResult.userId,
    }).returning();

    return NextResponse.json({ page }, { status: 201 });
}
