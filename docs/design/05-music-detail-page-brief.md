# NosLog 2.0 Music Detail Page Brief

## Document Control

- Status: `In progress`
- Decision status: `Structure, entry priority, source-aware restoration, signed-out
Record behavior, Chart Info scope, personal-record hierarchy, Ranking hierarchy,
leaderboard semantics, tie handling, score distribution, pagination, and Ranking
states approved; Tier/evaluation, remaining state, responsive, and accessibility
decisions remain open`
- Evidence status: `Repository inspection, current-product audit, approved information
architecture, approved shared-discovery handoff, and cited tabs, adaptive-layout,
progressive-disclosure, leaderboard, pagination, data-visualization, NOSTALGIA
scoring, rhythm-game, and infrastructure guidance`
- Date started: 2026-07-31
- Last decision update: 2026-07-31
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
- The localized Chart Info and My Record labels are approved below. Ranking and
  Tier/evaluation wording, tab geometry, and responsive overflow behavior remain open.
  Approval covers the architecture, not the current tab design.

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
- This approval establishes semantic order. The localized Chart Info and My Record
  labels are now approved below; Ranking and Tier/evaluation wording remains open.
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
- Exact focus placement, live announcements, loading behavior, and mobile overflow
  remain open and require a later approved interaction contract.

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
- Final Ranking and Tier/evaluation labels remain open until those area contracts are
  approved.

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
  bar charts. The later Tier/evaluation brief must select one primary representation,
  expose exact values and vote count, and document its accessibility alternative.
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
whole-population score-grade histogram. NOSTALGIA performance separation becomes much
more meaningful across the upper score milestones, so preserve these buckets:

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
- Exact chart geometry, color, and compact desktop placement remain Foundation and
  representative-specimen decisions. The bucket meaning and denominator contract do
  not.

The approved bands are supported both by NOSTALGIA milestone behavior and NosLog's
current rating policy: its score floor is `950,000`, its anchors advance in `10,000`
steps through `1,000,000`, and its active mastery curve weights `990,000` and Pianist
performance most strongly. This local product evidence corrects the previously
proposed broad grade distribution.

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

| Source                                                                                                                             | Transferable finding                                                                                                                               | NosLog application                                                                        | Limitation                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [NosLog `basicRating.ts`](../../lib/tiers/basicRating.ts)                                                                          | The current rating policy starts at `950,000`, uses `10,000`-point anchors, and applies its strongest active weighting near `990,000` and Pianist. | Directly supports preserving the six focused high-skill buckets.                          | It is NosLog policy evidence, not an official universal NOSTALGIA rule.             |
| [NOSTALGIA milestone analysis](https://tonevoadventcalendar.hatenablog.com/entry/2021/12/05/000004)                                | Experienced players discuss S, `990,000`, and Pianist as materially different progression milestones.                                              | Confirms that a broad S bucket would conceal useful upper-score separation.               | It is practitioner analysis, not official product documentation.                    |
| [Game*Spark: NOSTALGIA scoring overview](https://www.gamespark.jp/article/2021/02/09/105955.html)                                  | NOSTALGIA score ranks and high-score goals are distinct from merely completing a song.                                                             | Reinforces score-focused ranking and the need to respect domain-specific milestones.      | Editorial coverage is secondary evidence and does not define NosLog buckets.        |
| [Official KAC NOSTALGIA](https://p.eagate.573.jp/game/kac/kac9th/nostalgia/index.html)                                             | Official competition treatment makes score and chronological performance rules explicit when they determine advancement.                           | Supports documenting a deterministic tie rule rather than silently using user ID as rank. | Tournament qualification rules are not automatically the public chart-ranking rule. |
| [nosdata.info NOSTALGIA ranking](https://nosdata.info/zeta/ranking.php?code=aca2f96b4bedbdf1e59757002d93406c&diff=Real&mode=basic) | Equal scores are displayed with shared competition ranks such as `6, 6, 8`.                                                                        | Provides a direct NOSTALGIA-community precedent for `1, 2, 2, 4` semantics.               | It is an independent community service and not a NosLog data authority.             |
| [MySQL: Window-function descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html)                   | `RANK()` assigns equal values the same rank and leaves gaps after ties, unlike `ROW_NUMBER()`.                                                     | Precisely defines the approved competition-rank result.                                   | Database syntax and availability depend on the later implementation query.          |

The user's NOSTALGIA domain explanation is also primary product evidence for this
guide: reaching approximately `950,000` does not separate expert performance as much
as the successive `960k`, `970k`, `980k`, `990k`, and Pianist milestones. The guide
therefore rejects the earlier broad grade-histogram proposal instead of treating a
generic visualization convention as more authoritative than the game being modeled.

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
- **Show the same pattern values as both radar and bar charts:** Rejected. The owning
  Tier/evaluation area will select one primary representation and preserve exact
  values and an accessible alternative.
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

## Open Decisions for the Next Discussion

The following decisions have not been approved:

1. final Korean, Japanese, and English labels for Ranking and Tier/evaluation;
2. exact information priority and progressive disclosure inside Tier/evaluation;
3. switching, loading, stale-data, empty, permission, error, and retry behavior beyond
   the approved signed-out Record and Ranking contracts;
4. mobile tab overflow or alternative compact control behavior;
5. desktop use of additional width inside each selected area;
6. keyboard focus transfer and announcements after difficulty or content-area changes;
7. representative real, long, missing, and multilingual data cases;
8. page acceptance criteria and browser-verification widths; and
9. exact order, placement, copy, and responsive behavior of the approved
   selected-chart resource action group.

## Decision Register

| ID      | Decision                                             | Direction                                                                                                                                        | Status     |
| ------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| MDET-01 | Entity model                                         | Keep Music identity stable and treat the selected difficulty as active chart context                                                             | `Approved` |
| MDET-02 | Difficulty state                                     | Preserve the selected difficulty in shareable and history-restorable navigation state                                                            | `Approved` |
| MDET-03 | Viewer entry                                         | Keep View chart as a direct selected-chart action outside the Information panel, with external fallback or concise unavailable text              | `Approved` |
| MDET-04 | Content architecture                                 | Use Pattern A: one persistent context with four tabbed semantic areas and one selected panel at a time                                           | `Approved` |
| MDET-05 | Initial data boundary                                | Do not require every cross-domain detail or summary before the user selects its area; reuse valid visited-area data                              | `Approved` |
| MDET-06 | Long-page architecture                               | Do not render all four complete areas as one long page                                                                                           | `Rejected` |
| MDET-07 | Overview-hub architecture                            | Do not add a cross-domain summary hub before the four detailed areas                                                                             | `Rejected` |
| MDET-08 | Current visual inheritance                           | Current visual execution is audit evidence only and must not constrain the 2.0 redesign                                                          | `Rejected` |
| MDET-09 | Semantic content-area order                          | Information, personal Record, Ranking, then Tier/community evaluation                                                                            | `Approved` |
| MDET-10 | Responsive and visual composition                    | Define later through approved foundation and representative mobile/desktop specimens                                                             | `Open`     |
| MDET-11 | Remaining content, state, and accessibility contract | Continue the page-brief research and approval process for unresolved areas                                                                       | `Open`     |
| MDET-12 | Remaining localized area labels                      | Define Korean, Japanese, and English wording for Ranking and Tier/evaluation without changing the approved semantic order                        | `Open`     |
| MDET-13 | General-entry default                                | Open Information for both signed-in and signed-out queryless entry                                                                               | `Approved` |
| MDET-14 | Source-aware entry                                   | Encode known Record, Ranking, Tier/evaluation, and viewer-return intent in restorable navigation state                                           | `Approved` |
| MDET-15 | Signed-out Record                                    | Keep it visible and selectable; render a compact panel-level Login state without placeholder analytics or automatic authentication               | `Approved` |
| MDET-16 | Authentication restoration                           | Preserve locale, Music, difficulty, and Record through Login and required onboarding, then restore the exact destination                         | `Approved` |
| MDET-17 | Hidden default memory                                | Do not vary queryless default by authentication or globally remember the last-used area                                                          | `Rejected` |
| MDET-18 | Chart Info and My Record labels                      | Use `채보 정보`/`譜面情報`/`Chart Info` and `내 기록`/`プレー記録`/`My Record`                                                                   | `Approved` |
| MDET-19 | Chart Info factual scope                             | Always show BPM, note count, and duration; conditionally show available release and unlock facts without duplicating persistent context          | `Approved` |
| MDET-20 | Cross-domain data ownership                          | Move pattern profile to Tier/evaluation and score distribution, player count, and relative placement to Ranking; leave no previews in Chart Info | `Approved` |
| MDET-21 | Selected-chart resource actions                      | Keep View chart, Play video, and approved external chart resources outside Chart Info as selected-chart actions                                  | `Approved` |
| MDET-22 | Personal Record hierarchy                            | Order Best performance, cumulative summary, Progress over time, Recent plays, then collapsed Judgement analysis                                  | `Approved` |
| MDET-23 | Progress terminology                                 | Use `성장 추이`/`上達の推移`/`Progress over time`, while explicitly labeling the current series `베스트 스코어`/`ベストスコア`/`Best score`      | `Approved` |
| MDET-24 | Play-count meaning                                   | Preserve per-user, per-chart `플레이 횟수`/`演奏回数`/`Play count`; exclude clear count and defer profile-wide Play count to the Profile brief   | `Approved` |
| MDET-25 | Advanced record disclosure                           | Keep peer comparison optional and off by default; keep Judgement analysis collapsed while primary record facts remain visible                    | `Approved` |
| MDET-26 | Duplicate pattern visualization                      | Do not show identical pattern values simultaneously as radar and bar charts; choose one accessible representation in Tier/evaluation             | `Rejected` |
| MDET-27 | Ranking hierarchy                                    | On mobile order conditional current-user context, participant heading, leaderboard, pagination, then secondary score distribution                | `Approved` |
| MDET-28 | Conditional current-user placement                   | Highlight the in-page row; otherwise show one compact exact-rank summary, with concise no-record and signed-out variants                         | `Approved` |
| MDET-29 | Relative percentile                                  | Remove top-percent ranking copy and use exact shared rank over total participants                                                                | `Rejected` |
| MDET-30 | Leaderboard row model                                | Show one best score per player using Rank, Player, and Result groups; retain profile links and exclude unrelated row fields                      | `Approved` |
| MDET-31 | Tie semantics                                        | Equal scores share competition rank `1, 2, 2, 4`; earlier achievement orders ties without changing rank                                          | `Approved` |
| MDET-32 | High-skill score distribution                        | Preserve `950k`, `960k`, `970k`, `980k`, `990k`, and Pianist bands with a separate S-or-higher denominator                                       | `Approved` |
| MDET-33 | Broad grade distribution                             | Do not replace upper score milestones with one whole-population Pianist/S/A+/A/B+/B/C/D histogram                                                | `Rejected` |
| MDET-34 | Ranking pagination                                   | Use 25 players per page, hide one-page pagination, preserve page in URL/history, and reject infinite scroll or a page-size selector              | `Approved` |
| MDET-35 | Ranking states and accessibility                     | Define stable loading geometry, concise retry and empty states, semantic labels, localized alternatives, focus restoration, and announcements    | `Approved` |
| MDET-36 | Ranking responsive composition                       | Preserve mobile reading order; allow a leaderboard-primary and distribution-secondary desktop composition without a fixed 390px canvas           | `Approved` |

## Current Milestone

The user approved the entity model, direct chart-viewer action, Pattern A content
architecture, public Chart Info default, source-aware explicit entry, recoverable
signed-out Record behavior, Chart Info boundary, selected-chart resource grouping,
the Personal Record hierarchy, and the selected-chart Ranking contract on 2026-07-31.
Chart Info and My Record now have approved Korean, Japanese, and English labels.
Chart-scoped Play count remains in the cumulative summary, while profile-wide Play
count is explicitly deferred to the Profile brief. Ranking now has an approved
hierarchy, conditional current-user treatment, three-group row model, competition-rank
tie semantics, focused high-skill score distribution, 25-player pagination, responsive
relationship, and core state and accessibility behavior.

This establishes the entry, authentication-restoration, Chart Info, Personal Record,
and Ranking content contracts. It does not approve the current page's visual design or
complete the Music-detail page brief. The next discussion should define the remaining
area labels and Tier/evaluation contract before complete page-level responsive,
interaction-state, and acceptance criteria are finalized.
