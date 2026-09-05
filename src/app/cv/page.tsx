'use client';

import { Mail, Phone, MapPin, Globe, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/>
  </svg>
);

const GithubIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

/**
 * CV web · Nicolás Monroy Pabón
 * ──────────────────────────────
 * Diseño con estética Anti-IA: tipografía con carácter editorial,
 * paleta monocromática cruda + acento ácido, bento asimétrico.
 * 
 * Dos audiencias:
 *  1. Reclutadores online → dark mode con acento verde ácido.
 *  2. Print / PDF → @media print preserva dark theme con ajustes A4.
 */

export default function CVPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --c-bg: #0A0A0A;
          --c-bg-2: #111111;
          --c-bg-3: #191919;
          --c-ink: #F5F3ED;
          --c-ink-dim: #B2B2AC;
          --c-ink-dimmer: #80807B;
          --c-line: #262626;
          --c-line-2: #333333;
          --c-acid: #C6FF3D;
          --c-acid-deep: #9FD81A;
          --c-warn: #FF5E3A;
        }

        .cv-shell {
          background: var(--c-bg);
          color: var(--c-ink);
          min-height: 100vh;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .cv-shell .cv-page {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 50px 80px;
          position: relative;
          background: var(--c-bg);
          overflow: hidden;
        }

        /* ─── COMMAND BAR ─── */
        .cv-shell .cmd-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 50px;
          border-bottom: 1px solid var(--c-line);
          background: var(--c-bg);
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-ink-dim);
          position: sticky; top: 0; z-index: 50;
        }
        .cv-shell .cmd-bar .dot { display: inline-block; width: 8px; height: 8px; background: var(--c-acid); border-radius: 50%; margin-right: 8px; animation: cvPulse 2s ease-in-out infinite; }
        @keyframes cvPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .cv-shell .cmd-bar a { color: var(--c-ink); text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: color 0.2s; }
        .cv-shell .cmd-bar a:hover { color: var(--c-acid); }
        .cv-shell .cmd-bar .actions { display: flex; gap: 16px; align-items: center; }
        .cv-shell .cmd-bar button {
          background: var(--c-acid); color: var(--c-bg); border: none;
          padding: 8px 16px; font: inherit; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.14em;
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        }
        .cv-shell .cmd-bar button:hover { filter: brightness(1.08); }

        /* ─── IDENTITY BLOCK ─── */
        .cv-shell .identity {
          padding: 60px 0 48px;
          border-bottom: 1px solid var(--c-line);
        }
        .cv-shell .identity .sys-tag {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); letter-spacing: 0.22em; text-transform: uppercase;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .cv-shell .identity .sys-tag .acc { color: var(--c-acid); }
        .cv-shell .identity h1 {
          font-size: clamp(52px, 7vw, 96px);
          font-weight: 700; letter-spacing: -0.055em; line-height: 0.86;
          margin: 0 0 24px;
        }
        .cv-shell .identity h1 .punct { color: var(--c-acid); }
        .cv-shell .identity .dual-role {
          display: flex; gap: 24px; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--c-acid); font-weight: 500;
        }
        .cv-shell .identity .dual-role .sep { color: var(--c-ink-dimmer); }

        /* ─── CONTACT STRIP ─── */
        .cv-shell .contact-strip {
          display: flex; flex-wrap: wrap; gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid var(--c-line);
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--c-ink-dim); letter-spacing: 0.06em;
        }
        .cv-shell .contact-strip a {
          color: var(--c-ink-dim); text-decoration: none;
          display: flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .cv-shell .contact-strip a:hover { color: var(--c-acid); }

        /* ─── MANIFESTO ─── */
        .cv-shell .manifesto {
          padding: 40px 0;
          border-bottom: 1px solid var(--c-line);
        }
        .cv-shell .manifesto blockquote {
          font-size: 26px; font-weight: 700; line-height: 1.15;
          letter-spacing: -0.035em; max-width: 640px;
          margin: 0; padding: 0;
          border-left: 3px solid var(--c-acid); padding-left: 24px;
        }
        .cv-shell .manifesto blockquote .accent { color: var(--c-acid); }

        /* ─── KPI BENTO GRID ─── */
        .cv-shell .kpi-bento {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--c-line);
          border: 1px solid var(--c-line);
          margin: 40px 0;
        }
        .cv-shell .kpi-bento .kpi {
          background: var(--c-bg);
          padding: 20px 24px;
        }
        .cv-shell .kpi-bento .kpi .val {
          font-size: 32px; font-weight: 700;
          letter-spacing: -0.04em; line-height: 1;
          color: var(--c-acid);
        }
        .cv-shell .kpi-bento .kpi .val .unit {
          font-size: 0.4em; color: var(--c-ink-dim);
          margin-left: 3px; font-weight: 400; letter-spacing: 0.02em;
        }
        .cv-shell .kpi-bento .kpi .lbl {
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          color: var(--c-ink-dim); text-transform: uppercase;
          letter-spacing: 0.16em; margin-top: 6px;
        }
        @media (max-width: 700px) {
          .cv-shell .kpi-bento { grid-template-columns: repeat(2, 1fr); }
        }

        /* ─── TWO-COLUMN BODY ─── */
        .cv-shell .body-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
          padding-top: 48px;
        }
        @media (max-width: 900px) {
          .cv-shell .body-grid { grid-template-columns: 1fr; gap: 40px; }
          .cv-shell .cv-page { padding: 0 24px 60px; }
          .cv-shell .cmd-bar { padding: 14px 24px; }
          .cv-shell .identity { padding: 40px 0 36px; }
        }
        @media (max-width: 640px) {
          .cv-shell .cv-page { padding: 0 16px 50px; }
          .cv-shell .cmd-bar { padding: 10px 14px; font-size: 9px; }
          .cv-shell .cmd-bar .actions { gap: 10px; }
          .cv-shell .cmd-bar button { padding: 6px 12px; font-size: 9px; }
          .cv-shell .identity { padding: 28px 0 24px; }
          .cv-shell .identity h1 { font-size: clamp(34px, 10vw, 56px); line-height: 0.9; margin: 0 0 16px; }
          .cv-shell .identity .dual-role { font-size: 9.5px; gap: 6px; flex-direction: column; }
          .cv-shell .identity .dual-role .sep { display: none; }
          .cv-shell .contact-strip { gap: 8px 12px; font-size: 9px; padding: 12px 0; }
          .cv-shell .manifesto { padding: 24px 0; }
          .cv-shell .manifesto blockquote { font-size: 18px; line-height: 1.25; padding-left: 14px; border-left-width: 2px; }
          .cv-shell .kpi-bento { grid-template-columns: repeat(2, 1fr); margin: 24px 0; }
          .cv-shell .kpi-bento .kpi { padding: 12px 14px; }
          .cv-shell .kpi-bento .kpi .val { font-size: 22px; }
          .cv-shell .body-grid { gap: 32px; padding-top: 24px; }
          .cv-shell .entry { padding-left: 14px; padding-bottom: 22px; }
          .cv-shell .entry .meta { flex-direction: column; gap: 4px; align-items: flex-start; }
          .cv-shell .entry .role-title { font-size: 15px; }
          .cv-shell .prj-grid { grid-template-columns: 1fr; }
        }

        /* ─── SECTION HEADINGS ─── */
        .cv-shell h2.sec {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; font-weight: 600;
          color: var(--c-acid); text-transform: uppercase; letter-spacing: 0.24em;
          margin: 0 0 20px; padding-bottom: 12px;
          border-bottom: 1px solid var(--c-line);
          display: flex; align-items: center; gap: 8px;
        }
        .cv-shell h2.sec::before { content: "//"; font-size: 10px; color: var(--c-acid); opacity: 0.5; }
        .cv-shell .section-block { margin-bottom: 44px; }

        /* ─── SIDEBAR ─── */
        .cv-shell .side p.bio {
          font-size: 13px; line-height: 1.65;
          color: var(--c-ink-dim); margin: 0;
        }
        .cv-shell .side ul.stack-list {
          list-style: none; padding: 0; margin: 0;
          font-size: 11px;
        }
        .cv-shell .side ul.stack-list li {
          padding: 8px 0;
          border-bottom: 1px dashed var(--c-line);
          display: flex; justify-content: space-between; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          color: var(--c-ink);
        }
        .cv-shell .side ul.stack-list li:last-child { border-bottom: 0; }
        .cv-shell .side ul.stack-list li .lvl {
          color: var(--c-acid); font-size: 9px;
          letter-spacing: 0.1em; text-transform: uppercase;
          font-weight: 500;
        }

        /* Lang bars */
        .cv-shell .lang-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 1px dashed var(--c-line);
          font-size: 12px;
        }
        .cv-shell .lang-row:last-child { border-bottom: 0; }
        .cv-shell .lang-row .bar { display: inline-flex; gap: 3px; }
        .cv-shell .lang-row .bar .seg { width: 16px; height: 4px; background: var(--c-line); }
        .cv-shell .lang-row .bar .seg.on { background: var(--c-acid); }

        /* ─── MAIN CONTENT ─── */
        /* Timeline entries */
        .cv-shell .entry {
          position: relative; padding: 0 0 32px 22px;
          border-left: 1px solid var(--c-line);
          margin-left: 4px;
        }
        .cv-shell .entry::before {
          content: ""; position: absolute; left: -5px; top: 4px;
          width: 9px; height: 9px; background: var(--c-bg);
          border: 2px solid var(--c-acid); border-radius: 50%;
        }
        .cv-shell .entry:last-child { padding-bottom: 0; border-left-color: transparent; }
        .cv-shell .entry .meta {
          display: flex; justify-content: space-between; align-items: baseline;
          gap: 12px; flex-wrap: wrap; margin-bottom: 6px;
        }
        .cv-shell .entry .role-title {
          font-size: 17px; font-weight: 700; color: var(--c-ink);
          letter-spacing: -0.02em;
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
          text-transform: uppercase; margin-bottom: 10px; font-weight: 500;
        }
        .cv-shell .entry ul {
          list-style: none; padding: 0; margin: 0;
          font-size: 13px; line-height: 1.6; color: var(--c-ink-dim);
        }
        .cv-shell .entry ul li {
          padding-left: 18px; position: relative; margin-bottom: 5px;
        }
        .cv-shell .entry ul li::before {
          content: "→"; position: absolute; left: 0; top: 0;
          color: var(--c-acid); font-size: 11px;
        }

        /* Project cards */
        .cv-shell .prj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 700px) { .cv-shell .prj-grid { grid-template-columns: 1fr; } }
        .cv-shell .prj {
          padding: 16px 18px; border: 1px solid var(--c-line);
          background: var(--c-bg-2);
          transition: border-color 0.2s;
        }
        .cv-shell .prj:hover { border-color: var(--c-acid); }
        .cv-shell .prj .prj-name {
          font-size: 13px; font-weight: 700; color: var(--c-ink);
          margin-bottom: 3px; letter-spacing: -0.015em;
        }
        .cv-shell .prj .prj-tags {
          font-family: 'JetBrains Mono', monospace; font-size: 8px;
          color: var(--c-acid); letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 5px;
        }
        .cv-shell .prj p { font-size: 11px; line-height: 1.5; color: var(--c-ink-dim); margin: 0; }

        /* ─── FOOTER ─── */
        .cv-shell .ftr {
          margin-top: 48px; padding-top: 20px;
          border-top: 1px solid var(--c-line);
          display: flex; justify-content: space-between; gap: 16px;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          color: var(--c-ink-dim); letter-spacing: 0.14em;
          text-transform: uppercase; flex-wrap: wrap;
        }

        /* ─── REVEAL ANIMATION ─── */
        @keyframes cvRise {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cv-shell .identity, .cv-shell .section-block, .cv-shell .ftr {
          animation: cvRise 0.6s ease-out both;
        }
        .cv-shell .section-block:nth-of-type(1) { animation-delay: 0.05s; }
        .cv-shell .section-block:nth-of-type(2) { animation-delay: 0.1s; }
        .cv-shell .section-block:nth-of-type(3) { animation-delay: 0.15s; }
        .cv-shell .section-block:nth-of-type(4) { animation-delay: 0.2s; }
        .cv-shell .section-block:nth-of-type(5) { animation-delay: 0.25s; }
        @media (prefers-reduced-motion: reduce) {
          .cv-shell .identity, .cv-shell .section-block, .cv-shell .ftr { animation: none; }
          .cv-shell .cmd-bar .dot { animation: none; }
        }

        /* ─── PRINT (A4 DARK — PRODUCTION PDF) ─── */
        @media print {
          /* A4 page setup with safe margins */
          @page {
            size: A4 portrait;
            margin: 18mm 20mm 18mm 20mm;
          }

          /* Reset HTML/body */
          html, body {
            background: #0A0A0A !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            color: #F2EFE8 !important;
            font-size: 9.5px !important;
            width: 100% !important;
            overflow: visible !important;
          }

          /* Kill ALL screen-only elements */
          .cmd-bar,
          .screen-only,
          button,
          nav,
          .lucide,
          body::before,
          body::after {
            display: none !important;
          }

          /* Shell & page container */
          .cv-shell {
            background: #0A0A0A !important;
            min-height: auto !important;
          }
          .cv-shell .cv-page {
            max-width: none !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }

          /* ─── IDENTITY ─── */
          .cv-shell .identity {
            padding: 0 0 14px !important;
            margin-bottom: 14px !important;
            animation: none !important;
          }
          .cv-shell .identity h1 {
            font-size: 36px !important;
            line-height: 0.88 !important;
            margin-bottom: 10px !important;
          }
          .cv-shell .identity .dual-role {
            font-size: 9px !important;
            gap: 12px !important;
          }
          .cv-shell .identity .sys-tag {
            font-size: 8px !important;
            margin-bottom: 8px !important;
          }

          /* ─── CONTACT STRIP ─── */
          .cv-shell .contact-strip {
            padding: 8px 0 !important;
            gap: 14px !important;
            font-size: 8px !important;
          }
          .cv-shell .contact-strip svg {
            display: none !important;
          }

          /* ─── MANIFESTO ─── */
          .cv-shell .manifesto {
            padding: 12px 0 !important;
          }
          .cv-shell .manifesto blockquote {
            font-size: 15px !important;
            padding-left: 16px !important;
            border-left-width: 2px !important;
          }

          /* ─── KPI GRID ─── */
          .cv-shell .kpi-bento {
            margin: 14px 0 !important;
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .cv-shell .kpi-bento .kpi {
            padding: 10px 12px !important;
          }
          .cv-shell .kpi-bento .kpi .val {
            font-size: 20px !important;
          }
          .cv-shell .kpi-bento .kpi .lbl {
            font-size: 7px !important;
            margin-top: 3px !important;
          }

          /* ─── BODY GRID ─── */
          .cv-shell .body-grid {
            display: flex !important;
            gap: 28px !important;
            padding-top: 16px !important;
          }
          .cv-shell .body-grid .side {
            width: 170px !important;
            flex-shrink: 0 !important;
          }
          .cv-shell .body-grid .main {
            flex: 1 !important;
          }

          /* ─── SECTIONS ─── */
          .cv-shell .section-block {
            margin-bottom: 16px !important;
            animation: none !important;
          }
          .cv-shell h2.sec {
            font-size: 8px !important;
            padding-bottom: 5px !important;
            margin-bottom: 10px !important;
          }

          /* Sidebar */
          .cv-shell .side p.bio {
            font-size: 10px !important;
            line-height: 1.5 !important;
          }
          .cv-shell .side ul.stack-list li {
            padding: 4px 0 !important;
            font-size: 9px !important;
          }
          .cv-shell .side ul.stack-list li .lvl {
            font-size: 7px !important;
          }
          .cv-shell .lang-row {
            padding: 5px 0 !important;
            font-size: 10px !important;
          }
          .cv-shell .lang-row .bar .seg {
            width: 12px !important;
            height: 3px !important;
          }

          /* ─── EXPERIENCE ENTRIES ─── */
          .cv-shell .entry {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            padding-bottom: 16px !important;
            padding-left: 14px !important;
          }
          .cv-shell .entry .role-title {
            font-size: 12px !important;
          }
          .cv-shell .entry .date {
            font-size: 7px !important;
            padding: 2px 5px !important;
          }
          .cv-shell .entry .company {
            font-size: 8px !important;
            margin-bottom: 5px !important;
          }
          .cv-shell .entry ul {
            font-size: 10px !important;
            line-height: 1.45 !important;
          }
          .cv-shell .entry ul li {
            margin-bottom: 2px !important;
            padding-left: 12px !important;
          }
          .cv-shell .entry ul li::before {
            font-size: 9px !important;
          }

          /* ─── PROJECT CARDS ─── */
          .cv-shell .prj-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
          }
          .cv-shell .prj {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            padding: 10px 12px !important;
          }
          .cv-shell .prj .prj-name {
            font-size: 10px !important;
            margin-bottom: 1px !important;
          }
          .cv-shell .prj .prj-tags {
            font-size: 7px !important;
            margin-bottom: 3px !important;
          }
          .cv-shell .prj p {
            font-size: 9px !important;
            line-height: 1.4 !important;
          }

          /* ─── FOOTER ─── */
          .cv-shell .ftr {
            margin-top: 20px !important;
            padding-top: 10px !important;
            font-size: 7px !important;
            animation: none !important;
          }

          /* Force exact color reproduction everywhere */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `}}/>

      <div className="cv-shell">
        {/* ─── COMMAND BAR ─── */}
        <div className="cmd-bar screen-only">
          <div>
            <span className="dot"></span>
            <strong style={{color:"var(--c-ink)",fontWeight:500}}>NCLS.DEV</strong>
            &nbsp;/ BRAND OS v1.0 / CURRICULUM VITAE
          </div>
          <div className="actions">
            <Link href="/"><ArrowLeft size={12}/> VOLVER</Link>
            <button onClick={() => window.print()}>
              <Printer size={12}/> EXPORTAR PDF
            </button>
          </div>
        </div>

        <div className="cv-page">
          {/* ─── IDENTITY BLOCK ─── */}
          <div className="identity">
            <div className="sys-tag">
              <span className="acc">●</span>
              <span>[ CORE IDENTITY / SYSTEMS ARCHITECT ]</span>
            </div>
            <h1>
              Nicolás<br/>Monroy Pabón<span className="punct">.</span>
            </h1>
            <div className="dual-role">
              <span>Comunicador Social Profesional</span>
              <span className="sep">×</span>
              <span>Systems Architect & Full Stack Developer</span>
            </div>
          </div>

          {/* ─── CONTACT STRIP ─── */}
          <div className="contact-strip">
            <a href="mailto:nicolasmonroy.dev@gmail.com"><Mail size={11}/> nicolasmonroy.dev@gmail.com</a>
            <a href="https://wa.me/573204268452" target="_blank" rel="noopener noreferrer"><Phone size={11}/> +57 320 426 8452</a>
            <span style={{display:"flex",alignItems:"center",gap:6}}><MapPin size={11}/> Bogotá, Colombia (GMT-5)</span>
            <a href="https://nicolasdev.com" target="_blank" rel="noopener noreferrer"><Globe size={11}/> nicolasdev.com</a>
            <a href="https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/" target="_blank" rel="noopener noreferrer"><LinkedinIcon size={11}/> LinkedIn</a>
            <a href="https://github.com/nicolasmonroy" target="_blank" rel="noopener noreferrer"><GithubIcon size={11}/> GitHub</a>
          </div>

          {/* ─── MANIFESTO ─── */}
          <div className="manifesto">
            <blockquote>
              &ldquo;Diseño lo que construyo. Construyo lo que diseño. <span className="accent">La creatividad es una función técnica.</span>&rdquo;
            </blockquote>
          </div>

          {/* ─── KPI BENTO GRID ─── */}
          <div className="kpi-bento">
            <div className="kpi">
              <div className="val">501<span className="unit">PERS.</span></div>
              <div className="lbl">Nómina Auditada sin Discrepancias</div>
            </div>
            <div className="kpi">
              <div className="val">7<span className="unit">SUITES</span></div>
              <div className="lbl">Sistemas SaaS B2B en Producción</div>
            </div>
            <div className="kpi">
              <div className="val">82K+<span className="unit">ACT.</span></div>
              <div className="lbl">Activos con Trazabilidad Completa</div>
            </div>
            <div className="kpi">
              <div className="val">&lt;20<span className="unit">MS</span></div>
              <div className="lbl">Latencia WebSocket Bidireccional</div>
            </div>
          </div>

          {/* ─── BODY GRID ─── */}
          <div className="body-grid">
            {/* === SIDEBAR === */}
            <aside className="side">
              <div className="section-block">
                <h2 className="sec">Perfil Híbrido</h2>
                <p className="bio">
                  Comunicador Social Profesional (UNIMINUTO, 2020) y Arquitecto de Sistemas Full Stack. Combino análisis semiótico y arquitectura de la información con ingeniería de software en producción real. Me especializo en orquestar soluciones de IA generativa (Gemini, Claude, Ollama) sobre infraestructuras B2B autónomas con tolerancia cero a errores.
                </p>
              </div>

              <div className="section-block">
                <h2 className="sec">Stack Principal</h2>
                <ul className="stack-list">
                  <li><span>Next.js 16 / Turbopack</span><span className="lvl">PRO</span></li>
                  <li><span>React 19 + TypeScript</span><span className="lvl">PRO</span></li>
                  <li><span>Node.js 24 / Express 5</span><span className="lvl">PRO</span></li>
                  <li><span>Python (Flask, PyMuPDF)</span><span className="lvl">PRO</span></li>
                  <li><span>Tailwind CSS v4</span><span className="lvl">PRO</span></li>
                  <li><span>Electron Desktop</span><span className="lvl">PRO</span></li>
                  <li><span>PostgreSQL + Drizzle</span><span className="lvl">INT</span></li>
                  <li><span>WebSockets (&lt;20ms)</span><span className="lvl">PRO</span></li>
                </ul>
              </div>

              <div className="section-block">
                <h2 className="sec">Diseño & Creative</h2>
                <ul className="stack-list">
                  <li><span>Illustrator / Photoshop</span><span className="lvl">PRO</span></li>
                  <li><span>After Effects / DaVinci</span><span className="lvl">PRO</span></li>
                  <li><span>InDesign / Editorial</span><span className="lvl">PRO</span></li>
                  <li><span>Branding & Identidad</span><span className="lvl">PRO</span></li>
                  <li><span>Framer Motion UX</span><span className="lvl">INT</span></li>
                </ul>
              </div>

              <div className="section-block">
                <h2 className="sec">IA & APIs</h2>
                <ul className="stack-list">
                  <li><span>Gemini API Multimodal</span><span className="lvl">PRO</span></li>
                  <li><span>Claude API (Anthropic)</span><span className="lvl">PRO</span></li>
                  <li><span>Ollama LLMs Locales</span><span className="lvl">PRO</span></li>
                  <li><span>OpenAI API</span><span className="lvl">INT</span></li>
                  <li><span>Playwright Scrapers</span><span className="lvl">PRO</span></li>
                </ul>
              </div>

              <div className="section-block">
                <h2 className="sec">Idiomas</h2>
                <div className="lang-row"><span>Español</span><span className="bar"><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span></span></div>
                <div className="lang-row"><span>Inglés (B2)</span><span className="bar"><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg on"></span><span className="seg"></span></span></div>
              </div>
            </aside>

            {/* === MAIN COLUMN === */}
            <main className="main">
              <div className="section-block">
                <h2 className="sec">Experiencia Profesional</h2>

                <div className="entry">
                  <div className="meta">
                    <span className="role-title">Director de Sistemas, Automatización & Nómina</span>
                    <span className="date">2024 — Presente</span>
                  </div>
                  <div className="company">MIP International Trading SAS · Bogotá</div>
                  <ul>
                    <li>Liderazgo de la transformación digital integral de la compañía: arquitectura de 7 suites SaaS B2B completas con flujos de aprobación multi-nivel y firma digital Certicámara.</li>
                    <li>Desarrollo de <strong style={{color:"var(--c-ink)"}}>ProveedHub AI</strong>: plataforma de validación documental con Computer Vision y LLMs (Gemini, Claude) que redujo errores humanos en un 90%.</li>
                    <li>Motor paramétrico de nómina para 501 colaboradores con liquidación matemática de bonificaciones, cero discrepancias auditadas.</li>
                    <li>Arquitectura <strong style={{color:"var(--c-ink)"}}>ProcureCore 2.0</strong>: portal de licitaciones con adjudicación algorítmica y gobernanza de 82K+ activos.</li>
                    <li>Despliegue de agentes de IA privados vía Ollama ($0 en suscripciones externas) para automatización silenciosa de procesos internos.</li>
                  </ul>
                </div>

                <div className="entry">
                  <div className="meta">
                    <span className="role-title">Estratega Digital & Producción Gráfica</span>
                    <span className="date">2023</span>
                  </div>
                  <div className="company">Partido Cambio Radical · Bogotá</div>
                  <ul>
                    <li>Coordinación de ecosistemas multimedia nacionales y despliegue de plataformas de formación política con alto tráfico.</li>
                    <li>Gestión de activos digitales de campaña electoral, producción de piezas gráficas y capacitación digital masiva.</li>
                  </ul>
                </div>

                <div className="entry">
                  <div className="meta">
                    <span className="role-title">Diseñador Estratégico & Coordinador de Marca</span>
                    <span className="date">2021 — 2022</span>
                  </div>
                  <div className="company">ExxonMobil / Districol LTDA · Bogotá</div>
                  <ul>
                    <li>Liderazgo creativo de la marca técnica <strong style={{color:"var(--c-ink)"}}>Mobil 1™</strong> en Colombia: campaña nacional &ldquo;Siente Tu ADN Motero&rdquo;.</li>
                    <li>Producción de escenografía y branding B2B para Seminario Industrial Mobil 1™ en Hotel Marriott Cali.</li>
                    <li>Conversión de activos físicos a narrativas digitales coherentes para distribución nacional.</li>
                  </ul>
                </div>

                <div className="entry">
                  <div className="meta">
                    <span className="role-title">Creativo Senior & Director de Branding</span>
                    <span className="date">2018 — 2020</span>
                  </div>
                  <div className="company">Centro Comercial San Juan Plaza / Parrilla Bar 385</div>
                  <ul>
                    <li>Identidad visual corporativa, wayfinding arquitectónico y sistemas de señalética para Centro Comercial San Juan Plaza.</li>
                    <li>Dirección creativa integral y diseño de experiencia gastronómica para Parrilla Bar 385.</li>
                  </ul>
                </div>
              </div>

              <div className="section-block">
                <h2 className="sec">Sistemas en Producción (7 Suites SaaS B2B)</h2>
                <div className="prj-grid">
                  <div className="prj">
                    <div className="prj-name">ProcureCore 2.0</div>
                    <div className="prj-tags">Next.js · Node · PostgreSQL · Firma Digital</div>
                    <p>Portal de licitaciones corporativas con adjudicación algorítmica, gobernanza de activos y flujos multi-nivel.</p>
                  </div>
                  <div className="prj">
                    <div className="prj-name">ProveedHub AI</div>
                    <div className="prj-tags">Gemini API · Claude · PyMuPDF · Express</div>
                    <p>Calificación de proveedores con validación documental por Computer Vision y LLMs en tiempo real.</p>
                  </div>
                  <div className="prj">
                    <div className="prj-name">BroadCast OS 365</div>
                    <div className="prj-tags">React · WebSockets · Electron · Node</div>
                    <p>Plataforma de marketing multicanal con distribución sincronizada y métricas en vivo.</p>
                  </div>
                  <div className="prj">
                    <div className="prj-name">EvalPro Enterprise</div>
                    <div className="prj-tags">Next.js · Drizzle ORM · Tailwind v4</div>
                    <p>Evaluación 360° con calibración 9-Box, dashboards de rendimiento y alertas preventivas.</p>
                  </div>
                  <div className="prj">
                    <div className="prj-name">CommandHub Pro</div>
                    <div className="prj-tags">Electron · SQLite · WebSockets</div>
                    <p>Torre de control de inventario físico, auditoría silenciosa y alertas en tiempo real.</p>
                  </div>
                  <div className="prj">
                    <div className="prj-name">NeuroPost Local AI</div>
                    <div className="prj-tags">Ollama · Flask · React · Markdown</div>
                    <p>Generador editorial con inferencia LLM privada, $0 en suscripciones cloud.</p>
                  </div>
                </div>
              </div>

              <div className="section-block">
                <h2 className="sec">Dirección de Arte & Grandes Cuentas</h2>
                <div className="prj-grid">
                  <div className="prj">
                    <div className="prj-name">ExxonMobil / Mobil 1™</div>
                    <div className="prj-tags">Branding Nacional · B2B · Identidad</div>
                    <p>Campaña &ldquo;Siente Tu ADN Motero&rdquo;, seminario Marriott Cali, material para red de distribución nacional.</p>
                  </div>
                  <div className="prj">
                    <div className="prj-name">C.C. San Juan Plaza</div>
                    <div className="prj-tags">Wayfinding · Señalética · Identidad</div>
                    <p>Identidad visual corporativa y sistema de señalética arquitectónica completo.</p>
                  </div>
                </div>
              </div>

              <div className="section-block">
                <h2 className="sec">Educación & Formación</h2>
                <div className="entry" style={{borderLeft:"none",paddingLeft:0,marginLeft:0}}>
                  <div className="meta">
                    <span className="role-title">Comunicación Social (Profesional)</span>
                    <span className="date">Graduado 2020</span>
                  </div>
                  <div className="company">Corporación Universitaria Minuto de Dios (UNIMINUTO)</div>
                  <ul>
                    <li>Formación superior en comunicación estratégica, semiótica, retórica visual y análisis de flujos de información corporativa.</li>
                    <li>Base humanista que fundamenta toda la arquitectura técnica y de producto posterior.</li>
                  </ul>
                </div>
              </div>

              <div className="section-block">
                <div className="prj" style={{borderColor:"var(--c-acid)",background:"rgba(198,255,61,0.04)"}}>
                  <div className="prj-name" style={{color:"var(--c-acid)"}}>● Disponibilidad Inmediata</div>
                  <p style={{fontSize: "12px"}}>Full-time remoto (GMT-5). Abierto a retos en Bogotá, LATAM y globales. Portafolio completo en nicolasdev.com</p>
                </div>
              </div>
            </main>
          </div>

          <footer className="ftr">
            <span>© 2026 · NICOLÁS MONROY PABÓN</span>
            <span>BRAND OS v1.0 · CREATIVIDAD ES UNA FUNCIÓN TÉCNICA</span>
            <span>REV. 2026.09 [CV-INTEGRAL]</span>
          </footer>
        </div>
      </div>
    </>
  );
}
