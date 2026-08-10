# NosLog 2.0 Foundation Data-Visualization Anatomy Source Comparison

## Document control

- Status: `Approved — DV-05 GitHub Primer; Block 4 complete`
- Canonical language: English
- Korean companion:
  [62-foundation-data-visualization-anatomy-source-comparison.ko.md](./62-foundation-data-visualization-anatomy-source-comparison.ko.md)
- Date: 2026-08-10
- Scope: ordinary NosLog 2.0 statistics and comparison charts only
- Excluded: the entire locked chart viewer/editor, every renderer, chart notes,
  hand colors, geometry, timing, controls, accessibility behavior, and responsive shell
- Specimen:
  [foundation-data-visualization-anatomy-source-comparison.html](./specimens/foundation-data-visualization-anatomy-source-comparison.html)

## Approved decision

Block `4 · Data visualization` uses `DV-05 · GitHub Primer` as the governing anatomy and interaction source
for ordinary UI charts: visible purpose, axes, units, legends or direct labels, exact
values, pointer and keyboard detail, non-color distinction, and access to the same
data as a semantic table. This is not a color decision. All candidates use the already
approved `LD-03 · SAP Fiori Horizon` Light/Dark data colors and the approved neutral,
focus, geometry, icon, and motion rules.

The decision does not authorize production implementation. It packages an explicit
rule for Claude Design and the later implementation session.

## Locked boundary

The chart viewer and editor are not examples, candidates, or migration targets. No
rule in this document applies to their DOM, controls, PixiJS/WebGL or Canvas renderers,
chart marks, palettes, accessibility model, layout, or behavior. The word “chart” in
this document means an ordinary product statistic such as a score trend, distribution,
rating-weight explanation, profile trend, or administrative activity comparison.

## Current ordinary-UI evidence

The repository was inspected read-only with both locked `chart-pattern` trees excluded.
The current implementation uses Recharts `3.9.2`; that library is implementation
inventory rather than design authority.

| Current component                            | Current chart                                     | Evidence and gap relevant to Block 4                                                                                                  |
| -------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `components/music/patternProfileChart.tsx`   | five-axis radar                                   | Labels are visible, but the numeric scale is hidden and there is no exact-value interaction or table equivalent.                      |
| `components/music/musicTierSummary.tsx`      | compact history line plus hand-built distribution | The line hides both axes; hover supplies detail. The distribution is visually labeled but not a semantic data table.                  |
| `components/music/scoreTrend.tsx`            | score, judgement, and FAST/SLOW trends            | Metric labels and pointer tooltip exist, but axes are hidden and exact access is predominantly hover-dependent.                       |
| `components/profile/chart.tsx`               | rating trend                                      | The wrapper has an accessible name and tooltip, but no x-axis context or table equivalent.                                            |
| `components/tiers/tierRatingWeightChart.tsx` | rating-weight line                                | Visible axes, grid, tooltip, and accessible name make it the closest current baseline; it still lacks a table equivalent.             |
| `components/admin/adminActivityChart.tsx`    | three-series activity bars                        | Axes and tooltip are visible, but the series have no persistent legend/direct label and the chart has no accessible data alternative. |

These are migration observations, not approval to retain the current visual styling.
The repeated gaps are missing persistent series identity, hidden context, hover-only
exact values, and absent semantic-table access.

## Independent reference matrix

Sixteen independent authoritative or maintained production sources were reviewed.
Multiple pages from one organization count as one source. The first six become
controlled visual candidates; the remaining sources constrain accessibility,
interaction, and implementation acceptance.

|   # | Independent source                                                                                                                                                                              | Transferable evidence                                                                                                                                                                                                 | NosLog fit and limitation                                                                                                                                                                          |
| --: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [W3C WAI complex images](https://www.w3.org/WAI/tutorials/images/complex/) and [tables](https://www.w3.org/WAI/tutorials/tables/)                                                               | Identify a complex chart briefly, then provide the complete relationship as structured text or a real table with headers and caption.                                                                                 | Governing accessibility floor, not a visual anatomy source. An opaque `aria-label` alone is insufficient for the current charts.                                                                   |
|   2 | [Adobe Spectrum line chart](https://spectrum.adobe.com/page/line-chart/)                                                                                                                        | Explicit grid, ticks, axis titles and labels, point/crosshair tooltip, arrow-key point navigation, loading and empty states, sharp lines, and a six-series ceiling.                                                   | Strongest point-focus behavior. Its prohibition on line styles and marker shapes conflicts with the already approved FAST/SLOW non-color contract.                                                 |
|   3 | [IBM Carbon legends](https://carbondesignsystem.com/data-visualization/legends/)                                                                                                                | Prefer direct labels; use a bottom legend by default, stack it on mobile, allow focusable isolation, and do not hide it without an explicit reveal control.                                                           | Excellent series-identification pattern. The published legend guidance is marked work in progress and does not by itself provide the complete table fallback.                                      |
|   4 | [SAP Fiori data visualization](https://experience.sap.com/fiori-design-web/explore_group/data-visualization/) and [toolbar](https://experience.sap.com/fiori-design-web/explore_group/toolbar/) | Chart title/toolbar, responsive controls, optional legend action, and chart/table view switch when subtle visual distinctions need an alternative.                                                                    | Complete analytical pattern and aligned with approved data-color provenance; the enterprise toolbar is unnecessarily heavy for many compact NosLog charts.                                         |
|   5 | [GitLab Pajamas charts](https://design.gitlab.com/data-visualization/charts/)                                                                                                                   | Titles, category/value labels and units, visible legend for multiple series, tabular legends for dense series, structured point popovers, and responsive consistency.                                                 | Strong compact dashboard pattern. It lacks one equally explicit chart-to-semantic-table contract.                                                                                                  |
|   6 | [GitHub Primer data visualization](https://primer.style/product/ui-patterns/data-visualization/)                                                                                                | Required header, axes/labels/grid, line-chart point/crosshair/tooltip, persistent legend for multiple series, distinct stroke styles and markers, chart limits, and table preview/CSV actions for most simple charts. | Covers every Block 4 role in one maintained product system and directly matches the approved FAST/SLOW non-color contract. Keyboard point grammar still needs the universal acceptance rule below. |
|   7 | [GOV.UK charts](https://brand.design-system.service.gov.uk/data/charts/)                                                                                                                        | State the message with title/subtitle, label axes and units, annotate significant evidence, cite the source, and avoid interaction unless it adds necessary detail.                                                   | Best editorial clarity benchmark; too static to govern all exploratory NosLog charts alone.                                                                                                        |
|   8 | [UK Analysis Function chart guidance](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)                                                                     | Accessible SVG, simple axes, restrained gridlines, visible labels, descriptive alternatives, and testing rather than claiming a chart is fully accessible.                                                            | Strong public-information validation rules; not an application component system.                                                                                                                   |
|   9 | [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)                                                                                  | Structural axes use ordinary text/border roles; chart color needs labels or non-color indicators; adjacent regions need separation; provide table or text descriptions.                                               | Supports the fixed neutral and accessibility layers; incomplete as the sole anatomy source.                                                                                                        |
|  10 | [Apache ECharts ARIA](https://echarts.apache.org/handbook/en/best-practices/aria/)                                                                                                              | Author descriptions and decals deliberately; generated descriptions and decals are opt-in rather than automatic accessibility.                                                                                        | Relevant to GitLab's implementation lineage and warns against assuming a chart library exposes a useful reading order.                                                                             |
|  11 | [Highcharts accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview)                                                                                 | Information region, keyboard point navigation, screen-reader data table, localization, and controlled announcements for updates.                                                                                      | Strong implementation benchmark; changing NosLog from Recharts to Highcharts is not proposed.                                                                                                      |
|  12 | [Apple HIG charts](https://developer.apple.com/design/human-interface-guidelines/charts)                                                                                                        | Describe a chart and its values for VoiceOver, avoid requiring interaction for critical meaning, and keep visual and nonvisual access consistent.                                                                     | Strong mobile and nonvisual benchmark; platform APIs are not direct Web implementation instructions.                                                                                               |
|  13 | [Observable Plot accessibility](https://observablehq.com/plot/features/accessibility)                                                                                                           | Give the root and meaningful marks labels/descriptions, hide decorative marks, and expose intentional reading order.                                                                                                  | Useful SVG semantics evidence; not a complete product anatomy system.                                                                                                                              |
|  14 | [MUI X Charts accessibility](https://mui.com/x/react-charts/accessibility/)                                                                                                                     | Keyboard navigation, visible SVG focus, localized point descriptions, and reduced-motion behavior are component responsibilities.                                                                                     | Useful React implementation benchmark; its default styling is not a NosLog authority.                                                                                                              |
|  15 | [Tableau accessible visualizations](https://help.tableau.com/current/online/en-us/accessible_viz_authoring.htm)                                                                                 | Keep visualizations simple, expose labels and underlying data, test keyboard order, and author useful accessible names.                                                                                               | Production analytics evidence; Tableau-specific authoring is not a component source.                                                                                                               |
|  16 | [Vega title](https://vega.github.io/vega/docs/title/) and [ARIA configuration](https://vega.github.io/vega/docs/config/)                                                                        | Titles/subtitles and mark-level accessible descriptions are authored grammar, not decoration.                                                                                                                         | Useful declarative implementation evidence; leaves product layout and table access to NosLog.                                                                                                      |

### Convergence

- Every non-decorative chart needs a concise visible purpose. Axes and units are
  visible unless a nearby subtitle communicates the same context without ambiguity.
- A single series may omit a legend when the title or a direct label identifies it.
  Multiple series require direct labels or a persistent visible legend.
- Exact values cannot be pointer-hover-only. Focus and touch reveal the same structured
  date/category, series, value, and unit; critical conclusions remain visible before
  interaction.
- Color is never the only persistent distinction. Names, order, direct labels, stroke
  or marker treatment, separation, or a table preserve meaning.
- A chart summary plus the complete data in a semantic table is the reliable
  alternative. SVG accessibility and a table complement rather than replace each other.
- Mobile reduces tick density and stacks legends or controls; it does not truncate
  values or introduce two-dimensional page scrolling.
- Loading, empty, partial/error, and updated states are deliberate chart states.
  Rendering an unexplained empty plot is not acceptable.
- Decorative axes, gridlines, and shapes are hidden from the accessibility tree;
  meaningful marks use localized descriptions and intentional focus order.

### Material disagreement

- Spectrum reserves dashes for predicted values and rejects marker shapes for series,
  while Primer explicitly requires stroke and marker variation. The approved document
  `58` FAST/SLOW contract already requires solid/dashed and circle/square reinforcement,
  so Spectrum cannot be adopted intact for that domain role.
- Carbon prefers direct labels and minimizes legends. Primer and GitLab require a
  legend for multiple series unless direct labels are viable. These converge in
  outcome but differ in default composition.
- SAP gives chart/table switching a prominent toolbar role. Primer places preview and
  CSV actions in a chart menu. GOV.UK prefers a visible textual alternative and minimal
  interaction. The correct weight depends on whether the chart is analytical or
  compact supporting content.

## Controlled candidates

The specimen renders the same two-series NosLog score comparison in every card. Theme,
content, dimensions, numbers, `LD-03` colors, focus treatment, and responsive container
are fixed. Only source-owned anatomy and alternative-data placement change.

| ID      | Source anatomy       | Visible composition                                                                                                                    | Data alternative                                                                                | Evaluation                                                                                                            |
| ------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `DV-01` | Adobe Spectrum 2.0.0 | Explicit axis titles, crosshair and point tooltip, conventional legend, keyboard point model.                                          | A fixed W3C table link follows the chart because Spectrum does not define a full table control. | Excellent point interaction, but the source's line/shape prohibition conflicts with approved FAST/SLOW reinforcement. |
| `DV-02` | IBM Carbon           | Direct end labels first; bottom legend only when direct labels do not fit; compact exact summary.                                      | Fixed W3C table disclosure below the frame.                                                     | Clearest low-clutter comparison; incomplete as one intact source for the table/focus contract.                        |
| `DV-03` | SAP Fiori            | Title toolbar, visible legend, chart/table segmented switch, responsive overflow.                                                      | First-class table view in the same container.                                                   | Complete and aligned with the selected color system, but visually heavy for compact profile and music-detail charts.  |
| `DV-04` | GitLab Pajamas       | Title and unit, legend with current values, structured point popover.                                                                  | Fixed W3C table disclosure below the frame.                                                     | Strong for dense dashboards; accessibility completion still depends on an external baseline.                          |
| `DV-05` | GitHub Primer        | Required header/subheader, labeled axes, grid, points/crosshair/tooltip, persistent legend, non-color stroke/markers, compact toolbar. | Table preview and CSV are source-defined chart actions.                                         | **Approved.** Primer anatomy with outlined blue personal circles and filled orange benchmark circles.                 |
| `DV-06` | GOV.UK               | Message-led title/subtitle, direct annotation and source, restrained chart, no unnecessary chart interaction.                          | Visible data table immediately after the chart.                                                 | Best for static public explanation; too editorial to govern exploratory score trends alone.                           |

## Approved universal acceptance contract

W3C/accessibility requirements and already approved NosLog rules remain non-negotiable.
GitHub Primer owns the visual anatomy and
placement; this contract closes implementation gaps without mixing visual values.

1. A chart container has a visible localized title and, where needed, a subtitle that
   identifies measure, dimension, date range, and unit.
2. Axes and units are visible by default. A compact chart may omit an axis title only
   when the adjacent subtitle supplies the same unambiguous context. Tick density may
   reduce at `320px`; numeric meaning may not disappear.
3. One series uses the title or a direct label. Two or more series use direct labels
   when collision-free; otherwise a persistent legend follows plot order and stacks on
   narrow containers. Do not hide the only legend behind hover.
4. Pointer hover, keyboard focus, and touch activation reveal the same localized
   `dimension → series → exact value → unit` detail. Arrow keys move among points;
   `Home`/`End` move to the first/last point in the active series. Focus uses the
   already approved indicator and does not depend on animation.
5. The chart's key conclusion and latest/current exact value remain visible without
   interaction. Tooltip content supplements rather than owns critical information.
6. FAST/SLOW retain the approved direct labels, solid/circle versus dashed/square
   treatment, and SAP colors. Judgement markers retain document `59`; difficulty
   markers retain document `56`.
   An ordinary personal-versus-benchmark comparison is a separate role: the personal
   series uses an outlined blue circle and solid line; the benchmark uses a filled
   orange circle and dashed line. This does not alter the FAST/SLOW contract.
7. Every analytical chart exposes a same-data semantic `<table>` with caption, column
   headers, row headers where useful, locale-formatted values, and the active filtered
   subset. A compact supporting chart may use an adjacent “View data table” disclosure;
   the control itself is always keyboard-accessible and named.
8. CSV download is offered only when users need reuse of a multi-row dataset. It does
   not replace the in-product semantic table.
9. Loading reserves the plot region and has visible busy text plus `aria-busy`. Empty
   and error states replace the plot with a cause and next action. Partial data and
   estimated/predicted values are explicitly labeled.
10. At `320px`, `390px`, and desktop, there is no page-level horizontal overflow.
    Legends stack; toolbars contain only necessary actions; tables may use a labeled
    contained scroller when their inherent dimensions require it.
11. Korean, Japanese, and English labels wrap without clipping. Dates, separators,
    percentages, and compact notation use the active locale; exact table values do not
    lose precision through visual abbreviation.
12. The entire viewer/editor remains outside every rule above.

## Completed controlled-specimen validation

- At `1280×720`, all six candidates render in two columns with six distinct source
  compositions and no page-level horizontal overflow.
- At `390×844`, Japanese copy, Dark appearance, and color-disabled mode reflow to one
  column. Every candidate remains contained; the only horizontal overflow is inside
  the explicitly labeled semantic-table scroller.
- At `320×760`, the longest English candidate and control labels wrap without body or
  page overflow. The Primer and SAP table views expose the same five rows and preserve
  complete exact values in a contained table scroller.
- `End` moves focus to the last point in the active series. `ArrowDown` moves from the
  personal series to the corresponding benchmark point; tooltip and crosshair update
  with focus.
- Pointer/focus point labels expose date, series, exact localized value, and unit.
  Visible tables have captions plus column and row headers.
- Dark color-disabled mode computes both data colors to the neutral foreground while
  line treatment, marker treatment, and labels remain. Spectrum's intentionally
  preserved same-stroke/same-shape conflict remains visible for evaluation.
- The revised `DV-05` renders both series with circular geometry: personal markers are
  outlined and benchmark markers are filled. At `390px` Dark color-disabled mode,
  outline/fill plus solid/dashed remain distinct; at `320px`, arrow-key series movement,
  tooltip, crosshair, and page containment still pass.
- No browser console warning or error was observed. The specimen changes no production
  component, dependency, viewer/editor file, or renderer behavior.

## Approved source and marker contract

The user approved `DV-05 · GitHub Primer` on 2026-08-10. It is the only
candidate whose published anatomy
directly includes the visible chart context, persistent multi-series identification,
non-color line/marker distinction, point tooltip/crosshair, chart limits, table preview,
and CSV action in one maintained product system. It also fits the existing compact
NosLog inventory without importing SAP's full analytical toolbar.

The comparison initially rendered the orange benchmark with a square marker. That
shape is not required by the already approved FAST/SLOW rule because this specimen is
personal score versus an external benchmark, not FAST versus SLOW. The revised
`DV-05` therefore uses an outlined blue circle for the personal series and a filled
orange circle for the benchmark while preserving solid versus dashed strokes, a
persistent legend, exact-value focus, and the table view. In color-disabled mode,
outline versus fill and solid versus dashed remain two independent non-color cues.

Primer's published guidance asks markers to differ between series. The revised
outlined-versus-filled circle is an explicit user-directed NosLog treatment rather
than a literal different-shape reading of that guidance. It changes no source color
or Foundation primitive and is recorded openly rather than presented as upstream
Primer behavior. The user reviewed and approved the revised visual, exact-value and
table behavior, responsive layouts, keyboard behavior, and non-color distinction.
The other five candidates remain comparison evidence only. This approval closes
Block 4.

## Decision log

| ID       | Entry                                                                                                                               | Status                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `DVA-01` | Keep the entire chart viewer/editor outside Block 4.                                                                                | `Locked upstream`                    |
| `DVA-02` | Hold `LD-03` colors and completed Foundation decisions constant while comparing anatomy.                                            | `Approved upstream constraint`       |
| `DVA-03` | Use sixteen independent sources and six controlled source candidates.                                                               | `Completed evidence`                 |
| `DVA-04` | Apply the W3C semantic-table and equivalent-access floor to every candidate.                                                        | `Approved — 2026-08-10`              |
| `DVA-05` | Select `DV-05 · GitHub Primer` as the governing ordinary-UI anatomy direction.                                                      | `Approved — 2026-08-10`              |
| `DVA-06` | For personal-versus-benchmark charts, use outlined blue and filled orange circles with solid/dashed lines; do not change FAST/SLOW. | `Approved — 2026-08-10`              |
| `DVA-07` | Close Block 4 after responsive, localized, keyboard, non-color, exact-value, and semantic-table validation.                         | `Approved and complete — 2026-08-10` |
