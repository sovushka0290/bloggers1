import goldenStatue from './images/golden_award_statue_1794478869737.jpg';

export const MEDIA_ASSETS = {
  goldenStatue,
};

export function resolveMediaUrl(url: string): string {
  if (!url || url.startsWith('/src/assets/images/')) {
    return goldenStatue;
  }
  return url;
}
