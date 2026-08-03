# NosLog 2.0 빙고 페이지 기획서

## 문서 관리

- 상태: `Approved`
- 결정 상태: `빙고 목록·상세 계약 승인: 영구 Catalog, 수동 전용 진행 기록,
공개 열람, 로그인 편집, 보상 의미, 초기화 동작, 미션 다국어 정책, 반응형
구성, Runtime 상태, 접근성 및 브라우저 인수 조건`
- 근거 상태: `저장소·Schema·Seed data·브라우저 조사, NOSTALGIA 공식 근거,
승인된 정보 구조, 인용한 Task list·Checkbox·Grid·파괴적 작업·반응형·접근성·
다국어 Reference 및 사용자가 승인한 결정 기록`
- 작성 시작일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-03
- 기준 언어: 영어
- 영문 원본: [10-bingo-page-brief.md](./10-bingo-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 관련 계약:
  [03-home-page-brief.ko.md](./03-home-page-brief.ko.md),
  [04-shared-discovery-page-brief.ko.md](./04-shared-discovery-page-brief.ko.md),
  [05-music-detail-page-brief.ko.md](./05-music-detail-page-brief.ko.md)
- 범위: 다국어 공개 빙고 Catalog·빙고 상세, 로그인 사용자의 수동 미션 기록,
  진행·보상 의미, 최근 수동 기록, 초기화 및 문맥 악곡 상세 Link
- 제외: 관리자 Editor 설계, NOSTALGIA 빙고 자동 연동, 시도·재도전 이력,
  최종 Foundation Token, 최종 High-fidelity 구성 및 이번 세션의 Production 구현

## 결정 상태 표기

- **Observed:** 저장소, 현재 브라우저 근거 또는 승인된 상위 산출물에서 확인한
  사실입니다.
- **Approved:** 사용자가 명시적으로 동의했으며 후속 디자인의 기준이 되는
  결정입니다.
- **Proposed:** 근거를 갖추었으나 사용자 승인을 기다리는 방향입니다.
- **Open:** 추가 조사·검증 또는 사용자 결정이 필요합니다.
- **Rejected:** 검토했으나 명시적으로 선택하지 않은 방향입니다.
- **Superseded:** 이후 승인된 방향으로 대체된 결정입니다.

이 문서는 빙고의 목적, 콘텐츠 계층, 상태 의미, 상호작용, 다국어, 반응형 동작
및 인수 조건의 기준입니다. 정확한 Typography, Color, Spacing, Radius,
Elevation, Cover 처리, Control 치수, Grid 간격 및 콘텐츠 기반 전환 값은
Foundation과 후속 Claude Design 작업으로 남깁니다. 후속 시각 작업은 표현을
다듬을 수 있지만 이 계약의 의미를 바꿀 수 없습니다.

## 목적

빙고는 NOSTALGIA 빙고 미션을 위한 공개 Reference이자 로그인 사용자의 수동
Checklist입니다. 다음 세 질문에 순서대로 답합니다.

> 어떤 빙고판을 찾고 있는가, 무엇을 완료해야 하는가, 내가 수동으로 기록한
> 진행이 악곡 해금 및 NOS 보상과 어떤 관계인가?

빙고는 실시간 NOSTALGIA 상태 Mirror가 아닙니다. NOSTALGIA는 자동 추적에
필요한 활성 빙고판이나 미션 완료 상태를 NosLog에 제공하지 않습니다. 따라서
NosLog는 사용자가 게임에서 보는 것과 같은 5×5 미션 구조를 읽고 직접 체크할
수 있도록 하되, 그 체크를 공식 게임 상태라고 주장해서는 안 됩니다.

## 주요 이용 문맥과 성공 조건

- **Approved:** 오락실 기기 옆에서의 모바일 사용이 우선입니다. 사용자는 최소한의
  Context 전환으로 빙고판을 찾고, 좌표를 맞추고, 미션을 읽고, 체크 하나를
  갱신할 수 있어야 합니다.
- **Approved:** 비로그인 사용자는 모든 빙고판을 탐색하고, 보상 구조를 이해하고,
  어떤 빙고판이든 열어 25개 미션 전체를 확인하고, 가짜 개인 진행 상태 없이
  문맥 악곡 Link를 이용할 수 있으면 성공입니다.
- **Approved:** 로그인 사용자는 가장 최근에 수동 편집한 빙고판으로 돌아가고,
  미션 완료를 기록하고, 악곡 해금과 전체판 진행의 차이를 이해하고, 저장 실패를
  복구할 수 있으면 성공입니다.
- **Approved:** Desktop도 필수이며 추가 너비를 빙고판과 미션 비교에 사용합니다.
  넓은 Viewport 중앙에 현재의 약 `390px` Shell을 유지해서는 안 됩니다.
- **Approved:** 현재 Styling과 Geometry는 조사 근거일 뿐 NosLog 2.0 시각 기준이
  아닙니다.

## 현재 제품 및 Domain 근거

### 공식 Domain 근거

- **Observed:** NOSTALGIA 공식 자료는 빙고를 줄 및 완주 보상이 있는 5×5 미션
  보드로 제시하며 게임 내 초기화·재도전 동작을 제공합니다.
- **Observed:** NosLog에는 공식 활성 빙고판이나 Cell별 진행 Feed가 없습니다.
  따라서 기존 사용자 진행은 NosLog 수동 기록이며, 점수를 달성할 때 인게임
  빙고판이 활성화되어 있었다는 증거가 아닙니다.
- **Approved 해석:** 공식 게임에 초기화가 존재하더라도 NosLog가 시도 이력을
  모델링할 필요는 없습니다. NosLog에는 현재 수동 Checklist를 비우는 기능만
  필요합니다.

### 저장소 및 Data 근거

- **Observed:** 공개 다국어 Route는 `/[locale]/bingo`와
  `/[locale]/bingo/[id]`이며 읽기는 공개, 변경은 로그인 필수입니다.
- **Observed:** [`prisma/data/op3-bingos.json`](../../prisma/data/op3-bingos.json)은
  빙고판 44개와 Cell 1,100개, 즉 판마다 정확히 25개 Cell을 포함합니다.
- **Observed:** Data의 `FORTE`, `Op.2`, `Op.3`는 출시 출처입니다. 빙고 종료일은
  없습니다. `sourceVersion`은 Metadata이지 사용자 선택형 빙고 Mode가 아닙니다.
- **Observed:** 악곡 해금에 필요한 줄 수는 2~7입니다. Data는 줄당 NOS, 전체판
  완성 NOS 및 총 획득 가능 NOS를 별도로 모델링합니다.
- **Observed:** [`Bingo`](../../prisma/schema.prisma),
  [`BingoCell`](../../prisma/schema.prisma),
  [`BingoCellProgress`](../../prisma/schema.prisma)는 빙고판 Metadata, Cell별 단일
  미션 문자열 및 사용자 범위 수동 완료 시각을 제공합니다.
- **Observed gap:** 현재 미션 Schema는 하나의 `title` 문자열만 가지며 Import된
  미션 문구는 한국어입니다. 검증된 공식 일본어와 별도 검수된 한국어·영어를
  아직 표현할 수 없습니다.
- **Observed:** 현재 진행 계산은 표준 5×5 빙고의 12개 줄을 인식하고 한 Cell만
  남은 줄을 Chance 상태로 판단할 수 있습니다.
- **Observed:** 현재 변경 동작에는 Optimistic Client state, Server 저장,
  Rollback 및 다국어 오류 Feedback이 있습니다.

### 현재 Interface 및 브라우저 근거

- **Observed:** 현재 목록에는 전체, 진행 중, Chance, 완료 Control, 진행순 정렬,
  작은 빙고판 Preview, 진행 값 및 보상 정보가 있습니다.
- **Observed:** 현재 상세에는 Cover·보상 Context, 5×5 빙고판, 미션 Filter,
  25개 전체 미션 및 수동 Control이 있습니다.
- **Observed:** 현재 넓은 Layout은 모바일과 유사한 좁은 열을 유지하고 큰 여백을
  남깁니다. `390px`과 `320px` 확인에서 문서 단위 가로 Overflow는 없었지만,
  긴 한국어·일본어·영어 콘텐츠나 최종 2.0 계층을 검증한 것은 아닙니다.
- **Observed issue:** 현재 `계속하기`와 이용 가능성 표현은 NosLog가 확인할 수
  없는 실시간 또는 기간 제한 인게임 상태를 암시할 수 있습니다.

## 승인 범위와 불변 조건

1. 44개 빙고판은 모두 상시 열람할 수 있습니다. 이용 기간, 종료 상태, Archive,
   Version 선택기를 추가하지 않습니다.
2. `sourceVersion`은 `FORTE`, `Op.2`, `Op.3` 같은 출시 Metadata로만 표시할 수
   있습니다.
3. 진행 상태는 항상 사용자가 입력한 NosLog Checklist입니다. 자동 연동, 공식
   활성화, 점수 기반 자동 완료 또는 검증된 인게임 완료를 암시하지 않습니다.
4. 상세에서는 5×5 빙고판을 주 미션 탐색 모델로 유지합니다.
5. 악곡 해금 진행과 전체판 보상 진행은 서로 다른 의미입니다.
6. 열람은 공개합니다. 개인 체크 추가·해제·초기화에만 로그인이 필요합니다.
7. `최근` 빙고는 NosLog 수동 기록을 가장 최근에 편집한 빙고입니다. NOSTALGIA에서
   활성화·선택·진행 중이라는 뜻이 아닙니다.
8. 시도 횟수, 재도전 Cycle, 완료 이력 원장 또는 누적 획득 NOS는 추가하지 않습니다.

## 승인된 정보 계층

### 빙고 목록

1. 페이지 정체성과 간결한 수동 기록 설명;
2. Catalog 요약 및 저장 진행이 있는 로그인 사용자에게만 최근 수동 기록;
3. 간결한 Filter·Sort Control;
4. 상시 빙고 Catalog Card;
5. 남은 항목이 있을 때 명시적인 다음 묶음 Control.

### 빙고 상세

1. 빙고 목록으로 돌아가기와 빙고판 정체성;
2. 보상 및 진행 의미;
3. 5×5 빙고판;
4. 미션 목록과 간결한 미션 Filter;
5. 적용 가능한 문맥 로그인 또는 초기화 Action.

빙고판과 미션 목록은 하나의 동기화된 Task Surface입니다. 동떨어진 주요 CTA가
미션을 찾고 체크하는 행동과 경쟁해서는 안 됩니다.

## 진행 및 보상 의미

### 진행 상태

| 상태           | 규칙                                                       | 필수 의미                                           |
| -------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| 시작 전        | 저장된 완료 Cell 없음                                      | 개인 진행을 수동으로 기록한 적 없음                 |
| 진행 중        | 한 Cell 이상 저장, 완료 줄은 `requiredLines` 미만          | 수동 기록은 있으나 악곡 해금 기준에 도달하지 않음   |
| 악곡 해금 완료 | 완료 줄이 `requiredLines` 이상이며 미완료 Cell이 남아 있음 | Checklist상 필요한 악곡 해금 줄 기준을 충족함       |
| 전체판 완료    | 25개 Cell이 모두 완료로 저장됨                             | Checklist를 모두 완료하고 전체판 보상 조건을 충족함 |

- 빙고판은 악곡 해금 기준을 넘겨도 전체판 완료가 아닐 수 있습니다.
- 한정 없이 `완료`라고만 표현하면 두 상태가 섞이므로 사용하지 않습니다.
- Chance는 유용한 빙고판 조건이지 최상위 Lifecycle 상태가 아닙니다. 유효한 줄 하나에
  미체크 Cell 하나만 남았다는 뜻이며 로그인 진행의 보조 Filter·Cue로 사용할 수
  있습니다.
- 비로그인 사용자에게는 개인 상태가 없습니다. 이들에게 `시작 전`이나 `0/25`를
  부여하면 측정된 개인 기록처럼 보이므로 표시하지 않습니다.

### 보상 모델

한 개의 설명 없는 총액 대신 보상 의미를 다음과 같이 구분해 표시합니다.

- `requiredLines`: 악곡 해금에 필요한 완료 줄 수;
- `lineRewardNos`: 각 완료 줄의 NOS 보상;
- `completionRewardNos`: 25개 전체 완료 추가 NOS;
- `rewardNos`: 모든 줄 보상과 전체판 보너스를 합친 총 획득 가능 NOS.

Interface는 `rewardNos`를 이미 획득한 값처럼 표시해서는 안 됩니다. 개인 진행으로
조건 도달을 설명할 수는 있지만 NosLog는 인게임 보상 수령을 검증할 수 없습니다.

## 빙고 목록 계약

### Catalog 요약

- 상시 제공하는 44개 빙고판과 NosLog의 수동 기록 방식임을 알립니다.
- 날짜 범위, Countdown, 종료 Badge 또는 출시 Version 전환기를 표시하지 않습니다.
- 출시 Metadata는 빙고판 식별을 도울 수 있지만 제목과 Cover보다 낮은 위계입니다.

### 최근 수동 기록

- 저장된 Cell 기록이 하나 이상인 로그인 사용자에게만 표시합니다.
- 가장 최근에 갱신된 수동 Cell 기록을 가진 빙고판을 선택합니다.
- `최근 기록한 빙고`와 같은 뜻으로 표기합니다. NOSTALGIA 상태를 암시하는 `활성`,
  `활성화됨`, `게임에서 계속하기` 같은 표현을 사용하지 않습니다.
- 해당 빙고판으로 바로 돌아갈 수 있게 합니다. Layout은 별도 Dashboard처럼
  떨어지지 않고 목록 계층에 연결되어야 합니다.
- 최근 빙고판을 초기화해 저장 Cell이 사라지면 다음 최근 기록으로 다시 계산하거나
  Module을 생략합니다.

### Filter 및 Sort

- 많은 버튼을 영구 행으로 노출하지 않고 Control을 간결하고 문맥적으로 묶습니다.
- 로그인 사용자 개인 상태 Option: `전체`, `진행 중`, `악곡 해금 완료`,
  `전체판 완료`.
- `Chance`는 보조 진행 Filter로 제공할 수 있지만 승인된 상태 모델을 대체하지
  않습니다.
- 비로그인 사용자에게는 개인 상태 Filter를 표시하지 않습니다.
- 의미가 있을 때의 Sort Option은 `최근 기록순`, `진행 높은 순`, `출시순`입니다.
  인증 진행이 없으면 개인 Sort를 생략하거나 명확한 이유와 함께 비활성화하며
  0 값을 만들어내지 않습니다.
- 선택 상태는 복원 가능하고 브라우저 Back과 호환되어야 합니다.

### Catalog Card

각 Card는 다음 정보 계약을 지킵니다.

- 빙고판 Cover 또는 정의된 Cover 없음 Fallback;
- Global 제목 설정에 따른 원문 빙고판·악곡 제목과 선택적 승인 번역 제목 또는
  일본어 읽기;
- 하위 위계의 `sourceVersion` 출시 Metadata;
- 빙고판 정체성과, 로그인 상태에서는 개인 체크 Cell을 전달하는 작은 5×5 보드;
- 로그인 사용자의 진행 상태 및 간결한 진행 값;
- 비교에 필요한 경우 간결한 악곡 해금 또는 보상 Context.

비로그인 Card는 체크 Cell, 진행 분수, 개인 상태 Badge, Chance Cue 및 다른 개인
완료 Indicator를 생략합니다. Card는 비활성 Preview가 아니라 완전히 열 수 있는
목적지입니다.

### 묶음 로드

- 첫 12개를 표시하고 남은 항목이 있으면 명시적인 다음 12개 Action을 제공합니다.
- 자동 Infinite scroll을 사용하지 않습니다.
- 상세 왕복과 브라우저 Back에서 Filter, Sort, 불러온 수, 유용한 목록 위치를
  보존합니다.
- 결과 없음은 간결하게 표시하되 Filter 결과 없음과 Catalog 자체 부재를 구분합니다.

## 빙고 상세 계약

### 정체성 및 보상 Context

- 목록으로 명확히 돌아갈 수 있어야 하며 제목, Cover, 출시 Metadata로 빙고판을
  식별합니다.
- 악곡 해금에 필요한 줄 수를 줄당 NOS, 전체판 보너스, 총 획득 가능 NOS와
  구분해 설명합니다.
- 로그인 개인 진행은 여기서 요약할 수 있습니다. 비로그인에게는 보상 구조만
  제공하고 가짜 개인 진행 Block은 표시하지 않습니다.

### 5×5 빙고판

- 필수 Compact 너비에서 문서 가로 Scroll 없이 완전한 5×5 좌표 모델을 표시합니다.
- 모든 Cell은 해당 미션 상세로 이동하거나 강조하기 위해 선택할 수 있습니다.
- 선택 상태와 저장 완료 상태는 별개입니다. 선택은 누구나 가능하고 완료 편집은
  로그인 사용자만 가능합니다.
- 체크, 선택, Chance 관련 상태, Keyboard Focus를 Color만으로 전달하지 않으며
  서로 시각적으로 구별할 수 있어야 합니다.
- 빙고판 좌표와 미션 행은 같은 안정적인 번호·좌표 체계를 사용합니다.
- Wide Layout에서 빙고판을 미션 목록 옆 Sticky로 만들 수 있지만 콘텐츠를
  가리거나 Keyboard·Zoom 동작을 깨지 않는 경우에만 허용합니다.

### 미션 목록 및 Filter

- 25개 미션 전체와 빙고판 좌표 관계를 유지합니다.
- 빙고판 Cell 선택은 해당 미션으로 Focus 또는 View를 이동하되 완료 상태를
  예기치 않게 바꾸지 않습니다.
- 미션을 선택하거나 Focus하면 빙고판 선택도 동기화합니다.
- 모든 Option을 영구 행으로 두지 않고 하나의 간결한 미션 Filter Control을
  사용합니다.
- 로그인 Option: `전체`, `미완료`, `완료`, `Chance`.
- 비로그인에게는 별도 비개인 탐색 Filter가 추후 승인되지 않는 한 `전체`만
  필요합니다.
- 각 행에는 좌표, 다국어 미션 지시, 필요한 Context, 검증된 관계가 있을 때의
  문맥 악곡 상세 Link 및 로그인 사용자의 수동 Checkbox를 포함할 수 있습니다.
- 텍스트 Parsing으로 악곡 Link를 추측하지 않습니다. 검증된 구조 관계를 사용합니다.

## 수동 완료 및 저장 계약

- 로그인 Checkbox는 하나의 NosLog `BingoCellProgress` 기록을 추가하거나 제거합니다.
- Optimistic state는 즉시 갱신할 수 있지만 저장 상태를 인지할 수 있어야 하고,
  실패하면 마지막 확인 상태로 돌아가야 합니다.
- 같은 변경이 Pending인 동안 반복 입력으로 중복 또는 순서가 뒤집힌 기록을 만들면
  안 됩니다.
- 늦은 Response가 더 최근의 Local 의도를 덮어쓰지 않도록 Cell 변경을 직렬화,
  Versioning 또는 동등한 방식으로 보호합니다.
- 한 Cell 갱신은 완료 Cell·줄, 해금 상태, 전체판 상태, Chance Cue, 최근 기록 시각
  및 관련 목록 요약을 다시 계산합니다.
- 플레이 기록, 점수, Rank 또는 연동 악곡 Data로 완료를 추론하지 않습니다.
- 체크 상태는 `NosLog에 수동으로 완료 기록`이라는 뜻이며 `NOSTALGIA에서 공식
검증 완료`라는 뜻이 아닙니다.

## 초기화 계약

- 로그인 사용자에게 해당 빙고판의 저장 진행이 있을 때만 보조·파괴적
  `빙고판 기록 초기화` Action을 제공합니다.
- Checklist가 진행 중, 악곡 해금 완료, 전체판 완료 중 어느 상태라도 사용할 수
  있습니다.
- 빙고판 이름과 이 빙고판에 저장한 25개 체크 전체가 삭제된다는 결과를 명시하는
  확인을 요구합니다.
- 확인·취소 Label은 모호하지 않아야 하며 초기 Focus, Focus containment, Escape,
  복귀 Focus는 채택한 Dialog Component 계약을 따릅니다.
- 성공하면 이 사용자의 해당 빙고판 진행 Row를 삭제하고 요약을 다시 계산하며
  오래된 최근 기록 Reference를 제거합니다.
- 실패하면 확인된 Checklist를 보존하고 복구 가능한 오류를 표시합니다.
- 부수 효과로 재도전 Cycle, 시도 이력, 완료일, Archive 빙고 또는 누적 획득 NOS를
  만들지 않습니다.

## 인증 및 권한 계약

### 비로그인

- 44개 빙고판 전체를 탐색하고 모든 빙고 상세를 열 수 있습니다.
- Cover·제목, 출시 Metadata, 보상 구조, 5×5 빙고판 및 다국어 25개 미션 전체를
  확인할 수 있습니다.
- Cell을 선택해 해당 미션을 읽고 공개 악곡 Link를 이용할 수 있습니다.
- 완료 Checkbox, `0/25`, 개인 상태 Filter, 개인 체크 Mini-board, Chance 진행 및
  최근 기록 Card는 표시하지 않습니다.
- 미션 편집 Context 가까이에 간결한 로그인 안내 하나만 제공합니다. 모든 Cell이나
  미션마다 비활성 로그인 Control을 반복하지 않습니다.
- 로그인 후 가능한 경우 같은 언어와 정확한 빙고 상세로 돌아옵니다.

### 로그인

- 같은 공개 Reference 콘텐츠와 함께 개인 수동 진행 Control, Filter, 최근 기록,
  저장 상태 및 해당할 때의 초기화를 제공합니다.
- 인증은 편집 가능 여부만 바꾸며 빙고 Catalog나 상시 제공 여부는 바꾸지 않습니다.

### 권한 및 존재하지 않는 Resource

- 비로그인 상태의 직접 변경 요청은 인증 오류를 반환하며 Data를 바꾸지 않습니다.
- 유효하지 않은 빙고판이나 미션은 Not found·Data integrity 상태이지 `종료된 빙고`
  상태가 아닙니다.
- 공개 빙고판 읽기 실패를 사용자 권한 부족으로 표현하지 않습니다.

## URL, History 및 복원 계약

- 다국어 목록·상세 URL은 안정적이며 공유할 수 있어야 합니다.
- 유용한 경우 목록 Filter, Sort, 불러온 묶음 및 선택 Context를 URL state 또는
  History 복원 가능한 동등 방식으로 유지합니다.
- 목록 → 상세 → Back 왕복에서 Catalog Context를 복원합니다.
- 미션 선택은 공유·복원에 실질적인 도움이 되고 매 순간의 Focus 이동을 History
  Noise로 만들지 않을 때만 안정적 Fragment나 Query를 사용할 수 있습니다.
- 로그인 복귀 상태는 Locale, 빙고판 ID 및 의도한 편집 Context를 보존합니다.
- 초기화 확인은 일시적 UI state이며 History 항목을 만들지 않습니다.

## Loading, Empty, Error, Disabled 및 파괴적 상태

| 상태                  | 필수 동작                                                                  |
| --------------------- | -------------------------------------------------------------------------- |
| Catalog 최초 Loading  | 가짜 값 없이 페이지 정체성과 안정적인 Catalog Skeleton을 유지              |
| 다음 묶음 Loading     | 불러온 빙고를 유지하고 진행 상태는 명시적 묶음 Action에만 연결             |
| Catalog 비어 있음     | 승인 Catalog가 44개이므로 공개·Data 실패로 처리                            |
| Filter 결과 없음      | 현재 Filter에 맞는 빙고가 없음을 간결히 알리고 Control 유지                |
| 상세 Loading          | 알 수 있을 때 빙고판 정체성·복귀 Context를 유지하고 누적 Layout shift 방지 |
| 유효하지 않은 판·미션 | 상시 Catalog로 돌아갈 수 있는 다국어 Not found 복구 제공                   |
| 비로그인 편집         | Control을 생략하고 문맥 로그인 안내 하나 제공                              |
| Cell 저장 Pending     | 읽기는 유지하고 충돌하는 반복 변경을 막으며 저장 상태 전달                 |
| Cell 저장 실패        | 확인 상태로 Rollback하고 실패 Action을 간결히 밝히며 Retry 제공            |
| 미션 관계 일부 누락   | 미션은 유지하고 사용할 수 없는 문맥 악곡 Link만 생략                       |
| 다국어 미션 누락      | 검증된 공식 일본어를 `lang="ja"`로 표시하고 미션을 숨기지 않음             |
| 초기화 확인           | 범위와 결과를 밝히며 모호한 Icon만으로 확인하지 않음                       |
| 초기화 Pending        | Dialog 상태를 유지하며 중복 초기화 방지                                    |
| 초기화 실패           | 저장 진행을 그대로 두고 Retry 또는 취소 허용                               |
| Cover 없음            | Card·빙고판 의미를 바꾸지 않는 승인된 Media Fallback 사용                  |

승인된 상시 Catalog 계약에는 `빙고 이용 불가` 또는 `빙고 종료` Runtime 상태가 없습니다.

## 반응형 계약

### Compact Layout

- `390px`은 대표 검토 Canvas이지 고정 너비나 Breakpoint가 아닙니다.
- 긴 한국어·일본어·영어 콘텐츠와 200% Text zoom으로 중간 너비를 포함해
  `320 CSS px`까지 1차원 Reflow를 검증합니다.
- 실제 콘텐츠의 가독성이 유지되는 동안 목록은 행마다 Card 두 개를 사용할 수
  있습니다. Cover, 제목, Mini-board 또는 상태가 더 이상 맞지 않으면 한 열로
  바뀌어야 하며, 이 전환은 콘텐츠 기반이고 `350px` 부근 또는 검증된 다른 값일
  수 있습니다.
- 상세는 빙고판을 미션 목록보다 먼저 쌓아 인게임 좌표 모델을 미션 탐색 전에
  사용할 수 있게 합니다.
- 빙고판 자체는 정사각형 5×5 관계를 유지하지만 문서의 2차원 Scroll을 요구해서는
  안 됩니다.
- 보상 정보와 Control은 읽을 수 없는 한 줄로 압축하지 않고 Wrap하거나 재구성합니다.

### Wide Layout

- 추가 너비를 다열 Catalog와 빙고판·미션 비교에 사용합니다.
- 상세는 빙고판·Context 열과 미션 목록 열을 나란히 둘 수 있습니다. Sticky
  빙고판은 Keyboard, Zoom, Viewport 높이 검증 후에만 허용합니다.
- Compact Layout을 단순히 확대하거나 휴대폰 너비 Shell 안에 중앙 정렬하지 않습니다.
- 너비가 남는다는 이유로 영구 Filter, Metadata 또는 반복 Action을 더하지 않습니다.

### Layout Semantics

- Catalog와 미션 읽기 순서는 Layout에 관계없이 동등합니다.
- CSS 시각 순서가 DOM, Keyboard 또는 Screen reader 순서와 모순되면 안 됩니다.
- Mini-board는 시각 Label을 간소화할 수 있지만 Accessible name에는 빙고판과 진행
  의미를 유지합니다.

## 접근성 계약

- 실제 표 관계를 도입하지 않는 한 Catalog와 미션 Collection에 Semantic list를
  사용합니다.
- 5×5 빙고판을 하나의 복합 좌표 Control로 취급합니다. Native button 또는 문서화된
  Keyboard 동작을 가진 적절한 Grid를 사용하며 Label 없는 클릭 가능 `div` 25개를
  만들지 않습니다.
- 각 Cell은 좌표, 다국어 미션 요약, 선택 상태 및 로그인 사용자에게 수동 완료
  상태를 제공합니다.
- Roving Focus를 사용하면 Arrow 이동, Home/End 동작을 문서화하고 Tab은 Composite를
  빠져나갑니다. 각 Cell이 일반 Button이면 기본 Tab 이동이 관리 가능하도록 검증합니다.
  Component 설계에서 한 Pattern을 선택해 문서화하고 둘을 섞지 않습니다.
- 수동 완료는 Programmatic label·state가 있는 Native checkbox 또는 동등 Control을
  사용합니다. 빙고판 선택만으로 완료가 Toggle되어서는 안 됩니다.
- 진행, 해금, Chance, 완료, 저장, 오류를 Color, Cover art 또는 위치만으로 전달하지
  않습니다.
- 수동 변경 성공·실패를 Focus를 예상치 않게 이동하지 않고 알립니다.
- 초기화는 정확히 명명된 파괴적 확인 Dialog를 사용하고 Trigger로 Focus를 돌려줍니다.
- 모든 Interactive target은 승인될 Foundation의 Target size 규칙을 충족하고
  Keyboard와 Touch로 조작할 수 있어야 합니다.
- 200% Text zoom과 `320 CSS px`에서 긴 미션, 보상 Label, Filter, Action이 빙고판과
  겹치거나 잘리지 않고 Reflow합니다.
- Reduced motion을 존중하며 선택·저장 Feedback을 움직임 없이도 이해할 수 있어야
  합니다.

## 다국어 및 콘텐츠 계약

### 미션 원문과 번역

- 검증된 공식 일본어 미션 문구를 Canonical domain content로 사용합니다.
- 한국어와 영어는 일본어 원문을 대체하는 변환이 아니라 각각 검수한 번역입니다.
- 페이지 Locale에 맞는 한 언어의 미션을 표시합니다. 모든 행에 원문과 번역을
  기본으로 함께 표시하지 않습니다.
- 미션 지시는 번역 악곡명 표시 Option과 독립적으로 항상 다국어 처리합니다.
- 승인된 한국어·영어가 없으면 검증된 공식 일본어로 Fallback하고 해당 Element를
  `lang="ja"`로 표시하며 주변 Interface는 선택 Locale을 유지합니다.
- Fallback마다 긴 `번역 준비 중` 문구를 공개 화면에 표시하지 않습니다. 미검수
  상태는 관리자 Workflow에서 다룹니다.
- AI 출력은 번역 초안으로 사용할 수 있지만 검수 전에는 공개할 수 없습니다.
- 현재 한국어 Seed를 역번역해 공식 일본어라고 표시하지 않습니다.

### 안정적인 Domain Token

- 번역할 때 구현 또는 플레이어 인지가 훼손되는 `◆Just`, `Near`, `Miss`,
  `Normal`, `Hard`, `Expert`, `Real`, `nos` 같은 Domain token은 유지합니다.
- Token을 단순 연결하지 않고 한국어·일본어·영어의 주변 문법과 지시를 자연스럽게
  번역합니다.
- 빙고판 좌표는 언어와 관계없이 안정적으로 유지합니다.

### 빙고판 및 악곡 제목

- 공용 제목 계약을 적용합니다. 원문 제목을 우선하며 사용자의 Global 제목 표시
  설정에 따라 승인된 한국어·영어 번역 또는 일본어 읽기를 표시할 수 있습니다.
- 이 설정은 제목에만 영향을 주며 미션 지시 다국어를 바꾸지 않습니다.
- 긴 클래식 제목, 긴 Artist·Context 이름, 혼합 Script, 숫자 및 음악 기호를
  고정 높이 잘림 없이 Wrap합니다.

## Runtime 상태 계약

| 상태 그룹    | 값                                                            | 범위                   |
| ------------ | ------------------------------------------------------------- | ---------------------- |
| 인증         | 비로그인, 로그인                                              | Page family            |
| Catalog 요청 | 최초 Loading, Ready, 다음 묶음 Loading, Filter empty, Error   | 목록                   |
| 목록 Query   | 권한이 있을 때 개인 상태 Filter, Sort, 불러온 수              | 목록 및 URL/History    |
| 최근 기록    | 없음, 있음                                                    | 로그인 목록            |
| 빙고판 요청  | Loading, Ready, Not found, Error                              | 상세                   |
| 미션 선택    | 없음/기본, 좌표 선택                                          | 상세 Interaction       |
| 수동 진행    | 기록 없음, 진행 중, 악곡 해금 완료, 전체판 완료               | 로그인 사용자와 빙고판 |
| Cell 변경    | 확인 미체크, 체크 저장 중, 확인 체크, 체크 해제 저장 중, 실패 | 로그인 사용자와 Cell   |
| 초기화       | 사용 불가, 사용 가능, 확인 중, Pending, 실패, 성공            | 로그인 사용자와 빙고판 |
| 다국어       | 승인 Locale 문구, 검증된 일본어 Fallback                      | 미션 Element           |
| 악곡 관계    | 검증 Link, 검증 Link 없음                                     | 미션 행                |

요청, 인증, 선택, 수동 진행 상태를 하나의 과도한 Card Badge나 단일 `loading` Boolean으로
합치지 않습니다.

## 구현 Mapping

| 관심사                 | 현재 Source                                                                                                                                                                                                    | 후속 요구사항                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 목록 Route와 Query     | [`app/(nevigation)/bingo/page.tsx`](<../../app/(nevigation)/bingo/page.tsx>) 및 [`app/(nevigation)/bingo/data.ts`](<../../app/(nevigation)/bingo/data.ts>)                                                     | 공개 44개를 상시 반환하고 이용 가능성 Filter 없이 복원 가능한 묶음·Filter·Sort 계약 추가                     |
| 목록 구성              | [`components/bingo/bingoList.tsx`](../../components/bingo/bingoList.tsx)                                                                                                                                       | 실시간 상태 암시 명칭을 바꾸고 비로그인 공개 Data를 분리하며 콘텐츠 반응형 Wide 구성 사용                    |
| 최근 수동 기록         | [`components/bingo/list/continueBingoCard.tsx`](../../components/bingo/list/continueBingoCard.tsx) 및 [`components/bingo/list/bingoListUtils.ts`](../../components/bingo/list/bingoListUtils.ts)               | `continue/active` 의미를 최근 수동 편집으로 바꾸고 저장 진행이 없으면 생략                                   |
| Filter                 | [`components/bingo/list/bingoListFilters.tsx`](../../components/bingo/list/bingoListFilters.tsx)                                                                                                               | 승인 상태에 맞추고 비로그인에게 개인 Filter를 숨기며 상태 복원                                               |
| List Card와 Mini-board | [`components/bingo/list/bingoListCard.tsx`](../../components/bingo/list/bingoListCard.tsx) 및 [`components/bingo/list/bingoMiniBoard.tsx`](../../components/bingo/list/bingoMiniBoard.tsx)                     | 공개 정체성을 유지하고 인증 시에만 개인 Cell·상태 표시                                                       |
| 상세 Route             | [`app/(nevigation)/bingo/[id]/page.tsx`](<../../app/(nevigation)/bingo/[id]/page.tsx>)                                                                                                                         | 보상 의미, 비로그인 공개 Reference 및 로그인 편집 Context 분리                                               |
| 빙고판                 | [`components/bingo/plate/bingoBoard.tsx`](../../components/bingo/plate/bingoBoard.tsx)                                                                                                                         | 선택과 완료를 분리하고 승인된 접근 가능 Composite Pattern 구현                                               |
| 미션 목록과 Filter     | [`components/bingo/plate/bingoMissionList.tsx`](../../components/bingo/plate/bingoMissionList.tsx) 및 [`components/bingo/plate/bingoMissionFilters.tsx`](../../components/bingo/plate/bingoMissionFilters.tsx) | 좌표 동기화, 간결한 Filter, 비로그인 반복 편집 Control 생략                                                  |
| 수동 변경              | [`app/(nevigation)/bingo/[id]/actions.ts`](<../../app/(nevigation)/bingo/[id]/actions.ts>) 및 [`components/bingo/plate/useBingoPlate.ts`](../../components/bingo/plate/useBingoPlate.ts)                       | 인증·Rollback을 유지하고 늦은 Response·중복 변경 보호 및 명시적 저장 Feedback 추가                           |
| 진행 계산              | [`lib/bingo.ts`](../../lib/bingo.ts)                                                                                                                                                                           | 12줄 계산을 유지하고 해금·전체판·Chance 의미를 각각 파생                                                     |
| 초기화                 | 새 로그인 사용자 범위 Action 및 Dialog                                                                                                                                                                         | 이 사용자의 빙고판 진행 Row만 삭제하고 명시적으로 확인하며 최근 기록을 다시 계산하고 시도 이력은 만들지 않음 |
| Data model             | [`prisma/schema.prisma`](../../prisma/schema.prisma)                                                                                                                                                           | Canonical 일본어 및 검수 KO/EN 미션 Field·상태 또는 동등한 다국어 콘텐츠 관계 추가                           |
| Seed/Import            | [`prisma/data/op3-bingos.json`](../../prisma/data/op3-bingos.json)                                                                                                                                             | 검증된 공식 일본어를 확보하고 검수 한국어를 유지하며 잘못된 출처 주장 없이 검수 영어 추가                    |
| 다국어 Label           | [`lib/i18n/messageCatalogs`](../../lib/i18n/messageCatalogs)                                                                                                                                                   | KO/JA/EN 목록·상세·보상·저장·초기화·로그인·Fallback 문자열 완비                                              |

## 대표 Fixture

최소한 다음을 검증합니다.

1. 같은 44개 전체 Catalog를 보는 비로그인 사용자와 로그인 사용자;
2. 저장 진행 없음, Cell 하나 체크, 여러 줄, 정확한 해금 기준, 기준 초과, 25개 전체 완료;
3. 한 줄 Chance, 여러 동시 Chance 및 Chance 없음;
4. Cell 저장 후와 초기화 후 최근 편집 빙고가 바뀌는 상황;
5. `requiredLines`가 2인 빙고판과 7인 빙고판;
6. 줄당, 전체판, 총액이 다른 관찰된 모든 보상 조합;
7. Version Filter 없이 표시하는 `FORTE`, `Op.2`, `Op.3` Metadata;
8. Cover 없음과 실제 가장 긴 클래식 제목;
9. 짧고 긴 일본어 공식 미션, 검수 한국어·영어 및 KO/EN 누락 시 일본어 Fallback;
10. 검증된 악곡 관계가 있는 미션과 없는 미션;
11. Cell 저장 성공, 느린 저장, 중복 입력, 순서가 뒤집힌 Response, 인증 만료 및 저장
    실패 Rollback;
12. 초기화 취소, 성공, 실패 및 최근 기록 재계산;
13. 모든 목록 Filter·Sort, 결과 없음, 첫 12개, 다음 12개 및 Back 복원;
14. Mouse, Touch, Keyboard, 보조기술에서 정확한 Board Cell·Mission row 선택 동기화;
15. `320px`, 대표 `390px`, 중간 너비, Wide desktop, 낮은 Viewport, 200% Text zoom,
    Reduced motion 및 Screen reader 구조.

## 브라우저 인수 조건

- `/ko/bingo`, `/ja/bingo`, `/en/bingo` 및 각 상세 Route는 동등한 동작과 다국어
  Metadata로 열립니다.
- 44개 상시 빙고판 모두 로그인 없이 접근할 수 있고 이용 불가, 종료, 날짜 범위,
  Archive 또는 Version 선택 UI가 나타나지 않습니다.
- 비로그인 사용자는 25개 미션 전체를 확인하고 Cell을 선택할 수 있지만 가짜
  `0/25`, 개인 체크 Cell, 완료 Control, 개인 Filter, Chance 진행 또는 최근 기록을
  보지 않습니다.
- 비로그인 로그인 안내 하나는 성공적인 로그인 후 같은 Locale과 빙고판으로
  복귀시킵니다.
- 로그인 변경은 저장되고 모든 파생 진행·보상 Cue를 갱신하며 중복·순서 역전 쓰기를
  막고 실패 시 정확히 Rollback합니다.
- 악곡 해금, 전체판 완료, 줄당 NOS, 전체판 NOS 및 총 획득 가능 NOS는 의미가
  구분됩니다.
- 초기화는 파괴 범위를 명확히 밝히고 현재 사용자의 해당 빙고판 기록만 제거하며
  실패 시 Data를 보존하고 시도 이력을 만들지 않습니다.
- 빙고판과 미션 선택은 동기화되지만 선택만으로 완료가 Toggle되지 않습니다.
- 검수된 미션은 페이지 Locale을 사용하고 KO/EN 누락은 정확한 언어 Metadata와
  함께 검증된 일본어로 Fallback합니다.
- 제목 번역 설정은 제목·읽기 표시에만 영향을 주고 다국어 미션 지시를 억제하지
  않습니다.
- 첫 12개와 명시적 다음 12개 로드는 Filter, Sort, 불러온 수, 위치 및 유용한
  Back 동작을 보존합니다.
- `320 CSS px`에서 Card, 빙고판, 미션, 보상 Group, Filter, Dialog 또는 Action이
  문서 단위 가로 Overflow, 잘림 또는 겹침을 만들지 않습니다.
- Wide Layout은 고정 휴대폰 너비 Shell이나 불필요한 추가 Control 없이 Catalog와
  빙고판·미션 비교 공간을 사용합니다.
- 모든 Cell, Checkbox, Selector, Link, 묶음 Action, Retry 및 초기화는 Keyboard
  단독으로 동작하고 Visible Focus와 이해 가능한 이름·상태를 제공합니다.
- Loading, Filter empty, Not found, 인증, 저장 오류, 초기화 오류, 관계 누락, 번역
  누락 및 Cover 없음 상태가 구분되고 가능한 경우 복구할 수 있습니다.
- 검증한 정상·실패 흐름에서 예상치 못한 Console error, Hydration 문제, 오래된
  Optimistic 결과 또는 사용자 간 진행 Data 누출이 없습니다.

## Reference Matrix

| 출처                                                                                                                             | 전용 가능한 원칙                                                             | NosLog 적용                                                 | 한계                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------- |
| [현재 빙고 Route와 Data](<../../app/(nevigation)/bingo/data.ts>)                                                                 | 공개 읽기, 현재 이용 가능성 Filter, 진행 조회 및 최근 갱신 Data 확인         | 관찰 구현과 승인된 상시 Catalog를 분리                      | 현재 이용 가능성·명칭은 2.0 기준이 아님                              |
| [현재 빙고 Schema](../../prisma/schema.prisma)                                                                                   | 빙고 보상, Source metadata, Cell 및 사용자 범위 수동 진행 확인               | 보상·초기화 요구사항의 근거                                 | Canonical JA와 검수 KO/EN 미션을 아직 지원하지 않음                  |
| [현재 빙고 Seed](../../prisma/data/op3-bingos.json)                                                                              | 실제 44개, 25 Cell 구조, 긴 제목, Version, 보상 범위 제공                    | Production 대표 Fixture 제공                                | 현재 한국어 미션은 검증된 일본어 출처가 아님                         |
| [승인 IA](./02-information-architecture.ko.md)                                                                                   | 빙고를 악곡과 연결된 독립 해금·보상 목적지로 유지                            | 접근과 문맥 악곡 Link 유지                                  | 목록·상세 Anatomy는 정의하지 않음                                    |
| [NOSTALGIA 공식 소식](https://p.eagate.573.jp/game/nostalgia/op3/news/entrance.html)                                             | 공식 빙고 이용, 보상, 초기화 및 Event domain 근거 제공                       | 상시 빙고판·초기화 해석의 근거                              | 공식 게임 UI는 NosLog 수동 기록 UX를 정의하지 않음                   |
| [NOSTALGIA 공식 이용 방법](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)                                       | 공식 게임 용어와 플레이 문맥 확립                                            | 잘못된 활성화·연동 의미 방지                                | NosLog에 사용자 진행 Data를 제공하지 않음                            |
| [GOV.UK Task list](https://design-system.service.gov.uk/components/task-list/)                                                   | Task는 분명한 이름·상태와 훑기 쉬운 관계가 필요                              | 좌표 미션과 명시적 수동 상태 지원                           | 빙고판은 공간 구조이므로 일반 선형 Task list로 축소할 수 없음        |
| [GOV.UK Complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/)                         | 다단계 작업에는 보이는 진행과 재개 가능한 Task context가 유용                | 최근 수동 기록과 간결한 진행 상태 지원                      | 행정 완료 Flow는 NOSTALGIA 보상을 정의하지 않음                      |
| [WAI-ARIA APG Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)                                                      | 이진 완료에는 Programmatic checked state와 Label 필요                        | 수동 미션 완료를 규율                                       | Optimistic 저장이나 빙고판 선택은 정의하지 않음                      |
| [WAI-ARIA APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)                                                              | 복합 Grid에는 명시적 Focus·Keyboard 동작 필요                                | Grid semantics 선택 시 접근 가능한 5×5 탐색에 활용          | APG Grid는 구현 복잡도를 높이며 Native button이 충분하면 필수가 아님 |
| [WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                           | 일반 콘텐츠는 문서의 2차원 Scroll 없이 320 CSS px에서 Reflow해야 함          | Compact 빙고판·미션·보상·Card Reflow 요구                   | Card 수나 Layout token은 정하지 않음                                 |
| [WCAG Language of Parts](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts)                                          | 다른 언어 Fallback 구절에는 Programmatic 언어 식별 필요                      | 일본어 미션 Fallback에 `lang="ja"` 요구                     | 번역 운영 정책은 정하지 않음                                         |
| [Carbon Modal](https://v10.carbondesignsystem.com/components/modal/usage/)                                                       | 파괴적 Modal은 명확한 결과·위계·Focus 처리·제한된 Action이 필요              | 빙고판 기록 초기화 확인에 활용                              | Carbon 시각 Styling은 NosLog 기준이 아님                             |
| [Material Dialogs](https://m1.material.io/components/dialogs.html)                                                               | Dialog는 Flow를 끊으므로 필요한 결정에만 사용                                | 일반 미션 체크가 아닌 초기화에만 확인 사용                  | Legacy Material 치수는 채택하지 않음                                 |
| [eBay Confirmation dialog](https://playbook.ebay.com/design-system/components/confirmation-dialog)                               | 확인은 Action 이름을 밝히고 안전한 취소 제공                                 | 명시적 초기화 범위와 취소 경로 지원                         | Marketplace Task 문맥은 빙고와 다름                                  |
| [W3C Language negotiation](https://www.w3.org/International/questions/qa-when-lang-neg)                                          | Locale 선택과 콘텐츠 언어 Fallback은 별도 관심사                             | 페이지 Locale을 유지하면서 누락 미션 하나만 일본어 Fallback | 편집 검수 상태는 정의하지 않음                                       |
| [Unicode CLDR 번역 Guide](https://cldr.unicode.org/translation/getting-started/guide)                                            | 번역에는 Context, 안정적 용어, 검수 및 Locale 문법이 필요                    | 검수 KO/EN 미션과 Domain token 유지 지원                    | CLDR 자체가 NOSTALGIA 번역을 제공하지 않음                           |
| [Android 다국어](https://developer.android.com/guide/topics/resources/localization)                                              | Locale별 문구가 없어도 기본·Fallback Resource로 Interface 기능을 유지해야 함 | 미션 행 누락 대신 결정적 Fallback 지원                      | Android Resource 방식을 Next.js에 그대로 복사하지 않음               |
| [Microsoft Resource Fallback](https://learn.microsoft.com/en-us/dotnet/core/extensions/retrieve-resources)                       | Resource 조회는 임의 혼합이 아닌 명시적 Culture fallback 사용                | 문서화된 미션 Fallback chain 지원                           | .NET Resource 구조는 구현 Target이 아님                              |
| [Apple Package Localization](https://developer.apple.com/documentation/xcode/localizing-package-resources)                       | 다국어 Resource는 Base source와 언어별 Variant를 보존                        | Canonical source와 검수 Variant 지원                        | Apple Package API를 사용하지 않음                                    |
| [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)                                          | Locale route와 Server rendering에는 명시적 Dictionary·Routing 필요           | 미션·Interface Locale을 기존 `/ko`, `/ja`, `/en`과 정렬     | 콘텐츠 검수 Workflow는 제공하지 않음                                 |
| [FormatJS Fallback](https://formatjs.github.io/docs/intl/)                                                                       | Runtime format과 Fallback은 결정적이며 관찰 가능해야 함                      | 깨지지 않는 Fallback과 완전한 Message catalog 지원          | Library 채택은 이 문서가 결정하지 않음                               |
| [i18next Fallback](https://www.i18next.com/principles/fallback)                                                                  | 화면에 모든 번역을 섞지 않고 Fallback 언어 순서를 정할 수 있음               | 한 개의 보이는 미션 언어와 일본어 Fallback 지원             | NosLog가 i18next를 사용하지 않을 수 있음                             |
| [Sanity Localization](https://www.sanity.io/docs/studio/localization)                                                            | Field-level localization은 콘텐츠 정체성과 편집 상태를 보존                  | 미션별 Canonical·번역 Field 지원                            | Sanity는 NosLog CMS가 아님                                           |
| [Shopify Markets Fallback](https://shopify.dev/docs/apps/build/markets/index)                                                    | Market·Locale Fallback은 사용 가능한 공개 경험을 보존해야 함                 | 검수 상태를 운영하면서 공개 미션 Fallback 지원              | Commerce market은 게임 콘텐츠와 다름                                 |
| [Steamworks Languages](https://partner.steamgames.com/documentation/languages)                                                   | 게임 대상 다국어에는 지원 언어 계획과 안정적 용어가 필요                     | KO/JA/EN 게임 Domain glossary와 검수 지원                   | Steam 지원 언어 범위는 NosLog보다 넓음                               |
| [GOV.UK 번역](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/consider-translations/) | 번역 콘텐츠에는 소유권, 유지관리 및 Source coordination 필요                 | 검수 상태와 Canonical 일본어 출처 지원                      | 행정 출판 Workflow 전체를 복사하지 않음                              |
| [Home Office 제한적 영어 지침](https://design.homeoffice.gov.uk/design-and-content/content/designing-for-limited-english)        | 지시는 간결하고 문자 그대로이며 불필요한 복잡성을 피해야 함                  | 미션·로그인·초기화 지원 문구에 활용                         | 영어 접근성 지침은 일본어·한국어 게임 용어를 정의하지 않음           |
| [IBM 번역 문서](https://www.ibm.com/docs/en/about?topic=translations-documentation)                                              | Fallback·번역 문서는 보이고 일관된 언어 관리 필요                            | 결정적 Fallback 지원 및 잘못된 번역 출처 주장 방지          | 문서 페이지는 Cell별 미션과 다름                                     |

### 근거 수렴

- NOSTALGIA 공식 근거와 저장소 Data는 5×5 보상형 Domain object에 수렴하지만 공식
  진행 Feed의 부재로 NosLog는 수동 전용 계약이어야 합니다.
- Task list, Checkbox, Grid Reference는 명시적 상태, Label이 있는 Control,
  동기화된 공간·목록 Context 및 Keyboard 동작에 수렴합니다. 이 근거는 5×5 빙고판을
  일반 선형 Checklist로 대체하는 것을 정당화하지 않습니다.
- 파괴적 작업 Reference는 결과가 큰 초기화에만 확인을 사용하고, 범위를 명명하고,
  안전한 취소·Focus 동작을 유지하는 데 수렴합니다.
- 반응형 지침과 현재 브라우저 근거는 고정 390px 제품 Shell이 아니라
  `320 CSS px` Reflow와 의도적인 Desktop 공간 활용에 수렴합니다.
- 다국어 Source는 Canonical 원문, 검수 Variant, 결정적 Fallback 및 올바른 언어
  Metadata에 수렴합니다. 한국어 역번역을 공식 일본어로 표기하거나 AI 초안을
  공개하는 것은 지지하지 않습니다.
- 정확한 44개 상시 계약, 악곡 해금과 전체판 완료 구분, 최근 기록 의미,
  비로그인 생략 규칙 및 시도 이력 부재는 외부 Source가 결정하지 않습니다. 검증된
  NOSTALGIA·NosLog 근거와 사용자의 명시적 승인에서 나온 결정입니다.

## 거부 및 대체된 대안

- **연동 플레이 기록으로 미션 자동 완료 — Rejected:** 조건에 맞는 기록이 있어도
  당시 해당 인게임 빙고판이 활성화되었다는 증거가 아닙니다.
- **빙고판 하나를 활성·현재 선택으로 표시 — Rejected:** NosLog는 사용자의 활성
  NOSTALGIA 빙고판을 읽을 수 없습니다. 최근 수동 기록만 사용합니다.
- **재도전 Session, 시도 횟수, 완료 이력 생성 — Rejected:** 초기화는 현재
  Checklist만 비우며 원장을 만들 검증된 사용자 필요가 없습니다.
- **이용 날짜, 종료 상태, Archive, Version 선택기 추가 — Rejected:** 승인된
  44개 판은 상시 열람 대상이고 Version은 출처 Metadata일 뿐입니다.
- **비로그인 `0/25`와 비활성 완료 Control 표시 — Rejected:** 개인 상태를
  조작하고 사용할 수 없는 Action을 25번 반복합니다.
- **비로그인에게 빙고판 숨김 — Rejected:** 빙고판 좌표와 미션은 유용한 공개
  Reference입니다.
- **모든 미션에 원문·번역 함께 표시 — Rejected:** Locale에 맞는 한 문구가
  탐색성을 지키며 일본어는 필요한 Fallback에만 나타납니다.
- **현재 한국어 미션을 공식 원문으로 보고 역번역 — Rejected:** 공식 일본어 출처를
  확보하고 검증해야 합니다.
- **설명 없는 NOS 총액 하나 사용 — Superseded:** 줄 보상, 전체판 Bonus, 총 획득
  가능 값 및 악곡 해금 기준은 서로 다른 의미입니다.
- **분리된 영구 계속하기 CTA — Rejected:** 최근 기록은 목록 계층에 머물고 공식
  활성 상태를 암시할 수 없습니다.
- **자동 Infinite scroll — Rejected:** 명시적 묶음이 위치, 통제 및 History를
  보존합니다.
- **Desktop을 고정 Mobile 너비 Shell에 유지 — Rejected:** `390px`은 검토
  Canvas이지 Desktop Layout 너비가 아닙니다.
- **구조 논의용 예시를 최종 High fidelity로 취급 — Rejected:** 해당 예시는
  계층만 전달했으며 최종 시각 형태는 Foundation과 Claude Design이 담당합니다.

## 결정 기록

| ID       | 결정                                                                                    | 상태       |
| -------- | --------------------------------------------------------------------------------------- | ---------- |
| BINGO-01 | 빙고는 공개 Reference이자 로그인 수동 Checklist이며 공식 연동 상태 Mirror가 아님        | `Approved` |
| BINGO-02 | 44개 빙고판 모두 상시 열람하며 이용 가능성·Archive·Version 선택기를 두지 않음           | `Approved` |
| BINGO-03 | `sourceVersion`은 하위 위계 출시 출처 Metadata로만 사용                                 | `Approved` |
| BINGO-04 | 비로그인은 빙고판·미션 Reference 전체를 보지만 가짜 개인 진행은 보지 않음               | `Approved` |
| BINGO-05 | 반복 비활성 편집 Control 대신 문맥 로그인 안내 하나를 제공하고 정확한 판으로 복귀       | `Approved` |
| BINGO-06 | 가장 최근 수동 편집 빙고를 `최근 기록`으로 표시할 수 있지만 활성·활성화라고 하지 않음   | `Approved` |
| BINGO-07 | 진행은 시작 전, 진행 중, 악곡 해금 완료, 전체판 완료로 구분                             | `Approved` |
| BINGO-08 | Chance는 Lifecycle 상태가 아니라 한 Cell만 남은 줄의 보조 조건                          | `Approved` |
| BINGO-09 | 필요 줄, 줄당 NOS, 전체판 Bonus, 총 획득 가능 NOS 의미를 구분                           | `Approved` |
| BINGO-10 | 목록은 간결한 개인 Filter·Sort, 첫 12개+명시적 다음 12개 및 복원 Context 사용           | `Approved` |
| BINGO-11 | 완전한 5×5 빙고판을 중심에 유지하고 선택을 25개 미션 목록과 동기화                      | `Approved` |
| BINGO-12 | 선택은 공개이며 로그인 수동 완료와 독립                                                 | `Approved` |
| BINGO-13 | 수동 변경은 인증, Optimistic feedback, Rollback 및 늦은·중복 쓰기 보호 사용             | `Approved` |
| BINGO-14 | 초기화는 명시적 확인 후 해당 사용자의 현재 25 Cell 빙고판 기록만 삭제                   | `Approved` |
| BINGO-15 | 초기화로 시도·재도전·완료 이력 또는 누적 NOS 기록을 만들지 않음                         | `Approved` |
| BINGO-16 | 검증된 공식 일본어가 Canonical 미션이며 KO/EN은 각각 검수한 번역                        | `Approved` |
| BINGO-17 | 미션 지시는 선택적 악곡명 번역 설정과 독립적으로 페이지 Locale을 따름                   | `Approved` |
| BINGO-18 | 승인 KO/EN 미션 누락 시 검증된 일본어와 `lang="ja"`로 Fallback                          | `Approved` |
| BINGO-19 | Compact는 320 CSS px까지 Reflow하고 Wide는 Catalog와 빙고판·미션 비교 공간을 사용       | `Approved` |
| BINGO-20 | 최종 High-fidelity Styling은 이 제품 계약 안에서 Foundation·Claude Design 작업으로 남김 | `Approved` |

## Handoff 경계

Claude Design은 Foundation 승인 후 최종 Typography, 시각 강조, Surface, Cover·
Mini-board 처리, Card 비율, Column track, Gap, 선택·체크·Chance Styling, Control·
Dialog 외형, 반응형 전환점 및 Motion을 결정할 수 있습니다. 그러나 상시 Catalog,
수동 전용 진실 모델, 비로그인 생략, 보상 의미, 중심 빙고판, 동기화 미션 구조, 초기화
경계, 다국어 출처·Fallback, 상태 계약, 접근성 및 인수 조건을 보존해야 합니다.

후속 Codex 구현 세션은 Claude 결과를 이 문서와 비교해야 합니다. 실시간 게임 상태를
발명하거나, 미션을 자동 완료하거나, 공개 Reference를 숨기거나, 가짜 비로그인 진행을
표시하거나, 해금과 전체판 의미를 합치거나, 시도 이력·이용 가능성 UI를 추가하거나,
미검수·역번역 미션을 사용하거나, 고정 휴대폰 너비 Desktop Shell을 유지하거나,
그 밖에 승인 계약과 충돌하는 디자인은 구현 전에 Guide 또는 Design 수정을 요청해야
합니다.
