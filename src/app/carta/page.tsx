'use client';

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export default function CartaPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --c-bg: #0A0A0A;
          --c-ink: #F2EFE8;
          --c-ink-dim: #8A8A85;
          --c-line: #262626;
          --c-acid: #C6FF3D;
        }

        .carta-container { 
            background: #1a1a1a; 
            color: var(--c-ink); 
            -webkit-font-smoothing: antialiased; 
            min-height: 100vh;
            padding-top: 1px;
            padding-bottom: 40px;
        }

        @page { size: A4; margin: 0; }

        .carta-container .page-wrap { max-width: 900px; margin: 40px auto; padding: 0 20px; }
        .carta-container .page {
          width: 210mm; min-height: 297mm;
          background: var(--c-bg);
          color: var(--c-ink);
          margin: 0 auto 30px;
          padding: 22mm 20mm;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
          page-break-after: always;
          display: flex;
          flex-direction: column;
        }

        /* Topbar tools */
        .print-bar {
          position: fixed; top: 16px; right: 16px; z-index: 100;
          display: flex; gap: 8px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .print-bar button {
          background: var(--c-acid); color: var(--c-bg); border: none;
          padding: 10px 14px; cursor: pointer; font-family: inherit; font-size: inherit;
          letter-spacing: inherit; font-weight: 600;
          display: flex; align-items: center; gap: 6px;
        }
        .print-bar .alt { background: var(--c-bg); color: var(--c-ink); border: 1px solid var(--c-line); }
        .print-bar button:hover { filter: brightness(1.1); }

        /* ========== HEADER ========== */
        .carta-container .doc-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding-bottom: 14px; border-bottom: 1px solid var(--c-line);
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); text-transform: uppercase; letter-spacing: 0.14em;
        }
        .carta-container .doc-head .left { display: flex; align-items: center; gap: 10px; }
        .carta-container .doc-head .dot { width: 7px; height: 7px; background: var(--c-acid); border-radius: 50%; box-shadow: 0 0 8px var(--c-acid); }
        .carta-container .doc-head strong { color: var(--c-ink); font-weight: 500; }

        .carta-container .doc-foot {
          margin-top: auto;
          padding-top: 14px; border-top: 1px solid var(--c-line);
          display: flex; justify-content: space-between;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); text-transform: uppercase; letter-spacing: 0.12em;
        }

        /* ========== PAGE 1 : COVER ========== */
        .carta-container .cover-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 28px 0; }
        .carta-container .cover-meta { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .carta-container .cover-meta .field { border-top: 1px solid var(--c-line); padding-top: 10px; }
        .carta-container .cover-meta .field .k { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--c-ink-dim); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 4px; }
        .carta-container .cover-meta .field .v { font-size: 12px; font-weight: 500; }
        .carta-container .cover-meta .field .v.acid { color: var(--c-acid); }

        .carta-container .cover-mark {
          font-size: 92px;
          font-weight: 700;
          letter-spacing: -0.055em;
          line-height: 0.84;
          color: var(--c-ink);
          margin: 14px 0 10px;
        }
        .carta-container .cover-mark .dot { color: var(--c-acid); }

        .carta-container .cover-tag {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--c-ink-dim); letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 34px;
        }

        .carta-container .cover-headline {
          font-size: 54px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 0.95;
          max-width: 18ch;
          margin-bottom: 28px;
        }
        .carta-container .cover-headline .hl { background: var(--c-acid); color: var(--c-bg); padding: 0 0.12em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }

        .carta-container .cover-lede {
          font-size: 14px;
          line-height: 1.55;
          max-width: 52ch;
          color: var(--c-ink);
        }

        .carta-container .cover-chips {
          margin-top: 20px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .carta-container .chip {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          padding: 4px 9px; border: 1px solid var(--c-line);
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-ink-dim);
        }
        .carta-container .chip.on { background: var(--c-acid); color: var(--c-bg); border-color: var(--c-acid); font-weight: 500; }

        .carta-container .cover-bottom {
          display: grid; grid-template-columns: 1fr auto; gap: 40px;
          align-items: flex-end;
        }
        .carta-container .cover-signature {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--c-ink-dim); letter-spacing: 0.1em; line-height: 1.7;
          text-transform: uppercase;
        }
        .carta-container .cover-signature strong { color: var(--c-ink); font-weight: 500; }
        .carta-container .cover-signature .line { display: inline-block; width: 120px; height: 1px; background: var(--c-acid); vertical-align: middle; margin: 0 8px; }

        .carta-container .cover-seal {
          width: 120px; height: 120px;
          border: 1.5px solid var(--c-acid);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          color: var(--c-acid);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.1em; text-align: center;
          position: relative;
        }
        .carta-container .cover-seal .big { font-family: 'Space Grotesk', sans-serif; font-size: 30px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
        .carta-container .cover-seal::before {
          content: ""; position: absolute; inset: 6px;
          border: 1px dashed rgba(198,255,61,0.3); border-radius: 50%;
        }

        /* ========== PAGE 2 : LETTER ========== */
        .carta-container .letter-head {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          padding: 28px 0 24px;
          border-bottom: 1px solid var(--c-line);
          margin-bottom: 28px;
        }
        .carta-container .letter-head .from strong, .carta-container .letter-head .to strong {
          display: block; font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: var(--c-acid);
          text-transform: uppercase; letter-spacing: 0.16em;
          margin-bottom: 10px;
        }
        .carta-container .letter-head .from p, .carta-container .letter-head .to p {
          font-size: 12px; line-height: 1.65; color: var(--c-ink-dim);
        }
        .carta-container .letter-head .from p .ink { color: var(--c-ink); font-weight: 500; }

        .carta-container .letter-subject {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); text-transform: uppercase; letter-spacing: 0.14em;
          margin-bottom: 8px;
        }
        .carta-container .letter-title {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 0.95;
          margin-bottom: 28px;
        }
        .carta-container .letter-title .acid { color: var(--c-acid); }

        .carta-container .letter-body p {
          font-size: 13px;
          line-height: 1.65;
          margin-bottom: 14px;
          max-width: 62ch;
          color: var(--c-ink);
        }
        .carta-container .letter-body p .hl { background: var(--c-acid); color: var(--c-bg); padding: 0 0.2em; font-weight: 500; }
        .carta-container .letter-body p strong { color: var(--c-acid); font-weight: 500; }

        .carta-container .letter-list {
          margin: 10px 0 18px;
          padding: 14px 0;
          border-top: 1px solid var(--c-line);
          border-bottom: 1px solid var(--c-line);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 24px;
        }
        .carta-container .letter-list .item { display: grid; grid-template-columns: 36px 1fr; gap: 10px; align-items: baseline; }
        .carta-container .letter-list .item .n { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--c-acid); letter-spacing: 0.08em; }
        .carta-container .letter-list .item .t { font-size: 11.5px; line-height: 1.5; }
        .carta-container .letter-list .item .t strong { display: block; font-weight: 600; color: var(--c-ink); margin-bottom: 1px; }
        .carta-container .letter-list .item .t span { color: var(--c-ink-dim); }

        .carta-container .letter-kpis {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: var(--c-line); border: 1px solid var(--c-line);
          margin: 20px 0 22px;
        }
        .carta-container .letter-kpis .kpi { background: var(--c-bg); padding: 14px 16px; }
        .carta-container .letter-kpis .kpi .l { font-family: 'JetBrains Mono', monospace; font-size: 8px; color: var(--c-ink-dim); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; }
        .carta-container .letter-kpis .kpi .v { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
        .carta-container .letter-kpis .kpi .v .u { font-size: 0.42em; color: var(--c-acid); margin-left: 3px; font-weight: 500; }

        .carta-container .letter-sig {
          display: grid; grid-template-columns: auto 1fr auto; gap: 24px; align-items: center;
          padding-top: 22px; border-top: 1px solid var(--c-line);
          margin-top: 18px;
        }
        .carta-container .letter-sig .name-block .big { font-size: 26px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
        .carta-container .letter-sig .name-block .big .dot { color: var(--c-acid); }
        .carta-container .letter-sig .name-block .role { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--c-ink-dim); letter-spacing: 0.14em; text-transform: uppercase; margin-top: 4px; }
        .carta-container .letter-sig .scribble { font-family: 'Space Grotesk', sans-serif; font-style: italic; font-weight: 500; font-size: 38px; color: var(--c-acid); transform: rotate(-6deg); letter-spacing: -0.03em; }
        .carta-container .letter-sig .date { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--c-ink-dim); letter-spacing: 0.14em; text-transform: uppercase; text-align: right; line-height: 1.7; }

        /* Cover right-side rail */
        .carta-container .cover-rail {
          position: absolute; right: 6mm; top: 22mm; bottom: 22mm;
          width: 10mm;
          display: flex; flex-direction: column; justify-content: space-between;
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          color: var(--c-ink-dim); letter-spacing: 0.2em; text-transform: uppercase;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .carta-container .cover-rail .acid { color: var(--c-acid); }

        @media print {
          html, body { background: white; margin: 0; padding: 0; }
          body::before { display: none !important; } /* Ocultar grain global */
          
          .carta-container { padding: 0; background: transparent; }
          .carta-container .page-wrap { margin: 0; padding: 0; max-width: none; }
          .carta-container .page {
             margin: 0; box-shadow: none; width: 210mm; height: 297mm; min-height: 297mm; border: none;
             /* Ensure exact reproduction on printing engines */
             -webkit-print-color-adjust: exact;
             print-color-adjust: exact;
          }
          .print-bar { display: none; }
        }
      `}} />

      <div className="carta-container">
        
        <div className="print-bar">
          <button onClick={() => window.print()}><Printer size={14} /> GUARDAR COMO PDF</button>
          <Link href="/" className="alt"><ArrowLeft size={14} /> VOLVER A PORTAFOLIO</Link>
        </div>

        <div className="page-wrap">
          {/* ==================== PAGE 1 : COVER ==================== */}
          <article className="page" data-screen-label="P1 Portada">
            <header className="doc-head">
              <div className="left"><span className="dot"></span><strong>NICOLASDRAWN</strong><span>CARTA DE PRESENTACIÓN</span></div>
              <div>DOC-001 · REV 2026.04 · 01 / 02</div>
            </header>

            <div className="cover-rail">
              <span>NICOLÁS MONROY PABÓN — COVER LETTER</span>
              <span className="acid">● DISPONIBLE</span>
            </div>

            <div className="cover-body">
              <div>
                <div className="cover-tag">[ COVER LETTER · BOGOTÁ · 2026 ]</div>
                <div className="cover-mark">nicolas<span className="dot">●</span>drawn</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "var(--c-ink-dim)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Full Stack Developer &nbsp;&amp;&nbsp; AI Specialist
                </div>
              </div>

              <div>
                <div className="cover-headline">
                  Código en producción. <br/><span className="hl">IA aplicada, no demos.</span>
                </div>
                <p className="cover-lede">
                  Soy <strong style={{ color: "var(--c-ink)", fontWeight: 600 }}>Nicolás Monroy Pabón</strong>. Comunicador Social de profesión, Full Stack Developer &amp; AI Specialist de ejecución. Trabajo en la intersección exacta entre <strong style={{ color: "var(--c-acid)", fontWeight: 500 }}>arquitectura técnica robusta</strong> e <strong style={{ color: "var(--c-acid)", fontWeight: 500 }}>implementación estratégica de IA generativa</strong> — Gemini, Claude, OpenAI — en entornos de producción real.
                </p>
                <div className="cover-chips">
                  <span className="chip on">React / Next.js</span>
                  <span className="chip on">Node · Python</span>
                  <span className="chip on">AI / LLMs</span>
                  <span className="chip">ERPs</span>
                  <span className="chip">B2B</span>
                  <span className="chip">Electron</span>
                  <span className="chip">Kotlin · Compose</span>
                  <span className="chip">PostgreSQL</span>
                </div>
              </div>

              <div className="cover-meta">
                <div className="field"><div className="k">De</div><div className="v">Nicolás Monroy P.</div></div>
                <div className="field"><div className="k">Rol</div><div className="v">Full Stack · AI</div></div>
                <div className="field"><div className="k">Base</div><div className="v">Bogotá · Colombia</div></div>
                <div className="field"><div className="k">Estado</div><div className="v acid">● Disponible</div></div>
              </div>

              <div className="cover-bottom">
                <div className="cover-signature">
                  <div><strong>NICOLÁS MONROY PABÓN</strong> <span className="line"></span> <strong>@NICOLASDRAWN</strong></div>
                  <div style={{ marginTop: "6px" }}>NICOLASMONROYPABON@GMAIL.COM &nbsp;·&nbsp; +57 315 0135016 &nbsp;·&nbsp; NICOLASDRAWN.PW</div>
                </div>
                <div className="cover-seal">
                  <span style={{ fontSize: "8px" }}>ND</span>
                  <span className="big">v1.0</span>
                  <span style={{ fontSize: "8px" }}>BRAND OS</span>
                </div>
              </div>
            </div>

            <footer className="doc-foot">
              <span>© 2026 NICOLÁS MONROY PABÓN</span>
              <span>PALETA · ACID LIME #C6FF3D</span>
              <span>PÁGINA 01 / 02</span>
            </footer>
          </article>


          {/* ==================== PAGE 2 : LETTER ==================== */}
          <article className="page" data-screen-label="P2 Carta">
            <header className="doc-head">
              <div className="left"><span className="dot"></span><strong>NICOLASDRAWN</strong><span>CARTA DE PRESENTACIÓN</span></div>
              <div>DOC-001 · REV 2026.04 · 02 / 02</div>
            </header>

            <div className="letter-head">
              <div className="from">
                <strong>// DE</strong>
                <p>
                  <span className="ink">Nicolás Monroy Pabón &nbsp;/&nbsp; @nicolasdrawn</span><br/>
                  Full Stack Developer &amp; AI Specialist<br/>
                  Bogotá, D.C. · Colombia<br/>
                  nicolasmonroypabon@gmail.com · +57 315 0135016
                </p>
              </div>
              <div className="to">
                <strong>// PARA</strong>
                <p>
                  A la atención del equipo de Selección /<br/>
                  Dirección Técnica.<br/>
                  Empresas que buscan <span style={{ color: "var(--c-acid)" }}>IA aplicada</span>, ERPs serios y software en producción — no prototipos.
                </p>
              </div>
            </div>

            <div>
              <div className="letter-subject">ASUNTO / SUBJECT</div>
              <h1 className="letter-title">
                Perfil híbrido <span className="acid">−</span> comunicador y desarrollador <span className="acid">−</span> IA aplicada en producción real.
              </h1>
            </div>

            <div className="letter-body">
              <p>
                Me pongo en contacto para expresar mi firme interés en integrarme a su equipo como <strong>Full Stack Developer &amp; AI Specialist</strong>. Con más de 3 años desarrollando soluciones escalables, mi enfoque se centra en la intersección entre arquitectura técnica robusta e <span className="hl">implementación estratégica de IA</span> en entornos de producción.
              </p>

              <p>
                Mi perfil híbrido como <strong>Comunicador Social Profesional</strong> y <strong>Desarrollador Full Stack</strong> me permite escribir código eficiente en React, Node.js y Python, y articular las narrativas funcionales que un producto necesita para impactar. Mi práctica se mueve en <strong>cuatro frentes</strong>:
              </p>

              <div className="letter-list">
                <div className="item">
                  <span className="n">01 →</span>
                  <span className="t"><strong>ERPs Empresariales</strong><span>Supply chain, firma digital Certicámara, aprobaciones multi-nivel.</span></span>
                </div>
                <div className="item">
                  <span className="n">02 →</span>
                  <span className="t"><strong>IA Generativa Aplicada</strong><span>Gemini, Claude, OpenAI para validación y procesamiento documental.</span></span>
                </div>
                <div className="item">
                  <span className="n">03 →</span>
                  <span className="t"><strong>Portales B2B &amp; Full-Stack</strong><span>React · Next.js · Node · Python · PostgreSQL · JWT.</span></span>
                </div>
                <div className="item">
                  <span className="n">04 →</span>
                  <span className="t"><strong>Desktop &amp; Móvil Nativo</strong><span>Electron multiplataforma + Kotlin / Jetpack Compose.</span></span>
                </div>
              </div>

              <p>
                Entre mis logros recientes destaco <strong>ProveedHub</strong>, plataforma con LLMs (Gemini/Claude) para validación automática de documentos corporativos — RUT, Cámara de Comercio — desplegada en producción en MIP Trading y optimizando procesos operativos en más del 70%. También lidero el ERP Supply Chain con firma digital certificada y coordiné productos digitales en Partido Cambio Radical.
              </p>

              <div className="letter-kpis">
                <div className="kpi"><div className="l">Años de experiencia</div><div className="v">3<span className="u">+</span></div></div>
                <div className="kpi"><div className="l">Eficiencia ProveedHub</div><div className="v">+70<span className="u">%</span></div></div>
                <div className="kpi"><div className="l">Proyectos en producción</div><div className="v">3<span className="u">/3</span></div></div>
              </div>

              <p>
                Busco una oportunidad donde pueda aportar mi visión estratégica, mi capacidad para resolver problemas complejos y mi compromiso con código limpio y mantenible. Mi habilidad para <span className="hl">orquestar soluciones de IA</span> y mi experiencia desplegando software en producción aportarán valor inmediato a sus objetivos de innovación.
              </p>

              <p style={{ marginTop: "18px", color: "var(--c-ink-dim)", fontSize: "12px" }}>
                Agradezco de antemano su tiempo. Quedo a su entera disposición para agendar una entrevista y profundizar en cómo mi experiencia se alinea con los retos de su organización.
              </p>
            </div>

            <div className="letter-sig">
              <div className="name-block">
                <div className="big">nicolás<span className="dot">●</span>monroy</div>
                <div className="role">FULL STACK DEVELOPER &amp; AI SPECIALIST</div>
              </div>
              <div className="scribble" style={{ textAlign: "center" }}>Nicolás.</div>
              <div className="date">
                BOGOTÁ &nbsp;·&nbsp; COLOMBIA<br/>
                2026 · ABRIL<br/>
                <span style={{ color: "var(--c-acid)" }}>● DISPONIBLE</span>
              </div>
            </div>

            <footer className="doc-foot" style={{ marginTop: "26px" }}>
              <span>© 2026 NICOLÁS MONROY PABÓN</span>
              <span>NICOLASMONROYPABON@GMAIL.COM · @NICOLASDRAWN</span>
              <span>PÁGINA 02 / 02</span>
            </footer>
          </article>

        </div>
      </div>
    </>
  )
}
