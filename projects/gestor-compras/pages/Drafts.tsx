import React, { useState, useMemo } from 'react';
import { useDb } from '../store/db';
import { PurchaseOrder } from '../types';
import {
    FileText, Edit2, Trash2, Search, Calendar, DollarSign,
    User, Package, AlertCircle, Clock, ArrowRight, Trash,
    Plus, History, Filter, Star, LayoutGrid, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const Drafts: React.FC = () => {
    const { orders, deleteOrder, settings, suppliers, currentUser } = useDb();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter only draft orders
    const draftOrders = useMemo(() => {
        return orders
            .filter(o => o.status === 'Draft')
            .sort((a, b) => {
                const seqA = a.sequenceNumber || 0;
                const seqB = b.sequenceNumber || 0;
                if (seqA !== seqB) return seqB - seqA;
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
    }, [orders]);

    // Filter drafts based on search
    const filteredDrafts = useMemo(() => {
        if (!searchTerm) return draftOrders;
        const lower = searchTerm.toLowerCase();
        return draftOrders.filter(draft =>
            draft.supplierName.toLowerCase().includes(lower) ||
            (draft.sequenceNumber?.toString() || '').includes(lower) ||
            draft.quoteNumber?.toLowerCase().includes(lower)
        );
    }, [draftOrders, searchTerm]);

    const handleContinue = (draftId: string) => {
        navigate(`/create-order?id=${draftId}`);
    };

    const handleDelete = async (draft: PurchaseOrder) => {
        if (confirm(`¿Está seguro de eliminar el borrador #${draft.sequenceNumber || 'TEMP'}?`)) {
            try {
                await deleteOrder(draft.id);
                toast.success('Borrador eliminado correctamente');
            } catch (error) {
                toast.error('Error al eliminar el borrador');
            }
        }
    };

    // Get reserved sequences (sequences from drafts)
    const reservedSequences = useMemo(() => {
        return draftOrders.map(d => d.sequenceNumber).filter(Boolean).sort((a, b) => (a as any) - (b as any));
    }, [draftOrders]);

    const canModifyDraft = (draft: PurchaseOrder) => {
        if (currentUser?.role === 'Admin' || currentUser?.role === 'Buyer') return true;
        return draft.requestedById === currentUser?.id;
    };

    return (
        <div className="content-container section-spacing py-6">

            {/* Header Section */}
            <section className="px-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <div className="w-6 md:w-8 h-1 bg-amber-500 rounded-full" />
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Archivos Temporales</span>
                        </div>
                        <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mobile-title">
                            Gestionar <span className="text-amber-500">Borradores</span>
                        </h1>
                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 md:mt-2">
                            {filteredDrafts.length} borrador{filteredDrafts.length !== 1 ? 'es' : ''} en espera
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create-order')}
                        className="w-full md:w-auto px-6 md:px-10 py-3.5 md:py-5 bg-slate-900 text-white rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" /> Nueva Orden
                    </button>
                </div>
            </section>

            {/* Info Card for Reserved Sequences */}
            {reservedSequences.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50/50 border border-amber-100 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Layers className="w-32 h-32 text-amber-600" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                            <History className="w-10 h-10" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Consecutivos Reservados</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Números de orden actualmente bloqueados por estos borradores:</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {reservedSequences.map(seq => (
                                    <span key={seq} className="px-5 py-2 bg-white border border-amber-200 text-amber-600 rounded-xl text-xs font-black font-mono shadow-sm">
                                        #{seq}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Search & Filter Bar */}
            <section className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl md:rounded-[2.5rem] p-3 md:p-4 shadow-xl">
                <div className="relative group">
                    <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-300 group-focus-within:text-amber-500 transition-all" />
                    <input
                        type="text"
                        placeholder="Buscar borrador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 md:pl-16 pr-4 md:pr-8 py-3.5 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-[2rem] font-black text-[11px] md:text-sm outline-none shadow-sm focus:shadow-xl focus:border-amber-400 transition-all"
                    />
                </div>
            </section>

            {/* Drafts Grid */}
            <section>
                {filteredDrafts.length === 0 ? (
                    <div className="py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-10 h-10 text-slate-200" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Charola Vacía</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">No hay borradores que coincidan con tu búsqueda</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredDrafts.map((draft, idx) => (
                                <motion.div
                                    key={draft.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full mobile-card"
                                >
                                    <div className="absolute top-0 right-0 p-6 md:p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <Edit2 className="w-16 h-16 md:w-24 md:h-24 text-slate-900" />
                                    </div>

                                    <div className="flex justify-between items-start mb-6 md:mb-8">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-50 rounded-xl md:rounded-[1.5rem] flex flex-col items-center justify-center text-amber-600 shadow-inner">
                                            <span className="text-[8px] md:text-[10px] font-black opacity-50">RES</span>
                                            <span className="text-sm md:text-lg font-black font-mono">#{draft.sequenceNumber || '---'}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(draft)}
                                                className="p-2.5 md:p-3 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl md:rounded-2xl transition-all shadow-sm"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleContinue(draft.id)}
                                                className="p-2.5 md:p-3 bg-slate-900 text-white hover:bg-black rounded-xl md:rounded-2xl transition-all shadow-xl"
                                                title="Continuar"
                                            >
                                                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-2 mb-6 md:mb-8 flex-1">
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Iniciada: {new Date(draft.date).toLocaleDateString()}</p>
                                        </div>
                                        <h4 className="text-base md:text-xl font-black text-slate-900 uppercase leading-tight line-clamp-2">{draft.supplierName}</h4>
                                        {draft.quoteNumber && (
                                            <div className="inline-flex px-2 md:px-3 py-0.5 md:py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                Cot: {draft.quoteNumber}
                                            </div>
                                        )}
                                    </div>

                                    {/* Items Mini-list */}
                                    <div className="mb-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Lista de Items ({draft.items.length})</p>
                                        <div className="flex flex-wrap gap-2">
                                            {draft.items.slice(0, 2).map((item, idx) => (
                                                <span key={idx} className="px-2.5 py-1 bg-white border border-slate-100 text-[9px] font-bold text-slate-600 rounded-lg uppercase truncate max-w-[120px]">
                                                    {item.productName}
                                                </span>
                                            ))}
                                            {draft.items.length > 2 && (
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg">
                                                    +{draft.items.length - 2} más
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 md:pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Estimado</p>
                                            <p className="text-lg md:text-2xl font-black font-mono text-slate-900 tracking-tighter">{settings.currencySymbol}{Number(draft.total).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 md:gap-2">
                                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center bg-slate-200 text-slate-500 text-[7px] md:text-[8px] font-black truncate`}>
                                                {draft.requestedByName?.charAt(0) || <User className="w-3 h-3" />}
                                            </div>
                                            <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[60px] md:max-w-[80px]">
                                                {draft.requestedByName?.split(' ')[0] || 'System'}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
};
