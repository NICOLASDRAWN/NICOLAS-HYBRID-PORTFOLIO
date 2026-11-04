'use client';

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Layers, Cpu, X, ExternalLink, ShieldCheck, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

interface CaseStudy {
  problem: string;
  architecture: string;
  aiAndTechChallenge: string;
  businessImpact: string;
  hybridAdvantage: string;
}

export interface ProjectItem {
  num: string;
  title: string;
  subtitle: string;
  category: 'fullstack' | 'brand';
  categoryLabel: string;
  description: string;
  tags: string[];
  stat: string;
  statLabel: string;
  color: string;
  link: string;
  badge?: string;
  caseStudy: CaseStudy;
}

const allProjects: ProjectItem[] = [
  {
    "num": "01",
    "title": "Gestión documental",
    "subtitle": "Proveedores y documentación",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Organización de registros, directorios e integración de análisis documental.",
    "tags": [
      "React",
      "Express",
      "Electron",
      "Python"
    ],
    "stat": "PRIVADO",
    "statLabel": "CASO ANONIMIZADO",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/NICOLASDRAWN/blob/main/docs/case-studies/automatizacion-empresarial.md",
    "badge": "CASO ANONIMIZADO",
    "caseStudy": {
      "problem": "Proveedores y documentación. Organización de registros, directorios e integración de análisis documental.",
      "architecture": "Tecnologías y enfoque: React, Express, Electron, Python.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Presentación cualitativa del trabajo, sin métricas internas.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "02",
    "title": "Compras y suministros",
    "subtitle": "Información operativa",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Herramientas de consulta y organización de registros comerciales.",
    "tags": [
      "Aplicaciones web",
      "Persistencia",
      "Respaldos"
    ],
    "stat": "PRIVADO",
    "statLabel": "CASO ANONIMIZADO",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/NICOLASDRAWN/blob/main/docs/case-studies/automatizacion-empresarial.md",
    "badge": "CASO ANONIMIZADO",
    "caseStudy": {
      "problem": "Información operativa. Herramientas de consulta y organización de registros comerciales.",
      "architecture": "Tecnologías y enfoque: Aplicaciones web, Persistencia, Respaldos.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Presentación cualitativa del trabajo, sin métricas internas.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "03",
    "title": "Evaluaciones",
    "subtitle": "Consolidación de resultados",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Modelado de procesos de evaluación y revisión de cálculos.",
    "tags": [
      "SQLite",
      "Excel",
      "Automatización"
    ],
    "stat": "PRIVADO",
    "statLabel": "CASO ANONIMIZADO",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/NICOLASDRAWN/blob/main/docs/case-studies/automatizacion-empresarial.md",
    "badge": "CASO ANONIMIZADO",
    "caseStudy": {
      "problem": "Consolidación de resultados. Modelado de procesos de evaluación y revisión de cálculos.",
      "architecture": "Tecnologías y enfoque: SQLite, Excel, Automatización.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Presentación cualitativa del trabajo, sin métricas internas.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "04",
    "title": "Comunicación corporativa",
    "subtitle": "Correo y documentos",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Preparación de comunicados y generación de documentos PDF con plantillas.",
    "tags": [
      "Python",
      "Flask",
      "HTML",
      "PDF"
    ],
    "stat": "PRIVADO",
    "statLabel": "CASO ANONIMIZADO",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/NICOLASDRAWN/blob/main/docs/case-studies/automatizacion-empresarial.md",
    "badge": "CASO ANONIMIZADO",
    "caseStudy": {
      "problem": "Correo y documentos. Preparación de comunicados y generación de documentos PDF con plantillas.",
      "architecture": "Tecnologías y enfoque: Python, Flask, HTML, PDF.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Presentación cualitativa del trabajo, sin métricas internas.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "05",
    "title": "Sincronización de archivos",
    "subtitle": "Utilidades de escritorio",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Seguimiento de archivos, historial y respaldo en servicios de almacenamiento.",
    "tags": [
      "Python",
      "SQLite",
      "APIs"
    ],
    "stat": "PRIVADO",
    "statLabel": "CASO ANONIMIZADO",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/NICOLASDRAWN/blob/main/docs/case-studies/automatizacion-empresarial.md",
    "badge": "CASO ANONIMIZADO",
    "caseStudy": {
      "problem": "Utilidades de escritorio. Seguimiento de archivos, historial y respaldo en servicios de almacenamiento.",
      "architecture": "Tecnologías y enfoque: Python, SQLite, APIs.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Presentación cualitativa del trabajo, sin métricas internas.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "06",
    "title": "AURA",
    "subtitle": "The City's Soundtrack",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Landing page de un concepto de descubrimiento musical urbano.",
    "tags": [
      "JavaScript",
      "Vite",
      "GSAP",
      "Three.js"
    ],
    "stat": "WEB",
    "statLabel": "ALCANCE",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/Aura-web",
    "badge": "PROYECTO PÚBLICO",
    "caseStudy": {
      "problem": "The City's Soundtrack. Landing page de un concepto de descubrimiento musical urbano.",
      "architecture": "Tecnologías y enfoque: JavaScript, Vite, GSAP, Three.js.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Landing page de un concepto de descubrimiento musical urbano.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "07",
    "title": "ConquistaLaCiudad",
    "subtitle": "Laboratorio Android",
    "category": "fullstack",
    "categoryLabel": "SOFTWARE",
    "description": "Base de práctica con una pantalla inicial de Jetpack Compose.",
    "tags": [
      "Kotlin",
      "Jetpack Compose",
      "Material 3"
    ],
    "stat": "INICIAL",
    "statLabel": "ALCANCE",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN/ConquistaLaCiudad",
    "badge": "PROYECTO PÚBLICO",
    "caseStudy": {
      "problem": "Laboratorio Android. Base de práctica con una pantalla inicial de Jetpack Compose.",
      "architecture": "Tecnologías y enfoque: Kotlin, Jetpack Compose, Material 3.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Proyecto de aprendizaje; todavía no implementa un juego ni geolocalización.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  },
  {
    "num": "08",
    "title": "Identidad visual",
    "subtitle": "Diseño y comunicación",
    "category": "brand",
    "categoryLabel": "DISEÑO",
    "description": "Exploraciones de branding, interfaces y contenido visual.",
    "tags": [
      "Figma",
      "Illustrator",
      "Photoshop"
    ],
    "stat": "DISEÑO",
    "statLabel": "ALCANCE",
    "color": "bg-acid",
    "link": "https://github.com/NICOLASDRAWN",
    "badge": "PROYECTO PÚBLICO",
    "caseStudy": {
      "problem": "Diseño y comunicación. Exploraciones de branding, interfaces y contenido visual.",
      "architecture": "Tecnologías y enfoque: Figma, Illustrator, Photoshop.",
      "aiAndTechChallenge": "Organizar la información y los estados de la interfaz para facilitar el uso y la revisión de resultados.",
      "businessImpact": "Exploraciones de branding, interfaces y contenido visual.",
      "hybridAdvantage": "Conectar comunicación visual, comprensión del proceso e implementación técnica."
    }
  }
];

export const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fullstack' | 'brand'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = allProjects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="portfolio" className="shell py-24">
      <Reveal as="div" variant="scale" className="border border-line bg-bg-2">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-bg-3 font-mono text-[11px] text-ink-dim uppercase tracking-widest" aria-hidden="true">
          <div className="flex items-center gap-2">
            <span className="w-[9px] h-[9px] rounded-full bg-warn"></span>
            <span className="w-[9px] h-[9px] rounded-full bg-line-2"></span>
            <span className="w-[9px] h-[9px] rounded-full bg-acid acid-pulse"></span>
            <span className="ml-2 text-ink-dimmer">SYS://PORTFOLIO_ENGINE_V2.1</span>
          </div>
          <div className="flex items-center gap-2 text-acid font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{filteredProjects.length} PROYECTOS VISIBLES</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          {/* Main Title & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 pb-8 border-b border-line">
            <div>
              <div className="font-mono text-[10px] text-acid uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-acid rounded-full animate-ping"></span>
                <span>[ PROYECTOS PÚBLICOS · CASOS ANONIMIZADOS ]</span>
              </div>
              <h2 className="text-[clamp(34px,5.5vw,80px)] font-bold tracking-[-0.05em] leading-[0.9] text-ink">
                Sistemas que <span className="text-acid">eliminan fricción</span>.
              </h2>
            </div>
            <div className="font-mono text-[11px] text-ink-dim leading-[1.7] uppercase tracking-widest flex flex-col justify-end">
              <div>[ FILOSOFÍA DE ARQUITECTURA ]</div>
              <strong className="block text-ink font-medium mt-1 normal-case text-[13px]">
                &ldquo;La ingeniería sin diseño crea rechazo. El diseño sin ingeniería crea frustración. Construyo la solución completa.&rdquo;
              </strong>
            </div>
          </div>

          {/* Categorías y Filtros Rápidos */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-line">
            <div className="inline-flex flex-wrap items-center p-1 bg-bg border border-line gap-1 font-mono text-xs" role="tablist" aria-label="Filtro de proyectos">
              <button
                onClick={() => setActiveFilter('all')}
                role="tab"
                aria-selected={activeFilter === 'all'}
                className={`px-3.5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFilter === 'all'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <span>Todos ({allProjects.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('fullstack')}
                role="tab"
                aria-selected={activeFilter === 'fullstack'}
                className={`px-3.5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFilter === 'fullstack'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Software ({allProjects.filter(p => p.category === 'fullstack').length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('brand')}
                role="tab"
                aria-selected={activeFilter === 'brand'}
                className={`px-3.5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFilter === 'brand'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Diseño ({allProjects.filter(p => p.category === 'brand').length})</span>
              </button>
            </div>

            <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping"></span>
              <span>CLICK EN CUALQUIER TARJETA PARA CASO DE ESTUDIO</span>
            </div>
          </div>

          {/* Project Cards List */}
          <div className="pt-8 space-y-4">
            {filteredProjects.map((p, i) => (
              <Reveal key={p.num} variant="left" delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div
                  onClick={() => setSelectedProject(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedProject(p); } }}
                  className="group block p-6 md:p-8 border border-line bg-bg hover:bg-bg-3 hover:border-acid transition-all duration-300 relative overflow-hidden cursor-pointer"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_220px] gap-6 items-start">
                    {/* Number & Category */}
                    <div className="font-mono text-sm text-ink-dim group-hover:text-acid transition-colors font-bold">
                      {p.num}
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-[22px] md:text-[28px] font-bold tracking-tight text-ink group-hover:text-acid transition-colors leading-none">
                          {p.title}
                        </h3>
                        <span className="font-mono text-[8.5px] uppercase px-2 py-0.5 border border-line bg-bg-2 text-ink-dim tracking-wider">
                          {p.categoryLabel}
                        </span>
                        {p.badge && (
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-acid/40 bg-acid/10 text-acid tracking-wider font-semibold">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs text-acid font-medium tracking-wide mb-2.5">
                        {p.subtitle}
                      </div>

                      <p className="text-[13.5px] text-ink-dim leading-relaxed max-w-3xl mb-4 group-hover:text-ink transition-colors">
                        {p.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[9.5px] px-2 py-0.5 border border-line bg-bg-2 text-ink-dimmer uppercase tracking-wider group-hover:border-line-2 group-hover:text-ink-dim transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stat / Action */}
                    <div className="lg:text-right flex lg:flex-col justify-between items-end pt-4 lg:pt-0 border-t lg:border-t-0 border-line">
                      <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest">
                        {p.statLabel}
                      </div>
                      <div className="text-[30px] md:text-[36px] font-bold text-acid leading-none my-1 tracking-tight">
                        {p.stat}
                      </div>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-dim group-hover:text-acid transition-colors uppercase tracking-wider font-bold">
                        <span>Ver Caso de Estudio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ─── MODAL DE CASO DE ESTUDIO (DEEP DIVE) ─── */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-2 border border-acid shadow-[0_20px_80px_rgba(0,0,0,0.9)] p-6 md:p-10 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-6 border-b border-line gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-acid font-bold">[ CASO DE ESTUDIO · #{selectedProject.num} ]</span>
                  <span className="px-2 py-0.5 border border-line text-ink-dim bg-bg">
                    {selectedProject.categoryLabel}
                  </span>
                  {selectedProject.badge && (
                    <span className="px-2 py-0.5 border border-acid/50 bg-acid/10 text-acid font-bold">
                      {selectedProject.badge}
                    </span>
                  )}
                </div>
                <h2 id="modal-project-title" className="text-[28px] md:text-[40px] font-bold tracking-tight text-ink leading-none">
                  {selectedProject.title}
                </h2>
                <div className="font-mono text-sm text-acid mt-1 font-medium">
                  {selectedProject.subtitle}
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Cerrar caso de estudio"
                className="p-2 border border-line bg-bg hover:border-acid hover:text-acid text-ink-dim transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Impact Metric Banner */}
            <div className="my-6 p-4 bg-bg border border-line flex flex-wrap items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-acid" />
                <div>
                  <div className="text-[9px] text-ink-dim uppercase tracking-wider">{selectedProject.statLabel}</div>
                  <div className="text-2xl font-bold text-acid leading-tight">{selectedProject.stat}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] px-2 py-1 border border-line bg-bg-2 text-ink-dim uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 4 Core Pillars of Deep Dive */}
            <div className="space-y-6 pt-2">
              {/* 01 / El Problema */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-warn uppercase tracking-widest mb-2 font-bold">
                  <span>01 /</span>
                  <span>EL PROBLEMA &amp; EL CONTEXTO</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selectedProject.caseStudy.problem}
                </p>
              </div>

              {/* 02 / La Arquitectura */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>02 / ARQUITECTURA &amp; STACK ELEGIDO</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selectedProject.caseStudy.architecture}
                </p>
              </div>

              {/* 03 / Reto Técnico & IA */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>03 / RETO TÉCNICO &amp; RESOLUCIÓN</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selectedProject.caseStudy.aiAndTechChallenge}
                </p>
              </div>

              {/* 04 / Impacto de Negocio */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  <span>04 /</span>
                  <span>RESULTADO &amp; IMPACTO DE NEGOCIO</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed font-medium">
                  {selectedProject.caseStudy.businessImpact}
                </p>
              </div>

              {/* Ventaja Híbrida */}
              <div className="p-5 bg-acid/5 border border-acid/40">
                <div className="font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  LA VENTAJA HÍBRIDA (COMUNICACIÓN + INGENIERÍA)
                </div>
                <p className="text-[13.5px] text-ink leading-relaxed italic">
                  &ldquo;{selectedProject.caseStudy.hybridAdvantage}&rdquo;
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="text-ink-dim text-[11px]">
                Presiona <kbd className="px-1.5 py-0.5 bg-bg border border-line text-acid">ESC</kbd> o haz clic fuera para cerrar.
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-bg border border-line text-ink hover:border-acid hover:text-acid transition-colors flex items-center gap-2 font-bold tracking-wider uppercase"
                >
                  <span>Ver Enlace / Repositorio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 bg-acid text-bg font-bold tracking-wider uppercase hover:bg-white transition-colors"
                >
                  Agendar Demostración
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
