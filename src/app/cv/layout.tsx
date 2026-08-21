import type { Metadata } from "next";

const SITE_URL = "https://ncls.lat";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description:
    "Hoja de vida de Nicolás Monroy Pabón — Diseñador Gráfico & Full Stack Developer. Experiencia en ERPs empresariales, plataformas B2B, diseño de marca e integración de IA generativa.",
  alternates: {
    canonical: `${SITE_URL}/cv`,
  },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/cv`,
    title: "CV · Nicolás Monroy Pabón · Diseñador Gráfico & Full Stack Developer",
    description:
      "Hoja de vida web · Diseñador Gráfico & Full Stack Developer · Bogotá, Colombia.",
    images: [
      {
        url: `${SITE_URL}/assets/og-cover.png`,
        width: 1200,
        height: 630,
        alt: "CV · Nicolás Monroy Pabón",
      },
    ],
  },
};

export default function CVLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
