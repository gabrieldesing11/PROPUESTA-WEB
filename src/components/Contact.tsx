import React, { useState } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Truck, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Navigation,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_INFO, createWhatsAppConsultLink } from '../data/products';

export const Contact: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Quick message builder state
  const [clientName, setClientName] = useState('');
  const [inquiryType, setInquiryType] = useState('Precios y cotización de envío nacional');
  const [customNote, setCustomNote] = useState('');

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSendCustomWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const greeting = clientName.trim() ? `¡Hola! Mi nombre es ${clientName.trim()}.` : '¡Hola!';
    const note = customNote.trim() ? ` Detalle: ${customNote.trim()}.` : '';
    const fullText = `${greeting} Me comunico con J Store Quality para: ${inquiryType}.${note} ¿Podrían brindarme información?`;
    
    const url = `https://wa.me/${STORE_INFO.primaryWhatsAppNumber}?text=${encodeURIComponent(fullText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contacto" className="py-10 sm:py-24 bg-[#0B0B0B] border-t border-[#1C1C1C] relative">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#DFB15B]">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
            <span>Ubicación y Atención</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
            Visítanos o escríbenos
          </h2>
          <p className="text-xs sm:text-base text-neutral-400 mt-1.5 sm:mt-2">
            Estamos en Cúcuta, Norte de Santander y despachamos pedidos todos los días a toda Colombia.
          </p>
        </div>

        {/* Contact Information & Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-6 sm:mb-16">
          
          {/* Left Column: Multiple Side-by-Side Boxes on Mobile (2x2 grid) & Stacked/Grid on Desktop (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-4 content-start">
            
            {/* Box 1: Address Card (1 col on mobile, 2 cols on md+) */}
            <div className="col-span-1 md:col-span-2 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#242424] bg-[#141414] shadow-lg hover:border-[#C99845]/50 transition-colors flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#1F1F1F] text-[#DFB15B] border border-[#2B2B2B] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#DFB15B] block">
                      Sede Principal
                    </span>
                    <h3 className="font-display font-bold text-sm sm:text-lg text-white mt-0.5 leading-tight">
                      Tienda en Cúcuta
                    </h3>
                    <p className="text-[11px] sm:text-sm text-neutral-300 font-medium mt-1 leading-snug">
                      {STORE_INFO.address}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(STORE_INFO.address, 'address')}
                  className="p-1.5 sm:p-2 text-neutral-400 hover:text-white bg-[#1B1B1B] rounded-lg border border-[#2B2B2B] hover:bg-[#252525] transition-colors shrink-0"
                  title="Copiar dirección"
                  aria-label="Copiar dirección"
                >
                  {copiedField === 'address' ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>

              <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-0 border-t border-[#222222] sm:border-t-0">
                <a
                  href={STORE_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-[#DFB15B] hover:text-white underline underline-offset-2 transition-colors"
                >
                  <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Ver en Maps</span>
                </a>
              </div>
            </div>

            {/* Box 2: WhatsApp Card (1 col on mobile, 2 cols on md+) */}
            <div className="col-span-1 md:col-span-2 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#242424] bg-[#141414] shadow-lg hover:border-[#C99845]/50 transition-colors flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4 mb-2.5 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#1F1F1F] text-[#25D366] border border-[#2B2B2B] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(37,211,102,0.2)]">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-[#25D366]" />
                </div>
                <div>
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#DFB15B] block">
                    WhatsApp Directo
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-lg text-white mt-0.5 leading-tight">
                    Atención Rápida
                  </h3>
                  <p className="hidden sm:block text-xs text-neutral-400 mt-0.5">
                    Respuesta rápida para asesorarte con tallas, modelos y tiempos de entrega.
                  </p>
                </div>
              </div>

              <div className="sm:p-4 sm:bg-[#1A1A1A] rounded-xl sm:border sm:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                <div>
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    Línea Oficial de WhatsApp
                  </span>
                  <p className="font-display font-bold text-xs sm:text-lg text-white tabular-nums">
                    {STORE_INFO.primaryWhatsAppDisplay}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a
                    href={createWhatsAppConsultLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-1.5 sm:py-2.5 px-2.5 sm:px-4 bg-[#25D366] text-black rounded-lg text-[11px] sm:text-xs font-bold hover:bg-[#20ba5a] shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black text-black" />
                    <span>Chatear</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(STORE_INFO.primaryWhatsAppRaw, 'phone1')}
                    className="p-1.5 sm:p-2.5 text-neutral-400 hover:text-white bg-[#222222] border border-[#2D2D2D] rounded-lg"
                    title="Copiar número"
                    aria-label="Copiar número de WhatsApp"
                  >
                    {copiedField === 'phone1' ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Box 3: Shipping Highlight */}
            <div className="col-span-1 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#242424] bg-[#141414]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1F1F1F] text-[#DFB15B] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-white leading-tight">
                  {STORE_INFO.shippingText}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
                Embalaje seguro para gorras y ropa. Despachos rápidos desde Cúcuta con guía.
              </p>
            </div>

            {/* Box 4: TikTok Channel */}
            <div className="col-span-1 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-[#242424] bg-[#141414] flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0">
                    TT
                  </div>
                  <div className="min-w-0">
                    <span className="font-display font-bold text-xs sm:text-sm text-white block leading-tight">
                      TikTok Oficial
                    </span>
                    <span className="text-[10px] sm:text-xs text-neutral-400 font-mono truncate block">
                      {STORE_INFO.tiktokUser}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Nuevos ingresos, pruebas de calidad y unboxing.
                </p>
              </div>

              <div className="mt-2 sm:mt-3">
                <a
                  href={STORE_INFO.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-[#DFB15B] hover:text-white transition-colors"
                >
                  <span>Ver TikTok</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Fast WhatsApp Message Builder Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-[#141414] border border-[#262626] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DFB15B] via-[#25D366] to-[#DFB15B]"></div>

              <div className="mb-4 sm:mb-6">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#DFB15B] block">
                  Contacto Inmediato
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
                  Escríbenos en un clic
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">
                  Elige tu consulta y te abriremos WhatsApp con el mensaje listo para enviar.
                </p>
              </div>

              <form onSubmit={handleSendCustomWhatsApp} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Tu nombre (opcional)
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Carlos Martínez"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#1B1B1B] border border-[#2B2B2B] rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B]/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Motivo de consulta
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#1B1B1B] border border-[#2B2B2B] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B]/30 transition-all"
                  >
                    <option value="Precios y cotización de envío nacional">Precios y cotización de envío nacional</option>
                    <option value="Compras por mayor o combos">Compras al por mayor o combos</option>
                    <option value="Visita a la tienda en Cúcuta">Visita a la tienda en Cúcuta</option>
                    <option value="Otra consulta">Otra consulta personalizada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                    Detalles adicionales (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Indícanos la talla, modelo o tu ciudad..."
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#1B1B1B] border border-[#2B2B2B] rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B]/30 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Glowing WhatsApp Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_22px_rgba(37,211,102,0.45)] hover:shadow-[0_0_30px_rgba(37,211,102,0.65)] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>Enviar a WhatsApp ({STORE_INFO.primaryWhatsAppDisplay})</span>
                </motion.button>

                <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-400">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFB15B]" />
                  <span>Horario: {STORE_INFO.schedule}</span>
                </div>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
