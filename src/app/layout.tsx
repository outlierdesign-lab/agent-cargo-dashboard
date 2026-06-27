import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Cargo — Ops Dashboard",
  description: "AI-powered driver support operations dashboard for Agent Cargo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
