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

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-8 lg:gap-12 mt-12 pt-8 border-t border-line items-start pointer-events-auto bg-bg/40 backdrop-blur-md p-6 -ml-4 border border-line/60 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <div>
              <h2 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">{`// Tesis`}</h2>
              <p className="text-[18px] md:text-[22px] leading-[1.35] font-medium tracking-[-0.015em] max-w-[28ch] text-ink">
                Diseño lo que construyo. <span className="acid-hl">Construyo lo que diseño.</span> La creatividad es una función técnica.
              </p>
            </div>
            <div>
              <h2 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">{`// Stack`}</h2>
              <div className="text-[11px] font-mono leading-[1.6]">
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1 shadow-[0_0_12px_rgba(198,255,61,0.2)]">Diseño</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1 shadow-[0_0_12px_rgba(198,255,61,0.2)]">Desarrollo</span>
                <span className="inline-block px-2.5 py-0.5 border border-acid bg-acid text-bg font-medium mr-1 mb-1 shadow-[0_0_12px_rgba(198,255,61,0.2)]">Automatización</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Branding</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">UI/UX</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">Full-Stack</span>
                <span className="inline-block px-2.5 py-0.5 border border-line-2 mr-1 mb-1 text-ink-dim bg-bg-2">IA</span>
              </div>
            </div>
            <div>
              <h2 className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-3.5">{`// Estado`}</h2>
              <p className="font-mono text-[12px] text-ink-dim leading-[1.7]">
                ACEPTANDO PROYECTOS<br/>
                → Q3 2026<br/>
                <span className="text-acid font-medium acid-pulse">● LIBRE 3 SLOTS</span><br/>
                RESPUESTA &lt; 24h
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-y border-line py-4 -mx-5 md:-mx-10 mt-6 text-[clamp(22px,3vw,44px)] font-bold tracking-[-0.02em] whitespace-nowrap pointer-events-auto bg-bg/75 backdrop-blur-md" aria-hidden="true">
          <div className="ticker-track">
            <span>CREATIVIDAD TÉCNICA</span><span className="text-acid">✺</span>
            <span>DISEÑO + INGENIERÍA</span><span className="text-acid">✺</span>
            <span>BRAND IDENTITY + CODE</span><span className="text-acid">✺</span>
            <span>SISTEMAS QUE SE VEN BIEN</span><span className="text-acid">✺</span>
            <span>PIXEL-PERFECT · CODE-READY</span><span className="text-acid">✺</span>
            <span>CREATIVIDAD TÉCNICA</span><span className="text-acid">✺</span>
            <span>DISEÑO + INGENIERÍA</span><span className="text-acid">✺</span>
            <span>BRAND IDENTITY + CODE</span><span className="text-acid">✺</span>
            <span>SISTEMAS QUE SE VEN BIEN</span><span className="text-acid">✺</span>
            <span>PIXEL-PERFECT · CODE-READY</span><span className="text-acid">✺</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFuturistic;
