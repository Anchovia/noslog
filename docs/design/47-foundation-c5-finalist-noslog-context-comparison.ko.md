# NosLog 2.0 C5 최종 후보 실제 콘텐츠 비교

## 문서 관리

- 상태: `SS-08 Radix Colors Indigo를 NosLog identity source로 승인; 비교 근거 보존;
identity touchpoint 및 action alias 대기`
- 기준 언어: 영문
- 영문 원문:
  [47-foundation-c5-finalist-noslog-context-comparison.md](./47-foundation-c5-finalist-noslog-context-comparison.md)
- 날짜: 2026-08-10
- 범위: `SS-08` Radix Colors Indigo, `SS-09` Shopify Polaris와 실험 후보
  `EXP-01` Polaris Light / Radix Dark를 동일한 대표 NosLog 콘텐츠, 승인된 neutral
  Foundation, domain collision evidence, 수정하지 않은 공개 appearance 값으로 비교
- interactive artifact:
  [C5 최종 후보 NosLog 콘텐츠 비교](./specimens/c5-finalist-noslog-context-comparison.html)
- 입력: 문서 `25`, `27`–`46`, 검증된 structural specimen, 현재 monochrome N mark,
  저장소의 공개 jacket asset
- 제외: 승인된 action 또는 identity component alias, 재착색 logo, 최종 page design,
  application 구현

사용자는 2026-08-10 두 온전한 source를 실제 콘텐츠 실측 비교로 진행한 뒤,
`Polaris Light + Radix Dark`를 세 번째 실험 후보로 측정하도록 허가했다. 이 승인은
single-source 규칙을 측정 목적으로만 다시 열며, 그 규칙의 최종 변경, 어떤 mapping,
또는 action을 승인하지 않는다.

사용자는 세 후보를 검토한 뒤 2026-08-10 온전한 `SS-08` Radix Colors Indigo
Light/Dark mapping을 NosLog identity source로 선택했다. Polaris와 `EXP-01`은 비교
근거로 보존하지만 선택하지 않았다. 이 결정은 filled-action alias를 승인하지 않는다.

## 정확한 최종 후보 계약

| Source                         | Light default / hover / pressed   | Light foreground | Dark default / hover / pressed    | Dark foreground | 기본 foreground 대비  |
| ------------------------------ | --------------------------------- | ---------------- | --------------------------------- | --------------- | --------------------- |
| `SS-08` Radix Colors Indigo    | `#3E63DD` / `#3358D4` / `#3358D4` | `#FFFFFF`        | `#3E63DD` / `#5472E4` / `#5472E4` | `#FFFFFF`       | `5.21:1` / `5.21:1`   |
| `SS-09` Shopify Polaris        | `#303030` / `#1A1A1A` / `#1A1A1A` | `#FFFFFF`        | `#FFFFFF` / `#F3F3F3` / `#F7F7F7` | `#303030`       | `13.20:1` / `13.20:1` |
| `EXP-01` NosLog adaptive split | `#303030` / `#1A1A1A` / `#1A1A1A` | `#FFFFFF`        | `#3E63DD` / `#5472E4` / `#5472E4` | `#FFFFFF`       | `13.20:1` / `5.21:1`  |

처음 두 후보는 각 source의 온전한 Light/Dark 쌍을 유지한다. `EXP-01`만 Polaris
Light와 Radix Dark의 공개값을 수정 없이 연결한다. 이 후보는 어느 upstream system의
채택으로 표현하지 않으며 Tailwind 대입, 단계 보간, hue 이동 또는 NosLog식 보정을
포함하지 않는다.

## 고정 비교 불변 조건

1. Adobe Spectrum S2 `M-A`는 독점 neutral source로 유지된다. Light는
   `canvas #FFFFFF`, `surface #F8F8F8`, `sunken #E9E9E9`, `raised #FFFFFF`,
   Dark는 `canvas #111111`, `surface #1B1B1B`, `sunken #111111`,
   `raised #222222`다.
2. 승인된 `F-A`, `NB-A`, `NI-A` foreground, boundary, neutral interaction mapping은
   변하지 않는다.
3. Fluent `FI-C`는 Light 검정 / Dark 흰색, `2px`, zero-gap, `inset: -2px`,
   forced-colors `Highlight` override로 유지된다.
4. layout, typography, copy, jacket asset, content density, 모든 일반 interaction은
   세 후보에서 동일하다.
5. 후보색은 안정적인 identity rail과, 해당 context에 있을 때 명시적으로 표시된
   rare-action 후보 최대 하나에만 나타난다.
6. 일반 link, search, filter, selection, pagination, navigation, difficulty, mode,
   hand, score, feedback, external-brand, visualization role은 후보와 분리한다.
7. `FCM-11`, `SIG-07`은 계속 Rejected이며 표현하지 않는다.

## 대표 실제 콘텐츠

| Context         | 저장소 근거 콘텐츠                                                                                                    | 검증 질문                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Home            | NosLog archive tagline, 승인된 destination 8개, 현재 design-guide 및 운영 공지, 기록 동기화 action                    | destination grid를 재착색하지 않아도 작은 identity cue가 인지되는지, action 상대 강조도 |
| Music discovery | `Altale`, `削除`, 실제 jacket, `Lachryma《Re:Queen’M》 (BEMANI SYMPHONY NOSTALGIA mix)`, 긴 artist, difficulty 값 4개 | jacket 우선순위, 긴 한/일/영 reflow, 일반 search/list control의 neutral 유지            |
| Music detail    | `Altale`, 실제 jacket, Real Lv 2, BPM `90`, note `1,604`, best score `976,654`, `S · FC`, `Grd 112`                   | 조밀한 기록 데이터와 기존 Real, Discord, Basic, Recital hue ownership 인접성            |
| Global rankings | player `1,034`명, 개인 순위 `286`, 대표 한/일/영 player name, 공식 Grd 값                                             | 조밀한 비교 가독성과 개인 위치 action 하나의 상대 강조도                                |
| Chart viewer    | `교향곡 제9번 호단조 작품 95 ‘신세계로부터’`, Real Lv 2, `28 lanes`, BPM `90`, left/right note color                  | 후보 강조가 chart의 domain-critical cyan/coral hand encoding과 경쟁하는지               |

fixture 콘텐츠는 승인된 structural-validation artifact에서 가져왔으며 새 page brief나
최종 layout 제안이 아니다.

## 측정 대비 및 충돌 근거

| Pair                                         |                 비율 | 해석                                                                                    |
| -------------------------------------------- | -------------------: | --------------------------------------------------------------------------------------- |
| Radix default / white foreground             |             `5.21:1` | 비교 fill pair에서 일반 텍스트 AA 통과                                                  |
| Radix default / Dark canvas `#111111`        |             `3.63:1` | Dark 구성에서 가장 밝은 물체가 되지 않으면서 보이는 chromatic anchor                    |
| Polaris Light default / white foreground     |            `13.20:1` | 매우 강한 Light action 대비                                                             |
| Polaris Dark default / Dark canvas `#111111` |            `18.88:1` | 흰색 Dark fill은 조용한 gray treatment가 아니라 specimen에서 가장 강한 action treatment |
| `EXP-01` Light / Dark foreground pair        | `13.20:1` / `5.21:1` | 새 값을 만들지 않고 각 source의 검증된 foreground pair를 appearance별로 사용            |
| Radix / Discord migration evidence           |             `1.13:1` | color contrast만으로 인접 ownership을 분리할 수 없음                                    |
| Radix / Real migration evidence              |             `1.46:1` | 인접하면 role, placement, label, shape, area 분리가 필요                                |
| Radix / Basic migration evidence             |             `1.84:1` | 인접하면 비색상 분리가 필요                                                             |
| Radix / Recital migration evidence           |             `1.99:1` | 인접하면 비색상 분리가 필요                                                             |

네 domain 비교는 WCAG failure가 아니라 collision diagnostic이다. 후보와 domain
색은 인접 state boundary로 승인되지 않았고 hue만으로 구분해서는 안 된다. 낮은
비율은 Radix가 difficulty, mode, external-brand, visualization role로 퍼질 수 없음을
확인한다.

## 관찰된 비교

### Identity

- Radix는 두 appearance에서 보이는 안정적인 chromatic rail을 만든다. Jacket과 data
  surface를 neutral로 두면서 monochrome N mark에 service-owned anchor를 제공한다.
- Polaris는 완전한 achromatic shell을 유지한다. Rail이 현재 monochrome mark와
  맞지만 추가 인지는 거의 제공하지 않으므로 typography, spacing, placement, mark가
  identity를 담당해야 한다.
- `EXP-01`은 Light에서 Polaris의 achromatic shell을, Dark에서 Radix의 chromatic
  anchor를 만든다. 각 appearance 안에서는 절제되지만 theme 전환 시 기억되는 색상
  identity가 바뀐다.
- 세 후보 모두 승인된 절제 사용 경계 아래에서 signature cue보다 콘텐츠를 더
  두드러지게 유지한다.

### Rare action 후보

- Radix는 두 appearance에서 명확하지만 제한된 primary 강조를 만든다.
- Polaris가 자동으로 더 조용한 것은 아니다. 공개된 Dark brand fill이 `#111111`
  위 흰색이므로 action은 Radix보다 훨씬 강하게 보인다.
- `EXP-01`은 Light에서 Polaris의 강한 charcoal action, Dark에서 Radix의 더 낮은
  luminance chromatic action을 사용해 Polaris Dark의 흰색 fill 문제를 피한다. 대신
  같은 semantic action이 appearance에 따라 achromatic과 indigo 사이를 이동한다.
- 따라서 source 선택과 action eligibility는 분리해야 한다. 사용자는 Polaris를
  identity로 진행하면서 흰색 Dark filled action은 거부하고 action을 neutral로 둘 수
  있다. Radix에도 같은 별도 gate를 적용한다.

### Domain 및 콘텐츠 공존

- 실제 jacket은 세 후보 모두에서 가장 강한 content color로 유지된다.
- Radix는 Discord, Real, Basic evidence와 지각적으로 가깝다. 제한된 면적과 semantic
  placement 덕분에 specimen은 읽을 수 있지만 넓게 쓰면 승인된 color budget을
  위반한다.
- Polaris는 hue collision이 가장 적지만 filled Dark action은 hue가 아니라 luminance로
  chart와 조밀한 기록 계층에 경쟁할 수 있다.
- `EXP-01`은 Light에서 hue collision을 줄이고 Dark에서 흰색 fill 경쟁을 줄이지만,
  Dark에서는 Radix와 domain evidence 사이의 기존 collision 비용을 그대로 가진다.
- 세 후보 모두 renderer나 hand legend에 들어가지 않아 left/right chart note는 읽을
  수 있다.

### Appearance 연속성

- 동일한 identity rail 위치, mark, label, action hierarchy와 non-color cue는 두
  appearance에서 유지된다.
- `EXP-01`의 color family 변경은 기술적 theme parity를 깨지 않지만, 사용자가
  NosLog를 하나의 색으로 기억해야 한다면 full-source 두 후보보다 연속성이 약하다.
- 따라서 이 실험의 핵심 선택은 “색이 바뀌어도 appearance별 최적 절제를 우선할지”와
  “하나의 Light/Dark color identity를 우선할지” 사이에 있다.

## 브라우저 검증 — 2026-08-10

| 대상          | 결과                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| context 5개   | 세 후보가 Home, discovery, detail, rankings, chart viewer에서 동일한 콘텐츠를 표시하며 각 visible context에는 후보색 filled action이 0개 또는 1개다. |
| Light/Dark    | 두 intact 후보는 각 source 쌍을 유지하고 `EXP-01`만 정확한 Polaris Light / Radix Dark 값으로 전환된다.                                               |
| `1440 × 1000` | `454px` 후보 3열과 `452px` frame이 가로 overflow, 누락 image, console warning, console error 없이 표시된다.                                          |
| `390 × 900`   | 후보가 `359px` 1열로 쌓이고 세 frame은 `357px`, 모든 image와 보이는 최소 `44px` control이 유지된다.                                                  |
| `320 × 900`   | 후보가 `289px` 1열, frame이 `287px`로 쌓이며 가로 overflow 없이 정확값과 긴 콘텐츠가 container 안에서 reflow한다.                                    |
| Focus         | Native keyboard focus가 승인된 `2px` zero-gap pseudo-boundary를 `inset: -2px`에 만들며 Light는 검정, Dark는 흰색이다.                                |

## 선택 결과와 남은 gate들

1. **Identity source — Approved:** 온전한 `SS-08` Radix Colors Indigo. 정확한 공개
   Light/Dark mapping을 분리할 수 없는 하나의 source set으로 유지한다.
2. **Alternatives — Not selected:** Shopify Polaris와 `EXP-01`. 근거는 보존하며 승인
   source가 이후 실측 요구에서 실패할 때만 다시 열 수 있다.
3. **Identity touchpoint alias — Pending:** 문서 `48`은 Indigo mark, Indigo mark
   field 또는 achromatic control 중 무엇을 visual comparison으로 진행할지 별도로
   조사한다. 이 specimen의 identity rail은 승인되지 않았다.
4. **Rare action eligibility — Pending:** 정확한 Radix filled-action mapping을 입증된
   드문 primary action에 사용할지, action을 neutral로 유지할지 별도 결정한다.

이 선택은 `SC-B` single-source 계약을 보존한다. 일반 link, filter, selected
container, domain value, focus 또는 monochrome N mark 재착색을 허가하지 않는다.

## 결정 로그

| ID       | 항목                                                                            | 상태                                           |
| -------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| `FNC-01` | `SS-08`, `SS-09`를 동일한 실제 콘텐츠 비교로 진행한다.                          | `Approved comparison scope — 2026-08-10`       |
| `FNC-02` | 정확한 source mapping과 승인된 고정 C5 neutral/focus 계약을 보존한다.           | `Required`                                     |
| `FNC-03` | 대표 NosLog context 5개를 desktop, 대표 mobile, `320 CSS px`에서 검증한다.      | `Completed — 2026-08-10`                       |
| `FNC-04` | 후보 identity와 filled-action eligibility를 별도 approval gate로 취급한다.      | `Required`                                     |
| `FNC-05` | Radix Indigo를 NosLog identity source로 선택한다.                               | `Approved — 2026-08-10`                        |
| `FNC-06` | Shopify Polaris를 NosLog achromatic identity source로 선택한다.                 | `Not selected — 2026-08-10; evidence retained` |
| `FNC-07` | 어느 source든 filled mapping을 rare primary action에 사용하도록 승인한다.       | `Pending; identity 선택에서 추론하지 않음`     |
| `FNC-08` | 정확한 Polaris Light / Radix Dark 값을 `EXP-01`로 실측 비교한다.                | `Approved comparison scope — 2026-08-10`       |
| `FNC-09` | `EXP-01`을 NosLog-owned adaptive signature mapping으로 선택한다.                | `Not selected — 2026-08-10; evidence retained` |
| `FNC-10` | Identity rail을 비교 구조로 취급하고 문서 `48`에서 component-alias 조사를 연다. | `Research opened; alias pending user approval` |

## 출처

- [Radix Colors scale 사용](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- [Radix Colors scales](https://www.radix-ui.com/colors/docs/palette-composition/scales)
- [Shopify Polaris color tokens](https://polaris-react.shopify.com/tokens/color)
- [C5 정확한 system 비교](./45-foundation-c5-signature-system-reference-comparison.ko.md)
- [C5 정보 서비스 컬러 확장](./46-foundation-c5-information-service-color-expansion.ko.md)
- [C5 identity touchpoint alias 조사](./48-foundation-c5-identity-touchpoint-alias-research.ko.md)
