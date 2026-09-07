# NosLog 2.0 implementation verification

This is an implementation evidence log, not a new design authority or a release
approval. The implementation and full page-suite verification are incomplete.
No commit, push, branch operation, or pull request has been performed by the
implementation agent.

## Resumed implementation — 2026-09-07

The user explicitly resumed implementation after reviewing the pause. P10 Profile,
Privacy and Connections are now integrated alongside Experience; Account/deletion
implementation remains open. The user approved the fixed ten-minute deletion
reauthentication window on 2026-09-07. P11 remains in verification.
P12–P16 have the scoped implementation and evidence below, with live external-service,
design-decision and final comparison caveats still open. Historical checkpoints
later in this file do not supersede this current status. No incomplete page is
declared finished.

### Current integration checkpoint

- P10 `/settings` now delegates to a feature-owned server composition. Categories
  are schema-validated; guest requests for private categories redirect to localized
  Login with the exact category return path. Profile and Privacy use their existing
  server-validated save actions; Connections consumes the OAuth callback's
  `discordError`/`discordResult`. Account navigation retains the existing
  `/profile/settings` destination until the new deletion contract is approved.
- The in-app browser verified nickname change/save/reopen and public-play-count
  change/save/reopen on local test account 1. Both original values were restored
  through the UI. No account deletion or external OAuth identity change occurred.
  The real wide detail column measured 640px inside the approved ordinary shell.
- P10 Experience regression: 11 passed, 3 intentionally skipped duplicate desktop
  width-matrix cases. New guest/category navigation checks passed in all three
  locales. Logs: `/tmp/noslog-p10-integration-browser.log` and
  `/tmp/noslog-p10-navigation-browser.log`.
- P14 local board 45, cell A1: completion/save/reopen showed 1/25; undo/save/reopen
  restored 0/25. The normal upsert/undo may retain an incomplete progress row and
  timestamps. No direct DB cleanup, reset or date-guard change was performed.
- P15 corrected an undeclared line-height reference to the existing Foundation
  token. A successful build initially retained stale Turbopack CSS; removing only
  `.next/cache/turbopack` and rebuilding fixed the production mismatch. Subsequent
  production checks passed 6 Chromium and 12 Firefox/WebKit cases. Print-only root
  backgrounds now remain white, including the final page's unused area. Final
  KO/JA/EN PDFs were rendered and their last pages visually verified. This is print
  output, not new Light-theme UI or legal approval.
- P16 has 13 card model/render/authorization tests, including five real 1200×630
  PNG variants, visually inspected with the approved full Pretendard JP fonts.
  The actual Basic download and Japanese Recital image were verified in the in-app
  browser. Next's output trace includes both server font files. Lucide's unchanged
  Globe geometry is generated once as an asset because Satori cannot run its React
  hooks. Wide share-dialog controls retain their label-sized widths.
- The previous full unit run passed 893 tests in 117 files, with the two optional
  local-DB suites enabled and zero skipped tests. The latest combined presentation
  run passed 71 of 72 cases; one English P11 WebKit case reported same-origin RSC
  request access-control errors. Its fixture was removed and the actual-source build
  passed. This was not an overall browser pass. The expanded post-integration run
  then passed all 108 cases (36 Chromium, 36 Firefox, 36 WebKit), including the
  unchanged English P11 error assertion. The earlier request failure did not
  reproduce and was not filtered out. The fixture was removed and actual-source
  build passed. Log: `/tmp/noslog-p10-p11-p15-p16-integrated-harness.log`.
- Post-integration full unit tests passed again: 893 tests, 117 files, zero skipped.
  Full lint, independent typecheck, scoped Prettier and generated-icon
  reproducibility checks passed. The 108 scoped cases are not a substitute for
  the full actual-source run reported below.
- The first full actual-source browser run completed with 288 passed, 19 failed,
  and 217 skipped cases. Fixture-only cases have separate harness results; skips
  are not passes. Failures identified obsolete Bingo/Exam/Login expectations,
  Light expectations incompatible with the approved forced-Dark policy, a
  development-only Next Image exception assumption, and shell measurement selecting
  React's hidden streaming container. The tests were corrected to the current
  contracts, without suppressing runtime errors or weakening width constraints.
- The malformed-avatar test did not prove a production error boundary: Next's
  installed image loader guards that parse exception with non-production mode.
  It now verifies a genuinely missing local image, accessible initial fallback and
  stable 64px identity slot. Existing P7 fault-injection results remain separate
  evidence; no initial-profile-error pass is inferred from the avatar test.
- P10 now keeps category navigation, back control and heading outside its data
  Suspense boundary. The Profile fallback reuses the four 64px rows from Figma
  `2734:87238`, with 24px rhythm and one localized status announcement; decorative
  rows are hidden from the accessibility tree. Experience no longer loads unrelated
  profile/arcade form data. The expanded P10/P14 harness passed 90 cases across
  Chromium, Firefox and WebKit, and the restored actual-source build passed.
  Firefox's first loading assertions had measured fallback-font and loaded-font
  heading widths against each other; waiting for `document.fonts.ready` before
  the baseline measurement resolved all three without changing layout assertions.
  The latest Japanese Chromium profile capture has complete, unclipped glyphs.
- P14 now streams catalog data inside a feature-owned Suspense composition; its
  four decorative cards reuse the actual responsive grid. Figma `2914:3465`
  supplies the 173px square covers at 390px, 12px grid gap, 8px card rhythm and
  localized 14/20 status. The existing subdued token was added after screenshot
  comparison. Authenticated loading retains a disabled filter control; guests do
  not see personal filters. The final color/control run passed 45 cases (15 per
  browser), and the restored actual-source build passed. The actual signed-in
  browser also transitioned from the loading state to 12 catalog cards without
  overflow. Log: `/tmp/noslog-p14-final-loading-harness.log`.
  No reset, date restriction or mission-source decision was changed.
- The corrected full actual-source run passed 295 cases, with 217 conditional or
  fixture-only skips and no failures. A subsequent cross-browser extension found
  early Home input could be reset before React Hook Form finished initialization.
  Home now uses the existing `formState.isReady` to enable the input and scope
  control. Deliberately delaying JavaScript delivery verified input preservation
  in Chromium, Firefox and WebKit, following the
  [Playwright hydration guidance](https://playwright.dev/docs/navigations#hydration).
  The normal interactive layout is unchanged.
- WebKit serializes the same font family without quotation marks; the font check
  now compares the normalized first family while retaining the exact loaded-face,
  400–700 weight, single-file request and failure checks. Firefox's `fill()` emits
  its own composition end: diagnostic events proved the previous IME fixture had
  already committed the input. The test now sends an explicit unfinished input
  event and still requires zero requests until composition end. Its focused rerun
  passed in Firefox and WebKit. Diagnostic event logging was removed.
- The final Home build, 893 unit tests, lint and independent typecheck passed.
  Chromium Home/font checks passed 15 cases. The final actual-source run passed
  297 cases, with 217 conditional/fixture-only skips and zero failures. The final
  expanded Firefox/WebKit run passed all 56 cases with zero skips. Its Home and
  shell matrices now execute in both engines, covering 320–2560px, rather than
  skipping non-Chromium projects. Final 1440px Korean WebKit and 320px Japanese
  Firefox Home captures were visually reviewed; the actual signed-in in-app Home
  search returned STULTI and cleared correctly. Logs:
  `/tmp/noslog-complete-production-browser.log` and
  `/tmp/noslog-complete-cross-browser.log`. These passes do not resolve the explicit
  external-service, account/deletion, Bingo-policy, language-source, legal-review,
  card-contrast or protected-renderer validation limitations.
- Read-only preservation checks found no changed administrator, chart-viewer,
  chart-editor or chart-mathematics source paths. The actual viewer destination
  retained its legacy shell but showed the unavailable-page state: local DB has no
  published chart patterns. The current test account cannot access Admin. Live
  renderer/editor verification therefore remains unverified, not passed.

### Final independent follow-up — approval gates unchanged

- P12 full-detail comparison used Figma `2804:1036` and `2804:2339` and browser
  captures at 390px and 1280px. The approved 1000px ordinary shell and Pretendard JP
  override the older specimen shell/font. Corrected wide cabinet summary to 14/20,
  visit status to 16/24, separate wide distance, preferred-count placement and
  12/16 subdued type, 8px contact rhythm, and 24px compact report separation.
  Unavailable-cabinet notes now follow their status inline; website display omits
  the protocol while retaining its exact link target and external-link semantics.
- The new P12 specimen fixture is test-only, with explicit synthetic photo labels.
  Its weekday indices use the domain's Monday-zero contract. Photos, map imagery,
  guest-specific actions, live distance/open status, verification age and localized
  currency formatting differ from the static Figma specimen; no exact whole-image
  pixel match is claimed. No synthetic venue facts were written to any database.
- P13 brief 11 requires local selection retention and localized login/retry recovery
  on authorization expiry. Both upload-token issuance and final submission now
  return an explicit login-required flag. The proof form retains its selected file
  after failure and exposes Login with the current locale and exam return path.
  Retention is within the mounted page; this does not claim file persistence through
  a full OAuth navigation. No local image is uploaded on selection.
- Added server regression cases for expiration before token issuance, expiration
  between issuance and submission in KO/JA/EN, unauthenticated discard, and a
  different account attempting submission/discard of the earlier account's proof.
  All 27 proof-action tests passed. Full unit verification then passed 901 tests
  in 117 files with both optional local-DB suites enabled and zero skips.
  Log: `/tmp/noslog-p12-p13-verified-unit.log`.
- Final combined P12/P13 browser verification passed all 75 cases: 25 Chromium,
  25 Firefox and 25 WebKit, zero skipped. It covers existing KO/JA/EN flows plus
  the new P12 layout/type contract at 320/390/960/1280/1470px and P13 expiry
  recovery at 320/390/1470px. Final wide WebKit/compact Firefox P12 captures and
  320px Japanese WebKit proof-recovery capture were visually reviewed. The in-app
  browser also checked the corrected P12 weekday/status/contact rendering.
  Log: `/tmp/noslog-p12-p13-verified-harness.log`.
- Full lint, independent typecheck, `git diff --check` and the restored actual-source
  production build passed. Temporary fixture paths and root fault injection were
  removed; the actual app was restarted at `http://localhost:3000` against the
  explicit local test database. The earlier 297-case actual-source and 56-case
  public cross-browser runs remain prior baseline evidence, not reruns of these
  final P12/P13 edits. Real provider-auth/upload completion is still unverified.

### P16 approved contrast and badge correction — 2026-09-07

- Removed the nickname GRADE badge and its unused derived model value. The
  official Grd, ranks, exam badges and complete Pretendard JP fonts remain intact.
- Applied the approved `#AFAFAF` subdued text to all former `#666674` text in the
  generated card and all three original P16 Figma states. Z1 retains the comparison
  as historical evidence with its approval and badge-removal decision annotated.
- Passed 13 scoped model/render/authorization tests, lint, typecheck and production
  build. Five real 1200×630 PNGs cover Korean base/empty/partial, Japanese long
  nickname and English Recital. Inspected all five outputs and opened the base and
  long-name PNGs in the browser; compared the updated Figma artwork visually.
- This check covers the generated artwork. It does not claim a fresh authenticated
  download/provider flow or full-card WCAG contrast certification. Figma's source
  font and placeholder media differ from the production Pretendard JP and flags.
- Logs: `/tmp/noslog-p16-badge-{tests,lint,types,build}.log`.

### P15 operator display approval — 2026-09-07

The user approved the exact operator display `계롤(Anchovia)` in all locales and
confirmed `sodacandy77@naver.com`. Both are reflected in the policy copy. This
settles the display/contact part of the P15 row below; provider, retention and
legal/translation release checks remain open. The activity-name approval does
not certify legally sufficient controller identification.

### Decisions and access needed before final completion

These are precise outstanding gates, not new design-guide work blocks. Decision
states are recorded per row; the already-approved ordinary Foundation is unchanged.

| Item                   | Concrete decision or missing evidence                                                                                                                                                                                                   | Implementation boundary                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| P10 deletion           | **Approved — 2026-09-07:** fixed ten minutes from completion of deletion-specific Discord verification, as clarified in brief 16. Exact localized confirmation, consequence counts and immediate irreversible deletion remain required. | Decision recorded; server guard, new Account deletion UI and their verification remain to be implemented. No account deletion was executed. |
| P14 reset              | **Approved — 2026-09-07:** reset only the signed-in user's saved checks on the selected board. Personal progress remains owner-only; public board definitions and missions are unchanged. Other boards' progress remains intact.        | Decision recorded; reset implementation and verification remain pending. No records were reset while recording this decision.               |
| P14 dates              | Decide whether manual completion edits are allowed before a board starts and after it ends.                                                                                                                                             | Existing date guards remain in force.                                                                                                       |
| P16 contrast and badge | **Approved — 2026-09-07:** Z comparison B uses `#AFAFAF` for former `#666674` text; remove the nickname's `GRADE` badge.                                                                                                                | Applied to all three P16 Figma states and the generated-card component; scoped verification is recorded below.                              |
| P15 release facts      | Confirm the actual operator/provider/contact and legal/translation copy represented by the review warnings in the policy.                                                                                                               | Rendered page and print checks are not legal or release approval.                                                                           |

Fresh Discord onboarding and provider callbacks, real private-Blob upload/finalization,
official-site synchronization, the Japanese mission source, and a permitted populated
viewer/editor runtime still need the corresponding account, source or environment.
These are access/evidence gaps, not approvals that can make a failed or unexecuted
test pass. Automatic approval review previously rejected the new deletion callback,
Bingo reset and date-guard removal because their authorization/scope was unresolved;
none of those rejected patches was applied indirectly.

The following entries are earlier scoped checkpoints and retain their original
verification limits.

- The code-style test passed alone (3 tests), and the full unit suite then passed:
  827 passed, 13 skipped. The earlier timeout did not reproduce without changes.
- The resumed P11 presentation run passed 18 browser cases: 6 Chromium and 12
  Firefox/WebKit across KO/JA/EN. Its temporary fault injection was removed and
  the actual-source production build passed. Log: `/tmp/noslog-p11-harness-resume.log`.
- The in-app browser now successfully opens the actual local Archive route. The
  empty state is visible; computed ordinary UI uses the Pretendard JP Variable
  font stack, regular weight 400 and Dark theme. This replaces the earlier
  connection failure, not the outstanding authenticated-flow checks.
- Home now consumes both branches of the common announcement service. An active
  critical record uses the existing Warning StatusMessage and a localized title
  link; routine rows remain separate. The critical block shares the Home 640px
  measure. Obsolete Home row styles were removed after replacing their component.
  The Figma critical reference is `1134:1049`; its specimen wording is explicitly
  unapproved, so the UI uses the brief's critical-label/title-link hierarchy.
- The expanded P11 Home/Archive/Detail run passed 27 cases (9 Chromium, 18
  Firefox/WebKit), including Home alignment, absence, link separation and font
  loading. The restored actual-source production build passed. A subsequent
  Markdown list-indent correction has not yet received the full P11 rerun.
- P12 now has public discovery/detail routes, shared search/filter results for the
  map and list, verified cabinet/hour presentation, private report intake and
  responsive detail cards. Additive migrations `20260907230000_public_arcade_details`
  and `20260907233000_arcade_report_context` were applied only to the local test DB.
  Existing administrator pages and legacy data were not rewritten.
- P12 domain/report tests: 25 passed. They cover venue-local overnight hours,
  unknown/stale facts, preference privacy thresholds, search/distance/bounds,
  report authentication, cabinet ownership, private image ownership and retry
  idempotence. Full lint and typecheck passed; the full unit suite passed with
  852 passed and 13 skipped (the skips are not counted as passes).
- P12 presentation verification passed 27 cases: 9 Chromium and 18 Firefox/WebKit
  across KO/JA/EN and 320/390/520/768/1470px. Checks include staged filter apply/cancel,
  map failure with a usable list, responsive detail placement, unknown facts,
  guest report entry, photo navigation, focus restoration, axe and horizontal reflow. The harness
  removed its temporary route and the actual-source production build passed.
  Logs: `/tmp/noslog-p12-final-harness.log`, `/tmp/noslog-p7-fixture-browser.log`,
  `/tmp/noslog-p9-fixture-cross-browser.log` (legacy harness log name).
- The in-app browser independently confirmed a filter applying to one remaining
  result. The initial two browser runs exposed and then isolated an actual History
  API/search-param notification error; the passing run uses the same supported
  history update pattern as music discovery, rather than suppressing the failure.
- P12 Figma contexts include compact discovery/detail/filter/report and wide
  `2804:2245`/`2804:2339`. Comparison corrected wide card insets, the location/hour
  columns, contact rail and report placement. The user-approved 1000px common shell
  overrides the old 1280px specimen's outer width. Real Kakao cluster/marker
  selection and authenticated preference/report persistence were verified in the
  in-app browser against owned temporary local fixtures. The report retained its
  selected cabinet, and published cabinet facts were unchanged. Canonical alias
  redirects and search restoration passed. All three temporary venues/reports
  were removed, and the existing user's original preference was restored.
  Live private Blob upload and final page-wide same-content Figma comparison
  remain outstanding; P12 is not declared complete.

### P13 resumed implementation — in progress

- Read current P13 handoff 80 and brief 11, and Figma Dark contexts `2862:960`,
  `2862:1036`, `2862:1458`, `2862:1313`, and `2862:2811`. The compact selector,
  64px connected jacket rows, fact clusters, collapsed practice card and 292px
  wide grade rail now use the shared ordinary shell and Foundation tokens.
- Public query/model work moved behind `features/exams/server/`; localized slug
  routes were added. Missing play records remain null. Higher same-mode legacy
  and normalized achievements share the certification eligibility calculation;
  legacy zero is not a passed grade. Event proof requests are rejected server-side.
- File selection creates a browser-local preview. Replacement/cancellation do
  not submit. The explicit submit step includes all five required evidence
  elements and private-retention/name-sync guidance. Failed submissions retain
  the file, and uncertain results preserve the uploaded image for retry.
- Submission checks serialize simultaneous public requests per user, prevent
  duplicate pending records, return the existing result for identical retries,
  and reject reuse of an already rejected image URL. The administrator service
  and UI were not edited.
- Scoped typecheck/lint passed, and 34 exam domain/schema/action tests passed.
  The three-locale presentation suite passed 27 browser cases (9 Chromium and
  18 Firefox/WebKit). It covers reflow, history, Event chart choices, focus,
  local file selection, retry preservation, success/guest/empty states and axe.
  Earlier failures exposed duplicate sibling React keys and an inappropriate
  added hover background; both were fixed. WebKit file tests now use the actual
  upload button/file-chooser path rather than racing hydration through hidden inputs.
- A restored-source build initially failed because `.next/dev/types` still
  referenced a removed temporary fixture route. The development server was stopped
  and only that generated cache was removed. The clean rerun passed all 27 browser
  cases and the restored actual-source build (`/tmp/noslog-p13-harness-clean.log`).
  Full lint/typecheck then passed with 865 unit tests passed and 13 skipped.
- The official import tool's read-only validation resolved all 28 exams and 84
  stages against the explicit local DB (`127.0.0.1:55432/noslog_v2`). Applying it
  created 28 records and updated zero existing records; the separate seeded
  `e2e-event-exam` remains intact. No shared or production database was changed.
- Known Event identities use locale catalog labels. The KAC labels follow the
  Figma JA/EN specimens; the Japanese Virtuosity identity was checked against
  [the official Op.3 news](https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html).
  Native translation review remains a standing caveat.
- Actual browser checks confirmed Basic 8 requirements/three music destinations,
  missing-record analysis, Recital scoring/no analysis, and the official 7th KAC's
  three-chart chooser and absence of certification. The local account has Grd but
  no synced player name, so certification correctly requests synchronization.
- A final presentation pass added rejected, oversize, replacement and controlled
  pending-upload coverage. All 36 cases passed (12 Chromium, 24 Firefox/WebKit),
  followed by the restored-source build (`/tmp/noslog-p13-final-harness.log`).
  File replacement/cancellation clears stale feedback; pending uploads announce
  status and disable conflicting controls. The summary label and wide upload-button
  containment were corrected against Figma; fixture jackets use real catalog IDs.
- Remaining P13 work includes live private Blob/auth-expiry and abandoned-upload
  cleanup checks. P13 is not declared complete.

### P14 resumed implementation — scoped verification passed, decisions pending

- Read Figma Dark list/detail contexts `2914:2132` / `2914:2782` and handoff 81.
  Public catalog/detail data now lives in `features/bingos/`, with original titles,
  12-item batches, staged filters, recent manual activity, coordinate selection,
  per-cell optimistic saves, rollback/retry, and localized term explanations.
- Imported the existing official seed only into the explicit local test database:
  44 boards created, zero existing boards changed; 1,100 missions and 162 verified
  music relationships. The prior E2E board is preserved. No remote DB was changed.
- Domain checks passed: 34 tests across catalog, Bingo math and existing actions.
  Browser checks passed: 36 cases (12 Chromium, 12 Firefox, 12 WebKit), KO/JA/EN,
  320/390/520/768/1470px. They cover batches, filters, history, guest omissions,
  board-to-mission focus, selection without completion, rollback, pending controls,
  term help, and axe. Actual-source production build passed after fixture removal.
  Log: `/tmp/noslog-p14-harness.log`.
- Failures found and corrected: compact two-column transition counted the shell's
  padding incorrectly; focus/click could immediately close help; WebKit focus
  restoration could reopen help after Escape; Foundation jackets lacked an image
  role. The legacy jacket appearance and preserved routes were not changed.
- Actual in-app browser checked the seeded detail and confirmed board selection
  moves to the matching mission without changing any completion checkbox.
- **Pending:** the official Japanese mission source/reviewed translations have not
  been supplied. Known Korean seed text remains explicitly `lang=ko`; translations
  were not fabricated. Reset implementation and removal of legacy date restrictions
  were rejected by automatic approval review. Those patches were not applied;
  the precise user-approval questions remain unanswered. Existing date/auth guards
  remain in place. Reset is not passed. The later authenticated A1 completion/undo
  lifecycle is recorded in the current integration checkpoint above.

### P15 resumed implementation — page checks passed, release review open

- Inspected Dark `2927:458`, wide `2927:1316`, empty history `2927:1037`, and the
  Japanese/English design contexts. Structured local content reproduces the twelve
  sections, four at-a-glance groups and four unresolved legal-review warnings.
  `features/privacy/` separates local copy, schema, server-rendered content and the
  client contents navigation. The public route remains thin and locale-prefixed.
- Compact disclosure preserves the full policy and moves focus to stable section
  anchors. Wide navigation uses the user-approved 1000px outer shell, leaving 644px
  prose plus 292px contents and 16px gap. The superseded 1280px outer specimen does
  not override that shell. History shows the designed empty state; representative
  Figma archive dates were not invented as actual historical versions.
- Actual in-app browser confirmed the localized body, contact and signed-in controls,
  Pretendard JP Variable, 16px body and 20px section titles. Eighteen actual-page
  browser checks passed (6 per browser), across KO/JA/EN, narrow/intermediate/wide
  reflow, contents focus, history, text-spacing overrides, print flow and axe.
  Logs: `/tmp/noslog-p15-browser.log`, `/tmp/noslog-p15-cross-browser.log`.
- Final signed-in Profile/Account links were verified in the in-app browser, and
  the 18 cases passed again within the combined production harness. Print PDFs are test
  artifacts, not a released privacy policy. Legal review, deployment-provider facts,
  translation review and actual version archives remain open under handoff 82.

### P16 resumed implementation — scoped image and sharing checks passed

- Inspected `2986:5` and handoff 83 including the decoration/exam-plate amendments.
  The card uses a fixed 1200×630 generated-image component and server service,
  official Grd hero, separate GRADE scale, inline achievements, exam plates,
  initial avatar fallback and original KR/JP flags with Lucide Globe fallback.
- The route retains owner authorization and no-store PNG output. Hidden play count
  and play activity are handled before rendering. No public sharing permission was
  broadened, and no card customization was added.
- The original single WOFF2 website font remains intact. Satori cannot read WOFF2;
  the user's official ZIP supplied two complete, unmodified server-only Regular/
  Bold TTF files. They are not Unicode subsets or additional web font requests.
- Five generated PNG states cover Basic, Recital, long names, global-region fallback,
  empty and private/partial values; all were visually reviewed. Figma empty/partial
  contexts `2986:59`/`2986:113` were also inspected. The actual signed-in Basic
  download and Japanese Recital PNG rendered at 1200×630 with Pretendard JP.
- Thirteen card tests passed. The shared owner-dialog suite passed 27 cases across
  Chromium/Firefox/WebKit, including image failure/retry, unsupported or rejected
  clipboard operations, cancelled native sharing, focus and wide button widths.
  Handoff 83's existing contrast decision remains open; these scoped checks do not
  establish release approval or erase that limitation.

## Previous user-requested pause — 2026-09-07

At this checkpoint implementation was paused at the user's request. P12–P16 had not started.
Resume from the unfinished P10 integration and P11 verification described here;
do not restart completed P1–P5 audit work or claim that P10/P11 are complete.

P11 Archive/Detail routes, a 768px reading column, month headings, 20-item
pagination, restricted Markdown, localized dates, metadata and sitemap entries
have been implemented. Home routine notices now share the public localized query
and title-only row. The additive `20260907220000_localized_announcements` migration
was applied only to the local test database. All three translations are required
for public eligibility; legacy administrator records and administrator UI remain
unchanged. Translation authoring/publication tooling is not implemented. The
service-critical Home selection exists in the service, but its UI is not connected.

- Figma contexts inspected: `2756:784`, `2756:805`, `2756:1115` (Dark).
- Public eligibility and Markdown boundary unit tests: 14 passed.
- Initial typecheck and scoped P11 lint passed before the last fixture/Home edits.
- Production browser fixture: 6 Chromium cases passed; all 6 Firefox cases logged
  passes before the user-requested interruption. WebKit was interrupted, not passed.
  Coverage includes KO/JA/EN, 320–1470px, 20/21 pagination threshold, empty state,
  month headings, semantic Markdown, external links, 80-character titles, long body,
  axe and the real Archive return/missing-slug routes. Presentation data is synthetic.
  Screenshot artifacts have not yet received the final Figma comparison.
- Full unit run: 826 passed, 13 skipped, 1 failed. The failure is the 5-second
  timeout in `tests/code-style-config.test.ts`; its cause has not been established
  or rerun. Do not report the full suite as passing.
- `npm audit` reports one moderate issue in the pre-existing PixiJS transitive
  `@xmldom/xmldom@0.8.13`. React Markdown has no reported audit finding. The protected
  viewer dependency was not modified to repair that finding.
- The user-requested stop terminated only the active Playwright child process;
  the harness removed its temporary route and restored the root source. The final
  actual-source production build passed. The harness then exited nonzero to report
  the interrupted Playwright command; this is not an overall browser-suite pass.
  Logs: `/tmp/noslog-p11-harness.log`, `/tmp/noslog-p7-restored-build.log`.

P10 Account/deletion work is blocked on the unanswered recent-Discord-reauthentication
validity-window decision. Automatic approval review rejected an attempted Account UI
patch because it introduced a generic irreversible-deletion callback without the
required server authorization guard and settled validity window. That patch was not
applied; no Account component or new deletion execution path exists. Do not retry
it indirectly. After the user's decision, implement and verify the server guard
before connecting a deletion UI. No real account deletion has been performed.

## P10 staged settings work — in progress, 2026-09-07

P10 is not complete and its new categories are not yet wired into the production
settings page. Profile and Privacy now have separate validated server actions and
staged forms. Profile changes preserve display spelling, independent region and
inactive arcade selections; Privacy accepts all five positive choices explicitly.
Photo removal records an explicit user preference so later Discord login does not
restore a removed image. The additive `20260907210000_profile_avatar_preference`
migration was applied only to the local test database. Failed saves retain existing
and staged images; they do not delete an upload that a concurrent save might have
already published.

Discord refresh and account-change intents are bound to the initiating NosLog
session. Refresh rejects a different Discord identity and updates only Discord
display fields. A Connections component exposes the two intents, but the new
categories are still not connected to the actual settings route.

- Settings and OAuth unit verification: 26 cases passed. Typecheck and scoped lint
  passed before the latest browser-only test and help-spacing correction.
- The latest completed production presentation fixture passed 36 browser cases across
  Chromium, Firefox and WebKit, KO/JA/EN. Coverage includes 320–1470px reflow,
  field preservation after failure, country confirmation, arcade combobox keyboard
  behavior, dialog focus restoration, dirty navigation warning and axe checks.
  It also covers local avatar cropping, invalid files, zoom/keyboard controls,
  category navigation and Connections confirmation. Its temporary route was removed
  and the actual-source build passed.
- These are synthetic presentation cases without fabricated sessions or database
  writes. Screenshots are under `test-results/settings-chromium` and
  `test-results/settings-cross`. The fixture includes category rail/back navigation;
  it does not establish actual authenticated persistence or OAuth success.
- A prior crop attempt failed at a test locator matching both a field error and
  Next.js route announcer. The corrected scoped locator passed in the 36-case run.
  Later unverified changes place offline account-change errors inside the open
  confirmation dialog and restore the Figma 4px wide rail gap/Hug button widths.
- Figma MCP references inspected include `2734:1469`, `2734:1546`, `2734:88314`,
  `2734:87288` and `2734:1565`. Screenshot comparison corrected activity-help
  indentation to the section edge with an 8px preceding gap.

Remaining: full category integration, Account UI, deletion flow and
its user decision on the recent-authentication window, actual account save and
OAuth evidence, and full-page comparison. P11 is in progress as recorded above;
P12–P16 remain unimplemented. The developer-controlled forced-Dark flag continues to override
saved and OS Light preferences without deleting existing Light code/preferences.

## P9 authentication implementation and verification — 2026-09-07

Login and onboarding now use a dedicated 358px authentication column, shared
Foundation controls, the single-file Pretendard JP font and the forced-Dark policy.
The login column is centered in its available main region; onboarding retains its
48/24px vertical padding. Language changes refresh the document locale and preserve
the validated return destination. OAuth cancellation and expired/failed states retain
a safe retry path. First account setup preserves display case and width form, keeps
region independent of UI language and prevents completed-account replay. A missing
database account clears the stale session instead of looping between login and setup.

Figma MCP sources include `2689:746`, `2689:922`, `2690:992` and `2690:1206`.
The latter JA/EN onboarding frames contain residual Korean component labels; the
approved translated brief supplies those labels. Figma's older font families remain
superseded by the user's explicit Pretendard requirement. Actual browser screenshots
were compared with the compact references; review corrected login centering and the
40px onboarding action. Header/footer from the ordinary shell are absent by design.

- The production fixture passed 27 cases: nine Chromium and eighteen Firefox/WebKit
  cases across KO/JA/EN. They cover 320–1470px reflow, centered/bounded geometry,
  keyboard language selection and focus restoration, axe, six login error states,
  safe return paths, long account names, retained form input, pending state,
  duplicate-name validation and save failure. Its temporary routes were removed and
  the actual application rebuilt successfully. The fixture uses synthetic identity
  data and a synthetic failing action; it does not create or bypass a login session.
- An observed WebKit prefetch cancellation error was addressed by disabling
  unnecessary authentication-page link prefetch. The rerun passed without filtering
  page errors. A prior missing CSS class separator and an outdated development CSS
  cache were investigated; production assertions now check actual containment.
- Local PostgreSQL migration `20260907200000_profile_nickname_normalized_unique`
  adds an expression uniqueness index on NFKC/lower/trim comparison while preserving
  display values. One guarded local database test passed actual case, full-width
  Latin and half-width Kana collisions, removing only its own fixture rows.
  Existing local collision count was zero; no remote database was changed or audited
  for deployment collisions.
- Final P9 lint/typecheck passed; the final unit run passed 799 cases with 13
  integration cases skipped. Skipped cases without their explicit database variable
  are not counted as passes.

Remaining P9 evidence: actual Discord authorization and new-account setup completion
require a user-signed-in incomplete test account. That request is pending. Native
Safari is not represented by WebKit. The in-app browser currently reports local
connection refused even while the local production Playwright suite succeeds; its
manual interaction pass is not claimed. Generated browser screenshots are retained
under `test-results/auth-chromium` and `test-results/auth-cross` for review.

P10 source inspection has begun; P10–P16 implementation is incomplete. No release or
full-suite completion is claimed.

## P8 data sync implementation and verification — 2026-09-07

The thin bookmarklet route now composes the shared ordinary layout and sync feature.
First-use setup is expanded; returning setup and latest-five history are disclosures.
Attempt metrics, persistent coverage, and at-most-three change previews are separate.
The status endpoint authenticates the current account, returns private/no-store data,
and never returns raw ingestion diagnostics. Client query keys include the account ID.
Processing and delayed states poll without rerunning ingestion; terminal states stop
the active watch. The existing 10/15-minute boundaries and 30-second cooldown drive
the presentation. Large first full imports use a summary instead of preview overflow.

Figma MCP compact/full, first-use, guest, wide and expanded-history sources were read.
Actual signed-in browser review corrected history to compact two-line rows, removed
the repeated setup title, and checked common margins, 32px section gaps and 12px rows.
Preview captions use the Figma KO/JA/EN text. Existing guide GIFs have complete adjacent
text, bounded enlargement, reserved space and a controlled reduced-motion alternative.
Invalidation starts focus at Cancel, preserves the existing version-increment action,
and reveals reinstall guidance after success. No real user's bookmarklet was invalidated.
The official Play Data URL and Japanese Basic Course term were checked against
[KONAMI Play Data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html).

- Sync service/API unit tests passed twelve classification, coverage, ownership,
  preview, cooldown and safe-diagnostic cases. Auth return-path and existing Discord
  tests passed together (28 tests). Existing token invalidation service tests remain
  part of the passing full suite.
- The isolated production fixture passed nine KO/JA/EN state/interaction cases:
  ten states at 320/390/768/1470px, axe, latest-five disclosure, processing completion,
  stopped polling, retained focus, reduced motion, clipboard rejection and Cancel.
  Fixtures use synthetic status data and a nonfunctional bookmarklet; they do not
  create authenticated sessions or claim actual official ingestion success.
- Firefox and WebKit passed twelve guest cases, including six responsive widths,
  shared margins, axe, personal-data absence, API 401 and Login return destination
  (`/tmp/noslog-p8-cross-browser.log`). Native Safari remains unverified.
- The final shared-component regression passed 24 production browser cases covering
  P6 owner/share, P7 route/root recovery and P8 states. The harness restores the exact
  source and rebuilds without its temporary route. Logs use the existing P7 harness
  filenames and supersede earlier harness-run logs.
- Full Vitest passed 779 tests; twelve tests requiring an explicit integration DB
  were skipped, not passed. Lint and typecheck passed. Earlier production fixture
  and restored-source builds passed, including the final restored build.

Known limits: the current ingestion pipeline does not persist pre-attempt official
login/token rejection categories, so the UI does not invent those classifications.
General stored failures remain general recovery. Real external ingestion, every mobile
browser's bookmark editing and actual invalidation success in a signed-in browser are
not claimed by the synthetic state matrix. The new ordinary nested error boundary
rethrows preserved viewer/admin failures to the original parent boundary so it does
not introduce a different retained shell for those failures.

P8 is a scoped checkpoint; subsequent page status is recorded above.

## P7 recovery implementation and verification — 2026-09-07

Ordinary 404 and recoverable errors use the shared shell and a left-aligned reading
measure. Fatal errors and maintenance use a minimal Dark identity shell. Figma MCP
references `2585:81211`, `2585:81219`, `2585:81237`, and `2585:81245` were read and
compared with browser evidence. The latest 1000px shell and Pretendard JP decisions
supersede older Figma shell/font values. Minimal recovery now consumes the common
layout maximum and margin variables rather than duplicating their values.

The recoverable boundary refreshes server data before reset. Fatal recovery reloads
the document and preserves URL/query context. Meaningful fatal copy waits for the
actual route locale, avoiding an English heading flashing on Korean/Japanese routes.
404 metadata uses server-localized titles and noindex. Maintenance returns 503 and
no-store, preserves the requested destination, and emits Retry-After only from valid
operator timing. Unknown/expired timing is omitted; there is no fabricated countdown.
Preserved routes retain legacy recovery presentation. Native Safari remains unverified.

- The isolated production harness passed 15 checks: nine P6 owner/share state cases
  and six actual P7 route/root error recovery cases in KO/JA/EN. It restored the exact
  root source, removed its temporary route, and rebuilt the actual application
  successfully (`/tmp/noslog-p7-fixture-browser.log`, `/tmp/noslog-p7-restored-build.log`).
- Firefox passed all twelve P7 mobile/desktop checks. WebKit initially failed six
  skip-link assertions because macOS Tab skips links by default; Option+Tab exercises
  the native link-inclusive path. All twelve WebKit checks then passed
  (`/tmp/noslog-p7-cross-browser.log`, `/tmp/noslog-p7-webkit-recheck.log`). This is not
  a claim that ordinary Tab includes links under every macOS keyboard preference.
- Three isolated production maintenance checks passed real 503/no-store/Retry-After,
  localized actual timing, manual reload, retained destination/query, API envelope,
  320/390/768/1470px containment and axe checks
  (`/tmp/noslog-p7-maintenance-production.log`). Unknown/expired timing also has unit
  coverage; the ordinary maintenance browser matrix checks absent timing.
- Lint and typecheck passed. The concurrent unit run exceeded a 5-second ESLint-test
  timeout once; rerunning the full suite with four workers passed all 773 tests in
  106 files (`/tmp/noslog-p7-final-unit-recheck.log`). No timeout threshold was raised.
- The UI detector returned no findings and `git diff --check` passed.

P8 evidence is recorded above; this earlier P7 checkpoint remains historical.

## P6 implementation and verification — 2026-09-07

P6 was implemented and verified before proceeding through P7. Earlier paused checkpoints
below are historical; the user subsequently authorized uninterrupted P6–P16 work.
No page-completion or release claim is made by this checkpoint.

- New public profile modules cover identity, four competitive metrics, mode-scoped
  Best Plays and progress, public judgement aggregates, rank distribution, and
  independent Recent Plays. Incremental endpoints return five items per request
  and recheck activity visibility. Grd membership is top 50 without the Rating
  score floor; Rating uses the approved top-70 calculation and published basis.
- Two migrations add independent arcade/activity visibility and measured Rating
  observations. They were applied only to local E2E PostgreSQL on port 55432.
  Full imports record actual Rating; past totals are not reconstructed from
  incomplete changed-only snapshots. Grd history no longer deletes everything
  beyond thirty observations. Existing history cannot recover previously deleted
  data; insufficient-history and unavailable outcomes remain explicit.
- The C8 share dialog now reuses the Foundation modal, buttons, and status messages.
  Preparing, copy success, image failure, and card failure have separate outcomes.
  Native sharing checks the exact file/title/text/URL payload; unsupported sharing
  uses the explicit X link fallback. The PNG artwork remains the existing card
  until P16 is implemented.
- Figma P6 identity, summary, body, 320px rows, progress, share, loading, error and
  not-found references were read through MCP. Actual compact profile and share
  screenshots were compared. The explicit Pretendard JP and 1000px shell decisions
  remain higher priority than Figma's older font and viewport assumptions.
- The first P6 Firefox/WebKit run passed 19 of 20 checks. The failed WebKit case
  exposed English SSR hydration mismatch: server `Aug 11, 21:04` versus browser
  `Aug 11 at 21:04`. A shared time formatter now uses explicit Korean game timezone
  and stable localized composition. The rerun passed all 20 checks, including a
  browser-error assertion (`/tmp/noslog-p6-cross-browser-recheck.log`).
- Chromium passed the initial five P6 flow/reflow/accessibility checks. Actual
  signed-in browser review confirmed card PNG preparation, clipboard copy success,
  and Escape returning focus to the share trigger. Native Safari and OS share-sheet
  delivery are not claimed by automated WebKit or in-app browser evidence.
- The final P6 unit run passed 770 tests in 106 files; lint, typecheck, token generation
  consistency and the production build passed (`/tmp/noslog-p6-final-{unit,lint,types,build}.log`).
- Actual local-database browser checks passed eight privacy/history/empty/missing-user
  cases (`/tmp/noslog-p6-privacy-final.log`). A ninth isolated corrupt-avatar fixture
  exercised the actual initial render-error boundary, repeated retry, hidden diagnostics,
  retained shell and Home navigation (`/tmp/noslog-p6-boundary.log`). Disposable rows were
  removed in finally blocks. Chromium P6 plus real ranking preservation passed eight
  checks; shared-chart P1/P4 regression passed four checks.
- The owner recovery action now follows the identity chips and uses the Figma 40px
  neutral button; it appears only for partial/failed sync, not for no-sync history.
- Automatic approval review rejected broad deletion of eleven legacy profile components
  because scope and downstream use were uncertain. That deletion was not applied or
  retried; the files are retained. The separately approved share-dialog migration remains.

The owner privacy/sync matrix and share preparation/card failure/retry/unsupported-copy,
clipboard rejection/recovery, and native-share cancellation now pass in KO/JA/EN.
These nine cases render the production components using an isolated synthetic owner
fixture, without forging sessions or weakening authorization. PNG responses and browser
capabilities are controlled test fixtures, not actual OS share-sheet delivery. They exposed
a missing separator between the preview and skeleton classes; the fix uses the shared
`cn` utility and passes formatting plus browser verification. Real signed-in clipboard
success is separately recorded above. Native Safari and actual OS share delivery remain
unverified. P16 still owns the new PNG artwork/public card work.

## P1–P5 batch audit and approved first-vote correction — 2026-09-07

Latest scope update: the user authorized uninterrupted implementation through
P6–P16, with verification after each page, while retaining user-owned Git operations.
New implementation and validation are Dark-only. Existing Light styles remain;
the temporary developer flag `NEXT_PUBLIC_ENABLE_THEME_SWITCHING` defaults to
`false`, forces Dark at document startup, and disables theme controls. Stored
Light preferences are retained. Light implementation resumes only after a later
user decision; older Light verification below is historical evidence.

Public-settings prerequisite: `/settings` now has the approved guest overview and
Experience category. Explicit language selection persists through a Server Action;
visiting a localized URL no longer overwrites the stored preference. A full locale
navigation updates the root document language and provider together. The previous
two menu-language failures passed in the updated localized/settings selection:
20 passed, 4 duplicate matrix skips (`/tmp/noslog-settings-recheck.log`). This does
not mark the remaining authenticated P10 categories implemented.
Firefox/WebKit navigation, reflow and accessibility checks passed: 24 passed,
12 duplicate matrix skips (`/tmp/noslog-before-p6-cross-browser-recheck.log`).
The first run measured WebKit immediately after resizing; three transient reflow
assertions failed. The test now polls for the requested viewport and zero overflow
instead of reading the previous layout synchronously. No product CSS was changed
to hide those failures. Eight additional Dark-only checks passed in both engines,
including OS changes, storage events, reload, navigation and server HTML without
JavaScript (`/tmp/noslog-dark-only-final.log`). WebKit is not native Safari validation.

The user authorized auditing P1–P5 together before starting P6. This checkpoint
does not implement P6 or later page families. The latest 1000px ordinary shell,
shared horizontal padding, 640px Home content column, and complete Pretendard JP
font delivery remain in force.

Corrections:

- P3 and P4 now measure their actual page container before selecting a filter
  rail. The previous JavaScript used viewport media queries, while CSS and the
  approved shell constrained the content. At a 1470px viewport, the actual shell
  is 1000px and the inner page is 952px; both pages therefore retain staged
  filters. P4's description, guide, and Detailed control remain available.
- P3 applies filters into the visible result summary, while cancel paths restore
  the trigger. Successful result retry also focuses that summary. The shared
  dialog accepts an optional close-focus callback; other callers retain their
  existing behavior.
- P1 retries an idempotent detail GET once for network/5xx failure, never 4xx,
  as required by MDET-59. An exact cached target remains readable with a visible
  error and Retry after unsuccessful refresh (MDET-57). The ranking retry
  fixture now exhausts both attempts before expecting manual Retry.
- Home explicitly renders the absolute document title `NosLog`; the previous
  metadata merge removed its title. Populated-announcement review also corrected
  the archive label to the final KO/JA/EN Figma strings, removed an extra chevron,
  and restored the designed localized date formats.
- Legacy browser assertions now target current localized headings, expandable
  navigation, view controls, and staged filters. Representative whole-page axe
  checks now require zero violations instead of allowing old accessibility debt.

Verified coverage includes P1 information/record/ranking/community, exact-target
cache and error behavior, positive peer comparisons with thresholded missing
values, public/guest/qualified community states, vote and opinion controls,
P2 destinations/search/official-news states, P3 list/grid/append/filter/return
behavior, all six P4 scopes and band states, and P5 metric/region/page/history,
pending/error/retry, personal position, and population boundaries. Tests exercise
KO/JA/EN, both themes, narrow/intermediate/desktop layouts, keyboard/focus,
containment, and automated accessibility. The current shell matrix also checks
other existing ordinary routes and viewer-shell preservation.

New explicit cases cover Home IME suppression and error-to-empty retry; official
X ready/empty/error with a retained official link; P3 40-result restoration and
scroll after returning from a destination; completed IME input and obsolete
response isolation; P1 cached refresh failure, uncached 4xx, and populated peer
comparison. External X states and unavailable aggregate data use isolated browser
response fixtures, not writes to external services or production records.

Figma MCP screenshots were reopened for P1 `613:496`, P2 `1134:984`, P3
`1215:1280`, P4 `1352:493`, and P5 `1806:6`. Live compact screenshots and desktop
DOM measurements were compared with those references. Representative jackets,
counts, user identities, and aggregate values are fixture/content differences;
the user's explicit font and shell-width decisions supersede those Figma values.
This is a scoped comparison, not a claim of pixel identity for every Figma state.

Verification evidence:

- ESLint and TypeScript passed after the final production-code correction.
- All 745 unit/local-database tests in 99 files passed.
- Production build passed against the isolated local database (exit 0),
  `/tmp/noslog-p1-p5-build.log`. Changed-file formatting and `git diff --check`
  also passed.
- Complete current `noslog-v2-*.spec.ts` selection: **166 passed, 44 conditional
  project/matrix skips**. Log/artifacts: `/tmp/noslog-p1-p5-scoped-final.log` and
  `/tmp/noslog-p1-p5-scoped-final`.
- Additional P3 verification after the focus correction: **16 passed, 4 duplicate
  matrix skips**, `/tmp/noslog-p1-p5-discovery-focus.log`.
- Additional Home verification after the archive-label/date correction:
  **22 passed, 6 duplicate matrix skips**, `/tmp/noslog-p1-p5-home-final.log`.
- Repository-wide diagnostic run: **205 passed, 3 failed, 46 conditional skips**,
  `/tmp/noslog-p1-p5-final.log`. One failure was the obsolete single-failure P1
  retry fixture; its corrected mobile/desktop checks passed independently and
  in the current V2 selection. The two guest-language-switch failures remain
  unresolved and were neither removed nor skipped.
- A separate production-server audit reproduced P5 server-initial loading and
  database failure, then verified actual no-JavaScript page-2 traversal in all
  three locales. It also rendered three real temporary announcements at
  320/390/1470px in each locale, measuring the shared search/news/notice edges.
  The server used a copied build with an independent cache. Its initial
  localhost/127.0.0.1 origin mismatch caused redirect loops; aligning the server
  bind hostname and browser origin resolved that harness issue. The script
  removed its 26 local users, three announcements, server and copied cache.
  Cleanup counts were zero. Evidence: `/tmp/noslog-p1-p5-server-audit.log` and
  `/tmp/noslog-p1-p5-server-evidence`.

### Pending decisions and validation limits

1. **P1 first vote — Approved and implemented.** After reviewing the Z1 specimen,
   the user explicitly approved expandable Aggregating rows. The
   [approved comparison](https://www.figma.com/design/cVbWCxhkfxFfHmAKLCyKrD?node-id=3326-24041)
   was moved to Z1 approved section `268:3`; pending section `1998:14169` is empty.
   C7 `481:974` now includes a chevron and its obsolete non-selectable description
   has been superseded. Product code opens all six scopes, including deep-linked
   aggregating scopes, and places guidance and qualification-dependent controls
   below the selected row. Eligible first votes start with no selected value;
   zero to two votes still publish neither mean nor distribution.
   Final mobile/desktop community checks: **26 passed, 6 duplicate locale/theme
   matrix skips**, `/tmp/noslog-approved-first-vote-final.log`. They cover
   zero/one/two votes, keyboard toggling, first-vote validation, rejected-input
   retention, qualification branches, edit/delete cancellation, and KO/JA/EN
   Light/Dark aggregation forms at 320/390/768/1024/1280px with axe checks.
   Real signed-in local UI verification saved a first Recital S vote as 13.2,
   edited it to 13.3, then deleted only that test-created vote. The count returned
   to zero, the input reset to empty, focus returned to the contribution region,
   and no distribution appeared. The compact browser rendering was compared with
   the approved Figma specimen; product Pretendard remains the explicit exception.
   After this correction, ESLint, TypeScript, all 745 unit/local-database tests,
   and the production build passed again (exit 0). Logs:
   `/tmp/noslog-first-vote-{lint,types,unit,build}.log`. Formatting and
   `git diff --check` also passed. This scoped success does not resolve the
   remaining repository-wide language-flow failures below.
2. **P2 announcements — incomplete dependency.** The local Home normally has no
   published announcements; populated rendering was verified using temporary
   records as described above. Public announcement destinations and the locale,
   severity, expiry, and publication-readiness model required by handoff 68
   section 5.3 are still absent. Critical-notice and destination-page states
   cannot be marked verified. This audit does not invent that model or
   change administrator publishing. P11 and its data contract need their own
   implementation unit.
3. **Guest language switching — unresolved repository regression.** The legacy
   test expects language links in the menu; the current shell provides a settings
   destination, while guest settings redirect to Login. Direct localized P1–P5
   routes pass, but this cross-page language flow does not. It remains outside
   the completed P1–P5 checks and must be resolved with the settings work.
4. **Remaining evidence limits.** Third-party feed fixtures do not prove the
   availability of X's live service. Chromium
   checks do not establish Safari or Firefox coverage.

The previous statement that P4's wide Figma frame omitted the calculation guide
was incorrect: `1348:372` contains guide instance `1426:2962`. It omits the
Detailed toggle, but the approved 1000px shell never enters that wide rail
composition. No new wide-layout product decision is finalized by this audit.

No viewer/editor or admin implementation, font asset, dependency, database schema,
commit, or push was changed. This audit is not a full-release or all-states pass;
the unresolved items above prevent an unconditional all-checks-passed commit title.

## Compact common layout and P2 update alignment — 2026-09-07

The user selected the osu! approach after rejecting the earlier 90% layout and
1200px proposal. Ordinary header/main/footer content now shares a centered
1000px maximum outer shell. `AppShell` owns body horizontal padding once through
`.nl-main__content`; `PageContainer` owns vertical rhythm. Legacy ordinary page
roots no longer add another 16px inset. Padding is 16px below 672px and 24px
thereafter. At a 1470px browser viewport, measured shell bounds are x=235,
width=1000, with body content x=259, width=952. Large monitors do not expand this
shell. Backgrounds and dividing lines continue across the viewport.

The user's subsequent request also places Home official news and NosLog
announcements on the same fluid, centered 640px column as search/navigation.
The three regions share one CSS rule. Existing Home update side-by-side rules
were removed. Foundation 24, provenance 25, and briefs 03/15 record these
explicit supersessions; the twelve production comparisons and their access
limitations are in provenance 25.

The expanded common-layout browser matrix covers all twelve rendered public
ordinary routes, three locales, and sixteen widths from 320 to 2560px, including
1000px and MacBook widths 1440/1470/1512. It now checks each page root's actual
content edge and padding, rather than conditionally checking only pages with
`PageContainer`. It also checks horizontal overflow on every route, Home update
alignment, menu anchoring/focus/inert behavior, and the viewer's original shell.
The authenticated settings page was separately inspected in the browser at
1280px and 320px, without saving changes. Its content edges align and it has no
horizontal overflow. Narrow English profile dates and the grade/unit needed
wrapping corrections discovered by this stronger audit.

Figma MCP screenshots were reopened for C8 header `247:14` and P2 intermediate
`1164:5819` in `cVbWCxhkfxFfHmAKLCyKrD`. Earlier P2 context covers the compact and
wide variants as recorded below. The approved width changes take precedence
over wider Figma specimens; remaining Home icon/label geometry, tile sizes,
spacing, surfaces, and type tokens still pass the existing multilingual,
two-theme P2 matrix. Desktop and 320px screenshots were visually inspected.
Discovery/Tiers column assertions now reflect the actual available result area
inside the smaller shell; their components and filter behavior were not changed.

Verification: ESLint, TypeScript, production build, all 745 unit tests in 99 files, changed-code
formatting, whitespace checks, and the layout detector passed. The complete
current `noslog-v2-*.spec.ts` browser selection passed with 149 passed and 45
conditional project/matrix skips. Initial failures were nine stale column-count
expectations; they were corrected for the approved narrower shell and the full
selection rerun. No failing assertions were skipped. Browser artifacts/log:
`/tmp/noslog-layout-1000-final` and `/tmp/noslog-layout-1000-final.log`.
Production build log: `/tmp/noslog-layout-1000-build.log` (exit 0).

Limitations: the local Home has no published announcement entries. Their shared
container and styling are updated, but a populated announcement screenshot is
not claimed. This checkpoint does not complete later P-pages or resolve the
older repository-wide E2E limitations recorded below. Viewer/editor and admin
implementation, font assets, dependencies, and database schema are unchanged.

## P2 HOME-23 and fluid desktop layout — 2026-09-06 (width rule superseded)

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
