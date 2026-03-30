import React, { useState, useEffect, useRef, useMemo, FC } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchableSelectProps {
    options: { value: string; label: string; category?: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    compact?: boolean;
    onCreate?: (value: string) => void;
}

export const SearchableSelect: FC<SearchableSelectProps> = ({ options, value, onChange, placeholder, disabled, className, compact, onCreate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setFilter('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!filter) return options;
        const lower = filter.toLowerCase();
        return options.filter(o =>
            o.label.toLowerCase().includes(lower) ||
            (o.category && o.category.toLowerCase().includes(lower))
        );
    }, [options, filter]);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <div
                className={`w-full flex items-center justify-between border border-slate-200 rounded-xl cursor-pointer bg-white transition-all duration-300 shadow-sm
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 ring-0 hover:ring-2 hover:ring-blue-100 hover:border-blue-300'}
          ${compact ? 'px-3 py-2 text-[10px]' : 'px-5 py-3 text-sm'}
        `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                title={selectedOption?.label || placeholder}
            >
                <div className="flex items-center gap-2 min-w-0">
                    {selectedOption && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                    <span className={`font-black truncate uppercase tracking-tight ${!selectedOption ? 'text-slate-400' : 'text-slate-900'}`}>
                        {selectedOption ? (compact && selectedOption.label.length > 30 ? selectedOption.label.substring(0, 30) + '...' : selectedOption.label) : (placeholder || "Seleccionar...")}
                    </span>
                </div>
                <ChevronDown className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </div>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute z-[100] w-full min-w-[300px] mt-2 bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden origin-top-left ring-1 ring-slate-900/5 -left-1 sm:left-0"
                    >
                        <div className="p-4 bg-slate-50/50 border-b border-slate-50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 text-xs font-black uppercase tracking-widest border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 bg-white shadow-inner transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                        <div className="max-h-[350px] overflow-y-auto no-scrollbar py-2">
                            {onCreate && filter.trim() && !options.some(o => o.label.toLowerCase() === filter.trim().toLowerCase()) && (
                                <div className="px-3 pb-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCreate(filter.trim());
                                            setIsOpen(false);
                                            setFilter('');
                                        }}
                                        className="w-full p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Registrar "{filter.trim()}"
                                    </button>
                                </div>
                            )}

                            {filteredOptions.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                        <Search className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sin resultados</span>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {(() => {
                                        const groups: Record<string, typeof options> = {};
                                        filteredOptions.forEach(opt => {
                                            const cat = opt.category || 'Otras Opciones';
                                            if (!groups[cat]) groups[cat] = [];
                                            groups[cat].push(opt);
                                        });

                                        return Object.entries(groups).map(([cat, opts]) => (
                                            <div key={cat} className="group/cat">
                                                <div className="px-6 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 group-first/cat:mt-0 mt-2 sticky top-0 z-10 border-y border-slate-50/50 backdrop-blur-md">
                                                    {cat}
                                                </div>
                                                <div className="px-2 pt-1">
                                                    {opts.map(opt => {
                                                        const hasCode = opt.label.includes(' - ');
                                                        const [code, ...rest] = hasCode ? opt.label.split(' - ') : ['', opt.label];
                                                        const name = hasCode ? rest.join(' - ') : opt.label;

                                                        return (
                                                            <div
                                                                key={opt.value}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onChange(opt.value);
                                                                    setIsOpen(false);
                                                                    setFilter('');
                                                                }}
                                                                className={`px-4 py-3.5 cursor-pointer rounded-2xl transition-all flex items-center justify-between group/item mx-1
                                                ${value === opt.value
                                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                                        : 'hover:bg-slate-50 text-slate-700'}
                                            `}
                                                            >
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    {hasCode ? (
                                                                        <div className="flex flex-col min-w-0">
                                                                            <span className={`text-[8px] font-black font-mono tracking-tighter ${value === opt.value ? 'text-blue-100' : 'text-blue-600'}`}>#{code}</span>
                                                                            <span className={`text-[11px] font-black uppercase truncate ${value === opt.value ? 'text-white' : 'text-slate-900 group-hover/item:text-blue-600'}`}>{name}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className={`text-[11px] font-black uppercase truncate ${value === opt.value ? 'text-white' : 'text-slate-900 group-hover/item:text-blue-600'}`}>{opt.label}</span>
                                                                    )}
                                                                </div>

                                                                {value === opt.value && (
                                                                    <div className="shrink-0 w-2 h-2 rounded-full bg-white animate-pulse" />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
