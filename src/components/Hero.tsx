import React from 'react';
import { ArrowRight, MessageCircle, Crown, MapPin, Truck, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { createWhatsAppConsultLink } from '../data/products';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative pt-5 pb-10 sm:pt-14 sm:pb-24 overflow-hidden bg-[#0B0B0B]">
      
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C99845]/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Desktop 2-column split / Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-center">
          
          {/* Text Content Column */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            
            {/* Pill chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#161616] border border-[#2E2E2E] text-neutral-300">
                <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
                <span>J STORE QUALITY · DROPS 2026</span>
              </span>

              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#161616] border border-[#2E2E2E] text-neutral-300">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
                <span>Cúcuta, Colombia</span>
              </span>

              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#161616] border border-[#2E2E2E] text-neutral-300">
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
                <span>Envíos directos</span>
              </span>
            </div>

            {/* Headline with glowing gold split accent */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] mb-3.5 sm:mb-6 text-balance">
              Gorras y ropa <span className="text-[#DFB15B] drop-shadow-[0_0_35px_rgba(201,152,69,0.35)]">para tu estilo.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-lg text-neutral-400 font-normal leading-relaxed mb-5 sm:mb-8 max-w-xl text-balance">
              Desde Cúcuta, con envíos a toda Colombia. Gorras exclusivas como nuestra especialidad principal, junto a camisas y jeans seleccionados con identidad propia para destacar.
            </p>

            {/* Action Buttons: Side-by-side on mobile too for compact elegance */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-10">
              
              {/* WhatsApp Glow Button */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={createWhatsAppConsultLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wide text-black bg-[#25D366] hover:bg-[#20ba5a] rounded-full shadow-[0_0_25px_rgba(37,211,102,0.45)] hover:shadow-[0_0_35px_rgba(37,211,102,0.65)] transition-all"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black" />
                <span>WhatsApp</span>
              </motion.a>

              {/* View Catalog Dark Glass Button */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#catalogo"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#141414] hover:bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#DFB15B]/70 rounded-full transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(201,152,69,0.2)]"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFB15B]" />
              </motion.a>

            </div>

            {/* Trust Markers: 3 compact columns on mobile and desktop */}
            <div className="pt-4 sm:pt-6 border-t border-[#1C1C1C] grid grid-cols-3 gap-2 sm:gap-4 text-[10px] sm:text-xs">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#DFB15B] flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">Envíos Nacionales</p>
                  <p className="text-neutral-500 hidden sm:block">Despacho desde Cúcuta</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#DFB15B] flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">Prendas 100% Reales</p>
                  <p className="text-neutral-500 hidden sm:block">Fotos directas de inventario</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#161616] border border-[#2B2B2B] text-[#DFB15B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">Atención Inmediata</p>
                  <p className="text-neutral-500 hidden sm:block">Asesoría directa por chat</p>
                </div>
              </div>

            </div>

          </motion.div>

          {/* Protagonist Visual Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Backlight halo behind image card */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#C99845]/25 via-transparent to-[#25D366]/15 -z-10 blur-md"></div>
              
              {/* Main Image Container */}
              <div className="relative aspect-[4/4.2] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#262626] bg-[#121212]">
                <img
                  src="/assets/aistudio/Conjunto_Calvin_Klein_en_madera_oscura_-_copia_e4b7fc01.png"
                  alt="Conjunto gorra, camisa y jean J Store Quality"
                  className="w-full h-full object-cover object-center hover:scale-103 transition-transform duration-700"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                
                {/* Contrast gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none"></div>

                {/* Floating Glass Pill Top Left */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 p-2 sm:p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 shadow-xl max-w-[165px] sm:max-w-[210px] animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#C99845]/20 border border-[#C99845]/40 flex items-center justify-center text-[#DFB15B] shrink-0">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#DFB15B]" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">Gorras Exclusivas</p>
                      <p className="text-[9px] sm:text-[11px] text-neutral-400 mt-0.5">Lotes seleccionados</p>
                    </div>
                  </div>
                </div>

                {/* Floating Glass Pill Bottom Right */}
                <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 p-2 sm:p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl max-w-[175px] sm:max-w-[220px]">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#25D366] text-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(37,211,102,0.6)]">
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 fill-black" />
                    </div>
                    <div>
                      <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">Atención Directa</p>
                      <p className="text-[9px] sm:text-[10px] text-emerald-400 font-medium mt-0.5">Respondemos al instante</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
