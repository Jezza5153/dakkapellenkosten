/**
 * TipTap Rich Text Editor — Reusable Component
 * Used in article and page editors
 */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback, useEffect } from "react";

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

function ToolbarButton({
    onClick,
    active,
    children,
    title,
}: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                active
                    ? "bg-gray-600 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
        >
            {children}
        </button>
    );
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkSearch, setLinkSearch] = useState("");
    const [linkResults, setLinkResults] = useState<Array<{ id: string; title: string; slug: string; type: string }>>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-blue-400 underline" },
            }),
            Image.configure({
                HTMLAttributes: { class: "rounded-lg max-w-full" },
            }),
            Placeholder.configure({
                placeholder: placeholder || "Begin met schrijven...",
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-sm max-w-none min-h-[400px] px-4 py-3 outline-none",
            },
        },
    });

    // Search for internal links
    const searchContent = useCallback(async (query: string) => {
        if (query.length < 2) {
            setLinkResults([]);
            return;
        }
        try {
            const res = await fetch(`/api/admin/content-search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setLinkResults(data.results || []);
        } catch {
            setLinkResults([]);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => searchContent(linkSearch), 300);
        return () => clearTimeout(timer);
    }, [linkSearch, searchContent]);

    if (!editor) return null;

    function handleAddLink() {
        if (linkUrl) {
            editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
        setShowLinkModal(false);
        setLinkUrl("");
        setLinkSearch("");
        setLinkResults([]);
    }

    function selectInternalLink(slug: string) {
        setLinkUrl(slug);
        editor?.chain().focus().extendMarkRange("link").setLink({ href: slug }).run();
        setShowLinkModal(false);
        setLinkUrl("");
        setLinkSearch("");
        setLinkResults([]);
    }

    function handleAddImage() {
        if (imageUrl) {
            editor?.chain().focus().setImage({ src: imageUrl }).run();
        }
        setShowImageModal(false);
        setImageUrl("");
    }

    return (
        <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-600 bg-gray-750">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    title="Vet"
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    title="Cursief"
                >
                    <em>I</em>
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-600 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                    title="H2"
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                    title="H3"
                >
                    H3
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    active={editor.isActive("heading", { level: 4 })}
                    title="H4"
                >
                    H4
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-600 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    title="Opsomming"
                >
                    • List
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    title="Genummerde lijst"
                >
                    1. List
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                    title="Citaat"
                >
                    " Quote
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-600 mx-1" />

                <ToolbarButton
                    onClick={() => setShowLinkModal(true)}
                    active={editor.isActive("link")}
                    title="Link invoegen"
                >
                    🔗 Link
                </ToolbarButton>
                {editor.isActive("link") && (
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        title="Link verwijderen"
                    >
                        ✕
                    </ToolbarButton>
                )}
                <ToolbarButton
                    onClick={() => setShowImageModal(true)}
                    title="Afbeelding invoegen"
                >
                    🖼 Afbeelding
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-600 mx-1" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Ongedaan maken"
                >
                    ↶
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Opnieuw"
                >
                    ↷
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 w-full max-w-md">
                        <h3 className="text-sm font-semibold mb-3">Link invoegen</h3>

                        {/* External URL */}
                        <div className="mb-3">
                            <label className="text-xs text-gray-400 mb-1 block">URL</label>
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                            />
                        </div>

                        {/* Internal link search */}
                        <div className="mb-3">
                            <label className="text-xs text-gray-400 mb-1 block">Of zoek intern artikel/pagina</label>
                            <input
                                type="text"
                                value={linkSearch}
                                onChange={e => setLinkSearch(e.target.value)}
                                placeholder="Zoek op titel..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                            />
                            {linkResults.length > 0 && (
                                <div className="mt-1 max-h-40 overflow-y-auto border border-gray-600 rounded-lg bg-gray-750">
                                    {linkResults.map(r => (
                                        <button
                                            key={r.id}
                                            onClick={() => selectInternalLink(r.slug)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-600 text-gray-300 uppercase">
                                                {r.type === "article" ? "Artikel" : "Pagina"}
                                            </span>
                                            <span className="truncate">{r.title}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleAddLink}
                                disabled={!linkUrl}
                                className="flex-1 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400 disabled:opacity-50"
                            >
                                Invoegen
                            </button>
                            <button
                                onClick={() => { setShowLinkModal(false); setLinkUrl(""); setLinkSearch(""); setLinkResults([]); }}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                            >
                                Annuleren
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 w-full max-w-md">
                        <h3 className="text-sm font-semibold mb-3">Afbeelding invoegen</h3>
                        <div className="mb-3">
                            <label className="text-xs text-gray-400 mb-1 block">Afbeelding URL</label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddImage}
                                disabled={!imageUrl}
                                className="flex-1 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400 disabled:opacity-50"
                            >
                                Invoegen
                            </button>
                            <button
                                onClick={() => { setShowImageModal(false); setImageUrl(""); }}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                            >
                                Annuleren
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
