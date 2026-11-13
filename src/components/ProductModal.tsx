import React, { useEffect, useState } from 'react';
import { X, MessageCircle, Check, ShoppingBag, MapPin, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, STORE_INFO, createWhatsAppConsultLink, formatCOP } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : null);
      setSizeError(false);
      setJustAdded(false);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [product, onClose]);

  if (!product) return null;

  const isAvailable = product.available !== false;

  const primaryWhatsAppUrl = createWhatsAppConsultLink(product.name, {
    size: selectedSize,
    price: product.price,
  });

  const handleAddToCart = () => {
    if (!isAvailable) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, selectedSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#141414] rounded-2xl shadow-2xl border border-[#2B2B2B] overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-black/80 text-neutral-300 hover:text-white transition-colors border border-white/10 shadow-md"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Visual Area */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-[#0A0A0A] relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <div className="absolute top-4 left-4">
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-black/80 text-[#DFB15B] border border-[#C99845]/50 backdrop-blur-md">
                {product.tag}
              </span>
            </div>
          )}
        </div>

        {/* Modal Info Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-[#141414]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#DFB15B] mb-2">
              <span>{product.categoryLabel}</span>
              <span className="text-neutral-600">·</span>
              <span className={`font-medium lowercase ${isAvailable ? 'text-emerald-400' : 'text-red-400'}`}>
                {isAvailable ? 'disponible' : 'agotado'}
              </span>
            </div>

            <h2 className="font-display font-extrabold text-2xl text-white leading-tight mb-2">
              {product.name}
            </h2>

            <p className="font-display font-extrabold text-2xl text-[#DFB15B] mb-3 tabular-nums">
              {formatCOP(product.price)}
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-neutral-200">
                  Selecciona tu talla:
                </span>
                {sizeError && (
                  <span className="text-amber-400 font-semibold">
                    Elige una talla primero
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
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
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-[#DFB15B] text-black border-[#DFB15B] shadow-[0_0_12px_rgba(223,177,91,0.4)]'
                          : sizeError
                          ? 'bg-[#1B1B1B] text-neutral-200 border-amber-400/70'
                          : 'bg-[#1B1B1B] text-neutral-300 border-[#2C2C2C] hover:border-neutral-500 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Features list */}
            {product.features && product.features.length > 0 && (
              <div className="mb-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-200">
                  Detalles del producto:
                </p>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {product.features.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#DFB15B] font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Origin & Shipping badge */}
            <div className="p-3.5 bg-[#1B1B1B] rounded-xl border border-[#262626] mb-5 text-xs text-neutral-300 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DFB15B] shrink-0" />
                <span>Despacho directo desde <strong>Cúcuta</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#DFB15B] shrink-0" />
                <span>Envíos garantizados a toda <strong>Colombia</strong></span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#242424] space-y-2.5">
            <button
              type="button"
              disabled={!isAvailable}
              onClick={handleAddToCart}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all ${
                !isAvailable
                  ? 'bg-[#1D1D1D] text-neutral-500 border border-[#2A2A2A] cursor-not-allowed'
                  : justAdded
                  ? 'bg-[#25D366] text-black shadow-[0_0_20px_rgba(37,211,102,0.45)] active:scale-98'
                  : 'bg-[#DFB15B] hover:bg-[#e5be70] text-black shadow-[0_0_20px_rgba(201,152,69,0.35)] active:scale-98'
              }`}
            >
              {!isAvailable ? (
                <span>Producto agotado</span>
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>¡Añadido al carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir al carrito</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openCart();
                }}
                className="flex-1 text-center py-2 px-3 text-xs font-semibold text-white bg-[#202020] hover:bg-[#282828] border border-[#2E2E2E] rounded-lg transition-colors"
              >
                Ver carrito
              </button>

              <a
                href={primaryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-neutral-300 bg-[#202020] hover:bg-[#282828] border border-[#2E2E2E] rounded-lg transition-colors truncate"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp ({STORE_INFO.primaryWhatsAppRaw})</span>
              </a>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
