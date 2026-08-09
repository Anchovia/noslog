# NosLog 2.0 Foundation C5 — Neutral Interaction Specimen Validation

[한국어 companion](41-foundation-c5-neutral-interaction-specimen-validation.ko.md)

## Document Control

| Field               | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Status              | `Approved — NI-A adopted; C5M-06 closed`                 |
| Date                | `2026-08-09`                                             |
| Canonical language  | English                                                  |
| Decision gate       | `C5M-06` neutral interaction behavior                    |
| Approved result     | `NI-A` — preserve Spectrum component-family fidelity     |
| Inherited approvals | `M-A` surfaces, `F-A` foregrounds, and `NB-A` boundaries |

This document records the measured guide-specimen result authorized after the
reference comparison in
[document 40](40-foundation-c5-neutral-interaction-reference-comparison.md). It
does not approve production tokens, final component aliases, component geometry,
signature color, feedback color, motion, or a custom focus treatment.

## Authority Boundary

The tested artifact is
[the C5 neutral interaction specimen](specimens/c5-neutral-interaction-specimen.html).
It is a guide fixture, not a production component library or a final high-fidelity
NosLog page.

The specimen keeps the approved Spectrum S2 neutral source intact and tests the
`NI-A` governance rule:

1. Foundation does not invent one universal hover, pressed, or selected neutral
   fill.
2. Stack/list, Tree, Menu, and Table preserve their equivalent Spectrum state
   recipes as separate families.
3. Ordinary persistent selection remains neutral but must retain a programmatic
   state and a visible non-fill cue.
4. Disabled background, border, and content use their exact Spectrum aliases
   without an ad hoc compounded opacity.
5. Existing `M-A`, `F-A`, and `NB-A` decisions remain fixed while interaction is
   tested.

The over-accented `FCM-11` and `SIG-07` examples remain `Rejected` and were not used
as evidence or targets.

## Exact State Inputs Held by the Specimen

| Family or role         | Light                    | Dark                        | Ownership                                                   |
| ---------------------- | ------------------------ | --------------------------- | ----------------------------------------------------------- |
| Stack/Tree `gray-100`  | `#e9e9e9`                | `#2c2c2c`                   | Stack hover/down/selected rest; Tree hover/neutral selected |
| Stack `gray-200`       | `#e1e1e1`                | `#323232`                   | Selected hover and Spectrum-equivalent keyboard-focus fill  |
| Stack `gray-300`       | `#dadada`                | `#393939`                   | Selected down                                               |
| Menu state color set   | `#e9e9e9`                | `#323232`                   | Menu composition; not a global interaction alias            |
| Table hover            | `rgba(19, 19, 19, 0.07)` | `rgba(242, 242, 242, 0.07)` | Table row only                                              |
| Table down             | `rgba(19, 19, 19, 0.10)` | `rgba(242, 242, 242, 0.10)` | Table row only                                              |
| Table neutral selected | `rgba(41, 41, 41, 0.10)` | `rgba(219, 219, 219, 0.10)` | Table row only                                              |
| Table selected hover   | `rgba(41, 41, 41, 0.15)` | `rgba(219, 219, 219, 0.15)` | Table row only                                              |
| Disabled background    | `#e9e9e9`                | `#2c2c2c`                   | Disabled part                                               |
| Disabled border        | `#dadada`                | `#393939`                   | Disabled part                                               |
| Disabled content       | `#c6c6c6`                | `#444444`                   | Disabled part                                               |

No Tailwind palette value, starter style, gradient, shadow, or synthesized
interpolation was introduced.

## Specimen Coverage

| Scene                | Representative content                                                            | Question tested                                                                                        |
| -------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Component matrix     | Stack, Tree, Menu, and Table state samples                                        | Do the families stay visibly and numerically separate?                                                 |
| Stack / Tree         | Long Japanese music title, Korean metadata, English wrapping case, hierarchy rows | Do pointer and selection states preserve exact family values and persistent cues?                      |
| Menu                 | Single-choice ranking options and one unavailable option                          | Does neutral composition retain checkmark and `aria-checked` ownership?                                |
| Table                | Dense ranking rows, Korean/Japanese/English names, multi-selection checkboxes     | Do alpha overlays remain Table-owned and reflow without horizontal scrolling?                          |
| Selection / Disabled | Rejected fill-only comparison, valid current item, disabled and available actions | Is fill-only selection rejected while exact disabled aliases remain distinguishable from low emphasis? |

## Corrections Found During Validation

Browser testing found and corrected four specimen defects before the final run:

1. The initial `hover: none` rule incorrectly reassigned a selected Table row to
   Stack `gray-100`. It now preserves `--table-selected`.
2. A Stack item changed `aria-pressed` when activated but its trailing level number
   did not change to a persistent checkmark. Every Stack item now swaps its rest
   marker for `✓` whenever `aria-pressed="true"`.
3. Narrow host chrome and a conventional scrollbar reduced the supposedly exact
   review canvas. The guide host now removes its own inline padding at compact
   widths and hides only its review scrollbar, producing exact `320px` and `390px`
   frames while preserving scrolling.
4. Pointer-down instrumentation now records the rendered down color after applying
   a temporary pointer-down state. It is audit instrumentation, not a production
   interaction requirement.

These corrections did not change any approved neutral primitive or semantic role.

## Automated Frame Matrix

The final static matrix covered:

`2 themes × 3 requested canvases × 2 text scales × 5 scenes = 60 states`.

| Assertion                                        |                               Result |
| ------------------------------------------------ | -----------------------------------: |
| Exact frame widths at unconstrained desktop host |                  `320 / 390 / 768px` |
| Specimen horizontal overflow                     |                    `0 / 60` failures |
| Document horizontal overflow                     |                    `0 / 60` failures |
| Visible content escaping the frame               |                    `0 / 60` failures |
| Active-scene mismatch                            |                    `0 / 60` failures |
| Available hit area below `44px` CSS height       | `0 / 48` measured interactive scenes |
| Light/Dark state-variable mismatch               |                    `0 / 60` failures |

The native Table checkbox is visually `18px`, but its associated clickable
`<label class="choice">` is `44 × 44px`; target measurement therefore uses the
label hit area rather than the internal glyph.

The specimen's `Text 200%` control is supplemental content pressure. It did not
replace the separate actual Chrome zoom test.

## Actual Chrome Width Reflow

At normal Chrome zoom, the complete Dark/Light five-scene set was exercised at four
browser widths:

| Browser CSS width | Requested specimen | Observed frame | Dark/Light × scenes | Result |
| ----------------: | -----------------: | -------------: | ------------------: | ------ |
|           `320px` |            `320px` |        `320px` |                `10` | Pass   |
|           `390px` |            `390px` |        `390px` |                `10` | Pass   |
|           `560px` |            `768px` |        `528px` |                `10` | Pass   |
|          `1280px` |            `768px` |        `768px` |                `10` | Pass   |

All `40 / 40` states had zero document or specimen horizontal overflow. The
`560px` result demonstrates intrinsic reflow when the requested wide canvas is
larger than the available content area.

## Pointer-State Measurements

Actual pointer movement and activation were measured in both themes.

| State                         | Light computed result    | Dark computed result        | Result |
| ----------------------------- | ------------------------ | --------------------------- | ------ |
| Stack unselected hover/down   | `rgb(233, 233, 233)`     | `rgb(44, 44, 44)`           | Pass   |
| Stack selected hover          | `rgb(225, 225, 225)`     | `rgb(50, 50, 50)`           | Pass   |
| Stack selected down           | `rgb(218, 218, 218)`     | `rgb(57, 57, 57)`           | Pass   |
| Tree hover / neutral selected | `#e9e9e9` family input   | `rgb(44, 44, 44)` observed  | Pass   |
| Menu default/hover/down input | `rgb(233, 233, 233)`     | `rgb(50, 50, 50)`           | Pass   |
| Table hover                   | `rgba(19, 19, 19, 0.07)` | `rgba(242, 242, 242, 0.07)` | Pass   |
| Table down                    | `rgba(19, 19, 19, 0.10)` | `rgba(242, 242, 242, 0.10)` | Pass   |
| Table selected hover          | `rgba(41, 41, 41, 0.15)` | `rgba(219, 219, 219, 0.15)` | Pass   |

The tests confirm why the families cannot be flattened into one Foundation ladder:
Dark Stack hover is `#2c2c2c`, Dark Menu uses `#323232`, and Table uses translucent
overlays whose foreground primitive also changes by theme.

## Persistent Selection and Disabled Ownership

### Programmatic and visible selection

| Fixture                       | Programmatic state                                       | Persistent non-fill cue              | Result                |
| ----------------------------- | -------------------------------------------------------- | ------------------------------------ | --------------------- |
| Stack item                    | `aria-pressed` toggles on activation                     | Trailing level swaps to `✓`          | Pass after correction |
| Tree item                     | `aria-selected="true"`                                   | Persistent `✓` marker                | Pass                  |
| Menu item                     | Exclusive `aria-checked` update                          | Checkmark moves with selected option | Pass                  |
| Table row                     | Native checkbox plus row `data-selected` synchronization | Native checked control               | Pass                  |
| Valid current item            | `aria-current="page"`                                    | Checkmark and hidden selected text   | Pass                  |
| Rejected fill-only comparison | `aria-hidden="true"` and `inert`                         | Intentionally absent                 | Correctly excluded    |

Document 40 measured the subtle neutral fills at no more than `1.49:1` against their
adjacent approved surfaces. They are useful supplemental feedback but cannot carry
persistent selection meaning alone. The valid fixtures remain identifiable when the
fill is absent or replaced by a user-agent palette.

### Disabled computation

| Theme | Background           | Border               | Content              | Native disabled | Result |
| ----- | -------------------- | -------------------- | -------------------- | --------------- | ------ |
| Light | `rgb(233, 233, 233)` | `rgb(218, 218, 218)` | `rgb(198, 198, 198)` | `true`          | Pass   |
| Dark  | `rgb(44, 44, 44)`    | `rgb(57, 57, 57)`    | `rgb(68, 68, 68)`    | `true`          | Pass   |

The disabled action has no hover or pressed behavior. A separate readable helper
explains why it is unavailable, while the adjacent low-emphasis action remains
enabled and readable.

## Native Keyboard Verification

Chrome native keyboard operation produced these results:

1. Stack `Enter` updated `aria-pressed` and the checkmark; `Tab` moved to the next
   Stack button.
2. Menu `Enter` moved exclusive `aria-checked="true"` and the checkmark to the chosen
   option. `Tab` exited after the final enabled option and skipped the native disabled
   option.
3. Table `Space` updated the native checkbox and synchronized the row selected state.
4. From the `Selection / Disabled` scene control, the next `Tab` skipped the disabled
   action and reached `데이터 연동 방법 보기`.

Normal-theme focus retained Chrome's user-agent `outline: auto`, measured as a
`1px` `rgb(153, 200, 255)` outline in the tested Dark scene. This proves
reachability; it does not approve a NosLog focus color or geometry. Menu arrow-key
behavior, Tree roving focus, and final component keyboard contracts remain later
component gates.

## Actual 200% Chrome Zoom

Chrome was changed through its visible browser zoom control from `100%` to `200%`.
Runtime measurement confirmed:

- `devicePixelRatio: 2 → 4`;
- page CSS viewport: `1450px → 725px`.

At active 200% zoom:

`2 themes × 3 requested canvases × 5 scenes = 30 states`.

| Requested canvas | Observed frame at 200% | Dark/Light × scenes | Result |
| ---------------: | ---------------------: | ------------------: | ------ |
|          `320px` |                `320px` |                `10` | Pass   |
|          `390px` |                `390px` |                `10` | Pass   |
|          `768px` |                `693px` |                `10` | Pass   |

All `30 / 30` states retained `DPR 4`, one active scene, minimum `44px` hit areas,
and zero specimen or document horizontal overflow. Chrome was restored to `100%`,
and runtime returned to `DPR 2` before cleanup.

## Touch / No-Hover Emulation

Chrome DevTools responsive device emulation was exercised at actual `320px` and
`390px` CSS widths. Runtime confirmed in both cases:

- `(hover: none) === true`;
- `(pointer: coarse) === true`;
- `(pointer: fine) === false`.

The complete Dark/Light five-scene set produced `20 / 20` passes with zero horizontal
overflow and no available target below `44px`. Under no-hover composition:

- a selected Dark Stack item retained `rgb(44, 44, 44)`, `aria-pressed="true"`, and
  its visible checkmark;
- a selected Dark Table row retained the Table-owned
  `rgba(219, 219, 219, 0.10)` overlay, native checkbox, and selected state;
- Menu selection retained its checkmark and `aria-checked` state.

This confirms that removing hover-only feedback does not erase persistent selection
or cross-assign Stack color to Table. Device emulation was disabled after the test.

## Active Forced Colors

Chrome DevTools Rendering emulation was set to `forced-colors: active`, and runtime
confirmed the media query was active.

`2 themes × 3 requested canvases × 5 scenes = 30 states` were measured.

| Assertion                                         |                               Result |
| ------------------------------------------------- | -----------------------------------: |
| Runtime `forced-colors: active`                   |                       `30 / 30` pass |
| Descendants using `forced-color-adjust: none`     |                                  `0` |
| Specimen or document horizontal overflow          |                    `0 / 30` failures |
| Available target below `44px`                     | `0 / 24` measured interactive scenes |
| Programmatic selected/disabled semantics retained |                                 Pass |

The active system palette computed black Canvas, white CanvasText/boundaries, and a
visible cyan user-agent focus outline
`rgba(26, 235, 255, 0.8) auto 1px`. These are browser/user accessibility overrides,
not normal Dark-theme interaction or boundary candidates.

Forced-colors emulation was reset to `No emulation`, device emulation was disabled,
DevTools was closed, and final runtime measurement returned to `DPR 2`,
`forced-colors: false`, `(hover: hover)`, and `(pointer: fine)`.

## Validation Result

The specimen technically supports `NI-A`:

1. exact Spectrum S2 neutral values survived Light/Dark, width, zoom, pointer,
   keyboard, no-hover/coarse-pointer, and forced-colors testing;
2. component families remained separate instead of becoming a fabricated global
   state palette;
3. persistent selection no longer depends on subtle fill alone;
4. disabled roles use exact source aliases without compounded opacity;
5. normal Dark interaction adds no white static outline or automatic strong border;
6. existing `M-A`, `F-A`, and `NB-A` contracts remain unchanged.

On 2026-08-09, after reviewing this measured specimen, the user approved `NI-A`.
The technical result and user decision finalize `C5M-06` only. They do not approve
the later gates listed below.

## Remaining Gates

The following remain explicitly unresolved:

1. focus-indicator color and geometry;
2. signature/chromatic selection and domain accents;
3. error, warning, success, and informational feedback colors;
4. motion and transition behavior;
5. final component aliases, geometry, Menu arrow behavior, Tree roving focus, and
   production implementation mapping.

No broad page design or production implementation is authorized by this specimen.

## Decision Log

| ID       | Entry                                                                                                          | Status                                |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `C5V-01` | Exact Spectrum component-family interaction inputs passed the measured specimen matrix.                        | `Observed — validated`                |
| `C5V-02` | Stack, Tree, Menu, and Table must remain separate recipes; no universal neutral interaction fill is justified. | `Approved under NI-A — 2026-08-09`    |
| `C5V-03` | Persistent ordinary selection requires programmatic state plus a non-fill visible cue.                         | `Approved under NI-A — 2026-08-09`    |
| `C5V-04` | Exact disabled background, border, and content aliases work without ad hoc compounded opacity.                 | `Approved under NI-A — 2026-08-09`    |
| `C5V-05` | Normal Dark interaction must not add a white static outline or automatic strong border.                        | `Inherited approved rule — preserved` |
| `C5V-06` | The user visually reviewed this specimen and approved `NI-A`.                                                  | `Approved — 2026-08-09`               |
| `C5V-07` | Record the decision in documents 34, 40, and 41 and their Korean companions.                                   | `Closed — recorded`                   |

## Approval Record

On 2026-08-09, the user approved `NI-A` as the NosLog 2.0 Foundation rule for neutral
interaction behavior, including exact component-family ownership and mandatory
persistent selection cues. Focus, signature color, feedback, motion, and final
component aliases remain in later gates.
