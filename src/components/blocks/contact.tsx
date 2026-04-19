import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export const Contact = () => {
    return (
        <>
        <section id="contact" className="shell py-24 mb-10 border-t border-line">
             <Reveal as="div" className="flex items-end justify-between gap-10 mb-14">
                <div>
                    <div className="font-mono text-[11px] text-ink-dim uppercase tracking-widest flex gap-3 items-center mb-3.5">
                        <span className="text-acid">07</span><span>/</span><span>APLICACIÓN · CONTACTO</span>
                    </div>
                    <h2 className="text-[clamp(48px,7.5vw,120px)] font-bold leading-[0.9] tracking-[-0.04em] text-wrap-balance text-ink">
                        Inicia el<br/><span className="text-shine">proceso.</span>
                    </h2>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Reveal variant="left" delay={1} className="border border-line bg-bg-2 p-8 md:p-10 flex flex-col justify-between hover-lift group relative overflow-hidden">
                    <div className="scanline-layer"></div>
                    <div>
                        <h4 className="font-mono text-[11px] text-ink-dim tracking-[0.12em] uppercase mb-6">OPCIÓN_A // DIRECTO</h4>
                        <div className="text-[clamp(24px,2.6vw,38px)] font-bold tracking-[-0.025em] leading-[1.05] text-ink mb-6">
                            Contacto vía correo o WhatsApp para consultas inmediatas.
                        </div>
                        <p className="text-[13px] text-ink-dim leading-[1.6] mb-8">
                            Si tienes un requerimiento urgente o prefieres comunicación tradicional, escríbeme. Respondo en menos de 24 horas laborables.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <a
                            href="mailto:nicolasmonroypabon@gmail.com"
                            className="group/item flex items-center justify-between p-5 border border-line bg-bg hover:border-acid hover:bg-bg-3 transition-all duration-300"
                        >
                            <span className="font-mono text-[12px] text-ink-dim group-hover/item:text-acid transition-colors">nicolasmonroypabon@gmail.com</span>
                            <ArrowRight className="text-line-2 group-hover/item:text-acid group-hover/item:translate-x-1 transition-all duration-300 w-4 h-4"/>
                        </a>
                        <a
                            href="https://wa.me/573150135016"
                            target="_blank"
                            className="group/item flex items-center justify-between p-5 border border-line bg-bg hover:border-acid hover:bg-bg-3 transition-all duration-300"
                        >
                            <span className="font-mono text-[12px] text-ink-dim group-hover/item:text-acid transition-colors">+57 315 0135016</span>
                            <ArrowRight className="text-line-2 group-hover/item:text-acid group-hover/item:translate-x-1 transition-all duration-300 w-4 h-4"/>
                        </a>
                    </div>
                </Reveal>

                <Reveal variant="right" delay={2} className="border border-line bg-acid text-bg p-8 md:p-10 flex flex-col justify-between hover-lift acid-glow relative overflow-hidden">
                    <div>
                        <h4 className="font-mono text-[11px] text-bg/60 tracking-[0.12em] uppercase mb-6">OPCIÓN_B // TECHNICAL CALL</h4>
                        <div className="text-[clamp(24px,2.6vw,38px)] font-bold tracking-[-0.025em] leading-[1.05] mb-6">
                            Agendemos una llamada de arquitectura de 15 minutos.
                        </div>
                        <ul className="text-[14px] font-medium space-y-4 pt-4 border-t border-bg/20">
                            <li className="flex gap-4 transition-transform duration-300 hover:translate-x-1"><span className="font-mono text-bg/60">01</span><span>Discutimos viabilidad técnica</span></li>
                            <li className="flex gap-4 transition-transform duration-300 hover:translate-x-1"><span className="font-mono text-bg/60">02</span><span>Estrategia de integración IA</span></li>
                            <li className="flex gap-4 transition-transform duration-300 hover:translate-x-1"><span className="font-mono text-bg/60">03</span><span>Mapeo de requerimientos claros</span></li>
                        </ul>
                    </div>

                    <a
                        href="https://calendly.com/nicolasmonroypabon/15min"
                        target="_blank"
                        className="group/cta mt-12 flex items-center justify-between p-5 bg-bg text-ink hover:text-acid transition-colors relative overflow-hidden"
                    >
                        <span className="font-mono text-[12px] uppercase relative z-10">Agendar en Calendly</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover/cta:translate-x-1 transition-transform duration-300"/>
                        <span className="absolute inset-0 bg-gradient-to-r from-bg via-bg-3 to-bg opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300"></span>
                    </a>
                </Reveal>
            </div>
        </section>

        <footer className="shell pb-12 pt-10">
            <Reveal as="div" variant="up" className="text-[clamp(60px,12vw,220px)] font-bold tracking-[-0.055em] leading-[0.82] py-16 md:py-24 text-ink">
                NCLS<span className="text-acid acid-pulse inline-block">.</span>DEV
            </Reveal>

            <div className="flex flex-col md:flex-row justify-between gap-6 py-8 border-t border-line font-mono text-[11px] text-ink-dim uppercase tracking-widest">
                <div>© 2026 NICOLÁS MONROY PABÓN</div>
                <div className="flex gap-8">
                    <a href="https://github.com/NICOLASDRAWN" target="_blank" className="nav-underline hover:text-acid transition-colors">GITHUB</a>
                    <a href="https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/" target="_blank" className="nav-underline hover:text-acid transition-colors">LINKEDIN</a>
                    <Link href="/cv" className="nav-underline hover:text-acid transition-colors">VER C.V.</Link>
                    <Link href="/carta" className="nav-underline hover:text-acid transition-colors">CARTA PRES.</Link>
                </div>
            </div>
        </footer>
        </>
    )
}
