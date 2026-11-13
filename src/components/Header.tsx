import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, MapPin, Truck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_INFO, createWhatsAppConsultLink } from '../data/products';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'catalogo', label: 'Catálogo', href: '#catalogo' },
  { id: 'comunidad', label: 'Comunidad', href: '#comunidad' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
] as const;

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    let rafId: number | null = null;

    const updateActiveSection = () => {
      rafId = null;

      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 40) {
        setActiveSection('contacto');
        return;
      }

      const triggerOffset = Math.min(window.innerHeight * 0.35, 220);
      let current = NAV_LINKS[0].id as string;

      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerOffset) {
          current = link.id;
        }
      }

      setActiveSection(current);
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <>
      {/* Top micro-announcement bar */}
      <div className="bg-[#050505] text-[#FAF9F6] text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-0.5 sm:gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center text-[#DFB15B] font-medium">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-[#DFB15B]" />
              {STORE_INFO.shippingText}
            </span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="hidden sm:inline-flex items-center text-neutral-400">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#C99845]" />
              Cúcuta, Norte de Santander
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-neutral-400">
            <span className="hidden sm:inline">Atención directa WhatsApp:</span>
            <span className="sm:hidden">WhatsApp:</span>
            <a 
              href={createWhatsAppConsultLink()}
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#DFB15B] hover:text-white font-medium tabular-nums transition-colors"
            >
              {STORE_INFO.primaryWhatsAppDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main sticky navigation */}
      <header className="sticky top-0 z-40 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#1F1F1F] transition-all">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand lockup with subtle golden glow */}
          <a 
            href="#inicio" 
            className="flex items-center gap-2.5 sm:gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C99845] rounded-lg p-0.5 sm:p-1"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#DFB15B]/55 bg-[#0A0A0A] p-1 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(223,177,91,0.38)] group-hover:border-[#DFB15B] group-hover:shadow-[0_0_28px_rgba(223,177,91,0.58)] transition-all">
              <img 
                src={STORE_INFO.logoUrl}
                alt="J Store Quality Logo" 
                className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(223,177,91,0.45)]"
                loading="eager"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-2xl tracking-tight text-[#FAF9F6] glow-text-gold leading-none group-hover:text-[#DFB15B] transition-all">
                J STORE QUALITY
              </span>
              <span className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest text-[#C99845] mt-0.5 sm:mt-1">
                Cúcuta, Colombia
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`relative py-1 hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                    isActive ? 'text-white font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="header-active-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C99845] rounded-full shadow-[0_0_8px_rgba(201,152,69,0.8)]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Minimalist Cart Button */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={openCart}
              aria-label={`Abrir carrito de compras (${totalItems} productos)`}
              className="relative inline-flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold tracking-wider text-white bg-[#141414] hover:bg-[#1B1B1B] border border-[#2A2A2A] hover:border-[#DFB15B]/60 rounded-full transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFB15B]" />
              <span className="uppercase">Carrito</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#DFB15B] text-black text-[11px] font-extrabold tabular-nums">
                {totalItems}
              </span>
            </motion.button>
          </div>

          {/* Mobile minimalist cart button & menu button */}
          <div className="flex items-center gap-2.5 md:hidden">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Abrir carrito (${totalItems} productos)`}
              className="relative p-2.5 text-white bg-[#141414] border border-[#2A2A2A] hover:border-[#DFB15B]/60 rounded-full active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5 text-[#DFB15B]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DFB15B] text-black text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-neutral-300 bg-[#141414] border border-[#262626] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C99845]"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0F0F0F] border-b border-[#242424] px-4 pt-3 pb-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#1A1A1A] text-[#DFB15B] border border-[#C99845]/30'
                        : 'text-neutral-200 hover:bg-[#1A1A1A] hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#DFB15B]' : 'text-neutral-500'}`} />
                  </a>
                );
              })}
              
              <div className="mt-3 pt-4 border-t border-[#222222] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#181818] text-white border border-[#DFB15B]/50 rounded-xl font-bold text-sm active:scale-98 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#DFB15B]" />
                  <span>Ver Carrito ({totalItems})</span>
                </button>

                <div className="text-xs text-neutral-400 text-center space-y-1">
                  <p className="text-neutral-300">📍 {STORE_INFO.address}</p>
                  <p className="text-[#C99845]">🚚 {STORE_INFO.shippingText}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
};
