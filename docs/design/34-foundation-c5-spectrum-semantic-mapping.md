# NosLog 2.0 C5 Spectrum S2 Semantic Mapping

## Document Control

- Status: `M-A surfaces, F-A foregrounds, NB-A neutral boundaries, and NI-A
neutral interaction approved; C5M-03 through C5M-06 closed; focus remains open`
- Surface-mapping approval date: 2026-08-08
- Foreground-mapping approval date: 2026-08-09
- Neutral-boundary approval date: 2026-08-09
- Neutral-interaction approval date: 2026-08-09
- Canonical language: English
- Korean companion:
  [34-foundation-c5-spectrum-semantic-mapping.ko.md](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- Started: 2026-08-08
- Scope: map the approved Spectrum S2 grayscale primitive source to the approved
  NosLog C1-B neutral surface roles and candidate neutral foreground, boundary, and
  ordinary interaction roles
- Inputs: approved documents `25`, `32`, and `33`; current Spectrum S2 token data;
  WCAG 2.2; and the previously reviewed equal-role palette comparison
- Excludes: focus, signature/feedback/domain or data-visualization hues, radius and
  shadow dimensions, final component aliases and geometry, high-fidelity screens,
  and application implementation

This document does not reopen `FCM-12`. Adobe Spectrum S2 remains the approved exact
Dark/Light neutral primitive source. `C5M-03` assigns the approved C1-B surface roles
through the current Spectrum S2 aliases, `C5M-04` assigns the approved exact `F-A`
foreground mapping, `C5M-05` assigns approved exact `NB-A` neutral boundaries, and
`C5M-06` assigns the approved `NI-A` neutral interaction contract. Focus and final
component-level aliases remain open.

## Related Documents

- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.md)
- [Signature color research](./33-foundation-signature-color-research.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.md)
- [C5 neutral foreground reference comparison](./36-foundation-c5-neutral-foreground-reference-comparison.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.md)
- [C5 neutral boundary reference comparison](./38-foundation-c5-neutral-boundary-reference-comparison.md)
- [C5 neutral boundary specimen validation](./39-foundation-c5-neutral-boundary-specimen-validation.md)
- [C5 neutral interaction reference comparison](./40-foundation-c5-neutral-interaction-reference-comparison.md)
- [C5 neutral interaction specimen validation](./41-foundation-c5-neutral-interaction-specimen-validation.md)
- [C5 focus indicator reference comparison](./42-foundation-c5-focus-indicator-reference-comparison.md)
- [C5 focus-indicator visual comparison](./43-foundation-c5-focus-indicator-visual-comparison.md)
- [C5 Fluent focus specimen validation](./44-foundation-c5-fluent-focus-specimen-validation.md)

## Focused Evidence

The broad seventeen-source architecture matrix and ten-system neutral-source review
remain authoritative in document `32`. This focused pass uses current primary Adobe
sources to resolve mapping inside the already approved source family:

| Source                                                                                               | Transferable evidence                                                                                                                       | NosLog use                                                                                    | Limitation                                                                                        |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Spectrum S2 color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/) | Current resolved Light/Dark values for background base, layers, elevated surface, pasteboard, content, disabled, overlay, and state aliases | Primary authority for a mapping described as Spectrum S2 semantic fidelity                    | Spectrum role names do not exactly equal the approved NosLog C1-B spatial inventory               |
| [Spectrum S2 color palette](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/) | Exact approved gray primitive values                                                                                                        | Prevents local hex modification or substitution                                               | A raw scale alone does not assign semantic ownership                                              |
| [Spectrum using color](https://spectrum.adobe.com/page/using-color/)                                 | Background layers are large app-framing regions; use opaque tokens rather than custom colors or transparency                                | Governs layer purpose, opaque surfaces, and the ban on locally synthesized grays              | Some public layer examples describe the broader Spectrum model and differ from current S2 aliases |
| [Spectrum color system](https://spectrum.adobe.com/page/color-system/)                               | Backgrounds, decorative borders, field/control borders, text, icons, and disabled content use deliberately separated gray ranges            | Supports distinct foreground and boundary responsibilities                                    | The page explains Spectrum principles rather than NosLog component requirements                   |
| [Spectrum Web Components styles](https://opensource.adobe.com/spectrum-web-components/tools/styles/) | Spectrum 2 uses separate `tokens-v2` Light/Dark files and stable semantic custom-property names                                             | Confirms invariant semantic authorship with appearance-specific values                        | SWC implementation and component geometry are not adopted                                         |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                            | Normal text requires `4.5:1`; meaningful component/graphic boundaries require `3:1` when they are the necessary cue                         | Sets acceptance thresholds for each actual foreground/background and control-boundary pairing | Does not select the palette or material hierarchy                                                 |

### Current Spectrum S2 aliases relevant to C5

| Spectrum S2 alias                         | Light                  | Dark                   | Published intent                          |
| ----------------------------------------- | ---------------------- | ---------------------- | ----------------------------------------- |
| `background-base-color`                   | `gray-25` · `#ffffff`  | `gray-25` · `#111111`  | Default background base                   |
| `background-layer-1-color`                | `gray-50` · `#f8f8f8`  | `gray-50` · `#1b1b1b`  | First app-framing layer                   |
| `background-layer-2-color`                | `#ffffff`              | `gray-75` · `#222222`  | Second app-framing layer                  |
| `background-elevated-color`               | `#ffffff`              | `#222222`              | Elevated surface                          |
| `background-pasteboard-color`             | `gray-100` · `#e9e9e9` | `gray-25` · `#111111`  | Receding professional editing area        |
| `overlay-color` + `overlay-opacity`       | black at `0.4`         | black at `0.6`         | Modal/background suppression              |
| `neutral-content-color-default`           | `gray-800` · `#292929` | `gray-800` · `#dbdbdb` | Default neutral content                   |
| `neutral-subdued-content-color-default`   | `gray-700` · `#505050` | `gray-700` · `#afafaf` | Subdued neutral content                   |
| `neutral-content-color-hover/down`        | `gray-900` · `#131313` | `gray-900` · `#f2f2f2` | Higher-emphasis interactive content state |
| `disabled-background-color`               | `gray-100` · `#e9e9e9` | `gray-100` · `#2c2c2c` | Disabled component background             |
| `disabled-border-color`                   | `gray-300` · `#dadada` | `gray-300` · `#393939` | Disabled boundary                         |
| `disabled-content-color`                  | `gray-400` · `#c6c6c6` | `gray-400` · `#444444` | Disabled nonessential content             |
| `neutral-subtle-background-color-default` | `gray-100` · `#e9e9e9` | `gray-300` · `#393939` | Low-emphasis neutral state background     |

## Important Correction to the Previous Comparison

The comparison that led to `FCM-12` used exact Spectrum S2 gray primitives, but its
role assignment was explicitly provisional:

- Light used `gray-50` as `canvas` and `gray-25` as `surface`;
- Dark used `gray-25` as `canvas`, `gray-50` as `surface`, and `gray-100` as the
  highest overlay step.

That specimen validly established preference for the Spectrum source ramp. It did not
show the current Spectrum S2 semantic aliases exactly. Treating its temporary mapping
as already approved would collapse the approval gate recorded in `FCM-12`.

## Surface Mapping Alternatives

### `M-A` — Current Spectrum S2 alias fidelity

| NosLog role | Spectrum source                        | Light     | Dark      | Use boundary                                                                                       |
| ----------- | -------------------------------------- | --------- | --------- | -------------------------------------------------------------------------------------------------- |
| `canvas`    | `background-base-color`                | `#ffffff` | `#111111` | Page and shell baseline                                                                            |
| `surface`   | `background-layer-1-color`             | `#f8f8f8` | `#1b1b1b` | Flat grouped content; ordinary cards do not become raised                                          |
| `sunken`    | `background-pasteboard-color`          | `#e9e9e9` | `#111111` | Viewer/editor/data wells that intentionally recede                                                 |
| `raised`    | `background-elevated-color`            | `#ffffff` | `#222222` | Content with real lift, movement, overlap, or separately justified emphasis                        |
| `overlay`   | elevated surface plus overlay boundary | `#ffffff` | `#222222` | Menu, popover, tooltip, sheet, and dialog; surface alone is not sufficient to express top stacking |
| `scrim`     | black `overlay-color`                  | `40%`     | `60%`     | Modality/background suppression only                                                               |

Advantages:

- preserves both exact source values and current Spectrum S2 semantic aliases;
- supplies every approved C1-B spatial role without inventing a neutral;
- keeps Dark depth monotonic and Light hierarchy dependent on framing, boundary, and
  justified shadow rather than arbitrary tinted cards; and
- gives the future implementation the most stable upstream provenance.

Risks and constraints:

- Light `canvas` is white while ordinary `surface` is `#f8f8f8`, the reverse of the
  previous comparison specimen;
- adjacent surface contrast is intentionally subtle and cannot be the only required
  grouping or state cue; and
- `raised` and `overlay` share a fill, so overlay needs boundary, stacking, placement,
  and the later approved shadow contract.

### `M-B` — Previous comparison-specimen continuity

| NosLog role | Light       | Dark        |
| ----------- | ----------- | ----------- |
| `canvas`    | `#f8f8f8`   | `#111111`   |
| `surface`   | `#ffffff`   | `#1b1b1b`   |
| `sunken`    | `#f3f3f3`   | `#111111`   |
| `raised`    | `#ffffff`   | `#222222`   |
| `overlay`   | `#ffffff`   | `#2c2c2c`   |
| `scrim`     | black `40%` | black `60%` |

Advantages:

- matches the visual relationship the user preferred during source selection; and
- makes ordinary Light surfaces white against an off-white page while giving Dark
  overlays one additional value step.

Risks and constraints:

- uses only approved Spectrum primitives but does not preserve current Spectrum S2
  semantic aliases;
- introduces a NosLog-specific Light role reversal and Dark overlay step before real
  content has demonstrated that the deviation is necessary; and
- provides weaker upstream provenance for a decision explicitly motivated by adopting
  a stable renowned reference.

**Approved decision:** use `M-A` as C5-2. `M-B` remains historical comparison evidence
and is rejected as the C5 surface mapping. If `M-A` fails real NosLog content, report
the measured failure before considering a documented deviation.

## Superseded Pre-research Foreground Hypothesis

The foreground table originally recorded here preceded the required broad comparison.
Document `36` now supersedes it as the current research record. Two corrections are
material:

1. Spectrum `gray-900` is published for default interactive content hover/down/focus,
   not as a generic heading or global emphasis color.
2. Spectrum subdued interactive content strengthens from `gray-700` to `gray-800` on
   hover/down/selected; that state relationship should remain intact.

Document `36` initially proposed the exact Spectrum alias mapping `F-A` for a
dedicated foreground specimen. After the measured document `37` specimen, the user
approved its visual direction on 2026-08-08. Actual 200% zoom and active forced-colors
gates completed without a measured failure on 2026-08-09. The user then approved
exact `F-A` as the final C5 foreground mapping and closed `C5M-04` on 2026-08-09.
`gray-600` remains unsuitable as universal tertiary text because it reaches only
`4.02:1` against Light `sunken`, and no current Spectrum content alias gives it that
ownership.

## Approved Neutral Boundary Mapping

| NosLog role      | Spectrum primitive | Light     | Dark      | Contract                                                                                                                     |
| ---------------- | ------------------ | --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `divider`        | `gray-200`         | `#e1e1e1` | `#323232` | Decorative rhythm only; spacing, headings, or structure already express the relationship                                     |
| `border-subtle`  | `gray-300`         | `#dadada` | `#393939` | Nonessential framing and the published disabled-border value; semantic aliases remain separate even when the value is shared |
| `border-default` | `gray-400`         | `#c6c6c6` | `#444444` | Ordinary field/container boundary only when label, fill, shape, placement, or another sufficient cue already identifies it   |
| `border-strong`  | `gray-600`         | `#717171` | `#8a8a8a` | Necessary neutral control or graphic boundary that must remain identifiable on every approved surface                        |

The first three roles intentionally remain below `3:1` against some adjacent
surfaces. They cannot be the only cue for a required control, selected state, or
meaningful graphic. `border-strong` remains above `3:1` on all approved M-A surfaces;
its minimum measured pair is `4.02:1` in Light and `4.61:1` in Dark.

This approved mapping does not inherit the white system outlines observed during active
forced-colors testing as normal Dark-theme styling. Those outlines are browser/user
accessibility overrides. The normal-theme boundary values were approved after the
document `38` comparison and document `39` specimen; focus remains a separate later
decision.

## Approved Ordinary Neutral Interaction Mapping — `NI-A`

1. An ordinary low-emphasis action rests transparent or inherits its approved `M-A`
   surface unless an exact equivalent Spectrum component family specifies another
   composition.
2. Foundation does not publish universal `interaction-bg-hover`,
   `interaction-bg-pressed`, or `selection-bg` values. Those visual aliases remain
   component-owned.
3. A component may adopt an exact Spectrum Stack, Tree, Menu, Table, or other
   equivalent recipe only as a complete mapping of color, opacity, and state. Values
   and states from different component families may not be mixed.
4. Approved `F-A` content states remain in force: default interactive content may
   strengthen to `gray-900`, and subdued interactive content may strengthen to
   `gray-800`. A content change does not authorize a new container fill.
5. Approved `NB-A` boundaries remain in force. Hover or selection does not add a
   white normal-Dark outline or automatically promote a boundary to `border-strong`.
6. Ordinary persistent selection remains neutral and requires a programmatic state
   plus a persistent visible cue such as a checkmark, selected-control indicator,
   current-position marker, or another measured structural cue. A subtle fill is
   supplemental and cannot be the only necessary indicator.
7. Disabled parts may use exact Spectrum aliases: background
   `#e9e9e9/#2c2c2c`, border `#dadada/#393939`, and content
   `#c6c6c6/#444444`. They do not receive hover or pressed states.
8. `opacity-disabled: 0.3` is used only where an exact Spectrum component token
   explicitly delegates to it. Local composition must not compound it over the three
   disabled aliases.
9. Focus, signature/chromatic selection, feedback, motion, final component aliases,
   and component geometry remain separate approval gates.

## Measured Contrast Summary for `M-A`

Values were calculated from the exact sRGB pairs across `canvas`, `surface`,
`sunken`, `raised`, and `overlay`.

| Token use                | Minimum Light ratio | Minimum Dark ratio | Interpretation                                                             |
| ------------------------ | ------------------: | -----------------: | -------------------------------------------------------------------------- |
| `gray-900` emphasis      |             `15.30` |            `14.21` | Strong content contrast                                                    |
| `gray-800` primary       |             `11.98` |            `11.49` | Strong default content contrast                                            |
| `gray-700` secondary     |              `6.64` |             `7.25` | Passes normal-text baseline across all M-A surfaces                        |
| `gray-600`               |              `4.02` |             `4.61` | Not universal normal text; suitable as a measured strong non-text boundary |
| `gray-400` disabled      |              `1.41` |             `1.63` | Disabled/nonessential only                                                 |
| `gray-300` subtle border |              `1.15` |             `1.38` | Decorative boundary only                                                   |
| `gray-200` divider       |              `1.08` |             `1.24` | Decorative rhythm only                                                     |

These ratios do not approve component states. Real adjacency, text size, border
area, artwork, focus, disabled semantics, forced colors, and high contrast still need
the required specimen matrix.

## Surface Review Decision

On 2026-08-08, the user approved `M-A`, current Spectrum S2 alias fidelity, as the C5
neutral surface mapping to carry into measured NosLog specimens. The approved values
are:

1. Light `canvas #ffffff`, `surface #f8f8f8`, `sunken #e9e9e9`, `raised #ffffff`,
   `overlay #ffffff`, and black `40%` scrim;
2. Dark `canvas #111111`, `surface #1b1b1b`, `sunken #111111`, `raised #222222`,
   `overlay #222222`, and black `60%` scrim.

The `C5M-03` surface approval by itself authorized representative guide specimens and
measurement; it did not promote any other role. Foreground was approved separately
through `C5M-04` after documents `36` and `37`, and neutral boundaries through
`C5M-05` after documents `38` and `39`. Ordinary neutral interaction was approved
separately through `C5M-06` after documents `40` and `41`. Focus, signature color,
final component aliases and geometry, and production implementation remain
unapproved.
`M-B` may remain visible only as labeled historical evidence; it is not a fallback
implementation path.

## Neutral Interaction Review Decision

On 2026-08-09, after reviewing the measured document `41` specimen, the user approved
`NI-A` and closed `C5M-06`. The approval fixes Spectrum component-family ownership,
mandatory persistent selection cues, and the exact disabled aliases documented above.
It does not authorize a universal interaction fill, custom focus treatment, signature
or feedback color, motion, final component aliases, or component geometry.

## Decision Log

| ID       | Entry                                                                                                                                                     | Status                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `C5M-01` | Treat current Spectrum S2 color aliases as the primary semantic-mapping authority inside the approved grayscale source.                                   | `Observed`                 |
| `C5M-02` | Treat the previous comparison's role assignment as a provisional source-selection specimen, not an approved semantic map.                                 | `Observed`                 |
| `C5M-03` | Map C1-B surfaces through `M-A`, preserving current Spectrum S2 base/layer/elevated/pasteboard/overlay aliases.                                           | `Approved — 2026-08-08`    |
| `C5M-04` | Decide foreground mapping only after document `36` broad comparison and a dedicated `F-A` specimen; do not treat `gray-900` as generic heading emphasis.  | `Approved — 2026-08-09`    |
| `C5M-05` | Map decorative, subtle, default, and strong boundaries through `gray-200`, `gray-300`, `gray-400`, and `gray-600`.                                        | `Approved — 2026-08-09`    |
| `C5M-06` | Preserve Spectrum component-family ownership for ordinary neutral interaction; require persistent selection cues and exact disabled aliases under `NI-A`. | `Approved — 2026-08-09`    |
| `C5M-07` | Do not mix the older public background-layer table with current Spectrum S2 aliases in one mapping; record any future deviation explicitly.               | `Proposed governance rule` |
| `C5M-08` | Retain `M-B` only as historical source-selection evidence; reject it as the C5 surface mapping and as an automatic fallback.                              | `Rejected — 2026-08-08`    |
