# Bionatura Local SEO and Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a four-language “Huerto y recetas” section with six useful articles, local on-page SEO, complete alternates, internal links, and truthful Article/Recipe structured data.

**Architecture:** Store the six editorial records in one typed Astro data module keyed by stable IDs, with localized slugs and complete localized bodies. Add dedicated static index/detail routes because article URLs require per-item canonicals and language alternates; extend the existing layout metadata and navigation APIs so ordinary pages and editorial pages share rendering without pretending that the registered office is a shop.

**Tech Stack:** Astro 5, TypeScript, Astro image pipeline, Vitest, Playwright, `@astrojs/sitemap`, JSON-LD.

**Spec:** `docs/superpowers/specs/2026-09-11-bionatura-local-seo-editorial-design.md`

## Global Constraints

- Publish every editorial index and item in `es`, `en`, `fi`, and `da`.
- Keep Spanish as `x-default` and preserve localized slugs with reciprocal `hreflang` links.
- Do not add `meta keywords`, keyword stuffing, doorway pages, hidden text, invented ratings, prices, stock, opening hours, certifications, health claims, delivery, or testimonials.
- Keep Calle Tórtolas as the registered office only; do not emit `LocalBusiness` or identify it as a public shop or pickup point.
- Reuse local images and the existing responsive image pipeline; add no CMS, database, client framework, comments, ratings, or search.
- Structured data must describe content that is visible on the same page.
- Preserve order-list, WhatsApp, catalog, gallery, legal, and navigation behavior.

---

### Task 1: Typed editorial domain and localized content

**Files:**
- Create: `src/domain/editorial.ts`
- Create: `src/data/editorial.ts`
- Test: `tests/unit/editorial.test.ts`

**Interfaces:**
- Consumes: `Locale` from `src/i18n/config.ts`, catalog product IDs from `src/data/products.ts`, `ImageMetadata` from Astro.
- Produces: `EditorialItem`, `EditorialLocaleContent`, `RecipeContent`, `editorialItems`, `editorialItemBySlug(locale, slug)`, `editorialPath(locale, item)`, `editorialAlternates(item)`, and `assertValidEditorial(items, productIds)`.

- [ ] **Step 1: Write failing validation and routing tests**

```ts
import { describe, expect, it } from 'vitest';
import { editorialAlternates, editorialItemBySlug, editorialItems, editorialPath } from '../../src/data/editorial';

describe('editorial content', () => {
  it('contains six complete items in four locales', () => {
    expect(editorialItems).toHaveLength(6);
    for (const item of editorialItems) expect(Object.keys(item.locales).sort()).toEqual(['da', 'en', 'es', 'fi']);
  });
  it('resolves localized slugs and reciprocal paths', () => {
    const item = editorialItemBySlug('es', 'ensalada-tomate-cebolla-roja-aceite-oliva-bio');
    expect(item?.id).toBe('tomato-red-onion-salad');
    expect(editorialPath('en', item!)).toBe('/en/garden-recipes/tomato-red-onion-organic-olive-oil-salad/');
    expect(editorialAlternates(item!)).toHaveLength(5);
  });
  it('keeps recipe data complete and product relations valid', () => {
    for (const item of editorialItems.filter((entry) => entry.type === 'recipe')) {
      expect(item.recipe?.ingredients.es.length).toBeGreaterThan(0);
      expect(item.recipe?.instructions.es.length).toBeGreaterThan(0);
      expect(item.relatedProductIds.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails because the editorial modules do not exist**

Run: `npm run test:unit -- tests/unit/editorial.test.ts`

Expected: FAIL resolving `../../src/data/editorial`.

- [ ] **Step 3: Implement discriminated editorial types and validation**

```ts
export type Localized<T> = Record<Locale, T>;
export interface EditorialSection { heading: string; paragraphs: string[] }
export interface EditorialLocaleContent {
  slug: string; title: string; description: string; intro: string;
  imageAlt: string; sections: EditorialSection[]; ctaLabel: string;
}
export interface RecipeContent {
  yield: Localized<string>; prepTime: string; cookTime?: string;
  ingredients: Localized<string[]>; instructions: Localized<string[]>;
}
export interface EditorialItem {
  id: string; type: 'article' | 'recipe'; publishedAt: string; modifiedAt?: string;
  image: ImageMetadata; locales: Localized<EditorialLocaleContent>;
  relatedProductIds: string[]; relatedArticleIds: string[]; recipe?: RecipeContent;
}
```

Implement validation that throws on missing locales, duplicate localized slugs, invalid product/article references, self-relations, or incomplete recipe fields.

- [ ] **Step 4: Add all six approved items with complete human-readable copy in all four locales**

Use stable IDs:

```ts
export const editorialIds = [
  'seasonal-produce-fuengirola',
  'choose-garden-tomatoes',
  'tomato-red-onion-salad',
  'simple-mediterranean-courgettes',
  'organic-and-local-produce',
  'los-pacos-garden-to-basket',
] as const;
```

Use `mixed-leaf-rows`, `tomato-harvest`, tomato/red-onion/olive-oil product imagery, courgette imagery, `market-stall-display`, and `grower-greenhouse` as the six visible images. Recipe copy must include exact serving yield, ISO 8601 times, ingredients, and ordered steps. Claims must remain within the approved spec.

- [ ] **Step 5: Run the focused test until all editorial invariants pass**

Run: `npm run test:unit -- tests/unit/editorial.test.ts`

Expected: 3 tests passed.

- [ ] **Step 6: Commit the content model**

```bash
git add src/domain/editorial.ts src/data/editorial.ts tests/unit/editorial.test.ts
git commit -m "feat: add localized editorial content model"
```

### Task 2: Localized editorial routing and metadata API

**Files:**
- Modify: `src/i18n/config.ts`
- Modify: `src/components/SeoHead.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Create: `src/pages/[locale]/[editorial]/index.astro`
- Create: `src/pages/[locale]/[editorial]/[article].astro`
- Test: `tests/unit/i18n.test.ts`
- Test: `tests/e2e/editorial.spec.ts`

**Interfaces:**
- Consumes: Task 1 lookup/path helpers.
- Produces: `editorialRoutes`, `editorialIndexPath(locale)`, a flexible `SeoAlternate[]` prop, and 28 static localized editorial routes.

- [ ] **Step 1: Add failing tests for localized index/detail paths and metadata**

```ts
expect(editorialIndexPath('es')).toBe('/es/huerto-recetas/');
expect(editorialIndexPath('fi')).toBe('/fi/puutarha-reseptit/');
```

```ts
test('article canonical and alternates map the same item', async ({ page }) => {
  await page.goto('/es/huerto-recetas/ensalada-tomate-cebolla-roja-aceite-oliva-bio/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/es\/huerto-recetas\/ensalada-/);
  for (const language of ['es', 'en', 'fi', 'da', 'x-default']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveCount(1);
  }
});
```

- [ ] **Step 2: Run the new tests and confirm the missing APIs/routes fail**

Run: `npm run test:unit -- tests/unit/i18n.test.ts && npx playwright test tests/e2e/editorial.spec.ts`

Expected: FAIL because editorial paths and routes do not exist.

- [ ] **Step 3: Add localized editorial index route names**

```ts
export const editorialRoutes: Record<Locale, string> = {
  es: 'huerto-recetas', en: 'garden-recipes', fi: 'puutarha-reseptit', da: 'have-opskrifter',
};
export const editorialIndexPath = (locale: Locale) => `/${locale}/${editorialRoutes[locale]}/`;
```

Do not insert article details into `PageKey`; their URLs and alternates are item-specific.

- [ ] **Step 4: Generalize layout metadata without changing ordinary-page output**

Allow `SeoHead` and `SiteLayout` to accept optional `canonicalPath`, `alternates`, `ogType`, `publishedAt`, and `modifiedAt`. Default to the current `PageKey` behavior so all existing routes remain unchanged.

```ts
export interface SeoAlternate { locale: Locale | 'x-default'; href: string }
```

- [ ] **Step 5: Generate all index and detail paths statically**

The index route validates `[editorial] === editorialRoutes[locale]`. The detail route returns one path per locale/item and passes the localized canonical and reciprocal alternates to `SiteLayout`.

- [ ] **Step 6: Run routing tests and build**

Run: `npm run test:unit -- tests/unit/i18n.test.ts && npx playwright test tests/e2e/editorial.spec.ts && npm run build`

Expected: all focused tests pass and Astro builds 28 editorial pages.

- [ ] **Step 7: Commit localized routing**

```bash
git add src/i18n/config.ts src/components/SeoHead.astro src/layouts/SiteLayout.astro src/pages tests/unit/i18n.test.ts tests/e2e/editorial.spec.ts
git commit -m "feat: add localized editorial routes"
```

### Task 3: Editorial index, article, recipe, and breadcrumb UI

**Files:**
- Create: `src/components/editorial/EditorialCard.astro`
- Create: `src/components/editorial/EditorialIndex.astro`
- Create: `src/components/editorial/EditorialArticle.astro`
- Create: `src/components/editorial/RecipeDetails.astro`
- Create: `src/components/editorial/RelatedProducts.astro`
- Modify: `src/components/Breadcrumbs.astro`
- Modify: `src/styles/components.css`
- Test: `tests/e2e/editorial.spec.ts`

**Interfaces:**
- Consumes: `EditorialItem`, `Locale`, `productImageFor`, products, `ResponsiveImage`, and catalog paths.
- Produces: semantic index cards, readable article pages, visible recipe facts, related product links, and two/three-level breadcrumbs.

- [ ] **Step 1: Add failing rendering and accessibility assertions**

```ts
test('index exposes six useful entries and detail renders visible recipe facts', async ({ page }) => {
  await page.goto('/es/huerto-recetas/');
  await expect(page.getByRole('heading', { level: 1, name: 'Huerto y recetas' })).toBeVisible();
  await expect(page.locator('article.editorial-card')).toHaveCount(6);
  await page.getByRole('link', { name: /Ensalada de tomate/i }).click();
  await expect(page.getByRole('heading', { name: 'Ingredientes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Preparación' })).toBeVisible();
  await expect(page.locator('time')).toBeVisible();
  await expect(page.getByRole('link', { name: /catálogo/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the focused browser test and confirm missing UI failures**

Run: `npx playwright test tests/e2e/editorial.spec.ts`

Expected: FAIL on absent index/detail content.

- [ ] **Step 3: Build the index and card components**

Render one semantic H1, localized intro, six linked cards, real responsive images, localized type/date labels, and no client-side filtering. The index must use the established pale-green section tone and existing spacing tokens.

- [ ] **Step 4: Build article, recipe, related-products, and related-articles blocks**

Use `time datetime`, semantic `section`, `ul` ingredients, `ol` instructions, descriptive links, and one restrained mascot CTA. Related products use existing product names/images and point to the localized catalog rather than inventing standalone product detail URLs.

- [ ] **Step 5: Extend breadcrumbs with explicit trail items**

```ts
interface BreadcrumbItem { label: string; href?: string }
```

Keep ordinary two-level behavior as the default and pass home/index/current items from editorial detail pages.

- [ ] **Step 6: Add responsive styles and verify mobile/desktop layouts**

Use CSS grid with one column on narrow screens and two or three cards when space permits. Hero images must preserve aspect ratio; reading copy must stay at a comfortable maximum width; ingredients and instructions must stack on mobile without horizontal overflow.

Run: `npx playwright test tests/e2e/editorial.spec.ts --project=chromium-mobile && npx playwright test tests/e2e/editorial.spec.ts --project=chromium-desktop`

Expected: all editorial interaction and layout assertions pass in both projects.

- [ ] **Step 7: Commit editorial UI**

```bash
git add src/components/editorial src/components/Breadcrumbs.astro src/styles/components.css tests/e2e/editorial.spec.ts
git commit -m "feat: render garden and recipe editorial pages"
```

### Task 4: Navigation, language switching, and local internal links

**Files:**
- Modify: `src/i18n/ui.ts`
- Modify: `src/components/navigation/Header.astro`
- Modify: `src/components/navigation/MobileMenu.astro`
- Modify: `src/components/navigation/LanguageSwitcher.astro`
- Modify: `src/components/navigation/Footer.astro`
- Modify: `src/components/pages/HomePage.astro`
- Modify: `src/components/pages/AboutPage.astro`
- Modify: `src/components/pages/ContactPage.astro`
- Modify: `src/components/catalog/CatalogPage.astro`
- Test: `tests/unit/i18n.test.ts`
- Test: `tests/e2e/navigation.spec.ts`
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `editorialIndexPath`, `editorialPath`, and localized editorial labels.
- Produces: discoverable editorial navigation and context-aware language links for both index and detail pages.

- [ ] **Step 1: Add failing tests for locale parity, navigation, and internal links**

Assert every locale has `navEditorial`; desktop/mobile navigation show the editorial label; footer contains the editorial link; language switching on an article preserves its stable item; home links one featured guide; About and Contact link the Los Pacos article; catalog exposes relevant recipe links.

- [ ] **Step 2: Run focused tests and confirm they fail**

Run: `npm run test:unit -- tests/unit/i18n.test.ts && npx playwright test tests/e2e/navigation.spec.ts tests/e2e/pages.spec.ts`

Expected: FAIL on missing labels and links.

- [ ] **Step 3: Add the localized navigation label**

```ts
navEditorial: {
  es: 'Huerto y recetas', en: 'Garden & recipes', fi: 'Puutarha ja reseptit', da: 'Have og opskrifter'
}
```

Represent navigation destinations as `href` plus label rather than forcing the editorial index into ordinary `PageKey` routing.

- [ ] **Step 4: Make language switching accept explicit localized destinations**

Add an optional `links` prop to `LanguageSwitcher`; existing pages keep `alternateLinks(page)`, while editorial index/detail pages pass their own reciprocal destinations.

- [ ] **Step 5: Add editorial links to navigation, footer, and relevant page content**

Use varied descriptive anchors. Keep the header compact at existing breakpoints and update the mobile focus-wrap test so the actual last link is asserted after adding the editorial item.

- [ ] **Step 6: Run focused navigation and page tests**

Run: `npm run test:unit -- tests/unit/i18n.test.ts && npx playwright test tests/e2e/navigation.spec.ts tests/e2e/pages.spec.ts`

Expected: all locale, navigation, and internal-link assertions pass.

- [ ] **Step 7: Commit navigation and linking**

```bash
git add src/i18n/ui.ts src/components/navigation src/components/pages src/components/catalog/CatalogPage.astro tests/unit/i18n.test.ts tests/e2e/navigation.spec.ts tests/e2e/pages.spec.ts
git commit -m "feat: connect editorial content across the site"
```

### Task 5: Local metadata and structured data

**Files:**
- Modify: `src/i18n/pages/home.ts`
- Modify: `src/i18n/pages/catalog.ts`
- Modify: `src/i18n/pages/about.ts`
- Modify: `src/i18n/pages/contact.ts`
- Modify: `src/i18n/pages/gallery.ts`
- Modify: `src/components/StructuredData.astro`
- Create: `src/components/editorial/EditorialStructuredData.astro`
- Test: `tests/e2e/seo.spec.ts`
- Test: `tests/e2e/editorial.spec.ts`

**Interfaces:**
- Consumes: confirmed `business` facts, editorial item data, canonical URLs, and visible recipe/article content.
- Produces: localized search snippets plus truthful `WebSite`, `Organization`, `BreadcrumbList`, `CollectionPage`, `ItemList`, `Article`, and `Recipe` JSON-LD.

- [ ] **Step 1: Add failing SEO assertions**

```ts
test('Spanish pages use specific local titles and descriptions', async ({ page }) => {
  await page.goto('/es/');
  await expect(page).toHaveTitle(/productos biológicos.*Fuengirola/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Los Pacos|Fuengirola/i);
  await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
});
```

Assert recipe JSON-LD mirrors visible yield, times, ingredients, and steps; article JSON-LD has correct type/author/dates/image; organization contains `areaServed: Fuengirola` but never `LocalBusiness`, pickup, Offer, ratings, prices, or hours.

- [ ] **Step 2: Run SEO tests and confirm current metadata/schema fail the new expectations**

Run: `npx playwright test tests/e2e/seo.spec.ts tests/e2e/editorial.spec.ts`

Expected: FAIL on local titles and missing editorial schemas.

- [ ] **Step 3: Rewrite page titles and descriptions naturally in all locales**

Spanish examples:

```ts
title: 'Productos biológicos en Fuengirola | Bionatura',
description: 'Productos biológicos y de temporada en Fuengirola, cultivados en el huerto de Los Pacos. Consulta el catálogo y prepara tu cesta con Bionatura.',
```

Give catalog, About, Contact, and Gallery unique intent-specific copy; translate the intent naturally rather than copying Spanish keywords.

- [ ] **Step 4: Extend site-wide structured data**

Emit `WebSite`; add `areaServed: { '@type': 'City', name: 'Fuengirola' }` to `Organization`; retain the legal registered address; preserve current breadcrumb facts. Do not emit a telephone until its inclusion is deliberately approved for schema and matches visible site content.

- [ ] **Step 5: Add collection/article/recipe JSON-LD matching visible content**

Use absolute image and page URLs. Recipe instructions use `HowToStep` objects. Only recipe records emit `Recipe`; other records emit `Article`. The editorial index emits `CollectionPage` and `ItemList` entries for exactly the six visible cards.

- [ ] **Step 6: Run SEO tests and inspect generated HTML**

Run: `npx playwright test tests/e2e/seo.spec.ts tests/e2e/editorial.spec.ts && npm run build && rg -n 'Recipe|Article|CollectionPage|hreflang' dist/es/huerto-recetas -g '*.html'`

Expected: tests pass, build succeeds, and generated editorial HTML contains its matching metadata/schema.

- [ ] **Step 7: Commit SEO metadata and schema**

```bash
git add src/i18n/pages src/components/StructuredData.astro src/components/editorial/EditorialStructuredData.astro tests/e2e/seo.spec.ts tests/e2e/editorial.spec.ts
git commit -m "feat: strengthen local SEO and editorial schema"
```

### Task 6: Full regression, sitemap, and delivery

**Files:**
- Modify only files required to fix failures found by the commands below.
- Test: all files under `tests/unit/` and `tests/e2e/`.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: production-ready static output with indexed editorial URLs and no regressions.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Expected: all unit and Playwright tests pass; viewport-specific skips remain intentional.

- [ ] **Step 2: Run a clean production build**

Run: `npm run build`

Expected: Astro check and build exit successfully.

- [ ] **Step 3: Verify sitemap coverage and indexing controls**

Run: `rg -o 'https://bionatura\.es/(es/huerto-recetas|en/garden-recipes|fi/puutarha-reseptit|da/have-opskrifter)[^<]*' dist/sitemap-*.xml | sort -u | wc -l`

Expected: `28` unique editorial URLs. Confirm `public/robots.txt` still points to `https://bionatura.es/sitemap-index.xml` and no editorial page contains `noindex`.

- [ ] **Step 4: Verify the repository diff and tracked assets**

Run: `git diff --check && git status --short && git diff --stat HEAD~5..HEAD`

Expected: no whitespace errors or unintended generated files; only planned source, tests, and documentation are tracked.

- [ ] **Step 5: Confirm every implementation change is committed**

Run: `git status --short`

Expected: no output. If an earlier task required a regression fix, return to that task, add its exact modified source and test paths, rerun that task's focused test, and amend that task with a separate `fix:` commit before repeating the full regression commands.

- [ ] **Step 6: Push the completed `main` branch after explicit user approval**

Run: `git push origin main`

Expected: GitHub reports `main -> main`, after which Hostinger can import or redeploy the updated public repository.
