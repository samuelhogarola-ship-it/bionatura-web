import { expect, it } from 'vitest';
import { EMPTY_ORDER, clearOrder, parseStoredOrder, removeLine, serializeOrder, upsertLine } from '../../src/domain/order-list';

it('adds and replaces one line per product', () => {
  const first = upsertLine(EMPTY_ORDER, { productId: 'tomato', quantityLabel: '1 kg' });
  const second = upsertLine(first, { productId: 'tomato', quantityLabel: '2 kg' });
  expect(second.lines).toEqual([{ productId: 'tomato', quantityLabel: '2 kg' }]);
});

it('removes a product', () => {
  const state = { version: 1 as const, lines: [{ productId: 'tomato', quantityLabel: '1 kg' }] };
  expect(removeLine(state, 'tomato').lines).toHaveLength(0);
});

it('clears an order', () => expect(clearOrder().lines).toEqual([]));

it('falls back safely for malformed storage', () => {
  expect(parseStoredOrder('{bad json', new Set(['tomato']))).toEqual(EMPTY_ORDER);
});

it('drops products no longer in the catalog', () => {
  const raw = JSON.stringify({ version: 1, lines: [{ productId: 'old', quantityLabel: '1 kg' }] });
  expect(parseStoredOrder(raw, new Set(['tomato']))).toEqual(EMPTY_ORDER);
});

it('rejects unsupported versions and malformed lines', () => {
  expect(parseStoredOrder(JSON.stringify({ version: 2, lines: [] }), new Set())).toEqual(EMPTY_ORDER);
  expect(parseStoredOrder(JSON.stringify({ version: 1, lines: [{ productId: 'tomato', quantityLabel: '' }] }), new Set(['tomato']))).toEqual(EMPTY_ORDER);
});

it('rejects control characters and labels longer than forty characters', () => {
  const valid = new Set(['tomato']);
  expect(parseStoredOrder(JSON.stringify({ version: 1, lines: [{ productId: 'tomato', quantityLabel: 'bad\u0000label' }] }), valid)).toEqual(EMPTY_ORDER);
  expect(parseStoredOrder(JSON.stringify({ version: 1, lines: [{ productId: 'tomato', quantityLabel: 'a'.repeat(41) }] }), valid)).toEqual(EMPTY_ORDER);
});

it('serializes a versioned order without mutating it', () => {
  const state = { version: 1 as const, lines: [{ productId: 'tomato', quantityLabel: '1 kg' }] };
  expect(serializeOrder(state)).toBe(JSON.stringify(state));
  expect(state).toEqual({ version: 1, lines: [{ productId: 'tomato', quantityLabel: '1 kg' }] });
});
