import React from 'react';
import { Helmet } from 'react-helmet-async';

const Maintenance: React.FC = () => {
    return (
        <div className="pb-20">
            <Helmet>
                <title>Mantenimiento de Maquinaria Pesada | MIP Internacional</title>
                <meta name="description" content="Servicio técnico especializado para maquinaria pesada. Mantenimiento preventivo, correctivo, pintura y reparación de componentes. Taller en Bogotá." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/Perforadora Sany SR285R.png"
                        alt="MIP Workshop"
                        className="w-full h-full object-cover opacity-40 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Soporte Técnico Especializado</span>
                        <h1 className="text-5xl md:text-7xl font-black leading-tight">
                            Mantenimiento y <br />
                            <span className="text-emerald-500">Reparación</span>
                        </h1>
                        <p className="text-xl text-emerald-50/90 max-w-2xl">
                            Prolongamos la vida útil de sus activos con estándares de fábrica. Técnicos certificados en Caterpillar, Sany, Zoomlion y XCMG.
                        </p>
                        <div className="pt-8 flex gap-4">
                            <button
                                onClick={() => window.open('https://wa.me/573204080950?text=Hola,%20necesito%20servicio%20técnico', '_blank')}
                                className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all"
                            >
                                Agendar Servicio
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                        {/* Service 1 */}
                        <div className="flex gap-6 items-start group">
                            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                🛠️
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900">Mantenimiento Preventivo</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Planes de servicio programado según horas de uso. Cambio de filtros, aceites y revisión multipunto para evitar paradas inesperadas.
                                </p>
                            </div>
                        </div>

                        {/* Service 2 */}
                        <div className="flex gap-6 items-start group">
                            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                🔧
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900">Reparación de Componentes</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Diagnóstico y reparación de motores, transmisiones, sistemas hidráulicos y trenes de rodaje.
                                </p>
                            </div>
                        </div>

                        {/* Service 3 */}
                        <div className="flex gap-6 items-start group">
                            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                🎨
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900">Pintura y Latonería</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Restauración estética completa con pintura industrial de alta resistencia y acabados originales.
                                </p>
                            </div>
                        </div>

                        {/* Service 4 */}
                        <div className="flex gap-6 items-start group">
                            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                🏃
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900">Servicio en Campo</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Carrotalleres equipados desplegados a cualquier zona del país para atender emergencias in situ.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Workshop Info */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[3rem] p-12 shadow-xl flex flex-col md:flex-row items-center gap-12 border border-slate-100">
                        <div className="md:w-1/2 space-y-8">
                            <h2 className="text-4xl font-black text-slate-900">Infraestructura Propia</h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Contamos con un taller central en Bogotá equipado con herramientas de diagnóstico electrónico de última generación, puente grúa y bancos de prueba hidráulicos.
                            </p>
                            <ul className="space-y-4">
                                {['Certificación ISO 9001', 'Stock de Repuestos Originales', 'Personal Capacitado en Fábrica'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                                        <span className="text-emerald-500">✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/2 h-80 rounded-3xl overflow-hidden relative">
                            <img src="/assets/products/Taller de mantenimiento.jpg" className="w-full h-full object-cover" alt="Taller MIP"
                                onError={(e) => { e.currentTarget.src = '/assets/sell-hero-bg.png' }}
                            />
                            <div className="absolute inset-0 bg-emerald-900/10"></div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Maintenance;
