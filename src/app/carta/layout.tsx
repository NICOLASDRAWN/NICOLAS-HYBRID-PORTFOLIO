import type { Metadata } from "next";
export const metadata: Metadata = { title: "Carta de presentación", description: "Diseño, comunicación y desarrollo de software — Nicolás Monroy Pabón.", alternates: { canonical: "https://ncls.lat/carta/" } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
