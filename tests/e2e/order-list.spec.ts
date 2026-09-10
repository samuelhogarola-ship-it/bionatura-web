import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('adds, edits, persists and removes a product', async ({ page }) => {
  const product = page.locator('[data-product-id="tomato"]');
  await product.locator('[data-quantity]').selectOption('2kg');
  await product.getByRole('button', { name: /añadir/i }).click();
  await expect(page.getByTestId('order-count')).toHaveText('1');

  await page.reload();
  await page.getByRole('button', { name: /tu lista/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('2 kg');
  await dialog.getByRole('button', { name: /eliminar tomates/i }).click();
  await expect(page.getByTestId('order-count')).toHaveText('0');
});

test('validates and stores a custom quantity', async ({ page }) => {
  const product = page.locator('[data-product-id="tomato"]');
  await product.locator('[data-quantity]').selectOption('custom');
  await expect(product.getByLabel(/especifica la medida/i)).toBeVisible();
  await product.getByRole('button', { name: /añadir/i }).click();
  await expect(product.getByText(/hasta 40 caracteres/i)).toBeVisible();

  await product.getByLabel(/especifica la medida/i).fill('una caja pequeña');
  await product.getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await expect(page.getByRole('dialog')).toContainText('una caja pequeña');
});

test('clearing the list requires an inline confirmation', async ({ page }) => {
  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  const dialog = page.getByRole('dialog');

  await dialog.getByRole('button', { name: /vaciar lista/i }).click();
  await expect(dialog.getByRole('button', { name: /^vaciar$/i })).toBeVisible();
  await dialog.getByRole('button', { name: /^vaciar$/i }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/tu lista está vacía/i);
  await expect(page.getByTestId('order-count')).toHaveText('0');
});
