/**
 * Admin Leads — /admin/leads
 * CRM: Lead management with filters, detail view, and notes
 */
"use client";

import { useEffect, useState } from "react";

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
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [noteText, setNoteText] = useState("");
    const [notes, setNotes] = useState<Array<{ id: string; content: string; createdAt: string; author: { name: string } | null }>>([]);

    useEffect(() => {
        fetch("/api/admin/dashboard")
            .then(r => r.json())
            .then(d => {
                setLeads(d.leads || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

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
        await fetch(`/api/admin/leads/${selectedLead.id}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: noteText }),
        });
        setNoteText("");
        loadNotes(selectedLead.id);
    }

    function openLead(lead: Lead) {
        setSelectedLead(lead);
        loadNotes(lead.id);
    }

    const statusLabels: Record<string, string> = {
        new: "Nieuw", matching: "Matching", available: "Beschikbaar",
        fulfilled: "Vervuld", expired: "Verlopen", cancelled: "Geannuleerd",
    };

    const statusColors: Record<string, string> = {
        new: "bg-yellow-900 text-yellow-300",
        available: "bg-emerald-900 text-emerald-300",
        fulfilled: "bg-blue-900 text-blue-300",
        expired: "bg-gray-700 text-gray-300",
    };

    const typeLabels: Record<string, string> = {
        prefab: "Prefab", traditioneel: "Traditioneel", weet_niet: "Weet niet",
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Leads</h1>
                <p className="text-sm text-gray-400 mt-1">{leads.length} leads totaal</p>
            </div>

            <div className="flex gap-6">
                {/* Leads Table */}
                <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Laden...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-700">
                                        <th className="px-4 py-3">Naam</th>
                                        <th className="px-4 py-3">Postcode</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Datum</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {leads.map(lead => (
                                        <tr
                                            key={lead.id}
                                            onClick={() => openLead(lead)}
                                            className={`cursor-pointer transition-colors ${
                                                selectedLead?.id === lead.id
                                                    ? "bg-gray-700"
                                                    : "hover:bg-gray-750"
                                            }`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{lead.naam}</div>
                                                <div className="text-xs text-gray-500">{lead.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{lead.postcode}</td>
                                            <td className="px-4 py-3 text-gray-400">{typeLabels[lead.dakkapelType] || lead.dakkapelType}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[lead.status] || "bg-gray-700 text-gray-300"}`}>
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
                    <div className="w-96 bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg">{selectedLead.naam}</h2>
                            <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-300">✕</button>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Email</span>
                                <span>{selectedLead.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Telefoon</span>
                                <span>{selectedLead.telefoon}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Postcode</span>
                                <span>{selectedLead.postcode}</span>
                            </div>
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
                                <span>{selectedLead.matchCount} / {selectedLead.acceptCount} geaccepteerd</span>
                            </div>
                            {selectedLead.extraNotes && (
                                <div className="pt-2 border-t border-gray-700">
                                    <span className="text-gray-400 text-xs block mb-1">Klant notitie</span>
                                    <p className="text-sm">{selectedLead.extraNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="border-t border-gray-700 pt-3">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notities</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                                {notes.length === 0 ? (
                                    <p className="text-xs text-gray-500">Nog geen notities.</p>
                                ) : (
                                    notes.map(note => (
                                        <div key={note.id} className="bg-gray-750 rounded-lg p-2.5">
                                            <p className="text-sm">{note.content}</p>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                {note.author?.name || "Admin"} • {new Date(note.createdAt).toLocaleDateString("nl-NL")}
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
                                    className="px-3 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400 disabled:opacity-50"
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
