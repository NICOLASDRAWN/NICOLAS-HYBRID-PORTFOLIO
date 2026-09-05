'use client';

import { useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Terminal, Send, Sparkles } from "lucide-react";

export const Profile = () => {
  // Terminal interactiva con Easter Eggs
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<Array<{ cmd: string; res: string; isEasterEgg?: boolean }>>([
    {
      cmd: "whoami",
      res: "Nicolás Monroy Pabón · Comunicador Social (UNIMINUTO) × Systems Architect & Full-Stack Dev. Tesis: La creatividad es una función técnica."
    }
  ]);

  const handleCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun || inputVal).trim().toLowerCase();
    if (!rawCmd) return;

    let response = "";
    let isEasterEgg = false;

    switch (rawCmd) {
      case "help":
        response = "Comandos: 'whoami', 'skills', 'projects', 'contact', 'cv', 'carta', 'filosofia', 'clear', 'sudo hire'";
        break;
      case "whoami":
        response = "Nicolás Monroy: Diseñador de producto y arquitecto de sistemas. Ventaja: entiendo la psicología humana y escribo el código que la resuelve.";
        break;
      case "skills":
        response = "Next.js 16, React 19, TypeScript Estricto, Node.js 24, Python (PyMuPDF), Electron, Ollama Local AI, WebSockets <20ms.";
        break;
      case "projects":
        response = "7 Suites SaaS B2B (ProcureCore 2.0, ProveedHub AI, BroadCast OS, EvalPro...) + 6 Cuentas Brand (ExxonMobil, Marriott, San Juan Plaza).";
        break;
      case "contact":
        response = "Email: nicolasmonroy.dev@gmail.com · WhatsApp: +57 320 426 8452 · Bogotá, Colombia.";
        break;
      case "cv":
        window.location.href = "/cv";
        response = "Navegando a /cv...";
        break;
      case "carta":
        window.location.href = "/carta";
        response = "Navegando a /carta...";
        break;
      case "filosofia":
        response = '"Diseño lo que construyo. Construyo lo que diseño. La creatividad es una función técnica y operativa."';
        break;
      case "sudo hire":
      case "hire":
        isEasterEgg = true;
        response = "⚡ [ACCESS GRANTED]: Desplegando prioridad máxima. Redirigiendo a WhatsApp directo...";
        setTimeout(() => {
          window.open("https://wa.me/573204268452?text=Hola%20Nicol%C3%A1s,%20escrib%C3%AD%20'sudo%20hire'%20en%20tu%20terminal%20y%20quiero%20conversar%20sobre%20un%20proyecto", "_blank");
        }, 800);
        break;
      case "matrix":
        isEasterEgg = true;
        response = "01001110 01000011 01001100 01010011: No hay cuchara, solo código que resuelve problemas de negocio.";
        break;
      case "clear":
        setHistory([]);
        setInputVal("");
        return;
      default:
        response = `Comando no reconocido: '${rawCmd}'. Escribe 'help' para ver los comandos disponibles.`;
    }

    setHistory((prev) => [...prev.slice(-4), { cmd: rawCmd, res: response, isEasterEgg }]);
    setInputVal("");
  };

  return (
    <section id="avatar" className="shell py-24">
      <Reveal as="div" className="flex items-end justify-between gap-10 mb-14">
        <div>
          <div className="font-mono text-[11px] text-ink-dim uppercase tracking-widest flex gap-3 items-center mb-3.5">
            <span className="text-acid">04</span><span>/</span><span>PROFILE · AVATAR</span>
          </div>
          <h2 className="text-[clamp(48px,7.5vw,120px)] font-bold leading-[0.9] tracking-[-0.04em] text-wrap-balance text-ink">
            Cara del<br/><span className="text-shine">sistema.</span>
          </h2>
        </div>
        <aside className="flex-none max-w-[420px] font-mono text-[12px] text-ink-dim leading-[1.65] text-right hidden md:block">
          La ventaja competitiva de un comunicador que programa: <span className="text-acid font-medium">entiendo al usuario, la narrativa y el negocio antes de tirar la primera línea de código.</span>
        </aside>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" role="list" aria-label="Perfiles de identidad">
        {/* Dual Identity Card: Comunicación Social como Ventaja Competitiva */}
        <Reveal variant="up" delay={1} className="group bg-bg-2 border border-line aspect-square flex flex-col justify-between p-6 relative overflow-hidden hover-lift" role="listitem">
          <div className="scanline-layer" aria-hidden="true"></div>
          <div className="flex justify-between font-mono text-[9px] text-ink-dim tracking-[0.15em] uppercase">
            <span>A / COMUNICADOR SOCIAL</span>
            <span className="text-acid">UNIMINUTO 2020</span>
          </div>
          <div className="my-auto">
            <div className="text-[clamp(26px,2.8vw,34px)] font-bold tracking-[-0.04em] leading-[1.05] text-ink">
              Semiótica <span className="text-acid">&amp;</span> Adopción<span className="text-acid">.</span>
            </div>
            <p className="text-[12px] font-mono text-ink-dim mt-2.5 leading-relaxed">
              Un desarrollador estándar solo busca que el código compile. Yo decodifico la psicología del usuario final, la retórica visual y el propósito corporativo para diseñar software que la gente adopta con naturalidad.
            </p>
          </div>
          <div className="pt-3 border-t border-line font-mono text-[9px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between">
            <span>VENTAJA HUMANA</span>
            <span className="text-acid font-bold">● PRODUCT STRATEGY</span>
          </div>
        </Reveal>

        {/* Systems Architect Card */}
        <Reveal variant="up" delay={2} className="group bg-bg-3 border border-line aspect-square flex flex-col justify-between p-6 relative overflow-hidden hover-lift" role="listitem">
          <div className="scanline-layer" aria-hidden="true"></div>
          <div className="flex justify-between font-mono text-[9px] text-ink-dim tracking-[0.15em] uppercase">
            <span>B / SYSTEMS ARCHITECT</span>
            <span className="text-warn">HARDWARE+CODE</span>
          </div>
          <div className="my-auto">
            <div className="text-[clamp(26px,2.8vw,34px)] font-bold tracking-[-0.04em] leading-[1.05] text-ink">
              Ingeniería <span className="text-warn">&amp;</span> Resiliencia<span className="text-warn">.</span>
            </div>
            <p className="text-[12px] font-mono text-ink-dim mt-2.5 leading-relaxed">
              Arquitectura de tolerancia a fallos, bases autoreparables (.bak), inferencia privada local en GPU ($0 en suscripciones) y sincronización LAN ultrarrápida por WebSockets.
            </p>
          </div>
          <div className="pt-3 border-t border-line font-mono text-[9px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between">
            <span>FULL-STACK + DESKTOP</span>
            <span className="text-warn font-bold">&lt;20MS LATENCY</span>
          </div>
        </Reveal>

        {/* Glyph Avatar */}
        <Reveal variant="up" delay={3} className="group bg-acid border border-line aspect-square relative overflow-hidden flex items-center justify-center hover-lift" role="listitem">
          <svg viewBox="0 0 200 200" className="w-[55%] h-[55%] transition-transform duration-500 ease-out group-hover:rotate-[8deg] group-hover:scale-105" fill="none" stroke="#0A0A0A" strokeWidth="12" strokeLinecap="square" aria-hidden="true">
            <rect x="28" y="28" width="144" height="144"/>
            <path d="M50 150 L50 50 L150 150 L150 50"/>
            <circle cx="100" cy="100" r="4" fill="#0A0A0A"/>
          </svg>
          <div className="absolute bottom-0 left-0 right-0 py-3 px-3.5 bg-bg/70 border-t border-line/20 font-mono text-[10px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between backdrop-blur-sm">
            <span className="text-bg font-bold">C / GLYPH</span>
            <span className="text-bg font-bold">NCLS.MONROY</span>
          </div>
        </Reveal>

        {/* Interactive Terminal with Easter Eggs */}
        <Reveal variant="up" delay={4} className="group bg-bg border border-line aspect-square relative overflow-hidden hover-lift flex flex-col justify-between" role="listitem">
          <div className="scanline-layer" aria-hidden="true"></div>
          
          {/* Terminal Top Bar */}
          <div className="p-3 bg-bg-2 border-b border-line flex items-center justify-between font-mono text-[9px] text-ink-dim uppercase tracking-wider select-none">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-acid" />
              <span>TERMINAL // INTERACTIVA</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse"></span>
              <span className="text-acid text-[8px] font-bold">SYS: LIVE</span>
            </div>
          </div>

          {/* Terminal Scroll View */}
          <div className="p-3.5 flex-1 overflow-y-auto font-mono text-[10.5px] leading-relaxed text-ink space-y-2">
            <div className="text-ink-dimmer text-[9px]">
              Escribe comandos o toca los atajos:
            </div>

            {history.map((h, i) => (
              <div key={i} className="space-y-0.5">
                <div className="text-ink-dim flex items-center gap-1">
                  <span className="text-acid">~/ncls $</span>
                  <span className="text-ink font-semibold">{h.cmd}</span>
                </div>
                <div className={`text-[10px] pl-3 border-l ${h.isEasterEgg ? 'text-acid border-acid font-bold' : 'text-ink-dim border-line'}`}>
                  {h.res}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Command Chips & Input Form */}
          <div className="p-2.5 bg-bg-2/90 border-t border-line space-y-2">
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1">
              {['help', 'whoami', 'skills', 'projects', 'sudo hire'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className={`font-mono text-[8px] px-1.5 py-0.5 border uppercase tracking-wider cursor-pointer transition-colors ${
                    cmd === 'sudo hire'
                      ? 'border-acid/80 bg-acid/15 text-acid font-bold hover:bg-acid hover:text-bg'
                      : 'border-line bg-bg text-ink-dim hover:border-acid hover:text-acid'
                  }`}
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Input field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommand();
              }}
              className="flex items-center gap-1.5"
            >
              <span className="font-mono text-acid text-xs select-none">&gt;</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Escribe comando..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-[10px] text-ink placeholder:text-ink-dimmer"
              />
              <button
                type="submit"
                aria-label="Enviar comando"
                className="p-1 text-ink-dim hover:text-acid transition-colors cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </Reveal>
      </div>

      {/* Posts / Pulse section below as "Latest Pulse" */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Cerebro Vault Pulse */}
        <Reveal variant="up" delay={1} className="group aspect-square bg-bg-2 border border-line p-8 relative overflow-hidden flex flex-col hover-lift">
          <div className="scanline-layer" aria-hidden="true"></div>
          <div className="font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase">01 / SEGUNDO CEREBRO</div>
          <div className="absolute top-4.5 right-5 font-mono text-[10px] text-acid tracking-[0.1em] uppercase acid-pulse">● OBSIDIAN LIVE</div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[clamp(26px,3.4vw,40px)] font-bold tracking-[-0.03em] leading-[0.95] text-ink">
              Bóveda Cerebro de 25 Módulos<span className="text-acid">.</span>
            </div>
            <p className="text-[13px] text-ink-dim mt-4 max-w-[28ch] leading-relaxed">
              Arquitectura de conocimiento unificada: radiografía profesional, radar tecnológico y documentación viva de cada línea de código desplegada.
            </p>
          </div>
          <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.12em] uppercase pt-3 border-t border-line">
            <span>#001 · KNOWLEDGE REPO</span>
            <span className="text-acid font-bold">100% TRAZABILIDAD</span>
          </div>
        </Reveal>

        {/* Mode / Availability Card */}
        <Reveal variant="scale" delay={2} className="group aspect-square bg-acid text-bg p-8 relative overflow-hidden flex flex-col hover-lift acid-glow">
          <div className="font-mono text-[10px] text-bg/65 tracking-[0.1em] uppercase">02 / CONTRATACIÓN</div>
          <div className="absolute top-4.5 right-5 font-mono text-[10px] text-bg/65 tracking-[0.1em] uppercase font-bold">● DISPONIBLE</div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[clamp(40px,5.5vw,74px)] font-bold tracking-[-0.04em] leading-[0.9]">
              <span className="block">Systems</span>
              <span className="block">Architect</span>
              <span className="block text-bg/70">Lead Dev</span>
            </div>
            
            <div className="flex gap-2 mt-6">
              <a 
                href="/cv" 
                className="flex-1 bg-bg text-ink font-mono text-[9px] py-3 text-center border border-bg hover:bg-bg-3 transition-colors uppercase tracking-wider font-bold"
              >
                VER CV (PDF)
              </a>
              <a 
                href="/carta" 
                className="flex-1 bg-bg text-ink font-mono text-[9px] py-3 text-center border border-bg hover:bg-bg-3 transition-colors uppercase tracking-wider font-bold"
              >
                CARTA (PDF)
              </a>
            </div>
          </div>
          <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-bg/55 tracking-[0.12em] uppercase pt-3 border-t border-bg/20">
            <span>#002 · MODALIDAD</span>
            <span>REMOTO / HÍBRIDO (GMT-5)</span>
          </div>
        </Reveal>

        {/* Quantitative Impact Card */}
        <Reveal variant="up" delay={3} className="group aspect-square bg-bg-3 border border-line p-8 relative overflow-hidden flex flex-col hover-lift">
          <div className="scanline-layer" aria-hidden="true"></div>
          <div className="font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase">03 / AUDITORÍA REAL</div>
          <div className="absolute top-4.5 right-5 font-mono text-[10px] text-warn tracking-[0.1em] uppercase font-bold">● 0 DISCREPANCIAS</div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-[clamp(44px,5.5vw,72px)] font-bold tracking-[-0.05em] leading-[0.88] text-ink">
              501<span className="text-warn">p</span><br/><span className="text-[clamp(22px,3vw,34px)] tracking-tight text-ink-dim">Auditados</span>
            </div>
            <div className="font-mono text-[11.5px] text-ink-dim mt-4 tracking-[0.02em] leading-relaxed">
              Cierre de bonos de nómina agosto 2026. Modelo matemático paramétrico con 75 casos penalizados resueltos sin margen de error.
            </div>
          </div>
          <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.12em] uppercase pt-3 border-t border-line">
            <span>#003 · COMPLIANCE MIP</span>
            <span className="text-warn font-bold">100% EXACTO</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
