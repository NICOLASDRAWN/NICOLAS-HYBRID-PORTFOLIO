import React, { useState, useMemo } from 'react';
import { useDb } from '../store/db';
import {
    Package, Search, Plus, Edit2, Save, X,
    Warehouse as WarehouseIcon, Trash2, Building2, Filter, ArrowRight, Layers, LayoutGrid, Info
} from 'lucide-react';
import { InventoryEntry, InventoryItem, Warehouse } from '../types';
import { toast } from 'sonner';
import { SearchableSelect } from '../components/SearchableSelect';
import { motion, AnimatePresence } from 'framer-motion';

const StatPill: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; delay?: number }> = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="flex-shrink-0 bg-white rounded-2xl md:rounded-[2rem] p-3 md:p-4 border border-slate-100 flex items-center gap-3 md:gap-4 shadow-sm hover:shadow-md transition-all group"
    >
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
            <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 md:mb-1">{title}</p>
            <p className="text-xs md:text-sm font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </motion.div>
);

export const Inventory: React.FC = () => {
    const {
        products, suppliers, settings, currentUser,
        inventoryItems, inventoryEntries, warehouses,
        receiveInventory, updateInventoryItem,
        addWarehouse, updateWarehouse, deleteWarehouse, isLoaded
    } = useDb();

    const [viewMode, setViewMode] = useState<'stock' | 'warehouses'>('stock');
    const [searchTerm, setSearchTerm] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('');

    const [editStockModalOpen, setEditStockModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [editStock, setEditStock] = useState(0);

    const [warehouseModalOpen, setWarehouseModalOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [warehouseForm, setWarehouseForm] = useState({
        name: '',
        code: '',
        address: '',
        description: ''
    });

    const isAdmin = currentUser?.role === 'Admin';
    const canReceive = currentUser?.permissions?.inventory_receive ?? (isAdmin || currentUser?.role === 'Almacenista' || currentUser?.role === 'Buyer');
    const canManageWarehouses = currentUser?.permissions?.inventory_manage_warehouses ?? isAdmin;

    const filteredInventory = useMemo(() => {
        return inventoryItems.filter(item => {
            const lower = searchTerm.toLowerCase();
            const matchesSearch =
                item.productName.toLowerCase().includes(lower) ||
                item.productCode.toLowerCase().includes(lower) ||
                item.supplierName?.toLowerCase().includes(lower);

            const matchesSupplier = !supplierFilter || item.supplierId === supplierFilter;
            const matchesWarehouse = !warehouseFilter || item.warehouseId === warehouseFilter;

            return matchesSearch && matchesSupplier && matchesWarehouse;
        });
    }, [inventoryItems, searchTerm, supplierFilter, warehouseFilter]);

    const stats = useMemo(() => {
        const totalStock = inventoryItems.reduce((acc, i) => acc + i.currentStock, 0);
        const lowStockItems = inventoryItems.filter(i => i.status === 'Bajo' || i.status === 'Agotado').length;
        return { totalStock, lowStockItems };
    }, [inventoryItems]);

    const handleOpenEditStock = (item: InventoryItem) => {
        setSelectedItem(item);
        setEditStock(item.currentStock);
        setEditStockModalOpen(true);
    };

    const handleSaveStock = async () => {
        if (!selectedItem) return;
        await updateInventoryItem(selectedItem.id, { currentStock: editStock });
        toast.success('Stock actualizado');
        setEditStockModalOpen(false);
    };

    const handleOpenWarehouse = (warehouse?: Warehouse) => {
        if (warehouse) {
            setEditingWarehouse(warehouse);
            setWarehouseForm({
                name: warehouse.name,
                code: warehouse.code,
                address: warehouse.address || '',
                description: warehouse.description || ''
            });
        } else {
            setEditingWarehouse(null);
            setWarehouseForm({ name: '', code: '', address: '', description: '' });
        }
        setWarehouseModalOpen(true);
    };

    const handleSaveWarehouse = async () => {
        if (!warehouseForm.name || !warehouseForm.code) {
            toast.error('Nombre y código son obligatorios');
            return;
        }

        if (editingWarehouse) {
            await updateWarehouse(editingWarehouse.id, warehouseForm);
            toast.success('Bodega actualizada');
        } else {
            await addWarehouse({
                ...warehouseForm,
                id: Date.now().toString(),
                isActive: true,
                createdAt: new Date().toISOString()
            });
            toast.success('Bodega creada');
        }
        setWarehouseModalOpen(false);
    };

    const handleDeleteWarehouse = async (id: string) => {
        if (confirm('¿Está seguro de eliminar esta bodega?')) {
            await deleteWarehouse(id);
            toast.success('Bodega eliminada');
        }
    };

    const getStockStatus = (item: InventoryItem) => {
        if (item.currentStock <= 0) return { label: 'Agotado', color: 'text-rose-600 bg-rose-50 border-rose-100' };
        if (item.currentStock < 5) return { label: 'Crítico', color: 'text-amber-600 bg-amber-50 border-amber-100' };
        return { label: 'En Stock', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
    };

    return (
        <div className="content-container section-spacing py-6">
            {/* Header section with executive feel */}
            <header className="space-y-8 px-2 md:px-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <Layers className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Control Operativo</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mobile-title">
                            Gestión de <span className="text-blue-600 italic">Existencias.</span>
                        </h1>
                        <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                            Monitoreo en tiempo real de niveles de inventario y optimización de centros de acopio.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setViewMode(viewMode === 'stock' ? 'warehouses' : 'stock')}
                            className="p-4 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                            title={viewMode === 'stock' ? 'Ver Bodegas' : 'Ver Stock'}
                        >
                            {viewMode === 'stock' ? <Building2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                        </button>
                        {canManageWarehouses && (
                            <button
                                onClick={() => handleOpenWarehouse()}
                                className="premium-button min-w-[180px]"
                            >
                                <Plus className="w-5 h-5" />
                                Nueva Bodega
                            </button>
                        )}
                    </div>
                </div>

                {/* Dashboard Stats in Glass Section */}
                <div className="premium-glass p-1.5 rounded-[2.5rem] flex flex-col lg:flex-row gap-2 no-print">
                    <div className="flex-1 grid grid-cols-2 gap-2 p-2">
                        <div className="bg-white/50 p-6 rounded-[2rem] border border-white/80 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Consolidado</p>
                                <h3 className="text-3xl font-black text-slate-950 tracking-tighter">{stats.totalStock.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-bold ml-1 uppercase">Unds</span></h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="bg-white/50 p-6 rounded-[2rem] border border-white/80 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nivel Crítico</p>
                                <h3 className="text-3xl font-black text-rose-600 tracking-tighter">{stats.lowStockItems} <span className="text-xs text-rose-400 font-bold ml-1 uppercase">Items</span></h3>
                            </div>
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                                <Info className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-[400px] p-2">
                        <div className="bg-slate-900 p-4 h-full rounded-[2rem] flex flex-col justify-center gap-2">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar en el inventario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-white/5 border-none rounded-[1.25rem] text-sm font-bold text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* List Components View Transition */}
            <AnimatePresence mode="wait">
                {viewMode === 'stock' ? (
                    <motion.div
                        key="stock-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 md:px-0"
                    >
                        {filteredInventory.map((item, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.03 }}
                                key={item.id}
                                className="premium-card p-6 flex flex-col h-full group mobile-card"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest ${getStockStatus(item).color}`}>
                                        {getStockStatus(item).label}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3 mb-8">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">#{item.productCode}</span>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">
                                            {warehouses.find(w => w.id === item.warehouseId)?.code || 'B-STD'}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight line-clamp-2">
                                        {item.productName}
                                    </h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Prov: {item.supplierName || 'MIP General'}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">En Almacén</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black text-slate-950 tracking-tighter">
                                                {item.currentStock}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">UND</span>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleOpenEditStock(item)}
                                            className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="warehouse-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0"
                    >
                        {warehouses.map((w, idx) => (
                            <motion.div
                                key={w.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="premium-card p-8 flex flex-col h-full group mobile-card"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-[1.25rem] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <WarehouseIcon className="w-7 h-7" />
                                    </div>
                                    {canManageWarehouses && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenWarehouse(w)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl shadow-sm"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteWarehouse(w.id)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-xl shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4 mb-10">
                                    <div>
                                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100 uppercase tracking-[0.2em]">
                                            CENTRO: #{w.code}
                                        </span>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase mt-4 tracking-tight leading-none group-hover:text-blue-600 transition-colors">{w.name}</h3>
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic line-clamp-2">
                                        {w.description || 'Punto de acopio estratégico para la red de suministros MIP.'}
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Building2 className="w-4 h-4" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">{w.address || 'Ubicación no especificada'}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Operativo</span>
                                    </div>
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODALS REFINED WITH PREMIUM STYLE */}
            <AnimatePresence>
                {editStockModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditStockModalOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-inner">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-slate-950 tracking-tighter uppercase">Actualizar <span className="text-blue-600">Stock</span></h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item: #{selectedItem.productCode}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Cantidades en Sistema</label>
                                    <div className="relative group">
                                        <Package className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500" />
                                        <input
                                            type="number" step="any"
                                            value={editStock}
                                            onChange={e => setEditStock(parseFloat(String(e.target.value).replace(/,/g, '.')))}
                                            className="native-input pl-16 py-5 text-2xl font-black font-mono"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setEditStockModalOpen(false)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Descartar</button>
                                    <button onClick={handleSaveStock} className="premium-button flex-[2] py-5">
                                        <Save className="w-5 h-5 text-blue-300" />
                                        Guardar Ajuste
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {warehouseModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWarehouseModalOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">{editingWarehouse ? 'Modificar' : 'Inscribir'} <span className="text-blue-600">Bodega</span></h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.20em]">Configuración de Centros de Acopio</p>
                                </div>
                                <button onClick={() => setWarehouseModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-950 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-10 overflow-y-auto space-y-8 scrollbar-hide pb-32">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nombre del Almacén <span className="text-rose-500">*</span></label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={warehouseForm.name}
                                            onChange={e => setWarehouseForm({ ...warehouseForm, name: e.target.value.toUpperCase() })}
                                            className="native-input px-8 py-5"
                                            placeholder="EJ: ALMACÉN CENTRAL BOGOTÁ"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Código Identificador <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            value={warehouseForm.code}
                                            onChange={e => setWarehouseForm({ ...warehouseForm, code: e.target.value.toUpperCase() })}
                                            className="native-input px-8 py-5"
                                            placeholder="SKU-B01"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Dirección Física</label>
                                        <input
                                            type="text"
                                            value={warehouseForm.address}
                                            onChange={e => setWarehouseForm({ ...warehouseForm, address: e.target.value.toUpperCase() })}
                                            className="native-input px-8 py-5"
                                            placeholder="CALLE 123 #45-67"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Descripción / Alcance</label>
                                        <textarea
                                            value={warehouseForm.description}
                                            onChange={e => setWarehouseForm({ ...warehouseForm, description: e.target.value })}
                                            className="native-input px-8 py-5 h-32 resize-none text-[13px]"
                                            placeholder="Detalle los tipos de materiales o áreas asignadas a esta bodega..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4 sticky bottom-0 z-10">
                                <button onClick={() => setWarehouseModalOpen(false)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Cancelar</button>
                                <button onClick={handleSaveWarehouse} className="premium-button flex-[2] py-5">
                                    <Save className="w-5 h-5 text-blue-300" />
                                    {editingWarehouse ? 'Actualizar Bodega' : 'Crear Centro de Acopio'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
