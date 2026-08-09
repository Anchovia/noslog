# NosLog 2.0 C5 포커스 표시기 레퍼런스 비교

[Canonical English source](42-foundation-c5-focus-indicator-reference-comparison.md)

## 문서 관리

| 필드           | 값                                                                   |
| -------------- | -------------------------------------------------------------------- |
| 상태           | `조사 완료 — FI-C를 measured validation 대상으로 선택`               |
| 날짜           | `2026-08-09`                                                         |
| Canonical 언어 | English                                                              |
| 결정 gate      | C5 키보드 포커스 표시기 색상 및 geometry                             |
| 상속된 승인    | `M-A` surface, `F-A` foreground, `NB-A` boundary, `NI-A` interaction |

이 문서는 NosLog 포커스 token, component alias 또는 production 구현을 승인하기
전에 키보드 포커스의 시각 처리를 비교한다. 사용자는 2026-08-09 `FI-C`, Fluent 2의
achromatic polarity를 전용 measured validation 대상으로 선택했다. 이 선택은 guide
specimen만 허용한다.

## 관련 문서

- [Foundation semantic role map](25-foundation-semantic-role-map.ko.md)
- [Foundation color and material candidates](32-foundation-color-material-candidates.ko.md)
- [Foundation signature-color research](33-foundation-signature-color-research.ko.md)
- [C5 Spectrum S2 semantic mapping](34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 neutral boundary specimen validation](39-foundation-c5-neutral-boundary-specimen-validation.ko.md)
- [C5 neutral interaction specimen validation](41-foundation-c5-neutral-interaction-specimen-validation.ko.md)
- [C5 포커스 표시기 시각 비교](43-foundation-c5-focus-indicator-visual-comparison.ko.md)
- [C5 Fluent 포커스 표본 검증](44-foundation-c5-fluent-focus-specimen-validation.ko.md)

## 범위

이 비교는 키보드 포커스를 위한 authored 시각 표시기를 다룬다.

- normal-theme Light/Dark 색상;
- 표시기 두께, gap, offset, 단색 또는 다중 색상 구조;
- hover, pressed, selected, error 및 signature color와의 분리;
- 승인된 중립 surface, filled control, 이미지, dense data에서의 동작;
- clipping, 고배율 zoom 및 forced-colors 요구사항.

포커스 순서, roving `tabindex`, dialog 복귀, component geometry, 최종 component
alias, signature/feedback color, production code 및 최종 high-fidelity page design은
제외한다. 이들은 별도 gate로 남는다.

## 기존 권한

1. 승인된 방향 `C2-B`는 키보드 포커스를 `focus-outer`와 선택적
   `focus-inner`에 할당한다. 포커스는 signature/accent, selection 및 error와
   독립적이다.
2. 포커스를 평가하는 동안 `M-A`, `F-A`, `NB-A`, `NI-A`는 고정된다. 포커스
   처리는 기반 control을 다시 칠하거나 모든 정상 boundary를 승격할 수 없다.
3. Tailwind CSS에는 시각 권한이 없다. Tailwind의 blue ring, palette step,
   starter shadow 및 template은 제외한다.
4. Adobe Spectrum S2는 독점적인 neutral source이지만, 그 승인이 포커스
   mapping까지 사전 승인하지는 않았다. 포커스에는 별도의 source, role
   mapping, specimen 및 사용자 승인이 필요하다.
5. 과도하게 accent를 사용한 `FCM-11`과 `SIG-07` 예시는 계속 `Rejected`이며,
   근거나 target으로 사용하지 않았다.
6. 문서 `41`은 Chrome의 normal Dark user-agent outline을 `1px`
   `rgb(153, 200, 255)`로 관찰했다. Forced colors에서는 system white/cyan
   표시기가 나타났다. 이 결과는 도달 가능성과 system override 동작을
   증명하지만 NosLog normal-theme 후보는 아니다.

## 비교에 사용한 동등 역할

현재 키보드 포커스를 가진 interactive element를 식별하는 지속적인 시각 변화만
동등한 근거로 취급한다.

| 포함한 근거                                         | 대체재로 제외한 것                |
| --------------------------------------------------- | --------------------------------- |
| Global 또는 component `:focus-visible` outline/ring | Brand 또는 signature swatch       |
| 포커스 동안 계속 보이는 focus border 또는 underline | Hover, pressed 또는 selected fill |
| 기본 포커스 색과 짝을 이루는 contrast band          | Validation/error border           |
| Forced-colors system override                       | 측정값 없는 browser screenshot    |

## 접근성 기준선

### 필수 및 목표 기준

- WCAG 2.2 `2.4.7 Focus Visible`은 Level AA이며 보이는 키보드 포커스 표시기를
  요구한다.
- WCAG 2.2 `2.4.11 Focus Not Obscured (Minimum)`은 Level AA이며 authored
  content가 focused component를 완전히 가리지 못하게 한다.
- WCAG 2.2 `1.4.11 Non-text Contrast`는 Level AA다. visible focus와 함께
  authored indicator에서 state 식별에 필요한 pixel은 인접 색상과 `3:1`이어야
  하며, user agent가 수정되지 않은 appearance를 정하는 경우는 예외다.
- WCAG 2.2 `2.4.13 Focus Appearance`는 AA가 아니라 Level AAA다. 표시기 면적은
  최소 `2 CSS px` perimeter만큼이어야 하며, 동일한 pixel의 focused/unfocused
  상태 변화 대비가 최소 `3:1`이어야 한다.
- solid `2px` perimeter가 가장 단순한 AAA geometry이지만 같은 면적을 가진
  다른 표시기도 통과할 수 있다. Offset은 필수가 아니지만 분리를 개선할 수
  있다.
- WAI-ARIA APG 지침에 따라 포커스는 항상 보여야 하고 selection과 시각적으로
  구별되어야 한다. 색상과 gradient는 high-contrast mode에서 사라질 수 있으므로
  system override를 유지해야 한다.

NosLog는 `2.4.13`이 AAA임에도 측정 가능한 `2px`/`3:1` Focus Appearance 기준을
목표로 한다. 이 조사는 이를 AA 요구사항으로 잘못 표기하지 않는다.

## 레퍼런스 매트릭스

이 매트릭스는 15개의 독립적인 표준, design system, production service 및 현재
NosLog 근거에 걸친 관련 항목 16개를 포함한다. 유지 관리 중인 공개 source가
단일 static Light/Dark pair를 공개하지 않으면 theme-defined 또는 unavailable로
표시하며, 누락 값을 추정하지 않는다.

|   # | 레퍼런스                                                                                                                                                                                                                                                     | 공개된 동등 처리                                                                                                                                                                                                                                                    | 적용 가능한 발견                                                                              | NosLog 한계                                                                                                                     |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [WCAG 2.2 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast) 및 [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance)  | Palette를 정하지 않는다. visible focus와 필요한 인접 non-text contrast는 AA이며, AAA appearance 목표는 `2 CSS px` perimeter-equivalent 면적과 focused/unfocused pixel 변화 `3:1`이다.                                                                               | 스타일을 정하지 않고 acceptance floor를 제공한다.                                             | NosLog 색상이나 ring architecture를 선택할 수 없다.                                                                             |
|   2 | [WAI-ARIA APG keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                                                                                                                                             | Palette를 정하지 않는다. 포커스는 지속되고 쉽게 식별되며 selected state와 달라야 한다. high-contrast에서 사라지는 문제를 고려해야 한다.                                                                                                                             | 포커스와 selection에 별도의 시각 소유권이 필요함을 확인한다.                                  | 행동 지침이지 token data가 아니다.                                                                                              |
|   3 | [Adobe Spectrum S2 color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/) 및 [layout tokens](https://opensource.adobe.com/spectrum-design-data/tokens/layout/)                                                              | `focus-indicator-color`: Light `#4b75ff`, Dark `#4069fd`; `focus-indicator-thickness`: `2px`; `focus-ring-gap`: `2px`. 명시적인 static context용 black/white focus alias도 있다.                                                                                    | 하나의 유지 관리되는 source가 완전하고 절제된 dual-mode semantic color와 geometry를 공개한다. | 이미지 가장자리, clipped container 및 component 예외는 여전히 NosLog specimen이 필요하다.                                       |
|   4 | [Fluent 2 web alias color tokens](https://fluent2.microsoft.design/color-tokens2/) 및 [interaction color guidance](https://fluent2.microsoft.design/color)                                                                                                   | `colorStrokeFocus1`: Light white, Dark black; `colorStrokeFocus2`: Light black, Dark white. 표준 web focus-outline helper는 두 번째 색을 `2px`로 사용하며 component recipe는 달라질 수 있다.                                                                        | Achromatic polarity는 대비를 극대화하며 brand 소유권을 피한다.                                | 강한 Dark white 처리는 일시적인 keyboard-visible focus로만 남아야 하며 일반 persistent boundary가 되어서는 안 된다.             |
|   5 | [Atlassian focused border guidance](https://atlassian.design/foundations/border/) 및 [radius guidance](https://atlassian.design/foundations/radius/)                                                                                                         | `color.border.focused`와 `border.width.focused` `2px`; focus ring offset은 `2px`이며 radius는 element radius에서 증가한다. 배포된 default fallback은 Light `#388bff`다. 공개 페이지는 theme에 적응하지만 static content에 안정적인 Dark hex 하나를 노출하지 않는다. | 명확한 semantic 분리와 명시적인 geometry가 강점이다.                                          | 현재 theme artifact를 확인하기 전에는 완전하고 정확한 Light/Dark pair를 static 공개 근거에서 채택할 수 없다.                    |
|   6 | [Carbon color overview](https://carbondesignsystem.com/elements/color/overview/) 및 [tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                          | 대부분의 focus는 `2px` border다. Light는 보통 Blue 60 `#0f62fe`, Dark는 보통 white를 쓴다. 필요할 때 `$focus-inset`이 contrast border를 추가한다.                                                                                                                   | 측정된 단색 기본값과 component-owned contrast band를 보여준다.                                | White Dark focus는 밝은 outline 문제를 반복하며 Carbon inset recipe를 Spectrum에 선택적으로 섞을 수 없다.                       |
|   7 | [Primer color primitives](https://primer.style/product/primitives/color/) 및 [button focus implementation](https://primer.style/product/components/button/)                                                                                                  | `--focus-outlineColor`는 Light `#0969da`이며 theme이 mode별 값을 제공한다. Button은 `-2px` offset의 `2px` outline을 쓰고 primary button에는 inset on-emphasis band를 추가한다.                                                                                      | Component-owned geometry와 명시적인 filled-control 처리를 보여준다.                           | 공개 static token table은 완전한 표준 Dark pair를 노출하지 않으며 Primer inset recipe는 Spectrum recipe가 아니다.               |
|   8 | [Material Web text field tokens](https://github.com/material-components/material-web/blob/main/docs/components/text-field.md) 및 [Angular Material strong focus](https://github.com/angular/components/blob/main/guides/theming.md)                          | Component focus는 흔히 theme `primary`로 resolve되며 선택적 strong indicator는 별도 설정이 없으면 theme `secondary`를 쓴다. Brand-independent global Light/Dark focus pair가 고정되어 있지 않다.                                                                    | Theme-owned, component-specific 대안을 보여준다.                                              | 포커스를 signature/accent와 독립시키는 승인된 `C2-B`와 충돌하며 Material Web은 maintenance mode다.                              |
|   9 | [GOV.UK focus states](https://design-system.service.gov.uk/get-started/focus-states/) 및 [functional colors](https://design-system.service.gov.uk/styles/colour/)                                                                                            | Focus yellow `#ffdd00`, focus text/contrast black `#0b0c0c`, `3px` focus-width token을 사용한다. Text focus는 yellow fill과 강한 black underline을, input은 yellow outline과 black structure를 함께 쓴다.                                                           | 다양한 service background에서 보이는 완전한 two-color method다.                               | normal Dark product theme가 없고 의도적으로 강한 public-service character는 일반 NosLog density에 지나치다.                     |
|  10 | [USWDS settings](https://designsystem.digital.gov/documentation/settings/) 및 [system color tokens](https://designsystem.digital.gov/design-tokens/color/system-tokens/)                                                                                     | Default focus는 `blue-40v` `#2491ff`, solid, zero offset, `0.5` spacing-unit width(`4px`)다.                                                                                                                                                                        | 견고한 단색 정부 기본값은 미묘함보다 가시성을 우선한다.                                       | Theme default이지 공개된 normal Light/Dark pair가 아니며 `4px`는 현재 NosLog structure보다 상당히 무겁다.                       |
|  11 | [VA.gov focus management](https://design.va.gov/accessibility/focus-management) 및 [color tokens](https://design.va.gov/foundation/design-tokens/color)                                                                                                      | 두꺼운 global gold outline을 쓰며 `vads-color-action-focus-on-light`는 `#face00`이다. System은 team이 local custom focus style을 만들지 않게 한다.                                                                                                                  | 강한 일관성과 dedicated focus semantic이 유용하다.                                            | 공개 web role은 완전한 normal Dark pair를 공개하지 않으며 gold는 향후 warning/feedback 결정과 경쟁한다.                         |
|  12 | [SAP Fiori theming](https://experience.sap.com/fiori-design-web/theming/) 및 [SAP theming base content](https://github.com/SAP/theming-base-content)                                                                                                         | Focus는 Morning Horizon, Evening Horizon 및 두 high-contrast theme에 mapping되는 안정적인 semantic theme parameter다. 공개 지침은 더 많은 대비, 공간, hierarchy를 강조한다.                                                                                         | Mode와 accessibility variant가 하나의 semantic role을 통해 resolve되어야 함을 확인한다.       | Guideline page는 직접 채택할 수 있는 static focus value/geometry pair 하나를 공개하지 않으며 정확한 값은 theme artifact에 있다. |
|  13 | [PatternFly token catalog](https://www.patternfly.org/tokens/all-patternfly-tokens/) 및 [accessibility guidance](https://www.patternfly.org/accessibility/develop/)                                                                                          | `pf-t--global--focus-ring--color--100`, Light/Dark token mode 및 component-level state recipe를 공개한다. Static catalog는 보편적으로 resolve된 hex와 geometry 하나를 표시하지 않는다.                                                                              | Semantic focus ownership이 theme 변경에도 유지된다.                                           | 완전한 채택에 필요한 exact static data가 부족하고 component recipe를 조용히 일반화할 수 없다.                                   |
|  14 | [Radix Themes color guidance](https://www.radix-ui.com/themes/docs/theme/color) 및 [Dark mode](https://www.radix-ui.com/themes/docs/theme/dark-mode)                                                                                                         | 대부분의 component는 accent-derived `--focus-8`을 사용한다. Focus와 selection은 component accent 및 Light/Dark appearance에 맞춰 자동 조정된다.                                                                                                                     | 유지 관리되는 dual-mode focus plumbing을 보여준다.                                            | 포커스를 accent에 직접 결합해 `C2-B`와 충돌하며, accent 선택 전에는 고정된 독립 pair가 없다.                                    |
|  15 | [Salesforce SLDS color migration](https://developer.salesforce.com/blogs/2023/06/preparing-your-app-for-the-lightning-design-system-color-update) 및 [focus handling](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-focus.html) | 접근성 focus 변화가 local hard-coded approximation 없이 전파되도록 component blueprint와 semantic styling hook을 사용하게 한다. 공개 자료는 완전한 normal Light/Dark focus pair 하나를 공개하지 않는다.                                                             | Upstream semantic 및 component ownership을 강화한다.                                          | Governance 근거일 뿐 exact NosLog 값이나 geometry를 제공할 수 없다.                                                             |
|  16 | [현재 NosLog interaction validation](41-foundation-c5-neutral-interaction-specimen-validation.ko.md)                                                                                                                                                         | Chrome normal Dark UA focus는 `1px rgb(153, 200, 255)`로 측정됐고 forced colors에서는 보이는 system cyan/white 표시기와 semantic state가 유지됐다.                                                                                                                  | 현재 browser 동작과 system override 보존 필요성을 확립한다.                                   | Browser-dependent UA output은 안정적인 design-guide token이나 cross-browser geometry가 아니다.                                  |

## 수렴과 불일치

### 강한 수렴

1. 포커스는 임의의 border 승격이 아니라 dedicated semantic state다.
2. 표시기는 selected, error 및 disabled state와 구별되어야 한다.
3. `2px`는 product system에서 가장 흔한 authored perimeter 두께이며 WCAG AAA
   appearance 면적 목표에 도달하는 가장 단순한 geometry다.
4. 하나의 semantic role은 Light/Dark에서 비대칭 값으로 resolve될 수 있다.
5. Filled control, 이미지 및 dense composite는 때때로 component-owned contrast
   band나 inset 처리가 필요하지만 이런 예외는 global primitive가 아니다.
6. High-contrast 및 forced-colors mode는 normal-theme 색을 대체할 수 있어야 한다.
   `forced-color-adjust: none`은 기본 전략이 아니다.
7. Clipping과 focus/selection 공존은 nominal swatch만큼 중요하다.

### 중요한 불일치

1. Spectrum, Atlassian, Primer, USWDS는 chromatic blue를 사용하고 GOV.UK/VA는
   warm yellow/gold를, Fluent와 Carbon Dark는 achromatic black/white를 사용한다.
2. Geometry는 inset부터 offset까지, `2px`부터 `4px`까지 다양하다. Cross-system
   universal offset은 없다.
3. 일부 system은 포커스를 독립시키지만 Material과 Radix는 active accent에서
   파생한다. 이는 승인된 NosLog role model과 충돌한다.
4. 일부 system은 global default와 component 예외를 함께 공개하고 다른 system은
   component recipe만 제공한다. 각각의 강점만 섞으면 출처 없는 hybrid가 된다.

## 정확한 Spectrum S2 후보 입력

Spectrum은 다음과 같은 온전한 semantic mapping을 공개한다.

| 역할                                 | Light     | Dark      | Geometry                                                    |
| ------------------------------------ | --------- | --------- | ----------------------------------------------------------- |
| `focus-indicator-color`              | `#4b75ff` | `#4069fd` | `2px` indicator thickness                                   |
| `focus-ring-gap`                     | `2px`     | `2px`     | Component와 outer ring 사이 공간                            |
| `static-black-focus-indicator-color` | `#000000` | `#000000` | Static-context alias이며 global normal-theme default가 아님 |
| `static-white-focus-indicator-color` | `#ffffff` | `#ffffff` | Static-context alias이며 global normal-theme default가 아님 |

일반 semantic pair를 채택하더라도 static black/white alias 또는 선택적
`focus-inner`가 자동 승인되지 않는다. 이들은 정확한 component 필요와 별도 측정
mapping이 필요하다.

## 승인된 `M-A`에 대한 측정 대비

Outer-ring 색은 인접한 승인 surface의 pixel을 대체한다. 모든 고유 `M-A`
neutral surface에 대해 exact sRGB contrast를 계산했다.

| Theme | 인접 `M-A` surface              | Focus color | Contrast |
| ----- | ------------------------------- | ----------- | -------: |
| Light | base/elevated/layer 2 `#ffffff` | `#4b75ff`   | `3.97:1` |
| Light | layer 1 `#f8f8f8`               | `#4b75ff`   | `3.74:1` |
| Light | pasteboard `#e9e9e9`            | `#4b75ff`   | `3.27:1` |
| Dark  | base/pasteboard `#111111`       | `#4069fd`   | `4.19:1` |
| Dark  | layer 1 `#1b1b1b`               | `#4069fd`   | `3.82:1` |
| Dark  | elevated/layer 2 `#222222`      | `#4069fd`   | `3.53:1` |

여섯 pair 모두 `3:1`을 넘는다. Solid `2px` perimeter와 결합하면 공개된
Spectrum geometry는 승인된 neutral surface에서 WCAG `2.4.13` appearance 목표를
검증할 수 있는 입력이다.

이 계산은 album artwork, chart, feedback fill, 미래 signature fill 또는
`overflow`로 잘린 ring에 대한 가시성을 증명하지 않는다. 이는 source 값을 미리
변형할 이유가 아니라 specimen에서 답할 질문이다.

## 후보 비교

### `FI-A` — 일반 Spectrum S2 focus mapping을 그대로 채택

- Light `focus-outer`: `#4b75ff`
- Dark `focus-outer`: `#4069fd`
- thickness: `2px`
- gap: `2px`
- `focus-inner`: 기본값 미할당
- static black/white alias: exact Spectrum-equivalent component context와 측정이
  정당화할 때만 사용 가능

상태: `시각 비교 후 미선택`.

진행을 권장하는 이유: 유지 관리되는 완전한 Light/Dark semantic mapping이고,
프로젝트가 채택한 Spectrum provenance를 보존하며, 수정 없이 승인된 neutral
surface contrast matrix를 통과하고, normal Dark white outline을 피한다.

### `FI-B` — Carbon의 완전한 Light-blue/Dark-white focus model 채택

상태: `시각 비교 후 미선택`.

완전하고 접근 가능하지만 focus만 교체하면 다른 system의 blue/inset 논리를
도입하며, 절제된 normal-theme 방향에서 이미 제외한 밝은 white Dark outline을
복원한다.

### `FI-C` — Fluent의 achromatic polarity model 채택

상태: `전용 measured validation 대상으로 선택 — 2026-08-09`.

유채색 focus를 피하고 미래 signature와 feedback palette를 선점하지 않는다. 사용자는
이 일시적인 keyboard-visible signal을 거부된 persistent white normal-Dark boundary와
명시적으로 구분했다. Light는 black, Dark는 white를 element가 보이는 키보드 포커스를
소유하는 동안에만 사용한다.

### `FI-D` — GOV.UK의 완전한 yellow/black method 채택

상태: `일반 NosLog UI에는 권장하지 않음`.

다양한 background에서 매우 견고하지만 yellow block 처리가 의도적으로 강하고,
normal Dark product mapping이 없으며, 미래 warning/feedback semantic을 선점할 수
있다.

### `FI-E` — browser user-agent focus를 design contract로 유지

상태: `guide default로 권장하지 않음`.

UA focus는 유효한 fallback 및 forced-colors mechanism이지만 색상, 두께 및 형태가
browser와 platform에 따라 다르다. 안정적인 Claude Design 또는 후속 production
mapping을 제공할 수 없다.

## 선택된 `FI-C` validation contract

전용 measured validation specimen은 `FI-C`를 아직 production으로 승격하지 않은 채
다음 규칙을 고정해야 한다.

1. Normal authored indicator는 keyboard-visible focus에 적용하며 지속적인
   pointer-click 장식으로 사용하지 않는다.
2. Fluent `colorStrokeFocus2`, 즉 Light `#000000`, Dark `#ffffff`와 공개된 `2px`
   web focus-outline helper의 zero offset을 사용한다. 회색화, tint, 약화, gap이나
   glow 추가 또는 Tailwind color 대체를 하지 않는다.
3. 포커스를 받았다는 이유만으로 component fill, text, icon, boundary 또는
   selected state를 다시 칠하지 않는다.
4. 하나의 hybrid multi-stroke rule을 발명하지 않는다. Component와 동등한 Fluent
   recipe가 `colorStrokeFocus1` 또는 다른 component-owned 처리를 요구하면 그 recipe를
   그대로 보존하거나 결정을 다시 열며 global primitive로 승격하지 않는다.
5. 포커스가 독립적으로 이동하는 동안 error와 selection semantic을 보존한다.
   Focused selected/error item은 두 책임을 모두 표시하되 두 element가 focus된 것처럼
   보여서는 안 된다.
6. Forced colors가 system `Highlight`/outline behavior를 사용하게 하고 adjustment를
   global로 비활성화하지 않는다.
7. Scroll container, rounded overflow boundary, sticky region 또는 viewport edge에서
   전체 ring을 자르지 않는다.

## 필수 measured specimen gate

포커스 gate를 닫기 전에 전용 guide specimen이 다음을 검증해야 한다.

1. Text link, icon button, low-emphasis action, filled control, form field, menu
   item, stack/tree row, dense ranking row, chart control 및 skip link;
2. Light/Dark의 모든 고유 `M-A` surface와 artwork/image edge 및 dark filled
   control;
3. Focus 단독, selected + focus, current + focus, error + focus 및 disabled
   neighbor를 necessary state에 color만 사용하지 않고 표시;
4. 정확한 `2px` thickness와 zero offset, radius/shape following, clipping 및 visible
   perimeter area;
5. `320px`, `390px`, 관련 intermediate width, desktop density, 실제 browser 200%
   zoom 및 authored sticky/overlay content에 의해 focus가 가려지지 않는지;
6. Keyboard 진입/이탈, composite 이동, visible focus persistence 및 programmatic
   state ownership;
7. Active forced colors에서 기본 descendant의
   `forced-color-adjust: none` 사용이 0인지;
8. Korean, Japanese, English label 및 긴 NOSTALGIA content에서 ring이 layout을
   바꾸거나 2차원 overflow를 만들지 않는지.

실패하면 source 결정을 다시 열어야 한다. Specimen이 achromatic 값을 조용히
약화하거나 Spectrum gap을 추가하거나 다른 system의 geometry를 차용해서는 안 된다.

## 결정 기록

| ID       | 문장                                                                                                                                                                       | 상태                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `C5F-01` | 키보드 포커스를 signature, selection, error 및 neutral boundary strength와 독립적으로 유지한다.                                                                            | `C2-B를 통해 상위 승인됨`  |
| `C5F-02` | 문서 `41`의 Chrome normal/forced-colors 결과를 normal-theme token이 아닌 browser 근거로 취급한다.                                                                          | `Observed`                 |
| `C5F-03` | 정확한 Spectrum S2 pair와 geometry는 수정 없이 승인된 모든 `M-A` neutral surface에서 `3:1`을 넘는다.                                                                       | `Observed`                 |
| `C5F-04` | Source를 선택하기 전에 실행 가능한 authored 후보를 동일 조건으로 시각 비교하며 각 upstream system의 정확한 color와 geometry를 보존한다.                                    | `완료 — 문서 43`           |
| `C5F-05` | 정확히 동등한 component context가 요구하지 않는 한 Fluent `colorStrokeFocus1` 또는 component-owned multi-stroke 예외를 global로 배정하지 않는다.                           | `선택된 validation rule`   |
| `C5F-06` | Browser, contrast, clipping, state coexistence, zoom, localization 및 forced-colors validation을 통과하고 사용자가 결과를 승인할 때까지 C5 focus gate를 Open으로 유지한다. | `Open`                     |
| `C5F-07` | Persistent normal-Dark white boundary 금지를 유지하면서 Fluent 2 achromatic polarity를 전용 measured validation으로 가져간다.                                              | `사용자 선택 — 2026-08-09` |

## 사용자 검토 gate

사용자는 문서 `43`에서 `FI-C`를 선택했다. 다음 gate는 위에 정의한 전용 measured
validation이다. 이 선택은 production token, 최종 component alias, signature color,
feedback color 또는 application 구현을 승인하지 않는다.
