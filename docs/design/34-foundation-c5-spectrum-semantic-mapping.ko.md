# NosLog 2.0 C5 Spectrum S2 Semantic Mapping

## 문서 관리

- 상태: `M-A surface, F-A foreground, NB-A neutral boundary 승인; 문서 39 기술
검증 뒤 C5M-05 종료; interaction과 focus는 열린 상태`
- Surface-mapping 승인일: 2026-08-08
- Foreground-mapping 승인일: 2026-08-09
- Neutral-boundary 승인일: 2026-08-09
- 정본 언어: 영어
- 영어 정본:
  [34-foundation-c5-spectrum-semantic-mapping.md](./34-foundation-c5-spectrum-semantic-mapping.md)
- 시작일: 2026-08-08
- 범위: 승인된 Spectrum S2 grayscale primitive source를 승인된 NosLog C1-B neutral
  surface role 및 neutral foreground, boundary, 일반 interaction 후보 role에 매핑
- 입력: 승인된 문서 `25`, `32`, `33`, 현재 Spectrum S2 token data, WCAG 2.2 및
  앞서 검토한 동일 role palette 비교
- 제외: 일반 interaction container, focus,
  signature/feedback/domain 또는 data visualization 색조 승인, radius와 shadow
  치수, component styling, high-fidelity 화면, 애플리케이션 구현

이 문서는 `FCM-12`를 다시 열지 않는다. Adobe Spectrum S2는 계속 승인된 정확한
Dark/Light neutral primitive source다. `C5M-03`은 현재 Spectrum S2 alias를 통해 승인된
C1-B surface role을 배정하고 `C5M-04`는 승인된 exact `F-A` foreground mapping을,
`C5M-05`는 승인된 exact `NB-A` neutral boundary를 배정한다. 일반
interaction-container, focus 및 component-level validation은 계속 열려 있다.

## 관련 문서

- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation 컬러 및 material 후보](./32-foundation-color-material-candidates.ko.md)
- [시그니처 컬러 조사](./33-foundation-signature-color-research.ko.md)
- [C5 Spectrum surface 검증](./35-foundation-c5-spectrum-surface-validation.ko.md)
- [C5 neutral foreground 레퍼런스 비교](./36-foundation-c5-neutral-foreground-reference-comparison.ko.md)
- [C5 foreground specimen 검증](./37-foundation-c5-foreground-specimen-validation.ko.md)

## 집중 근거

문서 `32`의 열일곱 source 구조 매트릭스와 열 개 system neutral-source 검토는 계속
권위가 있다. 이번 집중 검토는 이미 승인된 source family 안에서 mapping을 해결하기
위해 현재 Adobe 1차 자료를 사용한다.

| 출처                                                                                                 | 전이 가능한 근거                                                                                                        | NosLog 적용                                                   | 한계                                                                         |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Spectrum S2 color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/) | background base, layer, elevated surface, pasteboard, content, disabled, overlay, state alias의 현재 Light/Dark 해석 값 | Spectrum S2 semantic fidelity라고 부르는 mapping의 1차 권위   | Spectrum role name은 승인된 NosLog C1-B 공간 목록과 정확히 같지 않음         |
| [Spectrum S2 color palette](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/) | 승인된 정확한 gray primitive 값                                                                                         | 로컬 hex 수정이나 대체를 방지                                 | raw scale만으로는 semantic ownership을 배정할 수 없음                        |
| [Spectrum using color](https://spectrum.adobe.com/page/using-color/)                                 | background layer는 큰 app-framing 영역이며 custom color나 transparency 대신 불투명 token 사용                           | layer 목적, 불투명 surface, 로컬 합성 gray 금지를 지배        | 일부 공개 layer 예시는 더 넓은 Spectrum 모델을 설명하며 현재 S2 alias와 다름 |
| [Spectrum color system](https://spectrum.adobe.com/page/color-system/)                               | background, decorative border, field/control border, text, icon, disabled content가 의도적으로 분리된 gray 범위를 사용  | foreground와 boundary 책임 분리를 뒷받침                      | Spectrum 원칙 설명이며 NosLog component 요구는 아님                          |
| [Spectrum Web Components styles](https://opensource.adobe.com/spectrum-web-components/tools/styles/) | Spectrum 2는 별도 `tokens-v2` Light/Dark file과 안정적인 semantic custom-property name을 사용                           | appearance별 값을 가진 invariant semantic authorship를 확인   | SWC 구현과 component geometry는 채택하지 않음                                |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                            | 일반 text `4.5:1`, 필수 단서인 의미 있는 component/graphic boundary `3:1` 요구                                          | 실제 foreground/background 및 control-boundary pair 인수 기준 | palette나 material hierarchy를 선택하지 않음                                 |

### C5와 관련된 현재 Spectrum S2 alias

| Spectrum S2 alias                         | Light                  | Dark                   | 공개된 의도                          |
| ----------------------------------------- | ---------------------- | ---------------------- | ------------------------------------ |
| `background-base-color`                   | `gray-25` · `#ffffff`  | `gray-25` · `#111111`  | 기본 background base                 |
| `background-layer-1-color`                | `gray-50` · `#f8f8f8`  | `gray-50` · `#1b1b1b`  | 첫 app-framing layer                 |
| `background-layer-2-color`                | `#ffffff`              | `gray-75` · `#222222`  | 두 번째 app-framing layer            |
| `background-elevated-color`               | `#ffffff`              | `#222222`              | elevated surface                     |
| `background-pasteboard-color`             | `gray-100` · `#e9e9e9` | `gray-25` · `#111111`  | 안쪽으로 물러나는 전문 editing area  |
| `overlay-color` + `overlay-opacity`       | black `0.4`            | black `0.6`            | modal/background suppression         |
| `neutral-content-color-default`           | `gray-800` · `#292929` | `gray-800` · `#dbdbdb` | 기본 neutral content                 |
| `neutral-subdued-content-color-default`   | `gray-700` · `#505050` | `gray-700` · `#afafaf` | subdued neutral content              |
| `neutral-content-color-hover/down`        | `gray-900` · `#131313` | `gray-900` · `#f2f2f2` | 더 강조된 interactive content state  |
| `disabled-background-color`               | `gray-100` · `#e9e9e9` | `gray-100` · `#2c2c2c` | disabled component background        |
| `disabled-border-color`                   | `gray-300` · `#dadada` | `gray-300` · `#393939` | disabled boundary                    |
| `disabled-content-color`                  | `gray-400` · `#c6c6c6` | `gray-400` · `#444444` | disabled nonessential content        |
| `neutral-subtle-background-color-default` | `gray-100` · `#e9e9e9` | `gray-300` · `#393939` | 낮은 강조의 neutral state background |

## 이전 비교에 대한 중요한 정정

`FCM-12`로 이어진 비교는 정확한 Spectrum S2 gray primitive를 사용했지만 role 배정은
명시적인 임시안이었다.

- Light는 `gray-50`을 `canvas`, `gray-25`를 `surface`로 사용했다.
- Dark는 `gray-25`를 `canvas`, `gray-50`을 `surface`, `gray-100`을 가장 높은
  overlay 단계로 사용했다.

그 specimen은 Spectrum source ramp에 대한 선호를 확립하는 유효한 근거였다. 현재
Spectrum S2 semantic alias를 정확히 보여준 것은 아니다. 임시 mapping까지 이미
승인됐다고 처리하면 `FCM-12`에 기록된 approval gate가 사라진다.

## Surface Mapping 대안

### `M-A` — 현재 Spectrum S2 alias 충실안

| NosLog role | Spectrum source                     | Light     | Dark      | 사용 경계                                                                             |
| ----------- | ----------------------------------- | --------- | --------- | ------------------------------------------------------------------------------------- |
| `canvas`    | `background-base-color`             | `#ffffff` | `#111111` | page와 shell 기준면                                                                   |
| `surface`   | `background-layer-1-color`          | `#f8f8f8` | `#1b1b1b` | flat grouped content이며 일반 card는 raised가 되지 않음                               |
| `sunken`    | `background-pasteboard-color`       | `#e9e9e9` | `#111111` | 의도적으로 안쪽으로 물러나는 viewer/editor/data well                                  |
| `raised`    | `background-elevated-color`         | `#ffffff` | `#222222` | 실제 lift, movement, overlap 또는 별도 정당화된 강조가 있는 content                   |
| `overlay`   | elevated surface + overlay boundary | `#ffffff` | `#222222` | menu, popover, tooltip, sheet, dialog이며 fill만으로 최상단 stacking을 표현할 수 없음 |
| `scrim`     | black `overlay-color`               | `40%`     | `60%`     | modality/background suppression 전용                                                  |

장점:

- 정확한 source 값과 현재 Spectrum S2 semantic alias를 모두 보존한다.
- neutral을 새로 만들지 않고 승인된 C1-B 공간 role을 모두 제공한다.
- Dark depth는 단조롭게 상승하며 Light hierarchy는 자의적인 tinted card가 아니라
  framing, boundary, 정당화된 shadow에 의존한다.
- 향후 구현에 가장 안정적인 upstream provenance를 제공한다.

위험과 제약:

- Light `canvas`는 흰색이고 일반 `surface`는 `#f8f8f8`로, 이전 비교 specimen과
  반대다.
- 인접 surface 대비는 의도적으로 미묘하므로 필수 grouping이나 state의 유일한 단서가
  될 수 없다.
- `raised`와 `overlay`는 같은 fill을 사용하므로 overlay에는 boundary, stacking,
  placement 및 이후 승인할 shadow 계약이 필요하다.

### `M-B` — 이전 비교 specimen 연속안

| NosLog role | Light       | Dark        |
| ----------- | ----------- | ----------- |
| `canvas`    | `#f8f8f8`   | `#111111`   |
| `surface`   | `#ffffff`   | `#1b1b1b`   |
| `sunken`    | `#f3f3f3`   | `#111111`   |
| `raised`    | `#ffffff`   | `#222222`   |
| `overlay`   | `#ffffff`   | `#2c2c2c`   |
| `scrim`     | black `40%` | black `60%` |

장점:

- source 선택 때 사용자가 선호한 시각 관계와 일치한다.
- off-white page 위에 일반 Light surface를 흰색으로 두고 Dark overlay에는 값 한
  단계를 더 준다.

위험과 제약:

- 승인된 Spectrum primitive만 사용하지만 현재 Spectrum S2 semantic alias는
  보존하지 않는다.
- real content가 이탈 필요성을 입증하기 전에 NosLog 전용 Light role 반전과 Dark
  overlay 단계를 도입한다.
- 안정적인 저명 레퍼런스를 채택하려는 결정 동기에 대해 upstream provenance가
  약하다.

**승인된 결정:** C5-2에 `M-A`를 사용한다. `M-B`는 과거 비교 근거로만 유지하며 C5
surface mapping으로는 기각한다. `M-A`가 실제 NosLog content에서 실패하면 문서화된
이탈을 검토하기 전에 측정된 실패를 보고한다.

## 대체된 조사 전 Foreground 가설

원래 여기에 기록된 foreground 표는 필수 broad comparison보다 먼저 작성되었다. 이제
문서 `36`이 현재 조사 기록으로 이를 대체한다. 두 가지 수정이 중요하다.

1. Spectrum `gray-900`은 generic heading 또는 global emphasis color가 아니라 default
   interactive content의 hover/down/focus에 공개된 값이다.
2. Spectrum subdued interactive content는 hover/down/selected에서 `gray-700`에서
   `gray-800`으로 강해진다. 이 state relationship을 그대로 유지해야 한다.

문서 `36`은 처음에 dedicated foreground specimen을 위한 exact Spectrum alias mapping
`F-A`를 제안했다. 문서 `37`의 측정 specimen 뒤 사용자가 2026-08-08에 그 visual
direction을 승인했다. 실제 200% zoom 및 active forced-colors gate는 2026-08-09에 측정된
실패 없이 완료됐다. 이어서 사용자가 2026-08-09에 exact `F-A`를 최종 C5 foreground
mapping으로 승인해 `C5M-04`를 종료했다. `gray-600`은 Light `sunken`에서 `4.02:1`에
불과하고 현재 Spectrum content alias도 그 ownership을 주지 않으므로 universal tertiary
text에 계속 부적합하다.

## 승인된 Neutral Boundary Mapping

| NosLog role      | Spectrum primitive | Light     | Dark      | 계약                                                                                                 |
| ---------------- | ------------------ | --------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `divider`        | `gray-200`         | `#e1e1e1` | `#323232` | decorative rhythm 전용이며 spacing, heading 또는 structure가 이미 관계를 표현한다                    |
| `border-subtle`  | `gray-300`         | `#dadada` | `#393939` | 비필수 framing과 공개 disabled-border 값이다. 값이 같아도 semantic alias는 분리한다                  |
| `border-default` | `gray-400`         | `#c6c6c6` | `#444444` | label, fill, shape, placement 또는 다른 충분한 cue가 이미 식별하는 ordinary field/container에만 쓴다 |
| `border-strong`  | `gray-600`         | `#717171` | `#8a8a8a` | 승인된 모든 surface에서 식별되어야 하는 필수 neutral control/graphic boundary다                      |

앞의 세 role은 일부 인접 surface에서 의도적으로 `3:1`보다 낮다. 필수 control,
selected state 또는 의미 있는 graphic의 유일한 단서가 될 수 없다. `border-strong`은
승인된 모든 M-A surface에서 `3:1`보다 높고 측정된 최솟값은 Light `4.02:1`, Dark
`4.61:1`이다.

이 승인된 mapping은 active forced-colors test에서 관찰된 흰색 system outline을 일반 Dark-theme
styling으로 상속하지 않는다. 해당 outline은 browser/user accessibility override다. 일반
theme boundary 값은 문서 `38` 비교와 문서 `39` specimen 뒤 승인됐으며 focus는 별도의
후속 결정이다.

## 제안된 일반 Neutral Interaction Mapping

1. 일반 interaction의 기본값은 transparent이거나 neutral surface를 상속한다.
   colored/filled container는 기본 affordance가 아니다.
2. 낮은 강조의 hover/down fill은 Spectrum의
   `neutral-subtle-background-color-default`, 즉 Light `gray-100` (`#e9e9e9`)과
   Dark `gray-300` (`#393939`)를 사용할 수 있다. component별 검증이 필요하며 label,
   geometry, cursor 또는 state semantics를 대체할 수 없다.
3. selection에는 universal fill token이 없다. neutral을 유지하고 checkmark, border
   weight, type weight, position 또는 structure를 사용한다. component별 subtle fill은
   별도 근거가 필요하다.
4. disabled background, border, content는 공식 disabled alias를 사용할 수 있지만
   disabled content는 secondary copy가 아니며 필수 정보를 담을 수 없다.
5. focus는 이 mapping 범위 밖이다. Spectrum의 blue focus alias는 상속하지 않는다.
   NosLog focus는 승인된 C2-B와 이후 측정 결정으로 독립 지배한다.

## `M-A` 측정 대비 요약

정확한 sRGB pair를 `canvas`, `surface`, `sunken`, `raised`, `overlay` 전체에서
계산했다.

| Token 사용               | Light 최솟값 | Dark 최솟값 | 해석                                                                |
| ------------------------ | -----------: | ----------: | ------------------------------------------------------------------- |
| `gray-900` emphasis      |      `15.30` |     `14.21` | 강한 content 대비                                                   |
| `gray-800` primary       |      `11.98` |     `11.49` | 강한 기본 content 대비                                              |
| `gray-700` secondary     |       `6.64` |      `7.25` | 모든 M-A surface에서 일반 text 기준 통과                            |
| `gray-600`               |       `4.02` |      `4.61` | universal 일반 text는 아니며 측정된 strong non-text boundary에 적합 |
| `gray-400` disabled      |       `1.41` |      `1.63` | disabled/nonessential 전용                                          |
| `gray-300` subtle border |       `1.15` |      `1.38` | decorative boundary 전용                                            |
| `gray-200` divider       |       `1.08` |      `1.24` | decorative rhythm 전용                                              |

이 비율은 component state를 승인하지 않는다. 실제 인접 관계, text size, border
면적, artwork, focus, disabled semantics, forced colors, high contrast는 필수 specimen
matrix에서 계속 검증해야 한다.

## Surface 검토 결정

2026-08-08 사용자는 현재 Spectrum S2 alias 충실안 `M-A`를 측정 NosLog specimen으로
가져갈 C5 neutral surface mapping으로 승인했다. 승인된 값은 다음과 같다.

1. Light `canvas #ffffff`, `surface #f8f8f8`, `sunken #e9e9e9`, `raised #ffffff`,
   `overlay #ffffff`, black `40%` scrim
2. Dark `canvas #111111`, `surface #1b1b1b`, `sunken #111111`, `raised #222222`,
   `overlay #222222`, black `60%` scrim

`C5M-03` surface 승인 자체는 대표 guide specimen과 측정만 허가했으며 다른 role을
승격하지 않았다. Foreground는 문서 `36`, `37` 뒤 `C5M-04`에서, neutral boundary는
문서 `38`, `39` 뒤 `C5M-05`에서 별도로 승인됐다. Interaction container, focus,
signature, component 및 production 구현 값은 계속 미승인이다. `M-B`는 명시적으로
표시된 과거 근거로만 남을 수 있으며 fallback 구현
경로가 아니다.

## 결정 로그

| ID       | 항목                                                                                                                                              | 상태                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `C5M-01` | 승인된 grayscale source 안에서는 현재 Spectrum S2 color alias를 주요 semantic-mapping 권위로 취급한다.                                            | `Observed`                 |
| `C5M-02` | 이전 비교의 role 배정을 승인된 semantic map이 아니라 source 선택용 임시 specimen으로 취급한다.                                                    | `Observed`                 |
| `C5M-03` | 현재 Spectrum S2 base/layer/elevated/pasteboard/overlay alias를 보존하는 `M-A`로 C1-B surface를 매핑한다.                                         | `Approved — 2026-08-08`    |
| `C5M-04` | 문서 `36`의 broad comparison과 dedicated `F-A` specimen 뒤에만 foreground mapping을 결정하며 `gray-900`을 generic heading emphasis로 보지 않는다. | `Approved — 2026-08-09`    |
| `C5M-05` | decorative, subtle, default, strong boundary를 `gray-200`, `gray-300`, `gray-400`, `gray-600`에 매핑한다.                                         | `Approved — 2026-08-09`    |
| `C5M-06` | 일반 interaction과 selection은 neutral로 유지하고 공식 subtle/disabled alias는 문서화된 component-level 제약에서만 허용한다.                      | `Proposed — 별도 gate`     |
| `C5M-07` | 오래된 공개 background-layer 표와 현재 Spectrum S2 alias를 하나의 mapping에 섞지 않으며 향후 이탈은 명시적으로 기록한다.                          | `Proposed governance rule` |
| `C5M-08` | `M-B`는 과거 source-selection 근거로만 유지하고 C5 surface mapping 및 자동 fallback으로는 기각한다.                                               | `Rejected — 2026-08-08`    |
