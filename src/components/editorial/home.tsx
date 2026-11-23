"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, Clapperboard, Code2, Layers, Megaphone, MessageCircle, Monitor, Sparkles, Triangle, Zap } from "lucide-react";
import { CONTACT, SERVICES, SOCIAL, STATS, TIMELINE, WORKS, waLink } from "@/components/world/content";

export type Entry = { fecha: string; titulo: string; texto: string; tipo: string; imagen?: string; enlace?: string };

const SECTIONS = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "experiencia", label: "Experiencia" },
  { id: "bitacora", label: "Bitácora" },
  { id: "contacto", label: "Contacto" },
];
const ICONS: Record<string, typeof Camera> = { "edicion-de-video": Clapperboard, "diseno-grafico": Triangle, "desarrollo-web": Code2, "programacion-y-automatizacion": Zap, "contenido-para-redes": Layers, "diseno-ui-ux": Monitor, "motion-graphics": Sparkles, fotografia: Camera, "campanas-publicitarias": Megaphone };
const pad = (n: number) => String(n).padStart(2, "0");
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const fmt = (d: string) => { const [y, m, dd] = d.split("-"); return `${dd} ${MESES[+m - 1]} ${y}`; };

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv, .rv-clip, .ed-tl li");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting || e.boundingClientRect.bottom < 0) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Loader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    let v = 0; let fin = false;
    const t = setInterval(() => {
      v = Math.min(100, v + Math.max(1.2, (100 - v) * 0.09));
      setN(Math.round(v));
      if (v >= 100 && !fin) { fin = true; clearInterval(t); setTimeout(() => { setOut(true); onDone(); }, 250); }
    }, 28);
    return () => clearInterval(t);
  }, [onDone]);
  return (
    <div className={`ed-loader ${out ? "out" : ""}`} aria-hidden="true">
      <svg className="logo" viewBox="0 0 64 44" width="96" height="66" aria-hidden="true"><path d="M2 42 13 2h12l12 22L43 2h17L49 42H37L25 20l-6 22Z" fill="var(--l)" /></svg>
      <span className="n">{String(n).padStart(3, "0")}</span>
      <span className="ed-mono tag"><span>Ideas en movimiento</span><span>Bogotá — {new Date().getFullYear()}</span></span>
      <span className="bar" style={{ width: `${n}%` }} />
    </div>
  );
}

export function EditorialHome({ entries }: { entries: Entry[] }) {
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("inicio");
  const [prog, setProg] = useState(0);
  const [cine, setCine] = useState(true);
  const [step, setStep] = useState(0);
  const lightRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const done = useCallback(() => setReady(true), []);
  useReveal();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProg(max > 0 ? y / max : 0);
      if (artRef.current) artRef.current.style.translate = `0 ${y * 0.25}px`;
      let cur = "inicio";
      for (const s of SECTIONS) { const el = document.getElementById(s.id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) cur = s.id; }
      setActive(cur);
    };
    const onMove = (e: PointerEvent) => {
      if (lightRef.current) lightRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
      if (artRef.current) artRef.current.style.transform = `scale(1.02) translate(${dx * -10}px, ${dy * -8}px)`;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onMove, { passive: true });
    return () => { removeEventListener("scroll", onScroll); removeEventListener("pointermove", onMove); };
  }, []);

  useEffect(() => { const t = setInterval(() => setStep((v) => (v + 1) % 4), 2600); return () => clearInterval(t); }, []);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);

  const idx = Math.max(0, SECTIONS.findIndex((s) => s.id === active));

  return (
    <div className={`ed ${ready ? "ed-ready" : ""} ${cine ? "" : "no-cine"}`}>
      <noscript><style>{`.ed-loader{display:none}.rv,.ed-fade{opacity:1!important;transform:none!important}.rv-clip::after{display:none}.ed-hero h1 .row>span{transform:none!important}`}</style></noscript>
      <Loader onDone={done} />
      <div className="ed-grain" aria-hidden="true" />
      <div className="ed-light" ref={lightRef} aria-hidden="true" style={{ left: 0, top: 0 }} />

      <aside className="ed-side" aria-hidden="true">
        <span>+</span>
        <span className="v">Diseño + Tecnología + Estrategia</span>
        <span>+</span>
      </aside>

      <header className={`ed-head ${solid ? "solid" : ""}`}>
        <div className="ed-wrap">
          <a href="#inicio" className="ed-brand" aria-label="Nicolás Monroy, inicio">
            <svg viewBox="0 0 64 44" width="60" height="42" aria-hidden="true"><path d="M2 42 13 2h12l12 22L43 2h17L49 42H37L25 20l-6 22Z" fill="var(--l)" /></svg>
            <span>Nicolás<br />Monroy<sup>®</sup></span>
          </a>
          <nav className="ed-nav ed-mono" aria-label="Principal">
            <a href="#inicio" className={active === "inicio" ? "on" : ""}>Inicio</a>
            {[["servicios", "Servicios"], ["proyectos", "Proyectos"], ["bitacora", "Recursos"], ["contacto", "Contacto"]].map(([id, l]) => <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>{l}</a>)}
          </nav>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <button className="ed-toggle" role="switch" aria-checked={cine} aria-label="Efectos cinematográficos" title="Efectos cinematográficos" onClick={() => setCine(!cine)}><i /></button>
            <button className="ed-burger" aria-label="Menú" aria-expanded={menu} onClick={() => setMenu(!menu)}><i /><i /><i /></button>
          </div>
        </div>
      </header>
      <nav className={`ed-menu ${menu ? "open" : ""}`} aria-hidden={!menu}>
        {SECTIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className="big" tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
            <span className="ed-mono" style={{ fontSize: 12, marginRight: 14, color: "var(--l)" }}>{pad(i + 1)}</span>{s.label}
          </a>
        ))}
      </nav>

      <div className={`ed-rail ed-mono ${active === "inicio" ? "hide" : ""}`} aria-hidden="true">
        <span>{pad(idx + 1)}</span>
        <span className="track"><b style={{ height: `${prog * 100}%` }} /></span>
        <span className="muted">{pad(SECTIONS.length)}</span>
      </div>

      {/* HERO */}
      <section id="inicio" className="ed-hero">
        <div className="ed-art" ref={artRef}>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
          <img src="/assets/hero-astronauta.webp" alt="Astronauta en blanco y negro con acentos lima sobre una montaña, entre dos interfaces flotantes: IA Builder y Custom Site" width={3342} height={1780} fetchPriority="high" />
        </div>
        <div className="ed-hero-shade" aria-hidden="true" />
        <span className="ed-star" style={{ left: "36.4%", top: "23%" }} aria-hidden="true" />
        <span className="ed-star" style={{ left: "72.8%", top: "43%", animationDelay: "1.2s" }} aria-hidden="true" />
        <span className="ed-star big" style={{ left: "66.2%", top: "14.4%", animationDelay: ".6s" }} aria-hidden="true" />

        <p className="ed-mono ed-coords ed-fade" aria-hidden="true"><span>Lat 4.6097° N</span><span>Lon 74.0817° W</span></p>
        <div className="ed-wrap ed-hero-grid">
          <div className="ed-hero-copy">
            <p className="ed-mono ed-fade ed-tagline">Creativo <i>/</i> Estratégico <i>/</i> Full stack <b /></p>
            <h1 className="ed-display">
              <span className="row"><span>Ideas</span></span>
              <span className="row"><span>En <em className="hl">Movimiento</em></span></span>
              <span className="sr-only"> — Nicolás Monroy, diseñador web, branding y desarrollo en Bogotá, Colombia</span>
            </h1>
            <p className="ed-fade ed-sub">Diseño, tecnología y automatización<br />para marcas que crecen.</p>
            <a href="#proyectos" className="ed-btn ed-btn-l ed-fade">Ver proyectos <ArrowUpRight size={20} /></a>
            <ol className="ed-steps ed-mono ed-fade" aria-label="Proceso">
              {["Estrategia", "Diseño", "Tecnología", "Resultados"].map((s, i) => <li key={s} className={i === step ? "on" : ""}><span>{pad(i + 1)} /</span>{s}</li>)}
            </ol>
          </div>
          <div className="ed-hero-side ed-fade">
            <div>
              <p className="ed-mono" style={{ marginBottom: 14, color: "var(--c2)" }}>{"// Servicios"}</p>
              <ul className="ed-svc-box">
                {([[Triangle, "Branding e identidad", "diseno-grafico"], [Monitor, "Diseño digital", "contenido-para-redes"], [Code2, "Desarrollo web (UX/UI)", "desarrollo-web"], [Layers, "Automatización e IA", "programacion-y-automatizacion"]] as const).map(([Icon, l, slug]) => (
                  <li key={l}><Link href={`/servicios/${slug}/`}><Icon size={30} strokeWidth={1.4} /><span>{l}</span></Link></li>
                ))}
              </ul>
            </div>
            <p className="ed-mono ed-purpose"><ArrowUpRight size={40} strokeWidth={1.6} color="var(--l)" />Soluciones<br />digitales<br />con propósito.<b /></p>
          </div>
        </div>
        <div className="ed-hero-foot ed-wrap ed-mono" aria-hidden="true">
          <span className="sq">{[0, 1, 2, 3].map((i) => <i key={i} className={i <= step ? "on" : ""} />)}</span>
          <span className="ln" />
          <span>Portafolio {new Date().getFullYear()}</span>
          <span className="ln short" />
        </div>
      </section>

      <div className="ed-marquee" aria-hidden="true">
        <div className="t">
          {[0, 1].map((k) => (
            <div key={k} style={{ display: "flex", gap: 46 }}>
              {["Branding", "Web", "Motion", "Fotografía", "Código", "Dirección de arte", "IA aplicada"].map((w, i) => <span key={w} className={i % 3 === 1 ? "o" : i % 3 === 2 ? "l" : ""}>{w} ✦</span>)}
            </div>
          ))}
        </div>
      </div>

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="ed-sec paper">
        <div className="ed-wrap ed-about">
          <div className="ed-about-pic rv-clip">
            <span className="ed-mono lab">Ideas en movimiento · 01</span>
            {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
            <img src="/assets/astronauta.webp" alt="Astronauta de la marca Nicolás Monroy con visor que refleja montañas" loading="lazy" width={1266} height={1243} />
          </div>
          <div>
            <p className="ed-kicker ed-mono">Sobre mí</p>
            <h2 className="ed-display ed-h2 rv">Sobre<br />mí</h2>
            <p className="rv" style={{ fontSize: "clamp(20px, 2.1vw, 30px)", lineHeight: 1.3, marginTop: 30, maxWidth: 640 }}>
              Soy Nicolás Monroy Pabón, comunicador social y <span className="ed-serif">creative technologist</span>. Uno diseño, fotografía, video y código para que una marca se vea bien, se entienda y funcione.
            </p>
            <p className="rv muted" style={{ marginTop: 18, maxWidth: 560, lineHeight: 1.6 }}>
              He trabajado con campañas nacionales para Mobil 1™, centros comerciales, equipos de comunicación política y una empresa de construcción donde diseño y desarrollo sus herramientas internas. Hoy hago webs cinematográficas, identidades y contenido para marcas de Colombia y del exterior.
            </p>
            <a href="#experiencia" className="ed-link rv" style={{ marginTop: 26 }}>Conocer más <ArrowRight size={18} /></a>
            <div className="ed-stats rv">
              {STATS.map((s) => <div key={s.label}><b>{s.value}</b><span className="ed-mono">{s.label}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="ed-sec">
        <div className="ed-wrap">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 24, marginBottom: 56 }}>
            <div><p className="ed-kicker ed-mono">Servicios</p><h2 className="ed-display ed-h2 rv">Servicios</h2></div>
            <p className="muted rv" style={{ maxWidth: 380, lineHeight: 1.6 }}>Nueve formas de llevar tu marca a lo digital, con el mismo criterio de diseño de principio a fin.</p>
          </div>
          <div className="ed-services">
            {SERVICES.map((s, i) => {
              const Icon = ICONS[s.slug] ?? Layers;
              return (
                <Link key={s.slug} href={`/servicios/${s.slug}/`} className="ed-svc rv" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span style={{ display: "flex", justifyContent: "space-between" }}><Icon size={30} strokeWidth={1.5} /><span className="ed-mono">{pad(i + 1)}</span></span>
                  <h3>{s.name}</h3>
                  <p>{s.short}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Projects />

      {/* EXPERIENCIA */}
      <section id="experiencia" className="ed-sec">
        <div className="ed-wrap">
          <p className="ed-kicker ed-mono">Trayectoria</p>
          <h2 className="ed-display ed-h2 rv" style={{ marginBottom: 50 }}>Experiencia</h2>
          <ol className="ed-tl">
            {TIMELINE.map((t) => (
              <li key={t.role + t.years}>
                <span className="ed-mono muted">{t.years}</span>
                <div><h3>{t.role}</h3><span className="ed-mono org">{t.org}</span></div>
                <p className="muted" style={{ lineHeight: 1.6 }}>{t.text}</p>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}>
            <Link href="/cv/" className="ed-btn">Perfil profesional <ArrowUpRight size={18} /></Link>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" className="ed-btn">LinkedIn <ArrowUpRight size={18} /></a>
          </div>
        </div>
      </section>

      <Bitacora entries={entries} />

      {/* CONTACTO */}
      <section id="contacto" className="ed-sec ed-contact" style={{ paddingBottom: 0 }}>
        <div className="ed-contact-art rv" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
          <img src="/assets/astronauta.webp" alt="" loading="lazy" width={1266} height={1243} />
        </div>
        <div className="ed-wrap">
          <p className="ed-kicker ed-mono">Contacto</p>
          <h2 className="ed-display ed-cta rv">Hablemos<br /><span className="l">de tu marca</span></h2>
          <div className="rv" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40, alignItems: "center" }}>
            <a href={waLink("Hola Nicolás, vi tu portafolio y quiero conversar sobre un proyecto.")} target="_blank" rel="noopener noreferrer" className="ed-btn lime"><MessageCircle size={18} /> Escribir por WhatsApp</a>
            <a href={`mailto:${CONTACT.email}`} className="ed-btn">{CONTACT.email}</a>
            <a href={CONTACT.calendly} target="_blank" rel="noopener noreferrer" className="ed-btn">Llamada de 15 min</a>
          </div>
          <div className="ed-socials">
            {([["Instagram", SOCIAL.instagram], ["LinkedIn", SOCIAL.linkedin], ["Behance", SOCIAL.behance], ["Adobe Portfolio", SOCIAL.adobe], ["GitHub", SOCIAL.github]] as const).map(([n, h]) => (
              <a key={n} href={h} target="_blank" rel="noopener noreferrer">{n} <ArrowUpRight size={18} /></a>
            ))}
          </div>
          <footer className="ed-foot ed-mono">
            <span>© {new Date().getFullYear()} Nicolás Monroy Pabón</span>
            <span style={{ display: "flex", gap: 20, flexWrap: "wrap" }}><Link href="/huila/">Huila</Link><Link href="/cv/">CV</Link><Link href="/carta/">Carta</Link><a href="#inicio">Arriba ↑</a></span>
          </footer>
        </div>
      </section>
    </div>
  );
}

function Projects() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<number | null>(null);
  const n = WORKS.length;
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n]);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 5200);
    return () => clearInterval(t);
  }, [paused, go, i]);
  const w = WORKS[i];
  return (
    <section id="proyectos" className="ed-sec" style={{ background: "var(--k2)" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="ed-wrap">
        <p className="ed-kicker ed-mono">Proyectos seleccionados</p>
        <div className="ed-slider">
          <div>
            <h2 className="ed-display ed-slide-title"><span key={w.slug}>{w.title}</span></h2>
            <p className="ed-mono" style={{ color: "var(--l)", margin: "18px 0 12px" }}>{w.kind} · {w.year}</p>
            <p className="muted" style={{ maxWidth: 420, lineHeight: 1.6, minHeight: "3.2em" }}>{w.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30 }}>
              <span className="ed-count" aria-live="polite">{pad(i + 1)} <small>/ {pad(n)}</small></span>
              <button className="ed-sq" aria-label="Proyecto anterior" onClick={() => go(-1)}><ArrowLeft size={20} /></button>
              <button className="ed-sq" aria-label="Proyecto siguiente" onClick={() => go(1)}><ArrowRight size={20} /></button>
              <a href={w.href} target="_blank" rel="noopener noreferrer" className="ed-link" style={{ marginLeft: 8 }}>Ver en Behance <ArrowUpRight size={16} /></a>
            </div>
            <div className="ed-progress" style={{ marginTop: 26 }}><b style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
          </div>
          <div
            className="ed-slide-media"
            onPointerDown={(e) => { drag.current = e.clientX; }}
            onPointerUp={(e) => { if (drag.current !== null && Math.abs(e.clientX - drag.current) > 40) go(e.clientX < drag.current ? 1 : -1); drag.current = null; }}
          >
            {WORKS.map((x, k) => (
              // eslint-disable-next-line @next/next/no-img-element -- export estático
              <img key={x.slug} src={`/assets/work/${x.slug}.webp`} alt={k === i ? `Portada del proyecto ${x.title}` : ""} className={k === i ? "on" : ""} loading={k < 2 ? "eager" : "lazy"} draggable={false} style={{ zIndex: k === i ? 2 : 1 }} />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", margin: "110px 0 34px", gap: 20, flexWrap: "wrap" }}>
          <h2 className="ed-display rv" style={{ fontSize: "clamp(46px, 7vw, 110px)" }}>Trabajos<br />destacados</h2>
          <a href={SOCIAL.behance} target="_blank" rel="noopener noreferrer" className="ed-sq" aria-label="Ver todo en Behance" style={{ width: 64, height: 64 }}><ArrowRight size={26} /></a>
        </div>
        <div className="ed-feat">
          {WORKS.slice(0, 3).map((x, k) => (
            <a key={x.slug} href={x.href} target="_blank" rel="noopener noreferrer" className="ed-card rv" style={{ transitionDelay: `${k * 120}ms` }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
              <img src={`/assets/work/${x.slug}.webp`} alt={`Proyecto ${x.title}`} loading="lazy" />
              <span className="arrow"><ArrowRight size={20} /></span>
              <span className="cap"><span className="ed-mono" style={{ color: "var(--l)" }}>{x.kind}</span><h3>{x.title}</h3></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const noop = () => () => {};
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

function Bitacora({ entries }: { entries: Entry[] }) {
  const sorted = useMemo(() => [...entries].sort((a, b) => b.fecha.localeCompare(a.fecha)), [entries]);
  const tipos = useMemo(() => ["Todo", ...Array.from(new Set(sorted.map((e) => e.tipo)))], [sorted]);
  const [f, setF] = useState("Todo");
  const [n, setN] = useState(6);
  const today = useSyncExternalStore(noop, todayStr, () => "");
  const list = sorted.filter((e) => f === "Todo" || e.tipo === f);
  return (
    <section id="bitacora" className="ed-sec paper">
      <div className="ed-wrap">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 24, marginBottom: 40 }}>
          <div><p className="ed-kicker ed-mono">Actualizado {sorted[0] ? fmt(sorted[0].fecha) : ""}</p><h2 className="ed-display ed-h2 rv">Bitácora</h2></div>
          <p className="muted rv" style={{ maxWidth: 380, lineHeight: 1.6 }}>Lo que estoy diseñando y construyendo, día a día. Nuevos proyectos, pruebas y lanzamientos.</p>
        </div>
        <div className="ed-filter" role="group" aria-label="Filtrar bitácora">
          {tipos.map((t) => <button key={t} aria-pressed={f === t} onClick={() => { setF(t); setN(6); }}>{t}</button>)}
        </div>
        <ul className="ed-log">
          {list.slice(0, n).map((e) => {
            const inner = (
              <>
                <span className="pic">
                  {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
                  {e.imagen && <img src={e.imagen} alt="" loading="lazy" />}
                </span>
                <span>
                  <span className="ed-mono muted">{fmt(e.fecha)} · {e.tipo}{e.fecha === today && <span className="ed-today">Hoy</span>}</span>
                  <h3>{e.titulo}</h3>
                  <span className="muted" style={{ fontSize: 14, lineHeight: 1.5, display: "block" }}>{e.texto}</span>
                </span>
              </>
            );
            return (
              <li key={e.fecha + e.titulo}>
                {e.enlace ? <a href={e.enlace} target={e.enlace.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="ed-entry">{inner}</a> : <div className="ed-entry">{inner}</div>}
              </li>
            );
          })}
        </ul>
        {list.length > n && <button className="ed-btn" style={{ marginTop: 26, borderColor: "var(--k)" }} onClick={() => setN(n + 6)}>Ver más entradas</button>}
      </div>
    </section>
  );
}
