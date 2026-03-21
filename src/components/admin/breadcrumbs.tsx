/**
 * Admin Breadcrumbs — Context + Component
 * Extracted from layout to avoid Next.js export constraints
 */
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

/* ── Types ────────────────────────────────────────────── */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbContextValue {
    crumbs: BreadcrumbItem[];
    setCrumbs: (crumbs: BreadcrumbItem[]) => void;
}

/* ── Context ──────────────────────────────────────────── */
export const BreadcrumbContext = createContext<BreadcrumbContextValue>({
    crumbs: [],
    setCrumbs: () => {},
});

export function useBreadcrumbs() {
    return useContext(BreadcrumbContext);
}

/* ── Setter component — mount in child pages ──────────── */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    const { setCrumbs } = useBreadcrumbs();
    useEffect(() => {
        setCrumbs(items);
        return () => setCrumbs([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(items)]);
    return null;
}

/* ── Display component — mount in layout header ───────── */
export function BreadcrumbBar({ crumbs }: { crumbs: BreadcrumbItem[] }) {
    if (!crumbs.length) return null;
    return (
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/admin" className="hover:text-gray-300 transition-colors">Admin</Link>
            {crumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <span className="text-gray-600">/</span>
                    {crumb.href && i < crumbs.length - 1 ? (
                        <Link href={crumb.href} className="hover:text-gray-300 transition-colors">{crumb.label}</Link>
                    ) : (
                        <span className="text-gray-400">{crumb.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

/* ── Provider wrapper ─────────────────────────────────── */
export function BreadcrumbProvider({ children }: { children: ReactNode }) {
    const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);
    return (
        <BreadcrumbContext.Provider value={{ crumbs, setCrumbs }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}
