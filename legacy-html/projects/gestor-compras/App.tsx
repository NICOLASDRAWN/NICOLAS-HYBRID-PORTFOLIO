import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CreateOrder } from './pages/CreateOrder';
import { Settings } from './pages/Settings';
import { Finance } from './pages/Finance';
import { Products } from './pages/Products';
import { Suppliers } from './pages/Suppliers';
import { Inventory } from './pages/Inventory';
import { MonthlyReport } from './pages/MonthlyReport';
import { Welcome } from './pages/Welcome';
import { Drafts } from './pages/Drafts';
import { Login } from './pages/Login';
import { CostCenters } from './pages/CostCenters';
import { UserManagement } from './pages/UserManagement';
import { DocumentLibrary } from './pages/DocumentLibrary';
import { Documentation } from './pages/Documentation';
import { DbProvider, useDb } from './store/db';
import { Toaster } from 'sonner';
import { SplashScreen } from './components/SplashScreen';

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, isLoaded } = useDb();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-emerald-500 font-mono text-sm animate-pulse">Iniciando Sistema...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default function App() {
  return (
    <DbProvider>
      <SplashScreen />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create" element={<CreateOrder />} />
            <Route path="create-order" element={<CreateOrder />} />
            <Route path="drafts" element={<Drafts />} />
            <Route path="finance" element={<Finance />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="products" element={<Products />} />
            <Route path="cost-centers" element={<CostCenters />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="monthly-report" element={<MonthlyReport />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="settings" element={<Settings />} />
            <Route path="documents" element={<DocumentLibrary />} />
            <Route path="documentation" element={<Documentation />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            borderRadius: '1.25rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)',
            padding: '1rem',
            fontSize: '11px',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '0.05em'
          }
        }}
      />
    </DbProvider>
  );
}