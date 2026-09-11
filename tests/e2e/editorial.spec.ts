import { expect, test } from '@playwright/test';

test('article canonical and alternates map the same item', async ({ page }) => {
  await page.goto('/es/huerto-recetas/ensalada-tomate-cebolla-roja-aceite-oliva-bio/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/es\/huerto-recetas\/ensalada-/);
  for (const language of ['es', 'en', 'fi', 'da', 'x-default']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveCount(1);
  }
});

test('index exposes six useful entries and detail renders visible recipe facts', async ({ page }) => {
  await page.goto('/es/huerto-recetas/');

  await expect(page.getByRole('heading', { level: 1, name: 'Huerto y recetas' })).toBeVisible();
  const cards = page.locator('article.editorial-card');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('time[datetime]')).toHaveCount(6);
  await expect(cards.first().locator('img')).toHaveAttribute('srcset', /.+/);

  await page.getByRole('link', { name: /Ensalada de tomate/i }).click();

  await expect(page.getByRole('heading', { level: 1, name: /Ensalada de tomate/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ingredientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Preparación' })).toBeVisible();
  await expect(page.locator('time')).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: /catálogo/i })).toHaveAttribute('href', '/es/catalogo/');

  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(breadcrumb.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/es/');
  await expect(breadcrumb.getByRole('link', { name: 'Huerto y recetas' })).toHaveAttribute('href', '/es/huerto-recetas/');
  await expect(breadcrumb.locator('[aria-current="page"]')).toContainText('Ensalada de tomate');
});

test('keyboard focus remains visible on clipped editorial cards', async ({ page }) => {
  await page.goto('/es/huerto-recetas/');

  const firstCard = page.locator('article.editorial-card').first();
  const firstCardLink = firstCard.locator('.editorial-card__link');
  for (let presses = 0; presses < 30; presses += 1) {
    if (await firstCardLink.evaluate((link) => link === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }

  await expect(firstCardLink).toBeFocused();
  await expect(firstCard).toHaveCSS('box-shadow', /rgb\(7, 95, 186\).*inset/);
});

test('editorial layouts remain readable at the configured viewport', async ({ page, isMobile }) => {
  await page.goto('/es/huerto-recetas/');

  const columns = await page.locator('.editorial-index__grid').evaluate((grid) =>
    getComputedStyle(grid).gridTemplateColumns.split(' ').length,
  );
  expect(columns).toBe(isMobile ? 1 : 3);

  await page.getByRole('link', { name: /Ensalada de tomate/i }).click();
  const article = page.locator('.editorial-article');
  await expect(article).toBeVisible();
  const articleWidth = await article.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(articleWidth.scrollWidth).toBeLessThanOrEqual(articleWidth.clientWidth);
  const pageWidth = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(pageWidth.scrollWidth).toBeLessThanOrEqual(pageWidth.clientWidth);

  const heroRatio = await article.locator('.editorial-article__hero img').evaluate((image: HTMLImageElement) =>
    image.getBoundingClientRect().width / image.getBoundingClientRect().height,
  );
  expect(heroRatio).toBeGreaterThan(1.2);
  expect(heroRatio).toBeLessThan(1.5);
});

test('tablet index uses two card columns without horizontal overflow', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Tablet coverage runs once in the desktop browser project');
  await page.setViewportSize({ width: 800, height: 1024 });
  await page.goto('/es/huerto-recetas/');

  const grid = page.locator('.editorial-index__grid');
  const columns = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(columns).toBe(2);
  const indexWidth = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(indexWidth.scrollWidth).toBeLessThanOrEqual(indexWidth.clientWidth);

  await page.getByRole('link', { name: /Ensalada de tomate/i }).click();
  const article = page.locator('.editorial-article');
  const articleWidth = await article.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(articleWidth.scrollWidth).toBeLessThanOrEqual(articleWidth.clientWidth);
});
