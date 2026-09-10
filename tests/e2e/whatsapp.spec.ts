import { expect, test } from '@playwright/test';

test('demo mode shows a copyable message and no invented recipient', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();

  await expect(page.getByRole('button', { name: /copiar mensaje/i })).toBeVisible();
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', '/es/contacto/');
});

test('copy action creates a localized message only after a click', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await page.getByRole('button', { name: /copiar mensaje/i }).click();

  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('Tomates: 1 kg');
});
