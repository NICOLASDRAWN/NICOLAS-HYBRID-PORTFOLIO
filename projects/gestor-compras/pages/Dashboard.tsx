import React, { useMemo, useState } from 'react';
import { useDb } from '../store/db';
import {
  Package, Clock, CheckCircle, Search, X, ChevronRight,
  Plus, AlertCircle, Activity, Globe, Download, Sparkles, ShieldCheck,
  FileText, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PurchaseOrder } from '../types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

/* ──────────────── Quick Comment Modal ──────────────── */
const QuickCommentModal: React.FC<{ order: PurchaseOrder; onClose: () => void; onSave: (text: string) => void }> = ({ order, onClose, onSave }) => {
  const [text, setText] = useState('');
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Activity className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Nota <span className="text-blue-600">Interna</span></h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ORD #{order.sequenceNumber}</p>
          </div>
        </div>
        <textarea autoFocus value={text} onChange={e => setText(e.target.value)}
          placeholder="Escribe un comentario en el historial de esta orden..."
          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px] mb-4 resize-none" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
          <button onClick={() => { onSave(text); onClose(); }} disabled={!text.trim()}
            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black disabled:opacity-30 transition-all">
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ──────────────── Status Badge ──────────────── */
const getStatusConfig = (status: PurchaseOrder['status']) => {
  const map: Record<string, { bg: string; text: string; icon: React.ElementType; label: string; ring: string }> = {
    Draft: { bg: 'bg-slate-100', text: 'text-slate-500', icon: FileText, label: 'Borrador', ring: 'ring-slate-200' },
    Pending: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock, label: 'Pendiente', ring: 'ring-amber-200' },
    Approved: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle, label: 'Aprobado', ring: 'ring-emerald-200' },
    ChangeRequested: { bg: 'bg-rose-50', text: 'text-rose-600', icon: AlertCircle, label: 'Cambio', ring: 'ring-rose-200' },
    Anulada: { bg: 'bg-slate-900', text: 'text-white', icon: X, label: 'Anulada', ring: 'ring-slate-700' },
    AcuerdoComercial: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: Globe, label: 'Acuerdo', ring: 'ring-indigo-200' },
  };
  return map[status] ?? map.Draft;
};

/* ──────────────── Order Card ──────────────── */
const OrderCard: React.FC<{
  order: PurchaseOrder;
  idx: number;
  canManage: boolean;
  currentUserId?: string;
  currencySymbol: string;
  onComment: (o: PurchaseOrder) => void;
  onCycleStatus: (e: React.MouseEvent, o: PurchaseOrder) => void;
  onCycleLogistics: (e: React.MouseEvent, o: PurchaseOrder) => void;
  onQuickSign: (e: React.MouseEvent, o: PurchaseOrder) => void;
  onNavigate: (id: string) => void;
}> = ({ order, idx, canManage, currentUserId, currencySymbol, onComment, onCycleStatus, onCycleLogistics, onQuickSign, onNavigate }) => {
  const sc = getStatusConfig(order.status);
  const Icon = sc.icon;

  const logisticsLabel = order.occStatus === 'Entregado' ? '🚚 Entregado'
    : order.occStatus === 'EnProceso' ? '🔄 En Proceso'
      : '📦 Pendiente';

  const logisticsClass = order.occStatus === 'Entregado'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : order.occStatus === 'EnProceso'
      ? 'bg-blue-50 text-blue-600 border-blue-200'
      : 'bg-slate-50 text-slate-400 border-slate-200';

  // Can this user sign? Only if order is Pending and user is in the approvals list and hasn't signed yet
  const pendingApproval = order.status === 'Pending' &&
    Array.isArray(order.approvals) &&
    order.approvals.some(a => a.userId === currentUserId && !a.approved);

  const accentColor = order.status === 'Approved' ? 'bg-emerald-500'
    : order.status === 'Pending' ? 'bg-amber-400'
      : order.status === 'Anulada' ? 'bg-slate-800'
        : order.status === 'ChangeRequested' ? 'bg-rose-500'
          : 'bg-slate-200';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: idx * 0.04 }}
      onClick={() => onNavigate(order.id)}
      className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-100 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${accentColor}`} />

      <div className="flex flex-col flex-1 p-4 md:p-6 gap-3.5">

        {/* Row 1: Number + Date + Nota btn */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base md:text-lg font-black text-slate-900 leading-none">#{order.sequenceNumber ?? '—'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {new Date(order.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: '2-digit' })}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest ${sc.bg} ${sc.text} ring-1 ${sc.ring}`}>
              <Icon className="w-2.5 h-2.5" />{sc.label}
            </span>
          </div>
          <button onClick={e => { e.stopPropagation(); onComment(order); }} title="Agregar nota interna"
            className="shrink-0 p-2 bg-slate-50 hover:bg-blue-50 text-slate-300 hover:text-blue-500 rounded-xl transition-all active:scale-95">
            <Activity className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2: Supplier + refs + requested by */}
        <div className="space-y-1 flex-1">
          <h4 className="text-[12px] md:text-[13px] font-black text-slate-900 uppercase tracking-tight leading-snug line-clamp-2">
            {order.supplierName}
          </h4>
          <div className="flex items-center gap-1.5 flex-wrap text-slate-400">
            <Package className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-wider">{order.items.length} ref.</span>
            {order.requestedByName && (
              <>
                <span className="text-slate-200">·</span>
                <span className="text-[9px] font-bold text-slate-400 truncate max-w-[110px]" title={order.requestedByName}>
                  {order.requestedByName.split(' ')[0]}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ✍️ QUICK SIGN button — shown when the current user has a pending approval on this order */}
        {pendingApproval && (
          <div onClick={e => e.stopPropagation()}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={e => onQuickSign(e, order)}
              title="Firmar esta orden"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              Firmar Ahora
            </motion.button>
          </div>
        )}

        {/* Row 3: Admin/Approver quick-cycle buttons */}
        {canManage && (
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={e => onCycleStatus(e, order)}
              title="Ciclar estado de aprobación"
              className={`flex-1 py-2 px-2 md:px-3 rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 border hover:brightness-95 ${sc.bg} ${sc.text} ring-1 ${sc.ring}`}
            >
              {order.status === 'Approved' ? '✓ Aprobado'
                : order.status === 'Pending' ? '⏳ → Aprobar'
                  : order.status === 'Anulada' ? '✗ Anulada'
                    : order.status === 'ChangeRequested' ? '⚠ Cambios'
                      : '📄 → Enviar'}
            </button>
            <button
              onClick={e => onCycleLogistics(e, order)}
              title="Ciclar estado logístico OCC"
              className={`flex-1 py-2 px-2 md:px-3 rounded-xl text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 border hover:brightness-95 ${logisticsClass}`}
            >
              {logisticsLabel} →
            </button>
          </div>
        )}

        {/* Row 4: Total + chevron */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Operación</p>
            <p className="text-lg md:text-xl font-black font-mono text-slate-900 tracking-tight">
              {currencySymbol}{Number(order.total).toLocaleString('es-CO')}
            </p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-50 group-hover:bg-blue-600 text-slate-300 group-hover:text-white flex items-center justify-center transition-all duration-300">
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* ──────────────── Main Dashboard ──────────────── */
export const Dashboard: React.FC = () => {
  const { orders, settings, currentUser, updateOrder, isLoaded } = useDb();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseOrder['status'] | 'All' | 'ToApprove'>('All');
  const [activeCommentOrder, setActiveCommentOrder] = useState<PurchaseOrder | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /* KPIs */
  const totalSpent = orders.reduce((a, o) => a + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  const approved = orders.filter(o => o.status === 'Approved').length;
  const drafts = orders.filter(o => o.status === 'Draft').length;
  const myOrders = orders.filter(o => o.requestedById === currentUser?.id).length;

  const canManage = currentUser?.role === 'Admin' || currentUser?.role === 'Approver' || currentUser?.role === 'Buyer';

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const lower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        order.supplierName.toLowerCase().includes(lower) ||
        (order.sequenceNumber?.toString() || '').includes(searchTerm) ||
        order.id.toLowerCase().includes(lower);

      let matchesStatus = statusFilter === 'All' || (statusFilter !== 'ToApprove' && order.status === statusFilter);
      if (statusFilter === 'ToApprove') {
        matchesStatus = order.status === 'Pending' &&
          Array.isArray(order.approvals) &&
          order.approvals.some(a => a.userId === currentUser?.id && !a.approved);
      }
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Logic to keep orders with sequence numbers at the top, sorted ASC,
      // and drafts/orders without numbers at the very end.
      if (!a.sequenceNumber && b.sequenceNumber) return 1;
      if (a.sequenceNumber && !b.sequenceNumber) return -1;
      return (a.sequenceNumber || 0) - (b.sequenceNumber || 0);
    });
  }, [orders, searchTerm, statusFilter, currentUser]);

  /* Export */
  const exportMyHistory = () => {
    const myO = orders.filter(o => o.requestedById === currentUser?.id);
    const data = myO.map(o => ({ ID: o.id, Num: o.sequenceNumber, Fecha: new Date(o.date).toLocaleDateString(), Proveedor: o.supplierName, Total: o.total, Estado: o.status }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Mis Ordenes');
    XLSX.writeFile(wb, 'Record_MIP_Personal.xlsx');
    toast.success('Historial exportado');
  };

  /* Status Cycling */
  const cycleMainStatus = async (e: React.MouseEvent, order: PurchaseOrder) => {
    e.stopPropagation();
    if (order.status === 'Anulada') { toast.info('Orden anulada, no se puede cambiar'); return; }
    const states: PurchaseOrder['status'][] = ['Draft', 'Pending', 'Approved'];
    const idx = states.indexOf(order.status);
    if (idx === -1) { toast.info('Estado especial'); return; }
    const next = states[(idx + 1) % states.length];
    if (next === 'Approved' && currentUser?.role !== 'Admin') { toast.error('Solo Admin puede aprobar directamente'); return; }
    await updateOrder(order.id, { status: next });
    toast.success(`Estado → ${next}`);
  };

  const cycleLogisticsStatus = async (e: React.MouseEvent, order: PurchaseOrder) => {
    e.stopPropagation();
    const states: PurchaseOrder['occStatus'][] = ['Pendiente', 'EnProceso', 'Entregado'];
    const idx = states.indexOf(order.occStatus || 'Pendiente');
    const next = states[(idx + 1) % states.length];
    await updateOrder(order.id, { occStatus: next });
    toast.success(`Logística → ${next}`);
  };

  const handleQuickComment = async (orderId: string, text: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const comment = { id: Date.now().toString(), userId: currentUser?.id || '', userName: currentUser?.name || 'Anónimo', text, timestamp: new Date().toISOString() };
    await updateOrder(orderId, { commentsHistory: [...(order.commentsHistory || []), comment] });
    toast.success('Comentario guardado');
  };

  /* Quick Sign — marks current user's approval with their signatureUrl, auto-approves if all have signed */
  const handleQuickSign = async (e: React.MouseEvent, order: PurchaseOrder) => {
    e.stopPropagation();
    if (!currentUser || order.status !== 'Pending') return;
    if (!Array.isArray(order.approvals)) return;

    // Attach the user's signatureUrl directly to their approval entry
    const updatedApprovals = order.approvals.map(a =>
      a.userId === currentUser.id
        ? {
          ...a,
          approved: true,
          approvedAt: new Date().toISOString(),
          signatureUrl: currentUser.signatureUrl || a.signatureUrl || ''
        }
        : a
    );
    const allSigned = updatedApprovals.every(a => a.approved);

    const updates: Partial<PurchaseOrder> = { approvals: updatedApprovals };

    if (allSigned) {
      // Mark as fully approved and copy this user's signature to the order-level field (for PDF legacy rendering)
      updates.status = 'Approved';
      updates.approvedBy = currentUser.name;
      updates.approvedAt = new Date().toISOString();
      updates.approverSignatureUrl = currentUser.signatureUrl || '';
    }

    await updateOrder(order.id, updates);
    toast.success(
      allSigned
        ? '✅ Orden aprobada — firma registrada en el PDF'
        : `✍️ Firma de ${currentUser.name.split(' ')[0]} registrada`,
      { duration: 4000 }
    );
  };

  if (!isLoaded) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );

  const filterButtons = [
    { id: 'All', label: 'Todas', count: orders.length },
    { id: 'Pending', label: 'Pendientes', count: pending },
    { id: 'Approved', label: 'Aprobadas', count: approved },
    { id: 'Draft', label: 'Borradores', count: drafts },
    { id: 'ToApprove', label: 'Por Firmar', count: orders.filter(o => o.status === 'Pending' && Array.isArray(o.approvals) && o.approvals.some(a => a.userId === currentUser?.id && !a.approved)).length },
    { id: 'Anulada', label: 'Anuladas', count: orders.filter(o => o.status === 'Anulada').length },
  ] as const;

  return (
    <div className="content-container section-spacing py-6 pb-40">

      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl border border-white/5 no-print mb-8">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] -mr-80 -mt-80 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 blur-[100px] -ml-40 -mb-40 rounded-full pointer-events-none" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-300">Panel Operativo MIP</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
              Hola, <span className="text-blue-400">{currentUser?.name?.split(' ')[0]}.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
              Hay <span className="text-amber-400 font-black">{pending} orden{pending !== 1 ? 'es' : ''} pendiente{pending !== 1 ? 's' : ''}</span> de firma.
              Total en flujo: <span className="text-emerald-400 font-black">${totalSpent.toLocaleString('es-CO')}</span>
            </motion.p>

            {/* Quick action pills */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3 pt-2">
              {(currentUser?.role === 'Admin' || currentUser?.role === 'Buyer' || currentUser?.role === 'Approver') && (
                <button onClick={() => navigate('/create-order')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 group">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  Nueva Orden
                </button>
              )}
              <button onClick={exportMyHistory}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] backdrop-blur-md transition-all active:scale-95 flex items-center gap-2">
                <Download className="w-4 h-4 opacity-60" />
                Mi Historial
              </button>
            </motion.div>
          </div>

          {/* KPI Strip */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { label: 'Pendientes', val: pending, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
              { label: 'Aprobadas', val: approved, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
              { label: 'Borradores', val: drafts, color: 'text-slate-400', bg: 'bg-white/5', icon: FileText },
              { label: 'Mis Órdenes', val: myOrders, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: ShieldCheck },
            ].map(kpi => (
              <div key={kpi.label} className={`${kpi.bg} rounded-2xl p-4 border border-white/5 min-w-[110px]`}>
                <div className={`flex items-center gap-1.5 mb-2 ${kpi.color}`}>
                  <kpi.icon className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-70">{kpi.label}</span>
                </div>
                <span className={`text-3xl font-black tracking-tighter ${kpi.color}`}>{kpi.val}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* --- Connection Links Area (Rich Aesthetics) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Servidor en Línea</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-blue-400" /> Acceso Local
                  </p>
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">http://localhost:{useDb().serverStatus.port}</p>
                </div>

                {useDb().serverStatus.localIps.slice(0, 1).map(ip => (
                  <div key={ip.address} className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-emerald-400" /> Red Local
                    </p>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">http://{ip.address}:{useDb().serverStatus.port}</p>
                  </div>
                ))}

                {useDb().serverStatus.tunnelUrl && (
                  <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 hover:bg-white/10 transition-all group scale-[1.02] shadow-xl shadow-blue-500/5">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Túnel Seguro (Remoto)
                    </p>
                    <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">{useDb().serverStatus.tunnelUrl}</p>
                  </div>
                )}

                <div className="p-4 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-purple-400" /> IP Pública
                  </p>
                  <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate">{useDb().serverStatus.publicIp}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ═══ FILTER BAR ═══ */}
      <section className="sticky top-16 md:top-[4.5rem] z-30 no-print">
        <div className="premium-glass rounded-[2rem] p-2 flex flex-col lg:flex-row gap-2.5 shadow-sm">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por proveedor, número o ID…"
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50/80 border-none rounded-[1.5rem] text-sm font-semibold focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none" />
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide px-1 items-center">
            {filterButtons.map(f => (
              <button key={f.id} onClick={() => setStatusFilter(f.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${statusFilter === f.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
                  }`}>
                {f.label}
                {f.count > 0 && (
                  <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full ${statusFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="hidden md:flex gap-1 bg-slate-100 rounded-2xl p-1">
            <button onClick={() => setViewMode('grid')} title="Vista grilla"
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
              ⊞ Grid
            </button>
            <button onClick={() => setViewMode('list')} title="Vista lista"
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
              ≡ Lista
            </button>
          </div>
        </div>
      </section>

      {/* ═══ RESULTS HEADER ═══ */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 rounded-full bg-blue-600 shadow-md shadow-blue-500/40" />
            <h3 className="text-[11px] font-black text-slate-700 tracking-[0.2em] uppercase">
              {filteredOrders.length} Orden{filteredOrders.length !== 1 ? 'es' : ''}
              {statusFilter !== 'All' && <span className="text-blue-500 ml-1">· {filterButtons.find(f => f.id === statusFilter)?.label}</span>}
            </h3>
          </div>
          {searchTerm && (
            <span className="text-[9px] font-bold text-slate-400">Búsqueda: <span className="text-blue-600">«{searchTerm}»</span></span>
          )}
        </div>

        {/* ═══ ORDER GRID / LIST ═══ */}
        {filteredOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sin resultados</p>
            <p className="text-[10px] text-slate-300 mt-1 font-medium">Intenta cambiar los filtros o la búsqueda</p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}
                className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Limpiar búsqueda
              </button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5'
            : 'flex flex-col gap-3'
          }>
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, idx) => (
                viewMode === 'grid' ? (
                  <OrderCard
                    key={order.id}
                    order={order}
                    idx={idx}
                    canManage={canManage}
                    currentUserId={currentUser?.id}
                    currencySymbol={settings.currencySymbol}
                    onComment={o => setActiveCommentOrder(o)}
                    onCycleStatus={cycleMainStatus}
                    onCycleLogistics={cycleLogisticsStatus}
                    onQuickSign={handleQuickSign}
                    onNavigate={id => navigate(`/create-order?id=${id}`)}
                  />
                ) : (
                  /* LIST ROW */
                  <motion.div key={order.id} layout
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25, delay: idx * 0.03 }}
                    onClick={() => navigate(`/create-order?id=${order.id}`)}
                    className="group bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-blue-100 cursor-pointer transition-all duration-200 overflow-hidden"
                  >
                    {/* Status dot */}
                    <div className={`w-2 h-10 rounded-full shrink-0 ${order.status === 'Approved' ? 'bg-emerald-500' : order.status === 'Pending' ? 'bg-amber-400' : order.status === 'Anulada' ? 'bg-slate-800' : order.status === 'ChangeRequested' ? 'bg-rose-500' : 'bg-slate-200'}`} />

                    <div className="flex items-center gap-3 min-w-[70px]">
                      <span className="text-sm font-black text-slate-900">#{order.sequenceNumber ?? '—'}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black text-slate-900 uppercase truncate">{order.supplierName}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{new Date(order.date).toLocaleDateString('es-CO')} · {order.items.length} ref.</p>
                    </div>

                    {/* Quick sign in list view */}
                    {order.status === 'Pending' &&
                      Array.isArray(order.approvals) &&
                      order.approvals.some(a => a.userId === currentUser?.id && !a.approved) && (
                        <button
                          onClick={e => { e.stopPropagation(); handleQuickSign(e, order); }}
                          title="Firmar orden"
                          className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[8px] font-black uppercase tracking-widest rounded-xl shadow-md shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition-all"
                        >
                          <Zap className="w-3 h-3" />
                          Firmar
                        </button>
                      )}

                    {canManage && (
                      <div className="flex gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                        <button onClick={e => cycleMainStatus(e, order)} title="Cambiar estado"
                          className="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95">
                          {order.status}
                        </button>
                        <button onClick={e => cycleLogisticsStatus(e, order)} title="Estado logístico"
                          className="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase border bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95">
                          {order.occStatus ?? 'Pendiente'}
                        </button>
                      </div>
                    )}

                    <div className="text-right shrink-0">
                      <p className="text-sm font-black font-mono text-slate-900">{settings.currencySymbol}{Number(order.total).toLocaleString('es-CO')}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Quick Comment Modal */}
      <AnimatePresence>
        {activeCommentOrder && (
          <QuickCommentModal
            order={activeCommentOrder}
            onClose={() => setActiveCommentOrder(null)}
            onSave={text => handleQuickComment(activeCommentOrder.id, text)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
