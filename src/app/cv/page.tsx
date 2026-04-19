'use client';

import { Mail, Phone, MapPin, Globe, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

/** Lucide removió los logos de marca en versiones recientes; replicamos
 *  los dos que necesitamos como SVG inline para no depender de otro pkg. */
const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
  </svg>
);
const GithubIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.01-.02-1.98-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.67.8.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);

/**
 * CV web · Nicolás Monroy Pabón
 * ──────────────────────────────
 * Diseño pensado para dos audiencias:
 *  1. Reclutadores que leen online → versión web dark con acentos acid.
 *  2. Reclutadores que imprimen/descargan PDF → `@media print` invierte
 *     la paleta a blanco + tinta y ajusta márgenes A4.
 *
 * La generación del PDF la hace `print.js` con Playwright contra el HTML
 * estático (`out/cv.html`) — no dependemos de window.print() del usuario
 * para la versión descargable oficial.
 */

export default function CVPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --c-bg: #0A0A0A;
          --c-bg-2: #111111;
          --c-bg-3: #191919;
          --c-ink: #F2EFE8;
          --c-ink-dim: #8A8A85;
          --c-line: #262626;
          --c-acid: #C6FF3D;
        }

        .cv-shell {
          background: var(--c-bg);
          color: var(--c-ink);
          min-height: 100vh;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .cv-shell .cv-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 50px 80px;
          position: relative;
          background: var(--c-bg);
          overflow: hidden;
        }

        /* Identity Mark & Decorative Rail */
        .cv-shell .mark-block {
          margin-bottom: 48px;
        }
        .cv-shell .mark-block .tag {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--c-ink-dim); letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 12px;
        }
        .cv-shell .mark-block .mark {
          font-size: 64px; font-weight: 700; letter-spacing: -0.055em; line-height: 0.84; color: var(--c-ink); margin: 0;
        }
        .cv-shell .mark-block .mark span { color: var(--c-acid); }

        .cv-shell .side-rail {
          position: absolute; right: 20px; top: 40px; bottom: 40px; width: 2px;
          background: linear-gradient(to bottom, var(--c-acid) 20px, transparent 20px) repeat-y;
          background-size: 1px 40px; opacity: 0.15;
        }

        /* Top command bar (hidden on print) */
        .cv-shell .cmd-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 24px; border: 1px solid var(--c-line); background: var(--c-bg-2);
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-ink-dim);
          margin-bottom: 48px; position: sticky; top: 0; z-index: 50;
        }
        .cv-shell .cmd-bar .dot { display: inline-block; width: 8px; height: 8px; background: var(--c-acid); border-radius: 50%; margin-right: 8px; animation: cvPulse 2s ease-in-out infinite; }
        @keyframes cvPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .cv-shell .cmd-bar a { color: var(--c-ink); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .cv-shell .cmd-bar a:hover { color: var(--c-acid); }
        .cv-shell .cmd-bar .actions { display: flex; gap: 16px; align-items: center; }
        .cv-shell .cmd-bar button {
          background: var(--c-acid); color: var(--c-bg); border: none;
          padding: 8px 14px; font: inherit; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em;
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        }
        .cv-shell .cmd-bar button:hover { filter: brightness(1.08); }

        /* Header */
        .cv-shell .hdr {
          display: grid; grid-template-columns: 1fr auto; gap: 50px;
          padding-bottom: 40px; margin-bottom: 48px;
          border-bottom: 1px solid var(--c-line);
          position: relative;
        }
        .cv-shell .hdr h1 {
          font-size: clamp(48px, 6vw, 84px);
          font-weight: 700; letter-spacing: -0.05em; line-height: 0.88;
          margin: 0 0 20px;
        }
        .cv-shell .hdr .role {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--c-acid); font-weight: 500;
        }
        .cv-shell .hdr .contact {
          display: flex; flex-direction: column; gap: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: var(--c-ink-dim); letter-spacing: 0.04em;
        }
        .cv-shell .hdr .contact a {
          color: var(--c-ink-dim); text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          transition: color 0.2s;
        }
        .cv-shell .hdr .contact a:hover { color: var(--c-acid); }

        /* Two column layout */
        .cv-shell .body { display: grid; grid-template-columns: 320px 1fr; gap: 60px; }
        @media (max-width: 900px) {
          .cv-shell .body { grid-template-columns: 1fr; gap: 40px; }
          .cv-shell .hdr { grid-template-columns: 1fr; gap: 30px; }
          .cv-shell .cv-page { padding: 40px 24px; }
        }

        .cv-shell h2 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 600;
          color: var(--c-acid); text-transform: uppercase; letter-spacing: 0.24em;
          margin: 0 0 20px; padding-bottom: 12px;
          border-bottom: 1px solid var(--c-line);
          display: flex; align-items: center; gap: 10px;
        }
        .cv-shell h2::before { content: "//"; font-size: 11px; color: var(--c-acid); opacity: 0.6; }

        .cv-shell section { margin-bottom: 48px; }

        /* Sidebar */
        .cv-shell .side p { font-size: 13px; line-height: 1.6; color: var(--c-ink-dim); margin: 0; }
        .cv-shell .side ul { list-style: none; padding: 0; margin: 0; font-size: 12px; }
        .cv-shell .side ul li {
          padding: 8px 0; border-bottom: 1px dashed var(--c-line);
          display: flex; justify-content: space-between; gap: 12px;
          font-family: 'JetBrains Mono', monospace; color: var(--c-ink);
        }
        .cv-shell .side ul li:last-child { border-bottom: 0; }
        .cv-shell .side ul li span:last-child {
          color: var(--c-ink-dim); font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .cv-shell .lang-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px dashed var(--c-line);
          font-size: 12px;
        }
        .cv-shell .lang-row:last-child { border-bottom: 0; }
        .cv-shell .lang-row .bar {
          display: inline-flex; gap: 3px;
        }
        .cv-shell .lang-row .bar .seg {
          width: 14px; height: 4px; background: var(--c-line);
        }
        .cv-shell .lang-row .bar .seg.on { background: var(--c-acid); }

        /* Main */
        .cv-shell .main .entry {
          position: relative; padding: 0 0 28px 20px;
          border-left: 1px solid var(--c-line);
          margin-left: 4px;
        }
        .cv-shell .main .entry::before {
          content: ""; position: absolute; left: -5px; top: 4px;
          width: 9px; height: 9px; background: var(--c-bg);
          border: 2px solid var(--c-acid); border-radius: 50%;
        }
        .cv-shell .main .entry:last-child { padding-bottom: 0; border-left-color: transparent; }
        .cv-shell .entry .meta {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: 16px; flex-wrap: wrap; margin-bottom: 6px;
        }
        .cv-shell .entry .role-title {
          font-size: 17px; font-weight: 700; color: var(--c-ink);
          letter-spacing: -0.015em;
        }
        .cv-shell .entry .date {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); letter-spacing: 0.14em;
          text-transform: uppercase; white-space: nowrap;
          padding: 3px 8px; border: 1px solid var(--c-line);
          background: var(--c-bg-2);
        }
        .cv-shell .entry .company {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: var(--c-acid); letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 12px; font-weight: 500;
        }
        .cv-shell .entry ul {
          list-style: none; padding: 0; margin: 0;
          font-size: 13px; line-height: 1.55; color: var(--c-ink-dim);
        }
        .cv-shell .entry ul li {
          padding-left: 16px; position: relative; margin-bottom: 6px;
        }
        .cv-shell .entry ul li::before {
          content: "→"; position: absolute; left: 0; top: 0;
          color: var(--c-acid); font-size: 11px;
        }

        /* Projects grid */
        .cv-shell .prj-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .cv-shell .prj {
          padding: 16px 20px; border: 1px solid var(--c-line);
          background: var(--c-bg-2);
          transition: border-color 0.2s, transform 0.2s;
        }
        .cv-shell .prj:hover { border-color: var(--c-acid); transform: translateX(2px); }
        .cv-shell .prj .prj-name {
          font-size: 14px; font-weight: 700; color: var(--c-ink);
          margin-bottom: 4px; letter-spacing: -0.015em;
        }
        .cv-shell .prj .prj-tags {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-acid); letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .cv-shell .prj p { font-size: 12px; line-height: 1.55; color: var(--c-ink-dim); margin: 0; }

        /* Footer */
        .cv-shell .ftr {
          margin-top: 48px; padding-top: 20px;
          border-top: 1px solid var(--c-line);
          display: flex; justify-content: space-between; gap: 16px;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); letter-spacing: 0.14em;
          text-transform: uppercase; flex-wrap: wrap;
        }

        /* ────────────  REVEAL ANIMATIONS ─────────── */
        @keyframes cvRise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cv-shell .hdr, .cv-shell section, .cv-shell .ftr {
          animation: cvRise 0.6s ease-out both;
        }
        .cv-shell section:nth-of-type(1) { animation-delay: 0.05s; }
        .cv-shell section:nth-of-type(2) { animation-delay: 0.12s; }
        .cv-shell section:nth-of-type(3) { animation-delay: 0.18s; }
        .cv-shell section:nth-of-type(4) { animation-delay: 0.24s; }
        .cv-shell section:nth-of-type(5) { animation-delay: 0.30s; }
        .cv-shell section:nth-of-type(6) { animation-delay: 0.36s; }
        @media (prefers-reduced-motion: reduce) {
          .cv-shell .hdr, .cv-shell section, .cv-shell .ftr { animation: none; }
          .cv-shell .cmd-bar .dot { animation: none; }
        }

        /* ────────────  PRINT (A4) ─────────── */
        @media print {
          @page { size: A4; margin: 0; }
          html, body { 
            background: #000000 !important; 
            margin: 0 !important; padding: 0 !important; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            font-size: 11px !important;
            color: #F2EFE8 !important;
          }
          
          .cmd-bar, .screen-only, .scroll-indicator, button, .lucide { display: none !important; }
          body::before { display: none !important; }

          .cv-shell { background: #000000 !important; }
          .cv-shell .cv-page { width: 100% !important; padding: 0 !important; margin: 0 !important; }
          
          .print-page {
            width: 210mm !important; 
            height: 297mm !important;
            padding: 20mm 22mm !important;
            box-sizing: border-box !important;
            page-break-after: always !important;
            background: #000000 !important;
            position: relative !important;
            overflow: hidden !important;
          }

          .cv-shell .hdr h1 { font-size: 44px !important; line-height: 0.9 !important; }
          .cv-shell .mark-block .mark { font-size: 54px !important; }
          
          .cv-shell .body { 
            display: flex !important; 
            gap: 40px !important;
          }
          .cv-shell .side { width: 220px !important; flex-shrink: 0 !important; }
          .cv-shell .main { flex: 1 !important; }

          .cv-shell section { margin-bottom: 30px !important; }
          .cv-shell h2 { font-size: 11px !important; border-bottom: 1px solid var(--c-line) !important; padding-bottom: 8px !important; }
          
          .entry { break-inside: avoid !important; margin-bottom: 24px !important; }
          .prj { break-inside: avoid !important; }

          .ftr {
            position: absolute !important;
            bottom: 20mm !important; left: 22mm !important; right: 22mm !important;
            padding-top: 15px !important;
            border-top: 1px solid var(--c-line) !important;
            font-size: 8px !important;
          }
          
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}}/>

      <div className="cv-shell">
        <div className="cv-page">
          <div className="side-rail"></div>

          {/* ─────────── COMMAND BAR ─────────── */}
          <div className="cmd-bar screen-only">
            <div>
              <span className="dot"></span>
              <strong style={{color:"var(--c-ink)",fontWeight:500}}>NICOLASDEV</strong>
              &nbsp;/ BRAND OS v1.0 / CURRICULUM VITAE
            </div>
            <div className="actions">
              <Link href="/"><ArrowLeft size={12}/> VOLVER</Link>
              <button onClick={() => window.print()}>
                <Printer size={12}/> EXPORTAR PDF
              </button>
            </div>
          </div>

          {/* ─────────── PAGE 1: IDENTITY & MANIFESTO ─────────── */}
          <div className="print-page page-1">
            <div className="mark-block">
              <div className="tag">[ IDENTITY / CORE SYSTEM ]</div>
              <h2 className="mark">nicolas<span>●</span>dev</h2>
            </div>

            <header className="hdr">
              <div>
                <h1>Nicolás<br/>Monroy Pabón<span style={{color:"var(--c-acid)"}}>.</span></h1>
                <div className="role">Full Stack Developer &amp; AI Specialist</div>
              </div>
              <div className="contact">
                <a href="mailto:nicolasmonroypabon@gmail.com"><Mail size={12}/> nicolasmonroypabon@gmail.com</a>
                <a href="https://wa.me/573150135016" target="_blank" rel="noopener noreferrer"><Phone size={12}/> +57 315 0135016</a>
                <div style={{display:"flex",alignItems:"center",gap:8}}><MapPin size={12}/> Bogotá, Colombia (GMT-5)</div>
                <a href="https://nicolasdev.com" target="_blank" rel="noopener noreferrer"><Globe size={12}/> nicolasdev.com</a>
                <a href="https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/" target="_blank" rel="noopener noreferrer"><LinkedinIcon size={12}/> /in/nicolas-monroy-pabón</a>
              </div>
            </header>

            <div className="manifesto-block" style={{ marginBottom: "60px" }}>
              <div className="tag" style={{ color: "var(--c-acid)", marginBottom: "20px" }}>// MANIFESTO</div>
              <p style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.04em", maxWidth: "600px" }}>
                "Diseño lo que construyo.<br/>
                Construyo lo que diseño.<br/>
                <span className="text-acid" style={{ color: "var(--c-acid)" }}>La creatividad es una función técnica.</span>"
              </p>
            </div>

            <div className="body">
              <aside className="side">
                <section>
                  <h2>Perfil Híbrido</h2>
                  <p>
                    Comunicador Social Profesional y Desarrollador Full Stack. Diseño narrativas funcionales con visión estratégica. Me especializo en orquestar soluciones de IA (Gemini, Claude, GPT) en infraestructuras de producción real para el sector B2B.
                  </p>
                </section>
                <section>
                  <h2>Impacto / Sistema</h2>
                  <div style={{ display: "grid", gap: "10px", marginTop: "15px" }}>
                    <div style={{ border: "1px solid var(--c-line)", padding: "10px", background: "var(--c-bg-2)" }}>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--c-acid)" }}>-85%</div>
                      <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ahorro en tareas manuales</div>
                    </div>
                    <div style={{ border: "1px solid var(--c-line)", padding: "10px", background: "var(--c-bg-2)" }}>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--c-acid)" }}>14+</div>
                      <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Proyectos Live</div>
                    </div>
                    <div style={{ border: "1px solid var(--c-line)", padding: "10px", background: "var(--c-bg-2)" }}>
                      <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--c-acid)" }}>10K+</div>
                      <div style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Usuarios en Producción</div>
                    </div>
                  </div>
                </section>
              </aside>
              <main className="main">
                 <section>
                    <h2>Stack Principal</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <ul>
                          <li><span>React / Next.js</span><span>PRO</span></li>
                          <li><span>TypeScript</span><span>PRO</span></li>
                          <li><span>Node.js / Express</span><span>PRO</span></li>
                          <li><span>Python / Flask</span><span>PRO</span></li>
                        </ul>
                        <ul>
                          <li><span>Kotlin / Compose</span><span>INT</span></li>
                          <li><span>PostgreSQL</span><span>PRO</span></li>
                          <li><span>Electron</span><span>INT</span></li>
                          <li><span>Tailwind / UI-UX</span><span>PRO</span></li>
                        </ul>
                    </div>
                 </section>
              </main>
            </div>
          </div>

          {/* ─────────── PAGE 2: NARRATIVE (EXPERIENCE) ─────────── */}
          <div className="print-page page-2" style={{ breakBefore: "page" }}>
            <div className="body">
              <main className="main" style={{ marginLeft: 0 }}>
                <section>
                  <h2>Experiencia Profesional</h2>

                  <div className="entry">
                    <div className="meta">
                      <span className="role-title">Design Strategist &amp; Full Stack Developer</span>
                      <span className="date">MAR 2025 — PRESENTE</span>
                    </div>
                    <div className="company">MIP International Trading SAS · Bogotá</div>
                    <ul>
                      <li>Lidero la transformación digital integral de la compañía, uniendo diseño de marca con arquitectura técnica.</li>
                      <li>Construí el <strong style={{color:"var(--c-ink)"}}>ERP Supply Chain</strong> con firma digital Certicámara, aprobaciones multi-nivel y orquestación de datos para compras internacionales.</li>
                      <li>Desarrollé <strong style={{color:"var(--c-ink)"}}>ProveedHub</strong>, plataforma con IA generativa (Gemini API) para la validación automática de documentos legales, reduciendo errores humanos en un 90%.</li>
                    </ul>
                  </div>

                  <div className="entry">
                    <div className="meta">
                      <span className="role-title">Digital Products Coordinator</span>
                      <span className="date">ENE 2025 — MAR 2025</span>
                    </div>
                    <div className="company">Partido Cambio Radical · Bogotá</div>
                    <ul>
                      <li>Coordinación de activos digitales nacionales y despliegue de plataformas de formación política con alto tráfico.</li>
                      <li>Gestión de ecosistemas multimedia y herramientas de capacitación digital masiva.</li>
                    </ul>
                  </div>

                  <div className="entry">
                    <div className="meta">
                      <span className="role-title">Trade Mark Coordinator</span>
                      <span className="date">MAR 2024 — OCT 2024</span>
                    </div>
                    <div className="company">Districol LTDA · Bogotá</div>
                    <ul>
                      <li>Liderazgo de marca técnica para una de las mayores distribuidoras de hidrocarburos en Colombia.</li>
                      <li>Conversión de activos físicos a narrativas digitales coherentes para B2B.</li>
                    </ul>
                  </div>
                </section>
              </main>
            </div>
          </div>

          {/* ─────────── PAGE 3: ENGINEERING (PROJECTS & EDU) ─────────── */}
          <div className="print-page page-3" style={{ breakBefore: "page" }}>
            <div className="body">
              <aside className="side">
                <section>
                  <h2>Idiomas</h2>
                  <div className="lang-row"><span>Español</span><span className="bar"><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span></span></div>
                  <div className="lang-row"><span>Inglés (B2)</span><span className="bar"><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg"></span></span></div>
                </section>
                <section>
                    <h2>IA &amp; APIs</h2>
                    <ul>
                      <li><span>Claude API</span><span>PRO</span></li>
                      <li><span>Gemini API</span><span>PRO</span></li>
                      <li><span>OpenAI API</span><span>INT</span></li>
                    </ul>
                </section>
              </aside>
              <main className="main">
                <section>
                  <h2>Sistemas en Producción (Proyectos)</h2>
                  <div className="prj-grid">
                    <div className="prj">
                      <div className="prj-name">ProveedHub AI Platform</div>
                      <p>Validación automática de RUT y Cámara de Comercio mediante Computer Vision y LLMs.</p>
                    </div>
                    <div className="prj">
                      <div className="prj-name">Supply Chain ERP</div>
                      <p>Gestión de comercio exterior con flujos de aprobación y firma electrónica legalizada.</p>
                    </div>
                    <div className="prj">
                      <div className="prj-name">Conquista la Ciudad</div>
                      <p>App nativa Android con Kotlin/Compose y Google Maps SDK para gamificación urbana.</p>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h2>Educación &amp; Formación</h2>
                  <div className="entry">
                    <div className="meta" style={{ borderBottom: "1px solid var(--c-line)", marginBottom: "6px" }}>
                      <span className="role-title" style={{ fontSize: "14px" }}>Comunicación Social (Profesional)</span>
                      <span className="date">GRADUADO</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--c-ink-dim)" }}>Base estratégica para diseño de producto y narrativas comerciales de alto nivel.</p>
                  </div>
                </section>

                <section>
                    <div className="prj" style={{borderColor:"var(--c-acid)",background:"rgba(198,255,61,0.04)"}}>
                      <div className="prj-name" style={{color:"var(--c-acid)"}}>● Disponibilidad Inmediata</div>
                      <p style={{ fontSize: "11px" }}>Full-time remoto (GMT-5). Abierto a retos en Bogotá y globales.</p>
                    </div>
                </section>
              </main>
            </div>
          </div>

          <footer className="ftr">
            <span>© 2026 · NICOLÁS MONROY PABÓN</span>
            <span>BRAND OS v1.0 · CREATIVIDAD ES UNA FUNCIÓN TÉCNICA</span>
            <span>REV. 2026.04.18 [3-PAGE-EDITION]</span>
          </footer>

        </div>
      </div>
    </>
  );
}
