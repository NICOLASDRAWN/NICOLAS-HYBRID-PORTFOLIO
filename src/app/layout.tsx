import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
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
    <html lang="es" className={`${archivo.variable} ${spaceGrotesk.variable} scroll-smooth antialiased`}>
      <body className="font-body bg-background text-foreground selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
