# NosLog 2.0 Foundation Data-Visualization Anatomy 출처 비교

## 문서 관리

- 상태: `Proposed — 블록 4 출처 결정 대기`
- 정본 언어: 영어
- 영어 정본:
  [62-foundation-data-visualization-anatomy-source-comparison.md](./62-foundation-data-visualization-anatomy-source-comparison.md)
- 날짜: 2026-08-10
- 범위: 일반 NosLog 2.0 통계·비교 chart만 해당
- 제외: 잠긴 chart viewer/editor 전체, 모든 renderer, 채보 note, hand color,
  geometry, timing, control, accessibility behavior 및 responsive shell
- Specimen:
  [foundation-data-visualization-anatomy-source-comparison.html](./specimens/foundation-data-visualization-anatomy-source-comparison.html)

## 이번에 결정하는 것

블록 `4 · Data visualization`에서는 일반 UI chart의 지배적인 anatomy·interaction
출처 하나를 고릅니다. 범위는 눈에 보이는 목적, axis, unit, legend 또는 direct label,
exact value, pointer·keyboard detail, non-color 구분 및 같은 data의 semantic table
접근입니다. 이는 color 결정이 아닙니다. 모든 후보는 이미 승인한
`LD-03 · SAP Fiori Horizon` Light/Dark data color와 승인된 neutral, focus, geometry,
icon 및 motion 규칙을 똑같이 사용합니다.

이 결정은 production 구현을 허가하지 않습니다. Claude Design과 이후 구현 session이
사용할 명시적 규칙을 packaging하는 작업입니다.

## 잠긴 경계

Chart viewer와 editor는 예시, 후보 또는 migration target이 아닙니다. 이 문서의 어떤
규칙도 두 경험의 DOM, control, PixiJS/WebGL 또는 Canvas renderer, chart mark, palette,
accessibility model, layout 및 behavior에 적용하지 않습니다. 이 문서의 “chart”는 score
trend, distribution, rating-weight 설명, profile trend 또는 admin activity 비교 같은
일반 product statistic을 뜻합니다.

## 현재 일반 UI 근거

잠긴 `chart-pattern` tree 두 개를 제외하고 저장소를 read-only로 조사했습니다. 현재
구현은 Recharts `3.9.2`를 사용하지만, 이 library는 구현 inventory일 뿐 design
authority가 아닙니다.

| 현재 component                               | 현재 chart                                     | 블록 4에 관련된 근거와 gap                                                                                                       |
| -------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `components/music/patternProfileChart.tsx`   | 5-axis radar                                   | Label은 보이지만 numeric scale이 숨겨져 있고 exact-value interaction이나 table equivalent가 없습니다.                            |
| `components/music/musicTierSummary.tsx`      | compact history line과 hand-built distribution | Line은 두 axis를 모두 숨기며 hover가 detail을 담당합니다. Distribution에는 visual label이 있지만 semantic data table이 아닙니다. |
| `components/music/scoreTrend.tsx`            | score, judgement 및 FAST/SLOW trend            | Metric label과 pointer tooltip은 있지만 axis가 숨겨져 있고 exact access가 주로 hover에 의존합니다.                               |
| `components/profile/chart.tsx`               | rating trend                                   | Wrapper에 accessible name과 tooltip은 있지만 x-axis context와 table equivalent가 없습니다.                                       |
| `components/tiers/tierRatingWeightChart.tsx` | rating-weight line                             | Visible axis, grid, tooltip 및 accessible name이 있어 가장 가까운 현재 baseline이지만 table equivalent는 없습니다.               |
| `components/admin/adminActivityChart.tsx`    | 3-series activity bar                          | Axis와 tooltip은 보이지만 series의 persistent legend/direct label이 없고 accessible data alternative도 없습니다.                 |

이는 현재 visual style을 유지하라는 승인이 아니라 migration 관찰입니다. 반복되는 gap은
persistent series identity 누락, 숨겨진 context, hover-only exact value 및 semantic-table
접근 부재입니다.

## 독립 reference matrix

독립적이고 권위 있거나 유지 관리되는 production 출처 16개를 조사했습니다. 같은
organization의 여러 page는 하나의 출처로 셉니다. 앞의 6개는 통제된 visual 후보가 되고,
나머지는 accessibility, interaction 및 구현 acceptance를 제약합니다.

|   # | 독립 출처                                                                                                                                                                                      | 차용 가능한 근거                                                                                                                                                                                             | NosLog 적합성과 한계                                                                                                                                                                          |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [W3C WAI complex images](https://www.w3.org/WAI/tutorials/images/complex/) 및 [tables](https://www.w3.org/WAI/tutorials/tables/)                                                               | Complex chart를 짧게 식별한 뒤 관계 전체를 structured text 또는 header·caption이 있는 실제 table로 제공합니다.                                                                                               | Visual anatomy 출처가 아닌 governing accessibility floor입니다. 불투명한 `aria-label` 하나만으로는 현재 chart를 보완할 수 없습니다.                                                           |
|   2 | [Adobe Spectrum line chart](https://spectrum.adobe.com/page/line-chart/)                                                                                                                       | 명시적 grid, tick, axis title·label, point/crosshair tooltip, arrow-key point navigation, loading·empty state, sharp line 및 6-series ceiling을 정의합니다.                                                  | Point focus behavior가 가장 강합니다. Line style·marker shape 금지는 이미 승인한 FAST/SLOW non-color 계약과 충돌합니다.                                                                       |
|   3 | [IBM Carbon legends](https://carbondesignsystem.com/data-visualization/legends/)                                                                                                               | Direct label을 우선하고 bottom legend를 기본으로 하며 mobile에서 stack하고 focus 가능한 isolate interaction을 제공합니다. 명시적 reveal control 없이 숨기지 않습니다.                                        | Series 식별 pattern이 훌륭합니다. 공개 legend guidance는 work in progress이고 complete table fallback을 단독으로 제공하지 않습니다.                                                           |
|   4 | [SAP Fiori data visualization](https://experience.sap.com/fiori-design-web/explore_group/data-visualization/) 및 [toolbar](https://experience.sap.com/fiori-design-web/explore_group/toolbar/) | Chart title/toolbar, responsive control, optional legend action 및 미묘한 visual 차이의 대체 수단으로 chart/table view switch를 둡니다.                                                                      | 완전한 analytical pattern이며 승인된 data-color provenance와 맞지만 enterprise toolbar는 많은 compact NosLog chart에 과합니다.                                                                |
|   5 | [GitLab Pajamas charts](https://design.gitlab.com/data-visualization/charts/)                                                                                                                  | Title, category/value label과 unit, multi-series visible legend, dense series용 tabular legend, structured point popover 및 responsive consistency를 정의합니다.                                             | Compact dashboard에 강하지만 equally explicit한 chart-to-semantic-table 계약이 없습니다.                                                                                                      |
|   6 | [GitHub Primer data visualization](https://primer.style/product/ui-patterns/data-visualization/)                                                                                               | 필수 header, axis/label/grid, line chart point/crosshair/tooltip, multi-series persistent legend, 서로 다른 stroke style·marker, chart limit 및 대부분 simple chart의 table preview/CSV action을 정의합니다. | Block 4의 모든 역할을 한 maintained product system으로 다루며 승인된 FAST/SLOW non-color 계약과 직접 맞습니다. Keyboard point grammar에는 아래 universal acceptance rule이 여전히 필요합니다. |
|   7 | [GOV.UK charts](https://brand.design-system.service.gov.uk/data/charts/)                                                                                                                       | Title/subtitle로 message를 말하고, axis·unit을 표시하며, 중요한 근거를 annotate하고, source를 밝히며 꼭 필요할 때만 interaction을 추가합니다.                                                                | Editorial clarity의 가장 좋은 benchmark지만 exploratory NosLog chart 전체를 단독으로 지배하기에는 너무 static합니다.                                                                          |
|   8 | [UK Analysis Function chart guidance](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)                                                                    | Accessible SVG, 단순한 axis, 절제된 gridline, visible label, descriptive alternative 및 chart가 완전히 accessible하다고 가정하지 않는 testing을 요구합니다.                                                  | Public-information validation 규칙은 강하지만 application component system은 아닙니다.                                                                                                        |
|   9 | [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)                                                                                 | Structural axis는 일반 text/border role을 쓰고, chart color에는 label 또는 non-color indicator를 더하며, 인접 영역을 분리하고 table/text description을 제공합니다.                                           | 고정된 neutral·accessibility layer를 지지하지만 sole anatomy source로는 불완전합니다.                                                                                                         |
|  10 | [Apache ECharts ARIA](https://echarts.apache.org/handbook/en/best-practices/aria/)                                                                                                             | Description과 decal을 의도적으로 작성합니다. Generated description과 decal은 자동 accessibility가 아니라 opt-in입니다.                                                                                       | GitLab 구현 계보에 관련되며 chart library가 유용한 reading order를 자동 제공한다고 가정하지 못하게 합니다.                                                                                    |
|  11 | [Highcharts accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module-feature-overview)                                                                                | Information region, keyboard point navigation, screen-reader data table, localization 및 update의 controlled announcement를 제공합니다.                                                                      | 강한 구현 benchmark지만 Recharts에서 Highcharts로 바꾸자는 제안은 아닙니다.                                                                                                                   |
|  12 | [Apple HIG charts](https://developer.apple.com/design/human-interface-guidelines/charts)                                                                                                       | VoiceOver용 chart·value description을 제공하고 critical meaning을 interaction에 의존시키지 않으며 visual·nonvisual 접근을 일관되게 유지합니다.                                                               | Mobile·nonvisual benchmark는 강하지만 platform API를 Web 구현 지시로 직접 쓰지는 않습니다.                                                                                                    |
|  13 | [Observable Plot accessibility](https://observablehq.com/plot/features/accessibility)                                                                                                          | Root와 meaningful mark에 label/description을 주고 decorative mark는 숨기며 의도적인 reading order를 노출합니다.                                                                                              | SVG semantic 근거로 유용하지만 complete product anatomy system은 아닙니다.                                                                                                                    |
|  14 | [MUI X Charts accessibility](https://mui.com/x/react-charts/accessibility/)                                                                                                                    | Keyboard navigation, visible SVG focus, localized point description 및 reduced-motion behavior를 component 책임으로 둡니다.                                                                                  | React 구현 benchmark로 유용하지만 default styling은 NosLog authority가 아닙니다.                                                                                                              |
|  15 | [Tableau accessible visualizations](https://help.tableau.com/current/online/en-us/accessible_viz_authoring.htm)                                                                                | Visualization을 단순하게 유지하고 label·underlying data를 노출하며 keyboard order와 useful accessible name을 검사합니다.                                                                                     | Production analytics 근거이며 Tableau-specific authoring은 component source가 아닙니다.                                                                                                       |
|  16 | [Vega title](https://vega.github.io/vega/docs/title/) 및 [ARIA configuration](https://vega.github.io/vega/docs/config/)                                                                        | Title/subtitle과 mark-level accessible description은 decoration이 아니라 authored grammar입니다.                                                                                                             | Declarative 구현 근거로 유용하지만 product layout과 table access는 NosLog가 정해야 합니다.                                                                                                    |

### 수렴점

- Decorative가 아닌 모든 chart에는 concise visible purpose가 필요합니다. Axis·unit은
  visible이 기본이며, 같은 context를 nearby subtitle이 모호함 없이 전달할 때만 생략합니다.
- Single series는 title 또는 direct label이 식별하면 legend를 생략할 수 있습니다.
  Multi-series에는 direct label 또는 persistent visible legend가 필요합니다.
- Exact value는 pointer-hover-only일 수 없습니다. Focus와 touch가 같은 구조의
  date/category, series, value 및 unit을 보여주고 critical conclusion은 interaction 전에도 보입니다.
- Color는 유일한 persistent 구분이 아닙니다. Name, order, direct label, stroke 또는
  marker treatment, separation, table이 의미를 보존합니다.
- Chart summary와 complete data semantic table이 신뢰할 수 있는 대체 수단입니다.
  SVG accessibility와 table은 서로 대체하는 게 아니라 보완합니다.
- Mobile에서는 tick density를 줄이고 legend·control을 stack하지만 value를 truncate하거나
  2차원 page scrolling을 만들지 않습니다.
- Loading, empty, partial/error 및 updated state는 의도적으로 설계합니다. 이유 없는 empty
  plot을 그리는 것은 허용하지 않습니다.
- Decorative axis, gridline 및 shape는 accessibility tree에서 숨기고 meaningful mark에는
  localized description과 의도된 focus order를 줍니다.

### 중요한 불일치

- Spectrum은 dash를 predicted value에만 쓰고 series marker shape를 거부하지만 Primer는
  stroke·marker variation을 명시적으로 요구합니다. 이미 승인된 문서 `58` FAST/SLOW
  계약은 solid/dashed와 circle/square 보강을 요구하므로 Spectrum을 이 domain role에
  그대로 채택할 수 없습니다.
- Carbon은 direct label을 우선하고 legend를 최소화합니다. Primer와 GitLab은 direct
  label이 가능하지 않은 multi-series에 legend를 요구합니다. 결과는 수렴하지만 기본
  composition이 다릅니다.
- SAP은 chart/table switch를 toolbar의 prominent role로 둡니다. Primer는 preview와 CSV를
  chart menu에 둡니다. GOV.UK는 visible textual alternative와 최소 interaction을 선호합니다.
  적절한 무게는 analytical chart인지 compact supporting content인지에 따라 달라집니다.

## 통제된 후보

Specimen은 모든 card에 같은 2-series NosLog score comparison을 그립니다. Theme,
content, dimension, number, `LD-03` color, focus treatment 및 responsive container는
고정하고 source-owned anatomy와 alternative-data placement만 바꿉니다.

| ID      | Source anatomy       | Visible composition                                                                                                              | Data alternative                                                               | 평가                                                                                                          |
| ------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `DV-01` | Adobe Spectrum 2.0.0 | 명시적 axis title, crosshair·point tooltip, conventional legend, keyboard point model.                                           | Spectrum에 full table control이 없어 fixed W3C table link를 chart 뒤에 둡니다. | Point interaction은 뛰어나지만 source의 line/shape 금지가 승인된 FAST/SLOW 보강과 충돌합니다.                 |
| `DV-02` | IBM Carbon           | Direct end label 우선, 맞지 않을 때만 bottom legend, compact exact summary.                                                      | Frame 아래 fixed W3C table disclosure.                                         | 가장 명료하고 clutter가 적지만 하나의 intact source로 table/focus 계약을 완성하지 못합니다.                   |
| `DV-03` | SAP Fiori            | Title toolbar, visible legend, chart/table segmented switch, responsive overflow.                                                | 같은 container의 first-class table view.                                       | 완전하고 선택된 color system과 맞지만 compact profile·music-detail chart에는 visually heavy합니다.            |
| `DV-04` | GitLab Pajamas       | Title·unit, current value를 포함한 legend, structured point popover.                                                             | Frame 아래 fixed W3C table disclosure.                                         | Dense dashboard에 강하지만 accessibility 완성은 external baseline에 의존합니다.                               |
| `DV-05` | GitHub Primer        | 필수 header/subheader, labeled axis, grid, point/crosshair/tooltip, persistent legend, non-color stroke/marker, compact toolbar. | Table preview와 CSV가 source-defined chart action입니다.                       | **추천.** 한 system이 Block 4 전체 anatomy를 다루고 enterprise toolbar 없이 승인된 FAST/SLOW 계약과 맞습니다. |
| `DV-06` | GOV.UK               | Message-led title/subtitle, direct annotation·source, restrained chart, 불필요한 chart interaction 없음.                         | Chart 바로 뒤 visible data table.                                              | Static public explanation에는 가장 좋지만 exploratory score trend 전체를 지배하기에는 너무 editorial합니다.   |

## 제안하는 universal acceptance 계약

사용자가 어느 출처를 고르더라도 W3C/accessibility 요구와 이미 승인된 NosLog 규칙은
바뀌지 않습니다. 선택 출처가 visual anatomy·placement를 소유하고, 이 계약은 visual
value를 섞지 않으면서 구현 gap을 닫습니다.

1. Chart container에는 visible localized title이 있고 필요하면 measure, dimension, date
   range 및 unit을 식별하는 subtitle을 둡니다.
2. Axis와 unit은 기본적으로 보입니다. Compact chart는 adjacent subtitle이 같은 context를
   모호함 없이 제공할 때만 axis title을 생략할 수 있습니다. `320px`에서 tick density는
   줄일 수 있지만 numeric meaning은 사라질 수 없습니다.
3. Single series는 title 또는 direct label을 사용합니다. 2개 이상은 collision이 없으면
   direct label, 아니면 plot order를 따르는 persistent legend를 사용하고 narrow
   container에서는 stack합니다. 유일한 legend를 hover 뒤에 숨기지 않습니다.
4. Pointer hover, keyboard focus 및 touch activation은 같은 localized
   `dimension → series → exact value → unit` detail을 보여줍니다. Arrow key는 point 사이를
   이동하고 `Home`/`End`는 active series의 처음/끝 point로 갑니다. Focus는 이미 승인된
   indicator를 쓰고 animation에 의존하지 않습니다.
5. Chart의 key conclusion과 latest/current exact value는 interaction 없이도 보입니다.
   Tooltip은 critical information을 소유하지 않고 보완합니다.
6. FAST/SLOW는 승인된 direct label, solid/circle 대 dashed/square treatment 및 SAP color를
   유지합니다. Judgement marker는 문서 `59`, difficulty marker는 문서 `56`을 유지합니다.
7. 모든 analytical chart는 같은 data의 semantic `<table>`을 제공합니다. Caption, column
   header, 필요한 row header, locale-formatted value 및 active filtered subset을 포함합니다.
   Compact supporting chart는 adjacent “데이터 표 보기” disclosure를 쓸 수 있고 control
   자체는 언제나 keyboard-accessible하고 이름이 있어야 합니다.
8. CSV download는 multi-row dataset을 재사용할 필요가 있을 때만 제공합니다. In-product
   semantic table을 대체하지 않습니다.
9. Loading은 plot 영역을 예약하고 visible busy text와 `aria-busy`를 가집니다. Empty·error
   state는 원인과 다음 action으로 plot을 대체합니다. Partial data와 estimated/predicted
   value는 명시적으로 label합니다.
10. `320px`, `390px`, desktop에서 page-level horizontal overflow가 없습니다. Legend는
    stack하고 toolbar에는 필요한 action만 둡니다. Table은 inherent dimension이 요구하면
    이름 있는 contained scroller를 사용할 수 있습니다.
11. 한국어, 일본어, 영어 label은 clipping 없이 wrap합니다. Date, separator, percentage 및
    compact notation은 active locale을 쓰며 exact table value는 visual abbreviation 때문에
    precision을 잃지 않습니다.
12. Viewer/editor 전체는 위 모든 규칙 밖에 있습니다.

## 완료한 통제 specimen 검증

- `1280×720`에서 후보 6개가 서로 다른 source composition으로 2열에 표시되며
  page-level horizontal overflow가 없습니다.
- `390×844`에서 일본어 copy, Dark appearance 및 color-disabled mode가 1열로
  reflow됩니다. 모든 후보가 container 안에 있고 유일한 horizontal overflow는 이름 있는
  semantic-table 내부 scroller에만 있습니다.
- `320×760`에서 가장 긴 영어 후보·control label이 body 또는 page overflow 없이
  wrap됩니다. Primer와 SAP table view는 같은 5개 row와 complete exact value를 이름 있는
  table scroller 안에서 유지합니다.
- `End`는 active series의 마지막 point로 focus를 이동합니다. `ArrowDown`은 personal
  series에서 같은 날짜의 benchmark point로 이동하며 tooltip·crosshair도 focus와 함께
  갱신됩니다.
- Pointer/focus point label은 date, series, exact localized value 및 unit을 노출합니다.
  Visible table에는 caption, column header 및 row header가 있습니다.
- Dark color-disabled mode에서 두 data color 모두 neutral foreground로 계산되지만
  dashed/square treatment와 label은 남습니다. Spectrum의 same-stroke/same-shape 충돌은
  평가할 수 있도록 의도적으로 그대로 보입니다.
- Browser console warning·error는 없었습니다. Specimen은 production component,
  dependency, viewer/editor file 또는 renderer behavior를 변경하지 않습니다.

## 추천과 사용자 gate

`DV-05 · GitHub Primer`를 추천합니다. 공개 anatomy 하나가 visible chart context,
persistent multi-series identification, non-color line/marker distinction, point
tooltip/crosshair, chart limit, table preview 및 CSV action을 모두 직접 포함하는 유일한
후보입니다. SAP의 full analytical toolbar를 가져오지 않으면서 현재 compact NosLog
inventory와도 맞습니다.

추천은 `Proposed`이며 승인되지 않았습니다. 사용자가 후보 하나를 선택하거나 수정된
비교를 요청해야 final alias를 정의하고 블록 4를 닫을 수 있습니다.

## Decision log

| ID       | Entry                                                                   | 상태                             |
| -------- | ----------------------------------------------------------------------- | -------------------------------- |
| `DVA-01` | Chart viewer/editor 전체를 블록 4 밖에 둡니다.                          | `Locked upstream`                |
| `DVA-02` | Anatomy 비교 동안 `LD-03` color와 완료된 Foundation 결정을 고정합니다.  | `Approved upstream constraint`   |
| `DVA-03` | 독립 출처 16개와 통제된 source 후보 6개를 사용합니다.                   | `Completed evidence`             |
| `DVA-04` | W3C semantic-table 및 equivalent-access floor를 모든 후보에 적용합니다. | `Proposed — 사용자 gate`         |
| `DVA-05` | `DV-05 · GitHub Primer`를 governing ordinary-UI anatomy로 올립니다.     | `Recommended — 사용자 결정 대기` |
