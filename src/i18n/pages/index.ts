import type { PageKey } from '../config';
import { about } from './about';
import { catalog } from './catalog';
import { contact } from './contact';
import { gallery } from './gallery';
import { home } from './home';
import { cookies, legalNotice, privacy } from './legal';

export const pages = {
  home,
  catalog,
  gallery,
  about,
  contact,
  legalNotice,
  privacy,
  cookies,
} satisfies Record<PageKey, typeof home>;
