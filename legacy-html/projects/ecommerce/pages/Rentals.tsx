import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Rentals: React.FC = () => {
    return (
        <div className="pb-20">
            <Helmet>
                <title>Alquiler de Maquinaria Pesada en Colombia | MIP Internacional</title>
                <meta name="description" content="Alquiler de excavadoras, grúas, cargadores y maquinaria amarilla en Bogotá y Colombia. Flota moderna y mantenimiento incluido." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/products/vibro de 22 Toneladas.png"
                        alt="MIP Rentals"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Soluciones Flexibles</span>
                        <h1 className="text-5xl md:text-7xl font-black leading-tight">
                            Alquiler de Maquinaria <br />
                            <span className="text-emerald-500">MIP RENTALS</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl">
                            Optimice sus costos operativos con nuestra flota de alquiler. Equipos certificados, mantenimiento incluido y disponibilidad inmediata para sus proyectos.
                        </p>
                        <div className="pt-8 flex gap-4">
                            <button
                                onClick={() => window.open('https://wa.me/573204080950?text=Hola,%20me%20interesa%20alquilar%20maquinaria', '_blank')}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                            >
                                Solicitar Cotización
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Sin Gastos de Mantenimiento', desc: 'Nosotros nos encargamos de todo el mantenimiento preventivo y correctivo.', icon: '🛠️' },
                            { title: 'Flexibilidad Operativa', desc: 'Contratos por días, semanas o meses según la duración de su obra.', icon: '📅' },
                            { title: 'Soporte en Sitio', desc: 'Técnicos especializados disponibles para garantizar la continuidad operativa.', icon: '👷' }
                        ].map((benefit, i) => (
                            <div key={i} className="text-center space-y-4 p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-500 transition-all group">
                                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                                <h3 className="text-2xl font-black text-slate-900">{benefit.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Equipment Categories for Rent */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900">Flota Disponible para Renta</h2>
                        <p className="text-slate-500 mt-4 text-lg">Consulte disponibilidad en tiempo real</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['Excavadoras', 'Grúas Telescópicas', 'Vibrocompactadores', 'Generadores', 'Manlift', 'Torres de Iluminación', 'Cargadores', 'Volquetas'].map((cat, i) => (
                            <Link
                                key={i}
                                to={`/inventory?category=${cat}`}
                                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200 hover:border-emerald-500 flex flex-col items-center text-center space-y-3"
                            >
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-2xl text-emerald-600 font-bold">
                                    {i + 1}
                                </div>
                                <h3 className="font-bold text-slate-900">{cat}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-emerald-900 py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black text-white">¿Necesita un equipo urgente?</h2>
                    <p className="text-emerald-100/80 text-xl">
                        Nuestro equipo de logística puede despachar maquinaria a cualquier punto del país en menos de 48 horas.
                    </p>
                    <button
                        onClick={() => window.open('https://wa.me/573204080950', '_blank')}
                        className="bg-white text-emerald-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-50 transition-all shadow-2xl"
                    >
                        Contactar Ahora 📞
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Rentals;
