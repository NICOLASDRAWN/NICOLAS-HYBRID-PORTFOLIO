import React, { useMemo, useState } from 'react';
import { useDb } from '../store/db';
import {
    Calendar, ChevronLeft, ChevronRight, FileText, DollarSign, TrendingUp,
    Package, Truck, Clock, CheckCircle, XCircle, Download, BarChart3,
    ArrowUpRight, ArrowDownRight, Layers, RefreshCw, Star, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const StatCard: React.FC<{ title: string; value: string | number; change: string; icon: React.ElementType; color: string }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all mobile-card card-inner-compact">
        <div className={`absolute right-0 top-0 w-16 h-16 md:w-20 md:h-20 ${color} opacity-5 rounded-bl-[2.5rem] -mr-3 -mt-3 transition-transform group-hover:scale-110 duration-500`}></div>
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                {change !== '0' && (
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${parseFloat(change) >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {parseFloat(change) >= 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{value}</p>
                <p className="text-[7.5px] md:text-[8.5px] text-slate-400 font-black uppercase tracking-widest">{title}</p>
            </div>
        </div>
    </div>
);

export const MonthlyReport: React.FC = () => {
    const { orders, settings } = useDb();

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        orders.forEach(order => {
            const date = new Date(order.date);
            months.add(`${date.getFullYear()}-${date.getMonth()}`);
        });
        return Array.from(months).sort().reverse();
    }, [orders]);

    const monthlyOrders = useMemo(() => {
        return orders.filter(order => {
            const date = new Date(order.date);
            return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        });
    }, [orders, selectedMonth, selectedYear]);

    const stats = useMemo(() => {
        const totalOrders = monthlyOrders.length;
        const totalAmount = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
        const totalTax = monthlyOrders.reduce((sum, o) => sum + (o.tax || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

        const byStatus: Record<string, { count: number; amount: number }> = {};
        monthlyOrders.forEach(o => {
            if (!byStatus[o.status]) byStatus[o.status] = { count: 0, amount: 0 };
            byStatus[o.status].count++;
            byStatus[o.status].amount += o.total;
        });

        const bySupplier: Record<string, { name: string; count: number; amount: number }> = {};
        monthlyOrders.forEach(o => {
            if (!bySupplier[o.supplierId]) {
                bySupplier[o.supplierId] = { name: o.supplierName, count: 0, amount: 0 };
            }
            bySupplier[o.supplierId].count++;
            bySupplier[o.supplierId].amount += o.total;
        });

        const topSuppliers = Object.values(bySupplier)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        return {
            totalOrders, totalAmount, totalTax, avgOrderValue,
            byStatus, bySupplier, topSuppliers
        };
    }, [monthlyOrders]);

    const previousMonthStats = useMemo(() => {
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;

        const prevOrders = orders.filter(order => {
            const date = new Date(order.date);
            return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
        });

        return {
            totalOrders: prevOrders.length,
            totalAmount: prevOrders.reduce((sum, o) => sum + o.total, 0)
        };
    }, [orders, selectedMonth, selectedYear]);

    const growth = {
        orders: previousMonthStats.totalOrders > 0
            ? ((stats.totalOrders - previousMonthStats.totalOrders) / previousMonthStats.totalOrders * 100).toFixed(1)
            : '0',
        amount: previousMonthStats.totalAmount > 0
            ? ((stats.totalAmount - previousMonthStats.totalAmount) / previousMonthStats.totalAmount * 100).toFixed(1)
            : '0'
    };

    const downloadReport = () => {
        if (monthlyOrders.length === 0) {
            toast.error('No hay datos para exportar');
            return;
        }

        try {
            const reportData = monthlyOrders.map(o => ({
                'N° Orden': o.sequenceNumber,
                'Fecha': new Date(o.date).toLocaleDateString('es-ES'),
                'Proveedor': o.supplierName,
                'NIT': o.supplierTaxId,
                'Estado': o.status,
                'Total': o.total,
                'Items': o.items.length
            }));

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reportData), 'Órdenes');
            XLSX.writeFile(wb, `Reporte_MIP_${MONTHS_ES[selectedMonth]}_${selectedYear}.xlsx`);
            toast.success("Reporte generado correctamente");
        } catch (err) {
            toast.error('Error al generar el reporte');
        }
    };

    return (
        <div className="content-container section-spacing py-6">

            {/* Premium Month Selector Header */}
            <section className="bg-slate-900 rounded-2xl md:rounded-[3rem] p-4 md:p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                        <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 backdrop-blur-3xl rounded-xl md:rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                            <Calendar className="w-6 h-6 md:w-10 md:h-10 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1 md:mb-2 leading-none">Reporte Mensual</p>
                            <h2 className="text-xl md:text-5xl font-black tracking-tighter uppercase leading-none mobile-title">
                                {MONTHS_ES[selectedMonth]} <span className="text-blue-500">{selectedYear}</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6 bg-white/5 p-2 md:p-3 rounded-xl md:rounded-[2.5rem] backdrop-blur-xl border border-white/5 w-full md:w-auto justify-between md:justify-start">
                        <button onClick={() => { if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1); } else { setSelectedMonth(selectedMonth - 1); } }}
                            title="Mes Anterior"
                            className="p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-lg md:rounded-2xl transition-all active:scale-95"><ChevronLeft className="w-4 h-4 md:w-6 md:h-6" /></button>

                        <div className="flex gap-1 md:gap-1.5 px-2 md:px-4">
                            {[...Array(12)].map((_, idx) => (
                                <div key={idx} className={`w-1 md:w-1.5 h-4 md:h-6 rounded-full transition-all ${selectedMonth === idx ? 'bg-blue-500 w-3 md:w-4' : 'bg-white/10'}`} />
                            ))}
                        </div>

                        <button onClick={() => { if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1); } else { setSelectedMonth(selectedMonth + 1); } }}
                            title="Mes Siguiente"
                            className="p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-lg md:rounded-2xl transition-all active:scale-95"><ChevronRight className="w-4 h-4 md:w-6 md:h-6" /></button>
                    </div>

                    <button onClick={downloadReport} className="w-full md:w-auto px-6 md:px-10 py-3.5 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[9px] md:text-xs shadow-xl shadow-blue-500/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                        <Download className="w-4 h-4 md:w-5 md:h-5" /> Exportar Reporte
                    </button>
                </div>
            </section>

            {/* Grid de KPIs */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2">
                <StatCard title="Órdenes" value={stats.totalOrders} change={growth.orders} icon={FileText} color="bg-blue-600" />
                <StatCard title="Ejecutado" value={`${settings.currencySymbol}${(stats.totalAmount / 1000).toFixed(1)}k`} change={growth.amount} icon={DollarSign} color="bg-emerald-600" />
                <StatCard title="Promedio" value={`${settings.currencySymbol}${(stats.avgOrderValue / 1000).toFixed(1)}k`} change="0" icon={BarChart3} color="bg-indigo-600" />
                <StatCard title="Aliados" value={stats.topSuppliers.length} change="0" icon={Truck} color="bg-amber-500" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Status Table View */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Distribución por Estado</h3>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(stats.byStatus).map(([status, data]) => (
                            <div key={status} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition-all group">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{status}</p>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{data.count} Órdenes Registradas</p>
                                </div>
                                <p className="text-xl font-black text-slate-900 font-mono tracking-tighter">
                                    {settings.currencySymbol}{Number(data.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        ))}
                        {Object.keys(stats.byStatus).length === 0 && (
                            <div className="py-20 text-center text-slate-300 italic">No hay transacciones registradas</div>
                        )}
                    </div>
                </div>

                {/* Top Suppliers List */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                            <Star className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Principales Aliados</h3>
                    </div>
                    <div className="space-y-4">
                        {stats.topSuppliers.map((supplier, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 md:p-6 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-lg transition-all gap-4">
                                <div className="flex items-center gap-4 md:gap-5 min-w-0 flex-1">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg shadow-lg">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{supplier.count} Órdenes</p>
                                        <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase truncate" title={supplier.name}>{supplier.name}</h4>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm md:text-lg font-black text-slate-900 font-mono italic">{settings.currencySymbol}{Number(supplier.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Insight */}
            <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Info className="w-6 h-6 text-blue-600" />
                    <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest leading-loose">
                        Este reporte contiene la consolidación de transacciones mensuales procesadas en el core de MIP.
                    </p>
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Sync: Automática</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
};
