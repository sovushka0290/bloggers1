import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { TrophySvg } from './TrophySvg';

interface NavbarProps {
  onOpenPartnerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPartnerModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#', label: 'ГЛАВНАЯ', isHome: true },
    { href: '#about', label: 'О ПРЕМИИ' },
    { href: '#categories', label: 'НОМИНАЦИИ' },
    { href: '#how-to-participate', label: 'КАК УЧАСТВОВАТЬ' },
    { href: '#faq', label: 'FAQ' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D9B26A]/30 bg-[#23030A]/95 shadow-[0_4px_30px_rgba(0,0,0,0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <TrophySvg className="w-7 h-11 drop-shadow-[0_0_10px_rgba(235,195,118,0.45)]" />
          <div className="flex flex-col leading-none">
            <span className="font-serif-luxury text-base sm:text-lg font-semibold tracking-wider gold-gradient-text">
              BLOGGERS
            </span>
            <span className="font-serif-luxury text-base sm:text-lg font-semibold tracking-wider gold-gradient-text -mt-0.5">
              AWARDS
            </span>
            <span className="font-sans-clean text-[8px] tracking-[0.32em] text-[#E8CFA0]/85 uppercase mt-0.5">
              KAZAKHSTAN
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-[11px] font-medium tracking-[0.16em]">
          {navLinks.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none ${
                item.isHome
                  ? 'text-[#FCE7B2] border-b border-[#D9B26A]'
                  : 'text-[#F6EBDC]/85 hover:text-[#FCE7B2]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenPartnerModal}
            className="px-4 py-2 text-[11px] font-medium tracking-[0.14em] velvet-outline-btn rounded uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer"
          >
            СТАТЬ ПАРТНЁРОМ
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#F6EBDC] hover:text-[#FCE7B2] transition-colors focus:outline-none"
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9B26A]/25 bg-[#23030A]/98 px-6 py-6 space-y-4">
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {navLinks.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-left py-2 text-xs tracking-[0.15em] uppercase text-[#F6EBDC] hover:text-[#FCE7B2] border-b border-[#D9B26A]/15 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPartnerModal();
              }}
              className="w-full py-3 text-center text-xs font-semibold tracking-[0.15em] gold-button rounded uppercase cursor-pointer"
            >
              СТАТЬ ПАРТНЁРОМ
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
