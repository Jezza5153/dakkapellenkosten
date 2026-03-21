"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

/* ── Types ────────────────────────────────────────────── */
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    undo?: () => void;
    duration?: number;
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType, opts?: { undo?: () => void; duration?: number }) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

/* ── Icons ────────────────────────────────────────────── */
const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
};

const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: "bg-emerald-900/90", border: "border-emerald-500/40", icon: "text-emerald-400" },
    error: { bg: "bg-red-900/90", border: "border-red-500/40", icon: "text-red-400" },
    warning: { bg: "bg-yellow-900/90", border: "border-yellow-500/40", icon: "text-yellow-400" },
    info: { bg: "bg-blue-900/90", border: "border-blue-500/40", icon: "text-blue-400" },
};

/* ── Single Toast ──────────────────────────────────────── */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const [exiting, setExiting] = useState(false);
    const c = colors[toast.type];

    useEffect(() => {
        const dur = toast.duration ?? 4000;
        const exitTimer = setTimeout(() => setExiting(true), dur - 300);
        const removeTimer = setTimeout(() => onDismiss(toast.id), dur);
        return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
    }, [toast, onDismiss]);

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-2xl transition-all duration-300 ${c.bg} ${c.border} ${
                exiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
            }`}
        >
            <span className={`text-lg font-bold ${c.icon}`}>{icons[toast.type]}</span>
            <span className="text-sm text-white flex-1">{toast.message}</span>
            {toast.undo && (
                <button
                    onClick={() => { toast.undo?.(); onDismiss(toast.id); }}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
                >
                    Ongedaan
                </button>
            )}
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-gray-500 hover:text-gray-300 text-sm ml-1"
            >
                ✕
            </button>
        </div>
    );
}

/* ── Provider ──────────────────────────────────────────── */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = "info", opts?: { undo?: () => void; duration?: number }) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setToasts(prev => [...prev.slice(-2), { id, type, message, ...opts }]);
    }, []);

    const value: ToastContextValue = {
        toast: addToast,
        success: useCallback((m: string) => addToast(m, "success"), [addToast]),
        error: useCallback((m: string) => addToast(m, "error"), [addToast]),
        warning: useCallback((m: string) => addToast(m, "warning"), [addToast]),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto animate-in slide-in-from-right-4">
                        <ToastItem toast={t} onDismiss={dismiss} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
