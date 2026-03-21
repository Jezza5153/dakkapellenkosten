/**
 * Slug Change Prompt — warns when editing slug of published content
 * Auto-creates redirect from old slug to new slug
 */
"use client";

import { useState } from "react";

interface SlugChangePromptProps {
    oldSlug: string;
    newSlug: string;
    entityType: "article" | "page";
    onConfirm: (createRedirect: boolean) => void;
    onCancel: () => void;
}

export default function SlugChangePrompt({
    oldSlug,
    newSlug,
    entityType,
    onConfirm,
    onCancel,
}: SlugChangePromptProps) {
    const [creating, setCreating] = useState(false);

    const basePath = entityType === "article" ? "/kenniscentrum" : "/dakkapel";

    async function handleConfirmWithRedirect() {
        setCreating(true);
        try {
            await fetch("/api/admin/redirects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fromPath: `${basePath}/${oldSlug}`,
                    toPath: `${basePath}/${newSlug}`,
                    statusCode: 301,
                }),
            });
        } catch {}
        setCreating(false);
        onConfirm(true);
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">⚠️ Slug gewijzigd</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Je hebt de slug gewijzigd van een gepubliceerde {entityType === "article" ? "artikel" : "pagina"}.
                    Dit kan bestaande links breken.
                </p>

                <div className="bg-gray-900 rounded-lg p-3 mb-4 text-xs font-mono">
                    <div className="text-red-400 line-through">{basePath}/{oldSlug}</div>
                    <div className="text-emerald-400 mt-1">{basePath}/{newSlug}</div>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={handleConfirmWithRedirect}
                        disabled={creating}
                        className="w-full px-4 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-500 disabled:opacity-50"
                    >
                        {creating ? "Redirect aanmaken..." : "✓ Opslaan + 301 redirect aanmaken"}
                    </button>
                    <button
                        onClick={() => onConfirm(false)}
                        className="w-full px-4 py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                    >
                        Opslaan zonder redirect
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full px-4 py-2.5 text-gray-500 text-sm hover:text-gray-300"
                    >
                        Annuleren
                    </button>
                </div>
            </div>
        </div>
    );
}
