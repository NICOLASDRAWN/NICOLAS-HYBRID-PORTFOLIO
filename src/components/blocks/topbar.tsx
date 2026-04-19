'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[100] backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? 'bg-bg/92 border-line shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]'
          : 'bg-bg/70 border-line/60'
      }`}
    >
      <div className="flex items-center justify-between py-3.5 px-10 font-mono text-[11px] tracking-wider uppercase">
        <div className="flex items-center gap-5">
          <span className="w-2.5 h-2.5 bg-acid rounded-full shadow-[0_0_14px_var(--color-acid)] animate-pulse"></span>
          <strong className="font-medium text-ink">NCLS.DEV</strong>
          <span className="text-ink-dim hidden md:inline">Brand OS — v1.0</span>
        </div>
        <nav className="hidden lg:flex gap-6">
          <Link href="#manifesto" className="nav-underline text-ink-dim hover:text-acid transition-colors">01 Manifesto</Link>
          <Link href="#avatar" className="nav-underline text-ink-dim hover:text-acid transition-colors">02 Perfil</Link>
          <Link href="#portfolio" className="nav-underline text-ink-dim hover:text-acid transition-colors">03 Portafolio</Link>
          <Link href="#contact" className="nav-underline text-ink-dim hover:text-acid transition-colors">04 Contacto</Link>
          <Link
            href="/carta"
            className="text-acid font-bold hover:text-white transition-colors border border-line px-2 rounded-sm bg-bg-2 hover:border-acid"
          >
            VER CARTA
          </Link>
        </nav>
        <div className="flex gap-4 text-ink-dim items-center">
          <span className="hidden md:inline">LATAM / REMOTE</span>
          <span className="inline-flex items-center gap-2 text-acid before:content-[''] before:w-1.5 before:h-1.5 before:bg-acid before:rounded-full before:animate-pulse">
            SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] bg-acid shadow-[0_0_10px_var(--color-acid)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </header>
  );
}
