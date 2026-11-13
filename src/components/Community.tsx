import React from 'react';
import { ExternalLink, Users, Heart, Video, Camera, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_INFO, createWhatsAppConsultLink } from '../data/products';

export const Community: React.FC = () => {
  return (
    <section id="comunidad" className="py-10 sm:py-24 bg-[#0B0B0B] border-t border-[#1C1C1C] relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#DFB15B]/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#DFB15B]">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
            <span>Comunidad Oficial</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Únete a nuestra <span className="text-[#DFB15B] drop-shadow-[0_0_25px_rgba(201,152,69,0.3)]">comunidad</span>
          </h2>
          <p className="text-xs sm:text-base text-neutral-400 mt-1.5 sm:mt-2">
            Sigue nuestros drops en tiempo real, unboxings de gorras exclusivas y entregas en Cúcuta y toda Colombia.
          </p>
        </div>

        {/* Two Social Network Cards side-by-side on mobile AND desktop */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-8 mb-6 sm:mb-12">
          
          {/* TikTok Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative bg-[#141414] rounded-xl sm:rounded-2xl border border-[#242424] hover:border-neutral-700 p-3 sm:p-8 flex flex-col justify-between shadow-xl overflow-hidden"
          >
            {/* Subtle glow accent on hover */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#25F4EE]/10 rounded-full blur-2xl group-hover:bg-[#25F4EE]/20 transition-all"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#FE2C55]/10 rounded-full blur-2xl group-hover:bg-[#FE2C55]/20 transition-all"></div>

            <div>
              {/* Card Header */}
              <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-black border border-[#2B2B2B] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 6.27 6.32 6.34 6.34 0 0 0 6.33-6.32V8.67a8.4 8.4 0 0 0 4.99 1.6V6.82a4.91 4.91 0 0 1-1-.13z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-xl text-white flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
                      <span>TikTok</span>
                      <span className="text-[10px] sm:text-xs font-normal text-neutral-400 font-mono truncate">
                        {STORE_INFO.tiktokUser}
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#25F4EE] font-semibold mt-0.5">
                      Videos & Unboxings
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#1F1F1F] text-neutral-300 border border-[#2E2E2E] shrink-0">
                  En vivo
                </span>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 bg-[#1A1A1A] rounded-lg sm:rounded-xl border border-[#262626]">
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs text-neutral-400 mb-0.5">
                    <Users className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#DFB15B] shrink-0" />
                    <span className="truncate">Seguidores</span>
                  </div>
                  <p className="font-display font-extrabold text-xs sm:text-lg text-white tabular-nums">
                    {STORE_INFO.tiktokFollowers}
                  </p>
                </div>

                <div className="p-2 sm:p-3 bg-[#1A1A1A] rounded-lg sm:rounded-xl border border-[#262626]">
                  <div className="flex items-center gap-1 text-[9px] sm:text-xs text-neutral-400 mb-0.5">
                    <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#FE2C55] shrink-0" />
                    <span className="truncate">Me gusta</span>
                  </div>
                  <p className="font-display font-extrabold text-xs sm:text-lg text-white tabular-nums">
                    {STORE_INFO.tiktokLikes}
                  </p>
                </div>
              </div>

              {/* Content description */}
              <p className="text-[11px] sm:text-sm text-neutral-300 leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                Compartimos pruebas de horma, cómo lucen las gorras puestas, el empaque de pedidos a toda Colombia y nuevos drops.
              </p>

              <div className="hidden sm:block space-y-2 mb-6 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                  <span>Unboxing de drops exclusivos y colecciones limitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                  <span>Tips para cuidar la horma de tus gorras</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2.5 sm:pt-4 border-t border-[#222222]">
              <a
                href={STORE_INFO.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2.5 sm:px-5 rounded-lg sm:rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-[11px] sm:text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-98"
              >
                <span className="truncate">Seguir en TikTok</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black shrink-0" />
              </a>
            </div>
          </motion.div>

          {/* Instagram Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group relative bg-[#141414] rounded-xl sm:rounded-2xl border border-[#242424] hover:border-neutral-700 p-3 sm:p-8 flex flex-col justify-between shadow-xl overflow-hidden"
          >
            {/* Subtle glow accent on hover */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#E1306C]/10 rounded-full blur-2xl group-hover:bg-[#E1306C]/20 transition-all"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#F56040]/10 rounded-full blur-2xl group-hover:bg-[#F56040]/20 transition-all"></div>

            <div>
              {/* Card Header */}
              <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3.5">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#F56040] via-[#E1306C] to-[#833AB4] p-[1px] shadow-md group-hover:scale-105 transition-transform shrink-0">
                    <div className="w-full h-full bg-black rounded-[11px] sm:rounded-[15px] flex items-center justify-center text-white">
                      <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-[#E1306C]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-xl text-white flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
                      <span>Instagram</span>
                      <span className="text-[10px] sm:text-xs font-normal text-neutral-400 font-mono truncate">
                        {STORE_INFO.instagramUser}
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#E1306C] font-semibold mt-0.5">
                      Stories & Lookbook
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#1F1F1F] text-neutral-300 border border-[#2E2E2E] shrink-0">
                  Oficial
                </span>
              </div>

              {/* Features / Pillars */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
                <div className="p-2 sm:p-3 bg-[#1A1A1A] rounded-lg sm:rounded-xl border border-[#262626]">
                  <p className="text-[9px] sm:text-[11px] font-bold uppercase text-[#DFB15B] mb-0.5 truncate">
                    Stories 24/7
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-300 line-clamp-2 sm:line-clamp-none">
                    Stock y tallas al día
                  </p>
                </div>

                <div className="p-2 sm:p-3 bg-[#1A1A1A] rounded-lg sm:rounded-xl border border-[#262626]">
                  <p className="text-[9px] sm:text-[11px] font-bold uppercase text-[#E1306C] mb-0.5 truncate">
                    Fotos Reales
                  </p>
                  <p className="text-[10px] sm:text-xs text-neutral-300 line-clamp-2 sm:line-clamp-none">
                    Galería en alta calidad
                  </p>
                </div>
              </div>

              {/* Content description */}
              <p className="text-[11px] sm:text-sm text-neutral-300 leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                Publicamos modelos en stock físico, sesiones con outfits completos y menciones de clientes que visten J Store Quality.
              </p>

              <div className="hidden sm:block space-y-2 mb-6 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                  <span>Lanzamientos exclusivos antes de que se agoten</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
                  <span>Reposts y fotos de clientes con sus pedidos</span>
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2.5 sm:pt-4 border-t border-[#222222]">
              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3 px-2.5 sm:px-5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#F56040] via-[#E1306C] to-[#833AB4] text-white font-bold text-[11px] sm:text-sm shadow-[0_0_20px_rgba(225,48,108,0.35)] hover:shadow-[0_0_28px_rgba(225,48,108,0.55)] transition-all active:scale-98"
              >
                <span className="truncate">Seguir en IG</span>
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              </a>
            </div>
          </motion.div>

        </div>

        {/* Community Engagement Banner */}
        <div className="p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] border border-[#262626] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#DFB15B]/15 text-[#DFB15B] border border-[#DFB15B]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(201,152,69,0.2)]">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm sm:text-lg text-white">
                ¿Compraste tu gorra o ropa en J Store Quality?
              </h4>
              <p className="text-[11px] sm:text-sm text-neutral-400 mt-0.5">
                Etiquétanos en <strong className="text-[#DFB15B]">@j.store.quality</strong> para compartir tu estilo con la comunidad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 w-full md:w-auto">
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white bg-[#222222] hover:bg-[#2B2B2B] border border-[#333333] rounded-lg sm:rounded-xl transition-all"
            >
              <span>Ver en Instagram</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
            </a>

            <a
              href={createWhatsAppConsultLink('¡Hola! Quiero compartirles una foto con mi prenda/gorra de J Store Quality')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-black bg-[#25D366] hover:bg-[#20ba5a] rounded-lg sm:rounded-xl shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black text-black" />
              <span>Enviar foto</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
