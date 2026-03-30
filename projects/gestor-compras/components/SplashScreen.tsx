import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MIPLogo } from './MIPLogo';

export const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + 1;
            });
        }, 20);

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        filter: 'blur(40px)',
                    }}
                    transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden touch-none select-none"
                >
                    {/* Background Dynamic Glows */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] bg-blue-600/20 rounded-full blur-[120px]"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.05, 0.15, 0.05],
                                x: [-20, 20, -20],
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] max-h-[600px] bg-emerald-600/10 rounded-full blur-[100px]"
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative z-10 flex flex-col items-center px-6"
                    >
                        <div className="relative mb-12">
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.02, 0.98, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2.5rem] p-5 md:p-7 shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center relative overflow-hidden"
                            >
                                <MIPLogo className="w-full h-full relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent" />
                            </motion.div>

                            {/* Decorative aura */}
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-xl animate-pulse" />
                        </div>

                        <div className="text-center space-y-3">
                            <motion.h1
                                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-white font-black text-4xl md:text-5xl tracking-tight uppercase"
                            >
                                MIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">CORE</span>
                            </motion.h1>

                            <div className="flex items-center justify-center gap-4">
                                <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-white/20" />
                                <span className="text-[10px] md:text-xs text-slate-500 font-black tracking-[0.4em] uppercase">Enterprise Architecture</span>
                                <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-white/20" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-24 w-full px-12 max-w-xs flex flex-col items-center gap-4">
                        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden backdrop-blur-md">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 bg-[size:200%] animate-gradient"
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                            />
                        </div>
                        <div className="flex justify-between w-full text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <span>Iniciando Entorno</span>
                            <span>{progress}%</span>
                        </div>
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2">
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">System Version 4.0 Gold Edition</span>
                        <div className="flex gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce" />
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-bounce delay-[200ms]" />
                            <div className="w-1 h-1 rounded-full bg-blue-500 animate-bounce delay-[400ms]" />
                        </div>
                    </div>

                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
