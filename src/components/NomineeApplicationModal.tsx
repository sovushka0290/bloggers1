import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { normalizeSocialInput } from '../utils/socialLinks';
import { X, Upload, Sparkles, UserCheck, Camera, Instagram } from 'lucide-react';

interface NomineeApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
  onSuccess?: (categoryId: string) => void;
}

function compressImageToDataUrl(file: File, maxSize = 560): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const TikTokSmallIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const YouTubeSmallIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

export const NomineeApplicationModal: React.FC<NomineeApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultCategoryId,
  onSuccess,
}) => {
  const { categories, addNominee } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [categoryId, setCategoryId] = useState(defaultCategoryId || categories[0]?.id || 'moms');
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [instagramInput, setInstagramInput] = useState('');
  const [tiktokInput, setTiktokInput] = useState('');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  useEffect(() => {
    if (defaultCategoryId && categories.some((c) => c.id === defaultCategoryId)) {
      setCategoryId(defaultCategoryId);
    } else if (categories[0] && !categories.some((c) => c.id === categoryId)) {
      setCategoryId(categories[0].id);
    }
  }, [defaultCategoryId, categories, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Пожалуйста, выберите файл изображения (JPG, PNG, WEBP).');
      return;
    }

    setErrorMsg(null);
    setIsProcessingPhoto(true);
    try {
      const compressed = await compressImageToDataUrl(file);
      setPhotoDataUrl(compressed);
      setPhotoFileName(file.name);
    } catch {
      setErrorMsg('Не удалось обработать фотографию. Попробуйте другой файл.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !firstName.trim() || !pseudonym.trim()) {
      setErrorMsg('Пожалуйста, заполните ФИО, имя и псевдоним.');
      return;
    }

    const resolvedInsta = normalizeSocialInput(instagramInput, 'instagram');
    const resolvedTiktok = normalizeSocialInput(tiktokInput, 'tiktok');
    const resolvedYoutube = normalizeSocialInput(youtubeInput, 'youtube');

    if (!resolvedInsta && !resolvedTiktok && !resolvedYoutube) {
      setErrorMsg('Укажите хотя бы одну соцсеть: Instagram, TikTok или YouTube.');
      return;
    }

    if (!photoDataUrl) {
      setErrorMsg('Пожалуйста, выберите свою фотографию.');
      return;
    }

    const chosenCat = categories.find((c) => c.id === categoryId) || categories[0];
    if (!chosenCat) {
      setErrorMsg('Нет доступных номинаций.');
      return;
    }

    const primarySocial = resolvedInsta || resolvedTiktok || resolvedYoutube!;
    const summaryParts: string[] = [];
    if (resolvedInsta) summaryParts.push(`Instagram: ${resolvedInsta.displayHandle}`);
    if (resolvedTiktok) summaryParts.push(`TikTok: ${resolvedTiktok.displayHandle}`);
    if (resolvedYoutube) summaryParts.push(`YouTube: ${resolvedYoutube.displayHandle}`);

    addNominee({
      categoryId: chosenCat.id,
      name: `${firstName.trim()} (${pseudonym.trim()})`,
      fullName: fullName.trim(),
      firstName: firstName.trim(),
      pseudonym: pseudonym.trim(),
      handle: primarySocial.displayHandle,
      instagramUrl: primarySocial.url,
      instagramHandle: instagramInput.trim() || undefined,
      tiktokHandle: tiktokInput.trim() || undefined,
      youtubeHandle: youtubeInput.trim() || undefined,
      socialLinks: summaryParts.join(', '),
      followers: 'Участник 2026',
      bioRu: `ФИО: ${fullName.trim()} · Псевдоним: ${pseudonym.trim()} · Номинация «${chosenCat.titleRu}».`,
      bioKz: `${fullName.trim()} (${pseudonym.trim()}) — «${chosenCat.titleKz}» номинациясының қатысушысы.`,
      bioEn: `${fullName.trim()} (${pseudonym.trim()}) — Applicant in ${chosenCat.titleEn}.`,
      photoUrl: photoDataUrl,
      isWinner2026: false,
      isUserSubmitted: true,
      order: 0,
    });

    const submittedCategoryId = chosenCat.id;
    setFullName('');
    setFirstName('');
    setPseudonym('');
    setInstagramInput('');
    setTiktokInput('');
    setYoutubeInput('');
    setPhotoDataUrl('');
    setPhotoFileName('');
    setErrorMsg(null);

    if (onSuccess) {
      onSuccess(submittedCategoryId);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#D9B26A] velvet-bg p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#1C0208]/75 text-[#F6EBDC] hover:text-[#FCE7B2] border border-[#D9B26A]/40 cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#DFB567] font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Заявка на участие в номинации</span>
        </div>
        <h3 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#F6EBDC]">
          Стать участником номинации
        </h3>
        <p className="text-xs text-[#F6EBDC]/75 mt-1 font-light">
          Заполните анкету и укажите ваши аккаунты в соцсетях — гости сайта смогут сразу переходить на ваши страницы.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/70 border border-red-400/50 text-xs text-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Выбор номинации */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1">
              Номинация *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#1C0208]/95 border border-[#D9B26A]/45 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.number} {cat.code} — {cat.titleRu}
                </option>
              ))}
            </select>
          </div>

          {/* Выбор фото */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1.5">
              Ваша фотография *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-4 p-3.5 rounded-xl border border-dashed border-[#D9B26A]/55 bg-[#1C0208]/60 hover:border-[#FCE7B2] hover:bg-[#380511]/50 transition-all cursor-pointer"
            >
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt="Предпросмотр фото участника"
                  className="w-16 h-16 rounded-xl object-cover border border-[#D9B26A] shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#24030B] border border-[#D9B26A]/40 flex items-center justify-center text-[#DFB567] shrink-0">
                  <Camera className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#FCE7B2] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {isProcessingPhoto
                      ? 'Обработка фото...'
                      : photoDataUrl
                      ? 'Изменить фотографию'
                      : 'Нажмите, чтобы выбрать свою фотку'}
                  </span>
                </p>
                <p className="text-[11px] text-[#F6EBDC]/60 truncate mt-0.5">
                  {photoFileName || 'Поддерживаются JPG, PNG, WEBP'}
                </p>
              </div>
            </div>
          </div>

          {/* ФИО */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1">
              ФИО (полностью) *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Фамилия Имя Отчество"
              className="w-full px-3.5 py-2.5 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
            />
          </div>

          {/* Имя и Псевдоним */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1">
                Имя *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full px-3.5 py-2.5 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1">
                Псевдоним *
              </label>
              <input
                type="text"
                required
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                placeholder="Ваш творческий псевдоним"
                className="w-full px-3.5 py-2.5 text-xs bg-[#1C0208]/85 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>
          </div>

          {/* Ник или ссылка в соцсетях (Instagram / TikTok / YouTube) */}
          <div className="pt-1 space-y-3 rounded-xl border border-[#D9B26A]/30 bg-[#1C0208]/55 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wider text-[#FCE7B2] font-semibold">
                Ваши соцсети *
              </span>
              <span className="text-[10px] text-[#E8CFA0]/75">
                Укажите хотя бы одну
              </span>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] text-[#E8CFA0] font-medium mb-1">
                <Instagram className="w-3.5 h-3.5 text-[#DFB567]" />
                <span>Instagram (ник @... или ссылка)</span>
              </label>
              <input
                type="text"
                value={instagramInput}
                onChange={(e) => setInstagramInput(e.target.value)}
                placeholder="@username или https://instagram.com/username"
                className="w-full px-3 py-2 text-xs bg-[#1C0208]/90 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] text-[#E8CFA0] font-medium mb-1">
                <TikTokSmallIcon className="w-3.5 h-3.5 text-[#DFB567]" />
                <span>TikTok (ник @... или ссылка)</span>
              </label>
              <input
                type="text"
                value={tiktokInput}
                onChange={(e) => setTiktokInput(e.target.value)}
                placeholder="@username или https://tiktok.com/@username"
                className="w-full px-3 py-2 text-xs bg-[#1C0208]/90 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] text-[#E8CFA0] font-medium mb-1">
                <YouTubeSmallIcon className="w-3.5 h-3.5 text-[#DFB567]" />
                <span>YouTube (канал @... или ссылка)</span>
              </label>
              <input
                type="text"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="@channel или https://youtube.com/@channel"
                className="w-full px-3 py-2 text-xs bg-[#1C0208]/90 border border-[#D9B26A]/40 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessingPhoto}
            className="w-full py-3.5 text-xs font-semibold tracking-[0.16em] gold-button rounded uppercase transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>Опубликовать заявку на сайте</span>
          </button>
        </form>
      </div>
    </div>
  );
};
