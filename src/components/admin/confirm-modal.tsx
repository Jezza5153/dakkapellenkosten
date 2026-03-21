/**
 * Confirm Modal — Shared system
 * Standardized destructive action confirmation with danger/default variants
 */
"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "default";
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmLabel = "Bevestigen",
    cancelLabel = "Annuleren",
    variant = "default",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const confirmRef = useRef<HTMLButtonElement>(null);

    // Focus confirm button on open
    useEffect(() => {
        if (open) confirmRef.current?.focus();
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4" onClick={onCancel}>
            <div
                className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            variant === "danger" ? "bg-red-600/20" : "bg-amber-500/20"
                        }`}>
                            <span className="text-lg">
                                {variant === "danger" ? "⚠" : "❓"}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">{title}</h3>
                            <p className="text-sm text-gray-400 mt-1">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-700">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                            variant === "danger"
                                ? "bg-red-600 text-white hover:bg-red-500"
                                : "bg-amber-500 text-gray-900 hover:bg-amber-400"
                        }`}
                    >
                        {loading ? "..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
