# NosLog 2.0 공통 셸 및 내비게이션 기획서

## 문서 관리

- 상태: `승인`
- 결정 상태: `완전한 공통 셸 계약 승인: 절제된 일반 헤더, 비로그인 Login 또는
로그인 프로필 컨트롤, 하나의 내비게이션 Trigger, 순서가 정해진 2열 제품·
유틸리티 내비게이션, Compact Modal과 Wide Popover 적응, Compact 전용 스크롤
숨김, 푸터 전용 개인정보처리방침·GitHub, 최소 인증 셸, 집중형 채보 뷰어 셸,
시스템 복구 셸, 접근성·다국어·상태·브라우저 승인 기준`
- 근거 상태: `320, 390, 1280 CSS px의 저장소 및 브라우저 점검, 승인된 정보
구조와 페이지 기획서, 20개를 넘는 접근성·디자인 시스템·실제 서비스·리듬게임
레퍼런스, 사용자 승인 결정 기록`
- 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 원본 언어: 영어
- 영문 원본:
  [15-shared-shell-navigation-brief.md](./15-shared-shell-navigation-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 인증 및 온보딩 계약:
  [17-authentication-onboarding-page-brief.ko.md](./17-authentication-onboarding-page-brief.ko.md)
- 집중형 뷰어 계약:
  [07-chart-viewer-page-brief.ko.md](./07-chart-viewer-page-brief.ko.md)
- 범위: 반복되는 사용자 공개 셸, 일반 헤더, 계정·내비게이션 컨트롤, 열린
  내비게이션 동작, 푸터, 건너뛰기 경로, 의미적 Landmark, 반응형 적응, 스크롤
  가시성, 인증 셸, 집중형 뷰어 셸 경계, 복구 셸, 다국어, 접근성, 상태 및 향후
  구현 승인 기준
- 제외: 최종 시각 스타일, 정확한 Foundation Token, 정밀한 치수와 전환
  Breakpoint, 최종 다국어 문구, 페이지 고유 콘텐츠 계층, 관리자 화면 재설계,
  최종 High-fidelity 구성 및 이번 디자인 가이드 세션의 실제 제품 구현

## 결정 라벨

- **관찰:** 저장소, 현재 브라우저 근거, 승인된 상위 산출물 또는 인용 출처에서
  검증한 사실입니다.
- **승인:** 사용자와 명시적으로 합의했으며 후속 디자인에 구속력을 가집니다.
- **제안:** 근거가 있지만 사용자 승인을 기다리는 방향입니다.
- **미결정:** 추가 조사, 시험 또는 사용자 결정이 필요합니다.
- **거절:** 검토 후 명시적으로 선택하지 않은 방향입니다.
- **대체:** 이후 승인된 방향으로 교체된 내용입니다.

이 기획서는 셸 포함 범위, 정보 순서, 동작, 반응형 적응, 상태, 접근성 및 승인
기준의 권위 있는 기준입니다. 타이포, 색상, 간격, Border, Radius, Elevation,
아이콘 그림, 정확한 헤더 높이, Panel 너비 및 콘텐츠 기반 Compact·Wide 전환은
Foundation과 후속 Claude Design 작업입니다. 이후 결정은 표현을 다듬을 수 있지만
이 계약을 바꿀 수 없습니다.

## 목적

공통 셸은 페이지 콘텐츠와 경쟁하지 않으면서 네 가지 질문에 답합니다.

> 지금 어떤 서비스를 사용하고 있는가, 다른 주요 NosLog 목적지로 어떻게
> 이동하는가, 내 계정에는 어떻게 접근하는가, 현재 문맥이 예외적일 때 어떻게
> 복구하는가?

NosLog에는 독립적인 제품 목적지가 충분히 많아 안정적인 방향 파악과 접근이
필요하지만, 모든 목적지를 상시 헤더 버튼으로 노출해서는 안 됩니다. 셸은 콘텐츠
주변의 안정적인 틀이며 Dashboard, Site Map 또는 페이지 내부 문맥 링크의
대체물이 아닙니다.

## 주요 문맥과 성공 조건

- **승인:** 오락실 주변의 모바일 사용이 주요 문맥입니다. 대표 `390px` Canvas는
  고정 앱 너비나 보편적 Breakpoint가 아닙니다.
- **승인:** 일반 페이지는 사용자가 NosLog를 식별하고, 홈으로 이동하며, 계정
  상태에 접근하고, 전체 전역 목적지 집합을 열고, 반복 내비게이션을 건너뛰며,
  혼잡 없이 페이지 콘텐츠로 이동할 수 있을 때 성공합니다.
- **승인:** 넓은 페이지는 같은 목적지 의미와 순서를 유지하면서 Modal Compact
  Panel 대신 고정 Sticky 헤더와 Anchored Popover를 사용합니다.
- **승인:** 인증 페이지는 서비스 정체성, 홈 복구 및 푸터 신뢰 링크를 제거하지
  않으면서 내비게이션 방해를 줄입니다.
- **승인:** 채보 뷰어는 전용 집중형 셸을 사용합니다. 일반 헤더와 푸터가 채보
  공간을 차지하거나 재생을 방해하지 않습니다.
- **승인:** 점검과 치명적 오류 화면은 작동하지 않을 수 있는 전체 내비게이션
  대신 NosLog 정체성과 적절한 복구 행동만 제공합니다.
- **승인:** 한국어, 일본어 및 영어 레이아웃은 라벨 너비가 달라도 목적지 정체성과
  의미적 순서를 보존합니다.

## 현재 제품 근거

### 저장소 근거

- **관찰:** `app/(nevigation)/layout.tsx`는 현재 넓은 Viewport에서도 전체 일반
  페이지 셸을 약 `390px`인 `max-w-97.5`로 제한합니다.
- **관찰:** `components/layout/header.tsx`는 현재 NosLog, 이름 있는 목적지 링크
  세 개, 계정·프로필 및 열린 메뉴 Trigger를 표시합니다.
- **관찰:** `components/layout/headerNavigation.tsx`는 현재 빙고, 검정, 오락실,
  데이터 연동 및 조건부 관리자만 제공합니다. 승인된 전체 전역 목적지 집합,
  공개 설정 및 피드백을 제공하지 않습니다.
- **관찰:** `components/layout/scrollAwareHeader.tsx`는 현재 `1024px` 미만에서
  아래 스크롤 시 헤더를 숨기고 넓은 너비에서는 유지합니다. 해당 숫자는 구현
  근거이며 승인된 2.0 Breakpoint가 아닙니다.
- **관찰:** 현재 열린 Panel은 Body 스크롤을 잠그고 Escape로 닫히지만 브라우저
  점검에서 완전한 Focus containment는 확인되지 않았습니다.
- **관찰:** `components/layout/footer.tsx`는 이미 개인정보처리방침, GitHub 및
  Copyright 콘텐츠를 제공합니다.
- **관찰:** `app/(auth)/layout.tsx`는 현재 일반 헤더나 푸터를 제공하지 않습니다.
  Login 본문에는 개인정보처리방침 Inline Link가 있지만, 이는 현재 제품 근거일
  뿐 승인된 공통 셸 요구사항이 아닙니다.

### 브라우저 근거

- **관찰:** `1280px`에서도 일반 콘텐츠는 Desktop 공간에 적응하지 않고 약
  `390px` 열 가운데에 유지됩니다.
- **관찰:** `390px`에서 헤더는 계정·내비게이션 컨트롤 외에 악곡, 랭킹 및 서열을
  유지합니다.
- **관찰:** 일본어 `320px`에서 상시 목적지 라벨이 서비스 정체성과 컨트롤을
  혼잡하게 만듭니다.
- **관찰:** 현재 2열 열린 Panel은 약 `390px`를 유지하며 Desktop Anchored
  Popover로 바뀌지 않습니다.
- **관찰:** 브라우저 접근성 점검에서 열린 내비게이션 Backdrop과 Trigger 주변에
  중복된 닫기 이름이 노출됐습니다. 재설계 셸은 하나의 명확한 보이는 닫기 동작과
  하나의 일관된 접근 가능 상호작용 범위를 제공해야 합니다.

## 승인된 셸 변형

| 변형                | 적용                                                                                                                   | 필수 반복 콘텐츠                                                              | 명시적 제외                                                 | 상태   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------- | ------ |
| 일반 공개 셸        | 홈, 악곡, 랭킹, 서열, 빙고, 검정, 오락실, 데이터 연동, 설정, 프로필, 공지, 개인정보처리방침 및 기타 일반 사용자 페이지 | 건너뛰기 경로, 반응형 헤더, 하나의 `main`, 일반 푸터                          | 상시 하단 내비게이션, 헤더의 이름 있는 목적지 행            | `승인` |
| 최소 인증 셸        | Login, Onboarding 및 인증 복구                                                                                         | 다국어 홈에 연결된 NosLog 정체성, 하나의 `main`, 일반 신뢰 푸터               | 프로필 컨트롤, 더보기 Trigger, 전역 목적지 Panel            | `승인` |
| 집중형 채보 뷰어 셸 | 낙하형 뷰어, 전체 채보 뷰어 및 전체 화면 상태                                                                          | 뷰어 기획서에서 정의한 전용 복귀·방향 컨트롤, 채보 정체성, Tab 및 재생 컨트롤 | 일반 헤더, 더보기 Panel, 일반 푸터                          | `승인` |
| 시스템 복구 셸      | 점검 및 치명적 Application 오류 상태                                                                                   | NosLog 정체성, 명확한 상태 메시지, 문맥에 맞는 복구 행동                      | 목적지가 안정적으로 작동하지 않을 때의 전체 전역 내비게이션 | `승인` |

개인정보처리방침 페이지 자체는 일반 공개 셸을 사용할 수 있습니다. “푸터 전용”은
개인정보처리방침 목적지를 전역적으로 어디에서 알리는지를 뜻하며, 해당 페이지
자체에 일반 헤더를 두지 말라는 뜻이 아닙니다.

## 일반 공개 셸 계약

### 의미적 순서

문서 순서는 다음과 같습니다.

1. 본문 바로가기 링크;
2. Site Header;
3. 페이지 단위 `main` Landmark;
4. 일반 Footer.

페이지 단위 `main`은 정확히 하나여야 합니다. 페이지 컴포넌트가 중첩되거나
경쟁하는 `main` Landmark를 만들면 안 됩니다. 넓은 너비에서 시각적으로
재배치하더라도 읽기·Focus 순서가 다르거나 혼란스러워지면 안 됩니다.

### 헤더 구성

일반 헤더에는 다음만 포함합니다.

1. **왼쪽:** 다국어 홈으로 연결되는 NosLog 정체성.
2. **오른쪽 계정 위치:** 비로그인 상태의 보이는 다국어 Login Text Control 또는
   로그인 상태의 프로필 이미지·컨트롤.
3. **오른쪽 내비게이션 위치:** 전역 목적지 Panel을 여는 내비게이션·Hamburger
   Icon Control.

악곡, 채보 뷰어, 랭킹, 서열, 빙고, 검정, 오락실, 데이터 연동, 설정, 피드백,
개인정보처리방침, GitHub 및 관리자는 이름 있는 상시 헤더 컨트롤이 아닙니다.

### 서비스 정체성

- 보이는 정체성은 `NosLog`이며 Legacy `NOSTORY` 이름으로 바꾸지 않습니다.
- 활성 언어의 홈 경로로 연결합니다.
- 전체 화면 Browser UI가 집중형 뷰어 계약에 따라 일시적으로 숨길 수 있는 경우를
  제외하고 네 가지 셸 변형에서 유지합니다.
- 최종 Wordmark 그림, 크기 및 타이포는 Foundation에서 결정합니다. 과도한
  컨트롤을 수용하기 위해 읽기 어려울 정도로 줄여서는 안 됩니다.

### 계정 컨트롤

- **비로그인:** 보이는 다국어 Login Text Control을 표시합니다. 라벨 없는 Avatar
  Placeholder에 의존하지 않습니다.
- **로그인:** 현재 프로필 이미지·컨트롤을 표시합니다. 접근 가능한 이름은 비공개
  Discord 정보를 노출하지 않으면서 프로필 목적지 또는 계정 소유자를 식별합니다.
- 로그인 프로필 컨트롤은 사용자 프로필 목적지를 바로 엽니다. 설정이나 전체
  더보기 Panel을 중복하지 않습니다.
- 프로필 이미지가 없거나 실패하면 인접 컨트롤을 움직이지 않는 접근 가능한
  Fallback을 사용합니다.

### 내비게이션 Trigger

- 항목별 Overflow List가 아니라 주요 목적지 집합을 열기 때문에 Ellipsis 대신
  익숙한 내비게이션·Hamburger 기호를 사용합니다.
- 다국어 접근 가능 이름, `aria-expanded`, `aria-controls` 또는 동등한 연결을
  제공합니다.
- 모든 제품 페이지에서 Trigger가 항상 선택된 것처럼 보이지 않으면서 열린 상태를
  전달해야 합니다.
- 열린 상호작용은 정확히 하나의 명확한 보이는 닫기 동작을 제공합니다. 하나의
  동작에 중복된 접근 가능 `내비게이션 닫기` 컨트롤을 만들지 않습니다.

## 전역 목적지 Panel

### 정보 순서

승인된 시각적 행과 의미적 순서는 다음과 같습니다.

| 행               | 왼쪽                                 | 오른쪽             |
| ---------------- | ------------------------------------ | ------------------ |
| 1                | 악곡                                 | 채보 뷰어          |
| 2                | 랭킹                                 | 서열               |
| 3                | 빙고                                 | 검정               |
| 4                | 오락실                               | 데이터 연동        |
| 구분선           | 유틸리티 시작, 보이는 그룹 제목 없음 | —                  |
| 5                | 설정                                 | 피드백 · 오류 제보 |
| 조건부 마지막 행 | 권한이 있을 때 관리자                | 비움               |

선형 DOM, 읽기 및 Keyboard 순서는 각 행의 왼쪽에서 오른쪽으로 진행한 뒤 위에서
아래로 진행합니다. CSS가 시각 Track을 바꾸더라도 이 순서를 바꾸면 안 됩니다.

### 콘텐츠 규칙

- 각 목적지는 아이콘과 간결한 다국어 Text Label만 사용합니다.
- 이후 가이드 개정에서 검증된 필요를 확정하지 않는 한 전역 Panel에 설명, Count,
  Badge, 홍보 문구 또는 보조 설명을 추가하지 않습니다.
- 보이는 제품 그룹 라벨을 추가하지 않습니다. 시각적 Divider로 8개 제품 목적지와
  2개 유틸리티를 구분합니다.
- 서열, 빙고 및 검정은 독립 목적지입니다. 인접해 있어도 `도전` 등의 통합
  개념을 만들지 않습니다.
- 설정은 로그인 여부와 관계없이 하나의 공개 경로를 사용하며, 페이지 콘텐츠가
  사용자 상태에 적응합니다.
- 피드백 · 오류 제보는 승인된 Dialog 제출 흐름을 유지합니다. 홈이나 푸터에
  중복하지 않습니다.
- 관리자는 권한이 있는 관리자에게만 조건부 마지막 목적지로 시각적으로 분리해
  표시합니다. 없을 때 혼란스러운 빈 공간을 남기지 않습니다.
- 개인정보처리방침과 GitHub는 이 Panel에 절대 넣지 않습니다.

### 목적지 의미

- 악곡은 공용 탐색 Surface를 악곡 범위로 엽니다.
- 채보 뷰어는 같은 Surface를 채보 범위로 엽니다. 승인된 채보 탐색 흐름의 직접
  진입점이며 중복 Catalog가 아닙니다.
- 랭킹, 서열, 빙고, 검정, 오락실 및 데이터 연동은 각자의 독립적인 승인 페이지
  패밀리를 엽니다.
- 현재 목적지는 해당 Link의 `aria-current="page"` 또는 동등한 Route-aware
  의미 상태를 사용합니다. 하위 경로에서는 소유 목적지를 현재 상태로 표시할 수
  있습니다.
- Panel을 여는 동작은 현재 Route, Query, Scroll 위치 또는 Form 상태를 바꾸지
  않습니다.

## 반응형 Panel 동작

### Compact Modal 적응

- Panel은 보이는 헤더 바로 아래에서 사용 가능한 콘텐츠 너비를 채우고 동등한
  의미의 2열을 사용합니다.
- Scrim이 열린 내비게이션 상태와 페이지 콘텐츠를 분리합니다.
- Panel이 열려 있는 동안 페이지 스크롤을 잠급니다.
- 닫힐 때까지 Keyboard Focus를 내비게이션 상호작용 범위 안에 가둡니다.
- Panel이 열려 있거나 Focus가 상호작용 범위 안에 있는 동안 헤더를 보입니다.
- 열 때는 최종 접근 가능 컴포넌트 계약에 따라 Focus를 옮기고, 닫을 때는
  내비게이션으로 새 페이지로 이동한 경우가 아니면 Trigger로 Focus를 돌려줍니다.
- Escape, 보이는 닫기 동작, 목적지 활성화 및 의도적인 Scrim·Outside 동작으로
  Panel을 닫습니다.
- 승인된 전체 내비게이션이 사용 가능한 Viewport에서 Reflow할 수 있는 동안
  내부 Scroll 영역을 추가하지 않습니다. 매우 낮은 Viewport에서도 200%와 400%
  Zoom에서 마지막 행동을 숨기지 않고 조작 가능해야 합니다.

### Wide Popover 적응

- Panel은 내비게이션 Trigger에 Anchoring한 오른쪽 정렬 2열 Non-modal
  Popover로 바뀝니다.
- 페이지 스크롤은 유지하며 Modal Scrim이나 Body Lock을 사용하지 않습니다.
- 외부 Pointer 동작, Escape, 목적지 활성화 또는 Trigger Toggle로 닫습니다.
- Focus를 강제로 가두지 않지만 Keyboard 탐색과 Focus 복귀는 예측 가능해야 합니다.
- Popover는 Viewport 안에 머물며 Trigger나 Focus된 요소를 가리지 않습니다.

### 전환 규칙

Modal과 Popover 사이 전환은 콘텐츠를 기준으로 합니다. 현재 `1024px` 로직은
규정 Breakpoint가 아닙니다. Foundation 및 후속 레이아웃 시험에서 전체 헤더와
Panel이 혼잡, 잘림 또는 사용할 수 없는 Pointer·Keyboard Target 없이 맞는 지점을
선택해야 합니다. 전환 전후 Taxonomy, 행 순서 및 목적지 의미는 바뀌지 않습니다.

## 스크롤 인식 헤더 계약

- Compact 레이아웃에서는 콘텐츠 공간을 위해 아래 방향 문서 스크롤 시 헤더를
  숨기고 위 방향 스크롤 시 다시 표시할 수 있습니다.
- 넓은 Desktop 레이아웃에서는 헤더가 계속 보이는 Sticky 상태를 유지합니다.
- 최초 Load와 모든 Route 변경 후 헤더는 보이는 상태로 시작합니다.
- 목적지 Panel이 열려 있거나, Focus가 헤더·Panel 컨트롤 안에 있거나,
  Skip-link Target 전환 중에는 헤더를 유지합니다.
- Keyboard Focus가 가려질 상황이라면 그 전에 헤더를 다시 표시해야 합니다.
- 고정 지점 주변의 작은 Scroll 떨림이 반복적인 숨김·표시를 만들면 안 됩니다.
- 문서 상단 근처에서는 항상 다시 표시합니다.
- `prefers-reduced-motion: reduce`에서는 Slide Transition을 제거하며 움직임 없이
  가시성을 바꿀 수 있습니다.
- 정확한 Threshold, Hysteresis 거리, Duration, Easing, 헤더 높이 및 Compact
  전환 너비는 현재 구현에서 임의로 상속하지 않고 Foundation·Prototype 측정으로
  정합니다.

## 푸터 계약

일반 푸터에는 여기서 요구하는 안정적인 신뢰·프로젝트 계층만 포함합니다.

1. 개인정보처리방침;
2. 외부 목적지임을 식별한 GitHub;
3. NosLog Copyright·서비스 고지.

- 개인정보처리방침과 GitHub는 푸터 목적지이며 헤더나 더보기 Panel에 중복하지
  않습니다.
- 개인정보처리방침은 비로그인 상태에서도 접근할 수 있습니다.
- 계정 삭제 문맥에서는 충분한 고지를 위해 추가적인 문맥 개인정보처리방침
  Link를 둘 수 있습니다. 이것이 개인정보처리방침을 전역 헤더 목적지로 만들지는
  않습니다.
- Login 본문의 추가 Inline 개인정보처리방침 Link 여부는 인증 페이지 기획서로
  미룹니다. 현재 Inline Link 자체는 승인된 2.0 요구사항이 아닙니다.
- 푸터를 두 번째 전체 Site Map으로 만들지 않습니다.

## 최소 인증 셸

- Login, Onboarding 및 인증 복구는 다국어 홈 경로로 연결된 NosLog 정체성을
  사용합니다.
- 인증 문맥이 확정되기 전에 프로필이나 더보기 컨트롤을 표시하지 않습니다.
- 건너뛰기 경로, 정확히 하나의 `main` 및 일반 신뢰 푸터를 유지합니다.
- 사용자가 Browser Back에 의존하지 않고 인증을 나와 홈으로 돌아갈 수 있어야
  합니다.
- Login 방식, Discord 고지, Inline 문맥 개인정보처리방침 Link, 온보딩 콘텐츠,
  미완료 프로필 Gate, 안전한 복귀 및 인증 복구는
  [17-authentication-onboarding-page-brief.ko.md](./17-authentication-onboarding-page-brief.ko.md)를
  따릅니다.

## 집중형 채보 뷰어 셸 경계

- 집중형 채보 뷰어는 일반 헤더, 더보기 Panel 또는 푸터를 표시하지 않습니다.
- 전용 신뢰 가능한 복귀 경로와 보이는 악곡·채보 정체성을 제공합니다.
- 뷰어 Tab, 낙하형 전체 화면, 재생, 로컬 음원, 메트로놈, 엄밀한 연주, 반응형
  Rendering 및 상태 보존은
  [07-chart-viewer-page-brief.ko.md](./07-chart-viewer-page-brief.ko.md)를 따릅니다.
- 전체 화면 진입·종료가 두 번째 일반 셸이나 중첩 `main` Landmark를 만들면 안
  됩니다.
- 집중형 뷰어 내부의 피드백 접근은 뷰어 기획서의 지배를 받으며 일반 더보기
  Panel에서 추론하지 않습니다.

## 시스템 복구 셸

- 점검과 치명적 Application 오류는 NosLog 정체성, 간결한 상태 의미 및 가장
  유용한 복구 행동을 표시합니다.
- 작동하지 않는 것으로 알려진 전역 목적지를 표시하지 않습니다.
- 일반 페이지 안의 복구 가능한 페이지 단위 오류는 일반 셸을 유지할 수 있으며,
  해당 페이지 기획서가 복구 행동을 정합니다.
- Not-found 페이지는 Application 자체가 초기화되지 못한 경우가 아니라면 홈이나
  다른 유효 목적지로 이동할 충분한 셸 문맥을 보존합니다.

## 접근성 계약

- 페이지 단위 `main`을 대상으로 하는 첫 Focus 가능 본문 바로가기 Link를
  제공합니다.
- 여러 내비게이션 영역이 있으면 중복되지 않는 접근 가능 이름과 함께 `header`,
  `nav`, `main`, `footer` Landmark를 사용합니다.
- 열린 목적지 집합은 Link Navigation입니다. 일반 페이지 Link에 부적합한
  Desktop Menu Keyboard 의미를 강제하는 ARIA `menu` 또는 `menuitem` Role을
  사용하지 않습니다.
- Route 목적지는 Native Link, 열기·닫기 동작은 Native Button을 사용합니다.
- 모든 너비와 언어에서 논리적인 DOM·Focus 순서를 보존합니다.
- WCAG 2.2 Target Size 또는 간격 요구사항을 충족합니다. 자주 사용하는 Compact
  Control은 Foundation 비율이 허용하면 최소보다 큰 크기를 목표로 합니다.
- Focus Indicator는 대비를 충족하며 Sticky Header, Popover, Panel 또는 Viewport
  경계에 잘리지 않습니다.
- `320 CSS px`에서 페이지 단위 2차원 스크롤 없이 Reflow합니다. 200%와 400%
  Zoom에서도 모든 목적지와 닫기 동작을 사용할 수 있어야 합니다.
- 열린 목적지 Panel에서는 아이콘만으로 의미를 전달하지 않고 각 Link의 보이는
  Text Label을 유지합니다.
- 열기, 닫기, Route 변경 및 계정 이미지 실패는 시끄러운 Custom Live Region
  없이 Native Semantics로 전달합니다.

## 다국어 계약

- 한국어, 일본어 및 영어에서 같은 목적지 정체성과 상대적 순서를 보존합니다.
- 최종 라벨은 다국어 단계에서 검증합니다. 이 기획서는 검토되지 않은 번역
  문자열 집합이 아니라 목적지 의미를 승인합니다.
- 채보 뷰어, 피드백 · 오류 제보, 데이터 연동, 다국어 Login 및 관리자 문구를
  포함한 대표 긴 라벨을 시험합니다.
- 한 줄을 유지하려고 의미가 달라질 정도로 번역을 줄이지 않습니다. 2열 행의
  가독성을 유지하면서 셀 안에서 Link가 줄바꿈될 수 있습니다.
- NosLog 서비스명은 번역하지 않습니다.
- 홈, 각 목적지, 설정, 개인정보처리방침, Login 및 프로필 Route는 사용자가
  명시적으로 언어를 바꾸지 않는 한 활성 `/ko`, `/ja`, `/en` Locale을 보존합니다.
- 비로그인 Browser Preference와 로그인 Account Preference 동작은 승인된 정보
  구조와 이후 설정 기획서를 따릅니다.

## Runtime 상태 계약

| 상태                    | 필수 표현 및 동작                                                          | 상태   |
| ----------------------- | -------------------------------------------------------------------------- | ------ |
| 비로그인                | Login Text와 내비게이션 Trigger, 전체 공개 목적지 Panel                    | `승인` |
| 로그인                  | 프로필 이미지·컨트롤과 내비게이션 Trigger, 전체 공개 목적지 Panel          | `승인` |
| 관리자                  | 로그인 상태와 조건부 마지막 관리자 목적지                                  | `승인` |
| 프로필 이미지 없음·오류 | Layout Shift 없는 안정적이고 접근 가능한 Fallback                          | `승인` |
| Compact Panel 닫힘      | 페이지 스크롤 가능, Trigger가 닫힘 상태 보고                               | `승인` |
| Compact Panel 열림      | 헤더 아래 2열, Scrim, Body Lock, Focus containment, 보이는 닫기 동작       | `승인` |
| Wide Popover 열림       | 오른쪽 Anchored 2열, Scrim·Body Lock 없음, 예측 가능한 Outside·Escape 닫기 | `승인` |
| 현재 하위 Route         | 소유 목적지에 의미적 현재 상태 표시                                        | `승인` |
| Route 전환              | 셸은 보이는 상태로 시작, 열린 내비게이션 닫힘, Focus가 Route 계약을 따름   | `승인` |
| Reduced motion          | 헤더 Slide 없음, 본질적 의미가 Animation에 의존하지 않음                   | `승인` |
| 320 CSS px              | 가로 페이지 스크롤 없음, Label·Target 조작 가능                            | `승인` |
| 긴 다국어 문구          | 잘림, 의미적 재정렬 또는 숨겨진 목적지 없이 줄바꿈·적응                    | `승인` |
| 집중형 뷰어             | 뷰어 전용 셸만 사용                                                        | `승인` |
| 점검·치명적 오류        | 최소 정체성과 복구 행동                                                    | `승인` |

## 거절되거나 대체된 대안

- **상시 모바일 하단 내비게이션 — 거절:** 모바일 전용 전역 Taxonomy를 만들고
  채보와 오락실 사용의 Viewport 공간을 차지합니다. NosLog는 하나의 반응형 상단
  셸 모델을 유지합니다.
- **헤더의 이름 있는 상시 제품 링크 — 거절:** 현재 `320px` 근거에서 혼잡하며
  승인된 Panel이 이미 전체 접근을 제공합니다.
- **전역 내비게이션 Trigger로 Ellipsis 사용 — 거절:** 항목별 Overflow 은유보다
  내비게이션·Hamburger 기호가 서비스 주요 목적지 집합에 더 적합합니다.
- **모바일과 Desktop의 서로 다른 목적지 Taxonomy — 거절:** Layout만 바뀌며 의미와
  상대적 순서는 바뀌지 않습니다.
- **모든 목적지 아래 설명 — 거절:** Panel은 Onboarding 문서가 아니라 자주 쓰는
  내비게이션이며 설명은 승인된 필요 없이 밀도를 높입니다.
- **보이는 유틸리티 그룹 제목 — 거절:** 설정과 피드백은 승인되지 않은 통합 라벨을
  추가하지 않아도 Divider 뒤에서 명확합니다.
- **서열·빙고·검정 통합 — 거절:** 세 개념은 서로 다른 NOSTALGIA 의미와 사용자
  과업을 가집니다.
- **개인정보처리방침·GitHub·언어를 별도 더보기 항목으로 추가 — 거절:**
  개인정보처리방침과 GitHub는 푸터에 속하고 언어는 하나의 공개 설정 Route에
  속합니다.
- **개인정보처리방침을 헤더 목적지로 배치 — 거절:** 푸터 접근이 안정적이며 과업
  내비게이션과 경쟁하지 않습니다. 문맥 동의 Link는 페이지 고유로 남습니다.
- **Desktop Modal 내비게이션 — 거절:** 넓은 Layout은 Anchored Non-modal
  Popover로 페이지 문맥을 유지할 수 있습니다.
- **Focus containment 없는 Non-modal Compact Panel — 거절:** Scrim과 Body Lock은
  Modal 상호작용을 만들므로 일관된 Keyboard containment가 필요합니다.
- **모든 Viewport의 자동 숨김 — 대체:** Compact Layout은 자동 숨김을 사용할 수
  있고 넓은 Desktop은 계속 보이는 Sticky Header를 유지합니다.
- **채보 뷰어 내부 일반 셸 — 거절:** 집중형 뷰어에는 사용 가능한 Canvas와 전용
  방향 컨트롤이 필요합니다.

## 구현 연결

향후 구현은 현재 Geometry를 무조건 보존하지 않고 기존 셸 파일을 평가하고
재사용해야 합니다.

| 현재 영역                                 | 필수 2.0 책임                                                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `app/(nevigation)/layout.tsx`             | 고정 너비 페이지 동작 제거, Route 패밀리에 따라 Skip Link·셸 변형·하나의 `main`·푸터 구성 |
| `components/layout/header.tsx`            | 일반 구성을 정체성, 계정 컨트롤 및 내비게이션 Trigger로 제한                              |
| `components/layout/headerNavigation.tsx`  | 전체 순서 목적지, Compact Modal·Wide Popover 적응, 권한, Semantics 및 상태 구현           |
| `components/layout/scrollAwareHeader.tsx` | Compact 전용 숨김·표시 보호 규칙, 지속적 Wide 동작 및 Reduced-motion 처리 구현            |
| `components/layout/footer.tsx`            | Site Map이 되지 않으면서 개인정보처리방침, 외부 GitHub 식별 및 Copyright 보존             |
| `app/(auth)/layout.tsx`                   | 일반 전역 내비게이션 없이 최소 인증 셸과 신뢰 푸터 추가                                   |
| 채보 뷰어 Layout·Component                | 집중형 뷰어 계약 보존 및 중첩 일반 셸 방지                                                |

실제 구현에서 정확한 컴포넌트명은 바뀔 수 있습니다. 의미적 책임과 승인 동작은
Test에서 추적 가능해야 합니다.

## 브라우저 승인 계약

후속 디자인과 구현은 최소한 다음을 검증해야 합니다.

1. 한국어·일본어·영어 `320px` 일반 페이지의 비로그인 컨트롤, 가장 긴 대표
   라벨, 열린 Panel, 마지막 유틸리티 및 보이는 닫기 동작;
2. 대표 `390px` 로그인 일반 페이지, 프로필 이미지 실패 및 관리자 있음·없음;
3. 실제 콘텐츠 기반 Panel 전환 전후의 중간 너비;
4. `1280px` 등의 넓은 Desktop에서 계속 보이는 Sticky Header와 오른쪽 Anchored
   Non-modal Popover;
5. 아래·위 Scroll, 문서 상단 떨림, Route 변경, Panel 열린 상태 스크롤, Header·
   Panel 내부 Focus 및 Reduced-motion 동작;
6. Keyboard 전용 열기, 의미적 순서의 모든 Link, Escape, Outside 닫기, 보이는
   Focus, Focus 복귀 및 본문 바로가기;
7. 200%·400% Zoom, 낮은 Viewport 높이 및 접근할 수 없는 마지막 목적지 없음;
8. 비로그인 Login, 로그인 Profile, 조건부 Admin, 현재 Route 및 인증 없는 설정
   접근;
9. 일반 푸터 개인정보처리방침·GitHub, 헤더·더보기에서 두 링크 부재 및 최소
   인증 푸터 존재;
10. 일반 헤더·푸터가 없고 페이지 단위 `main`이 하나인 집중형 채보 뷰어;
11. 점검, 치명적 오류, 복구 가능한 페이지 오류 및 Not-found 복구 동작;
12. 예상치 못한 가로 페이지 스크롤, 잘린 Focus, 중복 닫기 동작, Compact Modal의
    Body Scroll Leak 또는 Wide Popover의 Body Lock이 없음.

자동 Test는 Semantics, Route 순서, 권한 조건, Body-lock 상태, Focus 복귀, Reduced
Motion 및 반응형 Overflow를 다뤄야 합니다. 브라우저 점검으로 실제 시각적 Fit과
상호작용을 계속 검증해야 하며 Lint, Typecheck 및 Component Test는 대체물이
아닙니다.

## 레퍼런스 Matrix

| 출처                                                                                                                 | 전용 가능한 원칙                                                            | NosLog 적용                                                 | 한계                                                  |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | 320 CSS px에서 2차원 페이지 스크롤 없이 콘텐츠 Reflow                       | Compact 헤더, Label 줄바꿈 및 전체 Panel 접근               | NosLog Layout이나 Breakpoint를 정하지 않음            |
| [W3C Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html)                  | 반복 내비게이션은 상대적 순서를 보존                                        | 언어·Viewport 전체의 같은 목적지 순서                       | 집중형 문맥은 문서화한 축소 셸을 의도적으로 사용 가능 |
| [W3C Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)                                  | 반복 블록에 건너뛰기 수단 필요                                              | 첫 Focus 가능 본문 바로가기 Link                            | 시각 처리를 정하지 않음                               |
| [W3C Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help)                                   | 반복되는 도움 접근은 예측 가능한 위치 유지                                  | 피드백을 일반 더보기 유틸리티 한 위치에 유지                | 피드백은 완전한 지원 센터가 아닌 제품 Dialog          |
| [W3C Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)                | Sticky Layer가 Keyboard Focus를 숨기면 안 됨                                | Focus 주변에서 헤더 표시 및 Panel·Popover Geometry 제한     | 헤더 높이를 정하지 않음                               |
| [W3C Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                              | Pointer Target 최소 크기 또는 간격 필요                                     | Compact 너비에서도 Header·Panel Target 조작 가능            | 최소 준수는 시각 Token 시스템이 아님                  |
| [WAI APG Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) | 일반 Link 내비게이션은 ARIA Menu Role 없이 Disclosure Button 사용 가능      | Button이 Escape와 Focus 복귀를 갖춘 Link 집합 제어          | 예시는 Modal Compact Panel 규격이 아님                |
| [GOV.UK Navigate a Service](https://design-system.service.gov.uk/patterns/navigate-a-service/)                       | 전역 내비게이션은 Site Map이 아니라 유용한 상위 영역 노출                   | 제한된 제품 집합과 문맥 페이지 Link 유지                    | 정부 콘텐츠 계층은 NosLog Art Direction이 아님        |
| [GOV.UK Service Navigation](https://design-system.service.gov.uk/components/service-navigation/)                     | 서비스 정체성과 반응형 내비게이션을 하나의 상단 시스템으로 구성 가능        | 안정적 NosLog 정체성과 반응형 열린 Panel                    | 정확한 Component Styling은 전용하지 않음              |
| [USWDS Header](https://designsystem.digital.gov/components/header/)                                                  | 단순·확장 헤더 Variant는 정보 깊이와 너비에 적응                            | Compact Modal과 Wide Popover가 한 Taxonomy 공유             | 미국 연방 시각 스타일은 전용하지 않음                 |
| [Carbon UI Shell Header](https://carbondesignsystem.com/components/UI-shell-header/usage/)                           | 안정적인 제품 셸이 전역 컨트롤과 페이지 콘텐츠 분리                         | 절제된 정체성·계정·내비게이션 구성                          | Enterprise 밀도와 Left Rail은 NosLog 요구가 아님      |
| [Carbon Global Header](https://carbondesignsystem.com/patterns/global-header/)                                       | 전역 헤더 구성은 제품 깊이에 맞춰야 함                                      | 완전한 On-demand 목적지 집합을 가진 하나의 상단 셸          | Carbon Taxonomy를 복사하지 않음                       |
| [Adobe Spectrum Headers](https://spectrum.adobe.com/page/headers/)                                                   | 헤더 계층은 제품 정체성과 필수 행동 보호                                    | 상시 제품 Label 때문에 NosLog를 축소하지 않음               | Spectrum Token은 NosLog Token이 아님                  |
| [Material Top App Bar](https://m2.material.io/components/app-bars-top)                                               | Top Bar는 내비게이션·정체성·행동을 제공하며 Scroll에 반응 가능              | Compact 스크롤 인식 동작을 뒷받침                           | Material 시각·Motion 값을 자동 채택하지 않음          |
| [Radix Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu)                         | 내비게이션 Component에는 Keyboard, Focus 및 Collision 동작 필요             | 향후 Component 평가와 Test에 사용                           | 기본 Anatomy는 승인된 Compact Modal을 다루지 않음     |
| [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover)                                         | Anchored 콘텐츠는 Collision, Focus 및 Outside Dismissal 처리 가능           | Wide Non-modal 적응의 후보 기반                             | Mobile Semantics나 시각 스타일을 정하지 않음          |
| [Shopify Polaris Top Bar](https://polaris-react.shopify.com/components/internal-only/top-bar)                        | 내비게이션을 공개하면서 계정과 전역 행동을 간결하게 유지 가능               | 프로필과 내비게이션 컨트롤 분리 근거                        | Commerce Admin은 NosLog 사용자 문맥이 아님            |
| [osu!](https://osu.ppy.sh/)                                                                                          | 리듬게임 서비스가 넓은 목적지 집합에 Compact Mobile Navigation Trigger 사용 | Compact 너비에 상시 목적지 Label이 불필요한 Domain 근거     | osu! Taxonomy와 시각 시스템을 전용하지 않음           |
| [Taiko.wiki](https://taiko.wiki/?lang=ko)                                                                            | 리듬게임 Utility에는 Locale-aware 내비게이션과 Compact Control 필요         | 긴 다국어 Control 조합 시험 근거                            | NosLog 승인 계층이 달라 상시 Icon Set은 채택하지 않음 |
| [V-ARCHIVE](https://v-archive.net/)                                                                                  | 리듬게임 Archive가 Logo, Search 및 공개형 Mobile 목적지 Surface 사용        | 전용 Navigation Trigger와 2차원 목적지 Layout의 Domain 근거 | Modal Drawer와 Content Taxonomy를 복사하지 않음       |
| [KONAMI NOSTALGIA](https://www.konami.com/arcadegames/products/am_nostalgia/)                                        | 공식 Game Identity와 용어가 NosLog 목적지 문맥화                            | Generic Grouping이 서열·빙고·검정을 왜곡하지 않도록 함      | 공식 홍보 내비게이션은 서비스 셸 모델이 아님          |

### 근거 수렴

- 접근성 출처는 안정적인 순서, 건너뛰기, Reflow, Focus 가시성, Target 조작성 및
  Link Navigation Semantics에 수렴합니다.
- 디자인 시스템은 서비스 정체성을 보호하고 좁은 헤더에 모든 목적지를 밀어 넣는
  대신 열린 내비게이션을 가용 공간에 적응시키는 방향에 수렴합니다.
- 리듬게임 레퍼런스는 Compact 공개형 내비게이션이 Domain에서 익숙함을 확인하지만
  정확한 Panel 형태는 서로 다릅니다. 따라서 NosLog는 승인된 필요인 완전한 2열
  Compact Modal과 Wide Anchored Popover를 사용합니다.
- 신뢰할 수 있는 어떤 출처도 NosLog의 빈번한 제품 내비게이션에 개인정보처리방침,
  GitHub 또는 추측성 통합 그룹을 추가할 근거가 되지 않습니다. 승인된 푸터 위치와
  독립적인 제품 의미가 더 강한 제품 근거입니다.

## 결정 기록

| ID       | 결정                                                                                           | 상태   |
| -------- | ---------------------------------------------------------------------------------------------- | ------ |
| SHELL-01 | 하나의 반응형 상단 셸 Taxonomy 사용, 상시 하단 내비게이션 추가 안 함                           | `승인` |
| SHELL-02 | 일반 헤더에는 NosLog, 계정 상태 및 하나의 내비게이션 Trigger만 포함                            | `승인` |
| SHELL-03 | 비로그인 계정 위치에 보이는 Login Text Control 사용                                            | `승인` |
| SHELL-04 | Ellipsis가 아니라 내비게이션·Hamburger Trigger 사용                                            | `승인` |
| SHELL-05 | 승인된 행과 의미적 순서로 8개 제품 목적지 유지                                                 | `승인` |
| SHELL-06 | 설정과 피드백 · 오류 제보를 그룹 제목 없이 Divider 뒤에 배치                                   | `승인` |
| SHELL-07 | 관리자는 일반 유틸리티 뒤에서 조건부·독립적으로 유지                                           | `승인` |
| SHELL-08 | 아이콘과 간결한 Text Label 사용, 설명 추가 안 함                                               | `승인` |
| SHELL-09 | Compact 내비게이션은 헤더 아래 Full-width 2열 Modal                                            | `승인` |
| SHELL-10 | Compact 열린 상태에 Scrim, Body Lock, Focus containment 및 신뢰 가능한 닫기·Focus 복귀 사용    | `승인` |
| SHELL-11 | Wide 내비게이션은 Body Lock 없는 오른쪽 Anchored 2열 Non-modal Popover                         | `승인` |
| SHELL-12 | Modal·Popover 전환은 현재 `1024px` 구현이 아니라 콘텐츠 Fit에서 선택                           | `승인` |
| SHELL-13 | Compact 헤더는 아래에서 숨고 위에서 표시, Wide Desktop 헤더는 계속 보이는 Sticky               | `승인` |
| SHELL-14 | 열린 내비게이션, Header·Panel Focus 및 Route 진입 중 헤더 표시                                 | `승인` |
| SHELL-15 | Reduced Motion에서 헤더 Slide 제거                                                             | `승인` |
| SHELL-16 | 일반 푸터가 개인정보처리방침, GitHub 및 Copyright 소유                                         | `승인` |
| SHELL-17 | 개인정보처리방침과 GitHub를 헤더나 더보기 Panel에 넣지 않음                                    | `승인` |
| SHELL-18 | Login·Onboarding은 더보기·프로필 없는 최소 정체성+푸터 셸 사용                                 | `승인` |
| SHELL-19 | 인증 기획서에 따라 Login 본문에 간결한 Discord 데이터 고지와 Inline 개인정보처리방침 Link 포함 | `승인` |
| SHELL-20 | 집중형 채보 뷰어에서 일반 헤더·푸터 생략                                                       | `승인` |
| SHELL-21 | 점검과 치명적 오류에서 최소 정체성·복구 셸 사용                                                | `승인` |
| SHELL-22 | 열린 목적지는 ARIA Menu Semantics가 아닌 Native Link Navigation으로 유지                       | `승인` |
| SHELL-23 | ko, ja, en에서 동일한 목적지 정체성과 의미적 순서 보존                                         | `승인` |
| SHELL-24 | 정확한 Foundation Token, 치수, Breakpoint 및 최종 다국어 문자열은 후속 작업                    | `승인` |

## Handoff 경계

Claude Design은 승인된 셸 변형, 구성, 목적지 순서, Compact·Wide 동작, Scroll
규칙, 푸터 소유권, Semantics 및 상태를 보존해야 합니다. 이후 승인된 Foundation
안에서 시각 구성을 결정할 수 있습니다. 상시 헤더 목적지 Label, 하단
내비게이션, 설명형 메뉴 Card, 더보기의 개인정보처리방침, 보편적 자동 숨김
Desktop 헤더 또는 집중형 뷰어 내부 일반 셸을 다시 추가하면 안 됩니다.

향후 Codex 구현 세션은 이 요구사항을 코드와 자동·브라우저 Test에 연결해야
합니다. Foundation 시험에서 `320 CSS px`의 2열을 사용할 수 없거나 하나의 보이는
닫기 Control Anatomy가 Modal Focus containment를 충족할 수 없다면, Taxonomy나
동작을 조용히 바꾸지 말고 충돌을 보고해 가이드 개정 승인을 받아야 합니다.
