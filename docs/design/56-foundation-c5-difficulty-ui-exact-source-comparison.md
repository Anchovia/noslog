# NosLog 2.0 C5 Difficulty UI Exact-Source Comparison

## Document control

- Status: `Proposed — UI difficulty mapping awaiting user review`
- Canonical language: English
- Korean companion:
  [56-foundation-c5-difficulty-ui-exact-source-comparison.ko.md](./56-foundation-c5-difficulty-ui-exact-source-comparison.ko.md)
- Date: 2026-08-10
- Parent correction:
  [document 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.md)
- Governing viewer decision:
  [document 07, VIEW-07](./07-chart-viewer-page-brief.md)
- Visual evidence:
  [c5-difficulty-ui-source-comparison.html](./specimens/c5-difficulty-ui-source-comparison.html)
- Scope: difficulty markers in repeated-scanning ordinary DOM UI outside the entire
  chart viewer and editor experiences
- Excludes: every viewer/editor page, shell, control, responsive behavior, accessibility
  behavior, PixiJS/WebGL or Canvas-rendered element, geometry, calculation, and editor
  behavior

## Correction record

The superseded first draft incorrectly treated chart-viewer hand colors as an open
Foundation decision. That contradicted approved `VIEW-07`, which keeps the existing
renderers and chart mathematics outside redesign scope, and the user's explicit
2026-08-10 preservation instruction.

The incorrect hand-color comparison and specimen were removed. Existing renderer
values remain exactly as implemented:

- Falling PixiJS renderer: left `0x4fc8dc`, right `0xe85f5d`;
- Full-sheet Canvas renderer and paired DOM legend: left `#62d4e8`, right `#f06b68`.

These are locked implementation constants, not Foundation token candidates. This
document does not evaluate, normalize, remap, or recommend changing them.

## Fixed requirement and remaining question

Eligible repeated-scanning ordinary UI must distinguish Normal, Hard, Expert, and Real
with four different persistent colors. That requirement is approved and is not an open
color-versus-neutral choice. The remaining `13B` question is which exact authoritative
Light/Dark source values and four-role mapping should implement it.

Examples of eligible UI are a music list showing several chart difficulties and a
music-detail difficulty summary. No viewer/editor page or subcomponent is eligible.

## Source filter result

The fifteen independent source groups recorded in document `55` were filtered for
this narrower UI role. Official NOSTALGIA and rhythm-game sources support visible
difficulty name, level, and fixed order. Accessibility sources require redundant
non-color cues. Atlassian, Carbon, and SAP chart palettes remain data-visualization
only and cannot become global difficulty UI. Adobe Spectrum S2 is the only evaluated
maintained source here that publishes a complete, non-deprecated adaptive
green/orange/red/purple `visual-color` family.

This source result does not make the role assignment an upstream Spectrum semantic.
The values are exact source facts, while the Normal/Hard/Expert/Real assignment remains
a proposed NosLog domain alias requiring explicit user approval. This limitation does
not reopen the already approved requirement for four visibly distinct colors. If the
candidate is insufficient, the exact-value research must continue or return to the
user; it must not silently fall back to neutral.

## Exact proposed values

| Difficulty | Spectrum S2 alias     | Light     | Dark      |
| ---------- | --------------------- | --------- | --------- |
| Normal     | `green-visual-color`  | `#0BA45D` | `#068850` |
| Hard       | `orange-visual-color` | `#E86A00` | `#E06400` |
| Expert     | `red-visual-color`    | `#F03823` | `#CD2E1D` |
| Real       | `purple-visual-color` | `#A65CE7` | `#AD69E9` |

No value is sampled, shifted, interpolated, mixed with Tailwind, or taken from the
renderer palette.

## Controlled candidates

| Candidate                          | Recipe                                                                                                     | Benefit                                                                | Risk                                                                                                      | Status                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `DU-D1 · Spectrum adaptive marker` | Exact Spectrum values on a small non-text marker; label, level, fixed order, and neutral selection remain. | Meets the required four-way visual distinction with restrained chroma. | The four-role assignment is a proposed NosLog domain alias, not a published Spectrum difficulty contract. | `Candidate — exact mapping approval pending` |
| `DU-D0 · Neutral pattern/order`    | One neutral family with distinct pattern/order; label, level, fixed order, and neutral selection remain.   | Retained only to show the loss of color scanning.                      | Violates the approved requirement for four different difficulty colors.                                   | `Rejected — distinct colors required`        |

## Hard component boundary

If `DU-D1` is approved, chroma may appear only on the compact difficulty marker in
repeated-scanning ordinary DOM UI outside the viewer/editor. It must not color:

- difficulty text, card background, section, navigation, link, button, selection,
  focus, validation, or feedback;
- any chart viewer/editor page, shell, control, canvas, WebGL output, note, path, hand
  guide, legend, piano, timing guide, or renderer-owned pixel;
- score bands or FAST/SLOW data, which remain `13C`.

Selection remains a neutral boundary and explicit selected label. Color never changes
meaning between selected and unselected states.

## Measured marker contrast

| Marker       | Light on `#FFFFFF` | Dark on `#222222` | Result                        |
| ------------ | -----------------: | ----------------: | ----------------------------- |
| Normal green |           `3.24:1` |          `3.52:1` | Passes `3:1` non-text target  |
| Hard orange  |           `3.23:1` |          `4.54:1` | Passes `3:1` non-text target  |
| Expert red   |           `3.97:1` |          `3.03:1` | Passes; Dark margin is narrow |
| Real purple  |           `3.96:1` |          `4.53:1` | Passes `3:1` non-text target  |

These are marker values, not text colors. All text remains on the approved Spectrum
neutral foreground.

## Browser verification — 2026-08-10

The corrected artifact was verified at actual `1440px`, `390px`, and `320px` CSS
viewports. The page and both candidates had no horizontal overflow. The DOM contained
zero `canvas` or WebGL/rendering elements. Color-off converted every proposed marker
to neutral while difficulty names, levels, order, patterns, and the explicit selected
label remained. The completed run produced no console warning or error.

This verification proves only that the comparison artifact respects the corrected
boundary. It does not test or modify the production chart viewer/editor.

## Decision log

| ID       | Entry                                                                                                                                                                                          | Status                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `DUS-01` | Preserve the existing viewer/editor experiences in their entirety, including pages, controls, responsive and accessibility behavior, renderer output, palettes, mathematics, and editor model. | `Approved correction — 2026-08-10`                         |
| `DUS-02` | Remove the incorrect hand-color exact-source comparison and specimen.                                                                                                                          | `Completed`                                                |
| `DUS-03` | Restrict Package `13B` exact-source review to repeated-scanning ordinary difficulty DOM UI outside the entire viewer/editor.                                                                   | `Approved scope correction`                                |
| `DUS-04` | Retain exact Spectrum adaptive markers as one candidate for the required four-way distinction; the role mapping remains unapproved.                                                            | `Candidate evidence`                                       |
| `DUS-05` | Keep four different difficulty colors and select the exact authoritative Light/Dark values and four-role mapping.                                                                              | `Requirement approved; exact mapping awaiting user review` |
| `DUS-06` | Verify the corrected difficulty-only artifact at desktop, `390px`, and `320px` with zero renderer elements.                                                                                    | `Completed — 2026-08-10`                                   |

## Approval boundary

Four different difficulty colors are approved and reconfirmed; neutral `DU-D0` is
rejected. No exact Light/Dark values or four-role mapping are approved yet. The full
viewer/editor preservation exception is already approved and is not a choice in this
comparison. Package `13B` remains in progress and the fixed management progress remains
`12.5 / 18 = 69%`.
