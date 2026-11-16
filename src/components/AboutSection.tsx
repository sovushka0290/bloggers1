import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutSection: React.FC = () => {
  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="relative">
      <div className="champagne-silk-bg border-y border-[#D9B26A]/70 shadow-[0_6px_30px_rgba(0,0,0,0.35)] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="shrink-0">
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold tracking-wide text-[#4A0918] uppercase">
                О ПРЕМИИ
              </h2>
            </div>

            <div className="hidden md:block w-px h-14 bg-[#C49E66]/55 shrink-0" />

            <p className="text-xs sm:text-sm text-[#260B11] leading-relaxed max-w-2xl text-center md:text-left font-normal">
              <strong className="font-semibold text-[#4A0918]">Bloggers Awards Kazakhstan</strong> — масштабная
              национальная премия, признающая достижения лидеров мнений, развивающая культуру
              ответственного блогинга и формирующая профессиональное комьюнити инфлюенсеров страны.
            </p>

            <motion.button
              whileHover={{ scale: 1.08, x: 3 }}
              whileTap={{ scale: 0.94 }}
              onClick={scrollToCategories}
              aria-label="Перейти к номинациям"
              className="w-11 h-11 rounded-full border border-[#8E6A44]/55 flex items-center justify-center text-[#4A0918] hover:bg-[#4A0918] hover:text-[#FBF4EB] transition-colors shrink-0 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
