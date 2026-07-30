import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACCU — Independent Community Radio",
  description:
    "Independent community radio connecting electronic music, local culture and emerging voices from Limburg and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
