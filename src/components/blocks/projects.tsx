import { ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"

const projects = [
    {
        title: "Conquista la Ciudad",
        category: "EN DESARROLLO — MOBILE NATIVE",
        problem: "Las apps de running tradicionales son solitarias y pierden engagement.",
        solution: "App Android nativa que convierte la ciudad en un mapa de territorios conquistables por km recorridos.",
        tech: ["Kotlin", "Jetpack Compose", "Google Maps SDK"],
        link: "https://github.com/NICOLASDRAWN/ConquistaLaCiudad",
        color: "text-red-500"
    },
    {
        title: "ProveedHub Platform",
        category: "VENDOR MANAGEMENT + AI · EN PRODUCCIÓN",
        problem: "Validar manualmente documentos de proveedores tomaba horas.",
        solution: "Plataforma con IA Gemini que extrae, valida y clasifica documentos automáticamente.",
        tech: ["React", "Express", "Gemini API", "Electron"],
        link: "#",
        color: "text-blue-500"
    },
    {
        title: "ERP Supply Chain",
        category: "ENTERPRISE ERP · EN PRODUCCIÓN",
        problem: "El proceso de compras dependía de Excel y firmas físicas.",
        solution: "ERP full-stack con 15+ módulos y firma digital Certicámara.",
        tech: ["React", "Node.js", "SQLite", "Electron"],
        link: "#",
        color: "text-indigo-500"
    }
]

export const Projects = () => {
    return (
        <section id="projects" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">05 PROYECTOS SELECCIONADOS</div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter text-zinc-900 dark:text-white mb-16">
                    Featured <span className="text-blue-600">Work</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((p, i) => (
                        <div key={i} className="group relative bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                            <div className="p-8 flex-grow">
                                <div className={`text-[10px] font-bold ${p.color} uppercase tracking-widest mb-4`}>
                                    {p.category}
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
                                    {p.title}
                                </h3>
                                <div className="space-y-4 mb-8">
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        <strong className="text-zinc-700 dark:text-zinc-300">Problema:</strong> {p.problem}
                                    </p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        <strong className="text-zinc-700 dark:text-zinc-300">Solución:</strong> {p.solution}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {p.tech.map((t, j) => (
                                        <span key={j} className="text-[10px] font-medium text-zinc-400">#{t}</span>
                                    ))}
                                </div>
                            </div>
                            <Link href={p.link} target={p.link.startsWith('http') ? '_blank' : '_self'} className="p-6 border-t border-zinc-50 dark:border-zinc-900 flex justify-between items-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <span className="text-sm font-bold uppercase tracking-widest">Ver Detalles</span>
                                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
