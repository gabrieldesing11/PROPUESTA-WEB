import React, { useState, useMemo } from 'react';
import { Search, X, MessageCircle, AlertCircle, Sparkles, Crown } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Product, CATEGORIES, CategoryFilter, createWhatsAppConsultLink } from '../data/products';
import { useCatalog } from '../context/CatalogContext';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';

const CATEGORY_SECTIONS: Array<{
  id: 'gorras' | 'camisas' | 'jeans';
  title: string;
  subtitle: string;
  featured?: boolean;
}> = [
  {
    id: 'gorras',
    title: 'Gorras',
    subtitle: 'Nuestra línea principal · Hormas exclusivas y edición limitada',
    featured: true,
  },
  {
    id: 'camisas',
    title: 'Camisas',
    subtitle: 'Algodón pesado, slim fit y diseños urbanos seleccionados',
  },
  {
    id: 'jeans',
    title: 'Jeans',
    subtitle: 'Denim con ajuste contemporáneo y acabados de alta durabilidad',
  },
];

export const Catalog: React.FC = () => {
  const { products } = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const activeSelectedProduct = useMemo(() => {
    if (!selectedProduct) return null;
    return products.find((p) => p.id === selectedProduct.id) ?? null;
  }, [products, selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tag && product.tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const showGroupedSections = selectedCategory === 'all' && !searchQuery.trim();

  return (
    <section id="catalogo" className="py-10 sm:py-24 bg-[#0B0B0B] border-t border-[#1C1C1C] relative">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#DFB15B]">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
              <span>Catálogo Disponible</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Explora nuestra colección
            </h2>
            <p className="text-xs sm:text-base text-neutral-400 mt-1.5 sm:mt-2 max-w-xl">
              Descubre nuestras gorras como producto principal, seguidas de camisas y jeans. Elige tu talla y añádelos al carrito para finalizar tu pedido por WhatsApp.
            </p>
          </div>

          {/* Quick Notice Card */}
          <div className="hidden sm:block p-3.5 bg-[#141414] rounded-xl border border-[#262626] max-w-sm text-xs text-neutral-400 shadow-lg">
            <p className="font-bold text-white flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              Compra fácil por carrito
            </p>
            <p className="text-neutral-400 mt-1">
              Elige tus tallas, selecciona tu ciudad en el carrito y envía tu orden completa a nuestro WhatsApp.
            </p>
          </div>
        </div>

        {/* Filter Toolbar: Categories & Search */}
        <div className="mb-6 sm:mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Functional Category Filter Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#DFB15B] text-black shadow-[0_0_20px_rgba(201,152,69,0.4)] scale-102'
                      : 'bg-[#141414] text-neutral-300 border border-[#262626] hover:border-neutral-500 hover:text-white'
                  }`}
                  aria-pressed={isActive}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Bar Input */}
          <div className="relative min-w-[200px] sm:min-w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar gorra, camisa, jean..."
              className="w-full pl-9 sm:pl-10 pr-9 py-2 sm:py-2.5 bg-[#141414] border border-[#262626] rounded-full text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B]/30 shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Results Counter and Active Filter Feedback */}
        <div className="flex items-center justify-between mb-5 sm:mb-8 text-[11px] sm:text-xs text-neutral-400 border-b border-[#1C1C1C] pb-2.5 sm:pb-3">
          <span>
            Mostrando <strong className="text-white">{filteredProducts.length}</strong> de <strong className="text-white">{products.length}</strong> productos
          </span>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-[#DFB15B] font-semibold hover:underline"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* Product Listing: Always 2 columns on mobile (grid-cols-2), 3 on lg, 4 on xl */}
        {filteredProducts.length > 0 ? (
          showGroupedSections ? (
            <div className="space-y-9 sm:space-y-14">
              {CATEGORY_SECTIONS.map((section) => {
                const sectionProducts = products.filter(
                  (p) => p.category === section.id
                );
                if (sectionProducts.length === 0) return null;

                return (
                  <div key={section.id} className="space-y-3.5 sm:space-y-5">
                    <div className="flex items-end justify-between gap-2 pb-2 sm:pb-3 border-b border-[#1D1D1D]">
                      <div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {section.featured && (
                            <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB15B]" />
                          )}
                          <h3 className="font-display font-extrabold text-lg sm:text-2xl text-white tracking-tight">
                            {section.title}
                          </h3>
                          {section.featured && (
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/30">
                              Principal
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-sm text-neutral-400 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">
                          {section.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedCategory(section.id)}
                        className="text-[11px] sm:text-xs font-semibold text-[#DFB15B] hover:text-white transition-colors shrink-0 whitespace-nowrap"
                      >
                        Ver {section.title.toLowerCase()} ({sectionProducts.length}) →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
                      {sectionProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onOpenQuickView={setSelectedProduct}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={setSelectedProduct}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16 px-4 bg-[#141414] rounded-2xl border border-[#242424]">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1">
              No se encontraron productos
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6">
              No encontramos coincidencias para "{searchQuery}". Intenta con otro término o consulta disponibilidad especial por WhatsApp.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-semibold bg-[#222222] text-white rounded-full hover:bg-[#2B2B2B] transition-colors"
              >
                Ver todo el catálogo
              </button>
              <a
                href={createWhatsAppConsultLink(`Consulta personalizada: ${searchQuery}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-black bg-[#25D366] rounded-full shadow-[0_0_15px_rgba(37,211,102,0.4)]"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-black text-black" />
                <span>Preguntar en WhatsApp</span>
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {activeSelectedProduct && (
          <ProductModal
            product={activeSelectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
