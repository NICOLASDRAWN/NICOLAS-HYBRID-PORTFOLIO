import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Reveal } from "@/components/ui/reveal"

const projects = [
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

export const Projects = () => {
    return (
        <section id="portfolio" className="shell py-24">
            <Reveal as="div" variant="scale" className="border border-line bg-bg-2">
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-bg-3 font-mono text-[11px] text-ink-dim uppercase tracking-widest">
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
                            <span className="block text-ink">Sistemas</span>
                            <span className="block text-shine">en prod.</span>
                        </h2>
                        <div className="font-mono text-[12px] text-ink-dim leading-[1.7] uppercase tracking-widest">
                            [ FOCUS ]
                            <strong className="block text-ink font-medium mt-1 mb-3.5 tracking-normal normal-case text-[13px]">B2B & Enterprise</strong>
                            [ CORE SKILLS ]
                            <strong className="block text-ink font-medium mt-1 tracking-normal normal-case text-[13px]">Full-Stack Monorepos<br/>Desktop/Web/Mobile Native</strong>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-line -mx-8 md:-mx-12">
                        {[
                            { label: "FOCO", value: "B2B & Enterprise", accent: null },
                            { label: "MODALIDAD", value: "Remoto", accent: "GMT-5" },
                            { label: "STACK", value: "Full-Stack", accent: "+ AI" },
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
                        {projects.map((p, i) => (
                            <Reveal key={i} variant="left" delay={(i + 1) as 1 | 2 | 3}>
                                <Link
                                    href={p.link}
                                    target="_blank"
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
