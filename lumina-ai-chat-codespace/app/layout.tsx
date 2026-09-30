import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina — AI Chat",
  description: "A polished AI chatbot starter built for GitHub Codespaces.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}