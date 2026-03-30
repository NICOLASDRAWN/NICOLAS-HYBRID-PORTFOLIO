import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ShoppingCart, Truck, Package, X, ArrowRight, Activity, Zap, Clock, Plus } from 'lucide-react';
import { useDb } from '../store/db';
import { useNavigate } from 'react-router-dom';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { orders, suppliers, products } = useDb();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);
    const results = query.trim() === ''
        ? [
            ...orders.filter(o => o.status === 'Draft').slice(0, 3).map(o => ({
                type: 'order_draft',
                id: o.id,
                title: `Continuar Borrador: ${o.supplierName || 'MIP' + o.sequenceNumber}`,
                subtitle: `Última edición: ${new Date(o.date).toLocaleDateString()}`,
                icon: Clock
            })),
            { type: 'action', id: 'new-order', title: 'Crear Nueva Orden de Compra', subtitle: 'Acceso rápido al asistente', icon: Plus },
            { type: 'action', id: 'inventory', title: 'Consultar Inventarios', subtitle: 'Ver existencias en bodegas', icon: Package },
            { type: 'action', id: 'products', title: 'Catálogo de Productos', subtitle: 'Gestionar ítems y servicios', icon: Zap },
            { type: 'action', id: 'reports', title: 'Reportes y Analítica', subtitle: 'Dashboard de gestión mensual', icon: Activity }
        ]
        : [
            // Navigation Matches
            ...[
                { id: 'dashboard', title: 'Dashboard Principal', sub: 'Vista general', keywords: ['inicio', 'home', 'panel'] },
                { id: 'reports', title: 'Reportes Mensuales', sub: 'KPIs y Estadísticas', keywords: ['reporte', 'estadistica', 'mensual'] },
                { id: 'inventory', title: 'Inventario', sub: 'Control de Stock', keywords: ['stock', 'existencias', 'bodega'] },
                { id: 'suppliers', title: 'Directorio de Proveedores', sub: 'Gestión de Aliados', keywords: ['proveedor', 'aliado', 'socio'] }
            ].filter(nav =>
                nav.title.toLowerCase().includes(query.toLowerCase()) ||
                nav.keywords.some(k => k.includes(query.toLowerCase()))
            ).map(nav => ({ type: 'action', id: nav.id, title: nav.title, subtitle: nav.sub, icon: ArrowRight })),

            ...orders.filter(o =>
                (o.sequenceNumber?.toString() || '').includes(query) ||
                o.supplierName.toLowerCase().includes(query.toLowerCase())
            ).map(o => ({ type: 'order', id: o.id, title: `Orden MIP${o.sequenceNumber || '---'}`, subtitle: o.supplierName, icon: ShoppingCart })),

            ...suppliers.filter(s =>
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                s.taxId.includes(query)
            ).map(s => ({ type: 'supplier', id: s.id, title: s.name, subtitle: `NIT: ${s.taxId}`, icon: Truck })),

            ...products.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.code.toLowerCase().includes(query.toLowerCase())
            ).map(p => ({ type: 'product', id: p.id, title: p.name, subtitle: `Cod: ${p.code}`, icon: Package }))
        ].slice(0, 8);

    const handleSelect = (item: any) => {
        if (!item) return;
        onClose();
        if (item.type === 'order') navigate(`/create-order?id=${item.id}&view=pdf`);
        if (item.type === 'order_draft') navigate(`/create-order?id=${item.id}`);
        if (item.type === 'supplier') navigate(`/suppliers`);
        if (item.type === 'product') navigate(`/products`);
        if (item.type === 'action') {
            if (item.id === 'new-order') navigate('/create-order');
            if (item.id === 'inventory') navigate('/inventory');
            if (item.id === 'reports') navigate('/monthly-report');
            if (item.id === 'dashboard') navigate('/dashboard');
            if (item.id === 'suppliers') navigate('/suppliers');
        }
    };

    // Handle Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();

            if (results.length > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % results.length);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSelect(results[selectedIndex]);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, results, selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_32px_128px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20"
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-4 px-8 py-6 border-b border-slate-100">
                            <Search className="w-6 h-6 text-slate-400" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Busca órdenes, proveedores o funciones de acceso rápido..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                            />
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
                                <Command className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] font-black text-slate-500">ESC</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                            {results.length > 0 ? (
                                <div className="space-y-2">
                                    {query.trim() === '' && (
                                        <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                                            Acciones Rápidas
                                        </p>
                                    )}
                                    {query.trim() !== '' && (
                                        <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                                            Resultados ({results.length})
                                        </p>
                                    )}
                                    {results.map((item, idx) => (
                                        <button
                                            key={`${item.type}-${item.id}`}
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all text-left border border-transparent ${selectedIndex === idx ? 'bg-slate-50 border-slate-100' : ''}`}
                                        >
                                            <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all duration-300 ${selectedIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-black transition-colors ${selectedIndex === idx ? 'text-blue-600' : 'text-slate-900'}`}>{item.title}</h4>
                                                <p className={`text-[11px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${selectedIndex === idx ? 'text-slate-500' : 'text-slate-400'}`}>{item.subtitle}</p>
                                            </div>
                                            <ArrowRight className={`w-4 h-4 text-slate-300 transition-all ${selectedIndex === idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <X className="w-8 h-8 text-rose-500" />
                                    </div>
                                    <p className="text-slate-900 font-black text-lg">No se han encontrado coincidencias</p>
                                    <p className="text-slate-400 font-medium text-sm mt-1 uppercase tracking-widest">Intenta con otros términos</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-50 px-8 py-4 flex items-center justify-between border-t border-slate-100">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black shadow-sm">Enter</kbd>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccionar</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black shadow-sm">↑↓</kbd>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navegar</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MIP AI-SEARCH V4.0</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
