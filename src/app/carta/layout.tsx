import type { Metadata } from "next";

const SITE_URL = "https://ncls.lat";

export const metadata: Metadata = {
  title: "Carta de Presentación — Nicolás Monroy Pabón",
  description:
    "Carta de presentación de Nicolás Monroy Pabón. Comunicador Social × Systems Architect & Full Stack Developer, con 7 suites SaaS B2B en producción y experiencia en IA generativa aplicada.",
  alternates: {
    canonical: `${SITE_URL}/carta`,
  },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/carta`,
    title: "Carta de Presentación · Nicolás Monroy Pabón · Systems Architect",
    description:
      "Comunicador Social × Systems Architect. IA aplicada en producción real, 501 colaboradores, 7 suites SaaS B2B.",
    images: [
      {
        url: `${SITE_URL}/assets/og-cover.png`,
        width: 1200,
        height: 630,
        alt: "Carta de Presentación · Nicolás Monroy Pabón",
      },
    ],
  },
};

export default function CartaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
