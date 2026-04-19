import { Reveal } from "@/components/ui/reveal"

const experiences = [
    {
        date: "MAR 2025 — PRESENTE",
        role: "Design Strategist & B2B Branding Specialist",
        company: "MIP Internacional Trading SAS",
        description: "Liderazgo en transformación digital y arquitectura visual de activos industriales. Desarrollo de ecosistemas ERP avanzados con inteligencia artificial.",
        tags: ["React", "Node.js", "Python", "Gemini AI"]
    },
    {
        date: "ENE 2025 — MAR 2025",
        role: "Digital Products Coordinator",
        company: "Partido Cambio Radical",
        description: "Gestión de activos digitales y producción multimedia para campañas nacionales. Diseño de materiales para capacitación y e-learning.",
        tags: ["Adobe CC", "Multimedia", "Liderazgo"]
    },
    {
        date: "MAR 2024 — OCT 2024",
        role: "Trade Mark Coordinator",
        company: "Districol LTDA",
        description: "Coordinación de trade marketing y gestión de marca nacional para distribuidora de combustibles. Estrategia comercial y branding.",
        tags: ["Branding", "Retail", "Strategy"]
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
