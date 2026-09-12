import { products } from '../data/products';
import { clearOrder, parseStoredOrder, removeLine, serializeOrder, upsertLine, type OrderState } from '../domain/order-list';
import { isLocale, type Locale } from '../i18n/config';
import { ui } from '../i18n/ui';
import {
  buildWhatsAppUrl,
  createOrderFile,
  createOrderReference,
  formatOrderMessage,
  type OrderMessageContext,
} from '../domain/whatsapp';

export const ORDER_STORAGE_KEY = 'bionatura.order.v1';

const localeValue = document.documentElement.lang;
const locale: Locale = isLocale(localeValue) ? localeValue : 'es';
const copy = ui[locale];
const productById = new Map(products.map((product) => [product.id, product]));
const validProductIds = new Set(productById.keys());
const dialog = document.querySelector<HTMLDialogElement>('[data-order-dialog]');
const linesElement = document.querySelector<HTMLUListElement>('[data-order-lines]');
const emptyElement = document.querySelector<HTMLElement>('[data-order-empty]');
const emptyStateElement = document.querySelector<HTMLElement>('[data-order-empty-state]');
const pageAnnouncement = document.querySelector<HTMLElement>('[data-order-announcement="page"]');
const dialogAnnouncement = document.querySelector<HTMLElement>('[data-order-announcement="dialog"]');
const clearButton = document.querySelector<HTMLButtonElement>('[data-order-clear]');
const clearConfirmation = document.querySelector<HTMLElement>('[data-order-clear-confirmation]');
const orderHeading = document.querySelector<HTMLElement>('[data-order-heading]');
let returnFocus: HTMLElement | null = null;

function readOrder(): OrderState {
  try {
    return parseStoredOrder(localStorage.getItem(ORDER_STORAGE_KEY), validProductIds);
  } catch {
    return clearOrder();
  }
}

let state = readOrder();
let currentOrderMessage: { context: OrderMessageContext; message: string } | null = null;

function announce(message: string) {
  const announcement = dialog?.open ? dialogAnnouncement : pageAnnouncement;
  if (announcement) announcement.textContent = message;
}

function persist() {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, serializeOrder(state));
  } catch {
    // The in-memory list remains usable if storage is unavailable.
  }
  document.dispatchEvent(new CustomEvent<OrderState>('bionatura:order-change', { detail: state }));
}

function render() {
  if (state.lines.length === 0) {
    currentOrderMessage = null;
  } else {
    const createdAt = new Date();
    const context = { createdAt, reference: createOrderReference(createdAt, state) };
    currentOrderMessage = { context, message: formatOrderMessage(locale, state, products, context) };
  }

  for (const count of document.querySelectorAll<HTMLElement>('[data-order-count]')) {
    count.textContent = String(state.lines.length);
  }
  if (!linesElement || !emptyElement) return;

  linesElement.replaceChildren();
  emptyElement.hidden = state.lines.length > 0;
  if (emptyStateElement) emptyStateElement.hidden = state.lines.length > 0;
  linesElement.hidden = state.lines.length === 0;
  clearButton?.toggleAttribute('disabled', state.lines.length === 0);
  for (const action of document.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('[data-copy-order-message], [data-whatsapp-action]')) {
    const disabled = state.lines.length === 0;
    action.setAttribute('aria-disabled', String(disabled));
    if (action instanceof HTMLButtonElement) action.disabled = disabled;
    if (action instanceof HTMLAnchorElement) {
      if (state.lines.length === 0 || !action.dataset.whatsappPhone) {
        action.removeAttribute('href');
      } else {
        action.href = buildWhatsAppUrl(action.dataset.whatsappPhone, currentOrderMessage!.message);
      }
    }
  }

  for (const line of state.lines) {
    const product = productById.get(line.productId);
    if (!product) continue;
    const item = document.createElement('li');
    const text = document.createElement('span');
    const name = document.createElement('strong');
    const quantity = document.createElement('span');
    const remove = document.createElement('button');

    name.textContent = product.name[locale];
    quantity.textContent = line.quantityLabel;
    text.append(name, quantity);
    remove.type = 'button';
    remove.dataset.orderRemove = line.productId;
    remove.textContent = '×';
    remove.setAttribute('aria-label', `${copy.removeItem} ${product.name[locale]}`);
    item.append(text, remove);
    linesElement.append(item);
  }
}

function update(nextState: OrderState, message: string) {
  state = nextState;
  persist();
  render();
  announce(message);
}

function showCustomQuantity(card: HTMLElement) {
  const select = card.querySelector<HTMLSelectElement>('[data-quantity]');
  const custom = card.querySelector<HTMLElement>('[data-custom-quantity]');
  if (!select || !custom) return;
  custom.hidden = select.value !== 'custom';
  if (!custom.hidden) card.querySelector<HTMLInputElement>('[data-custom-quantity-input]')?.focus();
}

function downloadOrderFile(file: File) {
  const url = URL.createObjectURL(file);
  const download = document.createElement('a');
  download.href = url;
  download.download = file.name;
  download.hidden = true;
  document.body.append(download);
  download.click();
  download.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

document.addEventListener('change', (event) => {
  const select = (event.target as Element | null)?.closest<HTMLSelectElement>('[data-quantity]');
  const card = select?.closest<HTMLElement>('[data-product-id]');
  if (card) showCustomQuantity(card);
});

document.addEventListener('click', async (event) => {
  const target = event.target as Element | null;
  const whatsappAction = target?.closest<HTMLAnchorElement>('[data-whatsapp-action][data-order-file]');
  if (whatsappAction) {
    if (!currentOrderMessage) {
      event.preventDefault();
      return;
    }
    const { context, message } = currentOrderMessage;
    const file = createOrderFile(message, context.reference);
    const shareData: ShareData = { title: 'Bionatura', text: message, files: [file] };
    if (navigator.share && navigator.canShare?.(shareData)) {
      event.preventDefault();
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        downloadOrderFile(file);
        window.open(whatsappAction.href, '_blank', 'noopener,noreferrer');
      }
    } else {
      downloadOrderFile(file);
    }
    return;
  }

  const copyButton = target?.closest<HTMLButtonElement>('[data-copy-order-message]');
  if (copyButton) {
    if (!currentOrderMessage) return;
    const { message } = currentOrderMessage;
    const fallback = document.querySelector<HTMLTextAreaElement>('[data-copy-fallback]');
    const copyWithFallback = (): boolean => {
      if (!fallback) return false;
      fallback.hidden = false;
      fallback.value = message;
      fallback.focus();
      fallback.select();
      try {
        const copied = document.execCommand('copy');
        if (copied) {
          copyButton.focus();
          fallback.hidden = true;
        }
        return copied;
      } catch {
        return false;
      }
    };
    const useFallback = () => announce(copyWithFallback() ? copy.messageCopied : copy.copyManually);
    try {
      if (!navigator.clipboard?.writeText) {
        useFallback();
        return;
      }
      navigator.clipboard.writeText(message).then(
        () => {
          if (fallback) fallback.hidden = true;
          announce(copy.messageCopied);
        },
        useFallback,
      );
    } catch {
      useFallback();
    }
    return;
  }

  const opener = target?.closest<HTMLElement>('[data-order-open]');
  if (opener && dialog) {
    returnFocus = opener;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-order-close]')?.focus();
    return;
  }

  if (target?.closest('[data-order-close]')) {
    dialog?.close();
    return;
  }

  const addButton = target?.closest<HTMLButtonElement>('[data-add-product]');
  const card = addButton?.closest<HTMLElement>('[data-product-id]');
  if (card) {
    const productId = card.dataset.productId;
    const select = card.querySelector<HTMLSelectElement>('[data-quantity]');
    const selectedOption = select?.selectedOptions.item(0);
    if (!productId || !select || !selectedOption) return;
    const customInput = card.querySelector<HTMLInputElement>('[data-custom-quantity-input]');
    const customError = card.querySelector<HTMLElement>('[data-custom-error]');
    const customValue = customInput?.value.trim() ?? '';
    const invalidCustom = select.value === 'custom' && (customValue.length === 0 || customValue.length > 40);
    if (customInput) customInput.setAttribute('aria-invalid', String(invalidCustom));
    if (customError) customError.hidden = !invalidCustom;
    if (invalidCustom) {
      customInput?.focus();
      return;
    }
    const quantityLabel = select.value === 'custom' ? customValue : selectedOption.textContent.trim();
    update(upsertLine(state, { productId, quantityLabel }), `${productById.get(productId)?.name[locale] ?? ''}: ${copy.addedToList}`);
    return;
  }

  const removeButton = target?.closest<HTMLButtonElement>('[data-order-remove]');
  if (removeButton?.dataset.orderRemove) {
    const removedIndex = state.lines.findIndex((line) => line.productId === removeButton.dataset.orderRemove);
    const product = productById.get(removeButton.dataset.orderRemove);
    update(removeLine(state, removeButton.dataset.orderRemove), `${product?.name[locale] ?? ''}: ${copy.removedFromList}`);
    const remainingRemoveButtons = Array.from(dialog?.querySelectorAll<HTMLButtonElement>('[data-order-remove]') ?? []);
    const nextFocus = remainingRemoveButtons[Math.min(removedIndex, remainingRemoveButtons.length - 1)];
    (nextFocus ?? orderHeading)?.focus();
    return;
  }

  if (target?.closest('[data-order-clear]')) {
    if (clearConfirmation) clearConfirmation.hidden = false;
    clearButton?.setAttribute('hidden', '');
    clearConfirmation?.querySelector<HTMLElement>('[data-order-clear-cancel]')?.focus();
    return;
  }

  if (target?.closest('[data-order-clear-cancel]')) {
    if (clearConfirmation) clearConfirmation.hidden = true;
    clearButton?.removeAttribute('hidden');
    clearButton?.focus();
    return;
  }

  if (target?.closest('[data-order-clear-confirm]')) {
    if (clearConfirmation) clearConfirmation.hidden = true;
    clearButton?.removeAttribute('hidden');
    update(clearOrder(), copy.listCleared);
    clearButton?.focus();
  }
});

dialog?.addEventListener('close', () => {
  if (clearConfirmation) clearConfirmation.hidden = true;
  clearButton?.removeAttribute('hidden');
  returnFocus?.focus();
});

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

render();
