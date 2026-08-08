# NosLog 2.0 Foundation C5 — 중립 인터랙션 표본 검증

[Canonical English](41-foundation-c5-neutral-interaction-specimen-validation.md)

## 문서 제어

| 항목           | 값                                               |
| -------------- | ------------------------------------------------ |
| 상태           | `기술 검증 완료 — NI-A 사용자 검토 대기`         |
| 날짜           | `2026-08-09`                                     |
| Canonical 언어 | English                                          |
| 결정 gate      | `C5M-06` neutral interaction behavior            |
| 시험 후보      | `NI-A` — Spectrum component-family fidelity 보존 |
| 상속 승인      | `M-A` surface, `F-A` foreground, `NB-A` boundary |

이 문서는
[문서 40](40-foundation-c5-neutral-interaction-reference-comparison.ko.md)의 reference
comparison 이후 허용된 측정 guide specimen 결과를 기록한다. Production token,
최종 component alias, component geometry, signature color, feedback color, motion,
custom focus 처리를 승인하지 않는다.

## 권위 경계

시험 artifact는
[C5 neutral interaction specimen](specimens/c5-neutral-interaction-specimen.html)이다.
Production component library나 최종 high-fidelity NosLog page가 아니라 guide
fixture다.

Specimen은 승인된 Spectrum S2 neutral source를 그대로 유지하며 다음 `NI-A`
governance rule을 시험한다.

1. Foundation은 하나의 범용 hover, pressed, selected neutral fill을 발명하지 않는다.
2. Stack/list, Tree, Menu, Table은 동등한 Spectrum state recipe를 서로 다른 family로
   유지한다.
3. 일반 persistent selection은 중립을 유지하되 programmatic state와 보이는 non-fill
   cue를 반드시 보존한다.
4. Disabled background, border, content는 임의의 중첩 opacity 없이 정확한 Spectrum
   alias를 쓴다.
5. Interaction 시험 동안 기존 `M-A`, `F-A`, `NB-A` 결정을 고정한다.

과도하게 accent를 사용한 `FCM-11`, `SIG-07` 예시는 계속 `Rejected`이며 증거나
target으로 사용하지 않았다.

## Specimen이 고정한 정확한 state input

| Family 또는 role       | Light                    | Dark                        | Ownership                                                   |
| ---------------------- | ------------------------ | --------------------------- | ----------------------------------------------------------- |
| Stack/Tree `gray-100`  | `#e9e9e9`                | `#2c2c2c`                   | Stack hover/down/selected rest, Tree hover/neutral selected |
| Stack `gray-200`       | `#e1e1e1`                | `#323232`                   | Selected hover와 Spectrum-equivalent keyboard-focus fill    |
| Stack `gray-300`       | `#dadada`                | `#393939`                   | Selected down                                               |
| Menu state color set   | `#e9e9e9`                | `#323232`                   | Menu composition이며 global interaction alias가 아님        |
| Table hover            | `rgba(19, 19, 19, 0.07)` | `rgba(242, 242, 242, 0.07)` | Table row 전용                                              |
| Table down             | `rgba(19, 19, 19, 0.10)` | `rgba(242, 242, 242, 0.10)` | Table row 전용                                              |
| Table neutral selected | `rgba(41, 41, 41, 0.10)` | `rgba(219, 219, 219, 0.10)` | Table row 전용                                              |
| Table selected hover   | `rgba(41, 41, 41, 0.15)` | `rgba(219, 219, 219, 0.15)` | Table row 전용                                              |
| Disabled background    | `#e9e9e9`                | `#2c2c2c`                   | Disabled part                                               |
| Disabled border        | `#dadada`                | `#393939`                   | Disabled part                                               |
| Disabled content       | `#c6c6c6`                | `#444444`                   | Disabled part                                               |

Tailwind palette 값, starter style, gradient, shadow, 합성 interpolation은 도입하지
않았다.

## Specimen 범위

| Scene                | 대표 content                                                          | 시험 질문                                                                           |
| -------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Component matrix     | Stack, Tree, Menu, Table state sample                                 | Family가 시각적·수치적으로 분리되는가?                                              |
| Stack / Tree         | 긴 일본어 곡명, 한국어 metadata, 영문 wrapping 사례, hierarchy row    | Pointer와 selection state가 정확한 family 값과 persistent cue를 보존하는가?         |
| Menu                 | 단일 선택 ranking option과 unavailable option                         | 중립 composition이 checkmark와 `aria-checked` ownership을 유지하는가?               |
| Table                | Dense ranking row, 한·일·영 이름, multi-selection checkbox            | Alpha overlay가 Table 소유로 남고 가로 스크롤 없이 reflow하는가?                    |
| Selection / Disabled | Rejected fill-only 비교, 유효 current item, disabled/available action | Fill-only selection을 거부하면서 정확한 disabled alias를 low emphasis와 구분하는가? |

## 검증 중 발견해 수정한 항목

Browser 시험에서 최종 run 전 specimen defect 네 개를 찾아 수정했다.

1. 초기 `hover: none` rule이 selected Table row에 Stack `gray-100`을 잘못
   재배정했다. 현재는 `--table-selected`를 보존한다.
2. Stack item이 활성화되면 `aria-pressed`는 바뀌지만 trailing level number가
   persistent checkmark로 바뀌지 않았다. 이제 모든 Stack item은
   `aria-pressed="true"`일 때 rest marker를 `✓`로 교체한다.
3. 좁은 host chrome과 일반 scrollbar 때문에 정확해야 할 review canvas 폭이
   줄었다. Guide host는 compact width에서 자체 inline padding을 없애고 review
   scrollbar만 숨겨 스크롤은 유지하면서 정확한 `320px`, `390px` frame을 만든다.
4. Pointer-down instrumentation은 임시 pointer-down state를 적용한 뒤 실제 rendered
   down color를 기록한다. 이는 audit instrumentation이며 production interaction
   요구가 아니다.

이 수정은 승인된 neutral primitive나 semantic role을 바꾸지 않았다.

## 자동 frame matrix

최종 static matrix 범위는 다음과 같다.

`2 themes × 3 requested canvases × 2 text scales × 5 scenes = 60 states`.

| Assertion                                 |                              결과 |
| ----------------------------------------- | --------------------------------: |
| 제약 없는 desktop host의 정확한 frame 폭  |               `320 / 390 / 768px` |
| Specimen horizontal overflow              |                     `0 / 60` 실패 |
| Document horizontal overflow              |                     `0 / 60` 실패 |
| Frame 밖으로 벗어난 visible content       |                     `0 / 60` 실패 |
| Active scene mismatch                     |                     `0 / 60` 실패 |
| `44px` CSS height 미만 available hit area | 측정된 interactive scene `0 / 48` |
| Light/Dark state-variable mismatch        |                     `0 / 60` 실패 |

Native Table checkbox 자체는 시각적으로 `18px`지만 연결된 클릭 가능
`<label class="choice">`가 `44 × 44px`다. 따라서 target 측정은 내부 glyph가 아니라
label hit area를 사용한다.

Specimen의 `Text 200%` control은 추가 content pressure다. 별도 실제 Chrome zoom
시험을 대체하지 않았다.

## 실제 Chrome 폭 reflow

Normal Chrome zoom에서 전체 Dark/Light 5-scene set을 네 browser width로 시험했다.

| Browser CSS width | Requested specimen | Observed frame | Dark/Light × scenes | 결과 |
| ----------------: | -----------------: | -------------: | ------------------: | ---- |
|           `320px` |            `320px` |        `320px` |                `10` | 통과 |
|           `390px` |            `390px` |        `390px` |                `10` | 통과 |
|           `560px` |            `768px` |        `528px` |                `10` | 통과 |
|          `1280px` |            `768px` |        `768px` |                `10` | 통과 |

`40 / 40` state 모두 document와 specimen horizontal overflow가 0이었다. `560px`
결과는 requested wide canvas가 available content area보다 클 때 intrinsic reflow가
작동함을 보여 준다.

## Pointer-state 측정

실제 pointer 이동과 activation을 두 theme에서 측정했다.

| State                         | Light computed result    | Dark computed result        | 결과 |
| ----------------------------- | ------------------------ | --------------------------- | ---- |
| Stack unselected hover/down   | `rgb(233, 233, 233)`     | `rgb(44, 44, 44)`           | 통과 |
| Stack selected hover          | `rgb(225, 225, 225)`     | `rgb(50, 50, 50)`           | 통과 |
| Stack selected down           | `rgb(218, 218, 218)`     | `rgb(57, 57, 57)`           | 통과 |
| Tree hover / neutral selected | `#e9e9e9` family input   | `rgb(44, 44, 44)` observed  | 통과 |
| Menu default/hover/down input | `rgb(233, 233, 233)`     | `rgb(50, 50, 50)`           | 통과 |
| Table hover                   | `rgba(19, 19, 19, 0.07)` | `rgba(242, 242, 242, 0.07)` | 통과 |
| Table down                    | `rgba(19, 19, 19, 0.10)` | `rgba(242, 242, 242, 0.10)` | 통과 |
| Table selected hover          | `rgba(41, 41, 41, 0.15)` | `rgba(219, 219, 219, 0.15)` | 통과 |

시험은 family를 하나의 Foundation ladder로 평탄화하면 안 되는 이유를 확인한다.
Dark Stack hover는 `#2c2c2c`, Dark Menu는 `#323232`, Table은 theme에 따라
foreground primitive도 바뀌는 translucent overlay를 사용한다.

## Persistent selection과 disabled ownership

### Programmatic 및 visible selection

| Fixture                 | Programmatic state                           | Persistent non-fill cue           | 결과          |
| ----------------------- | -------------------------------------------- | --------------------------------- | ------------- |
| Stack item              | Activation 시 `aria-pressed` 전환            | Trailing level을 `✓`로 교체       | 수정 후 통과  |
| Tree item               | `aria-selected="true"`                       | Persistent `✓` marker             | 통과          |
| Menu item               | Exclusive `aria-checked` update              | 선택 option과 함께 checkmark 이동 | 통과          |
| Table row               | Native checkbox와 row `data-selected` 동기화 | Native checked control            | 통과          |
| Valid current item      | `aria-current="page"`                        | Checkmark와 hidden selected text  | 통과          |
| Rejected fill-only 비교 | `aria-hidden="true"`, `inert`                | 의도적으로 없음                   | 올바르게 제외 |

문서 40은 subtle neutral fill과 인접한 승인 surface 사이를 최대 `1.49:1`로
측정했다. 이는 유용한 보조 feedback이지만 persistent selection 의미를 단독으로
전달할 수 없다. Valid fixture는 fill이 사라지거나 user-agent palette로 교체되어도
식별 가능하다.

### Disabled computation

| Theme | Background           | Border               | Content              | Native disabled | 결과 |
| ----- | -------------------- | -------------------- | -------------------- | --------------- | ---- |
| Light | `rgb(233, 233, 233)` | `rgb(218, 218, 218)` | `rgb(198, 198, 198)` | `true`          | 통과 |
| Dark  | `rgb(44, 44, 44)`    | `rgb(57, 57, 57)`    | `rgb(68, 68, 68)`    | `true`          | 통과 |

Disabled action에는 hover나 pressed behavior가 없다. 별도 readable helper가 사용할
수 없는 이유를 설명하고, 옆의 low-emphasis action은 enabled와 readable 상태를
유지한다.

## Native keyboard 검증

Chrome native keyboard operation 결과는 다음과 같다.

1. Stack `Enter`가 `aria-pressed`와 checkmark를 갱신했고 `Tab`은 다음 Stack
   button으로 이동했다.
2. Menu `Enter`가 선택 option으로 exclusive `aria-checked="true"`와 checkmark를
   옮겼다. 마지막 enabled option 다음 `Tab`은 native disabled option을 건너뛰고
   menu를 빠져나갔다.
3. Table `Space`가 native checkbox와 row selected state를 동기화했다.
4. `Selection / Disabled` scene control에서 다음 `Tab`은 disabled action을
   건너뛰고 `데이터 연동 방법 보기`에 도달했다.

Normal-theme focus는 Chrome user-agent `outline: auto`를 유지했고 시험한 Dark
scene에서 `1px` `rgb(153, 200, 255)` outline으로 측정됐다. 이는 reachability를
증명하지만 NosLog focus color나 geometry를 승인하지 않는다. Menu arrow-key
behavior, Tree roving focus, 최종 component keyboard contract는 후속 component
gate로 남는다.

## 실제 200% Chrome zoom

Chrome visible browser zoom control로 `100%`에서 `200%`로 변경했다. Runtime
측정은 다음을 확인했다.

- `devicePixelRatio: 2 → 4`;
- page CSS viewport: `1450px → 725px`.

실제 200% zoom에서:

`2 themes × 3 requested canvases × 5 scenes = 30 states`.

| Requested canvas | 200% observed frame | Dark/Light × scenes | 결과 |
| ---------------: | ------------------: | ------------------: | ---- |
|          `320px` |             `320px` |                `10` | 통과 |
|          `390px` |             `390px` |                `10` | 통과 |
|          `768px` |             `693px` |                `10` | 통과 |

`30 / 30` state 모두 `DPR 4`, 하나의 active scene, 최소 `44px` hit area, specimen 및
document horizontal overflow 0을 유지했다. Cleanup 전에 Chrome을 `100%`로
복원했고 runtime도 `DPR 2`로 돌아왔다.

## Touch / No-Hover emulation

Chrome DevTools responsive device emulation을 실제 `320px`, `390px` CSS width에서
시험했다. 두 경우 모두 runtime이 다음을 확인했다.

- `(hover: none) === true`;
- `(pointer: coarse) === true`;
- `(pointer: fine) === false`.

전체 Dark/Light 5-scene set은 `20 / 20` 통과했으며 horizontal overflow가 없고
`44px` 미만 available target도 없었다. No-hover composition에서:

- selected Dark Stack item은 `rgb(44, 44, 44)`, `aria-pressed="true"`, visible
  checkmark를 유지했다.
- selected Dark Table row는 Table-owned `rgba(219, 219, 219, 0.10)` overlay,
  native checkbox, selected state를 유지했다.
- Menu selection은 checkmark와 `aria-checked` state를 유지했다.

이는 hover-only feedback을 제거해도 persistent selection이 사라지지 않고 Stack
색을 Table에 교차 배정하지 않음을 확인한다. 시험 후 device emulation을 해제했다.

## Active forced colors

Chrome DevTools Rendering emulation을 `forced-colors: active`로 설정하고 runtime
media query가 활성임을 확인했다.

`2 themes × 3 requested canvases × 5 scenes = 30 states`를 측정했다.

| Assertion                                     |                              결과 |
| --------------------------------------------- | --------------------------------: |
| Runtime `forced-colors: active`               |                    `30 / 30` 통과 |
| `forced-color-adjust: none`을 쓰는 descendant |                               `0` |
| Specimen 또는 document horizontal overflow    |                     `0 / 30` 실패 |
| `44px` 미만 available target                  | 측정된 interactive scene `0 / 24` |
| Programmatic selected/disabled semantics 유지 |                              통과 |

활성 system palette는 black Canvas, white CanvasText/boundary, 보이는 cyan
user-agent focus outline `rgba(26, 235, 255, 0.8) auto 1px`로 계산됐다. 이는
browser/user accessibility override이며 정상 Dark-theme interaction 또는 boundary
후보가 아니다.

Forced-colors emulation은 `No emulation`으로 복원했고 device emulation을 해제하고
DevTools를 닫았다. 최종 runtime은 `DPR 2`, `forced-colors: false`,
`(hover: hover)`, `(pointer: fine)`으로 돌아왔다.

## 검증 결과

Specimen은 기술적으로 `NI-A`를 뒷받침한다.

1. 정확한 Spectrum S2 neutral 값이 Light/Dark, width, zoom, pointer, keyboard,
   no-hover/coarse-pointer, forced-colors 시험을 통과했다.
2. Component family는 조작된 global state palette가 되지 않고 서로 분리됐다.
3. Persistent selection은 더 이상 subtle fill에만 의존하지 않는다.
4. Disabled role은 중첩 opacity 없이 정확한 source alias를 사용한다.
5. Normal Dark interaction은 흰 static outline이나 자동 strong border를 추가하지
   않는다.
6. 기존 `M-A`, `F-A`, `NB-A` contract는 바뀌지 않았다.

기술 성공이 visual 결정을 확정하지는 않는다. 사용자는 절제된 state 차이가
NosLog에 적합한지, 그리고 comparison example이 Claude Design에 rule을 충분히
명확하게 전달하는지 계속 검토해야 한다.

## 남은 gate

다음은 명시적으로 미해결이다.

1. 최종 `C5M-06` 사용자 승인
2. Focus indicator color와 geometry
3. Signature/유채색 selection과 domain accent
4. Error, warning, success, informational feedback color
5. Motion과 transition behavior
6. 최종 component alias, geometry, Menu arrow behavior, Tree roving focus,
   production implementation mapping

이 specimen은 broad page design이나 production implementation을 허용하지 않는다.

## 결정 로그

| ID       | 항목                                                                                                         | 상태                                     |
| -------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `C5V-01` | 정확한 Spectrum component-family interaction input이 측정 specimen matrix를 통과했다.                        | `Observed — validated`                   |
| `C5V-02` | Stack, Tree, Menu, Table은 서로 다른 recipe로 남아야 하며 범용 neutral interaction fill은 정당화되지 않는다. | `NI-A에서 Proposed — specimen 검증 완료` |
| `C5V-03` | Persistent ordinary selection에는 programmatic state와 non-fill visible cue가 필요하다.                      | `NI-A에서 Proposed — 수정 후 검증 완료`  |
| `C5V-04` | 정확한 disabled background, border, content alias는 임의의 중첩 opacity 없이 작동한다.                       | `NI-A에서 Proposed — specimen 검증 완료` |
| `C5V-05` | Normal Dark interaction은 흰 static outline이나 자동 strong border를 추가하지 않는다.                        | `상속 승인 rule — 보존`                  |
| `C5V-06` | 이 specimen의 사용자 visual review 후에만 `NI-A`를 진행한다.                                                 | `사용자 결정 대기`                       |
| `C5V-07` | 그 결정을 문서 34, 40과 Korean companion에 기록할 때까지 `C5M-06`를 open으로 유지한다.                       | `Open`                                   |

## 사용자 검토 질문

정확한 component-family ownership과 mandatory persistent selection cue를 포함한
`NI-A`를 NosLog 2.0 Foundation neutral interaction behavior rule로 승인하고,
focus, signature color, feedback, motion, 최종 component alias는 후속 gate에
남기는가?
