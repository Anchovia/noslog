# NosLog 2.0 C5 Difficulty UI Exact-Source 비교

## 문서 관리

- 상태: `Proposed — UI difficulty mapping 사용자 검토 대기`
- 정본 언어: 영어
- 영어 정본:
  [56-foundation-c5-difficulty-ui-exact-source-comparison.md](./56-foundation-c5-difficulty-ui-exact-source-comparison.md)
- 날짜: 2026-08-10
- 상위 정정:
  [문서 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.ko.md)
- 지배하는 viewer 결정:
  [문서 07, VIEW-07](./07-chart-viewer-page-brief.ko.md)
- 시각 근거:
  [c5-difficulty-ui-source-comparison.html](./specimens/c5-difficulty-ui-source-comparison.html)
- 범위: chart viewer/editor 전체 밖의 repeated-scanning 일반 DOM UI difficulty marker
- 제외: 모든 viewer/editor page, shell, control, responsive behavior, accessibility
  behavior, PixiJS/WebGL 또는 Canvas-rendered element, geometry, calculation 및 editor behavior

## 정정 기록

Superseded된 첫 draft는 chart-viewer hand color를 열린 Foundation 결정으로 잘못
취급했다. 이는 기존 renderer와 chart mathematics를 redesign 범위 밖에 두는 승인된
`VIEW-07`, 그리고 사용자의 2026-08-10 명시적 보존 지시와 충돌했다.

잘못된 hand-color 비교와 표본은 제거했다. 기존 renderer 값은 구현된 그대로 유지한다.

- Falling PixiJS renderer: left `0x4fc8dc`, right `0xe85f5d`;
- Full-sheet Canvas renderer 및 paired DOM legend: left `#62d4e8`, right `#f06b68`.

이 값은 잠긴 implementation constant이며 Foundation token candidate가 아니다. 이 문서는
그 값을 평가·정규화·remap하거나 변경을 추천하지 않는다.

## 고정 요구사항과 남은 질문

해당 repeated-scanning 일반 UI에서는 Normal, Hard, Expert, Real을 서로 다른 네 가지
지속 색상으로 구분해야 한다. 이는 승인된 요구사항이며 color와 neutral 중 하나를 다시
고르는 문제가 아니다. 남은 `13B` 질문은 이를 구현할 정확한 authoritative Light/Dark
source 값과 네 role mapping을 무엇으로 할지다.

Eligible UI 예시는 여러 chart difficulty를 보여 주는 music list와 music detail
difficulty summary다. Viewer/editor page나 그 하위 component는 절대 eligible하지 않다.

## Source 필터 결과

문서 `55`의 15개 독립 source group을 더 좁은 UI role 기준으로 필터했다. 공식
NOSTALGIA와 rhythm-game source는 보이는 difficulty name, level 및 fixed order를
지지한다. Accessibility source는 redundant non-color cue를 요구한다. Atlassian,
Carbon 및 SAP chart palette는 data-visualization 전용이므로 global difficulty UI가 될
수 없다. 검토한 source 중 Adobe Spectrum S2만 complete, non-deprecated adaptive
green/orange/red/purple `visual-color` family를 공개한다.

이 source 결과가 role assignment를 upstream Spectrum semantic으로 만들지는 않는다.
Value는 exact source fact이고 Normal/Hard/Expert/Real assignment는 명시적인 사용자
승인이 필요한 proposed NosLog domain alias다. 이 한계는 이미 승인된 서로 다른 네 색
요구사항을 다시 열지 않는다. Candidate가 충분하지 않으면 exact-value 조사를 계속하거나
사용자에게 다시 보고하며, 임의로 neutral fallback을 적용하지 않는다.

## 정확한 proposed 값

| Difficulty | Spectrum S2 alias     | Light     | Dark      |
| ---------- | --------------------- | --------- | --------- |
| Normal     | `green-visual-color`  | `#0BA45D` | `#068850` |
| Hard       | `orange-visual-color` | `#E86A00` | `#E06400` |
| Expert     | `red-visual-color`    | `#F03823` | `#CD2E1D` |
| Real       | `purple-visual-color` | `#A65CE7` | `#AD69E9` |

어떤 값도 sampling, hue shift, interpolation, Tailwind 혼합 또는 renderer palette에서
가져오지 않았다.

## 통제된 후보

| Candidate                          | Recipe                                                                                                                | 장점                                                      | 위험                                                                                          | 상태                                  |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------- |
| `DU-D1 · Spectrum adaptive marker` | 작은 non-text marker에 exact Spectrum value를 사용하고 label, level, fixed order 및 neutral selection을 유지한다.     | 필요한 네 방향의 시각 구분을 절제된 chroma로 충족한다.    | 4-role assignment는 published Spectrum difficulty 계약이 아닌 proposed NosLog domain alias다. | `Candidate — exact mapping 승인 대기` |
| `DU-D0 · Neutral pattern/order`    | 하나의 neutral family와 서로 다른 pattern/order를 사용하고 label, level, fixed order 및 neutral selection을 유지한다. | Color scanning이 사라지는 결과를 보여 주는 비교 기준이다. | 서로 다른 네 난이도 색 요구사항을 위반한다.                                                   | `Rejected — distinct color 필요`      |

## 엄격한 component 경계

`DU-D1`이 승인되면 chroma는 viewer/editor 전체 밖의 repeated-scanning 일반 DOM UI에서 작은
difficulty marker에만 나타날 수 있다. 다음은 착색할 수 없다.

- Difficulty text, card background, section, navigation, link, button, selection,
  focus, validation 또는 feedback;
- Chart viewer/editor의 모든 page, shell, control, canvas, WebGL output, note, path,
  hand guide, legend, piano, timing guide 또는 renderer가 소유하는 모든 pixel;
- `13C`에 남는 score band 또는 FAST/SLOW data.

Selection은 neutral boundary와 명시적인 selected label을 유지한다. Color는
selected/unselected 상태에서 의미가 바뀌지 않는다.

## 측정한 marker contrast

| Marker       | Light on `#FFFFFF` | Dark on `#222222` | 결과                       |
| ------------ | -----------------: | ----------------: | -------------------------- |
| Normal green |           `3.24:1` |          `3.52:1` | `3:1` non-text target 통과 |
| Hard orange  |           `3.23:1` |          `4.54:1` | `3:1` non-text target 통과 |
| Expert red   |           `3.97:1` |          `3.03:1` | 통과; Dark 여유가 작음     |
| Real purple  |           `3.96:1` |          `4.53:1` | `3:1` non-text target 통과 |

이 값은 marker 값이며 text color가 아니다. 모든 text는 승인된 Spectrum neutral
foreground를 유지한다.

## 브라우저 검증 — 2026-08-10

정정된 표본을 실제 `1440px`, `390px`, `320px` CSS viewport에서 검증했다. Page와 두
candidate 모두 horizontal overflow가 없었다. DOM에는 `canvas` 또는 WebGL/rendering
element가 `0`개였다. Color-off에서 모든 proposed marker가 neutral로 바뀌어도
difficulty name, level, order, pattern 및 명시적인 selected label이 유지됐다. 완료
run의 console warning/error는 없었다.

이 검증은 비교 표본이 정정된 경계를 지킨다는 것만 입증한다. Production chart
viewer/editor를 test하거나 수정하지 않았다.

## Decision log

| ID       | Entry                                                                                                                                                              | 상태                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `DUS-01` | 기존 viewer/editor의 page, control, responsive·accessibility behavior, renderer output, palette, mathematics 및 editor model을 포함한 전체 경험을 그대로 보존한다. | `Approved correction — 2026-08-10`              |
| `DUS-02` | 잘못된 hand-color exact-source 비교와 표본을 제거한다.                                                                                                             | `Completed`                                     |
| `DUS-03` | Package `13B` exact-source 검토를 viewer/editor 전체 밖의 repeated-scanning 일반 difficulty DOM UI로 제한한다.                                                     | `Approved scope correction`                     |
| `DUS-04` | 필요한 네 방향 구분을 위한 후보 하나로 exact Spectrum adaptive marker를 보존하며 role mapping은 미승인으로 둔다.                                                   | `Candidate evidence`                            |
| `DUS-05` | 서로 다른 네 난이도 색을 유지하고 정확한 authoritative Light/Dark 값과 네 role mapping을 선택한다.                                                                 | `요구사항 승인, exact mapping 사용자 검토 대기` |
| `DUS-06` | 정정된 difficulty-only 표본을 desktop, `390px`, `320px`와 renderer element `0`개 조건으로 검증한다.                                                                | `Completed — 2026-08-10`                        |

## 승인 경계

서로 다른 네 난이도 색은 승인 및 재확인됐으며 neutral `DU-D0`는 Rejected다. 정확한
Light/Dark 값과 네 role mapping은 아직 승인되지 않았다. Viewer/editor 전체 보존 예외는
이미 승인되었고 이 비교의 선택지가 아니다. Package `13B`는 진행 중이고 고정된 관리
진행률은 `12.5 / 18 = 69%`이다.
