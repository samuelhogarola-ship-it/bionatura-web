import { describe, expect, it } from 'vitest';
import { alternateLinks, pathFor, routes } from '../../src/i18n/config';
import { pages } from '../../src/i18n/pages';
import { ui } from '../../src/i18n/ui';

describe('localized routes', () => {
  it('builds translated catalog paths', () => {
    expect(pathFor('es', 'catalog')).toBe('/es/catalogo/');
    expect(pathFor('en', 'catalog')).toBe('/en/catalog/');
    expect(pathFor('fi', 'catalog')).toBe('/fi/tuotteet/');
    expect(pathFor('da', 'catalog')).toBe('/da/katalog/');
  });

  it('returns four alternates plus x-default', () => {
    expect(alternateLinks('contact')).toHaveLength(5);
  });

  it('does not publish a standalone how-it-works route', () => {
    expect('howItWorks' in routes).toBe(false);
  });
});

describe('UI copy', () => {
  it('has the same UI keys in every locale', () => {
    const baseline = Object.keys(ui.es).sort();
    for (const locale of ['en', 'fi', 'da'] as const) {
      expect(Object.keys(ui[locale]).sort()).toEqual(baseline);
    }
  });
});

describe('page CTAs', () => {
  it('links Spanish About to Contact and Contact to Catalog', () => {
    expect(pages.about.es.ctaPage).toBe('contact');
    expect(pages.contact.es.ctaPage).toBe('catalog');
  });

  it('uses the same CTA destination for every locale of a page', () => {
    for (const page of Object.values(pages)) {
      const destination = page.es.ctaPage;
      for (const locale of ['en', 'fi', 'da'] as const) {
        expect(page[locale].ctaPage).toBe(destination);
      }
    }
  });
});
