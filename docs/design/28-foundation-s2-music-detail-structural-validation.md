# NosLog 2.0 Foundation S2 Music Detail Structural Validation

## Document Control

- Status: `Approved — S2 First Review complete`
- Canonical language: English
- Korean companion:
  [28-foundation-s2-music-detail-structural-validation.ko.md](./28-foundation-s2-music-detail-structural-validation.ko.md)
- Started: 2026-08-06
- Approved: 2026-08-06
- Scope: structural validation of the approved Foundation typography, spacing,
  grid, container, density, and target contracts on representative specimen `S2`
- Approval boundary: this document does not approve color, material, final component
  styling, final chart geometry, production screen composition, or application
  implementation

## Related Authority

- [Music Detail page brief](./05-music-detail-page-brief.md)
- [Foundation v0.1 research brief](./24-foundation-v0.1-research-brief.md)
- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation typography and layout candidates](./26-foundation-typography-layout-candidates.md)
- [S1 discovery structural validation](./27-foundation-s1-discovery-structural-validation.md)

The approved Music Detail brief owns product behavior, content ownership, order,
localization, states, and responsive meaning. Documents `25` and `26` own the shared
Foundation contracts. This validation may expose a conflict but may not silently
change those authorities. A material conflict must return to the user as an explicit
revision decision.

## Validation Purpose

`S2` tests whether the approved Foundation can support one focused Music identity and
selected Chart context without retaining the current fixed `390px` application column.
It must answer the following questions with measured evidence:

1. Can the original Music title, artist, selected Chart context, four difficulties,
   two resource actions, and local area switcher remain understandable at `320 CSS px`?
2. Can the longest real mixed-script title wrap completely on Music Detail without
   horizontal overflow, clipping, or a new type-size exception?
3. Can an optional translated/read-title trigger and anchored non-modal popover remain
   accessible by hover, focus, click, touch, and keyboard without shifting layout?
4. Can compact widths use one full-label area selector while a measured wider region
   changes to four full-label tabs without exposing both controls simultaneously?
5. Can Chart Info remain a concise facts panel while My Record gives Best performance,
   cumulative facts, progress, recent plays, and collapsed analysis the approved
   hierarchy?
6. Can the `wide` `1440px` ceiling use extra space for analysis instead of enlarging
   every label or stretching short facts across the canvas?
7. Do default, long-title, missing-optional-data, disabled-action, signed-out, empty,
   loading, and partial-record states preserve the same context and focus model?

## Non-goals

- This is not a final page design or production-ready Figma screen.
- It does not reproduce or approve the current NosLog visual treatment.
- It does not select Foundation color, border, radius, elevation, icon, or motion
  tokens.
- It does not redesign the WebGL Chart Viewer or move its renderer into this page.
- It does not complete the specialist dense-ranking validation assigned to `S3`.
- It does not implement NosLog 2.0 application code.
- It does not use the legacy NOSTORY Figma as current layout authority.

## Observed Baseline

### Repository and browser evidence — 2026-08-05

| ID          | Observation                                                                                                                                                                                      | Status     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `S2-OBS-01` | The current Music Detail wrapper remains approximately `390px` wide at a `1280px` viewport and leaves most desktop space unused.                                                                 | `Observed` |
| `S2-OBS-02` | At a `320px` viewport, the current Korean area row overflows horizontally; Japanese and English labels produce still wider overflow.                                                             | `Observed` |
| `S2-OBS-03` | A queryless signed-in entry opens My Record, while the approved default for signed-in and signed-out users is Chart Info.                                                                        | `Observed` |
| `S2-OBS-04` | Pattern tendency and score distribution currently appear inside Music Info even though the approved ownership moves them to Tier & Evaluation and Ranking respectively.                          | `Observed` |
| `S2-OBS-05` | View chart and Play video currently sit at the bottom of Music Info. View chart can disappear from link semantics when unavailable, and Play video forces a new tab.                             | `Observed` |
| `S2-OBS-06` | The current header gives a `96px` jacket and a separate level-constant column priority over the title region; the longest real title therefore ellipsizes to a small fragment at compact widths. | `Observed` |
| `S2-OBS-07` | The current page renders the Japanese reading as a permanent caption instead of the approved on-demand translated/read-title disclosure.                                                         | `Observed` |
| `S2-OBS-08` | The current Altale Real record provides representative dense data: score `976,654`, Grd `112`, `34` plays, max combo `490`, progress, judgement analysis, score trend, and recent plays.         | `Observed` |

These observations are migration and failure evidence only. They are not layout or
styling authority for the specimen.

## Approved Contracts Under Test

### Persistent context and content order

The following semantic order is fixed across supported widths:

1. persistent original Music identity and selected Chart context;
2. one-row four-choice difficulty selector in `Normal → Hard → Expert → Real` order;
3. stable selected-Chart resource actions in `View chart → Play video` order;
4. one local content-area switcher;
5. only the selected semantic panel.

The four areas remain in this order:

1. Chart Info;
2. My Record;
3. Ranking;
4. Tier & Evaluation.

A queryless entry opens Chart Info regardless of authentication. Resource actions keep
their positions when unavailable and use disabled semantics rather than a separate
“no chart” message. Play video uses the current browsing context.

### Focused Music identity and long-title decision

- The original title remains the visible primary identity in every locale.
- Unlike repeated discovery results, Music Detail does not force the original title
  into one line. It wraps fully when space requires it and must not use ellipsis,
  line-clamp, horizontal scrolling, tracking compression, or a smaller type role.
- The user explicitly approved this distinction on 2026-08-06: repeated List/Grid
  identity remains one-line ellipsis, while focused Music Detail preserves the full
  wrapping original title.
- The artist remains a separate supporting row and may wrap independently.
- When an approved localized title or Japanese reading exists, one visible
  language/translation icon sits beside the original-title group. Hover and focus open
  the anchored popover; click and touch toggle it; `Escape`, outside activation, and
  the approved focus-departure behavior close it.
- The popover contains the full wrapped companion identity and does not shift the
  page layout. When no approved value exists, the trigger and its space are omitted.

### Responsive area switcher

- At `320`, `360`, `390`, and `430px`, expose one full-width select-only combobox with
  the current complete localized area label and an anchored four-option listbox.
- Do not use horizontal-scroll tabs, wrapped tab rows, truncation, abbreviation, or
  icon-only area labels.
- Change to manual-activation tabs only when all four complete Korean, Japanese, and
  English labels fit with the approved type, padding, gaps, and focus treatment.
- The exact component-container threshold is measured by this specimen. It is not
  inferred from a device name or copied from the shared `672px` page-grid transition.

### Chart Info ownership

- Always show BPM, note count, and duration.
- Show release date and unlock condition only when actual values exist; do not render
  placeholder rows.
- Do not repeat title, artist, difficulty, level, level constant, Pattern tendency,
  score distribution, player count, relative position, or area summaries.
- Keep the fact group at a readable intrinsic width on wide layouts instead of
  stretching short key-value rows over the full `wide` container.

### My Record hierarchy

Use the approved semantic order:

1. Best performance — best score, rank, FC/Pianist state, date, and relevant progress;
2. cumulative summary — play count, max combo, FC count, and Pianist count;
3. Progress over time — a Best score series with exact-value access;
4. Recent plays — compact summaries with optional per-play detail;
5. Judgement analysis — collapsed by default because it is secondary diagnosis.

The best score uses `metric-display` `32/40 · 700`. Comparison values use
`metric-value` `14/20 · 500` with tabular figures. No shared user-facing text falls
below `12px`.

### Foundation layout and target contract

- Compact: four logical tracks, `12px` gutters, safe-aware `16px` page margins.
- Intermediate: eight tracks, `16px` gutters, safe-aware `24px` margins from a
  `672 CSS px` page-layout query container.
- Wide: twelve tracks, `16px` gutters, safe-aware `32px` margins from a
  `1056 CSS px` page-layout query container.
- Music Detail uses the approved `wide` container class with a fluid maximum of
  `1440px`; this is an upper bound, not a fixed canvas.
- `page-title` uses `24/32 · 700`, stepping to `32/40 · 700` only in a twelve-track
  composition where its measured text region spans at least eight tracks or `640px`.
- Visible controls use approved `32/40/48px` steps and ordinary public effective
  targets remain at least `44 × 44px`.
- Width is used for comparison, analysis, and readable grouping; lower roles do not
  scale up merely because a desktop viewport is wide.

## Real Fixture Matrix

| ID         | Purpose                                    | Repository content                                                                      |
| ---------- | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `MD-ID-01` | Typical complete identity and record       | `Altale` / `削除`, all four difficulties, Real selected, representative personal record |
| `MD-ID-02` | Long mixed original title and missing Real | `50th Memorial Songs -二人の時 ～under the cherry blossoms～-`, three difficulties      |
| `MD-ID-03` | Maximum-pressure artist                    | `STULTI` / `MAX MAXIMIZER VS DJ TOTTO (Arr.by BEMANI Sound Team "Akhuta Works")`        |
| `MD-ID-04` | Long Japanese reading popover              | `協奏曲第1番ホ長調 RV 269「春」より第一楽章` and its full repository `titleKana`        |
| `MD-ID-05` | Missing artist                             | `Happy Birthday to You`, all four difficulties, no artist row                           |

The specimen may use clearly marked fixture-only approved-translation text to exercise
Korean and English popover wrapping. It may not turn synthetic copy into production
Music data.

## State Matrix

- Chart Info with complete optional facts and with optional facts omitted;
- published Chart and video available, each unavailable, and both unavailable;
- signed-in complete record, signed-in no record, signed-out authentication state;
- initial, loading, partial, replacement, and request-error panel states;
- Ranking and Tier & Evaluation destination shells sufficient to prove stable context
  and switching, while their specialist visualization decisions remain with later
  validation;
- popover present, open, dismissed, and omitted;
- available and unavailable Real difficulty;
- default, `200%` text resize, WCAG text spacing, reduced motion, keyboard-only, fine
  pointer, coarse pointer, and safe-area variants.

## S2 Structural Slices

The specimen is reviewed as connected structural slices rather than a final screen:

1. `S2-A` — original Music identity, optional localized-title trigger, and selected
   Chart context;
2. `S2-B` — four-choice difficulty selector and stable resource actions;
3. `S2-C` — compact combobox / measured wider tab transformation;
4. `S2-D` — concise Chart Info facts and omission rules;
5. `S2-E` — Best performance and cumulative record summary;
6. `S2-F` — Progress over time, Recent plays, and collapsed Judgement analysis;
7. `S2-G` — loading, empty, signed-out, disabled, and failure states;
8. `S2-H` — intermediate and wide panel adaptations without a permanent sidebar.

## Approved Structural Contract from Browser Measurement

After reviewing the measured specimen, the user approved the following structural
contract. It still does not approve final component geometry:

- compact identity uses one square jacket beside a fluid title/artist/context region;
- level constant remains part of selected-Chart context instead of taking a permanent
  third compact column that starves the title;
- the four difficulties remain a full-width row;
- the two resource actions remain a second stable row;
- the local area switcher follows those actions;
- wider layouts may place related groups in parallel only while preserving DOM,
  reading, and focus order;
- Chart Info remains intrinsically narrow, while My Record can use additional wide
  tracks for comparison and the progress chart.

This candidate specifically tests the approved full-title decision. If a real title
requires extra height, the page grows vertically; it does not remove identity content.

## Measurement Matrix

| Group                 | Required measurements                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Compact               | `320`, `360`, `390`, `430px`, low-height mobile, safe-area variants                                 |
| Page-grid transitions | `671/672/673px` and `1055/1056/1057px` query-container widths                                       |
| Wide                  | `1280 × 720`, `1440 × 900`, `wide` maximum and wider viewport behavior                              |
| Text                  | default, `200%` resize, WCAG text-spacing override, effective `320px` at zoom                       |
| Language              | Korean, Japanese, English UI and mixed-script identity/popover content                              |
| Input                 | keyboard-only, fine pointer, coarse pointer, hybrid input                                           |
| State                 | long title, missing artist, no Real, disabled actions, signed out, no record, partial record, error |

Record viewport width and page/component query-container width separately. A switcher
or content failure point belongs to the component's available inline size, not to a
generic device category.

## Measurement Record Template

| Field                               | Record        |
| ----------------------------------- | ------------- |
| Slice and state                     |               |
| Locale and fixture                  |               |
| Viewport                            |               |
| Page query-container width          |               |
| Identity text-region width          |               |
| Area-switcher container width       |               |
| Selected panel width                |               |
| Logical track tier                  |               |
| Text resize / spacing override      |               |
| Pointer / keyboard mode             |               |
| Page horizontal overflow            | `Pass / Fail` |
| Original-title clipping             | `Pass / Fail` |
| Popover clipping or layout shift    | `Pass / Fail` |
| Control collision or target overlap | `Pass / Fail` |
| Reading and focus order             | `Pass / Fail` |
| Stable state and URL context        | `Pass / Fail` |
| Observed failure                    |               |
| Candidate correction                |               |
| Authority affected                  |               |
| User decision required              | `Yes / No`    |

## Browser Validation Record — 2026-08-06

The editable structural specimen was served locally and measured in the test browser.
The review-frame control sets the specimen's actual inline size, so the values below
are component and page-container measurements rather than device-name assumptions.
This record validates structure only; it does not approve the specimen's grayscale
surface treatment or final component geometry.

### Core matrix result

| Matrix  | Combination                                                          | Cases | Failures |
| ------- | -------------------------------------------------------------------- | ----: | -------: |
| Compact | `320/360/390/430px × ko/ja/en × 4 identity fixtures × 100/200% text` |    96 |        0 |
| Wide    | `768/1280/1440px × ko/ja/en × 4 identity fixtures × 100/200% text`   |    72 |        0 |
| Total   | compact + wide                                                       |   168 |        0 |

All 168 cases were rerun after the final source formatting pass with the same
zero-failure result.

Every case retained a square jacket, two stable resource actions, the complete
original title without horizontal overflow, one area-switcher mode, and no visible
horizontal escape from the specimen frame. The missing-artist fixture omitted its
artist row, and unavailable optional Chart Info facts were omitted rather than
rendered as placeholders.

### Long-title wrapping evidence

The real mixed-script title
`50th Memorial Songs -二人の時 ～under the cherry blossoms～-` remained complete in
every measured case. Its measured line count was:

| Review-frame width | `100%` text | `200%` text |
| -----------------: | ----------: | ----------: |
|            `320px` |           5 |           9 |
|            `360px` |           4 |           8 |
|            `390px` |           3 |           7 |
|            `430px` |           3 |           6 |
|            `768px` |           2 |           3 |
|           `1280px` |           1 |           2 |
|           `1440px` |           1 |           2 |

These counts are evidence, not line-clamp targets. Music Detail grows vertically
when the full title needs more lines.

### Measured area-switcher capacity

The widest localized tab set was measured with the complete English labels. The
candidate changes mode at the following component inline sizes:

| Text condition | Below capacity    | First fitting width | Adjacent confirmation |
| -------------- | ----------------- | ------------------- | --------------------- |
| Default        | `415px`: combobox | `416px`: tabs       | `417px`: tabs         |
| `200%` text    | `703px`: combobox | `704px`: tabs       | `705px`: tabs         |

No case exposed the combobox and tabs together, abbreviated a label, or overflowed
the switcher. `416px` and `704px` are measured candidate thresholds, not yet approved
Foundation tokens or generic viewport breakpoints.

### Interaction and state checks

| Check                                                                                  | Result |
| -------------------------------------------------------------------------------------- | ------ |
| Compact area combobox exposes all four complete labels and updates the selected panel  | `Pass` |
| Translation trigger click/touch toggles the anchored popover                           | `Pass` |
| Translation trigger keyboard focus exposes the companion title; `Escape` dismisses it  | `Pass` |
| `320px` + Japanese long title + `200%` text keeps the `280px` popover inside the frame | `Pass` |
| Opening the popover does not change specimen height                                    | `Pass` |
| Unavailable Real and resource actions retain stable disabled positions                 | `Pass` |
| Signed-out and no-record panels preserve the shared Music/Chart context                | `Pass` |
| Browser console warnings and errors during the measured flow                           | `0`    |

### Demonstrated corrections

1. Native `hidden` state was being overridden by a component `display` rule, so
   omitted optional facts remained visible. A global specimen-only `[hidden]`
   safeguard restored omission semantics.
2. Pointer focus and click both toggled the translation disclosure, causing an
   immediate open-then-close cycle. Pointer-down state now distinguishes the click
   toggle from focus disclosure.
3. A separate fixed-width trigger column reduced the title region at every wrapped
   line. The candidate now keeps the trigger inline with the title group, reducing
   unnecessary compact wrapping without truncating the title.
4. The compact popover could escape the left edge at `320px` with `200%` text. It now
   clamps to the title group in compact layouts and anchors directly to the trigger
   only when the identity region has enough inline space.
5. A decorative one-pixel specimen border reduced the query container by two pixels.
   It was replaced with a non-layout inset outline so the measured threshold equals
   the displayed review-frame width.
6. The first wide validation assertion counted zero-area hidden elements as boundary
   escapes. The assertion was corrected to evaluate only rendered geometry, and all
   72 wide cases were rerun before recording the final result.

## Decision and Validation Status Log

| ID       | Entry                                                                                                                                                                                                                                  | Status     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S2V-01` | This document records the bounded S2 structural validation protocol used for the completed review.                                                                                                                                     | `Observed` |
| `S2V-02` | Treat the current fixed-width page, overflow tabs, content ownership, permanent reading caption, action placement, and queryless default as migration evidence only.                                                                   | `Observed` |
| `S2V-03` | Keep one persistent Music/Chart context and the approved identity → difficulty → resources → area switcher → selected panel order.                                                                                                     | `Approved` |
| `S2V-04` | Preserve the full original title with wrapping on focused Music Detail while repeated List/Grid results keep approved one-line ellipsis.                                                                                               | `Approved` |
| `S2V-05` | Use one compact full-label combobox and change to full-label tabs only at a measured component-capacity threshold.                                                                                                                     | `Approved` |
| `S2V-06` | Use a compact square jacket + fluid identity structure and keep level constant inside selected-Chart context rather than a permanent third column; final jacket size, panel ratio, and component styling remain outside this decision. | `Approved` |
| `S2V-07` | Keep Chart Info facts-only and validate My Record in the approved five-part hierarchy.                                                                                                                                                 | `Approved` |
| `S2V-08` | Keep color, material, final geometry, chart styling, and production implementation outside this gate.                                                                                                                                  | `Approved` |
| `S2V-09` | The final `96` compact and `72` wide browser combinations pass with no structural failures.                                                                                                                                            | `Observed` |
| `S2V-10` | Use measured area-switcher component thresholds of `416px` at default text and `704px` at `200%` text.                                                                                                                                 | `Approved` |
| `S2V-11` | Treat the six demonstrated corrections above as specimen and validation-harness evidence, not as silent changes to approved product behavior.                                                                                          | `Observed` |
| `S2V-12` | Keep the translation trigger inline with the original-title group, clamp its popover to that group at compact widths, and anchor directly to the trigger when sufficient space exists.                                                 | `Approved` |

## Current Gate

The user approved the S2 First Review gate on 2026-08-06. The accepted structural
rules are:

1. compact square jacket + fluid identity, with level constant inside selected-Chart
   context rather than a permanent third column;
2. inline translation trigger + compact group-clamped / wider trigger-anchored popover;
3. measured area-switcher thresholds of `416px` at default text and `704px` at `200%`
   text.

This gate approves the structural contract and measured responsive behavior only. It
does not approve color, material, final jacket size, final panel geometry, chart
styling, a production screen, or application implementation. A later guide phase must
resolve those items under its own approval gate.
