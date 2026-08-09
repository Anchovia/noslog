# NosLog 2.0 C5 — Fluent 포커스 표본 검증

[Canonical English source](44-foundation-c5-fluent-focus-specimen-validation.md)

## 문서 관리

| 필드           | 값                                                                           |
| -------------- | ---------------------------------------------------------------------------- |
| 상태           | `Specimen 준비 — 기본 matrix 통과; native/zoom/forced-colors gate는 Open`    |
| 날짜           | `2026-08-09`                                                                 |
| Canonical 언어 | English                                                                      |
| 결정 gate      | 사용자가 선택한 `FI-C`의 `C5F-06` measured validation                        |
| 선택 입력      | Fluent 2 achromatic `colorStrokeFocus2` polarity                             |
| 상속 승인      | `M-A` surface, `F-A` foreground, `NB-A` boundary, `NI-A` neutral interaction |

이 문서는 사용자가
[문서 43](43-foundation-c5-focus-indicator-visual-comparison.ko.md)에서 `FI-C`를
선택한 뒤 허용된 첫 measured validation 결과를 기록한다. Production focus token,
최종 component alias, signature color, feedback color, component geometry 또는
application 구현을 승인하지 않는다. 남은 runtime gate와 사용자 검토가 끝날 때까지
C5 focus gate는 Open이다.

## 권위 경계

편집 가능한 artifact는
[C5 Fluent 포커스 검증 specimen](specimens/c5-fluent-focus-validation.html)이다.
Production component library나 최종 Claude Design 화면이 아닌 guide fixture다.

Specimen은 두 upstream 책임을 보존한다.

1. 승인된 Spectrum S2 값은 neutral surface, content, boundary, disabled part 및
   ordinary neutral selection을 계속 소유한다.
2. Fluent 2는 `colorStrokeFocus2`와 표준 web focus-outline helper를 통해 선택된
   authored focus 방향을 소유한다.

Tailwind palette, Tailwind ring, Spectrum focus gap, chromatic swatch, gradient, glow,
cross-system interpolation은 도입하지 않았다. Persistent normal-Dark white
boundary도 계속 금지된다. Dark의 white는 validation harness가 element를
keyboard-focused로 표시하거나 static measurement fixture가 그 상태를 명시적으로
보여 줄 때만 나타난다.

## 선택된 정확한 입력

Validation은 문서 `42`에 기록한 maintained Fluent 근거와 현재 Fluent UI
`createFocusOutlineStyle` source를 사용한다.

- [Fluent 2 web alias color tokens](https://fluent2.microsoft.design/color-tokens2/)
- [Fluent UI `createFocusOutlineStyle`](https://github.com/microsoft/fluentui/blob/master/packages/react-components/react-tabster/src/focus/createFocusOutlineStyle.ts)

| 역할 또는 geometry     | Light       | Dark        | Validation mapping                                                          |
| ---------------------- | ----------- | ----------- | --------------------------------------------------------------------------- |
| `colorStrokeFocus1`    | `#ffffff`   | `#000000`   | Upstream component-owned contrast role이며 global NosLog primitive로 미할당 |
| `colorStrokeFocus2`    | `#000000`   | `#ffffff`   | 선택된 normal-theme keyboard-visible focus color                            |
| Outline width          | `2px`       | `2px`       | 정확한 표준 helper width                                                    |
| Pseudo-element extent  | `-2px`      | `-2px`      | Focused component 주위의 zero-gap perimeter                                 |
| Forced-colors override | `Highlight` | `Highlight` | System color를 허용하지만 active runtime 시험은 아직 미완료                 |

HTML fixture는 Fluent React가 일반적으로 focus management layer를 통해 받는
keyboard-modality ownership을 재현하기 위해 `data-keyboard-focus` harness attribute를
사용한다. 이 attribute는 production API 제안이 아니라 시험 instrumentation이다.
색상과 geometry는 위의 정확한 Fluent input을 유지한다.

## 승인된 `M-A`에 대한 static 대비

Focus2 색상과 모든 고유 approved neutral surface 사이의 exact sRGB 대비를 계산했다.

| Theme | 인접 approved surface      | Focus2 color |  Contrast |
| ----- | -------------------------- | ------------ | --------: |
| Light | canvas / raised `#ffffff`  | `#000000`    |    `21:1` |
| Light | surface `#f8f8f8`          | `#000000`    | `19.77:1` |
| Light | sunken `#e9e9e9`           | `#000000`    | `17.30:1` |
| Dark  | canvas / sunken `#111111`  | `#ffffff`    | `18.88:1` |
| Dark  | surface `#1b1b1b`          | `#ffffff`    | `17.22:1` |
| Dark  | raised / overlay `#222222` | `#ffffff`    | `15.91:1` |

모든 approved neutral-surface pair는 `3:1`을 크게 넘는다. 이 값만으로 clipping,
focus order, forced-colors behavior 또는 임의의 artwork 위에 직접 배치된 control의
가시성을 증명하지는 않는다.

## Specimen 범위

| Scene             | 대표 근거                                                                                | 시험 질문                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Components        | Text link, icon button, low-emphasis action, filled action, field wrapper, menu item     | Component를 다시 칠하거나 normal boundary를 승격하지 않고 focus가 무채색으로 남는가?   |
| State coexistence | Selected, current, structural error, disabled neighbor, dense ranking row, chart control | Focus가 독립적으로 이동하는 동안 programmatic 및 persistent non-fill cue가 유지되는가? |
| Surfaces / media  | 모든 고유 `M-A` surface, 고정 dark-filled control, neutral stress-test artwork tile      | Approved neutral input을 바꾸지 않고 exact pair가 보이는가?                            |
| Clipping          | Scroll container, sticky header, rounded boundary, frame-edge safe zone                  | 전체 zero-gap `2px` perimeter가 잘리거나 가려지지 않는가?                              |
| Live keyboard     | Skip link, action, input, roving radio menu, 혼합 언어 label, exit link                  | Pointer activation에는 장식하지 않고 keyboard modality만 ring을 소유하는가?            |

Feedback color는 후속 gate이므로 error를 `aria-invalid`, 명시적인 `!` marker, text,
structural boundary로 표시했다. Scene을 완성하려고 red error token을 발명하지 않았다.

## 자동 기본 matrix

최종 기본 run은 다음을 포함했다.

`2 themes × 5 requested canvases × 2 text-pressure scales × 5 scenes = 100 states`.

| Assertion                                                 | 결과           |
| --------------------------------------------------------- | -------------- |
| Specimen horizontal overflow                              | `0 / 100` 실패 |
| Document horizontal overflow                              | `0 / 100` 실패 |
| Specimen inline boundary를 벗어난 visible content         | `0 / 100` 실패 |
| Active-scene mismatch                                     | `0 / 100` 실패 |
| Light/Dark Focus2 mismatch                                | `0 / 100` 실패 |
| Visible demo perimeter가 정확한 `2px`가 아님              | `0 / 100` 실패 |
| Visible demo pseudo-element extent가 정확한 `-2px`가 아님 | `0 / 100` 실패 |
| `forced-color-adjust: none`을 쓰는 descendant             | `0`            |

제약 없는 in-app host는 requested canvas를 `320 / 390 / 560 / 768px`로 렌더링했다.
Requested `1120px` frame은 available `810px` host 영역으로 intrinsic하게 제한됐다.
아래의 별도 wide viewport run이 정확한 desktop canvas에 도달했으므로 실패가 아니다.

### Matrix에서 발견한 수정 사항

초기 `320px + 200% + state coexistence` run에서 dense ranking row에 `18px`
horizontal overflow가 나타났다. Score column이 desktop 한 줄 grid를 유지하려고 했다.
이제 `200%` text pressure에서 score가 두 번째 grid line으로 reflow한다. 최종 matrix는
두 theme 모두 overflow가 0이다. Focus color, focus geometry, neutral token 또는 state
의미는 바뀌지 않았다.

## 실제 browser viewport reflow

Normal browser zoom에서 네 개의 실제 viewport width로 두 theme의 모든 다섯 scene을
시험했다.

| Browser CSS width | Requested specimen | 관찰 frame | Dark/Light × scenes | 결과 |
| ----------------: | -----------------: | ---------: | ------------------: | ---- |
|           `320px` |            `320px` |    `320px` |                `10` | 통과 |
|           `390px` |            `390px` |    `390px` |                `10` | 통과 |
|           `560px` |            `560px` |    `528px` |                `10` | 통과 |
|          `1280px` |           `1120px` |   `1120px` |                `10` | 통과 |

`40 / 40` state 모두 specimen/document horizontal overflow와 escaping content가
0이고 Focus2 color와 geometry가 정확했다. `560px → 528px`는 조작된 device
breakpoint가 아니라 guide host의 inline padding 이후 intrinsic reflow를 기록한다.

## 완료된 interaction 근거

In-app browser는 Light와 Dark 모두에서 다음을 확인했다.

1. Pointer activation 후 live control의 focus pseudo-element width는 `0px`였다.
2. Keyboard input이 harness modality를 바꾸고 정확한 `2px` ring을 만들었다.
   Dark `rgb(255, 255, 255)`, Light `rgb(0, 0, 0)`이다.
3. `ArrowDown`이 roving focus를 첫 번째 radio-menu item에서 두 번째 item으로 옮기고
   `tabindex="0"` ownership을 갱신했다.
4. `Enter`가 focused item으로 `aria-checked="true"`와 visible checkmark를 옮겼다.
5. Focus는 menu item, selection fill, text 또는 neutral boundary를 다시 칠하지 않았다.

이는 fixture가 제공하는 keyboard-modality와 composite-state logic을 확인한다.
Browser-default `Tab` traversal을 대체하지는 않는다.

## 아직 Open인 gate

현재 세션에서 세 가지 필수 runtime check를 완료할 수 없었으며 통과로 기록하지 않는다.

1. **Native `Tab` 진입과 이탈.** In-app element-level keyboard API는
   browser-default Tab traversal을 실행하지 않는다. Chrome Computer Use access도
   사용할 수 없었으므로 skip-link 진입, disabled-skip behavior, composite exit은
   native run이 필요하다.
2. **실제 browser 200% zoom.** Specimen의 `200%` control은 content-pressure matrix일
   뿐이다. Chrome의 실제 zoom과 CSS viewport 변화는 아직 측정하지 않았다.
3. **Active forced colors.** Fixture는 Fluent `Highlight` override를 포함하며
   `forced-color-adjust: none` descendant가 0이지만 active runtime emulation을 사용할
   수 없어 계속 필수다.

이들이 통과할 때까지 artifact는 검토 가능하지만 `FI-C`를 approved production
mapping으로 승격하면 안 된다. 실패하면 source 결정 또는 component-specific Fluent
recipe를 다시 열어야 한다. Gray tint, Spectrum gap 추가 또는 다른 system의 inset
geometry로 실패를 숨겨서는 안 된다.

## 결정 기록

| ID        | 문장                                                                                                              | 상태                             |
| --------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `C5FV-01` | 선택된 Fluent Focus2 pair를 upstream `2px` zero-gap helper와 변경하지 않은 approved neutral input으로 렌더링한다. | `Completed`                      |
| `C5FV-02` | 수정 후 100-state 기본 matrix와 40-state 실제 viewport matrix에 overflow, escape, color, geometry 실패가 없다.    | `Observed — validated`           |
| `C5FV-03` | Pointer activation은 undecorated이며 keyboard modality는 두 theme에서 정확한 achromatic ring을 만든다.            | `Observed — harness validated`   |
| `C5FV-04` | Roving menu 이동과 selection ownership이 focus ring과 공존한다.                                                   | `Observed — validated`           |
| `C5FV-05` | 사용자 승인 전에 native Tab, 실제 200% zoom 및 active forced-colors 시험이 필요하다.                              | `Open`                           |
| `C5FV-06` | Production token, 최종 component alias, signature/feedback color 및 application 구현은 미승인 상태다.             | `Authority boundary — preserved` |

## 사용자 검토 gate

이제 specimen을 시각 검토할 수 있지만 focus gate의 최종 승인 단계는 아니다.
`C5FV-05`를 완료하고 두 언어 문서에 측정 결과를 기록한 뒤 `FI-C`를 approved C5 focus
mapping으로 승격할지 사용자에게 물어야 한다.
