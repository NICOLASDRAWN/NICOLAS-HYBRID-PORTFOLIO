import { Reveal } from "@/components/ui/reveal"

export const Profile = () => {
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
                <aside className="flex-none max-w-[360px] font-mono text-[12px] text-ink-dim leading-[1.65] text-right hidden md:block">
                    Perfil híbrido. Comunicador Social Profesional y Desarrollador Full Stack. <span className="text-acid">Diseño narrativas funcionales con visión estratégica.</span>
                </aside>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" role="list" aria-label="Perfiles de identidad">
                {/* Dual Identity Card */}
                <Reveal variant="up" delay={1} className="group bg-bg-2 border border-line aspect-square flex flex-col justify-between p-6 relative overflow-hidden hover-lift" role="listitem">
                    <div className="scanline-layer" aria-hidden="true"></div>
                    <div className="flex justify-between font-mono text-[9px] text-ink-dim tracking-[0.15em] uppercase">
                        <span>A / COMUNICADOR SOCIAL</span>
                        <span className="text-acid">UNIMINUTO</span>
                    </div>
                    <div className="my-auto">
                        <div className="text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.04em] leading-[1.05] text-ink">
                            Estrategia <span className="text-acid">&</span> Semiótica<span className="text-acid">.</span>
                        </div>
                        <p className="text-[12px] font-mono text-ink-dim mt-2.5 leading-relaxed">
                            Formación profesional en comunicación aplicada a sistemas de información, retórica visual y adopción corporativa sin fricción.
                        </p>
                    </div>
                    <div className="pt-3 border-t border-line font-mono text-[9px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between">
                        <span>PROMOCIÓN 2020</span>
                        <span className="text-acid font-bold">● NARRATIVA B2B</span>
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
                        <div className="text-[clamp(28px,3vw,36px)] font-bold tracking-[-0.04em] leading-[1.05] text-ink">
                            Ingeniería <span className="text-warn">&</span> Resiliencia<span className="text-warn">.</span>
                        </div>
                        <p className="text-[12px] font-mono text-ink-dim mt-2.5 leading-relaxed">
                            Arquitectura de tolerancia a fallos, bases autoreparables (.bak), inferencia privada local y sincronización LAN por WebSockets.
                        </p>
                    </div>
                    <div className="pt-3 border-t border-line font-mono text-[9px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between">
                        <span>FULL-STACK + DESKTOP</span>
                        <span className="text-warn font-bold">&lt;20MS LATENCY</span>
                    </div>
                </Reveal>

                {/* Glyph Avatar */}
                <Reveal variant="up" delay={3} className="group bg-acid border border-line aspect-square relative overflow-hidden flex items-center justify-center hover-lift" role="listitem">
                    <svg viewBox="0 0 200 200" className="w-[55%] h-[55%] transition-transform duration-500 ease-out group-hover:rotate-[8deg] group-hover:scale-105" fill="none" stroke="#0A0A0A" strokeWidth="12" strokeLinecap="square">
                        <rect x="28" y="28" width="144" height="144"/>
                        <path d="M50 150 L50 50 L150 150 L150 50"/>
                        <circle cx="100" cy="100" r="4" fill="#0A0A0A"/>
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 py-3 px-3.5 bg-bg/70 border-t border-line/20 font-mono text-[10px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between backdrop-blur-sm">
                        <span className="text-bg font-medium">C / GLYPH</span><span className="text-bg font-medium">NCLS.MONROY</span>
                    </div>
                </Reveal>

                {/* Terminal Avatar */}
                <Reveal variant="up" delay={4} className="group bg-bg border border-line aspect-square relative overflow-hidden hover-lift" role="listitem">
                    <div className="scanline-layer" aria-hidden="true"></div>
                    <div className="font-mono text-left text-[clamp(11px,1.3vw,14px)] leading-[1.65] text-ink p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="text-ink-dim">~/nicolas $ cat manifesto.txt</div>
                            <div className="text-acid mt-1 font-bold">"Diseño lo que construyo. Construyo lo que diseño."</div>
                            <div className="text-ink-dim text-[11px] mt-2">→ 20+ sistemas activos</div>
                            <div className="text-ink-dim text-[11px]">→ 501 colaboradores en nómina</div>
                            <div className="text-ink-dim text-[11px]">→ 0 discrepancias de liquidación</div>
                        </div>
                        <div className="pt-2 text-[11px] text-acid flex items-center gap-1.5 border-t border-line">
                            <span className="w-1.5 h-1.5 bg-acid rounded-full animate-ping"></span>
                            <span>STATUS: READY_TO_BUILD</span>
                        </div>
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
                        <p className="text-[13px] text-ink-dim mt-4 max-w-[24ch]">
                            Arquitectura unificada, radiografía profesional, radar tecnológico y documentación viva de cada línea de código.
                        </p>
                    </div>
                    <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.12em] uppercase pt-3 border-t border-line">
                        <span>#001 · KNOWLEDGE REPO</span><span className="text-acid font-bold">100% TRAZABILIDAD</span>
                    </div>
                </Reveal>

                {/* Mode / Availability Card */}
                <Reveal variant="scale" delay={2} className="group aspect-square bg-acid text-bg p-8 relative overflow-hidden flex flex-col hover-lift acid-glow">
                    <div className="font-mono text-[10px] text-bg/65 tracking-[0.1em] uppercase">02 / CONTRATACIÓN</div>
                    <div className="absolute top-4.5 right-5 font-mono text-[10px] text-bg/65 tracking-[0.1em] uppercase">● Q3 2026</div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-[clamp(42px,6vw,78px)] font-bold tracking-[-0.04em] leading-[0.9]">
                            <span className="block">Lead Eng</span>
                            <span className="block">Architect</span>
                            <span className="block text-bg/70">Consulting</span>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <a 
                                href="/assets/Nicolas_Monroy_CV.pdf" 
                                download 
                                className="flex-1 bg-bg text-ink font-mono text-[9px] py-3 text-center border border-bg hover:bg-bg-3 transition-colors uppercase tracking-wider font-bold"
                            >
                                DESC. CV (PDF)
                            </a>
                            <a 
                                href="/assets/Carta_de_Presentacion_Nicolas_Monroy.pdf" 
                                download 
                                className="flex-1 bg-bg text-ink font-mono text-[9px] py-3 text-center border border-bg hover:bg-bg-3 transition-colors uppercase tracking-wider font-bold"
                            >
                                CARTA (PDF)
                            </a>
                        </div>
                    </div>
                    <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-bg/55 tracking-[0.12em] uppercase pt-3 border-t border-bg/20">
                        <span>#002 · MODALIDAD</span><span>REMOTO / HÍBRIDO</span>
                    </div>
                </Reveal>

                {/* Quantitative Impact Card */}
                <Reveal variant="up" delay={3} className="group aspect-square bg-bg-3 border border-line p-8 relative overflow-hidden flex flex-col hover-lift">
                    <div className="scanline-layer" aria-hidden="true"></div>
                    <div className="font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase">03 / AUDITORÍA REAL</div>
                    <div className="absolute top-4.5 right-5 font-mono text-[10px] text-warn tracking-[0.1em] uppercase">● 0 DISCREPANCIAS</div>
                    <div className="flex-1 flex flex-col justify-center">
                         <div className="text-[clamp(44px,5.5vw,72px)] font-bold tracking-[-0.05em] leading-[0.88] text-ink">
                            501<span className="text-warn">p</span><br/><span className="text-[clamp(22px,3vw,34px)] tracking-tight text-ink-dim">Auditados</span>
                        </div>
                        <div className="font-mono text-[11px] text-ink-dim mt-4 tracking-[0.05em] leading-relaxed">
                            Cierre de bonos de nómina agosto 2026. Modelo matemático paramétrico con 75 casos penalizados resueltos sin margen de error.
                        </div>
                    </div>
                    <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.12em] uppercase pt-3 border-t border-line">
                        <span>#003 · COMPLIANCE MIP</span><span className="text-warn font-bold">100% EXACTO</span>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
