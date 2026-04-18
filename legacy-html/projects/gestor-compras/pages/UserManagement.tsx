import React, { useState } from 'react';
import { useDb } from '../store/db';
import {
    Users, Plus, Edit2, Trash2, Save, X, Shield, Eye, EyeOff,
    CheckCircle, XCircle, Settings, Lock, Unlock, Mail, User as UserIcon, Key, ArrowRight, ShieldCheck, Zap, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserPermissions } from '../types';

// Permisos predefinidos por rol
const ROLE_PERMISSIONS: Record<string, UserPermissions> = {
    Admin: {
        orders_create: true, orders_edit: true, orders_delete: true, orders_approve: true, orders_view_all: true, orders_view_own: true,
        suppliers_create: true, suppliers_edit: true, suppliers_delete: true, suppliers_view: true, suppliers_import: true,
        products_create: true, products_edit: true, products_delete: true, products_view: true, products_import: true,
        inventory_receive: true, inventory_view: true, inventory_manage_warehouses: true,
        finance_view_reports: true, finance_export: true, finance_register_payments: true,
        config_manage_users: true, config_global_settings: true, config_upload_assets: true, config_email: true,
    },
    Approver: {
        orders_create: false, orders_edit: true, orders_delete: false, orders_approve: true, orders_view_all: true, orders_view_own: true,
        suppliers_create: false, suppliers_edit: false, suppliers_delete: false, suppliers_view: true, suppliers_import: false,
        products_create: false, products_edit: false, products_delete: false, products_view: true, products_import: false,
        inventory_receive: true, inventory_view: true, inventory_manage_warehouses: true,
        finance_view_reports: true, finance_export: true, finance_register_payments: false,
        config_manage_users: false, config_global_settings: false, config_upload_assets: false, config_email: false,
    },
    Buyer: {
        orders_create: true, orders_edit: true, orders_delete: false, orders_approve: false, orders_view_all: true, orders_view_own: true,
        suppliers_create: true, suppliers_edit: true, suppliers_delete: true, suppliers_view: true, suppliers_import: true,
        products_create: true, products_edit: true, products_delete: true, products_view: true, products_import: true,
        inventory_receive: true, inventory_view: true, inventory_manage_warehouses: true,
        finance_view_reports: true, finance_export: true, finance_register_payments: false,
        config_manage_users: false, config_global_settings: false, config_upload_assets: false, config_email: false,
    },
    Viewer: {
        orders_create: false, orders_edit: false, orders_delete: false, orders_approve: false, orders_view_all: true, orders_view_own: true,
        suppliers_create: false, suppliers_edit: false, suppliers_delete: false, suppliers_view: true, suppliers_import: false,
        products_create: false, products_edit: false, products_delete: false, products_view: true, products_import: false,
        inventory_receive: false, inventory_view: true, inventory_manage_warehouses: false,
        finance_view_reports: true, finance_export: false, finance_register_payments: false,
        config_manage_users: false, config_global_settings: false, config_upload_assets: false, config_email: false,
    },
};

interface ExtendedUser extends User {
    password: string;
}

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

export const UserManagement: React.FC = () => {
    const { users, currentUser, addUser, updateUser, deleteUser } = useDb();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
    const [showPermissions, setShowPermissions] = useState(false);

    const [formData, setFormData] = useState<ExtendedUser>({
        id: '',
        name: '',
        username: '',
        password: '',
        role: 'Viewer',
        isActive: true,
        permissions: ROLE_PERMISSIONS.Viewer,
    });

    const handleOpenModal = (user?: ExtendedUser) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                ...user,
                permissions: user.permissions || ROLE_PERMISSIONS[user.role],
            });
        } else {
            setEditingUser(null);
            setFormData({
                id: '',
                name: '',
                username: '',
                password: '',
                role: 'Viewer',
                isActive: true,
                permissions: ROLE_PERMISSIONS.Viewer,
            });
        }
        setIsModalOpen(true);
        setShowPermissions(false);
    };

    const handleRoleChange = (role: ExtendedUser['role']) => {
        setFormData({
            ...formData,
            role,
            permissions: ROLE_PERMISSIONS[role],
        });
    };

    const handlePermissionToggle = (permission: keyof UserPermissions) => {
        setFormData({
            ...formData,
            permissions: {
                ...formData.permissions!,
                [permission]: !formData.permissions![permission],
            },
        });
    };

    const handleSave = async () => {
        if (!formData.name || !formData.username || (!editingUser && !formData.password)) {
            toast.error('Campos obligatorios requeridos');
            return;
        }

        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
                toast.success('Perfil actualizado');
            } else {
                await addUser({ ...formData, id: Date.now().toString(), isActive: true });
                toast.success('Usuario registrado');
            }
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Error al guardar');
        }
    };

    const handleDelete = async (userId: string) => {
        if (userId === currentUser?.id) return toast.error('Imposible auto-eliminar');
        if (confirm('¿Dar de baja a este operador?')) {
            try { await deleteUser(userId); toast.success('Usuario eliminado'); }
            catch (error) { toast.error('Error al eliminar'); }
        }
    };

    return (
        <div className="content-container section-spacing py-6">

            {/* Native Style Header */}
            <section className="space-y-3 md:space-y-6 px-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mobile-title">
                            Control <span className="text-blue-600">Acceso</span>
                        </h1>
                        <p className="text-[7.5px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-0.5 md:mt-2">Seguridad y Permisos</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="px-5 md:px-8 py-3 md:py-4 bg-slate-900 text-white rounded-xl md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden md:inline">Nuevo Operador</span><span className="md:hidden">Nuevo</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 scrollbar-hide">
                    <StatPill title="Activos" value={users.filter(u => u.isActive).length} icon={Users} color="bg-blue-600" delay={0.1} />
                    <StatPill title="Admins" value={users.filter(u => u.role === 'Admin').length} icon={ShieldCheck} color="bg-indigo-600" delay={0.2} />
                    <StatPill title="Sesiones" value="24" icon={Zap} color="bg-amber-500" delay={0.3} />
                    <StatPill title="Cifrado" value="256-bit" icon={Lock} color="bg-emerald-600" delay={0.4} />
                </div>
            </section>

            {/* Users Grid - Native Large Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {users.map((u, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={u.id}
                            className={`bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col mobile-card ${!u.isActive ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-blue-50/50 rounded-bl-full -mr-10 -mt-10 md:-mr-16 md:-mt-16 z-0 group-hover:bg-blue-100 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4 md:mb-8">
                                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                        <UserIcon className="w-5 h-5 md:w-8 md:h-8" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(u as ExtendedUser)} title="Editar Usuario" aria-label="Editar Usuario" className="p-2 md:p-3 bg-white/80 backdrop-blur-xl text-slate-400 rounded-lg md:rounded-xl hover:text-blue-600 shadow-sm border border-slate-50 transition-all"><Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                                        {currentUser?.id !== u.id && (
                                            <button onClick={() => handleDelete(u.id)} title="Eliminar Usuario" aria-label="Eliminar Usuario" className="p-2 md:p-3 bg-white/80 backdrop-blur-xl text-slate-400 rounded-lg md:rounded-xl hover:text-rose-600 shadow-sm border border-slate-50 transition-all"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 mb-4 md:mb-8">
                                    <div className="flex items-center gap-2 mb-1.5 md:mb-3">
                                        <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg border
                                                ${u.role === 'Admin' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                u.role === 'Approver' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                            {u.role}
                                        </span>
                                        <span className="text-[7.5px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest">@{u.username}</span>
                                    </div>
                                    <h3 className="text-base md:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-tight tracking-tight">{u.name}</h3>
                                </div>

                                <div className="pt-3 md:pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <div className={`w-1 h-1 md:w-2 md:h-2 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                        <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{u.isActive ? 'Activo' : 'De Baja'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <div className="flex -space-x-1.5 md:-space-x-2">
                                            <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[5.5px] md:text-[8px] font-black">A</div>
                                            <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[5.5px] md:text-[8px] font-black">E</div>
                                            <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[5.5px] md:text-[8px] font-black">S</div>
                                        </div>
                                        <span className="text-[6.5px] md:text-[9px] font-black text-slate-300 uppercase">256-BIT</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>

            {/* FORM MODAL - Mobile Optimized */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full md:max-w-4xl bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:max-h-[90vh]">

                            <div className="w-full md:w-72 bg-slate-900 p-6 md:p-10 text-white flex flex-row md:flex-col items-center md:text-center justify-between md:justify-start gap-4 shrink-0">
                                <div className="flex items-center gap-4 md:flex-col">
                                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[2rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 shrink-0">
                                        <Shield className="w-6 h-6 md:w-10 md:h-10" />
                                    </div>
                                    <div className="text-left md:text-center">
                                        <h2 className="text-xl md:text-2xl font-black tracking-tighter leading-none">{editingUser ? 'Ajustes' : 'Nuevo'} <span className="text-blue-400">Operador</span></h2>
                                        <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed mt-1 md:mt-0">Gestión de Credenciales</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} title="Cerrar modal" className="md:hidden p-2 bg-white/10 rounded-full text-white"><X className="w-5 h-5" /></button>
                                <div className="hidden md:block mt-8 pt-8 border-t border-white/5 w-full">
                                    <div className="flex items-center justify-center gap-2 text-blue-400">
                                        <Lock className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cifrado Total</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-5 md:p-10 overflow-y-auto scrollbar-hide bg-slate-50/50 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6 md:mb-10 sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm py-2">
                                    <div className="bg-white p-1 rounded-xl md:rounded-2xl border border-slate-100 flex gap-1 md:gap-2 w-full md:w-auto shadow-sm">
                                        {['Básicos', 'Privilegios'].map((t, idx) => (
                                            <button key={t} onClick={() => setShowPermissions(idx === 1)}
                                                className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all
                                                    ${(idx === (showPermissions ? 1 : 0)) ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400'}`}>{t}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} title="Cerrar modal" className="hidden md:block p-4 bg-white rounded-2xl text-slate-300 hover:text-slate-900 shadow-sm transition-all"><X className="w-6 h-6" /></button>
                                </div>

                                {!showPermissions ? (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-left duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Nombre Completo</label>
                                                <input type="text" placeholder="Ej: María Alejandra" title="Nombre Completo" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-8 py-5 bg-white border-none rounded-[1.5rem] font-black text-sm outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Username</label>
                                                <input type="text" placeholder="ej: maria.mip" title="Nombre de usuario" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                                                    className="w-full px-8 py-5 bg-white border-none rounded-[1.5rem] font-black text-sm outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Clave Maestra</label>
                                                <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full px-8 py-5 bg-white border-none rounded-[1.5rem] font-black text-sm outline-none focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Asignar Rol Jerárquico</label>
                                                <div className="bg-white p-1.5 md:p-2 rounded-[1.5rem] border border-slate-100 grid grid-cols-2 gap-2 shadow-sm">
                                                    {Object.keys(ROLE_PERMISSIONS).map(role => (
                                                        <button key={role} onClick={() => handleRoleChange(role as any)}
                                                            className={`py-2.5 md:py-3 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all
                                                                ${formData.role === role ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>{role}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
                                            <div className="flex gap-4 items-center">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ${formData.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                                                    {formData.isActive ? <Unlock className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-900 uppercase">Estado de la Cuenta</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{formData.isActive ? 'OPERATIVO TOTAL' : 'ACCESO RESTRINGIDO'}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                                className={`px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg
                                                    ${formData.isActive ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
                                                {formData.isActive ? 'ACTIVO' : 'DAR DE BAJA'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right duration-500">
                                        {['orders', 'suppliers', 'products', 'inventory', 'finance', 'config'].map(group => (
                                            <div key={group} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                    {group}
                                                </h4>
                                                <div className="space-y-2">
                                                    {Object.keys(formData.permissions!).filter(p => p.startsWith(group)).map(perm => (
                                                        <button key={perm} onClick={() => handlePermissionToggle(perm as any)}
                                                            className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all border-2
                                                                ${formData.permissions![perm as keyof UserPermissions] ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-50 text-slate-400'}`}>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">{perm.split('_').slice(1).join(' ')}</span>
                                                            {formData.permissions![perm as keyof UserPermissions] ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-auto pt-6 md:pt-12 flex justify-end pb-safe">
                                    <button onClick={handleSave} className="w-full md:w-auto px-10 md:px-16 py-4 md:py-5 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-[12px] shadow-2xl shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-4 group">
                                        {editingUser ? 'Sincronizar Datos' : 'Finalizar Registro'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
