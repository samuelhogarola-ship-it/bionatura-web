import { expect, it } from 'vitest';
import { currentSeason, seasonForMonth } from '../../src/domain/season';

it.each([
  [1, 'winter'], [2, 'winter'], [3, 'spring'], [5, 'spring'],
  [6, 'summer'], [8, 'summer'], [9, 'autumn'], [11, 'autumn'], [12, 'winter'],
])('maps month %i to %s', (month, expected) => {
  expect(seasonForMonth(month)).toBe(expected);
});

it('uses the Madrid calendar date around UTC midnight', () => {
  expect(currentSeason(new Date('2026-08-31T22:30:00.000Z'))).toBe('autumn');
});
