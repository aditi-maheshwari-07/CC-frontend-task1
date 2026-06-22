import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ISS Telemetry Dashboard",
    description: "Live International Space Station tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}