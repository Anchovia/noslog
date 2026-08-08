# NosLog 2.0 C5 중립 경계 레퍼런스 비교

## 문서 관리

- 상태: `조사 완료; NB-A를 측정 표본 후보로 제안; 사용자 검토 대기;
C5M-05 미종결`
- 정본 언어: 영어
- 영어 정본:
  [38-foundation-c5-neutral-boundary-reference-comparison.md](./38-foundation-c5-neutral-boundary-reference-comparison.md)
- 시작일: 2026-08-09
- 범위: `C5M-05`를 결정하기 전에 저명한 Light/Dark 중립 경계 위계를
  비교하고, 문서 `34`의 잠정 표를 정정하며, 승인된 Adobe Spectrum S2 primitive
  출처를 보존하는 매핑을 식별한다.
- 입력: 승인된 문서 `25`, `32`, `33`, `35`, `36`, `37`; 문서 `34`의 잠정
  경계 가설; 현재 공식 디자인 시스템 지침과 배포 토큰 데이터; WCAG 2.2;
  승인된 모든 `M-A` 표면에 대한 측정 대비
- 제외: focus ring 색, 유채색 selected/error/success 경계, signature/domain/
  data-visualization 색, radius와 shadow 값, 최종 component alias, 고충실도 페이지
  디자인, production 구현

이 조사는 문서 `34`의 경계 표가 유용한 Spectrum 기반 가설이었을 뿐, 폭넓은
비교를 거친 승인 결과가 아니었기 때문에 필요하다. 이전 문서에 이미 값이
등장했다는 이유만으로 권위가 되어서는 안 된다.

## 관련 문서

- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.ko.md)
- [C5 neutral foreground comparison](./36-foundation-c5-neutral-foreground-reference-comparison.ko.md)
- [C5 foreground specimen validation](./37-foundation-c5-foreground-specimen-validation.ko.md)

## 권위와 비교 규칙

1. `FCM-12`에 따라 Adobe Spectrum S2는 정확한 Dark/Light 중립 primitive의
   승인된 독점 출처로 유지된다. 외부 시스템은 역할 구조를 검증할 수 있지만
   그 값을 Spectrum scale에 혼합할 수 없다.
2. Tailwind CSS는 색 레퍼런스가 아니다. palette, theme default, starter border,
   template은 NosLog 디자인 권위가 없다.
3. 동등한 역할을 비교한다. 장식적 divider, subtle/비필수 framing, 일반 component
   boundary, 필수 control 또는 graphical-object boundary, disabled boundary,
   appearance 동작이다.
4. 다른 시스템의 `border-default`라는 이름을 자동으로 동등하다고 보지 않는다.
   제품 책임과 인접 표면이 비교 가능성을 결정한다.
5. focus와 selected state는 별도 결정으로 남는다. 어떤 출처가 유채색 focus 또는
   selection border를 사용하더라도 이 gate에서 그 색을 NosLog에 승인하지 않는다.
6. 활성 `forced-colors`에서 관찰한 흰 outline은 browser/user 접근성 override다.
   정상 Dark theme 레퍼런스 값이 아니다.
7. Rejected인 과도한 accent의 `FCM-11`, `SIG-07` 예시는 증거 집합에서 제외하며
   downstream에서 재사용할 수 없다.

## 정규화한 경계 책임

| 책임                      | 의미                                                                                    | 대비 계약                                                                     |
| ------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Decorative divider        | spacing, heading, structure로 이미 성립한 grouping을 리듬상 보강한다                    | `3:1` 미만일 수 있다. 유일한 필수 cue가 될 수 없다                            |
| Subtle framing            | 없어도 control, state, meaning을 숨기지 않는 비필수 container/region edge다             | `3:1` 미만일 수 있다. box-within-box noise를 만들지 않는다                    |
| Ordinary boundary         | label, shape, fill, placement 또는 다른 구조로도 존재가 확인되는 field/container edge다 | 다른 충분한 cue가 요소를 식별할 때만 `3:1` 미만일 수 있다                     |
| Necessary/strong boundary | control, state 또는 의미 있는 graphic을 식별하는 데 선 자체가 필요하다                  | 모든 관련 인접색에 최소 `3:1`이어야 하며 실패 값을 반올림해 통과시키지 않는다 |
| Disabled boundary         | WCAG inactive-component 예외가 적용될 수 있는 사용 불가 control을 나타낸다              | disabled 전용이며 subtle 장식이나 사용 가능한 control을 대신할 수 없다        |

WCAG는 모든 hit area에 `3:1` outline을 요구하지 않는다. 보이는 경계가 component나
state를 식별하는 데 필요할 때 `3:1`을 요구한다. 따라서 다른 충분한 cue가 없는
field는 저대비 장식 border만으로 존재를 나타낼 수 없다.

## 공식 레퍼런스 매트릭스

서로 독립적인 공식 출처 16개를 검토했다. 15개는 유지 관리되는 디자인 시스템
또는 production 권위이며, WCAG 2.2는 평가 권위다. 아래의 정확한 값은 현재 공식
문서 또는 시스템 소유자가 배포한 토큰 package에서 가져왔다. 완전한 정적 쌍을
공개하지 않는 출처는 이식 후보로 취급하지 않고 구조 참고용이라고 표시했다.

|   # | 공식 시스템/출처                                                                                                                                                                                                                                | 동등한 공개 역할과 실제 값                                                                                                                                                                                              | NosLog에 전용할 원칙                                                                                          | 적용 한계                                                                                                                                                                |
| --: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|   1 | [Adobe Spectrum color system](https://spectrum.adobe.com/page/color-system/), [object styles](https://spectrum.adobe.com/page/object-styles/), [S2 component colors](https://opensource.adobe.com/spectrum-design-data/tokens/color-component/) | 공개 지침은 `gray-200/300`을 decorative border/framing, `gray-400`을 field border, `gray-600`을 control border에 배정한다. 승인된 S2 쌍은 `#e1e1e1/#323232`, `#dadada/#393939`, `#c6c6c6/#444444`, `#717171/#8a8a8a`다. | `FCM-12` 아래에서 사용할 수 있는 유일한 값 family와 decorative부터 필수 control까지의 역할 ladder를 제공한다. | 현재 S2는 하나의 범용 neutral border alias를 공개하지 않는다. Light popover의 transparent border와 Dark의 `gray-400` 같은 예외가 있으므로 component alias는 후속 gate다. |
|   2 | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                                                                                | White/G100 예시는 `border-subtle-00 #e0e0e0/#393939`; layer별 subtle role은 더 강해진다. `border-strong-01 #8d8d8d/#6f6f6f`; interactive border는 별도다.                                                               | decorative, layered, strong, interactive boundary의 소유권이 달라야 함을 확인한다.                            | Carbon의 layer index 값과 유채색 interactive token은 Spectrum과 결합할 수 없다.                                                                                          |
|   3 | [Material 3 ColorScheme](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)                                                                                                                                 | baseline `outlineVariant #cac4d0/#49454f`는 `3:1`이 필요하지 않은 container/divider용이고, `outline #79747e/#938f99`는 주/접근성 outline이다.                                                                           | decorative boundary와 necessary boundary의 역할이 매우 가깝게 일치한다.                                       | Material hue와 dynamic color 체계는 적격 primitive가 아니다.                                                                                                             |
|   4 | [Microsoft Fluent 2 color tokens](https://fluent2.microsoft.design/color-tokens/)                                                                                                                                                               | `NeutralStrokeSubtle #e0e0e0/#0a0a0a`; Stroke 2 `#e0e0e0/#525252`; Stroke 1 `#d1d1d1/#666666`; Accessible `#616161/#adadad`. interaction state에는 별도 alias가 있다.                                                   | 다단계 neutral stroke ladder와 별도의 accessible boundary를 확인한다.                                         | Fluent의 가장 어두운 subtle 값은 자체 Dark surface에 의존하므로 hex만 떼어 도입할 수 없다.                                                                               |
|   5 | [GitHub Primer color primitives](https://www.primer.style/product/primitives/color/)                                                                                                                                                            | Light/Dark 배포 theme 데이터는 muted `#d1d9e0b3/#3d444db3`, default `#d1d9e0/#3d444d`, emphasis `#818b98/#656c76`, disabled `#818b981a/#656c761a`다.                                                                    | appearance 간 stable한 muted/default/emphasis/disabled semantic name을 확인한다.                              | Primer는 alpha와 blue-gray 값을 사용하며 Spectrum 호환 입력이 아니다.                                                                                                    |
|   6 | [Radix Colors scale usage](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)                                                                                                                                    | Gray step 6 `#d9d9d9/#3a3a3a`은 subtle noninteractive border, step 7 `#cecece/#484848`은 interactive border, step 8 `#bbbbbb/#606060`은 stronger interactive border와 focus ring용이다.                                 | noninteractive, interactive, strong boundary를 분리해야 한다는 강한 독립 증거다.                              | Radix step 8에는 focus가 포함되지만 NosLog `C5M-05`에서는 제외한다.                                                                                                      |
|   7 | [Atlassian border foundation](https://atlassian.design/foundations/border)                                                                                                                                                                      | 현재 Light/Dark token 데이터는 default border `#0B120E24/#E3E4F21F`, input border `#8c8f97/#7e8188`, disabled border `#0515240F/#CECED912`다. selected와 focus는 별도 유채색 alias다.                                   | 일반 separator와 input을 식별하는 boundary 사이의 강도 차이를 확인한다.                                       | alpha 값과 유채색 state는 Atlassian theme 소유이며 역할 증거로만 쓴다.                                                                                                   |
|   8 | [GitLab Pajamas border foundation](https://design.gitlab.com/product-foundations/border/)                                                                                                                                                       | subtle `#ececef/#3a383f`, default `#dcdcde/#4c4b51`, strong `#bfbfc3/#626168`; section boundary는 context에 따라 매핑한다. 보통 `1px`이고 일부 state/emphasis는 `2px`다.                                                | 승인된 NosLog 역할 inventory와 절제된 1px/2px 구조를 가깝게 검증한다.                                         | Pajamas 값과 contextual section 동작은 Spectrum에 끼워 넣을 수 없다.                                                                                                     |
|   9 | [PatternFly colors](https://www.patternfly.org/foundations-and-styles/colors/)                                                                                                                                                                  | default/subtle은 `#e0e0e0/#4d4d4d`, control default는 `#8c8c8c/#a3a3a3`로 resolve되며 read-only는 더 약하다.                                                                                                            | 조작 가능한 control을 경계가 식별할 때 큰 강도 상승이 필요함을 확인한다.                                      | PatternFly의 Red Hat ramp와 theme indirection은 적격 값이 아니다.                                                                                                        |
|  10 | [Base Web theming](https://baseweb.design/guides/theming/)                                                                                                                                                                                      | `borderOpaque #f3f3f3/#292929`, appearance별 8% transparent border, selected `#000000/#dedede`; 공개 scale은 4%–24% neutral border 단계도 제공한다.                                                                     | 조용한 framing은 매우 약하게 유지하고 selection에는 별도 강한 소유권을 주는 시스템이다.                       | alpha/opaque 모델은 Spectrum mapping이 아니며 selected state는 이 gate 밖이다.                                                                                           |
|  11 | [SAP Fiori design tokens](https://experience.sap.com/fiori-design-web/design-tokens/)                                                                                                                                                           | Horizon Light/Dark의 list border `#e5e5e5/#2e3742`, group content `#d9d9d9/#323c48`, field border `#556b81/#a9b4be`; tile border는 transparent다.                                                                       | list, group, field, tile이 하나의 범용 line 값을 공유하면 안 된다는 강한 production 증거다.                   | SAP의 cool-gray theme와 component-level contract는 이식 후보가 아니다.                                                                                                   |
|  12 | [Shopify Polaris](https://shopify.dev/docs/api/polaris)                                                                                                                                                                                         | 배포 token 데이터는 visual-divider인 `color-border-secondary`를 Light `#ebebeb`, Dark override `#4a4a4a`로 매핑한다. base input border는 `#8a8a8a`, hover `#616161`, active `#1a1a1a`다.                                | divider와 input boundary의 강도 및 state 책임이 다름을 확인한다.                                              | 현재 공개 사이트가 완전한 pair 표를 제공하지 않으므로 package에서 검증한 쌍만 사용했다.                                                                                  |
|  13 | [Elastic EUI borders](https://eui.elastic.co/next/docs/getting-started/theming/tokens/borders/)                                                                                                                                                 | 현재 active-theme 문서는 main border를 `#e3e8f2`, thin `1px`, thick `2px`로 resolve하며 form 전용 border color를 분리한다. high contrast에서는 더 강한 shade로 교체한다.                                                | width와 color가 별도 결정이고 form에 더 강한 component token이 필요할 수 있음을 확인한다.                     | 정적 페이지가 active theme만 보여 주므로 EUI는 정확한 dual-mode 후보가 아닌 구조 증거다.                                                                                 |
|  14 | [Ant Design theme tokens](https://ant.design/docs/react/customize-theme/)와 [Dark mode](https://ant.design/docs/spec/dark/)                                                                                                                     | Ant는 `colorBorder`, 더 밝은 `colorBorderSecondary`, `colorSplit`을 분리한다. 현재 Light component 표의 `colorSplit`은 `rgba(5,5,5,.06)`이고 Dark 값은 algorithm으로 파생된다.                                          | 일반 border와 divider가 자동으로 같은 강도가 아님을 확인한다.                                                 | 하나의 권위 페이지에 stable static Light/Dark neutral pair가 없어 값 도입 후보가 아니다.                                                                                 |
|  15 | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)                                                                                                                                                                            | production Light 역할은 border `#b1b4b6`, input border/text `#0b0c0c`이며 focus는 별도다.                                                                                                                               | decorative grouping보다 훨씬 강한 input boundary와 유지 관리되는 semantic ownership을 뒷받침한다.             | 일반 Dark theme가 없어 구조 증거로만 쓴다.                                                                                                                               |
|  16 | [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                                                                                                                                | 필요한 component/state/graphic cue는 인접색과 최소 `3:1`이어야 한다. decorative boundary, 충분히 식별되는 hit area, inactive component는 적용 범위가 다르다.                                                            | 모든 것을 과하게 outline하지 않으면서도 필요한 control을 약하게 숨기지 않는 통과/실패 규칙을 준다.            | WCAG는 결과를 평가하며 palette, role name, aesthetic strength를 고르지 않는다.                                                                                           |

## 수렴점과 차이

### 강한 수렴

1. 장식적 분리와 interactive control을 식별하는 필수 경계는 다른 semantic
   responsibility다.
2. Light/Dark 시스템은 role name을 유지하면서 비대칭 값을 자주 사용한다. Light
   gray 하나를 단순 반전하는 방식은 인정된 theme 방법이 아니다.
3. divider와 반복 framing은 의도적으로 조용하다. strong border는 특히 field,
   control, selected state, 의미 있는 graphic에 제한적으로 쓴다.
4. disabled, focus, selected, feedback boundary는 별도의 state ownership을 가진다.
5. `1px`이 일반 structural line이며 `2px`은 보통 state나 emphasis다. 필요한 대비
   부족을 두께로 대신하는 수단이 아니다.
6. component system은 semantic layer 이후 component alias를 자주 추가한다. 하나의
   범용 border 값으로 모든 UI object를 해결할 수 없다.

### 실질적 차이

1. decorative 단계 수는 시스템마다 다르다. Spectrum 지침은 두 단계
   (`gray-200/300`)이고, 일부는 합치며 일부는 layer별 단계를 더한다.
2. alpha border와 opaque value 사용이 갈린다. 공통 원칙은 semantic responsibility와
   검증된 adjacency이지 이식 가능한 opacity 공식이 아니다.
3. 일부 시스템은 ordinary input에 기본적으로 accessible-strength border를 쓰고,
   일부는 label, fill, shape, layout이 field를 이미 식별할 때만 약한 border를 쓴다.
   NosLog는 이 조건을 명시해야 한다.
4. upstream에서 focus와 selection이 흔히 유채색이지만, normal interaction은 기본
   neutral이고 focus는 별도 gate라는 승인된 NosLog 규칙을 덮어쓰지 않는다.

## Spectrum 권위 정정

문서 `34`의 잠정 매핑은 Spectrum의 공개 역할 ladder로 충분히 뒷받침되지만,
provenance는 정확히 표현해야 한다.

1. `gray-200/300/400/600` ladder는 Spectrum의 공개 color-system 역할 지침과
   승인된 정확한 S2 primitive에서 온다.
2. 현재 S2 alias 데이터는 `disabled-border-color → gray-300`을 공개하지만 하나의
   범용 `divider`, `border-default`, `border-strong` alias set을 제공하지 않는다.
3. 현재 S2 component 데이터에는 transparent border와 component별 strong border
   같은 정당한 예외가 있다. 따라서 Foundation mapping 승인이 모든 component
   assignment를 자동 승인하지 않는다.
4. NosLog는 이 네 이름이 현재 upstream S2 alias라고 주장하지 않으면서 공개 role
   ladder를 채택할 수 있다. component alias는 실제 NosLog content와 adjacency로
   나중에 검증해야 한다.

## 후보 매핑

### `NB-A` — Spectrum의 공개 neutral boundary ladder 채택

| NosLog role      | Spectrum source |     Light |      Dark | 계약                                                                                                 |
| ---------------- | --------------- | --------: | --------: | ---------------------------------------------------------------------------------------------------- |
| `divider`        | `gray-200`      | `#e1e1e1` | `#323232` | decorative rhythm 전용이며 spacing, heading 또는 structure가 이미 관계를 표현한다                    |
| `border-subtle`  | `gray-300`      | `#dadada` | `#393939` | 비필수 framing과 공개 disabled-border 값이다. 값이 같아도 semantic alias는 분리한다                  |
| `border-default` | `gray-400`      | `#c6c6c6` | `#444444` | label, fill, shape, placement 또는 다른 충분한 cue가 이미 식별하는 ordinary field/container에만 쓴다 |
| `border-strong`  | `gray-600`      | `#717171` | `#8a8a8a` | 승인된 모든 surface에서 식별되어야 하는 필수 neutral control/graphic boundary다                      |

`border-strong`은 focus를 소유하지 않으며 selected state도 자동으로 소유하지 않는다.
이 state는 후속 component/state 결정과 non-color cue가 필요하다. subtle frame과
disabled boundary가 `gray-300`을 공유하는 것은 값 재사용이지 semantic 상호 교환이
아니다.

### `NB-B` — 현재 S2 component token만 사용

일반 boundary Foundation을 두지 않고 각 S2 component의 border token을 개별 복사하는
선택이다. NosLog에는 S2와 직접 대응하지 않는 component family가 있고 divider,
chart/viewer edge, dense ranking boundary, 미래 component governance가 해결되지
않으므로 권장하지 않는다.

### `NB-C` — 전체 중립 출처 교체

Material 3, Fluent 2, Carbon, Primer, GitLab 또는 다른 유지 관리 시스템은
`FCM-12`를 다시 열 때만 intact replacement로 평가할 수 있다. 그 primitive와
semantic mapping이 Spectrum을 대체해야 하며 섞을 수 없다.

현재 승인된 primitive 출처를 다시 열 만큼의 측정 boundary 실패는 없다. 따라서
지금은 `NB-C`를 권장하지 않는다.

## 승인된 `M-A` 표면과의 측정 적합성

다음 대비는 제안한 각 opaque boundary 값과 승인된 모든 opaque surface를 비교한다.
값은 `Light / Dark`다.

| Boundary           |      `canvas` |     `surface` |      `sunken` |      `raised` |     `overlay` | 계약 결과                                      |
| ------------------ | ------------: | ------------: | ------------: | ------------: | ------------: | ---------------------------------------------- |
| `gray-200` divider | `1.31 / 1.47` | `1.23 / 1.34` | `1.08 / 1.47` | `1.31 / 1.24` | `1.31 / 1.24` | decorative 전용                                |
| `gray-300` subtle  | `1.40 / 1.64` | `1.32 / 1.49` | `1.15 / 1.64` | `1.40 / 1.38` | `1.40 / 1.38` | 비필수/disabled 전용                           |
| `gray-400` default | `1.71 / 1.94` | `1.61 / 1.77` | `1.41 / 1.94` | `1.71 / 1.63` | `1.71 / 1.63` | 유일한 필수 cue가 될 수 없음                   |
| `gray-600` strong  | `4.88 / 5.47` | `4.60 / 4.99` | `4.02 / 5.47` | `4.88 / 4.61` | `4.88 / 4.61` | 모든 곳에서 `3:1` necessary-boundary gate 통과 |

이 측정은 모든 사용 가능한 control에 `gray-600`이 필요하다는 뜻이 아니다. 경계
자체가 필수인 경우 첫 세 값은 승인된 표면에서 유일한 cue로 부적격이라는 뜻이다.

## 사용자 검토 권고

아직 `C5M-05`를 승인하지 않고 `NB-A`를 전용 boundary specimen으로 진행할 것을
권고한다.

근거:

1. 승인된 Spectrum primitive 출처와 Spectrum 자체의 decorative/field/control
   위계를 모두 보존하는 유일한 후보다.
2. 15개 시스템 레퍼런스와 WCAG가 responsibility 분리를 독립적으로 지지한다.
3. `border-strong`에서 focus와 자동 selection ownership을 제거해 잠정 표의 핵심
   위험을 바로잡는다.
4. 저대비 `gray-400`이 존재가 드러나지 않는 input/control의 유일한 cue가 되는
   것을 명시적으로 금지한다.
5. 정상 Dark boundary를 neutral하고 절제되게 유지하며 browser가 만든 흰
   forced-colors outline은 정상 theme 밖에 둔다.

사용자가 이 방향을 승인하면 이 권고는 다음 guide specimen과 measurement만
허용한다. production token이나 application 구현은 허용하지 않는다.

## 필수 Boundary Specimen Gate

`C5M-05`를 닫기 전에 specimen은 다음을 검증해야 한다.

1. Light/Dark의 모든 실제 `M-A` surface 위 `divider`, `border-subtle`,
   `border-default`, `border-strong`;
2. list row, dense ranking/table division, flat content group, card, raised content,
   menu/popover, dialog edge, viewer/editor well, jacket/image edge, input,
   checkbox/radio/switch, unavailable control;
3. spacing 또는 fill로 boundary가 비필수인 경우와 line이 유일한 필수 cue인 경우;
4. normal, hover, pressed, selected, disabled, error, focus-visible composition.
   focus와 유채색 feedback 값은 범위 밖이라고 명확히 표시한다;
5. `320px`, `390px`, 중간 폭, desktop 폭과 `200%` zoom에서 한국어, 일본어,
   영어 실제 content;
6. keyboard 조작과 활성 `forced-colors`, 그리고 system outline을 정상 Dark mode에
   복사하지 않았다는 확인;
7. line이 두 surface에 닿을 때 inside/outside를 포함한 모든 necessary boundary의
   정확한 adjacent-color contrast;
8. 과도한 boxing, double border, nested frame, dense-page noise 검토.

component가 실패하면 먼저 semantic ownership, fill/spacing/shape를 수정하거나
승인된 stronger role을 사용한다. 중간 gray를 발명하거나 다른 시스템 값을
국소적으로 빌리지 않는다.

## 결정 로그

| ID       | 항목                                                                                                                        | 상태                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `C5B-01` | Tailwind color, template, default border styling을 C5 boundary 권위 밖으로 둔다.                                            | `Approved governance — inherited`    |
| `C5B-02` | 공식 출처 16개는 decorative separation과 필수 control/graphic boundary 분리에 수렴한다.                                     | `Observed`                           |
| `C5B-03` | 현재 S2에는 단일 범용 neutral border alias가 없다. 네 단계는 공개 Spectrum 역할 지침을 승인된 S2 primitive에 매핑한 것이다. | `Observed correction`                |
| `C5B-04` | 활성 forced-colors의 흰 outline은 browser/user override이며 정상 Dark-theme 후보가 아니다.                                  | `Approved clarification — inherited` |
| `C5B-05` | 위 역할 계약과 값 쌍으로 `gray-200/300/400/600`을 `NB-A`로 사용한다.                                                        | `Proposed — user review pending`     |
| `C5B-06` | 잠정 `border-strong` 계약에서 focus와 자동 selected-state ownership을 제거한다.                                             | `Proposed correction`                |
| `C5B-07` | 유일한 필수 cue인 boundary는 모든 인접색과 `3:1`에 도달하는 측정 role을 써야 한다.                                          | `Required accessibility gate`        |
| `C5B-08` | `C5M-05` 결정 전에 bilingual boundary specimen을 구축하고 검증한다.                                                         | `Proposed next step`                 |
