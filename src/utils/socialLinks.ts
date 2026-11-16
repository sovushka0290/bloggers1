import { Nominee } from '../types';

export type SocialPlatform = 'instagram' | 'tiktok' | 'youtube';

export interface ResolvedSocialLink {
  platform: SocialPlatform;
  label: string;
  displayHandle: string;
  url: string;
}

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '');
}

export function normalizeSocialInput(
  raw: string | undefined,
  platform: SocialPlatform
): ResolvedSocialLink | null {
  const input = (raw || '').trim();
  if (!input) return null;

  const platformLabel =
    platform === 'instagram' ? 'Instagram' : platform === 'tiktok' ? 'TikTok' : 'YouTube';

  // Case 1: Full URL or domain without scheme
  const looksLikeUrl =
    /^https?:\/\//i.test(input) ||
    /(instagram\.com|instagr\.am|tiktok\.com|youtube\.com|youtu\.be)\//i.test(input);

  if (looksLikeUrl) {
    const normalizedUrl = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    let displayHandle = input;
    try {
      const parsed = new URL(normalizedUrl);
      const segments = stripTrailingSlashes(parsed.pathname)
        .split('/')
        .filter(Boolean);
      const last = segments[segments.length - 1] || '';
      if (last) {
        displayHandle = last.startsWith('@') ? last : `@${last}`;
      } else {
        displayHandle = parsed.hostname.replace(/^www\./, '');
      }
    } catch {
      displayHandle = input;
    }

    return {
      platform,
      label: platformLabel,
      displayHandle,
      url: normalizedUrl,
    };
  }

  // Case 2: Handle or channel name (with or without leading @)
  const cleanHandle = input.replace(/^@+/, '').replace(/\s+/g, '');
  if (!cleanHandle) return null;

  const displayHandle = `@${cleanHandle}`;

  if (platform === 'instagram') {
    return {
      platform,
      label: platformLabel,
      displayHandle,
      url: `https://www.instagram.com/${cleanHandle}/`,
    };
  }

  if (platform === 'tiktok') {
    return {
      platform,
      label: platformLabel,
      displayHandle,
      url: `https://www.tiktok.com/@${cleanHandle}`,
    };
  }

  return {
    platform,
    label: platformLabel,
    displayHandle,
    url: `https://www.youtube.com/@${cleanHandle}`,
  };
}

export function getNomineeSocialLinks(nominee: Nominee): ResolvedSocialLink[] {
  const links: ResolvedSocialLink[] = [];
  const seen = new Set<string>();

  const pushLink = (link: ResolvedSocialLink | null) => {
    if (!link) return;
    const key = `${link.platform}:${link.url.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push(link);
  };

  pushLink(normalizeSocialInput(nominee.instagramHandle, 'instagram'));
  pushLink(normalizeSocialInput(nominee.tiktokHandle, 'tiktok'));
  pushLink(normalizeSocialInput(nominee.youtubeHandle, 'youtube'));

  // Fallback for entries created via legacy socialLinks or AdminModal
  if (links.length === 0) {
    if (nominee.socialLinks) {
      const parts = nominee.socialLinks
        .split(/[\n,;]+/)
        .map((p) => p.trim())
        .filter(Boolean);

      for (const part of parts) {
        const lower = part.toLowerCase();
        const cleanedValue = part.replace(/^(instagram|insta|инста|tiktok|тикток|youtube|ютуб)\s*:\s*/i, '').trim();
        if (!cleanedValue) continue;

        if (lower.includes('tiktok') || lower.includes('тикток')) {
          pushLink(normalizeSocialInput(cleanedValue, 'tiktok'));
        } else if (lower.includes('youtube') || lower.includes('youtu.be') || lower.includes('ютуб')) {
          pushLink(normalizeSocialInput(cleanedValue, 'youtube'));
        } else if (lower.includes('instagram') || lower.includes('инста') || cleanedValue.startsWith('@')) {
          pushLink(normalizeSocialInput(cleanedValue, 'instagram'));
        }
      }
    }

    if (links.length === 0 && (nominee.instagramUrl || nominee.handle)) {
      const urlLower = (nominee.instagramUrl || '').toLowerCase();
      const platform: SocialPlatform = urlLower.includes('tiktok')
        ? 'tiktok'
        : urlLower.includes('youtube') || urlLower.includes('youtu.be')
        ? 'youtube'
        : 'instagram';
      pushLink(normalizeSocialInput(nominee.instagramUrl || nominee.handle, platform));
    }
  }

  return links;
}
