import React, { useState, useEffect } from 'react';
import { Supplier, ViewState, SupplierCategory } from './types';
import { SupplierForm } from './components/SupplierForm';
import { SupplierDetail } from './components/SupplierDetail';
import { SyncView } from './components/SyncView';
import { Button } from './components/Button';
import { Toast, ToastType } from './components/Toast';
import { Plus, Search, Download, Star, ArrowDownAZ, Cloud } from 'lucide-react';
import { api } from './services/api';

function App() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  
  // Filtros y Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SupplierCategory | 'Todas'>('Todas');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');
  
  const [isLoading, setIsLoading] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{msg: string, type: ToastType} | null>(null);

  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ msg, type });
  };

  // Cargar datos al inicio
  useEffect(() => {
    api.getSuppliers()
      .then(data => {
        setSuppliers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
        showToast("Error cargando proveedores", 'error');
      });
  }, []);

  // Handlers
  const handleAddSupplier = async (newSupplier: Supplier) => {
    try {
      const savedSupplier = await api.createSupplier(newSupplier);
      setSuppliers(prev => [savedSupplier, ...prev]);
      setViewState(ViewState.LIST);
      showToast("Proveedor creado exitosamente");
    } catch (error) {
      console.error("Error creating supplier:", error);
      showToast("Error al crear el proveedor", 'error');
    }
  };

  const handleUpdateSupplier = async (updatedSupplier: Supplier) => {
    try {
      // Guardar cambios en el servidor
      await api.updateSupplier(updatedSupplier);
      
      // Actualizar estado local
      setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      
      // Si estábamos editando, cerrar el modal
      setEditingSupplier(null);
      setViewState(ViewState.LIST); // Volver a la lista o detalle
      showToast("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error updating supplier:", error);
      showToast("Error al guardar los cambios", 'error');
    }
  };

  const handleDeleteSupplier = async (id: string, pin: string) => {
    try {
      await api.deleteSupplier(id, pin);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      setViewState(ViewState.LIST);
      setSelectedSupplierId(null);
      showToast("Proveedor eliminado");
    } catch (error: any) {
      console.error("Error deleting supplier:", error);
      showToast(error.message || "Error al eliminar el proveedor", 'error');
    }
  };

  const openDetail = (id: string) => {
    setSelectedSupplierId(id);
    setViewState(ViewState.DETAIL);
  };

  const startEditing = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setViewState(ViewState.CREATE); // Forzar cambio de vista para mostrar el modal
  };

  // Excel Export
  const exportToCSV = () => {
    const headers = ["Nombre", "Categoría", "Calificación", "Email", "Teléfono", "Web", "Descripción", "Sectores"];
    
    const rows = suppliers.map(s => [
      `"${s.name}"`,
      `"${s.category || 'Otros'}"`,
      `"${s.rating || 0}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.website || ''}"`,
      `"${(s.description || '').replace(/"/g, '""')}"`,
      `"${(s.sectors || []).join(', ')}"`
    ]);

    const csvContent = "\uFEFF" + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "proveedores_mip.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering logic
  const filteredSuppliers = suppliers
    .filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sectors.some(sec => sec.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Todas' || s.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return (b.rating || 0) - (a.rating || 0); // Higher rating first
      }
    });

  // Render logic
  if (viewState === ViewState.SYNC) {
    return <SyncView onBack={() => setViewState(ViewState.LIST)} />;
  }

  if (viewState === ViewState.DETAIL && selectedSupplierId) {
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (supplier) {
      return (
        <SupplierDetail 
          supplier={supplier} 
          onBack={() => setViewState(ViewState.LIST)}
          onUpdate={handleUpdateSupplier}
          // @ts-ignore - prop missing in component definition but handled locally
          onEdit={() => startEditing(supplier)}
          onDelete={handleDeleteSupplier}
        />
      );
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewState(ViewState.LIST)}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Proveedores MIP</span>
            </div>
            <div className="flex items-center gap-4">
               <button 
                  onClick={() => setViewState(ViewState.SYNC)}
                  className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                  title="Sincronizar con Drive"
               >
                 <Cloud size={20} />
                 <span className="text-sm font-medium hidden sm:inline">Nube / Drive</span>
               </button>
               {/* Placeholder for user profile */}
               <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Proveedores</h1>
            <p className="text-slate-500">Organiza tus servicios, suministros y alquileres.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportToCSV} variant="secondary" icon={<Download size={18} />}>
              Exportar Excel
            </Button>
            <Button onClick={() => setViewState(ViewState.CREATE)} icon={<Plus size={18} />}>
              Nuevo Proveedor
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
           
           {/* Search & Sort */}
           <div className="flex flex-col sm:flex-row gap-4">
             <div className="relative flex-1 w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                  type="text" 
                  placeholder="Buscar por nombre o etiqueta..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <div className="flex gap-2">
                <select 
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}
                >
                  <option value="name">A-Z Nombre</option>
                  <option value="rating">Mejor Calificación</option>
                </select>
             </div>
           </div>

           {/* Category Tabs */}
           <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 border-b border-slate-100">
              {(['Todas', 'Servicios', 'Suministros', 'Alquileres'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* List View */}
        {viewState === ViewState.LIST && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <div 
                key={supplier.id} 
                onClick={() => openDetail(supplier.id)}
                className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 mb-2">
                        {supplier.category || 'Otros'}
                    </span>
                    <div className="flex items-center text-yellow-400">
                       <Star size={14} fill="currentColor" />
                       <span className="text-slate-600 text-xs ml-1 font-medium">{supplier.rating || 0}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{supplier.name}</h3>
                  
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">
                    {supplier.description || "Sin descripción."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {supplier.sectors.slice(0, 3).map(sector => (
                      <span key={sector} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {sector}
                      </span>
                    ))}
                    {supplier.sectors.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-400">
                        +{supplier.sectors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-50 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
                   <span className="text-xs text-slate-400 flex items-center gap-1">
                     {supplier.documents.length} docs
                   </span>
                   <span className="text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">Ver detalles &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {viewState === ViewState.LIST && filteredSuppliers.length === 0 && (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
             <p className="text-slate-400 text-lg">No se encontraron proveedores en esta categoría.</p>
             <Button variant="ghost" onClick={() => setViewState(ViewState.CREATE)} className="mt-4">
                Crear el primero
             </Button>
           </div>
        )}

        {/* Create/Edit Modal Overlay */}
        {(viewState === ViewState.CREATE || editingSupplier) && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="my-auto w-full max-w-3xl">
              <SupplierForm 
                initialData={editingSupplier || undefined}
                onSave={editingSupplier ? handleUpdateSupplier : handleAddSupplier} 
                onCancel={() => {
                    setViewState(ViewState.LIST);
                    setEditingSupplier(null);
                }} 
              />
            </div>
          </div>
        )}

      </main>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.msg} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

export default App;