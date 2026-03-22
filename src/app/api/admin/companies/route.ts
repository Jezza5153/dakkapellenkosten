/**
 * Companies List API — GET (paginated, filterable, sortable)
 * Replaces the dashboard-as-API pattern for companies
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, asc, ilike, and, sql, or } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") || "desc";
    const search = searchParams.get("search") || "";
    const isVerified = searchParams.get("isVerified");
    const city = searchParams.get("city") || "";

    const conditions = [];

    if (search) {
        conditions.push(
            or(
                ilike(schema.companies.name, `%${search}%`),
                ilike(schema.companies.city ?? "", `%${search}%`),
                ilike(schema.companies.email ?? "", `%${search}%`)
            )!
        );
    }

    if (isVerified === "true") {
        conditions.push(eq(schema.companies.isVerified, true));
    } else if (isVerified === "false") {
        conditions.push(eq(schema.companies.isVerified, false));
    }

    if (city) {
        conditions.push(eq(schema.companies.city, city));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = {
        createdAt: schema.companies.createdAt,
        name: schema.companies.name,
        city: schema.companies.city,
        avgRating: schema.companies.avgRating,
        reviewCount: schema.companies.reviewCount,
    }[sortBy] || schema.companies.createdAt;

    const orderBy = sortDir === "asc" ? [asc(sortColumn)] : [desc(sortColumn)];

    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.companies)
        .where(where);
    const total = countResult[0]?.count || 0;

    const companies = await db.query.companies.findMany({
        where,
        orderBy,
        limit,
        offset: (page - 1) * limit,
    });

    return NextResponse.json({
        companies,
        total,
        page,
        perPage: limit,
    });
}
