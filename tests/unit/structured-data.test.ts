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

  it('publishes the confirmed guide catalog as one item list', () => {
    const schemas = buildPageStructuredData({ locale: 'es', page: 'catalog', current: 'Catálogo' });
    const catalog = schemas.find((schema) => schema['@type'] === 'ItemList') as { itemListElement?: unknown[] } | undefined;

    expect(catalog?.itemListElement).toHaveLength(products.length);
    expect(catalog?.itemListElement?.[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      item: { '@type': 'Product', name: 'Tomates' },
    });
  });
});
