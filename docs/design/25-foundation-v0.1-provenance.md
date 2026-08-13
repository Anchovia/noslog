# NosLog 2.0 Foundation v0.1 Provenance and Decision Record

## Document control

- Status: `Approved — consolidated current decision record`
- Language: English
- Last updated: 2026-08-13
- Normative values: [document 24](./24-foundation-v0.1.md)
- Current scope: [document 57](./57-design-guide-remaining-work-audit.md)
- Purpose: preserve selected sources, candidate disposition, measured limitations,
  and user approvals without keeping every superseded comparison active

This document replaces the active authority of the former serial Foundation research,
comparison, specimen-validation, and approval files. Detailed historical tables and
comparison artifacts remain recoverable in Git history, but they are not current scope
or implementation targets.

## Research and decision method

Material Foundation decisions followed these rules:

1. compare at least twelve independent relevant authoritative or production sources,
   continuing past fifteen when credible additions still changed the result;
2. align equivalent semantic roles and actual Light/Dark values rather than unrelated
   marketing swatches;
3. prefer one maintained published source intact for each approved responsibility;
4. extract version-pinned values when packages were the most precise official source;
5. hold already approved NosLog inputs constant in controlled real-content specimens;
6. measure contrast, overflow, focus, localization, narrow widths, zoom, forced colors,
   reduced motion, and non-color alternatives as relevant;
7. let an unchanged source fail rather than silently adjusting it; and
8. require explicit user approval for the final material choice.

Tailwind palette values and starter styling were excluded. The legacy NOSTORY Figma
was not current design evidence. The over-accented `FCM-11` and `SIG-07` examples are
`Rejected` and may not be revived.

## Consolidated approval register

| Responsibility                        | Approved result                                                     | Date                              | Current boundary                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Typography family and delivery        | Pretendard JP Variable                                              | 2026-08-04/11                     | Family and hierarchy approved; official `1.3.9` variable dynamic subsets are version-pinned and first-party self-hosted under `FPR-02` |
| Type scale, spacing, grid, containers | NosLog role map derived from focused official reference comparison  | 2026-08-04–13                     | Exact normative map in document `24`; later approved bounded composites and fit rules are recorded below                               |
| Neutral primitives and surfaces       | `M-A · Adobe Spectrum S2`                                           | 2026-08-08                        | Exclusive Light/Dark neutral source                                                                                                    |
| Neutral foreground                    | `F-A · Adobe Spectrum S2`                                           | 2026-08-09                        | Exact content aliases only                                                                                                             |
| Neutral boundary                      | `NB-A · Adobe Spectrum S2`                                          | 2026-08-09                        | Quiet roles are not sole necessary cues                                                                                                |
| Neutral interaction                   | `NI-A · Spectrum component-family fidelity`                         | 2026-08-09                        | No universal interaction fill                                                                                                          |
| Keyboard focus                        | `FI-C · Fluent achromatic polarity + NosLog single-border geometry` | 2026-08-09/11, revised 2026-08-13 | Black Light / white Dark `1px` inside border on the control; the earlier two-layer geometry is `Superseded`                            |
| Reserved signature source             | `SS-08 · Radix Colors Indigo`                                       | 2026-08-10                        | No approved current UI alias                                                                                                           |
| Shell identity                        | `ITA-C · Achromatic`                                                | 2026-08-10                        | Neutral mark and wordmark; no Indigo field or default outline                                                                          |
| Filled primary action                 | `RPA-A · Achromatic primary`                                        | 2026-08-10                        | Spectrum neutral; at most one proven action per bounded context                                                                        |
| Material geometry                     | `MG-A · Adobe Spectrum S2`                                          | 2026-08-10                        | Exact radius, shadow, scrim mapping                                                                                                    |
| Feedback/status                       | `FS-BN · Atlassian semantic color + neutral message typography`     | 2026-08-10                        | Atlassian chroma, Spectrum message copy                                                                                                |
| Difficulty markers                    | `DU-01 · Adobe Spectrum S2`                                         | 2026-08-10/11                     | Four compact ordinary-UI markers plus the approved neutral-label `20px` result anatomy                                                 |
| Local data                            | `LD-03 · SAP Fiori Horizon`                                         | 2026-08-10                        | Single, score buckets, FAST/SLOW, generic categories                                                                                   |
| Judgement markers                     | `JD-02 · Radix Colors 3.0.0`                                        | 2026-08-10                        | Five judgement markers only; not FAST/SLOW                                                                                             |
| Iconography                           | `IC-06 · Lucide`                                                    | 2026-08-10                        | Eligible ordinary UI only                                                                                                              |
| Motion                                | `MO-02 · Atlassian`                                                 | 2026-08-10                        | Eligible ordinary UI and instant reduced mode                                                                                          |
| Data visualization anatomy            | `DV-05 · GitHub Primer`                                             | 2026-08-10                        | Ordinary non-viewer charts; NosLog retains its approved colors                                                                         |
| Foundation package                    | Document `24` contracts promoted together as Foundation v0.1        | 2026-08-11                        | Approved normative authority for eligible ordinary UI under `FPR-03`; implementation remains downstream                                |

## Typography, spacing, and layout provenance

The physical and semantic system was informed by independent official sources
including [Atlassian Typography](https://atlassian.design/foundations/typography/),
[IBM Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/),
[Primer Typography](https://primer.style/product/getting-started/foundations/typography/),
[USWDS Typography](https://designsystem.digital.gov/components/typography/),
[GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/),
[Ant Design Font](https://ant.design/docs/spec/font/),
[GitLab type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/),
[SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/),
[Microsoft Fluent Typography](https://fluent2.microsoft.design/typography),
[Material 3 typography](https://developer.android.com/develop/ui/compose/designsystems/material3),
[Adobe Spectrum typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/),
[LINE typography](https://designsystem.line.me/LDSG/foundation/typography-en),
[Japan Digital Agency typography](https://design.digital.go.jp/foundations/typography/),
[Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography),
[WCAG Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html),
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), and
[Pretendard JP](https://github.com/orioncactus/pretendard/tree/main/packages/pretendard-jp/docs/en).

Convergence supported a readable `16/24` body, compact `14/20` product UI, restricted
`12/16` metadata, a small upper hierarchy, natural tracking, and stable semantic roles
across scripts. Adjacent upper steps and page-local sizes were rejected because they
increased multilingual drift without distinct shared meaning.

Spacing and responsive comparisons included [Material 3 layout](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Carbon Grid](https://carbondesignsystem.com/elements/2x-grid/overview/),
[Atlassian Grid](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Fluent Layout](https://fluent2.microsoft.design/layout),
[Adobe Spectrum responsive grid](https://spectrum.adobe.com/page/responsive-grid/),
[Ant Design Layout](https://ant.design/docs/spec/layout/),
[Japan Digital Agency spacing](https://design.digital.go.jp/dads/foundations/spacing/),
[USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK spacing](https://design-system.service.gov.uk/styles/spacing/),
[LINE Layout](https://designsystem.line.me/LDSG/foundation/layout-en/),
[Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout),
[Primer Breakpoints](https://primer.style/product/primitives/breakpoints/),
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
and [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

The approved `672/1056px` page-layout thresholds are NosLog-specific measured
transitions: the selected margins, gutters, and 4/8/12 columns produce entry track
widths of approximately `63/64/68px`. Framework breakpoints were comparison evidence,
not the reason for those values.

Two later user decisions close measured gaps without reopening the source scale:

- `emphasis-label 14/20 · 600` is the thirteenth semantic composite. It owns compact
  message titles and persistent selected labels only; ordinary controls remain
  `control`.
- Music Detail may step an original title through `page-title` → `section-title` →
  `component-title`, choosing the largest composite that keeps the title, `4px` gap,
  and artist within the approved `96px` identity row. Wider title geometry was
  rejected because the required translation trigger increased total pressure.
- DestinationPanel compact labels use a separate measured `14/20` → `12/16` fit
  step, preserving the existing control-state weight and restoring `14/20` when the
  cell permits it. `320px` Korean, Japanese, and English Figma specimens established
  the bounded need; `390px` and Wide specimens restored every label to `14/20` on one
  line. The user approved `店舗`, `ご意見・報告`, and `Feedback` as concise destination
  copy. Smaller text, clipping, ellipsis, hidden destinations, and geometry changes
  made only to force one line remain rejected; two lines are the final reflow fallback.
- Re-measured 2026-08-14 with each locale bound to its own font family. Exactly four
  labels exceed the measured compact text slot at `14/20` and therefore take the fit
  step: the Korean data-synchronization label, the Japanese chart-viewer and
  feedback labels, and the English chart-viewer label. All four fit on one line at
  `12/16`, so the approved concise-copy step is not reached at `320px`.
- The first specimen additionally reduced the Japanese arcade label and the English
  feedback label, which the measurement does not support: both fit on one line at
  `14/20` with substantial room. They were restored to `14/20` under the standing rule
  that the larger step returns whenever the measured cell permits it.
- Cause of that error, recorded so it is not repeated: the Japanese and English
  specimens carried Korean-locale text styles, so their labels were measured and drawn
  in the Korean font. That font substitutes some kanji at a different advance width —
  one two-character Japanese label measured half its true width — which makes any fit
  conclusion drawn from it unreliable. Locale-specific styles are therefore a
  measurement precondition, not only a rendering preference, and every text node in the
  file was corrected to the style matching its own script.

## Neutral and focus provenance

The neutral review compared maintained Light/Dark systems including Adobe Spectrum,
Atlassian, Carbon, Fluent, GitHub Primer, GitLab Pajamas, SAP Fiori, Shopify Polaris,
Material, Ant Design, Radix Colors, LINE, USWDS, GOV.UK, Apple, and current NosLog
evidence, with WCAG contrast requirements as acceptance constraints.

Adobe Spectrum S2 was selected because its published grayscale and current semantic
aliases supplied the complete restrained surface/foreground/boundary responsibilities
without Tailwind or local interpolation. Its token evidence was pinned to
`@adobe/spectrum-tokens@14.15.0` during extraction.

Key decisions:

- `M-A` preserves Spectrum base, layer, pasteboard, and elevated aliases. A proposed
  NosLog-specific Light reversal and custom Dark overlay step were rejected.
- `F-A` keeps static headings on `gray-800`; `gray-900` remains interaction-state
  content. `gray-600` measured only `4.02:1` on Light sunken and was not promoted to a
  universal normal-text role.
- `NB-A` uses `gray-200/300/400/600`. Only `gray-600` owns a necessary neutral boundary;
  lower roles are deliberately quiet.
- `NI-A` was selected after comparing Spectrum Stack, Tree, Menu, and Table recipes.
  A universal hover/selected fill was rejected because those component families do not
  publish one shared recipe.
- Persistent white outlines in Dark were rejected. `FI-C` instead appears only during
  keyboard-visible focus.

The focus review compared [WCAG Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html),
[Microsoft Fluent color tokens](https://fluent2.microsoft.design/color-tokens2/),
[Fluent `createFocusOutlineStyle`](https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-tabster/src/focus/createFocusOutlineStyle.ts),
Adobe Spectrum, Atlassian, Carbon, Primer, Material, Shopify, GitLab, SAP, USWDS,
GOV.UK, Ant Design, and browser forced-colors behavior. The approved Fluent polarity
measured at least `15.91:1` across approved surfaces and passed native Tab, `200%` zoom,
clipping, roving-focus, and forced-colors checks.

The approved NosLog rendering keeps Fluent's achromatic polarity and, since
2026-08-13, draws one `1px` inside border on the control. Forced colors use the
platform focus colors while preserving the same single-boundary geometry. Persistent
pointer outlines, state recoloring, and decorative shadows were rejected.

`Rejected — excessive double outer focus; must not be restored.` The earlier
separation edge plus outer-ring proposal was visually noisy and is not an active
specimen, implementation option, audit allowance, or downstream design reference.
The full governed record is `FOCUS-1B` in document `22`.

The later `border/empty-slot` alias is not a new neutral source. It maps Light to the
existing `surface/sunken` value and Dark to `border-subtle`, only for missing artwork
or image slots. The real image removes the edge; the approved fallback remains the
semantic cue.

## Signature, identity, and action provenance

The broad signature review included Adobe Spectrum, Radix Colors, Shopify Polaris,
Atlassian, Fluent, Carbon, Primer, Material, Ant Design, GitLab, SAP Fiori, LINE,
USWDS, GOV.UK, Apple, information services, and current NosLog domain-color collisions.

`SS-08 · Radix Colors Indigo` was selected over the Shopify Polaris source and the
experimental Polaris-Light/Radix-Dark split. The split was rejected as a cross-system
appearance hybrid. The source selection did not prove a valid shell or action alias.

Three identity treatments were then compared on identical content:

| Candidate            | Disposition | Reason                                                                                |
| -------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `ITA-A` Indigo mark  | `Rejected`  | Unnecessary brand color on the logo and collision pressure with domain hues           |
| `ITA-B` Indigo field | `Rejected`  | Added a colored identity container and unresolved shape ownership                     |
| `ITA-C` Achromatic   | `Approved`  | Stable identity through placement and neutral mark/wordmark without decorative chroma |

Three primary-action policies were compared. `RPA-A` was approved. `RPA-B/C` were
rejected because exact Radix Dark hover/pressed `#5472E4` with white text measured
`4.28:1`, below the required `4.5:1`. No altered Indigo was invented, and Radix has no
approved action alias.

## Material provenance

The material review compared fourteen maintained systems, then extracted three
complete finalists:

| Candidate                 | Disposition | Reason                                                                                                                     |
| ------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `MG-A` Adobe Spectrum S2  | `Approved`  | Complete radius, raised/overlay/dragged shadow, and Light/Dark scrim roles with the same neutral provenance                |
| `MG-B` Microsoft Fluent 2 | `Rejected`  | Published Web set lacked equivalent dragged and directional scroll-boundary ownership                                      |
| `MG-C` Atlassian          | `Rejected`  | Atlassian requires shadows paired with its own elevation surfaces, conflicting with Spectrum's exclusive surface ownership |

The exact extraction used `@adobe/spectrum-tokens@14.15.0`,
`@fluentui/react-theme@9.2.1` / `@fluentui/tokens@1.0.0-alpha.23`, and
`@atlaskit/tokens@16.3.0`. Mixing radius, shadow, scrim, or surfaces across finalists
was explicitly rejected.

## Feedback and domain-color provenance

### Feedback/status

The status review compared Adobe Spectrum S2, Atlassian, and IBM Carbon recipes after
broad semantic-color research. Exact evidence used `@adobe/spectrum-tokens@14.15.0`,
`@atlaskit/tokens@16.3.0`, and `@carbon/themes@11.78.0`.

- Atlassian had the preferred semantic color set and clear field-error treatment.
- Carbon's neutral Dark notification typography demonstrated useful restraint, but its
  Light warning marker measured `1.53:1` and its colors were not imported.
- `FS-BN` was approved: exact Atlassian background/marker/error roles plus existing
  Spectrum neutral title/body typography.

This is a component-role mapping over one chromatic source, not a mixed palette.

### Difficulty

Thirteen independent sources/constraints were reviewed, including Spectrum, Radix,
Primer, Atlassian, Carbon, SAP, Elastic, PatternFly, GitLab, Tableau, ColorBrewer,
WCAG, and official NOSTALGIA evidence. Eleven exact mappings were compared.

Only unchanged maintained `DU-01` Spectrum, `DU-05` Carbon, and `DU-06` SAP candidates
passed the `3:1` compact marker target in both appearances. Spectrum was selected
because green → orange → red → purple most clearly preserved the learned difficulty
progression. Carbon and SAP remained valid comparison evidence but were not selected.
Neutral-only `DU-D0` was rejected because the user requirement is four persistent,
different difficulty colors in ordinary repeated-scanning UI.

The user later approved one constrained `20×20px` result anatomy so all four levels
fit the brief's `92px` trailing group without colored text, fill, or container. The
`12×2px` rounded color line remains a non-text marker; the neutral metadata number and
fixed Normal → Hard → Expert → Real order preserve meaning without color.

### Local data

Fourteen sources established the categorical/sequential/diverging and non-color
contract. Complete finalists were Carbon Charts, GitLab Pajamas, and SAP Fiori
Horizon. Exact evidence included `@carbon/charts@1.27.18`, `@gitlab/ui@136.1.0`, and
`@sap-theming/theming-base-content@11.36.3`.

`LD-03 · SAP Fiori Horizon` was selected after the user found Carbon's purple-led
mapping visually unsuitable and preferred SAP's calm blue sequence plus immediately
legible blue/orange FAST/SLOW pair. The earlier Carbon recommendation is `Rejected and
Superseded`. FAST/SLOW are labeled independent counts, not positive/negative status.

### Judgement

User-supplied NOSTALGIA gameplay evidence established hue families only: rose S-Just,
yellow Just, cyan Good, blue Near, and neutral Miss. Screenshot pixels were rejected as
exact web values because capture, glow, display processing, and background alter them.

Fifteen sources/constraints were reviewed; complete exact finalists were Spectrum S2,
Radix Colors, and Primer DataVis. `JD-02 · Radix Colors 3.0.0` step 11 was selected for
its clear, game-adjacent treatment and comfortable contrast reserve. It supersedes SAP
only for the five `judgement.*` roles. It does not own FAST/SLOW.

## Iconography provenance

Seventeen independent sources were audited and five adoptable maintained systems plus
the current control were rendered with the same eight NosLog roles. The comparison
included Lucide, Fluent 2 Regular, Atlassian, Carbon, Primer, and Adobe Spectrum, with
Material, Apple, WAI-ARIA, WCAG, and production guidance informing label and target
constraints.

The initial recommendation favored Fluent, but the user selected `IC-06 · Lucide`
after reviewing real Korean content. Lucide remained distinct without competing with
labels; the choice was not based on package convenience. Source paths, `24×24`
viewBox, `2px` round stroke, and outline treatment remain intact. The viewer/editor,
logo, and data marks are excluded.

## Motion provenance

Fourteen independent authorities were reviewed. Six exact-source candidates compared
Adobe Spectrum, Atlassian, IBM Carbon productive, Shopify Polaris, Material, and SAP
Fiori with identical NosLog interactions and reduced states.

The user selected `MO-02 · Atlassian`. It provided the clearest semantic fit for
`50ms` hover, `150ms` persistent interaction, entrance/exit asymmetry, modal timing,
and instant reduced mode. An early specimen incorrectly treated persistent selection
as `50ms`; this was corrected to the published `150ms` interactive-highlight role.
Spectrum `130ms`, Tailwind `150ms ease`, and other source timings are not mixed in.

Primary references include [Atlassian Motion](https://atlassian.design/foundations/motion),
[Adobe Spectrum Motion](https://spectrum.adobe.com/page/motion/),
[IBM Carbon Motion](https://v10.carbondesignsystem.com/guidelines/motion/overview/),
[Material Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md),
[Shopify motion tokens](https://polaris-react.shopify.com/tokens/motion),
[SAP Fiori Motion](https://experience.sap.com/fiori-design-web/explore_category/foundation/),
[Primer motion accessibility](https://primer.style/accessibility/design-guidance/motion-and-animation/),
and [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

## Data-visualization provenance

Sixteen independent sources were audited and six controlled anatomy candidates were
compared. Sources included Adobe Spectrum, IBM Carbon, SAP Fiori, GitLab Pajamas,
GitHub Primer, Atlassian, W3C/WAI, Microsoft Power BI, Apple, Vega, Observable, D3,
ColorBrewer, Elastic, and PatternFly.

`DV-05 · GitHub Primer` was approved because one maintained product system covered
title/subtitle, axes, grid, point/crosshair detail, persistent legend, non-color
stroke/marker distinction, compact actions, same-data table, and CSV support. Primer
colors were not adopted. Spectrum's line/shape prohibition conflicted with the
already approved FAST/SLOW reinforcement; SAP's full analytical toolbar was heavier
than necessary for compact NosLog charts.

The initial benchmark marker was a square. The user requested a filled orange circle;
the final approved ordinary personal-versus-benchmark treatment uses outlined blue
and filled orange circles with solid/dashed lines. This does not alter FAST/SLOW's
separate circle/square contract.

## Rejected and superseded evidence

| Item                                                                                       | Disposition                                 |
| ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Tailwind colors, theme, starter cards, gradients, radii, shadows, and implicit transitions | `Rejected as design authority`              |
| `FCM-11`, `SIG-07` over-accented examples                                                  | `Rejected; never downstream evidence`       |
| Custom mixed neutral ramp or Light/Dark palette hybrid                                     | `Rejected`                                  |
| Persistent white outline around Dark containers or identity                                | `Rejected`                                  |
| `ITA-A`, `ITA-B` chromatic logo treatments                                                 | `Rejected`                                  |
| `RPA-B`, `RPA-C` Radix action policies                                                     | `Rejected — 4.28:1 exact Dark state`        |
| `MG-B`, `MG-C` material mappings                                                           | `Rejected — role gap / provenance conflict` |
| Carbon as the local-data selection                                                         | `Rejected and Superseded by LD-03`          |
| Neutral-only difficulty                                                                    | `Rejected`                                  |
| Screenshot-sampled judgement hex values                                                    | `Rejected`                                  |
| Earlier generic SAP judgement colors                                                       | `Superseded only for judgement.* by JD-02`  |
| Fluent icon recommendation                                                                 | `Superseded by user-selected Lucide`        |
| Any `S4`, `S6`, viewer/editor Foundation or redesign target                                | `Superseded and prohibited by document 07`  |

## Evidence retention policy

The active guide keeps this consolidated provenance record and the normative document
`24`. Deleted serial research files and interactive comparison artifacts remain in Git
history for forensic review. They must not be treated as current scope, active
specimens, pending approvals, or implementation targets.
