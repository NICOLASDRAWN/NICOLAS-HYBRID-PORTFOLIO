export default function CartaPage() {
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-white text-zinc-900 p-16 md:p-24 max-w-[210mm] mx-auto shadow-xl print:shadow-none font-body">
      <header className="mb-16">
        <h1 className="text-3xl font-heading font-bold tracking-tighter uppercase mb-2">Carta de Presentación</h1>
        <div className="w-16 h-1 bg-blue-600 mb-8"></div>
        <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{today} — Bogotá, D.C.</div>
      </header>

      <section className="space-y-6 text-zinc-700 leading-relaxed text-base">
        <p className="font-bold text-zinc-900">A la atención del equipo de Selección / Dirección Técnica:</p>

        <p>
          Me pongo en contacto con uestedes para expresar mi firme interés en integrarme a su equipo como <strong>Full Stack Developer & AI Specialist</strong>. Con más de 3 años de experiencia desarrollando soluciones escalables, mi enfoque se centra en la intersección de la arquitectura técnica robusta y la implementación estratégica de Inteligencia Artificial en entornos de producción.
        </p>

        <p>
          Mi perfil híbrido como <strong>Comunicador Social Profesional</strong> y <strong>Desarrollador Full Stack</strong> me permite no solo escribir código eficiente en React, Node.js y Python, sino también comprender y articular las narrativas funcionales que un producto requiere para impactar realmente en el mercado. He liderado el desarrollo de Ecosistemas ERP complejos y portales B2B donde la trazabilidad, la seguridad jurídica (integrando firmas digitales certificadas) y la automatización inteligente no son solo deseos, sino realidades tangibles.
        </p>

        <p>
          Entre mis logros más recientes, destaco la creación de <strong>ProveedHub</strong>, una plataforma que utiliza modelos LLM (Gemini/Claude) para el procesamiento y validación automática de documentos corporativos, optimizando procesos operativos en más de un 70%. Mi dominio técnica se extiende desde el desarrollo móvil nativo con Kotlin hasta aplicaciones de escritorio multiplataforma con Electron.
        </p>

        <p>
          Busco una oportunidad donde pueda aportar mi visión estratégica, mi capacidad de resolución de problemas complejos y mi compromiso con el código limpio y mantenible. Estoy convencido de que mi habilidad para orquestar soluciones de IA y mi experiencia en el despliegue de software en producción aportarán un valor inmediato a sus objetivos de innovación.
        </p>

        <p>
          Agradezco de antemano su tiempo para revisar mi perfil y quedo a su entera disposición para agendar una entrevista y profundizar en cómo mi experiencia se alinea con los retos de su organización.
        </p>

        <div className="pt-12">
          <p className="font-bold text-zinc-900 mb-1">Cordialmente,</p>
          <p className="text-xl font-heading font-bold tracking-tight text-blue-600">Nicolás Monroy Pabón</p>
          <p className="text-sm text-zinc-500">Full Stack Developer & AI Specialist</p>
          <div className="mt-4 text-[10px] text-zinc-400 space-x-4">
            <span>nicolasmonroypabon@gmail.com</span>
            <span>+57 322 2841441</span>
            <span>Bogotá, Colombia</span>
          </div>
        </div>
      </section>

      {/* Botón flotante para imprimir */}
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
