import React, { useState } from 'react';
import { useDb } from '../store/db';
import { X, Upload, Save, CheckCircle, FileSignature } from 'lucide-react';
import { toast } from 'sonner';

interface SignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, updateUser, uploadFile } = useDb();
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUser?.signatureUrl);

    if (!isOpen) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const toastId = toast.loading('Procesando firma...');

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('El archivo debe ser una imagen (PNG, JPG, etc)', { id: toastId });
                setIsUploading(false);
                return;
            }

            const url = await uploadFile(file, 'signatures');
            setPreviewUrl(url);
            toast.success('Imagen cargada, recuerda guardar cambios', { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error('Error al subir la imagen', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        if (!currentUser) return;
        if (!previewUrl) {
            toast.error("Debes subir una imagen primero");
            return;
        }

        const toastId = toast.loading('Guardando firma...');
        try {
            await updateUser(currentUser.id, { signatureUrl: previewUrl });
            toast.success('Firma actualizada correctamente', { id: toastId });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar la firma', { id: toastId });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative border border-slate-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    title="Cerrar modal"
                    aria-label="Cerrar modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                        <FileSignature className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Firma Digital</h2>
                    <p className="text-sm text-slate-500 font-medium text-center mt-2">
                        Esta firma se estampará automáticamente en las órdenes de compra que apruebes.
                    </p>
                </div>

                <div className="mb-8">
                    <div className="relative group w-full aspect-[3/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-blue-400 hover:bg-blue-50/10">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Firma" className="w-full h-full object-contain p-4" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <Upload className="w-8 h-8 opacity-50" />
                                <span className="text-xs font-bold uppercase tracking-widest">Subir Imagen</span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">
                                {isUploading ? 'Subiendo...' : 'Seleccionar Archivo'}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">Recomendado: Imagen PNG con fondo transparente.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isUploading || !previewUrl}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Guardar Firma
                </button>
            </div>
        </div>
    );
};
