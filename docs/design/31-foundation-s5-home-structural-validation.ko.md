# NosLog 2.0 Foundation S5 홈 구조 검증

## 문서 관리

- 상태: `승인 — S5 1차 검토 완료`
- 문서 언어: 한국어 동기화본
- 영어 원본:
  [31-foundation-s5-home-structural-validation.md](./31-foundation-s5-home-structural-validation.md)
- 작성 시작일: 2026-08-08
- 범위: 대표 Specimen `S5`에서 승인된 홈 정체성, 공용 검색, 적응형 목적지
  Collection, 공지 계층, 편집 콘텐츠 구성, 다국어, 상태, Target 및 반응형
  계약의 구조 검증
- 인터랙티브 Specimen:
  [s5-home-structure.html](./specimens/s5-home-structure.html)
- 승인 경계: 이 문서는 최종 Color, Material, Logo Drawing, Icon Set, 정확한
  실제 Dimension, 최종 Component Styling, X Widget 구현, Search API, 실제 Copy,
  최종 Page 구성 또는 Application Code를 승인하지 않습니다.

## 관련 권위 문서

- [홈 페이지 기획서](./03-home-page-brief.ko.md)
- [공지 페이지 기획서](./14-announcements-page-brief.ko.md)
- [공용 Shell 및 Navigation 기획서](./15-shared-shell-navigation-brief.ko.md)
- [공용 탐색 페이지 기획서](./04-shared-discovery-page-brief.ko.md)
- [Foundation v0.1 조사 Brief](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation Semantic Role Map](./25-foundation-semantic-role-map.ko.md)
- [Foundation Typography 및 Layout 후보](./26-foundation-typography-layout-candidates.ko.md)

홈 기획서는 목적, 과업 계층, 목적지 의미, 검색 동작, 공지 배치, 공식 소식
역할, 상태 동작 및 승인된 적응형 Compact `3 × 3` / Standard `4 × 2` 목적지
관계를 소유합니다. 공지 기획서는 게시와 Archive/Detail 동작을 소유합니다.
문서 `25`와 `26`은 공용 Typography,
Spacing, Grid, Container, Density 및 Target 계약을 소유합니다. 이 검증은 충돌을
드러낼 수 있지만 이러한 권위 문서를 조용히 다시 작성할 수 없습니다.

## 검증 목적

`S5`는 홈이 Marketing page, Dashboard 또는 모든 목적지의 축소판이 아니라
즉각적인 방향 파악 및 이동 Surface로 유지될 수 있는지 검증합니다. 다음에
답해야 합니다.

1. Compact `N` Mark, 보이는 `NosLog` Heading, 다국어 서비스 맥락 및 공용
   악곡/채보 검색을 절제된 정체성·과업 영역으로 묶을 수 있는가?
2. 검색을 가장 강한 홈 과업으로 유지하면서 대체 Navigation을 지원하는 여덟
   직접 목적지도 보존할 수 있는가?
3. 같은 크기의 목적지 여덟 개가 `320 CSS px`에서 3열 3행으로 Reflow되고 충분한
   너비에서는 4열 2행으로 복귀하면서 한국어/일본어/영어 및 `200%` Text에서도
   Clipping, Truncation, Micro-type 또는 문서 가로 Scroll을 피할 수 있는가?
4. 중간 및 넓은 Layout에서 현재의 `390px` Canvas를 유지하거나 네 Block을
   끝없이 늘리지 않고 검색과 목적지를 의도적으로 제한할 수 있는가?
5. 서비스 중요 공지 하나를 검색 앞에 두면서 일반 업데이트를 Alert로 만들거나
   빈 예약 공간을 만들지 않을 수 있는가?
6. 일반 NosLog 공지와 보조적인 NOSTALGIA 공식 원문을 승인된 순서로 유지하면서
   Compact에서는 쌓고 Wide에서는 `8/4` 편집 관계를 사용할 수 있는가?
7. 공식 X 영역이 실패하거나 차단돼도 깨진 Frame, 무한 Skeleton 또는 핵심 홈
   과업 접근 손실 없이 복구할 수 있는가?
8. 검색 Preview가 Layout Shift, 내부 스크롤, 자동 이동 또는 오래된 상태 없이
   이후 홈 콘텐츠 위에 Overlay될 수 있는가?

## 비목표

- 최종 홈 디자인, 최종 Figma 화면 또는 실제 구현이 아닙니다.
- 최종 Dark Palette, Border, Radius, Elevation, Iconography, Motion, Logo
  Artwork, Illustration 또는 최종 Component Styling을 정하지 않습니다.
- Scope selector, IME 안전 Debounce, Search API, X Widget, 공지 Route 또는
  반응형 Application Shell을 구현하지 않습니다.
- 홈을 개인화하거나 고정 하단 Navigation을 추가하거나 목적지 Block 설명을
  추가하거나 목적지 순서와 승인된 적응형 Geometry를 다시 열지 않습니다.
- Feedback을 홈으로 되돌리거나 Privacy·GitHub를 Footer 밖으로 이동하거나 이미
  승인된 공지 순서를 바꾸지 않습니다.
- Legacy NOSTORY Figma를 현재 Layout 권위로 사용하지 않습니다.

## 관찰된 기준선

### 저장소 및 브라우저 근거 — 2026-08-08

| ID          | 관찰                                                                                                                                | 상태   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `S5-OBS-01` | 현재 Route는 홈 전용 악곡 검색, `3 × 2` Grid의 직접 목적지 6개, 별도 데이터 연동 행, 홈 Feedback 및 공식 X를 Rendering합니다.       | `관찰` |
| `S5-OBS-02` | 승인된 홈 계약은 채보 뷰어를 두 번째 동등 목적지로 요구하지만 현재 직접 홈 목적지에는 없습니다.                                     | `관찰` |
| `S5-OBS-03` | 현재 구현은 일반 공지를 승인된 하단 편집 영역이 아니라 정체성과 검색 앞에 둡니다.                                                   | `관찰` |
| `S5-OBS-04` | `1440 × 900` Browser Viewport에서 현재 `main`은 약 `390px`, 목적지 Grid는 약 `358px`에 머뭅니다.                                    | `관찰` |
| `S5-OBS-05` | `320`과 `390px`에서 현재 Grid는 3열과 `80px` 높이 Block 6개이며 데이터 연동은 별도 가로 행입니다.                                   | `관찰` |
| `S5-OBS-06` | 현재 공식 Widget은 검증 Browser에서 사용할 수 있는 보이는 원문 게시물 영역을 만들지 못하며 공식 계정 Fallback만 사용할 수 있습니다. | `관찰` |
| `S5-OBS-07` | 현재 홈에는 승인된 악곡/채보 Scope selector, Preview Popup, 전체 결과 인계 또는 Preview 복구 상태가 없습니다.                       | `관찰` |
| `S5-OBS-08` | 이 초안을 시작하기 전 저장소와 Browser 기준은 `dev`에서 깨끗하고 동기화돼 있었습니다.                                               | `관찰` |

이 관찰은 Migration 근거일 뿐입니다. 현재 시각 계층, 좁은 Desktop Canvas, 목적지
Geometry, Feedback 위치 및 공지 위치는 2.0 디자인 권위가 아닙니다.

## 검증할 승인 계약

### 정체성 및 주요 과업

- Compact `N` Logo Mark를 홈 정체성 요소로 유지합니다.
- 보이는 `NosLog` `h1` 하나와 다국어 서비스 맥락 한 줄을 유지합니다. `N` Mark는
  둘 중 어느 것도 대체하지 않습니다.
- 홈을 제한된 `display` Role로 올리지 않고 공용 `page-title` Role을 사용합니다.
  검색은 구성과 과업 위치를 통해 더 강하게 유지합니다.
- 악곡이 기본 검색 범위입니다. Compact 선행 Scope control이 악곡/채보 맥락을
  전환하며 두 개의 영구 검색 행이나 Tab button을 만들지 않습니다.
- Preview는 고정된 비모달 Popup입니다. 빈 Field 추천과 내부 스크롤이 없고,
  최대 다섯 Match, 필요할 때 별도 전체 결과 인계 및 간결한 Loading/Empty/Error
  복구를 제공합니다.

### 검색 및 목적지 너비 관계

대표 구조는 승인된 Page-grid tier를 다음처럼 사용합니다.

| Page-layout Tier              | 검색 및 정체성 | 목적지 Collection | 목적지 Geometry |
| ----------------------------- | -------------- | ----------------- | --------------- |
| Narrow compact 영역 `<448px`  | `4/4` Track    | `4/4` Track       | 정확히 `3 × 3`  |
| Compact 영역 `≥448px`, `<672` | `4/4` Track    | `4/4` Track       | 정확히 `4 × 2`  |
| Intermediate                  | 중앙 `6/8`     | `8/8` Track       | 정확히 `4 × 2`  |
| Wide `≥1056`                  | 중앙 `8/12`    | 중앙 `8/12`       | 정확히 `4 × 2`  |

`448px`은 현재 Compact Gutter를 가진 `480px` Specimen Frame에 대응하는 측정된
목적지 영역 가용 너비이며 보편적인 기기 Breakpoint가 아닙니다. 실제 구현은
Collection Container의 가용 너비에 반응해야 합니다. Page-grid Threshold는 더 큰
영역을 계속 정렬합니다. Wide에서 검색과 목적지는 전체 `standard` Container로
늘어나지 않고 제한됩니다.

### 목적지 Component Family

- 악곡, 채보 뷰어, 서열, 랭킹, 빙고, 검정, 오락실 및 데이터 연동의 승인 순서로
  완전한 Link Target 8개의 Semantic list를 사용합니다. 간결한 보이는 Navigation
  Label은 한국어에서 `악곡`, `채보`, `서열`, `랭킹`, `빙고`, `검정`, `오락실`,
  `데이터 연동`을 사용하고 첫 두 항목의 영문은 `Music`/`Charts`, 일본어는
  `楽曲`/`譜面`을 사용합니다.
- 각 Peer는 필수적이지 않은 Icon 하나와 보이는 다국어 Label 하나로 된 같은
  Navigation Component Anatomy를 사용합니다. 설명, 상태 Badge, 중첩 Button 또는
  지역 Filter를 추가하지 않습니다.
- Group에는 Programmatic navigation label이 있지만 Specimen에는 별도 보이는
  Section Heading이 없습니다. 바로 보이는 Label이 이미 목적지를 식별하며 추가
  Heading은 Domain 의미 없이 주 검색과 경쟁합니다.
- Compact에서는 Text Width를 보호하기 위해 Icon과 Label을 쌓습니다. 측정된
  넓은 Width에서는 전체 Label이 맞을 때 Inline 정렬할 수 있습니다. `200%`
  Text에서는 다시 쌓습니다.
- Label은 줄바꿈하며 Clipping, Ellipsis, Icon-only Control 전환 또는 승인된
  `14/20` Control Role 아래 축소를 사용하지 않습니다. Row는 필요한 가장 긴
  Peer에 따라 커집니다.

### 공지 및 편집 계층

- 활성 서비스 중요 공지 최대 하나가 정체성과 검색 앞에 옵니다. Surface는
  `standard` Content 영역을 사용할 수 있지만 Wide에서 읽는 Content는 검색과
  같은 중앙 `8/12` 과업 너비로 제한합니다.
- 서비스 중요 공지가 없으면 Container와 예약 Gap도 없습니다.
- 일반 NosLog 공지는 목적지 뒤, NOSTALGIA 공식 소식 바로 앞에 유지하며 검색
  앞으로 이동하지 않습니다.
- Compact와 Intermediate는 일반 공지와 공식 소식을 Source 순서로 쌓습니다.
- Wide는 일반 NosLog 공지에 12개 중 8개, 공식 소식에 4개 Track을 사용합니다.
- 일반 공지는 승인된 최대 세 Title/Date 행과 전체 Archive Link를 유지합니다.
- 공식 영역은 사용할 수 있을 때 외부 Hosting 원문 게시물 하나를 포함합니다.
  실패 상태는 깨진 빈 Feed Shell 없이 간결한 다국어 상태와 공식 계정 직접
  Link를 포함합니다.

## 폭넓은 레퍼런스 비교

| 출처                                                                                                           | 전이 가능한 발견                                                                                         | S5 적용                                                        | 한계                                                           |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| [WCAG Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)                                | 검색과 직접 Link는 콘텐츠를 찾는 유효한 보완 방식입니다.                                                 | 공용 검색과 목적지 Collection을 모두 유지합니다.               | 시각 계층이나 Grid 개수는 정하지 않습니다.                     |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                         | 필수 콘텐츠는 `320 CSS px`에서 2차원 Page 스크롤 없이 Reflow됩니다.                                      | Type 축소나 Clipping 대신 Label을 줄바꿈하고 Row를 키웁니다.   | Phone Collection 4열을 요구하지 않습니다.                      |
| [W3C APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)                                         | Popup 소유, 확장 상태, Focus, 선택 및 Keyboard 동작에는 명시적인 Semantic이 필요합니다.                  | Scope 인식 검색 Preview 구조를 지배합니다.                     | Debounce나 홈 콘텐츠를 정하지 않습니다.                        |
| [USWDS Card](https://designsystem.digital.gov/components/card/)                                                | 단순 Action은 Content-heavy Card Anatomy가 필요하지 않습니다.                                            | 목적지 Block을 간결한 Navigation으로 유지합니다.               | Tile이나 정확한 Geometry를 요구하지 않습니다.                  |
| [USWDS Collection](https://designsystem.digital.gov/components/collection/)                                    | 제한된 Link Summary는 간결한 Scan과 별도 전체 목적지를 지원합니다.                                       | 일반 공지 세 행과 공지 Archive 인계를 유지합니다.              | 선택형 Summary와 Media는 S5에 불필요합니다.                    |
| [USWDS Site Alert](https://designsystem.digital.gov/components/site-alert/)                                    | Site Alert는 긴급한 Sitewide 정보용이며 쌓지 않아야 합니다.                                              | 검색 전 서비스 중요 Slot 하나를 유지합니다.                    | 정부 Emergency 강조는 NosLog보다 강할 수 있습니다.             |
| [GOV.UK Navigate a service](https://design-system.service.gov.uk/patterns/navigate-a-service/)                 | 반복 Multi-task Service는 모든 항목을 계속 펼치기보다 간결한 상위 목적지가 필요합니다.                   | Global Header는 절제하고 홈에서 승인된 과업 진입을 제공합니다. | 정부 Label과 Styling을 복사하지 않습니다.                      |
| [GOV.UK Notification banner](https://design-system.service.gov.uk/components/notification-banner/)             | 중요 Banner는 드물게 사용하고 완전한 정보로 Link해야 합니다.                                             | 간결한 서비스 상태 하나와 Detail 인계를 사용합니다.            | 일반 편집 업데이트를 지배하지 않습니다.                        |
| [Carbon Tile](https://carbondesignsystem.com/components/tile/usage/)                                           | Clickable Tile Group은 같은 Variant, 일관된 Dimension 및 하나의 전체 Tile Target을 사용합니다.           | 같은 Component Family의 동등한 Peer Link 8개를 사용합니다.     | Carbon Visual Token은 NosLog Token이 아닙니다.                 |
| [Fluent 2 Layout](https://fluent2.microsoft.design/layout)                                                     | Region은 Content Priority를 유지하며 가용 Width에 맞게 적응합니다.                                       | Compact Canvas를 확대하지 않고 과업 Region을 중앙 제한합니다.  | Fluent Breakpoint를 복사하지 않습니다.                         |
| [일본 디지털청 Layout](https://design.digital.go.jp/dads/foundations/layout/)                                  | 반응형 Column, Margin, Gutter 및 읽기 Region Width를 함께 지배합니다.                                    | 기존 NosLog 4/8/12 Alignment 계약을 검증합니다.                | 공공 Service 콘텐츠 Density는 다릅니다.                        |
| [MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | Component는 실제 Container 가용 Width에 반응할 수 있습니다.                                              | 중첩 검색/목적지/편집 구성을 측정된 공간에 맞춥니다.           | 구현 기능이 제품 계층을 정당화하지 않습니다.                   |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                                 | Rhythm-game Reference 과업, Service Notice 및 Official Notice를 구분된 Section으로 공존시킬 수 있습니다. | Domain 목적지를 보존하고 NosLog와 공식 소식을 구분합니다.      | 현재 Notice Density는 NosLog의 반례입니다.                     |
| [Songsterr Home](https://www.songsterr.com/)                                                                   | Chart 중심 Service는 즉시 검색을 가장 강한 공개 과업으로 만들 수 있습니다.                               | 공용 악곡/채보 검색을 편집 콘텐츠 앞에 유지합니다.             | 악기 Scope와 인기 Content는 NosLog에 대응하지 않습니다.        |
| [osu! Home](https://osu.ppy.sh/)                                                                               | Rhythm-game 정체성과 직접 Beatmaps/Rankings 목적지는 알아볼 수 있게 유지됩니다.                          | Generic Group Label 대신 명시적인 Domain Route를 보존합니다.   | 주요 Home 과업은 Archive Search가 아니라 Game Download입니다.  |
| [CHUNITHM International](https://chunithm.sega.com/)                                                           | 최근 Update를 제한하고 완전한 News 목적지로 연결합니다.                                                  | 유한 Home Summary와 완전한 공지 Archive를 지원합니다.          | 공식 Marketing 계층은 NosLog Layout Template가 아닙니다.       |
| [NOSTALGIA 공식 사이트](https://p.eagate.573.jp/game/nostalgia/op3/top/entrance.html)                          | 공식 Source 정체성과 Source-language Post는 구분됩니다.                                                  | 공식 X 영역을 보조적이고 Source 작성 상태로 유지합니다.        | Legacy 공식 Presentation은 접근성 또는 Layout 권위가 아닙니다. |

### 근거 수렴

- 접근성 및 Navigation 출처는 검색과 직접 목적지, 완전한 Label, 1차원 Page
  Reflow 및 Semantic Popup 동작을 함께 보존하는 데 수렴합니다.
- Tile 및 Layout System은 하나의 일치하는 Navigation Component Family, 전체
  Target Interaction, 제한된 Region 및 가용 공간 기반 구성에 수렴합니다.
- Alert 및 Update 출처는 하나의 긴급 서비스 상태와 전체 이력 목적지가 있는 제한된
  일반 편집 콘텐츠를 분리하는 데 수렴합니다.
- Rhythm-game 및 Chart Reference는 명시적인 Domain 목적지와 Source가 분리된
  공식 소식을 지지하지만 NosLog의 정확한 목적지 개수, 적응형 `3 × 3`/`4 × 2`
  관계 또는 악곡/채보 Scope 동작은 정하지 않습니다. 이는 승인된 NosLog
  결정입니다.

## 대표 Fixture 및 상태 Matrix

| ID        | 목적                    | Specimen Content                                                                  |
| --------- | ----------------------- | --------------------------------------------------------------------------------- |
| `HOME-01` | 정체성 및 검색          | `N` Mark, 보이는 `NosLog` Heading, 다국어 Context, Scope Control, Field 및 Submit |
| `HOME-02` | 목적지 Density          | Compact `3 × 3` 및 Standard/Wide `4 × 2` Geometry의 Icon-and-label 동등 Link 8개  |
| `HOME-03` | 일반 편집 계층          | Title/Date 공지 행 3개, Archive Link 및 공식 Source 영역 하나                     |
| `HOME-04` | 서비스 중단             | Detail 인계가 있는 간결한 서비스 중요 공지 하나                                   |
| `HOME-05` | Preview 결과            | 대표 Match 3개와 전체 결과 인계                                                   |
| `HOME-06` | Preview 진행 및 복구    | 지연 Loading 행, 간결한 No-match 상태 및 재시도 가능한 Retrieval 실패             |
| `HOME-07` | 빈 일반 공지 Collection | 일반 Section 생략, 목적지 뒤에 공식 Source 유지                                   |
| `HOME-08` | Third-party 실패        | Feed Shell 없이 다국어 실패 Copy와 공식 계정 Link                                 |

Specimen은 `320`, `390`, `480`, `672`, `1056`, `1280`, `1440px` Control,
한국어/일본어/영어 Content, 기본 및 `200%` Text, 대표 상태 8개를 노출합니다. 자동
측정은 추가로 목적지 전환 `479/480/481`, Page-grid 전환 `671/672/673`, Wide
전환 `1055/1056/1057px`, 모든 Width/Locale/Text/State 조합, Target Geometry,
Popup Containment 및 Frame Overflow를 포함해야 합니다.

## S5 구조 Slice

1. `S5-A` — Compact 홈 정체성이 있는 일반 공용 Header
2. `S5-B` — 주요 과업 앞의 선택적 서비스 중요 공지
3. `S5-C` — 절제된 `N` Mark, `NosLog` Heading, Context 및 공용 검색
4. `S5-D` — Results, 지연 Loading, Empty 및 Error 상태의 고정 Preview
5. `S5-E` — 적응형 Compact `3 × 3` 및 Standard/Wide `4 × 2` Geometry의 같은
   크기 전체 Link 목적지 8개
6. `S5-F` — 공지 3개 Collection과 Archive 인계
7. `S5-G` — 분리된 공식 원문 1개 또는 직접 Link Fallback
8. `S5-H` — Compact/Intermediate Stack과 Wide `8/4` 편집 구성
9. `S5-I` — 홈 Feedback 중복 없는 Privacy·GitHub 신뢰 Footer

## 측정 Matrix

| Group           | 필수 측정                                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Compact         | `320`, `390px`, 목적지 Threshold `479/480/481px` 및 Page-grid Threshold `671px`                                                                 |
| Intermediate    | `672`, `673px` 및 인접 Threshold `1055px`                                                                                                       |
| Wide            | `1056`, `1057`, `1280`, `1440px`과 `standard` 최대 동작                                                                                         |
| Text            | 기본 및 `200%`; 실제 구현은 Browser Zoom과 WCAG Text-spacing Override도 요구                                                                    |
| Language        | 한국어, 일본어, 영어의 긴 목적지, 공지, 검색 및 공식 Fallback Content                                                                           |
| Search State    | Closed, Results, Delayed Loading, No match 및 Retrieval Error                                                                                   |
| Editorial State | Normal, Service critical, No routine announcements 및 Official source unavailable                                                               |
| Input           | Keyboard/Pointer Scope, Preview Result, Complete handoff, Escape, Outside dismissal 및 Retry는 이후 검증                                        |
| Structure       | Frame Overflow 없음, 정확한 8개, 목적지 Threshold 아래 `3 × 3` 및 이상 `4 × 2`, Compact 마지막 행 선행 배치, 올바른 Wide Span, 중첩 스크롤 없음 |

## 브라우저 검증 기록

2026-08-08 Test Browser에서 측정했습니다.

| 검증                     | 결과             | 근거                                                                                                                                              |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 자동 구조 Matrix         | `통과 — 624/624` | Width 13개(`320`, `390`, `479`, `480`, `481`, `671`, `672`, `673`, `1055`, `1056`, `1057`, `1280`, `1440`) × 언어 3개 × Text scale 2개 × 상태 8개 |
| Document 가로 Overflow   | `통과`           | 검사한 모든 경우가 Specimen Frame을 넘지 않음                                                                                                     |
| 목적지 관계              | `통과`           | `320`, `390`, `479px`은 같은 크기 Target 8개를 `3 × 3`, `480px` 이상은 `4 × 2`로 유지하고 Compact 마지막 행은 앞쪽에 늘리지 않고 배치             |
| 목적지 전환              | `통과`           | 인접 `479/480/481px` 검사에서 승인된 목적지 Geometry만 바뀌고 Frame Overflow는 발생하지 않음                                                      |
| Target Geometry          | `통과`           | 모든 목적지 Target이 측정상 최소 `44px` Block size 유지                                                                                           |
| 검색 Preview Containment | `통과`           | Results, Loading, Empty 및 Error Preview가 내부 스크롤 없이 검색 영역 안에 유지                                                                   |
| Compact 시각 검토        | `통과`           | 한국어 기본 `390px` 및 영문 `200%` `320px`에서 `3 × 3`, 기본 Scale의 `14/20`, Source 순서, Ellipsis 없음 및 가로 Overflow 없음 확인               |
| Wide 시각 검토           | `통과`           | 한국어 기본 `1056px`에서 중앙 `8/12` 과업 영역과 `8/4` 편집 관계 유지                                                                             |
| Wide 일반 공지 없음 상태 | `통과`           | 일반 공지를 생략했을 때 공식 소식이 오른쪽 끝에 뜨지 않고 승인된 선행 `4/12` Track을 사용                                                         |

개정 전 첫 자동 실행에서는 영문 `200%`의 `320/390px` 열다섯 경우에서 Section
Heading 행이 가로 Overflow를 만들었습니다. Type을 줄이거나 Content를 자르는
대신 Heading, Archive/Source Link 및 확대된 Copy가 세로로 Reflow되도록
수정했습니다. `HOME-20` 이후 확장된 624개 Matrix도 실패 없이 통과했습니다.

이전의 의도적으로 가혹한 `320px` + 영문 `200%` 조합은 고정 네 열 Compact
Collection의 비용을 드러냈습니다. `HOME-20`은 이 관계를 세 열로 바꾸고 마지막
두 Peer를 세 번째 행 앞쪽에 같은 크기로 유지하며 보이는 채보 Navigation Label만
줄입니다. 숫자 Pass는 여전히 N Mark 강조, 검색 우선순위, 목적지 Density, Popup
Overlay, 공지 위치 및 Wide 편집 균형에 대한 사용자 검토를 대체하지 않습니다.

## 결정 및 검증 상태 기록

| ID       | 내용                                                                                                                                                                                                             | 상태   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `S5V-01` | 현재 6개 `3 × 2` 홈, 별도 데이터 연동, 홈 Feedback, 상단 일반 공지, 악곡 전용 검색 및 고정 `390px` Desktop Canvas를 Migration 근거로만 취급                                                                      | `관찰` |
| `S5V-02` | 보이는 `NosLog` Heading 및 다국어 서비스 설명과 함께 Compact `N` Logo Mark 유지                                                                                                                                  | `승인` |
| `S5V-03` | 홈 정체성은 `display`가 아닌 `page-title`로 유지하고 검색은 과업 순서와 제한된 구성을 통해 가장 강하게 만듦                                                                                                      | `승인` |
| `S5V-04` | Compact, Intermediate, Wide에서 `4/4`, 중앙 `6/8`, 중앙 `8/12` 검색 관계 사용                                                                                                                                    | `승인` |
| `S5V-05` | 이전에는 모든 Tier에서 목적지를 정확히 `4 × 2`로 유지했으나 Compact 다국어 및 확대 Text 검토 후 `S5V-10`으로 대체                                                                                                | `대체` |
| `S5V-06` | 중요 Surface는 Standard Region을 사용하되 Wide의 읽는 Content는 중앙 8-Track 과업 너비로 제한                                                                                                                    | `승인` |
| `S5V-07` | Wide 아래에서 편집 Section을 쌓고 Wide에서 일반 `8/12`와 공식 `4/12`를 사용하며 둘 다 목적지 위로 이동하지 않음                                                                                                  | `승인` |
| `S5V-08` | Wide에서 일반 공지가 없으면 남은 공식 영역을 오른쪽 끝에 띄우지 않고 선행 `4/12` Track에 배치                                                                                                                    | `승인` |
| `S5V-09` | 정확한 Visual Appearance, 실제 Dimension, Iconography, X Integration, Search 구현 및 Application Code를 이 Gate 밖에 유지                                                                                        | `승인` |
| `S5V-10` | 측정된 가용 너비 Threshold 아래에서 같은 크기 목적지 8개를 Compact `3 × 3`, 그 외에는 `4 × 2`로 사용하고 Compact 마지막 행을 앞쪽에 늘리지 않고 배치하며 간결한 다국어 채보 Label, `14/20`, Ellipsis 금지를 유지 | `승인` |

## 승인된 1차 검토 Gate — 2026-08-08

사용자는 `HOME-20` 이후 재측정한 Compact Specimen에서 앞쪽에 배치된 불완전한
마지막 행, 간결한 다국어 채보 Label, 측정된 `3 × 3`에서 `4 × 2`로의 전환을
검토했습니다. 사용자는 시각적 계층을 수용했고 실패 0건의 Matrix 결과가 추가
구조 Foundation 수정을 요구하지 않는다고 확인했습니다. 이에 S5 기록을
`측정된 초안`에서 `승인`으로 승격합니다.

이 승인은 구조, 계층, 반응형 동작, Content 순서 및 검증 계약에 한정됩니다.
Color, Material, 최종 Geometry, Iconography, Production 통합 및 Application
구현은 계속 이 Gate 밖에 둡니다.
