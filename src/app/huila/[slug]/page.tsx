import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, MessageCircle } from "lucide-react";
import { Eyebrow, Footer, Header, JsonLd, SITE_URL } from "@/components/site/chrome";
import { REGIONS, SERVICES, waLink } from "@/components/world/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return REGIONS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = REGIONS.find((x) => x.slug === slug);
  if (!r) return {};
  const title = `Diseño, edición de video, páginas web y programación en ${r.city}, Huila`;
  const description = `Servicios creativos y de software para ${r.city} y el ${r.region.toLowerCase()}: ${r.municipios.slice(1).join(", ")}. Atención remota y cotización por WhatsApp.`;
  const url = `${SITE_URL}/huila/${r.slug}/`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, images: ["/assets/og-cover.png"] } };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = REGIONS.find((x) => x.slug === slug);
  if (!r) notFound();
  const url = `${SITE_URL}/huila/${r.slug}/`;
  const others = REGIONS.filter((x) => x.slug !== r.slug);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: `Nicolás Monroy · Servicios digitales en ${r.city}`,
            url,
            areaServed: r.municipios.map((m) => ({ "@type": "City", name: `${m}, Huila` })),
            makesOffer: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${s.name} en ${r.city}` } })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Huila", item: `${SITE_URL}/huila/` },
              { "@type": "ListItem", position: 3, name: r.city, item: url },
            ],
          },
        ]}
      />
      <div className="speedlines fixed inset-0 pointer-events-none opacity-60" aria-hidden="true" />
      <Header />
      <main id="main-content" className="relative shell pt-32">
        <Link href="/huila/" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-accent"><ArrowLeft size={16} /> Todo el Huila</Link>

        <section className="mt-8 grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
          <div>
            <Eyebrow>{r.region}</Eyebrow>
            <h1 className="text-[clamp(38px,5.5vw,84px)] font-bold leading-[0.92] tracking-[-0.045em]">
              Diseño, video, web{" "}<br />y programación{" "}<br /><span className="energy-text">en {r.city}.</span>
            </h1>
            <p className="mt-7 text-lg text-ink-dim leading-relaxed max-w-[620px]">{r.blurb} Trabajo de forma remota con negocios de {r.city} y sus municipios vecinos: hablamos por WhatsApp o videollamada y te entrego todo en línea.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={waLink(`Hola Nicolás, soy de ${r.city} y quiero cotizar un proyecto.`)} target="_blank" rel="noopener noreferrer" className="btn-primary"><MessageCircle size={18} /> Cotizar desde {r.city}</a>
            </div>
          </div>
          <div className="hidden lg:block aspect-[4/5] max-w-[340px] w-full mx-auto rounded-md border border-line bg-bg-2 bg-[url(/assets/avatar-anime.webp)] bg-cover bg-top" aria-hidden="true" />
        </section>

        <section className="mt-24">
          <Eyebrow>Servicios en {r.city}</Eyebrow>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}/`} className="glass group block h-full p-6 hover:-translate-y-1 transition-transform">
                  <span className="text-2xl font-bold text-accent/80" aria-hidden="true">{s.kanji}</span>
                  <h2 className="mt-3 font-semibold flex items-start justify-between gap-2">{s.name} <ArrowUpRight size={16} className="text-ink-dimmer group-hover:text-accent shrink-0" /></h2>
                  <p className="mt-2 text-sm text-ink-dim">{s.short}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24 grid lg:grid-cols-2 gap-10">
          <div className="glass p-8">
            <Eyebrow>Municipios que atiendo</Eyebrow>
            <ul className="flex flex-wrap gap-2">
              {r.municipios.map((m) => (
                <li key={m} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-2 border border-line text-sm"><MapPin size={13} className="text-accent" /> {m}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Otras subregiones</Eyebrow>
            <ul className="space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/huila/${o.slug}/`} className="glass flex items-center justify-between p-5 hover:border-accent transition-colors">
                    <span><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent block">{o.region}</span><span className="font-semibold">{o.city}</span></span>
                    <ArrowUpRight size={18} className="text-ink-dimmer" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
