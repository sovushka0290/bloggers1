import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Nominee } from '../types';
import { NomineeApplicationModal } from './NomineeApplicationModal';
import { MEDIA_ASSETS } from '../assets/media';
import { getNomineeSocialLinks, SocialPlatform } from '../utils/socialLinks';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Instagram,
  ExternalLink,
  Heart,
  Dumbbell,
  Briefcase,
  Star,
  Plane,
  GraduationCap,
  Smile,
  Camera,
  UserPlus,
  Users,
} from 'lucide-react';

const SocialPlatformIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({
  platform,
  className = 'w-3.5 h-3.5 shrink-0',
}) => {
  if (platform === 'instagram') {
    return <Instagram className={className} />;
  }
  if (platform === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
};

const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CategoryOutlineIcon: React.FC<{ id: string }> = ({ id }) => {
  const cls = 'w-7 h-7 sm:w-8 sm:h-8 text-[#E8C57B] stroke-[1.35]';

  switch (id) {
    case 'moms':
      return <Heart className={cls} />;
    case 'lifestyle':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={cls} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 6C13.5 10.5 13.5 16 16 21C18.5 16 18.5 10.5 16 6Z" />
          <path d="M16 21C11 19.5 7.5 15 8 10.5C11.5 11.5 14.5 15.5 16 21Z" />
          <path d="M16 21C21 19.5 24.5 15 24 10.5C20.5 11.5 17.5 15.5 16 21Z" />
          <path d="M16 21C9.5 21.5 5 19 4.5 15.5C8 15 12 17.5 16 21Z" />
          <path d="M16 21C22.5 21.5 27 19 27.5 15.5C24 15 20 17.5 16 21Z" />
          <path d="M8 24.5H24" />
        </svg>
      );
    case 'sports':
      return <Dumbbell className={cls} />;
    case 'fashion':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={cls} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5L14 10L10 13L7 26H25L22 13L18 10L20 5" />
          <path d="M12 5C13.5 7 18.5 7 20 5" />
          <path d="M11 13H21" />
        </svg>
      );
    case 'beauty':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={cls} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 16C7.5 11.5 12 11 16 13.5C20 11 24.5 11.5 28 16C24.5 21.5 20 23 16 23C12 23 7.5 21.5 4 16Z" />
          <path d="M4 16C9 17.2 13 17.5 16 16.5C19 17.5 23 17.2 28 16" />
        </svg>
      );
    case 'business':
      return <Briefcase className={cls} />;
    case 'expert':
      return <Star className={cls} />;
    case 'travel':
      return <Plane className={cls} />;
    case 'food':
      return (
        <svg viewBox="0 0 32 32" fill="none" className={cls} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 7V9" />
          <circle cx="16" cy="6" r="1.2" />
          <path d="M6 21C6 14.5 10.5 10 16 10C21.5 10 26 14.5 26 21" />
          <path d="M4 21H28" />
          <path d="M6 24H26" />
        </svg>
      );
    case 'education':
      return <GraduationCap className={cls} />;
    case 'humor':
      return <Smile className={cls} />;
    case 'models':
      return <Camera className={cls} />;
    default:
      return <Award className={cls} />;
  }
};

export const CategoriesSection: React.FC = () => {
  const { categories, nominees } = useApp();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || 'moms');
  const [viewAllParticipants, setViewAllParticipants] = useState(true);
  const [selectedNomineeModal, setSelectedNomineeModal] = useState<Nominee | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  const activeCategoryIds = new Set(categories.map((c) => c.id));

  const visibleParticipants = nominees.filter((n) => {
    if (!activeCategoryIds.has(n.categoryId)) return false;
    return viewAllParticipants ? true : n.categoryId === currentCategory?.id;
  });

  const getCategoryLabelForNominee = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return found ? `${found.code} · ${found.titleRu}` : catId;
  };

  return (
    <section id="categories" className="py-16 sm:py-20 velvet-bg velvet-silk-streaks relative border-b border-[#D9B26A]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Header with Animated Flanking Golden Hairlines */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: LUXURY_EASE }}
          className="flex items-center justify-center gap-5 sm:gap-8 mb-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: LUXURY_EASE }}
            className="flex-1 max-w-xs gold-hairline origin-right"
          />
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.28em] text-[#F6EBDC] uppercase text-center whitespace-nowrap">
            {categories.length} НОМИНАЦИЙ
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: LUXURY_EASE }}
            className="flex-1 max-w-xs gold-hairline origin-left"
          />
        </motion.div>

        {/* 12 Nominations Grid with Smooth Staggered Entrance */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-10">
            {categories.map((cat, idx) => {
              const isSelected = cat.id === selectedCategoryId && !viewAllParticipants;
              const participantCount = nominees.filter((n) => n.categoryId === cat.id).length;
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.04, 0.45), ease: LUXURY_EASE }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setViewAllParticipants(false);
                  }}
                  className={`rounded-xl py-5 px-3 transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-2 relative ${
                    isSelected ? 'velvet-card-active' : 'velvet-card'
                  }`}
                >
                  <CategoryOutlineIcon id={cat.id} />
                  <div className="space-y-0.5">
                    <span className="block font-sans-clean text-xs sm:text-[13px] tracking-[0.14em] uppercase font-medium text-[#FCE7B2]">
                      {cat.code}
                    </span>
                    <span className="block text-[11px] text-[#E8CFA0]/80 font-light">
                      {cat.titleRu}
                    </span>
                    {participantCount > 0 && (
                      <span className="block text-[10px] text-[#DFB567]/75 pt-0.5 tabular-nums">
                        Участников: {participantCount}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="velvet-card rounded-xl p-8 text-center mb-10 text-xs text-[#E8CFA0]/80">
            Все номинации были удалены администратором.
          </div>
        )}

        {/* Participation CTA + Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: LUXURY_EASE }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsApplyModalOpen(true)}
            className="px-7 py-3.5 rounded text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase gold-button transition-shadow cursor-pointer flex items-center gap-2.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Стать участником номинации</span>
          </motion.button>

          {nominees.length > 0 && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setViewAllParticipants(!viewAllParticipants)}
              className={`px-5 py-3.5 text-xs font-semibold rounded border transition-colors flex items-center gap-2 cursor-pointer uppercase tracking-wider ${
                viewAllParticipants ? 'velvet-card-active text-[#FCE7B2]' : 'velvet-outline-btn'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{viewAllParticipants ? 'Показаны все участники' : 'Показать всех участников'}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Registered Participants List */}
        {visibleParticipants.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleParticipants.map((nominee, idx) => (
              <motion.div
                key={nominee.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.05, 0.35), ease: LUXURY_EASE }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedNomineeModal(nominee)}
                className="group rounded-xl overflow-hidden cursor-pointer flex flex-col justify-between transition-colors duration-300 velvet-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1C0208]">
                  <img
                    src={nominee.photoUrl}
                    alt={nominee.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = MEDIA_ASSETS.goldenStatue;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A030B] via-transparent to-transparent opacity-90" />

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#1C0208]/92 border border-[#D9B26A]/50 text-[10px] font-semibold tracking-wider uppercase text-[#FCE7B2]">
                    {getCategoryLabelForNominee(nominee.categoryId)}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-serif-luxury text-xl font-semibold text-[#F6EBDC] group-hover:text-[#FCE7B2] transition-colors mb-1">
                      {nominee.name}
                    </h4>

                    {nominee.fullName && (
                      <p className="text-[11px] text-[#E8CFA0]/80 mb-2">
                        ФИО: {nominee.fullName}
                      </p>
                    )}

                    {/* Direct Clickable Social Links */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {getNomineeSocialLinks(nominee).map((link) => (
                        <a
                          key={`${link.platform}-${link.url}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title={`Перейти на ${link.label} (${link.displayHandle})`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1C0208]/85 border border-[#D9B26A]/45 text-[11px] text-[#FCE7B2] hover:bg-[#D9B26A] hover:text-[#1C0208] hover:border-[#FCE7B2] transition-colors"
                        >
                          <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium truncate max-w-[140px]">
                            {link.displayHandle}
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Animated Participant Detail Modal */}
      <AnimatePresence>
        {selectedNomineeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedNomineeModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: LUXURY_EASE }}
              className="relative w-full max-w-lg rounded-2xl border border-[#D9B26A] velvet-bg p-6 sm:p-8 shadow-2xl space-y-5 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <img
                  src={selectedNomineeModal.photoUrl}
                  alt={selectedNomineeModal.name}
                  className="w-24 h-24 rounded-xl object-cover border border-[#D9B26A]/60 shrink-0 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <span className="inline-block text-[10px] tracking-wider uppercase text-[#DFB567] font-semibold">
                    Номинация: {getCategoryLabelForNominee(selectedNomineeModal.categoryId)}
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-semibold text-[#F6EBDC]">
                    {selectedNomineeModal.name}
                  </h3>
                  {selectedNomineeModal.fullName && (
                    <p className="text-xs text-[#E8CFA0]/85">
                      ФИО: {selectedNomineeModal.fullName}
                    </p>
                  )}
                </div>
              </div>

              {/* Direct Links to Participant's Pages */}
              <div className="space-y-2.5 border-t border-[#D9B26A]/25 pt-4">
                <p className="text-[11px] uppercase tracking-wider text-[#DFB567] font-semibold">
                  Страницы участника
                </p>
                <div className="flex flex-wrap gap-2">
                  {getNomineeSocialLinks(selectedNomineeModal).map((link) => (
                    <a
                      key={`modal-${link.platform}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 text-xs font-semibold gold-button rounded-lg flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <SocialPlatformIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {link.label}: {link.displayHandle}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-[#D9B26A]/25">
                <button
                  onClick={() => setSelectedNomineeModal(null)}
                  className="px-4 py-2 text-xs velvet-outline-btn rounded cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NomineeApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        defaultCategoryId={currentCategory?.id}
        onSuccess={(submittedCatId) => {
          setSelectedCategoryId(submittedCatId);
          setViewAllParticipants(false);
        }}
      />
    </section>
  );
};
