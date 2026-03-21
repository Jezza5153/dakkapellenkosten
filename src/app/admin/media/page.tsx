/**
 * Media Library — /admin/media
 * Drag/drop upload, search, grid view, detail panel, bulk management
 */
"use client";

import { useEffect, useState, useRef, useCallback, type DragEvent } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";
import ConfirmModal from "@/components/admin/confirm-modal";

interface MediaItem {
    id: string;
    url: string;
    filename: string;
    altText: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    createdAt: string;
}

export default function MediaLibraryPage() {
    const { success, error } = useToast();
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [altText, setAltText] = useState("");
    const [search, setSearch] = useState("");
    const [dragging, setDragging] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function loadMedia() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/media");
            if (res.ok) {
                const data = await res.json();
                setMedia(data.media || []);
            }
        } catch {}
        setLoading(false);
    }

    useEffect(() => { loadMedia(); }, []);

    async function handleUpload(files: FileList | File[] | null) {
        if (!files || !files.length) return;
        const fileArray = Array.from(files);
        setUploading(true);
        setUploadProgress(0);

        let completed = 0;
        for (const file of fileArray) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                await fetch("/api/admin/media", { method: "POST", body: formData });
                completed++;
                setUploadProgress(Math.round((completed / fileArray.length) * 100));
            } catch {}
        }

        setUploading(false);
        setUploadProgress(0);
        success(`${completed} bestand(en) geüpload ✓`);
        loadMedia();
    }

    function selectMedia(item: MediaItem) {
        setSelected(item);
        setAltText(item.altText || "");
    }

    async function updateAltText() {
        if (!selected) return;
        try {
            await fetch(`/api/admin/media/${selected.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ altText }),
            });
            setMedia(prev => prev.map(m =>
                m.id === selected.id ? { ...m, altText } : m
            ));
            success("Alt tekst bijgewerkt");
        } catch {
            error("Bijwerken mislukt");
        }
    }

    async function deleteMedia(id: string) {
        try {
            await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
            setSelected(null);
            setDeleteConfirm(null);
            success("Media verwijderd");
            loadMedia();
        } catch {
            error("Verwijderen mislukt");
        }
    }

    function copyUrl(url: string) {
        navigator.clipboard.writeText(url);
        success("URL gekopieerd");
    }

    function formatSize(bytes: number | null) {
        if (!bytes) return "—";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // Drag & drop handlers
    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const files = e.dataTransfer.files;
        if (files.length) handleUpload(files);
    }, []);

    // Filter media
    const filtered = search
        ? media.filter(m =>
            m.filename.toLowerCase().includes(search.toLowerCase()) ||
            (m.altText || "").toLowerCase().includes(search.toLowerCase())
        )
        : media;

    return (
        <div
            className="p-4 lg:p-6"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Breadcrumbs items={[{ label: "Media" }]} />

            {/* Drag overlay */}
            {dragging && (
                <div className="fixed inset-0 bg-amber-500/10 border-4 border-dashed border-amber-400 z-50 flex items-center justify-center rounded-xl pointer-events-none">
                    <div className="text-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400 mx-auto mb-3"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="text-lg font-semibold text-amber-400">Laat bestanden los om te uploaden</span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-2xl font-bold">Media</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{media.length} bestanden</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Zoek op naam..."
                            className="pl-9 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-amber-400 w-48 transition-colors"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => handleUpload(e.target.files)}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2.5 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
                    >
                        {uploading ? `Uploaden ${uploadProgress}%` : "+ Upload"}
                    </button>
                </div>
            </div>

            {/* Upload progress bar */}
            {uploading && (
                <div className="mb-4 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            )}

            <div className="flex gap-6">
                {/* Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center text-gray-400 py-12">
                            <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                            Laden...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 mx-auto mb-3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <p className="text-gray-400 mb-1">
                                {search ? "Geen resultaten." : "Nog geen media geüpload."}
                            </p>
                            {!search && (
                                <p className="text-sm text-gray-500">Sleep bestanden hierheen of klik op &ldquo;+ Upload&rdquo;</p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                            {filtered.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => selectMedia(item)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                                        selected?.id === item.id
                                            ? "border-amber-400 ring-2 ring-amber-400/30"
                                            : "border-transparent hover:border-gray-600"
                                    }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.altText || item.filename}
                                        className="w-full h-full object-cover"
                                    />
                                    {!item.altText && (
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-500/80 rounded-full flex items-center justify-center">
                                            <span className="text-[8px] font-bold text-gray-900">!</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[10px] text-white truncate">{item.filename}</div>
                                        <div className="text-[8px] text-gray-300">{formatSize(item.sizeBytes)}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="w-72 bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4 shrink-0 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Details</h3>
                            <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-sm">✕</button>
                        </div>

                        <img
                            src={selected.url}
                            alt={selected.altText || ""}
                            className="w-full rounded-lg"
                        />

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-xs text-gray-500 block mb-0.5">Bestandsnaam</span>
                                <span className="text-gray-300 text-xs break-all">{selected.filename}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-xs text-gray-500 block mb-0.5">Grootte</span>
                                    <span className="text-gray-300 text-xs">{formatSize(selected.sizeBytes)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block mb-0.5">Type</span>
                                    <span className="text-gray-300 text-xs">{selected.mimeType || "—"}</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-0.5">Geüpload</span>
                                <span className="text-gray-300 text-xs">
                                    {new Date(selected.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                                </span>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">
                                    Alt tekst
                                    {!selected.altText && <span className="text-yellow-400 ml-1">⚠ Ontbreekt</span>}
                                </label>
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={e => setAltText(e.target.value)}
                                    onBlur={updateAltText}
                                    onKeyDown={e => e.key === "Enter" && updateAltText()}
                                    placeholder="Beschrijf de afbeelding..."
                                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white outline-none focus:border-amber-400"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">URL</label>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        value={selected.url}
                                        readOnly
                                        className="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-[10px] text-gray-400 outline-none"
                                    />
                                    <button
                                        onClick={() => copyUrl(selected.url)}
                                        className="px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-[10px] text-gray-300 hover:bg-gray-600 transition-colors shrink-0"
                                        title="Kopieer URL"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-700">
                            <button
                                onClick={() => setDeleteConfirm(selected.id)}
                                className="w-full px-3 py-2 text-red-400 text-xs hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                                Verwijderen
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmModal
                open={!!deleteConfirm}
                title="Media verwijderen"
                message="Dit bestand wordt permanent verwijderd. Dit kan niet ongedaan worden gemaakt."
                confirmLabel="Verwijderen"
                variant="danger"
                onConfirm={() => deleteConfirm && deleteMedia(deleteConfirm)}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
}
