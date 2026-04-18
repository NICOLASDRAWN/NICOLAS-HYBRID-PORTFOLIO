import { Activity, Star } from "lucide-react"

export const Profile = () => {
    return (
        <section id="profile" className="py-24 bg-white dark:bg-zinc-950">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-full uppercase tracking-widest">
                            <Activity size={14} /> BITÁCORA DE ACTIVIDAD
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter text-zinc-900 dark:text-white">
                            Nicolás Monroy <span className="text-blue-600">Pabón</span>
                        </h2>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-body">
                            Comunicador Social Profesional y Full Stack Developer. No solo construyo código; diseño narrativas funcionales con visión estratégica. Esta dualidad me permite orquestar soluciones de IA y ecosistemas digitales avanzados.
                        </p>
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
                            <div>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">5+</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Proyectos en Producción</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">3+</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Años de Experiencia</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">15+</div>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Tecnologías Dominadas</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Star size={80} className="text-blue-600" />
                           </div>
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> LATEST PULSE
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="border-l-2 border-blue-600 pl-4 py-1">
                                    <div className="text-xs font-bold text-zinc-500">HOY · ERP ARCHITECTURE</div>
                                    <div className="text-lg font-bold text-zinc-900 dark:text-white">Reportes Globales Mensuales</div>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Visualización inteligente de órdenes aprobadas vs pendientes.</p>
                                </div>
                                <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 py-1">
                                    <div className="text-xs font-bold text-zinc-500">AYER · SECURITY</div>
                                    <div className="text-base font-bold text-zinc-700 dark:text-zinc-300">Gestión Firma Electrónica Certicamara</div>
                                </div>
                                <div className="pt-4 flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8A8.009 8.009 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-0.764 1.288z"/></svg>
                                    </div>
                                    <div className="text-xs">
                                        <div className="font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">Listening Now</div>
                                        <div className="text-zinc-500">The Weeknd — Blinding Lights</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
