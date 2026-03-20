/**
 * Lead Notes API — GET / POST
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin") return null;
    return { userId: (session.user as any).id || session.user.id };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    const notes = await db.query.leadNotes.findMany({
        where: eq(schema.leadNotes.leadId, id),
        orderBy: [desc(schema.leadNotes.createdAt)],
        with: { author: { columns: { name: true } } },
    });

    return NextResponse.json({ notes });
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.content?.trim()) {
        return NextResponse.json({ error: "Notitie is leeg" }, { status: 400 });
    }

    const [note] = await db.insert(schema.leadNotes).values({
        leadId: id,
        authorId: authResult.userId,
        content: body.content.trim(),
    }).returning();

    return NextResponse.json({ note }, { status: 201 });
}
