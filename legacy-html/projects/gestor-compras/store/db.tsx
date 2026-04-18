import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { Supplier, Product, PurchaseOrder, AppSettings, User, Activity, InventoryItem, InventoryEntry, Warehouse, CostCenter } from '../types';
import { toast } from 'sonner';

// URL del servidor local - Usa el proxy de Vite en desarrollo
const API_URL = '/api';

// Declaration for the global XLSX variable loaded via CDN
declare const XLSX: any;

interface DbContextType {
  suppliers: Supplier[];
  products: Product[];
  orders: PurchaseOrder[];
  settings: AppSettings;
  users: User[];
  activities: Activity[];
  currentUser: User | null;
  // Inventory Management
  inventoryItems: InventoryItem[];
  inventoryEntries: InventoryEntry[];
  warehouses: Warehouse[];
  costCenters: CostCenter[];
  setCurrentUser: (u: User) => void;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  addUser: (u: User) => void;
  updateUser: (id: string, u: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  logActivity: (type: Activity['type'], action: string, targetId?: string) => Promise<void>;
  addSupplier: (s: Supplier) => void;
  updateSupplier: (id: string, s: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (o: Omit<PurchaseOrder, 'id' | 'sequenceNumber'> & { sequenceNumber?: number }) => Promise<string>;
  updateOrder: (id: string, orderData: Partial<PurchaseOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: PurchaseOrder['status']) => Promise<void>;
  updateSettings: (s: Partial<AppSettings>) => void;
  importSuppliers: (file: File) => Promise<void>;
  importProducts: (file: File, supplierId?: string) => Promise<void>;
  uploadFile: (file: File, type: 'logo' | 'signature' | 'documents') => Promise<string>;
  requestChange: (id: string, reason: string, approverId: string, approverName: string) => Promise<void>;
  approveChange: (id: string) => Promise<void>;
  resetDb: () => void;
  exportBackup: () => void;
  exportToExcel: () => void;
  createFullBackup: (type: 'manual' | 'auto_login' | 'auto_logout') => Promise<void>;
  restoreFromBackup: (file: File) => Promise<void>;
  isLoaded: boolean;
  reserveSequence: () => Promise<number>;
  // Inventory Functions
  receiveInventory: (entryId: string, quantityReceived: number, warehouseId: string, notes?: string) => Promise<void>;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  refreshInventoryEntries: () => void;
  // Warehouse Functions
  addWarehouse: (w: Warehouse) => void;
  updateWarehouse: (id: string, w: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  // Cost Centers Functions
  addCostCenter: (cc: CostCenter) => void;
  updateCostCenter: (id: string, cc: Partial<CostCenter>) => void;
  deleteCostCenter: (id: string) => void;
  importCostCenters: (file: File) => Promise<void>;
  // Notifications
  // Double Approval System
  approveByBudget: (id: string) => Promise<void>;
  approveByPurchasing: (id: string, alone?: boolean) => Promise<void>;
  approveOrder: (id: string) => Promise<void>;
  sendEmailNotification: (type: 'onOrderCreated' | 'onOrderApproved' | 'onOrderRejected' | 'onStockLow', data: any) => Promise<void>;
  serverStatus: {
    online: boolean;
    publicIp: string;
    localIps: { name: string; address: string }[];
    uptime: number;
    port: number;
    tunnelUrl: string | null;
    lastUpdate: string;
  };
  refreshHealth: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  companyName: 'MIP INTERNACIONAL TRADING SAS',
  companyAddress: 'CRA 20B 77 05 OF 302',
  companyTaxId: '901.165.028-2',
  nextSequenceNumber: 1,
  signatureUrl: '',
  logoUrl: '',
  currencySymbol: '$',
};

const DbContext = createContext<DbContextType | undefined>(undefined);

export const DbProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Inventory State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryEntries, setInventoryEntries] = useState<InventoryEntry[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [serverStatus, setServerStatus] = useState({
    online: false,
    publicIp: 'Detectando...',
    localIps: [] as { name: string; address: string }[],
    uptime: 0,
    port: 3000,
    tunnelUrl: null,
    lastUpdate: new Date().toISOString()
  });

  const refreshHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/network-status`);
      if (res.ok) {
        const data = await res.json();
        setServerStatus({
          online: true,
          publicIp: data.publicIp || 'No detectada',
          localIps: data.ips || [],
          uptime: data.uptime || 0,
          port: data.port || 3000,
          tunnelUrl: data.tunnelUrl || null,
          lastUpdate: new Date().toISOString()
        });
      }
    } catch (e) {
      setServerStatus(prev => ({ ...prev, online: false }));
    }
  };

  // Authenticated Fetch Helper
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = { ...options.headers } as any;

    // Inject Token
    if (!headers['Authorization']) {
      let token = currentUser?.token;
      // Fallback to LS if state not ready (e.g. init)
      if (!token) {
        try {
          const ls = localStorage.getItem('db_session');
          if (ls) token = JSON.parse(ls).token;
        } catch (e) { }
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const res = await fetch(url, { ...options, headers });

      // Handle Security Errors
      if (res.status === 401) {
        // Unauthorized / Token Expired
        if (currentUser || localStorage.getItem('db_session')) {
          toast.error("Sesión expirada. Por favor ingrese nuevamente.");
          logout();
        }
      } else if (res.status === 403) {
        // Access Forbidden (Schedule or Role)
        const data = await res.clone().json().catch(() => ({}));
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.error("Acceso denegado");
        }
      }

      return res;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      console.log('Iniciando carga de datos...');
      try {
        // 1. Session
        const lsSession = localStorage.getItem('db_session');
        if (lsSession) {
          try {
            const user = JSON.parse(lsSession);
            setCurrentUser(user);
          } catch (e) {
            console.error('Error parsing session', e);
          }
        }

        // 2. Fetch Data Helper
        const fetchData = async (url: string) => {
          try {
            const res = await authFetch(`${API_URL}/${url}`);
            if (!res.ok) return [];
            const data = await res.json();
            return data;
          } catch (error) {
            console.warn(`Failed to fetch ${url}`, error);
            return [];
          }
        };

        // 3. Parallel Fetch
        const [sup, prod, ord, sett, usrs, acts, inv, ent, whs, ccs] = await Promise.all([
          fetchData('suppliers'),
          fetchData('products'),
          fetchData('orders'),
          fetchData('settings'),
          fetchData('users'),
          fetchData('activities'),
          fetchData('inventory_items'),
          fetchData('inventory_entries'),
          fetchData('warehouses'),
          fetchData('cost_centers')
        ]);

        // 4. Set State (Validating Arrays)
        if (Array.isArray(sup)) setSuppliers(sup);
        if (Array.isArray(prod)) setProducts(prod);
        if (Array.isArray(ord)) setOrders(ord);
        if (Array.isArray(usrs)) {
          setUsers(usrs);
          // Refresh current user session data if still logged in
          const lsSession = localStorage.getItem('db_session');
          if (lsSession) {
            try {
              const currentSession: any = JSON.parse(lsSession);
              const freshUser = usrs.find(u => u.id === currentSession.id);
              if (freshUser) {
                const updatedUser = { ...currentSession, ...freshUser };
                setCurrentUser(updatedUser);
                localStorage.setItem('db_session', JSON.stringify(updatedUser));
              }
            } catch (e) { }
          }
        }
        if (Array.isArray(acts)) setActivities(acts);
        if (Array.isArray(inv)) setInventoryItems(inv);
        if (Array.isArray(ent)) setInventoryEntries(ent);
        if (Array.isArray(whs)) setWarehouses(whs);
        if (Array.isArray(ccs)) setCostCenters(ccs);


        // Settings is object
        if (sett && !Array.isArray(sett)) {
          setSettings(prev => ({ ...prev, ...sett }));
        }

        // 5. Restore Token if needed
        // 5. Restore Token Always (Critical Fix)
        if (lsSession) {
          try {
            const cachedUser = JSON.parse(lsSession);
            let userToSet = cachedUser;

            // Only update if we successfully fetched fresh users list
            if (Array.isArray(usrs) && usrs.length > 0) {
              const freshUser = usrs.find((u: User) => u.id === cachedUser.id);
              if (freshUser) {
                userToSet = { ...freshUser, token: cachedUser.token };
              }
            }

            // Set User and Persist
            setCurrentUser(userToSet);
            // Don't re-save to LS blindly to avoid overwriting with stale data if not needed, 
            // but refreshing the object in state is key.
            if (userToSet !== cachedUser) {
              localStorage.setItem('db_session', JSON.stringify(userToSet));
            }
          } catch (e) {
            console.error("Error restoring session", e);
          }
        }

      } catch (err) {
        console.error('CRITICAL ERROR loading data:', err);
      } finally {
        console.log('Carga finalizada, habilitando app...');
        setIsLoaded(true);
      }
    };

    loadAllData();

    // Health Polling
    refreshHealth();
    const healthInterval = setInterval(refreshHealth, 5000); // Every 5s
    return () => clearInterval(healthInterval);
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Login fallido");
        return null;
      }

      const user = await res.json();
      // Don't set current user yet if we want the modal to confirm first?
      // Actually Login.tsx logic relies on tempUser first. 
      // But db.tsx was auto-setting it.
      // Let's keep auto-setting it for safety, but return it so Login.tsx has the object.
      setCurrentUser(user);
      localStorage.setItem('db_session', JSON.stringify(user));

      // Log login manually
      authFetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'system',
          action: `Inicio de sesión: ${user.name}`,
          userId: user.id,
          userName: user.name
        })
      }).then(r => r.json()).then(act => setActivities(prev => [act, ...prev].slice(0, 50))).catch(() => { });

      // Trigger Auto-Backup on Login
      authFetch(`${API_URL}/backup/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'auto_login' })
      }).catch(console.error);

      return user;
    } catch (err) {
      toast.error("Error conectando con el servidor");
      return null;
    }
  };

  // Activity Logging
  const logActivity = async (type: Activity['type'], action: string, targetId?: string) => {
    if (!currentUser) return;
    try {
      const activityData = {
        type,
        action,
        userId: currentUser.id,
        userName: currentUser.name,
        targetId
      };
      const res = await authFetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      if (res.ok) {
        const newAct = await res.json();
        setActivities(prev => [newAct, ...prev].slice(0, 50));
      }
    } catch (err) {
      console.error("Error logging activity", err);
    }
  };

  // Heartbeat Presence
  useEffect(() => {
    if (!currentUser) return;

    const sendHeartbeat = () => {
      authFetch(`${API_URL}/users/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      }).catch(() => { });
    };

    sendHeartbeat(); // Immediate
    const interval = setInterval(sendHeartbeat, 30000); // Every 30s
    return () => clearInterval(interval);
  }, [currentUser]);

  const logout = () => {
    // Trigger Auto-Backup on Logout
    authFetch(`${API_URL}/backup/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'auto_logout' })
    }).catch(console.error);

    authFetch(`${API_URL}/logout`, { method: 'POST' }).catch(() => { });

    setCurrentUser(null);
    localStorage.removeItem('db_session');
    // Force reload to clear state cleanly
    window.location.reload();
  };


  const addSupplier = async (s: Supplier) => {
    try {
      await authFetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s)
      });
      setSuppliers(prev => {
        const exists = prev.find(item => item.id === s.id);
        if (exists) return prev.map(item => item.id === s.id ? s : item);
        return [...prev, s];
      });
    } catch (err) {
      toast.error("Error al guardar en el servidor");
    }
  };

  const updateSupplier = async (id: string, s: Partial<Supplier>) => {
    try {
      await authFetch(`${API_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s)
      });
      setSuppliers(prev => prev.map(sup => sup.id === id ? { ...sup, ...s } : sup));
      logActivity('supplier', `Actualizó proveedor: ${s.name || id}`, id);
      toast.success("Proveedor actualizado");
    } catch (err) {
      toast.error("Error al actualizar proveedor en el servidor");
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await authFetch(`${API_URL}/suppliers/${id}`, {
        method: 'DELETE'
      });
      setSuppliers(prev => prev.filter(s => s.id !== id));
      logActivity('supplier', `Eliminó proveedor: ${id}`, id);
      toast.success("Proveedor eliminado");
    } catch (err) {
      toast.error("Error al eliminar proveedor en el servidor");
    }
  };

  const addProduct = async (p: Product) => {
    try {
      const res = await authFetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (!res.ok) throw new Error("Error en servidor");

      setProducts(prev => {
        const exists = prev.find(item => item.id === p.id);
        if (exists) return prev.map(item => item.id === p.id ? p : item);
        return [...prev, p];
      });
      logActivity('product', `Agregó producto: ${p.name}`, p.id);
    } catch (err) {
      // toast handled by authFetch for 403, or generic here
      toast.error("Error al guardar producto");
    }
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    try {
      const res = await authFetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (!res.ok) throw new Error("Error en servidor");

      setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, ...p } : prod));
      logActivity('product', `Actualizó producto: ${p.name || id}`, id);
      toast.success("Producto actualizado");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar producto");
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await authFetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Error en servidor");

      setProducts(prev => prev.filter(p => p.id !== id));
      logActivity('product', `Eliminó producto: ${id}`, id);
      toast.success("Producto eliminado");
    } catch (err) {
      // toast handled by authFetch for 403
    }
  };

  const addUser = async (u: User) => {
    try {
      const res = await authFetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error creating user:', res.status, errorData);
        if (res.status !== 401 && res.status !== 403) {
          toast.error(errorData.error || "Error al crear usuario");
        }
        return;
      }

      setUsers(prev => [...prev, u]);
      logActivity('user', `Agregó usuario: ${u.name}`, u.id);
      toast.success("Usuario creado exitosamente");
    } catch (err) {
      console.error('Error in addUser:', err);
      toast.error("Error de conexión al crear usuario");
    }
  };

  const updateUser = async (id: string, u: Partial<User>) => {
    try {
      await authFetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });
      setUsers(prev => prev.map(user => user.id === id ? { ...user, ...u } : user));

      // Update persistent session if current user is the one being updated
      if (currentUser && currentUser.id === id) {
        const updatedUser = { ...currentUser, ...u };
        setCurrentUser(updatedUser);
        localStorage.setItem('db_session', JSON.stringify(updatedUser));
      }

      logActivity('user', `Actualizó usuario: ${u.name || id}`, id);
      toast.success("Usuario actualizado correctamente");
    } catch (err) {
      toast.error("Error al actualizar usuario");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await authFetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      setUsers(prev => prev.filter(user => user.id !== id));

      // Logout if deleting self
      if (currentUser && currentUser.id === id) {
        logout();
      }

      logActivity('user', `Eliminó usuario: ${id}`, id);
      toast.success("Usuario eliminado");
    } catch (err) {
      toast.error("Error al eliminar usuario");
    }
  };


  const sendEmailNotification = async (type: 'onOrderCreated' | 'onOrderApproved' | 'onOrderRejected' | 'onStockLow', data: any) => {
    // 1. Check if email is enabled globally and for this event
    if (!settings.emailConfig?.enabled) return;
    if (!settings.emailConfig.notifications[type]) return;

    // 2. Determine Recipient & Content based on Type
    let to = settings.emailConfig.user; // Default fallback
    let subject = '';
    let html = '';

    const companyName = settings.companyName;

    try {
      if (type === 'onOrderCreated') {
        // Notify Approvers
        const approvers = users.filter(u => u.role === 'Approver' || u.role === 'Admin');
        if (approvers.length > 0) {
          // In a real app we might email all of them, but here let's email the first one or a "manager" email if we had one.
          // For now, we will send to the configured send email (assuming it acts as an admin inbox) OR implemented user emails
          // Since User implementation doesn't have 'email' field yet (only username), we rely on the system email for now.
          // TODO: Add email to User model for individual notifications.
        }
        subject = `[${companyName}] Nueva Orden de Compra #${data.sequenceNumber}`;
        html = `<h2>Nueva Orden Creada</h2>
                    <p>Se requiere aprobación para la orden <strong>#${data.sequenceNumber}</strong>.</p>
                    <p>Proveedor: ${data.supplierName}</p>
                    <p>Total: <strong>${settings.currencySymbol} ${data.total.toLocaleString()}</strong></p>
                    <a href="${window.location.origin}/dashboard">Ir al Dashboard</a>`;
      }
      else if (type === 'onOrderApproved') {
        subject = `[${companyName}] Orden Aprobada #${data.sequenceNumber}`;
        html = `<h2>Orden Aprobada</h2>
                    <p>La orden <strong>#${data.sequenceNumber}</strong> ha sido aprobada por ${data.approvedBy}.</p>
                    <p>Ya puede proceder con el envío al proveedor.</p>`;
      }
      else if (type === 'onOrderRejected') {
        subject = `[${companyName}] Orden Rechazada #${data.sequenceNumber}`;
        html = `<h2 style="color:red">Orden Rechazada</h2>
                    <p>La orden <strong>#${data.sequenceNumber}</strong> ha sido rechazada.</p>
                    <p>Motivo: Revisar en el sistema.</p>`;
      }

      // 3. Send
      // We use the configured User email as recipient for MVP loopback (Buyer receives notification)
      // Ideally we would send to the Creator of the order.
      await fetch(`${API_URL}/send-email-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: settings.emailConfig.user, // Self-notification for MVP
          subject,
          html,
          config: settings.emailConfig // Pass config to backend (secure enough for Intranet)
        })
      });

    } catch (e) {
      console.error("Error sending notification", e);
    }
  };

  const reserveSequence = async (): Promise<number> => {
    try {
      const res = await authFetch(`${API_URL}/reserve-sequence`, { method: 'POST' });
      if (!res.ok) throw new Error('Error reserving sequence');
      const data = await res.json();
      // Optimistically update local settings to reflect new sequence
      setSettings(prev => ({ ...prev, nextSequenceNumber: data.sequence + 1 }));
      return data.sequence;
    } catch (e) {
      console.error("Reserve Error", e);
      return settings.nextSequenceNumber;
    }
  };

  const createOrder = async (orderData: Omit<PurchaseOrder, 'id' | 'sequenceNumber'> & { sequenceNumber?: number }) => {
    const newId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    // Use reserved sequence if provided, otherwise fallback to current settings
    // FIXED: Only assign sequence number if provided OR if status is NOT Draft
    let sequence = orderData.sequenceNumber;
    if (sequence === undefined && orderData.status !== 'Draft') {
      sequence = settings.nextSequenceNumber;
    }

    const roundedTotal = Math.round(orderData.total);
    const roundedSubtotal = Math.round(orderData.subtotal);
    const roundedTax = Math.round(orderData.tax);

    let calculatedPaid = 0;
    let calculatedDebt = roundedTotal;
    let finalAdvancePct = 0;

    if (orderData.paymentType === 'Advance') {
      finalAdvancePct = orderData.advancePercentage || 0.5;
      calculatedPaid = Math.round(roundedTotal * finalAdvancePct);
      calculatedDebt = roundedTotal - calculatedPaid;
    } else {
      // Credit
      calculatedPaid = 0;
      calculatedDebt = roundedTotal;
      finalAdvancePct = 0;
    }

    const roundedItems = Array.isArray(orderData.items) ? orderData.items.map(item => ({
      ...item,
      unitPrice: Math.round(item.unitPrice || 0),
      total: Math.round(item.total || 0)
    })) : orderData.items;

    const newOrder: PurchaseOrder = {
      ...orderData,
      id: newId,
      sequenceNumber: sequence,
      items: roundedItems,
      subtotal: roundedSubtotal,
      tax: roundedTax,
      total: roundedTotal,
      paidAmount: calculatedPaid,
      debtAmount: calculatedDebt,
      advancePercentage: finalAdvancePct
    };

    try {
      const res = await authFetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error servidor: ${res.status}`);
      }

      const savedOrder = await res.json();
      setOrders(prev => [savedOrder, ...prev]);
      logActivity('order', `Creó orden de compra: #${sequence}`, newId);

      // Only force-update settings if we didn't use a reserved sequence (legacy mode)
      // or to ensure consistency. Since we might have reserved it earlier, updating settings here
      // might be redundant if we provided seq, but safe.
      if (!orderData.sequenceNumber && orderData.status !== 'Draft' && sequence !== undefined) {
        const newSettings = { ...settings, nextSequenceNumber: settings.nextSequenceNumber + 1 };
        await updateSettings(newSettings);
      } else if (sequence !== undefined) {
        // If we used a reserved sequence, ensure frontend state is at least ahead of it
        if (settings.nextSequenceNumber <= sequence) {
          setSettings(prev => ({ ...prev, nextSequenceNumber: sequence + 1 }));
        }
      }

      // Trigger Notification
      sendEmailNotification('onOrderCreated', { ...newOrder, sequenceNumber: sequence });

      return newId;
    } catch (err: any) {
      console.error("Error creating order:", err);
      toast.error(`Error al crear la orden: ${err.message || 'Error desconocido'}`);
      throw err;
    }
  };

  const updateOrder = async (id: string, orderData: Partial<PurchaseOrder>) => {
    const roundedData = { ...orderData };
    if (roundedData.total !== undefined) roundedData.total = Math.round(roundedData.total);
    if (roundedData.subtotal !== undefined) roundedData.subtotal = Math.round(roundedData.subtotal);
    if (roundedData.tax !== undefined) roundedData.tax = Math.round(roundedData.tax);
    if (roundedData.paidAmount !== undefined) roundedData.paidAmount = Math.round(roundedData.paidAmount);
    if (roundedData.debtAmount !== undefined) roundedData.debtAmount = Math.round(roundedData.debtAmount);

    if (Array.isArray(roundedData.items)) {
      roundedData.items = roundedData.items.map(item => ({
        ...item,
        unitPrice: Math.round(item.unitPrice || 0),
        total: Math.round(item.total || 0)
      }));
    }

    try {
      const res = await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roundedData)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error servidor: ${res.status}`);
      }

      const updatedOrder = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
      logActivity('order', `Actualizó orden de compra: #${orders.find(o => o.id === id)?.sequenceNumber || id}`, id);
      toast.success("Orden actualizada correctamente");
    } catch (err: any) {
      console.error("Error updating order:", err);
      toast.error(`Error al actualizar: ${err.message || 'Error desconocido'}`);
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await authFetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
      });
      setOrders(prev => prev.filter(o => o.id !== id));
      setInventoryEntries(prev => prev.filter(e => e.orderId !== id));
      logActivity('order', `Eliminó orden ID: ${id}`, id);
      toast.success("Orden eliminada correctamente");
    } catch (err) {
      toast.error("Error al eliminar la orden");
      console.error(err);
    }
  };

  // DOUBLE APPROVAL SYSTEM
  const approveByBudget = async (id: string) => {
    if (!currentUser) return;
    try {
      const updateData: Partial<PurchaseOrder> = {
        budgetApproved: true,
        approvedByBudget: currentUser.name,
        budgetApprovedAt: new Date().toISOString(),
        budgetSignatureUrl: currentUser.signatureUrl
      };

      const res = await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error("Error en servidor");
      const updatedOrder = await res.json();

      // Update local state - use server response to get the actual status (which might be 'Approved' now)
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));

      logActivity('order', `Aprobación Presupuestaria: ${currentUser.name}`, id);
      toast.success("Aprobación de presupuesto registrada");
    } catch (err) {
      toast.error("Error al aprobar presupuesto");
    }
  };

  const approveByPurchasing = async (id: string, alone: boolean = false) => {
    if (!currentUser) return;
    try {
      const updateData: Partial<PurchaseOrder> = {
        purchasingApproved: true,
        approvedByPurchasing: currentUser.name,
        purchasingApprovedAt: new Date().toISOString(),
        purchasingSignatureUrl: currentUser.signatureUrl
      };

      // If Maria Alejandra wants to approve alone (legacy/special case)
      if (alone) {
        updateData.status = 'Approved';
        updateData.approvedBy = currentUser.name;
        updateData.approvedAt = updateData.purchasingApprovedAt;
      }

      const res = await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error("Error en servidor");
      const updatedOrder = await res.json();

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));

      logActivity('order', `Aprobación de Compras: ${currentUser.name}`, id);
      toast.success("Aprobación de compras registrada");
    } catch (err) {
      toast.error("Error al aprobar compras");
    }
  };

  const approveOrder = async (id: string) => {
    if (!currentUser) return;
    try {
      const order = orders.find(o => o.id === id);
      if (!order) return;

      let updateData: Partial<PurchaseOrder> = {};

      if (Array.isArray(order.approvals) && order.approvals.length > 0) {
        const newApprovals = order.approvals.map(a =>
          a.userId === currentUser.id
            ? { ...a, approved: true, approvedAt: new Date().toISOString(), signatureUrl: currentUser.signatureUrl }
            : a
        );
        updateData.approvals = newApprovals;
      } else {
        // Fallback for legacy logic based on names
        const name = currentUser.name.toLowerCase();
        if (name.includes('magdaly')) {
          updateData = { budgetApproved: true, approvedByBudget: currentUser.name, budgetApprovedAt: new Date().toISOString(), budgetSignatureUrl: currentUser.signatureUrl };
        } else if (name.includes('maria alejandra')) {
          updateData = { purchasingApproved: true, approvedByPurchasing: currentUser.name, purchasingApprovedAt: new Date().toISOString(), purchasingSignatureUrl: currentUser.signatureUrl };
        } else {
          updateData = { status: 'Approved', approvedBy: currentUser.name, approvedAt: new Date().toISOString(), approverSignatureUrl: currentUser.signatureUrl };
        }
      }

      const res = await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error("Error en servidor");
      const updatedOrder = await res.json();
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
      logActivity('order', `Aprobación registrada: ${currentUser.name}`, id);
      toast.success("Aprobación registrada");
    } catch (err) {
      toast.error("Error al aprobar");
    }
  };

  const updateOrderStatus = async (id: string, status: PurchaseOrder['status']) => {
    try {
      const updateData: Partial<PurchaseOrder> = {
        status,
        // Legacy support if not using double approval
        approvedBy: status === 'Approved' ? (currentUser?.name || 'Administrador') : undefined,
        approvedAt: status === 'Approved' ? new Date().toISOString() : undefined,
        approverSignatureUrl: status === 'Approved' ? currentUser?.signatureUrl : undefined
      };

      const res = await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) throw new Error("Error en servidor");
      const updatedOrder = await res.json();

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedOrder } : o));

      logActivity('order', `Cambió estado de orden a: ${status}`, id);
      toast.success("Estado actualizado");

      // Reset double approval flags if status is reset to Pending or Draft
      if (status === 'Pending' || status === 'Draft') {
        const resetData = { budgetApproved: false, purchasingApproved: false };
        await authFetch(`${API_URL}/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(resetData) });
        setOrders(prev => prev.map(o => o.id === id ? { ...o, ...resetData } : o));
      }

      // Trigger Notification
      if (status === 'Approved') {
        const order = orders.find(o => o.id === id);
        if (order) sendEmailNotification('onOrderApproved', order);
      } else if (status === 'Anulada') {
        const order = orders.find(o => o.id === id);
        if (order) sendEmailNotification('onOrderRejected', order);
      }

    } catch (err) {
      toast.error("Error al actualizar estado en el servidor");
    }
  };

  const requestChange = async (id: string, reason: string, approverId: string, approverName: string) => {
    try {
      const updateData: Partial<PurchaseOrder> = {
        status: 'ChangeRequested',
        changeReason: reason,
        requestedApproverId: approverId,
        requestedApproverName: approverName
      };

      await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updateData } : o));
      logActivity('order', `Solicitó cambio para orden: ${id} (Dirigido a: ${approverName})`, id);
      toast.success("Solicitud de cambio enviada");
    } catch (err) {
      toast.error("Error al enviar solicitud de cambio");
    }
  };

  const approveChange = async (id: string) => {
    try {
      const updateData: Partial<PurchaseOrder> = {
        status: 'ApprovedForChange'
      };

      await authFetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updateData } : o));
      logActivity('order', `Aprobó cambio para orden: ${id}`, id);
      toast.success("Edición autorizada");
    } catch (err) {
      toast.error("Error al autorizar edición");
    }
  };

  const updateSettings = async (s: Partial<AppSettings>) => {
    try {
      const updated = { ...settings, ...s };
      await authFetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setSettings(updated);
    } catch (err) {
      toast.error("Error al actualizar configuración");
    }
  };

  const resetDb = async () => {
    if (confirm("¿Estás seguro de borrar todos los datos de forma permanente?")) {
      try {
        await authFetch(`${API_URL}/reset`, { method: 'POST' });
        localStorage.clear();
        window.location.reload();
      } catch (err) {
        toast.error("Error al reiniciar el servidor");
      }
    }
  };

  const exportBackup = async () => {
    try {
      const res = await authFetch(`${API_URL}/backup/export`);
      if (!res.ok) throw new Error("Error al exportar");
      const backupData = await res.json();

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `mip_full_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success("Respaldo del servidor descargado");
    } catch (err) {
      toast.error("Error al obtener respaldo del servidor");
    }
  };

  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      const wsUsers = XLSX.utils.json_to_sheet(users.map(u => ({
        ID: u.id,
        Nombre: u.name,
        Usuario: u.username,
        Rol: u.role
      })));
      XLSX.utils.book_append_sheet(wb, wsUsers, "Usuarios");

      const wsSuppliers = XLSX.utils.json_to_sheet(suppliers.map(s => ({
        ID: s.id,
        Nombre: s.name,
        NIT_RUC: s.taxId,
        Telefono: s.phone,
        Email: s.email,
        Direccion: s.address,
        Categoria: s.category,
        Subcategoria: s.subcategory,
        Contacto: s.contactName,
        Banco: s.bankName,
        TipoCuenta: s.accountType,
        NumCuenta: s.accountNumber,
        Activo: s.isActive ? 'SI' : 'NO'
      })));
      XLSX.utils.book_append_sheet(wb, wsSuppliers, "Proveedores");

      const wsProducts = XLSX.utils.json_to_sheet(products.map(p => ({
        ID: p.id,
        Codigo: p.code,
        Nombre: p.name,
        Unidad: p.unit,
        Precio: p.unitPrice,
        Categoria: p.category,
        ProveedorID: p.supplierId,
        Proveedor: suppliers.find(s => s.id === p.supplierId)?.name || 'Desconocido'
      })));
      XLSX.utils.book_append_sheet(wb, wsProducts, "Productos");


      const wsOrders = XLSX.utils.json_to_sheet(orders.map(o => ({
        OrdenID: o.id,
        Consecutivo: o.sequenceNumber,
        Fecha: o.date,
        Proveedor: o.supplierName,
        NIT_Proveedor: o.supplierTaxId,
        Cotizacion: o.quoteNumber || '',
        Total: o.total,
        Subtotal: o.subtotal,
        IVA: o.tax,
        Estado: o.status,
        TipoPago: o.paymentType === 'Advance' ? 'Anticipo' : 'Crédito',
        Pagado: o.paidAmount || 0,
        Deuda: o.debtAmount || 0,
        AprobadoPor: o.approvedBy || '',
        AprobadoFecha: o.approvedAt || ''
      })));
      XLSX.utils.book_append_sheet(wb, wsOrders, "Ordenes");

      const orderItems = orders.flatMap(o => o.items.map(i => ({
        Consecutivo_Orden: o.sequenceNumber,
        Fecha_Orden: o.date,
        Proveedor: o.supplierName,
        Codigo_Producto: i.productCode,
        Producto: i.productName,
        Cantidad: i.quantity,
        Precio_Unit: i.unitPrice,
        Tasa_IVA: i.taxRate,
        Subtotal_Item: i.total
      })));
      const wsOrderItems = XLSX.utils.json_to_sheet(orderItems);
      XLSX.utils.book_append_sheet(wb, wsOrderItems, "Detalle_Ordenes");

      const fileName = `Backup_MIP_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success("Archivo Excel generado correctamente");

    } catch (error) {
      console.error(error);
      toast.error("Error al generar Excel");
    }
  };

  const restoreFromBackup = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backup = JSON.parse(content);

          if (!backup.data || !backup.data.settings) {
            throw new Error("Formato de archivo inválido.");
          }

          if (confirm("ADVERTENCIA: Esta acción REEMPLAZARÁ toda la información en el servidor con los datos del respaldo. ¿Desea continuar?")) {
            toast.info("Restaurando datos en el servidor...");

            const res = await authFetch(`${API_URL}/backup/import`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: backup.data })
            });

            if (!res.ok) throw new Error("Error en el servidor al importar");

            toast.success("Base de datos restaurada. Recargando...");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            resolve();
          }
        } catch (error) {
          console.error(error);
          toast.error("Error al restaurar: Archivo corrupto o inválido.");
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const createFullBackup = async (type: 'manual' | 'auto_login' | 'auto_logout') => {
    try {
      const res = await authFetch(`${API_URL}/backup/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });

      if (!res.ok) throw new Error("Error creating backup");

      const result = await res.json();
      if (type === 'manual') {
        toast.success("Respaldo completo guardado en servidor");
        // Trigger download (Need to use authFetch or token in URL if endpoint was protected, but download usually uses cookie or public one-time-token. 
        // Our download endpoint /api/backup/download/:type/:filename is currently protected by 'authenticate' middleware!
        // This will fail because window.open/anchor cannot send Authorization header.
        // Quick Fix: We need to allow file downloads or use XHR/Blob.

        // Let's use Blob download to support Auth Header
        const dlRes = await authFetch(`${API_URL}/backup/download/manual/${result.fileName}`);
        if (dlRes.ok) {
          const blob = await dlRes.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = result.fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al crear respaldo completo");
    }
  };

  const uploadFile = async (file: File, type: 'logo' | 'signature' | 'documents' | 'signatures'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await authFetch(`${API_URL}/upload/${type}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la subida");

      const data = await res.json();
      return data.url;
    } catch (err) {
      toast.error("Error al subir el archivo al servidor");
      throw err;
    }
  };

  const normalize = (str: string | number | null | undefined) =>
    String(str || '')
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9]/g, '');

  const getCellValue = (row: (string | number | null | undefined)[], headerMap: Record<string, number>, ...possibleHeaders: string[]) => {
    for (const h of possibleHeaders) {
      const normalizedH = normalize(h);
      if (normalizedH in headerMap) {
        const val = row[headerMap[normalizedH]];
        return val !== undefined && val !== null ? val : '';
      }
    }
    return '';
  };

  const parsePrice = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9.,-]/g, '');
    if (!clean) return 0;

    // Determine if comma is decimal or thousand separator
    const commaIdx = clean.lastIndexOf(',');
    const dotIdx = clean.lastIndexOf('.');

    if (commaIdx > dotIdx) {
      // Comma is likely decimal (European/Latin style)
      return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
    } else if (dotIdx > commaIdx) {
      // Dot is likely decimal (US/Standard style)
      return parseFloat(clean.replace(/,/g, ''));
    }

    return parseFloat(clean) || 0;
  };

  const importSuppliers = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const data = new Uint8Array(buffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | undefined | null)[][];
          if (rows.length === 0) throw new Error("Archivo vacío");

          let headerRowIndex = -1;
          const headerMap: Record<string, number> = {};

          for (let i = 0; i < Math.min(rows.length, 20); i++) {
            const row = rows[i];
            const hasName = row.some((cell: any) => {
              const n = normalize(cell);
              return n.includes('NOMBRE') || n.includes('RAZONSOCIAL') || n.includes('EMPRESA') || n.includes('NAME') || n.includes('PROVEEDOR');
            });
            const hasNit = row.some((cell: any) => {
              const n = normalize(cell);
              return n.includes('NIT') || n.includes('RUC') || n.includes('IDENTIFICACION') || n.includes('TAXID') || n.includes('ID');
            });
            if (hasName && hasNit) {
              headerRowIndex = i;
              row.forEach((cell: any, idx: number) => {
                if (cell) headerMap[normalize(cell)] = idx;
              });
              break;
            }
          }

          if (headerRowIndex === -1) {
            toast.error("No se encontraron los encabezados (NOMBRE, NIT).");
            return;
          }

          const suppliersToImport: Supplier[] = [];
          for (let i = headerRowIndex + 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const sName = String(getCellValue(row, headerMap, 'NOMBRE', 'RAZONSOCIAL', 'EMPRESA', 'NAME', 'PROVEEDOR', 'VENDOR')).trim();
            const sTax = String(getCellValue(row, headerMap, 'NIT', 'RUC', 'IDENTIFICACION', 'TAXID', 'DOCUMENTO', 'ID', 'IDENTIFICACIÓN')).trim();

            if (!sName || !sTax) continue;

            suppliersToImport.push({
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
              name: sName,
              taxId: sTax,
              email: String(getCellValue(row, headerMap, 'EMAIL', 'CORREO', 'MAIL') || ''),
              phone: String(getCellValue(row, headerMap, 'TELEFONO', 'CELULAR', 'PHONE', 'TEL') || ''),
              address: String(getCellValue(row, headerMap, 'DIRECCION', 'UBICACION', 'ADDRESS', 'DIR') || ''),
              category: String(getCellValue(row, headerMap, 'CATEGORIA', 'TIPO', 'RUBRO') || 'General'),
              subcategory: String(getCellValue(row, headerMap, 'SUBCATEGORIA', 'SUBTIPO') || ''),
              isActive: true
            });
          }

          toast.info(`Importando ${suppliersToImport.length} proveedores...`);

          const res = await authFetch(`${API_URL}/bulk/suppliers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(suppliersToImport)
          });

          if (!res.ok) throw new Error("Error en importación masiva");

          const result = await res.json();
          toast.success(`Importación: ${result.created} nuevos, ${result.updated} actualizados.`);

          // Reload
          const loaded = await authFetch(`${API_URL}/suppliers`).then(r => r.json());
          setSuppliers(loaded);
          resolve();

        } catch (err) {
          console.error(err);
          toast.error("Error al procesar archivo Excel");
          reject(err);
        }
      };
    });
  };

  const importProducts = async (file: File, supplierId?: string) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const data = new Uint8Array(buffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number | undefined | null)[][];
          if (rows.length === 0) throw new Error("Archivo vacío");

          let headerRowIndex = -1;
          const headerMap: Record<string, number> = {};

          for (let i = 0; i < Math.min(rows.length, 20); i++) {
            const row = rows[i];
            const hasCode = row.some((cell: any) => {
              const n = normalize(cell);
              return n.includes('CODIGO') || n.includes('CODE') || n.includes('ID') || n.includes('REF');
            });
            const hasName = row.some((cell: any) => {
              const n = normalize(cell);
              return n.includes('NOMBRE') || n.includes('PRODUCTO') || n.includes('DESCRIPCION') || n.includes('NAME');
            });
            if (hasCode && hasName) {
              headerRowIndex = i;
              row.forEach((cell: any, idx: number) => {
                if (cell) headerMap[normalize(cell)] = idx;
              });
              break;
            }
          }

          if (headerRowIndex === -1) {
            toast.info("No se detectaron encabezados, se asumirá que la primera columna es el Nombre.");
            // Map first column as name fallback
            headerRowIndex = -1; // Keep it -1 to indicate raw mode
          }

          const productsToImport: Product[] = [];
          const startIdx = headerRowIndex === -1 ? 0 : headerRowIndex + 1;

          for (let i = startIdx; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            let pCode: string = '';
            let pName: string = '';
            let pUnit: string = 'UND';
            let pPrice: number = 0;
            let pCategory: string = 'General';

            if (headerRowIndex !== -1) {
              pCode = String(getCellValue(row, headerMap, 'CODIGO', 'CODE', 'ID', 'REFERENCIA')).trim();
              pName = String(getCellValue(row, headerMap, 'NOMBRE', 'PRODUCTO', 'DESCRIPCION', 'NAME')).trim();
              pUnit = String(getCellValue(row, headerMap, 'UNIDAD', 'UNIT', 'MEDIDA', 'UOM') || 'UND');
              pPrice = parsePrice(getCellValue(row, headerMap, 'PRECIO', 'PRICE', 'COSTO', 'VALOR'));
              pCategory = String(getCellValue(row, headerMap, 'CATEGORIA', 'CATEGORY', 'FAMILIA') || 'General');
            } else {
              // Raw mode: Assume Col A is Name
              pName = String(row[0] || '').trim();
              if (!pName) continue;
              // Other fields will be default or from other specific columns if we want to guess
              pCode = String(row[1] || '').trim(); // Try Col B for code
            }

            if (!pName) continue;

            // Auto-generate code if missing
            if (!pCode) {
              pCode = `AUTO-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
            }

            const pSupplierId = supplierId || String(getCellValue(row, headerMap, 'PROVEEDOR_ID', 'SUPPLIER_ID') || '');

            productsToImport.push({
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
              code: pCode,
              supplierId: pSupplierId,
              name: pName,
              unit: pUnit,
              unitPrice: pPrice,
              category: pCategory,
              type: 'Producto'
            });
          }

          toast.info(`Importando ${productsToImport.length} productos...`);

          const res = await authFetch(`${API_URL}/bulk/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productsToImport)
          });

          if (!res.ok) throw new Error("Error en importación masiva");

          const result = await res.json();
          toast.success(`Productos: ${result.created} nuevos, ${result.updated} actualizados.`);

          const loaded = await authFetch(`${API_URL}/products`).then(r => r.json());
          setProducts(loaded);
          resolve();

        } catch (err) {
          console.error(err);
          toast.error("Error al procesar archivo Excel de productos");
          reject(err);
        }
      };
    });
  };

  const importCostCenters = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const data = new Uint8Array(buffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][];

          if (rows.length === 0) throw new Error("Archivo vacío");

          const toImport: CostCenter[] = [];

          let codeIdx = 0, nameIdx = 1;
          const firstRow = rows[0]?.map(c => String(c).toUpperCase()) || [];
          firstRow.forEach((cell, idx) => {
            if (cell.includes('COD') || cell.includes('ID')) codeIdx = idx;
            if (cell.includes('NOM') || cell.includes('NAME')) nameIdx = idx;
          });

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row[nameIdx]) continue;
            toImport.push({
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 5),
              code: row[codeIdx] ? String(row[codeIdx]) : 'S/C',
              name: String(row[nameIdx])
            });
          }

          const res = await authFetch(`${API_URL}/bulk/cost_centers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toImport),
          });

          if (!res.ok) throw new Error("Error en importación masiva");

          const loaded = await authFetch(`${API_URL}/cost_centers`).then(r => r.json());
          setCostCenters(loaded);
          toast.success(`${toImport.length} centros de costos importados.`);
          resolve();
        } catch (err: any) {
          toast.error("Error al importar: " + err.message);
          reject(err);
        }
      };
    });
  };

  // Generate inventory entries from orders that are approved or delivered
  const refreshInventoryEntries = () => {
    const entries: InventoryEntry[] = [];

    orders.forEach(order => {
      // Only consider approved orders that have products (not services)
      if (order.status === 'Approved' || order.status === 'AcuerdoComercial') {
        order.items.forEach(item => {
          // Skip services, only track products
          if (item.itemType === 'Servicio') return;

          // Check if entry already exists
          const existingEntry = inventoryEntries.find(e =>
            e.orderId === order.id && e.productId === item.productId
          );

          const quantityReceived = existingEntry?.quantityReceived || 0;
          const quantityPending = item.quantity - quantityReceived;

          let status: InventoryEntry['status'] = 'Pendiente';
          if (quantityReceived >= item.quantity) {
            status = 'Recibido';
          } else if (quantityReceived > 0) {
            status = 'Parcial';
          }

          entries.push({
            id: existingEntry?.id || `${order.id}-${item.productId}`,
            orderId: order.id,
            orderSequence: order.sequenceNumber,
            productId: item.productId,
            productName: item.productName,
            productCode: item.productCode,
            supplierId: order.supplierId,
            supplierName: order.supplierName,
            quantityOrdered: item.quantity,
            quantityReceived,
            quantityPending,
            unit: item.unit || 'UND',
            unitPrice: item.unitPrice,
            status,
            orderDate: order.date,
            receivedDate: existingEntry?.receivedDate,
            receivedBy: existingEntry?.receivedBy,
            notes: existingEntry?.notes
          });
        });
      }
    });

    setInventoryEntries(entries);
  };

  // Receive items into inventory
  const receiveInventory = async (entryId: string, quantityReceived: number, warehouseId: string, notes?: string) => {
    const entry = inventoryEntries.find(e => e.id === entryId);
    if (!entry) {
      toast.error("Entrada no encontrada");
      return;
    }

    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (!warehouse) {
      toast.error("Debe seleccionar una bodega");
      return;
    }

    const totalReceived = entry.quantityReceived + quantityReceived;
    const remaining = entry.quantityOrdered - totalReceived;

    let status: InventoryEntry['status'] = 'Pendiente';
    if (totalReceived >= entry.quantityOrdered) {
      status = 'Recibido';
    } else if (totalReceived > 0) {
      status = 'Parcial';
    }

    // Update entry
    const updatedEntry: InventoryEntry = {
      ...entry,
      quantityReceived: totalReceived,
      quantityPending: remaining,
      status,
      receivedDate: new Date().toISOString(),
      receivedBy: currentUser?.name,
      warehouseId: warehouseId,
      warehouseName: warehouse.name,
      notes: notes || entry.notes
    };

    try {
      // PERSIST ENTRY
      await authFetch(`${API_URL}/inventory_entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
      });

      setInventoryEntries(prev => prev.map(e => e.id === entryId ? updatedEntry : e));

      // Update or create inventory item
      const existingItem = inventoryItems.find(i => i.productId === entry.productId && i.warehouseId === warehouseId);

      if (existingItem) {
        const updatedItem: InventoryItem = {
          ...existingItem,
          currentStock: existingItem.currentStock + quantityReceived,
          lastUpdated: new Date().toISOString(),
          status: calculateStockStatus(existingItem.currentStock + quantityReceived, existingItem.minStock, existingItem.maxStock)
        };

        await authFetch(`${API_URL}/inventory_items/${existingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem)
        });

        setInventoryItems(prev => prev.map(i => i.id === existingItem.id ? updatedItem : i));
      } else {
        const newItem: InventoryItem = {
          id: `inv-${entry.productId}-${warehouseId}`,
          productId: entry.productId,
          productName: entry.productName,
          productCode: entry.productCode,
          supplierId: entry.supplierId,
          supplierName: entry.supplierName,
          warehouseId: warehouseId,
          warehouseName: warehouse.name,
          currentStock: quantityReceived,
          minStock: 5,
          maxStock: 100,
          unit: entry.unit,
          lastUpdated: new Date().toISOString(),
          status: 'Normal',
          unitCost: entry.unitPrice
        };

        await authFetch(`${API_URL}/inventory_items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });

        setInventoryItems(prev => [...prev, newItem]);
      }

      logActivity('inventory', `Recibió ${quantityReceived} ${entry.unit} de ${entry.productName} en ${warehouse.name}`, entryId);
      toast.success(`Recibido: ${quantityReceived} ${entry.unit} de ${entry.productName} → ${warehouse.name}`);
    } catch (err) {
      toast.error("Error al persistir recepción de inventario");
    }
  };

  const calculateStockStatus = (stock: number, min?: number, max?: number): InventoryItem['status'] => {
    if (stock === 0) return 'Agotado';
    if (min && stock < min) return 'Bajo';
    if (max && stock > max) return 'Exceso';
    return 'Normal';
  };

  // Update inventory item directly
  const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => {
    try {
      const item = inventoryItems.find(i => i.id === id);
      if (!item) return;

      const updated = { ...item, ...data, lastUpdated: new Date().toISOString() };
      updated.status = calculateStockStatus(updated.currentStock, updated.minStock, updated.maxStock);

      await authFetch(`${API_URL}/inventory_items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      setInventoryItems(prev => prev.map(i => i.id === id ? updated : i));
      toast.success("Inventario actualizado");
    } catch (err) {
      toast.error("Error al actualizar inventario");
    }
  };

  // Warehouse CRUD Functions
  const addWarehouse = async (w: Warehouse) => {
    try {
      const res = await authFetch(`${API_URL}/warehouses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(w)
      });
      if (!res.ok) throw new Error("Error en servidor");

      setWarehouses(prev => [...prev, w]);
      logActivity('inventory', `Creó bodega: ${w.name}`, w.id);
      toast.success(`Bodega "${w.name}" creada`);
    } catch (err) {
      toast.error("Error al crear bodega");
    }
  };

  const updateWarehouse = async (id: string, w: Partial<Warehouse>) => {
    try {
      const res = await authFetch(`${API_URL}/warehouses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(w)
      });
      if (!res.ok) throw new Error("Error en servidor");

      setWarehouses(prev => prev.map(wh => wh.id === id ? { ...wh, ...w } : wh));
      logActivity('inventory', `Actualizó bodega: ${w.name || id}`, id);
      toast.success("Bodega actualizada");
    } catch (err) {
      // toast handled by authFetch
    }
  };

  const deleteWarehouse = async (id: string) => {
    const warehouse = warehouses.find(w => w.id === id);
    const hasItems = inventoryItems.some(i => i.warehouseId === id);
    if (hasItems) {
      toast.error("No se puede eliminar una bodega con productos asignados");
      return;
    }
    try {
      const res = await authFetch(`${API_URL}/warehouses/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Error en servidor");

      setWarehouses(prev => prev.filter(w => w.id !== id));
      logActivity('inventory', `Eliminó bodega: ${warehouse?.name || id}`, id);
      toast.success("Bodega eliminada");
    } catch (err) {
      // toast handled by authFetch
    }
  };

  const addCostCenter = async (cc: CostCenter) => {
    try {
      const res = await authFetch(`${API_URL}/cost_centers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cc)
      });
      if (!res.ok) throw new Error("Error en servidor");

      setCostCenters(prev => [...prev, cc]);
      logActivity('system', `Agregó centro de costo: ${cc.code} - ${cc.name}`, cc.id);
      toast.success("Centro de costo creado");
    } catch (err) {
      toast.error("Error al crear centro de costo");
    }
  };

  const updateCostCenter = async (id: string, cc: Partial<CostCenter>) => {
    try {
      const res = await authFetch(`${API_URL}/cost_centers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cc)
      });
      if (!res.ok) throw new Error("Error en servidor");

      setCostCenters(prev => prev.map(item => item.id === id ? { ...item, ...cc } : item));
      logActivity('system', `Actualizó centro de costo: ${cc.name || id}`, id);
      toast.success("Centro de costo actualizado");
    } catch (err) {
      // toast handled by authFetch
    }
  };

  const deleteCostCenter = async (id: string) => {
    try {
      const res = await authFetch(`${API_URL}/cost_centers/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Error en servidor");

      setCostCenters(prev => prev.filter(cc => cc.id !== id));
      logActivity('system', `Eliminó centro de costo ID: ${id}`, id);
      toast.success("Centro de costo eliminado");
    } catch (err) {
      // toast handled by authFetch
    }
  };

  // Refresh entries when orders change
  useEffect(() => {
    if (orders.length > 0) {
      refreshInventoryEntries();
    }
  }, [orders]);

  return (
    <DbContext.Provider value={{
      suppliers, products, orders, settings, users, activities, currentUser, isLoaded,
      inventoryItems, inventoryEntries, warehouses, costCenters,
      setCurrentUser, login, logout, addUser, updateUser, deleteUser,
      logActivity, addSupplier, updateSupplier, deleteSupplier,
      addProduct, updateProduct, deleteProduct, createOrder, updateOrder, deleteOrder, updateOrderStatus,
      updateSettings, importSuppliers, importProducts, uploadFile,
      requestChange, approveChange, resetDb, exportBackup, exportToExcel,
      createFullBackup,
      restoreFromBackup,
      reserveSequence,
      // Inventory
      receiveInventory, updateInventoryItem, refreshInventoryEntries,
      addWarehouse, updateWarehouse, deleteWarehouse,
      // Cost Centers
      addCostCenter, updateCostCenter, deleteCostCenter, importCostCenters,
      sendEmailNotification, approveByBudget, approveByPurchasing, approveOrder,
      serverStatus, refreshHealth
    }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error('useDb must be used within a DbProvider');
  }
  return context;
};