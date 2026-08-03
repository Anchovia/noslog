# NosLog 2.0 인증 및 온보딩 페이지 기획서

## 문서 관리

- 상태: `승인`
- 결정 상태: `완전한 인증·온보딩 계약 승인: 하나의 Discord OAuth 진입,
비로그인 공개 탐색, 목적지 인지형 안전 복귀, 간결한 데이터 고지, 최소 닉네임·
국가/지역 온보딩, 보이는 Discord 계정 확인, 미완료 프로필 Gate, 명시적인
로그아웃 후 둘러보기 이탈, 접근 가능한 오류 복구, 반응형 인증 셸 및 한국어·
일본어·영어 동등성`
- 근거 상태: `저장소, 스키마, 테스트, 현재 인터페이스 및 320·390·1280 CSS px
브라우저 점검, 승인된 정보 구조·공통 셸·설정·프로필 계약, 20개를 넘는
접근성·보안·디자인 시스템·실제 서비스·리듬게임 인용 레퍼런스 및 사용자 승인
결정 기록`
- 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 원본 언어: 영어
- 영문 원본:
  [17-authentication-onboarding-page-brief.md](./17-authentication-onboarding-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 공통 셸 계약:
  [15-shared-shell-navigation-brief.ko.md](./15-shared-shell-navigation-brief.ko.md)
- 설정 및 계정 계약:
  [16-settings-account-page-brief.ko.md](./16-settings-account-page-brief.ko.md)
- 프로필 계약: [09-profile-page-brief.ko.md](./09-profile-page-brief.ko.md)
- 범위: 비로그인 Login, Discord OAuth 진입·Callback 복구, 최초 프로필 완료,
  미완료 프로필 Gate, 안전한 목적지 복귀, 인증 셸 콘텐츠, 반응형 동작, 접근성,
  다국어, 상태, 데이터 경계 및 향후 구현 승인
- 제외: 최종 시각 스타일, 정확한 Foundation Token·치수, 최종 다국어 문구,
  다른 로그인 제공자, 비밀번호 인증·복구, 관리자 인증 재설계, 법률 자문,
  Production OAuth 구현, DB Migration 및 High-fidelity 페이지 디자인

## 결정 라벨

- **관찰:** 저장소, 현재 브라우저 근거, 승인된 상위 산출물 또는 인용 출처에서
  검증한 사실입니다.
- **승인:** 사용자와 명시적으로 합의했으며 후속 디자인에 구속력을 가집니다.
- **제안:** 근거가 있지만 사용자 승인을 기다리는 방향입니다.
- **미확정:** 추가 조사, 테스트 또는 사용자 결정이 필요합니다.
- **거절:** 검토했으나 명시적으로 선택하지 않았습니다.
- **대체:** 이후 승인한 방향으로 교체되었습니다.

이 기획서는 인증·온보딩의 제품 의미, 정보 순서, 전환, 권한, 복구, 반응형 적응,
접근성 및 승인 기준에 대한 권위 문서입니다. Claude Design은 이후 승인할
Foundation 안에서 최종 시각 구성을 정할 수 있지만, 로그인 방식을 추가하거나
Login과 가입을 나누거나, 온보딩 입력을 늘리거나, 미완료 프로필 Gate를 바꾸거나,
승인된 공개 둘러보기 이탈을 제거하면 안 됩니다.

## 목적

인증은 방문자가 어떤 데이터를 사용하는지 이해하면서 하나의 Discord 신원을
NosLog에 의도적으로 연결하게 하며, 공개 탐색을 가로막지 않습니다. 온보딩은 개인
기록, 랭킹, 지역 문맥 및 공개 프로필 동작에 필요한 최소한의 완전한 NosLog 신원을
만듭니다.

이 패밀리는 다음 여섯 질문에 답해야 합니다.

1. 사용자가 방금 선택한 행동에 인증이 왜 필요한가?
2. 어떤 외부 신원과 최소 데이터가 NosLog에 사용되는가?
3. 인증하지 않고 공개 콘텐츠를 계속 탐색할 수 있는가?
4. 신규 사용자가 반드시 제공해야 하는 두 NosLog 프로필 값은 무엇인가?
5. 인증, 온보딩 또는 Session이 실패하면 어떻게 되는가?
6. 성공 또는 의도적인 이탈 뒤 어디로 돌아가는가?

## 주요 사용 문맥과 성공

- **승인:** Login은 비로그인 헤더와 계정 전용 행동에 인증이 필요할 때
  사용합니다.
- **승인:** 공개 악곡, 채보, 랭킹, 서열, 공지, 오락실 및 승인된 다른 공개
  정보는 NosLog 계정 없이 계속 탐색할 수 있습니다.
- **승인:** 비로그인 방문자는 하나의 Discord 행동, 데이터 경계, 완료 뒤
  목적지 및 공개 둘러보기 대안을 이해할 수 있을 때 성공합니다.
- **승인:** 신규 인증 사용자는 Discord 계정을 확인하고, NosLog 닉네임과
  국가/지역을 입력하고, 추가 축하·설정 단계 없이 원래의 안전한 목적지에
  도달할 수 있을 때 성공합니다.
- **승인:** 미완료 계정은 애매한 부분 사용 가능 개인화 상태로 남지 않습니다.
  온보딩을 완료하거나 명시적으로 로그아웃하고 공개 홈으로 돌아갑니다.
- **승인:** 완료된 재방문 계정은 온보딩을 건너뛰고 안전한 요청 목적지로 바로
  돌아가며, 목적지가 없으면 다국어 홈으로 이동합니다.
- **승인:** 한국어, 일본어 및 영어는 같은 의미, 행동 우선순위, 오류 복구 및
  데이터 고지를 보존합니다.

## 현재 제품 근거

### 저장소 및 데이터 근거

- **관찰:** Discord OAuth가 유일한 로그인 방식입니다. 인증 요청은 `identify`
  Scope를 사용하고 Callback은 Discord `id`, `username`, `global_name`,
  `avatar`를 가져옵니다.
- **관찰:** NosLog는 안정적인 Discord 사용자 ID를 계정 연결 값으로 저장합니다.
  현재 Callback은 신원을 가져온 뒤 Discord 비밀번호나 OAuth Access Token을
  저장하지 않습니다.
- **관찰:** 현재 OAuth 시작 Route는 일회용 State 값과 내부 경로처럼 보이는
  `returnTo`를 Session에 저장합니다. Callback은 응답 검증 전에 둘을
  소비하고 지웁니다.
- **관찰:** 완료된 재방문 계정은 저장된 목적지로 돌아갈 수 있지만 신규 계정은
  온보딩으로 이동하고, 현재 온보딩 완료는 항상 홈으로 보냅니다. 따라서
  온보딩을 거치면 원래 목적지를 잃습니다.
- **관찰:** Code가 없는 Discord 인증 취소는 현재 유효하지 않거나 만료된
  State와 같은 보이는 오류 패밀리로 처리됩니다.
- **관찰:** Login은 구성, Token 교환, 프로필 조회, 계정 연결 및 사용자 조회
  실패를 다국어 메시지로 Mapping하지만 일부 문구는 사용자 복구보다 운영자용
  의미를 노출합니다.
- **관찰:** 현재 Session Cookie는 HTTP-only, SameSite Lax이고 Production에서
  Secure이며 14일 수명으로 구성됩니다. 향후 정확한 수명은 이 기획서의 시각
  디자인 결정이 아니라 보안·구현 정책입니다.
- **관찰:** 인증 프로필이 미완료이면 현재 모든 일반 사용자 Route에서 온보딩으로
  Redirect됩니다. 완료된 프로필은 온보딩을 다시 열 수 없습니다.
- **관찰:** 현재 온보딩은 NosLog 사용자명 하나와 국가/지역 Radio 선택 하나를
  요청합니다. 아바타, 선호 오락실, 데이터 연동, 공개 범위, Tutorial 또는
  NOSTALGIA 플레이어 데이터는 요청하지 않습니다.
- **관찰:** 현재 온보딩은 NosLog 사용자명을 대문자로 바꾸고 국가에서 UI
  Locale을 파생합니다. 둘 다 승인된 설정 계약과 충돌합니다. NosLog 닉네임은
  승인된 Unicode 표시를 보존하고 국가/지역은 언어와 독립적입니다.
- **관찰:** 현재 온보딩에는 명시적 로그아웃·공개 둘러보기 이탈, 연결한 Discord
  계정 확인 및 원래 목적지 보존이 없습니다.
- **관찰:** 현재 Server 검증은 중복 닉네임과 일반 실패 메시지를 보존하지만,
  필드 연결, 오류 Focus 및 동적 Status Semantics가 불완전합니다.

### 브라우저 근거

- **관찰:** 기존 `localhost` Session이 이미 로그인 상태였기 때문에 별도 로컬
  `127.0.0.1` Origin에서 비로그인 Login을 점검했습니다. 해당 비로그인
  Origin에서 보호 콘텐츠나 계정 데이터에 접근하지 않았습니다.
- **관찰:** 320 CSS px 한국어 Login은 가로 넘침 없이 NosLog 정체성, Discord
  행동 하나, 개인정보처리방침 Link 및 비로그인 둘러보기 행동을 표시했습니다.
- **관찰:** 320 CSS px의 한국어, 일본어 및 영어 Login은 같은 의미적 콘텐츠를
  유지했습니다.
- **관찰:** 1280 CSS px에서도 현재 Login은 약 390px의 가운데 Column을
  유지하고 대부분의 Wide 공간을 사용하지 않았습니다. 이 고정 구성은 현재
  근거이며 2.0 권위가 아닙니다.
- **관찰:** 현재 OAuth 오류 문구는 보이지만 점검한 오류 Container에는 Error
  또는 Live-region Role이 없었습니다.
- **관찰:** 비로그인 온보딩은 Login으로, 완료된 로그인 계정의 온보딩 접근은
  홈으로 Redirect됐습니다.
- **관찰:** 사용자 계정을 만들거나 변경하지 않고는 실제 미완료 프로필 브라우저
  표본을 확보할 수 없었습니다. 따라서 온보딩 시각은 저장소 근거로만
  검증했습니다. 향후 승인 Suite에는 Seed된 미완료 계정이 필요합니다.

## 조사 종합

### 수렴한 결과

1. 인증 진입은 실제 신원 제공자를 나타내는 기본 행동 하나와, 이에 경쟁하지
   않는 보조 경로로 구성할 때 가장 명확합니다.
2. 하나의 외부 인증 행동이 기존 연결 계정 여부를 결정할 때 Login과 가입을
   서로 다른 선택으로 보여주면 안 됩니다.
3. 온보딩은 사용할 수 있는 계정을 만드는 데 필요한 정보만 요청하고, 선택적인
   프로필·설정·교육·연동 작업은 이후 해당 문맥으로 미뤄야 합니다.
4. 한 화면 두 필드 완료 작업에는 다단계 진행 표시기가 도움이 되지 않습니다.
5. 외부 인증은 제공자, 관련 데이터 사용, 최소 권한을 알리고, 안정적인 제공자
   ID와 State 검증 및 신뢰할 수 있는 내부 목적지만 사용해야 합니다.
6. 사용자는 연결할 외부 계정을 식별하고, 잘못된 계정을 선택했을 때 서비스
   프로필을 완료하지 않고도 복구할 수 있어야 합니다.
7. 필수 인증·온보딩 오류에는 간결한 Text 의미, 프로그램 방식 알림, 입력 보존
   및 명확한 재시도·이탈이 필요합니다.
8. 공개 탐색은 별도의 제품 경로입니다. 계정 Gate는 개인 행동을 보호하되 모든
   공개 NosLog 가치에 Login이 필요하다고 오해하게 하면 안 됩니다.
9. 반응형 인증은 집중형 Task Column을 유지합니다. Wide 공간은 Marketing
   Carousel, 무관한 내비게이션 또는 두 번째 정보 계층을 추가할 근거가 아닙니다.

### NosLog 적용성

- NosLog는 인증 제공자가 정확히 하나이며 비밀번호를 관리하지 않습니다.
  별도의 Login, 가입 및 비밀번호 찾기는 존재하지 않는 기능을 설명하게 됩니다.
- Discord 신원은 계정 소유권을 확립하고 NosLog 닉네임은 공개 서비스 신원입니다.
  온보딩에서 둘을 함께 보여주면 의미를 합치지 않고 잘못된 계정 완료를 막을 수
  있습니다.
- 국가/지역은 지역 랭킹과 주 플레이 문맥에 영향을 주며 인터페이스 언어에는
  영향을 주지 않습니다.
- 오락실 주변 모바일 사용은 짧은 완료 작업과, 인증을 요구한 채보·서열·빙고·
  검정·연동·프로필 행동으로의 신뢰 가능한 복귀에 유리합니다.
- 강제 완료 Gate는 부분 초기화된 개인 기록·랭킹을 피합니다. 명시적인 로그아웃
  후 둘러보기는 모든 개인화 Surface가 미완료 계정을 지원하게 만들지 않고도
  공개 접근을 보존합니다.

## 승인된 인증 모델

### 상태 및 전환 지도

| 시작 상태                   | Trigger                        | 필수 전환                      | 성공 목적지                            | 이탈 또는 실패                          |
| --------------------------- | ------------------------------ | ------------------------------ | -------------------------------------- | --------------------------------------- |
| 비로그인                    | 헤더 Login                     | Login → Discord OAuth          | 완료 계정이면 다국어 홈                | 재시도 또는 공개 홈 둘러보기            |
| 비로그인                    | 계정 전용 행동                 | 문맥형 Login → Discord OAuth   | 완료 계정이면 원래의 검증된 목적지     | 재시도 또는 이전 공개 문맥              |
| 비로그인, 신규 Discord 신원 | 모든 Login 진입                | Login → Discord OAuth → 온보딩 | 원래의 검증된 목적지, 없으면 다국어 홈 | 로그아웃 후 공개 홈 둘러보기            |
| 로그인, 프로필 미완료       | 모든 일반 또는 계정 전용 Route | 온보딩으로 Redirect            | 완료 뒤 원래의 검증된 목적지           | 로그아웃 후 공개 홈 둘러보기            |
| 로그인, 프로필 완료         | Login 또는 온보딩 Route        | 인증 Surface 우회              | 다국어 홈 또는 보존된 유효 목적지      | 해당 없음                               |
| 보호 작업 중 Session 만료   | 보호 행동                      | 문맥형 Login                   | 성공 뒤 안전한 목적지 재개             | 안전한 비민감 문맥 보존, 재시도 또는 홈 |
| OAuth 취소 또는 무효        | Discord Callback               | Login 복구 상태                | 재시도 뒤 원래의 안전 복귀             | 공개 문맥 또는 홈 둘러보기              |

### 복귀 목적지 계약

- Login, Discord OAuth 및 온보딩 전체에서 의도한 목적지를 보존합니다.
- NosLog Origin에 속하며 승인된 Locale Prefix 사용자 Routing에 해당하는
  정규화된 내부 사용자 목적지만 허용합니다.
- 외부 URL, Protocol-relative URL, 인증 Callback Route, API·Framework Route,
  별도 승인이 없는 관리자 Route 및 잘못되거나 재귀적으로 Gate되는 목적지는
  거절합니다.
- 목적지는 Server-side Flow에서 저장하고 검증합니다. Client Label이나 임의
  Query 값을 권한으로 신뢰하지 않습니다.
- 목적지가 의미 있을 때 “로그인 후 프로필로 돌아갑니다” 같은 다국어의 간결한
  문맥 문장을 표시합니다. 원시 경로를 노출하지 않습니다.
- 검증 실패 또는 목적지 없음은 다국어 홈을 사용합니다.
- 미완료 온보딩의 로그아웃은 보호 목적지가 아니라 다국어 공개 홈으로 이동해
  즉시 다시 Login되는 Loop를 막습니다.

## Login 계약

### 정보 및 행동 순서

1. `main`으로 가는 본문 바로가기 Link;
2. 다국어 홈으로 연결된 NosLog 정체성;
3. Login 제목과 간결한 목적 문장 하나;
4. 행동에서 인증이 시작된 경우 선택적 목적지 문맥 문장;
5. 기본 `Discord로 계속하기` 행동 하나;
6. Inline 개인정보처리방침 Link가 있는 간결한 Discord 데이터 사용 고지;
7. 보조 `로그인하지 않고 둘러보기` Text 행동;
8. 최소 인증 셸의 일반 신뢰 푸터.

### 기본 행동

- “Discord로 계속하기”와 동등한 다국어 Text의 Discord Brand 행동 하나를
  사용합니다.
- Login과 가입을 나누지 않습니다. Callback이 계정 재개 또는 미완료 계정 생성을
  결정합니다.
- Email, 비밀번호, Passkey, Steam, Google, X 또는 NOSTALGIA Credential을
  추가하지 않습니다.
- Discord `identify`만 요청합니다. Email, Guild 또는 다른 Scope 추가에는
  새로 검증된 제품 필요, 개인정보 검토 및 사용자 승인이 필요합니다.
- 활성화 뒤 Busy 상태를 노출하고, 접근 가능 이름을 의미 없는 Spinner로 바꾸지
  않으면서 중복 시작을 막습니다.

### 데이터 및 개인정보 고지

- 기본 행동 바로 다음에 NosLog가 계정 인증과 초기 신원을 위해 Discord 식별자,
  표시 이름, 사용자명 및 아바타를 받는다고 설명하는 간결한 문장을 둡니다.
- 이 고지는 인증 결정에 속하므로 Inline 다국어 개인정보처리방침 Link를
  제공합니다. 개인정보처리방침은 다른 일반 페이지에서는 계속 푸터에 있으며
  헤더·더보기 Panel 목적지가 되지 않습니다.
- 이후 법률 검토가 별도의 기록된 동의를 요구하지 않는 한 필수 동의 Checkbox를
  추가하지 않습니다. 행동과 인접 고지가 Email, Guild, 메시지, 연락처 또는
  Discord 비밀번호 접근을 암시하면 안 됩니다.
- Discord 인증을 NOSTALGIA, KONAMI 또는 e-amusement Login처럼 표현하지
  않습니다.

### 공개 둘러보기 대안

- 인증을 나가 공개 NosLog를 둘러보는 보조 Text 행동 하나를 유지합니다.
- 일반 Login 진입에서는 다국어 홈을 엽니다.
- 행동에서 시작한 Login에서는 가능한 경우 이전의 안전한 공개 문맥으로
  돌아가고, 그렇지 않으면 다국어 홈을 엽니다.
- 보조 행동은 기본 Discord 행동과 시각·프로그램 방식으로 구분하되 같은 비중의
  두 번째 Filled Button이 되면 안 됩니다.

## 온보딩 계약

### 목적 및 정보 순서

온보딩은 계정 완료이며 제품 Tour나 설정 대체물이 아닙니다.

1. `main`으로 가는 본문 바로가기 Link;
2. NosLog 정체성;
3. 온보딩 제목과 간결한 목적;
4. 보호 목적지에서 진입한 경우 목적지 이유;
5. Compact 연결 Discord 확인;
6. NosLog 닉네임 필드;
7. 국가/지역 단일 선택;
8. 완료 행동 하나;
9. `로그아웃하고 둘러보기` 보조 Text 행동;
10. 일반 신뢰 푸터.

### 연결 Discord 확인

- Discord 아바타와 표시 이름을 Compact 읽기 전용 신원 행으로 표시합니다.
- 이 행은 연결된 로그인 계정이라고 Label하며, 편집 가능한 NosLog 닉네임이나
  NOSTALGIA 플레이어명처럼 표현하지 않습니다.
- 원시 Discord ID는 노출하지 않습니다.
- 잘못된 계정에 대한 승인된 이탈은 `로그아웃하고 둘러보기`입니다. 향후
  명시적인 계정 변경 Flow는 계정 완료 뒤 설정 계약을 따릅니다.
- Discord 아바타가 없거나 로딩에 실패하면 표시 이름과 접근 가능한 대체
  아바타를 유지하고 완료를 막지 않습니다.

### NosLog 닉네임

- 설정 계약과 같은 닉네임 개념, 허용 Unicode Script·문장부호, 표시 보존,
  Normalized 고유성 및 숫자 Canonical 프로필 신원을 사용합니다.
- 대문자로 강제하지 않습니다. NOSTALGIA 공식 플레이어명만 별도의 연동된
  대문자 개념으로 유지합니다.
- 이 필드는 Discord 이름이나 공식 NOSTALGIA 이름이 아니라 NosLog에 표시되는
  이름이라고 설명합니다.
- Server 검증이 권위입니다. 중복 또는 유효하지 않은 입력은 값을 보존하고
  간결한 수정 안내를 필드에 연결합니다.
- Discord 표시 이름을 다시 입력하게 하지 않습니다.

### 국가 또는 지역

- 한국, 일본 및 글로벌/기타를 세 언어에서 같은 의미가 유지되는 현지화 Label로
  제공합니다.
- 주 플레이 및 지역 랭킹 지역을 나타내는 선택이라고 설명합니다.
- 이 선택으로 인터페이스 언어를 바꾸지 않습니다.
- 초기 계정 언어와 번역·읽기 제목 설정은 명시적인 승인된 비로그인 설정이 있으면
  이를 상속하고, 없으면 승인된 브라우저 Locale 기본값을 따릅니다.
- 이후 변경은 설정의 국가/지역 결과 확인을 따릅니다. 최초 온보딩 선택에는 변경
  경고가 필요하지 않습니다.

### 온보딩에서 명시적으로 제외하는 콘텐츠

- 아바타 Upload 또는 Crop;
- 선호 오락실;
- 프로필 공개 범위 Control;
- 데이터 연동 설치;
- NOSTALGIA 플레이어명 입력;
- 플레이 이력, Rating, Grade 또는 기록 Import;
- Feature Tour, Slideshow, Checklist 또는 축하 페이지;
- 알림, Newsletter 또는 Marketing 동의;
- 비로그인 설정에서 이미 상속한 Theme·번역 제목 Control;
- 이 한 화면 작업의 진행 표시기.

## 미완료 프로필 Gate

- 새로 생성된 계정은 일반 개인화 목적지나 로그인 홈 상태 전에 온보딩으로
  들어갑니다.
- 인증 프로필이 미완료인 동안, 허용된 OAuth Callback, 온보딩, 로그아웃 및 필수
  복구 Endpoint 밖의 요청은 온보딩으로 Redirect합니다.
- 개인 프로필, 설정 계정 카테고리, 빙고 편집, 검정 제출, 데이터 연동 또는 다른
  계정 전용 행동의 직접 요청도 같은 Redirect 규칙을 따릅니다.
- Redirect 전에 경고 Modal을 표시하지 않습니다. 목적지 인지형 이유는 온보딩의
  Form 문맥 바로 앞에서 표시합니다.
- 예시 이유는 “프로필을 사용하려면 계정 설정을 완료해주세요”입니다. 최종
  다국어 문구는 Content Design 작업으로 남깁니다.
- 완료하면 원래의 검증된 목적지로 바로 돌아갑니다. 다른 필수 확인 또는 축하
  페이지를 끼워 넣지 않습니다.
- `로그아웃하고 둘러보기`는 인증 Session을 파기하고 승인된 기기 단위
  비로그인 설정을 보존하며 다국어 공개 홈을 엽니다.
- 같은 Discord 신원으로 다시 로그인하면 기존 미완료 온보딩을 재개하며 중복
  계정을 만들지 않습니다.
- 완료된 계정이 온보딩에 접근하면 다른 곳으로 Redirect하며 이 최초 완료
  Surface에서 프로필 필드를 보거나 편집하지 않습니다.

## Form 제출 및 저장

- 닉네임과 국가/지역은 하나의 명시적인 온보딩 제출로 함께 Commit합니다.
- Form이 유효하지 않거나 이미 처리 중일 때만 제출을 비활성화합니다. 무관한
  Checkbox를 요구하지 않습니다.
- 중복 제출을 막고 Text 또는 Semantic Busy 상태를 노출합니다.
- 검증 또는 Network 실패 시 닉네임, 선택 지역, 연결 신원 문맥 및 안전한 복귀
  목적지를 보존합니다.
- 사용자 관점에서 완료는 Atomic해야 합니다. 프로필이 완료되고 인증 Session이
  그 상태를 반영하기 전에는 성공을 주장하지 않습니다.
- 국가/지역은 활성 언어를 덮어쓰면 안 됩니다.
- 성공한 목적지에서 간결한 일회성 Status를 알릴 수 있지만, 추가 페이지가
  되거나 목적지 작업을 막으면 안 됩니다.

## 오류 및 복구 계약

| 상태                                       | 사용자에게 보이는 의미                  | 기본 복구               | 보조 복구                        |
| ------------------------------------------ | --------------------------------------- | ----------------------- | -------------------------------- |
| Discord 인증 취소                          | Login이 완료되지 않음                   | Discord 다시 시도       | 공개 NosLog 둘러보기             |
| OAuth State 누락·무효·만료                 | Login 시도가 만료됐거나 검증되지 않음   | Login 다시 시작         | 공개 NosLog 둘러보기             |
| Discord 일시 이용 불가                     | NosLog가 Discord 인증을 완료하지 못함   | 재시도                  | 공개 NosLog 둘러보기             |
| 신원 조회 실패                             | NosLog가 Discord 계정을 확인하지 못함   | 재시도                  | 공개 NosLog 둘러보기             |
| 계정 변경 중 다른 곳에 연결된 Discord 신원 | 선택한 신원이 다른 NosLog 계정에 속함   | 기존 계정 설정으로 복귀 | 해결되지 않으면 피드백·오류 제보 |
| Server 또는 구성 오류                      | Login을 일시적으로 사용할 수 없음       | 나중에 재시도           | 공개 NosLog 둘러보기             |
| 보호 행동 전에 Session 만료                | 다시 Login 필요                         | Login 후 복귀           | 공개 문맥으로 복귀               |
| 닉네임 중복                                | 닉네임 사용 불가                        | 닉네임 수정 후 제출     | 없음                             |
| 유효하지 않은 닉네임                       | 명시한 규칙 불충족                      | 식별된 필드 수정        | 없음                             |
| 지역 누락                                  | 지역 하나 필요                          | 지역 선택               | 없음                             |
| 온보딩 저장 실패                           | 계정 설정 미완료                        | 입력을 보존해 재시도    | 로그아웃 후 둘러보기             |
| 복귀 목적지 거절                           | 요청 목적지가 안전하지 않거나 이용 불가 | 다국어 홈으로 계속      | 없음                             |

- Client Secret, 제공자 Response, Stack Trace, 원시 Callback Parameter, DB Code
  또는 “구성을 확인하세요” 같은 운영자 지시를 노출하지 않습니다.
- 같은 시각 오류 Pattern을 사용해도 사용자 취소, 만료·보안 검증, 제공자 실패 및
  서비스 실패를 구분합니다.
- 오류 Text는 사용자를 탓하지 않고 발생한 일과 다음 유용한 행동을 식별합니다.
- 동적 오류와 Busy·완료 상태는 적절한 Live-region 또는 Status Semantics를
  사용합니다. 매 Keystroke를 과도하게 알리지 않습니다.
- 제출한 Form에 오류가 있으면 유용한 경우 간결한 오류 요약으로 Focus하고 첫
  유효하지 않은 Control에 예측 가능하게 접근하게 합니다. Native Label과
  Description을 통해 필드 오류를 연결합니다.

## 반응형 Layout 계약

### Compact 및 모바일

- 콘텐츠 기반 Inline Padding의 유동 Task Column 하나를 사용합니다.
  Application이나 셸을 390px 고정 폭으로 설정하지 않습니다.
- 320 CSS px까지 가로 페이지 Scroll 없이 Reflow합니다.
- 정체성, 목적, 연결 계정 확인, Form 및 이탈을 하나의 의미적 순서로 유지합니다.
- 하단 내비게이션, 전체 일반 헤더, 장식용 Side Illustration 또는 Modal
  온보딩을 사용하지 않습니다.
- 긴 한국어·일본어·영어 오류·고지 Text는 Touch Target 크기를 줄이거나 기본
  행동을 가리지 않고 Wrap됩니다.
- 짧은 Viewport에서는 Form을 세로 Scroll할 수 있지만 완료 행동이 Focus Field나
  오류 Text를 덮으면 안 됩니다.

### Wide Layout

- 읽기 적합한 최대 행 길이와 유동 외부 공간을 가진 집중형 Task Column 하나를
  유지합니다.
- 최종 Foundation은 Compact보다 Form을 조금 넓힐 수 있지만 현재 약 390px
  폭을 보편적 고정 Canvas로 유지하면 안 됩니다.
- Desktop 공간을 채우기 위해 두 번째 Marketing Panel, Testimonial Carousel,
  Feature 목록 또는 일반 제품 내비게이션을 추가하지 않습니다.
- 연결 신원과 두 필드는 콘텐츠가 하나의 명확한 완료 순서를 유지할 때만 사용
  가능한 Inline 공간을 활용할 수 있습니다.

## 접근성 계약

- 공통 셸의 첫 Focus 가능 본문 바로가기, 하나의 `main`, NosLog 홈 Link 및
  일반 신뢰 푸터를 유지합니다.
- 페이지 `h1` 하나, 닉네임의 보이는 Label 및 국가/지역의
  `fieldset`/`legend` 또는 동등한 Native Grouping을 사용합니다.
- Discord 행동의 접근 가능 이름은 행동과 제공자를 모두 식별합니다. Text가
  Discord를 이미 지칭하면 제공자 아이콘은 장식입니다.
- 계정, 선택, Busy, 성공 또는 오류 상태를 Color, Discord 아바타 또는 아이콘
  하나에만 의존하지 않습니다.
- 안내와 오류를 필드에 연결합니다. 유효하지 않을 때만 `aria-invalid`를
  사용하며 이해 가능한 오류 메시지를 Text로 유지합니다.
- Busy 상태는 알림되고 실수에 의한 중복 활성화를 막습니다.
- 인증 복구와 공개 둘러보기 행동은 논리적 순서로 Keyboard 접근할 수 있습니다.
- Redirect된 목적지 문맥은 URL 변경뿐 아니라 Text로도 전달합니다.
- Redirect 뒤 Focus는 Task에 따라 페이지 제목 또는 간결한 문맥 오류·이유
  영역으로 이동합니다. 성공 복귀는 사라진 기존 요소에 Focus하려 하지 않고
  예측 가능한 페이지 시작점을 제공합니다.
- WCAG 2.2 AA 대비, Focus Appearance, Target Size, Reflow, Accessible
  Authentication, Error Identification, Error Suggestion 및 Status Message
  요구사항을 충족합니다.

## 다국어 및 콘텐츠 계약

- 한국어, 일본어 및 영어의 Login, 온보딩, 고지, 목적지 문맥, 오류, Busy,
  로그아웃 및 완료 문자열을 모두 제공합니다.
- 세 언어에서 Discord로 계속하기, 계정 설정 완료, 로그아웃하고 둘러보기,
  재시도 및 로그인하지 않고 둘러보기라는 같은 의미의 행동 어휘를 유지합니다.
- `NosLog`, `Discord`, Route 식별자, 구현 Mapping의 OAuth 용어 또는 공식
  전체 대문자 `NOSTALGIA` 서비스명을 다른 제품 정체성으로 번역하지 않습니다.
- 지역 표시 Label은 현지화하되 저장 값은 안정적으로 유지합니다.
- 국가/지역에서 언어를 파생하지 않습니다.
- 문맥 문장은 보간한 경로가 아니라 사람이 이해하는 목적지 이름을 사용합니다.
- 오류 문구는 일본어·영어에서 크게 길어질 수 있으므로 Control 배치가 한국어
  문자열 길이에 의존하면 안 됩니다.
- 최종 법률 문구는 개인정보·법률 검토가 필요하지만 승인된 제품 데이터 경계와
  최소 고지는 Copy 편집으로 제거할 수 없습니다.

## 데이터 및 대표 콘텐츠 요구사항

디자인·구현 표본에는 다음을 포함합니다.

1. 완료된 재방문 계정과 신규 미완료 계정;
2. 8자보다 짧고 24자보다 긴 Discord 표시 이름;
3. 한국어, 일본어, Latin, 숫자 및 허용 문장부호의 사용 가능·중복 NosLog
   닉네임;
4. 세 인터페이스 언어의 한국, 일본 및 글로벌/기타 지역 선택;
5. 복귀 목적지 없는 직접 Login;
6. 프로필과 다른 계정 전용 페이지 하나로 복귀하는 문맥형 Login;
7. 사용자 취소 OAuth, 만료 State, 제공자 실패 및 서비스 실패;
8. 사용 가능한 대체물이 있는 Discord 아바타 누락;
9. 입력을 보존하는 온보딩 검증·Server 실패;
10. 320, 390, 중간 및 1280 CSS px Layout;
11. Keyboard 전용 완료와 Screen Reader 오류·Status 동작;
12. 로그아웃 후 둘러보기 뒤 같은 미완료 계정을 재개하는 후속 Login.

## 구현 Mapping

| 관심사         | 현재 Source                                                                                  | 필수 2.0 Mapping                                                                          |
| -------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 인증 셸        | [`app/(auth)/layout.tsx`](<../../app/(auth)/layout.tsx>)                                     | 최소 정체성, 건너뛰기, 하나의 main, 신뢰 푸터 및 유동 반응형 폭 보존                      |
| Login 페이지   | [`app/(auth)/login/page.tsx`](<../../app/(auth)/login/page.tsx>)                             | Discord 행동 하나, 목적지 문맥, 데이터 고지, 개인정보처리방침, 공개 둘러보기, 분류된 복구 |
| OAuth 시작     | [`app/(auth)/discord/start/route.ts`](<../../app/(auth)/discord/start/route.ts>)             | Server-side 신뢰 복귀 목적지, 일회용 State, 최소 `identify` Scope                         |
| OAuth Callback | [`app/(auth)/discord/complete/route.ts`](<../../app/(auth)/discord/complete/route.ts>)       | 취소·보안 만료 구분, 신규 사용자 온보딩을 거친 복귀 보존, 안정적 Discord ID 동작          |
| 온보딩 페이지  | [`app/(auth)/onboarding/page.tsx`](<../../app/(auth)/onboarding/page.tsx>)                   | 목적지 이유, Discord 신원 행, 승인된 두 필드 Form, 로그아웃 후 둘러보기                   |
| 온보딩 Form    | [`components/onboarding/onboardingForm.tsx`](../../components/onboarding/onboardingForm.tsx) | 설정 닉네임 규칙, 지역 Grouping, 연결된 오류, Busy 보호, 언어 변경 금지                   |
| 온보딩 Action  | [`app/(auth)/onboarding/actions.ts`](<../../app/(auth)/onboarding/actions.ts>)               | Atomic 완료, 비로그인 설정 보존, 국가·언어 독립, 안전 복귀                                |
| 완료 Route     | [`app/(auth)/onboarding/complete/route.ts`](<../../app/(auth)/onboarding/complete/route.ts>) | 추가 페이지 없이 검증된 목적지 또는 다국어 홈 복귀                                        |
| Gate 및 Locale | [`proxy.ts`](../../proxy.ts)                                                                 | 미완료 프로필 Gate, 완료 사용자 우회, Session 만료 복귀, 안전하지 않은 Redirect 금지      |
| Session        | [`lib/session.ts`](../../lib/session.ts)                                                     | 안전한 Session 속성 보존, 정확한 수명은 보안 정책                                         |
| OAuth Test     | [`tests/discord-oauth.test.ts`](../../tests/discord-oauth.test.ts)                           | 취소, 무효 복귀, 신규 사용자 목적지 보존 및 복구 Case 추가                                |
| 온보딩 Test    | [`tests/onboarding.test.ts`](../../tests/onboarding.test.ts)                                 | 표시 보존 닉네임, 언어 독립, 신원 확인 데이터, 로그아웃, 재개 및 안전 복귀 추가           |
| 다국어         | 현재 Locale Message Catalog                                                                  | 일치하는 ko/ja/en 목적지, 고지, 상태 및 복구 문자열 추가                                  |

이 표는 승인된 동작을 향후 작업에 Mapping합니다. 이번 디자인 가이드 세션의
Production 코드 변경을 승인하지 않습니다.

## 브라우저 승인 계약

향후 구현은 실제 브라우저에서 다음을 검증하기 전에는 승인하지 않습니다.

1. 320, 390, 중간 및 1280 CSS px의 비로그인 일반 Login;
2. 가로 넘침 없는 한국어, 일본어 및 영어 Login;
3. 목적지를 지칭하고 완료 계정 OAuth 뒤 그곳으로 돌아가는 문맥형 Login;
4. 온보딩 전체에서 목적지를 보존하는 신규 Seed 계정;
5. 원시 ID를 노출하지 않고 올바른 Discord 아바타·표시 이름을 보여주는 온보딩;
6. 입력을 보존하고 프로그램 방식으로 연결된 닉네임·지역 오류;
7. 활성 UI 언어를 바꾸지 않는 국가/지역 선택;
8. 중복을 막고 Session을 갱신하며 검증된 내부 목적지로만 돌아가는 완료;
9. 미완료 계정의 직접 프로필 접근이 온보딩으로 Redirect되고 문맥 이유를
   표시하며 완료 뒤 프로필로 돌아가는 동작;
10. Session을 지우고 다국어 공개 홈을 여는 `로그아웃하고 둘러보기`;
11. 같은 미완료 Discord 계정으로 다시 로그인했을 때 중복 계정 없이 온보딩 재개;
12. 공개 둘러보기를 유지하면서 유용한 복구를 구분하는 OAuth 취소,
    유효하지 않음·만료 State, 제공자 실패 및 Server 실패;
13. 중복 또는 매 Keystroke 잡음 없이 동적 오류, Busy 및 완료를 알리는 Screen
    Reader;
14. 정체성, 기본 행동·Form, 이탈 및 푸터 순서의 Keyboard Focus;
15. 2차원 페이지 Scroll을 만들지 않는 320 CSS px Reflow와 200%·400% Zoom;
16. Index되지 않는 Login, 온보딩, Callback 및 오류 페이지;
17. UI, Client State, 브라우저에 노출된 Log 또는 Navigation History에 나타나지
    않는 Discord Access Token, Secret, 원시 제공자 Response 및 안전하지 않은
    복귀 URL.

현재 확보하지 못한 실제 미완료 프로필 상태는 구현 승인 전에 Seed된 E2E와 실제
브라우저 표본으로 다뤄야 합니다. Unit, Type, Lint 및 Build 검사는 이 상태 기반
브라우저 검증을 대체하지 않습니다.

## 레퍼런스 Matrix

| 출처                                                                                                                             | 이전 가능한 원칙                                         | NosLog 적용                                   | 한계                                                     |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------- |
| [Apple HIG: Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding)                                | 온보딩 집중, 비필수 설정 연기                            | 닉네임·지역만 요청                            | Apple Native 가이드는 NosLog Web Styling을 정의하지 않음 |
| [W3C Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/)                                                                    | 짧은 Form, Label, Grouping, 검증 및 알림이 이탈 감소     | 두 필드 Native Semantics                      | 제품 계층은 규정하지 않음                                |
| [W3C Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html)                                          | 같은 과정의 동일 정보 재입력 방지                        | Discord 신원·비로그인 설정 재사용             | NosLog 필수 필드는 결정하지 않음                         |
| [W3C Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum)                   | 전체 인증 경로에서 인지 장벽 방지                        | 외부 제공자 행동 하나와 이해 가능한 복구      | Discord 제공자 UI는 NosLog 통제 밖                       |
| [W3C Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification)                                     | 오류와 해당 항목을 Text로 식별                           | 닉네임·지역 오류 연결                         | 최종 오류 Styling은 규정하지 않음                        |
| [W3C Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)                                        | 알 수 있는 수정 방법 제공                                | 닉네임·재시도 안내                            | 보안 오류는 의도적으로 일반적일 수 있음                  |
| [W3C Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                               | 동적 결과·Busy·오류를 프로그램 방식으로 노출             | OAuth·Form Status Semantics                   | 지나치게 말이 많은 경험 방지 필요                        |
| [W3C User Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)                                                  | 입력 보존, 메시지 연결, 예측 가능한 오류 Focus           | 온보딩 복구·오류 요약                         | 예시 Presentation은 NosLog 시각 출처가 아님              |
| [GOV.UK Button](https://design-system.service.gov.uk/components/button/)                                                         | 명확한 기본 행동 하나와 중복 제출 방지                   | Discord CTA·완료 행동 하나                    | 정부 Styling은 시각 권위가 아님                          |
| [GOV.UK Create a username](https://design-system.service.gov.uk/patterns/create-a-username/)                                     | 필요한 경우만 사용자명 요청, 고유성 설명                 | 이후 편집 가능한 NosLog 공개 닉네임           | GOV.UK 문자 모델은 NosLog Unicode 규칙과 다름            |
| [Carbon Progress Indicator](https://carbondesignsystem.com/components/progress-indicator/usage/)                                 | 3단계 미만에는 진행 표시기 미사용                        | 한 화면 온보딩에 진행 UI 없음                 | Carbon 시각 Anatomy는 권위가 아님                        |
| [Microsoft Design: Reimagining our front door](https://microsoft.design/articles/reimagining-our-front-door/)                    | 차분하고 집중된 Sign-in은 혼잡·막다른 길 감소            | 절제된 Login·복구 경로                        | Enterprise 규모는 NosLog와 다름                          |
| [Primer Feature Onboarding](https://primer.style/product/ui-patterns/feature-onboarding/)                                        | 문맥, 근접성, 우세, 닫기·복귀가 이해에 영향              | 목적지 이유·명시적 이탈                       | Feature 교육은 계정 완료보다 넓음                        |
| [Primer Getting Started](https://primer.style/product/getting-started/)                                                          | 익숙한 반응형 Pattern의 포용성                           | Native Form·예측 가능한 Task 순서             | GitHub 제품 문맥과 다름                                  |
| [Atlassian Empty State](https://atlassian.design/foundations/content/designing-messages/empty-state)                             | 다음 행동이 있는 간결한 메시지                           | 간결하게 분류된 인증 복구                     | 인증 오류는 일반 Empty State와 다름                      |
| [OAuth 2.0 Security BCP, RFC 9700](https://datatracker.ietf.org/doc/rfc9700/)                                                    | Callback 검증, Open Redirect 방지, 안전한 State          | 신뢰 내부 복귀·State 처리                     | Layout이 아닌 Engineering 보안 권위                      |
| [Discord OAuth2](https://docs.discord.com/developers/platform/oauth2-and-permissions)                                            | Scope가 제공자 데이터 접근 정의                          | `identify`만 유지                             | Discord가 자체 인증 화면 통제                            |
| [Discord User Resource](https://docs.discord.com/developers/resources/user)                                                      | 안정 ID와 프로필 필드의 의미 구분                        | 안정 계정 연결+표시·아바타 확인               | 제공자 필드는 변경되거나 없을 수 있음                    |
| [GitHub OAuth 권장사항](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/best-practices-for-creating-an-oauth-app) | 최소 Scope·안정 고유 ID 저장                             | Discord 최소 Scope·안정 ID 경계 지원          | GitHub 권한은 Discord와 다름                             |
| [GitHub OAuth 승인](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/authorizing-oauth-apps)                          | 사용자가 App과 요청 정보를 이해                          | 인접 데이터 고지·Privacy Link                 | GitHub 제공자 화면은 NosLog UI가 아님                    |
| [Google 서드파티 접근](https://support.google.com/accounts/answer/14012355)                                                      | 제공자 Credential과 서드파티 계정 분리, 요청 데이터 검토 | Discord 비밀번호 미공유·NosLog 계정 분리 설명 | Google 고유 필드·Control은 다름                          |
| [Steam Help: Sign in](https://help.steampowered.com/en/login)                                                                    | 넓은 Site 내비 없이 기본 로그인과 보이는 복구 공존       | 집중 인증 셸·보조 복구 지원                   | Steam은 비밀번호·QR을 사용                               |
| [osu! Registration](https://osu.ppy.sh/wiki/en/Registration)                                                                     | 리듬게임 서비스의 독립 공개 계정 신원·규칙               | 명시적 NosLog 닉네임 의미 지원                | osu!는 자체 비밀번호·계정 생성 관리                      |
| [Osekai INEX](https://inex.osekai.net/)                                                                                          | 공개 리듬게임 탐색과 제공자 연결 계정 기능 공존          | Discord 인증 옆 공개 둘러보기 유지            | osu! 신원과 다른 기능 집합 사용                          |
| [현재 Login](<../../app/(auth)/login/page.tsx>)                                                                                  | Discord 행동 하나, Privacy, 공개 둘러보기 Baseline       | 검증된 기능 의도 보존, 고정 구성 교체         | 현재 계층·오류는 2.0 권위가 아님                         |
| [현재 온보딩](<../../app/(auth)/onboarding/page.tsx>)                                                                            | 필수 두 필드와 완료 Gate 확립                            | 최소 Domain 요구사항 보존                     | 대문자·국가-Locale 연결은 대체됨                         |

### 근거 수렴

- 보안 출처는 최소 권한, 안정적인 제공자 신원, State 검증 및 신뢰할 수 있는 복귀
  목적지에 수렴합니다.
- 접근성·Form 출처는 짧은 입력, Native Semantics, 연결된 오류, 값 보존 및
  프로그램 방식 Status에 수렴합니다.
- 실제 서비스는 전체 제품 Dashboard보다 집중된 Sign-in Task와 보이는 복구에
  수렴합니다.
- 리듬게임 비교군은 공개 탐색과 제공자 연결 계정 기능의 공존을 지지하지만
  NosLog의 Discord 전용·두 필드 제품 계약을 덮어쓰지 않습니다.
- 신뢰할 수 있는 근거 중 NosLog의 Login·가입 분리, 추가 온보딩 필드, 진행
  표시기 또는 국가를 언어로 취급하는 방향을 지지하는 것은 없습니다.

## 거절 및 대체한 대안

- **Login과 가입 Control 분리 — 거절:** 하나의 Discord Flow가 계정 존재 여부를
  판단하므로 두 Control은 거짓 제품 구분을 표현합니다.
- **다른 신원 제공자 추가 — 2.0에서 거절:** 검증된 NosLog 필요나 계정 연결
  계약이 없습니다.
- **비밀번호 재설정 또는 Email 복구 — 거절:** NosLog는 비밀번호·Email 인증
  Credential을 저장하지 않습니다.
- **공개 탐색에도 인증 강제 — 거절:** 공개 Discovery는 승인된 서비스 경로입니다.
- **미완료 인증 프로필의 개인화 Surface 사용 허용 — 거절:** 애매한 신원, 기록,
  지역 랭킹 및 공개 범위 상태를 만듭니다.
- **미완료 프로필 Redirect 전 경고 Modal — 거절:** 필수 Form을 해결하지 못한 채
  단계만 추가하며 목적지 문맥은 온보딩에 속합니다.
- **미완료 온보딩에서 이탈 없음 — 대체:** 명시적인 로그아웃과 공개 홈을
  사용합니다.
- **온보딩 뒤 원래 목적지 폐기 — 대체:** 전체 Flow에서 검증된 내부 목적지
  하나를 보존합니다.
- **임의 Client `returnTo` URL 사용 — 거절:** Server가 검증한 Same-origin의
  승인된 사용자 목적지만 사용합니다.
- **원시 기술 OAuth 오류 표시 — 거절:** Secret·운영자 지시 없이 취소, 만료,
  제공자 및 서비스 복구를 분류합니다.
- **필수 동의 Checkbox — 이후 법률 검토가 요구하지 않는 한 거절:** 간결한 인접
  고지와 명시적 Discord 행동이 승인된 제품 Pattern입니다.
- **NosLog 닉네임 대문자 강제 — 대체:** 승인된 Unicode 닉네임을 보존하고 공식
  NOSTALGIA 플레이어명만 대문자로 유지합니다.
- **국가/지역에서 언어 파생 — 대체:** 언어 설정과 플레이 지역은 독립적입니다.
- **온보딩에 아바타, 선호 오락실, 공개 범위, 데이터 연동 또는 Tutorial 추가 —
  거절:** 선택적 후속 Task 또는 이미 확립된 설정 목적지입니다.
- **진행 표시기 사용 — 거절:** 승인된 Task는 입력 그룹 두 개의 한 화면입니다.
- **인증 콘텐츠를 Application 390px 고정 폭으로 설정 — 대체:** 390px은 대표
  Review Canvas이지 고정 폭·Breakpoint가 아닙니다.
- **Wide Marketing Split-screen 추가 — 거절:** Wide 적응은 추측성 콘텐츠 없이
  집중 인증 Task를 보존해야 합니다.

## 결정 기록

| ID      | 결정                                                                        | 상태   |
| ------- | --------------------------------------------------------------------------- | ------ |
| AUTH-01 | Discord를 NosLog 2.0의 유일한 인증 제공자로 유지                            | `승인` |
| AUTH-02 | “Discord로 계속하기” 행동 하나 사용, Login·가입 분리 안 함                  | `승인` |
| AUTH-03 | 인증 없이 공개 둘러보기 유지                                                | `승인` |
| AUTH-04 | 행동 Trigger Login에 사람이 이해하는 간결한 목적지 문맥 표시                | `승인` |
| AUTH-05 | Login·OAuth·온보딩 전체에 Server 검증 내부 목적지 하나 보존                 | `승인` |
| AUTH-06 | 안전한 목적지가 없으면 다국어 홈 사용                                       | `승인` |
| AUTH-07 | Discord `identify`만 요청, 비밀번호·Email·Guild·메시지 접근 암시 금지       | `승인` |
| AUTH-08 | 기본 행동 뒤 간결한 Discord 데이터 고지와 Inline 개인정보처리방침 Link 배치 | `승인` |
| AUTH-09 | 이후 법률 검토가 요구하지 않는 한 별도 동의 Checkbox 미사용                 | `승인` |
| AUTH-10 | NosLog 닉네임·국가/지역만 있는 한 화면 온보딩 사용                          | `승인` |
| AUTH-11 | Discord 아바타·표시 이름을 Compact 읽기 전용 연결 계정 확인으로 표시        | `승인` |
| AUTH-12 | 설정 닉네임 규칙 재사용, 대문자 강제 금지                                   | `승인` |
| AUTH-13 | 국가/지역과 UI 언어 독립                                                    | `승인` |
| AUTH-14 | 신규 계정에 승인된 명시적 비로그인 언어·제목 설정 상속                      | `승인` |
| AUTH-15 | 진행 표시기, Tour 및 추가 프로필·설정 필드 미추가                           | `승인` |
| AUTH-16 | 미완료 인증 프로필을 일반·개인화 사용 전에 온보딩으로 Gate                  | `승인` |
| AUTH-17 | 직접 프로필·계정 전용 접근을 경고 Modal 없이 온보딩으로 Redirect            | `승인` |
| AUTH-18 | 온보딩 안에 간결한 목적지 인지형 이유 표시                                  | `승인` |
| AUTH-19 | 성공 완료 뒤 검증된 목적지로 바로 복귀                                      | `승인` |
| AUTH-20 | “로그아웃하고 둘러보기” 제공, 다국어 공개 홈 복귀                           | `승인` |
| AUTH-21 | 이후 Login에서 같은 미완료 계정 재개, 중복 생성 금지                        | `승인` |
| AUTH-22 | OAuth 취소, 만료·보안, 제공자 및 서비스 실패 구분                           | `승인` |
| AUTH-23 | Form 입력 보존과 연결된 프로그램 방식 오류·Status 제공                      | `승인` |
| AUTH-24 | 프로필·더보기·하단 내비 없는 최소 정체성+신뢰 푸터 셸 사용                  | `승인` |
| AUTH-25 | 320 CSS px까지 유동 집중 Task Column 사용, 셸을 390px로 고정하지 않음       | `승인` |
| AUTH-26 | 한국어·일본어·영어에서 같은 의미 계약·복구 유지                             | `승인` |
| AUTH-27 | 향후 브라우저·E2E 승인에 Seed된 미완료 계정 요구                            | `승인` |

## Handoff 경계

Claude Design은 Discord 행동 하나, 공개 둘러보기 대안, 목적지 문맥, 인접 고지,
두 필드 온보딩, 연결 계정 확인, 미완료 프로필 Gate, 로그아웃 이탈, 안전한 복귀,
오류 분류, 의미적 순서 및 반응형·접근성 계약을 보존해야 합니다. 이후 승인할
Foundation 안에서 최종 타이포, 간격, Component Styling 및 콘텐츠 기반 폭을
정할 수 있습니다. 다른 제공자, Login·가입 분리, 선택적 온보딩 Module, 진행
Stepper, 온보딩 전 경고 Modal 또는 Desktop Marketing Panel을 발명하면 안
됩니다.

향후 Codex 구현 세션은 이 기획서를 OAuth, Session, Proxy, 다국어, DB, Unit,
E2E 및 브라우저 동작에 Mapping해야 합니다. Discord Platform 정책, 개인정보·
법률 검토 또는 구현 보안이 크게 다른 Scope, 복귀 Flow, 동의 방식 또는 계정
상태를 요구하면 충돌을 보고하고 구현 전에 가이드 개정 승인을 받아야 합니다.
