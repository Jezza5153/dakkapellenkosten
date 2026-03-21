/**
 * New Page — /admin/pages/new
 * Uses the shared PageEditor component
 */
"use client";

import PageEditor from "@/components/admin/page-editor";

export default function NewPageRoute() {
    return <PageEditor isNew />;
}
