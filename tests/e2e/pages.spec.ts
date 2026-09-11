import { expect, test } from '@playwright/test';

test('Spanish home explains offer, place and process above the fold', async ({ page }) => {
  await page.goto('/es/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Bionatura|Fuengirola/);
  await expect(page.getByRole('link', { name: /prepara tu pedido/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /ver catálogo/i }).first()).toBeVisible();
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('.home-hero img')).toHaveAttribute('loading', 'eager');
  const heroQuality = await page.locator('.home-hero img').evaluate((image: HTMLImageElement) => ({
    currentSrc: image.currentSrc,
    naturalWidth: image.naturalWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(heroQuality.currentSrc).toContain('garden-mixed-leaf-rows-hero-2k');
  expect(heroQuality.naturalWidth).toBeGreaterThanOrEqual(heroQuality.viewportWidth);
  await expect(page.locator('[data-bionatura-mascot] img')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Una selección para empezar' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Productos habituales' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Desde el huerto' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Nuestro huerto' })).toBeVisible();
  const seasonSection = page.locator('.home-season');
  await expect(seasonSection.getByRole('link', { name: 'Ver catálogo' })).toHaveAttribute('href', '/es/catalogo/');
  await expect(page.locator('.home-season')).toHaveCSS('background-color', 'rgb(237, 247, 233)');
  await expect(page.locator('.home-process')).toHaveCSS('background-color', 'rgb(237, 247, 233)');
  await expect(page.locator('[data-bionatura-mascot]')).toContainText('¿Preparamos tu cesta?');
  const mascotWidth = await page.locator('[data-bionatura-mascot]').evaluate((element) => element.getBoundingClientRect().width);
  expect(mascotWidth).toBeGreaterThanOrEqual(300);
  const decorativeBackground = await page.locator('[data-bionatura-mascot] > div').evaluate(
    (element) => getComputedStyle(element, '::before').content,
  );
  expect(decorativeBackground).toBe('none');
  const galleryFigures = page.locator('.home-gallery .gallery-group__images figure');
  const [thirdWidth, fourthWidth] = await Promise.all([
    galleryFigures.nth(2).evaluate((element) => element.getBoundingClientRect().width),
    galleryFigures.nth(3).evaluate((element) => element.getBoundingClientRect().width),
  ]);
  expect(Math.abs(thirdWidth - fourthWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator('main').getByRole('link', { name: /productos de temporada en Fuengirola/i })).toHaveAttribute(
    'href',
    '/es/huerto-recetas/productos-temporada-fuengirola/',
  );
});

test('mascot welcomes once per browser session without blocking the page', async ({ page }) => {
  await page.goto('/es/');

  const welcome = page.locator('[data-mascot-welcome]');
  await expect(welcome).toBeVisible();
  await expect(welcome).toContainText('¡Hola!');
  await expect(page.getByRole('link', { name: /ver catálogo/i }).first()).toBeVisible();
  await welcome.getByRole('button', { name: /cerrar saludo/i }).click();
  await expect(welcome).toBeHidden();

  await page.reload();
  await expect(welcome).toBeHidden();
});

test('mascot guides visitors in catalog and contact', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const catalogMascot = page.locator('[data-mascot-context="catalog"] img');
  await expect(catalogMascot).toBeVisible();
  await expect(catalogMascot).toHaveAttribute('loading', 'eager');

  await page.goto('/es/contacto/');
  await expect(page.locator('[data-mascot-context="contact"] img')).toBeVisible();
});

test('the localized narrative pages expose their complete core content', async ({ page }) => {
  const cases = [
    ['/en/about/', /About us/i, /Gallery/i],
    ['/da/kontakt/', /Kontakt/i, /afventer bekræftelse/i],
  ] as const;

  for (const [path, heading, detail] of cases) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('main').getByText(detail).first()).toBeVisible();
  }
});

test('contact page exposes the confirmed phone and WhatsApp without presenting the registered office as pickup', async ({ page }) => {
  await page.goto('/es/contacto/');

  await expect(page.getByText(/635 648 872/).first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:+34635648872');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('main a[href*="wa.me/34635648872"]')).toBeVisible();
  await expect(page.locator('main')).toContainText(/campo de Los Pacos/i);
  await expect(page.getByText('Calle Tórtolas, 11')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/modo demo/i);
  await expect(page.locator('main').getByRole('link', { name: /huerto de Los Pacos/i })).toHaveAttribute(
    'href',
    '/es/huerto-recetas/del-huerto-los-pacos-a-tu-cesta/',
  );
});

test('About links the local story and catalog links relevant recipes', async ({ page }) => {
  await page.goto('/es/nosotros/');
  await expect(page.locator('main').getByRole('link', { name: /Los Pacos a tu cesta/i })).toHaveAttribute(
    'href',
    '/es/huerto-recetas/del-huerto-los-pacos-a-tu-cesta/',
  );

  await page.goto('/es/catalogo/');
  await expect(page.locator('main').getByRole('link', { name: /ensalada de tomate/i })).toHaveAttribute(
    'href',
    '/es/huerto-recetas/ensalada-tomate-cebolla-roja-aceite-oliva-bio/',
  );
  await expect(page.locator('main').getByRole('link', { name: /calabacines mediterráneos/i })).toHaveAttribute(
    'href',
    '/es/huerto-recetas/calabacines-mediterraneos-sencillos/',
  );
});

test('footer uses the requested local message and credits WF-Studio', async ({ page }) => {
  await page.goto('/es/');

  const footerNote = page.locator('.site-footer__note');
  await expect(footerNote).toHaveText('Tus productos biológicos en Fuengirola');
  await expect(footerNote).toHaveCSS('font-style', 'normal');
  await expect(page.locator('footer').getByRole('link', { name: 'Huerto y recetas', exact: true })).toHaveAttribute(
    'href',
    '/es/huerto-recetas/',
  );
  await expect(page.locator('footer')).toContainText('Web por WF-Studio');
});
