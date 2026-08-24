'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    // Lógica de desinfección de URL para SEO (Redirección de URLs duplicadas o mal formadas)
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const href = window.location.href;

      // Si la URL contiene otra URL (ej: ncls.lat/https://ncls.lat/) o rutas duplicadas extrañas
      if (href.includes('http') && href.split('http').length > 2) {
        window.location.replace('/');
      } else if (path.includes('//') || path.includes('/http') || path.includes('/ncls.lat')) {
        window.location.replace('/');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center items-center p-6 text-center font-mono select-none">
      <div className="max-w-md w-full border border-line p-8 bg-bg-2 shadow-[0_30px_90px_rgba(0,0,0,0.6)] relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-acid/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Viewfinder crosshairs */}
        <div className="absolute top-2 left-2 text-[8px] text-acid/40">[ + ]</div>
        <div className="absolute bottom-2 right-2 text-[8px] text-acid/40">[ 404 ]</div>

        <div className="text-acid font-bold text-[13px] tracking-[0.2em] mb-4 uppercase">
          [ ERROR_CODE: SYS_404 ]
        </div>
        
        <h2 className="text-[28px] font-bold tracking-tight text-ink mb-6">
          RUTA NO ENCONTRADA
        </h2>
        
        <p className="text-[12px] text-ink-dim leading-relaxed mb-8">
          La dirección que intentas consultar no existe o ha sido reubicada dentro del sistema operativo de marca.
        </p>

        <Link 
          href="/" 
          className="inline-block w-full bg-acid text-bg font-bold py-3 text-center text-[10px] tracking-widest hover:bg-acid-dim transition-colors uppercase"
        >
          REGRESAR AL NÚCLEO (INICIO)
        </Link>
      </div>
    </div>
  );
}
