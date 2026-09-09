# Bionatura.es Static Multilingual Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y publicar una preview de la nueva web estática de Bionatura.es, multipágina y en cuatro idiomas, con catálogo estacional, lista de consulta y salida manual a WhatsApp.

**Architecture:** Astro genera HTML estático para todas las rutas localizadas. Los datos comerciales, catálogo y traducciones viven fuera de los componentes; pequeños módulos TypeScript controlan temporada, lista local y WhatsApp sin backend ni framework de interfaz. La primera secuencia de tareas entrega la demo del viernes; las últimas preparan contenido definitivo y producción sin tocar DNS hasta recibir autorización.

**Tech Stack:** Astro (salida estática), TypeScript estricto, CSS nativo, Vitest, Playwright, axe-core, npm, GitHub y Vercel.

**Spec:** `docs/superpowers/specs/2026-09-09-bionatura-web-design.md`

## Global Constraints

- Demo objetivo: viernes 11 de septiembre de 2026.
- Idiomas completos: español (`es`), inglés (`en`), finés (`fi`) y danés (`da`).
- Español es el idioma fuente y `/` redirige a `/es/`.
- La web no contiene pagos, checkout, stock en tiempo real, cuentas, base de datos, CMS ni envío automático de mensajes.
- El catálogo es orientativo; la lista enviada por WhatsApp no confirma pedido, disponibilidad ni recogida.
- No se presenta Bionatura como una tienda física convencional.
- No se publican teléfono, dirección, horarios, certificaciones ni datos jurídicos sin validación.
- No se cambia el DNS de `bionatura.es` durante la demo.
- El contenido esencial de catálogo debe existir en el HTML generado.
- JavaScript de cliente queda limitado a navegación móvil, selector de temporada, lista, persistencia local, selector de idioma y WhatsApp.
- La UI es mobile first, navegable por teclado, con contraste WCAG AA, foco visible y soporte para movimiento reducido.
- Objetivos de laboratorio: Lighthouse ≥ 90 en cada categoría, LCP < 2,5 s, CLS < 0,1 e INP < 200 ms.

## File Map

### Build and quality

- `package.json`: scripts y dependencias.
- `astro.config.mjs`: salida estática, sitio, sitemap y configuración de build.
- `tsconfig.json`: TypeScript estricto y alias `@/*`.
- `vitest.config.ts`: pruebas unitarias.
- `playwright.config.ts`: pruebas de navegador contra preview local.
- `vercel.json`: redirección de `/` a `/es/` y cabeceras estáticas.

### Data and domain

- `src/data/business.ts`: datos del negocio y estado de validación.
- `src/data/products.ts`: catálogo único.
- `src/data/media.ts`: metadatos y agrupaciones de fotografías/vídeo.
- `src/domain/catalog.ts`: tipos y validación del catálogo.
- `src/domain/season.ts`: estación actual en `Europe/Madrid`.
- `src/domain/order-list.ts`: operaciones puras y persistencia versionada.
- `src/domain/whatsapp.ts`: mensaje localizado y URL.

### Internationalization and routing

- `src/i18n/config.ts`: locales, rutas traducidas y helpers.
- `src/i18n/ui.ts`: microcopy completa de interfaz y WhatsApp.
- `src/i18n/pages/*.ts`: copy estructurado por página.
- `src/pages/index.astro`: fallback accesible de idioma raíz.
- `src/pages/[locale]/index.astro`: Home localizada.
- `src/pages/[locale]/[slug].astro`: páginas interiores estáticas localizadas.
- `src/pages/404.astro`: error neutral con enlaces a los cuatro idiomas.

### Presentation

- `src/layouts/SiteLayout.astro`: documento, SEO, cabecera, footer y JSON-LD.
- `src/components/navigation/*`: navegación desktop/móvil e idioma.
- `src/components/catalog/*`: selector, producto y catálogo.
- `src/components/order/*`: lista, contador y acciones.
- `src/components/media/*`: galería, imagen y vídeo diferido.
- `src/components/pages/*`: composición específica de cada página.
- `src/styles/tokens.css`: variables visuales provisionales reemplazables.
- `src/styles/global.css`: reset, tipografía, layout y accesibilidad.
- `src/styles/components.css`: patrones visuales compartidos.

### Tests

- `tests/unit/*.test.ts`: dominio, rutas, SEO y datos.
- `tests/e2e/*.spec.ts`: flujo móvil/desktop, idiomas y accesibilidad.
- `tests/fixtures/storage.ts`: estados versionados de lista.

---

### Task 1: Scaffold estático y arnés de pruebas

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Test: `tests/unit/smoke.test.ts`

**Interfaces:**
- Consumes: ninguna.
- Produces: scripts `dev`, `build`, `preview`, `test`, `test:unit`, `test:e2e`, `check`; alias `@/*`; build estático en `dist/`.

- [ ] **Step 1: Inicializar npm e instalar dependencias mínimas**

Run:

```bash
npm init -y
npm install astro@latest @astrojs/sitemap@latest
npm install -D typescript@latest @astrojs/check@latest vitest@latest @playwright/test@latest @axe-core/playwright@latest lighthouse@latest
```

Expected: `package-lock.json` fija versiones y `npm audit` no informa de vulnerabilidades críticas sin parche disponible.

- [ ] **Step 2: Escribir el primer test de smoke**

```ts
// tests/unit/smoke.test.ts
import { describe, expect, it } from 'vitest';

describe('project', () => {
  it('runs the unit test harness', () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 3: Configurar scripts y TypeScript**

```json
{
  "name": "bionatura-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Preservar en ese archivo las versiones exactas añadidas por npm. Configurar `tsconfig.json` extendiendo `astro/tsconfigs/strict` y mapeando `@/*` a `src/*`.

- [ ] **Step 4: Configurar Astro estático y los runners**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bionatura.es',
  output: 'static',
  integrations: [sitemap({ filter: (page) => page !== 'https://bionatura.es/' })],
});
```

Configurar Vitest con `include: ['tests/unit/**/*.test.ts']`; configurar Playwright con proyectos `chromium-mobile` (Pixel 7) y `chromium-desktop`, `baseURL: http://127.0.0.1:4321`, y `webServer.command: 'npm run preview -- --host 127.0.0.1'` después de `npm run build`.

- [ ] **Step 5: Añadir una raíz accesible temporal**

```astro
---
const languages = [
  ['Español', '/es/'], ['English', '/en/'],
  ['Suomi', '/fi/'], ['Dansk', '/da/'],
] as const;
---
<html lang="es">
  <head><meta charset="utf-8" /><meta name="robots" content="noindex" /><title>Bionatura</title></head>
  <body><main><h1>Bionatura</h1>{languages.map(([label, href]) => <a href={href}>{label}</a>)}</main></body>
</html>
```

- [ ] **Step 6: Verificar arnés y build**

Run:

```bash
npm run test:unit
npm run check
npm run build
```

Expected: un test pasa, Astro no informa errores y `dist/index.html` existe.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts .gitignore src/env.d.ts src/pages/index.astro tests/unit/smoke.test.ts
git commit -m "chore: scaffold static Astro site"
```

---

### Task 2: Rutas localizadas y contrato de traducciones

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/i18n/ui.ts`
- Create: `src/i18n/pages/home.ts`
- Create: `src/i18n/pages/catalog.ts`
- Create: `src/i18n/pages/about.ts`
- Create: `src/i18n/pages/gallery.ts`
- Create: `src/i18n/pages/how-it-works.ts`
- Create: `src/i18n/pages/contact.ts`
- Create: `src/i18n/pages/legal.ts`
- Create: `src/components/pages/PageScaffold.astro`
- Create: `src/pages/[locale]/index.astro`
- Create: `src/pages/[locale]/[slug].astro`
- Test: `tests/unit/i18n.test.ts`

**Interfaces:**
- Consumes: alias `@/*` de Task 1.
- Produces: `LOCALES`, `DEFAULT_LOCALE`, `PAGE_KEYS`, `routes`, `isLocale(value)`, `pathFor(locale, page)`, `alternateLinks(page)`, `t(locale, key)` y tipos `Locale`, `PageKey`, `UiKey`.

- [ ] **Step 1: Escribir tests de rutas y cobertura lingüística**

```ts
import { describe, expect, it } from 'vitest';
import { alternateLinks, pathFor } from '../../src/i18n/config';
import { ui } from '../../src/i18n/ui';

it('builds translated catalog paths', () => {
  expect(pathFor('es', 'catalog')).toBe('/es/catalogo/');
  expect(pathFor('en', 'catalog')).toBe('/en/catalog/');
  expect(pathFor('fi', 'catalog')).toBe('/fi/tuotteet/');
  expect(pathFor('da', 'catalog')).toBe('/da/katalog/');
});

it('returns four alternates plus x-default', () => {
  expect(alternateLinks('contact')).toHaveLength(5);
});

it('has the same UI keys in every locale', () => {
  const baseline = Object.keys(ui.es).sort();
  for (const locale of ['en', 'fi', 'da'] as const) {
    expect(Object.keys(ui[locale]).sort()).toEqual(baseline);
  }
});
```

- [ ] **Step 2: Ejecutar los tests y confirmar el fallo**

Run: `npm run test:unit -- tests/unit/i18n.test.ts`

Expected: FAIL porque `src/i18n/config.ts` y `ui.ts` no existen.

- [ ] **Step 3: Implementar el mapa estable de páginas**

```ts
export const LOCALES = ['es', 'en', 'fi', 'da'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const routes = {
  home: { es: '', en: '', fi: '', da: '' },
  catalog: { es: 'catalogo', en: 'catalog', fi: 'tuotteet', da: 'katalog' },
  gallery: { es: 'galeria', en: 'gallery', fi: 'galleria', da: 'galleri' },
  about: { es: 'nosotros', en: 'about', fi: 'meista', da: 'om-os' },
  howItWorks: { es: 'como-funciona', en: 'how-it-works', fi: 'miten-se-toimii', da: 'saadan-fungerer-det' },
  contact: { es: 'contacto', en: 'contact', fi: 'yhteystiedot', da: 'kontakt' },
  legalNotice: { es: 'aviso-legal', en: 'legal-notice', fi: 'oikeudellinen-huomautus', da: 'juridisk-meddelelse' },
  privacy: { es: 'privacidad', en: 'privacy', fi: 'tietosuoja', da: 'privatliv' },
  cookies: { es: 'cookies', en: 'cookies', fi: 'evasteet', da: 'cookies' },
} as const;
```

Implementar `pathFor()` con barra final y `alternateLinks()` incluyendo `{ locale: 'x-default', href: pathFor('es', page) }`.

- [ ] **Step 4: Crear el diccionario completo de microcopy**

Definir `ui.es` como fuente tipada y `ui.en`, `ui.fi`, `ui.da` con exactamente las mismas claves. Incluir como mínimo navegación, CTA, estados de lista, unidades, aviso orientativo y WhatsApp:

```ts
export const ui = {
  es: {
    navHome: 'Inicio', navCatalog: 'Catálogo', navGallery: 'Galería',
    navAbout: 'Nosotros', navHow: 'Cómo funciona', navContact: 'Contacto',
    menuLabel: 'Menú', closeMenu: 'Cerrar menú',
    prepareOrder: 'Prepara tu pedido', viewCatalog: 'Ver catálogo',
    addToList: 'Añadir a la lista', yourList: 'Tu lista', emptyList: 'Tu lista está vacía.',
    quantity: 'Cantidad', customQuantity: 'Otra cantidad', removeItem: 'Eliminar producto',
    clearList: 'Vaciar lista', cancel: 'Cancelar', confirmClear: 'Vaciar',
    spring: 'Primavera', summer: 'Verano', autumn: 'Otoño', winter: 'Invierno',
    consultWhatsapp: 'Consultar por WhatsApp', copyMessage: 'Copiar mensaje',
    availabilityNotice: 'El catálogo es orientativo. Te confirmaremos la disponibilidad y cuándo puedes recogerlo.',
    demoProduct: 'Producto de muestra', pendingContact: 'Contacto pendiente de confirmar',
    whatsappIntro: 'Hola, he preparado esta lista en Bionatura.es:',
    whatsappAvailability: '¿Tenéis disponibilidad?', whatsappPickup: '¿Cuándo podría recogerlo?',
  },
  en: {
    navHome: 'Home', navCatalog: 'Catalog', navGallery: 'Gallery',
    navAbout: 'About us', navHow: 'How it works', navContact: 'Contact',
    menuLabel: 'Menu', closeMenu: 'Close menu',
    prepareOrder: 'Prepare your order', viewCatalog: 'View catalog',
    addToList: 'Add to list', yourList: 'Your list', emptyList: 'Your list is empty.',
    quantity: 'Quantity', customQuantity: 'Other quantity', removeItem: 'Remove product',
    clearList: 'Clear list', cancel: 'Cancel', confirmClear: 'Clear',
    spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter',
    consultWhatsapp: 'Ask via WhatsApp', copyMessage: 'Copy message',
    availabilityNotice: 'The catalog is a guide. We will confirm availability and when you can collect your order.',
    demoProduct: 'Sample product', pendingContact: 'Contact details awaiting confirmation',
    whatsappIntro: 'Hello, I prepared this list on Bionatura.es:',
    whatsappAvailability: 'Are these products available?', whatsappPickup: 'When could I collect them?',
  },
  fi: {
    navHome: 'Etusivu', navCatalog: 'Tuotteet', navGallery: 'Galleria',
    navAbout: 'Meistä', navHow: 'Näin se toimii', navContact: 'Yhteystiedot',
    menuLabel: 'Valikko', closeMenu: 'Sulje valikko',
    prepareOrder: 'Kokoa tilauslistasi', viewCatalog: 'Katso tuotteet',
    addToList: 'Lisää listalle', yourList: 'Ostoslistasi', emptyList: 'Listasi on tyhjä.',
    quantity: 'Määrä', customQuantity: 'Muu määrä', removeItem: 'Poista tuote',
    clearList: 'Tyhjennä lista', cancel: 'Peruuta', confirmClear: 'Tyhjennä',
    spring: 'Kevät', summer: 'Kesä', autumn: 'Syksy', winter: 'Talvi',
    consultWhatsapp: 'Kysy WhatsAppissa', copyMessage: 'Kopioi viesti',
    availabilityNotice: 'Tuoteluettelo on suuntaa antava. Vahvistamme saatavuuden ja noutoajan.',
    demoProduct: 'Esimerkkituote', pendingContact: 'Yhteystieto odottaa vahvistusta',
    whatsappIntro: 'Hei, kokosin tämän listan Bionatura.es-sivustolla:',
    whatsappAvailability: 'Onko näitä tuotteita saatavilla?', whatsappPickup: 'Milloin voisin noutaa ne?',
  },
  da: {
    navHome: 'Forside', navCatalog: 'Katalog', navGallery: 'Galleri',
    navAbout: 'Om os', navHow: 'Sådan fungerer det', navContact: 'Kontakt',
    menuLabel: 'Menu', closeMenu: 'Luk menu',
    prepareOrder: 'Forbered din bestillingsliste', viewCatalog: 'Se katalog',
    addToList: 'Føj til listen', yourList: 'Din liste', emptyList: 'Din liste er tom.',
    quantity: 'Mængde', customQuantity: 'Anden mængde', removeItem: 'Fjern vare',
    clearList: 'Tøm listen', cancel: 'Annuller', confirmClear: 'Tøm',
    spring: 'Forår', summer: 'Sommer', autumn: 'Efterår', winter: 'Vinter',
    consultWhatsapp: 'Spørg via WhatsApp', copyMessage: 'Kopiér besked',
    availabilityNotice: 'Kataloget er vejledende. Vi bekræfter tilgængelighed og afhentningstidspunkt.',
    demoProduct: 'Eksempelprodukt', pendingContact: 'Kontaktoplysninger afventer bekræftelse',
    whatsappIntro: 'Hej, jeg har lavet denne liste på Bionatura.es:',
    whatsappAvailability: 'Er disse varer tilgængelige?', whatsappPickup: 'Hvornår kan jeg hente dem?',
  },
} as const;
```

Revisar estas traducciones en contexto durante Task 16; mantener las claves idénticas y no commitear diccionarios parciales.

- [ ] **Step 5: Crear copy de página con esquema común**

Cada archivo exporta `Record<Locale, PageCopy>` y contiene `title`, `description`, `h1`, `intro`, `sections` y CTA. El español es la fuente; las otras tres versiones conservan significado y tono, no repeticiones literales de keywords.

- [ ] **Step 6: Generar rutas estáticas**

`[locale]/index.astro` genera las cuatro Homes mediante `getStaticPaths()`. `[locale]/[slug].astro` genera todas las combinaciones interiores y usa temporalmente `PageScaffold.astro` para renderizar `h1`, introducción y CTA reales de cada `PageKey`; las Tasks 8, 11, 12 y 13 sustituyen gradualmente esa composición. Cualquier combinación no declarada devuelve 404.

```ts
export function getStaticPaths() {
  return LOCALES.flatMap((locale) =>
    PAGE_KEYS.filter((page) => page !== 'home').map((page) => ({
      params: { locale, slug: routes[page][locale] },
      props: { locale, page },
    })),
  );
}
```

- [ ] **Step 7: Ejecutar pruebas y build**

Run:

```bash
npm run test:unit -- tests/unit/i18n.test.ts
npm run build
find dist -name index.html | sort
```

Expected: tests PASS y aparecen 36 rutas localizadas (9 páginas × 4 idiomas), además de raíz y 404 cuando se añada.

- [ ] **Step 8: Commit**

```bash
git add src/i18n src/pages src/components/pages/PageScaffold.astro tests/unit/i18n.test.ts
git commit -m "feat: add four-language static routing"
```

---

### Task 3: Modelo y validación del catálogo

**Files:**
- Create: `src/domain/catalog.ts`
- Create: `src/data/products.ts`
- Create: `src/assets/demo/product-placeholder.svg`
- Test: `tests/unit/catalog.test.ts`

**Interfaces:**
- Consumes: `Locale` de Task 2.
- Produces: `Season`, `Unit`, `QuantityOption`, `Product`, `assertValidCatalog(products): void`, `products`, `seasonalProducts(season)`, `alwaysAvailableProducts()`.

- [ ] **Step 1: Escribir pruebas de reglas del catálogo**

```ts
import { describe, expect, it } from 'vitest';
import { assertValidCatalog, type Product } from '../../src/domain/catalog';

const product = (overrides: Partial<Product> = {}): Product => ({
  id: 'tomato',
  slug: { es: 'tomate', en: 'tomato', fi: 'tomaatti', da: 'tomat' },
  name: { es: 'Tomates', en: 'Tomatoes', fi: 'Tomaatit', da: 'Tomater' },
  shortDescription: { es: 'Producto de muestra.', en: 'Sample product.', fi: 'Esimerkkituote.', da: 'Eksempelprodukt.' },
  categoryId: 'vegetables', seasons: ['summer'], alwaysAvailable: false,
  quantityOptions: [{ id: '1kg', value: 1, unit: 'kg' }],
  allowCustomQuantity: true, imageId: 'demo-tomatoes',
  imageAlt: { es: 'Tomates', en: 'Tomatoes', fi: 'Tomaatteja', da: 'Tomater' },
  featured: true, demoOnly: true, ...overrides,
});

it('rejects an always-available product with seasons', () => {
  expect(() => assertValidCatalog([product({ alwaysAvailable: true })])).toThrow(/alwaysAvailable/);
});

it('rejects duplicate product ids', () => {
  expect(() => assertValidCatalog([product(), product()])).toThrow(/duplicate/);
});

it('accepts a valid seasonal product', () => {
  expect(() => assertValidCatalog([product()])).not.toThrow();
});
```

- [ ] **Step 2: Confirmar que fallan**

Run: `npm run test:unit -- tests/unit/catalog.test.ts`

Expected: FAIL porque el módulo no existe.

- [ ] **Step 3: Implementar tipos y validación pura**

Copiar el contrato `Product` de la especificación. Validar IDs únicos, cuatro traducciones por nombre/slug/alt, cantidades no vacías, ausencia de temporadas cuando `alwaysAvailable` es `true`, al menos una temporada cuando es `false`, y precio EUR positivo cuando exista.

- [ ] **Step 4: Añadir un catálogo de demo pequeño y explícito**

Crear entre 8 y 12 productos plausibles repartidos por estaciones y 1-2 habituales. Todos deben llevar `demoOnly: true`; sus textos dirán «producto de muestra» y no afirmarán disponibilidad real. Incluir tomates, patatas, huevos y aguacates para verificar kg, gramos, docenas y unidades, sin presentarlos como catálogo definitivo. Usar un único SVG abstracto rotulado `product-placeholder.svg`; no usar fotografía de stock.

- [ ] **Step 5: Añadir selectores puros**

```ts
export const seasonalProducts = (season: Season) =>
  products.filter((product) => !product.alwaysAvailable && product.seasons.includes(season));

export const alwaysAvailableProducts = () =>
  products.filter((product) => product.alwaysAvailable);

assertValidCatalog(products);
```

- [ ] **Step 6: Verificar**

Run: `npm run test:unit -- tests/unit/catalog.test.ts && npm run check`

Expected: PASS y ningún error de tipos.

- [ ] **Step 7: Commit**

```bash
git add src/domain/catalog.ts src/data/products.ts src/assets/demo/product-placeholder.svg tests/unit/catalog.test.ts
git commit -m "feat: define maintainable seasonal catalog"
```

---

### Task 4: Cálculo de temporada en Europe/Madrid

**Files:**
- Create: `src/domain/season.ts`
- Test: `tests/unit/season.test.ts`

**Interfaces:**
- Consumes: `Season` de Task 3.
- Produces: `MADRID_TIME_ZONE`, `monthInTimeZone(date, timeZone)`, `seasonForMonth(month)`, `currentSeason(date?)`.

- [ ] **Step 1: Escribir tests de límites y zona horaria**

```ts
import { expect, it } from 'vitest';
import { currentSeason, seasonForMonth } from '../../src/domain/season';

it.each([
  [1, 'winter'], [2, 'winter'], [3, 'spring'], [5, 'spring'],
  [6, 'summer'], [8, 'summer'], [9, 'autumn'], [11, 'autumn'], [12, 'winter'],
])('maps month %i to %s', (month, expected) => {
  expect(seasonForMonth(month)).toBe(expected);
});

it('uses the Madrid calendar date around UTC midnight', () => {
  expect(currentSeason(new Date('2026-08-31T22:30:00.000Z'))).toBe('autumn');
});
```

- [ ] **Step 2: Confirmar el fallo**

Run: `npm run test:unit -- tests/unit/season.test.ts`

Expected: FAIL porque no existe el módulo.

- [ ] **Step 3: Implementar sin dependencias**

```ts
export const MADRID_TIME_ZONE = 'Europe/Madrid';

export function monthInTimeZone(date: Date, timeZone = MADRID_TIME_ZONE): number {
  const parts = new Intl.DateTimeFormat('en', { month: 'numeric', timeZone }).formatToParts(date);
  return Number(parts.find((part) => part.type === 'month')?.value);
}

export function seasonForMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  if (month === 12 || month === 1 || month === 2) return 'winter';
  throw new RangeError(`Invalid month: ${month}`);
}

export const currentSeason = (date = new Date()) => seasonForMonth(monthInTimeZone(date));
```

- [ ] **Step 4: Ejecutar tests**

Run: `npm run test:unit -- tests/unit/season.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/season.ts tests/unit/season.test.ts
git commit -m "feat: calculate current Madrid season"
```

---

### Task 5: Dominio de lista y persistencia versionada

**Files:**
- Create: `src/domain/order-list.ts`
- Create: `tests/fixtures/storage.ts`
- Test: `tests/unit/order-list.test.ts`

**Interfaces:**
- Consumes: IDs y cantidades validadas de `Product`.
- Produces: `OrderLine`, `OrderState`, `EMPTY_ORDER`, `upsertLine(state, line)`, `removeLine(state, productId)`, `clearOrder()`, `serializeOrder(state)`, `parseStoredOrder(raw, validProductIds)`.

- [ ] **Step 1: Escribir tests de operaciones y almacenamiento corrupto**

```ts
import { expect, it } from 'vitest';
import { EMPTY_ORDER, parseStoredOrder, removeLine, upsertLine } from '../../src/domain/order-list';

it('adds and replaces one line per product', () => {
  const first = upsertLine(EMPTY_ORDER, { productId: 'tomato', quantityLabel: '1 kg' });
  const second = upsertLine(first, { productId: 'tomato', quantityLabel: '2 kg' });
  expect(second.lines).toEqual([{ productId: 'tomato', quantityLabel: '2 kg' }]);
});

it('removes a product', () => {
  const state = { version: 1 as const, lines: [{ productId: 'tomato', quantityLabel: '1 kg' }] };
  expect(removeLine(state, 'tomato').lines).toHaveLength(0);
});

it('falls back safely for malformed storage', () => {
  expect(parseStoredOrder('{bad json', new Set(['tomato']))).toEqual(EMPTY_ORDER);
});

it('drops products no longer in the catalog', () => {
  const raw = JSON.stringify({ version: 1, lines: [{ productId: 'old', quantityLabel: '1 kg' }] });
  expect(parseStoredOrder(raw, new Set(['tomato']))).toEqual(EMPTY_ORDER);
});
```

- [ ] **Step 2: Confirmar el fallo**

Run: `npm run test:unit -- tests/unit/order-list.test.ts`

Expected: FAIL porque el módulo no existe.

- [ ] **Step 3: Implementar operaciones inmutables**

```ts
export interface OrderLine { productId: string; quantityLabel: string }
export interface OrderState { version: 1; lines: OrderLine[] }
export const EMPTY_ORDER: OrderState = { version: 1, lines: [] };

export function upsertLine(state: OrderState, line: OrderLine): OrderState {
  const remaining = state.lines.filter((item) => item.productId !== line.productId);
  return { version: 1, lines: [...remaining, line] };
}
```

Completar `removeLine`, `clearOrder`, serialización y parseo defensivo. Rechazar etiquetas vacías, caracteres de control y más de 40 caracteres.

- [ ] **Step 4: Ejecutar tests**

Run: `npm run test:unit -- tests/unit/order-list.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/order-list.ts tests/fixtures/storage.ts tests/unit/order-list.test.ts
git commit -m "feat: add local versioned order list"
```

---

### Task 6: Mensajes de WhatsApp localizados

**Files:**
- Create: `src/domain/whatsapp.ts`
- Test: `tests/unit/whatsapp.test.ts`

**Interfaces:**
- Consumes: `Locale`, `OrderState`, catálogo y plantilla `ui[locale]`.
- Produces: `formatOrderMessage(locale, state, products)`, `buildWhatsAppUrl(phoneE164, message)`, `normalizePhoneE164(value)`.

- [ ] **Step 1: Escribir tests de los cuatro idiomas y codificación**

```ts
import { expect, it } from 'vitest';
import { buildWhatsAppUrl, formatOrderMessage } from '../../src/domain/whatsapp';
import { products } from '../../src/data/products';

const state = { version: 1 as const, lines: [{ productId: 'tomato', quantityLabel: '2 kg' }] };

it.each(['es', 'en', 'fi', 'da'] as const)('formats %s without losing quantity', (locale) => {
  const message = formatOrderMessage(locale, state, products);
  expect(message).toContain('2 kg');
  expect(message).toContain(products[0].name[locale]);
});

it('encodes a wa.me URL without sending', () => {
  expect(buildWhatsAppUrl('+34 600 000 000', 'Hola\n- Tomates: 2 kg'))
    .toBe('https://wa.me/34600000000?text=Hola%0A-%20Tomates%3A%202%20kg');
});

it('rejects a missing or invalid phone', () => {
  expect(() => buildWhatsAppUrl('', 'Hola')).toThrow(/phone/);
});
```

- [ ] **Step 2: Confirmar el fallo**

Run: `npm run test:unit -- tests/unit/whatsapp.test.ts`

Expected: FAIL porque el módulo no existe.

- [ ] **Step 3: Implementar formateo determinista**

La plantilla por idioma contiene saludo, introducción, pregunta de disponibilidad y petición de recogida. Unir productos como `- {nombre}: {cantidad}`. Omitir IDs desconocidos de forma segura y lanzar error si la lista resultante queda vacía.

```ts
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) throw new Error('Invalid phone');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 4: Implementar modo demo sin número**

El dominio no inventa destinatario: si `business.whatsapp.status !== 'confirmed'`, la capa de UI usa `formatOrderMessage()` y ofrece copiar el mensaje; nunca llama `buildWhatsAppUrl()`.

- [ ] **Step 5: Ejecutar tests**

Run: `npm run test:unit -- tests/unit/whatsapp.test.ts`

Expected: PASS en los cuatro idiomas.

- [ ] **Step 6: Commit**

```bash
git add src/domain/whatsapp.ts tests/unit/whatsapp.test.ts
git commit -m "feat: generate localized WhatsApp enquiries"
```

---

### Task 7: Sistema visual, layout, navegación y metadatos base

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/components.css`
- Create: `src/layouts/SiteLayout.astro`
- Create: `src/components/navigation/Header.astro`
- Create: `src/components/navigation/MobileMenu.astro`
- Create: `src/components/navigation/LanguageSwitcher.astro`
- Create: `src/components/navigation/Footer.astro`
- Create: `src/components/SeoHead.astro`
- Create: `src/assets/brand/bionatura-logo.png`
- Create: `src/assets/brand/README.md`
- Test: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: `Locale`, `PageKey`, `pathFor`, `alternateLinks`, `ui`.
- Produces: `SiteLayout` props `{ locale, page, title, description, image? }`; cabecera responsive; enlaces equivalentes de idioma; target estático `[data-order-count]` inicializado a `0`; variables visuales globales.

- [ ] **Step 1: Escribir el test end-to-end de navegación móvil**

```ts
import { expect, test } from '@playwright/test';

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
```

- [ ] **Step 2: Recuperar y documentar el logo público**

Localizar el archivo de logo servido por `https://www.bionatura.es/`, comprobar visualmente que corresponde a Bionatura Fuengirola y guardar una copia sin modificar en `src/assets/brand/bionatura-logo.png`. Registrar en `src/assets/brand/README.md` la URL origen, fecha y dimensiones. Si el archivo público no tiene resolución suficiente, usarlo en tamaño pequeño con fallback textual; no redibujarlo ni ampliarlo artificialmente.

- [ ] **Step 3: Crear tokens visuales provisionales**

Definir colores con nombres semánticos, no ligados a un hex concreto (`--color-soil`, `--color-leaf`, `--color-cream`, `--color-ink`, `--color-focus`), escala tipográfica fluida con `clamp()`, espaciado, radios contenidos y sombras sutiles. Verificar contraste AA antes de aceptar la paleta.

- [ ] **Step 4: Implementar estilos globales mobile first**

Incluir reset moderado, `box-sizing`, imágenes responsivas, ancho de lectura, `:focus-visible`, `.skip-link`, utilidades de lector de pantalla y:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Implementar `SeoHead` y `SiteLayout`**

`SeoHead` emite title, description, canonical absoluto, cuatro alternates, x-default, Open Graph y `lang`. `SiteLayout` contiene skip link, landmarks, Header, `main#contenido` y Footer. No añadir datos estructurados todavía; Task 13 los integra después de probarlos.

- [ ] **Step 6: Implementar navegación compacta**

La cabecera contiene logo textual/provisional, seis enlaces principales, idioma, contador de lista y CTA. El menú móvil usa botón con `aria-expanded`, panel asociado, Escape, bloqueo de scroll solo mientras está abierto y devolución de foco.

- [ ] **Step 7: Verificar build y test**

Run:

```bash
npm run build
npx playwright test tests/e2e/navigation.spec.ts
```

Expected: las rutas cargan, Escape cierra el menú y el selector cambia a la página equivalente.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/layouts src/components/navigation src/components/SeoHead.astro src/assets/brand tests/e2e/navigation.spec.ts
git commit -m "feat: build accessible multilingual site shell"
```

---

### Task 8: Catálogo progresivo y selector accesible de temporadas

**Files:**
- Create: `src/components/catalog/SeasonSelector.astro`
- Create: `src/components/catalog/SeasonPanel.astro`
- Create: `src/components/catalog/ProductCard.astro`
- Create: `src/components/catalog/CatalogPage.astro`
- Create: `src/scripts/season-selector.ts`
- Modify: `src/pages/[locale]/[slug].astro`
- Test: `tests/e2e/catalog.spec.ts`

**Interfaces:**
- Consumes: `currentSeason`, `products`, `seasonalProducts`, `alwaysAvailableProducts`, `Locale`, `ui`.
- Produces: HTML con cuatro regiones estacionales; tabs activadas mediante `[data-season-selector]`; controles de cantidad con `data-product-id`, `data-quantity`, `data-add-product`.

- [ ] **Step 1: Escribir tests de HTML sin JavaScript y tabs con JavaScript**

```ts
import { expect, test } from '@playwright/test';

test('catalog keeps every season in generated HTML', async ({ request }) => {
  const html = await (await request.get('/es/catalogo/')).text();
  for (const id of ['spring', 'summer', 'autumn', 'winter']) {
    expect(html).toContain(`data-season-panel="${id}"`);
  }
});

test('September selects autumn and keyboard changes season', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-09-11T10:00:00+02:00') });
  await page.goto('/es/catalogo/');
  await expect(page.getByRole('tab', { name: /otoño/i })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: /otoño/i }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: /invierno/i })).toHaveAttribute('aria-selected', 'true');
});
```

- [ ] **Step 2: Confirmar que los tests fallan**

Run: `npm run build && npx playwright test tests/e2e/catalog.spec.ts`

Expected: FAIL porque el catálogo todavía no existe.

- [ ] **Step 3: Renderizar todo el catálogo en servidor**

`CatalogPage` emite introducción, aviso de disponibilidad, selector, cuatro `SeasonPanel` y sección separada de productos habituales. Cada panel contiene heading localizado y sus productos reales/de demo; ningún producto depende de un fetch o render exclusivo de cliente.

`ProductCard` omite completamente el bloque de precio cuando `price` no existe. Si un producto incluye precio, muestra importe EUR y `unitLabel` localizado, sin calcular totales ni activar comportamiento de checkout.

- [ ] **Step 4: Implementar mejora progresiva de tabs**

Sin JavaScript, las cuatro secciones son visibles. Al iniciarse `season-selector.ts`, el componente obtiene `currentSeason()`, añade `data-enhanced="true"`, asigna roles/estado y oculta visualmente paneles inactivos. Implementar flechas, Home/End y activación; mantener foco y `aria-controls` sincronizados.

- [ ] **Step 5: Diseñar el motivo estacional sin sacrificar UX**

En móvil, cuatro botones desplazables sin gesto obligatorio; en desktop, disposición en arco mediante CSS. No usar canvas, librerías de carrusel ni animación continua. El estado actual debe distinguirse por texto/iconografía simple además del color.

- [ ] **Step 6: Ejecutar tests, axe y build**

Run:

```bash
npm run build
npx playwright test tests/e2e/catalog.spec.ts
npm run check
```

Expected: ambos tests pasan; otoño queda seleccionado el 11 de septiembre; el HTML contiene las cuatro estaciones.

- [ ] **Step 7: Commit**

```bash
git add src/components/catalog src/scripts/season-selector.ts src/pages tests/e2e/catalog.spec.ts
git commit -m "feat: add indexable interactive seasonal catalog"
```

---

### Task 9: Interfaz de lista, cantidades y almacenamiento local

**Files:**
- Create: `src/components/order/OrderList.astro`
- Create: `src/components/order/OrderCount.astro`
- Create: `src/scripts/order-controller.ts`
- Modify: `src/components/catalog/ProductCard.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Test: `tests/e2e/order-list.spec.ts`

**Interfaces:**
- Consumes: dominio de Task 5 y controles `data-*` de Task 8.
- Produces: evento DOM `bionatura:order-change` con `OrderState`; clave `bionatura.order.v1`; panel accesible de lista; API UI añadir/modificar/eliminar/vaciar.

- [ ] **Step 1: Escribir el flujo móvil antes de implementar**

```ts
import { expect, test } from '@playwright/test';

test('adds, edits, persists and removes a product', async ({ page }) => {
  await page.goto('/es/catalogo/');
  const product = page.locator('[data-product-id="tomato"]');
  await product.getByLabel(/cantidad/i).selectOption('2kg');
  await product.getByRole('button', { name: /añadir/i }).click();
  await expect(page.getByTestId('order-count')).toHaveText('1');
  await page.reload();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await expect(page.getByRole('dialog')).toContainText('2 kg');
  await page.getByRole('button', { name: /eliminar tomates/i }).click();
  await expect(page.getByTestId('order-count')).toHaveText('0');
});
```

- [ ] **Step 2: Confirmar el fallo**

Run: `npm run build && npx playwright test tests/e2e/order-list.spec.ts`

Expected: FAIL porque no existe el controlador.

- [ ] **Step 3: Implementar selectores de cantidad por producto**

Cada opción usa su etiqueta localizada. «Cantidad personalizada» revela un input con label, `maxlength="40"` y mensaje de validación. Añadir reemplaza la línea existente del mismo producto y anuncia el resultado mediante una única región `aria-live="polite"`.

- [ ] **Step 4: Implementar controlador de estado**

Al arrancar, leer `localStorage`, llamar `parseStoredOrder()`, renderizar con `textContent` y persistir cada cambio con `serializeOrder()`. Escuchar botones por delegación de eventos y emitir:

```ts
document.dispatchEvent(new CustomEvent('bionatura:order-change', { detail: state }));
```

- [ ] **Step 5: Implementar panel responsive**

Usar `<dialog>` con layout inferior en móvil y lateral en desktop. Gestionar apertura/cierre, Escape, foco inicial, devolución de foco y fondo. Mostrar aviso de no confirmación justo antes de la acción WhatsApp.

- [ ] **Step 6: Añadir vaciado seguro**

El primer toque en «Vaciar lista» revela confirmación inline con «Cancelar» y «Vaciar»; no usar `window.confirm`. Tras vaciar, mantener el panel abierto y anunciar el estado vacío.

- [ ] **Step 7: Ejecutar pruebas**

Run:

```bash
npm run build
npx playwright test tests/e2e/order-list.spec.ts
npm run test:unit -- tests/unit/order-list.test.ts
```

Expected: persistencia y acciones pasan en móvil y desktop.

- [ ] **Step 8: Commit**

```bash
git add src/components/order src/components/catalog/ProductCard.astro src/scripts/order-controller.ts src/layouts/SiteLayout.astro tests/e2e/order-list.spec.ts
git commit -m "feat: add persistent digital shopping list"
```

---

### Task 10: Acción WhatsApp y modo de demostración

**Files:**
- Create: `src/data/business.ts`
- Create: `src/components/order/WhatsAppAction.astro`
- Create: `src/components/order/FloatingWhatsApp.astro`
- Modify: `src/components/order/OrderList.astro`
- Modify: `src/scripts/order-controller.ts`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `tests/unit/whatsapp.test.ts`
- Test: `tests/e2e/whatsapp.spec.ts`

**Interfaces:**
- Consumes: `formatOrderMessage`, `buildWhatsAppUrl`, `OrderState`, `Locale`.
- Produces: `business.whatsapp: ValidatedField<string>`; enlace `wa.me` solo con valor confirmado; copia al portapapeles en demo; acceso flotante seguro.

- [ ] **Step 1: Escribir tests para dato pendiente y confirmado**

```ts
import { expect, test } from '@playwright/test';

test('demo mode shows a copyable message and no invented recipient', async ({ page }) => {
  await page.goto('/es/catalogo/');
  await page.locator('[data-product-id="tomato"]').getByRole('button', { name: /añadir/i }).click();
  await page.getByRole('button', { name: /tu lista/i }).click();
  await expect(page.getByRole('button', { name: /copiar mensaje/i })).toBeVisible();
  await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', '/es/contacto/');
});
```

Añadir un test unitario de fixture confirmado que comprueba `wa.me` con el número E.164 inyectado, sin guardar ese número como dato de producción.

- [ ] **Step 2: Crear el contrato de validación del negocio**

```ts
export type ValidationStatus = 'pending' | 'confirmed';
export interface ValidatedField<T> { status: ValidationStatus; value: T | null }

export const business = {
  name: 'Bionatura',
  whatsapp: { status: 'pending', value: null },
  phone: { status: 'pending', value: null },
  email: { status: 'pending', value: null },
  pickup: { status: 'pending', value: null },
} satisfies Record<string, string | ValidatedField<string>>;
```

- [ ] **Step 3: Implementar ambas salidas**

Si WhatsApp está confirmado, renderizar el enlace con mensaje calculado en el momento del clic y `target="_blank" rel="noopener noreferrer"`. Si está pendiente, renderizar «Copiar mensaje» y un texto explícito de modo demo; usar Clipboard API con fallback a selección de `<textarea readonly>`.

- [ ] **Step 4: Verificar que nada se envía automáticamente**

El controlador solo crea/actualiza `href` tras una acción humana. No usar `fetch`, webhooks, API de WhatsApp ni navegación al cargar.

- [ ] **Step 5: Añadir el acceso flotante**

`FloatingWhatsApp` enlaza a `wa.me` únicamente con teléfono confirmado. Mientras esté pendiente, enlaza a la página Contacto localizada, donde se explica el modo demo. Posicionarlo sin cubrir el CTA de lista, respetar safe areas y proporcionar un nombre accesible visible al foco.

- [ ] **Step 6: Ejecutar pruebas**

Run: `npm run build && npx playwright test tests/e2e/whatsapp.spec.ts`

Expected: el modo demo no contiene ningún `wa.me`; el mensaje puede copiarse y está localizado.

- [ ] **Step 7: Commit**

```bash
git add src/data/business.ts src/components/order src/scripts/order-controller.ts src/layouts/SiteLayout.astro tests/unit/whatsapp.test.ts tests/e2e/whatsapp.spec.ts
git commit -m "feat: connect list to safe WhatsApp enquiry"
```

---

### Task 11: Home y páginas narrativas localizadas

**Files:**
- Create: `src/components/pages/HomePage.astro`
- Create: `src/components/pages/AboutPage.astro`
- Create: `src/components/pages/HowItWorksPage.astro`
- Create: `src/components/pages/ContactPage.astro`
- Modify: `src/pages/[locale]/index.astro`
- Modify: `src/pages/[locale]/[slug].astro`
- Modify: `src/i18n/pages/home.ts`
- Modify: `src/i18n/pages/about.ts`
- Modify: `src/i18n/pages/how-it-works.ts`
- Modify: `src/i18n/pages/contact.ts`
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `SiteLayout`, rutas, copy localizado, catálogo destacado, `business`.
- Produces: cuatro composiciones de página completas, sin dato comercial no confirmado.

- [ ] **Step 1: Escribir test de contenido crítico**

```ts
import { expect, test } from '@playwright/test';

test('Spanish home explains offer, place and process above the fold', async ({ page }) => {
  await page.goto('/es/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Bionatura|Fuengirola/);
  await expect(page.getByRole('link', { name: /prepara tu pedido/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /ver catálogo/i })).toBeVisible();
});

test('contact page does not expose unconfirmed fields', async ({ page }) => {
  await page.goto('/es/contacto/');
  await expect(page.getByText(/pendiente de confirmar/i)).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
});
```

- [ ] **Step 2: Componer Home**

Orden exacto: hero fotográfico provisional rotulado; temporada actual; productos destacados; proceso de tres pasos; productos habituales; historia breve sin afirmaciones no verificadas; mosaico de galería; contacto/recogida; CTA final y aviso orientativo. Mantener un solo H1.

- [ ] **Step 3: Componer Nosotros**

Usar bloques para persona/proyecto, huerto, filosofía y cercanía. Reservar 2-4 slots de imágenes con pie «Material visual pendiente de incorporar»; CTA a Galería. No afirmar certificación ecológica, años de actividad o procedencia concreta.

- [ ] **Step 4: Componer Cómo funciona**

Mostrar tres pasos numerados con texto localizado y una sección «Qué ocurre después» que explique confirmación de disponibilidad y acuerdo de recogida. No usar términos checkout, carrito o envío inmediato salvo para negar explícitamente esas expectativas.

- [ ] **Step 5: Componer Contacto**

Priorizar WhatsApp en estado demo. Mostrar cada dato pendiente mediante un componente que no genera link ni Schema hasta `status: 'confirmed'`. Incluir enlace al catálogo y explicación de recogida acordada.

- [ ] **Step 6: Completar las cuatro traducciones**

Revisar que títulos, metadescripciones, headings, CTA y avisos estén completos en `es/en/fi/da`. Usar el español como fuente semántica; no traducir «Bionatura» ni «Fuengirola».

- [ ] **Step 7: Ejecutar tests**

Run: `npm run build && npx playwright test tests/e2e/pages.spec.ts`

Expected: Home y páginas interiores pasan en móvil/desktop y ningún contacto pendiente crea enlaces accionables.

- [ ] **Step 8: Commit**

```bash
git add src/components/pages src/pages src/i18n/pages tests/e2e/pages.spec.ts
git commit -m "feat: add localized narrative pages"
```

---

### Task 12: Galería, imágenes y vídeo diferido

**Files:**
- Create: `src/data/media.ts`
- Create: `src/components/media/ResponsiveImage.astro`
- Create: `src/components/media/GalleryGrid.astro`
- Create: `src/components/media/Lightbox.astro`
- Create: `src/components/media/DeferredVideo.astro`
- Create: `src/components/pages/GalleryPage.astro`
- Create: `src/assets/demo/README.md`
- Create: `src/assets/demo/garden-placeholder.svg`
- Create: `src/assets/demo/products-placeholder.svg`
- Create: `src/assets/demo/preparation-placeholder.svg`
- Create: `src/assets/demo/bionatura-placeholder.svg`
- Create: `src/assets/demo/daily-placeholder.svg`
- Modify: `src/pages/[locale]/[slug].astro`
- Test: `tests/e2e/gallery.spec.ts`

**Interfaces:**
- Consumes: `Locale`, gallery copy, Astro image pipeline.
- Produces: `MediaItem`, `mediaGroups`, imágenes con `width/height/srcset/sizes`, lightbox accesible y vídeo cargado por interacción.

- [ ] **Step 1: Escribir tests de carga y accesibilidad**

```ts
import { expect, test } from '@playwright/test';

test('gallery images have dimensions and non-empty localized alt', async ({ page }) => {
  await page.goto('/fi/galleria/');
  const images = page.locator('main img');
  await expect(images.first()).toHaveAttribute('width', /\d+/);
  await expect(images.first()).toHaveAttribute('height', /\d+/);
  await expect(images.first()).toHaveAttribute('alt', /.+/);
});

test('unavailable demo video does not load a fake source', async ({ page }) => {
  await page.goto('/es/galeria/');
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.getByText(/vídeo pendiente de incorporar/i)).toBeVisible();
});
```

- [ ] **Step 2: Crear datos de medios sin fingir material real**

Definir cinco grupos (`garden`, `products`, `preparation`, `bionatura`, `daily`) y un SVG abstracto, ligero y rotulado para cada grupo; no usar fotos de stock. Cada `MediaItem` lleva ID, tipo, grupo, asset, alt por idioma, dimensiones y `demoOnly`. `src/assets/demo/README.md` explica el contrato de sustitución y nombres descriptivos esperados.

- [ ] **Step 3: Implementar imágenes responsivas**

Usar `<Picture>` de Astro para producir AVIF, WebP y fallback, con anchuras 480, 768, 1200 y 1600 cuando la fuente lo permita, `sizes` según layout y `loading="lazy"` fuera del primer viewport. El componente recibe `priority` para la única imagen LCP; siempre emite dimensiones.

- [ ] **Step 4: Implementar galería narrativa**

Cada grupo tiene heading e introducción localizada. Alternar ritmos/tamaños sin convertir todo en cards. Limitar la Home a una selección; la página Galería contiene el conjunto completo.

- [ ] **Step 5: Implementar y probar el lightbox accesible**

Usar `<dialog>`; abrir desde botón asociado a cada imagen, ofrecer cerrar, anterior/siguiente, Escape y devolución de foco. Añadir al test que Escape cierra, el foco vuelve a la miniatura y los botones anterior/siguiente conservan un nombre accesible. No añadir una dependencia de galería.

- [ ] **Step 6: Implementar vídeo diferido**

Si `MediaItem` tiene fuente confirmada, renderizar póster y botón e insertar `<source>` al hacer clic, con `preload="none"`, sin autoplay y controles nativos. En la demo sin vídeo entregado, mostrar «Vídeo pendiente de incorporar» y no emitir `<video>`, `<source>` ni URL ficticia.

- [ ] **Step 7: Ejecutar tests y revisar peso**

Run:

```bash
npm run build
npx playwright test tests/e2e/gallery.spec.ts
du -sh dist
find dist -type f -size +500k -print
```

Expected: tests PASS; cualquier recurso mayor de 500 KB se revisa y justifica como vídeo o se recomprime.

- [ ] **Step 8: Commit**

```bash
git add src/data/media.ts src/components/media src/components/pages/GalleryPage.astro src/assets/demo src/pages tests/e2e/gallery.spec.ts
git commit -m "feat: add optimized narrative gallery"
```

---

### Task 13: Legales, SEO técnico y datos estructurados verificables

**Files:**
- Create: `src/components/pages/LegalPage.astro`
- Create: `src/components/Breadcrumbs.astro`
- Create: `src/components/StructuredData.astro`
- Create: `src/pages/404.astro`
- Create: `public/robots.txt`
- Create: `vercel.json`
- Modify: `src/layouts/SiteLayout.astro`
- Modify: `src/pages/[locale]/[slug].astro`
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: rutas, alternates, `business`, copy legal.
- Produces: canonical, hreflang, OG, breadcrumbs, `Organization` condicionado, sitemap, robots, 404 y redirección raíz.

- [ ] **Step 1: Escribir tests de SEO**

```ts
import { expect, test } from '@playwright/test';

test('catalog emits canonical and all language alternates', async ({ page }) => {
  await page.goto('/en/catalog/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://bionatura.es/en/catalog/');
  for (const lang of ['es', 'en', 'fi', 'da', 'x-default']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1);
  }
});

test('pending address and phone are absent from JSON-LD', async ({ page }) => {
  await page.goto('/es/contacto/');
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  expect(json).not.toContain('telephone');
  expect(json).not.toContain('PostalAddress');
  expect(json).not.toContain('LocalBusiness');
});
```

- [ ] **Step 2: Implementar páginas legales honestas**

Cada una contiene alcance y campos «pendiente de validación del cliente/asesoría», sin lorem ipsum ni texto jurídico inventado. Cookies declara que el MVP no instala cookies no esenciales ni analítica; si el build futuro cambia, esta afirmación se revisa antes de publicar.

- [ ] **Step 3: Implementar breadcrumbs visibles y JSON-LD**

`StructuredData` emite `Organization` con `name` y `url`; añade `logo`, `telephone`, `email` o dirección únicamente si el campo correspondiente está confirmado. No emitir `LocalBusiness`, `Product`, `Offer`, reviews ni horarios en el MVP. `BreadcrumbList` refleja breadcrumbs visibles.

- [ ] **Step 4: Completar recursos técnicos**

`robots.txt` permite rastreo y apunta a `https://bionatura.es/sitemap-index.xml`. El test de build falla si ese archivo no existe. `vercel.json` redirige `/` a `/es/` y añade `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

- [ ] **Step 5: Crear 404 útil**

Mostrar mensaje neutral, enlaces a Inicio en los cuatro idiomas y `meta name="robots" content="noindex"`. No intentar adivinar idioma mediante JavaScript.

- [ ] **Step 6: Verificar build, sitemap y SEO**

Run:

```bash
npm run build
npx playwright test tests/e2e/seo.spec.ts
find dist -maxdepth 2 -type f | sort | rg 'sitemap|robots|404'
```

Expected: tests PASS; cada ruta localizada aparece en sitemap; ningún dato pendiente aparece en JSON-LD.

- [ ] **Step 7: Commit**

```bash
git add src/components src/layouts src/pages public/robots.txt vercel.json tests/e2e/seo.spec.ts
git commit -m "feat: add honest legal and technical SEO foundation"
```

---

### Task 14: Auditoría integral y cierre de la demo

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/critical-flow.spec.ts`
- Create: `scripts/check-generated-routes.mjs`
- Create: `docs/demo-checklist.md`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/navigation/Header.astro`
- Modify: `src/components/catalog/SeasonSelector.astro`
- Modify: `src/components/order/OrderList.astro`

**Interfaces:**
- Consumes: sitio completo de Tasks 1-13.
- Produces: comando `npm run verify`; checklist de demo; evidencia de rutas, tests, accesibilidad y rendimiento.

- [ ] **Step 1: Añadir test axe sobre rutas críticas**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/es/', '/es/catalogo/', '/en/catalog/', '/fi/galleria/', '/da/kontakt/']) {
  test(`has no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}
```

- [ ] **Step 2: Añadir flujo crítico completo**

En `critical-flow.spec.ts`, recorrer Home → Catálogo → seleccionar estación → añadir producto → abrir lista → cambiar cantidad → obtener mensaje → cerrar panel → cambiar idioma. Afirmar que el aviso de no confirmación está presente antes de copiar/abrir WhatsApp.

- [ ] **Step 3: Comprobar matriz de rutas generadas**

`scripts/check-generated-routes.mjs` importa/replica el contrato de rutas y comprueba la presencia de los 36 `index.html`, canonical y `<html lang>`. Sale con código 1 y lista de faltantes si falla.

- [ ] **Step 4: Crear comando de verificación único**

```json
{
  "scripts": {
    "verify": "npm run test:unit && npm run build && node scripts/check-generated-routes.mjs && npm run test:e2e"
  }
}
```

Integrar la clave sin borrar los scripts existentes.

Añadir `.lighthouse-*.json` a `.gitignore` para que los informes locales no ensucien el repositorio.

- [ ] **Step 5: Ejecutar verificación completa**

Run:

```bash
npm run verify
```

Expected: todos los tests, build, rutas y auditorías axe pasan.

- [ ] **Step 6: Ejecutar Lighthouse sobre preview local**

Run en una terminal: `npm run preview -- --host 127.0.0.1`

Run en otra:

```bash
npm exec -- lighthouse http://127.0.0.1:4321/es/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.lighthouse-home.json --chrome-flags="--headless"
npm exec -- lighthouse http://127.0.0.1:4321/es/catalogo/ --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=.lighthouse-catalog.json --chrome-flags="--headless"
```

Expected: puntuación ≥ 0,90 en cada categoría. Si una métrica queda por debajo, registrar causa concreta en `docs/demo-checklist.md`, corregirla y repetir antes de declarar lista la demo.

- [ ] **Step 7: Realizar revisión visual manual**

Comprobar a 360×800, 768×1024, 1440×900: cabecera, hero, tabs, cantidades, panel, WhatsApp/copia, cambio de idioma, textos largos finlandeses, foco, zoom 200 %, reduced motion y ausencia de solapamiento con botones flotantes.

- [ ] **Step 8: Documentar contenido de demo y límites**

`docs/demo-checklist.md` enumera qué es funcional, qué productos/medios son de muestra, qué datos están pendientes y que DNS no se ha tocado. Añadir URLs preview cuando existan.

- [ ] **Step 9: Commit**

```bash
git add tests scripts package.json package-lock.json .gitignore docs/demo-checklist.md src
git commit -m "test: verify multilingual demo end to end"
```

---

### Task 15: GitHub y preview en Vercel

**Files:**
- Create: `README.md`
- Modify: `docs/demo-checklist.md`

**Interfaces:**
- Consumes: build verificado de Task 14 y sesión autenticada de GitHub/Vercel.
- Produces: repositorio privado `bionatura-web`, proyecto Vercel enlazado y URL preview; no produce cambios DNS.

- [ ] **Step 1: Documentar ejecución y mantenimiento**

README debe incluir requisitos, `npm ci`, `npm run dev`, `npm run verify`, mapa de datos, procedimiento para cambiar productos/traducciones/fotos y regla de no publicar datos con `status: 'pending'`.

- [ ] **Step 2: Verificar estado y build antes de publicar**

Run:

```bash
git status --short
npm run verify
git log --oneline -5
```

Expected: verificación verde; `git status --short` solo muestra `README.md` y la actualización prevista de `docs/demo-checklist.md`; los commits de Tasks 11-14 están visibles.

- [ ] **Step 3: Crear repositorio privado en la cuenta autenticada**

Run:

```bash
gh repo create bionatura-web --private --source=. --remote=origin --push
```

Expected: GitHub devuelve la URL del repositorio y `git remote -v` apunta a ella. Si el nombre ya existe, detenerse y comprobar que pertenece a este proyecto antes de cambiar el remoto.

- [ ] **Step 4: Crear y enlazar proyecto Vercel**

Run:

```bash
npx --yes vercel@latest link --project bionatura-web --yes
npx --yes vercel@latest git connect --yes
npx --yes vercel@latest --yes
```

Expected: Vercel enlaza el proyecto con el remoto GitHub, detecta Astro, ejecuta `npm run build` y devuelve una URL preview HTTPS. Los siguientes pushes generan previews. No añadir `bionatura.es` todavía.

- [ ] **Step 5: Verificar la preview remota**

Ejecutar contra la URL devuelta pruebas manuales del idioma, catálogo, lista y copia/WhatsApp. Comprobar cabeceras con `curl -I <preview-url>/es/` y que `/` dirige a `/es/`.

- [ ] **Step 6: Registrar enlaces de demo**

Añadir a `docs/demo-checklist.md` la URL exacta de GitHub, la URL preview, fecha/hora de build, commit desplegado y la frase «DNS de bionatura.es sin cambios».

- [ ] **Step 7: Commit y push de documentación**

```bash
git add README.md docs/demo-checklist.md
git commit -m "docs: publish demo access and maintenance guide"
git push origin main
```

---

### Task 16: Sustitución de contenido y preparación de producción

**Files:**
- Modify: `src/assets/*`
- Modify: `src/data/products.ts`
- Modify: `src/data/media.ts`
- Modify: `src/data/business.ts`
- Modify: `src/i18n/pages/*.ts`
- Modify: `src/i18n/ui.ts`
- Modify: `docs/demo-checklist.md`
- Test: `tests/unit/catalog.test.ts`
- Test: `tests/unit/i18n.test.ts`
- Test: `tests/e2e/critical-flow.spec.ts`

**Interfaces:**
- Consumes: material y datos confirmados por cliente; arquitectura validada en preview.
- Produces: contenido real, traducciones revisadas y release candidate; DNS sigue fuera de alcance hasta autorización separada.

- [ ] **Step 1: Importar y clasificar material original**

Renombrar archivos descriptivamente, conservar originales fuera del árbol servido, asignar grupo/alt en cuatro idiomas y sustituir cada `demoOnly` media item. Elegir una imagen LCP de Home y un póster por vídeo.

- [ ] **Step 2: Validar catálogo con el cliente**

Por cada producto confirmar nombre, categoría, estaciones, habitual o no, cantidades/unidades, imagen, descripción y posible precio. Eliminar todos los productos `demoOnly` que no sean confirmados; ejecutar `assertValidCatalog()` mediante tests.

- [ ] **Step 3: Confirmar datos comerciales y legales**

Actualizar a `status: 'confirmed'` solo los campos respaldados por el cliente. Incorporar el número WhatsApp en E.164. Entregar las plantillas legales a asesoría/cliente; publicar su texto únicamente tras aprobación.

- [ ] **Step 4: Revisar traducciones**

Hacer revisión humana de inglés, finés y danés. Verificar nombres de producto, unidades, tono, metadatos y mensajes WhatsApp. No publicar rutas con fragmentos en español salvo nombres propios.

- [ ] **Step 5: Evaluar páginas SEO de categoría sin crearlas automáticamente**

Registrar en `docs/demo-checklist.md` qué categorías cumplen simultáneamente: al menos tres productos confirmados, texto único útil, una imagen relevante y una intención local distinta. Mantener todas las categorías dentro del Catálogo en este plan. Si alguna cumple el umbral y el cliente aprueba ampliarla, redactar un plan independiente con rutas, copy, canonical/hreflang, breadcrumbs, enlaces y pruebas concretas.

- [ ] **Step 6: Ejecutar release gate**

Run:

```bash
rg -n "demoOnly: true|status: 'pending'|Material visual pendiente|Producto de muestra" src
npm run verify
```

Expected: la búsqueda solo devuelve campos conscientemente pendientes que no se renderizan como datos reales; `npm run verify` pasa.

- [ ] **Step 7: Crear release candidate en Vercel**

Crear rama `codex/production-content`, push y preview. Obtener aprobación visual, de contenido, traducción y legal sobre esa URL. Mantener dominio actual sin cambios.

- [ ] **Step 8: Preparar cambio DNS como operación separada**

Después de autorización explícita, documentar registros actuales, registros requeridos por Vercel, TTL, ventana de cambio, comprobación HTTPS/canonical y rollback. Tras la propagación, verificar la propiedad en Google Search Console y enviar `sitemap-index.xml`. No ejecutar estas operaciones como parte automática del plan de demo.

- [ ] **Step 9: Commit**

```bash
git add src docs/demo-checklist.md
git commit -m "content: replace demo material with approved Bionatura content"
```

---

## Execution Order and Checkpoints

### Demo crítica

1. Tasks 1-6: base, idiomas y dominio funcional.
2. Tasks 7-10: experiencia visual, catálogo, lista y WhatsApp.
3. Tasks 11-13: páginas, galería y SEO técnico.
4. Task 14: gate obligatorio de calidad.
5. Task 15: GitHub y preview Vercel.

No recortar Tasks 3-6, 8-10 o 14 para llegar al viernes: contienen las reglas que evitan un catálogo engañoso, errores de fecha, pérdida de lista o envío a un número inventado. Si falta tiempo, reducir cantidad de imágenes y refinamiento de páginas secundarias, manteniendo su estructura y rutas.

### Post-demo

6. Task 16: contenido confirmado, revisión de traducciones, páginas SEO justificadas y release candidate.
7. Cambio DNS: nueva operación con autorización y datos de acceso, fuera de este plan de implementación automática.

## Implementation References

- Astro static output and sitemap: `https://docs.astro.build/en/guides/integrations-guide/sitemap/`
- Google LocalBusiness guidance: `https://developers.google.com/search/docs/appearance/structured-data/local-business`
- Google Organization guidance: `https://developers.google.com/search/docs/appearance/structured-data/organization`
- Vercel Git connection: `https://vercel.com/docs/cli/git`
