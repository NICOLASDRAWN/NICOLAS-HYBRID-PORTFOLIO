import { Helmet } from 'react-helmet-async';

interface InventoryProps {
  initialCategory?: string;
  seoTitle?: string;
  seoDesc?: string;
  heroTitle?: string;
  heroDesc?: string;
}

const Inventory: React.FC<InventoryProps> = ({
  initialCategory,
  seoTitle = "Inventario Maquinaria Pesada | MIP Internacional",
  seoDesc = "Explore nuestro inventario de excavadoras, grúas, cargadores y más. Equipos disponibles para venta y alquiler en Bogotá, Colombia.",
  heroTitle = "Inventario de Equipos",
  heroDesc
}) => {
  // ... existing code ...

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{heroTitle}</h1>
          <p className="text-sm sm:text-base text-slate-500">{heroDesc || `Explora ${filteredEquipment.length} resultados disponibles para subasta`}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            <span>☰</span> Filtros
          </button>
          <select
            className="flex-1 md:flex-none bg-white border border-slate-200 rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Más recientes</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6 sm:space-y-8`}>
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                <span className="mr-2">🔍</span> Búsqueda rápida
              </h3>
              <input
                type="text"
                placeholder="Marca o modelo..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Categoría</h3>
              <div className="space-y-1 sm:space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Todas las categorías
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.name ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span className="mr-2">{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-slate-100">
              <button
                onClick={() => { setSelectedCategory(null); setSearchTerm(''); setShowFilters(false); }}
                className="w-full text-xs text-center text-slate-400 hover:text-emerald-600 font-medium"
              >
                Limpiar todos los filtros
              </button>
            </div>
          </div>

          <div className="hidden lg:block bg-emerald-900 rounded-xl p-6 text-white text-center space-y-4">
            <h4 className="font-bold">¿Necesitas ayuda?</h4>
            <p className="text-sm opacity-80">Nuestros expertos están listos para asesorarte en tu compra.</p>
            <button className="w-full bg-emerald-600 py-2 rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors">
              Contactar Asesor
            </button>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {filteredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEquipment.map(item => (
                <Link
                  key={item.id}
                  to={`/equipment/${item.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all group flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-800">
                      {item.year}
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="mb-auto">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{item.brand}</p>
                      <h3 className="font-bold text-slate-900 leading-tight mb-2">{item.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center">
                        <span className="mr-1">📍</span> {item.location}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const phone = '573204080950';
                          const message = encodeURIComponent(`Hola, estoy interesado en cotizar el equipo: ${item.name}`);
                          import('../utils/analytics').then(({ trackConversion }) => trackConversion('whatsapp_click'));
                          window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        Solicitar Cotización 💬
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-4">🚜</div>
              <h3 className="text-xl font-bold text-slate-900">No se encontraron equipos</h3>
              <p className="text-slate-500">Prueba ajustando los filtros o realizando otra búsqueda.</p>
              <button
                onClick={() => { setSelectedCategory(null); setSearchTerm(''); }}
                className="mt-6 text-emerald-600 font-bold underline"
              >
                Ver todo el inventario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
