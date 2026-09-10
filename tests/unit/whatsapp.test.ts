import { expect, it } from 'vitest';
import { buildWhatsAppUrl, formatOrderMessage, normalizePhoneE164 } from '../../src/domain/whatsapp';
import { products } from '../../src/data/products';

const state = { version: 1 as const, lines: [{ productId: 'tomato', quantityLabel: '2 kg' }] };

it.each(['es', 'en', 'fi', 'da'] as const)('formats %s without losing quantity', (locale) => {
  const message = formatOrderMessage(locale, state, products);
  expect(message).toContain('2 kg');
  expect(message).toContain(products.find((product) => product.id === 'tomato')!.name[locale]);
});

it('looks products up by product ID rather than array position', () => {
  const reordered = [products.find((product) => product.id === 'potato')!, products.find((product) => product.id === 'tomato')!];
  expect(formatOrderMessage('es', state, reordered)).toContain('- Tomates: 2 kg');
});

it('omits unknown products and rejects an order with no known products', () => {
  expect(() => formatOrderMessage('es', { version: 1, lines: [{ productId: 'unknown', quantityLabel: '1 kg' }] }, products)).toThrow(/product/i);
  expect(formatOrderMessage('es', { version: 1, lines: [{ productId: 'unknown', quantityLabel: '1 kg' }, ...state.lines] }, products)).toContain('- Tomates: 2 kg');
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
