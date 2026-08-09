# NosLog 2.0 C5 Material Geometry 레퍼런스 비교

## 문서 관리

- 상태: `조사 초안 — 14개 출처 비교 완료; source set 추출 및 시각 Gate 대기`
- 정본 언어: 영어
- 영어 정본:
  [52-foundation-c5-material-geometry-reference-comparison.md](./52-foundation-c5-material-geometry-reference-comparison.md)
- 날짜: 2026-08-10
- 범위: 이미 승인된 `C4` material role을 위한 정확한 radius,
  elevation/shadow 및 scrim source 후보
- 입력: 승인된 문서 `24`, `26`, `32`, `34`–`51`, 현재 저장소 component
  inventory, 독립적인 유지 관리 design system 출처 14개
- 제외: 최종 component alias, feedback/domain/data color, motion,
  iconography, 최종 NosLog mark drawing, production 구현 및 high-fidelity page suite

이 문서는 neutral, focus, identity 및 filled-primary-action 결정 뒤의 다음 C5
Gate를 시작한다. 근거를 기록하고 온전한 source set 후보를 좁히지만, 여기에 값이
기록되었다는 이유만으로 radius나 shadow 값을 승인하지 않는다.

## 고정 유지하는 지배 결정

1. Adobe Spectrum S2는 계속 유일한 Dark/Light neutral primitive source다.
2. `C1-B`는 `canvas`, `surface`, `sunken`, `raised`, `overlay`, `scrim`을 유지한다.
3. 평면 `canvas`, `surface`, `sunken`에는 기본 shadow를 사용하지 않는다. Shadow는
   타당한 `raised`, `overlay`, dragged 또는 scroll-boundary 관계로 제한한다.
4. `C4`는 이미 `1px` structural border, 제한된 `2px` state 또는 emphasis border,
   shared sub-pixel hairline 금지 및 `R-B` role family인 `radius-control`,
   `radius-container`, `radius-overlay`, `radius-full`을 승인했다.
5. Dark layering은 shadow만으로 전달할 수 없다. 승인된 Spectrum surface 값과
   boundary도 depth cue에 참여한다.
6. Tailwind radius, shadow 및 starter-card styling은 design authority가 아니다.
7. Source가 소유하는 role에는 하나의 source set을 온전히 채택한다. 여러 system의
   값을 섞거나 보간해 새로운 NosLog ramp를 만들 수 없다.

## 비교한 동등 Role

System의 token 번호나 시각 크기가 아니라 목적을 맞춰 비교했다.

| NosLog role         | 찾은 동등 근거                                                    |
| ------------------- | ----------------------------------------------------------------- |
| `radius-control`    | Button, input, select, compact interactive control                |
| `radius-container`  | Card, bounded content group, stable panel                         |
| `radius-overlay`    | Menu, popover, tooltip, sheet, dialog                             |
| `radius-full`       | Avatar, circular control, 명시적으로 pill-shaped인 compact object |
| `elevation-raised`  | 일반 grouping이 아닌 실제 lifted 또는 moving content              |
| `elevation-overlay` | 현재 surface 위의 temporary UI                                    |
| `elevation-dragged` | Source plane 위에서 실제 이동 중인 object                         |
| `scroll-boundary`   | 잘린 scroll content의 directional cue                             |
| `scrim`             | Dialog surface와 분리된 modal background suppression              |

## 14개 출처 비교

| 출처                                                                                                                                                                                                                 | 공개된 Material 구조와 값                                                                                                                                                                   | 전이 가능한 원칙                                                                | NosLog 적합성                                                                                 | 한계                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [Adobe Spectrum S2 layout token](https://opensource.adobe.com/spectrum-design-data/tokens/layout/)                                                                                                                   | Radius alias: small `4px`, medium `8px`, large `10px`, extra-large `16px`, full `0.5`; shadow는 `0px` x와 emphasized `1px/6px`, elevated `2px/8px`, dragged `6px/16px` y/blur geometry 사용 | 작은 semantic alias layer를 정확한 primitive 위에 둘 수 있음                    | 승인된 Spectrum neutral source와 provenance가 이어지고 role set이 절제됨                      | Specimen 전 하나의 공개 source set으로 정확한 shadow color와 scrim mapping을 더 추출해야 함                       |
| [Microsoft Fluent 2 shapes](https://fluent2.microsoft.design/shapes), [elevation](https://fluent2.microsoft.design/elevation)                                                                                        | Radius `0/2/4/8/12px/50%`; 별도 Light/Dark opacity 계산과 key+ambient shadow를 가진 여섯 shadow level                                                                                       | Geometry와 theme-aware shadow 동작이 명시적이고 측정 가능함                     | Control/flyout 구분과 완전한 Dark 동작이 명확함                                               | 여섯 elevation level은 승인된 절제 NosLog material 어휘보다 넓음                                                  |
| [Atlassian radius](https://atlassian.design/foundations/radius/), [elevation](https://atlassian.design/foundations/elevation/)                                                                                       | Radius `2/4/6/8/12/16px/999px`; semantic `sunken/default/raised/overlay/overflow` elevation role                                                                                            | Surface 값과 shadow를 짝지으며 Dark depth가 shadow에만 의존하지 않음            | Role model이 `C1-B`와 거의 같고 `6/8/12px`이 control/container/large overlay 계층을 직접 표현 | 채택 전 정확한 shadow token 값과 blanket/scrim 값을 확보해야 하며 전체 Atlassian component styling은 범위 밖임    |
| [IBM Carbon color 및 layering](https://carbondesignsystem.com/elements/color/usage/)                                                                                                                                 | Contextual layer set이 background, field, border를 짝지으며 문서화된 theme의 overlay token은 black `60%`                                                                                    | 장식적인 card depth보다 layer context가 중요함                                  | 평면적이고 border 중심인 dense data UI의 강한 근거                                            | 필요한 NosLog role 네 개에 대응하는 완전한 shared radius/elevation source set을 동등하게 공개하지 않음            |
| [Material 3 Shapes](https://developer.android.com/reference/kotlin/androidx/compose/material3/Shapes), [elevation guidance](https://developer.android.com/develop/ui/views/theming/shadows-clipping)                 | Extra-small부터 extra-extra-large 및 full까지 넓은 shape scale, Material 3 elevation의 surface color 사용                                                                                   | Shape는 component family를 전달할 수 있고 elevation은 shadow-only가 아니어야 함 | Dark appearance의 surface-color depth 검증에 유용함                                           | 현재 expressive shape 폭과 기본 full button은 절제된 NosLog role set과 충돌함                                     |
| [GitHub Primer size primitive](https://primer.style/product/primitives/size/), [shadow primitive](https://primer.style/product/primitives/color/)                                                                    | Radius small `3px`, medium/default `6px`, large `12px`, full `9999px`; resting과 floating shadow family                                                                                     | Resting과 floating layer를 다른 semantic family로 유지해야 함                   | Compact control geometry와 dense product 근거가 적합함                                        | Floating shadow family가 NosLog 최소 요구보다 시각적·기술적으로 넓음                                              |
| [Shopify Polaris border](https://polaris-react.shopify.com/tokens/border), [shadow](https://polaris-react.shopify.com/tokens/shadow), [depth guidance](https://polaris-react.shopify.com/design/depth/shadow-tokens) | Radius `0/2/4/6/8/12/16/20/30/full`; shadow `0`–`600`, card부터 modal/search까지 component ownership                                                                                        | Component alias는 local shadow를 발명하지 않고 공개 primitive를 선택해야 함     | 정확값 근거와 component ownership이 뛰어남                                                    | Primitive 폭이 `R-B`보다 훨씬 크고 Light admin surface treatment는 NosLog Dark art direction이 아님               |
| [U.S. Web Design System shadow token](https://designsystem.digital.gov/design-tokens/shadow/), [settings](https://designsystem.digital.gov/documentation/settings/)                                                  | Radius 기본 `2px`, `4px`, `8px`; shadow는 `0 1px 4px rgba(0,0,0,.1)`부터 `0 16px 32px rgba(0,0,0,.1)`                                                                                       | 작고 예측 가능한 geometry ramp가 임의값보다 낫다                                | 절제된 radius 값과 public-service 접근성 근거                                                 | Shadow token이 appearance-specific하지 않고 스스로 Dark layering을 해결하지 못함                                  |
| [LINE Design System Global object style](https://designsystem.line.me/LDSG/foundation/object-styles-en/)                                                                                                             | Radius `3/5/7/12px/50%`; white와 light-gray background에 최적화된 별도 shadow set                                                                                                           | Background context가 shadow 선택을 소유해야 함                                  | 동아시아 production과 dense-control 관련성이 높음                                             | 공개 shadow set이 완전한 Dark appearance mapping을 제공하지 않음                                                  |
| [Radix Themes radius](https://www.radix-ui.com/themes/docs/theme/radius), [shadows](https://www.radix-ui.com/themes/docs/theme/shadows)                                                                              | Contextual 6단계 radius와 shadow scale; 작은 overlay는 shadow `4/5`, dialog는 `6` 사용                                                                                                      | Component context가 하나의 radius나 shadow의 무차별 확산을 막을 수 있음         | Radix UI가 stack에 있어 구현 비교에 유용함                                                    | Theme-factor 간접성과 넓은 customization 때문에 잠긴 정확 NosLog source로는 약함                                  |
| [PatternFly token](https://www.patternfly.org/tokens/all-patternfly-tokens/)                                                                                                                                         | Radius `0/4/6/16/24/999px`; small/medium/large 및 directional shadow geometry 분리                                                                                                          | Directional scroll/drawer shadow는 일반 elevation과 다른 role이어야 함          | Professional tool 및 미래 `S6` drawer 근거가 강함                                             | `16px` card와 `24px` modal 기본값이 현재 절제 방향보다 훨씬 둥금                                                  |
| [Ant Design Button token](https://ant.design/components/button/)                                                                                                                                                     | Base `6px`, small `4px`, large `8px`; component token set의 `1px` default line과 `3px` focus line                                                                                           | Control size는 작은 radius family에서 선택할 수 있음                            | Dense multilingual enterprise UI가 관련성 있음                                                | Component 근거가 완전한 raised/overlay/scrim source set을 제공하지 않으며 focus geometry는 승인된 `FI-C`와 충돌함 |
| [GitLab Pajamas border guidance](https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/blob/main/contents/product-foundations/border.md)                                                                 | `1px` border, 제한된 `2px` emphasis, concentric nesting 공식 `outer radius - padding = inner radius`, high-contrast boundary에는 box-shadow보다 border 사용                                 | Border는 절제되고 high-contrast에 견디며 nested geometry 관계가 있어야 함       | 이미 승인된 NosLog border 계약과 anti-boxes 방향을 강화함                                     | Radius 사용 지침이 미완료라 정확 source set이 될 수 없음                                                          |
| [SAP Fiori foundation guidance](https://experience.sap.com/fiori-design-web/explore_category/look-feel-wording/)                                                                                                     | Light, Dark, HCB, HCW theme와 중앙 color, shadow, metric token                                                                                                                              | Material 값에는 완전한 appearance와 high-contrast 동작이 필요함                 | Enterprise 및 접근성 coverage가 강함                                                          | 한 페이지에서 동등하게 직접적인 네 role 정확 radius/shadow mapping을 공개하지 않음                                |

## 수렴과 불일치

### 수렴

1. 일반 grouped content는 평면으로 두며 whitespace 또는 `1px` boundary가 기본
   separator다.
2. Raised와 overlay role은 명시적인 component ownership이 필요하다. Generic
   shadow utility는 유효한 authoring API가 아니다.
3. Dark appearance에서는 shadow뿐 아니라 surface 값이나 boundary가 필요하다.
4. Control radius는 대체로 container/overlay radius 이하이다.
5. Full rounding은 shape contract이지 가장 큰 일반 radius step이 아니다.
6. Scroll-boundary 또는 directional shadow는 resting elevation과 다른 의미다.
7. 목적이 있는 4–6개 role이면 충분하며 큰 ramp는 NosLog 의미를 더하지 않고 임의
   작성자 선택만 늘린다.

### 불일치

- Control radius는 `2px`부터 기본 full-pill까지 분산된다.
- Container radius는 거의 각진 값부터 `16px` 이상까지 분산된다.
- 어떤 system은 한 shadow layer를, 다른 system은 key와 ambient layer 결합을 쓴다.
- 같은 shadow geometry를 appearance 전체에 쓰는 system과 Fluent처럼 Dark 동작을
  명시적으로 바꾸는 system이 갈린다.
- Scrim opacity와 composition은 서로 다르며 radius나 shadow 선택에서 추론할 수 없다.

이 불일치는 실제 NosLog specimen이 필요하다는 뜻이다. 인기나 익숙한 외관만으로
source를 고를 수 없다.

## 정확한 Source-set 추출 진행 상태

### `MG-A` Spectrum S2 — 정확한 후보 Input 완료

공개된 Spectrum token data에서 보간하지 않은 완전한 후보 input을 확보했다.

| 제안 NosLog role    | 정확한 Spectrum alias/value                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `radius-control`    | `corner-radius-small-default` → `4px`                                                                          |
| `radius-container`  | `corner-radius-medium-default` → `8px`                                                                         |
| `radius-overlay`    | `corner-radius-large-default` → `10px`                                                                         |
| `radius-full`       | `corner-radius-full` → 해당 box의 `0.5`                                                                        |
| `elevation-raised`  | `drop-shadow-emphasized`: `0 2px 8px` ambient + `0 1px 4px` transition + `0 0 1px` key                         |
| `elevation-overlay` | `drop-shadow-elevated`: `0 4px 12px` ambient + `0 2px 6px` transition + `0 0 2px` key                          |
| `elevation-dragged` | `drop-shadow-dragged`: `0 12px 16px` ambient + `0 6px 8px` transition + `0 0 6px` key                          |
| Shadow color        | Ambient Light/Dark `rgba(0,0,0,.08/.24)`, transition `.04/.12`, key는 공개된 semantic level에 따라 정확히 증가 |
| `scrim`             | `overlay-color` black + `overlay-opacity` Light `0.4`, Dark `0.6`                                              |

이는 공개된 Spectrum semantic alias를 이미 승인된 NosLog role에 연결한 후보
mapping이다. 어떤 token 값도 바꾸지 않으며 Spectrum component styling을 채택하지
않는다. 시각 승인은 계속 대기 상태다.

### `MG-B` Fluent 2 — Primitive 완료, Role subset 대기

- Radius input은 정확히 `0/2/4/8/12px/50%`다.
- Light low elevation은 key와 ambient opacity `14%`, Dark는 key `28%`와 ambient
  `14%`를 사용한다.
- High elevation은 서로 다른 Light/Dark secondary-blur 계산을 가진 공개 `28`, `64`
  level을 사용한다.
- `colorBackgroundOverlay`는 Light black alpha `40`, Dark black alpha `50`이다.
- Fluent는 component 예시가 다른 여섯 elevation level을 공개한다. 통제된 NosLog
  후보에는 근거가 있는 semantic subset이 더 필요하다. 외관 선호로 level을 고르면
  local hybrid가 된다.

### `MG-C` Atlassian — Role과 Radius 완료, 정확한 Effect 값 대기

- 정확한 radius role은 interactive `6px`, containment/floating UI `8px`, large
  container/modal `12px`, full `999px`이다.
- 정확한 semantic role은 `surface`, `sunken`, `raised`, `overlay`, `overflow`이며
  dragged item은 overlay elevation을 사용한다.
- 공식 현재 token artifact에서 해석한 정확한 Light/Dark `elevation.shadow.*` 및
  `color.blanket` 값은 아직 확보해야 한다. Legacy fallback 값은 현재 권위로 쓰지 않는다.

## Source-set 추출 Finalist

다음은 조사 finalist이며 승인 후보가 아니다.

### `MG-A` — Adobe Spectrum S2 material set

- 공개된 Spectrum radius alias와 shadow geometry를 정확히 보존한다.
- 장점: 승인된 Spectrum neutral primitive와 함께 provenance가 가장 단순하고
  unsourced hybrid 위험이 가장 작다.
- 정확한 radius, semantic shadow 세 개, appearance별 shadow color 및 scrim을
  추출했다. 남은 Gate는 통제된 NosLog rendering이다.

### `MG-B` — Microsoft Fluent 2 material set

- Fluent의 정확한 radius와 Light/Dark key-plus-ambient elevation set을 보존한다.
- 장점: 비교 중 appearance-specific shadow 계산이 가장 명확하다.
- 위험: 여섯 단계 elevation ramp는 공개된 semantic alias나 문서화된 subset으로만
  줄일 수 있다. NosLog가 새로운 혼합을 발명할 수 없다.

### `MG-C` — Atlassian material set

- Atlassian radius, surface/elevation pairing, overflow 및 blanket mapping을 하나의
  set으로 보존한다.
- 장점: `sunken/default/raised/overlay/overflow` 의미가 승인된 NosLog role
  inventory와 가장 직접적으로 맞는다.
- 차단 추출 항목: 정확한 현재 Light/Dark shadow 값과 blanket 값.

차단 값을 추출하고 같은 NosLog content로 온전한 후보 세 개를 렌더링하기 전에는
어떤 추천도 확정하지 않는다.

## 필수 시각 비교 Gate

다음 specimen은 typography, spacing, 승인된 Spectrum surface와 foreground,
boundary mapping, `FI-C` focus, content, layout을 고정한다. 후보가 소유한 radius,
shadow, scrim mapping만 바꿀 수 있다.

필수 scene:

1. 평면 discovery/ranking row와 타당한 raised movable item 하나;
2. Light/Dark 승인 surface 위 menu/popover 및 dialog;
3. Sticky/scroll boundary가 있는 `S4` viewer 또는 `S6` editor sunken well;
4. 비동심 또는 과도한 rounding을 탐지할 container 안 nested control;
5. Keyboard focus containment와 forced colors의 non-shadow boundary를 가진 modal scrim;
6. 한국어, 일본어, 영어 content의 `320`, `390`, intermediate, desktop 폭;
7. default, hover, pressed, focus-visible, dragged, disabled 및 overlay open/closed state.

측정에는 computed value, clipping, overflow, scroll-boundary 방향, focus perimeter,
Dark layer 구분성, `200%` zoom 및 active forced-colors 동작이 포함되어야 한다.
Specimen은 일반 control을 재착색하거나 Dark-theme white outline을 다시 넣거나
Tailwind radius/shadow 기본값을 사용하면 안 된다.

## 결정 로그

| ID       | 결정                                                                                    | 상태                                                        |
| -------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `MGR-01` | 독립적으로 유지 관리되는 system 14개의 동등 material role 비교                          | `Research complete — 2026-08-10`                            |
| `MGR-02` | 승인된 `C1-B`, `C4`, Spectrum neutral, `FI-C`, `ITA-C`, `RPA-A` 계약 보존               | `Required`                                                  |
| `MGR-03` | Tailwind radius/shadow 및 starter-card styling을 design authority 밖에 유지             | `Required`                                                  |
| `MGR-04` | 완전한 source-set 추출 대상으로 `MG-A`, `MG-B`, `MG-C` shortlist                        | `Proposed`                                                  |
| `MGR-05` | 한 system의 radius를 다른 system의 shadow 또는 scrim과 혼합                             | `Provenance 계약에 의해 Rejected`                           |
| `MGR-06` | 모든 finalist의 정확한 현재 shadow color/composition, scrim 및 component ownership 추출 | `MG-A 완료; MG-B primitive set 완료; MG-C 정확 effect 대기` |
| `MGR-07` | 통제된 NosLog material-geometry 비교 제작                                               | `MGR-06 대기`                                               |
| `MGR-08` | 정확한 material source 및 component alias 승인                                          | `시각 검증 뒤 사용자 결정 대기`                             |
