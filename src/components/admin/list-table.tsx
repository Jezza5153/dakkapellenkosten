/**
 * Shared List-Table Component
 * Reusable data table with pagination, sorting, bulk actions, filters, and row actions
 */
"use client";

import { useState, useMemo, type ReactNode } from "react";

/* ── Types ────────────────────────────────────────────── */
export interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    render?: (row: T) => ReactNode;
}

export interface BulkAction {
    label: string;
    variant?: "danger" | "default";
    action: (ids: string[]) => Promise<void>;
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}

export interface ListTableProps<T extends { id: string }> {
    data: T[];
    columns: Column<T>[];
    total: number;
    page: number;
    perPage: number;
    onPageChange: (page: number) => void;
    sortBy?: string;
    sortDir?: "asc" | "desc";
    onSort?: (key: string) => void;
    loading?: boolean;
    search?: string;
    onSearch?: (value: string) => void;
    searchPlaceholder?: string;
    filters?: FilterConfig[];
    bulkActions?: BulkAction[];
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    emptyAction?: ReactNode;
}

/* ── Component ────────────────────────────────────────── */
export default function ListTable<T extends { id: string }>({
    data,
    columns,
    total,
    page,
    perPage,
    onPageChange,
    sortBy,
    sortDir,
    onSort,
    loading,
    search,
    onSearch,
    searchPlaceholder = "Zoeken...",
    filters,
    bulkActions,
    onRowClick,
    emptyMessage = "Geen resultaten gevonden.",
    emptyAction,
}: ListTableProps<T>) {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const allSelected = data.length > 0 && data.every(row => selected.has(row.id));

    function toggleAll() {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(data.map(r => r.id)));
        }
    }

    function toggleRow(id: string) {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    }

    async function handleBulk(action: BulkAction) {
        if (selected.size === 0) return;
        setBulkLoading(true);
        try {
            await action.action(Array.from(selected));
            setSelected(new Set());
        } catch {}
        setBulkLoading(false);
    }

    // Pagination range
    const pageRange = useMemo(() => {
        const range: number[] = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);
        for (let i = start; i <= end; i++) range.push(i);
        return range;
    }, [page, totalPages]);

    return (
        <div className="space-y-4">
            {/* Toolbar: Search + Filters + Bulk */}
            <div className="flex flex-wrap items-center gap-3">
                {onSearch && (
                    <div className="relative">
                        <input
                            type="text"
                            value={search || ""}
                            onChange={e => onSearch(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 w-64 transition-colors"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                )}

                {filters?.map(f => (
                    <select
                        key={f.key}
                        value={f.value}
                        onChange={e => f.onChange(e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 outline-none focus:border-amber-400 cursor-pointer"
                    >
                        <option value="">{f.label}</option>
                        {f.options.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                ))}

                {/* Bulk actions */}
                {bulkActions && selected.size > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-gray-400">{selected.size} geselecteerd</span>
                        {bulkActions.map(ba => (
                            <button
                                key={ba.label}
                                onClick={() => handleBulk(ba)}
                                disabled={bulkLoading}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                                    ba.variant === "danger"
                                        ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                {ba.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin" />
                        <span className="ml-2">Laden...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        {emptyMessage}
                        {emptyAction && <div className="mt-2">{emptyAction}</div>}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-400 border-b border-gray-700">
                                    {bulkActions && (
                                        <th className="px-4 py-3 w-10">
                                            <input
                                                type="checkbox"
                                                checked={allSelected}
                                                onChange={toggleAll}
                                                className="rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                            />
                                        </th>
                                    )}
                                    {columns.map(col => (
                                        <th
                                            key={col.key}
                                            className={`px-4 py-3 ${col.width || ""} ${col.sortable ? "cursor-pointer select-none hover:text-gray-200 transition-colors" : ""}`}
                                            onClick={() => col.sortable && onSort?.(col.key)}
                                        >
                                            <span className="flex items-center gap-1">
                                                {col.label}
                                                {col.sortable && sortBy === col.key && (
                                                    <span className="text-amber-400">
                                                        {sortDir === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {data.map(row => (
                                    <tr
                                        key={row.id}
                                        className={`transition-colors ${
                                            onRowClick ? "cursor-pointer hover:bg-gray-750" : ""
                                        } ${selected.has(row.id) ? "bg-gray-700/40" : ""}`}
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        {bulkActions && (
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={selected.has(row.id)}
                                                    onChange={() => toggleRow(row.id)}
                                                    className="rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                                                />
                                            </td>
                                        )}
                                        {columns.map(col => (
                                            <td key={col.key} className="px-4 py-3">
                                                {col.render
                                                    ? col.render(row)
                                                    : (row as Record<string, unknown>)[col.key] as ReactNode ?? "—"
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                        {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} van {total}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange(page - 1)}
                            disabled={page <= 1}
                            className="px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            ←
                        </button>
                        {pageRange.map(p => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    p === page
                                        ? "bg-amber-500 text-gray-900"
                                        : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="px-2.5 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
