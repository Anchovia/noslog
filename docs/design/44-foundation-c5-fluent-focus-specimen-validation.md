# NosLog 2.0 C5 — Fluent Focus Specimen Validation

[한국어 companion](44-foundation-c5-fluent-focus-specimen-validation.ko.md)

## Document Control

| Field               | Value                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------- |
| Status              | `Specimen prepared — base matrices pass; native/zoom/forced-colors gates remain open` |
| Date                | `2026-08-09`                                                                          |
| Canonical language  | English                                                                               |
| Decision gate       | `C5F-06` measured validation of user-selected `FI-C`                                  |
| Selected input      | Fluent 2 achromatic `colorStrokeFocus2` polarity                                      |
| Inherited approvals | `M-A` surfaces, `F-A` foregrounds, `NB-A` boundaries, and `NI-A` neutral interaction  |

This document records the first measured validation pass authorized after the user
selected `FI-C` in
[document 43](43-foundation-c5-focus-indicator-visual-comparison.md). It does not
approve a production focus token, final component alias, signature color, feedback
color, component geometry, or application implementation. The C5 focus gate remains
open until the pending runtime gates and user review are complete.

## Authority Boundary

The editable artifact is the
[C5 Fluent focus validation specimen](specimens/c5-fluent-focus-validation.html).
It is a guide fixture, not a production component library or a final Claude Design
screen.

The specimen preserves two upstream responsibilities:

1. approved Spectrum S2 values continue to own neutral surfaces, content, boundaries,
   disabled parts, and ordinary neutral selection; and
2. Fluent 2 owns the selected authored focus direction through
   `colorStrokeFocus2` and the standard web focus-outline helper.

No Tailwind palette, Tailwind ring, Spectrum focus gap, chromatic swatch, gradient,
glow, or cross-system interpolation was introduced. Persistent normal-Dark white
boundaries remain prohibited. White appears in Dark only while the validation harness
marks an element as keyboard-focused or while a static measurement fixture explicitly
shows that state.

## Exact Selected Input

The validation uses the maintained Fluent evidence recorded in document `42` and the
current Fluent UI `createFocusOutlineStyle` source:

- [Fluent 2 web alias color tokens](https://fluent2.microsoft.design/color-tokens2/)
- [Fluent UI `createFocusOutlineStyle`](https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-tabster/src/focus/createFocusOutlineStyle.ts)

| Role or geometry       | Light       | Dark        | Validation mapping                                                                |
| ---------------------- | ----------- | ----------- | --------------------------------------------------------------------------------- |
| `colorStrokeFocus1`    | `#ffffff`   | `#000000`   | Upstream component-owned contrast role; not assigned as a global NosLog primitive |
| `colorStrokeFocus2`    | `#000000`   | `#ffffff`   | Selected normal-theme keyboard-visible focus color                                |
| Outline width          | `2px`       | `2px`       | Exact standard helper width                                                       |
| Pseudo-element extent  | `-2px`      | `-2px`      | Zero-gap perimeter around the focused component                                   |
| Forced-colors override | `Highlight` | `Highlight` | System color remains available; active runtime test is still pending              |

The HTML fixture uses a `data-keyboard-focus` harness attribute to reproduce the
keyboard-modality ownership that Fluent React normally receives through its focus
management layer. The attribute is test instrumentation, not a proposed production
API. Color and geometry remain the exact Fluent inputs above.

## Static Contrast Against Approved `M-A`

Exact sRGB contrast was calculated between the Focus2 color and every unique approved
neutral surface.

| Theme | Adjacent approved surface  | Focus2 color |  Contrast |
| ----- | -------------------------- | ------------ | --------: |
| Light | canvas / raised `#ffffff`  | `#000000`    |    `21:1` |
| Light | surface `#f8f8f8`          | `#000000`    | `19.77:1` |
| Light | sunken `#e9e9e9`           | `#000000`    | `17.30:1` |
| Dark  | canvas / sunken `#111111`  | `#ffffff`    | `18.88:1` |
| Dark  | surface `#1b1b1b`          | `#ffffff`    | `17.22:1` |
| Dark  | raised / overlay `#222222` | `#ffffff`    | `15.91:1` |

Every approved neutral-surface pair exceeds `3:1` by a wide margin. These values do
not by themselves prove clipping, focus order, forced-colors behavior, or visibility
for a control placed directly over arbitrary artwork.

## Specimen Coverage

| Scene             | Representative evidence                                                                        | Question tested                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Components        | Text link, icon button, low-emphasis action, filled action, field wrapper, and menu item       | Does focus remain achromatic without recoloring the component or promoting its normal boundary? |
| State coexistence | Selected, current, structural error, disabled neighbor, dense ranking row, and chart controls  | Do programmatic and persistent non-fill cues survive while focus moves independently?           |
| Surfaces / media  | All unique `M-A` surfaces, a fixed dark-filled control, and a neutral stress-test artwork tile | Does the exact pair remain visible without altering approved neutral inputs?                    |
| Clipping          | Scroll container, sticky header, rounded boundary, and frame-edge safe zones                   | Does the full zero-gap `2px` perimeter remain visible and unobscured?                           |
| Live keyboard     | Skip link, action, input, roving radio menu, mixed-language label, and exit link               | Does keyboard modality own the ring while pointer activation remains undecorated?               |

Error is expressed with `aria-invalid`, an explicit `!` marker, text, and structural
boundary because feedback color remains a later gate. The fixture does not invent a
red error token merely to complete the scene.

## Automated Base Matrix

The final base run covered:

`2 themes × 5 requested canvases × 2 text-pressure scales × 5 scenes = 100 states`.

| Assertion                                             | Result             |
| ----------------------------------------------------- | ------------------ |
| Specimen horizontal overflow                          | `0 / 100` failures |
| Document horizontal overflow                          | `0 / 100` failures |
| Visible content escaping the specimen inline boundary | `0 / 100` failures |
| Active-scene mismatch                                 | `0 / 100` failures |
| Light/Dark Focus2 mismatch                            | `0 / 100` failures |
| Visible demo perimeter not exactly `2px`              | `0 / 100` failures |
| Visible demo pseudo-element extent not exactly `-2px` | `0 / 100` failures |
| Descendant using `forced-color-adjust: none`          | `0`                |

The unconstrained in-app host rendered requested canvases at
`320 / 390 / 560 / 768px`; the requested `1120px` frame was intrinsically constrained
to the available `810px` host area. This is not a failure because the separate wide
viewport run below reached the exact desktop canvas.

### Correction found during the matrix

The initial `320px + 200% + state coexistence` run exposed an `18px` horizontal
overflow in the dense ranking row. The score column attempted to retain a one-line
desktop grid. At `200%` text pressure the row now reflows the score onto a second grid
line. The final matrix has zero overflow in both themes. No focus color, focus
geometry, neutral token, or state meaning changed.

## Actual Browser Viewport Reflow

At normal browser zoom, all five scenes in both themes were exercised at four real
viewport widths:

| Browser CSS width | Requested specimen | Observed frame | Dark/Light × scenes | Result |
| ----------------: | -----------------: | -------------: | ------------------: | ------ |
|           `320px` |            `320px` |        `320px` |                `10` | Pass   |
|           `390px` |            `390px` |        `390px` |                `10` | Pass   |
|           `560px` |            `560px` |        `528px` |                `10` | Pass   |
|          `1280px` |           `1120px` |       `1120px` |                `10` | Pass   |

All `40 / 40` states had zero specimen/document horizontal overflow, zero escaping
content, and exact Focus2 color and geometry. The `560px → 528px` result records
intrinsic reflow after the guide host's inline padding rather than a fabricated
device breakpoint.

## Interaction Evidence Completed

The in-app browser verified the following in both Light and Dark:

1. Pointer activation left the live control with a computed focus pseudo-element
   width of `0px`.
2. Keyboard input changed the harness modality and produced an exact `2px` ring:
   Dark `rgb(255, 255, 255)`, Light `rgb(0, 0, 0)`.
3. `ArrowDown` moved roving focus from the first to the second radio-menu item and
   updated `tabindex="0"` ownership.
4. `Enter` moved `aria-checked="true"` and the visible checkmark to the focused item.
5. Focus did not recolor the menu item, selection fill, text, or neutral boundary.

This confirms the keyboard-modality and composite-state logic available to the
fixture. It does not substitute for browser-default `Tab` traversal.

## Gates Still Open

Three required runtime checks could not be completed in the current session and are
explicitly not reported as passes:

1. **Native `Tab` entry and exit.** The in-app element-level keyboard API does not
   perform browser-default Tab traversal. Chrome Computer Use access was unavailable,
   so skip-link entry, disabled-skip behavior, and composite exit still need a native
   run.
2. **Actual browser 200% zoom.** The `200%` specimen control is a content-pressure
   matrix only. Chrome's real zoom and CSS viewport change remain unmeasured.
3. **Active forced colors.** The fixture contains the Fluent `Highlight` override and
   has zero descendants using `forced-color-adjust: none`, but active runtime
   emulation was unavailable and remains required.

Until these pass, the artifact is ready for inspection but `FI-C` must not be promoted
to an approved production mapping. Any failure must reopen the source decision or a
component-specific Fluent recipe; it may not be hidden by gray tinting, adding a
Spectrum gap, or borrowing another system's inset geometry.

## Decision Record

| ID        | Statement                                                                                                                     | Status                           |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `C5FV-01` | Render the selected Fluent Focus2 pair with the upstream `2px` zero-gap helper and unchanged approved neutral inputs.         | `Completed`                      |
| `C5FV-02` | The corrected 100-state base matrix and 40-state actual-viewport matrix have no overflow, escape, color, or geometry failure. | `Observed — validated`           |
| `C5FV-03` | Pointer activation is undecorated while keyboard modality produces the exact achromatic ring in both themes.                  | `Observed — harness validated`   |
| `C5FV-04` | Roving menu movement and selection ownership coexist with the focus ring.                                                     | `Observed — validated`           |
| `C5FV-05` | Native Tab, actual 200% zoom, and active forced-colors checks remain required before user approval.                           | `Open`                           |
| `C5FV-06` | Production tokens, final component aliases, signature/feedback color, and application implementation remain unapproved.       | `Authority boundary — preserved` |

## User Review Gate

The specimen can now be reviewed visually, but the focus gate is not ready for final
approval. Complete `C5FV-05`, record the measured results in both language versions,
and then ask the user whether `FI-C` should become the approved C5 focus mapping.
