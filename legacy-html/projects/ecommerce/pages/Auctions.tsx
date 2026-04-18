
import React from 'react';
import { UPCOMING_AUCTIONS } from '../mockData';

const Auctions: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900">Calendario de Subastas</h1>
        <p className="text-slate-500 mt-2">No te pierdas ninguna oportunidad. Regístrate en nuestros próximos eventos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Filtrar Eventos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Ubicación</label>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-slate-600">
                    <input type="checkbox" className="mr-2 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" defaultChecked />
                    España
                  </label>
                  <label className="flex items-center text-sm text-slate-600">
                    <input type="checkbox" className="mr-2 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    Europa
                  </label>
                  <label className="flex items-center text-sm text-slate-600">
                    <input type="checkbox" className="mr-2 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    Sólo Online
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo de Subasta</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                  <option>Todas</option>
                  <option>Construcción</option>
                  <option>Agricultura</option>
                  <option>Camiones</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <h4 className="font-bold text-emerald-900 mb-2">Alertas de Subastas</h4>
            <p className="text-xs text-emerald-700 mb-4">Recibe un aviso cuando se publiquen nuevos inventarios en tu zona.</p>
            <input type="email" placeholder="Tu email..." className="w-full bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm mb-2" />
            <button className="w-full bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors">Suscribirse</button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-8">
          {UPCOMING_AUCTIONS.map(auction => (
            <div key={auction.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row">
              <div className="lg:w-1/3 h-56 lg:h-auto">
                <img src={auction.imageUrl} alt={auction.title} className="w-full h-full object-cover" />
              </div>
              <div className="lg:w-2/3 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">PRESENCIAL Y ONLINE</span>
                      <span className="text-slate-400 text-xs font-medium">{auction.date}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{auction.title}</h3>
                    <p className="text-slate-500 flex items-center mt-1">
                      <span className="mr-1">📍</span> {auction.location}
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-3xl font-black text-emerald-600">{auction.itemCount}+</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Equipos listados</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                  <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex-grow sm:flex-grow-0">
                    Regístrate para Pujar
                  </button>
                  <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-grow sm:flex-grow-0">
                    Ver Inventario
                  </button>
                  <button className="p-3 text-slate-400 hover:text-emerald-600 transition-colors hidden sm:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center">
            <p className="text-slate-500 italic text-sm">"Más fechas de subastas internacionales y eventos especiales próximamente."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auctions;
