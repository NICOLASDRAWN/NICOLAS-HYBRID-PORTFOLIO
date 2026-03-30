import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PROJECT_STATS, CIVIL_WORKS, COLLABORATORS } from '../mockData';

const Projects: React.FC = () => {
    return (
        <div className="pb-20">
            <Helmet>
                <title>Proyectos y Casos de Éxito | MIP Internacional</title>
                <meta name="description" content="MIP Internacional participa en los proyectos de infraestructura más grandes de Colombia, incluyendo la Primera Línea del Metro de Bogotá." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/zoomlion-hero.png"
                        alt="MIP Projects"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Nuestra Huella</span>
                    <h1 className="text-5xl md:text-7xl font-black mt-4 mb-6">
                        Proyectos de <br />
                        <span className="text-emerald-500">Alto Impacto</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Desde 2018, hemos sido piezas clave en el desarrollo de la infraestructura nacional, aportando maquinaria, tecnología y experiencia técnica.
                    </p>
                </div>
            </section>

            {/* Featured Project: Metro de Bogotá */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-32 z-0 hidden lg:block"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm">
                                CASO DE ÉXITO DESTACADO
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                Primera Línea del <br />
                                <span className="text-emerald-600">Metro de Bogotá</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Como aliado estratégico del consorcio Metro Línea 1, MIP Internacional suministra maquinaria amarilla, grúas y soporte logístico para la construcción del viaducto y las estaciones. Nuestra participación garantiza el cumplimiento de los cronogramas en uno de los proyectos más ambiciosos de Latinoamérica.
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-4xl font-black text-emerald-500">{PROJECT_STATS.metroLine1.progress}</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">Avance de Obra (MIP)</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-4xl font-black text-emerald-500">{PROJECT_STATS.metroLine1.columns}</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">Columnas Ejecutadas</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-4xl font-black text-emerald-500">{PROJECT_STATS.metroLine1.distance}</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">Longitud del Tramo</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-400 uppercase">Aliados</p>
                                        <div className="flex -space-x-2 justify-center mt-2">
                                            {['🏗️', '🚜', '👷'].map((em, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs shadow-sm z-10">{em}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="bg-emerald-900 rounded-3xl p-8 text-white space-y-6 shadow-2xl">
                                    <h3 className="text-2xl font-bold">Alcance de Operación</h3>
                                    <ul className="space-y-4">
                                        {CIVIL_WORKS.map((work, idx) => (
                                            <li key={idx} className="flex gap-4 items-start">
                                                <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs shrink-0">✓</div>
                                                <div>
                                                    <p className="font-bold">{work.title}</p>
                                                    <p className="text-emerald-100/70 text-sm mt-1">{work.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collaborators Strip */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">Trabajamos con los grandes</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {COLLABORATORS.map((c, i) => (
                            <img key={i} src={c.logo} alt={c.name} className="h-10 md:h-12 w-auto object-contain" />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-5xl mx-auto px-4 py-24 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-6">¿Tiene un proyecto de infraestructura en mente?</h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                    Ponemos nuestra experiencia técnica y capacidad logística al servicio de su obra.
                </p>
                <button
                    onClick={() => {
                        import('../utils/analytics').then(({ trackConversion }) => trackConversion('whatsapp_click_projects'));
                        window.open('https://wa.me/573204080950?text=Hola,%20quisiera%20hablar%20sobre%20un%20proyecto', '_blank');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all"
                >
                    Contactar Departamento de Proyectos
                </button>
            </section>
        </div>
    );
};

export default Projects;
