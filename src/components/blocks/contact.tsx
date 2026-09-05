'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, MessageSquare, Mail, Calendar } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  const whatsappMessage = encodeURIComponent("Hola Nicolás, vi tu portafolio Brand OS y me gustaría consultar la arquitectura de un proyecto.");
  const whatsappUrl = `https://wa.me/573150135016?text=${whatsappMessage}`;

  return (
    <>
      <section id="contact" className="shell py-24 mb-10 border-t border-line">
        <Reveal as="div" className="flex items-end justify-between gap-10 mb-14">
          <div>
            <div className="font-mono text-[11px] text-ink-dim uppercase tracking-widest flex gap-3 items-center mb-3.5">
              <span className="text-acid">07</span><span>/</span><span>CANALES OFICIALES · CONTACTO</span>
            </div>
            <h2 className="text-[clamp(44px,6.5vw,100px)] font-bold leading-[0.9] tracking-[-0.04em] text-wrap-balance text-ink">
              Inicia la<br/><span className="text-shine">conversación.</span>
            </h2>
          </div>
          <div className="hidden md:block font-mono text-xs text-ink-dim text-right max-w-[280px]">
            [ BOGOTÁ, COLOMBIA · GMT-5 ]<br/>
            <span className="text-acid font-bold">● RESPUESTA GARANTIZADA &lt; 24H</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Direct Communication */}
          <Reveal variant="left" delay={1} className="border border-line bg-bg-2 p-8 md:p-10 flex flex-col justify-between hover-lift group relative overflow-hidden">
            <div className="scanline-layer" aria-hidden="true"></div>
            <div>
              <div className="flex items-center justify-between font-mono text-[11px] text-ink-dim tracking-[0.12em] uppercase mb-6">
                <span>OPCIÓN_A // CANAL DIRECTO</span>
                <span className="text-acid">● DISPONIBLE</span>
              </div>
              <div className="text-[clamp(24px,2.6vw,36px)] font-bold tracking-[-0.025em] leading-[1.1] text-ink mb-4">
                Comunicación directa por correo o WhatsApp.
              </div>
              <p className="text-[13.5px] text-ink-dim leading-[1.65] mb-8">
                Para propuestas de arquitectura, liderazgo técnico o consultoría de software. Escríbeme y evaluamos requerimientos en menos de un día laborable.
              </p>
            </div>

            <div className="space-y-3">
              {/* Email item with copy button */}
              <div className="flex items-center justify-between p-4 md:p-5 border border-line bg-bg group/item hover:border-acid transition-all duration-300">
                <a
                  href="mailto:nicolasmonroypabon@gmail.com"
                  className="flex items-center gap-3 font-mono text-[12px] text-ink-dim group-hover/item:text-acid transition-colors truncate"
                  title="Enviar correo"
                >
                  <Mail className="w-4 h-4 text-ink-dim group-hover/item:text-acid shrink-0" />
                  <span className="truncate">nicolasmonroypabon@gmail.com</span>
                </a>
                <button
                  onClick={() => copyToClipboard('nicolasmonroypabon@gmail.com', 'email')}
                  className="p-2 border border-line-2 bg-bg-2 text-ink-dim hover:text-acid hover:border-acid font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Copiar correo"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-acid" />
                      <span className="text-acid font-bold">¡COPIADO!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPIAR</span>
                    </>
                  )}
                </button>
              </div>

              {/* WhatsApp item with pre-filled message */}
              <div className="flex items-center justify-between p-4 md:p-5 border border-line bg-bg group/item hover:border-acid transition-all duration-300">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-mono text-[12px] text-ink-dim group-hover/item:text-acid transition-colors"
                  title="Abrir WhatsApp con mensaje directo"
                >
                  <MessageSquare className="w-4 h-4 text-ink-dim group-hover/item:text-acid shrink-0" />
                  <span>+57 315 0135016</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-acid/50 bg-acid/10 text-acid font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-acid hover:text-bg transition-colors cursor-pointer shrink-0"
                >
                  <span>CHATEAR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Option B: Technical Call */}
          <Reveal variant="right" delay={2} className="border border-line bg-acid text-bg p-8 md:p-10 flex flex-col justify-between hover-lift acid-glow relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between font-mono text-[11px] text-bg/65 tracking-[0.12em] uppercase mb-6">
                <span>OPCIÓN_B // LLAMADA DE ARQUITECTURA</span>
                <span className="font-bold">15 MINUTOS</span>
              </div>
              <div className="text-[clamp(24px,2.6vw,36px)] font-bold tracking-[-0.025em] leading-[1.1] mb-6 text-bg">
                Agendemos una sesión técnica de 15 minutos en Calendly.
              </div>
              <ul className="text-[14px] font-medium space-y-3.5 pt-4 border-t border-bg/20">
                <li className="flex gap-3 items-center">
                  <span className="font-mono text-xs px-2 py-0.5 bg-bg text-acid font-bold">01</span>
                  <span>Evaluación de viabilidad técnica y arquitectura</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="font-mono text-xs px-2 py-0.5 bg-bg text-acid font-bold">02</span>
                  <span>Estrategia de inferencia local con IA ($0 costo de token)</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="font-mono text-xs px-2 py-0.5 bg-bg text-acid font-bold">03</span>
                  <span>Mapeo de requerimientos para software resiliente</span>
                </li>
              </ul>
            </div>

            <a
              href="https://calendly.com/nicolasmonroypabon/15min"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Agendar llamada de arquitectura en Calendly"
              className="group/cta mt-10 flex items-center justify-between p-5 bg-bg text-ink hover:text-acid transition-colors relative overflow-hidden"
            >
              <div className="flex items-center gap-2 font-mono text-[12px] uppercase font-bold relative z-10">
                <Calendar className="w-4 h-4 text-acid" />
                <span>Agendar en Calendly</span>
              </div>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover/cta:translate-x-1 transition-transform duration-300"/>
              <span className="absolute inset-0 bg-gradient-to-r from-bg via-bg-3 to-bg opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Editorial Silent Footer */}
      <footer className="shell pb-12 pt-6">
        <Reveal as="div" variant="up" className="text-[clamp(54px,11vw,200px)] font-bold tracking-[-0.055em] leading-[0.82] py-12 md:py-20 text-ink select-none">
          NCLS<span className="text-acid acid-pulse inline-block">.</span>DEV
        </Reveal>

        <div className="flex flex-col md:flex-row justify-between gap-6 py-8 border-t border-line font-mono text-[11px] text-ink-dim uppercase tracking-widest">
          <div>
            © 2026 NICOLÁS MONROY PABÓN · BRAND OS V2.0
            <span className="block text-[10px] text-ink-dimmer normal-case mt-0.5 font-mono">
              Comunicador Social (UNIMINUTO) · Creative Technologist · Systems Architect
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <a href="https://github.com/NICOLASDRAWN" target="_blank" rel="noopener noreferrer" className="nav-underline hover:text-acid transition-colors">GITHUB</a>
            <a href="https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/" target="_blank" rel="noopener noreferrer" className="nav-underline hover:text-acid transition-colors">LINKEDIN</a>
            <Link href="/cv" className="nav-underline hover:text-acid transition-colors">CV (WEB)</Link>
            <a href="/assets/Nicolas_Monroy_CV.pdf" download className="nav-underline hover:text-acid transition-colors">CV (PDF)</a>
            <Link href="/carta" className="nav-underline hover:text-acid transition-colors">CARTA (WEB)</Link>
            <a href="/assets/Carta_de_Presentacion_Nicolas_Monroy.pdf" download className="nav-underline hover:text-acid transition-colors">CARTA (PDF)</a>
          </div>
        </div>
      </footer>
    </>
  );
};
