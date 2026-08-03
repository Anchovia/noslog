# NosLog 2.0 글로벌 랭킹 페이지 기획서

## 문서 관리

- 상태: `Approved`
- 결정 상태: `글로벌 랭킹의 핵심 계약 승인: 페이지 목적, Basic/Recital 및 지표
계층, 지역 범위, 내 순위, 행 구조, 국가 표시, 공동 순위 의미, 25명
페이지네이션, 런타임 상태, 반응형 구성, 접근성, 현지화, 브라우저 수용 기준`
- 근거 상태: `저장소 조사, 현재 브라우저 증거, 승인된 정보 구조, 승인된 서열표
레이팅 정책, 인용한 랭킹 및 디자인 시스템 비교 사례, 반응형·접근성 표준,
사용자 승인 결정 기록`
- 시작일: 2026-08-02
- 마지막 결정 갱신일: 2026-08-03
- 원본 언어: 영어
- 영문 원본: [08-global-rankings-page-brief.md](./08-global-rankings-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 관련 레이팅 계약:
  [06-tier-list-page-brief.ko.md](./06-tier-list-page-brief.ko.md)
- 범위: NOSTALGIA Basic·Recital의 공개 다국어 사용자 랭킹과 Official Grd 및
  Basic 전용 NosLog Rating 비교
- 제외 범위: 악곡 상세 내부의 채보별 랭킹, 프로필 대시보드 디자인, 승인된
  레이팅 공식 변경, 관리자 인터페이스, 최종 Foundation 토큰, 최종 고충실도
  구성, 이번 세션의 프로덕션 구현

## 결정 상태 표기

- **Observed:** 저장소, 현재 브라우저 증거 또는 승인된 상위 산출물에서 확인한 사실.
- **Approved:** 사용자가 명시적으로 동의했으며 후속 디자인의 기준이 되는 결정.
- **Proposed:** 사용자 승인을 기다리는 근거 기반 방향.
- **Open:** 추가 조사·검증 또는 사용자 결정이 필요한 사항.
- **Rejected:** 검토했지만 명시적으로 채택하지 않은 사항.
- **Superseded:** 이후 승인된 방향으로 대체된 사항.

이 문서는 승인된 글로벌 랭킹 동작, 계층, 반응형 계약과 상태의 권위 있는
기준이다. 정확한 타이포그래피, 색상, 간격, radius, 그림자, 아바타 처리,
컨트롤 크기, 포디움 표현, 콘텐츠 기반 전환값은 Foundation 및 후속 Claude
Design 작업에 남겨 둔다. 후속 시각 결정은 표현을 다듬을 수 있지만 이 제품
계약을 삭제하거나 다르게 해석해서는 안 된다.

## 목적

글로벌 랭킹 페이지는 서로 연결된 두 질문에 답한다.

> 선택한 NOSTALGIA 비교 조건에서 지금 누가 앞서고 있으며, 같은 자격 집단에서
> 나는 어디에 있는가?

이 페이지는 공개 비교 목적지이며 악곡 상세의 채보별 랭킹, 프로필 대시보드,
서열 계산기 또는 소셜 피드를 대체하지 않는다. 사용자는 NOSTALGIA 모드,
사용 가능한 비교 지표, 하나의 지역 범위를 선택하고, 순위가 매겨진 플레이어를
훑어보며, 자신의 위치를 찾고, 근거 맥락을 확인하기 위해 플레이어의 공개
프로필을 연다.

## 주요 맥락과 성공 조건

- **승인된 상위 결정:** 랭킹은 영구 라벨형 Header 링크가 아니라 Home 내비게이션
  블록과 More 패널을 통해 접근하는 독립 목적지로 유지한다.
- **Approved:** 오락실 플레이 전후의 모바일 사용이 주요 맥락이다. 데스크톱도
  필수 지원하며 고정 `390px` 셸을 유지하지 않고 추가 너비를 더 빠른 행 비교에
  사용한다.
- **Approved:** 성공적인 방문에서 사용자는 선택한 모드·지표·모집단을 이해하고,
  순위와 값을 비교하며, 자격이 있으면 자신의 위치를 찾고, 랭킹 맥락을 잃지
  않은 채 다른 플레이어의 공개 프로필을 열 수 있다.
- **Approved:** 비로그인 상태에서도 랭킹 전체를 읽을 수 있다. 인증은 내 순위와
  그 밖의 계정별 맥락에만 필요하다.
- **Approved:** 현재 시각 스타일은 감사 증거이지 NosLog 2.0의 시각 기준이 아니다.

## 현재 제품 증거

### 관찰한 경로와 쿼리 상태

- 다국어 페이지는 `/[locale]/rankings`에서 열리며 `mode`, `metric`, `region`,
  `page` 쿼리 매개변수를 받는다.
- `mode`는 `basic | recital`로 정규화되며, 누락되거나 유효하지 않으면
  `basic`이 된다.
- `metric`은 `grade | rating`으로 정규화되며, Rating은 Basic 모드에서만
  허용된다.
- `region`은 `all | kr | jp | global`로 정규화된다.
- 내부 값 `global`은 모든 국가를 의미하지 않는다. `country`가 `ko-KR`도
  `ja-JP`도 아닌 사용자를 뜻한다.
- 현재 페이지와 API는 모두 고정 `PAGE_SIZE = 7`을 사용한다.
- 서버에서 범위를 벗어난 페이지를 요청하면 마지막 유효 페이지로 redirect 또는
  clamp한다.

### 관찰한 랭킹 데이터와 의미

- Official Grd는 모드별 grade가 양수인 사용자를 랭킹에 포함하고 아바타,
  사용자명, 프로필 국가 범주, 모드별 검정, Grd를 반환한다.
- Basic NosLog Rating은 현재 공개된 Basic Pianist 서열표, 승인된 하한 이상의
  자격 점수, 승인된 숙련도 곡선과 상위 `70`개 자격 기여를 바탕으로 계산된다.
  표시 최댓값은 `10,000`이다.
- Rating 자격과 값은 현재 공개된 서열표 원본과 Revision에 의존한다. 현재 제품에는
  승인된 Recital Rating Source가 없다.
- 현재 Official Grd 랭킹은 표시 값이 같은 두 사용자도 값과 사용자 ID로 고유
  서수를 부여한다.
- 현재 Rating 랭킹은 반올림 전 Rating, raw total, 사용자 ID 순으로 정렬한 뒤
  반올림한 정수를 표시한다. 따라서 표시 정수가 같아도 서로 다른 순위가 될 수
  있다.
- 현재 사용자는 별도로 계산되며 선택한 모집단에서 자격이 있으면 모든 payload에
  함께 반환된다.

### 관찰한 현재 인터페이스와 브라우저 동작

- 현재 compact 페이지는 Basic/Recital, Official Grd/NosLog Rating, 네 개의
  상시 지역 버튼을 세 개의 full-width 컨트롤 그룹으로 쌓는다.
- Recital이 활성화된 상태에서 Rating을 선택하면 사용할 수 없는 지표를 숨기는
  대신 모드를 Basic으로 조용히 변경한다.
- 내 순위가 있으면 현재 페이지에 같은 사용자가 이미 보여도 완전한 내 사용자
  카드를 목록 위에 항상 한 번 더 배치한다.
- 현재 랭킹 행의 신원 순서는 순위, 아바타, 국가 표시, 사용자명, 검정, 값이다.
- 조건 및 페이지 변경은 클라이언트 요청과 `replaceState`를 사용한다. URL 공유는
  가능하지만 일반적인 필터·페이지 단계가 정상적인 탐색 history처럼 동작하지
  않는다.
- `320px`에서 현재 Header, 제목, 컨트롤과 내 사용자 영역이 겹치거나 훑어보기
  어려워진다. 넓은 데스크톱에서도 일반 콘텐츠 셸이 약 `390px`로 남아 비교
  공간을 사용하지 않는다.
- 지역 결과가 비면 내 순위 없음과 랭킹 결과 없음이 함께 나타나 중복 empty-state
  콘텐츠가 될 수 있다.

## 승인된 범위와 불변 조건

- Basic과 Recital을 서로 다른 NOSTALGIA 비교 모드로 유지한다.
- Official Grd는 두 모드 모두, NosLog Rating은 Basic에서만 유지한다.
- 승인된 Basic Rating 공식과 원본 계약을 보존한다. 이 문서는 입력 계산식을
  변경하지 않고 표현과 공동 순위 의미만 바꾼다.
- 네 모집단 의미를 유지한다: 전체 자격 사용자, 대한민국, 일본, 두 범주 밖의
  사용자.
- 각 플레이어 신원에서 공개 프로필로 이동하는 기능을 유지한다.
- 이 페이지에 점수 입력, 팔로우, 메시지, 소셜 반응, 시즌 리그, 임의 기간 필터,
  채보별 랭킹을 추가하지 않는다.
- 비공개 프로필 필드를 노출하거나 승인된 프로필 국가·지역 범주를 넘어 국적을
  추론하지 않는다.

## 승인된 정보 계층

하나의 semantic `main`과 다음 mobile-first source order를 사용한다.

1. 페이지 정체성과 자격 플레이어 수
2. Basic/Recital 모드 선택
3. 사용 가능한 지표 선택과 지역 범위
4. Rating 활성화 시 간결한 Rating 기준
5. 조건부 내 순위 요약
6. 랭킹 결과 제목과 갱신·오류 상태
7. 순위가 매겨진 플레이어 행
8. 명시적 페이지네이션

데스크톱에서는 컨트롤 그룹을 정렬하고 결과 열을 넓힐 수 있지만 이 계층을
보존해야 한다. 관련 없는 통계, 분포 차트 또는 서로 경쟁하는 여러 요약이 있는
대시보드로 바꾸지 않는다.

## 모드, 지표, 지역 계약

### 모드

- **Basic**과 **Recital**을 항상 보이는 primary exclusive choice로 유지한다.
- 모드 변경 시 `page`를 `1`로 되돌리고 유효한 현재 지역은 유지한다.
- 승인된 Recital Rating Source가 없는 동안 Recital로 변경하면 Official Grd를
  결정적으로 선택한다. 구조는 별도로 승인할 향후 Recital Rating과 호환되게 둔다.
- Basic과 Recital을 지역 컨트롤이나 하나의 혼합 Select 안에 넣지 않는다.

### 지표

- Basic에서는 **Official Grd**와 **NosLog Rating**이라는 하나의 subordinate
  exclusive choice를 보인다.
- Recital에서는 지표 스위치를 완전히 제거하고 결정된 Official Grd 맥락만
  보인다. 비활성 Rating 컨트롤을 표시하지 않고 사용자를 Basic으로 조용히
  되돌리지 않는다.
- Basic 지표 변경 시 `page`를 `1`로 되돌리고 선택된 지역은 유지한다.
- Rating 활성화 시 현재 공개 Basic Pianist 서열표 원본과 상위 70개 기준을
  밝히는 간결한 기준 문장 하나를 보인다. 전체 공식을 상시 페이지 계층에 놓지
  않는다.

### 지역

- 다음 항목을 가진 compact Select 또는 동등한 접근 가능한 popup 하나를 쓴다.
    - **전체**
    - **대한민국**
    - **일본**
    - **기타 지역**
- 내부 `global`의 사용자 표시명은 `기타 지역`, `その他地域`, `Other regions`다.
  대한민국과 일본을 명시적으로 제외하므로 `Global`이라고 표시하지 않는다.
- 지역 변경 시 `page`를 `1`로 되돌리고 선택한 모집단 안에서 순위를 다시
  계산한다.
- 네 개의 상시 지역 버튼을 유지하지 않는다. 지역은 Basic/Recital과 동급인
  선택이 아니라 보조 범위다.

## URL, History, 복원 계약

- 모드, 지표, 지역, 페이지를 다국어 URL에서 공유 가능하게 유지한다.
- 기본 Official Grd 상태에서는 metric 쿼리를 생략하고 Rating은 명시적으로
  인코딩한다.
- 유효한 선택 및 페이지네이션 변경은 탐색 가능한 history entry를 만든다.
  브라우저 Back/Forward는 이전 모드, 지표, 지역, 페이지, 결과 집합과 실질적인
  스크롤 맥락을 정확히 복원한다.
- 페이지네이션 컨트롤은 유효한 `href`를 가진 실제 탐색 링크 또는 동등한 링크로,
  새 탭 열기, 링크 복사와 JavaScript 없는 탐색을 지원한다.
- 유효하지 않은 값은 결정적으로 정규화한다. 범위를 벗어난 페이지는 마지막 유효
  페이지로 해석하고 정규화된 URL을 노출한다.
- 모드, 지표, 지역 변경은 페이지 `1`로 되돌린다. 브라우저 Back으로 돌아올 때는
  그 reset을 다시 적용하지 않고 이전 페이지를 복원한다.

## 내 순위 계약

### 로그인 및 자격 충족

- 현재 사용자의 행이 활성 페이지에 없으면 `내 순위 {rank} / {population} ·
{metric value}`라는 compact summary 하나와 **내 위치** action 하나를 보인다.
- 내 위치를 실행하면 현재 사용자 행이 있는 페이지로 이동하고 URL을 갱신하며,
  읽기·Focus 맥락을 강조된 해당 행으로 옮긴다.
- 현재 사용자 행이 활성 페이지에 이미 있으면 같은 플레이어를 완전한 형태로 두 번
  보여주지 않고 별도 summary를 제거한다.
- 비색상 marker와 접근 가능한 `내 순위` 텍스트로 현재 행을 강조한다. 색상은
  보조할 수 있지만 유일한 구분 수단이어서는 안 된다.

### 로그인했지만 자격 미충족

- 다른 랭킹 행은 존재하지만 선택한 맥락에서 현재 사용자에게 자격 값이 없으면
  간결한 개인 상태 **내 순위 없음**만 보인다.
- 순위, 백분위, 예상 위치 또는 도전 상태를 만들어내지 않는다.
- 선택한 전체 모집단이 비어 있으면 페이지 수준의 빈 결과 위에 이 개인 상태를
  중복해 표시하지 않는다.

### 비로그인

- 전체 공개 랭킹을 읽을 수 있게 유지한다.
- 내 순위 대신, 로그인은 자신의 순위를 찾는 데만 필요하다고 설명하는 낮은 강조의
  로그인 action 하나를 제공한다.
- 로그인 성공 후 정확히 같은 랭킹 URL로 돌아와 선택 맥락을 복원한다.

## 공동 순위 의미

- 공개 값이 같으면 competition ranking `1, 2, 2, 4`를 사용한다.
- Official Grd에서는 인터페이스에 공개된 정수가 동치의 권위 있는 값이다. 공개
  Grd가 같은 플레이어는 같은 순위를 공유한다.
- NosLog Rating에서는 공개된 반올림 정수가 동치의 권위 있는 값이다. 공개
  Rating이 같은 플레이어는 같은 순위를 공유한다.
- raw value는 한 공동 순위 그룹 안에서 안정적인 표시 순서를 정할 수 있지만, 같은
  공개 값에 서로 다른 표시 순위를 만들어서는 안 된다.
- 동점이 페이지 경계를 가로지르면 관련된 각 행은 같은 공동 순위를 유지한다.
- 포디움 스타일은 1위, 2위 또는 3위를 여러 플레이어가 공유하는 상황을 수용해야
  한다. 공동 순위인데 고유 메달인 것처럼 표현해서는 안 된다.

## 플레이어 행 구조

첫 번째로 승인한 랭킹 구조를 레이아웃 기준으로 사용한다. 각 행은 다음을 포함한다.

1. 공개 공동 순위
2. 하나의 플레이어 신원 그룹
    - 프로필 아바타 또는 승인된 fallback;
    - 사용자명;
    - 사용자명 바로 뒤의 국가·지역 marker;
    - 존재할 경우 두 번째 신원 줄의 활성 모드 검정;
3. 오른쪽 정렬한 하나의 활성 값: Official Grd 또는 NosLog Rating

규범적인 compact 예시:

```text
2   [avatar] CHOYO [대한민국 marker]              Grd 5,921
             Basic 2급
```

- 아바타와 사용자명을 붙여 둔다. 그 사이에 국가 marker를 넣지 않는다.
- 순위와 경쟁하는 아바타 앞 위치에 국가 marker를 놓지 않는다.
- 승인된 2.0 결과 구조에 Country/Region 또는 Exam 독립 열을 만들지 않는다.
  둘 다 보조 신원 metadata다.
- 대한민국과 일본은 승인된 국기를 사용한다. 기타 지역은 저장된 범주가 특정 국가
  하나가 아니므로 지구본 marker를 사용한다.
- 모든 marker에는 접근 가능한 다국어 이름이 있다. 국기 모양, emoji 렌더링 또는
  색상만에 의존하지 않는다.
- 사용자명은 명확한 프로필 링크로 유지한다. 보조 metadata를 서로 경쟁하는 별도
  링크로 만들지 않는다.
- 검정이 없으면 빈 badge나 placeholder를 남기지 않고 두 번째 줄 값을 제거한다.
- 숫자 값은 tabular figure와 안정적인 끝 정렬을 사용해 비교한다.

## 페이지네이션 계약

- 고정 페이지 크기는 자격 플레이어 `25`명이다.
- 페이지 크기 selector를 추가하지 않는다.
- 명시적 페이지네이션을 사용하며 무한 스크롤이나 자동 추가 로딩을 사용하지 않는다.
- 필요에 따라 이전, 다음, 현재 페이지, 유용한 인접 페이지, 경계와 ellipsis를
  제공한다.
- compact layout에서는 보이는 페이지 번호 수를 줄일 수 있지만 이전, 다음,
  현재 페이지 식별과 유용한 경우 경계로 결정적으로 이동하는 기능을 유지한다.
- 전체 자격 플레이어 수와 위치를 이해할 수 있는 충분한 페이지 맥락을 노출한다.
- 페이지 변경은 모드, 지표, 지역을 유지하고 읽기 맥락을 결과 시작점 또는 요청한
  내 위치 행으로 이동한다.
- 한 페이지면 충분할 때 페이지네이션을 숨긴다. 동작하지 않는 pagination chrome을
  렌더링하지 않는다.

## Loading, Empty, Error, Unavailable 상태

### 기존 결과 갱신 중

- 새 조건 또는 페이지를 불러오는 동안 마지막으로 성공한 행을 계속 보이게 한다.
- 결과에 `aria-busy`를 표시하고 결과 가까이에 간결한 갱신 상태를 보인다. 목록을
  비우거나 모든 행을 관련 없는 skeleton card로 대체하지 않는다.
- 대기 중인 선택과 마지막 확정 결과를 구분할 수 있어야 한다.
- 오래된 응답이 가장 최근 사용자 선택을 덮지 않도록 stale request를 취소하거나
  무시한다.

### 최초 Loading

- 안정적인 결과 영역을 예약하고 간결한 loading 상태 하나를 노출한다.
- skeleton에 가짜 순위, 아바타 또는 지표를 보여주지 않는다.

### Empty

- 선택한 모집단에 자격 행이 없으면 결과 영역에 간결한 **랭킹 기록이 없습니다**만
  보인다.
- 사용자가 즉시 범위를 바꿀 수 있도록 컨트롤을 유지한다.
- 같은 상태에서 두 번째 개인 empty 메시지를 반복하지 않는다.

### Error

- 성공 데이터가 있은 뒤 갱신에 실패하면 마지막 확정 행을 유지하고, pending
  selection을 되돌리거나 명확히 해소하며, Retry action이 있는 inline error
  하나를 보인다.
- 최초 요청에 실패하면 모든 선택 컨트롤을 유지한 채 경계가 있는 결과 오류와
  Retry를 보인다.
- 오류를 빈 결과로 바꾸지 않는다.

### Rating 원본 사용 불가

- 공개 Rating 원본이 누락·불완전·유효하지 않은 경우는 0명 랭킹이 아니라 사용할
  수 없는 지표 상태다.
- NosLog Rating을 일시적으로 사용할 수 없음을 간결히 설명하고 Official Grd로
  돌아갈 명확한 방법을 유지한다.

## 반응형 계약

### Compact layout

- `390px`은 대표 검토 canvas로 사용하며 고정 제품 너비나 breakpoint로 사용하지
  않는다.
- `320 CSS px`까지 문서 수준의 2차원 스크롤 없이 reflow한다.
- 모드는 보이게 유지하고, 지표는 subordinate로 유지하며, 지역 selector 하나를
  사용한다.
- 관계가 페이지 맥락과 값만으로 명확하면 별도 표시 table header 없이 compact
  semantic ranked row로 결과를 렌더링한다.
- 순위와 활성 값을 안정적인 양쪽 가장자리에 둔다. 신원 그룹이 가운데 flexible
  공간을 사용하게 한다.
- 사용자명과 국가 marker는 첫 번째 신원 줄, 검정은 두 번째 줄에 둔다. 유효한 긴
  사용자명은 전체 접근 가능 이름을 유지할 때만 시각적으로 truncate할 수 있다.
- 필수 순위, 사용자명, 국가 범주 또는 활성 값을 Hover, 첫 tap 또는 가로 스크롤
  뒤에 숨기지 않는다.
- 내 순위 summary와 페이지네이션은 Header 또는 결과 행과 겹치지 않고 reflow해야
  한다.

### Wide layout

- 고정 compact-shell 제약을 제거하고 의도적인 비교 너비를 사용한다.
- 같은 데이터를 정렬된 Rank, Player identity, 활성 값 영역을 가진 차분한
  semantic table 또는 table-like ranked list로 제시한다.
- 국가 marker와 검정을 Player identity 그룹 안에 유지한다. 공간이 있다는 이유로
  Region 또는 Exam 독립 열을 다시 만들지 않는다.
- 공간이 허용되면 계층을 바꾸거나 상시 버튼이 빽빽한 toolbar를 만들지 않는 범위에서
  모드, 지표, 지역을 효율적으로 정렬한다.
- 페이지당 `25`명을 유지한다. 데스크톱 너비는 비교 정렬만 바꾸며 페이지네이션
  정책을 바꾸지 않는다.
- 추가 너비를 관련 없는 플레이어 통계로 채우지 않는다.

### Layout 전반의 구현 의미

- compact와 wide presentation은 동등한 하나의 ordered dataset을 노출해야 한다.
- 구현이 compact와 wide DOM 구조를 따로 렌더링한다면 활성 구조 하나만 접근성
  트리에 남겨야 한다. 중복 행 또는 중복 프로필 링크를 노출하지 않는다.
- 하나의 가정된 기기 경계보다 content 또는 container 기반 전환을 우선한다.

## 접근성 계약

- 설명적인 페이지 heading 하나와 label이 있는 랭킹 결과 region 하나를 사용한다.
- 모드와 지표는 키보드로 조작 가능한 exclusive selection이며 선택 상태를
  programmatic하게 노출하고 Focus를 보이게 한다.
- 지역은 시각적 또는 programmatic label이 있는 native Select 또는 접근 가능한
  popup/listbox pattern을 사용한다.
- 선택 변경 시 Focus를 예기치 않게 옮기지 않는다. 모든 행이 아니라 확정된 결과
  수 또는 갱신 상태만 announce한다.
- 활성 반응형 presentation에 알맞은 native ordered-list 또는 table semantics를
  사용한다. wide data table에는 programmatic하게 연결된 header가 있다.
- 페이지네이션은 label이 있는 `nav`이며 활성 페이지는 `aria-current="page"`를
  노출한다.
- 비활성 이전/다음 컨트롤은 Focus 가능한 dead link가 아니다.
- 내 위치는 요청한 행을 사용할 수 있게 된 뒤에만 Focus를 옮기고 그 행이 현재
  사용자의 순위임을 식별한다.
- 표시 텍스트가 truncate되어도 프로필 링크의 접근 가능한 이름에는 전체 사용자명이
  있다.
- 국가 marker에는 다국어 접근 가능 이름이 있다. 장식용 아바타 fallback 글자가
  보조 기술에 사용자명을 중복해 읽히지 않는다.
- 순위, 내 행 식별, 선택 컨트롤, Loading과 오류는 색상만에 의존하지 않는다.
- pointer target은 승인될 Foundation target-size 규칙을 충족하고 서로 겹치지
  않는다.
- reduced-motion 선호를 존중한다. 랭킹 갱신과 페이지 변경이 상태 전달을 위해
  motion을 요구하지 않는다.

## 현지화와 콘텐츠

### 안정적인 도메인 label

- `Basic`, `Recital`, `Grd`, `NosLog`는 승인된 제품 표기를 유지한다.
- 승인된 지표 label:
    - 한국어: `공식 Grd`, `NosLog 레이팅`
    - 일본어: `公式Grd`, `NosLogレーティング`
    - 영어: `Official Grd`, `NosLog Rating`
- 승인된 지역 label:
    - 한국어: `전체`, `대한민국`, `일본`, `기타 지역`
    - 일본어: `すべて`, `韓国`, `日本`, `その他地域`
    - 영어: `All`, `Korea`, `Japan`, `Other regions`

### 행 및 상태 콘텐츠

- underlying Basic/Recital 모드나 숫자를 바꾸지 않고 검정 문법을 현지화한다.
- 상태 문구는 간결하게 유지한다.
    - 랭킹 empty: `랭킹 기록이 없습니다`에 해당하는 문구;
    - 개인 사용 불가: `내 순위 없음`에 해당하는 문구;
    - loading: `랭킹을 갱신하고 있습니다`에 해당하는 문구;
    - error: `랭킹을 불러오지 못했습니다`에 해당하는 문구와 Retry.
- 도메인의 정수 Grd와 Rating 의미를 보존하면서 locale-aware grouping으로 값을
  format한다.
- 한국어, 일본어, 영어 컨트롤 label을 함께 테스트한다. 한국어가 항상 가장 긴
  문자열이라고 가정하지 않는다.

## 런타임 상태 계약

| 상태                  | 필수로 보이는 결과                                   | 인터랙션 결과                        |
| --------------------- | ---------------------------------------------------- | ------------------------------------ |
| Basic + Official Grd  | 모드, Basic 지표 두 개, 지역, Grd 행                 | 승인된 모든 컨트롤 사용 가능         |
| Basic + Rating        | 모드, Basic 지표 두 개, 지역, 간결한 기준, Rating 행 | Official Grd를 바로 선택 가능        |
| Recital               | 모드, 지역, Official Grd 맥락, Recital 행            | Rating 컨트롤 없음                   |
| 로그인, 다른 페이지   | Compact 내 순위 summary                              | 내 위치가 해당 페이지와 행을 엶      |
| 로그인, 현재 페이지   | 중복 summary 없음, 내 행 표시                        | 프로필 링크와 페이지네이션 사용 가능 |
| 로그인, 자격 미충족   | 목록이 있으면 간결한 내 순위 없음                    | 컨트롤 사용 가능                     |
| 비로그인              | 공개 목록과 낮은 강조 로그인 action                  | 로그인 후 같은 URL로 안전하게 복귀   |
| 갱신 중               | 마지막 확정 행과 보이는 busy 상태                    | stale response가 이길 수 없음        |
| Empty                 | 간결한 결과 메시지 하나                              | 컨트롤 사용 가능, 페이지네이션 숨김  |
| 기존 데이터 뒤 Error  | 마지막 확정 행과 Retry                               | 현재 요청 맥락으로 Retry             |
| 최초 Error            | 결과 오류와 Retry                                    | 컨트롤 사용 가능                     |
| Rating 원본 사용 불가 | 명시적인 지표 사용 불가 상태                         | Official Grd 복구 경로가 명확함      |

## 구현 매핑

| 승인된 요구 사항                       | 현재 원본                                                                                                    | 후속 변경                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 다국어 랭킹 경로와 정규화              | [`app/(nevigation)/rankings/page.tsx`](<../../app/(nevigation)/rankings/page.tsx>)                           | 경로를 보존하고 페이지 크기와 canonical state 처리를 갱신                                        |
| 클라이언트 컨트롤과 요청 orchestration | [`components/rankings/rankingBrowser.tsx`](../../components/rankings/rankingBrowser.tsx)                     | 지표를 조건부로 만들고, 지역을 통합하며, 탐색 가능한 history와 견고한 pending/error state를 구현 |
| API 페이지 payload                     | [`app/api/rankings/route.ts`](../../app/api/rankings/route.ts)                                               | 25개 행을 사용하고 total 불일치 없이 내 위치 포함 페이지 탐색을 지원                             |
| 랭킹 query와 Rating 원본               | [`lib/rankings.ts`](../../lib/rankings.ts)                                                                   | 공식 입력값을 보존하면서 페이지 경계를 가로지르는 공개 값 공동 순위를 구현                       |
| Table 구성                             | [`components/rankings/userRankingTable.tsx`](../../components/rankings/userRankingTable.tsx)                 | 무조건 중복되는 내 카드를 제거하고 조건부 summary/list/pagination을 구성                         |
| 현재 사용자 summary                    | [`components/rankings/table/currentUserRanking.tsx`](../../components/rankings/table/currentUserRanking.tsx) | 완전한 중복 카드를 compact off-page/ineligible/signed-out 상태로 교체                            |
| 플레이어 행                            | [`components/rankings/table/userRankingRow.tsx`](../../components/rankings/table/userRankingRow.tsx)         | 순위, 통합 신원 그룹, 두 번째 줄 검정, 오른쪽 정렬 값을 사용                                     |
| 국가와 검정 metadata                   | [`components/rankings/table/rankingUserMeta.tsx`](../../components/rankings/table/rankingUserMeta.tsx)       | 다국어 접근 가능한 marker를 유지하고 marker는 사용자명 뒤, 검정은 신원 아래로 이동               |
| 페이지네이션                           | [`components/rankings/table/rankingPagination.tsx`](../../components/rankings/table/rankingPagination.tsx)   | 탐색 링크, compact 반응형 항목, Focus 복원, 25행 정책 사용                                       |
| Formatting과 페이지 utility            | [`components/rankings/table/rankingTableUtils.ts`](../../components/rankings/table/rankingTableUtils.ts)     | 공동 순위와 canonical page utility를 추가하고 정수 표시를 보존                                   |
| 기존 자동화 증거                       | [`tests/rankings.test.ts`](../../tests/rankings.test.ts)                                                     | 동점, 경계 동점, 25행 페이지, 내 위치, history, 조건부 지표 및 상태 테스트 추가                  |
| 다국어 label                           | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                 | 한국어·일본어·영어 컨트롤, 상태, 접근 가능한 이름을 모두 추가                                    |

## 대표 fixture

최소한 다음을 검증한다.

1. 20페이지가 넘고 로그인 사용자가 1페이지에 있는 Basic Official Grd;
2. 로그인 사용자가 뒤 페이지에 있는 Basic NosLog Rating;
3. Rating 컨트롤을 보이지 않는 Recital;
4. 공개 Grd 하나를 세 명 이상이 공유하고 동점이 페이지를 가로지르는 상태;
5. raw Rating은 다르지만 공개 정수가 같은 두 사용자;
6. 현재 사용자가 활성 페이지에 있음, 다른 페이지에 있음, 자격 미충족인 상태;
7. 비로그인 공개 접근과 로그인 후 정확한 복귀;
8. 대한민국·일본·기타 지역 신원과 아바타·검정 누락 상태;
9. 한국어·일본어·라틴·혼합 문자로 된 유효한 `20`자 사용자명;
10. 결과 0명, 1명, 정확히 `25`명, `26`명, 수백 명;
11. 최초 Loading, 갱신 Loading, 최초 Error, 갱신 Error, Retry;
12. 공개 Rating 원본의 누락 또는 유효하지 않은 상태;
13. 한국어·일본어·영어의 다국어 URL과 label;
14. `320px`, 대표 `390px`, 중간 너비, 넓은 데스크톱;
15. 키보드 전용 컨트롤, 페이지네이션, 내 위치, 프로필 탐색.

## 브라우저 수용 계약

- `/ko/rankings`, `/ja/rankings`, `/en/rankings`는 다국어 metadata와 동등한
  동작으로 열린다.
- Basic은 Official Grd와 NosLog Rating을 보인다. Recital은 승인된 Source,
  Formula 및 Ranking 계약이 생길 때까지 Rating을 생략한다.
- 지역 변경은 페이지를 reset하고 모집단 순위를 다시 계산한다. `기타 지역`은
  대한민국과 일본을 제외하며 절대 Global이라고 표시하지 않는다.
- 브라우저 Back/Forward는 이전 모드, 지표, 지역, 페이지와 유용한 스크롤 맥락을
  복원한다.
- 직접 입력, 복사, 새로고침, 새 탭 페이지네이션 URL이 같은 데이터로 열린다.
- 성공한 모든 페이지는 최대 `25`행을 포함하고 올바른 total/page 맥락을 노출한다.
- 공개 값이 같으면 페이지 경계를 포함해 공동 competition rank를 표시한다.
- 현재 사용자를 완전한 summary와 보이는 행으로 동시에 중복하지 않는다.
- 내 위치는 포함 페이지를 열고, 색상만이 아닌 방법으로 행을 표시하며, 알맞은
  Focus 맥락을 제공한다.
- 사용자명, 국가 marker, 검정, 값은 compact와 wide layout 모두에서 승인된 통합
  행 구조를 따른다.
- `320 CSS px`에서 어떤 컨트롤, 내 순위 summary, 행 또는 페이지네이션 항목도
  문서 수준의 가로 overflow나 겹침을 만들지 않는다.
- wide layout은 Region/Exam 독립 열 또는 관련 없는 통계를 만들지 않고 추가 비교
  공간을 사용한다.
- Loading은 기존 행을 유지하고 busy 상태를 노출하며 stale response를 무시한다.
- Empty, Error, Rating-unavailable 상태를 구분할 수 있고 대응 가능하게 유지한다.
- 모든 컨트롤, 프로필 링크, 내 위치, Retry와 페이지네이션은 키보드만으로 동작하고
  보이는 Focus를 노출한다.
- 색상이나 image rendering 없이도 국가 marker와 내 행을 이해할 수 있다.
- 테스트한 정상 및 실패 flow에서 예상치 못한 브라우저 console error가 없다.

## 레퍼런스 매트릭스

| 출처                                                                                                                      | 전용 가능한 원칙                                                                         | NosLog 적용                                                             | 한계                                                               |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [현재 Rankings route](<../../app/(nevigation)/rankings/page.tsx>)                                                         | Query 정규화, 공개 접근, 서버 페이지 경계가 이미 존재                                    | 경로와 도메인 상태를 보존하며 compact shell을 교체                      | 현재 `7`행 정책은 대체됨                                           |
| [현재 Ranking browser](../../components/rankings/rankingBrowser.tsx)                                                      | 클라이언트 caching과 request-race ID가 일부 갱신을 이미 보호                             | 검증된 요청 기반을 재사용                                               | 현재 컨트롤은 과도하게 상시 노출되고 history는 Replace를 사용      |
| [현재 ranking query](../../lib/rankings.ts)                                                                               | 지역 모집단과 Rating 원본·계산을 정의                                                    | 도메인 의미를 보존하고 필요한 동점 변경을 드러냄                        | 현재 서수 순위는 승인된 공동 순위와 다름                           |
| [승인된 IA](./02-information-architecture.ko.md)                                                                          | 랭킹은 Records-and-comparison의 독립 목적지                                              | Home/More 직접 접근과 공개 경로를 유지                                  | 행 구조는 정의하지 않음                                            |
| [승인된 서열표 기획서](./06-tier-list-page-brief.ko.md)                                                                   | Basic Rating은 공개 Basic Pianist 서열표 정책에 고정                                     | Rating 설명과 자격을 일관되게 유지                                      | 서열표 내비게이션이 랭킹 UI를 결정하지 않음                        |
| [NOSTALGIA 공식 모드 안내](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                                | Basic과 Recital은 서로 다른 게임 모드                                                    | 모드를 지표 위에 유지                                                   | NosLog 랭킹 지표는 정의하지 않음                                   |
| [osu! 글로벌 랭킹](https://osu.ppy.sh/rankings/osu/global/performance)                                                    | 국가 범위, 명시적 정렬 맥락, 조밀한 플레이어 비교, 번호 페이지 사용                      | 프로필 신원과 페이지네이션이 있는 하나의 범위 지정 랭킹 데이터셋을 지지 | osu!는 NosLog에 불필요한 지표도 더 많이 노출                       |
| [ScoreSaber 플레이어 랭킹](https://scoresaber.com/rankings)                                                               | 순위, 플레이어 신원, 주 PP, 국가 맥락과 명시적 페이지를 함께 유지                        | compact 리듬게임 플레이어 행을 지지                                     | Beat Saber PP 의미는 Grd와 같지 않음                               |
| [ScoreSaber 랭킹 시스템](https://wiki.scoresaber.com/ranking-system.html)                                                 | global과 country 비교 모집단을 구분                                                      | 명시적 지역 범위를 지지                                                 | NosLog는 임의 국가가 아니라 세 프로필 범주를 사용                  |
| [Google Play Games leaderboards](https://support.google.com/googleplay/answer/3129939)                                    | 공개 비교와 플레이어 프로필 탐색이 개인 위치와 공존                                      | 공개 목록과 문맥형 내 순위를 지지                                       | native game UI가 웹 layout을 규정하지 않음                         |
| [Strava leaderboard filters](https://support.strava.com/en-us/articles/15401771-segment-leaderboard-filters)              | 보조 모집단을 compact filter로 선택                                                      | 네 상시 버튼 대신 지역 selector 하나를 지지                             | 스포츠·시간 filter는 NosLog 범위 밖                                |
| [Chess.com leaderboards](https://www.chess.com/leaderboard)                                                               | 비교 범주를 구분하고 순위·신원·값을 정렬해 표시                                          | 모드·지표 계층과 wide 비교를 지지                                       | 체스 범주와 자격은 다름                                            |
| [Lichess FAQ: leaderboards](https://lichess.org/faq#leaderboards)                                                         | 자격 규칙이 랭킹 등장 여부에 실질적으로 영향                                             | 명확한 자격 미충족과 사용 불가 상태를 지지                              | Glicko 자격은 NosLog 정책이 아님                                   |
| [jubeat best-score ranking](https://p.eagate.573.jp/game/jubeat/beyond/ranking/best_score.html?mid=19600729&seq=0)        | 공식 BEMANI 랭킹 증거는 보이는 점수를 중심에 둠                                          | 도메인에 익숙한 순위·값 훑어보기를 지지                                 | 악곡별 점수 랭킹은 사용자 전체 Grd 랭킹이 아님                     |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                               | 진짜 2D 콘텐츠 외에는 320 CSS px에서 정보와 기능을 보존                                  | 문서 가로 스크롤 없는 compact 행을 요구                                 | NosLog 행 styling을 정하지 않음                                    |
| [W3C HTML Technique H51](https://www.w3.org/WAI/WCAG21/Techniques/html/H51)                                               | 표 관계에는 programmatically determinable한 table 구조가 필요                            | semantic wide 비교 table을 지지                                         | compact layout은 ordered ranked-list presentation을 사용할 수 있음 |
| [WAI-ARIA APG: Table](https://www.w3.org/WAI/ARIA/apg/patterns/table/)                                                    | 정적 표 데이터에는 행·cell 관계가 필요하며 가능한 native table을 선호                    | wide 결과 semantics를 안내                                              | 시각 디자인 시스템은 아님                                          |
| [Carbon Content switcher](https://carbondesignsystem.com/components/content-switcher/usage/)                              | 비슷한 관련 콘텐츠는 controlled area 위의 간결한 exclusive switch를 사용할 수 있음       | Basic/Recital과 subordinate Basic 지표 계층을 지지                      | Carbon styling은 채택하지 않음                                     |
| [Carbon Data table](https://carbondesignsystem.com/components/data-table/usage/)                                          | Table은 비교 값을 정렬하고 명확한 상태·계층이 필요                                       | 의도적인 데스크톱 확장을 지지                                           | NosLog 모바일 밀도에는 compact variant가 필요                      |
| [Carbon Pagination](https://carbondesignsystem.com/components/pagination/usage/)                                          | 경계가 있는 큰 dataset은 명시적 페이지 탐색과 total 맥락 사용                            | 고정 25행 페이지를 지지                                                 | Carbon page-size selector는 의도적으로 채택하지 않음               |
| [USWDS Button group](https://designsystem.digital.gov/components/button-group/)                                           | 관련 선택은 grouping이 필요하고 과도한 button density를 피해야 함                        | 2단계 exclusive controls와 secondary region disclosure를 지지           | action-button 지침이 도메인 계층을 결정하지 않음                   |
| [USWDS Pagination](https://designsystem.digital.gov/components/pagination/)                                               | 경계가 있는 collection은 이전/다음, 경계, 인접 항목, 접근 가능한 nav label의 이점이 있음 | 승인된 compact pager를 지지                                             | 정확한 항목 수는 반응형으로 결정                                   |
| [GOV.UK Pagination](https://design-system.service.gov.uk/components/pagination/)                                          | 이전/다음과 의미 있는 목적지는 실제 link로 유지해야 함                                   | 견고한 history와 no-JavaScript 탐색을 지지                              | 숫자 랭킹 페이지에는 content-page label이 불필요                   |
| [MDN Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | 반응형 layout은 fluid composition과 콘텐츠 기반 breakpoint로 적응                        | 고정 `390px` 데스크톱 shell을 거부                                      | 일반 지침은 랭킹 density를 정하지 않음                             |
| [web.dev Responsive design basics](https://web.dev/articles/responsive-web-design-basics)                                 | 작은 화면에서 시작하고 콘텐츠가 필요로 하는 지점에 breakpoint를 추가                     | mobile-first 행과 의도적 데스크톱 비교를 지지                           | 정확한 threshold에는 Foundation specimen이 필요                    |

### 근거의 수렴

- 리듬게임 및 일반 leaderboard 제품은 하나의 안정적인 ranked dataset, compact
  범위 선택, 직접적인 플레이어 신원, 끝 정렬된 주 값, 명시적인 개인 위치에
  수렴한다.
- 권위 있는 pagination 시스템은 경계가 있는 비교 집합에 탐색 가능한 이전/다음과
  번호 페이지를 사용하는 방향으로 수렴한다. 주 랭킹 탐색으로 무한 스크롤을
  지지하지 않는다.
- 반응형 지침은 고정 휴대폰 너비 데스크톱 페이지가 아니라 compact stacked/list
  presentation과 더 넓은 aligned comparison presentation으로 수렴한다.
- 접근성 지침은 programmatic result 관계, label이 있는 control과 navigation,
  보이는 Focus, 색상 외 상태 cue로 수렴한다.
- 어떤 외부 출처도 Basic/Recital, Official Grd, NosLog Rating, 내부 `global`
  모집단, 검정 의미 또는 공개 값 공동 순위 정책을 정의하지 않는다. 이는 검증된
  NosLog/NOSTALGIA 도메인 동작과 사용자 명시 결정에서 나온다.

## 기각 및 대체된 대안

- **네 개의 상시 지역 버튼 유지 — Superseded:** 지역은 하나의 compact secondary
  Select 또는 popup으로 바꾼다.
- **Recital에 Rating을 보이고 활성화하면 Basic으로 전환 — Rejected:** 사용할 수
  없는 지표 컨트롤이 주 모드를 예기치 않게 변경해서는 안 된다.
- **페이지 크기 7명 유지 — Superseded:** 승인된 고정 페이지는 25명이다.
- **페이지 크기 selector 제공 — Rejected:** 주 비교 과업에 도움이 되지 않으면서
  컨트롤 밀도만 높인다.
- **무한 스크롤 사용 — Rejected:** 경계가 있는 랭킹에서 위치, 공유, Back 동작,
  내 위치 탐색을 약화한다.
- **완전한 내 사용자 카드 항상 표시 — Superseded:** 다른 페이지에서는 compact
  summary를, 보이는 페이지에서는 표시된 행을 사용한다.
- **개인 empty와 결과 empty를 모두 표시 — Rejected:** 모집단이 비면 결과 empty
  메시지 하나면 충분하다.
- **같은 공개 값에 고유 순위 부여 — Rejected:** competition shared rank
  `1, 2, 2, 4`를 사용한다.
- **국가 marker를 아바타 앞이나 아바타와 사용자명 사이에 배치 — Rejected:**
  아바타·이름 신원을 보존하고 marker를 사용자명 뒤에 둔다.
- **데스크톱에 Region과 Exam 독립 열 생성 — Rejected:** 모든 layout에서 보조
  플레이어 신원 metadata로 유지한다.
- **두 번째 상태 설명 예시를 최종 layout 기준으로 사용 — Rejected:** 그 예시는
  상태만 설명하며 첫 번째로 승인한 랭킹 구조가 layout을 지배한다.
- **모든 선택·페이지 변경에 Replace-only history 유지 — Superseded:** 탐색 가능한
  URL과 복원 가능한 history를 사용한다.
- **데스크톱에서도 전체 제품을 390px로 고정 — Rejected:** `390px`은 대표 모바일
  검토 canvas일 뿐이다.

## 결정 기록

| ID      | 결정                                                                                         | 상태       |
| ------- | -------------------------------------------------------------------------------------------- | ---------- |
| RANK-01 | 글로벌 랭킹은 독립적인 공개 비교 목적지로 유지                                               | `Approved` |
| RANK-02 | Basic/Recital은 항상 보이는 primary exclusive choice                                         | `Approved` |
| RANK-03 | Official Grd는 두 모드에 존재하며 현재 NosLog Rating은 Recital Source 승인 전까지 Basic 전용 | `Approved` |
| RANK-04 | 사용할 수 없는 동안 Recital은 지표 Switch를 숨기고 Rating을 Basic으로 Redirect하지 않음      | `Approved` |
| RANK-05 | 지역은 selector 하나에서 전체/대한민국/일본/기타 지역 사용                                   | `Approved` |
| RANK-06 | 내부 `global`은 Global이 아니라 기타 지역으로 표시                                           | `Approved` |
| RANK-07 | 조건과 페이지는 탐색 가능한 history로 공유·복원 가능                                         | `Approved` |
| RANK-08 | 다른 페이지의 내 위치는 compact summary와 내 위치 action 사용                                | `Approved` |
| RANK-09 | 현재 페이지의 내 위치는 중복 summary를 제거하고 행을 표시                                    | `Approved` |
| RANK-10 | 공개 Grd 또는 Rating 값이 같으면 competition shared rank 사용                                | `Approved` |
| RANK-11 | 플레이어 신원은 아바타, 사용자명과 국가 marker, 두 번째 줄 검정                              | `Approved` |
| RANK-12 | 국가와 검정은 데스크톱에서도 독립 열이 되지 않음                                             | `Approved` |
| RANK-13 | 대한민국/일본은 국기, 기타 지역은 접근 가능한 이름이 있는 지구본 사용                        | `Approved` |
| RANK-14 | 페이지 크기는 25명 고정이며 page-size selector 없음                                          | `Approved` |
| RANK-15 | 무한 또는 추가 스크롤 대신 명시적 페이지네이션 사용                                          | `Approved` |
| RANK-16 | Loading은 마지막 성공 결과를 보존하고 busy 상태를 노출                                       | `Approved` |
| RANK-17 | Empty, Error, 개인 자격 미충족, Rating 사용 불가 상태를 구분                                 | `Approved` |
| RANK-18 | Compact layout은 문서 가로 스크롤 없이 320px까지 reflow                                      | `Approved` |
| RANK-19 | Wide layout은 통합 신원 metadata를 유지하며 비교 너비 사용                                   | `Approved` |
| RANK-20 | 상태 설명 layout이 아니라 첫 번째 승인 랭킹 구조가 구성을 지배                               | `Approved` |

## 인계 경계

Claude Design은 Foundation 승인 후 최종 type scale, 컨트롤·행 비율, 색상,
간격, 아바타 fallback style, 포디움 처리, border, surface, loading indicator,
정확한 콘텐츠 기반 layout 전환을 결정할 수 있다. 그러나 위의 계층, 조건부
컨트롤, 모집단 의미, 통합 플레이어 신원, 공동 순위 의미, 내 위치 동작,
페이지네이션, 상태, 수용 기준을 보존해야 한다. 이후 Codex 구현 세션은 Claude
결과를 이 기획서와 비교해야 하며, 오해를 부르는 컨트롤, 같은 공개 값의 고유
순위, 독립 국가·검정 열, 중복 내 사용자 콘텐츠, 고정 휴대폰 shell 또는 그 밖의
충돌하는 동작이 다시 도입되면 가이드 또는 디자인 수정을 요청해야 한다.
