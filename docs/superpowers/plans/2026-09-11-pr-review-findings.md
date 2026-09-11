# PR Review Findings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reject impossible or out-of-order editorial dates and verify each recipe page publishes its exact canonical and alternate URL matrix.

**Architecture:** Keep editorial validation inside `assertValidEditorial`, using a small Gregorian date helper that preserves its existing item-specific validation errors. Strengthen the Playwright assertion at the rendered document boundary with literal URLs for one recipe across all locales.

**Tech Stack:** TypeScript, Vitest, Astro, Playwright.

**Spec:** CodeRabbit review findings supplied in the task.

## Global Constraints

- Do not change related-product identifiers or related-product markup.
- Preserve editorial-item context in validation errors.
- Test before production code; capture a failing baseline and a passing result.
- Run focused unit and editorial E2E tests, `npm test`, and `npm run build` before committing.

---

### Task 1: Editorial calendar validation

**Files:**
- Modify: `tests/unit/editorial.test.ts`
- Modify: `src/domain/editorial.ts`

**Interfaces:**
- Consumes: `assertValidEditorial(items, productIds)`.
- Produces: rejection of non-Gregorian ISO dates and `modifiedAt` values earlier than `publishedAt`.

- [x] **Step 1: Write focused failing tests**

Import `assertValidEditorial`, clone a valid editorial item, and assert that `2026-02-30`, `2025-02-29`, and a date with an earlier `modifiedAt` throw errors containing that item's ID. Assert that `2024-02-29` is accepted.

- [x] **Step 2: Run the focused unit test to verify the new cases fail**

Run: `npm run test:unit -- tests/unit/editorial.test.ts`

Expected: the invalid-calendar and modified-order cases fail because the current validator accepts them.

- [x] **Step 3: Implement the smallest validation helper**

Add a `YYYY-MM-DD` Gregorian parser that rejects rollover dates and use it before the chronological comparison in `assertValidEditorial`.

- [x] **Step 4: Re-run the focused unit test**

Run: `npm run test:unit -- tests/unit/editorial.test.ts`

Expected: all editorial unit tests pass.

### Task 2: Recipe URL metadata matrix

**Files:**
- Modify: `tests/e2e/editorial.spec.ts`

**Interfaces:**
- Consumes: the public recipe page at `/es/huerto-recetas/ensalada-tomate-cebolla-roja-aceite-oliva-bio/`.
- Produces: exact canonical and `es`, `en`, `fi`, `da`, and `x-default` alternate link assertions.

- [x] **Step 1: Write the exact metadata expectations**

Replace the regex/count-only test with literal fully qualified `https://bionatura.es/...` URLs for all six links associated with the tomato salad recipe.

- [x] **Step 2: Run the editorial E2E spec**

Run: `npm run test:e2e -- tests/e2e/editorial.spec.ts`

Expected: all scenarios pass while a wrong locale route or an incorrect x-default URL would fail.

### Task 3: Verify, review, and deliver

**Files:**
- Create: `pr-review-fixes-report.md`

- [x] **Step 1: Run the required verification**

Run: `npm test` and `npm run build`.

- [x] **Step 2: Self-review the diff**

Confirm the implementation meets both findings, errors retain editorial item IDs, no related-product code changed, and no unrelated files changed.

- [x] **Step 3: Write the delivery report and commit**

Write the command results and self-review outcome to `pr-review-fixes-report.md`, then commit the scoped changes with `fix: address PR review findings`.
