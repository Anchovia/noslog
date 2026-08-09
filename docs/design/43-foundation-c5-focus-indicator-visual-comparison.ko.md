# NosLog 2.0 C5 포커스 표시기 시각 비교

[Canonical English source](43-foundation-c5-focus-indicator-visual-comparison.md)

## 문서 관리

| 필드           | 값                                                             |
| -------------- | -------------------------------------------------------------- |
| 상태           | `기술 검증 완료 — FI-C를 validation 대상으로 선택; gate Open`  |
| 날짜           | `2026-08-09`                                                   |
| Canonical 언어 | English                                                        |
| 결정 gate      | Source 선택 전 `C5F-04` 동일 조건 비교                         |
| 상속된 승인    | `M-A` surface, `F-A` foreground, `NB-A` boundary, `NI-A` state |

이 문서는 [문서 42](42-foundation-c5-focus-indicator-reference-comparison.ko.md)가
요구한 시각 비교를 기록한다. 사용자는 2026-08-09 Fluent 2 `FI-C`를 전용 measured
validation 대상으로 선택했다. Production token, component alias, signature color,
feedback color, 최종 component geometry 또는 application 구현은 승인하지 않는다.

## Artifact

편집 가능한 비교는
[C5 포커스 표시기 비교 specimen](specimens/c5-focus-indicator-comparison.html)이다.
이는 guide 조사 fixture이며 production component library나 최종 Claude Design
화면이 아니다.

Artifact에는 세 scene이 있다.

| Scene                   | 근거                                                                                 | 결정 용도                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `10-source lineup`      | 유지 관리되는 10개 reference를 같은 card 구조로 놓고 Light와 Dark 근거를 별도로 표시 | 실제 조사 폭을 보여 주고 누락된 static 근거를 채우지 않은 채 드러낸다. |
| `Complete-pair context` | Spectrum S2, Fluent 2, Carbon 처리를 같은 action, selected row 및 field에 적용       | 사용할 수 있는 Light/Dark 색상 방향을 공개한 세 reference를 비교한다.  |
| `Selection limits`      | 적격성, 누락 source, accent 결합, browser 불안정성 및 후속 validation 제약           | 시각 선호를 승인된 구현 계약으로 오인하지 않게 한다.                   |

Scene, appearance, review width 및 text-scale control은 specimen presentation control일
뿐이다. 새로운 NosLog product control을 제안하지 않는다.

## 10개 Reference 나열

| #   | Reference          | 렌더링한 시각 근거                                                                 | Coverage 분류                                   | 선택 시 결과                                                                                             |
| --- | ------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 01  | Adobe Spectrum S2  | Light `#4b75ff`, Dark `#4069fd`, `2px` indicator, `2px` gap                        | 완전한 Light/Dark semantic pair 및 geometry     | 바로 사용자 선택으로 진행하고, 선택 시 measured validation으로 이동할 수 있다.                           |
| 02  | Microsoft Fluent 2 | Light black, Dark white, 일반 `2px` focus helper                                   | 완전한 색상 polarity; recipe는 component별 차이 | 선택 시 하나의 global ring을 만들지 않고 Fluent의 component-owned multi-stroke behavior를 보존해야 한다. |
| 03  | IBM Carbon         | Light `#0f62fe`, Dark white, 일반 `2px` focus border                               | 일반 dual-mode pair; component 예외 존재        | Blue 값만이 아니라 Carbon focus 및 inset governance를 도입한다.                                          |
| 04  | Atlassian          | Light fallback `#388bff`, `2px` ring, `2px` gap                                    | Light 정확; 안정적인 static Dark 값 누락        | 온전하게 선택하기 전에 공식 theme artifact를 추가 조사해야 한다.                                         |
| 05  | GitHub Primer      | Light `#0969da`, `2px` outline, `-2px` offset                                      | Light 정확; 표준 Dark 값 누락                   | 온전하게 선택하기 전에 공식 theme artifact를 추가 조사해야 한다.                                         |
| 06  | GOV.UK             | Yellow `#ffdd00`, black `#0b0c0c`, `3px` width를 정확한 색상 및 method 근거로 표시 | 완전한 service-theme method; normal Dark 없음   | 완전한 dual-mode product mapping으로 취급할 수 없다.                                                     |
| 07  | USWDS              | Default `#2491ff`, `4px`, zero offset                                              | 하나의 static default; 고정 Dark pair 없음      | 완전한 dual-mode product mapping으로 취급할 수 없다.                                                     |
| 08  | VA.gov             | On-light gold `#face00`; 수치 geometry는 의도적으로 렌더링하지 않음                | Light 색상만 존재; geometry 및 Dark 불완전      | 온전한 선택 전에 누락된 geometry와 Dark 근거가 필요하다.                                                 |
| 09  | Radix Themes       | Swatch를 추정하지 않음; 두 mode 모두 accent-derived                                | Theme-dependent, 독립 pair 없음                 | 승인된 독립 `focus-outer` ownership과 충돌한다.                                                          |
| 10  | Current Chrome UA  | 문서 `41` Dark 관찰값 `rgb(153, 200, 255)`, `1px`                                  | 하나의 browser 관찰값, 안정적 mapping 아님      | Design-guide source가 아니라 fallback 및 forced-colors 근거로 남긴다.                                    |

WCAG와 WAI-ARIA APG는 문서 `42`의 acceptance baseline으로 유지한다. 기준을 공개할
뿐 focus palette를 공개하지 않으므로 palette 후보로 반복하지 않는다. Material, SAP
Fiori, PatternFly 및 Salesforce는 문서 `42`의 유효한 governance 근거로 유지한다.
공개 근거가 추정 없이 렌더링할 추가 intact static pair를 제공하지 않았기 때문이다.

## 누락 근거 규칙

Source가 문서 `42`에서 수집한 근거 안에 안정적인 static mode 값이나 완전한 geometry를
공개하지 않으면 specimen은 렌더링하지 않은 점선 field를 의도적으로 표시한다.

다음 행위를 하지 않는다.

1. Light 값을 발명한 Dark 값으로 재사용;
2. Tailwind 또는 현재 application palette에서 누락 값을 파생;
3. 다른 system의 gray, blue, yellow 또는 geometry 보간;
4. 한 system의 color와 다른 system의 gap, offset, inner band 또는 component 예외를
   결합; 또는
5. accent-derived system을 독립 focus source로 취급.

사용자가 Atlassian 또는 Primer 같은 partial reference를 선호하면 다음 단계는 targeted
upstream theme-artifact 조사다. 누락 pair를 조용히 완성하지 않는다.

## 동일 조건 계약

비교는 다음 NosLog 입력을 고정한다.

- 승인된 `M-A` Light/Dark surface;
- 승인된 `F-A` readable content;
- 승인된 `NB-A` neutral boundary;
- 공유 row fixture의 승인된 neutral `NI-A` selected 처리;
- 동일한 한국어, 일본어 및 영어 혼합 content; 그리고
- signature, feedback, gradient, glow, shadow 또는 Tailwind color가 없는 정사각형
  measurement-only fixture geometry.

`Complete-pair context` scene은 각 source의 공개된 일반 color direction과 일반
geometry를 비교 근거로 사용한다. 모든 upstream system이 button, row, field에 하나의
동일한 recipe를 배정한다고 주장하지 않는다. Component-specific 예외는 source가 계속
소유하며 그 방향을 선택하면 보존하거나 결정을 다시 열어야 한다.

## Browser 측정 기록 — 2026-08-09

In-app test browser가 다음을 실행했다.

`2 appearances × 4 requested widths × 2 text scales × 3 scenes = 48 states`.

| 차원            | 값                                              |
| --------------- | ----------------------------------------------- |
| Appearance      | Dark, Light                                     |
| Requested width | `320px`, `390px`, `768px`, `1120px`             |
| Text scale      | `100%`, `200%` specimen text-pressure control   |
| Scene           | Lineup, complete-pair context, selection limits |

| Assertion                                                     | 결과                 |
| ------------------------------------------------------------- | -------------------- |
| Specimen-frame horizontal overflow                            | `0 / 48` fails       |
| Document horizontal overflow                                  | `0 / 48` fails       |
| Specimen inline boundary 밖으로 이탈한 visible content        | `0 / 48` fails       |
| Active-scene mismatch                                         | `0 / 48` fails       |
| Reference 수가 `10`과 다르거나 dual-mode context가 `3`과 다름 | `0 / 48` fails       |
| 최소 review-control target                                    | `44px`               |
| 정확한 관찰 specimen width                                    | `320/390/768/1120px` |

그다음 실제 browser viewport를 `320px`, `390px`, `1280px`로 설정하고 각각 `320px`,
`390px`, `1120px` review canvas를 사용했다.

| Browser viewport | Requested specimen | 관찰 frame | Document overflow | Frame overflow |
| ---------------: | -----------------: | ---------: | ----------------: | -------------: |
|          `320px` |            `320px` |    `320px` |              None |           None |
|          `390px` |            `390px` |    `390px` |              None |           None |
|         `1280px` |           `1120px` |   `1120px` |              None |           None |

이는 comparison harness와 reflow만 검증한다. 선택된 focus 처리를 문서 `42`가 요구하는
전체 component, state coexistence, clipping, zoom, keyboard 또는 forced-colors
matrix에서 검증하지 않는다.

## 해석

1. Spectrum S2는 완전한 독립 Light/Dark semantic pair와 정확한 global thickness 및
   gap을 제공하면서 승인된 neutral provenance와도 일치하는 유일한 비교 reference다.
2. Fluent와 Carbon은 이전에 문제로 지적한 normal-Dark white focus를 시각적으로
   명확히 보여 준다. 사용자는 Fluent의 Light-black/Dark-white polarity가 무채색이며
   새 chromatic accent를 도입하지 않는다는 이유로 선택했다. Dark의 white signal은
   persistent boundary가 아니라 일시적인 keyboard-visible focus에만 허용된다.
3. Atlassian과 Primer는 계속 시각적으로 유효하지만 누락된 static Dark 근거 때문에 이
   gate에서 intact source를 채택할 수 없다.
4. GOV.UK, USWDS 및 VA.gov은 강한 visibility-first 대안을 보여 준다. 불완전한 normal
   dual-mode product mapping 때문에 새로운 source 결정 없이 바로 채택할 수 없다.
5. Radix와 Chrome은 유용한 대조 사례지만 intact design-guide 후보는 아니다.

이는 조사 결과이며 자율적인 선택이 아니다.

## 결정 기록

| ID       | 문장                                                                                                                                             | 상태                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| `C5V-01` | 승인된 neutral 입력을 고정한 채 하나의 시각 artifact에서 유지 관리되는 10개 reference를 비교한다.                                                | `Completed`                |
| `C5V-02` | 누락된 Dark 값과 geometry를 추정, 보간, 혼합하거나 Tailwind default를 사용하는 대신 비워 둔다.                                                   | `적용된 조사 규칙`         |
| `C5V-03` | Spectrum, Fluent 및 Carbon을 dual-mode 시각 방향으로 취급하되 component-specific 예외를 universal recipe로 잘못 표시하지 않는다.                 | `Observed`                 |
| `C5V-04` | Atlassian, Primer, GOV.UK, USWDS, VA.gov, Radix 및 Chrome을 정확한 적격성 한계와 함께 표시한다.                                                  | `Observed`                 |
| `C5V-05` | 어느 후보든 문서 42가 요구하는 전용 measured validation으로 이동하기 전에 방향 하나를 선택하거나 누락 source를 targeted research하도록 요청한다. | `Closed — FI-C 선택`       |
| `C5V-06` | Persistent white Dark boundary나 production token을 승인하지 않은 채 Fluent 2 achromatic polarity를 measured validation으로 가져간다.            | `사용자 선택 — 2026-08-09` |

## 사용자 선택 gate

사용자는 Fluent 2 `FI-C`를 선택했다.
[문서 44](44-foundation-c5-fluent-focus-specimen-validation.ko.md)가 현재 진행 중인
전용 validation을 기록한다. 이는 validation만 허용한다. Production token,
component alias, signature color, feedback color 또는 application 구현은 계속
미승인이다.
