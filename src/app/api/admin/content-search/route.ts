/**
 * Content Search API — GET /api/admin/content-search
 * Used by internal link picker in TipTap editor
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { ilike, eq, or, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type"); // 'article' | 'page' | null (both)

    const results: Array<{ id: string; title: string; slug: string; type: string }> = [];

    if (!type || type === "article") {
        const articles = await db.query.articles.findMany({
            where: q
                ? ilike(schema.articles.title, `%${q}%`)
                : eq(schema.articles.status, "published"),
            columns: { id: true, title: true, slug: true },
            orderBy: [desc(schema.articles.updatedAt)],
            limit: 15,
        });
        results.push(...articles.map(a => ({
            ...a,
            type: "article" as const,
            slug: `/kenniscentrum/${a.slug}`,
        })));
    }

    if (!type || type === "page") {
        const pages = await db.query.pages.findMany({
            where: q
                ? ilike(schema.pages.title, `%${q}%`)
                : eq(schema.pages.status, "published"),
            columns: { id: true, title: true, slug: true },
            orderBy: [desc(schema.pages.updatedAt)],
            limit: 15,
        });
        results.push(...pages.map(p => ({
            ...p,
            type: "page" as const,
            slug: `/${p.slug}`,
        })));
    }

    return NextResponse.json({ results });
}
