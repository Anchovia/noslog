# Code-style migration audit

Audit date: 2026-09-05. Baseline: `be2ab52` on `dev`.

## Scope and meaning

This is a maintenance/code-style audit against [code-style.md](./code-style.md),
not a NosLog 2.0 design review. It does not reopen completed design-guide work.
The baseline worktree was clean. Branch state was compared with the locally
available upstream reference; no fetch, pull, commit, or push was performed.

The audit inventories the repository's routes/actions, feature boundaries,
RHF/schema usage, client request sites, compatibility files, tooling, and tests.
Repository-wide static checks are combined with targeted source inspection of
the remaining boundary/validation candidates. This is **not** an assertion that
every source line or every authenticated UI state has been manually exercised.

No database data, migrations, environment files, deployment settings, product
UI, chart viewer/editor, or design-guide artifacts are changed by this audit.

## Established conventions observed

- The native-fetch response helpers are in `lib/api/response.ts`. Music detail
  and rankings have feature-owned request functions/query options and paired
  internal Route Handler envelopes.
- The common discriminated Server Action result and field-error helpers are in
  `lib/actions/result.ts` and `lib/forms/errors.ts`.
- Admin music metadata, translations, catalog review, community moderation,
  tiers, exams, submission review, feedback review, and user administration have
  server-service boundaries with thin action entry points. This does not mean
  all their list pages or public counterparts have migrated.
- Feature RHF forms use defaults and Zod resolvers. Public onboarding, profile
  settings, feedback, and exam-proof schema factories accept a translator.
- `lib/db.ts` imports `server-only`; the inspected services' DB dependency keeps
  that code out of client bundles. Lack of a repeated `server-only` import in
  each service is not itself a client data leak.
- Husky's installed launcher runs hook scripts with `sh -e`. The multi-command
  pre-push hook therefore stops on failure; it is not missing fail-fast behavior.

## Corrections in this audit

1. Enforce the already-approved type-only import convention for `features/`
   through ESLint. Add tests for rejection, valid mixed imports, and preservation
   of the viewer's existing lint scope.
2. Remove four unreferenced forwarding files after repository reference search
   and Knip agreed their consumers had migrated:
    - `components/admin/musicTranslationCoverage.tsx`
    - `components/admin/musicTranslationCsvImport.tsx`
    - `lib/musicTranslations/csv.ts`
    - `lib/musicTranslations/export.ts`

Their implementations remain under `features/music/`; no translation feature
or CSV behavior is removed. The deleted forwarding files remain recoverable
from the baseline Git commit.

## Music-evaluation follow-up (2026-09-05)

Code baseline: `11a341f`. The form now uses a localized Zod resolver and inferred
input/output types. Its nullable radio defaults are rejected during validation;
successful output contains numbers and no non-null assertions are needed.
The server reuses the shared schema factory and keeps its existing localized
generic failure response. Authorization, storage, deletion/reaction behavior,
cache invalidation, DOM, labels, and styling are unchanged.

The client still checks the raw 120-character limit; the server still trims
before checking its limit. The form composes that input constraint with the
shared server fields rather than silently changing either contract. Schema
construction is memoized by translator, so typing does not rebuild it.

Tests now cover all three locales, constant boundaries/step, all five missing
pattern values, malformed patterns, blank comments, 120/121-character content,
normalization, the actual RHF resolver's field errors, and server-side localized
failure/normalization. Existing action tests retain create/update, permissions,
delete/reaction, and cache checks using mocked DB calls.

Follow-up verification: **87 test files / 647 tests passed**, including 101
evaluation schema/resolver/action cases. ESLint, independent typechecking,
production build, changed-file formatting, and whitespace checks passed.

Browser verification is limited to the signed-in user's unavailable-vote state:
the profile currently shows no play records. Altale Normal/Expert navigation and
the Expert vote tab were checked; Korean, Japanese, and English copy and disabled
inputs remain present. Enabled input/error recovery/submission/reset interaction
still requires a user with a synced chart record. No record was manufactured,
permission bypassed, or real vote submitted/deleted to satisfy this check.
DOM measurements found no document-level horizontal overflow at Korean
320/1280px, Japanese 320px, and English 320/390/1280px. The inspected browser log
contained no warnings/errors. These unavailable-vote checks do not establish
enabled-form, error-state, or populated-opinion layout coverage.

## Observed migration gaps

These are source-backed maintenance findings, not newly approved product
behavior. Resolve them feature by feature, retaining existing UI/authorization,
request timing, ownership checks, cache invalidation, and localization. Do not
equate a directory move with a verified migration.

### Shared validation and action contracts

| Evidence                                                                                | Remaining work                                                                                                                                                                                                                         | Required verification                                                                                                                              |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/music/musicTierVote.tsx`, `features/music/schemas/chartEvaluationSchema.ts` | Shared validation is implemented; see the follow-up above.                                                                                                                                                                             | Enabled-form browser interaction remains pending because the current signed-in user has no play records.                                           |
| `app/(nevigation)/bingo/[id]/actions.ts`                                                | `ToggleBingoCellResult` still uses `success: boolean` with optional fields, and manually validates inputs. Normalize it with its consumers and a shared schema; preserve the current success state without inventing new visible copy. | Stale session, unavailable bingo, missing/invalid cell, explicit completion and undo, DB failures, cache paths, browser optimistic-state recovery. |
| `app/(nevigation)/gamecenter/actions.ts`                                                | Preferred-arcade input uses a manual integer check instead of a shared input schema. Existing `ActionResult` is already normalized.                                                                                                    | Login requirement, invalid/inactive/missing arcade, persistence failure, cache invalidation.                                                       |
| `app/(nevigation)/bookmarklet/action.ts`                                                | Token regeneration has an inferred discriminated result and raw console error logging. Explicit shared result typing/structured failure reporting remains possible without changing the external bookmarklet protocol.                 | Unauthenticated, successful mocked version increment, persistence failure; never rotate a real token solely for testing.                           |

### Remaining server orchestration

The following contain meaningful domain orchestration in route entry files,
not just rendering or a single route-local helper:

- Admin announcements, arcades, and bingos: `app/admin/{announcements,arcades,bingos}/actions.ts`.
  Their feature schemas/forms are already present; the service boundary is not.
- Public onboarding and profile settings/uploads/deletion:
  `app/(auth)/onboarding/actions.ts`,
  `app/(nevigation)/profile/settings/{actions,securityActions}.ts`.
- Public feedback/uploads and exam evidence:
  `app/(nevigation)/(home)/feedbackActions.ts`,
  `app/(nevigation)/exams/actions.ts`.
- Public chart evaluation, bingo completion, preferred arcade, and token
  regeneration listed above.
- Admin dashboard and sync monitoring: `app/admin/page.tsx` and
  `app/admin/syncs/page.tsx` mix multi-query aggregation with presentation.
  Health-calculation unit tests exist, but do not independently test the full
  page query/filter/normalization boundary.

The existing action tests already cover many of these files. Moving the logic
must preserve those tests and add boundary-specific failure coverage, not replace
them with tests that only prove a wrapper calls a function.

### Client request boundary

`components/tiers/tierBandBrowser.tsx` still constructs a URL, fetches, asserts
the response type, and manages request state locally. Its paired
`app/api/tiers/[slug]/bands/[bandId]/route.ts` returns `{ band }` or `{ message }`,
not `ApiResponse`.

Before changing it, audit the endpoint's consumers and preserve lazy intersection
loading, initial data, filters, locale, user-specific records, retry behavior,
and `private, no-store`. Existing `tier-data.test.ts` is not a dedicated Route
Handler contract test. Add paired request/handler tests and browser checks.
Do not interpret the one-hour server cache policy as permission to cache personal
responses publicly or introduce automatic refetches.

## Retained exceptions and separately scoped findings

- Direct DB imports in Server Components/data modules are not automatically
  violations. Cross-domain utilities and cache access may remain in `lib/`;
  route-local helpers may remain in `app/` under the existing convention.
- OAuth, health, receive-player-data, private binary images, profile-card images,
  CSV downloads, Cron, and Blob integrations are not ordinary JSON form APIs.
  Do not apply the internal JSON envelope indiscriminately.
- The chart viewer/editor and their renderers/types remain locked, including
  any unused-export warnings. Do not use Knip to remove them.
- Knip's baseline reported 8 unused files, 57 unused exports, and 43 unused
  exported types. These are candidates, not a deletion list. Locally used but
  unnecessarily exported symbols can be reported alongside true unused code.
- After the four forwarding removals, remaining unused-file candidates are
  `app/api/getPlayerData.js`, `components/bookmarklet/guideMediaPlaceholder.tsx`,
  `components/music/musicTitle.tsx`, and `components/ui/Card.tsx`.
  The first is an executable legacy external-data script; import-graph absence
  cannot establish whether it is used manually. These files were not removed.
- Whole-repository Prettier checks find pre-existing differences in
  `.github/ISSUE_TEMPLATE/{bug,config,data-correction,feature}.yml` and
  `docs/design/specimens/foundation-v0.1-integrated-regression.html`.
  They are outside this code-boundary patch, and the design specimen is left
  untouched. Do not claim `format:check` is green or silence them with ignore
  entries. Changed-file formatting is checked separately.

## Initial audit verification record

Baseline full unit suite: 85 files / 559 tests passed. Baseline lint and
dependency-only Knip checks passed. Full Knip and repository formatting checks
reported the findings above.

Post-change results:

- Full unit suite: **86 files / 562 tests passed**.
- ESLint, independent TypeScript check, and production build: passed.
- Dependency-only Knip check: passed.
- Changed-file Prettier check and `git diff --check`: passed.
- Full Knip: still reports 4 unused files, 57 unused exports, and 43 unused
  exported types; not treated as a clean result.
- Whole-repository formatting: the 5 pre-existing files listed above remain
  unresolved, outside the changed-file check.
- Removed-path search found no remaining code consumers; the final diff contains
  no viewer/editor, DB schema, environment, or design-guide changes.

No live write action, E2E DB seed, or whole-application browser regression was
performed for this tooling/unused-forwarder-only patch. Future behavioral
migrations still require browser verification; this audit does not waive it.

## Recommended continuation

Complete enabled music-evaluation browser verification when synced records are
available. The next code unit is the public bingo-completion input/result
boundary, followed by the remaining public action/request contracts and server
orchestration listed above. Treat external/protected and uncertain unused-code
items separately. This is a concrete audit backlog, not a claim that the overall
code-style migration is finished.
