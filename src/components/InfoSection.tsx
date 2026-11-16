import React, { useState } from 'react';
import { ChevronDown, UserPlus, Award, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const InfoSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      icon: Award,
      title: 'Выберите номинацию',
      desc: 'Определите подходящую категорию из 12 направлений премии.',
    },
    {
      num: '02',
      icon: UserPlus,
      title: 'Заполните анкету',
      desc: 'Укажите ФИО, имя, псевдоним, ссылки на соцсети и загрузите фотографию.',
    },
    {
      num: '03',
      icon: Users,
      title: 'Появитесь на сайте',
      desc: 'Карточка участника сразу публикуется в выбранной номинации.',
    },
  ];

  const faqs = [
    {
      q: 'Кто может стать участником премии?',
      a: 'Блогеры, инфлюенсеры, эксперты и создатели цифрового контента Казахстана, соответствующие выбранной номинации.',
    },
    {
      q: 'Как подать заявку на участие?',
      a: 'Нажмите кнопку «Стать участником номинации», выберите категорию, прикрепите фотографию и заполните контактные данные.',
    },
    {
      q: 'Когда и где пройдёт церемония?',
      a: 'Церемония награждения состоится 8 декабря 2026 года в Астане в формате Met Gala.',
    },
    {
      q: 'Как стать партнёром мероприятия?',
      a: 'Нажмите кнопку «Стать партнёром» в верхней части страницы и отправьте заявку с контактами вашей компании.',
    },
  ];

  return (
    <section id="how-to-participate" className="champagne-silk-bg text-[#260B11] py-16 sm:py-20 border-b border-[#D9B26A]/70 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Laconic Steps */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: LUXURY_EASE }}
            className="text-center mb-10"
          >
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#7B4B2A] font-semibold mb-1.5">
              Порядок регистрации
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#4A0918] uppercase tracking-wide">
              Как стать участником
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: idx * 0.1, ease: LUXURY_EASE }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[#C49E66]/55 bg-[#FBF4EB]/85 p-6 shadow-[0_8px_24px_rgba(74,9,24,0.08)] flex flex-col justify-between transition-shadow hover:shadow-[0_14px_32px_rgba(74,9,24,0.14)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif-luxury text-2xl font-semibold text-[#A87A2E]">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#4A0918] text-[#FCE7B2] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-xl font-semibold text-[#4A0918] mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#260B11]/80 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Laconic Animated FAQ */}
        <div id="faq" className="max-w-3xl mx-auto pt-4 border-t border-[#C49E66]/45">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: LUXURY_EASE }}
            className="text-center mb-8"
          >
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#7B4B2A] font-semibold mb-1.5">
              Вопросы и ответы
            </p>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#4A0918] uppercase tracking-wide">
              FAQ
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.06, ease: LUXURY_EASE }}
                  className="rounded-xl border border-[#C49E66]/55 bg-[#FBF4EB]/90 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="font-serif-luxury text-lg font-semibold text-[#4A0918]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7B4B2A] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: LUXURY_EASE }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-xs sm:text-sm text-[#260B11]/80 leading-relaxed border-t border-[#C49E66]/30 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
