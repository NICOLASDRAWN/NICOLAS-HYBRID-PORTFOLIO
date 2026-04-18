'use client';

import { Mail, Phone, MapPin, Globe, Link as LinkIcon, GitBranch } from "lucide-react"

export default function CVPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 p-8 md:p-16 max-w-[210mm] mx-auto shadow-xl print:shadow-none font-body">
      {/* Header */}
      <header className="border-b-4 border-blue-600 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter uppercase">Nicolás Monroy Pabón</h1>
          <p className="text-blue-600 text-lg font-bold tracking-widest mt-2 uppercase">Full Stack Developer & AI Specialist</p>
        </div>
        <div className="grid grid-cols-1 gap-1 text-sm text-zinc-600">
          <div className="flex items-center gap-2"><Mail size={14}/> nicolasmonroypabon@gmail.com</div>
          <div className="flex items-center gap-2"><Phone size={14}/> +57 322 2841441</div>
          <div className="flex items-center gap-2"><MapPin size={14}/> Bogotá, Colombia</div>
          <div className="flex items-center gap-2"><Globe size={14}/> nicolasdrawn.pw</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-8">
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b pb-1">Perfil</h2>
            <p className="text-sm leading-relaxed text-zinc-700">
                Comunicador Social y Full Stack Developer. Especializado en crear ERPs empresariales, portales B2B y soluciones con IA Generativa (Gemini, Claude, OpenAI) para entornos de producción real.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b pb-1">Stack Principal</h2>
            <ul className="text-sm space-y-2 font-medium">
              <li>React / Next.js / TypeScript</li>
              <li>Node.js / Express</li>
              <li>Python / Flask / AI APIs</li>
              <li>SQLite / PostgreSQL / JWT</li>
              <li>Electron / Desktop Apps</li>
              <li>Tailwind CSS / Figma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b pb-1">Idiomas</h2>
            <div className="text-sm space-y-1">
              <div className="flex justify-between"><span>Español</span><span className="text-zinc-400">Nativo</span></div>
              <div className="flex justify-between"><span>Inglés</span><span className="text-zinc-400">B2 (Conversacional)</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b pb-1">Links</h2>
            <div className="flex flex-col gap-2 text-sm">
                <a href="https://linkedin.com/in/nicolas-monroy-pab%C3%B3n-a8a838176/" className="flex items-center gap-2 text-zinc-600 hover:text-blue-600 transition-colors"><LinkIcon size={14}/> LinkedIn</a>
                <a href="https://github.com/NICOLASDRAWN" className="flex items-center gap-2 text-zinc-600 hover:text-blue-600 transition-colors"><GitBranch size={14}/> GitHub</a>
            </div>
          </section>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6 border-b pb-1">Experiencia Destacada</h2>
            
            <div className="space-y-8">
              <div className="relative pl-4 border-l-2 border-zinc-100">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 border-4 border-white"></div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">Design Strategist & B2B Branding</h3>
                  <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded font-bold">2025 — PRESENTE</span>
                </div>
                <p className="text-sm text-zinc-500 mb-2 italic">MIP Internacional Trading SAS</p>
                <ul className="text-sm text-zinc-700 space-y-1 list-disc list-inside">
                  <li>Liderazgo en transformación digital y arquitectura visual industrial.</li>
                  <li>Desarrollo de ERPs avanzados con IA y seguridad jurídica (Certicamara).</li>
                </ul>
              </div>

              <div className="relative pl-4 border-l-2 border-zinc-100">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 border-4 border-white"></div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">Digital Products Coordinator</h3>
                  <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded font-bold">2025 (ENE - MAR)</span>
                </div>
                <p className="text-sm text-zinc-500 mb-2 italic">Partido Cambio Radical</p>
                <ul className="text-sm text-zinc-700 space-y-1 list-disc list-inside">
                  <li>Gestión de activos digitales y producción multimedia nacional.</li>
                  <li>Diseño de materiales para capacitación y plataformas e-learning.</li>
                </ul>
              </div>

              <div className="relative pl-4 border-l-2 border-zinc-100">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 border-4 border-white"></div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">Trade Mark Coordinator</h3>
                  <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded font-bold">2024</span>
                </div>
                <p className="text-sm text-zinc-500 mb-2 italic">Districol LTDA</p>
                <ul className="text-sm text-zinc-700 space-y-1 list-disc list-inside">
                  <li>Coordinación de trade marketing nacional para hidrocarburos.</li>
                  <li>Estrategia comercial y desarrollo de branding en puntos de venta.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6 border-b pb-1">Proyectos en Producción</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <h4 className="font-bold text-blue-600">ProveedHub Platform</h4>
                <p className="text-xs text-zinc-600 mt-1">Plataforma con IA Gemini para validación automática de documentos corporativos (RUT, Cámara de Comercio). Desplegada en producción en MIP Trading.</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <h4 className="font-bold text-blue-600">ERP Supply Chain</h4>
                <p className="text-xs text-zinc-600 mt-1">Ecosistema full-stack con firma digital Certicámara, aprobaciones multi-nivel y reportes automatizados. App web y desktop.</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <h4 className="font-bold text-blue-600">Conquista la Ciudad</h4>
                <p className="text-xs text-zinc-600 mt-1">App móvil nativa (Kotlin/Compose) con geofencing para gamificación de running en tiempo real.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-zinc-100 text-[10px] text-zinc-400 text-center uppercase tracking-widest">
        Generado para Nicolás Monroy Pabón — Bogotá, Colombia — 2026
      </footer>

      {/* Botón flotante para imprimir (oculto al imprimir) */}
      <button 
        onClick={() => window.print()} 
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform print:hidden"
        title="Imprimir como PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
      </button>
    </div>
  )
}
