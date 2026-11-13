import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion } from 'motion/react';
import { STORE_INFO, createWhatsAppConsultLink } from '../data/products';

export const FloatingWhatsApp: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-end flex-col gap-2 pointer-events-auto">
      
      {/* Floating conversational tooltip */}
      {!tooltipDismissed && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="hidden sm:flex items-center gap-2.5 py-2.5 px-4 bg-[#141414] text-white rounded-2xl shadow-2xl border border-[#2B2B2B] text-xs font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_rgba(37,211,102,0.9)] animate-pulse"></span>
          <span>¿Buscas una gorra o prenda? <strong className="text-[#DFB15B]">Escríbenos</strong></span>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="text-neutral-400 hover:text-white ml-1 p-0.5"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Glowing Floating Action Button matching reference image */}
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={createWhatsAppConsultLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a J Store Quality"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-black shadow-[0_0_25px_rgba(37,211,102,0.55)] hover:shadow-[0_0_35px_rgba(37,211,102,0.8)] border border-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        <MessageCircle className="w-7 h-7 fill-black text-black group-hover:rotate-6 transition-transform" />
      </motion.a>
    </div>
  );
};
