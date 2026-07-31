# NosLog 2.0 Music Detail Page Brief

## Document Control

- Status: `In progress`
- Decision status: `Structure, entry priority, source-aware restoration, and signed-out
Record behavior approved; detailed content, state, responsive, and accessibility
decisions remain open`
- Evidence status: `Repository inspection, current-product audit, approved information
architecture, approved shared-discovery handoff, and cited tabs, adaptive-layout,
rhythm-game, and infrastructure guidance`
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
- The exact visible tab labels, their final localized wording, tab geometry, and
  responsive overflow behavior remain open. Approval covers the architecture, not the
  current tab design.

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
- This approval establishes semantic order, not final Korean, Japanese, or English
  labels. Final localized wording remains open.
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

### Rhythm-Game and Data-Product Evidence

| Source                                                                                                                     | Transferable finding                                                                                                                               | NosLog application                                                                             | Limitation                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Official NOSTALGIA: How to play](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                          | A Music selection is followed by a Normal, Hard, Expert, or optional Real difficulty selection.                                                    | Confirms Music-level identity with selected chart-level difficulty.                            | It documents the arcade flow, not a web detail page.                                              |
| [Official NOSTALGIA: Play data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                         | Score and recent performance are authenticated player data.                                                                                        | Supports treating personal record as a conditional area rather than universal public identity. | Most detailed content requires login and cannot be fully audited anonymously.                     |
| [osu!: Beatmap information](https://osu.ppy.sh/wiki/en/Beatmap_information)                                                | Song/map identity stays visible; difficulty selection updates statistics; leaderboard scopes use tabs and each difficulty has its own leaderboard. | This is the closest production analogue to NosLog's Music-plus-chart model.                    | osu! has different scoring, community, and moderation requirements.                               |
| [osu!: Beatmap entity](https://osu.ppy.sh/wiki/en/Beatmap)                                                                 | A beatmapset and its individual difficulties have distinct identifiers; a selected difficulty is reflected in the URL.                             | Supports a stable Music parent with shareable selected-chart state.                            | Identifier syntax should not be copied.                                                           |
| [ScoreSaber Reloaded: Leaderboards](https://www.mintlify.com/RealFascinated/scoresaber-reloaded/features/leaderboards)     | A selected map difficulty has its own leaderboard and map-information context.                                                                     | Supports chart-scoped ranking without loading every difficulty's ranking together.             | This is third-party documentation around a community service, not an official universal standard. |
| [ScoreSaber Reloaded: Score tracking](https://www.mintlify.com/RealFascinated/scoresaber-reloaded/features/score-tracking) | Personal score detail and the full leaderboard are related but distinct destinations or views.                                                     | Supports separating personal performance and ranking under one chart context.                  | Its information model is Beat Saber-specific.                                                     |
| [BeatSaver: Map detail example](https://beatsaver.com/maps/50d1e)                                                          | Shared song/map identity can expose several difficulty targets without duplicating the entire entity.                                              | Reinforces grouped Music identity and difficulty-level actions.                                | The page is map-publication oriented and does not contain NosLog personal analytics.              |
| [Arcaea Wiki: Songs by level](https://arcaea.fandom.com/wiki/Songs_by_Level)                                               | Difficulty, chart constant, level, and version are chart-level properties that benefit from explicit association.                                  | Supports keeping selected chart facts distinct from Music-level title and artist.              | It is a community-maintained dense catalog, not a detail-page interaction standard.               |

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

## Open Decisions for the Next Discussion

The following decisions have not been approved:

1. final Korean, Japanese, and English content-area labels within the approved semantic
   order;
2. exact information priority and progressive disclosure inside each area;
3. switching, loading, stale-data, empty, permission, error, and retry behavior beyond
   the approved signed-out Record contract;
4. mobile tab overflow or alternative compact control behavior;
5. desktop use of additional width inside each selected area;
6. keyboard focus transfer and announcements after difficulty or content-area changes;
7. representative real, long, missing, and multilingual data cases;
8. page acceptance criteria and browser-verification widths; and
9. exact relationship between external video/chart resources and the NosLog viewer
   action.

## Decision Register

| ID      | Decision                                   | Direction                                                                                                                           | Status     |
| ------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| MDET-01 | Entity model                               | Keep Music identity stable and treat the selected difficulty as active chart context                                                | `Approved` |
| MDET-02 | Difficulty state                           | Preserve the selected difficulty in shareable and history-restorable navigation state                                               | `Approved` |
| MDET-03 | Viewer entry                               | Keep View chart as a direct selected-chart action outside the Information panel, with external fallback or concise unavailable text | `Approved` |
| MDET-04 | Content architecture                       | Use Pattern A: one persistent context with four tabbed semantic areas and one selected panel at a time                              | `Approved` |
| MDET-05 | Initial data boundary                      | Do not require every cross-domain detail or summary before the user selects its area; reuse valid visited-area data                 | `Approved` |
| MDET-06 | Long-page architecture                     | Do not render all four complete areas as one long page                                                                              | `Rejected` |
| MDET-07 | Overview-hub architecture                  | Do not add a cross-domain summary hub before the four detailed areas                                                                | `Rejected` |
| MDET-08 | Current visual inheritance                 | Current visual execution is audit evidence only and must not constrain the 2.0 redesign                                             | `Rejected` |
| MDET-09 | Semantic content-area order                | Information, personal Record, Ranking, then Tier/community evaluation                                                               | `Approved` |
| MDET-10 | Responsive and visual composition          | Define later through approved foundation and representative mobile/desktop specimens                                                | `Open`     |
| MDET-11 | Content, state, and accessibility contract | Continue the page-brief research and approval process                                                                               | `Open`     |
| MDET-12 | Final localized area labels                | Define Korean, Japanese, and English wording without changing the approved semantic order                                           | `Open`     |
| MDET-13 | General-entry default                      | Open Information for both signed-in and signed-out queryless entry                                                                  | `Approved` |
| MDET-14 | Source-aware entry                         | Encode known Record, Ranking, Tier/evaluation, and viewer-return intent in restorable navigation state                              | `Approved` |
| MDET-15 | Signed-out Record                          | Keep it visible and selectable; render a compact panel-level Login state without placeholder analytics or automatic authentication  | `Approved` |
| MDET-16 | Authentication restoration                 | Preserve locale, Music, difficulty, and Record through Login and required onboarding, then restore the exact destination            | `Approved` |
| MDET-17 | Hidden default memory                      | Do not vary queryless default by authentication or globally remember the last-used area                                             | `Rejected` |

## Current Milestone

The user approved the entity model, direct chart-viewer action, Pattern A content
architecture, public Information default, source-aware explicit entry, and recoverable
signed-out Record behavior on 2026-07-31. This establishes the entry-priority and
authentication-restoration contract. It does not approve the current page's visual
design or complete the Music-detail page brief.

The next discussion should establish the final localized area labels and the detailed
information hierarchy inside the four areas before responsive composition and complete
state behavior are finalized.
