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
});

test('catalog has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
