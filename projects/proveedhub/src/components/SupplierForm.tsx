import React, { useState } from 'react';
import { Supplier, SupplierCategory } from '../types';
import { Button } from './Button';
import { Save, X, Plus, Star } from 'lucide-react';

interface SupplierFormProps {
  initialData?: Supplier;
  onSave: (supplier: Supplier) => void;
  onCancel: () => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>(initialData || {
    name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    sectors: [],
    category: 'Servicios',
    rating: 3,
    status: 'Active',
    documents: []
  });
  const [sectorInput, setSectorInput] = useState('');

  const addSector = () => {
    if (sectorInput.trim()) {
      setFormData(prev => ({
        ...prev,
        sectors: [...(prev.sectors || []), sectorInput.trim()]
      }));
      setSectorInput('');
    }
  };

  const removeSector = (sectorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors?.filter(s => s !== sectorToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name) return;

    const newSupplier: Supplier = {
      id: initialData?.id || crypto.randomUUID(),
      documents: initialData?.documents || [],
      category: formData.category || 'Otros',
      rating: formData.rating || 0,
      ...formData as Supplier // Safe cast due to validation logic
    };
    onSave(newSupplier);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-w-3xl w-full mx-auto">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">
          {initialData ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Empresa</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sitio Web</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email de Contacto</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

           {/* Categoría y Calificación */}
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.category || 'Servicios'}
              onChange={e => setFormData({ ...formData, category: e.target.value as SupplierCategory })}
            >
              <option value="Servicios">Servicios</option>
              <option value="Suministros">Suministros</option>
              <option value="Alquileres">Alquileres</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Calificación</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`p-1 rounded-full transition-colors ${
                    (formData.rating || 0) >= star ? 'text-yellow-400 hover:text-yellow-500' : 'text-slate-300 hover:text-slate-400'
                  }`}
                >
                  <Star size={24} fill={(formData.rating || 0) >= star ? "currentColor" : "none"} />
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-500">{(formData.rating || 0)}/5</span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-700">Descripción y Servicios</label>
          </div>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
            placeholder="Describe qué hace este proveedor..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sectores / Etiquetas</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.sectors?.map((sector) => (
              <span key={sector} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {sector}
                <button
                  type="button"
                  onClick={() => removeSector(sector)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Agregar sector manualmente..."
              value={sectorInput}
              onChange={e => setSectorInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSector())}
            />
            <Button type="button" onClick={addSector} variant="secondary" icon={<Plus size={16}/>}>
              Añadir
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" icon={<Save size={18} />}>
            Guardar Proveedor
          </Button>
        </div>
      </form>
    </div>
  );
};