import React, { useState, useMemo } from 'react';
import { useDb } from '../store/db';
import { Product, ProductType } from '../types';
import { PackageSearch, Plus, Search, Edit2, Trash2, Tag, Upload, FileSpreadsheet, Copy, ChevronDown, Hash, Grid3x3, ArrowRight, Save, X, Eye, Package, Star, Zap, ShoppingBag, Power } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchableSelect } from '../components/SearchableSelect';
import { PRODUCT_UNITS, DEFAULT_PRODUCT_CATEGORIES } from '../constants';

export const Products: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, suppliers, addSupplier, currentUser, importProducts, isLoaded } = useDb();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState<ProductType | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isImporting, setIsImporting] = useState(false);
    const [customCategories, setCustomCategories] = useState<string[]>([]);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const initialProductState: Partial<Product> = {
        code: '',
        name: '',
        description: '',
        type: 'Producto',
        category: 'GENERAL',
        unit: 'UNIDAD - UND',
        unitPrice: 0,
        supplierId: '',
        taxRate: 19,
        isActive: true
    };

    const [formData, setFormData] = useState<Partial<Product>>(initialProductState);

    const allCategories = useMemo(() => {
        const cats = new Set([...DEFAULT_PRODUCT_CATEGORIES, ...customCategories, ...products.map(p => p.category).filter(Boolean)]);
        return Array.from(cats).sort();
    }, [products, customCategories]);

    const categories = useMemo(() => {
        return ['Todos', ...allCategories];
    }, [allCategories]);

    const handleAddCategory = () => {
        const trimmed = newCategoryName.trim().toUpperCase();
        if (!trimmed) return;
        if (allCategories.includes(trimmed)) {
            toast.info(`La categoría "${trimmed}" ya existe.`);
            setFormData({ ...formData, category: trimmed });
        } else {
            setCustomCategories(prev => [...prev, trimmed]);
            setFormData({ ...formData, category: trimmed });
            toast.success(`Categoría "${trimmed}" creada exitosamente.`);
        }
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    const filteredProducts = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(lower) ||
                p.code.toLowerCase().includes(lower) ||
                p.description?.toLowerCase().includes(lower);
            const matchesCategory = selectedCategory === '' || selectedCategory === 'Todos' || p.category === selectedCategory;
            const matchesType = selectedType === 'All' || p.type === selectedType;
            return matchesSearch && matchesCategory && matchesType;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [products, searchTerm, selectedCategory, selectedType]);

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
            toast.info(`Editando: ${product.name}`);
        } else {
            setEditingProduct(null);
            const autoCode = `SKU-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
            setFormData({ ...initialProductState, code: autoCode });
            toast.info('Creando nuevo producto');
        }
        setCurrentStep(1);
        setIsModalOpen(true);
    };

    const handleDuplicate = (product: Product) => {
        const baseCode = product.code.replace(/-\d+$/, '');
        const sameBase = products.filter(p => p.code.startsWith(baseCode));
        const nextNum = sameBase.length + 1;
        const newCode = `${baseCode}-${nextNum}`;

        setEditingProduct(null);
        setFormData({ ...product, id: undefined, code: newCode });
        setCurrentStep(1);
        setIsModalOpen(true);
        toast.info(`Duplicando: Sugiriendo código ${newCode}`);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Eliminar producto ${name}?`)) {
            await deleteProduct(id);
            toast.success("Producto eliminado");
        }
    };

    const handleSaveProduct = async () => {
        console.log('Intentando guardar producto:', formData);

        if (!formData.code || !formData.name || !formData.supplierId) {
            const missing: string[] = [];
            if (!formData.code) missing.push("Código");
            if (!formData.name) missing.push("Nombre");
            if (!formData.supplierId) missing.push("Proveedor");
            toast.error(`Campos obligatorios faltantes: ${missing.join(", ")}`);
            return;
        }

        const currentPrice: any = formData.unitPrice;
        const priceToSave = typeof currentPrice === 'string' ? parseFloat(currentPrice.replace(/,/g, '.')) || 0 : (currentPrice || 0);
        const payloadToSave = { ...formData, unitPrice: priceToSave };

        try {
            if (editingProduct) {
                console.log('Actualizando producto existente:', editingProduct.id);
                await updateProduct(editingProduct.id, { ...payloadToSave, isActive: formData.isActive ?? true });
                toast.success("Producto actualizado correctamente");
            } else {
                console.log('Creando nuevo producto');
                await addProduct({
                    ...payloadToSave as Product,
                    id: Date.now().toString(),
                    isActive: true
                });
                toast.success("Producto registrado exitosamente");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error en handleSaveProduct:', error);
            toast.error("Error al guardar el producto. Verifique su conexión.");
        }
    };

    const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Buyer' || currentUser?.permissions?.products_edit;

    return (
        <div className="content-container section-spacing py-6">
            {/* Header section with executive feel */}
            <header className="space-y-8 px-2 md:px-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <Tag className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Gestión de Catálogo</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mobile-title">
                            Inventario <span className="text-blue-600 italic">Maestro.</span>
                        </h1>
                        <p className="text-slate-500 text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                            Control centralizado de referencias, servicios y recursos operativos del grupo MIP.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="p-4 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                            title="Importación Masiva"
                        >
                            <Upload className="w-5 h-5" />
                        </button>
                        {canEdit ? (
                            <button
                                onClick={() => handleOpenModal()}
                                className="premium-button min-w-[180px]"
                            >
                                <Plus className="w-5 h-5" />
                                Nuevo Item
                            </button>
                        ) : (
                            <div className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl flex items-center gap-3 border border-slate-200">
                                <Eye className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Solo Lectura</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categorizer & Search combined in a glass bar */}
                <div className="premium-glass p-3 rounded-[2.5rem] flex flex-col lg:flex-row gap-4 sticky top-24 z-40">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar en el catálogo maestro..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[1.75rem] text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                        />
                    </div>
                    <div className="flex gap-2 p-1 overflow-x-auto scrollbar-hide no-print">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat === 'Todos' ? '' : cat)}
                                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${(selectedCategory === cat || (cat === 'Todos' && selectedCategory === ''))
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                                    : 'bg-white text-slate-400 hover:bg-white hover:text-slate-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Type Filtering Pills */}
            <div className="flex gap-3 px-2 overflow-x-auto scrollbar-hide">
                {['All', 'Producto', 'Servicio', 'Alquiler'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type as any)}
                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${selectedType === type
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}
                    >
                        {type === 'All' ? 'Todos los Tipos' : type}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 md:px-0">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            key={product.id}
                            className="premium-card p-6 flex flex-col h-full group cursor-pointer mobile-card"
                            onClick={() => canEdit ? handleOpenModal(product) : toast.info("Modo lectura activo")}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                    <Package className="w-6 h-6" />
                                </div>

                                {canEdit && (
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDuplicate(product); }}
                                            className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl shadow-sm transition-all"
                                            title="Duplicar"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id, product.name); }}
                                            className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 rounded-xl shadow-sm transition-all"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-3 mb-8">
                                <div className="flex items-center gap-2">
                                    <span className="text-[7px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-widest leading-none">
                                        {product.category}
                                    </span>
                                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                        #{product.code}
                                    </span>
                                </div>
                                <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight line-clamp-2">
                                    {product.name}
                                </h3>
                                <p className="text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">
                                    {product.description || 'Referencia estándar sin descripción técnica detallada.'}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-end justify-between">
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio Unitario</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-blue-600 font-bold text-xs">$</span>
                                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                            {Number(product.unitPrice).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] font-black text-slate-400 uppercase mb-1">{product.unit}</div>
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${product.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                                        }`}>
                                        <div className={`w-1 h-1 rounded-full ${product.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        <span className="text-[7px] font-black uppercase tracking-widest">
                                            {product.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        <PackageSearch className="w-12 h-12 text-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Sin resultados</h4>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto">No encontramos items que coincidan con tus criterios de búsqueda en el catálogo maestro.</p>
                    </div>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                        className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                        Limpiar todos los filtros
                    </button>
                </div>
            )}

            {/* MODALS REFINED WITH PREMIUM STYLE */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-visible flex flex-col max-h-[95vh] md:max-h-[88vh]">
                            {/* Header */}
                            <div className="p-6 md:p-8 pb-4 md:pb-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between shrink-0 rounded-t-[2.5rem] md:rounded-t-[2.5rem]">
                                <div className="space-y-1">
                                    <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tighter uppercase">{editingProduct ? 'Editar' : 'Nuevo'} <span className="text-blue-600 italic">Recurso</span></h2>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{editingProduct ? `Folio: ${editingProduct.code}` : 'Catálogo Maestro MIP'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-all active:scale-90"><X className="w-5 h-5" /></button>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 overflow-y-auto overflow-x-visible scrollbar-hide flex-1">
                                <div className="space-y-5">
                                    {/* Row 1: Name (full width) */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nombre Comercial <span className="text-red-500">*</span></label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-black text-sm uppercase ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all"
                                            placeholder="EJ: SERVICIO DE MANTENIMIENTO PREVENTIVO"
                                        />
                                    </div>

                                    {/* Row 2: Code + Price */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Código Interno <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    value={formData.code}
                                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-xs uppercase ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all"
                                                    placeholder="SKU-XXXX"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Costo Estándar</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm">$</span>
                                                <input
                                                    type="number" step="any"
                                                    value={formData.unitPrice === 0 && !editingProduct ? '' : formData.unitPrice}
                                                    onChange={e => setFormData({ ...formData, unitPrice: e.target.value as any })}
                                                    className="w-full pl-10 pr-4 py-4 bg-slate-50 rounded-2xl font-black font-mono text-xs ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Category + Unit */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Categoría</label>
                                            {isAddingCategory ? (
                                                <div className="flex gap-2">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={newCategoryName}
                                                        onChange={e => setNewCategoryName(e.target.value.toUpperCase())}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') { setIsAddingCategory(false); setNewCategoryName(''); } }}
                                                        className="flex-1 px-3 py-3.5 bg-blue-50 rounded-xl font-black text-xs uppercase ring-2 ring-blue-400/50 outline-none transition-all"
                                                        placeholder="Nueva categoría..."
                                                    />
                                                    <button type="button" onClick={handleAddCategory} className="px-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95" title="Confirmar">
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                    <button type="button" onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }} className="px-3 bg-slate-200 text-slate-500 rounded-xl hover:bg-slate-300 transition-all active:scale-95" title="Cancelar">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.category}
                                                    onChange={e => {
                                                        if (e.target.value === '__ADD_NEW__') {
                                                            setIsAddingCategory(true);
                                                        } else {
                                                            setFormData({ ...formData, category: e.target.value });
                                                        }
                                                    }}
                                                    className="w-full px-4 py-4 bg-slate-50 rounded-2xl font-black text-xs uppercase ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                                    <option value="__ADD_NEW__" className="text-blue-600 font-bold">＋ Agregar nueva...</option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Unidad de Medida</label>
                                            <select
                                                value={formData.unit}
                                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                                className="w-full px-4 py-4 bg-slate-50 rounded-2xl font-black text-xs uppercase ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                {PRODUCT_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Row 4: Type */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Naturaleza del Recurso</label>
                                        <div className="flex gap-2">
                                            {[
                                                { value: 'Producto', label: 'Producto', icon: Package },
                                                { value: 'Servicio', label: 'Servicio', icon: Zap },
                                                { value: 'Alquiler', label: 'Alquiler', icon: ShoppingBag }
                                            ].map(opt => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: opt.value as ProductType })}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border active:scale-95 ${formData.type === opt.value
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                                                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    <opt.icon className="w-4 h-4" />
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 pt-1">
                                        <div className="flex-1 h-px bg-slate-100" />
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Detalles Adicionales</span>
                                        <div className="flex-1 h-px bg-slate-100" />
                                    </div>

                                    {/* Row 5: Supplier (with SearchableSelect) */}
                                    <div className="space-y-2 relative z-[130]">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Proveedor Preferente <span className="text-red-500">*</span></label>
                                        <SearchableSelect
                                            options={suppliers.map(s => ({ value: s.id, label: s.name }))}
                                            value={formData.supplierId || ''}
                                            onChange={(val) => setFormData({ ...formData, supplierId: val })}
                                            placeholder="Busque un proveedor en el sistema..."
                                        />
                                    </div>

                                    {/* Row 6: Description */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Especificaciones Técnicas</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-medium text-xs ring-1 ring-slate-100 focus:ring-blue-500/30 outline-none transition-all h-24 resize-none"
                                            placeholder="Detalle aquí medidas, marcas, calidades o alcances del servicio..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 md:p-8 pt-4 md:pt-4 bg-slate-50/80 border-t border-slate-100 flex gap-3 sticky bottom-0 z-10 shrink-0">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    Descartar
                                </button>
                                <button
                                    onClick={handleSaveProduct}
                                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingProduct ? 'Actualizar Registro' : 'Inscribir en Catálogo'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* IMPORT MODAL REFINED */}
            <AnimatePresence>
                {isImportModalOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsImportModalOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 text-center overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-2 bg-blue-600" />
                            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <FileSpreadsheet className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-950 tracking-tighter mb-4">Carga Masiva</h2>
                            <p className="text-xs font-medium text-slate-500 mb-10">Selecciona un archivo Excel (.xlsx) para actualizar el catálogo maestro MIP.</p>

                            <label className="flex flex-col items-center gap-6 p-12 border-4 border-dashed border-slate-50 rounded-[2.5rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group active:scale-95">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600">Explorar Archivos</span>
                                <input type="file" accept=".xlsx, .xls, .csv" onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setIsImporting(true);
                                        await importProducts(file);
                                        setIsImporting(false);
                                        setIsImportModalOpen(false);
                                        toast.success("Catálogo actualizado correctamente");
                                    }
                                }} className="hidden" />
                            </label>

                            {isImporting && (
                                <div className="mt-8 flex flex-col items-center gap-3">
                                    <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Procesando Bases de Datos...</span>
                                </div>
                            )}

                            <button onClick={() => setIsImportModalOpen(false)} className="mt-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                Cancelar Proceso
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};