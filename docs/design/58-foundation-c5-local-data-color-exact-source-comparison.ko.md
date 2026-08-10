# NosLog 2.0 — C5 Local Data Color 정확한 출처 비교

> 정본 언어: 영어  
> 영어 정본: [58-foundation-c5-local-data-color-exact-source-comparison.md](./58-foundation-c5-local-data-color-exact-source-comparison.md)  
> 상태: `Approved — LD-03 SAP Fiori Horizon — 2026-08-10`  
> 날짜: `2026-08-10`

## 목적

채보 viewer/editor 시각 요소를 다시 열지 않고 블록 `1 · C5 color 마감`을 완료한
comparison-local data color 승인 결과를 기록합니다. 이 gate는 다음 일반 product UI만 다룹니다.

- score, 정확도 또는 grade의 단일 trend;
- 순서가 있는 여섯 score distribution bucket;
- label이 붙은 `FAST`, `SLOW` 두 series;
- 여러 series로 된 판정 또는 기록 비교;
- 구조적인 threshold와 reference line.

이 문서는 정확한 출처 비교이며 구현 변경이 아닙니다. `bg-score`, `text-danger`,
`stroke: var(--color-chart)` 같은 1.x class는 계속 migration evidence일 뿐입니다.

## 잠긴 경계

채보 viewer/editor 전체는 제외됩니다. page, control, DOM, responsive/accessibility 동작,
PixiJS/WebGL, Canvas, note, hand color, palette, geometry, math, animation, editor model을
모두 포함합니다. 이 문서의 specimen이나 제안은 해당 system을 포함하거나 변경하지 않습니다.

Difficulty marker color는 `DU-01 · Adobe Spectrum S2`로 이미 별도 종료됐습니다. Local
data color는 그 mapping을 바꾸거나 difficulty, feedback, focus, identity, interaction
color가 될 수 없습니다.

## 현재 NosLog 근거

| 일반 UI 사례                   | 현재 근거                                                | 2.0 분류                                                                                     |
| ------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Score, S-Just, Miss/Near trend | 값, 날짜, tooltip이 있는 한 개 line                      | `single-series`                                                                              |
| Score distribution             | `950,000`부터 `Pianist`까지 고정된 여섯 bucket           | `sequential`; bucket label과 순서가 계속 주된 단서                                           |
| FAST/SLOW trend                | 독립적으로 측정되고 명시적으로 이름 붙은 두 count        | `two-direction comparison`; label과 서로 다른 line marker 필수                               |
| 판정 breakdown                 | count와 percentage가 있는 이름 붙은 다섯 category        | `domain categorical`; 문서 `59`가 `judgement.*`에 한해 일반 SAP 순서를 supersede합니다.      |
| `990,000` 등의 reference       | 자동으로 success/warning이 되는 값이 아닌 숫자 reference | `structural threshold`; product 의미가 명시적으로 승격시키지 않는 한 승인 neutral owner 사용 |

FAST에 universal `danger`, S-Just에 `score`, SLOW에 `chart`를 쓰는 기존 방식은 token
ownership으로는 거부합니다. 서로 무관한 UI 의미를 암시하기 때문입니다.

## 폭넓은 reference 비교

서로 독립적인 권위 있거나 유지되는 production 출처 14개를 비교했습니다. 처음 세 출처는
정확한 family finalist 자격이 있고, 나머지는 제약·pattern·제외 근거를 제공합니다.

| 출처                                                                                                                                 | 가져올 수 있는 근거                                                                                                          | NosLog 적합성 / 한계                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                        | 색만으로 의미를 전하지 않으며 graphical object와 필수 state는 지각 가능한 contrast가 필요합니다.                             | hue 외에도 label, 순서, marker, 간격, forced-colors 동작이 필요합니다.                                                                                               |
| [IBM Carbon data-visualization palettes](https://v10.carbondesignsystem.com/data-visualization/color-palettes/)                      | 정확한 categorical, sequential, 비온도형 diverging palette와 Light/Dark categorical mapping.                                 | role coverage가 완전하고 theme adaptation이 명확합니다. 기본 purple single series가 NosLog Indigo와 시각적으로 가까울 수 있으므로 context와 label을 유지해야 합니다. |
| [GitLab Pajamas data-visualization color](https://design.gitlab.com/data-visualization/color/)                                       | UI color와 분리한 palette, surface별 step 방향, categorical 순서, cool/cool 또는 cool/warm divergence.                       | role model이 완전하고 production 값이 절제돼 있습니다. cool/cool FAST/SLOW는 Carbon보다 hue 분리가 작습니다.                                                         |
| [SAP Fiori chart color palettes](https://experience.sap.com/fiori-design-web/values-and-names/)                                      | qualitative·sequential color의 정확한 theme token, chart당 한 palette, border·text companion.                                | 완전한 theme package와 명확한 token discipline이 있지만 FAST/SLOW를 위한 똑같이 명시적인 neutral-performance diverging pair는 없습니다.                              |
| [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)                       | single-series brand, neutral emphasis, categorical 순서, chart 전용 status role.                                             | 구조 근거는 강하지만 출처가 현재 sequential·divergent chart color를 지원하지 않는다고 명시하므로 NosLog 전체 role의 온전한 owner가 될 수 없습니다.                   |
| [Elastic EUI color palettes](https://eui.elastic.co/v107.0.1/docs/utilities/color-palettes/)                                         | color-blind 지향 categorical palette와 series별 사용 순서.                                                                   | categorical 근거에는 유용하지만 이 gate 전체를 맡을 온전한 sequential/diverging owner가 부족합니다.                                                                  |
| [PatternFly chart colors](https://v5-archive.patternfly.org/charts/colors-for-charts/)                                               | base-family 순서, 간격/pattern 보강, 절제된 변수 수.                                                                         | non-color cue 근거에는 유용하지만 인용한 v5 guide가 archive 상태이며 모든 role의 현재 adaptive family를 제공하지 않습니다.                                           |
| [Vega color schemes](https://vega.github.io/vega/docs/schemes/)                                                                      | categorical, sequential, diverging, cyclical scheme type을 명시합니다.                                                       | data-type taxonomy는 훌륭하지만 application Light/Dark token owner는 아닙니다.                                                                                       |
| [Observable Plot scales](https://observablehq.com/plot/features/scales)                                                              | scale type이 data type을 따르며 categorical과 quantitative scheme을 분리합니다.                                              | 구현·평가 근거는 강하지만 NosLog UI theme mapping이 없습니다.                                                                                                        |
| [Observable data-color study](https://observablehq.com/blog/crafting-data-colors)                                                    | 장식이 아니라 해석을 위해 최적화한 production categorical palette.                                                           | categorical benchmark에는 유용하지만 단독 sequential/diverging owner로는 불완전합니다.                                                                               |
| [ColorBrewer](https://colorbrewer2.org/)                                                                                             | 확립된 qualitative, sequential, diverging scheme 분류.                                                                       | 강한 기준 reference지만 주로 map/fill 지향이며 adaptive application token이 아닙니다.                                                                                |
| [D3 scale-chromatic](https://d3js.org/d3-scale-chromatic)                                                                            | categorical, sequential, diverging scheme의 유지되는 구현.                                                                   | 정확한 library 범위는 넓지만 UI theme와 semantic ownership은 adopter에게 남깁니다.                                                                                   |
| [Microsoft Power BI accessibility](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports) | marker·label 사용, color-only series 회피, high contrast, data table 노출.                                                   | NosLog marker/label/forced-colors contract를 직접 뒷받침하지만 채택할 단일 palette family는 아닙니다.                                                                |
| [Apple HIG Charts](https://developer.apple.com/design/human-interface-guidelines/charts)                                             | 색은 chart를 명료하게 만들 수 있지만 shape, pattern, label, accessibility summary, 비상호작용 접근이 의미를 보존해야 합니다. | non-color·보조기술 contract를 강화하지만 정확한 cross-web theme palette는 제공하지 않습니다.                                                                         |

추가 출처는 세 적격 family나 필수 non-color contract를 실질적으로 바꾸지 않았습니다.
Tailwind default는 의도적으로 evidence에서 제외했습니다.

## 정확한 finalist

아래 값은 모두 한 출처 family의 published value입니다. hue shift, interpolation,
cross-source palette mixing은 허용하지 않습니다.

### `LD-01 · IBM Carbon Charts`

상태: `Not selected`. 사용자가 완전한 NosLog specimen을 비교한 뒤 기존 조사 권고를
철회했습니다.

고정 implementation 근거: `@carbon/charts@1.27.18`; color value는 Carbon palette
token에서 가져옵니다.

| Role                             | Light                                                            | Dark                                                             |
| -------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series                    | Purple 70 `#6929C4`                                              | Purple 30 `#D4BBFF`                                              |
| Score bucket 여섯 개, low → high | `#E8DAFF`, `#D4BBFF`, `#BE95FF`, `#A56EFF`, `#8A3FFC`, `#6929C4` | `#6929C4`, `#8A3FFC`, `#A56EFF`, `#BE95FF`, `#D4BBFF`, `#E8DAFF` |
| FAST / SLOW                      | Purple 70 `#6929C4` / Teal 50 `#009D9A`                          | Purple 60 `#8A3FFC` / Teal 40 `#08BDBA`                          |
| Categorical series 다섯 개       | `#6929C4`, `#1192E8`, `#005D5D`, `#9F1853`, `#570408`            | `#8A3FFC`, `#08BDBA`, `#BAE6FF`, `#4589FF`, `#FF7EB6`            |

Score sequence는 Light에서 큰 값이 가장 어둡고 Dark에서 큰 값이 가장 밝다는 Carbon
규칙을 따릅니다. FAST/SLOW는 온도용 red–cyan이 아니라 performance와 rate of change용
purple–teal option을 사용합니다.

### `LD-02 · GitLab Pajamas`

상태: `Not selected`.

고정 implementation 근거: `@gitlab/ui@136.1.0`; 생성된 Light/Dark token file은 dark
appearance에서 published data step 방향을 반전합니다.

| Role                             | Light                                                            | Dark                                                             |
| -------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series                    | Data Blue 500 `#617AE2`                                          | Data Blue 500 `#617AE2`                                          |
| Score bucket 여섯 개, low → high | `#617AE2`, `#4E65CD`, `#3F51AE`, `#374291`, `#303470`, `#2A2B59` | `#617AE2`, `#7992F5`, `#97ACFF`, `#B7C6FF`, `#D2DCFF`, `#E9EBFF` |
| FAST / SLOW                      | Data Blue 500 `#617AE2` / Data Aqua 500 `#0090B1`                | 같은 published base step                                         |
| Categorical series 다섯 개       | `#617AE2`, `#C95D2E`, `#0090B1`, `#619025`, `#CF4D81`            | 같은 published base step                                         |

FAST/SLOW 어느 방향도 good, bad, success, failure가 아니므로 출처의 cool-to-cool
방향을 사용합니다.

### `LD-03 · SAP Fiori Horizon`

상태: `Approved — 2026-08-10`.

고정 implementation 근거: `@sap-theming/theming-base-content@11.36.3`의 정확한
`sap_horizon`, `sap_horizon_dark` chart token.

| Role                             | Light                                                            | Dark                                                             |
| -------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Single series                    | `sapChart_OrderedColor_1` `#168EFF`                              | `#3278BE`                                                        |
| Score bucket 여섯 개, low → high | `#62B3FF`, `#3FA2FF`, `#168EFF`, `#0074E2`, `#0065C3`, `#0055A5` | `#1D456D`, `#275E96`, `#3278BE`, `#5291D1`, `#7AABDC`, `#A2C4E7` |
| FAST / SLOW                      | Ordered 1 `#168EFF` / Ordered 2 `#C87B00`                        | `#3278BE` / `#F2A634`                                            |
| 일반 categorical series 다섯 개  | `#168EFF`, `#C87B00`, `#75980B`, `#DF1278`, `#8B47D7`            | `#3278BE`, `#F2A634`, `#B4CE35`, `#FA4F96`, `#8B47D7`            |

SAP는 승인된 exact-theme 출처입니다. FAST/SLOW가 목적이 명시된 neutral-performance
diverging pair가 아니라 첫 두 qualitative color로 표현된다는 알려진 한계는 아래의 승인된
role contract로 보완합니다.

## 공통 role contract

승인된 SAP mapping에는 다음 contract를 적용합니다.

1. `data.single`, `data.sequential.*`, 일반 `data.categorical.*`,
   `data.direction.fast/slow`는 local chart/comparison alias로만 남습니다. 더 좁은
   `judgement.*` alias는 문서 `59`의 승인된 Radix mapping을 사용합니다.
2. Score bucket은 warning, danger, success, rank, achievement, difficulty color가 되지
   않습니다. 숫자, label, 고정 순서가 의미를 전달합니다.
3. FAST와 SLOW는 항상 직접 label을 유지합니다. Line이 겹칠 수 있으면 point shape이나
   line style도 서로 다르게 씁니다.
4. 숫자 threshold/reference line은 기본적으로 승인 Spectrum neutral structural owner를
   씁니다. 별도 승인된 product rule이 success, warning, danger를 의미한다고 정한 경우에만
   semantic feedback이 됩니다.
5. Grid, axis, tooltip surface, empty state, missing data는 승인 neutral role을 쓰며
   selection과 focus는 이미 승인된 owner를 유지합니다.
6. 인접한 filled mark에는 필요할 때 surface color의 최소 `1px` separation을 둡니다.
7. Forced-colors, color-disabled, color-vision-deficiency view에서도 label, value, 순서,
   marker shape 또는 line style, selection이 남아야 합니다.
8. 선택한 어떤 값도 채보 viewer/editor를 재착색할 수 없습니다.

## 통제 specimen

[Local data-color 비교 열기](./specimens/c5-local-data-color-source-comparison.html).
세 후보 모두 같은 일반 NosLog content를 Light/Dark로 보여줍니다. Score trend, 여섯 score
bucket, FAST/SLOW, 당시 일반 categorical로 취급한 다섯 판정 category, neutral reference
line이 포함되며 color-off와 narrow-width 점검도 제공합니다. 이 specimen의 SAP 판정
표현은 역사적 근거이며 문서 `59`가 이후 승인된 domain-specific 대체값을 기록합니다.

## 승인 결과

사용자는 완전한 일반 NosLog Light/Dark specimen을 검토한 뒤
`LD-03 · SAP Fiori Horizon`을 선택했습니다.

- Blue sequential score bucket은 차분하면서 순서를 즉시 구분할 수 있습니다.
- Blue/orange FAST/SLOW pair는 실제 NosLog chart density에서 다른 finalist보다 한눈에
  구분하기 쉽습니다.
- 다섯 qualitative value는 일반 categorical 비교에서 계속 사용할 수 있습니다. 이후
  사용자 승인된 문서 `59` mapping이 판정 역할에 한해서만 이 값을 supersede합니다.
- Carbon의 purple-led mapping은 NosLog specimen에서 시각적으로 부적합하다고 명시적으로
  거절됐으며, 별도로 승인된 Radix Indigo identity family와도 지나치게 가까웠습니다.
  GitLab은 comparison evidence로만 남습니다.

SAP FAST/SLOW 값은 목적 이름이 붙은 diverging scale이 아니라 qualitative color 1과 2에서
옵니다. 하지만 FAST와 SLOW는 good/bad semantic continuum이 아닌 label이 붙은 두 독립
count이고, non-color contract가 direct label, circle/square marker, solid/dashed line을
유지하므로 이 mapping을 승인합니다.

이 승인은 문서 `59`에서 승인한 더 좁은 `judgement.*` alias를 제외한 일반
comparison-local data color에서 `LD-03`의 정확한 값을 권위로 만듭니다. 이 design-guide
session에서 app 구현을 승인하지 않으며 잠긴 chart viewer/editor에는 적용되지 않습니다.

## Decision log

| ID       | 항목                                                                                                                 | 상태                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `LDC-01` | Score bucket을 여섯 achievement/status 의미가 아니라 순서가 있는 quantitative data로 다룹니다.                       | `Approved — 2026-08-10`                             |
| `LDC-02` | FAST/SLOW를 label이 붙은 two-direction comparison으로 다루며 danger/info 또는 good/bad로 쓰지 않습니다.              | `Approved — 2026-08-10`                             |
| `LDC-03` | Product 의미가 명시적으로 승격시키지 않는 한 숫자 threshold/reference line을 neutral로 둡니다.                       | `Approved — 2026-08-10`                             |
| `LDC-04` | Carbon, GitLab Pajamas, SAP Horizon을 exact-family visual finalist로 올립니다.                                       | `Completed evidence`                                |
| `LDC-05` | `LD-01 · IBM Carbon Charts`를 권고합니다.                                                                            | `Rejected 및 사용자 검토로 superseded — 2026-08-10` |
| `LDC-06` | 채보 viewer/editor 전체를 이 gate 밖에 둡니다.                                                                       | `Locked upstream`                                   |
| `LDC-07` | `LD-03 · SAP Fiori Horizon`을 정확한 일반 local-data family로 채택합니다.                                            | `Approved — 2026-08-10`                             |
| `LDC-08` | SAP를 single, sequential, FAST/SLOW 및 일반 categorical 역할에 유지하고 문서 `59`가 `judgement.*`만 supersede합니다. | `Approved amendment — 2026-08-10`                   |
