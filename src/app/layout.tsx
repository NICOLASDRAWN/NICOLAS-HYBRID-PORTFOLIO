import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nicolás Monroy Pabón | Full Stack Developer & AI Specialist",
  description: "Nicolás Monroy Pabón es un Full Stack Developer especializado en React, Node.js, TypeScript y plataformas con IA Generativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} scroll-smooth antialiased dark`}>
      <body className="font-body bg-bg text-ink selection:bg-acid selection:text-bg">
        {children}
      </body>
    </html>
  );
}
