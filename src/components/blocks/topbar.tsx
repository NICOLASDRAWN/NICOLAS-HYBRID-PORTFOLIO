'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const menuItems = [
    { label: 'MNFST', href: '#manifesto' },
    { label: 'PRFL', href: '#avatar' },
    { label: 'PRTF', href: '#portfolio' },
    { label: 'CONT', href: '#contact' },
  ];

  return (
    <>
    <header
      className={`sticky top-0 z-[100] backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? 'bg-bg/92 border-line shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]'
          : 'bg-bg/70 border-line/60'
      }`}
    >
      <div className="flex items-center justify-between py-3.5 px-6 md:px-10 font-mono text-[11px] tracking-wider uppercase">
        <div className="flex items-center gap-5">
          <span className="w-2.5 h-2.5 bg-acid rounded-full shadow-[0_0_14px_var(--color-acid)] animate-pulse"></span>
          <strong className="font-medium text-ink">NCLS.DEV</strong>
          <span className="text-ink-dim hidden xl:inline">Brand OS — v1.0</span>
        </div>

        <nav className="hidden lg:flex gap-6">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="nav-underline text-ink-dim hover:text-acid transition-colors">
              {item.label}
            </Link>
          ))}
          <Link
            href="/carta"
            className="text-acid font-bold hover:text-white transition-colors border border-line px-2 rounded-sm bg-bg-2 hover:border-acid"
          >
            VER CARTA
          </Link>
        </nav>

        <div className="flex gap-4 text-ink-dim items-center">
          <span className="hidden md:inline">LATAM / REMOTE</span>
          
          <div className="flex items-center gap-2 text-acid font-bold lg:hidden">
            <span className="w-1.5 h-1.5 bg-acid rounded-full animate-pulse"></span>
            SYS: ON
          </div>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] bg-acid shadow-[0_0_10px_var(--color-acid)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </header>

    {/* UNIQUE MOBILE DOCK NAVIGATION */}
    <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-[400px]">
        <div className="bg-bg/85 backdrop-blur-2xl border border-line p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group">
            <div className="scanline-layer opacity-10"></div>
            
            <div className="flex items-center justify-between relative z-10">
                {menuItems.map((item) => (
                    <Link 
                        key={item.label} 
                        href={item.href} 
                        className="flex-1 py-3 text-center font-mono text-[9px] text-ink-dim hover:text-acid transition-all border-r border-line last:border-r-0 active:scale-95"
                    >
                        {item.label}
                    </Link>
                ))}
                <Link 
                    href="/cv" 
                    className="flex-none px-4 py-3 bg-acid text-bg font-bold font-mono text-[9px] hover:bg-white transition-colors active:scale-95"
                >
                    CV
                </Link>
            </div>

            {/* Sub-dock for labels/feedback */}
            <div className="absolute -top-7 left-0 right-0 flex justify-between px-2 font-mono text-[8px] text-acid/40 tracking-[0.2em] uppercase pointer-events-none">
                <span>[ NAV_SYST ]</span>
                <span>CORE_V1.0</span>
            </div>
        </div>
    </nav>
    </>
  );
}
