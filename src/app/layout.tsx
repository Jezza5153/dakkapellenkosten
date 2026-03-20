import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "DakkapellenKosten.nl — Dashboard",
    description: "Beheer je leads, credits en bedrijfsprofiel",
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
            </body>
        </html>
    );
}
