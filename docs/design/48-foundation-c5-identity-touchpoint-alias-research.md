# NosLog 2.0 C5 Identity Touchpoint Alias Research

## Document Control

- Status: `Research complete; candidate specimen scope proposed; no identity
touchpoint alias approved`
- Canonical language: English
- Korean companion:
  [48-foundation-c5-identity-touchpoint-alias-research.ko.md](./48-foundation-c5-identity-touchpoint-alias-research.ko.md)
- Date: 2026-08-10
- Scope: determine which bounded service-identity touchpoint may receive the
  approved `SS-08` Radix Colors Indigo source across the approved NosLog shell
  variants
- Inputs: documents `15`, `25`, `32`–`47`, current shell and metadata code, and
  the fifteen independent official references listed below
- Excludes: rare primary-action eligibility, a final NosLog logo drawing, final
  header dimensions, radius approval, complete page design, and application
  implementation

Document `47` approved Radix Colors Indigo as the exclusive NosLog signature
identity source. It did not approve the vertical identity rail used as comparison
scaffolding, a colored wordmark, a mark container, or any other component alias.
This document opens that separate alias gate without reusing `FCM-11`, `SIG-07`,
or another over-accented example.

## Decision Boundary

This research answers one question:

> Where may the approved Radix Indigo identity color appear so that NosLog remains
> recognizable across its shell variants without turning routine content,
> navigation, or actions into brand color?

It does not ask whether Radix should color a filled primary action. That remains
the separate pending gate recorded in document `47`.

## Fixed Approved Contract

1. Adobe Spectrum S2 remains the exclusive source for Light/Dark neutral surfaces,
   foregrounds, and boundaries.
2. The signature identity source remains the intact `SS-08` Radix mapping. The
   default identity value is `#3E63DD` in both appearances.
3. Fluent `FI-C` remains the exclusive focus-visible source. An identity treatment
   never replaces or recolors focus.
4. Ordinary links, filters, navigation, selected rows, difficulty, mode, hand,
   score, feedback, external-brand, and visualization roles remain independent
   from the identity source.
5. The visible service name remains `NosLog`; the legacy `NOSTORY` name is not a
   current identity option.
6. The identity alias must remain legible at `320 CSS px`, must not crowd the
   account and navigation controls, and must not require a wider fixed shell.
7. A mark treatment cannot silently approve a new radius, outline, shadow,
   gradient, or logo drawing. Those details remain separate Foundation decisions.

## Approved Shell and Current-Product Evidence

| Context                      | Approved identity requirement                                                                           | Current implementation evidence                                                            | Alias implication                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Ordinary public shell        | Left-aligned NosLog identity linked to localized Home                                                   | `components/layout/header.tsx` renders a text `NosLog` wordmark                            | Must coexist with Login/profile and one navigation trigger at compact widths                    |
| Minimal authentication shell | NosLog identity linked Home; no profile or global destination panel                                     | Login currently renders a circular outlined `N` plus a separate `NosLog` heading           | Current circle and outline are migration evidence, not approved treatment                       |
| Focused chart-viewer shell   | Service identity remains available, while the focused shell prioritizes return and music/chart identity | Ordinary header is intentionally absent                                                    | The identity alias must not become a persistent colored ordinary header inside the viewer       |
| System-recovery shell        | NosLog identity, state meaning, and the best available recovery action                                  | No complete 2.0 visual treatment exists                                                    | Identity must work without depending on navigation or a primary action                          |
| Metadata and app assets      | Recognizable NosLog asset at small exported sizes                                                       | `lib/metadata/brandImage.tsx` and `noslog-mark-96.png` provide current monochrome evidence | A header alias should be testable against, but does not automatically redefine, exported assets |

The approved typography map already classifies the header wordmark as a bounded
brand-component alias. Page titles and entity titles remain normal semantic
typography and do not inherit identity color.

## Research Method

The comparison uses fifteen independent official sources. It compares the same
identity roles rather than unrelated palette swatches:

- whether color occupies the mark, wordmark, a mark field, or the entire shell;
- whether the product name remains native neutral text;
- whether Light and Dark preserve color or switch to an inverse asset;
- whether brand color also spreads into routine interaction;
- whether the pattern transfers to all four NosLog shell variants.

Where a source does not publish a complete Light/Dark identity rule, the missing
behavior remains missing and is not inferred.

## Identity Touchpoint Reference Matrix

| ID       | Official source                                                                                                                                                       | Identity placement and appearance behavior                                                                                                                     | Separation from routine UI                                                                        | Transferable NosLog principle                                                                               | Limit                                                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ITR-01` | [GOV.UK Header](https://design-system.service.gov.uk/components/header/)                                                                                              | A white GOV.UK logotype sits on a persistent brand-blue masthead required on every GOV.UK service page                                                         | Service navigation is a separate component below or beside the masthead contract                  | A full chromatic shell can create strong origin and trust recognition                                       | High-area government masthead; no equivalent published NosLog Dark pair and too much color for the approved sparse budget |
| `ITR-02` | [NHS Header](https://service-manual.nhs.uk/design-system/components/header)                                                                                           | The white NHS logo field and service name sit in a blue header; an optional white header variant is explicitly supported                                       | Search, account, and navigation remain named header elements rather than becoming logo decoration | A fielded white mark is robust and compact; a full header field is an intentional system-level choice       | Health-service ownership and Light-oriented header rule do not justify a full Indigo NosLog shell                         |
| `ITR-03` | [Government of Canada Signature](https://design.canada.ca/common-design-patterns/signature.html)                                                                      | A fixed red flag symbol is followed by black bilingual text on a white header; the flag color must not be changed                                              | Page links and actions do not inherit signature red                                               | Concentrate immutable identity color in a small symbol while the wordmark stays neutral                     | Published signature is Light-only and is a protected government asset, not a dual-theme component recipe                  |
| `ITR-04` | [USWDS Header](https://designsystem.digital.gov/components/header/)                                                                                                   | The header accepts a text or image logo and scales from basic to extended configurations                                                                       | Header structure and navigation are governed independently from a mandatory logo color            | Identity form can remain stable while navigation density adapts                                             | USWDS is deliberately themeable and provides no single NosLog-ready identity placement color                              |
| `ITR-05` | [BBC GEL Global Navigation](https://bbc.github.io/gel/components/global-navigation/)                                                                                  | The BBC logo is inline SVG using `currentColor`, so it follows foreground and forced-color contexts                                                            | Global navigation, account, and search remain separate semantic controls                          | An achromatic/inverse mark can be highly recognizable and resilient across modes                            | Supports a neutral control, not use of the approved Indigo source                                                         |
| `ITR-06` | [IBM Carbon UI Shell Header](https://carbondesignsystem.com/components/UI-shell-header/style/)                                                                        | Header background, product name, icons, and boundaries use semantic theme tokens; the product name stays `text-primary`                                        | IBM's core blue is a primary-action family, not required product-name color                       | A product shell can protect identity through stable placement and type while keeping the name neutral       | IBM shell density and action-blue ownership do not transfer to NosLog                                                     |
| `ITR-07` | [GitHub Primer Theme Reference](https://primer.style/product/getting-started/react/theme-reference/)                                                                  | The product header uses dark neutral backgrounds in Light and Dark schemes and a white or near-white logo token                                                | Blue interaction and status families remain separate from the logo                                | A neutral shell plus an inverse mark can preserve recognition in dense technical content                    | An achromatic control; it does not exercise Radix Indigo identity                                                         |
| `ITR-08` | [Atlassian Logos](https://atlassian.design/foundations/logos)                                                                                                         | Property logos use a blue mark plus neutral name on white and become all-white on dark; app logos use a colored tile paired with native text in top navigation | Product tiles are governed assets and are not extra containers applied ad hoc                     | Both a colored-mark lockup and a fielded-mark-plus-native-name pattern are established product-shell models | Atlassian's proprietary tile geometry, radius, and inverse rules cannot be copied as NosLog values                        |
| `ITR-09` | [Fluent 2 Color](https://fluent2.microsoft.design/color)                                                                                                              | Brand, shared, and neutral palettes have separate functions; neutrals ground surfaces, text, and layout across modes                                           | Brand color is not a universal replacement for neutral structure                                  | Preserve explicit identity, neutral, and semantic ownership rather than recoloring the whole shell          | Fluent describes role separation more than one mandated logo placement                                                    |
| `ITR-10` | [Adobe Spectrum Using Color](https://spectrum.adobe.com/page/using-color/)                                                                                            | Static color tokens remain identical across themes when used as a background with a contrast-safe black or white foreground                                    | Theme colors and static field colors are distinct contracts                                       | A fixed Indigo field with a white monochrome mark is technically coherent across Light and Dark             | Spectrum's static-color rule does not approve the NosLog mark shape or field geometry                                     |
| `ITR-11` | [Ubuntu Brand](https://design.ubuntu.com/brand) and [Colour Palette](https://design.ubuntu.com/brand/colour-palette)                                                  | Orange is a recognizable brand color; white and black brandmark options provide application flexibility; guidance explicitly controls the amount of color      | Orange may act as a highlight while neutral and supporting colors carry the composition           | A vivid identity source can remain bounded to the mark or a small highlight                                 | Ubuntu does not publish a complete NosLog-ready dual-theme header alias                                                   |
| `ITR-12` | [GitLab Core Logo](https://design.gitlab.com/brand-logo/core-logo/)                                                                                                   | The default is a fixed full-color logomark and wordmark; white or charcoal one-color variants are limited alternatives                                         | The guide prohibits recoloring, strokes, effects, and improvised rearrangement                    | Treat the approved identity asset and its variants as a governed unit, not a free color target              | GitLab's multi-color asset and awareness rules are not a single Indigo recipe                                             |
| `ITR-13` | [Stack Overflow Logo](https://stackoverflow.design/brand/logo)                                                                                                        | The preferred logo is Off-Black, with Off-White used where accessibility requires it, while Stack Orange remains broader identity ownership                    | The core identifier can remain achromatic even when the brand owns a vivid color                  | Wordmark legibility can take precedence over forcing signature color into the logo                          | Supports an achromatic control rather than a persistent Indigo touchpoint                                                 |
| `ITR-14` | [Mozilla Protocol Brand Themes](https://protocol.mozilla.org/docs/fundamentals/brand-themes)                                                                          | Mozilla identity is intentionally mostly black and white; Firefox is the more colorful sibling theme                                                           | Colorful supporting palettes do not have to become the parent service identity                    | Typography, mark, and composition can carry identity with very little chromatic area                        | Does not use the approved Radix source and Protocol color guidance is partly draft                                        |
| `ITR-15` | [Shopify Polaris Color](https://polaris-react.shopify.com/design/colors) and [Palettes and Roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles) | The admin is intentionally monochromatic; inverse colors frame the top bar, while brand color is reserved for intended primary actions                         | Decorative color is rejected and specialized navigation colors stay component-bounded             | A neutral shell is a strong control and prevents identity from consuming semantic color                     | Polaris assigns brand color to action rather than establishing a chromatic service-mark alias                             |

## Cross-Reference Findings

1. **Full chromatic headers are a deliberate minority pattern in this set.**
   GOV.UK and NHS use them to establish institutional origin, but they also accept
   a large, persistent color area that conflicts with NosLog's approved restrained
   signature budget.
2. **The most directly transferable chromatic pattern is a bounded mark.** Canada,
   Atlassian, Ubuntu, and GitLab concentrate recognition in a governed symbol or
   logo unit while surrounding text and controls retain their own roles.
3. **A colored field with a monochrome mark is an established product pattern.**
   Atlassian app tiles and the NHS mark demonstrate this construction; Spectrum's
   static-color rule explains how a fixed field can remain stable across themes.
4. **Neutral or inverse identity is also mature.** BBC, Carbon, GitHub Primer,
   Stack Overflow, Mozilla, and Polaris show that mark, placement, typography, and
   shell consistency may carry identity without applying a chromatic wordmark.
5. **No reviewed source makes a thin free-standing color rail the main service
   identity pattern.** The rail in document `47` was useful comparison scaffolding,
   but it is weak provenance for the final alias and can read as generic decoration.
6. **The references do not support spreading signature color into every shell
   control.** Even systems with strong color keep logo, navigation, actions, and
   semantic feedback as separately governed roles.

## Exact NosLog Contrast Evidence

The following measurements use the approved Radix default `#3E63DD` and approved
Spectrum S2 neutral surfaces. Ratios are rounded to two decimals.

| Pair                             |    Ratio | Alias consequence                                                           |
| -------------------------------- | -------: | --------------------------------------------------------------------------- |
| Indigo / Light canvas `#FFFFFF`  | `5.21:1` | Passes normal-text AA and non-text contrast                                 |
| Indigo / Light surface `#F8F8F8` | `4.90:1` | Passes normal-text AA and non-text contrast                                 |
| Indigo / Light sunken `#E9E9E9`  | `4.29:1` | Passes non-text contrast but not normal-text AA                             |
| Indigo / Dark canvas `#111111`   | `3.63:1` | Passes non-text contrast but not normal-text AA                             |
| Indigo / Dark surface `#1B1B1B`  | `3.31:1` | Passes non-text contrast but not normal-text AA                             |
| Indigo / Dark raised `#222222`   | `3.06:1` | Barely passes the `3:1` non-text threshold                                  |
| White `#FFFFFF` / Indigo         | `5.21:1` | Supports a white monochrome mark or normal-size text inside an Indigo field |
| Black `#000000` / Indigo         | `4.03:1` | Passes non-text contrast but not normal-text AA                             |

These results rule out the approved Indigo default as a universal small wordmark
foreground in Dark. They support either an Indigo graphical mark on approved
neutral surfaces or a white monochrome mark inside an Indigo field. Color must
not be the only cue that identifies the Home link.

## Candidate Alias Bundles

All bundles below are `Proposed`, `Control`, or `Do not advance`. None is approved.

| ID      | Alias bundle                                                                                                                                                                   | Reference provenance                                                              | Strength                                                                                                           | Risk                                                                                                                                                 | Gate status                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `ITA-A` | **Indigo mark + adaptive neutral wordmark.** Apply `#3E63DD` only to a compact graphical NosLog mark; render `NosLog` with the approved neutral foreground for the appearance. | Canada signature, Atlassian property/app lockups, Ubuntu, GitLab                  | Smallest persistent chromatic area; mark remains visible on every approved neutral surface; wordmark stays legible | Requires a mark drawing that works without the current unapproved white outline; Dark raised contrast is only `3.06:1`                               | `Proposed for visual comparison`                                               |
| `ITA-B` | **Static Indigo mark field + white monochrome mark + adaptive neutral wordmark.** Keep the field `#3E63DD` in both appearances and place an unoutlined white mark inside it.   | Atlassian app tile, NHS fielded mark, Spectrum static-color guidance              | Strong theme continuity; white-on-Indigo is `5.21:1`; compact asset can transfer to auth and recovery contexts     | Field geometry and radius are new decisions; a generic app-tile appearance must be avoided; must not nest the current circle in another container    | `Proposed for visual comparison`                                               |
| `ITA-C` | **Achromatic identity control.** Keep mark and wordmark neutral/inverse and do not place Indigo in the shell identity.                                                         | BBC, Carbon, GitHub Primer, Stack Overflow, Mozilla, Polaris                      | Lowest collision and strongest content restraint; validates whether color is needed at all                         | Does not visibly exercise the approved identity source in the shell and may weaken cross-context color recognition                                   | `Control for visual comparison`                                                |
| `ITA-D` | **Full Indigo header field with white identity and controls.**                                                                                                                 | GOV.UK and NHS                                                                    | Strongest immediate origin cue and robust white foreground                                                         | Large persistent color area conflicts with documents `32`–`33`, competes with jackets and chart content, and risks recreating an over-accented shell | `Do not advance unless the restrained-color decision is reopened`              |
| `ITA-E` | **Indigo wordmark text without a field.**                                                                                                                                      | General colored-lockup practice, but no strong match in the reviewed Dark systems | Minimal geometry change                                                                                            | Fails normal-text AA on every approved Dark surface and on Light sunken; couples identity legibility to size                                         | `Do not advance`                                                               |
| `ITA-F` | **Thin Indigo rail or full-width header edge.** Preserve the document `47` comparison cue as the only chromatic identity element.                                              | Prior NosLog specimen only; no strong repeated source in this audit               | Very small color area and no logo-field decision                                                                   | Weak direct provenance, visually generic, and may be read as decoration or selection rather than identity                                            | `Do not advance as the default; retain only as historical comparison evidence` |

## Proposed Visual-Comparison Gate

The evidence supports one small next specimen rather than another broad color
gallery. If the user approves its scope, compare `ITA-A`, `ITA-B`, and achromatic
control `ITA-C` with identical content in these four fragments:

1. ordinary compact header at `390px` and `320 CSS px`;
2. minimal authentication shell identity;
3. focused chart-viewer return/identity region without an ordinary header;
4. system-recovery identity and message region.

The comparison must keep mark silhouette, wordmark typography, layout, neutral
tokens, focus, and content identical wherever the candidate does not require a
field. Because final mark geometry is not approved, the specimen must use one
explicitly labeled provisional monochrome silhouette and must not present it as
the final NosLog logo.

Required checks:

- no white outline around the Dark mark except the separately triggered approved
  keyboard focus indicator;
- no candidate-colored routine action, link, selected control, or page title;
- no horizontal overflow or control crowding at `320 CSS px`;
- identity remains recognizable when color is unavailable or forced colors are
  active;
- a colored mark never becomes the sole cue for Home or current state;
- the chart-viewer fragment remains content-led and does not gain an ordinary
  colored site header.

## Research Outcome and Recommendation

Advance `ITA-A`, `ITA-B`, and `ITA-C` to the same measured visual specimen. The
comparison should decide whether NosLog needs an uncontained Indigo mark, a
fielded Indigo mark, or no chromatic shell mark. Do not advance the full Indigo
header, colored wordmark, or thin rail unless the user explicitly reopens the
corresponding rejected or weakly sourced direction.

This is a recommendation for the next comparison only. It does not approve an
identity alias, mark shape, or application change.

## Decision Log

| ID       | Item                                                                                                                         | Status                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `ITA-01` | Preserve `SS-08` Radix Colors Indigo as the exclusive identity source while opening a separate component-alias gate.         | `Required`                                                          |
| `ITA-02` | Compare at least fifteen independent official identity and shell references by equivalent placement and appearance behavior. | `Research complete — 2026-08-10`                                    |
| `ITA-03` | Treat the vertical rail in document `47` as comparison scaffolding rather than an approved identity alias.                   | `Observed; final status pending user review`                        |
| `ITA-04` | Advance `ITA-A`, `ITA-B`, and `ITA-C` to one four-context visual specimen.                                                   | `Proposed; pending user approval`                                   |
| `ITA-05` | Approve a full Indigo header field.                                                                                          | `Not proposed; would require reopening restrained-color principles` |
| `ITA-06` | Approve an Indigo small-text wordmark.                                                                                       | `Not proposed; measured Dark contrast failure`                      |
| `ITA-07` | Decide rare primary-action eligibility.                                                                                      | `Pending separate gate; out of scope`                               |

## Sources

- [Adobe Spectrum: Using color](https://spectrum.adobe.com/page/using-color/)
- [Atlassian: Logos](https://atlassian.design/foundations/logos)
- [BBC GEL: Global Navigation](https://bbc.github.io/gel/components/global-navigation/)
- [Canada.ca: Government of Canada signature](https://design.canada.ca/common-design-patterns/signature.html)
- [GitHub Primer: Theme Reference](https://primer.style/product/getting-started/react/theme-reference/)
- [GitLab Pajamas: Core logo](https://design.gitlab.com/brand-logo/core-logo/)
- [GOV.UK: Header](https://design-system.service.gov.uk/components/header/)
- [IBM Carbon: UI shell header style](https://carbondesignsystem.com/components/UI-shell-header/style/)
- [Microsoft Fluent 2: Color](https://fluent2.microsoft.design/color)
- [Mozilla Protocol: Brand themes](https://protocol.mozilla.org/docs/fundamentals/brand-themes)
- [NHS: Header](https://service-manual.nhs.uk/design-system/components/header)
- [Shopify Polaris: Color](https://polaris-react.shopify.com/design/colors)
- [Shopify Polaris: Palettes and roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles)
- [Stack Overflow: Logo](https://stackoverflow.design/brand/logo)
- [Ubuntu: Brand](https://design.ubuntu.com/brand)
- [Ubuntu: Colour palette](https://design.ubuntu.com/brand/colour-palette)
- [USWDS: Header](https://designsystem.digital.gov/components/header/)
