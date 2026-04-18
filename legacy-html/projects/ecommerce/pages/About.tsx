import { Helmet } from 'react-helmet-async';

const About: React.FC = () => {
  // ... existing code ...

  return (
    <div className="pb-20 bg-slate-50">
      <Helmet>
        <title>Nosotros | MIP Internacional Trading SAS</title>
        <meta name="description" content="Conozca a MIP Internacional Trading, líderes en maquinaria pesada con más de 300 expertos y certificaciones ISO. Aliados del Metro de Bogotá." />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-emerald-900 text-white py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block bg-emerald-500/20 backdrop-blur-md px-6 py-2 rounded-full text-emerald-300 font-bold text-sm tracking-widest mb-8 border border-emerald-400/20">
            NUESTRA IDENTIDAD
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">MIP INTERNACIONAL <br /><span className="text-emerald-400">TRADING SAS</span></h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-4xl mx-auto opacity-90 leading-relaxed font-medium">
            Conectando el mercado global de maquinaria pesada con soluciones de trading seguras, transparentes y de alto impacto operacional.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10 blur-3xl"></div>
      </section>

      {/* Who We Are, Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 space-y-8">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6 group hover:border-emerald-500 transition-all duration-500">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🤝</div>
            <h2 className="text-3xl font-black text-emerald-600 uppercase tracking-tight">Quiénes Somos</h2>
          </div>
          <p className="text-slate-600 text-xl leading-relaxed font-medium">
            {COMPANY_INFO.whoWeAre}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6 group hover:border-emerald-500 transition-all duration-500">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🎯</div>
            <h2 className="text-3xl font-black text-slate-900">Nuestra Misión</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {COMPANY_INFO.mission}
            </p>
          </div>
          <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-6 group hover:border-emerald-500 transition-all duration-500">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">👁️</div>
            <h2 className="text-3xl font-black text-slate-900">Nuestra Visión</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {COMPANY_INFO.vision}
            </p>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Diferenciadores Clave</h2>
          <div className="h-1.5 w-24 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {KEY_DIFFERENTIATORS.map((diff, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 text-center space-y-4 hover:border-emerald-500 transition-all group">
              <div className="text-4xl group-hover:scale-125 transition-transform">{diff.icon}</div>
              <h3 className="font-bold text-slate-800 leading-tight">{diff.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Metro Project Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="bg-emerald-950 rounded-[3rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/Vibrocompactador XCMG XS223J.png"
              className="w-full h-full object-cover opacity-20 brightness-150"
              alt="Metro de Bogotá"
            />
          </div>
          <div className="relative z-10 p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-emerald-500/20 backdrop-blur-md px-6 py-2 rounded-full text-emerald-400 font-bold text-sm tracking-widest border border-emerald-400/20 uppercase">
                Aliado Clave del Proyecto
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Metro de Bogotá</h2>
              <p className="text-emerald-100/80 text-lg leading-relaxed">
                Ejecución de infraestructura estratégica bajo los más altos estándares técnicos y operativos.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BRAND_PROJECTS.map((proj, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{proj.icon}</span>
                    <span className="text-white font-bold">{proj.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2rem] border border-white/10 space-y-6">
              <h3 className="text-xl font-bold text-white mb-4">Métricas de Impacto</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-emerald-400">{PROJECT_STATS.metroLine1.progress}</p>
                  <p className="text-xs font-bold text-emerald-200/50 uppercase tracking-widest">Avance General</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-emerald-400">{PROJECT_STATS.metroLine1.columns}</p>
                  <p className="text-xs font-bold text-emerald-200/50 uppercase tracking-widest">Columnas de Viaducto</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-emerald-100/60 text-sm italic">
                  Suministro integral de maquinaria y personal certificado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-32 px-4 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Servicios Integrados</h2>
            <div className="h-2 w-32 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-white hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-emerald-500 transition-colors"></div>
                <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-3xl mb-8 relative z-10 group-hover:scale-110 transition-transform">⚙️</div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg relative z-10">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Nuestra Trayectoria</h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">Desde nuestros cimientos en China hasta el liderazgo en grandes obras de infraestructura en Colombia.</p>
        </div>
        <div className="relative border-l-4 border-emerald-100 ml-4 md:ml-0 md:left-1/2 space-y-12">
          {HISTORY_TIMELINE.map((item, idx) => (
            <div key={idx} className={`relative md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:-left-1/2' : 'md:pl-12'}`}>
              <div className="md:absolute top-0 right-0 -mr-2 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white hidden md:block" style={{ left: idx % 2 === 0 ? '100%' : '-8px' }}></div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-emerald-300 transition-colors">
                <span className="text-emerald-600 font-black text-2xl mb-2 block">{item.year}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase mb-4">{item.location}</p>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Certifications Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Certificaciones de Excelencia</h2>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">Comprometidos con los más altos estándares internacionales en cada operación.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((c, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl text-center border-b-4 border-emerald-500 shadow-xl hover:-translate-y-2 transition-transform flex flex-col justify-between h-full">
              <div className="text-5xl mb-6">{c.icon}</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{c.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Group of Experts Section */}
      <section className="bg-slate-900 text-white py-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl font-black">Grupo de Expertos</h2>
                <div className="h-2 w-24 bg-emerald-500 rounded-full"></div>
              </div>
              <p className="text-slate-300 text-xl leading-relaxed">
                Contamos con un equipo multidisciplinario conformado por <span className="text-white font-bold">más de {TEAM_STATS.totalExperts.toLocaleString()} colaboradores</span> distribuidos en áreas estratégicas, operativas y técnicas.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {expertAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="text-2xl">{area.icon}</div>
                    <div>
                      <p className="text-2xl font-black text-emerald-400">{area.count}</p>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{area.area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <img
                src="/assets/1b793907-d33d-4848-9c3c-01beefab08c5.JPG"
                alt="Personal MIP Internacional"
                className="rounded-[3rem] shadow-2xl relative z-10 border-4 border-white/5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px]">
            <img
              src="/assets/Perforadora Sany SR285R.png"
              className="w-full h-full object-cover"
              alt="Taller Especializado"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-2">Infraestructura Propia</p>
              <h3 className="text-3xl font-black">Taller de Mantenimiento Especializado</h3>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Venta, Refacciones y Soporte</h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                En MIP Internacional Trading SAS, no solo comercializamos equipos; garantizamos su ciclo de vida operativo mediante soluciones integrales.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🛠️</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Mantenimiento Preventivo y Correctivo</h4>
                  <p className="text-slate-500">Realizado por técnicos calificados para asegurar la operatividad diaria y maximizar la vida útil de cada máquina.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Repuestos y Accesorios</h4>
                  <p className="text-slate-500">Suministro de repuestos originales y alternativos para diversas marcas líderes en el mercado industrial.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🤝</div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Asesoría de Alto Nivel</h4>
                  <p className="text-slate-500">Nuestro equipo brinda soporte técnico especializado en toda Colombia para garantizar el éxito de su proyecto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Section */}
      <section className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-emerald-50 rounded-[3rem] p-16 border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <span className="text-emerald-200 text-9xl font-black opacity-40">2025</span>
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-black text-slate-900">Evolución y Rentabilidad</h2>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium">
              Entre 2022 y 2025, MIP Internacional Trading SAS proyecta un crecimiento sostenido impulsado por la eficiencia operativa y la confianza de nuestros socios globales.
            </p>
            <div className="flex flex-wrap justify-center gap-12 pt-8">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-500 uppercase mb-2">Indicador DuPont</p>
                <p className="text-4xl font-black text-emerald-600">29%</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-500 uppercase mb-2">Rentabilidad</p>
                <p className="text-4xl font-black text-emerald-600">15.01%</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-500 uppercase mb-2">Impacto Activos</p>
                <p className="text-4xl font-black text-emerald-600">50.000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
