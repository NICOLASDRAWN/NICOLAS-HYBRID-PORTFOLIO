import type { Metadata } from "next";
export const metadata: Metadata = { title: "Perfil profesional", description: "Diseño, comunicación y desarrollo de software — Nicolás Monroy Pabón.", alternates: { canonical: "https://ncls.lat/cv/" } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
