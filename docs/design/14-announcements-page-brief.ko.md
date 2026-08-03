# NosLog 2.0 공지 Archive 및 상세 페이지 기획서

## 문서 관리

- 상태: `승인`
- 결정 상태: `하나의 권위 있는 NosLog 작성 공지 시스템, 활성 서비스 중요
공지와 일반 공지의 서로 다른 홈 배치, 다국어 공개 Archive 및 상세 경로,
간결한 시간순 목록, 제한된 URL Pagination, 제한형 Markdown, 예약과 만료,
Locale별 수정 공개, 안정적인 다국어 정체성, 반응형 동작, 접근성, 검색
Metadata 및 브라우저 수용 기준을 포함한 완전한 공지 계약 승인`
- 근거 상태: `저장소, Schema, 관리자 흐름, 현재 Interface 및 인증된 브라우저
조사, 승인된 정보 구조와 홈 페이지 계약, 인용한 접근성·콘텐츠·프로덕션
공지·Changelog·리듬게임 레퍼런스 20개 이상, 사용자 승인 결정 기록`
- 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 원본 언어: 영어
- 영어 원본:
  [14-announcements-page-brief.md](./14-announcements-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 관련 홈 계약:
  [03-home-page-brief.ko.md](./03-home-page-brief.ko.md)
- 범위: NosLog가 작성하는 서비스 중요 공지와 일반 공지, 다국어 공개 Archive와
  상세 목적지, 홈에서 공지로의 인계, 발행과 만료 의미, 콘텐츠 형식, 수정 공개,
  반응형 구성, 접근성, 다국어, 검색 Metadata, 데이터 요구사항 및 향후 구현 수용
  기준
- 제외: NOSTALGIA 공식 X 콘텐츠, 완전한 관리자 Interface 재설계, 댓글, 반응,
  구독, 알림 전달, RSS, 공지 검색과 필터, 최종 Foundation Token, 최종
  High-fidelity 구성 및 이 디자인 가이드 세션에서의 Production 구현

## 결정 라벨

- **관찰:** 저장소, 현재 브라우저 근거, 승인된 상위 산출물 또는 인용 Source에서
  확인했습니다.
- **승인:** 사용자와 명시적으로 합의했으며 후속 디자인의 권위 있는 기준입니다.
- **제안:** 근거를 갖췄으나 사용자 승인을 기다리는 방향입니다.
- **미결:** 추가 조사, 테스트 또는 사용자 결정이 필요합니다.
- **거절:** 검토했지만 명시적으로 선택하지 않았습니다.
- **대체:** 이후 승인된 방향으로 교체했습니다.

이 기획서는 공개 공지 시스템의 제품 의미, 콘텐츠 계층, 발행 동작, 다국어,
반응형 동작, 상태, 접근성, Metadata 및 수용 기준에 대한 권위 있는 기준입니다.
정확한 Typography, 색상, 간격, Surface 처리, Radius, Elevation, 컨트롤 크기,
Grid Track 및 콘텐츠 기반 전환값은 Foundation과 후속 Claude Design 작업으로
남깁니다. 이후 시각 작업은 표현을 다듬을 수 있지만 이 제품 계약을 제거하거나
재해석하면 안 됩니다.

## 목적

공지 시스템은 다음 세 질문에 순서대로 답합니다.

> 지금 NosLog 이용에 영향을 주는 내용이 있는가, NosLog가 최근 무엇을
> 공지했는가, 그리고 현재 또는 과거 공지의 전체 내용을 내 언어로 어디에서
> 읽을 수 있는가?

현재 홈에서만 펼치는 공지를 지속 가능한 공개 발행 시스템으로 교체합니다. 일반
Blog, NOSTALGIA 공식 소식 Mirror, Social Feed, 지원 Ticket 시스템 또는 대규모
제품 Changelog가 아닙니다.

## 주요 Context와 성공 조건

- **승인된 상위 계약:** NosLog 이용에 실질적인 영향이 있을 때 홈의 주요 검색
  앞에 현재 활성 상태인 서비스 중요 공지 하나를 노출할 수 있습니다.
- **승인된 상위 계약:** 홈 하단 편집 영역은 별도 NOSTALGIA 공식 소식 영역 바로
  앞에서 최신 일반 NosLog 공지 세 건을 다국어 제목과 게시일 Link로 노출합니다.
- **승인:** 홈은 사용자가 현재 서비스 영향을 인식하거나 최근 일반 공지를
  선택할 수 있고 전체 본문을 그 자리에서 펼치지 않을 때 성공합니다.
- **승인:** Archive는 사용자가 현재와 과거 NosLog 공지를 시간순으로 훑고 특정
  공지를 열며 현재 Page를 공유·복원하고 공지가 없음을 이해할 수 있을 때
  성공합니다.
- **승인:** 상세는 인증 없이 선택한 Locale의 완전한 제목, 게시일, 해당하는
  수정일 및 구조화된 본문을 제공할 때 성공합니다.
- **승인:** 한국어·일본어·영어 페이지는 같은 공지 정체성을 가리킵니다. 번역이
  누락되면 한국어로 대체하지 않고 공개 발행을 차단합니다.
- **승인:** 오락실 주변의 모바일 이용이 우선이지만 데스크톱도 필수이며 현재의
  약 `390px` 고정 Shell을 유지하면 안 됩니다.
- **승인:** 현재 Styling과 Geometry는 조사 근거이지 NosLog 2.0의 시각적 권위가
  아닙니다.

## 현재 제품 및 도메인 근거

### 저장소와 데이터 근거

- **관찰:** 현재 `Announcement`는 하나의 `title`, 하나의 `content`,
  `isPublished`, `publishedAt`, `createdAt`, `updatedAt` 값을 저장합니다. 공개
  Slug, 번역 정체성, 배치, 우선순위, 예약, 만료, 제한된 Rich content 또는
  Locale별 공개 수정 Timestamp가 없습니다.
- **관찰:** 공개 Query는 공개된 Record만 선택하고 `publishedAt`과 `id` 내림차순으로
  정렬하며 5분 동안 Cache하고 최대 세 건을 반환합니다.
- **관찰:** 현재 공개 Record 형태에는 `id`, `title`, `content`, 선택적
  `publishedAt`만 있습니다.
- **관찰:** 한국어 관리자 Form은 제목을 `80`자, 본문을 `2,000`자로 제한합니다.
  발행은 Checkbox이며 즉시 이뤄지고, 공개 상태가 유지되는 동안 기존
  `publishedAt`을 보존합니다.
- **관찰:** 비공개로 바꾸면 `publishedAt`을 지우며 삭제는 Hard delete입니다.
  현재 흐름에는 번역 완성도 검사, 예약, 만료, 미리보기 또는 공개 콘텐츠 수정
  구분이 없습니다.
- **관찰:** 관리자 목록은 최대 `100`건을 반환합니다. 공개 Archive·상세 Route와
  공지 전용 자동화 테스트는 현재 존재하지 않습니다.
- **관찰:** Cache 무효화는 현재 홈과 관리자 Page만 다루며 다국어 공개 Archive와
  상세 목적지는 다루지 않습니다.

### 현재 Interface와 브라우저 근거

- **관찰:** 홈은 현재 최대 세 공지를 Native `details` Disclosure로 Rendering합니다.
  하나를 열면 전체 본문을 Inline으로 노출해 Hero, 검색, 주요 목적지를 아래로
  밀어냅니다.
- **관찰:** 확인한 개발 데이터에는 `프로토타입 테스트중입니다.`라는 공지 한
  건과 한국어로만 된 본문이 있었습니다.
- **관찰:** `390×844`에서 닫힌 공지 행은 문서 수준 가로 Overflow 없이
  들어갔습니다. 본문을 펼치면 공지 영역이 약 `84px`에서 약 `200px`로 늘고
  Hero가 아래로 이동했습니다.
- **관찰:** `320×800`에서 문서 자체는 Overflow되지 않았지만 현재 행의 제목과
  게시일이 모두 말줄임표로 잘렸습니다.
- **관찰:** `1440×900`에서도 현재 `main`은 정확히 약 `390px`에 머물러 대부분의
  데스크톱 너비를 사용하지 않았습니다.
- **관찰:** `/ja`와 `/en`은 Section 제목을 `お知らせ`와 `Announcements`로
  번역했지만 저장된 제목과 본문은 한국어 그대로였습니다.
- **관찰:** 공지 조사 중 Console 경고나 오류는 기록되지 않았습니다.

### 외부 근거

- **관찰:** USWDS Collection 가이드는 간결한 목록을 전체 콘텐츠로 향하는
  Link로 취급하고 고유한 제목 자체를 Link로 쓰며 날짜 같은 제한된 Metadata를
  사용하고 더 큰 Catalog는 별도 Archive로 보내라고 권고합니다.
- **관찰:** USWDS와 GOV.UK Pagination 가이드는 시간순 Archive의 URL로 접근
  가능한 Pagination을 지지하고 짧은 Collection의 불필요한 Pagination과 무한
  Scroll을 경계합니다.
- **관찰:** W3C 가이드는 설명적인 제목, 의미 있는 Link 목적, 올바른 Page 언어,
  Semantic 구조, 보이는 Focus 및 Reflow를 요구합니다.
- **관찰:** Google 다국어 Page 가이드는 상호 `hreflang`으로 연결한 언어별
  독립 URL을 지지하며 Article 가이드는 명시적인 제목, 게시일, 수정일 및 조직
  작성자 Metadata를 지지합니다.
- **관찰:** GitHub, Vercel, Notion, Linear, Cloudflare, Discord, Apple, Steam은
  Archive·목록 탐색과 완전한 콘텐츠를 분리합니다. 이들의 고급 필터, 검색,
  작성자, Media, RSS 및 분류 체계는 승인된 NosLog 요구보다 넓은 규모와 편집
  모델에 답합니다.
- **관찰:** NOSTALGIA, SOUND VOLTEX, maimai, osu! 공식 소식 Surface는 리듬게임
  Context에서 시간순 날짜·제목 탐색을 뒷받침합니다. 이들의 Legacy 표현, 공식
  발행 역할 및 혼합 외부 콘텐츠는 NosLog의 시각적·제품적 권위가 아닙니다.

## 승인된 범위와 불변 조건

1. 하나의 권위 있는 NosLog 작성 공지 Record가 모든 공개 홈·Archive·상세
   표현에 데이터를 제공합니다. 홈은 별도 사본을 유지하지 않습니다.
2. 각 공지는 `서비스 중요` 또는 `일반` 중 하나의 배치 역할을 가집니다. 같은
   공지를 홈의 두 위치에 중복하지 않습니다.
3. 홈은 현재 활성 상태인 서비스 중요 공지 중 명시적으로 가장 높은 우선순위
   하나만 주요 검색 앞에 표시합니다. 활성 공지가 없으면 빈 Shell을 남기지
   않습니다.
4. 홈 하단 편집 영역은 최신 일반 공지 최대 세 건을 표시합니다. 제목과 게시일만
   표시하고 본문을 Inline으로 펼치지 않습니다.
5. NOSTALGIA 공식 X 콘텐츠는 승인된 별도 공식 소식 영역에 유지하며 NosLog 공지
   Archive에 절대 넣지 않습니다.
6. 공개 Archive 경로는 `/ko/announcements`, `/ja/announcements`,
   `/en/announcements`입니다.
7. Archive는 원래 게시일 역순의 하나의 Semantic 목록입니다. 시간순을 여러
   시각 열로 나누지 않습니다.
8. 각 Archive 행은 완전한 다국어 제목과 다국어 원 게시일만 표시합니다. 요약,
   Thumbnail, 작성자, 읽는 시간, 반응, 보이는 분류 Chip 또는 중복 `더 읽기`
   Link를 두지 않습니다.
9. Archive Page 하나에는 최대 `20`건을 둡니다. 두 번째 Page가 생길 때만 URL
   기반 Pagination을 표시합니다.
10. 공지 Pagination은 `?page=2` 같은 주소 가능한 Query를 사용하고 새로고침과
    공유 후에도 유지되며 무한 Scroll이나 내부 Scroll 목록을 사용하지 않습니다.
11. 공지 Archive 검색, 필터, 정렬 컨트롤, Page 크기 선택 및 RSS는 승인된 초기
    시스템 범위가 아닙니다. 이후 검증된 사용자 요구가 필요합니다.
12. 상세는 Archive 복귀 Link 하나, 다국어 `h1`, 다국어 게시일, 해당하면
    Locale별 수정일 및 완전한 다국어 본문을 노출합니다.
13. 상세에는 작성자 Profile, 읽는 시간, 공유 컨트롤, 관련 공지, 이전·다음 공지,
    댓글 또는 반응을 추가하지 않습니다.
14. 공지 본문은 승인된 제한형 Markdown만 지원합니다. 문단, `h2`, `h3`, 순서
    없는 목록, 순서 있는 목록, 굵은 강조 및 Link입니다.
15. Raw HTML, 본문의 `h1`, 표, 이미지, 영상, Embed, 파일, Script 및 Custom
    Styling은 허용하지 않습니다. Text와 Link만으로 공지를 완전히 전달해야
    합니다.
16. Locale마다 제목 `80`자와 Markdown 본문 `5,000`자 제한을 둡니다. 제한은
    저장된 콘텐츠를 일관되게 계산하며 Rendering Pixel 너비에서 추론하지
    않습니다.
17. 발행은 `초안 -> 예약 또는 즉시 발행 -> 공개`를 따릅니다. 예약, 활성화 및
    만료는 Client 전용 Timer가 아닌 명시적 데이터입니다.
18. 서비스 중요 공지는 활성 구간을 가집니다. 만료 후 중요 홈 위치에서는
    사라지지만 Archive와 상세에는 남습니다.
19. 일반 공지는 만료 없이 공개 상태를 유지할 수 있습니다.
20. 게시된 공지는 파괴적 제거 전에 비공개로 전환합니다. 이전에 공개된 Record를
    관리자 목록에서 가볍게 Hard delete하지 않습니다.
21. 공지가 공개되기 전에 한국어·일본어·영어 제목과 본문을 모두 요구합니다.
22. 모든 공지는 Locale Route 전체에서 하나의 불변 언어 중립 공개 Slug를
    사용합니다. 제목을 수정해도 URL은 바뀌지 않습니다.
23. 제목, 본문 또는 보이는 Link를 포함해 공개 후 보이는 다국어 콘텐츠를
    수정하면 해당 Locale의 공개 수정 Timestamp를 갱신합니다.
24. 공개 전 수정과 관리자에게만 보이는 배치·예약·우선순위·내부 상태 수정은
    보이는 콘텐츠 수정일을 만들지 않습니다.
25. 상세는 공개 수정이 있으면 게시일과 수정일을 모두 보여줍니다. 홈과 Archive는
    원 게시일만 계속 표시하고 원 게시일 정렬을 유지합니다.
26. 공지 Page는 공개이며 비로그인과 로그인 사용자에게 동일합니다. 개인 읽음
    상태나 계정별 Module을 포함하지 않습니다.
27. Archive와 상세는 `320 CSS px`에서 Page 수준 2차원 Scroll 없이 Reflow하고
    데스크톱에서는 고정 Phone Canvas 대신 의도적인 읽기 너비를 사용합니다.

## 용어와 데이터 의미

| 개념             | 필수 의미                                                    | 의미하면 안 되는 것                                      |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| 서비스 중요 공지 | 현재 NosLog 이용에 실질적으로 영향을 주는 문제 또는 변경     | 모든 일반 업데이트, 홍보 강조 또는 일반적인 경고 Styling |
| 일반 공지        | 홈 하단 목록과 Archive에 보존하는 일반 NosLog 업데이트       | 삭제해도 되는 저품질 또는 선택적 데이터                  |
| 원 게시일        | 세 언어가 완성된 공지가 처음 공개된 시각                     | 최근 수정, 예약 수정 또는 홈 활성 시각                   |
| 공개 수정일      | 해당 Locale의 보이는 콘텐츠를 공개 후 마지막으로 수정한 시각 | 모든 DB `updatedAt` 또는 내부 관리자 수정                |
| 활성화           | 서비스 중요 공지가 중요 홈 위치에 나타날 수 있는 시점        | 최초 생성 또는 번역 초안 작성                            |
| 만료             | 서비스 중요 홈 강조의 종료                                   | 역사 Archive 삭제 또는 상세 URL 무효화                   |
| 비공개 전환      | 관리자 이력을 보존하면서 공개 목적지에서 의도적으로 제거     | 가벼운 영구 삭제                                         |
| 공개 Slug        | Locale 전체가 공유하는 불변 언어 중립 경로 정체성            | 수정 때 바뀌는 제목 기반 Locale 문자열                   |

### 배치와 우선순위

- `서비스 중요`와 `일반`은 보이는 Catalog 분류가 아니라 홈 배치를 제어합니다.
- 서비스 중요 공지가 둘 이상 동시에 활성화되면 시스템은 명시적 관리자
  우선순위와 결정적인 시간 동률 규칙으로 홈에 표시할 단 하나를 고릅니다. 다른
  활성 공지도 Archive에서는 계속 볼 수 있습니다.
- 내부 배치 Field가 있다는 이유만으로 Archive에 분류 Filter나 분류 Chip을
  노출하지 않습니다.

### 게시일과 수정일

- `publishedAt`은 명시적으로 승인된 데이터 정정 외에는 최초 공개 후 바꾸지
  않습니다.
- 한 언어만 고칠 수 있으므로 각 Translation에 자체 공개 콘텐츠 수정 Timestamp가
  필요합니다.
- 최초 발행에는 별도의 보이는 수정일이 없습니다.
- Archive는 오래된 공지가 수정됐다는 이유로 앞으로 이동하지 않습니다.
- 보이는 날짜는 Locale별 형식을 사용하고 Machine-readable `datetime` 값을
  가집니다.

## 승인된 정보 계층

### 홈 서비스 중요 Surface

활성 공지가 있을 때만 다음 Source 순서를 사용합니다.

1. 간결한 중요 Context 또는 Label
2. 상세로 향하는 완전한 다국어 공지 제목
3. 사용자 방향 파악에 필요하면 원 게시일

컨트롤은 본문을 펼치지 않습니다. 닫을 수 있는 Marketing Banner, Carousel 또는
영구 빈 Slot이 되면 안 됩니다. 닫기와 읽음 상태 동작은 승인하지 않았습니다.

### 홈 일반 Surface

다음 Source 순서를 사용합니다.

1. 다국어 Section 제목
2. 최신순 일반 공지 제목·날짜 Link 최대 세 건
3. 설명적인 `전체 공지` Archive Link 하나

공개 일반 공지가 없으면 일반 Section 전체를 생략합니다. 홈 계약에 따라 별도
NOSTALGIA 공식 소식 영역을 그 뒤에 유지합니다.

### Archive

하나의 Semantic `main`과 다음 모바일 우선 Source 순서를 사용합니다.

1. Page 정체성과 꼭 필요한 경우에만 간결한 목적
2. 역시간순 공지 목록
3. Page가 둘 이상일 때 Pagination

공간을 채우기 위해 Hero, 대표 공지, 검색창, Filter 행, 분류 Tab, 결과 수 또는
설명용 Marketing 문구를 추가하지 않습니다. Page 제목과 공지 목록이 과업에 바로
답해야 합니다.

### 상세

`main` 안의 하나의 Semantic `article`과 다음 Source 순서를 사용합니다.

1. 설명적인 Archive 복귀 Link 또는 Breadcrumb과 동등한 위치 단서
2. 하나뿐인 Page `h1`인 다국어 공지 제목
3. 원 게시일과 해당하면 Locale별 수정일
4. 작성 Source 순서의 제한형 Markdown 본문

승인된 최대 본문 길이는 제한되어 있고 브라우저 Back을 사용할 수 있으므로, 이후
브라우저 테스트에서 실제 탐색 문제가 입증되지 않는 한 본문 끝에 Archive 복귀
Link를 중복하지 않습니다.

### 넓은 화면 구성

- Archive는 하나의 시간순 읽기 열을 유지합니다. 추가 너비는 Page Frame과 읽기
  Line length를 개선할 수 있지만 두 개의 독립 시간순 열을 만들면 안 됩니다.
- 상세는 한국어·일본어·영어에 적합한 편집 읽기 너비를 사용합니다. 본문 행을
  가능한 데스크톱 Viewport 전체로 늘리지 않습니다.
- 승인된 제목, 날짜 및 제한된 본문은 영구 Sidebar를 정당화하지 않습니다.
- 정확한 Container 너비, 읽기 Measure, Margin 및 전환점은 대표 콘텐츠로 검증할
  Foundation과 후속 디자인 결정으로 남깁니다.

## 동작 우선순위

### Archive 동작

- **항목별 주요 동작:** 설명적인 제목 Link를 활성화해 해당 공지를 엽니다.
- **보조 동작:** Pagination이 있을 때 다른 Archive Page로 이동합니다.

한 행 안에 같은 상세 목적지로 가는 두 번째 Link를 추가하지 않습니다.

### 상세 동작

- **주요 동작:** 공지를 읽습니다.
- **보조 동작:** 공지 Archive로 돌아가거나 작성된 본문 Link를 따릅니다.

일반 상세 Page에는 강조 Button이 필요하지 않습니다. 본문 Link는 일반 Link
Semantic을 사용하고 외부 목적지는 외부 동작을 식별합니다.

## Archive 계약

### 목록 항목 구조

각 목록 항목은 다음을 포함합니다.

1. 완전한 다국어 제목
2. Locale별 원 게시일

제목만 상세 Link입니다. Archive에서 파괴적인 고정 폭 말줄임표를 쓰지 않고
줄바꿈합니다. 좁은 너비에서는 두 값을 읽을 수 없는 한 행에 강제로 넣지 말고
날짜가 제목 아래로 이동할 수 있습니다.

### Pagination

- 첫 Page는 필수 `?page=1` 접미사 없이 Archive Root를 Canonical로 사용합니다.
- 첫 Page 이후는 안정적인 URL Query를 사용합니다.
- 공지가 0~`20`건이면 Pagination을 Rendering하지 않습니다.
- Pagination은 이전·다음 탐색과 현재 Page 의미를 노출합니다. 넓은 화면은 간결한
  제한 Page 번호 집합을 노출할 수 있고 좁은 화면은 접근 가능한 처음·이전·현재·
  다음·마지막 의미를 보존하면서 보이는 번호를 줄일 수 있습니다.
- Pagination은 한 시각 행에 유지하고 승인된 Foundation 접근성 Target을 만족하는
  Touch Target을 가집니다.
- 유효하지 않거나 범위를 벗어난 Page는 비어 있지만 성공한 Archive를 Rendering하지
  않고 안전한 첫 Page 또는 다국어 Not-found 동작으로 처리합니다. 정확한 Redirect
  Status는 구현 수준 SEO 결정입니다.

### 빈 Archive

`공지사항이 없습니다.`와 동등한 짧은 다국어 문장 하나를 표시합니다. 검색 제안,
분류 제안, Illustration 요구사항 또는 비활성 Pagination을 추가하지 않습니다.

## 상세 콘텐츠 계약

### 제한형 Markdown

허용하는 작성 구조는 다음과 같습니다.

- 문단
- `h2`와 `h3` Section 제목
- 순서 없는 목록과 순서 있는 목록
- 굵은 강조
- 내부 및 외부 Link

Rendering은 명시적인 Allowlist로 콘텐츠를 Sanitizing해야 합니다. Markdown
Syntax로 Raw HTML, 실행 가능한 URL, 임의 Attribute, Custom Color, Layout 또는
Style을 허용하면 안 됩니다. 관리자 작성 경험은 공개 상세와 같은 Sanitized
구조를 Preview해야 하지만 최종 시각 재설계는 이후 관리자 Initiative에 속합니다.

### Link 동작

- 내부 NosLog Link는 활성 Locale을 우선하며 승인된 Route 정체성을 보존합니다.
- 외부 Link는 목적지 동작을 시각적·Programmatic하게 노출합니다.
- Link Text는 목적지를 설명합니다. 공지가 목적지를 직접 이름 붙일 수 있을 때
  반복되는 `여기를 클릭`이나 `더 읽기`는 충분하지 않습니다.
- 긴 URL이나 끊기지 않는 Token은 Page 수준 Overflow 없이 줄바꿈합니다.
- 이후 명시적 제품 또는 보안 이유를 승인하지 않는 한 새 Tab 열기는 기본값이
  아닙니다.

### 콘텐츠 제한

- 제목: Locale별 최대 `80`자
- 본문: Locale별 최대 `5,000` Stored Markdown 문자
- 본문은 이미지, 영상, Embed, 표 또는 파일 첨부를 받지 않습니다.
- 긴 제목, 긴 일본어 문자열, 영어 확장, 한도에 가까운 목록 및 여러 Link를 대표
  Fixture에 포함해야 합니다.

## 발행과 생명주기 계약

### 상태 모델

| 상태                         | 공개 Archive 및 상세 | 홈 중요 공지         | 홈 일반 공지    |
| ---------------------------- | -------------------- | -------------------- | --------------- |
| 초안                         | 숨김                 | 숨김                 | 숨김            |
| 공개 시작 전 예약            | 숨김                 | 숨김                 | 숨김            |
| 공개된 일반 공지             | 표시                 | 숨김                 | 최신 세 건 후보 |
| 공개된 활성 서비스 중요 공지 | 표시                 | 우선순위에 따라 후보 | 숨김            |
| 공개된 만료 서비스 중요 공지 | 표시                 | 숨김                 | 숨김            |
| 비공개 전환                  | 공개 사용자에게 숨김 | 숨김                 | 숨김            |

만료는 강조를 끝내는 것이지 역사적 의미를 끝내는 것이 아니므로 Archive는 만료된
서비스 중요 공지를 보존합니다.

### 발행 준비 상태

다음이 모두 유효하기 전까지 발행을 차단합니다.

1. 불변 공개 Slug
2. 승인된 배치 역할 하나
3. 한국어·일본어·영어 제목과 본문
4. 제목과 본문 길이 제한
5. Sanitized 제한형 Markdown 검증
6. 유효한 예약과 활성 순서
7. 만료가 있으면 활성 시각보다 이후

서비스 중요 공지는 결정적인 홈 동작을 만들 수 있는 충분한 시간과 우선순위
데이터도 요구합니다.

### 비공개 전환과 파괴적 제거

- 비공개 전환은 초안 콘텐츠를 드러내지 않고 Record를 홈, Archive, 상세,
  Sitemap 및 공개 Metadata에서 제거합니다.
- 비공개 또는 사용할 수 없는 공개 Slug 요청은 공유 다국어 Not-found 경험을
  사용하며 비공개 Record 존재 여부를 드러내지 않습니다.
- 이전에 공개된 Record의 Hard delete는 예외이며 결과를 설명하는 관리자 확인 뒤에
  위치합니다. 정확한 보존과 관리자 권한은 이후 구현 및 관리자 디자인 작업에
  속합니다.

## 날짜와 개정 계약

### 원 발행

- 완전한 공지가 처음 공개될 때 원 게시 Timestamp를 설정합니다.
- 예약 발행은 실제로 공개된 유효 시각을 사용합니다.
- 비공개 후 재공개가 역사적 게시 순서를 조용히 다시 쓰면 안 됩니다.

### 공개 수정

- 최초 발행 이후 보이는 다국어 제목, 본문 Text 또는 보이는 작성 Link를 수정하면
  해당 Locale의 공개 수정 Timestamp를 갱신합니다.
- 모든 공개 대상 수정이 해당합니다. 사용자에게 투명한 수정 정보를 제공하기 위해
  관리자가 먼저 `중요 수정`으로 분류할 필요가 없습니다.
- 일본어만 수정하면 한국어나 영어를 수정됨으로 표시하지 않습니다.
- 최초 발행 전 초안 수정은 수정일을 만들지 않습니다.
- 배치, 우선순위, 예약, 만료 및 그 밖의 관리자 전용 수정은 보이는 콘텐츠까지
  바꾸지 않는 한 다국어 콘텐츠 수정일을 만들지 않습니다.

### 공개 표현

- 수정 Timestamp가 있으면 상세는 게시일과 수정일을 함께 표현합니다.
- 홈과 Archive는 간결한 탐색을 위해 원 게시일만 표시합니다.
- Archive와 홈 정렬은 원 게시일을 계속 기준으로 합니다.
- Article Metadata는 Page에 보이는 것과 같은 Locale별 공개 수정일을 사용하며
  무관한 DB `updatedAt`을 노출하면 안 됩니다.

## URL, Metadata 및 색인 계약

### 공개 경로

- Archive: `/[locale]/announcements`
- 상세: `/[locale]/announcements/[publicSlug]`
- Pagination: 첫 Page 이후 `/[locale]/announcements?page=N`

공개 Slug는 한 번 생성하거나 명시적으로 지정하고 언어에 중립적이며 수정된
제목에서 다시 생성하지 않습니다.

### Locale 정체성

- 각 한국어·일본어·영어 상세 URL은 같은 공지 정체성의 한 번역을 나타냅니다.
- 상호 `hreflang` Alternative가 사용 가능한 세 Locale Route를 모두 연결합니다.
- 모든 번역을 한 언어로 Canonical 처리하지 않고 각 Locale Page가 자체 Canonical
  URL을 가집니다.
- 상세에서 언어를 전환하면 공개 Slug를 유지하고 동등한 번역을 엽니다.

### Metadata

각 상세 Page는 다음을 다국어로 제공합니다.

- 승인된 콘텐츠에서 파생한 문서 제목과 설명
- Open Graph 제목, 설명, URL 및 NosLog 정체성
- 원 게시일과 Locale별 수정일
- NosLog를 조직 작성자·발행자로 사용하는 `Article` 또는 구현에서 검증한 호환
  Structured-data Type
- 상호 대체 언어 Link

이 기획서는 이미지를 요구하지 않습니다. Metadata는 Announcement Image를
만들어내거나 Article Image Field를 채우기 위해 저작권 있는 NOSTALGIA Artwork를
재사용하면 안 됩니다.

공개된 Archive와 상세 목적지는 공개 Sitemap에 참여합니다. 초안, 공개 전 예약 및
비공개 Record는 참여하지 않습니다.

## 인증과 권한 계약

### 공개 사용자

- 비로그인과 로그인 사용자는 같은 공지 콘텐츠와 탐색을 받습니다.
- 로그인 요청, 개인 읽음 표시, 닫기 상태 또는 계정별 정렬을 표시하지 않습니다.
- 공개 Rendering은 관리자 Note, 초안, 예약 컨트롤, 번역 준비 상태 또는 우선순위
  값을 드러내면 안 됩니다.

### 관리자 경계

향후 관리자 흐름은 승인된 콘텐츠 모델, 검증, Preview, 예약, 활성화, 만료,
우선순위, Locale별 수정일, 비공개 전환 및 예외적인 파괴 확인을 지원해야 합니다.
이 기획서는 그 최종 시각 Layout을 승인하거나 기존 관리자 경계를 넘어 접근을
확장하지 않습니다.

## 반응형 계약

### 좁은 Archive

- 대표 `390px`에서 우선 검증하고 `320 CSS px`까지 Reflow합니다.
- 제목 전체를 이해할 수 있게 보존합니다. 제목을 줄바꿈하고 필요하면 날짜를 별도
  행으로 옮기며 두 값을 모두 잘라내지 않습니다.
- 하나의 시간순 열과 문서 수준 Scroll을 유지합니다.
- Pagination은 의미가 불분명한 두 번째 행으로 꺾이지 않으면서 이해하고 조작할 수
  있어야 합니다.
- 가로 Scroll, 고정 Phone 너비 자식 또는 내부 Scroll 영역을 사용하지 않습니다.

### 좁은 상세

- 제목, 날짜, Heading, 목록, 문단 및 Link가 Viewport 안에서 줄바꿈합니다.
- Heading 계층과 간격은 `320 CSS px`에서 작성 관계를 보존해야 합니다.
- 긴 Link와 일본어 문자열이 안전하게 줄바꿈합니다.
- 본문 기능은 Hover 상태를 요구하지 않습니다.

### 넓은 Archive와 상세

- Page Shell은 현재 최대 `390px`를 넘어 확장하지만 Archive와 상세은 목적에 맞는
  읽기 Measure를 유지합니다.
- Archive를 Masonry 또는 여러 열 Card Grid로 바꾸지 않습니다.
- 상세에 영구 Metadata Sidebar를 도입하거나 본문을 Viewport 전체로 늘리지
  않습니다.
- 추가 너비는 콘텐츠 중복이나 Source 순서 변경 없이 Frame, 제목·날짜 정렬 및
  Pagination 위치를 개선할 수 있습니다.
- 정확한 최대 Measure와 콘텐츠 기반 전환값은 Foundation과 후속 Claude Design
  결정으로 남깁니다.

### 확대와 짧은 Viewport

- 브라우저 확대와 짧은 높이에서 고정 Overlay가 제목, 날짜, 목록 또는 본문을
  가리면 안 됩니다.
- 공유 Header는 승인된 셸 계약을 따라야 합니다. Compact 자동 숨김은 일관되게
  복귀해야 하며 Compact 또는 지속 표시 Wide 동작이 Viewport 높이 가정 때문에
  Archive나 상세 탐색을 가두면 안 됩니다.

## 접근성 계약

- Archive는 Semantic Heading, 순서 없는 목록 및 목록 항목을 사용합니다. 각
  제목은 해당 상세 Page로 가는 고유한 이름의 Link입니다.
- 상세는 하나의 `main`, 하나의 `article`, 하나의 Page `h1` 및 작성된 `h2`/`h3`
  계층을 사용합니다.
- 날짜는 Machine-readable `datetime` 값을 가진 Semantic `time` 요소를 사용합니다.
- Pagination은 설명적인 `nav` Label, 목록 Semantic, Link Semantic 및 현재
  Page의 `aria-current="page"`를 사용합니다.
- 보이는 Focus는 승인된 Foundation 계약을 따르며 목록이나 콘텐츠 Container에
  잘리지 않습니다.
- Link 목적은 보이는 Text 또는 Programmatic Context에서 이해할 수 있습니다.
- 외부 Link 의미를 색상이나 설명 없는 Icon만으로 나타내지 않습니다.
- 서비스 중요 의미를 색상만이 아니라 Text와 Semantic으로 전달합니다.
- 제한형 Markdown은 일반 Click Container가 아닌 Native Semantic 문단, Heading,
  목록, 강조 및 Link로 Rendering합니다.
- 콘텐츠는 `320 CSS px`에서 Page 수준 2차원 Scroll 없이 Reflow합니다.
- Touch Target은 승인된 Foundation Target을 만족하고 충분한 간격을 유지합니다.
- 최초 Server-rendered Archive와 상세 콘텐츠는 Client JavaScript 없이도 이해할 수
  있습니다. 공지를 읽거나 주요 Link를 따르는 데 점진적인 Client 동작이 필수가
  되면 안 됩니다.
- Page 언어는 활성 Locale과 일치하며 의도적으로 삽입한 외국어 Fragment는 필요할
  때 적절한 Language-of-parts Markup을 사용합니다.

## 다국어 계약

- 모든 공개 Route와 UI Label은 한국어·일본어·영어를 지원합니다.
- NosLog 작성 제목과 본문은 발행 전에 승인된 세 번역을 모두 요구합니다.
  일본어·영어 Route에서 한국어를 조용히 대체 노출하지 않습니다.
- Locale 전체에서 같은 공지 정체성과 불변 Slug를 유지합니다.
- 날짜는 Locale에 맞는 보이는 형식을 사용하면서 명확한 Machine-readable
  Timestamp 하나를 유지합니다.
- Archive 제목, 상세 Heading, 빈 문구, Not-found 문구, Pagination 이름, 게시·수정
  Label, Archive 복귀 Link 및 외부 Link 의미를 다국어로 제공합니다.
- 내부 본문 Link는 활성 Locale을 우선합니다. 동등한 다국어 목적지가 없다면
  존재하지 않는 번역을 암시하지 말고 실제 목적지를 식별해야 합니다.
- 한국어와 일본어 줄바꿈, 영어 확장, 문장부호 및 전각 문자를 한 언어의 시각
  가정으로 정규화하면 안 됩니다.
- 공개 콘텐츠 수정은 Translation별로 추적하며 변경된 Locale만 수정일을
  노출합니다.

## Runtime 상태 계약

| 상태                                | 필요한 공개 결과                                                              | 상태   |
| ----------------------------------- | ----------------------------------------------------------------------------- | ------ |
| 활성 서비스 중요 공지 없음          | 중요 홈 Container 또는 예약 여백 없음                                         | `승인` |
| 활성 서비스 중요 공지 하나          | 주요 검색 앞에 연결된 공지 하나                                               | `승인` |
| 활성 중요 Record 여러 건            | 결정적으로 가장 높은 우선순위 하나만 표시하고 모든 공개 항목은 Archive에 유지 | `승인` |
| 일반 공지 없음                      | 홈 하단 공지 Section 생략                                                     | `승인` |
| 일반 공지 1~3건                     | 사용 가능한 제목·날짜 Link 전부 표시                                          | `승인` |
| 일반 공지 3건 초과                  | 최신 세 건과 `전체 공지` 표시                                                 | `승인` |
| 빈 Archive                          | 짧은 다국어 빈 문구 하나만 표시하고 Pagination 없음                           | `승인` |
| Archive Record 1~20건               | 하나의 완전한 목록, Pagination 없음                                           | `승인` |
| Archive Record 20건 초과            | 20건과 URL로 접근 가능한 Pagination                                           | `승인` |
| Archive Page 새로고침·공유·뒤로가기 | URL을 통해 같은 Page 보존                                                     | `승인` |
| 범위를 벗어난 Archive Page          | 안전한 첫 Page 또는 다국어 Not-found 처리, 비어 있는 성공 목록 금지           | `승인` |
| 일반 상세                           | 다국어 제목, 게시일 및 본문 표시                                              | `승인` |
| 수정된 상세                         | 해당 Locale 수정일도 표시                                                     | `승인` |
| 만료된 서비스 중요 상세             | 현재 홈 강조 없이도 계속 읽을 수 있음                                         | `승인` |
| 공개 전 예약                        | 홈, Archive, 상세, Sitemap 및 Metadata에서 노출하지 않음                      | `승인` |
| 비공개 또는 사용할 수 없는 Slug     | 비공개 Record를 드러내지 않는 공유 다국어 Not-found                           | `승인` |
| 발행 시 번역 누락                   | 모든 공개 Locale 발행 차단                                                    | `승인` |
| 허용하지 않은 Markup 포함           | 공개 Rendering 전 Allowlist 기준으로 차단 또는 Sanitizing                     | `승인` |
| 최초 요청 실패                      | 오래된 비공개 초안을 보이지 않고 공유 Page 수준 재시도·오류 계약 사용         | `승인` |
| 비로그인                            | 완전한 공개 읽기와 탐색 유지                                                  | `승인` |
| 로그인                              | 동일한 공개 콘텐츠, 개인 읽음 상태 없음                                       | `승인` |

Archive와 상세에는 사용자 대상 파괴적 동작이 없습니다. 발행, 비공개 전환 및 Hard
delete 실패는 이후 관리자 계약에 속하지만 위의 공개 불변 조건을 보존해야 합니다.

## 구현 Mapping

### 필요한 Semantic 데이터

정확한 Prisma 정규화는 구현 결정이지만 구현에는 다음 의미가 필요합니다.

- 불변 공개 Slug
- 배치 역할
- 서비스 중요 우선순위
- 초안, 예약, 공개 및 비공개 생명주기 의미
- 원 게시 Timestamp
- 서비스 중요 활성 및 선택적 만료 Timestamp
- 한국어·일본어·영어 제목과 제한형 Markdown 본문
- Locale별 공개 콘텐츠 수정 Timestamp
- 사용자에게 자동 노출하지 않는 일반 내부 생성·수정 Audit Timestamp

정규화된 `Announcement`와 `AnnouncementTranslation` 모델은 가능한 Mapping이지만,
다른 Schema가 승인된 정체성·검증·Query 동작을 보존한다면 이를 강제하지 않습니다.

### 필요한 Query

- 홈의 가장 높은 우선순위 활성 서비스 중요 공지
- 홈의 최신 공개 일반 공지 세 건
- 한 Locale의 역시간순 Page 단위 공개 Archive
- 불변 Slug와 Locale로 공개 상세 조회
- 한 상세 Record의 상호 Locale Metadata
- 관리자 검증과 생명주기 Query

모든 공개 Query는 초안, 공개 전 예약 및 비공개 콘텐츠를 제외해야 합니다. 만료된
서비스 중요 Record는 Archive와 상세 후보로 계속 남습니다.

### Rendering과 Sanitizing

- 명시적 Allowlist로 제한형 Markdown을 Parsing합니다.
- Link를 Sanitizing하고 실행 가능한 Scheme를 거절합니다.
- Semantic하며 Server에서 읽을 수 있는 HTML을 Rendering합니다.
- Preview가 지원하지 않는 구조를 약속하지 않도록 관리자 Preview와 최종 상세
  의미에 하나의 공개 Rendering 경로를 사용합니다.
- 발행 상태나 보이는 콘텐츠가 바뀌면 홈, 영향을 받는 모든 다국어 Archive Page,
  상세 Locale Route, Sitemap 및 Metadata를 Cache 무효화하고 Revalidate합니다.

### 현재에서 목표로 Migration

- 기존 단일 언어 Record는 한국어 Source를 보존하고 승인된 일본어·영어 번역을
  갖춰야 2.0 시스템에서 공개할 수 있습니다.
- 기존 ID는 내부에 남을 수 있지만 공개 Link에는 새 불변 Slug가 필요합니다.
- 현재 Plain text는 Raw HTML을 추가하지 않고 Markdown 호환 문단으로 옮길 수
  있습니다.
- 기존 홈 Disclosure는 제목·날짜 Link가 되고 본문은 상세로 이동합니다.
- 기존 `updatedAt`을 공개 수정일로 무조건 재사용하면 안 됩니다.

## 대표 Fixture

후속 가이드 예시, 구현 Fixture 및 브라우저 테스트는 다음을 포함해야 합니다.

1. 공지 없음
2. 일반 공지 한 건
3. 일반 공지 정확히 세 건과 세 건 초과
4. 활성 중요 공지 없음과 한 건
5. 결정적인 우선순위를 가진 서로 겹치는 활성 중요 공지
6. Archive와 상세에는 남아 있는 만료 중요 공지
7. Archive Record 정확히 `20`건과 `21`건
8. 첫·중간·마지막 Archive Page
9. `80`자 한국어 제목
10. 긴 일본어 제목과 확장된 영어 제목
11. 문단, `h2`, `h3`, 두 목록 형태, 굵은 Text, 내부 Link 및 외부 Link 본문
12. `5,000`자에 가까운 본문
13. 끊기지 않는 긴 Link Text와 전각 문자 혼합
14. 수정되지 않은 최초 발행
15. 일본어와 영어 수정일이 생기지 않음을 증명하는 한국어만 공개 후 수정한 상태
16. 수정된 제목과 수정된 본문·Link
17. 절대 공개되지 않는 예약, 비공개 및 번역 누락 Record
18. 허용하지 않은 Raw HTML과 안전하지 않은 URL 시도
19. 같은 공개 상세에 대한 비로그인과 로그인 접근
20. 유효하지 않거나 범위를 벗어난 Archive·상세 URL

Fixture Text는 줄바꿈이나 계층 문제를 숨기는 반복 Placeholder가 아니라 대표
콘텐츠여야 합니다.

## 브라우저 수용 계약

승인된 모든 공개 상태를 다음에서 검증합니다.

- `320 CSS px` 좁은 Reflow
- 대표 `390px` 모바일 Viewport
- 제목·날짜 또는 Pagination 구성이 바뀌는 중간 너비 최소 하나
- `1280px` 또는 `1440px` 같은 데스크톱 너비
- 고정 높이, 잘림 및 Reflow 실패를 드러낼 정도의 브라우저 확대

필수 확인 사항:

- 한국어·일본어·영어 Archive 및 상세 Route
- 일본어·영어에서 한국어 콘텐츠 대체 없음
- 홈 중요 공지 없음과 활성 상태
- 홈 일반 공지 수 `0`, `1`, `3`, `3` 초과
- 모든 홈·Archive 제목이 올바른 Locale 동등 상세를 여는지
- `전체 공지`가 올바른 Locale Archive를 여는지
- `320px`에서 Archive 제목이 완전히 보이고 잘리지 않으며 날짜가 안전하게
  Reflow하는지
- 홈에서 Inline 본문 Disclosure가 없는지
- Archive Page당 정확히 `20`건이고 Page 하나에는 Pagination이 없는지
- Pagination 공유, 새로고침, 앞으로가기 및 뒤로가기 복원
- 현재 Page의 Semantic 알림과 Keyboard 탐색
- 상세 게시일과 Locale별 수정일
- 만료 중요 공지가 Archive·상세에는 남고 홈에서는 사라지는지
- 초안, 예약, 번역 누락 및 비공개 제외
- 제한형 Markdown Semantic과 Sanitizing
- 긴 본문, 긴 Link, 긴 한국어·일본어·영어 콘텐츠 및 문서 가로 Overflow 없음
- 보이는 Focus, Heading 계층, 목록 Semantic, `time` Semantic, Link 목적, 언어
  Markup 및 Touch Target
- 자체 Canonical, 상호 `hreflang`, 다국어 Metadata, 구조화된 날짜 및 Sitemap
  포함·제외
- 비로그인과 로그인에서 동일한 공개 접근
- 처리되지 않은 Console 오류나 Hydration 실패 없음
- Client JavaScript가 없어도 유용한 Server-rendered 콘텐츠와 Link 탐색

## 레퍼런스 Matrix

| Source                                                                                                            | 이전 가능한 원칙                                                                                                             | NosLog 적용                                                                    | 한계                                                                          |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [USWDS Collection](https://designsystem.digital.gov/components/collection/)                                       | 간결한 관련 콘텐츠 목록은 고유한 제목 Link, 제한된 Metadata, Semantic 목록 및 더 많은 항목을 위한 별도 Archive를 사용합니다. | 제목만 상세 Link로 쓰고 날짜만 행 Metadata로 쓰며 홈에서 Archive로 인계합니다. | USWDS는 NosLog에 필요 없는 선택적 요약과 이미지를 지원합니다.                 |
| [USWDS Pagination](https://designsystem.digital.gov/components/pagination/)                                       | 큰 시간순 Collection은 현재 Page Semantic과 넉넉한 Target을 가진 제한 URL Pagination을 쓸 수 있습니다.                       | 20건 Archive Page와 접근 가능한 탐색을 뒷받침합니다.                           | NosLog Page 크기나 최종 시각 Styling을 결정하지 않습니다.                     |
| [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/)                                  | 유용할 때만 Page를 나누고 무한 Scroll을 피하며 Page 하나에는 Pagination을 숨기고 이해 가능한 인접 탐색을 유지합니다.         | 조건부 URL Pagination과 무한 Scroll 거절을 뒷받침합니다.                       | 정부 Journey Styling은 NosLog 시각 권위가 아닙니다.                           |
| [GOV.UK Notification banner](https://design-system.service.gov.uk/components/notification-banner/)                | 방해가 큰 알림 처리는 일반 편집 콘텐츠가 아니라 사용자가 알아야 할 정보에 사용합니다.                                        | 검색 전 위치를 서비스 중요 공지에만 예약합니다.                                | Alert Role과 Tone은 긴급도가 일치하지 않으면 복사할 수 없습니다.              |
| [W3C Link Purpose](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)                      | 사용자는 Link Text나 Programmatic Context에서 목적지를 이해해야 합니다.                                                      | 공지 제목 Link와 설명적인 Archive 탐색에 적용합니다.                           | Page Layout이나 Metadata 밀도를 고르지 않습니다.                              |
| [W3C Headings and Labels](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels)                        | 설명적인 Heading은 방향 파악과 훑기를 돕습니다.                                                                              | Archive Heading 하나, 상세 `h1` 하나, 작성 `h2`/`h3`에 적용합니다.             | Typography를 규정하지 않습니다.                                               |
| [W3C Language of Page](https://www.w3.org/WAI/WCAG22/Understanding/language-of-page)                              | 보조 기술에는 올바른 Page 및 부분 언어가 필요합니다.                                                                         | Locale Route와 조용한 한국어 대체 금지를 뒷받침합니다.                         | 번역 Workflow를 정의하지 않습니다.                                            |
| [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                             | 콘텐츠는 Page 수준 2차원 Scroll 없이 320 CSS px에서 Reflow합니다.                                                            | 제목·날짜 쌓기, 본문 줄바꿈 및 좁은 Pagination의 근거입니다.                   | 정확한 반응형 전환은 콘텐츠에 따라 남습니다.                                  |
| [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) | 다국어 동등 Page는 독립 URL과 상호 언어 Alternative를 사용합니다.                                                            | `/ko`, `/ja`, `/en` 전체에서 같은 Slug와 `hreflang`을 사용합니다.              | 검색 발견은 사용성이나 번역 QA를 대신하지 않습니다.                           |
| [Google Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)    | Article Metadata는 제목, 게시, 수정 및 조직 작성자를 노출할 수 있습니다.                                                     | Locale별 날짜와 NosLog 발행자 Metadata의 근거입니다.                           | Rich result 표시는 보장되지 않으며 이 기획서는 이미지를 요구하지 않습니다.    |
| [MDN `time`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/time)                           | 사람이 읽는 날짜에 Machine-readable 값을 담을 수 있습니다.                                                                   | 명확한 `datetime`을 가진 다국어 보이는 날짜에 적용합니다.                      | 보이는 Locale 형식을 고르지 않습니다.                                         |
| [GitHub Changelog](https://github.blog/changelog/)                                                                | 대규모 업데이트는 검색 가능한 분류, 날짜 Link, 상세 Page, Archive Grouping 및 RSS를 사용합니다.                              | Archive·상세 분리와 Metadata 가치를 확인합니다.                                | 볼륨·Tag·제품 범위는 NosLog Filter를 정당화하지 않습니다.                     |
| [Vercel Changelog](https://vercel.com/changelog)                                                                  | Catalog 규모가 요구할 때 밀도 높은 제품 업데이트에 검색과 분류를 제공합니다.                                                 | NosLog 규모가 커질 때의 이후 비교 근거입니다.                                  | 현재 NosLog 공지는 더 작고 제품 Marketing Feed가 아닙니다.                    |
| [Notion Releases](https://www.notion.com/releases)                                                                | Release Archive와 날짜 있는 개별 상세 콘텐츠는 계속 공유할 수 있습니다.                                                      | 안정적인 상세 정체성과 시간을 뒷받침합니다.                                    | 긴 홍보 Release Package는 NosLog 공지 요구를 넘습니다.                        |
| [Linear Changelog](https://linear.app/changelog/page/1)                                                           | 편집 Changelog는 날짜, 긴 Narrative, Media, 검색 및 분류를 결합할 수 있습니다.                                               | 풍부한 기능은 편집 요구가 생긴 뒤 추가해야 함을 확인합니다.                    | 지속적인 제품 Storytelling과 Media는 현재 범위 밖입니다.                      |
| [Cloudflare Changelog](https://developers.cloudflare.com/changelog/)                                              | 기술 Archive는 날짜 Entry, 제품 Context, Pagination 및 RSS를 노출합니다.                                                     | 안정적인 시간순 보존을 뒷받침합니다.                                           | 기술 제품 분류와 Code 중심 본문은 NosLog보다 넓습니다.                        |
| [Discord Blog](https://discord.com/blog)                                                                          | Article Archive는 분류, 요약, Media 및 더 불러오기를 사용합니다.                                                             | 일반 Blog Pattern이 공지 Archive보다 많은 정보를 가진 이유를 보여줍니다.       | NosLog는 편집 Magazine이나 Press center가 아닙니다.                           |
| [Apple Newsroom](https://www.apple.com/newsroom/)                                                                 | News Archive는 콘텐츠 Type을 구분하고 날짜 있는 영구 Article을 제공합니다.                                                   | 지속 가능한 공개 상세 및 Archive 정체성을 뒷받침합니다.                        | 보도자료, 사진 및 Topic 분류는 NosLog 요구가 아닙니다.                        |
| [Steam News](https://steamcommunity.com/app/593110/announcements/)                                                | 게임 서비스 공지는 날짜 있는 긴 업데이트와 안정적인 Link를 보존합니다.                                                       | 간결한 탐색 밖의 완전한 상세를 뒷받침합니다.                                   | Community 반응, Media 및 Social Count는 명시적으로 제외했습니다.              |
| [NOSTALGIA 공식](https://p.eagate.573.jp/game/nostalgia/op3/top/entrance.html)                                    | 리듬게임 사용자는 게임 Context 근처의 시간순 날짜·업데이트 정보에 익숙합니다.                                                | 날짜·제목 훑기의 친숙함을 확인합니다.                                          | 공식 일본어 전용 Legacy 표현은 NosLog 접근성·Layout 권위가 아닙니다.          |
| [SOUND VOLTEX News](https://p.eagate.573.jp/game/sdvx/vii/news/index.html)                                        | 일반 업데이트와 중요한 사과 공지가 시간순으로 함께 존재합니다.                                                               | 중요 공지의 만료 후 역사 보존과 강조 분리를 뒷받침합니다.                      | Character Voice, 이미지 및 공식 Marketing은 NosLog 작성 공지와 맞지 않습니다. |
| [maimai News](https://maimai.sega.jp/news/)                                                                       | Page로 나눈 날짜·제목 Archive는 리듬게임 서비스에서 확립된 방식입니다.                                                       | 시간순 Pagination을 뒷받침합니다.                                              | Legacy Pagination 밀도와 시각 처리는 복사하지 않습니다.                       |
| [osu! News](https://osu.ppy.sh/home/news) 및 [News API](https://osu.ppy.sh/docs/#news)                            | News에는 안정적인 Record, Slug, 게시·수정 Metadata, 작성자, 이미지 및 Pagination이 있습니다.                                 | 지속 가능한 Machine-readable 정체성과 다국어 대응 데이터 분리를 뒷받침합니다.  | Community 편집 규모와 작성자·Media Field는 승인된 NosLog 범위를 넘습니다.     |

### 근거 수렴

- 접근성과 Collection 가이드는 Semantic 목록, 설명적인 제목 Link, 제한된 Metadata,
  올바른 언어, 날짜 Semantic 및 Reflow로 수렴합니다. 이는 제목·날짜 행을
  뒷받침하고 현재의 좁은 한 행 말줄임을 거절합니다.
- Pagination 가이드와 Production Archive는 성장하는 시간순 역사를 위한 URL로
  접근 가능한 Page로 수렴하고 불필요한 Pagination이나 무한 Scroll을 거절합니다.
  정확한 `20`건 크기는 보편 표준이 아니라 승인된 NosLog 선택입니다.
- Production 서비스는 안정적인 상세 URL, 원 게시일 및 수정 Metadata로
  수렴합니다. 이들의 검색, 분류, RSS, 작성자, Media 및 반응은 더 큰 편집
  Catalog 문제를 풀며 초기 NosLog 복잡성을 정당화하지 않습니다.
- 리듬게임 Source는 날짜 우선 시간순 탐색과 중요한 서비스 업데이트 보존으로
  수렴합니다. 공식 지위와 Legacy 표현은 Layout, Tone 또는 일본어 전용 콘텐츠
  복사를 정당화하지 않습니다.
- 다국어와 검색 가이드는 Locale별 URL, 공유 콘텐츠 정체성, 상호 언어 Alternative
  및 진실한 보이는·구조화 날짜로 수렴합니다.
- 현재 NosLog 근거와 승인된 홈 기획서는 Inline Disclosure를 Link로 교체하고 현재
  서비스 영향과 일반 편집 업데이트를 분리하며 완전한 콘텐츠를 다국어 상세와
  Archive에 보존하는 방향으로 수렴합니다.

## 거절 및 대체한 선택지

- **홈 전용 Accordion 본문 유지 — 대체:** 홈은 이제 간결한 공지 탐색을 완전한
  다국어 상세로 연결합니다.
- **모든 공지에 하나의 홈 위치 사용 — 대체:** 활성 서비스 영향과 일반 업데이트는
  승인된 서로 다른 위치와 Record당 역할 하나를 가집니다.
- **한 공지를 중요·일반 홈 영역에 중복 — 거절:** Record 하나는 홈 위치 하나를
  가지며 Archive가 공통 탐색을 보존합니다.
- **공식 NOSTALGIA X 게시물을 NosLog Archive에 포함 — 거절:** Source 정체성,
  언어, 소유권 및 승인된 홈 역할을 분리합니다.
- **Archive에 본문 요약, Thumbnail, 분류, 작성자 표시 — 거절:** 제목과 날짜가
  불필요한 밀도 없이 승인된 정보 단서를 제공합니다.
- **지금 Archive 검색, Filter, 정렬 또는 Page 크기 컨트롤 추가 — 거절:** 현재
  확인된 조회 요구가 이를 정당화하지 않습니다.
- **무한 Scroll 또는 내부 Scroll 목록 — 거절:** URL Pagination이 위치, 공유,
  복원, Keyboard 접근 및 역사 탐색을 보존합니다.
- **데스크톱 여러 열 시간순 Archive Card — 거절:** 하나의 목록이 명확한 읽기
  순서를 보존합니다.
- **제목 기반 다국어 Slug — 거절:** 제목 수정과 세 언어가 정체성을 나누고 공유
  Link를 깨뜨립니다.
- **한두 번역으로 공개하고 한국어 대체 — 거절:** 모든 NosLog 작성 공개 공지는 세
  언어를 모두 요구합니다.
- **DB `updatedAt`을 수정일로 표시 — 거절:** 공개 상세는 발행 후 해당 Locale에서
  보이는 콘텐츠를 수정한 경우만 표시합니다.
- **수정일 표시 전에 `중요 수정` Checkbox 요구 — 대체:** 공개 후 보이는 콘텐츠의
  모든 수정이 해당 Locale 공개 수정일을 갱신합니다.
- **수정일 기준 Archive 재정렬 — 거절:** 정정이 과거 공지를 새 공지로 만들지
  않습니다.
- **만료 중요 공지 삭제 — 거절:** 만료는 홈 강조를 끝내지만 역사 접근을 끝내지
  않습니다.
- **Raw HTML, 이미지, Embed, 표 또는 첨부 허용 — 거절:** 제한된 Semantic
  Markdown이 낮은 보안·Layout 위험으로 승인된 공지 요구를 충족합니다.
- **댓글, 반응, 읽음 상태, 닫기 또는 개인화 정렬 추가 — 거절:** 공지는 Social이나
  Inbox 시스템이 아니라 공개 읽기 콘텐츠입니다.
- **Archive와 상세을 데스크톱에서도 `390px`로 고정 — 거절:** 반응형 Shell은 읽기
  Measure를 보호하면서 넓은 공간을 의도적으로 사용합니다.

## 결정 기록

| ID     | 결정                                                                                            | 상태   |
| ------ | ----------------------------------------------------------------------------------------------- | ------ |
| ANN-01 | 홈 전용 펼침 공지를 하나의 권위 있는 홈·Archive·상세 시스템으로 교체                            | `승인` |
| ANN-02 | 각 Record에 `서비스 중요` 또는 `일반` 홈 배치 역할 하나 부여                                    | `승인` |
| ANN-03 | 홈 검색 앞에 가장 높은 우선순위의 활성 중요 공지 최대 하나 표시, 빈 Shell 없음                  | `승인` |
| ANN-04 | 홈 하단 편집 영역에 최신 일반 제목·날짜 Link 세 건 표시                                         | `승인` |
| ANN-05 | NOSTALGIA 공식 X 콘텐츠를 NosLog 공지 Archive와 분리                                            | `승인` |
| ANN-06 | 공개 `/[locale]/announcements` Archive Route 제공                                               | `승인` |
| ANN-07 | 완전한 다국어 제목과 원 게시일만 가진 최신순 Semantic 목록 하나 사용                            | `승인` |
| ANN-08 | 20건 이후 주소 가능한 URL Pagination 사용, 무한·내부 Scroll 금지                                | `승인` |
| ANN-09 | 초기 Archive 검색, Filter, 정렬, Page 크기 선택 및 RSS 제외                                     | `승인` |
| ANN-10 | Archive 복귀, `h1` 하나, 날짜 및 전체 본문을 가진 공개 다국어 상세 제공                         | `승인` |
| ANN-11 | 작성자, 읽는 시간, 공유 컨트롤, 관련·인접 공지, 댓글 및 반응 제외                               | `승인` |
| ANN-12 | 제한형 Markdown에서 문단, `h2`, `h3`, 목록, 굵은 강조 및 Link만 허용                            | `승인` |
| ANN-13 | 제목 80자를 유지하고 Locale별 본문 제한을 Markdown 5,000자로 확대                               | `승인` |
| ANN-14 | Raw HTML, 본문 `h1`, 표, 이미지, 영상, Embed, 파일, Script 및 Custom Styling 거절               | `승인` |
| ANN-15 | 초안, 예약 또는 즉시 발행, 공개, 만료 및 비공개 생명주기 의미 사용                              | `승인` |
| ANN-16 | 만료 중요 공지를 홈 강조에서 제거하지만 Archive와 상세에 보존                                   | `승인` |
| ANN-17 | 이전 공개 Record의 예외적 파괴 제거 전에 비공개 전환 요구                                       | `승인` |
| ANN-18 | 발행 전에 한국어·일본어·영어 제목·본문 완성 요구                                                | `승인` |
| ANN-19 | Locale Route 전체에서 하나의 불변 언어 중립 공개 Slug 사용                                      | `승인` |
| ANN-20 | 원 게시일을 불변으로 유지하고 홈·Archive 표시와 정렬에 사용                                     | `승인` |
| ANN-21 | 공개 후 보이는 콘텐츠 수정마다 해당 Locale의 공개 수정일 표시                                   | `승인` |
| ANN-22 | 공개 전 또는 관리자 전용 수정을 공개 콘텐츠 수정으로 취급하지 않음                              | `승인` |
| ANN-23 | 상세에는 게시일과 해당 수정일, 그 외에는 게시일만 표시                                          | `승인` |
| ANN-24 | 개인 읽음 상태 없이 비로그인·로그인 사용자에게 동일한 공개 콘텐츠 제공                          | `승인` |
| ANN-25 | Locale별 Canonical, 상호 `hreflang`, 진실한 Article Metadata 및 Sitemap 포함                    | `승인` |
| ANN-26 | 320 CSS px까지 Reflow하고 여러 열 시간순 없이 의도적인 데스크톱 읽기 Measure 사용               | `승인` |
| ANN-27 | Semantic 목록, Heading, 날짜, Pagination, Link 목적, Focus, 언어 및 Server-readable 콘텐츠 보존 | `승인` |

## Handoff 경계

Claude Design은 Foundation 승인 후 최종 Type Scale, 편집 Measure, Surface, 중요 공지
강조, 행 Divider, 날짜 처리, Pagination 표현, Markdown Rhythm, 간격, Grid Track,
반응형 전환값 및 절제된 Motion을 결정할 수 있습니다. 승인된 두 홈 역할, 중복 없는
콘텐츠 정체성, 제목·날짜 Archive 밀도, 20건 URL Pagination, 간결한 상세,
제한형 Markdown, 생명주기, 번역 Gate, 안정적인 Slug, 투명한 Locale별 수정,
공개 접근, Semantic 구조 및 수용 기준을 보존해야 합니다.

향후 Codex 구현 세션은 Claude 결과와 이 기획서를 비교해야 합니다. Inline 홈
본문을 복원하거나, 홈 역할 전체에 공지를 중복하거나, 공식 X 콘텐츠를 Archive에
섞거나, Archive 제목을 숨기거나 잘라내거나, 승인하지 않은 Catalog 컨트롤을
추가하거나, 무한 Scroll에 의존하거나, 제목과 함께 URL을 바꾸거나, 불완전한
번역을 공개하거나, 만료 역사를 삭제하거나, Raw HTML을 노출하거나, 내부
`updatedAt`을 공개 수정으로 잘못 사용하거나, 수정으로 역사를 재정렬하거나,
계정별 읽음 상태를 추가하거나, 데스크톱을 Phone 너비로 고정하거나, Client
JavaScript 없이는 콘텐츠를 사용할 수 없게 만드는 결과를 구현하기 전에 가이드
또는 디자인 수정을 요청해야 합니다.
