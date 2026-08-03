# NosLog 2.0 개인정보 및 데이터 처리 페이지 기획서

## 문서 관리

- 상태: `출시 차단 조건을 포함하여 승인`
- 결정 상태: `공개 다국어 개인정보처리방침, 만 14세 이상 계정 이용 기준,
한눈에 보는 요약과 전체 방침의 계층형 제공, 페이지 내 내비게이션,
공개 프로필의 결과에 대한 명시적 설명, 검증된 비수집 항목, 서비스 제공자·
외부 서비스·Cookie·기기 저장소의 구분, 설정 및 이메일 권리 행사 경로,
버전 이력, 반응형 장문 읽기, 한국어·일본어·영어의 실질적 동등성을 승인함.
최종 운영자 신원과 법률 문구는 출시 전 법률 검토가 필요한 상태로 남김.`
- 근거 상태: `저장소, Schema, 삭제, 보존, 업로드, Session, OAuth, 다국어,
외부 서비스 및 배포 설정 조사, 320·390·1280 CSS px에서 한국어·일본어·
영어 실브라우저 검사, 승인된 프로필·설정·인증·데이터 연동·공통 셸·정보
구조 계약, 규제·접근성·서비스 제공자·실서비스 레퍼런스 20개 이상 및
사용자 승인 결정 기록`
- 작성 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 문서 언어: 한국어 동기화본
- 영어 원본:
  [18-privacy-data-practices-page-brief.md](./18-privacy-data-practices-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 공통 셸 계약:
  [15-shared-shell-navigation-brief.ko.md](./15-shared-shell-navigation-brief.ko.md)
- 설정 및 계정 계약:
  [16-settings-account-page-brief.ko.md](./16-settings-account-page-brief.ko.md)
- 인증 및 온보딩 계약:
  [17-authentication-onboarding-page-brief.ko.md](./17-authentication-onboarding-page-brief.ko.md)
- 프로필 공개 범위 계약:
  [09-profile-page-brief.ko.md](./09-profile-page-brief.ko.md)
- 데이터 연동 계약:
  [13-data-sync-page-brief.ko.md](./13-data-sync-page-brief.ko.md)
- 범위: 공개 개인정보처리방침 경로, 데이터 처리 공개, 공개 데이터의 결과,
  보존 및 삭제 설명, Cookie 및 기기 저장소, 처리자와 외부 서비스, 국외 이전,
  계정 연령 기준, 개인정보 권리 및 연락 경로, 방침 이력, 반응형 읽기,
  접근성, 다국어, 구현 매핑 및 출시 인수 조건
- 제외 범위: 법률 자문, 최종 법적 효력을 갖는 문구, 운영자 실명 자동 공개,
  최종 Foundation Token과 시각 스타일, 원시 계정 데이터의 셀프서비스 Export,
  법률 검토 없이 선정한 Cookie 동의 플랫폼, 관리자 개인정보 운영 화면 재설계,
  프로덕션 구현, 데이터베이스·스토리지 Migration 및 High-fidelity 페이지 디자인

## 결정 상태 표기

- **관찰:** 저장소, 브라우저, 배포 설정, 승인된 상위 문서 또는 인용 출처에서
  확인한 사실입니다.
- **승인:** 사용자와 명시적으로 합의했으며 후속 디자인과 구현의 기준입니다.
- **제안:** 근거를 바탕으로 제안했지만 사용자 승인을 기다리는 방향입니다.
- **미확정:** 출시 전에 조사, 운영 환경 검증, 법률 검토 또는 사용자 결정이
  필요합니다.
- **출시 차단 조건:** 명확히 표시한 Placeholder로 디자인할 수는 있지만,
  해결된 것처럼 표현하거나 최종 문구로 출시하면 안 됩니다.
- **거절:** 검토했지만 명시적으로 선택하지 않은 방향입니다.
- **대체됨:** 이후 승인한 방향이 앞선 방향을 대체했습니다.

이 기획서는 NosLog 2.0 개인정보 경험과 인터페이스의 설명이 실제 제품 처리와
일치하도록 하는 계약을 규정합니다. 법률 검토를 대신하지 않습니다. Claude
Design은 승인될 Foundation 안에서 최종 시각 구성을 정할 수 있지만, 필수
공개사항을 단순화하여 없애거나, 존재하지 않는 데이터 처리를 만들거나,
유효한 동의가 없는 상태를 동의로 표현하거나, 공개 결과를 숨기거나, 출시 차단
조건을 해결된 것처럼 보여주면 안 됩니다.

## 목적

개인정보처리방침 페이지는 방문자와 계정 사용자가 Source code를 읽지 않아도
NosLog가 무엇을 받거나 생성하고, 저장하고, 공개하고, 서비스 제공자에게 보내고,
보존·삭제하며, 의도적으로 수집하지 않는지 이해하게 합니다. 설정 관리, 계정
삭제, 개인정보 문의 및 이전 방침 버전 확인으로 직접 이동할 수도 있어야 합니다.

페이지는 다음 아홉 질문에 이 순서대로 답해야 합니다.

1. 누가 NosLog를 운영하며 이 안내는 어떤 서비스를 다루는가?
2. NosLog는 어떤 데이터를 어디에서 어떤 목적으로 수집하는가?
3. 다른 사람이 볼 수 있는 프로필·기록·랭킹·커뮤니티 데이터는 무엇인가?
4. 승인된 제품 계약에서 NosLog가 수집하지 않는 인증정보·음원·위치·광고·
   추적 데이터는 무엇인가?
5. 각 주요 범주는 얼마나 보존되며 삭제하면 무엇이 일어나는가?
6. 어떤 처리자·인프라·신원 제공자·Embed 서비스·외부 콘텐츠 출처가 데이터나
   연결 Metadata를 받는가?
7. 어떤 Cookie와 기기 내 설정이 존재하고 얼마나 유지되며 삭제하면 무엇이
   동작하지 않는가?
8. 사용자는 데이터에 접근·정정·제한·비공개·삭제를 어떻게 요청하거나 실행하는가?
9. 무엇이 언제 변경되고 효력이 발생했으며 이전 버전은 어디에서 읽는가?

## 주요 사용 맥락과 성공 조건

- **승인:** 개인정보처리방침은 로그인이 필요 없는 공개 Locale Prefix 목적지
  `/[locale]/privacy`입니다.
- **승인:** 일반 페이지 Footer가 지속적인 전역 진입점입니다. Login, 계정 삭제,
  Upload, 외부 연동 및 다른 수집 맥락에는 개인정보처리방침을 더보기 Panel로
  옮기지 않고 문맥형 링크를 추가할 수 있습니다.
- **승인:** 첫 화면에서 가장 중요한 데이터 처리를 이해하고 전체 상세로 바로
  이동할 수 있으면 방문자의 과업이 성공합니다.
- **승인:** 공개 프로필의 영향을 이해하고 다른 페이지를 찾지 않아도 설정,
  계정 삭제 또는 개인정보 이메일로 이동하면 계정 사용자의 과업이 성공합니다.
- **승인:** 단순히 NosLog가 어떤 일을 할 “수 있다”는 일반 목록이 아니라 실제
  제품 동작과 비교할 수 있을 만큼 구체적으로 설명해야 합니다.
- **승인:** 전체 방침은 한 페이지에서 검색하고 읽을 수 있어야 하며 첫 계층의
  요약이 전체 안내를 대체하지 않습니다.
- **승인:** 한국어·일본어·영어가 같은 핵심 사실, 권리, 제한, 시행일 및 출시
  차단 조건을 제공합니다.
- **승인:** NosLog 계정 생성과 로그인 계정 사용은 만 14세 이상으로 제한합니다.
  계정 자격과 무관하게 공개 탐색은 허용합니다.
- **미확정 / 출시 차단 조건:** 최종 법률 문구, 개인정보처리자·운영자 신원,
  관할별 법적 근거, 신고 기관 및 동의 요건은 NosLog 2.0 출시 전 자격 있는
  전문가의 검토를 받아야 합니다.

## 현재 제품 근거

### 현재 방침과 경로

- **관찰:** 현재 공개 경로는
  [`app/(nevigation)/privacy/page.tsx`](<../../app/(nevigation)/privacy/page.tsx>)에
  구현되어 있고 한국어·일본어·영어 전체 문구가 Page module에 포함돼 있습니다.
- **관찰:** 현재 섹션은 데이터와 목적, 수집 방법, 보존, 제3자 제공, 처리자 및
  국외 이전, 삭제, 권리, Cookie, 보안, 연락처 및 변경을 다룹니다.
- **관찰:** 현재 방침은 이메일과 `NosLog 운영자`만 연락 주체로 표시합니다.
  사용자는 실제 운영자 성명 공개를 명시적으로 보류했습니다.
- **관찰:** 페이지는 공개·Index 가능 상태이며 일반 사용자 Shell을 사용하고
  Footer에서 연결됩니다.
- **관찰:** `h1` 하나, 순차적인 `h2` 섹션 제목 및 `h3` 항목 제목을 사용합니다.
  한국어·일본어·영어에서 `lang` 속성이 올바르게 바뀝니다.
- **관찰:** 목차, 간결한 처리 요약, 이전 버전 Archive, 별도 최종 수정일 및
  설정 직접 행동은 없습니다.

### 브라우저 근거

- **관찰:** 현재 페이지를 320·390·1280 CSS px의 한국어·일본어·영어에서 실제로
  검사했습니다.
- **관찰:** 아홉 Specimen 모두 문서 수준 가로 Overflow가 없었습니다.
- **관찰:** 320 CSS px 문서 높이는 한국어 약 3,705px, 일본어 4,273px,
  영어 4,816px였습니다.
- **관찰:** 390 CSS px에서는 한국어 약 3,255px, 일본어 3,614px,
  영어 4,021px였습니다.
- **관찰:** 1280 CSS px에서도 일반 Main 콘텐츠가 중앙 390px 열로 유지됐고,
  한국어 약 3,232px, 영어 약 3,931px여서 넓은 공간 대부분이 비었습니다.
- **관찰:** 현재 모바일 헤더는 320 CSS px에 들어가지만 장문 개요나 섹션
  내비게이션이 없어 반복 Scroll이 필요합니다.
- **관찰:** 제목 순서, 건너뛰기 링크, 이메일 링크, 다국어 Home 링크 및 Footer
  링크는 보존할 유용한 의미 구조입니다.

### 계정 및 신원 데이터

- **관찰:** Discord OAuth는 `identify`만 요청합니다. Discord ID, Username,
  Global display name 및 Avatar를 가져오며 Email·Guild·Message·Connection
  Scope는 요청하지 않습니다.
- **관찰:** Callback은 기본 신원을 가져오기 위해 수명이 짧은 Discord Access
  token을 사용하고 Access token이나 Discord Password를 저장하지 않습니다.
- **관찰:** 계정은 지속되는 Discord 식별자·표시 필드, NosLog Username,
  NOSTALGIA Player name, Avatar 참조, 국가·지역, Locale, 번역 제목 선호,
  선호 오락실, 공개 범위 Flag, Role, 공식 게임 지표 및 연동 Metadata를 저장합니다.
- **관찰:** 승인된 프로필 계약은 데이터가 있을 때 NosLog Username, Avatar,
  국가 범주 신원, 검정, 경쟁 지표, 순위, 진행도, Best Plays, 랭크 분포 및
  판정 요약을 공개합니다.
- **관찰:** 승인된 프로필 계약은 사용자가 각각 제어하는 다섯 그룹을 추가합니다.
  NOSTALGIA Player name, Discord 신원, 선호 오락실, Play count, 그리고
  Last played와 Recent Plays를 함께 제어하는 Play activity입니다.
- **관찰:** 현재 Schema는 다섯 그룹 중 세 개만 지원합니다. 선호 오락실과
  Play activity 공개 범위는 2.0 구현이 필요합니다.

### NOSTALGIA 기록 및 제품 활동

- **관찰:** Bookmarklet은 공식 `p.eagate.573.jp` 페이지에서 실행되며 사용자의
  기존 공식 사이트 브라우저 Session을 사용해 Player·Recent play·Full record
  응답을 요청한 뒤, 반환된 기록 Payload와 서명된 NosLog Sync token을
  NosLog로 보냅니다.
- **관찰:** NosLog는 BEMANI Password나 공식 사이트 Session cookie를 받지 않습니다.
- **관찰:** 저장 게임 데이터에는 Profile 합계, Mode와 Grade, 상세 Best record,
  Score, Rank, Combo, 판정 수, Timing 값, Note type 비율, Play count,
  Full Combo·Pianist 수, 최근 Play event, Record snapshot, Sync attempt 및
  Timestamp가 포함됩니다.
- **관찰:** 승인된 프로필 계약은 임의의 30개 제한 없이 의미 있는 전체 이력을
  보존하고 중복 Event나 동일 Snapshot을 만들지 않습니다.
- **관찰:** 사용자 생성·연결 활동에는 Bingo 진행, 검정 제출·Achievement,
  채보 평가·Reaction, Feedback report, Profile card 공유 및 향후 승인된 서열
  투표가 포함될 수 있습니다.
- **관찰:** 서열 투표는 승인된 향후 기능이지만 Production schema는 아직 없습니다.
  투표를 수집하기 전에 방침과 수집 안내를 갱신해야 합니다.

### 업로드, 보존 및 삭제

- **관찰:** Avatar는 공개 Vercel Blob을 사용합니다. URL을 가진 사람은 Public
  Blob을 요청할 수 있고 프로필과 공유 산출물에 선택한 Avatar가 표시될 수 있습니다.
- **관찰:** 검정 증빙과 피드백 첨부는 별도의 비공개 Vercel Blob을 사용하고,
  권한을 검사하는 Server 경로를 통해서만 전달됩니다.
- **관찰:** 이미지는 JPEG·PNG·WebP, 4MB 이하로 제한하고 Upload token 발급은
  사용자와 목적별로 Rate limit을 적용합니다.
- **관찰:** 해결된 피드백 기록과 첨부는 해결 후 6개월에 삭제됩니다.
- **관찰:** 승인된 검정 증빙과 Reviewer note는 검토 후 6개월에 Redact하고,
  승인된 Achievement는 계정 삭제 때까지 유지합니다.
- **관찰:** 거절된 검정 제출과 증빙은 검토 후 6개월에 삭제합니다.
- **관찰:** 보존 Cron은 매일 실행합니다. Cleanup은 Batch로 처리하고 실패 수를
  기록해 후속 운영 조치를 가능하게 합니다.
- **관찰:** 계정 삭제는 알려진 Avatar·Feedback·Exam Blob 삭제를 먼저 시도한 뒤
  User row와 Cascade 연결 데이터를 지우고 마지막으로 Session을 파기합니다.
  Blob 실패 시 File 참조를 의도치 않게 잃지 않도록 활성 계정 Row 삭제를 막습니다.
- **관찰:** Client flow는 취소한 Feedback·Exam upload를 버리고 Avatar Save가
  성공하면 이전 Avatar를 교체하려고 시도합니다.
- **미확정 / 출시 차단 조건:** 직접 Upload한 File을 URL이 DB Record에 연결되기
  전에 이탈할 수 있습니다. 모든 경로의 Storage lifecycle 또는 고아 Upload
  Cleanup 보장이 아직 입증되지 않았습니다.
- **미확정 / 출시 차단 조건:** 현재 문구는 관리 DB의 Point-in-time history,
  Backup, CDN 복사본 또는 Provider 삭제 기간을 설명하지 않고 즉시 영구 삭제를
  약속합니다. 최종 문구 전에 활성 시스템과 Backup 만료 동작을 확인해야 합니다.

### Cookie, 기기 저장소, Log 및 외부 서비스

- **관찰:** `user_session_cookie`는 필수이며 HTTP-only, SameSite Lax,
  Production에서 Secure이고 최대 14일로 설정됩니다.
- **관찰:** `noslog-locale`은 HTTP-only가 아닌 언어 선호 Cookie이며 1년으로
  설정됩니다. 현재 방침에는 공개되지 않았습니다.
- **관찰:** Theme, 채보 뷰어 Metronome volume 및 Strict Performance 선호는
  Browser local storage를 사용합니다. 기기에만 남고 Account profile field가 아닙니다.
- **관찰:** 채보 에디터 Piano visibility도 현재 관리자 Tool의 Local storage를
  사용합니다. Editor가 사용자 기능이 되면 내부·관리자 문서 범위에서 이동시켜야 합니다.
- **관찰:** 현재 Codebase에는 제품 Analytics, 광고 SDK, Tracking pixel 또는
  Marketing profile Dependency가 없습니다.
- **관찰:** 배포는 `sin1`의 Vercel Functions를 사용하며, 설정된 Neon Host는
  Singapore의 AWS `ap-southeast-1`로 확인됩니다.
- **관찰:** 현재 방침은 두 Blob store가 Seoul `icn1`이라고 기재하지만 저장소만으로
  Blob Dashboard 설정을 독립 검증할 수 없습니다.
- **관찰:** Kakao Maps는 지도 경험에서만 JavaScript SDK를 Loading합니다.
  Home의 X 공식 Widget은 `data-dnt=true`로 Loading합니다. Discord OAuth,
  Discord Avatar 전송, 공식 NOSTALGIA Asset·Record page 및 외부 Link도 각
  운영자에게 일반 연결 Metadata를 전송할 수 있습니다.
- **미확정 / 출시 차단 조건:** Vercel Log의 정확한 Field와 보존, Neon History와
  Backup 보존, Blob Region과 삭제 Lifecycle, Subprocessor 목록 및 각 외부
  서비스의 법적 분류는 출시 환경에서 검증해야 합니다.
- **미확정 / 출시 차단 조건:** 지원 관할에서 X·Kakao 또는 다른 비필수 Embed가
  사전 동의, Just-in-time 안내 또는 사용자 시작 Loading을 필요로 하는지 법률
  검토해야 합니다. 이 문서는 동의 Gate를 임의로 추가하거나 면제하지 않습니다.

## 조사 종합

### 수렴한 발견

1. 개인정보 안내는 일반 면책문이 아니라 실제 범주, 목적, 보존, 수령자, 권리,
   자동 수집 및 연락 경로를 설명해야 합니다.
2. 필수·선택 처리, 동의 기반·비동의 처리, 직접 수집·외부 출처 수집, 처리자·
   제3자 역할을 서로 구분해야 합니다.
3. 핵심 정보는 수집 시점 이전 또는 그 시점에 제공하고 안정적인 서비스 위치에서
   연결해야 합니다. Footer 링크는 필요하지만 수집 맥락 링크도 유용합니다.
4. 짧은 계층이 운영자, 주요 데이터 범주, 목적, 공개 결과 및 제어 경로를 알리고
   전체 방침에 접근할 수 있을 때 계층형 안내가 이해를 높입니다.
5. 장문은 설명적인 제목과 페이지 내 내비게이션이 유용합니다. 많은 닫힌
   Accordion 뒤에 전체 법률 의미를 숨기면 안 됩니다.
6. 데이터 최소화, 목적 제한, 정확한 보존·삭제 및 진실한 비수집 설명은 Copywriting
   선택만이 아니라 신뢰와 Engineering 요구사항입니다.
7. 국외 서비스는 구체적이고 유지 관리되는 공개가 필요합니다. Region,
   Subprocessor 또는 보존 기본값이 바뀌면 고정 Vendor 설명은 오해를 만듭니다.
8. 공개 게임 기록과 랭킹은 공개 결과를 명시해야 합니다. 사용자가 UI만 보고
   Profile visibility를 추론하게 해서는 안 됩니다.
9. 계정 권리 경로는 직접 수행 가능한 제어와 제품이 자동 처리하지 못하는 요청의
   사람 연락 경로를 함께 제공해야 합니다.
10. 방침 버전과 시행일은 사용자와 검토자가 특정 시점에 어떤 약속이 적용됐는지
    판단하게 합니다.
11. 다국어 번역은 원문의 시각 길이만 흉내 내는 것이 아니라 법적 의미를 보존해야 합니다.
12. 만 14세 미만 계정을 완전한 법정대리인 동의·검증 체계 없이 허용하면 안 됩니다.
    계정을 만 14세 이상으로 제한하면 공개 탐색을 유지하면서 미구현 법적 절차를
    만들지 않을 수 있습니다.

### NosLog 적용 결론

- **승인:** 현재 전체 방침 범주는 보존하되 실제 제품 데이터와 공개 결과를 중심으로
  재구성합니다.
- **승인:** 간결한 한눈에 보기 계층과 페이지 내 내비게이션 하나를 추가하며 요약으로
  방침을 대체하지 않습니다.
- **승인:** 개인정보처리방침을 Schema, Infrastructure 및 승인된 페이지 기획서와
  동기화하는 살아 있는 제품 계약으로 취급합니다.
- **승인:** 계정 데이터, NOSTALGIA 기록, 공개 Profile·Ranking 결과, 제출,
  커뮤니티 활동, 서비스 운영, Cookie 및 기기 전용 선호를 명시합니다.
- **승인:** 검증된 비수집 경계를 명시하며 구현에서 경계를 바꾸기 전에 방침을 먼저
  변경하도록 요구합니다.
- **승인:** 버전 Archive를 유지하고 `Last updated`와 `Effective`를 분리합니다.
- **승인:** 설정과 이메일을 권리 경로로 유지합니다. 큰 서비스가 제공한다는 이유만으로
  2.0에 원시 Data export 버튼을 추가하지 않습니다.
- **승인:** 이후 사용자의 명시적 결정과 법률 검토 없이 운영자 실명을 공개하지 않습니다.
  가상의 이름을 채우거나 `NosLog 운영자`가 법적으로 충분하다고 암묵적으로 간주하지
  않고 출시 차단 조건으로 유지합니다.

## 승인된 범위와 불변 조건

### 공개 경로와 진입점

- 한국어·일본어·영어에서 `/[locale]/privacy`를 안정적으로 유지합니다.
- 로그인 상태와 무관하게 일반 페이지 Footer 링크를 유지합니다.
- Login에는 간결한 Discord 안내 옆에 문맥형 개인정보처리방침 링크를 둡니다.
- 계정 삭제에는 파괴적 결과 설명 근처에 문맥형 링크를 둡니다.
- Feedback, 검정 증빙, Avatar, Data Sync, Profile visibility 및 외부 지도·
  Embed 맥락은 관련 방침 Heading으로 연결되는 간결한 Just-in-time 문구를
  사용할 수 있습니다.
- 개인정보처리방침을 더보기 Panel에 중복 목적지로 넣지 않습니다.
- 변경되지 않은 방침에 동의해야만 공개 콘텐츠를 보게 하지 않습니다.
- 계정 생성에 명시적 동의 Control이 필요한지는 법률 검토 결과이며 시각적
  추측으로 정하지 않습니다.

### 계정 연령 기준

- 공개 NosLog 정보는 계정 없이 탐색할 수 있습니다.
- NosLog 계정을 생성하거나 사용하려면 만 14세 이상이어야 합니다.
- Login과 계정 생성은 계정 행동을 완료하기 전에 연령 기준을 알립니다.
- Profile 장식이나 콘텐츠 개인화를 위해 생년월일을 수집하지 않습니다.
- 법률 검토가 충분하다고 승인하는 경우에만 간결한 연령 확인을 사용할 수 있습니다.
  이 문서는 신분증이나 법정대리인 데이터 수집을 임의로 만들지 않습니다.
- 향후 만 14세 미만 사용자를 허용하려면 구현 전에 법정대리인 동의·검증·철회·
  보존·개인정보 문구 계약을 새로 승인해야 합니다.

### 검증된 비수집 설명

검증된 제품 동작이 바뀌지 않는 동안 한눈에 보기와 전체 방침에서 다음을 말할 수 있습니다.

- NosLog는 Discord Password를 받거나 저장하지 않습니다.
- 기본 신원을 가져오는 Discord OAuth Access token을 지속 저장하지 않습니다.
- Discord Email·Guild·Message·Connection Scope를 요청하지 않습니다.
- BEMANI Password나 공식 사이트 Session cookie를 받거나 저장하지 않습니다.
- 채보 에디터·뷰어에서 고른 Local MP3 또는 다른 Audio는 Browser 안에 남고
  NosLog Server나 Database로 Upload되지 않습니다.
- 정확한 기기 Geolocation을 요청하지 않습니다.
- 광고, 행동 Analytics 또는 Marketing tracking Tool을 사용하지 않습니다.
- 개인정보를 판매하거나 제3자 광고를 위해 제공하지 않습니다.
- Payment card 정보를 수집하지 않습니다.

각 설명은 제품 불변 조건입니다. 향후 상충하는 처리를 제안하면 수집 전에 Guide,
Just-in-time 안내, 방침 및 법적 근거를 갱신하고 승인해야 합니다. 단계적 배포 중
거짓 안심 문구를 그대로 두면 안 됩니다.

## 정보 계층

다음 Source order를 사용합니다.

1. 페이지 정체성, `Last updated` 및 `Effective` 날짜
2. 간결한 한눈에 보기
3. 페이지 목차 내비게이션
4. 운영자, 범위 및 계정 연령 자격
5. 데이터 범주, 출처, 목적, 필수·선택 의미 및 법적 근거
6. 공개 표시와 사용자 제어 Visibility
7. 보존, 삭제, Backup 및 고아 Upload cleanup
8. 처리자, 국외 이전, 독립 외부 서비스 및 외부 콘텐츠
9. Cookie와 기기 내 저장소
10. 개인정보 권리와 제어 경로
11. 보안 조치 및 침해·연락 정보
12. 방침 변경, 이력 및 이전 버전

최종 법률 검토된 방침이 적용 법률을 위해 Section을 나누거나 이름을 바꿀 수 있지만,
이 사용자 질문 순서와 검증된 제품 사실을 보존해야 합니다.

## 한눈에 보기 계약

### 목적

첫 계층은 간결한 안내이며 Icon-only 법률 요약이나 동의 Banner가 아닙니다.
아무것도 펼치지 않고 이해할 수 있어야 합니다.

### 필수 콘텐츠

네 개의 간결한 그룹을 사용합니다.

1. **NosLog가 사용하는 정보:** Discord 기본 신원, NosLog Profile 설정,
   사용자가 의도적으로 연동한 NOSTALGIA 기록, 제출·커뮤니티 활동 및 필수 서비스 Log
2. **공개되는 정보:** 승인된 공개 Profile, 기록, Ranking, 평가 및 사용자가 제어하는
   다섯 개 신원·활동 그룹
3. **NosLog가 수집하지 않는 정보:** 인증정보, Local audio, 정확한 위치,
   광고·행동 Analytics, 결제 정보 및 광고를 위한 판매
4. **사용자 제어:** 설정, 공개 범위, 계정 삭제, 개인정보 이메일 및 방침 이력

### 표현 규칙

- Plain text가 의미를 전달하며 Icon은 보조할 수 있지만 Label을 대체하지 않습니다.
- 해결되지 않았거나 복합적인 처리 위에 초록색 `안전` Badge를 두지 않습니다.
- `100% 안전`과 같은 절대적인 보안 주장을 사용하지 않습니다.
- 각 그룹은 대응하는 전체 Section으로 연결합니다.
- 상세 Provider, 국외 이전 및 보존 정보가 이어진다는 짧은 안내를 둡니다.
- 세 언어 모두 간결해야 하며 세로로 Reflow할 수 있습니다.

## 전체 방침 콘텐츠 계약

### 1. 운영자, 범위 및 계정 자격

- NosLog가 KONAMI와 제휴하지 않은 비공식 NOSTALGIA 기록·랭킹·Archive·
  채보 Editor·Viewer 서비스임을 알립니다.
- 방침이 다루는 Website, Locale route, 계정 기능, API 및 사용자 제출 범위를 정의합니다.
- 만 14세 이상 계정 규칙과 공개 탐색 대안을 명시합니다.
- 서비스 운영자를 Discord, KONAMI/BEMANI, Vercel, Neon, Kakao 및 X와 구분합니다.
- 개인정보 연락 Email을 표시합니다.
- **출시 차단 조건:** 최종 개인정보처리자·운영자 성명 또는 승인된 담당 부서 신원과
  법적으로 필요한 주소, 전화번호, 책임자, 신고 기관 또는 대리인은 법률 검토와
  사용자의 명시적 승인 없이 확정할 수 없습니다.

### 2. 데이터 범주, 출처, 목적 및 근거

각 범주에 다음을 공개합니다.

- 구체적이거나 의미 있게 묶은 Field
- Discord, 사용자 직접 입력, 의도적인 BEMANI Bookmarklet sync, 제품 사용,
  관리자 검토 또는 자동 Infrastructure 운영 중 어느 출처인지
- 처리 목적
- 요청한 계정·기능에 필수인지 선택인지
- 보존 규칙 또는 해당 보존 행으로 가는 직접 링크
- 공개될 수 있는지 여부
- 법률 검토된 처리 근거

구분 없는 `서비스 개선` 목적 하나로 묶지 않습니다. 현재 NosLog는 개인 활동을
광고나 광범위한 행동 Analytics에 사용하지 않으며 방침도 그 가능성을 추측으로
예약하지 않습니다.

### 3. 공개 데이터와 공개 범위

- NosLog가 일부 공개 기록·비교 서비스임을 설명합니다.
- 승인된 프로필 기획서에 따라 상시 공개 그룹과 사용자 제어 그룹을 열거합니다.
- 각 기능의 승인 계약이 요구하면 Ranking, 서열 투표, 채보 평가 및 Reaction이
  사용자의 공개 NosLog 신원과 연결될 수 있음을 설명합니다.
- 공개 Avatar가 Public Blob에 저장되고 Profile, Ranking, Comment 또는 생성된
  Share artifact에 나타날 수 있음을 설명합니다.
- Field를 숨기면 이후 Public payload와 Share artifact에서 제외되지만 기저 Account
  field 자체가 삭제되는 것은 아님을 설명합니다.
- 숨긴 Field는 방문자에게 `비공개` Placeholder로 보이지 않고 생략합니다.
- Field를 처음 공개하기 전에 공개 범위 선택을 제공하고 설정에서 계속 바꿀 수 있어야 합니다.

### 4. 보존 및 삭제

- 탐색 가능한 범주·목적·보존 Table 또는 접근 가능한 Reflow equivalent를 사용합니다.
- 활성 계정 데이터, 불변·누적 기록 이력, 공개 기여 데이터, 비공개 제출,
  임시 Upload control, Session cookie, 언어 Cookie, 기기 선호, Provider log,
  Backup 및 고아 Upload를 구분합니다.
- 승인된 6개월 Feedback·Exam 규칙을 보존합니다.
- 계정 삭제를 활성 NosLog System과 연결된 알려진 Upload의 삭제로 설명하되,
  검증된 Backup·Provider 만료 및 좁게 적용되는 법적 보존을 반영합니다.
- Backup, CDN 및 Provider 동작을 확인하고 법률 검토하기 전에는
  `모든 곳에서 즉시 영구적으로 복구 불가`라고 쓰지 않습니다.
- 열린 Feedback·검토 중 Exam evidence가 해결·검토와 승인된 기간까지 남는지,
  계정 삭제까지만 남는지 명시합니다.
- 의미 있는 Record history는 계정 삭제 때까지 유지하며 UI의 5개 Preview는
  보존 한도가 아님을 명시합니다.
- 출시 전에 정확한 운영 Log 보존 기간 또는 정직하고 법적으로 유효한 결정 규칙을 둡니다.

### 5. 처리자 및 국외 이전

- 각 처리자마다 법인, 기능, 이전 범주, 목적, 국가·Region, 시점·방법, 보존 기간
  또는 결정 규칙 및 관련 Privacy·DPA 링크를 유지 관리합니다.
- 최소한 Vercel Hosting·Functions, Public·Private Vercel Blob 및 Neon Database
  처리를 Production 환경과 대조해 확인합니다.
- `sin1`, `icn1` 같은 배포 Code를 사람이 읽는 국가와 현재 Dashboard 근거 없이
  영구 법률 사실처럼 취급하지 않습니다.
- Infrastructure를 바꾸는 Release마다 Provider Subprocessor와 Region 설정을 재확인합니다.
- NosLog를 대신한 처리와 독립 서비스의 자체 처리를 구분합니다. 최종 분류는 법률 검토가 필요합니다.

### 6. 독립 외부 서비스와 콘텐츠

- 최소 `identify` Scope와 Discord 자체 방침을 포함해 Discord OAuth·신원 조회를 설명합니다.
- 사용자가 시작하는 p.eagate Bookmarklet 경로와 KONAMI/BEMANI가 자체 약관으로
  공식 사이트 Session을 처리함을 설명합니다.
- 지도를 Loading할 때 Kakao Maps에 전달되는 연결 Metadata를 설명합니다.
- 제공되는 Do Not Track option을 켰더라도 Widget Loading 시 X가 처리하는 정보와
  공식 X Widget을 설명합니다.
- 사용자 Browser가 직접 접속하는 주요 Remote media 출처를 식별합니다.
- 명확한 이름으로 Provider policy link를 제공하되, 외부 Link 때문에 NosLog가 해당
  제공자와 제휴하거나 제공자의 처리에 책임지는 것처럼 표현하지 않습니다.
- 법률 검토 결과 비필수 Embed에 동의나 사용자 시작 Loading이 필요하면 Request가
  발생하기 전에 승인된 Gate를 최종 디자인에 포함합니다.

### 7. Cookie와 기기 내 저장소

최소한 다음을 구분합니다.

| 기술                  | 현재 목적                            | 현재 기간·삭제 동작                      | 차단 영향                                |
| --------------------- | ------------------------------------ | ---------------------------------------- | ---------------------------------------- |
| `user_session_cookie` | 필수 로그인 Session 및 OAuth state   | 현재 보안 설정에서 최대 14일             | Login과 계정 기능이 동작하지 않음        |
| `noslog-locale`       | 비로그인 및 경로 언어 선호           | 최대 1년                                 | 경로·계정·Browser 결정으로 언어가 대체됨 |
| `noslog-theme`        | 기기 내 Theme 선호                   | 변경하거나 Browser storage를 지울 때까지 | 기본 Theme 사용                          |
| Metronome volume      | 기기 내 채보 Viewer·Editor 음량 선호 | 변경하거나 Browser storage를 지울 때까지 | 기본 음량 사용                           |
| Strict Performance    | 기기 내 채보 Viewer 연주 해석        | 변경하거나 Browser storage를 지울 때까지 | 기본 Viewer 동작 사용                    |

- 모든 기기 저장소를 Cookie라고 부르지 않습니다.
- 승인된 계약에서 Local storage 값은 NosLog 계정과 Sync되지 않음을 설명합니다.
- 필수·선호 저장소가 있다는 이유만으로 Cookie banner를 표시하지 않습니다.
  제3자 Embed가 별도 동의를 요구하는지는 법률 검토로 정합니다.
- 방침을 Browser 사용 설명서로 만들지 않으면서 실용적인 삭제 안내 또는 유지 관리되는
  Browser 안내 Link를 제공합니다.

### 8. 권리와 제어

- 직접 제어에는 Profile·Settings 편집, 다섯 공개 범위 그룹, 언어·번역 제목 선호,
  Logout 및 영구 계정 삭제가 포함됩니다.
- 제품이 자동으로 완료하지 못하는 법적으로 적용 가능한 접근·정정·삭제·제한 등의
  요청에는 이메일을 사람 처리 경로로 유지합니다.
- 2.0에 One-click 원시 Data export를 약속하지 않습니다. 신원 확인 후 법적 접근
  요청을 일반적으로 사용할 수 있는 형식으로 수동 이행할 수 있습니다.
- 관련 없는 인증정보나 Discord Password를 요구하지 않는 필요한 신원 확인을 설명합니다.
- 법률 검토로 올바른 의무와 운영 능력을 확인한 뒤에만 예상 응답 기간을 명시합니다.
- 로그인 사용자는 승인된 파괴 Flow로 계정 삭제를 직접 연결하고, 비로그인 독자는
  안전한 Return을 포함한 Login을 받습니다.
- 계정 삭제는 NosLog 계정과 저장된 NosLog 데이터를 지우며 Discord나 KONAMI 계정을
  삭제하지 않음을 설명합니다.

### 9. 보안 및 사고 정보

- 암호화 전송, HTTP-only Session, 권한 검사, Private evidence storage, 형식·용량 검증,
  Rate limit, 최소 권한 운영자 접근, 보존 Cleanup 및 실제 사용하는 Dependency·
  Infrastructure practice를 이해 가능한 범주 수준으로 설명합니다.
- Secret, 정확한 Attack surface 또는 근거 없는 인증 주장을 공개하지 않습니다.
- Private Blob 접근을 침해 불가능과 동일시하지 않습니다.
- 개인정보·보안 연락 경로와 법률 검토 후 필요한 감독 기관·신고 경로를 제공합니다.
- 중대한 사고 통지 약속은 Incident response process와 일치해야 하며 시각 문구에서
  임의로 만들지 않습니다.

### 10. 변경 및 버전 이력

- `Last updated`와 `Effective`를 별도 Label 날짜로 표시합니다.
- 안정적인 Locale-aware URL 또는 동등한 Version artifact로 이전 방침을 보존합니다.
- 현재 페이지는 Version, 시행일 및 간결한 변경 요약을 가진 시간순 History로 연결합니다.
- 중대한 변경은 가능한 경우 시행 전에 NosLog 서비스 공지로 알립니다. 계정 Email을
  수집하지 않으므로 이메일 통지를 약속하지 않습니다.
- 오탈자 수준 번역 수정은 새 처리 관행처럼 보이지 않게 `Last updated`만 바꿀 수 있고,
  중대한 변경은 새 Effective version을 가집니다.
- Archive version은 Read-only이며 대체된 상태임을 명확히 표시합니다.

## 상호작용 및 내비게이션 계약

### 페이지 내 내비게이션

- 모든 최상위 전체 방침 Section에 설명적인 Link를 작성하거나 생성합니다.
- Compact layout은 상단 근처에 간결한 `이 페이지에서` Disclosure 하나를 둡니다.
  Link 목록은 접을 수 있지만 방침 Section 자체는 접지 않습니다.
- Wide layout은 Content column에 충분한 공간이 있을 때 지속되는 Side navigation을
  사용할 수 있습니다. Sticky 동작은 Header, Focus target 또는 Section heading을
  가리면 안 됩니다.
- 활성 Section 표시는 Label을 보조하며 대체하지 않습니다.
- Anchor navigation은 접근 가능하게 Focus 또는 Reading context를 갱신하고 Reduced
  motion을 존중합니다.
- Copy 수정 때 문맥 Link가 깨지지 않도록 각 Heading은 안정적인 Locale별 또는
  언어 중립 Anchor 계약을 가집니다.

### 행동과 링크

- 주요 Utility action은 로그인 사용자의 `설정 열기`와 모든 사용자의 `개인정보 문의`이며,
  둘 다 방침 자체보다 시각적으로 우선하지 않습니다.
- `계정 삭제`는 방침 페이지의 파괴 Button이 아니라 설정으로 가는 문맥 Link입니다.
- 외부 Provider policy는 목적지 이름과 일반적인 외부 Link 처리를 사용합니다.
- `이전 버전`은 내부 목적지로 유지합니다.
- 일반 Header와 Footer가 Home을 제공할 때 중복되는 Full-width `홈으로 돌아가기`를
  유지하지 않습니다. 최종 공통 셸 Pattern이 일관되게 요구할 때만 문맥 보존형 Compact
  Back link를 사용할 수 있습니다.

## 반응형 레이아웃 계약

### Compact layout

- 대표 390px에서 먼저 검증하고 320 CSS px까지 확인합니다.
- Page identity, 한눈에 보기 그룹, Compact 목차 Disclosure 및 모든 방침 Section을
  Source order로 둔 한 열을 사용합니다.
- Card, Table, Provider detail, Date, Email, URL 및 긴 한국어·일본어·영어 용어가
  문서 수준 가로 Scroll 없이 줄바꿈됩니다.
- 넓은 Legal table은 일상적인 2차원 Scroll을 강제하지 않고 Label row 또는
  Description group으로 재구성합니다.
- 전체 Text를 선택·검색·확대·인쇄할 수 있습니다.

### Wide layout

- 현재의 고정 390px Desktop column을 유지하지 않습니다.
- 방침 본문은 편안한 장문 Reading measure를 사용하고, 둘 다 본문을 압축하지 않고
  들어갈 때만 별도 Contents column을 사용합니다.
- 넓은 공간은 내비게이션, 보존·Provider 비교 및 탐색에 사용하며 장식용 빈 Panel이나
  Marketing content에 사용하지 않습니다.
- 정확한 Container width, Column 비율, Gap 및 Sticky transition은 영어 최장
  콘텐츠로 검증할 이후 Foundation·Claude Design 결정입니다.
- 일반 공통 Header·Footer 정렬은 유지하면서 방침 Body에 맞는 Editorial container를
  허용합니다.

### 인쇄 및 Text 확대

- 인쇄 결과는 전체 콘텐츠 흐름 하나, 보이는 URL 또는 유용한 Link text,
  Effective·Version date를 포함하고 Sticky nav나 숨은 Section이 없어야 합니다.
- 200%·400% Zoom에서도 실제로 2차원이 필요한 콘텐츠를 제외하고 콘텐츠와 Control을
  2차원 Scroll 없이 보존합니다.
- Text spacing override가 Section title, Provider name, Date 또는 Link를 자르지 않습니다.

## 상태 계약

| 상태                                 | 필수 결과                                                    | 금지 결과                          |
| ------------------------------------ | ------------------------------------------------------------ | ---------------------------------- |
| 현재 방침 사용 가능                  | 요약, 전체 방침, 날짜, 연락처 및 이력 접근                   | 전체 Text 없는 요약                |
| 이전 버전 없음                       | 이력을 숨기거나 없음을 간결히 설명                           | 빈 Archive 장식 또는 가짜 Version  |
| Archive 버전                         | Version과 대체 상태를 가진 Read-only 전체 Copy               | 현재 버전처럼 보이는 Control       |
| 비로그인                             | 전체 방침, Email, 공개 Home 및 계정 제어를 위한 문맥형 Login | 인증 뒤에 방침 차단                |
| 로그인                               | 같은 방침과 Settings·계정 제어 Link                          | 로그인 여부에 따라 다른 법적 의미  |
| Build·출시 시 Provider detail 미확정 | 출시 차단 또는 법률 검토한 진실한 결정 규칙                  | Region·보존 기간 추측              |
| 다국어 Copy 법률 동기화 안 됨        | 해당 Locale Phase 미승인 및 출시 차단                        | 요약 또는 Machine-only 근사본 출시 |
| 방침 Rendering 실패                  | Plain 전체 Fallback 또는 일반 복구 가능 System error         | Blank page 또는 Home redirect      |
| 외부 Provider link 실패              | 방침은 읽히며 실패한 외부 목적지를 식별                      | NosLog 자체 공개를 숨김            |

방침은 일반적으로 Versioned local content에서 Server rendering하며 Loading skeleton이
필요하지 않습니다. 핵심 개인정보 의미를 Client request나 제3자 Script에 의존하게
하지 않습니다.

## 접근성 계약

- 설명적인 `h1` 하나, 순차적 Section heading 및 법률 번호만 반복하지 않고 목적을
  설명하는 Subsection heading을 사용합니다.
- 전역 건너뛰기 Link와 `main` Landmark 하나를 보존합니다.
- 페이지 내 내비게이션은 Label이 있는 `nav`이며 현재 Link는 Color-only 의미 없이
  `aria-current` 또는 동등한 Text state를 사용합니다.
- Header가 Anchor target을 가리지 않도록 충분한 Scroll margin을 둡니다.
- Link는 Text 또는 Programmatic context로 목적지를 알립니다. 반복되는 무표식
  `더 알아보기` Link를 피합니다.
- 연락 정보는 주소가 Text로 보이면서 실제 `mailto:` Semantics를 사용합니다.
- Data category·Retention 관계가 표 형식일 때만 Semantic table을 사용하고 Compact
  Reflow에서도 Header association을 보존합니다.
- Icon, Color, Label 및 Status chip 중 어느 하나만으로 법률 의미를 전달하지 않습니다.
- Scroll에 따라 활성 목차가 바뀐다는 이유로 Focus를 이동시키지 않으며 Focus는 보입니다.
- Smooth anchor scroll과 Active-section transition에서 Reduced motion을 존중합니다.
- Reflow, Resize Text, Text Spacing, Contrast, Headings and Labels, Focus,
  Link Purpose, Language of Page/Parts 및 Status Messages 관련 WCAG 2.2 AA를 충족합니다.

## 다국어 및 법률 문구 계약

- 한국어·일본어·영어는 같은 실질적 범주, 목적, 보존, 공개 결과, Provider fact,
  권리, 연령 규칙, 날짜 및 출시 제한을 제공합니다.
- 출시 전에 사람이 검토한 법률 번역을 사용합니다. Machine translation은 초안을
  만들 수 있지만 최종 기준이 아닙니다.
- `user_session_cookie`, `noslog-locale`, `Discord`, `NOSTALGIA`, `BEMANI`,
  Provider name 및 Region code처럼 번역하면 구현 Mapping이 모호해지는 식별자는 보존합니다.
- `Basic`, `Recital`, `Grd`, `NosLog Rating` 및 기타 승인된 Domain term 주변에는
  다국어 설명 Label을 사용합니다.
- Provider 법인명, 국가, 날짜 및 Email은 언어마다 다른 사실로 번역하면 안 됩니다.
- 긴 영어 Provider·Purpose 설명, 줄바꿈이 어려운 일본어 용어 및 한국어 법률 합성어를
  반응형 Test에 포함합니다.
- **미확정 / 출시 차단 조건:** 법적으로 우선하는 언어가 필요한지, 그 관계를 어떻게
  공개할지 법률 검토로 정합니다. 영문 디자인 문서 원본이나 한국어 제품 Copy를
  자동으로 법적 우선 언어라고 선언하지 않습니다.

## 디자인 Specimen용 데이터 및 콘텐츠 요구사항

다음 대표 콘텐츠가 필요합니다.

1. 390px 비로그인 한국어 방문자
2. 다섯 선택 Profile group을 모두 숨긴 로그인 일본어 사용자
3. 모든 선택 Profile group을 공개한 로그인 영어 사용자
4. 별도 수정일·시행일을 가진 현재 및 Archive 방침
5. 긴 법인명, 국가, Region, Data list, 이전 시점 및 보존 설명을 가진 Provider 하나
6. 긴 보존 Row 하나와 정직한 미확정·Log 결정 규칙 Specimen 하나
7. Session cookie, 언어 Cookie 및 Local-storage preference
8. 검증된 비수집 그룹 전체
9. 긴 Provider URL이 있고 가로 Overflow가 없는 320px Specimen
10. 목차 내비게이션과 Editorial reading measure가 있는 1280px Wide layout
11. Print layout
12. 대체된 Item이 하나 이상 있는 이전 버전 이력

`Lorem ipsum`, 추측한 Provider region, 가상의 법적 이름 또는 축약한 영어 전용 Copy로
페이지를 검증하지 않습니다.

## 구현 매핑

| 승인 요구사항             | 현재 Source                                                                                                                                              | 후속 변경                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 공개 다국어 Privacy route | [`app/(nevigation)/privacy/page.tsx`](<../../app/(nevigation)/privacy/page.tsx>)                                                                         | 경로와 Metadata를 보존하고 고정 단일열 구성을 Versioned structured policy content로 교체                                 |
| Footer 접근               | [`components/layout/footer.tsx`](../../components/layout/footer.tsx)                                                                                     | 전역 공개 Link와 다국어 목적지 보존                                                                                      |
| Login 문맥 안내           | [`app/(auth)/login/page.tsx`](<../../app/(auth)/login/page.tsx>) 및 인증 기획서                                                                          | Heading별 Privacy link와 간결한 데이터·연령 Context 유지                                                                 |
| 계정 제어와 삭제          | [`app/(nevigation)/profile/settings/securityActions.ts`](<../../app/(nevigation)/profile/settings/securityActions.ts>)                                   | 검증된 삭제 순서를 보존하고 Copy를 활성 System·Backup 사실과 일치시킴                                                    |
| 다섯 공개 범위 그룹       | 프로필·설정 기획서, [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                 | 선호 오락실·Play activity Control을 추가하고 Public payload·Cache 누출 방지                                              |
| Discord 데이터 경계       | [`app/(auth)/discord/start/route.ts`](<../../app/(auth)/discord/start/route.ts>) 및 [`complete/route.ts`](<../../app/(auth)/discord/complete/route.ts>)  | `identify`만 사용하고 Access token을 저장하지 않으며 정확한 안내 제공                                                    |
| BEMANI Sync source        | [`lib/bookmarklet.ts`](../../lib/bookmarklet.ts), 수신 Route 및 Data Sync 기획서                                                                         | 사용자 시작 Source, Payload, 서명 Token 및 인증정보·Session cookie 비수집 설명                                           |
| 활성 보존 Cleanup         | [`lib/privacyRetention.ts`](../../lib/privacyRetention.ts) 및 [`app/api/cron/privacy-retention/route.ts`](../../app/api/cron/privacy-retention/route.ts) | 6개월 규칙 보존, 운영 Monitoring 및 Policy version 근거 추가                                                             |
| Public·Private upload     | [`lib/blob.ts`](../../lib/blob.ts) 및 Upload action                                                                                                      | 접근 분리를 보존하고 고아 Cleanup·Provider 삭제 Lifecycle 보장                                                           |
| Cookie inventory          | [`lib/session.ts`](../../lib/session.ts), [`lib/i18n/routing.ts`](../../lib/i18n/routing.ts) 및 [`proxy.ts`](../../proxy.ts)                             | Session과 1년 Locale cookie를 정확히 공개                                                                                |
| 기기 내 선호              | [`app/layout.tsx`](../../app/layout.tsx), 채보 Viewer preference hook                                                                                    | Theme, Metronome volume, Strict Performance를 Server sync처럼 표현하지 않고 공개                                         |
| 외부 Widget·Map           | [`components/home/officialXTimeline.tsx`](../../components/home/officialXTimeline.tsx) 및 [`lib/kakaoMaps.ts`](../../lib/kakaoMaps.ts)                   | 정확한 외부 서비스 안내와 법률 검토 후 필요한 Load gate 추가                                                             |
| Infrastructure region     | [`vercel.json`](../../vercel.json), Production dashboard, Provider contract                                                                              | 출시 전에 사람이 읽는 국가, Region, Subprocessor, Log, Backup 및 Retention 검증                                          |
| Policy history            | 현재 경로 없음                                                                                                                                           | Versioned current·history Data source와 Locale-aware Archive 목적지 추가                                                 |
| Test                      | 기존 Privacy retention, 계정 삭제, 다국어 및 E2E Suite                                                                                                   | Content schema, 데이터 처리 일치, Version, 연령 안내, 공개 Field, Keyboard, Reflow, Print 및 Locale parity Coverage 추가 |

## 출시 전 개인정보 차단 조건

| ID       | 필요한 해결                                                                                                   | 담당·근거                                            | 상태             |
| -------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------- |
| PRIV-B01 | 사용자의 명시적 승인 전 실제 성명을 공개하지 않으면서 법적으로 충분한 개인정보처리자·운영자 신원 및 연락 정보 | 사용자 결정과 자격 있는 한국·국제 개인정보 법률 검토 | `출시 차단 조건` |
| PRIV-B02 | 적용 법적 근거, 동의 시점, 신고 기관, 권리 처리 기간 및 지원 관할 의무                                        | 자격 있는 법률 검토                                  | `출시 차단 조건` |
| PRIV-B03 | Vercel 운영 Log의 정확한 Field와 Retention                                                                    | Production plan·Dashboard 및 Vercel 문서             | `출시 차단 조건` |
| PRIV-B04 | Neon Point-in-time history, Backup, 삭제 및 Singapore 처리의 정확한 사실                                      | Production Neon project와 DPA·Subprocessor 근거      | `출시 차단 조건` |
| PRIV-B05 | Public·Private Blob의 정확한 Region, Cache·삭제 Lifecycle 및 고아 Upload cleanup                              | Production Blob dashboard, Lifecycle 구현 및 Test    | `출시 차단 조건` |
| PRIV-B06 | 최신 처리자·Subprocessor, 국가, 이전 및 Retention register                                                    | Production vendor contract와 Release checklist       | `출시 차단 조건` |
| PRIV-B07 | X·Kakao·기타 비필수 외부 Load의 동의 또는 Just-in-time 안내 요건                                              | 법률 검토와 Network·Browser 근거                     | `출시 차단 조건` |
| PRIV-B08 | 법률 검토된 한국어·일본어·영어의 실질적 동등성과 우선 언어 조항                                               | 사람의 법률 번역 검토                                | `출시 차단 조건` |
| PRIV-B09 | 만 14세 이상 계정 안내와 법적으로 충분하고 Dark pattern이 아닌 자격 확인 방식                                 | 법률 검토, 인증 디자인 및 E2E                        | `출시 차단 조건` |

Placeholder를 Styling했거나 현재 방침에 비슷한 문장이 있다는 이유만으로 차단 조건을
`승인`으로 바꾸면 안 됩니다.

## 브라우저 및 QA 인수 조건

향후 구현은 다음을 검증해야 합니다.

1. `/ko/privacy`, `/ja/privacy`, `/en/privacy`가 의도대로 공개·Index되고 같은 핵심
   Section set을 공유합니다.
2. Footer, Login 안내 및 계정 삭제 Context가 올바른 Locale 방침이나 Heading을 엽니다.
3. 현재 Version은 `Last updated`와 `Effective`를 별도로 표시합니다.
4. 이전 Version은 안정적이고 Read-only·Localized이며 대체된 상태로 표시됩니다.
5. 한눈에 보기 Link가 Heading을 가리지 않고 대응하는 전체 Section에 도달합니다.
6. Compact 목차를 Keyboard로 조작할 수 있고 Section을 하나씩 펼치지 않아도 전체
   방침을 사용할 수 있습니다.
7. Wide 목차가 올바른 Reading·Focus order를 가지며 Text를 가리지 않습니다.
8. 320·360·390·중간·Tablet·대표 Desktop width에서 일반적인 2차원 Page scroll이 없습니다.
9. 한국어·일본어·영어의 긴 Provider, Retention, Cookie 및 Contact value가 잘리지 않고
   줄바꿈됩니다.
10. 200%·400% Zoom, Text spacing, Reduced motion 및 Keyboard-only 사용에서 전체
    방침이 보존됩니다.
11. Screen reader로 Heading outline, 목차 `nav`, Retention 관계, External link 및
    Contact information을 탐색할 수 있습니다.
12. 비로그인 독자가 Login 없이 전부 읽고 운영자에게 연락할 수 있습니다.
13. 로그인 Settings·삭제 Link가 안전한 Locale return을 사용합니다.
14. 공개 데이터 안내가 다섯 공개 범위 Control 전체의 실제 API, Profile, Ranking,
    Community 및 Share payload와 일치합니다.
15. Discord scope·저장 Field가 공개 Identity list와 일치하고 Access token,
    Password 또는 요청하지 않은 Provider field를 저장하지 않습니다.
16. Local chart audio가 NosLog Upload request, Server log payload 또는 Database
    object에 나타나지 않습니다.
17. Session·Locale cookie 이름, 기간 및 실패 영향이 Production과 일치합니다.
18. Local-storage preference는 기기에만 남고 삭제하면 설명한 기본 동작을 사용합니다.
19. Retention test가 Feedback·Exam 기한, 활성 계정 삭제, Blob 처리 및 Orphan cleanup을
    입증합니다.
20. Production 근거가 현재 Region, Processor, Subprocessor, Log retention,
    Backup retention 및 External embed 동작을 기록합니다.
21. Analytics, 광고 또는 Tracking request가 승인된 비수집 설명과 충돌하지 않습니다.
22. 계정 생성 전에 연령 기준을 표시하고 만 14세 미만 계정이 일반 Account flow를
    조용히 완료할 수 없습니다.
23. X·Kakao·Discord 또는 Provider policy link가 없어도 페이지 자체는 완전합니다.
24. 인쇄 결과가 전체 방침 의미, 날짜, 연락처 및 Version identity를 포함합니다.

Lint, Typecheck, Unit test 및 Build는 필요하지만 Network, Storage, Locale,
Public visibility, Screen reader, Print 및 반응형 Browser 검증을 대체하지 않습니다.

## 레퍼런스 매트릭스

| 출처                                                                                                                                                                                                                                      | 가져올 원칙                                                                           | NosLog 적용                                   | 한계                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------- |
| [개인정보보호위원회: 2026 개인정보 처리방침 작성지침 목록](https://www.privacy.go.kr/front/bbs/bbsList.do?bbsNo=BBSMSTR_000000000049)                                                                                                     | 최신 한국 개인정보처리방침 작성 기준 사용                                             | 출시 법률 문구 Checklist를 최신 지침에서 시작 | 목록은 NosLog 사실에 대한 자격 있는 검토를 대체하지 않음 |
| [대한민국 개인정보 보호법](https://law.go.kr/lsInfoP.do?lsId=011357)                                                                                                                                                                      | 적용되는 목적·보존·제공·삭제·처리자·권리·연락·자동 수집·국외 이전 공개                | 전체 방침 Core inventory 정의                 | 정확한 적용과 근거는 법률 검토 필요                      |
| [개인정보보호위원회 2025 지침 배포](https://m.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=11133)                                                                                                       | 필수·권고 사항, 법적 근거, 접근 가능한 진입점, 권리 및 행태 정보 구분                 | Footer+문맥 링크와 구체적 Data·Basis row 지원 | 변경된 세부사항은 2026 지침 우선                         |
| [일본 PPC APPI 통칙 지침](https://www.ppc.go.jp/personalinfo/legal/guidelines_tsusoku/)                                                                                                                                                   | 일본 밖 서비스도 일본 거주자와 실제 처리를 고려할 수 있음                             | 일본어 법률 검토와 동등한 실질 안내의 근거    | 한국 개인정보처리자 의무를 결정하지 않음                 |
| [일본 PPC 외국 이전 지침](https://www.ppc.go.jp/personalinfo/legal/guidelines_offshore/)                                                                                                                                                  | 외국 수령자, 목적, 보호조치 및 국가 정보의 구체성                                     | 유지 관리되는 Provider·Transfer 사실 지원     | 정확한 적용은 서비스 역할·Flow에 따름                    |
| [European Commission: information to individuals](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/what-information-must-be-given-individuals-whose-data-collected_en)         | 신원, 목적, 범주, 근거, 보존, 수령자, 이전, 권리 및 출처 명료화                       | 구조화된 전체 공개 지원                       | EU 적용 여부는 법률 검토 대상                            |
| [European Commission: data-processing principles](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/principles-gdpr/overview-principles/what-data-can-we-process-and-under-which-conditions_en) | 목적 제한, 최소화, 정확성 및 투명성이 수집을 제한                                     | 검증된 비수집·비추측 목적 지원                | UI Layout은 정의하지 않음                                |
| [EDPB endorsed transparency guidelines](https://www.edpb.europa.eu/endorsed-wp29-guidelines_en)                                                                                                                                           | 투명성은 간결하고 이해 가능하며 접근 가능하고 구체적이어야 함                         | 계층형이되 완전한 방침 지원                   | 유럽 지침만이 적용 법은 아님                             |
| [ICO: methods for privacy information](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-methods-can-we-use-to-provide-privacy-information/)                            | 상위 계층에서 신원·수집·목적을 요약하고 전체 상세 제공                                | 한눈에 보기+전체 Section 지원                 | 영국 예시는 한국 법률 충족을 결정하지 않음               |
| [ICO privacy-notice checklist](https://ico.org.uk/media/for-organisations/documents/1625126/privacy-notice-checklist.pdf)                                                                                                                 | 실제 Data, 목적, 향후 사용, 결과, 접근, 보안 및 비사용 Inventory                      | Code-to-policy 일치 Audit 지원                | 관할별 검토가 여전히 필요                                |
| [OECD Privacy Principles](https://www.oecd.org/en/topics/sub-issues/privacy-principles.html)                                                                                                                                              | 수집 제한, 목적, 보안, 공개, 참여 및 책임의 지속적 체계                               | 개인정보를 Engineering lifecycle로 취급       | 직접적인 페이지 문구 요구는 아님                         |
| [FTC Data Security](https://www.ftc.gov/business-guidance/privacy-security/data-security)                                                                                                                                                 | 필요한 것만 수집·보호하고 안전하게 폐기                                               | Orphan, Log, Backup 차단 조건 지원            | 미국 집행 범위는 다름                                    |
| [California CPPA general notices](https://cppa.ca.gov/pdf/general_notices.pdf)                                                                                                                                                            | 수집 지점 가까이 범주, 목적, 판매·공유 및 보존을 안내                                 | 문맥형 Just-in-time link 지원                 | CCPA 적용은 법률 검토 필요                               |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                                                                                 | Reflow, Heading, Link purpose, Focus, Language 및 Text spacing이 법률 콘텐츠에도 적용 | 320px와 접근 가능한 Reading 요구 설정         | 방침 문구를 지정하지 않음                                |
| [W3C Headings tutorial](https://www.w3.org/WAI/tutorials/page-structure/headings/)                                                                                                                                                        | Semantic heading이 구조 전달과 탐색 지원                                              | 현재 Heading outline 보존·확장                | 시각 계층 Token을 정하지 않음                            |
| [USWDS In-page navigation](https://designsystem.digital.gov/components/in-page-navigation/)                                                                                                                                               | 장문은 Keyboard order를 고려한 검증된 Contents navigator가 유용                       | Compact·Wide TOC 동작 지원                    | 정부 Component styling은 NosLog 기준 아님                |
| [GOV.UK Footer](https://design-system.service.gov.uk/components/footer/)                                                                                                                                                                  | 개인정보와 Cookie 정보는 안정적인 보조 위치에 둠                                      | Privacy를 Footer에 보존                       | 문맥형 수집 Link는 여전히 필요                           |
| [Discord OAuth2 and permissions](https://docs.discord.com/developers/platform/oauth2-and-permissions)                                                                                                                                     | `identify`는 기본 Profile field를 허용하며 Scope 최소화                               | 정확한 Discord 공개 지원                      | Discord가 자체 인증 UI를 관리                            |
| [Discord User resource](https://docs.discord.com/developers/resources/user)                                                                                                                                                               | ID, Username, Global name, Avatar 및 Email은 Scope 동작이 다름                        | `identify`가 Email을 요구하지 않음을 확인     | Optional returned field는 바뀔 수 있음                   |
| [Discord retention guidance](https://support.discord.com/hc/en-us/articles/5431812448791-How-long-Discord-keeps-your-information)                                                                                                         | Provider 자체 Retention·Rights는 Provider policy에 두고 NosLog 약속으로 만들지 않음   | 역할 구분과 Provider link 지원                | Discord 자체 Data는 NosLog DB Data가 아님                |
| [Vercel Blob](https://vercel.com/docs/vercel-blob)                                                                                                                                                                                        | Public·Private store 접근은 실질적으로 다르고 Region은 선택 후 변경 불가              | Avatar·Evidence 구분과 Dashboard 검증 지원    | 정확한 NosLog Region은 배포별 사실                       |
| [Vercel Data Processing Addendum](https://vercel.com/legal/Vercel_Inc_-_Data_Processing_Addendum.pdf)                                                                                                                                     | Processor, Subprocessor, 삭제, 지원 및 국경 간 조건은 계약 근거로 유지                | Vendor register 지원                          | 계약 해석은 법률 검토 필요                               |
| [Neon subprocessors](https://neon.com/subprocessors)                                                                                                                                                                                      | Infrastructure provider는 자체 Subprocessor를 사용하고 목록 갱신                      | 유지 관리 Release register 요구               | 정확한 NosLog Project 설정을 말하지 않음                 |
| [Neon Security](https://neon.com/security)                                                                                                                                                                                                | Security·Transfer claim은 Provider evidence에 근거                                    | 정확한 High-level safeguard 지원              | Marketing·Security page가 DPA 검토를 대체하지 않음       |
| [Kakao Privacy](https://kakao.com/policy/privacy)                                                                                                                                                                                         | 기기, IP, Cookie 및 이용 정보가 Map·Service provider에서 처리될 수 있음               | 외부 Map 안내 지원                            | 정확한 Kakao Maps SDK Flow는 Network 검증 필요           |
| [GitHub General Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement)                                                                                                              | 시행일, 목차, 범주, 권리, 이전, 아동, 변경 및 번역이 장문 방침에 공존 가능            | 구조화된 전체 방침과 이력 지원                | GitHub의 규모·상업 목적은 전이하지 않음                  |
| [osu! Privacy Policy](https://osu.ppy.sh/legal/en/Privacy)                                                                                                                                                                                | 공개 Score, Ranking, Profile data, 계정 보안 및 게임 기록을 Game domain에 맞게 설명   | NosLog 공개 기록 결과 지원                    | osu! Anti-cheat·삭제 규칙은 전이하지 않음                |
| [현재 개인정보처리방침 구현](<../../app/(nevigation)/privacy/page.tsx>)                                                                                                                                                                   | 다국어 콘텐츠, 유용한 Semantic heading 및 기존 보존 약속                              | 구조를 개선하며 검증된 사실 보존              | 고정 너비·누락·미검증 주장은 2.0 기준 아님               |
| [현재 Schema](../../prisma/schema.prisma)                                                                                                                                                                                                 | 실제 신원, 기록, 진행, 제출, 평가, Sync 및 Visibility field를 드러냄                  | 일반적이거나 불완전한 범주 Copy 방지          | 향후 승인 Field는 Migration·방침 갱신 필요               |
| [현재 보존 구현](../../lib/privacyRetention.ts)                                                                                                                                                                                           | 6개월 Feedback·Exam 동작과 운영 실패 처리 입증                                        | 방침을 실행 가능한 삭제 Logic과 일치          | 모든 Provider backup·Orphan file은 다루지 않음           |

### 근거 수렴

- 한국·일본·유럽·OECD·미국 지침은 모호한 Boilerplate가 아니라 실제 데이터
  Inventory, 목적, 보존, 수령자, 권리, 보안 및 접근 가능한 연락처에 수렴합니다.
- 개인정보 콘텐츠 출처는 전체 방침이 유지되고 실질적으로 완전할 때만 계층형
  전달을 지지합니다.
- 접근성·Design system 출처는 장문에 Heading, 목차 내비게이션, Reflow,
  명확한 Link purpose 및 안정적인 Footer 접근이 필요하다는 데 수렴합니다.
- Provider 출처는 Scope, Storage access, Region, Subprocessor, Log 및 Retention이
  설정별 사실이며 지속 관리가 필요함을 확인합니다.
- 게임 레퍼런스는 Gameplay data를 일반 Private account setting처럼 취급하지 않고
  공개 Record·Ranking 결과를 명시하도록 지지합니다.
- 신뢰할 수 있는 출처 중 가상의 운영자 이름 추측, 법정대리인 체계 없는 만 14세 미만
  계정 허용, Backup 근거 없는 보편적 즉시 삭제 주장 또는 짧은 요약을 전체 방침으로
  취급하는 방향을 지지하는 것은 없습니다.

## 거절 및 대체된 대안

- **현재 Card wall만 유지 — 대체됨:** 전체 콘텐츠는 보존하되 한눈에 보기, 목차
  내비게이션 및 Wide editorial composition을 추가합니다.
- **전체 방침을 Icon·짧은 요약으로 교체 — 거절:** 첫 계층에 완전한 법률·운영 상세를
  담을 수 없습니다.
- **모든 Section을 기본으로 접기 — 거절:** 검색, Scanning, Print 및 전체 접근을
  방해합니다. Compact 목차 목록만 접을 수 있습니다.
- **Desktop을 390px로 고정 — 대체됨:** Mobile column 고정은 Wide screen에서
  불필요하게 긴 문서를 만듭니다.
- **광범위한 `수집할 수 있음` Boilerplate — 거절:** 실제 현재·승인된 처리만 공개하고
  새 처리를 추가하기 전에 갱신합니다.
- **모든 외부 조직을 같은 제3자로 처리 — 거절:** Processor, Identity provider,
  Independent embed, Official data source 및 External content 역할은 다르고 법적 분류가 필요합니다.
- **언어 Cookie와 Local storage 생략 — 거절:** 계정과 Sync되지 않아도 기기 지속성은
  이해 가능한 제품 동작의 일부입니다.
- **모든 곳에서 즉시 영구 삭제 주장 — 검증 전 거절:** Active deletion, Provider cache,
  Backup 및 History는 서로 다른 Lifecycle을 가집니다.
- **가상의 운영자 이름 공개 또는 실명 공개 동의 추정 — 거절:** 명시적 승인과 법률
  검토 전까지 운영자 신원은 출시 차단 조건입니다.
- **법정대리인 Infrastructure 없이 만 14세 미만 계정 허용 — 거절:** 공개 탐색은
  유지하지만 계정 자격은 만 14세부터입니다.
- **연령 규칙을 위해 생년월일을 기본 수집 — 거절:** 승인된 필요성·검증 계약 없이
  새 개인정보를 추가합니다.
- **방침 변경 이메일 약속 — 거절:** NosLog는 계정 Email을 수집하지 않으므로 서비스
  공지와 안정적인 Version history를 사용합니다.
- **2.0 원시 Data export Dashboard 추가 — 거절:** Settings와 사람 개인정보 요청이
  승인된 요구를 충족하며 법적 접근은 수동으로 지원할 수 있습니다.
- **Privacy를 더보기 안에 숨기기 — 거절:** Footer가 안정적인 전역 목적지이며 수집
  맥락에는 필요할 때 직접 Link를 추가합니다.
- **방침을 X·Kakao 등 제3자 Script에 의존 — 거절:** NosLog의 전체 공개는 외부
  Script 없이 Rendering돼야 합니다.

## 결정 기록

| ID      | 결정                                                                                              | 상태             |
| ------- | ------------------------------------------------------------------------------------------------- | ---------------- |
| PRIV-01 | 모든 Locale Prefix `/privacy` 경로에서 개인정보처리방침을 공개로 유지                             | `승인`           |
| PRIV-02 | Privacy를 일반 Footer에 두고 더보기에서 제외                                                      | `승인`           |
| PRIV-03 | Login, 삭제, Upload, Sync 및 주요 수집 지점에 문맥형 Privacy link 추가                            | `승인`           |
| PRIV-04 | 한눈에 보기 첫 계층과 전체 방침을 함께 사용                                                       | `승인`           |
| PRIV-05 | 페이지 내 내비게이션을 사용하고 전체 Section을 보이게 유지                                        | `승인`           |
| PRIV-06 | 별도 `Last updated`와 `Effective` 날짜 표시                                                       | `승인`           |
| PRIV-07 | 안정적인 이전 Version history 유지                                                                | `승인`           |
| PRIV-08 | NosLog 계정 생성·사용을 만 14세 이상으로 제한                                                     | `승인`           |
| PRIV-09 | 계정 없는 공개 탐색 보존                                                                          | `승인`           |
| PRIV-10 | 새 승인 계약 없이 만 14세 미만 법정대리인 Flow를 추가하지 않음                                    | `승인`           |
| PRIV-11 | 상시 공개 그룹과 사용자가 제어하는 다섯 Profile group을 명시                                      | `승인`           |
| PRIV-12 | 공개 Ranking, Community contribution 및 Share artifact 결과 설명                                  | `승인`           |
| PRIV-13 | 검증된 Discord·BEMANI Credential·Token 비수집 명시                                                | `승인`           |
| PRIV-14 | Local chart audio가 Server에 도달하지 않음을 명시                                                 | `승인`           |
| PRIV-15 | 정확한 위치, 광고, 행동 Analytics, 결제 정보, 판매·광고 공유를 하지 않음 명시                     | `승인`           |
| PRIV-16 | 검증된 비수집 설명을 변경 전 방침 개정이 필요한 제품 불변 조건으로 취급                           | `승인`           |
| PRIV-17 | Processor, 국외 이전, 독립 외부 서비스 및 Content source 역할 구분                                | `승인`           |
| PRIV-18 | Session과 Locale cookie 모두 공개                                                                 | `승인`           |
| PRIV-19 | Theme, Metronome volume 및 Strict Performance 기기 저장소 공개                                    | `승인`           |
| PRIV-20 | 6개월 Feedback·Exam 보존 규칙 유지                                                                | `승인`           |
| PRIV-21 | Preview 수를 Retention으로 보지 않고 계정 삭제까지 의미 있는 전체 기록 보존                       | `승인`           |
| PRIV-22 | Settings self-service와 Email 개인정보 요청 유지                                                  | `승인`           |
| PRIV-23 | 2.0에 원시 셀프서비스 Account data export를 추가하지 않음                                         | `승인`           |
| PRIV-24 | 약속한 Email이 아니라 서비스 공지와 이력으로 방침 변경 알림                                       | `승인`           |
| PRIV-25 | Semantic heading, 접근 가능한 TOC, 320px Reflow, Wide editorial layout 및 Print completeness 요구 | `승인`           |
| PRIV-26 | 한국어·일본어·영어 실질적 동등성 보존                                                             | `승인`           |
| PRIV-27 | 운영자 실명 공개를 보류하고 추측하거나 자동 공개하지 않음                                         | `승인`           |
| PRIV-28 | 출시 전에 법적으로 충분한 개인정보처리자·운영자 공개 해결                                         | `출시 차단 조건` |
| PRIV-29 | 출시 전에 법적 근거, 동의, 권리 처리 기간 및 관할 상세 해결                                       | `출시 차단 조건` |
| PRIV-30 | 출시 전에 Log, Backup, Region, Subprocessor, Embed 및 삭제 Lifecycle 검증                         | `출시 차단 조건` |
| PRIV-31 | 출시 전에 고아 Upload cleanup 구현과 입증                                                         | `출시 차단 조건` |
| PRIV-32 | 사람의 법률 번역 검토와 우선 언어 조항 결정                                                       | `출시 차단 조건` |

## 후속 전달 경계

Claude Design은 한눈에 보기와 전체 방침의 관계, Section 순서, 공개 데이터 결과,
검증된 비수집 설명, Settings·Email 제어 경로, 연령 규칙, Version history,
접근 가능한 페이지 내 내비게이션, Compact에서의 전체 콘텐츠, Wide editorial
adaptation, Print 동작 및 모든 보이는 출시 차단 조건을 보존해야 합니다. 이후 승인될
Foundation 안에서 최종 Typography, Spacing, Summary treatment, Table·Card 구성,
목차 내비게이션 외형, Sticky threshold 및 External-link treatment를 정할 수 있습니다.
법률 상세를 디자인으로 없애거나, 동의를 만들거나, Tracking을 추가하거나, 운영자
성명을 공개하거나, 전체 콘텐츠를 Accordion에 숨기거나, 스타일이 적용된 Placeholder를
법적으로 완성된 것처럼 암시하면 안 됩니다.

향후 Codex 구현 Session은 Code-to-policy Data inventory를 다시 실행하고 Production
Vendor 설정·Network request를 검증하며, Policy versioning을 구현하고 누락된 Profile
visibility control을 추가하고, Orphan·Backup 삭제 사실을 확립하고, Test를 갱신하며,
기록된 법률·번역 승인을 받아야 합니다. 법률 검토로 연령 자격, 동의, 개인정보처리자
식별, 권리, 국외 이전 문구, 외부 Embed loading 또는 Retention이 바뀌면 구현·출시 전에
Guide로 돌아와 명시적으로 개정해야 합니다.
