import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bionatura.es',
  output: 'static',
  integrations: [sitemap({ filter: (page) => page !== 'https://bionatura.es/' })],
});
