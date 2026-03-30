
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EquipmentDetail from './pages/EquipmentDetail';
import Inventory from './pages/Inventory';
import Sell from './pages/Sell';
import Rentals from './pages/Rentals';
import Maintenance from './pages/Maintenance';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Auctions from './pages/Auctions';
import Careers from './pages/Careers';
import About from './pages/About';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/maintenance" element={<Maintenance />} />

              {/* Category Landing Pages */}
              <Route path="/excavadoras" element={<Inventory initialCategory="Excavadoras" seoTitle="Venta de Excavadoras en Colombia | MIP" heroTitle="Excavadoras Disponibles" />} />
              <Route path="/gruas" element={<Inventory initialCategory="Grúa Telescópica" seoTitle="Venta de Grúas Telescópicas | MIP" heroTitle="Grúas Telescópicas" />} />
              <Route path="/cargadores" element={<Inventory initialCategory="Cargadores" seoTitle="Venta de Cargadores Frontales | MIP" heroTitle="Cargadores Disponibles" />} />
              <Route path="/volquetas" element={<Inventory initialCategory="Volquetas" seoTitle="Venta de Volquetas | MIP" heroTitle="Volquetas" />} />
              <Route path="/montacargas" element={<Inventory initialCategory="Montacargas" seoTitle="Venta de Montacargas | MIP" heroTitle="Montacargas" />} />
              <Route path="/vibrocompactadores" element={<Inventory initialCategory="Vibro compactador" seoTitle="Venta de Vibrocompactadores | MIP" heroTitle="Vibrocompactadores" />} />

              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
