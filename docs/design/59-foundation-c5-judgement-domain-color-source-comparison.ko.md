# NosLog 2.0 — C5 판정 도메인 컬러 exact-source 비교

> Canonical 문서: [59-foundation-c5-judgement-domain-color-source-comparison.md](./59-foundation-c5-judgement-domain-color-source-comparison.md)  
> 상태: `Approved — JD-02 Radix Colors 3.0.0 — 2026-08-10`  
> 날짜: `2026-08-10`

## 목적

사용자가 `Judgement breakdown`의 다섯 색상 mapping만 다시 연 뒤 진행한 정확한
Light/Dark 출처 비교와 승인 결과를 기록합니다. 이는 완료된 블록 `1`의 제한적
보완이며 새 top-level 작업 블록이 아닙니다.

이미 승인된 `LD-03 · SAP Fiori Horizon` mapping은 single series, 여섯 score bucket,
label이 붙은 FAST/SLOW 비교에 그대로 유지됩니다. 채보 viewer와 editor 전체도 계속
잠겨 있습니다.

## 승인된 범위 보정

사용자가 제공한 NOSTALGIA gameplay 근거는 정확한 웹 hex가 아니라 의도한 색상 계열을
정합니다.

| 도메인 역할       | 필수 계열          | 근거 경계                                                                                                             |
| ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `judgement.sjust` | 부드러운 rose/pink | 인게임 diamond JUST는 연한 rose/ivory로 보이며, 웹 marker는 더 강한 surface 대비가 필요합니다.                        |
| `judgement.just`  | yellow             | 인게임 JUST는 노란색입니다.                                                                                           |
| `judgement.good`  | cyan               | 인게임 GOOD은 발광하는 cyan/blue입니다.                                                                               |
| `judgement.near`  | blue               | 사용자가 명시한 방향입니다. 제공된 gameplay frame은 정확한 출처값을 정하지 않으므로 보이는 `Near` label을 유지합니다. |
| `judgement.miss`  | neutral gray       | 인게임 MISS는 무채색이며 universal danger로 바꾸지 않습니다.                                                          |

이미지에서는 hex를 추출하지 않습니다. Glow, capture compression, 게임 배경과 display
처리 때문에 screenshot pixel은 정확한 UI token 출처로 부적합합니다.

## 잠금 및 유지 결정

1. `data.direction.fast/slow`는 정확한 SAP mapping을 유지합니다. Light
   `#168EFF/#C87B00`, Dark `#3278BE/#F2A634`입니다.
2. FAST/SLOW는 direct label, circle/square marker와 solid/dashed line을 유지합니다.
3. SAP는 single-series와 sequential score data의 owner로 남습니다.
4. 판정 label, count, percentage는 neutral text를 유지합니다. Color는 local
   marker/bar에만 나타납니다.
5. 판정색은 feedback, achievement, difficulty, focus, identity, selection 또는 action
   의미가 되지 않습니다.
6. Viewer/editor 전체 보존 예외는 바뀌지 않습니다.

## 넓은 레퍼런스 비교

독립적인 authoritative 또는 maintained source 15개를 확인했습니다. 첫 세 출처는 요청한
색상 역할을 갖춘 완전한 exact Light/Dark 후보를 제공하며, 나머지는 접근성, data role
또는 제외 조건을 정합니다.

| 출처                                                                                                                                                                                      | 전용 가능한 근거                                                                 | NosLog 적합성 / 한계                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Adobe Spectrum S2 color palette](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/)                                                                                | Pink, yellow, cyan, blue, gray 전반의 지각적으로 균형 잡힌 Light/Dark color set. | 완전한 다섯 역할 출처입니다. Primitive-to-domain alias는 NosLog 전용이므로 사용자 승인이 필요합니다. |
| [Radix Colors scales](https://www.radix-ui.com/colors/docs/palette-composition/scales)와 [scale 사용법](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | 정확한 adaptive hue scale이며 step 11은 보이는 foreground content용입니다.       | 완전한 다섯 역할 출처지만 Dark 값이 절제된 NosLog shell보다 훨씬 밝고 컬러풀합니다.                  |
| [GitHub Primer DataVis tokens](https://primer.style/product/primitives/color/#data-visualization)                                                                                         | 목적 이름이 붙은 adaptive `data-*` pink, yellow, teal, blue, gray token.         | Data role 출처가 가장 강하지만 대부분의 값이 NosLog surface에서 `3:1` non-text 하한에 가깝습니다.    |
| [W3C WCAG 2.2 — Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)                                                                                              | Color만으로 의미를 전달할 수 없습니다.                                           | 지속적인 label과 value가 필요합니다.                                                                 |
| [W3C WCAG 2.2 — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                    | 필요한 graphical object는 인접 색과 최소 `3:1` 대비가 필요합니다.                | Marker/bar 대비 측정의 하한입니다.                                                                   |
| [WAI Images of Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)                                                                                                          | Chart에는 text alternative와 접근 가능한 data 관계가 필요합니다.                 | 정확한 value와 table/list fallback을 지지하지만 hue를 정하지 않습니다.                               |
| [IBM Carbon data-visualization palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)                                                                               | Theme-aware categorical palette와 비색상 보강.                                   | 이전 purple-led family는 NosLog에서 거절됐으며 요청한 다섯 hue role을 온전히 맞추지 않습니다.        |
| [GitLab Pajamas data-visualization color](https://design.gitlab.com/data-visualization/color/)                                                                                            | 전용 data color, theme-aware order와 절제된 chart ownership.                     | 온전한 categorical order가 다섯 NOSTALGIA role family와 일치하지 않습니다.                           |
| [SAP Fiori chart palettes](https://experience.sap.com/fiori-design-web/color-palettes/)                                                                                                   | 정확한 qualitative와 sequential theme token.                                     | 기존 LD-03 역할에는 유지되지만 judgement categorical order는 이번에 제한적으로 다시 엽니다.          |
| [Atlassian data-visualization color](https://atlassian.design/foundations/color-new/data-visualization-color/)                                                                            | 분리된 Light/Dark chart token과 categorical order.                               | 요청한 다섯 역할 domain mapping을 하나의 명시적 set으로 제공하지 않습니다.                           |
| [Elastic EUI color palettes](https://eui.elastic.co/docs/consumers/color-palettes/)                                                                                                       | 접근성 보강을 포함한 ordered categorical palette.                                | Order 근거로 유용하지만 완전한 NosLog Light/Dark domain owner가 아닙니다.                            |
| [PatternFly chart colors](https://www.patternfly.org/charts/colors-for-charts/)                                                                                                           | 동시 색상 수를 제한하고 pattern으로 series를 보강합니다.                         | 절제와 비색상 cue를 지지하지만 exact 다섯 역할 출처가 아닙니다.                                      |
| [Vega color schemes](https://vega.github.io/vega/docs/schemes/)                                                                                                                           | Nominal categorical data와 sequential/diverging scale을 구분합니다.              | Judgement가 nominal domain data임을 확인하지만 application theme은 정하지 않습니다.                  |
| [D3 scale-chromatic](https://d3js.org/d3-scale-chromatic)                                                                                                                                 | 관리되는 categorical 및 quantitative scheme.                                     | NosLog application Light/Dark token contract를 제공하지 않습니다.                                    |
| [Microsoft Power BI accessibility](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports)                                                      | Marker, label, high contrast와 data access가 hue를 보완해야 합니다.              | Specimen의 label/value/color-off contract를 직접 지지하지만 palette 출처는 아닙니다.                 |

Tailwind color와 거절된 과도한 accent의 `FCM-11`/`SIG-07` 예시는 사용하지 않았습니다.

## 정확한 후보

모든 값은 공개된 source 값입니다. Screenshot sampling, hue shifting, interpolation 또는
출처 사이 chromatic mixing은 없습니다.

### `JD-01 · Adobe Spectrum S2`

모든 chromatic 역할에 같은 adaptive `900` 위치를 사용하고, neutral MISS marker에는 이미
승인된 Spectrum `gray-700`을 사용합니다.

| 역할   | Light                  | Dark      |
| ------ | ---------------------- | --------- |
| S-Just | `pink-900` `#CE2A92`   | `#EC43AF` |
| Just   | `yellow-900` `#9E6600` | `#BA7C00` |
| Good   | `cyan-900` `#0B78B3`   | `#188EDC` |
| Near   | `blue-900` `#3B63FB`   | `#5681FF` |
| Miss   | `gray-700` `#505050`   | `#AFAFAF` |

NosLog `#FFFFFF/#111111` 대비는 chromatic 역할에서 Light 약 `4.80–4.83:1`, Dark
`5.34–5.38:1`입니다. MISS는 `8.06:1/8.61:1`입니다.

### `JD-02 · Radix Colors 3.0.0`

보이는 foreground content를 위한 공개 step `11`을 사용합니다.

| 역할   | Light               | Dark      |
| ------ | ------------------- | --------- |
| S-Just | `pink11` `#C2298A`  | `#FF8DCC` |
| Just   | `amber11` `#AB6400` | `#FFCA16` |
| Good   | `cyan11` `#107D98`  | `#4CCCE6` |
| Near   | `blue11` `#0D74CE`  | `#70B8FF` |
| Miss   | `gray11` `#646464`  | `#B4B4B4` |

Light 대비는 `4.61–5.92:1`입니다. Dark 대비는 `8.93–12.33:1`로 가장 밝은 Dark
후보입니다. 사용자는 통제된 NosLog content specimen을 검토한 뒤 더 명확하고 게임
계열에 가까운 이 표현을 선호했습니다.

### `JD-03 · GitHub Primer DataVis`

Theme-adaptive 목적 이름이 붙은 DataVis emphasis token을 사용합니다.

| 역할   | Light                                  | Dark      |
| ------ | -------------------------------------- | --------- |
| S-Just | `data-pink-color-emphasis` `#CE2C85`   | `#D34591` |
| Just   | `data-yellow-color-emphasis` `#B88700` | `#895906` |
| Good   | `data-teal-color-emphasis` `#179B9B`   | `#106C70` |
| Near   | `data-blue-color-emphasis` `#006EDB`   | `#0576FF` |
| Miss   | `data-gray-color-emphasis` `#808FA3`   | `#576270` |

NosLog surface에서 측정한 최소 대비는 Light `3.23:1`, Dark `3.04:1`입니다. 측정한
non-text 하한은 통과하지만 얇거나 antialias된 mark에 대한 여유가 가장 적습니다.

## 통제 표본

[판정 도메인 컬러 비교 열기](./specimens/c5-judgement-domain-color-source-comparison.html).
모든 후보에 같은 판정 label, value, order, Light/Dark Spectrum neutral surface, 좁은
layout과 color-off 검사를 사용합니다. 이전 SAP categorical mapping도 역사적 control로
남아 있으며, 승인된 JD-02 mapping이 `judgement.*`에 한해서만 SAP를 대체합니다.

## 승인 결과

사용자는 통제된 Light/Dark NosLog content specimen을 검토한 뒤
`JD-02 · Radix Colors 3.0.0`을 선택했습니다.

권위 있는 judgement mapping은 다음과 같습니다.

| 역할              | Light               | Dark      |
| ----------------- | ------------------- | --------- |
| `judgement.sjust` | `pink11` `#C2298A`  | `#FF8DCC` |
| `judgement.just`  | `amber11` `#AB6400` | `#FFCA16` |
| `judgement.good`  | `cyan11` `#107D98`  | `#4CCCE6` |
| `judgement.near`  | `blue11` `#0D74CE`  | `#70B8FF` |
| `judgement.miss`  | `gray11` `#646464`  | `#B4B4B4` |

다섯 값 모두 같은 공개 Radix step-11 mapping에서 옵니다. `gray11`은 판정 domain
marker일 뿐이며 Adobe Spectrum S2의 NosLog 독점 neutral primitive 권위를 대체하지
않습니다. Label, count, percentage, surface와 container는 계속 승인된 Spectrum neutral
role을 사용합니다.

`JD-01` Spectrum과 `JD-03` Primer는 비교 근거로만 남으며 downstream target이
아닙니다. 이전 SAP 다섯 series categorical order는 `judgement.*`에서만 supersede됩니다.
SAP는 single-series data, 여섯 score bucket, FAST/SLOW와 다른 승인된 일반
comparison-local role에 계속 권위가 있습니다. 이 결정의 어떤 값도 잠긴 채보
viewer/editor에 적용되지 않습니다.

## 결정 로그

| ID       | 항목                                                                              | 상태                                     |
| -------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| `JDC-01` | Single series, sequential bucket과 FAST/SLOW에는 LD-03 SAP를 유지합니다.          | `Approved scope correction — 2026-08-10` |
| `JDC-02` | 다섯 `judgement.*` 색상만 NOSTALGIA-derived hue role로 다시 엽니다.               | `Approved scope correction — 2026-08-10` |
| `JDC-03` | Screenshot pixel을 정확한 web color 값으로 사용합니다.                            | `Rejected — unreliable source`           |
| `JDC-04` | Spectrum S2, Radix Colors, Primer DataVis를 intact exact-value 후보로 비교합니다. | `Completed evidence`                     |
| `JDC-05` | 다섯 judgement 역할에 `JD-02 · Radix Colors 3.0.0` step 11을 채택합니다.          | `Approved — 2026-08-10`                  |
