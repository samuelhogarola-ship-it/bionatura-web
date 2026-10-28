import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('catalog renders the complete produce directory in generated HTML', async ({ request }) => {
  const response = await request.get('/es/catalogo/');
  expect(response.ok()).toBe(true);
  const html = await response.text();

  for (const product of ['Ajo', 'Acelga', 'Aguacate', 'Melón piel de sapo', 'Naranja de zumo', 'Tomate cherry']) {
    expect(html).toContain(product);
  }
  expect(html).toContain('Disponibilidad y precio a consultar');
});
test('complete catalog is grouped and every consultation product is visible', async ({ page }) => {
  await page.goto('/es/catalogo/');

  await expect(page.getByRole('heading', { name: 'Verduras y hortalizas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Frutas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Otros productos' })).toBeVisible();
  expect(await page.locator('[data-catalog-product]').count()).toBeGreaterThanOrEqual(110);
  await expect(page.getByText('Disponibilidad y precio a consultar', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Uvas negras o rojas' })).toBeVisible();
});

test('farm eggs offer half a dozen and one dozen', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const quantity = page.locator('[data-product-id="egg"] [data-quantity]');

  await expect(quantity.locator('option')).toHaveText(['Media docena', 'Una docena', 'Otra cantidad']);
});

test('a newly added consultation product can be added to the basket', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const garlic = page.locator('[data-product-id="garlic"]');
  await garlic.locator('[data-add-product]').click();
  await page.locator('[data-order-open]').click();

  await expect(page.locator('[data-order-lines]')).toContainText('Ajo');
  await expect(page.locator('[data-order-lines]')).toContainText('Cantidad a consultar');
});

test('catalog has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('catalog retains existing extras alongside the complete produce list', async ({ page }) => {
  await page.goto('/es/catalogo/');

  await expect(page.getByRole('heading', { name: 'Aguacate', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Huevos caseros', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kombucha bio', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Aceite de oliva bio', exact: true })).toBeVisible();
  await expect(page.getByText(/producto de muestra/i)).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Casas para pájaros', exact: true })).toBeVisible();
});

test('basket uses the sober Andalusian treatment', async ({ page }) => {
  await page.goto('/es/catalogo/');
  await page.locator('[data-order-open]').click();

  const dialog = page.locator('.order-dialog__surface');
  await expect(dialog).toHaveAttribute('data-basket-style', 'andalusian-sober');
  await expect(dialog).toHaveCSS('border-radius', '0px');
  await expect(page.locator('.order-dialog__header')).toHaveCSS('background-color', 'rgb(20, 80, 55)');
  const basketMascotDecoration = await page.locator('.mascot--basket .mascot__shape').evaluate(
    (element) => getComputedStyle(element, '::before').backgroundColor,
  );
  expect(basketMascotDecoration).toBe('rgba(0, 0, 0, 0)');
});

test('desktop catalog header is compact and mascot-led without yellow decoration', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop catalog composition');
  await page.goto('/es/catalogo/');

  const mascot = page.locator('.mascot--catalog');
  const copy = page.locator('.catalog-page__copy');
  const notice = page.locator('.catalog-page__notice');
  const [mascotBox, copyBox, noticeBox] = await Promise.all([mascot.boundingBox(), copy.boundingBox(), notice.boundingBox()]);
  expect(mascotBox!.x).toBeLessThan(copyBox!.x);
  expect(noticeBox!.x).toBeGreaterThan(copyBox!.x);
  expect(Math.abs(noticeBox!.y - copyBox!.y)).toBeLessThan(24);
  await expect(notice).toHaveCSS('font-size', '14px');
  const decoration = await page.locator('.mascot--catalog .mascot__shape').evaluate(
    (element) => getComputedStyle(element, '::before').content,
  );
  expect(decoration).toBe('none');
});
