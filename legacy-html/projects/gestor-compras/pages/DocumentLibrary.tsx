import React, { useMemo, useState } from 'react';
import { useDb } from '../store/db';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Search, X, Download, Eye,
    Filter, ChevronRight, Package, FolderOpen,
    FileImage, FileSpreadsheet, File, Archive,
    CheckCircle, Clock, MessageSquare, History,
    User, AlertTriangle, ChevronDown, ChevronUp,
    Folder, RefreshCw, Hash, Shield, Edit3, Truck
} from 'lucide-react';
import { PurchaseOrder, OrderDocument } from '../types';

/* ─── Helpers ─── */
const getFileIcon = (name: string, _url: string) => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext) || name.startsWith('Orden_MIP_'))
        return { Icon: FileText, color: 'text-red-500', bg: 'bg-red-50', label: 'PDF' };
    if (['xlsx', 'xls', 'csv'].includes(ext))
        return { Icon: FileSpreadsheet, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Excel' };
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext))
        return { Icon: FileImage, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Imagen' };
    if (['doc', 'docx'].includes(ext))
        return { Icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50', label: 'Word' };
    if (['zip', 'rar', '7z'].includes(ext))
        return { Icon: Archive, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Archivo' };
    return { Icon: File, color: 'text-slate-500', bg: 'bg-slate-50', label: 'Archivo' };
};

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    Draft: { label: 'Borrador', color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
    InProcess: { label: 'En Proceso', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
    Pending: { label: 'Pte. Aprobación', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
    Approved: { label: 'Aprobada ✓', color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    ChangeRequested: { label: 'C. Solicitado', color: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
    ApprovedForChange: { label: 'Cambio OK', color: 'text-indigo-700', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
    AcuerdoComercial: { label: 'Ac. Comercial', color: 'text-violet-700', bg: 'bg-violet-50', dot: 'bg-violet-500' },
    EnRevision: { label: 'En Revisión', color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
    Anulada: { label: 'Anulada', color: 'text-slate-700', bg: 'bg-slate-100', dot: 'bg-slate-400' },
};

const fmt = (d: string | undefined | null) => d
    ? new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';
const fmtDate = (d: string | undefined | null) => d
    ? new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
const COP = (n?: number) => n != null
    ? '$ ' + Number(n).toLocaleString('es-CO')
    : '—';

/* ─── Order History Card ─── */
const OrderHistoryCard: React.FC<{ order: PurchaseOrder }> = ({ order }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const sc = STATUS_MAP[order.status] || { label: order.status, color: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' };

    const totalDocs = (order.documents || []).length;
    const hasComments = (order.commentsHistory || []).length > 0;
    const hasApprovals = Array.isArray(order.approvals) && order.approvals.length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-[1.75rem] border border-slate-100 overflow-hidden hover:shadow-md hover:border-blue-100 transition-all duration-200"
        >
            {/* Order header row */}
            <div className="flex items-center gap-4 px-5 py-4">
                {/* Status dot + number */}
                <div className="flex flex-col items-center shrink-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                </div>
                <div className="shrink-0 text-center">
                    <p className="text-[22px] font-black text-slate-900 leading-none tracking-tighter">
                        #{String(order.sequenceNumber ?? '?').padStart(3, '0')}
                    </p>
                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest mt-0.5">OC</p>
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-slate-900 truncate uppercase">{order.supplierName}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[7.5px] font-black px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                        <span className="text-[8px] text-slate-400 font-medium">{fmtDate(order.date)}</span>
                        {order.requestedByName && (
                            <span className="text-[7.5px] text-slate-400 hidden md:inline">· {order.requestedByName}</span>
                        )}
                    </div>
                    <p className="text-[9px] font-black text-emerald-600 mt-0.5">{COP(order.total)}</p>
                </div>

                {/* Quick stats */}
                <div className="hidden md:flex items-center gap-3 shrink-0 text-[8px] font-black text-slate-400">
                    {totalDocs > 0 && (
                        <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-red-400" /> {totalDocs}
                        </span>
                    )}
                    {hasComments && (
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-blue-400" /> {(order.commentsHistory || []).length}
                        </span>
                    )}
                    {hasApprovals && (
                        <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-emerald-400" /> {order.approvals!.filter(a => a.approved).length}/{order.approvals!.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={() => navigate(`/create-order?id=${order.id}`)}
                        className="px-3 py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-400 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                        Abrir
                    </button>
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all"
                        title={open ? 'Colapsar' : 'Ver historial completo'}
                    >
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Collapsed detail panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-50"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">

                            {/* ── 1. Datos de la Orden ── */}
                            <div className="bg-white p-5 space-y-3">
                                <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
                                    <Hash className="w-3 h-3" /> Datos del Pedido
                                </h4>
                                <dl className="space-y-1.5 text-[9px]">
                                    <div className="flex justify-between">
                                        <dt className="font-black text-slate-400 uppercase">Nº Orden</dt>
                                        <dd className="font-bold text-slate-700">MIP{String(order.sequenceNumber ?? '?').padStart(3, '0')}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-black text-slate-400 uppercase">Fecha</dt>
                                        <dd className="font-bold text-slate-700">{fmtDate(order.date)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-black text-slate-400 uppercase">Proveedor</dt>
                                        <dd className="font-bold text-slate-700 truncate max-w-[140px]" title={order.supplierName}>{order.supplierName}</dd>
                                    </div>
                                    {order.quoteNumber && (
                                        <div className="flex justify-between">
                                            <dt className="font-black text-slate-400 uppercase">Cotización</dt>
                                            <dd className="font-bold text-slate-700">{order.quoteNumber}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="font-black text-slate-400 uppercase">Forma Pago</dt>
                                        <dd className="font-bold text-slate-700">{order.paymentType === 'Credit' ? 'Crédito' : order.paymentType === 'Advance' ? 'Anticipo' : 'Contado'}</dd>
                                    </div>
                                    <div className="border-t border-slate-50 pt-1.5 flex justify-between">
                                        <dt className="font-black text-slate-400 uppercase">Subtotal</dt>
                                        <dd className="font-bold text-slate-700">{COP(order.subtotal)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-black text-slate-400 uppercase">IVA</dt>
                                        <dd className="font-bold text-slate-700">{COP(order.tax)}</dd>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-100 pt-1.5">
                                        <dt className="font-black text-emerald-700 uppercase">Total</dt>
                                        <dd className="font-black text-emerald-700 text-[11px]">{COP(order.total)}</dd>
                                    </div>
                                    {order.requestedByName && (
                                        <div className="flex justify-between">
                                            <dt className="font-black text-slate-400 uppercase">Elaboró</dt>
                                            <dd className="font-bold text-slate-700">{order.requestedByName}</dd>
                                        </div>
                                    )}
                                    {order.approvedBy && (
                                        <div className="flex justify-between">
                                            <dt className="font-black text-slate-400 uppercase">Aprobó</dt>
                                            <dd className="font-bold text-emerald-700">{order.approvedBy}</dd>
                                        </div>
                                    )}
                                    {order.approvedAt && (
                                        <div className="flex justify-between">
                                            <dt className="font-black text-slate-400 uppercase">Aprobado</dt>
                                            <dd className="font-bold text-emerald-700">{fmtDate(order.approvedAt)}</dd>
                                        </div>
                                    )}
                                    {order.comments && (
                                        <div className="pt-1 border-t border-slate-50">
                                            <dt className="font-black text-slate-400 uppercase mb-0.5">Observaciones</dt>
                                            <dd className="text-slate-600 leading-relaxed">{order.comments}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* ── 2. Firmas & Aprobaciones ── */}
                            <div className="bg-white p-5 space-y-3">
                                <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5">
                                    <Shield className="w-3 h-3" /> Flujo de Aprobación
                                </h4>

                                {hasApprovals ? (
                                    <div className="space-y-2.5">
                                        {order.approvals!.map((a, i) => (
                                            <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl ${a.approved ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${a.approved ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                                    {a.approved
                                                        ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                                        : <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-black text-slate-800 truncate">{a.userName}</p>
                                                    <p className="text-[7.5px] font-medium text-slate-400">{a.role || 'Aprobador'}</p>
                                                    {a.approved && a.approvedAt && (
                                                        <p className="text-[7px] text-emerald-600 font-bold">{fmtDate(a.approvedAt)}</p>
                                                    )}
                                                </div>
                                                {a.signatureUrl && (
                                                    <img src={a.signatureUrl} className="h-6 w-auto object-contain shrink-0 opacity-70" alt="firma" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* Legacy approval fields */
                                    <div className="space-y-2">
                                        {order.requestedByName && (
                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-700">{order.requestedByName}</p>
                                                    <p className="text-[7px] text-slate-400 uppercase font-black">Elaborado por</p>
                                                </div>
                                            </div>
                                        )}
                                        {order.approvedBy && (
                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-black text-emerald-700">{order.approvedBy}</p>
                                                    <p className="text-[7px] text-emerald-600 uppercase font-black">Aprobado {fmtDate(order.approvedAt)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {order.budgetApproved && (
                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-black text-emerald-700">{order.approvedByBudget || '—'}</p>
                                                    <p className="text-[7px] text-emerald-600 uppercase font-black">Costos y Presupuesto</p>
                                                </div>
                                            </div>
                                        )}
                                        {order.purchasingApproved && (
                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <div>
                                                    <p className="text-[9px] font-black text-emerald-700">{order.approvedByPurchasing || '—'}</p>
                                                    <p className="text-[7px] text-emerald-600 uppercase font-black">Compras</p>
                                                </div>
                                            </div>
                                        )}
                                        {!order.approvedBy && !order.budgetApproved && !order.purchasingApproved && (
                                            <p className="text-[8px] text-slate-300 italic">Sin registros de aprobación</p>
                                        )}
                                    </div>
                                )}

                                {order.changeReason && (
                                    <div className="border-t border-slate-50 pt-2">
                                        <p className="text-[7.5px] font-black text-slate-400 uppercase mb-1">Motivo de Cambio</p>
                                        <p className="text-[8.5px] text-rose-600 font-medium leading-relaxed">{order.changeReason}</p>
                                    </div>
                                )}
                            </div>

                            {/* ── 3. Bitácora + Documentos ── */}
                            <div className="bg-white p-5 space-y-4 md:col-span-2 lg:col-span-1">
                                {/* Documents */}
                                {totalDocs > 0 && (
                                    <div>
                                        <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 mb-2">
                                            <FileText className="w-3 h-3" /> Archivos ({totalDocs})
                                        </h4>
                                        <div className="space-y-1.5">
                                            {(order.documents || []).map(doc => {
                                                const { Icon, color, bg } = getFileIcon(doc.name, doc.url);
                                                const canPreview = doc.name.toLowerCase().endsWith('.pdf') || /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.name);
                                                return (
                                                    <div key={doc.id} className="flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors group">
                                                        <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                                                            <Icon className={`w-3 h-3 ${color}`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[8.5px] font-semibold text-slate-700 truncate" title={doc.name}>{doc.name}</p>
                                                            <p className="text-[6.5px] text-slate-400 font-medium">{fmtDate(doc.uploadedAt)}{doc.uploadedBy ? ` · ${doc.uploadedBy}` : ''}</p>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {canPreview && (
                                                                <a href={doc.url} target="_blank" rel="noopener noreferrer"
                                                                    className="p-1 rounded-lg hover:bg-blue-50 text-slate-300 hover:text-blue-500 transition-all">
                                                                    <Eye className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                            <a href={doc.url} download={doc.name}
                                                                className="p-1 rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 transition-all">
                                                                <Download className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Comments History (Bitácora) */}
                                {hasComments && (
                                    <div>
                                        <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 mb-2">
                                            <History className="w-3 h-3" /> Bitácora ({(order.commentsHistory || []).length})
                                        </h4>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                            {(order.commentsHistory || []).map((c, i) => (
                                                <div key={i} className="flex gap-2 text-[8px]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-baseline justify-between gap-1 mb-0.5">
                                                            <span className="font-black text-slate-700 truncate">{c.userName}</span>
                                                            <span className="text-slate-300 shrink-0 text-[7px]">{fmt(c.timestamp)}</span>
                                                        </div>
                                                        <p className="text-slate-500 leading-relaxed">{c.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Items summary */}
                                <div>
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 mb-2">
                                        <Package className="w-3 h-3" /> Productos ({(order.items || []).length})
                                    </h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                                        {(order.items || []).map((item, i) => (
                                            <div key={i} className="flex items-center justify-between gap-2 text-[7.5px] py-0.5 border-b border-slate-50 last:border-0">
                                                <span className="font-semibold text-slate-700 truncate">{item.productName}</span>
                                                <span className="shrink-0 text-slate-400 font-black">{item.quantity} × {COP(item.unitPrice)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

/* ─── Document Flat Card ─── */
interface DocEntry extends OrderDocument {
    order?: PurchaseOrder;
    supplier?: any; // Using any to avoid complex type issues for now, or use Supplier type
}

const DocCard: React.FC<{ doc: DocEntry; idx: number }> = ({ doc, idx }) => {
    const navigate = useNavigate();
    const { Icon, color, bg, label } = getFileIcon(doc.name, doc.url);
    const sc = STATUS_MAP[doc.order.status] || { label: doc.order.status, color: 'text-slate-600', bg: 'bg-slate-100' };
    const canPreview = doc.name.toLowerCase().endsWith('.pdf') || /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.name);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.025, 0.4) }}
            className="group bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 hover:shadow-lg hover:border-blue-100 transition-all duration-200"
        >
            <div className={`shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-[10.5px] font-black text-slate-900 truncate leading-tight" title={doc.name}>{doc.name}</p>
                    <span className={`shrink-0 text-[7px] font-black uppercase px-2 py-0.5 rounded-full ${bg} ${color}`}>{label}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {doc.order ? (
                        <button onClick={() => navigate(`/create-order?id=${doc.order!.id}`)}
                            className="flex items-center gap-1 text-[8.5px] font-black text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                            <Package className="w-2.5 h-2.5" />
                            OC #{doc.order!.sequenceNumber ?? '—'} · {doc.order!.supplierName}
                        </button>
                    ) : doc.supplier ? (
                        <button onClick={() => navigate(`/suppliers`)}
                            className="flex items-center gap-1 text-[8.5px] font-black text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors">
                            <Truck className="w-2.5 h-2.5" />
                            PROV: {doc.supplier.name}
                        </button>
                    ) : null}
                    {doc.order && <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>}
                </div>
                <p className="text-[7.5px] text-slate-300 font-medium mt-0.5">{fmt(doc.uploadedAt)}{doc.uploadedBy ? ` · ${doc.uploadedBy}` : ''}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                {canPreview && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" title="Ver"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-300 hover:text-blue-500 transition-all active:scale-95">
                        <Eye className="w-3.5 h-3.5" />
                    </a>
                )}
                <a href={doc.url} download={doc.name} title="Descargar"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 transition-all active:scale-95">
                    <Download className="w-3.5 h-3.5" />
                </a>
                {doc.order && (
                    <button onClick={() => navigate(`/create-order?id=${doc.order!.id}`)} title="Ir a la orden"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-600 text-slate-300 hover:text-white transition-all active:scale-95">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                )}
                {doc.supplier && (
                    <button onClick={() => navigate(`/suppliers`)} title="Ir a proveedores"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all active:scale-95">
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

/* ─── MAIN PAGE ─── */
export const DocumentLibrary: React.FC = () => {
    const { orders, suppliers } = useDb();
    const navigate = useNavigate();

    // View: 'files' | 'orders'
    const [view, setView] = useState<'files' | 'orders'>('orders');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image' | 'excel' | 'oc'>('all');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'date' | 'order' | 'name'>('date');

    /* Flat document list */
    const allDocs: DocEntry[] = useMemo(() => {
        const entries: DocEntry[] = [];
        // Add order docs
        for (const order of orders) {
            for (const doc of (order.documents || [])) {
                entries.push({ ...doc, order });
            }
        }
        // Add supplier docs
        for (const supplier of suppliers) {
            for (const doc of (supplier.documents || [])) {
                entries.push({ ...doc, supplier });
            }
        }
        return entries;
    }, [orders, suppliers]);

    /* Stats */
    const stats = useMemo(() => ({
        totalDocs: allDocs.length,
        totalOrders: orders.length,
        ordersWithDocs: new Set(allDocs.map(d => d.order.id)).size,
        pdfs: allDocs.filter(d => d.name.toLowerCase().endsWith('.pdf')).length,
        images: allDocs.filter(d => /\.(jpg|jpeg|png|webp|gif)$/i.test(d.name)).length,
    }), [allDocs, orders]);

    /* Filtered docs */
    const filteredDocs = useMemo(() => {
        let docs = [...allDocs];
        if (filterType === 'pdf') docs = docs.filter(d => d.name.toLowerCase().endsWith('.pdf') && !d.name.startsWith('Orden_MIP_'));
        else if (filterType === 'oc') docs = docs.filter(d => d.name.startsWith('Orden_MIP_'));
        else if (filterType === 'image') docs = docs.filter(d => /\.(jpg|jpeg|png|webp|gif)$/i.test(d.name));
        else if (filterType === 'excel') docs = docs.filter(d => /\.(xlsx|xls|csv)$/i.test(d.name));
        if (filterStatus !== 'All') docs = docs.filter(d => d.order?.status === filterStatus);
        if (searchTerm) {
            const l = searchTerm.toLowerCase();
            docs = docs.filter(d =>
                d.name.toLowerCase().includes(l) ||
                (d.order?.supplierName || '').toLowerCase().includes(l) ||
                (d.supplier?.name || '').toLowerCase().includes(l) ||
                (d.order ? String(d.order.sequenceNumber || '').includes(searchTerm) : false) ||
                (d.uploadedBy || '').toLowerCase().includes(l)
            );
        }
        if (sortBy === 'date') docs.sort((a, b) => new Date(b.uploadedAt || b.order?.date || 0).getTime() - new Date(a.uploadedAt || a.order?.date || 0).getTime());
        else if (sortBy === 'order') docs.sort((a, b) => (b.order?.sequenceNumber || 0) - (a.order?.sequenceNumber || 0));
        else docs.sort((a, b) => a.name.localeCompare(b.name));
        return docs;
    }, [allDocs, filterType, filterStatus, searchTerm, sortBy]);

    /* Filtered orders */
    const filteredOrders = useMemo(() => {
        let ords = [...orders];
        if (filterStatus !== 'All') ords = ords.filter(o => o.status === filterStatus);
        if (searchTerm) {
            const l = searchTerm.toLowerCase();
            ords = ords.filter(o =>
                (o.supplierName || '').toLowerCase().includes(l) ||
                String(o.sequenceNumber || '').includes(searchTerm) ||
                (o.requestedByName || '').toLowerCase().includes(l) ||
                (o.comments || '').toLowerCase().includes(l) ||
                (o.documents || []).some(d => d.name.toLowerCase().includes(l)) ||
                (o.commentsHistory || []).some(c => c.text?.toLowerCase().includes(l))
            );
        }
        return ords.sort((a, b) => (b.sequenceNumber || 0) - (a.sequenceNumber || 0));
    }, [orders, filterStatus, searchTerm]);

    const kpis = [
        { label: 'Total Órdenes', val: stats.totalOrders, color: 'text-blue-500' },
        { label: 'Con Documentos', val: stats.ordersWithDocs, color: 'text-violet-500' },
        { label: 'Archivos Totales', val: stats.totalDocs, color: 'text-red-500' },
        { label: 'PDFs Generados', val: stats.pdfs, color: 'text-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-10">

            {/* ── Hero ── */}
            <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-5 md:px-8 pt-10 pb-8 space-y-5">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-2xl border border-white/10">
                        <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300">Archivo Central · MIP Internacional</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                        Biblioteca de <span className="text-indigo-400">Documentos</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                        className="text-slate-400 text-sm font-medium max-w-lg">
                        Registro permanente de todas las órdenes, documentos adjuntos, aprobaciones y bitácoras del sistema.
                        Todo guardado en el servidor — accesible en cualquier momento.
                    </motion.p>

                    {/* KPIs */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {kpis.map((k, i) => (
                            <div key={i} className="bg-white/[0.05] backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10">
                                <p className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{k.label}</p>
                                <p className={`text-3xl font-black tracking-tighter leading-none ${k.color}`}>{k.val}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-5">

                {/* ── Toolbar ── */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-3 flex flex-col lg:flex-row gap-3">

                    {/* View toggle */}
                    <div className="flex rounded-2xl bg-slate-50 p-1 gap-0.5 shrink-0">
                        <button onClick={() => setView('orders')}
                            className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all
                ${view === 'orders' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}>
                            <span className="flex items-center gap-1.5"><FolderOpen className="w-3 h-3" /> Por Orden</span>
                        </button>
                        <button onClick={() => setView('files')}
                            className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all
                ${view === 'files' ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}>
                            <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> Archivos</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg">
                                <X className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        )}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre, proveedor, OC, comentario..."
                            className="w-full pl-11 pr-10 py-3 bg-slate-50/80 border-none rounded-[1.5rem] text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide items-center">
                        {['All', 'Approved', 'Pending', 'Draft', 'Anulada'].map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)}
                                className={`px-3 py-2.5 rounded-2xl text-[7.5px] font-black uppercase tracking-widest whitespace-nowrap transition-all
                  ${filterStatus === s
                                        ? 'bg-slate-900 text-white shadow'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'}`}>
                                {s === 'All' ? 'Todos' : STATUS_MAP[s]?.label || s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* File type filter (only for files view) */}
                {view === 'files' && (
                    <div className="flex gap-2 flex-wrap items-center">
                        {[
                            { id: 'all', label: 'Todos', count: allDocs.length },
                            { id: 'oc', label: 'OC PDF', count: allDocs.filter(d => d.name.startsWith('Orden_MIP_')).length },
                            { id: 'pdf', label: 'PDF', count: allDocs.filter(d => d.name.toLowerCase().endsWith('.pdf') && !d.name.startsWith('Orden_MIP_')).length },
                            { id: 'image', label: 'Imágenes', count: allDocs.filter(d => /\.(jpg|jpeg|png|webp|gif)$/i.test(d.name)).length },
                            { id: 'excel', label: 'Excel/CSV', count: allDocs.filter(d => /\.(xlsx|xls|csv)$/i.test(d.name)).length },
                        ].map(f => (
                            <button key={f.id} onClick={() => setFilterType(f.id as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[7.5px] font-black uppercase tracking-widest transition-all
                  ${filterType === f.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'}`}>
                                {f.label}
                                <span className={`text-[6.5px] px-1.5 py-0.5 rounded-full font-black
                  ${filterType === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {f.count}
                                </span>
                            </button>
                        ))}
                        <div className="flex gap-1.5 items-center ml-auto">
                            <span className="text-[7.5px] font-black text-slate-300 uppercase">Orden:</span>
                            {[{ id: 'date', l: 'Fecha' }, { id: 'order', l: 'OC' }, { id: 'name', l: 'Nombre' }].map(s => (
                                <button key={s.id} onClick={() => setSortBy(s.id as any)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[7.5px] font-black uppercase transition-all
                    ${sortBy === s.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                    {s.l}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results label */}
                <div className="flex items-center justify-between px-1">
                    <p className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest">
                        {view === 'orders' ? `${filteredOrders.length} orden${filteredOrders.length !== 1 ? 'es' : ''}` : `${filteredDocs.length} archivo${filteredDocs.length !== 1 ? 's' : ''}`}
                        {searchTerm && <span className="text-indigo-500"> · «{searchTerm}»</span>}
                    </p>
                    {(searchTerm || filterStatus !== 'All' || filterType !== 'all') && (
                        <button onClick={() => { setSearchTerm(''); setFilterStatus('All'); setFilterType('all'); }}
                            className="text-[7.5px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors">
                            <X className="w-2.5 h-2.5" /> Limpiar
                        </button>
                    )}
                </div>

                {/* ── Content ── */}
                <AnimatePresence mode="wait">
                    {view === 'orders' ? (
                        <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-3">
                            {filteredOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 text-center">
                                    <FolderOpen className="w-12 h-12 text-slate-100 mb-3" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin resultados</p>
                                </div>
                            ) : filteredOrders.map(order => (
                                <OrderHistoryCard key={order.id} order={order} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div key="files" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {filteredDocs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 text-center">
                                    <FileText className="w-12 h-12 text-slate-100 mb-3" />
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin archivos</p>
                                    <p className="text-[9px] text-slate-200 mt-1">Adjunta documentos a las órdenes y aparecerán aquí</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                    <AnimatePresence mode="popLayout">
                                        {filteredDocs.map((doc, idx) => (
                                            <DocCard key={`${doc.order.id}-${doc.id}`} doc={doc} idx={idx} />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
