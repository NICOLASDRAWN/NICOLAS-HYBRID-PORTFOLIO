'use client';
import Link from 'next/link';

export function Topbar() {
  return (
    <header className="sticky top-0 z-[100] bg-bg/88 backdrop-blur-md border-b border-line">
      <div className="flex items-center justify-between py-3.5 px-10 font-mono text-[11px] tracking-wider uppercase">
        <div className="flex items-center gap-5">
          <span className="w-2.5 h-2.5 bg-acid rounded-full shadow-[0_0_14px_var(--color-acid)] animate-pulse"></span>
          <strong className="font-medium text-ink">NCLS.DEV</strong>
          <span className="text-ink-dim hidden md:inline">Brand OS — v1.0</span>
        </div>
        <nav className="hidden lg:flex gap-6">
          <Link href="#manifesto" className="text-ink-dim hover:text-acid transition-colors">01 Manifesto</Link>
          <Link href="#avatar" className="text-ink-dim hover:text-acid transition-colors">02 Perfil</Link>
          <Link href="#portfolio" className="text-ink-dim hover:text-acid transition-colors">03 Portafolio</Link>
          <Link href="#contact" className="text-ink-dim hover:text-acid transition-colors">04 Contacto</Link>
          <Link href="/carta" className="text-acid font-bold hover:text-white transition-colors border border-line px-2 rounded-sm bg-bg-2">VER CARTA</Link>
        </nav>
        <div className="flex gap-4 text-ink-dim items-center">
          <span className="hidden md:inline">LATAM / REMOTE</span>
          <span className="inline-flex items-center gap-2 text-acid before:content-[''] before:w-1.5 before:h-1.5 before:bg-acid before:rounded-full before:animate-pulse">
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </header>
  );
}
