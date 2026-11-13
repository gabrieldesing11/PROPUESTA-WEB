/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { Community } from './components/Community';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const hash = window.location.hash;
  const params = new URLSearchParams(window.location.search);
  return pathname === '/admin' || hash === '#/admin' || params.get('admin') === '1';
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(checkIsAdminRoute());
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const handleExitAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  return (
    <CatalogProvider>
      {isAdminRoute ? (
        <AdminPanel onExitAdmin={handleExitAdmin} />
      ) : (
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#FAF9F6] selection:bg-[#C99845]/30 selection:text-white">
            {/* Top Header */}
            <Header />

            {/* Main Page Content */}
            <main className="flex-1">
              {/* Portada / Hero */}
              <Hero />

              {/* Catálogo con filtros funcionales */}
              <Catalog />

              {/* Comunidad en Redes: TikTok e Instagram */}
              <Community />

              {/* Ubicación y Contacto */}
              <Contact />
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating WhatsApp Action */}
            <FloatingWhatsApp />

            {/* Shopping Cart Drawer */}
            <CartDrawer />
          </div>
        </CartProvider>
      )}
    </CatalogProvider>
  );
}
