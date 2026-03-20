/**
 * Page Detail API — GET / PUT / DELETE
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, ne } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updatePageSchema = z.object({
    title: z.string().min(1).max(500).optional(),
    slug: z.string().min(1).max(500).optional(),
    content: z.string().optional(),
    seoTitle: z.string().max(200).nullable().optional(),
    seoDescription: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    service: z.string().nullable().optional(),
    status: z.enum(["draft", "published"]).optional(),
});

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return { userId: (session.user as any).id };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    const { id } = await params;

    const page = await db.query.pages.findFirst({
        where: eq(schema.pages.id, id),
        with: { author: { columns: { name: true } } },
    });

    if (!page) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    return NextResponse.json({ page });
}

export async function PUT(
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

    if (data.slug) {
        const existing = await db.query.pages.findFirst({
            where: and(eq(schema.pages.slug, data.slug), ne(schema.pages.id, id)),
        });
        if (existing) return NextResponse.json({ error: "Slug bestaat al" }, { status: 409 });
    }

    const updateData: any = { updatedAt: new Date() };
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) updateData[key] = value;
    });

    const [page] = await db.update(schema.pages)
        .set(updateData)
        .where(eq(schema.pages.id, id))
        .returning();

    if (!page) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    return NextResponse.json({ page });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;
    const [deleted] = await db.delete(schema.pages)
        .where(eq(schema.pages.id, id))
        .returning({ id: schema.pages.id });

    if (!deleted) return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
    return NextResponse.json({ success: true });
}
