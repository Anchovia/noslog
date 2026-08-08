# NosLog 2.0 C5 Neutral Boundary Reference Comparison

## Document Control

- Status: `Research complete; NB-A proposed for a measured specimen; user review
pending; C5M-05 remains open`
- Canonical language: English
- Korean companion:
  [38-foundation-c5-neutral-boundary-reference-comparison.ko.md](./38-foundation-c5-neutral-boundary-reference-comparison.ko.md)
- Started: 2026-08-09
- Scope: compare established Light/Dark neutral boundary hierarchies before deciding
  `C5M-05`, correct the provisional table in document `34`, and identify a mapping
  that preserves the approved Adobe Spectrum S2 primitive source
- Inputs: approved documents `25`, `32`, `33`, `35`, `36`, and `37`; the provisional
  boundary hypothesis in document `34`; current official design-system guidance and
  distributed token data; WCAG 2.2; and measured contrast against every approved
  `M-A` surface
- Excludes: focus-ring color, chromatic selected/error/success boundaries,
  signature/domain/data-visualization colors, radius and shadow values, final
  component aliases, high-fidelity page design, and production implementation

This research exists because the boundary table in document `34` was a useful
Spectrum-based hypothesis, not an approved result of broad comparison. It must not
become authority merely because its values already appeared in a prior document.

## Related Documents

- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.md)
- [C5 neutral foreground comparison](./36-foundation-c5-neutral-foreground-reference-comparison.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.md)

## Authority and Comparison Rules

1. Adobe Spectrum S2 remains the approved exclusive source of exact Dark/Light
   neutral primitives under `FCM-12`. External systems may validate role architecture
   but their values may not be mixed into the Spectrum scale.
2. Tailwind CSS is not a color reference. Its palette, theme defaults, starter
   borders, and templates have no NosLog design authority.
3. Equivalent roles are compared: decorative divider, subtle/nonessential framing,
   ordinary component boundary, necessary control or graphical-object boundary,
   disabled boundary, and theme behavior.
4. A token called `border-default` is not assumed equivalent across systems. Its
   product responsibility and adjacent surface determine whether it is comparable.
5. Focus and selected state remain separate decisions. A source that uses a chromatic
   focus or selection border does not authorize that hue for NosLog in this gate.
6. The white outlines observed under active `forced-colors` are browser/user
   accessibility overrides. They are not normal Dark-theme reference values.
7. The rejected over-accented `FCM-11` and `SIG-07` examples are excluded from the
   evidence set and must not be reused downstream.

## Normalized Boundary Responsibilities

| Responsibility            | Meaning                                                                                                         | Contrast contract                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Decorative divider        | Adds rhythm or reinforces grouping already established by spacing, headings, or structure                       | May be below `3:1`; never the only required cue                                                   |
| Subtle framing            | Nonessential container or region edge whose absence would not hide a control, state, or meaning                 | May be below `3:1`; must not create box-within-box noise                                          |
| Ordinary boundary         | Field or container edge whose presence is also established by label, shape, fill, placement, or other structure | May be below `3:1` only when another sufficient cue identifies the element                        |
| Necessary/strong boundary | The boundary itself is required to identify a control, state, or meaningful graphic                             | Must reach at least `3:1` against every relevant adjacent color; do not round a failing result up |
| Disabled boundary         | Identifies an unavailable control where WCAG inactive-component exceptions may apply                            | Disabled-only; never a substitute for subtle decoration or available controls                     |

WCAG does not require every hit area to have a `3:1` outline. It requires `3:1` when
the visible boundary is necessary to identify a component or state. A visible field
with no other sufficient cue therefore cannot use a low-contrast decorative border
as its only identifier.

## Official Reference Matrix

Sixteen independent official sources were reviewed. Fifteen are maintained design
systems or production authorities; WCAG 2.2 is the evaluation authority. Exact values
below come from current official documentation or the system owner's published token
package. A source without a complete static pair is marked as architecture-only
rather than being treated as a transplant candidate.

|   # | Official system/source                                                                                                                                                                                                                          | Equivalent published roles and actual values                                                                                                                                                                                                | Transferable principle                                                                                                    | Applicability limit                                                                                                                                                                                |
| --: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum color system](https://spectrum.adobe.com/page/color-system/), [object styles](https://spectrum.adobe.com/page/object-styles/), [S2 component colors](https://opensource.adobe.com/spectrum-design-data/tokens/color-component/) | Public guidance assigns `gray-200/300` to decorative borders/framing, `gray-400` to field borders, and `gray-600` to control borders. Approved S2 pairs are `#e1e1e1/#323232`, `#dadada/#393939`, `#c6c6c6/#444444`, and `#717171/#8a8a8a`. | Supplies the only value family eligible under `FCM-12` and a role ladder from decorative to necessary control boundaries. | Current S2 does not publish one universal neutral border alias. Components have exceptions, such as a transparent Light popover border and Dark `gray-400`; component aliases remain a later gate. |
|   2 | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                                                                                | White/G100 examples: `border-subtle-00 #e0e0e0/#393939`; layered subtle roles strengthen by layer; `border-strong-01 #8d8d8d/#6f6f6f`; interactive borders are separate.                                                                    | Confirms that decorative, layered, strong, and interactive boundaries need different ownership.                           | Carbon's layer-indexed values and chromatic interactive token cannot be combined with Spectrum.                                                                                                    |
|   3 | [Material 3 ColorScheme](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)                                                                                                                                 | Baseline `outlineVariant #cac4d0/#49454f` is for containers/dividers where `3:1` is not required; `outline #79747e/#938f99` is the main/accessibility outline.                                                                              | Very close role match to decorative versus necessary boundary.                                                            | Material's hue and dynamic color machinery are not eligible primitives.                                                                                                                            |
|   4 | [Microsoft Fluent 2 color tokens](https://fluent2.microsoft.design/color-tokens/)                                                                                                                                                               | `NeutralStrokeSubtle #e0e0e0/#0a0a0a`; Stroke 2 `#e0e0e0/#525252`; Stroke 1 `#d1d1d1/#666666`; Accessible `#616161/#adadad`. Interaction states receive dedicated aliases.                                                                  | Confirms a multi-level neutral stroke ladder and a distinct accessible boundary.                                          | Fluent's darkest subtle value depends on its own Dark surfaces; isolated hex comparison is insufficient for adoption.                                                                              |
|   5 | [GitHub Primer color primitives](https://www.primer.style/product/primitives/color/)                                                                                                                                                            | Light/Dark published theme data: muted `#d1d9e0b3/#3d444db3`, default `#d1d9e0/#3d444d`, emphasis `#818b98/#656c76`, disabled `#818b981a/#656c761a`.                                                                                        | Confirms stable muted/default/emphasis/disabled semantic names across appearances.                                        | Primer uses alpha and blue-gray values; it is not Spectrum-compatible.                                                                                                                             |
|   6 | [Radix Colors scale usage](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)                                                                                                                                    | Gray step 6 `#d9d9d9/#3a3a3a` is for subtle noninteractive borders; step 7 `#cecece/#484848` for interactive borders; step 8 `#bbbbbb/#606060` for stronger interactive borders and focus rings.                                            | Strong independent evidence for separating noninteractive, interactive, and strong boundary roles.                        | Focus is deliberately included in Radix step 8 but remains out of scope for NosLog `C5M-05`.                                                                                                       |
|   7 | [Atlassian border foundation](https://atlassian.design/foundations/border)                                                                                                                                                                      | Current Light/Dark token data resolves default border to `#0B120E24/#E3E4F21F`, input border to `#8c8f97/#7e8188`, and disabled border to `#0515240F/#CECED912`. Selected and focus use separate chromatic aliases.                         | Confirms that ordinary separators and input-identifying boundaries are materially different strengths.                    | Alpha values and chromatic states belong to Atlassian themes; they are role evidence only.                                                                                                         |
|   8 | [GitLab Pajamas border foundation](https://design.gitlab.com/product-foundations/border/)                                                                                                                                                       | Subtle `#ececef/#3a383f`, default `#dcdcde/#4c4b51`, strong `#bfbfc3/#626168`; section boundary maps contextually. Borders are normally `1px`, with `2px` reserved for some states/emphasis.                                                | Closely validates the approved NosLog role inventory and restrained 1px/2px architecture.                                 | Pajamas values and contextual section behavior cannot be spliced into Spectrum.                                                                                                                    |
|   9 | [PatternFly colors](https://www.patternfly.org/foundations-and-styles/colors/)                                                                                                                                                                  | Default/subtle resolves to `#e0e0e0/#4d4d4d`; control default resolves to `#8c8c8c/#a3a3a3`; read-only is weaker.                                                                                                                           | Confirms a large strength jump when a boundary identifies an operable control.                                            | PatternFly's Red Hat ramp and theme-specific indirection are not eligible values.                                                                                                                  |
|  10 | [Base Web theming](https://baseweb.design/guides/theming/)                                                                                                                                                                                      | `borderOpaque #f3f3f3/#292929`, transparent border at 8% per appearance, and selected `#000000/#dedede`; its published scale also provides 4%–24% neutral border steps.                                                                     | Shows a system that keeps quiet framing very subtle while giving selection separate strong ownership.                     | The alpha/opaque model is not Spectrum's mapping and selected state is outside this gate.                                                                                                          |
|  11 | [SAP Fiori design tokens](https://experience.sap.com/fiori-design-web/design-tokens/)                                                                                                                                                           | Horizon Light/Dark: list border `#e5e5e5/#2e3742`, group content `#d9d9d9/#323c48`, field border `#556b81/#a9b4be`; tile border is transparent.                                                                                             | Strong production evidence that lists, groups, fields, and tiles should not share one universal line value.               | SAP's cool-gray themes and component-level contract are not a transplant candidate.                                                                                                                |
|  12 | [Shopify Polaris](https://shopify.dev/docs/api/polaris)                                                                                                                                                                                         | Published token data maps visual-divider `color-border-secondary` to `#ebebeb` in Light and overrides it to `#4a4a4a` in Dark. Base input borders use `#8a8a8a`, hover `#616161`, and active `#1a1a1a`.                                     | Confirms that divider and input boundaries have different strength and state responsibility.                              | The current public site no longer exposes a complete paired table; only verified package pairs are used here.                                                                                      |
|  13 | [Elastic EUI borders](https://eui.elastic.co/next/docs/getting-started/theming/tokens/borders/)                                                                                                                                                 | Current active-theme documentation resolves the main border to `#e3e8f2`, with `1px` thin, `2px` thick, and a separate form-specific border color; high contrast replaces the color with a stronger shade.                                  | Confirms width and color are separate decisions and forms may require a stronger component token.                         | The static page exposes only its active theme, so EUI is architecture evidence rather than an exact dual-mode candidate.                                                                           |
|  14 | [Ant Design theme tokens](https://ant.design/docs/react/customize-theme/) and [Dark mode](https://ant.design/docs/spec/dark/)                                                                                                                   | Ant separates `colorBorder`, lighter `colorBorderSecondary`, and `colorSplit`; the current Light component table resolves `colorSplit` to `rgba(5,5,5,.06)`, while Dark values are algorithmically derived.                                 | Confirms ordinary borders and dividers are not automatically the same strength.                                           | No stable static Light/Dark neutral pair is published on one authority page; not eligible for value adoption.                                                                                      |
|  15 | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)                                                                                                                                                                            | Production Light roles include border `#b1b4b6`, input border/text `#0b0c0c`, and focus kept separate.                                                                                                                                      | Reinforces a much stronger input boundary than decorative grouping and maintained semantic ownership.                     | No general Dark theme, so this is architecture evidence only.                                                                                                                                      |
|  16 | [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                                                                                | Necessary component/state/graphic cues require at least `3:1` against adjacent colors. Decorative boundaries, sufficiently identified hit areas, and inactive components have different applicability.                                      | Supplies the pass/fail rule and prevents both over-outlining everything and under-identifying required controls.          | WCAG evaluates outcomes; it does not choose a palette, role name, or aesthetic strength.                                                                                                           |

## Convergence and Disagreement

### Strong convergence

1. Decorative separation and a boundary required to identify an interactive control
   are different semantic responsibilities.
2. Light/Dark systems preserve role names but often use asymmetrical values; blindly
   inverting one Light gray is not an accepted theme method.
3. Dividers and repeated framing are intentionally quiet. Strong borders are used
   selectively, especially for fields, controls, selected states, or meaningful
   graphics.
4. Disabled, focus, selected, and feedback boundaries have separate state ownership.
5. `1px` is the common structural line. A `2px` line is generally state or emphasis,
   not a substitute for insufficient required contrast.
6. Component systems frequently introduce component aliases after the semantic layer;
   one universal border value is not sufficient for every UI object.

### Material disagreement

1. Systems differ on how many decorative steps they expose. Spectrum's guidance has
   two (`gray-200/300`), while some systems merge them and others add layer-specific
   steps.
2. Some systems use alpha borders, others opaque values. The common principle is
   semantic responsibility and verified adjacency, not a portable opacity formula.
3. Some systems give ordinary inputs an accessible-strength border by default; others
   use a weaker border only when label, fill, shape, and layout already identify the
   field. NosLog must state this condition explicitly.
4. Focus and selection are often chromatic upstream, but that does not override the
   approved NosLog rule that normal interaction is neutral by default and focus has a
   separate later gate.

## Spectrum Authority Correction

The provisional mapping in document `34` is well supported by Spectrum's published
role ladder, but its provenance must be described precisely:

1. The `gray-200/300/400/600` ladder comes from Spectrum's public color-system role
   guidance and exact approved S2 primitives.
2. Current S2 alias data publishes `disabled-border-color → gray-300`, but does not
   expose one general `divider`, `border-default`, or `border-strong` alias set.
3. Current S2 component data contains justified exceptions, including transparent
   borders and component-specific strong borders. Therefore approval of a Foundation
   mapping would not approve every component assignment automatically.
4. NosLog may adopt the published role ladder without claiming that these four NosLog
   names are current upstream S2 aliases. Component aliases must be validated later
   against real NosLog content and adjacency.

## Candidate Mapping

### `NB-A` — adopt Spectrum's published neutral boundary ladder

| NosLog role      | Spectrum source |     Light |      Dark | Contract                                                                                                                     |
| ---------------- | --------------- | --------: | --------: | ---------------------------------------------------------------------------------------------------------------------------- |
| `divider`        | `gray-200`      | `#e1e1e1` | `#323232` | Decorative rhythm only; spacing, headings, or structure already express the relationship                                     |
| `border-subtle`  | `gray-300`      | `#dadada` | `#393939` | Nonessential framing and the published disabled-border value; semantic aliases remain separate even when the value is shared |
| `border-default` | `gray-400`      | `#c6c6c6` | `#444444` | Ordinary field/container boundary only when label, fill, shape, placement, or another sufficient cue already identifies it   |
| `border-strong`  | `gray-600`      | `#717171` | `#8a8a8a` | Necessary neutral control or graphic boundary that must remain identifiable on every approved surface                        |

`border-strong` does not own focus and does not automatically own selected state.
Those states need later component/state decisions and non-color cues. Sharing
`gray-300` between a subtle frame and a disabled boundary is value reuse, not semantic
interchangeability.

### `NB-B` — use current S2 component tokens only

This option would avoid a general boundary Foundation and copy each S2 component's
border token separately. It is not recommended because NosLog has component families
that do not have direct S2 equivalents, and it would leave dividers, chart/viewer
edges, dense ranking boundaries, and future component governance unresolved.

### `NB-C` — replace the entire neutral source

Material 3, Fluent 2, Carbon, Primer, GitLab, or another maintained system could be
evaluated as an intact replacement only by reopening `FCM-12`. Its primitives and
semantic mapping would replace Spectrum rather than being mixed with it.

No measured boundary failure currently justifies reopening the approved primitive
source. `NB-C` is therefore not recommended now.

## Measured Compatibility with Approved `M-A` Surfaces

The following ratios compare every proposed opaque boundary value to every approved
opaque surface. Values are `Light / Dark`.

| Boundary           |      `canvas` |     `surface` |      `sunken` |      `raised` |     `overlay` | Contract result                                     |
| ------------------ | ------------: | ------------: | ------------: | ------------: | ------------: | --------------------------------------------------- |
| `gray-200` divider | `1.31 / 1.47` | `1.23 / 1.34` | `1.08 / 1.47` | `1.31 / 1.24` | `1.31 / 1.24` | Decorative only                                     |
| `gray-300` subtle  | `1.40 / 1.64` | `1.32 / 1.49` | `1.15 / 1.64` | `1.40 / 1.38` | `1.40 / 1.38` | Nonessential/disabled only                          |
| `gray-400` default | `1.71 / 1.94` | `1.61 / 1.77` | `1.41 / 1.94` | `1.71 / 1.63` | `1.71 / 1.63` | Cannot be the only necessary cue                    |
| `gray-600` strong  | `4.88 / 5.47` | `4.60 / 4.99` | `4.02 / 5.47` | `4.88 / 4.61` | `4.88 / 4.61` | Passes the `3:1` necessary-boundary gate everywhere |

These measurements do not mean every available control needs `gray-600`. They mean
that whenever the boundary itself is necessary, the first three values are
ineligible as the sole cue on the approved surfaces.

## Recommendation for User Review

Advance `NB-A` into a dedicated boundary specimen without approving `C5M-05` yet.

Rationale:

1. It is the only candidate that preserves both the approved Spectrum primitive
   source and Spectrum's own published decorative/field/control hierarchy.
2. Fifteen system references plus WCAG independently support the responsibility split.
3. It corrects the main risk in the provisional table by removing focus and automatic
   selection ownership from `border-strong`.
4. It explicitly prevents low-contrast `gray-400` from becoming the only cue for an
   otherwise invisible input or control.
5. It keeps normal Dark boundaries neutral and restrained; browser-generated white
   forced-colors outlines remain outside the normal theme.

This recommendation authorizes only the next guide specimen and measurement work if
the user approves that direction. It does not authorize production tokens or
application implementation.

## Required Boundary Specimen Gate

Before `C5M-05` can close, a specimen must verify:

1. `divider`, `border-subtle`, `border-default`, and `border-strong` on every actual
   `M-A` surface in Light and Dark;
2. list rows, dense ranking/table divisions, flat content groups, cards, raised
   content, menus/popovers, dialog edges, viewer/editor wells, jacket/image edges,
   inputs, checkboxes/radios/switches, and unavailable controls;
3. cases where spacing or fill makes a boundary nonessential and cases where the line
   is the only necessary cue;
4. normal, hover, pressed, selected, disabled, error, and focus-visible compositions,
   while keeping focus and chromatic feedback values visibly marked as out of scope;
5. Korean, Japanese, and English real content at `320px`, `390px`, intermediate and
   desktop widths, plus `200%` zoom;
6. keyboard operation and active `forced-colors`, confirming system outlines are not
   copied into normal Dark mode;
7. exact adjacent-color contrast for every necessary boundary, including inside and
   outside colors when a line touches two surfaces; and
8. review for excessive boxing, double borders, nested frames, and dense-page noise.

If a component fails, first correct semantic ownership, fill/spacing/shape, or use the
approved stronger role. Do not invent an in-between gray or borrow another system's
value locally.

## Decision Log

| ID       | Entry                                                                                                                                               | Status                               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `C5B-01` | Treat Tailwind colors, templates, and default border styling as outside C5 boundary authority.                                                      | `Approved governance — inherited`    |
| `C5B-02` | Sixteen official sources converge on separating decorative separation from a necessary control/graphic boundary.                                    | `Observed`                           |
| `C5B-03` | Current S2 has no single universal neutral border alias; the four-step ladder is published Spectrum role guidance mapped to approved S2 primitives. | `Observed correction`                |
| `C5B-04` | White active-forced-colors outlines are browser/user overrides, not normal Dark-theme candidates.                                                   | `Approved clarification — inherited` |
| `C5B-05` | Use `gray-200/300/400/600` as `NB-A`, with the role contracts and value pairs above.                                                                | `Proposed — user review pending`     |
| `C5B-06` | Remove focus and automatic selected-state ownership from the provisional `border-strong` contract.                                                  | `Proposed correction`                |
| `C5B-07` | A boundary that is the only necessary cue must use a measured role that reaches `3:1` against every adjacent color.                                 | `Required accessibility gate`        |
| `C5B-08` | Build and verify the bilingual boundary specimen before deciding `C5M-05`.                                                                          | `Proposed next step`                 |
