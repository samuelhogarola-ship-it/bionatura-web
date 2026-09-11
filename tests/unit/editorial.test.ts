import { describe, expect, it } from 'vitest';
import { editorialAlternates, editorialItemBySlug, editorialItems, editorialPath } from '../../src/data/editorial';

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
});
