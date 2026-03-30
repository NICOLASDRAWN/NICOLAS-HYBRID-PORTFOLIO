import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, ChevronRight, BookOpen, Clock, ShieldCheck, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useDb } from '../store/db';

interface DocItem {
    name: string;
    title: string;
}

export const Documentation: React.FC = () => {
    const { currentUser } = useDb();
    const [docs, setDocs] = useState<DocItem[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocs = () => {
        fetch('/api/docs')
            .then(res => res.json())
            .then(data => setDocs(data))
            .catch(() => toast.error('No se pudo cargar la lista de documentos'));
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.name.endsWith('.md')) {
            toast.error("Solo se permiten archivos .md");
            return;
        }

        const toastId = toast.loading("Subiendo manual...");
        const formData = new FormData();
        formData.append('file', file);

        try {
            const ls = localStorage.getItem('db_session');
            const token = ls ? JSON.parse(ls).token : '';

            const res = await fetch('/api/docs/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) throw new Error("Error en servidor");

            toast.success("Manual actualizado correctamente", { id: toastId });
            fetchDocs();
        } catch (err) {
            toast.error("Error al subir manual", { id: toastId });
        }
    };

    const loadDoc = (docName: string) => {
        setLoading(true);
        setSelectedDoc(docName);
        fetch(`/api/docs/${docName}`)
            .then(res => res.text())
            .then(text => {
                setContent(text);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Error al leer el documento');
                setLoading(false);
            });
    };

    const filteredDocs = docs.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-160px)]">
            {/* Sidebar de Documentos */}
            <aside className="w-full lg:w-80 flex flex-col gap-6">
                <div className="premium-glass p-6 rounded-[2.5rem] flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tighter text-slate-900">BIBLIOTECA</h2>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Documentación Técnica</p>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar guia..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <nav className="flex flex-col gap-2 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                        {filteredDocs.map((doc) => (
                            <button
                                key={doc.name}
                                onClick={() => loadDoc(doc.name)}
                                className={`flex items-center justify-between p-4 rounded-2xl text-left transition-all group ${selectedDoc === doc.name
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.02]'
                                    : 'bg-white border border-slate-100 hover:border-blue-200 text-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className={`w-4 h-4 ${selectedDoc === doc.name ? 'text-blue-400' : 'text-slate-400'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[140px]">{doc.title}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${selectedDoc === doc.name ? 'translate-x-1' : ''}`} />
                            </button>
                        ))}
                    </nav>
                </div>

                {currentUser?.role === 'Admin' && (
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20">
                        <Upload className="w-8 h-8 mb-4 text-blue-400" />
                        <h3 className="text-sm font-black uppercase tracking-tight mb-2">Editor de Manuales</h3>
                        <p className="text-[10px] font-medium leading-relaxed opacity-80 mb-4">Actualiza la biblioteca subiendo nuevos archivos .md.</p>
                        <label className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2">
                            SUBIR ARCHIVO .MD
                            <input type="file" className="hidden" accept=".md" onChange={handleUploadDoc} />
                        </label>
                    </div>
                )}

                <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-600/20">
                    <ShieldCheck className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-sm font-black uppercase tracking-tight mb-2">Ayuda Técnica</h3>
                    <p className="text-[10px] font-medium leading-relaxed opacity-80 mb-4">Si no encuentras lo que buscas, solicita asistencia al administrador del sistema.</p>
                    <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Soporte MIP</button>
                </div>
            </aside>

            {/* Visor de Contenido */}
            <main className="flex-1 premium-glass rounded-[3rem] p-8 md:p-12 overflow-y-auto custom-scrollbar relative bg-white">
                <AnimatePresence mode="wait">
                    {!selectedDoc ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="h-full flex flex-col items-center justify-center text-center py-20"
                        >
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                                <BookOpen className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tighter text-slate-900 mb-2">Selecciona un Documento</h3>
                            <p className="text-slate-400 max-w-sm text-sm font-medium">Explora las guías de usuario, historiales de versiones y manuales técnicos del Gestor de Compras MIP.</p>
                        </motion.div>
                    ) : loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center"
                        >
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={selectedDoc}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="prose prose-slate max-w-none prose-sm md:prose-base"
                        >
                            <div className="flex items-center gap-2 mb-8 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                <Clock className="w-3 h-3" /> Actualizado recientemente
                            </div>

                            <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-[13px]">
                                {content}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
