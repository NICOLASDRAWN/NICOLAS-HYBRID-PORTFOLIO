"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LiveClock } from "./live-clock";

const ParticleWave = dynamic(() => import("./particle-wave"), { ssr: false });

function canWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Recuadro del héroe: ola de partículas 3D + retícula de círculos de alambre + reloj y cifras. */
export function HeroVisual() {
  const [env, setEnv] = useState<{ gl: boolean; still: boolean; mobile: boolean } | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detección de capacidades del cliente, una sola vez
    setEnv({
      gl: canWebGL(),
      still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile: window.matchMedia("(max-width: 860px), (pointer: coarse)").matches,
    });
  }, []);

  return (
    <div className="hero-box relative w-full overflow-hidden rounded-md border border-line">
      <div className="absolute inset-0 hero-glow" aria-hidden="true" />
      {env?.gl && <div className="absolute inset-0"><ParticleWave still={env.still} mobile={env.mobile} /></div>}

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8">
          <circle cx="500" cy="235" r="190" />
          <ellipse cx="500" cy="235" rx="120" ry="190" />
          <ellipse cx="500" cy="235" rx="55" ry="190" />
          <ellipse cx="500" cy="235" rx="190" ry="70" />
          <line x1="500" y1="20" x2="500" y2="420" />
          <line x1="0" y1="235" x2="1000" y2="235" strokeDasharray="2 6" />
        </g>
        <circle cx="500" cy="235" r="3" fill="#C5F34A" />
      </svg>

      <div className="absolute left-4 bottom-4 md:left-5 md:bottom-5 flex items-center gap-2 text-ink">
        <span className="grid place-items-center size-6 rounded-sm bg-ink text-bg font-bold text-xs">N</span>
        <LiveClock className="text-ink-dim" />
      </div>

      <dl className="absolute right-3 bottom-3 md:right-5 md:bottom-5 flex gap-2">
        {[["37", "Municipios del Huila"], ["5", "Servicios"]].map(([n, l]) => (
          <div key={l} className="min-w-[96px] md:min-w-[120px] rounded-sm border border-line bg-bg/70 backdrop-blur px-3 py-2">
            <dt className="text-xl md:text-2xl font-medium text-ink leading-none">{n}</dt>
            <dd className="mt-1 text-[10px] md:text-[11px] text-ink-dim leading-tight">{l}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
