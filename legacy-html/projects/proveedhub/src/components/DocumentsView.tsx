import React, { useRef, useState } from 'react';
import { Supplier } from '../types';
import { Button } from './Button';
import { SecurityModal } from './SecurityModal';
import { FileText, Upload, Trash2 } from 'lucide-react';
import { api } from '../services/api';

interface DocumentsViewProps {
  supplier: Supplier;
  onUpdateSupplier: (updatedSupplier: Supplier) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ supplier, onUpdateSupplier }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      // 1. Subir el archivo al servidor
      const uploadedDoc = await api.uploadDocument(supplier.id, file);

      // 2. Actualizar el estado local con el nuevo documento
      const updatedSupplier = {
        ...supplier,
        documents: [...supplier.documents, uploadedDoc]
      };
      onUpdateSupplier(updatedSupplier);

    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Error al subir el documento.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmDelete = async (pin: string) => {
    if (!deletingDocId) return;
    
    try {
        await api.deleteDocument(supplier.id, deletingDocId, pin);
        
        const updatedDocs = supplier.documents.filter(d => d.id !== deletingDocId);
        onUpdateSupplier({ ...supplier, documents: updatedDocs });
        setDeletingDocId(null);
    } catch (error: any) {
        alert(error.message || "Error al eliminar documento.");
    }
  };

  return (
    <div className="space-y-6">
      <SecurityModal 
        isOpen={!!deletingDocId}
        onClose={() => setDeletingDocId(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Documento"
        message="¿Está seguro de que desea eliminar este documento? Esta acción requiere autorización y no se puede deshacer."
      />

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Documentación y Contratos</h3>
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.xml,.png,.jpg,.jpeg" 
            onChange={handleFileUpload}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="secondary" 
            icon={<Upload size={16} />}
            disabled={isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Subir Documento'}
          </Button>
        </div>
      </div>

      {supplier.documents.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-2 text-sm text-slate-500">No hay documentos almacenados.</p>
          <p className="text-xs text-slate-400">Sube contratos, facturas o acuerdos (PDF, Word, Imagenes).</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {supplier.documents.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.open(doc.url, '_blank')}>
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 hover:text-indigo-600 transition-colors">{doc.name}</h4>
                    <p className="text-xs text-slate-500">Subido el {doc.date || doc.uploadDate} • {doc.size || 'Tamaño desc.'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDeletingDocId(doc.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};