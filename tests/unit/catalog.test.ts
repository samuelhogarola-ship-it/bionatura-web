import { describe, expect, it } from 'vitest';
import { assertValidCatalog, type Product } from '../../src/domain/catalog';
import { alwaysAvailableProducts, products, seasonalProducts } from '../../src/data/products';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'tomato',
  slug: { es: 'tomate', en: 'tomato', fi: 'tomaatti', da: 'tomat' },
  name: { es: 'Tomates', en: 'Tomatoes', fi: 'Tomaatit', da: 'Tomater' },
  shortDescription: { es: 'Producto de muestra.', en: 'Sample product.', fi: 'Esimerkkituote.', da: 'Eksempelprodukt.' },
  categoryId: 'vegetables', seasons: ['summer'], alwaysAvailable: false,
  quantityOptions: [{ id: '1kg', value: 1, unit: 'kg' }],
  allowCustomQuantity: true, imageId: 'demo-tomatoes',
  imageAlt: { es: 'Tomates', en: 'Tomatoes', fi: 'Tomaatteja', da: 'Tomater' },
  featured: true, demoOnly: true, ...overrides,
});

describe('catalog validation', () => {
  it('rejects an always-available product with seasons', () => {
    expect(() => assertValidCatalog([product({ alwaysAvailable: true })])).toThrow(/alwaysAvailable/);
  });

  it('rejects duplicate product ids', () => {
    expect(() => assertValidCatalog([product(), product()])).toThrow(/duplicate/);
  });

  it('accepts a valid seasonal product', () => {
    expect(() => assertValidCatalog([product()])).not.toThrow();
  });

  it('rejects incomplete translations and empty quantities', () => {
    expect(() => assertValidCatalog([product({ name: { es: '', en: 'Tomatoes', fi: 'Tomaatit', da: 'Tomater' } })])).toThrow(/name/);
    expect(() => assertValidCatalog([product({ quantityOptions: [] })])).toThrow(/quantit/);
  });

  it('requires seasons for seasonal products and positive EUR prices', () => {
    expect(() => assertValidCatalog([product({ seasons: [] })])).toThrow(/season/);
    expect(() => assertValidCatalog([product({ price: { amount: 0, currency: 'EUR', unitLabel: {} } })])).toThrow(/price/);
  });

  it('keeps stable ids and locates the tomato by id', () => {
    expect(products.map(({ id }) => id)).toEqual(expect.arrayContaining(['tomato', 'potato', 'egg', 'avocado']));
    expect(products.find(({ id }) => id === 'tomato')?.name.es).toBe('Tomates');
  });

  it('selects seasonal and always-available products without relying on order', () => {
    expect(seasonalProducts('summer').some(({ id }) => id === 'tomato')).toBe(true);
    expect(alwaysAvailableProducts().map(({ id }) => id)).toEqual(expect.arrayContaining(['egg', 'avocado']));
    expect(seasonalProducts('summer').every(({ alwaysAvailable }) => !alwaysAvailable)).toBe(true);
  });
});
