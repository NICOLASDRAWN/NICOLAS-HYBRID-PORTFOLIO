import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Button } from './Button';
import { Cloud, Check, AlertTriangle, RefreshCw, Folder, Key } from 'lucide-react';

interface SyncViewProps {
  onBack: () => void;
}

export const SyncView: React.FC<SyncViewProps> = ({ onBack }) => {
  const [config, setConfig] = useState({ backupPath: '', geminiApiKey: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await api.getBackupConfig();
      setConfig({
        backupPath: data.backupPath || '',
        geminiApiKey: data.geminiApiKey || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.saveBackupConfig(config);
      setStatusMessage("Configuración guardada correctamente.");
      setStatusType("success");
    } catch (err) {
      setStatusMessage("Error al guardar la configuración.");
      setStatusType("error");
    }
  };

  const handleSync = async () => {
    if (!config.backupPath) {
      setStatusMessage("Primero debes configurar una ruta de respaldo.");
      setStatusType("error");
      return;
    }

    // Verificación de conexión (opcional, ya que el backup es local a carpeta de Drive)
    // Pero si quisiéramos ser estrictos:
    // if (!navigator.onLine) { ... }
    // En este caso, como copiamos a una carpeta LOCAL del PC (la de Drive), 
    // NO necesitamos internet real. El programa de Drive se encarga luego.
    // Así que el código actual YA FUNCIONA offline.
    // Solo agregaré un mensaje más claro.

    setIsSyncing(true);
    setStatusMessage("Preparando archivos...");
    
    try {
      const result = await api.syncNow();
      setStatusMessage(result.message || "Copia local realizada. Drive la subirá cuando haya internet.");
      setStatusType("success");
    } catch (err: any) {
      setStatusMessage(err.message || "Error en la sincronización.");
      setStatusType("error");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium">
          &larr; Volver
        </button>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Cloud className="text-indigo-600" /> Configuración y Sincronización
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Configuración General</h2>
        <p className="text-slate-500 mb-4 text-sm">
          Configura tu respaldo en Drive y tu conexión a la Inteligencia Artificial.
        </p>
        
        {/* Drive Config */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Ruta de Respaldo (Drive/OneDrive)</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ej: C:\Users\TuNombre\Google Drive"
                        value={config.backupPath}
                        onChange={(e) => setConfig({...config, backupPath: e.target.value})}
                    />
                </div>
                {window.electron && (
                  <Button onClick={async () => {
                    const path = await window.electron?.selectFolder();
                    if (path) setConfig({...config, backupPath: path});
                  }} variant="secondary">Examinar</Button>
                )}
            </div>
        </div>
        
        <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} variant="primary">Guardar Cambios</Button>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 text-center">
        <Cloud size={48} className="mx-auto text-indigo-400 mb-4" />
        <h3 className="text-lg font-bold text-indigo-900 mb-2">Sincronizar Ahora</h3>
        <p className="text-indigo-700 mb-6 max-w-md mx-auto text-sm">
          Ejecuta una copia manual de todos tus datos a la ruta configurada.
        </p>
        
        <Button 
            onClick={handleSync} 
            variant="primary" 
            className="mx-auto w-full max-w-xs justify-center py-3 text-lg"
            disabled={isSyncing || !config.backupPath}
        >
            {isSyncing ? (
                <><RefreshCw className="animate-spin mr-2" /> Sincronizando...</>
            ) : (
                <><RefreshCw className="mr-2" /> Ejecutar Copia de Seguridad</>
            )}
        </Button>

        {statusMessage && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                statusType === 'success' ? 'bg-green-100 text-green-700' : 
                statusType === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
                {statusType === 'success' && <Check size={16} />}
                {statusType === 'error' && <AlertTriangle size={16} />}
                {statusMessage}
            </div>
        )}
      </div>
    </div>
  );
};
