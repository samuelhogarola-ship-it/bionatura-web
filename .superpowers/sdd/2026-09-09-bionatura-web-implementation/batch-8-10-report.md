# Batch Tasks 8–10 report

## Status

Implemented as one integrated block on base `f49b538`:

- SSR catalog with all four seasonal regions and a separate regular-products section.
- Progressive season tabs using Madrid time, arrow/Home/End navigation, synchronized focus and ARIA state; all regions remain in no-JavaScript HTML.
- Demo-labelled product cards with localized quantity options and custom quantities; price markup is omitted when the catalog has no price.
- Persistent `bionatura.order.v1` list using the existing order domain, with add/replace/remove/clear actions, localized announcements and a responsive modal dialog.
- Pending/confirmed business-data contract; pending production data shows demo copy, never emits a `wa.me` link, and copies a localized message only after a user click.
- Safe floating WhatsApp/contact access that points to localized Contact while the contact remains unconfirmed.

No contact, stock, price or non-demo product was invented. The extra `2 kg` tomato option is part of the visible demo fixture required by the Task 9 acceptance flow; the product remains visibly marked as a sample.

## TDD evidence

### Task 8

- RED: `npm run build && npx playwright test tests/e2e/catalog.spec.ts`
- Result before implementation: 4 failed (season panels and tabs absent), 2 axe checks passed.
- GREEN: same command after implementation: 6 passed across mobile and desktop.

### Task 9

- RED: `npm run build && npx playwright test tests/e2e/order-list.spec.ts`
- Result before controller/dialog implementation: 6 failed; quantity/list interactions and dialog were unavailable.
- A later timeout was traced to the accessible name `Eliminar producto Tomates` not matching the required `Eliminar Tomates`; the single copy fix passed 2/2 focused reproductions.
- GREEN covered by the final integrated run: all 6 list tests passed across mobile and desktop, plus the existing order-domain unit suite.

### Task 10

- RED: `npm run build && npx playwright test tests/e2e/whatsapp.spec.ts`
- Result before implementation: build failed on the missing `src/data/business.ts` contract imported by the confirmed fixture test.
- GREEN: 4 WhatsApp E2E tests passed across mobile and desktop; `tests/unit/whatsapp.test.ts` passed 13 tests including an injected confirmed E.164 fixture.

## Final verification

Command:

```bash
npm run test:unit && npm run check && npm run build && npx playwright test tests/e2e/catalog.spec.ts tests/e2e/order-list.spec.ts tests/e2e/whatsapp.spec.ts
```

Result:

- Unit: 6 files, 46 tests passed.
- Astro check: 0 errors, 0 warnings, 3 deprecation hints.
- Build: 37 static pages built successfully.
- E2E: 30 focused tests passed across Chromium mobile and desktop, including axe with the order dialog open.
- `git diff --check`: passed.

## Review round 1

All Critical/Important findings and the three local minor findings were addressed:

- Confirmed WhatsApp uses a native button; Enter triggers the same safe `window.open` path as click, with a fixture E.164 integration test and no production number.
- Clipboard failures inspect the legacy fallback return value and catch Clipboard/fallback exceptions. Failed copy leaves a visible readonly selected textarea and announces manual-copy instructions rather than success.
- The dialog contains its own polite live region while the page keeps a separate region for closed-dialog updates. Initial focus, Escape, return focus, open-dialog axe and focus after line deletion are covered.
- Pending Contact content now names demo mode explicitly in Spanish, English, Finnish and Danish.
- The Madrid-current season marker remains on the real current season after a manual tab selection.
- Custom quantity errors are connected with `aria-describedby`.
- Every priced product now requires a non-empty `unitLabel` for all four locales, and the card renders that localized label alongside the EUR amount.

Review RED evidence:

- Unit: the new localized `unitLabel` test failed before validation was added.
- E2E: 12 new assertions failed before the first correction pass, covering season marker, modal live region, delete focus, described error, fallback truthfulness and confirmed keyboard action.
- Contact's initial broad HTML check was refined to `main`, where it failed before localized demo copy was added.
- A separate synchronous Clipboard/fallback exception test failed before the outer exception path was implemented.

## Concerns

- `document.execCommand('copy')` produces deprecation hints in the fallback and the two tests that exercise it. It is used only as the required fallback after Clipboard API failure; the primary path uses `navigator.clipboard.writeText`.
- The example Task 9 test addresses a summer-only tomato without selecting a season. The committed E2E fixes browser time to July so it tests the intended visible product without changing seasonal source data.
