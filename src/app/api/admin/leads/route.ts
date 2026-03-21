/**
 * Leads List API — GET (paginated, filterable, sortable)
 * Replaces the dashboard-as-API pattern for leads
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, asc, ilike, and, sql, or, isNull } from "drizzle-orm";
import { auth } from "@/lib/auth";

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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") || "desc";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";

    // Build conditions
    const conditions = [];

    if (status) {
        conditions.push(eq(schema.leads.status, status as any));
    }

    if (city) {
        conditions.push(eq(schema.leads.city, city));
    }

    if (search) {
        conditions.push(
            or(
                ilike(schema.leads.naam, `%${search}%`),
                ilike(schema.leads.email, `%${search}%`),
                ilike(schema.leads.postcode, `%${search}%`),
                ilike(schema.leads.city ?? "", `%${search}%`)
            )!
        );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Sorting
    const sortColumn = {
        createdAt: schema.leads.createdAt,
        updatedAt: schema.leads.updatedAt,
        naam: schema.leads.naam,
        status: schema.leads.status,
        city: schema.leads.city,
        postcode: schema.leads.postcode,
    }[sortBy] || schema.leads.createdAt;

    const orderBy = sortDir === "asc" ? [asc(sortColumn)] : [desc(sortColumn)];

    // Count
    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.leads)
        .where(where);
    const total = countResult[0]?.count || 0;

    // Fetch
    const leads = await db.query.leads.findMany({
        where,
        orderBy,
        limit,
        offset: (page - 1) * limit,
    });

    return NextResponse.json({
        leads,
        total,
        page,
        perPage: limit,
    });
}
