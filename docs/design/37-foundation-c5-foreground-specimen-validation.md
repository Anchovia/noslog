# NosLog 2.0 C5 Foreground Specimen Validation

## Document Control

- Status: `F-A visual direction approved — C5M-04 remains open pending actual 200%
browser zoom and active forced-colors verification`
- Visual-direction approval date: 2026-08-08
- Canonical language: English
- Korean companion:
  [37-foundation-c5-foreground-specimen-validation.ko.md](./37-foundation-c5-foreground-specimen-validation.ko.md)
- Started: 2026-08-08
- Scope: apply document `36` proposed `F-A` exact Spectrum S2 foreground aliases to
  approved `M-A` surfaces, representative NosLog content, and ordinary interaction
  states; record browser measurements and corrections before `C5M-04`
- Inputs: approved documents `25`, `32`, `33`, and `35`; corrected mapping research in
  document `36`; exact Spectrum S2 aliases; approved structural specimens; and WCAG
  2.2 contrast criteria
- Excludes: approval of `C5M-04`, boundary and focus mappings, chromatic
  signature/feedback/domain/data-visualization colors, final component geometry,
  high-fidelity screens, and application implementation

The specimen is decision evidence, not a production interface or final Claude Design
screen. All visible boundary, radius, and disabled-surface treatments remain
measurement instrumentation unless separately approved.

## Related Documents

- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.md)
- [C5 neutral foreground reference comparison](./36-foundation-c5-neutral-foreground-reference-comparison.md)

## Authority Boundary

Approved `M-A` surfaces were held constant. The following `F-A` foreground aliases
are approved as the visual direction and remain pending final `C5M-04` technical
validation:

| Responsibility            | Spectrum alias                                        |     Light |      Dark | Specimen use                                                              |
| ------------------------- | ----------------------------------------------------- | --------: | --------: | ------------------------------------------------------------------------- |
| default content           | `neutral-content-color-default` → `gray-800`          | `#292929` | `#dbdbdb` | Headings, body, primary icons, important labels and values                |
| subdued content           | `neutral-subdued-content-color-default` → `gray-700`  | `#505050` | `#afafaf` | Metadata, helpers, timestamps, table headers and secondary icons          |
| default interaction state | `neutral-content-color-hover/down/focus` → `gray-900` | `#131313` | `#f2f2f2` | Default interactive content during hover, pressed and content-focus state |
| subdued interaction state | subdued hover/down/selected → `gray-800`              | `#292929` | `#dbdbdb` | Subdued interactive content during hover, pressed, focus and selected     |
| disabled content          | `disabled-content-color` → `gray-400`                 | `#c6c6c6` | `#444444` | Genuinely unavailable, nonessential controls and icons only               |

`gray-900` was not used for static headings. `gray-600` was not used for text.
Secondary and tertiary semantic responsibilities shared the Spectrum subdued value.

## Specimen Coverage

| Scene           | Content pressure                                                                                                                                      | Foreground question                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Surface matrix  | Default, subdued, and disabled text/icon marks on `canvas`, `surface`, `sunken`, `raised`, and opaque `overlay` in both appearances                   | Do the exact aliases remain readable on every approved adjacency without placing content on a scrim?    |
| Music Discovery | Korean controls, mixed Korean/Japanese/English identity, long title, artist, update time, helper copy, unavailable difficulty and disabled comparison | Can one default and one subdued readable value preserve discovery hierarchy without a third local gray? |
| Global Rankings | English controls, Japanese player, long username, dense headers, current-user row, rank/Grd numerals, timestamp and unavailable pagination            | Can subdued headers and metadata coexist with dense default values without weakening scanning?          |
| States          | Long Japanese identity, Korean/English metadata, helper, empty, recoverable error, default/subdued actions, selected and disabled controls            | Do Spectrum's intact state transitions remain understandable without treating color as the only cue?    |

The scene, appearance, and interaction controls are presentation-only. They do not
propose new NosLog product controls.

## Browser Measurement Record — 2026-08-08

### Responsive and content matrix

Six browser widths, four scenes, and two appearances produced `48` combinations. The
rendering host contributes inline space around the specimen; `352px` and `422px`
browser widths produced exact `320px` and `390px` inner specimen widths.

| Browser width | Inner visual width | Specimen frame | Purpose                                                                                |
| ------------: | -----------------: | -------------: | -------------------------------------------------------------------------------------- |
|       `320px` |            `273px` |        `273px` | Additional pressure below the required product minimum; scrollbar consumption included |
|       `352px` |            `320px` |        `320px` | Exact required compact reflow width                                                    |
|       `360px` |            `328px` |        `328px` | Intermediate compact pressure                                                          |
|       `422px` |            `390px` |        `390px` | Representative mobile review canvas                                                    |
|       `736px` |            `704px` |        `430px` | Contained specimen in the normal host surface                                          |
|      `1024px` |            `992px` |        `430px` | Contained specimen in a wide host surface                                              |

| Assertion                                                   |         Result |
| ----------------------------------------------------------- | -------------: |
| Document horizontal overflow                                | `0 / 48` fails |
| Specimen-frame horizontal overflow                          | `0 / 48` fails |
| Visible content escaping specimen inline boundaries         | `0 / 48` fails |
| Visible specimen button/input below `44px` effective height | `0 / 48` fails |
| Unhandled browser warnings or errors                        |            `0` |

### Interaction-state matrix

The States scene exercised `6 states × 2 appearances = 12` combinations at the exact
`390px` inner specimen width.

| State               | Default content result                                | Subdued content result                                         | Disabled ownership                                      |
| ------------------- | ----------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| Rest                | `gray-800`                                            | `gray-700`                                                     | Dedicated unavailable controls remain `gray-400`        |
| Hover               | `gray-900`                                            | `gray-800`                                                     | Not applied                                             |
| Pressed             | `gray-900`                                            | `gray-800`                                                     | Not applied                                             |
| Focus content state | `gray-900`                                            | `gray-800`                                                     | Focus indicator remains outside C5 foreground authority |
| Selected            | Remains `gray-800` without a universal selected color | Strengthens to `gray-800` and retains `aria-pressed` semantics | Not applied                                             |
| Disabled            | `gray-400`, native control disabled                   | `gray-400`, native control disabled                            | Required information remains outside the control        |

All twelve computed browser values matched the published Spectrum S2 aliases exactly.

### Keyboard sequence

Native tab order reached the product fragment in this sequence:

1. labelled more action;
2. default action;
3. subdued action;
4. data-sync guide action;
5. retry action.

The unavailable control was skipped as expected. No `tabindex` was added. This proves
reachability and disabled semantics, not final focus-ring color or geometry.

### Open technical gates

- The available local browser-control surface did not expose deterministic page-zoom
  or forced-colors emulation. Attempted browser zoom shortcuts did not change the CSS
  viewport or device scale, so no 200% zoom pass is claimed.
- A below-minimum `273px` specimen reflow passed, but this is additional pressure
  evidence and not a substitute for an actual 200% browser-zoom inspection.
- The specimen includes a restrained `@media (forced-colors: active)` fallback and
  allows user-agent color replacement, but active forced-colors behavior was not
  runtime-exercised. `C5M-04` remains open until both checks are completed in a capable
  browser environment.

## Exact Adjacency Record

Ratios use exact sRGB values. The repeated `canvas`/`raised`/`overlay` and
`canvas`/`sunken` values intentionally repeat the approved `M-A` relationships.

### Light

| Foreground                  | Canvas `#fff` | Surface `#f8f8f8` | Sunken `#e9e9e9` | Raised `#fff` | Overlay `#fff` |
| --------------------------- | ------------: | ----------------: | ---------------: | ------------: | -------------: |
| state `gray-900 #131313`    |     `18.58:1` |         `17.50:1` |        `15.30:1` |     `18.58:1` |      `18.58:1` |
| default `gray-800 #292929`  |     `14.55:1` |         `13.70:1` |        `11.98:1` |     `14.55:1` |      `14.55:1` |
| subdued `gray-700 #505050`  |      `8.06:1` |          `7.59:1` |         `6.64:1` |      `8.06:1` |       `8.06:1` |
| disabled `gray-400 #c6c6c6` |      `1.71:1` |          `1.61:1` |         `1.41:1` |      `1.71:1` |       `1.71:1` |

### Dark

| Foreground                  | Canvas `#111` | Surface `#1b1b1b` | Sunken `#111` | Raised `#222` | Overlay `#222` |
| --------------------------- | ------------: | ----------------: | ------------: | ------------: | -------------: |
| state `gray-900 #f2f2f2`    |     `16.87:1` |         `15.39:1` |     `16.87:1` |     `14.21:1` |      `14.21:1` |
| default `gray-800 #dbdbdb`  |     `13.64:1` |         `12.44:1` |     `13.64:1` |     `11.49:1` |      `11.49:1` |
| subdued `gray-700 #afafaf`  |      `8.61:1` |          `7.85:1` |      `8.61:1` |      `7.25:1` |       `7.25:1` |
| disabled `gray-400 #444444` |      `1.94:1` |          `1.77:1` |      `1.94:1` |      `1.63:1` |       `1.63:1` |

Default and subdued pass the normal-text threshold on every adjacency. Disabled is
intentionally non-reading content and cannot own an instruction, reason, current
state, or recovery path.

## Correction Found During Browser Review

The first rendering allowed a general button inheritance selector to outrank the base
subdued-interaction selector. Resting subdued actions therefore resolved to
`gray-800` instead of the required `gray-700` even though the correct variable was
present.

The selector ownership was corrected. The repeated twelve-state browser matrix then
confirmed:

- Dark subdued rest `#afafaf`, Light subdued rest `#505050`;
- subdued hover/pressed/focus/selected strengthens to Dark `#dbdbdb`, Light
  `#292929`; and
- disabled state resolves to Dark `#444444`, Light `#c6c6c6`.

This correction demonstrates why the semantic map must be verified through computed
component values rather than inferred from variable declarations alone.

## Initial Observations

1. Static headings did not require `gray-900`; `gray-800` retained clear hierarchy
   through type size, weight, placement, and spacing in all four scenes.
2. One `gray-700` subdued value remained readable for artist, metadata, helper,
   timestamp, and table-header content in both appearances. No measured hierarchy
   failure required `gray-600` or another system's third level.
3. The subdued-to-default state transition was visible without introducing a new
   color. Selection still required `aria-pressed` or structure rather than color alone.
4. Disabled content was intentionally very faint, especially on Light `sunken` and
   Dark `raised/overlay`. It is acceptable only when the unavailable action is
   nonessential and its reason or recovery path is readable elsewhere.
5. The exact mapping remained restrained across sparse identity, dense rankings,
   empty/error copy, and overlay content. No Tailwind or local neutral was needed.

The user accepted these observations as the visual direction on 2026-08-08. This
acceptance does not replace the remaining technical gates.

## User Review Outcome and Next Gate

The user approved retaining `F-A` as the sole C5 foreground visual direction. Do not
approve `C5M-04` yet.

The remaining technical work is:

1. verify actual 200% browser zoom at mobile and desktop host widths;
2. activate forced-colors/high-contrast mode and inspect semantic reachability,
   current-row structure, disabled states, and native focus indicators; and
3. record any failure before deciding whether `F-A` can be promoted to `Approved`.

Boundary and focus color selection do not begin until this foreground gate is closed.

## Decision and Validation Log

| ID       | Entry                                                                                                                                                              | Status                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `C5V-01` | Exercise only exact `F-A` foreground aliases on approved `M-A` surfaces; do not add a local neutral or heading color.                                              | `Observed specimen rule`                      |
| `C5V-02` | The corrected `48`-combination responsive/content matrix has zero recorded overflow, escape, target-height, or runtime failures.                                   | `Observed`                                    |
| `C5V-03` | The corrected `12`-combination interaction matrix matches Spectrum default, subdued, state, and disabled values exactly.                                           | `Observed`                                    |
| `C5V-04` | Static headings remain on default `gray-800`; `gray-900` remains interaction-state-only.                                                                           | `Approved visual direction — 2026-08-08`      |
| `C5V-05` | Secondary and tertiary semantic responsibilities may continue sharing subdued `gray-700`; no distinct third value is currently justified.                          | `Approved visual direction — 2026-08-08`      |
| `C5V-06` | Disabled `gray-400` is permitted only for genuinely unavailable, nonessential content with readable explanation elsewhere.                                         | `Approved visual contract — 2026-08-08`       |
| `C5V-07` | Computed-value review caught and corrected subdued-rest inheritance from `gray-700` to `gray-800`.                                                                 | `Corrected`                                   |
| `C5V-08` | Treat below-minimum reflow and the declared forced-colors fallback as supplementary evidence, not substitutes for actual 200% zoom and active forced-colors tests. | `Open technical gate`                         |
| `C5V-09` | Keep `C5M-04` open until user visual review and the remaining technical gates are complete.                                                                        | `User review complete — technical gates open` |
| `C5V-10` | Retain exact `F-A` as the sole C5 foreground visual direction without Tailwind, local neutral additions, or another system's values.                               | `Approved — 2026-08-08`                       |
