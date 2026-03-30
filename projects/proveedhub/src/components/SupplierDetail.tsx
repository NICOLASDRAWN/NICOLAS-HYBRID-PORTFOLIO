import React, { useState } from 'react';
import { Supplier } from '../types';
import { DocumentsView } from './DocumentsView';
import { Button } from './Button';
import { SecurityModal } from './SecurityModal';
import { ArrowLeft, Globe, Phone, Mail, Tag, Star, Edit2, Trash2 } from 'lucide-react';

interface SupplierDetailProps {
  supplier: Supplier;
  onBack: () => void;
  onUpdate: (updated: Supplier) => void;
  onEdit: () => void;
  onDelete: (id: string, pin: string) => void;
}

export const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onUpdate, onEdit, onDelete }) => {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const handleConfirmDelete = (pin: string) => {
    onDelete(supplier.id, pin);
    setIsSecurityModalOpen(false);
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <SecurityModal 
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Proveedor"
        message={`Está a punto de eliminar permanentemente al proveedor "${supplier.name}" y todos sus documentos. Esta acción no se puede deshacer.`}
      />

      {/* Header */}
      <div className="border-b border-slate-200 px-8 py-6 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{supplier.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
              }`}>
                {supplier.status === 'Active' ? 'Activo' : 'Inactivo'}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-sm font-medium text-indigo-600">{supplier.category || 'General'}</span>
              <span className="text-slate-300">|</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < (supplier.rating || 0) ? "text-yellow-400 fill-current" : "text-slate-300"} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
           <Button 
             variant="ghost" 
             className="text-red-500 hover:text-red-700 hover:bg-red-50" 
             onClick={() => setIsSecurityModalOpen(true)}
             icon={<Trash2 size={18} />}
           >
             Eliminar
           </Button>
           <Button variant="secondary" onClick={onEdit} icon={<Edit2 size={16} />}>Editar</Button>
           <Button variant="primary" onClick={() => window.open(`mailto:${supplier.email}`)}>Contactar</Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Acerca de</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {supplier.description || "No hay descripción disponible."}
              </p>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <DocumentsView supplier={supplier} onUpdateSupplier={onUpdate} />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Información de Contacto</h2>
              <ul className="space-y-4">
                <li className="flex items-center text-slate-600">
                  <Mail size={18} className="mr-3 text-indigo-500" />
                  <span className="truncate">{supplier.email}</span>
                </li>
                <li className="flex items-center text-slate-600">
                  <Phone size={18} className="mr-3 text-indigo-500" />
                  <span>{supplier.phone}</span>
                </li>
                {supplier.website && (
                  <li className="flex items-center text-indigo-600 hover:underline cursor-pointer" onClick={() => window.open(supplier.website, '_blank')}>
                    <Globe size={18} className="mr-3" />
                    <span className="truncate">{supplier.website}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Sectors / Capabilities */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Sectores y Ayuda</h2>
              <p className="text-xs text-slate-500 mb-3">
                Áreas donde este proveedor puede ayudarnos.
              </p>
              <div className="flex flex-wrap gap-2">
                {supplier.sectors.length > 0 ? (
                  supplier.sectors.map(sector => (
                    <span key={sector} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      <Tag size={12} className="mr-1.5 text-slate-400" />
                      {sector}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">Sin sectores definidos</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};