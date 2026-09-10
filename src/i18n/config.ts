import { ui } from './ui';

export const LOCALES = ['es', 'en', 'fi', 'da'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const routes = {
  home: { es: '', en: '', fi: '', da: '' },
  catalog: { es: 'catalogo', en: 'catalog', fi: 'tuotteet', da: 'katalog' },
  gallery: { es: 'galeria', en: 'gallery', fi: 'galleria', da: 'galleri' },
  about: { es: 'nosotros', en: 'about', fi: 'meista', da: 'om-os' },
  contact: { es: 'contacto', en: 'contact', fi: 'yhteystiedot', da: 'kontakt' },
  legalNotice: { es: 'aviso-legal', en: 'legal-notice', fi: 'oikeudellinen-huomautus', da: 'juridisk-meddelelse' },
  privacy: { es: 'privacidad', en: 'privacy', fi: 'tietosuoja', da: 'privatliv' },
  cookies: { es: 'cookies', en: 'cookies', fi: 'evasteet', da: 'cookies' },
} as const;

export type PageKey = keyof typeof routes;
export const PAGE_KEYS = Object.keys(routes) as PageKey[];
export type UiKey = keyof typeof ui.es;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function pathFor(locale: Locale, page: PageKey): string {
  const slug = routes[page][locale];
  return slug === '' ? `/${locale}/` : `/${locale}/${slug}/`;
}

export function alternateLinks(page: PageKey) {
  return [
    ...LOCALES.map((locale) => ({ locale, href: pathFor(locale, page) })),
    { locale: 'x-default', href: pathFor(DEFAULT_LOCALE, page) },
  ];
}

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key];
}
