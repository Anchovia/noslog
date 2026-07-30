# NosLog 2.0 Shared Music and Published-Chart Discovery Page Brief

## Document Control

- Status: `In progress`
- Decision status: `Approved directions recorded; remaining page decisions open`
- Evidence status: `Repository inspection, current-product browser audit, approved
information architecture, approved Home handoff, and cited search/filter guidance`
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

### Observed Browser Baseline

The approved current-product audit verified `/ko/music`, `/ja/music`, and `/en/music`
at a narrow `390px` viewport and a wide desktop viewport.

- Search, filters, sorting, view controls, and results were usable without document-
  level horizontal overflow.
- The current wide layout remains visually constrained by the general `390px` shell.
- Japanese content produced a longer page than Korean and English, reinforcing the
  need to test real localized labels and title lengths.
- These observations confirm available functionality. They do not approve the current
  default Expert filter, automatic loading, visual density, card composition, or
  desktop width.

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
- “Complete catalog” means every eligible Music entry can be reached. It does not yet
  determine initial ordering, card density, or batch size.
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

## Filter Application Model

The approved model is responsive and task-sensitive, not one universal “instant” or
“Apply” rule.

### Mobile and Other Result-Obscuring Layouts

- Open filters in a full-screen or near-full-screen layer when the result collection
  cannot remain meaningfully visible beside the controls.
- Let the user stage multiple category, difficulty, range, and personal-record changes
  without replacing the obscured result collection after every selection.
- Use one sticky primary action labelled as a return to the result task, not as
  administrative confirmation: **View results** or, when a valid count is ready,
  **View N results**.
- The primary action simultaneously commits the staged criteria and closes the filter
  layer. Do not require a second Close action after applying.
- The generic **View results** label remains usable while a result count is pending;
  count calculation must not block completion.
- Back or Close exits without committing staged changes and restores the previously
  applied filter state.
- Applied filters remain visible near the result summary after the layer closes.

This is not treated as an extra task step: a user in a result-obscuring layer must
return to the results in either model, and the primary action combines that necessary
return with filter commitment.

### Desktop and Other Result-Visible Layouts

- Keep the main result collection visible beside or near exposed filter controls.
- Apply discrete filter choices immediately because the user can see the resulting
  change.
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

## Explicit Progressive Loading

- Do not automatically load more results from scroll position.
- Provide a clearly labelled **Load more** control after the current collection when
  another batch exists.
- Show the total matching count and the currently visible range when reliable data is
  available.
- The control should make the next action predictable. It may include the next batch
  amount after the batch-size decision is approved.
- Activating it appends the next batch without removing or reordering the already
  visible collection.
- Keep the control location stable during loading and expose an appropriate busy
  state.
- An incremental-load failure leaves existing results intact and offers a retry at the
  same location.
- When no further result exists, remove or replace the action with an unambiguous end
  state; do not leave a disabled control without explanation.
- Scope, query, applied filters, sort, loaded cursor/batch state, and meaningful scroll
  position must be restorable when returning from Music detail or the focused chart
  viewer.

The exact batch size is intentionally open and must be tested with representative card
density, server response time, mobile memory, and return-state behavior.

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
- Original title
- Selected approved Korean or English title, or Japanese reading, when enabled and
  available
- Artist when available
- Category context
- Available difficulty and level information
- Enough destination context to predict that selection opens Music detail
- Personal record context only when authenticated and relevant to approved filter or
  sort behavior

#### Chart Scope

- Stable Music identifier and identity
- Original and selected localized/read-title treatment
- Artist when useful for disambiguation
- Only published matching difficulty targets
- Difficulty and level for every selectable target
- A direct, unambiguous focused-viewer destination per selectable difficulty

Exact visual fields, jacket prominence, record-summary density, and list-versus-grid
availability remain open.

## State Requirements

| State                           | Required behavior                                                                             | Status              |
| ------------------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| Initial Music browse            | Show the complete eligible catalog in batches with no hidden Expert `8–12` restriction        | `Approved`          |
| Initial Chart browse            | Show only entries with published charts; exact default order remains open                     | `Approved` / `Open` |
| Settled active search           | Replace the result set after `300ms` idle and synchronize committed URL state                 | `Approved`          |
| Fast response                   | Update without flashing a transient loading treatment                                         | `Proposed`          |
| Slow initial or filter response | Keep search/filter controls stable and communicate busy state in the result region            | `Proposed`          |
| No result                       | Preserve query and applied criteria, identify the active scope, and offer reversible recovery | `Approved` / `Open` |
| Initial retrieval failure       | Preserve controls and state; provide retry without redirecting away                           | `Proposed`          |
| Mobile filters open             | Show staged values separately from the committed result state                                 | `Approved`          |
| Mobile filter count pending     | Keep a usable generic **View results** action                                                 | `Approved`          |
| Mobile filter close/back        | Discard staged changes and restore committed values                                           | `Approved`          |
| Signed-out personal filter      | Do not pretend the filter is active; exact login invitation or omission remains open          | `Observed` / `Open` |
| Load more pending               | Keep existing results, mark the action busy, and prevent duplicate activation                 | `Approved`          |
| Load more failure               | Keep existing results and provide localized retry                                             | `Approved`          |
| End of results                  | Communicate completion without automatic additional loading                                   | `Approved`          |
| Return from destination         | Restore scope, query, committed criteria, sort, loaded batches, and meaningful scroll         | `Approved`          |

## Responsive Requirements

### Narrow Layout

- Preserve one strong vertical task sequence: scope-aware search, compact committed
  state, results, then explicit Load more.
- Keep dense filters out of the permanent content column. Open them in the approved
  result-obscuring filter layer.
- Do not add a mobile-only bottom navigation or a persistent row of scope/filter
  buttons.
- Ensure the software keyboard, Korean/Japanese IME composition, browser chrome, and
  compact viewport height do not hide the filter completion action.
- Result cards must tolerate long Japanese titles and multi-line translated captions
  without horizontal overflow.

### Wide Layout

- Do not stretch a `390px` mobile canvas across a desktop.
- Use additional width to keep results visible with an exposed filter rail or region
  and to improve Music/difficulty comparison.
- Preserve one search and scope model rather than introducing desktop-only taxonomy.
- Do not place unrelated announcements or navigation in space intended to support
  search, filtering, or result comparison.
- Set a readable outer content boundary after representative result-card testing;
  exact container and column tokens remain open.

## Accessibility Requirements

- Provide an explicit accessible name for the search field that includes or is
  programmatically associated with the active scope.
- The compact scope selector must expose its selected value, expanded state, controlled
  popup, keyboard operation, visible text choices, and predictable focus return.
- Search updates must not move focus on every result refresh.
- Result-count updates use restrained live-region semantics and must not announce
  intermediate stale responses.
- The mobile filter layer requires an accessible name, contained focus while modal,
  Escape/back behavior, and focus return to its trigger.
- The mobile completion action must remain reachable at browser zoom and compact
  viewport heights.
- Applying filters must provide an understandable result update. The exact focus
  destination after mobile commit remains an open accessibility-prototype decision;
  it must not unexpectedly discard the user's reading context.
- Applied-filter removal controls must include the category and value in their
  accessible names.
- **Load more** must be a keyboard-operable explicit control. After append, focus
  should remain predictable and the newly added range must be understandable without
  forcing a focus jump.
- Use semantic result headings/lists and one page-level `main` landmark.
- Meet WCAG 2.2 target-size or target-spacing requirements for scope, filter, clear,
  result, and progressive-loading controls.

## Localization Requirements

- Validate all visible and accessible labels in Korean, Japanese, and English.
- Preserve the original Music title as the primary identity.
- When the title-display preference is enabled, show the approved Korean/English title
  or Japanese reading as secondary text without replacing the original title.
- Do not truncate the only available identifying title. Multi-line treatment is
  preferable to ambiguous clipping.
- Text search and the `300ms` idle trigger must be composition-safe for Korean and
  Japanese IME input.
- Dynamic result counts, visible ranges, and Load-more amounts require locale-aware
  number and grammar handling; do not construct them through unsafe string
  concatenation.
- Scope, filter, difficulty, result-state, retry, and end-state copy must be complete
  in all three locales before the page family is accepted.
- Query and filter URL values remain stable technical identifiers where translating
  them would break sharing or implementation mapping.

## Reference Comparison

The references below were compared for interaction principles, not copied as visual
templates. Commerce evidence is used only where the filtering task transfers to
NosLog; enterprise and government systems are structural and accessibility references,
not NosLog art direction.

| Source                                                                                                                   | Transferable principle                                                                                                                    | NosLog application                                                                                               | Limitation                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [SAP Fiori: Filter Bar](https://www.sap.com/design-system/fiori-design-web/ui-elements/filter-bar/)                      | Live update is more convenient when feasible; manual update is appropriate for multiple required values or excessive traffic.             | Use live result-visible desktop filters and staged result-obscuring mobile filters.                              | Enterprise list reports are denser and more configurable than NosLog.                                       |
| [Carbon: Filtering](https://carbondesignsystem.com/patterns/filtering/)                                                  | Instant update fits one expected choice; batch update fits several categories or slow responses.                                          | NosLog's many categories, ranges, and personal filters require more than one universal rule.                     | Carbon examples emphasize enterprise data products.                                                         |
| [Dell Design System: Filter](https://delldesignsystem.com/patterns/filter)                                               | Dynamic filtering removes Apply but can distract; batch filtering supports complex multi-select and slow data.                            | Keep desktop feedback visible and let mobile users finish multiple changes before replacing obscured results.    | Its “batch as safe default” is not a substitute for NosLog testing.                                         |
| [NSW Design System: Filters](https://designsystem.nsw.gov.au/components/filters/)                                        | Instant and batch models depend on expected action count; mobile batch uses a sticky Apply action that also closes the filter view.       | The NosLog mobile **View results** action combines commit and return, avoiding a separate close step.            | Government search content differs from a rhythm-game catalog.                                               |
| [Visa Product Design System: Filters](https://design.visa.com/patterns/filters/)                                         | Repeated instant reloads can disorient; applied chips and clear state must remain explicit.                                               | Keep committed filters visible and make chip removal immediate.                                                  | Visa generally prefers Apply and may overfit transaction/data workflows.                                    |
| [DWP Design System: Filter research](https://design-system.dwp.gov.uk/research/filters/design-notes)                     | Batch prevents repeated refresh, but pending and committed state can become unsynchronized; result count and applied tags bridge the gap. | Visually separate staged mobile values from committed result state and show count/applied criteria after return. | The published research favors batch overall and must be balanced against NosLog's faster consumer task.     |
| [Scottish Government: Search filters](https://designsystem.gov.scot/patterns/search-results/search-filters)              | Mobile results should not update invisibly behind opened filters; desktop may update automatically.                                       | Supports responsive filter application instead of one behavior on every width.                                   | Public-service content and filtering frequency differ.                                                      |
| [VA.gov: Search Filter](https://design.va.gov/components/search-filter)                                                  | Multi-facet results need explicit apply/reset behavior and careful focus communication.                                                   | Informs mobile commit, reset, error, and accessibility requirements.                                             | It mandates Apply more broadly than the approved NosLog desktop behavior.                                   |
| [Maersk: Filter patterns](https://designsystem.maersk.com/guidelines/search-filter-and-sort/filter-patterns/)            | Live results are suitable when fast; batch avoids repeated loads when responses are slower or mobile results are obscured.                | Performance thresholds must be measured, while the interaction remains predictable.                              | Logistics applications have different data volume and user expertise.                                       |
| [NICE Design System: Filters](https://design-system.nice.org.uk/components/filters/)                                     | Result summaries, applied state, and retryable filtering belong to one coherent pattern.                                                  | Keep count, committed criteria, result collection, and recovery semantically adjacent.                           | The component does not resolve NosLog card content or update mode.                                          |
| [Australian Agriculture Design System: Search filters](https://design-system.agriculture.gov.au/patterns/search-filters) | A responsive filter drawer can batch changes and close through one Apply action.                                                          | Supports the approved result-obscuring mobile layer.                                                             | It is a government implementation pattern, not visual direction.                                            |
| [Department for Education: Filter](https://design.education.gov.uk/design-system/components/filter)                      | Place the completion action where users finish selecting, and test mobile discoverability.                                                | Keep the mobile result action sticky and reachable after long filter groups.                                     | It derives from the Ministry of Justice pattern and is not independent visual evidence.                     |
| [Siemens Element: Filter](https://element.siemens.io/patterns/filter/)                                                   | Choose batch for multiple changes and live update when immediate feedback is valuable.                                                    | Reinforces the responsive, task-sensitive split.                                                                 | Industrial applications differ from public music discovery.                                                 |
| [Octopus Design System: Filtering](https://www.octopus.design/latest/patterns/ui-patterns/filtering-ib9jS2iT)            | Filter state should remain dismissible and impossible combinations should be communicated.                                                | Applied criteria need individual removal and zero-result recovery.                                               | Exact filter-control choices remain NosLog-specific.                                                        |
| [Baymard: Ecommerce filter UI](https://baymard.com/learn/ecommerce-filter-ui)                                            | Desktop benefits from visible real-time feedback, while mobile often benefits from a results-return action and visible applied state.     | The responsive interaction pattern transfers even though NosLog does not inherit merchandising behavior.         | Ecommerce research cannot determine NosLog's fields, ordering, or visual style.                             |
| [eBay: Filtering patterns](https://playbook.ebay.com/design-system/patterns/filtering-patterns)                          | Users need to adjust and remove criteria without restarting discovery.                                                                    | Preserve query, expose committed filters, and make recovery reversible.                                          | Marketplace inventory and commercial facets do not transfer.                                                |
| [Algolia: Faceting](https://www.algolia.com/doc/guides/managing-results/refine-results/faceting)                         | Contextual facet values and counts can update with result state.                                                                          | Supports exact applied-state counts when performance and query design are verified.                              | Search-engine capability does not prove that live counts are always good UX.                                |
| [Elastic Search UI](https://www.elastic.co/docs/reference/search-ui)                                                     | Search-as-you-type, faceting, and conditional facets require explicit state and request handling.                                         | Supports active text search and stale-request protection as implementation capabilities.                         | It is technical tooling guidance rather than independent user research.                                     |
| [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                             | Editable popup controls require defined keyboard, focus, selection, and popup relationships.                                              | The scope-aware search and suggestions must not rely on pointer interaction or icons alone.                      | The exact scope selector may use a menu rather than a combobox and must follow its actual semantic pattern. |
| [WCAG 2.2: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                            | Dynamic results and status changes should be available to assistive technology without taking focus.                                      | Announce settled counts and failures without moving focus on every refresh.                                      | It does not prescribe debounce timing or visual presentation.                                               |

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

### Evidence Disagreement and NosLog Resolution

- Visa and DWP lean toward batch filtering; SAP leans toward live update whenever
  feasible. Carbon, Dell, NSW, Siemens, Maersk, and Baymard make the choice conditional
  on filter complexity, result visibility, response time, or viewport.
- NosLog resolves this disagreement through the approved responsive hybrid rather
  than choosing one source as a universal rule.
- Algolia and Elastic demonstrate technical feasibility but do not by themselves
  justify an interaction. The downstream implementation must still meet measured
  latency, cancellation, and accessibility requirements.

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
- **Universal instant filtering — Rejected:** Result-obscuring mobile layers would
  change unseen content after every selection and create repeated requests.
- **Universal Apply filtering — Rejected:** A result-visible desktop layout would add
  confirmation without useful feedback.
- **Apply and then Close as two mobile actions — Rejected:** One **View results** action
  commits and returns.
- **Automatic infinite scroll — Rejected:** Use explicit Load more with recoverable
  incremental states and restorable context.
- **Internally scroll five-row Home preview — Rejected upstream:** Home hands complete
  discovery to this page instead of embedding a second scroll region.

## Open Design Questions

The following decisions require a new evidence-and-approval batch before this brief can
be approved:

1. What initial ordering should Music and Chart browse use when the query is empty?
2. Which filters and sorts belong to both scopes, and which are Music- or Chart-only?
3. How should authenticated personal-record filters be introduced without overwhelming
   ordinary public discovery or hiding useful capability?
4. What information belongs on Music and Chart result cards at mobile and desktop
   densities, and should list/grid switching remain user-controlled?
5. What batch size and Load-more copy produce the best balance of scanning, response
   time, memory, and return-state restoration?
6. Which no-result recovery actions should be ordered first for text mismatch, an
   over-constrained filter set, and no published Chart availability?
7. After mobile filter commit, should focus remain on the returning filter trigger,
   move to the result summary, or follow a conditional rule based on input method?

## Browser Verification Targets

The later implementation must verify at minimum:

- `/ko/music`, `/ja/music`, and `/en/music` in Music and Chart scopes;
- direct Home/More entries, empty browse, query handoff, URL sharing, reload, Back, and
  Forward restoration;
- Korean and Japanese IME composition with `300ms` settled search;
- query change, scope change, and filter change during active requests, including
  deliberately reordered responses;
- all-Music initial browse with no hidden difficulty restriction;
- Chart grouping with zero, one, and multiple published matching difficulties;
- direct published-difficulty entry to the focused viewer and exact return-state
  restoration;
- mobile filter staging, generic and counted result actions, cancel, commit, clear
  one, and clear all;
- desktop instant discrete filters and debounced/committed range controls;
- signed-out and signed-in personal-filter states;
- initial loading, slow response, empty result, retrieval error, incremental loading,
  incremental error, retry, and end of results;
- explicit Load more with no viewport-triggered request;
- narrow `390px`, compact-height mobile, browser zoom, and representative desktop
  widths without horizontal overflow;
- long original Japanese titles, Korean and English translated captions, missing
  artist, missing translation, and Real-unavailable data;
- keyboard-only scope, search, filters, result selection, Load more, retry, and return;
- focus order, focus return, status announcements, landmarks, target size, reduced
  motion, and browser-console errors.

## Acceptance Criteria for This Brief

- Music and Chart scope remain semantically distinct within one shared surface.
- Initial Music browse has no hidden Expert `8–12` restriction.
- Published Chart results are grouped by Music and never expose unavailable targets.
- Text search, mobile filter commitment, desktop live filtering, and applied-state
  removal have explicit non-conflicting rules.
- Automatic infinite scroll is absent and explicit progressive loading includes
  loading, retry, end, and return-state requirements.
- Current implementation facts are not misrepresented as approved 2.0 behavior.
- Mobile and desktop requirements share one product model while adapting to result
  visibility and available width.
- Korean, Japanese, English, accessibility, performance, and browser-verification
  requirements are documented.
- Every unresolved material choice remains visibly `Open` or `Proposed`.
- The user explicitly approves the remaining decision register before the artifact is
  marked `Approved`.

## Decision Register

| ID      | Decision                   | Direction                                                                                                           | Status     |
| ------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------- |
| DISC-01 | Discovery architecture     | One shared surface with Music and Chart scopes                                                                      | `Approved` |
| DISC-02 | Scope control              | Compact leading selector with visible text in the opened control; no permanent mode-button row                      | `Approved` |
| DISC-03 | Scope entry                | Music entries open Music scope; Chart Viewer entries open Chart scope; query and scope are shareable and restorable | `Approved` |
| DISC-04 | Empty Music browse         | Include the complete eligible Music catalog; remove the hidden Expert `8–12` default                                | `Approved` |
| DISC-05 | Chart eligibility          | Return only published matching Chart targets                                                                        | `Approved` |
| DISC-06 | Chart grouping             | One result unit per Music with its published matching difficulties                                                  | `Approved` |
| DISC-07 | Chart selection            | Selecting a published difficulty opens that exact focused viewer directly                                           | `Approved` |
| DISC-08 | Text-query application     | IME-safe update after `300ms` idle; preserve query on no results                                                    | `Approved` |
| DISC-09 | Mobile filter application  | Stage in a result-obscuring layer; one **View results** action commits and closes; Close/Back cancels               | `Approved` |
| DISC-10 | Desktop filter application | Apply visible discrete filters immediately; debounce or commit continuous controls                                  | `Approved` |
| DISC-11 | Applied-state removal      | Removing one criterion or clearing all applies immediately                                                          | `Approved` |
| DISC-12 | Progressive loading        | No automatic infinite scroll; use explicit Load more                                                                | `Approved` |
| DISC-13 | Progressive state          | Provide count/range, busy, retry, end, URL/history, loaded-state, and meaningful scroll restoration                 | `Approved` |
| DISC-14 | Initial ordering           | Determine Music- and Chart-scope defaults with representative data                                                  | `Open`     |
| DISC-15 | Filter and sort taxonomy   | Determine shared, scope-specific, and authenticated controls                                                        | `Open`     |
| DISC-16 | Result composition         | Determine mobile/desktop fields, density, jacket treatment, and list/grid availability                              | `Open`     |
| DISC-17 | Batch size and copy        | Validate batch size and exact Load-more label with performance and scan testing                                     | `Open`     |
| DISC-18 | No-result recovery         | Determine recovery priority by query, filter, and publication cause                                                 | `Open`     |
| DISC-19 | Mobile post-commit focus   | Validate focus destination and announcement behavior                                                                | `Open`     |

## Next Discussion Batch

Research and decide `DISC-14` through `DISC-16` together because initial ordering,
filter/sort taxonomy, and result-card information affect one another. Do not finalize
card density or filter prominence independently of representative Music, published
Chart, localized title, and authenticated-record data.
