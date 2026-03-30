import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDb } from '../store/db';
import { User, Lock, ArrowRight, ShoppingCart, ShieldAlert, Smartphone, QrCode, X, ShieldCheck, Zap, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const Login: React.FC = () => {
    const { login, setCurrentUser } = useDb();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [tempUser, setTempUser] = useState<any>(null);
    const [showMobileModal, setShowMobileModal] = useState(false);
    const [networkUrl, setNetworkUrl] = useState('192.168.1.13:3000'); // Consistent with Welcome node

    useEffect(() => {
        fetch('/api/network-status')
            .then(res => res.json())
            .then(data => setNetworkUrl(data.url))
            .catch(() => { });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const user = await login(username, password);
            if (user) {
                setTempUser(user);
                setShowAuditModal(true);
            } else {
                setError('Credenciales no autorizadas en el nodo maestro');
            }
        } catch (err) {
            setError('Fallo de conexión con el núcleo central');
        }
    };

    const confirmLogin = () => {
        if (tempUser) {
            setCurrentUser(tempUser);
            toast.success("Enlace establecido. Acceso concedido.");
            window.location.href = '#/dashboard';
            window.location.reload();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03]"></div>
            </div>

            {/* Mobile Gradient Overlay for OLED impact */}
            <div className="md:hidden absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />

            <AnimatePresence mode="wait">
                {showAuditModal ? (
                    <motion.div
                        key="audit"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="relative z-20 w-full max-w-lg"
                    >
                        <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 p-1">
                            <div className="bg-amber-500/10 p-10 border-b border-amber-500/20 flex items-center gap-6 rounded-t-[3.4rem]">
                                <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                    <ShieldAlert className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-amber-500 uppercase tracking-tight">Security Protocol</h3>
                                    <p className="text-amber-500/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Audit Log Activated</p>
                                </div>
                            </div>

                            <div className="p-10 space-y-10">
                                <p className="text-slate-400 text-base font-semibold leading-relaxed">
                                    Acceso restringido a personal autorizado. Al proceder, sus acciones serán vinculadas mediante <span className="text-white font-black">Audit Trails v4.0</span>:
                                </p>

                                <div className="space-y-4">
                                    {[
                                        'Trazabilidad encriptada de transacciones globales.',
                                        'Validación multifactórica de identidad operativa.',
                                        'Jurisdicción y cumplimiento normativo MIP.'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-5 p-5 bg-white/[0.03] rounded-3xl border border-white/5 transition-colors hover:bg-white/[0.05]">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white/5">{i + 1}</div>
                                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        onClick={() => setShowAuditModal(false)}
                                        className="flex-1 px-8 py-6 text-slate-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={confirmLogin}
                                        className="flex-[2] px-8 py-6 bg-white text-black rounded-[1.5rem] hover:bg-blue-500 hover:text-white font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover:scale-[1.05] active:scale-95"
                                    >
                                        Autorizar Acceso
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 w-full max-w-[440px]"
                    >
                        <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] shadow-[0_80px_150px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 p-1">
                            <div className="p-8 md:p-12 pb-4 md:pb-6 flex flex-col items-center">
                                <motion.div
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.8, type: 'spring' }}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 shadow-[0_20px_40px_rgba(37,99,235,0.3)] cursor-pointer"
                                >
                                    <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                </motion.div>
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter uppercase italic text-center leading-none">MIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">CORE</span></h2>
                                <div className="flex items-center gap-2 mt-3 md:mt-2">
                                    <span className="px-3 py-1 bg-white/[0.05] border border-white/5 text-slate-500 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">System v4.0.2 • Online</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                </div>
                            </div>

                            <form onSubmit={handleLogin} className="p-8 md:p-12 pt-0 md:pt-0 space-y-6 md:space-y-8">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 md:p-5 rounded-2xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-4 mb-6"
                                    >
                                        <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="space-y-6 md:space-y-6">
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="block text-slate-500 text-[8px] md:text-[9px] uppercase font-black tracking-[0.3em] ml-2">Secure Identifier</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
                                                <User className="h-5 w-5 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="block w-full pl-14 md:pl-16 pr-8 py-4 md:py-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[1.8rem] text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/5 transition-all text-xs md:text-sm"
                                                placeholder="Username"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:space-y-3">
                                        <label className="block text-slate-500 text-[8px] md:text-[9px] uppercase font-black tracking-[0.3em] ml-2">Access Key Override</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:scale-110 transition-transform">
                                                <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-blue-400 transition-colors" />
                                            </div>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full pl-14 md:pl-16 pr-8 py-4 md:py-5 bg-white/[0.03] border border-white/5 rounded-[1.5rem] md:rounded-[1.8rem] text-white font-bold placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/5 transition-all text-xs md:text-sm"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="group relative w-full flex justify-center items-center py-5 md:py-6 px-6 rounded-[1.5rem] md:rounded-[1.8rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-black bg-white hover:bg-blue-500 hover:text-white shadow-2xl transition-all duration-300 gap-4 overflow-hidden mt-6 md:mt-8"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Ingresar al Sistema
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </motion.button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowMobileModal(true)}
                                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-emerald-400 transition-all text-[9px] font-black uppercase tracking-widest"
                                    >
                                        <QrCode className="w-3.5 h-3.5" />
                                        Remote Link
                                    </button>
                                </div>
                            </form>

                            <div className="px-12 pb-12">
                                <div className="pt-8 border-t border-white/5 flex justify-between items-center opacity-40">
                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em]">Encrypted Node • 256-bit AES</span>
                                    <div className="flex gap-2">
                                        <Globe className="w-3 h-3 text-slate-500" />
                                        <ShieldCheck className="w-3 h-3 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Modal Redesign */}
            <AnimatePresence>
                {showMobileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6"
                        onClick={() => setShowMobileModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-slate-900 border border-white/10 rounded-[3.5rem] p-10 max-w-sm w-full text-center relative shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowMobileModal(false)}
                                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-white"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                                <Smartphone className="w-8 h-8 text-blue-400" />
                            </div>

                            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Smart Connect</h3>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10 leading-relaxed">
                                Sincronice su terminal móvil con la red administrativa central.
                            </p>

                            <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.2)] mb-8 relative group">
                                <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative border-4 border-slate-50">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('http://' + networkUrl)}&bgcolor=ffffff&color=020617&margin=0`}
                                        alt="Remote Access QR"
                                        className="w-full h-full mix-blend-multiply"
                                    />
                                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse pointer-events-none" />
                                </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl">
                                <p className="text-[8px] uppercase font-black text-slate-600 tracking-widest mb-2 text-center">Local Network Path</p>
                                <p className="font-mono text-xs font-black text-white tracking-widest select-all">{networkUrl}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};