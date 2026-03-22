/**
 * Overdue Follow-ups API — GET /api/admin/leads/overdue
 * Returns leads with follow-up dates in the past, tasks overdue, unassigned leads
 * Powers the admin "attention needed" dashboard widget
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { sql, desc, lt, isNull, and, eq, isNotNull } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const now = new Date();

    // 1. Leads with overdue follow-ups
    const overdueFollowUps = await db.query.leads.findMany({
        where: and(
            isNotNull(schema.leads.followUpAt),
            lt(schema.leads.followUpAt, now),
            sql`${schema.leads.status} NOT IN ('fulfilled', 'expired', 'cancelled')`
        ),
        orderBy: [desc(schema.leads.followUpAt)],
        columns: {
            id: true, naam: true, email: true, postcode: true,
            city: true, status: true, followUpAt: true, assignedTo: true,
        },
    });

    // 2. Overdue tasks (not completed, past due)
    const overdueTasks = await db.query.leadTasks.findMany({
        where: and(
            isNull(schema.leadTasks.completedAt),
            isNotNull(schema.leadTasks.dueAt),
            lt(schema.leadTasks.dueAt, now)
        ),
        with: {
            lead: { columns: { id: true, naam: true } },
            assignee: { columns: { name: true } },
        },
        orderBy: [desc(schema.leadTasks.dueAt)],
    });

    // 3. New leads without assignment (stale > 24h)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const unassignedLeads = await db.query.leads.findMany({
        where: and(
            eq(schema.leads.status, "new"),
            isNull(schema.leads.assignedTo),
            lt(schema.leads.createdAt, oneDayAgo)
        ),
        orderBy: [desc(schema.leads.createdAt)],
        columns: {
            id: true, naam: true, email: true, postcode: true,
            city: true, createdAt: true,
        },
    });

    // 4. Leads with 0 matches (older than 1 day)
    const noMatchLeads = await db
        .select({
            id: schema.leads.id,
            naam: schema.leads.naam,
            postcode: schema.leads.postcode,
            city: schema.leads.city,
            createdAt: schema.leads.createdAt,
        })
        .from(schema.leads)
        .where(and(
            eq(schema.leads.matchCount, 0),
            eq(schema.leads.status, "new"),
            lt(schema.leads.createdAt, oneDayAgo)
        ))
        .orderBy(desc(schema.leads.createdAt))
        .limit(20);

    return NextResponse.json({
        overdueFollowUps: {
            count: overdueFollowUps.length,
            items: overdueFollowUps.slice(0, 10),
        },
        overdueTasks: {
            count: overdueTasks.length,
            items: overdueTasks.slice(0, 10),
        },
        unassignedLeads: {
            count: unassignedLeads.length,
            items: unassignedLeads.slice(0, 10),
        },
        noMatchLeads: {
            count: noMatchLeads.length,
            items: noMatchLeads.slice(0, 10),
        },
        totalAttentionItems: overdueFollowUps.length + overdueTasks.length + unassignedLeads.length + noMatchLeads.length,
    });
}
