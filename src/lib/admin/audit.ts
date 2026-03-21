/**
 * Audit Logger — Server-side helper
 * Writes structured audit events to the audit_events table.
 * Call this from every admin API mutation.
 */

import { db, schema } from "@/db";

export interface AuditParams {
    actorId?: string | null;
    actorName?: string;
    action: string;       // 'create' | 'update' | 'delete' | 'restore' | 'publish' | 'status_change' | 'export' | 'login'
    entityType: string;   // 'article' | 'page' | 'lead' | 'company' | 'media' | 'settings' | 'user'
    entityId?: string;
    entityTitle?: string;
    diff?: Record<string, { old: unknown; new: unknown }>;
    ip?: string;
}

export async function logAudit(params: AuditParams): Promise<void> {
    try {
        await db.insert(schema.auditEvents).values({
            actorId: params.actorId || null,
            actorName: params.actorName || "System",
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId || null,
            entityTitle: params.entityTitle || null,
            diff: params.diff || null,
            ipAddress: params.ip || null,
        });
    } catch (err) {
        // Audit logging should never break the main operation
        console.error("[audit] Failed to log event:", err);
    }
}

/**
 * Compute a diff between old and new objects.
 * Only includes fields that actually changed.
 */
export function computeDiff(
    oldObj: Record<string, unknown>,
    newObj: Record<string, unknown>,
    fields: string[]
): Record<string, { old: unknown; new: unknown }> | null {
    const diff: Record<string, { old: unknown; new: unknown }> = {};
    for (const field of fields) {
        const oldVal = oldObj[field];
        const newVal = newObj[field];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            diff[field] = { old: oldVal ?? null, new: newVal ?? null };
        }
    }
    return Object.keys(diff).length > 0 ? diff : null;
}
