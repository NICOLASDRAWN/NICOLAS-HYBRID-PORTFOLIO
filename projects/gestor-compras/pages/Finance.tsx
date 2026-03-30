import React, { useMemo, useState } from 'react';
import { useDb } from '../store/db';
import { PieChart, Download, Calendar, DollarSign, FileText, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const StatPill: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; delay?: number }> = ({ title, value, icon: Icon, color, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="flex-shrink-0 bg-white rounded-[2rem] p-6 border border-slate-100 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all group"
    >
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{title}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    </motion.div>
);

export const Finance: React.FC = () => {
    const { orders, settings } = useDb();

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const totals = useMemo(() => {
        let debt = 0;
        let paid = 0;

        orders.forEach(order => {
            if (order.paymentType === 'Credit') {
                debt += order.total;
            } else if (order.paymentType === 'Advance') {
                const paidPart = order.paidAmount ?? (order.total * (order.advancePercentage || 0));
                const debtPart = order.debtAmount ?? (order.total - paidPart);
                paid += Math.round(paidPart);
                debt += Math.round(debtPart);
            } else if ((order.paymentType as string) === 'Full' || (order.paymentType as string) === 'Cash') {
                paid += order.total;
            }
        });

        return { debt, paid, total: debt + paid };
    }, [orders]);

    const monthlyOrders = useMemo(() => {
        return orders.filter(order => {
            const orderDate = new Date(order.date);
            const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
            return orderMonth === selectedMonth;
        });
    }, [orders, selectedMonth]);

    const monthlySummary = useMemo(() => {
        let totalAmount = 0;
        let totalTax = 0;
        let totalOrders = monthlyOrders.length;
        let byStatus: Record<string, number> = {};
        let bySupplier: Record<string, { count: number; amount: number }> = {};
        let byCostCenter: Record<string, number> = {};

        monthlyOrders.forEach(order => {
            const orderTotal = order.total;
            const orderGlobalCC = 'UNASSIGNED';

            totalAmount += orderTotal;
            totalTax += order.tax || 0;

            byStatus[order.status] = (byStatus[order.status] || 0) + 1;

            if (!bySupplier[order.supplierName]) {
                bySupplier[order.supplierName] = { count: 0, amount: 0 };
            }
            bySupplier[order.supplierName].count++;
            bySupplier[order.supplierName].amount += order.total;

            if (order.items && order.items.length > 0) {
                const aiuPct = order.aiuEnabled ? ((Number(order.aiuAdministracion || 0) + Number(order.aiuImprevistos || 0) + Number(order.aiuUtilidad || 0)) / 100) : 0;
                order.items.forEach(item => {
                    const taxRate = item.taxRate === 'custom' ? (Number(item.customTaxRate || 0) / 100) : (Number(item.taxRate) || 0);
                    const itemSub = Number(item.quantity) * Number(item.unitPrice);
                    const itemAiu = itemSub * aiuPct;
                    const itemTotal = order.aiuEnabled ? (itemSub + (itemAiu * taxRate)) : (itemSub * (1 + taxRate));
                    const cc = item.costCenterName ? item.costCenterName : orderGlobalCC;
                    byCostCenter[cc] = (byCostCenter[cc] || 0) + itemTotal;
                });
            } else {
                byCostCenter[orderGlobalCC] = (byCostCenter[orderGlobalCC] || 0) + orderTotal;
            }
        });

        return { totalAmount, totalTax, totalOrders, byStatus, bySupplier, byCostCenter };
    }, [monthlyOrders]);

    const exportToExcel = () => {
        try {
            const data = monthlyOrders.map(order => ({
                'Order #': order.sequenceNumber,
                'Date': new Date(order.date).toLocaleDateString(),
                'Supplier': order.supplierName,
                'Subtotal': order.subtotal,
                'Tax': order.tax,
                'Total': order.total,
                'Payment Type': order.paymentType,
                'Status': order.status,
                'Cost Center': order.items.map(i => i.costCenterName).filter(Boolean).join(', ') || 'N/A'
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Orders');
            XLSX.writeFile(wb, `finance-report-${selectedMonth}.xlsx`);
            toast.success('Reporte exportado exitosamente');
        } catch (error) {
            toast.error('Error al exportar reporte');
        }
    };

    const topSuppliers = useMemo(() => {
        return Object.entries(monthlySummary.bySupplier)
            .sort((a, b) => b[1].amount - a[1].amount)
            .slice(0, 5);
    }, [monthlySummary]);

    const topCostCenters = useMemo(() => {
        return Object.entries(monthlySummary.byCostCenter)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [monthlySummary]);

    return (
        <div className="min-h-screen bg-transparent pb-32 md:pb-10">
            <div className="max-w-[1400px] mx-auto space-y-10">

                {/* Native Style Header */}
                <section className="space-y-3 md:space-y-6 px-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mobile-title">
                                Control <span className="text-blue-600">Financiero</span>
                            </h1>
                            <p className="text-[7.5px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5 md:mt-2">Métricas de Ejecución</p>
                        </div>
                        <button onClick={exportToExcel} className="p-3 md:p-5 bg-white border border-slate-100 rounded-xl md:rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all flex items-center gap-2 text-slate-600 font-black text-[9px] md:text-[10px] uppercase tracking-widest">
                            <Download className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">Exportar</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scrollbar-hide">
                        <StatPill title="Gasto" value={`${settings.currencySymbol}${Number(totals.total / 1000).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}k`} icon={DollarSign} color="bg-blue-600" delay={0.1} />
                        <StatPill title="Pagado" value={`${settings.currencySymbol}${Number(totals.paid / 1000).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}k`} icon={FileText} color="bg-emerald-600" delay={0.2} />
                        <StatPill title="Deuda" value={`${settings.currencySymbol}${Number(totals.debt / 1000).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}k`} icon={TrendingUp} color="bg-rose-500" delay={0.3} />
                        <StatPill title="IVA" value="100%" icon={Activity} color="bg-indigo-600" delay={0.4} />
                    </div>
                </section>

                {/* Period Selector & Analysis Row */}
                <section className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 mobile-card">
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400">
                            <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <p className="text-[7.5px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Período de Análisis</p>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-transparent border-none p-0 text-base md:text-xl font-black text-slate-900 focus:ring-0 outline-none cursor-pointer uppercase"
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 md:gap-10 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                            <p className="text-[7.5px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Órdenes</p>
                            <p className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter">{monthlySummary.totalOrders}</p>
                        </div>
                        <div className="text-right border-l border-slate-100 pl-6 md:pl-10">
                            <p className="text-[7.5px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Monto Mensual</p>
                            <p className="text-base md:text-2xl font-black text-blue-600 tracking-tighter">{settings.currencySymbol}{Number(monthlySummary.totalAmount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </section>

                {/* Charts & Distribution Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Suppliers */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                Porcentaje por Proveedor
                            </h3>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver Todos</button>
                        </div>
                        <div className="space-y-6">
                            {topSuppliers.map(([name, data], idx) => (
                                <div key={name} className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-[11px] font-black text-slate-900 uppercase truncate mb-0.5">{name}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{data.count} Operaciones</p>
                                        </div>
                                        <p className="text-sm font-black text-slate-900 font-mono">{settings.currencySymbol}{Number(data.amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(data.amount / monthlySummary.totalAmount) * 100}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-lg shadow-blue-500/20"
                                        />
                                    </div>
                                </div>
                            ))}
                            {topSuppliers.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Sin datos este mes</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Cost Centers */}
                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <PieChart className="w-5 h-5" />
                                </div>
                                Centros de Costo
                            </h3>
                            <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Detalles CC</button>
                        </div>
                        <div className="space-y-6">
                            {topCostCenters.map(([name, amount], idx) => (
                                <div key={name} className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <p className="text-[11px] font-black text-slate-900 uppercase truncate">{name}</p>
                                        <p className="text-sm font-black text-slate-900 font-mono">{settings.currencySymbol}{Number(amount).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(amount / monthlySummary.totalAmount) * 100}%` }}
                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full shadow-lg shadow-emerald-500/20"
                                        />
                                    </div>
                                </div>
                            ))}
                            {topCostCenters.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Sin datos este mes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Status Distribution - Horizontal Native Row */}
                <section className="space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-2">Estado de Ejecución</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(monthlySummary.byStatus).map(([status, count], idx) => {
                            let color = "bg-slate-900";
                            let icon = <Activity className="w-5 h-5" />;
                            if (status.includes('Approved')) { color = "bg-emerald-600"; icon = <ArrowUpRight className="w-5 h-5" />; }
                            if (status.includes('Pending')) { color = "bg-amber-500"; icon = <TrendingUp className="w-5 h-5" />; }
                            if (status.includes('Rejected')) { color = "bg-rose-500"; icon = <ArrowDownRight className="w-5 h-5" />; }

                            return (
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg mb-6`}>
                                        {icon}
                                    </div>
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{status}</p>
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{count}</p>
                                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-slate-50 rounded-tl-full -mr-8 -mb-8 transition-transform group-hover:scale-150" />
                                </motion.div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};