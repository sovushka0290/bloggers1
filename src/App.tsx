/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CategoriesSection } from './components/CategoriesSection';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { PartnerModal } from './components/PartnerModal';
import { AdminModal } from './components/AdminModal';
import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const AppContent: React.FC = () => {
  const { toastMessage } = useApp();
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#24030B] text-[#F6EBDC] font-sans-clean antialiased selection:bg-[#DFB567] selection:text-[#24030B]">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-[#D9B26A] bg-[#380511]/95 text-[#F6EBDC] shadow-2xl flex items-center gap-3 max-w-md"
          >
            <CheckCircle2 className="w-5 h-5 text-[#DFB567] shrink-0" />
            <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar onOpenPartnerModal={() => setIsPartnerModalOpen(true)} />

      <main>
        <HeroSection onOpenPartnerModal={() => setIsPartnerModalOpen(true)} />
        <AboutSection />
        <CategoriesSection />
        <InfoSection />
      </main>

      <Footer />

      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      <AdminModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
