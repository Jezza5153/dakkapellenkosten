/**
 * Audit Log API — GET paginated, filterable from audit_events table
 * Replaces the fake audit log that just sorted updatedAt
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc, and, sql, gte, lte, ilike } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const entityType = searchParams.get("entityType") || "";
    const action = searchParams.get("action") || "";
    const actorId = searchParams.get("actorId") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    const conditions = [];

    if (entityType) {
        conditions.push(eq(schema.auditEvents.entityType, entityType));
    }
    if (action) {
        conditions.push(eq(schema.auditEvents.action, action));
    }
    if (actorId) {
        conditions.push(eq(schema.auditEvents.actorId, actorId));
    }
    if (dateFrom) {
        conditions.push(gte(schema.auditEvents.createdAt, new Date(dateFrom)));
    }
    if (dateTo) {
        conditions.push(lte(schema.auditEvents.createdAt, new Date(dateTo)));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const countResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.auditEvents)
        .where(where);
    const total = countResult[0]?.count || 0;

    const events = await db.query.auditEvents.findMany({
        where,
        orderBy: [desc(schema.auditEvents.createdAt)],
        limit,
        offset: (page - 1) * limit,
    });

    return NextResponse.json({
        events,
        total,
        page,
        perPage: limit,
    });
}
