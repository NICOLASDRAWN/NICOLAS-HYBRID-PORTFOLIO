import { Reveal } from "@/components/ui/reveal"

const experiences = [
    {
        date: "MAR 2025 — PRESENTE",
        role: "Lead Systems Architect & Creative Technologist",
        company: "MIP Internacional Trading SAS",
        description: "Liderazgo en transformación digital integral y arquitectura del catálogo de 7 productos SaaS comerciales (ProcureCore 2.0, BroadCast OS 365, ProveedHub AI, EvalPro). Gestión de plataformas para 501+ colaboradores, modelo matemático de bonos de nómina sin discrepancias y extracción inteligente con IA multimodal en red LAN.",
        tags: ["Next.js 16", "React 19", "Electron", "Ollama / Gemini", "PostgreSQL", "Tailwind v4", "Nómina Paramétrica"]
    },
    {
        date: "ENE 2025 — MAR 2025",
        role: "Digital Products & Multimedia Coordinator",
        company: "Partido Cambio Radical (Nacional)",
        description: "Coordinación de activos digitales, producción multimedia y diseño de módulos educativos e-learning para capacitación interna y campañas de comunicación política a nivel nacional.",
        tags: ["Adobe CC", "Motion Graphics", "E-Learning", "Dirección de Arte", "Campañas Nacionales"]
    },
    {
        date: "MAR 2024 — OCT 2024",
        role: "Trade Mark Coordinator — ExxonMobil / Mobil 1™",
        company: "Districol LTDA & ExxonMobil",
        description: "Coordinación nacional de trade marketing para lubricantes de alta gama Mobil 1™ y campaña nacional Mobil Super Moto 4T ('Siente Tu ADN Motero'). Dirección gráfica del Seminario Industrial Districol - Mobil en Hotel Marriott Cali.",
        tags: ["Mobil 1™", "Trade Marketing", "Retail B2B", "Gran Formato", "Identidad Corporativa"]
    },
    {
        date: "2023 — 2024",
        role: "Visual Production & Identity Designer",
        company: "Centro Comercial San Juan Plaza (Neiva)",
        description: "Diseño y producción visual de campañas comerciales de alto tráfico (Festival del Café y Cacao, Geek Fest, Bingo San Juan), señalética arquitectónica y cobertura fotográfica de eventos con Miss Universe Colombia.",
        tags: ["Branding Retail", "Señalética Wayfinding", "Fotografía Institucional", "Campañas B2C"]
    },
    {
        date: "2020 — 2023",
        role: "Creative Technologist & Brand Consultant",
        company: "Proyectos Estratégicos (Parrilla Bar 385, Parapente Boyacá, Covtrans)",
        description: "Creación de identidades visuales normativas, fotografía gastronómica de alta definición, menús digitales interactivos para smartphones y desarrollo web responsive para flotas de logística pesada.",
        tags: ["Manual de Marca", "Fotografía Gastronómica", "Web Mobile UX", "Diseño Vectorial"]
    },
    {
        date: "GRADUACIÓN 2020",
        role: "Comunicador Social Profesional",
        company: "Corporación Universitaria Minuto de Dios (UNIMINUTO)",
        description: "Formación superior en comunicación estratégica, semiótica, retórica visual y análisis de flujos de información humana y corporativa. Base humanista de todo el desarrollo tecnológico posterior.",
        tags: ["Comunicación Social", "Semiótica", "Estrategia de Medios", "Investigación", "Titulado"]
    }
]

export const Experience = () => {
    return (
        <section id="experience" className="shell py-24 border-t border-line">
            <Reveal as="div" className="flex items-end justify-between gap-10 mb-14">
                <div>
                    <div className="font-mono text-[11px] text-ink-dim uppercase tracking-widest flex gap-3 items-center mb-3.5">
                        <span className="text-acid">06</span><span>/</span><span>TIMELINE · TRAYECTORIA</span>
                    </div>
                    <h2 className="text-[clamp(44px,6.5vw,100px)] font-bold leading-[0.9] tracking-[-0.04em] text-wrap-balance text-ink">
                        Línea base<br/><span className="text-shine">operativa.</span>
                    </h2>
                </div>
            </Reveal>

            <Reveal as="div" variant="scale" delay={1} className="border border-line bg-bg-2 p-8 md:p-12">
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[5px] md:before:ml-[230px] before:-translate-x-px md:before:translate-x-0 before:w-px before:bg-line">
                    {experiences.map((exp, i) => (
                        <Reveal
                          key={i}
                          variant="left"
                          delay={(i + 1) as 1 | 2 | 3}
                          className="relative z-10 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-12 py-10 border-b border-line border-dashed last:border-b-0 first:pt-0 last:pb-0 group"
                        >
                            {/* Date */}
                            <div className="font-mono text-[11px] text-ink-dim tracking-[0.1em] uppercase pt-1 relative flex items-center md:items-start md:justify-end gap-4 md:gap-0">
                                {/* Timeline Dot */}
                                <div className="absolute left-[2px] md:left-auto md:right-[-42px] top-[4px] w-[7px] h-[7px] bg-bg border-2 border-line group-hover:border-acid group-hover:bg-acid transition-colors duration-300 rounded-full z-10 shadow-[0_0_0_4px_var(--color-bg-2)] group-hover:shadow-[0_0_0_4px_var(--color-bg-2),0_0_16px_var(--color-acid)]"></div>

                                <span className="pl-6 md:pl-0 group-hover:text-acid transition-colors duration-300">{exp.date}</span>
                            </div>

                            {/* Content */}
                            <div className="pl-6 md:pl-0 transition-transform duration-300 group-hover:translate-x-2">
                                <h3 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] leading-none mb-2 text-ink group-hover:text-acid transition-colors duration-300">
                                    {exp.role}
                                </h3>
                                <div className="font-mono text-[13px] text-ink-dim uppercase tracking-widest mb-6">
                                    {exp.company}
                                </div>
                                <p className="text-[14px] text-ink-dim leading-relaxed mb-6 max-w-2xl group-hover:text-ink transition-colors duration-300">
                                    {exp.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tags.map((tag, j) => (
                                        <span
                                          key={j}
                                          className="px-2.5 py-1 text-[10px] font-mono border border-line bg-bg text-ink-dim group-hover:border-acid group-hover:text-ink transition-all duration-300 uppercase tracking-widest hover:bg-acid hover:text-bg hover:-translate-y-0.5"
                                          style={{ transitionDelay: `${j * 30}ms` }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </Reveal>
        </section>
    )
}
