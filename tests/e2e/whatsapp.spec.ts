import { expect, test } from '@playwright/test';

test('demo mode shows a copyable message and no invented recipient', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();

  await expect(page.getByRole('button', { name: /copiar mensaje/i })).toBeVisible();
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', '/es/contacto/');
});

test('copy action creates a localized message only after a click', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await page.getByRole('button', { name: /copiar mensaje/i }).click();

  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('Tomates: 1 kg');
});

test('failed clipboard fallback keeps a selectable manual message and reports failure honestly', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('clipboard unavailable')) },
    });
    document.execCommand = () => false;
  });

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await page.getByRole('button', { name: /copiar mensaje/i }).click();

  const manualMessage = page.getByRole('textbox', { name: /copiar mensaje/i });
  await expect(manualMessage).toBeVisible();
  await expect(manualMessage).toHaveAttribute('readonly', '');
  await expect(manualMessage).toHaveValue(/Tomates: 1 kg/);
  await expect(page.getByRole('dialog')).toContainText(/no se pudo copiar/i);
  await expect(page.getByRole('dialog')).not.toContainText('Mensaje copiado.');
});

test('clipboard and fallback exceptions still expose the manual message', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => { throw new Error('clipboard exception'); } },
    });
    document.execCommand = () => { throw new Error('fallback exception'); };
  });

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await page.getByRole('button', { name: /copiar mensaje/i }).click();

  await expect(page.getByRole('textbox', { name: /copiar mensaje/i })).toBeVisible();
  await expect(page.getByRole('dialog')).toContainText(/no se pudo copiar/i);
});

test('successful legacy fallback restores focus to Copy before hiding its textarea', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-07-15T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    document.execCommand = () => true;
  });

  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  const copyButton = page.getByRole('button', { name: /copiar mensaje/i });
  await copyButton.click();

  await expect(copyButton).toBeFocused();
  await expect(page.locator('[data-copy-fallback]')).toBeHidden();
  await expect(page.getByRole('dialog')).toContainText('Mensaje copiado.');
});

test('pending contact pages explicitly identify demo mode in every locale', async ({ page }) => {
  for (const path of ['/es/contacto/', '/en/contact/', '/fi/yhteystiedot/', '/da/kontakt/']) {
    await page.goto(path);
    await expect(page.locator('main')).toContainText(/demo/i);
  }
});
