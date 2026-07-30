# NosLog 2.0 홈 페이지 기획서

## 문서 관리

- 상태: `논의용 초안`
- 근거 상태: `저장소 및 브라우저 감사 완료, 레퍼런스 비교 완료`
- 작성 시작일: 2026-07-30
- 문서 언어: 한국어 동기화본
- 영어 원본: [03-home-page-brief.md](./03-home-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 입력 감사 문서:
  [01-current-product-audit.ko.md](./01-current-product-audit.ko.md)
- 범위: 다국어 사용자 홈 경로 `/ko`, `/ja`, `/en`
- 제외 범위: 최종 High-fidelity 레이아웃, Foundation Token, 컴포넌트
  스타일, 관리자 재설계 및 애플리케이션 구현

## 결정 상태 표기

- **관찰:** 저장소, 현재 UI 또는 브라우저에서 검증했습니다.
- **승인:** 사용자가 명시적으로 합의했거나 승인된 문서에서 상속했습니다.
- **제안:** 논의를 위한 추천이며 아직 승인되지 않았습니다.
- **미확정:** 사용자 결정 또는 이후 검증이 필요합니다.
- **거절:** 방향에서 명시적으로 제외했습니다.

이 기획서는 필요한 콘텐츠, 동작, 상태 및 반응형 의도를 정의합니다. Claude
Design 또는 이후 Codex 구현 세션이 누락된 제품 결정을 임의로 만들어도 된다는
뜻이 아닙니다.

## 페이지 목적 및 사용자 Context

### 승인된 목적

홈은 NosLog의 주 진입·방향 파악 Surface입니다. 사용자가 다음 행동을 할 수
있어야 합니다.

1. NosLog가 NOSTALGIA 기록, 랭킹, 서열 및 채보 Archive임을 이해합니다.
2. 악곡 또는 공개 채보를 즉시 검색합니다.
3. 전체 사이트 구조를 학습하지 않고도 중요한 제품 목적지를 파악하고
   이동합니다.
4. 현재 방문에 실질적으로 영향을 주는 서비스 상태를 확인합니다.
5. 핵심 과업 뒤에서 낮은 우선순위의 플레이 지원과 공식 소식에 접근합니다.

홈은 개인 기록 Dashboard, 모든 기능의 축소판 또는 NOSTALGIA를 길게 설명하는
마케팅 페이지가 아닙니다.

### 주요 Context

| Context                      | 사용자 필요                                                             | 홈에 미치는 영향                                                                |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 오락실 플레이 전후의 모바일  | 악곡, 채보, 서열 위치, 요구조건 또는 오락실을 빠르게 찾습니다.          | 긴 탐색 없이 편집 콘텐츠보다 먼저 검색과 직접 목적지를 사용할 수 있어야 합니다. |
| 재방문 모바일 사용자         | 알고 있는 제품 영역에 최소한의 마찰로 다시 진입합니다.                  | 소개 문구보다 안정적인 라벨, 상대적 순서 및 충분히 큰 조작 영역이 중요합니다.   |
| 첫 방문 또는 비로그인 사용자 | 계정 없이 서비스를 이해하고 공개 콘텐츠를 찾습니다.                     | 정체성과 공개 기능이 명확해야 하며 로그인이 탐색을 막으면 안 됩니다.            |
| 데스크톱 조사 또는 비교      | 더 넓은 공간에서 목적지, 업데이트 및 이후의 고밀도 데이터를 확인합니다. | 의미적 계층을 바꾸지 않으면서 현재 390px 열보다 넓게 홈 셸이 확장돼야 합니다.   |
| 한국어·일본어·영어 사용자    | 선택한 언어로 컨트롤과 서비스 정보를 읽습니다.                          | 번역된 UI 라벨뿐 아니라 편집 콘텐츠에도 명시적인 다국어 정책이 필요합니다.      |

로그인 여부는 계정 컨트롤과 권한이 필요한 동작을 바꿉니다. 개인화 홈 Dashboard를
만들거나 홈 핵심 계층의 순서를 바꾸지는 않습니다.

## 주 과업 및 성공 조건

### 승인된 주 과업

홈의 주 과업은 원하는 악곡 또는 공개 채보를 찾고 관련 상세·뷰어 흐름으로
진행하는 것입니다.

### 보조 과업

- 악곡, 채보 뷰어, 랭킹, 서열, 빙고, 검정 또는 오락실을 직접 엽니다.
- 데이터 연동 안내 흐름을 시작하거나 다시 확인합니다.
- 적용되는 서비스 중요 공지를 읽습니다.
- 낮은 우선순위의 NOSTALGIA 공식 소식에 접근합니다.

### 성공 조건

사용자가 모호함 없이 다음 중 하나를 수행할 수 있으면 홈 방문이
성공적입니다.

- 악곡 또는 채보 검색 범위를 선택하고 제목·아티스트 Query를 제출해 일치하는
  공용 검색 Surface에 도달합니다.
- Query를 먼저 입력하지 않고 선택한 검색 범위를 탐색합니다.
- 승인된 일곱 제품 목적지 중 하나를 엽니다.
- 독립된 플레이 지원 동작으로 데이터 연동을 엽니다.
- NosLog 사용 가능 여부나 사용 방법을 바꾸는 서비스 상태를 이해합니다.

## 확정된 제품 입력

- **승인:** 모바일이 주요 Context이며 390px을 중심 기준으로 사용합니다.
  데스크톱도 필수입니다.
- **승인:** 일반 페이지는 반응형 상단 헤더를 사용합니다. 홈은 고정 하단
  내비게이션을 추가하지 않습니다.
- **승인:** 홈은 페이지 단위 직접 이동 블록 모음을 유지합니다.
- **승인:** 악곡과 채보 검색은 간결한 선행 범위 선택기를 가진 하나의
  Surface를 공유합니다. 채보 뷰어 진입은 채보 범위가 선택된 검색을 엽니다.
- **승인:** 악곡, 채보 뷰어, 랭킹, 서열, 빙고, 검정 및 오락실은 별도
  목적지로 유지합니다. 통합 콘텐츠 라벨을 도입하지 않습니다.
- **승인:** 데이터 연동은 별도 홈 행과 안정적인 더보기 Panel 진입으로
  유지합니다.
- **승인:** 피드백은 홈에서 더보기 Panel로 이동하고 푸터에 중복하지
  않습니다.
- **승인:** 개인정보처리방침과 GitHub는 푸터 목적지로 유지합니다.
- **거절:** 오래된 연동, 최근 플레이 또는 미완료 빙고·검정용 로그인
  사용자 개인화 카드.
- **승인:** 공식 소식은 X가 제공하는 `NOSTALGIA_573` 공식 Embedded
  Timeline을 사용하고, 일반 NosLog 공지 바로 다음의 별도 공식 소식 Grid
  또는 영역에 최신 게시물 하나를 표시합니다.
- **승인:** 이 홈 요구사항을 위해 유료 X API, Scraping 또는 비공식 취득
  서비스를 추가하지 않습니다.
- **관찰:** 현재 공식 Widget 연동은 검증한 브라우저에서 게시물을 렌더링하지
  못하므로 NosLog 2.0에 그대로 복사하지 않고 구현을 수정한 뒤 브라우저에서
  검증해야 합니다.
- **승인:** NosLog가 작성한 공지는 한국어·일본어·영어 콘텐츠를 모두
  요구합니다. 외부 공식 X 게시물은 원문 언어로 유지하며 NosLog는 주변 제목,
  Link 및 Fallback Text를 다국어로 제공합니다.
- **승인:** 홈은 최신 일반 NosLog 공지 세 건을 간결한 제목·게시일 Link로
  표시합니다. 전체 공지 본문을 홈 안에서 펼치지 않습니다.
- **승인:** 각 일반 공지는 다국어 공개 상세 페이지를 열고, `전체 공지`
  Link는 다국어 공지 Archive를 엽니다. 공개된 항목이 없으면 일반 공지
  Section 전체를 생략합니다.
- **승인:** 홈의 세 건 제한은 모바일과 데스크톱에서 동일하게 유지합니다.

## 현재 제품 기준선

### 현재 경로 및 의존성

현재 서버 렌더링 홈 경로는 `app/(nevigation)/(home)/page.tsx`입니다. 다음
내용을 불러옵니다.

- 현재 사용자
- 최신순으로 공개된 NosLog 공지 최대 세 개
- 선택 Locale과 Message Catalog
- 일반 헤더와 푸터
- 악곡 전용 검색 Form
- 같은 크기의 여섯 Quick Link: 악곡, 랭킹, 빙고, 서열, 검정, 오락실
- 별도 데이터 연동 링크
- 현재 피드백 Dialog Trigger
- 지연 로드되는 공식 X Timeline

현재 `Announcement` 모델은 Locale, 중요도, 만료일 또는 대상 사용자 Field
없이 하나의 제목과 본문만 저장합니다. 관리자 입력 제한은 제목 80자, 본문
2,000자입니다.

### 브라우저 근거: 2026-07-30

| 확인 항목            | 관찰 결과                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 390 × 844 한국어 홈  | 문서 높이 `985px`, 문서 단위 가로 Overflow 없음, 한 열 콘텐츠                                                                 |
| 390px 일본어 및 영어 | 두 Locale 모두 문서 단위 가로 Overflow 없음. UI 라벨은 번역되지만 저장된 공지는 한국어로 유지됩니다.                          |
| 1440 × 1000 홈       | 헤더와 Main이 `x = 525px`의 중앙 `390px` 열로 유지되며 사용할 수 있는 데스크톱 너비를 쓰지 않습니다.                          |
| 현재 콘텐츠 순서     | 공지 → 정체성과 악곡 검색 → 여섯 Quick Link → 데이터 연동 → 피드백 → 공식 소식                                                |
| 스크롤 전 공식 X     | 다국어 Fallback Link가 있고 X iframe 또는 Script는 로드되지 않았습니다.                                                       |
| 스크롤 후 공식 X     | Script와 세 개의 X/Twitter iframe이 생성되지만 Timeline iframe은 `0 × 0` 숨김 상태로 남아 Fallback Link만 사용할 수 있습니다. |
| 공지가 없는 상태     | 공지 Section 전체가 표시되지 않습니다.                                                                                        |
| 빈 악곡 Query        | `/ko/music`과 `/ko/music?q=` 모두 Filter 가능한 기본 Catalog를 열며 첫 로드에는 악곡 Link 20개가 있고 검증 오류는 없습니다.   |
| 공백 악곡 Query      | `/ko/music?q=%20%20%20`은 같은 기본 Catalog로 정규화되며 보이는 검색창은 빈 상태로 유지됩니다.                                |
| 구체적 악곡 Query    | `/ko/music?q=Altale`은 보이는 Query를 유지하고 첫 결과 집합을 일치하는 악곡 하나로 좁힙니다.                                  |

이 관찰은 기능과 위험을 식별합니다. 현재의 390px 데스크톱 제약, 동일한 카드 비율,
콘텐츠 순서 또는 스타일을 승인하지 않습니다.

## 콘텐츠 목록 및 처리 방향

| 콘텐츠 또는 기능        | 필요한 처리 방향                                                                                                  | 상태   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| 일반 헤더               | 승인된 반응형 셸을 사용합니다. 홈은 두 번째 전역 내비게이션 시스템을 추가하지 않습니다.                           | `승인` |
| 서비스 정체성           | 주 검색 근처에 간결한 NosLog 정체성과 NOSTALGIA Context를 유지합니다.                                             | `승인` |
| 서비스 중요 공지        | 현재 가장 영향이 큰 활성 서비스 공지 최대 하나만 검색 앞에 표시하고 없으면 여백을 예약하지 않습니다.              | `승인` |
| 일반 NosLog 공지        | 최신 세 건을 하단 업데이트 영역의 간결한 제목·게시일 Link로 표시하고 다국어 상세·Archive 페이지로 연결합니다.     | `승인` |
| 악곡·채보 검색          | 범위를 인식하는 공용 검색을 가장 강한 홈 과업으로 만듭니다.                                                       | `승인` |
| 일곱 목적지 블록        | 악곡, 채보 뷰어, 랭킹, 서열, 빙고, 검정 및 오락실을 별도로 발견할 수 있게 유지합니다.                             | `승인` |
| 데이터 연동             | 주 목적지 모음 다음의 시각적으로 구분된 플레이 지원 동작으로 유지합니다.                                          | `승인` |
| 피드백                  | 홈 Trigger를 제거하고 더보기 Panel에서 제공합니다.                                                                | `승인` |
| NOSTALGIA 공식 소식     | 공식 X Embedded Timeline으로 일반 NosLog 공지 바로 다음의 별도 Grid에 최신 원문 게시물 하나를 한 번만 표시합니다. | `승인` |
| 개인화 다음 행동 Module | 추가하지 않습니다.                                                                                                | `거절` |
| 푸터                    | 개인정보처리방침과 GitHub를 안정적인 보조 목적지로 유지합니다.                                                    | `승인` |

## 레퍼런스 비교

레퍼런스는 2026-07-30에 확인했습니다. 각각 다른 역할의 근거이며 복사할 시각
Template이 아닙니다.

| 출처                                                                                                      | 가져올 원칙                                                                                                   | NosLog 적용                                                                                                          | 한계                                                                                |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [W3C WCAG 2.2: Multiple Ways](https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways)                  | 검색과 직접 내비게이션은 같은 콘텐츠를 찾는 서로 다른 유효한 방법을 제공할 수 있습니다.                       | 강한 공용 검색과 직접 홈 목적지를 모두 유지하며 어느 하나가 다른 하나를 대체하지 않습니다.                           | 시각적 비중이나 카드 레이아웃을 지정하지 않습니다.                                  |
| [W3C WCAG 2.2: Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) | 제목과 라벨은 목적을 설명해 사용자가 콘텐츠를 예측하고 방향을 파악하도록 해야 합니다.                         | 검색 범위, 목적지 이름, 공지 및 소식에 각 Locale의 설명적인 보이는 Text가 필요합니다.                                | NosLog 용어를 선택하지는 않습니다.                                                  |
| [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)               | 계층, 점진적 공개, 일관성, 근접성 및 정렬은 인지 부하를 줄입니다.                                             | 유지 대상이라는 이유만으로 검색, 목적지, 지원 및 편집 콘텐츠에 같은 시각적 비중을 주지 않습니다.                     | 일반 원칙이며 도메인 근거는 아닙니다.                                               |
| [GOV.UK: Navigate a Service](https://design-system.service.gov.uk/patterns/navigate-a-service/)           | 반복 사용하는 다중 과업 서비스는 사이트맵이 아닌 가장 유용한 최상위 Section의 간결한 내비게이션이 필요합니다. | 전역 헤더는 절제하고 홈은 승인된 제품 목적지로 향하는 과업 중심 진입점을 제공합니다.                                 | 정부 서비스 스타일과 정확한 헤더 구성은 적용하지 않습니다.                          |
| [USWDS: Card](https://designsystem.digital.gov/components/card/)                                          | 카드는 관련된 모음 안의 행동 가능한 요약이며 단순한 동작에는 카드가 아닌 표현이 나을 수 있습니다.             | 목적지 블록은 열거 가능한 Link 모음이 될 수 있고 데이터 연동은 또 하나의 카드가 아닌 별도 행으로 유지할 수 있습니다. | 카드를 요구하거나 NosLog의 서로 다른 우선순위를 결정하지 않습니다.                  |
| [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                         | Mobile-first로 시작해 넓은 Breakpoint에서 조정하고 Container Query는 실제 사용 가능한 공간에 반응합니다.      | 의미적 순서를 유지하면서 컨테이너 너비가 충분해질 때 홈 블록과 업데이트를 재구성합니다.                              | Framework 기능은 특정 Breakpoint나 열 개수의 근거가 아닙니다.                       |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                            | 리듬게임 정보 서비스는 도메인 직접 목적지, 신규 채보 및 서비스·공식 공지를 함께 제공할 수 있습니다.           | 도메인 과업과 업데이트를 보존하면서 목적과 우선순위로 구분합니다.                                                    | Taiko.wiki의 라벨, 밀도 및 운영 모델을 복사하면 안 됩니다.                          |
| [Taiko.wiki Song Search](https://taiko.wiki/song?lang=en)                                                 | 검색, 신규 채보, 장르 및 난이도 Filter가 채보 중심 탐색을 지원합니다.                                         | 홈은 전체 Filter를 복제하지 않고 기능이 충분한 공용 검색으로 넘깁니다.                                               | 검색 결과 페이지이며 홈 레이아웃 모델이 아닙니다.                                   |
| [MusicBrainz Home](https://musicbrainz.org/)                                                              | 음악 Database는 Type 선택 검색을 지속적으로 두고 설명, 소식 및 Community 콘텐츠를 그 아래 배치합니다.         | 검색을 안정적인 제품 컨트롤로 만들고 설명·편집 콘텐츠를 보조 요소로 둡니다.                                          | MusicBrainz는 NosLog에 없는 기여 및 백과사전 목표가 있습니다.                       |
| [Songsterr Home](https://www.songsterr.com/)                                                              | 채보 서비스는 검색을 먼저 배치하고 간결한 범위를 제공한 뒤 탐색 가능한 인기 콘텐츠를 노출합니다.              | 간결한 범위 컨트롤을 가진 즉시 사용 가능한 채보 중심 검색의 가치를 확인합니다.                                       | 악기 범위와 인기 목록은 NOSTALGIA 모드나 NosLog 우선순위에 대응하지 않습니다.       |
| [osu! Home](https://osu.ppy.sh/)                                                                          | 리듬게임 서비스는 강한 서비스 정체성과 함께 Beatmaps 및 Rankings 직접 목적지를 보존합니다.                    | 모든 것을 일반 메뉴 뒤에 숨기지 않고 도메인 용어와 직접 경로를 인식 가능하게 유지합니다.                             | 공개 홈은 플레이 가능한 게임 다운로드가 중심이지만 NosLog는 Archive와 Viewer입니다. |
| [Official NOSTALGIA Op.3](https://www.konami.com/arcadegames/products/am_nostalgia_op3/)                  | 공식 자료는 NOSTALGIA 용어, 피아노 상호작용, 손 색상 및 오락실 Context를 확립합니다.                          | NosLog 정체성과 뷰어 설명은 다루는 게임에 충실하고 비공식임을 명확히 해야 합니다.                                    | 기록 서비스 홈 패턴이 아닌 마케팅·사용 안내 페이지입니다.                           |
| [USWDS: Site Alert](https://designsystem.digital.gov/components/site-alert/)                              | 사이트 전체 Alert는 긴급하고 시간에 민감한 서비스 정보용이며, 눈에 띄게 배치하되 여러 개를 쌓지 않습니다.     | 검색 앞 위치는 일반 프로젝트 업데이트가 아닌 현재 가장 영향이 큰 서비스 공지 최대 하나에만 예약합니다.               | 정부 전체 Emergency Pattern은 일반 NosLog 공지에는 과도합니다.                      |
| [GOV.UK: Notification Banner](https://design-system.service.gov.uk/components/notification-banner/)       | Notification Banner는 현재 페이지 콘텐츠와 직접 관련되지 않은 중요한 정보를 전달합니다.                       | 모든 공지를 최상단 Banner로 만들지 않고 활성 서비스 상태를 별도 메시지 역할로 취급합니다.                            | 편집 소식 영역이나 NosLog 발행 규칙을 정하지는 않습니다.                            |
| [Carbon: Notification](https://carbondesignsystem.com/components/notification/usage/)                     | Notification의 중단성은 목적에 맞아야 하고 Context Callout은 영향을 주는 콘텐츠 가까이에 배치합니다.          | 운영 상태와 일반 업데이트를 분리하고 필요한 경우 간결한 메시지와 상세 Link를 제공합니다.                             | Carbon도 모든 제품 수준 Banner 사용례에 대한 최종 지침을 제공하지는 않습니다.       |
| [W3C APG: Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                 | Alert는 짧고 중요하며 시간에 민감해야 하고 잦은 중단과 자동 사라짐은 사용성을 해칩니다.                       | 정적인 일반 업데이트에 Live Alert 의미를 사용하지 않고 중요한 서비스 메시지를 자동으로 사라지게 하지 않습니다.       | ARIA 의미가 시각적 위치나 편집 우선순위를 정하지는 않습니다.                        |
| [X Help: Embed a Timeline](https://help.x.com/en/using-x/embed-x-feed)                                    | Embed Profile Timeline은 Source 계정의 공개 게시물을 다른 웹사이트에 표시합니다.                              | 공식 NOSTALGIA 원문 Source를 홈에 유지하면서 외부 Link Fallback을 제공합니다.                                        | Embed는 개인정보, 성능 및 가용성 비용이 있는 Third-party Runtime입니다.             |
| [X Help: X for Websites and Privacy](https://help.x.com/en/x-for-websites-ads-info-and-privacy)           | Embed된 X 콘텐츠를 보면 페이지, IP 주소, 브라우저, 운영체제 및 Cookie 정보가 X에 전달될 수 있습니다.          | 승인된 Embed를 선택적인 Third-party 콘텐츠로 취급하고 NosLog 개인정보 정책과 일관되게 공개하거나 관리합니다.         | X의 데이터 처리를 설명하며 NosLog의 최종 동의·개인정보 구현을 정하지는 않습니다.    |

### HOME-12 집중 레퍼런스 비교

데스크톱 구성 결정에는 권위 있는 반응형 가이드, 프로덕션 탐색 제품, 리듬게임·음악
도메인 서비스 및 편집 Art Direction 레퍼런스에 해당하는 외부 출처 27개를
비교했습니다. 같은 레이아웃 원칙이 반복되고 NosLog에 적용할 실질적으로 다른
대안이 더 나오지 않을 때까지 비교를 계속했습니다.

| 출처                                                                                                                                                                      | 관찰한 Pattern 또는 역할                                                                                                                                | NosLog 적용                                                                                                                            | 한계                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [W3C: CSS C32](https://www.w3.org/WAI/WCAG21/Techniques/css/C32)                                                                                                          | 반응형 영역은 2차원 스크롤 없이 Reflow되고 시각적 재배치가 의미 있는 Source·Focus 순서를 깨뜨리면 안 됩니다.                                            | 모든 너비에서 하나의 의미적 홈 순서를 유지하고 업데이트를 주 과업 앞으로 옮기지 않은 채 CSS로 영역을 재구성합니다.                     | 접근성 동작을 규정하며 선호하는 시각 Grid를 정하지는 않습니다.                                         |
| [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/)                                                                                                     | Mobile-first 단일 열은 제어된 2/3 또는 2/3+1/3 레이아웃이 될 수 있고 콘텐츠 너비는 필요에 맞아야 합니다.                                                | 390px 데스크톱 제약은 제거하되 모든 홈 요소를 Viewport 전체로 늘리지 않고 제한된 콘텐츠 영역을 사용합니다.                             | 정부의 Long-form 레이아웃은 NosLog 홈보다 차분하고 Text 중심입니다.                                    |
| [USWDS: Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)                                                                                             | 중앙 정렬되고 유연한 Mobile-first 12열 Grid가 반응형 Column Span을 지원합니다.                                                                          | 주요 홈 구역은 공용 데스크톱 Grid에 정렬하고 내부 Collection은 목적에 맞는 Span을 선택하게 합니다.                                     | Utility System은 NosLog 계층이나 Breakpoint를 결정하지 않습니다.                                       |
| [Material 3: Canonical Layouts](https://m3.material.io/foundations/layout/canonical-examples/overview)                                                                    | Feed Grid는 동등한 Collection에 적합하고 Supporting Pane은 보조 콘텐츠가 주 과업을 직접 지원할 때 적합합니다.                                           | 동등한 목적지에는 Grid를 사용하지만 검색과 관련 없는 공지를 영구 Supporting Rail에 배치하지 않습니다.                                  | 표준 Application 레이아웃은 구조 참고이며 NosLog Surface Styling이 아닙니다.                           |
| [Atlassian: Applying Grid](https://atlassian.design/foundations/grid-beta/applying-grid/)                                                                                 | Fixed Grid와 Fluid Grid는 서로 다른 콘텐츠에 적합하며 넓은 Fixed Grid가 제약 없는 Fluid 확장보다 관계를 안정적으로 제어합니다.                          | 제한된 반응형 Container와 일관된 Keyline을 사용하고 휴대전화 Canvas나 무제한 데스크톱 너비를 유지하지 않습니다.                        | Atlassian의 기본 최대 너비를 검증 없이 NosLog Token으로 사용하면 안 됩니다.                            |
| [Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)                                                                                              | 반응형 열은 Breakpoint에 걸쳐 반복 가능한 화면 영역과 공용 Keyline을 만듭니다.                                                                          | 검색, 목적지, 데이터 연동, 업데이트 및 푸터를 하나의 레이아웃 System에 연결하면서 컴포넌트 내부 레이아웃은 다르게 유지합니다.          | Carbon의 16열 구현과 Spacing 값을 직접 채택하지 않습니다.                                              |
| [Singapore Government Design System: Responsive Grid](https://www.designsystem.tech.gov.sg/foundations/layout/responsive-grid)                                            | 4·8·12열 레이아웃은 너비에 따라 재구성되고 Sidebar는 기본 데스크톱 요구가 아닌 Context Pattern입니다.                                                   | 데스크톱을 의도적인 Grid 확장으로 취급하며 승인된 콘텐츠가 필요로 하지 않으므로 홈에 영구 Sidebar를 두지 않습니다.                     | 지정된 Container 수치는 최종 NosLog 치수가 아닙니다.                                                   |
| [Adobe Spectrum: Spacing](https://spectrum.adobe.com/page/spacing/), [Headers](https://spectrum.adobe.com/page/headers/), [Cards](https://spectrum.adobe.com/page/cards/) | 페이지 Shell은 Fixed 또는 Fluid Grid에 정렬되고 컴포넌트 우선순위는 반응형으로 바뀌며 카드 Group은 모든 내부 Edge를 강제하지 않고 주 Grid에 정렬됩니다. | 목적지 Collection과 편집 영역은 홈 Grid에 정렬하되 검색과 개별 블록 내부는 읽기 좋은 너비로 유지합니다.                                | 전체 생태계 System을 설명하며 NosLog의 어두운 Visual Language가 아닙니다.                              |
| [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                                                                                         | Mobile-first Variant는 넓은 레이아웃 변경을 추가하며 컴포넌트 조정은 Device 이름이 아닌 사용 가능한 공간을 따라야 합니다.                               | 모바일 기준을 유지하고 콘텐츠 관계가 요구하는 데스크톱 재구성만 추가하며 정확한 Breakpoint 값은 Foundation 검증으로 넘깁니다.          | Framework 문법은 구현 가이드이며 제품 근거가 아닙니다.                                                 |
| [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)                                                                               | 계층, 근접성, 정렬, 일관성 및 점진적 공개는 사용자가 주 정보와 보조 정보를 구분하도록 돕습니다.                                                         | 검색을 가장 강하게 유지하고 동등한 일곱 목적지를 Grouping하며 모든 유지 항목에 같은 비중을 주지 않고 업데이트를 핵심 과업 뒤에 둡니다. | 원칙만으로 NosLog 고유 순서나 비율을 정할 수 없습니다.                                                 |
| [NSW Design System: Grid](https://designsystem.nsw.gov.au/core/grid/index.html)                                                                                           | 반응형 12열 System은 좁은 화면부터 넓은 화면까지 읽을 수 있고 접근 가능한 레이아웃을 지원합니다.                                                        | 공용 넓은 레이아웃 구조를 사용하면서 세 Locale과 지원하는 좁은 너비를 모두 검증합니다.                                                 | 공공 서비스 예시는 리듬게임 탐색 홈을 모델링하지 않습니다.                                             |
| [NICE Design System: Layout](https://design-system.nice.org.uk/foundations/layout/)                                                                                       | Mobile-first Fluid Grid는 좁은 페이지 전체를 균일하게 확대하지 않고 콘텐츠가 의도적인 Span을 차지하게 합니다.                                           | Collection과 업데이트 영역만 선택적으로 확장하고 검색과 Copy는 제한된 읽기 너비를 유지합니다.                                          | 건강 정보 Context는 NosLog보다 문서 중심입니다.                                                        |
| [Dell Design System: Grid](https://www.delldesignsystem.com/foundations/grid)                                                                                             | 반응형 Grid는 Viewport 범위에 따라 Margin, 본문 너비 및 사용 가능한 열을 조정합니다.                                                                    | 홈 구성에 390px 가정을 고정하지 않고 Container와 Gutter 동작을 Foundation 결정으로 정의합니다.                                         | Dell의 Breakpoint와 Margin 값은 NosLog 기본값이 아닙니다.                                              |
| [Denmark Common Design System: Grid](https://designsystem.dk/styleguide/grid/)                                                                                            | 12열 Grid는 반응형 레이아웃에 가로 정렬과 세로 Rhythm을 만듭니다.                                                                                       | 주요 홈 구역에 공용 Keyline을 사용하고 검색부터 푸터까지 안정적인 세로 순서를 유지합니다.                                              | 정확한 데스크톱 너비와 정부 Visual Convention은 가져오지 않습니다.                                     |
| [Spotify Search](https://open.spotify.com/search)                                                                                                                         | 넓은 탐색 Surface는 동등한 Browse Category를 영구 Application 내비게이션 옆의 다열 Grid로 확장합니다.                                                   | Browse Grid는 데스크톱 너비를 동등한 목적지에 사용하는 근거지만 영구 Library Rail은 승인된 NosLog 헤더 Shell에 적합하지 않습니다.      | Spotify는 훨씬 큰 영구 내비게이션 모델을 가진 재생 Application입니다.                                  |
| [Apple Music Search](https://music.apple.com/us/search)                                                                                                                   | 검색은 간결한 너비를 유지하고 Browse Category는 넓은 콘텐츠 Pane을 다열 Collection으로 사용합니다.                                                      | 홈 검색은 읽기 좋은 제한 너비로 유지하면서 목적지 Collection은 데스크톱 Container를 더 넓게 사용합니다.                                | 구독, 미디어 재생 및 Sidebar 모델은 NosLog에 대응하지 않습니다.                                        |
| [BeatSaver](https://www.beatsaver.com/)                                                                                                                                   | 채보 탐색은 넓은 검색·Filter 행 뒤에 밀도 높은 2열 결과 Collection을 사용합니다.                                                                        | 채보 콘텐츠가 데스크톱 너비에서 이점을 얻는다는 점을 확인하지만 전체 Filter와 결과는 홈 대신 공용 탐색 페이지에 유지합니다.            | Catalog 결과 Surface이며 홈 정보 계층 모델이 아닙니다.                                                 |
| [osu! Titanic: Beatmapsets](https://osu.titanic.sh/beatmapsets/)                                                                                                          | 밀도 높은 채보 탐색은 데스크톱 공간을 Filter와 표 형식 비교에 사용합니다.                                                                               | 넓고 비교 중심인 레이아웃은 하위 채보 탐색에 예약하고 홈은 밀도를 복제하지 않고 해당 화면으로 안내합니다.                              | 수천 개 결과가 있는 목록 페이지이며 방향 파악 Surface가 아닙니다.                                      |
| [Taiko.wiki Home](https://taiko.wiki/?lang=en)                                                                                                                            | 리듬게임 홈은 데스크톱 Rail, 검색, 직접 Link 및 나란한 공지를 사용하지만 결합된 밀도가 서로 주의를 경쟁합니다.                                          | 도메인 직접 접근과 서비스·공식 업데이트 구분은 유지하면서 영구 Rail과 시각적 밀도는 반례로 사용합니다.                                 | 운영, 광고 및 정보량이 NosLog와 다릅니다.                                                              |
| [Songsterr](https://www.songsterr.com/)                                                                                                                                   | 채보 서비스는 중앙 검색 과업을 인기 콘텐츠보다 강하게 강조합니다.                                                                                       | 더 넓은 목적지 Collection 전에 NosLog 정체성과 검색을 중앙의 강한 구역으로 유지하는 근거입니다.                                        | 악기 Tab과 인기 악곡 목록은 NosLog 범위나 목적지에 직접 대응하지 않습니다.                             |
| [MusicBrainz](https://musicbrainz.org/)                                                                                                                                   | 음악 Database는 검색을 먼저 제공하고 설명, 소식 및 Community 콘텐츠를 페이지 뒤에 배치합니다.                                                           | 과업 진입을 편집 콘텐츠보다 앞에 유지하고 일반 업데이트를 하단 의미 구역에 배치합니다.                                                 | 백과사전·기여 Platform이며 보조 과업이 다릅니다.                                                       |
| [BeastSaber](https://bsaber.com/?s=true)                                                                                                                                  | 풍부한 리듬게임 홈은 추천 Map, Pack, Article, Event 및 Ranking을 여러 경쟁 Module로 결합합니다.                                                         | 밀도 반례로 사용합니다. NosLog 홈은 방향 파악 Surface로 유지하고 개인화·편집 Dashboard로 만들지 않습니다.                              | Curation과 Community 발행 모델이 승인된 NosLog 홈 범위보다 넓습니다.                                   |
| [ArcadeStat](https://arcadestat.app/en/)                                                                                                                                  | 팬 제작 오락실 기록 서비스는 하나의 제품 Shell에서 여러 기록, 서열 및 음악 기능을 노출합니다.                                                           | NosLog 도메인 목적지는 직접 접근할 가치가 있지만 명확한 주 과업과 절제된 Grouping이 필요하다는 점을 확인합니다.                        | 공개적으로 관찰할 수 있는 페이지 구조가 다른 프로덕션 레퍼런스보다 상세한 시각 근거를 적게 제공합니다. |
| [Steam Search](https://store.steampowered.com/search/)                                                                                                                    | 넓은 주 결과 목록은 해당 결과를 직접 Filter하는 컨트롤을 보조 Rail에 배치합니다.                                                                        | 데스크톱 보조 영역은 인접한 주 과업을 직접 지원해야 한다는 근거이며 NosLog 소식은 검색을 지원하지 않으므로 공지 Rail을 거절합니다.     | Commerce Filter와 결과 밀도는 홈 모델이 아닙니다.                                                      |
| [Plus X](https://dx.plusx.kr/)                                                                                                                                            | 넓은 편집 구성은 강한 Typography 계층, 공용 Edge 및 의도적인 2열 Rhythm을 사용합니다.                                                                   | 승인된 과업 계층을 바꾸지 않으면서 이후 하단 업데이트 영역의 Typography와 편집 비율을 참고합니다.                                      | Art Direction 레퍼런스이며 제품 내비게이션 근거가 아닙니다.                                            |
| [TURN.STUDIO](https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO)                                                                               | 큰 규모 구성과 제어된 여백은 넓은 레이아웃이 단순 확대가 아니라 의도적으로 느껴지게 합니다.                                                             | 구조 Grid를 검증한 뒤 데스크톱 공간의 시각 처리에 참고합니다.                                                                          | Creative Agency Showcase는 NosLog 상호작용이나 접근성 동작을 결정하지 않습니다.                        |
| [MUSINSA Brand](https://www.musinsa.com/brand/musinsa)                                                                                                                    | 편집 콘텐츠는 넓은 화면에서 명확한 Type 계층, 이미지·Text Grouping 및 반복 정렬을 사용합니다.                                                           | NosLog 콘텐츠 순서를 유지하면서 이후 공지와 공식 소식의 편집 계층을 참고합니다.                                                        | Commerce·Brand Surface이며 기능 중심 리듬게임 홈 레퍼런스가 아닙니다.                                  |

### 데스크톱 구성 대안

| 대안                                | 장점                                                                                | 위험 또는 비용                                                                                              | 결정   |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------ |
| 더 넓어진 단일 열                   | 가장 단순한 모바일→데스크톱 전환을 유지합니다.                                      | 데스크톱 너비를 계속 충분히 사용하지 못하고 페이지가 길어지며 동등한 목적지 비교가 약해집니다.              | `거절` |
| 영구 주 Pane과 업데이트 Rail        | 화면을 더 풍부하게 보이게 하고 업데이트를 계속 노출합니다.                          | 관련 없는 소식을 주 검색 옆에서 과도하게 강조하고 거짓된 과업 관계와 반응형 읽기 순서 이탈 위험을 만듭니다. | `거절` |
| Dashboard 또는 서로 다른 Bento 구성 | 즉각적인 시각 변화와 여러 강조 단계를 만들 수 있습니다.                             | 승인된 일관된 목적지 Family와 충돌하고 자의적 계층을 만들며 반응형 화면을 복잡하게 합니다.                  | `거절` |
| 의미 구역과 구역 내부 반응형 Grid   | 모바일 순서를 보존하면서 동등한 목적지와 하단 편집 콘텐츠가 넓은 공간을 사용합니다. | 이후 대표 콘텐츠로 Container, Gutter, 열 및 전환 값을 검증해야 합니다.                                      | `승인` |

승인된 데스크톱 구성은 다음과 같습니다.

1. 모든 Viewport 너비에서 하나의 의미적 순서를 유지합니다.
2. 활성 서비스 중요 공지 최대 하나를 정체성·검색 앞에 배치하고 낮은 우선순위
   Side Rail에는 두지 않습니다.
3. 간결한 NosLog 정체성과 범위 인식 검색을 데스크톱 홈에서 가장 강한 중앙
   구역으로 유지하고, 전체 Container로 늘리지 않고 읽기 좋은 최대 너비를
   사용합니다.
4. 검색 뒤의 동등한 일곱 목적지 블록은 승인된 읽기 순서를 보존하면서 더 넓은
   반응형 Collection에 정렬합니다.
5. 데이터 연동은 목적지 Collection 뒤의 시각적으로 구분된 별도 행으로
   유지합니다.
6. 일반 NosLog 공지와 NOSTALGIA 공식 소식은 하단 편집 구역에만 배치합니다.
7. 충분히 넓은 레이아웃에서는 두 편집 Section을 나란히 배치하고 NosLog 공지
   Collection에 더 큰 비중을, 공식 소식에는 더 작은 동등 구역을 제공합니다.
8. 더 좁은 레이아웃에서는 두 편집 Section을 같은 Source 순서, 즉 NosLog
   공지 다음 NOSTALGIA 공식 소식 순서로 쌓습니다.
9. 푸터는 편집 구역 뒤의 반응형 페이지 Container에 맞춰 정렬합니다.

이 승인은 관계, 계층 및 재구성 규칙을 확정합니다. 최종 최대 너비, Breakpoint,
열 개수, Gutter, 카드 치수 또는 두 데스크톱 편집 영역의 정확한 비율은
확정하지 않습니다. 해당 값은 실제 한국어·일본어·영어 콘텐츠가 필요한
Foundation 및 대표 예시 결정으로 남깁니다.

### HOME-15 집중 레퍼런스 비교

일반 공지 결정에는 권위 있는 가이드, 과업 중심 프로덕션 서비스, 리듬게임 사이트
및 전용 업데이트 Archive에 해당하는 외부 페이지 21개를 추가로 비교했습니다.
자료는 제한된 최근 목록과 전체 이력으로 향하는 안정적인 경로를 함께 두는
방향에서 포화됐습니다.

| 출처                                                                                                               | 관찰한 Pattern                                                                                          | NosLog 적용                                                                | 한계                                                                      |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [W3C APG: Alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)                                                  | Alert는 짧고 중요하며 시간에 민감할 수 있고 잦은 중단은 사용성을 해칩니다.                              | 일반 공지는 Live Alert가 아닌 일반 편집 콘텐츠로 유지합니다.               | 접근성 의미가 홈 목록 수량을 정하지는 않습니다.                           |
| [GOV.UK: Notification Banner](https://design-system.service.gov.uk/components/notification-banner/)                | Banner는 제한적으로 사용하고 두 개 이상 표시하지 않도록 합니다.                                         | 서비스 중요 메시지는 최대 하나로 두고 일반 업데이트와 분리합니다.          | 편집 콘텐츠 Archive를 규정하지는 않습니다.                                |
| [USWDS: Site Alert](https://designsystem.digital.gov/components/site-alert/)                                       | Site Alert는 긴급한 사이트 전체 정보를 전달하며 여러 개를 쌓으면 안 됩니다.                             | 여러 일반 Release를 페이지 상단 Alert로 만들지 않습니다.                   | 정부 Emergency Context는 일반 NosLog 업데이트보다 강합니다.               |
| [USWDS: Collection](https://designsystem.digital.gov/components/collection/)                                       | 간결한 관련 콘텐츠 Collection은 선별된 각 요약을 원문에 연결하며 여섯 개 이하를 권장합니다.             | 펼친 Article 본문 대신 짧은 Link 공지 목록을 사용합니다.                   | 여섯 개는 상한 가이드이며 NosLog가 여섯 개를 보여야 한다는 뜻이 아닙니다. |
| [Carbon: Notification](https://carbondesignsystem.com/components/notification/usage/)                              | Notification Copy는 짧게 유지하고 긴 설명은 `View more` 목적지로 넘깁니다.                              | 전체 공지 본문을 안정적인 상세 페이지로 이동합니다.                        | Carbon Notification 자체는 편집 소식 Template이 아닙니다.                 |
| [Fluent 2: Message Bar](https://fluent2.microsoft.design/components/web/react/core/messagebar/usage)               | 메시지는 한두 문장으로 유지하고 긴 문서는 Link로 연결하며 과도한 중단은 흐름을 해칩니다.                | 홈 행은 빠르게 훑을 수 있게 하고 전체 콘텐츠는 상세 Link로 제공합니다.     | Message Bar는 일반 소식보다 Application 상태에 가깝습니다.                |
| [Shopify Polaris: Banner](https://polaris-react.shopify.com/components/feedback-indicators/banner)                 | Banner는 제한적이고 단일 주제로 간결하게 사용하며 정기적으로 필요한 정보의 주 진입점이 아니어야 합니다. | 일반 이력은 지속 Banner가 아닌 정상적인 Collection과 Archive에 둡니다.     | Merchant Workflow는 오락실 Companion 서비스와 다릅니다.                   |
| [VA.gov: Banner](https://design.va.gov/components/banner/)                                                         | 한 번에 Banner 하나만 표시하며 짧은 제목·메시지에서 자세한 페이지로 연결합니다.                         | 긴급 Slot 하나를 유지하면서 긴 일반 콘텐츠를 상세 페이지로 넘깁니다.       | 건강·긴급 콘텐츠는 NosLog Release보다 중요도가 높습니다.                  |
| [Singapore Government Design System: System Banner](https://www.designsystem.tech.gov.sg/components/system-banner) | 일반 본문은 정상 흐름에 두고 Banner가 많으면 긴급도가 희석되므로 오래된 항목을 제거합니다.              | 서비스 상태와 제한된 일반 공지 영역을 분리합니다.                          | 선택적인 자동 순환 Banner는 NosLog에 적용하지 않습니다.                   |
| [GOV.UK Design System Home](https://design-system.service.gov.uk/)                                                 | 홈은 현재 `What’s new` 한 건을 강조하고 더 넓은 업데이트 페이지로 연결합니다.                           | 과업 중심 홈은 전체 이력 접근을 보존하면서 업데이트를 제한할 수 있습니다.  | 디자인 시스템 사이트의 발행 주기는 다릅니다.                              |
| [Scottish Government Design System Home](https://designsystem.gov.scot/)                                           | 홈은 최근 업데이트 두 건을 나열하고 Release 이력은 다른 목적지로 넘깁니다.                              | 무제한 Home Feed 대신 작은 최근 Subset과 Archive를 지원합니다.             | 콘텐츠 종류가 게임 서비스 공지가 아닌 문서 업데이트입니다.                |
| [UAE Design System Home](https://designsystem.gov.ae/)                                                             | 선택한 최신 업데이트를 주 가이드 동작 뒤의 보조 홈 콘텐츠로 표시합니다.                                 | 일반 공지는 NosLog 핵심 과업 아래에서 절제된 비중을 갖습니다.              | 정확한 수량보다 계층의 근거입니다.                                        |
| [CHUNITHM 일본 홈](https://chunithm.sega.jp/) 및 [CHUNITHM 글로벌 홈](https://chunithm.sega.com/)                  | 두 Surface 모두 최근 소식 세 건 뒤에 `더보기` 또는 `전체 보기` 경로를 제공합니다.                       | 세 건은 전체 이력 접근이 명확한 도메인 관련 제한값입니다.                  | 공식 게임 마케팅 사이트이며 NosLog는 Companion Archive입니다.             |
| [maimai 홈](https://maimai.sega.jp/)                                                                               | 제한된 공지 영역과 `공지 더보기` 경로를 함께 제공합니다.                                                | 홈 요약을 유한하게 유지하고 과거 콘텐츠를 의도적으로 접근 가능하게 합니다. | 시각적 공지가 Image 중심이므로 표현을 복사하면 안 됩니다.                 |
| [Taiko.wiki 홈](https://taiko.wiki/?lang=en)                                                                       | Wiki 공지 다섯 건과 공식 공지 세 건을 함께 두어 업데이트 영역의 정보 밀도가 높습니다.                   | 서비스·공식 소식의 별도 Label 필요성을 확인하지만 밀도 반례로 사용합니다.  | Wiki 중심 운영 모델은 NosLog 홈보다 업데이트 탐색 비중이 큽니다.          |
| [DanceDanceRevolution WORLD 홈](https://p.eagate.573.jp/game/ddr/ddrworld/top/index.html)                          | 많은 긴 소식 본문을 홈 흐름에 직접 배치합니다.                                                          | 전체 본문이 NosLog 주 과업을 지배하게 되는 반례로 취급합니다.              | 공식 사이트가 의도적으로 전체 News 목적지 역할도 수행합니다.              |
| [SOUND VOLTEX News](https://p.eagate.573.jp/game/sdvx/vii/news/index.html)                                         | 전체 게임 업데이트를 전용 시간순 News 목적지에 둡니다.                                                  | 전용 Archive가 전체 및 과거 NosLog 공지를 담당할 수 있습니다.              | NosLog 홈 Preview 수량을 정하지는 않습니다.                               |
| [Nintendo News](https://www.nintendo.com/us/whatsnew/)                                                             | 전용 Filter News 페이지에서 Product Home 밖의 오래된 Article을 계속 불러옵니다.                         | 커지는 홈 Section 대신 Archive로 장기 발견 가능성을 보존합니다.            | Nintendo의 발행량은 NosLog보다 훨씬 많습니다.                             |
| [GitHub Changelog](https://github.blog/changelog/)                                                                 | 전용 시간순 Changelog에서 큰 이력을 날짜와 Category로 제공합니다.                                       | 홈에 세 건만 표시해도 공지 이력은 안정적인 탐색 경로가 필요합니다.         | 초기 NosLog Archive에는 Enterprise Product 분류가 필요하지 않습니다.      |
| [Figma Release Notes](https://www.figma.com/release-notes/)                                                        | Release 이력을 시간순 업데이트와 구독 접근이 있는 전용 목적지로 제공합니다.                             | 지속적인 이력을 과업 중심 홈에서 분리합니다.                               | 구독 및 Release Marketing 기능은 현재 결정 범위 밖입니다.                 |

현재 NosLog는 이미 공개된 최신 공지 세 건을 불러오지만 홈 Accordion에서 최대
2,000자 본문을 펼치며 공개 상세 또는 Archive 경로가 없습니다. 승인된 방향은
유용한 세 건 운영 제한을 유지하고 무제한 In-place 확장을 안정적인 상세·Archive
접근으로 대체합니다.

### HOME-11 집중 레퍼런스 비교

빈 Query 결정에는 권위 있는 상호작용 지침, 검색 Platform 동작, 프로덕션
Catalog, 음악·리듬게임 탐색 및 Query 전용 반례에 해당하는 독립 출처 18개를
추가로 비교했습니다.

| 레퍼런스 종류           | 출처                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 전환 가능한 원칙과 NosLog 적용                                                                                                                                                                                                                 | 한계                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 상호작용 및 접근성 지침 | [Apple Search Fields](https://developer.apple.com/design/human-interface-guidelines/search-fields), [USWDS Search](https://designsystem.digital.gov/components/search/), [MDN `input type="search"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search), [GOV.UK Error Message](https://design-system.service.gov.uk/components/error-message/), [Nielsen Norman Group 접근성 지침](https://media.nngroup.com/media/reports/free/Usability_Guidelines_for_Accesible_Web_Design.pdf)                                                                                    | 검색과 탐색은 공존할 수 있고 제품이 값을 의도적으로 필수화할 때만 빈 값이 오류가 됩니다. 의도된 탐색에 검증 오류를 표시하지 않고 Query가 없는 Catalog를 존재하지 않는 Query의 결과라고 설명하지 않습니다.                                      | 의미와 실패 위험을 정의하지만 NosLog Catalog 내용이나 기본 정렬은 정하지 않습니다.                                              |
| 검색 Platform 동작      | [Algolia 빈 검색](https://support.algolia.com/hc/en-us/articles/13029120172945-What-is-an-empty-search), [Meilisearch 빈 Query 큐레이션](https://www.meilisearch.com/docs/capabilities/search_rules/how_to/curate_empty_query), [Elasticsearch Filter 검색](https://www.elastic.co/search-labs/tutorials/search-tutorial/full-text-search/filters)                                                                                                                                                                                                                                                     | Query가 없는 상태도 초기 또는 Filter된 Catalog를 반환할 수 있지만 기본 콘텐츠는 임의의 Engine 순서를 상속하지 말고 의도적으로 정해야 합니다. NosLog는 홈 기획서에서 최종 정렬·Filter 기본값을 고정하지 않고 선택한 탐색 범위를 열 수 있습니다. | 검색 Engine 기능 근거이며 완전한 UX 검증은 아닙니다.                                                                            |
| 프로덕션 탐색과 발견    | [Spotify Search](https://open.spotify.com/search), [Steam Search](https://store.steampowered.com/search/), [osu! Titanic 채보 목록](https://osu.titanic.sh/beatmapsets/), [Nintendo Games](https://www.nintendo.com/us/store/games/), [PlayStation Store Browse](https://store.playstation.com/en-us/pages/browse), [Epic Games Store Browse](https://store.epicgames.com/en-US/browse), [BeatSaver](https://www.beatsaver.com/), [Discogs Database 검색](https://support.discogs.com/hc/en-us/articles/360003622014-How-To-Browse-Search-In-The-Database), [Bandcamp Tags](https://bandcamp.com/tags) | 음악·게임·채보 Catalog는 Text Query 전에도 유용한 탐색 상태를 유지하고 Filter, Category 또는 선별된 순서와 결합합니다. 이는 NosLog의 공용 악곡·채보 탐색 Surface와 직접 악곡·채보 뷰어 진입에 가깝습니다.                                      | 일부 서비스는 빈 Form 제출을 해석하는 대신 별도 Browse 경로를 제공합니다. Surface Styling과 판매 로직은 NosLog 모델이 아닙니다. |
| Query 전용 반례         | [GitHub Search](https://github.com/search?q=&type=repositories)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 순수한 전역 Text Query 도구는 빈 검색을 결과 집합 대신 안내 상태로 유지할 수 있습니다. 의미 있는 Catalog 상태가 없을 때만 빈 Query를 막아야 한다는 근거입니다.                                                                                 | GitHub는 서로 다른 코드와 Repository를 검색하므로 범위가 한정된 NosLog 악곡·공개 채보 Catalog와 유사성이 낮습니다.              |

Catalog와 반례 Pattern이 새로운 동작을 더 추가하지 않는 지점에서 비교가
수렴했습니다. 악곡과 채보 뷰어는 이미 같은 탐색 Surface로 향하는 Query 없는
직접 진입점이 필요하므로 NosLog는 탐색과 검색이 결합된 모델에 해당합니다.
다만 Nielsen Norman Group의 경고는 그대로 적용해 Query 없는 목적지를 빈
Query가 만든 결과가 아니라 탐색 Catalog로 Label해야 합니다.

### HOME-16 집중 레퍼런스 비교

홈 검색 미리보기 결정에는 권위 있는 상호작용·접근성 지침, 프로덕션 컴포넌트
시스템, 실증적 자동완성 연구 및 공개 검색 제품에 해당하는 독립 출처 20개를
비교했습니다.

| 레퍼런스 종류                      | 출처                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 전환 가능한 원칙과 NosLog 적용                                                                                                                                                                                                    | 한계                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 상호작용 및 접근성 지침            | [W3C APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [WAI-ARIA](https://www.w3.org/TR/wai-aria/), [Apple Search Fields](https://developer.apple.com/design/human-interface-guidelines/search-fields), [Apple Machine Learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning), [USWDS Combo Box](https://designsystem.digital.gov/components/combo-box/), [Fluent 2 Combobox](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [GOV.UK Search Autocomplete](https://design-guide.publishing.service.gov.uk/components/search-autocomplete/)           | 제안은 이해할 수 있고 키보드로 조작 가능해야 합니다. 가능성이 높은 결과를 먼저 배치하고 가벼운 공개 검색 미리보기의 범위를 제한합니다. GOV.UK는 인지 부하와 불필요한 스크롤을 줄이기 위해 이 Pattern을 제안 다섯 개로 제한합니다. | 긴 목록 선택 Control은 정당하게 스크롤할 수 있지만 여러 목적을 가진 홈 미리보기보다 과업 집중도가 높은 문제를 해결합니다. |
| 컴포넌트 구현 시스템               | [Primer SelectPanel 지침](https://primer.style/product/components/select-panel/guidelines/), [Primer SelectPanel 접근성](https://primer.style/product/components/select-panel/accessibility/), [Primer Autocomplete](https://primer.style/design/components/autocomplete/), [Algolia 검색어 제안](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/adding-suggested-searches), [Algolia Autocomplete](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/getting-started), [Algolia Query Suggestions](https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/query-suggestions/react) | 스크롤 목록에는 활성 항목 표시, Focus, 모바일 및 Screen Reader 동작이 추가로 필요합니다. 제한된 목록과 분리된 Footer 동작을 사용하면 홈을 결과 Browser로 바꾸지 않고 전체 결과 Surface로 넘길 수 있습니다.                        | 구현 Pattern을 제공하지만 NosLog 관련도 순위나 다국어 Label을 정하지는 않습니다.                                          |
| 실증적 자동완성 연구               | [Baymard 자동완성 디자인](https://baymard.com/blog/autocomplete-design), [Baymard 자동완성 사례](https://baymard.com/ecommerce-design-examples/34-autocomplete-suggestions)                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 동시에 너무 많은 제안을 보여주면 탐색과 선택 비용이 커집니다. 모바일은 큰 데스크톱 Surface보다 적은 제안을 보여야 하며 고정 높이 Scrollbar로 관련도 순위와 전체 결과 목적지를 대신하면 안 됩니다.                                 | 전자상거래 검색 중심 연구이므로 상품 판매 규칙은 NosLog에 전환하지 않습니다.                                              |
| 공개 검색 제품 및 도메인 비교 대상 | [Google Autocomplete](https://blog.google/products-and-platforms/products/search/how-google-autocomplete-works-search/), [GitHub 검색](https://github.blog/news-insights/a-smarter-more-complete-y-search-bar/), [YouTube 검색 예상](https://support.google.com/youtube/answer/9872296?hl=en), [MusicBrainz Search](https://musicbrainz.org/search), [BeatSaver](https://www.beatsaver.com/)                                                                                                                                                                                                                                         | 작은 관련도순 미리보기와 전체 검색 가능 목적지는 역할이 다릅니다. NosLog 홈은 가능성이 높은 악곡이나 채보 결과를 인식하게 하고 더 넓은 확인과 Filter는 공용 탐색으로 넘겨야 합니다.                                               | 공개 문서는 모든 순위 규칙이나 접근성 구현을 공개하지 않으며 제품마다 범위가 다릅니다.                                    |

비교 결과는 내부 스크롤 결과 목록 위에 다섯 행만 보이는 방식보다 제한된
미리보기로 수렴했습니다. 내부 스크롤은 전용 선택 Dialog나 Panel에는
적합하지만 홈에서는 중첩 스크롤을 만들고 이후 결과의 존재를 숨기며 모바일
키보드와 경쟁하고 공용 탐색 페이지를 중복합니다. 승인된 대안은 내부
스크롤이나 제자리 확장 없이 관련도가 가장 높은 결과를 표시하고 미리보기
용량보다 결과가 많을 때만 전체 결과로 넘깁니다.

### HOME-17 집중 레퍼런스 비교

비동기 미리보기 상태 결정에는 접근성 상태 의미, Loading 및 오류 지침,
프로덕션 컴포넌트 시스템, 검색 상태 구현에 해당하는 독립 출처 20개를
비교했습니다.

| 레퍼런스 종류                    | 출처                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 전환 가능한 원칙과 NosLog 적용                                                                                                                                                                                                                                         | 한계                                                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 접근성 상태 및 Focus             | [W3C APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [WCAG 검색 결과 상태 예시](https://www.w3.org/WAI/WCAG22/working-examples/aria-role-status-searchresults/), [W3C ARIA22](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22), [W3C F103](https://www.w3.org/WAI/WCAG22/Techniques/failures/F103.html), [MDN `aria-busy`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy)                                                                      | 동적 Loading, 결과 수, 일치 결과 없음 및 실패를 검색창에서 DOM Focus를 이동하지 않고 프로그래밍 방식으로 노출해야 합니다. 현재 응답이 끝날 때까지 갱신 영역을 Busy로 표시하고 오래된 중간 갱신을 알리지 않습니다.                                                      | 표준은 시각적 Timing, Popup 위치 또는 NosLog 문구를 정하지 않습니다.                                                      |
| Loading 및 Application 오류 지침 | [Apple Loading](https://developer.apple.com/design/human-interface-guidelines/loading), [Apple Progress Indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators), [Material Progress Indicators](https://m2.material.io/components/progress-indicators), [Material Errors](https://m1.material.io/patterns/errors.html), [Material UI Progress](https://mui.com/material-ui/react-progress/)                                                                                      | 빠른 완료는 즉시 반응하는 것처럼 느껴야 하고 느린 작업에는 일관된 국소 피드백이 필요합니다. 컴포넌트 실패가 페이지의 나머지 사용성을 막으면 안 되며 지원하는 복구 동작을 제공해야 합니다. 시각적 Loader를 지연하면 빠른 응답에서 불필요한 Spinner가 깜빡이지 않습니다. | 시각적 Loader 표시 전 정확한 지연 시간은 지침마다 다르므로 승인된 요청 시간 `400ms` 기준은 검증할 NosLog 전용 규칙입니다. |
| 비동기 자동완성 시스템           | [CMS Autocomplete](https://design.cms.gov/v/5.0.2/components/autocomplete/), [Equinor Autocomplete](https://eds.equinor.com/docs/Next/components/inputs/autocomplete/), [React Spectrum ComboBox](https://react-spectrum.adobe.com/ComboBox), [Visa Combobox](https://design.visa.com/components/combobox/usage/), [Singapore Government Combo Box](https://www.designsystem.tech.gov.sg/components/combo-box), [Australian Agriculture Autocomplete](https://design-system.agriculture.gov.au/components/autocomplete) | Loading, 결과 없음, 잘못된 입력 및 서비스 실패는 서로 다른 상태입니다. NosLog는 조회에 실패해도 Query가 잘못된 것이 아니므로 입력 검증 Styling 대신 간결한 복구와 함께 Popup 안에 실패를 표시합니다.                                                                   | 대부분의 예시는 제한된 목록에서 값을 선택하지만 NosLog는 공용 탐색으로 명시적으로 제출할 수도 있습니다.                   |
| 검색 상태 및 갱신 구현           | [Scottish Government Autocomplete](https://designsystem.gov.scot/components/autocomplete), [Elastic Search UI State](https://www.elastic.co/docs/reference/search-ui/api-core-state), [Algolia 다중 검색 상태](https://www.algolia.com/doc/ui-libraries/autocomplete/guides/implementing-multiple-search-states), [Telerik AutoComplete 접근성](https://www.telerik.com/design-system/docs/components/autocomplete/accessibility/)                                                                                      | 현재 입력, 표시 결과가 나타내는 Query, 요청 정체성, Loading 및 오류는 서로 다른 상태입니다. 입력 변경 시 이전 결과를 무효화하고 오래된 응답을 무시하며 최신 정규화 Query와 범위에 해당하는 상태만 알립니다.                                                            | 구현 상태를 제공하지만 NosLog 내비게이션 계층이나 최종 시각 Styling을 정하지 않습니다.                                    |

비교 결과는 문서 흐름 안의 Block보다 검색창에 고정된 비모달 Popup으로
수렴했습니다. Popup은 검색창 바로 아래에 붙어 이후 홈 콘텐츠를 움직이지 않고
그 위에 표시되며 배경막이나 페이지 수준 조작 잠금을 추가하지 않습니다. 결과
선택, 전체 결과 인계, `Escape`, Query 지우기 또는 검색 영역 바깥 조작으로
닫히며 `Escape`는 Query를 지우지 않습니다.

승인된 IME 안전 `300ms` 유휴 시간이 지나면 요청을 즉시 시작합니다. 요청
시작 시 제안 영역을 프로그래밍 방식으로 Busy 상태로 만들지만 같은 요청이
`400ms` 후에도 진행 중일 때만 보이는 간결한 Loading 행을 표시합니다.
정규화된 Query나 범위가 바뀌면 이전 결과를 즉시 무효화하고 숨기며 이전
실패를 지운 뒤 다음 Debounce 주기를 시작합니다. 취소되었거나 오래된 응답은
최신 상태를 절대로 대체하면 안 됩니다.

조회 실패 상태에서도 Query, 활성 범위, 검색 Control, 명시적 제출 및 다른
모든 홈 목적지를 계속 사용할 수 있습니다. Popup 안에 같은 Query와 범위로
재요청하는 Text 재시도 동작과 간결한 다국어 메시지로 표시합니다. 잘못된
사용자 입력처럼 Styling하거나 Focus를 이동하지 않습니다. 새 입력은 실패를
닫고 새 주기를 시작합니다.

### 레퍼런스 종합

비교 결과는 여섯 요구사항으로 수렴합니다.

1. 검색과 직접 목적지 Link가 함께 있어야 합니다.
2. 주 과업은 유지되는 지원·편집 콘텐츠보다 시각적으로 강해야 합니다.
3. 홈은 하위 화면의 전체 Filter를 재현하지 않고 더 깊은 탐색으로 넘겨야 합니다.
4. Mobile-first는 데스크톱에서 고정된 모바일 너비 Canvas를 유지해야 한다는 뜻이
   아닙니다.
5. 홈 검색 미리보기는 제한된 범위를 유지하고 내부 스크롤 미니 결과 페이지를
   추가하는 대신 더 넓은 확인을 공용 탐색으로 넘겨야 합니다.
6. 비동기 검색 피드백은 검색 과업에 붙여 표시하고 홈의 나머지를 유지하며 일치
   결과 없음과 조회 실패를 구분하고 오래된 결과를 거부해야 합니다.

레퍼런스만으로 정확한 목적지 순서나 카드 비율을 정할 수는 없습니다. 해당
내용은 사용자가 승인하는 결정으로 남깁니다. 집중 공지 비교는 세 건
요약·상세·Archive 모델의 근거가 되었고, 집중 빈 Query 비교는 아래의 승인된
탐색 상태 규칙, 집중 자동완성 비교는 아래의 승인된 미리보기 상태 규칙의
근거가 되었습니다. 비동기 상태 비교는 아래의 승인된 Popup, Loading, 무효화
및 복구 규칙의 근거가 되었습니다.

## 승인된 정보 우선순위

다음 계층을 승인했습니다.

1. **조건부 서비스 중단 정보:** 현재 서비스 사용을 바꾸는 공지만 주 과업보다
   먼저 표시합니다.
2. **정체성과 공용 검색:** 간결한 NosLog Context와 승인된 악곡·채보 범위
   선택기 및 검색창
3. **주 목적지 모음:** 승인된 일곱 목적지를 하나의 일관된 컴포넌트
   Family로 유지합니다. 강조는 큰 Accent Color, 별도 Group Label,
   미승인된 대형·소형 카드 체계가 아니라 공용 악곡·채보 검색과 악곡 → 채보
   뷰어 → 서열 → 랭킹 → 빙고 → 검정 → 오락실의 읽기 순서로 표현합니다.
4. **플레이 지원:** 독립된 데이터 연동 행
5. **업데이트 및 편집 콘텐츠:** 일반 NosLog 공지를 먼저 표시하고 그다음
   공식 X 최신 게시물을 담는 별도 NOSTALGIA 공식 소식 Grid를 표시
6. **신뢰 및 프로젝트 푸터:** 개인정보처리방침과 GitHub

이 계층은 정확한 열 개수, 카드 크기 또는 High-fidelity 구성을 승인하지
않습니다.

## 검색 요구사항

### 승인된 동작

- 악곡이 홈 검색의 기본 범위입니다.
- 간결한 선행 범위 선택기는 악곡과 채보를 전환합니다.
- 닫힌 선택기에는 보이는 아이콘과 접근 가능한 이름을 제공하고, 열린
  선택기에는 두 범위의 다국어 Text 라벨을 표시합니다.
- Placeholder, 결과 및 제출 동작은 활성 범위를 전달합니다.
- 채보 뷰어 목적지는 같은 검색 Surface를 채보 범위가 선택된 상태로 엽니다.
- 검색은 공용 탐색 페이지로 넘깁니다. 홈은 전체 장르, 레벨, 난이도, 기록
  또는 공개 여부 Filter를 복제하지 않습니다.
- 키보드 조작, 보이는 Focus 및 프로그래밍 방식 Label이 필요합니다.
  Placeholder만 Label로 사용하면 안 됩니다.
- 빈 Query 또는 공백만 있는 Query를 명시적으로 제출하면 활성 범위의 기본
  탐색 상태를 엽니다. 악곡 범위는 악곡 Catalog, 채보 범위는 공개 채보
  Catalog를 엽니다.
- 목적지를 빈 Query와 일치한 결과가 아니라 탐색 상태로 취급합니다. 빈 결과
  또는 검증 메시지 대신 범위를 반영한 다국어 Catalog 제목이나 상태를
  사용합니다.
- 이 전환에서 빈 `q` Parameter를 생성하지 않습니다. 선택한 범위는 복원 및
  공유 가능한 URL 상태로 보존하고 정규화된 Query가 없으면 `q`를 생략합니다.
- 명시적인 제출 또는 직접 목적지 활성화만 Catalog로 이동합니다. 빈 입력창에
  Focus만 했을 때 자동으로 이동하지 않습니다.
- 비어 있지 않은 정규화된 Query는 글자 조합이 끝나고 추가 입력 없이
  `300ms`가 지나면 홈 미리보기를 엽니다. 한국어·일본어 또는 다른 IME 조합
  중에는 결과를 갱신하지 않습니다.
- 미리보기를 열거나 갱신하는 동작은 자동으로 이동시키지 않습니다.
- 미리보기에는 관련도가 가장 높은 결과를 최대 다섯 개 표시하고 내부
  스크롤을 사용하지 않습니다.
- 전체 결과가 현재 미리보기 용량 이내면 결과만 표시합니다. 미리보기에서
  보여줄 수 있는 수보다 결과가 많으면 관련도순 결과 뒤에 분리된 다국어
  `전체 N개 결과 보기` 진입점을 추가합니다.
- 전체 결과 진입점은 활성 범위와 정규화된 Query를 보존해 공용 탐색으로
  이동합니다. 홈 안에서 결과를 더 펼치지 않습니다.
- 미리보기에서 일치 결과가 없으면 사용자의 Query를 유지하고 간결한 다국어
  결과 없음 메시지를 표시합니다. 이 상태에서는 보이는 전체 결과 진입점을
  표시하지 않지만 Enter 또는 검색 Control을 명시적으로 제출하면 공용
  탐색을 열 수 있습니다.
- 빈 검색창에 Focus만 한 상태는 조용하게 유지합니다. 최근, 인기 또는
  Placeholder 제안을 열지 않습니다.
- 미리보기 상태를 검색 Control 바로 아래에 붙는 비모달 Popup으로
  표시합니다. 이후 홈 콘텐츠의 문서 흐름을 바꾸거나 배경막을 추가하거나
  나머지 홈 조작을 잠그지 않고 그 위에 표시합니다.
- 결과 또는 전체 결과 진입점 선택, `Escape`, Query 지우기 또는 검색 영역
  바깥 조작 후 Popup을 닫습니다. `Escape`는 Query를 유지합니다.
- 승인된 IME 안전 `300ms` 유휴 시간 후 조회를 시작합니다. 제안 영역은 즉시
  Busy로 표시하되 같은 요청이 추가 `400ms` 동안 계속될 때만 간결한 다국어
  Loading 행을 표시합니다.
- 정규화된 Query나 범위가 바뀌면 이전 결과를 즉시 숨기고 이전 실패를
  지웁니다. 가능하면 오래된 요청을 취소하고 최신 Query와 범위에 속하지 않는
  응답은 항상 무시합니다.
- 조회 실패는 Popup 안에 같은 Query와 범위로 재요청하는 Text 재시도 동작과
  간결한 다국어 메시지로 표시합니다. Query, 범위 선택기, 명시적 제출, 직접
  목적지 및 나머지 홈을 계속 사용할 수 있어야 합니다.
- 조회 실패를 잘못된 입력처럼 Styling하거나 메시지로 Focus를 이동하지
  않습니다. 새 입력은 해당 실패를 닫고 다음 Debounce 검색 주기를 시작합니다.
- 이 홈 기획서에서 기본 악곡 난이도·Filter·정렬이나 채보 Grouping·정렬을
  고정하지 않습니다. 대표 데이터와 함께 공용 악곡·채보 탐색 기획서에서
  정의합니다.

### 제안하는 동작

- 공용 탐색 Surface 안에서 Query를 지우는 동작은 홈 상호작용 규칙이 아니라
  탐색 페이지 결정으로 남깁니다.

## 목적지 요구사항

- 반응형 레이아웃에서 시각적 크기가 달라도 일곱 목적지를 하나의 의미적
  Link 목록으로 표현합니다.
- 하나의 일관된 목적지 컴포넌트 Family와 비슷한 조작 영역 크기를
  사용합니다. 뒤에 배치된다는 이유로 빙고, 검정 또는 오락실을 숨기거나,
  비활성화하거나, 더보기 Panel 전용 목적지로 만들면 안 됩니다.
- 보이는 목적지 블록 전체는 하나의 예측 가능한 Link Target이어야 합니다.
- 각 목적지는 보이는 다국어 Text가 필요하며 아이콘만 Label로 사용하면 안
  됩니다.
- 악곡, 채보 뷰어, 서열, 빙고 및 검정은 서로 다른 NOSTALGIA 의미를
  보존해야 합니다. 일반적인 통합 라벨로 대체하지 않습니다.
- 모든 블록에 기본적으로 설명을 추가하지 않습니다. 라벨만으로 부족하다는
  조사 또는 다국어 검증 근거가 있을 때만 보조 Text를 사용합니다.
- 홈에 모드 또는 Filter Button 행을 상시 추가하지 않습니다.

### 목적지 강조 대안

| 대안                               | 의미                                                                                                         | 장점                                                                   | 위험 또는 비용                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 일관된 블록과 우선순위 순서        | 공용 검색을 가장 강한 악곡·채보 진입으로 사용하고 비슷한 일곱 목적지 블록을 승인된 중요도 순으로 배치합니다. | 차분하고 예측 가능한 모음을 유지하면서 주 경로를 먼저 발견하게 합니다. | 크기가 다른 카드보다 우선순위 차이가 은은합니다.                                               |
| 서로 다른 카드 크기 또는 Grid Span | 네 개 주 목적지에 나머지 세 개보다 넓은 영역을 제공합니다.                                                   | 계층이 즉시 보입니다.                                                  | 일곱 항목 Grid가 복잡해지고 반응형 재구성이 어려우며 작은 목적지가 덜 완전해 보일 수 있습니다. |
| 별도 라벨 Group                    | 목적지를 주·보조 Group으로 나눕니다.                                                                         | Text로 구분을 명확히 합니다.                                           | 제목과 시각적 단절을 추가하고 잘못된 도메인 Grouping을 만들 위험이 있습니다.                   |

**승인:** 첫 번째 대안을 사용합니다. 정확한 열과 블록 비율은 Foundation 및
대표 예시 결정으로 남기지만, 이후 시각 디자인은 관련 없는 Accent Color나
임의의 카드 크기로 강조를 만들면 안 됩니다.

## 공지 및 소식 대안

### 서비스 및 NosLog 공지

| 대안                                | 배치 모델                                                                                                                   | 장점                                                   | 위험 또는 비용                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| 모든 공지를 위한 하나의 최상단 영역 | 검색 앞의 한 영역 안에서 모든 공지 순서를 정합니다.                                                                         | 가장 잘 보이며 발행 모델 변경이 적습니다.              | 일반 업데이트가 주 과업을 계속 아래로 밀고 잘못된 긴급도를 갖습니다.   |
| 중복 없는 역할별 두 위치            | 현재 가장 영향이 큰 활성 서비스 공지 최대 하나는 검색 앞에, 일반 NosLog 업데이트는 한 번만 하단 업데이트 영역에 표시합니다. | 주 과업을 보호하면서 긴급·일반 소통을 모두 보존합니다. | 위치 또는 중요도 Metadata, 만료 규칙 및 다국어 발행 규율이 필요합니다. |
| 모든 공지를 위한 하나의 하단 영역   | 중요 공지와 일반 공지를 모두 핵심 과업 뒤에 둡니다.                                                                         | 홈 상단이 항상 과업 중심으로 유지됩니다.               | 영향을 받는 과업을 시작하기 전에 장애나 연동 문제를 놓칠 수 있습니다.  |

**승인:** 두 번째 대안을 사용합니다. 이는 하나의 공지를 두 번 복사하거나 한
공지 목록 안에서 순서만 정하는 안이 아닙니다. 각 공지는 하나의 역할과 하나의
위치만 가집니다.

- 장애, 점검 시간, 연동 중단, 중요한 데이터 사고 또는 현재 방문을 바꾸는
  다른 상태는 검색 앞 서비스 Alert 위치를 사용할 수 있습니다.
- 일반 NosLog Release 또는 프로젝트 업데이트는 주 목적지와 데이터 연동
  뒤의 하단 업데이트 영역에 한 번만 표시합니다.
- 활성 서비스 중요 공지가 없으면 검색 위에 Container나 여백을 예약하지
  않습니다.

일반 업데이트는 다음과 같이 표시하는 것으로 승인했습니다.

- 공개된 최신 공지 세 건을 최신순으로 표시합니다.
- 제목과 Locale별 게시일을 간결한 Link 행으로 노출합니다.
- 전체 본문을 홈 Accordion에 넣거나 홈 안에서 펼치지 않습니다.
- 각 항목은 다국어 공개 공지 상세 페이지를 엽니다.
- `전체 공지` Link는 다국어 공지 Archive를 엽니다.
- 공개된 항목이 없으면 일반 공지 Section 전체를 생략합니다.
- 데스크톱이라는 이유로 수량을 늘리지 않고 모바일과 데스크톱 모두 세 건으로
  유지합니다.

일반 업데이트를 검색 위의 같은 긴급도 Banner로 쌓으면 안 됩니다. Archive와
상세 페이지가 전체 및 과거 콘텐츠 접근을 보존하므로 홈 Section은 무한히
길어지지 않습니다.

### NOSTALGIA 공식 소식

**승인:**

- X가 제공하는 `NOSTALGIA_573` Profile 공식 Embedded Timeline을
  사용합니다. 유료 API, Scraping 또는 비공식 Proxy를 사용하지 않습니다.
- 일반 NosLog 공지 바로 다음의 별도 공식 소식 Grid 또는 영역에 최신 원문
  게시물 하나를 표시합니다.
- “Grid”는 독립된 콘텐츠 모음을 뜻하며 최종 열 개수를 승인한 것은 아닙니다.
  모바일은 한 열에서 시작하고 넓은 화면의 구성은 이후 가이드 결정으로
  남깁니다.
- Source 게시물은 원문 언어로 유지하고 다국어 공식 계정 Link를 제공합니다.
- 같은 게시물을 홈의 다른 영역에 중복하지 않습니다.
- 핵심 홈 콘텐츠 뒤에서 Widget을 로드합니다. X가 차단되거나 느리거나 사용할
  수 없어도 검색, 목적지 및 데이터 연동을 계속 사용합니다.
- Widget이 실패하면 무기한 Skeleton이나 깨진 빈 Frame을 남기지 않고 다국어
  공식 계정 Fallback을 유지합니다.

**구현 주의사항:** 현재 컴포넌트도 X 공식 Widget을 사용하고 게시물 한 건
제한을 요청하지만, 검증한 브라우저에서는 Timeline iframe이 숨겨진 `0 × 0`
상태로 생성됐습니다. 이후 구현은 당시의 X Publish가 생성하는 공식 Embedded
Timeline 구조에서 다시 시작해 연동 문제를 수정하고 지원 브라우저에서 실제
게시물 본문이 보이는지 검증해야 합니다. 현재 컴포넌트는 그대로 복사할
정상 구현이 아니라 해결해야 할 근거입니다.

## 필요한 데이터 및 콘텐츠 제약

### 알려진 현재 제약

- 공개된 NosLog 공지를 최대 세 개 불러옵니다.
- 공지 제목 최대 80자
- 공지 본문 최대 2,000자
- 공지 날짜는 선택적인 ISO Timestamp이며 Locale별 형식으로 표시합니다.
- 일곱 직접 제품 목적지가 필요합니다.
- 공식 소식은 현재 `NOSTALGIA_573` X 계정에 의존합니다.
- 현재 공식 Timeline 연동은 검증한 브라우저에서 보이는 게시물을 노출하지
  못합니다.

### 필요한 데이터 모델 변경

- 공지 중요도 또는 배치 구분
- 선택적인 공지 시작일과 만료일
- 한국어·일본어·영어 공지 제목 및 본문
- 다국어 상세 URL에 사용할 안정적인 공개 공지 식별자 또는 Slug
- 최신순 다국어 공지 Archive를 위한 공개 목록 Query
- 필수 NosLog 작성 공지 번역 중 하나라도 누락되면 공개를 막는 발행 준비 상태
  검사

이 기획서는 공식 음원, 영상 또는 로고 Asset을 NosLog 서버에 추가하지
않습니다. Embed된 공식 X 게시물은 외부에 Host된 Source 콘텐츠로
유지됩니다.

## 필요한 상태

| 상태                          | 필요한 결과                                                                                                            | 상태   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| 일반                          | 검색과 승인된 모든 목적지를 즉시 사용할 수 있습니다.                                                                   | `승인` |
| 서비스 공지 없음              | 검색 위에 빈 공지 Container 또는 예약된 여백이 나타나지 않습니다.                                                      | `승인` |
| 서비스 중요 공지              | 현재 가장 영향이 큰 활성 공지 최대 하나가 검색보다 먼저 나타나며 필요한 경우가 아니면 목적지 사용성을 바꾸지 않습니다. | `승인` |
| 여러 일반 공지                | 하단 업데이트 영역에는 최신 세 건의 제목·게시일 Link만 표시하고 과거 항목은 Archive에서 계속 제공합니다.               | `승인` |
| 일반 공지 없음                | 빈 카드, 제목 또는 여백을 예약하지 않고 일반 공지 Section 전체를 생략합니다.                                           | `승인` |
| 공식 소식 없음                | 핵심 과업은 그대로 유지하며 빈 Feed Shell 없이 다국어 공식 채널 Link를 유지합니다.                                     | `승인` |
| 공식 소식 로드 실패           | 깨진 iframe이나 무기한 Skeleton 없이 공식 채널 Link를 유지하고 핵심 홈을 계속 사용할 수 있습니다.                      | `승인` |
| 빈 Query 또는 공백 Query 제출 | 검증 오류나 빈 Query 결과 Label 없이 활성 범위의 기본 탐색 Catalog를 엽니다.                                           | `승인` |
| Focus한 빈 검색창             | 미리보기를 닫은 상태로 유지하고 최근, 인기 또는 Placeholder 제안을 표시하지 않습니다.                                  | `승인` |
| 미리보기 결과 1~5개           | 내부 Scrollbar 없이 현재 미리보기 용량까지 관련도순 결과만 표시합니다.                                                 | `승인` |
| 미리보기 용량 초과            | 관련도가 가장 높은 결과와 분리된 `전체 N개 결과 보기` 공용 탐색 진입점을 표시하고 홈에서는 펼치지 않습니다.            | `승인` |
| 미리보기 일치 결과 없음       | Query를 유지하고 간결한 결과 없음 메시지를 표시하며 보이는 전체 결과 진입점을 생략합니다.                              | `승인` |
| `400ms` 미만 미리보기 요청    | 제안 영역을 Busy로 표시하되 시각적 Loader는 표시하지 않습니다. 이전 결과는 이미 무효화된 상태입니다.                   | `승인` |
| `400ms` 초과 미리보기 요청    | 검색창에 붙은 Popup을 열고 간결한 다국어 Loading 행 하나를 표시하며 검색과 나머지 홈을 계속 조작할 수 있습니다.        | `승인` |
| 검색 서비스 실패              | Query와 범위를 유지하고 잘못된 입력 Styling이나 Focus 이동 없이 Popup에 Inline 메시지와 Text 재시도를 표시합니다.      | `승인` |
| 오래된 미리보기 응답          | 완전히 무시합니다. 최신 정규화 Query와 범위만 미리보기 상태를 갱신하거나 알릴 수 있습니다.                             | `승인` |
| 비로그인                      | 공개 검색과 목적지를 계속 사용할 수 있고 헤더에는 로그인이 표시됩니다.                                                 | `승인` |
| 로그인                        | 헤더에 프로필 컨트롤을 표시하고 홈에는 개인화 카드를 추가하지 않습니다.                                                | `승인` |
| 지원하지 않거나 누락된 번역   | NosLog 작성 공지는 세 언어가 모두 있기 전 공개하지 않습니다. 외부 X 게시물은 원문 언어로 유지합니다.                   | `승인` |
| 모션 감소                     | 헤더 및 다른 홈 Motion은 모션 감소 설정을 따르며 정보가 Animation에 의존하지 않습니다.                                 | `승인` |

홈에는 파괴적인 동작이 없습니다. 로그인 요청, 권한 오류, 피드백 제출 및 하위 화면
빈 결과는 각 페이지 또는 컴포넌트 기획서에서 정의합니다.

## 반응형 동작

### 모바일 요구사항

- 390px을 대표 기준으로 사용하고 지원하는 더 좁은 너비를 확인합니다.
- 의미적 읽기 순서를 정보 우선순위와 맞춥니다.
- 가로 스크롤 없이 검색을 사용할 수 있고 활성 범위를 모호한 아이콘으로
  축소하면 안 됩니다.
- 미리보기 결과를 중첩 스크롤 영역에 넣지 않습니다. 다섯 개는 최대치이지
  최소치가 아닙니다. 화면 키보드나 사용 가능한 Container 높이에 읽을 수 있는
  다섯 행이 들어가지 않으면 관련도순 결과 수를 줄이고 표시하지 못한 결과가
  있을 때 전체 결과 진입점을 유지합니다.
- 비모달 Popup을 검색 Control에 맞추고 Viewport 안에 유지합니다. 이후 홈
  콘텐츠를 일시적으로 가릴 수 있지만 목적지 블록을 밀거나 문서 Overflow를
  만들거나 배경막을 추가하거나 나머지 홈을 막으면 안 됩니다.
- 한국어·일본어·영어 목적지 라벨이 읽을 수 있어야 합니다.
- 편집 콘텐츠 때문에 검색과 목적지가 불필요한 소개 콘텐츠 아래로 밀리면 안
  됩니다.
- 일반 공지는 제목·게시일 세 행으로 유지하고 전체 본문은 모바일 홈에서
  펼치지 않고 상세 페이지에서 엽니다.

### 데스크톱 요구사항

- 현재 전역 `390px` 홈 Canvas 제약을 제거합니다.
- 제한된 반응형 페이지 Container와 구역 내부 Grid를 사용해 모바일 열을
  단순히 확대하지 않고 탐색, Grouping 및 비교를 개선합니다.
- 같은 의미적 계층, Source 순서, Focus 순서 및 목적지 의미를 보존합니다.
- 정체성·검색 구역은 가장 강한 홈 영역으로 중앙 정렬하고 제한된 너비로
  유지하며 검색 컨트롤을 데스크톱 Container 전체로 늘리지 않습니다.
- 데스크톱 공간이 넓다는 이유만으로 검색 미리보기 최대치를 다섯 개보다
  늘리지 않습니다. 더 큰 결과 Collection은 공용 탐색 페이지가 담당합니다.
- Popup은 같은 중앙 정렬된 제한 너비 검색 영역에 붙입니다. 넓은
  레이아웃에서도 페이지 너비 결과 Panel로 만들지 않습니다.
- 검색 뒤에서 목적지 Collection은 더 많은 열을 사용할 수 있지만 하나의
  일관된 블록 Family와 승인된 읽기 순서를 유지합니다.
- 데이터 연동은 목적지 Collection 뒤의 별도 행으로 유지합니다.
- 일반 공지와 NOSTALGIA 공식 소식은 검색 옆 영구 Sidebar가 아닌 하단 편집
  구역에 유지합니다.
- 충분히 넓은 레이아웃에서는 두 편집 Section을 나란히 배치하고 일반 NosLog
  공지에 더 큰 비중을 제공합니다. 공간이 부족하면 Source 순서대로 쌓습니다.
- 넓은 레이아웃도 일반 공지를 세 건으로 유지하며 과거 항목을 추가하지 않고
  Container만 재구성할 수 있습니다.
- 서비스 중요 공지를 낮은 우선순위 Rail로 이동하면 안 됩니다.
- 정확한 Container 너비, 열 개수, Breakpoint, Gutter 및 편집 영역 분할
  비율은 Foundation 및 대표 예시 결정으로 남깁니다.

### Container 동작

목적지 블록과 편집 요약은 해당 영역의 실제 너비에 반응해야 합니다.
Viewport Breakpoint는 주요 셸 변경을 정의하고, 같은 컴포넌트가 더 좁은
영역에 배치될 때 Container Query로 재사용 가능한 모음을 조정할 수 있습니다.

## 접근성 요구사항

- 장식적 Wordmark를 제목으로 반복하지 않으면서 NosLog와 홈 Context를
  식별하는 페이지 `h1` 하나를 제공합니다.
- 홈에 남는 콘텐츠 Section에는 설명적인 `h2`를 사용합니다.
- 검색에는 보이거나 프로그래밍 방식으로 지속되는 Label을 연결하고
  Placeholder에만 의존하지 않습니다.
- 목적지 모음을 논리적인 Focus 순서의 내비게이션 또는 라벨이 있는 Link
  목록으로 노출합니다.
- 아이콘 전용 범위·메뉴 컨트롤에 접근 가능한 이름과 상태를 제공하고 열린
  상태에는 보이는 Text를 제공합니다.
- 적절한 Combobox 및 Listbox 의미로 제안 Popup, 활성 범위, 펼침 상태, 결과
  관계 및 결과 수를 노출합니다. 키보드와 Screen Reader 사용자는 중첩 스크롤
  영역에 들어가지 않고 미리보기 결과와 분리된 전체 결과 진입점에 접근할 수
  있어야 합니다.
- 최신 요청이 시작되는 즉시 제안 영역을 Busy로 표시합니다. Focus를 이동하지
  않고 지연 Loading 상태, 최종 결과 수, 일치 결과 없음 또는 조회 실패를
  알리며 취소되거나 오래된 요청의 알림을 억제합니다.
- 재시도 Text 동작은 키보드로 조작 가능하고 최신 Query와 범위를 유지해야
  합니다. 조회 실패는 프로그래밍 방식으로 식별 가능한 오류 의미를 사용하지만
  사용자의 Query를 잘못된 입력으로 표시하지 않습니다.
- 키보드 사용자가 Focus Trap 없이 범위 변경, 검색 제출, 목적지 이동 및
  푸터 Link 접근을 할 수 있어야 합니다.
- 건너뛰기 Link와 의미 있는 `header`, `main`, `nav`, `section`, `footer`
  Landmark를 유지합니다.
- 편안한 Touch Target을 목표로 하며 최소 WCAG 2.2 Target Size 요구사항을
  만족합니다. 정확한 컴포넌트 크기는 Foundation에서 정합니다.
- 긴급도, 활성 범위 또는 목적지 종류를 색상만으로 구분하지 않습니다.
- 일반 공지를 의미 있는 목록으로 노출합니다. 각 행은 명확한 다국어 상세 Link
  Target 하나를 가져야 하며 `전체 공지` 컨트롤은 전체 공지 모음을 연다는
  목적을 식별할 수 있어야 합니다.
- 외부 공식 Link는 목적지와 열기 동작을 식별합니다.
- 승인된 Third-party X Timeline을 보조 콘텐츠로 취급합니다. Widget 없이도
  다국어 공식 채널 Link를 제공하고 핵심 과업이 Timeline에 의존하면 안 됩니다.

## 다국어 요구사항

- 과업 우선순위를 바꾸지 않고 한국어·일본어·영어 경로를 지원합니다.
- `NosLog` 및 게임·제품 식별자는 승인된 원문 형태를 유지합니다.
- 최소한 채보 뷰어, 데이터 연동 가이드, NOSTALGIA 공식 소식 및 피드백·오류
  제보에 해당하는 세 언어 라벨을 검증합니다.
- 검색 Placeholder와 보이는 Label은 활성 Locale에서 제목과 아티스트 검색
  동작을 자연스럽게 설명해야 합니다.
- 지연 Loading 메시지, 결과 수 상태, 일치 결과 없음 메시지, 조회 실패
  메시지, 재시도 동작 및 전체 결과 진입점을 한국어·일본어·영어로 제공합니다.
- Locale별 날짜를 사용하고 고정 폭 날짜를 가정하지 않습니다.
- 목적지 블록은 라벨을 설명 없는 아이콘으로 축소하지 않고 일본어·영어
  확장을 지원해야 합니다.
- NosLog가 작성한 공지는 공개 전에 한국어·일본어·영어 콘텐츠를 모두
  요구합니다.
- 일반 공지 제목, `전체 공지` Link, 상세·Archive 페이지 Metadata 및 게시일을
  다국어로 제공합니다. 언어별로 무관한 레코드를 만들지 않고 Locale Route
  전체에서 같은 공지 정체성을 유지합니다.
- 공식 소식 제목, 공식 채널 Link 및 Fallback Text를 다국어로 제공합니다.
  Embed된 공식 X 게시물은 발행자의 일본어 원문 콘텐츠로 유지하며 NosLog
  번역으로 표현하지 않습니다.

## 브라우저 검증 대상

이후 디자인과 구현은 다음을 검증해야 합니다.

- 비로그인 및 로그인 홈
- 한국어·일본어·영어 경로
- 최소 `320px`, `390px`, `768px`, `1024px`, `1440px` Viewport
- 지원 너비에서 문서 가로 Overflow 없음
- 키보드 및 Pointer 입력을 사용하는 악곡·채보 범위 선택
- Query 제출, 빈 Query 탐색 동작, IME 글자 조합 및 `300ms` 미리보기 지연
- 빈 Focus, 결과 1~5개, 미리보기 용량 초과 및 일치 결과 없음 상태와 Query
  유지·전체 결과 진입 규칙
- 내부 결과 Scrollbar나 자동 이동 없이 작은 모바일 키보드 높이와 데스크톱
  너비에서 미리보기 사용
- 레이아웃 이동, 배경막, 문서 Overflow 또는 다른 홈 Control 접근 손실 없는
  검색창 고정 Popup 배치
- 즉시 Busy 의미와 빠른 응답 Spinner 깜빡임 방지를 포함한 `400ms` 시각
  Loading 기준 미만 및 초과 응답
- 오래된 데이터가 표시되거나 알려지지 않는지 확인하기 위한 활성 요청 중
  Query·범위 변경, 취소된 요청 및 의도적으로 순서를 바꾼 응답
- 조회 실패, Query·범위 유지, 키보드 재시도, 새 입력 복구, 명시적 제출 및
  모든 직접 목적지의 지속적인 접근
- 결과 선택, 전체 결과 인계, `Escape`, Query 지우기 및 바깥 조작을 통한
  Popup 닫기와 `Escape` 시 Query 유지
- 일곱 목적지 Link와 데이터 연동
- 서비스 중요 공지 없음 및 서비스 중요 공지 하나
- 공개된 일반 공지 0개, 1개, 정확히 3개 및 3개 초과 상태와 올바른 최신순
  제한 및 전체 Archive 접근
- 홈의 각 공지 Link, `전체 공지` Link 및 한국어·일본어·영어 상세·Archive
  목적지
- 공식 소식의 일반, 빈 상태 및 사용 불가 상태
- 헤더 스크롤 숨김·재표시 및 모션 감소 동작
- 보이는 Focus 순서, 건너뛰기 Link, Landmark, 접근 가능한 이름 및 Console
  오류

## 이 기획서의 승인 기준

- 주 과업과 성공 조건이 명확합니다.
- 현재의 모든 홈 기능에 승인, 제안, 미확정 또는 거절 상태가 있습니다.
- 승인된 정보 구조 목적지가 사라지지 않습니다.
- 콘텐츠 유지가 동일한 시각적 비중을 의미하지 않습니다.
- 검증하지 않은 최종 Grid를 확정하지 않고 모바일·데스크톱 동작을
  설명합니다.
- UI 라벨뿐 아니라 편집 데이터에도 3개 언어 제약이 있습니다.
- 로딩, 빈 상태, 오류, 로그인 및 모션 감소 상태를 다룹니다.
- 제안과 승인 결정을 명확하게 구분합니다.
- 이 기획서를 승인하기 전에 사용자가 미확정 결정 기록을 해결합니다.

## 결정 기록

| ID      | 결정                    | 방향 또는 질문                                                                                                                                                                      | 상태   |
| ------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| HOME-01 | 홈 역할                 | 모든 페이지의 축소판이나 Dashboard가 아닌 방향 파악 및 과업 이동 Surface                                                                                                            | `승인` |
| HOME-02 | 주 과업                 | 공용 악곡·채보 검색을 가장 강한 홈 과업으로 사용                                                                                                                                    | `승인` |
| HOME-03 | 목적지 집합             | 악곡, 채보 뷰어, 랭킹, 서열, 빙고, 검정 및 오락실을 별도로 유지                                                                                                                     | `승인` |
| HOME-04 | 데이터 연동             | 별도 플레이 지원 행 유지                                                                                                                                                            | `승인` |
| HOME-05 | 피드백                  | 더보기로 이동하고 홈이나 푸터에 표시하지 않음                                                                                                                                       | `승인` |
| HOME-06 | 개인화 카드             | 오래된 연동, 최근 플레이 또는 미완료 콘텐츠 카드를 추가하지 않음                                                                                                                    | `거절` |
| HOME-07 | 목적지 비중             | 하나의 일관된 블록 Family를 사용하고 공용 검색과 악곡 → 채보 뷰어 → 서열 → 랭킹 → 빙고 → 검정 → 오락실 순서로 우선순위를 표현                                                       | `승인` |
| HOME-08 | 공지 배치 규칙          | 공지마다 역할과 위치를 하나만 지정: 활성 과업 영향 공지 최대 하나는 검색 앞, 일반 업데이트는 핵심 과업 아래 한 번만 표시                                                            | `승인` |
| HOME-09 | 공식 소식 표시          | X 공식 Embedded Timeline으로 일반 NosLog 공지 뒤의 별도 Grid에 `NOSTALGIA_573` 최신 원문 게시물 하나를 한 번만 표시                                                                 | `승인` |
| HOME-10 | 편집 콘텐츠 다국어      | NosLog 작성 공지는 세 언어를 모두 요구하고 X Section UI는 다국어화하되 Embed 원문 언어는 보존                                                                                       | `승인` |
| HOME-11 | 빈 검색 동작            | 빈 Query와 공백 Query 제출을 활성 범위 탐색 Catalog 진입으로 취급하고, 빈 `q`는 생략하며 범위는 보존하고 Catalog 기본값은 공용 탐색 기획서로 넘김                                   | `승인` |
| HOME-12 | 데스크톱 구성           | 390px보다 넓게 의미 구역과 내부 반응형 Grid 사용: 중앙의 제한된 검색, 넓은 동등 목적지, 별도 데이터 연동, 이후 공간이 충분할 때 더 큰 NosLog 업데이트와 더 작은 공식 소식 병렬 배치 | `승인` |
| HOME-13 | 일반 NosLog 공지 목적지 | 주 목적지와 데이터 연동 아래, NOSTALGIA 공식 소식 바로 앞에 홈에서 한 번만 유지                                                                                                     | `승인` |
| HOME-14 | 공식 소식 빈 상태       | 빈 Feed Shell 없이 다국어 공식 채널 Link를 유지하고 핵심 과업은 그대로 유지                                                                                                         | `승인` |
| HOME-15 | 일반 공지 표시 방식     | 모든 Viewport에서 최신 세 건의 제목·게시일 Link를 표시하고 다국어 상세·Archive를 제공하며 빈 경우 Section을 생략                                                                    | `승인` |
| HOME-16 | 검색 미리보기           | IME 안전 `300ms` 유휴 후 내부 스크롤이나 제자리 확장 없이 관련도순 결과를 최대 다섯 개 표시하고 승인된 네 상태와 초과 결과의 공용 탐색 인계를 사용                                  | `승인` |
| HOME-17 | 비동기 미리보기 피드백  | 검색창에 고정된 비모달 Popup, 지연 `400ms` 시각 Loading, 즉시 이전 결과 무효화, 오래된 응답 거부 및 홈을 막거나 Query를 잘못된 입력으로 표시하지 않는 Inline 재시도 실패를 사용     | `승인` |

## 다음 논의 묶음

홈 검색 상태 결정은 완료됐습니다. 다음 페이지 기획서 작업은 현재 구현의
Filter·정렬 상태를 그대로 상속하지 않고 공용 탐색 기획서에서 악곡 및 공개
채보 탐색 기본값을 정의하는 것입니다.

정확한 다국어 Copy는 상호작용과 상태 결정이 승인된 이후의 콘텐츠 시스템
작업으로 남깁니다.
