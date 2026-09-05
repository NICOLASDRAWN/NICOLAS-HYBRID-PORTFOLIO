'use client';

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

/**
 * Carta de Presentación · Nicolás Monroy Pabón
 * ─────────────────────────────────────────────
 * Diseño con estética Anti-IA y responsive móvil de alta gama:
 *   - En pantalla móvil/desktop: Layout fluido que nunca corta texto (`overflow: visible`),
 *     adaptado con tipografía responsive clamp(), bento adaptable y barra de acciones sticky.
 *   - En impresión / PDF: Exactamente 2 páginas A4 estructuradas (P1 Portada, P2 Carta)
 *     con contención matemática de 297mm y cero desbordamientos.
 */

export default function CartaPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --c-bg: #0A0A0A;
          --c-bg-2: #111111;
          --c-ink: #F5F3ED;
          --c-ink-dim: #B2B2AC;
          --c-ink-dimmer: #80807B;
          --c-line: #262626;
          --c-acid: #C6FF3D;
          --c-acid-deep: #9FD81A;
          --c-warn: #FF5E3A;
        }

        .carta-container {
          background: #0E0E0E;
          color: var(--c-ink);
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ─── STICKY TOPBAR TOOLBAR (DESKTOP & MOBILE) ─── */
        .print-bar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: rgba(10, 10, 10, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--c-line);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .print-bar .nav-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .print-bar .brand-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--c-ink-dim);
          font-weight: 500;
        }
        .print-bar .brand-badge .dot {
          width: 7px;
          height: 7px;
          background: var(--c-acid);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--c-acid);
        }
        .print-bar .brand-badge strong {
          color: var(--c-ink);
        }
        .print-bar button {
          background: var(--c-acid);
          color: var(--c-bg);
          border: none;
          padding: 8px 14px;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
          letter-spacing: inherit;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: filter 0.2s, transform 0.1s;
        }
        .print-bar button:active {
          transform: scale(0.97);
        }
        .print-bar .alt {
          background: var(--c-bg-2);
          color: var(--c-ink);
          border: 1px solid var(--c-line);
          text-decoration: none;
          padding: 8px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          font-size: inherit;
          letter-spacing: inherit;
          transition: border-color 0.2s, color 0.2s;
        }
        .print-bar button:hover { filter: brightness(1.12); }
        .print-bar .alt:hover { border-color: var(--c-acid); color: var(--c-acid); }

        /* ─── PAGE WRAPPER ─── */
        .carta-container .page-wrap {
          max-width: 860px;
          margin: 0 auto;
          padding: 24px 16px 60px;
        }

        /* ─── SCREEN PAGE (ADAPTABLE, NEVER CUTS OFF) ─── */
        .carta-container .page {
          width: 100%;
          max-width: 820px;
          min-height: auto;
          height: auto;
          background: var(--c-bg);
          color: var(--c-ink);
          margin: 0 auto 36px;
          padding: 44px 40px;
          position: relative;
          overflow: visible; /* Nunca recorta contenido en pantalla */
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          border: 1px solid var(--c-line);
          display: flex;
          flex-direction: column;
        }

        /* ─── DOC HEADER & FOOTER ─── */
        .carta-container .doc-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--c-line);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--c-ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 24px;
        }
        .carta-container .doc-head .left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .carta-container .doc-head .dot {
          width: 6px;
          height: 6px;
          background: var(--c-acid);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--c-acid);
          display: inline-block;
        }
        .carta-container .doc-head strong { color: var(--c-ink); font-weight: 600; }

        .carta-container .doc-foot {
          margin-top: 36px;
          padding-top: 14px;
          border-top: 1px solid var(--c-line);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: var(--c-ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          flex-wrap: wrap;
          gap: 8px;
        }

        /* ─── COVER PAGE (P1) ─── */
        .carta-container .cover-body {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .carta-container .cover-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--c-ink-dim);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .carta-container .cover-tag .acc { color: var(--c-acid); }

        .carta-container .cover-mark {
          font-size: clamp(48px, 10vw, 80px);
          font-weight: 700;
          letter-spacing: -0.055em;
          line-height: 0.86;
          color: var(--c-ink);
          margin: 0 0 8px;
        }
        .carta-container .cover-mark .punct { color: var(--c-acid); }

        .carta-container .cover-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--c-ink-dim);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          line-height: 1.5;
        }
        .carta-container .cover-subtitle .sep { color: var(--c-ink-dimmer); margin: 0 6px; }

        .carta-container .cover-headline {
          font-size: clamp(26px, 5.5vw, 42px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.04;
          max-width: 20ch;
          margin-bottom: 18px;
        }
        .carta-container .cover-headline .hl {
          background: var(--c-acid);
          color: var(--c-bg);
          padding: 0 0.16em;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }

        .carta-container .cover-lede {
          font-size: 13.5px;
          line-height: 1.65;
          max-width: 60ch;
          color: var(--c-ink);
        }
        .carta-container .cover-lede strong { color: var(--c-acid); font-weight: 500; }

        .carta-container .cover-chips {
          margin-top: 18px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .carta-container .chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          padding: 4px 9px;
          border: 1px solid var(--c-line);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-ink-dim);
          background: var(--c-bg-2);
        }
        .carta-container .chip.on {
          background: var(--c-acid);
          color: var(--c-bg);
          border-color: var(--c-acid);
          font-weight: 600;
        }

        /* Cover Meta Grid */
        .carta-container .cover-meta {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin: 10px 0;
        }
        .carta-container .cover-meta .field {
          border-top: 1px solid var(--c-line);
          padding-top: 10px;
        }
        .carta-container .cover-meta .field .k {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: var(--c-ink-dim);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .carta-container .cover-meta .field .v {
          font-size: 12px;
          font-weight: 500;
        }
        .carta-container .cover-meta .field .v.acid { color: var(--c-acid); }

        /* Cover Bottom & Seal */
        .carta-container .cover-bottom {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: flex-end;
          padding-top: 16px;
          border-top: 1px solid var(--c-line);
        }
        .carta-container .cover-sig {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--c-ink-dim);
          letter-spacing: 0.08em;
          line-height: 1.7;
          text-transform: uppercase;
        }
        .carta-container .cover-sig strong { color: var(--c-ink); font-weight: 600; }
        .carta-container .cover-sig .line {
          display: inline-block;
          width: 60px;
          height: 1px;
          background: var(--c-acid);
          vertical-align: middle;
          margin: 0 6px;
        }

        .carta-container .cover-seal {
          width: 90px;
          height: 90px;
          border: 1.5px solid var(--c-acid);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: var(--c-acid);
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.1em;
          text-align: center;
          position: relative;
          flex-shrink: 0;
        }
        .carta-container .cover-seal .big {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .carta-container .cover-seal::before {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px dashed rgba(198,255,61,0.3);
          border-radius: 50%;
        }

        /* ─── LETTER PAGE (P2) ─── */
        .carta-container .letter-head {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-line);
          margin-bottom: 16px;
        }
        .carta-container .letter-head .from strong,
        .carta-container .letter-head .to strong {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--c-acid);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 6px;
        }
        .carta-container .letter-head .from p,
        .carta-container .letter-head .to p {
          font-size: 11px;
          line-height: 1.6;
          color: var(--c-ink-dim);
          margin: 0;
        }
        .carta-container .letter-head .from p .ink { color: var(--c-ink); font-weight: 500; }

        .carta-container .letter-subject {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: var(--c-ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 6px;
        }
        .carta-container .letter-title {
          font-size: clamp(22px, 4vw, 30px);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin: 0 0 16px;
        }
        .carta-container .letter-title .acid { color: var(--c-acid); }

        .carta-container .letter-body p {
          font-size: 12.5px;
          line-height: 1.65;
          margin: 0 0 12px;
          max-width: 68ch;
          color: var(--c-ink);
        }
        .carta-container .letter-body p .hl {
          background: var(--c-acid);
          color: var(--c-bg);
          padding: 0 0.2em;
          font-weight: 600;
        }
        .carta-container .letter-body p strong { color: var(--c-acid); font-weight: 500; }

        /* Evidence list */
        .carta-container .letter-list {
          margin: 12px 0 16px;
          padding: 12px 0;
          border-top: 1px solid var(--c-line);
          border-bottom: 1px solid var(--c-line);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 20px;
        }
        .carta-container .letter-list .item {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 6px;
          align-items: baseline;
        }
        .carta-container .letter-list .item .n {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--c-acid);
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .carta-container .letter-list .item .t { font-size: 11px; line-height: 1.45; }
        .carta-container .letter-list .item .t strong {
          display: block;
          font-weight: 600;
          color: var(--c-ink);
          margin-bottom: 1px;
        }
        .carta-container .letter-list .item .t span { color: var(--c-ink-dim); }

        /* KPI strip */
        .carta-container .letter-kpis {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--c-line);
          border: 1px solid var(--c-line);
          margin: 14px 0 16px;
        }
        .carta-container .letter-kpis .kpi {
          background: var(--c-bg-2);
          padding: 10px 14px;
        }
        .carta-container .letter-kpis .kpi .l {
          font-family: 'JetBrains Mono', monospace;
          font-size: 7.5px;
          color: var(--c-ink-dim);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 3px;
        }
        .carta-container .letter-kpis .kpi .v {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .carta-container .letter-kpis .kpi .v.acid-txt { color: var(--c-acid); }
        .carta-container .letter-kpis .kpi .v .u {
          font-size: 0.5em;
          color: var(--c-ink-dim);
          margin-left: 2px;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Signature block */
        .carta-container .letter-sig {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--c-line);
          margin-top: 14px;
        }
        .carta-container .letter-sig .name-block .big {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .carta-container .letter-sig .name-block .big .punct { color: var(--c-acid); }
        .carta-container .letter-sig .name-block .role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: var(--c-ink-dim);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .carta-container .letter-sig .scribble {
          font-family: 'Space Grotesk', sans-serif;
          font-style: italic;
          font-weight: 600;
          font-size: 30px;
          color: var(--c-acid);
          transform: rotate(-6deg);
          letter-spacing: -0.03em;
        }
        .carta-container .letter-sig .date {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: var(--c-ink-dim);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-align: right;
          line-height: 1.7;
        }

        /* ─── RESPONSIVE MÓVIL (CELULAR <= 768px) ─── */
        @media (max-width: 768px) {
          .carta-container .page-wrap {
            padding: 12px 10px 50px;
          }
          .carta-container .page {
            padding: 22px 16px 26px;
            margin-bottom: 20px;
            border-radius: 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .print-bar {
            padding: 10px 14px;
          }
          .print-bar .brand-badge {
            display: none;
          }
          .print-bar .nav-group {
            width: 100%;
            justify-content: space-between;
          }
          .print-bar button,
          .print-bar .alt {
            padding: 8px 12px;
            font-size: 9px;
          }
          .carta-container .cover-meta {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .carta-container .cover-bottom {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .carta-container .cover-seal {
            margin: 0 auto;
          }
          .carta-container .letter-head {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .carta-container .letter-list {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .carta-container .letter-kpis {
            grid-template-columns: repeat(2, 1fr);
          }
          .carta-container .letter-sig {
            grid-template-columns: 1fr;
            gap: 14px;
            text-align: left;
          }
          .carta-container .letter-sig .scribble {
            text-align: left;
            font-size: 26px;
            transform: rotate(-3deg);
          }
          .carta-container .letter-sig .date {
            text-align: left;
          }
        }

        /* ─── PRINT / PDF EXPORT (A4 DARK — EXACT PREVIEW) ─── */
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html, body {
            background: #0A0A0A !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            color: #F2EFE8 !important;
            width: 100% !important;
            overflow: visible !important;
          }

          body::before,
          body::after,
          .print-bar,
          button,
          .lucide,
          nav,
          [class*="fixed"] {
            display: none !important;
          }

          .carta-container {
            padding: 0 !important;
            background: #0A0A0A !important;
            min-height: auto !important;
          }
          .carta-container .page-wrap {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
          }

          /* Exact A4 Page Container */
          .carta-container .page {
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            padding: 12mm 18mm !important;
            overflow: hidden !important;
            background: #0A0A0A !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }

          /* Print P1 Portada */
          .carta-container .cover-mark {
            font-size: 64px !important;
          }
          .carta-container .cover-headline {
            font-size: 34px !important;
            margin-bottom: 14px !important;
          }
          .carta-container .cover-lede {
            font-size: 11px !important;
            line-height: 1.5 !important;
          }
          .carta-container .cover-chips {
            margin-top: 10px !important;
          }
          .carta-container .chip {
            font-size: 7.5px !important;
            padding: 2.5px 6px !important;
          }
          .carta-container .cover-meta {
            margin: 14px 0 !important;
          }
          .carta-container .cover-meta .field .k {
            font-size: 6.5px !important;
          }
          .carta-container .cover-meta .field .v {
            font-size: 10.5px !important;
          }
          .carta-container .cover-seal {
            width: 75px !important;
            height: 75px !important;
          }
          .carta-container .cover-seal .big {
            font-size: 20px !important;
          }

          /* Print P2 Carta (Tightening to avoid any overflow) */
          .carta-container .doc-head {
            margin-bottom: 10px !important;
            padding-bottom: 6px !important;
            font-size: 7.5px !important;
          }
          .carta-container .letter-head {
            padding-bottom: 8px !important;
            margin-bottom: 10px !important;
            gap: 16px !important;
          }
          .carta-container .letter-head .from p,
          .carta-container .letter-head .to p {
            font-size: 9.5px !important;
            line-height: 1.4 !important;
          }
          .carta-container .letter-subject {
            font-size: 7.5px !important;
            margin-bottom: 3px !important;
          }
          .carta-container .letter-title {
            font-size: 20px !important;
            line-height: 1.05 !important;
            margin-bottom: 8px !important;
          }
          .carta-container .letter-body p {
            font-size: 10px !important;
            line-height: 1.42 !important;
            margin-bottom: 6px !important;
          }
          .carta-container .letter-list {
            margin: 6px 0 !important;
            padding: 6px 0 !important;
            gap: 4px 14px !important;
          }
          .carta-container .letter-list .item .n {
            font-size: 8.5px !important;
          }
          .carta-container .letter-list .item .t {
            font-size: 9.5px !important;
            line-height: 1.35 !important;
          }
          .carta-container .letter-kpis {
            margin: 6px 0 !important;
          }
          .carta-container .letter-kpis .kpi {
            padding: 6px 8px !important;
          }
          .carta-container .letter-kpis .kpi .v {
            font-size: 14px !important;
          }
          .carta-container .letter-kpis .kpi .l {
            font-size: 5.5px !important;
          }
          .carta-container .letter-sig {
            margin-top: 6px !important;
            padding-top: 8px !important;
          }
          .carta-container .letter-sig .name-block .big {
            font-size: 15px !important;
          }
          .carta-container .letter-sig .scribble {
            font-size: 22px !important;
          }
          .carta-container .letter-sig .date {
            font-size: 7px !important;
          }
          .carta-container .doc-foot {
            margin-top: 8px !important;
            padding-top: 6px !important;
            font-size: 6.5px !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}} />

      <div className="carta-container">
        {/* Sticky Action Bar */}
        <header className="print-bar" role="toolbar" aria-label="Acciones de documento">
          <div className="brand-badge">
            <span className="dot" aria-hidden="true"></span>
            <strong>NCLS.DEV</strong>
            <span>/ CARTA DE PRESENTACIÓN B2B</span>
          </div>
          <div className="nav-group">
            <Link href="/" className="alt">
              <ArrowLeft size={13} aria-hidden="true" />
              <span>Volver</span>
            </Link>
            <button onClick={() => window.print()} aria-label="Exportar carta como PDF">
              <Printer size={13} aria-hidden="true" />
              <span>Guardar como PDF</span>
            </button>
          </div>
        </header>

        <div className="page-wrap">
          {/* ==================== PAGE 1 : COVER ==================== */}
          <article className="page" data-screen-label="P1 Portada">
            <header className="doc-head">
              <div className="left">
                <span className="dot" aria-hidden="true"></span>
                <strong>NCLS.DEV</strong>
                <span>· DOSSIER CORPORATIVO</span>
              </div>
              <div>DOC-001 · REV 2026.09 · 01 / 02</div>
            </header>

            <div className="cover-body">
              <div>
                <div className="cover-tag">
                  <span className="acc">●</span>
                  <span>[ COVER LETTER · BOGOTÁ · 2026 ]</span>
                </div>
                <div className="cover-mark">nicolás<span className="punct">●</span>dev</div>
                <div className="cover-subtitle">
                  Comunicador Social <span className="sep">×</span> Systems Architect <span className="sep">×</span> Lead Full Stack
                </div>
              </div>

              <div>
                <div className="cover-headline">
                  Código en producción. <br/><span className="hl">IA aplicada, no demos.</span>
                </div>
                <p className="cover-lede">
                  Soy <span style={{ color: "var(--c-ink)", fontWeight: 600 }}>Nicolás Monroy Pabón</span>. Comunicador Social Profesional (UNIMINUTO 2020), Systems Architect &amp; Full Stack Developer de ejecución. Trabajo en la intersección entre <strong>arquitectura técnica robusta</strong> e <strong>implementación estratégica de IA generativa</strong> — Gemini, Claude, Ollama — en entornos de producción real con impacto medible: 501 colaboradores auditados, 7 suites SaaS B2B autónomas, 82K+ activos gobernados.
                </p>
                <div className="cover-chips">
                  <span className="chip on">Next.js 16 · React 19</span>
                  <span className="chip on">Node.js 24 · Python</span>
                  <span className="chip on">AI / LLMs Locales</span>
                  <span className="chip">7 Suites SaaS B2B</span>
                  <span className="chip">501 Nómina Auditada</span>
                  <span className="chip">Electron Desktop</span>
                  <span className="chip">Branding Editorial</span>
                  <span className="chip">PostgreSQL · SQLite</span>
                </div>
              </div>

              <div className="cover-meta">
                <div className="field"><div className="k">De</div><div className="v">Nicolás Monroy P.</div></div>
                <div className="field"><div className="k">Rol</div><div className="v">Systems Architect</div></div>
                <div className="field"><div className="k">Base</div><div className="v">Bogotá · Colombia</div></div>
                <div className="field"><div className="k">Estado</div><div className="v acid">● Disponible</div></div>
              </div>

              <div className="cover-bottom">
                <div className="cover-sig">
                  <div><strong>NICOLÁS MONROY PABÓN</strong> <span className="line" aria-hidden="true"></span> <strong>@NCLS.DEV</strong></div>
                  <div style={{ marginTop: "4px" }}>NICOLASMONROY.DEV@GMAIL.COM &nbsp;·&nbsp; +57 320 426 8452</div>
                </div>
                <div className="cover-seal" aria-hidden="true">
                  <span style={{ fontSize: "7px" }}>ND</span>
                  <span className="big">v1.0</span>
                  <span style={{ fontSize: "7px" }}>BRAND OS</span>
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
              <div className="left">
                <span className="dot" aria-hidden="true"></span>
                <strong>NCLS.DEV</strong>
                <span>· CARTA DE PRESENTACIÓN</span>
              </div>
              <div>DOC-001 · REV 2026.09 · 02 / 02</div>
            </header>

            <div className="letter-head">
              <div className="from">
                <strong>{`// DE`}</strong>
                <p>
                  <span className="ink">Nicolás Monroy Pabón &nbsp;/&nbsp; @ncls.dev</span><br/>
                  Comunicador Social × Systems Architect<br/>
                  Bogotá, D.C. · Colombia (GMT-5)<br/>
                  nicolasmonroy.dev@gmail.com · +57 320 426 8452
                </p>
              </div>
              <div className="to">
                <strong>{`// PARA`}</strong>
                <p>
                  A la atención del equipo de Selección /<br/>
                  Dirección Técnica o CTO.<br/>
                  Empresas que buscan <span style={{ color: "var(--c-acid)", fontWeight: 500 }}>IA aplicada en producción</span>, ERPs serios y software de impacto medible — no prototipos de laboratorio.
                </p>
              </div>
            </div>

            <div>
              <div className="letter-subject">ASUNTO / SUBJECT</div>
              <h1 className="letter-title">
                Perfil híbrido <span className="acid">—</span> comunicador y arquitecto de sistemas <span className="acid">—</span> IA aplicada con evidencia cuantificable.
              </h1>
            </div>

            <div className="letter-body">
              <p>
                Me dirijo a ustedes para expresar mi firme interés en integrarme a su equipo como <strong>Systems Architect &amp; Full Stack Developer</strong>. Mi enfoque se centra en la intersección entre arquitectura técnica robusta e <span className="hl">implementación estratégica de IA generativa</span> en entornos de producción real — no demos, no prototipos de laboratorio: código desplegado con métricas auditables.
              </p>

              <p>
                Como <strong>Comunicador Social Profesional</strong> (UNIMINUTO, 2020) y <strong>Arquitecto de Sistemas</strong> de ejecución, escribo código eficiente en React, Node.js y Python, y articulo las narrativas funcionales y de producto que un software necesita para impactar. Mi práctica actual se mueve en <strong>cinco frentes</strong>:
              </p>

              <div className="letter-list">
                <div className="item">
                  <span className="n">01 →</span>
                  <span className="t"><strong>7 Suites SaaS B2B</strong><span>ProcureCore, ProveedHub AI, BroadCast OS, EvalPro, CommandHub, NeuroPost, DocuDispatch.</span></span>
                </div>
                <div className="item">
                  <span className="n">02 →</span>
                  <span className="t"><strong>IA Generativa Aplicada</strong><span>Gemini, Claude, Ollama (local, $0 cloud) para validación documental y automatización silenciosa.</span></span>
                </div>
                <div className="item">
                  <span className="n">03 →</span>
                  <span className="t"><strong>Nómina &amp; Auditoría</strong><span>Motor paramétrico para 501 colaboradores con liquidación matemática sin discrepancias.</span></span>
                </div>
                <div className="item">
                  <span className="n">04 →</span>
                  <span className="t"><strong>Arquitectura Full-Stack</strong><span>Next.js 16, Node.js 24, Python, Electron, PostgreSQL, WebSockets &lt;20ms.</span></span>
                </div>
                <div className="item">
                  <span className="n">05 →</span>
                  <span className="t"><strong>Dirección de Arte</strong><span>ExxonMobil / Mobil 1™, San Juan Plaza, Marriott Cali, branding corporativo nacional.</span></span>
                </div>
              </div>

              <div className="letter-kpis">
                <div className="kpi"><div className="l">Nómina Auditada</div><div className="v acid-txt">501<span className="u">PERS.</span></div></div>
                <div className="kpi"><div className="l">Suites SaaS B2B</div><div className="v acid-txt">7<span className="u">LIVE</span></div></div>
                <div className="kpi"><div className="l">Activos Gobernados</div><div className="v acid-txt">82K+<span className="u">ACT.</span></div></div>
                <div className="kpi"><div className="l">Latencia WS</div><div className="v acid-txt">&lt;20<span className="u">MS</span></div></div>
              </div>

              <p>
                En <strong>MIP International Trading SAS</strong> lidero la transformación digital integral: construí <strong>ProveedHub AI</strong> — plataforma con LLMs (Gemini, Claude) que valida automáticamente documentos corporativos como RUT y Cámara de Comercio reduciendo errores en un 90% — y el ecosistema completo de suites SaaS con firma digital Certicámara y aprobaciones multi-nivel. Antes coordiné productos digitales en el <strong>Partido Cambio Radical</strong> y lideré la marca técnica <strong>Mobil 1™</strong> en <strong>ExxonMobil / Districol</strong>.
              </p>

              <p>
                Busco una oportunidad donde pueda aportar mi visión de producto, mi capacidad para resolver problemas complejos de escala y mi compromiso con <span className="hl">código limpio y mantenible</span>. Mi habilidad para orquestar soluciones de IA y mi experiencia desplegando software en producción con tolerancia cero a errores aportarán valor inmediato a sus objetivos de innovación.
              </p>

              <p style={{ marginTop: "10px", color: "var(--c-ink-dim)", fontSize: "11.5px" }}>
                Agradezco de antemano su tiempo. Quedo a su entera disposición para agendar una entrevista técnica y profundizar en cómo mi trayectoria se alinea con los retos de su organización.
              </p>
            </div>

            <div className="letter-sig">
              <div className="name-block">
                <div className="big">nicolás<span className="punct">●</span>monroy</div>
                <div className="role">SYSTEMS ARCHITECT &amp; FULL STACK DEVELOPER</div>
              </div>
              <div className="scribble">Nicolás.</div>
              <div className="date">
                BOGOTÁ &nbsp;·&nbsp; COLOMBIA<br/>
                2026 · SEPTIEMBRE<br/>
                <span style={{ color: "var(--c-acid)", fontWeight: 600 }}>● DISPONIBLE</span>
              </div>
            </div>

            <footer className="doc-foot">
              <span>© 2026 NICOLÁS MONROY PABÓN</span>
              <span>NICOLASMONROY.DEV@GMAIL.COM · @NCLS.DEV</span>
              <span>PÁGINA 02 / 02</span>
            </footer>
          </article>
        </div>
      </div>
    </>
  );
}
