
import React from 'react';

const Careers: React.FC = () => {
  const benefits = [
    {
      title: 'Plan de carrera',
      desc: 'La compañía ofrece un plan de carrera orientado al desarrollo profesional de sus colaboradores, brindando oportunidades de crecimiento, formación continua y proyección interna, de acuerdo con el desempeño y los resultados obtenidos.',
      icon: '📈'
    },
    { title: 'Sostenibilidad', desc: 'Lidera la transición verde en la industria de la maquinaria pesada.', icon: '🌱' },
    { title: 'Innovación Tech', desc: 'Trabaja con las últimas tecnologías en plataformas de trading y IA.', icon: '💻' },
    { title: 'Bienestar', desc: 'Seguro médico, horarios flexibles y un entorno de apoyo continuo.', icon: '❤️' },
  ];

  const jobs = [
    {
      title: 'Ingeniero Residente',
      location: 'Bogotá / Obra',
      type: 'Full-time',
      dept: 'Ingeniería',
      requirements: 'Civil (6+ años exp), AutoCAD, Excel'
    },
    {
      title: 'Asesor Comercial de Maquinaria Pesada',
      location: 'Bogotá',
      type: 'Full-time',
      dept: 'Ventas',
      requirements: 'Ing. Comercial/Mecánica (3+ años exp), Office'
    }
  ];

  const handleApply = (jobTitle: string) => {
    const phone = '573203532896';
    const message = encodeURIComponent(`Hola, estoy interesado en la vacante de ${jobTitle}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="bg-emerald-950 text-white py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10">
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase">
            Únete a MIP INTERNACIONAL
          </span>
          <h1 className="text-4xl md:text-7xl font-black leading-tight max-w-4xl">
            Construye el Futuro del <span className="text-emerald-400">Trading Industrial</span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl opacity-80 italic">
            "Si eres una persona apasionada por la labor y tienes experiencia en el cargo, esta oportunidad es para ti."
          </p>
          <div className="pt-4">
            <a href="#vacantes" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/40">
              Ver Vacantes Actuales
            </a>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img src="/assets/1b793907-d33d-4848-9c3c-01beefab08c5.JPG" className="w-full h-full object-cover" alt="Background" />
        </div>
      </section>

      {/* Culture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 leading-tight">Nuestra Cultura en MIP</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Valoramos la iniciativa, la honestidad y la capacidad de pensar en grande. Somos un equipo diverso de expertos industriales en MIP INTERNACIONAL TRADING SAS.
              </p>
            </div>

            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 space-y-4">
              <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <span>📝</span> Requisitos para trabajar con nosotros:
              </h3>
              <ul className="space-y-3">
                {['Proactivo', 'Disposición para aprender', 'Estar preparado para trabajar en un ambiente activo'].map((req, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              {benefits.map((benefit, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 hover:border-emerald-300 transition-colors">
                  <div className="text-3xl">{benefit.icon}</div>
                  <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-500">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative sticky top-24">
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop" className="rounded-3xl shadow-2xl border-8 border-white object-cover aspect-[4/5]" alt="Team working" />
            <div className="absolute -bottom-6 -right-6 bg-emerald-600 text-white p-8 rounded-2xl shadow-xl hidden lg:block">
              <p className="text-3xl font-black">+250</p>
              <p className="text-sm opacity-80 uppercase font-bold tracking-widest">Profesionales Globales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Vacancies */}
      <section id="vacantes" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-4xl font-black text-slate-900">Oportunidades Abiertas</h2>
            <p className="text-xl text-emerald-600 font-bold max-w-3xl mx-auto leading-relaxed">
              "Si eres una persona apasionada por la labor y tienes experiencia en el cargo, esta oportunidad es para ti."
            </p>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Únete a un equipo apasionado por la excelencia y el trading internacional.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-2xl transition-all flex flex-col md:flex-row justify-between items-center gap-6 group">
                <div className="space-y-3 text-center md:text-left">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {job.dept}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="text-emerald-500">📍</span> {job.location}
                    </span>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-emerald-500">🕒</span> {job.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-600">Requisitos:</span> {job.requirements}
                  </p>
                </div>
                <button
                  onClick={() => handleApply(job.title)}
                  className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all w-full md:w-auto shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                >
                  Postularme
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
