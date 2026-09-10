import type { Locale } from '../config';

export interface PageCopy {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
  cta: string;
}

export type LocalizedPageCopy = Record<Locale, PageCopy>;
