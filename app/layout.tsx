import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "ISS Telemetry Dashboard",
    description: "Live International Space Station tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head><meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title></title>
        </head>
        <body>{children}</body>
        </html>
    );
}