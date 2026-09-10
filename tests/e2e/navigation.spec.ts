import { expect, test } from '@playwright/test';

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile navigation behavior');

  test('menu is keyboard operable and preserves page on language change', async ({ page }) => {
    await page.goto('/es/catalogo/');
    const trigger = page.getByRole('button', { name: /menú/i });

    await trigger.click();
    await expect(page.getByRole('navigation', { name: /principal/i })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();

    await page.getByRole('link', { name: 'English' }).click();
    await expect(page).toHaveURL(/\/en\/catalog\/$/);
  });

  test('focus remains inside the open menu and wraps in both directions', async ({ page }) => {
    await page.goto('/es/catalogo/');
    await page.getByRole('button', { name: /menú/i }).click();

    const firstLink = page.getByRole('link', { name: 'Inicio', exact: true });
    const lastLink = page.getByRole('link', { name: 'Contacto', exact: true });
    await expect(firstLink).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(lastLink).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(firstLink).toBeFocused();
  });
});

test.describe('desktop navigation', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop navigation behavior');

  test('uses the configured desktop viewport and displays the full navigation', async ({ page }) => {
    await page.goto('/es/catalogo/');

    expect(page.viewportSize()?.width).toBeGreaterThanOrEqual(1200);
    await expect(page.locator('.desktop-navigation')).toBeVisible();
    await expect(page.locator('[data-menu-trigger]')).toBeHidden();
  });

  test('closing breakpoint clears mobile menu state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/es/catalogo/');

    const trigger = page.locator('[data-menu-trigger]');
    const panel = page.locator('[data-menu-panel]');
    await trigger.click();
    await expect(page.locator('html')).toHaveClass(/menu-open/);

    await page.setViewportSize({ width: 1200, height: 844 });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/menu-open/);
  });
});
