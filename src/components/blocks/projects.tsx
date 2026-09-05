'use client';

import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Layers, Cpu, X, ExternalLink, ShieldCheck, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

interface CaseStudy {
  problem: string;
  architecture: string;
  aiAndTechChallenge: string;
  businessImpact: string;
  hybridAdvantage: string;
}

export interface ProjectItem {
  num: string;
  title: string;
  subtitle: string;
  category: 'fullstack' | 'brand';
  categoryLabel: string;
  description: string;
  tags: string[];
  stat: string;
  statLabel: string;
  color: string;
  link: string;
  badge?: string;
  caseStudy: CaseStudy;
}

const allProjects: ProjectItem[] = [
  {
    num: "01",
    title: "ProcureCore 2.0",
    subtitle: "ERP de Compras & Cadena de Suministro",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Reensamblaje y unificación de 82,355 archivos y 20,000 SKUs con Watchdog Centinela para prevención de sobrecostos y auditoría de compras.",
    tags: ["REACT 19", "EXPRESS 5", "ELECTRON DESKTOP", "SQLITE CENTINELA"],
    stat: "82K+",
    statLabel: "ARCHIVOS ERP",
    color: "bg-acid",
    link: "https://github.com/nicolasmonroy",
    badge: "MIP GROUP",
    caseStudy: {
      problem: "Dispersión masiva de 82,355 archivos y más de 20,000 SKUs de compras en discos locales sin control de versiones, provocando sobrecostos del 12% por compras duplicadas y tiempos de consulta superiores a 40 minutos.",
      architecture: "Frontend en React 19 desacoplado con servidor Express 5 local y empaquetado en Electron Desktop para operación offline ultrarrápida. Base de datos SQLite parametrizada con copias de seguridad incrementales automáticas (.bak).",
      aiAndTechChallenge: "Diseño del Centinela Watchdog: algoritmo en segundo plano que detecta en tiempo real variaciones de precio unitario mayores al 5% frente al histórico y bloquea transacciones sospechosas sin confirmación del director.",
      businessImpact: "82K+ archivos unificados con búsqueda indexada en <150ms. Cero compras duplicadas registradas en 6 meses continuos de operación y auditoría transparente para gerencia general.",
      hybridAdvantage: "Aplicación de semiótica visual aeronáutica: códigos cromáticos estrictos según severidad de alerta, permitiendo que personal de almacén sin conocimientos técnicos opere sin margen de error."
    }
  },
  {
    num: "02",
    title: "BroadCast OS 365",
    subtitle: "Suite Corporativa & Circulares Office 365",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Plataforma editorial y generador de actas legales ADM-F-02 integrada a Microsoft 365. Redujo en un 85% el tiempo de emisión de comunicados a 501 empleados.",
    tags: ["NEXT.JS 16", "REACT 19", "OFFICE 365 API", "TAILWIND V4"],
    stat: "-85%",
    statLabel: "TIEMPO OPERATIVO",
    color: "bg-acid",
    link: "https://github.com/nicolasmonroy",
    badge: "DESK + WEB",
    caseStudy: {
      problem: "La redacción y emisión de comunicados corporativos y actas formales a 501 colaboradores requería compilación manual en Word, envíos dispersos y semanas para consolidar acuses de recibo.",
      architecture: "Arquitectura Next.js 16 con React 19 y Tailwind CSS v4, integrada directamente con la API de Microsoft Graph para autenticación empresarial OAuth2 y entrega verificada vía Outlook 365.",
      aiAndTechChallenge: "Motor de composición tipográfica dinámica con firma electrónica incrustada y hash SHA-256 de validez documental, con telemetría en tiempo real de apertura y confirmación de lectura.",
      businessImpact: "Reducción del 85% en el tiempo administrativo de emisión y 100% de cumplimiento documental en las auditorías de calidad del sistema de gestión.",
      hybridAdvantage: "Redacción de plantillas con retórica corporativa empática pero jurídicamente blindada: incrementó la tasa de lectura voluntaria del personal del 41% al 94%."
    }
  },
  {
    num: "03",
    title: "ProveedHub AI",
    subtitle: "Auditoría de Proveedores & Visión Multimodal",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Homologación y extracción de RUT/certificados con Gemini AI Multimodal Vision, persistencia tolerante a fallos (.bak) y despliegue en red LAN.",
    tags: ["REACT 19", "EXPRESS LAN", "GEMINI 2.5 FLASH", "DATA RESILIENCY"],
    stat: "40+",
    statLabel: "PROVEEDORES SYNC",
    color: "bg-acid",
    link: "https://github.com/nicolasmonroy",
    badge: "LAN COMPLIANCE",
    caseStudy: {
      problem: "El proceso de homologación de proveedores tomaba hasta 7 días hábiles debido a la verificación visual manual de RUT, certificados bancarios, cédulas y antecedentes jurídicos.",
      architecture: "Single Page Application en React 19 con backend Express en red LAN protegida. Microservicio en Python con PyMuPDF para preprocesamiento vectorial y caché local en JSON con rotación de respaldos.",
      aiAndTechChallenge: "Integración de Gemini 2.5 Flash Vision para OCR semántico multimodal: extracción automática de NIT, códigos de actividad económica CIIU y fechas de expiración en <3 segundos con tasa de precisión >98%.",
      businessImpact: "Tiempo de registro y validación documental reducido de 7 días a 8 minutos. Cero errores de transcripción contable en 40+ proveedores activos.",
      hybridAdvantage: "Formularios de carga progresiva con heurísticas de usabilidad de Jakob Nielsen: feedback de estado inmediato, bloqueo de doble clic para evitar re-envíos y mensajes de error con lenguaje humano orientativo."
    }
  },
  {
    num: "04",
    title: "EvalPro Enterprise",
    subtitle: "Desempeño 360° & Nómina Paramétrica",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Algoritmo matemático de liquidación de bonos con 67 cargos y 241 tareas desacopladas. Auditó a 501 colaboradores en agosto 2026 sin una sola discrepancia.",
    tags: ["REACT", "TYPESCRIPT STRICT", "NÓMINA PARAMÉTRICA", "CERO ERRORES"],
    stat: "501",
    statLabel: "COLABORADORES (0 ERR)",
    color: "bg-warn",
    link: "https://github.com/nicolasmonroy",
    badge: "MISSION CRITICAL",
    caseStudy: {
      problem: "La calificación de desempeño y cálculo de bonificaciones de 501 trabajadores se hacía en hojas de cálculo no auditables, provocando reclamos laborales recurrentes y sospechas de arbitrariedad.",
      architecture: "Módulo en TypeScript estricto con un motor matemático determinista desacoplado de la interfaz. Cálculo en memoria con tolerancia cero a errores de punto flotante financiero y exportación directa a formato de dispersión bancaria.",
      aiAndTechChallenge: "Parametrización dinámica de 67 cargos corporativos y 241 tareas operativas con pesos porcentuales diferenciados, con trazabilidad inmutable de cada punto evaluado.",
      businessImpact: "501 colaboradores liquidados y auditados en el cierre mensual con exactamente 0 discrepancias de liquidación y reducción total de reclamos laborales.",
      hybridAdvantage: "Transparencia radical en la comunicación del dato: cada colaborador recibe un reporte visual claro con el desglose exacto de su rendimiento, transformando una fuente de conflicto en motivación."
    }
  },
  {
    num: "05",
    title: "CommandHub Pro",
    subtitle: "Control Móvil de Hardware & Telemetría",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Trackpad táctil inalámbrico y monitor de recursos por WebSockets de ultra baja latencia (<20ms). Control de hardware, periféricos y apagado remoto.",
    tags: ["REACT NATIVE", "EXPO GO", "WEBSOCKETS", "ROBOTJS"],
    stat: "<20ms",
    statLabel: "LATENCIA WEBSOCKET",
    color: "bg-acid",
    link: "https://github.com/nicolasmonroy",
    badge: "ULTRA LOW LATENCY",
    caseStudy: {
      problem: "Dificultad para operar y monitorear servidores locales y terminales de trabajo en sala de máquinas sin depender de pantallas físicas ni periféricos voluminosos.",
      architecture: "App móvil para Android construida con React Native y Expo Go, conectada a un daemon silencioso en Node.js mediante WebSockets binarios en red local cifrada.",
      aiAndTechChallenge: "Optimización de paquetes de datos delta para mantener latencia de respuesta táctil inferior a 20ms en emulación de mouse y teclado virtual con RobotJS, incluso con señales Wi-Fi degradadas.",
      businessImpact: "Control total de estaciones de trabajo y servidores locales desde el teléfono móvil, eliminando la necesidad de monitores dedicados y reduciendo tiempos de intervención física.",
      hybridAdvantage: "Ergonomía táctil de alta precisión: gestos intuitivos multi-toque inspirados en el Magic Trackpad de Apple pero adaptados a interfaces de diagnóstico técnico."
    }
  },
  {
    num: "06",
    title: "NeuroPost Local AI",
    subtitle: "Agente Autónomo con Inferencia Local $0",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Automatización de marketing B2B con modelos LLM ejecutados localmente en Ollama y navegación headless con Playwright. Cero costo de API.",
    tags: ["OLLAMA LLM LOCAL", "PLAYWRIGHT", "NLP AGENT", "PYTHON DAEMON"],
    stat: "$0",
    statLabel: "COSTO DE INFERENCIA",
    color: "bg-ink",
    link: "https://github.com/nicolasmonroy",
    badge: "PRIVATE AI",
    caseStudy: {
      problem: "Dependencia financiera de suscripciones mensuales a plataformas de redacción con IA y riesgo de filtración de datos corporativos confidenciales a modelos alojados en nubes públicas.",
      architecture: "Frontend minimalista en React acoplado a un daemon en Python que comanda instancias locales de Ollama (Llama 3 / Mistral) en GPU local y ejecuta automatizaciones con Playwright.",
      aiAndTechChallenge: "Ingeniería de prompts estructurados con memoria local de marca y filtrado semántico para producir contenidos técnicos de nivel editorial sin alucinaciones.",
      businessImpact: "Más de 100 piezas técnicas y boletines generados al mes con un costo recurrente de $0 y garantía total de soberanía de datos para la empresa.",
      hybridAdvantage: "Infusión de principios de comunicación persuasiva y retórica clásica en las instrucciones de sistema del LLM, asegurando un tono humano y editorial que no delata el uso de IA."
    }
  },
  {
    num: "07",
    title: "DocuDispatch Suite",
    subtitle: "Motor de Actas Legales & Despacho SIG",
    category: "fullstack",
    categoryLabel: "FULL-STACK & IA",
    description: "Generador automatizado de actas ADM-F-02, despacho por correo con trazabilidad de entrega y estricto cumplimiento normativo SIG-SST-F-120.",
    tags: ["NODE.JS 24", "NODEMAILER", "PDFKIT ENGINE", "SIG COMPLIANCE"],
    stat: "100%",
    statLabel: "COMPLIANCE LEGAL",
    color: "bg-warn",
    link: "https://github.com/nicolasmonroy",
    badge: "ISO/SIG CERTIFIED",
    caseStudy: {
      problem: "Riesgo de sanciones laborales por falta de trazabilidad en las actas de entrega de dotaciones y notificaciones del Sistema Integrado de Gestión (SIG-SST).",
      architecture: "Servicio en Node.js 24 con PDFKit para ensamblaje dinámico de documentos vectoriales y despacho asíncrono con colas de correo certificadas vía Nodemailer.",
      aiAndTechChallenge: "Algoritmo de cálculo de layout dinámico para documentos legales que garantiza que las firmas nunca queden descolgadas solas en páginas secundarias.",
      businessImpact: "100% de actas respaldadas digitalmente con fecha, hora y confirmación de recepción, aprobando todas las inspecciones de la ARL y entes de control.",
      hybridAdvantage: "Diseño de formato documental claro que prioriza los derechos y obligaciones del colaborador en un lenguaje directo y comprensible."
    }
  },
  {
    num: "08",
    title: "ExxonMobil / Mobil 1™",
    subtitle: "Trade Mark Coordinator — Campaña Nacional",
    category: "brand",
    categoryLabel: "BRAND & UI/UX",
    description: "Estrategia nacional de marca para Mobil Super Moto 4T ('Siente Tu ADN Motero') y sintéticos de alta gama Mobil 1™. Merchandising, POP y retail.",
    tags: ["BRAND IDENTITY", "TRADE MARKETING", "RETAIL STRATEGY", "EXXONMOBIL"],
    stat: "COL",
    statLabel: "COBERTURA NACIONAL",
    color: "bg-acid",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "DISTRICOL LTDA",
    caseStudy: {
      problem: "Falta de diferenciación emocional frente a competidores en puntos de venta de lubricantes de moto y baja percepción de valor en la línea sintética premium Mobil 1.",
      architecture: "Ecosistema integral de comunicación: campaña 'Siente Tu ADN Motero', manual de señalización para talleres autorizados, displays para retail y piezas audiovisuales dinámicas.",
      aiAndTechChallenge: "Dirección de arte rigurosa sujeta a las guías globales de marca de ExxonMobil Corporation, adaptadas a la cultura urbana y motera colombiana.",
      businessImpact: "Presencia en más de 200 puntos de venta a nivel nacional y aumento del 18% en la rotación de producto en talleres especializados durante la activación.",
      hybridAdvantage: "Entendimiento antropológico de la comunidad motera: la moto no es solo transporte, es identidad, orgullo y sustento familiar. El mensaje conectó desde la autenticidad."
    }
  },
  {
    num: "09",
    title: "Seminario Industrial Mobil",
    subtitle: "Producción Visual de Gran Formato (Marriott Cali)",
    category: "brand",
    categoryLabel: "BRAND & UI/UX",
    description: "Dirección de arte, señalética, credenciales y material editorial para el Seminario Industrial de lubricantes para el sector energético y minero.",
    tags: ["ADOBE INDESIGN", "GRAN FORMATO", "SEÑALÉTICA", "EDITORIAL"],
    stat: "B2B",
    statLabel: "CONVENCIÓN INDUSTRIAL",
    color: "bg-warn",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "HOTEL MARRIOTT",
    caseStudy: {
      problem: "La necesidad de proyectar solidez tecnológica e ingeniería de vanguardia ante tomadores de decisiones de la industria petrolera, azucarera y minera en el Hotel Marriott de Cali.",
      architecture: "Sistema integral de señalética espacial, backdrops escenográficos de gran formato, cuadernillos técnicos encuadernados e identificaciones con código QR para asistentes VIP.",
      aiAndTechChallenge: "Gestión de color en gran formato (pantone industrial vs cuatricromía) para mantener coherencia cromática en materiales textiles, acrílicos y vinilos bajo iluminación de escenario.",
      businessImpact: "Evento con calificación de satisfacción del 98% por parte de los directivos de planta industrial y fortalecimiento del posicionamiento de Districol como aliado técnico estratégico.",
      hybridAdvantage: "Jerarquía de información técnica clara: gráficos de viscosidad y rendimiento que ingenieros industriales pudieron asimilar en segundos."
    }
  },
  {
    num: "10",
    title: "San Juan Plaza (Neiva)",
    subtitle: "Producción Gráfica & Cobertura Institucional",
    category: "brand",
    categoryLabel: "BRAND & UI/UX",
    description: "Campañas visuales para el Festival del Café y Cacao, Geek Fest y eventos institucionales con personalidades de Miss Universe Colombia.",
    tags: ["DISEÑO GRÁFICO", "FOTOGRAFÍA INSTITUCIONAL", "CAMPAÑAS RETAIL"],
    stat: "RETAIL",
    statLabel: "CENTRO COMERCIAL",
    color: "bg-acid",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "NEIVA, HUILA",
    caseStudy: {
      problem: "Aumentar el tráfico de visitantes en temporadas medias y consolidar el centro comercial como el epicentro cultural y gastronómico del departamento del Huila.",
      architecture: "Diseño de campañas temáticas 360° (Festival del Café y Cacao, Geek Fest), señalética interna de wayfinding, escenografías para pasarelas y cubrimiento fotográfico profesional.",
      aiAndTechChallenge: "Retoque fotográfico de alta precisión y producción rápida de piezas omnicanal para pantallas LED gigantes, vallas de carretera y redes sociales simultáneamente.",
      businessImpact: "Récord de afluencia durante los fines de semana de activación y aumento del 25% en ventas para los locatarios gastronómicos durante el festival.",
      hybridAdvantage: "Poner en valor la identidad cafetera regional sin caer en clichés, logrando un lenguaje visual contemporáneo que atrajo tanto a jóvenes como a familias."
    }
  },
  {
    num: "11",
    title: "Parrilla Bar 385 / Food",
    subtitle: "Identidad Visual & Menú Digital Interactivo",
    category: "brand",
    categoryLabel: "BRAND & UI/UX",
    description: "Fotografía gastronómica de alta definición, manual de identidad de restaurante y diseño de menú responsive para smartphones.",
    tags: ["FOTOGRAFÍA GASTRONÓMICA", "BRANDING", "MENÚ MOBILE UX"],
    stat: "360°",
    statLabel: "BRANDING + DIGITAL",
    color: "bg-ink",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "GASTRONOMÍA",
    caseStudy: {
      problem: "Menús físicos deteriorados por el uso diario, altos costos de reimpresión ante cambios de precios y una identidad gráfica que no reflejaba la calidad de los cortes a la parrilla.",
      architecture: "Menú digital progresivo en web optimizado para carga rápida en celulares mediante código QR en mesa, acompañado de fotografía gastronómica iluminada en set propio.",
      aiAndTechChallenge: "Compresión de imágenes de alta fidelidad para lograr que platos con cortes premium carguen en <400ms incluso en conexiones móviles 3G/4G dentro del restaurante.",
      businessImpact: "Eliminación completa del gasto en reimpresión de cartas de menú y aumento del 30% en pedidos de platos de mayor margen gracias a la fotografía apetitiva.",
      hybridAdvantage: "Diseño de menú basado en neuromarketing gastronómico: ubicación visual estratégica de los cortes insignia para guiar la vista y facilitar la decisión del comensal."
    }
  },
  {
    num: "12",
    title: "Partido Cambio Radical",
    subtitle: "Coordinación de Productos Digitales & E-Learning",
    category: "brand",
    categoryLabel: "BRAND & UI/UX",
    description: "Diseño y animación de módulos formativos digitales, motion graphics y piezas gráficas de comunicación política a nivel nacional.",
    tags: ["MOTION GRAPHICS", "E-LEARNING", "POLITICAL COMM", "PREMIERE PRO"],
    stat: "EDU",
    statLabel: "FORMACIÓN DIGITAL",
    color: "bg-warn",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "CAMPAÑA NACIONAL",
    caseStudy: {
      problem: "Capacitar a miles de candidatos y militantes en normativa electoral y doctrina política a lo largo de todo el país con recursos presenciales limitados.",
      architecture: "Plataforma de formación virtual con píldoras de microaprendizaje en video, infografías explicativas descargables y canales de difusión masiva.",
      aiAndTechChallenge: "Traducción visual de leyes y estatutos complejos a piezas de motion graphics dinámicas de menos de 90 segundos que mantienen la atención del espectador.",
      businessImpact: "Más de 4,000 líderes políticos capacitados en 32 departamentos sin incidentes de desinformación normativa durante la contienda electoral.",
      hybridAdvantage: "Comunicación pedagógica no polarizante: transformar textos legislativos áridos en narrativas visuales accesibles para cualquier ciudadano."
    }
  },
  {
    num: "13",
    title: "Parapente Boyacá",
    subtitle: "Manual de Marca & Sistema Gráfico Deportivo",
    category: "brand",
    categoryLabel: "BRAND & UI/UX",
    description: "Manual normativo de marca completo, paletas H/S/B y RGB, tipografías Aventura/Emprint e indumentaria técnica para pilotos.",
    tags: ["MANUAL DE MARCA", "ICONOGRAFÍA", "INDUMENTARIA", "TIPOGRAFÍA"],
    stat: "MANUAL",
    statLabel: "SISTEMA NORMATIVO",
    color: "bg-acid",
    link: "https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/",
    badge: "DEPORTES EXTREMOS",
    caseStudy: {
      problem: "Falta de una identidad visual consistente que transmitiera los estándares de seguridad, profesionalismo y libertad del turismo de aventura y vuelo libre en Boyacá.",
      architecture: "Manual de identidad corporativa con normatividad estricta de isotipo, paleta de color de alta visibilidad para indumentaria en vuelo y aplicaciones en velas y arneses.",
      aiAndTechChallenge: "Diseño vectorial de geometría pura que mantiene legibilidad y reconocimiento visual a distancias de más de 300 metros en el aire.",
      businessImpact: "Posicionamiento de la marca como referente de ecoturismo en el departamento y profesionalización de la imagen comercial ante turistas internacionales.",
      hybridAdvantage: "Conexión emocional entre la adrenalina del vuelo y la serenidad de los paisajes boyacenses, comunicando que el deporte extremo y la máxima seguridad van de la mano."
    }
  }
];

export const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fullstack' | 'brand'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = allProjects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="portfolio" className="shell py-24">
      <Reveal as="div" variant="scale" className="border border-line bg-bg-2">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-line bg-bg-3 font-mono text-[11px] text-ink-dim uppercase tracking-widest" aria-hidden="true">
          <div className="flex items-center gap-2">
            <span className="w-[9px] h-[9px] rounded-full bg-warn"></span>
            <span className="w-[9px] h-[9px] rounded-full bg-line-2"></span>
            <span className="w-[9px] h-[9px] rounded-full bg-acid acid-pulse"></span>
            <span className="ml-2 text-ink-dimmer">SYS://PORTFOLIO_ENGINE_V2.1</span>
          </div>
          <div className="flex items-center gap-2 text-acid font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{filteredProjects.length} PROYECTOS VISIBLES</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          {/* Main Title & Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 pb-8 border-b border-line">
            <div>
              <div className="font-mono text-[10px] text-acid uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-acid rounded-full animate-ping"></span>
                <span>[ CEREBRO KNOWLEDGE VAULT · CASOS DE ESTUDIO ]</span>
              </div>
              <h2 className="text-[clamp(34px,5.5vw,80px)] font-bold tracking-[-0.05em] leading-[0.9] text-ink">
                Sistemas que <span className="text-acid">eliminan fricción</span>.
              </h2>
            </div>
            <div className="font-mono text-[11px] text-ink-dim leading-[1.7] uppercase tracking-widest flex flex-col justify-end">
              <div>[ FILOSOFÍA DE ARQUITECTURA ]</div>
              <strong className="block text-ink font-medium mt-1 normal-case text-[13px]">
                &ldquo;La ingeniería sin diseño crea rechazo. El diseño sin ingeniería crea frustración. Construyo la solución completa.&rdquo;
              </strong>
            </div>
          </div>

          {/* Categorías y Filtros Rápidos */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-line">
            <div className="inline-flex flex-wrap items-center p-1 bg-bg border border-line gap-1 font-mono text-xs" role="tablist" aria-label="Filtro de proyectos">
              <button
                onClick={() => setActiveFilter('all')}
                role="tab"
                aria-selected={activeFilter === 'all'}
                className={`px-3.5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFilter === 'all'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <span>Todos ({allProjects.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('fullstack')}
                role="tab"
                aria-selected={activeFilter === 'fullstack'}
                className={`px-3.5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFilter === 'fullstack'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Full-Stack &amp; IA (7)</span>
              </button>

              <button
                onClick={() => setActiveFilter('brand')}
                role="tab"
                aria-selected={activeFilter === 'brand'}
                className={`px-3.5 py-2 uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFilter === 'brand'
                    ? 'bg-acid text-bg shadow-[0_0_12px_rgba(198,255,61,0.25)]'
                    : 'text-ink-dim hover:text-ink'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Brand &amp; UI/UX (6)</span>
              </button>
            </div>

            <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-ping"></span>
              <span>CLICK EN CUALQUIER TARJETA PARA CASO DE ESTUDIO</span>
            </div>
          </div>

          {/* Project Cards List */}
          <div className="pt-8 space-y-4">
            {filteredProjects.map((p, i) => (
              <Reveal key={p.num} variant="left" delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div
                  onClick={() => setSelectedProject(p)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedProject(p); } }}
                  className="group block p-6 md:p-8 border border-line bg-bg hover:bg-bg-3 hover:border-acid transition-all duration-300 relative overflow-hidden cursor-pointer"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_220px] gap-6 items-start">
                    {/* Number & Category */}
                    <div className="font-mono text-sm text-ink-dim group-hover:text-acid transition-colors font-bold">
                      {p.num}
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-[22px] md:text-[28px] font-bold tracking-tight text-ink group-hover:text-acid transition-colors leading-none">
                          {p.title}
                        </h3>
                        <span className="font-mono text-[8.5px] uppercase px-2 py-0.5 border border-line bg-bg-2 text-ink-dim tracking-wider">
                          {p.categoryLabel}
                        </span>
                        {p.badge && (
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-acid/40 bg-acid/10 text-acid tracking-wider font-semibold">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs text-acid font-medium tracking-wide mb-2.5">
                        {p.subtitle}
                      </div>

                      <p className="text-[13.5px] text-ink-dim leading-relaxed max-w-3xl mb-4 group-hover:text-ink transition-colors">
                        {p.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[9.5px] px-2 py-0.5 border border-line bg-bg-2 text-ink-dimmer uppercase tracking-wider group-hover:border-line-2 group-hover:text-ink-dim transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stat / Action */}
                    <div className="lg:text-right flex lg:flex-col justify-between items-end pt-4 lg:pt-0 border-t lg:border-t-0 border-line">
                      <div className="font-mono text-[10px] text-ink-dim uppercase tracking-widest">
                        {p.statLabel}
                      </div>
                      <div className="text-[30px] md:text-[36px] font-bold text-acid leading-none my-1 tracking-tight">
                        {p.stat}
                      </div>
                      <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-ink-dim group-hover:text-acid transition-colors uppercase tracking-wider font-bold">
                        <span>Ver Caso de Estudio</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ─── MODAL DE CASO DE ESTUDIO (DEEP DIVE) ─── */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-2 border border-acid shadow-[0_20px_80px_rgba(0,0,0,0.9)] p-6 md:p-10 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-6 border-b border-line gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2 font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-acid font-bold">[ CASO DE ESTUDIO · #{selectedProject.num} ]</span>
                  <span className="px-2 py-0.5 border border-line text-ink-dim bg-bg">
                    {selectedProject.categoryLabel}
                  </span>
                  {selectedProject.badge && (
                    <span className="px-2 py-0.5 border border-acid/50 bg-acid/10 text-acid font-bold">
                      {selectedProject.badge}
                    </span>
                  )}
                </div>
                <h2 id="modal-project-title" className="text-[28px] md:text-[40px] font-bold tracking-tight text-ink leading-none">
                  {selectedProject.title}
                </h2>
                <div className="font-mono text-sm text-acid mt-1 font-medium">
                  {selectedProject.subtitle}
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Cerrar caso de estudio"
                className="p-2 border border-line bg-bg hover:border-acid hover:text-acid text-ink-dim transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Impact Metric Banner */}
            <div className="my-6 p-4 bg-bg border border-line flex flex-wrap items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-acid" />
                <div>
                  <div className="text-[9px] text-ink-dim uppercase tracking-wider">{selectedProject.statLabel}</div>
                  <div className="text-2xl font-bold text-acid leading-tight">{selectedProject.stat}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tags.map((tag, idx) => (
                  <span key={idx} className="text-[9.5px] px-2 py-1 border border-line bg-bg-2 text-ink-dim uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 4 Core Pillars of Deep Dive */}
            <div className="space-y-6 pt-2">
              {/* 01 / El Problema */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-warn uppercase tracking-widest mb-2 font-bold">
                  <span>01 /</span>
                  <span>EL PROBLEMA &amp; EL CONTEXTO</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selectedProject.caseStudy.problem}
                </p>
              </div>

              {/* 02 / La Arquitectura */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>02 / ARQUITECTURA &amp; STACK ELEGIDO</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selectedProject.caseStudy.architecture}
                </p>
              </div>

              {/* 03 / Reto Técnico & IA */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>03 / RETO TÉCNICO &amp; RESOLUCIÓN</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selectedProject.caseStudy.aiAndTechChallenge}
                </p>
              </div>

              {/* 04 / Impacto de Negocio */}
              <div className="p-5 bg-bg/80 border border-line">
                <div className="flex items-center gap-2 font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  <span>04 /</span>
                  <span>RESULTADO &amp; IMPACTO DE NEGOCIO</span>
                </div>
                <p className="text-[14px] text-ink leading-relaxed font-medium">
                  {selectedProject.caseStudy.businessImpact}
                </p>
              </div>

              {/* Ventaja Híbrida */}
              <div className="p-5 bg-acid/5 border border-acid/40">
                <div className="font-mono text-[10px] text-acid uppercase tracking-widest mb-2 font-bold">
                  // LA VENTAJA HÍBRIDA (COMUNICACIÓN + INGENIERÍA)
                </div>
                <p className="text-[13.5px] text-ink leading-relaxed italic">
                  &ldquo;{selectedProject.caseStudy.hybridAdvantage}&rdquo;
                </p>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="text-ink-dim text-[11px]">
                Presiona <kbd className="px-1.5 py-0.5 bg-bg border border-line text-acid">ESC</kbd> o haz clic fuera para cerrar.
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-bg border border-line text-ink hover:border-acid hover:text-acid transition-colors flex items-center gap-2 font-bold tracking-wider uppercase"
                >
                  <span>Ver Enlace / Repositorio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="#contact"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 bg-acid text-bg font-bold tracking-wider uppercase hover:bg-white transition-colors"
                >
                  Agendar Demostración
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
