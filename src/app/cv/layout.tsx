import type { Metadata } from "next";

const SITE_URL = "https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO";

export const metadata: Metadata = {
  title: "Curriculum Vitae",
  description:
    "Hoja de vida de Nicolás Monroy Pabón — Full Stack Developer & AI Specialist. Experiencia en ERPs empresariales, plataformas B2B e integración de IA generativa. Disponible para roles remotos.",
  alternates: {
    canonical: `${SITE_URL}/cv`,
  },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/cv`,
    title: "CV · Nicolás Monroy Pabón",
    description:
      "Hoja de vida web · Full Stack Developer & AI Specialist · Bogotá, Colombia.",
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
