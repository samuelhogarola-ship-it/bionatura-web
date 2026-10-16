import { describe, expect, it } from 'vitest';
import { alternateLinks, editorialIndexPath, pathFor, routes } from '../../src/i18n/config';
import { pages } from '../../src/i18n/pages';
import { ui } from '../../src/i18n/ui';

describe('localized routes', () => {
  it('builds translated editorial index paths', () => {
    expect(editorialIndexPath('es')).toBe('/es/huerto-recetas/');
    expect(editorialIndexPath('fi')).toBe('/fi/puutarha-reseptit/');
  });

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

  it('provides a localized editorial navigation label in every locale', () => {
    expect([
      ui.es.navEditorial,
      ui.en.navEditorial,
      ui.fi.navEditorial,
      ui.da.navEditorial,
    ]).toEqual([
      'Huerto y recetas',
      'Garden & recipes',
      'Puutarha ja reseptit',
      'Have og opskrifter',
    ]);
  });
});

describe('page CTAs', () => {
  it('links Spanish About and Contact to Catalog', () => {
    expect(pages.about.es.ctaPage).toBe('catalog');
    expect(pages.about.es.cta).toBe('Pide ahora');
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

describe('Spanish delivery SEO', () => {
  it('presents the catalog as organic fruit and vegetable home delivery in Fuengirola', () => {
    expect(pages.catalog.es.title).toBe('Fruta y verdura biológica a domicilio en Fuengirola | Bionatura');
    expect(pages.catalog.es.description).toBe(
      'Consulta fruta, verdura y productos biológicos con reparto a domicilio en Fuengirola y Torreblanca. Envío gratuito desde 30 € y disponibilidad por WhatsApp.',
    );
    expect(pages.catalog.es.h1).toBe('Fruta, verdura y productos biológicos en Fuengirola');
  });

  it('explains delivery and collection consistently in contact and WhatsApp copy', () => {
    expect(pages.contact.es.description).toContain('reparto a domicilio en Fuengirola y Torreblanca');
    expect(pages.contact.es.intro).toContain('recogida o reparto a domicilio');
    expect(ui.es.whatsappPickup).toContain('recogida o reparto a domicilio');
  });
});
