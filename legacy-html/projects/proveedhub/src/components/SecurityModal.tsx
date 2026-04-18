import React, { useState } from 'react';
import { Lock, AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  title?: string;
  message?: string;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  title = "Control de Seguridad",
  message = "Esta acción requiere autorización. Por favor, ingrese su código de acceso."
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
        setError('El código debe tener al menos 4 dígitos');
        return;
    }
    onConfirm(pin);
    setPin('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <Lock size={20} />
            <span>{title}</span>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {message}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                    Esta acción quedará registrada en el sistema de auditoría.
                </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Código de Acceso Personal</label>
            <input 
                type="password" 
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="••••"
                maxLength={4}
                value={pin}
                onChange={(e) => {
                    // Solo permitir números
                    if (/^\d*$/.test(e.target.value)) {
                        setPin(e.target.value);
                        setError('');
                    }
                }}
                autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center font-medium">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
                Cancelar
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white border-transparent">
                Confirmar Acción
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
