# NosLog 2.0 C5 Material Geometry Reference Comparison

## Document control

- Status: `Research draft — fourteen-source comparison complete; source-set extraction and visual gate pending`
- Canonical language: English
- Korean companion:
  [52-foundation-c5-material-geometry-reference-comparison.ko.md](./52-foundation-c5-material-geometry-reference-comparison.ko.md)
- Date: 2026-08-10
- Scope: exact radius, elevation/shadow, and scrim-source candidates for the
  already approved `C4` material roles
- Inputs: approved documents `24`, `26`, `32`, `34`–`51`; current repository
  component inventory; fourteen independent maintained design-system sources
- Excludes: final component aliases, feedback/domain/data color, motion,
  iconography, final NosLog mark drawing, production implementation, and any
  high-fidelity page suite

This document starts the next C5 gate after the neutral, focus, identity, and
filled-primary-action decisions. It records evidence and narrows intact source
sets. It does not approve a radius or shadow value merely because that value is
listed here.

## Governing decisions that remain fixed

1. Adobe Spectrum S2 remains the exclusive Dark/Light neutral primitive source.
2. `C1-B` keeps `canvas`, `surface`, `sunken`, `raised`, `overlay`, and `scrim`.
3. Flat `canvas`, `surface`, and `sunken` use no default shadow. Shadow is
   limited to a justified `raised`, `overlay`, dragged, or scroll-boundary
   relationship.
4. `C4` already approved `1px` structural borders, restricted `2px` state or
   emphasis borders, no shared sub-pixel hairline, and the `R-B` role family:
   `radius-control`, `radius-container`, `radius-overlay`, and `radius-full`.
5. Dark layering cannot rely on shadow alone. The approved Spectrum surface
   value and boundary remain part of the depth cue.
6. Tailwind radius, shadow, and starter-card styling are not design authority.
7. A source set must be adopted intact for the roles it owns. Values from
   several systems may not be mixed or interpolated into a new NosLog ramp.

## Equivalent roles compared

The comparison aligns systems by purpose rather than by token number or visual
size:

| NosLog role         | Equivalent evidence sought                                      |
| ------------------- | --------------------------------------------------------------- |
| `radius-control`    | Button, input, select, compact interactive control              |
| `radius-container`  | Card, bounded content group, stable panel                       |
| `radius-overlay`    | Menu, popover, tooltip, sheet, dialog                           |
| `radius-full`       | Avatar, circular control, explicitly pill-shaped compact object |
| `elevation-raised`  | Actual lifted or moving content, not ordinary grouping          |
| `elevation-overlay` | Temporary UI above the current surface                          |
| `elevation-dragged` | Object actively moved above its source plane                    |
| `scroll-boundary`   | Directional cue for clipped scroll content                      |
| `scrim`             | Modal background suppression, separate from the dialog surface  |

## Fourteen-source comparison

| Source                                                                                                                                                                                                               | Published material structure and values                                                                                                                                                            | Transferable principle                                                                     | NosLog fit                                                                                                | Limitation                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [Adobe Spectrum S2 layout tokens](https://opensource.adobe.com/spectrum-design-data/tokens/layout/)                                                                                                                  | Radius aliases: small `4px`, medium `8px`, large `10px`, extra-large `16px`, full `0.5`; shadows use `0px` x with emphasized `1px/6px`, elevated `2px/8px`, and dragged `6px/16px` y/blur geometry | A small semantic alias layer can sit above exact primitives                                | Strong provenance continuity with the approved Spectrum neutral source and a lean role set                | Exact shadow color and scrim mapping must still be extracted as part of one published source set before a specimen                     |
| [Microsoft Fluent 2 shapes](https://fluent2.microsoft.design/shapes), [elevation](https://fluent2.microsoft.design/elevation)                                                                                        | Radius `0/2/4/8/12px/50%`; six shadow levels, with separate Light/Dark opacity equations and key plus ambient shadows                                                                              | Geometry and theme-aware shadow behavior are explicit and testable                         | Clear control/flyout distinction and complete Dark behavior                                               | Six elevation levels are broader than NosLog's approved lean material vocabulary                                                       |
| [Atlassian radius](https://atlassian.design/foundations/radius/), [elevation](https://atlassian.design/foundations/elevation/)                                                                                       | Radius `2/4/6/8/12/16px/999px`; semantic `sunken/default/raised/overlay/overflow` elevation roles                                                                                                  | Surface value and shadow are paired; Dark depth is not shadow-only                         | Role model nearly matches `C1-B`; `6/8/12px` directly expresses control/container/large overlay hierarchy | Exact shadow-token values and blanket/scrim value must be captured before adoption; full Atlassian component styling is out of scope   |
| [IBM Carbon color and layering](https://carbondesignsystem.com/elements/color/usage/)                                                                                                                                | Contextual layer sets pair backgrounds, fields, and borders; overlay token is black at `60%` in the documented theme                                                                               | Layer context is more important than decorative card depth                                 | Strong evidence for flat, border-led dense data UI                                                        | Does not expose a comparably complete shared radius/elevation source set for the required four NosLog roles                            |
| [Material 3 Shapes](https://developer.android.com/reference/kotlin/androidx/compose/material3/Shapes), [elevation guidance](https://developer.android.com/develop/ui/views/theming/shadows-clipping)                 | Broad shape scale from extra-small through extra-extra-large and full; Material 3 also uses surface color in its elevation model                                                                   | Shape may communicate component family and elevation should not be shadow-only             | Useful validation of surface-color depth in Dark appearance                                               | Current expressive shape breadth and default full buttons conflict with the deliberately restrained NosLog role set                    |
| [GitHub Primer size primitives](https://primer.style/product/primitives/size/), [shadow primitives](https://primer.style/product/primitives/color/)                                                                  | Radius small `3px`, medium/default `6px`, large `12px`, full `9999px`; resting and floating shadow families                                                                                        | Resting and floating layers should be separate semantic families                           | Compact control geometry and dense-product evidence are relevant                                          | Floating shadow family is visually and technically broader than the smallest NosLog requirement                                        |
| [Shopify Polaris border](https://polaris-react.shopify.com/tokens/border), [shadow](https://polaris-react.shopify.com/tokens/shadow), [depth guidance](https://polaris-react.shopify.com/design/depth/shadow-tokens) | Radius scale `0/2/4/6/8/12/16/20/30/full`; shadow `0` through `600`, with component ownership from card to modal/search                                                                            | Component aliases should select a published primitive instead of inventing local shadows   | Excellent exact-value evidence and clear component ownership                                              | Primitive breadth is much larger than `R-B`; its light-admin surface treatment is not NosLog's Dark art direction                      |
| [U.S. Web Design System shadow tokens](https://designsystem.digital.gov/design-tokens/shadow/), [settings](https://designsystem.digital.gov/documentation/settings/)                                                 | Radius defaults `2px`, `4px`, `8px`; shadow levels from `0 1px 4px rgba(0,0,0,.1)` to `0 16px 32px rgba(0,0,0,.1)`                                                                                 | A small predictable geometry ramp is preferable to arbitrary values                        | Restrained radius values and accessible public-service evidence                                           | Shadow tokens are not appearance-specific and do not solve Dark layering by themselves                                                 |
| [LINE Design System Global object styles](https://designsystem.line.me/LDSG/foundation/object-styles-en/)                                                                                                            | Radius `3/5/7/12px/50%`; separate shadow sets optimized for white and light-gray backgrounds                                                                                                       | Background context should control shadow selection                                         | Strong East-Asian production and dense-control relevance                                                  | Published shadow sets do not provide a complete Dark appearance mapping                                                                |
| [Radix Themes radius](https://www.radix-ui.com/themes/docs/theme/radius), [shadows](https://www.radix-ui.com/themes/docs/theme/shadows)                                                                              | Contextual six-step radius and shadow scales; small overlays use shadow `4/5`, dialogs use `6`                                                                                                     | Component context can prevent a single radius or shadow from spreading everywhere          | Useful implementation comparison because Radix UI already exists in the stack                             | Theme-factor indirection and broad customization make it weaker as an exact, locked NosLog source                                      |
| [PatternFly tokens](https://www.patternfly.org/tokens/all-patternfly-tokens/)                                                                                                                                        | Radius `0/4/6/16/24/999px`; separate small/medium/large and directional shadow geometry                                                                                                            | Directional scroll/drawer shadows deserve a role separate from normal elevation            | Strong professional-tool and drawer evidence for future `S6`                                              | `16px` card and `24px` modal defaults are much rounder than the current restrained direction                                           |
| [Ant Design Button tokens](https://ant.design/components/button/)                                                                                                                                                    | Base `6px`, small `4px`, large `8px`; `1px` default line and `3px` focus line in the component token set                                                                                           | Control size can select from a small radius family                                         | Dense multilingual enterprise UI is relevant                                                              | Component-specific evidence does not provide a complete raised/overlay/scrim source set; focus geometry conflicts with approved `FI-C` |
| [GitLab Pajamas border guidance](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/blob/main/contents/product-foundations/border.md)                                                                 | `1px` borders, restricted `2px` emphasis, concentric nesting rule `outer radius - padding = inner radius`, and border over box-shadow for high-contrast boundaries                                 | Borders should stay sparse, high-contrast resilient, and geometrically related when nested | Reinforces the already approved NosLog border contract and anti-boxes direction                           | Radius usage guidance is incomplete and therefore cannot be the exact source set                                                       |
| [SAP Fiori foundation guidance](https://experience.sap.com/fiori-design-web/explore_category/look-feel-wording/)                                                                                                     | Central color, shadow, and metric tokens with Light, Dark, HCB, and HCW themes                                                                                                                     | Material values should have full appearance and high-contrast behavior                     | Strong enterprise and accessibility coverage                                                              | Public guidance does not expose an equally direct four-role exact radius/shadow mapping on one page                                    |

## Convergence and disagreement

### Convergence

1. Ordinary grouped content stays flat; whitespace or a `1px` boundary is the
   normal separator.
2. Raised and overlay roles need explicit component ownership. A generic shadow
   utility is not a valid authoring API.
3. Dark appearance needs surface-value or boundary support in addition to a
   shadow.
4. Control radius is normally smaller than or equal to container/overlay radius.
5. Full rounding is a shape contract, not the largest ordinary radius step.
6. Scroll-boundary or directional shadow is semantically separate from resting
   elevation.
7. A source set with four to six purposeful roles is sufficient; large ramps
   increase arbitrary author choice without adding NosLog meaning.

### Disagreement

- Control radius ranges from `2px` to full-pill defaults.
- Container radius ranges from nearly square to `16px` or more.
- Some systems expose one shadow layer; others combine key and ambient layers.
- Some systems use the same shadow geometry across appearances, while Fluent and
  layered systems explicitly change Dark behavior.
- Scrim opacity and composition vary and cannot be inferred from a radius or
  shadow choice.

These disagreements require an actual NosLog specimen. Popularity or visual
familiarity is not enough to choose a source.

## Exact source-set extraction progress

### `MG-A` Spectrum S2 — exact candidate input complete

The published Spectrum token data now provides a complete, non-interpolated
candidate input:

| Proposed NosLog role | Exact Spectrum alias/value                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `radius-control`     | `corner-radius-small-default` → `4px`                                                                                |
| `radius-container`   | `corner-radius-medium-default` → `8px`                                                                               |
| `radius-overlay`     | `corner-radius-large-default` → `10px`                                                                               |
| `radius-full`        | `corner-radius-full` → `0.5` of the relevant box                                                                     |
| `elevation-raised`   | `drop-shadow-emphasized`: `0 2px 8px` ambient + `0 1px 4px` transition + `0 0 1px` key                               |
| `elevation-overlay`  | `drop-shadow-elevated`: `0 4px 12px` ambient + `0 2px 6px` transition + `0 0 2px` key                                |
| `elevation-dragged`  | `drop-shadow-dragged`: `0 12px 16px` ambient + `0 6px 8px` transition + `0 0 6px` key                                |
| Shadow colors        | Ambient Light/Dark `rgba(0,0,0,.08/.24)`; transition `.04/.12`; key increases by semantic level exactly as published |
| `scrim`              | `overlay-color` black with `overlay-opacity` Light `0.4`, Dark `0.6`                                                 |

This is a candidate mapping from published Spectrum semantic aliases to the
already approved NosLog roles. It does not alter any token value and does not
adopt Spectrum component styling. Visual approval remains pending.

### `MG-B` Fluent 2 — primitives complete, role subset pending

- Radius input is exactly `0/2/4/8/12px/50%`.
- Light low elevation uses key and ambient opacities of `14%`; Dark uses `28%`
  key and `14%` ambient.
- High elevation uses the documented `28` and `64` levels with different Light
  and Dark secondary-blur equations.
- `colorBackgroundOverlay` is black alpha `40` in Light and `50` in Dark.
- Fluent publishes six elevation levels with different component examples. A
  controlled NosLog candidate still needs an evidence-backed semantic subset;
  selecting levels by visual preference would create a local hybrid.

### `MG-C` Atlassian — roles and radius complete, exact effect values pending

- Exact radius roles are available: interactive `6px`, containment/floating UI
  `8px`, large containers/modals `12px`, full `999px`.
- Exact semantic roles are available: `surface`, `sunken`, `raised`, `overlay`,
  and `overflow`; dragged items use overlay elevation.
- Current exact Light/Dark `elevation.shadow.*` and `color.blanket` resolved
  values remain to be captured from the official current token artifact. Legacy
  fallback values are not accepted as current authority.

## Source-set finalists for extraction

The following are research finalists, not approved candidates.

### `MG-A` — Adobe Spectrum S2 material set

- Preserve the published Spectrum radius aliases and shadow geometry exactly.
- Advantage: simplest provenance beside the already approved Spectrum neutral
  primitives; smallest risk of an unsourced hybrid.
- Exact radius, three semantic shadows, appearance-specific shadow colors, and
  scrim are now extracted. The remaining gate is controlled NosLog rendering.

### `MG-B` — Microsoft Fluent 2 material set

- Preserve Fluent's exact radius and Light/Dark key-plus-ambient elevation set.
- Advantage: the most explicit appearance-specific shadow equations in the
  comparison.
- Risk: the six-level elevation ramp must be reduced only through published
  semantic aliases or a documented subset; NosLog may not invent a new mixture.

### `MG-C` — Atlassian material set

- Preserve Atlassian radius, surface/elevation pairing, overflow, and blanket
  mapping as one set.
- Advantage: its `sunken/default/raised/overlay/overflow` semantics align most
  directly with the approved NosLog role inventory.
- Blocking extraction: exact current Light/Dark shadow values and blanket value.

No recommendation is final until the blocking values are extracted and the same
NosLog content is rendered with the three intact candidates.

## Required visual-comparison gate

The next specimen must hold typography, spacing, approved Spectrum surfaces and
foregrounds, boundary mapping, `FI-C` focus, content, and layout constant. It may
change only the candidate-owned radius, shadow, and scrim mapping.

Required scenes:

1. flat discovery/ranking rows beside one justified raised movable item;
2. menu/popover and dialog over both Light and Dark approved surfaces;
3. `S4` viewer or `S6` editor sunken well with sticky/scroll boundary;
4. nested control inside a container to detect non-concentric or excessively
   rounded geometry;
5. a modal scrim with keyboard focus containment and a non-shadow boundary in
   forced colors;
6. `320`, `390`, intermediate, and desktop widths with Korean, Japanese, and
   English content;
7. default, hover, pressed, focus-visible, dragged, disabled, and open/closed
   overlay states.

Measurements must include computed values, clipping, overflow, scroll-boundary
direction, focus perimeter, Dark layer distinguishability, `200%` zoom, and
active forced-colors behavior. The specimen must not recolor ordinary controls,
reintroduce white Dark-theme outlines, or use Tailwind radius/shadow defaults.

## Decision log

| ID       | Decision                                                                                         | Status                                                                   |
| -------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `MGR-01` | Compare equivalent material roles across fourteen independent maintained systems                 | `Research complete — 2026-08-10`                                         |
| `MGR-02` | Preserve the approved `C1-B`, `C4`, Spectrum neutral, `FI-C`, `ITA-C`, and `RPA-A` contracts     | `Required`                                                               |
| `MGR-03` | Keep Tailwind radius/shadow and starter-card styling outside design authority                    | `Required`                                                               |
| `MGR-04` | Shortlist `MG-A`, `MG-B`, and `MG-C` for complete source-set extraction                          | `Proposed`                                                               |
| `MGR-05` | Mix radius from one system with shadow or scrim from another                                     | `Rejected by provenance contract`                                        |
| `MGR-06` | Extract exact current shadow color/composition, scrim, and component ownership for all finalists | `MG-A complete; MG-B primitive set complete; MG-C exact effects pending` |
| `MGR-07` | Build the controlled NosLog material-geometry comparison                                         | `Pending MGR-06`                                                         |
| `MGR-08` | Approve an exact material source and component aliases                                           | `Pending user decision after visual validation`                          |
