import type { Metadata } from "next";

const SITE_URL = "https://nicolasdrawn.github.io/NICOLAS-HYBRID-PORTFOLIO";

export const metadata: Metadata = {
  title: "Carta de Presentación",
  description:
    "Carta de presentación formal de Nicolás Monroy Pabón. Perfil híbrido Comunicador Social + Full Stack Developer, con experiencia en IA generativa aplicada a producción real.",
  alternates: {
    canonical: `${SITE_URL}/carta`,
  },
  openGraph: {
    type: "article",
    url: `${SITE_URL}/carta`,
    title: "Carta de Presentación · Nicolás Monroy Pabón",
    description:
      "Perfil híbrido — comunicador y desarrollador. IA aplicada en producción real, no demos.",
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
