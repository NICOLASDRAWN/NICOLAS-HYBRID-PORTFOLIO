import Link from "next/link";
import { ArrowDown, ArrowUpRight, Calendar, Mail, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { WorldStage } from "@/components/world/world-stage";
import { AnimeAvatar, Eyebrow, Footer, Header, JsonLd, SITE_URL } from "@/components/site/chrome";
import { ALL_MUNICIPIOS, CONTACT, EXPERIENCE, PILLARS, PROJECTS, REGIONS, SERVICES, STACK, waLink } from "@/components/world/content";

/** Anclas de la versión anterior (#avatar, #contact…) para no romper enlaces compartidos. */
function Aliases({ ids }: { ids: string[] }) {
  return <>{ids.map((i) => <span key={i} id={i} className="absolute top-0" aria-hidden="true" />)}</>;
}

/** Sección = una estación de la cámara. `align` deja libre el lado donde aparece el objeto 3D. */
function Station({ id, align, aliases = [], wide = false, children }: { id: string; align: "left" | "right" | "center"; aliases?: string[]; wide?: boolean; children: React.ReactNode }) {
  const col = align === "left" ? "md:mr-auto" : align === "right" ? "md:ml-auto" : "mx-auto";
  return (
    <section id={id} data-station className="relative min-h-[130svh] flex items-center py-28">
      <Aliases ids={aliases} />
      <div className="shell w-full">
        <div className={`${wide ? "max-w-[760px]" : "max-w-[640px]"} ${col}`}>{children}</div>
      </div>
    </section>
  );
}

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
      <WorldStage />
      <Header home />

      <main id="main-content" className="relative z-10">
        {/* 00 — INICIO */}
        <section id="inicio" data-station className="relative min-h-[100svh] flex items-center pt-24 pb-16">
          <Aliases ids={["hero", "top"]} />
          <div className="speedlines absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="shell w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="relative z-10">
              <p className="hero-in glass inline-flex items-center gap-2 !rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim mb-7">
                <MapPin size={13} className="text-accent" /> Huila · Colombia · Remoto
              </p>
              <h1 className="hero-in [animation-delay:120ms] text-[clamp(42px,7vw,112px)] font-bold leading-[0.9] tracking-[-0.045em] text-balance">
                Diseño lo que{" "}<br />construyo.
                <span className="block energy-text">Construyo lo que diseño.</span>
              </h1>
              <p className="hero-in [animation-delay:240ms] mt-7 max-w-[540px] text-lg text-ink-dim leading-relaxed">
                Edición de video, diseño gráfico, páginas web y programación a la medida para negocios de <strong className="text-ink">Neiva, Pitalito, Garzón, La Plata</strong> y todo el Huila.
              </p>
              <div className="hero-in [animation-delay:360ms] mt-9 flex flex-wrap gap-3">
                <a href="#servicios" className="btn-primary">Ver servicios <ArrowUpRight size={18} /></a>
                <a href={waLink("Hola Nicolás, vi tu página y quiero cotizar.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <MessageCircle size={18} /> Escríbeme por WhatsApp
                </a>
              </div>
            </div>

            <div className="hero-in [animation-delay:200ms] relative mx-auto w-full max-w-[460px]">
              <span className="jp absolute -left-8 top-10 text-[11px] text-accent/70 hidden md:block" aria-hidden="true">ニコラス・モンロイ</span>
              <AnimeAvatar />
              <div className="glass float-card absolute left-[-6%] top-[52%] z-30 px-4 py-3 flex items-center gap-3">
                <span className="grid place-items-center size-9 rounded-xl bg-accent text-white font-bold">5</span>
                <span className="text-sm leading-tight"><b>Servicios</b><br /><span className="text-ink-dim">creativos y técnicos</span></span>
              </div>
              <div className="glass float-card [animation-delay:1.5s] absolute right-[-4%] top-[30%] z-30 px-4 py-3 text-sm">
                <b>37</b> <span className="text-ink-dim">municipios</span><br /><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">Huila</span>
              </div>
              <div className="glass float-card [animation-delay:3s] absolute right-[2%] bottom-[8%] z-30 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em]">
                Diseño · Video · Web · Código
              </div>
            </div>
          </div>
          <a href="#servicios" className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim flex flex-col items-center gap-2 hover:text-accent" aria-label="Bajar a servicios">
            Scroll <ArrowDown size={14} className="animate-bounce" />
          </a>
        </section>

        {/* 01 — SERVICIOS */}
        <Station id="servicios" align="right" wide>
          <Reveal className="panel">
            <Eyebrow n="01">Servicios</Eyebrow>
            <h2 className="h2">Todo lo que tu marca{" "}<br /><span className="energy-text">necesita para crecer.</span></h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}/`} className="group block h-full rounded-2xl border border-line bg-white/70 p-5 hover:border-accent hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-2xl text-accent/80" aria-hidden="true">{s.kanji}</span>
                      <ArrowUpRight size={18} className="text-ink-dimmer group-hover:text-accent" />
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{s.name}</h3>
                    <p className="mt-1 text-sm text-ink-dim leading-relaxed">{s.short}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Station>

        {/* 02 — PERFIL */}
        <Station id="perfil" align="left" aliases={["avatar", "profile", "skills", "stack", "experience", "experiencia"]}>
          <Reveal className="panel">
            <Eyebrow n="02">Perfil</Eyebrow>
            <h2 className="h2">Diseño con propósito.{" "}<br /><span className="energy-text">Código que lo hace posible.</span></h2>
            <p className="mt-6 text-ink-dim text-lg leading-relaxed">
              Soy Nicolás Monroy Pabón, comunicador social. Combino diseño gráfico, comunicación y desarrollo de software para convertir procesos e ideas en experiencias digitales claras y útiles.
            </p>
            <ul className="mt-7 divide-y divide-line border-y border-line">
              {PILLARS.map((p) => (
                <li key={p.n} className="py-4 grid grid-cols-[40px_1fr] gap-2">
                  <span className="font-mono text-xs text-accent pt-1">{p.n}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="text-ink-dim mt-1 leading-relaxed text-sm">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-3">
              {EXPERIENCE.map((e) => (
                <p key={e.title} className="text-sm text-ink-dim leading-relaxed border-l-2 border-accent pl-4"><b className="text-ink">{e.title}.</b> {e.text}</p>
              ))}
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {STACK.flatMap((g) => g.items).slice(0, 16).map((it) => (
                <li key={it} className="px-3 py-1 text-xs rounded-full border border-line bg-white/70">{it}</li>
              ))}
            </ul>
            <Link href="/cv/" className="inline-block mt-6 text-accent font-medium underline underline-offset-4">Ver perfil profesional</Link>
          </Reveal>
        </Station>

        {/* 03 — PROYECTOS */}
        <section id="proyectos" data-station className="relative min-h-[130svh] py-32">
          <Aliases ids={["portfolio", "projects"]} />
          <div className="shell">
            <Reveal className="text-center max-w-[720px] mx-auto mb-12">
              <Eyebrow n="03" center>Proyectos</Eyebrow>
              <h2 className="h2">Lo que he construido.</h2>
              <p className="mt-5 text-ink-dim text-lg">Proyectos públicos y casos empresariales presentados de forma anonimizada.</p>
            </Reveal>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROJECTS.map((p, i) => {
                const body = (
                  <>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className={p.public ? "text-accent" : "text-ink-dimmer"}>{p.kind}</span>
                      {p.href && <ArrowUpRight size={16} className="text-ink-dim group-hover:text-accent transition-colors" />}
                    </div>
                    <h3 className="mt-7 text-lg font-semibold leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-ink-dim leading-relaxed flex-1">{p.text}</p>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dimmer">{p.tech.join(" · ")}</p>
                  </>
                );
                const cls = "glass group h-full flex flex-col p-6 transition-all" + (p.href ? " hover:-translate-y-1 hover:border-accent" : "");
                return (
                  <Reveal as="li" key={p.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    {p.href ? <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a> : <div className={cls}>{body}</div>}
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 04 — HUILA */}
        <Station id="huila" align="right" wide>
          <Reveal className="panel">
            <Eyebrow n="04">Cobertura</Eyebrow>
            <h2 className="h2">Para todo{" "}<br /><span className="energy-text">el Huila.</span></h2>
            <p className="mt-5 text-ink-dim text-lg leading-relaxed">
              Trabajo de forma remota con negocios de los 37 municipios: reuniones por videollamada, entregas en línea y viajes cuando el proyecto lo requiere.
            </p>
            <ul className="mt-7 grid sm:grid-cols-2 gap-3">
              {REGIONS.map((r) => (
                <li key={r.slug}>
                  <Link href={`/huila/${r.slug}/`} className="group block h-full rounded-2xl border border-line bg-white/70 p-5 hover:border-accent transition-colors">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{r.region}</p>
                    <h3 className="mt-1 text-xl font-semibold flex items-center justify-between">{r.city} <ArrowUpRight size={18} className="text-ink-dimmer group-hover:text-accent" /></h3>
                    <p className="mt-2 text-xs text-ink-dim leading-relaxed">{r.municipios.join(" · ")}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Station>

        {/* 05 — CONTACTO */}
        <section id="contacto" data-station className="relative min-h-[100svh] flex flex-col justify-center pt-28">
          <Aliases ids={["contact"]} />
          <div className="shell w-full text-center">
            <Reveal className="max-w-[760px] mx-auto">
              <Eyebrow n="05" center>Contacto</Eyebrow>
              <h2 className="text-[clamp(42px,7vw,108px)] font-bold leading-[0.9] tracking-[-0.045em]">
                Inicia la{" "}<br /><span className="energy-text">conversación.</span>
              </h2>
              <p className="mt-6 text-ink-dim text-lg">Cuéntame tu proyecto: video, marca, página web o automatización. Respondo por WhatsApp o correo.</p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a href={waLink("Hola Nicolás, vi tu portafolio y quiero conversar sobre un proyecto.")} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={`mailto:${CONTACT.email}`} className="btn-ghost"><Mail size={18} /> Correo</a>
                <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="btn-ghost"><Calendar size={18} /> Llamada de 15 min</a>
              </div>
              <p className="mt-6 font-mono text-sm text-ink-dim break-all">{CONTACT.email}</p>
            </Reveal>
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
}
