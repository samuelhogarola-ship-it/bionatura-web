import type { Locale } from '../i18n/config';
import type { Product, Season, Unit } from '../domain/catalog';
import { assertValidCatalog } from '../domain/catalog';

type Copy = Record<Locale, string>;

const copy = (es: string, en: string, fi: string, da: string): Copy => ({ es, en, fi, da });
const demoDescription = copy('Producto de muestra para la demo; disponibilidad orientativa.', 'Sample product for the demo; availability is only indicative.', 'Esimerkkituote demoa varten; saatavuus on vain suuntaa antava.', 'Eksempelprodukt til demoen; tilgængeligheden er kun vejledende.');
const demoAlt = copy('Ilustración abstracta de producto de muestra.', 'Abstract sample product illustration.', 'Abstrakti esimerkkituotteen kuvitus.', 'Abstrakt illustration af eksempelprodukt.');

const makeProduct = (id: string, slug: Copy, name: Copy, categoryId: string, seasonList: Season[], alwaysAvailable: boolean, options: Array<{ id: string; value: number | string; unit: Unit }>, featured = false): Product => ({
  id, slug, name, shortDescription: demoDescription, categoryId, seasons: seasonList, alwaysAvailable,
  quantityOptions: options, allowCustomQuantity: true, imageId: 'product-placeholder', imageAlt: demoAlt,
  featured, demoOnly: true,
});

export const products: Product[] = [
  makeProduct('tomato', copy('tomate', 'tomato', 'tomaatti', 'tomat'), copy('Tomates', 'Tomatoes', 'Tomaatit', 'Tomater'), 'vegetables', ['summer'], false, [{ id: '1kg', value: 1, unit: 'kg' }], true),
  makeProduct('potato', copy('patata', 'potato', 'peruna', 'kartoffel'), copy('Patatas', 'Potatoes', 'Perunat', 'Kartofler'), 'vegetables', ['spring', 'autumn'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('pepper', copy('pimiento', 'pepper', 'paprika', 'peberfrugt'), copy('Pimientos', 'Peppers', 'Paprikat', 'Peberfrugter'), 'vegetables', ['summer', 'autumn'], false, [{ id: '500g', value: 500, unit: 'g' }]),
  makeProduct('courgette', copy('calabacín', 'courgette', 'kesäkurpitsa', 'squash'), copy('Calabacines', 'Courgettes', 'Kesäkurpitsat', 'Squash'), 'vegetables', ['summer'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('orange', copy('naranja', 'orange', 'appelsiini', 'appelsin'), copy('Naranjas', 'Oranges', 'Appelsiinit', 'Appelsiner'), 'fruit', ['winter', 'spring'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
  makeProduct('strawberry', copy('fresa', 'strawberry', 'mansikka', 'jordbær'), copy('Fresas', 'Strawberries', 'Mansikat', 'Jordbær'), 'fruit', ['spring', 'summer'], false, [{ id: '250g', value: 250, unit: 'g' }]),
  makeProduct('egg', copy('huevo', 'egg', 'muna', 'æg'), copy('Huevos', 'Eggs', 'Munat', 'Æg'), 'eggs', [], true, [{ id: 'dozen', value: 1, unit: 'dozen' }]),
  makeProduct('avocado', copy('aguacate', 'avocado', 'avokado', 'avocado'), copy('Aguacates', 'Avocados', 'Avokadot', 'Avocadoer'), 'fruit', [], true, [{ id: 'unit', value: 1, unit: 'unit' }]),
  makeProduct('onion', copy('cebolla', 'onion', 'sipuli', 'løg'), copy('Cebollas', 'Onions', 'Sipulit', 'Løg'), 'vegetables', ['autumn', 'winter'], false, [{ id: '1kg', value: 1, unit: 'kg' }]),
];

export const seasonalProducts = (season: Season): Product[] => products.filter((product) => !product.alwaysAvailable && product.seasons.includes(season));
export const alwaysAvailableProducts = (): Product[] => products.filter((product) => product.alwaysAvailable);

assertValidCatalog(products);
