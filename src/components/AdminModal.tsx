import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Nominee, Application } from '../types';
import { MEDIA_ASSETS } from '../assets/media';
import { getNomineeSocialLinks, normalizeSocialInput } from '../utils/socialLinks';
import {
  X,
  Shield,
  Award,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Download,
  RotateCcw,
  Search,
  Lock,
  LogOut,
  Layers,
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    adminRole,
    setAdminRole,
    categories,
    deleteCategory,
    restoreCategories,
    nominees,
    addNominee,
    updateNominee,
    deleteNominee,
    toggleNomineeWinner,
    applications,
    updateApplicationStatus,
    deleteApplication,
    exportApplicationsToCsv,
    settings,
    updateSettings,
    activeYear,
    setActiveYear,
    availableYears,
    resetToDefaultData,
  } = useApp();

  // Login Form State
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // CMS Tabs
  const [activeTab, setActiveTab] = useState<'categories' | 'nominees' | 'applications' | 'settings'>('categories');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [nomineeSearch, setNomineeSearch] = useState('');
  const [appTypeFilter, setAppTypeFilter] = useState<'all' | 'partner' | 'participant'>('all');

  // New/Edit Nominee State
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);
  const [isAddingNominee, setIsAddingNominee] = useState(false);
  const [nomineeForm, setNomineeForm] = useState({
    categoryId: categories[0]?.id || 'moms',
    name: '',
    handle: '@',
    instagramUrl: '',
    tiktokHandle: '',
    youtubeHandle: '',
    followers: 'Участник 2026',
    bioRu: '',
    photoUrl: MEDIA_ASSETS.goldenStatue,
    isWinner2026: false,
  });

  if (!isAdminOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(loginInput, passwordInput);
    if (ok) {
      setLoginError('');
      setLoginInput('');
      setPasswordInput('');
    } else {
      setLoginError('Неверный логин или пароль. Попробуйте снова.');
    }
  };

  // RENDER LOGIN GATE IF NOT AUTHENTICATED
  if (!isAdminAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={() => setIsAdminOpen(false)}
      >
        <div
          className="relative w-full max-w-md rounded-2xl border border-[#D9B26A] velvet-bg p-6 sm:p-8 shadow-2xl text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#1C0208]/75 text-[#F6EBDC] hover:text-[#FCE7B2] border border-[#D9B26A]/40 cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#1C0208] border border-[#D9B26A]/60 flex items-center justify-center text-[#DFB567]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-2xl font-semibold text-[#F6EBDC]">
                Вход для администратора
              </h3>
              <p className="text-[11px] text-[#E8CFA0]/75">
                Введите логин и пароль для управления премией
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-400/50 text-xs text-red-100">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1">
                Логин
              </label>
              <input
                type="text"
                required
                autoFocus
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 text-xs bg-[#1C0208]/90 border border-[#D9B26A]/45 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8CFA0] font-semibold mb-1">
                Пароль
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-[#1C0208]/90 border border-[#D9B26A]/45 rounded text-[#F6EBDC] focus:border-[#FCE7B2] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold tracking-[0.16em] gold-button rounded uppercase cursor-pointer mt-2"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setNomineeForm({
      categoryId:
        selectedCatFilter === 'all' ? categories[0]?.id || 'moms' : selectedCatFilter,
      name: '',
      handle: '@',
      instagramUrl: '',
      tiktokHandle: '',
      youtubeHandle: '',
      followers: 'Участник 2026',
      bioRu: '',
      photoUrl: MEDIA_ASSETS.goldenStatue,
      isWinner2026: false,
    });
    setEditingNominee(null);
    setIsAddingNominee(true);
  };

  const handleOpenEdit = (nom: Nominee) => {
    setNomineeForm({
      categoryId: nom.categoryId,
      name: nom.name,
      handle: nom.instagramHandle || nom.handle,
      instagramUrl: nom.instagramUrl,
      tiktokHandle: nom.tiktokHandle || '',
      youtubeHandle: nom.youtubeHandle || '',
      followers: nom.followers,
      bioRu: nom.bioRu,
      photoUrl: nom.photoUrl,
      isWinner2026: nom.isWinner2026,
    });
    setEditingNominee(nom);
    setIsAddingNominee(true);
  };

  const handleSaveNominee = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !nomineeForm.name ||
      (!nomineeForm.handle.replace('@', '').trim() &&
        !nomineeForm.tiktokHandle.trim() &&
        !nomineeForm.youtubeHandle.trim())
    ) {
      return;
    }

    const instaInput = nomineeForm.handle.replace(/^@$/, '').trim();
    const resolvedInsta = normalizeSocialInput(instaInput, 'instagram');
    const resolvedTiktok = normalizeSocialInput(nomineeForm.tiktokHandle, 'tiktok');
    const resolvedYoutube = normalizeSocialInput(nomineeForm.youtubeHandle, 'youtube');
    const primary = resolvedInsta || resolvedTiktok || resolvedYoutube;
    const summaryParts: string[] = [];
    if (resolvedInsta) summaryParts.push(`Instagram: ${resolvedInsta.displayHandle}`);
    if (resolvedTiktok) summaryParts.push(`TikTok: ${resolvedTiktok.displayHandle}`);
    if (resolvedYoutube) summaryParts.push(`YouTube: ${resolvedYoutube.displayHandle}`);

    if (editingNominee) {
      updateNominee(editingNominee.id, {
        categoryId: nomineeForm.categoryId,
        name: nomineeForm.name,
        handle: primary?.displayHandle || nomineeForm.handle,
        instagramUrl: nomineeForm.instagramUrl || primary?.url || '',
        instagramHandle: instaInput || undefined,
        tiktokHandle: nomineeForm.tiktokHandle.trim() || undefined,
        youtubeHandle: nomineeForm.youtubeHandle.trim() || undefined,
        socialLinks: summaryParts.join(', ') || undefined,
        followers: nomineeForm.followers,
        bioRu: nomineeForm.bioRu,
        photoUrl: nomineeForm.photoUrl,
        isWinner2026: nomineeForm.isWinner2026,
      });
    } else {
      addNominee({
        categoryId: nomineeForm.categoryId,
        name: nomineeForm.name,
        handle: primary?.displayHandle || nomineeForm.handle,
        instagramUrl: nomineeForm.instagramUrl || primary?.url || '',
        instagramHandle: instaInput || undefined,
        tiktokHandle: nomineeForm.tiktokHandle.trim() || undefined,
        youtubeHandle: nomineeForm.youtubeHandle.trim() || undefined,
        socialLinks: summaryParts.join(', ') || undefined,
        followers: nomineeForm.followers,
        bioRu: nomineeForm.bioRu,
        bioKz: nomineeForm.bioRu,
        bioEn: nomineeForm.bioRu,
        photoUrl: nomineeForm.photoUrl,
        isWinner2026: nomineeForm.isWinner2026,
        isUserSubmitted: true,
        order: Date.now(),
      });
    }
    setIsAddingNominee(false);
    setEditingNominee(null);
  };

  const filteredNominees = nominees.filter((n) => {
    const matchCat = selectedCatFilter === 'all' || n.categoryId === selectedCatFilter;
    const matchSearch =
      n.name.toLowerCase().includes(nomineeSearch.toLowerCase()) ||
      (n.fullName || '').toLowerCase().includes(nomineeSearch.toLowerCase()) ||
      n.handle.toLowerCase().includes(nomineeSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredApps = applications.filter((a) => {
    if (appTypeFilter === 'all') return true;
    return a.type === appTypeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[90vh] rounded-2xl border border-[#D9B26A] bg-[#1C0208] text-[#F6EBDC] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#D9B26A]/30 bg-[#380511] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1C0208] border border-[#D9B26A]/60 flex items-center justify-center text-[#D9B26A]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-xl font-bold text-[#F6EBDC]">
                  Панель администратора
                </h3>
                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-[#D9B26A] text-[#1C0208] font-bold">
                  {settings.year} Год
                </span>
              </div>
              <p className="text-[11px] text-[#E8D3A7]/80">
                Управление номинациями, участниками и заявками
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="hidden md:flex items-center text-xs border border-[#D9B26A]/40 rounded p-1 bg-[#1C0208]/60">
              <span className="text-[#D9B26A] text-[10px] uppercase font-bold mr-2 ml-1">Роль:</span>
              <button
                onClick={() => setAdminRole('admin')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  adminRole === 'admin'
                    ? 'bg-[#D9B26A] text-[#1C0208]'
                    : 'text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
                }`}
              >
                Администратор
              </button>
              <button
                onClick={() => setAdminRole('content_manager')}
                className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                  adminRole === 'content_manager'
                    ? 'bg-[#D9B26A] text-[#1C0208]'
                    : 'text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
                }`}
              >
                Контент-менеджер
              </button>
            </div>

            <button
              onClick={logoutAdmin}
              title="Выйти из админ-панели"
              className="px-3 py-1.5 rounded-lg bg-[#1C0208]/70 border border-[#D9B26A]/40 text-xs text-[#E8CFA0] hover:text-[#FCE7B2] flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-lg bg-[#1C0208]/60 border border-[#D9B26A]/40 text-[#F6EBDC] hover:text-[#D9B26A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-3 border-b border-[#D9B26A]/20 bg-[#1C0208] flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('categories');
                setIsAddingNominee(false);
              }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'bg-[#380511] text-[#E8D3A7] border border-[#D9B26A]'
                  : 'text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#D9B26A]" />
              <span>Номинации ({categories.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('nominees');
                setIsAddingNominee(false);
              }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'nominees'
                  ? 'bg-[#380511] text-[#E8D3A7] border border-[#D9B26A]'
                  : 'text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
              }`}
            >
              <Award className="w-4 h-4 text-[#D9B26A]" />
              <span>Участники ({nominees.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('applications');
                setIsAddingNominee(false);
              }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'bg-[#380511] text-[#E8D3A7] border border-[#D9B26A]'
                  : 'text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
              }`}
            >
              <Users className="w-4 h-4 text-[#D9B26A]" />
              <span>Заявки ({applications.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsAddingNominee(false);
              }}
              className={`px-4 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#380511] text-[#E8D3A7] border border-[#D9B26A]'
                  : 'text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#D9B26A]" />
              <span>Параметры & Архив</span>
            </button>
          </div>

          {/* Quick Year Selector */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-[#D9B26A] text-[11px] font-semibold">Архив:</span>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setActiveYear(yr);
                  updateSettings({ year: yr });
                }}
                className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  activeYear === yr
                    ? 'bg-[#D9B26A] text-[#1C0208] border-[#D9B26A]'
                    : 'border-[#D9B26A]/30 text-[#F6EBDC]/70 hover:text-[#F6EBDC]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#1C0208]/95">
          {/* TAB 0: CATEGORIES (DELETE / RESTORE NOMINATIONS) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-luxury text-2xl font-semibold text-[#F6EBDC]">
                    Управление номинациями
                  </h4>
                  <p className="text-xs text-[#E8CFA0]/75">
                    Вы можете удалить неактуальные номинации с сайта или восстановить стандартный список.
                  </p>
                </div>

                {categories.length < 12 && (
                  <button
                    onClick={restoreCategories}
                    className="px-4 py-2 text-xs font-semibold gold-button rounded uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Восстановить все 12 номинаций</span>
                  </button>
                )}
              </div>

              {categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => {
                    const count = nominees.filter((n) => n.categoryId === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="p-4 rounded-xl border border-[#D9B26A]/35 bg-[#380511]/45 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-[#DFB567] font-semibold">
                            <span>{cat.number}</span>
                            <span>·</span>
                            <span>{cat.code}</span>
                          </div>
                          <h5 className="font-serif-luxury text-lg font-semibold text-[#F6EBDC] truncate">
                            {cat.titleRu}
                          </h5>
                          <p className="text-[11px] text-[#F6EBDC]/65 tabular-nums">
                            Участников в номинации: {count}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="px-3 py-2 rounded-lg bg-red-950/60 border border-red-400/40 text-red-200 hover:bg-red-900 hover:text-white text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
                          title="Удалить номинацию"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Удалить</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 rounded-xl border border-[#D9B26A]/30 bg-[#380511]/30 space-y-3">
                  <p className="text-sm text-[#F6EBDC]/80">Все номинации удалены.</p>
                  <button
                    onClick={restoreCategories}
                    className="px-4 py-2 text-xs font-semibold gold-button rounded uppercase cursor-pointer"
                  >
                    Восстановить 12 номинаций
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: NOMINEES MANAGEMENT */}
          {activeTab === 'nominees' && (
            <div className="space-y-6">
              {isAddingNominee ? (
                <div className="p-6 rounded-2xl border border-[#D9B26A] bg-[#380511]/40 max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D9B26A]/20">
                    <h4 className="font-serif-luxury text-xl font-bold text-[#F6EBDC]">
                      {editingNominee ? 'Редактировать участника' : 'Добавить нового участника'}
                    </h4>
                    <button
                      onClick={() => setIsAddingNominee(false)}
                      className="text-xs text-[#E8D3A7] hover:underline cursor-pointer"
                    >
                      Отмена
                    </button>
                  </div>

                  <form onSubmit={handleSaveNominee} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                        Категория номинации *
                      </label>
                      <select
                        value={nomineeForm.categoryId}
                        onChange={(e) =>
                          setNomineeForm({ ...nomineeForm, categoryId: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.number} {c.code} — {c.titleRu}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                          Имя и фамилия *
                        </label>
                        <input
                          type="text"
                          required
                          value={nomineeForm.name}
                          onChange={(e) =>
                            setNomineeForm({ ...nomineeForm, name: e.target.value })
                          }
                          placeholder="Имя и фамилия"
                          className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                          Instagram (ник или ссылка)
                        </label>
                        <input
                          type="text"
                          value={nomineeForm.handle}
                          onChange={(e) =>
                            setNomineeForm({ ...nomineeForm, handle: e.target.value })
                          }
                          placeholder="@username"
                          className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                          TikTok (ник или ссылка)
                        </label>
                        <input
                          type="text"
                          value={nomineeForm.tiktokHandle}
                          onChange={(e) =>
                            setNomineeForm({ ...nomineeForm, tiktokHandle: e.target.value })
                          }
                          placeholder="@username"
                          className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                          YouTube (канал или ссылка)
                        </label>
                        <input
                          type="text"
                          value={nomineeForm.youtubeHandle}
                          onChange={(e) =>
                            setNomineeForm({ ...nomineeForm, youtubeHandle: e.target.value })
                          }
                          placeholder="@channel"
                          className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                          Статус / Аудитория
                        </label>
                        <input
                          type="text"
                          value={nomineeForm.followers}
                          onChange={(e) =>
                            setNomineeForm({ ...nomineeForm, followers: e.target.value })
                          }
                          placeholder="Участник 2026"
                          className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                          URL фотографии
                        </label>
                        <input
                          type="text"
                          value={nomineeForm.photoUrl}
                          onChange={(e) =>
                            setNomineeForm({ ...nomineeForm, photoUrl: e.target.value })
                          }
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                        Краткая биография и достижения
                      </label>
                      <textarea
                        rows={3}
                        value={nomineeForm.bioRu}
                        onChange={(e) =>
                          setNomineeForm({ ...nomineeForm, bioRu: e.target.value })
                        }
                        placeholder="Краткое описание вклада в блогосферу..."
                        className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="winnerCheck"
                        checked={nomineeForm.isWinner2026}
                        onChange={(e) =>
                          setNomineeForm({ ...nomineeForm, isWinner2026: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#D9B26A]"
                      />
                      <label htmlFor="winnerCheck" className="text-xs font-semibold text-[#E8D3A7]">
                        Отметить как Победителя года (WINNER 2026)
                      </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider gold-button rounded cursor-pointer"
                      >
                        {editingNominee ? 'Сохранить изменения' : 'Добавить в список'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingNominee(false)}
                        className="px-4 py-2.5 text-xs border border-[#D9B26A]/40 rounded cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative min-w-[220px]">
                        <Search className="w-3.5 h-3.5 text-[#D9B26A] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={nomineeSearch}
                          onChange={(e) => setNomineeSearch(e.target.value)}
                          placeholder="Поиск по имени или @handle..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#380511]/30 border border-[#D9B26A]/30 rounded text-[#F6EBDC]"
                        />
                      </div>

                      <select
                        value={selectedCatFilter}
                        onChange={(e) => setSelectedCatFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-[#380511]/30 border border-[#D9B26A]/30 rounded text-[#F6EBDC]"
                      >
                        <option value="all">Все номинации</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.number} {c.titleRu}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleOpenAdd}
                      className="px-4 py-2 text-xs font-semibold tracking-wider gold-button rounded uppercase flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Добавить участника</span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-[#D9B26A]/30 overflow-x-auto bg-[#380511]/20">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#380511]/60 text-[#D9B26A] uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3">Участник</th>
                          <th className="p-3">Номинация</th>
                          <th className="p-3">Соцсети / Статус</th>
                          <th className="p-3">Статус 2026</th>
                          <th className="p-3 text-right">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9B26A]/15">
                        {filteredNominees.map((nom) => (
                          <tr key={nom.id} className="hover:bg-[#380511]/40 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={nom.photoUrl}
                                  alt={nom.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-[#D9B26A]/40 shrink-0"
                                />
                                <div>
                                  <p className="font-semibold text-[#F6EBDC]">{nom.name}</p>
                                  {nom.fullName && (
                                    <p className="text-[10px] text-[#E8CFA0]/75">{nom.fullName}</p>
                                  )}
                                  <a
                                    href={nom.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-[#D9B26A] hover:underline"
                                  >
                                    {nom.handle}
                                  </a>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-[#F6EBDC]/80">
                              {categories.find((c) => c.id === nom.categoryId)?.titleRu ||
                                `${nom.categoryId} (удалена)`}
                            </td>
                            <td className="p-3 text-[#E8D3A7] max-w-[220px]">
                              <div className="flex flex-wrap gap-1.5">
                                {getNomineeSocialLinks(nom).map((link) => (
                                  <a
                                    key={`adm-${nom.id}-${link.platform}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] px-2 py-0.5 rounded bg-[#1C0208]/70 border border-[#D9B26A]/35 text-[#FCE7B2] hover:underline"
                                  >
                                    {link.label}: {link.displayHandle}
                                  </a>
                                ))}
                              </div>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => toggleNomineeWinner(nom.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                                  nom.isWinner2026
                                    ? 'bg-[#D9B26A] text-[#1C0208]'
                                    : 'bg-[#1C0208]/60 text-[#F6EBDC]/50 border border-[#D9B26A]/30 hover:border-[#D9B26A]'
                                }`}
                              >
                                <Award className="w-3 h-3" />
                                <span>{nom.isWinner2026 ? 'WINNER 2026' : 'Участник'}</span>
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEdit(nom)}
                                  className="p-1.5 text-[#D9B26A] hover:text-[#E8D3A7] cursor-pointer"
                                  title="Редактировать"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteNominee(nom.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                                  title="Удалить"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAppTypeFilter('all')}
                    className={`px-3 py-1.5 text-xs rounded border cursor-pointer ${
                      appTypeFilter === 'all'
                        ? 'bg-[#D9B26A] text-[#1C0208] border-[#D9B26A]'
                        : 'border-[#D9B26A]/30 text-[#F6EBDC]/70'
                    }`}
                  >
                    Все ({applications.length})
                  </button>
                  <button
                    onClick={() => setAppTypeFilter('partner')}
                    className={`px-3 py-1.5 text-xs rounded border cursor-pointer ${
                      appTypeFilter === 'partner'
                        ? 'bg-[#D9B26A] text-[#1C0208] border-[#D9B26A]'
                        : 'border-[#D9B26A]/30 text-[#F6EBDC]/70'
                    }`}
                  >
                    Партнёры
                  </button>
                  <button
                    onClick={() => setAppTypeFilter('participant')}
                    className={`px-3 py-1.5 text-xs rounded border cursor-pointer ${
                      appTypeFilter === 'participant'
                        ? 'bg-[#D9B26A] text-[#1C0208] border-[#D9B26A]'
                        : 'border-[#D9B26A]/30 text-[#F6EBDC]/70'
                    }`}
                  >
                    Участники
                  </button>
                </div>

                <button
                  onClick={exportApplicationsToCsv}
                  className="px-4 py-2 text-xs font-semibold gold-button rounded uppercase flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Экспорт заявок в CSV</span>
                </button>
              </div>

              {filteredApps.length > 0 ? (
                <div className="space-y-3">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-xl border border-[#D9B26A]/30 bg-[#380511]/30 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                              app.type === 'partner'
                                ? 'bg-amber-500 text-black'
                                : 'bg-rose-900 text-rose-100'
                            }`}
                          >
                            {app.type === 'partner' ? 'Партнёр' : 'Участник'}
                          </span>
                          <h4 className="font-serif-luxury text-lg font-bold text-[#F6EBDC]">
                            {app.fullName} {app.companyName && `· ${app.companyName}`}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#F6EBDC]/50 tabular-nums">
                            {app.createdAt}
                          </span>
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateApplicationStatus(
                                app.id,
                                e.target.value as Application['status']
                              )
                            }
                            className="px-2.5 py-1 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#E8D3A7]"
                          >
                            <option value="new">Новая</option>
                            <option value="review">На рассмотрении</option>
                            <option value="confirmed">Подтверждена</option>
                            <option value="paid">Оплачена</option>
                            <option value="declined">Отклонена</option>
                          </select>

                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                            title="Удалить заявку"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#F6EBDC]/80">
                        <div>
                          <strong className="text-[#D9B26A]">Пакет:</strong>{' '}
                          {app.packet || app.format || 'Стандарт'}
                        </div>
                        <div>
                          <strong className="text-[#D9B26A]">Телефон:</strong> {app.phone}
                        </div>
                        <div>
                          <strong className="text-[#D9B26A]">Instagram:</strong> {app.instagram}
                        </div>
                      </div>

                      {app.comment && (
                        <p className="text-xs text-[#F6EBDC]/70 italic bg-[#1C0208]/50 p-2.5 rounded">
                          «{app.comment}»
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-[#F6EBDC]/60">
                  Заявок в этой категории пока нет.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS & ARCHIVE */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6 text-left">
              <div className="p-6 rounded-2xl border border-[#D9B26A]/30 bg-[#380511]/30 space-y-4">
                <h4 className="font-serif-luxury text-xl font-bold text-[#F6EBDC]">
                  Параметры события {settings.year} года
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                      Дата проведения (RU)
                    </label>
                    <input
                      type="text"
                      value={settings.dateRu}
                      onChange={(e) => updateSettings({ dateRu: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                      Город проведения
                    </label>
                    <input
                      type="text"
                      value={settings.cityRu}
                      onChange={(e) => updateSettings({ cityRu: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-[#D9B26A] font-semibold mb-1">
                    Описание премии
                  </label>
                  <input
                    type="text"
                    value={settings.sloganRu}
                    onChange={(e) => updateSettings({ sloganRu: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#1C0208] border border-[#D9B26A]/40 rounded text-[#F6EBDC]"
                  />
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-red-500/30 bg-red-950/20 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-200">
                    Сбросить к первоначальным данным
                  </h4>
                  <p className="text-xs text-red-300/70">
                    Восстанавливает начальный список 12 номинаций и очищает сохранённые заявки.
                  </p>
                </div>
                <button
                  onClick={resetToDefaultData}
                  className="px-4 py-2 rounded bg-red-900/60 hover:bg-red-800 text-red-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сбросить</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
