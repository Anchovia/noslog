# NosLog 2.0 implementation verification

This is an implementation evidence log, not a new design authority or a release
approval. The implementation and full page-suite verification are incomplete.
No commit, push, branch operation, or pull request has been performed.

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
- Typography follows the user's explicit exception: the official Pretendard JP
  Variable 1.3.9 dynamic subsets, hosted on the application origin. The supplied JP
  archive provides the unchanged JP license. Font-file and license hashes are recorded.
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
The old, now-unreferenced ranking browser chain remains in the repository. Automatic
approval review rejected an attempted bulk deletion; that deletion was not performed.

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
