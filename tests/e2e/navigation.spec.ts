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
    const language = page.locator('.language-switcher');
    await expect(language.locator('.language-switcher__flag')).toHaveText('🇪🇸');
    await language.getByRole('button', { name: /idioma/i }).click();
    await language.getByRole('link', { name: 'English', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/catalog\/$/);
  });

  test('focus remains inside the open menu and wraps in both directions', async ({ page }) => {
    await page.goto('/es/catalogo/');
    await page.getByRole('button', { name: /menú/i }).click();

    const mobileNavigation = page.locator('[data-menu-panel]').getByRole('navigation', { name: /principal/i });
    const firstLink = mobileNavigation.getByRole('link', { name: 'Inicio', exact: true });
    const lastLink = mobileNavigation.getByRole('link', { name: 'Huerto y recetas', exact: true });
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
    const language = page.locator('.language-switcher');
    await expect(language.locator('.language-switcher__flag')).toHaveText('🇪🇸');
    await expect(language.getByText('ES', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /cómo funciona/i })).toHaveCount(0);
    await expect(page.locator('.desktop-navigation').getByRole('link', { name: 'Huerto y recetas', exact: true })).toHaveAttribute(
      'href',
      '/es/huerto-recetas/',
    );
    const basket = page.getByRole('button', { name: /tu cesta/i });
    await expect(basket.locator('svg')).toBeVisible();
    await expect(basket.locator('[data-order-badge]')).toHaveText('0');
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

  test('Finnish header has no horizontal overflow at the exact 1088px desktop breakpoint', async ({ page }) => {
    await page.setViewportSize({ width: 1088, height: 900 });
    await page.goto('/fi/tuotteet/');

    await expect(page.locator('.desktop-navigation')).toBeVisible();
    await expect(page.locator('[data-menu-trigger]')).toBeHidden();
    const widths = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>('.site-header__main')!;
      return {
        headerClient: header.clientWidth,
        headerScroll: header.scrollWidth,
        pageClient: document.documentElement.clientWidth,
        pageScroll: document.documentElement.scrollWidth,
      };
    });
    expect(widths.headerScroll).toBeLessThanOrEqual(widths.headerClient);
    expect(widths.pageScroll).toBeLessThanOrEqual(widths.pageClient);
  });
});

test('editorial language links are reciprocal across all four locales on indexes and details', async ({ page }) => {
  const labels = { es: 'Español', en: 'English', fi: 'Suomi', da: 'Dansk' } as const;
  const routeSets = [
    {
      es: '/es/huerto-recetas/',
      en: '/en/garden-recipes/',
      fi: '/fi/puutarha-reseptit/',
      da: '/da/have-opskrifter/',
    },
    {
      es: '/es/huerto-recetas/como-elegir-tomates-huerto/',
      en: '/en/garden-recipes/how-to-choose-garden-tomatoes/',
      fi: '/fi/puutarha-reseptit/kuinka-valita-puutarhatomaatteja/',
      da: '/da/have-opskrifter/saadan-vaelger-du-tomater-fra-haven/',
    },
  ] as const;

  for (const routes of routeSets) {
    for (const sourceLocale of ['es', 'en', 'fi', 'da'] as const) {
      await page.goto(routes[sourceLocale]);
      const language = page.locator('.language-switcher');
      await language.locator('summary').click();
      for (const targetLocale of ['es', 'en', 'fi', 'da'] as const) {
        await expect(language.getByRole('link', { name: labels[targetLocale], exact: true })).toHaveAttribute(
          'href',
          routes[targetLocale],
        );
      }
    }
  }
});
