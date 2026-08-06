# NosLog 2.0 Foundation S2 악곡 상세 구조 검증

## 문서 관리

- 상태: `승인됨 — S2 First Review 완료`
- Canonical 언어: English
- Canonical 문서:
  [28-foundation-s2-music-detail-structural-validation.md](./28-foundation-s2-music-detail-structural-validation.md)
- 시작일: 2026-08-06
- 승인일: 2026-08-06
- 범위: 대표 Specimen `S2`에서 승인된 Foundation Typography, Spacing, Grid,
  Container, Density 및 Target 계약을 구조적으로 검증
- 승인 경계: 이 문서는 Color, Material, 최종 Component Styling, 최종 Chart
  Geometry, Production 화면 구성 또는 Application 구현을 승인하지 않음

## 관련 권위 문서

- [악곡 상세 페이지 브리프](./05-music-detail-page-brief.ko.md)
- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation Semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation Typography 및 Layout 후보](./26-foundation-typography-layout-candidates.ko.md)
- [S1 탐색 구조 검증](./27-foundation-s1-discovery-structural-validation.ko.md)

승인된 악곡 상세 브리프가 제품 동작, Content 소유권, 순서, Localization, 상태 및
반응형 의미를 소유합니다. 문서 `25`와 `26`은 공유 Foundation 계약을 소유합니다.
이번 검증은 충돌을 드러낼 수 있지만 해당 권위를 조용히 바꿀 수 없습니다. 중요한
충돌은 명시적인 수정 결정으로 사용자에게 되돌려야 합니다.

## 검증 목적

`S2`는 현행 고정 `390px` Application Column을 유지하지 않고도 승인된 Foundation이
집중된 하나의 악곡 정체성과 선택 채보 Context를 지원할 수 있는지 시험합니다. 측정
근거로 다음 질문에 답해야 합니다.

1. 원문 악곡 제목, 아티스트, 선택 채보 Context, 네 난이도, 두 자료 Action 및 지역
   영역 Switcher가 `320 CSS px`에서 이해 가능한가?
2. 실제 최장 혼합 Script 제목을 Music Detail에서 가로 Overflow, 잘림 또는 새 Type
   size 예외 없이 완전히 줄바꿈할 수 있는가?
3. 선택적 번역·읽기 제목 Trigger와 Anchored 비 Modal Popover를 Layout 이동 없이
   Hover, Focus, Click, Touch 및 Keyboard로 동일하게 사용할 수 있는가?
4. 좁은 폭에서는 전체 Label Selector 하나를 사용하고, 측정된 넓은 Region에서는 두
   Control을 동시에 노출하지 않은 채 전체 Label 탭 네 개로 바꿀 수 있는가?
5. 채보 정보는 간결한 Fact Panel을 유지하고, 내 기록은 베스트 기록, 누적 Fact,
   성장 추이, 최근 플레이 및 접힌 분석에 승인된 계층을 부여할 수 있는가?
6. `wide` `1440px` 상한에서 모든 Label을 키우거나 짧은 Fact를 Canvas 전체로 늘리지
   않고 추가 공간을 분석에 사용할 수 있는가?
7. 기본, 긴 제목, 선택 Data 누락, 비활성 Action, 비로그인, Empty, Loading 및 부분
   기록 상태가 같은 Context와 Focus model을 유지하는가?

## 비목표

- 최종 Page Design이나 Production-ready Figma 화면이 아닙니다.
- 현행 NosLog 시각 처리를 재현하거나 승인하지 않습니다.
- Foundation Color, Border, Radius, Elevation, Icon 또는 Motion Token을 선택하지
  않습니다.
- WebGL 채보 뷰어를 재설계하거나 Renderer를 이 Page 안으로 옮기지 않습니다.
- `S3`에 배정된 전문 고밀도 Ranking 검증을 완료하지 않습니다.
- NosLog 2.0 Application Code를 구현하지 않습니다.
- Legacy NOSTORY Figma를 현재 Layout 권위로 사용하지 않습니다.

## 관찰된 기준선

### Repository 및 Browser 근거 — 2026-08-05

| ID          | 관찰                                                                                                                                                             | 상태       |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S2-OBS-01` | 현행 악곡 상세 Wrapper는 `1280px` Viewport에서도 약 `390px` 폭을 유지하여 Desktop 공간 대부분을 사용하지 않습니다.                                               | `Observed` |
| `S2-OBS-02` | `320px` Viewport에서 현행 한국어 영역 행은 가로 Overflow하며, 일본어와 영어 Label은 더 크게 Overflow합니다.                                                      | `Observed` |
| `S2-OBS-03` | Query 없는 로그인 진입은 내 기록을 열지만 승인된 로그인·비로그인 기본값은 채보 정보입니다.                                                                       | `Observed` |
| `S2-OBS-04` | 패턴 경향과 점수 분포가 현재 악곡 정보 안에 있지만 승인된 소유권은 각각 서열·평가와 랭킹으로 옮깁니다.                                                           | `Observed` |
| `S2-OBS-05` | 채보 보기와 플레이 영상은 현재 악곡 정보 하단에 있습니다. 채보 보기는 사용할 수 없을 때 Link 의미에서 사라질 수 있고 플레이 영상은 새 탭을 강제합니다.           | `Observed` |
| `S2-OBS-06` | 현행 Header는 `96px` 재킷과 별도 레벨 상수 Column을 제목 Region보다 우선하여, 실제 최장 제목이 좁은 폭에서 작은 일부만 말줄임됩니다.                             | `Observed` |
| `S2-OBS-07` | 현행 Page는 승인된 요청 시 번역·읽기 제목 공개 대신 일본어 읽기를 상시 Caption으로 Rendering합니다.                                                              | `Observed` |
| `S2-OBS-08` | 현행 Altale Real 기록에는 대표 고밀도 Data인 점수 `976,654`, Grd `112`, 플레이 `34`회, 최대 Combo `490`, 진행도, 판정 분석, 점수 추이 및 최근 플레이가 있습니다. | `Observed` |

이 관찰은 Migration 및 실패 근거일 뿐 Specimen의 Layout이나 Styling 권위가 아닙니다.

## 검증할 승인 계약

### 지속 Context 및 Content 순서

지원하는 모든 폭에서 다음 의미 순서를 고정합니다.

1. 지속 원문 악곡 정체성과 선택 채보 Context;
2. `Normal → Hard → Expert → Real` 순서의 한 행 네 가지 난이도 Selector;
3. `채보 보기 → 플레이 영상` 순서의 안정적인 선택 채보 자료 Action;
4. 하나의 지역 Content 영역 Switcher;
5. 선택된 의미 Panel 하나만.

네 영역은 다음 순서를 유지합니다.

1. 채보 정보;
2. 내 기록;
3. 랭킹;
4. 서열·평가.

Query 없는 진입은 인증 여부와 관계없이 채보 정보를 엽니다. 자료 Action을 사용할 수
없어도 자리를 유지하고 별도 **채보 없음** 문구 대신 비활성 의미를 사용합니다.
플레이 영상은 현재 Browsing Context를 사용합니다.

### 집중 악곡 정체성과 긴 제목 결정

- 모든 Locale에서 원문 제목을 보이는 주요 정체성으로 유지합니다.
- 반복 탐색 결과와 달리 악곡 상세는 원문 제목을 한 줄로 강제하지 않습니다. 공간이
  필요하면 완전히 줄바꿈하며 Ellipsis, Line clamp, 가로 Scroll, Tracking 압축 또는
  더 작은 Type role을 사용하면 안 됩니다.
- 사용자는 2026-08-06 이 구분을 명시적으로 승인했습니다. 반복 List/Grid 정체성은
  승인된 한 줄 Ellipsis를 유지하고, 집중 악곡 상세는 줄바꿈한 전체 원문 제목을
  보존합니다.
- 아티스트는 별도의 보조 행을 유지하며 독립적으로 줄바꿈할 수 있습니다.
- 승인된 번역 제목이나 일본어 읽기가 있으면 보이는 언어·번역 아이콘 하나를 원문 제목
  Group 옆에 둡니다. Hover와 Focus로 Anchored Popover를 열고, Click과 Touch로
  Toggle하며, `Escape`, 외부 활성화 및 승인된 Focus 이탈 동작으로 닫습니다.
- Popover는 줄바꿈한 전체 보조 정체성을 담고 Page Layout을 이동시키지 않습니다.
  승인 값이 없으면 Trigger와 그 공간을 생략합니다.

### 반응형 영역 Switcher

- `320`, `360`, `390`, `430px`에서는 현재 전체 Localized 영역 Label과 Anchored 네
  Option Listbox를 가진 전체 폭 Select-only Combobox 하나를 노출합니다.
- 가로 Scroll 탭, 여러 행 탭, 말줄임, 축약 또는 Icon-only 영역 Label을 사용하지
  않습니다.
- 승인된 Type, Padding, Gap 및 Focus 처리와 함께 한국어·일본어·영어 전체 Label 네
  개가 모두 맞을 때만 Manual activation 탭으로 바꿉니다.
- 정확한 Component-container 임계점은 이번 Specimen으로 측정합니다. Device 이름에서
  추론하거나 공유 `672px` Page-grid 전환을 복사하지 않습니다.

### 채보 정보 소유권

- BPM, 노트 수 및 길이를 항상 보여줍니다.
- 실제 값이 있을 때만 수록일과 해금 조건을 보여주며 Placeholder 행을 Rendering하지
  않습니다.
- 제목, 아티스트, 난이도, 레벨, 레벨 상수, 패턴 경향, 점수 분포, 플레이어 수, 상대
  위치 또는 영역 요약을 반복하지 않습니다.
- Wide Layout에서도 짧은 Key-value 행을 `wide` Container 전체로 늘리지 않고 Fact
  Group을 본래 읽기 좋은 폭으로 유지합니다.

### 내 기록 계층

승인된 의미 순서를 사용합니다.

1. 베스트 기록 — 베스트 스코어, Rank, FC/Pianist 상태, 날짜 및 필요한 진행도;
2. 누적 요약 — 플레이 횟수, 최대 Combo, FC 횟수 및 Pianist 횟수;
3. 성장 추이 — 정확한 값 접근이 가능한 베스트 스코어 Series;
4. 최근 플레이 — 선택적 플레이별 상세를 가진 간결한 요약;
5. 판정 분석 — 보조 진단이므로 기본 접힘.

베스트 스코어는 `metric-display` `32/40 · 700`을 사용합니다. 비교 값은 Tabular
figures가 적용된 `metric-value` `14/20 · 500`을 사용합니다. 공유 사용자 Text는
`12px` 아래로 내려가지 않습니다.

### Foundation Layout 및 Target 계약

- Compact: 네 Logical track, `12px` Gutter, Safe-aware `16px` Page margin.
- Intermediate: `672 CSS px` Page-layout Query container부터 여덟 Track,
  `16px` Gutter, Safe-aware `24px` Margin.
- Wide: `1056 CSS px` Page-layout Query container부터 열두 Track, `16px` Gutter,
  Safe-aware `32px` Margin.
- 악곡 상세는 Fluid 최대 `1440px`의 승인된 `wide` Container class를 사용합니다.
  이는 고정 Canvas가 아니라 상한입니다.
- `page-title`은 `24/32 · 700`을 사용하고, 열두 Track Composition에서 측정된 Text
  Region이 최소 여덟 Track 또는 `640px`일 때만 `32/40 · 700`으로 단계 전환합니다.
- Visible Control은 승인된 `32/40/48px` Step을 사용하고 일반 Public Effective
  target은 최소 `44 × 44px`을 유지합니다.
- 폭은 비교, 분석 및 읽기 좋은 Grouping에 사용합니다. Desktop이 넓다는 이유만으로
  하위 Role을 확대하지 않습니다.

## 실제 Fixture Matrix

| ID         | 목적                           | Repository Content                                                               |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------- |
| `MD-ID-01` | 일반 완전 정체성과 기록        | `Altale` / `削除`, 난이도 네 개, Real 선택, 대표 개인 기록                       |
| `MD-ID-02` | 긴 혼합 원문 제목 및 Real 누락 | `50th Memorial Songs -二人の時 ～under the cherry blossoms～-`, 난이도 세 개     |
| `MD-ID-03` | 최대 압력 아티스트             | `STULTI` / `MAX MAXIMIZER VS DJ TOTTO (Arr.by BEMANI Sound Team "Akhuta Works")` |
| `MD-ID-04` | 긴 일본어 읽기 Popover         | `協奏曲第1番ホ長調 RV 269「春」より第一楽章`과 Repository의 전체 `titleKana`     |
| `MD-ID-05` | 아티스트 누락                  | `Happy Birthday to You`, 난이도 네 개, 아티스트 행 없음                          |

Specimen은 한국어·영어 Popover 줄바꿈을 시험하기 위해 명확하게 Fixture 전용으로 표시한
승인 번역 Text를 사용할 수 있습니다. 합성 Copy를 Production 악곡 Data로 바꾸면 안
됩니다.

## 상태 Matrix

- 완전한 선택 Fact와 선택 Fact가 생략된 채보 정보;
- 공개 채보와 영상 사용 가능, 각각 사용 불가 및 모두 사용 불가;
- 로그인 완전 기록, 로그인 기록 없음, 비로그인 인증 상태;
- 최초, Loading, Partial, Replacement 및 요청 Error Panel 상태;
- 안정적인 Context와 전환만 검증하기 위한 랭킹 및 서열·평가 목적지 Shell. 전문
  Visualization 결정은 이후 검증이 소유;
- Popover 존재, 열림, 닫힘 및 생략;
- Real 사용 가능 및 사용 불가;
- 기본, `200%` Text 확대, WCAG Text spacing, Reduced motion, Keyboard-only,
  Fine pointer, Coarse pointer 및 Safe-area Variant.

## S2 구조 Slice

Specimen을 최종 화면이 아니라 연결된 구조 Slice로 검토합니다.

1. `S2-A` — 원문 악곡 정체성, 선택적 Localized-title Trigger 및 선택 채보 Context;
2. `S2-B` — 네 가지 난이도 Selector 및 안정적인 자료 Action;
3. `S2-C` — Compact Combobox / 측정된 Wider tab 전환;
4. `S2-D` — 간결한 채보 정보 Fact 및 생략 규칙;
5. `S2-E` — 베스트 기록 및 누적 기록 요약;
6. `S2-F` — 성장 추이, 최근 플레이 및 접힌 판정 분석;
7. `S2-G` — Loading, Empty, 비로그인, Disabled 및 Failure 상태;
8. `S2-H` — 상시 Sidebar 없는 Intermediate 및 Wide Panel 적응.

## Browser 측정으로 승인된 구조 계약

사용자는 측정된 Specimen을 검토한 뒤 다음 구조 계약을 승인했습니다. 이는 여전히 최종
Component Geometry를 승인하지 않습니다.

- Compact 정체성은 정사각형 재킷 하나와 Fluid 제목·아티스트·Context Region을 나란히
  사용합니다.
- 레벨 상수는 제목 공간을 빼앗는 상시 세 번째 Compact Column 대신 선택 채보 Context에
  유지합니다.
- 네 난이도는 전체 폭 한 행을 유지합니다.
- 두 자료 Action은 두 번째 안정적 행을 유지합니다.
- 지역 영역 Switcher는 이 Action 뒤에 옵니다.
- 넓은 Layout은 DOM, Reading 및 Focus 순서를 보존할 때만 연관 Group을 나란히 둘 수
  있습니다.
- 채보 정보는 본래 좁은 폭을 유지하고, 내 기록은 비교와 성장 Chart에 추가 Wide
  Track을 사용할 수 있습니다.

이 후보는 승인된 전체 제목 결정을 직접 시험합니다. 실제 제목에 추가 높이가 필요하면
Page가 세로로 늘어나며 정체성 Content를 제거하지 않습니다.

## 측정 Matrix

| Group          | 필수 측정                                                                               |
| -------------- | --------------------------------------------------------------------------------------- |
| Compact        | `320`, `360`, `390`, `430px`, 낮은 높이 Mobile, Safe-area Variant                       |
| Page-grid 전환 | `671/672/673px`, `1055/1056/1057px` Query-container 폭                                  |
| Wide           | `1280 × 720`, `1440 × 900`, `wide` Maximum 및 더 넓은 Viewport 동작                     |
| Text           | 기본, `200%` 확대, WCAG Text-spacing override, Zoom에서 유효 `320px`                    |
| Language       | 한국어·일본어·영어 UI 및 혼합 Script 정체성·Popover Content                             |
| Input          | Keyboard-only, Fine pointer, Coarse pointer, Hybrid input                               |
| State          | 긴 제목, 아티스트 누락, Real 없음, 비활성 Action, 비로그인, 기록 없음, 부분 기록, Error |

Viewport 폭과 Page/Component Query-container 폭을 따로 기록합니다. Switcher나 Content
Failure point는 일반 Device 분류가 아니라 Component가 사용할 수 있는 Inline size에
속합니다.

## 측정 기록 Template

| Field                          | Record        |
| ------------------------------ | ------------- |
| Slice 및 State                 |               |
| Locale 및 Fixture              |               |
| Viewport                       |               |
| Page query-container width     |               |
| Identity text-region width     |               |
| Area-switcher container width  |               |
| Selected panel width           |               |
| Logical track tier             |               |
| Text resize / spacing override |               |
| Pointer / Keyboard mode        |               |
| Page 가로 Overflow             | `Pass / Fail` |
| 원문 제목 잘림                 | `Pass / Fail` |
| Popover 잘림 또는 Layout 이동  | `Pass / Fail` |
| Control 충돌 또는 Target 겹침  | `Pass / Fail` |
| Reading 및 Focus 순서          | `Pass / Fail` |
| 안정적인 State 및 URL Context  | `Pass / Fail` |
| 관찰된 실패                    |               |
| 후보 보정                      |               |
| 영향을 받는 권위               |               |
| 사용자 결정 필요               | `Yes / No`    |

## Browser 검증 기록 — 2026-08-06

편집 가능한 구조 Specimen을 Local에서 제공하고 Test Browser로 측정했습니다. Review-frame
Control이 Specimen의 실제 Inline size를 설정하므로 아래 값은 Device 이름 추정이 아니라
Component 및 Page-container 측정값입니다. 이 기록은 구조만 검증하며 Specimen의 회색
Surface 처리나 최종 Component Geometry를 승인하지 않습니다.

### 핵심 Matrix 결과

| Matrix  | 조합                                                                | Case | 실패 |
| ------- | ------------------------------------------------------------------- | ---: | ---: |
| Compact | `320/360/390/430px × ko/ja/en × 정체성 Fixture 4개 × Text 100/200%` |   96 |    0 |
| Wide    | `768/1280/1440px × ko/ja/en × 정체성 Fixture 4개 × Text 100/200%`   |   72 |    0 |
| 합계    | Compact + Wide                                                      |  168 |    0 |

최종 Source Formatting 이후 168개 Case를 모두 다시 실행했고 동일하게 실패 0건이었습니다.

모든 Case에서 정사각형 재킷, 안정적인 자료 Action 두 개, 가로 Overflow 없는 전체 원문
제목, 하나의 영역 Switcher mode 및 Specimen frame 밖으로 나가는 보이는 가로 요소가
유지되었습니다. 아티스트 누락 Fixture는 아티스트 행을 생략했고, 사용할 수 없는 선택
채보 정보 Fact는 Placeholder로 Rendering하지 않고 생략했습니다.

### 긴 제목 줄바꿈 근거

실제 혼합 Script 제목
`50th Memorial Songs -二人の時 ～under the cherry blossoms～-`는 측정한 모든 Case에서
완전하게 유지되었습니다. 측정 줄 수는 다음과 같습니다.

| Review-frame 폭 | Text `100%` | Text `200%` |
| --------------: | ----------: | ----------: |
|         `320px` |           5 |           9 |
|         `360px` |           4 |           8 |
|         `390px` |           3 |           7 |
|         `430px` |           3 |           6 |
|         `768px` |           2 |           3 |
|        `1280px` |           1 |           2 |
|        `1440px` |           1 |           2 |

이 줄 수는 Line-clamp 목표가 아니라 검증 근거입니다. 악곡 상세는 전체 제목에 더 많은
줄이 필요하면 세로로 늘어납니다.

### 측정된 영역 Switcher 수용량

전체 영어 Label을 가진 가장 넓은 Localized tab set을 측정했습니다. 후보 구조는 다음
Component inline size에서 Mode를 바꿉니다.

| Text 조건   | 수용량 미만       | 최초 수용 폭 | 인접 확인    |
| ----------- | ----------------- | ------------ | ------------ |
| 기본        | `415px`: Combobox | `416px`: Tab | `417px`: Tab |
| Text `200%` | `703px`: Combobox | `704px`: Tab | `705px`: Tab |

어떤 Case도 Combobox와 Tab을 함께 노출하거나 Label을 축약하거나 Switcher를 Overflow하지
않았습니다. `416px`와 `704px`는 측정된 후보 임계점이며 아직 승인된 Foundation
Token이나 일반 Viewport breakpoint가 아닙니다.

### Interaction 및 상태 확인

| 확인                                                                         | 결과   |
| ---------------------------------------------------------------------------- | ------ |
| Compact 영역 Combobox가 전체 Label 네 개를 노출하고 선택 Panel을 갱신        | `Pass` |
| 번역 Trigger Click/Touch가 Anchored Popover를 Toggle                         | `Pass` |
| 번역 Trigger Keyboard focus가 보조 제목을 공개하고 `Escape`가 닫음           | `Pass` |
| `320px` + 일본어 긴 제목 + Text `200%`에서 `280px` Popover가 Frame 안에 유지 | `Pass` |
| Popover를 열어도 Specimen 높이가 바뀌지 않음                                 | `Pass` |
| 사용할 수 없는 Real 및 자료 Action이 안정적인 비활성 위치를 유지             | `Pass` |
| 비로그인 및 기록 없음 Panel이 공유 악곡·채보 Context를 보존                  | `Pass` |
| 측정 Flow 중 Browser Console Warning 및 Error                                | `0`    |

### 입증된 보정

1. Native `hidden` 상태가 Component `display` 규칙에 덮여 생략할 선택 Fact가 계속
   보였습니다. Specimen 전용 전역 `[hidden]` 보호 규칙으로 생략 의미를 복원했습니다.
2. Pointer focus와 Click이 모두 번역 공개를 Toggle하여 즉시 열렸다 닫혔습니다.
   Pointer-down 상태로 Click toggle과 Focus 공개를 구분했습니다.
3. 분리된 고정 폭 Trigger Column이 모든 줄의 제목 Region을 줄였습니다. 후보 구조는
   Trigger를 제목 Group과 Inline으로 유지하여 제목을 자르지 않으면서 불필요한 Compact
   줄바꿈을 줄였습니다.
4. Compact Popover가 `320px` Text `200%`에서 왼쪽 경계를 벗어날 수 있었습니다. Compact
   Layout에서는 제목 Group에 맞춰 제한하고, 정체성 Region의 Inline 공간이 충분할 때만
   Trigger에 직접 Anchor합니다.
5. 장식용 1px Specimen Border가 Query container를 2px 줄였습니다. Layout에 영향을
   주지 않는 Inset outline으로 바꿔 측정 임계점과 표시된 Review-frame 폭을 일치시켰습니다.
6. 첫 Wide 검증 Assertion이 면적이 0인 숨김 요소를 경계 이탈로 계산했습니다. Rendering된
   Geometry만 평가하도록 Assertion을 수정하고 최종 결과 기록 전에 Wide 72개 Case를 모두
   다시 실행했습니다.

## 결정 및 검증 상태 Log

| ID       | 항목                                                                                                                                                                                            | 상태       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S2V-01` | 이 문서는 완료된 Review에 사용한 제한된 S2 구조 검증 Protocol을 기록합니다.                                                                                                                     | `Observed` |
| `S2V-02` | 현행 고정 폭 Page, Overflow 탭, Content 소유권, 상시 읽기 Caption, Action 위치 및 Query 없는 기본값을 Migration 근거로만 취급합니다.                                                            | `Observed` |
| `S2V-03` | 하나의 지속 악곡·채보 Context와 승인된 정체성 → 난이도 → 자료 → 영역 Switcher → 선택 Panel 순서를 유지합니다.                                                                                   | `Approved` |
| `S2V-04` | 집중 악곡 상세는 줄바꿈한 전체 원문 제목을 보존하고 반복 List/Grid 결과는 승인된 한 줄 Ellipsis를 유지합니다.                                                                                   | `Approved` |
| `S2V-05` | 하나의 Compact 전체 Label Combobox를 사용하고 측정된 Component 수용 임계점에서만 전체 Label 탭으로 바꿉니다.                                                                                    | `Approved` |
| `S2V-06` | Compact 정사각형 재킷 + Fluid 정체성 구조를 사용하고 상시 세 번째 Column 대신 선택 채보 Context 안에 레벨 상수를 둡니다. 최종 재킷 크기, Panel 비율 및 Component Styling은 이 결정 밖에 둡니다. | `Approved` |
| `S2V-07` | 채보 정보를 Fact-only로 유지하고 승인된 다섯 부분 계층으로 내 기록을 검증합니다.                                                                                                                | `Approved` |
| `S2V-08` | Color, Material, 최종 Geometry, Chart Styling 및 Production 구현을 이 Gate 밖에 둡니다.                                                                                                         | `Approved` |
| `S2V-09` | 최종 Compact `96`개 및 Wide `72`개 Browser 조합이 구조 실패 없이 통과했습니다.                                                                                                                  | `Observed` |
| `S2V-10` | 기본 Text에서 `416px`, Text `200%`에서 `704px`의 측정된 영역 Switcher Component 임계점을 사용합니다.                                                                                            | `Approved` |
| `S2V-11` | 위 여섯 가지 입증된 보정을 승인된 제품 동작의 조용한 변경이 아니라 Specimen 및 검증 Harness 근거로 취급합니다.                                                                                  | `Observed` |
| `S2V-12` | 번역 Trigger를 원문 제목 Group과 Inline으로 유지하고, Compact 폭에서는 Popover를 해당 Group에 맞춰 제한하며, 공간이 충분하면 Trigger에 직접 Anchor합니다.                                       | `Approved` |

## 현재 Gate

사용자는 2026-08-06 S2 First Review Gate를 승인했습니다. 확정된 구조 규칙은 다음과
같습니다.

1. Compact 정사각형 재킷 + Fluid 정체성, 그리고 상시 세 번째 Column 대신 선택 채보
   Context 안에 두는 레벨 상수;
2. Inline 번역 Trigger + Compact 제목 Group 제한 / Wider Trigger 직접 Anchor Popover;
3. 기본 Text `416px`, Text `200%` `704px`의 측정된 영역 Switcher 임계점.

이번 Gate는 구조 계약과 측정된 반응형 동작만 승인합니다. Color, Material, 최종 재킷
크기, 최종 Panel Geometry, Chart Styling, Production 화면 또는 Application 구현은
승인하지 않습니다. 해당 항목은 이후 Guide Phase에서 별도 Approval Gate로 결정해야
합니다.
