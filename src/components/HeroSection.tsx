import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { TrophySvg } from './TrophySvg';
import { useApp } from '../context/AppContext';

interface HeroSectionProps {
  onOpenPartnerModal: () => void;
}

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPartnerModal }) => {
  const { categories, nominees } = useApp();

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative velvet-bg velvet-silk-streaks overflow-hidden pt-6 pb-10 lg:py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(252,231,178,0.16)_0%,rgba(217,178,106,0.05)_45%,transparent_70%)]" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#450614]/80 via-[#2D030D]/30 to-transparent" />
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-[#5E0A1D]/70 via-[#32040E]/20 to-transparent" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(155,14,42,0.55)_0%,transparent_70%)]" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(155,14,42,0.45)_0%,transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Animated entrance for Hero Photo */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: LUXURY_EASE }}
            className="lg:col-span-5 order-2 lg:order-1 flex justify-center"
          >
            <div className="relative w-full max-w-md lg:max-w-full group">
              <div className="relative overflow-hidden rounded-2xl border border-[#D9B26A]/35 shadow-[0_20px_50px_rgba(10,1,3,0.7)] bg-[#220309] aspect-[3/4]">
                <img
                  src="/assets/aistudio/5465480360046042655_90338cc9.jpg"
                  alt="Bloggers Awards Kazakhstan 2026"
                  className="w-full h-auto max-w-none block -translate-y-[20%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#26030A]/75 via-transparent to-[#26030A]/25 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#26030A]/30 via-transparent to-[#26030A]/30 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Staggered Luxury Reveal */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-center text-center space-y-5 py-4">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: LUXURY_EASE }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative shrink-0"
              >
                <TrophySvg className="w-24 h-36 sm:w-28 sm:h-44 drop-shadow-[0_0_24px_rgba(252,231,178,0.45)]" />
              </motion.div>

              <div className="flex flex-col items-center leading-none">
                <h1 className="font-serif-luxury font-semibold tracking-[0.06em] uppercase gold-gradient-text text-4xl sm:text-5xl lg:text-[54px] leading-[0.95] drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
                  BLOGGERS
                  <span className="block mt-1">AWARDS</span>
                </h1>
                <span className="font-sans-clean text-xs sm:text-sm tracking-[0.42em] text-[#E8CFA0] uppercase mt-2">
                  KAZAKHSTAN
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease: LUXURY_EASE }}
                  className="font-serif-luxury font-normal text-5xl sm:text-6xl lg:text-[68px] gold-gradient-text tracking-[0.08em] leading-none mt-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
                >
                  2026
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.28, ease: LUXURY_EASE }}
              className="w-full max-w-md gold-hairline origin-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32, ease: LUXURY_EASE }}
              className="font-sans-clean text-xs sm:text-sm tracking-[0.22em] uppercase text-[#F6EBDC]/90 leading-relaxed max-w-lg font-normal"
            >
              НАЦИОНАЛЬНАЯ ПРЕМИЯ БЛОГЕРОВ, ИНФЛЮЕНСЕРОВ И КРЕАТОРОВ КАЗАХСТАНА
            </motion.p>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.36, ease: LUXURY_EASE }}
              className="w-full max-w-md gold-hairline origin-center"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: LUXURY_EASE }}
              className="font-sans-clean text-xs sm:text-sm tracking-[0.32em] uppercase text-[#E8CFA0] font-medium"
            >
              СТИЛЬ ПРЕМИИ — MET GALA
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.46, ease: LUXURY_EASE }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm tracking-[0.16em] uppercase text-[#F6EBDC] font-medium"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#DFB567]" />
                <span>8 ДЕКАБРЯ 2026</span>
              </span>
              <span className="text-[#D9B26A]/60">|</span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#DFB567]" />
                <span>АСТАНА</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.52, ease: LUXURY_EASE }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2 w-full max-w-lg"
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCategories}
                className="flex-1 min-w-[180px] py-3.5 px-6 rounded text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase gold-button transition-shadow cursor-pointer"
              >
                НОМИНАЦИИ
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenPartnerModal}
                className="flex-1 min-w-[180px] py-3.5 px-6 rounded text-xs sm:text-sm font-medium tracking-[0.14em] uppercase velvet-outline-btn transition-shadow cursor-pointer"
              >
                СТАТЬ ПАРТНЁРОМ
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6, ease: LUXURY_EASE }}
              className="pt-3 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center"
            >
              <div>
                <span className="block font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#FCE7B2] tabular-nums">
                  {categories.length}
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#E8CFA0]/75">
                  Номинаций
                </span>
              </div>
              <div className="w-px h-8 bg-[#D9B26A]/30" />
              <div>
                <span className="block font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#FCE7B2] tabular-nums">
                  {nominees.length}
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#E8CFA0]/75">
                  Участников
                </span>
              </div>
              <div className="w-px h-8 bg-[#D9B26A]/30" />
              <div>
                <span className="block font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#FCE7B2]">
                  MET GALA
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#E8CFA0]/75">
                  Формат церемонии
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
