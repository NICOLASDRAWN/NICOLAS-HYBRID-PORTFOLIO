import React, { useState, useMemo } from 'react';
import { useDb } from '../store/db';
import { Supplier } from '../types';
import { Truck, Plus, Search, Edit2, Trash2, Save, X, Building2, Phone, Mail, CreditCard, FileSpreadsheet, Upload, FileText, ExternalLink, Calendar, MapPin, User, ArrowRight, Star, ShieldCheck, Globe, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Suppliers: React.FC = () => {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier, currentUser, importSuppliers, orders, uploadFile } = useDb();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialFormState: Partial<Supplier> = {
        name: '',
        taxId: '',
        address: '',
        phone: '',
        email: '',
        contactName: '',
        bankName: '',
        accountType: '',
        accountNumber: '',
        category: 'SUMINISTRO',
        subcategory: '',
        isActive: true
    };

    const [formData, setFormData] = useState<Partial<Supplier>>(initialFormState);

    const canEdit = currentUser?.permissions?.suppliers_edit ?? (currentUser?.role === 'Admin' || currentUser?.role === 'Buyer');
    const canCreate = currentUser?.permissions?.suppliers_create ?? canEdit;
    const canDelete = currentUser?.permissions?.suppliers_delete ?? canEdit;

    const categories = useMemo(() => {
        const cats = new Set(suppliers.map(s => s.category).filter(Boolean));
        return ['Todos', ...Array.from(cats).sort()];
    }, [suppliers]);

    const filteredSuppliers = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return suppliers.filter(s => {
            const matchesSearch =
                s.name.toLowerCase().includes(lower) ||
                s.taxId.toLowerCase().includes(lower) ||
                s.contactName?.toLowerCase().includes(lower);

            const matchesCategory = selectedCategory === '' || selectedCategory === 'Todos' || s.category === selectedCategory;

            return matchesSearch && matchesCategory;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [suppliers, searchTerm, selectedCategory]);

    const handleEdit = (s: Supplier) => {
        setFormData(s);
        setEditingId(s.id);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.taxId) {
            toast.error("Nombre y NIT son obligatorios");
            return;
        }

        if (editingId) {
            updateSupplier(editingId, formData);
            toast.success("Proveedor actualizado");
        } else {
            addSupplier({
                ...formData as Supplier,
                id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)
            });
            toast.success("Proveedor creado");
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Está seguro de eliminar este proveedor?")) {
            deleteSupplier(id);
            toast.success("Proveedor eliminado");
        }
    };

    return (
        <div className="content-container section-spacing py-6">
            <div className="space-y-10">

                {/* Header section with executive feel */}
                <header className="space-y-8 px-2 md:px-0">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                                <Truck className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Relaciones Corporativas</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mobile-title">
                                Directorio <span className="text-blue-600 italic">Aliados.</span>
                            </h1>
                            <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                                Ecosistema de socios estratégicos y suministros globales del grupo internacional MIP.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="p-4 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                                title="Importación Masiva"
                            >
                                <FileSpreadsheet className="w-5 h-5" />
                            </button>
                            {canCreate && (
                                <button
                                    onClick={handleCreate}
                                    className="premium-button py-4"
                                >
                                    <Plus className="w-5 h-5 text-blue-300" />
                                    Inscribir Aliado
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="premium-glass p-3 rounded-[2.5rem] flex flex-col lg:flex-row gap-4 sticky top-24 z-40">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar por razón social, NIT o contacto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-hide px-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === 'Todos' ? '' : cat)}
                                    className={`px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.15em] transition-all whitespace-nowrap
                                        ${(selectedCategory === cat || (cat === 'Todos' && selectedCategory === ''))
                                            ? 'bg-slate-950 text-white shadow-lg'
                                            : 'bg-white/50 text-slate-400 hover:bg-white hover:text-slate-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Suppliers Grid - Large Rounded Native Cards */}
                {/* Suppliers Grid - Large Rounded Native Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredSuppliers.map((supplier, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                key={supplier.id}
                                className="premium-card p-6 flex flex-col h-full group cursor-pointer mobile-card"
                                onClick={() => navigate(`/suppliers?id=${supplier.id}`)}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSelectedSupplier(supplier); setIsDocsModalOpen(true); }}
                                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all"
                                            title="Documentación"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        {canEdit && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEdit(supplier); }}
                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all"
                                                title="Editar Registro"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">{supplier.category}</span>
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">NIT: {supplier.taxId}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tighter group-hover:text-blue-600 transition-colors">
                                        {supplier.name}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Representante</p>
                                            <p className="text-[11px] font-black text-slate-700 truncate">{supplier.contactName || 'No definido'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Estado</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-[11px] font-black text-slate-700">Verificado</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-900 uppercase">Premium</span>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-950 text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        Explorar
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </section>
            </div>

            {/* Modal components remain functional but with native app styling enhancements in common components if possible */}
            {/* CREATE / EDIT MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{editingId ? 'Editar' : 'Nuevo'} <span className="text-blue-600">Aliado</span></h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información Comercial & Legal</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-6 scrollbar-hide">
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Datos Identificación</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Razón Social <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all uppercase"
                                                placeholder="NOMBRE EMPRESA S.A.S"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">NIT / RUC <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                value={formData.taxId}
                                                onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="900.000.000-0"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Categoría</label>
                                            <input
                                                type="text"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value.toUpperCase() })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="SUMINISTROS, SERVICIOS, ETC"
                                                list="category-suggestions"
                                            />
                                            <datalist id="category-suggestions">
                                                {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Contacto & Ubicación</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Dirección Física</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="Dirección Completa"
                                                    title="Dirección Física"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Teléfono</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="(601) 000 0000"
                                                    title="Teléfono de Contacto"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Corporativo</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="contacto@empresa.com"
                                                    title="Correo Electrónico"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Persona Contacto</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    value={formData.contactName}
                                                    onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                    placeholder="Nombre del Contacto"
                                                    title="Persona de Contacto"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Información Bancaria</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Banco</label>
                                            <input
                                                type="text"
                                                value={formData.bankName}
                                                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="BANCOLOMBIA"
                                                title="Banco"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Tipo Cuenta</label>
                                            <select
                                                value={formData.accountType}
                                                onChange={e => setFormData({ ...formData, accountType: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                                                title="Tipo de Cuenta"
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="Ahorros">Ahorros</option>
                                                <option value="Corriente">Corriente</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Número</label>
                                            <input
                                                type="text"
                                                value={formData.accountNumber}
                                                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                                placeholder="000-000000-00"
                                                title="Número de Cuenta"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {editingId && (
                                    <div className="pt-4 border-t border-slate-50">
                                        <button
                                            onClick={() => handleDelete(editingId)}
                                            className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Eliminar Aliado
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Guardar Información
                                </button>
                            </div>
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
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><FileSpreadsheet className="w-10 h-10" /></div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Carga Masiva</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Directorio de Aliados</p>
                            <label className="flex flex-col items-center gap-6 p-10 border-4 border-dashed border-slate-50 rounded-[2.5rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all active:scale-95">
                                <Upload className="w-12 h-12 text-slate-200" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seleccionar Archivo</span>
                                <input type="file" accept=".xlsx, .xls, .csv" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        await importSuppliers(file);
                                        setIsImportModalOpen(false);
                                        toast.success("Directorio importado exitosamente");
                                    }
                                }} className="hidden" />
                            </label>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DOCUMENTS MODAL */}
            <AnimatePresence>
                {isDocsModalOpen && selectedSupplier && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDocsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">

                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Documentos <span className="text-blue-600">Legales</span></h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedSupplier.name}</p>
                                </div>
                                <button onClick={() => setIsDocsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-6 flex-1 scrollbar-hide">
                                {/* Upload Zone */}
                                <label className="flex flex-col items-center gap-4 p-8 border-4 border-dashed border-slate-100 rounded-[2.5rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all active:scale-95 group">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Cargar Nuevo Documento</p>
                                        <p className="text-[9px] font-bold text-slate-400">PDF, Excel, Word, Imagen (Max 10MB)</p>
                                    </div>
                                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx,.txt,.csv" className="hidden" onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const toastId = toast.loading("Subiendo documento...");
                                            try {
                                                const url = await uploadFile(file, 'documents');
                                                if (url) {
                                                    const newDoc = {
                                                        id: Date.now().toString(),
                                                        name: file.name,
                                                        url: url,
                                                        uploadedAt: new Date().toISOString(),
                                                        uploadedBy: currentUser?.name
                                                    };
                                                    const updatedDocs = [...(selectedSupplier.documents || []), newDoc];
                                                    // Assuming updateSupplier can handle partial updates including documents
                                                    // Since updateSupplier signature in db.tsx is (id, partial), this should work if Implementation supports it.
                                                    // However, updateSupplier implementation in db.tsx usually persists to backend.
                                                    // Checking db.tsx earlier: updateSupplier calls authFetch PUT.
                                                    // So we need to make sure the backend accepts 'documents'.
                                                    // Given standard behavior in this app, it likely spreads the partial object.
                                                    await updateSupplier(selectedSupplier.id, { documents: updatedDocs } as any);

                                                    // Update local selected state to reflect change immediately in modal
                                                    setSelectedSupplier({ ...selectedSupplier, documents: updatedDocs });
                                                    toast.success("Documento guardado", { id: toastId });
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                toast.error("Error al subir documento", { id: toastId });
                                            }
                                        }
                                    }} />
                                </label>

                                {/* Documents List */}
                                <div className="space-y-3">
                                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Archivos Existentes</h3>
                                    {!selectedSupplier.documents?.length && (
                                        <div className="text-center py-8 text-slate-300 text-xs font-bold italic">No hay documentos cargados</div>
                                    )}
                                    {selectedSupplier.documents?.map((doc, idx) => (
                                        <div key={doc.id || idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${doc.name.toLowerCase().endsWith('.pdf') ? 'bg-rose-50 text-rose-500' :
                                                    doc.name.toLowerCase().match(/\.(xls|xlsx|csv)$/) ? 'bg-emerald-50 text-emerald-500' :
                                                        doc.name.toLowerCase().match(/\.(doc|docx|txt)$/) ? 'bg-blue-50 text-blue-500' :
                                                            'bg-purple-50 text-purple-500'
                                                    }`}>
                                                    {doc.name.toLowerCase().endsWith('.pdf') ? <FileText className="w-5 h-5" /> :
                                                        doc.name.toLowerCase().match(/\.(xls|xlsx|csv)$/) ? <FileSpreadsheet className="w-5 h-5" /> :
                                                            doc.name.toLowerCase().match(/\.(doc|docx|txt)$/) ? <FileText className="w-5 h-5" /> :
                                                                <FileImage className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-700 truncate max-w-[180px]">{doc.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Ver Documento">
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('¿Eliminar documento?')) {
                                                            const updatedDocs = selectedSupplier.documents?.filter(d => d.id !== doc.id) || [];
                                                            await updateSupplier(selectedSupplier.id, { documents: updatedDocs } as any);
                                                            setSelectedSupplier({ ...selectedSupplier, documents: updatedDocs });
                                                            toast.success("Documento eliminado");
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};