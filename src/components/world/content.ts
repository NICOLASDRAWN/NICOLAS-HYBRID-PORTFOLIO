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
  { id: "servicios", label: "Servicios" },
  { id: "perfil", label: "Perfil" },
  { id: "proyectos", label: "Proyectos" },
  { id: "huila", label: "Huila" },
  { id: "contacto", label: "Contacto" },
] as const;

export const waLink = (msg: string) => "https://wa.me/573150135016?text=" + encodeURIComponent(msg);

export type Service = {
  slug: string;
  name: string;
  kanji: string;
  short: string;
  intro: string;
  includes: string[];
  ideal: string;
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "edicion-de-video",
    name: "Edición de video",
    kanji: "映像",
    short: "Reels, videos institucionales y contenido con ritmo, subtítulos y color.",
    intro: "Edito videos para redes, marcas y eventos: corto el material, armo la narrativa, ajusto color y sonido y entrego en los formatos de cada plataforma.",
    includes: ["Reels, TikTok y Shorts en formato vertical", "Videos institucionales y de producto", "Subtítulos y textos animados", "Corrección de color y limpieza de audio", "Motion graphics sencillos para tu marca"],
    ideal: "Negocios, emprendimientos, creadores y eventos que necesitan contenido constante para redes.",
    faq: [
      { q: "¿Cómo te envío el material?", a: "Por Google Drive, WeTransfer o el medio que prefieras. Trabajo de forma remota con clientes de todo el Huila." },
      { q: "¿En qué formatos entregas?", a: "En el formato de cada red: vertical 9:16 para Reels y TikTok, horizontal 16:9 para YouTube y cuadrado cuando hace falta." },
    ],
  },
  {
    slug: "diseno-grafico",
    name: "Diseño gráfico e identidad",
    kanji: "意匠",
    short: "Logos, identidad visual, piezas para redes y material impreso.",
    intro: "Diseño identidades y piezas que hacen que una marca se reconozca y se entienda: desde el logo hasta las plantillas que usas todos los días.",
    includes: ["Logo e identidad visual", "Manual de marca básico", "Piezas y plantillas para redes sociales", "Papelería, menús, volantes y pendones", "Presentaciones corporativas"],
    ideal: "Marcas nuevas, negocios que quieren renovar su imagen y equipos que necesitan piezas consistentes.",
    faq: [
      { q: "¿Recibo los archivos editables?", a: "Sí. Entrego los archivos finales y los editables (Illustrator, PDF, PNG y SVG) para que puedas usar tu marca sin depender de nadie." },
      { q: "¿Cuántas propuestas incluye un logo?", a: "Lo definimos al cotizar según el alcance; siempre hay rondas de ajustes hasta llegar a la versión final." },
    ],
  },
  {
    slug: "desarrollo-web",
    name: "Desarrollo web",
    kanji: "網",
    short: "Páginas web rápidas, modernas y listas para aparecer en Google.",
    intro: "Construyo sitios web a la medida: landing pages, páginas corporativas, catálogos y portafolios, optimizados para celular y para buscadores.",
    includes: ["Landing pages y sitios corporativos", "Diseño adaptado a celular", "SEO técnico y local (Google)", "Dominio, hosting y correo configurados", "Botón de WhatsApp y formularios de contacto"],
    ideal: "Negocios del Huila que quieren que los encuentren en Google y recibir clientes por WhatsApp.",
    faq: [
      { q: "¿Mi página aparecerá en Google?", a: "La entrego con SEO técnico, datos estructurados y sitemap. El posicionamiento depende también de la competencia y del contenido, y te explico cómo mejorarlo." },
      { q: "¿Puedo actualizar la página yo mismo?", a: "Sí, si lo necesitas te dejo una forma sencilla de editar textos e imágenes." },
    ],
  },
  {
    slug: "programacion-y-automatizacion",
    name: "Programación y automatización",
    kanji: "算",
    short: "Aplicaciones a medida, automatización de procesos e IA aplicada.",
    intro: "Desarrollo herramientas que ahorran horas de trabajo: aplicaciones web y de escritorio, automatización de Excel y documentos, e integraciones con inteligencia artificial.",
    includes: ["Aplicaciones web y de escritorio a medida", "Automatización de Excel, PDF y reportes", "Gestión documental y bases de datos", "Integraciones con APIs e IA (Gemini, Claude, modelos locales)", "Bots y asistentes para WhatsApp"],
    ideal: "Empresas y equipos con tareas repetitivas, procesos en hojas de cálculo o información dispersa.",
    faq: [
      { q: "¿Qué tipo de procesos se pueden automatizar?", a: "Cálculos en Excel, generación de documentos y PDF, consolidación de reportes, organización de archivos y comunicación con clientes, entre otros." },
      { q: "¿Mis datos están seguros?", a: "Sí. Puedo trabajar con modelos de IA locales para que la información sensible no salga de tu equipo." },
    ],
  },
  {
    slug: "contenido-para-redes",
    name: "Contenido para redes sociales",
    kanji: "発信",
    short: "Estrategia, diseño y edición para que tu marca publique con constancia.",
    intro: "Uno diseño y edición en un solo flujo: planeo el contenido del mes, diseño las piezas, edito los videos y te entrego todo listo para publicar.",
    includes: ["Calendario de contenido mensual", "Diseño de posts, carruseles e historias", "Edición de reels", "Textos y llamados a la acción", "Línea gráfica coherente con tu marca"],
    ideal: "Negocios que quieren estar activos en Instagram, Facebook y TikTok sin dedicarle horas.",
    faq: [
      { q: "¿Tú publicas en mis redes?", a: "Te entrego el contenido listo y programado si me das acceso; también puedo dejarlo para que tú lo publiques." },
      { q: "¿Es un servicio mensual?", a: "Puede ser mensual o por paquete de piezas; lo ajustamos a lo que necesites." },
    ],
  },
];

export type Region = { slug: string; city: string; region: string; blurb: string; municipios: string[] };

/** Las 4 subregiones del Huila (37 municipios en total). */
export const REGIONS: Region[] = [
  { slug: "neiva", city: "Neiva", region: "Norte del Huila", blurb: "La capital del departamento y su área de influencia: comercio, servicios, turismo hacia el Desierto de la Tatacoa y empresas que necesitan presencia digital.", municipios: ["Neiva", "Aipe", "Algeciras", "Baraya", "Campoalegre", "Colombia", "Hobo", "Íquira", "Palermo", "Rivera", "Santa María", "Tello", "Teruel", "Villavieja", "Yaguará"] },
  { slug: "pitalito", city: "Pitalito", region: "Sur del Huila", blurb: "El eje del sur: café especial, turismo arqueológico en San Agustín e Isnos y un comercio que crece y necesita vender en línea.", municipios: ["Pitalito", "Acevedo", "Elías", "Isnos", "Oporapa", "Palestina", "Saladoblanco", "San Agustín", "Timaná"] },
  { slug: "garzon", city: "Garzón", region: "Centro del Huila", blurb: "El centro del departamento: agroindustria, caficultura, turismo alrededor del embalse y negocios que quieren comunicar mejor lo que producen.", municipios: ["Garzón", "Agrado", "Altamira", "Gigante", "Guadalupe", "Pital", "Suaza", "Tarqui"] },
  { slug: "la-plata", city: "La Plata", region: "Occidente del Huila", blurb: "El occidente: café, turismo de naturaleza y comunidades que se conectan con el resto del país a través de lo digital.", municipios: ["La Plata", "La Argentina", "Nátaga", "Paicol", "Tesalia"] },
];

export const ALL_MUNICIPIOS = REGIONS.flatMap((r) => r.municipios);

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
