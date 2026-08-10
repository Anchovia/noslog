# NosLog 2.0 C5 Difficulty UI Exact-Source Comparison

## Document control

- Status: `Proposed — eleven exact four-color candidates awaiting user review`
- Canonical language: English
- Korean companion:
  [56-foundation-c5-difficulty-ui-exact-source-comparison.ko.md](./56-foundation-c5-difficulty-ui-exact-source-comparison.ko.md)
- Date: 2026-08-10
- Parent correction:
  [document 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.md)
- Remaining-scope authority:
  [document 57](./57-noslog-2.0-authoritative-remaining-work-audit.md)
- Visual evidence:
  [c5-difficulty-ui-source-comparison.html](./specimens/c5-difficulty-ui-source-comparison.html)
- Scope: persistent Normal, Hard, Expert, and Real markers in repeated-scanning
  ordinary DOM UI outside the complete chart viewer and editor experiences
- Excludes: every viewer/editor page, shell, control, responsive or accessibility
  behavior, renderer output, geometry, calculation, animation, and editor behavior

## Fixed requirement and corrected question

Eligible ordinary UI must use four visibly different persistent difficulty colors.
This requirement is approved. Neutral-only `DU-D0` is Rejected and is not a candidate
in this comparison. The only open question is which exact published Light/Dark values
and which four-role alias should be approved.

The previous draft was also too narrow because it presented Spectrum as the only real
candidate before an equivalent exact-value comparison had been completed. This revision
keeps Spectrum, adds ten independently published candidates, and compares all of them
on identical NosLog content. It does not reuse Tailwind values, sample screenshots,
interpolate steps, or mix values from different systems.

## Locked viewer/editor boundary

Existing renderer values remain implementation constants rather than Foundation token
candidates:

- Falling PixiJS renderer: left `0x4fc8dc`, right `0xe85f5d`;
- Full-sheet Canvas renderer and paired DOM legend: left `#62d4e8`, right `#f06b68`.

No candidate below may modify, recolor, restyle, or reinterpret any chart viewer/editor
surface or behavior.

## Reference matrix

|   # | Independent official source                                                                                                 | Evidence used                                       | Applicability and limitation                                                              |
| --: | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum S2 color palette](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/)                  | Theme-adaptive named visual colors                  | Direct exact-value candidate; role alias remains NosLog-specific.                         |
|   2 | [Radix Colors scale composition](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)          | Published solid step `9` for four named hues        | Exact solid colors; a shared Light/Dark set does not guarantee both-background contrast.  |
|   3 | [GitHub Primer primitives](https://primer.style/product/primitives/)                                                        | Theme-specific data-color emphasis primitives       | Maintained adaptive source; selected hue roles are a NosLog alias.                        |
|   4 | [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)              | Categorical colors 1–4                              | Maintained adaptive sequence; upstream meaning is series order, not difficulty.           |
|   5 | [IBM Carbon data-visualization palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)                 | Official four-series palette, set 1                 | Maintained adaptive sequence; hue order has weak difficulty intuition.                    |
|   6 | [SAP Fiori data visualization](https://experience.sap.com/fiori-design-web/explore_group/data-visualization/)               | Horizon qualitative colors 1–4                      | Maintained adaptive sequence; hue order must be learned as difficulty.                    |
|   7 | [Elastic EUI color palettes](https://eui.elastic.co/v107.0.1/docs/utilities/color-palettes/)                                | First four `colorBlind` graphic colors              | Strong series guidance, but the exact light colors are too pale on white here.            |
|   8 | [PatternFly chart colors](https://v5-archive.patternfly.org/charts/colors-for-charts/)                                      | First four multi-color chart values                 | Exact official values; source page is an official archived version.                       |
|   9 | [GitLab Pajamas data-visualization color](https://design.gitlab.com/data-visualization/color/)                              | Hue `500` values                                    | Values pass measured contrast, but the installed source marks the tokens deprecated.      |
|  10 | [Tableau custom and Classic colors](https://help.tableau.com/current/pro/desktop/en-gb/formatting_create_custom_colors.htm) | Exact Classic 10 green, orange, red, and purple     | Stable production reference; named-hue subset rather than an adaptive four-role contract. |
|  11 | [ColorBrewer schemes](https://colorbrewer2.org/learnmore/schemes_full.html)                                                 | Exact Set1 green, orange, red, and purple           | Established categorical reference; not theme-adaptive and not a difficulty contract.      |
|  12 | [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)                                       | Color cannot be the only distinguishing cue         | Governs redundant name, numeric level, order, pattern, and selected state.                |
|  13 | Official NOSTALGIA evidence recorded in [document 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.md)    | Normal/Hard/Expert/Real domain labels and hierarchy | Establishes domain applicability, not replacement palette values.                         |

The comparison therefore exceeds the twelve-source minimum without counting package
versions, duplicated documentation pages, or Tailwind as additional references.

## Exact candidate values

Values are shown in Normal / Hard / Expert / Real order. A repeated set means the
source candidate uses the same values in both themes.

| ID      | Published source recipe                            | Light values                                  | Dark values                                   | Provenance status                   |
| ------- | -------------------------------------------------- | --------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| `DU-01` | Spectrum S2 green/orange/red/purple `visual-color` | `#0BA45D` / `#E86A00` / `#F03823` / `#A65CE7` | `#068850` / `#E06400` / `#CD2E1D` / `#AD69E9` | Maintained, adaptive                |
| `DU-02` | Radix green/orange/red/purple step `9`             | `#30A46C` / `#F76B15` / `#E5484D` / `#8E4EC6` | Same as Light                                 | Maintained, fixed set               |
| `DU-03` | Primer data green/orange/auburn/purple emphasis    | `#30A147` / `#EB670F` / `#9D615C` / `#894CEB` | `#2F6F37` / `#984B10` / `#EB3342` / `#975BF1` | Maintained, adaptive                |
| `DU-04` | Atlassian categorical 1–4                          | `#357DE8` / `#82B536` / `#BF63F3` / `#F68909` | `#4688EC` / `#94C748` / `#C97CF4` / `#FCA700` | Maintained, adaptive                |
| `DU-05` | Carbon four-series set 1                           | `#6929C4` / `#012749` / `#009D9A` / `#EE5396` | `#8A3FFC` / `#08BDBA` / `#BAE6FF` / `#4589FF` | Maintained, adaptive                |
| `DU-06` | SAP Horizon qualitative 1–4                        | `#168EFF` / `#C87B00` / `#75980B` / `#DF1278` | `#3278BE` / `#F2A634` / `#B4CE35` / `#FA4F96` | Maintained, adaptive                |
| `DU-07` | Elastic `colorBlind` first four                    | `#16C5C0` / `#A6EDEA` / `#61A2FF` / `#BFDBFF` | Same as Light                                 | Maintained, fixed set               |
| `DU-08` | PatternFly multi-color first four                  | `#0066CC` / `#63993D` / `#37A3A3` / `#DCA614` | Same as Light                                 | Official archived source, fixed set |
| `DU-09` | GitLab hue `500` green/orange/magenta/blue         | `#619025` / `#C95D2E` / `#CF4D81` / `#617AE2` | Same as Light                                 | Source tokens deprecated            |
| `DU-10` | Tableau Classic 10 green/orange/red/purple         | `#2CA02C` / `#FF7F0E` / `#D62728` / `#9467BD` | Same as Light                                 | Maintained palette, fixed set       |
| `DU-11` | ColorBrewer Set1 green/orange/red/purple           | `#4DAF4A` / `#FF7F00` / `#E41A1C` / `#984EA3` | Same as Light                                 | Stable palette, fixed set           |

Package evidence was checked against `@adobe/spectrum-tokens@14.15.0`,
`@atlaskit/tokens@16.5.0`, `@carbon/colors@11.55.0`,
`@carbon/charts@1.27.18`, `@elastic/eui@118.0.0`,
`@gitlab/ui@136.1.0`, `@patternfly/react-tokens@6.6.1`,
`@sap-theming/theming-base-content@11.36.5`,
`@primer/primitives@11.10.0`, and `@radix-ui/colors@3.0.0` where applicable.

## Measured non-text marker contrast

Each cell lists Normal / Hard / Expert / Real against the approved specimen surface:
Light `#FFFFFF` or Dark `#222222`. `FAIL` means below the `3:1` non-text target.

| ID      | Light ratios                          | Dark ratios                           | First-pass result               |
| ------- | ------------------------------------- | ------------------------------------- | ------------------------------- |
| `DU-01` | `3.24 / 3.23 / 3.97 / 3.96`           | `3.52 / 4.54 / 3.03 / 4.53`           | All pass                        |
| `DU-02` | `3.16 / 2.97 FAIL / 3.91 / 5.18`      | `5.04 / 5.36 / 4.07 / 3.07`           | Light Hard fails                |
| `DU-03` | `3.33 / 3.24 / 4.89 / 4.89`           | `2.61 FAIL / 2.54 FAIL / 3.85 / 3.85` | Dark Normal and Hard fail       |
| `DU-04` | `4.00 / 2.44 FAIL / 3.34 / 2.47 FAIL` | `4.54 / 7.97 / 5.81 / 8.08`           | Light Hard and Real fail        |
| `DU-05` | `7.74 / 15.13 / 3.34 / 3.33`          | `3.18 / 6.82 / 12.01 / 4.75`          | All pass                        |
| `DU-06` | `3.31 / 3.34 / 3.36 / 4.67`           | `3.46 / 7.79 / 8.96 / 5.02`           | All pass                        |
| `DU-07` | `2.15 / 1.32 / 2.59 / 1.42 FAIL`      | `7.41 / 12.06 / 6.15 / 11.21`         | All Light values fail           |
| `DU-08` | `5.57 / 3.41 / 3.03 / 2.21 FAIL`      | `2.86 FAIL / 4.66 / 5.25 / 7.20`      | Light Real and Dark Normal fail |
| `DU-09` | `3.80 / 4.13 / 4.17 / 3.90`           | `4.19 / 3.86 / 3.81 / 4.08`           | Values pass; source deprecated  |
| `DU-10` | `3.40 / 2.53 FAIL / 5.02 / 4.26`      | `4.68 / 6.28 / 3.17 / 3.74`           | Light Hard fails                |
| `DU-11` | `2.78 FAIL / 2.53 FAIL / 4.71 / 5.31` | `5.72 / 6.28 / 3.38 / 3.00`           | Light Normal and Hard fail      |

No candidate value was adjusted to make it pass. A failed exact value eliminates that
recipe under the current marker and surface contract; it is not permission to invent a
nearby color.

## First-pass shortlist and tradeoff

Only `DU-01`, `DU-05`, and `DU-06` have maintained exact values that pass the raw
marker target in both themes. `DU-09` also passes numerically but is excluded from the
shortlist because its source tokens are deprecated.

- `DU-01 · Spectrum S2` preserves the conventional green → orange → red → purple
  progression, publishes adaptive values, and passes both surfaces. Its limitation is
  that the role assignment is NosLog-specific rather than an upstream difficulty
  semantic.
- `DU-05 · Carbon` has the strongest measured margins but maps purple → navy → teal →
  magenta. Those hues do not communicate increasing difficulty without learning.
- `DU-06 · SAP Fiori` also passes, but blue → orange → green → pink makes Expert less
  immediately severe than Hard.

The evidence-supported recommendation is therefore `DU-01`, but it remains Proposed.
The user must compare the rendered candidates and explicitly approve the exact mapping.

## Hard component boundary

Whichever candidate is approved, chroma may appear only on the compact difficulty
marker in eligible repeated-scanning ordinary DOM UI. It must not color:

- difficulty text, card background, section, navigation, link, button, selection,
  focus, validation, or feedback;
- any chart viewer/editor page, shell, control, Canvas/WebGL output, note, path, hand
  guide, legend, piano, timing guide, geometry, or renderer-owned pixel;
- score bands or FAST/SLOW data, which remain the next local-data-color subtask.

Names, numeric levels, fixed order, pattern fallback, and an explicit selected label
remain visible, so color is never the sole cue.

## Browser verification — 2026-08-10

The revised artifact was verified at `1440px`, `390px`, and `320px`. All three widths
had zero horizontal overflow. The page rendered eleven candidates and twenty-two
Light/Dark appearances, the Dark-only control exposed exactly eleven Dark appearances,
and color-off retained four different marker patterns with the names, levels, fixed
order, and selected label. The DOM contained zero `canvas`, SVG, WebGL, or viewer/editor
elements, and the completed run produced no console warning or error. Verification is
evidence for the comparison artifact only; it did not test or modify production
viewer/editor code.

## Decision log

| ID       | Entry                                                                                                                                | Status                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `DUS-01` | Preserve the existing viewer/editor experiences in their entirety.                                                                   | `Approved correction — 2026-08-10`            |
| `DUS-02` | Remove the incorrect renderer hand-color comparison.                                                                                 | `Completed`                                   |
| `DUS-03` | Restrict this decision to repeated-scanning ordinary difficulty DOM UI.                                                              | `Approved scope correction`                   |
| `DUS-04` | Require four different persistent difficulty colors; reject neutral-only `DU-D0`.                                                    | `Approved and reconfirmed`                    |
| `DUS-05` | Compare eleven exact candidate mappings from independent published sources rather than presenting Spectrum alone.                    | `Completed research — awaiting visual review` |
| `DUS-06` | Shortlist only maintained candidates whose unchanged values pass both approved surfaces.                                             | `Proposed evaluation rule`                    |
| `DUS-07` | Prefer `DU-01 · Spectrum S2` over passing Carbon and SAP alternatives because its hue order better preserves difficulty recognition. | `Proposed recommendation — not approved`      |

## Approval boundary and remaining-work count

No exact four-color mapping is approved yet. This comparison remains part of block `1`,
not eleven new tasks: the eleven candidates are evidence inside one material decision.
After approval, work continues in the same block with local data color for score bands,
FAST/SLOW, series, and thresholds. The authoritative total remains the six top-level
blocks in document `57`; no completion percentage is reported.
