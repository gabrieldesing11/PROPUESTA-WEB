import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, formatCOP, createWhatsAppConsultLink } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

const WhatsAppLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.391c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.016-1.297-4.984-4.328-5.141-4.531-.156-.203-1.234-1.641-1.234-3.125s.781-2.219 1.063-2.516c.281-.297.609-.375.813-.375.203 0 .406 0 .578.016.188.016.438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.156.141-.313.297-.141.594.172.297.781 1.281 1.672 2.078 1.156 1.016 2.125 1.344 2.422 1.484.297.141.469.125.641-.078.172-.203.75-.875.953-1.172.203-.297.406-.25.672-.156.266.094 1.719.813 2.016.953.297.141.5.219.563.344.078.125.078.719-.172 1.422z" />
  </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isAvailable = product.available !== false;

  useEffect(() => {
    if (selectedSize && !product.sizes.includes(selectedSize)) {
      setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : null);
    } else if (!selectedSize && product.sizes.length === 1) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product.sizes, selectedSize]);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const whatsappProductUrl = createWhatsAppConsultLink(product.name, {
    size: selectedSize,
    price: product.price,
  });

  return (
    <motion.article 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group bg-[#141414] rounded-xl border border-[#242424] hover:border-[#C99845]/60 transition-all duration-300 shadow-md hover:shadow-[0_0_25px_rgba(201,152,69,0.15)] flex flex-col h-full overflow-hidden"
    >
      
      {/* Product Image Area with Uniform Aspect Ratio */}
      <div 
        onClick={() => onOpenQuickView(product)}
        className="relative aspect-[4/3] bg-[#0E0E0E] overflow-hidden cursor-pointer"
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ${
              isAvailable ? 'opacity-95 group-hover:opacity-100' : 'opacity-50 grayscale-[35%]'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-[#121212] to-[#1A1A1A] text-neutral-500">
            <span className="font-display font-bold text-base sm:text-xl text-neutral-600 mb-1">J STORE</span>
            <span className="text-[10px] sm:text-xs text-neutral-400 text-center">{product.name}</span>
          </div>
        )}

        {/* Out of Stock Overlay Badge */}
        {!isAvailable && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none">
            <span className="inline-block text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-red-950/90 text-red-300 border border-red-500/40 backdrop-blur-md shadow-sm">
              Agotado
            </span>
          </div>
        )}

        {/* Floating Tag / Badge */}
        {product.tag && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 pointer-events-none">
            <span className="inline-block text-[8px] sm:text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/80 text-[#DFB15B] border border-[#C99845]/40 backdrop-blur-md shadow-sm">
              {product.tag}
            </span>
          </div>
        )}

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center p-4 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold border border-white/20 backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#DFB15B]" />
            <span>Ver detalles</span>
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3.5">
        
        <div>
          {/* Category & Status */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-semibold uppercase tracking-wider mb-1 sm:mb-1.5">
            <span className="text-[#DFB15B]">{product.categoryLabel}</span>
            {!isAvailable ? (
              <span className="text-red-400 font-semibold lowercase">agotado</span>
            ) : (
              <span className="text-emerald-400 font-medium lowercase">disponible</span>
            )}
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onOpenQuickView(product)}
            className="font-display font-bold text-xs sm:text-lg text-white leading-snug cursor-pointer group-hover:text-[#DFB15B] transition-colors line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Price */}
          <p className="font-display font-extrabold text-sm sm:text-lg text-[#DFB15B] mt-1 sm:mt-1.5 tabular-nums">
            {formatCOP(product.price)}
          </p>

          {/* Description snippet (hidden on ultra-compact mobile 2-col view for clean breathing room) */}
          <p className="hidden sm:line-clamp-2 text-xs text-neutral-400 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selection & Action Row (Add to Cart + Circular WhatsApp) */}
        <div className="pt-2 sm:pt-3 border-t border-[#222222] flex flex-col gap-2 sm:gap-3">
          
          {/* Interactive Size Selector */}
          <div>
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1 sm:mb-1.5">
              <span className="font-semibold text-neutral-300">
                Talla:
              </span>
              {sizeError && (
                <span className="text-amber-400 font-semibold animate-pulse text-[9px] sm:text-[11px]">
                  Elige talla
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#DFB15B] text-black border-[#DFB15B] shadow-[0_0_10px_rgba(223,177,91,0.35)]'
                        : sizeError
                        ? 'bg-[#1A1A1A] text-neutral-200 border-amber-400/60 hover:border-[#DFB15B]'
                        : 'bg-[#1B1B1B] text-neutral-300 border-[#2B2B2B] hover:border-neutral-500 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart + Circular WhatsApp Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`flex-1 min-w-0 h-8 sm:h-10 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 text-[10px] sm:text-xs font-bold tracking-tight sm:tracking-normal rounded-lg transition-all ${
                !isAvailable
                  ? 'bg-[#1D1D1D] text-neutral-500 border border-[#2A2A2A] cursor-not-allowed'
                  : justAdded
                  ? 'bg-[#25D366] text-black shadow-[0_0_18px_rgba(37,211,102,0.5)] active:scale-98'
                  : 'bg-[#DFB15B] hover:bg-[#e5be70] text-black shadow-[0_0_15px_rgba(201,152,69,0.3)] hover:shadow-[0_0_22px_rgba(201,152,69,0.5)] active:scale-98'
              }`}
              aria-label={isAvailable ? `Añadir ${product.name} al carrito` : `${product.name} agotado`}
            >
              {!isAvailable ? (
                <span className="truncate">Agotado</span>
              ) : justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">¡Añadido!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">Añadir al carrito</span>
                </>
              )}
            </button>

            <a
              href={whatsappProductUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={
                isAvailable
                  ? `Solicitar ${product.name} por WhatsApp`
                  : `Consultar reposición de ${product.name} por WhatsApp`
              }
              aria-label={`Solicitar ${product.name} por WhatsApp`}
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black inline-flex items-center justify-center shadow-[0_0_14px_rgba(37,211,102,0.4)] hover:shadow-[0_0_20px_rgba(37,211,102,0.65)] transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppLogoIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>

      </div>

    </motion.article>
  );
};
