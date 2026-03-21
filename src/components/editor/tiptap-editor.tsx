/**
 * TipTap Rich Text Editor — Premium WordPress-quality editor
 * SVG toolbar icons, floating format bar, slash commands, media integration
 */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useState, useCallback, useEffect, useRef } from "react";

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

/* ─── SVG Icons ────────────────────────────────── */

const icons = {
    bold: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
        </svg>
    ),
    italic: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
        </svg>
    ),
    underline: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" /><line x1="4" y1="21" x2="20" y2="21" />
        </svg>
    ),
    strikethrough: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4H9a3 3 0 000 6h6a3 3 0 010 6H8" /><line x1="4" y1="12" x2="20" y2="12" />
        </svg>
    ),
    h2: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h8M4 6v12M12 6v12" /><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
        </svg>
    ),
    h3: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h8M4 6v12M12 6v12" /><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 01-2 2m2 0a2 2 0 01-2 2c-1.7 0-3.5-1-3.5-1" />
        </svg>
    ),
    bulletList: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="5" cy="6" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="18" r="1" fill="currentColor" />
        </svg>
    ),
    orderedList: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
            <text x="3" y="7.5" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text>
            <text x="3" y="13.5" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text>
            <text x="3" y="19.5" fontSize="7" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text>
        </svg>
    ),
    blockquote: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
        </svg>
    ),
    link: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
    ),
    unlink: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.84 12.25l1.72-1.71a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M5.16 11.75l-1.72 1.71a5 5 0 007.07 7.07l1.72-1.71" />
            <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    ),
    image: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    horizontalRule: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
    ),
    code: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    undo: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
    ),
    redo: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
    ),
    alignLeft: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
        </svg>
    ),
    alignCenter: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    ),
};

/* ─── Toolbar Button ──────────────────────────── */

function Btn({
    onClick,
    active,
    children,
    title,
    disabled,
}: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`relative p-1.5 rounded-md transition-all duration-150 ${
                active
                    ? "bg-amber-500/20 text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.3)]"
                    : disabled
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-gray-400 hover:bg-gray-700/60 hover:text-gray-200"
            }`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-6 bg-gray-700 mx-0.5 shrink-0" />;
}

/* ─── Slash Command Menu ─────────────────────── */

const slashCommands = [
    { label: "Kop 2", icon: icons.h2, cmd: "heading2", desc: "Grote sectie-kop" },
    { label: "Kop 3", icon: icons.h3, cmd: "heading3", desc: "Sub-kop" },
    { label: "Opsomming", icon: icons.bulletList, cmd: "bulletList", desc: "Ongenummerde lijst" },
    { label: "Genummerde lijst", icon: icons.orderedList, cmd: "orderedList", desc: "Genummerde lijst" },
    { label: "Citaat", icon: icons.blockquote, cmd: "blockquote", desc: "Opvallend citaat" },
    { label: "Scheidingslijn", icon: icons.horizontalRule, cmd: "horizontalRule", desc: "Horizontale lijn" },
    { label: "Afbeelding", icon: icons.image, cmd: "image", desc: "Afbeelding invoegen" },
    { label: "Code blok", icon: icons.code, cmd: "codeBlock", desc: "Code fragment" },
];

/* ─── Main Editor ────────────────────────────── */

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkSearch, setLinkSearch] = useState("");
    const [linkResults, setLinkResults] = useState<Array<{ id: string; title: string; slug: string; type: string }>>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    // Slash command state
    const [showSlash, setShowSlash] = useState(false);
    const [slashFilter, setSlashFilter] = useState("");
    const [slashIndex, setSlashIndex] = useState(0);
    const slashRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-amber-400 underline decoration-amber-400/40 hover:decoration-amber-400 transition-colors" },
            }),
            Image.configure({
                HTMLAttributes: { class: "rounded-lg max-w-full my-4" },
            }),
            Placeholder.configure({
                placeholder: placeholder || "Begin met schrijven, of typ / voor opties...",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
        ],
        content,
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());

            // Slash command detection
            const { from } = ed.state.selection;
            const textBefore = ed.state.doc.textBetween(Math.max(0, from - 1), from);
            if (textBefore === "/") {
                setShowSlash(true);
                setSlashFilter("");
                setSlashIndex(0);
            }
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-base max-w-none min-h-[500px] px-5 py-4 outline-none focus:outline-none " +
                    "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-white " +
                    "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-gray-200 " +
                    "[&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:my-2 " +
                    "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 " +
                    "[&_li]:text-gray-300 [&_li]:my-0.5 " +
                    "[&_blockquote]:border-l-3 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400 " +
                    "[&_a]:text-amber-400 [&_a]:underline " +
                    "[&_code]:bg-gray-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-amber-300 " +
                    "[&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto " +
                    "[&_hr]:border-gray-600 [&_hr]:my-6 " +
                    "[&_img]:rounded-lg [&_img]:my-4",
            },
            handleKeyDown: (view, event) => {
                if (showSlash) {
                    const filtered = slashCommands.filter(c =>
                        c.label.toLowerCase().includes(slashFilter.toLowerCase())
                    );
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        setSlashIndex(i => Math.min(i + 1, filtered.length - 1));
                        return true;
                    }
                    if (event.key === "ArrowUp") {
                        event.preventDefault();
                        setSlashIndex(i => Math.max(i - 1, 0));
                        return true;
                    }
                    if (event.key === "Enter") {
                        event.preventDefault();
                        if (filtered[slashIndex]) {
                            executeSlashCommand(filtered[slashIndex].cmd);
                        }
                        setShowSlash(false);
                        return true;
                    }
                    if (event.key === "Escape") {
                        setShowSlash(false);
                        return true;
                    }
                    // Update filter
                    if (event.key.length === 1) {
                        setSlashFilter(f => f + event.key);
                    }
                    if (event.key === "Backspace") {
                        if (slashFilter.length === 0) {
                            setShowSlash(false);
                        } else {
                            setSlashFilter(f => f.slice(0, -1));
                        }
                    }
                }
                return false;
            },
        },
    });

    function executeSlashCommand(cmd: string) {
        if (!editor) return;

        // Delete the "/" character
        const { from } = editor.state.selection;
        editor.chain().focus()
            .deleteRange({ from: from - 1 - slashFilter.length, to: from })
            .run();

        switch (cmd) {
            case "heading2": editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
            case "heading3": editor.chain().focus().toggleHeading({ level: 3 }).run(); break;
            case "bulletList": editor.chain().focus().toggleBulletList().run(); break;
            case "orderedList": editor.chain().focus().toggleOrderedList().run(); break;
            case "blockquote": editor.chain().focus().toggleBlockquote().run(); break;
            case "horizontalRule": editor.chain().focus().setHorizontalRule().run(); break;
            case "codeBlock": editor.chain().focus().toggleCodeBlock().run(); break;
            case "image": setShowImageModal(true); break;
        }
    }

    // Search for internal links
    const searchContent = useCallback(async (query: string) => {
        if (query.length < 2) { setLinkResults([]); return; }
        try {
            const res = await fetch(`/api/admin/content-search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setLinkResults(data.results || []);
        } catch { setLinkResults([]); }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => searchContent(linkSearch), 300);
        return () => clearTimeout(timer);
    }, [linkSearch, searchContent]);

    // Close slash menu on click outside
    useEffect(() => {
        if (!showSlash) return;
        const handler = () => setShowSlash(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [showSlash]);

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

    const filteredSlash = slashCommands.filter(c =>
        c.label.toLowerCase().includes(slashFilter.toLowerCase())
    );

    return (
        <div className="border border-gray-600 rounded-xl overflow-hidden bg-gray-800 shadow-lg">
            {/* ── Toolbar ────────────────────────────── */}
            <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-700 bg-gray-800/95 backdrop-blur-sm">
                {/* Text formatting */}
                <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Vet (⌘B)">
                    {icons.bold}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Cursief (⌘I)">
                    {icons.italic}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Onderstreept (⌘U)">
                    {icons.underline}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Doorhalen">
                    {icons.strikethrough}
                </Btn>

                <Divider />

                {/* Headings */}
                <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Kop 2">
                    {icons.h2}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Kop 3">
                    {icons.h3}
                </Btn>

                <Divider />

                {/* Lists & blocks */}
                <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Opsomming">
                    {icons.bulletList}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Genummerde lijst">
                    {icons.orderedList}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citaat">
                    {icons.blockquote}
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code blok">
                    {icons.code}
                </Btn>
                <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Scheidingslijn">
                    {icons.horizontalRule}
                </Btn>

                <Divider />

                {/* Alignment */}
                <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Links uitlijnen">
                    {icons.alignLeft}
                </Btn>
                <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Centreren">
                    {icons.alignCenter}
                </Btn>

                <Divider />

                {/* Media & links */}
                <Btn onClick={() => setShowLinkModal(true)} active={editor.isActive("link")} title="Link invoegen (⌘K)">
                    {icons.link}
                </Btn>
                {editor.isActive("link") && (
                    <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Link verwijderen">
                        {icons.unlink}
                    </Btn>
                )}
                <Btn onClick={() => setShowImageModal(true)} title="Afbeelding invoegen">
                    {icons.image}
                </Btn>

                <div className="flex-1" />

                {/* Undo/Redo */}
                <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Ongedaan maken (⌘Z)">
                    {icons.undo}
                </Btn>
                <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Opnieuw (⌘⇧Z)">
                    {icons.redo}
                </Btn>
            </div>



            {/* ── Editor Content Area ───────────────── */}
            <div className="relative">
                <EditorContent editor={editor} />

                {/* Slash Command Menu */}
                {showSlash && filteredSlash.length > 0 && (
                    <div
                        ref={slashRef}
                        className="absolute left-4 z-20 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
                        style={{ top: "2rem" }}
                    >
                        <div className="px-3 py-2 border-b border-gray-700">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Blok invoegen</span>
                        </div>
                        {filteredSlash.map((cmd, i) => (
                            <button
                                key={cmd.cmd}
                                onClick={() => { executeSlashCommand(cmd.cmd); setShowSlash(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                                    i === slashIndex ? "bg-amber-500/10 text-amber-400" : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                <span className="text-gray-500 shrink-0">{cmd.icon}</span>
                                <div>
                                    <div className="text-sm font-medium">{cmd.label}</div>
                                    <div className="text-[10px] text-gray-500">{cmd.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Link Modal ─────────────────────────── */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => { setShowLinkModal(false); setLinkUrl(""); setLinkSearch(""); setLinkResults([]); }}>
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <span className="text-amber-400">{icons.link}</span> Link invoegen
                        </h3>

                        <div className="mb-3">
                            <label className="text-xs text-gray-400 mb-1 block">URL</label>
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleAddLink()}
                                placeholder="https://..."
                                autoFocus
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400 transition-colors"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="text-xs text-gray-400 mb-1 block">Of zoek intern artikel/pagina</label>
                            <input
                                type="text"
                                value={linkSearch}
                                onChange={e => setLinkSearch(e.target.value)}
                                placeholder="Zoek op titel..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400 transition-colors"
                            />
                            {linkResults.length > 0 && (
                                <div className="mt-1 max-h-40 overflow-y-auto border border-gray-600 rounded-lg bg-gray-750">
                                    {linkResults.map(r => (
                                        <button
                                            key={r.id}
                                            onClick={() => selectInternalLink(r.slug)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 transition-colors"
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
                                className="flex-1 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors"
                            >
                                Invoegen
                            </button>
                            <button
                                onClick={() => { setShowLinkModal(false); setLinkUrl(""); setLinkSearch(""); setLinkResults([]); }}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                            >
                                Annuleren
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Image Modal ────────────────────────── */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => { setShowImageModal(false); setImageUrl(""); }}>
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <span className="text-amber-400">{icons.image}</span> Afbeelding invoegen
                        </h3>
                        <div className="mb-3">
                            <label className="text-xs text-gray-400 mb-1 block">Afbeelding URL</label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleAddImage()}
                                placeholder="https://..."
                                autoFocus
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white outline-none focus:border-amber-400 transition-colors"
                            />
                        </div>
                        {imageUrl && (
                            <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
                                <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover" onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddImage}
                                disabled={!imageUrl}
                                className="flex-1 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400 disabled:opacity-50 transition-colors"
                            >
                                Invoegen
                            </button>
                            <button
                                onClick={() => { setShowImageModal(false); setImageUrl(""); }}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors"
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
