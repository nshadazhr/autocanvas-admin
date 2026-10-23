import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Admin — AI Creator Platform",
  description: "Internal operations console: jobs, failed jobs, feature flags, AI providers.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">{children}</body>
    </html>
  );
}
