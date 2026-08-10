# NosLog 2.0 Foundation Motion 출처 비교

## 문서 관리

- 상태: `Approved — MO-02 Atlassian; 블록 3 완료`
- 정본 언어: 영어
- 영어 정본:
  [61-foundation-motion-source-comparison.md](./61-foundation-motion-source-comparison.md)
- 날짜: 2026-08-10
- 범위: 일반 NosLog 2.0 interface motion만 해당
- 제외: 잠긴 chart viewer/editor 전체, renderer timing, transport, metronome, note
  movement, editor motion 및 최종 production 구현
- 시편:
  [foundation-motion-source-comparison.html](./specimens/foundation-motion-source-comparison.html)

## 승인된 결정

`MO-02 · Atlassian`을 NosLog 2.0 일반 UI의 duration/easing 및 semantic motion
mapping을 위한 승인된 유일한 출처로 사용합니다. Reduced motion에서는 모든 비필수
spatial motion을 즉시 전환으로 바꾸고 animation 없이도 state 의미를 그대로 보여야
합니다. Spectrum `130ms` timing이나 비교한 다른 system의 값을 승인 계약에 섞지 않습니다.

이는 `블록 3 · Motion` 안의 한 결정입니다. 조사, 통제 비교, reduced-motion 검증,
한영 통합 및 이후 승인을 별도 top-level 작업으로 늘리지 않습니다.

## 잠긴 경계

기존 chart viewer와 chart editor는 motion 후보가 아닙니다. Page, shell, control,
renderer·transport timing, note animation, geometry 및 editor behavior를 그대로 유지합니다.
이 비교의 어떤 값도 두 경험에 적용하지 않습니다.

## 현재 일반 UI 근거

잠긴 두 `chart-pattern` tree를 제외하고 repository를 read-only로 조사했습니다.

| 기존 mechanism              | 개수 | 관찰                                                                           |
| --------------------------- | ---: | ------------------------------------------------------------------------------ |
| `transition-colors`         |   95 | 대부분 작성된 duration/easing role 없이 framework 기본값을 상속합니다.         |
| `transition-transform`      |   17 | Disclosure chevron과 switch류 control에 문서화된 semantic mapping이 없습니다.  |
| `transition-opacity`        |    5 | Pending·visibility feedback이 하나의 motion 계약에 연결돼 있지 않습니다.       |
| `animate-spin`              |    3 | 일반 UI loading indicator에는 정적인 reduced 대체와 visible text가 필요합니다. |
| 명시적 duration             |    2 | `150ms` 하나와 `200ms` 하나로 system을 이루지 못합니다.                        |
| 명시적 easing               |    2 | 둘 다 `ease-out`이지만 role 소유권이 없습니다.                                 |
| 명시적 `motion-reduce` 처리 |    1 | Global reduced-motion 계약으로는 부족합니다.                                   |

이 값은 기능 inventory이지 Foundation 권위가 아닙니다. 특히 많은 현재 class가 상속하는
Tailwind의 암묵적 `150ms ease`는 설치돼 있다는 이유만으로 후보가 되지 않습니다.

## 권위 및 production reference matrix

서로 독립적인 외부 권위 14개를 조사했습니다. Exact-value system은 통제 후보에
반영하고 principle-only source는 모든 후보를 제약합니다.

|   # | 출처                                                                                                                                          | 가져올 근거                                                                                                   | NosLog 적용과 한계                                                                                     |
| --: | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
|   1 | [W3C WCAG 2.2 — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)                    | 비필수 interaction motion은 끌 수 있고 essential 의미는 남아야 합니다.                                        | Reduced 계약을 제약하지만 token 값은 정하지 않습니다.                                                  |
|   2 | [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)         | 널리 지원되는 media feature가 motion을 제거·축소·대체합니다.                                                  | Web mechanism이며 시각 성격은 정하지 않습니다.                                                         |
|   3 | [Apple HIG — Motion and Accessibility](https://developer.apple.com/design/human-interface-guidelines/motion)                                  | Motion은 purposeful·brief·cancellable·optional이어야 하며 reduced에서 axis movement를 절제된 대체로 바꿉니다. | 강한 comfort 제약이며 native Apple timing은 Web token 출처가 아닙니다.                                 |
|   4 | [Adobe Spectrum — Motion](https://spectrum.adobe.com/page/motion/)                                                                            | 정확한 130–500ms scale, enter/exit/move curve, micro/macro 구분.                                              | Exact 후보지만 reduced mapping은 최신 system보다 덜 명시적입니다.                                      |
|   5 | [Material Components — Motion theming](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) | 정확한 standard/emphasized curve와 50–1000ms duration.                                                        | Exact 후보지만 scale과 expressive pattern이 NosLog 일상 범위보다 큽니다.                               |
|   6 | [IBM Carbon — Motion](https://v10.carbondesignsystem.com/guidelines/motion/overview/)                                                         | 정확한 productive entrance/standard/exit curve, 70–700ms scale 및 static 대체.                                | Exact 후보이며 expressive branch는 일반 NosLog UI에 올리지 않습니다.                                   |
|   7 | [Microsoft Fluent 2 — Motion](https://fluent2.microsoft.design/motion)                                                                        | 짧고 자연스러운 motion, 제한된 focal area, no-motion setting 및 ARIA 대체.                                    | 절제와 접근성을 지지하지만 공개 page의 token 구체성이 finalist보다 낮습니다.                           |
|   8 | [Atlassian Design System — Motion](https://atlassian.design/foundations/motion)                                                               | 정확한 0–600ms role, 4개 curve, semantic component bundle 및 instant reduced mode.                            | 일반 productivity UI에 가장 직접적인 exact 후보입니다.                                                 |
|   9 | [SAP Fiori — Motion Design](https://experience.sap.com/fiori-design-web/explore_category/foundation/)                                         | Immediate/small/large/continuous class, exact curve, dialog 150ms enter/50ms exit.                            | Exact 후보지만 compact token set보다 범위 중심입니다.                                                  |
|  10 | [Shopify Polaris — Motion tokens](https://polaris-react.shopify.com/tokens/motion)                                                            | 정확한 0–500ms scale과 linear/ease/ease-in/out/in-out curve.                                                  | Exact 후보지만 NosLog가 semantic assignment를 더 많이 정해야 합니다.                                   |
|  11 | [GitLab Pajamas — Animation fundamentals](https://design.gitlab.com/product-foundations/animation-fundamentals/)                              | Purposeful·optional motion, exact default/out-cubic easing 및 reduced 요구.                                   | Duration guidance가 불완전해 finalist가 아닌 근거입니다.                                               |
|  12 | [GitHub Primer — Motion and animation](https://primer.style/accessibility/design-guidance/motion-and-animation/)                              | Motion을 `no-preference` 뒤에 두고 micro motion을 제한하며 text 대체를 제공합니다.                            | 강한 reduced/documentation 제약이지만 완전한 visual token 출처는 아닙니다.                             |
|  13 | [Ant Design — Motion](https://ant.design/docs/spec/motion)                                                                                    | Enterprise motion은 natural·performant·concise하고 시간을 최소화해야 합니다.                                  | Productivity 수렴 근거이며 현재 공개 semantic timing이 component별로 분산돼 finalist에서 제외했습니다. |
|  14 | [KDE HIG — Accessibility](https://develop.kde.org/hig/accessibility/)                                                                         | Animation을 전역으로 끄면 transition은 즉시, spinner는 static image가 됩니다.                                 | Zero-motion 검증이 독립 acceptance state임을 뒷받침합니다.                                             |

### 수렴점

- Motion은 state, continuity, hierarchy 또는 progress를 설명해야 하며 장식만으로는 목적이
  되지 않습니다.
- 반복 input feedback은 거의 즉시이고 큰 entrance만 더 길 수 있습니다.
- Entrance는 보통 감속하고 exit는 가속하며 더 빨리 끝납니다. 제자리 reposition은
  balanced curve를 사용합니다.
- Focus, error, selected, busy, completion 및 exact value는 motion을 기다리거나 motion에
  의존할 수 없습니다.
- Reduced motion은 비필수 transform, scale, parallax, stagger 및 자동 이동 장식을
  제거합니다. Static text, state, structure 및 programmatic semantics는 남습니다.
- 무기한 loading에는 visible text 또는 동등한 static cue가 필요하며 spinner는 보조입니다.

### 의미 있는 차이

- Token scale은 Carbon의 compact 6개부터 Material의 16개까지 차이가 큽니다.
- Spectrum·Carbon은 물리적 크기와 거리를 중심으로 하고 Atlassian은 semantic component와
  사용 빈도를 더합니다. Polaris는 넓은 base scale을 제공하지만 semantic assignment가 적습니다.
- 일부 system은 expressive/spring motion을 허용합니다. NosLog 일반 UI에는 bounce,
  overshoot, celebration, parallax 또는 page choreography 요구가 승인되지 않았으므로 올리지 않습니다.

## 통제된 exact-source 후보

시편은 동일한 NosLog filter, disclosure, popup, dialog, result update 및 loading 콘텐츠를
사용합니다. Neutral color, geometry, typography, focus는 고정하고 motion source만 바꿉니다.

| ID      | 출처                  | Hover / 지속 selection | 작은 enter / exit | Modal enter / exit | 정확한 easing family                                                                                      | Reduced mode                                        |
| ------- | --------------------- | ---------------------- | ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `MO-01` | Adobe Spectrum        | `130/130ms`            | `190/160ms`       | `250/190ms`        | out `(0,0,.4,1)`, in `(.5,0,1,1)`, in-out `(.45,0,.4,1)`                                                  | Spatial motion을 instant로 바꾸고 static 의미 유지. |
| `MO-02` | Atlassian             | `50/150ms`             | `150/100ms`       | `250/200ms`        | out practical `(.4,1,.6,1)`, out bold `(0,.4,0,1)`, in practical `(.6,0,.8,.6)`, in-out bold `(.4,0,0,1)` | 공식 guidance상 motion off 및 instant.              |
| `MO-03` | IBM Carbon productive | `70/110ms`             | `150/110ms`       | `240/150ms`        | entrance `(0,0,.38,.9)`, standard `(.2,0,.38,.9)`, exit `(.2,0,1,.9)`                                     | Static equivalent, 전체 state 유지.                 |
| `MO-04` | Shopify Polaris       | `100/100ms`            | `200/150ms`       | `250/200ms`        | ease `(.25,.1,.25,1)`, out `(.19,.91,.38,1)`, in `(.42,0,1,1)`, in-out `(.42,0,.58,1)`                    | `duration-0`, static 의미 유지.                     |
| `MO-05` | Material standard     | `100/100ms`            | `200/150ms`       | `300/250ms`        | standard `(.2,0,0,1)`, decelerate `(0,0,0,1)`, accelerate `(.3,0,1,1)`                                    | Spatial/scale motion 제거, state 즉시 유지.         |
| `MO-06` | SAP Fiori             | `100/100ms`            | `200/100ms`       | `150/50ms`         | out `(0,0,.35,1)`, in `(.65,0,1,1)`, in-out `(.5,0,.5,1)`                                                 | Movement를 instant로 바꾸고 static 의미 유지.       |

후보 mapping은 system 간 값을 섞지 않습니다. Upstream이 base token이나 range만 공개한
경우 NosLog semantic assignment를 제안으로 표시하며 upstream component alias인 것처럼
다루지 않습니다.

## 평가

| 후보                        | 강점                                                                                                                                        | 주요 위험                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `MO-01 · Spectrum`          | 절제된 익숙한 scale과 exact curve이며 neutral source와 출처 생태계가 같습니다.                                                              | Duration 10개는 NosLog에 많고 reduced behavior에 NosLog semantic layer가 필요합니다.                       |
| `MO-02 · Atlassian`         | `50ms` hover, `150ms` 지속 interaction highlight, popup, modal, entry/exit 비대칭, 접근성 timing, instant reduced를 가장 명확히 연결합니다. | Bold entrance의 시작이 Spectrum/Polaris보다 빠르므로 실제 entrance에만 제한해야 합니다.                    |
| `MO-03 · Carbon productive` | 가장 작은 효율적 scale과 productive/expressive 분리가 강합니다.                                                                             | `70ms` micro feedback은 일부 mobile display에서 거의 보이지 않을 수 있고 expressive branch는 불필요합니다. |
| `MO-04 · Polaris`           | 차분하고 관습적인 curve이며 구현하기 쉽습니다.                                                                                              | Base token에 semantic ownership이 부족해 NosLog가 behavior를 더 많이 발명해야 합니다.                      |
| `MO-05 · Material`          | 완전한 exact token family와 강한 enter/exit semantics가 있습니다.                                                                           | 큰 scale과 emphasized/spring vocabulary가 정보 제품에 필요 이상 표현과 token을 유도합니다.                 |
| `MO-06 · SAP Fiori`         | Immediate/small/large 범위와 매우 빠른 dialog exit가 명확합니다.                                                                            | Range와 50ms dialog exit가 Atlassian/Carbon보다 reusable Web 계약으로 덜 응집됩니다.                       |

## 승인된 출처와 계약

`MO-02 · Atlassian`을 일반 UI motion source로 승인합니다. 실제 NosLog inventory와 가장
가까운 semantic role을 공개하고, 반복 feedback을
50–150ms로 제한하며, entry/exit를 구분하고, focus·announcement를 즉시 적용하고,
reduced motion을 명시적으로 instant로 만들며, expressive spring이나 celebration layer를
도입할 필요가 없기 때문입니다.

승인된 lean contract는 다음과 같습니다.

1. Focus, error, critical status 및 reduced-motion state change는 `instant 0ms`;
2. 일상 고빈도 hover feedback은 `xxshort 50ms` + `out.practical`;
3. Subtle pressed feedback은 `xshort 100ms` + `out.practical`, quick exit는 같은 duration
    - `in.practical`;
4. 지속 selection/emphasized interaction highlight는 `short 150ms` + `out.practical`,
   popup/disclosure entrance는 같은 duration + `out.bold`;
5. Modal/large exit는 `medium 200ms` + `in.practical`;
6. Modal entrance 또는 제자리 scale/reposition만 `long 250ms` + `inout.bold`;
7. `xlong 400ms`는 증명된 큰 일반 transition의 ceiling이지 default가 아님;
8. `xxlong 600ms`, stagger, bounce, celebration 및 page choreography는 이후 별도 승인된
   product need가 없으면 미할당 상태로 유지.

## 승인된 reduced-motion 계약

- Default motion은 `@media (prefers-reduced-motion: no-preference)` 안에서 구현하거나
  `reduce`에서 명시적으로 override합니다. Animation이 가능하다고 가정하지 않습니다.
- `reduce`에서 비필수 translate, scale, rotate, parallax, stagger 및 auto-scroll motion을
  `0ms`/none으로 만듭니다. 단순히 느리게 하지 않습니다.
- Focus, selection, error, busy semantic 및 screen-reader announcement를 transition 종료가
  아니라 state 시작에 적용합니다.
- Loading spinner는 persistent localized busy text와 `aria-busy`가 있는 static progress
  glyph로 바뀝니다. Known progress는 정확한 값을 표시합니다.
- Async replacement 전에 content geometry를 예약해 motion 제거가 layout jump를 만들지 않게 합니다.
- Viewer/editor 전체가 범위 밖이므로 reduced-motion rule이 renderer timing을 바꾸지 않습니다.

## 완료한 통제 시편 검증

- `1280×720`에서 후보 6개가 정확한 작성 duration variable로 2열에 나타나며 가로 page
  overflow가 없습니다.
- `320px`와 `390px`에서 비교가 1열로 reflow하며 한국어·일본어·영어 모두 page/body
  overflow가 없습니다.
- 강제 reduced mode에서 popup·dialog transition duration이 실제 `0s`, spinner
  `animation-name`이 `none`이며 localized busy text와 `aria-busy="true"`를 유지합니다.
- Dialog activation은 visible Close control로 focus를 즉시 옮기고 닫으면 원래 Sync-guide
  control로 돌려보냅니다. 같은 동작을 `320px`와 reduced `390px` fixture에서 확인했습니다.
- 실제 keyboard traversal에서 승인된 focus treatment를 유지합니다. Light는 검정 `2px`,
  Dark는 흰색 `2px`이고 outer extent는 `-2px`입니다.
- 시편은 production component, dependency, viewer/editor file 또는 renderer behavior를
  변경하지 않습니다.

[Responsive 검증 harness 열기](./specimens/foundation-motion-responsive-validation.html).

## 선택 출처 검증과 블록 3 마감

- 사용자가 후보 6개와 바로잡은 `50ms` hover / `150ms` 지속 selection mapping을 검토한 뒤
  `MO-02 · Atlassian`을 명시적으로 선택했습니다.
- 선택 출처를 desktop, `320px`, `390px`, 한국어·일본어·영어, Light/Dark 및
  default/reduced 상태로 다시 확인했습니다. 작성된 변수는 `50/150/150/100/250/200ms`를
  유지하며 가로 overflow가 없습니다.
- 강제 reduced mode에서 선택 출처의 duration role 6개가 모두 `0s`로 계산되고 spinner
  animation이 제거됩니다. Localized busy text, `aria-busy`, 즉시 dialog focus, focus return 및
  보이는 state는 그대로 유지합니다.
- 이 한영 문서, `AGENTS.md`, `README.md`, 문서 `57` 및 시편이 동일한 승인 권위를
  기록합니다. 블록 `3 · Motion`은 완료됐고 블록 `4`–`6`만 남습니다.

## Decision log

| ID       | Entry                                                                                                                                            | 상태                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `MOT-01` | Chart viewer/editor 전체를 Block 3 motion 권위 밖에 유지합니다.                                                                                  | `Approved scope boundary`            |
| `MOT-02` | 현재 Tailwind 상속 transition default를 design authority가 아닌 inventory로 취급합니다.                                                          | `Observed`                           |
| `MOT-03` | 독립 외부 권위 14개와 exact-source 후보 6개를 비교합니다.                                                                                        | `Completed evidence`                 |
| `MOT-04` | Reduced motion에서 즉시 전환하며 완전히 의미가 남는 일반 UI를 요구합니다.                                                                        | `Approved — 2026-08-10`              |
| `MOT-05` | `MO-02 · Atlassian`을 일반 UI duration/easing 및 semantic role로 채택합니다.                                                                     | `Approved — 2026-08-10`              |
| `MOT-06` | 시편의 Atlassian 지속 selection mapping을 hover `50ms`에서 공개된 interactive-highlight `150ms`로 바로잡고 Spectrum `130ms`를 가져오지 않습니다. | `Corrected evidence — 2026-08-10`    |
| `MOT-07` | 선택 출처를 desktop/mobile, 다국어, appearance, reduced motion 및 keyboard focus로 다시 검증하고 블록 3을 종료합니다.                            | `Approved and complete — 2026-08-10` |
