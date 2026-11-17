"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { STATIONS } from "./content";
import { measureStations, scrollState, updateStationT } from "./scroll-state";

const WorldScene = dynamic(() => import("./world-scene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Fondo 3D fijo + riel de navegación por estaciones. */
export function WorldStage() {
  const [env, setEnv] = useState<{ gl: boolean; reduced: boolean; mobile: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(pointer: coarse), (max-width: 860px)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detección de capaccentades del cliente, una sola vez
    setEnv({ gl: webglAvailable(), reduced, mobile });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        updateStationT();
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        setActive(Math.round(scrollState.t));
      });
    };
    const onResize = () => {
      measureStations();
      onScroll();
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      scrollState.pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      scrollState.pointerY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const show3d = env?.gl && !env.reduced;

  return (
    <>
      <div className="world-bg fixed inset-0 z-0" aria-hidden="true">
        {show3d && <WorldScene reduced={false} mobile={env.mobile} />}
        <div className="world-vignette absolute inset-0 pointer-events-none" />
      </div>

      <div className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-transparent" aria-hidden="true">
        <div ref={bar} className="h-full bg-accent origin-left" style={{ transform: "scaleX(0)" }} />
      </div>

      <nav aria-label="Estaciones" className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
        {STATIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center justify-end gap-3" aria-current={active === i ? "true" : undefined}>
            <span className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${active === i ? "text-accent" : "text-ink-dim"} opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`}>
              {String(i).padStart(2, "0")} {s.label}
            </span>
            <span className={`block h-[2px] transition-all duration-300 ${active === i ? "w-8 bg-accent" : "w-4 bg-line-2 group-hover:bg-ink-dim"}`} />
          </a>
        ))}
      </nav>
    </>
  );
}
