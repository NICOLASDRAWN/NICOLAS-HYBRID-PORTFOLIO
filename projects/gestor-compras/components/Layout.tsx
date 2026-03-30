import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus, Settings, ShoppingCart, User, ChevronRight,
  PieChart, PackageSearch, Truck, LogOut, Layers, Menu, X, Bell,
  ChevronDown, Sparkles, Calendar, FileText, LayoutGrid, Search, Command, Home, Package, Users, Plus, FolderOpen, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDb } from '../store/db';
import { MIPLogo } from './MIPLogo';
import { SignatureModal } from './SignatureModal';
import { CommandPalette } from './CommandPalette';
import { SplashScreen } from './SplashScreen';
import { SupplierModal, ProductModal } from '../pages/CreateOrder';
import { toast } from 'sonner';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, settings, isLoaded } = useDb();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [globalSupplierModal, setGlobalSupplierModal] = useState(false);
  const [globalProductModal, setGlobalProductModal] = useState(false);

  const { addSupplier, addProduct, suppliers } = useDb();

  useEffect(() => {
    // Only show splash once per tab session
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      const timer = setTimeout(() => setShowSplash(false), 3800);
      sessionStorage.setItem('hasSeenSplash', 'true');
      return () => clearTimeout(timer);
    }
  }, []);

  // Setup Global Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Operativo',
      items: [
        { to: '/create-order', icon: FilePlus, label: 'Nueva Orden', roles: ['Admin', 'Approver', 'Buyer'], highlight: true },
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
      ]
    },
    {
      title: 'Gestión',
      items: [
        { to: '/suppliers', icon: Truck, label: 'Proveedores', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
        { to: '/products', icon: PackageSearch, label: 'Productos', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
        { to: '/cost-centers', icon: LayoutGrid, label: 'Centros de Costo', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
        { to: '/inventory', icon: Layers, label: 'Inventario', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
        { to: '/documents', icon: FolderOpen, label: 'Biblioteca Docs', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
      ]
    },
    {
      title: 'Administración',
      items: [
        { to: '/monthly-report', icon: Calendar, label: 'Reportes', roles: ['Admin', 'Approver'] },
        { to: '/user-management', icon: Users, label: 'Usuarios', roles: ['Admin'] },
        { to: '/settings', icon: Settings, label: 'Configuración', roles: ['Admin'] },
        { to: '/documentation', icon: BookOpen, label: 'Docs Sistema', roles: ['Admin', 'Approver', 'Viewer', 'Buyer'] },
      ]
    }
  ];

  const getFilteredGroups = () => {
    return navGroups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (item.to === '/settings') {
          return currentUser?.role === 'Admin';
        }
        return item.roles.includes(currentUser?.role || 'Viewer');
      })
    })).filter(group => group.items.length > 0);
  };

  const filteredNavGroups = getFilteredGroups();

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'Admin': return 'from-purple-500 to-indigo-600';
      case 'Approver': return 'from-emerald-500 to-teal-600';
      case 'Buyer': return 'from-blue-500 to-cyan-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'Admin': return { label: 'Administrador', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'Approver': return { label: 'Aprobador', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'Buyer': return { label: 'Comprador', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      default: return { label: 'Visualizador', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
    }
  };

  const role = getRoleBadge(currentUser?.role);

  const mobileNavItems = [
    { to: '/dashboard', icon: Home, label: 'Inicio' },
    { to: '/suppliers', icon: Truck, label: 'Socios' },
    { to: '/create-order', icon: Plus, label: 'Nueva', action: true },
    { to: '/inventory', icon: Package, label: 'Stock' },
    { to: '/monthly-report', icon: PieChart, label: 'Reporte' }
  ].filter(item => {
    const groupItem = navGroups.flatMap(g => g.items).find(i => i.to === item.to);
    return !groupItem || groupItem.roles.includes(currentUser?.role || 'Viewer');
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-800 bg-[#f8fafc] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {(showSplash || !isLoaded) && <SplashScreen key="splash" />}
      </AnimatePresence>

      {/* Sidebar Desktop - Ultra Premium Dark */}
      <aside className="hidden md:flex flex-col w-[280px] bg-[#020617] border-r border-white/5 fixed top-0 bottom-0 left-0 z-50 no-print shadow-[20px_0_80px_-20px_rgba(0,0,0,0.8)]">
        {/* Sidebar Header with Gradient Glow */}
        <div className="p-8 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 blur-[80px] pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/30 active:scale-95 transition-all duration-500">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter leading-none">MIP</h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1.5 opacity-60">International</p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        {/* Navigation Groups - Scrollable Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-8 custom-scrollbar scrollbar-hide">
          {filteredNavGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] opacity-80">{group.title}</p>
              <nav className="space-y-1">
                {group.items.map((item, itemIdx) => (
                  <NavLink
                    key={itemIdx}
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative
                      ${isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                        : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300 border border-transparent'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${location.pathname === item.to ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110' : 'bg-slate-900 group-hover:bg-slate-800'}`}>
                      <item.icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                    {item.highlight && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* User Workspace Status - PINNED TO BOTTOM */}
        <div className="p-4 mt-auto border-t border-slate-900/40 bg-slate-950/40 backdrop-blur-3xl">
          <div className="relative overflow-hidden group p-4 rounded-[2rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-500 cursor-pointer">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 p-0.5 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <User className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter mb-0.5">{currentUser?.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest">{role.label}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
            </div>

            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="absolute inset-0 w-full h-full opacity-0 z-20"
              title="Opciones de Usuario"
            />

            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                    <button
                      onClick={() => { setIsSignatureModalOpen(true); setIsUserDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl text-[9px] font-black uppercase text-blue-400 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Mi Firma Digital
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-rose-500/10 rounded-xl text-[9px] font-black uppercase text-rose-400 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen bg-[#f8fafc] relative md:ml-[280px] transition-all duration-500">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.4] pointer-events-none no-print" />

        {/* Header Desktop - Glassmorphic Search & Actions */}
        <header className="hidden md:flex h-20 items-center justify-between px-10 sticky top-0 z-30 no-print premium-glass">
          <div className="flex items-center gap-5">
            <div className="w-1.5 h-8 rounded-full bg-blue-600 shadow-lg shadow-blue-500/40" />
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
              {(navGroups.flatMap(g => g.items).find(i => i.to === location.pathname)?.label) || 'Panel'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Búsqueda rápida (Ctrl + K)"
                className="w-72 bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all outline-none"
                onClick={() => setIsCommandPaletteOpen(true)}
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
              <div className={`w-2 h-2 rounded-full ${useDb().serverStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {useDb().serverStatus.online ? 'En Línea' : 'Desconectado'}
              </span>
            </div>

            <button
              className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors relative"
              onClick={() => navigate('/drafts')}
              title="Notificaciones y Borradores"
            >
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            {currentUser?.role !== 'Viewer' && (
              <button
                onClick={() => navigate('/create-order')}
                className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                <Plus className="w-4 h-4" />
                Nueva Orden
              </button>
            )}
          </div>
        </header>

        {/* Mobile Header - Native App Style */}
        <header className="md:hidden h-16 px-6 flex items-center justify-between sticky top-0 z-[100] no-print premium-glass border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getRoleColor(currentUser?.role)} flex items-center justify-center shadow-lg`}>
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none">{currentUser?.name.split(' ')[0]}</h1>
              <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1">{role.label}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isQuickActionsOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
              title="Acciones Rápidas"
            >
              <Plus className={`w-5 h-5 transition-transform duration-300 ${isQuickActionsOpen ? 'rotate-45' : ''}`} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 active:scale-90 transition-transform"
              title="Menú Principal"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Quick Actions Popup */}
          <AnimatePresence>
            {isQuickActionsOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsQuickActionsOpen(false)} className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[110]" />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="absolute top-20 right-6 w-56 premium-glass border border-white/40 rounded-3xl p-2 z-[120] shadow-2xl">
                  <button onClick={() => { navigate('/create-order'); setIsQuickActionsOpen(false); }} className="w-full flex items-center gap-3 p-4 hover:bg-white/50 rounded-2xl text-[10px] font-black uppercase text-slate-700 transition-all"><FilePlus className="w-4 h-4 text-blue-600" /> Nueva Orden</button>
                  <button onClick={() => { setGlobalSupplierModal(true); setIsQuickActionsOpen(false); }} className="w-full flex items-center gap-3 p-4 hover:bg-white/50 rounded-2xl text-[10px] font-black uppercase text-slate-700 transition-all"><Truck className="w-4 h-4 text-emerald-600" /> Nuevo Socio</button>
                  <button onClick={() => { setGlobalProductModal(true); setIsQuickActionsOpen(false); }} className="w-full flex items-center gap-3 p-4 hover:bg-white/50 rounded-2xl text-[10px] font-black uppercase text-slate-700 transition-all"><PackageSearch className="w-4 h-4 text-amber-600" /> Maestro Items</button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-10 lg:p-12 relative z-10 pb-mobile-nav md:pb-12">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation - Floating Native Style */}
        {!location.pathname.includes('/create-order') && (
          <nav className="md:hidden no-print bottom-nav-native bg-white/80 backdrop-blur-3xl border-t border-white/50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
            {mobileNavItems.filter(i => !i.action).map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Insert FAB at center */}
                {idx === 2 && (
                  <button
                    onClick={() => navigate('/create-order')}
                    className="bottom-nav-fab group"
                    title="Nueva Orden"
                  >
                    <div className="fab-icon bg-slate-950 text-white shadow-xl group-active:scale-90 transition-transform duration-300">
                      <Plus className="w-8 h-8" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-900 mt-1">Nueva</span>
                  </button>
                )}

                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    bottom-nav-item
                    ${isActive ? 'text-blue-600' : 'text-slate-400 opacity-60'}
                  `}
                >
                  <div className={`p-2.5 rounded-2xl transition-all duration-300 ${location.pathname === item.to ? 'bg-blue-50 scale-110 shadow-sm border border-blue-100' : 'hover:bg-slate-50'}`}>
                    <item.icon className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
                </NavLink>
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Mobile Side Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[150]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[160] shadow-2xl p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Explorar</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-xl" title="Cerrar Menú">
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {filteredNavGroups.map((group, idx) => (
                    <div key={idx} className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4 border-l-2 border-blue-500">{group.title}</p>
                      <div className="grid gap-2">
                        {group.items.map(item => (
                          <button
                            key={item.to}
                            onClick={() => {
                              navigate(item.to);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === item.to ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'
                              }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => { setIsSignatureModalOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex-1 p-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Firma
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 p-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      <SignatureModal isOpen={isSignatureModalOpen} onClose={() => setIsSignatureModalOpen(false)} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />

      {/* Global Action Modals */}
      <AnimatePresence>
        {globalSupplierModal && (
          <SupplierModal
            onClose={() => setGlobalSupplierModal(false)}
            onSave={(s: any) => { addSupplier(s); setGlobalSupplierModal(false); toast.success('Socio registrado correctamente'); }}
          />
        )}
        {globalProductModal && (
          <ProductModal
            onClose={() => setGlobalProductModal(false)}
            onSave={(p: any) => { addProduct(p); setGlobalProductModal(false); toast.success('Producto registrado en el maestro'); }}
            selectedSupplierId=""
            suppliers={suppliers}
          />
        )}
      </AnimatePresence>
    </div>
  );
};