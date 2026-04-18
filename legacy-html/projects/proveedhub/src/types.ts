export interface Document {
  id: string;
  name: string; // Nombre original
  url: string;
  type: string;
  date: string;
  size: string; // Tamaño aproximado
}

export type SupplierCategory = 'Servicios' | 'Suministros' | 'Alquileres' | 'Otros';

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  sectors: string[];
  category: SupplierCategory; // Nueva categoría principal
  rating: number; // Nueva calificación 1-5
  documents: Document[];
  status: 'Active' | 'Pending' | 'Inactive';
}

export enum ViewState {
  LIST = 'LIST',
  DETAIL = 'DETAIL',
  CREATE = 'CREATE',
  SYNC = 'SYNC'
}

declare global {
  interface Window {
    electron?: {
      selectFolder: () => Promise<string>;
    };
  }
}
