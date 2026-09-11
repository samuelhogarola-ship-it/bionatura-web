import { expect, test } from '@playwright/test';

test('article canonical and alternates map the same item', async ({ page }) => {
  await page.goto('/es/huerto-recetas/ensalada-tomate-cebolla-roja-aceite-oliva-bio/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/es\/huerto-recetas\/ensalada-/);
  for (const language of ['es', 'en', 'fi', 'da', 'x-default']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveCount(1);
  }
});
