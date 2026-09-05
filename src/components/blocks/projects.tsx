'use client';

import { useState } from "react";
import { ArrowRight, Sparkles, Layers, Cpu } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

interface ProjectItem {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  stat: string;
  statLabel: string;
  color: string;
  link: string;
  badge?: string;
}

const saasProjects: ProjectItem[] = [
  {
    num: "01",
    title: "ProcureCore 2.0",
    subtitle: "ERP de Compras & Cadena de Suministro",
    description: "Reensamblaje y unificación de 82,355 archivos y 20,000 SKUs con Watchdog Centinela para prevención de sobrecostos y auditoría de compras.",
    tags: ["REACT", "EXPRESS 5", "ELECTRON DESKTOP", "SENTINEL WATCHDOG"],
    stat: "82K+",
    statLabel: "ARCHIVOS ERP",
    color: "bg-acid",
    link: "https://github.com/NICOLASDRAWN",
    badge: "MIP GROUP"
  },
  {
    num: "02",
    title: "BroadCast OS 365",
    subtitle: "Suite Corporativa & Circulares Office 365",
    description: "Plataforma editorial y generador de actas legales ADM-F-02 integrada a Microsoft 365. Redujo en un 85% el tiempo de emisión de comunicados a 501 empleados.",
    tags: ["NEXT.JS 16", "REACT 19", "OFFICE 365 API", "TAILWIND V4"],
    stat: "-85%",
    statLabel: "TIEMPO OPERATIVO",
    color: "bg-acid",
    link: "https://github.com/NICOLASDRAWN",
    badge: "DESK + WEB"
  },
  {
    num: "03",
    title: "ProveedHub AI",
    subtitle: "Auditoría de Proveedores & Visión Multimodal",
    description: "Homologación y extracción de RUT/certificados con Gemini AI Multimodal Vision, persistencia tolerante a fallos (.bak) y despliegue en red LAN.",
    tags: ["REACT 19", "EXPRESS LAN", "GEMINI 2.5 FLASH", "DATA RESILIENCY"],
    stat: "40+",
    statLabel: "PROVEEDORES SYNC",
    color: "bg-acid",
    link: "https://github.com/NICOLASDRAWN",
    badge: "LAN COMPLIANCE"
  },
  {
    num: "04",
    title: "EvalPro Enterprise",
    subtitle: "Desempeño 360° & Nómina Paramétrica",
    description: "Algoritmo matemático de liquidación de bonos con 67 cargos y 241 tareas desacopladas. Auditó a 501 colaboradores en agosto 2026 sin una sola discrepancia.",
    tags: ["REACT", "TYPESCRIPT STRICT", "NÓMINA PARAMÉTRICA", "CERO ERRORES"],
    stat: "501",
    statLabel: "COLABORADORES (0 ERR)",
    color: "bg-warn",
    link: "https://github.com/NICOLASDRAWN",
    badge: "MISSION CRITICAL"
  },
  {
    num: "05",
    title: "CommandHub Pro",
    subtitle: "Control Móvil de Hardware & Telemetría",
    description: "Trackpad táctil inalámbrico y monitor de recursos por WebSockets de ultra baja latencia (<20ms). Control de hardware, periféricos y apagado remoto.",
    tags: ["REACT NATIVE", "EXPO GO", "WEBSOCKETS", "ROBOTJS"],
    stat: "<20ms",
    statLabel: "LATENCIA WEBSOCKET",
    color: "bg-acid",
    link: "https://github.com/NICOLASDRAWN",
    badge: "ULTRA LOW LATENCY"
  },
  {
    num: "06",
    title: "NeuroPost Local AI",
    subtitle: "Agente Autónomo con Inferencia Local $0",
    description: "Automatización de marketing B2B con modelos LLM ejecutados localmente en Ollama y navegación headless con Playwright. Cero costo de API.",
    tags: ["OLLAMA LLM LOCAL", "PLAYWRIGHT", "NLP AGENT", "PYTHON DAEMON"],
    stat: "$0",
    statLabel: "COSTO DE INFERENCIA",
    color: "bg-ink",
    link: "https://github.com/NICOLASDRAWN",
    badge: "PRIVATE AI"
  },
  {
    num: "07",
    title: "DocuDispatch Suite",
    subtitle: "Motor de Actas Legales & Despacho SIG",
    description: "Generador automatizado de actas ADM-F-02, despacho por correo con trazabilidad de entrega y estricto cumplimiento normativo SIG-SST-F-120.",
    tags: ["NODE.JS 24", "NODEMAILER", "PDFKIT ENGINE", "SIG COMPLIANCE"],
    stat: "100%",
    statLabel: "COMPLIANCE LEGAL",
    color: "bg-warn",
    link: "https://github.com/NICOLASDRAWN",
    badge: "ISO/SIG CERTIFIED"
  }
];

const designProjects: ProjectItem[] = [
  {
    num: "08",
    title: "ExxonMobil / Mobil 1™",
    subtitle: "Trade Mark Coordinator — Campaña Nacional",
    description: "Estrategia nacional de marca para Mobil Super Moto 4T ('Siente Tu ADN Motero') y sintéticos de alta gama Mobil 1™. Merchandising, POP y retail.",
    tags: ["BRAND IDENTITY", "TRADE MARKETING", "RETAIL STRATEGY", "EXXONMOBIL"],
    stat: "COL",
    statLabel: "COBERTURA NACIONAL",
    color: "bg-acid",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "DISTRICOL LTDA"
  },
  {
    num: "09",
    title: "Seminario Industrial Mobil",
    subtitle: "Producción Visual de Gran Formato (Marriott Cali)",
    description: "Dirección de arte, señalética, credenciales y material editorial para el Seminario Industrial de lubricantes para el sector energético y minero.",
    tags: ["ADOBE INDESIGN", "GRAN FORMATO", "SEÑALÉTICA", "EDITORIAL"],
    stat: "B2B",
    statLabel: "CONVENCIÓN INDUSTRIAL",
    color: "bg-warn",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "HOTEL MARRIOTT"
  },
  {
    num: "10",
    title: "San Juan Plaza (Neiva)",
    subtitle: "Producción Gráfica & Cobertura Institucional",
    description: "Campañas visuales para el Festival del Café y Cacao, Geek Fest y eventos institucionales con personalidades de Miss Universe Colombia.",
    tags: ["DISEÑO GRÁFICO", "FOTOGRAFÍA INSTITUCIONAL", "CAMPAÑAS RETAIL"],
    stat: "RETAIL",
    statLabel: "CENTRO COMERCIAL",
    color: "bg-acid",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "NEIVA, HUILA"
  },
  {
    num: "11",
    title: "Parrilla Bar 385 / Food",
    subtitle: "Identidad Visual & Menú Digital Interactivo",
    description: "Fotografía gastronómica de alta definición, manual de identidad de restaurante y diseño de menú responsive para smartphones.",
    tags: ["FOTOGRAFÍA GASTRONÓMICA", "BRANDING", "MENÚ MOBILE UX"],
    stat: "360°",
    statLabel: "BRANDING + DIGITAL",
    color: "bg-ink",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "GASTRONOMÍA"
  },
  {
    num: "12",
    title: "Partido Cambio Radical",
    subtitle: "Coordinación de Productos Digitales & E-Learning",
    description: "Diseño y animación de módulos formativos digitales, motion graphics y piezas gráficas de comunicación política a nivel nacional.",
    tags: ["MOTION GRAPHICS", "E-LEARNING", "POLITICAL COMM", "PREMIERE PRO"],
    stat: "EDU",
    statLabel: "FORMACIÓN DIGITAL",
    color: "bg-warn",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "CAMPAÑA NACIONAL"
  },
  {
    num: "13",
    title: "Parapente Boyacá",
    subtitle: "Manual de Marca & Sistema Gráfico Deportivo",
    description: "Manual normativo de marca completo, paletas H/S/B y RGB, tipografías Aventura/Emprint e indumentaria técnica para pilotos.",
    tags: ["MANUAL DE MARCA", "ICONOGRAFÍA", "INDUMENTARIA", "TIPOGRAFÍA"],
    stat: "MANUAL",
    statLabel: "SISTEMA NORMATIVO",
    color: "bg-acid",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "DEPORTES EXTREMOS"
  }
];

export const Projects = () => {
  const [activeTab, setActiveTab] = useState<'saas' | 'design'>('saas');
  const currentList = activeTab === 'saas' ? saasProjects : designProjects;

  return (
    <section id="portfolio" className="shell py-24">
      <Reveal as="div" variant="scale" className="border border-line bg-bg-2">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-bg-3 font-mono text-[11px] text-ink-dim uppercase tracking-widest" aria-hidden="true">
          <div className="flex items-center gap-2">
            <span className="w-[9px] h-[9px] rounded-full bg-warn"></span>
            <span className="w-[9px] h-[9px] rounded-full bg-line-2"></span>
            <span className="w-[9px] h-[9px] rounded-full bg-acid acid-pulse"></span>
            <span className="ml-2 text-ink-dimmer">SYS://PORTFOLIO_ENGINE_V2</span>
          </div>
          <div className="flex items-center gap-2 text-acid font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeTab === 'saas' ? '7 SUITES ACTIVAS' : '6 GRANDES CUENTAS'}</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          {/* Main Title & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 pb-8 border-b border-line">
            <div>
              <div className="font-mono text-[10px] text-acid uppercase tracking-widest mb-2">
                [ CEREBRO KNOWLEDGE VAULT · PROYECTOS REALES ]
              </div>
              <h2 className="text-[clamp(36px,5.5vw,84px)] font-bold tracking-[-0.05em] leading-[0.9] text-ink">
                Sistemas que <span className="text-acid">eliminan fricción</span>.
              </h2>
            </div>
            <div className="font-mono text-[11px] text-ink-dim leading-[1.7] uppercase tracking-widest flex flex-col justify-end">
              <div>[ FILOSOFÍA DE ARQUITECTURA ]</div>
              <strong className="block text-ink font-medium mt-1 normal-case text-[13px]">
                "La ingeniería sin diseño crea rechazo. El diseño sin ingeniería crea frustración. Construyo la solución completa."
              </strong>
            </div>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-line">
            <div className="inline-flex items-center p-1 bg-bg border border-line rounded-none gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab('saas')}
                className={`px-4 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'saas'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Suites SaaS B2B (7)</span>
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`px-4 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'design'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Diseño & Grandes Cuentas (6)</span>
              </button>
            </div>

            <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping"></span>
              <span>INDEX: {activeTab === 'saas' ? 'SOFTWARE_ENTERPRISE' : 'BRAND_MARKETING'}</span>
            </div>
          </div>

          {/* Project Cards List */}
          <div className="pt-8 space-y-4">
            {currentList.map((p, i) => (
              <Reveal key={p.num} variant="left" delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 md:p-8 border border-line bg-bg hover:bg-bg-3 hover:border-acid transition-all duration-300 relative overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_220px] gap-6 items-start">
                    {/* Number */}
                    <div className="font-mono text-sm text-ink-dim group-hover:text-acid transition-colors font-bold">
                      {p.num}
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-[24px] md:text-[30px] font-bold tracking-tight text-ink group-hover:text-acid transition-colors leading-none">
                          {p.title}
                        </h3>
                        {p.badge && (
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-acid/40 bg-acid/10 text-acid tracking-wider">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs text-acid font-medium tracking-wide mb-3">
                        {p.subtitle}
                      </div>

                      <p className="text-[13.5px] text-ink-dim leading-relaxed max-w-3xl mb-4 group-hover:text-ink transition-colors">
                        {p.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {p.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 border border-line bg-bg-2 text-ink-dimmer uppercase tracking-wider group-hover:border-line-2 group-hover:text-ink-dim transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stat / Metric */}
                    <div className="lg:text-right flex lg:flex-col justify-between items-end pt-4 lg:pt-0 border-t lg:border-t-0 border-line">
                      <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest">
                        {p.statLabel}
                      </div>
                      <div className="text-[32px] md:text-[38px] font-bold text-acid leading-none my-1 tracking-tight">
                        {p.stat}
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-dimmer group-hover:text-acid transition-colors uppercase tracking-wider">
                        <span>Ver repo / caso</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};
