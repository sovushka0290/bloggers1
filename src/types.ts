export type Language = 'ru' | 'kz' | 'en';

export type AdminRole = 'admin' | 'content_manager';

export interface Nominee {
  id: string;
  categoryId: string;
  name: string; // Display name or Имя
  fullName?: string; // ФИО
  firstName?: string; // Имя
  pseudonym?: string; // Псевдоним
  handle: string; // Primary handle e.g. @username
  instagramUrl: string; // Primary social URL
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeHandle?: string;
  socialLinks?: string; // Свои соцсети (Instagram, TikTok, YouTube и др.)
  followers: string;
  bioRu: string;
  bioKz: string;
  bioEn: string;
  photoUrl: string;
  isWinner2026: boolean;
  isUserSubmitted?: boolean;
  order: number;
}

export interface Category {
  id: string;
  number: string; // e.g. "01", "02"
  code: string; // e.g. "MOMS", "LIFESTYLE"
  titleRu: string;
  titleKz: string;
  titleEn: string;
  subtitleRu: string;
  subtitleKz: string;
  subtitleEn: string;
  descriptionRu: string;
  descriptionKz: string;
  descriptionEn: string;
  criteriaRu: string[];
}

export interface Partner {
  id: string;
  name: string;
  tier: 'general' | 'official' | 'information' | 'special';
  tierLabelRu: string;
  descriptionRu: string;
  logoUrl?: string;
  website?: string;
  instagram?: string;
}

export interface Application {
  id: string;
  type: 'participant' | 'partner';
  fullName: string;
  companyName?: string;
  instagram: string;
  phone: string;
  email: string;
  packet?: string;
  format?: string;
  categoryInterest?: string;
  comment: string;
  status: 'new' | 'review' | 'confirmed' | 'paid' | 'declined';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  titleRu: string;
  category: 'carpet' | 'awards' | 'preparation' | 'atmosphere';
  categoryLabelRu: string;
  imageUrl: string;
  descriptionRu: string;
}

export interface EventSettings {
  year: number;
  dateRu: string;
  dateKz: string;
  dateEn: string;
  cityRu: string;
  cityKz: string;
  cityEn: string;
  venueRu: string;
  dressCodeRu: string;
  sloganRu: string;
  sloganKz: string;
  sloganEn: string;
  ticketPriceKzt: number;
  generalSponsorPriceKzt: number;
  officialSponsorPriceKzt: number;
}
