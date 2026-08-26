# NosLog 2.0 Profile Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Core Profile contract approved: public performance identity,
mode-scoped competitive summary, progress and record hierarchy, privacy groups,
five-item previews with complete-list destinations, owner sync status, public-safe
share card, runtime
states, responsive composition, accessibility, localization, and browser
acceptance`
- Evidence status: `Repository and schema inspection, authenticated and public
browser evidence in Korean/Japanese/English at wide, 390px, and 320px widths,
approved information architecture and related page briefs, cited rhythm-game,
activity-profile, privacy, dashboard, responsive, accessibility, and
internationalization references, and the user-approved decision record`
- Date started: 2026-08-02
- Last decision update: 2026-08-03
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Related contracts:
  [05-music-detail-page-brief.md](./05-music-detail-page-brief.md),
  [06-tier-list-page-brief.md](./06-tier-list-page-brief.md), and
  [08-global-rankings-page-brief.md](./08-global-rankings-page-brief.md)
- Scope: Localized public user Profile, owner-only contextual actions, public
  performance summary, progress, Best Plays, record overview, Recent Plays, and
  dedicated complete-list destinations
- Excluded: Account-settings form design, data-sync guide design, social following,
  comments or messaging, profile customization themes, badges or Brooch display,
  persistent NOS currency display, administrator interfaces, final Foundation
  tokens, final high-fidelity composition, and production implementation in this
  session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, or an approved
  upstream artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the approved Profile behavior, content hierarchy,
privacy meaning, responsive contract, and states. Exact typography, color, spacing,
radius, elevation, chart styling, avatar treatment, control dimensions, grid tracks,
and content-driven transition values remain Foundation and active high-fidelity design
work. Later visual decisions may refine expression but must not remove or reinterpret
this product contract.

## Purpose

The Profile answers three ordered questions:

> Who is this player, what is their current NOSTALGIA standing, and how do their
> records demonstrate progress and recent activity?

It is a public rhythm-game record profile and a supporting destination from Rankings,
Tier, and record contexts. It is not an account-management dashboard, a social feed,
an inventory page, a replacement for chart-scoped Music detail, or a dump of every
synced NOSTALGIA field.

## Primary Context and Success

- **Approved upstream:** Profile belongs to Records and comparison and remains
  reachable through the signed-in Header identity control, public player links in
  Rankings, and other contextual record links.
- **Approved:** Mobile use around arcade play is the primary context. Desktop remains
  required and must use additional width intentionally rather than retaining a fixed
  approximately `390px` shell.
- **Approved:** A successful public visit identifies the player, communicates current
  competitive standing, shows progress and representative records, and lets the
  visitor open supporting Music detail without exposing hidden personal fields.
- **Approved:** A successful owner visit also communicates sync freshness and provides
  concise Share, Settings, and Data sync access without turning the page into account
  settings.
- **Approved:** Current styling and geometry are audit evidence, not NosLog 2.0 visual
  authority.

## Current-Product Evidence

### Observed Route and Access

- The localized public Profile resolves at `/[locale]/profile/[id]`.
- The page is readable while signed out. Owner status adds analytics, Share, Settings,
  and Logout in the current implementation.
- The current page uses one client-side Basic/Recital state and does not encode that
  selection in the URL.
- Profile data is cached per user for five minutes. Owner-only judgement analytics are
  fetched outside the public profile cache.
- The page currently emits `noindex` metadata; search-indexing policy remains outside
  this page brief and must not be changed silently during visual implementation.

### Observed Public Data

- Identity data includes NosLog username, avatar, profile country category,
  NOSTALGIA player name, Discord information, preferred arcade, Basic and Recital
  exams, and privacy flags for NOSTALGIA name, Discord, and Play count.
- Competitive data includes Basic and Recital Official Grd plus global and
  country-category positions for each mode.
- The current Profile does not calculate or return NosLog Rating even though Basic
  Rating exists in the approved Rankings and Tier contracts.
- The current schema has no Recital NosLog Rating source.
- The current page exposes the NosLog account `created_at` date and derives Last
  played from the newest returned `ChartPlayHistory` item.
- Rank distribution uses the stored Pianist, Full Combo, S, A+, A, B+, B, C, and D
  chart counts.
- Public Best Plays contain current best score, rank, level, difficulty, Max Combo,
  Full Combo/Pianist state, mode-specific Grd contribution, Music identity, jacket,
  and time. The current query returns ten Basic and ten Recital items.
- Public Recent Plays contain the latest ten official play-history items. Their
  current model does not establish a trustworthy Basic/Recital attempt mode.
- Current judgement analytics aggregate S-Just against all five judgement counts from
  current chart records and are exposed only to the owner.

### Observed Retention and Sync Data

- `ChartPlayHistory` preserves imported recent-play events with a compound uniqueness
  key, preventing the same source event from being inserted repeatedly.
- `ChartRecordSnapshot` stores a snapshot only when a current chart record materially
  changes. This supports progress analysis without writing unchanged duplicates.
- `UserBestGrade` preserves Basic and Recital Official Grd history.
- Player sync stores NOSTALGIA Play count, NOS, last-play time, and Brooch data even
  though not all stored fields belong in the approved public Profile.
- The current schema supports only `hide_nostalgia_name`, `hide_discord_name`, and
  `hide_play_count`. It does not support the approved Play-activity or preferred-arcade
  visibility controls.

### Observed Interface and Browser Behavior

- Current source order is identity, Basic/Recital tabs, Grd/rank summary, Grd trend,
  rank distribution and Play count, owner-only S-Just analytics, Best Plays, Recent
  Plays, and owner Logout.
- The mode selector appears to govern the whole page even though rank distribution,
  Play count, judgement, and Recent Plays are not mode-specific.
- Hidden NOSTALGIA and Discord values can leave visible `Private` placeholders instead
  of removing irrelevant visitor content.
- The current Header displays NosLog join date even though it is not a meaningful
  NOSTALGIA profile fact.
- At wide desktop widths, the profile remains a narrow centered column with large
  unused margins.
- At `320px`, current page content produces document-level horizontal scrolling.
- Long original Japanese titles demonstrate that fixed single-language row heights
  are unsafe even without repeated localized-title captions.

## Approved Scope and Invariants

- Keep the Profile public and useful from public Rankings and record links.
- Keep NosLog identity distinct from optional NOSTALGIA and Discord identity fields.
- Preserve Basic and Recital as distinct NOSTALGIA performance modes.
- Add the approved NosLog Rating to both modes. Each mode's rating constant comes from
  that mode's published Pianist tier list, so Basic and Recital are symmetric
  (`TIER-29`, `RANK-21`, `PROF-33`).
- Preserve Official Grd, global and country-category rank, mode exam, Grade history,
  rank distribution, judgement summary, Best Plays, Recent Plays, and profile-wide
  Play count according to the hierarchy and privacy contract below.
- Do not display NosLog account join date.
- Do not add Brooch, persistent NOS balance, arbitrary achievements, social follower
  counts, status posts, or invented challenge state.
- Retain complete meaningful history without an arbitrary thirty-item storage cap and
  avoid writing identical record snapshots or duplicate play events.
- Preview limits constrain the overview presentation, not retained data.
- Never infer a specific nation for the stored `global` country category.
- Do not expose hidden fields through HTML, metadata, Share cards, client payloads,
  analytics labels, or accessible names.

## Approved Information Hierarchy

Use one semantic `main` and the following mobile-first source order:

1. Player identity and visible supporting metadata
2. Mode-scoped competitive summary
3. Progress over time
4. Best Plays preview
5. Record overview: rank distribution, judgement summary, and optional Play count
6. Recent Plays preview when Play activity is public

This order moves from identity to current ability, evidence of growth, representative
best records, broader record characteristics, and finally recent activity. Do not
promote account controls, sync details, currency, or inventory above performance.

## Identity and Header Contract

### Public Identity

- Show the avatar or approved fallback, NosLog username, and country-category marker
  as one identity group.
- When no avatar image exists, the fallback is the first letter grapheme of the username,
  uppercased where the script has case (`PROF-36`). Skip leading non-letter characters. If
  the username contains no letter, or no username exists, fall back to the approved person
  icon. The fallback glyph is decorative: it is excluded from the accessibility tree so the
  username is not announced twice, and the image slot keeps its own accessible name.
- Place the country marker immediately beside the username, not beside or before the
  avatar. Korea and Japan may use their approved flags. Other regions use a globe
  marker with a localized accessible name.
- Show available Basic and Recital exam labels below the username. Missing exams are
  omitted without an empty badge.
- Do not show NosLog account join date.
- Show Last played only when Play activity is public and data exists. Use a localized
  exact date; relative text may supplement but never replace the exact value.
- Present visible NOSTALGIA name, Discord, and preferred arcade as compact supporting
  metadata. Omit absent or hidden fields instead of rendering placeholders.

### Owner Context

- Keep Share and Settings as compact owner-only actions associated with the identity
  area. They must not compete with the player name or performance summary.
- Add one owner-only sync-freshness line such as `Last sync Jul 28 · Up to date` or
  `Sync needed`, with a contextual Data sync action.
- Sync status is trust and maintenance context, not a public performance metric or a
  large dashboard card.
- Remove Logout from the Profile body. Logout belongs to the approved account/More or
  Settings context.
- An owner viewing their public Profile sees a concise indication when a field or
  activity group is hidden and a direct Settings path; a visitor never sees that
  private value or a `Private` placeholder.

## Privacy and Public-Data Contract

### Always Public Performance

The public Profile always includes, when data exists:

- NosLog username, avatar, and country category;
- Basic and Recital exam labels;
- Official Grd, NosLog Rating when available, global rank, and country-category rank;
- Progress over time;
- Best Plays;
- rank distribution; and
- judgement summary.

These fields establish the purpose of a public competitive record profile. The Profile
does not provide a whole-page private mode because public Rankings and record links
must resolve to useful supporting context.

### User-Controlled Visibility

Provide five explicit visibility controls:

1. NOSTALGIA player name;
2. Discord identity;
3. preferred arcade;
4. profile-wide Play count; and
5. Play activity, controlling both Last played and Recent Plays.

- Group Last played and Recent Plays under one Play-activity control so one surface
  cannot reveal the date or activity that the other claims to hide.
- Keep preferred arcade separate because it is location-adjacent information.
- Changing visibility must invalidate relevant public caches and remove protected data
  from subsequent public payloads and generated Share artifacts.
- Settings must explain each control in plain language and preview or otherwise make
  its public consequence understandable.
- Do not add a separate toggle for judgement summary under the approved contract.

## Basic and Recital Performance Contract

### Scope of the Mode Selector

- Place one compact Basic/Recital exclusive selector at the start of the competitive
  performance section, not above the identity header and not as a page-global tab.
- The selector controls only:
    - mode exam context;
    - Official Grd;
    - NosLog Rating when available;
    - global and country-category ranks;
    - Progress over time; and
    - Best Plays.
- It does not change Play count, Last played, Recent Plays, rank distribution, or
  judgement summary.
- The selected mode and controlled region must be programmatically associated so its
  limited scope is clear to sighted and non-sighted users.
- The selector is a two-segment segmented control sized to the performance region, using
  the approved selected-segment treatment rather than a filled inverted segment
  (`PROF-34`). It is the highest-priority control in the performance region; the
  Progress metric control below it must read as subordinate.

### Competitive Summary

- Show Official Grd, NosLog Rating when available, global rank, and country-category
  rank as one coherent summary rather than four unrelated large cards.
- Official Grd remains the primary official metric. NosLog Rating is a clearly labeled
  NosLog-derived metric governed by the approved Tier and Rankings contracts.
- Basic exposes both Official Grd and NosLog Rating.
- Recital exposes Official Grd, NosLog Rating, and ranks on the same terms as Basic;
  its rating is sourced from the Recital Pianist tier list (`TIER-29`, `PROF-33`). When
  that source is unavailable at runtime, reuse the approved rating-unavailable outcome
  rather than showing zero, `Coming soon`, or a disabled empty metric.
- Missing eligible Grd or rank uses a concise unavailable value and does not invent a
  percentile or projected result.

## Progress-over-Time Contract

- Use the section label **Progress over time**.
- Default to the most recent `90 days`.
- Provide one compact range selector with `30 days`, `90 days`, `1 year`, and `All`.
  Do not expose four persistent peer buttons when space is constrained.
- Show one metric at a time through a compact metric selector:
    - `Official Grd`; or
    - `NosLog Rating` when available for the active mode.
- Do not overlay Official Grd and NosLog Rating in one chart because they use different
  scales and meanings.
- The Basic/Recital selector controls which mode's series are shown. Both modes offer
  the Official Grd and NosLog Rating series (`PROF-33`).
- Present the two controls on one secondary row above the plot: the metric control is an
  underline tab pair carrying both metric labels, and the range control is a compact
  select, separated to the row's outer edges (`PROF-35`). This keeps the metric
  subordinate to the mode selector while still exposing both metric values.
- Show start value, current value, and change as structured text outside the chart.
- Retain meaningful daily history for the approved periods. Collapse identical
  same-value points when they add no information, but preserve the date boundary and
  do not manufacture interpolation.
- Provide an accessible text summary and underlying date/value access. The graphical
  chart must not be the only way to obtain the trend.
- When there is only one point, show the exact current value and explain concisely that
  more history is required; do not draw a misleading trend.

## Best Plays Contract

- Show five Best Plays on the Profile overview for the active Basic/Recital mode.
- Sort by the approved mode-specific contribution and score contract. Do not silently
  mix Basic and Recital contribution order.
- Each preview item includes:
    - jacket or approved fallback;
    - original Music title;
    - difficulty and level;
    - score;
    - the official score-grade image, which carries Pianist at the top of the grade
      ladder, plus a separate Full Combo mark when applicable; and
    - the contribution value of the selected metric.
- Compose the row on two axes (`PROF-37`). The leading side answers what was played:
  jacket carrying the Full Combo mark in its top corner, then the original title, then
  difficulty, level, score, and the official grade image on one supporting line. The
  trailing side answers what the play is worth: the contribution value, right-aligned
  with tabular figures so the values line up across rows. Left padding is zero because
  the jacket bleeds to the leading edge.
- Offer a metric control for the contribution, scoped to Best Plays (`PROF-38`).
  Official Grd is the default; NosLog Rating is the alternative. This control is not a
  display toggle: the two metrics have different populations and ordering, so switching
  re-queries the list. Official Grd draws on the top fifty charts with no score floor,
  while NosLog Rating draws on the top seventy and contributes nothing below the
  approved rating score floor, so plays under that floor are absent from the Rating
  view. Change the sort label with the metric, keep the last committed list visible
  until the new response commits, and never present the retained list as the new
  metric's result.
- The whole primary item opens the corresponding localized Music detail and selected
  difficulty. Auxiliary labels must not become competing links.
- Provide **View all** when more than five eligible items exist.
- The complete Best Plays destination supports Basic/Recital, explicit bounded loading
  through pagination or a user-initiated More action, direct restoration of the
  selected mode and position, and no infinite scroll.
- The overview preview limit must not cap retained or queryable best records.

## Record Overview Contract

### Rank Distribution

- Show the profile-wide Pianist, Full Combo, S, A+, A, B+, B, C, and D distribution.
- Do not label it a clear-status distribution. NOSTALGIA clear is not a useful
  differentiator for this purpose.
- Keep the whole distribution mode-neutral unless a future verified data source can
  distinguish mode-specific chart achievement without changing its meaning.
- Provide exact counts and a structured text equivalent for any visual encoding.

### Judgement Summary

- Make the approved aggregate judgement summary public performance information.
- Include the judgement basis and valid-chart sample count. Do not imply that charts
  lacking judgement data were measured.
- A compact S-Just emphasis may lead the summary, but the downstream design must retain
  access to the exact S-Just, Just, Good, Miss, and Near basis rather than presenting a
  context-free percentage.
- Do not add note-type success filters or Tenuto/Glissando success summaries to the
  profile overview.
- Do not use the Music-detail community pattern radar for player judgement data; the
  two visualizations answer different questions.

### Profile-Wide Play Count

- Show NOSTALGIA profile-wide Play count only when the user enables its visibility and
  synced data exists.
- Do not substitute Clear count.
- Play count belongs in Record overview, not the identity header or competitive-metric
  group.

## Recent Plays Contract

- Show five Recent Plays on the overview only when Play activity is public.
- Recent Plays remain mode-neutral until imported data can prove whether each attempt
  belongs to Basic or Recital.
- Each item includes jacket or fallback, localized/original title hierarchy,
  difficulty and level, score, rank, and localized exact play time.
- The item opens the corresponding localized Music detail and selected difficulty.
- Provide **View all** when more than five public history items exist.
- The complete Recent Plays destination uses explicit bounded pagination or a
  user-initiated More action, restores position when returning, and never uses
  automatic infinite scroll.
- Hiding Play activity removes Last played and both overview and complete Recent Plays
  from public access. The owner may still inspect their private activity after clear
  owner authentication.

## Complete-List Destination Contract

- Use dedicated localized Profile child destinations, with implementation mapping
  equivalent to `/[locale]/profile/[id]/best` and
  `/[locale]/profile/[id]/recent`.
- Preserve player identity and a concise return path without duplicating the full
  overview.
- Best Plays retains the active mode. Recent Plays remains mode-neutral.
- List scope, page/cursor, and mode where applicable must be restorable through direct
  URL, Refresh, and Browser Back/Forward.
- A visitor opening a hidden Recent Plays URL receives the same privacy-safe outcome as
  the overview and never learns hidden counts or timestamps.
- Empty, Loading, Error, and end-of-list behavior follow the state contract below.

## URL, History, and Restoration Contract

- Keep every Profile and complete-list URL localized and shareable.
- A Music-detail round trip from Best or Recent returns to the originating Profile
  surface, active mode where applicable, list position, and practical scroll context.
- Complete-list pagination or More state must be deterministic and restorable.
- Exact overview mode-query syntax is deferred to implementation mapping, but Refresh
  and Browser Back/Forward must not unexpectedly change the user's active performance
  mode during one Profile visit.
- Do not store private fields or hidden activity values in the URL.

## Profile Share Card Contract

### Purpose and Content

- Share is an owner-only action with a preview before any external action.
- Generate a `1200×630` PNG for one owner-selected `Basic` or `Recital` mode. The card
  is a concise public Profile summary, not a raw export or second Profile page.
- Always include avatar, NosLog username, country category, selected mode, available
  Official Grd and approved NosLog Rating, global/country rank, selected-mode Exam,
  NosLog identity, and the localized public Profile URL.
- Include NOSTALGIA player name, Profile-wide Play count, and preferred arcade name
  only when each existing visibility control is enabled and the value exists.
- Exclude Discord, Last played, Recent Plays, NOS, synchronization time, arcade address,
  machine details, and operational metadata.
- Hidden or missing fields are omitted from the image, accessible summary, metadata,
  payload, and layout. Never render `Private`, `Not set`, a placeholder, or an empty
  reserved slot.

### Share, Open Graph, and Failure Behavior

- The primary **Share** action uses the system share sheet with image, localized text,
  and URL only when capability checks confirm that exact payload is shareable.
- Secondary actions are **Save image** and, where supported, **Copy image**.
- Cancel is not an error. Unsupported, denied, generation, and network failures remain
  distinct and provide the applicable retry, save, or link fallback.
- X uses an explicit official Web Intent link-share fallback. Never claim that the
  image was automatically attached when the platform does not support it.
- Public localized Profile metadata provides a public-safe Open Graph image so X,
  Discord, and compatible crawlers can render a preview without owner authentication.
- A privacy-setting change invalidates the card cache and versions the Open Graph image
  URL so an old public image is not presented as current.

### Accessibility, Localization, and Reference Basis

- Provide a localized textual equivalent of the visible card content and an accessible
  preview name. Decorative artwork is excluded from that name.
- Follow the current `ko`, `ja`, or `en` Profile locale while preserving user and
  official game-name spelling. Test long names, missing avatar/Exam/Rating, and every
  independently hidden conditional field.
- The contract applies progressive capability and privacy principles from
  [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share),
  [W3C Web Share](https://www.w3.org/TR/web-share/),
  [Apple Activity Views](https://developer.apple.com/design/human-interface-guidelines/activity-views),
  [Android Sharesheet](https://developer.android.com/training/sharing/send),
  [MDN ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem),
  [X Web Intents](https://docs.x.com/x-for-websites/web-intents/overview),
  [Open Graph](https://ogp.me/),
  [WCAG Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content),
  [WCAG 2.2](https://www.w3.org/TR/WCAG22/),
  [EDPB Privacy by Design and Default](https://www.edpb.europa.eu/topics/ai-and-technology/privacy-by-design-and-by-default_en),
  and [ICO Data Minimisation](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/data-minimisation/).
  Platform support and crawler behavior vary, so feature detection and public-safe
  fallback are requirements rather than assumptions.

## Loading, Empty, Error, Privacy, and Unavailable States

### Initial Loading

- Reserve stable identity and major section regions and expose one concise loading
  status.
- Do not fabricate ranks, scores, charts, or activity in skeleton content.

### Section Update

- A mode, metric, range, or complete-list update keeps the last committed content
  visible, marks only the controlled region busy, and ignores stale responses.
- Do not blank the entire Profile when only one section changes.

### No Synced Records

- Preserve public identity and visible metadata.
- Show one concise record-empty outcome in the performance area and one owner-only Data
  sync action when the viewer owns the Profile.
- Do not repeat separate empty cards for Grd, Rating, trend, Best Plays, distribution,
  judgement, and Recent Plays.

### Partial Data

- A player may have Basic but no Recital record, a current value but no history, Best
  Plays but no imported Recent Plays, or judgement coverage for only part of the chart
  catalog.
- Render available sections accurately and use concise local unavailable/insufficient
  states. Do not treat partial data as a whole-page failure.

### Privacy

- Visitors do not see hidden modules, placeholder rows, hidden totals, or protected
  values in markup or generated assets.
- Owners see a concise private-state explanation and Settings access without exposing
  the protected data to public caching.
- A hidden Play-activity group removes Last played and Recent Plays together.

### Error

- If one section fails after prior success, retain the last committed section content
  and show an inline Retry for that section.
- If the initial Profile request fails, keep the ordinary shell and provide one bounded
  error with Retry. Do not transform errors into empty records or private states.
- A missing user produces the localized not-found contract, not an empty Profile.

### Sync Status

- `Up to date`, `Sync needed`, `Syncing`, `Partial`, and `Failed` are owner-only trust
  states and remain distinct from public record Loading or Error.
- Sync state links to the existing Data sync flow; it does not expose tokens, internal
  errors, or administrator health data.

## Responsive Contract

### Compact Layout

- Use `390px` as a representative review canvas, not a fixed product width or
  breakpoint.
- Reflow without document-level two-dimensional scrolling down to `320 CSS px`.
- Use one readable source column. Identity metadata wraps or stacks without forcing
  the username, country marker, owner actions, or exam labels outside the viewport.
- Keep the Basic/Recital selector immediately attached to the performance region it
  controls.
- Summary metrics may reflow into fewer columns or stacked groups. Never reduce labels
  to unexplained icons merely to preserve one row.
- Play items remain vertically scannable. Jacket ratio stays `1:1`; long original
  titles must not overlap metadata.
- No essential value depends on Hover. Mobile does not add a tap-only replacement for
  decorative Hover detail.
- Charts use their actual container width and retain text summaries outside the plot.

### Wide Layout

- Remove the fixed compact-shell constraint and establish an intentional profile
  reading width.
- Identity and competitive summary remain the opening context. Additional width may
  align a primary record column with a supporting analysis column when the approved
  source hierarchy and logical keyboard order remain intact.
- Use extra space to improve comparison of trend, Best Plays, distribution, judgement,
  and Recent Plays; do not fill it with NOS, Brooch, social modules, or oversized
  decorative surfaces.
- Best and Recent lists may expose more aligned metadata than compact rows but retain
  the same information meaning and primary Music-detail destination.
- Do not merely enlarge the mobile column or create unrelated dashboard cards to fill
  the viewport.

### Implementation Semantics Across Layouts

- Compact and wide presentations expose one equivalent Profile dataset and source
  order.
- If separate visual structures are rendered, only the active one remains in the
  accessibility tree; do not duplicate headings, record links, or private data.
- Choose viewport or container transitions from content constraints and validate
  intermediate widths, long names, and three-language titles.

## Accessibility Contract

- Use one page `h1` containing the player's full NosLog username or localized unnamed
  fallback.
- Provide one labeled performance region controlled by the Basic/Recital selector.
- Exclusive selectors are keyboard operable, expose selected state, and retain visible
  Focus. Selection changes do not move Focus unexpectedly.
- Country markers and exam labels have localized accessible names and never depend on
  color, flag image rendering, or badge shape alone.
- Share, Settings, Data sync, View all, Music-detail items, range/metric selectors,
  Retry, and complete-list navigation have descriptive accessible names and visible
  Focus.
- Every chart has an accessible name, exact text summary, data basis, and a method to
  obtain underlying values. Color is never the only series or state distinction.
- Loading and committed section updates use restrained live status. Do not announce
  every record item or every chart point.
- Lists use semantic list structure; a wide tabular comparison uses native table
  semantics and associated headings when relationships require them.
- Dates use semantic time values. Abbreviations such as Grd, FC, and S-Just receive a
  clear contextual label or accessible expansion where needed.
- Hidden content is absent from the accessibility tree and public payload, not merely
  visually concealed.
- Pointer targets satisfy the approved Foundation target-size rule and do not overlap
  at `320px`.
- Respect reduced-motion preferences. Trend or section transitions never require
  motion to communicate state.

## Localization and Content

### Stable Domain Labels

- Keep `Basic`, `Recital`, `Grd`, `NosLog Rating`, `S-Just`, `Just`, `Good`, `Miss`,
  `Near`, `Full Combo`, and `Pianist` in approved product terminology.
- Use localized explanatory labels around these stable terms rather than translating
  them inconsistently across pages.
- Use the approved country-category meaning: Korea, Japan, and Other regions. Do not
  label Other regions as one specific country.

### Titles and Identity

- Show original Music titles only in Profile play items. Approved localized/read
  titles remain searchable and are available on the linked Music Detail page.
- Valid Korean, Japanese, Latin, and mixed-script usernames must wrap or truncate only
  when the complete accessible name remains available.
- Long original Japanese titles and artists must not be clipped by a fixed
  single-language assumption.
- Discord handles, NOSTALGIA names, and arcade names retain their source spelling.

### Dates and Counts

- Format dates by locale and expose machine-readable date/time values.
- Avoid ambiguous all-numeric dates without locale context.
- Use tabular figures for scores, Grd, Rating, rank, Play count, judgement values, and
  trend summaries where alignment aids comparison.
- Localize empty, hidden-owner, Loading, Error, Retry, View all, sync, and insufficient
  history labels in Korean, Japanese, and English with equivalent meaning.

## Runtime State Contract

| State                  | Required visible outcome                                                                       | Interaction outcome                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Public Basic           | Identity, Basic competitive summary, Basic trend and Best, public record overview and activity | Basic/Recital and public record links remain usable       |
| Public Recital         | Identity, Recital Official Grd, Rating and ranks, Recital trend and Best                       | Basic remains directly selectable                         |
| Owner                  | Public Profile plus Share, Settings, sync state, and private-state context                     | Owner actions lead to their established destinations      |
| Signed out             | Same public record contract without owner actions                                              | Public links remain usable; login is not required to read |
| Play activity hidden   | No Last played, Recent preview, count, timestamps, or public recent route data                 | Owner can open Settings; visitor receives no placeholder  |
| Optional field hidden  | Visible identity/performance remains; protected metadata omitted                               | No protected value leaks through Share or payload         |
| Share preview          | Public-safe selected-mode card and localized text equivalent                                   | Owner may Share, save, or use supported copy              |
| Share unsupported      | Preview remains with save and explicit link fallback                                           | No false success or claimed image attachment              |
| Share generation error | Bounded Retry error; Profile remains usable                                                    | No stale or partially generated image is shared           |
| No records             | Identity plus one concise record-empty state                                                   | Owner gets contextual Data sync; visitor keeps navigation |
| Partial records        | Only trustworthy available sections and local insufficiency states                             | Other sections remain usable                              |
| One trend point        | Exact current value and concise insufficient-history text                                      | Range/metric controls remain accurate                     |
| Updating section       | Last committed section plus busy status                                                        | Stale responses cannot win                                |
| Initial error          | Bounded Profile error and Retry                                                                | Ordinary localized shell remains usable                   |
| Section error          | Last committed section plus local Retry                                                        | Unaffected Profile sections remain usable                 |
| Sync needed/failed     | Owner-only concise sync status                                                                 | Opens Data sync recovery; no internal details exposed     |
| Missing user           | Localized not-found outcome                                                                    | No empty or private Profile is fabricated                 |

## Implementation Mapping

| Approved requirement                   | Current source                                                                                                                                                                                                                                                                                                   | Downstream change                                                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Public localized route and owner check | [`app/(nevigation)/profile/[id]/page.tsx`](<../../app/(nevigation)/profile/[id]/page.tsx>)                                                                                                                                                                                                                       | Preserve public access; compose approved owner/public states and complete-list links                               |
| Public data query and cache            | [`app/(nevigation)/profile/[id]/data.ts`](<../../app/(nevigation)/profile/[id]/data.ts>)                                                                                                                                                                                                                         | Add Rating/progress/public analytics, privacy-safe payloads, five-item previews, totals, and complete-list queries |
| Profile composition and mode state     | [`components/profile/profile.tsx`](../../components/profile/profile.tsx)                                                                                                                                                                                                                                         | Scope Basic/Recital to performance, reorder approved sections, remove inline list expansion and Logout             |
| Identity and owner actions             | [`components/profile/dashboard/profileHeader.tsx`](../../components/profile/dashboard/profileHeader.tsx)                                                                                                                                                                                                         | Remove join date/placeholders; add approved metadata privacy, last-play, and sync-status behavior                  |
| Share preview and actions              | [`components/profile/dashboard/profileShareDialog.tsx`](../../components/profile/dashboard/profileShareDialog.tsx)                                                                                                                                                                                               | Add selected-mode preview, capability detection, save/copy fallbacks, accurate X link sharing, and accessible text |
| Share image and Open Graph             | [`app/(nevigation)/profile/[id]/card/route.tsx`](<../../app/(nevigation)/profile/[id]/card/route.tsx>) and localized Profile metadata                                                                                                                                                                            | Produce public-safe, privacy-aware, versioned 1200×630 OG output; remove Last played and private placeholders      |
| Competitive summary                    | [`components/profile/dashboard/profileSummary.tsx`](../../components/profile/dashboard/profileSummary.tsx)                                                                                                                                                                                                       | Integrate Official Grd, conditional Rating, global/country ranks, and unavailable states                           |
| Mode selector                          | [`components/profile/dashboard/profileModeTabs.tsx`](../../components/profile/dashboard/profileModeTabs.tsx)                                                                                                                                                                                                     | Attach selector semantically and visually to its controlled performance region                                     |
| Grade trend                            | [`components/profile/dashboard/profileGradeTrend.tsx`](../../components/profile/dashboard/profileGradeTrend.tsx)                                                                                                                                                                                                 | Add range and metric selectors, Rating series, exact summary, and accessible data contract                         |
| Best preview                           | [`components/profile/dashboard/profileBestPlays.tsx`](../../components/profile/dashboard/profileBestPlays.tsx)                                                                                                                                                                                                   | Use five-item preview, active-mode ordering, View all, localization, and Music-detail return context               |
| Recent preview                         | [`components/profile/dashboard/profileRecentPlays.tsx`](../../components/profile/dashboard/profileRecentPlays.tsx)                                                                                                                                                                                               | Use five-item privacy-controlled preview and View all; keep mode-neutral                                           |
| Rank distribution                      | [`components/profile/dashboard/profileRankDistribution.tsx`](../../components/profile/dashboard/profileRankDistribution.tsx)                                                                                                                                                                                     | Preserve approved rank taxonomy; remove inline expansion dependence and integrate optional Play count              |
| Judgement summary                      | [`components/profile/dashboard/profileJudgementSummary.tsx`](../../components/profile/dashboard/profileJudgementSummary.tsx) and [`lib/profile/profileAnalytics.ts`](../../lib/profile/profileAnalytics.ts)                                                                                                      | Make privacy-safe public performance summary with full basis and valid-chart count                                 |
| Profile settings                       | [`components/profile/profileSettingCard.tsx`](../../components/profile/profileSettingCard.tsx), [`app/(nevigation)/profile/settings/schema.ts`](<../../app/(nevigation)/profile/settings/schema.ts>), and [`app/(nevigation)/profile/settings/actions.ts`](<../../app/(nevigation)/profile/settings/actions.ts>) | Add preferred-arcade and grouped Play-activity visibility; explain public effects and invalidate caches            |
| Privacy storage                        | [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                                                                                                                                             | Add explicit preferred-arcade and Play-activity visibility fields while preserving existing controls               |
| Official play history                  | `ChartPlayHistory` in [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                                                                                                                       | Preserve deduplicated history beyond overview limits and support private/public complete lists                     |
| Record snapshots                       | `ChartRecordSnapshot` and `UserBestGrade` in [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                                                                                                | Preserve changed-only history and support Grd/Rating trend ranges without duplicate points                         |
| Sync ingestion                         | [`lib/services/user/updatePlayData.ts`](../../lib/services/user/updatePlayData.ts) and [`lib/services/user/updatePlayerProfile.ts`](../../lib/services/user/updatePlayerProfile.ts)                                                                                                                              | Keep duplicate suppression, expose owner-safe freshness, and retain complete meaningful history                    |
| Basic Rating calculation               | [`lib/tiers/basicRating.ts`](../../lib/tiers/basicRating.ts) and [`lib/rankings.ts`](../../lib/rankings.ts)                                                                                                                                                                                                      | Reuse approved published Basic Rating contract; do not create a separate Profile formula                           |
| Complete-list destinations             | New localized Profile child routes                                                                                                                                                                                                                                                                               | Add privacy-safe Best and Recent lists with restorable explicit bounds and Music-detail return context             |
| Localized labels                       | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                                                                                                                                     | Add complete Korean/Japanese/English Profile, privacy, range, metric, list, sync, and state strings                |
| Existing automated evidence            | [`tests/profile.test.ts`](../../tests/profile.test.ts), [`tests/profile-analytics.test.ts`](../../tests/profile-analytics.test.ts), and profile/sync tests                                                                                                                                                       | Add privacy leaks, mode scope, Rating, preview/full lists, history, localization, 320px reflow, and state coverage |

## Representative Fixtures

Validate at minimum:

1. owner and signed-out visitor viewing the same fully populated public Profile;
2. Korea, Japan, and Other-regions identities with and without avatars and exams;
3. Basic with Official Grd, Rating, ranks, long history, and more than five Best Plays;
4. Recital with Official Grd, Rating, Best Plays, and a Recital Pianist rating source, plus the case where that source is unavailable;
5. no records, Basic-only records, one trend point, partial judgement coverage, and no
   Recent Plays;
6. each optional privacy field hidden independently;
7. Play activity hidden, confirming Last played and Recent Plays disappear together;
8. hidden Recent child-route direct access by visitor and authenticated owner;
9. more than one page/bound of Best and Recent history and exact return from Music
   detail;
10. current sync, stale sync, syncing, partial sync, and failed sync for the owner;
11. a valid maximum-length username and long NOSTALGIA, Discord, and arcade names;
12. long original Japanese Music titles, translated/read-title search entry that
    resolves to original-title-only Profile items, and missing jacket;
13. `30 days`, `90 days`, `1 year`, and `All` trend ranges with sparse, identical,
    and changing values;
14. initial Loading, section update, initial error, section error, Retry, missing user,
    and stale response ordering;
15. `320px`, representative `390px`, intermediate widths, wide desktop, 200% text
    zoom, reduced motion, keyboard-only use, and screen-reader structure.

## Browser Acceptance Contract

- `/ko/profile/[id]`, `/ja/profile/[id]`, and `/en/profile/[id]` resolve with
  equivalent meaning and localized metadata.
- Public visitors can identify the player, compare current standing, inspect public
  progress and records, and open supporting Music detail without authentication.
- The identity area contains username-adjacent country marker and exam context but no
  NosLog join date.
- Basic/Recital changes only competitive summary, trend, and Best Plays; mode-neutral
  sections do not silently change.
- Basic and Recital both display Official Grd and NosLog Rating, each sourced from that
  mode's Pianist tier list. Neither mode fabricates a rating when its source is
  unavailable.
- Progress defaults to 90 days, shows one selected metric, provides exact start/current/
  change text, and exposes accessible underlying values.
- Profile overview renders at most five Best and five Recent items and exposes View all
  only when more public items exist.
- Complete-list state and the return from Music detail restore useful position and mode
  context.
- NOSTALGIA name, Discord, preferred arcade, Play count, and Play activity obey their
  approved visibility controls in content, payloads, accessible names, and Share
  artifacts.
- Hiding Play activity removes Last played and Recent Plays together for visitors.
- Hidden or missing metadata does not leave `Private`, `Unset`, empty badges, or blank
  layout slots for visitors.
- Public judgement exposes its valid sample basis and does not imply coverage of
  missing chart data.
- Owner-only Share, Settings, and sync status remain available without a Profile-body
  Logout action.
- At `320 CSS px`, no header, metadata, selector, metric, play item, chart, or action
  causes document-level horizontal overflow, clipping, or overlap.
- Wide layouts use additional reading/comparison space without becoming an unrelated
  dashboard or exposing excluded fields.
- Korean UI copy, original Japanese title, and long English UI content reflow without
  semantic truncation or fixed-height collision.
- Loading, empty, partial, privacy, unavailable, Error, sync, and not-found states are
  distinct and recoverable where recovery exists.
- All selectors, actions, lists, Retry controls, and record links work with keyboard
  alone and have visible Focus.
- Charts remain understandable without color or graphics and respect reduced motion.
- No unexpected browser console error or public private-data leak occurs in tested
  normal and failure flows.

## Reference Matrix

| Source                                                                                                                    | Transferable principle                                                                                           | NosLog application                                                          | Limitation                                                                              |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Current Profile data](<../../app/(nevigation)/profile/[id]/data.ts>)                                                     | Establishes implemented fields, cache boundary, list limits, mode ranks, and owner-only analytics                | Separates observed behavior from approved downstream changes                | Current presentation and privacy are not 2.0 authority                                  |
| [Current Profile composition](../../components/profile/profile.tsx)                                                       | Shows present source order and global mode-state coupling                                                        | Identifies sections to preserve and re-scope                                | Current fixed compact composition is superseded                                         |
| [Current Profile schema](../../prisma/schema.prisma)                                                                      | Confirms available identity, history, snapshot, sync, and privacy data                                           | Grounds retention and migration requirements                                | Missing approved visibility fields and a Recital rating calculation                     |
| [Approved IA](./02-information-architecture.md)                                                                           | Defines Profile as public Records-and-comparison context and Header identity destination                         | Preserves access, purpose, and relationship to Settings                     | Does not define Profile anatomy                                                         |
| [Approved Music detail brief](./05-music-detail-page-brief.md)                                                            | Defers profile-wide Play count and preserves Profile↔Music record links                                          | Resolves deferred data meaning and round-trip behavior                      | Chart-scoped metrics remain separate                                                    |
| [Approved Tier brief](./06-tier-list-page-brief.md)                                                                       | Defines goal-specific Tier and Rating source behavior                                                            | Keeps Profile Rating derived from the same approved contract                | Does not define Profile layout                                                          |
| [Approved Global-rankings brief](./08-global-rankings-page-brief.md)                                                      | Preserves public player links, mode metrics, country categories, and shared rank meaning                         | Aligns identity, ranks, and Rating labels                                   | Ranking rows are not full Profiles                                                      |
| [NOSTALGIA official Play Data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                         | Publishes player identity, Play count, Basic/Recital Grd, chart bests, judgement detail, and recent plays        | Validates core NOSTALGIA record vocabulary and data provenance              | Official inclusion does not make NOS or Brooch a NosLog priority                        |
| [NOSTALGIA official mode guidance](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                        | Basic and Recital represent distinct game performance contexts                                                   | Supports scoped mode comparison                                             | Does not define NosLog Rating or public privacy                                         |
| [osu! public Profile](https://osu.ppy.sh/users/11839754/osu)                                                              | Leads with identity and standing, then best, history, most-played, and recent performance                        | Supports performance-first hierarchy and complete supporting lists          | osu! PP, medals, and social context do not map directly                                 |
| [osu! API Profile sections](https://osu.ppy.sh/docs/index.html)                                                           | Public Profile sections are independently addressable data groups                                                | Supports bounded Best/Recent destinations and explicit states               | API structure does not dictate visual composition                                       |
| [ScoreSaber beginner guide](https://wiki.scoresaber.com/beginners-guide.html)                                             | Profile identity, total performance value, global/local rank, and score stats are tightly grouped                | Supports coherent competitive summary                                       | Beat Saber PP differs from Grd and NosLog Rating                                        |
| [ScoreSaber ranking system](https://wiki.scoresaber.com/ranking-system.html)                                              | Weighted best performances explain public ranking and country position                                           | Supports Best Plays as evidence for derived Rating                          | Exact weighting is not NosLog policy                                                    |
| [BeatLeader server and API](https://github.com/BeatLeader/beatleader-server)                                              | Performance profiles connect ranked scores, history, and replay-backed evidence                                  | Supports public record evidence and structured full lists                   | Replay and anti-cheat functions are outside NosLog scope                                |
| [LIFE4 DDR](https://life4ddr.com/)                                                                                        | Competitive rank can act as a progress roadmap rather than decorative status                                     | Supports current standing followed by growth evidence                       | LIFE4 achievement rules are not NOSTALGIA rules                                         |
| [Strava Profile](https://support.strava.com/en-us/articles/15402175-your-strava-profile-page)                             | Identity, activity history, periodic progress, and recent items coexist with different priority                  | Supports progress summary plus bounded recent activity                      | Athletic metrics and social modules are not adopted                                     |
| [Last.fm public user Profile](https://www.last.fm/user/fm-bot)                                                            | Recent activity and longer-term listening reports are separate layers                                            | Supports overview previews plus complete history                            | Listening activity is not competitive game performance                                  |
| [GitHub personal Profile](https://docs.github.com/en/account-and-profile/concepts/personal-profile)                       | Public identity, activity visualization, and selected highlights coexist                                         | Supports identity, progress, and Best evidence without a settings dashboard | Contribution graphs are not copied as Profile styling                                   |
| [GitHub contribution reference](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference) | Activity history needs clear inclusion rules and public/private semantics                                        | Supports explicit data basis for trend and hidden activity                  | Contribution events differ from NOSTALGIA sync events                                   |
| [Google Play Games Profile privacy](https://support.google.com/googleplay/answer/16562063?hl=en)                          | Public and private profile outcomes require clear previews and visibility meaning                                | Supports explicit Profile visibility controls and owner understanding       | Native app privacy grouping is not copied wholesale                                     |
| [Steam Profile privacy](https://help.steampowered.com/en/faqs/view/588C-C67D-0251-C276)                                   | Game details and playtime can be controlled separately from basic identity                                       | Supports optional Play count and activity disclosure                        | Steam's whole-profile tiers are intentionally not adopted                               |
| [Apple Game Center privacy](https://www.apple.com/ca/legal/privacy/data/en/game-center/)                                  | Identity and game activity are shared according to chosen disclosure                                             | Supports explicit activity privacy and no silent public leak                | Platform account relationships differ from NosLog                                       |
| [PlayStation privacy settings](https://www.playstation.com/en-us/support/account/privacy-settings/)                       | Recent activity and profile visibility need understandable audience controls                                     | Supports separating location-adjacent and play-activity privacy             | Console audience presets are not required                                               |
| [Carbon Dashboards](https://carbondesignsystem.com/data-visualization/dashboards/)                                        | Dashboards require clear hierarchy, minimal distraction, and focused analytical questions                        | Supports a performance profile without unrelated metric cards               | Carbon surface styling is not NosLog authority                                          |
| [USWDS Data visualizations](https://designsystem.digital.gov/components/data-visualizations/)                             | Charts need underlying data and plain-language summaries                                                         | Requires accessible Grd/Rating trend and judgement basis                    | Does not define rhythm-game metrics                                                     |
| [GOV.UK Accordion](https://design-system.service.gov.uk/components/accordion/)                                            | Universally needed content should not be hidden; content should be simplified before adding disclosure           | Keeps core performance visible and avoids nested profile accordions         | Government content density differs from NosLog                                          |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                               | Ordinary vertical content must preserve information and function at 320 CSS px without two-dimensional scrolling | Rejects the current overflow and fixed compact desktop shell                | Does not prescribe exact layout tokens                                                  |
| [W3C Tables tutorial](https://www.w3.org/WAI/tutorials/tables/)                                                           | Tabular relationships require clear headings and associations                                                    | Guides wide complete-list and metric comparison semantics                   | Compact records may use semantic lists instead                                          |
| [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                      | Tab-like exclusive controls need clear controlled relationships and keyboard behavior                            | Guides the scoped Basic/Recital selector if tab semantics are chosen        | Visual styling and whether tabs or segmented control are used remain open to Foundation |
| [W3C Internationalization techniques](https://www.w3.org/International/techniques/authoring-html.en)                      | Language metadata and script-aware wrapping are required for multilingual text                                   | Supports Korean/Japanese/English labels and title reflow                    | Exact typography requires Foundation testing                                            |
| [Korean Layout Requirements](https://w3c.github.io/klreq/)                                                                | Korean line breaking and typographic composition have language-specific constraints                              | Supports script-aware names, titles, and metadata                           | It does not determine NosLog visual identity                                            |

### Evidence Convergence

- Rhythm-game profile references converge on identity and current competitive standing
  before best performances and broader activity. None supports leading with currency,
  inventory, or account management.
- Activity profiles converge on separating high-level progress, selected highlights,
  and recent history instead of putting every event in the Profile overview.
- Privacy references converge on explicit disclosure for activity, playtime, and
  location-adjacent fields. They do not justify leaking hidden data through
  placeholders or generated assets.
- Dashboard and accessibility sources converge on one question per visualization,
  exact text summaries, stable states, and responsive hierarchy rather than a wall of
  equally weighted cards.
- Responsive and internationalization guidance converges on content-driven reflow,
  320px support, and variable-height multilingual rows rather than a fixed 390px
  product shell.
- No external source defines the exact NosLog public/private grouping, Basic/Recital
  scope, Rating source, five-item preview count, or exclusion of Brooch/NOS. Those
  decisions come from verified NosLog/NOSTALGIA behavior and explicit user approval.

## Rejected and Superseded Alternatives

- **Treat Basic/Recital as a page-global tab — Superseded:** it controls only the
  competitive summary, Progress over time, and Best Plays.
- **Show Basic and Recital summaries simultaneously on compact layouts — Rejected:**
  it raises opening density and weakens the active performance context.
- **Show an empty or disabled Recital Rating slot — Rejected:** the metric is present in
  both modes (`PROF-33`); an unavailable source uses the approved unavailable outcome, not
  a disabled placeholder.
- **Gate the Recital Rating slot on whether a Recital Pianist list is published —
  Rejected (2026-08-26):** the item count of the competitive summary would differ per
  player; runtime absence is a state, not a layout difference.
- **Overlay Official Grd and Rating in one chart — Rejected:** different scales and
  meanings make a dual-line chart misleading.
- **Use all four trend ranges as permanent buttons — Rejected:** one compact selector
  preserves the hierarchy.
- **Keep NosLog join date — Superseded:** Last played is the relevant NOSTALGIA
  activity context and is privacy-controlled.
- **Control Last played and Recent Plays independently — Rejected:** separate controls
  can contradict each other and leak hidden activity timing.
- **Render `Private` placeholders to visitors — Rejected:** hidden fields and modules
  are omitted entirely.
- **Make judgement owner-only — Superseded:** judgement becomes public competitive
  performance information with an explicit valid-data basis.
- **Show ten or unlimited Best/Recent items inline — Superseded:** use five-item
  previews and dedicated complete-list destinations.
- **Use automatic infinite scroll for complete lists — Rejected:** explicit bounded
  loading preserves position, history, and return behavior.
- **Keep Logout at the end of Profile — Rejected:** account termination belongs in the
  account/More or Settings context.
- **Show Brooch or NOS as persistent Profile metrics — Rejected:** they do not serve
  the approved public ability, progress, and record purpose.
- **Add social followers, messaging, or a status feed — Rejected:** no approved NosLog
  need justifies those modules.
- **Keep desktop inside a fixed 390px column — Rejected:** `390px` is a representative
  mobile canvas, not a desktop product width.

## Decision Log

| ID      | Decision                                                                                                              | Status                               |
| ------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| PROF-01 | Profile is a public Records-and-comparison destination centered on identity, ability, progress, and record evidence   | `Approved`                           |
| PROF-02 | Source order is identity, competitive summary, progress, Best Plays, record overview, then Recent Plays               | `Approved`                           |
| PROF-03 | Country marker sits beside username and mode exam labels sit below identity                                           | `Approved`                           |
| PROF-04 | NosLog account join date is removed                                                                                   | `Approved`                           |
| PROF-05 | Owner keeps compact Share and Settings actions and gains contextual sync freshness                                    | `Approved`                           |
| PROF-06 | Logout is removed from Profile body                                                                                   | `Approved`                           |
| PROF-07 | Basic/Recital selector controls only competitive summary, progress, and Best Plays                                    | `Approved`                           |
| PROF-08 | Official Grd remains official primary metric and Basic adds the approved NosLog Rating                                | `Approved`                           |
| PROF-09 | Recital Rating is structurally supported but omitted until its approved data source exists                            | `Superseded by PROF-33 — 2026-08-26` |
| PROF-10 | Competitive summary integrates mode Grd, conditional Rating, global rank, and country-category rank                   | `Approved`                           |
| PROF-11 | Progress defaults to 90 days with 30-day, 90-day, one-year, and all ranges in one selector                            | `Approved`                           |
| PROF-12 | Progress shows one selected metric at a time and exposes exact start/current/change text                              | `Approved`                           |
| PROF-13 | Overview shows five active-mode Best Plays and a complete-list destination                                            | `Approved`                           |
| PROF-14 | Rank distribution and judgement remain mode-neutral public record overview data                                       | `Approved`                           |
| PROF-15 | Profile-wide Play count is optional public information and never Clear count                                          | `Approved`                           |
| PROF-16 | Overview shows five mode-neutral Recent Plays when Play activity is public                                            | `Approved`                           |
| PROF-17 | Complete Best and Recent lists use explicit bounded loading and no infinite scroll                                    | `Approved`                           |
| PROF-18 | Always-public performance includes identity, exams, metrics, ranks, progress, Best, distribution, and judgement       | `Approved`                           |
| PROF-19 | User controls NOSTALGIA name, Discord, preferred arcade, Play count, and grouped Play activity                        | `Approved`                           |
| PROF-20 | Last played and Recent Plays share one Play-activity visibility control                                               | `Approved`                           |
| PROF-21 | Hidden visitor content is omitted without a `Private` placeholder                                                     | `Approved`                           |
| PROF-22 | Meaningful daily history is retained without a thirty-item cap and identical events/snapshots are not duplicated      | `Approved`                           |
| PROF-23 | Brooch, persistent NOS, arbitrary achievements, and social modules are excluded                                       | `Approved`                           |
| PROF-24 | Compact layouts reflow without document horizontal scrolling through 320 CSS px                                       | `Approved`                           |
| PROF-25 | Wide layouts use additional comparison space without becoming an unrelated dashboard                                  | `Approved`                           |
| PROF-26 | Use an owner-previewed 1200×630 card scoped to one selected mode                                                      | `Approved`                           |
| PROF-27 | Include public identity and available selected-mode competition context                                               | `Approved`                           |
| PROF-28 | Conditionally include only visible NOSTALGIA name, Play count, and preferred arcade name                              | `Approved`                           |
| PROF-29 | Omit hidden/missing fields and exclude Discord, activity, NOS, sync, address, and operations data                     | `Approved`                           |
| PROF-30 | Feature-detect system Share and provide save, supported copy, and accurate link fallbacks                             | `Approved`                           |
| PROF-31 | Provide a public-safe localized Open Graph card and invalidate it after privacy changes                               | `Approved`                           |
| PROF-32 | Provide a localized accessible equivalent and explicit loading, cancel, unsupported, and error behavior               | `Approved`                           |
| PROF-33 | Both modes expose NosLog Rating, each sourced from that mode's Pianist tier list                                      | `Approved — 2026-08-26`              |
| PROF-34 | The Basic/Recital selector is a two-segment segmented control attached to the performance region                      | `Approved — 2026-08-26`              |
| PROF-35 | Progress uses an underline metric switch with a compact range select on one secondary row                             | `Approved — 2026-08-26`              |
| PROF-36 | A missing avatar falls back to the first letter grapheme of the username, uppercased                                  | `Approved — 2026-08-26`              |
| PROF-37 | Best Plays rows use a two-axis composition: identity and play facts leading, contribution value trailing              | `Approved — 2026-08-27`              |
| PROF-38 | Best Plays carries its own contribution metric control; Official Grd is the default and switching re-queries the list | `Approved — 2026-08-27`              |

## Handoff Boundary

The active high-fidelity design stage may determine the final type scale, visual emphasis, surfaces, chart
appearance, column proportions, grid tracks, spacing, avatar fallback, country-marker
treatment, control styling, responsive transition points, and motion after Foundation
approval. It must preserve the approved source hierarchy, scoped Basic/Recital
behavior, metric meanings, privacy groups, five-item previews, complete-list access,
sync trust context, states, accessibility, localization, and acceptance criteria.

The later Codex implementation session must compare the final approved Figma output against this
brief. It must request a guide or design revision before implementing any result that
reintroduces the NosLog join date, exposes hidden content, treats Basic/Recital as a
global page mode, omits or fabricates Recital Rating, overlays Grd and Rating, caps retained
history at the overview count, uses infinite scroll, restores Logout or Brooch/NOS as
Profile priorities, keeps a fixed phone-width desktop shell, or otherwise conflicts
with the approved contract.
