/**
 * Lead Activity Timeline API — GET /api/admin/leads/[id]/timeline
 * Aggregates all activity for a lead: status changes, notes, tasks, matches
 * Returns a unified chronological timeline
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin") return null;
    return true;
}

interface TimelineEvent {
    type: "note" | "task" | "match" | "status_change" | "created";
    timestamp: string;
    actor?: string;
    title: string;
    detail?: string;
    metadata?: Record<string, unknown>;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;

    // Fetch lead + all related data in parallel
    const [lead, notes, tasks, matches, auditEvents] = await Promise.all([
        db.query.leads.findFirst({
            where: eq(schema.leads.id, id),
        }),
        db.query.leadNotes.findMany({
            where: eq(schema.leadNotes.leadId, id),
            with: { author: { columns: { name: true } } },
            orderBy: [desc(schema.leadNotes.createdAt)],
        }),
        db.query.leadTasks.findMany({
            where: eq(schema.leadTasks.leadId, id),
            with: { assignee: { columns: { name: true } } },
            orderBy: [desc(schema.leadTasks.createdAt)],
        }),
        db.query.leadMatches.findMany({
            where: eq(schema.leadMatches.leadId, id),
            with: { company: { columns: { name: true } } },
            orderBy: [desc(schema.leadMatches.createdAt)],
        }),
        db.query.auditEvents.findMany({
            where: eq(schema.auditEvents.entityId, id),
            orderBy: [desc(schema.auditEvents.createdAt)],
            limit: 50,
        }),
    ]);

    if (!lead) {
        return NextResponse.json({ error: "Lead niet gevonden" }, { status: 404 });
    }

    const timeline: TimelineEvent[] = [];

    // Lead created
    timeline.push({
        type: "created",
        timestamp: lead.createdAt.toISOString(),
        title: "Lead aangemaakt",
        detail: `${lead.naam} — ${lead.postcode} ${lead.city || ""}`,
    });

    // Notes
    for (const note of notes) {
        timeline.push({
            type: "note",
            timestamp: note.createdAt.toISOString(),
            actor: (note.author as any)?.name || "Onbekend",
            title: "Notitie toegevoegd",
            detail: note.content.substring(0, 120),
        });
    }

    // Tasks
    for (const task of tasks) {
        timeline.push({
            type: "task",
            timestamp: task.createdAt.toISOString(),
            actor: (task.assignee as any)?.name || undefined,
            title: task.completedAt ? "Taak voltooid" : "Taak aangemaakt",
            detail: task.title,
            metadata: {
                dueAt: task.dueAt?.toISOString(),
                completedAt: task.completedAt?.toISOString(),
            },
        });
    }

    // Matches
    for (const match of matches) {
        const statusActions: Record<string, string> = {
            notified: "Bedrijf genotificeerd",
            accepted: "Lead geaccepteerd",
            declined: "Lead geweigerd",
            contacted: "Contact opgenomen",
            won: "Opdracht gewonnen",
            lost: "Opdracht verloren",
        };
        timeline.push({
            type: "match",
            timestamp: (match.acceptedAt || match.notifiedAt || match.createdAt).toISOString(),
            title: statusActions[match.status] || `Match: ${match.status}`,
            detail: (match.company as any)?.name || "Onbekend bedrijf",
            metadata: { matchScore: match.matchScore, distanceKm: match.distanceKm },
        });
    }

    // Audit events (status changes, etc.)
    for (const event of auditEvents) {
        if (event.action === "status_change") {
            timeline.push({
                type: "status_change",
                timestamp: event.createdAt.toISOString(),
                actor: event.actorName || "Systeem",
                title: "Status gewijzigd",
                metadata: event.diff as Record<string, unknown> || {},
            });
        }
    }

    // Sort chronologically (newest first)
    timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Overdue follow-up warning
    const isOverdue = lead.followUpAt && new Date(lead.followUpAt) < new Date();
    const overdueTasks = tasks.filter(t => !t.completedAt && t.dueAt && new Date(t.dueAt) < new Date());

    return NextResponse.json({
        lead: {
            id: lead.id,
            naam: lead.naam,
            email: lead.email,
            telefoon: lead.telefoon,
            postcode: lead.postcode,
            city: lead.city,
            status: lead.status,
            assignedTo: lead.assignedTo,
            followUpAt: lead.followUpAt,
            createdAt: lead.createdAt,
        },
        timeline,
        warnings: {
            isOverdue,
            overdueTasks: overdueTasks.length,
        },
        counts: {
            notes: notes.length,
            tasks: tasks.length,
            matches: matches.length,
            completedTasks: tasks.filter(t => t.completedAt).length,
        },
    });
}
