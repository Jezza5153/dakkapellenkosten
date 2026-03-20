/**
 * Homepage — DakkapellenKosten.nl
 * Premium lead-generation landing page
 */

import type { Metadata } from "next";
import Link from "next/link";
import HomeClient from "./home-client";

export const metadata: Metadata = {
    title: "Dakkapel offertes vergelijken in 2026 | Gratis & vrijblijvend",
    description:
        "Vergelijk gratis dakkapel offertes van betrouwbare specialisten. Ontvang binnen 48 uur tot 4 vrijblijvende offertes en bespaar tot 35% op je dakkapel.",
    alternates: { canonical: "https://dakkapellenkosten.nl/" },
};

export default function HomePage() {
    return <HomeClient />;
}
