# PR Review Fixes Report

## Scope completed

- `assertValidEditorial` now rejects calendar-invalid `YYYY-MM-DD` values using Gregorian month and leap-year rules, rejects year `0000`, and rejects `modifiedAt` values earlier than `publishedAt`. All failures retain the editorial item ID in their message.
- Editorial unit regressions cover `2026-02-30`, non-leap `2025-02-29`, valid leap `2024-02-29`, and reversed publication/modification order.
- The tomato salad E2E metadata test now asserts its literal canonical URL and all five exact alternate URLs: `es`, `en`, `fi`, `da`, and `x-default`.
- Related-product identifiers and their rendering behavior were intentionally left unchanged, because assigning repeated IDs across multi-season panels would require out-of-scope season activation behavior.

## Test-first evidence

- Before production code: `npm run test:unit -- tests/unit/editorial.test.ts` produced 3 expected failures, showing that calendar-invalid and reversed dates were accepted.
- After implementation: the same focused unit command passed 8 tests.
- Focused E2E: `npm run test:e2e -- tests/e2e/editorial.spec.ts --grep "tomato salad publishes" --workers=1` passed 2 tests (desktop and mobile Chromium). The final standalone `npm run test:e2e -- tests/e2e/editorial.spec.ts` run passed 23 tests with 1 configured skip.

## Final verification

- `npm test` passed: 8 unit files / 62 tests; 111 Playwright tests passed with 7 configured skips.
- `npm run build` passed: Astro check reported 0 errors and 0 warnings (plus one pre-existing deprecation hint for `document.execCommand`); Astro built 62 static pages.

## Self-review

- The date helper validates fixed-width input, actual month lengths, leap-year century rules, and excludes the nonexistent Gregorian year zero.
- The date comparison runs only after both fields are valid fixed-width dates, so lexical order accurately represents chronological order.
- The route-matrix test uses literal independently derived URL expectations and verifies one alternate link per required locale.
- No related-product code was changed.

## Concern

The initial parallel focused editorial E2E run had two browser-fixture setup timeouts after the local server started. The isolated one-worker test and the subsequent full suite both passed, indicating an execution-environment resource flake rather than an assertion or application failure.
