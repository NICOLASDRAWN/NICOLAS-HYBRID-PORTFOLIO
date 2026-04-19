import { Code, Database, Cpu, Paintbrush } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"

const skillCategories = [
  {
    title: "Frontend",
    icon: <Code className="text-bg w-6 h-6" />,
    skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "GSAP / Framer Motion"]
  },
  {
    title: "Backend",
    icon: <Database className="text-bg w-6 h-6" />,
    skills: ["Node.js / Express", "Python / Flask", "SQLite / PostgreSQL", "REST APIs / JWT"]
  },
  {
    title: "IA & Tools",
    icon: <Cpu className="text-bg w-6 h-6" />,
    skills: ["Gemini / Claude / OpenAI", "Prompt Engineering", "Electron (Desktop)", "Git / Docker"]
  },
  {
    title: "Diseño & Arte",
    icon: <Paintbrush className="text-bg w-6 h-6" />,
    skills: ["Affinity Suite", "Figma / UI-UX", "Photoshop", "Generative Art"]
  }
]

export const Skills = () => {
    return (
        <section id="stack" className="shell py-24 border-t border-line">
            <Reveal as="div" className="flex items-end justify-between gap-10 mb-14">
                <div>
                    <div className="font-mono text-[11px] text-ink-dim uppercase tracking-widest flex gap-3 items-center mb-3.5">
                        <span className="text-acid">05</span><span>/</span><span>CAPABILITIES · STACK</span>
                    </div>
                    <h2 className="text-[clamp(44px,6.5vw,100px)] font-bold leading-[0.9] tracking-[-0.04em] text-wrap-balance text-ink">
                        Arquitectura<br/><span className="text-shine">y herramientas.</span>
                    </h2>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skillCategories.map((cat, i) => (
                    <Reveal
                      key={i}
                      variant="up"
                      delay={(i + 1) as 1 | 2 | 3 | 4}
                      className="group relative p-8 border border-line bg-bg-2 hover:bg-bg-3 hover:border-acid transition-all duration-300 overflow-hidden flex flex-col hover-lift"
                    >
                        <div className="scanline-layer"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-acid/5 rounded-bl-full translate-x-12 -translate-y-12 group-hover:bg-acid/20 group-hover:scale-150 transition-all duration-500 ease-out"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 mb-8 bg-acid flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(198,255,61,0.2)] group-hover:shadow-[0_0_30px_rgba(198,255,61,0.45)]">
                                {cat.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-6 flex flex-col gap-2 text-ink">
                                <span className="text-ink-dim font-mono text-[10px] tracking-widest uppercase">0{i+1} // DOMAIN</span>
                                {cat.title}
                            </h3>
                            <ul className="space-y-3 font-mono text-[12px] text-ink-dim">
                                {cat.skills.map((skill, j) => (
                                    <li
                                      key={j}
                                      className="flex items-center gap-3 group/item transition-transform duration-200 hover:translate-x-1"
                                      style={{ transitionDelay: `${j * 40}ms` }}
                                    >
                                        <div className="w-1.5 h-1.5 bg-line-2 group-hover/item:bg-acid group-hover/item:shadow-[0_0_8px_var(--color-acid)] transition-all duration-200"></div>
                                        <span className="group-hover/item:text-ink transition-colors duration-200">{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal
              as="div"
              delay={2}
              className="mt-20 pt-8 border-t border-line flex flex-wrap justify-center md:justify-between items-center gap-12 font-mono text-[11px] text-ink-dim uppercase tracking-widest opacity-80"
            >
                {["React Ecosystem", "Node Architecture", "Python Automation", "AI Integration", "UX Engineering"].map((tag, i) => (
                    <span
                      key={i}
                      className="nav-underline hover:text-acid hover:opacity-100 transition-colors duration-300 cursor-default"
                    >
                      {tag}
                    </span>
                ))}
            </Reveal>
        </section>
    )
}
