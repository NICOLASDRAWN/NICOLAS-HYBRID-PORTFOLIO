import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { HeroVisual } from "@/components/site/hero-visual";
import { Footer, Header, JsonLd, SITE_URL } from "@/components/site/chrome";
import { ALL_MUNICIPIOS, CONTACT, EXPERIENCE, PROJECTS, REGIONS, SERVICES, STACK, waLink } from "@/components/world/content";

/** Anclas de versiones anteriores (#avatar, #contact…) para no romper enlaces compartidos. */
function Aliases({ ids }: { ids: string[] }) {
  return <>{ids.map((i) => <span key={i} id={i} className="absolute top-0" aria-hidden="true" />)}</>;
}

function SectionHead({ n, title, children }: { n: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-end border-b border-line pb-8 mb-10">
      <h2 className="text-[clamp(34px,4.6vw,68px)] font-light leading-[0.95] tracking-[-0.04em]">
        <span className="font-mono text-xs tracking-[0.2em] text-ink-dimmer align-top mr-3">({n})</span>
        {title}
      </h2>
      {children && <p className="text-ink-dim md:max-w-[440px] md:justify-self-end leading-relaxed">{children}</p>}
    </div>
  );
}

const Words = ({ text, from = 0, className = "" }: { text: string; from?: number; className?: string }) => (
  <>
    {text.split(" ").map((w, i) => (
      <span key={i} className={`word ${className}`} style={{ animationDelay: `${(from + i) * 70}ms` }}>{w}&nbsp;</span>
    ))}
  </>
);

const businessLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nicolás Monroy · Diseño, edición, web y programación",
  url: SITE_URL,
  image: `${SITE_URL}/assets/avatar-anime.webp`,
  email: CONTACT.email,
  telephone: "+57 315 013 5016",
  founder: { "@type": "Person", name: "Nicolás Monroy Pabón" },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Huila, Colombia" },
    ...ALL_MUNICIPIOS.map((m) => ({ "@type": "City", name: `${m}, Huila` })),
    { "@type": "Country", name: "Colombia" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}/servicios/${s.slug}/` } })),
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg overflow-x-clip">
      <JsonLd data={businessLd} />
      <Header home />

      <main id="main-content">
        {/* HERO */}
        <section id="inicio" className="relative shell pt-28 md:pt-32 pb-16">
          <Aliases ids={["hero", "top"]} />
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
            <h1 className="text-[clamp(44px,7.4vw,124px)] font-light leading-[0.92] tracking-[-0.05em]">
              <Words text="Diseño que se mueve" />
              <br />
              <Words text="como tu marca." from={4} className="text-ink-dimmer" />
            </h1>
            <p className="lg:pt-6 text-ink-dim leading-relaxed max-w-[380px] lg:justify-self-end hero-fade">
              Identidad visual, edición de video, páginas web y software a la medida: ideas claras, piezas precisas y una historia que sí conecta. Para el Huila y toda Colombia.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3 hero-fade">
            <a href={waLink("Hola Nicolás, quiero cotizar un proyecto.")} target="_blank" rel="noopener noreferrer" className="btn-outline">Cotizar proyecto</a>
            <a href="#proyectos" className="btn-outline">Trabajos</a>
          </div>

          <div className="mt-12 mb-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dimmer">
            <span>(026)</span>
            <span className="text-right">Branding · Video · Web · Código</span>
          </div>
          <HeroVisual />
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="relative shell py-24">
          <SectionHead n="01" title="Servicios">Cinco formas de llevar tu marca a lo digital, con un mismo criterio de diseño de principio a fin.</SectionHead>
          <ul>
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <Link href={`/servicios/${s.slug}/`} className="group grid grid-cols-[48px_1fr_auto] md:grid-cols-[80px_1.1fr_1fr_auto] gap-4 items-center border-b border-line py-6 md:py-8 hover:bg-bg-2/60 transition-colors">
                  <span className="font-mono text-xs text-ink-dimmer">0{i + 1}</span>
                  <span className="text-2xl md:text-4xl font-light tracking-[-0.03em] group-hover:text-accent transition-colors">{s.name}</span>
                  <span className="hidden md:block text-ink-dim text-sm max-w-[420px]">{s.short}</span>
                  <ArrowUpRight className="text-ink-dimmer group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* TRABAJOS */}
        <section id="proyectos" className="relative shell py-24">
          <Aliases ids={["portfolio", "projects"]} />
          <SectionHead n="02" title="Trabajos">Proyectos públicos y casos empresariales presentados de forma anonimizada.</SectionHead>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {PROJECTS.map((p) => {
              const body = (
                <>
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
                    <span className={p.public ? "text-accent" : "text-ink-dimmer"}>{p.kind}</span>
                    {p.href && <ArrowUpRight size={15} className="text-ink-dimmer group-hover:text-accent" />}
                  </div>
                  <h3 className="mt-10 text-xl font-normal tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-dim leading-relaxed flex-1">{p.text}</p>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dimmer">{p.tech.join(" · ")}</p>
                </>
              );
              const cls = "group h-full min-h-[260px] flex flex-col p-6 bg-bg hover:bg-bg-2 transition-colors";
              return (
                <li key={p.title}>
                  {p.href ? <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a> : <div className={cls}>{body}</div>}
                </li>
              );
            })}
          </ul>
        </section>

        {/* HUILA */}
        <section id="huila" className="relative shell py-24">
          <SectionHead n="03" title="Todo el Huila">Trabajo remoto con negocios de los 37 municipios: videollamada, entregas en línea y viajes cuando el proyecto lo pide.</SectionHead>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {REGIONS.map((r) => (
              <li key={r.slug}>
                <Link href={`/huila/${r.slug}/`} className="group block h-full p-6 bg-bg hover:bg-bg-2 transition-colors">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{r.region}</p>
                  <h3 className="mt-3 text-3xl font-light tracking-[-0.03em] flex justify-between">{r.city} <ArrowUpRight size={18} className="text-ink-dimmer group-hover:text-accent" /></h3>
                  <p className="mt-4 text-xs text-ink-dim leading-relaxed">{r.municipios.join(" · ")}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ESTUDIO */}
        <section id="perfil" className="relative shell py-24">
          <Aliases ids={["avatar", "profile", "skills", "stack", "experience", "experiencia"]} />
          <SectionHead n="04" title="Estudio" />
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12">
            <div className="relative aspect-[4/5] max-w-[420px] rounded-md border border-line overflow-hidden bg-bg-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
              <img src="/assets/avatar-anime.webp" alt="Personaje de marca de Nicolás Monroy" width={768} height={1152} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-[clamp(22px,2.4vw,34px)] font-light leading-snug tracking-[-0.02em]">
                Soy Nicolás Monroy Pabón, comunicador social. Diseño lo que construyo y construyo lo que diseño: <span className="text-ink-dimmer">marca, video, web y software con un mismo criterio.</span>
              </p>
              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {EXPERIENCE.map((e) => (
                  <div key={e.title} className="border-t border-line pt-4">
                    <h3 className="font-medium">{e.title}</h3>
                    <p className="mt-2 text-sm text-ink-dim leading-relaxed">{e.text}</p>
                  </div>
                ))}
              </div>
              <ul className="mt-8 flex flex-wrap gap-2">
                {STACK.flatMap((g) => g.items).slice(0, 14).map((it) => (
                  <li key={it} className="px-3 py-1 text-xs rounded-sm border border-line text-ink-dim">{it}</li>
                ))}
              </ul>
              <Link href="/cv/" className="inline-flex items-center gap-1 mt-8 text-sm underline underline-offset-4 hover:text-accent">Perfil profesional <ArrowUpRight size={14} /></Link>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="relative pt-24">
          <Aliases ids={["contact"]} />
          <div className="shell">
            <div className="border-t border-line pt-16 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
              <h2 className="text-[clamp(44px,7vw,116px)] font-light leading-[0.92] tracking-[-0.05em]">
                Hablemos de<br /><span className="text-accent">tu proyecto.</span>
              </h2>
              <div className="space-y-5">
                <a href={`mailto:${CONTACT.email}`} className="block text-lg md:text-xl underline underline-offset-8 decoration-line-2 hover:decoration-accent break-all">{CONTACT.email}</a>
                <div className="flex flex-wrap gap-3">
                  <a href={waLink("Hola Nicolás, vi tu portafolio y quiero conversar sobre un proyecto.")} target="_blank" rel="noopener noreferrer" className="btn-primary">WhatsApp</a>
                  <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="btn-outline">Llamada de 15 min</a>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
}
