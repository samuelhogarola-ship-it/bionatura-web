import { expect, test } from '@playwright/test';

test('confirmed WhatsApp action includes the selected products and verified recipient', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu cesta/i }).click();

  const whatsapp = page.getByRole('dialog').getByRole('link', { name: /consultar por whatsapp/i });
  await expect(whatsapp).toHaveAttribute('href', /https:\/\/wa\.me\/34635648872\?text=/);
  await expect(whatsapp).toHaveAttribute('href', /Tomates%3A%201%20kg/);
  await expect(whatsapp).toHaveAttribute('target', '_blank');
});

test('floating WhatsApp control uses a recognizable icon and the confirmed number', async ({ page }) => {
  await page.goto('/es/');

  const whatsapp = page.locator('.floating-whatsapp');
  await expect(whatsapp).toHaveAttribute('href', /https:\/\/wa\.me\/34635648872/);
  await expect(whatsapp.locator('svg')).toHaveCount(1);
  await expect(whatsapp).not.toContainText(/^W$/);
});
