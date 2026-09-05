import type { Metadata } from "next";

const SITE_URL = "https://ncls.lat";

export const metadata: Metadata = {
  title: "Curriculum Vitae — Nicolás Monroy Pabón",
  description:
    "CV de Nicolás Monroy Pabón — Comunicador Social × Systems Architect & Full Stack Developer. 7 Suites SaaS B2B en producción, 501 colaboradores auditados, IA generativa aplicada.",
  alternates: {
    canonical: `${SITE_URL}/cv`,
  },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/cv`,
    title: "CV · Nicolás Monroy Pabón · Systems Architect & Full Stack Developer",
    description:
      "Comunicador Social × Systems Architect. 7 Suites SaaS B2B, 501 nómina auditada, IA generativa en producción.",
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
