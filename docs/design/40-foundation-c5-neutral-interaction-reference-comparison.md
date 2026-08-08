# NosLog 2.0 C5 Neutral Interaction Reference Comparison

## Document Control

- Status: `Research complete; NI-A proposed for user review; C5M-06 remains open`
- Canonical language: English
- Korean companion:
  [40-foundation-c5-neutral-interaction-reference-comparison.ko.md](./40-foundation-c5-neutral-interaction-reference-comparison.ko.md)
- Started: 2026-08-09
- Scope: compare ordinary neutral `rest`, `hover`, `pressed`, `selected`, and
  `disabled` container-state architecture before deciding `C5M-06`
- Inputs: approved `M-A`, `F-A`, and `NB-A`; the provisional interaction text in
  document `34`; current official design-system guidance and distributed token data;
  current Adobe Spectrum S2 alias and component token data; and WCAG 2.2
- Excludes: focus-indicator color and geometry, signature/chromatic selection,
  feedback states, component shape and motion, final component aliases, production
  implementation, and high-fidelity page design

This document does not approve a universal interaction color. It tests whether such a
universal color exists in Spectrum S2 and whether it would be appropriate for NosLog.

## Related Documents

- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.md)
- [C5 neutral foreground comparison](./36-foundation-c5-neutral-foreground-reference-comparison.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.md)
- [C5 neutral boundary comparison](./38-foundation-c5-neutral-boundary-reference-comparison.md)
- [C5 neutral boundary specimen validation](./39-foundation-c5-neutral-boundary-specimen-validation.md)

## Authority and Comparison Rules

1. Adobe Spectrum S2 remains the approved exclusive source of exact Light/Dark
   neutral primitives. External systems may validate state architecture, but their
   values cannot be mixed into the Spectrum scale.
2. Tailwind CSS is an implementation tool only. Its palette, starter interaction
   colors, opacity recipes, and templates are not evidence for this decision.
3. Equivalent responsibilities are compared: transparent or inherited rest,
   supplemental hover, transient pressed/down, persistent selection, and genuinely
   unavailable controls.
4. An identically named state is not assumed to have the same product responsibility
   across systems. A row, menu item, table row, button, and selection control may use
   different component recipes.
5. Approved `F-A` interaction-content strengthening and `NB-A` boundaries remain
   fixed. This gate does not reopen them.
6. Focus remains a separate gate. A source's hover-like keyboard-focus fill does not
   authorize its focus ring, hue, or geometry for NosLog.
7. Signature and feedback colors remain later decisions. Ordinary selection stays
   neutral in this gate; a source's brand-colored selection is not imported.
8. The Rejected over-accented `FCM-11` and `SIG-07` examples are excluded and must not
   be reused as evidence or targets.

## Normalized State Responsibilities

| Responsibility | Meaning                                      | Required contract                                                                                                  |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Rest           | Available ordinary action before interaction | May be transparent or inherit its approved `M-A` surface; the action must still be identifiable where required     |
| Hover          | Supplemental pointer-position feedback       | Must not be the only affordance; does not itself need `3:1`, but cannot erase required component or state contrast |
| Pressed/down   | Short-lived activation feedback              | Must be distinguishable in motion or appearance without becoming a persistent selected state                       |
| Selected       | Persistent chosen/current state              | Needs correct programmatic state and a persistent visible cue; a low-contrast fill alone is insufficient           |
| Disabled       | Genuinely unavailable action                 | Must not respond to hover/press, contain required instructions, or be simulated merely to lower emphasis           |

## Official Reference Matrix

Sixteen independent official sources were reviewed. Fifteen are maintained design
systems or production authorities; WCAG 2.2 is the evaluation authority. Exact values
are included when the current authority exposes them statically. Architecture-only
sources are not treated as value donors.

|   # | Official system/source                                                                                                                                                                                                                                                  | Equivalent published state model and values                                                                                                                                                                                 | Transferable principle                                                                                                                         | Applicability limit                                                                                                |
| --: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
|   1 | [Adobe Spectrum S2 aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/) and [component colors](https://opensource.adobe.com/spectrum-design-data/tokens/color-component/)                                                                  | Global data publishes default opacity `0`, hover/down opacity `0.1`, disabled `#e9e9e9/#2c2c2c`, `#dadada/#393939`, and `#c6c6c6/#444444`. Component data gives different Stack, Menu, Table, and Tree recipes.             | The approved source itself treats state fill as component-contextual rather than one universal gray.                                           | Exact component composition must be preserved; a color input without its opacity or component rule is incomplete.  |
|   2 | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                                                                                                        | Transparent-background hover/active/selected/selected-hover use Gray 50 at `12%/50%/20%/32%`; layered Light states use `#e8e8e8`, `#c6c6c6`, `#e0e0e0`, and `#d1d1d1`.                                                      | Hover, active, selected, and selected-hover are separate semantic responsibilities, and layered components can have their own state family.    | Carbon opacity and layer recipes belong to Carbon themes and cannot be spliced into Spectrum.                      |
|   3 | [Microsoft Fluent 2 color tokens](https://fluent2.microsoft.design/color-tokens2/) and [style reference](https://microsoft.github.io/fluentui-design-tokens/)                                                                                                           | `SubtleBackground` is transparent; hover is `#f5f5f5/#383838`, pressed `#e0e0e0/#2e2e2e`, selected `#ebebeb/#333333`; disabled neutral background is `#f0f0f0/#141414`.                                                     | A renowned system can publish a universal subtle family, but it does so as an intact alias set with deliberately asymmetric Light/Dark values. | Fluent values and state spacing cannot be mixed with Spectrum primitives.                                          |
|   4 | [Material 3 interaction states](https://m3.material.io/foundations/interaction/states/overview) and [Material Web ripple tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-ripple.scss)                                             | States use layered indicators; the Web implementation resolves hover and pressed color plus opacity through component ripple tokens. Material requires more than one indicator for important states.                        | State layers are supplemental component feedback, not a license to recolor every resting control.                                              | Dynamic Material schemes and ripple behavior are not exact NosLog values or motion rules.                          |
|   5 | [GitHub Primer color primitives](https://primer.style/product/primitives/color/) and [theme reference](https://primer.style/product/getting-started/react/theme-reference/)                                                                                             | Light transparent-control hover is `#818b981a`; current ActionList themes keep separate hover, active, and selected aliases. Dark reference examples use `rgba(177,186,196,.12/.20/.08)`.                                   | Large production interfaces separate transparent actions from filled controls and maintain component aliases across themes.                    | Primer's blue-gray alpha values and multiple accessibility themes are role evidence only.                          |
|   6 | [Atlassian color guidance](https://atlassian.design/foundations/color-new/)                                                                                                                                                                                             | A subtle neutral background has separate default, hovered, and pressed tokens; icon hover/press is shown by changing its background rather than its icon token. Selected, focused, and disabled are distinct states.        | State belongs to the semantic property and interaction responsibility, not to the nearest raw swatch.                                          | The public overview does not expose a complete static Light/Dark value table; architecture-only here.              |
|   7 | [Radix Colors scale usage](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)                                                                                                                                                            | Steps 3, 4, and 5 are normal, hover, and pressed/selected component backgrounds. If rest is transparent, step 3 may become hover.                                                                                           | Transparent-rest components need a different mapping from already-filled components.                                                           | Radix uses a generated scale and deliberately combines pressed with selected; its values are not Spectrum aliases. |
|   8 | [GitLab Pajamas color](https://design.gitlab.com/product-foundations/color/) and [design tokens](https://design.gitlab.com/product-foundations/design-tokens/)                                                                                                          | Neutral action rest is transparent in both modes; hover maps to dark alpha `6%` in Light and light alpha `16%` in Dark, active to `16%/8%`. Selected actions and disabled background/border/content have separate tokens.   | State aliases should encode mode, component responsibility, and persistent selection independently.                                            | GitLab selection can become strongly inverted and cannot be transplanted into the restrained Spectrum mapping.     |
|   9 | [PatternFly colors](https://www.patternfly.org/foundations-and-styles/colors/) and [Table](https://www.patternfly.org/components/table/)                                                                                                                                | PatternFly separates semantic interaction tokens; the Light clickable-row hover currently resolves to `#f2f2f2`, while selected table rows have a dedicated component token.                                                | Dense data rows deserve component-level state ownership instead of inheriting a generic button recipe.                                         | Red Hat values and chromatic selection conventions are ineligible primitives.                                      |
|  10 | [Base Web colors](https://baseweb.design/guides/colors/) and [theming](https://baseweb.design/guides/theming/)                                                                                                                                                          | Primitive, semantic, and component layers are separate. Light/Dark themes expose component colors plus distinct selected and disabled roles; `backgroundStateDisabled` is `#f3f3f3/#292929`.                                | A reusable Foundation need not flatten component state colors into one global alias.                                                           | Base Web's alpha/opaque model and selected contrast belong to its own component set.                               |
|  11 | [Shopify Polaris state guidance](https://polaris-react.shopify.com/design/colors/color-tokens) and [current token table](https://polaris-react.shopify.com/tokens/color)                                                                                                | Light transparent fill progresses `2%` rest, `5%` hover, `8%` active/selected; surface and small-fill families use separate state ladders and disabled roles.                                                               | Surface, fill, and transparent components require different state families even inside one product.                                            | The current public table is Light-only; it cannot supply NosLog's required exact dual-mode mapping.                |
|  12 | [SAP Fiori design tokens](https://experience.sap.com/fiori-design-web/design-tokens/) and [state guidance](https://experience.sap.com/fiori-design-web/explore_category/ui_component/page/2/)                                                                           | SAP names component-state tokens explicitly, such as `sapButton_Emphasized_Hover_Background`, and distinguishes hover, pressed, selected, and checked by component.                                                         | Component and state should both be present in token ownership; selection is not merely long-lived hover.                                       | SAP's cool-gray themes and product-specific selected treatments are architecture evidence only.                    |
|  13 | [Ant Design theme tokens](https://ant.design/docs/react/customize-theme/)                                                                                                                                                                                               | Light aliases expose text-like hover `rgba(0,0,0,.06)`, active `.15`, and disabled container `.04`; Dark values are generated by its theme algorithm.                                                                       | Hover, active, and disabled are distinct, but a static Light recipe is not a complete dual-theme source.                                       | Algorithmic Dark output and Ant's palette cannot be inserted into Spectrum.                                        |
|  14 | [Elastic EUI component tokens](https://eui.elastic.co/docs/getting-started/theming/tokens/component/) and [theme provider](https://eui.elastic.co/next/docs/getting-started/theming/theme-provider)                                                                     | EUI publishes component-specific default, hover, and disabled backgrounds and changes them through color-mode providers; its button primary hover example is an alpha component token.                                      | State values may properly belong to a component token rather than a global neutral fill.                                                       | The static docs expose only the active mode for many values, so EUI is architecture evidence.                      |
|  15 | [Salesforce SLDS color migration](https://developer.salesforce.com/blogs/2023/06/preparing-your-app-for-the-lightning-design-system-color-update) and [styling hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) | Salesforce directs custom UI to the exact component blueprint and semantic styling hook so upstream state and contrast updates propagate without local hard-coded approximations.                                           | Maintained component ownership is safer than choosing a visually similar global neutral.                                                       | The public guidance does not provide one complete neutral Light/Dark interaction table; architecture-only here.    |
|  16 | [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) and [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                      | Color cannot be the only visual means of conveying information. A necessary selected-state cue needs `3:1` against adjacent colors; supplemental hover fill does not itself need `3:1`, and inactive controls are excepted. | Separates subtle supplemental hover feedback from persistent state information that must remain identifiable.                                  | WCAG evaluates outcomes; it does not choose a palette, component recipe, or visual character.                      |

## Convergence and Disagreement

### Strong convergence

1. Rest, hover, pressed, selected, and disabled are semantic states, not arbitrary
   lighter or darker swatches.
2. Transparent-rest actions are common, but they still require identifiable content,
   geometry, placement, or another affordance where the control would otherwise be
   ambiguous.
3. Hover is supplemental and often intentionally quiet. Pressed is usually stronger
   or otherwise distinct, but only during activation.
4. Persistent selection has separate ownership from hover. Systems either give it a
   dedicated fill, a structural indicator, a selected control, or a combination.
5. Disabled background, border, and content are separate from secondary or subtle
   readable content.
6. Major systems preserve Light/Dark role names while allowing asymmetric values and
   component-specific recipes.
7. Component aliases are a real design-system layer. A global primitive or opacity
   alone does not fully specify a rendered state.

### Material disagreement

1. Some systems publish a reusable global subtle ladder, such as Fluent 2; others,
   including current Spectrum S2, publish materially different component recipes.
2. Pressed may equal hover, become stronger, or use a ripple/overlay. There is no
   cross-system universal opacity.
3. Selected state ranges from subtle neutral fill to strong inverse or chromatic fill.
   This difference follows product and component semantics, not a universal rule.
4. Disabled treatments use opaque aliases, alpha, or component opacity. Combining
   recipes from different systems would create a new unsourced hybrid.

## Exact Spectrum S2 Findings

### Global aliases do not define a universal neutral-state ladder

- `background-opacity-default` is `0`; hover and down are both `0.1`.
- `neutral-subtle-background-color-default` is only a default color-set:
  Light `#e9e9e9`, Dark `#393939`. It does not publish matching `hover`, `down`, or
  `selected` aliases.
- The full `neutral-background` family is a strong filled-control family:
  selected/default uses `gray-800` (`#292929/#dbdbdb`) and selected hover/down uses
  `gray-900` (`#131313/#f2f2f2`). It is not an ordinary subtle-row recipe.
- Disabled aliases are exact and separate: background `gray-100`
  (`#e9e9e9/#2c2c2c`), border `gray-300` (`#dadada/#393939`), and content
  `gray-400` (`#c6c6c6/#444444`). `opacity-disabled` is separately published as
  `0.3`.

The provisional document `34` statement that ordinary hover/down may use
`neutral-subtle-background-color-default` therefore cannot be promoted as a universal
mapping. It joined a color input to a state responsibility that Spectrum does not
publish globally.

### Current component data proves contextual ownership

| Spectrum component family | Published neutral state values                                                                                                                                                        | Consequence                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Stack item                | Unselected hover/down `gray-100` (`#e9e9e9/#2c2c2c`); selected rest `gray-100`; selected hover/key focus `gray-200` (`#e1e1e1/#323232`); selected down `gray-300` (`#dadada/#393939`) | A list-like component has a coherent opaque primitive ladder, but it is explicitly a Stack component family.                               |
| Tree view                 | Row hover and neutral selected rest/hover use `gray-100` (`#e9e9e9/#2c2c2c`)                                                                                                          | Tree selection does not automatically reuse the Stack selected hover/down progression.                                                     |
| Menu item                 | The state color-set is Light `#e9e9e9`, Dark `#323232` for default, hover, down, keyboard focus, and disabled                                                                         | Dark uses neither generic `neutral-subtle` `#393939` nor Stack `gray-100` `#2c2c2c`; rendered state still depends on the Menu composition. |
| Table row                 | Hover uses `gray-900` at `7%`, down at `10%`; neutral selected uses `gray-800` at `10%` and selected-hover at `15%`                                                                   | Dense rows use overlays, not the Stack's opaque gray ladder.                                                                               |

These are not inconsistencies to smooth over. They are evidence that Spectrum's
component alias layer owns the final interaction recipe.

## Measured Visibility Against Approved `M-A` Surfaces

Exact sRGB contrast was calculated between each rendered state and the unique approved
Light/Dark `M-A` surface colors. Repeated surface values were counted once. Table
overlays were composited in sRGB at the published opacity before measurement.

| Spectrum evidence              | Light state-to-surface range | Dark state-to-surface range | Interpretation                                          |
| ------------------------------ | ---------------------------: | --------------------------: | ------------------------------------------------------- |
| Stack/Tree `gray-100` fill     |            `1.00:1`–`1.21:1` |           `1.14:1`–`1.35:1` | Deliberately subtle supplemental state                  |
| Menu color input               |            `1.00:1`–`1.21:1` |           `1.24:1`–`1.47:1` | Still not a standalone necessary-state cue              |
| Table hover `gray-900` at `7%` |            `1.15:1`–`1.16:1` |           `1.17:1`–`1.22:1` | Appropriate only as supplemental pointer feedback       |
| Table down at `10%`            |            `1.22:1`–`1.24:1` |           `1.28:1`–`1.34:1` | Stronger transient feedback, still not a structural cue |
| Neutral selected row at `10%`  |            `1.20:1`–`1.21:1` |           `1.23:1`–`1.30:1` | Cannot identify selection by itself                     |
| Selected-row hover at `15%`    |            `1.32:1`–`1.33:1` |           `1.41:1`–`1.49:1` | Remains below the necessary-state `3:1` threshold       |

The measurements do not reject subtle fills. They define their responsibility: they
can improve scanning and feedback, but a required selected state must also have a
persistent visible and programmatic indicator.

## Candidate Comparison

### `NI-A` — preserve Spectrum component-family fidelity

Do not create one Foundation hover, pressed, or selected fill value. Establish the
universal state contract at Foundation level, then map each later component alias to
one complete published Spectrum S2 component family where an equivalent exists.

Status: `Proposed — recommended for a measured specimen; not approved`.

### `NI-B` — invent one opaque Spectrum primitive ladder

Possible local recipe: transparent rest, `gray-100` hover, `gray-200` selected/hover,
and `gray-300` pressed. This looks orderly but elevates one Stack pattern into a
global rule and conflicts with Table, Tree, and Menu evidence.

Status: `Not recommended — unsourced generalization`.

### `NI-C` — use one neutral overlay formula everywhere

Possible local recipe: transparent rest and a `10%` neutral overlay for hover,
pressed, and selected. This collapses distinct states, ignores the published `7%`,
`10%`, and `15%` Table progression, and does not solve persistent selection.

Status: `Not recommended — incomplete state architecture`.

### `NI-D` — replace Spectrum with another complete system

Fluent 2 or Carbon could provide an intact global state family only by reopening
`FCM-12` and replacing the approved neutral source across surfaces, foregrounds,
boundaries, and component aliases. No measured Spectrum failure currently requires
that change.

Status: `Available only after reopening FCM-12; not recommended now`.

## Proposed `NI-A` Foundation Contract

If approved for the next specimen, `NI-A` means:

1. An ordinary low-emphasis action rests transparent or inherits its approved `M-A`
   surface unless an exact Spectrum component family specifies another composition.
2. Foundation does not publish universal `interaction-bg-hover`,
   `interaction-bg-pressed`, or `selection-bg` values. Those aliases remain
   component-owned.
3. A component may adopt an exact Spectrum Stack, Tree, Menu, Table, or other
   equivalent recipe only as a complete mapping of color, opacity, and state. It may
   not take one value from one family and another state from a different family.
4. Existing `F-A` content states remain in force: default interactive content may
   strengthen to `gray-900`; subdued interactive content may strengthen to
   `gray-800`. This content change does not authorize a new container fill.
5. Existing `NB-A` boundaries remain in force. Hover or selection does not
   automatically add a white Dark-theme outline or promote every boundary to
   `border-strong`.
6. Ordinary persistent selection remains neutral and needs a programmatic state plus
   a persistent visible cue such as a checkmark, selected control indicator,
   current-position marker, or another measured structural cue. A subtle fill may
   supplement that cue but cannot be the only necessary indicator.
7. Disabled parts may use exact Spectrum aliases: background
   `#e9e9e9/#2c2c2c`, border `#dadada/#393939`, and content
   `#c6c6c6/#444444`. They do not receive hover or pressed states.
8. `opacity-disabled: 0.3` is used only when an exact Spectrum component token
   explicitly delegates to it. It is not compounded over the three disabled aliases
   by local choice.
9. Focus, signature/chromatic selection, feedback, motion, and component geometry
   remain separate approval gates.

## Required Specimen Gate

Approval of `NI-A` would authorize a dedicated guide specimen, not `C5M-06` closure.
The specimen must show and measure:

1. transparent-rest low-emphasis actions and already-filled controls on all actual
   `M-A` surfaces in Light and Dark;
2. Stack/list, Tree-like hierarchy, Menu, and dense Table families without merging
   their recipes;
3. rest, hover, pressed/down, selected, selected-hover, and disabled combinations;
4. selected states with and without a persistent non-fill cue, demonstrating why the
   fill-only version is invalid;
5. approved `F-A` content and `NB-A` boundaries held constant;
6. real NosLog Korean, Japanese, and English labels, long music titles, rank rows,
   metadata, unavailable actions, and multi-selection examples;
7. `320px`, `390px`, relevant intermediate widths, desktop density, and 200% zoom;
8. pointer, touch/no-hover, keyboard, forced-colors, and programmatic selected/disabled
   states without pre-approving the later custom focus treatment.

## Recommendation for User Review

Advance `NI-A` to the measured specimen and leave `C5M-06` open until that specimen is
reviewed.

Rationale:

1. It is the only candidate that preserves the approved Spectrum source without
   inventing a universal token that Spectrum itself does not publish.
2. It follows the project's stated preference for adopting a renowned maintained
   system's semantic mapping intact instead of synthesizing a Tailwind-like local
   palette or interaction recipe.
3. It preserves subtle interaction feedback while preventing a low-contrast fill
   from carrying selected-state meaning alone.
4. It corrects the provisional document `34` interpretation without silently
   replacing it with a different unverified global formula.
5. It keeps the Foundation lean: universal accessibility and governance rules live at
   Foundation level; exact visual states remain owned by the equivalent component.

## Decision Log

| ID       | Entry                                                                                                                                                  | Status                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `C5I-01` | Treat current Spectrum S2 component data, not `neutral-subtle-background-color-default` alone, as the authority for ordinary neutral container states. | `Observed`                    |
| `C5I-02` | Do not create one global hover/pressed/selected neutral fill from a Stack primitive ladder or generic opacity.                                         | `Proposed under NI-A`         |
| `C5I-03` | Require persistent ordinary selection to include a programmatic state and a measured non-fill cue; subtle neutral fill is supplemental.                | `Proposed under NI-A`         |
| `C5I-04` | Adopt exact disabled background, border, and content aliases without ad hoc compounded opacity.                                                        | `Proposed under NI-A`         |
| `C5I-05` | Keep focus, signature/chromatic selection, feedback, and final component aliases outside `C5M-06`.                                                     | `Observed scope boundary`     |
| `C5M-06` | Preserve Spectrum component-family fidelity for ordinary neutral interaction and selection.                                                            | `Open — user review required` |
