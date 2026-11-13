import React from 'react';
import { STORE_INFO, createWhatsAppConsultLink } from '../data/products';
import { MessageCircle, MapPin, Truck, ExternalLink, ArrowUp, Crown } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070707] text-[#FAF9F6] border-t border-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-9 sm:py-16">
        
        <div className="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b border-[#1A1A1A]">
          
          {/* Brand Column (full width on mobile, 5 cols on desktop) */}
          <div className="col-span-2 md:col-span-5 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#DFB15B]/55 bg-[#0A0A0A] p-1 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(223,177,91,0.35)]">
                <img
                  src={STORE_INFO.logoUrl}
                  alt="J Store Quality Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_6px_rgba(223,177,91,0.45)]"
                />
              </div>
              <div>
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-[#FAF9F6] glow-text-gold block">
                  J STORE QUALITY
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#DFB15B] uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#DFB15B]" />
                  Estilo · Calidad · Cúcuta
                </span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed max-w-sm">
              Tienda especializada en gorras exclusivas, camisas y jeans seleccionados para elevar tu estilo personal. Ubicados en Cúcuta con envíos seguros a toda Colombia.
            </p>

            <div className="pt-1 flex flex-col gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                <span>{STORE_INFO.address}</span>
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                <span>{STORE_INFO.shippingText}</span>
              </span>
            </div>
          </div>

          {/* Quick Links (1 col on mobile, 3 cols on desktop) */}
          <div className="col-span-1 md:col-span-3 space-y-2.5 sm:space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-[#DFB15B]">
              Navegación
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-neutral-400">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">
                  Ubicación y Contacto
                </a>
              </li>
              <li>
                <a href="#comunidad" className="hover:text-white transition-colors">
                  Comunidad en Redes
                </a>
              </li>
              <li>
                <a
                  href={STORE_INFO.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#DFB15B] transition-colors"
                >
                  <span>TikTok</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
              <li>
                <a
                  href={STORE_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[#E1306C] transition-colors"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Contacts (1 col on mobile, 4 cols on desktop) */}
          <div className="col-span-1 md:col-span-4 space-y-2.5 sm:space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-[#DFB15B]">
              Atención Inmediata
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-400">
              Horario: {STORE_INFO.schedule}
            </p>
            <div className="space-y-2.5 pt-1">
              <a
                href={createWhatsAppConsultLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#242424] hover:border-[#25D366]/60 text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5 text-neutral-200">
                  <div className="w-7 h-7 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                  </div>
                  <span className="font-medium tabular-nums">{STORE_INFO.primaryWhatsAppDisplay}</span>
                </div>
                <span className="text-[11px] text-[#25D366] font-bold group-hover:underline">Chatear</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} J Store Quality · Cúcuta, Colombia. Todos los derechos reservados.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#DFB15B] transition-colors"
          >
            <span>Subir al inicio</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
