import { describe, expect, it } from 'vitest';
import { products } from '../../src/data/products';
import { buildPageStructuredData } from '../../src/domain/structured-data';

describe('catalog structured data', () => {
  it('describes home delivery in Fuengirola and Torreblanca without claiming price or stock', () => {
    const schemas = buildPageStructuredData({ locale: 'es', page: 'catalog', current: 'Catálogo' });
    const service = schemas.find((schema) => schema['@type'] === 'Service');

    expect(service).toMatchObject({
      '@type': 'Service',
      serviceType: 'Reparto a domicilio de fruta, verdura y productos biológicos',
      provider: { '@id': 'https://bionatura.es/#organization' },
      areaServed: [
        { '@type': 'City', name: 'Fuengirola' },
        { '@type': 'Place', name: 'Torreblanca' },
      ],
    });
    expect(JSON.stringify(service)).not.toMatch(/price|availability|inStock/i);
  });

  it('publishes the guide catalog as an informational item list without unsupported offers', () => {
    const schemas = buildPageStructuredData({ locale: 'es', page: 'catalog', current: 'Catálogo' });
    const catalog = schemas.find((schema) => schema['@type'] === 'ItemList') as { itemListElement?: unknown[] } | undefined;

    expect(catalog?.itemListElement).toHaveLength(products.length);
    expect(catalog?.itemListElement?.[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      item: { '@type': 'Thing', name: 'Tomates' },
    });
    const serialized = JSON.stringify(catalog);
    expect(serialized).not.toContain('"@type":"Product"');
    expect(serialized).not.toContain('"@type":"Offer"');
    expect(serialized).not.toContain('"price":');
    expect(serialized).not.toContain('"availability":');
    expect(serialized).not.toContain('"category":');
    expect(serialized).not.toContain('Disponibilidad y precio a consultar.');
  });
});
