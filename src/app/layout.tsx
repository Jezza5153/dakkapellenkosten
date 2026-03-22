import type { Metadata } from "next";
import "@/lib/env"; // Fail-fast env validation
import "./globals.css";
import { AnalyticsLoader } from "@/components/analytics";

export const metadata: Metadata = {
    title: {
        default: "DakkapellenKosten.nl — Dakkapel offertes vergelijken",
        template: "%s | DakkapellenKosten.nl",
    },
    description: "Vergelijk gratis dakkapel offertes van betrouwbare specialisten in heel Nederland.",
    metadataBase: new URL("https://dakkapellenkosten.nl"),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="nl">
            <body className="antialiased">
                {children}
                <AnalyticsLoader />
            </body>
        </html>
    );
}
