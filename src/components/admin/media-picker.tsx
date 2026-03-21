/**
 * Media Picker Modal
 * Browse, search, upload, and select images from the media library.
 * Returns { url, altText, id } on selection.
 */
"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";

interface MediaItem {
    id: string;
    url: string;
    filename: string;
    altText: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    createdAt: string;
}

interface MediaPickerProps {
    value?: string;
    onChange: (value: { url: string; altText: string; id: string } | null) => void;
    label?: string;
}

export default function MediaPicker({ value, onChange, label = "Uitgelichte afbeelding" }: MediaPickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                {label}
            </label>

            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Featured"
                        className="w-full h-36 object-cover rounded-lg border border-gray-700"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            onClick={() => setOpen(true)}
                            className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs font-medium hover:bg-gray-600"
                        >
                            Wijzigen
                        </button>
                        <button
                            onClick={() => onChange(null)}
                            className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                        >
                            Verwijder
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="w-full h-28 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-500 hover:border-amber-400/50 hover:text-gray-300 transition-colors"
                >
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs">Kies afbeelding</span>
                </button>
            )}

            {open && (
                <MediaPickerModal
                    onSelect={(item) => {
                        onChange({ url: item.url, altText: item.altText || "", id: item.id });
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}

/* ── Modal ─────────────────────────────────────────────── */
function MediaPickerModal({
    onSelect,
    onClose,
}: {
    onSelect: (item: MediaItem) => void;
    onClose: () => void;
}) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<MediaItem | null>(null);
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

    // Close on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    async function handleUpload(files: FileList | null) {
        if (!files?.length) return;
        setUploading(true);

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                await fetch("/api/admin/media", { method: "POST", body: formData });
            } catch {}
        }

        setUploading(false);
        loadMedia();
    }

    const filtered = search
        ? media.filter(m =>
            m.filename.toLowerCase().includes(search.toLowerCase()) ||
            (m.altText || "").toLowerCase().includes(search.toLowerCase())
        )
        : media;

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold">Media kiezen</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">✕</button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700/50">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Zoek op bestandsnaam..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
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
                        className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors shrink-0"
                    >
                        {uploading ? "Uploaden..." : "+ Upload"}
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-5">
                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-gray-400">
                            <div className="w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                            Laden...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            {search ? "Geen resultaten voor deze zoekopdracht." : "Nog geen media geüpload."}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                            {filtered.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelected(item)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                                        selected?.id === item.id
                                            ? "border-amber-400 ring-2 ring-amber-400/30"
                                            : "border-transparent hover:border-gray-500"
                                    }`}
                                >
                                    <img
                                        src={item.url}
                                        alt={item.altText || item.filename}
                                        className="w-full h-full object-cover"
                                    />
                                    {selected?.id === item.id && (
                                        <div className="absolute top-1 right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                            <span className="text-gray-900 text-xs font-bold">✓</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-[10px] text-white truncate">{item.filename}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-700">
                    <span className="text-xs text-gray-500">
                        {selected ? selected.filename : `${filtered.length} bestanden`}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            onClick={() => selected && onSelect(selected)}
                            disabled={!selected}
                            className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors"
                        >
                            Selecteren
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
