export type Role = 'Viewer' | 'Admin' | 'Approver' | 'Buyer' | 'Almacenista';

export interface User {
  id: string;
  name: string;
  role: Role;
  username: string;
  password?: string;
  lastSeen?: string; // ISO Date
  token?: string;
  signatureUrl?: string; // NEW: Personal signature image
  isActive: boolean; // Added
  permissions?: UserPermissions; // Granular permissions
}

export interface UserPermissions {
  // Órdenes
  orders_create: boolean;
  orders_edit: boolean;
  orders_delete: boolean;
  orders_approve: boolean;
  orders_view_all: boolean;
  orders_view_own: boolean;

  // Proveedores
  suppliers_create: boolean;
  suppliers_edit: boolean;
  suppliers_delete: boolean;
  suppliers_view: boolean;
  suppliers_import: boolean;

  // Productos
  products_create: boolean;
  products_edit: boolean;
  products_delete: boolean;
  products_view: boolean;
  products_import: boolean;

  // Inventario
  inventory_receive: boolean;
  inventory_view: boolean;
  inventory_manage_warehouses: boolean;

  // Finanzas
  finance_view_reports: boolean;
  finance_export: boolean;
  finance_register_payments: boolean;

  // Configuración
  config_manage_users: boolean;
  config_global_settings: boolean;
  config_upload_assets: boolean;
  config_email: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string; // RUC/NIT/CIF
  // New fields from Excel
  contactName?: string;
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
  category?: string;    // Maps to Excel "TIPO" (e.g. SUMINISTRO)
  subcategory?: string; // Maps to Excel "CATEGORÍA" (e.g. PAPELERIA)
  isActive?: boolean;
  documents?: OrderDocument[]; // Documents (RUT, Cámara de Comercio, etc)
}

// NEW: Product type to distinguish between products, services and rentals
export type ProductType = 'Producto' | 'Servicio' | 'Alquiler';

export interface Product {
  id: string;
  supplierId: string;
  code: string;
  name: string;
  unitPrice: number;
  unit: string;
  category: string;
  type: ProductType;
  description?: string;
  isActive?: boolean;
  taxRate?: number;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
}

// NEW: Tax rate type including "Otro" option
export type TaxRateOption = 0 | 0.05 | 0.10 | 0.19 | 'otro';

export interface POItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  taxRate: number | 'custom'; // 0, 0.05, 0.10, 0.19, or 'custom'
  customTaxRate?: number; // NEW: For "Otro" option
  total: number; // Subtotal (qty * price) without tax
  unit?: string;
  itemType?: ProductType;
  costCenterId?: string; // NEW: Centro de costo por ítem
  costCenterName?: string; // NEW: Nombre desglosado
}

// NEW: Order status expanded
export type OrderStatus =
  | 'Draft'
  | 'InProcess'
  | 'Pending'
  | 'Approved'
  | 'ChangeRequested'
  | 'ApprovedForChange'
  | 'AcuerdoComercial'  // NEW: Acuerdo Comercial
  | 'EnRevision'         // NEW: En Revisión
  | 'Anulada';           // NEW: Anulada

// NEW: OCC Status (Order Commercial Control)
export type OCCStatus = 'EnProceso' | 'Entregado' | 'Pendiente';

// NEW: Document attachment interface
export interface OrderDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
}

// NEW: dynamic approver tracking
export interface OrderApprover {
  id?: string; // Optional unique ID for the approval entry itself
  userId: string;
  userName: string;
  role?: string;
  approved: boolean;
  approvedAt?: string;
  signatureUrl?: string;
}

// NEW: Order comments history
export interface OrderComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface PurchaseOrder {
  id: string;
  sequenceNumber?: number; // The "Consecutivo"
  supplierId: string;
  supplierName: string; // Denormalized for history
  supplierAddress: string;
  supplierTaxId: string;
  date: string;
  items: POItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentType: 'Credit' | 'Advance'; // Crédito, Anticipado

  // Custom Fields
  quoteNumber?: string; // Numero de cotización

  // Advance Logic - NOW EDITABLE
  advancePercentage?: number; // Editable percentage (0 to 1)
  paidAmount?: number;     // Amount already paid (Advance or Full)
  debtAmount?: number;     // Amount remaining to be paid

  // NEW: AIU Fields (Administración, Imprevistos, Utilidad)
  aiuEnabled?: boolean;
  aiuAdministracion?: number; // Percentage for Administration
  aiuImprevistos?: number;    // Percentage for Unforeseen
  aiuUtilidad?: number;       // Percentage for Profit
  aiuTotal?: number;          // Total AIU value

  comments?: string;
  commentsHistory?: OrderComment[]; // NEW: conversational history
  status: OrderStatus;
  occStatus?: OCCStatus; // NEW: Estado OCC (Entregado/En proceso)

  changeReason?: string;
  changeRequestedBy?: string;

  // Approval Tracking (Core)
  approvedBy?: string; // Name of the final approver (legacy support)
  approvedAt?: string; // ISO Date
  approverSignatureUrl?: string; // Signature image

  // NEW: Double Approval specialized fields (Legacy/Quick access)
  budgetApproved?: boolean;
  approvedByBudget?: string; // e.g. "Magdaly"
  budgetApprovedAt?: string;
  budgetSignatureUrl?: string;

  purchasingApproved?: boolean;
  approvedByPurchasing?: string; // e.g. "Maria Alejandra"
  purchasingApprovedAt?: string;
  purchasingSignatureUrl?: string;

  // NEW: Mult-approver flexible system
  approvals?: OrderApprover[];

  requestedApproverId?: string;
  requestedApproverName?: string;
  requestedById?: string;
  requestedByName?: string;
  requesterSignatureUrl?: string; // NEW: Signature of the person who created the order

  // NEW: Document attachments
  documents?: OrderDocument[];
  isElaboratedByApprover?: boolean;
}

export interface Activity {
  id: string;
  type: 'order' | 'supplier' | 'product' | 'user' | 'system' | 'inventory';
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  targetId?: string;
}

// Banner configuration for promotional displays
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  backgroundGradient?: string; // e.g. "from-blue-500 to-purple-600"
  isActive: boolean;
  location: 'dashboard' | 'sidebar' | 'login';
  order: number;
  startDate?: string; // ISO date
  endDate?: string;   // ISO date
}

export interface AppSettings {
  id?: string;
  companyName: string;
  companyAddress: string;
  companyTaxId: string;
  nextSequenceNumber: number; // Deprecated - kept for backwards compatibility
  userSequences?: { [userId: string]: number }; // NEW: Consecutive per user
  signatureUrl: string; // URL or base64
  logoUrl: string; // URL for company logo
  currencySymbol: string;
  banners?: Banner[]; // Array of configurable banners
  emailConfig?: EmailConfig; // Enterprise Feature 4.0
  defaultTaxRate?: number; // Added
}

// NEW: Warehouse/Bodega for inventory storage
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}


// NEW: Inventory item for real-time inventory tracking
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  supplierId: string;
  supplierName: string;
  warehouseId?: string; // NEW: Assigned warehouse
  warehouseName?: string;
  currentStock: number;
  minStock?: number;
  maxStock?: number;
  unit: string;
  lastUpdated: string;
  status: 'Normal' | 'Bajo' | 'Agotado' | 'Exceso';
  unitCost?: number; // Average cost per unit
}

// NEW: Inventory entry for tracking pending items from purchase orders
export type InventoryEntryStatus = 'Pendiente' | 'Parcial' | 'Recibido';

export interface InventoryEntry {
  id: string;
  orderId: string;
  orderSequence: number;
  productId: string;
  productName: string;
  productCode: string;
  supplierId: string;
  supplierName: string;
  quantityOrdered: number;
  quantityReceived: number;
  quantityPending: number;
  unit: string;
  unitPrice: number;
  status: InventoryEntryStatus;
  orderDate: string;
  receivedDate?: string;
  receivedBy?: string;
  warehouseId?: string; // NEW: Warehouse where received
  warehouseName?: string;
  notes?: string;
}

// --- ENTERPRISE FEATURES V4.0 ---

// Feature 3: Smart Stock Analysis (Extensions to Product)
// (These are logical extensions, handled in the interface Product)
/*
  Product interface update:
  - minStock: number (Reorder Point)
  - maxStock: number
  - leadTime: number (Days to arrive)
  - averageMonthlyConsumption: number (Calculated)
*/

// Feature 4: Email Notification Settings
export interface EmailConfig {
  enabled: boolean;
  service: 'gmail' | 'outlook' | 'smtp';
  user: string;
  pass?: string; // Encrypted or stored securely
  host?: string;
  port?: number;
  secure?: boolean;
  notifications: {
    onOrderCreated: boolean; // Notify Admin/Approver
    onOrderApproved: boolean; // Notify Buyer
    onOrderRejected: boolean; // Notify Buyer
    onStockLow: boolean;      // Notify Buyer
  };
}