/**
 * Admin Leads — /admin/leads
 * CRM: Lead management with filters, status changes, detail panel, notes
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface Lead {
    id: string;
    naam: string;
    email: string;
    telefoon: string;
    postcode: string;
    city: string | null;
    dakkapelType: string;
    breedte: string;
    status: string;
    matchCount: number;
    acceptCount: number;
    extraNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

interface LeadNote {
    id: string;
    content: string;
    createdAt: string;
    author: { name: string } | null;
}

const statusLabels: Record<string, string> = {
    new: "Nieuw",
    matching: "Matching",
    available: "Beschikbaar",
    fulfilled: "Vervuld",
    expired: "Verlopen",
    cancelled: "Geannuleerd",
};

const statusColors: Record<string, string> = {
    new: "bg-yellow-900/80 text-yellow-300",
    matching: "bg-blue-900/80 text-blue-300",
    available: "bg-emerald-900/80 text-emerald-300",
    fulfilled: "bg-purple-900/80 text-purple-300",
    expired: "bg-gray-700 text-gray-400",
    cancelled: "bg-red-900/80 text-red-300",
};

const typeLabels: Record<string, string> = {
    prefab: "Prefab",
    traditioneel: "Traditioneel",
    weet_niet: "Weet niet",
};

export default function AdminLeadsPage() {
    const { success, error } = useToast();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [noteText, setNoteText] = useState("");
    const [notes, setNotes] = useState<LeadNote[]>([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 20;

    const loadLeads = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(perPage),
                sortBy: "createdAt",
                sortDir: "desc",
            });
            if (statusFilter) params.set("status", statusFilter);
            if (search) params.set("search", search);
            const res = await fetch(`/api/admin/leads?${params}`);
            if (res.ok) {
                const d = await res.json();
                setLeads(d.leads || []);
                setTotal(d.total || 0);
            }
        } catch {}
        setLoading(false);
    }, [page, statusFilter, search]);

    useEffect(() => { loadLeads(); }, [loadLeads]);

    async function loadNotes(leadId: string) {
        try {
            const res = await fetch(`/api/admin/leads/${leadId}/notes`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data.notes || []);
            }
        } catch { setNotes([]); }
    }

    async function addNote() {
        if (!selectedLead || !noteText.trim()) return;
        const res = await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: noteText }),
        });
        if (res.ok) {
            success("Notitie toegevoegd");
            setNoteText("");
            loadNotes(selectedLead.id);
        } else {
            error("Notitie toevoegen mislukt");
        }
    }

    async function updateStatus(leadId: string, newStatus: string) {
        const res = await fetch(`/api/admin/leads/${leadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            success(`Status gewijzigd naar ${statusLabels[newStatus]}`);
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            if (selectedLead?.id === leadId) {
                setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } else {
            error("Status wijzigen mislukt");
        }
    }

    function openLead(lead: Lead) {
        setSelectedLead(lead);
        loadNotes(lead.id);
    }

    // Filter leads
    const filteredLeads = leads.filter(l => {
        if (statusFilter && l.status !== statusFilter) return false;
        if (search) {
            const s = search.toLowerCase();
            return l.naam.toLowerCase().includes(s) ||
                l.email.toLowerCase().includes(s) ||
                l.postcode.toLowerCase().includes(s) ||
                (l.city || "").toLowerCase().includes(s);
        }
        return true;
    });

    // Stats
    const statCounts = leads.reduce((acc, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Leads" }]} />

            <div className="mb-5">
                <h1 className="text-2xl font-bold">Leads</h1>
                <p className="text-sm text-gray-400 mt-0.5">{leads.length} leads totaal</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
                {Object.entries(statusLabels).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setStatusFilter(statusFilter === key ? "" : key)}
                        className={`p-3 rounded-lg border text-center transition-colors ${
                            statusFilter === key
                                ? "border-amber-400/50 bg-gray-800"
                                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                        }`}
                    >
                        <div className="text-lg font-bold text-white">{statCounts[key] || 0}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Zoek op naam, email, postcode..."
                        className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 w-72 transition-colors"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Leads Table */}
                <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">
                            <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                            Laden...
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Geen leads gevonden.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-700">
                                        <th className="px-4 py-3">Naam</th>
                                        <th className="px-4 py-3">Postcode</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Matches</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Datum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredLeads.map(lead => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => openLead(lead)}
                                            className={`cursor-pointer transition-colors ${
                                                selectedLead?.id === lead.id
                                                    ? "bg-gray-700/50"
                                                    : "hover:bg-gray-750"
                                            }`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{lead.naam}</div>
                                                <div className="text-xs text-gray-500">{lead.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {lead.postcode}
                                                {lead.city && <span className="text-xs text-gray-500 ml-1">({lead.city})</span>}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                {typeLabels[lead.dakkapelType] || lead.dakkapelType}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                {lead.acceptCount}/{lead.matchCount}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                    statusColors[lead.status] || "bg-gray-700 text-gray-300"
                                                }`}>
                                                    {statusLabels[lead.status] || lead.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                {new Date(lead.createdAt).toLocaleDateString("nl-NL")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Lead Detail Panel */}
                {selectedLead && (
                    <div className="w-[380px] bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4 shrink-0 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">{selectedLead.naam}</h2>
                            <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-300">✕</button>
                        </div>

                        {/* Status dropdown */}
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Status</label>
                            <select
                                value={selectedLead.status}
                                onChange={e => updateStatus(selectedLead.id, e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none cursor-pointer"
                            >
                                {Object.entries(statusLabels).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Email</span>
                                <a href={`mailto:${selectedLead.email}`} className="text-amber-400 hover:underline">{selectedLead.email}</a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Telefoon</span>
                                <a href={`tel:${selectedLead.telefoon}`} className="text-amber-400 hover:underline">{selectedLead.telefoon}</a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Postcode</span>
                                <span>{selectedLead.postcode} {selectedLead.city && `(${selectedLead.city})`}</span>
                            </div>
                        </div>

                        {/* Project details */}
                        <div className="border-t border-gray-700 pt-3 space-y-2 text-sm">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project</h3>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Type</span>
                                <span>{typeLabels[selectedLead.dakkapelType] || selectedLead.dakkapelType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Breedte</span>
                                <span>{selectedLead.breedte}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Matches</span>
                                <span>{selectedLead.acceptCount} geaccepteerd / {selectedLead.matchCount} totaal</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Aangemeld</span>
                                <span>{new Date(selectedLead.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </div>
                        </div>

                        {selectedLead.extraNotes && (
                            <div className="border-t border-gray-700 pt-3">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Klant notitie</span>
                                <p className="text-sm bg-gray-700/50 rounded-lg p-3">{selectedLead.extraNotes}</p>
                            </div>
                        )}

                        {/* Notes Timeline */}
                        <div className="border-t border-gray-700 pt-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Notities ({notes.length})
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                                {notes.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">Nog geen notities.</p>
                                ) : (
                                    notes.map(note => (
                                        <div key={note.id} className="bg-gray-700/50 rounded-lg p-3">
                                            <p className="text-sm">{note.content}</p>
                                            <div className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                                                <span className="font-medium">{note.author?.name || "Admin"}</span>
                                                <span>•</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addNote()}
                                    placeholder="Notitie toevoegen..."
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                                />
                                <button
                                    onClick={addNote}
                                    disabled={!noteText.trim()}
                                    className="px-3 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
