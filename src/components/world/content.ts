export const CONTACT = {
  email: "nicolasmonroypabon@gmail.com",
  whatsapp:
    "https://wa.me/573150135016?text=" +
    encodeURIComponent("Hola Nicolás, vi tu portafolio y me gustaría conversar sobre un proyecto."),
  calendly: "https://calendly.com/nicolasmonroypabon/15min",
  github: "https://github.com/NICOLASDRAWN",
  linkedin: "https://www.linkedin.com/in/nicolas-monroy-pabon-a8a838176/",
};

/** Orden = orden de las estaciones 3D que recorre la cámara. */
export const STATIONS = [
  { id: "inicio", label: "Inicio" },
  { id: "perfil", label: "Perfil" },
  { id: "stack", label: "Stack" },
  { id: "experiencia", label: "Experiencia" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
] as const;

export const PILLARS = [
  { n: "01", title: "Diseño e identidad", text: "Branding, interfaces y sistemas visuales que conectan una marca con sus usuarios." },
  { n: "02", title: "Desarrollo y automatización", text: "Aplicaciones web y de escritorio, gestión documental e integración de procesos." },
  { n: "03", title: "Documentación y aprendizaje", text: "Registro decisiones, reviso resultados y documento aprendizajes para mantener y mejorar cada proyecto." },
];

export const STACK = [
  { title: "Frontend & UI/UX", items: ["React 19", "Next.js 16", "TypeScript estricto", "Tailwind CSS v4", "Framer Motion · GSAP", "Three.js"] },
  { title: "Backend & servidores", items: ["Node · Express 5", "Python (Flask, PyMuPDF)", "REST APIs y rate limiting", "Respaldos autoreparables"] },
  { title: "IA aplicada & agentes", items: ["Modelos locales con Ollama", "Gemini multimodal", "Claude API", "Playwright headless"] },
  { title: "Datos & automatización", items: ["PostgreSQL + Drizzle", "SQLite", "Excel paramétrico", "Validación de resultados"] },
  { title: "Desktop & diseño", items: ["Electron", "Servicios Windows", "Figma", "Illustrator · Photoshop · InDesign"] },
];

export const EXPERIENCE = [
  {
    title: "Software empresarial y automatización",
    text: "Herramientas internas para gestión de proveedores, compras, evaluaciones, comunicación y documentos. La experiencia se presenta anonimizada: el código y los datos empresariales permanecen privados.",
  },
  {
    title: "Diseño y comunicación digital",
    text: "Identidad visual, piezas de comunicación, producción multimedia y experiencias web. Integro narrativa, interacción y criterios de uso desde la concepción hasta la implementación.",
  },
];

export type Project = {
  title: string;
  kind: string;
  text: string;
  tech: string[];
  href?: string;
  public?: boolean;
};

const CASE_URL =
  "https://github.com/NICOLASDRAWN/NICOLASDRAWN/blob/main/docs/case-studies/automatizacion-empresarial.md";

export const PROJECTS: Project[] = [
  { title: "AURA — The City's Soundtrack", kind: "Proyecto público", text: "Landing page de un concepto de descubrimiento musical urbano.", tech: ["JavaScript", "Vite", "GSAP", "Three.js"], href: "https://github.com/NICOLASDRAWN/Aura-web", public: true },
  { title: "Brand OS", kind: "Proyecto público", text: "Este portafolio: un mundo 3D en tiempo real que la cámara recorre con el scroll.", tech: ["Next.js", "React Three Fiber", "TypeScript"], href: "https://github.com/NICOLASDRAWN/NICOLAS-HYBRID-PORTFOLIO", public: true },
  { title: "ConquistaLaCiudad", kind: "Laboratorio Android", text: "Base de práctica con una pantalla inicial de Jetpack Compose.", tech: ["Kotlin", "Jetpack Compose", "Material 3"], href: "https://github.com/NICOLASDRAWN/ConquistaLaCiudad", public: true },
  { title: "Proveedores y documentación", kind: "Caso anonimizado", text: "Organización de registros, directorios e integración de análisis documental.", tech: ["React", "Express", "Electron", "Python"], href: CASE_URL },
  { title: "Compras y suministros", kind: "Caso anonimizado", text: "Herramientas de consulta y organización de registros comerciales.", tech: ["Aplicaciones web", "Persistencia", "Respaldos"] },
  { title: "Evaluaciones", kind: "Caso anonimizado", text: "Modelado de procesos de evaluación y revisión de cálculos.", tech: ["SQLite", "Excel", "Automatización"] },
  { title: "Comunicación corporativa", kind: "Caso anonimizado", text: "Preparación de comunicados y generación de documentos PDF con plantillas.", tech: ["Python", "Flask", "HTML", "PDF"] },
  { title: "Sincronización de archivos", kind: "Caso anonimizado", text: "Seguimiento de archivos, historial y respaldo en servicios de almacenamiento.", tech: ["Python", "SQLite", "APIs"] },
];
