import React from 'react';
import { useApp } from '../context/AppContext';
import { TrophySvg } from './TrophySvg';

export const Footer: React.FC = () => {
  const { setIsAdminOpen } = useApp();

  return (
    <footer className="velvet-bg text-[#F6EBDC] border-t border-[#D9B26A]/35 py-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 gold-hairline" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <TrophySvg className="w-6 h-10" />
            <div className="flex flex-col leading-none">
              <span className="font-serif-luxury text-base font-semibold tracking-wider gold-gradient-text">
                BLOGGERS AWARDS
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#E8CFA0]/85 uppercase mt-0.5">
                KAZAKHSTAN · 2026
              </span>
            </div>
          </div>

          <p className="text-xs text-[#E8CFA0]/75 text-center">
            8 декабря 2026 · Астана · Стиль премии — Met Gala
          </p>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="text-[11px] text-[#E8CFA0]/30 hover:text-[#E8CFA0]/75 transition-colors cursor-pointer select-none"
          >
            Вход для администратора
          </button>
        </div>
      </div>
    </footer>
  );
};
