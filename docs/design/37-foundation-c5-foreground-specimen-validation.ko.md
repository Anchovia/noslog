# NosLog 2.0 C5 Foreground Specimen 검증

## 문서 제어

- 상태: `기술 검증 완료 뒤 exact F-A를 최종 C5 foreground mapping으로 승인;
C5M-04 종료`
- Visual-direction 승인일: 2026-08-08
- 기술 검증일: 2026-08-09
- 최종 mapping 승인일: 2026-08-09
- Canonical language: English
- Canonical 문서:
  [37-foundation-c5-foreground-specimen-validation.md](./37-foundation-c5-foreground-specimen-validation.md)
- 시작일: 2026-08-08
- 범위: 문서 `36`의 제안 `F-A` exact Spectrum S2 foreground alias를 승인된 `M-A`
  surface, 대표 NosLog content, 일반 interaction state에 적용하고 `C5M-04` 전에 browser
  측정과 수정 사항 기록
- 입력: 승인된 문서 `25`, `32`, `33`, `35`; 문서 `36`의 수정된 mapping 조사; exact
  Spectrum S2 alias; 승인된 structural specimen; WCAG 2.2 contrast 기준
- 제외: boundary와 focus mapping, chromatic signature/feedback/domain/data
  visualization color, 최종 component geometry, high-fidelity screen, application 구현

이 specimen은 의사결정 근거이지 production interface나 최종 Claude Design screen이 아니다.
표시된 boundary, radius, disabled-surface 처리는 별도로 승인되지 않는 한 측정용
instrumentation이다.

## 관련 문서

- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 Spectrum surface 검증](./35-foundation-c5-spectrum-surface-validation.ko.md)
- [C5 neutral foreground reference 비교](./36-foundation-c5-neutral-foreground-reference-comparison.ko.md)

## 권위 경계

승인된 `M-A` surface는 고정했다. 다음 `F-A` foreground alias는 기록된 기술 gate를
완료했으며 `C5M-04`에 따라 최종 C5 foreground mapping으로 승인됐다.

| 책임                      | Spectrum alias                                        |     Light |      Dark | Specimen 용도                                                      |
| ------------------------- | ----------------------------------------------------- | --------: | --------: | ------------------------------------------------------------------ |
| default content           | `neutral-content-color-default` → `gray-800`          | `#292929` | `#dbdbdb` | Heading, body, primary icon, 중요한 label과 value                  |
| subdued content           | `neutral-subdued-content-color-default` → `gray-700`  | `#505050` | `#afafaf` | Metadata, helper, timestamp, table header, secondary icon          |
| default interaction state | `neutral-content-color-hover/down/focus` → `gray-900` | `#131313` | `#f2f2f2` | Hover, pressed, content-focus state의 default interactive content  |
| subdued interaction state | subdued hover/down/selected → `gray-800`              | `#292929` | `#dbdbdb` | Hover, pressed, focus, selected 상태의 subdued interactive content |
| disabled content          | `disabled-content-color` → `gray-400`                 | `#c6c6c6` | `#444444` | 실제로 사용할 수 없고 비필수인 control과 icon 전용                 |

`gray-900`은 static heading에 사용하지 않았다. `gray-600`은 text에 사용하지 않았다.
Secondary와 tertiary semantic responsibility는 Spectrum subdued value를 공유했다.

## Specimen 범위

| Scene           | Content 압력                                                                                                                        | Foreground 질문                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Surface matrix  | Light/Dark의 `canvas`, `surface`, `sunken`, `raised`, opaque `overlay` 위 default, subdued, disabled text/icon mark                 | Scrim 위에 content를 놓지 않고도 exact alias가 승인된 모든 adjacency에서 읽히는가?                               |
| Music Discovery | 한국어 control, 한/일/영 혼합 identity, 긴 title, artist, update time, helper copy, 사용할 수 없는 difficulty와 disabled comparison | 세 번째 local gray 없이 하나의 default와 하나의 subdued readable value로 discovery hierarchy를 유지할 수 있는가? |
| Global Rankings | 영어 control, 일본어 player, 긴 username, 밀도 높은 header, current-user row, rank/Grd 숫자, timestamp, 사용할 수 없는 pagination   | 밀도 높은 default value의 scanning을 약화하지 않고 subdued header와 metadata가 공존하는가?                       |
| States          | 긴 일본어 identity, 한/영 metadata, helper, empty, recoverable error, default/subdued action, selected와 disabled control           | Color만을 유일한 cue로 쓰지 않으면서 Spectrum의 intact state transition을 이해할 수 있는가?                      |

Scene, appearance, interaction control은 presentation 전용이며 새로운 NosLog product control을
제안하지 않는다.

## Browser 측정 기록 — 2026-08-08

### Responsive 및 content matrix

6개 browser width, 4개 scene, 2개 appearance에서 `48`개 조합을 측정했다. Rendering
host가 specimen 주위 inline space를 차지하므로 `352px`, `422px` browser width에서 각각
정확한 `320px`, `390px` inner specimen width가 나왔다.

| Browser width | Inner visual width | Specimen frame | 목적                                                         |
| ------------: | -----------------: | -------------: | ------------------------------------------------------------ |
|       `320px` |            `273px` |        `273px` | 요구 product minimum보다 작은 추가 압력; scrollbar 소비 포함 |
|       `352px` |            `320px` |        `320px` | 정확한 필수 compact reflow width                             |
|       `360px` |            `328px` |        `328px` | 중간 compact 압력                                            |
|       `422px` |            `390px` |        `390px` | 대표 mobile review canvas                                    |
|       `736px` |            `704px` |        `430px` | 일반 host surface 안에 제한된 specimen                       |
|      `1024px` |            `992px` |        `430px` | 넓은 host surface 안에 제한된 specimen                       |

| Assertion                                                     |          결과 |
| ------------------------------------------------------------- | ------------: |
| Document horizontal overflow                                  | `0 / 48` 실패 |
| Specimen-frame horizontal overflow                            | `0 / 48` 실패 |
| 보이는 content가 specimen inline boundary 밖으로 이탈         | `0 / 48` 실패 |
| 보이는 specimen button/input의 effective height가 `44px` 미만 | `0 / 48` 실패 |
| 처리되지 않은 browser warning 또는 error                      |           `0` |

### Interaction-state matrix

States scene에서 정확한 `390px` inner specimen width로 `6 states × 2 appearances = 12`
조합을 시험했다.

| State               | Default content 결과                          | Subdued content 결과                                | Disabled ownership                             |
| ------------------- | --------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- |
| Rest                | `gray-800`                                    | `gray-700`                                          | 전용 unavailable control은 `gray-400` 유지     |
| Hover               | `gray-900`                                    | `gray-800`                                          | 적용 안 함                                     |
| Pressed             | `gray-900`                                    | `gray-800`                                          | 적용 안 함                                     |
| Focus content state | `gray-900`                                    | `gray-800`                                          | Focus indicator는 C5 foreground 권위 밖에 유지 |
| Selected            | universal selected color 없이 `gray-800` 유지 | `gray-800`로 강화하고 `aria-pressed` semantics 유지 | 적용 안 함                                     |
| Disabled            | `gray-400`, native control disabled           | `gray-400`, native control disabled                 | 필수 정보는 control 밖에 유지                  |

12개 computed browser value 모두 공개된 Spectrum S2 alias와 정확히 일치했다.

### Keyboard 순서

Native tab order는 product fragment에 다음 순서로 도달했다.

1. Label이 있는 more action
2. Default action
3. Subdued action
4. Data-sync guide action
5. Retry action

Unavailable control은 예상대로 건너뛰었다. `tabindex`는 추가하지 않았다. 이는 reachability와
disabled semantics를 입증하지만 최종 focus-ring color나 geometry를 승인하지 않는다.

### 기술 gate 완료 — 2026-08-09

#### 실제 200% browser zoom

Chrome의 표시 zoom control에서 `200%`를 확인했다. 기본 desktop host에서
`devicePixelRatio`는 100%의 `2`에서 200%의 `4`로 바뀌었고 page CSS viewport는
`1450px`에서 `725px`로 절반이 됐다. 이어 같은 실제 200% zoom을 유지한 채 임시 host
override로 대표 compact CSS width와 최소 compact CSS width를 시험했다.

| Host 조건                  | Chrome zoom | Page inner width | Document client width | Dark/Light × scene | 결과 |
| -------------------------- | ----------: | ---------------: | --------------------: | -----------------: | ---- |
| 기본 desktop host          |      `200%` |          `725px` |               `718px` |                `8` | 통과 |
| `780 × 1200` host override |      `200%` |          `390px` |               `383px` |                `8` | 통과 |
| `640 × 1200` host override |      `200%` |          `320px` |               `313px` |                `8` | 통과 |

실제 zoom `24`개 조합의 결과는 다음과 같다.

| Assertion                                                      |          결과 |
| -------------------------------------------------------------- | ------------: |
| Document horizontal overflow                                   | `0 / 24` 실패 |
| Specimen-frame horizontal overflow                             | `0 / 24` 실패 |
| 보이는 content가 document inline boundary 밖으로 이탈          | `0 / 24` 실패 |
| 보이는 product button/input이 `44px` effective CSS height 미만 | `0 / 24` 실패 |

Presentation 전용 specimen control은 product target이 아니므로 product-control height
assertion에서 제외했다. 앞서 통과한 `273px` reflow는 계속 유용한 보충 pressure evidence지만
실제 200% gate는 더 이상 그것에 의존하지 않는다.

#### Active forced colors

Chrome DevTools Rendering emulation을 `forced-colors: active`로 설정하고 측정 전에
`matchMedia('(forced-colors: active)').matches === true`를 runtime에서 확인했다. 네 scene과
두 appearance에서 active 조합 `8`개를 시험했다.

| Assertion                                                      |         결과 |
| -------------------------------------------------------------- | -----------: |
| Document 또는 specimen-frame horizontal overflow               | `0 / 8` 실패 |
| `forced-color-adjust: none`을 사용하는 product descendant      |          `0` |
| Dark와 Light content가 같은 user-agent system palette로 대체   |         통과 |
| 선택된 product action이 `aria-pressed="true"` 유지             |         통과 |
| Unavailable product action이 native `disabled` control 유지    |         통과 |
| Tab 순서가 disabled control을 건너뛰고 다음 필수 action에 도달 |         통과 |
| Focus된 필수 action이 보이는 user-agent `auto` outline 유지    |         통과 |

Emulation 중에는 system color가 custom Spectrum value를 의도적으로 대체했으며 mapping은
사용자 preference를 무력화하지 않았다. 최종 focus-ring color와 geometry는 계속 C5 foreground
권위 밖이다. 정리 전 emulation을 명시적으로 `No emulation`으로 되돌리고 runtime
forced-colors가 `false`가 된 것을 확인했으며, DevTools를 닫고 browser zoom과 임시 host
override도 복원했다.

## Exact Adjacency 기록

비율은 exact sRGB value를 사용한다. 반복되는 `canvas`/`raised`/`overlay`와
`canvas`/`sunken` 값은 승인된 `M-A` 관계를 의도적으로 반복한다.

### Light

| Foreground                  | Canvas `#fff` | Surface `#f8f8f8` | Sunken `#e9e9e9` | Raised `#fff` | Overlay `#fff` |
| --------------------------- | ------------: | ----------------: | ---------------: | ------------: | -------------: |
| state `gray-900 #131313`    |     `18.58:1` |         `17.50:1` |        `15.30:1` |     `18.58:1` |      `18.58:1` |
| default `gray-800 #292929`  |     `14.55:1` |         `13.70:1` |        `11.98:1` |     `14.55:1` |      `14.55:1` |
| subdued `gray-700 #505050`  |      `8.06:1` |          `7.59:1` |         `6.64:1` |      `8.06:1` |       `8.06:1` |
| disabled `gray-400 #c6c6c6` |      `1.71:1` |          `1.61:1` |         `1.41:1` |      `1.71:1` |       `1.71:1` |

### Dark

| Foreground                  | Canvas `#111` | Surface `#1b1b1b` | Sunken `#111` | Raised `#222` | Overlay `#222` |
| --------------------------- | ------------: | ----------------: | ------------: | ------------: | -------------: |
| state `gray-900 #f2f2f2`    |     `16.87:1` |         `15.39:1` |     `16.87:1` |     `14.21:1` |      `14.21:1` |
| default `gray-800 #dbdbdb`  |     `13.64:1` |         `12.44:1` |     `13.64:1` |     `11.49:1` |      `11.49:1` |
| subdued `gray-700 #afafaf`  |      `8.61:1` |          `7.85:1` |      `8.61:1` |      `7.25:1` |       `7.25:1` |
| disabled `gray-400 #444444` |      `1.94:1` |          `1.77:1` |      `1.94:1` |      `1.63:1` |       `1.63:1` |

Default와 subdued는 모든 adjacency에서 normal-text 기준을 통과한다. Disabled는 의도적으로
reading content가 아니며 instruction, reason, current state, recovery path를 소유할 수 없다.

## Browser 검토 중 발견한 수정

첫 rendering에서는 일반 button inheritance selector가 base subdued-interaction selector보다
우선했다. 그 결과 올바른 변수가 존재했는데도 resting subdued action이 필수 `gray-700` 대신
`gray-800`로 해석됐다.

Selector ownership을 수정한 뒤 12-state browser matrix를 다시 실행해 다음을 확인했다.

- Dark subdued rest `#afafaf`, Light subdued rest `#505050`
- Subdued hover/pressed/focus/selected는 Dark `#dbdbdb`, Light `#292929`로 강화
- Disabled state는 Dark `#444444`, Light `#c6c6c6`로 해석

이 수정은 semantic map을 variable 선언만 보고 추정하지 않고 computed component value로
검증해야 하는 이유를 보여준다.

## 초기 관찰

1. Static heading에는 `gray-900`이 필요하지 않았다. 네 scene 모두에서 `gray-800`이 type
   size, weight, placement, spacing을 통해 명확한 hierarchy를 유지했다.
2. 하나의 `gray-700` subdued value가 두 appearance에서 artist, metadata, helper,
   timestamp, table-header content에 읽기 가능했다. 측정된 hierarchy failure는
   `gray-600`이나 다른 system의 세 번째 단계를 요구하지 않았다.
3. 새 color를 도입하지 않고 subdued-to-default state transition을 볼 수 있었다.
   Selection에는 color alone이 아니라 `aria-pressed` 또는 structure가 계속 필요했다.
4. Disabled content는 특히 Light `sunken`, Dark `raised/overlay`에서 의도적으로 매우
   희미하다. Unavailable action이 비필수이고 그 이유나 recovery path가 다른 곳에서 읽힐
   때만 허용할 수 있다.
5. Exact mapping은 sparse identity, dense rankings, empty/error copy, overlay content에서
   모두 절제된 상태를 유지했다. Tailwind나 local neutral은 필요하지 않았다.

사용자는 2026-08-08에 이 관찰을 visual direction으로 수용했다. 남은 기술 gate는 측정된
실패 없이 2026-08-09에 완료됐다.

## 사용자 검토 결과 및 다음 gate

필수 기술 근거가 완료된 뒤 사용자는 2026-08-09에 exact `F-A`를 최종 C5 foreground
mapping으로 명시적으로 승인했다. `C5M-04`는 종료됐다.

이 승인은 위에 기록된 foreground responsibility와 exact Spectrum value만 포함한다.
Active forced-colors test에서 관찰된 흰색 system outline을 일반 Dark-theme boundary로
승인하지 않는다. 해당 outline은 browser/user accessibility override로 유지하며 일반 theme
boundary 선택은 별도 `C5M-05` gate, focus는 이후의 독립 gate로 남는다.

따라서 다음 color-foundation 작업은 일반 theme neutral boundary에 대한 폭넓은 reference
조사와 사용자 검토다. 이 foreground 승인으로 어떤 boundary 후보도 승격되지 않는다.

## 의사결정 및 검증 로그

| ID       | 항목                                                                                                                                                                           | 상태                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `C5V-01` | 승인된 `M-A` surface에서 exact `F-A` foreground alias만 시험하고 local neutral 또는 heading color를 추가하지 않는다.                                                           | `Observed specimen rule`                 |
| `C5V-02` | 수정 후 `48`개 responsive/content 조합에서 기록된 overflow, escape, target-height, runtime 실패가 없다.                                                                        | `Observed`                               |
| `C5V-03` | 수정 후 `12`개 interaction 조합이 Spectrum default, subdued, state, disabled value와 정확히 일치한다.                                                                          | `Observed`                               |
| `C5V-04` | Static heading은 default `gray-800`을 유지하며 `gray-900`은 interaction-state 전용이다.                                                                                        | `Approved visual direction — 2026-08-08` |
| `C5V-05` | Secondary와 tertiary semantic responsibility는 subdued `gray-700`을 계속 공유할 수 있으며 현재는 별도의 세 번째 value가 정당화되지 않는다.                                     | `Approved visual direction — 2026-08-08` |
| `C5V-06` | Disabled `gray-400`은 실제로 사용할 수 없고 비필수이며 readable explanation이 다른 곳에 있는 content에만 허용한다.                                                             | `Approved visual contract — 2026-08-08`  |
| `C5V-07` | Computed-value 검토에서 subdued rest가 `gray-700` 대신 `gray-800`을 상속하던 문제를 발견하고 수정했다.                                                                         | `Corrected`                              |
| `C5V-08` | Minimum 미만 reflow와 선언된 forced-colors fallback은 보충 근거일 뿐 실제 200% zoom 및 active forced-colors test를 대체하지 않는다.                                            | `Completed — 2026-08-09`                 |
| `C5V-09` | 사용자 visual review와 남은 기술 gate가 끝날 때까지 `C5M-04`를 열린 상태로 두고 최종 명시적 사용자 결정 뒤에만 종료한다.                                                       | `완료 — C5M-04 2026-08-09 승인`          |
| `C5V-10` | Tailwind, local neutral 추가 또는 다른 system value 없이 exact `F-A`를 유일한 C5 foreground mapping으로 유지한다.                                                              | `Approved — 2026-08-09`                  |
| `C5V-11` | 실제 Chrome 200% zoom이 desktop, `390px`, `320px` CSS width의 Dark/Light scene `24`개 조합에서 overflow나 product target-height 실패 없이 통과했다.                            | `Observed — 2026-08-09`                  |
| `C5V-12` | Active forced colors가 system-color 대체, semantic selected/disabled state, keyboard reachability, `forced-color-adjust: none` 0건으로 Dark/Light scene `8`개 조합을 통과했다. | `Observed — 2026-08-09`                  |
