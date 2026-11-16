import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Category,
  Nominee,
  Partner,
  GalleryItem,
  EventSettings,
  Application,
  Language,
  AdminRole,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_NOMINEES,
  INITIAL_PARTNERS,
  INITIAL_GALLERY,
  INITIAL_SETTINGS,
  INITIAL_APPLICATIONS,
} from '../data/initialData';
import { resolveMediaUrl } from '../assets/media';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeYear: number;
  setActiveYear: (year: number) => void;
  availableYears: number[];
  settings: EventSettings;
  updateSettings: (newSettings: Partial<EventSettings>) => void;
  categories: Category[];
  deleteCategory: (id: string) => void;
  restoreCategories: () => void;
  nominees: Nominee[];
  addNominee: (nominee: Omit<Nominee, 'id'>) => void;
  updateNominee: (id: string, updated: Partial<Nominee>) => void;
  deleteNominee: (id: string) => void;
  toggleNomineeWinner: (id: string) => void;
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id'>) => void;
  deletePartner: (id: string) => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  applications: Application[];
  submitApplication: (app: Omit<Application, 'id' | 'createdAt' | 'status'>) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  deleteApplication: (id: string) => void;
  exportApplicationsToCsv: () => void;
  resetToDefaultData: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (login: string, password: string) => boolean;
  logoutAdmin: () => void;
  adminRole: AdminRole;
  setAdminRole: (role: AdminRole) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_LOGIN = 'admin';
const ADMIN_PASS = 'awards2026';

function sanitizeGallery(items: GalleryItem[]): GalleryItem[] {
  return items.map((item) => ({
    ...item,
    imageUrl: resolveMediaUrl(item.imageUrl),
  }));
}

const LEGACY_STORAGE_KEYS = [
  'bak_settings',
  'bak_categories',
  'bak_nominees',
  'bak_partners',
  'bak_gallery',
  'bak_applications',
] as const;

const STORAGE_KEYS = {
  settings: 'bak_v2_settings',
  categories: 'bak_v2_categories',
  nominees: 'bak_v2_nominees',
  partners: 'bak_v2_partners',
  gallery: 'bak_v2_gallery',
  applications: 'bak_v2_applications',
} as const;

function sanitizeNominees(items: Nominee[]): Nominee[] {
  return items
    .filter((item) => Boolean(item) && item.isUserSubmitted === true)
    .map((item) => ({
      ...item,
      photoUrl: resolveMediaUrl(item.photoUrl),
    }));
}

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');
  const [activeYear, setActiveYear] = useState<number>(2026);
  const availableYears = [2026, 2027, 2028];

  const [settings, setSettings] = useState<EventSettings>(() =>
    safeParseJson(localStorage.getItem(STORAGE_KEYS.settings), INITIAL_SETTINGS)
  );

  const [categories, setCategories] = useState<Category[]>(() =>
    safeParseJson(localStorage.getItem(STORAGE_KEYS.categories), INITIAL_CATEGORIES)
  );

  const [nominees, setNominees] = useState<Nominee[]>(() =>
    sanitizeNominees(safeParseJson(localStorage.getItem(STORAGE_KEYS.nominees), INITIAL_NOMINEES))
  );

  const [partners, setPartners] = useState<Partner[]>(() =>
    safeParseJson(localStorage.getItem(STORAGE_KEYS.partners), INITIAL_PARTNERS)
  );

  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    sanitizeGallery(safeParseJson(localStorage.getItem(STORAGE_KEYS.gallery), INITIAL_GALLERY))
  );

  const [applications, setApplications] = useState<Application[]>(() =>
    safeParseJson(localStorage.getItem(STORAGE_KEYS.applications), INITIAL_APPLICATIONS)
  );

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bak_admin_auth') === 'true';
  });
  const [adminRole, setAdminRole] = useState<AdminRole>('admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const syncPatchToServer = useCallback(async (patch: Record<string, unknown>) => {
    try {
      await fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch {
      // Keep local state functional even if offline
    }
  }, []);

  // Purge legacy v1 localStorage keys that previously held pre-seeded demo/fake data
  useEffect(() => {
    try {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        localStorage.removeItem(legacyKey);
      }
    } catch {}
  }, []);

  // Hydrate shared state from backend on mount so all visitors on the public link see consistent updates
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/state');
        if (!res.ok) return;
        const payload = (await res.json()) as {
          ok?: boolean;
          data?: {
            settings?: EventSettings;
            categories?: Category[];
            nominees?: Nominee[];
            partners?: Partner[];
            gallery?: GalleryItem[];
            applications?: Application[];
          };
        };
        if (!active || !payload?.ok || !payload.data) return;

        const serverData = payload.data;
        if (serverData.settings) setSettings(serverData.settings);
        if (Array.isArray(serverData.categories)) setCategories(serverData.categories);
        if (Array.isArray(serverData.nominees)) {
          const cleanNominees = sanitizeNominees(serverData.nominees);
          setNominees(cleanNominees);
          if (cleanNominees.length !== serverData.nominees.length) {
            void syncPatchToServer({ nominees: cleanNominees });
          }
        }
        if (Array.isArray(serverData.partners)) setPartners(serverData.partners);
        if (Array.isArray(serverData.gallery)) setGallery(sanitizeGallery(serverData.gallery));
        if (Array.isArray(serverData.applications)) setApplications(serverData.applications);
      } catch {
        // Fallback silently to localStorage/initial data
      }
    })();
    return () => {
      active = false;
    };
  }, [syncPatchToServer]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.nominees, JSON.stringify(nominees));
    } catch {}
  }, [nominees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.partners, JSON.stringify(partners));
    } catch {}
  }, [partners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(gallery));
    } catch {}
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  const loginAdmin = (login: string, password: string): boolean => {
    if (login.trim() === ADMIN_LOGIN && password === ADMIN_PASS) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('bak_admin_auth', 'true');
      showToast('Вы вошли в панель администратора');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('bak_admin_auth');
    setIsAdminOpen(false);
    showToast('Вы вышли из панели администратора');
  };

  const updateSettings = (newSettings: Partial<EventSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...newSettings };
      void syncPatchToServer({ settings: next });
      return next;
    });
    showToast('Настройки события успешно обновлены');
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      void syncPatchToServer({ categories: next });
      return next;
    });
    showToast(`Номинация «${cat?.titleRu || id}» удалена`);
  };

  const restoreCategories = () => {
    setCategories(INITIAL_CATEGORIES);
    void syncPatchToServer({ categories: INITIAL_CATEGORIES });
    showToast('Все 12 номинаций восстановлены');
  };

  const addNominee = (nomineeData: Omit<Nominee, 'id'>) => {
    const newNominee: Nominee = {
      ...nomineeData,
      isUserSubmitted: true,
      photoUrl: resolveMediaUrl(nomineeData.photoUrl),
      id: `nom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setNominees((prev) => [newNominee, ...prev.filter((item) => item.id !== newNominee.id)]);
    void (async () => {
      try {
        const res = await fetch('/api/nominees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nominee: newNominee,
            baseNominees: INITIAL_NOMINEES,
          }),
        });
        if (!res.ok) return;
        const payload = (await res.json()) as { ok?: boolean; nominees?: Nominee[] };
        if (payload?.ok && Array.isArray(payload.nominees)) {
          setNominees(sanitizeNominees(payload.nominees));
        }
      } catch {
        // Keep local state if offline
      }
    })();
    showToast(`Участник «${newNominee.name}» добавлен в номинацию!`);
  };

  const updateNominee = (id: string, updated: Partial<Nominee>) => {
    setNominees((prev) => {
      const next = prev.map((nom) => (nom.id === id ? { ...nom, ...updated } : nom));
      void syncPatchToServer({ nominees: next });
      return next;
    });
    showToast('Данные участника сохранены');
  };

  const deleteNominee = (id: string) => {
    setNominees((prev) => {
      const next = prev.filter((nom) => nom.id !== id);
      void syncPatchToServer({ nominees: next });
      return next;
    });
    showToast('Участник удалён');
  };

  const toggleNomineeWinner = (id: string) => {
    setNominees((prev) => {
      const next = prev.map((nom) =>
        nom.id === id ? { ...nom, isWinner2026: !nom.isWinner2026 } : nom
      );
      void syncPatchToServer({ nominees: next });
      return next;
    });
    showToast('Статус победителя WINNER 2026 обновлён');
  };

  const addPartner = (partnerData: Omit<Partner, 'id'>) => {
    const newPartner: Partner = {
      ...partnerData,
      id: `part-${Date.now()}`,
    };
    setPartners((prev) => {
      const next = [...prev, newPartner];
      void syncPatchToServer({ partners: next });
      return next;
    });
    showToast(`Партнёр «${newPartner.name}» добавлен`);
  };

  const deletePartner = (id: string) => {
    setPartners((prev) => {
      const next = prev.filter((p) => p.id !== id);
      void syncPatchToServer({ partners: next });
      return next;
    });
    showToast('Партнёр удалён');
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      imageUrl: resolveMediaUrl(itemData.imageUrl),
      id: `gal-${Date.now()}`,
    };
    setGallery((prev) => {
      const next = [newItem, ...prev];
      void syncPatchToServer({ gallery: next });
      return next;
    });
    showToast('Фотография добавлена в галерею');
  };

  const submitApplication = (appData: Omit<Application, 'id' | 'createdAt' | 'status'>) => {
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'new',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setApplications((prev) => [newApp, ...prev.filter((item) => item.id !== newApp.id)]);
    void (async () => {
      try {
        const res = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            application: newApp,
            baseApplications: INITIAL_APPLICATIONS,
          }),
        });
        if (!res.ok) return;
        const payload = (await res.json()) as { ok?: boolean; applications?: Application[] };
        if (payload?.ok && Array.isArray(payload.applications)) {
          setApplications(payload.applications);
        }
      } catch {
        // Keep local state if offline
      }
    })();
    showToast(
      appData.type === 'partner'
        ? 'Заявка на партнёрство успешно отправлена! Оргкомитет свяжется с вами.'
        : 'Заявка на участие принята! Ждём вас на красной дорожке!'
    );
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setApplications((prev) => {
      const next = prev.map((app) => (app.id === id ? { ...app, status } : app));
      void syncPatchToServer({ applications: next });
      return next;
    });
    showToast(`Статус заявки изменён на: ${status}`);
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => {
      const next = prev.filter((app) => app.id !== id);
      void syncPatchToServer({ applications: next });
      return next;
    });
    showToast('Заявка удалена');
  };

  const exportApplicationsToCsv = () => {
    if (applications.length === 0) {
      showToast('Нет заявок для экспорта');
      return;
    }
    const headers = [
      'ID',
      'Тип',
      'ФИО',
      'Компания',
      'Instagram',
      'Телефон',
      'Email',
      'Пакет/Формат',
      'Статус',
      'Дата',
      'Комментарий',
    ];
    const rows = applications.map((a) => [
      a.id,
      a.type === 'partner' ? 'Партнёр' : 'Участник',
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${(a.companyName || '-').replace(/"/g, '""')}"`,
      a.instagram,
      a.phone,
      a.email,
      `"${(a.packet || a.format || '-').replace(/"/g, '""')}"`,
      a.status,
      a.createdAt,
      `"${a.comment.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `bloggers_awards_applications_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Файл CSV успешно сформирован');
  };

  const resetToDefaultData = () => {
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(legacyKey);
    }
    for (const key of Object.values(STORAGE_KEYS)) {
      localStorage.removeItem(key);
    }

    setSettings(INITIAL_SETTINGS);
    setCategories(INITIAL_CATEGORIES);
    setNominees(INITIAL_NOMINEES);
    setPartners(INITIAL_PARTNERS);
    setGallery(INITIAL_GALLERY);
    setApplications(INITIAL_APPLICATIONS);

    void fetch('/api/state', { method: 'DELETE' }).catch(() => {});

    showToast('Данные успешно сброшены к эталонным настройкам');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeYear,
        setActiveYear,
        availableYears,
        settings,
        updateSettings,
        categories,
        deleteCategory,
        restoreCategories,
        nominees,
        addNominee,
        updateNominee,
        deleteNominee,
        toggleNomineeWinner,
        partners,
        addPartner,
        deletePartner,
        gallery,
        addGalleryItem,
        applications,
        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        exportApplicationsToCsv,
        resetToDefaultData,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        adminRole,
        setAdminRole,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
