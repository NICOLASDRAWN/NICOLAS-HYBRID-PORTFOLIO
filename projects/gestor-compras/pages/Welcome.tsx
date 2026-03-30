import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Database, ArrowRight, Zap, Orbit, Sparkles, Layout, BarChart, Globe, QrCode, Smartphone, Wifi, X, Cpu, Server } from 'lucide-react';
import { useDb } from '../store/db';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export const Welcome: React.FC = () => {
    const navigate = useNavigate();
    const { settings, currentUser, serverStatus } = useDb();
    const [showNetworkModal, setShowNetworkModal] = useState(false);

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard', { replace: true });
        }
    }, [currentUser, navigate]);

    // Mouse tracking for light effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const lightX = useSpring(mouseX, springConfig);
    const lightY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Dynamic Background Light Effect */}
            <motion.div
                style={{
                    left: lightX,
                    top: lightY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="pointer-events-none fixed w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px] z-0"
            />

            {/* Futurist background with animated vibes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05],
                        x: [-100, 100, -100]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-[10%] -right-[10%] w-[1200px] h-[1200px] bg-blue-500/10 rounded-full blur-[180px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.03, 0.08, 0.03],
                        y: [-50, 50, -50]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                    className="absolute -bottom-[20%] -left-[20%] w-[1400px] h-[1400px] bg-emerald-500/10 rounded-full blur-[220px]"
                />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-7xl w-full mx-6 py-12 md:py-20 flex flex-col items-center"
            >
                <div className="w-full bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-24 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.9)] text-center relative overflow-hidden group">
                    {/* Interior Decorative Glows */}
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

                    {/* Badge */}
                    <motion.div variants={itemVariants} className="mb-6 md:mb-8">
                        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
                            <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                            <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Next-Gen ERP Ecosystem</span>
                            <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-8 md:mb-12">
                        <h1 className="text-4xl md:text-[9rem] font-black text-white tracking-tighter mb-4 md:mb-6 leading-none md:leading-[0.8] uppercase mobile-title-main">
                            MIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-[size:200%] animate-gradient italic">CORE</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-3xl font-medium max-w-4xl mx-auto tracking-tight leading-snug px-4 md:px-0">
                            Arquitectura convergente de <span className="text-white font-black italic underline decoration-blue-500/30 underline-offset-8">Alta Disponibilidad</span> para el control de suministros.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20">
                        {[
                            { icon: Database, title: 'Datos Soberanos', text: 'Información en infraestructura propia.', color: 'blue' },
                            { icon: ShieldCheck, title: 'Compliance 360', text: 'Auditoría avanzada y firmas blindadas.', color: 'emerald' },
                            { icon: Wifi, title: 'Nube Híbrida', text: 'Acceso seguro con nivel Zero-Trust.', color: 'indigo' }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group p-5 md:p-8 rounded-2xl md:rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 text-left flex md:flex-col items-center md:items-start gap-4 md:gap-0"
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mb-0 md:mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500 shrink-0`}>
                                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-400 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2 tracking-tight">{feature.title}</h3>
                                    <p className="text-slate-500 text-[9px] md:text-[11px] font-bold leading-relaxed transition-colors uppercase group-hover:text-slate-400">{feature.text}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="group relative w-full sm:w-auto px-8 md:px-16 py-5 md:py-8 bg-blue-600 text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all duration-500 uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_40px_80px_rgba(37,99,235,0.5)] overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4 md:gap-5">
                                Iniciar Sesión
                                <ArrowRight className="w-5 h-5 md:w-7 md:h-7 group-hover:translate-x-2 md:group-hover:translate-x-3 transition-transform duration-500" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </button>

                        <button
                            onClick={() => setShowNetworkModal(true)}
                            className="group w-full sm:w-auto px-6 md:px-10 py-5 md:py-8 bg-white/[0.03] border border-white/10 text-white font-black text-xs md:text-sm rounded-2xl md:rounded-[2.5rem] hover:bg-white/[0.06] transition-all duration-500 uppercase tracking-[0.25em] flex items-center justify-center gap-3 md:gap-4"
                        >
                            <QrCode className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                            Gestor de Acceso
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-12 md:mt-24 pt-6 md:pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[7.5px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-0.5 md:mb-1">Empresa</span>
                                <span className="text-[8.5px] md:text-[10px] font-black text-white uppercase tracking-widest">{settings.companyName || "MIP Internacional"}</span>
                            </div>
                            <div className="w-px h-6 md:h-8 bg-white/10" />
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <span className="text-[7.5px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-0.5 md:mb-1">Status</span>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <Server className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-400" />
                                    <span className="text-[8.5px] md:text-[10px] font-black text-emerald-400 tracking-widest uppercase">Live Node</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 md:gap-10">
                            <div className="flex flex-col items-center md:items-end text-center md:text-right">
                                <span className="text-[7.5px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-0.5 md:mb-1">Engine</span>
                                <span className="text-[8.5px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">MIP TRADING GROUP</span>
                            </div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group hover:bg-white/[0.05] transition-colors">
                                <Globe className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Network Access Modal */}
            <AnimatePresence>
                {showNetworkModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                        onClick={() => setShowNetworkModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="bg-slate-900 border border-white/10 rounded-[4rem] p-10 md:p-16 max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button
                                    onClick={() => setShowNetworkModal(false)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-white"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-12 text-center">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                                    <Smartphone className="w-10 h-10 text-emerald-400" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">Acceso Remoto</h2>
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest leading-relaxed">
                                    Escanee el código para conectar sus dispositivos móviles a la red inteligente de MIP.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.2)] mb-10 group relative">
                                <div className="aspect-square bg-slate-100 rounded-[2rem] flex items-center justify-center border-4 border-slate-50 relative overflow-hidden">
                                    {/* Simulated QR Pattern */}
                                    <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <QrCode className="w-40 h-40 text-slate-800" />
                                    </div>

                                    {/* Scan animation */}
                                    <motion.div
                                        animate={{ top: ['0%', '98%', '0%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_15px_#10b981] z-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                            <Wifi className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">IP Local ({serverStatus.localIps[0]?.name || 'LAN'})</p>
                                            <p className="text-lg font-black text-white tracking-widest">{serverStatus.localIps[0]?.address || '127.0.0.1'}:{serverStatus.port}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border ${serverStatus.online ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{serverStatus.online ? 'Activo' : 'Offline'}</span>
                                    </div>
                                </div>

                                <div className={`bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between ${!serverStatus.tunnelUrl ? 'opacity-40' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                            <Globe className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div className="max-w-[200px] overflow-hidden">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Tunnel de Acceso Remoto</p>
                                            <p className="text-xs font-black text-white truncate">{serverStatus.tunnelUrl?.replace('https://', '') || 'Iniciando Túnel...'}</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border ${serverStatus.tunnelUrl ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' : 'bg-slate-500/20 border-slate-500/40 text-slate-500'}`}>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{serverStatus.tunnelUrl ? 'Cloudflare' : 'Pendiente'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};