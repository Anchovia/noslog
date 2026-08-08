# NosLog 2.0 C5 Spectrum Surface Validation

## Document Control

- Status: `Measured initial representative specimen — approved M-A surface mapping
retained; foreground and boundary review remains open`
- Canonical language: English
- Korean companion:
  [35-foundation-c5-spectrum-surface-validation.ko.md](./35-foundation-c5-spectrum-surface-validation.ko.md)
- Started: 2026-08-08
- Scope: apply the approved `C5M-03` Spectrum S2 surface mapping to four bounded,
  actual-content NosLog guide fragments and record initial Light/Dark surface behavior
- Inputs: approved documents `27`–`30`, approved surface decision in document `34`,
  exact Spectrum S2 surface aliases, and the approved compact structural outcomes
- Excludes: high-fidelity page design, production component geometry, foreground or
  boundary approval, focus/signature/feedback/domain/data-visualization hues, final
  shadow/radius/elevation recipes, and application implementation

This document tests the approved surface relationships. It does not convert the test
foreground, boundary, radius, or component geometry into Foundation authority.

## Related Documents

- [S1 Discovery structural validation](./27-foundation-s1-discovery-structural-validation.md)
- [S2 Music Detail structural validation](./28-foundation-s2-music-detail-structural-validation.md)
- [S3 Global Rankings structural validation](./29-foundation-s3-global-rankings-structural-validation.md)
- [S4 Chart Viewer structural validation](./30-foundation-s4-chart-viewer-structural-validation.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 neutral foreground reference comparison](./36-foundation-c5-neutral-foreground-reference-comparison.md)

## Authority Boundary

The specimen uses only the approved `M-A` surface values:

| Role      | Light       | Dark        | Approved responsibility                          |
| --------- | ----------- | ----------- | ------------------------------------------------ |
| `canvas`  | `#ffffff`   | `#111111`   | Page and shell baseline                          |
| `surface` | `#f8f8f8`   | `#1b1b1b`   | Flat grouped content and app-framing layer       |
| `sunken`  | `#e9e9e9`   | `#111111`   | Receding viewer, editor, and data wells          |
| `raised`  | `#ffffff`   | `#222222`   | Content with justified lift or attached emphasis |
| `overlay` | `#ffffff`   | `#222222`   | Opaque transient content above a suppressed base |
| `scrim`   | black `40%` | black `60%` | Background suppression; never a content surface  |

The visible content and boundary aliases are the document `34` proposals used as
measurement instrumentation. Their presence in the specimen is not approval of
`C5M-04` or `C5M-05`.

## Representative Fragment Matrix

| Fragment        | Approved structural source | Locale/content pressure                                                                   | Surface question                                                                  |
| --------------- | -------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Music Discovery | S1-A through S1-D          | Korean controls, ordinary and long mixed-script Music identity, repeated difficulty facts | Can flat grouped results remain legible without giving every row a raised card?   |
| Music Detail    | S2 persistent context      | Long Japanese title, three metrics, record trend, translated-title disclosure             | Do flat record, sunken trend, and overlay stacking remain distinct in both modes? |
| Global Rankings | S3 dense dataset           | English controls, Japanese player, long username, current-user row                        | Can a dense surface dataset preserve row rhythm and a neutral current-row cue?    |
| Chart Viewer    | S4 focused player          | Korean renderer failure, fallback copy, attached transport, modal suppression             | Does the sunken renderer, raised transport, scrim, and opaque overlay compose?    |

These are guide fragments, not complete screens. They preserve approved content
relationships while deliberately omitting page-suite polish and unrelated features.

## Initial Surface Assignment

### Music Discovery

- `canvas` owns the page body.
- `surface` owns the shell bar, search field, and one flat result group.
- Repeated result rows remain inside the shared surface and use rhythm/boundary rather
  than becoming individual `raised` cards.
- Jacket placeholders use `sunken` as a bounded test well; this is not approval of the
  future artwork treatment.

### Music Detail

- Identity remains on `canvas`.
- The record summary is one flat `surface` region.
- The recent-record trend is a nested `sunken` data well.
- Translated-title disclosure is an opaque `overlay`, not transparent text over the
  underlying identity.

### Global Rankings

- The dense semantic dataset is one `surface` region.
- Rows share that region rather than becoming peer cards.
- The current-user row retains the approved structural inline-start marker. No
  selected color fill was added.

### Chart Viewer

- The renderer is a `sunken` well.
- The attached transport uses `raised` because it is a distinct control layer bound to
  the renderer; this remains a specimen assignment, not a universal player rule.
- Failure suppression uses the approved scrim over the renderer, then an opaque
  `overlay` for the recovery message and Retry control.

## Browser Measurement Record — 2026-08-08

The interactive specimen exercised four fragments, two appearances, and six host
widths. The host wrapper contributes `32px` of inline padding; explicit `352px` and
`422px` browser widths therefore produced exact `320px` and `390px` specimen frames.

| Browser width | Inner visual width | Specimen frame | Purpose                                       |
| ------------: | -----------------: | -------------: | --------------------------------------------- |
|       `320px` |            `288px` |        `288px` | Pressure below the required product minimum   |
|       `352px` |            `320px` |        `320px` | Exact required compact reflow width           |
|       `360px` |            `328px` |        `328px` | Intermediate compact pressure                 |
|       `422px` |            `390px` |        `390px` | Representative mobile review canvas           |
|       `736px` |            `704px` |        `430px` | Contained fragment in the normal host surface |
|      `1024px` |            `992px` |        `430px` | Contained fragment in a wide host surface     |

`6 widths × 4 fragments × 2 appearances` produced `48` automated combinations.

| Assertion                                                      | Result         |
| -------------------------------------------------------------- | -------------- |
| Document-level horizontal overflow                             | `0 / 48` fails |
| Specimen-frame horizontal overflow                             | `0 / 48` fails |
| Rendered content escaping the specimen inline boundaries       | `0 / 48` fails |
| Visible specimen button or input below `44px` effective height | `0 / 48` fails |
| Scenario or appearance control state mismatch                  | `0 / 48` fails |
| Unhandled browser runtime errors                               | `0`            |

Host Light and Dark appearances were also inspected so the surrounding conversation
surface did not hide a specimen boundary. The product fragment itself remained on the
explicitly selected NosLog appearance.

## Observed Surface Behavior

### Convergence

1. `M-A` preserved a restrained, non-fluorescent hierarchy across sparse identity,
   repeated discovery rows, dense ranking rows, and the Viewer recovery state.
2. Dark `surface #1b1b1b` separated grouped content from `canvas #111111` without
   turning every row into a card. Dark `raised/overlay #222222` supplied one higher
   step without introducing a local neutral.
3. Light `surface #f8f8f8` read as a quiet framing/grouping layer against white
   `canvas`. Light `sunken #e9e9e9` clearly receded for data and renderer wells.
4. Long Japanese and mixed-script identities did not require a different surface map.
5. The dense current-user ranking row remained identifiable through the approved
   structural marker; surface color did not need to carry selection alone.

### Expected equal-value pairs

- Dark `canvas` and `sunken` both resolve to `#111111`. Recession therefore requires
  enclosure, adjacency, geometry, or a boundary; a fill difference cannot be assumed.
- Light `canvas`, `raised`, and `overlay` all resolve to `#ffffff`. Stacking therefore
  requires position, boundary, scrim, and later measured shadow rules where justified.
- Dark `raised` and `overlay` both resolve to `#222222`. An overlay remains a semantic
  and stacking role, not a promise of a unique fill.

These equalities are the approved upstream alias behavior, not missing palette steps.
The specimen did not synthesize another gray to force every role to look different.

## Correction Found During Visual Review

The first Chart Viewer error specimen placed recovery text directly on the scrim over
the renderer. Visual review exposed the semantic error: a scrim suppresses the
background but is not an opaque content surface. The corrected composition keeps the
scrim behind an `overlay` that owns the message and Retry control.

This correction did not change any approved color. It enforces the `scrim` and
`overlay` responsibilities already approved in `C5M-03`.

## Implications for the Next C5 Review

1. Surface colors alone must not identify selection, focus, error, or another required
   state.
2. Equal-value surface pairs are acceptable when semantic ownership, enclosure,
   stacking, and the later approved boundary/elevation contract remain explicit.
3. Foreground review must test text on every actual `M-A` surface plus opaque overlay;
   text directly on a scrim is invalid.
4. Boundary review must distinguish decorative grouping from boundaries that are a
   necessary component or state cue.
5. Document `36` now supplies the required broad foreground comparison. The next unit
   is the proposed `F-A` foreground specimen and adjacency record; `C5M-04` remains
   open until that evidence is reviewed. `C5M-05` boundary mapping follows.

## Decision and Validation Status Log

| ID       | Entry                                                                                                                          | Status                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| `C5S-01` | Use approved `M-A` values without local hue shifts or additional neutral steps in the initial representative fragments.        | `Approved via C5M-03`          |
| `C5S-02` | The 48-combination initial browser matrix passes the recorded overflow, containment, target-height, state, and runtime checks. | `Observed`                     |
| `C5S-03` | Treat Dark canvas/sunken and Light canvas/raised/overlay equalities as intentional alias behavior.                             | `Observed`                     |
| `C5S-04` | A scrim suppresses background only; recovery content requires an opaque overlay above it.                                      | `Approved contract enforced`   |
| `C5S-05` | Preserve neutral structural identification for the current ranking row; do not add a selected hue during surface validation.   | `Observed — prior S3 approval` |
| `C5S-06` | Keep foreground, boundary, radius, shadow, and component geometry shown in the specimen non-authoritative.                     | `Proposed governance`          |
| `C5S-07` | Advance document `36` proposed `F-A` foreground ownership and adjacency measurement as the next C5 evidence unit.              | `Proposed — next review`       |
