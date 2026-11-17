import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Eyebrow, Footer, Header, SITE_URL } from "@/components/site/chrome";
import { REGIONS, SERVICES, waLink } from "@/components/world/content";

export const metadata: Metadata = {
  title: "Servicios de diseño, edición de video, web y programación en el Huila",
  description: "Atiendo los 37 municipios del Huila: Neiva, Pitalito, Garzón, La Plata y más. Edición de video, diseño gráfico, páginas web, programación y contenido para redes.",
  alternates: { canonical: `${SITE_URL}/huila/` },
};

export default function HuilaPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="speedlines fixed inset-0 pointer-events-none opacity-60" aria-hidden="true" />
      <Header />
      <main id="main-content" className="relative shell pt-36">
        <Eyebrow>Cobertura · 37 municipios</Eyebrow>
        <h1 className="text-[clamp(40px,6vw,96px)] font-bold leading-[0.9] tracking-[-0.045em] max-w-[900px]">
          Servicios digitales para <span className="energy-text">todo el Huila.</span>
        </h1>
        <p className="mt-7 text-lg text-ink-dim leading-relaxed max-w-[680px]">
          {SERVICES.map((s) => s.name).join(", ")}. Trabajo de forma remota con negocios, emprendimientos e instituciones de cada subregión del departamento.
        </p>
        <a href={waLink("Hola Nicolás, soy del Huila y quiero cotizar un proyecto.")} target="_blank" rel="noopener noreferrer" className="btn-primary mt-9"><MessageCircle size={18} /> Cotizar por WhatsApp</a>

        <ul className="mt-20 grid md:grid-cols-2 gap-5">
          {REGIONS.map((r) => (
            <li key={r.slug}>
              <Link href={`/huila/${r.slug}/`} className="glass group block h-full p-8 hover:-translate-y-1 transition-transform">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{r.region}</p>
                <h2 className="mt-2 text-3xl font-bold flex items-center justify-between">{r.city} <ArrowUpRight className="text-ink-dimmer group-hover:text-accent" /></h2>
                <p className="mt-3 text-ink-dim">{r.blurb}</p>
                <p className="mt-5 text-sm"><b>{r.municipios.length} municipios:</b> <span className="text-ink-dim">{r.municipios.join(", ")}.</span></p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
