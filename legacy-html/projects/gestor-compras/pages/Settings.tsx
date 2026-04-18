import React, { useState } from 'react';
import { useDb } from '../store/db';
import {
    Trash2, Edit2, X, Plus, Database, Shield, Eye, EyeOff, Upload,
    Save, Building2, Users, UserPlus, Download, Briefcase, UserCircle,
    Cog, Key, Lock, Unlock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Role } from '../types';

type SettingsTab = 'company' | 'users' | 'data' | 'profile';

export const Settings: React.FC = () => {
    const {
        settings, updateSettings, exportBackup,
        users, addUser, updateUser, deleteUser, currentUser, uploadFile
    } = useDb();

    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [formData, setFormData] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);

    const [newUser, setNewUser] = useState<{ name: string, role: Role, username: string, password: string }>({
        name: '', role: 'Viewer', username: '', password: ''
    });
    const [showNewUserPassword, setShowNewUserPassword] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isAdmin = currentUser?.role === 'Admin';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'number' ? parseFloat(String(e.target.value).replace(/,/g, '.')) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings(formData);
            toast.success('Configuración guardada correctamente');
        } catch (error) {
            toast.error('Error al guardar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.username || !newUser.password) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        const user: User = {
            id: Date.now().toString(),
            name: newUser.name,
            role: newUser.role,
            username: newUser.username,
            password: newUser.password,
            isActive: true
        };

        await addUser(user);
        toast.success('Usuario creado correctamente');
        setNewUser({ name: '', role: 'Viewer', username: '', password: '' });
    };

    const handleDeleteUser = async (id: string) => {
        if (id === currentUser?.id) {
            toast.error('No puedes eliminar tu propia cuenta');
            return;
        }
        if (confirm('¿Está seguro de eliminar este usuario?')) {
            await deleteUser(id);
            toast.success('Usuario eliminado');
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleSaveEditUser = async () => {
        if (!editingUser) return;
        await updateUser(editingUser.id, editingUser);
        toast.success('Usuario actualizado');
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleExportBackup = async () => {
        try {
            await exportBackup();
            toast.success('Backup exportado correctamente');
        } catch (error) {
            toast.error('Error al exportar el backup');
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-10 animate-in fade-in duration-1000">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="px-2">
                        <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter mb-1 md:mb-3 mobile-title">Configuración</h1>
                        <p className="text-[7.5px] md:text-sm font-black text-slate-400 font-mono uppercase tracking-[0.3em] md:tracking-[0.4em]">ADMINISTRACIÓN & PREFERENCIAS</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-12 p-1.5 md:p-2 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl md:rounded-[2.5rem] shadow-xl w-full md:w-fit overflow-x-auto no-scrollbar scrollbar-hide">
                    {[
                        { id: 'profile', label: 'Mi Perfil', icon: UserCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { id: 'company', label: 'Entidad', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', adminOnly: true },
                        { id: 'users', label: 'Seguridad', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50', adminOnly: true },
                        { id: 'data', label: 'Infraestructura', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50', adminOnly: true }
                    ].filter(tab => !tab.adminOnly || isAdmin).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                            className={`px-3 md:px-8 py-2 md:py-4 rounded-xl md:rounded-[1.8rem] text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 md:gap-3 relative overflow-hidden group shrink-0
                                ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-white/60'}`}
                        >
                            <tab.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Profile Settings (For All Users) */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Mi Perfil</h2>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Gestiona tu información personal y firma digital.</p>
                            </div>
                            <div className="p-2 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                            </div>
                        </div>

                        <div className="p-4 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Información Básica</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={currentUser?.name || ''}
                                                disabled
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Usuario / Email</label>
                                            <input
                                                type="text"
                                                value={currentUser?.username || ''}
                                                disabled
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rol Asignado</label>
                                            <span className="inline-flex px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-black text-xs uppercase tracking-widest border border-blue-100">
                                                {currentUser?.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Firma Digital</h3>
                                    <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6">
                                        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                                            Tu firma digital se utilizará para <strong className="text-slate-900">aprobar y validar órdenes de compra</strong>.
                                            Sube una imagen (PNG/JPG) de tu firma manuscrita con fondo transparente preferiblemente.
                                        </p>

                                        <div className="flex flex-col items-center justify-center">
                                            <div className="relative group w-full max-w-[300px] aspect-[3/2] bg-white rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all hover:border-emerald-500 hover:bg-emerald-50/10 mb-4">
                                                {currentUser?.signatureUrl ? (
                                                    <img src={currentUser.signatureUrl} alt="Firma Digital" className="w-full h-full object-contain p-4" />
                                                ) : (
                                                    <div className="text-center p-6">
                                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                                                            <Edit2 className="w-6 h-6 text-slate-300" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sin Firma</p>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transform transition-transform active:scale-95 flex items-center gap-2">
                                                        <Upload className="w-4 h-4" />
                                                        Subir Firma
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file && currentUser) {
                                                                    const toastId = toast.loading('Subiendo firma digital...');
                                                                    try {
                                                                        const url = await uploadFile(file, 'signature');
                                                                        // Update current user settings
                                                                        const updatedUser = { ...currentUser, signatureUrl: url };
                                                                        await updateUser(currentUser.id, updatedUser);
                                                                        toast.success('Firma actualizada correctamente', { id: toastId });
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                        toast.error('Error al subir la firma', { id: toastId });
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Estado: {currentUser?.signatureUrl ? <span className="text-emerald-500">Configurada ✅</span> : <span className="text-amber-500">Pendiente ⚠️</span>}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Company Settings */}
                {activeTab === 'company' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Información de la Compañía</h2>
                                <p className="text-xs text-slate-500 font-medium">Configure la identidad visual y datos legales de su empresa.</p>
                            </div>
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Logo Upload Section */}
                                <div className="lg:col-span-1 border-r border-slate-100 pr-10">
                                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Logo Corporativo</label>
                                    <div className="relative group">
                                        <div className="w-full aspect-square bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-400 group-hover:bg-blue-50/30">
                                            {formData.logoUrl ? (
                                                <img src={formData.logoUrl} alt="Company Logo" className="w-full h-full object-contain p-6" />
                                            ) : (
                                                <div className="text-center p-6">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                        <Save className="w-8 h-8 text-slate-300" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400">Sin Logo</p>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transform transition-transform active:scale-95">
                                                    Cambiar Logo
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const toastId = toast.loading('Subiendo logo...');
                                                                try {
                                                                    const url = await uploadFile(file, 'logo');
                                                                    setFormData({ ...formData, logoUrl: url });
                                                                    toast.success('Logo actualizado correctamente', { id: toastId });
                                                                } catch (err) {
                                                                    toast.error('Error al subir el logo', { id: toastId });
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-[10px] text-slate-400 text-center font-medium italic">Recomendado: PNG fondo transparente (mín. 400px)</p>
                                    </div>
                                </div>

                                {/* Form Fields Section */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                                title="Nombre de la Empresa"
                                                placeholder="Ej: MIP Internacional S.A.S"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">NIT / Identificación Fiscal</label>
                                            <input
                                                type="text"
                                                name="companyTaxId"
                                                value={formData.companyTaxId}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                                title="NIT/Tax ID"
                                                placeholder="Ej: 900.123.456-7"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dirección Física</label>
                                            <input
                                                type="text"
                                                name="companyAddress"
                                                value={formData.companyAddress}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900"
                                                title="Dirección de la Empresa"
                                                placeholder="Ej: Calle 100 # 50 - 20, Bogotá"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Símbolo de Moneda</label>
                                            <input
                                                type="text"
                                                name="currencySymbol"
                                                value={formData.currencySymbol}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-slate-900 text-center text-lg"
                                                title="Símbolo de Moneda"
                                                placeholder="$"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">IVA por Defecto (%)</label>
                                            <input
                                                type="number"
                                                name="defaultTaxRate"
                                                value={formData.defaultTaxRate}
                                                onChange={handleChange}
                                                step="0.01"
                                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-slate-900"
                                                title="Tasa de IVA por Defecto"
                                                placeholder="0.19"
                                            />
                                        </div>
                                    </div>

                                    {/* Consecutive Control Box */}
                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-110 transition-transform">
                                            <Shield className="w-24 h-24 text-white" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-2 text-blue-400">
                                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Control de Numeración</h3>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mb-6 font-medium leading-relaxed">Este valor se asignará automáticamente a la <strong>próxima orden</strong> generada por cualquier usuario del sistema.</p>
                                            <div className="max-w-[220px]">
                                                <div className="relative">
                                                    <input
                                                        type="number" step="any"
                                                        name="nextSequenceNumber"
                                                        value={formData.nextSequenceNumber}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl font-black text-white tracking-widest"
                                                        min="1"
                                                        title="Próximo Consecutivo"
                                                    />
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">#</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-10 py-4 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all flex items-center gap-3 transform active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Save className="w-4 h-4 animate-spin" /> Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" /> Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Users Management */}
                {activeTab === 'users' && isAdmin && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Add User Summary Info */}
                        <div className="card-premium p-10 rounded-[3.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
                                <UserPlus className="w-10 h-10" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Alta de Nuevos Colaboradores</h3>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">Configure accesos y privilegios de sistema</p>
                            </div>
                            <button
                                onClick={handleAddUser}
                                className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black shadow-2xl shadow-slate-900/40 transition-all flex items-center gap-4 active:scale-95 group"
                            >
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Generar Token de Acceso
                            </button>
                        </div>

                        {/* Existing Form Overhaul */}
                        <div className="card-premium p-12 rounded-[4rem] bg-white border border-slate-100 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alias / Nombre</label>
                                    <div className="relative">
                                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="text"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-black text-sm"
                                            title="Nombre"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ecosistema / Rol</label>
                                    <div className="relative">
                                        <Shield className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-black text-sm appearance-none"
                                            title="Rol"
                                        >
                                            <option value="Admin">Administrador Master</option>
                                            <option value="Approver">Aprobador Financiero</option>
                                            <option value="Buyer">Gestor de Compras</option>
                                            <option value="Almacenista">Logística & Almacén</option>
                                            <option value="Viewer">Consultor Senior</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificador Único</label>
                                    <div className="relative">
                                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="text"
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-black text-sm"
                                            title="Username"
                                            placeholder="ejperez"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Codificación / Pass</label>
                                    <div className="relative">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300">
                                            {showNewUserPassword ? <EyeOff className="w-5 h-5 cursor-pointer" onClick={() => setShowNewUserPassword(false)} /> : <Eye className="w-5 h-5 cursor-pointer" onClick={() => setShowNewUserPassword(true)} />}
                                        </div>
                                        <input
                                            type={showNewUserPassword ? 'text' : 'password'}
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-black text-sm"
                                            title="Password"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Users Table Overhaul */}
                        <div className="card-premium p-8 rounded-[4rem] bg-white border border-slate-100 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full border-separate border-spacing-y-4">
                                    <thead>
                                        <tr>
                                            <th className="px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                                            <th className="px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Acceso</th>
                                            <th className="px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Privilegios</th>
                                            <th className="px-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Seguridad</th>
                                            <th className="px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className="group hover:bg-slate-50/50 rounded-3xl transition-all">
                                                <td className="px-8 py-6 first:rounded-l-[2rem]">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-slate-900/10">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 text-sm font-bold text-slate-500">{user.username}</td>
                                                <td className="px-8">
                                                    <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-widest border border-blue-100">
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 text-center">
                                                    <span className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border ${user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                                        {user.isActive ? 'Activo' : 'Bloqueado'}
                                                    </span>
                                                </td>
                                                <td className="px-8 text-right last:rounded-r-[2rem]">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-2xl shadow-lg border border-slate-100 transition-all hover:scale-110"
                                                            title="Editar"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        {user.id !== currentUser?.id && (
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="p-3 bg-white text-slate-400 hover:text-rose-600 rounded-2xl shadow-lg border border-slate-100 transition-all hover:scale-110"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Management */}
                {activeTab === 'data' && isAdmin && (
                    <div className="animate-in fade-in duration-1000">
                        <div className="card-premium p-16 rounded-[4rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl text-center">
                            <div className="max-w-xl mx-auto space-y-12">
                                <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-amber-500/40 transform -rotate-12 group hover:rotate-0 transition-transform duration-700">
                                    <Database className="w-16 h-16" />
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Respaldo Maestro</h2>
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Copia de Seguridad de Infraestructura</p>
                                </div>

                                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl text-left relative overflow-hidden group">
                                    <Shield className="absolute top-0 right-0 w-48 h-48 text-white/5 -mr-12 -mt-12" />
                                    <div className="relative z-10 flex items-center justify-between gap-8">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Protocolo de Seguridad</p>
                                            <p className="text-sm font-bold text-slate-300 leading-relaxed">Se generará un archivo cifrado con la base de datos completa, incluyendo auditoría y firmas.</p>
                                        </div>
                                        <button
                                            onClick={handleExportBackup}
                                            className="px-12 py-6 bg-amber-500 text-white hover:bg-amber-400 rounded-3xl font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl shadow-amber-500/40 transition-all flex items-center gap-4 active:scale-95 whitespace-nowrap"
                                        >
                                            <Download className="w-6 h-6" />
                                            Exportar Core
                                        </button>
                                    </div>
                                </div>

                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                    El sistema realiza auto-backups diarios. <br />Esta exportación es para migración o auditoría física.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit User Modal Overhaul */}
            <AnimatePresence>
                {isEditModalOpen && editingUser && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-white rounded-[4rem] shadow-2xl shadow-black/40 overflow-hidden"
                        >
                            <div className="p-12 pb-2 flex justify-between items-center">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Modificar Perfil</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sustitución de Credenciales</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} title="Cerrar" className="p-4 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>
                            </div>

                            <div className="p-12 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nuevo Nombre</label>
                                    <input
                                        type="text"
                                        title="Nombre"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-bold text-slate-900 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asignar Nueva Jerarquía</label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 font-black text-slate-900 transition-all appearance-none"
                                        title="Rol"
                                    >
                                        <option value="Admin">Administrador Master</option>
                                        <option value="Approver">Aprobador Financiero</option>
                                        <option value="Buyer">Gestor de Compras</option>
                                        <option value="Almacenista">Logística & Almacén</option>
                                        <option value="Viewer">Consultor Senior</option>
                                    </select>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${editingUser.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            {editingUser.isActive ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase">Estado Operativo</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{editingUser.isActive ? 'Autorizado' : 'Inhabilitado'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditingUser({ ...editingUser, isActive: !editingUser.isActive })}
                                        className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                                            ${editingUser.isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'}`}
                                    >
                                        {editingUser.isActive ? 'Activo' : 'Pausado'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-12 pt-4 bg-slate-50/50 border-t border-slate-50 flex gap-6">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-6 bg-white border border-slate-200 text-slate-500 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                                >
                                    Abortar
                                </button>
                                <button
                                    onClick={handleSaveEditUser}
                                    className="flex-2 px-12 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black shadow-2xl shadow-slate-900/40 transition-all flex items-center justify-center gap-4 active:scale-95 group"
                                >
                                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Confirmar Cambios
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};