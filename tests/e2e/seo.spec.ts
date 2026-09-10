import { expect, test } from '@playwright/test';

test('catalog emits canonical and all language alternates', async ({ page }) => {
  await page.goto('/en/catalog/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bionatura.es/en/catalog/');
  for (const lang of ['es', 'en', 'fi', 'da', 'x-default']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1);
  }
});

test('structured data contains only confirmed Organization and breadcrumb facts', async ({ page }) => {
  await page.goto('/es/contacto/');
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(2);
  const json = await scripts.allTextContents();
  const structuredData = json.join('\n');

  expect(structuredData).toContain('Bionatura del Sur S.L.');
  expect(structuredData).toContain('B92371301');
  expect(structuredData).toContain('Calle Tórtolas, 11');
  expect(structuredData).toContain('29640');
  expect(structuredData).toContain('BreadcrumbList');
  expect(structuredData).not.toContain('telephone');
  expect(structuredData).not.toContain('pickup');
  expect(structuredData).not.toContain('LocalBusiness');
  expect(structuredData).not.toContain('Product');
  expect(structuredData).not.toContain('Offer');
});

test('legal identity is visible on legal pages but not presented as a shop or collection point', async ({ page }) => {
  await page.goto('/es/aviso-legal/');
  await expect(page.getByText('Bionatura del Sur S.L.')).toBeVisible();
  await expect(page.getByText('B92371301')).toBeVisible();
  await expect(page.getByText(/Calle Tórtolas, 11.*29640 Fuengirola/)).toBeVisible();
  await expect(page.getByText(/domicilio social/i)).toBeVisible();

  await page.goto('/es/');
  await expect(page.getByText('B92371301')).toHaveCount(0);
  await expect(page.getByText('Calle Tórtolas, 11')).toHaveCount(0);
});

test('404 is useful and excluded from indexing', async ({ page }) => {
  const response = await page.goto('/404.html');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  for (const label of ['Español', 'English', 'Suomi', 'Dansk']) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }
});

