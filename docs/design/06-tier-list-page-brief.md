# NosLog 2.0 Tier-List Page Brief

## Document Control

- Status: `Approved`
- Decision status: `Core page contract approved: task model, mode and goal
selection, band navigation, filters, personal progress, compact and detailed
result views, per-chart metrics, direct goal-context Music-detail navigation,
relationship to scoped community voting, restoration, and responsive behavior`
- Evidence status: `Repository inspection, current-product audit, approved
information architecture, approved Music-detail contract, cited NOSTALGIA domain
guidance, rhythm-game comparables, responsive systems, accessibility guidance, and
the user-approved decision record`
- Date started: 2026-08-01
- Last decision update: 2026-08-20
- Language: English
- Parent information architecture:
  [02-information-architecture.md](./02-information-architecture.md)
- Downstream destination contract:
  [05-music-detail-page-brief.md](./05-music-detail-page-brief.md)
- Scope: Public `/[locale]/tiers` planning experience, with personal record and
  rating enhancements after authentication
- Excluded: Exact administrator tier-list or vote-review interface composition,
  final foundation tokens, exact high-fidelity composition, and production
  implementation in this design session

## Decision Labels

- **Observed:** Verified in the repository, current browser evidence, or an approved
  upstream artifact.
- **Approved:** Explicitly agreed with the user and authoritative for downstream
  design.
- **Proposed:** Evidence-based direction awaiting user approval.
- **Open:** Requires further research, testing, or a user decision.
- **Rejected:** Considered and explicitly not selected.
- **Superseded:** Replaced by a later approved direction.

This brief is authoritative for the approved Tier-list page behavior and information
hierarchy. Exact typography, color, spacing, radius, icon drawing, card dimensions,
and final breakpoint values remain Foundation and active high-fidelity design work.
Those later decisions may refine expression but must not remove or reinterpret the
approved product contract.

## Purpose

The Tier-list page answers one primary question:

> Which chart should I play next for this performance goal?

The page lets a user choose a NOSTALGIA play mode and achievement goal, move to an
appropriate tier band, compare charts with their own results, and open the exact
Music difficulty for deeper inspection. It is a play-planning workspace rather than
a general Music catalog, a dashboard, or an expandable analytics report.

## Primary Context and Success

- **Approved upstream:** Tier lists are independently reachable from Home and the
  More navigation panel. They are not grouped with Bingo or Exams.
- **Approved:** Mobile use around arcade play is the primary context, while desktop
  remains fully supported for faster comparison and filtering.
- **Approved:** A successful visit ends when the user identifies an appropriate chart
  and opens its exact Music-detail difficulty without losing the planning context
  needed to return.
- **Approved:** The page is public. Authentication adds personal scores, achievement
  states, Grd, and eligible NosLog rating information; it does not replace the public
  collection with a different page.
- **Approved:** Current visual styling and the current `390px` maximum-width shell are
  audit evidence only, not a 2.0 constraint.

## Current-Product Evidence

### Observed Route and Query State

- The public route is `/[locale]/tiers`.
- `mode` selects `basic` or `recital` and defaults to `basic`.
- `goal` selects `s`, `fc`, or `pianist` and defaults to `s`.
- `difficulty` accepts `Normal`, `Hard`, `Expert`, and `Real`.
- `level` accepts regular levels `1–12` and `real-1` through `real-3`.
- Legacy `/[locale]/tiers/[slug]` routes are compatibility redirects and are not a
  new 2.0 navigation family.
- Mode, goal, difficulty, and level currently update URL query state with
  `router.replace` and preserve vertical scroll.

### Observed Data and Loading

- The server loads the published list matching the selected mode and goal.
- Band summaries include ordered band value and filtered chart count.
- The first band is loaded with the page. Later bands load as their sections approach
  the viewport.
- Signed-in users receive best score, rank, Full Combo type, play counts, judgement
  details, note-type rates, best time, and latest FAST/SLOW context per chart.
- Basic NosLog rating uses a maximum of the top `70` eligible contributions and is
  currently defined for the Basic Pianist policy.
- Existing data and APIs can remain useful implementation foundations, but the
  current presentation does not govern 2.0.

### Observed Usability Baseline

- All published bands are currently stacked in one long vertical sequence; the
  audited Korean page was approximately `3,953px` tall.
- The current result grid stays at three columns and does not use wider desktop space
  for band navigation, filters, or comparison.
- Signed-out cards navigate directly to Music detail, while signed-in cards become
  buttons that expand a large record panel inside the grid.
- The expanded panel repeats dense diagnostics that already belong to Music detail.
- Current filters update immediately on every mobile selection, and the open filter
  area competes with the result collection.
- The current guide disclosure combines list description, filter help, update time,
  and an optional Basic rating-weight chart.

These observations identify migration work. They do not approve the current layout,
density, card interaction, or content order.

## Approved Page Hierarchy

The mobile-first semantic order is:

1. page title;
2. always-visible `Basic / Recital` mode selection;
3. one `S / Full Combo / Pianist` goal selector;
4. the selected list's concise Tier-list explanation;
5. optional calculation-guide disclosure;
6. current band navigation and goal-specific personal progress;
7. difficulty and official-level filters;
8. applied-condition and result summary;
9. compact/detailed view control;
10. the active band's chart collection; and
11. continuation through explicit band selection rather than one uninterrupted
    stack of every band.

Wider layouts preserve this semantic order even when band navigation and filters move
beside the result region.

**Revised 2026-08-20 (`TIER-24`).** The explanation and the guide previously sat at
positions 1 and 2, above the mode and goal controls. Both describe the _selected_ list —
the guide is titled for the goal, the explanation names the mode and goal, and the
rating-weight chart is normalised per list — so placing them first described a selection
the user had not yet made, and an expanded guide pushed the primary controls out of view.
The earlier order also contradicted this brief's own instruction to keep the guide
secondary to choosing a mode, goal, band, and chart, and the shipped product already
renders the disclosure after its controls.

## Mode, Goal, and Guide

### Mode

- Keep `Basic` and `Recital` as two always-visible mutually exclusive buttons.
- Mode is primary NOSTALGIA context, not a secondary filter hidden in a generic
  Select.
- Changing mode updates the published Tier list and mode-specific personal metrics.
- Do not add a third umbrella mode or combine Basic and Recital results.

### Goal

- Use one labelled selector for `S`, `Full Combo`, and `Pianist`.
- Do not render all six mode-goal combinations as permanent buttons.
- Changing the goal updates the active published list, band progress, achievement
  states, and result context.

### Calculation Guide

- Keep the calculation/list guide available through one descriptive disclosure near
  the page introduction.
- It may include the current list description, last update, filter interpretation,
  and the Basic rating-weight explanation when applicable.
- Keep the guide secondary to choosing a mode, goal, band, and chart. It is placed after
  the mode and goal controls (`TIER-24`).
- Do not repeat the list explanation inside the guide; it already sits directly above the
  disclosure trigger.
- Do not repeat the full guide inside every band.

## Personal Metric Context

- When signed in, show the selected mode's official aggregate NOSTALGIA Grd as
  supporting planning context.
- Show the total NosLog rating only where the current policy defines it.
- Each published list defines its own NosLog rating, normalising the same maximum over
  its own top-`70` tier constants (`TIER-25`, 2026-08-20). Because a chart's constant
  differs between lists, the same chart contributes a different amount in each list.
- Per-chart NosLog contribution is therefore shown wherever a contribution exists, not in
  one mode-goal combination only. The single-list gate in the current implementation is
  scaffolding, not policy.
- Do not show an unavailable-rating explanation on every card or in every other
  mode-goal combination; omit the inapplicable metric.
- Do not expose internal `top 70 included/excluded`, cutline, or calculation-debug
  labels as persistent card badges.
- An explanation of the top-70 policy belongs in the calculation guide, not in the
  scanning surface.

## Tier-Band Navigation

### Meaning

- A band is the published ordered Tier value such as `13.5`, `13.0`, or `12.5`.
- Preserve administrator-defined band order and exact decimal labels.
- Progress always uses the current mode, goal, and committed filters.

### Mobile

- Show one active band collection at a time.
- Provide a compact band control containing the current value and, when signed in,
  achieved count such as `6 / 21`.
- Opening the control exposes the available ordered bands and their relevant counts
  in a mobile-appropriate selection surface.
- Selecting a band replaces the result collection without resetting mode, goal,
  filters, view preference, or page context.

### Desktop

- Use the additional width to keep the ordered band navigator visible beside the
  active result collection.
- The visible navigator and active band must have the same semantics and data as the
  mobile selector.
- Do not merely enlarge the mobile single-column stack or render every band as one
  continuous desktop document.

## Filters and Result Summary

### Filter Scope

Use only these collection filters:

- chart difficulty: `Normal`, `Hard`, `Expert`, `Real`;
- official chart level: regular `1–12` and `Real 1–3`.

Do not add personal clear-state, JUST-rate, tenuto, glissando, trill, or MISS-count
filters to this page. The selected achievement goal already provides the meaningful
personal completion context.

### Mobile Commit Model

- Open filters in a dedicated constrained surface rather than expanding permanent
  button rows through the result flow.
- Let users adjust multiple temporary difficulty and level values.
- Commit them with one result-labelled action such as **View N results**.
- Closing without committing leaves the visible results and committed conditions
  unchanged.

### Desktop Commit Model

- Keep filters visible with enough space for the collection and update results
  immediately when a value changes.
- Do not add a redundant desktop Apply step when the results and filters remain
  visible together.

### Summary

- Place committed conditions and result count adjacent to the result region.
- Use removable applied-condition tokens where they reduce the effort of undoing a
  filter.
- Keep the summary concise; do not repeat the page title, complete filter form, or
  explanatory prose.

## Chart Result Views

### Default Compact View

- Compact view is the default scanning mode.
- At the representative `390px` canvas, use three columns by default.
- Offer an optional four-column compact density where the minimum target and readable
  score remain intact.
- Each compact entry contains:
    - a small square `1:1` jacket;
    - an actual achieved `S`, `Full Combo`, or `Pianist` status icon when available;
    - the user's best score below the jacket, or a concise localized unplayed value.
- Do not repeat title, difficulty, Grd, or rating contribution in
  the visual compact card.
- The accessible link name still includes Music title, difficulty, official level,
  personal result when present, and destination purpose.

### Detailed View

- Use one `Detailed view` checkbox or equivalent binary control; do not present two
  competing permanent tabs.
- At the representative `390px` canvas, use two columns.
- Keep the jacket exactly `1:1` and allow the information region below it to grow for
  real content.
- Place the personal best score in a restrained translucent dark overlay at the
  bottom of the jacket.
- Keep an achieved-state icon on the jacket and support it with a border/ring when
  useful, but never communicate state by color alone.
- Under the jacket show, in order:
    1. original Music title;
    2. selected chart difficulty and official level;
    3. that chart's selected-mode official Grd contribution when available; and
    4. NosLog rating contribution only for the eligible `Basic · Pianist` context.
- Do not show internal top-70 inclusion state, cutline debugging, projected score
  gains, full judgement diagnostics, or note-type success rates in the card.

### Achievement State

- Show only verified outcomes: `S`, `Full Combo`, and `Pianist`.
- Do not invent a `challenging`, `in progress`, or equivalent state from an
  undeliberate score threshold.
- Distinguish signed-out, unplayed, played-without-goal, and achieved semantics in
  data and accessible text, but avoid turning every semantic into a persistent badge.
- Status borders and icons must not reduce the jacket's recognition or create a
  misleading quality ranking.

## Card Navigation and Restoration

- The entire chart card is one semantic link to
  `/[locale]/music/[index]/[difficulty]` with the Tier source context, selected mode,
  and selected goal.
- A Tier-list card opens the exact Music difficulty with **Tier & Evaluation** selected
  so the official placement, matching community scope, and eligible contribution
  action are available without making the user rediscover the goal context.
- Signed-in and signed-out users use the same direct-navigation model.
- Do not open an intermediate record expansion, popover, drawer, or modal before
  Music detail.
- Pointer hover and keyboard focus may provide click-affordance feedback only; no
  essential information may exist exclusively on hover.
- Touch receives the stable card and direct destination without a first-tap preview.
- Browser Back must restore the previous mode, goal, committed filters, active band,
  compact/detailed preference, compact density, and practical scroll position.
- The restored page must not unexpectedly return to the first band or refetch already
  valid results in a way that destroys context.

## Relationship to Goal-Specific Community Voting

- The public Tier-list page remains the administrator-owned official planning surface.
  Community vote medians never replace band values, reorder cards, or mutate a
  published list automatically.
- The six public list contexts map one-to-one to the six vote scopes:
  `Basic/Recital × S/Full Combo/Pianist`.
- Do not add inline voting controls, vote distributions, disagreement badges, or an
  intermediate vote modal to the Tier card collection. Those additions would compete
  with the approved scanning task and have not been approved as Tier-card content.
- The exact selected chart's **Tier & Evaluation** area owns reading, creating,
  editing, and deleting a vote. Its eligibility, median, distribution, count,
  administrator review, and data-separation rules are defined by
  [the Music-detail brief](./05-music-detail-page-brief.md).
- Preserve the selected mode and goal in source/restoration state. A user who returns
  after reading or voting must recover the same mode, goal, band, committed filters,
  view preference, density, and practical scroll position.
- Submitting or editing a vote invalidates the exact community aggregate and derived
  administrator candidate. It must not invalidate or rewrite the published Tier list
  unless an administrator later completes the normal placement workflow.

## Responsive Contract

### Representative and Minimum Widths

- `390px` is a representative mobile design and review canvas because it corresponds
  to several common phone viewport dimensions. It is not a universal standard,
  breakpoint, fixed shell, or minimum supported width.
- The page must preserve information and functionality and reflow without
  two-dimensional scrolling at `320 CSS px`, except for content whose meaning truly
  requires two dimensions.
- Validate intermediate compact widths; a successful `390px` specimen does not prove
  the entire compact range.

### Content-Driven Adaptation

- Choose layout transitions where controls, translated labels, card targets, or card
  content no longer fit their approved hierarchy.
- Use container constraints for result-card columns where practical rather than
  deriving all behavior from a device-name breakpoint.
- Mobile normative examples are compact three columns, optional four-column compact
  density, and two-column detailed view at `390px`.
- Desktop column count is not one fixed product number. Add columns only while the
  approved minimum readable card width, title behavior, targets, and comparison
  hierarchy remain intact.
- On desktop, use width for simultaneous band navigation, visible filters, and a
  denser comparison collection, not for stretching a `390px` page.

## Loading, Empty, Error, and Authentication States

- **No published list:** Keep the page context and selected mode/goal controls, then
  show one concise page-level absence state.
- **No matching charts:** Keep committed filters visible and provide one concise
  result-level empty state with a direct clear-filter recovery.
- **Initial result loading:** Keep page identity and controls stable; mark the result
  region busy and use geometry-preserving placeholders where helpful.
- **Replacement loading:** Keep the current result geometry stable but prevent stale
  cards from navigating as though they matched newly committed conditions.
- **Band request failure:** Contain the error to the result region and provide one
  retry action without resetting planning state.
- **Signed out:** Show the complete public Tier collection without fake scores,
  progress, Grd, or achievement states. Authentication is not required to open a
  chart.
- **Signed in but unplayed:** Present a truthful concise unplayed value rather than a
  fabricated zero score or `challenging` state.
- **Unavailable optional metric:** Omit the field; do not render repetitive `not
available` copy across cards.

Exact localized empty and error copy may be refined with the shared content system,
but it must remain concise and preserve these distinct meanings.

## Accessibility

- Use semantic buttons for Basic/Recital and view/density controls, a labelled Select
  for goal, semantic filter controls, and one semantic link per chart card.
- Expose selected and expanded state with native semantics or correct ARIA.
- Maintain a logical source and keyboard order that follows the approved mobile
  hierarchy even when desktop regions sit side by side.
- Provide visible focus indicators on every action.
- Ensure all compact targets meet the approved target-size standard even when four
  columns are selected.
- Do not depend on jacket art, color, border, or an external rank image alone to name
  a chart or achievement.
- Announce committed result-count changes without moving focus unnecessarily.
- When a mobile filter surface opens, manage initial focus, focus containment, Escape
  or close behavior, and return focus to its trigger.
- Preserve WCAG Reflow behavior at `320 CSS px` and with browser text enlargement.

## Localization and Content

- Support Korean, Japanese, and English labels without relying on equal string
  lengths.
- Preserve original Music titles in both compact and detailed views. Approved
  translations/readings remain searchable and are disclosed only on Music Detail.
- Compact view may omit visible titles for density, but the accessible name must not.
- Do not force long titles or readings into a fixed-height jacket or distort the
  square image.
- Keep domain labels `Basic`, `Recital`, `S`, `Full Combo`, `Pianist`, `Grd`, and
  `NosLog` stable where translation would weaken implementation or game mapping.
- Format scores, counts, and decimals using locale-aware separators while preserving
  exact Tier values.

## Implementation Mapping

This mapping guides the future implementation session; it does not authorize code
changes in the current design-guide session.

- Reuse the current `/[locale]/tiers` route and mode/goal/difficulty/level validation.
- Extend navigation state to restore active band and view preferences without
  invalidating shareable committed conditions.
- Refactor `TierControls` so mobile filters stage values before Apply while desktop
  filters update immediately.
- Refactor `TierBandBrowser` from a mandatory stacked-all-bands document into one
  active-band collection plus mobile selector or desktop rail.
- Refactor `TierChartCard` so authenticated cards are links like public cards rather
  than inline record-expansion buttons.
- Encode the selected Tier mode, goal, active band, and return context when linking to
  Music detail; open the destination's Tier & Evaluation area rather than its generic
  default panel.
- Retire `TierRecordDetail` from the Tier scanning surface; retain useful record data
  for Music detail or other approved destinations.
- Add the selected-mode per-chart official Grd contribution and eligible Basic
  Pianist NosLog contribution to the detailed payload.
- Reuse existing published-band caching and local retry boundaries where they still
  satisfy the new state contract.
- Keep the scoped vote entity independent from `TierList` and `TierBandEntry`. The
  official collection reads only administrator-published placement data; community
  aggregate and review-candidate invalidation follow the Music-detail contract.
- Do not source achievement icons from unstable external URLs without an approved
  asset and licensing strategy.

## Representative Fixtures

Validation must include:

- Basic S, Basic Full Combo, Basic Pianist, Recital S, Recital Full Combo, and
  Recital Pianist;
- a band with fewer than one row, a typical band, and a dense band;
- signed out, signed in with mixed achievements, and signed in with no plays;
- Normal, Hard, Expert, and Real, including Real 1–3;
- no filters, one filter, and combined difficulty/level filters;
- a long original Japanese title and Music entries found through Korean/English
  translated-title or Japanese-reading aliases while still showing the original;
- compact three-column, compact four-column, and detailed two-column mobile states;
- no published list, no filtered matches, loading, replacement loading, request
  failure, and successful retry;
- direct navigation to Music detail and Back restoration from a card near the end of
  a non-default band; and
- eligible and ineligible card origins for all six mode-goal contexts, verifying that
  Music detail restores the exact vote scope without exposing an inline Tier-card vote.

## Browser Acceptance Contract

- At `320 CSS px`, all controls and cards remain operable with no unintended
  horizontal page scroll or loss of information/functionality.
- At the representative `390px` canvas, compact three-column, optional four-column,
  and detailed two-column layouts preserve square jackets and readable scores.
- At suitable tablet and desktop widths, band navigation and filters use additional
  space without changing their meaning or source order.
- Basic/Recital, goal, band, filters, view mode, and compact density are keyboard
  operable and expose their state.
- Mobile temporary filter changes do not alter results until committed; desktop
  visible filters update immediately.
- Logged-out cards navigate directly without personal placeholders; logged-in cards
  use the same destination and add only truthful personal information.
- No essential content is hover-only, and touch requires only one activation to open
  the exact Music difficulty.
- Back restores the full planning context and practical scroll position.
- Music detail receives the exact mode and goal, opens Tier & Evaluation, enforces the
  scoped vote contract, and returns to the unchanged official Tier-list context.
- Long Korean, Japanese, and English content does not overlap, clip controls, distort
  jackets, or create a fixed-height failure.
- Loading, empty, error, retry, and no-published-list states stay within the correct
  region and do not reset selected conditions.

## Reference Matrix

The decision set uses a broad comparison instead of treating one product or framework
as a template.

| Source                                                                                                                     | Transferable finding                                                                                   | NosLog application                                                     | Limitation                                                       |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Current Tier route](<../../app/(nevigation)/tiers/page.tsx>)                                                              | One public route already composes mode, goal, guide, filters, and published bands.                     | Preserve verified capability while replacing the long compact shell.   | Current presentation is not the visual authority.                |
| [Current Tier controls](../../components/tiers/tierControls.tsx)                                                           | Query-backed mode, goal, difficulty, and level state already exists.                                   | Reuse validation and committed URL meaning.                            | Current mobile filters apply every click and are too persistent. |
| [Current band browser](../../components/tiers/tierBandBrowser.tsx)                                                         | Band boundaries, progressive requests, local retry, and goal achievement are implemented.              | Preserve data boundaries while changing navigation.                    | Stacked bands and inline record expansion are rejected for 2.0.  |
| [Approved IA](./02-information-architecture.md)                                                                            | Tier planning is independent and directly leads to exact Music detail.                                 | Keeps the page task and direct destination stable.                     | It does not define card geometry.                                |
| [Approved Music-detail brief](./05-music-detail-page-brief.md)                                                             | Music plus selected difficulty is the stable detailed destination.                                     | Every Tier card can be one exact direct link.                          | Detail-page panels do not dictate Tier scanning density.         |
| [Current goal predicate](../../lib/tiers.ts)                                                                               | S, Full Combo, and Pianist achievement conditions already have explicit domain logic.                  | Keeps progress and downstream vote eligibility semantically aligned.   | Recital requires additional participation proof.                 |
| [NOSTALGIA official mode guidance](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                         | Basic and Recital are distinct play modes.                                                             | Retain them as primary context.                                        | It does not define a community Tier interface.                   |
| [ArcadeStat tier example](https://arcadestat.app/en/pump/tier/s22)                                                         | A rhythm-game tier product may require exact-chart achievement before voting.                          | Supports moving a qualified vote into exact chart context.             | Its public layout and automatic aggregate are not adopted.       |
| [NIST: Measures of location](https://itl.nist.gov/div898/handbook/eda/section3/eda351.htm)                                 | Median is less sensitive than mean to extreme tails.                                                   | Supports the downstream public median without changing official bands. | It does not define Tier-list card content.                       |
| [Google SRE: On-call](https://sre.google/workbook/on-call/)                                                                | Human review signals should be actionable and high-signal.                                             | Supports keeping disagreement in an administrator queue, not cards.    | Reliability alerts are more urgent than editorial tier review.   |
| [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)                                  | Several common iPhones are 390pt wide, while many other widths coexist.                                | Supports 390 as a representative canvas only.                          | Native points are not a universal web breakpoint.                |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | Content should preserve information and function at 320 CSS px except genuine two-dimensional content. | Establishes the compact minimum validation boundary.                   | It does not prescribe card columns or art direction.             |
| [web.dev: Responsive design basics](https://web.dev/articles/responsive-web-design-basics)                                 | Start small and add breakpoints when content needs them, not for named devices.                        | Makes Tier transitions content-driven.                                 | Exact NosLog thresholds still require specimens.                 |
| [MDN: Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | Fluid layout and relative breakpoints serve the full device range.                                     | Rejects a fixed 390px application shell.                               | General web guidance does not set Tier density.                  |
| [Android: Window size classes](https://developer.android.com/develop/ui/views/layout/use-window-size-classes)              | Phone portrait is a broad compact range below 600dp.                                                   | Confirms that one phone width cannot represent the full compact class. | Native dp classes are supporting web evidence only.              |
| [Microsoft Fluent: Layout](https://fluent2.microsoft.design/layout)                                                        | Small is a 320–479 range and responsive layouts reflow, resize, and re-architect.                      | Supports mobile selector/desktop rail behavior with equal information. | Fluent visual tokens are not NosLog tokens.                      |
| [GitHub Primer: Layout](https://primer.style/product/getting-started/foundations/layout/)                                  | Narrow layouts simplify multi-column regions and may turn side panes into sheets.                      | Supports compact band/filter triggers and wider visible rails.         | GitHub task density differs from a rhythm-game planner.          |
| [IBM Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)                                           | A fluid grid begins at a 320px small boundary and adds columns at larger boundaries.                   | Supports validated minimum card width and added desktop columns.       | Carbon's exact grid and spacing are not adopted.                 |
| [Atlassian Grid](https://design-system-docs-proxy.services.atlassian.com/foundations/grid-beta)                            | The smallest grid covers 320–479px and changes columns, gutters, and margins by range.                 | Confirms range-based, not 390-only, validation.                        | Enterprise grid counts do not determine Tier cards.              |
| [USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)                                               | A mobile-first flexible grid names 320px and 480px tokens while allowing configuration.                | Supports fluid outer layout and explicit compact testing.              | Government content patterns are not rhythm-game card patterns.   |
| [Tailwind: Responsive design](https://tailwindcss.com/docs/responsive-design)                                              | Base styles are mobile-first; breakpoints and container queries can be customized.                     | Fits NosLog's stack and content/container-driven cards.                | Default 640px is not automatically a NosLog breakpoint.          |
| [Bootstrap: Breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/)                                            | The mobile base is below 576px and provided ranges are foundations, not every device.                  | Reinforces that 390 is not a universal breakpoint.                     | NosLog does not use Bootstrap.                                   |
| [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/)                                                      | Start with small screens and do not assume specific devices.                                           | Supports one semantic hierarchy across widths.                         | Service forms are less image-dense than Tier results.            |
| [React Spectrum: Layout](https://react-spectrum.adobe.com/v3/layout.html)                                                  | A smallest `base` value precedes customizable mobile-first breakpoints.                                | Supports base-first behavior without a magic mobile width.             | Spectrum components and visual language are not adopted.         |
| [W3C WCAG: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)          | Hover/focus content cannot become inaccessible or pointer-only.                                        | Keeps Tier-card essentials permanently available and touch direct.     | It does not prohibit all decorative hover feedback.              |
| [Material Design: Cards](https://m3.material.io/components/cards/overview)                                                 | One card can group a related object and clear destination.                                             | Supports a single whole-card Music-detail link.                        | Material styling and elevation are not NosLog direction.         |
| [Fluent 2: Card usage](https://fluent2.microsoft.design/components/web/react/core/card/usage)                              | Card hierarchy and interaction need to remain predictable across input methods.                        | Supports identical signed-in/signed-out card navigation.               | Fluent card anatomy is not copied.                               |
| [osu! beatmap listing](https://osu.ppy.sh/beatmapsets)                                                                     | Rhythm-game discovery keeps chart identity, difficulty context, filters, and direct detail navigation. | Confirms domain value of quick chart-to-detail planning.               | osu! grouping and scoring do not map one-to-one to NOSTALGIA.    |

### Evidence Convergence

- Authoritative responsive guidance converges on fluid, range-based, content-driven
  adaptation rather than one standard mobile width.
- `390px` is credible as a representative phone canvas because of common current
  devices, but `320 CSS px` is the stronger minimum Reflow requirement.
- General card and rhythm-game references converge on stable identity and one clear
  destination; they do not support a mandatory intermediate modal for Tier results.
- Responsive systems converge on moving auxiliary selection into compact disclosure
  at narrow widths and exposing it beside content when width permits.
- No source establishes NosLog's exact mode/goal semantics, achievement thresholds,
  rating policy, or card information. Those come from verified NOSTALGIA data,
  current NosLog logic, and explicit user decisions.
- Voting evidence converges on qualification, scoped context, robust aggregation, and
  human review; it does not justify replacing the official planning collection or
  adding more persistent card controls.

## Rejected and Superseded Alternatives

- **Treat 390px as a standard or fixed shell — Rejected:** it is a representative
  canvas only; 320px Reflow and intermediate validation remain required.
- **Put Basic and Recital inside the same Select as goals — Rejected:** it hides the
  primary NOSTALGIA mode context.
- **Show six permanent mode-goal buttons — Rejected:** it creates unnecessary visual
  control density.
- **Stack every band as one long document — Superseded:** mobile selects one band and
  desktop exposes an adjacent navigator.
- **Apply every mobile filter toggle immediately — Superseded:** mobile stages and
  explicitly commits; desktop remains immediate.
- **Use personal clear state, JUST, note-type rates, or MISS as Tier filters —
  Rejected:** they do not serve the approved Tier planning question.
- **Keep only one dense card format — Rejected:** compact scanning and detailed
  comparison are separate user needs.
- **Use two columns for every mobile card — Rejected for compact view:** detailed uses
  two; compact uses three by default and optionally four at the representative width.
- **Show `challenging` or infer `in progress` — Rejected:** no approved domain rule
  defines that state.
- **Show top-70 included/excluded on cards — Rejected:** this exposes calculation
  mechanics as persistent noise.
- **Expand record analytics inside the Tier grid — Superseded:** the card goes directly
  to exact Music detail.
- **Open a modal before Music detail — Rejected:** it adds a step and duplicates the
  destination's information.
- **Put essential data only on hover — Rejected:** touch and keyboard must receive the
  same task-critical content.
- **Fix one desktop column count — Rejected:** card minimum width and container space
  govern desktop density.
- **Vote directly inside each Tier card — Rejected:** it overloads the scanning
  collection and bypasses the exact Music-detail evaluation context.
- **Reorder official bands from community medians — Rejected:** votes remain advisory
  and require explicit administrator review and normal placement history.

## Decision Log

| ID      | Decision                                                                                     | Status       |
| ------- | -------------------------------------------------------------------------------------------- | ------------ |
| TIER-01 | Tier lists remain an independent play-planning page family                                   | `Approved`   |
| TIER-02 | Basic/Recital stay as always-visible primary mode buttons                                    | `Approved`   |
| TIER-03 | S/Full Combo/Pianist use one goal selector                                                   | `Approved`   |
| TIER-04 | Keep one secondary calculation-guide disclosure                                              | `Approved`   |
| TIER-05 | Mobile selects one band; desktop uses an adjacent visible navigator                          | `Approved`   |
| TIER-06 | Progress uses current mode, goal, committed filters, and authenticated records               | `Approved`   |
| TIER-07 | Filters are difficulty and official level only                                               | `Approved`   |
| TIER-08 | Mobile stages filters and commits with a result action; desktop applies immediately          | `Approved`   |
| TIER-09 | Compact is default, with three columns and optional four-column density at 390px             | `Approved`   |
| TIER-10 | Detailed view uses two columns at 390px and the approved identity/metric order               | `Approved`   |
| TIER-11 | Show actual S/FC/Pianist only; no inferred challenge state                                   | `Approved`   |
| TIER-12 | Official per-chart Grd is detailed context; NosLog contribution is Basic Pianist only        | `Superseded` |
| TIER-24 | Explanation and calculation guide follow the mode and goal controls                          | `Approved`   |
| TIER-25 | Every published list defines its own NosLog rating; contribution is shown wherever it exists | `Approved`   |
| TIER-13 | Do not expose top-70 inclusion or calculation-debug badges                                   | `Rejected`   |
| TIER-14 | The whole card directly opens exact Music detail for every authentication state              | `Approved`   |
| TIER-15 | Browser Back restores planning controls, band, view, density, and scroll context             | `Approved`   |
| TIER-16 | No essential hover-only content or mobile first-tap preview                                  | `Approved`   |
| TIER-17 | 390px is a representative canvas, not a standard, breakpoint, or fixed width                 | `Approved`   |
| TIER-18 | Require 320 CSS px Reflow and content-driven transitions                                     | `Approved`   |
| TIER-19 | Desktop card columns are container-driven rather than one fixed count                        | `Approved`   |
| TIER-20 | Tier mode and goal map one-to-one to six independent community-vote scopes                   | `Approved`   |
| TIER-21 | Cards open exact Music-detail Tier & Evaluation with source mode and goal preserved          | `Approved`   |
| TIER-22 | Keep voting and distributions out of Tier cards; exact Music detail owns contribution        | `Approved`   |
| TIER-23 | Community medians never replace or reorder official published Tier content automatically     | `Approved`   |

## Handoff Boundary

The active high-fidelity design stage may decide final typography, color, spacing, surface hierarchy,
iconography, jacket-overlay treatment, minimum card widths, and exact transition
points after the Foundation is approved. It must preserve the decisions and
acceptance contract above. A later Codex implementation session must compare the
final approved Figma output with this brief and request a guide or design revision if the output
removes a required state, changes domain meaning, introduces a mandatory modal, fixes
the product to 390px, or conflicts with the approved responsive behavior.
It must also preserve the official-versus-community boundary: no inline Tier-card
voting, no community-driven automatic reordering, and exact mode-and-goal context when
opening Tier & Evaluation.
