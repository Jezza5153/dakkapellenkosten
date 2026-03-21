/**
 * Settings Page — /admin/settings
 * Key-value admin settings with grouped sections
 */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { useToast } from "@/components/admin/toast";

interface SettingsGroup {
    label: string;
    icon: string;
    fields: Array<{
        key: string;
        label: string;
        type: "text" | "number" | "textarea" | "toggle";
        placeholder?: string;
        hint?: string;
    }>;
}

const GROUPS: SettingsGroup[] = [
    {
        label: "Site", icon: "🌐",
        fields: [
            { key: "site.name", label: "Site naam", type: "text", placeholder: "DakkapellenKosten.nl" },
            { key: "site.url", label: "Site URL", type: "text", placeholder: "https://dakkapellenkosten.nl" },
            { key: "site.language", label: "Taal", type: "text", placeholder: "nl" },
        ],
    },
    {
        label: "SEO", icon: "🔍",
        fields: [
            { key: "seo.defaultOgImage", label: "Default OG Image URL", type: "text" },
            { key: "seo.siteDescription", label: "Site beschrijving", type: "textarea", placeholder: "Vergelijk dakkapel prijzen..." },
            { key: "seo.googleAnalyticsId", label: "Google Analytics ID", type: "text", placeholder: "G-XXXXXXX" },
            { key: "seo.googleSearchConsoleId", label: "Search Console ID", type: "text" },
        ],
    },
    {
        label: "Leads", icon: "📋",
        fields: [
            { key: "leads.autoExpireDays", label: "Auto-expire na (dagen)", type: "number", hint: "Leads verlopen na dit aantal dagen" },
            { key: "leads.maxMatchesPerLead", label: "Max matches per lead", type: "number" },
            { key: "leads.notificationEmails", label: "Notificatie emails", type: "text", hint: "Komma-gescheiden" },
        ],
    },
    {
        label: "Content", icon: "📝",
        fields: [
            { key: "content.defaultCategory", label: "Default categorie", type: "text" },
            { key: "content.defaultAuthor", label: "Default auteur", type: "text" },
        ],
    },
    {
        label: "Notificaties", icon: "🔔",
        fields: [
            { key: "notifications.leadsEmail", label: "Nieuwe lead emails", type: "text", hint: "Komma-gescheiden ontvangers" },
            { key: "notifications.matchEmail", label: "Match emails", type: "text", hint: "Notificatie bij match" },
            { key: "notifications.adminAlerts", label: "Admin alerts inschakelen", type: "toggle" },
            { key: "notifications.dailyDigest", label: "Dagelijkse samenvatting", type: "toggle" },
        ],
    },
    {
        label: "Systeem", icon: "⚙️",
        fields: [
            { key: "system.trashRetentionDays", label: "Prullenbak retentie (dagen)", type: "number", hint: "Auto-purge na dit aantal dagen" },
            { key: "system.cronSecret", label: "Cron secret", type: "text", hint: "Beveiligingssleutel voor cron jobs" },
            { key: "system.maintenanceMode", label: "Onderhoudsmodus", type: "toggle" },
        ],
    },
];

export default function SettingsPage() {
    const { success, error } = useToast();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<Record<string, unknown>>({});
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(r => r.ok ? r.json() : null)
            .then(d => { setSettings(d?.settings || {}); setLoading(false); });
    }, []);

    const saveSetting = useCallback(async (key: string, value: unknown) => {
        setSaving(key);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value }),
            });
            if (res.ok) {
                setSettings(prev => ({ ...prev, [key]: value }));
                success("Opgeslagen");
            } else {
                error("Opslaan mislukt");
            }
        } catch {
            error("Opslaan mislukt");
        }
        setSaving(null);
    }, [success, error]);

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-gray-600 border-t-amber-400 rounded-full animate-spin mr-2" />
                Laden...
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-6">
            <Breadcrumbs items={[{ label: "Instellingen" }]} />
            <h1 className="text-2xl font-bold mb-1">Instellingen</h1>
            <p className="text-sm text-gray-400 mb-6">Site-brede configuratie</p>

            <div className="space-y-6 max-w-2xl">
                {GROUPS.map(group => (
                    <div key={group.label} className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <span>{group.icon}</span> {group.label}
                        </h2>
                        <div className="space-y-4">
                            {group.fields.map(field => {
                                const value = settings[field.key] ?? "";
                                return (
                                    <div key={field.key}>
                                        <label className="text-xs text-gray-400 block mb-1">{field.label}</label>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                value={String(value)}
                                                onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                onBlur={() => saveSetting(field.key, settings[field.key])}
                                                placeholder={field.placeholder}
                                                rows={3}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none resize-none"
                                            />
                                        ) : field.type === "toggle" ? (
                                            <button
                                                onClick={() => {
                                                    const newVal = !value;
                                                    setSettings(prev => ({ ...prev, [field.key]: newVal }));
                                                    saveSetting(field.key, newVal);
                                                }}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                                    value ? "bg-amber-500" : "bg-gray-700"
                                                }`}
                                            >
                                                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                                                    value ? "translate-x-6" : "translate-x-1"
                                                }`} />
                                            </button>
                                        ) : (
                                            <input
                                                type={field.type}
                                                value={String(value)}
                                                onChange={e => setSettings(prev => ({
                                                    ...prev,
                                                    [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                                                }))}
                                                onBlur={() => saveSetting(field.key, settings[field.key])}
                                                placeholder={field.placeholder}
                                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                                            />
                                        )}
                                        {field.hint && <p className="text-[10px] text-gray-600 mt-0.5">{field.hint}</p>}
                                        {saving === field.key && <p className="text-[10px] text-amber-400 mt-0.5">Opslaan...</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
