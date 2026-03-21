/**
 * Global Admin Search — Command Palette (Ctrl/Cmd+K)
 * Searches articles, pages, leads, companies in one unified interface
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
    type: "article" | "page" | "lead" | "company" | "action";
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    icon: string;
}

const quickActions: SearchResult[] = [
    { type: "action", id: "new-article", title: "Nieuw artikel", subtitle: "Maak een nieuw artikel aan", href: "/admin/articles/new", icon: "📝" },
    { type: "action", id: "new-page", title: "Nieuwe pagina", subtitle: "Maak een nieuwe pagina aan", href: "/admin/pages/new", icon: "📄" },
    { type: "action", id: "media", title: "Media uploaden", subtitle: "Upload afbeeldingen", href: "/admin/media", icon: "🖼️" },
    { type: "action", id: "leads", title: "Leads bekijken", subtitle: "Beheer binnenkomende leads", href: "/admin/leads", icon: "👥" },
    { type: "action", id: "seo", title: "SEO Health", subtitle: "Bekijk SEO status", href: "/admin/seo-health", icon: "🔍" },
];

export default function CommandPalette() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchTimer = useRef<NodeJS.Timeout | null>(null);

    // Open with Cmd/Ctrl+K
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(prev => !prev);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
        }
    }, [open]);

    // Search with debounce
    const search = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const allResults: SearchResult[] = [];

        try {
            // Parallel search across all entity types
            const [articlesRes, pagesRes, dashboardRes] = await Promise.all([
                fetch(`/api/admin/articles?search=${encodeURIComponent(q)}&limit=5`).then(r => r.ok ? r.json() : { articles: [] }),
                fetch(`/api/admin/pages?search=${encodeURIComponent(q)}&limit=5`).then(r => r.ok ? r.json() : { pages: [] }),
                fetch(`/api/admin/dashboard`).then(r => r.ok ? r.json() : { leads: [], companies: [] }),
            ]);

            // Articles
            for (const a of (articlesRes.articles || []).slice(0, 5)) {
                allResults.push({
                    type: "article",
                    id: a.id,
                    title: a.title,
                    subtitle: a.status === "published" ? "Gepubliceerd" : "Concept",
                    href: `/admin/articles/${a.id}`,
                    icon: "📝",
                });
            }

            // Pages
            for (const p of (pagesRes.pages || []).slice(0, 5)) {
                allResults.push({
                    type: "page",
                    id: p.id,
                    title: p.title,
                    subtitle: p.city ? `${p.city}` : p.status === "published" ? "Gepubliceerd" : "Concept",
                    href: `/admin/pages/${p.id}`,
                    icon: "📄",
                });
            }

            // Leads (client-side filter)
            const qLower = q.toLowerCase();
            for (const l of (dashboardRes.leads || []).filter((l: any) =>
                l.naam?.toLowerCase().includes(qLower) ||
                l.email?.toLowerCase().includes(qLower) ||
                l.postcode?.toLowerCase().includes(qLower)
            ).slice(0, 3)) {
                allResults.push({
                    type: "lead",
                    id: l.id,
                    title: l.naam,
                    subtitle: `${l.postcode} ${l.city || ""}`.trim(),
                    href: "/admin/leads",
                    icon: "👤",
                });
            }

            // Companies (client-side filter)
            for (const c of (dashboardRes.companies || []).filter((c: any) =>
                c.name?.toLowerCase().includes(qLower) ||
                c.city?.toLowerCase().includes(qLower)
            ).slice(0, 3)) {
                allResults.push({
                    type: "company",
                    id: c.id,
                    title: c.name,
                    subtitle: c.city || "",
                    href: `/admin/companies/${c.id}`,
                    icon: "🏢",
                });
            }
        } catch {}

        setResults(allResults);
        setSelectedIndex(0);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (query.trim()) {
            searchTimer.current = setTimeout(() => search(query), 200);
        } else {
            setResults([]);
        }
        return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
    }, [query, search]);

    // Keyboard navigation
    function handleKeyDown(e: React.KeyboardEvent) {
        const items = query ? results : quickActions;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const item = items[selectedIndex];
            if (item) {
                router.push(item.href);
                setOpen(false);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    if (!open) return null;

    const displayItems = query ? results : quickActions;

    return (
        <div className="fixed inset-0 bg-black/70 z-[300] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
            <div
                className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700">
                    <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Zoek artikelen, pagina's, leads, bedrijven..."
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
                    />
                    {loading && (
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin" />
                    )}
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded text-[10px] font-mono">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto py-2">
                    {query && results.length === 0 && !loading ? (
                        <div className="px-5 py-6 text-center text-gray-500 text-sm">
                            Geen resultaten voor &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        <>
                            {!query && (
                                <div className="px-4 py-1.5">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Snelle acties</span>
                                </div>
                            )}
                            {displayItems.map((item, i) => (
                                <button
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => { router.push(item.href); setOpen(false); }}
                                    onMouseEnter={() => setSelectedIndex(i)}
                                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                                        i === selectedIndex ? "bg-gray-700/70" : "hover:bg-gray-700/40"
                                    }`}
                                >
                                    <span className="text-base w-6 text-center shrink-0">{item.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium truncate">{item.title}</div>
                                        {item.subtitle && (
                                            <div className="text-[10px] text-gray-500 truncate">{item.subtitle}</div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-600 uppercase shrink-0">
                                        {item.type === "article" ? "Artikel" :
                                         item.type === "page" ? "Pagina" :
                                         item.type === "lead" ? "Lead" :
                                         item.type === "company" ? "Bedrijf" : ""}
                                    </span>
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-700/50 text-[10px] text-gray-500">
                    <div className="flex gap-3">
                        <span>↑↓ navigeren</span>
                        <span>↵ openen</span>
                        <span>esc sluiten</span>
                    </div>
                    <span>⌘K om te zoeken</span>
                </div>
            </div>
        </div>
    );
}
