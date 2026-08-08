# NosLog 2.0 C5 Neutral Foreground Reference Comparison

## Document Control

- Status: `Research and document 37 technical validation complete; exact F-A approved
as the final C5 foreground mapping; C5M-04 closed`
- Final mapping approval date: 2026-08-09
- Canonical language: English
- Korean companion:
  [36-foundation-c5-neutral-foreground-reference-comparison.ko.md](./36-foundation-c5-neutral-foreground-reference-comparison.ko.md)
- Started: 2026-08-08
- Scope: compare established design-system foreground hierarchies before deciding
  `C5M-04`, then identify intact mappings that are compatible with the approved Adobe
  Spectrum S2 neutral primitive source and `M-A` surfaces
- Inputs: approved documents `25`, `32`, `33`, and `35`; the provisional foreground
  hypothesis in document `34`; current official design-system sources; WCAG 2.2; and
  measured contrast against every approved `M-A` surface
- Excludes: boundary and focus mapping, chromatic
  signature/feedback/domain/data-visualization colors, component styling,
  high-fidelity page design, production token implementation, and application
  implementation

This research corrects the process gap identified before `C5M-04`: the earlier
foreground table was a provisional Spectrum-based hypothesis, not a broad reference
comparison. It must not become authority merely because it appeared in a surface
mapping document or validation specimen.

## Related Documents

- [Foundation semantic role map](./25-foundation-semantic-role-map.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.md)
- [Signature color research](./33-foundation-signature-color-research.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.md)

## Authority and Comparison Rules

1. Adobe Spectrum S2 remains the approved exclusive source of exact Dark/Light
   neutral primitives under `FCM-12`. This comparison does not silently reopen that
   decision.
2. Tailwind CSS is not a color reference in this comparison. Its palette, starter
   themes, and utility defaults have no authority over NosLog Foundation values.
3. Each system is compared at the semantic-role level: ordinary readable content,
   lower-prominence content, interactive emphasis, disabled content, theme behavior,
   and the separation of text, icon, and boundary ownership.
4. An external system may validate or challenge the role architecture. Its values may
   not be mixed with Spectrum values. Adopting another system's exact mapping would
   require explicitly reopening `FCM-12` and replacing the source as one maintained
   system.
5. A role name is not assumed equivalent across systems. In particular, Material 3
   `tertiary` is a chromatic color-scheme role, not third-level neutral text.
6. Disabled content is evaluated as a state, not as a reusable low-emphasis reading
   color. Required information may not depend on a disabled treatment.

## Research Questions

1. Which neutral foreground roles converge across maintained systems?
2. Do established systems require a distinct third neutral reading level?
3. How do lower-prominence interactive labels change on hover, pressed, or selected?
4. Is a generic stronger neutral appropriate for headings, or is stronger value
   reserved for interaction states?
5. Which complete mapping can NosLog adopt without mixing sources or inventing values?

## Official Reference Matrix

Sixteen independent official sources were reviewed. Fifteen are maintained design
systems or production design authorities; WCAG 2.2 is the evaluation authority.

|   # | Official system/source                                                                                                                                                             | Observed foreground model                                                                                                                                                                                                                                                                 | Transferable principle for NosLog                                                                                                                                                                             | Applicability limit                                                                                                                                                     |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum S2 color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/)                                                                         | `neutral-content` default uses `gray-800`; its hover/down states use `gray-900`. `neutral-subdued-content` uses `gray-700` and strengthens to `gray-800` on hover/down/selected. Disabled content uses `gray-400`. All publish exact Light/Dark values.                                   | Provides a complete semantic and value mapping inside the already approved primitive source. It distinguishes ordinary content, subdued content, interaction states, and disabled content without a new gray. | Does not publish a separate third neutral reading role. Spectrum component aliases still need NosLog ownership rules.                                                   |
|   2 | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                   | `text-primary`, `text-secondary`, `text-helper`, and `text-disabled` are distinct. The White theme maps them to Gray 100 `#161616`, Gray 70 `#525252`, Gray 60 `#6f6f6f`, and Gray 100 at 25% respectively.                                                                               | Confirms primary, secondary, helper, and disabled responsibilities can be explicit. Secondary interactive content strengthens to primary on hover.                                                            | Carbon's helper level and alpha-disabled recipe belong to Carbon themes and cannot be spliced into Spectrum.                                                            |
|   3 | [GitHub Primer color primitives](https://www.primer.style/product/primitives/color/) and [theme architecture](https://www.primer.style/product/primitives/)                        | Functional foregrounds expose `fgColor-default`, `fgColor-muted`, and `fgColor-disabled`; the current Light page resolves them to `#1f2328`, `#59636e`, and `#818b98`. Theme files retain the same functional names across Light, Dark, dimmed, high-contrast, and color-vision variants. | Confirms a lean default/muted/disabled foreground set is sufficient for a large production service and should be theme-invariant by name.                                                                     | The public value page shows only its active theme at once. Primer's values and additional accessibility themes are not Spectrum-compatible inputs.                      |
|   4 | [Microsoft Fluent 2 alias tokens](https://fluent2.microsoft.design/color-tokens2/)                                                                                                 | Four neutral foreground levels plus disabled are published for Light and Dark. Foreground 2 strengthens to 1 on hover/pressed/selected; foreground 3 strengthens to 2.                                                                                                                    | Strong evidence that interactive hierarchy should be encoded as semantic state aliases, not a globally reusable “emphasis gray.”                                                                              | The four-level hierarchy is broader than a proven NosLog need and uses Fluent ramps.                                                                                    |
|   5 | [Atlassian color guidance](https://atlassian.design/foundations/color-new/)                                                                                                        | Text is separated by default, subtle, and subtlest emphasis, with dedicated inverse and disabled/state tokens. Semantic token values map separately in Light and Dark themes.                                                                                                             | Confirms that low prominence is a semantic role and that theme values should not be manually remapped by component authors.                                                                                   | Atlassian's broader emphasis vocabulary and alpha neutrals are optimized for its products; the static overview does not establish an exact Spectrum-equivalent mapping. |
|   6 | [GitLab Pajamas type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/)                                                                               | Current roles are heading/strong, default, subtle, and disabled. Legacy secondary is deprecated to subtle; legacy tertiary is deprecated to disabled. Light/Dark primitive pairs are published.                                                                                           | Demonstrates that token names may outlive their meaning and that a third “tertiary” reading color is not automatically necessary. Disabled must remain disabled-only.                                         | Pajamas maps its old tertiary name to disabled for compatibility; that does not justify using disabled color for readable NosLog tertiary copy.                         |
|   7 | [Shopify Polaris color tokens](https://polaris-react.shopify.com/design/colors/color-tokens) and [current values](https://polaris-react.shopify.com/tokens/color)                  | Semantic text tokens include default, secondary, disabled, on-fill, and state-specific roles. The current table resolves default `#303030`, secondary `#616161`, and disabled `#b5b5b5`.                                                                                                  | Confirms element-specific text tokens and dedicated disabled values; discourages opacity as an ad hoc disabled treatment.                                                                                     | The current public values are Shopify Admin's Light scheme and do not form a transplantable dual-appearance mapping.                                                    |
|   8 | [PatternFly colors](https://www.patternfly.org/foundations-and-styles/colors/) and [token architecture](https://www.patternfly.org/foundations-and-styles/design-tokens/overview/) | Separate semantic tokens exist for regular text, subtle text, regular icons, links, and disabled/status content. Palette, base, and semantic token layers are distinct.                                                                                                                   | Supports separate text/icon ownership and a lean regular/subtle hierarchy backed by semantic tokens rather than palette access.                                                                               | PatternFly's Red Hat palette and component contracts are not candidates under the Spectrum primitive decision.                                                          |
|   9 | [Ant Design theme tokens](https://5x.ant.design/docs/react/customize-theme/)                                                                                                       | The default Light theme exposes default `rgba(0,0,0,.88)`, secondary `.65`, tertiary `.45`, and disabled/quaternary `.25`. Descriptions tie each level to specific content roles.                                                                                                         | Shows a production system where a distinct descriptive third level is intentional rather than inferred from a numbered palette.                                                                               | These are composited Light-theme alpha values; transplanting them would violate opaque Spectrum ownership and would not provide an intact Dark/Light source here.       |
|  10 | [Material 3 `ColorScheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)                                                                  | `onSurface` owns text/icons on surfaces; `onSurfaceVariant` provides a lower-emphasis surface content role. Boundaries use `outline`/`outlineVariant`.                                                                                                                                    | Reinforces foreground/background pairing and separation of content from boundary roles.                                                                                                                       | Material's `tertiary`/`onTertiary` is chromatic scheme semantics, not neutral text rank three. Dynamic schemes are not exact fixed NosLog values.                       |
|  11 | [SAP Fiori design tokens](https://experience.sap.com/fiori-design-web/design-tokens/)                                                                                              | Reference tokens are not used directly; stable base and component tokens map 1:1 across themes, with `sapTextColor` as a high-level text authority.                                                                                                                                       | Strong governance evidence for keeping primitives, semantic roles, and component aliases separate and stable across themes.                                                                                   | The public overview does not expose a complete comparable neutral foreground value table, so it validates architecture rather than a transplant candidate.              |
|  12 | [Elastic EUI color tokens](https://eui.elastic.co/v116.2.0/docs/getting-started/theming/tokens/colors/)                                                                            | Separate `textHeading`, `textParagraph`, `textSubdued`, and disabled text roles exist; keys stay stable while values change by color mode. The current Light page resolves them to `#111c2c`, `#1d2a3e`, `#516381`, and a dedicated disabled token.                                       | Confirms that heading emphasis can be a semantic role and that text-specific variants are preferred over general palette colors.                                                                              | EUI's blue-influenced neutral system and its exact mode values cannot be mixed with Spectrum; a distinct heading value is not yet a verified NosLog need.               |
|  13 | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)                                                                                                               | Functional Light colors include text `#0b0c0c` and secondary text `#484949`; services are told to use the maintained palette rather than local colors.                                                                                                                                    | High-confidence evidence for a restrained two-level readable text hierarchy and upstream maintenance.                                                                                                         | GOV.UK does not supply the required general Dark appearance, so it is architecture evidence only.                                                                       |
|  14 | [VA Design System color tokens](https://design.va.gov/foundation/design-tokens/color)                                                                                              | Default text uses semantic `ink #1b1b1b`; `base-dark #565c65` is documented for secondary text/icons; lighter base steps cover borders and disabled elements. Primitive tokens are explicitly barred from direct use.                                                                     | Confirms semantic default/secondary ownership and the ban on direct primitives in a production government service.                                                                                            | The web system is predominantly Light and its cool-gray USWDS-derived values are incompatible with Spectrum.                                                            |
|  15 | [Salesforce Lightning styling hooks guidance](https://developer.salesforce.com/blogs/2023/06/preparing-your-app-for-the-lightning-design-system-color-update)                      | Salesforce directs authors to context-specific semantic hooks instead of visually similar raw neutral values and updates those hooks centrally for contrast.                                                                                                                              | Supports semantic context over nearest-color selection and reinforces that upstream fixes should flow through stable aliases.                                                                                 | The source validates implementation governance, not a complete foreground mapping to adopt.                                                                             |
|  16 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                          | Normal text requires `4.5:1`; large text requires `3:1`. Inactive controls are excepted from minimum text and non-text contrast criteria.                                                                                                                                                 | Sets the minimum measurement gate for each actual text/surface pair and explains why disabled content cannot carry required reading.                                                                          | WCAG evaluates outcomes; it does not choose hierarchy, palette, or product role names.                                                                                  |

## Convergence and Disagreement

### Strong convergence

1. All directly comparable production systems route foreground through semantic
   tokens rather than asking component authors to choose a raw gray.
2. A default readable role and a lower-prominence readable role are nearly universal.
3. Disabled content has separate ownership. It is not a synonym for secondary,
   subtle, tertiary, placeholder, or decorative copy.
4. Light/Dark systems preserve semantic names while changing values by appearance.
5. Text, icons, boundaries, and surfaces are separate token responsibilities even
   when they sometimes resolve to the same primitive.
6. Interactive low-prominence content commonly strengthens on hover, pressed, or
   selected. Carbon, Fluent 2, and Spectrum S2 all encode this transition explicitly.

### Material disagreement

1. A distinct third neutral reading level is not universal. Fluent and Ant publish
   one; Carbon has helper text; Spectrum, Primer, Material surface content, PatternFly,
   GOV.UK, and VA use leaner general hierarchies. GitLab explicitly deprecated its old
   third-level name.
2. Heading emphasis may use a stronger color in GitLab or Elastic, but Spectrum's
   `gray-900` alias is published as an interactive state. Reusing it as a generic
   heading color would no longer be exact Spectrum semantic adoption.
3. Disabled recipes vary between opaque values and alpha. The common contract is the
   disabled meaning, not a portable formula.
4. Systems without a complete Light/Dark mapping can validate role architecture but
   cannot satisfy the approved NosLog source requirement intact.

## Exact Spectrum-Compatible Candidate

### `F-A` — adopt current Spectrum S2 foreground aliases intact

| NosLog semantic ownership                       | Spectrum S2 alias                                                |     Light |      Dark | Contract                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------- | --------: | --------: | ------------------------------------------------------------------------------------------------------------- |
| default text and primary icon                   | `neutral-content-color-default` → `gray-800`                     | `#292929` | `#dbdbdb` | Default readable content, including ordinary headings unless a later specimen proves a separate semantic need |
| subdued text and secondary icon                 | `neutral-subdued-content-color-default` → `gray-700`             | `#505050` | `#afafaf` | Readable metadata, labels, helper copy, and lower-prominence icons                                            |
| default interactive hover/down/focus content    | `neutral-content-color-hover/down/focus` → `gray-900`            | `#131313` | `#f2f2f2` | State alias only; not a global heading or “extra-bold text” token                                             |
| subdued interactive hover/down/selected content | `neutral-subdued-content-color-hover/down/selected` → `gray-800` | `#292929` | `#dbdbdb` | Strengthens a subdued control to the normal content level                                                     |
| disabled text and disabled icon                 | `disabled-content-color` → `gray-400`                            | `#c6c6c6` | `#444444` | Genuinely unavailable, nonessential content only; never required instructions or state explanation            |

Role consequences:

- `text-primary` and `icon-primary` may alias the default-content token.
- `text-secondary`, `text-tertiary`, `icon-secondary`, metadata, and helper aliases may
  initially share subdued content. Distinct semantic names are permitted; a new value
  is not created merely to make every role look different.
- Typographic scale, weight, position, spacing, and disclosure establish the
  difference between secondary metadata, tertiary metadata, and helper copy.
- If representative content proves that one shared subdued value cannot preserve the
  approved hierarchy, record the failure and reopen the mapping. Do not insert
  `gray-600` or borrow another system's third level locally.
- `gray-900` is removed from the earlier generic “emphasized/heading” proposal and is
  retained only where the published Spectrum interactive alias owns the state.

### `F-B` — replace the full neutral source with another system

Carbon, Fluent 2, GitLab, Primer, or another maintained system could be evaluated as
an intact replacement only by reopening `FCM-12`. This would replace both primitive
values and semantic aliases rather than mixing them with Spectrum surfaces.

No reviewed evidence establishes a failure of Spectrum S2 that justifies reopening
the approved source now. `F-B` is therefore not recommended for the next specimen.

## Measured Compatibility with Approved `M-A` Surfaces

Exact sRGB contrast was calculated against Light and Dark `canvas`, `surface`,
`sunken`, `raised`, and opaque `overlay` surfaces. Text directly on a scrim is invalid
and is not included.

| Spectrum content value       | Minimum Light | Minimum Dark | Result                                                                         |
| ---------------------------- | ------------: | -----------: | ------------------------------------------------------------------------------ |
| `gray-900` interactive state |     `15.30:1` |    `14.21:1` | Strong readable state color                                                    |
| `gray-800` default           |     `11.98:1` |    `11.49:1` | Strong default reading contrast                                                |
| `gray-700` subdued           |      `6.64:1` |     `7.25:1` | Passes the normal-text threshold on every `M-A` surface                        |
| `gray-600` unowned candidate |      `4.02:1` |     `4.61:1` | Fails normal text on Light `sunken`; cannot be a universal third reading level |
| `gray-400` disabled          |      `1.41:1` |     `1.63:1` | Disabled/nonessential content only                                             |

Contrast sufficiency does not by itself approve hierarchy. The alias must also match
the content's semantic responsibility and actual component state.

## Recommendation for User Review

Advance `F-A` into a dedicated foreground specimen without approving it yet.

Rationale:

1. It is the only complete exact Light/Dark mapping that preserves both the approved
   Spectrum primitive source and the stated goal of adopting a renowned maintained
   design system rather than synthesizing a local palette.
2. The broad comparison supports its default/subdued/disabled structure and its
   interaction-state strengthening pattern.
3. It corrects the earlier generic `gray-900` emphasis proposal instead of extending
   an unverified local interpretation.
4. It does not invent a third gray merely to populate a token name. A distinct third
   readable value remains available only after real NosLog content demonstrates a
   failure and the user approves reopening the mapping.

This recommendation originally authorized building and measuring the next guide
specimen only. Final `C5M-04` approval required and later received a separate explicit
user decision; it does not authorize production implementation.

### Review outcome — 2026-08-08

After reviewing the measured document `37` specimen, the user approved `F-A` as the
C5 foreground visual direction. The approval retains the exact Spectrum values,
shared subdued value for secondary and tertiary responsibilities, interaction-only
`gray-900`, and the nonessential-only disabled contract. It does not close `C5M-04`
or authorize production tokens by itself.

### Technical validation outcome — 2026-08-09

Document `37` completed actual Chrome 200% zoom at desktop, `390px`, and `320px` CSS
widths and active forced-colors verification across all Dark/Light scenes without a
measured failure. After reviewing the completed evidence and confirming that the white
system outlines seen in forced colors are not normal Dark-theme styling, the user
approved exact `F-A` as the final foreground mapping and closed `C5M-04` on
2026-08-09. Boundary and focus remain separate gates.

## Required Foreground Specimen Gate

Before `C5M-04` can be approved, the specimen must show:

1. default, subdued, and disabled text plus primary/secondary/disabled icons on every
   actual `M-A` surface in Light and Dark;
2. default and subdued interactive labels through rest, hover, pressed, focus, and
   selected states without treating color as the only state cue;
3. headings, body copy, metadata, helper copy, timestamps, score/rank numerals,
   table headers, empty/error copy, and unavailable controls using real NosLog content;
4. Korean, Japanese, and English, including long mixed-script titles and long names;
5. `320px`, `390px`, relevant intermediate widths, desktop density, and 200% zoom;
6. forced-colors/high-contrast behavior and keyboard focus ownership;
7. explicit confirmation that required information never uses disabled content and
   that no content is placed directly on a scrim; and
8. a measured adjacency table for each actual foreground/surface pair, not a single
   nominal canvas contrast.

Any failure must be recorded before proposing a deviation. The first correction path
is semantic ownership, typography, placement, or component composition—not a local
gray substitution.

## Decision Log

| ID       | Entry                                                                                                                                                         | Status                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `C5F-01` | Treat Tailwind palette/default-theme values as outside C5 foreground design authority.                                                                        | `Approved governance — 2026-08-08`         |
| `C5F-02` | The sixteen-source comparison converges on semantic default, lower-prominence, and disabled ownership rather than raw gray selection.                         | `Observed`                                 |
| `C5F-03` | A distinct third neutral reading value is not a cross-system requirement.                                                                                     | `Observed`                                 |
| `C5F-04` | Spectrum `gray-900` is an interactive content-state alias, not evidence for a generic heading/emphasis token.                                                 | `Observed correction`                      |
| `C5F-05` | Use current Spectrum S2 foreground aliases intact as `F-A`; let secondary and tertiary semantic aliases initially share subdued content.                      | `Approved visual direction — 2026-08-08`   |
| `C5F-06` | Do not use `gray-600` as universal tertiary text because it fails normal-text contrast on Light `sunken` and has no current Spectrum content alias ownership. | `Approved mapping constraint — 2026-08-08` |
| `C5F-07` | Reopen `FCM-12` only if measured NosLog content establishes a material Spectrum failure; another system must replace, not mix with, the source.               | `Proposed governance`                      |
| `C5F-08` | Build the required foreground specimen and adjacency record before deciding `C5M-04`.                                                                         | `Completed — C5M-04 approved 2026-08-09`   |
