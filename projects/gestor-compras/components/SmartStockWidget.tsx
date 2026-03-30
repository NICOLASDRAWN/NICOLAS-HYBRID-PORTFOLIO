import React from 'react';
import { InventoryItem, Product } from '../types';
import { AlertTriangle, Package, ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SmartStockWidgetProps {
    inventoryItems: InventoryItem[];
    products: Product[];
}

export const SmartStockWidget: React.FC<SmartStockWidgetProps> = ({ inventoryItems, products }) => {
    const navigate = useNavigate();

    // Filter items needing attention: Low or Out of Stock
    // Sort by urgency (Agotado first)
    const lowStockItems = inventoryItems
        .filter(item => item.status === 'Bajo' || item.status === 'Agotado')
        .sort((a, b) => {
            if (a.status === 'Agotado' && b.status !== 'Agotado') return -1;
            if (a.status !== 'Agotado' && b.status === 'Agotado') return 1;
            return 0;
        });

    if (lowStockItems.length === 0) return null; // Don't show if all good

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl mb-8 relative overflow-hidden group">
            {/* Gradient Border/Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-red-500"></div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl animate-pulse ring-4 ring-red-50/50">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight">Alertas de Inventario</h3>
                        <p className="text-sm font-medium text-slate-500">Se requiere reabastecimiento en {lowStockItems.length} productos.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/inventory')}
                    className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 border border-slate-200"
                >
                    Gestionar Inventario <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockItems.slice(0, 3).map(item => (
                    <div key={item.id} className="relative p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group/item">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="font-extrabold text-slate-700 truncate" title={item.productName}>{item.productName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Package className="w-3 h-3 text-slate-400" />
                                    <p className="text-xs font-semibold text-slate-500 truncate">{item.warehouseName}</p>
                                </div>
                            </div>
                            <span className={`shrink-0 text-[10px] font-black uppercase px-2 py-1 rounded-lg ${item.status === 'Agotado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Disponibilidad</p>
                                <p className="text-sm font-black text-slate-800">
                                    {item.currentStock} <span className="text-xs font-semibold text-slate-400">/ Min: {item.minStock}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/create-order`)}
                                className="p-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-transform active:scale-95 flex items-center gap-2"
                                title="Crear Orden de Compra"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span className="text-xs font-bold hidden sm:inline">Pedir</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {lowStockItems.length > 3 && (
                <div className="mt-4 text-center">
                    <p className="text-xs font-bold text-slate-400">+{lowStockItems.length - 3} productos más requieren atención</p>
                </div>
            )}
        </div>
    );
};
