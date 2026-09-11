import type { Product } from './catalog';
import type { OrderState } from './order-list';
import type { Locale } from '../i18n/config';
import { ui } from '../i18n/ui';
import { MADRID_TIME_ZONE } from './season';

export interface OrderMessageContext {
  reference: string;
  createdAt: Date;
}

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: MADRID_TIME_ZONE,
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return { day: value('day'), month: value('month'), year: value('year') };
}

export function createOrderReference(date: Date, state: OrderState): string {
  const { day, month, year } = dateParts(date);
  const checksumInput = `${date.toISOString()}|${state.lines.map((line) => `${line.productId}:${line.quantityLabel}`).join('|')}`;
  let checksum = 0x811c9dc5;
  for (let index = 0; index < checksumInput.length; index += 1) {
    checksum ^= checksumInput.charCodeAt(index);
    checksum = Math.imul(checksum, 0x01000193);
  }
  const suffix = (checksum & 0xffff).toString(16).toUpperCase().padStart(4, '0');
  return `BN-${year}${month}${day}-${suffix}`;
}

export function formatOrderMessage(
  locale: Locale,
  state: OrderState,
  products: readonly Product[],
  context: OrderMessageContext,
): string {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = state.lines.flatMap((line) => {
    const product = productsById.get(line.productId);
    return product ? [{ name: product.name[locale], quantity: line.quantityLabel }] : [];
  });

  if (items.length === 0) throw new Error('No known products in order');

  const copy = ui[locale];
  const productLines = items.map(
    (item, index) => `*${index + 1}. ${item.name}*\n${copy.whatsappQuantity}: ${item.quantity}`,
  );
  const countLabel = items.length === 1 ? copy.whatsappListCountSingular : copy.whatsappListCountPlural;
  const { day, month, year } = dateParts(context.createdAt);

  return [
    `*${copy.whatsappHeading}*`,
    '',
    productLines.join('\n\n'),
    '',
    '──────────────',
    `*${items.length} ${countLabel}*`,
    '',
    copy.whatsappAvailability,
    copy.whatsappPickup,
    '',
    `${copy.whatsappReference}: ${context.reference}`,
    `${copy.whatsappDate}: ${day}/${month}/${year}`,
  ].join('\n');
}

export function normalizePhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) throw new Error('Invalid phone');
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${normalizePhoneE164(phone)}?text=${encodeURIComponent(message)}`;
}

export function createOrderFile(message: string, reference: string): File {
  return new File([message], `pedido-bionatura-${reference}.txt`, { type: 'text/plain' });
}
