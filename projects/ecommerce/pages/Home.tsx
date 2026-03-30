
import React, { useState } from 'react';
import { CATEGORIES, FEATURED_EQUIPMENT, UPCOMING_AUCTIONS, COLLABORATORS, TEAM_STATS, SERVICES, KEY_DIFFERENTIATORS } from '../mockData';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/inventory?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/inventory');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <Helmet>
        <title>Venta y Renta de Maquinaria Pesada en Colombia | MIP Internacional</title>
        <meta name="description" content="Líderes en venta y alquiler de maquinaria pesada en Colombia. Excavadoras, grúas y equipos para infraestructura. Respaldo técnico y garantía." />
        <meta name="keywords" content="venta maquinaria pesada, alquiler maquinaria, excavadoras colombia, gruas bogota, xcmg, sany, zoomlion" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center overflow-hidden bg-[#0A1A14]">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/zoomlion-hero.png"
            className="w-full h-full object-cover object-[70%_center] sm:object-[center_right] opacity-60"
            alt="Maquinaria Pesada Colombia"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A14] via-[#0A1A14]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A14] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
          <div className="max-w-3xl space-y-6 md:space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-emerald-400 font-bold text-xs sm:text-sm tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>ALIADOS ESTRATÉGICOS EN INFRAESTRUCTURA</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.1]">
              Venta y Renta de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Maquinaria Pesada
              </span> <br />
              en Colombia
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-emerald-50/80 leading-relaxed font-medium max-w-2xl">
              Expertos en el suministro de equipos para grandes proyectos de infraestructura, minería y construcción. Garantizamos respaldo técnico y disponibilidad inmediata.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/inventory" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-4 rounded-xl font-black text-lg transition-all shadow-lg hover:shadow-emerald-500/20 text-center">
                Ver Catálogo
              </Link>
              <button
                onClick={() => window.open('https://wa.me/573204080950', '_blank')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur text-center"
              >
                Cotizar Proyecto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[
            { label: 'Máquinas Vendidas', val: '+500', icon: '🚜' },
            { label: 'Proyectos Activos', val: '12', icon: '🏗️' },
            { label: 'Años Experiencia', val: '6+', icon: '📅' },
            { label: 'Satisfacción', val: '100%', icon: '⭐' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-emerald-100 shadow-xl shadow-slate-200/50">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-3xl font-black text-slate-900">{stat.val}</p>
              <p className="text-xs font-bold text-emerald-600 uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why MIP Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">¿Por qué elegir a MIP?</h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Mas que proveedores, somos socios estratégicos para el éxito de su obra.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {KEY_DIFFERENTIATORS.map((diff, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 Hover:border-emerald-500 transition-all text-center">
              <div className="text-4xl mb-4">{diff.icon}</div>
              <h3 className="font-bold text-slate-900 text-sm">{diff.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Services Summary */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Nuestros Servicios</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-2">Soluciones Integrales 360°</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.slice(0, 3).map((service, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm mb-6">{service.desc}</p>
                <Link to="/services" className="text-emerald-400 font-bold text-sm flex items-center hover:underline">
                  Más información <span className="ml-2">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators Section */}
      <section className="py-12 bg-white overflow-hidden border-b border-slate-100">
        {/* ... (Collaborators content same as before) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Confían en Nosotros</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {COLLABORATORS.map((partner, idx) => (
              <img
                key={idx}
                src={partner.logo}
                alt={partner.name}
                className="h-8 sm:h-12 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid (Existing) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-8 md:mb-10 gap-3 sm:gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Nuestras Líneas</h2>
            <p className="text-slate-500 text-base sm:text-lg mt-1">Especialistas en cada sector industrial</p>
          </div>
          <Link to="/inventory" className="bg-emerald-50 text-emerald-700 px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-emerald-100 transition-colors text-sm sm:text-base">
            Ver Inventario Completo &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/inventory?category=${cat.name}`}
              className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-emerald-500 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-emerald-50 rounded-bl-2xl sm:rounded-bl-3xl -mr-6 sm:-mr-8 -mt-6 sm:-mt-8 group-hover:bg-emerald-500 transition-colors"></div>
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 md:mb-6 relative z-10 group-hover:scale-125 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base md:text-lg relative z-10">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="bg-slate-900 py-12 sm:py-16 md:py-24 relative overflow-hidden mt-16">
        <div className="absolute top-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-10 md:mb-12 gap-3">
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-black">Equipos Destacados</h2>
              <p className="text-slate-400 text-base sm:text-lg mt-1 sm:mt-2">Maquinaria de última generación bajo estándares internacionales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_EQUIPMENT.map(item => (
              <Link
                key={item.id}
                to={`/equipment/${item.id}`}
                className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all group"
              >
                <div className="relative h-56">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-emerald-500 text-emerald-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    DISPONIBLE
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-xl line-clamp-1">{item.name}</h3>
                    <p className="text-emerald-400 font-bold text-sm uppercase">{item.brand}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Año</p>
                      <p className="text-white font-bold">{item.year}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Ubicación</p>
                      <p className="text-white font-bold truncate">{item.location}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const phone = '573204080950';
                        const message = encodeURIComponent(`Hola, estoy interesado en cotizar el equipo: ${item.name}`);
                        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 py-3 rounded-2xl font-black text-sm transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Solicitar Cotización 💬
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-600 rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-16 lg:p-24 text-center text-white space-y-6 sm:space-y-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-400 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20 group-hover:rotate-45 transition-transform duration-1000"></div>

          <div className="relative z-10 space-y-4 sm:space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              ¿Listo para potenciar <br className="hidden md:block" /> tus operaciones?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto font-medium leading-relaxed">
              En MIP INTERNACIONAL TRADING SAS garantizamos transacciones rápidas, seguras y transparentes. Únete a las principales empresas que confían en nuestra experiencia internacional.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-4 sm:pt-8">
              <Link to="/sell" className="bg-white text-emerald-700 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
                Vender Maquinaria
              </Link>
              <button
                onClick={() => window.open('https://wa.me/573204080950', '_blank')}
                className="bg-emerald-700/50 backdrop-blur-md text-white border-2 border-emerald-400 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl hover:bg-emerald-700 transition-all hover:-translate-y-1 active:scale-95"
              >
                Hablar con Consultor
              </button>
            </div>
            <p className="text-emerald-300 font-bold pt-2 sm:pt-4 text-xs sm:text-sm uppercase tracking-widest">Soporte Técnico Especializado en toda Colombia</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
