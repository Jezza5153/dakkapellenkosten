/**
 * Lead Tasks API — CRUD for tasks associated with leads
 * Supports: list, create, complete, delete
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logAudit } from "@/lib/admin/audit";

const createTaskSchema = z.object({
    title: z.string().min(1).max(255),
    dueAt: z.string().nullable().optional(),
    assignedTo: z.string().nullable().optional(),
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

// GET — list tasks for a lead
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;

    const tasks = await db.query.leadTasks.findMany({
        where: eq(schema.leadTasks.leadId, id),
        orderBy: [asc(schema.leadTasks.dueAt)],
    });

    return NextResponse.json({ tasks });
}

// POST — create task or complete/delete existing
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    // Complete or delete existing task
    if (body.taskId && body.action) {
        if (body.action === "complete") {
            await db.update(schema.leadTasks)
                .set({ completedAt: new Date() })
                .where(eq(schema.leadTasks.id, body.taskId));
            return NextResponse.json({ success: true });
        }
        if (body.action === "delete") {
            await db.delete(schema.leadTasks)
                .where(eq(schema.leadTasks.id, body.taskId));
            return NextResponse.json({ success: true });
        }
    }

    // Create new task
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
    }

    const [task] = await db.insert(schema.leadTasks).values({
        leadId: id,
        title: parsed.data.title,
        dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
        assignedTo: parsed.data.assignedTo || null,
    }).returning();

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "create",
        entityType: "lead_task",
        entityId: task.id,
        entityTitle: parsed.data.title,
    });

    return NextResponse.json({ task }, { status: 201 });
}
