/**
 * Admin Layout — WordPress-quality Sidebar + Admin Bar
 * SVG icons, collapsible sidebar, admin top bar with user menu
 */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/components/admin/toast";
import { BreadcrumbProvider, BreadcrumbBar, useBreadcrumbs } from "@/components/admin/breadcrumbs";
import CommandPalette from "@/components/admin/command-palette";

/* ─── SVG Icons ─────────────────────────────── */
const icons = {
    dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    articles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    pages: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    media: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    leads: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    companies: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="18" x2="15" y2="18"/></svg>,
    crm: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    seoCenter: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    seoHealth: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    redirects: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></svg>,
    auditLog: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
    trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
    settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    collapse: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>,
    expand: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>,
    menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
};

/* ── Navigation items ─────────────────────────── */
const navGroups = [
    {
        items: [
            { href: "/admin", label: "Dashboard", icon: icons.dashboard },
        ],
    },
    {
        label: "Content",
        items: [
            { href: "/admin/articles", label: "Artikelen", icon: icons.articles },
            { href: "/admin/pages", label: "Pagina's", icon: icons.pages },
            { href: "/admin/media", label: "Media", icon: icons.media },
        ],
    },
    {
        label: "CRM",
        items: [
            { href: "/admin/leads", label: "Leads", icon: icons.leads },
            { href: "/admin/companies", label: "Bedrijven", icon: icons.companies },
            { href: "/admin/crm", label: "CRM Intelligence", icon: icons.crm },
        ],
    },
    {
        label: "SEO",
        items: [
            { href: "/admin/seo", label: "SEO Command Center", icon: icons.seoCenter },
            { href: "/admin/seo-health", label: "SEO Health", icon: icons.seoHealth },
            { href: "/admin/redirects", label: "Redirects", icon: icons.redirects },
        ],
    },
    {
        label: "Systeem",
        items: [
            { href: "/admin/audit-log", label: "Audit Log", icon: icons.auditLog },
            { href: "/admin/trash", label: "Prullenbak", icon: icons.trash },
            { href: "/admin/settings", label: "Instellingen", icon: icons.settings },
        ],
    },
];

const allNavItems = navGroups.flatMap(g => g.items);

/* ── Inner layout ─────────────────────────────── */
function AdminInner({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { crumbs } = useBreadcrumbs();

    // Load collapsed state
    useEffect(() => {
        const saved = localStorage.getItem("admin-sidebar-collapsed");
        if (saved === "true") setCollapsed(true);
    }, []);

    // Close sidebar on route change
    useEffect(() => { setSidebarOpen(false); setUserMenuOpen(false); }, [pathname]);

    // Close user menu on outside click
    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = () => setUserMenuOpen(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [userMenuOpen]);

    // Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setSidebarOpen(false); setUserMenuOpen(false); }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    function toggleCollapse() {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem("admin-sidebar-collapsed", String(next));
    }

    function isActive(href: string) {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    }

    const sidebarW = collapsed ? "w-16" : "w-60";
    const mainML = collapsed ? "lg:ml-16" : "lg:ml-60";

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* ── Admin Top Bar ────────────────────── */}
            <div className="fixed top-0 left-0 right-0 h-9 bg-gray-950 border-b border-gray-800 z-[60] flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                        {icons.globe}
                        <span className="hidden sm:inline">DakkapellenKosten.nl</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-800"
                    >
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="text-amber-400 text-[10px] font-bold">J</span>
                        </div>
                        <span className="hidden sm:inline">Jeremy</span>
                    </button>

                    {/* User menu dropdown */}
                    {userMenuOpen && (
                        <div className="absolute right-4 top-9 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden min-w-[180px]">
                            <div className="px-4 py-3 border-b border-gray-700">
                                <div className="text-sm font-medium text-white">Jeremy</div>
                                <div className="text-[10px] text-gray-500">jeremy@dakkapellenkosten.nl</div>
                            </div>
                            <div className="py-1">
                                <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                                    {icons.settings} Instellingen
                                </Link>
                                <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                                    {icons.globe} Website bekijken
                                </Link>
                                <button
                                    onClick={() => { window.location.href = "/api/auth/signout"; }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                                >
                                    {icons.logout} Uitloggen
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────── */}
            <aside
                className={`fixed top-9 left-0 h-[calc(100vh-36px)] ${sidebarW} bg-gray-800 border-r border-gray-700 flex flex-col z-50 transition-all duration-200 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0 !w-60" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className={`${collapsed ? "px-2 py-3" : "px-4 py-3"} border-b border-gray-700 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
                    <Link href="/admin" className="flex items-center gap-2">
                        {collapsed && !sidebarOpen ? (
                            <span className="text-lg font-bold text-amber-400">D</span>
                        ) : (
                            <>
                                <span className="text-lg font-bold">DK<span className="text-amber-400">.nl</span></span>
                                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[9px] font-bold rounded">CMS</span>
                            </>
                        )}
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-1">✕</button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-2 px-2 overflow-y-auto">
                    {navGroups.map((group, gi) => (
                        <div key={gi} className={gi > 0 ? "mt-3" : ""}>
                            {group.label && !collapsed && (
                                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    {group.label}
                                </div>
                            )}
                            {group.label && collapsed && !sidebarOpen && (
                                <div className="w-8 h-px bg-gray-700 mx-auto my-2" />
                            )}
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed && !sidebarOpen ? item.label : undefined}
                                            className={`flex items-center gap-3 ${collapsed && !sidebarOpen ? "justify-center px-2" : "px-3"} py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                                                active
                                                    ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.15)]"
                                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                                            }`}
                                        >
                                            <span className={`shrink-0 ${active ? "text-amber-400" : "text-gray-500"}`}>
                                                {item.icon}
                                            </span>
                                            {(!collapsed || sidebarOpen) && <span className="truncate">{item.label}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className="hidden lg:block px-2 py-2 border-t border-gray-700">
                    <button
                        onClick={toggleCollapse}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-700/50"
                        title={collapsed ? "Sidebar uitklappen" : "Sidebar inklappen"}
                    >
                        {collapsed ? icons.expand : icons.collapse}
                        {!collapsed && <span>Inklappen</span>}
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────── */}
            <div className={`${mainML} pt-9 min-h-screen flex flex-col transition-all duration-200`}>
                {/* Sticky Header */}
                <header className="sticky top-9 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
                    <div className="flex items-center gap-3 px-4 lg:px-6 h-12">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white p-1.5 -ml-1"
                        >
                            {icons.menu}
                        </button>

                        <div className="flex-1 min-w-0">
                            {crumbs.length > 0 ? (
                                <BreadcrumbBar crumbs={crumbs} />
                            ) : (
                                <span className="text-sm text-gray-400">
                                    {allNavItems.find(item =>
                                        item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
                                    )?.label || "Admin"}
                                </span>
                            )}
                        </div>

                        {/* Search shortcut hint */}
                        <button
                            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-500 hover:border-gray-600 hover:text-gray-400 transition-colors"
                        >
                            {icons.search}
                            <span>Zoeken...</span>
                            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] font-mono">⌘K</kbd>
                        </button>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>
            <CommandPalette />
        </div>
    );
}

/* ── Layout ────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <ToastProvider>
                <AdminInner>{children}</AdminInner>
            </ToastProvider>
        </BreadcrumbProvider>
    );
}
