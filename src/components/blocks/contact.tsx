import { Mail, MessageSquare, Link as LinkIcon, GitBranch, ExternalLink } from "lucide-react"

export const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-white dark:bg-zinc-950">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">08 CONTACTO</div>
                        <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tighter text-zinc-900 dark:text-white mb-8">
                            Let's <span className="text-blue-600">Talk</span>
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 leading-relaxed">
                            Disponible para posiciones Full Stack, Frontend Engineer o AI Engineer. Remoto o Bogotá. Respuesta en menos de 24 horas.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            <a href="mailto:nicolasmonroypabon@gmail.com" className="group flex items-center justify-between p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-blue-600 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-blue-600">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</div>
                                        <div className="text-zinc-900 dark:text-white font-medium">nicolasmonroypabon@gmail.com</div>
                                    </div>
                                </div>
                                <ExternalLink size={18} className="text-zinc-300 group-hover:text-blue-600 transition-colors" />
                            </a>
                            
                            <a href="https://wa.me/573150135016" target="_blank" className="group flex items-center justify-between p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-blue-600 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center text-green-500">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">WhatsApp</div>
                                        <div className="text-zinc-900 dark:text-white font-medium">+57 322 2841441</div>
                                    </div>
                                </div>
                                <ExternalLink size={18} className="text-zinc-300 group-hover:text-blue-600 transition-colors" />
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex flex-col justify-end">
                        <div className="p-12 rounded-3xl bg-blue-600 text-white space-y-8">
                            <h3 className="text-3xl font-bold tracking-tight">¿Tienes un proyecto en mente?</h3>
                            <p className="opacity-80">Agendemos una llamada técnica de 15 minutos para discutir cómo la IA puede transformar tu producto.</p>
                            <a href="https://calendly.com/nicolasmonroypabon/15min" target="_blank" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                                Agendar Llamada
                            </a>
                        </div>
                    </div>
                </div>
                
                <footer className="mt-32 pt-16 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-2xl font-bold tracking-tighter">NM<span className="text-blue-600">.</span></div>
                    <div className="text-xs text-zinc-400 font-medium uppercase tracking-widest text-center">
                        © 2026 Nicolás Monroy Pabón — Full Stack Developer & AI Specialist
                    </div>
                    <div className="flex gap-6">
                        <a href="https://github.com/NICOLASDRAWN" target="_blank" className="text-zinc-400 hover:text-blue-600 transition-colors"><GitBranch size={20} /></a>
                        <a href="https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/" target="_blank" className="text-zinc-400 hover:text-blue-600 transition-colors"><LinkIcon size={20} /></a>
                    </div>
                </footer>
            </div>
        </section>
    )
}
