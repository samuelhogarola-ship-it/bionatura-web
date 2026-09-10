import { expect, test } from '@playwright/test';

test.describe('mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile navigation behavior');

  test('menu is keyboard operable and compact language selector preserves the current page', async ({ page }) => {
    await page.goto('/es/catalogo/');
    const trigger = page.getByRole('button', { name: /menú/i });

    await trigger.click();
    await expect(page.getByRole('navigation', { name: /principal/i })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();

    await expect(page.locator('.site-header__utility')).toHaveCount(0);
    await page.getByRole('combobox', { name: /idioma/i }).selectOption('en');
    await expect(page).toHaveURL(/\/en\/catalog\/$/);
  });

  test('focus remains inside the open menu and wraps in both directions', async ({ page }) => {
    await page.goto('/es/catalogo/');
    await page.getByRole('button', { name: /menú/i }).click();

    const mobileNavigation = page.locator('[data-menu-panel]').getByRole('navigation', { name: /principal/i });
    const firstLink = mobileNavigation.getByRole('link', { name: 'Inicio', exact: true });
    const lastLink = mobileNavigation.getByRole('link', { name: 'Contacto', exact: true });
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
    await expect(page.getByRole('link', { name: /cómo funciona/i })).toHaveCount(0);
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
