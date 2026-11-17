"use client";

import { useEffect, useState } from "react";

/** Reloj en vivo de Colombia (GMT-5), estilo retícula técnica. */
export function LiveClock({ className = "" }: { className?: string }) {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums ${className}`} aria-label="Hora en Colombia">
      CO · GMT-5 · <span className="text-accent">{now}</span>
    </span>
  );
}
