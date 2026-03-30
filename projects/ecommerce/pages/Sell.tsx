import { Helmet } from 'react-helmet-async';

const Sell: React.FC = () => {
  // ... existing code ...

  return (
    <div className="space-y-12 sm:space-y-16 md:space-y-20 pb-12 sm:pb-16 md:pb-20">
      <Helmet>
        <title>Venda su Maquinaria | MIP Internacional Trading SAS</title>
        <meta name="description" content="Venda sus equipos de construcción con MIP Internacional. Avalúo gratuito, marketing global y gestión de venta rápida y segura." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative text-white py-24 sm:py-32 px-4 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/sell-hero-bg.png"
            className="w-full h-full object-cover"
            alt="Fondo Maquinaria"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 to-emerald-900/70"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">Vende tus Equipos con el Líder en Trading</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-emerald-100 max-w-2xl font-medium">
              Experiencia garantizada ayudando a empresas a maximizar el valor de su maquinaria pesada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#contacto" className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 text-center">
                Solicitar Tasación
              </a>
              <button className="bg-white/10 hover:bg-white/20 border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur">
                Ver Métodos
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Sale Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

          {/* CAT 336 Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row group hover:shadow-2xl hover:border-emerald-500 transition-all duration-300">
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-slate-50">
              <img
                src="/assets/products/cat336-promo.png"
                alt="Excavadora CAT 336"
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Disponible
              </div>
            </div>
            <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Excavadora CAT 336D2 L</h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">2016</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Peso Operativo:</span>
                    <span className="font-bold text-slate-900">36.200 kg</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Cucharón:</span>
                    <span className="font-bold text-slate-900">Hasta 2.4 m³</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Horómetro:</span>
                    <span className="font-bold text-slate-900">10.065 H</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span className="font-bold text-slate-900">Bogotá</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.open('https://wa.me/573204080950?text=Hola,%20me%20interesa%20la%20Excavadora%20CAT%20336', '_blank')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                Solicitar Cotización 💬
              </button>
            </div>
          </div>

          {/* XCMG 80T Card */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col md:flex-row group hover:shadow-2xl hover:border-emerald-500 transition-all duration-300">
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-slate-50">
              <img
                src="/assets/products/xcmg80-promo.png"
                alt="Grúa XCMG 80T"
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Entrega Inmediata
              </div>
            </div>
            <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Grúa de Orugas XCMG 80T</h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">New</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Capacidad:</span>
                    <span className="font-bold text-slate-900">80 Toneladas</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Tipo:</span>
                    <span className="font-bold text-slate-900">Sobre Orugas</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span>Aplicación:</span>
                    <span className="font-bold text-slate-900">Montaje Pesado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span className="font-bold text-slate-900">Bogotá</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.open('https://wa.me/573204080950?text=Hola,%20me%20interesa%20la%20Grúa%20XCMG%2080T', '_blank')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                Solicitar Cotización 💬
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Process Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Vender es Fácil y Seguro</h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Nuestro proceso paso a paso diseñado para tu comodidad</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group">
              <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-300">{step.icon}</div>
              <div className="absolute top-6 right-6 text-4xl font-black text-slate-50 opacity-10">0{idx + 1}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section id="contacto" className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-slate-900">¿Por qué elegir <span className="text-emerald-600">MIP Internacional</span>?</h2>

              <div className="space-y-6">
                {[
                  { t: 'Alcance Global', d: 'Conectamos tu maquinaria con una red extensa de compradores estratégicos.' },
                  { t: 'Precios de Mercado Reales', d: 'Garantizamos el valor justo de mercado en cada transacción mediante trading transparente.' },
                  { t: 'Logística Completa', d: 'Nos encargamos de la gestión, inspección y transporte de tus equipos.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.t}</h4>
                      <p className="text-slate-500 text-sm">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Cuéntanos qué quieres vender</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Nombre</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Teléfono</label>
                    <input
                      type="tel"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="+57 300..."
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Tipo de Maquinaria</label>
                  <select
                    title="Tipo de Maquinaria"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <option>Excavadoras</option>
                    <option>Camiones</option>
                    <option>Agrícola</option>
                    <option>Equipos de Pavimentación</option>
                    <option>Otros</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Mensaje</label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm h-32 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Describe brevemente tus equipos..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  Enviar Solicitud 💬
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sell;
