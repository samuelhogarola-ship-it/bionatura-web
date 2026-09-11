import { expect, it } from 'vitest';
import {
  buildWhatsAppUrl,
  createOrderFile,
  createOrderReference,
  formatOrderMessage,
  normalizePhoneE164,
} from '../../src/domain/whatsapp';
import { products } from '../../src/data/products';
import type { ValidatedField } from '../../src/data/business';

const state = {
  version: 1 as const,
  lines: [
    { productId: 'tomato', quantityLabel: '2 kg' },
    { productId: 'red-onion', quantityLabel: '1 kg' },
  ],
};
const context = { reference: 'BN-20260911-A1B2', createdAt: new Date('2026-09-11T10:42:00+02:00') };

it.each([
  {
    locale: 'es' as const,
    heading: '*LISTA DE LA COMPRA · BIONATURA*',
    first: '*1. Tomates*\nCantidad: 2 kg',
    second: '*2. Cebolla roja*\nCantidad: 1 kg',
    count: '*2 productos en la lista*',
    availability: '¿Podéis confirmarme la disponibilidad?',
    pickup: 'La recogida se acuerda previamente en Los Pacos, Fuengirola.',
    reference: 'Referencia: BN-20260911-A1B2',
    date: 'Fecha: 11/09/2026',
  },
  {
    locale: 'en' as const,
    heading: '*SHOPPING LIST · BIONATURA*',
    first: '*1. Tomatoes*\nQuantity: 2 kg',
    second: '*2. Red onions*\nQuantity: 1 kg',
    count: '*2 products on the list*',
    availability: 'Could you confirm availability?',
    pickup: 'Collection is arranged in advance in Los Pacos, Fuengirola.',
    reference: 'Reference: BN-20260911-A1B2',
    date: 'Date: 11/09/2026',
  },
  {
    locale: 'fi' as const,
    heading: '*OSTOSLISTA · BIONATURA*',
    first: '*1. Tomaatit*\nMäärä: 2 kg',
    second: '*2. Punasipulit*\nMäärä: 1 kg',
    count: '*2 tuotetta listalla*',
    availability: 'Voitteko vahvistaa saatavuuden?',
    pickup: 'Noudosta sovitaan etukäteen Los Pacosissa, Fuengirolassa.',
    reference: 'Viite: BN-20260911-A1B2',
    date: 'Päiväys: 11/09/2026',
  },
  {
    locale: 'da' as const,
    heading: '*INDKØBSLISTE · BIONATURA*',
    first: '*1. Tomater*\nMængde: 2 kg',
    second: '*2. Rødløg*\nMængde: 1 kg',
    count: '*2 varer på listen*',
    availability: 'Kan I bekræfte tilgængeligheden?',
    pickup: 'Afhentning aftales på forhånd i Los Pacos, Fuengirola.',
    reference: 'Reference: BN-20260911-A1B2',
    date: 'Dato: 11/09/2026',
  },
])('formats an enriched $locale shopping list', ({ locale, heading, first, second, count, availability, pickup, reference, date }) => {
  const message = formatOrderMessage(locale, state, products, context);

  expect(message).toContain(heading);
  expect(message).toContain(first);
  expect(message).toContain(second);
  expect(message).toContain(`──────────────\n${count}`);
  expect(message).toContain(availability);
  expect(message).toContain(pickup);
  expect(message).toContain(reference);
  expect(message).toContain(date);
});

it('creates a deterministic filename-safe reference from date and ordered lines', () => {
  const date = new Date('2026-09-11T10:42:00+02:00');
  const reference = createOrderReference(date, state);

  expect(reference).toMatch(/^BN-20260911-[A-F0-9]{4}$/);
  expect(createOrderReference(new Date('2026-09-11T10:42:00+02:00'), state)).toBe(reference);
  expect(createOrderReference(date, { ...state, lines: [...state.lines].reverse() })).not.toBe(reference);
  expect(createOrderReference(new Date('2026-09-12T10:42:00+02:00'), state)).not.toBe(reference);
});

it('creates a plain-text file named with the message reference', async () => {
  const file = createOrderFile('contenido', context.reference);

  expect(file.name).toBe('pedido-bionatura-BN-20260911-A1B2.txt');
  expect(file.type).toBe('text/plain');
  expect(await file.text()).toBe('contenido');
});

it('looks products up by product ID rather than array position', () => {
  const reordered = [products.find((product) => product.id === 'potato')!, products.find((product) => product.id === 'tomato')!];
  expect(formatOrderMessage('es', state, reordered, context)).toContain('*1. Tomates*\nCantidad: 2 kg');
});

it('omits unknown products and rejects an order with no known products', () => {
  expect(() => formatOrderMessage('es', { version: 1, lines: [{ productId: 'unknown', quantityLabel: '1 kg' }] }, products, context)).toThrow(/product/i);
  expect(formatOrderMessage('es', { version: 1, lines: [{ productId: 'unknown', quantityLabel: '1 kg' }, ...state.lines] }, products, context)).toContain('*1. Tomates*\nCantidad: 2 kg');
});

it('encodes a wa.me URL without sending', () => {
  expect(buildWhatsAppUrl('+34 600 000 000', 'Hola\n- Tomates: 2 kg'))
    .toBe('https://wa.me/34600000000?text=Hola%0A-%20Tomates%3A%202%20kg');
});

it.each(['', '1234567', '1234567890123456', 'abc-def'])('rejects an invalid phone: %s', (phone) => {
  expect(() => normalizePhoneE164(phone)).toThrow(/phone/i);
  expect(() => buildWhatsAppUrl(phone, 'Hola')).toThrow(/phone/i);
});

it('normalizes a valid E.164 phone to digits', () => {
  expect(normalizePhoneE164('+34 600 000 000')).toBe('34600000000');
});

it('builds wa.me for an injected confirmed fixture without making it production data', () => {
  const confirmedFixture: ValidatedField<string> = { status: 'confirmed', value: '+34 611 222 333' };
  const url = confirmedFixture.status === 'confirmed' && confirmedFixture.value
    ? buildWhatsAppUrl(confirmedFixture.value, 'Fixture message')
    : null;

  expect(url).toBe('https://wa.me/34611222333?text=Fixture%20message');
});
