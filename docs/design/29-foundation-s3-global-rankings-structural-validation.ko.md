# NosLog 2.0 Foundation S3 글로벌 랭킹 구조 검증

## 문서 관리

- 상태: `초안 — S3 First Review 대기`
- Canonical 언어: English
- Canonical 문서:
  [29-foundation-s3-global-rankings-structural-validation.md](./29-foundation-s3-global-rankings-structural-validation.md)
- 시작일: 2026-08-06
- 범위: 대표 Specimen `S3`에서 승인된 Foundation Typography, Spacing, Grid,
  Container, Density, Comparison, Target 및 State 계약을 구조적으로 검증
- 승인 경계: 이 문서는 Color, Material, 최종 Row·Control Geometry, 최종 Podium
  Styling, Avatar 처리, Production 화면 구성, Ranking 계산 구현 또는 Application
  Code를 승인하지 않음

## 관련 권위 문서

- [글로벌 랭킹 페이지 브리프](./08-global-rankings-page-brief.ko.md)
- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation Semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation Typography 및 Layout 후보](./26-foundation-typography-layout-candidates.ko.md)
- [S1 탐색 구조 검증](./27-foundation-s1-discovery-structural-validation.ko.md)
- [S2 악곡 상세 구조 검증](./28-foundation-s2-music-detail-structural-validation.ko.md)

승인된 글로벌 랭킹 브리프가 제품 의미, 랭킹 자격, Mode·Metric 사용 가능성, 지역
모집단, 공개 값 Shared rank, 개인 위치 동작, Row Content, Pagination 정책, URL 복원,
Runtime State 및 반응형 불변 조건을 소유합니다. 문서 `25`와 `26`은 공유 Foundation
계약을 소유합니다. 이번 검증은 충돌을 드러낼 수 있지만 해당 권위를 조용히 다시 쓸
수 없습니다.

## 검증 목적

`S3`는 현행 고정 `390px` Application Column을 유지하거나 모든 범위를 상시 동급
Button으로 만들지 않고도 하나의 고밀도 공개 비교 목적지가 NOSTALGIA 의미와 탐색
효율을 보존할 수 있는지 시험합니다. 다음 질문에 답해야 합니다.

1. Basic/Recital, Basic 전용 Metric 선택, 지역 범위 하나, 개인 위치, 랭킹 플레이어
   25명 및 명시적 Pagination이 문서 가로 Scroll 없이 `320 CSS px`에 맞는가?
2. Compact Row가 공개 Rank와 활성 값을 안정적으로 유지하면서 한국어·일본어·Latin·
   혼합 Script 사용자명에 유동적인 중앙 Region을 제공할 수 있는가?
3. 같은 Ordered dataset이 관련 없는 통계나 별도 Country·Exam Column을 추가하지 않고
   정렬된 Wide 비교 구조로 바뀔 수 있는가?
4. 동일 공개 값이 유일한 Medal 소유자를 암시하는 Podium 없이 `1, 2, 2, 4`
   Competition rank를 표현할 수 있는가?
5. 현재 사용자를 다른 Page에서는 간결한 요약, 현재 Page에서는 표시된 Row 하나로만
   나타내고 두 표현을 동시에 노출하지 않을 수 있는가?
6. Loading이나 갱신 실패 중 마지막 확정 Row를 유지하면서 Empty, 초기 Error,
   Ineligible 및 Rating unavailable 상태를 구분할 수 있는가?
7. Control, Row 및 Pagination이 새 Type size 예외 없이 한국어·일본어·영어 Label,
   `200%` Text, Visible focus 및 Effective public target을 견디는가?

## 비목표

- 최종 Page Design이나 Production-ready Figma 화면이 아닙니다.
- Specimen의 회색조 Color나 Surface 처리를 승인하지 않습니다.
- 최종 Avatar 크기, Row 높이, Border, Radius, Elevation, Icon, Motion 또는 Podium
  Accent를 선택하지 않습니다.
- Official Grd, NosLog Rating, 자격 또는 Source Formula를 변경하지 않습니다.
- Shared-rank Query, URL History 또는 `25` Row API 정책을 구현하지 않습니다.
- Recital Rating Source를 만들지 않습니다.
- Country, Exam, Play count, Accuracy 또는 Score Column을 추가하지 않습니다.
- Legacy NOSTORY Figma를 현재 Layout 권위로 사용하지 않습니다.

## 관찰된 기준선

### Repository 및 Browser 근거 — 2026-08-06

| ID          | 관찰                                                                                                                                                           | 상태       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S3-OBS-01` | `1280px` Viewport에서 현행 랭킹 `main`과 Content는 정확히 `390px` 폭을 유지하여 Desktop 비교 공간을 사용하지 않습니다.                                         | `Observed` |
| `S3-OBS-02` | `320px`에서 현행 Page는 문서 가로 Overflow는 피하지만 실제 Result 폭은 `288px`뿐이며 긴 사용자명이 강하게 잘립니다.                                            | `Observed` |
| `S3-OBS-03` | 현행 Compact 계층은 Result 전에 Mode, Metric 및 네 Region의 상시 Button Group 세 개를 쌓습니다.                                                                | `Observed` |
| `S3-OBS-04` | 현재 사용자가 완전한 별도 Card와 같은 Page의 일반 Row로 다시 나타납니다.                                                                                       | `Observed` |
| `S3-OBS-05` | 같은 공개 Grd `5,713`을 가진 두 사용자가 서로 다른 공개 Rank `3`, `4`를 받아 승인된 공개 값 Competition ranking과 충돌합니다.                                  | `Observed` |
| `S3-OBS-06` | 현행 Row 정체성은 Country를 사용자명 앞에 두고 Exam을 같은 줄에 둡니다. 승인 계약은 Country를 사용자명 뒤에, Exam을 보조 둘째 줄에 둡니다.                     | `Observed` |
| `S3-OBS-07` | 현행 Page, API 및 Client 상수는 `PAGE_SIZE = 7`을 사용하지만 승인된 고정 정책은 `25`입니다.                                                                    | `Observed` |
| `S3-OBS-08` | Recital 선택 중 Rating을 활성화하면 기본 Mode를 Basic으로 조용히 바꿉니다. 승인 계약은 Recital에서 사용할 수 없는 Rating 선택을 제거합니다.                    | `Observed` |
| `S3-OBS-09` | 현행 Pagination은 이동 가능한 Page Link 대신 Script Button을 사용하고 조건 변경은 `replaceState`를 사용하여 일반 Back·Forward와 복사한 Link 동작을 약화합니다. | `Observed` |
| `S3-OBS-10` | 현행 Ranking Code는 같은 정수로 반올림되는 Rating을 포함하여 Raw value와 User ID를 보이는 Ordinal tie-breaker로 사용합니다.                                    | `Observed` |

이 관찰은 Migration 및 실패 근거일 뿐 Specimen의 시각·Layout 권위가 아닙니다.

## 검증할 승인 계약

### 정보 순서

다음 Source 및 Reading order를 안정적으로 유지합니다.

1. Page 정체성과 자격 Player 수;
2. Basic/Recital Mode;
3. 사용할 수 있는 Metric과 지역 범위 하나;
4. Rating 활성 시에만 간결한 Rating 근거;
5. 조건부 개인 위치 요약;
6. Result Heading 및 Update·Error 상태;
7. Ranking Row;
8. 명시적 Pagination.

Basic과 Recital은 상시 보이는 Primary 선택입니다. Basic은 공식 Grd와 NosLog 레이팅을
노출하고, Recital은 공식 Grd만 노출하며 비활성 또는 오해를 부르는 Rating 선택을
보여주지 않습니다. Region은 전체, 대한민국, 일본, 기타 지역을 가진 Selector 하나를
유지합니다.

### 하나의 Ranking dataset과 하나의 활성 값

각 Row는 다음 Content를 유지합니다.

1. 공개 Shared rank;
2. Avatar 또는 Fallback;
3. 사용자명 뒤의 Country·Region Marker;
4. 값이 있을 때 활성 Mode Exam을 보조 줄에 표시;
5. 오른쪽 끝 활성 값 하나: 공식 Grd 또는 NosLog 레이팅.

Country와 Exam은 모든 폭에서 Player identity Group 내부에 남습니다. Wide Layout은 같은
Region을 더 정확하게 정렬할 수 있지만 공간이 있다는 이유만으로 관련 없는 Player
통계를 추가하면 안 됩니다.

### Shared rank 및 개인 위치 의미

- 같은 공개 Grd 또는 반올림 Rating은 Competition rank `1, 2, 2, 4`를 사용합니다.
- Raw value는 Tie Group 내부 순서를 안정화할 수 있지만 서로 다른 공개 Rank를 만들 수
  없습니다.
- 현재 사용자가 다른 Page에 있으면 간결한 요약 하나가 Rank, 모집단, 값 및 내 위치
  보기를 보여줍니다.
- 현재 사용자가 현재 Page에 있으면 요약을 제거하고 그 Row 하나가 Exam과 함께 보이고
  Programmatic한 내 순위 Marker를 유지합니다.
- Color 지원과 함께 Non-color 구조 Marker를 사용합니다.

### Pagination 및 State 정책

- 성공 Page 하나에는 최대 `25`명의 Player가 있고 Page size Selector는 없습니다.
- Pagination은 이동 가능하고 Label이 있으며 명시적입니다. Infinite 또는 자동 추가
  Result는 제외합니다.
- Update Loading과 Update failure 중 기존 Row와 개인 Context를 유지합니다.
- Empty, 초기 Error, 개인 Ineligible 및 Rating source unavailable은 서로 다른
  결과입니다.
- 선택 Mode, Metric, Region 및 Page는 공유·복원할 수 있어야 합니다.

### Foundation 계약

- Compact는 네 Logical track, `12px` Gutter 및 Safe-aware `16px` Margin을 사용합니다.
- Intermediate는 측정된 `672 CSS px` Page-layout Query container부터 여덟 Track,
  `16px` Gutter 및 `24px` Margin을 사용합니다.
- Wide는 `1056 CSS px`부터 열두 Track, `16px` Gutter 및 `32px` Margin을 사용합니다.
- Page는 고정 Phone 폭 Shell 대신 승인된 `wide` Container class와 Fluid maximum을
  사용합니다.
- `page-title`은 `24/32 · 700`을 사용하고 Page와 측정 Title Region이 Foundation Gate를
  만족할 때만 승인된 `32/40 · 700` Wide substitution을 사용합니다.
- Row 비교 값은 Tabular figures가 적용된 `metric-value` `14/20 · 500`을 사용합니다.
- 공유 사용자 Text는 `12px` 아래로 내려가지 않습니다.
- 일반 Public effective pointer target은 승인된 Foundation 계약에 따라 최소
  `44 × 44px`을 유지합니다.

## 광범위한 Reference 비교

| Source                                                                                                                    | 가져올 수 있는 발견                                                          | NosLog 적용                                       | 한계                                                |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| [현행 Rankings route](<../../app/(nevigation)/rankings/page.tsx>)                                                         | 기존 Query와 Public route를 재사용 가능                                      | 고정 폭과 `7` Row를 교체하면서 Domain state 보존  | 현행 Layout은 대체할 근거                           |
| [현행 Ranking browser](../../components/rankings/rankingBrowser.tsx)                                                      | Request-race 보호 기반이 존재                                                | History와 조건을 고치며 비동기 기반 재사용        | 현행 Control과 Recital redirect는 충돌              |
| [현행 Ranking query](../../lib/rankings.ts)                                                                               | Population과 Rating source 정의                                              | Formula input 보존, 공개 Tie 의미 교체            | 현행 ID·Raw ordinal은 거절됨                        |
| [승인 글로벌 랭킹 브리프](./08-global-rankings-page-brief.ko.md)                                                          | NosLog 랭킹 의미와 Content 소유                                              | 모든 S3 구조 불변 조건을 지배                     | 최종 시각 Geometry는 정하지 않음                    |
| [NOSTALGIA 공식 Mode Guide](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                               | Basic과 Recital은 별도 공식 Play mode                                        | Mode를 Metric보다 위에 유지                       | NosLog Ranking은 정의하지 않음                      |
| [osu! Global Rankings](https://osu.ppy.sh/rankings/osu/global)                                                            | 고밀도 Rank·Identity·Value Row, Country Scope, Metric 선택 및 숫자 Page 공존 | 고빈도 Metric 직접 선택과 Wide 정렬 근거          | osu!는 더 많은 통계를 노출                          |
| [ScoreSaber Player Rankings](https://scoresaber.com/rankings)                                                             | Rank, Identity, Primary value 및 보조 Metric을 반복 Row로 탐색               | Rhythm-game 친화적 Row 비교 근거                  | PP·Accuracy는 Grd와 다름                            |
| [jubeat Total Best Score Ranking](https://p.eagate.573.jp/game/jubeat/beyond/ranking/ranking4.html)                       | 공식 BEMANI Ranking은 Player와 주요 공개 값을 중심에 둠                      | 조용한 Rank·Value 강조 근거                       | 다른 Aggregate metric                               |
| [Google Play Games Leaderboards](https://support.google.com/googleplay/answer/3129939)                                    | Public 비교, 다중 Leaderboard, Profile 및 Personal standing 공존             | Public list + 문맥적 내 위치 근거                 | Native UI가 Web layout을 정하지 않음                |
| [Apple Game Center HIG](https://developer.apple.com/design/human-interface-guidelines/game-center)                        | Global·Friend Standing 및 Best all-time score 비교                           | 명확한 활성 Comparison context 근거               | Platform UI와 Recurrence가 다름                     |
| [Strava Leaderboard Filters](https://support.strava.com/en-us/articles/15401771-segment-leaderboard-filters)              | Secondary population은 간결한 Scoped filter 사용                             | Region selector 하나 근거                         | Sport·Time filter는 범위 밖                         |
| [Chess.com Leaderboards](https://www.chess.com/leaderboard)                                                               | Category를 구분하며 Row는 Identity와 Rating 정렬                             | Mode·Metric hierarchy 근거                        | Chess 자격은 다름                                   |
| [Lichess Leaderboard FAQ](https://lichess.org/faq#leaderboards)                                                           | Eligibility가 노출 대상에 실질적 영향                                        | Personal-ineligible state 근거                    | Glicko 규칙은 NosLog 정책 아님                      |
| [Carbon Content switcher](https://carbondesignsystem.com/components/content-switcher/usage/)                              | 가까운 대안 View는 직접 배타 전환, 별도 목적지는 다른 Pattern 사용           | Basic/Recital과 보조 두 Metric 직접 Switch 근거   | Carbon Styling은 사용하지 않음                      |
| [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)                                          | 정렬 Row가 효율적 비교를 지원하고 기능은 Task 필요를 따라야 함               | 조용한 Wide 비교, 관련 없는 Column 배제           | Mobile은 Compact transformation 필요                |
| [Carbon Pagination](https://carbondesignsystem.com/components/pagination/usage/)                                          | Pagination은 Data 가까이에 있고 작은 폭에서 압축                             | 명시적 반응형 Page 근거                           | Page size selector는 의도적으로 제외                |
| [USWDS Table](https://designsystem.digital.gov/components/table/)                                                         | Table은 긴 구조화 List에 적합하고 Cell은 짧고 비교 가능해야 함               | 정렬된 Rank·Player·Value Region 근거              | Compact stacked semantics 주의 필요                 |
| [USWDS Button group](https://designsystem.digital.gov/components/button-group/)                                           | 관련 선택을 Grouping하되 과도한 Option은 선택 부담                           | 제한된 직접 Switch 두 개 + 공개 Region 범위 근거  | Action group과 View switch는 다름                   |
| [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/)                                          | Page 이동은 실제 Link이고 Filtering은 1 Page로 복귀                          | Copy link, Back, No-script navigation 근거        | Guidance Page Label은 불필요                        |
| [W3C WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | 진정한 2D Content 외에는 `320 CSS px`에서 정보·기능 보존                     | 문서 가로 Scroll 대신 Row reflow 요구             | Ranking Layout을 선택하지 않음                      |
| [WAI-ARIA APG Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)                                                     | 정적 Tabular 관계는 Native table semantics 우선                              | Programmatic Wide comparison header 근거          | Compact 시각 처리는 Open                            |
| [WAI-ARIA APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                       | Exclusive panel은 selected state와 예측 가능한 Keyboard 동작 필요            | 직접 Mode·Metric Switch 의미 참고                 | NosLog는 Page Tab 대신 Button·Content switcher 가능 |
| [WAI-ARIA APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                               | Select-only popup은 사전 정의 집합에서 값 하나 노출                          | Region selector 하나 근거                         | 근거 없이 고빈도 Basic Metric을 숨기면 안 됨        |
| [WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                                  | Pointer target은 최소 `24px` 또는 충분한 간격 필요                           | 더 엄격한 NosLog `44px` 계약 아래 Standards floor | Standards minimum은 Product target 아님             |
| [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                                  | Loading, Result count 및 Error update는 강제 Focus 없이 Programmatic 노출    | 간결한 Update announcement 근거                   | 시각 처리 정의 아님                                 |
| [web.dev Responsive basics](https://web.dev/articles/responsive-web-design-basics)                                        | 작은 폭부터 시작하고 Content 필요 시 Breakpoint 추가                         | 측정 Row·Table·Control 전환 근거                  | 정확한 값은 Specimen 필요                           |
| [MDN Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | 고정 폭은 Narrow와 Wide 모두 실패                                            | 현행 `390px` Desktop shell 거절                   | 일반 지침은 Density를 정하지 않음                   |

### 근거 수렴

- Rhythm-game 및 일반 Leaderboard는 하나의 안정된 Ordered dataset, 직접 Identity,
  주요 비교 값, Personal standing 및 유한 Navigation으로 수렴합니다.
- 고빈도 Related comparison mode에는 직접 두 선택 Control이 흔하고, Secondary
  multi-option population은 간결한 Selector로 수렴합니다.
- Data-table System은 정렬된 Wide 비교로 수렴하고, 반응형 지침은 Desktop Table을
  축소하거나 2D Scroll을 강요하지 않고 같은 정보를 보존한 Compact form을 요구합니다.
- Pagination 지침은 Result 가까이의 실제 Previous·Next 및 Page Link로 수렴하며,
  안정적인 Ranking의 Primary navigation으로 Infinite scroll을 지지하지 않습니다.
- Accessibility 지침은 Native semantics, 보이는 Selected·Focus state, Programmatic
  status 및 Reflow에서 기능을 잃지 않는 Target으로 수렴합니다.
- 외부 Reference는 Basic/Recital, Grd·Rating 가용성, 공개 값 Tie, Region 의미 또는
  Exam 배치를 정하지 않습니다. 이는 승인된 NosLog·NOSTALGIA Domain 결정입니다.

## 대표 Fixture Matrix

| ID         | 목적                 | Specimen Content                                       |
| ---------- | -------------------- | ------------------------------------------------------ |
| `GR-ID-01` | 완전한 한국어 정체성 | `계롤`, Korea marker, Mode exam, Current-row variant   |
| `GR-ID-02` | 긴 일본어 정체성     | `月夜のピアニスト`, Japan marker, 전체 Accessible name |
| `GR-ID-03` | 긴 Latin 정체성      | `avery_long_player_name`, `ResonanceAndRhythm`         |
| `GR-ID-04` | 혼합 Script 압력     | 한 25 Row Page의 한국어·일본어·Latin identity          |
| `GR-ID-05` | 기타 지역 의미       | Localized accessible name을 가진 Globe marker          |
| `GR-ID-06` | 선택 Metadata 누락   | Fallback avatar와 Exam 없는 Row 하나                   |
| `GR-ID-07` | 공개 Tie             | 연속 사용자 두 명이 공개 값과 보이는 Rank `4` 공유     |
| `GR-ID-08` | Page density 경계    | 정확히 `25` Visible row와 Page `6 / 42` Context        |

구현 Test는 Row `25/26`을 넘는 Tie, Raw Rating이 다르지만 반올림 정수가 같은 경우,
Result `0/1/24/25/26/수백`, 범위 밖 Canonical page를 추가로 검증해야 합니다. 이는
Visual specimen보다 Data 및 Navigation Test에 속합니다.

## State Matrix

- Basic + 공식 Grd;
- 간결한 Source 근거가 있는 Basic + NosLog 레이팅;
- Metric switch가 없는 Recital + 공식 Grd;
- 다른 Page, 현재 Page 및 Ineligible인 로그인 사용자;
- 문맥적 Login action이 있는 비로그인 Public list;
- Initial loading 및 기존 Result를 유지하는 Updating;
- Row를 유지하고 Retry를 제공하는 Update error;
- Empty population;
- Retry가 있는 Initial error;
- 공식 Grd 복구가 있는 Rating source unavailable;
- 정확히 `25` Row 및 Pagination이 생략되는 One-page result;
- 한국어, 일본어 및 영어;
- Default text, `200%` Text, WCAG text-spacing override, Reduced motion,
  Keyboard, Fine pointer 및 Coarse pointer.

## S3 구조 Slice

1. `S3-A` — Page 정체성, 자격 Population 및 Selection context;
2. `S3-B` — 상시 Mode, 조건부 Basic Metric 및 Region selector 하나;
3. `S3-C` — 간결한 Rating source 근거;
4. `S3-D` — Compact off-page personal summary와 on-page current-row marker;
5. `S3-E` — Identity metadata를 통합한 25 Row Rank·Player·Value dataset 하나;
6. `S3-F` — 공개 값 Tie 표현 및 Podium-neutral Row anatomy;
7. `S3-G` — 압축·확장된 명시적 Pagination;
8. `S3-H` — Loading, Update error, Empty, Initial error 및 Unavailable state;
9. `S3-I` — 동등한 Dataset 하나를 사용한 Compact-to-aligned-wide 전환.

## 측정된 구조 후보

Specimen은 다음 후보를 보여주지만 아직 승인하지 않습니다.

### 선택 계층

- Basic/Recital은 직접 두 선택 Primary switch 하나를 유지합니다.
- Basic 공식 Grd·NosLog 레이팅은 둘 다 고빈도 비교 View이고 직접 전환이 불필요한
  Select 열기 Step을 피하므로 직접 두 선택 Subordinate switch를 유지합니다.
- Recital은 해당 Subordinate switch를 제거하고 공식 Grd를 확정합니다.
- Region은 구조 Specimen에서 Label이 있는 Native Select 하나를 유지합니다.
- Compact에서는 계층 순서대로 쌓고, 넓은 폭에서는 전체 Localized label과 Target이
  맞을 때만 정렬합니다.

### Ranking Row

- 모든 폭에서 하나의 Semantic Rank·Player·Value dataset을 사용하며 중복 Compact·
  Desktop Row tree를 노출하지 않습니다.
- 측정된 Comparison threshold 아래에서는 보이는 Header를 생략하지만 Rank, 통합
  Identity 및 Active value 관계는 유지합니다.
- Threshold부터 같은 Region을 보이는 Rank, Player 및 Active-value Header 아래에
  정렬합니다.
- 상위 Rank도 같은 Row anatomy를 유지합니다. 최종 Claude Design은 Shared rank를
  견디는 절제된 Accent를 추가할 수 있지만 후보는 별도 Podium card block을 만들지
  않습니다.
- 좁은 폭 `200%` Text에서는 사용자명 Link를 Foundation Target 아래로 압축하거나
  정보를 숨기지 않고 Active value를 Identity 아래로 이동합니다.

### Pagination

- Compact Pagination은 Previous, 첫 Boundary, Current page, 마지막 Boundary 및 Next를
  유지합니다.
- 공간이 허용되면 양쪽 Neighbor 하나와 비대화형 Ellipsis를 추가합니다.
- 모든 이동 Item은 Foundation Effective target을 유지합니다. Active page는
  `aria-current="page"`를 사용하고 Dead link가 아닙니다.

## 측정 Matrix

| Group           | 필수 측정                                                                   |
| --------------- | --------------------------------------------------------------------------- |
| Compact         | `320`, `360`, `390`, `430px`                                                |
| Pagination 전환 | `479/480/481px`                                                             |
| Comparison 전환 | Default text의 `639/640/641px`                                              |
| Control 정렬    | Default text의 `767/768/769px`                                              |
| Page-grid 전환  | `671/672/673px`, `1055/1056/1057px`                                         |
| Wide            | `1280`, `1440px` 및 Maximum-container 동작                                  |
| Text            | Default, `200%`, WCAG text-spacing override, Zoom의 Effective `320px`       |
| Language        | 한국어·일본어·영어 Control 및 혼합 Script identity                          |
| State           | Mode·Metric Context 세 개, Off·On-page personal rank, Runtime state 다섯 개 |
| Input           | Keyboard-only, Fine pointer, Coarse pointer, Hybrid input                   |

## Browser 검증 기록 — 2026-08-06

구조 Specimen을 Local로 제공하고 Test Browser에서 측정했습니다. Review frame이 실제
Component inline size를 제어합니다. 아래 값은 최종 시각 Design이 아니라 구조와
Reflow만 검증합니다.

### Core Matrix 결과

| Matrix                     | 조합                                                                         |    Case |  실패 |
| -------------------------- | ---------------------------------------------------------------------------- | ------: | ----: |
| Compact Context            | `320/360/390/430 × ko/ja/en × 100/200% × Basic Grd/Basic Rating/Recital Grd` |      72 |     0 |
| Transition 및 Wide Context | `479–1440 측정 폭 × ko/ja/en × 100/200% × 세 Context`                        |     306 |     0 |
| Personal position          | `320/390/640/1056/1440 × ko/ja/en × 100/200% × 세 Context`                   |      90 |     0 |
| Runtime state              | 다섯 폭 × ko/ja/en × 100/200% × 다섯 State                                   |     150 |     0 |
| 합계                       | 전체 측정 구조 조합                                                          | **618** | **0** |

모든 통과 결과는 필수 Identity를 Accessibility tree에서 완전히 유지하고, 필요한 경우
25 Row, Specimen-level 가로 Overflow 없음, Boundary escape 없음, 작은 Effective target
없음, Personal-position 표현 정확히 하나 및 올바른 조건부 Metric 존재를 유지했습니다.

### 측정된 후보 임계점

| 전환                                       | Default text             | `200%` Text        | 의미                                                  |
| ------------------------------------------ | ------------------------ | ------------------ | ----------------------------------------------------- |
| 확장 Pager neighbor                        | `480px`                  | `1056px`           | 더 작은 폭은 Previous, Boundary, Current 및 Next 유지 |
| 보이는 정렬 Comparison Header              | `640px`                  | `1056px`           | 같은 Dataset에 Rank·Player·Value Header 추가          |
| Wider composition의 Mode·Subordinate scope | `640px`                  | `1056px`           | 순서를 바꾸지 않고 계층 정렬                          |
| Metric·Region 나란히 배치                  | `768px`                  | `1056px`           | 전체 Localized label과 Target이 Escape 없이 맞음      |
| Wide `page-title` substitution             | `1056px` Foundation gate | `1056px` 측정 후보 | Ranking 취향이 아니라 `FTL-09`가 계속 지배            |

이는 측정된 S3 Component 후보이며 일반 Device breakpoint나 Foundation token이
아닙니다. First Review에서 사용자 승인이 필요합니다.

### Interaction 및 State 확인

| 확인                                                             | 결과   |
| ---------------------------------------------------------------- | ------ |
| Recital이 Metric switch를 제거하고 Row Exam을 Recital로 변경     | `Pass` |
| Basic 복귀가 직접 두 선택 Metric switch 복원                     | `Pass` |
| Rating이 간결한 근거를 노출하고 활성 End value 변경              | `Pass` |
| Region Select가 Secondary population 값 하나 변경                | `Pass` |
| Off-page summary와 On-page marked row가 동시에 보이지 않음       | `Pass` |
| Loading이 Row·Personal context를 유지하고 `aria-busy=true` 노출  | `Pass` |
| Update error가 Row를 유지하고 Inline Retry 노출                  | `Pass` |
| Empty, Initial error, Rating unavailable이 서로 다른 Result 대체 | `Pass` |
| Compact Pagination이 Boundary 두 개와 Current-page identity 유지 | `Pass` |
| Default·`200%` 전환이 Comparison mode 하나만 노출                | `Pass` |

### 검증 중 수정한 문제

1. `320px + 200%`에서 Active value를 오른쪽에 유지하면 Player link의 Effective region이
   Foundation target보다 작아졌습니다. 후보는 해당 압력에서 Value를 Identity 아래로
   Reflow하여 전체 Target을 복원합니다.
2. `640px`에서 Metric과 Region을 나란히 정렬하면 Nested scope group의 Inline capacity가
   부족하여 Region field가 Escape했습니다. Side-by-side 전환을 측정된 `768px`로
   옮겼습니다.
3. 초기 Current-row marker가 Exam을 대체하여 승인된 Identity 계약을 어겼습니다.
   수정 Row는 Exam을 보존하고 내 순위를 별도 보조 줄에 추가합니다.
4. Exam과 내 순위를 Non-wrapping 한 줄에 유지하면 일본어·영어 `320px + 200%`에서
   Marker가 잘렸습니다. 별도 Supporting line이 둘 다 보존합니다.
5. 초기 후보는 Metric Select를 사용했습니다. 광범위한 근거와 승인된 고빈도 두 Metric
   계약은 직접 Subordinate two-choice switch를 지지하며, Region만 공개된 Multi-option
   scope로 남습니다.

## 결정 및 검증 상태 Log

| ID       | 항목                                                                                                                                                 | 상태       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `S3V-01` | 현행 Fixed width, 7 Row, 상시 Region button, 중복 Personal card, Recital redirect 및 고유 Visible tie를 Migration 근거로만 취급                      | `Observed` |
| `S3V-02` | 승인된 Page order, Basic/Recital 의미, Basic 전용 Rating, Region scope 하나, Shared rank, Integrated identity, Personal position 및 25 Row 정책 보존 | `Approved` |
| `S3V-03` | S3에서 직접 Basic/Recital switch, 조건부 직접 Basic metric switch 및 Region Select 하나 사용                                                         | `Proposed` |
| `S3V-04` | Headerless compact 표현과 측정 Capacity부터 정렬 Header를 가진 동등한 Semantic dataset 하나 사용                                                     | `Proposed` |
| `S3V-05` | 상위 Rank도 같은 Row anatomy를 사용하고 Tie-safe 시각 Accent는 Appearance gate에 남기며 별도 Podium block을 추가하지 않음                            | `Proposed` |
| `S3V-06` | 좁은 `200%` Text에서 Identity clipping 또는 Target 위반 대신 Active value를 Identity 아래로 Reflow                                                   | `Proposed` |
| `S3V-07` | 측정 Threshold `480`, `640`, `768`, `1056px`를 문서화한 S3 전환에만 사용                                                                             | `Proposed` |
| `S3V-08` | Exam을 보존하고 Current row의 내 순위 Marker를 별도 Supporting line으로 표시                                                                         | `Proposed` |
| `S3V-09` | 최종 측정 `618`개 구조 조합이 실패 없이 통과                                                                                                         | `Observed` |
| `S3V-10` | 최종 Color, Material, Row geometry, Avatar 처리, Podium accent 및 구현은 이번 Gate 밖에 유지                                                         | `Proposed` |

## First Review Gate

다음 결정은 이 문서를 Draft에서 Approved로 옮기기 전에 명시적 사용자 승인이
필요합니다.

1. Region은 Select 하나로 유지하면서 Basic Metric을 직접 두 선택 Switch로 승인;
2. Compact Header 생략 및 측정된 Wide 정렬을 가진 동등한 Dataset 하나 승인;
3. 별도 Podium-card block을 만들지 않고 절제된 Shared-rank-safe Accent는 이후
   Appearance phase에 남기는 방향 승인;
4. 좁은 `200%` Text에서 Active value를 Identity 아래로 Reflow하는 방향 승인;
5. 측정된 S3 전환 후보 `480`, `640`, `768`, `1056px` 승인;
6. Exam을 보존하고 Current row에 별도 Visible 내 순위 Line을 두는 방향 승인.

이 Gate 승인은 구조와 반응형 동작만 검증합니다. 최종 시각 Design, Color, Material,
정확한 Dimension, Ranking logic 구현 또는 Application code를 승인하지 않습니다.
