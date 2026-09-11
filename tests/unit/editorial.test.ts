import { describe, expect, it } from 'vitest';
import { assertValidEditorial } from '../../src/domain/editorial';
import { editorialAlternates, editorialItemBySlug, editorialItems, editorialPath } from '../../src/data/editorial';
import { products } from '../../src/data/products';

const productIds = products.map((product) => product.id);
const withFirstItemDates = (publishedAt: string, modifiedAt?: string) =>
  editorialItems.map((item, index) => (index === 0 ? { ...item, publishedAt, ...(modifiedAt === undefined ? {} : { modifiedAt }) } : item));

describe('editorial content', () => {
  it('contains six complete items in four locales', () => {
    expect(editorialItems).toHaveLength(6);
    for (const item of editorialItems) expect(Object.keys(item.locales).sort()).toEqual(['da', 'en', 'es', 'fi']);
  });

  it('resolves localized slugs and reciprocal paths', () => {
    const item = editorialItemBySlug('es', 'ensalada-tomate-cebolla-roja-aceite-oliva-bio');
    expect(item?.id).toBe('tomato-red-onion-salad');
    expect(editorialPath('en', item!)).toBe('/en/garden-recipes/tomato-red-onion-organic-olive-oil-salad/');
    expect(editorialAlternates(item!)).toHaveLength(5);
  });

  it('keeps recipe data complete and product relations valid', () => {
    for (const item of editorialItems.filter((entry) => entry.type === 'recipe')) {
      expect(item.recipe?.ingredients.es.length).toBeGreaterThan(0);
      expect(item.recipe?.instructions.es.length).toBeGreaterThan(0);
      expect(item.relatedProductIds.length).toBeGreaterThan(0);
    }
  });

  it('describes recipe CTAs as catalog navigation in every locale', () => {
    const expected = {
      es: 'Consultar ingredientes en el catálogo',
      en: 'Browse ingredients in the catalogue',
      fi: 'Tutustu aineksiin luettelossa',
      da: 'Se ingredienser i kataloget',
    } as const;

    for (const item of editorialItems.filter((entry) => entry.type === 'recipe')) {
      for (const locale of ['es', 'en', 'fi', 'da'] as const) {
        expect(item.locales[locale].ctaLabel).toBe(expected[locale]);
      }
    }
  });

  it('rejects an impossible Gregorian published date with the editorial item context', () => {
    expect(() => assertValidEditorial(withFirstItemDates('2026-02-30'), productIds)).toThrow(
      'publishedAt must be YYYY-MM-DD for editorial item seasonal-produce-fuengirola',
    );
  });

  it('rejects an invalid leap modified date with the editorial item context', () => {
    expect(() => assertValidEditorial(withFirstItemDates('2026-02-28', '2025-02-29'), productIds)).toThrow(
      'modifiedAt must be YYYY-MM-DD for editorial item seasonal-produce-fuengirola',
    );
  });

  it('accepts a valid Gregorian leap date', () => {
    expect(() => assertValidEditorial(withFirstItemDates('2024-02-29', '2024-02-29'), productIds)).not.toThrow();
  });

  it('rejects a modified date before the published date with the editorial item context', () => {
    expect(() => assertValidEditorial(withFirstItemDates('2026-03-01', '2026-02-28'), productIds)).toThrow(
      'modifiedAt cannot be earlier than publishedAt for editorial item seasonal-produce-fuengirola',
    );
  });
});
