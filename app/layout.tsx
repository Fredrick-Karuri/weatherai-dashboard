/**
 * layout.tsx
 *
 * Root layout. Sets document metadata and applies global CSS.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeatherAI Dashboard",
  description: "Real-time weather forecasts with AI-generated summaries",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}