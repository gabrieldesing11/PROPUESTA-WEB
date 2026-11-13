import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  User,
  MapPin,
  Navigation,
  CreditCard,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { COLOMBIAN_CITIES, formatCOP, PAYMENT_METHODS, STORE_INFO } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    totalItems,
    totalAmount,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [customCity, setCustomCity] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, closeCart]);

  const isOtherCity = selectedCity === 'Otra ciudad / municipio de Colombia';

  const handleCheckoutWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    if (!customerName.trim()) {
      setFormError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!selectedCity) {
      setFormError('Por favor selecciona tu ciudad de destino en Colombia.');
      return;
    }
    if (isOtherCity && !customCity.trim()) {
      setFormError('Por favor escribe el nombre de tu ciudad o municipio.');
      return;
    }
    if (!paymentMethod) {
      setFormError('Por favor selecciona un método de pago.');
      return;
    }

    setFormError(null);

    const finalCity = isOtherCity ? customCity.trim() : selectedCity;

    const productLines = items
      .map((item) => {
        const lineSubtotal = item.product.price * item.quantity;
        return `• ${item.quantity}x ${item.product.name} (Talla: ${item.size}) — ${formatCOP(lineSubtotal)}`;
      })
      .join('\n');

    const message = [
      `*NUEVO PEDIDO — ${STORE_INFO.name.toUpperCase()}*`,
      '',
      '*Productos seleccionados:*',
      productLines,
      '',
      `*Subtotal de productos:* ${formatCOP(totalAmount)}`,
      '',
      '*Datos de envío y pago:*',
      `• Nombre: ${customerName.trim()}`,
      `• Ciudad: ${finalCity}`,
      ...(shippingAddress.trim() ? [`• Dirección exacta: ${shippingAddress.trim()}`] : []),
      `• Método de pago: ${paymentMethod}`,
      '',
      'Hola, J Store Quality. Me gustaría realizar este pedido. Quedo atento a la confirmación de disponibilidad, costo de envío y datos para realizar el pago. ¡Gracias!',
    ].join('\n');

    const url = `https://wa.me/${STORE_INFO.primaryWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Slide-over Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#111111] border-l border-[#242424] h-full flex flex-col shadow-2xl z-10"
            aria-label="Carrito de compras"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#222222] flex items-center justify-between bg-[#0B0B0B]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#DFB15B]" />
                <h2 className="font-display font-bold text-lg text-white">
                  Tu Carrito
                </h2>
                <span className="text-xs font-semibold text-neutral-400 tabular-nums">
                  ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
                </span>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1B1B1B] transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-neutral-500 mb-4">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-6 leading-relaxed">
                  Explora nuestro catálogo de gorras, camisas y jeans, elige tu talla favorita y añade productos para calcular el total de tu pedido.
                </p>
                <a
                  href="#catalogo"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#DFB15B] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#e5bd71] transition-colors"
                >
                  <span>Ir al catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleCheckoutWhatsApp}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Scrollable list + survey */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                  
                  {/* Items list */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-neutral-300">
                        Productos seleccionados
                      </span>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-[11px] text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        Vaciar carrito
                      </button>
                    </div>

                    {items.map((item) => {
                      const subtotal = item.product.price * item.quantity;
                      return (
                        <div
                          key={`${item.product.id}-${item.size}`}
                          className="p-3 rounded-xl bg-[#181818] border border-[#262626] flex gap-3"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover bg-black shrink-0 border border-[#2B2B2B]"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h4 className="font-display font-bold text-sm text-white truncate">
                                  {item.product.name}
                                </h4>
                                <p className="text-[11px] text-neutral-400 mt-0.5">
                                  Talla: <strong className="text-[#DFB15B]">{item.size}</strong> · {formatCOP(item.product.price)}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(item.product.id, item.size)}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                                aria-label={`Eliminar ${item.product.name}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="inline-flex items-center bg-[#101010] border border-[#2C2C2C] rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.size, -1)}
                                  className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                                  aria-label="Disminuir cantidad"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2.5 text-xs font-bold text-white tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.product.id, item.size, 1)}
                                  className="p-1.5 text-neutral-300 hover:text-white transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="font-display font-bold text-sm text-white tabular-nums">
                                {formatCOP(subtotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Survey (Encuesta de envío y pago) */}
                  <div className="pt-4 border-t border-[#222222] space-y-3.5">
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">
                        Datos para tu pedido
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Completa esta información para enviarla directamente por WhatsApp.
                      </p>
                    </div>

                    {/* Nombre */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        <User className="w-3.5 h-3.5 text-[#DFB15B]" />
                        <span>Nombre completo *</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="Ej. Laura Gómez"
                        className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2C2C2C] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B] transition-colors"
                      />
                    </div>

                    {/* Ciudad de Colombia (Select) */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#DFB15B]" />
                        <span>Ciudad de destino (Colombia) *</span>
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2C2C2C] rounded-xl text-sm text-white focus:outline-none focus:border-[#DFB15B] transition-colors"
                      >
                        <option value="" disabled className="text-neutral-500">
                          Selecciona tu ciudad...
                        </option>
                        {COLOMBIAN_CITIES.map((city) => (
                          <option key={city} value={city} className="bg-[#141414] text-white">
                            {city}
                          </option>
                        ))}
                      </select>

                      {isOtherCity && (
                        <input
                          type="text"
                          value={customCity}
                          onChange={(e) => {
                            setCustomCity(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="Escribe tu ciudad o municipio y departamento"
                          className="mt-2 w-full px-3.5 py-2.5 bg-[#181818] border border-[#2C2C2C] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B] transition-colors"
                        />
                      )}
                    </div>

                    {/* Dirección exacta (Opcional) */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#DFB15B]" />
                        <span>
                          Dirección exacta{' '}
                          <span className="text-neutral-500 font-normal normal-case">(opcional)</span>
                        </span>
                      </label>
                      <textarea
                        rows={2}
                        value={shippingAddress}
                        onChange={(e) => {
                          setShippingAddress(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="Opcional: Calle, barrio, conjunto o referencia"
                        className="w-full px-3.5 py-2.5 bg-[#181818] border border-[#2C2C2C] rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B] transition-colors resize-none"
                      />
                    </div>

                    {/* Método de pago */}
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#DFB15B]" />
                        <span>Método de pago *</span>
                      </label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {PAYMENT_METHODS.map((method) => {
                          const selected = paymentMethod === method;
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                                selected
                                  ? 'bg-[#DFB15B]/15 border-[#DFB15B] text-white'
                                  : 'bg-[#181818] border-[#262626] text-neutral-400 hover:text-neutral-200 hover:border-neutral-600'
                              }`}
                            >
                              <span>{method}</span>
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  selected ? 'border-[#DFB15B]' : 'border-neutral-600'
                                }`}
                              >
                                {selected && (
                                  <span className="w-2 h-2 rounded-full bg-[#DFB15B]" />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {formError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Total & WhatsApp Checkout CTA */}
                <div className="p-5 border-t border-[#222222] bg-[#0B0B0B] space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>Cantidad de artículos:</span>
                      <span className="tabular-nums font-medium text-neutral-200">
                        {totalItems}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-display font-bold text-base text-white">
                        Sumatoria total:
                      </span>
                      <span className="font-display font-extrabold text-xl text-[#DFB15B] tabular-nums">
                        {formatCOP(totalAmount)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-sm tracking-wide shadow-[0_0_22px_rgba(37,211,102,0.45)] hover:shadow-[0_0_30px_rgba(37,211,102,0.65)] transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4 fill-black text-black" />
                    <span>Enviar pedido a WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
