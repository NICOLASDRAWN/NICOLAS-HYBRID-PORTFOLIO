import React, { useState, useMemo } from 'react';
import { useDb } from '../store/db';
import { CostCenter, PurchaseOrder } from '../types';
import { LayoutGrid, Plus, Search, Edit2, Trash2, Save, X, Hash, Tags, Upload, FileSpreadsheet, Layers, ArrowRight, DollarSign, PieChart, Info, Download } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const StatPill: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; delay?: number }> = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="flex-shrink-0 bg-white rounded-[2rem] p-4 border border-slate-100 flex items-center gap-4 shadow-sm"
    >
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
            <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </motion.div>
);

export const CostCenters: React.FC = () => {
    const { costCenters, addCostCenter, updateCostCenter, deleteCostCenter, currentUser, importCostCenters, orders, settings } = useDb();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCC, setSelectedCC] = useState<CostCenter | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const [formData, setFormData] = useState<Partial<CostCenter>>({
        code: '',
        name: ''
    });

    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Buyer' || currentUser?.role === 'Approver';
    const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Buyer';

    const filteredCostCenters = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return costCenters.filter(cc =>
            cc.name.toLowerCase().includes(lower) ||
            cc.code.toLowerCase().includes(lower)
        ).sort((a, b) => a.code.localeCompare(b.code));
    }, [costCenters, searchTerm]);

    const ccStats = useMemo(() => {
        const stats: Record<string, { total: number, count: number }> = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (item.costCenterId) {
                    if (!stats[item.costCenterId]) stats[item.costCenterId] = { total: 0, count: 0 };
                    // Calculate item fraction of total or just item subtotal
                    const rate = item.taxRate === 'custom' ? (item.customTaxRate || 0) / 100 : (item.taxRate || 0);
                    const itemTotal = (item.quantity * item.unitPrice) * (1 + rate);
                    stats[item.costCenterId].total += itemTotal;
                    stats[item.costCenterId].count += 1;
                }
            });
        });
        return stats;
    }, [orders]);

    const handleEdit = (cc: CostCenter) => {
        setFormData(cc);
        setEditingId(cc.id);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.code) {
            toast.error("Datos incompletos");
            return;
        }

        try {
            if (editingId) {
                await updateCostCenter(editingId, formData);
                toast.success("Estructura actualizada");
            } else {
                await addCostCenter({
                    id: Date.now().toString(),
                    ...formData as CostCenter
                });
                toast.success("Centro de costo registrado");
            }
            setIsModalOpen(false);
            setEditingId(null);
        } catch (err) {
            toast.error("Error al guardar");
        }
    };

    const handleDelete = async (cc: CostCenter) => {
        if (!window.confirm(`¿Eliminar "${cc.name}"?`)) return;
        try { await deleteCostCenter(cc.id); toast.success("Eliminado"); } catch (err) { toast.error("Error"); }
    };

    const handleViewDetail = (cc: CostCenter) => {
        setSelectedCC(cc);
        setIsDetailModalOpen(true);
    };

    const ccOrders = useMemo(() => {
        if (!selectedCC) return [];
        return orders.filter(o => o.items.some(i => i.costCenterId === selectedCC.id));
    }, [selectedCC, orders]);

    const exportCCDetail = () => {
        if (!selectedCC) return;
        const data = ccOrders.map(o => ({
            Orden: o.sequenceNumber,
            Fecha: new Date(o.date).toLocaleDateString(),
            Proveedor: o.supplierName,
            Estado: o.status,
            Total: o.total
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cargas");
        XLSX.writeFile(wb, `Reporte_CC_${selectedCC.code}.xlsx`);
    };

    return (
        <div className="content-container section-spacing py-6">

            {/* Native Style Header */}
            <section className="space-y-3 md:space-y-6 px-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mobile-title">
                            Centros <span className="text-emerald-600">Costos</span>
                        </h1>
                        <p className="text-[7.5px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5 md:mt-2">Distribución Logística</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsImportModalOpen(true)} title="Importar desde Excel" className="p-3 md:p-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-600">
                            <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        {canEdit && (
                            <button
                                onClick={() => { setEditingId(null); setFormData({ code: '', name: '' }); setIsModalOpen(true); }}
                                title="Registrar nuevo centro de costo"
                                className="px-5 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden md:inline">Nuevo CC</span><span className="md:hidden text-[10px]">Nuevo</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scrollbar-hide">
                    <StatPill title="Activos" value={costCenters.length} icon={LayoutGrid} color="bg-emerald-600" delay={0.1} />
                    <StatPill title="Ejecución" value={`${settings.currencySymbol}${Math.round(orders.reduce((a, b) => a + b.total, 0) / 1000).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}k`} icon={DollarSign} color="bg-blue-600" delay={0.2} />
                    <StatPill title="Eficiencia" value="94%" icon={PieChart} color="bg-indigo-600" delay={0.3} />
                </div>
            </section>

            <section className="sticky top-0 md:relative z-40 bg-[#f8fafc]/80 backdrop-blur-3xl py-2 -mx-2 px-2 md:m-0 md:p-0">
                <div className="relative group max-w-2xl">
                    <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-emerald-600 transition-all" />
                    <input
                        type="text"
                        placeholder="Buscar centro..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3.5 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-[2rem] font-black text-[11px] md:text-sm outline-none shadow-sm hover:shadow-md focus:shadow-xl focus:border-emerald-500 transition-all"
                    />
                </div>
            </section>

            <section className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredCostCenters.map((cc, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            key={cc.id}
                            onClick={() => handleViewDetail(cc)}
                            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col cursor-pointer mobile-card"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-emerald-50/50 rounded-bl-full -mr-10 -mt-10 md:-mr-16 md:-mt-16 z-0 group-hover:bg-emerald-100 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4 md:mb-8">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-600 transition-all shadow-inner">
                                        <Layers className="w-5 h-5 md:w-8 md:h-8 text-slate-300 group-hover:text-white transition-all" />
                                    </div>
                                    <div className="flex gap-2">
                                        {canEdit && (
                                            <>
                                                <button onClick={() => handleEdit(cc)} title="Editar Estructura" className="p-2.5 md:p-3 bg-white/80 backdrop-blur-xl text-slate-400 rounded-lg md:rounded-xl hover:text-blue-600 shadow-sm border border-slate-50 transition-all">
                                                    <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(cc)} title="Anular Estructura" className="p-2.5 md:p-3 bg-white/80 backdrop-blur-xl text-slate-400 rounded-lg md:rounded-xl hover:text-rose-600 shadow-sm border border-slate-50 transition-all">
                                                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 mb-4 md:mb-8">
                                    <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                                        <span className="text-[7px] md:text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest">{cc.code}</span>
                                    </div>
                                    <h3 className="text-base md:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase leading-tight tracking-tight line-clamp-2 md:line-clamp-none">{cc.name}</h3>
                                </div>

                                <div className="pt-3 md:pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[6.5px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Cargas</p>
                                        <p className="text-base md:text-lg font-black font-mono text-slate-900 tracking-tighter">
                                            {settings.currencySymbol}{Number(ccStats[cc.id]?.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-widest">{ccStats[cc.id]?.count || 0} ITEMS</span>
                                        <div className="mt-0.5 flex items-center gap-1 group-hover:text-blue-600 transition-all">
                                            <span className="text-[8px] md:text-[9px] font-black uppercase">Info</span>
                                            <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {/* DETAIL MODAL - Review Charges */}
            <AnimatePresence>
                {isDetailModalOpen && selectedCC && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <LayoutGrid className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Análisis de Centro de Costo</p>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedCC.name} <span className="text-emerald-600">({selectedCC.code})</span></h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={exportCCDetail} title="Exportar Reporte Excel" className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                        <Download className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => setIsDetailModalOpen(false)} title="Cerrar Análisis" className="p-4 bg-slate-50 text-slate-300 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Ejecutado</p>
                                        <p className="text-4xl font-black text-emerald-900 font-mono tracking-tighter">{settings.currencySymbol}{Number(ccStats[selectedCC.id]?.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-blue-50 border border-blue-100">
                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Ordenes Relacionadas</p>
                                        <p className="text-4xl font-black text-blue-900 font-mono tracking-tighter">{ccStats[selectedCC.id]?.count || 0}</p>
                                    </div>
                                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Estatus Sistema</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-2xl font-black text-slate-900 uppercase">Activo</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 mb-4">Historial de Cargas</h4>
                                    <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">ID Orden</th>
                                                    <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Proveedor</th>
                                                    <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                                    <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {ccOrders.map(o => (
                                                    <tr key={o.id} className="hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => navigate(`/create-order?id=${o.id}`)}>
                                                        <td className="px-6 py-4">
                                                            <div className="text-[10px] font-black text-slate-900">ORD #{o.sequenceNumber || '---'}</div>
                                                            <div className="text-[8px] text-slate-400 font-bold uppercase">{new Date(o.date).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-[10px] font-black text-slate-700 uppercase truncate max-w-[200px]">{o.supplierName}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">{o.status}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-[11px] font-black text-slate-900 font-mono">
                                                            {settings.currencySymbol}{Math.round(o.items.filter(i => i.costCenterId === selectedCC.id).reduce((sum, i) => sum + i.total, 0)).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {ccOrders.length === 0 && (
                                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest">Sin movimientos registrados</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FORM MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">{editingId ? 'Editar' : 'Nuevo'} <span className="text-emerald-600">Centro</span></h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Código Identificador</label>
                                    <div className="relative">
                                        <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input type="text" placeholder="CC-001" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre / Descripción</label>
                                    <div className="relative">
                                        <Tags className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input type="text" placeholder="OPERACIONES BOGOTÁ" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all" />
                                    </div>
                                </div>
                                <div className="pt-4 grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancelar</button>
                                    <button type="submit" className="py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Guardar</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* IMPORT MODAL */}
            <AnimatePresence>
                {isImportModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsImportModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl p-12 text-center">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><FileSpreadsheet className="w-10 h-10" /></div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Carga Masiva</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Maestro Centros de Costo</p>
                            <label className="flex flex-col items-center gap-6 p-10 border-4 border-dashed border-slate-50 rounded-[2.5rem] cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-200 transition-all active:scale-95">
                                <Upload className="w-12 h-12 text-slate-200" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seleccionar Archivo</span>
                                <input type="file" accept=".xlsx, .xls, .csv" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setIsImporting(true);
                                        await importCostCenters(file);
                                        setIsImporting(false);
                                        setIsImportModalOpen(false);
                                        toast.success("Estructura importada exitosamente");
                                    }
                                }} className="hidden" />
                            </label>
                            {isImporting && (<div className="mt-8 flex items-center justify-center gap-2"><div className="w-4 h-4 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /><span className="text-[10px] font-black uppercase">Sincronizando...</span></div>)}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
