import Link from "next/link";
import { CONTACT, REGIONS, SERVICES, waLink } from "@/components/world/content";

export const SITE_URL = "https://ncls.lat";

export function Eyebrow({ n, center, children }: { n?: string; center?: boolean; children: React.ReactNode }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      {n && <span className="text-ink-dimmer">{n}</span>}
      <span className="h-[2px] w-8 bg-accent rounded-full" />
      {children}
    </p>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Header({ home = false }: { home?: boolean }) {
  const h = (id: string) => (home ? `#${id}` : `/#${id}`);
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bg/80 backdrop-blur-md">
      <div className="shell flex items-center justify-between h-16">
        <Link href="/" className="text-[15px] font-semibold tracking-[-0.02em] text-ink" aria-label="Inicio">
          NCLS.DEV<sup className="text-[9px] ml-0.5 text-accent">®</sup>
        </Link>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-ink-dim">
            <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
            <a href={h("servicios")} className="hover:text-ink transition-colors">Servicios</a>
            <a href={h("proyectos")} className="hover:text-ink transition-colors">Trabajos</a>
            <Link href="/huila/" className="hover:text-ink transition-colors">Huila</Link>
          </nav>
          <a href={waLink("Hola Nicolás, quiero cotizar un proyecto.")} target="_blank" rel="noopener noreferrer" className="text-[13px] text-ink underline underline-offset-4 decoration-accent hover:text-accent">
            Contacto
          </a>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="shell w-full pt-20 pb-8">
      <div className="border-t border-line-2 pt-8 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <p className="font-mono font-bold tracking-[0.2em]">NCLS<span className="text-accent">.</span>DEV</p>
          <p className="mt-3 text-ink-dim">Diseño, edición de video, desarrollo web y programación para el Huila y toda Colombia. Atención remota desde Bogotá.</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dimmer mb-3">Servicios</p>
          <ul className="space-y-1.5">
            {SERVICES.map((s) => (
              <li key={s.slug}><Link href={`/servicios/${s.slug}/`} className="hover:text-accent">{s.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dimmer mb-3">Huila</p>
          <ul className="space-y-1.5">
            {REGIONS.map((r) => (
              <li key={r.slug}><Link href={`/huila/${r.slug}/`} className="hover:text-accent">{r.city} · {r.region}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 flex flex-col md:flex-row gap-4 justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dimmer">
        <span>© 2026 Nicolás Monroy Pabón · Brand OS v4</span>
        <span className="flex flex-wrap gap-6">
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">LinkedIn</a>
          <Link href="/cv/" className="hover:text-accent">CV</Link>
          <Link href="/carta/" className="hover:text-accent">Carta</Link>
        </span>
      </div>
      <p aria-hidden="true" className="mt-10 select-none whitespace-nowrap font-bold leading-[0.8] tracking-[-0.06em] text-[13.2vw] text-ink/[0.06] -mx-[2vw]">
        NICOLÁS<span className="text-accent/40">.</span>MONROY
      </p>
    </footer>
  );
}

/** Píxeles que se desprenden del avatar (posiciones fijas = render determinista). */
const PIXELS: [number, number, number, string][] = [
  [8, 62, 14, ""], [4, 70, 9, "w"], [12, 78, 18, ""], [2, 84, 8, "k"], [16, 90, 11, ""],
  [86, 58, 12, ""], [92, 66, 16, "w"], [88, 74, 9, ""], [95, 82, 13, "k"], [82, 88, 10, ""],
  [20, 96, 14, "w"], [70, 95, 12, ""], [6, 40, 7, ""], [93, 36, 8, "k"], [78, 18, 6, ""],
];

export function AnimeAvatar({ className = "" }: { className?: string }) {
  return (
    <div className={`avatar-frame ${className}`}>
      <div className="avatar-glow" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático: imagen ya optimizada a webp */}
      <img
        src="/assets/avatar-anime.webp"
        alt="Avatar anime de Nicolás Monroy con chaqueta negra y acentos lima, extendiendo la mano"
        width={768}
        height={1152}
        fetchPriority="high"
        className="relative z-10 w-full h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
      />
      {PIXELS.map(([x, y, s, c], i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pixel ${c} z-20`}
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${(i % 5) * 0.6}s`, ["--dx" as string]: `${(i % 2 ? 1 : -1) * (8 + i)}px`, ["--dy" as string]: `${-10 - i}px` }}
        />
      ))}
    </div>
  );
}
