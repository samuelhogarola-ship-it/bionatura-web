# PR Review Fixes Report

## Scope completed

- `assertValidEditorial` now rejects calendar-invalid `YYYY-MM-DD` values using Gregorian month and leap-year rules, rejects year `0000`, and rejects `modifiedAt` values earlier than `publishedAt`. All failures retain the editorial item ID in their message.
- Editorial unit regressions cover `2026-02-30`, non-leap `2025-02-29`, valid leap `2024-02-29`, century boundaries `1900` and `2000`, year `0000`, and reversed publication/modification order.
- Both recipe E2E metadata cases assert their literal canonical URL and all five exact alternate URLs: `es`, `en`, `fi`, `da`, and `x-default`.
- Related-product identifiers and their rendering behavior were intentionally left unchanged, because assigning repeated IDs across multi-season panels would require out-of-scope season activation behavior.

## Test-first evidence

- Before production code: `npm run test:unit -- tests/unit/editorial.test.ts` produced 3 expected failures, showing that calendar-invalid and reversed dates were accepted.
- After the initial implementation, the same focused unit command passed 8 tests; after adding century and year-zero boundaries it passed 9 tests.
- Focused E2E: `npm run test:e2e -- tests/e2e/editorial.spec.ts --grep "publishes the exact canonical" --workers=1` passed 4 tests (both recipes in desktop and mobile Chromium).

## Final verification

- Final `npm test` passed: 8 unit files / 63 tests; 113 Playwright tests passed with 7 configured skips. The earlier PR objective recorded 58 unit tests before the date regressions were added; the count increased intentionally.
- `npm run build` passed: Astro check reported 0 errors and 0 warnings (plus one pre-existing deprecation hint for `document.execCommand`); Astro built 62 static pages.

## Self-review

- The date helper validates fixed-width input, actual month lengths, leap-year century rules, and excludes the nonexistent Gregorian year zero.
- The date comparison runs only after both fields are valid fixed-width dates, so lexical order accurately represents chronological order.
- The route-matrix test uses literal independently derived URL expectations and verifies one alternate link per required locale.
- No related-product code was changed.

## Concern

Two earlier Playwright runs had navigation or browser-session timeouts in otherwise unrelated mobile tests. The cause was not confirmed. Each affected case passed in isolation and the subsequent complete suite passed, demonstrating that the behavior was intermittent.
