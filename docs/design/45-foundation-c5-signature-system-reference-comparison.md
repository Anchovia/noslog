# NosLog 2.0 C5 Signature-System Reference Comparison

## Document Control

- Status: `Original ten-system comparison preserved — SS-08 selected as the NosLog
identity source after document 47; action and component aliases pending`
- Canonical language: English
- Korean companion:
  [45-foundation-c5-signature-system-reference-comparison.ko.md](./45-foundation-c5-signature-system-reference-comparison.ko.md)
- Date: 2026-08-10
- Scope: compare ten maintained design-system signature or primary-action color
  mappings under the approved NosLog neutral and restrained-use contracts
- Inputs: documents `32`–`44`, official design guidance, and versioned first-party
  token packages listed below
- Excludes: logo recoloring, feedback/domain/data-visualization hues, final identity
  and action component aliases, and production implementation

This is the replacement for an improvised hue-territory exercise. It does not create
blue, purple, or achromatic values for NosLog. Each candidate preserves one source's
published Light/Dark role and state mapping without interpolation or cross-system
mixing. The user is choosing which source behavior is worth advancing to measured
NosLog specimens, not approving a finished palette from this table alone.

The ten candidates and their original validation remain intact. Document `46` adds
an eighteen-source information-service audit and ten non-blue or role-split
references beside this set. It does not remove, rewrite, or silently disqualify any
candidate below.

On 2026-08-10 the user advanced `SS-08` Radix Colors Indigo and `SS-09` Shopify
Polaris to the identical actual-content comparison in document `47`. Advancement
is not source selection; the other eight candidates and this original evidence
remain preserved.

After that measured round, the user selected intact `SS-08` Radix Colors Indigo as
the NosLog identity source on 2026-08-10. The other nine systems remain preserved as
comparison evidence; they are not active identity sources.

## Related Documents

- [Foundation color and material candidates](./32-foundation-color-material-candidates.md)
- [Signature-color research and broad reference matrix](./33-foundation-signature-color-research.md)
- [Approved Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [Approved Fluent focus validation](./44-foundation-c5-fluent-focus-specimen-validation.md)
- [Information-service color audit and non-blue expansion](./46-foundation-c5-information-service-color-expansion.md)
- [Finalist actual-content comparison](./47-foundation-c5-finalist-noslog-context-comparison.md)
- [Interactive exact-system comparison](./specimens/c5-signature-system-comparison.html)

## Fixed Comparison Contract

1. Adobe Spectrum S2 continues to own every neutral surface, foreground, boundary,
   and neutral interaction value approved in documents `34`–`41`.
2. Fluent `colorStrokeFocus2` continues to own the approved focus-visible color and
   geometry in document `44`; a candidate never recolors focus.
3. Candidate color appears only as a small identity cue and, where the source
   publishes a complete suitable recipe, one rare filled primary action.
4. Ordinary links, filters, selected rows, cards, containers, difficulty, mode,
   hand, score, rank, feedback, external-brand, and visualization roles remain
   neutral or retain their separate domain ownership.
5. A source's Light set and Dark set are indivisible. NosLog may not combine, for
   example, Atlassian Light with Spectrum Dark, or replace a dark foreground because
   another source's white looks more familiar.
6. Missing state evidence is displayed as missing. It is not completed with an
   invented darker swatch.
7. `FCM-11`, `SIG-07`, and every over-accented example remain `Rejected` and are not
   inputs to this comparison.

## Evidence Coverage

Document `33` already compares sixteen independent organizations or standards plus
current NosLog evidence across accessibility, brand ownership, music products,
rhythm-game context, and adaptive Light/Dark behavior. This pass adds ten maintained
product-system mappings with exact values. The combined evidence exceeds the required
twelve-source threshold without counting duplicated package and documentation URLs as
independent references.

The values below were resolved on 2026-08-09 from official package releases. Package
files are reproducible evidence, not repository dependencies.

| Candidate                      | Official authority                                                                                                                                                                     | Evidence release                            | Compared published role                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| `SS-01` Adobe Spectrum S2      | [Color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/), [using color](https://spectrum.adobe.com/page/using-color/)                                  | `@adobe/spectrum-tokens@14.15.0`            | `accent-background-color-*` with the default blue accent family              |
| `SS-02` Microsoft Fluent 2 Web | [Color tokens](https://fluent2.microsoft.design/color-tokens2/)                                                                                                                        | `@fluentui/tokens@1.0.0-alpha.23`           | `colorBrandBackground*` and `colorNeutralForegroundOnBrand`                  |
| `SS-03` IBM Carbon             | [Color tokens](https://carbondesignsystem.com/elements/color/tokens/), [Button](https://carbondesignsystem.com/components/button/usage/)                                               | `@carbon/themes@11.78.0`                    | primary Button background and on-color text                                  |
| `SS-04` GitHub Primer          | [Color primitives](https://primer.style/product/primitives/color/), [theme reference](https://primer.style/product/getting-started/react/theme-reference/)                             | `@primer/primitives@11.10.0`                | `bgColor-accent-emphasis` plus `fgColor-onEmphasis`                          |
| `SS-05` Atlassian              | [Color foundations](https://atlassian.design/foundations/color-new/), [tokens](https://atlassian.design/foundations/tokens/design-tokens/)                                             | `@atlaskit/tokens@16.5.0`                   | `color.background.brand.bold*` and `color.text.inverse`                      |
| `SS-06` PatternFly 6           | [Colors](https://www.patternfly.org/foundations/colors), [Button](https://www.patternfly.org/components/button/)                                                                       | `@patternfly/patternfly@6.6.1`              | primary Button mapped through global brand and on-brand tokens               |
| `SS-07` SAP Horizon            | [Theming](https://www.sap.com/design-system/fiori-design-web/foundations/styles/colors/theming)                                                                                        | `@sap-theming/theming-base-content@11.36.5` | emphasized Button default, hover, active, and text roles                     |
| `SS-08` Radix Colors Indigo    | [Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale), [Indigo](https://www.radix-ui.com/colors/docs/palette-composition/scales) | `@radix-ui/colors@3.0.0`                    | Indigo steps `9` and `10`, whose documented uses are solid default and hover |
| `SS-09` Shopify Polaris        | [Color tokens](https://polaris-react.shopify.com/tokens/color)                                                                                                                         | `@shopify/polaris-tokens@9.4.2`             | `color-bg-fill-brand*` and `color-text-brand-on-bg-fill`                     |
| `SS-10` MUI default            | [Palette](https://mui.com/material-ui/customization/palette/), [Button](https://mui.com/material-ui/react-button/)                                                                     | `@mui/material@9.3.1`                       | default primary palette and contained Button hover mapping                   |

## Exact Light/Dark Sets

Hex values are normalized to uppercase only for legibility; their sRGB values are
unchanged. “Pressed” is omitted when the upstream color mapping does not publish a
distinct pressed fill. It must not be inferred from a nearby scale step.

| Candidate            | Light default / hover / pressed             | Light on-color              | Dark default / hover / pressed              | Dark on-color                                | White/black text contrast at default |
| -------------------- | ------------------------------------------- | --------------------------- | ------------------------------------------- | -------------------------------------------- | -----------------------------------: |
| `SS-01` Adobe        | `#3B63FB` / `#274DEA` / `#274DEA`           | `#FFFFFF`                   | `#4069FD` / `#345BF8` / `#345BF8`           | `#FFFFFF`                                    |                      `4.81` / `4.51` |
| `SS-02` Fluent       | `#0F6CBD` / `#115EA3` / `#0C3B5E`           | `#FFFFFF`                   | `#115EA3` / `#0F6CBD` / `#0C3B5E`           | `#FFFFFF`                                    |                      `5.38` / `6.66` |
| `SS-03` Carbon       | `#0F62FE` / `#0050E6` / `#002D9C`           | `#FFFFFF`                   | `#0F62FE` / `#0050E6` / `#002D9C`           | `#FFFFFF`                                    |                      `5.00` / `5.00` |
| `SS-04` Primer       | `#0969DA` / not published for this role / — | `#FFFFFF`                   | `#1F6FEB` / not published for this role / — | `#FFFFFF`                                    |                      `5.19` / `4.63` |
| `SS-05` Atlassian    | `#1868DB` / `#1558BC` / `#144794`           | `#FFFFFF`                   | `#669DF1` / `#8FB8F6` / `#ADCBFB`           | `#1F1F21`                                    |                      `5.20` / `6.00` |
| `SS-06` PatternFly   | `#0066CC` / `#004D99` / no distinct fill    | `#FFFFFF`                   | `#92C5F9` / `#B9DAFC` / no distinct fill    | `#1F1F1F`                                    |                      `5.57` / `9.09` |
| `SS-07` SAP          | `#0070F2` / `#0064D9` / `#FFFFFF`           | `#FFFFFF`; active `#0064D9` | `#0070F2` / `#0064D9` / `#213131`           | `#FFFFFF`; hover `#F5F6F7`; active `#4DB1FF` |                      `4.57` / `4.57` |
| `SS-08` Radix Indigo | `#3E63DD` / `#3358D4` / no distinct fill    | `#FFFFFF`                   | `#3E63DD` / `#5472E4` / no distinct fill    | `#FFFFFF`                                    |                      `5.21` / `5.21` |
| `SS-09` Polaris      | `#303030` / `#1A1A1A` / `#1A1A1A`           | `#FFFFFF`                   | `#FFFFFF` / `#F3F3F3` / `#F7F7F7`           | `#303030`                                    |                    `13.20` / `13.20` |
| `SS-10` MUI          | `#1976D2` / `#1565C0` / no distinct fill    | `#FFFFFF`                   | `#90CAF9` / `#42A5F5` / no distinct fill    | `rgba(0,0,0,.87)`                            |          `4.60` / `10.03` composited |

The ratios measure the published default on-color against the published default fill
using WCAG relative luminance. They establish normal-text viability for the displayed
pair only. They do not approve the hue, state sequence, identity distinctiveness,
focus behavior, or every possible component composition.

## Comparable Patterns and Material Differences

### Strong convergence

- Nine chromatic candidates occupy a blue-to-indigo range. Eight are ordinary blue;
  Radix Indigo is the only blue-violet edge case. The convergence is evidence that
  blue is a stable professional action color, not evidence that it will be distinctive
  for NosLog.
- Every source changes either the fill, the foreground, or both between Light and Dark
  when its contrast or visual-weight model requires it. Literal same-hex behavior is
  not the dominant architecture, even when Carbon, SAP, and Radix happen to keep the
  same default value.
- All complete filled-action pairs clear `4.5:1` at their default state. Accessibility
  therefore does not select a winner among these default pairs.

### Meaningful disagreements

- Atlassian, PatternFly, Polaris, and MUI reverse toward a light Dark-theme fill with
  a dark foreground. Adobe and Primer brighten more modestly while retaining white
  text. Fluent changes to a darker blue in Dark. Carbon, SAP, and Radix keep one
  default hex across themes.
- Polaris is deliberately achromatic. It is the only candidate that preserves the
  current monochrome identity direction while still publishing complete theme-aware
  brand fills.
- Primer's accent-emphasis role is valid identity evidence but not a complete generic
  filled-action state family. Advancing it would authorize identity testing only;
  the rare action must remain neutral until a suitable intact Primer component
  mapping is identified and separately approved.
- SAP active state is a structural inversion, not a simple darker pressed color.
  Reducing it to one swatch would misrepresent the upstream system.

## NosLog Applicability and Risks

| Candidate            | Transferable strength                                                                       | NosLog-specific risk or limitation                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SS-01` Adobe        | Already aligned with the approved neutral-source organization; compact exact state family   | Adopting the accent would be a separate approval from the neutral source and could make the entire foundation look copied from one vendor unless identity placement remains very restrained |
| `SS-02` Fluent       | Conservative single-hue blue with clear state reversal and strong normal-text contrast      | Close to ordinary enterprise interaction blue and to current migration/Toss-like blue; recognition may be weak                                                                              |
| `SS-03` Carbon       | Stable, high-salience primary action with identical theme values                            | Extremely familiar IBM/technical blue and visually loud beside game artwork                                                                                                                 |
| `SS-04` Primer       | Familiar production accent with restrained Dark/Light change                                | Incomplete as a generic action recipe; GitHub association and generic web-product character are strong                                                                                      |
| `SS-05` Atlassian    | Most explicit theme-aware contrast inversion and full three-state mapping                   | Light cyan-blue Dark fill may compete with NosLog left-hand/chart cyan and becomes visually heavier on Dark                                                                                 |
| `SS-06` PatternFly   | High Dark-theme readability and an intact component mapping                                 | Very pale Dark fill has the greatest area weight and can dominate a quiet content-led shell                                                                                                 |
| `SS-07` SAP          | Conservative enterprise blue with a fully specified active inversion                        | Fixed default blue is generic; active inversion introduces more structural behavior than NosLog may need                                                                                    |
| `SS-08` Radix Indigo | Only compared chromatic set that moves toward blue-violet; stack-compatible scale semantics | Approaches Discord, Real, Twitch, and current purple-domain territory; a scale is not a NosLog brand by itself                                                                              |
| `SS-09` Polaris      | Achromatic, professional, strongest contrast, and lowest collision with domain hues         | Does not create a colored signature; identity must come from mark, typography, proportion, and placement                                                                                    |
| `SS-10` MUI          | Extremely recognizable default implementation pattern and clear adaptive foreground         | Highest “starter-template” familiarity; adopting it would directly recreate the generic material look the user wants to avoid                                                               |

## Original Exact-System Browser Validation — 2026-08-09

The interactive artifact was rendered from the local specimen server in the Codex
in-app browser. This validation proves the comparison fixture, not any candidate's
fitness for NosLog.

| Check                  | Observed result                                                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wide comparison        | At `1440 × 1000`, `10` candidate cards and `20` Light/Dark panels rendered with no horizontal overflow and no missing mark images.                                                              |
| Compact reflow         | At `320 × 900`, the content width remained `320px`, the candidate card was `304px`, both the candidate grid and Light/Dark pair collapsed to one column, and horizontal overflow remained zero. |
| Touch targets          | Every displayed `button` and `a` target measured at least `44px` high at `320px`.                                                                                                               |
| Default text pairs     | All `20` published default fill/on-color pairs met `4.5:1`; the fixture reported zero failures.                                                                                                 |
| Published hover wiring | Adobe Light rendered `#274DEA` (`rgb(39,77,234)`) on pointer hover, matching the published alias. Other candidate state values remain visible as exact source swatches for user comparison.     |
| Selection control      | Two candidates could be marked simultaneously with neutral `#717171` boundaries and explicit check text; the artifact kept the “not approved” message.                                          |
| Filter control         | Activating `Indigo 1개` left exactly `SS-08 Radix Colors Indigo` visible and moved `aria-pressed` to that filter.                                                                               |
| Focus-visible          | Keyboard activation produced the approved zero-gap pseudo-boundary: Light black and Dark white, `2px` border, `inset: -2px`, with no persistent authored outline at rest.                       |
| Runtime integrity      | Console error/warning inspection returned no entries during the tested flows.                                                                                                                   |

The fixture includes a `forced-colors: active` `Highlight` fallback, but a native
forced-colors runtime was not emulated in this pass. Candidate-specific color-vision
simulation, real jacket/domain collision, localization stress, and `200%` text remain
the next measured-context round after user selection.

This table records the original ten-system section. The added information-service
and non-blue reference section is validated and recorded separately in document `46`.

## Selection Outcome

1. Intact `SS-08` Radix Colors Indigo is the approved NosLog identity source.
2. Its exact published Light/Dark mapping remains one indivisible source set; no
   interpolation, hue shift, or cross-system state substitution is allowed.
3. The other nine candidates remain preserved comparison evidence and are not active
   identity sources.
4. Identity touchpoint aliases, filled-action eligibility, and final component aliases
   remain later approval gates.
5. If the approved mapping fails a later NosLog content, semantic-separation, or
   accessibility requirement, reopen the decision rather than silently changing values.

## Decision Log

| ID       | Entry                                                                                                           | Status                                        |
| -------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `SSC-01` | Replace the improvised H0/H1/H2/H3 comparison method with exact, versioned, maintained system mappings.         | `Proposed`                                    |
| `SSC-02` | Compare ten systems under fixed Spectrum S2 neutrals, neutral ordinary interaction, and Fluent focus.           | `Research complete`                           |
| `SSC-03` | Preserve every candidate's Light/Dark, hover/pressed, and on-color mapping as one indivisible source set.       | `Approved source-integrity rule — 2026-08-10` |
| `SSC-04` | Treat Primer as identity-only evidence unless a complete suitable upstream action mapping is separately found.  | `Observed`                                    |
| `SSC-05` | Do not treat a passing default text contrast ratio as source approval.                                          | `Required evaluation rule`                    |
| `SSC-06` | Advance selected exact source system(s) to the measured NosLog-context specimen round.                          | `SS-08 and SS-09 measured; SS-08 selected`    |
| `SSC-07` | Preserve this ten-system set while document `46` adds information-service and non-blue role evidence beside it. | `Observed`                                    |
| `SSC-08` | Compare SS-08 and SS-09 with identical real NosLog content without discarding the other candidates.             | `Completed in document 47 — 2026-08-10`       |
| `SSC-09` | Select intact SS-08 Radix Colors Indigo as the NosLog identity source without approving component aliases.      | `Approved — 2026-08-10`                       |
