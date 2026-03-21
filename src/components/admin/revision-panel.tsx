/**
 * Revision Panel — embeddable sidebar component
 * Shows revision history for articles/pages with restore capability
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/admin/toast";

interface Revision {
    id: string;
    revisionNumber: number;
    title: string | null;
    authorId: string | null;
    createdAt: string;
}

interface RevisionPanelProps {
    entityType: "article" | "page";
    entityId: string;
    onRestore?: () => void;
}

function timeAgo(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Zojuist";
    if (diffMin < 60) return `${diffMin}m`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}u`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d`;
}

export default function RevisionPanel({ entityType, entityId, onRestore }: RevisionPanelProps) {
    const { success, error } = useToast();
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const loadRevisions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/${entityType}s/${entityId}/revisions`);
            if (res.ok) {
                const d = await res.json();
                setRevisions(d.revisions || []);
            }
        } catch {}
        setLoading(false);
    }, [entityType, entityId]);

    useEffect(() => { loadRevisions(); }, [loadRevisions]);

    async function handleRestore(revId: string) {
        if (!confirm("Wil je terugkeren naar deze revisie? De huidige versie wordt ook als revisie opgeslagen.")) return;
        setRestoring(revId);
        try {
            const res = await fetch(`/api/admin/${entityType}s/${entityId}/revisions/${revId}/restore`, {
                method: "POST",
            });
            if (res.ok) {
                success("Revisie hersteld — pagina wordt herladen");
                loadRevisions();
                onRestore?.();
            } else {
                error("Herstellen mislukt");
            }
        } catch {
            error("Herstellen mislukt");
        }
        setRestoring(null);
    }

    if (loading) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">📜 Revisies</h3>
                <div className="text-xs text-gray-500">Laden...</div>
            </div>
        );
    }

    if (revisions.length === 0) {
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">📜 Revisies</h3>
                <div className="text-xs text-gray-500">Nog geen revisies opgeslagen</div>
            </div>
        );
    }

    const visible = expanded ? revisions : revisions.slice(0, 5);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                📜 Revisies ({revisions.length})
            </h3>
            <div className="space-y-1.5">
                {visible.map((rev, i) => (
                    <div
                        key={rev.id}
                        className="flex items-center gap-2 group"
                    >
                        <span className={`text-xs w-5 text-center font-mono ${
                            i === 0 ? "text-amber-400" : "text-gray-600"
                        }`}>
                            #{rev.revisionNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-400 truncate">
                                {rev.title || "Zonder titel"}
                            </div>
                            <div className="text-[10px] text-gray-600">
                                {timeAgo(rev.createdAt)} geleden
                            </div>
                        </div>
                        {i > 0 && (
                            <button
                                onClick={() => handleRestore(rev.id)}
                                disabled={restoring === rev.id}
                                className="opacity-0 group-hover:opacity-100 text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded hover:bg-gray-600 hover:text-white transition-all disabled:opacity-50"
                            >
                                {restoring === rev.id ? "..." : "Herstel"}
                            </button>
                        )}
                        {i === 0 && (
                            <span className="text-[10px] text-emerald-500">Huidig</span>
                        )}
                    </div>
                ))}
            </div>
            {revisions.length > 5 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[10px] text-gray-500 hover:text-gray-300 mt-2 block"
                >
                    {expanded ? "Minder tonen" : `+${revisions.length - 5} meer`}
                </button>
            )}
        </div>
    );
}
