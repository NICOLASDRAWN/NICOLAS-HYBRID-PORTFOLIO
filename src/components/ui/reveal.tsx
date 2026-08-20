'use client';

/**
 * <Reveal /> — scroll-triggered micro-animation helper
 * ----------------------------------------------------
 * Envuelve cualquier bloque y le pega un [data-reveal] + clase .is-in
 * cuando entra en viewport. Los estilos viven en globals.css, así que
 * este archivo solo se ocupa de la observación.
 *
 * Usage:
 *   <Reveal>            → reveal-up (default)
 *   <Reveal variant="left" delay={2}>
 *
 * Notas:
 *   - Client Component (necesita IntersectionObserver).
 *   - Si el navegador no soporta IO o el usuario prefiere reduced-motion,
 *     arrancamos ya revelados — el CSS se encarga.
 *   - `once` por defecto: dispara una sola vez y suelta el observer.
 */

import { ReactNode, useEffect, useRef, useState, HTMLAttributes } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'blur';

type Props = {
  children: ReactNode;
  variant?: Variant;
  /** 1..8 — mapeado a ~80..640 ms de retardo. */
  delay?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /** Si es `false`, se vuelve a animar al salir y entrar otra vez. */
  once?: boolean;
  as?: 'div' | 'section' | 'article' | 'li' | 'span' | 'header' | 'footer';
  /** Umbral del IntersectionObserver, 0..1. */
  threshold?: number;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>;

export function Reveal({
  children,
  variant = 'up',
  delay,
  once = true,
  as = 'div',
  threshold = 0.15,
  className = '',
  ...rest
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR fallback: safe to set once
      setIsIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsIn(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsIn(false);
          }
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const Tag = as as 'div' | 'section' | 'article' | 'li' | 'span' | 'header' | 'footer';
  const revealAttr = variant === 'up' ? '' : variant;

  return (
    <Tag
      ref={ref}
      data-reveal={revealAttr || 'up'}
      {...(delay ? { 'data-delay': String(delay) } : {})}
      className={`${isIn ? 'is-in' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
