import type { Season } from './catalog';

export const MADRID_TIME_ZONE = 'Europe/Madrid';

export function monthInTimeZone(date: Date, timeZone = MADRID_TIME_ZONE): number {
  const parts = new Intl.DateTimeFormat('en', { month: 'numeric', timeZone }).formatToParts(date);
  return Number(parts.find((part) => part.type === 'month')?.value);
}

export function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  if (month === 12 || month === 1 || month === 2) return 'winter';
  throw new RangeError(`Invalid month: ${month}`);
}

export const currentSeason = (date = new Date()) => seasonForMonth(monthInTimeZone(date));
