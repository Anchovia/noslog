# NosLog 2.0 Foundation Motion Source Comparison

## Document control

- Status: `Approved — MO-02 Atlassian; Block 3 complete`
- Canonical language: English
- Korean companion:
  [61-foundation-motion-source-comparison.ko.md](./61-foundation-motion-source-comparison.ko.md)
- Date: 2026-08-10
- Scope: ordinary NosLog 2.0 interface motion only
- Excluded: the entire locked chart viewer/editor, renderer timing, transport,
  metronome, note movement, editor motion, and final production implementation
- Specimen:
  [foundation-motion-source-comparison.html](./specimens/foundation-motion-source-comparison.html)

## Approved decision

`MO-02 · Atlassian` is the approved and exclusive duration/easing source and semantic
ordinary-UI motion mapping for NosLog 2.0. Every nonessential spatial motion becomes
instant under reduced motion, while state meaning remains visible without animation.
Spectrum `130ms` timing and values from the other compared systems are not mixed into
the approved contract.

This is one decision inside `Block 3 · Motion`. Research, the controlled comparison,
reduced-motion validation, bilingual consolidation, and the later approval do not
create additional top-level work.

## Locked boundary

The existing chart viewer and chart editor are not motion candidates. Their pages,
shell, controls, renderer and transport timing, note animation, geometry, and editor
behavior remain unchanged. No value in this comparison applies to them.

## Current ordinary-UI evidence

A read-only repository scan, excluding both locked `chart-pattern` trees, found:

| Existing mechanism                | Count | Observation                                                                            |
| --------------------------------- | ----: | -------------------------------------------------------------------------------------- |
| `transition-colors`               |    95 | Most inherit the framework default because no authored duration/easing role is named.  |
| `transition-transform`            |    17 | Disclosure chevrons and switch-like controls share no documented semantic mapping.     |
| `transition-opacity`              |     5 | Pending and visibility feedback are not tied to one motion contract.                   |
| `animate-spin`                    |     3 | Eligible loading indicators need a static reduced-motion alternative and visible text. |
| Explicit duration                 |     2 | One `150ms` and one `200ms`; these do not form a system.                               |
| Explicit easing                   |     2 | Both use `ease-out`; role ownership is undocumented.                                   |
| Explicit `motion-reduce` handling |     1 | Coverage is not sufficient for a global reduced-motion contract.                       |

These values are functional inventory, not Foundation authority. In particular,
Tailwind's implicit `150ms ease` default is not a candidate merely because many
current classes inherit it.

## Authoritative and production reference matrix

Fourteen independent external authorities were reviewed. Exact-value systems inform
the controlled candidates; principle-only sources constrain every candidate.

|   # | Source                                                                                                                                        | Transferable evidence                                                                                                       | NosLog application and limitation                                                                                           |
| --: | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
|   1 | [W3C WCAG 2.2 — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)                    | Nonessential interaction-triggered motion can be disabled; essential meaning must remain.                                   | Governs the reduced contract, not token values.                                                                             |
|   2 | [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)         | The widely available media feature can remove, reduce, or replace motion.                                                   | Defines the Web mechanism; it does not choose visual character.                                                             |
|   3 | [Apple HIG — Motion and Accessibility](https://developer.apple.com/design/human-interface-guidelines/motion)                                  | Motion is purposeful, brief, cancellable, and optional; reduced motion replaces axis movement with restrained alternatives. | Strong comfort constraint; native Apple timing is not a Web token source.                                                   |
|   4 | [Adobe Spectrum — Motion](https://spectrum.adobe.com/page/motion/)                                                                            | Exact 130–500ms scale; enter, exit, and move curves; micro/macro split.                                                     | Exact candidate. Spectrum 1 motion guidance is mature, but its reduced mapping is less explicit than newer systems.         |
|   5 | [Material Components — Motion theming](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) | Exact semantic standard/emphasized curves and 50–1000ms durations.                                                          | Exact candidate; broad scale and expressive patterns exceed NosLog's routine needs.                                         |
|   6 | [IBM Carbon — Motion](https://v10.carbondesignsystem.com/guidelines/motion/overview/)                                                         | Exact productive entrance/standard/exit curves and 70–700ms scale; static alternatives.                                     | Exact candidate; expressive motion is intentionally not advanced for routine NosLog UI.                                     |
|   7 | [Microsoft Fluent 2 — Motion](https://fluent2.microsoft.design/motion)                                                                        | Short natural motion, constrained focal area, no-motion setting, and ARIA alternatives.                                     | Confirms restraint and accessibility; the public page is less token-specific than the finalists.                            |
|   8 | [Atlassian Design System — Motion](https://atlassian.design/foundations/motion)                                                               | Exact 0–600ms duration roles, four exact curves, semantic component bundles, and instant reduced mode.                      | Exact candidate with the clearest ordinary productivity mapping.                                                            |
|   9 | [SAP Fiori — Motion Design](https://experience.sap.com/fiori-design-web/explore_category/foundation/)                                         | Immediate, small, large, and continuous classes; exact curves; dialog 150ms enter/50ms exit.                                | Exact comparison candidate; ranges are broader than a compact token set.                                                    |
|  10 | [Shopify Polaris — Motion tokens](https://polaris-react.shopify.com/tokens/motion)                                                            | Exact 0–500ms scale plus linear/ease/ease-in/out/in-out curves.                                                             | Exact candidate; base tokens require more NosLog-authored semantic assignment.                                              |
|  11 | [GitLab Pajamas — Animation fundamentals](https://design.gitlab.com/product-foundations/animation-fundamentals/)                              | Purposeful and optional motion, exact default/out-cubic easing, and reduced-motion requirement.                             | Confirms restraint; duration guidance is incomplete, so it is evidence rather than a finalist.                              |
|  12 | [GitHub Primer — Motion and animation](https://primer.style/accessibility/design-guidance/motion-and-animation/)                              | Put motion behind `no-preference`, keep micro motion contained, and provide text alternatives.                              | Strong reduced-motion and documentation constraint; not a complete visual token source.                                     |
|  13 | [Ant Design — Motion](https://ant.design/docs/spec/motion)                                                                                    | Enterprise motion should be natural, performant, concise, and minimally timed.                                              | Useful productivity convergence; not selected as a finalist because current public semantic timing is component-fragmented. |
|  14 | [KDE HIG — Accessibility](https://develop.kde.org/hig/accessibility/)                                                                         | With animations globally disabled, transitions become instant and spinners become static images.                            | Confirms that zero-motion validation is a first-class acceptance state.                                                     |

### Convergence

- Motion must explain state, continuity, hierarchy, or progress; decoration alone is
  not a valid purpose.
- Frequent input feedback stays near-instant, while larger entrances may be longer.
- Entrance typically decelerates, exit accelerates and completes faster, and in-place
  repositioning uses a balanced curve.
- Focus, error, selected state, busy state, completion, and exact values cannot wait
  for motion or depend on it.
- Reduced motion removes nonessential transform, scale, parallax, stagger, and
  auto-moving decoration. Static text, state, structure, and programmatic semantics
  remain.
- Loading that continues indefinitely needs visible text or an equivalent static cue;
  the spinner is supplemental.

### Meaningful disagreement

- Token scales range from Carbon's compact six values to Material's sixteen values.
- Spectrum and Carbon frame motion by physical size and distance; Atlassian adds
  semantic component bundles and frequency; Polaris supplies a broad base scale but
  less semantic assignment.
- Some systems permit expressive or spring motion. NosLog has no approved ordinary-UI
  requirement for bounce, overshoot, celebration, parallax, or page choreography, so
  those roles are not advanced.

## Controlled exact-source candidates

The specimen uses the same NosLog filter, disclosure, popup, dialog, result update,
and loading content. Neutral color, geometry, typography, and focus remain fixed;
only motion source values change.

| ID      | Source                | Hover / persistent selection | Small enter / exit | Modal enter / exit | Exact easing family                                                                                       | Reduced mode                                                           |
| ------- | --------------------- | ---------------------------- | ------------------ | ------------------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `MO-01` | Adobe Spectrum        | `130/130ms`                  | `190/160ms`        | `250/190ms`        | out `(0,0,.4,1)`, in `(.5,0,1,1)`, in-out `(.45,0,.4,1)`                                                  | NosLog mapping makes spatial motion instant; static meaning remains.   |
| `MO-02` | Atlassian             | `50/150ms`                   | `150/100ms`        | `250/200ms`        | out practical `(.4,1,.6,1)`, out bold `(0,.4,0,1)`, in practical `(.6,0,.8,.6)`, in-out bold `(.4,0,0,1)` | Official guidance: motion off and instant.                             |
| `MO-03` | IBM Carbon productive | `70/110ms`                   | `150/110ms`        | `240/150ms`        | entrance `(0,0,.38,.9)`, standard `(.2,0,.38,.9)`, exit `(.2,0,1,.9)`                                     | Static equivalent; all state remains.                                  |
| `MO-04` | Shopify Polaris       | `100/100ms`                  | `200/150ms`        | `250/200ms`        | ease `(.25,.1,.25,1)`, out `(.19,.91,.38,1)`, in `(.42,0,1,1)`, in-out `(.42,0,.58,1)`                    | `duration-0`; static meaning remains.                                  |
| `MO-05` | Material standard     | `100/100ms`                  | `200/150ms`        | `300/250ms`        | standard `(.2,0,0,1)`, decelerate `(0,0,0,1)`, accelerate `(.3,0,1,1)`                                    | NosLog mapping removes spatial/scale motion and keeps immediate state. |
| `MO-06` | SAP Fiori             | `100/100ms`                  | `200/100ms`        | `150/50ms`         | out `(0,0,.35,1)`, in `(.65,0,1,1)`, in-out `(.5,0,.5,1)`                                                 | NosLog mapping makes movement instant; static meaning remains.         |

The candidate mappings do not mix values across systems. Where an upstream source
publishes only base tokens or ranges, the table marks the NosLog semantic assignment
as a proposal rather than pretending it is an upstream component alias.

## Evaluation

| Candidate                   | Strength                                                                                                                                                                    | Material risk                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `MO-01 · Spectrum`          | Restrained, familiar scale and exact curves; shares the approved neutral system's provenance.                                                                               | Ten durations are more than ordinary NosLog needs and reduced behavior needs a NosLog semantic layer.                          |
| `MO-02 · Atlassian`         | Best semantic fit: `50ms` hover, `150ms` persistent interaction highlight, popup, modal, entry/exit asymmetry, accessibility timing, and instant reduced mode are explicit. | Bold entrance easing is visibly quicker at the start than Spectrum/Polaris and must remain limited to actual entrances.        |
| `MO-03 · Carbon productive` | Smallest efficient scale and strong productive/expressive separation.                                                                                                       | `70ms` micro feedback can be almost imperceptible on some mobile displays; Carbon's optional expressive branch is unnecessary. |
| `MO-04 · Polaris`           | Calm, conventional curves and easy implementation.                                                                                                                          | Base tokens do not supply enough semantic ownership; more behavior would be invented by NosLog.                                |
| `MO-05 · Material`          | Complete exact token family and strong enter/exit semantics.                                                                                                                | Large scale and emphasized/spring vocabulary invite more expression and token surface than this information product needs.     |
| `MO-06 · SAP Fiori`         | Clear immediate/small/large ranges and very fast dialog exit.                                                                                                               | Ranges and the 50ms dialog exit are less cohesive as a reusable Web contract than Atlassian or Carbon.                         |

## Approved source and contract

`MO-02 · Atlassian` is approved as the ordinary-UI motion source. It publishes the
closest semantic roles to the actual NosLog inventory, keeps repeated feedback at
50–150ms, distinguishes entry and exit, moves focus and announcements immediately,
explicitly makes reduced motion instant, and does not require an expressive spring or
celebration layer.

The approved lean contract is:

1. `instant 0ms` for focus, error, critical status, and reduced-motion state changes;
2. `xxshort 50ms` + `out.practical` for routine high-frequency hover feedback;
3. `xshort 100ms` + `out.practical` for subtle pressed feedback, or
   `in.practical` for quick exits;
4. `short 150ms` + `out.practical` for persistent selection/emphasized interaction
   highlights and, with `out.bold`, popup/disclosure entrance;
5. `medium 200ms` + `in.practical` for modal/large exit;
6. `long 250ms` + `inout.bold` for modal entrance or in-place scale/reposition only;
7. `xlong 400ms` is a ceiling for a proven large ordinary transition, not a default;
8. `xxlong 600ms`, stagger, bounce, celebration, and page choreography remain
   unassigned unless a later user-approved product need reopens them.

## Approved reduced-motion contract

- Implement default motion inside `@media (prefers-reduced-motion: no-preference)` or
  override it explicitly under `reduce`; do not assume animation is available.
- Under `reduce`, set nonessential translate, scale, rotate, parallax, stagger, and
  auto-scrolling motion to `0ms`/none. Do not merely slow it down.
- Apply focus, selection, errors, busy semantics, and screen-reader announcements at
  state start, never after a transition finishes.
- A loading spinner becomes a static progress glyph with persistent localized busy
  text and `aria-busy`; known progress uses the exact value.
- Content geometry is reserved before asynchronous replacement so removing motion
  does not create layout jumps.
- No reduced-motion rule changes renderer timing because the entire viewer/editor is
  outside this contract.

## Completed controlled-specimen validation

- At `1280×720`, all six candidates render in two columns with their exact authored
  duration variables and no horizontal page overflow.
- At `320px` and `390px`, the comparison reflows to one column without page or body
  overflow in Korean, Japanese, and English.
- Forced reduced mode computes popup and dialog transition durations as `0s`, stops
  spinner animation (`animation-name: none`), and preserves localized busy text plus
  `aria-busy="true"`.
- Dialog activation moves focus immediately to the visible Close control; dismissal
  returns it to the originating Sync-guide control. The same focus behavior works in
  the `320px` and reduced `390px` fixtures.
- Actual keyboard traversal preserves the approved focus treatment: black `2px` in
  Light and white `2px` in Dark with a `-2px` outer extent.
- The specimen changes no production component, dependency, viewer/editor file, or
  renderer behavior.

[Open the responsive validation harness](./specimens/foundation-motion-responsive-validation.html).

## Selected-source validation and Block 3 closeout

- The user explicitly selected `MO-02 · Atlassian` after reviewing all six controlled
  candidates and the corrected `50ms` hover / `150ms` persistent-selection mapping.
- The selected source was re-checked at desktop, `320px`, and `390px` in Korean,
  Japanese, and English across Light/Dark and default/reduced states. Its authored
  variables remain `50/150/150/100/250/200ms`, with no horizontal overflow.
- Forced reduced mode computes all six selected duration roles as `0s`, removes
  spinner animation, and preserves localized busy text, `aria-busy`, immediate dialog
  focus, focus return, and visible state.
- This bilingual document, `AGENTS.md`, `README.md`, document `57`, and the specimen
  now record the same approved authority. Block `3 · Motion` is complete; only blocks
  `4`–`6` remain.

## Decision log

| ID       | Entry                                                                                                                                                           | Status                               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `MOT-01` | Keep the entire chart viewer/editor outside Block 3 motion authority.                                                                                           | `Approved scope boundary`            |
| `MOT-02` | Treat current Tailwind-inherited transition defaults as inventory, not design authority.                                                                        | `Observed`                           |
| `MOT-03` | Compare fourteen independent external authorities and six intact exact-source candidates.                                                                       | `Completed evidence`                 |
| `MOT-04` | Require instant, fully meaningful ordinary UI under reduced motion.                                                                                             | `Approved — 2026-08-10`              |
| `MOT-05` | Adopt `MO-02 · Atlassian` for ordinary-UI duration/easing and semantic roles.                                                                                   | `Approved — 2026-08-10`              |
| `MOT-06` | Correct the specimen's Atlassian persistent-selection mapping from hover `50ms` to the published interactive-highlight `150ms`; do not import Spectrum `130ms`. | `Corrected evidence — 2026-08-10`    |
| `MOT-07` | Revalidate the selected source across desktop/mobile, languages, appearances, reduced motion, and keyboard focus; close Block 3.                                | `Approved and complete — 2026-08-10` |
