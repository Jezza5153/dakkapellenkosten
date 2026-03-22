/**
 * Content Locks API — acquire, release, check
 * Prevents two editors from editing the same content simultaneously
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, lt } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";


// GET — check if content is locked
export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
        return NextResponse.json({ error: "entityType en entityId vereist" }, { status: 400 });
    }

    // Clean expired locks
    await db.delete(schema.contentLocks)
        .where(lt(schema.contentLocks.expiresAt, new Date()));

    const lock = await db.query.contentLocks.findFirst({
        where: and(
            eq(schema.contentLocks.entityType, entityType),
            eq(schema.contentLocks.entityId, entityId),
        ),
    });

    if (!lock) return NextResponse.json({ locked: false });

    // Check if lock belongs to current user
    const isOwner = lock.userId === authResult.userId;
    return NextResponse.json({
        locked: true,
        isOwner,
        lockedBy: lock.userId,
        expiresAt: lock.expiresAt.toISOString(),
    });
}

// POST — acquire or renew lock
export async function POST(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const body = await request.json();
    const { entityType, entityId } = body;

    if (!entityType || !entityId) {
        return NextResponse.json({ error: "entityType en entityId vereist" }, { status: 400 });
    }

    // Clean expired locks
    await db.delete(schema.contentLocks)
        .where(lt(schema.contentLocks.expiresAt, new Date()));

    // Check for existing lock by another user
    const existingLock = await db.query.contentLocks.findFirst({
        where: and(
            eq(schema.contentLocks.entityType, entityType),
            eq(schema.contentLocks.entityId, entityId),
        ),
    });

    if (existingLock && existingLock.userId !== authResult.userId) {
        return NextResponse.json({
            error: "Content is vergrendeld door een andere gebruiker",
            lockedBy: existingLock.userId,
            expiresAt: existingLock.expiresAt.toISOString(),
        }, { status: 423 }); // 423 Locked
    }

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (existingLock) {
        // Renew own lock
        await db.update(schema.contentLocks)
            .set({ expiresAt, lockedAt: new Date() })
            .where(eq(schema.contentLocks.id, existingLock.id));
    } else {
        // Create new lock
        await db.insert(schema.contentLocks).values({
            entityType,
            entityId,
            userId: authResult.userId,
            expiresAt,
        });
    }

    return NextResponse.json({ locked: true, expiresAt: expiresAt.toISOString() });
}

// DELETE — release lock
export async function DELETE(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
        return NextResponse.json({ error: "entityType en entityId vereist" }, { status: 400 });
    }

    await db.delete(schema.contentLocks)
        .where(and(
            eq(schema.contentLocks.entityType, entityType),
            eq(schema.contentLocks.entityId, entityId),
            eq(schema.contentLocks.userId, authResult.userId),
        ));

    return NextResponse.json({ released: true });
}
