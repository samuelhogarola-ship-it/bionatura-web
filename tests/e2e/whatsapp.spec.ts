import { expect, test } from '@playwright/test';

test('confirmed WhatsApp action contains the enriched current shopping list', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T10:42:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-product-id="potato"]:visible [data-add-product]').click();
  await page.locator('[data-product-id="red-onion"]:visible [data-add-product]').click();
  await page.getByRole('button', { name: /tu cesta/i }).click();

  const whatsapp = page.getByRole('dialog').getByRole('link', { name: /consultar por whatsapp/i });
  await expect(whatsapp).toHaveAttribute('href', /https:\/\/wa\.me\/34635648872\?text=/);
  await expect(whatsapp).toHaveAttribute('target', '_blank');

  const href = await whatsapp.getAttribute('href');
  const message = new URL(href!).searchParams.get('text')!;
  expect(message).toContain('*LISTA DE LA COMPRA · BIONATURA*');
  expect(message).toContain('*1. Patatas*\nCantidad: 1 kg');
  expect(message).toContain('*2. Cebolla roja*\nCantidad: 1 kg');
  expect(message).toContain('*2 productos en la lista*');
  expect(message).toContain('La recogida se acuerda previamente en Los Pacos, Fuengirola.');
  expect(message).toMatch(/Referencia: BN-20260911-[A-F0-9]{4}/);
  expect(message).not.toMatch(/Precio|Total|Nombre|Teléfono|€|EUR/i);
});

test('empty basket disables both WhatsApp and copy actions', async ({ page }) => {
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('[data-order-open]').click();

  const dialog = page.getByRole('dialog');
  const whatsapp = dialog.locator('[data-whatsapp-action]');
  const copy = dialog.getByRole('button', { name: /copiar mensaje/i });
  await expect(whatsapp).toHaveAttribute('aria-disabled', 'true');
  await expect(whatsapp).not.toHaveAttribute('href', /.+/);
  await expect(copy).toBeDisabled();
  await expect(copy).toHaveAttribute('aria-disabled', 'true');
});

test('native sharing uses the exact URL message in the referenced order file', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T10:42:00+02:00') });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => {
        const file = data.files?.[0];
        (window as typeof window & { __sharedOrder?: object }).__sharedOrder = {
          text: data.text,
          filename: file?.name,
          type: file?.type,
          fileText: file ? await file.text() : '',
        };
      },
    });
  });
  await page.goto('/es/catalogo/');
  await page.locator('[data-product-id="potato"]:visible [data-add-product]').click();
  await page.locator('[data-product-id="red-onion"]:visible [data-add-product]').click();
  await page.locator('[data-order-open]').click();
  const whatsapp = page.getByRole('dialog').getByRole('link', { name: /whatsapp/i });
  const href = await whatsapp.getAttribute('href');
  const currentMessage = new URL(href!).searchParams.get('text')!;
  const reference = currentMessage.match(/Referencia: (BN-20260911-[A-F0-9]{4})/)?.[1];
  expect(reference).toBeTruthy();

  await whatsapp.click();

  await expect.poll(() => page.evaluate(() => (window as typeof window & { __sharedOrder?: object }).__sharedOrder)).toEqual({
    text: currentMessage,
    filename: `pedido-bionatura-${reference}.txt`,
    type: 'text/plain',
    fileText: currentMessage,
  });
});

test('manual copy fallback exposes the exact current URL message', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T10:42:00+02:00') });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    Object.defineProperty(document, 'execCommand', { configurable: true, value: () => false });
  });
  await page.goto('/es/catalogo/');
  await page.locator('[data-product-id="potato"]:visible [data-add-product]').click();
  await page.locator('[data-product-id="red-onion"]:visible [data-add-product]').click();
  await page.locator('[data-order-open]').click();

  const dialog = page.getByRole('dialog');
  const whatsapp = dialog.getByRole('link', { name: /whatsapp/i });
  const href = await whatsapp.getAttribute('href');
  const currentMessage = new URL(href!).searchParams.get('text')!;
  await dialog.getByRole('button', { name: /copiar mensaje/i }).click();

  const fallback = dialog.locator('[data-copy-fallback]');
  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveValue(currentMessage);
});

test('localized WhatsApp messages omit prohibited customer, price, total and delivery fields', async ({ page }) => {
  const locales = [
    { path: '/es/catalogo/', action: /consultar por whatsapp/i, prohibited: /Precio|Total|Nombre|Teléfono|Cliente|Entrega|€|EUR/i },
    { path: '/en/catalog/', action: /ask via whatsapp/i, prohibited: /Price|Total|Name|Phone|Customer|Delivery|€|EUR/i },
    { path: '/fi/tuotteet/', action: /kysy whatsappissa/i, prohibited: /Hinta|Yhteensä|Nimi|Puhelin|Asiakas|Toimitus|€|EUR/i },
    { path: '/da/katalog/', action: /spørg via whatsapp/i, prohibited: /Pris|I alt|Navn|Telefon|Kunde|Levering|€|EUR/i },
  ] as const;

  for (const localized of locales) {
    await page.goto(localized.path);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('[data-product-id="potato"]:visible [data-add-product]').click();
    await page.locator('[data-order-open]').click();
    const href = await page.getByRole('dialog').getByRole('link', { name: localized.action }).getAttribute('href');
    const message = new URL(href!).searchParams.get('text')!;
    expect(message).not.toMatch(localized.prohibited);
  }
});

test('floating WhatsApp control uses a recognizable icon and the confirmed number', async ({ page }) => {
  await page.goto('/es/');

  const whatsapp = page.locator('.floating-whatsapp');
  await expect(whatsapp).toHaveAttribute('href', /https:\/\/wa\.me\/34635648872/);
  await expect(whatsapp.locator('svg')).toHaveCount(1);
  await expect(whatsapp).not.toContainText(/^W$/);
});
