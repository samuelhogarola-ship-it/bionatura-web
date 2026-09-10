import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('catalog keeps every season in generated HTML', async ({ request }) => {
  const response = await request.get('/es/catalogo/');
  expect(response.ok()).toBe(true);
  const html = await response.text();

  for (const id of ['spring', 'summer', 'autumn', 'winter']) {
    expect(html).toContain(`data-season-panel="${id}"`);
  }
});

test('September selects autumn and keyboard changes season', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T10:00:00+02:00') });
  await page.goto('/es/catalogo/');

  await expect(page.getByRole('tab', { name: /otoño/i })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: /otoño/i }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: /invierno/i })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: /invierno/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /otoño/i }).getByText(/ahora/i)).toBeVisible();
  await expect(page.getByRole('tab', { name: /invierno/i }).getByText(/ahora/i)).toBeHidden();
});

test('catalog has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('catalog uses real product photography and the approved all-year selection', async ({ page }) => {
  await page.goto('/es/catalogo/');

  await expect(page.getByRole('heading', { name: 'Todo el año' })).toBeVisible();
  await expect(page.getByText('Productos habituales', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Aguacates', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/producto de muestra/i)).toHaveCount(0);
  await expect(page.locator('.product-card img')).toHaveCount(18);
  await expect(page.locator('.product-card img[src*="product-placeholder"]')).toHaveCount(0);
  await expect(page.locator('[data-product-id="egg"] img')).toHaveAttribute('src', /eggs/);
  await expect(page.locator('[data-product-id="birdhouse"] img')).toHaveAttribute('src', /wooden-birdhouses/);
});

test('basket uses the sober Andalusian treatment', async ({ page }) => {
  await page.goto('/es/catalogo/');
  await page.locator('[data-order-open]').click();

  const dialog = page.locator('.order-dialog__surface');
  await expect(dialog).toHaveAttribute('data-basket-style', 'andalusian-sober');
  await expect(dialog).toHaveCSS('border-radius', '0px');
  await expect(page.locator('.order-dialog__header')).toHaveCSS('background-color', 'rgb(20, 80, 55)');
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

test('season rail remains dynamic, responsive and keyboard accessible', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T10:00:00+02:00') });
  await page.goto('/es/catalogo/');

  const rail = page.locator('.season-selector');
  await expect(rail).toHaveAttribute('data-season-style', 'harvest-rail');
  await expect(page.getByRole('tab')).toHaveCount(4);
  const activeTab = page.getByRole('tab', { name: /otoño/i });
  await expect(activeTab).toHaveAttribute('aria-selected', 'true');
  const overflow = await rail.evaluate((element) => ({ width: element.clientWidth, scrollWidth: element.scrollWidth }));
  expect(overflow.scrollWidth).toBeGreaterThanOrEqual(overflow.width);
  const [railBox, activeBox] = await Promise.all([rail.boundingBox(), activeTab.boundingBox()]);
  expect(activeBox!.x).toBeGreaterThanOrEqual(railBox!.x);
  expect(activeBox!.x + activeBox!.width).toBeLessThanOrEqual(railBox!.x + railBox!.width + 1);
});
