# NosLog 2.0 Foundation v0.1 Research Brief

## Document Control

- Status: `Approved research protocol — Gate 0 complete; later typography, layout, measured transition, and page-title decisions recorded`
- Research date: 2026-08-03
- Last decision update: 2026-08-04
- Canonical language: English
- Korean companion:
  [24-foundation-v0.1-research-brief.ko.md](./24-foundation-v0.1-research-brief.ko.md)
- Scope: the research questions, candidate structure, representative content,
  specimen set, evaluation method, and approval gates required before selecting the
  first NosLog 2.0 visual-foundation values
- Inputs: approved documents `01`–`23`, current repository tokens and components,
  current local-browser evidence, current standards, maintained design systems, and
  the explicit Foundation entry gate in document `22`
- Excluded: maximum line counts, wrapping and truncation policy, fallback and delivery
  details; palette values,
  spacing units, grids, breakpoints, radii, shadows, icon style, motion durations,
  chart styling, component anatomy, high-fidelity screens, Figma production screens,
  and application implementation

This brief does not approve a complete visual system. It defines how candidates must
be researched, combined, tested, compared, and brought to the user for decisions.
Except for the later bounded Pretendard JP, `12px` floor,
`12/14/16/20/24/32px` ordinary physical ramp, gated `40px` display step,
`16/20/24px` lower-line-height and `28/32/40/48px` upper-line-height axes,
`400/500/600/700` shared-weight, natural-tracking, and exact twelve-role-to-nine-
composite mapping decisions, plus the bounded stepped wide `page-title` substitution,
measured grid transitions, and title-region activation conditions explicitly recorded
below and in document `26`, no current value, reference value,
Tailwind default, or candidate becomes authoritative because it appears in this
document.

## Related Documents

- [Current-product audit](./01-current-product-audit.md)
- [Cross-cutting reference matrix](./22-cross-cutting-reference-matrix.md)
- [Specialized Pattern and Exception Register](./23-specialized-pattern-exception-register.md)
- [Shared discovery page brief](./04-shared-discovery-page-brief.md)
- [Music Detail page brief](./05-music-detail-page-brief.md)
- [Chart Viewer page brief](./07-chart-viewer-page-brief.md)
- [Global Rankings page brief](./08-global-rankings-page-brief.md)
- [Shared shell and navigation brief](./15-shared-shell-navigation-brief.md)
- [Chart Editor and contribution page brief](./20-chart-editor-contribution-page-brief.md)

## Purpose and Success Condition

Foundation v0.1 must make later Claude Design work precise without prematurely
turning one attractive specimen into the NosLog system. This research phase succeeds
when:

1. every proposed value answers a named semantic role and verified NosLog need;
2. typography, color, spacing, layout, surfaces, iconography, motion, and data
   visualization are evaluated as one composition rather than isolated style boards;
3. candidates survive real Korean, Japanese, English, metric, long-content, dense,
   empty, error, disabled, permission, and destructive examples;
4. compact and wide layouts preserve the same task and meaning while recomposing
   intentionally;
5. dark, light, system preference, high contrast, zoom, text spacing, and reduced
   motion are treated as design inputs rather than post-design fixes;
6. the user can compare bounded alternatives with evidence and explicitly approve,
   reject, or revise each material decision; and
7. approved values can later map unambiguously to Figma variables and code tokens.

## Governing Constraints

The research cannot reopen or silently weaken the following approved contracts.

| Governing decision                                    | Foundation consequence                                                                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PR-01` Shared hierarchy                              | Every page maps its primary task and supporting content to shared semantic roles. Page-specific priority does not create a page-specific type scale. |
| `PR-02` Familiar interaction, exact domain language   | Foundation styling may clarify interaction but cannot rename, merge, or generalize NOSTALGIA entities.                                               |
| `PR-03` Concise default with necessary context        | Density is reduced through hierarchy and disclosure, not by hiding the scope or value that explains a result.                                        |
| `PR-04` Dark anchor with complete appearance behavior | Dark is the representative art-direction anchor, while System, Dark, and Light require complete semantic parity.                                     |
| `PR-05` One semantic multilingual hierarchy           | Korean, Japanese, and English share roles but require script-aware composition and real-content testing.                                             |
| `PR-06` Task parity through responsive recomposition  | `390px` is a representative canvas, not an application width. Reflow to `320 CSS px` and intentional wide layouts are mandatory.                     |
| `PR-07` Stable comparison and exact evidence          | Charts and dense comparisons preserve units, denominators, scope, order, and structured exact values.                                                |
| `PR-08` Content-led identity                          | Jacket art, music, scores, and NOSTALGIA meaning may carry personality; brand color and effects do not need to dominate every surface.               |
| `PR-09` Accessibility integrated from the start       | Semantic structure, focus, target geometry, contrast, non-color cues, reflow, language, and motion preferences participate in candidate evaluation.  |
| `PR-10` Governed specialization                       | `SP-01`–`SP-06` remain bounded. A renderer or editor need cannot escape into an unrelated shared pattern.                                            |

## Research Method

### Evidence roles

Use the evidence classes defined in document `22`:

- `A`: normative accessibility and internationalization guidance;
- `B`: maintained design systems and platform guidance;
- `C`: current production products;
- `D`: official game material and rhythm-game domain products; and
- `E`: editorial and art-direction references.

No class substitutes for another. WCAG does not select an art direction, Behance does
not set target geometry, a rhythm-game site does not redefine NOSTALGIA semantics,
and a design-system default does not become a NosLog token.

### Focused comparison and saturation

- Each material decision batch must compare at least twelve independent relevant
  sources; fifteen or more are preferred while credible additions still alter the
  identified patterns, risks, or exceptions.
- Multiple pages from one organization can deepen one source but do not inflate the
  independence count.
- Search-result pages, mirrors, localized copies, and weak listicles do not count.
- Research stops only when additional credible sources no longer materially change
  the alternatives, constraints, or rejection conditions.
- Every retained source records its transferable principle, NosLog applicability,
  and limitation.

### Approval discipline

Observed facts may be recorded immediately. Alternatives and recommendations remain
`Proposed` until the user explicitly decides them. Approval of a research method is
not approval of any candidate value. Approval of one decision batch does not imply
approval of the next.

## Current Implementation Baseline

### Repository observations

The current implementation is evidence of existing content and inconsistency, not a
visual authority for NosLog 2.0.

| Area                 | Observed implementation                                                                                                                                                            | Research implication                                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Font                 | `app/layout.tsx` loads local `PretendardVariable.woff2` through `next/font/local`, with weights `45 920` and `swap`.                                                               | The current Pretendard file is migration evidence; it is not equivalent to the later-approved Pretendard JP family until delivery and fallback validation. |
| Type roles           | `app/globals.css` defines utilities for display, score display, title, wordmark, section, body, muted body, label, caption, micro, badge, and input.                               | The semantic-role idea is reusable; the current values and names require real-content validation.                                                          |
| Current type usage   | A broad `app` + `components` scan found `text-sm` 164 times, `text-xs` 149 times, explicit `10px` 11 times, and several other direct sizes.                                        | Token utilities coexist with many local choices. Frequency describes debt; it does not select the future scale.                                            |
| Color                | Dark and light CSS variables cover neutral surfaces, text, interaction, state, ranks, difficulty, Basic/Recital, genres, and Discord.                                              | The role inventory is useful, but ownership and collision rules are incomplete and each appearance needs validation.                                       |
| Theme behavior       | CSS contains dark and light values, while the early root script currently resolves only explicit `light` or fallback `dark`.                                                       | The approved System/Dark/Light contract is not yet fully represented by current behavior. Foundation research must specify all three.                      |
| Spacing and density  | The code repeatedly uses `gap-1` through `gap-4`, several half steps, direct padding/margin values, and control heights from `h-8` through `h-12` and beyond.                      | Repetition suggests useful clusters, but no approved spacing, density, or target scale can be inferred from counts alone.                                  |
| Radius and elevation | A `0.5rem` card radius exists, while the broad scan found `rounded-md` 233 times, `rounded-card` 196 times, `rounded-full` 66 times, other radii, and several shadow levels.       | Surface vocabulary is partially tokenized but not governed by purpose. Candidate work must reduce arbitrary depth and corner use.                          |
| Icons                | `lucide-react` is the primary code dependency, supplemented by rank images, flags, jacket images, and custom Canvas/WebGL marks.                                                   | Test a coherent functional icon grammar without forcing domain art or renderer graphics into the same icon set.                                            |
| Motion               | The product uses many local color, opacity, and transform transitions plus spinners and renderer animation. No complete semantic motion and reduced-motion token model is visible. | Separate functional feedback, spatial continuity, loading, and expressive motion before choosing duration or easing.                                       |
| Visualization        | Recharts renders line, radar, bar, and other charts; PixiJS renders the falling viewer and editor.                                                                                 | Chart anatomy and renderer styling must share semantics while respecting the approved specialized contracts.                                               |
| Layout               | The public navigation shell uses `max-w-97.5` (`390px`). Some inner pages also declare larger maximum widths, but the outer shell prevents them from using that space.             | The existing shell is a verified implementation gap, not the new desktop container.                                                                        |

The raw counts above cover both user and administrator code and are used only to show
the breadth of current variation. Administrator screens remain outside the broad 2.0
redesign, except where shared primitives or future user-facing editor requirements
need evidence.

### Browser observations

The local signed-in product was inspected on 2026-08-03. These observations describe
current behavior only.

| Route and viewport                | Observed evidence                                                                                                                                                                    | Foundation question exposed                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `/ko`, `390 × 844`                | Home uses a compact header, notice, centered identity, search, six destination blocks, sync guide, feedback, official news, and footer in one narrow reading flow.                   | Establish shared compact rhythm without giving every retained block equal emphasis.                                           |
| `/ko`, `1440 × 900`               | The same approximately `390px` column remains centered with extensive unused space.                                                                                                  | Define intentional wide composition and reading widths without merely enlarging mobile cards.                                 |
| `/ko/music`, `390 × 844`          | Dense list rows expose jackets, long Japanese/Latin titles, artists, categories, and four difficulty values. Text truncation and small controls already provide useful stress cases. | Validate multilingual title metrics, dense row rhythm, difficulty color ownership, target geometry, and list/grid adaptation. |
| `/ko/music`, `1440 × 900`         | The narrow list remains centered instead of using wide space for improved scanning or comparison.                                                                                    | Define bounded containers, list proportions, and desktop enhancement from task needs.                                         |
| `/ko/rankings`, `390 × 844`       | Three persistent selector groups, a current-user summary, flags, ranks, and metric-heavy rows stack above the list.                                                                  | Test selector hierarchy, target size, metric typography, non-color state, and dense row comparison together.                  |
| `/ko/music/.../real`, `390 × 844` | Music Detail combines title, artist, level constant, difficulty and section navigation, score metrics, chart, judgement detail, and recent play.                                     | Test page hierarchy, score typography, localization, data visualization, and progressive disclosure in one composition.       |

The current product already supplies realistic long titles, mixed scripts, empty
jacket states, scores, ranks, and dense filters. Those fixtures should be reused in
specimens; the current layout and style should not.

## Foundation Dependency Model

No foundation track is approved alone. The following dependencies must be visible in
every candidate review.

| Track                      | Depends on                                                                 | Typical failure if isolated                                                            |
| -------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Typography                 | content, language, width, spacing, contrast, metric alignment              | A scale that looks balanced in Latin fails Korean/Japanese wrapping or score rows.     |
| Color                      | surfaces, type weight, borders, states, charts, appearance mode            | A palette passes swatches but fails small metadata, focus, difficulty, or chart marks. |
| Spacing and grid           | type metrics, targets, content length, density, wide-task model            | A neat spacing scale creates clipped controls or a stretched desktop mobile column.    |
| Borders, radius, elevation | color layers, interaction states, grouping, overlay behavior               | Every block becomes a raised card and hierarchy turns noisy.                           |
| Icons                      | label policy, target size, stroke contrast, locale-independent recognition | Small unlabeled icons become ambiguous or inconsistent with rank/domain images.        |
| Motion                     | state change, focus, renderer timing, reduced-motion contract              | Decoration obscures status or reduced motion accidentally changes chart meaning.       |
| Data visualization         | exact values, type, color ownership, container size, interaction           | Charts become visually attractive but incomparable, hover-dependent, or inaccessible.  |

## Research Tracks

### F1. Multilingual and Metric Typography

#### Questions

1. Which font or locale-aware stack gives the best Korean, Japanese, Latin, numeral,
   punctuation, and symbol composition at NosLog's real densities?
2. Can one family/variable family meet body, control, title, and metric needs, or is a
   narrowly bounded metric/display companion justified?
3. Which shared semantic roles are necessary without creating page-specific scales?
4. How do title reading/translation, original title, artist, score, rank, tabular
   values, captions, and legal copy preserve order and readability?
5. What line-height, weight, tracking, wrapping, truncation, numeral, and fallback
   behavior survives all three locales, text spacing, and `200%` text enlargement?
6. What font-loading and fallback-metric strategy prevents unacceptable layout shift?

#### Required candidate evidence

- The approved Pretendard JP family with credible delivery, subsetting, and fallback
  configurations justified by glyph coverage, licensing, web delivery, language form,
  metrics, and performance. Another family is not compared unless a blocking technical
  failure is found and the user explicitly reopens the family decision.
- Separate Korean, Japanese, English, mixed-script, and metric specimens using the
  same semantic roles.
- Real long music titles and artists, not alphabet samples alone.
- Score and time examples with tabular alignment, separators, decimals, signs, ranks,
  BPM, time signatures, and measure numbers.
- Fallback and slow-font-loading comparison.

#### Reject a candidate when

- it requires independent semantic hierarchies per locale;
- required Japanese/Korean glyphs or symbols fall back unpredictably;
- small metadata depends on very thin weight or low contrast;
- long titles or controls require fixed-height clipping;
- metric emphasis distorts reading hierarchy; or
- performance/licensing cannot support production use.

### F2. Appearance, Color Roles, and Collision Policy

#### Questions

1. How many neutral background and surface roles are necessary for page, grouped
   content, sunken workspace, raised content, overlay, and scrim?
2. Which semantic roles own text, icon, border, focus, interaction, success, warning,
   danger, information, disabled, selected, and loading color?
3. How are NOSTALGIA hand, difficulty, Basic/Recital, rank, score-band, genre, and
   data-series colors prevented from conflicting with actions or statuses?
4. Which roles may use color strongly, and which must remain neutral or content-led?
5. How do System, Dark, and Light preserve identical meaning without simple inversion?
6. What non-color cue accompanies every state, hand, difficulty, and chart distinction?

#### Proposed ownership layers

This model is a research hypothesis, not an approved palette:

1. neutral and surface roles;
2. text, icon, border, focus, and interaction roles;
3. universal semantic status roles;
4. stable NOSTALGIA entity roles such as hand, difficulty, and mode;
5. comparison-local data-series roles; and
6. content/brand accents used only where they do not acquire another meaning.

Every candidate must provide a collision table showing where the same appearance is
allowed, prohibited, or requires a redundant label, shape, pattern, icon, or value.

#### Reject a candidate when

- one hue means both status and difficulty without redundant clarification;
- secondary text, borders, focus, or essential chart marks fail applicable contrast;
- dark elevation depends on invisible shadows;
- light appearance is only an inverted dark screenshot;
- jacket art or a score state destroys nearby legibility; or
- a comparison cannot be understood without color perception.

### F3. Spacing, Grid, Containers, and Density

#### Questions

1. What smallest useful spacing set creates consistent grouping without preventing
   optical correction?
2. Which gaps belong to inline items, control groups, card content, sections, and page
   regions?
3. What compact and comfortable density modes are genuinely needed, and where?
4. Which container classes support reading, discovery lists, detail analysis,
   rankings, viewer/editor workspaces, and overlays?
5. At which measured content widths do list, grid, pane, selector, or chart
   compositions need to change?
6. How do padding and target geometry remain usable at `320 CSS px` and zoom?

#### Required candidate evidence

- A spacing-role map rather than a list of arbitrary numbers.
- Compact and wide versions of the same real-content fragments.
- Measured transition points based on the longest localized labels and validated type.
- Examples where wide space improves comparison or analysis and examples where text
  remains deliberately bounded.
- Pointer target and focus clearance overlays.

#### Reject a candidate when

- `390px` becomes a fixed application width or universal breakpoint;
- desktop merely scales or centers the mobile column;
- every page invents its own outer padding, grid, and section rhythm;
- density is achieved by undersized text or crowded targets; or
- an ordinary page requires two-dimensional scrolling.

### F4. Borders, Radius, Elevation, and Material Treatment

#### Questions

1. Which boundaries should use whitespace, divider, border, surface shift, or actual
   elevation?
2. How many radius and border-weight roles are necessary?
3. Which elements are flat, sunken, raised, overlay, movable, focused, selected, or
   interactive?
4. How do dark and light appearances communicate layering without excessive shadows?
5. How do jacket art, charts, menus, dialogs, popovers, and focused viewer controls
   sit within one material model?

#### Required candidate evidence

- One ordinary content card, one grouped flat region, one input/control group, one
  overlay, one dialog, one scroll boundary, and one viewer control surface.
- Side-by-side dark/light layering and interaction states.
- Explicit rationale for every shadow and rounded container.

#### Reject a candidate when

- raised cards are the default grouping device;
- radius becomes decorative rather than structural;
- shadows are the only dark-mode layer cue;
- overlays cannot be distinguished from page content; or
- content hierarchy is communicated by nesting borders repeatedly.

### F5. Iconography and Graphic Roles

#### Questions

1. Which actions require text labels, icon plus label, icon-only presentation, or no
   icon?
2. Can the current Lucide base provide a coherent stroke, optical size, and metaphor
   system for common web actions?
3. Which domain graphics must remain separate: rank images, flags, jackets, hand
   cues, difficulty identifiers, chart notes, and NosLog mark?
4. What size, stroke, container, contrast, and disabled/focus behavior remain legible
   in compact controls?
5. How are unfamiliar icons localized and named for assistive technology?

#### Reject a candidate when

- icon-only actions rely on an unfamiliar metaphor;
- decorative icons compete with music artwork or data;
- stroke contrast disappears at the intended size;
- country, rank, difficulty, or state is conveyed only through an unlabelled image; or
- one icon changes meaning across page families.

### F6. Functional and Expressive Motion

#### Questions

1. Which motion communicates loading, state change, spatial continuity, direct
   manipulation, attention, or expressive identity?
2. Which transitions can use a shared semantic duration/easing role?
3. Which motion is essential to the falling chart's timing meaning, and which shell
   motion is optional?
4. What is removed, shortened, faded, or made instantaneous under reduced motion?
5. How are loading and completion communicated when animation is absent?

#### Required candidate evidence

- A motion-purpose inventory before any duration scale.
- Default and reduced-motion examples for menu, dialog, filter/result update,
  skeleton/progress, list change, chart shell, and editor panel adjustment.
- Explicit separation between renderer timing and ordinary interface motion.

#### Reject a candidate when

- motion is added only to make the product feel premium;
- reduced motion removes state information or changes chart timing meaning;
- auto-moving content competes with reading or arcade use;
- focus and content move unexpectedly; or
- loading depends on animation alone.

### F7. Data-Visualization Anatomy and Accessible Alternatives

#### Questions

1. Which chart form best answers comparison, trend, distribution, relationship,
   pattern fingerprint, or geographic exploration?
2. Which title, scope, unit, denominator, scale, axis, legend, direct label, exact
   value, count, time range, and source are required?
3. Which values remain visible without hover and which may be progressively disclosed?
4. How do chart colors coexist with difficulty, hand, rank, and status colors?
5. What structured summary or table/list provides exact evidence and task parity?
6. How do narrow containers, high contrast, reduced motion, and locale expansion alter
   chart composition without altering meaning?

#### Required candidate evidence

- Music score trend, rank distribution, score bands, one approved five-axis community
  radar, and an arcade map/list relationship.
- Empty, aggregating, partial, error, and stale-data states.
- Keyboard/focus order and screen-reader reading sequence.
- Exact-value representation outside pointer-only tooltips.

#### Reject a candidate when

- the chart form is selected for appearance rather than the analytical question;
- scope, scale, order, unit, or denominator changes across comparable views;
- the same data is duplicated decoratively in multiple chart forms;
- hover or color is the only exact-evidence path; or
- a specialized renderer pattern is generalized beyond its approved boundary.

## Representative Specimen Set

The first candidates must be tested on connected fragments rather than a complete
high-fidelity page suite.

| ID   | Required fragment                                                                                                                 | Foundation stress                                                                                               |
| ---- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `S1` | Shared discovery search, mode selector, preview/result row, filters, list/grid switch, empty/loading/error                        | Multilingual input, compact targets, dense cards, title/artist length, difficulty roles, progressive disclosure |
| `S2` | Music Detail identity plus selected chart, best score, judgement summary, trend, and recent play                                  | Page hierarchy, metric typography, tabs/selectors, chart anatomy, rank/status color, empty/partial data         |
| `S3` | Global Rankings selectors, current-user summary, dense ranking rows, pagination                                                   | Repeated comparison, flags, metric alignment, selection, high density, narrow/wide composition                  |
| `S4` | Focused Chart Viewer identity, view switch, renderer frame boundary, transport/settings, error fallback, full-sheet column region | Specialized shell, dark layering, small controls, exact time, hand cues, motion, bounded 2D exception           |
| `S5` | Compact Home search/destinations plus one NosLog notice and supplementary official-news block                                     | Editorial rhythm, content-led identity, hierarchy without equal card weight, third-party fallback               |
| `S6` | User-facing chart contribution/editor shell fragment with resizable tool regions and structured property path                     | Dense professional-tool geometry, icon labels, focus, splitters, wide use, compact recovery                     |

`S1`–`S5` are the minimum entry set from document `22`. `S6` is proposed because the
approved future user-facing editor exposes foundation requirements that ordinary
content pages cannot validate. It does not authorize an editor redesign or final
screen suite in this phase.

## Representative Content Suite

### Languages and strings

- Korean interface labels, notices, errors, dates, and long explanatory copy.
- Japanese original music titles, kana readings, punctuation, brackets, middle dots,
  Latin mixtures, and long artist credits.
- English translations, long labels, account/privacy copy, and mixed proper nouns.
- Content with no translation, no reading, and fallback-language behavior.
- Unbroken identifiers, numbers, paths, URLs, and technical terms where relevant.

### Music and metric fixtures

- Short and very long titles and artist names from the current catalog.
- Jacket present, jacket absent, and artwork with bright/dark edge colors.
- Normal/Hard/Expert/Real, Basic/Recital, left/right hand, rank, FC, Pianist, score
  bands, BPM/time signature, measure, and exact time.
- Scores from empty/unplayed through dense comparison, signed deltas, percentages,
  counts, dates, and loading placeholders.

### State fixtures

- default, hover where applicable, focus-visible, pressed, selected, disabled,
  unavailable, loading, empty, partial, stale, success, warning, error, permission,
  offline, destructive confirmation, and recovery.
- Signed-out, signed-in without linked data, signed-in with sparse data, dense veteran
  data, and private-field omission.

## Responsive and Accessibility Validation Matrix

| Dimension     | Required checks before approval                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Compact width | `320 CSS px` reflow; representative `390px`; at least one measured intermediate width where content pressure changes composition   |
| Wide width    | `1280 × 720` and `1440 × 900`, plus content-container checks rather than viewport-only assumptions                                 |
| Zoom and text | Browser zoom up to `400%` where applicable, text enlargement to `200%`, WCAG text-spacing overrides, no clipped fixed-height text  |
| Input         | Touch, mouse, trackpad, keyboard-only, visible focus, no pointer-hover dependency for primary information or action                |
| Appearance    | System, Dark, Light, high-contrast/forced-colors where supported, jacket/art extremes, no color-only meaning                       |
| Motion        | Default and reduced-motion behavior; loading and state changes remain understandable without animation                             |
| Language      | Korean, Japanese, English, language-of-parts, locale-aware numbers/dates, script-aware wrapping and punctuation                    |
| States        | Long, dense, empty, loading, error, disabled, permission, destructive, recovery, third-party and renderer failure where applicable |
| Semantics     | Reading and focus order, landmarks, names, roles, values, status announcements, structured chart evidence                          |

The exact intermediate transition widths are outputs of specimen measurement, not
inputs copied from Tailwind, a device list, or the current code.

## Candidate Evaluation Rubric

Score alone cannot approve a candidate. It organizes evidence and exposes tradeoffs;
the user still decides.

| Criterion                                    | Weight | Evidence required                                                                             |
| -------------------------------------------- | -----: | --------------------------------------------------------------------------------------------- |
| Task and hierarchy clarity                   |     20 | Primary task and selected context remain immediately identifiable across all fragments.       |
| Multilingual legibility and metric precision |     15 | Real KO/JA/EN and number specimens, wrap/truncation record, fallback behavior.                |
| Accessibility and state robustness           |     20 | Contrast, target, focus, reflow, text spacing, reduced motion, semantic and non-color checks. |
| Responsive recomposition and density         |     15 | `320`, `390`, measured transitions, `1280`, `1440`, container evidence.                       |
| Cross-family consistency                     |     10 | Shared roles work in discovery, detail, rankings, Home, viewer, and editor fragment.          |
| Domain fidelity and visualization accuracy   |     10 | NOSTALGIA semantics, exact comparison frame, hand/difficulty/data collision record.           |
| Performance and implementation viability     |      5 | Font payload, token mapping, browser support, renderer/chart constraints.                     |
| Content-led NosLog identity                  |      5 | Distinctive but restrained composition that does not copy a reference surface.                |

Any failure of WCAG 2.2 AA target constraints, required task completion, NOSTALGIA
meaning, localization, structured exact evidence, or an approved specialized-contract
boundary is a blocking failure regardless of the numeric score.

## Proposed Decision Batches and Approval Gates

The following order is proposed because it keeps coupled variables together while
making each discussion small enough for explicit decisions.

### Gate 0 — Approve this research protocol

Approve or revise the tracks, sources, specimen set, content suite, rubric, decision
batches, and administrator boundary. No candidate values are selected at this gate.

### Batch A — Semantic roles and incumbent baseline

- Approve the shared semantic role inventory for typography, spacing, color, surface,
  icon, motion, and visualization anatomy.
- Record the incumbent Pretendard baseline for comparison. The family question was
  later resolved by `FBR-08` in favor of Pretendard JP.
- Approve the test fixtures and current-code mapping used to compare candidates.

### Batch B — Structural candidate

- Compare typography, metric typography, spacing, grid, containers, density, and
  target geometry together.
- Apply the candidates to `S1`, `S2`, and `S3` first.
- User selects, revises, or rejects the structural direction before promotion.

### Batch C — Appearance and material candidate

- Compare neutral layers, semantic color ownership, collision policy, borders,
  radius, elevation, and focus/interaction states in System, Dark, and Light.
- Apply to the approved structural composition, not isolated swatches.
- User selects, revises, or rejects the appearance direction.

### Batch D — Icon, motion, and visualization candidate

- Compare icon grammar and label policy, semantic motion and reduced motion, and
  chart anatomy/data colors.
- Validate `S4`, `S5`, and proposed `S6`, then recheck `S1`–`S3` for drift.
- User selects, revises, or rejects each sub-part; no bundled approval is inferred.

### Gate 4 — Integrated Foundation v0.1 validation

- Re-run the complete responsive, language, state, and accessibility matrix.
- Record rejected alternatives and known limitations.
- Only then promote approved tokens, specimens, mappings, and guidance to Foundation
  v0.1 and prepare the necessary Figma guide artifacts.

## Proposed Editable Artifacts After Gate 0

Do not create empty placeholders. Add each artifact when its decision batch begins.

1. `25-foundation-semantic-role-map.md` and `.ko.md`;
2. `26-foundation-typography-layout-candidates.md` and `.ko.md`;
3. `27-foundation-color-material-candidates.md` and `.ko.md`;
4. `28-foundation-icon-motion-visualization-candidates.md` and `.ko.md`;
5. `29-foundation-v0.1-specification.md` and `.ko.md` after integrated approval;
6. Figma variables and annotated guide specimens only when written candidate values
   are ready for visual validation; and
7. a versioned PDF only after the editable milestone is stable and the user decides
   its language packaging.

The numbering is a proposed working sequence and may be changed if the approved work
benefits from another grouping.

## Focused Reference Matrix

The initial brief review spans more than fifteen independent organizations or
standards communities. Multiple pages from one system are treated as one deeper
source, not extra independent votes.

| Source                                                                                                                                                                                                                                                            | Role | Transferable contribution                                                                                                                | Limitation for NosLog                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                                                                                                         | `A`  | Contrast, reflow, resize, text spacing, focus, target size, keyboard, dragging, motion, status, and semantics constrain every candidate. | It does not select a visual identity or token values.                                                           |
| [W3C Hangul layout requirements](https://www.w3.org/International/klreq/) and [Japanese layout requirements](https://www.w3.org/TR/jlreq/)                                                                                                                        | `A`  | Script-specific wrapping, punctuation, mixed-script, and line-composition requirements.                                                  | Print and vertical-writing guidance transfers only where relevant to horizontal web UI.                         |
| [DTCG Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)                                                                                                                                                        | `B`  | Platform-independent names, types, descriptions, aliases, groups, and future Figma/code interchange.                                     | A Community Group report defines format, not NosLog semantics or values.                                        |
| [Atlassian Foundations](https://atlassian.design/foundations), [tokens](https://atlassian.design/foundations/tokens/design-tokens), and [elevation](https://atlassian.design/foundations/elevation/)                                                              | `B`  | Semantic token names, coordinated type/spacing/color, restrained elevation, and dark surface shifts.                                     | Enterprise density and exact values are not transferable.                                                       |
| [Fluent 2 Design Tokens](https://fluent2.microsoft.design/design-tokens)                                                                                                                                                                                          | `B`  | Global-to-alias layers, theme-aware semantic roles, and coordinated type, radius, stroke, and animation.                                 | Microsoft brand and platform defaults are not NosLog direction.                                                 |
| [Material 3 canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview)                                                                                                                                                             | `B`  | Layouts adapt across available space and task patterns rather than scaling one phone canvas.                                             | Android-oriented canonical forms are starting points, not NosLog templates.                                     |
| [Carbon Color](https://carbondesignsystem.com/elements/color/overview/) and [chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)                                                                                                     | `B`  | Dark/light color roles, interaction states, exact chart anatomy, direct labels, axes, legends, and accessible detail.                    | IBM surface and chart styling cannot be copied; some chart guidance remains work in progress.                   |
| [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/), [font tokens](https://designsystem.digital.gov/design-tokens/typesetting/font/), and [layout grid](https://designsystem.digital.gov/utilities/layout-grid/)                               | `B`  | Limited token palettes, font normalization, readable measure, user font-size respect, and configurable containers.                       | Government content defaults and exact scales are not NosLog values.                                             |
| [Primer Primitives](https://github.com/primer/primitives) and [Typography](https://primer.style/product/getting-started/foundations/typography/)                                                                                                                  | `B`  | Functional tokens for light/dark/high-contrast variants, spacing, typography, viewport, and motion in a dense web product.               | GitHub workflow and identity differ from a music/rhythm-game archive.                                           |
| [Shopify Polaris Typography Tokens](https://polaris-react.shopify.com/design/typography/typography-tokens)                                                                                                                                                        | `B`  | Primitive font scales composed into semantic text tokens and reusable variants.                                                          | Commerce administration needs do not decide NosLog content hierarchy.                                           |
| [Adobe Spectrum](https://spectrum.adobe.com/) and [Spectrum 2](https://s2.spectrum.adobe.com/)                                                                                                                                                                    | `B`  | Contextual, cohesive foundations for both casual and professional tools; accessibility, icon, scale, and cross-platform flexibility.     | Adobe's expressive language and proprietary product needs are not a visual target.                              |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography) and [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)                                                                     | `B`  | Type styles as hierarchy, scalable text, readable custom type, redundant cues, control comfort, and reduced motion.                      | Native Apple point sizes and platform materials do not set web tokens.                                          |
| [Tailwind responsive design and container queries](https://tailwindcss.com/docs/responsive-design)                                                                                                                                                                | `B`  | Mobile-first implementation, configurable breakpoints, and component adaptation by parent space fit the current stack.                   | Default breakpoints and container sizes are implementation conveniences, not evidence-based NosLog values.      |
| [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) and [font metric overrides](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/ascent-override) | `B`  | Concrete web mechanisms for motion preference and fallback metric control.                                                               | Browser support must be checked; mechanisms do not decide product meaning.                                      |
| [web.dev font best practices](https://web.dev/articles/font-best-practices)                                                                                                                                                                                       | `B`  | Font loading, fallback, variable-font, payload, and layout-shift evidence.                                                               | Performance guidance does not select aesthetic or script quality.                                               |
| [Pretendard official documentation](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md)                                                                                                                                    | `B`  | Incumbent Korean/Latin/Japanese-aware variable-font capability, licensing, family variants, and recommended fallback stacks.             | Project claims must be tested with NosLog's real Japanese and mixed-script content; incumbency is not approval. |
| [Figma UI design principles](https://www.figma.com/resource-library/ui-design-principles/)                                                                                                                                                                        | `B`  | Hierarchy, contrast, consistency, proximity, alignment, and progressive disclosure provide specimen-review language.                     | It is not a token specification or domain authority.                                                            |
| [GOV.UK Typography](https://design-system.service.gov.uk/styles/typography/)                                                                                                                                                                                      | `B`  | Content-first readable hierarchy, restrained styles, and accessible web defaults.                                                        | Public-service reading tasks differ from dense score analysis.                                                  |
| [Singapore Government Design System responsive grid](https://www.designsystem.tech.gov.sg/foundations/layout/responsive-grid)                                                                                                                                     | `B`  | Intentional column, margin, and gutter changes across compact and wide layouts.                                                          | Its exact 4/8/12 grid and container values are not NosLog values.                                               |
| [NICE Design System layout](https://design-system.nice.org.uk/foundations/layout/)                                                                                                                                                                                | `B`  | Mobile-first fluid spans and bounded content rather than uniform full-width enlargement.                                                 | Health-information measure and tone are not a rhythm-game product template.                                     |
| [Dell Design System grid](https://www.delldesignsystem.com/foundations/grid)                                                                                                                                                                                      | `B`  | Responsive margins, body width, and columns vary by available space.                                                                     | Hardware-commerce content and exact breakpoints do not decide NosLog layout.                                    |
| [Spotify: Reimagining Design Systems](https://spotify.design/article/reimagining-design-systems-at-spotify)                                                                                                                                                       | `C`  | A large music product can share foundations while allowing contextual expression and contribution.                                       | Spotify scale, teams, and listening behavior differ from a focused community archive.                           |
| [Lucide](https://lucide.dev/guide/)                                                                                                                                                                                                                               | `B`  | Current open-source icon base offers a consistent stroke system, tree-shakable implementation, and accessible labelling responsibility.  | A generic set cannot replace NOSTALGIA domain graphics or prove every metaphor.                                 |

### Initial convergence

The reference set converges on semantic rather than value-named tokens, limited and
purposeful scales, real-content validation, coordinated foundations, responsive
containers, accessible appearance modes, restrained elevation, explicit icon/motion
roles, and exact structured visualization evidence. It disagrees on exact role type
sizes above the later-approved `12px` user-facing floor, spacing bases, grids, radius,
color expression, and motion character. Those disagreements are useful candidate
dimensions and remain open.

The review has reached sufficient breadth to propose the research protocol. It has
not reached value-selection saturation because no integrated candidate specimens have
yet been produced or compared.

## Decision Log

| ID       | Entry                                                                                                                                                                   | Status       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `FBR-01` | Use this document to govern the initial Gate 0 Foundation v0.1 research without selecting visual values.                                                                | `Approved`   |
| `FBR-02` | Evaluate seven coupled tracks through real content and connected specimens.                                                                                             | `Approved`   |
| `FBR-03` | Treat Pretendard as an incumbent candidate, not an automatic final font.                                                                                                | `Superseded` |
| `FBR-04` | Keep broad administrator surfaces outside the 2.0 foundation specimen scope, while testing shared primitives and the approved future user-facing editor fragment.       | `Approved`   |
| `FBR-05` | Use `S1`–`S5` as the minimum specimen set and add `S6` for professional editor constraints.                                                                             | `Approved`   |
| `FBR-06` | Review candidates in four explicit gates: protocol, structural, appearance/material, and icon/motion/visualization, followed by integrated validation.                  | `Approved`   |
| `FBR-07` | Create Figma guide artifacts only when written candidate values and comparison needs justify them; do not create final production screens in this session.              | `Approved`   |
| `FBR-08` | Select Pretendard JP as the shared NosLog 2.0 font family while retaining multilingual, loading, fallback, and layout validation before production promotion.           | `Approved`   |
| `FBR-09` | Set `12px` as the global floor for shared user-facing typography without assigning that value to a semantic role or selecting the remaining physical scale.             | `Approved`   |
| `FBR-10` | Recognize document `26`'s approved `12/14/16px` lower physical core and its semantic usage boundaries without selecting remaining composite values.                     | `Approved`   |
| `FBR-11` | Recognize document `26`'s approved `16/20/24px` lower line-height primitives and default `12/16`, `14/20`, and `16/24` pairings with their validation constraints.      | `Approved`   |
| `FBR-12` | Recognize document `26`'s approved `400/500/600/700` shared weight vocabulary, semantic boundaries, expected-frequency hierarchy, and validation constraints.           | `Approved`   |
| `FBR-13` | Recognize document `26`'s approved natural/default tracking rule, retained kerning, prohibition of shared positive or negative tracking tokens, and exception gate.     | `Approved`   |
| `FBR-14` | Recognize document `26`'s approved `20/24/32px` ordinary upper core, gated `40px` display step, and specimen-gated process for proposing any additional shared size.    | `Approved`   |
| `FBR-15` | Recognize document `26`'s approved `28/32/40/48px` upper line-height axis and default `20/28`, `24/32`, `32/40`, and `40/48` pairings without assigning semantic roles. | `Approved`   |
| `FBR-16` | Recognize document `26`'s exact twelve-role-to-nine-composite map, focused-entity and field-value precedence, tabular metric behavior, and rare display gate.           | `Approved`   |

## Gate 0 Approval Record

On 2026-08-03, the user approved the following protocol decisions:

1. retain the seven coupled research tracks, specimen set, content suite, validation
   matrix, and candidate rubric;
2. retain Pretendard as an incumbent candidate with no presumption of final selection;
3. include the `S6` user-facing editor fragment in Foundation v0.1 validation while
   excluding broad administrator management screens; and
4. retain the proposed decision-batch order and editable-artifact plan.

Gate 0 is complete. Batch A semantic-role work may proceed, but approval of this
protocol still does not select any font family, numeric token value, palette, spacing,
layout, material, icon, motion, or visualization candidate.

### Subsequent approved refinement — 2026-08-04

After the Gate 0 record above, the user approved Pretendard JP as the shared NosLog
2.0 font family and `12px` as the global lower bound for shared user-facing type.
Those decisions supersede only the open-family assumption in `FBR-03` and the absence
of a numeric lower bound. They do not waive Batch B validation or select role sizes,
line heights, weights, tracking, responsive type behavior, fallback metrics, or font
delivery details. A validated role may resolve above `12px`; no ordinary shared role
may resolve below it.

Later on 2026-08-04, the user approved `12px`, `14px`, and `16px` as the restrained
lower physical core with the usage boundaries recorded in document `26`. This does
not automatically assign semantic roles or select weight, tracking, upper
title/display steps, metric typography, or layout values.

The user then approved `16px`, `20px`, and `24px` as the restrained lower line-height
primitive axis, with default `12/16`, `14/20`, and `16/24` pairings and the validation
constraints recorded in document `26`. This does not select weights, tracking, upper
sizes, exact semantic composite-role mappings, or component geometry.

The user then approved `400`, `500`, `600`, and `700` as the only shared UI weight
vocabulary, with the semantic boundaries, expected-frequency hierarchy, responsive
stability, and validation constraints recorded in document `26`. This does not select
tracking, upper sizes, exact composite-role mappings, or component geometry.

The user then approved natural/default spacing for all shared UI roles, retained
proper kerning, prohibited shared positive or negative tracking tokens, and kept rare
wordmark, display, renderer, or fallback adjustments behind explicit exception review
as recorded in document `26`. This does not select upper sizes, responsive title
behavior, exact composite-role mappings, or component geometry.

The user then approved `20px`, `24px`, and `32px` as the ordinary upper physical core
and `40px` as a gated display primitive, producing the restrained shared ramp
`12/14/16/20/24/32px` plus the exceptional display step. `40px` is not a routine
page, card, dialog, or section-title option. A new shared size may be proposed only
after representative multilingual and responsive specimens prove that the approved
steps cannot express a necessary semantic distinction. At that stage, the size
decision did not yet select upper line heights, responsive substitutions, exact
composite-role mappings, or metric behavior.

The user then approved `28px`, `32px`, `40px`, and `48px` as the restrained upper
line-height primitive axis, with default `20/28`, `24/32`, `32/40`, and `40/48`
pairings and the usage, multilingual, accessibility, and exception boundaries in
document `26`. This does not assign semantic roles, weights, maximum line counts,
truncation, responsive substitutions, or metric-display behavior.

The user then approved the exact default semantic composite map:
`display` `40/48 · 700`, `page-title` `24/32 · 700`, `section-title`
`20/28 · 600`, `component-title` and ordinary `entity-title` `16/24 · 600`,
`entity-companion` and `body-secondary` `14/20 · 400`, `body` `16/24 · 400`,
`control` and `metric-value` `14/20 · 500`, `metadata` `12/16 · 400`, and
`metric-display` `32/40 · 700`. Metric composites use tabular figures; other roles
remain proportional by default. A domain entity that owns the focused page uses the
`page-title` composite while retaining its entity meaning, and an entered or selected
field value uses `body` while visible action and choice labels use `control`. The
twelve roles intentionally share nine physical composites. This decision does not
approve responsive substitutions, wide-screen enlargement, maximum line counts,
wrapping, truncation, component geometry, spacing, color, layout, automatic display
placement, or final Figma/token naming.

The user then approved the single responsive exception recorded as `FTL-09` in
document `26`: `page-title` steps from proportional `24/32 · 700` in compact/default
composition to proportional `32/40 · 700` in content-driven wide composition. Every
other role remains fixed, fluid interpolation and page-local responsive values are
prohibited, and the exact threshold is deferred to `FTL-08` spacing, grid, and
container work. This later decision does not approve line counts, wrapping,
truncation, component geometry, color, material, final layout, or automatic `display`
placement.

The user then approved the constrained spacing primitive axis recorded as `FTL-08A`
in document `26`: `0/2/4/8/12/16/24/32/48/64px`. Two pixels is reserved for governed
optical or specialized-visualization correction, ordinary application spacing must
use semantic roles rather than arbitrary values, and additional adjacent or large
shared steps require specimen evidence. This decision does not assign page margins,
grid gutters, container padding, responsive section steps, control geometry, target
areas, or the content-driven wide `page-title` threshold.

The user then approved the compact page-grid geometry recorded as `FTL-08B` in
document `26`: a `320–479 CSS px` validation contract, a minimum `16px` safe-aware
inline page margin, four equal logical columns, and `12px` gutters. Ordinary content
must reflow without page-level horizontal scrolling, four columns remain an alignment
contract rather than four visible phone columns, and `480px` is not an inferred
composition breakpoint. This decision does not assign medium or wide grids,
container classes, component insets, density, target geometry, or the wide
`page-title` threshold.

The user then approved the container and grid system recorded as `FTL-08C` in
document `26`: `reading`, `standard`, `wide`, and `workspace` containers use `768px`,
`1280px`, `1440px`, and fluid maximum behavior respectively, while compact,
intermediate, and wide alignment use 4/8/12 columns, `12/16/16px` gutters, and
safe-aware `16/24/32px` minimum inline margins. Container class describes task-space
need and remains separate from the active alignment tier. At this point, exact
four-to-eight and eight-to-twelve transitions, component geometry, density, target
size, panel ratios, and the wide `page-title` threshold remained unresolved.

The user then approved the density and target-geometry contract recorded as
`FTL-08D` in document `26`: `32/40/48px` are the constrained Compact, Standard, and
Comfortable visible control-height steps; `44px` is the ordinary effective-target
contract rather than a fourth visible step; `32px` effective targets are allowed only
as governed fine-pointer Viewer/Editor exceptions; and Foundation v0.1 provides no
unrestricted global density preference.

The user then approved the measured responsive-transition contract recorded as
`FTL-08E` in document `26`. A page-layout query container uses four columns below
`672 CSS px`, eight columns from `672` through `1055 CSS px`, and twelve columns at
`1056 CSS px` and above. Component recomposition remains governed by separately
measured container failures rather than those shared page-grid transitions. Wide
`page-title` activates only in the twelve-column tier when its text region spans at
least eight tracks or otherwise measures at least `640 CSS px`, and never inside a
`reading` composition. This decision does not approve maximum line counts,
truncation, component-specific layouts, color, material, or panel ratios.

## Phase Checklist

- [x] Root project instructions and repository baseline reread.
- [x] Current tokens, font loading, layout shell, component variation, chart stack,
      and motion usage inspected.
- [x] Current local Home, Music discovery, Rankings, and Music Detail inspected at
      representative compact and/or wide viewports.
- [x] More than fifteen independent official or maintained evidence sources compared.
- [x] English canonical and Korean companion drafted together.
- [x] User approved the research protocol on 2026-08-03.
- [x] Batch A semantic-role work began after Gate 0 approval.
- [x] User selected Pretendard JP and the `12px` shared user-facing floor on
      2026-08-04.
- [x] User approved the bounded `12/14/16px` lower physical core in document `26` on
      2026-08-04.
- [x] User approved the bounded `16/20/24px` lower line-height axis and default lower
      pairings in document `26` on 2026-08-04.
- [x] User approved the bounded `400/500/600/700` shared weight vocabulary and its
      usage constraints in document `26` on 2026-08-04.
- [x] User approved natural/default tracking, retained kerning, no shared positive or
      negative tracking tokens, and explicit exception governance in document `26` on
      2026-08-04.
- [x] User approved the restrained `20/24/32px` ordinary upper physical core and gated
      `40px` display step in document `26` on 2026-08-04.
- [x] User approved the restrained `28/32/40/48px` upper line-height axis and default
      `20/28`, `24/32`, `32/40`, and `40/48` pairings in document `26` on
      2026-08-04.
- [x] User approved the exact twelve-role-to-nine-composite map and its focused-entity,
      field-value, metric, display, and semantic-heading precedence rules in document
      `26` on 2026-08-04.
- [x] User approved the bounded stepped `page-title` substitution, fixed behavior for
      every other role, prohibition on fluid interpolation, and deferral of the exact
      content-driven threshold to `FTL-08` in document `26` on 2026-08-04.
- [x] User approved the constrained spacing primitive axis, semantic-role requirement,
      governed `2px` exception, and prohibition on arbitrary shared application
      spacing as `FTL-08A` in document `26` on 2026-08-04.
- [x] User approved the compact `16px` safe-aware page margin, four-column alignment
      contract, `12px` gutters, and `320–479 CSS px` validation boundary as `FTL-08B`
      in document `26` on 2026-08-04.
- [x] User approved the four governed container classes and the compact/intermediate/
      wide 4/8/12-column alignment models as `FTL-08C` in document `26` on
      2026-08-04, while deferring exact content-driven transitions.
- [x] User approved the constrained visible control-height, effective-target,
      fine-pointer exception, and density-governance contract as `FTL-08D` in
      document `26` on 2026-08-04.
- [x] User approved the measured `672/1056 CSS px` page-grid transitions,
      component-specific container-failure separation, and exact wide `page-title`
      activation conditions as `FTL-08E` in document `26` on 2026-08-04.
- [ ] Validate Pretendard JP delivery, fallback metrics, and the floor in the required
      multilingual integrated specimens before production promotion.
