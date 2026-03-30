import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('documents');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#0A1A14]">
            {/* Sidebar / Topbar */}
            <nav className="bg-emerald-950/50 border-b border-emerald-500/10 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-black text-white">MIP <span className="text-emerald-400">ADMIN</span></h1>
                <div className="flex items-center gap-4">
                    <span className="text-emerald-100/70 text-sm font-medium">Hola, {user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 text-sm font-bold"
                    >
                        Salir
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Menu */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'documents' ? 'bg-emerald-500 text-emerald-950' : 'text-emerald-100 hover:bg-white/5'}`}
                        >
                            📂 Documentos
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-emerald-500 text-emerald-950' : 'text-emerald-100 hover:bg-white/5'}`}
                        >
                            👥 Usuarios
                        </button>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        {activeTab === 'documents' && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Gestión de Archivos</h2>
                                    <button className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-4 py-2 rounded-lg font-bold hover:bg-emerald-500 hover:text-emerald-950 transition-colors">
                                        + Cargar Nuevo
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Mock File List */}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-emerald-500/10 p-2 rounded-lg text-2xl">📄</div>
                                                <div>
                                                    <p className="text-white font-medium">Certificado_Laboral_2024.pdf</p>
                                                    <p className="text-xs text-white/40">Subido por admin • 12MB</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-bold px-3 py-1">Ver</button>
                                                <button className="text-red-400 hover:text-red-300 text-sm font-bold px-3 py-1">Eliminar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="text-center text-white/50 py-12">
                                Módulo de usuarios en construcción
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
