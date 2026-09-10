# Batch 11–13 report

## Status

Implemented the localized narrative pages, real-photo gallery, accessible lightbox, honest legal pages, breadcrumbs, Organization/BreadcrumbList JSON-LD, 404, robots and Vercel redirect/security headers.

All 11 supplied photographs were visually inspected, copied (the originals were not edited), renamed descriptively, resized/compressed in-project and routed through Astro Picture AVIF/WebP/JPEG output. Alt text and gallery grouping describe only visible content.

## Verification

- RED observed first: focused desktop E2E run produced 9 expected failures and 1 existing pass.
- `npm run check`: 0 errors.
- `npm run build`: PASS, 38 pages and sitemap generated.
- `npm run test:unit`: PASS, 47 tests.
- Focused E2E: pages/SEO/gallery behaviors passed; after correcting a test selector that counted responsive `<picture><source>` elements as video sources, `gallery.spec.ts` passed 3/3. The preceding combined run passed the other 9/9 relevant cases.

## Data boundaries

- Legal identity: Bionatura del Sur S.L., B92371301.
- Registered address: Calle Tórtolas, 11, 29640 Fuengirola. It is labelled as a registered office and never as a shop or collection point.
- Phone, WhatsApp, email, opening hours and collection point remain pending and generate no actionable contact links or structured fields.
- No LocalBusiness, Product or Offer JSON-LD. No fictional video URL.

## Concerns

- Existing legal prose remains intentionally concise and flags fields needing client/legal review.
- The source photograph containing a social-media caption is used honestly as delivered; no claim is inferred from its overlaid wording.
- Existing deprecation hints around `document.execCommand` remain outside this batch.
