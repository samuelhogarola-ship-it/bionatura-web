import type { Locale } from '../i18n/config';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Unit = 'g' | 'kg' | 'unit' | 'dozen' | 'custom';
export type LocalizedText = Record<Locale, string>;

export interface QuantityOption {
  id: string;
  value: number | string;
  unit: Unit;
  labels?: Partial<Record<Locale, string>>;
}

export interface Product {
  id: string;
  slug: LocalizedText;
  name: LocalizedText;
  shortDescription: LocalizedText;
  categoryId: string;
  seasons: Season[];
  alwaysAvailable: boolean;
  quantityOptions: QuantityOption[];
  allowCustomQuantity: boolean;
  imageId: string;
  imageAlt: LocalizedText;
  featured: boolean;
  price?: {
    amount: number;
    currency: 'EUR';
    unitLabel: Partial<Record<Locale, string>>;
  };
  demoOnly?: boolean;
}

const locales: readonly Locale[] = ['es', 'en', 'fi', 'da'];
const seasons: readonly Season[] = ['spring', 'summer', 'autumn', 'winter'];
const units: readonly Unit[] = ['g', 'kg', 'unit', 'dozen', 'custom'];

function assertLocalized(field: LocalizedText, label: string, productId: string): void {
  for (const locale of locales) {
    if (typeof field?.[locale] !== 'string' || field[locale].trim() === '') {
      throw new Error(`${label} translation missing for ${locale} in product ${productId}`);
    }
  }
}

export function assertValidCatalog(catalog: Product[]): void {
  const ids = new Set<string>();
  for (const product of catalog) {
    if (!product.id.trim()) throw new Error('product id must not be empty');
    if (ids.has(product.id)) throw new Error(`duplicate product id: ${product.id}`);
    ids.add(product.id);

    assertLocalized(product.slug, 'slug', product.id);
    assertLocalized(product.name, 'name', product.id);
    assertLocalized(product.shortDescription, 'shortDescription', product.id);
    assertLocalized(product.imageAlt, 'imageAlt', product.id);

    if (!product.categoryId.trim() || !product.imageId.trim()) throw new Error(`metadata missing in product ${product.id}`);
    if (product.alwaysAvailable && product.seasons.length > 0) throw new Error(`alwaysAvailable product cannot have seasons: ${product.id}`);
    if (!product.alwaysAvailable && product.seasons.length === 0) throw new Error(`seasonal product needs a season: ${product.id}`);
    if (product.seasons.some((season) => !seasons.includes(season))) throw new Error(`invalid season in product ${product.id}`);
    if (product.quantityOptions.length === 0) throw new Error(`quantity options must not be empty: ${product.id}`);
    for (const option of product.quantityOptions) {
      if (!option.id.trim() || (typeof option.value === 'string' && option.value.trim() === '') || (typeof option.value === 'number' && !Number.isFinite(option.value))) {
        throw new Error(`quantity option must have a value: ${product.id}`);
      }
      if (!units.includes(option.unit)) throw new Error(`invalid quantity unit in product ${product.id}`);
    }
    if (product.price && product.price.currency !== 'EUR') {
      throw new Error(`price currency must be EUR in product ${product.id}`);
    }
    if (product.price && (!Number.isFinite(product.price.amount) || product.price.amount <= 0)) {
      throw new Error(`price must be positive in product ${product.id}`);
    }
  }
}
