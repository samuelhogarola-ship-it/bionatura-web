import type { Product } from './catalog';
import type { OrderState } from './order-list';
import type { Locale } from '../i18n/config';
import { ui } from '../i18n/ui';

export function formatOrderMessage(locale: Locale, state: OrderState, products: readonly Product[]): string {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const lines = state.lines.flatMap((line) => {
    const product = productsById.get(line.productId);
    return product ? [`- ${product.name[locale]}: ${line.quantityLabel}`] : [];
  });

  if (lines.length === 0) throw new Error('No known products in order');

  return [ui[locale].whatsappIntro, ...lines, ui[locale].whatsappAvailability, ui[locale].whatsappPickup].join('\n');
}

export function normalizePhoneE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) throw new Error('Invalid phone');
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${normalizePhoneE164(phone)}?text=${encodeURIComponent(message)}`;
}

export function createOrderFile(message: string): File {
  return new File([message], 'pedido-bionatura.txt', { type: 'text/plain' });
}
