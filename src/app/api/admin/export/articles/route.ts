/**
 * Export API — GET /api/admin/export/articles
 * Downloads articles as CSV (excluding soft-deleted)
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc, sql, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/admin/audit";
import { exportLimiter } from "@/lib/admin/rate-limit";

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

function escapeCsv(value: string | null | undefined): string {
    if (!value) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export async function GET(request: NextRequest) {
    // Rate limit: max 5 exports per minute
    const limited = exportLimiter.check(request);
    if (limited) return limited;

    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    // Exclude soft-deleted articles
    const articles = await db.query.articles.findMany({
        where: sql`${schema.articles.deletedAt} IS NULL`,
        orderBy: [desc(schema.articles.updatedAt)],
    });

    const headers = ["id", "title", "slug", "status", "category", "seoTitle", "seoDescription", "featuredImage", "excerpt", "createdAt", "updatedAt"];
    const rows = articles.map(a => [
        a.id,
        escapeCsv(a.title),
        escapeCsv(a.slug),
        a.status,
        escapeCsv(a.category),
        escapeCsv(a.seoTitle),
        escapeCsv(a.seoDescription),
        escapeCsv(a.featuredImage),
        escapeCsv(a.excerpt),
        a.createdAt?.toISOString() || "",
        a.updatedAt?.toISOString() || "",
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    // Audit log the export
    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "export",
        entityType: "article",
        entityTitle: `CSV export (${articles.length} artikelen)`,
    });

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="artikelen-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
    });
}
