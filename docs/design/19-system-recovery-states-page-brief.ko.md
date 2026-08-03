# NosLog 2.0 시스템 복구 상태 페이지 기획서

## 문서 관리

- 상태: `승인`
- 결정 상태: `서로 다른 네 가지 복구 의미를 승인함. 다국어 Not-found는 일반
셸 안에서 제공하고, 복구 가능한 페이지 오류는 재시도와 문맥 보존을 제공하며,
치명적 Application 오류는 최소 복구 셸을 사용하고, 계획된 점검은 사실에 맞는
선택적 시간 정보·수동 새로고침·HTTP 503 의미를 사용함.`
- 근거 상태: `현재 저장소와 Test 조사, 1280 CSS px에서 Not-found 및 점검의
한국어·일본어·영어 실브라우저 검사, 이전에 기록한 Compact Not-found 근거,
승인된 정보 구조 및 공통 셸 계약, Platform·HTTP·검색·접근성·디자인 시스템·
실서비스 레퍼런스 20개 이상 및 사용자 승인 결정 기록`
- 작성 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 문서 언어: 한국어 동기화본
- 영어 원본:
  [19-system-recovery-states-page-brief.md](./19-system-recovery-states-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 공통 셸 계약:
  [15-shared-shell-navigation-brief.ko.md](./15-shared-shell-navigation-brief.ko.md)
- 공지 계약:
  [14-announcements-page-brief.ko.md](./14-announcements-page-brief.ko.md)
- 범위: 일치하지 않는 Route와 이용 불가능한 공개 Resource, 복구 가능한 Route
  오류, 치명적 Root 오류, 계획된 점검, 셸 소유권, 문구 계층, 행동, Locale,
  Metadata, HTTP·Cache 의미, 반응형 동작, 접근성, 진단 정보 경계, 구현 연결 및
  브라우저 인수 조건
- 제외 범위: 각 페이지 패밀리 기획서가 이미 다루는 페이지 내부 Loading, 빈
  상태, Validation, 권한, Upload 및 파괴적 상태, 최종 Foundation Token과
  Artwork, 외부 상태 서비스, 새로운 지원 Ticket 시스템, 관리자 Incident 도구,
  프로덕션 구현 및 High-fidelity 페이지 디자인

## 결정 상태 표기

- **관찰:** 저장소, 브라우저, Test, 승인된 상위 문서 또는 인용 출처에서 확인한
  사실입니다.
- **승인:** 사용자와 명시적으로 합의했으며 후속 디자인과 구현의 기준입니다.
- **제안:** 근거를 바탕으로 제안했지만 사용자 승인을 기다리는 방향입니다.
- **미확정:** 승인된 제품 동작을 바꾸지 않는 범위에서 이후 구현 또는 운영
  검증이 필요합니다.
- **거절:** 검토했지만 명시적으로 선택하지 않은 방향입니다.
- **대체됨:** 이후 승인한 결정이 앞선 방향을 대체했습니다.

이 기획서는 서비스 수준 복구 상태만을 지배합니다. 후속 디자이너는 네 상태를
하나의 일반 오류 Template로 합치거나, 뒷받침되지 않는 운영 약속을 만들거나,
기술 진단 정보를 노출하거나, Application이 신뢰할 수 있게 실행할 수 없는
내비게이션을 복원하면 안 됩니다.

## 목적

시스템 복구 상태는 방문자가 무엇이 실패했는지, NosLog 자체는 이용 가능한지,
어떤 단일 행동이 가장 유효한 복구 방법인지 이해하게 합니다. 기술 세부사항을
과도하게 전달하지 않으면서 막다른 길을 방지합니다.

이 패밀리는 다음 네 질문에 순서대로 답합니다.

1. 요청한 목적지가 없는 것인가, NosLog가 오작동하는 것인가?
2. 현재 페이지 문맥을 떠나지 않고 복구할 수 있는가?
3. Application 셸 자체가 이용 불가능한가?
4. NosLog가 의도적으로 점검 중이며, 사실에 맞는 복구 예정 시간이 있는가?

## 상태 분류와 성공 조건

| 상태                    | 의미                                                                      | 셸                  | 주 성공 조건                                                                   |
| ----------------------- | ------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| Not found               | NosLog는 이용 가능하지만 Route 또는 권한상 공개된 Resource를 찾을 수 없음 | 일반 공개 셸        | 장애로 오인하지 않고 홈 또는 다른 유효 목적지로 이동                           |
| 복구 가능한 페이지 오류 | 일반 셸은 작동하지만 한 Route Segment 또는 요청이 실패                    | 일반 공개 셸        | 피할 수 있는 문맥 손실 없이 재시도에 성공하거나 안전한 일반 Route로 이탈       |
| 치명적 전역 오류        | Root Application Rendering 또는 초기화 실패                               | 최소 시스템 복구 셸 | 손상된 셸에 의존하지 않고 문서를 재초기화하거나 전체 이동으로 이탈             |
| 계획된 점검             | NosLog가 의도적으로 임시 이용 불가 상태를 반환                            | 최소 시스템 복구 셸 | 임시 상태를 이해하고 수동으로 다시 확인하며, 알려진 경우 사실에 맞는 시간 확인 |

- **승인:** 최종 시각 언어가 Typography, Spacing, Icon 또는 Action Primitive를
  공유하더라도 네 의미는 서로 구분합니다.
- **승인:** Resource 존재 여부 공개가 개인정보를 노출할 수 있으면 권한에
  민감한 Resource를 의도적으로 Not found로 처리할 수 있습니다. 이 기획서는
  보편적인 `403` 페이지를 추가하지 않습니다.
- **승인:** Component 내부 및 과업 내부 오류는 해당 페이지 기획서에 남습니다.
  페이지나 Application이 계속될 수 없을 때만 이 패밀리로 격상합니다.

## 현재 제품 근거

### 현재 구현

- **관찰:** [`app/not-found.tsx`](../../app/not-found.tsx)는 Client Locale
  Provider로 다국어 제목, 설명 및 홈 Link를 표시합니다. 일반 Route Group
  바깥에서 도달하면 독립적인 `main` Landmark, 일반 헤더 또는 푸터를 제공하지
  않습니다.
- **관찰:** 현재 일치하지 않는 Route는 다국어로 구체적인 Not-found 문서
  제목이 아니라 일반 Site 제목을 상속합니다.
- **관찰:** [`app/error.tsx`](../../app/error.tsx)는 오류를 기록하고 Console에
  출력하며 일반 다국어 문구와 `reset()`만 제공합니다.
- **관찰:** [`app/global-error.tsx`](../../app/global-error.tsx)는 Root 문서를
  교체하며 `reset()`만 제공합니다. 영어로 초기화한 후 Mount 뒤에 문서 언어를
  읽으므로 현재 계약은 첫 Rendering의 올바른 Locale을 보장하지 못합니다.
- **관찰:** [`app/maintenance/page.tsx`](../../app/maintenance/page.tsx)는 하나의
  `main`, NosLog Mark, Wrench Icon, 제목 및 설명을 가진 다국어 최소 페이지를
  표시합니다. 복구 행동이나 운영 시간 정보는 없습니다.
- **관찰:** [`proxy.ts`](../../proxy.ts)는 일반 요청을 상태 `503`,
  `Cache-Control: no-store`, 고정 `Retry-After: 3600`과 함께 점검으로 Rewrite
  합니다. API는 요청 Locale과 무관하게 한국어 전용 JSON을 받습니다.
- **관찰:** Login, 관리자, OAuth, Metadata Asset 및 점검 자체는 점검 Rewrite를
  우회합니다. 이는 운영 동작이며, 모든 우회 목적지가 사용자 점검 화면에
  속한다는 약속이 아닙니다.
- **관찰:** [`tests/maintenance.test.ts`](../../tests/maintenance.test.ts)는 503
  Rewrite, API 응답, 고정 Retry-After 값 및 우회 Path를 검증합니다.
- **관찰:** [`lib/observability/client.ts`](../../lib/observability/client.ts)는
  개수가 제한된 브라우저 내부 진단 목록을 저장합니다. 사용자에게 보이는 참조
  코드를 유용하게 만들 외부 Incident 또는 지원 Identifier는 검증되지 않았습니다.

### 브라우저 근거

- **관찰:** 현재 한국어, 일본어, 영어의 일치하지 않는 Route 및 점검을 1280
  CSS px에서 검사했습니다. 보이는 문구는 다국어로 표시됐고 두 Surface 모두
  문서 수준 가로 Overflow를 만들지 않았습니다.
- **관찰:** 현재 일치하지 않는 Route에는 `main`, 전용 다국어 페이지 제목 및
  일반 셸이 없었습니다. 현재 점검 Route에는 하나의 `main`, 다국어 No-index
  Metadata가 있었으며 행동은 없었습니다.
- **관찰:** 현재 점검 콘텐츠는 넓은 Viewport에서도 약 390px로 제한됐습니다.
  이는 현재 근거이지 2.0 최대 너비 규칙이 아닙니다.
- **관찰:** 이전 제품 감사의 브라우저 근거에서 Compact Viewport의 이용 불가
  공개 채보가 다국어 Not-found로 처리됨을 확인했습니다.
- **미확정 구현 검증:** 최종 2.0 상태는 세 언어 모두에서 의도적인 320, 390,
  중간 너비 및 1280 CSS px Test가 필요합니다. 1280 검사는 Compact·Zoom
  검증을 대신하지 않습니다.

## 조사 종합

### 근거 수렴

1. HTTP 및 Platform 지침은 누락 Resource, 복구 가능한 Rendering 오류, Root
   Rendering 실패 및 임시 서비스 이용 불가를 구분합니다. 응답 상태와 복구
   동작을 합치면 안 됩니다.
2. 정부 및 제품 디자인 시스템은 설명적인 제목 하나, 짧고 중립적인 문구,
   유용한 다음 행동, 사용자 비난·농담·기술 전문용어 배제에 수렴합니다.
3. 진짜 Not-found에서는 서비스가 계속 작동하므로 일반 Site 구조가 유용합니다.
   점검과 치명적 오류는 잠재적으로 손상된 전역 내비게이션에 의존하면 안 됩니다.
4. 재시도는 실패를 실제로 해결할 가능성이 있을 때만 적절합니다. Primary 행동이
   없는 Route나 이용 불가 기능을 해결하는 것처럼 보여서는 안 됩니다.
5. 계획된 점검은 유지 관리되고 사실에 맞을 때 복구 예정 시각을 표시할 수
   있습니다. 알 수 없는 시간은 추측하지 않고 생략해야 합니다.
6. 설명적인 제목, 하나의 `main`, 하나의 `h1`, 논리적 Focus, Programmatic 상태
   피드백, Keyboard 접근 및 320 CSS px Reflow는 짧은 복구 페이지에도 필요합니다.

### NosLog 적합성

- NosLog에는 이미 다국어 Path, 안정적인 일반 셸, 최소 복구 Surface 및 Page·
  Global Next.js Error Boundary가 있습니다. 2.0 계약은 별도 Application을
  만들지 않고 기존 책임을 정교화할 수 있습니다.
- 사용자는 공유된 악곡, 프로필, 랭킹, 서열, 빙고, 검정 및 채보 Link에서 자주
  진입합니다. 보편적인 404에 악곡 전용 검색 Control을 추가하면 악곡 외 실패에
  잘못된 안내가 됩니다.
- NosLog에는 승인된 외부 상태 페이지나 사용자에게 보이는 Incident Identifier가
  없습니다. 정직한 복구 경험에 어느 쪽도 필수가 아닙니다.

### 레퍼런스 한계

- 정부 서비스는 강한 콘텐츠·접근성 Pattern을 제공하지만 NosLog Art Direction은
  아닙니다.
- Next.js는 File Convention 동작을 정의하지만 최종 문구나 반응형 Layout은
  정하지 않습니다.
- HTTP·검색 지침은 Protocol 의미를 정의하지만 행동 계층은 정하지 않습니다.
- 디자인 시스템 빈 상태는 간결한 복구 콘텐츠에 참고되지만 시스템 실패를 일반
  No-data 상태로 바꾸지 않습니다.
- Statuspage 지침은 사실에 맞는 점검 소통을 알려주지만 NosLog에 외부 서비스를
  추가할 근거가 아닙니다.

## 승인된 공통 콘텐츠 계약

- 보이는 `h1` 하나만 사용하고 경쟁하는 두 번째 제목을 두지 않습니다.
- 기본 상태에서 제목 아래 설명은 간결한 문단 하나까지만 둡니다. 선택적 점검
  시간은 또 다른 설명문이 아니라 구조화된 Metadata입니다.
- Primary 행동 하나를 표시합니다. Secondary 행동은 이 기획서가 명시적으로
  요구한 경우에만 허용합니다.
- 중립적이고 직접적인 언어를 사용합니다. 사용자를 비난하거나, 반복해서
  사과하거나, 농담하거나, 실패를 의인화하거나, NOSTALGIA 용어를 장식으로
  사용하면 안 됩니다.
- Stack Trace, Exception Message, Route Digest, Request Payload, 원시 Database
  Identifier, 내부 Path 또는 가짜 참조 코드를 표시하지 않습니다.
- 장식 Icon이나 NosLog Mark는 인식을 도울 수 있지만 상태 의미는 Text가
  전달합니다. 큰 Illustration이나 Mascot 장면을 요구하지 않습니다.
- 최종 Typography, Color, Icon Drawing, Spacing 및 Action Styling은 승인될
  Foundation과 Claude Design의 책임입니다. 시각 처리는 여기서 정한 계층과
  셸 계약을 보존해야 합니다.

## 승인된 Not-found 계약

### 의미와 셸

- 첫 Focus 가능한 본문 바로가기, 헤더, 페이지 수준 `main` 하나 및 푸터를 가진
  일반 공개 셸 안에서 Rendering합니다.
- 일반 홈 정체성, 계정 상태, 더보기 내비게이션, 개인정보처리방침 및 GitHub
  접근을 보존합니다. 404 전용 내비게이션 Taxonomy를 만들지 않습니다.
- 일치하지 않는 Route 또는 누락 공개 Resource에 실제 HTTP `404`를 반환하고
  No-index 동작을 적용합니다. 성공 `200` Soft-404 페이지를 표시하면 안 됩니다.

### 콘텐츠와 행동

1. `페이지를 찾을 수 없습니다 | NosLog`와 동등한 다국어 문서 제목
2. `페이지를 찾을 수 없습니다`와 동등한 다국어 `h1`
3. 요청한 페이지를 찾을 수 없다는 짧은 문장 하나
4. Primary 홈 Link 하나

- 전용 검색 Field, 악곡 행동, 뒤로 가기 Button, 추천 Link, 지원 설명 또는 크게
  보이는 `404` 숫자를 추가하지 않습니다.
- 사용자가 필요할 때 일반 더보기 Panel에서 더 넓은 목적지와 피드백 · 오류 제보를
  이미 제공합니다.
- Browser Back은 계속 이용할 수 있지만 이전 문서가 없거나, 외부이거나, 같은
  잘못된 상태일 수 있으므로 페이지 Primary 복구 행동으로 복제하지 않습니다.

### 보안에 민감한 누락 Resource

- 공개되지 않은 공지, 비공개 프로필·필드, 이용 불가 채보 Revision 및 유사
  Resource는 존재 여부를 공개하면 안 될 때 이 Not-found 표현을 공유할 수 있습니다.
- 해당 제품 기획서가 공개를 명시적으로 허용하지 않으면 문구에서 `원래 없음`,
  `삭제됨`, `비공개`, `권한 없음`을 구분하지 않습니다.

## 승인된 복구 가능한 페이지 오류 계약

### 의미와 셸

- 헤더, 내비게이션, Locale 및 페이지 Boundary가 작동하면 일반 셸을 유지합니다.
- 실패한 콘텐츠 Region을 페이지의 정상 읽기 위치에 유지합니다. 작동하는
  Application을 치명적 오류 셸로 교체하지 않습니다.

### 콘텐츠와 행동

1. `이 페이지를 불러오지 못했습니다`와 동등한 다국어 `h1` 또는 Region 제목
2. `잠시 후 다시 시도해 주세요`와 동등한 짧은 문장 하나
3. 페이지 복구 Boundary를 호출하는 Primary `다시 시도` Button
4. Secondary 홈 Text Link

- 일반 더보기 Panel의 피드백 · 오류 제보는 계속 이용할 수 있습니다.
- Error Digest나 원시 Exception을 노출하지 않습니다.
- 하위 Region만 실패하고 나머지 페이지를 이용할 수 있으면 전체 페이지로
  격상하지 않고 해당 페이지 기획서가 정한 문맥상 Region 오류를 사용합니다.

### 재시도와 문맥 보존

- 한 번의 재시도가 진행 중이면 행동을 비활성화하거나 Busy로 표시하고 중복
  실행을 막습니다.
- Focus를 불필요하게 이동하지 않고 의미 있는 재시도 결과를 알립니다.
- 성공하면 기술적으로 가능한 범위에서 같은 의미 있는 페이지 문맥을 복원합니다.
- 해당 흐름이 안전하게 지원할 수 있으면 입력값, 선택 Filter, 선택 난이도,
  Scroll에 관련된 Route 상태 및 완료 Step을 보존합니다.
- Application이 증명할 수 없으면 데이터가 저장·보존됐다고 말하지 않습니다.
- 반복 실패 시 간결한 복구 상태와 일반 지원 접근을 유지합니다. 기술 메시지를
  계속 붙이거나 자동 재시도하지 않습니다.

## 승인된 치명적 전역 오류 계약

### 의미와 셸

- 손상된 Application을 최소 시스템 복구 셸로 교체합니다.
- NosLog 정체성, 하나의 `main`, 하나의 `h1`, 간결한 설명, Primary 재시도 및
  Secondary 홈 Link만 Rendering합니다.
- 일반 헤더, 더보기 Panel, 푸터, 피드백 Dialog, Toast Stack 또는 페이지 전용
  내비게이션은 해당 의존성 자체가 실패 원인일 수 있으므로 Rendering하지 않습니다.

### 행동

- Primary `다시 시도`는 Framework가 지원하는 복구 Path를 통해 문서를
  재초기화하거나 새로고침합니다.
- Secondary 홈은 Client 전용 Routing이 아니라 일반 전체 문서 Link를 사용합니다.
- 자동 새로고침하지 않습니다. 반복 Root Crash에서도 상태를 읽고 행동할 수
  있도록 안정적으로 유지해야 합니다.

### Locale과 Root 안전성

- 의미 있는 복구 문구가 그려지기 전에 한국어, 일본어 또는 영어를 결정합니다.
  다른 Locale을 이미 알 수 있을 때 영어로 초기화한 뒤 Mount 후 교체하면 안 됩니다.
- 교체 `<html>`은 일반 Provider Tree가 Rendering됐다고 가정하지 않고 올바른
  `lang`, 승인된 Theme Baseline, Font Fallback, Viewport 동작 및 충분한 독립
  Styling을 사용합니다.
- 요청이나 Route에서 Locale을 복구할 수 없으면 정상 첫 진입과 같은 문서화된
  제품 Fallback을 사용합니다. Exception Message로 추론하지 않습니다.

## 승인된 계획된 점검 계약

### 의미와 셸

- 일반 헤더, 더보기 Panel, 푸터, 피드백 Dialog 또는 손상된 목적지 목록 대신
  최소 시스템 복구 셸을 사용합니다.
- 인식 가능한 NosLog 정체성, 하나의 `main`, 하나의 `h1`, 간결한 운영자 메시지,
  사실에 맞는 선택적 시간 및 수동 복구 행동 하나를 유지합니다.
- 점검은 임시 운영 상태이지 NosLog 공지 Article이 아닙니다. 관련 공개 공지가
  이력을 제공할 수 있지만 503 페이지 자체만으로 이해할 수 있어야 합니다.

### 콘텐츠 계층

1. NosLog 정체성
2. `서비스 점검 중입니다`와 동등한 다국어 `h1`
3. 짧은 다국어 설명 하나
4. 알려진 경우 선택적 종료 예정 시각
5. 운영자 메시지나 예정 시간이 바뀐 경우 선택적 마지막 수정 시각
6. Primary `다시 확인` Button

- 운영자 메시지는 짧고 평이하며 모든 지원 Locale에서 안전하게 보여야 합니다.
- 종료 예정 시각을 모르면 Field를 생략합니다. `알 수 없음`, 빈 행 또는 일반적인
  한 시간 추정치를 표시하지 않습니다.
- `KST`처럼 모호하지 않은 Timezone을 포함한 정확한 다국어 날짜·시간을
  Rendering합니다. 상대 시간은 보완할 수 있지만 정확한 값을 대신할 수 없습니다.
- 실제 공개 변경을 전달할 때만 `마지막 수정`을 표시합니다. 기본적으로 배포 시작
  시각을 뜻하지 않습니다.

### 새로고침과 이용 가능 동작

- `다시 확인`은 사용자 주도의 문서 새로고침을 실행하고 Busy 상태를 표시합니다.
- 자동 새로고침, Polling, Countdown 또는 종료 예정 시각 경과 시 Redirect를
  사용하지 않습니다.
- 점검하는 공개 페이지와 API에 HTTP `503`을 계속 반환합니다.
- 임시 복구 응답에 `Cache-Control: no-store`를 보냅니다.
- `Retry-After`를 보낼 때는 유지되는 운영 데이터 또는 의도적으로 설정한 재시도
  간격을 반영해야 합니다. 현재 고정 `3600`은 사용자에게 보이는 종료 약속이
  아니며 종료 예정 시각처럼 다루면 안 됩니다.
- API 점검 응답은 안전하고 Locale이 일관된 Machine-readable 동작이 필요합니다.
  한국어 전용 JSON은 2.0 다국어 계약이 아닙니다.
- 이 기획서는 외부 상태 페이지, 유료 API 또는 우회 Embed를 추가하지 않습니다.

## 반응형 및 Layout 계약

- 390px을 고정 콘텐츠 너비나 Breakpoint가 아닌 대표 검토 Canvas로 사용해
  Mobile-first로 디자인합니다.
- 320 CSS px에서 페이지 수준 가로 Scroll, 잘린 행동 또는 숨겨진 문구 없이
  Reflow합니다.
- 일반 Not-found와 복구 가능 오류는 일반 셸의 Compact·Wide 동작을 따릅니다.
- 치명적 오류와 점검은 모든 너비에서 시각적 집중을 유지합니다. Wide Layout은
  더 큰 읽기 폭과 의도적 여백을 사용할 수 있지만 390px Mobile Canvas를 그대로
  고정하거나 두 번째 정보 Column을 추가하면 안 됩니다.
- 더 넓은 Layout에서 행동은 가용 Inline 너비를 사용할 수 있고 콘텐츠 Fit이
  필요하면 Stack할 수 있습니다. 의미 순서는 Primary 다음 Secondary로 유지합니다.
- 짧은 Viewport 높이, Safe Area, 200%·400% Zoom, 한국어 Wrapping, 일본어 줄바꿈
  및 더 긴 영어 Action Label을 검증합니다.

## 접근성 계약

- 모든 독립 상태는 페이지 수준 `main` 하나와 보이는 `h1` 하나만 제공합니다.
- Not-found와 복구 가능 상태는 일반 셸의 첫 Focus 가능한 본문 바로가기를
  유지합니다.
- Client Route 전환으로 시스템 상태에 진입하면 공통 Route Focus Pattern에 따라
  페이지 제목 또는 Main 시작점으로 Programmatic Focus를 이동·복원합니다.
  제거된 Trigger에 Focus를 남기지 않습니다.
- 홈은 Native Link, 다시 시도·다시 확인은 Native Button을 사용합니다.
- Busy 상태는 Programmatic하게 판단 가능하고 중복 실행을 막으며 Button Label을
  제거하지 않습니다.
- Focus를 방해하지 않고 공유 Status Pattern으로 의미 있는 재시도 실패·성공을
  알립니다. 변하지 않는 Countdown이나 Polling 콘텐츠를 반복해 알리지 않습니다.
- Focus Indicator는 보이고 가려지지 않습니다. Control은 WCAG 2.2 Target Size
  또는 간격 요구사항을 충족합니다.
- 상태 의미는 Icon, Color, Animation 또는 HTTP Code에만 의존하지 않습니다.
- Reduced Motion을 존중합니다. 이 상태는 이해를 위해 장식 Motion을 요구하지
  않습니다.
- 설명적인 다국어 문서 제목은 Browser History와 보조기술 탐색에서 Not found,
  Error 및 Maintenance를 구분합니다.

## 다국어 및 콘텐츠 계약

- 한국어, 일본어 및 영어는 같은 상태 의미, 행동 이용 가능성, 시간 사실,
  개인정보 경계 및 기술 세부사항 생략을 제공합니다.
- NosLog 또는 Code Identifier를 번역하지 않습니다. 사용자 Label은 `error
boundary`, `digest`, `render`, `HTTP 503` 같은 Framework 전문용어가 아니라
  자연스러운 제품 언어를 사용합니다.
- 점검 Timestamp는 Locale에 맞는 순서와 숫자를 사용하면서 명시적인 Timezone을
  유지합니다.
- 번역 누락으로 치명적 Boundary가 영어를 잠깐 표시한 뒤 바뀌면 안 됩니다.
  구현은 안정적인 초기 언어 결정을 제공해야 합니다.
- 이 기획서의 문구 예시는 의미 요구사항이며 최종 번역 승인이 아닙니다. 다국어·
  콘텐츠 단계에서 사람의 검토가 필요합니다.

## Metadata, 검색 및 Protocol 계약

| 상태                    | HTTP 및 Cache                                                                     | Indexing                                   | 문서 제목                                           |
| ----------------------- | --------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------- |
| Not found               | 일치하지 않거나 누락된 공개 Resource에 실제 `404`                                 | `noindex`, Sitemap 제외                    | 다국어 `페이지를 찾을 수 없습니다                   | NosLog`와 동등한 제목 |
| 복구 가능한 페이지 오류 | Boundary에서 가능한 사실에 맞는 응답 의미 보존, `404`를 만들지 않음               | 별도 Index 가능한 오류 URL 생성 안 함      | Boundary가 문서를 소유하면 다국어 페이지 오류 제목  |
| 치명적 전역 오류        | Framework·Server 실패 의미 보존, Root 실패를 성공 Index 가능 페이지로 바꾸지 않음 | 별도 복구 URL을 Index하지 않음             | 다국어 `NosLog를 불러오지 못했습니다`와 동등한 제목 |
| 점검                    | `503`, `no-store`, 사실에 맞는 선택적 `Retry-After`                               | `noindex`, `nofollow`, Sitemap 목적지 아님 | 다국어 `서비스 점검                                 | NosLog`와 동등한 제목 |

- Canonical과 `hreflang`은 누락 Route가 유효한 Canonical 문서라고 암시하면 안
  됩니다.
- 점검은 영구 탐색 가능 콘텐츠 목적지가 되지 않으면서 Locale별 Rendering
  동작을 유지할 수 있습니다.
- Social·검색 Metadata는 일본어·영어 복구 페이지에 한국어 설명을 재사용하면
  안 됩니다.

## 개인정보, 진단 및 지원 경계

- Client·Server Logging은 이후 Observability 계약 아래 안전한 운영 세부사항을
  보존할 수 있지만 보이는 문구에는 이를 노출하지 않습니다.
- Token, Request Body, 공식 기록 Payload, 사용자 입력 Form 내용, Exception
  Message 또는 비공개 URL을 보이는 진단이나 기본 피드백 Attachment에 넣지 않습니다.
- 구현된 지원 경로가 해당 ID를 조회할 수 있기 전에는 참조·Incident ID를
  표시하지 않습니다. 운영 가치가 없는 무작위처럼 보이는 Code는 거절합니다.
- Not-found와 복구 가능한 오류는 일반 더보기 Panel의 피드백 · 오류 제보에
  접근할 수 있습니다. 치명적 오류와 점검 상태에서는 이를 제외합니다.
- 기존 피드백 Dialog와 비공개 Attachment 처리는 공통 셸 및 개인정보 기획서가
  지배합니다. 이 기획서는 별도 제출 Form을 추가하지 않습니다.

## 상태 및 Edge Case Matrix

| 조건                                         | 필수 결과                                                  | 상태   |
| -------------------------------------------- | ---------------------------------------------------------- | ------ |
| 알 수 없는 다국어 Route                      | 일반 셸 Not found, 홈 Primary, 실제 404                    | `승인` |
| 공개되지 않았거나 개인정보에 민감한 Resource | 해당 기획서가 공개를 허용하지 않으면 같은 안전한 Not found | `승인` |
| 페이지 Boundary 1회 실패                     | 다시 시도와 홈을 가진 일반 셸 페이지 오류                  | `승인` |
| 재시도 성공                                  | 가능한 범위에서 의미 있는 페이지 문맥 복원                 | `승인` |
| 재시도 계속 실패                             | 간결한 상태와 일반 피드백 접근 유지, 자동 Loop 없음        | `승인` |
| Root·Provider Tree Crash                     | 다시 시도와 전체 문서 홈을 가진 최소 치명적 셸             | `승인` |
| 치명적 Crash 중 Locale 확인 가능             | 첫 의미 있는 Paint에서 올바른 Locale                       | `승인` |
| 종료 예정이 있는 점검                        | 정확한 다국어 시각·Timezone과 다시 확인 표시               | `승인` |
| 종료 예정이 없는 점검                        | 시간 행 생략, 추정치 만들지 않음                           | `승인` |
| 예정 시간 변경                               | 값과 공개 마지막 수정 Timestamp 갱신                       | `승인` |
| 예정 시각 경과 후에도 이용 불가              | 안정 상태 유지, 자동 Redirect나 허위 완료 주장 없음        | `승인` |
| 점검 중 API                                  | 503, no-store, 안전하고 Locale이 일관된 오류 계약          | `승인` |
| 320 CSS px 또는 400% Zoom                    | 2차원 페이지 Scroll 없이 전체 읽기 및 행동                 | `승인` |
| 장식 Asset 실패                              | Layout 붕괴 없이 Text와 행동 완전 유지                     | `승인` |

## 구현 연결

| 책임                 | 현재 Source                                                                            | 2.0 요구사항                                                                      |
| -------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Not-found Rendering  | [`app/not-found.tsx`](../../app/not-found.tsx)                                         | `main` 하나를 가진 일반 셸, 다국어 제목, 간결한 문구, 홈만 제공, 실제 404·noindex |
| 복구 가능한 Boundary | [`app/error.tsx`](../../app/error.tsx)                                                 | Secondary 홈, Busy·Status 동작, 일반 셸과 안전한 문맥 보존                        |
| 치명적 Boundary      | [`app/global-error.tsx`](../../app/global-error.tsx)                                   | Paint 전 Locale 결정, 독립 최소 셸, Primary 재시도와 전체 문서 홈                 |
| 점검 페이지          | [`app/maintenance/page.tsx`](../../app/maintenance/page.tsx)                           | 고정 너비를 권위로 삼지 않고 다시 확인과 사실에 맞는 선택적 종료·수정 데이터 추가 |
| 점검 Routing         | [`proxy.ts`](../../proxy.ts)                                                           | 503·no-store 보존, Retry-After를 사실에 맞게 구성, Locale 일관 API 계약 정의      |
| 점검 Test            | [`tests/maintenance.test.ts`](../../tests/maintenance.test.ts)                         | Locale, 알려진·알 수 없는 예정, 정확한 상태·Cache, 우회 안전성 및 API 동작 검증   |
| Client 진단          | [`lib/observability/client.ts`](../../lib/observability/client.ts)                     | 운영 세부사항 비공개 및 민감정보 제외, 조회 불가능한 공개 Code 없음               |
| 공통 셸              | [`app/(nevigation)/layout.tsx`](<../../app/(nevigation)/layout.tsx>) 및 공통 Component | Not found·복구 가능에는 일반 셸, 치명적·점검에는 일반 셸 없음                     |
| Metadata             | [`lib/metadata/site.ts`](../../lib/metadata/site.ts) 및 Route Metadata                 | Locale별 제목·설명과 올바른 Robots·Canonical 동작                                 |
| 다국어 문구          | [`lib/i18n/messages.ts`](../../lib/i18n/messages.ts) 및 Fatal-safe 문구 Source         | ko·ja·en 의미 동등성과 치명적 초기 Locale 정확성                                  |

- 이는 후속 구현 연결이며 이번 디자인 가이드 세션에서 구현할 권한이 아닙니다.
- 정확한 점검 데이터 저장소는 환경 설정 또는 작은 운영자 제어 Source일 수
  있습니다. 승인된 사실 기반 Field와 안전한 Fallback을 지원해야 하며, 이
  가이드는 성급하게 Database Migration을 선택하지 않습니다.

## 브라우저 및 자동 인수 계약

향후 구현은 최소 다음을 검증해야 합니다.

1. 한국어, 일본어 및 영어의 알 수 없는 Route와 안전한 이용 불가 Resource
2. 실제 404 상태, noindex, Locale별 제목, 하나의 `main`, 하나의 `h1`, 일반
   헤더·푸터 및 홈 이동
3. 복구 가능 실패, Busy 재시도, 중복 Click 방지, 성공 복원, 반복 실패, 홈 Link
   및 일반 피드백 접근
4. 모든 Locale의 치명적 오류에서 영어 Flash, Provider 의존, 중복 Root
   Landmark, Client 전용 홈 Routing 또는 자동 Reload가 없음
5. 알려진 시각, 알 수 없는 시각, 변경된 예정, 경과한 예정 및 수동 다시 확인을
   포함한 점검
6. 점검 페이지·API의 503, no-store, 사실에 맞는 Retry-After 동작, 우회 Path 및
   Locale이 일관된 안전한 API Payload
7. 모든 Locale의 320, 390, 대표 중간 너비 및 1280 CSS px
8. 200%·400% Zoom, 짧은 Viewport 높이, Keyboard 전용 조작, 보이는 Focus,
   Target 간격, Reduced Motion 및 문서 가로 Overflow 없음
9. 직접 진입, Route 전환, Browser Back·Forward, 새로고침 및 공유된 잘못된 Link
10. 복구 Interface로 인한 원시 오류, Digest, Token, Payload, 비공개 Route,
    허위 저장 주장, 가짜 Incident Code, Hydration 실패 또는 예기치 않은 Console
    오류 없음

자동 검사는 응답 의미, Metadata, Locale, Landmark 수, 행동, 재시도 상태 및 점검
Variant를 다뤄야 합니다. Lint, Typecheck, Unit Test 및 Snapshot은 실제 Reflow,
Focus 가시성, 첫 Paint Locale 또는 행동 명확성을 검증하지 못하므로 실브라우저
검사는 계속 필수입니다.

## 레퍼런스 Matrix

| 출처                                                                                                                  | 전용 가능한 원칙                                                               | NosLog 적용                                       | 한계                                                           |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------------------------- |
| [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)                                  | 예상 실패, Route Boundary, Root 오류, 재시도 및 Logging은 서로 다른 책임       | Page와 Global Boundary 구분 보존                  | NosLog 문구나 Art Direction을 정하지 않음                      |
| [Next.js `not-found.js`](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)                        | 일치하지 않는 Resource는 Not-found Convention과 Noindex 사용                   | 실제 공통 다국어 404                              | Framework Convention은 셸 구성을 정하지 않음                   |
| [Next.js `notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found)                                 | Route가 의도적으로 중단하고 Segment Not-found UI Rendering 가능                | 안전한 누락 Resource 처리                         | 권한 공개 정책을 결정하지 않음                                 |
| [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.pdf)                                                                | 404와 503은 다른 의미이며 Retry-After를 503과 함께 보낼 수 있음                | 사실에 맞는 상태와 임시 이용 불가 의미            | Protocol 의미는 시각 계층을 정하지 않음                        |
| [Google Crawling 오류 지침](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors) | 누락 Resource는 Soft 404가 아니라 404·410 반환                                 | Index 가능한 성공 누락 페이지 방지                | 검색 지침은 사용자 행동을 정하지 않음                          |
| [W3C Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled)                                            | 페이지는 주제나 목적을 식별하는 설명적 제목 필요                               | 서로 다른 다국어 Not found·Error·Maintenance 제목 | 제목 문구를 정하지 않음                                        |
| [W3C Page Regions](https://www.w3.org/WAI/tutorials/page-structure/regions/)                                          | Landmark가 페이지 구조를 공개                                                  | 페이지 수준 `main` 정확히 하나                    | 일반·최소 셸 선택을 정하지 않음                                |
| [W3C Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)                                             | Heading이 계층 전달                                                            | 보이는 상태 `h1` 하나                             | 시각 Scale은 Foundation 작업                                   |
| [WCAG Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)                                      | Focus는 의미와 조작성 순서 준수                                                | Route 상태 제목 Focus와 논리적 행동 순서          | Framework Focus API를 정하지 않음                              |
| [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                   | 동적 상태 변경을 방해적 Focus 이동 없이 노출 가능                              | 재시도 Busy·결과 알림                             | 과도한 알림을 요구하지 않음                                    |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | 320 CSS px에 해당하는 Reflow에서도 콘텐츠 사용 가능                            | Compact 복구 상태 인수 조건                       | 본 상태에는 본질적인 2차원 콘텐츠 예외가 해당되지 않음         |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                             | Keyboard, 대비, Focus, Target Size, 언어 및 Reflow가 모든 상태에 적용          | 전체 상태 접근성 Baseline                         | NosLog Component를 정하지 않음                                 |
| [GOV.UK Page not found](https://design-system.service.gov.uk/patterns/page-not-found-pages/)                          | 설명적 제목, 간결하고 비난하지 않는 설명 및 유용한 다음 행동                   | 최소 Not-found 문구와 홈 복구                     | 정부 서비스 문구를 그대로 복사하지 않음                        |
| [GOV.UK Problem with the service](https://design-system.service.gov.uk/patterns/problem-with-the-service-pages/)      | 예기치 않은 실패는 누락 페이지·계획된 점검과 다름                              | 복구 가능·치명적 의미 분리                        | Transaction 보존 예시는 문맥에 따라 다름                       |
| [GOV.UK Service unavailable](https://design-system.service.gov.uk/patterns/service-unavailable-pages/)                | 계획된 이용 불가는 알려진 경우 복귀 시간과 대안을 표시 가능                    | 사실에 맞는 선택적 점검 시간                      | NosLog에는 승인된 대안 서비스 Channel 없음                     |
| [USWDS 404 Template](https://designsystem.digital.gov/templates/404-page/)                                            | 일관된 서비스 Layout, 평이한 설명 및 복구 행동이 막다른 길 방지                | 일반 셸 Not found                                 | 선택적 Code·지원 콘텐츠는 여기서 불필요                        |
| [Primer Blankslate](https://primer.style/product/components/blankslate)                                               | Heading, 설명 및 제한된 행동 계층이 명확한 상태 형성                           | 공통 간결 Anatomy                                 | 일반 Blankslate는 장애 Taxonomy가 아님                         |
| [Primer Degraded Experiences](https://primer.style/product/ui-patterns/degraded-experiences/)                         | 영향 없는 UI 보존, 허위 데이터 손실 암시 회피, 문제를 해결할 수 있는 행동 제공 | 복구 가능 실패에서 일반 셸 유지                   | GitHub 제품 예시는 NosLog 콘텐츠를 정하지 않음                 |
| [Carbon Empty States](https://carbondesignsystem.com/patterns/empty-states-pattern/)                                  | 평이한 언어와 실행 가능한 다음 행동으로 막다른 길 방지                         | 간결한 누락·이용 불가 소통                        | 시스템 실패는 빈 데이터와 구분                                 |
| [Atlassian Empty State](https://atlassian.design/foundations/content/designing-messages/empty-state)                  | 짧고 훑기 쉬운 Heading, 제한된 본문 및 명확한 CTA 하나가 과부하 감소           | Primary 행동 하나의 근거                          | HTTP나 Fatal 셸 의미를 정하지 않음                             |
| [Atlassian Statuspage Maintenance](https://support.atlassian.com/statuspage/docs/schedule-maintenance/)               | 계획된 시작·기간·상태·갱신에는 유지되는 운영 사실 필요                         | 종료 예정·마지막 수정 Field                       | Statuspage 도입을 요구하지 않음                                |
| [Atlassian Statuspage User Guide](https://support.atlassian.com/statuspage/docs/read-the-statuspage-user-guide/)      | 명확한 현재 상태와 투명한 갱신이 신뢰 지원                                     | 사실에 맞는 점검 소통                             | 외부 구독·상태 기능은 제외 유지                                |
| [현재 NosLog 복구 코드](../../app/not-found.tsx)                                                                      | 실제 문구, Locale, 셸 및 행동 Baseline 제공                                    | 현재 근거와 2.0 요구사항 구분                     | 현재 Styling과 결함은 시각 권위가 아님                         |
| [현재 NosLog 점검 Routing](../../proxy.ts)                                                                            | 503, no-store, 고정 Retry-After, API 및 우회 동작 증명                         | 구현 위험과 보존할 Protocol 동작 정의             | 고정 한 시간 재시도와 한국어 전용 API는 승인된 2.0 계약이 아님 |

### 근거 수렴

- Platform·HTTP 출처는 서로 다른 네 의미와 사실에 맞는 상태에 수렴합니다.
- 정부·제품 시스템 출처는 장식적·기술적 실패 페이지가 아니라 간결하고 중립적이며
  실행 가능한 콘텐츠에 수렴합니다.
- 접근성 출처는 설명적 제목, Landmark, Heading, Focus, 상태 전달, Keyboard
  접근 및 Reflow에 수렴합니다.
- 점검 출처는 유지 관리되고 사실에 맞을 때만 시간을 표시하는 데 수렴합니다.
- 신뢰할 수 있는 어떤 출처도 NosLog에 거대한 Code, 자동 Reload Loop, 보편 악곡
  검색, 손상된 전체 내비게이션, 원시 진단 또는 가짜 Incident ID를 추가할 근거가
  되지 않습니다.

## 거절 및 대체 대안

- **모든 실패에 하나의 일반 오류 페이지 — 거절:** Route 누락, 재시도 가능,
  전역 손상 또는 의도적 이용 불가를 구분할 수 없습니다.
- **404에 최소 셸 사용 — 거절:** NosLog가 계속 작동하며 일반 내비게이션이
  유용한 복구를 제공합니다.
- **치명적 오류·점검에서 일반 전역 내비게이션 — 거절:** 신뢰할 수 없는 것으로
  알려진 목적지를 노출하고 복구 과업에 Noise를 추가할 수 있습니다.
- **404에 전용 악곡 검색 — 거절:** 잘못된 NosLog Link는 여러 비악곡 제품
  패밀리를 가리킬 수 있고 일반 내비게이션이 이미 탐색을 제공합니다.
- **크게 보이는 `404` 또는 기술 오류 Code — 거절:** 간결한 의미 Text와 사실에
  맞는 HTTP 상태로 충분하며 큰 Code는 복구를 개선하지 않습니다.
- **뒤로 가기를 Primary 404 행동으로 사용 — 거절:** 이전 History가 없거나,
  외부이거나, 잘못됐을 수 있습니다. 홈은 안정적이고 Back은 Browser에 남습니다.
- **자동 재시도, Polling, Countdown 또는 Redirect — 거절:** 사용자를 놀라게 하고
  부하를 만들며 실패 Loop에 진입할 수 있습니다.
- **고정 한 시간 점검 약속 — 대체됨:** 알려진 경우 실제 종료 예정만 표시하고,
  아니면 시간을 생략합니다.
- **외부 상태 서비스 — 거절:** 검증된 필요나 승인된 연동이 없으며 503 Surface는
  독립적으로 이해 가능해야 합니다.
- **치명적·점검 셸 내부 피드백 Upload — 거절:** 의존성이 이용 불가능할 수
  있습니다. 일반 셸 상태는 기존 지원 경로를 유지합니다.
- **사용자에게 보이는 Digest 또는 무작위 참조 ID — 거절:** 이를 유용하게 조회할
  구현된 지원 경로가 없고 기술 세부사항이 민감정보를 노출할 수 있습니다.
- **큰 Illustration 또는 유머 오류 문구 — 거절:** 상태 의미와 행동 명확성이
  우선이며 최종 Art는 절제된 비의미적 Icon만 사용할 수 있습니다.

## 결정 기록

| ID          | 결정                                                                                                    | 상태   |
| ----------- | ------------------------------------------------------------------------------------------------------- | ------ |
| RECOVERY-01 | Not found, 복구 가능한 페이지 오류, 치명적 전역 오류 및 계획된 점검을 서로 다른 네 상태로 유지          | `승인` |
| RECOVERY-02 | 일반 공개 셸 안에서 Not found를 표시하고 홈을 유일한 전용 행동으로 사용                                 | `승인` |
| RECOVERY-03 | 실제 404·noindex 의미와 설명적인 다국어 Metadata 반환                                                   | `승인` |
| RECOVERY-04 | Not found에서 전용 검색, 거대한 Code, 뒤로 가기 Control, 추천 목록 및 추가 지원 문구 생략               | `승인` |
| RECOVERY-05 | 개인정보에 민감한 누락 Resource가 같은 비공개 Not-found 상태를 사용하도록 허용                          | `승인` |
| RECOVERY-06 | 복구 가능한 페이지 오류에서 일반 셸, Primary 다시 시도, Secondary 홈 유지                               | `승인` |
| RECOVERY-07 | 가능한 범위에서 안전한 사용자 문맥 보존, 검증되지 않은 저장 주장 금지                                   | `승인` |
| RECOVERY-08 | Busy·Status 동작 사용, 중복 재시도 방지 및 자동 재시도 금지                                             | `승인` |
| RECOVERY-09 | 치명적 전역 오류에 최소 독립 셸 사용                                                                    | `승인` |
| RECOVERY-10 | 치명적 오류에 Primary 다시 시도와 전체 문서 Secondary 홈 제공, 피드백·전역 내비게이션 제외              | `승인` |
| RECOVERY-11 | 의미 있는 첫 Paint 전에 치명적 Boundary Locale 결정                                                     | `승인` |
| RECOVERY-12 | 계획된 점검에 최소 독립 셸과 수동 다시 확인 사용                                                        | `승인` |
| RECOVERY-13 | 사실에 맞게 유지되는 데이터에서만 선택적 종료 예정·마지막 수정 지원                                     | `승인` |
| RECOVERY-14 | 점검 자동 새로고침, Polling, Countdown 및 Redirect 금지                                                 | `승인` |
| RECOVERY-15 | 503·no-store 보존 및 Retry-After·API Locale 동작의 사실성 확보                                          | `승인` |
| RECOVERY-16 | 원시 오류, Digest, 비공개 Payload, 가짜 참조 Code 또는 근거 없는 데이터 손실 주장 표시 금지             | `승인` |
| RECOVERY-17 | 320 CSS px까지 Reflow하고 하나의 `main`, 하나의 `h1`, Focus, Keyboard, Zoom 및 Locale 동등성 보존       | `승인` |
| RECOVERY-18 | 동작을 바꾸지 않는 범위에서 정확한 시각 Token과 사람이 검토한 최종 문구를 Foundation·후속 디자인에 위임 | `승인` |

## Handoff 경계

Claude Design은 각 상태의 의미, 셸, 계층, 행동, 시간 규칙, Locale 동등성 및
Semantic 요구사항을 보존해야 합니다. 이후 승인될 Foundation 안에서 절제된
공유 시각 언어를 만들 수 있지만 상태를 합치거나, 뒷받침되지 않는 행동을
추가하거나, 오류 Code를 중심 요소로 만들거나, 종료 예정 시간을 꾸며내거나,
점검을 일반 내비게이션에 의존하게 하면 안 됩니다.

향후 Codex 구현 세션은 최종 디자인을 이 기획서와 비교하고, 각 상태를 승인된
Next.js·Proxy 책임에 연결하며, Protocol 동작과 브라우저 상호작용을 모두 검증해야
합니다. 구현에서 안정적인 첫 Paint Locale이나 사실에 맞는 점검 시간을 제공할 수
없으면 잘못된 정보를 조용히 표시하지 말고 해당 Field를 생략한 뒤 가이드 개정을
요청해야 합니다.
