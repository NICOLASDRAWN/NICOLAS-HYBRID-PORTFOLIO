import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { name: 'Comprar', path: '/inventory' },
    { name: 'Alquiler', path: '/rentals' },
    { name: 'Vender', path: '/sell' },
    { name: 'Serv. Técnico', path: '/maintenance' },
    { name: 'Subastas', path: '/auctions' },
    { name: 'Nosotros', path: '/nosotros' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-white text-xs py-2 px-4 text-center">
        <span className="opacity-80">Próxima gran subasta en Ocaña: 24 de Noviembre. </span>
        <a href="#" className="underline font-semibold ml-1">Regístrate ahora</a>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/assets/logo-official.png" alt="MIP Internacional Logo" className="h-16 w-auto py-1" />
              </Link>

              <div className="hidden md:ml-10 md:flex md:space-x-4 lg:space-x-6">
                <Link to="/inventory" className="text-slate-600 hover:text-emerald-600 px-2 py-2 text-sm font-medium transition-colors">Comprar</Link>
                <Link to="/rentals" className="text-slate-600 hover:text-emerald-600 px-2 py-2 text-sm font-medium transition-colors">Alquiler</Link>
                <Link to="/maintenance" className="text-slate-600 hover:text-emerald-600 px-2 py-2 text-sm font-medium transition-colors">Serv. Técnico</Link>
                <Link to="/auctions" className="text-slate-600 hover:text-emerald-600 px-2 py-2 text-sm font-medium transition-colors">Subastas</Link>
                <Link to="/nosotros" className="text-slate-600 hover:text-emerald-600 px-2 py-2 text-sm font-medium transition-colors">Nosotros</Link>
              </div>
            </div>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-slate-600 hover:text-emerald-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <span className="text-2xl">✕</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center h-20 px-4 border-b">
                <img src="/assets/logo-official.png" alt="Logo" className="h-12 w-auto" />
                <button onClick={toggleMenu} className="text-3xl p-2 text-slate-800">✕</button>
              </div>
              <div className="flex-grow overflow-y-auto py-8 px-4 flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl font-black py-4 border-b border-slate-50 ${location.pathname === link.path ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <img src="/assets/logo-official.png" alt="MIP Internacional Logo" className="h-14 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm text-slate-400">
                Somos una empresa colombo-china especializada en infraestructura, maquinaria pesada y logística industrial. Actuamos como socio estratégico desde la planeación hasta la ejecución.
              </p>
              <p className="text-xs text-emerald-500 font-bold">NIT: 901.165.028-2</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Comprar</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/inventory" className="hover:text-emerald-400 transition-colors">Buscador de equipos</Link></li>
                <li><Link to="/maintenance" className="hover:text-emerald-400 transition-colors">Mantenimiento</Link></li>
                <li><Link to="/blog" className="hover:text-emerald-400 transition-colors">Noticias</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Financiación</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Vender</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/sell" className="hover:text-emerald-400 transition-colors">Vende tus equipos</Link></li>
                <li><Link to="/projects" className="hover:text-emerald-400 transition-colors">Casos de éxito</Link></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Soluciones de gestión</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start space-x-2">
                  <span>📍</span>
                  <span>Cra. 20b #77-5, Bogotá</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📧</span>
                  <a href="mailto:comunicaciones@mipgroup.com.co" className="hover:text-emerald-400 text-xs">comunicaciones@mipgroup.com.co</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>320 4080 950</span>
                </li>
                <li className="flex items-center space-x-2 pt-2">
                  <span className="text-emerald-400">🌐</span>
                  <a href="http://www.mipgroup.com.co" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">www.mipgroup.com.co</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>© 2026 MIP INTERNACIONAL TRADING SAS. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacidad</a>
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default Layout;
