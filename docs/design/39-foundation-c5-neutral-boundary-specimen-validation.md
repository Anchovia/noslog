# NosLog 2.0 C5 Neutral Boundary Specimen Validation

## Document Control

- Status: `Technical validation complete; NB-A approved; C5M-05 closed`
- Technical-validation date: 2026-08-09
- User-approval date: 2026-08-09
- Canonical language: English
- Korean companion:
  [39-foundation-c5-neutral-boundary-specimen-validation.ko.md](./39-foundation-c5-neutral-boundary-specimen-validation.ko.md)
- Scope: apply document `38` `NB-A` exact Spectrum S2 neutral boundary
  ladder to approved `M-A` surfaces, representative NosLog structures, ordinary
  states, and accessibility overrides as decision evidence for `C5M-05`
- Inputs: approved documents `25`, `35`, and `37`; boundary research in document
  `38`; exact Spectrum S2 aliases; and the dedicated
  [interactive boundary specimen](./specimens/c5-neutral-boundary-specimen.html)
- Excludes: production tokens, final component aliases, focus-ring and feedback
  colors, automatic selected-state boundaries, radius, elevation, final component
  geometry, high-fidelity screens, and application implementation

The specimen is decision evidence, not a production interface or a final Claude
Design screen. The square cards and frames in the Controls and Matrix scenes are
measurement fixtures; their geometry is not a component recommendation.

## Related Documents

- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.md)
- [C5 neutral boundary reference comparison](./38-foundation-c5-neutral-boundary-reference-comparison.md)

## Authority Boundary

Approved `M-A` surfaces and `F-A` foregrounds were held constant. The specimen used
only the following approved `NB-A` boundary values:

| NosLog role      | Spectrum source |     Light |      Dark | Contract                                                                                                               |
| ---------------- | --------------- | --------: | --------: | ---------------------------------------------------------------------------------------------------------------------- |
| `divider`        | `gray-200`      | `#e1e1e1` | `#323232` | Decorative rhythm only; spacing, headings, or structure already communicate the relationship                           |
| `border-subtle`  | `gray-300`      | `#dadada` | `#393939` | Nonessential framing and disabled-border value; semantic aliases remain separate even when they share a primitive      |
| `border-default` | `gray-400`      | `#c6c6c6` | `#444444` | Ordinary boundary only when label, fill, shape, placement, or another sufficient cue already identifies the object     |
| `border-strong`  | `gray-600`      | `#717171` | `#8a8a8a` | Necessary neutral control or graphic boundary that must remain identifiable on every approved opaque surface adjacency |

No Tailwind color, local interpolation, gradient, shadow, or additional gray was
introduced. `border-strong` did not receive focus or automatic selected-state
ownership. The error composition kept chromatic feedback visibly pending.

## Specimen Coverage

| Scene               | Boundary evidence                                                                                                                                       | Decision question                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Surface matrix      | Four roles across `canvas`, `surface`, `sunken`, and `raised`; opaque overlay adjacency is covered in the Overlay scene                                 | Does the intact ladder remain distinct without shifting or mixing primitive values?                                    |
| Music Discovery     | Flat result group, shared list dividers, jacket edges, mixed Korean/Japanese/English identity, long title, and visible text actions                     | Can scan rhythm remain restrained without turning each row into a bordered card?                                       |
| Global Rankings     | Dense header, shared row dividers, long Japanese and mixed-script player names, current-user row, and pagination                                        | Can dense separation remain readable without strong row outlines or an automatic selected border?                      |
| Controls and states | Necessary input, visible-content action, selected, disabled, native checkbox/radio/switch, recoverable error, focus instrumentation, hover/pressed copy | Does semantic ownership distinguish default from strong while preserving native state and non-color cues?              |
| Viewer and overlay  | Viewer/editor well, lane grid, opaque dialog, menu/popover, scrim adjacency, default-versus-strong overlay edge comparison                              | Which edges are truly necessary, and which are already identified by fill, shape, spacing, label, or scrim separation? |

Scene, appearance, width, and text-scale controls are presentation-only. They do
not propose new NosLog product controls.

## Browser Measurement Record — 2026-08-09

### Exact canvas, content, and supplemental text-scale matrix

Two appearances, three requested specimen widths, two text scales, and five scenes
produced `60` combinations.

| Dimension  | Values                                         |
| ---------- | ---------------------------------------------- |
| Appearance | Dark, Light                                    |
| Canvas     | `320px`, `390px`, `768px`                      |
| Text scale | `100%`, `200%` specimen text-scale pressure    |
| Scene      | Matrix, Discovery, Rankings, Controls, Overlay |

| Assertion                                               |         Result |
| ------------------------------------------------------- | -------------: |
| Exact `NB-A` computed primitive values                  | `60 / 60` pass |
| Specimen-frame horizontal overflow                      | `0 / 60` fails |
| Visible content escaping the specimen inline boundary   | `0 / 60` fails |
| Active scene count or scene-selection mismatch          | `0 / 60` fails |
| Controls-scene available target below `44px` CSS height | `0 / 12` fails |

The specimen text-scale control is supplemental content pressure. It was not used
as a substitute for the separate actual browser zoom gate.

### Actual browser-width reflow

The complete five-scene Dark/Light set was also exercised at four browser widths,
producing `40` combinations. Host padding and a vertical scrollbar intentionally
reduce the inner frame at narrow browser widths.

| Browser width | Requested specimen | Observed frame width | Dark/Light × scenes | Result |
| ------------: | -----------------: | -------------------: | ------------------: | ------ |
|       `320px` |            `320px` |              `273px` |                `10` | Pass   |
|       `390px` |            `390px` |              `343px` |                `10` | Pass   |
|       `560px` |            `768px` |        `513px–528px` |                `10` | Pass   |
|      `1280px` |            `768px` |              `768px` |                `10` | Pass   |

Document and specimen horizontal overflow were zero in all forty states. The
`273px` frame provides pressure below the required `320 CSS px` product minimum;
the exact `320px` and representative `390px` specimen canvases were covered by the
sixty-combination matrix above.

### Native keyboard sequence

Chrome native tab order reached the Controls scene in this sequence:

1. labelled search input;
2. visible-content action;
3. selected `aria-pressed="true"` action;
4. native checkbox;
5. native radio;
6. semantic `role="switch"` action;
7. focus-instrumentation action;
8. pressed/hover-content action.

The native disabled action was skipped. No `tabindex` was added. Normal-theme focus
used the browser `outline: auto`; this proves reachability and state semantics, not a
NosLog focus-ring color or geometry.

The expanded fixture's actual-Chrome sequence reached all eight enabled controls in
source order. The native disabled action was not inserted into the sequence, and the
radio and switch retained their native/ARIA state semantics.

### Actual 200% Chrome zoom

Chrome was reset to 100%, then enlarged through the visible browser control to
`200%`. Runtime measurement confirmed `devicePixelRatio` changed from `2` to `4`
and the page CSS viewport changed from `1450px` to `725px`.

At active 200% zoom, `2 appearances × 3 requested canvases × 5 scenes = 30`
combinations were measured.

| Requested canvas | Observed frame at 200% | Dark/Light × scenes | Result |
| ---------------: | ---------------------: | ------------------: | ------ |
|          `320px` |                `320px` |                `10` | Pass   |
|          `390px` |                `390px` |                `10` | Pass   |
|          `768px` |              `685.5px` |                `10` | Pass   |

| Assertion                                |         Result |
| ---------------------------------------- | -------------: |
| Actual zoom remained at `200%` (`DPR 4`) | `30 / 30` pass |
| Document horizontal overflow             | `0 / 30` fails |
| Specimen-frame horizontal overflow       | `0 / 30` fails |

Chrome zoom was restored to 100%, and runtime measurement returned to
`devicePixelRatio: 2` before cleanup.

This thirty-state run was repeated after the explicit radio/switch/menu/popover
fixtures were added. The current expanded specimen passed exact-value, target-size,
visible-escape, specimen-overflow, and document-overflow checks in all `30/30` states.

### Active forced colors

Chrome DevTools Rendering emulation was set to `forced-colors: active`. Runtime
evaluation confirmed `matchMedia('(forced-colors: active)').matches === true`.

| Assertion                                                                                      |         Result |
| ---------------------------------------------------------------------------------------------- | -------------: |
| Expanded Dark/Light Controls and Overlay states at `320/390/768px`                             | `12 / 12` pass |
| Product descendants using `forced-color-adjust: none`                                          |            `0` |
| Native radio, semantic switch, dialog, popover, and menu items replaced by system-owned colors |           Pass |
| Expanded eight-control keyboard sequence skipped disabled and reached later actions            |           Pass |
| Focus instrumentation retained a visible user-agent `auto` outline                             |           Pass |
| Specimen-frame horizontal overflow or visible escape in the twelve measured states             |            `0` |

The active system palette computed black Canvas, white CanvasText/boundaries,
and a visible cyan user-agent focus outline in the tested environment. These colors
were present only while forced colors was active. They are browser/user accessibility
overrides and are not normal Dark-theme `NB-A` candidates.

Emulation was reset to `No emulation`, runtime forced colors returned `false`,
DevTools was closed, and Chrome remained at 100% before cleanup.

The expanded radio, switch, dialog, popover, and menu-item fixtures all computed
`forced-color-adjust: auto`. Their active system colors were identical across the
Dark and Light presentation controls, confirming that the user-agent palette, not
`NB-A`, owned this mode.

## Exact Necessary-Boundary Adjacency

Ratios are exact sRGB contrast between `border-strong` and both sides of every
specimen line whose boundary is treated as the necessary identifying cue.

| Necessary fixture                              | Light inside / outside | Dark inside / outside | Result |
| ---------------------------------------------- | ---------------------: | --------------------: | ------ |
| Input: `canvas` inside, `surface` outside      |          `4.88 / 4.60` |         `5.47 / 4.99` | Pass   |
| Viewer well: `sunken` inside, `canvas` outside |          `4.02 / 4.88` |         `5.47 / 5.47` | Pass   |

Both sides exceed the `3:1` necessary-boundary gate. Other specimen edges did not
claim sole-cue ownership:

- list and ranking dividers are decorative rhythm backed by grouping and spacing;
- jacket and container frames are backed by fill, shape, placement, or content;
- visible-content buttons are identified by readable labels and action placement;
- selected state retains a check mark and `aria-pressed`, not a stronger border;
- native checkbox/radio graphics and semantic switch state retain browser semantics;
  and
- opaque overlay identity is established by fill, shape, and scrim separation, so a
  variable composited scrim is not misreported as a universal necessary-boundary
  adjacency.

The complete all-role/all-surface contrast table remains in document `38` and was
not changed by the specimen.

## Noise and Boxing Review

1. Discovery and Rankings use one outer group frame plus shared row dividers; rows
   are not individually boxed.
2. The current-user ranking does not gain a strong border. Text and semantic context
   carry the state.
3. Necessary `border-strong` is limited to the input and viewer-well examples. It is
   not a generic card or section outline.
4. Controls-scene cards deliberately expose every fixture for comparison. Their
   repeated square frames are instrumentation and must not be copied as a production
   component composition.
5. Overlay default/strong edges remain comparison evidence. This Foundation gate does
   not approve a dialog, popover, or menu component alias.
6. No measured case justified an invented intermediate gray, a Tailwind border, a
   shadow fallback, or a white normal-theme outline.

## Corrections Found During Browser Review

1. The first responsive implementation used viewport media queries for a bounded
   specimen. At a `320px` canvas inside a desktop host, it incorrectly retained the
   two-column layout. The specimen now uses an inline-size container query.
2. The first Dark `320px`/supplemental-200% Rankings pass overflowed on
   `NosLog_Player_대한민국`. The player cell now permits intrinsic shrinkage and
   `overflow-wrap: anywhere`; the repeated Dark and Light matrices then passed.
3. The first instrumentation audit counted hidden scenes and the native `16px`
   checkbox instead of its `44px` labelled target. Measurement now includes only
   rendered scenes and measures the complete checkbox row.

These corrections changed specimen reflow and measurement accuracy. They did not
change any `NB-A`, `M-A`, or `F-A` value.

## Approved Observations

1. `divider` and `border-subtle` remain intentionally quiet in both appearances;
   they work only where structure already communicates the relationship.
2. `border-default` is visible enough for ordinary framing but measurably ineligible
   as the only cue for an otherwise unidentified control.
3. `border-strong` remains neutral and clearly identifiable without producing the
   white-outline effect the user rejected in normal Dark mode.
4. Dense Discovery and Rankings examples remain scannable without row boxing or
   selected-state outlines.
5. The four exact Spectrum steps cover the measured responsibilities without a
   Tailwind value, local hue shift, or additional neutral.

The user accepted this visual direction on 2026-08-09 after reviewing the expanded
specimen. These observations therefore support the approved `NB-A` Foundation
mapping; they do not approve component aliases or production styling.

## User Review and Next Gate

The expanded actual-Chrome 200%, active-forced-colors, and Tab cross-checks completed
without a measured failure. The user accepted `NB-A`; documents `34`, `38`, and `39`
now synchronize that decision, and `C5M-05` is closed.

The next color Foundation gate is `C5M-06`: ordinary neutral interaction and
selection-state mapping. It requires its own broad reference comparison and user
approval. Component aliases, focus, feedback, and automatic selected-state boundary
treatment remain separate gates. `NB-A` approval does not authorize production
implementation or copying the Controls-scene instrumentation into final components.

## Decision and Validation Log

| ID       | Entry                                                                                                                                     | Status                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `C5N-01` | Exercise exact `gray-200/300/400/600` `NB-A` values only, while holding approved `M-A` and `F-A` constant.                                | `Observed specimen rule`                   |
| `C5N-02` | Final Dark/Light canvas, text-scale, and scene matrix passed `60/60` states with exact values and no frame overflow or escape.            | `Observed — 2026-08-09`                    |
| `C5N-03` | Actual browser widths `320/390/560/1280px` passed `40/40` Dark/Light scene states without document or specimen horizontal overflow.       | `Observed — 2026-08-09`                    |
| `C5N-04` | Current expanded actual Chrome 200% zoom passed `30/30` Dark/Light, canvas, and scene states with no document or specimen overflow.       | `Observed — 2026-08-09`                    |
| `C5N-05` | Expanded native Tab order reaches eight enabled controls in source order, including radio and switch, while skipping disabled.            | `Observed — 2026-08-09`                    |
| `C5N-06` | Expanded active forced colors passed `12/12` affected Controls/Overlay states, kept `forced-color-adjust: none` at zero, and was reset.   | `Observed — 2026-08-09`                    |
| `C5N-07` | Every specimen boundary claiming sole-cue ownership uses `border-strong` and exceeds `3:1` against both inside and outside opaque colors. | `Observed — 2026-08-09`                    |
| `C5N-08` | Focus, feedback, error hue, component aliases, radius, elevation, and automatic selected-state boundary remain outside this gate.         | `Approved authority boundary — 2026-08-09` |
| `C5N-09` | The expanded technical rechecks and explicit user visual decision are complete; promote `NB-A` and close `C5M-05`.                        | `Approved — 2026-08-09`                    |
