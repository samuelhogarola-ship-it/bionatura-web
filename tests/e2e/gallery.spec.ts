import { expect, test } from '@playwright/test';

test('gallery renders all real images with responsive, accessible loading metadata', async ({ page }) => {
  await page.goto('/fi/galleria/');
  const images = page.locator('main .gallery-grid img');

  await expect(images).toHaveCount(11);
  for (let index = 0; index < 11; index += 1) {
    const image = images.nth(index);
    await expect(image).toHaveAttribute('width', /\d+/);
    await expect(image).toHaveAttribute('height', /\d+/);
    await expect(image).toHaveAttribute('alt', /.+/);
    await expect(image).toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('srcset', /.+/);
    await expect(image).toHaveAttribute('sizes', /.+/);
  }
});

test('lightbox closes with Escape, restores focus and labels navigation', async ({ page }) => {
  await page.goto('/es/galeria/');
  const firstThumbnail = page.getByRole('button', { name: /ampliar/i }).first();

  await firstThumbnail.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: /imagen anterior/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /imagen siguiente/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(firstThumbnail).toBeFocused();
});

test('unavailable demo video does not load a fake source', async ({ page }) => {
  await page.goto('/es/galeria/');

  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('video source')).toHaveCount(0);
  await expect(page.getByText(/vídeo pendiente de incorporar/i)).toBeVisible();
});
