import type { Locale } from '../config';
import type { PageKey } from '../config';

export interface PageCopy {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  cta: string;
  ctaPage: PageKey;
}

export type LocalizedPageCopy = Record<Locale, PageCopy>;
