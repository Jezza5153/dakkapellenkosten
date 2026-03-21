/**
 * Trash API — GET soft-deleted items, POST restore, DELETE permanent
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { isNotNull, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

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
    const entityType = searchParams.get("entityType") || "";

    const results: any = { articles: [], pages: [], media: [] };

    if (!entityType || entityType === "article") {
        results.articles = await db.query.articles.findMany({
            where: isNotNull(schema.articles.deletedAt),
            orderBy: [desc(schema.articles.deletedAt!)],
            columns: { id: true, title: true, slug: true, status: true, deletedAt: true },
        });
    }

    if (!entityType || entityType === "page") {
        results.pages = await db.query.pages.findMany({
            where: isNotNull(schema.pages.deletedAt),
            orderBy: [desc(schema.pages.deletedAt!)],
            columns: { id: true, title: true, slug: true, status: true, city: true, deletedAt: true },
        });
    }

    if (!entityType || entityType === "media") {
        results.media = await db.query.media.findMany({
            where: isNotNull(schema.media.deletedAt),
            orderBy: [desc(schema.media.deletedAt!)],
            columns: { id: true, filename: true, url: true, deletedAt: true },
        });
    }

    return NextResponse.json(results);
}
