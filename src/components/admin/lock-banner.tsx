/**
 * LockBanner — displays when content is being edited by another user
 */
"use client";

import { useEffect, useState, useCallback } from "react";

interface LockBannerProps {
    entityType: "article" | "page";
    entityId: string;
    onLockAcquired?: () => void;
}

export default function LockBanner({ entityType, entityId, onLockAcquired }: LockBannerProps) {
    const [locked, setLocked] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [checking, setChecking] = useState(true);

    const acquireLock = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/locks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entityType, entityId }),
            });
            if (res.ok) {
                setLocked(false);
                setIsOwner(true);
                onLockAcquired?.();
            } else if (res.status === 423) {
                setLocked(true);
                setIsOwner(false);
            }
        } catch {}
        setChecking(false);
    }, [entityType, entityId, onLockAcquired]);

    // Acquire on mount
    useEffect(() => {
        acquireLock();
    }, [acquireLock]);

    // Renew every 4 minutes
    useEffect(() => {
        if (!isOwner) return;
        const renew = setInterval(acquireLock, 4 * 60 * 1000);
        return () => clearInterval(renew);
    }, [isOwner, acquireLock]);

    // Release on unmount
    useEffect(() => {
        return () => {
            fetch(`/api/admin/locks?entityType=${entityType}&entityId=${entityId}`, {
                method: "DELETE",
            }).catch(() => {});
        };
    }, [entityType, entityId]);

    if (checking || (!locked && isOwner)) return null;

    return (
        <div className="bg-yellow-900/40 border border-yellow-700/60 rounded-lg px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-lg">🔒</span>
            <div className="flex-1">
                <div className="text-sm font-medium text-yellow-200">
                    Dit item wordt bewerkt door een andere gebruiker
                </div>
                <div className="text-xs text-yellow-400/70">
                    Je wijzigingen kunnen overschreven worden. Wacht tot de vergrendeling verloopt.
                </div>
            </div>
            <button
                onClick={acquireLock}
                className="px-3 py-1.5 bg-yellow-800 text-yellow-200 rounded text-xs hover:bg-yellow-700"
            >
                🔄 Opnieuw proberen
            </button>
        </div>
    );
}
