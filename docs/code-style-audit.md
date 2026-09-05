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

## Remaining-boundary implementation (2026-09-05)

Implementation baseline: `c35c733` on `dev`. The user authorized the four
remaining maintenance scopes. Their code changes are implemented; browser and
data-dependent validation limitations are listed separately below.

### Shared validation and action contracts

- Bingo completion now validates a feature-owned Zod schema and returns the
  common discriminated `ActionResult<{ isCompleted: boolean }>`. Successful
  completion/undo retains the existing silent UI (`message: ""`), ownership,
  availability dates, idempotent upsert, and cache targets. DB failures return
  existing localized failure copy. The client catches transport rejection so
  the existing optimistic rollback also handles thrown requests.
- Preferred arcade uses a feature-owned schema with the same integer input
  policy and active/existing-arcade lookup. DB failures return the existing
  localized profile-save error; transport failures also reach the notice UI.
  Success preserves the session user's update and all cache paths/tags.
- Token regeneration explicitly returns `ActionResult`, validates the optional
  locale with its existing Korean fallback, and uses structured failure logging.
  The session identity, version increment and bookmarklet protocol are unchanged.

The old bingo/preferred-arcade result type exports remain forwarding exports for
compatibility. They are not additional runtime code or unfinished orchestration.

### Server orchestration

Twelve existing action entry files now delegate to feature-owned, explicitly
server-only services:

| Feature                                 | Service files under `features/`                                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Announcement administration             | `announcements/server/announcementAdminService.ts`                                                     |
| Arcade administration and preference    | `arcades/server/{arcadeAdminService,preferredArcadeService}.ts`                                        |
| Bingo administration and progress       | `bingos/server/{bingoAdminService,bingoProgressService}.ts`                                            |
| Onboarding, profile, deletion and token | `profile/server/{onboardingService,profileSettingsService,accountDeletionService,syncTokenService}.ts` |
| Feedback and private uploads            | `feedback/server/feedbackReportService.ts`                                                             |
| Exam evidence                           | `exams/server/examProofService.ts`                                                                     |
| Music evaluation                        | `music/server/chartEvaluationService.ts`                                                               |

The nine pure extractions were compared with their baseline contents: aside from
the server-entry directive becoming `import "server-only"`, their bodies are
identical. Existing action tests still exercise these implementations through the
original entry paths. Upload ownership, quotas, cleanup order, redirects,
authorization and cache invalidation were not reinterpreted.

Admin dashboard and sync-monitoring queries/aggregation now live in
`features/admin/server/{adminDashboardService,adminSyncService}.ts`.
Both services check administrator authority before querying. The sync filter
uses `adminSyncFilterSchema`; unknown status still means `all`. The existing
24-hour/10-minute windows, seven-day calendar aggregation, 100-row limit,
coverage counts and health calculation are preserved. JSX and styling stay in
the pages. Query failures propagate rather than becoming invented zero totals.

### Tier-band client requests

`features/tiers/api/tierBands.ts` owns native fetch, response unwrapping and
TanStack Query options. `TierBandSection` uses the query state and retains
intersection loading with a 240px margin, server initial data, explicit retry,
filters, locale and record-detail presentation.

Keys include slug, band, difficulty/level filters, locale, viewer identity and
title preference. The server still resolves identity/preferences itself; they
are not trusted query parameters. Mount-lifetime data has no background polling,
focus/reconnect refetch or automatic retry; inactive queries are collected
immediately. Server one-hour caches are unchanged.

The paired Route Handler now returns `ApiResponse`, meaningful 400/404/500
statuses and `private, no-store` on all branches. A top-level `band` remains
alongside `result.band` for already-open legacy clients during rollout.
Repository search identified the tier browser as the application consumer.
The external bookmarklet, OAuth, health, binary and CSV protocols are untouched.

### Verification and remaining limitations

- Full automated results are recorded below. New coverage tests malformed
  inputs, session requirements, unavailable bingo dates/cells, completion/undo,
  persistence failure, cache targets, all three token/preference locales,
  admin authorization, filters, windows, coverage/health normalization, HTTP
  contracts, cancellation forwarding, query-key isolation and lazy/error/retry
  query transitions. Database writes are mocked.
- Browser: signed-in Korean tier initial data, deferred bands, Expert filtering,
  Pianist goal, Recital mode and the unplayed-record detail panel were checked.
  Japanese/English title and locale rendering were checked. No document-level
  overflow was observed in Korean/Japanese 320px and English 1280px samples.
- Browser: admin dashboard counts/seven-day chart and sync-monitoring empty
  state rendered; the failed-status filter reached its correct URL. Admin
  syncs at 1280px had no document-level overflow. A populated sync history was
  unavailable, so its counts/health mapping is covered by unit tests, not a
  populated browser run.
- Browser: stopping the agent-started local server produced Japanese tier retry
  buttons. Restarting the dev server caused a browser connection-error page
  before manual recovery could be verified. The Browser control surface then
  refused access to that error document. That attempt did not verify recovery.
  The follow-up below subsequently verified manual retry-to-success without
  stopping the application server.
- No real bingo completion, preferred-arcade save, token rotation, upload,
  account deletion, evaluation vote or administrative content write was
  performed. Their full end-to-end write/error recovery and the earlier enabled
  evaluation form remain validation follow-ups requiring appropriate disposable
  fixtures or user-controlled activity. No real account data was manufactured.
- These are bounded runtime-validation caveats, not additional unimplemented
  service migrations and not a claim of whole-application browser coverage.

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
- The initial Prettier findings included four GitHub issue templates and the
  Foundation regression HTML. The issue-template formatting is now corrected;
  the design specimen remains untouched. See the current handoff for the latest
  full-check findings. No warning is silenced through ignore entries.

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

## Current handoff

The requested input/result, tier request and listed server-orchestration code
migrations are implemented. The unused/format candidate review is also complete;
review does not authorize blindly deleting every warning. Do not reopen these
implementation items from the initial audit text.

Current verification: **90 test files / 704 tests passed**. Lint, independent
typecheck, dependency-only Knip, production build and scoped
formatting/whitespace checks passed. The build used the existing local
environment; it did not run deployment migrations or change environment files.

The four GitHub issue-template files had only trailing blank-line differences;
these were formatted with no content changes. Full repository formatting is
still not clean: the preserved Foundation regression HTML and concurrently
edited `docs/design/84-deep-verification-report.md` were reported. Neither
design artifact was edited by this maintenance task.

Full Knip reports 4 unused files, 57 exports and 45 exported types. The two extra
type warnings relative to the earlier 43 are the retained bingo/preferred-arcade
compatibility re-exports. The three UI-file candidates were read and searched
again; no current imports were found. They remain candidates, not removed
features. The manually executable legacy import script and all viewer/editor
warnings remain protected from automatic removal.

No new dependency, DB schema/migration, environment, deployment or viewer/editor
change is needed for this patch. Concurrent changes in `CLAUDE.md` and
`docs/design/` belong to the other ongoing work and are excluded from this
maintenance scope. The user retains commit/push/PR ownership.

### Browser validation follow-up — 2026-09-05

- Profile settings: submitted the signed-in account's existing values without
  editing fields. The save completed and redirected to its profile. This is an
  unchanged-value save check, not coverage of changed settings or invalid input.
- Tier recovery: a temporary, local, read-only forwarding server injected one
  HTTP 503 for `basic-s` band `832` (the 13.0 band). Other visible bands loaded.
  The browser displayed the affected band's `다시 불러오기` button. Clicking it
  issued the same GET again, returned HTTP 200, removed the retry button and
  rendered `달성 0/78` with the song cards. The application server stayed running.
  The temporary forwarding server was then stopped. This verifies a transient
  HTTP failure and manual recovery, not every offline/timeout scenario.
- No application code, DB schema, environment or deployment configuration was
  changed for this check. No seed or destructive recovery operation was run.
- After explicit account-use approval, changed the Discord-name privacy setting
  from off to on, saved and reopened settings to verify persistence. Restored
  off, saved and reopened settings again to verify restoration. This checks
  setting persistence; it does not establish a separate logged-out privacy test.
- Submitted one clearly labelled verification-only feedback report with
  `public/icon/checkBox.png`. The UI confirmed receipt. Admin feedback displayed
  report `1`, the exact test content and the private attachment; the image loaded
  with natural dimensions of 32 by 32. An initial change to `resolved` was blocked
  by automatic safety review until separate explicit status-change approval.
  After the user supplied that approval, the browser action succeeded: report
  `1` disappeared from the open list and appeared in the resolved list with a
  reopen button. A read-only DB check confirmed `resolved` and a populated
  resolution timestamp. The test report and image remain stored, not deleted.
  No existing report or avatar was deleted or replaced.
- Bingo `1`, cell A1: started at 0/25, completed only A1 and reopened the page to
  verify 1/25 and CLEAR. Undid that completion and reopened the page to verify
  0/25, 25 incomplete cells and zero complete cells. The normal upsert/undo path
  restores the completion state, not necessarily the absence of a progress row
  or its timestamps; no direct DB cleanup was performed.
- Preferred-arcade changed-value verification remains unavailable: the current
  gamecenter list has no entries and profile settings offer only the unset
  option. No fabricated arcade or shared-DB seed was added for this check.
- After separate explicit acknowledgement of bookmarklet invalidation, executed
  token regeneration once in the current local signed-in account. The confirmation
  dialog closed through its success path; a read-only DB check confirmed account
  `1` and persisted `sync_token_version: 1`. Reopening the bookmarklet page rendered
  its registration section and NosLog sync link. No token value was printed,
  copied to the clipboard or recorded. The user must register the replacement
  bookmarklet for this environment. Actual NOSTALGIA-side execution of the new
  bookmarklet and an old-token rejection request were not performed.
- Existing-avatar replacement, account deletion and fabricated exam proof remain
  excluded. No production deployment or separate production-account token
  rotation was performed.
- The earlier unit/lint/type/build results above are historical results from the
  committed refactor; they were not rerun for this documentation-only follow-up.
