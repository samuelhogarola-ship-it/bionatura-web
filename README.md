# Bionatura Web

Sitio estático de Bionatura Fuengirola construido con Astro. La web publica catálogo orientativo, contenidos de huerto y recetas, contacto por WhatsApp y páginas legales básicas.

## Comandos

```bash
npm install
npm run dev
npm run diagnostics
```

- `npm run dev`: servidor local de Astro.
- `npm run check`: diagnóstico de Astro y TypeScript.
- `npm run test:unit`: pruebas unitarias con Vitest.
- `npm run build`: comprobación y build estático en `dist/`.
- `npm run diagnostics`: `check`, unitarios y build.
- `npm run test:e2e`: pruebas Playwright. Requiere navegadores instalados con Playwright.

## Calidad

Husky ejecuta `npm run diagnostics` en `pre-commit`. Si el entorno no tiene los navegadores de Playwright, los e2e no forman parte del hook básico y deben ejecutarse después de instalar Chromium.

## Despliegue

La rama principal contiene el código Astro. El workflow de GitHub genera `dist/` y publica la salida estática para Hostinger en la rama de despliegue configurada.

La vista previa social de WhatsApp usa una imagen por defecto del huerto y el favicon usa el logo real de Bionatura.
