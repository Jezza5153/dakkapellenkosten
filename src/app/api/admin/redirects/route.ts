/**
 * Redirects API — GET list, POST create, DELETE remove
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/admin/audit";
import { z } from "zod";

const createRedirectSchema = z.object({
    fromPath: z.string().min(1).max(500),
    toPath: z.string().min(1).max(500),
    statusCode: z.number().int().min(300).max(399).default(301),
});

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin") return null;
    return {
        userId: (session.user as any).id || session.user.id,
        userName: (session.user as any).name || session.user.email || "Onbekend",
    };
}

export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.redirects);
    const total = countResult[0]?.count || 0;

    const redirects = await db.query.redirects.findMany({
        orderBy: [desc(schema.redirects.createdAt)],
        limit,
        offset: (page - 1) * limit,
    });

    return NextResponse.json({ redirects, total, page, perPage: limit });
}

export async function POST(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const body = await request.json();
    const parsed = createRedirectSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
    }

    // Normalize paths
    let fromPath = parsed.data.fromPath;
    let toPath = parsed.data.toPath;
    if (!fromPath.startsWith("/")) fromPath = "/" + fromPath;
    if (!toPath.startsWith("/") && !toPath.startsWith("http")) toPath = "/" + toPath;

    // Check for duplicate
    const existing = await db.query.redirects.findFirst({
        where: eq(schema.redirects.fromPath, fromPath),
    });
    if (existing) {
        return NextResponse.json({ error: "Redirect voor dit pad bestaat al" }, { status: 409 });
    }

    const [redirect] = await db.insert(schema.redirects)
        .values({
            fromPath,
            toPath,
            statusCode: parsed.data.statusCode,
            createdBy: authResult.userId,
        })
        .returning();

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "create",
        entityType: "redirect",
        entityTitle: `${fromPath} → ${toPath}`,
    });

    return NextResponse.json({ redirect }, { status: 201 });
}
