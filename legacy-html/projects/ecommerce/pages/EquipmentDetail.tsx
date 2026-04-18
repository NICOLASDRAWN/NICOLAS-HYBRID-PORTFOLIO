
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_EQUIPMENT } from '../mockData';
import { generateMachineryInsight } from '../services/geminiService';
import { Equipment } from '../types';

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Equipment | null>(null);
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const found = ALL_EQUIPMENT.find(e => e.id === id);
    if (found) {
      setItem(found);
      setLoadingInsight(true);
      generateMachineryInsight(found.name, found.brand).then(res => {
        setInsight(res || '');
        setLoadingInsight(false);
      });
    }
  }, [id]);

  if (!item) return <div className="p-20 text-center">Cargando equipo...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex mb-8 text-sm text-slate-500">
        <Link to="/" className="hover:text-emerald-600">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/inventory" className="hover:text-emerald-600">Inventario</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">{item.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-inner">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all">
                <img src={`https://picsum.photos/seed/${item.id}${i}/300/300`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info & Bidding */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">{item.brand}</span>
              <span className="text-slate-400 text-sm font-medium">{item.year}</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">{item.name}</h1>
            <p className="text-slate-500 flex items-center">
              <span className="mr-1">📍</span> {item.location}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">¿Interesado en este equipo?</h3>
              <p className="text-slate-500 text-sm">Contáctanos para recibir una cotización formal y detalles adicionales sobre la disponibilidad.</p>

              <button
                onClick={() => {
                  const phone = '573204080950';
                  const message = encodeURIComponent(`Hola, estoy interesado en recibir información y cotización del equipo: ${item.name}`);
                  import('../utils/analytics').then(({ trackConversion }) => trackConversion('whatsapp_click_detail'));
                  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                Solicitar Cotización 💬
              </button>
            </div>

            <p className="text-xs text-center text-slate-400">
              * Respuesta inmediata durante horario laboral.
            </p>
          </div>

          {/* AI Insights - Gemini Powered */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <span className="text-xl">✨</span>
              <h3 className="font-bold">Análisis Inteligente MIP Internacional</h3>
            </div>
            {loadingInsight ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-emerald-200 rounded w-full"></div>
                <div className="h-3 bg-emerald-200 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-sm text-emerald-900 leading-relaxed italic">
                "{insight}"
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Especificaciones Técnicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500">Fabricante</span>
            <span className="font-semibold text-slate-800">{item.brand}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500">Modelo</span>
            <span className="font-semibold text-slate-800">{item.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500">Año</span>
            <span className="font-semibold text-slate-800">{item.year}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500">Ubicación</span>
            <span className="font-semibold text-slate-800">{item.location}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500">Categoría</span>
            <span className="font-semibold text-slate-800">{item.category}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-100">
            <span className="text-slate-500">ID de Lote</span>
            <span className="font-semibold text-slate-800">#MIP-{item.id.toUpperCase()}</span>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Descripción de MIP INTERNACIONAL</h3>
          <p className="text-slate-600 leading-relaxed">
            {item.description} Equipamiento original completo. Sistema hidráulico comprobado sin fugas. Cabina con aire acondicionado funcional. Inspeccionado por nuestro equipo técnico de MIP Internacional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
