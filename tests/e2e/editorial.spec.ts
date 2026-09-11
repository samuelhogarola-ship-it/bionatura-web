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

test('editorial layouts remain readable at the configured viewport', async ({ page, isMobile }) => {
  await page.goto('/es/huerto-recetas/');

  const columns = await page.locator('.editorial-index__grid').evaluate((grid) =>
    getComputedStyle(grid).gridTemplateColumns.split(' ').length,
  );
  expect(columns).toBe(isMobile ? 1 : 3);

  await page.getByRole('link', { name: /Ensalada de tomate/i }).click();
  const article = page.locator('.editorial-article');
  await expect(article).toBeVisible();
  await expect(article).toHaveCSS('overflow-x', 'hidden');

  const heroRatio = await article.locator('.editorial-article__hero img').evaluate((image: HTMLImageElement) =>
    image.getBoundingClientRect().width / image.getBoundingClientRect().height,
  );
  expect(heroRatio).toBeGreaterThan(1.2);
  expect(heroRatio).toBeLessThan(1.5);
});
