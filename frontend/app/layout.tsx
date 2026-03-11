import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sales Insight Automator",
  description:
    "Upload sales data and get an AI-generated executive summary in your inbox.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
