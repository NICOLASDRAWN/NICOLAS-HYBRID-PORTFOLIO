import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS } from '../mockData';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
    return (
        <div className="pb-20">
            <Helmet>
                <title>Blog y Recursos | MIP Internacional</title>
                <meta name="description" content="Noticias, guías y consejos sobre maquinaria pesada, mantenimiento y comercio exterior en Colombia." />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Recursos MIP</span>
                    <h1 className="text-4xl md:text-5xl font-black mt-4 mb-6">
                        Noticias y <span className="text-emerald-500">Actualidad</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Manténgase informado sobre las últimas tendencias en maquinaria pesada, infraestructura y logística internacional.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-400 text-sm font-medium mb-3">📅 {post.date}</p>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-emerald-600 font-bold text-sm hover:text-emerald-700"
                                >
                                    Leer artículo <span className="ml-1">→</span>
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Newsletter Signup (Placeholder) */}
                <div className="mt-20 bg-emerald-50 rounded-3xl p-8 md:p-12 text-center border border-emerald-100">
                    <h3 className="text-2xl font-black text-emerald-900 mb-4">Suscríbase a nuestro boletín</h3>
                    <p className="text-emerald-800 mb-8 max-w-xl mx-auto">
                        Reciba ofertas exclusivas, invitaciones a subastas y las últimas noticias del sector directamente en su correo.
                    </p>
                    <div className="flex max-w-md mx-auto gap-4 flex-col sm:flex-row">
                        <input
                            type="email"
                            placeholder="Su correo corporativo"
                            className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                            Suscribirse
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
