import { describe, expect, it } from 'vitest';
import { alternateLinks, pathFor } from '../../src/i18n/config';
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
});

describe('UI copy', () => {
  it('has the same UI keys in every locale', () => {
    const baseline = Object.keys(ui.es).sort();
    for (const locale of ['en', 'fi', 'da'] as const) {
      expect(Object.keys(ui[locale]).sort()).toEqual(baseline);
    }
  });
});
