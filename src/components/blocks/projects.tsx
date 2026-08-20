import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Reveal } from "@/components/ui/reveal"

const devProjects = [
    {
        num: "01",
        title: "ProveedHub Platform",
        tags: ["REACT", "EXPRESS", "GEMINI API", "ELECTRON"],
        stat: "LIVE",
        statLabel: "EN PRODUCCIÓN",
        color: "bg-acid",
        link: "https://github.com/NICOLASDRAWN",
    },
    {
        num: "02",
        title: "ERP Supply Chain",
        tags: ["REACT", "NODE.JS", "SQLITE", "CERTICÁMARA"],
        stat: "B2B",
        statLabel: "ENTERPRISE",
        color: "bg-ink",
        link: "https://github.com/NICOLASDRAWN",
    },
    {
        num: "03",
        title: "Conquista la Ciudad",
        tags: ["KOTLIN", "JETPACK COMPOSE", "GOOGLE MAPS SDK"],
        stat: "GEO",
        statLabel: "NATIVE APP",
        color: "bg-warn",
        link: "https://github.com/NICOLASDRAWN/ConquistaLaCiudad",
    }
]

const designProjects = [
    {
        num: "04",
        title: "Langers para Mobil",
        tags: ["ILUSTRATOR", "PHOTOSHOP", "BRANDING"],
        stat: "CORP",
        statLabel: "BRAND IDENTITY",
        color: "bg-acid",
        link: "#portfolio",
    },
    {
        num: "05",
        title: "San Juan Plaza",
        tags: ["DISEÑO GRÁFICO", "IDENTIDAD VISUAL", "SEÑALÉTICA"],
        stat: "VIS",
        statLabel: "IDENTIDAD",
        color: "bg-ink",
        link: "#portfolio",
    },
    {
        num: "06",
        title: "Manual de Marca",
        tags: ["BRAND GUIDELINES", "ADOBE INDESIGN", "TIPOGRAFÍA"],
        stat: "DOC",
        statLabel: "MANUAL DE MARCA",
        color: "bg-warn",
        link: "#portfolio",
    },
    {
        num: "07",
        title: "Señaleticas",
        tags: ["SEÑALÉTICA", "ILUSTRATOR", "DISEÑO INTERIOR"],
        stat: "SIG",
        statLabel: "WAYFINDING",
        color: "bg-acid",
        link: "#portfolio",
    },
    {
        num: "08",
        title: "Merch & Productos",
        tags: ["MERCH", "ILUSTRACIÓN", "POD"],
        stat: "PRD",
        statLabel: "MERCHANDISE",
        color: "bg-ink",
        link: "#portfolio",
    },
    {
        num: "09",
        title: "Invitación Seminario Industrial",
        tags: ["ILUSTRATOR", "EDICIÓN", "PRINT"],
        stat: "PRT",
        statLabel: "IMPRESIÓN",
        color: "bg-warn",
        link: "#portfolio",
    }
]

export const Projects = () => {
    return (
        <section id="portfolio" className="shell py-24">
            <Reveal as="div" variant="scale" className="border border-line bg-bg-2">
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-bg-3 font-mono text-[11px] text-ink-dim uppercase tracking-widest" aria-hidden="true">
                    <div className="flex gap-1.5">
                        <span className="w-[9px] h-[9px] rounded-full bg-warn"></span>
                        <span className="w-[9px] h-[9px] rounded-full bg-line-2"></span>
                        <span className="w-[9px] h-[9px] rounded-full bg-acid acid-pulse"></span>
                    </div>
                    <span>/PORTFOLIO_DB</span>
                </div>

                <div className="p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-[2.4fr_1fr] gap-10 pb-10 border-b border-line mb-0">
                        <h2 className="text-[clamp(44px,7vw,100px)] font-bold tracking-[-0.05em] leading-[0.86]">
                            <span className="block text-ink">Código y</span>
                            <span className="block text-shine">diseño.</span>
                        </h2>
                        <div className="font-mono text-[12px] text-ink-dim leading-[1.7] uppercase tracking-widest">
                            [ FOCUS ]
                            <strong className="block text-ink font-medium mt-1 mb-3.5 tracking-normal normal-case text-[13px]">Híbrido: Diseño + Ingeniería</strong>
                            [ CORE SKILLS ]
                            <strong className="block text-ink font-medium mt-1 tracking-normal normal-case text-[13px]">Full-Stack · Brand Identity · UI/UX · AI</strong>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-line -mx-8 md:-mx-12">
                        {[
                            { label: "FOCO", value: "Diseño + Dev", accent: null },
                            { label: "MODALIDAD", value: "Remoto", accent: "GMT-5" },
                            { label: "STACK", value: "Híbrido", accent: "Design+Code" },
                            { label: "ESTADO", value: "● Disponible", accent: null, valueClass: "text-acid acid-pulse" },
                        ].map((it, i) => (
                            <Reveal
                              as="div"
                              key={i}
                              delay={(i + 1) as 1 | 2 | 3 | 4}
                              className={`px-7 py-8 border-r border-line ${i < 2 ? "border-b md:border-b-0" : ""} ${i === 3 ? "border-r-0" : ""} transition-colors duration-300 hover:bg-bg-3`}
                            >
                                <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest mb-2.5">{it.label}</div>
                                <div className={`text-[clamp(20px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-tight ${it.valueClass ?? "text-ink"}`}>
                                    {it.value}
                                    {it.accent && <span className="text-[0.6em] text-acid ml-2">{it.accent}</span>}
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div className="pt-12">
                        {devProjects.map((p, i) => (
                            <Reveal key={i} variant="left" delay={(i + 1) as 1 | 2 | 3}>
                                <Link
                                    href={p.link}
                                    target="_blank"
                                    aria-label={`${p.title} — ${p.tags.join(', ')} — Ver en GitHub`}
                                    className="group grid grid-cols-[50px_1fr] md:grid-cols-[60px_1fr_auto] gap-6 md:gap-8 items-center py-8 border-b border-line last:border-b-0 relative transition-all duration-300 hover:pl-4"
                                >
                                    <span className="font-mono text-[13px] text-ink-dim tracking-widest transition-colors duration-200 group-hover:text-acid">{p.num}</span>
                                    <div>
                                        <h3 className="text-[clamp(24px,3vw,44px)] font-bold tracking-[-0.03em] leading-none text-ink transition-colors duration-200 group-hover:text-acid mb-2.5">
                                            {p.title}
                                        </h3>
                                        <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest">
                                            {p.tags.join(" · ")}
                                        </div>
                                        <div className="h-1 bg-line mt-5 w-full relative overflow-hidden">
                                            <div className={`absolute top-0 bottom-0 left-0 w-2/3 ${p.color} transition-all duration-500 group-hover:w-full`}></div>
                                            <div className="absolute top-[-1px] left-1/3 w-[1px] h-[6px] bg-line-2"></div>
                                            <div className="absolute top-[-1px] left-2/3 w-[1px] h-[6px] bg-line-2"></div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-right font-mono text-[11px] text-ink-dim uppercase tracking-widest">
                                        {p.statLabel}
                                        <strong className="block text-acid text-[28px] font-bold tracking-[-0.02em] normal-case mt-1">{p.stat}</strong>
                                    </div>
                                    <div className="absolute right-0 opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowRight className="text-acid w-8 h-8"/>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>

                    <div className="pt-12 border-t border-line mt-12">
                        <div className="font-mono text-[11px] text-ink-dim uppercase tracking-widest flex gap-3 items-center mb-8">
                            <span className="text-acid">DISEÑO</span><span>/</span><span>PROYECTOS VISUALES</span>
                        </div>
                        {designProjects.map((p, i) => (
                            <Reveal key={i} variant="left" delay={((i % 3) + 1) as 1 | 2 | 3}>
                                <Link
                                    href={p.link}
                                    aria-label={`${p.title} — ${p.tags.join(', ')}`}
                                    className="group grid grid-cols-[50px_1fr] md:grid-cols-[60px_1fr_auto] gap-6 md:gap-8 items-center py-8 border-b border-line last:border-b-0 relative transition-all duration-300 hover:pl-4"
                                >
                                    <span className="font-mono text-[13px] text-ink-dim tracking-widest transition-colors duration-200 group-hover:text-acid">{p.num}</span>
                                    <div>
                                        <h3 className="text-[clamp(24px,3vw,44px)] font-bold tracking-[-0.03em] leading-none text-ink transition-colors duration-200 group-hover:text-acid mb-2.5">
                                            {p.title}
                                        </h3>
                                        <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest">
                                            {p.tags.join(" · ")}
                                        </div>
                                        <div className="h-1 bg-line mt-5 w-full relative overflow-hidden">
                                            <div className={`absolute top-0 bottom-0 left-0 w-2/3 ${p.color} transition-all duration-500 group-hover:w-full`}></div>
                                            <div className="absolute top-[-1px] left-1/3 w-[1px] h-[6px] bg-line-2"></div>
                                            <div className="absolute top-[-1px] left-2/3 w-[1px] h-[6px] bg-line-2"></div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block text-right font-mono text-[11px] text-ink-dim uppercase tracking-widest">
                                        {p.statLabel}
                                        <strong className="block text-acid text-[28px] font-bold tracking-[-0.02em] normal-case mt-1">{p.stat}</strong>
                                    </div>
                                    <div className="absolute right-0 opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowRight className="text-acid w-8 h-8"/>
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    )
}
