/**
 * Article Revisions API — GET list, POST restore
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { and, eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getRevisions } from "@/lib/admin/revisions";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return { userId: (session.user as any).id || session.user.id };
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;
    const revisions = await getRevisions("article", id);

    return NextResponse.json({ revisions });
}
