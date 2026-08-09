# NosLog 2.0 C5 Focus Indicator Reference Comparison

[한국어 companion](42-foundation-c5-focus-indicator-reference-comparison.ko.md)

## Document Control

| Field               | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| Status              | `Research complete — FI-C selected for measured validation`              |
| Date                | `2026-08-09`                                                             |
| Canonical language  | English                                                                  |
| Decision gate       | C5 keyboard focus-indicator color and geometry                           |
| Inherited approvals | `M-A` surfaces, `F-A` foregrounds, `NB-A` boundaries, `NI-A` interaction |

This document compares the visual treatment of keyboard focus before any NosLog
focus token, component alias, or production implementation is approved. The user
selected `FI-C`, Fluent 2 achromatic polarity, for dedicated measured validation on
2026-08-09. That selection authorizes a guide specimen only.

## Related Documents

- [Foundation semantic role map](25-foundation-semantic-role-map.md)
- [Foundation color and material candidates](32-foundation-color-material-candidates.md)
- [Foundation signature-color research](33-foundation-signature-color-research.md)
- [C5 Spectrum S2 semantic mapping](34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 neutral boundary specimen validation](39-foundation-c5-neutral-boundary-specimen-validation.md)
- [C5 neutral interaction specimen validation](41-foundation-c5-neutral-interaction-specimen-validation.md)
- [C5 focus-indicator visual comparison](43-foundation-c5-focus-indicator-visual-comparison.md)
- [C5 Fluent focus specimen validation](44-foundation-c5-fluent-focus-specimen-validation.md)

## Scope

This comparison covers the authored visual indicator for keyboard focus:

- normal-theme Light and Dark color;
- indicator thickness, gap, offset, and single- or multi-color structure;
- separation from hover, pressed, selected, error, and signature color;
- behavior on approved neutral surfaces, filled controls, imagery, and dense data;
- clipping, high zoom, and forced-colors requirements.

It excludes focus order, roving `tabindex`, dialog restoration, component geometry,
final component aliases, signature and feedback colors, production code, and final
high-fidelity page design. Those remain separate gates.

## Existing Authority

1. Approved direction `C2-B` assigns keyboard focus to `focus-outer` and an optional
   `focus-inner`. Focus is independent of signature/accent, selection, and error.
2. `M-A`, `F-A`, `NB-A`, and `NI-A` remain fixed while focus is evaluated. A focus
   treatment may not recolor the underlying control or promote every normal boundary.
3. Tailwind CSS has no visual authority. Its blue rings, palette steps, starter
   shadows, and templates are excluded.
4. Adobe Spectrum S2 is the exclusive neutral source, but that approval did not
   pre-approve a focus mapping. Focus needs its own source, role mapping, specimen,
   and user approval.
5. The over-accented `FCM-11` and `SIG-07` examples remain `Rejected` and were not
   used as evidence or targets.
6. Document `41` observed Chrome's normal Dark user-agent outline as `1px`
   `rgb(153, 200, 255)`. Forced colors produced system white/cyan indicators. Those
   observations prove reachability and system override behavior; they are not NosLog
   normal-theme candidates.

## Equivalent Role Used for Comparison

Only a persistent visual change that identifies the currently keyboard-focused
interactive element is treated as equivalent evidence.

| Included evidence                                            | Excluded as a substitute                    |
| ------------------------------------------------------------ | ------------------------------------------- |
| Global or component `:focus-visible` outline/ring            | Brand or signature swatch                   |
| Focus border or underline that remains visible while focused | Hover, pressed, or selected fill            |
| Contrast band paired with the primary focus color            | Validation/error border                     |
| Forced-colors system override                                | Browser screenshots without measured values |

## Accessibility Baseline

### Required and target criteria

- WCAG 2.2 `2.4.7 Focus Visible` is Level AA and requires a visible keyboard focus
  indicator.
- WCAG 2.2 `2.4.11 Focus Not Obscured (Minimum)` is Level AA and prevents authored
  content from completely hiding the focused component.
- WCAG 2.2 `1.4.11 Non-text Contrast` is Level AA. In combination with visible
  focus, authored indicator pixels needed to identify the state need `3:1` against
  adjacent colors, except when the user agent determines the unmodified appearance.
- WCAG 2.2 `2.4.13 Focus Appearance` is Level AAA, not AA. It requires an indicator
  area at least as large as a `2 CSS px` perimeter and at least `3:1` change of
  contrast between the same focused and unfocused pixels.
- A solid `2px` perimeter is the simplest AAA geometry, but an equivalent-area
  indicator can also pass. Offset is not required, though it can improve separation.
- Under WAI-ARIA APG guidance, focus must remain visible and must be visually distinct
  from selection. Color and gradients can disappear in high-contrast modes, so the
  system override must remain available.

NosLog targets the measurable `2px`/`3:1` Focus Appearance benchmark even though
`2.4.13` is AAA. This research does not misstate it as an AA requirement.

## Reference Matrix

The matrix contains 16 relevant entries spanning 15 independent standards, design
systems, production services, and current NosLog evidence. A value is marked
theme-defined or unavailable when the maintained public source does not publish a
single static Light/Dark pair; no missing value is inferred.

|   # | Reference                                                                                                                                                                                                                                                     | Equivalent published treatment                                                                                                                                                                                                                                                          | Transferable finding                                                                                | NosLog limitation                                                                                                                   |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [WCAG 2.2 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast), and [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) | No palette. Visible focus and necessary adjacent non-text contrast are AA; the AAA appearance target is `2 CSS px` perimeter-equivalent area and `3:1` focused/unfocused pixel change.                                                                                                  | Supplies the acceptance floor without choosing a style.                                             | Cannot select a NosLog color or ring architecture.                                                                                  |
|   2 | [WAI-ARIA APG keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                                                                                                                                              | No palette. Focus must persist, remain easy to discern, and differ from selected state; high-contrast loss must be considered.                                                                                                                                                          | Confirms focus and selection need separate visual ownership.                                        | Behavior guidance, not token data.                                                                                                  |
|   3 | [Adobe Spectrum S2 color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/) and [layout tokens](https://opensource.adobe.com/spectrum-design-data/tokens/layout/)                                                              | `focus-indicator-color`: Light `#4b75ff`, Dark `#4069fd`; `focus-indicator-thickness`: `2px`; `focus-ring-gap`: `2px`. Static black/white focus aliases also exist for explicitly static contexts.                                                                                      | Publishes a complete, restrained, dual-mode semantic color and geometry from one maintained source. | Image edges, clipped containers, and component exceptions still require a NosLog specimen.                                          |
|   4 | [Fluent 2 web alias color tokens](https://fluent2.microsoft.design/color-tokens2/) and [interaction color guidance](https://fluent2.microsoft.design/color)                                                                                                   | `colorStrokeFocus1`: Light white, Dark black; `colorStrokeFocus2`: Light black, Dark white. The standard web focus-outline helper uses the second color at `2px`; component recipes may vary.                                                                                           | Achromatic polarity maximizes contrast and avoids brand ownership.                                  | The strong Dark white treatment must remain transient keyboard-visible focus and must never become an ordinary persistent boundary. |
|   5 | [Atlassian focused border guidance](https://atlassian.design/foundations/border/) and [radius guidance](https://atlassian.design/foundations/radius/)                                                                                                         | `color.border.focused` with `border.width.focused` `2px`; the focus ring is offset `2px`, and its radius grows from the element radius. The distributed default fallback is Light `#388bff`; the public page adapts by theme but does not expose one stable Dark hex in static content. | Clean semantic separation and explicit geometry are strong.                                         | A complete exact Light/Dark pair cannot be adopted from the static public evidence without resolving the current theme artifact.    |
|   6 | [Carbon color overview](https://carbondesignsystem.com/elements/color/overview/) and [tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                          | Most focus is a `2px` border. Light usually uses Blue 60 `#0f62fe`; Dark usually uses white. `$focus-inset` adds a contrast border when required.                                                                                                                                       | Demonstrates a measured single-color default plus a component-owned contrast band.                  | White Dark focus repeats the bright-outline problem; Carbon's inset recipe cannot be mixed into Spectrum selectively.               |
|   7 | [Primer color primitives](https://primer.style/product/primitives/color/) and [button focus implementation](https://primer.style/product/components/button/)                                                                                                  | `--focus-outlineColor` is Light `#0969da`; themes provide mode-specific values. Buttons use a `2px` outline at `-2px` offset, and primary buttons add an inset on-emphasis band.                                                                                                        | Shows component-owned geometry and explicit filled-control treatment.                               | The public static token table does not expose one complete standard Dark pair, and Primer's inset recipe is not Spectrum's recipe.  |
|   8 | [Material Web text field tokens](https://github.com/material-components/material-web/blob/main/docs/components/text-field.md) and [Angular Material strong focus](https://github.com/angular/components/blob/main/guides/theming.md)                          | Component focus commonly resolves to theme `primary`; optional strong indicators use theme `secondary` unless customized. There is no fixed brand-independent global Light/Dark focus pair.                                                                                             | Shows a theme-owned, component-specific alternative.                                                | Conflicts with approved `C2-B`, which keeps focus independent of signature/accent; Material Web is also in maintenance mode.        |
|   9 | [GOV.UK focus states](https://design-system.service.gov.uk/get-started/focus-states/) and [functional colors](https://design-system.service.gov.uk/styles/colour/)                                                                                            | Focus yellow `#ffdd00`, focus text/contrast black `#0b0c0c`, and a `3px` focus-width token. Text focus uses yellow fill and strong black underline; inputs pair yellow outline with black structure.                                                                                    | A complete two-color method remains visible on varied service backgrounds.                          | No normal Dark product theme; its deliberately dominant public-service character is too strong for ordinary NosLog density.         |
|  10 | [USWDS settings](https://designsystem.digital.gov/documentation/settings/) and [system color tokens](https://designsystem.digital.gov/design-tokens/color/system-tokens/)                                                                                     | Default focus is `blue-40v` `#2491ff`, solid, zero offset, with a `0.5` spacing-unit width (`4px`).                                                                                                                                                                                     | A robust single-color government default prioritizes visibility over subtlety.                      | It is a theme default, not a published normal Light/Dark pair, and `4px` is materially heavier than the current NosLog structure.   |
|  11 | [VA.gov focus management](https://design.va.gov/accessibility/focus-management) and [color tokens](https://design.va.gov/foundation/design-tokens/color)                                                                                                      | A thick global gold outline; `vads-color-action-focus-on-light` is `#face00`. The system tells teams not to create local custom focus styles.                                                                                                                                           | Strong consistency and a dedicated focus semantic are valuable.                                     | The public web role does not publish a complete normal Dark pair; gold also competes with future warning/feedback decisions.        |
|  12 | [SAP Fiori theming](https://experience.sap.com/fiori-design-web/theming/) and [SAP theming base content](https://github.com/SAP/theming-base-content)                                                                                                         | Focus is a stable semantic theme parameter mapped across Morning Horizon, Evening Horizon, and two high-contrast themes. Public guidance emphasizes more contrast, space, and hierarchy.                                                                                                | Confirms mode and accessibility variants should resolve through one semantic role.                  | The guideline page does not expose one static focus value/geometry pair for direct adoption; exact values live in theme artifacts.  |
|  13 | [PatternFly token catalog](https://www.patternfly.org/tokens/all-patternfly-tokens/) and [accessibility guidance](https://www.patternfly.org/accessibility/develop/)                                                                                          | Publishes `pf-t--global--focus-ring--color--100`, Light/Dark token modes, and component-level state recipes; the static catalog does not render one universal resolved hex and geometry.                                                                                                | Semantic focus ownership survives theme changes.                                                    | Insufficient exact static data for intact adoption; component recipes cannot be generalized silently.                               |
|  14 | [Radix Themes color guidance](https://www.radix-ui.com/themes/docs/theme/color) and [Dark mode](https://www.radix-ui.com/themes/docs/theme/dark-mode)                                                                                                         | Most components use accent-derived `--focus-8`; focus and selection automatically follow the component's accent and Light/Dark appearance.                                                                                                                                              | Demonstrates maintained dual-mode focus plumbing.                                                   | Directly couples focus to accent, contrary to `C2-B`; no fixed independent pair exists before choosing an accent.                   |
|  15 | [Salesforce SLDS color migration](https://developer.salesforce.com/blogs/2023/06/preparing-your-app-for-the-lightning-design-system-color-update) and [focus handling](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-focus.html) | Directs teams to component blueprints and semantic styling hooks so accessible focus changes propagate without local hard-coded approximations. The public material does not publish one complete normal Light/Dark focus pair.                                                         | Reinforces upstream semantic and component ownership.                                               | Governance evidence only; it cannot supply exact NosLog values or geometry.                                                         |
|  16 | [Current NosLog interaction validation](41-foundation-c5-neutral-interaction-specimen-validation.md)                                                                                                                                                          | Chrome normal Dark UA focus measured `1px rgb(153, 200, 255)`; forced colors produced visible system cyan/white indicators and retained semantic state.                                                                                                                                 | Establishes current browser behavior and the need to preserve system override.                      | Browser-dependent UA output is not a stable design-guide token or cross-browser geometry.                                           |

## Convergence and Disagreement

### Strong convergence

1. Focus is a dedicated semantic state, not an arbitrary border promotion.
2. The indicator must remain distinct from selected, error, and disabled states.
3. `2px` is the dominant authored perimeter thickness among product systems and is
   the simplest geometry that reaches the WCAG AAA appearance area target.
4. One semantic role may resolve asymmetrically across Light and Dark.
5. Filled controls, imagery, and dense composites sometimes need a component-owned
   contrast band or inset treatment, but such exceptions are not global primitives.
6. High-contrast and forced-colors modes must be allowed to replace normal-theme
   colors. `forced-color-adjust: none` is not a default strategy.
7. Clipping and focus/selection coexistence are as important as the nominal swatch.

### Material disagreement

1. Spectrum, Atlassian, Primer, and USWDS use chromatic blue; GOV.UK and VA use warm
   yellow/gold; Fluent and Carbon Dark use achromatic black/white.
2. Geometry ranges from inset to offset and from `2px` to `4px`. No cross-system
   universal offset exists.
3. Some systems keep focus independent; Material and Radix derive it from the active
   accent. This conflicts with the approved NosLog role model.
4. Some systems publish a global default plus component exceptions; others expose
   only component recipes. Combining their strongest parts would create an unsourced
   hybrid.

## Exact Spectrum S2 Candidate Input

Spectrum publishes the following intact semantic mapping:

| Role                                 | Light     | Dark      | Geometry                                                  |
| ------------------------------------ | --------- | --------- | --------------------------------------------------------- |
| `focus-indicator-color`              | `#4b75ff` | `#4069fd` | `2px` indicator thickness                                 |
| `focus-ring-gap`                     | `2px`     | `2px`     | Space between component and outer ring                    |
| `static-black-focus-indicator-color` | `#000000` | `#000000` | Static-context alias; not the global normal-theme default |
| `static-white-focus-indicator-color` | `#ffffff` | `#ffffff` | Static-context alias; not the global normal-theme default |

Adopting the ordinary semantic pair does not automatically authorize either static
black/white alias or an optional `focus-inner`. Those require an exact component
need and a separate measured mapping.

## Measured Contrast Against Approved `M-A`

The outer-ring color replaces pixels of the adjacent approved surface. Exact sRGB
contrast was calculated for every unique `M-A` neutral surface.

| Theme | Adjacent `M-A` surface          | Focus color | Contrast |
| ----- | ------------------------------- | ----------- | -------: |
| Light | base/elevated/layer 2 `#ffffff` | `#4b75ff`   | `3.97:1` |
| Light | layer 1 `#f8f8f8`               | `#4b75ff`   | `3.74:1` |
| Light | pasteboard `#e9e9e9`            | `#4b75ff`   | `3.27:1` |
| Dark  | base/pasteboard `#111111`       | `#4069fd`   | `4.19:1` |
| Dark  | layer 1 `#1b1b1b`               | `#4069fd`   | `3.82:1` |
| Dark  | elevated/layer 2 `#222222`      | `#4069fd`   | `3.53:1` |

All six pairs exceed `3:1`. Combined with a solid `2px` perimeter, the published
Spectrum geometry is a viable measured input for the WCAG `2.4.13` appearance
target on approved neutral surfaces.

This calculation does not prove visibility against album artwork, charts, feedback
fills, future signature fills, or a ring clipped by `overflow`. Those are specimen
questions, not reasons to alter the source values in advance.

## Candidate Comparison

### `FI-A` — adopt the ordinary Spectrum S2 focus mapping intact

- Light `focus-outer`: `#4b75ff`
- Dark `focus-outer`: `#4069fd`
- thickness: `2px`
- gap: `2px`
- `focus-inner`: unassigned by default
- static black/white aliases: available only when an exact Spectrum-equivalent
  component context and measurement justify them

Status: `Not selected after the visual comparison`.

Why it advances: it is a complete maintained Light/Dark semantic mapping, preserves
the project's adopted Spectrum provenance, passes the approved neutral-surface
contrast matrix without modification, and avoids a normal Dark white outline.

### `FI-B` — adopt Carbon's complete Light-blue/Dark-white focus model

Status: `Not selected after the visual comparison`.

It is complete and accessible, but replacing only focus would introduce another
system's blue/inset logic and would restore the bright white Dark outline already
excluded from the restrained normal-theme direction.

### `FI-C` — adopt Fluent's achromatic polarity model

Status: `Selected for dedicated measured validation — 2026-08-09`.

It avoids chromatic focus color and keeps the future signature and feedback palettes
unclaimed. The user explicitly distinguished this transient keyboard-visible signal
from the rejected persistent white normal-Dark boundary: Light uses black and Dark
uses white only while the element visibly owns keyboard focus.

### `FI-D` — adopt GOV.UK's complete yellow/black method

Status: `Not recommended for ordinary NosLog UI`.

It is exceptionally robust on varied backgrounds, but its yellow block treatment is
intentionally dominant, has no normal Dark product mapping, and could pre-empt future
warning/feedback semantics.

### `FI-E` — retain browser user-agent focus as the design contract

Status: `Not recommended as the guide default`.

UA focus remains a valid fallback and forced-colors mechanism, but its color,
thickness, and shape differ by browser and platform. It cannot provide a stable
Claude Design or later production mapping.

## Selected `FI-C` Validation Contract

The dedicated measured validation specimen must hold these rules without yet
promoting `FI-C` to production:

1. Apply the normal authored indicator to keyboard-visible focus, not as a persistent
   pointer-click decoration.
2. Use Fluent `colorStrokeFocus2`: Light `#000000`, Dark `#ffffff`, and the published
   `2px` web focus-outline helper with zero offset. Do not gray, tint, soften, add a
   gap, add glow, or substitute a Tailwind color.
3. Do not recolor the component fill, text, icon, boundary, or selected state merely
   because it receives focus.
4. Do not invent one hybrid multi-stroke rule. Where a component-equivalent Fluent
   recipe requires `colorStrokeFocus1` or another component-owned treatment, preserve
   that recipe intact or reopen the decision; do not promote it to a global primitive.
5. Preserve error and selection semantics while focus moves independently. The
   focused selected/error item must show both responsibilities without looking like
   two focused elements.
6. Allow forced colors to use system `Highlight`/outline behavior and do not disable
   adjustment globally.
7. Do not clip the full ring at scroll containers, rounded overflow boundaries,
   sticky regions, or viewport edges.

## Required Measured Specimen Gate

Before the focus gate can close, a dedicated guide specimen must test:

1. text links, icon buttons, low-emphasis actions, filled controls, form fields,
   menu items, stack/tree rows, dense ranking rows, chart controls, and skip links;
2. all unique `M-A` surfaces in Light and Dark, plus artwork/image edges and a dark
   filled control;
3. focus alone, selected + focus, current + focus, error + focus, and disabled
   neighbors without using color alone for necessary state;
4. exact `2px` thickness and zero offset, radius/shape following, clipping, and visible
   perimeter area;
5. `320px`, `390px`, relevant intermediate widths, desktop density, actual 200%
   browser zoom, and focus not obscured by authored sticky/overlay content;
6. keyboard entry and exit, composite movement, visible focus persistence, and
   programmatic state ownership;
7. active forced colors with zero default descendants using
   `forced-color-adjust: none`;
8. Korean, Japanese, and English labels and long NOSTALGIA content without the ring
   changing layout or causing two-dimensional overflow.

Any failure must reopen the source decision. The specimen may not silently soften the
achromatic values, add Spectrum's gap, or borrow another system's geometry.

## Decision Record

| ID       | Statement                                                                                                                                                                   | Status                           |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `C5F-01` | Keep keyboard focus independent of signature, selection, error, and neutral boundary strength.                                                                              | `Approved upstream through C2-B` |
| `C5F-02` | Treat the Chrome normal/forced-colors results in document `41` as browser evidence, not normal-theme tokens.                                                                | `Observed`                       |
| `C5F-03` | The exact Spectrum S2 pair and geometry exceed `3:1` on every approved `M-A` neutral surface without modification.                                                          | `Observed`                       |
| `C5F-04` | Before selecting a source, build a same-condition visual comparison of the viable authored candidates, preserving each upstream system's exact color and geometry.          | `Completed — document 43`        |
| `C5F-05` | Do not assign Fluent `colorStrokeFocus1` or a component-owned multi-stroke exception globally unless an exact equivalent component context requires it.                     | `Selected validation governance` |
| `C5F-06` | Keep the C5 focus gate open until browser, contrast, clipping, state-coexistence, zoom, localization, and forced-colors validation passes and the user approves the result. | `Open`                           |
| `C5F-07` | Take Fluent 2 achromatic polarity into dedicated measured validation while keeping persistent normal-Dark white boundaries prohibited.                                      | `Selected by user — 2026-08-09`  |

## User Review Gate

The user selected `FI-C` from document `43`. The next gate is the dedicated measured
validation defined above. This selection does not approve production tokens, final
component aliases, signature color, feedback color, or application implementation.
