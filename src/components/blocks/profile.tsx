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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Typographic avatar */}
                <Reveal variant="up" delay={1} className="group bg-bg border border-line aspect-square flex items-center justify-center relative overflow-hidden hover-lift">
                    <div className="scanline-layer"></div>
                    <div className="flex flex-col items-center gap-1 relative z-10">
                        <div className="text-[clamp(80px,11vw,130px)] font-bold tracking-[-0.07em] leading-[0.85] text-ink">
                            nd<span className="text-acid acid-pulse inline-block">●</span>
                        </div>
                        <div className="font-mono text-[10px] text-ink-dim tracking-[0.2em] uppercase">@NICOLASDEV</div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 py-3 px-3.5 bg-bg/85 border-t border-line font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase flex justify-between backdrop-blur-sm">
                        <span>A / TYPOGRAPHIC</span><span className="text-acid">● HYBRID</span>
                    </div>
                </Reveal>

                {/* Duotone Placeholder */}
                <Reveal variant="up" delay={2} className="group bg-gradient-to-br from-bg to-bg-3 border border-line aspect-square relative overflow-hidden hover-lift">
                    <div className="scanline-layer"></div>
                    <div className="absolute inset-0 opacity-85">
                         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-acid/10 backdrop-blur-md transition-all duration-500 group-hover:h-3/5 group-hover:bg-acid/15"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-acid/20 transition-all duration-700 group-hover:w-40 group-hover:h-40 group-hover:border-acid/40"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-acid/40 float-y"></div>
                    </div>
                    <div className="absolute top-3.5 right-3.5 font-mono text-[9px] text-acid tracking-[0.15em] uppercase">[ PHOTO ]</div>
                    <div className="absolute top-3.5 left-3.5 font-mono text-[9px] text-ink-dim tracking-[0.15em] uppercase">DUOTONE · 01</div>
                    <div className="absolute bottom-0 left-0 right-0 py-3 px-3.5 bg-bg/85 border-t border-line font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase flex justify-between backdrop-blur-sm">
                        <span>B / CREATIVE</span><span>SOCIAL</span>
                    </div>
                </Reveal>

                {/* Glyph Avatar */}
                <Reveal variant="up" delay={3} className="group bg-acid border border-line aspect-square relative overflow-hidden flex items-center justify-center hover-lift">
                    <svg viewBox="0 0 200 200" className="w-[55%] h-[55%] transition-transform duration-500 ease-out group-hover:rotate-[8deg] group-hover:scale-105" fill="none" stroke="#0A0A0A" strokeWidth="12" strokeLinecap="square">
                        <rect x="28" y="28" width="144" height="144"/>
                        <path d="M50 150 L50 50 L150 150 L150 50"/>
                        <circle cx="100" cy="100" r="4" fill="#0A0A0A"/>
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 py-3 px-3.5 bg-bg/70 border-t border-line/20 font-mono text-[10px] text-ink-dimmer tracking-[0.1em] uppercase flex justify-between backdrop-blur-sm">
                        <span className="text-bg font-medium">C / GLYPH</span><span className="text-bg font-medium">MONOGRAM</span>
                    </div>
                </Reveal>

                {/* Terminal Avatar */}
                <Reveal variant="up" delay={4} className="group bg-bg border border-line aspect-square relative overflow-hidden hover-lift">
                    <div className="scanline-layer"></div>
                    <div className="font-mono text-left text-[clamp(12px,1.5vw,16px)] leading-[1.7] text-ink p-7">
                        <div className="text-ink-dim">~/nicolas $</div>
                        <div>whoami</div>
                        <div className="text-acid">→ designer+engineer</div>
                        <div>_<span className="inline-block w-[0.5em] h-[1em] bg-acid align-[-0.15em] animate-pulse"></span></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 py-3 px-3.5 bg-bg/85 border-t border-line font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase flex justify-between backdrop-blur-sm">
                        <span>D / TERMINAL</span><span>DEV</span>
                    </div>
                </Reveal>
            </div>

            {/* Posts / Feed section directly below as "Latest Pulse" */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Reveal variant="up" delay={1} className="group aspect-square bg-bg-2 border border-line p-8 relative overflow-hidden flex flex-col hover-lift">
                    <div className="scanline-layer"></div>
                    <div className="font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase">01 / LATEST PULSE</div>
                    <div className="absolute top-4.5 right-5 font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase">HOY</div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-[clamp(28px,3.8vw,44px)] font-bold tracking-[-0.03em] leading-[0.95] text-ink">
                            Reportes Globales Mensuales<span className="text-acid">.</span>
                        </div>
                        <p className="text-[13px] text-ink-dim mt-4 max-w-[20ch]">Visualización inteligente de órdenes aprobadas vs pendientes.</p>
                    </div>
                    <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.12em] uppercase pt-3 border-t border-line">
                        <span>#001 · ERP ARCHITECTURE</span><span className="text-acid acid-pulse">● LIVE</span>
                    </div>
                </Reveal>

                <Reveal variant="scale" delay={2} className="group aspect-square bg-acid text-bg p-8 relative overflow-hidden flex flex-col hover-lift acid-glow">
                    <div className="font-mono text-[10px] text-bg/65 tracking-[0.1em] uppercase">02 / MODO</div>
                    <div className="absolute top-4.5 right-5 font-mono text-[10px] text-bg/65 tracking-[0.1em] uppercase">● HIRING</div>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-[clamp(48px,7vw,90px)] font-bold tracking-[-0.04em] leading-[0.9]">
                            <span className="block transition-transform duration-300 group-hover:translate-x-1">Full-Time</span>
                            <span className="block transition-transform duration-300 delay-75 group-hover:translate-x-1">Contract</span>
                            <span className="block transition-transform duration-300 delay-150 group-hover:translate-x-1">Freelance</span>
                        </div>
                        <div className="text-[13px] font-medium tracking-[0.02em] mt-4 max-w-[22ch]">
                            Tres modalidades abiertas · Remoto GMT-5 · ES/EN B2.
                        </div>
                    </div>
                    <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-bg/55 tracking-[0.12em] uppercase pt-3 border-t border-bg/20">
                        <span>#002 · DISPONIBILIDAD</span><span>&lt; 24H</span>
                    </div>
                </Reveal>

                <Reveal variant="up" delay={3} className="group aspect-square bg-bg p-8 relative overflow-hidden flex flex-col hover-lift">
                    <div className="scanline-layer"></div>
                    <div className="font-mono text-[10px] text-ink-dim tracking-[0.1em] uppercase">03 / LISTENING</div>
                    <div className="absolute top-4.5 right-5 font-mono text-[10px] text-acid tracking-[0.1em] uppercase acid-pulse">● NOW PLAYING</div>
                    <div className="flex-1 flex flex-col justify-center">
                         <div className="text-[clamp(46px,6vw,76px)] font-bold tracking-[-0.05em] leading-[0.88] text-ink">
                            The<br/><span className="text-acid">Weeknd</span>
                        </div>
                        <div className="font-mono text-[11px] text-ink-dim mt-4.5 tracking-[0.08em]">
                            └ BLINDING LIGHTS<br/>
                            &nbsp;&nbsp;SYNTHWAVE ESSENTIALS
                        </div>
                    </div>
                    <div className="absolute bottom-3.5 left-8 right-8 flex justify-between font-mono text-[9px] text-ink-dimmer tracking-[0.12em] uppercase pt-3 border-t border-line">
                        <span>#003 · VIBES</span><span>11:08</span>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
