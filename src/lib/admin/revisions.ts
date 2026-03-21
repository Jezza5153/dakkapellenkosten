/**
 * Revision Helper — Server-side
 * Creates content revision snapshots on explicit save.
 * Includes deduplication: skips revision if content hasn't meaningfully changed.
 */

import { db, schema } from "@/db";
import { and, eq, desc } from "drizzle-orm";

export interface RevisionData {
    title?: string;
    content?: string;
    excerpt?: string;
    seoTitle?: string;
    seoDescription?: string;
    [key: string]: unknown;
}

/** Minimum seconds between revisions for the same entity (prevents rapid Ctrl+S spam) */
const MIN_REVISION_INTERVAL_SEC = 30;

/**
 * Create a new revision for an article or page.
 * Called on explicit save (Ctrl+S / button click), NOT on autosave.
 *
 * Deduplication rules:
 * 1. Skip if the last revision was created less than 30 seconds ago
 * 2. Skip if title + content haven't changed since last revision
 */
export async function createRevision(
    entityType: "article" | "page",
    entityId: string,
    data: RevisionData,
    authorId?: string | null
): Promise<number | null> {
    // Get the last revision for deduplication check
    const lastRevision = await db.query.contentRevisions.findFirst({
        where: and(
            eq(schema.contentRevisions.entityType, entityType),
            eq(schema.contentRevisions.entityId, entityId)
        ),
        orderBy: [desc(schema.contentRevisions.revisionNumber)],
    });

    // Dedup check 1: Time-based — skip if last revision was < 30s ago
    if (lastRevision?.createdAt) {
        const secsSinceLastRevision = (Date.now() - new Date(lastRevision.createdAt).getTime()) / 1000;
        if (secsSinceLastRevision < MIN_REVISION_INTERVAL_SEC) {
            return null; // Too soon, skip
        }
    }

    // Dedup check 2: Content-based — skip if title+content identical to last revision
    if (lastRevision) {
        const titleSame = (data.title || "") === (lastRevision.title || "");
        const contentSame = (data.content || "") === (lastRevision.content || "");
        const seoTitleSame = (data.seoTitle || "") === (lastRevision.seoTitle || "");
        const seoDescSame = (data.seoDescription || "") === (lastRevision.seoDescription || "");

        if (titleSame && contentSame && seoTitleSame && seoDescSame) {
            return null; // No meaningful change, skip
        }
    }

    const nextNumber = (lastRevision?.revisionNumber || 0) + 1;

    // Extract known fields, put the rest in metadata
    const { title, content, excerpt, seoTitle, seoDescription, ...rest } = data;

    await db.insert(schema.contentRevisions).values({
        entityType,
        entityId,
        revisionNumber: nextNumber,
        title: title || null,
        content: content || null,
        excerpt: excerpt || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        metadata: Object.keys(rest).length > 0 ? rest : null,
        authorId: authorId || null,
    });

    return nextNumber;
}

/**
 * Get all revisions for an entity, newest first.
 */
export async function getRevisions(entityType: "article" | "page", entityId: string) {
    return db.query.contentRevisions.findMany({
        where: and(
            eq(schema.contentRevisions.entityType, entityType),
            eq(schema.contentRevisions.entityId, entityId)
        ),
        orderBy: [desc(schema.contentRevisions.revisionNumber)],
        with: { author: true },
    });
}

/**
 * Get a single revision by ID.
 */
export async function getRevision(revisionId: string) {
    return db.query.contentRevisions.findFirst({
        where: eq(schema.contentRevisions.id, revisionId),
        with: { author: true },
    });
}
