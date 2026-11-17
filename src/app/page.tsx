import Link from "next/link";
import { ArrowDown, ArrowUpRight, Calendar, Mail, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { WorldStage } from "@/components/world/world-stage";
import { CONTACT, EXPERIENCE, PILLARS, PROJECTS, STACK } from "@/components/world/content";

function Eyebrow({ n, center, children }: { n: string; center?: boolean; children: React.ReactNode }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.25em] text-acid mb-6 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span className="text-ink-dimmer">{n}</span>
      <span className="h-px w-8 bg-acid/60" />
      {children}
    </p>
  );
}

/** Sección = una estación de la cámara. `align` deja libre el lado donde aparece el objeto 3D. */
/** Anclas de la versión anterior (#avatar, #contact…) para no romper enlaces compartidos. */
function Aliases({ ids }: { ids: string[] }) {
  return <>{ids.map((i) => <span key={i} id={i} className="absolute top-0" aria-hidden="true" />)}</>;
}

function Station({ id, align, className = "", aliases = [], children }: { id: string; align: "left" | "right" | "center"; className?: string; aliases?: string[]; children: React.ReactNode }) {
  const col = align === "left" ? "md:mr-auto" : align === "right" ? "md:ml-auto" : "mx-auto text-center";
  return (
    <section id={id} data-station className={`relative min-h-[135svh] flex items-center py-28 ${className}`}>
      <Aliases ids={aliases} />
      <div className="shell w-full">
        <div className={`max-w-[640px] ${col}`}>{children}</div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="shell flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="font-mono text-sm tracking-[0.2em] text-ink" aria-label="Inicio">
          NCLS<span className="text-acid">.</span>DEV
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim">
          <a href="#perfil" className="hover:text-acid transition-colors">Perfil</a>
          <a href="#stack" className="hover:text-acid transition-colors">Stack</a>
          <a href="#proyectos" className="hover:text-acid transition-colors">Proyectos</a>
          <Link href="/cv/" className="hover:text-acid transition-colors">CV</Link>
        </nav>
        <a href="#contacto" className="font-mono text-[11px] uppercase tracking-[0.2em] border border-acid/60 text-acid px-4 py-2 hover:bg-acid hover:text-bg transition-colors">
          Hablemos
        </a>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg">
      <WorldStage />
      <Header />

      <main id="main-content" className="relative z-10">
        {/* 00 — INICIO */}
        <section id="inicio" data-station className="relative min-h-[100svh] flex items-end md:items-center pb-24 md:pb-0">
          <Aliases ids={["hero", "top"]} />
          <div className="shell w-full">
            <div className="max-w-[860px]">
              <p className="hero-in font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim mb-8">
                Nicolás Monroy Pabón <span className="text-acid">·</span> Bogotá, Colombia
              </p>
              <h1 className="hero-in [animation-delay:120ms] text-[clamp(44px,8vw,128px)] font-bold leading-[0.88] tracking-[-0.045em] text-balance">
                Diseño lo que<br />construyo.
                <span className="block text-acid">Construyo lo que diseño.</span>
              </h1>
              <p className="hero-in [animation-delay:240ms] mt-8 max-w-[520px] text-lg text-ink-dim leading-relaxed">
                Diseño, comunicación y desarrollo de software para convertir procesos e ideas en experiencias digitales claras y útiles.
              </p>
              <div className="hero-in [animation-delay:360ms] mt-10 flex flex-wrap gap-4">
                <a href="#proyectos" className="inline-flex items-center gap-2 bg-acid text-bg px-6 py-3.5 font-medium hover:bg-acid-deep transition-colors">
                  Ver proyectos <ArrowUpRight size={18} />
                </a>
                <Link href="/cv/" className="inline-flex items-center gap-2 border border-line-2 bg-bg/40 backdrop-blur px-6 py-3.5 hover:border-ink-dim transition-colors">
                  Perfil profesional
                </Link>
              </div>
            </div>
          </div>
          <a href="#perfil" className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim flex flex-col items-center gap-2 hover:text-acid" aria-label="Bajar al perfil">
            Scroll <ArrowDown size={14} className="animate-bounce" />
          </a>
        </section>

        {/* 01 — PERFIL */}
        <Station id="perfil" align="right" aliases={["avatar", "profile"]}>
          <Reveal className="panel">
            <Eyebrow n="01">Perfil</Eyebrow>
            <h2 className="h2">Diseño con propósito.<br /><span className="text-acid">Código que lo hace posible.</span></h2>
            <p className="mt-6 text-ink-dim text-lg leading-relaxed">
              Combino diseño gráfico, UX/UI y comunicación con desarrollo web y automatización de procesos.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {PILLARS.map((p) => (
                <li key={p.n} className="py-5 grid grid-cols-[44px_1fr] gap-2">
                  <span className="font-mono text-xs text-acid pt-1">{p.n}</span>
                  <div>
                    <h3 className="text-xl font-medium">{p.title}</h3>
                    <p className="text-ink-dim mt-1 leading-relaxed">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </Station>

        {/* 02 — STACK */}
        <Station id="stack" align="left" aliases={["skills"]}>
          <Reveal className="panel">
            <Eyebrow n="02">Stack</Eyebrow>
            <h2 className="h2">Arquitectura<br />y herramientas.</h2>
            <div className="mt-8 space-y-6">
              {STACK.map((g) => (
                <div key={g.title}>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim mb-3">{g.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <li key={it} className="px-3 py-1.5 text-sm border border-line bg-bg-2/70 hover:border-acid hover:text-acid transition-colors">{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </Station>

        {/* 03 — EXPERIENCIA */}
        <Station id="experiencia" align="right" aliases={["experience"]}>
          <Reveal className="panel">
            <Eyebrow n="03">Experiencia</Eyebrow>
            <h2 className="h2">Creatividad aplicada<br />a procesos reales.</h2>
            <div className="mt-8 space-y-4">
              {EXPERIENCE.map((e) => (
                <article key={e.title} className="border-l-2 border-acid pl-5 py-1">
                  <h3 className="text-xl font-medium">{e.title}</h3>
                  <p className="text-ink-dim mt-2 leading-relaxed">{e.text}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </Station>

        {/* 04 — PROYECTOS */}
        <section id="proyectos" data-station className="relative min-h-[140svh] py-32">
          <Aliases ids={["portfolio", "projects"]} />
          <div className="shell">
            <Reveal className="text-center max-w-[720px] mx-auto mb-14">
              <Eyebrow n="04" center>Proyectos</Eyebrow>
              <h2 className="h2">Lo que he construido.</h2>
              <p className="mt-5 text-ink-dim text-lg">Proyectos públicos y casos empresariales presentados de forma anonimizada, sin datos ni métricas internas.</p>
            </Reveal>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROJECTS.map((p, i) => {
                const body = (
                  <>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className={p.public ? "text-acid" : "text-ink-dimmer"}>{p.kind}</span>
                      {p.href && <ArrowUpRight size={16} className="text-ink-dim group-hover:text-acid group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
                    </div>
                    <h3 className="mt-8 text-xl font-medium leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-ink-dim leading-relaxed flex-1">{p.text}</p>
                    <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dimmer">{p.tech.join(" · ")}</p>
                  </>
                );
                const cls = "group h-full flex flex-col p-6 border border-line bg-bg/60 backdrop-blur-md transition-colors" + (p.href ? " hover:border-acid" : "");
                return (
                  <Reveal as="li" key={p.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    {p.href ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 05 — CONTACTO */}
        <section id="contacto" data-station className="relative min-h-[100svh] flex flex-col justify-center pt-28">
          <Aliases ids={["contact"]} />
          <div className="shell w-full text-center">
            <Reveal className="max-w-[760px] mx-auto">
              <Eyebrow n="05" center>Contacto</Eyebrow>
              <h2 className="text-[clamp(44px,7vw,112px)] font-bold leading-[0.9] tracking-[-0.045em]">
                Inicia la<br /><span className="text-acid">conversación.</span>
              </h2>
              <p className="mt-6 text-ink-dim text-lg">Cuéntame tu proyecto: identidad, producto digital o automatización. Respondo desde Bogotá (GMT-5).</p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 bg-acid text-bg px-6 py-3.5 font-medium hover:bg-acid-deep transition-colors">
                  <Mail size={18} /> Escribir correo
                </a>
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-line-2 bg-bg/50 backdrop-blur px-6 py-3.5 hover:border-acid hover:text-acid transition-colors">
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-line-2 bg-bg/50 backdrop-blur px-6 py-3.5 hover:border-acid hover:text-acid transition-colors">
                  <Calendar size={18} /> Llamada de 15 min
                </a>
              </div>
              <p className="mt-6 font-mono text-sm text-ink-dim break-all">{CONTACT.email}</p>
            </Reveal>
          </div>

          <footer className="shell w-full mt-auto pt-24 pb-8">
            <div className="border-t border-line pt-6 flex flex-col md:flex-row gap-4 justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dimmer">
              <span>© 2026 Nicolás Monroy Pabón · Brand OS v3</span>
              <span className="flex flex-wrap gap-6">
                <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="hover:text-acid">GitHub</a>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-acid">LinkedIn</a>
                <Link href="/cv/" className="hover:text-acid">CV</Link>
                <Link href="/carta/" className="hover:text-acid">Carta</Link>
              </span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
