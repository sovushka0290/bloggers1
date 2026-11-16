import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, ShieldCheck } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPacket?: string;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  defaultPacket = 'Генеральный партнёр',
}) => {
  const { submitApplication } = useApp();
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    phone: '',
    email: '',
    packet: defaultPacket,
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.fullName || !formData.phone) {
      return;
    }
    submitApplication({
      type: 'partner',
      companyName: formData.companyName,
      fullName: formData.fullName,
      instagram: '@company',
      phone: formData.phone,
      email: formData.email,
      packet: formData.packet,
      comment: formData.comment,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-[#D9B26A] velvet-bg p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#1C0208]/75 text-[#F6EBDC] hover:text-[#FCE7B2] border border-[#D9B26A]/40 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <ShieldCheck className="w-14 h-14 text-[#DFB567] mx-auto" />
            <h3 className="font-serif-luxury text-3xl font-semibold text-[#F6EBDC]">
              Заявка зарегистрирована
            </h3>
            <p className="text-xs text-[#F6EBDC]/80 max-w-md mx-auto">
              Организаторы премии свяжутся с вами в ближайшее время.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#DFB567] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Партнёрство</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#F6EBDC]">
              Стать партнёром премии 2026
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-[#E8CFA0] font-semibold mb-1">
                    Компания / Бренд *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Название компании"
                    className="w-full px-3.5 py-2 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#E8CFA0] font-semibold mb-1">
                    ФИО представителя *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Имя Фамилия"
                    className="w-full px-3.5 py-2 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-[#E8CFA0] font-semibold mb-1">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (700) 000-00-00"
                    className="w-full px-3.5 py-2 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-[#E8CFA0] font-semibold mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#E8CFA0] font-semibold mb-1">
                  Формат партнёрства
                </label>
                <select
                  value={formData.packet}
                  onChange={(e) => setFormData({ ...formData, packet: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#1C0208]/95 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
                >
                  <option value="Генеральный партнёр">Генеральный партнёр</option>
                  <option value="Официальный партнёр">Официальный партнёр</option>
                  <option value="Информационный / Специальный партнёр">
                    Информационный / Специальный партнёр
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-[#E8CFA0] font-semibold mb-1">
                  Комментарий
                </label>
                <textarea
                  rows={2}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Ваши пожелания..."
                  className="w-full px-3.5 py-2 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-xs font-semibold tracking-[0.16em] gold-button rounded uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Отправить заявку</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
