# NosLog 2.0 C5 중립 인터랙션 레퍼런스 비교

## 문서 관리

- 상태: `조사 완료; NI-A 사용자 검토 제안; C5M-06 미종료`
- 정본 언어: 영어
- 영어 정본:
  [40-foundation-c5-neutral-interaction-reference-comparison.md](./40-foundation-c5-neutral-interaction-reference-comparison.md)
- 시작일: 2026-08-09
- 범위: `C5M-06`를 결정하기 전에 일반 중립 container의 `rest`, `hover`,
  `pressed`, `selected`, `disabled` state 구조를 비교한다.
- 입력: 승인된 `M-A`, `F-A`, `NB-A`; 문서 `34`의 잠정 interaction 문구;
  현재 공식 디자인 시스템 지침과 배포 토큰 데이터; 현재 Adobe Spectrum S2
  alias 및 component 토큰 데이터; WCAG 2.2
- 제외: focus indicator 색과 geometry, signature/유채색 selection, feedback state,
  component shape와 motion, 최종 component alias, production 구현, 고충실도 페이지
  디자인

이 문서는 범용 interaction 색을 승인하지 않는다. Spectrum S2에 그런 범용 색이
실제로 존재하는지, NosLog에 적합한지를 검증한다.

## 관련 문서

- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.ko.md)
- [C5 neutral foreground comparison](./36-foundation-c5-neutral-foreground-reference-comparison.ko.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.ko.md)
- [C5 neutral boundary comparison](./38-foundation-c5-neutral-boundary-reference-comparison.ko.md)
- [C5 neutral boundary specimen validation](./39-foundation-c5-neutral-boundary-specimen-validation.ko.md)

## 권위와 비교 규칙

1. Adobe Spectrum S2는 정확한 Light/Dark 중립 primitive의 승인된 독점 출처로
   유지된다. 외부 시스템은 state 구조를 검증할 수 있지만 그 값을 Spectrum
   scale에 섞을 수 없다.
2. Tailwind CSS는 구현 도구일 뿐이다. palette, starter interaction color,
   opacity recipe, template은 이 결정의 근거가 아니다.
3. 동등한 책임을 비교한다. transparent 또는 inherited rest, 보조 hover, 일시적
   pressed/down, 지속되는 selection, 실제로 사용할 수 없는 control이다.
4. 이름이 같은 state도 시스템 간에 같은 제품 책임이라고 가정하지 않는다. row,
   menu item, table row, button, selection control은 서로 다른 component recipe를
   사용할 수 있다.
5. 승인된 `F-A` interaction content 강화와 `NB-A` boundary는 고정한다. 이
   gate에서는 다시 열지 않는다.
6. focus는 별도 gate다. 어떤 출처의 hover와 비슷한 keyboard-focus fill도 그
   focus ring, hue, geometry를 NosLog에 승인하지 않는다.
7. signature 및 feedback color는 이후 결정이다. 이 gate에서 일반 selection은
   중립을 유지하며, 출처의 brand-colored selection을 가져오지 않는다.
8. Rejected인 과도한 accent의 `FCM-11`, `SIG-07` 예시는 제외하며 근거나 목표로
   재사용할 수 없다.

## 정규화한 state 책임

| 책임         | 의미                                   | 필수 계약                                                                                                   |
| ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Rest         | interaction 전 사용 가능한 일반 action | transparent이거나 승인된 `M-A` surface를 상속할 수 있다. 필요한 경우 control은 여전히 식별 가능해야 한다.   |
| Hover        | pointer 위치에 대한 보조 feedback      | 유일한 affordance가 될 수 없다. 그 자체로 `3:1`일 필요는 없지만 필수 component/state 대비를 지우면 안 된다. |
| Pressed/down | 짧게 유지되는 activation feedback      | 지속되는 selected state로 오해되지 않으면서 motion 또는 appearance로 구분되어야 한다.                       |
| Selected     | 지속되는 선택/현재 state               | 올바른 programmatic state와 지속되는 시각 cue가 필요하다. 저대비 fill만으로는 부족하다.                     |
| Disabled     | 실제로 사용할 수 없는 action           | hover/press에 반응하거나 필수 안내를 포함하면 안 되며, 단순히 강조도를 낮추기 위해 흉내 내면 안 된다.       |

## 공식 레퍼런스 매트릭스

서로 독립적인 공식 출처 16개를 검토했다. 15개는 유지 관리되는 디자인 시스템
또는 production 권위이며, WCAG 2.2는 평가 권위다. 현재 권위가 정적으로 공개하는
경우 정확한 값을 포함했다. 구조만 공개한 출처는 값 제공자로 취급하지 않는다.

|   # | 공식 시스템/출처                                                                                                                                                                                                                                                       | 공개된 동등 state 모델과 값                                                                                                                                                                                 | NosLog에 이전 가능한 원칙                                                                                                        | 적용 한계                                                                                            |
| --: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum S2 aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/) 및 [component colors](https://opensource.adobe.com/spectrum-design-data/tokens/color-component/)                                                                  | Global 데이터는 default opacity `0`, hover/down `0.1`, disabled `#e9e9e9/#2c2c2c`, `#dadada/#393939`, `#c6c6c6/#444444`를 공개한다. Component 데이터는 Stack, Menu, Table, Tree에 서로 다른 recipe를 둔다.  | 승인된 출처 자체가 state fill을 하나의 범용 gray가 아니라 component 맥락에 따라 다룬다.                                          | 정확한 component 조합을 보존해야 한다. opacity나 component 규칙이 빠진 색 입력값만으로는 불완전하다. |
|   2 | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                                                                                                       | Transparent-background hover/active/selected/selected-hover는 Gray 50의 `12%/50%/20%/32%`를 사용하고, Light layer state는 `#e8e8e8`, `#c6c6c6`, `#e0e0e0`, `#d1d1d1`이다.                                   | hover, active, selected, selected-hover는 별도 semantic 책임이고, layer component는 자체 state family를 가질 수 있다.            | Carbon opacity와 layer recipe는 Carbon theme 소속이며 Spectrum에 섞을 수 없다.                       |
|   3 | [Microsoft Fluent 2 color tokens](https://fluent2.microsoft.design/color-tokens2/) 및 [style reference](https://microsoft.github.io/fluentui-design-tokens/)                                                                                                           | `SubtleBackground`는 transparent이며 hover `#f5f5f5/#383838`, pressed `#e0e0e0/#2e2e2e`, selected `#ebebeb/#333333`이다. disabled neutral background는 `#f0f0f0/#141414`다.                                 | 저명한 시스템은 범용 subtle family를 공개할 수 있지만, 의도적으로 비대칭인 Light/Dark 값을 포함한 완전한 alias set으로 제공한다. | Fluent 값과 state 간격을 Spectrum primitive와 섞을 수 없다.                                          |
|   4 | [Material 3 interaction states](https://m3.material.io/foundations/interaction/states/overview) 및 [Material Web ripple tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-ripple.scss)                                             | State는 layer indicator를 사용하며, Web 구현은 component ripple token을 통해 hover/pressed 색과 opacity를 함께 해석한다. Material은 중요한 state에 둘 이상의 indicator를 요구한다.                          | State layer는 보조 component feedback이며, 모든 resting control을 다시 칠하라는 허가가 아니다.                                   | Dynamic Material scheme과 ripple 동작은 정확한 NosLog 값이나 motion 규칙이 아니다.                   |
|   5 | [GitHub Primer color primitives](https://primer.style/product/primitives/color/) 및 [theme reference](https://primer.style/product/getting-started/react/theme-reference/)                                                                                             | Light transparent-control hover는 `#818b981a`다. 현재 ActionList theme는 hover, active, selected alias를 분리한다. Dark reference 예시는 `rgba(177,186,196,.12/.20/.08)`을 사용한다.                        | 대규모 production UI는 transparent action과 filled control을 분리하며 theme 전반에 component alias를 유지한다.                   | Primer의 blue-gray alpha 값과 여러 accessibility theme는 역할 근거일 뿐이다.                         |
|   6 | [Atlassian color guidance](https://atlassian.design/foundations/color-new/)                                                                                                                                                                                            | Subtle neutral background에는 default, hovered, pressed token이 따로 있다. icon hover/press는 icon token 대신 background 변화로 표현한다. selected, focused, disabled도 분리한다.                           | State는 가장 가까운 raw swatch가 아니라 semantic property와 interaction 책임에 속한다.                                           | 공개 개요는 완전한 정적 Light/Dark 값 표를 제공하지 않으므로 여기서는 구조 참고용이다.               |
|   7 | [Radix Colors scale usage](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)                                                                                                                                                           | 3, 4, 5단계는 component의 normal, hover, pressed/selected background다. rest가 transparent면 3단계를 hover로 사용할 수 있다.                                                                                | Transparent-rest component는 이미 채워진 component와 다른 mapping이 필요하다.                                                    | Radix는 생성된 scale을 쓰고 pressed와 selected를 의도적으로 묶는다. 그 값은 Spectrum alias가 아니다. |
|   8 | [GitLab Pajamas color](https://design.gitlab.com/product-foundations/color/) 및 [design tokens](https://design.gitlab.com/product-foundations/design-tokens/)                                                                                                          | Neutral action rest는 두 mode에서 transparent다. hover는 Light에서 dark alpha `6%`, Dark에서 light alpha `16%`, active는 `16%/8%`다. selected action과 disabled background/border/content는 별도 token이다. | State alias는 mode, component 책임, 지속되는 selection을 각각 encode해야 한다.                                                   | GitLab selection은 강한 inverse가 될 수 있어 절제된 Spectrum mapping에 이식할 수 없다.               |
|   9 | [PatternFly colors](https://www.patternfly.org/foundations-and-styles/colors/) 및 [Table](https://www.patternfly.org/components/table/)                                                                                                                                | PatternFly는 semantic interaction token을 분리한다. Light clickable-row hover는 현재 `#f2f2f2`이며 selected table row에는 전용 component token이 있다.                                                      | 밀도 높은 data row는 범용 button recipe를 상속하지 않고 component 수준 state ownership이 필요하다.                               | Red Hat 값과 유채색 selection 관례는 사용할 수 없는 primitive다.                                     |
|  10 | [Base Web colors](https://baseweb.design/guides/colors/) 및 [theming](https://baseweb.design/guides/theming/)                                                                                                                                                          | Primitive, semantic, component layer가 분리되어 있다. Light/Dark theme는 component color와 selected/disabled 역할을 따로 제공하며 `backgroundStateDisabled`는 `#f3f3f3/#292929`다.                          | 재사용 가능한 Foundation이 component state color를 하나의 global alias로 평탄화할 필요는 없다.                                   | Base Web의 alpha/opaque 모델과 selected 대비는 자체 component set 소속이다.                          |
|  11 | [Shopify Polaris state guidance](https://polaris-react.shopify.com/design/colors/color-tokens) 및 [current token table](https://polaris-react.shopify.com/tokens/color)                                                                                                | Light transparent fill은 rest `2%`, hover `5%`, active/selected `8%`로 진행한다. surface와 작은 fill family는 별도 state ladder 및 disabled 역할을 사용한다.                                                | 한 제품 안에서도 surface, fill, transparent component는 서로 다른 state family가 필요하다.                                       | 현재 공개 표는 Light 전용이므로 NosLog에 필요한 정확한 dual-mode mapping을 제공할 수 없다.           |
|  12 | [SAP Fiori design tokens](https://experience.sap.com/fiori-design-web/design-tokens/) 및 [state guidance](https://experience.sap.com/fiori-design-web/explore_category/ui_component/page/2/)                                                                           | SAP은 `sapButton_Emphasized_Hover_Background`처럼 component-state token을 명시적으로 이름 짓고, component별 hover, pressed, selected, checked를 구분한다.                                                   | Token ownership에 component와 state가 모두 있어야 하며 selection은 오래 지속되는 hover가 아니다.                                 | SAP의 cool-gray theme와 제품별 selected 처리는 구조 참고용일 뿐이다.                                 |
|  13 | [Ant Design theme tokens](https://ant.design/docs/react/customize-theme/)                                                                                                                                                                                              | Light alias는 text-like hover `rgba(0,0,0,.06)`, active `.15`, disabled container `.04`를 공개한다. Dark 값은 자체 theme algorithm으로 생성한다.                                                            | hover, active, disabled는 별도지만 정적 Light recipe만으로는 완전한 dual-theme 출처가 아니다.                                    | Algorithmic Dark 출력과 Ant palette를 Spectrum에 넣을 수 없다.                                       |
|  14 | [Elastic EUI component tokens](https://eui.elastic.co/docs/getting-started/theming/tokens/component/) 및 [theme provider](https://eui.elastic.co/next/docs/getting-started/theming/theme-provider)                                                                     | EUI는 component별 default, hover, disabled background를 공개하고 color-mode provider를 통해 변경한다. button primary hover 예시는 alpha component token이다.                                                | State 값은 global neutral fill이 아니라 component token에 속하는 것이 적절할 수 있다.                                            | 정적 문서는 많은 값에서 활성 mode만 공개하므로 EUI는 구조 참고용이다.                                |
|  15 | [Salesforce SLDS color migration](https://developer.salesforce.com/blogs/2023/06/preparing-your-app-for-the-lightning-design-system-color-update) 및 [styling hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties) | Salesforce는 custom UI가 정확한 component blueprint와 semantic styling hook을 사용해 upstream state 및 contrast 갱신을 local 근삿값 없이 받도록 지시한다.                                                   | 시각적으로 비슷한 global neutral을 고르는 것보다 유지 관리되는 component ownership이 안전하다.                                   | 공개 지침은 완전한 neutral Light/Dark interaction 표 하나를 제공하지 않으므로 구조 참고용이다.       |
|  16 | [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) 및 [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                      | 색은 정보를 전달하는 유일한 시각 수단이 될 수 없다. 필수 selected-state cue는 인접색에 `3:1`이 필요하다. 보조 hover fill 자체는 `3:1`일 필요가 없고 inactive control은 예외다.                              | 미묘한 보조 hover feedback과 계속 식별되어야 하는 지속 state 정보를 분리한다.                                                    | WCAG는 결과를 평가하며 palette, component recipe, visual character를 고르지 않는다.                  |

## 수렴점과 차이점

### 강한 수렴점

1. Rest, hover, pressed, selected, disabled는 임의의 더 밝거나 어두운 swatch가
   아니라 semantic state다.
2. Transparent-rest action이 흔하지만, 그렇지 않으면 모호해지는 control은 여전히
   식별 가능한 content, geometry, placement 또는 다른 affordance가 필요하다.
3. Hover는 보조 역할이며 의도적으로 조용한 경우가 많다. Pressed는 보통 더
   강하거나 다른 방식으로 구분되지만 activation 중에만 유지된다.
4. 지속되는 selection은 hover와 ownership이 다르다. 시스템은 전용 fill,
   structural indicator, selected control 또는 그 조합을 사용한다.
5. Disabled background, border, content는 secondary/subtle readable content와
   분리된다.
6. 주요 시스템은 Light/Dark role name을 유지하면서 비대칭 값과 component별
   recipe를 허용한다.
7. Component alias는 실제 디자인 시스템 layer다. Global primitive나 opacity
   하나로 rendered state 전체를 정의할 수 없다.

### 실질적 차이

1. Fluent 2처럼 재사용 가능한 global subtle ladder를 공개하는 시스템도 있지만,
   현재 Spectrum S2를 포함한 다른 시스템은 실질적으로 다른 component recipe를
   공개한다.
2. Pressed는 hover와 같을 수도, 더 강할 수도, ripple/overlay를 사용할 수도 있다.
   시스템 간 범용 opacity는 없다.
3. Selected state는 subtle neutral fill부터 강한 inverse 또는 유채색 fill까지
   다양하다. 이는 범용 규칙이 아니라 제품 및 component semantics를 따른다.
4. Disabled 처리는 opaque alias, alpha, component opacity를 사용한다. 다른
   시스템의 recipe를 합치면 출처 없는 새로운 hybrid가 된다.

## 정확한 Spectrum S2 조사 결과

### Global alias는 범용 neutral-state ladder를 정의하지 않는다

- `background-opacity-default`는 `0`, hover와 down은 모두 `0.1`이다.
- `neutral-subtle-background-color-default`는 default color-set만 있다. Light
  `#e9e9e9`, Dark `#393939`이며 이에 대응하는 `hover`, `down`, `selected` alias를
  공개하지 않는다.
- 전체 `neutral-background` family는 강한 filled-control family다.
  selected/default는 `gray-800` (`#292929/#dbdbdb`), selected hover/down은
  `gray-900` (`#131313/#f2f2f2`)이다. 일반 subtle row recipe가 아니다.
- Disabled alias는 정확히 분리된다. background `gray-100`
  (`#e9e9e9/#2c2c2c`), border `gray-300` (`#dadada/#393939`), content
  `gray-400` (`#c6c6c6/#444444`)이다. `opacity-disabled`는 별도로 `0.3`이다.

따라서 일반 hover/down이 `neutral-subtle-background-color-default`를 사용할 수
있다는 문서 `34`의 잠정 문구를 범용 mapping으로 승격할 수 없다. Spectrum이
global하게 공개하지 않은 state 책임에 색 입력값을 연결했기 때문이다.

### 현재 component 데이터는 맥락별 ownership을 증명한다

| Spectrum component family | 공개된 neutral state 값                                                                                                                                                               | 결과                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Stack item                | Unselected hover/down `gray-100` (`#e9e9e9/#2c2c2c`), selected rest `gray-100`, selected hover/key focus `gray-200` (`#e1e1e1/#323232`), selected down `gray-300` (`#dadada/#393939`) | List 계열 component에는 일관된 opaque primitive ladder가 있지만 명시적으로 Stack component family다.                            |
| Tree view                 | Row hover 및 neutral selected rest/hover가 `gray-100` (`#e9e9e9/#2c2c2c`)이다.                                                                                                        | Tree selection은 Stack의 selected hover/down 진행을 자동으로 재사용하지 않는다.                                                 |
| Menu item                 | State color-set은 default, hover, down, keyboard focus, disabled 모두 Light `#e9e9e9`, Dark `#323232`다.                                                                              | Dark는 generic `neutral-subtle` `#393939`도 Stack `gray-100` `#2c2c2c`도 아니다. rendered state는 여전히 Menu 조합에 달려 있다. |
| Table row                 | Hover는 `gray-900` `7%`, down은 `10%`, neutral selected는 `gray-800` `10%`, selected-hover는 `15%`다.                                                                                 | 밀도 높은 row는 Stack의 opaque gray ladder가 아니라 overlay를 사용한다.                                                         |

이 차이를 임의로 평탄화하면 안 된다. Spectrum의 component alias layer가 최종
interaction recipe를 소유한다는 근거다.

## 승인된 `M-A` surface 대비 측정

각 rendered state와 승인된 Light/Dark `M-A`의 고유 surface 색 사이 정확한 sRGB
대비를 계산했다. 값이 같은 surface는 한 번만 셌다. Table overlay는 공개된
opacity로 sRGB 합성한 뒤 측정했다.

| Spectrum 근거               | Light state-to-surface 범위 | Dark state-to-surface 범위 | 해석                                                 |
| --------------------------- | --------------------------: | -------------------------: | ---------------------------------------------------- |
| Stack/Tree `gray-100` fill  |           `1.00:1`–`1.21:1` |          `1.14:1`–`1.35:1` | 의도적으로 미묘한 보조 state                         |
| Menu 색 입력값              |           `1.00:1`–`1.21:1` |          `1.24:1`–`1.47:1` | 여전히 독립적인 필수 state cue가 될 수 없다.         |
| Table hover `gray-900` `7%` |           `1.15:1`–`1.16:1` |          `1.17:1`–`1.22:1` | 보조 pointer feedback으로만 적합하다.                |
| Table down `10%`            |           `1.22:1`–`1.24:1` |          `1.28:1`–`1.34:1` | 더 강한 일시 feedback이지만 structural cue는 아니다. |
| Neutral selected row `10%`  |           `1.20:1`–`1.21:1` |          `1.23:1`–`1.30:1` | 단독으로 selection을 식별할 수 없다.                 |
| Selected-row hover `15%`    |           `1.32:1`–`1.33:1` |          `1.41:1`–`1.49:1` | 필수 state `3:1` threshold에 여전히 못 미친다.       |

측정 결과가 subtle fill을 거부하는 것은 아니다. 책임을 한정한다. Scanning과
feedback은 개선할 수 있지만, 필수 selected state에는 지속되는 시각 및
programmatic indicator가 함께 있어야 한다.

## 후보 비교

### `NI-A` — Spectrum component-family fidelity 보존

Foundation hover, pressed, selected fill 값을 하나씩 만들지 않는다. Foundation
수준에서는 범용 state 계약을 정하고, 이후 각 component alias를 동등한 하나의
완전한 Spectrum S2 component family에 mapping한다.

상태: `Proposed — 측정 specimen 권고; 미승인`.

### `NI-B` — 하나의 opaque Spectrum primitive ladder 발명

가능한 local recipe는 transparent rest, `gray-100` hover, `gray-200`
selected/hover, `gray-300` pressed다. 정돈돼 보이지만 Stack pattern 하나를 global
rule로 승격하며 Table, Tree, Menu 근거와 충돌한다.

상태: `비권고 — 출처 없는 일반화`.

### `NI-C` — 모든 곳에 하나의 neutral overlay 공식 사용

가능한 local recipe는 transparent rest와 hover, pressed, selected 모두 `10%`
neutral overlay다. 서로 다른 state를 합치고 공개된 Table의 `7%`, `10%`, `15%`
진행을 무시하며 지속되는 selection 문제를 해결하지 않는다.

상태: `비권고 — 불완전한 state 구조`.

### `NI-D` — Spectrum을 다른 완전한 시스템으로 교체

Fluent 2나 Carbon의 완전한 global state family를 쓰려면 `FCM-12`를 다시 열고
surface, foreground, boundary, component alias 전체의 승인된 neutral 출처를
교체해야 한다. 현재 측정된 Spectrum 실패는 그 변경을 요구하지 않는다.

상태: `FCM-12 재개 후에만 가능; 현재 비권고`.

## 제안하는 `NI-A` Foundation 계약

다음 specimen 진행이 승인되면 `NI-A`의 의미는 다음과 같다.

1. 일반 low-emphasis action은 정확한 Spectrum component family가 다른 조합을
   지정하지 않는 한 transparent이거나 승인된 `M-A` surface를 상속한다.
2. Foundation은 범용 `interaction-bg-hover`, `interaction-bg-pressed`,
   `selection-bg` 값을 공개하지 않는다. 그 alias는 component가 소유한다.
3. Component는 동등한 Spectrum Stack, Tree, Menu, Table 또는 다른 recipe를 색,
   opacity, state의 완전한 mapping으로만 채택할 수 있다. 한 family에서 한 값을,
   다른 family에서 다른 state를 가져오면 안 된다.
4. 기존 `F-A` content state를 유지한다. Default interactive content는
   `gray-900`, subdued interactive content는 `gray-800`로 강화될 수 있다. 이
   content 변화가 새로운 container fill을 승인하지는 않는다.
5. 기존 `NB-A` boundary를 유지한다. Hover나 selection이 Dark theme에 흰 outline을
   자동으로 추가하거나 모든 boundary를 `border-strong`으로 올리지 않는다.
6. 일반 persistent selection은 중립을 유지하며 programmatic state와 checkmark,
   selected control indicator, current-position marker 또는 측정된 다른 structural
   cue 같은 지속 시각 cue가 필요하다. Subtle fill은 이를 보조할 수 있지만 유일한
   필수 indicator가 될 수 없다.
7. Disabled part는 정확한 Spectrum alias를 사용할 수 있다. background
   `#e9e9e9/#2c2c2c`, border `#dadada/#393939`, content
   `#c6c6c6/#444444`이며 hover 또는 pressed state를 받지 않는다.
8. `opacity-disabled: 0.3`은 정확한 Spectrum component token이 명시적으로 위임할
   때만 사용한다. Local 판단으로 세 disabled alias 위에 중첩하지 않는다.
9. Focus, signature/유채색 selection, feedback, motion, component geometry는 별도
   approval gate로 남긴다.

## 필수 specimen gate

`NI-A` 승인은 전용 guide specimen만 허용하며 `C5M-06`를 종료하지 않는다.
Specimen은 다음을 보여 주고 측정해야 한다.

1. 모든 실제 Light/Dark `M-A` surface에서 transparent-rest low-emphasis action과
   이미 채워진 control
2. recipe를 합치지 않은 Stack/list, Tree-like hierarchy, Menu, dense Table family
3. rest, hover, pressed/down, selected, selected-hover, disabled 조합
4. persistent non-fill cue가 있는 selected state와 없는 selected state를 함께
   보여 fill-only가 유효하지 않은 이유
5. 고정된 승인 `F-A` content와 `NB-A` boundary
6. 실제 NosLog 한국어, 일본어, 영어 label, 긴 곡 제목, rank row, metadata,
   unavailable action, multi-selection 예시
7. `320px`, `390px`, 관련 intermediate width, desktop density, 200% zoom
8. 후속 custom focus 처리를 미리 승인하지 않는 pointer, touch/no-hover, keyboard,
   forced-colors, programmatic selected/disabled state

## 사용자 검토 권고

`NI-A`를 측정 specimen으로 진행하고 specimen 검토 전까지 `C5M-06`를 열어 둔다.

근거:

1. Spectrum 자체가 공개하지 않은 범용 token을 발명하지 않으면서 승인된 Spectrum
   출처를 보존하는 유일한 후보다.
2. Tailwind와 비슷한 local palette나 interaction recipe를 합성하지 않고, 저명한
   유지 관리 시스템의 semantic mapping을 그대로 채택한다는 프로젝트 원칙을
   따른다.
3. 미묘한 interaction feedback을 보존하면서 저대비 fill만으로 selected state
   의미를 전달하지 않게 한다.
4. 문서 `34`의 잠정 해석을 다른 미검증 global 공식으로 조용히 대체하지 않고
   정정한다.
5. Foundation을 lean하게 유지한다. 범용 accessibility 및 governance rule은
   Foundation에 두고 정확한 visual state는 동등한 component가 소유한다.

## 결정 로그

| ID       | 항목                                                                                                                                        | 상태                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `C5I-01` | 일반 neutral container state의 권위로 `neutral-subtle-background-color-default` 단독이 아니라 현재 Spectrum S2 component 데이터를 취급한다. | `Observed`                |
| `C5I-02` | Stack primitive ladder나 generic opacity로 하나의 global hover/pressed/selected neutral fill을 만들지 않는다.                               | `NI-A에서 Proposed`       |
| `C5I-03` | Persistent ordinary selection에 programmatic state와 측정된 non-fill cue를 요구하며 subtle neutral fill은 보조 역할로 한정한다.             | `NI-A에서 Proposed`       |
| `C5I-04` | 임의의 중첩 opacity 없이 정확한 disabled background, border, content alias를 채택한다.                                                      | `NI-A에서 Proposed`       |
| `C5I-05` | focus, signature/유채색 selection, feedback, 최종 component alias를 `C5M-06` 외부에 유지한다.                                               | `Observed scope boundary` |
| `C5M-06` | 일반 neutral interaction과 selection에서 Spectrum component-family fidelity를 보존한다.                                                     | `Open — 사용자 검토 필요` |
