# NosLog 2.0 데이터 연동 페이지 기획서

## 문서 관리

- 상태: `Approved`
- 결정 상태: `Complete 데이터 연동 페이지 계약 승인: 최초 사용과 재방문 사용의
계층, 명시적인 전체·최근 연동 범위, 누적 Coverage, 처리·지연·부분 완료·실패·복구
상태, 간결한 결과 미리보기와 최근 시도 이력, 계정 전용 북마클릿 보안, 텍스트
중심의 미디어 안내, 반응형 동작, 접근성, 현지화 및 브라우저 인수 기준`
- 근거 상태: `저장소, 스키마, 테스트, 현재 인터페이스 및 로그인 브라우저 조사;
승인된 정보 구조와 홈 계약; 인용한 공식 NOSTALGIA, 리듬게임 기록 Import,
프로덕션 Import, 브라우저, 보안, 접근성, 반응형 및 Disclosure 레퍼런스; 사용자
승인 결정 기록`
- 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 정본 언어: 영어
- 영어 원본:
  [13-data-sync-page-brief.md](./13-data-sync-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 관련 홈 계약:
  [03-home-page-brief.ko.md](./03-home-page-brief.ko.md)
- 범위: 현지화된 공개 데이터 연동 진입, 로그인 북마클릿 설치·실행 안내, 시도와
  Coverage 보고, 짧은 시도 이력, 복구, 토큰 무효화, 보안·개인정보 설명, 반응형
  구성, 접근성, 현지화 및 향후 구현 인수 기준
- 제외: 관리자 연동 모니터 재설계, 검증된 수집 Pipeline 교체, 공식 API 직접
  연동, 자동 Background 연동, p.eagate Credential·Cookie 저장, 최종 Foundation
  token, 최종 high-fidelity 구성 및 이번 디자인 가이드 세션의 프로덕션 구현

## 결정 라벨

- **Observed:** 저장소, 현재 브라우저 근거, 승인된 상위 산출물 또는 인용 출처에서
  확인된 내용입니다.
- **Approved:** 사용자가 명시적으로 승인했으며 후속 디자인의 권위가 있는 내용입니다.
- **Proposed:** 사용자 승인을 기다리는 근거 기반 방향입니다.
- **Open:** 추가 조사, 테스트 또는 사용자 결정이 필요합니다.
- **Rejected:** 검토 후 명시적으로 선택하지 않은 내용입니다.
- **Superseded:** 이후 승인 방향으로 대체된 내용입니다.

이 기획서는 데이터 연동 페이지의 제품 의미, 콘텐츠, 정보 계층, 데이터 의미,
상호작용, 복구, 보안, 개인정보, 반응형 동작, 상태 및 인수 기준의 권위입니다.
정확한 타이포, 색상, 간격, radius, elevation, Illustration 표현, 미디어 Frame,
Card 표현, Control 치수, grid track 및 콘텐츠 기반 전환값은 Foundation과 후속
Claude Design 작업으로 남깁니다. 후속 시각 작업은 표현을 다듬을 수 있지만 이
제품 계약을 삭제하거나 재해석할 수 없습니다.

## 목적

데이터 연동 페이지는 순서대로 다음 다섯 질문에 답합니다.

> 내 NOSTALGIA 데이터가 현재 연동되어 있는가, 지금 무엇을 해야 하는가, 최근
> 시도가 무엇을 추가하거나 갱신했는가, NosLog가 현재 어디까지 보유하고 있는가,
> 그리고 과정이 실패했을 때 어떻게 안전하게 복구할 수 있는가?

이는 반복 가능한 플레이 데이터 전송이자 신뢰 확인 화면이며, 단순한 일회성
북마클릿 Tutorial이 아닙니다. KONAMI 공식 연동, 비밀번호 관리자, 지속적인
Background 동기화 서비스, 관리자 Log Viewer 또는 원시 기술 진단 Console이
아닙니다.

## 주 사용 맥락과 성공 조건

- **Approved upstream:** 데이터 연동은 Play support의 독립 목적지이자 주 목적지
  Collection 뒤의 시각적으로 구분된 홈 행으로 유지합니다. 악곡이나 프로필 안에
  숨기지 않습니다.
- **Approved:** 오락실 플레이 후 모바일 사용이 주 맥락입니다. 재방문 사용자는
  설치 Tutorial을 다시 읽기 전에 연동 상태를 이해하고 다음 연동을 시작할 수
  있어야 합니다.
- **Approved:** 최초 사용은 외부 설명 없이도 북마클릿을 설치하고 실행할 수 있을
  정도로 명시적이어야 합니다.
- **Approved:** 비로그인 방문자는 데이터 연동이 무엇을 하고, 어떤 데이터를
  보내며, 무엇을 보내지 않고, 로그인이 어떻게 계정 전용 북마클릿을 활성화하는지
  이해하면 성공합니다.
- **Approved:** 로그인한 최초 사용자는 북마클릿을 설치하고 공식 NOSTALGIA
  페이지를 열어 실행한 뒤 이해 가능한 결과를 받으면 성공합니다.
- **Approved:** 재방문 사용자는 최근 상태, 명확한 다음 행동 하나, 최근 결과 및
  필요한 복구를 즉시 볼 수 있으면 성공합니다.
- **Approved:** 공식 상세 데이터가 없을 때 최근 기록만 연동되는 것도 올바른 성공
  결과입니다. 전체 Catalog를 포함하지 않았다는 이유로 실패하거나 손상된 연동으로
  표현하지 않습니다.
- **Approved:** 데스크톱도 필수입니다. 추가 폭은 고정 약 `390px` Shell을 유지하는
  대신 상태·결과와 설치·복구를 나란히 이해하는 데 사용합니다.
- **Approved:** 현재 스타일과 Geometry는 감사 근거이지 NosLog 2.0의 시각 권위가
  아닙니다.

## 현재 제품 및 도메인 근거

### 저장소와 데이터 근거

- **Observed:** 현지화된 공개 경로는 현재 `/[locale]/bookmarklet`입니다. 비로그인
  방문자는 안내를 읽을 수 있으며, 계정 전용 북마클릿 생성과 개인 결과 확인에는
  로그인이 필요합니다.
- **Observed:** `createSyncToken`은 `{ userId, version }`을 HMAC으로 서명합니다.
  토큰 자체에는 시간 만료가 없습니다. `sync_token_version`을 증가시키면 해당
  사용자가 이전에 생성한 모든 북마클릿이 무효화됩니다.
- **Observed:** 북마클릿은 공식 `https://p.eagate.573.jp` Origin에서만 실행되고,
  플레이어 데이터와 최근 기록을 읽으며, 가능한 경우 상세 악곡 데이터를 요청한
  뒤 구조화된 결과와 NosLog 연동 토큰을 NosLog로 보냅니다.
- **Observed:** 전송 과정은 사용자의 p.eagate 비밀번호나 p.eagate 로그인 Cookie를
  NosLog로 보내지 않습니다. 계정 전용 토큰은 북마클릿 코드 안에 포함되며 독립된
  Secret처럼 표시하거나 Log에 기록하면 안 됩니다.
- **Observed:** 수신 Endpoint는 정확한 p.eagate Origin과 JSON을 요구하고,
  Request Body를 `8 MB`로 제한하며, 최근 기록 `100`개와 악곡 데이터 `2,000`개를
  상한으로 두고, `30`초 Cooldown 및 사용자당 Processing 시도 하나만 허용합니다.
- **Observed:** Processing 시도는 최대 `15`분 동안 활성 상태일 수 있습니다. 그
  Timeout을 넘긴 뒤 새 요청이 오면 이전 시도를 실패 처리합니다. 관리자 Health
  Monitoring은 이미 `10`분 이상 Processing을 지연으로 봅니다.
- **Observed:** 전체 연동은 프로필을 갱신하고, 중복 제거된 최근 플레이 Event를
  누적하고, 알려진 채보에만 현재 기록을 반영하고, 값이 바뀐 경우에만 기록
  Snapshot을 저장하며, 의존 사용자·랭킹 데이터를 다시 계산합니다.
- **Observed:** 최근 연동은 프로필과 누적 최근 플레이를 갱신하지만 전체 현재 채보
  기록을 교체하지 않습니다. 기존 전체 기록은 계속 유지됩니다.
- **Observed:** `ChartPlayHistory`는 사용자, 채보, 원본 플레이 시각, 점수, 최대
  Combo, Rank로 중복을 제거합니다. `ChartRecordSnapshot`은 연동·채보별로 변경된
  전체 기록 상태만 저장합니다. 따라서 반복 시도는 동일 플레이 Event를 중복
  저장하지 않으면서 이력을 지원합니다.
- **Observed:** 알 수 없는 악곡 채보는 제외됩니다. Notice를 기록하면서도 시도는
  완료될 수 있습니다. 현재 공개 요약은 이를 Boolean으로만 줄이며, 원시 제외 채보
  ID와 내부 Message는 관리자 영역에만 남습니다.
- **Observed:** `DataSync`는 시도 상태, 범위, 수신한 최근 플레이, 삽입한 플레이,
  변경 기록, 선택적 내부 Message, 시작 및 완료 시각을 저장합니다. 현재 공개
  Query는 최근 시도 하나만 읽습니다.
- **Observed:** 현재 Coverage는 `PlayData`와 누적 이력에서 별도로 계산됩니다.
  플레이한 채보, 전체 판정 수가 있는 채보 및 FAST/SLOW 이력이 있는 채보입니다.
- **Observed:** 개인정보 처리방침은 프로필, 플레이, 판정, 레이팅 및 연동 기록을
  회원 탈퇴 시까지 보관하며 Credential을 저장하지 않는다고 명시합니다.

### 현재 인터페이스와 브라우저 근거

- **Observed:** 현재 페이지는 상태, 토큰 초기화, 최근 결과, 북마클릿 설치 및 실행
  안내를 하나의 긴 고정 폭 열에 배치합니다.
- **Observed:** 최근 결과를 펼치면 시도 범위, 수신·삽입 최근 플레이, 변경 기록 및
  현재 판정·Timing Coverage가 보입니다. 과거 시도나 변경 항목 미리보기는 없습니다.
- **Observed:** 설치 Component는 데스크톱 Drag 안내와 모바일 Bookmark 편집 안내
  사이를 전환합니다. 텍스트와 GIF가 모두 존재합니다.
- **Observed:** 토큰 재생성은 이미 즉시 무효화를 설명하는 Modal을 사용하고 초기
  Focus가 비파괴적인 취소 액션에 놓입니다.
- **Observed:** `390×844`에서 닫힌 페이지는 긴 한 열입니다. `320×800` 조사에서는
  문서 수준 가로 Overflow가 없었습니다. 보조 복사 버튼은 높이 `36px`이었으며
  이를 2.0 Target Size 기준으로 삼지 않습니다.
- **Observed:** `1440×900`에서 Main Content는 여전히 약 `390px` 폭 그대로이며
  데스크톱 공간 대부분을 사용하지 않습니다.
- **Observed:** 모바일 설치 안내를 펼치면 키가 큰 GIF 두 개를 추가로 불러옵니다.
  현재 안내 GIF는 Next Image LCP Warning을 만들었지만 Runtime Error는 없었습니다.
- **Observed:** Processing 상태는 자동 갱신되지 않아 사용자가 Reload하기 전까지
  완료된 시도가 계속 Processing으로 보일 수 있습니다.

### 외부 도메인 근거

- **Observed:** 공식 NOSTALGIA Play Data는 최근 `30`곡의 플레이 이력을 제공하고,
  상세 악곡 기록에는 e-amusement 베이직 코스가 필요합니다.
- **Observed:** Tachi, Gitadora-to-Kamaitachi, mai-tools, GITADORA Skill Viewer,
  V-ARCHIVE는 반복 기록 수집, 공식 사이트 추출, 설치 안내, Catalog 누락 제한 및
  이력 보존이 리듬게임 기록 서비스의 확립된 요구임을 보여줍니다.
- **Observed:** Notion과 Slack Import 안내는 Import를 불투명한 제출로 처리하지
  않고 상태, 제한, 완료, 부분 결과, 이력 및 복구를 노출합니다.
- **Observed:** Process List 지침은 간결한 설치 순서와 선형 Step Indicator를
  구분합니다. 북마클릿은 한 번 설치하고 반복 사용하므로 이 페이지는 지속적인
  다중 화면 Wizard가 아닙니다.
- **Observed:** Details와 Accordion 지침은 재방문 다수가 필요로 하지 않는 설치
  콘텐츠를 점진적으로 공개할 수 있음을 뒷받침하지만, 최초 주 작업 완료에 필요한
  콘텐츠를 숨기는 것은 경고합니다.
- **Observed:** Progress 지침은 Duration을 측정할 수 없을 때 Indeterminate 상태를
  요구합니다. 조작된 퍼센트는 Server가 알지 못하는 진행도를 안다고 거짓으로
  암시합니다.
- **Observed:** WCAG 상태 Message와 Modal Dialog 지침은 불필요한 Focus 이동 없이
  Programmatic Announcement하고, 결과가 중대한 확인에는 명확한 Focus 동작을
  요구합니다.
- **Observed:** 보안 지침은 계정 전용·폐기 가능한 Credential, 최소 노출, Log 제외
  및 Credential 교체의 명시적 결과에 수렴합니다.
- **Observed:** 브라우저 북마클릿 안내는 모바일 Bookmark 생성이 흔히 주소 복사와
  Bookmark URL 편집을 필요로 하며 브라우저마다 동작이 다름을 확인합니다.

## 승인 범위와 불변 조건

1. 데이터 연동 진입은 정보가 있는 비로그인, 로그인 최초 사용 및 로그인 재방문
   상태를 하나의 현지화된 공개 경로에서 제공합니다.
2. 재방문 사용자는 설치 안내보다 상태와 다음 연동 액션을 먼저 봅니다.
3. 최초 사용자는 설치·실행 안내가 기본으로 펼쳐진 간결한 설치 Process를 봅니다.
4. 확인할 수 없는 수동 `설치 완료` Checkbox를 요구하지 않습니다.
5. 반복 연동 경로를 영구 Step Indicator 또는 Wizard로 표현하지 않습니다.
6. 반복 주 액션은 공식 NOSTALGIA 페이지를 예상 Context로 열고, 사용자가 설치한
   북마클릿을 그곳에서 명시적으로 실행합니다.
7. 시도 범위와 누적 NosLog Coverage는 별개의 개념이며 별개의 시각 그룹입니다.
8. 전체와 최근 연동은 모두 유효합니다. 최근 연동은 이전 전체 기록을 삭제하거나
   시각적으로 불신하게 만들지 않습니다.
9. 최초 언급은 현지화된 `e-amusement 베이직 코스(Basic Pass)` 상당 표현을
   사용하고 이후에는 `베이직 코스`를 사용할 수 있습니다. 가용성을 설명하되
   NosLog가 이 구독을 판매하거나 통제한다고 암시하지 않습니다.
10. 향후 Pipeline이 전체 작업량과 완료량을 진실하게 측정할 수 있기 전에는
    Determinate 퍼센트를 표시하지 않습니다. 현재 Pipeline은 Indeterminate
    Processing을 사용합니다.
11. Processing 중에는 상태를 자동 갱신합니다. `10`분에 지연으로 전환하고
    `15`분에는 Server Timeout과 일치하는 재시도 복구를 노출합니다.
12. 알 수 없는 채보는 전체 실패가 아니라 `완료 · 일부 제외`를 만듭니다. 공개 UI는
    제외 수와 안전한 설명을 표시하고 원시 ID나 내부 Error를 표시하지 않습니다.
13. 최근 결과 Metric은 사용자 의미의 라벨 `확인한 최근 플레이`, `새로 저장한
플레이`, `최고 기록이 갱신된 채보`를 사용합니다.
14. 최근 결과는 최대 3개의 연결된 변경 미리보기를 보여줄 수 있습니다. 대량 변경이
    있는 최초 전체 연동은 수백 건 변경처럼 표시하지 않고 `첫 전체 기록 등록`으로
    요약합니다.
15. 접힌 `연동 기록`은 최근 시도 5개를 노출합니다. 무한 기술 Audit Log가 아닙니다.
16. 토큰 무효화는 주 연동 액션과 경쟁하는 영구 Warning이 아니라 보조 보안·도움말
    기능입니다.
17. 무효화하면 이 계정의 기존 모든 북마클릿이 즉시 만료되고 재설치가 필수 다음
    행동이 됩니다.
18. 어떤 데이터를 보내는지, p.eagate 비밀번호와 로그인 Cookie를 NosLog로 보내지
    않는지를 명확히 설명합니다.
19. 원시 연동 토큰을 독립된 가시 텍스트로 Render하거나 따로 복사하거나 Client·
    Server Log, Analytics, Monitoring 또는 공개 Error 상세에 기록하지 않습니다.
    서명 토큰은 계정 전용 북마클릿 안에서 기술적으로 필요한 위치에만 포함됩니다.
20. 텍스트 안내만으로도 독립적으로 완료할 수 있어야 합니다. GIF는 안내를 보조하며
    유일한 설명이 되지 않습니다.
21. 페이지는 `320 CSS px`에서 Reflow하고, 데스크톱 추가 공간을 의도적으로 사용하며,
    고정 휴대폰 폭 Shell을 유지하지 않습니다.

## 용어와 데이터 의미

### 사용자 노출 용어

| 의미                       | 필수 사용자 노출 개념 | 암시하면 안 되는 것                     |
| -------------------------- | --------------------- | --------------------------------------- |
| Server 수집 실행 한 번     | 연동 시도             | 지속 연결 또는 Background 연동          |
| 상세 Catalog Response 존재 | 전체 기록             | 지금까지의 모든 개별 플레이 Event       |
| 상세 Catalog Response 없음 | 최근 30개 플레이      | 실패, 삭제 또는 데이터 손상             |
| 현재 저장 완전성           | NosLog Coverage       | 최근 시도 하나의 범위                   |
| 중복 제거 후 새 최근 Event | 새로 저장한 플레이    | 수신한 모든 Row가 새로 저장됨           |
| 현재 채보 기록 변경        | 갱신된 최고 기록      | 이 정확한 시도에서 반드시 플레이함      |
| 알 수 없는 Catalog 항목    | 일부 제외             | 전체 연동 실패                          |
| 서명된 북마클릿 Credential | 계정 전용 북마클릿    | p.eagate 비밀번호 또는 KONAMI 공식 토큰 |

### 시도 범위

- `전체 기록`은 공식 상세 악곡 Response를 사용할 수 있어 최근 플레이 외에 현재
  채보별 기록 Set도 갱신할 수 있었음을 뜻합니다.
- `최근 30개 플레이`는 공식 최근 이력은 받았지만 상세 악곡 Response는 받지 못한
  시도입니다. 새 최근 Event와 프로필 Context를 추가하면서 기존 현재 채보 기록을
  유지합니다.
- 숫자 `30`은 공식 최근 이력 Window이며 NosLog의 삭제 정책이 아닙니다. NosLog는
  승인된 개인정보 계약에 따라 중복 제거된 누적 Event를 보관합니다.

### 현재 NosLog Coverage

Coverage는 최근 Payload에 대한 주장이 아니라 모든 성공 시도 후의 누적 상태입니다.
다음을 표시합니다.

1. 플레이한 채보 수;
2. 전체 판정 상세가 있는 채보 수;
3. FAST/SLOW 상세가 있는 채보 수.

분모가 의미 있고 사용자의 플레이 기록에서 유도되는 경우에만 분자·분모를 표현할 수
있습니다. 세 측정값을 설명 없는 `연동 퍼센트` 하나로 합치지 않습니다.

## 승인된 정보 계층

### 비로그인 진입

하나의 의미론적 `main`과 다음 Source 순서를 사용합니다.

1. 페이지 정체성과 간결한 설명;
2. 무엇을 연동하고 무엇을 수집하지 않는지;
3. 로그인 액션;
4. 설치·실행 Process의 간결한 미리보기;
5. 베이직 코스 범위를 포함한 제한.

비로그인 상태에서 개인 상태, 결과, Coverage, 토큰 또는 이력을 만들지 않습니다.

### 로그인 최초 사용 상태

다음 모바일 우선 Source 순서를 사용합니다.

1. 페이지 정체성;
2. `아직 연동하지 않음` 상태와 간결한 다음 행동 설명;
3. 계정 전용 보안·개인정보 안내;
4. 펼쳐진 북마클릿 설치 Process;
5. 펼쳐진 공식 페이지 실행 Process;
6. 보조 콘텐츠인 문제 해결과 토큰 무효화.

모든 단계가 필요하므로 최초 설치는 간결한 Process List를 사용합니다. 전역 완료
Indicator를 쓰거나 사용자가 단계를 완료했다고 표시하게 하지 않습니다.

### 로그인 재방문 상태

다음 모바일 우선 Source 순서를 사용합니다.

1. 현재 상태와 Timestamp;
2. 주 `NOSTALGIA 페이지 열기` 액션 또는 상태에 맞는 복구 액션;
3. 시도 범위와 현재 Coverage를 별도 그룹으로 포함한 최근 결과;
4. 유용한 경우 최대 3개 변경 미리보기;
5. 접힌 `북마클릿 설치·재설치` 안내;
6. 최근 5개 시도의 접힌 `연동 기록`;
7. 북마클릿 무효화를 포함한 보조 도움말·보안.

실패 원인이 만료 토큰이나 설치 문제로 특정된 경우, 사용자가 접힌 영역을 직접 찾게
하지 않고 관련 복구 안내를 열거나 강하게 노출합니다.

### 넓은 화면 구성

넓은 Layout에서는 의미론적 Source 순서를 보존하면서 의도적인 두 영역을 사용합니다.

- 상태, 주 액션, 최근 결과, Coverage 및 미리보기;
- 설치·복구, 이력 및 보안·도움말.

결과 영역에 더 큰 시각 비중을 줍니다. 빈 데스크톱 Dashboard, 중복 상태 Card 또는
모든 Section을 같은 폭·같은 비중 Box로 만들지 않습니다.

## 액션 우선순위

### 주 액션

- 로그인 최초 사용: 계정 전용 북마클릿 생성·설치.
- 재방문 Idle·완료: `NOSTALGIA 페이지 열기`.
- 만료 토큰: `북마클릿 재설치`.
- Timeout·실패: 다음 유효 단계를 설명한 후 `연동 다시 시도`.

한 상태에서는 주 액션 하나만 강조합니다.

### 보조 액션

- 설치 또는 브라우저별 도움말 펼치기;
- 브라우저 Workflow에 필요할 때 북마클릿 주소 복사;
- 미리보기에서 변경된 악곡 상세 열기;
- 최근 연동 기록 펼치기;
- 반복 오류 제보;
- 기존 북마클릿 무효화.

모든 보조 액션을 영구 상단 액션 행에 놓지 않습니다.

## 설치 및 반복 연동 흐름

### 최초 설치

1. 북마클릿이 현재 NosLog 계정에 귀속되며 공유하면 안 된다고 설명합니다.
2. 지원되는 곳에서 데스크톱 Drag 설치를 제공합니다.
3. 전체 북마클릿 주소를 복사하고 일반 Bookmark를 만든 뒤 URL을 교체하는 모바일·
   브라우저 대체 경로를 제공합니다.
4. 브라우저별 Bookmark URL 편집 제한과 지원되는 대안을 설명합니다.
5. 공식 NOSTALGIA Play Data 페이지에 로그인하도록 안내합니다.
6. 그 공식 페이지에서 북마클릿을 실행하도록 말합니다.
7. 기술적으로 가능하면 NosLog 상태로 돌아오거나 자동 갱신하고, 그렇지 않으면 짧은
   복귀 안내 하나를 제공합니다.

계정 전용 코드를 신뢰할 수 없는 페이지에 붙여넣거나 공유하거나 고객 지원에 보내라고
안내하면 안 됩니다.

### 반복 연동

1. 페이지가 현재 상태와 `NOSTALGIA 페이지 열기`를 제공합니다.
2. 필요하면 사용자가 공식 페이지에 로그인하고 기존 북마클릿을 실행합니다.
3. NosLog가 Indeterminate Processing에 들어가 상태 갱신을 시작합니다.
4. 완료 결과는 시도 범위, 최근 변경 및 현재 Coverage를 구분합니다.
5. 사용자는 미리보기 악곡 상세를 열거나 페이지를 떠날 수 있으며 추가 확인은 필요하지
   않습니다.

### 베이직 코스 제한

- 처음 관련 설명에서는 `e-amusement 베이직 코스(Basic Pass)` 또는 승인된 현지화
  상당 표현을 사용합니다.
- 구독 이름만 말하지 말고 효과를 설명합니다. 공식 상세 데이터가 없어도 현재 시도는
  최근 30개 플레이를 연동할 수 있고 기존 전체 기록은 NosLog에 남습니다.
- 베이직 코스 Response가 없다는 이유만으로 Warning 색상을 사용하지 않습니다.
- 나중에 별도로 승인되지 않는 한 구매 액션을 넣지 않습니다. 넣는 경우에도 평범한
  공식 외부 링크여야 합니다.

## 상태, 시간 및 복구 계약

### 상태 모델

| 상태                      | 보이는 의미                                  | 주 반응                                | 추가 동작                          |
| ------------------------- | -------------------------------------------- | -------------------------------------- | ---------------------------------- |
| 비로그인                  | 계정 전용 북마클릿에 로그인이 필요함         | 로그인                                 | 공개 설명 유지                     |
| 이력 없음                 | 완료하거나 시작한 시도 없음                  | 북마클릿 설치                          | 최초 안내 펼침                     |
| Processing `<10분`        | 연동 처리 중                                 | 중복 제출 없음                         | Indeterminate 상태와 자동 갱신     |
| 지연 `10–<15분`           | 평소보다 오래 걸림                           | 대기, 안전한 복구 도움말 유지          | 갱신 계속, 가짜 퍼센트 없음        |
| Timeout `≥15분`           | 허용 Window 안에 완료하지 못함               | 다시 시도                              | 재시도와 반복 오류 제보 경로       |
| 완료 — 전체               | 사용 가능한 상세 기록과 최근 이력 처리       | 다음 연동을 위해 NOSTALGIA 페이지 열기 | 전체 범위와 Coverage 표시          |
| 완료 — 최근               | 최근 30개 플레이 처리, 이전 전체 데이터 보존 | 다음 연동을 위해 NOSTALGIA 페이지 열기 | 베이직 코스 효과를 중립적으로 설명 |
| 완료 — 일부 제외          | 알려진 데이터 처리, 알 수 없는 채보 제외     | 선택적 상세·나중 재시도                | 제외 수 표시, 원시 채보 ID 없음    |
| 실패 — NOSTALGIA 로그아웃 | 공식 Session 사용 불가                       | NOSTALGIA 로그인 후 다시 실행          | 실행 도움말 열기                   |
| 실패 — 만료 토큰          | 북마클릿 Version 무효                        | 북마클릿 재설치                        | 재설치 도움말 열기                 |
| Cooldown                  | 유효한 시도가 너무 최근 실행됨               | 남은 시간 대기                         | Server Response 기반 Countdown     |
| 실패 — Server·Process     | NosLog가 완료하지 못함                       | 다시 시도                              | 반복 시 오류 제보 제공             |

### 자동 갱신

- 시도가 활성 상태이거나 공식 페이지에서 돌아와 새 시도가 예상될 때만 Poll합니다.
- 시도가 Terminal 상태가 되거나, 페이지가 충분히 오래 숨겨지거나, 사용자가 떠나거나,
  제한된 Network 실패 Threshold에 도달하면 중지합니다.
- Cache-safe Server 데이터를 사용하고 중복 수집 요청을 만들지 않습니다. 상태 Polling은
  북마클릿을 다시 실행하지 않습니다.
- 완료, 부분 완료, 실패, 지연 같은 의미 있는 전환만 알립니다. Poll마다 알리지 않습니다.
- Focus는 사용자가 둔 곳에 유지합니다. 완료 시 결과로 Focus를 이동하지 않습니다.

### 실패 문구

- 한 문장의 짧은 설명과 상태별 다음 행동 하나를 제공합니다.
- 최근 시도가 실패해도 마지막 성공 Coverage를 유지합니다.
- Stack trace, 원시 Exception, 원시 제외 ID, 토큰 조각, DB 식별자 또는 관리자 전용
  진단 Message를 표시하지 않습니다.
- 정확한 실패 분류를 안전하게 얻을 수 없다면 p.eagate Session이나 토큰 문제라고
  추측하지 않고 일반 Server·Process 복구를 사용합니다.

## 결과 및 이력 계약

### 최근 결과

항상 다음을 식별합니다.

- Terminal·활성 상태;
- 활성 Locale의 시작 또는 완료 시각;
- 시도 범위 `전체 기록` 또는 `최근 30개 플레이`;
- 알 수 있을 때 Duration;
- 승인된 사용자 라벨의 시도 Metric 3개;
- 별도의 현재 NosLog Coverage;
- 해당 시 부분 제외 수.

유효한 연동이 새 플레이를 찾지 못한 경우처럼 의미 있는 질문에 답하는 0은 계속
표시합니다. 모든 변경 수가 0일 때 기록 향상을 암시하는 과도한 성공 축하 표현을
사용하지 않습니다.

### 변경 미리보기

- 완료 시도 후 유용한 경우 최대 3개 미리보기를 표시합니다.
- 최근 연동은 새로 저장한 최근 플레이를 우선합니다.
- 전체 연동은 변경된 최고 기록을 우선합니다.
- 각 항목은 전체 기록 Card를 재현하지 않고 악곡, 난이도 및 관련 변경값을 식별합니다.
- 각 항목은 현지화된 악곡 상세로 연결할 수 있습니다.
- 변경 수가 매우 큰 최초 전체 연동은 `첫 전체 기록 등록` 같은 한 개 요약을 사용하며
  수백 개 Baseline Row를 개별 새 성취처럼 표현하지 않습니다.
- 새 항목이나 변경 항목이 없으면 빈 장식 Container를 표시하지 않고 미리보기 영역을
  생략합니다.

### 연동 기록

- 접힌 `연동 기록` 아래에 최근 5개 시도를 최신순으로 유지합니다.
- 각 Row는 현지화 날짜·시간, 상태, 범위, 알 수 있을 때 Duration 및 간결한 시도
  Metric을 표시합니다.
- 부분 완료는 완전 성공 및 전체 실패와 구분됩니다.
- 현재 시도는 목록 위에서 Processing·지연으로 나타날 수 있습니다.
- 이력은 내부 Error, 토큰, 원시 채보 ID, 관리자 Note, Request 크기 또는
  Infrastructure Metadata를 노출하지 않습니다.
- 사용자 페이지에는 무한 Scroll, Pagination, Export 또는 완전한 기술 Audit Log가
  필요하지 않습니다.

## 설치 안내와 미디어 계약

### 점진적 공개

- 로그인 최초 사용: 설치·실행 안내를 펼칩니다.
- 정상 재방문 성공 상태: `북마클릿 설치·재설치`로 묶고 기본적으로 접습니다.
- 관련 설치 실패 또는 만료 토큰: 영향을 받는 안내를 노출합니다.
- 가능한 범위에서 현재 방문 동안 펼침 상태를 보존합니다.

### 텍스트와 GIF의 관계

- 모든 설치·실행 단계에는 완전한 가시 텍스트가 있습니다. Animation이 실패하거나,
  정지하거나, 이해되지 않거나, Load되지 않아도 작업을 완료할 수 있어야 합니다.
- GIF는 같은 국소 액션을 설명하는 보조 자료입니다. 안내를 `Animation을 보세요`로
  대체하거나 Pixel 위치만으로 Control을 식별하지 않습니다.
- Animation이 옆 텍스트에 없는 정보를 추가할 때만 설명형 대체 텍스트를 사용합니다.
  그렇지 않으면 중복을 피하도록 빈 대체 텍스트를 사용합니다.
- 모바일 폭에서 액션을 보기 너무 작을 경우 접근 가능한 확대 또는 전체 미디어 보기를
  제공합니다.
- Reduced motion 환경을 존중합니다. 정지·정적 첫 Frame 또는 사용자 제어 재생만으로도
  이해 가능해야 합니다.
- 재방문 사용자 미디어는 Disclosure를 열기 전까지 미룹니다. 여러 개의 키 큰 GIF가
  초기 Loading 우선순위에서 상태·결과와 경쟁하지 않게 합니다.
- 알려진 치수 또는 같은 의미의 예약 공간으로 종횡비를 유지하고 Cumulative Layout
  Shift를 방지합니다.

### 브라우저별 안내

- 지원되는 데스크톱 Drag와 모바일 Copy·Edit 흐름을 설명하되 모든 브라우저가 동일한
  Label이나 Menu 위치를 쓴다고 주장하지 않습니다.
- Bookmark URL 편집이 불가능하거나 크게 다른 것으로 확인된 브라우저를 식별하고,
  검증된 경우 데스크톱 설치 후 Bookmark 동기화 같은 지원 대안을 제공합니다.
- Clipboard 권한이 실패하면 완전한 다음 단계 설명을 유지하고 복구 가능한 재시도를
  제공합니다. 토큰 부분만 노출하지 않습니다.
- 브라우저가 `javascript:` Bookmark를 차단하는 곳에서는 실행을 보장하지 않습니다.

## 보안 및 개인정보 계약

### 설치 근처의 필수 설명

다음을 간결하게 말합니다.

1. 북마클릿은 현재 NosLog 계정용으로 생성되며 공유하면 안 됩니다.
2. NosLog는 공식 Response가 제공하는 플레이어 정보, 최근 플레이 이력 및 상세 기록만
   받습니다.
3. NosLog는 사용자의 p.eagate 비밀번호나 p.eagate 로그인 Cookie를 받지 않습니다.
4. 연동된 프로필, 플레이, 판정, 레이팅 및 연동 기록은 개인정보 처리방침의 보관 및
   회원 탈퇴 정책을 따릅니다.

이를 영구 Alarm Banner로 만들지 않습니다. 설명은 설치 근처와 도움말·보안에 둡니다.

### 북마클릿 무효화

- `토큰 Version 증가` 같은 구현 용어 대신 `기존 북마클릿 무효화`처럼 결과로 액션을
  명명합니다.
- 이 계정의 모든 기존 북마클릿이 즉시 작동을 멈춘다는 Modal을 엽니다.
- 초기 Focus는 취소 또는 가장 비파괴적인 액션에 둡니다.
- 파괴적 확인을 시각적·의미론적으로 구분하고 마지막 액션 Label에 결과를 명시합니다.
- Escape, 취소 및 닫기는 변경 없이 Focus를 Trigger로 돌려줍니다.
- 성공하면 Modal을 닫고 성공을 알리고 페이지 상태를 갱신하며 재설치를 필수 다음
  행동으로 만듭니다.
- 무효화된 북마클릿을 복구할 수 있다고 암시하지 않습니다. 복구는 새 계정 전용
  북마클릿 생성과 설치입니다.

### 전송과 오류 경계

- 정확한 공식 Origin 검사, Request Schema 검증, Payload 제한, Cooldown, 단일
  Processing 시도 및 no-store Response 동작을 유지합니다.
- 서명 북마클릿, 토큰, Payload, p.eagate 페이지 콘텐츠 또는 비공개 기록 상세를
  Analytics나 Error Report Attachment에 기본으로 넣지 않습니다.
- 공개 결과 미리보기는 로그인한 사용자 본인의 허용된 데이터와 일반 악곡 Metadata만
  노출합니다.
- 연동 실패 Feedback에는 Server가 만든 안전한 시도 ID·시각 및 분류 상태를 포함할 수
  있지만 원시 토큰이나 전체 Payload를 포함하지 않습니다.

## 인증과 권한 계약

### 비로그인

- 안내, 데이터 범주, 제한 및 개인정보 설명은 공개 상태로 유지합니다.
- 계정 전용 설치, 결과, Coverage, 이력 및 무효화에는 로그인이 필요합니다.
- 로그인 후 사용자를 현지화된 데이터 연동 페이지로 돌려보냅니다.

### 로그인

- 사용자는 본인의 북마클릿, 시도, Coverage, 미리보기 및 복구만 봅니다.
- 본인 데이터 연동에는 일반 로그인 사용자 이상의 Role이 필요하지 않습니다.
- 페이지 액션 도중 Session이 만료되면 간결한 로그인 복구를 제공하고 Error에 이전
  Credential을 노출하지 않습니다.

### 관리자 경계

- 관리자 Health, 지연, 원시 Error, 시도 ID, 사용자 조회 및 운영 조사는 별도의 관리자
  화면에 유지합니다.
- 사용자 페이지는 안전한 파생 분류와 제외 수를 사용할 수 있지만 관리자 Log를
  그대로 복제하지 않습니다.

## 반응형 계약

### 좁은 화면

- 대표 `390px`에서 모바일 우선으로 디자인한 뒤 `320 CSS px`와 중간 폭에서 Reflow를
  검증합니다.
- 승인된 재방문 Source 순서인 상태, 다음 행동, 최근 결과, 미리보기, 설치·복구, 이력,
  보안을 사용합니다.
- Label·값 폭에 따라 Metric을 쌓거나 줄바꿈 가능한 작은 Grid를 사용합니다. 3개의
  고정 열을 유지하려고 중요한 Label을 읽기 어려운 크기로 줄이지 않습니다.
- 주 액션은 신뢰 가능한 Touch 폭을 사용합니다. 보조 Icon-only Control에는 접근 가능한
  이름과 충분한 Target이 필요합니다.
- 긴 한국어·일본어·영어 상태 또는 브라우저 안내가 Icon이나 액션과 겹치지 않고
  줄바꿈됩니다.
- GIF·미디어는 Container 안에 유지되며 문서 수준 2차원 Scroll 없이 확대할 수 있습니다.

### 넓은 화면

- 현재 고정 `390px` Content 폭을 유지하지 않습니다.
- 콘텐츠가 허용할 때 제한된 반응형 Container와 두 영역 구성을 사용합니다. 결과·상태를
  주 영역으로, 설치·복구·도움말을 보조 영역으로 둡니다.
- 최근 Metric과 Coverage는 더 넓은 수평 비교를 사용할 수 있지만 CSS 배치 없이도
  Source 순서, Heading 관계 및 Keyboard 순서가 일관되어야 합니다.
- 안내 문장과 GIF를 Viewport 전체로 늘리지 않습니다. 넓은 Grid 안에서도 읽기 좋은
  행 길이와 의도적인 미디어 크기를 사용합니다.
- 두 열이 결과나 안내를 너무 좁게 만드는 폭에서는 한 열을 유지할 수 있습니다.
  전환값은 콘텐츠 기반입니다.

### 짧은 화면과 확대

- 토큰 확인은 내부 Scroll을 사용하더라도 제목이나 액션을 숨기지 않고 조작할 수 있어야
  합니다.
- 200% 텍스트 Zoom에서 상태, Metric, 이력 Row 및 안내 단계가 잘리지 않고 Reflow합니다.
- 나중에 Sticky 액션을 쓰더라도 상태 Message, 펼친 미디어 또는 마지막 이력·보안
  콘텐츠를 가리지 않습니다.

## 접근성 계약

- `h1` 하나, 순서 있는 Section Heading, 설치 단계와 이력의 의미론적 List 및 Native
  Button·Link 의미를 사용합니다.
- Process List는 일반 콘텐츠이며 가짜 Progress Widget이 아닙니다. 반복 연동에
  `aria-current="step"`을 추가하지 않습니다.
- Processing 영역은 간결한 접근 가능한 이름과 Indeterminate Busy 상태를 노출합니다.
  전체 페이지가 아닌 갱신 결과 영역에만 `aria-busy`를 표시합니다.
- 의미 있는 상태 전환을 적절한 Status·Alert 영역으로 알리되 Focus를 이동하지 않습니다.
  Poll마다 반복 안내하지 않습니다.
- 보이는 상태는 색상이나 깜빡이는 점 하나에만 의존하지 않고 텍스트를 함께 사용합니다.
- Disclosure는 펼침 상태를 노출하고 가시적인 Keyboard Focus를 유지하며 콘텐츠를
  설명하는 접근 가능한 이름을 가진 Control을 사용합니다.
- Modal 확인은 Dialog Pattern을 따르고 열려 있는 동안 Focus를 가두며 가장 비파괴적인
  액션에서 시작하고 Escape를 지원하고 Focus를 Trigger로 돌려줍니다.
- 복사 Feedback은 Programmatic하게 알려주고 복사 Control에서 Focus를 제거하지 않습니다.
- 안내는 위치, 모양 또는 색상뿐 아니라 Label과 목적으로 Control을 식별합니다.
- GIF는 Motion 지침을 위반하는 방식으로 자동 재생하지 않습니다. Reduced motion
  사용자에게 동일한 정적 또는 제어 가능한 경험을 제공합니다.
- 연결된 미리보기 Row는 접근 가능한 이름에 악곡과 난이도를 포함하고 변경 숫자만을
  Link Label로 사용하지 않습니다.
- 모든 상호작용 Target과 정보는 `320 CSS px`와 200% Zoom에서 Keyboard로 조작하고
  읽을 수 있어야 합니다.

## 현지화 계약

- `/ko/bookmarklet`, `/ja/bookmarklet`, `/en/bookmarklet`은 동등한 기능, 상태, 복구,
  보안, 이력 및 Metadata를 제공합니다.
- 공식 정체성과 제품 용어를 보존합니다. 현지화된 최초 언급은 공식 e-amusement
  베이직 코스와 NosLog에 승인된 괄호 속 `Basic Pass` 용어를 설명하며, NosLog 요금제로
  오역하지 않습니다.
- `전체 기록`과 `최근 30개 플레이`는 모든 Locale에서 의미가 구분되어야 합니다.
  손상처럼 들리는 일반 `부분 연동` Label로 바꾸지 않습니다.
- Locale 인식 Formatter로 날짜, 시각, 상대 시간, Duration 및 숫자 구분을 현지화합니다.
  Timestamp는 절대값으로 저장하고 비교합니다.
- 한국어·일본어는 비교적 짧을 수 있지만 영어 복구·보안 문구는 훨씬 길 수 있습니다.
  Layout 전환은 언어별 고정 폭이 아니라 콘텐츠 기반입니다.
- Browser Menu Label은 OS, Browser Version 및 Locale마다 다를 수 있습니다. 가능한
  경우 검증된 현지화 Label을 사용하고 목적 기반 설명과 함께 제공합니다.
- 대체 텍스트는 Filename이나 Frame별 장황한 묘사가 아니라 설명하는 액션을 전달합니다.
- 사용자 노출 문구가 달라도 Error 분류는 언어 간 안정적입니다. 복구 동작을 결정하려고
  현지화 String을 Parsing하지 않습니다.

## Runtime 상태 계약

시각 문구에서 동작을 추론하지 않고 명시적인 Server 파생 상태를 사용합니다.

```ts
type PublicSyncStatus =
    | "none"
    | "processing"
    | "delayed"
    | "completed"
    | "completed_with_exclusions"
    | "failed";

type SyncScope = "full" | "recent";

type SyncRecovery =
    | "none"
    | "sign_in_nostalgia"
    | "reinstall_bookmarklet"
    | "wait_for_cooldown"
    | "retry"
    | "report_repeated_failure";

interface PublicSyncAttempt {
    id: number;
    status: PublicSyncStatus;
    scope: SyncScope;
    startedAt: string;
    completedAt: string | null;
    receivedRecentPlays: number;
    insertedRecentPlays: number;
    changedBestRecords: number;
    excludedChartCount: number;
    recovery: SyncRecovery;
    retryAfterSeconds: number | null;
}

interface SyncCoverage {
    playedCharts: number;
    judgementCharts: number;
    timingCharts: number;
}
```

정확한 구현 이름은 달라도 됩니다. 시도, 누적 Coverage, 안전한 복구 분류 및 관리자
전용 원시 진단의 분리를 보존해야 합니다.

## 구현 연결

| 영역               | 현재 Source                                                                                                                                                                                      | 2.0 의무                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 경로와 Server 구성 | [`app/(nevigation)/bookmarklet/page.tsx`](<../../app/(nevigation)/bookmarklet/page.tsx>)                                                                                                         | 고정 휴대폰 폭 없이 비로그인, 최초 사용, 재방문, Processing, 지연, 결과 및 복구 계층 분기                                     |
| 최근 결과 Query    | [`app/(nevigation)/bookmarklet/data.ts`](<../../app/(nevigation)/bookmarklet/data.ts>)                                                                                                           | 원시 Error 없이 안전한 최근 5개 시도, 제외 수·분류, Coverage 및 제한된 변경 미리보기 반환                                     |
| 토큰 무효화        | [`app/(nevigation)/bookmarklet/action.ts`](<../../app/(nevigation)/bookmarklet/action.ts>)                                                                                                       | Version 무효화 보존, 결과 중심 Response 노출 및 성공 후 재설치 요구                                                           |
| 설치 안내          | [`components/bookmarklet/bookmarkletInstall.tsx`](../../components/bookmarklet/bookmarkletInstall.tsx)                                                                                           | 최초·재방문 Disclosure, 완전한 텍스트, 미디어 확대, Reduced motion·정적 대안, 재방문 미디어 Lazy Load 및 브라우저별 복구 추가 |
| 결과 표현          | [`components/bookmarklet/syncResultSummary.tsx`](../../components/bookmarklet/syncResultSummary.tsx)                                                                                             | 시도 범위와 Coverage 분리, 승인 Label 사용, 부분·미리보기·이력 계약 및 Live 전환 안내 추가                                    |
| 확인 Modal         | [`components/bookmarklet/syncTokenRegenerateButton.tsx`](../../components/bookmarklet/syncTokenRegenerateButton.tsx)                                                                             | 비파괴 초기 Focus·Focus 복귀 유지, Trigger를 보조 도움말·보안으로 이동하고 성공 후 재설치를 다음 행동으로 지정                |
| 북마클릿 생성      | [`lib/bookmarklet.ts`](../../lib/bookmarklet.ts)                                                                                                                                                 | 서명된 계정 전용 코드, 공식 Origin 흐름 및 독립 토큰·Log 노출 없음 보존                                                       |
| 수신 Endpoint      | [`app/api/receivePlayerData/route.ts`](../../app/api/receivePlayerData/route.ts)                                                                                                                 | Origin·Schema·크기·Cooldown·Lock·Timeout Control 보존, 안전한 Machine-readable 복구와 제외 수 반환                            |
| 전체 기록 갱신     | [`lib/services/user/updatePlayData.ts`](../../lib/services/user/updatePlayData.ts)                                                                                                               | 알려진 채보 Filtering, 현재 기록 교체 의미 및 변경 Snapshot 수 보존                                                           |
| 최근 이력          | [`lib/services/user/updateRecentPlay.ts`](../../lib/services/user/updateRecentPlay.ts)                                                                                                           | 중복 제거 보존 및 제한된 안전한 새 플레이 미리보기 데이터 노출                                                                |
| 프로필 갱신        | [`lib/services/user/updatePlayerProfile.ts`](../../lib/services/user/updatePlayerProfile.ts)                                                                                                     | 별도 사용자 노출 범위로 만들지 않고 프로필 갱신 보존                                                                          |
| Schema             | [`prisma/schema.prisma`](../../prisma/schema.prisma) `DataSync`, `ChartPlayHistory`, `ChartRecordSnapshot`, `User.sync_token_version`                                                            | 필요 시 안전한 제외 수·복구 분류 추가, 이력과 Cascade·개인정보 보장 유지                                                      |
| 관리자 Health      | [`lib/admin/syncHealth.ts`](../../lib/admin/syncHealth.ts), [`app/admin/syncs/page.tsx`](../../app/admin/syncs/page.tsx)                                                                         | 원시 운영 정보 분리 유지, 10분 지연과 15분 Timeout 의미 공유                                                                  |
| 개인정보           | [`app/(nevigation)/privacy/page.tsx`](<../../app/(nevigation)/privacy/page.tsx>)                                                                                                                 | 수집, Credential 제외, 보관 및 삭제 문구를 데이터 연동 설명과 동기화                                                          |
| 현지화             | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                     | 완전한 KO·JA·EN 상태, 범위, Coverage, 이력, 보안, 미디어, 브라우저 및 복구 문구 추가                                          |
| 테스트             | [`tests/sync-api.test.ts`](../../tests/sync-api.test.ts), [`tests/sync-summary.test.ts`](../../tests/sync-summary.test.ts), [`tests/bookmarklet-ui.test.ts`](../../tests/bookmarklet-ui.test.ts) | 안전한 상태 분류, 시도 이력, 부분 결과, Polling, 토큰 복구, 미디어 대안, 반응형 및 접근성 Coverage 확장                       |

## 대표 Fixture

최소 다음을 검증합니다.

1. 한국어, 일본어 및 영어의 비로그인 방문자;
2. 시도 이력이 없고 새 계정 전용 북마클릿이 생성된 로그인 사용자;
3. 최초 데스크톱 Drag 설치와 최초 모바일 Copy·Edit 설치;
4. Bookmark URL 편집이 작동하거나, 다르거나, 차단되거나, Clipboard 접근이 거부된
   브라우저;
5. 5초, 9:59, 10:00, 14:59 및 15:00의 Processing;
6. 중복 안내나 중복 수집 없이 Processing에서 전체 완료로 한 번 전환되는 Polling;
7. 최근 플레이 30개 수신, 0개 삽입, 최고 기록 1개 변경 및 넓은 현재 Coverage를
   유지하는 전체 시도;
8. 이전 전체 채보 기록과 Coverage를 유지하면서 여러 Event를 삽입하는 최근 시도;
9. 변경 Metric 3개가 모두 0인 유효 완료;
10. 수백 개 변경 기록을 Baseline Import로 요약하는 최초 전체 연동;
11. 미리보기 후보 1개, 3개 및 3개 초과와 올바른 제한·현지화 악곡 Link;
12. 알 수 없는 채보가 1개 또는 다수인 완료, 안전한 제외 수 및 공개 페이지 원시 ID
    부재;
13. 전체, 최근, 부분, 실패, 지연 및 활성 Variant를 최신순으로 포함한 최근 5개 시도;
14. 공식 NOSTALGIA Session 부재, 만료 토큰, 활성 Processing 충돌, 30초 Cooldown,
    Server 실패 및 반복 실패;
15. 최근 시도가 실패해도 이전 성공 Coverage가 남는 경우;
16. 토큰 무효화 취소, Escape, 확인 실패, 확인 성공, Focus 복귀 및 필수 재설치 상태;
17. 가시 문구, Console, Analytics, Monitoring, URL 또는 Feedback Context를 통한 토큰,
    Payload 및 원시 Error 유출 시도;
18. 텍스트가 충분한 상태에서 GIF Load, 지연, 실패, 확대, 정지·정적 및 Reduced motion
    동작;
19. `320px`, 대표 `390px`, 중간 폭, 넓은 데스크톱, 짧은 Viewport, 200% 텍스트 Zoom,
    Keyboard-only 및 Screen Reader 사용;
20. 긴 한국어 복구 문구, 일본어 브라우저 Label 및 훨씬 긴 영어 보안 문구.

## 브라우저 인수 계약

- `/ko/bookmarklet`, `/ja/bookmarklet`, `/en/bookmarklet`은 동등한 데이터 연동 동작과
  Metadata를 노출합니다.
- 비로그인 사용자는 Bookmarklet, 개인 결과, Coverage 또는 이력 누출 없이 정확한 공개
  설명과 로그인 복구를 받습니다.
- 로그인 최초 사용자는 완전하고 펼쳐진 텍스트 중심 설치·실행 안내를 받고, 정상
  재방문자는 상태와 다음 행동을 먼저 받습니다.
- 데스크톱 Drag와 지원되는 모바일 Copy·Edit 흐름으로 현재 계정 북마클릿을 설치할 수
  있습니다. 지원되지 않는 브라우저 동작은 명시하고 정직한 대안을 제공합니다.
- p.eagate가 아닌 Origin 실행은 계속 거부합니다. 잘못된 Content Type, 큰 Payload,
  잘못된 Payload, 무효 토큰, Cooldown 및 활성 Processing은 안전하게 거부합니다.
- Processing은 수집을 다시 실행하지 않고 자동 갱신하며 가짜 퍼센트를 쓰지 않고
  Terminal·지연 전환을 한 번 알리고 Focus를 빼앗지 않습니다.
- Interface는 10분에 지연으로 전환하고 15분 Timeout 경계에서 Server 동작과 일치하는
  재시도 복구를 제공합니다.
- 전체와 최근 결과는 모두 성공이며 명확히 구분됩니다. 최근 결과는 이전 전체 기록의
  삭제를 실제로 하거나, 숨기거나, 삭제를 암시하지 않습니다.
- 최근 결과는 이번 시도의 범위·Metric과 누적 NosLog Coverage를 시각적·의미론적으로
  분리합니다.
- 부분 완료는 내부 Error나 원시 채보 ID 없이 제외 수와 안전한 설명을 표시합니다.
- 유용한 변경 미리보기는 최대 3개이고, 최초 전체 연동은 요약되며, 미리보기 Link는
  올바른 현지화 악곡 상세로 연결됩니다.
- 연동 기록은 올바른 순서로 최근 5개 시도까지만 안전한 상태, 범위, 시각, Duration 및
  Metric과 함께 표시합니다.
- 무효화 확인은 가장 비파괴적인 액션에서 시작하고, 취소와 Escape를 지원하고, Focus를
  복귀시키며, 성공 후에만 기존 북마클릿을 즉시 무효화하고 재설치를 다음 행동으로
  만듭니다.
- 원시 토큰, p.eagate 비밀번호·Cookie, 원본 Payload, 비공개 기록 상세, Stack Trace
  또는 관리자 전용 진단이 가시 공개 문구, URL, Console, Analytics, Monitoring 또는
  Error Report 기본값에 나타나지 않습니다.
- GIF 실패, 비Animation, 지연, Reduced motion 또는 확대 불가가 완료를 막지 않습니다.
  인접 텍스트만으로 독립적으로 완료할 수 있어야 합니다.
- `320 CSS px`에서 상태, Metric, 액션, 이력 Row, 긴 브라우저 안내, 보안 문구, Modal
  또는 미디어 Frame이 문서 수준 가로 Overflow, 잘림 또는 겹침을 만들지 않습니다.
- 넓은 Layout은 의미 있는 결과·설치 공간을 사용하며 고정 휴대폰 폭 Shell을 유지하거나
  안내 문장·미디어를 무분별하게 늘리지 않습니다.
- 200% 텍스트 Zoom과 짧은 Viewport에서 모든 콘텐츠와 확인 액션에 접근 가능하고 순서가
  올바릅니다.
- 정상·실패 흐름은 예상하지 않은 Console Error, Hydration 문제, 중복 상태 안내,
  중복 수집, 오래된 Processing 상태, Focus 손실 또는 Credential 유출을 만들지 않습니다.

## 레퍼런스 매트릭스

| 출처                                                                                                                               | 전용 가능한 원칙                                                                          | NosLog 적용                                        | 한계                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| [현재 데이터 연동 진입](<../../app/(nevigation)/bookmarklet/page.tsx>)                                                             | 공개·인증 계층, 현재 상태, 안내 및 결과 흐름을 확립                                       | 관찰 기능과 현재 문제의 근거                       | 현재 고정 폭 구성은 2.0 권위가 아님                                 |
| [현재 북마클릿 구현](../../lib/bookmarklet.ts)                                                                                     | 계정 전용 서명 코드와 공식 사이트 추출을 보여줌                                           | 보안, 실행 및 토큰 의미의 근거                     | Minify Runtime은 사용자 안내가 아님                                 |
| [현재 수신 Endpoint](../../app/api/receivePlayerData/route.ts)                                                                     | Origin, 검증, 크기, Cooldown, 동시성, Timeout 및 부분 Catalog 동작을 확립                 | 안전한 상태와 복구 요구의 근거                     | 현재 공개 Response 분류는 아직 충분히 상세하지 않음                 |
| [현재 연동 Schema](../../prisma/schema.prisma)                                                                                     | 시도, 누적 최근 Event, 변경 Snapshot 및 토큰 Version을 분리                               | 범위, Coverage, 이력 및 무효화의 근거              | 최근 5개 공개 이력과 제외 수에 안전한 Query 지원 필요               |
| [현재 연동 테스트](../../tests/sync-api.test.ts)                                                                                   | 검증된 보안과 수집 동작을 Encoding                                                        | 구현 불변 조건 보호                                | 승인된 2.0 표현 상태 전체를 다루지 않음                             |
| [공식 NOSTALGIA Play Data 공지](https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html)                                     | 최근 이력은 최근 30곡이며 상세 악곡 데이터는 베이직 코스에 의존                           | 전체·최근 의미와 구독 설명의 근거                  | 공식 가용성은 바뀔 수 있고 NosLog 보관을 정의하지 않음              |
| [공식 NOSTALGIA Play Data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)                                      | 공식 기록은 로그인 플레이어·악곡 데이터를 우선                                            | Source 정체성의 근거                               | 대부분 공식 로그인이 필요하고 NosLog UI를 정의하지 않음             |
| [Tachi](https://tachi.ac/)                                                                                                         | 리듬게임 Tracking은 점수, Session, 이력 및 연동을 보존                                    | 반복 연동과 이력 가치 지원                         | 다중 게임 Architecture는 NosLog보다 넓음                            |
| [Gitadora to Kamaitachi](https://pfy.ch/programming/projects/gitadora.html)                                                        | 공식 사이트 Scraping은 명시적 안내가 필요하고 대상 Catalog에 없는 악곡을 제외할 수 있음   | 안전한 부분 완료와 설치 지원                       | Userscript·File Workflow는 NosLog 직접 Bookmarklet POST와 다름      |
| [mai-tools 북마클릿 안내](https://myjian.github.io/mai-tools/)                                                                     | 데스크톱 Drag와 모바일 Copy·Edit는 확립된 북마클릿 흐름                                   | 브라우저별 텍스트 중심 설치 지원                   | NosLog 보안이나 지원 브라우저 정책을 정의하지 않음                  |
| [GITADORA Skill Viewer](https://gsv.fun/en)                                                                                        | 북마클릿이 공식 사이트 Skill 데이터를 수집·저장해 나중에 보여줄 수 있음                   | 반복 추출 모델 지원                                | Legacy Surface와 Script 주입 구현은 시각·보안 권위가 아님           |
| [V-ARCHIVE Client 안내](https://v-archive.net/info/manual/client)                                                                  | Import 리듬게임 기록은 명시적 Credential 처리와 Capture·Upload Feedback이 필요            | 간결한 신뢰와 결과 Feedback 지원                   | Native Client Capture는 브라우저 북마클릿과 다름                    |
| [Notion: 데이터 Import](https://www.notion.com/help/import-data-into-notion)                                                       | Import가 상태, 제한, 완료 및 문제 해결을 노출                                             | 상태, 제한 및 복구 Disclosure 지원                 | Workspace Migration은 기록 연동보다 크고 빈도가 낮음                |
| [Slack Import FAQ](https://slack.com/help/articles/360049597673-FAQ--Import-data-from-one-Slack-workspace-to-another)              | 다단계 Import가 진행, 완료 의존성 및 문제 해결을 전달                                     | 정직한 Processing과 실패 복구 지원                 | Enterprise Migration 단계는 NosLog에 일대일 대응하지 않음           |
| [USWDS Process List](https://designsystem.digital.gov/components/process-list/)                                                    | Process List는 Interactive Wizard 진행을 암시하지 않고 순서를 설명                        | 최초 설치 단계 지원                                | 반복 상태나 최종 NosLog Styling을 정의하지 않음                     |
| [USWDS Step Indicator](https://designsystem.digital.gov/components/step-indicator/)                                                | Step Indicator는 현재 위치 의미가 있는 선형 다단계 흐름용                                 | 영구 연동 Stepper 거부 지원                        | 최초 설치에는 일반 번호 안내가 여전히 유용함                        |
| [GOV.UK Details](https://design-system.service.gov.uk/components/details/)                                                         | 보조 상세는 필요 시 공개할 수 있지만 주 작업 필수 콘텐츠를 숨기면 안 됨                   | 최초 펼침·재방문 접힘 지원                         | Browser Native Details Styling은 NosLog 시각 권위가 아님            |
| [WAI-ARIA APG Accordion](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)                                                      | Disclosure Header가 상태를 노출하고 Keyboard로 조작 가능                                  | 설치·이력·도움말 Section 지원                      | APG 의미론은 어떤 콘텐츠가 주인지 고르지 않음                       |
| [Carbon Progress Indicator](https://carbondesignsystem.com/components/progress-indicator/usage/)                                   | Step Progress는 Background System Processing과 다름                                       | 반복 Wizard 거부 지원                              | Enterprise Component Styling을 채택하지 않음                        |
| [Carbon Progress Bar](https://carbondesignsystem.com/components/progress-bar/usage/)                                               | 전체 진행을 계산할 수 없을 때 Indeterminate 표현 필요                                     | 가짜 퍼센트 없는 정직한 Processing 지원            | 향후 측정 가능한 Pipeline은 Determinate Progress를 정당화할 수 있음 |
| [Carbon Inline Loading](https://carbondesignsystem.com/components/inline-loading/usage/)                                           | 국소 Processing이 전체 페이지를 막지 않고 성공·Error로 전환 가능                          | 상태 국소 Loading 지원                             | 정확한 Animation과 Timing은 Foundation 결정                         |
| [WCAG 2.2 상태 Message](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)                                          | 중요한 Progress, 성공 및 Error 변화를 Focus 이동 없이 Programmatic하게 노출               | Polling 안내 지원                                  | 보이는 Layout이나 Poll 빈도를 지정하지 않음                         |
| [WAI-ARIA APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                                | Modal Focus는 제한되고 예측 가능하며 취소 가능하고 Trigger로 복귀                         | 토큰 무효화 확인 지원                              | 결과 문구를 정의하지 않음                                           |
| [GOV.UK Warning Text](https://design-system.service.gov.uk/components/warning-text/)                                               | Warning 표현은 중대한 결과에 예약                                                         | 결과 중심 무효화를 지원하고 영구 Alarm 표현은 거부 | 정부 위험 Tone은 일상 설치에 과도할 수 있음                         |
| [MDN `javascript:` URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript)                             | `javascript:` Navigation은 페이지 Context에서 Script를 실행하며 브라우저·보안 제한을 받음 | 북마클릿 제한의 근거                               | Platform 설명이며 Browser 정책 우회를 권장하지 않음                 |
| [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)                                                          | Cross-origin Request는 명시적인 Origin과 Response Control을 요구                          | 정확한 공식 Origin 처리 보존 지원                  | CORS만으로 인증이나 Payload 검증이 되지 않음                        |
| [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)         | Secret은 최소 노출, 폐기, Rotation 및 Log 제외가 필요                                     | 계정 전용 토큰과 무효화 경계 지원                  | 북마클릿 전달에는 실행 코드 안 서명 Credential이 여전히 필요함      |
| [GitHub 토큰 보안](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/token-expiration-and-revocation) | 폐기는 명확한 결과가 있고 교체 Credential이 필요                                          | 명시적 무효화와 재설치 복구 지원                   | GitHub Token은 Scope와 만료 기능이 다름                             |
| [iPhone Safari Bookmark](https://support.apple.com/guide/iphone/bookmark-favorite-webpages-iph42ab2f3a7/ios)                       | 모바일 Bookmark 생성·편집은 Platform별 사용자 행동                                        | 브라우저별 안내 지원                               | 모든 브라우저·Version에서 `javascript:` 실행을 보장하지 않음        |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                             | 필수 콘텐츠는 페이지 수준 2차원 Scroll 없이 320 CSS px에서 Reflow                         | 좁은 화면 인수 기준의 근거                         | 미디어 확대는 의도적인 제한 Viewer를 사용할 수 있음                 |
| [WCAG Interaction Animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)                         | 상호작용으로 시작한 비필수 Motion에는 비활성화·대안 필요                                  | Reduced motion과 정적 안내 지원                    | 안내 GIF 정책은 콘텐츠 동등성에도 의존함                            |

### 근거 수렴

- 공식 NOSTALGIA와 현재 수집 근거는 두 가지 올바른 Payload 범위에 수렴합니다. 베이직
  코스 데이터가 있으면 상세 전체 기록, 없으면 최근 30개 플레이입니다. 어느 것도
  최근 연동을 실패로 Label하거나 이전 전체 데이터를 삭제할 근거가 되지 않습니다.
- 리듬게임 Tracker는 반복 Import, 보존 이력, 누락 Catalog 처리 및 명확한 설치 안내에
  수렴합니다. 일반 사용자에게 내부 Scraper Error나 기술 Log를 노출할 근거는 없습니다.
- 프로덕션 Import 서비스는 가시 상태, 제한된 이력, 제한, 완료, 부분 결과 및 실행 가능한
  복구에 수렴합니다. Enterprise 단계 모델이 NosLog의 조작된 퍼센트 진행을 정당화하지
  않습니다.
- Process와 Disclosure 지침은 필수 최초 안내는 펼치고 보조 재방문 도움말은 접는 데
  수렴합니다. 영구 Wizard나 확인 불가능한 `설치 완료` Checkbox는 지원하지 않습니다.
- 접근성 레퍼런스는 Indeterminate Busy 상태, Focus를 빼앗지 않는 Programmatic Terminal
  안내, Keyboard Disclosure, 결과 중심 Modal 동작 및 미디어의 텍스트 대안에 수렴합니다.
- 보안 출처는 계정 전용 폐기 가능 Credential, 최소 노출, Log 제외, 명시적 무효화 결과
  및 폐기 후 교체에 수렴합니다. 북마클릿 안에 서명 Credential을 포함해야 하는 기술적
  필요 자체를 없애지는 않습니다.
- 브라우저 레퍼런스는 텍스트 중심의 브라우저 인식 설치와 정직한 제한에 수렴합니다.
  GIF-only 안내는 승인된 접근성·복구 계약을 전달할 수 없습니다.
- 10분 지연, 15분 재시도, 최근 5개 이력, 3개 미리보기 상한, 용어, 순서 및 무효화 후
  재설치 요구는 외부 출처가 결정한 것이 아니라 이를 참고해 승인된 NosLog 제품
  결정입니다.

## 거부 및 대체한 대안

- **매 방문마다 설치를 상태보다 위에 유지 — Superseded:** 재방문 사용자는 현재 상태와
  다음 행동을 먼저 보고, 설치는 관련 있을 때 외에는 접힙니다.
- **영구 다단계 Wizard 또는 Step Indicator — Rejected:** 반복 연동은 선형 다중 화면
  완료 흐름이 아닙니다.
- **수동 `설치 완료` Checkbox — Rejected:** NosLog가 확인할 수 없고 Browser 정리나
  토큰 무효화 후 거짓 상태가 될 수 있습니다.
- **최초 안내를 Disclosure 안에 숨김 — Rejected:** 모든 최초 단계가 작업 완료에
  필요합니다.
- **GIF만 표시 — Rejected:** 텍스트만으로 작업을 완료해야 하며 Animation은 실패·정지·
  접근 불가능할 수 있는 보조 자료입니다.
- **GIF를 완전히 제거 — Rejected:** 완전한 텍스트, 확대, 지연 Loading 및 Reduced motion
  대응과 함께라면 검증된 Animation은 여전히 유용한 시각 보조 자료입니다.
- **경과 시간 기반 Determinate 퍼센트 — Rejected:** 경과 시간은 완료 작업량이 아니며
  기만적입니다.
- **성공에 베이직 코스를 필수로 요구 — Rejected:** 최근 30개 플레이도 올바른 성공
  범위입니다.
- **최근 연동을 Warning·실패로 처리 — Rejected:** 중립적인 제한을 설명하고 이전 전체
  기록을 유지합니다.
- **최근 시도 범위와 누적 Coverage를 퍼센트 하나로 합침 — Rejected:** 서로 다른 질문에
  답하며 정직한 공통 분모가 없습니다.
- **모든 변경 기록을 Inline 표시 — Rejected:** 유용한 미리보기를 3개로 제한하고 최초
  전체 Import를 요약합니다.
- **사용자에게 전체 기술 Log 노출 — Rejected:** 안전한 최근 5개 요약이면 충분하며
  관리자 진단은 분리합니다.
- **알 수 없는 채보 하나로 전체 시도 실패 — Rejected:** 알려진 기록은 완료하고 제외는
  안전하게 셉니다.
- **원시 제외 채보 ID 또는 Exception 표시 — Rejected:** 공개 UI는 안전한 수·분류를
  사용합니다.
- **토큰 무효화를 영구 상단 Warning으로 유지 — Superseded:** 결과 중심 Modal을 가진
  보조 도움말·보안으로 이동합니다.
- **파괴적 확인 액션에 초기 Focus — Rejected:** 취소 또는 가장 비파괴적인 액션에 초기
  Focus를 둡니다.
- **무효화 북마클릿 복구 허용 — Rejected:** 성공적 무효화 후 새 북마클릿을 생성·설치해야
  합니다.
- **p.eagate Credential 저장·요청 — Rejected:** NosLog는 승인된 구조화 데이터와 자체
  서명 연동 토큰만 받습니다.
- **Background 자동 연동 — Rejected:** 현재 공식 사이트 접근과 보안 모델은 사용자가
  명시적으로 실행하는 북마클릿을 요구합니다.
- **데스크톱에서 고정 `390px` Content 유지 — Rejected:** 넓은 Layout은 의도적인 상태·
  결과와 설치·복구 공간을 사용합니다.

## 결정 기록

| ID      | 결정                                                                                             | 상태       |
| ------- | ------------------------------------------------------------------------------------------------ | ---------- |
| SYNC-01 | 데이터 연동을 독립된 현지화 Play-support 목적지와 홈 행으로 유지                                 | `Approved` |
| SYNC-02 | 하나의 경로에서 정보가 있는 비로그인, 로그인 최초 사용 및 로그인 재방문 상태 제공                | `Approved` |
| SYNC-03 | 재방문 사용자에게 설치 안내보다 현재 상태와 다음 행동 하나를 먼저 표시                           | `Approved` |
| SYNC-04 | 최초 사용에는 필수 설치·실행 Process를 펼치고 정상 재방문에는 접기                               | `Approved` |
| SYNC-05 | 최초 설치에 일반 Process List를 사용하고 반복 Stepper·수동 설치 완료 Checkbox는 사용하지 않음    | `Approved` |
| SYNC-06 | `NOSTALGIA 페이지 열기`를 반복 주 액션으로 유지하고 명시적 북마클릿 실행 요구                    | `Approved` |
| SYNC-07 | `전체 기록`과 `최근 30개 플레이`를 구분하고 둘 다 유효한 결과로 취급                             | `Approved` |
| SYNC-08 | `e-amusement 베이직 코스(Basic Pass)`를 한 번 설명하고 그 효과를 중립적으로 전달                 | `Approved` |
| SYNC-09 | 최근 연동 후에도 이전 전체 기록과 중복 제거된 누적 이력을 유지                                   | `Approved` |
| SYNC-10 | 최근 시도 범위·Metric과 누적 NosLog Coverage를 분리                                              | `Approved` |
| SYNC-11 | Indeterminate Processing, 자동 상태 갱신, 10분 지연 및 15분 재시도 상태 사용                     | `Approved` |
| SYNC-12 | Focus 이동이나 반복 Poll 안내 없이 의미 있는 상태 전환 알림                                      | `Approved` |
| SYNC-13 | 공식 로그인, 만료 토큰, Cooldown, Timeout·Process 실패 및 반복에 따라 복구 분류                  | `Approved` |
| SYNC-14 | 알 수 없는 채보를 `완료 · 일부 제외`로 처리하고 안전한 제외 수만 노출                            | `Approved` |
| SYNC-15 | `확인한 최근 플레이`, `새로 저장한 플레이`, `최고 기록이 갱신된 채보` Label 사용                 | `Approved` |
| SYNC-16 | 연결된 변경 미리보기를 최대 3개 표시하고 대량 최초 전체 Import를 요약                            | `Approved` |
| SYNC-17 | 접힌 연동 기록에 안전한 최근 5개 시도 노출                                                       | `Approved` |
| SYNC-18 | 토큰 무효화를 보조 도움말·보안에 두고 즉시 영향을 설명하며 취소에 초기 Focus                     | `Approved` |
| SYNC-19 | 북마클릿 무효화 성공 후 재설치를 필수 다음 행동으로 지정                                         | `Approved` |
| SYNC-20 | 북마클릿이 계정 전용이고 공유하면 안 되며 p.eagate 비밀번호·로그인 Cookie를 보내지 않는다고 명시 | `Approved` |
| SYNC-21 | 독립된 원시 토큰을 표시·Log하지 않고 Credential·Payload를 공개 진단에 포함하지 않음              | `Approved` |
| SYNC-22 | 완전한 텍스트와 보조 GIF, 확대, Reduced motion 지원 및 재방문 미디어 지연을 함께 유지            | `Approved` |
| SYNC-23 | 브라우저별 Bookmark 편집 제한과 정직한 지원 대안 문서화                                          | `Approved` |
| SYNC-24 | 320 CSS px에서 Reflow하고 충분히 넓은 Layout에서 의도적인 두 영역 구성 사용                      | `Approved` |
| SYNC-25 | 관리자 원시 진단과 Monitoring을 사용자 페이지 밖에 유지                                          | `Approved` |

## 인계 경계

Claude Design은 Foundation 승인 후 최종 Type Scale, Surface, 상태 표현,
Illustration·GIF Frame, Process List Anatomy, Card 계층, Metric Layout, Preview Row
Styling, Disclosure 표현, Modal 외형, 간격, Grid Track, 반응형 전환값 및 절제된 Motion을
결정할 수 있습니다. 그러나 승인된 최초·재방문 계층, 올바른 범위 의미, 누적 Coverage
구분, 상태 Timing, 부분 완료, 제한된 미리보기·이력, 복구, 보안·개인정보 설명, 텍스트
중심 미디어 계약, 접근성 및 인수 기준을 보존해야 합니다.

향후 Codex 구현 세션은 Claude 결과와 이 기획서를 비교해야 합니다. 설치를 재방문 상태
위에 두거나, 가짜 Stepper·Progress 퍼센트를 만들거나, 최근 연동을 실패로 취급하거나,
이전 전체 데이터가 삭제됐다고 암시하거나, 시도와 Coverage를 합치거나, 원시 진단·토큰을
노출하거나, 부분 제외 의미를 빼거나, 제한 없는 변경·이력 Feed를 만들거나, 무효화의
파괴적 액션에 먼저 Focus하거나, 무효화 후 재설치를 요구하지 않거나, 완전한 텍스트 없이
GIF에 의존하거나, 데스크톱을 휴대폰 폭에 고정하거나, Processing·복구를 접근 불가능하게
만드는 결과를 구현하기 전에 가이드 또는 디자인 수정을 요청해야 합니다.
