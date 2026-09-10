import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('mobile menu is keyboard operable and preserves page on language change', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const trigger = page.getByRole('button', { name: /menú/i });

  await trigger.click();
  await expect(page.getByRole('navigation', { name: /principal/i })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/catalog\/$/);
});
