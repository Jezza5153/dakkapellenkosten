/**
 * Media Library — /admin/media
 * Upload and manage images
 */
"use client";

import { useEffect, useState, useRef } from "react";

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
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState<MediaItem | null>(null);
    const [altText, setAltText] = useState("");
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

    async function handleUpload(files: FileList | null) {
        if (!files?.length) return;
        setUploading(true);

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                await fetch("/api/admin/media", {
                    method: "POST",
                    body: formData,
                });
            } catch {}
        }

        setUploading(false);
        loadMedia();
    }

    function selectMedia(item: MediaItem) {
        setSelected(item);
        setAltText(item.altText || "");
    }

    async function updateAltText() {
        if (!selected) return;
        await fetch(`/api/admin/media/${selected.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ altText }),
        });
        setMedia(prev => prev.map(m =>
            m.id === selected.id ? { ...m, altText } : m
        ));
    }

    async function deleteMedia(id: string) {
        if (!confirm("Media verwijderen?")) return;
        await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
        setSelected(null);
        loadMedia();
    }

    function copyUrl(url: string) {
        navigator.clipboard.writeText(url);
    }

    function formatSize(bytes: number | null) {
        if (!bytes) return "—";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Media</h1>
                    <p className="text-sm text-gray-400 mt-1">{media.length} bestanden</p>
                </div>
                <div>
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
                        {uploading ? "Uploaden..." : "+ Upload"}
                    </button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center text-gray-400 py-12">Laden...</div>
                    ) : media.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            Nog geen media geüpload.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {media.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => selectMedia(item)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                                        selected?.id === item.id
                                            ? "border-amber-400"
                                            : "border-transparent hover:border-gray-600"
                                    }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.altText || item.filename}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[10px] text-white truncate">{item.filename}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div className="w-72 bg-gray-800 rounded-xl border border-gray-700 p-4 space-y-4 shrink-0">
                        <img
                            src={selected.url}
                            alt={selected.altText || ""}
                            className="w-full rounded-lg"
                        />

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-xs text-gray-400 block mb-1">Bestandsnaam</span>
                                <span className="text-gray-300">{selected.filename}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 block mb-1">Grootte</span>
                                <span className="text-gray-300">{formatSize(selected.sizeBytes)}</span>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 block mb-1">Alt tekst</span>
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={e => setAltText(e.target.value)}
                                    onBlur={updateAltText}
                                    placeholder="Beschrijf de afbeelding..."
                                    className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white outline-none focus:border-amber-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => copyUrl(selected.url)}
                                className="flex-1 px-3 py-2 bg-gray-700 text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-600"
                            >
                                URL kopiëren
                            </button>
                            <button
                                onClick={() => deleteMedia(selected.id)}
                                className="px-3 py-2 text-red-400 text-xs hover:text-red-300"
                            >
                                Verwijder
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
