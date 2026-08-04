# NosLog 2.0 Foundation S1 Discovery Structural Validation

## Document Control

- Status: `Validated — compact First Review Gate complete`
- Canonical language: English
- Korean companion:
  [27-foundation-s1-discovery-structural-validation.ko.md](./27-foundation-s1-discovery-structural-validation.ko.md)
- Started: 2026-08-04
- Scope: structural validation of the approved Foundation typography, spacing,
  grid, container, density, and target contracts on representative specimen `S1`
- Approval boundary: this document does not approve color, material, final component
  layout, chart-result styling, maximum line counts beyond the approved discovery
  brief, truncation changes, or application implementation

## Related Authority

- [Shared discovery page brief](./04-shared-discovery-page-brief.md)
- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)

The approved discovery brief owns product behavior and content order. Documents `25`
and `26` own the semantic typography and layout contracts. This validation may reveal
a conflict, but it may not silently change those authorities. Any material conflict
returns to the user as an explicit revision decision.

## Validation Purpose

`S1` must prove that the approved structural Foundation can support the real NosLog
discovery task before appearance and material decisions are layered on top. It must
answer the following questions with measured evidence:

1. Can scope-aware search, committed state, results, and progressive loading form one
   clear vertical task flow at `320 CSS px` and representative `390px`?
2. Can long Korean, Japanese, English, and mixed-script Music identity remain legible
   without horizontal overflow or a new sub-`12px` type exception?
3. Can the approved `32/40/48px` visible-control vocabulary and effective-target
   contract support the dense discovery controls without overlapping targets?
4. Do the `672px` and `1056px` page-grid transitions remain stable immediately before
   and after each threshold?
5. Where do discovery components themselves fail and need a container-query reflow
   independent of the shared page-grid transitions?
6. Can list, grid, Chart grouping, loading, empty, error, disabled, and progressive
   loading states preserve the same hierarchy and focus model?

## Non-goals

- This is not a final page design or a production-ready Figma screen.
- It does not reproduce or approve the current NosLog surface styling.
- It does not select Foundation color, border, radius, elevation, icon, or motion
  values.
- It does not add, remove, regroup, or rename approved discovery features.
- It does not implement the NosLog 2.0 application.
- It does not use the legacy NOSTORY Figma as layout authority.

## Observed Baseline

### Repository and browser evidence

| ID          | Observation                                                                                                                                                                                                    | Status     |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S1-OBS-01` | The current `/[locale]/music` route provides Music-only search, filtering, sorting, list/grid switching, and automatic sentinel loading. It does not yet provide the approved shared Music/Chart scope model.  | `Observed` |
| `S1-OBS-02` | The current wide browser composition remains visually constrained to a narrow mobile-like column instead of using desktop space for visible filters and result comparison.                                     | `Observed` |
| `S1-OBS-03` | Current list cards use a `56px` jacket and compact trailing difficulty values, but title and artist content commonly truncate early in the narrow implementation.                                              | `Observed` |
| `S1-OBS-04` | Current sort and view controls include visible heights near `24px`, below the approved shared `32/40/48px` visible-control vocabulary.                                                                         | `Observed` |
| `S1-OBS-05` | The app currently ships `PretendardVariable.woff2`, not a validated Pretendard JP production delivery. Pretendard JP delivery, fallback metrics, and mixed-script loading therefore remain validation work.    | `Observed` |
| `S1-OBS-06` | The current implementation still includes hidden default difficulty constraints, weakness sorting, immediate route replacement filters, and automatic infinite loading that the approved 2.0 brief supersedes. | `Observed` |

These observations are migration evidence only. They are not visual or behavioral
requirements for the specimen.

### Measured compact current-product baseline

The signed-in `/ko/music` route was measured in the test browser on 2026-08-04. The
sample covers the first six rendered results and records visual clipping from the
current implementation, not an accessibility-name failure.

| Viewport | View | Measured card      | Titles visually clipped | Jacket ratio | Page horizontal overflow               | Interpretation                                                                                        |
| -------- | ---- | ------------------ | ----------------------- | ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `390px`  | List | `343 × 64px`       | `5 / 6`                 | not measured | none (`375px` client and scroll width) | Current fixed compact rows preserve width but routinely truncate titles.                              |
| `320px`  | List | `273 × 64px`       | `6 / 6`                 | not measured | none (`305px` client and scroll width) | The narrow baseline increases identity loss without creating two-dimensional overflow.                |
| `390px`  | Grid | `167.5 × 260.75px` | `5 / 6`                 | `1:1`        | none                                   | Confirms the audited approximately `168px` mobile Grid card and square jacket.                        |
| `320px`  | Grid | `132.5 × 225.75px` | `5 / 6`                 | `1:1`        | none                                   | Two columns still reflow, but the current fixed information treatment is too terse for long identity. |

The current route therefore proves that two compact Grid columns and square jackets
are mechanically possible down to `320px`; it does not prove that the current fixed
card height or truncation is acceptable for 2.0.

### S1 compact geometry under the approved Foundation

The approved `16px` compact page margin and `12px` Grid gutter yield the following
nominal specimen geometry before the card border is deducted:

| Viewport | Result width | List structure                                                                | Grid structure | Nominal Grid card |
| -------- | ------------ | ----------------------------------------------------------------------------- | -------------- | ----------------- |
| `320px`  | `288px`      | one column; `64px` square jacket + fluid identity + `104px` difficulty region | two columns    | `138px`           |
| `390px`  | `358px`      | one column; `64px` square jacket + fluid identity + `104px` difficulty region | two columns    | `173px`           |

The List identity region is approximately `120px` at `320px` and `190px` at `390px`
before borders. The approved one-line identity limits and `12px` horizontal content
inset must absorb that pressure without compressing type or hiding the difficulty
group. The Grid card gains approximately `5.5px` over the measured current
card.

### Approved Grid capacity rule

The approved discovery brief identifies approximately `168px` as the audited ordinary
mobile Grid card, requires two columns at `390px`, and intends three to five columns at
wider result regions. Foundation compact geometry independently requires two columns
at `320px`. The user approved the following result-container capacity rule on
2026-08-04:

| Result-region capacity | Columns     | Resulting rule                                                                                           |
| ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------- |
| `288–535px`            | `2`         | Permit the compact `138px` floor at the `320px` contract; cards grow fluidly to the preferred range.     |
| `536–719px`            | `3`         | `3 × 168px + 2 × 16px`; do not add the column before every card can retain the audited ordinary width.   |
| `720–903px`            | `4`         | `4 × 168px + 3 × 16px`.                                                                                  |
| `904px` and wider      | `5` maximum | `5 × 168px + 4 × 16px`; keep the approved five-column ceiling rather than adding denser artwork columns. |

This rule uses result-container capacity, not device names or the shared
`672/1056px` page-grid transitions. The `138px` value is an emergency compact floor
needed to preserve the approved two-column composition at `320px`; new ordinary
columns are not added until every card can retain the `168px` preferred width. At
At `200%` text resize, the validated specimen changes Grid to one column. Direct
browser testing across both compact widths and all three UI locales confirmed that
this reflow preserves the approved identity hierarchy without horizontal overflow.

### Approved filter-rail activation and wide composition

The user approved a second, component-owned transition on 2026-08-04:

- Below a `1216px` page-layout query-container width, retain the one labelled
  **Filter and sort** trigger and the approved staged temporary layer. This is a
  constrained composition, not a device-labelled mobile-only product model.
- At `1216px` and wider, keep the scope-aware search across the full content width.
  Below it, use three of twelve logical tracks for the visible filter rail, one
  `16px` inter-region gutter, and the remaining nine tracks for results.
- At the activation threshold this yields an approximately `292px` filter rail and
  `908px` result region. The result region can therefore retain the approved five
  `168px` Grid cards plus four `16px` gaps instead of losing a column when the rail
  appears.
- Keep Sort as one separately labelled selector in the result toolbar rather than a
  persistent row of sort buttons. Keep the result summary, applied-filter removal,
  and List/Grid view control adjacent to the collection.
- Visible discrete filters apply immediately. Continuous ranges debounce or require
  an explicit value commit according to their control behavior. The signed-in
  personal-record group remains secondary and collapsed by default.

The `1216px` activation deliberately does not copy the shared `1056px` twelve-track
page transition. Activating the rail at `1056px` would leave approximately `788px`
for results and can make a full-width five-column collection regress to four columns
as the viewport grows. Component capacity, rather than a desktop device name, owns
this transition.

Reference convergence supports the structure, not the NosLog surface styling:
[Shopify storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/storefront-filtering-ux),
[VA Search Filter](https://design.va.gov/components/search-filter),
[Scottish Government Search Filters](https://designsystem.gov.scot/patterns/search-results/search-filters),
[SAP Fiori Filter Bar](https://www.sap.com/design-system/fiori-design-web/ui-elements/filter-bar/),
[Dell Filter](https://delldesignsystem.com/patterns/filter), and
[Baymard filter research](https://baymard.com/learn/ecommerce-filter-ui) converge on
visible filtering when width genuinely supports it, temporary layers on constrained
layouts, and visible applied state. [Apple Collections](https://developer.apple.com/design/human-interface-guidelines/collections),
[Adobe Spectrum Cards](https://spectrum.adobe.com/page/cards/),
[USWDS Card](https://designsystem.digital.gov/components/card/),
[Carbon 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/),
[CSS Grid](https://www.w3.org/TR/css-grid/), and
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
support collection- or container-owned capacity changes. [Steam Discovery](https://store.steampowered.com/about/newstore?l=english),
[osu! search taxonomy](https://osu.ppy.sh/wiki/en/Beatmap/Genre_and_language),
[BeatSaver](https://www.beatsaver.com/), and [Taiko.wiki](https://taiko.wiki/song?lang=en)
confirm the domain need for difficulty-rich refinement but are not visual or
interaction authorities; their denser control treatments are not copied.

### Catalog pressure evidence

The approved discovery audit found that long identity content is ordinary rather than
exceptional in the imported catalog:

- original title: median `11`, 90th percentile `25`, maximum `54` characters;
- artist credit: median `10`, 90th percentile `34`, maximum `67` characters;
- `178` titles contain at least `15` characters;
- `218` artist credits contain at least `15` characters.

The specimen must therefore include ordinary, long, and maximum-pressure identity
fixtures instead of validating only short Latin titles.

## Approved Contracts Under Test

### Structure and behavior

- one shared discovery surface with Music and published-Chart scopes;
- a compact leading scope selector with visible text in its expanded state;
- IME-safe result updates after `300ms` without a second required search action;
- mobile combined Filter/Sort layer with temporary state and one **View results**
  commit action;
- desktop visible Filter and Sort controls with results remaining visible;
- committed result summary, removable applied conditions, and explicit reset;
- Music list default plus jacket-led grid; one grouped-list representation for Chart
  scope;
- show only the original title and artist in repeated List and Grid identity, keep
  each to one visible line with ellipsis while preserving complete accessible values,
  and keep the List jacket square at the approved `64 × 64px` row edge;
- keep Music difficulty values in the fixed `Normal → Hard → Expert → Real` slot
  order, omit the repeated visible `N/H/E/R` labels from each result, preserve an
  unavailable Real slot as `–`, and expose the full names and values through the
  accessible name;
- explicit batches of `20` results with no viewport-triggered infinite loading;
- approved loading, empty, error, retry, disabled, permission, and completion states.

### Typography

| Semantic role    | Approved composite                            | S1 use                                                          |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------- |
| `page-title`     | `24/32 · 700`, or governed wide `32/40 · 700` | Discovery page identity                                         |
| `entity-title`   | `16/24 · 600`                                 | Original Music title in repeated results                        |
| `body`           | `16/24 · 400`                                 | Complete visible system message when body treatment is required |
| `body-secondary` | `14/20 · 400`                                 | Artist and concise result context                               |
| `control-label`  | approved role map composite                   | Scope, filters, sort, view, and loading actions                 |
| `metadata`       | `12/16 · 400`                                 | Truly tertiary short facts only                                 |
| `metric-value`   | `14/20 · 500`, tabular figures                | Result count, levels, and comparable compact values             |

No shared user-facing text may be introduced below `12px`. Every role remains fixed
across widths except the governed wide `page-title` substitution.

### Layout and targets

- compact: `16px` safe-aware page margins, four logical tracks, `12px` gutters;
- intermediate: eight logical tracks from a `672 CSS px` page-layout query container;
- wide: twelve logical tracks from a `1056 CSS px` page-layout query container;
- `standard` content maximum: `1280px`;
- visible controls: `32px` Compact, `40px` Standard, `48px` Comfortable;
- ordinary public effective targets: at least `44 × 44px`;
- component reflows occur at measured component-container failure points, not
  automatically at `672px` or `1056px`.

## Fixture Matrix

### Identity fixtures

| Fixture | Purpose                     | Representative source content                                         |
| ------- | --------------------------- | --------------------------------------------------------------------- |
| `ID-01` | Short mixed-script baseline | `Altale` / `削除`                                                     |
| `ID-02` | Long original title         | `Lachryma《Re:Queen’M》 (BEMANI SYMPHONY NOSTALGIA mix)`              |
| `ID-03` | Long Japanese/Latin title   | `50th Memorial Songs -二人の時 ～under the cherry blossoms～-`        |
| `ID-04` | Maximum-pressure artist     | `MAX MAXIMIZER VS DJ TOTTO (Arr.by BEMANI Sound Team "Akhuta Works")` |
| `ID-05` | Long mixed-script artist    | `Toby Fox (Arranged by BEMANI Sound Team "Sacha × Sota F.")`          |
| `ID-06` | Missing optional data       | no artist and no Real chart                                           |

Approved Korean/English translated-title and Japanese-reading fixtures are search-
alias inputs: the matching S1 card must still display only the original title. Any
synthetic alias used before approved data exists must be marked `Fixture only` and
must not be copied into production content.

### Result fixtures

- Music with all four difficulties;
- Music without Real;
- one and several matching published Chart targets;
- no matching published Chart target;
- signed-out public result;
- signed-in result with no play record;
- signed-in result with one matching record and several matching records;
- a last partial progressive batch smaller than `20`.

### State fixtures

- initial, active query, applied filters, and selected sort;
- initial loading before and after the visible-state threshold;
- slow replacement retaining stale results;
- text mismatch, filter mismatch, no published Charts, and empty catalog;
- initial query error, replacement error, incremental error, retry, and recovery;
- unavailable recent-play sort while Unplayed is active;
- keyboard focus preview, fine-pointer hover preview, and direct touch navigation;
- reduced motion, `200%` text resize, and safe-area insets.

## Measurement Matrix

| Group                  | Required measurements                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| Compact                | `320px`, `390px`, low-height mobile, safe-area inset variants         |
| First page transition  | `671px`, `672px`, `673px` page-layout query container                 |
| Second page transition | `1055px`, `1056px`, `1057px` page-layout query container              |
| Wide                   | `1280 × 720`, `1440 × 900`, and `standard` container ceiling behavior |
| Text                   | default, `200%` text resize, WCAG text-spacing override               |
| Input                  | touch/coarse pointer, fine pointer, hybrid input, keyboard-only       |
| Language               | Korean UI, Japanese UI, English UI, and mixed-script Music identity   |

Viewport width and page-layout query-container width must be recorded separately.
A component-container failure point must be reported with the component's available
inline size, not inferred from the browser width.

## S1 Structural Slices

The specimen is reviewed as connected slices so failures can be attributed without
turning the exercise into a final screen suite.

1. `S1-A` — page identity, scope selector, and search field;
2. `S1-B` — committed result summary, Filter/Sort entry, view switch, and applied
   conditions;
3. `S1-C` — Music list result with ordinary, long, and missing identity content;
4. `S1-D` — Music grid result with square jacket and expandable information region;
5. `S1-E` — grouped Chart result with one and several published targets;
6. `S1-F` — loading, empty, error, retry, incremental, disabled, and completion states;
7. `S1-G` — desktop visible filters beside results and component-container reflows.

## Measurement Record Template

| Field                          | Record        |
| ------------------------------ | ------------- |
| Slice and state                |               |
| Locale and fixture             |               |
| Viewport                       |               |
| Page query-container width     |               |
| Component container width      |               |
| Logical track tier             |               |
| Text resize / spacing override |               |
| Pointer / keyboard mode        |               |
| Horizontal overflow            | `Pass / Fail` |
| Text clipping or collision     | `Pass / Fail` |
| Target overlap or ambiguity    | `Pass / Fail` |
| Reading and focus order        | `Pass / Fail` |
| Stable state change            | `Pass / Fail` |
| Observed failure               |               |
| Candidate correction           |               |
| Authority affected             |               |
| User decision required         | `Yes / No`    |

## Browser Validation Record — 2026-08-05

The editable specimen
[s1-discovery-compact-structure.html](./specimens/s1-discovery-compact-structure.html)
was served from local static hosting and tested directly in the Codex browser. The
test covered every combination of:

- `320px` and `390px` specimen widths;
- Korean, Japanese, and English UI copy;
- List and Grid results;
- default and `200%` text size.

This produced `24` measured combinations. Each combination checked the specimen and
content scroll widths, escaped regions, clipped controls, non-identity text clipping,
difficulty-value overflow, square-jacket ratio, result-context reflow, Grid column
count, and the approved one-line title and artist treatment. The loaded font stack
reported `Pretendard JP Variable`, `Pretendard JP`, `Pretendard`, `system-ui`, and
`sans-serif`, with `document.fonts.status` equal to `loaded`.

### Failure found and corrected

The first run passed all default-size combinations but exposed two real defects in all
`12` combinations at `200%` text size:

1. the fixed `48px` search-scope column clipped its enlarged scope glyph; and
2. the fixed `20 × 20px` difficulty boxes could not contain the approved enlarged
   metric text and visibly collided.

The correction did not add a type size, hide content, change the approved content
order, or reopen the one-line identity decision. At `200%`, the scope column now
allocates `56px`, and each difficulty value grows to `36 × 36px`. The already approved
reflow still moves the List difficulty group to a second row and changes Grid to one
column.

### Final result

| Matrix slice | Combinations | Horizontal overflow | Clipped controls or non-identity text | Difficulty collision | Jacket ratio | Required reflow |
| ------------ | ------------ | ------------------- | ------------------------------------- | -------------------- | ------------ | --------------- |
| Default text | `12 / 12`    | Pass                | Pass                                  | Pass                 | Pass (`1:1`) | Pass            |
| `200%` text  | `12 / 12`    | Pass                | Pass                                  | Pass                 | Pass (`1:1`) | Pass            |

Long original titles and artist credits continue to use the approved visible one-line
ellipsis. That expected truncation is not counted as a structural failure because the
full identity remains an accessibility and data contract. No approved hierarchy or
line limit failed in this compact multilingual matrix.

## First Review Gate — Complete

The first review batch compared `S1-A` through `S1-D` at `320px` and `390px` using
Korean, Japanese, English, and mixed-script identity fixtures.

The committed result summary and its actions are approved to share one visual row at
default text size for both compact validation widths. The summary remains first in
reading order and the Filter/Sort and view actions remain second. A permanently split
default layout is rejected because it adds vertical separation without improving the
task hierarchy. If `200%` text resize or a localization fixture causes collision, the
specimen must report that failure rather than silently approving a different layout.

The filter transition, Music-grid capacity, compact localization, and `200%` text
resize questions are resolved. No approved line limit or hierarchy failed in the
measured compact matrix. `S1-A` through `S1-D` therefore do not require another design
decision pass unless a later Foundation authority introduces a documented conflict.
The wider and state-heavy `S1-E` through `S1-G` coverage remains part of the later
integrated specimen gate; it must not silently revise these compact outcomes.

## Decision and Validation Status Log

| ID       | Entry                                                                                                                                 | Status       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `S1V-01` | Use this document as the bounded S1 structural validation protocol.                                                                   | `Approved`   |
| `S1V-02` | Use `S1-A` through `S1-G` and the fixture/measurement matrices above.                                                                 | `Approved`   |
| `S1V-03` | Treat current UI and current font delivery as migration evidence only.                                                                | `Observed`   |
| `S1V-04` | Earlier draft deferred all four First Review Gate outcomes; the compact row outcome is now approved.                                  | `Superseded` |
| `S1V-05` | Omit repeated visible `N/H/E/R` labels while preserving fixed slot order and accessible full names.                                   | `Approved`   |
| `S1V-06` | Keep committed result summary and actions in one visual row at `320px` and `390px` default text size.                                 | `Approved`   |
| `S1V-07` | Reject a permanently split default compact result-context layout.                                                                     | `Rejected`   |
| `S1V-08` | Record the measured current `320px/390px` List and Grid baseline as migration evidence.                                               | `Observed`   |
| `S1V-09` | Use the `138px` compact floor, `168px` preferred Grid width, `536/720/904px` capacity thresholds, and five-column ceiling.            | `Approved`   |
| `S1V-10` | Earlier direction reserved visible caption, original-title, and artist lines in both List and Grid.                                   | `Superseded` |
| `S1V-11` | Earlier draft fixed the square List jacket at `56 × 56px` independently of row height.                                                | `Superseded` |
| `S1V-12` | Earlier direction allowed a content-driven `64–84px` List row to accommodate a visible localized-title caption.                       | `Superseded` |
| `S1V-13` | Show original title and artist only, each on one visible line, while translated/read-title aliases remain searchable.                 | `Approved`   |
| `S1V-14` | Keep the compact List row and its square jacket at `64px`; do not reserve caption-driven height.                                      | `Approved`   |
| `S1V-15` | Below `1216px`, use the combined staged Filter/Sort layer; at `1216px`, activate a `3/12` rail and `9/12` result region.              | `Approved`   |
| `S1V-16` | Keep Sort as one labelled result-toolbar selector and reject a persistent horizontal row of sort and filter buttons.                  | `Approved`   |
| `S1V-17` | The direct `24`-combination compact browser matrix passes after correcting the two measured `200%` text defects.                      | `Observed`   |
| `S1V-18` | At `200%` text size, let the search scope and difficulty values grow, move List difficulties below identity, and use one Grid column. | `Approved`   |
| `S1V-19` | Treat approved one-line title and artist ellipsis as expected display behavior while preserving complete accessible identity.         | `Approved`   |
| `S1V-20` | Close the `S1-A`–`S1-D` compact gate; reopen it only for a documented conflict introduced by later Foundation validation.             | `Approved`   |
