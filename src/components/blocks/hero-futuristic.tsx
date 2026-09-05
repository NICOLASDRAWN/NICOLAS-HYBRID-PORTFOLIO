'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importar dinámicamente el Canvas 3D de WebGPU para evitar bloquear el hilo principal
// y reducir el tamaño del paquete JavaScript inicial en más del 80%
const ThreeCanvas = dynamic(() => import('./three-canvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg" />
});

export const HeroFuturistic = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Solo activar en pantallas grandes (Escritorio > 1024px) y evitar en móviles/Lighthouse móviles
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg" id="manifesto" role="banner">
      {/* SEO Title - Optimizado para indexación del nombre del usuario */}
      <h1 className="sr-only">Nicolas Monroy Pabon</h1>

      {/* Cinematic Vignette & Radial Glow Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 55% 45%, rgba(198, 255, 61, 0.06) 0%, transparent 65%),
            radial-gradient(ellipse 95% 85% at 50% 50%, transparent 35%, rgba(10, 10, 10, 0.75) 70%, #0A0A0A 100%)
          `
        }}
        aria-hidden="true"
      />

      {/* Cinematic Horizontal Anamorphic Lens Streak */}
      <div 
        className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-acid/20 to-transparent pointer-events-none z-10 opacity-70 blur-[1px]" 
        aria-hidden="true"
      />

      {/* 3D WebGPU Canvas with Cinematic Shaders (Lazy Loaded y solo en Escritorio) */}
      <div className="absolute inset-0 z-0 opacity-75 mix-blend-screen pointer-events-none" aria-hidden="true">
        {isDesktop && (
          <Suspense fallback={<div className="absolute inset-0 bg-bg" />}>
            <ThreeCanvas />
          </Suspense>
        )}
      </div>

      {/* HUD Telemetry Frame (Cinematic Viewfinder Overlay) */}
      <div className="absolute inset-0 z-20 pointer-events-none p-6 md:p-10 flex flex-col justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.2em] uppercase select-none opacity-80" aria-hidden="true">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse shadow-[0_0_8px_var(--color-acid)]"></span>
            <span className="text-acid/90 font-bold">REC ● [00:26:04:18]</span>
            <span className="hidden md:inline text-ink-dim">// FPS: 60.0</span>
          </div>
          <div className="text-right">
            <span>ANAMORPHIC · 2.39:1</span>
            <span className="hidden sm:inline ml-3 text-acid/80">FOV: 85°</span>
          </div>
        </div>
        <div className="flex justify-between items-end pb-12 md:pb-6">
          <div className="hidden sm:block">
            <span>OPTICAL DEPTH: ACTIVE</span><br/>
            <span className="text-acid/80">NODE: BOG_LATAM_01</span>
          </div>
          <div className="text-right">
            <span>[ + ] CROSSHAIR CENTER</span><br/>
            <span className="text-ink-dim">COLOR_TEMP: 5600K</span>
          </div>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="shell relative z-20 min-h-[calc(100vh-60px)] flex flex-col justify-between pt-10 pb-6 pointer-events-none">
        <div className="flex justify-between font-mono text-[11px] text-ink-dim uppercase tracking-widest mb-10" aria-hidden="true">
          <span className="hidden sm:inline">[ BRAND OPERATING SYSTEM ]</span>
          <span className="hidden sm:inline">INDEX / 01 — 07</span>
          <span>REV. 2026.04</span>
          <span>NICOLÁS · DISEÑO+ENG</span>
        </div>

        <div className="mt-auto">
          <div className="text-[clamp(50px,15vw,300px)] font-bold leading-[0.82] tracking-[-0.055em] relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            NCLS<span className="text-acid">.</span>DEV
            <span className="inline-block w-[0.42em] h-[0.82em] bg-acid ml-[0.04em] align-[-0.12em] animate-[blink_1s_steps(2)_infinite]"></span>
          </div>

          {/* Quantitative Impact Telemetry Band */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pointer-events-auto">
            {[
              { label: "NÓMINA & AUDITORÍA", val: "501", sub: "Colaboradores (0 errores)" },
              { label: "CATÁLOGO B2B", val: "7", sub: "Suites SaaS Comerciales" },
              { label: "ERP SUPPLY CHAIN", val: "82K+", sub: "Assets unificados" },
              { label: "LATENCIA HARDWARE", val: "<20ms", sub: "WebSockets Móvil" },
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 bg-bg-2/80 border border-line/80 backdrop-blur-sm group hover:border-acid transition-colors">
                <div className="font-mono text-[9px] text-ink-dim uppercase tracking-widest">{m.label}</div>
                <div className="text-[26px] md:text-[32px] font-bold text-ink group-hover:text-acid transition-colors leading-none my-1">
                  {m.val}
                </div>
                <div className="font-mono text-[10px] text-ink-dimmer tracking-wide">{m.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr] gap-8 lg:gap-10 mt-6 pt-6 border-t border-line items-start pointer-events-auto bg-bg/60 backdrop-blur-md p-6 border border-line/60 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-acid uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-acid rounded-full animate-ping"></span>
                <span>// CREATIVE TECHNOLOGIST & SYSTEMS ARCHITECT</span>
              </div>
              <p className="text-[17px] md:text-[20px] leading-[1.35] font-medium tracking-[-0.015em] text-ink">
                Diseño lo que construyo. <span className="text-acid font-semibold">Construyo lo que diseño.</span> La creatividad es una función técnica y operativa.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a 
                  href="#portfolio" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-acid text-bg font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-[0_0_15px_rgba(198,255,61,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  <span>Explorar SaaS (7)</span>
                  <span>↓</span>
                </a>
                <a 
                  href="/cv" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-bg-2 border border-line text-ink font-mono text-xs font-medium uppercase tracking-wider hover:border-acid hover:text-acid transition-all cursor-pointer"
                >
                  <span>CV Técnico (Dossier)</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3">{`// Dominio & Enfoque`}</h2>
              <div className="text-[11px] font-mono leading-[1.6]">
                <span className="inline-block px-2.5 py-0.5 border border-acid/80 bg-acid/10 text-acid font-medium mr-1 mb-1">Next.js 16 + React 19</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid/80 bg-acid/10 text-acid font-medium mr-1 mb-1">Electron Desktop</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid/80 bg-acid/10 text-acid font-medium mr-1 mb-1">Ollama / Gemini Multimodal</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Tailwind CSS v4</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Node 24 / Express 5</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Branding ExxonMobil/MIP</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Nómina Paramétrica</span>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3">{`// Estado Operativo`}</h2>
              <div className="font-mono text-[11px] text-ink-dim leading-[1.7] p-3 bg-bg-2/60 border border-line">
                <div className="flex items-center justify-between mb-1">
                  <span>DISPONIBILIDAD:</span>
                  <span className="text-acid font-bold">● ACTIVO</span>
                </div>
                <div>ROL: LEAD SYSTEMS ARCHITECT</div>
                <div>UBICACIÓN: BOGOTÁ, COL (GMT-5)</div>
                <div className="text-ink-dimmer pt-1 border-t border-line mt-1">RESPUESTA TÉCNICA &lt; 24H</div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-y border-line py-4 -mx-5 md:-mx-10 mt-6 text-[clamp(20px,2.8vw,40px)] font-bold tracking-[-0.02em] whitespace-nowrap pointer-events-auto bg-bg/75 backdrop-blur-md" aria-hidden="true">
          <div className="ticker-track">
            <span>PROCURECORE 2.0</span><span className="text-acid">✺</span>
            <span>BROADCAST OS 365</span><span className="text-acid">✺</span>
            <span>PROVEEDHUB AI</span><span className="text-acid">✺</span>
            <span>EVALPRO ENTERPRISE</span><span className="text-acid">✺</span>
            <span>COMMANDHUB PRO</span><span className="text-acid">✺</span>
            <span>NEUROPOST LOCAL AI</span><span className="text-acid">✺</span>
            <span>DOCUDISPATCH SUITE</span><span className="text-acid">✺</span>
            <span>EXXONMOBIL CAMPAIGNS</span><span className="text-acid">✺</span>
            <span>SAN JUAN PLAZA</span><span className="text-acid">✺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFuturistic;
