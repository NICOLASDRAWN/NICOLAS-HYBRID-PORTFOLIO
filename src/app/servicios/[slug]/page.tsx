import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import { Eyebrow, Footer, Header, JsonLd, SITE_URL } from "@/components/site/chrome";
import { REGIONS, SERVICES, waLink } from "@/components/world/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  const title = `${s.name} en Colombia`;
  const description = `${s.short} Trabajo remoto desde Bogotá para toda Colombia y clientes internacionales.`;
  const url = `${SITE_URL}/servicios/${s.slug}/`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, images: ["/assets/og-cover.png"] } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const url = `${SITE_URL}/servicios/${s.slug}/`;

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.name,
            description: s.intro,
            url,
            serviceType: s.name,
            provider: { "@id": `${SITE_URL}/#nicolas` },
            areaServed: [{ "@type": "Country", name: "Colombia" }, { "@type": "Place", name: "Worldwide — remote services" }],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/#servicios` },
              { "@type": "ListItem", position: 3, name: s.name, item: url },
            ],
          },
        ]}
      />
      <div className="speedlines fixed inset-0 pointer-events-none opacity-60" aria-hidden="true" />
      <Header />
      <main id="main-content" className="relative shell pt-32">
        <a href="https://ncls.lat/#servicios" className="inline-flex items-center gap-2 text-sm text-ink-dim hover:text-accent"><ArrowLeft size={16} /> Todos los servicios</a>

        <section className="mt-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          <div>
            <Eyebrow>Servicio · Colombia y remoto</Eyebrow>
            <h1 className="text-[clamp(40px,6vw,88px)] font-bold leading-[0.92] tracking-[-0.045em]">
              {s.name}<br /><span className="energy-text">en Colombia.</span>
            </h1>
            <p className="mt-7 text-lg text-ink-dim leading-relaxed max-w-[620px]">{s.intro}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={waLink(`Hola Nicolás, quiero cotizar ${s.name.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer" className="btn-primary"><MessageCircle size={18} /> Cotizar por WhatsApp</a>
            </div>
          </div>
          <div className="glass p-8 relative">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dimmer mb-4">Qué incluye</h2>
            <ul className="space-y-3">
              {s.includes.map((i) => (
                <li key={i} className="flex gap-3"><Check size={18} className="text-accent shrink-0 mt-0.5" /> {i}</li>
              ))}
            </ul>
            <p className="mt-6 pt-6 border-t border-line text-sm text-ink-dim"><b className="text-ink">Ideal para:</b> {s.ideal}</p>
          </div>
        </section>

        <section className="mt-24">
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <ol className="grid md:grid-cols-4 gap-4">
            {[
              ["Conversación", "Me cuentas tu idea por WhatsApp o videollamada."],
              ["Propuesta", "Te envío alcance, tiempos y costo antes de empezar."],
              ["Producción", "Avanzo con revisiones para que ajustes lo necesario."],
              ["Entrega", "Recibes los archivos finales y el acompañamiento acordado."],
            ].map(([t, d], i) => (
              <li key={t} className="glass p-6">
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-ink-dim">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-24 grid lg:grid-cols-2 gap-10">
          <div>
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <div className="space-y-3">
              {s.faq.map((f) => (
                <details key={f.q} className="glass p-5 group">
                  <summary className="cursor-pointer font-semibold list-none flex justify-between gap-4">{f.q}<span className="text-accent group-open:rotate-45 transition-transform">+</span></summary>
                  <p className="mt-3 text-ink-dim leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>{s.name} por ciudad</Eyebrow>
            <ul className="grid sm:grid-cols-2 gap-3">
              {REGIONS.map((r) => (
                <li key={r.slug}>
                  <Link href={`/huila/${r.slug}/`} className="glass block p-5 hover:border-accent transition-colors">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{r.region}</p>
                    <p className="mt-1 font-semibold">{s.name} en {r.city}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-dim">Otros servicios: {SERVICES.filter((x) => x.slug !== s.slug).map((x, i) => (
              <span key={x.slug}>{i > 0 && " · "}<Link href={`/servicios/${x.slug}/`} className="underline underline-offset-2 hover:text-accent">{x.name}</Link></span>
            ))}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
