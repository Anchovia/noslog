# NosLog 2.0 — C5 Judgement Domain-Color Exact-Source Comparison

> Canonical language: English  
> Korean companion: [59-foundation-c5-judgement-domain-color-source-comparison.ko.md](./59-foundation-c5-judgement-domain-color-source-comparison.ko.md)  
> Status: `Approved — JD-02 Radix Colors 3.0.0 — 2026-08-10`  
> Date: `2026-08-10`

## Purpose

Record the exact Light/Dark source comparison and the user's approved result for the
ordinary-UI `Judgement breakdown` after only its five-color mapping was reopened.
This is a narrow amendment to completed block `1`; it is not a new top-level work
block.

The already approved `LD-03 · SAP Fiori Horizon` mapping remains unchanged for the
single series, six score buckets, and labeled FAST/SLOW comparison. The chart viewer
and chart editor remain locked in their entirety.

## Approved scope correction

The NOSTALGIA gameplay evidence supplied by the user establishes the intended hue
families, not exact web hex values:

| Domain role       | Required family | Evidence boundary                                                                                                                      |
| ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `judgement.sjust` | soft rose/pink  | The in-game diamond JUST treatment reads as pale rose/ivory; the web marker needs stronger surface contrast.                           |
| `judgement.just`  | yellow          | The in-game JUST treatment is yellow.                                                                                                  |
| `judgement.good`  | cyan            | The in-game GOOD treatment is luminous cyan/blue.                                                                                      |
| `judgement.near`  | blue            | Explicit user direction; retain the visible `Near` label because the supplied gameplay frames did not establish an exact source value. |
| `judgement.miss`  | neutral gray    | The in-game MISS treatment is achromatic; do not turn it into universal danger.                                                        |

The imagery is intentionally not sampled for hex values. Glow, capture compression,
the game background, and display processing make screenshot pixels unsuitable as an
exact UI token source.

## Locked and retained decisions

1. `data.direction.fast/slow` remains the exact SAP mapping: Light
   `#168EFF/#C87B00`, Dark `#3278BE/#F2A634`.
2. FAST/SLOW keeps direct labels, circle/square markers, and solid/dashed lines.
3. SAP remains the owner for single-series and sequential score data.
4. Judgement labels, counts, and percentages remain neutral text. Color appears only
   in the local marker/bar.
5. Judgement color never becomes feedback, achievement, difficulty, focus, identity,
   selection, or action meaning.
6. The entire viewer/editor preservation exception remains unchanged.

## Broad reference comparison

Fifteen independent authoritative or maintained sources were checked. The first
three can supply a complete exact Light/Dark candidate with the requested hue roles;
the remaining sources establish accessibility, data-role, or exclusion constraints.

| Source                                                                                                                                                                                   | Transferable evidence                                                                  | NosLog fit / limitation                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Adobe Spectrum S2 color palette](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/)                                                                               | Perceptually balanced Light/Dark color sets across pink, yellow, cyan, blue, and gray. | Complete five-role source; primitive-to-domain alias is NosLog-specific and still requires approval.               |
| [Radix Colors scales](https://www.radix-ui.com/colors/docs/palette-composition/scales) and [scale use](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | Exact adaptive hue scales; step 11 is intended for visible foreground content.         | Complete five-role source; Dark values are materially brighter and more colorful than the restrained NosLog shell. |
| [GitHub Primer DataVis tokens](https://primer.style/product/primitives/color/#data-visualization)                                                                                        | Purpose-named adaptive `data-*` pink, yellow, teal, blue, and gray tokens.             | Strongest data-role provenance; most values sit close to the `3:1` non-text floor on NosLog surfaces.              |
| [W3C WCAG 2.2 — Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)                                                                                             | Color cannot be the only carrier of meaning.                                           | Requires persistent labels and values.                                                                             |
| [W3C WCAG 2.2 — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                   | Required graphical objects need at least `3:1` contrast against adjacent colors.       | Establishes the minimum marker/bar contrast check.                                                                 |
| [WAI Images of Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)                                                                                                         | Charts require a text alternative and accessible data relationship.                    | Supports exact values and a table/list fallback; it does not select hues.                                          |
| [IBM Carbon data-visualization palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)                                                                              | Theme-aware categorical palettes and non-color reinforcement.                          | Earlier purple-led family was rejected for NosLog and does not match the requested five hue roles intact.          |
| [GitLab Pajamas data-visualization color](https://design.gitlab.com/data-visualization/color/)                                                                                           | Dedicated data colors, theme-aware order, and restrained chart ownership.              | Its intact categorical order does not reproduce the five NOSTALGIA role families.                                  |
| [SAP Fiori chart palettes](https://experience.sap.com/fiori-design-web/color-palettes/)                                                                                                  | Exact qualitative and sequential theme tokens.                                         | Retained for existing LD-03 roles; its categorical order is the mapping being narrowly reopened for judgement.     |
| [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)                                                                           | Separate Light/Dark chart tokens and categorical ordering.                             | Does not offer the requested five-role domain mapping as one explicit set.                                         |
| [Elastic EUI color palettes](https://eui.elastic.co/docs/consumers/color-palettes/)                                                                                                      | Ordered categorical palettes with accessible reinforcement.                            | Useful ordering evidence; not a complete NosLog Light/Dark domain owner.                                           |
| [PatternFly chart colors](https://www.patternfly.org/charts/colors-for-charts/)                                                                                                          | Limit simultaneous colors and reinforce series through patterns.                       | Supports restraint and non-color cues; not the exact five-role source.                                             |
| [Vega color schemes](https://vega.github.io/vega/docs/schemes/)                                                                                                                          | Distinguishes nominal categorical data from sequential and diverging scales.           | Confirms judgement is nominal domain data; application theming remains unspecified.                                |
| [D3 scale-chromatic](https://d3js.org/d3-scale-chromatic)                                                                                                                                | Maintained categorical and quantitative schemes.                                       | Does not provide a NosLog application Light/Dark token contract.                                                   |
| [Microsoft Power BI accessibility](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports)                                                     | Markers, labels, high contrast, and data access must supplement hue.                   | Directly supports the specimen's label/value/color-off contract; it is not a palette source.                       |

Tailwind colors and the rejected over-accented `FCM-11`/`SIG-07` examples were not
used.

## Exact candidates

All values are published source values. No screenshot sampling, hue shifting,
interpolation, or cross-source chromatic mixing is present.

### `JD-01 · Adobe Spectrum S2`

Uses the same adaptive `900` position for all chromatic roles and the already approved
Spectrum `gray-700` for the neutral MISS marker.

| Role   | Light                  | Dark      |
| ------ | ---------------------- | --------- |
| S-Just | `pink-900` `#CE2A92`   | `#EC43AF` |
| Just   | `yellow-900` `#9E6600` | `#BA7C00` |
| Good   | `cyan-900` `#0B78B3`   | `#188EDC` |
| Near   | `blue-900` `#3B63FB`   | `#5681FF` |
| Miss   | `gray-700` `#505050`   | `#AFAFAF` |

Against NosLog `#FFFFFF/#111111`, chromatic contrast is approximately
`4.80–4.83:1` Light and `5.34–5.38:1` Dark. MISS is `8.06:1/8.61:1`.

### `JD-02 · Radix Colors 3.0.0`

Uses the published step `11`, the scale position intended for visible foreground
content.

| Role   | Light               | Dark      |
| ------ | ------------------- | --------- |
| S-Just | `pink11` `#C2298A`  | `#FF8DCC` |
| Just   | `amber11` `#AB6400` | `#FFCA16` |
| Good   | `cyan11` `#107D98`  | `#4CCCE6` |
| Near   | `blue11` `#0D74CE`  | `#70B8FF` |
| Miss   | `gray11` `#646464`  | `#B4B4B4` |

Light contrast is `4.61–5.92:1`. Dark contrast is `8.93–12.33:1`, making this the
brightest Dark candidate. The user preferred this clearer, game-adjacent treatment
after reviewing the controlled NosLog content specimen.

### `JD-03 · GitHub Primer DataVis`

Uses the theme-adaptive purpose-named DataVis emphasis tokens.

| Role   | Light                                  | Dark      |
| ------ | -------------------------------------- | --------- |
| S-Just | `data-pink-color-emphasis` `#CE2C85`   | `#D34591` |
| Just   | `data-yellow-color-emphasis` `#B88700` | `#895906` |
| Good   | `data-teal-color-emphasis` `#179B9B`   | `#106C70` |
| Near   | `data-blue-color-emphasis` `#006EDB`   | `#0576FF` |
| Miss   | `data-gray-color-emphasis` `#808FA3`   | `#576270` |

Against NosLog surfaces, the minimum measured contrast is `3.23:1` Light and
`3.04:1` Dark. It passes the measured non-text floor but has the least reserve for
thin or antialiased marks.

## Controlled specimen

[Open the judgement domain-color comparison](./specimens/c5-judgement-domain-color-source-comparison.html).
It preserves the same judgement labels, values, order, Light/Dark Spectrum neutral
surfaces, narrow layout, and color-off test across all candidates. The previous SAP
categorical mapping remains visible as a historical control; the approved JD-02
mapping supersedes SAP only for `judgement.*`.

## Approved result

The user selected `JD-02 · Radix Colors 3.0.0` after reviewing the controlled
Light/Dark NosLog content specimen.

The authoritative judgement mapping is:

| Role              | Light               | Dark      |
| ----------------- | ------------------- | --------- |
| `judgement.sjust` | `pink11` `#C2298A`  | `#FF8DCC` |
| `judgement.just`  | `amber11` `#AB6400` | `#FFCA16` |
| `judgement.good`  | `cyan11` `#107D98`  | `#4CCCE6` |
| `judgement.near`  | `blue11` `#0D74CE`  | `#70B8FF` |
| `judgement.miss`  | `gray11` `#646464`  | `#B4B4B4` |

All five values come from the same published Radix step-11 mapping. `gray11` is a
judgement-domain marker only; it does not replace Adobe Spectrum S2 as NosLog's
exclusive neutral primitive source. Labels, counts, percentages, surfaces, and
containers continue to use the approved Spectrum neutral roles.

`JD-01` Spectrum and `JD-03` Primer remain comparison evidence and are not downstream
targets. The previous SAP five-series categorical order is superseded only for
`judgement.*`; SAP remains authoritative for single-series data, six score buckets,
FAST/SLOW, and other approved generic comparison-local roles. No value in this
decision applies to the locked chart viewer/editor.

## Decision log

| ID       | Entry                                                                                   | Status                                   |
| -------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| `JDC-01` | Preserve LD-03 SAP for single series, sequential buckets, and FAST/SLOW.                | `Approved scope correction — 2026-08-10` |
| `JDC-02` | Reopen only the five `judgement.*` colors as NOSTALGIA-derived hue roles.               | `Approved scope correction — 2026-08-10` |
| `JDC-03` | Use screenshot pixels as exact web color values.                                        | `Rejected — unreliable source`           |
| `JDC-04` | Compare Spectrum S2, Radix Colors, and Primer DataVis as intact exact-value candidates. | `Completed evidence`                     |
| `JDC-05` | Adopt `JD-02 · Radix Colors 3.0.0` step 11 for the five judgement roles.                | `Approved — 2026-08-10`                  |
