import { expect, test } from '@playwright/test';

type StructuredData = Record<string, unknown>;

async function readStructuredData(page: import('@playwright/test').Page): Promise<StructuredData[]> {
  return Promise.all(
    (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
      async (content) => JSON.parse(content) as StructuredData,
    ),
  );
}

test('Spanish pages use specific local titles and descriptions', async ({ page }) => {
  const pages = [
    ['/es/', /productos biológicos.*Fuengirola/i, /Los Pacos|Fuengirola/i],
    ['/es/catalogo/', /catálogo.*Fuengirola/i, /temporada.*Fuengirola/i],
    ['/es/nosotros/', /Bionatura.*Los Pacos/i, /huerto.*Fuengirola/i],
    ['/es/contacto/', /contacta.*Bionatura.*Fuengirola/i, /Los Pacos.*recogida/i],
    ['/es/galeria/', /huerto.*Los Pacos/i, /Fuengirola/i],
  ] as const;

  for (const [path, title, description] of pages) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
    await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
  }
});

test('catalog emits canonical and all language alternates', async ({ page }) => {
  await page.goto('/en/catalog/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bionatura.es/en/catalog/');
  for (const lang of ['es', 'en', 'fi', 'da', 'x-default']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1);
  }
});

test('structured data describes the website and organization without shop claims', async ({ page }) => {
  await page.goto('/es/contacto/');
  const schemas = await readStructuredData(page);
  const website = schemas.find((schema) => schema['@type'] === 'WebSite');
  const organization = schemas.find((schema) => schema['@type'] === 'Organization');
  const structuredData = JSON.stringify(schemas);

  expect(website).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bionatura',
    url: 'https://bionatura.es/',
  });
  expect(organization).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bionatura del Sur S.L.',
    alternateName: 'Bionatura',
    taxID: 'B92371301',
    areaServed: { '@type': 'City', name: 'Fuengirola' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Tórtolas, 11',
      postalCode: '29640',
      addressLocality: 'Fuengirola',
      addressCountry: 'ES',
    },
  });
  expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true);
  expect(structuredData).not.toContain('telephone');
  expect(structuredData).not.toContain('pickup');
  expect(structuredData).not.toContain('LocalBusiness');
  expect(structuredData).not.toContain('Product');
  expect(structuredData).not.toContain('Offer');
  expect(structuredData).not.toContain('AggregateRating');
  expect(structuredData).not.toContain('openingHours');
  expect(structuredData).not.toContain('price');
});

test('legal identity is visible on legal pages but not presented as a shop or collection point', async ({ page }) => {
  await page.goto('/es/aviso-legal/');
  await expect(page.getByText('Bionatura del Sur S.L.')).toBeVisible();
  await expect(page.getByText('B92371301')).toBeVisible();
  await expect(page.getByText(/Calle Tórtolas, 11.*29640 Fuengirola/)).toBeVisible();
  await expect(page.getByRole('heading', { name: /domicilio social/i })).toBeVisible();

  await page.goto('/es/');
  await expect(page.getByText('B92371301')).toHaveCount(0);
  await expect(page.getByText('Calle Tórtolas, 11')).toHaveCount(0);
});

test('legal notices present the owner in a professional document without internal validation language', async ({ page }) => {
  const notices = [
    ['/es/aviso-legal/', /Información identificativa del titular de este sitio web\./i],
    ['/en/legal-notice/', /Identification details of the owner of this website\./i],
    ['/fi/oikeudellinen-huomautus/', /Tämän verkkosivuston omistajan tunnistetiedot\./i],
    ['/da/juridisk-meddelelse/', /Identifikationsoplysninger om ejeren af dette websted\./i],
  ] as const;

  for (const [path, introduction] of notices) {
    await page.goto(path);
    const article = page.locator('article.legal-page');
    await expect(article.locator('.legal-page__intro')).toHaveText(introduction);
    await expect(article).not.toContainText(/confirmad|pendiente|pending|vahvist|afventer/i);
    await expect(article.locator('dl.legal-identity')).toBeVisible();
  }
});

test('404 is useful and excluded from indexing', async ({ page }) => {
  const response = await page.goto('/404.html');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  for (const label of ['Español', 'English', 'Suomi', 'Dansk']) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }
});
