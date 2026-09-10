import { expect, test } from '@playwright/test';

test('Spanish home explains offer, place and process above the fold', async ({ page }) => {
  await page.goto('/es/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Bionatura|Fuengirola/);
  await expect(page.getByRole('link', { name: /prepara tu pedido/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /ver catálogo/i }).first()).toBeVisible();
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.home-hero img')).toHaveAttribute('loading', 'eager');
});

test('the localized narrative pages expose their complete core content', async ({ page }) => {
  const cases = [
    ['/en/about/', /About us/i, /Gallery/i],
    ['/fi/miten-se-toimii/', /Näin se toimii/i, /Mitä tapahtuu seuraavaksi/i],
    ['/da/kontakt/', /Kontakt/i, /afventer bekræftelse/i],
  ] as const;

  for (const [path, heading, detail] of cases) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.getByText(detail).first()).toBeVisible();
  }
});

test('contact page does not expose unconfirmed contact or pickup fields', async ({ page }) => {
  await page.goto('/es/contacto/');

  await expect(page.getByText(/pendiente de confirmar/i).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(page.getByText('Calle Tórtolas, 11')).toHaveCount(0);
  await expect(page.getByText(/punto de recogida/i)).toHaveCount(0);
});

