import { Supplier, Document } from '../types';

const API_URL = 'http://localhost:3001/api';
const BASE_URL = 'http://localhost:3001';

// Helper para normalizar URLs de documentos
const normalizeSupplier = (supplier: Supplier): Supplier => {
  if (supplier.documents) {
    supplier.documents = supplier.documents.map(doc => ({
      ...doc,
      url: doc.url.startsWith('http') ? doc.url : `${BASE_URL}${doc.url}`
    }));
  }
  return supplier;
};

export const api = {
  getSuppliers: async (): Promise<Supplier[]> => {
    try {
      const response = await fetch(`${API_URL}/suppliers`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error fetching suppliers: ${response.statusText}`);
      }
      const data = await response.json();
      return data.map(normalizeSupplier);
    } catch (error) {
      console.error("API getSuppliers error:", error);
      throw error;
    }
  },

  createSupplier: async (supplier: Supplier): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error creating supplier: ${response.statusText}`);
      }
      const data = await response.json();
      return normalizeSupplier(data);
    } catch (error) {
      console.error("API createSupplier error:", error);
      throw error;
    }
  },

  updateSupplier: async (supplier: Supplier): Promise<Supplier> => {
    try {
      const response = await fetch(`${API_URL}/suppliers/${supplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error updating supplier: ${response.statusText}`);
      }
      const data = await response.json();
      return normalizeSupplier(data);
    } catch (error) {
      console.error("API updateSupplier error:", error);
      throw error;
    }
  },

  deleteSupplier: async (id: string, pin: string): Promise<void> => {
    // Usamos POST con sufijo /delete para asegurar compatibilidad
    const response = await fetch(`${API_URL}/suppliers/${id}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al eliminar');
    }
  },

  uploadDocument: async (supplierId: string, file: File): Promise<Document> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/upload/${supplierId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error uploading file: ${response.statusText}`);
      }
      const doc = await response.json();
      // Normalizar la URL del documento devuelto
      doc.url = doc.url.startsWith('http') ? doc.url : `${BASE_URL}${doc.url}`;
      return doc;
    } catch (error) {
      console.error("API uploadDocument error:", error);
      throw error;
    }
  },

  deleteDocument: async (supplierId: string, documentId: string, pin: string): Promise<void> => {
    const response = await fetch(`${API_URL}/suppliers/${supplierId}/documents/${documentId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al eliminar documento');
    }
  },

  // Backup / Drive
  getBackupConfig: async (): Promise<{ backupPath: string }> => {
    const response = await fetch(`${API_URL}/backup-config`);
    return response.json();
  },

  saveBackupConfig: async (backupPath: string) => {
    const response = await fetch(`${API_URL}/backup-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ backupPath })
    });
    if (!response.ok) throw new Error('Error guardando configuración');
    return response.json();
  },

  syncNow: async () => {
    const response = await fetch(`${API_URL}/sync-now`, {
        method: 'POST'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al sincronizar');
    return data;
  }
};
