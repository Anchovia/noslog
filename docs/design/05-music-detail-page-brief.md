# NosLog 2.0 Music Detail Page Brief

## Document Control

- Status: `In progress`
- Decision status: `Structure, entry priority, source-aware restoration, signed-out
Record behavior, Chart Info scope, personal-record hierarchy, Ranking hierarchy,
leaderboard semantics, tie handling, score distribution, pagination, and Ranking
states approved; Tier/evaluation labels, hierarchy, placement scope, community
aggregation, pattern radar, evaluation input, and community-opinion contract approved;
shared switching, loading, cache-freshness, empty, permission, error, retry, and
announcement contract approved; remaining responsive and page-level acceptance
decisions remain open`
- Evidence status: `Repository inspection, current-product audit, approved information
architecture, approved shared-discovery handoff, and cited tabs, adaptive-layout,
progressive-disclosure, leaderboard, pagination, data-visualization, NOSTALGIA
scoring, chart-pattern, chord-input, community-evaluation, radar-profile,
rhythm-game, accessibility, and infrastructure guidance`
- Date started: 2026-07-31
- Last decision update: 2026-08-01
- Canonical language: English
- Korean companion:
  [05-music-detail-page-brief.ko.md](./05-music-detail-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Upstream discovery brief:
  [04-shared-discovery-page-brief.md](./04-shared-discovery-page-brief.md)
- Scope: Public Music detail for one Music entry and one selected NOSTALGIA
  difficulty, including personal record, chart information, ranking, tier/evaluation,
  and entry to a published chart viewer
- Excluded: Final visual styling, foundation tokens, complete high-fidelity page
  design, focused chart-viewer composition, and administrator Music or chart editing

## Decision Labels

- **Observed:** Verified from the current repository, browser, or approved upstream
  artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting explicit user approval.
- **Open:** Requires further research, representative data, testing, or a user
  decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is not yet a complete approved phase deliverable. Only the decisions marked
`Approved` or `Rejected` are authoritative.

## Purpose

Music detail must let a user keep one Music entry and one selected difficulty in
context while moving efficiently among:

1. their own performance and history;
2. factual chart information and statistics;
3. the selected chart's ranking;
4. tier placement, community evaluation, and voting; and
5. the focused published-chart viewer when one is available.

The page is a frequently revisited product workspace, not a linear editorial article
and not a cross-product dashboard.

## Primary Context

- **Approved upstream:** The surface is public, with personal enhancements after
  authentication.
- **Approved upstream:** Mobile around arcade play is the primary context. Desktop
  remains required and must use additional width intentionally.
- **Approved upstream:** Music discovery opens Music detail. Tier, Bingo, Exam,
  profile, and ranking contexts may also deep-link to the relevant Music and
  difficulty.
- **Approved upstream:** The focused chart viewer is a child destination of Music
  detail and must provide a reliable return path.
- **Approved:** The Music entry is the stable entity context. The selected difficulty
  is the active chart context.
- **Approved:** Current visual styling, fixed-width composition, typography, spacing,
  tab appearance, and card treatment are migration evidence only. They are not the
  NosLog 2.0 visual baseline.

## Current-Product Evidence

### Observed Route and State

- The current route is
  `/[locale]/music/[index]/[difficulty]`.
- `Normal`, `Hard`, `Expert`, and optional `Real` are chart-level selections under one
  Music entry.
- The selected content area is represented by a `tab` query value. Ranking pagination
  uses a `page` query value.
- Difficulty, selected content area, and ranking page participate in browser history
  and can be restored with Back and Forward.
- Without a `tab` query, the current implementation opens Record for both signed-in
  and signed-out users. Selecting Information writes `?tab=detail`, and browser Back
  restores the prior queryless Record entry.
- The current signed-out Record implementation leaves placeholder analytics rendered
  behind a dimmed Login overlay. Its Login link does not carry the selected Music,
  difficulty, or Record destination.
- The Discord OAuth start and completion routes already validate, store, and restore a
  safe relative `returnTo` path. The current Login page always supplies localized Home,
  so exact task restoration is not connected through the whole flow.
- The current page renders inside a `390px` maximum-width shell even on desktop. This
  is an observed usability limitation, not an approved 2.0 rule.

### Observed Information Inventory

The current implementation provides:

- Music identity: jacket, original title, optional localized title or Japanese
  reading, artist, category, and stable Music index;
- selected-chart identity: difficulty, official level, and optional level constant;
- chart information: BPM range, note count, duration, release date, unlock condition,
  video or preview links, pattern statistics, score distribution, player count, and
  current user's percentile where available;
- personal record: score, rank, Full Combo state, play counts, judgement breakdown,
  FAST/SLOW, note-type success rates, score and performance trends, recent plays, and
  peer comparison;
- ranking: chart-specific rows, the current user's rank when available, and explicit
  pagination;
- tier and evaluation: current tier constant, history, community distribution,
  personal evaluation, comments, and reactions; and
- published-chart availability and a focused chart-viewer route.

This inventory preserves verified product capability. It does not approve the current
information density, order, labels, or presentation.

### Observed Data-Loading Boundary

- Shared Music and selected-chart data load for every content area.
- Personal best data load when the user is signed in.
- Detailed record history and trends load only for the current Record area.
- aggregate chart statistics load only for the current Information area.
- ranking rows load only for the current Ranking area.
- tier, evaluation, opinion, and reaction data load only for the current Tier area.
- The browser caches visited combinations of Music, difficulty, content area, and
  ranking page for the current page session.

This demand-loaded boundary is existing implementation evidence. It is also a strong
operational fit for the approved tabbed architecture because users do not incur every
cross-domain query before choosing an area.

### Observed Ranking Implementation

- The current selected-chart Ranking loads one best-score row per user and exposes a
  profile link, avatar, score rank, score, and Full Combo or Pianist state.
- It uses seven rows per page and derives the visible row number from page offset. It
  does not currently assign a shared displayed rank to equal scores.
- The current server ordering uses score descending and user ID ascending. The
  separate current-user rank also uses user ID to force a unique ordinal position
  inside an equal-score group.
- A complete current-user card appears above the list even when the same user row is
  present on the current page, and it reports a calculated top percentage.
- The current score distribution counts every positive-score player in the overall
  player total but draws only `950k`, `960k`, `970k`, `980k`, `990k`, and `Pianist`
  buckets. Records below `950,000` therefore affect the denominator without appearing
  in a labeled bucket.
- The current score-rank image alternative text appends a hard-coded Korean `rank`
  label in every locale.

These are implementation observations, not approved 2.0 ranking rules. The approved
contract below resolves the duplicate current-user presentation, ranking semantics,
distribution denominator, page size, and localized accessibility gaps.

## Approved Entity and Action Model

### Music Identity and Selected Chart

- Keep Music-level identity stable while the difficulty changes.
- Treat the selected difficulty as chart-level context that governs level, constant,
  BPM, note count, personal record, ranking, tier/evaluation, and chart-viewer
  availability.
- Preserve the selected difficulty in a shareable and history-restorable URL.
- Do not duplicate the Music entry as four unrelated detail pages merely because it
  has four chart difficulties.
- Exact difficulty-control geometry, position, and visual treatment remain open for a
  later responsive specimen.

### Published Chart Viewer Entry

- Place **View chart** as a direct contextual action associated with the selected
  chart, outside the Information content panel.
- When a NosLog published chart exists, the action opens the focused chart viewer for
  the selected difficulty.
- When no NosLog chart exists but an approved external chart resource exists, expose
  that resource as a secondary external action rather than pretending it is the
  NosLog viewer.
- When neither exists, show concise availability text equivalent to **No published
  chart**. Do not reserve a permanently disabled primary button.
- Exact placement, iconography, copy in Korean/Japanese/English, and responsive
  treatment remain open.

## Approved Content Architecture

### Pattern A: One Persistent Context with Tabbed Content

- Keep one persistent Music identity and selected-difficulty context.
- Under that context, use a tabbed content architecture for four semantic areas:
  personal record, chart information, ranking, and tier/community evaluation.
- Display only the selected content panel. Do not render the complete contents of all
  four areas as one long reading page.
- Do not add a cross-domain Overview panel that repeats compact summaries of all four
  areas before the user can reach their detail.
- Preserve selected difficulty and selected content area in restorable navigation
  state.
- A content-area change should request the selected area's detailed data rather than
  requiring all cross-domain detail on initial entry.
- Reuse already loaded area data when it remains valid. Exact cache lifetime,
  prefetch-on-intent behavior, and invalidation remain implementation decisions.
- Localized labels for all four semantic areas are approved in their owning contracts.
  Tab geometry and responsive overflow behavior remain open. Approval covers the
  architecture and wording, not the current tab design.

### Why Pattern A Fits

The approved choice follows three converging findings:

1. Tabs are a standard pattern when one object has related but separable views and the
   user does not need to compare all panels simultaneously.
2. Rhythm-game detail surfaces commonly preserve song or map identity and selected
   difficulty while changing statistics, leaderboards, or discussion context.
3. The current NosLog data layer already isolates expensive record, ranking, and
   evaluation reads by active content area.

Pattern A is therefore both a familiar interaction model and a lower-work initial data
boundary for NosLog. Its approval does not preserve the current cramped visual
execution.

## Approved Entry Priority and Restoration Contract

### General Entry Default

- When a Music-detail URL does not explicitly name a content area, open the
  **Information** semantic area for both signed-in and signed-out users.
- Place the Information semantic area first in the content-area order. The approved
  semantic order is Information, personal Record, Ranking, and Tier/community
  evaluation.
- This approval establishes semantic order. The localized labels for all four areas
  are now approved in the Chart Info/Record and Tier & Evaluation contracts below.
- Do not make the same queryless URL resolve to a different default area solely because
  the user is authenticated.

Information is the general-entry default because it is public, stable, and useful to
every visitor. Personal Record remains a primary repeated task, but an entry source
that already knows the user's intent must open it directly rather than relying on a
hidden authentication-dependent default.

### Source-Aware Explicit Entry

Use explicit, restorable content-area state when the source already identifies the
user's task:

| Entry source or intent                                                  | Required destination behavior                                                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| General discovery, Music search, or shared URL without an explicit area | Open Information through the queryless canonical entry or an equivalent explicit Information state             |
| Profile, recent play, or personal-record item                           | Open the selected Music and difficulty with the personal Record area explicitly selected                       |
| Ranking item                                                            | Open the selected Music and difficulty with Ranking explicitly selected                                        |
| Tier, evaluation, or voting item                                        | Open the selected Music and difficulty with Tier/community evaluation explicitly selected                      |
| Return from the focused chart viewer                                    | Restore the exact originating Music-detail URL and content area when origin state exists                       |
| Direct viewer entry without origin state                                | Fall back to the selected chart's Information area rather than inventing a personal or previously used default |

- The destination URL must preserve locale, Music index, selected difficulty, selected
  content area, and any approved area-specific state that is valid on return.
- Back and Forward must restore the explicit area instead of recomputing it from the
  current authentication state.
- Do not globally remember the last-used Music-detail area across unrelated Music
  entries or sessions. Source-aware explicit intent takes priority over hidden
  preference state.

### Signed-Out Personal Record

- Keep the personal Record area visible and selectable for signed-out users. Do not
  hide it and do not present it as a disabled tab.
- Selecting Record while signed out must render a compact panel-level authentication
  state in place of record content. Do not render fabricated, empty, blurred, or
  dimmed record analytics behind an overlay.
- The authentication state contains one concise explanation and one explicit Login
  action. Selecting or focusing the Record tab alone must not start authentication.
- The Login action must carry the complete safe intended return destination, including
  locale, Music index, difficulty, and the explicitly selected Record area.
- After successful authentication, return to that exact Record area. If onboarding is
  required, preserve the same destination through onboarding and restore it when the
  required flow is complete.
- Authentication errors must preserve enough destination state to retry or return to
  the same Music detail without losing context. Exact error copy and presentation
  remain part of the later state contract.

The current OAuth flow already stores and validates a relative `returnTo` path and can
redirect to it after authentication. The current Login-page handoff always supplies
localized Home instead, so this is an implementation-mapping gap rather than a need
for a new authentication architecture.

### Accessibility and Predictability Consequences

- The selected area must be represented in URL and history state and exposed through
  correct `tablist`, `tab`, and `tabpanel` semantics in the later implementation.
- Area activation remains an explicit user action. A focused tab must not trigger
  authentication or another unexpected context change.
- The signed-out Record panel communicates its unavailable personal content and Login
  action within the selected panel, so the control remains discoverable without a
  misleading disabled state.
- The approved asynchronous-state contract below defines ordinary focus retention,
  live announcements, loading, failure, and retry behavior. Mobile overflow and final
  responsive control composition remain open.

## Approved Asynchronous State and Recovery Contract

### Stable Context and Atomic Target Selection

- Keep the shared application shell, persistent Music identity, selected-chart
  context, difficulty choices, content-area choices, and approved selected-chart
  resource actions available while one dynamic area is loading.
- When the user explicitly selects another difficulty or semantic content area,
  immediately update the selected target and its restorable URL/history state. Replace
  the preceding semantic panel with the target panel's loading state; never present
  Record, Ranking, Chart Info, or Tier/evaluation data from the preceding target as if
  it belonged to the newly selected target.
- Mark only the updating target panel busy. Do not disable every difficulty and area
  control merely because one request is pending.
- Keep navigation interruptible. A later valid selection supersedes an earlier pending
  selection, cancels the obsolete request where supported, and is the only result that
  may commit to the visible target.
- Deduplicate repeated requests for the same Music, difficulty, content area, and
  area-specific state.

### Loading Presentation by Transition Type

| Transition type                                      | Required presentation                                                                                                                                                                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial Music-detail entry                           | Preserve the application shell and expose a stable route-level Music-detail placeholder. When sufficient Music identity is already available, keep that context visible and load only its unresolved selected-chart region.               |
| Uncached difficulty or semantic-area selection       | Update the target and URL immediately, reserve the target panel's essential geometry, set the panel to `aria-busy="true"`, and expose a concise pending state on the selected control. Do not leave the preceding semantic panel visible. |
| Fast target response                                 | Commit the target content without introducing a visually distracting animated loader.                                                                                                                                                     |
| Perceptible request of at least approximately 300 ms | Reveal a simplified, structure-matched skeleton for the dynamic target panel. Do not skeletonize fixed tabs, the application header, or controls whose labels and values are already known.                                               |
| Fresh visited target                                 | Display the exact cached target immediately with no loading indicator.                                                                                                                                                                    |
| Same-list page change, such as Ranking pagination    | Retain the preceding rows as explicitly pending placeholder data, preserve row geometry, and mark only the list busy until the target page replaces them. The pending page control must not falsely announce completion.                  |
| Append continuation, such as older opinions          | Keep every loaded item and place one local loading indicator at the continuation boundary. Never replace the complete list with a skeleton.                                                                                               |

- Skeletons communicate only the stable, high-level structure of the expected panel;
  they do not reproduce every optional field or action.
- Loading motion must respect the future global reduced-motion contract. Meaning and
  accessible loading text cannot depend on animation.
- The approximately 300 ms threshold prevents avoidable flashing while still exposing
  unmistakable feedback for a perceptible delay. Final motion curves and skeleton
  styling remain foundation decisions.

### Cache Freshness and Revalidation

- A cache entry is valid only for the exact Music index, difficulty, content area, and
  area-specific state, including Ranking page or opinion sort and continuation state
  where applicable. Never use a cache entry from another target as current data.
- Treat Chart Info as fresh for the lifetime of the current Music-detail page session.
  A new route entry may fetch the current server value again.
- Treat My Record, Ranking, and Tier/evaluation data as fresh for 60 seconds. After
  that interval, display the exact-target cached data immediately and revalidate it in
  the background.
- A successful data sync, evaluation submission or edit, opinion mutation, reaction,
  or other approved data-changing action must invalidate every affected target
  immediately rather than waiting for the 60-second interval.
- During background revalidation, keep exact-target content readable and expose one
  compact Updating status without blocking unrelated interaction.
- If background revalidation fails, preserve the exact cached content and identify it
  as saved content with a compact equivalent of **Could not load the latest data** and
  one **Retry** action. Do not silently imply that stale data is current, and do not
  remove useful cached content solely because refresh failed.
- Do not permanently show a last-updated timestamp unless a future data contract can
  provide an accurate, user-meaningful timestamp for that domain.

### Empty, Authentication, Eligibility, and Permission States

- Empty is a successful request with no applicable data. It is not a loading,
  permission, or failure state.
- Chart Info omits unavailable optional facts rather than turning the complete panel
  into an empty state. A missing Music or selected chart is Not Found, not empty.
- My Record uses the approved compact Login state when signed out and a concise
  no-record state when signed in without a play record. Do not fabricate zero-valued
  analytics.
- Ranking uses the approved concise no-public-record state. It does not offer Retry
  unless the request actually failed.
- Tier/evaluation preserves its approved distinctions among Not listed, Not published,
  no history, no ratings, Aggregating, no opinions, and loading or failure.
- Keep public Tier/evaluation content readable when a user cannot evaluate, react,
  report, edit, or delete. Replace only the restricted action region with the approved
  Login, verified-play, ownership, or moderation eligibility explanation.
- Do not render unexplained disabled forms or use a permission message as a generic
  substitute for absent data.

### Failure Scope, Retry, and Not Found

- On initial route failure, preserve the shared application shell and show a concise
  route-level state equivalent to **Could not load Music information**, with **Retry**
  and **Back to Music search** actions. The Retry action repeats the exact locale,
  Music index, difficulty, content area, and valid area state.
- A confirmed missing Music or chart uses the localized Not Found contract instead of
  a transient error and does not offer a misleading Retry action.
- When no usable cache exists and one selected panel request fails, keep the selected
  target and URL and replace only that panel with a concise failure and one Retry
  action. Do not revert silently to the preceding difficulty or area.
- When one independently loadable subregion fails, such as a distribution or opinion
  continuation, preserve successful sibling content and place the failure and Retry at
  the smallest meaningful region. Do not fail the complete page.
- Automatically retry an idempotent GET once, with a short delay, only for a network
  failure or server `5xx` response. After that attempt, show the visible failure and
  manual Retry. Do not automatically retry `4xx`, authentication, permission,
  validation, or destructive-action failures.
- Manual Retry must repeat the failed target rather than reset difficulty, area,
  pagination, sorting, authentication return state, or scroll context.
- Action-processing failures remain adjacent to the initiating action and follow the
  approved evaluation, opinion, reaction, and deletion consequences. A route error
  boundary does not replace expected action-error handling.

### Focus, Semantics, and Status Announcements

- Implement the content-area choices with `tablist`, `tab`, `tabpanel`,
  `aria-selected`, `aria-controls`, and labelled-panel relationships. The selected
  difficulty requires an equally explicit current-state mechanism appropriate to its
  final control pattern.
- Ordinary difficulty and content-area activation retains keyboard focus on the
  control the user activated. Do not force focus into the loading or completed panel.
- Use one page-level polite status region for concise, target-specific messages such
  as **Loading Real Chart Info**, **Real Chart Info ready**, and **Updating Real
  Ranking**. Avoid one competing live region per skeleton or card.
- Apply `aria-busy="true"` to the updating panel or list and clear it only after the
  coherent update is ready. Do not announce every intermediate skeleton change.
- A visible request failure is announced once with suitable error semantics, while
  focus remains in a predictable place and Retry is reachable in normal focus order.
- Back and Forward restore the exact URL-addressed content and focus context without
  recomputing a hidden default. Detailed arrow-key behavior, mobile overflow, and
  focus behavior after full route entry remain part of the remaining responsive and
  page-level acceptance discussion.

## Approved Chart Info and Personal Record Contract

### Final Labels for the First Two Areas

| Semantic area   | Korean      | Japanese     | English      |
| --------------- | ----------- | ------------ | ------------ |
| Chart facts     | `채보 정보` | `譜面情報`   | `Chart Info` |
| Personal record | `내 기록`   | `プレー記録` | `My Record`  |

- Use **Chart Info**, not Song Info, because the active difficulty determines the
  facts in this area.
- Keep **My Record** clearly personal and chart-scoped. Its existence does not make
  authentication the default entry rule.
- Ranking and Tier/evaluation labels are approved in the Tier & Evaluation contract
  below.

### Chart Info Scope

Chart Info is a concise factual summary of the selected chart. It is not a preview
hub for personal Record, Ranking, or Tier/evaluation.

- Always show BPM, note count, and duration.
- Show release date and unlock condition only when a meaningful value exists. Omit an
  unavailable optional row instead of preserving a row whose value is only `-`.
- Do not repeat difficulty, official level, level constant, category, title, or artist
  when the persistent Music and selected-chart context already exposes them.
- Move pattern-profile data and its vote count to Tier/community evaluation.
- Move score distribution, player count, and the current user's relative placement or
  percentile to Ranking.
- Do not leave compact pattern or score-distribution previews in Chart Info merely to
  link to their owning areas.

This boundary preserves one source of meaning for each domain and avoids reintroducing
the rejected cross-domain Overview pattern inside the default area.

### Selected-Chart Resource Actions

- Treat **View chart**, **Play video**, and an approved external chart resource as
  selected-chart actions rather than factual Chart Info rows.
- Keep them outside the Chart Info panel in a contextual action group associated with
  the selected difficulty.
- Show only actions backed by a valid resource. The already approved concise
  **No published chart** availability state applies when no internal or approved
  external chart exists.
- Exact action order, placement, localized copy, and responsive treatment remain open
  for the representative layout specimen.

### Personal Record Priority

Use the following semantic order:

1. **Best performance:** best score, rank, Full Combo or Pianist achievement state,
   best-record date, and progress to Pianist where relevant.
2. **Cumulative summary:** Play count, Max Combo, Full Combo count, and Pianist count.
3. **Progress over time:** a Best score series showing only record improvements.
4. **Recent plays:** recent chart-specific attempts, with concise row summaries and
   optional per-play details.
5. **Judgement analysis:** detailed judgement counts and rates, note-type success
   rates, and recent judgement/timing trends, collapsed by default.

The cumulative summary supports fast checking but must not compete visually with the
best performance. Exact geometry is deferred to the representative mobile and desktop
specimens.

### Approved Record Terminology and Data Meaning

| Meaning                        | Korean          | Japanese       | English              |
| ------------------------------ | --------------- | -------------- | -------------------- |
| Progress section               | `성장 추이`     | `上達の推移`   | `Progress over time` |
| Current progress-series metric | `베스트 스코어` | `ベストスコア` | `Best score`         |
| Per-user, per-chart play count | `플레이 횟수`   | `演奏回数`     | `Play count`         |

- **Progress over time** is the section label. Because the current series contains
  only best-score improvements, the visible series label and accessible chart title
  must explicitly identify **Best score** rather than imply that every performance
  metric is plotted.
- Play count is a meaningful cumulative measure of how often this user played the
  selected chart. Preserve it independently of clear count.
- Do not expose clear count as a Music-detail performance metric. NOSTALGIA clear
  status does not meaningfully distinguish the user's selected-chart outcome for this
  product purpose.
- Profile-level total Play count, privacy behavior, and presentation are deferred to
  the Profile page brief and are not decided by this chart-scoped contract.

### Analysis and Visualization Rules

- Keep peer comparison optional and off by default. When enabled, expose its sample
  basis and do not present a weak or unavailable sample as authoritative.
- Keep Judgement analysis collapsed by default because it is secondary diagnostic
  content. Best performance and the cumulative summary must never depend on expanding
  it.
- Do not visualize the same pattern-profile values simultaneously as both radar and
  bar charts. Use the approved five-axis community radar as the primary profile and
  provide exact values, per-axis valid counts, and a structured text equivalent.
- Give each chart one explicit question and metric contract. Provide exact values or a
  structured text equivalent, and never rely on color alone to convey a series or
  state.

## Approved Ranking Contract

### Purpose and Information Hierarchy

Ranking answers two questions for the selected chart: **where is the current user?**
and **how do public best scores compare?** It is not a second personal-record dashboard
and does not repeat Music or difficulty facts that remain visible in the persistent
context.

Use this mobile reading order:

1. conditional current-user placement;
2. a heading equivalent to **Ranking · N participants**;
3. the public leaderboard;
4. explicit pagination when required; and
5. the secondary high-skill score distribution.

On desktop, preserve current-user context above the ranking content. Below it, make
the leaderboard the primary region and allow the score distribution to occupy an
adjacent secondary region when space and representative content support it. Preserve
the mobile DOM and reading order even if desktop presentation places those regions
side by side. Do not keep the current `390px` fixed canvas on a wide viewport.

### Conditional Current-User Placement

- When the signed-in user's row is on the current page, do not render a separate
  current-user summary. Highlight that row in the leaderboard using more than color
  alone.
- When the user's row is not on the current page, show one compact summary line above
  the list, equivalent to **My rank 37 / 120 · 976,654 · S · FC**. This summary is
  context, not a second full profile card.
- When the signed-in user has no score for the selected chart, show a concise state
  equivalent to **No rank**.
- When signed out, keep the complete public leaderboard available and provide only a
  small contextual action equivalent to **Sign in to see my rank**. Do not replace or
  obscure the public list with an authentication panel.
- Do not show a relative top-percent value. Exact rank and total participant count are
  more actionable and avoid ambiguous percentile rounding.
- If Ranking initiates Login, preserve locale, Music, selected difficulty, Ranking,
  and valid page context through the approved safe return path.

This conditional rule avoids presenting the same complete row twice while still
making the user's position available from a page that does not contain their row.

### Leaderboard Row Contract

- Show one best-score row per player.
- On mobile, group each row semantically as **Rank | Player | Result**.
- Player contains an avatar and linked display name. Keep the existing profile
  destination.
- Result makes score the primary value and score grade plus Full Combo or Pianist
  state secondary.
- On desktop, grade, achievement state, and score may occupy distinct visual columns,
  but their information relationship must remain the same as mobile.
- Do not add country, best-record date, filters, sort controls, or unrelated profile
  fields to this selected-chart leaderboard.
- Do not repeat Music title, jacket, difficulty, or level in every row because the
  persistent selected-chart context already identifies them.
- Provide visible or programmatically meaningful column labels. Right-align comparable
  numeric values and use tabular numerals.
- The current-user row treatment must remain identifiable without relying only on
  color, and its name and profile action must remain fully operable.

### Shared-Rank and Tie Contract

- Equal best scores receive the same displayed rank.
- Use competition ranking with gaps: `1, 2, 2, 4`.
- Inside an equal-score group, order the earlier achievement time first, but do not
  change the shared rank.
- If achievement time is also equal, use a stable internal ID only as the final
  deterministic ordering key. Do not expose that ID and do not turn it into a unique
  rank.
- The later implementation must map **achievement time** to the most reliable stored
  record-improvement time available from imported NOSTALGIA data. It must not silently
  substitute account creation time or arbitrary user ID.
- This contract applies to the selected-chart Ranking. Consistency with the separate
  global ranking family must be reviewed in that page brief rather than changed
  silently here.

### NOSTALGIA High-Skill Score Distribution

This visualization is intentionally an **S-or-higher high-skill distribution**, not a
whole-population score-grade histogram. Upper-score differences remain useful to
inspect at a consistent `10,000`-point resolution, so preserve these equal-width
bands:

| Bucket    | Included result                                                                |
| --------- | ------------------------------------------------------------------------------ |
| `950k`    | `950,000–959,999`                                                              |
| `960k`    | `960,000–969,999`                                                              |
| `970k`    | `970,000–979,999`                                                              |
| `980k`    | `980,000–989,999`                                                              |
| `990k`    | `990,000–999,999`, excluding a Pianist result                                  |
| `Pianist` | Current NosLog domain condition: score at least `1,000,000` or `fc_type === 3` |

- Show the overall participant count independently, for example
  **Participants 100**.
- Label the visualization and its own denominator independently, for example
  **S-or-higher score distribution · 30 players**.
- Bucket counts and visual proportions must sum to the S-or-higher denominator, not
  the overall participant count.
- Show actual counts with visual proportions and provide the same values in an
  accessible structured representation.
- Do not add a `<950,000` bar merely to make this a whole-population histogram. Those
  players remain included in the separate overall participant count.
- Do not replace these focused bands with broad score-grade categories such as
  Pianist, S, A+, A, B+, B, C, and D. That grouping collapses the meaningful
  `950k–Pianist` separation that this analysis is intended to expose.
- Treat the five `950k` through `990k` intervals and terminal Pianist category as
  analytical categories, not as six official game ranks or six universally named
  community milestones. The documented game rank is S throughout
  `950,000–999,999`, while community discussion most consistently names S, `990,000`,
  and Pianist and also uses `970,000` or `980,000` in narrower progression contexts.
- Do not merge `950,000–979,999` into one count while leaving the `980k` and `990k`
  bands at `10,000` points in this distribution. That unequal interval would make the
  first bar structurally more likely to dominate and would weaken direct comparison.
  A future cumulative milestone-attainment summary would be a different pattern and
  must not silently replace this distribution.
- Exact chart geometry, color, and compact desktop placement remain Foundation and
  representative-specimen decisions. The bucket meaning and denominator contract do
  not.

The user reconfirmed these six categories on 2026-08-01 after review of official rank
definitions, community progression language, public player posts, community courses,
KAC result spreads, and equal-bin visualization guidance. NosLog's current rating
policy provides additional local support: its score floor is `950,000`, its anchors
advance in `10,000` steps through `1,000,000`, and its active mastery curve weights
`990,000` and Pianist performance most strongly. This preserves useful analytical
resolution without misrepresenting every band as an official or universally named
milestone.

### Pagination and Navigation

- Use a fixed page size of **25 players** on mobile and desktop.
- Do not provide a rows-per-page selector.
- Hide pagination when the total is `25` or fewer; show explicit pagination from the
  twenty-sixth result onward.
- Preserve the current page in the localized URL and browser history.
- Use explicit pagination, not infinite scroll.
- After a user changes page, move or restore focus and scroll context to the Ranking
  heading or list start, and announce the updated result range to assistive
  technology.
- Normalize a non-numeric, negative, zero, or out-of-range page to the first valid
  page while preserving Music, difficulty, locale, and Ranking state.
- Page changes must not discard the current-user context or selected-chart context.

Twenty-five balances repeated comparison with mobile scan length and is a common
production table increment. The current seven-row page is observed legacy behavior,
not a 2.0 constraint.

### Loading, Empty, Error, and Accessibility States

- During loading, preserve leaderboard row geometry with a restrained skeleton and
  mark the updating region with `aria-busy`.
- On request failure, show one concise error and an explicit Retry action. Do not
  present silently stale rows as if they are current.
- When no public best score exists, show one concise state equivalent to
  **No recorded scores** (`등록된 기록이 없습니다`). Do not simultaneously show a
  second **No rank** message for the current user.
- Signed-out users retain the same public empty, loading, and error behavior as
  signed-in users.
- Preserve table or equivalent collection semantics and header associations in the
  mobile representation; responsive styling must not turn the rows into unlabeled
  values.
- Treat an avatar as decorative when the adjacent linked player name already conveys
  the same identity. Localize meaningful score-grade image alternatives; do not reuse
  the current hard-coded Korean alternative text across locales.
- Localize displayed numbers while retaining stable numeric meaning, right alignment,
  and tabular figures.
- Do not communicate current-user row, Full Combo, Pianist, grade, loading, or error
  state by color alone.

## Approved Tier and Evaluation Contract

### Purpose, Labels, and Reading Order

| Meaning             | Korean      | Japanese       | English             |
| ------------------- | ----------- | -------------- | ------------------- |
| Public score area   | `랭킹`      | `ランキング`   | `Ranking`           |
| Tier and evaluation | `서열·평가` | `難易度・評価` | `Tier & Evaluation` |

Tier & Evaluation answers four questions for the selected chart:

1. which public tier placements currently apply;
2. how difficult the eligible community perceives the chart to be;
3. what performance tendencies characterize its pattern; and
4. how an eligible player can contribute or revise an evaluation.

Use this mobile reading order:

1. the six current tier placements followed by their one integrated history
   disclosure;
2. the perceived-difficulty aggregate;
3. the community pattern-tendency radar;
4. the current user's evaluation action or form; and
5. community opinions.

Do not turn this area into another score Ranking or repeat the factual Chart Info
contract. The community-opinion contract below defines the list, reaction, reporting,
moderation, sorting, and deletion behavior without approving a final visual design.

### Six Tier Placements

- Show all six current placements without requiring a preliminary selector:
  **Basic S**, **Basic Full Combo**, **Basic Pianist**, **Recital S**,
  **Recital Full Combo**, and **Recital Pianist**.
- Group the placements by Basic and Recital while retaining the association between
  each placement value and its S, Full Combo, or Pianist goal.
- Treat the current placement as the primary fact. Never hide a current placement
  behind the history disclosure.
- A wide layout may use a grid or table when it improves comparison, but must preserve
  the same information relationships and mobile reading order. Exact geometry is
  deferred to representative specimens.

#### Placement-State Semantics and Localized Copy

The six positions remain present in every successful response. Use these distinct
states instead of collapsing every absent value into one generic empty state:

| State                                                            | Korean                  | Japanese                | English                 | Required meaning                                                     |
| ---------------------------------------------------------------- | ----------------------- | ----------------------- | ----------------------- | -------------------------------------------------------------------- |
| Published list contains the selected chart                       | Numeric placement value | Numeric placement value | Numeric placement value | Current public placement                                             |
| Corresponding list is published but the selected chart is absent | `미등재`                | `未掲載`                | `Not listed`            | The chart has no current placement in that published list            |
| Corresponding list itself is not published                       | `미공개`                | `未公開`                | `Not published`         | No public list currently exists for that mode and goal               |
| Request or system failure                                        | `불러오지 못했습니다`   | `読み込めませんでした`  | `Couldn’t load`         | Data availability is unknown; provide one section-level Retry action |

- A chart that was previously placed and later removed uses **Not listed** for its
  current position. Its history, when opened, explains the removal event.
- Loading preserves the geometry and labels of all six positions with restrained
  placeholders and an updating-region busy state.
- Never present a request failure as **Not listed** or **Not published**.
- Do not repeat educational copy, illustrations, or actions in each absent position.
  These are compact status values inside a comparison group, not six independent
  page-level empty states.

#### Unified Placement-History Disclosure

- Place exactly one disclosure labelled **Tier placement history** after both the
  Basic and Recital placement groups. Keep it collapsed by default.
- Do not provide six per-placement disclosures, six mini charts, or a permanent
  multi-series chart. The user's primary question is the current six-position state;
  the secondary question is what changed and when.
- When history exists, the collapsed row may show the latest effective date beside
  the disclosure label. The date is supporting text and must not replace the label.
- When opened, show the five newest events first. Group events that share an effective
  date under one date heading and order date groups newest first.
- Each event identifies the Basic or Recital mode, S, Full Combo, or Pianist goal, and
  the exact transition:
    - initial placement: **Not listed → value**;
    - placement change: **previous value → current value**; and
    - removal: **previous value → Removed from tier**.
- Append older events in explicit batches of ten with **Show older changes**. Do not
  use infinite scroll or a page-size selector.
- If no placement-history event exists for the selected chart, replace the disclosure
  with one neutral **No placement history** line. Do not render a dead expand control.
- The same disclosure order and event semantics apply on mobile and desktop. Wider
  layouts may align date and transition columns more efficiently but must not split
  the history into six unrelated panels.

Use this localized control and event vocabulary:

| Meaning                | Korean              | Japanese                 | English                  |
| ---------------------- | ------------------- | ------------------------ | ------------------------ |
| History disclosure     | `서열 변경 이력`    | `難易度表の変更履歴`     | `Tier placement history` |
| Latest change          | `최근 변경`         | `最終変更`               | `Latest change`          |
| No history             | `변경 이력 없음`    | `変更履歴なし`           | `No placement history`   |
| Continue older history | `이전 변경 더 보기` | `以前の変更をさらに表示` | `Show older changes`     |
| Removal event          | `등재 제외`         | `掲載除外`               | `Removed from tier`      |

The disclosure control must be a semantic button with an accessible name,
`aria-expanded`, and an association to the controlled region. `Enter` and `Space`
toggle it. Opening or appending history must not move focus unexpectedly; appended
results need a concise accessible update.

#### Placement Data Contract and Implementation Mapping

- Materialize six semantic positions from the published-list state for every selected
  chart. Do not derive the public result with one unrestricted `findFirst` placement.
- Preserve removal events. The current `TierPlacementHistory.bandValue = null`
  meaning is a real **Removed from tier** event and must not be filtered out of the
  public history query.
- Reconstruct the preceding state independently within each mode-and-goal stream so
  every displayed transition has an unambiguous source and destination.
- Return list-publication state, current placement state, history events, and request
  failure as distinguishable data. The interface must not infer **Not published**,
  **Not listed**, and error from the same empty array.
- A migrated current placement with no recorded history remains a valid current
  value and uses **No placement history** below the six positions.
- The current product's single latest published placement, one-series line graph, and
  public query that omits null-valued removal events are observed legacy behavior and
  must be replaced during the later 2.0 implementation.

### Perceived-Difficulty Aggregate

- Perceived difficulty is required when an eligible user submits an evaluation.
- Always show the exact number of valid perceived-difficulty ratings.
- With one or two valid ratings, show an **Aggregating** state and the rating count;
  hide the average and distribution.
- With three or more valid ratings, show the average and value distribution together
  with the rating count.
- The initial threshold of three prevents an individual vote from being presented as
  a community result. It is not a statistical-confidence claim, so the exact sample
  size must remain visible.
- Signed-out and ineligible users may read the public aggregate. Eligibility controls
  contribution, not visibility.

### Community Pattern-Tendency Radar

- Use one five-axis radar profile as the primary visualization. Do not duplicate the
  same values in a second bar chart.
- Use this fixed axis order and localization on every chart and viewport:

| Axis | Korean     | Japanese     | English      |
| ---- | ---------- | ------------ | ------------ |
| 1    | `계단`     | `階段`       | `Stairs`     |
| 2    | `연타`     | `連打`       | `Repetition` |
| 3    | `폴리리듬` | `ポリリズム` | `Polyrhythm` |
| 4    | `즈레`     | `ズレ`       | `Offset`     |
| 5    | `동시치기` | `同時押し`   | `Chords`     |

- Korean explanatory copy may mention the established shorthand `동치`, but the
  visible axis label remains the clearer `동시치기`.
- **Chords** measures simultaneous-input burden, including simultaneous-note count,
  span, changing shapes, repeated chords, and tenuto-chord combinations. It is not a
  raw count of all simultaneous notes.
- Keep the concepts distinct: **Polyrhythm** covers different rhythmic structures
  between hands; **Offset** covers closely displaced timing; **Chords** covers notes
  required at the same timing.
- Do not use Glissando as a community radar axis. Preserve Glissando as a chart note
  type and as part of personal Judgement analysis where its performance meaning is
  useful.
- Use one fixed `0–4` scale and fixed axis order so the shape remains comparable
  across charts and locales.
- Draw only the community average. Do not overlay the current user's profile on the
  same radar.
- Provide exact averages and valid rating counts for all five axes in compact,
  structured text near the radar. This is the precise and accessible equivalent, not
  a second competing visualization.
- Pattern-axis ratings are individually optional. Store **Not rated** as missing data,
  distinct from the valid `0` value **None**.
- Require at least three valid ratings per axis before publishing that axis. If any
  axis remains below the threshold, do not draw a partial or falsely complete polygon;
  show an Aggregating state with the available per-axis counts instead.
- Provide one shared **Pattern tendency criteria** help entry for the five definitions
  rather than five permanent help buttons.
- The radar requires a structured text alternative and must not depend on color alone.
  Final size, typography, label collision behavior, and contrast are foundation and
  specimen decisions. The current component's small geometry is observed evidence,
  not the 2.0 baseline.

### Evaluation Input and Eligibility

- Only a signed-in user with a verified play record for the selected chart may submit
  an evaluation.
- Perceived difficulty is required. Each of the five pattern-axis ratings and the
  comment are optional.
- The form must offer an explicit **Not rated** state and must never prefill an omitted
  pattern rating as `0` or **None**.
- Keep one evaluation per user and selected chart. The user may edit or delete it.
- Keep public aggregates readable for signed-out users and signed-in users who are not
  eligible to submit.
- The current input schema and form require all legacy pattern fields and a comment.
  The 2.0 implementation must migrate that contract explicitly: separate the current
  `chord` field that is used for Polyrhythm from the new simultaneous-input Chords
  meaning, remove Glissando from the community profile without removing Glissando
  performance data, and make optional ratings genuinely nullable. Do not silently
  repurpose stored values.

### Community Opinions

#### Information Hierarchy and Row Content

- Treat an opinion as the optional written part of one user's selected-chart
  evaluation, not as an independent discussion post detached from the evaluation.
- Each visible opinion exposes the author identity, the author's perceived-difficulty
  value, written opinion, written or edited time, Helpful count and state, and a
  contextual overflow action.
- Make the perceived-difficulty value a primary scan value in each opinion. It must be
  more prominent than author metadata and time, but it must not compete with the
  opinion text or be confused with the community aggregate above the list.
- Exact typography, weight, color, badge treatment, spacing, surfaces, and row or card
  geometry are deferred to the approved foundations and representative mobile and
  desktop specimens. The discussion mock-up used to approve this contract is a
  behavioral example only and is not a visual source of truth.
- Keep the written opinion concise and readable as the main row body. Show an edited
  indicator when applicable without exposing a full revision history in the public
  list.
- Do not repeat the five pattern-axis values in every opinion row. The community radar
  owns the aggregate, and a user's individual pattern values are not required for
  scanning written advice.
- Do not add nested replies, author pinning, or a second discussion hierarchy in this
  contract. Opinions support chart evaluation and practical reading rather than a
  general-purpose forum.

#### Helpful Reaction and Eligibility

- Provide one reversible positive reaction labelled equivalently to **Helpful**.
  Display its count and the current user's selected state together.
- Do not expose a public **Unhelpful**, dislike, or negative count. The reaction helps
  readers surface useful chart advice; it is not a parallel correctness vote or a
  mechanism for community punishment.
- A user may react only when signed in and holding a verified play record for the
  selected chart, matching evaluation eligibility. Public readers may still see the
  count.
- The opinion author cannot react to their own opinion. Explain unavailable self-
  reaction through the control's disabled or omitted state and accessible context;
  do not show an error only after an invalid submission.
- Toggling Helpful must not move the row while the user is operating it, even when the
  list is sorted by Helpful. Apply the changed order on the next deliberate refresh,
  sort change, or list request so focus and reading context remain stable.

#### Sorting and Explicit Continuation

- Offer exactly two sorts: **Helpful** and **Newest**. Helpful is the default.
- Helpful sorts by Helpful count descending, then written or edited recency descending
  as the deterministic visible tie rule. Newest sorts by the opinion's current public
  recency descending.
- Initially render ten opinions. An explicit **Load more opinions** action appends the
  next ten in the active sort without replacing the rows already read.
- Hide the continuation action when no more opinions exist, and preserve already
  loaded rows after a Helpful toggle or report submission.
- Do not use infinite scroll, an Oldest sort, a page-size selector, or nested
  pagination controls for this supporting list.

#### Author Editing and Two Deletion Scopes

- Keep opinion editing in the author's contextual overflow menu. Preserve the parent
  evaluation and show the public edited indicator after a successful update.
- **Delete opinion** removes only the optional written opinion. It retains the user's
  perceived-difficulty and optional pattern ratings in valid community aggregates.
- **Delete entire evaluation** is a separate destructive action that removes the
  perceived-difficulty rating, any pattern-axis ratings, and the written opinion.
- Never make a comment-labelled delete action silently remove the whole evaluation.
- Both destructive actions require consequence-specific confirmation. The opinion-
  only confirmation explicitly says that evaluation values remain; the entire-
  evaluation confirmation explicitly names all data that will be removed and states
  that the action cannot be undone.

#### Reporting and Moderation

- Keep **Report** in another user's contextual overflow menu instead of adding a
  permanent action button to every row.
- The report dialog requires one reason: irrelevant or spam; abuse, harassment, or
  hate; sensitive, private, or dangerous content; or Other. Other may request a short
  explanation when needed for review.
- A successful report acknowledges receipt without publicly revealing the reporter or
  instantly claiming that the opinion violated policy.
- One report does not automatically hide an opinion for everyone. Administrators
  review reports and choose one explicit result: **Keep**, **Hide written opinion**,
  or **Exclude entire evaluation**.
- **Hide written opinion** removes the text from public display while retaining valid
  non-text evaluation values. **Exclude entire evaluation** removes every value from
  public aggregation and opinion display. Preserve the moderation record and reason
  separately from public content.
- Rate limiting, duplicate-report prevention, audit retention, notification policy,
  appeal policy, and exact administrator queue layout remain implementation and
  operations decisions. They must not weaken the approved distinction between hiding
  text and excluding an evaluation.

#### Accessibility Consequences

- Give every overflow trigger an author-specific accessible name and expose its open
  state. Opening the menu moves keyboard focus into its actions; Escape closes it and
  returns focus to the trigger.
- Report, edit, and destructive confirmations use labelled modal-dialog semantics,
  contain focus while open, support Escape or an explicit Cancel action, and return
  focus to the invoking control.
- Keep Helpful and overflow controls large or sufficiently separated for 390px touch
  use. Do not communicate reaction, report, edited, hidden, or destructive state by
  color alone.
- Announce successful reaction, edit, deletion, report, and appended-result changes
  without replacing the user's current reading position.

### Community-Opinion Reference Evidence

| Source                                                                                                                              | Transferable finding                                                                                                             | NosLog application                                                                                                                             | Limitation                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [YouTube: View, organize, or delete comments](https://support.google.com/youtube/answer/6000976?hl=en)                              | Public comments expose author, time, reactions, edit/delete actions, reporting, and Top/Newest sorting.                          | Confirms that a compact row can keep primary reading content visible while moving owner and safety actions into context.                       | YouTube supports replies and broad entertainment discussion that NosLog does not need.               |
| [YouTube: Report inappropriate content](https://support.google.com/youtube/answer/2802027)                                          | A report is opened from a comment's More menu, asks for a reason, and is reviewed rather than automatically proving a violation. | Supports contextual Report, explicit reasons, reporter privacy, and no global single-report auto-hide.                                         | YouTube's moderation scale and automation are not NosLog requirements.                               |
| [GitHub: Reporting abuse or spam](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam) | In-product reports target specific discussions or comments and route them for review.                                            | Supports report attachment to the exact opinion and a separate moderation record.                                                              | GitHub limits some report capabilities by repository relationship and permissions.                   |
| [GitHub Discussions documentation](https://docs.github.com/en/discussions)                                                          | Discussion content has explicit edit/delete and moderator actions.                                                               | Supports separating author actions from administrative moderation.                                                                             | A software-project forum is broader and more conversational than chart opinions.                     |
| [Stack Overflow: Vote up comments](https://stackoverflow.com/help/privileges/vote-comments)                                         | One positive comment vote indicates useful and appropriate content.                                                              | Direct precedent for one Helpful signal without requiring a public negative count.                                                             | Stack Overflow's reputation model and content ranking must not be copied.                            |
| [Stack Overflow: Flagging](https://stackoverflow.com/help/flagging)                                                                 | Flags request moderator review, use standard reasons plus a custom option, and are distinct from ordinary voting.                | Supports reasoned reports and separation of usefulness from policy violation.                                                                  | Some Stack Overflow flag thresholds can auto-delete; NosLog explicitly rejects one-report auto-hide. |
| [Google Maps: Local Guides community guidelines](https://support.google.com/maps/answer/7358351?hl=en)                              | Helpful experiential writing should be specific and relevant, while inappropriate contributions are reported.                    | Reinforces chart-experience eligibility and a concise advice-oriented opinion body.                                                            | Place reviews are not rhythm-game chart evaluations.                                                 |
| [WAI-ARIA APG: Menu Button](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)                                                  | A contextual action menu needs explicit open state, keyboard entry, and focus behavior.                                          | Governs each opinion's overflow action without adding permanent buttons.                                                                       | APG defines semantics, not NosLog styling.                                                           |
| [WAI-ARIA APG: Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                                | Modal dialogs contain focus, provide a label and closing action, support Escape, and restore context.                            | Governs report, edit, and destructive confirmations.                                                                                           | Exact initial focus depends on the final content and implementation.                                 |
| [WCAG 2.2: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                                               | Sequential focus must preserve meaning and operation.                                                                            | Prevents menus, appended opinions, and dialogs from producing confusing focus jumps.                                                           | It does not choose the visible row composition.                                                      |
| [WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                             | Pointer targets need sufficient size or spacing.                                                                                 | Applies to Helpful, overflow, sort, dialog, and continuation controls at the 390px baseline.                                                   | Meeting the minimum is not enough to define hierarchy or final geometry.                             |
| [GOV.UK: Pagination](https://design-system.service.gov.uk/components/pagination/)                                                   | Break up long collections only when it improves usability, and avoid automatic infinite scroll because it harms keyboard access. | Supports an explicit continuation action instead of unbounded automatic loading.                                                               | Page navigation is not identical to append-in-place comments.                                        |
| [Carbon: Modal](https://carbondesignsystem.com/components/modal/usage/)                                                             | A danger modal names the consequence of irreversible loss and uses action-specific labels.                                       | Supports separate confirmations for opinion-only and entire-evaluation deletion.                                                               | Carbon's visual modal treatment is not a NosLog style source.                                        |
| [Carbon: Remove pattern](https://carbondesignsystem.com/community/patterns/remove-pattern/)                                         | Confirmation strength should reflect whether removal is reversible and how much data is lost.                                    | Justifies stronger consequence copy for deleting the entire evaluation than for deleting optional text.                                        | The pattern covers enterprise objects rather than community evaluations.                             |
| [Adobe Spectrum: Alert dialog](https://spectrum.adobe.com/page/alert-dialog/)                                                       | Destructive dialogs use a short outcome title, necessary consequence description, Cancel, and a specific destructive action.     | Reinforces clear, non-generic delete confirmations.                                                                                            | Spectrum's color and component anatomy are not automatically adopted.                                |
| [Atlassian Design: Components](https://atlassian.design/components/)                                                                | Comment, dropdown menu, modal dialog, and pagination are distinct components with distinct interaction roles.                    | Supports composing opinions from reusable reading, contextual-action, confirmation, and continuation patterns rather than one overloaded card. | The component catalog does not determine NosLog's final information priority or styling.             |

The reference set converges on four principles: keep reading content primary; use one
positive usefulness signal separately from safety reporting; place secondary and
destructive actions in context; and require explicit, accessible moderation and
confirmation flows. NosLog narrows these patterns to verified chart participants and
keeps evaluation data separable from its optional written opinion. None of the visual
surface treatments in these products or the approval mock-up is adopted as NosLog's
final design.

## Reference Comparison

### Authoritative Interaction and Layout Guidance

| Source                                                                                                        | Transferable finding                                                                                                                                                 | NosLog application                                                                                         | Limitation                                                                                 |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [W3C APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                       | A tab list presents one associated panel at a time; activation and focus behavior must be explicit.                                                                  | Supports one selected Music-detail content area and requires complete keyboard semantics.                  | It defines behavior and semantics, not visual composition.                                 |
| [Carbon: Tabs](https://carbondesignsystem.com/components/tabs/usage/)                                         | Tabs group different but related information in one context; avoid them when simultaneous comparison is necessary. Slow remote content favors deliberate activation. | Record, information, ranking, and evaluation are related views but are not normally compared line by line. | Carbon's component styling is not a NosLog art direction.                                  |
| [GOV.UK: Tabs](https://design-system.service.gov.uk/components/tabs/)                                         | Tabs suit clearly separable sections, especially for frequent users who do not need every section at once; selected state can be URL-addressable.                    | NosLog users repeatedly return to a specific chart task and benefit from restorable state.                 | Its narrow-screen presentation is service-specific and must not be copied without testing. |
| [Atlassian: Tabs](https://atlassian.design/components/tabs/)                                                  | Tabs organize similar information on the same page.                                                                                                                  | Supports one entity with four related product areas.                                                       | The public page provides limited product-specific responsive detail.                       |
| [Fluent 2: Tablist](https://fluent2.microsoft.design/components/web/react/core/tablist/usage)                 | One tab, usually the first, is active on initial render and tab order should communicate the default.                                                                | Supports placing public Information first when it is the general-entry default.                            | Fluent's narrow-layout control substitution is not automatically a NosLog rule.            |
| [Adobe Spectrum: Tabs](https://spectrum.adobe.com/page/tabs/)                                                 | Related equal-level sections need a clear selected state; manual activation is appropriate when content is not instantaneous.                                        | Supports explicit area selection while detailed data loads on demand.                                      | Spectrum permits some disabled-tab uses that do not fit NosLog's recoverable Login state.  |
| [Apple: Segmented controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) | A small set of related, mutually exclusive choices can alter the current view while keeping context stable.                                                          | Reinforces concise difficulty or view selection, subject to localized-width testing.                       | A segmented control is not automatically the correct visual component for NosLog tabs.     |
| [Apple: Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views)                   | Related mutually exclusive panes require clear selection and concise labels.                                                                                         | Supports limiting persistent content choices and avoiding competing panels.                                | Platform navigation tabs and in-page tabs are not identical.                               |
| [Material Design: Canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview)   | Feed layouts optimize broad scanning; list-detail and supporting panes preserve a selected object's context.                                                         | Shows why an overview-card feed better fits dashboards, while Music detail needs stable selected context.  | Canonical layouts are starting structures, not a mandate for the final page.               |
| [WCAG 2.2: Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html)                                   | Content must adapt without two-dimensional scrolling at required narrow widths.                                                                                      | Future tabs and panels must survive localized labels and 390px validation.                                 | It does not choose the exact tab overflow pattern.                                         |
| [WCAG 2.2: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                 | Interactive targets require adequate size or spacing.                                                                                                                | Difficulty and content-area controls need reliable touch targets without a dense permanent button wall.    | Meeting the minimum alone does not establish good hierarchy.                               |
| [WCAG 2.2: On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html)                               | Receiving focus must not initiate an unexpected change of context.                                                                                                   | Focusing Record cannot automatically open Login; authentication requires an explicit action.               | It does not define authentication copy or visual treatment.                                |
| [WCAG 2.2: Consistent Navigation](https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation.html)     | Repeated navigation mechanisms should retain a predictable relative order.                                                                                           | Supports a stable semantic area order across authentication states and Music entries.                      | It does not determine which NosLog area is most important.                                 |

### Asynchronous State, Recovery, and Cache Guidance

| Source                                                                                                               | Transferable finding                                                                                                                                   | NosLog application                                                                                                         | Limitation                                                                                              |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [W3C APG: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                              | A selected tab and its panel require explicit semantic relationships; automatic activation is appropriate only when panel latency is not noticeable.   | Requires correct selected-area semantics and clear pending behavior when remote content is not immediate.                  | APG does not prescribe visual loading treatment or cache duration.                                      |
| [WCAG 2.1: Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)                        | Waiting, result, progress, and error messages that do not move focus must be programmatically exposed.                                                 | Requires concise target-specific loading, ready, update, and failure announcements without forced focus movement.          | It does not require creating unnecessary visible status copy or define exact politeness.                |
| [MDN: `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)   | A changing region can defer incomplete announcements until its coherent update is ready.                                                               | Mark only the selected panel or list busy and clear it after the complete target update.                                   | Browser and assistive-technology behavior still requires implementation testing.                        |
| [React: `useTransition`](https://react.dev/reference/react/useTransition)                                            | Non-blocking transitions remain interruptible and let a later user choice supersede pending work.                                                      | Supports keeping difficulty and area navigation usable and committing only the latest selected target.                     | The React primitive does not supply fetching, cancellation, cache, or error UI by itself.               |
| [Next.js: Loading UI and Streaming](https://nextjs.org/docs/app/getting-started/fetching-data)                       | Preserve a useful static shell and place Suspense boundaries near unresolved dynamic content.                                                          | Supports persistent Music context with a target-panel or route-level placeholder instead of a full blank page.             | The current client fetch architecture will need implementation mapping rather than documentation alone. |
| [Next.js: Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)                                | Expected request failures need explicit UI handling, and asynchronous event-handler failures are not automatically handled by render error boundaries. | Requires local request error state, exact Retry, and a separate route-level initial failure contract.                      | Framework boundaries do not decide NosLog's empty, permission, or domain-specific copy.                 |
| [Carbon: Loading Pattern](https://carbondesignsystem.com/patterns/loading-pattern/)                                  | Skeletons fit known structured content; inline indicators fit smaller processing scopes; assistive technology needs loading and failure notification.  | Supports panel skeletons, local continuation indicators, and avoiding multiple simultaneous page loaders.                  | Carbon's timing and component styling are not NosLog foundation tokens.                                 |
| [Fluent 2: Skeleton](https://fluent2.microsoft.design/components/web/react/core/skeleton/usage)                      | Skeletons should represent essential dynamic structure, not fixed tabs, and must preserve focus when content appears.                                  | Limits Music-detail skeletons to dynamic panel geometry and requires stable keyboard context.                              | Fluent suggests skeletons for longer waits; NosLog adopts a separately approved anti-flash threshold.   |
| [PatternFly: Skeleton](https://www.patternfly.org/components/skeleton/design-guidelines/)                            | Use a skeleton when the final structure is known and a spinner when structure is unknown or likely to resolve to failure or empty.                     | Supports area-specific skeleton shapes while reserving compact indicators for uncertain local continuations.               | PatternFly's enterprise visual anatomy is not a NosLog art direction.                                   |
| [Primer: Loading](https://primer.style/product/ui-patterns/loading/)                                                 | Loading feedback should be component-specific, subtle, and may use delayed indicators to avoid flashing.                                               | Supports the approximately 300 ms perceptible-delay threshold and one local indicator at an append boundary.               | Primer's exact delay props are implementation examples, not universal performance guarantees.           |
| [Adobe Spectrum: Progress Circle](https://spectrum.adobe.com/page/progress-circle/)                                  | Indeterminate progress fits work whose duration cannot be calculated, with scale chosen for its containing region.                                     | Supports small local feedback for Retry, continuation, and action processing rather than fake percentages.                 | Native-platform scale and styling are not transferred.                                                  |
| [SAP Fiori: Placeholder Loading](https://experience.sap.com/fiori-design-web/placeholder-loading/)                   | Responsive skeleton pages can preserve a familiar object-page frame and replace only newly loading content.                                            | Supports one stable Music-detail context across mobile and desktop while the selected panel changes.                       | Fiori floorplans and generic placeholder visuals are not copied.                                        |
| [SAP Fiori: Empty States](https://experience.sap.com/fiori-design-web/designing-for-empty-states/)                   | No data, user-action results, permission, configuration, and system failures require different meanings and appropriately scoped next steps.           | Prevents Record, Ranking, Tier placement, permission, and request failures from collapsing into one generic empty state.   | NosLog intentionally uses shorter copy than many enterprise empty-state examples.                       |
| [Atlassian: Designing Messages](https://atlassian.design/foundations/content/designing-messages/)                    | Empty, section, flag, and banner messages serve different scopes and severities.                                                                       | Uses panel-level messages for selected-area failures and avoids a global banner for a local request.                       | Atlassian's flag and banner placements are product-specific.                                            |
| [USWDS: Alert](https://designsystem.digital.gov/components/alert/)                                                   | Alerts communicate important informational, warning, success, or error changes with explicit semantics.                                                | Supports one concise visible error treatment after a request finally fails.                                                | The government visual component is not adopted as NosLog styling.                                       |
| [TanStack Query: Paginated Queries](https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries) | Previous successful rows can serve as explicitly identified placeholder data during a same-schema page change, reducing layout jumps.                  | Allows pending Ranking rows to remain only during Ranking pagination, not across different semantic areas or difficulties. | NosLog need not adopt TanStack Query; the state distinction transfers independently.                    |
| [web.dev: Stale While Revalidate](https://web.dev/articles/stale-while-revalidate)                                   | Exact cached content can provide immediacy while an age-based background request restores freshness.                                                   | Supports exact-target Fresh/Stale semantics, 60-second dynamic data freshness, and non-blocking update state.              | HTTP examples do not determine NosLog's domain-specific invalidation events.                            |
| [MDN: `AbortController.abort()`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort)             | An obsolete fetch and response-body consumption can be cancelled before completion.                                                                    | Supports latest-intent-wins difficulty and content-area navigation without wasting or committing obsolete requests.        | Cancellation does not replace request identity checks, deduplication, or visible error handling.        |

The sources converge on scoped feedback, persistent stable context, semantically exact
target data, distinct absence and failure meanings, and interruptible navigation. They
differ on when a visual loader should appear: examples range from a short delayed
indicator to skeletons intended for waits above roughly one second. NosLog resolves
that disagreement by updating the target and busy semantics immediately, avoiding
animated loader flash for sub-300 ms responses, and revealing a simplified
structure-matched skeleton only for a perceptible delay. Previous visible data is
retained only when it belongs to the exact target during revalidation or to the same
schema during pagination; it is never borrowed from another semantic area or
difficulty.

### Authentication and Return-Path Guidance

| Source                                                                                                                                  | Transferable finding                                                                             | NosLog application                                                                                   | Limitation                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Auth0: B2C authentication architecture](https://auth0.com/docs/get-started/architecture-scenarios/business-to-consumer/authentication) | Authentication should return a user to the protected destination that initiated the flow.        | Record Login preserves Music, difficulty, locale, and selected area instead of falling back to Home. | Auth0's product architecture is not NosLog's implementation stack.            |
| [Auth0: Redirect users after login](https://dev.auth0.com/docs/authenticate/login/redirect-users-after-login)                           | Store the intended URL through authentication and validate the return target before redirecting. | Confirms the approved safe relative `returnTo` contract and exact post-login restoration.            | The callback code must follow NosLog's existing Discord OAuth system.         |
| [WCAG 2.2: Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)                                      | A link's purpose must be understandable from its text and surrounding context.                   | Login must make clear that it unlocks personal Record and returns to the current chart context.      | It does not prescribe the final localized wording.                            |
| [WCAG 2.2: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                                                   | Focus order must preserve meaning and operability through navigation and context changes.        | Tab order, the Login action, and restored Record content need a logical focus sequence.              | Exact focus restoration still requires representative implementation testing. |

### Content Hierarchy and Data-Visualization Guidance

| Source                                                                                                                | Transferable finding                                                                                               | NosLog application                                                                                         | Limitation                                                                    |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Figma: UI design principles](https://www.figma.com/resource-library/ui-design-principles/)                           | Hierarchy should reflect what users need first; progressive disclosure reduces overload from secondary capability. | Best performance and core chart facts remain visible while diagnostic detail can be disclosed on demand.   | This is general design guidance and does not define NOSTALGIA data meaning.   |
| [W3C: Presentation and progressive disclosure](https://www.w3.org/WAI/people-use-web/tools-techniques/presentation/)  | Interfaces may reduce distraction by initially showing only what is necessary for the current task.                | Supports separating factual Chart Info from Ranking and Tier/evaluation rather than mixing previews.       | Reduced presentation must not hide content that every user needs.             |
| [GOV.UK: Summary list](https://design-system.service.gov.uk/components/summary-list/)                                 | A description list is suitable for a compact set of related key-value facts.                                       | BPM, note count, duration, and available optional facts form one concise Chart Info group.                 | The GOV.UK surface styling is not a NosLog visual direction.                  |
| [GOV.UK: Accordion](https://design-system.service.gov.uk/components/accordion/)                                       | Accordions hide content and should be reserved for related sections that users do not all need to read.            | Supports collapsing Judgement analysis, not Best performance or the cumulative summary.                    | User testing is still required to confirm discoverability.                    |
| [Carbon: Accordion](https://carbondesignsystem.com/components/accordion/usage/)                                       | Progressive disclosure fits secondary long content in constrained space but adds interaction cost.                 | Advanced judgement and timing diagnostics justify the cost; primary record facts do not.                   | Carbon component geometry must not be copied as a visual rule.                |
| [USWDS: Data visualizations](https://designsystem.digital.gov/components/data-visualizations/)                        | Prefer familiar chart types and limit a visualization to one central idea with few concepts.                       | Rejects duplicating the same pattern values in radar and bar charts and requires an explicit metric.       | The examples are guidance, not a coded NosLog component.                      |
| [ONS: Choosing a chart type](https://service-manual.ons.gov.uk/data-visualisation/chart-types/choosing-a-chart-type)  | Choose the simplest familiar chart for the relationship; separate charts can be clearer than one complex chart.    | A time series can answer Best-score progression while pattern comparison is decided separately.            | Public-statistics audiences differ from rhythm-game experts.                  |
| [Carbon: Chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)                             | Descriptive titles, direct labels, and restrained chart frames make a chart's meaning easier to interpret.         | Requires the Progress section to identify its Best score series instead of using an ambiguous trend title. | Carbon's token and chart styling are not NosLog foundations.                  |
| [W3C: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)                                               | Charts need short identification plus a structured text representation of essential values and relationships.      | Score and pattern visualizations require exact values or an equivalent structured description.             | The exact alternative depends on the final selected chart.                    |
| [Apple: Charts](https://developer.apple.com/design/human-interface-guidelines/charts)                                 | Charts should emphasize the relevant relationship and remain legible with accessible labels and interaction.       | Reinforces focused progress and comparison views rather than decorative duplicate graphics.                | Platform-specific interaction details are not automatically web requirements. |
| [Texas: Data visualization guide](https://www.tdi.texas.gov/styleguide/style-guide-for-data-visualization-tools.html) | Put the most important information first; use line charts for trends and tables or labels for exact values.        | Supports Best performance before history, a line for Best-score progress, and exact value access.          | Government editorial guidance does not determine NosLog art direction.        |

### Tier, Evaluation, and Pattern-Profile Evidence

| Source                                                                                                                                                               | Transferable finding                                                                                                   | NosLog application                                                                                                           | Limitation                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Official NOSTALGIA Op.3: How to play](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                                                               | Glissando is a distinct playable note behavior in NOSTALGIA.                                                           | Retain Glissando in note-type and personal-performance analysis even though it is not one of the five community radar axes.  | It explains play behavior, not community evaluation taxonomy.                       |
| [Official NOSTALGIA Op.3: PC environment](https://p.eagate.573.jp/game/eacnostalgia/op3/info/env.html)                                                               | The official PC requirements call for a keyboard that can recognize multiple simultaneous keys.                        | Confirms that simultaneous-input burden is a real NOSTALGIA chart property worth evaluating as Chords.                       | Hardware requirements do not define a rating scale.                                 |
| [Current Prisma schema](../../prisma/schema.prisma)                                                                                                                  | The current evaluation record stores required legacy `stairs`, `chord`, `trill`, `glissando`, and `repetition` fields. | Requires an explicit nullable-field and taxonomy migration rather than a label-only redesign.                                | Current storage is observed implementation, not the 2.0 product authority.          |
| [Current evaluation configuration](../../components/music/musicTierVoteConfig.ts)                                                                                    | The current UI maps `chord` to Polyrhythm and `trill` to Offset.                                                       | The new Chords axis cannot silently reuse the existing `chord` values; Polyrhythm and simultaneous Chords must be separated. | Existing field names are historical and semantically misleading.                    |
| [SDVX.org: Effect Radar](https://www.sdvx.org/en/compendium/effect-radar)                                                                                            | A fixed multi-axis chart profile communicates how one rhythm-game chart concentrates different demands.                | Supports one stable five-axis community fingerprint for a selected chart.                                                    | SOUND VOLTEX axes and mechanics cannot be copied into NOSTALGIA.                    |
| [VOLTEXES: Effect Radar](https://voltexes.com/effect-radar/)                                                                                                         | Players use a radar shape to recognize a chart's overall tendency quickly.                                             | Supports preserving the familiar at-a-glance profile rather than replacing it with a bar-only summary.                       | This is a community explanation, not controlled usability research.                 |
| [Cloudy Boy: Effect Radar analysis](https://note.com/cloudy_boy/n/n458e55e6a91b)                                                                                     | Experienced rhythm-game players reason about charts through fixed axis definitions and the resulting shape.            | Requires stable order, shared criteria, and accessible definitions.                                                          | Expert commentary may not predict novice comprehension.                             |
| [DDR Groove Radar overview](https://en.wikipedia.org/wiki/Dance_Dance_Revolution#Groove_Radar)                                                                       | A five-axis radar has long been used to summarize chart characteristics alongside difficulty.                          | Provides a domain precedent for a pentagonal chart fingerprint.                                                              | The source is community maintained, and DDR's axes differ from NosLog's.            |
| [Rhythmic Footsteps: Training for the Groove Radar](https://rhythmickeystrokes.wordpress.com/2018/10/24/training-for-the-groove-radar/)                              | Players can learn to read a radar profile, but axis terminology needs explanation.                                     | Supports one shared criteria help entry and explicit localized axis names.                                                   | It is practitioner guidance rather than formal research.                            |
| [BeatLeader: Ratings on all maps](https://www.patreon.com/posts/ratings-on-all-85371694)                                                                             | A compact multi-dimensional shape is used to communicate different map skill demands.                                  | Reinforces the value of a single profile for map selection and expectation setting.                                          | Beat Saber skill dimensions are not NOSTALGIA pattern dimensions.                   |
| [IBM Research: Off the Radar](https://research.ibm.com/publications/off-the-radar-comparative-evaluation-of-radial-visualization-solutions-for-composite-indicators) | Radial displays can perform poorly when users must compare composite indicators precisely.                             | Restrict the radar to one chart fingerprint and pair it with exact structured values.                                        | Its comparison tasks are broader than recognizing one familiar rhythm-game profile. |
| [Applied Ergonomics: Radar-chart efficacy](https://www.sciencedirect.com/science/article/pii/S0003687023000340)                                                      | Accuracy falls when radar charts carry multiple overlapping data series.                                               | Show only the community average and reject a personal-profile overlay.                                                       | Experimental tasks and audiences are not identical to NosLog's.                     |
| [PubMed: Bar and line graph comprehension](https://pubmed.ncbi.nlm.nih.gov/26356929/)                                                                                | Position and length encodings support more exact quantitative comparison than shape alone.                             | Provide precise values and counts as structured text without duplicating the profile as another chart.                       | The study does not evaluate rhythm-game experts reading a familiar radar.           |
| [Tableau: Radar Chart extension](https://exchange.tableau.com/products/1010%3Adownload)                                                                              | Radar charts are intended for same-scale multivariate profiles and make balance or skew visible.                       | Fix every axis to the same `0–4` scale and order.                                                                            | Product documentation does not establish accessibility by itself.                   |
| [W3C: Complex images](https://www.w3.org/WAI/tutorials/images/complex/)                                                                                              | Complex charts require a textual alternative that communicates essential data and relationships.                       | Provide all five exact averages and valid counts in structured text.                                                         | Final alternative structure depends on the approved component specimen.             |
| [USWDS: Data visualizations](https://designsystem.digital.gov/components/data-visualizations/)                                                                       | A visualization should communicate one central idea and expose data accessibly.                                        | Use the radar only for pattern tendency; do not mix tier placement or perceived difficulty into it.                          | It does not endorse a specific radar implementation.                                |
| [UK Government Analysis Function: Charts checklist](https://analysisfunction.civilservice.gov.uk/policy-store/charts-a-checklist/)                                   | Clear labels, reduced clutter, and accessible alternatives are required for publishable charts.                        | Keep axis labels legible, avoid decorative duplication, and provide structured values.                                       | Public-statistics conventions still need adaptation for compact game data.          |
| [Highcharts: Tables and accessibility](https://www.highcharts.com/docs/accessibility/tables)                                                                         | A data table or accessible description can expose chart values, but must remain connected to the visual.               | Treat exact-value text as an equivalent representation associated with the radar, not unrelated metadata.                    | Library-specific implementation advice does not mandate Highcharts.                 |
| [NOSTALGIA wiki: Concertino in Blue](https://seesaawiki.jp/nstl/d/Concertino%20in%20Blue)                                                                            | Community chart analysis identifies dense multi-note simultaneous patterns as a central difficulty source.             | Supports Chords as a NOSTALGIA-relevant performance tendency.                                                                | It is a chart-specific community account, not a universal taxonomy.                 |
| [NOSTALGIA wiki: PLEASURE STREAM](https://seesaawiki.jp/nstl/d/PLEASURE%20STREAM)                                                                                    | Changes between two- and three-note simultaneous shapes are described as miss-inducing difficulty.                     | Supports rating span and shape changes rather than merely counting simultaneous notes.                                       | One chart cannot determine the complete axis definition.                            |
| [Gamerch: NOSTALGIA finger practice](https://gamerch.com/nostalgia/40691)                                                                                            | Simultaneous chords recur as a recognizable NOSTALGIA practice category.                                               | Confirms that players distinguish chord handling from stairs and repetition.                                                 | Community-maintained instructional content requires cautious generalization.        |
| [IPSJ Kansai 2024: NOSTALGIA chart-feature study](https://kansai.ipsj.or.jp/guide/pages/proceedings/2024IPSJkansai_proceeding/pdf/G-41.pdf)                          | Simultaneous-note count is modeled as a chart-difficulty feature.                                                      | Provides technical support for including simultaneous input while NosLog retains a broader qualitative burden definition.    | A computational feature count is not itself a user-facing community criterion.      |

### Tier-Placement History and State Evidence

| Source                                                                                                                                                                                          | Transferable finding                                                                                                                                    | NosLog application                                                                                            | Limitation                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [W3C APG: Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)                                                                                                             | One labelled control exposes one associated secondary region and communicates expanded state semantically.                                              | Requires one keyboard-operable history disclosure with `aria-expanded` and a controlled region.               | It defines semantics and interaction, not NosLog content hierarchy or styling.                          |
| [GOV.UK: Details](https://design-system.service.gov.uk/components/details/)                                                                                                                     | Details improve scanning when they contain information only some users need; they must not hide information most users need.                            | Keep six current placements visible and collapse only their secondary history.                                | GOV.UK notes discoverability concerns and its service styling is not a NosLog visual direction.         |
| [Apple: Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls)                                                                                 | Essential controls stay visible, advanced detail is hidden until relevant, and multiple disclosures in one view can add confusion.                      | Supports one section-level history control instead of six per-placement controls.                             | The one-control advice is platform-specific and is supporting evidence, not a universal web rule.       |
| [Microsoft: Progressive disclosure controls](https://learn.microsoft.com/en-us/windows/win32/uxguide/ctrl-progressive-disclosure-controls)                                                      | Expanded content must be collapsible and the inverse action must remain obvious.                                                                        | Requires persistent, reversible history state with a clear label and indicator.                               | The guide targets an older Windows environment; only the interaction principle transfers.               |
| [PatternFly: Expandable section](https://www.patternfly.org/components/expandable-section/design-guidelines)                                                                                    | Toggle text should describe the content that expansion reveals.                                                                                         | Use the descriptive localized **Tier placement history** label rather than a generic **More** control.        | PatternFly component geometry and enterprise styling are not implementation requirements.               |
| [GitHub: Repository activity](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/using-the-activity-view-to-see-changes-to-a-repository)                     | Change history is most useful as dated events that identify the exact activity and offer deeper comparison only on demand.                              | Model placement history as factual date-grouped transitions rather than a decorative trend graph.             | Repository events are more complex and actor-oriented than public tier changes.                         |
| [Figma: Version history](https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history)                                                                                   | A timeline groups saved checkpoints and uses an explicit **Show older** action for earlier history.                                                     | Supports newest-first initial events and explicit older-history continuation.                                 | Figma versions are restorable document snapshots, while NosLog history is read-only placement metadata. |
| [Linear: Assignment history](https://linear.app/docs/assigning-issues)                                                                                                                          | Field changes are recorded in one activity feed so users can understand what changed over time.                                                         | Keep six placement streams in one chronological feed while naming the affected mode and goal per event.       | Team-work attribution is irrelevant to the public NosLog presentation.                                  |
| [Notion: Page version history](https://www.notion.com/help/duplicate-delete-and-restore-content)                                                                                                | Current content remains primary while historical versions are accessed separately when needed.                                                          | Reinforces current placements first and secondary history on demand.                                          | Page restoration and subscription limits do not apply to NosLog.                                        |
| [Carbon: Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)                                                                                                           | No data, user-action results, permissions, configuration, and system errors require distinct meanings; compact spaces should minimize repeated content. | Distinguish Not listed, Not published, and load failure, and use short text-only states across six positions. | Carbon's action-oriented full empty states would be excessive for each compact placement slot.          |
| [Atlassian: Empty state](https://developer.atlassian.com/platform/forge/ui-kit/components/empty-state/)                                                                                         | Empty states briefly state what is absent and add an action only when a meaningful next step exists.                                                    | Avoid six repeated calls to action; offer one Retry only for a section-level failure.                         | Its Forge component props do not determine NosLog implementation.                                       |
| [Shopify Polaris: Empty state](https://polaris-react.shopify.com/components/layout-and-structure/empty-state)                                                                                   | Empty states belong where list, table, or chart data would appear, but the full component is not intended for every small subregion.                    | Use compact status values in placement cells and reserve a full error treatment for complete section failure. | Merchant onboarding goals differ from read-only rhythm-game reference data.                             |
| [Official NOSTALGIA Op.2: Entrance and play mode](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                                                                               | NOSTALGIA distinguishes Basic and Recital as separate performance modes.                                                                                | Preserve Basic and Recital as the primary grouping for all six placements and their history.                  | The official page does not define community tier lists or their history.                                |
| [Arcaea Wiki: Chart-constant change history](https://wikiwiki.jp/arcaea/%E8%AD%9C%E9%9D%A2%E5%AE%9A%E6%95%B0%E8%A1%A8/%E8%AD%9C%E9%9D%A2%E5%AE%9A%E6%95%B0%E5%A4%89%E6%9B%B4%E5%B1%A5%E6%AD%B4) | Rhythm-game players benefit from exact old and new chart values organized by version.                                                                   | Preserve exact transitions and effective dates rather than only an aggregate delta.                           | Its wide cross-version tables do not fit NosLog's mobile-first selected-chart context.                  |
| [osu!: Beatmap information](https://osu.ppy.sh/wiki/en/Beatmap_information)                                                                                                                     | Current difficulty facts and last-change context are attached to the selected difficulty without replacing its primary identity.                        | Supports selected-chart-scoped current values with history remaining subordinate.                             | osu!'s algorithmic star rating and mapping lifecycle differ from community tier placement.              |
| [NOSTALGIA community guide: Nosshirube](https://seesaawiki.jp/nstl/)                                                                                                                            | Community chart guidance uses detailed chart-level difficulty context to help players choose and understand songs.                                      | Confirms that chart-level tier context is useful while current readability must remain primary.               | It is community-maintained editorial evidence and does not prescribe interaction design.                |
| [Current public tier data loader](<../../app/(nevigation)/music/[index]/[difficulty]/data.ts>) and [current summary component](../../components/music/musicTierSummary.tsx)                     | The current product selects one recent published placement, filters null removal history, and renders one small line graph.                             | Records the precise legacy gaps that the six-position and unified-event contract must replace.                | Current code is audit evidence, not an approved visual or behavior baseline.                            |

The authoritative disclosure sources converge on keeping primary facts visible and
making secondary detail explicitly reversible. Production history products converge
on one chronological activity surface with older content loaded on demand. Empty-state
systems converge on distinguishing absence from failure and avoiding repeated heavy
treatments in small regions. Domain sources validate exact value transitions and the
Basic/Recital grouping but do not provide a mobile-ready public-history pattern. The
approved contract combines these transferable principles without copying any source's
surface design.

### Leaderboard, Table, and Pagination Guidance

| Source                                                                                                                                                                                        | Transferable finding                                                                                                                  | NosLog application                                                                                             | Limitation                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [W3C: Tables tutorial](https://www.w3.org/WAI/tutorials/tables/)                                                                                                                              | Related row and column data requires structural headers and associations, not visual alignment alone.                                 | Requires meaningful Rank, Player, and Result relationships at every width.                                     | It does not choose page size or visual density.                                                |
| [W3C: Table tips](https://www.w3.org/WAI/tutorials/tables/tips/)                                                                                                                              | Tables should remain simple, with clear headings and abbreviations explained in context.                                              | Supports the three-group mobile row and excluding unrelated profile fields.                                    | Responsive styling still requires product-specific testing.                                    |
| [USWDS: Table](https://designsystem.digital.gov/components/table/)                                                                                                                            | Numeric comparison benefits from consistent alignment, while stacked responsive rows still need labels.                               | Supports right-aligned tabular scores and persistent semantic labels on mobile.                                | Government transaction-table styling is not a NosLog visual direction.                         |
| [GOV.UK: Table](https://design-system.service.gov.uk/components/table/)                                                                                                                       | Tables should make row-column relationships clear and align numbers for comparison.                                                   | Supports one compact comparable leaderboard rather than unrelated card fields.                                 | It does not cover game achievements or current-player context.                                 |
| [Carbon: Data table](https://carbondesignsystem.com/components/data-table/usage/)                                                                                                             | Dense comparable records need clear hierarchy, predictable row structure, and deliberate loading or empty states.                     | Supports leaderboard-first hierarchy and stable row skeletons.                                                 | Carbon's toolbar-heavy enterprise patterns are unnecessary here.                               |
| [Atlassian: Dynamic table](https://atlassian.design/components/dynamic-table/)                                                                                                                | Paginated data retains column meaning and exposes a clear current page rather than becoming an endless feed.                          | Supports explicit selected-chart ranking pages and a stable comparison model.                                  | Atlassian's component API and styling are not implementation requirements.                     |
| [USWDS: Pagination](https://designsystem.digital.gov/components/pagination/)                                                                                                                  | Pagination should expose the current page, destination labels, and a predictable sequence.                                            | Supports explicit URL-backed pages and accessible page purpose.                                                | It does not recommend NosLog's exact page size.                                                |
| [GOV.UK: Pagination](https://design-system.service.gov.uk/components/pagination/)                                                                                                             | Page navigation needs descriptive link context and should preserve a meaningful destination after activation.                         | Supports returning focus and reading context to the ranking result region.                                     | Content-page examples are less dense than a leaderboard.                                       |
| [Carbon v10: Pagination](https://v10.carbondesignsystem.com/components/pagination/usage/)                                                                                                     | Pagination becomes useful after data exceeds the default visible range; common table increments include 10 and 25.                    | Supports a fixed 25-player increment and hiding the control for one page.                                      | Rows-per-page selection is useful in enterprise tables but rejected for this focused surface.  |
| [MUI: Table pagination](https://mui.com/material-ui/api/table-pagination/)                                                                                                                    | Production table pagination commonly offers increments such as 10, 25, 50, and 100.                                                   | Confirms 25 as a conventional balance rather than an arbitrary NosLog-only number.                             | Component defaults do not independently establish the final choice.                            |
| [Apple: Game Center](https://developer.apple.com/design/human-interface-guidelines/game-center)                                                                                               | Leaderboards should foreground comparable scores and a player's position without turning the surface into a full profile.             | Supports concise current-user context plus a public score list.                                                | Native-game presentation does not dictate web layout.                                          |
| [Apple: `GKLeaderboard.Range`](https://developer.apple.com/documentation/gamekit/gkleaderboard/range)                                                                                         | Game Center leaderboard requests use bounded ranges with a default length of 25 and a maximum of 100.                                 | Provides a production precedent for the approved 25-player page.                                               | API request capacity is not itself a UX rule.                                                  |
| [Google Play Games: `LeaderboardScores`](https://developers.google.com/resources/api-libraries/documentation/games/v1/java/latest/com/google/api/services/games/model/LeaderboardScores.html) | A leaderboard response distinguishes the current player's score from the surrounding public score collection and supports pagination. | Shows that current-user context and public rows can remain related without becoming one duplicate card system. | The API data shape does not prescribe when a duplicate row should be suppressed.               |
| [Steamworks: Leaderboards](https://partner.steamgames.com/doc/features/leaderboards?language=english)                                                                                         | Leaderboards support global ranges and ranges around a user while retaining one score entry per user.                                 | Supports exact user position and one best result per selected chart.                                           | Steam's download modes are implementation patterns, not NosLog navigation requirements.        |
| [osu!: Beatmap information](https://osu.ppy.sh/wiki/en/Beatmap_information)                                                                                                                   | Individual beatmaps expose a bounded top-score leaderboard within persistent beatmap and difficulty context.                          | Supports selected-chart ranking without repeating chart identity in every row.                                 | osu! commonly shows a top 50 rather than NosLog's approved 25.                                 |
| [SOUND VOLTEX: Battle ranking](https://p.eagate.573.jp/game/sdvx/vii/ranking/battle/index.html)                                                                                               | A BEMANI ranking surface prioritizes rank, player identity, and result across a comparatively long visible list.                      | Confirms that 10 rows would be unnecessarily short for expert comparison.                                      | This is a different NOSTALGIA-adjacent competition mode and must not define scoring semantics. |
| [ScoreSaber](https://scoresaber.com/)                                                                                                                                                         | Map-difficulty leaderboards keep the selected chart context stable while exposing comparable ranked results and player destinations.  | Reinforces chart-scoped leaderboard rows and profile links.                                                    | Beat Saber score fields and anti-cheat context differ from NosLog.                             |

Across these sources, the converging pattern is a compact comparison collection with
clear numeric alignment, bounded explicit navigation, stable selected-object context,
and a recoverable way to find the current user. Sources disagree on whether the
current user is duplicated outside the list and on exact page length. NosLog resolves
those differences with a conditional summary and a fixed 25-player page because they
fit its mobile-first repeated-checking context without sacrificing desktop comparison.

### NOSTALGIA Scoring and Tie Evidence

| Source                                                                                                                                                                                | Transferable finding                                                                                                                               | NosLog application                                                                                     | Limitation                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [NosLog `basicRating.ts`](../../lib/tiers/basicRating.ts)                                                                                                                             | The current rating policy starts at `950,000`, uses `10,000`-point anchors, and applies its strongest active weighting near `990,000` and Pianist. | Directly supports preserving the six focused high-skill buckets.                                       | It is NosLog policy evidence, not an official universal NOSTALGIA rule.             |
| [NOSTALGIA milestone analysis](https://tonevoadventcalendar.hatenablog.com/entry/2021/12/05/000004)                                                                                   | Experienced players discuss S, `990,000`, and Pianist as materially different progression milestones.                                              | Confirms that a broad S bucket would conceal useful upper-score separation.                            | It is practitioner analysis, not official product documentation.                    |
| [Game*Spark: NOSTALGIA scoring overview](https://www.gamespark.jp/article/2021/02/09/105955.html)                                                                                     | NOSTALGIA score ranks and high-score goals are distinct from merely completing a song.                                                             | Reinforces score-focused ranking and the need to respect domain-specific milestones.                   | Editorial coverage is secondary evidence and does not define NosLog buckets.        |
| [Gamerch: NOSTALGIA game details](https://gamerch.com/nostalgia/40489)                                                                                                                | The documented result rank treats `950,000–999,999` as S and `1,000,000` as Pianist.                                                               | Prevents the six analytical bands from being mislabeled as six official ranks.                         | Community-maintained documentation is not a current official rule page.             |
| [BEMANICN: NOSTALGIA overview](https://wiki.bemani.cc/index.php?title=NOSTALGIA%E6%A6%82%E5%86%B5)                                                                                    | The scoring table independently records the same S and Pianist boundaries and the judgement weights behind the score.                              | Confirms the broad official-grade boundary while preserving exact-score analysis.                      | It is an independent community wiki and not a NosLog data authority.                |
| [Game Catalog Wiki: NOSTALGIA](https://w.atwiki.jp/gcmatome/pages/7334.html)                                                                                                          | Clear status is less discriminating than score and perfect performance in this game.                                                               | Supports a high-score-focused secondary analysis rather than a clear-grade histogram.                  | It is retrospective community analysis, not a bucket specification.                 |
| [Moegirl: NOSTALGIA](https://moegirl.uk/index.php?title=Nostalgia%28%E6%B8%B8%E6%88%8F%29&variant=zh)                                                                                 | Its independent scoring summary also records S across `950,000–999,999`.                                                                           | Further checks the rank boundary across a different community corpus.                                  | It repeats system facts and does not establish player-language frequency.           |
| [Progression practice essay](https://note.com/f04_minesoroa/n/n5e6704d5974f)                                                                                                          | One experienced player uses average `980,000` on level-12 charts as a concrete example of advanced performance.                                    | Shows that `980k` can be a meaningful narrower progression context without making it an official rank. | It is one practitioner's example rather than a universal threshold.                 |
| [nosdata community course](https://nosdata.info/zeta/course_detail.php?course_id=11&id=nrna)                                                                                          | A community-authored course uses average `950,000`, `970,000`, and `990,000` as Silver, Gold, and Rainbow criteria.                                | Shows that `970k` can also be useful in a specific progression model.                                  | One custom course cannot define universal community milestones.                     |
| [Public NOSTALGIA player post indexed by Yahoo](https://search.yahoo.co.jp/realtime/search/%E8%BF%BD%E6%86%B6%20%E8%8B%B1%E9%9B%84/?p=%E8%BF%BD%E6%86%B6+%E8%8B%B1%E9%9B%84&ei=UTF-8) | A player celebrates a `980,000` update and explicitly considers the next target.                                                                   | Provides direct discourse evidence that intermediate upper-score goals are real.                       | A single transient public post is illustrative, not prevalence data.                |
| [Official 8th KAC NOSTALGIA results](https://p.eagate.573.jp/game/kac/kac8th/nostalgia/index.html)                                                                                    | Final-round chart scores include results in the `950k`, `960k`, `970k`, `980k`, and `990k` ranges.                                                 | Demonstrates that equal `10,000`-point bands retain separation even in elite play.                     | Tournament charts and players are not representative of the full NosLog population. |
| [Official 9th KAC NOSTALGIA](https://p.eagate.573.jp/game/kac/kac9th/nostalgia/index.html)                                                                                            | Official results span multiple upper `10,000`-point ranges, while competition rules also make chronological tie treatment explicit.                | Supports both retained score resolution and a deterministic tie rule.                                  | Tournament qualification rules are not automatically the public chart-ranking rule. |
| [NIST: Histogram](https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm)                                                                                                 | A conventional frequency histogram uses equal-sized bins; width-aware normalization is needed when widths differ.                                  | Supports retaining comparable `10,000`-point score intervals.                                          | Statistical guidance does not determine which NOSTALGIA range is product-relevant.  |
| [NIST: Software verification and validation reference](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication500-234.pdf)                                                 | Numerical bar charts with unequal intervals can mislead because area and frequency no longer align intuitively.                                    | Rejects a `950k–979k` count beside narrower `980k` and `990k` counts in the same distribution.         | General visualization guidance does not prescribe final chart geometry.             |
| [nosdata.info NOSTALGIA ranking](https://nosdata.info/zeta/ranking.php?code=aca2f96b4bedbdf1e59757002d93406c&diff=Real&mode=basic)                                                    | Equal scores are displayed with shared competition ranks such as `6, 6, 8`.                                                                        | Provides a direct NOSTALGIA-community precedent for `1, 2, 2, 4` semantics.                            | It is an independent community service and not a NosLog data authority.             |
| [MySQL: Window-function descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html)                                                                      | `RANK()` assigns equal values the same rank and leaves gaps after ties, unlike `ROW_NUMBER()`.                                                     | Precisely defines the approved competition-rank result.                                                | Database syntax and availability depend on the later implementation query.          |

The user's NOSTALGIA domain explanation is also primary product evidence for this
guide: upper-score differences remain meaningful even though the game does not assign
an official rank to every `10,000`-point interval. The guide therefore retains five
equal `10,000`-point analytical bands plus the terminal Pianist category, rejects both
the earlier broad grade histogram and an unequal `950k–979k` merged bucket, and avoids
claiming that every category is a universally named community milestone.

### Rhythm-Game and Data-Product Evidence

| Source                                                                                                                     | Transferable finding                                                                                                                                                | NosLog application                                                                                              | Limitation                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Official NOSTALGIA: How to play](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                          | A Music selection is followed by a Normal, Hard, Expert, or optional Real difficulty selection.                                                                     | Confirms Music-level identity with selected chart-level difficulty.                                             | It documents the arcade flow, not a web detail page.                                              |
| [Official NOSTALGIA: Play data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                         | Authenticated chart data prioritizes Best Score and its judgement details, then exposes cumulative performance count, Full Combo count, Perfect count, and history. | Supports Best performance first and confirms per-user chart Play count as distinct from clear count.            | Most detailed content requires login and cannot be fully audited anonymously.                     |
| [osu!: Beatmap information](https://osu.ppy.sh/wiki/en/Beatmap_information)                                                | Song/map identity stays visible; difficulty selection updates factual statistics; public play count and leaderboard data have distinct scopes.                      | Supports selected-chart facts and demonstrates that a play-count label must identify whose count it represents. | osu!'s public beatmap Play count is not the same as NosLog's per-user chart Play count.           |
| [osu!: Client interface](https://osu.ppy.sh/wiki/en/Client/Interface)                                                      | Result and leaderboard surfaces prioritize score, accuracy or judgements, Max Combo, rank, and explicit personal position.                                          | Reinforces a dominant Best performance followed by detailed or comparative record information.                  | osu! scoring and clear semantics differ from NOSTALGIA.                                           |
| [osu!: Ranking](https://osu.ppy.sh/wiki/en/Ranking)                                                                        | Individual beatmap ranking is presented in the beatmap context and highlights the current user's position separately.                                               | Supports owning score distribution and relative placement in Ranking rather than Chart Info.                    | It does not prescribe NosLog's ranking visualization.                                             |
| [osu!: Beatmap entity](https://osu.ppy.sh/wiki/en/Beatmap)                                                                 | A beatmapset and its individual difficulties have distinct identifiers; a selected difficulty is reflected in the URL.                                              | Supports a stable Music parent with shareable selected-chart state.                                             | Identifier syntax should not be copied.                                                           |
| [ScoreSaber Reloaded: Leaderboards](https://www.mintlify.com/RealFascinated/scoresaber-reloaded/features/leaderboards)     | A selected map difficulty has its own leaderboard and map-information context.                                                                                      | Supports chart-scoped ranking without loading every difficulty's ranking together.                              | This is third-party documentation around a community service, not an official universal standard. |
| [ScoreSaber Reloaded: Score tracking](https://www.mintlify.com/RealFascinated/scoresaber-reloaded/features/score-tracking) | Personal score detail and the full leaderboard are related but distinct destinations or views.                                                                      | Supports separating personal performance and ranking under one chart context.                                   | Its information model is Beat Saber-specific.                                                     |
| [BeatSaver: Map detail example](https://beatsaver.com/maps/50d1e)                                                          | Shared song/map identity can expose several difficulty targets without duplicating the entire entity.                                                               | Reinforces grouped Music identity and difficulty-level actions.                                                 | The page is map-publication oriented and does not contain NosLog personal analytics.              |
| [Arcaea Wiki: Songs by level](https://arcaea.fandom.com/wiki/Songs_by_Level)                                               | Difficulty, chart constant, level, and version are chart-level properties that benefit from explicit association.                                                   | Supports keeping selected chart facts distinct from Music-level title and artist.                               | It is a community-maintained dense catalog, not a detail-page interaction standard.               |

### Operational and Cost Evidence

| Source                                                                                    | Transferable finding                                                           | NosLog application                                                                            | Limitation                                                                                       |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Vercel: Function usage and pricing](https://vercel.com/docs/functions/usage-and-pricing) | Function invocations, active CPU, and provisioned memory are usage dimensions. | Avoid requiring cross-domain server work before the user selects the relevant content area.   | Included allowances and production traffic determine whether extra work changes the actual bill. |
| [Neon: Pricing](https://neon.com/pricing)                                                 | Database compute is usage-based and affected by active workload.               | Unnecessary aggregate reads can increase compute demand at scale.                             | No exact NosLog cost can be inferred without production measurements.                            |
| [Neon: Network transfer](https://neon.com/docs/introduction/network-transfer)             | Database egress is a monitored usage dimension.                                | Avoid transferring summary data that the user did not request unless measurements justify it. | Caching and query shape can substantially change the impact.                                     |

The comparison contains more than fifteen independent sources across authoritative
guidance, domain behavior, production analogues, and current infrastructure. The
strongest exact analogue is osu!'s selected-difficulty information page. Secondary
community sources are used only to test whether that pattern recurs; they do not
override authoritative guidance or NosLog requirements.

## Rejected Alternatives

- **Pattern B — One long page containing every area:** Rejected. The four areas are
  substantial, have different authentication and data states, and are not a required
  linear reading sequence.
- **Pattern C — Cross-domain summary hub before detailed views:** Rejected for Music
  detail. It adds an overview layer and additional information density to a page whose
  user already selected a Music entry and usually has a specific follow-up task. It
  would also require either multiple initial requests, one aggregate request backed by
  several domain reads, or a separately maintained summary cache.
- **Treat current UI as the visual baseline:** Rejected. Structural continuity does
  not approve the current fixed-width shell, typography, spacing, card density, or tab
  styling.
- **Put View chart inside Chart information:** Rejected. The viewer is a direct
  chart-level action and should not require opening an informational panel first.
- **Reserve a disabled View chart button when unavailable:** Rejected. Use concise
  availability text instead of preserving an unusable primary control.
- **Use different queryless defaults for signed-in and signed-out users:** Rejected.
  The same URL would open different content according to hidden authentication state,
  weakening predictability and shared-link meaning.
- **Remember the last-used area globally:** Rejected. A prior visit to another Music
  entry must not silently override the public default or a known source intent.
- **Hide or disable personal Record while signed out:** Rejected. The area is a core
  product capability with a clear recovery action and must remain discoverable.
- **Overlay Login on placeholder record analytics:** Rejected. It implies inaccessible
  data exists behind the gate and adds visual noise without helping task recovery.
- **Return to Home after Record Login:** Rejected. Authentication must restore the
  selected Music, difficulty, and Record area through a validated return path.
- **Keep pattern profile and score distribution inside Chart Info:** Rejected. Those
  values belong to Tier/evaluation and Ranking respectively and would turn the public
  default back into a cross-domain preview hub.
- **Preserve unavailable optional facts as `-` rows:** Rejected. Release date and
  unlock condition appear only when a meaningful value exists.
- **Show the same pattern values as both radar and bar charts:** Rejected. Use the
  approved five-axis radar as the sole chart and pair it with exact structured values
  and valid counts.
- **Replace the pattern profile with bars only:** Rejected. Exact comparison remains
  available in structured text, while the radar preserves the domain-familiar
  at-a-glance chart fingerprint.
- **Keep Glissando as the fifth community profile axis:** Rejected. Use Chords because
  simultaneous-input burden is a recurring NOSTALGIA pattern demand; keep Glissando
  in note-type and personal Judgement analysis instead.
- **Overlay the current user's profile on the community radar:** Rejected. Multiple
  overlapping series reduce legibility and change the question from one community
  fingerprint to a comparison task.
- **Use clear count as a Music-detail performance summary:** Rejected. Keep per-user,
  per-chart Play count, but do not imply that NOSTALGIA clear count differentiates a
  meaningful outcome for this purpose.
- **Always show a complete current-user card above Ranking:** Rejected. Suppress the
  separate summary when the current user's highlighted row is already on the page;
  otherwise use one compact summary line.
- **Use relative top percentage as the main current-user position:** Rejected. Show
  exact shared rank and total participant count without ambiguous percentile rounding.
- **Force a unique rank for equal scores with user ID:** Rejected. Equal scores share
  competition rank; achievement time affects only order inside the tied group, and a
  stable ID is only the final invisible ordering key.
- **Replace the focused score bands with broad Pianist/S/A+/A/B+/B/C/D grades:**
  Superseded and rejected. The proposal misunderstood NOSTALGIA's upper-score skill
  separation and would hide meaningful `950k–Pianist` progression.
- **Add a below-950k distribution bucket:** Rejected. The visualization is explicitly
  an S-or-higher analysis with its own denominator; the separate participant count
  still covers all positive-score players.
- **Keep seven or reduce to ten players per page:** Rejected. Use a fixed 25-player
  page and hide pagination when the complete list fits on one page.
- **Add a rows-per-page selector or infinite scroll:** Rejected. Both add control or
  navigation complexity to a focused leaderboard whose approved page length is
  stable.
- **Expose public Unhelpful or dislike counts on opinions:** Rejected. Use one
  reversible Helpful signal for useful chart advice and keep policy reporting as a
  separate mechanism.
- **Repeat every evaluator's five pattern-axis values in the opinion list:** Rejected.
  Keep the perceived-difficulty value prominent and let the aggregate radar own
  pattern comparison.
- **Add nested replies or pinned opinions:** Rejected for the selected-chart
  evaluation contract. Do not turn practical evaluation notes into a second forum.
- **Make Delete opinion remove the complete evaluation:** Rejected. Optional written
  text and aggregate-contributing evaluation values require separate, explicitly
  labelled deletion scopes.
- **Automatically hide an opinion globally after one report:** Rejected. A report
  creates review work; it does not itself prove a violation.
- **Use infinite scroll, Oldest sorting, or page-size controls for opinions:**
  Rejected. Use Helpful/Newest and explicit ten-item continuation.
- **Treat the approval mock-up as final visual design:** Rejected. It demonstrated
  content and behavior only; foundations and representative specimens will determine
  typography, color, spacing, and component geometry.
- **Put one placement-history disclosure or mini chart in every tier position:**
  Rejected. Six controls fragment one chronological story, repeat interaction cost,
  and compete with the current six-position comparison.
- **Keep a permanent placement-history line chart:** Rejected. Addition, removal,
  unpublished lists, and six independent mode-and-goal streams are categorical events
  that a compact line chart cannot communicate accurately.
- **Hide current placements inside the history control:** Rejected. Current placement
  is the primary fact and history is optional secondary evidence.

## Open Decisions for the Next Discussion

The following decisions have not been approved:

1. mobile tab overflow or alternative compact control behavior;
2. desktop use of additional width inside each selected area;
3. representative real, long, missing, and multilingual data cases;
4. detailed arrow-key behavior, full-route entry focus, page acceptance criteria, and
   browser-verification widths; and
5. exact order, placement, copy, and responsive behavior of the approved
   selected-chart resource action group.

## Decision Register

| ID      | Decision                                             | Direction                                                                                                                                                    | Status     |
| ------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| MDET-01 | Entity model                                         | Keep Music identity stable and treat the selected difficulty as active chart context                                                                         | `Approved` |
| MDET-02 | Difficulty state                                     | Preserve the selected difficulty in shareable and history-restorable navigation state                                                                        | `Approved` |
| MDET-03 | Viewer entry                                         | Keep View chart as a direct selected-chart action outside the Information panel, with external fallback or concise unavailable text                          | `Approved` |
| MDET-04 | Content architecture                                 | Use Pattern A: one persistent context with four tabbed semantic areas and one selected panel at a time                                                       | `Approved` |
| MDET-05 | Initial data boundary                                | Do not require every cross-domain detail or summary before the user selects its area; reuse valid visited-area data                                          | `Approved` |
| MDET-06 | Long-page architecture                               | Do not render all four complete areas as one long page                                                                                                       | `Rejected` |
| MDET-07 | Overview-hub architecture                            | Do not add a cross-domain summary hub before the four detailed areas                                                                                         | `Rejected` |
| MDET-08 | Current visual inheritance                           | Current visual execution is audit evidence only and must not constrain the 2.0 redesign                                                                      | `Rejected` |
| MDET-09 | Semantic content-area order                          | Information, personal Record, Ranking, then Tier/community evaluation                                                                                        | `Approved` |
| MDET-10 | Responsive and visual composition                    | Define later through approved foundation and representative mobile/desktop specimens                                                                         | `Open`     |
| MDET-11 | Remaining content, state, and accessibility contract | Continue the page-brief research and approval process for unresolved areas                                                                                   | `Open`     |
| MDET-12 | Localized area labels                                | Use `랭킹`/`ランキング`/`Ranking` and `서열·평가`/`難易度・評価`/`Tier & Evaluation` without changing the approved semantic order                            | `Approved` |
| MDET-13 | General-entry default                                | Open Information for both signed-in and signed-out queryless entry                                                                                           | `Approved` |
| MDET-14 | Source-aware entry                                   | Encode known Record, Ranking, Tier/evaluation, and viewer-return intent in restorable navigation state                                                       | `Approved` |
| MDET-15 | Signed-out Record                                    | Keep it visible and selectable; render a compact panel-level Login state without placeholder analytics or automatic authentication                           | `Approved` |
| MDET-16 | Authentication restoration                           | Preserve locale, Music, difficulty, and Record through Login and required onboarding, then restore the exact destination                                     | `Approved` |
| MDET-17 | Hidden default memory                                | Do not vary queryless default by authentication or globally remember the last-used area                                                                      | `Rejected` |
| MDET-18 | Chart Info and My Record labels                      | Use `채보 정보`/`譜面情報`/`Chart Info` and `내 기록`/`プレー記録`/`My Record`                                                                               | `Approved` |
| MDET-19 | Chart Info factual scope                             | Always show BPM, note count, and duration; conditionally show available release and unlock facts without duplicating persistent context                      | `Approved` |
| MDET-20 | Cross-domain data ownership                          | Move pattern profile to Tier/evaluation and score distribution, player count, and relative placement to Ranking; leave no previews in Chart Info             | `Approved` |
| MDET-21 | Selected-chart resource actions                      | Keep View chart, Play video, and approved external chart resources outside Chart Info as selected-chart actions                                              | `Approved` |
| MDET-22 | Personal Record hierarchy                            | Order Best performance, cumulative summary, Progress over time, Recent plays, then collapsed Judgement analysis                                              | `Approved` |
| MDET-23 | Progress terminology                                 | Use `성장 추이`/`上達の推移`/`Progress over time`, while explicitly labeling the current series `베스트 스코어`/`ベストスコア`/`Best score`                  | `Approved` |
| MDET-24 | Play-count meaning                                   | Preserve per-user, per-chart `플레이 횟수`/`演奏回数`/`Play count`; exclude clear count and defer profile-wide Play count to the Profile brief               | `Approved` |
| MDET-25 | Advanced record disclosure                           | Keep peer comparison optional and off by default; keep Judgement analysis collapsed while primary record facts remain visible                                | `Approved` |
| MDET-26 | Duplicate pattern visualization                      | Do not show identical pattern values simultaneously as radar and bar charts; use one accessible five-axis radar plus exact structured values                 | `Rejected` |
| MDET-27 | Ranking hierarchy                                    | On mobile order conditional current-user context, participant heading, leaderboard, pagination, then secondary score distribution                            | `Approved` |
| MDET-28 | Conditional current-user placement                   | Highlight the in-page row; otherwise show one compact exact-rank summary, with concise no-record and signed-out variants                                     | `Approved` |
| MDET-29 | Relative percentile                                  | Remove top-percent ranking copy and use exact shared rank over total participants                                                                            | `Rejected` |
| MDET-30 | Leaderboard row model                                | Show one best score per player using Rank, Player, and Result groups; retain profile links and exclude unrelated row fields                                  | `Approved` |
| MDET-31 | Tie semantics                                        | Equal scores share competition rank `1, 2, 2, 4`; earlier achievement orders ties without changing rank                                                      | `Approved` |
| MDET-32 | High-skill score distribution                        | Preserve five equal `950k`–`990k` analytical bands plus Pianist with a separate S-or-higher denominator; reconfirmed 2026-08-01                              | `Approved` |
| MDET-33 | Broad or unequal score grouping                      | Do not replace the upper score bands with a whole-population Pianist/S/A+/A/B+/B/C/D histogram or an unequal `950k–979k` merged count                        | `Rejected` |
| MDET-34 | Ranking pagination                                   | Use 25 players per page, hide one-page pagination, preserve page in URL/history, and reject infinite scroll or a page-size selector                          | `Approved` |
| MDET-35 | Ranking states and accessibility                     | Define stable loading geometry, concise retry and empty states, semantic labels, localized alternatives, focus restoration, and announcements                | `Approved` |
| MDET-36 | Ranking responsive composition                       | Preserve mobile reading order; allow a leaderboard-primary and distribution-secondary desktop composition without a fixed 390px canvas                       | `Approved` |
| MDET-37 | Tier/evaluation hierarchy                            | Order six tier placements, perceived difficulty, pattern radar, evaluation action or form, then community opinions                                           | `Approved` |
| MDET-38 | Tier-placement scope                                 | Show Basic and Recital S, Full Combo, and Pianist placements together without a preliminary selector                                                         | `Approved` |
| MDET-39 | Community aggregate threshold                        | Always show rating count; publish perceived-difficulty average and distribution from three valid ratings, otherwise show Aggregating                         | `Approved` |
| MDET-40 | Pattern-profile visualization                        | Use one fixed-order, fixed-scale five-axis community radar, one series only, with exact values and counts as structured accessible text                      | `Approved` |
| MDET-41 | Pattern-profile taxonomy                             | Use Stairs, Repetition, Polyrhythm, Offset, and Chords; retain Glissando outside the community radar                                                         | `Approved` |
| MDET-42 | Evaluation input and eligibility                     | Require verified selected-chart play and perceived difficulty; make pattern axes and comment optional, nullable, editable, and deletable                     | `Approved` |
| MDET-43 | Opinion information hierarchy                        | Show author, prominent perceived difficulty, opinion, time/edit state, Helpful, and contextual actions without approving the mock-up's visuals               | `Approved` |
| MDET-44 | Opinion reaction and eligibility                     | Use one reversible Helpful reaction; no public negative count, self-reaction, or reaction without verified selected-chart play                               | `Approved` |
| MDET-45 | Opinion sorting and continuation                     | Default to Helpful, offer Newest, use deterministic recency ties, and append explicit batches of ten without infinite scroll                                 | `Approved` |
| MDET-46 | Opinion and evaluation deletion                      | Delete optional written opinion separately from destructive deletion of the entire evaluation, with consequence-specific confirmations                       | `Approved` |
| MDET-47 | Opinion reporting                                    | Put Report in the contextual menu and collect one relevant safety or spam reason without instant public auto-hide                                            | `Approved` |
| MDET-48 | Opinion moderation                                   | Let administrators Keep, Hide written opinion, or Exclude entire evaluation while retaining an audit record                                                  | `Approved` |
| MDET-49 | Opinion visual authority                             | Treat the discussion mock-up as behavioral evidence only; defer exact type, color, spacing, surfaces, and geometry to foundations and specimens              | `Approved` |
| MDET-50 | Placement-state semantics                            | Keep six positions and distinguish numeric placement, Not listed, Not published, loading, and load failure with approved Korean/Japanese/English copy        | `Approved` |
| MDET-51 | Placement-history disclosure                         | Keep current placements visible and use one collapsed section-level chronological history after Basic and Recital; reject six controls and line charts       | `Approved` |
| MDET-52 | Placement-history continuation                       | Open with five newest date-grouped events and append explicit batches of ten with Show older changes; use No placement history when no event exists          | `Approved` |
| MDET-53 | Placement-history data contract                      | Materialize six semantic slots, preserve null removal events, reconstruct transitions per mode and goal, and keep absence, publication, and failure distinct | `Approved` |
| MDET-54 | Target transition identity                           | Update the selected difficulty or area and its restorable URL immediately; replace the preceding semantic panel with the exact target's pending state        | `Approved` |
| MDET-55 | Loading scope and geometry                           | Preserve stable context, mark only the target region busy, avoid animated loader flash below about 300 ms, and use simplified structure-matched skeletons    | `Approved` |
| MDET-56 | Cache freshness and revalidation                     | Keep Chart Info fresh for the page session; use 60-second freshness for Record, Ranking, and Tier/evaluation, with exact-target background revalidation      | `Approved` |
| MDET-57 | Mutation invalidation and stale failure              | Immediately invalidate affected targets after data changes; retain exact cached data with Updating or latest-data failure disclosure and Retry               | `Approved` |
| MDET-58 | Empty, authentication, and permission semantics      | Keep empty distinct from failure and permission; preserve public content while replacing only restricted personal or action regions                          | `Approved` |
| MDET-59 | Retry and failure scope                              | Retry network and `5xx` GET failures once automatically, then show the smallest meaningful failure and exact manual Retry; never auto-retry `4xx` or actions | `Approved` |
| MDET-60 | Interruptible navigation                             | Keep valid navigation operable, cancel or supersede obsolete work, deduplicate exact requests, and commit only the latest target                             | `Approved` |
| MDET-61 | Focus and status announcements                       | Retain focus on the activated control, expose correct tab semantics, mark updating regions busy, and use one concise polite target-specific status region    | `Approved` |
| MDET-62 | Initial failure and Not Found                        | Preserve the application shell for initial load failure with exact Retry and Music-search return; use localized Not Found for confirmed missing entities     | `Approved` |

## Current Milestone

The user approved the entity model, direct chart-viewer action, Pattern A content
architecture, public Chart Info default, source-aware explicit entry, recoverable
signed-out Record behavior, Chart Info boundary, selected-chart resource grouping,
the Personal Record hierarchy, the selected-chart Ranking contract, and the core
Tier & Evaluation contract across 2026-07-31 and 2026-08-01.
Chart Info and My Record now have approved Korean, Japanese, and English labels.
Chart-scoped Play count remains in the cumulative summary, while profile-wide Play
count is explicitly deferred to the Profile brief. Ranking now has an approved
hierarchy, conditional current-user treatment, three-group row model, competition-rank
tie semantics, focused high-skill score distribution, 25-player pagination, responsive
relationship, and core state and accessibility behavior.
The five equal upper-score bands plus terminal Pianist category were explicitly
reconfirmed after broad domain, community, competition, and visualization review;
they are analytical categories rather than six official or universally named
milestones.

Tier & Evaluation now has approved localized labels, a mobile information hierarchy,
all six Basic/Recital placements, a three-rating publication threshold, and a
single-series community radar. Its fixed axes are Stairs, Repetition, Polyrhythm,
Offset, and Chords. Glissando remains a note type and personal Judgement metric but is
not a community radar axis. Evaluation requires a verified selected-chart play and a
perceived-difficulty rating; pattern axes and comment are optional and must preserve
missing values distinctly from a valid zero rating.

The six tier positions now also have approved current-state semantics and localized
copy for numeric placement, Not listed, Not published, loading, and failure. One
collapsed Tier placement history disclosure follows both placement groups, opens with
five newest date-grouped transitions, and appends older events in batches of ten. A
removal remains Not listed in the current position and appears as Removed from tier in
history. The public data contract must preserve null-valued removal events and expose
six explicit mode-and-goal slots rather than one recent placement.

Community opinions now have an approved information and interaction contract. Each
row keeps perceived difficulty prominent, shows concise author and time context, and
offers one Helpful signal. Helpful and Newest are the only sorts; the list starts with
ten rows and appends explicit batches of ten. Opinion-only deletion, entire-evaluation
deletion, reporting, and the administrator's Keep/Hide text/Exclude evaluation results
are separate operations with explicit consequences. The approval mock-up is not a
visual design source; exact emphasis is deferred to the foundation and representative
specimen phase.

The page now also has one approved asynchronous state and recovery contract. A target
difficulty or area becomes the explicit URL-addressed context immediately; stable
Music context remains available while only the target panel becomes busy. Fresh exact
targets appear immediately, Chart Info remains fresh for the page session, and Record,
Ranking, and Tier/evaluation use a 60-second freshness interval with non-blocking
revalidation. Data-changing actions invalidate affected targets immediately. Empty,
authentication, eligibility, permission, stale-refresh failure, uncached failure, and
Not Found retain distinct meanings. Network and `5xx` GET failures receive one
automatic retry before exact manual Retry. Navigation remains interruptible, focus
stays on the activated control, and one polite status region announces coherent
target-specific progress without exposing each intermediate skeleton change.

This establishes the entry, authentication-restoration, Chart Info, Personal Record,
Ranking, and Tier & Evaluation content contracts, including community opinions and
shared asynchronous states. It does not approve the current page's visual design or
complete the Music-detail page brief. The next discussion should resolve mobile tab
overflow and responsive composition before representative data, complete page-level
acceptance criteria, and the selected-chart resource-action placement are finalized.
