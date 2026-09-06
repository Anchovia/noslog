# NosLog 2.0 implementation verification

This is an implementation evidence log, not a new design authority or a release
approval. The implementation and full page-suite verification are incomplete.
No commit, push, branch operation, or pull request has been performed by the
implementation agent.

## P2 HOME-23 and fluid desktop layout — 2026-09-06

Scope: the user's updated Home destination collection and requested proportional
desktop space. No later P-page implementation is included. Home navigation now
shares the search width: three compact columns (3/3/2), and four columns bounded
to 640px from the intermediate tier. Tiles place the 20px icon above the label,
with an 8px gap, 12px compact or 24px larger padding, and the existing surface,
radius, and control text tokens. The measured 14/20 to 12/16 fitting cascade
restores the larger style when space permits and wraps only as a final fallback.
The component reuses shared destination definitions and localized routes.

Figma MCP design context and screenshots were inspected for compact `1134:984`,
wide `1161:15947`, and intermediate `1164:5819`. Read-only node inspection also
covered 320px Japanese `1140:2144` and English `1142:2284`. Browser screenshots
and geometry were compared with these targets: 390px tiles are approximately
111.33px wide and 72px tall; wide tiles are 148px by 96px with 16px gutters.
The fractional compact distribution is normal CSS grid rounding. Narrow fitted
labels can produce 68px tiles, matching the Figma fit variants. The approved
single-file Pretendard JP delivery remains unchanged; Figma's fallback glyph
rasterization is not used as a reason to replace the required font.

Foundation 24 and brief 15 record the fluid shell refinement. At desktop sizes,
header/main/footer inner wrappers use 90% of the available shell width, capped
at 1440px. Their padding follows the resulting bounded width. Production-site
inspection reconfirmed Microsoft's proportional header/footer space and Shopify's
bounded navigation. The 90% rule is a NosLog implementation choice for the user's
fluid-width request, with the existing ceiling and spacing tokens retained.

The shell matrix covers 11 routes in three locales at 13 widths, including both
sides of the proportional-width and padding transitions. P2 checks cover three
locales, both themes, ten widths from 320 to 2560px, all eight destination links,
search-preview keyboard behavior, and accessibility at compact/intermediate/wide
sizes. The existing Discovery and Tiers matrices were updated for their actual
available results area: at 1280px, Discovery reflows to four columns and compact
Tiers to six. Both now also check the larger 1600px viewport. Their application
components and styles were not changed.

The local Home has no published announcement rows, so its lower content differs
from Figma's populated specimen. This checkpoint verifies the requested navigation
changes, not completion of every P2 content/state variant or the complete P1–P16
suite. No viewer/editor, administrator route, font asset, dependency, or database
schema is changed.

Final verification passed: full ESLint, TypeScript, production build, all 745
unit tests across 99 files, changed-file formatting, whitespace checks, and the
layout detector (zero findings). The complete current `noslog-v2-*.spec.ts`
browser selection finished with 149 passed and 45 conditionally skipped cases.
The skips avoid duplicate viewport matrices or run project-specific behavior in
its appropriate project; no failing assertion was skipped. An initial run found
nine failures from the former fixed column expectations in Discovery/Tiers;
after updating those expectations and adding the wider checks, the entire
selection passed. This does not claim that the older repository-wide E2E
limitations recorded below have been resolved.

Final browser artifacts: `/tmp/noslog-home-23-final`; browser log:
`/tmp/noslog-home-23-final.log`; unit/build logs:
`/tmp/noslog-home-23-unit.log` and `/tmp/noslog-home-23-build.log`.
This is a verified P2 navigation/common-width checkpoint. Stop here for the
user's commit; do not continue into the next page or commit/push on their behalf.

## Common layout correction — 2026-09-06

The user approved a common maximum including header and footer contents after
reviewing production-site layout evidence. Foundation 24 records the normative
maximum; brief 15 SHELL-35 supersedes SHELL-34. The implementation reuses the
existing Figma wide-container token, centers the ordinary main region, and gives
the footer a bounded inner wrapper. Standard pages use the same ceiling. Header
and footer surfaces remain full width, and the menu follows its centered trigger.

Shell and page padding now respond to available container width. Browser inspection
found that a 672px viewport with a 15px scrollbar previously produced 24px shell
padding but 16px page padding. The corrected 657px available-width case uses 16px
in all three regions. This avoids a viewport/container breakpoint mismatch.

Figma MCP design context was read for C8 header `247:14` and footer `535:430`.
In-app browser checks covered compact and wide layouts, the open navigation panel,
the scrollbar boundary, and a 2560px viewport. Measured header height remains 60px,
menu target 44px, wordmark 20/28, and footer notice 14/20; the user-approved
Pretendard JP family remains unchanged. New width and inline alignment intentionally
supersede the old C8 geometry. The Figma file itself was not edited.

Final verification passed: ESLint, TypeScript, production build, 745 unit tests
across 99 files, formatting checks, and the layout detector (zero findings). The
complete current `noslog-v2-*.spec.ts` browser selection finished with 135 passed
and 39 conditionally skipped cases; skips include duplicate viewport matrices and
project-specific variants, not ignored failures. The new shell suite's seven
cases all passed in its explicit desktop-project run, including all mobile widths.
Final browser results are in `/tmp/noslog-shell-1440-complete`, with the run log
at `/tmp/noslog-shell-complete.log`; unit/build logs are
`/tmp/noslog-shell-unit.log` and `/tmp/noslog-shell-build.log`.
This does not supersede the older repository-wide E2E limitations below.

During verification, the worktree's code changes became part of existing commit
`fb355ae`. The implementation agent did not run a commit or push; only this evidence
log remained uncommitted at the final check.

The shell regression covers 11 ordinary routes in KO/JA/EN at 320, 390, 672, 768,
1056, 1280, 1440, 1920, and 2560 CSS px. It checks centered bounds, full-width
surfaces, padding agreement, menu anchoring, Escape/focus restoration, compact
background inertness, shell accessibility, and the original 390px viewer shell.
Auth uses its separate existing layout and is not assigned an ordinary footer.
No viewer/editor or `/admin/*` source, font asset, database schema, or page-specific
component was edited. Unimplemented page interiors, including Bingo's legacy card
composition, still require their separate P-page implementation.

This is a common-layout checkpoint, not completion of P1–P16. Subsequent page work
must proceed P1, P2, and onward, one page per verified checkpoint and commit title.

## Legacy ranking cleanup — 2026-09-06

The user explicitly authorized completing the previously blocked ranking cleanup.
A TypeScript module-resolution scan of repository JS/TS sources found only four
imports from outside the 11-file legacy group: profile data, two ranking test
files, and the legacy table-helper test import. The production Rankings page and
API already use the new `features/rankings` implementation.

The profile's `getUserRankingPosition` function moved to
`features/rankings/server/rankingPosition.ts`; its function body was compared with
the original and is identical. Profile data and its tests now import that module.
After migration, the reference scan found zero imports from outside the legacy
group. The nine `components/rankings/` files, obsolete
`features/rankings/api/userRankings.ts`, and former `lib/rankings.ts` were then
removed. A final source search found no remaining references to those paths.

The three existing position tests and the real-database profile/ranking consistency
test remain. Two Basic Rating tests now exercise `getGlobalRankingPage`. Five tests
of deleted table helpers and superseded behavior were removed: formatting, two old
pagination cases, old URL assembly, and Basic-only Rating normalization. Current
formatting, URL, pagination, and Recital Rating behavior retain coverage in the
current ranking unit/browser suites. This accounts for the total changing from
750 to 745 unit tests; no failing test was skipped to obtain a pass.

Verification passed: full ESLint, standalone TypeScript, the production build, all
745 Vitest tests across 99 files, and 32 ranking/profile browser cases. Six existing
duplicate desktop cases remain skipped. The six new profile cases use real local
API responses to compare Basic/Recital global and country ranks in KO/JA/EN at
mobile and desktop sizes. Results are in `/tmp/noslog-ranking-cleanup.ZZOVZf`.

The in-app browser confirmed ranking-to-profile navigation, 5,683 Basic / 5,210
Recital Grd, and the fixture's unchanged global/country rank. P5 compact Figma node
`1806:6` was reopened through MCP and compared with Rankings; 24px/32px heading
type and 72px rows are unchanged. No active UI component, style, font, public API,
viewer/editor, administrator route, or database schema was modified. The paused
implementation and previously recorded repository-wide E2E caveats remain separate.

## Single-file font correction — 2026-09-06

After the user committed and pushed the checkpoint, the user explicitly rejected
split fonts and requested the code and briefs be corrected. The current delivery
uses the unchanged `PretendardJPVariable.woff2` extracted from the supplied official
1.3.9 archive. The 119 superseded split files have been removed, and one `@font-face`
without `unicode-range` loads the full variable font. The license and source/hash
manifest remain beside the single font file. The vendor script now accepts that
release archive and does not fetch or recreate split files.

Foundation 24, provenance 25, scope audit 57, handoff 63, and the README's authority
pointer reflect the new decision. The older PDF's font-delivery description is
superseded by the editable sources. No viewer/editor, administrator route, font
weight, fallback order, or KO-only glyph feature was changed.

Validation for this correction passed:

- Full ESLint, standalone TypeScript, the production build, and all 750 Vitest
  tests across 99 files. The revised Foundation test requires exactly one JP WOFF2
  file and one font face, verifies the original font/license hashes, and rejects
  `unicode-range` delivery.
- All 122 existing P1–P5 browser cases passed with the complete font, including
  multilingual reflow, accessibility, Figma geometry, and interaction coverage.
  The 32 existing duplicate/project-specific skips remain unchanged.
- All six new font-delivery cases passed across KO/JA/EN and mobile/desktop. Each
  visits Home, Discovery, Music Detail, Tiers, and Rankings, verifies one JP font
  URL, an initial successful response, loaded variable weights, the locale glyph
  feature, and no horizontal document overflow.
- The initial font-network assertions misclassified successful cache validation
  (`304 Not Modified`) as failure. After correcting that assertion, all six cases
  passed in `/tmp/noslog-font-verified.5VefXW`. The earlier 122-case pass and the
  diagnostic failures remain in `/tmp/noslog-font-qa.mqAcbj`.
- The in-app browser was inspected at compact and desktop sizes. The P5 compact
  Figma screenshot (`1806:6`) was reopened through MCP and compared with Rankings;
  the title remains 24px/32px and player rows remain 72px. The supplied-font
  exception and real fixture content explain the existing differences from the
  Figma specimen; this does not claim whole-suite pixel parity.
- Re-running the archive importer reproduces the font, license, manifest, and CSS
  byte-for-byte. No protected viewer/editor/admin source or existing standard
  Pretendard loader changed.

This verifies the bounded font correction. The previously recorded repository-wide
E2E failures and paused P6–P16 implementation remain outside this correction.

## User-requested checkpoint — 2026-09-06

The user requested a pause before starting another page family and will own the
intermediate commit and push. P6 has only been inspected; no P6 implementation was
started. The checkpoint contains the common Foundation, scoped application shell,
reusable UI, and the principal P1–P5 implementations: Music Detail, Home, Discovery,
Tier Lists, and Global Rankings. It also contains three community-data migrations,
isolated local verification fixtures, and the related tests. It is not a finished
NosLog 2.0 release or a claim that every C1–C8 variant has been delivered.

The production build passed against the isolated local PostgreSQL database. The
full repository Playwright run completed with **139 passed, 21 failed, and 34
intentionally skipped duplicate/project-specific cases**. The failure report remains
in `playwright-report/` and `test-results/`. It is a failed repository-wide run.

| Failure group                  | Cases | Observed cause and disposition                                                                                                                                                            |
| ------------------------------ | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legacy accessibility baseline  | 4     | Music and Rankings now return zero violations, while the old test requires the former `color-contrast` violation to remain. The assertions still require migration.                       |
| Legacy localized Music heading | 6     | Tests expect the old Search heading; Figma's current heading is Music / 악곡 / 楽曲.                                                                                                      |
| Legacy primary navigation      | 2     | Tests expect an always-visible primary menu; the new shell uses the final expandable destination menu.                                                                                    |
| Legacy Tier controls           | 2     | Tests expect the previous button roles, native goal selector, and filter triggers. The new scope controls have separate passing feature coverage.                                         |
| Legacy Music interactions      | 4     | Tests expect the old view/sort controls and a record prompt on initial detail entry; the final detail enters Chart Info.                                                                  |
| Guest language-change entry    | 2     | The old header language region is absent. P10 Settings and its public route are not implemented yet; guest language switching is an unfinished cross-page flow.                           |
| Discovery append focus         | 1     | A request-animation-frame callback could run before appended results committed. Fixed by applying the focus intent after the rendered item count changes; revalidation is recorded below. |

The unchanged Home accessibility baseline still permits `document-title`; its
presence is not an accessibility pass. The unfinished `/settings` destination,
language-change flow, and legacy test migration remain checkpoint caveats. Tests
were not deleted, marked as expected failures, or newly skipped to conceal these
results. New feature screenshots and revalidation use a separate temporary output
directory so the full-run failure evidence remains available.

After the focus correction and scoped formatting, the final checkpoint checks
passed: ESLint, standalone TypeScript, the production build, all **750 Vitest
tests across 99 files**, and the Figma-token generator's reproducibility check.
The combined P1–P5 browser revalidation passed **122 cases**, with **32 existing
duplicate/project-specific cases skipped**, including the previously failing
desktop append-focus case. Results are in `/tmp/noslog-v2-checkpoint.uICRRi`.
This targeted pass does not turn the preceding repository-wide run into a pass;
the other 20 recorded failures and the audit advisory remain unresolved at pause.

No further page implementation continues after this checkpoint. P6–P16, remaining
component variants, the two pending design questions, and the final full-suite
verification remain for the resumed implementation task.

`npm audit` reported one existing moderate advisory, GHSA-6gmq-8vp8-gcm6, in
`@xmldom/xmldom@0.8.13`, reached through the unchanged `pixi.js@8.19.0` dependency.
Neither `package.json` nor `package-lock.json` was changed. Updating the renderer's
dependency tree is outside this UI checkpoint's locked viewer/editor boundary.

Generated token and font CSS now follows the repository's Prettier configuration;
the generators apply the same formatting so rerunning them remains reproducible.
Font bytes, the JP license, and Figma token values are unchanged.

## Authority and preservation

- Visual source: NosLog v2.0.0 (`cVbWCxhkfxFfHmAKLCyKrD`), P1–P16 and C1–C8.
- Z1 is excluded from implementation and has not been accessed in this task.
- Typography follows the user's latest explicit exception: one complete official
  Pretendard JP Variable 1.3.9 WOFF2, hosted on the application origin. The supplied JP
  archive provides the unchanged font and license. Their hashes are recorded.
- Ordinary styles are scoped to `.noslog-ui`; the existing chart viewer/editor and
  `/admin/*` retain the existing shell and theme.
- The existing administrator page was opened before and after the shell change;
  its original font, header, controls, and layout were retained in that comparison.
  Complete preservation regression testing remains required before delivery.

## Executed checks — 2026-09-06

| Check                               | Observed result                                                                                                                                                                                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Full ESLint                         | Passed after the P5 implementation; repeat after subsequent changes                                                                                                                                                                                                                                              |
| TypeScript                          | Passed after the P5 implementation; repeat after subsequent changes                                                                                                                                                                                                                                              |
| Full Vitest                         | 99 files, 750 tests passed, including the explicit local-database integration suites                                                                                                                                                                                                                             |
| Foundation integrity                | Scoped selectors, declared token references, original font bytes, and the JP license hash passed                                                                                                                                                                                                                 |
| Home browser interaction            | Search scope, actual STULTI preview, empty published-chart scope, clear and Escape inspected                                                                                                                                                                                                                     |
| Discovery browser interaction       | Explicit 20-result append, first-appended-result focus, list/grid result preservation, staged filters, Escape/Back cancellation, and committed results passed                                                                                                                                                    |
| Discovery desktop behavior          | Immediate visible-rail filtering and explicit difficulty selection for level sorting passed                                                                                                                                                                                                                      |
| Discovery request states            | Delayed replacement, retained-result activation blocking, failure/retry, empty, incremental error/retry, and duplicate-free append passed                                                                                                                                                                        |
| Published-chart composition         | Mocked public read response verified one group per song, published targets only, preserved viewer destinations, and omission of the Music view switch                                                                                                                                                            |
| Discovery responsive/localization   | KO/JA/EN at 320, 390, 768, 1024, and 1280: no horizontal document overflow; container-based grid counts passed                                                                                                                                                                                                   |
| Discovery accessibility             | Automated WCAG A/AA scans passed for all three locales and the published-chart grouped result fixture                                                                                                                                                                                                            |
| Figma/browser comparison            | P2 Home and P3 Discovery inspected at compact and wide widths; corrected inside-border geometry, compact search/result positions, and Discovery's wide top padding                                                                                                                                               |
| Chart Info browser matrix           | 11 Chromium tests passed across mobile/desktop; 3 duplicate desktop locale matrices intentionally skipped. Entry defaults, difficulty history, 82px single-row selector, pattern values, aggregation threshold, help focus restoration, and region-local retry passed                                            |
| Chart Info reflow and accessibility | KO/JA/EN at 320/390/768/1024/1280: no document or radar-label overflow; automated WCAG A/AA scans passed at 320 and 1280                                                                                                                                                                                         |
| P1 Figma comparison                 | Corrected the radar to the actual P1 surface variable, the 16px following gap, 12px basic-info heading gap, and the borderless outer difficulty track. The Pretendard JP override is intentional                                                                                                                 |
| Community persistence               | Five real local-database tests passed: exact-scope eligibility, independent votes/evaluations, nullable pattern axes, legacy-data preservation, idempotent Helpful, private deduplicated reports, advisory review candidates, and consequence-specific deletion                                                  |
| P1 combined browser regression      | 59 Chromium tests passed for Info, Record, Ranking, and Tier & Evaluation; 15 duplicate desktop locale/theme matrices intentionally skipped                                                                                                                                                                      |
| Record interactions                 | Improvement-chart keyboard navigation and exact table, recent-play disclosure, optional peer comparison with insufficient-sample handling, FAST/SLOW series, and empty/single/guest/partial states passed                                                                                                        |
| Ranking interactions                | 25-row pages, six score buckets, competition ranks, current-user summary, canonical page URLs, Back, failure/retry focus, and empty states passed                                                                                                                                                                |
| Record and Ranking reflow           | KO/JA/EN at 320/390/768/1024/1280 with no horizontal overflow; automated WCAG A/AA scans at 320 and 1280 passed                                                                                                                                                                                                  |
| Ranking persistence                 | Four local-database tests passed: ties across page boundaries, achievement-time ordering, stable user-ID tiebreaking, and invalid/out-of-range page normalization                                                                                                                                                |
| Record and Ranking Figma comparison | Corrected 32px panel spacing, 42px content-width tabs, outlined score-chart points, FC beside Pianist, and single-line seven-digit Pretendard JP scores                                                                                                                                                          |
| Community browser states            | Six placement meanings, grouped history (5 then 10), observed-value distribution paging, global bar scale, nullable pattern ratings, retained rejected input, scoped deletion cancellation, 10-opinion continuation, contextual menus, initial/incremental failure and retry, and guest/ineligible states passed |
| Community reflow and accessibility  | KO/JA/EN in Light and Dark at 320/390/768/1024/1280; no horizontal overflow, 48px rating targets, fixed row geometry, and automated WCAG A/AA scans at 320/1280 passed                                                                                                                                           |
| Community local browser persistence | Existing local E2E_RANKER session saved/edited a pattern evaluation and opinion; saved/deleted a Basic FC vote; toggled and reversed Helpful; submitted a private report against a local fixture; deleted only the opinion while retaining its pattern rating                                                    |
| Community persistence follow-up     | Seven database tests now cover opinion-specific creation/edit times, private report snapshots surviving public deletion, account-deletion cleanup, and zero-vote advisory review recomputation in addition to the original contribution cases                                                                    |
| P4 tier browsing                    | All six scopes, staged compact filters, immediate wide filters, inclusive band-range selection, compact/detailed cards, local band retry, unavailable/empty results, calculation-chart keyboard values, exact Music-detail context and Back/scroll restoration passed                                            |
| P4 responsive and theme correction  | KO/JA/EN compact and detailed cards at 320/390/768/1024/1280 passed, including actual Light/Dark and WCAG A/AA checks. An earlier test used the wrong storage key; the corrected suite uses `noslog-theme` and explicitly asserts the active theme                                                               |
| P5 ranking data                     | Seven service tests and two local PostgreSQL tests cover published-integer ties, 25-player boundaries, containing-page personal navigation, region rank, active-mode exams, profile rank consistency, both modes' Pianist rating source, and unavailable-source semantics                                        |
| P5 browser behavior                 | Page and mode/metric/region history, My-position focus, manual metric keyboard activation, retained committed units during pending requests, obsolete-response rejection, update-error retry/focus, 0/1/25/26-player boundaries and guest return URLs passed                                                     |
| P5 Figma and typography             | 72px rows, 24px C3 ExamBadge, rank 1–3 emphasis including ties, square country flags, inset region selector, 42px metric choices, and the latest localized recovery copy were compared with the final Figma nodes; Pretendard JP remains the explicit font exception                                             |
| P5 responsive and accessibility     | KO/JA/EN in Light and Dark at 320/390/768/1024/1280, with the 1,284-player / rank-127 fixture, passed document reflow, summary containment, row geometry and WCAG A/AA checks at 320/1280                                                                                                                        |
| Latest P4/P5 combined browser run   | 50 Chromium tests passed; 12 duplicate desktop locale/theme matrices intentionally skipped because those matrices explicitly cover both narrow and wide viewports                                                                                                                                                |

The shared Neon development database was only read and has not been modified. The
application now runs against an isolated local PostgreSQL instance for persistence
verification. Existing migrations, the standard E2E seed, the repository's public
578-song catalog, and explicitly local UI fixtures were applied there. The additional
community migration creates new tables without reinterpreting legacy pattern fields,
copying the old perceived constant into goal votes, or changing administrator tables.
Two subsequent additive/corrective migrations separate opinion creation time from
evaluation creation time, allow unavailable review means, and retain private report
snapshots through public opinion deletion. Reports still cascade when their author or
reporter deletes the account. No administrator route or UI was changed.

`prisma/seed-ui-e2e.mjs` requires `E2E_SEED=1` and a localhost database. It supplies
test-account records for STULTI, score improvements, recent plays, and community rows.
`COMMUNITY_TEST_DATABASE_URL` enables the opt-in local persistence tests; their temporary
rows are removed after verification. No private remote play records were copied.

Positive chart-result states use isolated browser response fixtures; this does not
validate the renderer. Figma jackets are representative content; production results
use their actual assets.

The C7 Aggregating vote row is explicitly non-selectable, leaving no entry for a first
vote in that scope. A question about that missing interaction is pending with the user;
neither a new selector nor an interactive Aggregating row has been finalized.

P4's final wide frame omits the Detailed view toggle and calculation-guide entry
present in its compact frame and approved brief. A placement question is pending;
the implementation does not finalize a new wide placement without that decision.

P5's Figma wide list contains 72px rows separated by 1px sibling dividers. Its measured
row step is 73px, which takes visual precedence over the brief's older inset-divider
sentence. Public rank uses the rounded displayed value, while My position uses the
actual ordered row index so a tie crossing a page boundary opens the correct page.
At the checkpoint, automatic approval review rejected a bulk deletion of the old
ranking browser chain. The subsequent user-authorized cleanup is now complete and
recorded above; the formerly blocked files no longer remain in the repository.

## Required before delivery

Finish the remaining page families and component variants, then run the production
build, complete unit/static checks, full browser route/state coverage, both themes,
keyboard and focus checks, locale and responsive checks, and final Figma comparison.
Revisit Home's official-feed/critical-notice states, Discovery destination restoration
and IME/race coverage, the pending first-vote entry decision, remaining P1 refetch states,
positive peer-comparison coverage, persistence/focus edge cases, P4 pending-state and
filter-dialog edge cases, P5 initial-load/error and no-JavaScript pagination evidence,
the other page families, and every preservation boundary. Do not label this document a
full-suite pass. The user's later request permits an intermediate checkpoint title;
that title must describe unfinished implementation and must not imply release or
verification completion.
