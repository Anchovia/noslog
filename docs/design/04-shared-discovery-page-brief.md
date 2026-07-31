# NosLog 2.0 Shared Music and Published-Chart Discovery Page Brief

## Document Control

- Status: `In progress`
- Decision status: `Approved directions recorded; remaining page decisions open`
- Evidence status: `Repository inspection, current-product browser audit, approved
information architecture, approved Home handoff, and cited search/filter,
no-result-recovery, rhythm-game-record, result-card, responsive-interaction, and
accessibility guidance`
- Date started: 2026-07-30
- Canonical language: English
- Korean companion:
  [04-shared-discovery-page-brief.ko.md](./04-shared-discovery-page-brief.ko.md)
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Upstream Home brief:
  [03-home-page-brief.md](./03-home-page-brief.md)
- Scope: The shared user-facing Music and published-chart discovery surface in Music
  and Chart scopes
- Excluded: Music detail composition, focused chart-viewer composition, administrator
  chart search, final visual styling, and route implementation details

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

This brief is not approved as a whole while any material item in its decision register
remains `Open` or `Proposed`.

## Purpose

The shared discovery surface must help a user answer one of two questions without
forcing them to learn two separate catalogs:

1. **Music scope:** “Which Music entry am I looking for, and how do I reach its detail
   and records?”
2. **Chart scope:** “Which published chart do I want to inspect or play in the focused
   viewer?”

It must preserve the semantic difference between a Music entry and a difficulty chart
while reusing one search location, one query model, and one responsive interaction
system.

## Primary Context

- **Approved:** Mobile is the primary context, including short searches around arcade
  play where unnecessary confirmation and hidden state are costly.
- **Approved:** Desktop remains a required target and should use extra width for
  visible filtering and result comparison rather than retaining a centered `390px`
  phone canvas.
- **Approved:** The surface is public. Authentication adds personal-record filters and
  record context but must not be required for ordinary Music or published-chart
  discovery.
- **Approved:** Home can hand off an empty browse request, a submitted query, or a
  selected Home preview result to this surface.
- **Approved:** The Home Music destination opens Music scope. The Home and More Chart
  Viewer destinations open the same surface with Chart scope selected.

## Primary Tasks and Success Conditions

| Task                       | Entry                                           | Successful outcome                                                                                 | Important recovery                                                      |
| -------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Browse all Music           | Music destination or empty Music-scope handoff  | The user can inspect the complete Music catalog in batches without a hidden difficulty restriction | Change sort/filter, remove active criteria, or retry a failed batch     |
| Find a known Music entry   | Search field or Home query handoff              | The intended Music result is recognizable and opens its Music detail                               | Preserve and edit the query, change scope, or recover from no results   |
| Find a published chart     | Chart Viewer destination or Chart-scope handoff | Matching published difficulties are visible under the correct Music entry                          | Change query/filter or understand that no published chart matches       |
| Open a chart viewer        | Select a published difficulty in a Chart result | The focused viewer opens for that exact Music and difficulty                                       | Return to the exact discovery state and scroll position                 |
| Refine a broad result set  | Filter controls                                 | Results reflect understandable active criteria without accidental hidden defaults                  | Remove one criterion, clear all, cancel staged mobile changes, or retry |
| Continue a long result set | Explicit Load more control                      | The next batch is appended deliberately and current context is preserved                           | Retry incremental failure without losing already loaded results         |

## Current-Product Evidence

### Observed Repository Behavior

- `/[locale]/music` is the current public Music discovery route.
- The current query supports title, artist, and Music-index text search.
- It supports category, Normal, Hard, Expert, and Real difficulty selection; per-
  difficulty level ranges; name, level, recent-play, and weakness sorting; ascending
  and descending order; list and grid view; and fourteen signed-in record filters.
- When no difficulty query parameter is explicit, the current normalizer silently
  enables only Expert with a level range of `8–12`.
- Category, difficulty, and record toggles currently replace the route immediately.
  Range changes are debounced by `200ms` and committed again at interaction end.
- The current result query returns cursor-based batches of `20`.
- The current list uses an `IntersectionObserver` sentinel to fetch the next batch
  automatically when the sentinel enters the viewport.
- The current public discovery result is Music-centered. A dedicated Chart scope and
  its published-difficulty grouping do not yet exist.
- Public result data already includes the original Music title, optional approved
  localized title or Japanese reading, artist, category, background, and levels for
  Normal, Hard, Expert, and Real.
- Signed-out requests ignore personal record filters and personal sorts at the data
  layer.
- The inspected local dataset contains `583` Music entries and `2,180` MusicChart
  entries. `title_kana` is populated for all `583` Music entries, while only `3`
  MusicChart entries currently have `released_at`.
- The source import catalog in `prisma/data/nosdata-musics.json` contains `578` entries.
  Original-title length has a median of `11` characters, a 90th percentile of `25`,
  and a maximum of `54`; `178` titles contain at least `15` characters and `92`
  contain at least `20`. Artist length has a median of `10`, a 90th percentile of
  `34`, and a maximum of `67`; `218` artists contain at least `15` characters and
  `172` contain at least `20`. This source-file audit is separate from the
  `583`-row local database audit above and demonstrates that long title and artist
  handling is a normal case rather than an edge case.
- The same dataset contains no published ChartPattern and no MusicTranslation entries.
  These are readiness constraints for representative Chart and localization testing,
  not reasons to weaken the approved product model.
- Music `created_at` and `updated_at` describe import or maintenance activity and must
  not be presented as an official “new Music” date.

### Observed Browser Baseline

The approved current-product audit verified `/ko/music`, `/ja/music`, and `/en/music`
at a narrow `390px` viewport and a wide desktop viewport.

- Search, filters, sorting, view controls, and results were usable without document-
  level horizontal overflow.
- The current wide layout remains visually constrained by the general `390px` shell.
- Japanese content produced a longer page than Korean and English, reinforcing the
  need to test real localized labels and title lengths.
- A focused `2026-07-31` progressive-loading audit found that the current first
  `20` results occupy approximately two `390px` List viewports and three-and-a-half
  Grid viewports. In the current List markup, the page contained `464` DOM elements
  at `20` results, `764` at `40`, and `1,073` at `60`.
- These observations confirm available functionality. They do not approve the current
  default Expert filter, automatic loading, visual density, card composition, or
  desktop width. The DOM counts are a performance test baseline for the future
  component, not a fixed 2.0 markup budget.

## Approved Discovery Model

### One Shared Surface, Two Scopes

- Use one shared discovery surface for Music and published-chart search.
- Place a compact scope selector in the leading area of the search field.
- The collapsed selector uses the active scope icon and an expansion cue. The opened
  control provides visible localized text for **Music search** and **Chart search**.
- Do not add a permanently visible row of Music/Chart mode buttons above the search
  field.
- Keep the current query when switching scope unless later usability evidence shows
  that retained text creates meaningful misunderstanding.
- Represent the active scope in shareable and history-restorable URL state. Exact
  path-versus-query syntax remains an implementation decision.
- Search cues, result summaries, empty states, and result actions must reinforce the
  active scope; the icon alone is not sufficient.

### Music-Scope Default Browse

- An empty Music-scope query exposes the complete Music catalog over explicit batches.
- Do not silently restrict the initial catalog to Expert or to levels `8–12`.
- “Complete catalog” means every eligible Music entry can be reached through the
  approved `20`-result progressive-loading contract. It does not determine visual card
  density.
- A user-selected difficulty or level range remains a filter and must be shown as
  active state rather than becoming an invisible default.

### Chart-Scope Result Grouping

- Return only Music and difficulty targets that have a published public chart matching
  the active query and filters.
- Group matching targets as one result card or result unit per Music entry.
- Inside that Music result, expose only the published matching difficulties.
- Selecting a published difficulty opens that exact focused chart viewer directly.
- Do not create one visually independent top-level result card for every difficulty
  when the difficulties belong to the same Music entry.
- Do not show an unpublished difficulty as if it were selectable and then explain the
  failure after selection.

### Approved Browse Ordering and Sort Semantics

- With an empty query, Music scope orders the complete eligible catalog by
  `title_kana` ascending. This Japanese-reading order remains stable regardless of
  whether the optional translated/read-title caption is visible.
- With an empty query, Chart scope orders Music groups by their latest published-chart
  timestamp descending. Within a group, selectable targets remain in the stable
  `Normal → Hard → Expert → Real` order.
- Music scope must offer a **newest Music** sort after a verified official Music-level
  release-date field is populated. Do not substitute Music `created_at`,
  `updated_at`, or chart-import timestamps. The data mapping for later-added
  difficulties must be reviewed before implementation.
- A non-empty text query defaults to **Relevance** only when the user has not selected
  another sort in the current discovery state. Relevance ranks closer and exact
  matches across the stable Music identifier, original title, approved localized or
  read title, and artist ahead of weaker partial matches; exact weighting and tie
  tuning remain an implementation concern.
- A user-selected sort persists through text and filter changes. If the query is
  cleared while Relevance is active, return to the active scope's approved empty-query
  order. Relevance is not an empty-query browse option.
- Music scope offers Relevance for active text search, Japanese-reading order, newest
  Music when the verified data gate is satisfied, level order with an explicit target
  difficulty, and signed-in recent-play order.
- Chart scope offers Relevance for active text search, latest published-chart order,
  Japanese-reading order, level order with an explicit target difficulty, and
  signed-in recent-play order.
- Remove the current **weakness** sort. Its opaque composite score does not map to an
  approved, understandable discovery goal.
- A level sort is valid only after the user explicitly selects its target difficulty.
  Never silently use Expert or derive one representative level from several
  difficulties.
- Outside the sort control, show only the current sort summary. The target difficulty
  belongs inside progressive disclosure rather than in a permanent
  `Normal / Hard / Expert / Real` button row.
- Direction controls belong inside the sort surface rather than becoming additional
  permanent buttons. Contextual requirements such as the level-sort target appear
  only after the corresponding sort is selected.

### Approved Filter Taxonomy

- Public Music and Chart discovery share only domain-relevant filters: official Music
  category, Normal/Hard/Expert/Real difficulty, and level range for the selected
  difficulty targets.
- Chart scope inherits Music identity and category while restricting results to
  published matching chart targets. Publication eligibility is intrinsic to the
  scope, not a redundant visible filter.
- Do not invent chart-author, community-rating, marketplace-status, or generic tag
  filters while NosLog has no approved public data or user need for them.
- Signed-in personal-record refinement remains a secondary disclosed group as defined
  below. It does not change the public taxonomy.

## Search Interaction

### Active Text Search

- **Approved:** On the complete discovery surface, update results after an IME-safe
  `300ms` period with no additional text input.
- Do not require a separate Search-button press for ordinary text refinement.
- Preserve the user's query when no result is found. Never clear the field as error
  recovery.
- Pressing Enter may immediately commit the current query and should not create a
  second, semantically different search behavior.
- Newer query or scope changes invalidate older results. Out-of-order responses must
  never replace results for the current state.
- The URL may update after the settled query is committed, but keystroke-level history
  entries must not make Back navigation unusable.

### Home Handoff

- A Home preview selection may open the relevant Music detail or focused chart target
  directly when the target is unambiguous.
- A Home “view all results” action opens this surface with the exact query and scope
  preserved.
- Empty Home submission opens the selected scope's browse state without an empty `q`
  parameter.
- This surface owns complete filters, sorting, batching, and result recovery; Home must
  not duplicate them.

## Filter and Sort Application Model

The approved model is responsive and task-sensitive, not one universal “instant” or
“Apply” rule.

### Mobile and Other Result-Obscuring Layouts

- Provide one clearly labelled **Filter and sort** trigger rather than permanent
  independent Filter and Sort buttons. A badge counts applied filters only; the
  always-present sort choice is not counted as an applied filter.
- Keep the committed result count and current sort visible outside the layer, for
  example as the semantic equivalent of “583 Music · Relevance.” Do not make the
  trigger the only place where the current order can be understood.
- Treat that result summary as its own stable semantic focus target. This requirement
  does not force the summary and Filter-and-sort trigger into separate visual rows;
  their same-row or split-row composition remains a `390px` specimen decision based
  on available width and Korean, Japanese, and English content.
- Open one full-screen or near-full-screen layer when the result collection cannot
  remain meaningfully visible beside the controls.
- Keep Sort, public filters, and the signed-in personal-record group as clearly
  separated sections inside that layer. Place Sort first so combining the entry point
  does not make it undiscoverable or imply that sorting is a multi-select filter.
- Let the user stage the sort and multiple category, difficulty, range, and
  personal-record changes without replacing the obscured result collection after
  every selection.
- Use one sticky primary action labelled as a return to the result task, not as
  administrative confirmation: **View results** or, when a valid count is ready,
  **View N results**.
- The primary action simultaneously commits the staged sort and criteria and closes
  the layer. Do not require a second Close action after applying.
- After that successful commit, reveal the result-summary position and move
  programmatic focus to the summary rather than the returning trigger or first result.
  Do not open or select a result automatically.
- The generic **View results** label remains usable while a result count is pending;
  count calculation must not block completion.
- Back or Close exits without committing staged changes and restores the previously
  applied sort and filter state, prior scroll context, and focus to the invoking
  Filter-and-sort trigger.
- Applied filters remain visible near the result summary after the layer closes.
- Music's list/grid view choice remains a separate compact view control because it
  changes presentation rather than result membership or order. Chart scope does not
  show that control.

This is not treated as an extra task step: a user in a result-obscuring layer must
return to the results in either model, and the primary action combines that necessary
return with sort/filter commitment.

### Desktop and Other Result-Visible Layouts

- Keep Filter and Sort as distinct compact controls. Filter may expose an anchored
  region or rail according to available content width; Sort uses a directly labelled
  single-choice control.
- Keep the main result collection visible beside or near exposed filter controls.
- Apply discrete filter choices immediately because the user can see the resulting
  change.
- Apply a selected sort immediately. Keep its current value visible without adding a
  permanent row of all sort alternatives.
- Debounce text-like or continuous controls. A range control must not issue a result
  request for every pointer pixel; update after a short settled interval or when the
  interaction is committed.
- Keep filter controls stable while only the result region communicates loading.
- Preserve focus and nearby scroll context instead of remounting the entire page.

### Applied-State Actions

- Removing an applied filter from the result summary applies immediately on every
  viewport.
- Clearing all applied filters also applies immediately and restores the approved
  default browse state for the active scope.
- Applied criteria, result count, and results must describe the same committed state.
  Pending mobile selections must not be presented as already applied.
- Filters and sorting that change the result set reset batching to the first batch.
- Request cancellation, stale-response rejection, and cache/query optimization should
  protect performance rather than adding a universal confirmation step.

### Approved Authenticated Personal-Record Refinement

Personal-record refinement is an advanced, signed-in capability. It must remain
secondary to public Music and Chart discovery rather than becoming a permanently
expanded primary filter group.

- Retain the domain-relevant status and goal criteria: **Unplayed**, **S**, **FC**, and
  **Pianist**.
- Remove **played in the last 30 days**. Its only distinct benefit is a low-evidence
  time-window intersection with other filters, while signed-in **recent-play order**
  already supports returning to recently played Music without another persistent
  criterion.
- Do not provide a **Clear** filter. NOSTALGIA does not use clear status as a useful
  discovery distinction here, so the current control does not separate a meaningful
  user goal.
- Provide one judgement-level numeric refinement: an inclusive **MISS count** range
  with optional minimum and maximum bounds. An empty bound means unbounded.
- Evaluate MISS count against the user's best stored record for each eligible
  difficulty, not the latest play and not a combined MISS+NEAR percentage.
- Criteria from different groups combine with `AND`; multiple values inside one group
  combine with `OR`.
- **Unplayed** is mutually exclusive with all achieved-record criteria and has no
  meaningful recent-play order. The controls must not produce an impossible or
  meaningless query; the exact transition between an active Unplayed filter and
  recent-play sort remains a small prototype decision.
- Remove discovery filters for ◆JUST rate, MISS+NEAR rate, FAST/SLOW tendency, and
  Standard, Tenuto, Glissando, or Trill success rate. These remain analysis data for
  record-detail contexts where they are interpretable.
- Do not promote MISS count into the default public filter set. It belongs in the
  progressively disclosed signed-in record group because it serves focused practice
  planning rather than ordinary catalog browsing.

Keep this group collapsed after public filters until a signed-in user explicitly opens
it. For signed-out users, omit the entire personal-record group rather than showing
disabled criteria or an embedded login invitation. Ordinary discovery remains public,
and authentication promotion must not add noise to the refinement task.

## Explicit Progressive Loading

- Do not automatically load more results from scroll position.
- Return `20` result units initially and append `20` more per activation. A Music
  result unit is one Music entry; a Chart result unit is one Music group containing
  its eligible published difficulty targets.
- Keep the same logical batch size in Music and Chart scopes, List and Grid views, and
  narrow and wide layouts. A responsive view change must not silently add or remove
  result units.
- Provide a clearly labelled **Load more** control after the current collection when
  another batch exists. Its visible localized label is based on the next actual
  amount: **Load 20 more results**, or **Load 3 more results** when only three remain.
- Show exact committed-query progress when the count is available, such as
  **Showing 20 of 583**. While an exact count is still pending, show the visible count
  without inventing a total.
- Activating it appends the next batch without removing or reordering the already
  visible collection.
- Keep the control location stable during loading, change its label to a localized
  **Loading…** state, mark the result region busy, and prevent duplicate activation.
- After a successful append, move focus to the first newly added actionable result and
  announce the amount added and new visible progress through a restrained polite
  status message. This is a user-initiated continuation, not an automatic focus change
  caused by ordinary search refresh.
- An incremental-load failure leaves existing results intact and offers a retry at the
  same location while retaining focus on the failed action.
- When no further result exists, remove the action and communicate a localized
  **You have viewed all results** completion state; do not leave a disabled control
  without explanation.
- Keep durable discovery criteria—scope, query, applied filters, sort, and view—in the
  shareable URL. Keep the loaded result count, selected-result anchor, and meaningful
  scroll position in that browser history entry rather than adding ephemeral batch
  state to the public URL.
- Returning from Music detail or the focused chart viewer must rehydrate the previously
  loaded `20`-result batches before restoring the selected-result anchor and nearby
  reading position. Opening a copied URL in a fresh history context starts from the
  first `20` results.
- Validate the future 2.0 result component with `20`, `60`, and `100` accumulated
  results on representative mobile and desktop browsers. Optimize card markup,
  jacket lazy loading, and rendering before mandating virtualization. Introduce
  accessible windowing only if measured interaction, memory, or DOM cost still
  requires it; do not change the approved user-facing `20`-result batch contract
  silently.

## Content and Functional Requirements

### Always-Available Structure

1. Ordinary responsive header and skip link
2. Page identity and concise active-scope context
3. Scope-aware search field
4. Filter and sort access
5. Result summary with committed filter state
6. Music- or Chart-scope result collection
7. Explicit progressive-loading control when needed
8. Ordinary footer

The final visual order and grouping may adapt with width, but the search, committed
state, results, and recovery controls must keep a clear semantic relationship.

### Required Result Data

#### Music Scope

- Stable Music identifier
- Jacket image
- Original title
- Selected approved Korean or English title, or Japanese reading, when enabled and
  available
- Artist when available
- Category context
- All available official difficulty and level information
- Enough destination context to predict that selection opens Music detail
- User-controlled list and jacket-forward grid views

#### Chart Scope

- Stable Music identifier and identity
- Original and selected localized/read-title treatment
- Artist when useful for disambiguation
- Only published matching difficulty targets
- Difficulty and level for every selectable target
- A direct, unambiguous focused-viewer destination per selectable difficulty

### Approved Result-View Structure

- Music scope opens in the list view. Users may switch to the jacket-forward grid
  view when visual recognition is more useful.
- Chart scope uses one grouped list presentation only. Do not add a Chart grid toggle:
  the primary action is selecting a published difficulty target under the correct
  Music identity, not comparing jackets.
- A Chart result presents Music identity first and then its published matching
  difficulty targets in the stable difficulty order.
- Do not add a permanent row of difficulty controls above either result collection.
  Filters, level-sort targets, and Chart destination targets have different meanings
  and must not be collapsed into one visually repetitive control strip.
- Preserve the useful structural model of the current NosLog Music list and grid as
  the 2.0 baseline, but specify it through the rules below. A screenshot or an
  instruction to “reuse the current UI” is not a sufficient downstream specification.
- Exact typography, spacing, color, and motion tokens remain Foundation and component-
  specimen work. Those token choices may refine the visual expression but must not
  silently change the approved content order, density boundaries, or interaction
  model. Exact Chart-row visual anatomy remains part of the later Chart result
  specification.

### Approved Music Result Anatomy and Density

#### Shared identity and activation

- Each Music result is one whole-card link to Music detail. Official difficulty values
  are compact information, not separate navigation buttons.
- Keep the title group in this order:
    1. optional approved localized title or Japanese reading, as the smallest and
       lowest-emphasis caption;
    2. original title, as the largest and strongest identity;
    3. artist, as secondary identity below the title group.
- Keep the localized/read caption visually close to the original title so they read as
  one title group. Use a clearer separation before the artist. When the optional
  caption is disabled or unavailable, collapse its space completely.
- Keep category visible as a small text badge over the jacket. Do not depend on badge
  color alone, and do not place category inline with the artist.
- Preserve complete original title and artist values in the accessible name and Music
  detail even when a discovery card visually truncates them.

#### List view

- Keep the jacket at `56px` and the compact trailing official-difficulty group at
  approximately the current `92px` total width, using `20px` badges as the structural
  baseline. Difficulty remains in this trailing group rather than moving to a
  dedicated row.
- Use content-driven card height instead of one enlarged fixed row. A short result
  without a localized/read caption may remain near `64px`; a typical localized result
  may grow to about `80px`; a two-line original title may grow to approximately
  `96–100px`.
- Limit the localized/read caption to one line, the original title to two lines, and
  the artist to one line with ellipsis. Missing artist or localization must not leave
  a blank structural row.
- At the audited `390px` baseline, the result card is approximately `343px` wide and
  the compact trailing difficulty group remains preferable to a vertical difficulty
  row.
- Use one List column while the result region cannot give each card approximately
  `440–460px` of usable width. Add a second column only when both cards can preserve
  that minimum. List view stops at two columns; denser artwork browsing belongs to
  Grid view. This switch follows result-container capacity, not a device-name
  breakpoint.

#### Grid view

- Keep every jacket exactly square with `aspect-ratio: 1 / 1`. The complete card does
  not need to be square.
- Let the information region below the jacket grow independently. Preserve a
  consistent two-line artist slot across cards, truncating after the second line, so
  difficulty positions and row alignment remain stable.
- Use the same localized/read caption → original title → artist hierarchy as List,
  with the category text badge over the jacket and official difficulty information
  below the identity.
- Use two columns at the `390px` mobile baseline. Wider result regions may add columns
  according to a validated minimum readable card width; exact Foundation breakpoints
  remain open, while the intended range is roughly three to five columns rather than
  stretching two cards.
- The audited mobile card is approximately `168 × 261px`. Reserving one additional
  artist line may increase it to about `168 × 279px`, roughly seven percent, without
  distorting the square jacket.

### Approved Personal-Record Preview

- Keep the resting Music result focused on Music identity. Do not add a permanent
  per-record explanation line merely because a personal filter or sort is active;
  committed criteria remain visible in the result summary.
- On devices that report both hover capability and a fine pointer, hovering a result
  reveals a concise personal-record preview. Do not infer this capability from
  viewport width. Keyboard focus exposes equivalent information and interaction.
- The preview is an alternate state of the same result card, not a separate popup,
  expanding panel, action, or replacement for only the trailing difficulty group. Its
  appearance must not change card dimensions or shift the result layout.
- In List view, keep the jacket image clear while dimming or obscuring the other
  resting information, including title text, artist, category badge, and official
  difficulties. Place the record preview in that non-jacket region.
- In Grid view, dim or soften the complete resting card, including the jacket, and
  place the record preview over the card.
- With one active difficulty filter, preview the matching difficulty record. With
  several active difficulty filters, show the records for all difficulties that
  actually match. With no difficulty filter, preview the user's most recently played
  difficulty for that Music.
- The compact record line contains the difficulty, ◆JUST rate, absolute MISS count,
  and achieved state when available; for example:
  `Expert · ◆JUST 92.4% · MISS 3 · FC`.
- ◆JUST and JUST remain separate NOSTALGIA judgements. Do not rename ◆JUST as
  “S-Just” in user-facing copy.
- Touch layouts do not emulate hover, reveal on first tap, use long press, or add a
  record-preview button. One tap follows the whole-card link directly to Music detail,
  where the full record context is available.
- Keep the preview present until pointer or focus leaves or the user dismisses it with
  Escape. Enter continues to activate the Music-detail link. Reduced-motion
  preferences minimize the transition.
- Near, FAST/SLOW, and note-type success rates remain available in detailed record
  analysis but are not part of the compact discovery preview.

The required Music fields, list-default/grid-optional model, Music card anatomy and
density boundaries, capability-based preview, and Chart grouped-list model are
approved. Foundation tokens and exact Chart-row visual anatomy remain downstream
specification work rather than unresolved Music-card structure.

## State Requirements

| State                           | Required behavior                                                                             | Status              |
| ------------------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| Initial Music browse            | Show the complete eligible catalog by `title_kana` ascending with no hidden difficulty limit  | `Approved`          |
| Initial Chart browse            | Show published Music groups by latest published-chart timestamp descending                    | `Approved`          |
| Music newest sort unavailable   | Omit or explain the option until verified official Music-level release dates are populated    | `Approved`          |
| Level sort target missing       | Require an explicit difficulty selection; never fall back silently to Expert                  | `Approved`          |
| Weakness sort                   | Do not provide the current opaque composite weakness order                                    | `Approved`          |
| Active query without user sort  | Use Relevance; preserve any explicit user-selected sort through later query/filter changes    | `Approved`          |
| Settled active search           | Replace the result set after `300ms` idle and synchronize committed URL state                 | `Approved`          |
| Fast response                   | Update without flashing a transient loading treatment                                         | `Proposed`          |
| Slow initial or filter response | Keep search/filter controls stable and communicate busy state in the result region            | `Proposed`          |
| No matching Music               | Preserve query and controls; show only `No matching songs.`                                   | `Approved`          |
| Filter-constrained Music        | Preserve query and controls; show only `No songs match these conditions.`                     | `Approved`          |
| No published Chart              | Preserve query, filters, scope control, and show only `No published charts.`                  | `Approved`          |
| Initial retrieval failure       | Preserve controls and state; provide retry without redirecting away                           | `Proposed`          |
| Mobile sort/filter open         | Keep Sort and filter sections distinct; stage both separately from committed result state     | `Approved`          |
| Mobile result count pending     | Keep a usable generic **View results** action                                                 | `Approved`          |
| Mobile View-results commit      | Commit and close; focus the result summary without auto-opening the first result              | `Approved`          |
| Mobile layer close/back         | Discard staged changes; restore committed state, prior context, and trigger focus             | `Approved`          |
| Signed-out personal filter      | Omit the personal-record group; do not show disabled criteria or an embedded login invitation | `Approved`          |
| Signed-in record refinement     | Keep approved record criteria in a secondary advanced group                                   | `Approved`          |
| MISS range active               | Match the inclusive bounds against the best eligible difficulty record                        | `Approved`          |
| Unplayed conflict               | Prevent achieved-record criteria; do not leave recent-play order active as meaningful state   | `Approved` / `Open` |
| Hover-capable record preview    | Reveal equivalent compact record context on fine-pointer hover and keyboard focus             | `Approved`          |
| Touch result                    | Keep the resting card stable and expose full record context at the destination                | `Approved`          |
| Load more pending               | Keep existing results, expose localized busy status, and prevent duplicate activation         | `Approved`          |
| Load more success               | Append the next `20`-unit batch, focus its first actionable result, and announce new progress | `Approved`          |
| Load more failure               | Keep existing results and action focus; provide localized retry at the same location          | `Approved`          |
| End of results                  | Remove the action and communicate completion without automatic additional loading             | `Approved`          |
| Return from destination         | Rehydrate loaded batches, then restore the selected-result anchor and nearby reading position | `Approved`          |

### Approved No-Result Classification and Recovery

The result service must classify a settled zero-result response internally before it
selects copy. This classification supports truthful copy, analytics, and browser
acceptance tests; it must not produce a diagnostic paragraph in the interface.

1. Treat retrieval, permission, or transport failure as an error state with retry,
   never as a no-result state.
2. When committed filters are active, test the same committed query and scope without
   those filters. If published results then exist, classify the state as
   filter-constrained.
3. In Chart scope, if the committed query and compatible filters identify Music or
   difficulty candidates but none has an eligible published `ChartPattern`, classify
   the state as no published Chart. Filter-constrained recovery takes precedence when
   removing the filters would reveal published Charts.
4. When a non-empty query still identifies no Music after filter removal, classify it
   as a text mismatch.
5. When query and filters are both empty, distinguish an actually empty Music catalog
   from search mismatch. Route that service-level absence to a separate no-data state
   instead of inventing search guidance. This approval does not define new visible
   copy or actions for that separate state. An empty Chart catalog uses the approved
   no-published-Chart state.

Approved visible behavior:

- Keep the committed query, scope, sort, view, and applied filters unchanged.
- Keep the search field, scope selector, applied-filter chips, individual removal,
  and the single clear-all-filters control available in their normal locations.
- Clearing all filters removes filters only. It preserves query, scope, sort, and
  List/Grid choice.
- Render one short scope-appropriate result statement. Do not add supporting
  paragraphs, recovery instructions, illustrations, recommendations, or actions
  inside the empty result region.
- Do not duplicate **Clear query**, **Clear filters**, **Search Music**, **View Music
  information**, or similar actions in the empty state. The visible search, scope,
  and filter controls already provide those recovery paths.
- Do not silently clear or broaden the query, remove filters, switch scope, or replace
  the empty result with popular or unrelated Music.
- Announce only the settled one-line result state through a pre-existing polite
  status region. Do not use an alert or move focus merely because the result count
  became zero.

## Responsive Requirements

### Narrow Layout

- Preserve one strong vertical task sequence: scope-aware search, compact committed
  state, results, then explicit Load more.
- Keep dense controls out of the permanent content column. Open Sort and Filter through
  one labelled trigger into the approved result-obscuring layer, with the current sort
  and applied-filter count still visible in the result summary.
- Do not add a mobile-only bottom navigation or a persistent row of scope/filter
  buttons.
- Ensure the software keyboard, Korean/Japanese IME composition, browser chrome, and
  compact viewport height do not hide the filter completion action.
- Result cards must tolerate long Japanese titles and multi-line translated captions
  without horizontal overflow.
- At the `390px` baseline, use two Grid columns and one List column. Preserve square
  Grid jackets and let only the lower information region grow for long content.

### Wide Layout

- Do not stretch a `390px` mobile canvas across a desktop.
- Use additional width to keep results visible with an exposed filter rail or region
  and to improve Music/difficulty comparison.
- Keep Filter and Sort as separate directly labelled controls, with immediate
  result-visible application.
- Preserve one search and scope model rather than introducing desktop-only taxonomy.
- Do not place unrelated announcements or navigation in space intended to support
  search, filtering, or result comparison.
- Set a readable outer content boundary after representative result-card testing;
  exact container and column tokens remain open.
- Keep List cards at one column below approximately `440–460px` of usable width per
  card, use two columns only when that width is available for both, and never exceed
  two List columns. Grid may add columns from roughly three through five according to
  validated minimum card width.

## Accessibility Requirements

- Provide an explicit accessible name for the search field that includes or is
  programmatically associated with the active scope.
- The compact scope selector must expose its selected value, expanded state, controlled
  popup, keyboard operation, visible text choices, and predictable focus return.
- Search updates must not move focus on every result refresh.
- Result-count updates use restrained live-region semantics and must not announce
  intermediate stale responses.
- A settled no-result message uses the same pre-existing polite status region and
  announces only the concise localized statement. It does not receive focus, use
  alert semantics, or repeat visible recovery controls as prose.
- The mobile Filter-and-sort layer requires an accessible name and contained focus
  while modal. Escape, Back, or explicit Close discards staged changes, preserves the
  prior result reading position, and returns focus to the invoking trigger.
- The combined trigger's accessible name must communicate the feature, committed
  applied-filter count, and current sort without treating the sort as another filter.
- The mobile completion action must remain reachable at browser zoom and compact
  viewport heights.
- **View results** commits staged values, closes the layer, reveals the stable result
  summary, and moves programmatic focus to that summary. The summary communicates the
  committed scope, result count or settled result state, and current sort without
  becoming an action or automatically selecting the first result.
- Use the same DOM focus destination across touch, keyboard, and screen-reader input.
  A visible focus treatment is required for keyboard navigation and may use
  `:focus-visible` so pointer activation does not add a persistent ornamental ring.
- If the settled result is already available when the layer closes, the focused
  summary provides the orientation and the same count must not be announced twice. If
  the result request is still pending, expose the result region as busy and announce
  one settled count, concise no-result statement, or failure politely when it
  completes. Submitting unchanged staged values still returns to the summary but does
  not claim that the results changed.
- This mobile post-commit focus rule does not prescribe whether the visible summary
  shares a row with the Filter-and-sort trigger. Exact grouping is validated later
  with narrow and localized specimens; the summary must remain a distinct semantic
  element either way.
- Applied-filter removal controls must include the category and value in their
  accessible names.
- Information revealed by pointer hover in the personal-record preview must also be
  available on keyboard focus. The preview must not contain the only accessible name
  or the only indication of committed filter state.
- A preview that obscures resting content must be dismissible with Escape, remain
  available while hover or focus persists, preserve Enter activation of the whole-card
  link, and avoid layout movement.
- Touch users must not need a synthetic hover step before activating a result.
- **Load more** must be a keyboard-operable explicit control. Because appended
  actionable results precede the relocated control in document order, a successful
  user-initiated append moves focus to the first new result and announces the added
  count and visible progress. Failure retains focus on the action.
- The result region exposes `aria-busy` only while its current update is incomplete,
  and a polite status region announces one settled loading, success, failure, or
  completion message without repeating intermediate states.
- Use semantic result headings/lists and one page-level `main` landmark.
- Meet WCAG 2.2 target-size or target-spacing requirements for scope, filter, clear,
  result, and progressive-loading controls.

## Localization Requirements

- Validate all visible and accessible labels in Korean, Japanese, and English.
- Preserve the original Music title as the primary identity.
- When the title-display preference is enabled, show the approved Korean/English title
  or Japanese reading above the original title as a smaller secondary caption without
  replacing the original title.
- In List, cap the caption at one line, original title at two lines, and artist at one
  line. In Grid, reserve two artist lines. Preserve complete values in the accessible
  name and detail destination so visual truncation never removes the only complete
  identifying text.
- Text search and the `300ms` idle trigger must be composition-safe for Korean and
  Japanese IME input.
- Dynamic result counts, visible ranges, and Load-more amounts require locale-aware
  number and grammar handling; do not construct them through unsafe string
  concatenation.
- Use the approved visible progressive-loading copy pattern:
    - Korean: `결과 20개 더 보기`, `583개 중 20개 표시`,
      `모든 결과를 확인했습니다.`
    - Japanese: `結果をあと20件表示`, `583件中20件を表示`,
      `すべての結果を確認しました。`
    - English: `Load 20 more results`, `Showing 20 of 583`,
      `You have viewed all results.`
      Replace `20` with the actual next amount for a final partial batch. The accessible
      action name additionally identifies the active Music- or Chart-search context
      without lengthening the visible label.
- Scope, filter, difficulty, result-state, retry, and end-state copy must be complete
  in all three locales before the page family is accepted.
- Use the approved visible no-result copy without an explanatory subtitle:
    - Text mismatch — Korean: `일치하는 악곡이 없습니다.`; Japanese:
      `一致する楽曲がありません。`; English: `No matching songs.`
    - Filter-constrained Music — Korean: `조건에 맞는 악곡이 없습니다.`; Japanese:
      `条件に一致する楽曲がありません。`; English:
      `No songs match these conditions.`
    - Chart scope with zero published results — Korean:
      `공개된 채보가 없습니다.`; Japanese: `公開された譜面がありません。`;
      English: `No published charts.`
      These strings are complete visible states, not headings that require body copy.
- Query and filter URL values remain stable technical identifiers where translating
  them would break sharing or implementation mapping.
- Empty Music browse uses `title_kana` as its technical ordering key in every locale.
  Translation display preferences change visible secondary text, not catalog order.
- Sort labels, direction, and an explicit level-sort difficulty target require complete
  Korean, Japanese, and English names. Do not expose a difficulty target through color
  or an abbreviation alone.

## Reference Comparison

The references below were compared for interaction principles, not copied as visual
templates. Commerce evidence is used only where the filtering task transfers to
NosLog; enterprise and government systems are structural and accessibility references,
not NosLog art direction.

| Source                                                                                                                              | Transferable principle                                                                                                                    | NosLog application                                                                                                   | Limitation                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [SAP Fiori: Filter Bar](https://www.sap.com/design-system/fiori-design-web/ui-elements/filter-bar/)                                 | Live update is more convenient when feasible; manual update is appropriate for multiple required values or excessive traffic.             | Use live result-visible desktop filters and staged result-obscuring mobile filters.                                  | Enterprise list reports are denser and more configurable than NosLog.                                       |
| [SAP Fiori Android: Sort and filter](https://www.sap.com/design-system/fiori-design-android/v26-1/patterns/sort-and-filter/usage)   | Sort and filter may share one compact-screen full-screen dialog while remaining separate sections.                                        | Supports one explicitly labelled mobile entry and internal separation, without imposing the same anatomy on desktop. | Enterprise application frequency and terminology differ from NosLog.                                        |
| [CXL: Mobile ecommerce guidelines](https://cxl.com/wp-content/uploads/2019/05/Mobile-CUX-Ecommerce-Report.pdf)                      | Separate controls maximize distinction, while a clearly labelled combined **Sort and filter** control remains feasible.                   | NosLog chooses the combined narrow trigger because current sort remains visible and internal sections stay distinct. | Commerce conversion evidence does not establish NOSTALGIA feature priority.                                 |
| [Shopify: Storefront filtering UX](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering-ux) | Mobile filter interfaces commonly move behind one labelled drawer or modal trigger instead of retaining a desktop sidebar.                | Supports removing dense permanent mobile controls and preserving a result-adjacent entry.                            | The guidance focuses on storefront filters and does not decide NosLog sort semantics.                       |
| [Carbon: Filtering](https://carbondesignsystem.com/patterns/filtering/)                                                             | Instant update fits one expected choice; batch update fits several categories or slow responses.                                          | NosLog's many categories, ranges, and personal filters require more than one universal rule.                         | Carbon examples emphasize enterprise data products.                                                         |
| [Dell Design System: Filter](https://delldesignsystem.com/patterns/filter)                                                          | Dynamic filtering removes Apply but can distract; batch filtering supports complex multi-select and slow data.                            | Keep desktop feedback visible and let mobile users finish multiple changes before replacing obscured results.        | Its “batch as safe default” is not a substitute for NosLog testing.                                         |
| [NSW Design System: Filters](https://designsystem.nsw.gov.au/components/filters/)                                                   | Instant and batch models depend on expected action count; mobile batch uses a sticky Apply action that also closes the filter view.       | The NosLog mobile **View results** action combines commit and return, avoiding a separate close step.                | Government search content differs from a rhythm-game catalog.                                               |
| [Visa Product Design System: Filters](https://design.visa.com/patterns/filters/)                                                    | Repeated instant reloads can disorient; applied chips and clear state must remain explicit.                                               | Keep committed filters visible and make chip removal immediate.                                                      | Visa generally prefers Apply and may overfit transaction/data workflows.                                    |
| [DWP Design System: Filter research](https://design-system.dwp.gov.uk/research/filters/design-notes)                                | Batch prevents repeated refresh, but pending and committed state can become unsynchronized; result count and applied tags bridge the gap. | Visually separate staged mobile values from committed result state and show count/applied criteria after return.     | The published research favors batch overall and must be balanced against NosLog's faster consumer task.     |
| [Scottish Government: Search filters](https://designsystem.gov.scot/patterns/search-results/search-filters)                         | Mobile results should not update invisibly behind opened filters; desktop may update automatically.                                       | Supports responsive filter application instead of one behavior on every width.                                       | Public-service content and filtering frequency differ.                                                      |
| [VA.gov: Search Filter](https://design.va.gov/components/search-filter)                                                             | Multi-facet results need explicit apply/reset behavior and careful focus communication.                                                   | Informs mobile commit, reset, error, and accessibility requirements.                                                 | It mandates Apply more broadly than the approved NosLog desktop behavior.                                   |
| [Maersk: Filter patterns](https://designsystem.maersk.com/guidelines/search-filter-and-sort/filter-patterns/)                       | Live results are suitable when fast; batch avoids repeated loads when responses are slower or mobile results are obscured.                | Performance thresholds must be measured, while the interaction remains predictable.                                  | Logistics applications have different data volume and user expertise.                                       |
| [NICE Design System: Filters](https://design-system.nice.org.uk/components/filters/)                                                | Result summaries, applied state, and retryable filtering belong to one coherent pattern.                                                  | Keep count, committed criteria, result collection, and recovery semantically adjacent.                               | The component does not resolve NosLog card content or update mode.                                          |
| [Australian Agriculture Design System: Search filters](https://design-system.agriculture.gov.au/patterns/search-filters)            | A responsive filter drawer can batch changes and close through one Apply action.                                                          | Supports the approved result-obscuring mobile layer.                                                                 | It is a government implementation pattern, not visual direction.                                            |
| [Department for Education: Filter](https://design.education.gov.uk/design-system/components/filter)                                 | Place the completion action where users finish selecting, and test mobile discoverability.                                                | Keep the mobile result action sticky and reachable after long filter groups.                                         | It derives from the Ministry of Justice pattern and is not independent visual evidence.                     |
| [Siemens Element: Filter](https://element.siemens.io/patterns/filter/)                                                              | Choose batch for multiple changes and live update when immediate feedback is valuable.                                                    | Reinforces the responsive, task-sensitive split.                                                                     | Industrial applications differ from public music discovery.                                                 |
| [Octopus Design System: Filtering](https://www.octopus.design/latest/patterns/ui-patterns/filtering-ib9jS2iT)                       | Filter state should remain dismissible and impossible combinations should be communicated.                                                | Applied criteria need individual removal and zero-result recovery.                                                   | Exact filter-control choices remain NosLog-specific.                                                        |
| [Baymard: Ecommerce filter UI](https://baymard.com/learn/ecommerce-filter-ui)                                                       | Desktop benefits from visible real-time feedback, while mobile often benefits from a results-return action and visible applied state.     | The responsive interaction pattern transfers even though NosLog does not inherit merchandising behavior.             | Ecommerce research cannot determine NosLog's fields, ordering, or visual style.                             |
| [eBay: Filtering patterns](https://playbook.ebay.com/design-system/patterns/filtering-patterns)                                     | Users need to adjust and remove criteria without restarting discovery.                                                                    | Preserve query, expose committed filters, and make recovery reversible.                                              | Marketplace inventory and commercial facets do not transfer.                                                |
| [Algolia: Faceting](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting)                                    | Contextual facet values and counts can update with result state.                                                                          | Supports exact applied-state counts when performance and query design are verified.                                  | Search-engine capability does not prove that live counts are always good UX.                                |
| [Elastic Search UI](https://www.elastic.co/docs/reference/search-ui)                                                                | Search-as-you-type, faceting, and conditional facets require explicit state and request handling.                                         | Supports active text search and stale-request protection as implementation capabilities.                             | It is technical tooling guidance rather than independent user research.                                     |
| [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                                        | Editable popup controls require defined keyboard, focus, selection, and popup relationships.                                              | The scope-aware search and suggestions must not rely on pointer interaction or icons alone.                          | The exact scope selector may use a menu rather than a combobox and must follow its actual semantic pattern. |
| [WCAG 2.2: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                                       | Dynamic results and status changes should be available to assistive technology without taking focus.                                      | Announce settled counts and failures without moving focus on every refresh.                                          | It does not prescribe debounce timing or visual presentation.                                               |

### Mobile Post-Commit Focus Comparison

The focused comparison separates ordinary dialog dismissal from completion of a
result-oriented filter workflow. General dialog systems converge on returning focus
to the invoking trigger, while WAI-ARIA APG explicitly permits a more logical
workflow destination when the dialog task leads directly to a subsequent step.
Filter-specific systems then converge on an explicit mobile commit, a visible result
summary, and orientation to the updated results. Primer's warning against moving focus
after each individual filter choice does not conflict with NosLog because selections
remain staged; focus moves only after the user activates **View results**.

| Source                                                                                                                | Evidence or disagreement                                                                                                                             | NosLog application and limitation                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [WAI-ARIA APG: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                  | Close normally returns to the invoker, but a directly related next workflow step may be a more logical destination.                                  | Supports trigger return for cancel and result-summary focus for successful commit; APG does not choose NosLog's visible layout.                        |
| [W3C H102: HTML dialog](https://www.w3.org/WAI/WCAG21/Techniques/html/H102)                                           | Native modal close ordinarily restores the invoking element.                                                                                         | Establishes the safe default that cancel paths retain; it does not override the APG workflow exception.                                                |
| [USWDS: Modal accessibility tests](https://designsystem.digital.gov/components/modal/accessibility-tests/)            | Modal focus must remain contained and return to the expected invoking element after ordinary close.                                                  | Informs contained focus and cancellation QA; the component is not a search-filter workflow.                                                            |
| [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)                                            | Escape closes and returns focus to the trigger, with close autofocus available for controlled exceptions.                                            | Matches the current project primitive and requires an intentional post-commit override; library defaults do not decide product workflow.               |
| [Carbon: Dialog pattern](https://carbondesignsystem.com/patterns/dialog-pattern/)                                     | Modal close returns focus to its invoker.                                                                                                            | Reinforces predictable cancel behavior; enterprise dialog guidance does not address a mobile result handoff.                                           |
| [Fluent 2: Dialog](https://fluent2.microsoft.design/components/web/react/core/dialog/usage)                           | Dialog close restores the triggering component.                                                                                                      | Supports ordinary dismissal and clear initial/contained focus, not the result-specific exception.                                                      |
| [PatternFly: About modal accessibility](https://v4-archive.patternfly.org/v4/components/about-modal/accessibility)    | Escape dismissal returns focus to the invoking element.                                                                                              | Adds independent modal convergence but its informational modal is less task-oriented than NosLog filtering.                                            |
| [VA.gov: Search Filter](https://design.va.gov/components/search-filter)                                               | After filters are applied, focus moves to the result heading or summary.                                                                             | Directly supports the approved summary target; VA's government content and wider Apply preference do not determine NosLog styling or desktop behavior. |
| [VA.gov: Sort](https://design.va.gov/components/sort/)                                                                | Filtering moves to the result description or heading, while sorting that remains visible keeps focus on its control.                                 | Supports the NosLog responsive split: obscured mobile commit moves to results, visible desktop sorting does not.                                       |
| [DWP: Filters](https://design-system.dwp.gov.uk/contribute/filters)                                                   | Batch filtering preserves choices until deliberate Apply and requires clear feedback after filtering.                                                | Supports one post-commit handoff rather than movement after each staged choice; public-service frequency differs.                                      |
| [DWP: Filter design notes](https://design-system.dwp.gov.uk/research/filters/design-notes)                            | Mobile can hide both filter controls and results; count and applied-filter state orient the returned user.                                           | Supports a stable visible summary and applied state; it does not prescribe same-row versus split-row composition.                                      |
| [NSW Design System: Filters](https://designsystem.nsw.gov.au/components/filters/)                                     | Small-screen batch Apply closes the filter window and displays updated results.                                                                      | Supports commit-and-return as one action; it does not prescribe the precise focus node.                                                                |
| [Scottish Government: Search filters](https://designsystem.gov.scot/patterns/search-results/search-filters)           | Mobile waits for an explicit Apply rather than updating obscured results automatically.                                                              | Supports the approved staged layer; government copy and control anatomy are not visual direction.                                                      |
| [Primer: Focus management](https://primer.style/accessibility/design-guidance/focus-management/)                      | Focus should remain on an individual filter while the user may continue filtering; after removal or workflow changes it needs a logical destination. | Confirms no movement during staging and permits one logical move after completion; it is design-system guidance, not a WCAG mandate.                   |
| [WCAG 2.2: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                         | Settled result counts, no-result states, and failures must be available without unnecessary focus interruption.                                      | Requires restrained polite completion messages and duplicate-announcement suppression; it does not require focus to move after every update.           |
| [WCAG 2.2: Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                                 | Programmatic focus order must remain understandable and operable; static elements may receive focus when they provide logical context.               | Supports a focusable summary before the result collection, provided it does not become a confusing extra stop during ordinary navigation.              |
| [WCAG 2.2: Concurrent Input Mechanisms](https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html) | Content must not assume that a platform user will remain with one input mechanism.                                                                   | Supports one logical DOM destination across touch, keyboard, and assistive-technology use; visible focus decoration may still follow input capability. |

NosLog therefore uses one input-method-independent DOM rule: successful mobile
**View results** reveals and focuses the stable summary; cancel, Back, and Escape
restore the invoking trigger and prior reading context. If settled data is ready, the
focused summary is announced once. If it is pending, one polite settled outcome follows
the busy state. Desktop and ordinary search refreshes retain control focus. The visual
choice between a same-row and split-row summary remains a localized `390px` specimen
decision, not part of the focus rule.

### No-Result Recovery Comparison

The approved treatment follows a nineteen-entry comparison across the current product,
filter-heavy systems, empty-state systems, accessibility standards, search platforms,
and rhythm-game catalog structure. The references establish the need for truthful
state, preserved work, and an available recovery path. They do not require NosLog to
add explanatory copy or a new button when the relevant controls are already visible.

| Source                                                                                                                                              | Transferable principle                                                                                                                                                        | NosLog application                                                                                                        | Limitation                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Current NosLog code and `/ko/music` browser audit (`2026-07-31`)                                                                                    | Query and controls remain, but every cause produces one generic sentence and there is no visible applied-state recovery.                                                      | Preserve the useful stable controls while adding internal cause classification, applied chips, and filter-only reset.     | Current behavior is evidence, not an approved visual template.                           |
| [DWP: Designing a filter component](https://design-system.dwp.gov.uk/research/filters/design-notes)                                                 | No-filter, filtered-result, and filtered-zero states are distinct; applied filters and clear-all make state explicit.                                                         | Keep removable committed chips and one clear-all control even when the result collection is empty.                        | Government casework is more procedural and often uses more explanatory copy.             |
| [Primer: Filter](https://primer.style/product/scenario-patterns/filter/)                                                                            | A filtered zero state should name active state and make reset or revert obvious; dynamic change needs a status announcement.                                                  | The applied-state region, not a duplicated empty-state action group, provides removal and reset.                          | GitHub's dense work-management context differs from fast Music lookup.                   |
| [Baymard: Applied filters](https://baymard.com/blog/how-to-design-applied-filters)                                                                  | An applied-filter overview prevents disorientation and makes deselection efficient.                                                                                           | Keep committed filter chips visible above both results and the empty region.                                              | Commerce conversion evidence does not justify product recommendations in NosLog.         |
| [Ministry of Justice: Filter](https://design-patterns.service.justice.gov.uk/components/filter/)                                                    | Selected criteria should remain visible and individually removable after application.                                                                                         | Preserve immediate chip removal and filter-only clear-all across mobile and desktop models.                               | Batch-oriented government forms do not decide NosLog's visible copy length.              |
| [Carbon: Empty states](https://preview.carbondesignsystem.com/building-blocks/core/patterns/empty-states)                                           | Explain the state and provide a next step when needed, but pick one important path and keep content contextual. Guidance may point to existing UI instead of adding a button. | Existing visible search, scope, and filter controls are the next step, so one concise statement is sufficient.            | Enterprise examples often have more space and lower-frequency empty states.              |
| [Atlassian: Empty-state content](https://atlassian.design/foundations/content/designing-messages/empty-state)                                       | Copy should be scannable, brief, non-redundant, and cautious about multiple actions.                                                                                          | Use one line and no explanatory subtitle or empty-state action group.                                                     | Some Atlassian examples emphasize onboarding or task completion rather than search.      |
| [SAP Fiori: Empty states](https://experience.sap.com/fiori-design-web/designing-for-empty-states/)                                                  | Search, filter, no-data, and system-error causes require different treatment; message and CTA depth depend on context.                                                        | Separate failure, mismatch, filter constraint, publication absence, and catalog absence internally.                       | Illustrated enterprise states would add unnecessary weight to NosLog discovery.          |
| [Shopify: Empty state](https://shopify.dev/docs/api/app-home/patterns/compositions/empty-state)                                                     | A blank area should offer a clear path and should not overload primary actions.                                                                                               | Treat the persistent controls as the path instead of adding another primary button.                                       | Merchant onboarding and conversion goals are not NosLog goals.                           |
| [PatternFly: No results](https://v5-archive.patternfly.org/components/empty-state/design-guidelines/)                                               | No-result states should be compact and tell users that criteria returned nothing.                                                                                             | Supports short state copy, but NosLog omits redundant instructions because controls remain directly adjacent.             | PatternFly's prescribed body copy is not mandatory for a high-frequency consumer lookup. |
| [SIS Design System: Empty state](https://design.sis.gov.uk/components/feedback-progress/empty-state/)                                               | Search no-result is distinct from no data and load failure; dynamic appearance needs live-region communication.                                                               | Keep retrieval errors separate and announce only the settled result state.                                                | Intelligence-service workflows are not visual or tonal references for NosLog.            |
| [USWDS: Search](https://designsystem.digital.gov/components/search/)                                                                                | Search terms should persist into the results experience.                                                                                                                      | Never erase the query after zero results; let the user edit it in place.                                                  | Site-wide government search is broader than the NosLog catalog.                          |
| [W3C: `role=status`](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)                                                                          | A settled result count or zero-result update can be announced politely without receiving focus.                                                                               | Use one pre-existing atomic polite status region and no alert semantics.                                                  | The technique does not prescribe visible wording or recovery controls.                   |
| [Apple HIG: Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)                                             | Editable search, clear affordance, immediate results, scope, and filters can remain part of one search experience.                                                            | Leave correction, clearing, and scope change in their existing controls.                                                  | Native-platform placement advice does not determine the web layout.                      |
| [Algolia: Empty or insufficient results](https://www.algolia.com/doc/guides/managing-results/optimize-search-results/empty-or-insufficient-results) | Search systems can broaden queries or show alternatives to reduce dead ends.                                                                                                  | NosLog records the alternative but rejects silent expansion and unrelated fallback content for an exact official catalog. | The guidance is strongly influenced by ecommerce engagement and conversion.              |
| [Elastic Search UI: Clear filters](https://www.elastic.co/docs/reference/search-ui/guides-creating-own-components)                                  | Query state and filter-clearing actions can remain separate.                                                                                                                  | Clear-all removes filters only while preserving query, scope, sort, and view.                                             | This proves implementation feasibility, not user preference.                             |
| [Adobe React Spectrum: ListView](https://react-spectrum.adobe.com/ListView)                                                                         | A result collection can replace its rows with a dedicated no-result rendering.                                                                                                | Replace the empty list/grid body with the concise state while keeping the surrounding discovery controls stable.          | Component documentation does not define NosLog cause semantics.                          |
| [osu!: Beatmap](https://osu.ppy.sh/wiki/en/Beatmap)                                                                                                 | A Music identity can contain multiple difficulty beatmaps with separate availability and status.                                                                              | A matching Music without an eligible published pattern is not the same as text mismatch.                                  | Domain structure is relevant, but osu! does not prescribe NosLog empty-state UI.         |
| [Taiko.wiki: Song search](https://taiko.wiki/song?lang=en)                                                                                          | Rhythm-game discovery keeps title, artist, genre, and difficulty within a song-centered search surface.                                                                       | Supports keeping correction and refinement in the same visible discovery controls.                                        | Its current interface is a comparator, not an accessibility or visual authority.         |

Evidence convergence:

- Preserve the committed query and controls; do not make the user restart discovery.
- Distinguish text mismatch, filter constraint, publication absence, catalog absence,
  and retrieval failure even when some visible messages remain intentionally concise.
- Keep applied criteria removable and provide one filter-only clear-all action.
- Use a settled polite status announcement without moving focus or turning zero
  results into an error.
- A next step may be supplied by the surrounding controls. Explanatory body copy and
  empty-state buttons are optional, not inherent requirements.

Evidence disagreement and NosLog resolution:

- Commerce search frequently recommends query expansion, related inventory, or popular
  content. NosLog rejects those fallbacks because they can obscure exact Music and
  publication meaning.
- Several component systems illustrate a title, body, image, and CTA. NosLog uses
  text only because search, scope, and applied-filter recovery remain visible and the
  user task is a fast, repeated catalog lookup.
- Some systems expose detailed cause explanations. NosLog keeps detailed cause logic
  in the result service, analytics, and tests, while the interface uses the approved
  one-line localized statements.

### Progressive-Loading Comparison

The approved `20`-result contract follows a twenty-four-entry comparison including
measured NosLog evidence. The sources converge on explicit user control, predictable
quantity, visible progress, settled status communication, bounded initial work, and
recoverable history. They disagree on one universal quantity and on whether focus
should remain on the trigger or move to new content. NosLog therefore chooses its
amount from its own result density and chooses first-new-result focus because every
appended card is actionable and otherwise precedes the relocated control in keyboard
order.

| Source                                                                                                                                                               | Evidence or transferable principle                                                                                   | NosLog application and limitation                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Current NosLog query and list implementation (`2026-07-31`)                                                                                                          | Cursor queries already return `20`; an `IntersectionObserver` currently appends automatically.                       | Retain the proven query unit but replace viewport triggering with the approved explicit action. Current behavior is not approval.  |
| Current NosLog `390px` and accumulated-DOM audit (`2026-07-31`)                                                                                                      | `20` fills about two List or 3.5 Grid viewports; DOM elements grow from `464` at 20 to `1,073` at 60.                | Supports a useful initial scan and a separate `20/60/100` performance gate; current markup is not the final component budget.      |
| [Baymard: Number of items loaded by default](https://baymard.com/blog/number-of-items-loaded-by-default)                                                             | Appropriate quantity varies widely; mobile product lists often fall around `15–30`, with lower search thresholds.    | Places `20` inside a researched mobile range, but commerce card density cannot determine NosLog's value alone.                     |
| [Baymard: Telco benchmark](https://baymard.com/blog/2021-telco-benchmark)                                                                                            | Explicit Load more creates a controllable break and return should restore the exact place.                           | Supports manual continuation and selected-result restoration; telecom shopping goals differ.                                       |
| [U.S. Web Design System: Pagination](https://designsystem.digital.gov/components/pagination/)                                                                        | Set size, screen length, performance, and user preference should determine chunking; short collections may show all. | NosLog's `583`-Music catalog is not a short collection; USWDS does not prescribe Load-more copy.                                   |
| [SAP Fiori: Smart table](https://www.sap.com/design-system/fiori-design-web/v1-108/ui-elements/smart-table/usage)                                                    | A responsive-table example starts with `20` and provides More.                                                       | A useful numeric comparator; enterprise tables are denser than NosLog cards.                                                       |
| [SAP Fiori: Responsive table](https://www.sap.com/design-system/fiori-design-web/v1-96/ui-elements/responsive-table/usage)                                           | Growing mode loads larger sets and can show loaded and total values beside More.                                     | Supports exact progress and explicit continuation; its high-volume thresholds do not directly transfer.                            |
| [SAP Fiori: Grid list](https://experience.sap.com/fiori-design-web/grid-list/)                                                                                       | Batch amount depends on item complexity and browser; growing controls bound initial rendering.                       | Supports measuring List and Grid with the same logical result count rather than copying a table limit.                             |
| [SAP Commerce: Infinite scroll](https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/eaef8c61b6d9477daf75bff9ac1b7eb4/d37bd1496c6c42d5b7a17740ba155e94.html) | Product limits and explicit Show More increments are configurable for performance.                                   | Confirms quantity is a tested contract; its `10`-item example is not a rhythm-game catalog recommendation.                         |
| [Carbon: Pagination](https://carbondesignsystem.com/components/pagination/usage/)                                                                                    | Chunking improves control and performance when collections are large.                                                | Supports bounded retrieval as a comparison; numbered pages remain rejected for the approved continuous discovery task.             |
| [Material Design 2: Data tables](https://m2.material.io/components/data-tables)                                                                                      | Users need rows-per-page, total, current range, and loading progress.                                                | Supports visible quantity and progress; dense tabular pagination is not the NosLog card layout.                                    |
| [MusicBrainz API search](https://musicbrainz.org/doc/MusicBrainz_API/Search)                                                                                         | Music-entity search defaults to `25` and permits `1–100`.                                                            | Shows a nearby music-catalog batch range; an API default is not evidence of ideal visible card density.                            |
| [Apple Music API: Library search](https://developer.apple.com/documentation/applemusicapi/search-for-library-resources)                                              | Multi-type library search defaults to `5` and caps at `25`.                                                          | Confirms search context may require smaller groups; the endpoint mixes entity types unlike one NosLog scope.                       |
| [YouTube Data API: Search](https://developers.google.com/youtube/v3/docs/search/list)                                                                                | Search defaults to `5`, allows up to `50`, and exposes result and page metadata.                                     | Reinforces context-specific amounts and progress metadata; video search cards and quota policy differ.                             |
| [osu! beatmap listing implementation](https://cocalc.com/github/ppy/osu/blob/master/osu.Game/Overlays/BeatmapListing/BeatmapListingFilterControl.cs)                 | Grouped beatmap results use cursor continuation and an explicit end condition.                                       | Supports cursor-backed grouped rhythm-game discovery; the client does not establish NosLog's exact amount or control copy.         |
| [osu!web API documentation](https://osu.ppy.sh/docs/)                                                                                                                | Beatmap-set search returns a continuation cursor and `null` when complete.                                           | Supports cursor/end-state mapping while keeping Music/Chart criteria stable across requests.                                       |
| [WCAG 2.2: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                                                                        | Loading, result, and failure updates must be available without requiring focus.                                      | Requires one settled polite message; it does not decide where a user-initiated continuation should place focus.                    |
| [MDN: `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)                                                   | A changing region remains busy until its multi-part update is complete.                                              | Prevents premature announcements and duplicate status; native control semantics remain primary.                                    |
| [GitHub Primer: Focus management](https://primer.style/accessibility/design-guidance/focus-management/)                                                              | When Load more adds actionable content, focus can move to the first newly added item.                                | Matches NosLog's actionable cards and forward reading order; it is design-system guidance rather than a WCAG mandate.              |
| [University of Arizona: Focus management](https://accessibility.arizona.edu/web-apps/focus-management)                                                               | An alternative pattern keeps focus on Load more and announces the update.                                            | Records genuine disagreement; rejected because NosLog's new cards precede the moved trigger and would require reverse navigation.  |
| [Chrome: Avoid an excessive DOM size](https://developer.chrome.com/docs/lighthouse/performance/dom-size)                                                             | Large DOM trees increase load, rendering, and memory cost; create nodes when needed.                                 | Requires accumulated-result testing and lean markup; audit warning thresholds are diagnostics, not a product batch number.         |
| [web.dev: DOM size and interactivity](https://web.dev/articles/dom-size-and-interactivity)                                                                           | DOM growth can increase layout work and interaction latency.                                                         | Requires measurement at `20/60/100`; it does not justify silently changing the visible batch contract.                             |
| [MDN: `history.scrollRestoration`](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration)                                                       | Browser history can restore scroll position on navigation.                                                           | Supports history-entry restoration, supplemented by a selected-result anchor after asynchronous rehydration.                       |
| [Next.js: Linking and navigating](https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating)                                           | App Router normally preserves Back/Forward scroll while new routes start at the top.                                 | Supports separating durable URL criteria from ephemeral loaded and reading state; async result reconstruction still needs testing. |

### Ordering and Result-Composition Comparison

The ordering and result-view decision was compared across current NosLog evidence,
official rhythm-game catalogs, community chart browsers, search guidance, and
production design systems. No single reference determines the solution; the approved
model follows the convergent task pattern while preserving NOSTALGIA-specific
difficulty and data semantics.

| Source                                                                                                                         | Observed pattern or evidence                                                                                           | NosLog fit and limitation                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [Current NosLog Music toolbar](../../components/music/musicToolbar.tsx)                                                        | Sort, direction, difficulty, filters, and view choices currently compete in one control area.                          | Confirms the need to reduce persistent control density; the current arrangement is not a 2.0 layout mandate.                            |
| [Current NosLog Music query](<../../app/(nevigation)/music/data.ts>)                                                           | Level order can depend on selected difficulties or a hidden Expert fallback, while weakness uses a composite score.    | Direct migration evidence for removing weakness and requiring an explicit level target; current semantics are not retained.             |
| Current local dataset audit (`2026-07-30`)                                                                                     | All `583` Music entries have `title_kana`, but only `3` MusicChart rows have `released_at`; no ChartPattern is public. | Supports reading-order browse now and requires a release-data gate plus seeded Chart states before representative validation.           |
| [KONAMI NOSTALGIA Op.3 play data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                           | Music identity, named difficulty, level, and record dimensions stay explicitly associated.                             | Supports preserving NOSTALGIA difficulty identity; the authenticated record page does not prescribe public catalog layout.              |
| [maimai DX song list](https://maimai.sega.jp/song/)                                                                            | A jacket-led official catalog keeps title, artist, category, and multiple difficulty levels together.                  | Supports Music-centered grouping and optional visual browsing; maimai's categories and visual density are not copied.                   |
| [CHUNITHM song list](https://chunithm.sega.jp/music/)                                                                          | Official songs remain grouped as one identity with their difficulty data rather than independent difficulty cards.     | Supports one Music result with several difficulties; it does not cover community Chart publication.                                     |
| [osu! beatmap listing](https://osu.ppy.sh/beatmapsets)                                                                         | Query, mode, category, explicit sorting, and grouped beatmap sets coexist.                                             | Supports explicit scope and sort state plus grouped variants; osu! terminology and ranking model do not transfer directly.              |
| [osu! client interface](https://osu.ppy.sh/wiki/en/Client/Interface)                                                           | Grouping and sorting are separate concepts, and difficulty sorting can separate related variants.                      | Supports keeping Music grouping stable and avoiding an implicit cross-difficulty representative level.                                  |
| [BeatSaver](https://beatsaver.com/)                                                                                            | Community charts foreground newly uploaded content and expose direct difficulty targets from a song identity.          | Supports latest-published Chart browse; Beat Saber metadata and moderation semantics differ.                                            |
| [StepManiaOnline search](https://search.stepmaniaonline.net/)                                                                  | Community packs and charts are searchable with explicit recency and difficulty context.                                | Supports publication-recency browse and difficulty visibility; pack-first structure is not NosLog's Music model.                        |
| [Tachi](https://tachi.ac/)                                                                                                     | Rhythm-game discovery and analysis separate compact identity browsing from detailed record dimensions.                 | Supports list-first scan and progressive detail; Tachi is a multi-game tracker, not a public Chart marketplace.                         |
| [Algolia: Relevant sorting](https://www.algolia.com/doc/guides/managing-results/refine-results/sorting/in-depth/relevant-sort) | Relevance and business/attribute ordering are distinct modes that need explicit configuration.                         | Supports active-query Relevance while preserving an explicit user order rather than silently overriding it; capability is not UX proof. |
| [Algolia: Faceting](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting)                               | Sort and refinement state can remain explicit and restorable alongside query state.                                    | Supports URL-restorable sort and target difficulty; it does not decide which NOSTALGIA sort is meaningful.                              |
| [Baymard: Default sort type](https://baymard.com/blog/default-sort-type)                                                       | Default ordering materially shapes what users perceive as the available catalog.                                       | Supports a predictable neutral empty-browse order and rejects hidden difficulty restriction; ecommerce priorities are different.        |
| [Carbon: Data table usage](https://carbondesignsystem.com/components/data-table/usage/)                                        | Secondary actions and view controls should preserve a clear hierarchy around the collection.                           | Supports one current sort trigger and purposeful list/grid controls; enterprise table density is not the target style.                  |
| [PatternFly: Toolbar](https://www.patternfly.org/components/toolbar/design-guidelines)                                         | Filters, sort, view, and bulk actions should be grouped by role and progressively disclosed when space is limited.     | Supports placing the level target inside sort disclosure rather than adding a permanent difficulty-button row.                          |
| [U.S. Web Design System: Search](https://designsystem.digital.gov/components/search/)                                          | Search labels, status, and results must remain understandable without depending on icon recognition alone.             | Requires localized visible sort/scope meaning and accessible control names; government visual styling does not transfer.                |

### Music Result-Card Anatomy Comparison

The approved Music card anatomy was tested against the seventeen-source ordering and
result-composition set above, current narrow and wide NosLog browser evidence, the
local source-catalog length distribution, and the focused interaction references
below. The sources converge on stable identity, predictable whole-card activation,
capability-based hover enhancement, and square media that does not force the entire
card to be square. They do not prescribe NosLog's exact dimensions; the `56px`,
`20px`, `64–100px`, and `440–460px` boundaries preserve the audited useful compactness
and must be validated as component specimens.

| Source                                                                                                            | Observed principle                                                                                                          | NosLog fit and limitation                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Current NosLog Music List and Grid browser audit (`390px` and wide, `2026-07-30`)                                 | Compact List identity, trailing difficulties, square Grid jackets, and category badges already support rapid recognition.   | Approved as structural evidence, not as final styling; crowded controls and the narrow desktop shell are not retained.                    |
| Current source-catalog length audit (`prisma/data/nosdata-musics.json`, `2026-07-31`)                             | Long artist values are common and title length varies materially across the `578` source entries.                           | Supports separating category from artist and setting intentional line budgets; source rows differ from the local database row count.      |
| [Apple HIG: Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables)     | Repeated rows should prioritize scannability, consistent alignment, and clear selection behavior.                           | Supports compact whole-row activation and aligned metadata; native-platform styling and control sizes do not transfer directly.           |
| [Apple HIG: Collections](https://developer.apple.com/design/human-interface-guidelines/collections)               | Collections can adapt item count to available space while preserving recognizable item structure.                           | Supports container-driven Grid columns; Apple platform conventions do not determine NosLog's column tokens.                               |
| [Material Design 2: Cards](https://m2.material.io/components/cards)                                               | A card groups related identity and actions, with clear hierarchy and predictable activation rather than fragmented targets. | Supports one Music-detail target and informational difficulty values; Material surface styling is not NosLog art direction.               |
| [Fluent 2: Card usage](https://fluent2.microsoft.design/components/web/react/core/card/usage)                     | Card layouts need stable hierarchy, state treatment, and intentional interaction affordances across input methods.          | Supports same-card preview states without layout shift; Fluent visual tokens are not copied.                                              |
| [W3C Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/)                                                | `hover` and `pointer` describe input capability independently of viewport size.                                             | Requires preview eligibility based on capability rather than a “desktop” breakpoint; reported capabilities still require browser testing. |
| [MDN: `hover` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)                       | Interfaces can condition enhancement on whether the primary input can conveniently hover.                                   | Supports excluding first-tap and long-press preview behavior; the media query does not itself provide keyboard equivalence.               |
| [web.dev: Interaction](https://web.dev/learn/design/interaction)                                                  | Responsive interaction must account for mouse, keyboard, touch, focus, and reduced motion instead of assuming one device.   | Supports direct touch navigation and equivalent focus behavior; it does not decide NosLog record content.                                 |
| [Apple HIG: Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)           | Long press is associated with contextual actions and should not replace the primary, discoverable activation path.          | Supports rejecting long-press record preview; NosLog does not adopt a context menu from this evidence.                                    |
| [WCAG 2.2: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html) | Hover/focus content that obscures other content must be dismissible, hoverable, and persistent, with keyboard availability. | Governs the approved same-card preview; it does not require exposing the preview on touch.                                                |

### Personal-Record Taxonomy Comparison

The personal-record decision was tested against the domain and score-product evidence
below together with the broader filtering and accessibility sources above. The
combined comparison exceeds fifteen independent relevant sources; duplicate
storefronts and derivative summaries were not counted as separate support.

| Source                                                                                                                    | Observed pattern                                                                                                  | NosLog fit and limitation                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [Current NosLog record filter](../../components/music/search/musicRecordFilter.tsx)                                       | The current UI exposes 14 controls across status, judgement, timing, and note-type weakness groups.               | It is implementation inventory, not evidence that every control deserves equal 2.0 prominence.                                          |
| [Current NosLog record query](<../../app/(nevigation)/music/data.ts>)                                                     | Current record choices within several groups are broadly combined as matches and include a Clear criterion.       | Confirms migration impact; the existing query model must not define the new domain semantics.                                           |
| [KONAMI NOSTALGIA Op.3 play data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                      | Best Score, Rank, ◆JUST/Just/Good/Miss/Near, Max Combo, note-type rates, update time, and recent history coexist. | Confirms available record dimensions, while the authenticated detail page does not prove that all of them are useful discovery filters. |
| [NosLog Op.3 Bingo source data](../../prisma/data/op3-bingos.json)                                                        | Official mission records repeatedly use absolute MISS thresholds as completion targets.                           | Strong NOSTALGIA-specific evidence that MISS count is actionable; mission criteria do not require permanent prominence in search.       |
| [KONAMI beatmania IIDX 33 original filters](https://p.eagate.573.jp/game/2dx/33/howto/play/game_screen.html)              | Players can build goal-oriented filters including level, clear lamp, DJ level, and a `0–300` MISS COUNT range.    | Supports an absolute range for practice selection; IIDX clear-lamp semantics must not be copied into NOSTALGIA.                         |
| [TrackBrowser App Store history](https://apps.apple.com/au/app/trackbrowser/id6753338133)                                 | An IIDX catalog tool added Miss Count filtering, custom ranges, filter summaries, and score-data integration.     | Supports progressive personal refinement and visible committed state; it remains an unofficial IIDX-specific product.                   |
| [osu! API score model](https://osu.ppy.sh/docs/index.html#score)                                                          | Miss count is stored as an individual score statistic beside accuracy, combo, pass, and grade data.               | Shows MISS as a portable score fact, not evidence that it should be a primary song-catalog facet.                                       |
| [ScoreSaber Reloaded score tracking](https://www.mintlify.com/RealFascinated/scoresaber-reloaded/features/score-tracking) | Score lists expose misses as detail and allow miss-count sorting for clean-score review.                          | Supports practice relevance while demonstrating that sort/detail can be enough in some products.                                        |
| [Tachi](https://tachi.ac/)                                                                                                | A rhythm-game tracker separates score collection, detailed analysis, goals, sessions, and folders.                | Supports keeping rich metrics in analysis while exposing only task-relevant discovery controls; it is multi-game and highly modular.    |
| [Ministry of Justice: Filter](https://design-patterns.service.justice.gov.uk/components/filter/)                          | Filters should be limited to useful criteria, show applied state, and use clear category logic.                   | Supports removing redundant Clear and low-value judgement/note-type facets rather than preserving the current count.                    |
| [Baymard: Product-list filtering](https://baymard.com/research/ecommerce-product-lists)                                   | User-entered numeric ranges are useful for continuous values when bounds and active state are clear.              | Supports optional MISS bounds at the interaction level; commerce findings do not determine NOSTALGIA taxonomy.                          |
| [WCAG 2.2: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)         | Additional content triggered by hover must also work with focus and remain perceivable and dismissible.           | Requires the approved capability-gated preview to be keyboard-equivalent; it does not justify creating hover behavior on touch.         |

### Evidence Convergence

- Live update is most useful when the result remains visible, the action is simple,
  and response performance is reliable.
- Batch commitment is most useful when a user makes several related choices or the
  result is obscured.
- Mobile Apply is only low-friction when it also performs the necessary return to
  results; a separate Apply followed by Close would add avoidable work.
- Regardless of update mode, query, committed filters, result count, and visible
  results must not contradict one another.
- Performance should be protected through settled input, request cancellation,
  caching, and localized result loading before adding confirmation to every viewport.
- NOSTALGIA exposes many record dimensions, but domain availability alone does not make
  each metric an effective catalog filter.
- Absolute MISS count has direct practice-goal evidence in NOSTALGIA mission data and
  comparable rhythm-game catalog tools. It is more interpretable than a combined
  MISS+NEAR percentage for the approved user need.
- Comparable services disagree on whether misses belong in filtering, sorting, or
  detail. The convergence is that misses are useful score context, not that they should
  dominate ordinary public discovery.
- Clear/lamp semantics vary materially by rhythm game. NOSTALGIA's own task meaning
  must govern instead of importing IIDX's taxonomy.
- Rich judgement and note-type breakdowns remain valuable analysis data, while a lean
  discovery surface benefits from progressively disclosing only actionable criteria.
- Official catalogs and community-chart browsers converge on keeping related
  difficulties under one Music identity, but they differ on whether list or artwork
  scanning dominates. NosLog resolves this with list-default/grid-optional Music
  results and a grouped-list-only Chart scope.
- The complete `title_kana` field supports a neutral, deterministic empty Music browse.
  Release-recency sorting requires trustworthy release metadata and must not be
  simulated with database maintenance timestamps.
- Level ordering is understandable only when its difficulty basis is explicit.
  Hiding an Expert fallback or blending several difficulties would make equal-looking
  “level” values semantically inconsistent.
- Combined and separate mobile Filter/Sort entry patterns are both established.
  A combined trigger is appropriate only when its label names both functions, its
  internal sections remain distinct, and committed sort state stays visible.
- A recent-play time-window filter is not justified merely because recent-play order
  exists. Without a verified intersection task, retaining both adds taxonomy without
  a distinct high-value outcome.
- Long artist strings are frequent enough that category and artist must not compete in
  one inline row. Consistent line budgets and alignment improve scanning while detail
  and accessible names preserve complete values.
- List scanning and jacket scanning have different density needs. NosLog keeps a
  compact, at-most-two-column List and a square-jacket Grid whose lower information
  region may grow independently.
- Hover is an optional capability enhancement, not a mobile interaction model. The
  same-card preview therefore uses hover plus keyboard focus where supported, while
  touch follows the primary detail link immediately.
- Progressive-loading references converge on a bounded initial request, explicit user
  control, predictable next quantity, visible progress, clear busy/error/end states,
  and recoverable return context. They do not provide one universal batch number.
- The current `390px` density, existing cursor unit, catalog scale, and cross-view
  consistency make `20` the approved NosLog result-unit contract. Accumulated DOM cost
  is validated separately because changing one batch from `20` to `16` does not solve
  unbounded accumulation.

### Evidence Disagreement and NosLog Resolution

- Visa and DWP lean toward batch filtering; SAP leans toward live update whenever
  feasible. Carbon, Dell, NSW, Siemens, Maersk, and Baymard make the choice conditional
  on filter complexity, result visibility, response time, or viewport.
- NosLog resolves this disagreement through the approved responsive hybrid rather
  than choosing one source as a universal rule.
- Algolia and Elastic demonstrate technical feasibility but do not by themselves
  justify an interaction. The downstream implementation must still meet measured
  latency, cancellation, and accessibility requirements.
- IIDX and TrackBrowser provide explicit MISS filtering, whereas osu!, ScoreSaber, and
  Tachi evidence more often presents comparable statistics in score, sort, goal, or
  analysis contexts. NosLog resolves this by retaining an advanced authenticated MISS
  range without promoting it to a public primary facet.
- Official song catalogs favor stable Music grouping, while community chart services
  more strongly foreground publication recency. NosLog applies each pattern to the
  matching scope instead of forcing one universal empty-browse order.
- Search systems support relevance for active queries, but references disagree on when
  it should override an explicit user order. NosLog resolves this by using Relevance
  only as the no-explicit-sort active-query default and preserving a user's selection.
- Some guidance prefers separate mobile Filter and Sort controls for immediate
  distinction, while SAP and comparable catalog patterns support a combined entry.
  NosLog uses the combined narrow trigger to reduce persistent density, keeps the
  sections separate, and retains separate controls when results remain visible.
- Progressive-loading examples range from small search groups to `20`- and
  `25`-item catalog/API defaults, confirming that context should determine quantity.
  NosLog uses measured card density rather than treating any external default as a
  universal rule.
- Primer recommends focusing newly added actionable content, while the University of
  Arizona documents retaining focus on the Load-more control. NosLog moves focus to
  the first new card because the appended cards precede the relocated control in
  document order, and supplements the move with one polite settled announcement.

## Rejected or Superseded Alternatives

- **Separate duplicate Chart-search page — Superseded:** Keep one discovery surface
  with explicit Music and Chart scopes.
- **Permanent Music/Chart button row — Rejected:** Use the compact leading selector and
  reinforce scope through text cues and results.
- **Hidden Expert `8–12` initial filter — Rejected:** Initial Music browse includes the
  complete eligible catalog.
- **One top-level card per Chart difficulty — Rejected:** Group published matching
  difficulties under their Music identity.
- **Clear the query after no results — Rejected:** Preserve the user's work and support
  correction.
- **Instructional no-result subtitle — Rejected:** Search, scope, and filter controls
  remain visible. Do not restate obvious recovery steps in prose.
- **Duplicate no-result action group — Rejected:** Keep query clearing, filter
  removal/reset, and scope change in their normal controls rather than adding
  **Clear query**, **Clear filters**, **Search Music**, or Music-detail actions to the
  empty region.
- **Popular Music, unrelated recommendations, or silent query expansion after no
  results — Rejected:** Preserve exact official-catalog and publication meaning.
- **Render retrieval failure as no results — Rejected:** Keep unavailable data and a
  valid zero-result response as distinct states.
- **Universal instant filtering — Rejected:** Result-obscuring mobile layers would
  change unseen content after every selection and create repeated requests.
- **Universal Apply filtering — Rejected:** A result-visible desktop layout would add
  confirmation without useful feedback.
- **Apply and then Close as two mobile actions — Rejected:** One **View results** action
  commits and returns.
- **Return to the Filter-and-sort trigger after successful mobile commit — Rejected:**
  Keep trigger return for cancellation. A successful **View results** action completes
  the layer task and proceeds to the directly related result-summary step.
- **Focus or auto-open the first result after mobile commit — Rejected:** It skips the
  committed count, sort, and applied-state context and has no stable target when the
  result set is empty.
- **Choose mobile commit focus by touch versus keyboard input — Rejected:** A device
  may switch input methods and screen readers can operate through touch. Use one
  logical DOM destination and vary only the visible focus treatment when appropriate.
- **Mandate a separate visual row for the result summary now — Deferred:** The summary
  is required as a distinct visible semantic element, but same-row versus split-row
  composition requires localized `390px` specimen validation.
- **Automatic infinite scroll — Rejected:** Use explicit Load more with recoverable
  incremental states and restorable context.
- **`16` results per batch — Rejected:** It shortens the first mobile scan but creates
  unnecessary continuation actions in wider and denser result layouts.
- **`24` results or a viewport-dependent batch — Rejected:** It lengthens the mobile
  Grid and makes responsive view changes alter the logical result set. Keep one
  predictable `20`-unit contract.
- **Visible “20 Music” or “20 Charts” continuation copy — Rejected:** A Chart result is
  a Music group that can contain several difficulty targets. Use localized
  **20 more results** visibly and put the active scope in the accessible name.
- **Keep focus on the relocated Load-more action after success — Rejected:** Newly
  appended actionable cards precede it in document order, forcing reverse keyboard
  navigation. Move to the first new result and announce settled progress.
- **Public `loaded=60` or batch query parameter — Rejected:** Loaded amount and reading
  position are ephemeral history-entry state, while the shared URL keeps durable
  discovery criteria only.
- **Pre-mandated virtualization — Rejected for now:** First validate the new component
  at `20/60/100`, simplify markup and loading, and require accessible windowing only
  if measured cost remains unacceptable.
- **Internally scroll five-row Home preview — Rejected upstream:** Home hands complete
  discovery to this page instead of embedding a second scroll region.
- **NOSTALGIA Clear filter — Rejected:** It does not distinguish a meaningful discovery
  outcome for this game and duplicates ordinary played-result coverage.
- **◆JUST, MISS+NEAR, timing, and note-type weakness as search filters — Rejected:**
  Keep rich metrics in record analysis and retain only the actionable absolute MISS
  range in advanced discovery.
- **Remove MISS refinement entirely — Rejected:** Absolute MISS thresholds have direct
  NOSTALGIA practice-goal evidence and comparable catalog precedent when kept
  secondary.
- **Permanent matched-record line on every resting card — Rejected:** Preserve the
  approved identity-first card and use applied-state summary plus capability-gated
  hover/focus preview or destination detail.
- **Pointer-only record preview — Rejected:** Any hover disclosure must have an
  equivalent keyboard-focus path and must not be required on touch.
- **Composite weakness sort — Rejected:** Its implementation-specific weighting is not
  an understandable or approved user goal.
- **Hidden Expert fallback or blended representative level — Rejected:** Level order
  requires an explicitly selected difficulty.
- **Permanent difficulty button row for level sort — Rejected:** Keep the target inside
  progressive sort disclosure so the collection toolbar does not become a repeated
  control strip.
- **Separate permanent Filter and Sort buttons on narrow layouts — Rejected:** Use one
  explicit Filter-and-sort entry while keeping the current sort and applied-filter
  count visible outside it. This does not merge their internal semantics.
- **Played-in-last-30-days filter — Superseded:** Earlier retention inherited a current
  implementation control without a verified high-value intersection task. Keep recent
  play as a signed-in sort instead.
- **Chart grid view — Rejected:** Published difficulty selection needs a grouped,
  scannable list under Music identity rather than an additional artwork mode.
- **Database creation or update time as Music release date — Rejected:** Import and
  maintenance timestamps cannot support a truthful newest-Music sort.
- **Dedicated difficulty row in Music List — Rejected:** It spends scarce vertical
  space on compact informational values that fit a stable trailing group.
- **Universal `96–112px` Music List row — Rejected:** Use content-driven
  `64–100px` height so short identities remain compact and long localized content gains
  only the space it needs.
- **One full-width table-like desktop List — Rejected:** Add a second compact List
  column when each card can retain approximately `440–460px`; reserve denser multi-
  column artwork scanning for Grid.
- **Replace only trailing difficulties with the record preview — Rejected:** It hides
  official difficulty context yet does not provide enough room for several matching
  records.
- **Separate popup, expanding panel, or layout-shifting record preview — Rejected:**
  Use an alternate state within the same card dimensions.
- **First-tap or long-press touch preview — Rejected:** One tap opens Music detail,
  preserving the primary action and avoiding a hidden mobile step.
- **Distort or crop the Grid jacket to equalize complete card height — Rejected:**
  Preserve `1 / 1` artwork and let the lower information region absorb long content.

## Open Design Questions

The following decisions require a new evidence-and-approval batch before this brief can
be approved:

1. When Unplayed and signed-in recent-play order conflict, should selecting one disable
   the other, replace it with the scope default, or use another explicitly tested
   transition?

## Browser Verification Targets

The later implementation must verify at minimum:

- `/ko/music`, `/ja/music`, and `/en/music` in Music and Chart scopes;
- direct Home/More entries, empty browse, query handoff, URL sharing, reload, Back, and
  Forward restoration;
- Korean and Japanese IME composition with `300ms` settled search;
- query change, scope change, and filter change during active requests, including
  deliberately reordered responses;
- all-Music initial browse with no hidden difficulty restriction;
- empty Music browse ordered by `title_kana` ascending in all three locales;
- empty Chart browse ordered by each Music group's latest published-chart timestamp,
  with targets in `Normal → Hard → Expert → Real` order;
- newest-Music sorting with verified official release dates, including the unavailable
  data-gate state and no fallback to database timestamps;
- absence of weakness sorting and explicit difficulty selection before level order;
- active-query Relevance fallback, explicit-sort persistence, and return to the
  scope default when a Relevance query is cleared;
- Chart grouping with zero, one, and multiple published matching difficulties;
- direct published-difficulty entry to the focused viewer and exact return-state
  restoration;
- one mobile Filter-and-sort trigger, distinct internal sections, staged sort/filter
  state, generic and counted result actions, cancel, commit, clear one, and clear all;
- separate desktop Filter and Sort controls, instant discrete filters, immediate sort,
  and debounced/committed range controls;
- omission of the signed-out personal group and signed-in advanced-group disclosure;
- S, FC, Pianist, and Unplayed criteria; absence of the 30-day-played filter;
  signed-in recent-play order; inclusive best-record MISS bounds; within-group `OR`;
  cross-group `AND`; and Unplayed conflict prevention;
- Music list-default/grid switching and stable base identity with zero, one, and
  several matching difficulty records;
- List title order, category badge placement, `56px` jacket, trailing difficulty group,
  content-driven `64–100px` height, line limits, one-to-two-column switch, and no
  horizontal overflow around the `440–460px` per-card boundary;
- square Grid jackets, two columns at `390px`, independently growing information
  regions, reserved two-line artist slots, and validated wider multi-column behavior;
- grouped-list-only Chart results with no grid toggle;
- capability-gated pointer-hover and equivalent keyboard-focus previews in fixed card
  dimensions; Escape dismissal, Enter activation, reduced motion, and direct touch
  navigation without first-tap, long-press, or another synthetic hover step;
- initial loading, slow response, empty result, retrieval error, incremental loading,
  incremental error, retry, and end of results;
- text-mismatch, filter-constrained, no-published-Chart, empty-catalog, and retrieval-
  failure classification, including combinations of query, filters, and Chart
  publication state;
- exact Korean, Japanese, and English one-line no-result copy, preserved committed
  query/scope/sort/view/filter state, removable chips, filter-only clear-all, no
  duplicate empty-state actions, no fallback recommendations, and one polite settled
  announcement without focus movement;
- initial `20`, repeated `20`, and final partial batches in Music List, Music Grid, and
  grouped Chart results, with no viewport-triggered request;
- localized next-amount action, visible/total progress, busy state, first-new-result
  focus, polite settled announcements, failure focus retention, and completion copy;
- accumulated `20`, `60`, and `100` result performance and DOM behavior on
  representative mobile and desktop browsers;
- copied-URL first-batch behavior and Back/Forward rehydration of the loaded count,
  selected-result anchor, and nearby reading position without a public batch
  parameter;
- narrow `390px`, compact-height mobile, browser zoom, and representative desktop
  widths without horizontal overflow;
- long original Japanese titles, Korean and English translated captions, missing
  artist, missing translation, and Real-unavailable data;
- keyboard-only scope, search, filters, result selection, Load more, retry, and return;
- mobile Filter-and-sort commit with ready, pending, unchanged, and zero-result states;
  summary focus and non-duplicated announcement; Close, Back, and Escape trigger-focus
  plus reading-context restoration;
- focus order, focus return, status announcements, landmarks, target size, reduced
  motion, and browser-console errors.

## Acceptance Criteria for This Brief

- Music and Chart scope remain semantically distinct within one shared surface.
- Initial Music browse has no hidden Expert `8–12` restriction.
- Empty Music and Chart browse have explicit scope-appropriate orders, and newest Music
  order is gated by verified official release-date data.
- Published Chart results are grouped by Music and never expose unavailable targets.
- Weakness sort is absent, and level sort never has an implicit difficulty basis.
- Active-query Relevance, explicit-sort persistence, mobile combined Filter-and-sort
  commitment, desktop separated live controls, and applied-state removal have explicit
  non-conflicting rules.
- Mobile **View results** commits and closes into a visible, focused result summary;
  cancel paths restore the trigger and prior reading context; pending updates produce
  one settled polite announcement without duplicate count speech. The summary's exact
  same-row or split-row visual placement remains a specimen decision rather than an
  unresolved behavior.
- Authenticated record refinement has an approved lean taxonomy, best-record MISS
  semantics, combination rules, and impossible-state handling.
- Music result identity, content order, line budgets, List/Grid density boundaries,
  square-jacket behavior, capability-based hover/focus record context, and direct
  touch-detail behavior are explicit. Foundation styling tokens remain downstream
  work rather than reopening the approved structure.
- Automatic infinite scroll is absent. Explicit progressive loading uses a stable
  `20`-result contract, localized next-amount and progress copy, loading, focus,
  announcement, retry, end, history restoration, and `20/60/100` performance
  requirements.
- No-result handling preserves discovery work, distinguishes cause internally, uses
  the approved one-line localized copy, keeps recovery in the existing controls, and
  never substitutes explanatory paragraphs, duplicate actions, unrelated fallback
  content, or an error state.
- Current implementation facts are not misrepresented as approved 2.0 behavior.
- Mobile and desktop requirements share one product model while adapting to result
  visibility and available width.
- Korean, Japanese, English, accessibility, performance, and browser-verification
  requirements are documented.
- Every unresolved material choice remains visibly `Open` or `Proposed`.
- The user explicitly approves the remaining decision register before the artifact is
  marked `Approved`.

## Decision Register

| ID      | Decision                        | Direction                                                                                                                                                                                                                                   | Status       |
| ------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| DISC-01 | Discovery architecture          | One shared surface with Music and Chart scopes                                                                                                                                                                                              | `Approved`   |
| DISC-02 | Scope control                   | Compact leading selector with visible text in the opened control; no permanent mode-button row                                                                                                                                              | `Approved`   |
| DISC-03 | Scope entry                     | Music entries open Music scope; Chart Viewer entries open Chart scope; query and scope are shareable and restorable                                                                                                                         | `Approved`   |
| DISC-04 | Empty Music browse              | Include the complete eligible Music catalog; remove the hidden Expert `8–12` default                                                                                                                                                        | `Approved`   |
| DISC-05 | Chart eligibility               | Return only published matching Chart targets                                                                                                                                                                                                | `Approved`   |
| DISC-06 | Chart grouping                  | One result unit per Music with its published matching difficulties                                                                                                                                                                          | `Approved`   |
| DISC-07 | Chart selection                 | Selecting a published difficulty opens that exact focused viewer directly                                                                                                                                                                   | `Approved`   |
| DISC-08 | Text-query application          | IME-safe update after `300ms` idle; preserve query on no results                                                                                                                                                                            | `Approved`   |
| DISC-09 | Mobile sort/filter application  | Stage both in a result-obscuring layer; one **View results** action commits and closes; Close/Back cancels                                                                                                                                  | `Approved`   |
| DISC-10 | Desktop filter application      | Apply visible discrete filters immediately; debounce or commit continuous controls                                                                                                                                                          | `Approved`   |
| DISC-11 | Applied-state removal           | Removing one criterion or clearing all applies immediately                                                                                                                                                                                  | `Approved`   |
| DISC-12 | Progressive loading             | No automatic infinite scroll; use explicit Load more                                                                                                                                                                                        | `Approved`   |
| DISC-13 | Progressive state               | Provide count/range, busy, retry, end, URL/history, loaded-state, and meaningful scroll restoration                                                                                                                                         | `Approved`   |
| DISC-14 | Initial ordering                | Empty Music uses `title_kana` ascending; empty Chart uses latest published-chart group descending                                                                                                                                           | `Approved`   |
| DISC-15 | Filter and sort taxonomy        | Public category/difficulty/level filters; approved scope sort sets; personal record criteria remain secondary                                                                                                                               | `Approved`   |
| DISC-16 | Music result composition        | Compact content-driven List with trailing difficulties; square-jacket Grid with flexible information region; capability-based same-card record preview and direct touch detail                                                              | `Approved`   |
| DISC-17 | Batch size and copy             | Initial and appended batches use `20` result units; localize actual-next-amount and exact progress copy; focus the first new result; keep ephemeral loaded state in browser history                                                         | `Approved`   |
| DISC-18 | No-result recovery              | Separate failure and service-level catalog absence; classify filter constraint, text mismatch, and publication absence internally; preserve committed state and show only concise scope-appropriate copy with recovery in existing controls | `Approved`   |
| DISC-19 | Mobile post-commit focus        | Commit focuses the visible result summary; cancel restores trigger and prior context; announce one settled pending outcome; defer row composition to specimens                                                                              | `Approved`   |
| DISC-20 | Authenticated record taxonomy   | Keep Unplayed, S, FC, Pianist, and one advanced MISS range; remove Clear, 30-day play, and low-value metric filters                                                                                                                         | `Approved`   |
| DISC-21 | MISS semantics                  | Inclusive optional bounds against each eligible difficulty's best record; never combine MISS with Near                                                                                                                                      | `Approved`   |
| DISC-22 | Record-filter logic             | `AND` across groups, `OR` within a group; Unplayed excludes achieved criteria and conflicts with recent-play order                                                                                                                          | `Approved`   |
| DISC-23 | Music result identity           | Jacket, original and optional localized/read title, artist, category, all official difficulties; list and grid                                                                                                                              | `Approved`   |
| DISC-24 | Personal-record preview         | Identity-first resting result; capability-gated hover and focus preview matched records; touch opens detail without hover                                                                                                                   | `Approved`   |
| DISC-25 | Newest Music sort               | Provide it only with verified official Music-level release dates; never substitute database maintenance timestamps                                                                                                                          | `Approved`   |
| DISC-26 | Weakness sort                   | Remove the opaque composite weakness order                                                                                                                                                                                                  | `Approved`   |
| DISC-27 | Level-sort basis                | Require an explicit target difficulty; never use hidden Expert fallback or a blended representative level                                                                                                                                   | `Approved`   |
| DISC-28 | Scope result views              | Music opens as list with optional jacket grid; Chart remains one grouped list without a grid toggle                                                                                                                                         | `Approved`   |
| DISC-29 | Active-query sort precedence    | Default to Relevance without a user sort; preserve explicit sort; clear-query Relevance returns to the scope default                                                                                                                        | `Approved`   |
| DISC-30 | Responsive sort/filter access   | One labelled combined mobile trigger and staged layer; separate result-visible desktop controls                                                                                                                                             | `Approved`   |
| DISC-31 | Signed-out personal controls    | Omit the personal-record group instead of disabled criteria or an embedded login invitation                                                                                                                                                 | `Approved`   |
| DISC-32 | 30-day play-filter retention    | Former retention is replaced by removal; recent play remains a signed-in sort                                                                                                                                                               | `Superseded` |
| DISC-33 | Unplayed/recent-sort transition | Preserve the approved conflict semantics; choose the exact disable/reset transition through prototype testing                                                                                                                               | `Open`       |

## Next Discussion Batch

Resolve the `DISC-33` Unplayed/recent-sort transition next. Do not reopen the approved
taxonomy, progressive-loading contract, no-result recovery, responsive control access,
mobile post-commit focus, or Music card anatomy without new evidence and user
approval. Foundation tokens, the result-summary row composition, and exact Chart-row
visuals still require their scheduled representative specimens, but they do not
reopen `DISC-16`, `DISC-17`, `DISC-18`, or `DISC-19`.
