# NosLog 2.0 C5 중립 경계 Specimen 검증

## 문서 관리

- 상태: `기술 검증 완료; NB-A 승인; C5M-05 종료`
- 기술 검증일: 2026-08-09
- 사용자 승인일: 2026-08-09
- 정본 언어: 영어
- 영어 정본:
  [39-foundation-c5-neutral-boundary-specimen-validation.md](./39-foundation-c5-neutral-boundary-specimen-validation.md)
- 범위: `C5M-05` 의사결정 근거로 문서 `38`의 exact Spectrum S2 중립 boundary
  ladder `NB-A`를 승인된 `M-A` surface, 대표 NosLog 구조, 일반 state, 접근성
  override에 적용
- 입력: 승인된 문서 `25`, `35`, `37`; 문서 `38`의 boundary 조사; exact Spectrum
  S2 alias; 전용
  [interactive boundary specimen](./specimens/c5-neutral-boundary-specimen.html)
- 제외: production token, 최종 component alias, focus-ring 및 feedback color,
  자동 selected-state boundary, radius, elevation, 최종 component geometry,
  high-fidelity screen, application 구현

이 specimen은 의사결정 근거이지 production interface나 최종 Claude Design screen이
아니다. Controls와 Matrix scene의 사각 card와 frame은 측정 fixture이며 component
권고안이 아니다.

## 관련 문서

- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 Spectrum surface 검증](./35-foundation-c5-spectrum-surface-validation.ko.md)
- [C5 foreground specimen 검증](./37-foundation-c5-foreground-specimen-validation.ko.md)
- [C5 neutral boundary reference 비교](./38-foundation-c5-neutral-boundary-reference-comparison.ko.md)

## 권위 경계

승인된 `M-A` surface와 `F-A` foreground를 고정했다. Specimen은 다음의 승인된
`NB-A` boundary 값만 사용했다.

| NosLog role      | Spectrum source |     Light |      Dark | 계약                                                                                                    |
| ---------------- | --------------- | --------: | --------: | ------------------------------------------------------------------------------------------------------- |
| `divider`        | `gray-200`      | `#e1e1e1` | `#323232` | decorative rhythm 전용이며 spacing, heading 또는 structure가 이미 관계를 전달한다                       |
| `border-subtle`  | `gray-300`      | `#dadada` | `#393939` | 비필수 framing과 disabled-border 값이다. primitive를 공유해도 semantic alias는 분리한다                 |
| `border-default` | `gray-400`      | `#c6c6c6` | `#444444` | label, fill, shape, placement 또는 다른 충분한 cue가 이미 객체를 식별할 때만 사용하는 ordinary boundary |
| `border-strong`  | `gray-600`      | `#717171` | `#8a8a8a` | 승인된 모든 opaque surface adjacency에서 식별되어야 하는 필수 neutral control 또는 graphic boundary     |

Tailwind color, local interpolation, gradient, shadow, 추가 gray는 도입하지 않았다.
`border-strong`에는 focus 또는 자동 selected-state ownership을 배정하지 않았다. Error
composition에서는 chromatic feedback을 명시적으로 미결 상태로 유지했다.

## Specimen 범위

| Scene               | Boundary 근거                                                                                                                                      | 결정 질문                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Surface matrix      | `canvas`, `surface`, `sunken`, `raised` 위 네 role. Opaque overlay adjacency는 Overlay scene에서 다룬다                                            | Primitive 값을 이동하거나 섞지 않고 intact ladder가 구분되는가?                                              |
| Music Discovery     | Flat result group, shared list divider, jacket edge, 한/일/영 혼합 identity, 긴 title, visible text action                                         | 각 row를 bordered card로 만들지 않고 scan rhythm을 절제되게 유지할 수 있는가?                                |
| Global Rankings     | Dense header, shared row divider, 긴 일본어와 mixed-script player name, current-user row, pagination                                               | Strong row outline이나 자동 selected border 없이 dense separation을 읽을 수 있는가?                          |
| Controls and states | 필수 input, visible-content action, selected, disabled, native checkbox/radio/switch, recoverable error, focus instrumentation, hover/pressed copy | Semantic ownership이 native state와 non-color cue를 보존하면서 default와 strong을 구분하는가?                |
| Viewer and overlay  | Viewer/editor well, lane grid, opaque dialog, menu/popover, scrim adjacency, default 대 strong overlay edge 비교                                   | 어떤 edge가 실제 필수이며 어떤 edge는 fill, shape, spacing, label 또는 scrim separation으로 이미 드러나는가? |

Scene, appearance, width, text-scale control은 presentation 전용이며 새로운 NosLog
product control을 제안하지 않는다.

## Browser 측정 기록 — 2026-08-09

### Exact canvas, content, 보충 text-scale matrix

두 appearance, 세 requested specimen width, 두 text scale, 다섯 scene에서 `60`개
조합을 측정했다.

| 차원       | 값                                             |
| ---------- | ---------------------------------------------- |
| Appearance | Dark, Light                                    |
| Canvas     | `320px`, `390px`, `768px`                      |
| Text scale | `100%`, `200%` specimen text-scale pressure    |
| Scene      | Matrix, Discovery, Rankings, Controls, Overlay |

| Assertion                                                    |           결과 |
| ------------------------------------------------------------ | -------------: |
| Exact `NB-A` computed primitive value                        | `60 / 60` 통과 |
| Specimen-frame horizontal overflow                           |  `0 / 60` 실패 |
| 보이는 content가 specimen inline boundary 밖으로 이탈        |  `0 / 60` 실패 |
| Active scene 수 또는 scene 선택 불일치                       |  `0 / 60` 실패 |
| Controls scene의 사용 가능한 target이 `44px` CSS height 미만 |  `0 / 12` 실패 |

Specimen text-scale control은 보충 content pressure다. 별도의 실제 browser zoom gate를
대체하지 않았다.

### 실제 browser-width reflow

네 browser width에서도 전체 다섯 scene의 Dark/Light set, 총 `40`개 조합을 시험했다.
Host padding과 vertical scrollbar가 좁은 browser width의 inner frame을 의도적으로
줄인다.

| Browser width | Requested specimen | 관찰 frame width | Dark/Light × scene | 결과 |
| ------------: | -----------------: | ---------------: | -----------------: | ---- |
|       `320px` |            `320px` |          `273px` |               `10` | 통과 |
|       `390px` |            `390px` |          `343px` |               `10` | 통과 |
|       `560px` |            `768px` |    `513px–528px` |               `10` | 통과 |
|      `1280px` |            `768px` |          `768px` |               `10` | 통과 |

40개 state 모두 document와 specimen horizontal overflow가 0이었다. `273px` frame은
필수 `320 CSS px` product minimum 아래의 추가 pressure를 제공하며, exact `320px`와
대표 `390px` specimen canvas는 위 60개 조합 matrix에서 다뤘다.

### Native keyboard 순서

Chrome native tab order는 Controls scene에 다음 순서로 도달했다.

1. label이 있는 search input
2. visible-content action
3. 선택된 `aria-pressed="true"` action
4. native checkbox
5. native radio
6. semantic `role="switch"` action
7. focus-instrumentation action
8. pressed/hover-content action

Native disabled action은 건너뛰었다. `tabindex`는 추가하지 않았다. 정상 theme focus는
browser `outline: auto`를 사용했다. 이는 reachability와 state semantics를 입증하지만
NosLog focus-ring color 또는 geometry를 승인하지 않는다.

확장 fixture의 actual-Chrome 순서는 활성화된 control 8개에 source 순서대로 도달했다.
Native disabled action은 순서에 들어오지 않았고 radio와 switch는 native/ARIA state
semantics를 유지했다.

### 실제 200% Chrome zoom

Chrome을 100%로 초기화한 뒤 보이는 browser control을 통해 `200%`로 확대했다.
Runtime 측정에서 `devicePixelRatio`가 `2`에서 `4`로, page CSS viewport가
`1450px`에서 `725px`로 바뀐 것을 확인했다.

활성 200% zoom에서 `2 appearance × 3 requested canvas × 5 scene = 30`개 조합을
측정했다.

| Requested canvas | 200%에서 관찰 frame | Dark/Light × scene | 결과 |
| ---------------: | ------------------: | -----------------: | ---- |
|          `320px` |             `320px` |               `10` | 통과 |
|          `390px` |             `390px` |               `10` | 통과 |
|          `768px` |           `685.5px` |               `10` | 통과 |

| Assertion                          |           결과 |
| ---------------------------------- | -------------: |
| 실제 zoom이 `200%`(`DPR 4`)로 유지 | `30 / 30` 통과 |
| Document horizontal overflow       |  `0 / 30` 실패 |
| Specimen-frame horizontal overflow |  `0 / 30` 실패 |

정리 전 Chrome zoom을 100%로 되돌리고 runtime 측정이 `devicePixelRatio: 2`로
복원된 것을 확인했다.

명시적 radio/switch/menu/popover fixture를 추가한 뒤 이 30-state 실행을 반복했다.
현재 확장 specimen은 `30/30` state에서 exact value, target size, visible escape,
specimen overflow, document overflow 검사를 모두 통과했다.

### Active forced colors

Chrome DevTools Rendering emulation을 `forced-colors: active`로 설정했다. Runtime
평가에서 `matchMedia('(forced-colors: active)').matches === true`를 확인했다.

| Assertion                                                                             |           결과 |
| ------------------------------------------------------------------------------------- | -------------: |
| `320/390/768px`의 확장 Dark/Light Controls 및 Overlay state                           | `12 / 12` 통과 |
| `forced-color-adjust: none`을 쓰는 product descendant                                 |            `0` |
| Native radio, semantic switch, dialog, popover, menu item이 system-owned color로 대체 |           통과 |
| 확장 8-control keyboard 순서가 disabled를 건너뛰고 이후 action에 도달                 |           통과 |
| Focus instrumentation이 보이는 user-agent `auto` outline을 유지                       |           통과 |
| 측정한 12개 state의 specimen-frame horizontal overflow 또는 visible escape            |            `0` |

활성 system palette는 시험 환경에서 black Canvas, white CanvasText/boundary,
보이는 cyan user-agent focus outline으로 계산됐다. 이 color는 forced colors가 활성일
때만 나타났다. Browser/user 접근성 override이며 정상 Dark-theme `NB-A` 후보가 아니다.

Emulation을 `No emulation`으로 되돌리고 runtime forced colors가 `false`가 된 것을
확인했으며, DevTools를 닫고 Chrome을 100%로 유지한 뒤 정리했다.

확장 radio, switch, dialog, popover, menu-item fixture는 모두
`forced-color-adjust: auto`로 계산됐다. Dark와 Light presentation control에서 active
system color가 동일해 이 mode의 ownership이 `NB-A`가 아니라 user agent에 있음을
확인했다.

## Exact 필수 경계 Adjacency

비율은 boundary를 필수 식별 cue로 취급한 모든 specimen line에서 `border-strong`과
양쪽 색 사이의 exact sRGB contrast다.

| 필수 fixture                              | Light inside / outside | Dark inside / outside | 결과 |
| ----------------------------------------- | ---------------------: | --------------------: | ---- |
| Input: 내부 `canvas`, 외부 `surface`      |          `4.88 / 4.60` |         `5.47 / 4.99` | 통과 |
| Viewer well: 내부 `sunken`, 외부 `canvas` |          `4.02 / 4.88` |         `5.47 / 5.47` | 통과 |

양쪽 모두 `3:1` necessary-boundary gate를 넘는다. 다른 specimen edge는 sole-cue
ownership을 주장하지 않았다.

- list와 ranking divider는 grouping과 spacing이 뒷받침하는 decorative rhythm이다.
- jacket과 container frame은 fill, shape, placement 또는 content가 뒷받침한다.
- visible-content button은 읽을 수 있는 label과 action placement로 식별된다.
- selected state는 더 강한 border가 아니라 check mark와 `aria-pressed`를 유지한다.
- native checkbox/radio graphic과 semantic switch state는 browser semantics를 유지한다.
- opaque overlay는 fill, shape, scrim separation으로 식별되므로 가변 composited
  scrim을 universal necessary-boundary adjacency라고 잘못 기록하지 않는다.

모든 role과 surface의 전체 대비 표는 문서 `38`에 유지되며 specimen으로 바뀌지 않았다.

## Noise 및 Boxing 검토

1. Discovery와 Rankings는 outer group frame 하나와 shared row divider를 사용하며
   row를 개별 boxing하지 않는다.
2. Current-user ranking은 strong border를 얻지 않는다. Text와 semantic context가
   state를 전달한다.
3. 필수 `border-strong`은 input과 viewer-well 예시에만 제한된다. Generic card 또는
   section outline이 아니다.
4. Controls-scene card는 모든 fixture를 비교하기 위해 의도적으로 노출한다. 반복되는
   square frame은 instrumentation이며 production component composition으로 복사하면 안 된다.
5. Overlay default/strong edge는 comparison evidence로 남는다. 이 Foundation gate는
   dialog, popover, menu component alias를 승인하지 않는다.
6. 측정된 어떤 경우도 invented intermediate gray, Tailwind border, shadow fallback,
   정상 theme white outline을 정당화하지 않았다.

## Browser 검토 중 발견한 수정

1. 첫 responsive 구현은 bounded specimen에 viewport media query를 사용했다. Desktop
   host 안의 `320px` canvas에서 두 column layout을 잘못 유지했다. Specimen은 이제
   inline-size container query를 사용한다.
2. 첫 Dark `320px`/보충-200% Rankings pass에서 `NosLog_Player_대한민국`이 overflow했다.
   Player cell에 intrinsic shrinkage와 `overflow-wrap: anywhere`를 허용했고, 반복한
   Dark 및 Light matrix가 통과했다.
3. 첫 instrumentation audit은 hidden scene과 완전한 `44px` labelled target 대신 native
   `16px` checkbox를 계산했다. 이제 rendered scene만 포함하고 checkbox row 전체를
   측정한다.

이 수정은 specimen reflow와 측정 정확도를 바꿨으며 `NB-A`, `M-A`, `F-A` 값은 바꾸지
않았다.

## 승인된 관찰

1. `divider`와 `border-subtle`은 두 appearance에서 의도적으로 조용하다. Structure가
   이미 관계를 전달하는 곳에서만 작동한다.
2. `border-default`는 ordinary framing에는 충분히 보이지만, 다른 식별 cue가 없는
   control의 유일한 cue로는 측정상 부적격이다.
3. `border-strong`은 neutral하고 명확하게 식별되면서 사용자가 정상 Dark mode에서
   거부한 white-outline 효과를 만들지 않는다.
4. Dense Discovery와 Rankings 예시는 row boxing 또는 selected-state outline 없이도
   scan 가능하다.
5. Exact Spectrum 네 step은 Tailwind value, local hue shift, 추가 neutral 없이 측정한
   responsibility를 모두 다룬다.

사용자는 확장 specimen을 검토한 뒤 2026-08-09에 이 visual direction을 수용했다.
따라서 이 관찰은 승인된 `NB-A` Foundation mapping을 뒷받침하지만 component alias나
production styling을 승인하지 않는다.

## 사용자 검토 및 다음 gate

확장 actual-Chrome 200%, active-forced-colors, Tab 교차 검증은 측정 실패 없이
완료됐다. 사용자가 `NB-A`를 수용했고 문서 `34`, `38`, `39`는 이제 그 결정을
동기화하며 `C5M-05`를 종료한다.

다음 color Foundation gate는 일반 neutral interaction 및 selection-state mapping인
`C5M-06`이다. 별도의 폭넓은 reference 비교와 사용자 승인이 필요하다. Component
alias, focus, feedback, 자동 selected-state boundary 처리는 계속 별도 gate다. `NB-A`
승인은 production 구현이나 Controls-scene instrumentation의 최종 component 복사를
허가하지 않는다.

## 의사결정 및 검증 로그

| ID       | 항목                                                                                                                                   | 상태                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `C5N-01` | 승인된 `M-A`와 `F-A`를 고정하고 exact `gray-200/300/400/600` `NB-A` 값만 시험한다.                                                     | `Observed specimen rule`                   |
| `C5N-02` | 최종 Dark/Light canvas, text-scale, scene matrix는 exact value와 함께 `60/60` state를 통과했고 frame overflow 또는 escape가 없다.      | `Observed — 2026-08-09`                    |
| `C5N-03` | 실제 browser width `320/390/560/1280px`는 document 또는 specimen horizontal overflow 없이 Dark/Light scene `40/40` state를 통과했다.   | `Observed — 2026-08-09`                    |
| `C5N-04` | 현재 확장 actual Chrome 200% zoom은 document 또는 specimen overflow 없이 Dark/Light, canvas, scene `30/30` state를 통과했다.           | `Observed — 2026-08-09`                    |
| `C5N-05` | 확장 native Tab 순서는 radio와 switch를 포함한 활성 control 8개에 source 순서대로 도달하고 disabled를 건너뛴다.                        | `Observed — 2026-08-09`                    |
| `C5N-06` | 확장 active forced colors는 영향받는 Controls/Overlay `12/12` state를 통과하고 `forced-color-adjust: none`을 0으로 유지한 뒤 복원됐다. | `Observed — 2026-08-09`                    |
| `C5N-07` | Sole-cue ownership을 주장하는 모든 specimen boundary는 `border-strong`을 쓰고 내부와 외부 opaque color 양쪽에서 `3:1`을 넘는다.        | `Observed — 2026-08-09`                    |
| `C5N-08` | Focus, feedback, error hue, component alias, radius, elevation, 자동 selected-state boundary는 이 gate 밖에 남긴다.                    | `Approved authority boundary — 2026-08-09` |
| `C5N-09` | 확장 기술 재검증과 명시적 사용자 시각 결정이 끝났으므로 `NB-A`를 승격하고 `C5M-05`를 종료한다.                                         | `Approved — 2026-08-09`                    |
