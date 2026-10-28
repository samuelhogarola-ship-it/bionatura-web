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
  it('targets products bio in Fuengirola from the home page', () => {
    expect(pages.home.es.title).toBe('Productos bio en Fuengirola a domicilio | Bionatura');
    expect(pages.home.es.description).toBe(
      'Compra productos bio en Fuengirola: fruta y verdura biológica de temporada, recogida acordada y reparto a domicilio en Fuengirola y Torreblanca.',
    );
    expect(pages.home.es.h1).toBe('Productos bio en Fuengirola');
    expect(pages.home.es.intro).toMatch(/fruta y verdura biológica/i);
  });

  it('presents the catalog as organic fruit and vegetable home delivery in Fuengirola', () => {
    expect(pages.catalog.es.title).toBe('Catálogo de productos bio en Fuengirola | Bionatura');
    expect(pages.catalog.es.description).toBe(
      'Catálogo completo de fruta y verdura ecológica y biológica en Fuengirola y Torreblanca. Consulta disponibilidad, precios, recogida y reparto por WhatsApp.',
    );
    expect(pages.catalog.es.h1).toBe('Catálogo de productos bio y ecológicos en Fuengirola');
  });

  it('explains delivery and collection consistently in contact and WhatsApp copy', () => {
    expect(pages.contact.es.description).toContain('reparto a domicilio en Fuengirola y Torreblanca');
    expect(pages.contact.es.intro).toContain('recogida o reparto a domicilio');
    expect(ui.es.whatsappPickup).toContain('recogida o reparto a domicilio');
  });

  it('includes Carvajal in About SEO without historical Covid copy', () => {
    expect(pages.about.es.title).toMatch(/productos bio.*Fuengirola/i);
    expect(pages.about.es.description).toContain('Carvajal');
    expect(JSON.stringify(pages.about.es)).not.toMatch(/covid/i);
  });
});
