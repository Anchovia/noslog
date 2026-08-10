# NosLog 2.0 — C5 Local Data Color Exact-Source Comparison

> Canonical language: English  
> Korean companion: [58-foundation-c5-local-data-color-exact-source-comparison.ko.md](./58-foundation-c5-local-data-color-exact-source-comparison.ko.md)  
> Status: `Approved — LD-03 SAP Fiori Horizon — 2026-08-10`  
> Date: `2026-08-10`

## Purpose

Record the approved comparison-local data-color result that completed block `1 · C5
color closeout` without reopening any chart-viewer or chart-editor visual. This gate covers
ordinary product UI only:

- a single score, accuracy, or grade trend;
- the six ordered score-distribution buckets;
- the two labeled `FAST` and `SLOW` series;
- multi-series judgement or record comparisons; and
- structural threshold and reference lines.

This is an exact-source comparison, not an implementation change. Existing 1.x
classes such as `bg-score`, `text-danger`, and `stroke: var(--color-chart)` remain
migration evidence only.

## Locked boundary

The entire chart viewer/editor remains excluded: page, controls, DOM, responsive and
accessibility behavior, PixiJS/WebGL, Canvas, notes, hand colors, palettes, geometry,
math, animation, and editor model. No specimen or proposal in this document contains
or changes those systems.

Difficulty marker color is already closed separately by `DU-01 · Adobe Spectrum S2`.
Local data color must not change that mapping or become difficulty, feedback, focus,
identity, or interaction color.

## Current NosLog evidence

| Ordinary UI case                | Current evidence                                       | 2.0 classification                                                                                    |
| ------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Score, S-Just, Miss/Near trends | One line with a value, date, and tooltip               | `single-series`                                                                                       |
| Score distribution              | Six fixed buckets from `950,000` through `Pianist`     | `sequential`; bucket label and order remain primary                                                   |
| FAST/SLOW trend                 | Two independently measured and explicitly named counts | `two-direction comparison`; labels and distinct line markers are mandatory                            |
| Judgement breakdown             | Five named categories with counts and percentages      | `categorical`; direct row labels remain primary                                                       |
| `990,000` or other reference    | A numeric reference, not automatically success/warning | `structural threshold`; use the approved neutral owner unless product semantics explicitly promote it |

The existing use of universal `danger` for FAST, `score` for S-Just, and `chart` for
SLOW is rejected as token ownership. Those colors imply unrelated UI meanings.

## Broad reference comparison

Fourteen independent authoritative or maintained production sources were compared.
The first three are eligible exact-family finalists; the rest establish constraints,
patterns, or exclusions.

| Source                                                                                                                               | Transferable evidence                                                                                                              | NosLog fit / limitation                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                        | Do not use color alone; graphical objects and required states need perceivable contrast.                                           | Requires labels, order, markers, spacing, and forced-colors behavior in addition to hue.                                                                                   |
| [IBM Carbon data-visualization palettes](https://v10.carbondesignsystem.com/data-visualization/color-palettes/)                      | Exact categorical, sequential, and non-temperature diverging palettes; Light/Dark categorical mappings.                            | Complete role coverage and clear theme adaptation; the default purple single-series owner can visually approach NosLog Indigo, so context and labels must remain explicit. |
| [GitLab Pajamas data-visualization color](https://design.gitlab.com/data-visualization/color/)                                       | A palette separated from UI color, surface-specific step direction, categorical order, and cool/cool or cool/warm divergence.      | Complete role model and restrained production values; cool/cool FAST/SLOW is less hue-separated than Carbon.                                                               |
| [SAP Fiori chart color palettes](https://experience.sap.com/fiori-design-web/values-and-names/)                                      | Exact theme tokens for qualitative and sequential colors; one palette per chart; border and text companions.                       | Full theme package and clear token discipline; no equally explicit neutral-performance diverging pair for FAST/SLOW.                                                       |
| [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)                       | Single-series brand, neutral emphasis, categorical ordering, and chart-only status roles.                                          | Strong structural guidance, but the source explicitly does not currently support sequential or divergent chart colors; not an intact owner for all NosLog roles.           |
| [Elastic EUI color palettes](https://eui.elastic.co/v107.0.1/docs/utilities/color-palettes/)                                         | Ordered color-blind-oriented categorical palette and use by series.                                                                | Useful categorical evidence, but insufficient intact sequential/diverging ownership for this gate.                                                                         |
| [PatternFly chart colors](https://v5-archive.patternfly.org/charts/colors-for-charts/)                                               | Base-family ordering, spacing/pattern reinforcement, and restrained variable counts.                                               | Valuable non-color-cue evidence; the cited v5 guidance is archived and does not provide one current adaptive family for every role.                                        |
| [Vega color schemes](https://vega.github.io/vega/docs/schemes/)                                                                      | Explicit categorical, sequential, diverging, and cyclical scheme types.                                                            | Excellent data-type taxonomy, but not an application Light/Dark token owner.                                                                                               |
| [Observable Plot scales](https://observablehq.com/plot/features/scales)                                                              | Scale type follows data type; categorical and quantitative schemes remain distinct.                                                | Strong implementation and evaluation evidence, but no NosLog UI theme mapping.                                                                                             |
| [Observable data-color study](https://observablehq.com/blog/crafting-data-colors)                                                    | A production categorical palette optimized for interpretation rather than decoration.                                              | Useful categorical benchmark; incomplete as the sole sequential/diverging owner.                                                                                           |
| [ColorBrewer](https://colorbrewer2.org/)                                                                                             | Established qualitative, sequential, and diverging scheme classification.                                                          | Strong reference baseline, but primarily map/fill oriented and not adaptive application tokens.                                                                            |
| [D3 scale-chromatic](https://d3js.org/d3-scale-chromatic)                                                                            | Maintained implementations of categorical, sequential, and diverging schemes.                                                      | Broad exact library, but leaves UI theme and semantic ownership to the adopter.                                                                                            |
| [Microsoft Power BI accessibility](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports) | Use markers and labels, avoid color-only series, support high contrast, and expose data tables.                                    | Directly supports the NosLog marker/label/forced-colors contract; not one adoptable palette family.                                                                        |
| [Apple HIG Charts](https://developer.apple.com/design/human-interface-guidelines/charts)                                             | Color can clarify a chart, but shapes, patterns, labels, accessibility summaries, and noninteractive access must preserve meaning. | Reinforces the non-color and assistive-technology contract; no exact cross-web theme palette to adopt.                                                                     |

Further sources did not materially change the three eligible families or the required
non-color contract. Tailwind defaults were intentionally excluded from evidence.

## Exact finalists

All values below are published values from one source family. No hue shifting,
interpolation, or cross-source palette mixing is allowed.

### `LD-01 · IBM Carbon Charts`

Status: `Not selected`. The earlier research recommendation was withdrawn after the
user compared the complete NosLog specimen.

Pinned implementation evidence: `@carbon/charts@1.27.18`; color values come from
Carbon palette tokens.

| Role                          | Light                                                            | Dark                                                             |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series                 | Purple 70 `#6929C4`                                              | Purple 30 `#D4BBFF`                                              |
| Six score buckets, low → high | `#E8DAFF`, `#D4BBFF`, `#BE95FF`, `#A56EFF`, `#8A3FFC`, `#6929C4` | `#6929C4`, `#8A3FFC`, `#A56EFF`, `#BE95FF`, `#D4BBFF`, `#E8DAFF` |
| FAST / SLOW                   | Purple 70 `#6929C4` / Teal 50 `#009D9A`                          | Purple 60 `#8A3FFC` / Teal 40 `#08BDBA`                          |
| Five categorical series       | `#6929C4`, `#1192E8`, `#005D5D`, `#9F1853`, `#570408`            | `#8A3FFC`, `#08BDBA`, `#BAE6FF`, `#4589FF`, `#FF7EB6`            |

The score sequence follows Carbon's rule that the largest value is darkest on a light
theme and lightest on a dark theme. FAST/SLOW uses Carbon's purple–teal option for
performance and rates of change, not its temperature-oriented red–cyan option.

### `LD-02 · GitLab Pajamas`

Status: `Not selected`.

Pinned implementation evidence: `@gitlab/ui@136.1.0`; generated Light/Dark token
files reverse the published data steps for the dark appearance.

| Role                          | Light                                                            | Dark                                                             |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series                 | Data Blue 500 `#617AE2`                                          | Data Blue 500 `#617AE2`                                          |
| Six score buckets, low → high | `#617AE2`, `#4E65CD`, `#3F51AE`, `#374291`, `#303470`, `#2A2B59` | `#617AE2`, `#7992F5`, `#97ACFF`, `#B7C6FF`, `#D2DCFF`, `#E9EBFF` |
| FAST / SLOW                   | Data Blue 500 `#617AE2` / Data Aqua 500 `#0090B1`                | same published base steps                                        |
| Five categorical series       | `#617AE2`, `#C95D2E`, `#0090B1`, `#619025`, `#CF4D81`            | same published base steps                                        |

FAST/SLOW uses the source's cool-to-cool direction because neither direction is good,
bad, success, or failure.

### `LD-03 · SAP Fiori Horizon`

Status: `Approved — 2026-08-10`.

Pinned implementation evidence: `@sap-theming/theming-base-content@11.36.3`, using
the exact `sap_horizon` and `sap_horizon_dark` chart tokens.

| Role                          | Light                                                            | Dark                                                             |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series                 | `sapChart_OrderedColor_1` `#168EFF`                              | `#3278BE`                                                        |
| Six score buckets, low → high | `#62B3FF`, `#3FA2FF`, `#168EFF`, `#0074E2`, `#0065C3`, `#0055A5` | `#1D456D`, `#275E96`, `#3278BE`, `#5291D1`, `#7AABDC`, `#A2C4E7` |
| FAST / SLOW                   | Ordered 1 `#168EFF` / Ordered 2 `#C87B00`                        | `#3278BE` / `#F2A634`                                            |
| Five categorical series       | `#168EFF`, `#C87B00`, `#75980B`, `#DF1278`, `#8B47D7`            | `#3278BE`, `#F2A634`, `#B4CE35`, `#FA4F96`, `#8B47D7`            |

SAP is the approved exact-theme source. FAST/SLOW is represented by its first two
qualitative colors rather than a purpose-documented neutral-performance diverging
pair; the approved role contract below addresses that known limitation.

## Shared role contract

The approved SAP mapping follows this contract:

1. `data.single`, `data.sequential.*`, `data.categorical.*`, and
   `data.direction.fast/slow` remain local chart/comparison aliases.
2. A score bucket never becomes warning, danger, success, rank, achievement, or
   difficulty color. The number, label, and fixed order carry its meaning.
3. FAST and SLOW always retain direct labels. Where lines overlap, they also use
   different point shapes or line styles.
4. A numeric threshold/reference line uses the approved Spectrum neutral structural
   owner by default. It becomes semantic feedback only after a separately approved
   product rule says the threshold means success, warning, or danger.
5. Grid, axis, tooltip surface, empty state, and missing data use approved neutral
   roles; selection and focus retain their already approved owners.
6. Adjacent filled marks use at least a `1px` surface-colored separation where needed.
7. Forced-colors, color-disabled, and color-vision-deficiency views must preserve
   labels, values, order, marker shape or line style, and selection.
8. No selected value may recolor the chart viewer/editor.

## Controlled specimen

[Open the local data-color comparison](./specimens/c5-local-data-color-source-comparison.html).
It uses the same ordinary NosLog content for all three candidates in Light and Dark:
score trend, six score buckets, FAST/SLOW, five judgement categories, and a neutral
reference line. It also exposes color-off and narrow-width checks.

## Approved result

The user selected `LD-03 · SAP Fiori Horizon` after reviewing the complete ordinary
NosLog specimen in Light and Dark.

- Its blue sequential score buckets are calm while preserving immediate order.
- The blue/orange FAST/SLOW pair is more distinguishable at a glance than the other
  finalists in the actual NosLog chart density.
- Its five qualitative values remain distinct without making the page feel dominated
  by one vivid hue.
- Carbon's purple-led mapping was explicitly rejected as visually unsuitable in the
  NosLog specimen; it also sat too close to the separately approved Radix Indigo
  identity family. GitLab remains comparison evidence only.

SAP's FAST/SLOW values originate from qualitative colors 1 and 2 rather than a
purpose-named diverging scale. This is approved because FAST and SLOW are two labeled
independent counts, not a good/bad semantic continuum, and the non-color contract keeps
direct labels, circle/square markers, and solid/dashed lines.

This approval makes the exact values in `LD-03` authoritative for ordinary
comparison-local data color. It does not authorize app implementation in this design
guide session and does not apply to the locked chart viewer/editor.

## Decision log

| ID       | Entry                                                                                            | Status                                                |
| -------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `LDC-01` | Treat score buckets as ordered quantitative data, not six achievement/status meanings.           | `Approved — 2026-08-10`                               |
| `LDC-02` | Treat FAST/SLOW as a labeled two-direction comparison, never danger/info or good/bad.            | `Approved — 2026-08-10`                               |
| `LDC-03` | Keep numeric threshold/reference lines neutral unless product semantics explicitly promote them. | `Approved — 2026-08-10`                               |
| `LDC-04` | Advance Carbon, GitLab Pajamas, and SAP Horizon as exact-family visual finalists.                | `Completed evidence`                                  |
| `LDC-05` | Recommend `LD-01 · IBM Carbon Charts`.                                                           | `Rejected and superseded by user review — 2026-08-10` |
| `LDC-06` | Keep the entire chart viewer/editor outside this gate.                                           | `Locked upstream`                                     |
| `LDC-07` | Adopt `LD-03 · SAP Fiori Horizon` as the exact ordinary local-data family.                       | `Approved — 2026-08-10`                               |
