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
        <section id="experience" className="py-24 bg-white dark:bg-zinc-950">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">04 TRAYECTORIA</div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter text-zinc-900 dark:text-white mb-16">
                    Career <span className="text-blue-600">Path</span>
                </h2>

                <div className="space-y-12">
                    {experiences.map((exp, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12 group">
                            <div className="md:col-span-1">
                                <div className="text-sm font-bold text-zinc-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest pt-1">
                                    {exp.date}
                                </div>
                            </div>
                            <div className="md:col-span-3 pb-12 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                                    {exp.role}
                                </h3>
                                <div className="text-blue-600 font-medium mb-4">{exp.company}</div>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                    {exp.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tags.map((tag, j) => (
                                        <span key={j} className="px-3 py-1 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-full uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
