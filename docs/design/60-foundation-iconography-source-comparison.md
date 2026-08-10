# NosLog 2.0 — Foundation Iconography Source Comparison

> Canonical language: English  
> Korean companion: [60-foundation-iconography-source-comparison.ko.md](./60-foundation-iconography-source-comparison.ko.md)  
> Status: `Approved — IC-06 Lucide ordinary-UI grammar; block 2 complete — 2026-08-10`  
> Date: `2026-08-10`

## Purpose

Start and complete the evidence and controlled visual comparison required for
`Block 2 · Iconography`. This document does not add a new top-level work item. It
compares established icon systems for eligible ordinary NosLog UI, records the
current implementation audit, and isolates the material source decision that still
belongs to the user.

The entire chart viewer/editor and the final NosLog logo drawing are excluded.

## Fixed scope

This block covers only:

- the source library for ordinary product-interface icons;
- the relationship between labels and icons;
- allowed icon-only controls;
- default optical sizes and visual weight;
- neutral and semantic-color behavior;
- accessible names, decorative hiding, target size, focus, and localization rules.

It does not cover the chart viewer/editor, game-note or hand graphics, renderer
controls, the NOSTALGIA judgement graphics, the NosLog logo, brand-service marks such
as Discord, illustrations, flags, album jackets, or data-visualization marks.

## Current implementation audit

The repository currently uses `lucide-react@1.24.0` in 73 ordinary-UI source files
after the locked `components/chart-pattern/` and `components/admin/chart-pattern/`
trees are removed from the count. It appears in global navigation, search, music,
rankings, profile, game-center, bingo, bookmarklet, feedback, exam, and admin UI.

Observed ordinary-UI sizes include `12`, `13`, `14`, `15`, `16`, and `20px`, plus
Tailwind `size-3`, `size-3.5`, `size-4`, and `size-5`. Some controls provide
`aria-label`, some hide a decorative icon, and some rely on adjacent visible text.
This is a functional inventory, not a coherent approved 2.0 grammar.

Before selection, current Lucide was retained as `IC-06`, a historical control. Its
presence in the stack did not make it the NosLog 2.0 visual authority, just as
Tailwind installation does not make Tailwind's palette or templates design authority.
The later approval below comes from the broad comparison and controlled content review.

Custom brand marks remain separate assets. They must not be redrawn to resemble the
selected product icon family.

## Broad authoritative reference comparison

Seventeen independent authoritative or maintained sources were checked. The first six
form the controlled specimen. The others establish alternatives, constraints, or
exclusions and prevent selection from a narrow reference pool.

| Source                                                                                                                                                                                                   | Transferable evidence                                                                                                   | NosLog fit / limitation                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Adobe Spectrum iconography](https://spectrum.adobe.com/page/iconography/) and [Spectrum Web Components workflow icons](https://opensource.adobe.com/spectrum-web-components/components/icons-workflow/) | Purpose-built desktop/mobile icon sizes, weight variants, simple single-color product glyphs.                           | Strong visual continuity with the approved Spectrum neutral foundation, but icon source remains a separate approval gate.                        |
| [Microsoft Fluent 2 iconography](https://fluent2.microsoft.design/iconography)                                                                                                                           | Optical-size sets; Regular for actions and wayfinding; Filled reserved for selected/emphasized states; one solid color. | Refined 20px product UI set and direct React package fit. A Regular/Filled state rule must be kept narrow.                                       |
| [Atlassian iconography](https://atlassian.design/foundations/iconography)                                                                                                                                | Default 16px, restrained detail, label wherever possible, compact product density.                                      | Strong compact readability and explicit label-first policy; smaller native size needs a fixed hit target.                                        |
| [IBM Carbon icon usage](https://carbondesignsystem.com/elements/icons/usage/)                                                                                                                            | Default 16px in components with maintained 20/24/32 sizes and consistent source geometry.                               | Clear technical geometry; complex glyphs such as Settings become dense at 16px.                                                                  |
| [GitHub Primer Octicons guidelines](https://primer.style/octicons/design-guidelines/)                                                                                                                    | Separate 16px and 24px drawings, 1.5px geometry, 12px only for special cases.                                           | Highly legible compact actions; some glyphs feel heavier and more developer-tool-specific.                                                       |
| [Lucide](https://lucide.dev/)                                                                                                                                                                            | Broad maintained 24-unit, 2px rounded-stroke set with tree-shakable React delivery.                                     | Current implementation control only; its generic outline character is the surface treatment being reconsidered.                                  |
| [Google Material Symbols](https://developers.google.com/fonts/docs/material_symbols)                                                                                                                     | Fill, weight, grade, and optical-size axes from 20–48.                                                                  | Broad and accessible, but variable-font loading/subsetting introduces delivery and consistency decisions not needed for the first NosLog system. |
| [SAP Fiori Horizon iconography](https://experience.sap.com/fiori-design-web/iconography/)                                                                                                                | Simple metaphors, consistent size/stroke/balance, icon buttons only for universally understood actions.                 | Strong policy reference; web asset adoption is less direct than the finalist React packages.                                                     |
| [Radix Icons](https://www.radix-ui.com/icons)                                                                                                                                                            | Crisp fixed 15×15 product glyphs.                                                                                       | Excellent at compact control anatomy but too narrowly optimized to own every ordinary NosLog role without more custom work.                      |
| [Phosphor Icons](https://phosphoricons.com/)                                                                                                                                                             | A large family with multiple weights, Fill, and Duotone variants.                                                       | Flexible, but that flexibility creates an avoidable risk of mixing weights and surface treatments.                                               |
| [Tabler Icons](https://tabler.io/icons)                                                                                                                                                                  | Broad MIT 24-unit, 2px outline family.                                                                                  | Maintained and complete, but close to the generic rounded-outline character already represented by Lucide.                                       |
| [Shopify Polaris React repository](https://github.com/Shopify/polaris-react)                                                                                                                             | Mature commerce icon semantics and product-component integration.                                                       | The repository states Polaris assets are restricted to Shopify-integrating applications; not an adoptable NosLog source.                         |
| [GitLab Pajamas](https://handbook.gitlab.com/handbook/product/ux/pajamas-design-system/)                                                                                                                 | Maintained product design-system governance and icon consistency.                                                       | Useful governance evidence; its public icon adoption path is less self-contained than the finalists.                                             |
| [Heroicons](https://heroicons.com/)                                                                                                                                                                      | Separate 16 Solid, 20 Solid, and 24 Outline/Solid sets.                                                                 | Clear optical sets, but its strong Tailwind starter-template association conflicts with the requested independent visual provenance.             |
| [Apple SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols)                                                                                                             | Platform-adaptive weight, localization, and variable rendering.                                                         | Excellent Apple-platform reference but coupled to SF and Apple-platform distribution; not the web source for NosLog.                             |
| [WAI-ARIA naming and description practices](https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/)                                                                                           | Name a control by its action (`Close`), not by its shape (`X`); keep names concise.                                     | Governs every icon-only control regardless of visual source.                                                                                     |
| [W3C Design System SVG icons](https://design-system.w3.org/styles/svg-icons.html)                                                                                                                        | Icon-only controls need an accessible name; decorative SVG paths must be hidden.                                        | Establishes the specimen and downstream accessibility contract.                                                                                  |

Official package versions used to extract the specimen SVGs are:

| Candidate | Package                                   |   Version | License    |
| --------- | ----------------------------------------- | --------: | ---------- |
| `IC-01`   | `@spectrum-web-components/icons-workflow` |  `1.12.2` | Apache-2.0 |
| `IC-02`   | `@fluentui/react-icons`                   | `2.0.335` | MIT        |
| `IC-03`   | `@atlaskit/icon`                          |  `37.3.0` | Apache-2.0 |
| `IC-04`   | `@carbon/icons-react`                     | `11.85.0` | Apache-2.0 |
| `IC-05`   | `@primer/octicons-react`                  | `19.33.0` | MIT        |
| `IC-06`   | `lucide-react`                            |  `1.24.0` | ISC        |

No candidate was reconstructed from screenshots, approximated by hand, or replaced by
a look-alike. The specimen data file contains SVG output extracted from these exact
installed package versions. The packages were inspected in a temporary research
directory; no repository dependency was added or changed.

## Controlled roles and specimen

The controlled comparison uses eight meanings found in eligible NosLog ordinary UI:

1. Search
2. Location
3. Sync/refresh
4. Settings
5. Upload/import
6. Navigate/chevron-right
7. Close
8. Delete

[Open the ordinary-UI iconography source comparison](./specimens/foundation-iconography-source-comparison.html).
Every candidate receives the same Korean search field, labeled actions, game-center
rows, two 44px icon-only controls, neutral Light/Dark surfaces, and glyph order.

The `Native size` mode preserves each system's compact product-UI recommendation:
Spectrum `18px`, Fluent `20px`, Atlassian `16px`, Carbon `16px`, Primer `16px`, and the
current Lucide control at the commonly implemented `20px`. `Normalize 20px` removes
that variable so glyph form and visual weight can be compared independently. The
source viewBox and path data never change.

## Candidate assessment

| ID      | Candidate              | Strength                                                                                                                                       | Risk / limitation                                                                                                                                      |
| ------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `IC-01` | Adobe Spectrum S2      | Calm single-color silhouettes, generous interior space, same maintained ecosystem as the neutral source.                                       | At 18px some actions read softer than dense product tooling; choosing it merely because Spectrum owns neutral color would collapse two approval gates. |
| `IC-02` | Microsoft Fluent 2     | Most balanced 20px detail, polished curves, strong search/location/settings distinction, direct Regular optical set.                           | Filled variants could create noisy mixed styling if used beyond an explicit selected-navigation rule.                                                  |
| `IC-03` | Atlassian              | Clearest compact 16px family, direct label-first guidance, efficient dense rows.                                                               | Visual weight is stronger; some icons can dominate small Korean labels when normalized to 20px.                                                        |
| `IC-04` | IBM Carbon             | Consistent technical geometry and strong simple-action glyphs.                                                                                 | Complex icons are visually dense at the native 16px size and less calm in ordinary content rows.                                                       |
| `IC-05` | Primer Octicons        | Very clear action silhouettes and mature compact tooling vocabulary.                                                                           | Settings and other complex glyphs are heavy; the overall voice leans toward developer tooling.                                                         |
| `IC-06` | Current Lucide control | Broad coverage, quiet 20px outline weight, clear Light/Dark rendering, and the least competition with Korean labels in the controlled content. | Existing size/label rules are inconsistent; approval therefore standardizes the grammar rather than preserving current ad-hoc usage.                   |

## Approved result

The user selected `IC-06 · Lucide` after reviewing the controlled NosLog content.
This supersedes the initial `IC-02 · Microsoft Fluent 2 Regular` recommendation.

The selection is based on the comparison, not on installation convenience. In actual
NosLog Korean content, Lucide's 20px outline remains distinct without competing with
labels; Fluent is visually thinner, while Atlassian, Carbon, and Primer are heavier in
compact rows. Spectrum is calm but less immediately distinct for several utility
actions. Lucide is an independent maintained icon system, not a Tailwind palette,
theme, or starter-template source.

`IC-01`–`IC-05` remain comparison evidence and are not ordinary-UI downstream targets.

## Approved ordinary-UI grammar

The following rules are authoritative for eligible NosLog 2.0 ordinary UI:

1. Use `lucide-react` as the single maintained ordinary-UI product icon family. The
   controlled approval is based on the installed `1.24.0` package output. A later
   dependency upgrade must review changed glyph geometry before treating it as a
   mechanical update. Do not mix in individual workflow glyphs from other systems.
2. Use a visible text label for primary, unfamiliar, destructive, and low-frequency
   actions. An icon supplements the label; it does not replace it.
3. Icon-only controls are limited to universally understood, compact actions whose
   context remains visible, such as close, previous/next, overflow, and a repeated
   compact row action. Every such control needs an explicit accessible action name.
4. Decorative icons next to visible labels use `aria-hidden="true"`. Do not duplicate
   the visible label in the accessibility tree.
5. Use the published Lucide `24×24` source viewBox, `2px` stroke, round linecaps, and
   round linejoins unchanged. Keep ordinary product icons outline-only; selection is
   communicated by the approved container, label, boundary, or state treatment rather
   than filling the glyph.
6. Render the default action and wayfinding glyph at `20px`. Render `16px` only for a
   compact supporting or metadata icon that has an adjacent visible label. Do not use
   ordinary-UI Lucide glyphs below `16px`; do not scale a complex glyph down to fit a
   label. `24px` is reserved for a genuinely prominent standalone affordance or empty
   state, not routine buttons or rows.
7. Interactive icons inherit the control's foreground role. They do not receive a
   signature, feedback, difficulty, judgement, or data color merely for emphasis.
   Destructive color belongs to the approved semantic control state, not the trash
   glyph itself.
8. Keep glyph size separate from pointer target size. Use at least `44×44px` for
   mobile icon-only targets and `40×40px` for eligible desktop icon-only targets. A
   visible-label control follows its approved component height; glyph size does not
   determine control size.
9. Allow Korean/Japanese/English labels and their containers to reflow without glyph
   shrinkage or two-dimensional page scrolling.
10. Keyboard focus uses the approved `FI-C` treatment: a `2px` zero-gap black boundary
    in Light and white boundary in Dark, rendered `2px` outside the control. Do not
    recolor focus with the Lucide glyph, signature Indigo, or another accent.
11. Tooltips supplement unfamiliar icon-only controls on hover/focus but do not replace
    accessible names or persistent labels for primary actions.
12. Do not modify source paths, stroke widths, corner language, or fill treatment to
    make individual glyphs look “more NosLog-like.” If a required role is missing,
    report the source failure and reopen the decision.
13. The locked viewer/editor and separate brand marks do not migrate with the selected
    ordinary-UI family.

## Completed validation

The approved Lucide specimen was checked with the following results:

[Open the responsive and localization validation harness](./specimens/foundation-iconography-responsive-validation.html).

- Light and Dark both preserve neutral `currentColor` rendering without a new accent.
- Default `20px` and compact `16px` retain the published `2px` stroke geometry.
- The specimen reflows at `320px` and `390px` without horizontal page overflow; action
  labels wrap as controls rather than shrinking the glyph.
- Desktop keeps the same label hierarchy and permits the approved two-column source
  comparison layout.
- All twelve comparison icon-only controls expose explicit action names; adjacent
  decorative SVGs are hidden from the accessibility tree.
- Actual keyboard traversal confirms the approved `FI-C` focus boundary: black `2px`
  in Light and white `2px` in Dark, with a `-2px` outer extent.
- A dedicated forced-colors rule preserves structural control boundaries while icons
  retain `currentColor` behavior.
- No repository dependency, production component, viewer/editor file, or logo asset
  changed during this design-guide block.

This completes `Block 2 · Iconography`. The remaining top-level work is blocks
`3`–`6`; no internal icon migration pass is added as another block.

## Decision log

| ID       | Entry                                                                                                                       | Status                         |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `ICO-01` | Restrict block 2 to eligible ordinary UI and preserve the entire viewer/editor plus final logo boundary.                    | `Locked scope`                 |
| `ICO-02` | Treat current Lucide as implementation evidence and a historical control before comparison, not automatic design authority. | `Observed basis`               |
| `ICO-03` | Compare five authoritative adoptable systems and the current control with eight equivalent NosLog roles.                    | `Completed evidence`           |
| `ICO-04` | Use package-extracted SVGs and retain source geometry rather than redrawing look-alikes.                                    | `Completed evidence`           |
| `ICO-05` | Advance Fluent 2 Regular as the initial recommendation and Atlassian as the compact alternative.                            | `Superseded by user selection` |
| `ICO-06` | Adopt Lucide for eligible ordinary UI with the documented label, size, stroke, color, target, and accessibility grammar.    | `Approved — 2026-08-10`        |
| `ICO-07` | Keep the entire viewer/editor and final logo drawing outside the Lucide migration boundary.                                 | `Approved boundary`            |
| `ICO-08` | Close block 2 after responsive, Light/Dark, interaction, and accessibility validation.                                      | `Complete — 2026-08-10`        |
