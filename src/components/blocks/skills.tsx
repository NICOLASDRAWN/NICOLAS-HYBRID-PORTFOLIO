import { Code, Database, Cpu, Paintbrush } from "lucide-react"

const skillCategories = [
  {
    title: "Frontend",
    icon: <Code className="text-blue-600" />,
    skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "GSAP / Framer Motion"]
  },
  {
    title: "Backend",
    icon: <Database className="text-blue-600" />,
    skills: ["Node.js / Express", "Python / Flask", "SQLite / PostgreSQL", "REST APIs / JWT"]
  },
  {
    title: "IA & Tools",
    icon: <Cpu className="text-blue-600" />,
    skills: ["Gemini / Claude / OpenAI", "Prompt Engineering", "Electron (Desktop)", "Git / Docker"]
  },
  {
    title: "Diseño & Arte",
    icon: <Paintbrush className="text-blue-600" />,
    skills: ["Affinity Suite", "Figma / UI-UX", "Photoshop", "Generative Art"]
  }
]

export const Skills = () => {
    return (
        <section id="stack" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div>
                        <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-widest">03 STACK TECNOLÓGICO</div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter text-zinc-900 dark:text-white">
                            Tech <span className="text-blue-600">&</span> Skills
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skillCategories.map((cat, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-blue-600 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="text-zinc-300 dark:text-zinc-700 font-mono text-sm">0{i+1}</span> {cat.title}
                            </h3>
                            <ul className="space-y-2">
                                {cat.skills.map((skill, j) => (
                                    <li key={j} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600/30"></div>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="https://html.tailus.io/blocks/customers/nvidia.svg" className="h-6 dark:invert" alt="Nvidia" />
                    <img src="https://html.tailus.io/blocks/customers/github.svg" className="h-5 dark:invert" alt="Github" />
                    <img src="https://html.tailus.io/blocks/customers/openai.svg" className="h-6 dark:invert" alt="OpenAI" />
                    <img src="https://html.tailus.io/blocks/customers/tailwindcss.svg" className="h-5 dark:invert" alt="Tailwind" />
                    <img src="https://html.tailus.io/blocks/customers/vercel.svg" className="h-6 dark:invert" alt="Vercel" />
                </div>
            </div>
        </section>
    )
}
