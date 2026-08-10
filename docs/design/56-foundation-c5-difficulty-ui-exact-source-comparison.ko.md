# NosLog 2.0 C5 Difficulty UI 정확한 출처 비교

## 문서 관리

- 상태: `Proposed — 정확한 4색 후보 11개 사용자 검토 대기`
- 정본 언어: 영어
- 영어 정본:
  [56-foundation-c5-difficulty-ui-exact-source-comparison.md](./56-foundation-c5-difficulty-ui-exact-source-comparison.md)
- 날짜: 2026-08-10
- 상위 정정:
  [문서 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.ko.md)
- 잔여 범위 권위:
  [문서 57](./57-noslog-2.0-authoritative-remaining-work-audit.ko.md)
- 시각 근거:
  [c5-difficulty-ui-source-comparison.html](./specimens/c5-difficulty-ui-source-comparison.html)
- 범위: 채보 viewer/editor 전체 경험 밖의 반복 탐색용 일반 DOM UI에서 지속적으로
  표시하는 Normal, Hard, Expert, Real marker
- 제외: 모든 viewer/editor page, shell, control, responsive·accessibility 동작,
  renderer 출력, geometry, 계산, animation 및 editor 동작

## 고정 요구사항과 바로잡은 질문

대상 일반 UI는 서로 시각적으로 다른 네 난이도 색을 지속적으로 사용해야 합니다. 이
요구사항은 승인됐습니다. Neutral-only `DU-D0`는 Rejected이며 이 비교의 후보가 아닙니다.
열린 질문은 정확히 공개된 어떤 Light/Dark 값과 네 role alias를 승인할지뿐입니다.

이전 초안은 동등한 정확한 값 비교를 마치기 전에 Spectrum만 실질 후보로 제시해 너무
좁았습니다. 이번 개정은 Spectrum을 유지하고 독립적으로 공개된 후보 10개를 더해 동일한
NosLog 콘텐츠에서 비교합니다. Tailwind 값, screenshot에서 추출한 값, 보간한 step 또는
서로 다른 system의 혼합값은 사용하지 않습니다.

## 잠긴 viewer/editor 경계

기존 renderer 값은 Foundation token 후보가 아니라 구현 상수로 유지합니다.

- Falling PixiJS renderer: left `0x4fc8dc`, right `0xe85f5d`;
- Full-sheet Canvas renderer와 연결된 DOM legend: left `#62d4e8`, right `#f06b68`.

아래 어떤 후보도 chart viewer/editor surface나 동작을 수정·재착색·restyle·reinterpret할
수 없습니다.

## Reference matrix

|   # | 독립된 공식 출처                                                                                                            | 사용한 근거                                      | 적용 가능성과 한계                                                                        |
| --: | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum S2 color palette](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/)                  | Theme-adaptive named visual colors               | 정확한 값의 직접 후보이며 role alias는 NosLog 전용입니다.                                 |
|   2 | [Radix Colors scale composition](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)          | 네 named hue의 공개 solid step `9`               | 정확한 solid color지만 공통 Light/Dark set은 양쪽 배경 대비를 보장하지 않습니다.          |
|   3 | [GitHub Primer primitives](https://primer.style/product/primitives/)                                                        | Theme별 data-color emphasis primitive            | 유지되는 adaptive source이며 선택한 hue role은 NosLog alias입니다.                        |
|   4 | [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)              | Categorical color 1–4                            | 유지되는 adaptive sequence지만 upstream 의미는 difficulty가 아니라 series order입니다.    |
|   5 | [IBM Carbon data-visualization palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)                 | 공식 four-series palette set 1                   | 유지되는 adaptive sequence지만 hue order의 difficulty 직관성이 약합니다.                  |
|   6 | [SAP Fiori data visualization](https://experience.sap.com/fiori-design-web/explore_group/data-visualization/)               | Horizon qualitative color 1–4                    | 유지되는 adaptive sequence지만 difficulty 의미로 학습해야 합니다.                         |
|   7 | [Elastic EUI color palettes](https://eui.elastic.co/v107.0.1/docs/utilities/color-palettes/)                                | `colorBlind` graphic color 첫 4개                | Series 지침은 강하지만 정확한 Light 값이 여기서는 흰색 위에 너무 옅습니다.                |
|   8 | [PatternFly chart colors](https://v5-archive.patternfly.org/charts/colors-for-charts/)                                      | Multi-color chart 값 첫 4개                      | 정확한 공식 값이지만 출처 page는 공식 archive version입니다.                              |
|   9 | [GitLab Pajamas data-visualization color](https://design.gitlab.com/data-visualization/color/)                              | Hue `500` 값                                     | 측정 대비는 통과하지만 설치한 source가 token을 deprecated로 표시합니다.                   |
|  10 | [Tableau custom and Classic colors](https://help.tableau.com/current/pro/desktop/en-gb/formatting_create_custom_colors.htm) | 정확한 Classic 10 green, orange, red, purple     | 안정적인 production reference지만 adaptive 4-role contract가 아닌 named-hue subset입니다. |
|  11 | [ColorBrewer schemes](https://colorbrewer2.org/learnmore/schemes_full.html)                                                 | 정확한 Set1 green, orange, red, purple           | 검증된 categorical reference지만 theme-adaptive도 difficulty contract도 아닙니다.         |
|  12 | [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)                                       | 색이 유일한 구분 단서가 될 수 없음               | 이름, 숫자 level, order, pattern 및 selected state의 중복 단서를 요구합니다.              |
|  13 | [문서 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.ko.md)에 기록한 공식 NOSTALGIA 근거                | Normal/Hard/Expert/Real domain label과 hierarchy | Domain 적용 가능성을 정하며 대체 palette 값을 제공하지는 않습니다.                        |

따라서 package version, 중복 documentation page 또는 Tailwind를 추가 reference로 세지
않고도 12개 최소 기준을 넘습니다.

## 정확한 후보 값

값은 Normal / Hard / Expert / Real 순서입니다. Light와 Dark가 같은 행에 있으며 `Same as
Light`는 두 theme에 동일한 출처 값을 사용한다는 뜻입니다.

| ID      | 공개된 source recipe                               | Light 값                                      | Dark 값                                       | Provenance 상태                     |
| ------- | -------------------------------------------------- | --------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| `DU-01` | Spectrum S2 green/orange/red/purple `visual-color` | `#0BA45D` / `#E86A00` / `#F03823` / `#A65CE7` | `#068850` / `#E06400` / `#CD2E1D` / `#AD69E9` | Maintained, adaptive                |
| `DU-02` | Radix green/orange/red/purple step `9`             | `#30A46C` / `#F76B15` / `#E5484D` / `#8E4EC6` | Light와 같음                                  | Maintained, fixed set               |
| `DU-03` | Primer data green/orange/auburn/purple emphasis    | `#30A147` / `#EB670F` / `#9D615C` / `#894CEB` | `#2F6F37` / `#984B10` / `#EB3342` / `#975BF1` | Maintained, adaptive                |
| `DU-04` | Atlassian categorical 1–4                          | `#357DE8` / `#82B536` / `#BF63F3` / `#F68909` | `#4688EC` / `#94C748` / `#C97CF4` / `#FCA700` | Maintained, adaptive                |
| `DU-05` | Carbon four-series set 1                           | `#6929C4` / `#012749` / `#009D9A` / `#EE5396` | `#8A3FFC` / `#08BDBA` / `#BAE6FF` / `#4589FF` | Maintained, adaptive                |
| `DU-06` | SAP Horizon qualitative 1–4                        | `#168EFF` / `#C87B00` / `#75980B` / `#DF1278` | `#3278BE` / `#F2A634` / `#B4CE35` / `#FA4F96` | Maintained, adaptive                |
| `DU-07` | Elastic `colorBlind` 첫 4개                        | `#16C5C0` / `#A6EDEA` / `#61A2FF` / `#BFDBFF` | Light와 같음                                  | Maintained, fixed set               |
| `DU-08` | PatternFly multi-color 첫 4개                      | `#0066CC` / `#63993D` / `#37A3A3` / `#DCA614` | Light와 같음                                  | Official archived source, fixed set |
| `DU-09` | GitLab hue `500` green/orange/magenta/blue         | `#619025` / `#C95D2E` / `#CF4D81` / `#617AE2` | Light와 같음                                  | Source token deprecated             |
| `DU-10` | Tableau Classic 10 green/orange/red/purple         | `#2CA02C` / `#FF7F0E` / `#D62728` / `#9467BD` | Light와 같음                                  | Maintained palette, fixed set       |
| `DU-11` | ColorBrewer Set1 green/orange/red/purple           | `#4DAF4A` / `#FF7F00` / `#E41A1C` / `#984EA3` | Light와 같음                                  | Stable palette, fixed set           |

적용 가능한 경우 `@adobe/spectrum-tokens@14.15.0`,
`@atlaskit/tokens@16.5.0`, `@carbon/colors@11.55.0`,
`@carbon/charts@1.27.18`, `@elastic/eui@118.0.0`,
`@gitlab/ui@136.1.0`, `@patternfly/react-tokens@6.6.1`,
`@sap-theming/theming-base-content@11.36.5`,
`@primer/primitives@11.10.0`, `@radix-ui/colors@3.0.0` package 근거와 대조했습니다.

## 측정한 non-text marker 대비

각 cell은 승인된 specimen surface Light `#FFFFFF` 또는 Dark `#222222`에 대한 Normal /
Hard / Expert / Real 순서입니다. `FAIL`은 `3:1` non-text target 미만입니다.

| ID      | Light 비율                            | Dark 비율                             | 1차 결과                     |
| ------- | ------------------------------------- | ------------------------------------- | ---------------------------- |
| `DU-01` | `3.24 / 3.23 / 3.97 / 3.96`           | `3.52 / 4.54 / 3.03 / 4.53`           | 모두 통과                    |
| `DU-02` | `3.16 / 2.97 FAIL / 3.91 / 5.18`      | `5.04 / 5.36 / 4.07 / 3.07`           | Light Hard 실패              |
| `DU-03` | `3.33 / 3.24 / 4.89 / 4.89`           | `2.61 FAIL / 2.54 FAIL / 3.85 / 3.85` | Dark Normal·Hard 실패        |
| `DU-04` | `4.00 / 2.44 FAIL / 3.34 / 2.47 FAIL` | `4.54 / 7.97 / 5.81 / 8.08`           | Light Hard·Real 실패         |
| `DU-05` | `7.74 / 15.13 / 3.34 / 3.33`          | `3.18 / 6.82 / 12.01 / 4.75`          | 모두 통과                    |
| `DU-06` | `3.31 / 3.34 / 3.36 / 4.67`           | `3.46 / 7.79 / 8.96 / 5.02`           | 모두 통과                    |
| `DU-07` | `2.15 / 1.32 / 2.59 / 1.42 FAIL`      | `7.41 / 12.06 / 6.15 / 11.21`         | Light 네 값 모두 실패        |
| `DU-08` | `5.57 / 3.41 / 3.03 / 2.21 FAIL`      | `2.86 FAIL / 4.66 / 5.25 / 7.20`      | Light Real·Dark Normal 실패  |
| `DU-09` | `3.80 / 4.13 / 4.17 / 3.90`           | `4.19 / 3.86 / 3.81 / 4.08`           | 값은 통과, source deprecated |
| `DU-10` | `3.40 / 2.53 FAIL / 5.02 / 4.26`      | `4.68 / 6.28 / 3.17 / 3.74`           | Light Hard 실패              |
| `DU-11` | `2.78 FAIL / 2.53 FAIL / 4.71 / 5.31` | `5.72 / 6.28 / 3.38 / 3.00`           | Light Normal·Hard 실패       |

통과시키기 위해 후보 값을 조정하지 않았습니다. 정확한 값의 실패는 현재 marker와 surface
계약에서 해당 recipe를 제외한다는 뜻이며 인접한 임의 색을 만들라는 허용이 아닙니다.

## 1차 shortlist와 tradeoff

유지되는 source의 원본 값으로 두 theme marker target을 모두 통과하는 것은 `DU-01`,
`DU-05`, `DU-06`뿐입니다. `DU-09`도 수치로는 통과하지만 source token이 deprecated라
shortlist에서 제외합니다.

- `DU-01 · Spectrum S2`는 익숙한 green → orange → red → purple progression을
  유지하고 adaptive 값을 공개하며 양쪽 surface를 통과합니다. 한계는 이 role 배치가
  upstream difficulty semantic이 아니라 NosLog 전용이라는 점입니다.
- `DU-05 · Carbon`은 측정 여유가 가장 크지만 purple → navy → teal → magenta입니다.
  학습하지 않으면 색이 난이도 상승을 바로 전달하지 못합니다.
- `DU-06 · SAP Fiori`도 통과하지만 blue → orange → green → pink라 Expert가 Hard보다
  더 심하다는 인상이 즉시 전달되지 않습니다.

따라서 근거에 따른 권고는 `DU-01`이지만 상태는 Proposed입니다. 사용자가 실제 rendering을
비교하고 정확한 mapping을 명시적으로 승인해야 합니다.

## 강한 component 경계

어떤 후보를 승인하더라도 chroma는 대상 반복 탐색용 일반 DOM UI의 작은 difficulty
marker에만 나타날 수 있습니다. 다음에는 색을 넣지 않습니다.

- difficulty text, card background, section, navigation, link, button, selection,
  focus, validation 또는 feedback;
- 모든 chart viewer/editor page, shell, control, Canvas/WebGL 출력, note, path, hand
  guide, legend, piano, timing guide, geometry 또는 renderer-owned pixel;
- score band 또는 FAST/SLOW data. 이는 다음 local-data-color 하위 작업입니다.

이름, 숫자 level, fixed order, pattern fallback과 명시적 selected label을 유지하므로 색은
유일한 단서가 아닙니다.

## Browser 검증 — 2026-08-10

개정한 artifact를 `1440px`, `390px`, `320px`에서 검증했습니다. 세 width 모두 가로
overflow가 0이었습니다. 후보 11개와 Light/Dark appearance 22개를 렌더링했고 Dark-only
control은 정확히 Dark appearance 11개만 노출했습니다. Color-off 상태에서도 서로 다른
marker pattern 4개와 이름, level, fixed order, selected label이 남았습니다. DOM의
`canvas`, SVG, WebGL 및 viewer/editor element는 0개였고 완료한 run에 console warning이나
error가 없었습니다. 이 검증은 비교 artifact만의 근거이며 production viewer/editor code를
test하거나 수정하지 않았습니다.

## Decision log

| ID       | Entry                                                                                   | 상태                                      |
| -------- | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| `DUS-01` | 기존 viewer/editor 경험 전체를 보존합니다.                                              | `Approved correction — 2026-08-10`        |
| `DUS-02` | 잘못된 renderer hand-color 비교를 제거합니다.                                           | `Completed`                               |
| `DUS-03` | 이 결정을 반복 탐색용 일반 difficulty DOM UI에 한정합니다.                              | `Approved scope correction`               |
| `DUS-04` | 지속적인 난이도별 네 색을 요구하고 neutral-only `DU-D0`를 거절합니다.                   | `Approved and reconfirmed`                |
| `DUS-05` | Spectrum만 제시하지 않고 독립 출처의 정확한 후보 11개를 비교합니다.                     | `Completed research — visual review 대기` |
| `DUS-06` | 원본 값이 두 승인 surface를 통과하는 maintained 후보만 shortlist에 남깁니다.            | `Proposed evaluation rule`                |
| `DUS-07` | 통과한 Carbon·SAP보다 difficulty 인지를 잘 보존하는 `DU-01 · Spectrum S2`를 선호합니다. | `Proposed recommendation — 미승인`        |

## 승인 경계와 남은 작업 수

정확한 4색 mapping은 아직 승인되지 않았습니다. 이 비교는 블록 `1`의 일부이며 새 작업
11개가 아닙니다. 후보 11개는 하나의 material decision 안의 비교 근거입니다. 승인 뒤에는
새 작업을 만들지 않고 같은 블록에서 score band, FAST/SLOW, series, threshold의 local
data color를 이어서 다룹니다. 권위 있는 전체 잔여량은 문서 `57`의 top-level 6블록
그대로이며 완료 퍼센트는 표시하지 않습니다.
