# NosLog 2.0 서열 페이지 기획서

## 문서 관리

- 상태: `Approved`
- 결정 상태: `핵심 페이지 계약 승인: 과업 모델, 모드 및 목표 선택, 서열 구간 탐색,
필터, 개인 진행 상태, 간단히 보기와 자세히 보기, 채보별 지표, 목표 Context를 가진
악곡 상세 직접 이동, 범위별 커뮤니티 투표와의 관계, 복원, 반응형 동작`
- 근거 상태: `저장소 조사, 현행 제품 감사, 승인된 정보 구조, 승인된 악곡 상세
계약, 인용한 NOSTALGIA 도메인 안내, 리듬게임 비교 사례, 반응형 시스템,
접근성 지침, 사용자 승인 결정 기록`
- 작성 시작일: 2026-08-01
- 최종 결정 갱신일: 2026-08-02
- 기준 언어: 영어
- 영어 기준 문서:
  [06-tier-list-page-brief.md](./06-tier-list-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 하위 목적지 계약:
  [05-music-detail-page-brief.ko.md](./05-music-detail-page-brief.ko.md)
- 범위: 공개 `/[locale]/tiers` 플레이 계획 경험과, 로그인 후 제공되는 개인 기록 및
  레이팅 보강 정보
- 제외 범위: 정확한 관리자 서열 편집 또는 투표 검토 Interface 구성, 최종
  Foundation 토큰, 정확한 하이파이 구성, 이번 디자인 가이드 세션에서의
  프로덕션 구현

## 결정 상태 표기

- **Observed:** 저장소, 현재 브라우저 근거 또는 승인된 상위 산출물에서 확인된 사실.
- **Approved:** 사용자가 명시적으로 동의했으며 하위 디자인에 구속력을 갖는 결정.
- **Proposed:** 근거를 갖췄으나 사용자 승인을 기다리는 방향.
- **Open:** 추가 조사, 검증 또는 사용자 결정이 필요한 항목.
- **Rejected:** 검토했으나 명시적으로 채택하지 않은 항목.
- **Superseded:** 이후 승인된 방향으로 대체된 항목.

이 기획서는 승인된 서열 페이지 동작과 정보 계층의 기준 문서다. 정확한 타이포그래피,
색상, 간격, 반경, 아이콘 형태, 카드 치수와 최종 breakpoint 값은 Foundation 및 이후
Claude Design 작업에 남긴다. 이후 결정은 표현을 다듬을 수 있지만, 승인된 제품 계약을
제거하거나 다르게 해석해서는 안 된다.

## 목적

서열 페이지는 하나의 핵심 질문에 답한다.

> 이 성과 목표를 위해 다음으로 어떤 채보를 플레이해야 하는가?

사용자는 NOSTALGIA 플레이 모드와 달성 목표를 고르고, 적합한 서열 구간으로 이동하고,
자신의 기록과 채보를 비교한 다음, 더 자세히 볼 정확한 악곡 난이도를 열 수 있다. 이
페이지는 일반 악곡 카탈로그나 대시보드, 펼쳐지는 기록 분석 보고서가 아니라 플레이
계획 작업 공간이다.

## 주요 사용 맥락과 성공 조건

- **Approved upstream:** 서열은 홈과 더보기 내비게이션 패널에서 독립적으로 접근한다.
  빙고나 검정과 하나의 그룹으로 묶지 않는다.
- **Approved:** 오락실 플레이 전후의 모바일 사용이 주요 맥락이며, 데스크톱에서도 더
  빠른 비교와 필터링을 위해 모든 기능을 지원한다.
- **Approved:** 사용자가 적절한 채보를 찾아 정확한 악곡 상세 난이도를 열고, 돌아왔을
  때 이전 계획 맥락을 잃지 않으면 방문이 성공한 것이다.
- **Approved:** 페이지는 공개다. 로그인은 개인 점수, 달성 상태, Grd와 적용 가능한
  NosLog 레이팅 정보를 더할 뿐, 공개 목록을 다른 페이지로 대체하지 않는다.
- **Approved:** 현재 시각 스타일과 `390px` 최대 너비 셸은 감사 근거일 뿐, 2.0의
  제약이 아니다.

## 현행 제품 근거

### 확인된 경로와 Query 상태

- 공개 경로는 `/[locale]/tiers`다.
- `mode`는 `basic` 또는 `recital`이며 기본값은 `basic`이다.
- `goal`은 `s`, `fc`, `pianist`이며 기본값은 `s`다.
- `difficulty`는 `Normal`, `Hard`, `Expert`, `Real`을 받는다.
- `level`은 일반 레벨 `1–12`와 `real-1`부터 `real-3`까지를 받는다.
- 기존 `/[locale]/tiers/[slug]` 경로는 호환성 redirect이며 새로운 2.0 내비게이션
  계열이 아니다.
- 현재 모드, 목표, 난이도와 레벨은 `router.replace`로 URL query 상태를 갱신하며
  세로 스크롤을 유지한다.

### 확인된 데이터와 로딩

- 서버는 선택한 모드와 목표에 맞는 공개 서열표를 불러온다.
- 서열 구간 요약에는 관리자 지정 순서의 구간 값과 필터된 채보 수가 포함된다.
- 첫 구간은 페이지와 함께 불러오고, 이후 구간은 해당 영역이 viewport에 가까워질 때
  불러온다.
- 로그인 사용자는 채보별 최고 점수, rank, Full Combo 유형, 플레이 횟수, 판정 상세,
  노트 유형 성공률, 최고 기록 시각, 최신 FAST/SLOW 맥락을 받는다.
- Basic NosLog 레이팅은 기여도가 높은 유효 채보 최대 `70`개의 합으로 정의되며,
  현재 Basic Pianist 정책에 적용된다.
- 기존 데이터와 API는 이후 구현 기반으로 재사용할 수 있지만, 현재 표현 방식은 2.0의
  기준이 아니다.

### 확인된 사용성 기준선

- 현재는 모든 공개 구간을 하나의 긴 세로 흐름에 쌓으며, 감사한 한국어 페이지의 높이는
  약 `3,953px`였다.
- 현재 결과 grid는 세 열로 고정되어 넓은 데스크톱 공간을 구간 탐색, 필터 또는 비교에
  활용하지 않는다.
- 비로그인 카드는 악곡 상세로 직접 이동하지만, 로그인 카드는 버튼으로 바뀌어 grid
  안에 큰 기록 패널을 펼친다.
- 펼쳐진 패널은 악곡 상세에 속할 밀도 높은 진단 정보를 반복한다.
- 현재 모바일 필터는 매번 즉시 갱신되고, 열린 필터 영역이 결과 목록과 경쟁한다.
- 현재 안내 disclosure는 목록 설명, 필터 도움말, 갱신 시각과 선택적인 Basic 레이팅
  가중치 차트를 함께 담는다.

이 관찰은 마이그레이션할 대상을 밝힌다. 현재 레이아웃, 밀도, 카드 상호작용 또는 콘텐츠
순서를 승인한다는 뜻이 아니다.

## 승인된 페이지 계층

모바일 우선 semantic 순서는 다음과 같다.

1. 페이지 제목과 간결한 서열표 설명;
2. 선택적인 계산 안내 disclosure;
3. 항상 보이는 `Basic / Recital` 모드 선택;
4. 하나의 `S / Full Combo / Pianist` 목표 selector;
5. 현재 서열 구간 탐색과 목표별 개인 진행 상태;
6. 난이도 및 공식 레벨 필터;
7. 적용 조건과 결과 요약;
8. 간단히 보기/자세히 보기 제어;
9. 활성 구간의 채보 목록; 그리고
10. 모든 구간을 끝없이 쌓지 않고 명시적인 구간 선택으로 이어지는 탐색.

넓은 레이아웃에서 구간 탐색과 필터가 결과 영역 옆으로 이동하더라도 이 semantic 순서는
유지한다.

## 모드, 목표와 안내

### 모드

- `Basic`과 `Recital`은 항상 보이는 상호 배타적 버튼 두 개로 유지한다.
- 모드는 일반 Select 안에 숨길 부차적 필터가 아니라 NOSTALGIA의 주요 맥락이다.
- 모드를 바꾸면 공개 서열표와 모드별 개인 지표가 함께 바뀐다.
- 제3의 상위 모드를 만들거나 Basic과 Recital 결과를 합치지 않는다.

### 목표

- `S`, `Full Combo`, `Pianist`는 label이 있는 selector 하나를 사용한다.
- 여섯 개의 모드-목표 조합을 모두 영구 버튼으로 표시하지 않는다.
- 목표를 바꾸면 활성 공개 목록, 구간 진행 상태, 달성 상태와 결과 맥락이 함께 바뀐다.

### 계산 안내

- 페이지 도입부 가까이에 설명적인 disclosure 하나로 계산/서열 안내를 제공한다.
- 적용되는 경우 현재 목록 설명, 최종 갱신일, 필터 해석과 Basic 레이팅 가중치 설명을
  포함할 수 있다.
- 안내는 모드, 목표, 구간과 채보를 고르는 핵심 작업보다 부차적으로 둔다.
- 모든 구간 안에서 전체 안내를 반복하지 않는다.

## 개인 지표 맥락

- 로그인 시 선택한 모드의 NOSTALGIA 공식 종합 Grd를 보조적인 계획 맥락으로 표시한다.
- 전체 NosLog 레이팅은 현재 정책이 정의한 맥락에서만 표시한다.
- 현재 승인된 정책에서 채보별 NosLog 기여도는 `Basic · Pianist`에만 관련된다.
- 적용되지 않는 다른 모드-목표 조합의 모든 카드에 레이팅 미지원 설명을 반복하지 말고
  해당 지표를 생략한다.
- 내부 `상위 70곡 반영/미반영`, cutline 또는 계산 디버그 label을 영구 카드 badge로
  노출하지 않는다.
- 상위 70곡 정책 설명은 빠르게 훑는 목록이 아니라 계산 안내에 둔다.

## 서열 구간 탐색

### 의미

- 구간은 `13.5`, `13.0`, `12.5`와 같은 공개 서열 값이다.
- 관리자 지정 구간 순서와 정확한 소수 label을 유지한다.
- 진행 상태는 항상 현재 모드, 목표와 확정된 필터를 기준으로 한다.

### 모바일

- 한 번에 하나의 활성 구간 목록만 보여준다.
- 현재 값과, 로그인했다면 `6 / 21` 같은 달성 수를 포함하는 간결한 구간 control을
  제공한다.
- control을 열면 순서가 있는 사용 가능 구간과 관련 수치를 모바일에 맞는 선택 surface로
  보여준다.
- 구간을 바꾸면 모드, 목표, 필터, 보기 환경설정 또는 페이지 맥락을 초기화하지 않고
  결과 목록만 교체한다.

### 데스크톱

- 추가 너비를 사용해 활성 결과 목록 옆에 순서가 있는 구간 navigator를 계속 보이게 한다.
- 보이는 navigator와 모바일 selector는 같은 의미와 데이터를 갖는다.
- 모바일 단일 열 stack을 단순히 확대하거나 모든 구간을 하나의 연속된 데스크톱 문서로
  만들지 않는다.

## 필터와 결과 요약

### 필터 범위

다음 목록 필터만 사용한다.

- 채보 난이도: `Normal`, `Hard`, `Expert`, `Real`;
- 공식 채보 레벨: 일반 `1–12`와 `Real 1–3`.

개인 클리어 상태, JUST 비율, 테누토, 글리산도, 트릴 또는 MISS 수 필터는 이 페이지에
추가하지 않는다. 선택한 달성 목표가 의미 있는 개인 완료 맥락을 이미 제공한다.

### 모바일 확정 방식

- 결과 흐름 안에 영구 버튼 행을 계속 펼치지 말고, 제한된 전용 surface에서 필터를 연다.
- 사용자가 여러 임시 난이도와 레벨 값을 조정할 수 있게 한다.
- **N개 결과 보기** 같은 결과 수가 포함된 action으로 한 번에 확정한다.
- 확정하지 않고 닫으면 보이는 결과와 기존 확정 조건은 바뀌지 않는다.

### 데스크톱 확정 방식

- 목록과 함께 볼 충분한 공간에 필터를 유지하고, 값이 바뀌면 결과를 즉시 갱신한다.
- 결과와 필터가 함께 보이는데 불필요한 데스크톱 적용 단계를 추가하지 않는다.

### 요약

- 확정 조건과 결과 수를 결과 영역에 인접하게 둔다.
- 필터 해제 수고를 줄이는 경우 삭제 가능한 적용 조건 token을 사용한다.
- 요약은 간결하게 유지하고 페이지 제목, 전체 필터 form 또는 설명 문장을 반복하지 않는다.

## 채보 결과 보기

### 기본 간단히 보기

- 간단히 보기는 기본 탐색 모드다.
- 대표 `390px` 캔버스에서는 기본 세 열을 사용한다.
- 최소 target 크기와 읽을 수 있는 점수를 유지할 수 있을 때 선택적인 네 열 밀도를
  제공한다.
- 각 간단 항목은 다음을 포함한다.
    - 작은 정사각형 `1:1` jacket;
    - 달성한 경우 실제 `S`, `Full Combo` 또는 `Pianist` 상태 아이콘;
    - jacket 아래의 개인 최고 점수 또는 간결하게 현지화된 미플레이 값.
- 시각적인 간단 카드에는 제목, 번역 제목, 난이도, Grd 또는 레이팅 기여도를 반복하지
  않는다.
- 접근 가능한 link 이름에는 여전히 악곡 제목, 난이도, 공식 레벨, 존재하는 개인 결과와
  목적지 용도를 포함한다.

### 자세히 보기

- `자세히 보기` checkbox 또는 동등한 이진 control 하나를 사용하고, 경쟁하는 영구 tab
  두 개를 만들지 않는다.
- 대표 `390px` 캔버스에서는 두 열을 사용한다.
- jacket은 정확한 `1:1`을 유지하고, 그 아래 정보 영역은 실제 콘텐츠에 맞게 늘어나게
  한다.
- 개인 최고 점수는 jacket 하단의 절제된 반투명 검은 overlay에 둔다.
- 달성 상태 아이콘을 jacket에 유지하고 필요할 때 border/ring으로 보조할 수 있지만,
  색상만으로 상태를 전달하지 않는다.
- jacket 아래에는 다음 순서로 표시한다.
    1. 사용자 설정이 켜진 경우 선택적인 번역 제목 또는 일본어 읽기;
    2. 원문 악곡 제목;
    3. 선택 채보 난이도와 공식 레벨;
    4. 존재하는 경우 해당 채보의 선택 모드 공식 Grd 기여도; 그리고
    5. 적용 가능한 `Basic · Pianist` 맥락에서만 NosLog 레이팅 기여도.
- 내부 상위 70곡 반영 상태, cutline 디버깅, 예상 점수 상승, 전체 판정 진단 또는 노트
  유형별 성공률은 카드에 표시하지 않는다.

### 달성 상태

- 확인된 결과인 `S`, `Full Combo`, `Pianist`만 보여준다.
- 임의적인 점수 경계로 `도전 중`, `진행 중` 또는 동등한 상태를 만들어내지 않는다.
- 비로그인, 미플레이, 플레이했지만 목표 미달성, 목표 달성의 의미는 데이터와 접근 가능한
  텍스트에서 구분하되, 모든 의미를 영구 badge로 만들지는 않는다.
- 상태 border와 아이콘이 jacket 인식을 방해하거나 잘못된 품질 순위를 만들면 안 된다.

## 카드 이동과 복원

- 채보 카드 전체는 서열 유입 맥락, 선택 모드 및 선택 목표를 갖고
  `/[locale]/music/[index]/[difficulty]`로 이동하는 하나의 semantic link다.
- 서열 카드는 정확한 악곡 난이도의 **서열·평가** 영역을 열어 공식 배치, 대응하는
  커뮤니티 범위 및 자격 있는 기여 Action을 사용자가 목표 Context를 다시 찾지 않고
  확인하게 합니다.
- 로그인과 비로그인 사용자는 같은 직접 이동 모델을 사용한다.
- 악곡 상세 전에 중간 기록 확장, popover, drawer 또는 modal을 열지 않는다.
- pointer hover와 keyboard focus는 클릭 가능성만 피드백할 수 있으며, 필수 정보를
  hover에만 두면 안 된다.
- touch에서는 첫 tap 미리보기 없이 안정된 카드가 바로 목적지로 이동한다.
- 브라우저 뒤로가기는 이전 모드, 목표, 확정된 필터, 활성 구간, 간단히/자세히 보기,
  간단히 보기 밀도와 실질적인 스크롤 위치를 복원해야 한다.
- 복원된 페이지가 예고 없이 첫 구간으로 돌아가거나, 유효한 결과를 맥락을 파괴하는
  방식으로 다시 불러오면 안 된다.

## 목표별 커뮤니티 투표와의 관계

- 공개 서열 Page는 관리자 소유의 공식 플레이 계획 Surface로 유지합니다. 커뮤니티
  투표 중앙값이 구간 값을 대체하거나 카드를 재정렬하거나 공개 목록을 자동 변경하지
  않습니다.
- 여섯 공개 목록 Context는 `Basic/Recital × S/Full Combo/Pianist`의 여섯 투표
  범위와 일대일로 대응합니다.
- 서열 카드 목록에 Inline 투표 Control, 투표 분포, 불일치 Badge 또는 중간 투표
  Modal을 추가하지 않습니다. 이는 승인된 빠른 탐색 과업과 경쟁하며 서열 카드
  콘텐츠로 승인되지 않았습니다.
- 정확한 선택 채보의 **서열·평가** 영역이 투표 읽기, 생성, 수정 및 삭제를
  소유합니다. 자격, 중앙값, 분포, 수, 관리자 검토 및 데이터 분리 규칙은
  [악곡 상세 기획서](./05-music-detail-page-brief.ko.md)가 정의합니다.
- 선택 모드와 목표를 유입·복원 상태에 보존합니다. 읽거나 투표한 뒤 돌아온 사용자는
  같은 모드, 목표, 구간, 확정 필터, 보기 환경설정, 밀도 및 실질적인 Scroll 위치를
  복구해야 합니다.
- 투표 제출 또는 수정은 정확한 커뮤니티 집계와 파생 관리자 후보를 무효화합니다.
  관리자가 이후 일반 배치 흐름을 완료하지 않는 한 공개 서열표를 무효화하거나 다시
  작성하면 안 됩니다.

## 반응형 계약

### 대표 너비와 최소 너비

- `390px`은 여러 흔한 휴대전화 viewport 치수와 대응하므로 사용하는 대표 모바일
  디자인·검토 캔버스다. 보편적인 표준, breakpoint, 고정 셸 또는 최소 지원 너비가
  아니다.
- 실제로 2차원 의미가 필요한 콘텐츠를 제외하고, 페이지는 `320 CSS px`에서 정보와
  기능을 보존하며 2차원 스크롤 없이 reflow해야 한다.
- 중간 compact 너비도 검증한다. `390px` 예시가 성공했다고 전체 compact 범위가
  검증된 것은 아니다.

### 콘텐츠 기반 적응

- control, 번역 label, 카드 target 또는 카드 콘텐츠가 승인된 계층을 유지하며 더는
  맞지 않는 지점에서 레이아웃을 전환한다.
- 가능하면 모든 동작을 기기 이름 breakpoint에서 파생하지 말고 결과 카드 열에 container
  제약을 사용한다.
- 모바일 규범 예시는 `390px`에서 간단히 보기 기본 세 열, 선택적 네 열 밀도와 자세히
  보기 두 열이다.
- 데스크톱 열 수는 하나의 고정된 제품 수치가 아니다. 승인된 최소 가독 카드 너비, 제목
  동작, target과 비교 계층을 지킬 수 있는 동안만 열을 늘린다.
- 데스크톱에서는 `390px` 페이지를 늘리는 데 너비를 쓰지 않고, 구간 탐색, 보이는 필터와
  더 밀도 높은 비교 목록을 동시에 제공하는 데 사용한다.

## 로딩, 빈 상태, 오류와 인증 상태

- **공개된 서열표 없음:** 페이지 맥락과 선택한 모드/목표 control은 유지하고 간결한
  페이지 수준 부재 상태 하나를 보여준다.
- **일치하는 채보 없음:** 확정된 필터를 보이게 유지하고, 바로 필터를 해제할 수 있는
  간결한 결과 수준 빈 상태 하나를 제공한다.
- **최초 결과 로딩:** 페이지 정체성과 control을 안정적으로 유지하고, 결과 영역을 busy로
  표시하며 필요한 경우 geometry를 보존하는 placeholder를 사용한다.
- **교체 로딩:** 현재 결과 geometry는 유지하되, 이전 카드가 새로 확정된 조건과 일치하는
  것처럼 이동하지 못하게 한다.
- **구간 요청 실패:** 오류를 결과 영역에 한정하고 계획 상태를 초기화하지 않는 재시도
  action 하나를 제공한다.
- **비로그인:** 가짜 점수, 진행 상태, Grd 또는 달성 상태 없이 완전한 공개 서열 목록을
  보여준다. 채보를 여는 데 로그인이 필요하지 않다.
- **로그인했으나 미플레이:** 조작된 0점이나 `도전 중` 대신 사실에 맞는 간결한 미플레이
  값을 표시한다.
- **선택 지표 사용 불가:** field를 생략하고 카드마다 반복되는 `사용할 수 없음` 문구를
  표시하지 않는다.

정확한 다국어 빈 상태 및 오류 문구는 공통 콘텐츠 시스템에서 다듬을 수 있지만, 간결해야
하며 위의 서로 다른 의미를 보존해야 한다.

## 접근성

- Basic/Recital 및 보기/밀도 control에는 semantic button, 목표에는 label이 있는 Select,
  필터에는 semantic control, 채보 카드마다 semantic link 하나를 사용한다.
- native semantic 또는 올바른 ARIA로 선택 상태와 펼침 상태를 노출한다.
- 데스크톱에서 영역이 나란히 놓여도 승인된 모바일 계층을 따르는 논리적인 source 및
  keyboard 순서를 유지한다.
- 모든 action에 보이는 focus indicator를 제공한다.
- 네 열을 선택해도 모든 compact target이 승인된 target 크기 기준을 충족하게 한다.
- jacket 이미지, 색, border 또는 외부 rank 이미지만으로 채보나 달성을 식별하게 하지
  않는다.
- 확정된 결과 수가 바뀔 때 불필요하게 focus를 옮기지 않고 변화를 알린다.
- 모바일 필터 surface가 열리면 최초 focus, focus containment, Escape 또는 닫기 동작과
  trigger로의 focus 반환을 관리한다.
- `320 CSS px` 및 브라우저 텍스트 확대에서 WCAG Reflow를 유지한다.

## 다국어와 콘텐츠

- 같은 문자열 길이를 가정하지 않고 한국어, 일본어와 영어 label을 지원한다.
- 원문 악곡 제목을 유지한다. 자세히 보기에서는 설정이 켜진 번역 제목 또는 일본어 읽기를
  더 낮은 타이포 단계로 원문 제목 위에 둔다.
- 간단히 보기에서는 밀도를 위해 제목을 시각적으로 생략할 수 있지만 접근 가능한 이름에서는
  생략하면 안 된다.
- 긴 제목이나 읽기를 고정 높이 jacket 안에 강제로 넣거나 정사각형 이미지를 왜곡하지
  않는다.
- 번역이 구현이나 게임 mapping을 약화하는 경우 도메인 label `Basic`, `Recital`, `S`,
  `Full Combo`, `Pianist`, `Grd`, `NosLog`를 그대로 유지한다.
- 정확한 서열 값은 보존하면서 점수, 수량과 소수는 locale에 맞는 구분자로 표시한다.

## 구현 mapping

이 mapping은 향후 구현 세션을 안내하며, 현재 디자인 가이드 세션의 코드 변경을 허가하지
않는다.

- 현재 `/[locale]/tiers` 경로와 mode/goal/difficulty/level validation을 재사용한다.
- 공유 가능한 확정 조건을 무효화하지 않으면서 활성 구간과 보기 환경설정을 복원하도록
  navigation 상태를 확장한다.
- 모바일 필터는 적용 전에 값을 stage하고 데스크톱 필터는 즉시 갱신하도록
  `TierControls`를 refactor한다.
- `TierBandBrowser`를 모든 구간을 의무적으로 쌓는 문서에서 하나의 활성 구간 목록과
  모바일 selector 또는 데스크톱 rail 구조로 refactor한다.
- 인증된 카드도 inline 기록 확장 button이 아니라 공개 카드와 같은 link가 되도록
  `TierChartCard`를 refactor한다.
- 악곡 상세로 연결할 때 선택 서열 모드, 목표, 활성 구간과 복귀 Context를 Encoding하고
  목적지의 일반 기본 Panel이 아니라 서열·평가 영역을 엽니다.
- 서열 탐색 surface에서 `TierRecordDetail`을 제거한다. 유용한 기록 데이터는 악곡 상세
  또는 별도로 승인된 목적지에서 활용한다.
- 자세히 보기 payload에 선택 모드의 채보별 공식 Grd 기여도와, 적용 가능한 Basic
  Pianist NosLog 기여도를 추가한다.
- 승인된 새 상태 계약을 충족하는 범위에서 기존 공개 구간 cache와 지역 재시도 경계를
  재사용한다.
- 범위별 투표 Entity는 `TierList` 및 `TierBandEntry`와 독립적으로 유지합니다. 공식
  목록은 관리자 공개 배치 데이터만 읽고 커뮤니티 집계와 검토 후보 무효화는 악곡 상세
  계약을 따릅니다.
- 승인된 asset 및 licensing 전략 없이 불안정한 외부 URL에서 달성 아이콘을 가져오지
  않는다.

## 대표 검증 fixture

다음을 포함해 검증해야 한다.

- Basic S, Basic Full Combo, Basic Pianist, Recital S, Recital Full Combo,
  Recital Pianist;
- 한 행보다 적은 구간, 일반적인 구간과 채보가 많은 구간;
- 비로그인, 여러 달성 상태가 섞인 로그인 사용자와 플레이 기록이 없는 로그인 사용자;
- Normal, Hard, Expert, Real 및 Real 1–3;
- 필터 없음, 필터 하나, 난이도/레벨 조합 필터;
- 긴 일본어 원문 제목, 긴 한국어 번역, 긴 영어 번역, 일본어 읽기와 번역 제목 없음;
- 모바일 간단히 보기 세 열, 간단히 보기 네 열과 자세히 보기 두 열 상태;
- 공개 목록 없음, 필터 결과 없음, 로딩, 교체 로딩, 요청 실패와 재시도 성공;
- 기본이 아닌 구간 끝부분 카드에서 악곡 상세로 직접 이동한 뒤 뒤로가기 복원; 그리고
- 모드·목표 여섯 Context 각각의 자격 있음·자격 없음 카드 유입. 악곡 상세가 Inline
  서열 카드 투표를 노출하지 않고 정확한 투표 범위를 복원하는지 확인.

## 브라우저 인수 계약

- `320 CSS px`에서 모든 control과 카드가 작동하고 의도하지 않은 가로 페이지 scroll
  또는 정보/기능 손실이 없다.
- 대표 `390px` 캔버스에서 간단히 보기 기본 세 열, 선택적 네 열과 자세히 보기 두 열이
  정사각형 jacket과 읽을 수 있는 점수를 보존한다.
- 적절한 tablet과 desktop 너비에서는 구간 탐색과 필터가 의미 또는 source 순서를 바꾸지
  않으면서 추가 공간을 사용한다.
- Basic/Recital, 목표, 구간, 필터, 보기 모드와 간단히 보기 밀도를 keyboard로 조작할 수
  있고 상태가 노출된다.
- 모바일 임시 필터 변경은 확정 전 결과를 바꾸지 않고, 데스크톱에서 보이는 필터는 즉시
  갱신된다.
- 비로그인 카드는 개인 placeholder 없이 직접 이동하고, 로그인 카드도 같은 목적지를
  사용하며 사실에 맞는 개인 정보만 더한다.
- 필수 콘텐츠가 hover에만 존재하지 않고, touch에서 정확한 악곡 난이도를 여는 데 한 번의
  activation만 필요하다.
- 뒤로가기는 전체 계획 control, 구간, 보기, 밀도와 실질적인 scroll 위치를 복원한다.
- 악곡 상세는 정확한 모드와 목표를 받고 서열·평가를 열며 범위별 투표 계약을
  강제하고 변경되지 않은 공식 서열 Context로 돌아옵니다.
- 긴 한국어, 일본어, 영어 콘텐츠가 겹치거나 control을 자르거나 jacket을 왜곡하거나
  고정 높이 실패를 만들지 않는다.
- 로딩, 빈 상태, 오류, 재시도와 공개 목록 없음 상태는 올바른 영역 안에 머물고 선택 조건을
  초기화하지 않는다.

## 레퍼런스 매트릭스

이 결정 집합은 하나의 제품이나 framework를 template처럼 사용하지 않고 폭넓게 비교했다.

| 출처                                                                                                                       | 전이 가능한 발견                                                                 | NosLog 적용                                                                   | 한계                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [현행 서열 경로](<../../app/(nevigation)/tiers/page.tsx>)                                                                  | 하나의 공개 경로가 모드, 목표, 안내, 필터와 공개 구간을 이미 조합한다.           | 확인된 기능을 유지하면서 긴 compact 셸을 교체한다.                            | 현재 표현은 시각 기준이 아니다.                                |
| [현행 서열 control](../../components/tiers/tierControls.tsx)                                                               | Query 기반 모드, 목표, 난이도와 레벨 상태가 이미 존재한다.                       | validation과 확정된 URL 의미를 재사용한다.                                    | 현재 모바일 필터는 매 클릭 적용되고 너무 오래 화면을 차지한다. |
| [현행 구간 browser](../../components/tiers/tierBandBrowser.tsx)                                                            | 구간 경계, 점진 요청, 지역 재시도와 목표 달성이 구현되어 있다.                   | 표현을 바꾸면서 데이터 경계를 보존한다.                                       | 쌓인 구간과 inline 기록 확장은 2.0에서 채택하지 않는다.        |
| [승인된 IA](./02-information-architecture.ko.md)                                                                           | 서열 계획은 독립적이며 정확한 악곡 상세로 직접 이어진다.                         | 페이지 과업과 직접 목적지를 안정적으로 유지한다.                              | 카드 geometry는 정의하지 않는다.                               |
| [승인된 악곡 상세 기획서](./05-music-detail-page-brief.ko.md)                                                              | 악곡과 선택 난이도가 안정적인 상세 목적지다.                                     | 모든 서열 카드가 정확한 direct link가 될 수 있다.                             | 상세 페이지 panel이 서열의 탐색 밀도를 결정하지 않는다.        |
| [현행 목표 판정](../../lib/tiers.ts)                                                                                       | S, Full Combo, Pianist 달성 조건에 명시적인 도메인 로직이 이미 있다.             | 진행 상태와 하위 투표 자격의 의미를 일치시킨다.                               | Recital에는 추가 참가 증빙이 필요하다.                         |
| [NOSTALGIA 공식 모드 안내](https://p.eagate.573.jp/game/nostalgia/op2/howto/entrance.html)                                 | Basic과 Recital은 서로 다른 플레이 모드다.                                       | 주요 맥락으로 유지한다.                                                       | 커뮤니티 서열 interface를 정의하지 않는다.                     |
| [ArcadeStat 서열 예시](https://arcadestat.app/en/pump/tier/s22)                                                            | 리듬게임 서열 제품은 정확한 채보 달성 뒤에만 투표를 허용할 수 있다.              | 자격 있는 투표를 정확한 채보 Context로 옮기는 근거다.                         | 공개 Layout과 자동 집계는 채택하지 않는다.                     |
| [NIST: 위치 통계량](https://itl.nist.gov/div898/handbook/eda/section3/eda351.htm)                                          | 중앙값은 극단적인 꼬리에 평균보다 덜 민감하다.                                   | 공식 구간을 바꾸지 않는 하위 공개 중앙값을 지지한다.                          | 서열 카드 콘텐츠는 정하지 않는다.                              |
| [Google SRE: On-call](https://sre.google/workbook/on-call/)                                                                | 사람의 검토 신호는 실행 가능하고 Signal이 높아야 한다.                           | 불일치를 카드가 아니라 관리자 Queue에 두는 근거다.                            | 신뢰성 Alert는 편집 서열 검토보다 긴급하다.                    |
| [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)                                  | 흔한 iPhone 중 여러 모델은 390pt지만 다른 여러 너비도 함께 존재한다.             | 390을 대표 캔버스로만 사용할 근거다.                                          | native point는 보편적 web breakpoint가 아니다.                 |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                | 실제 2차원 콘텐츠를 제외하고 320 CSS px에서 정보와 기능을 유지해야 한다.         | compact 최소 검증 경계를 정한다.                                              | 카드 열이나 art direction은 규정하지 않는다.                   |
| [web.dev: Responsive design basics](https://web.dev/articles/responsive-web-design-basics)                                 | 작은 화면에서 시작하고 기기명이 아니라 콘텐츠 필요에 따라 breakpoint를 추가한다. | 서열 전환을 콘텐츠 기반으로 만든다.                                           | 정확한 NosLog 경계는 specimen 검증이 필요하다.                 |
| [MDN: Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) | 유동 layout과 상대적 breakpoint가 모든 기기 범위를 지원한다.                     | 고정 390px application 셸을 채택하지 않는다.                                  | 일반 web 안내는 서열 밀도를 정하지 않는다.                     |
| [Android: Window size classes](https://developer.android.com/develop/ui/views/layout/use-window-size-classes)              | phone portrait는 600dp 미만의 넓은 compact 범위다.                               | 하나의 phone 너비가 전체 compact class를 대표할 수 없음을 확인한다.           | native dp class는 web의 보조 근거일 뿐이다.                    |
| [Microsoft Fluent: Layout](https://fluent2.microsoft.design/layout)                                                        | Small은 320–479 범위이며 반응형 layout은 reflow, resize, re-architect한다.       | 같은 정보를 가진 모바일 selector/데스크톱 rail 동작을 뒷받침한다.             | Fluent 시각 token은 NosLog token이 아니다.                     |
| [GitHub Primer: Layout](https://primer.style/product/getting-started/foundations/layout/)                                  | 좁은 layout은 다중 열 영역을 단순화하고 side pane을 sheet로 바꿀 수 있다.        | compact 구간/필터 trigger와 넓은 visible rail을 뒷받침한다.                   | GitHub의 작업 밀도는 리듬게임 planner와 다르다.                |
| [IBM Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)                                           | fluid grid는 320px small 경계에서 시작해 큰 경계에서 열을 늘린다.                | 검증된 최소 카드 너비와 데스크톱 열 추가를 뒷받침한다.                        | Carbon의 정확한 grid와 spacing을 채택하지 않는다.              |
| [Atlassian Grid](https://design-system-docs-proxy.services.atlassian.com/foundations/grid-beta)                            | 가장 작은 grid는 320–479px이며 범위마다 열, gutter와 margin을 바꾼다.            | 390 하나가 아닌 범위 기반 검증을 확인한다.                                    | enterprise grid 수가 서열 카드 수를 정하지 않는다.             |
| [USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)                                               | mobile-first flexible grid는 320px과 480px token을 명시하면서 설정을 허용한다.   | 유동 outer layout과 명시적인 compact 검증을 뒷받침한다.                       | 정부 콘텐츠 pattern은 서열 결과보다 이미지 밀도가 낮다.        |
| [Tailwind: Responsive design](https://tailwindcss.com/docs/responsive-design)                                              | base style은 mobile-first이며 breakpoint와 container query를 사용자화할 수 있다. | NosLog stack과 콘텐츠/container 기반 카드에 맞는다.                           | 기본 640px을 자동으로 NosLog breakpoint로 쓰지 않는다.         |
| [Bootstrap: Breakpoints](https://getbootstrap.com/docs/5.3/layout/breakpoints/)                                            | mobile base는 576px 미만이며 제공 범위는 모든 기기 목록이 아닌 토대다.           | 390이 보편 breakpoint가 아님을 다시 확인한다.                                 | NosLog는 Bootstrap을 사용하지 않는다.                          |
| [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/)                                                      | 작은 화면에서 시작하고 특정 기기를 가정하지 않는다.                              | 너비 전반에서 하나의 semantic 계층을 유지한다.                                | 서비스 form은 서열 결과보다 이미지 밀도가 낮다.                |
| [React Spectrum: Layout](https://react-spectrum.adobe.com/v3/layout.html)                                                  | 가장 작은 `base` 값 다음에 사용자화 가능한 mobile-first breakpoint가 온다.       | 마법 같은 모바일 너비 없이 base-first 동작을 뒷받침한다.                      | Spectrum component와 시각 언어를 채택하지 않는다.              |
| [W3C WCAG: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)          | hover/focus 콘텐츠는 접근 불가능하거나 pointer 전용이 되면 안 된다.              | 서열 카드 필수 정보를 항상 이용 가능하게 하고 touch를 직접 이동으로 유지한다. | 장식적 hover 피드백까지 모두 금지하지는 않는다.                |
| [Material Design: Cards](https://m3.material.io/components/cards/overview)                                                 | 카드 하나가 관련 object와 명확한 목적지를 묶을 수 있다.                          | 악곡 상세 전체 카드 link 하나를 뒷받침한다.                                   | Material 스타일과 elevation은 NosLog 방향이 아니다.            |
| [Fluent 2: Card usage](https://fluent2.microsoft.design/components/web/react/core/card/usage)                              | 카드 계층과 interaction은 입력 방식 전반에서 예측 가능해야 한다.                 | 로그인 여부와 무관하게 같은 카드 이동을 지원한다.                             | Fluent 카드 anatomy를 복사하지 않는다.                         |
| [osu! beatmap listing](https://osu.ppy.sh/beatmapsets)                                                                     | 리듬게임 탐색은 채보 정체성, 난이도 맥락, 필터와 상세 직접 이동을 유지한다.      | 빠른 채보-상세 계획의 도메인 가치를 확인한다.                                 | osu! grouping과 scoring은 NOSTALGIA에 일대일 대응하지 않는다.  |

### 근거의 수렴

- 권위 있는 반응형 지침은 하나의 표준 모바일 너비가 아니라 유동적이고 범위 기반이며
  콘텐츠가 결정하는 적응으로 수렴한다.
- 흔한 현행 기기 때문에 `390px`은 대표 phone 캔버스로 타당하지만, 최소 Reflow
  요구사항으로는 `320 CSS px`이 더 강한 근거다.
- 일반 카드와 리듬게임 레퍼런스는 안정적인 정체성과 명확한 목적지 하나로 수렴하며,
  서열 결과에 의무적인 중간 modal을 지지하지 않는다.
- 반응형 시스템은 좁은 너비에서 보조 선택을 compact disclosure로 옮기고, 공간이 생기면
  콘텐츠 옆에 노출하는 방향으로 수렴한다.
- 어느 출처도 NosLog의 정확한 모드/목표 의미, 달성 경계, 레이팅 정책 또는 카드 정보를
  정하지 않는다. 이것들은 검증된 NOSTALGIA 데이터, 현행 NosLog 로직과 명시적인 사용자
  결정에서 나온다.
- 투표 근거는 자격, 범위가 있는 Context, 견고한 집계와 사람의 검토로 수렴합니다. 공식
  계획 목록을 대체하거나 영구 카드 Control을 더 추가할 근거는 제공하지 않습니다.

## 거절되거나 대체된 대안

- **390px을 표준 또는 고정 셸로 취급 — Rejected:** 대표 캔버스일 뿐이며 320px Reflow와
  중간 너비 검증이 필요하다.
- **Basic과 Recital을 목표와 같은 Select에 배치 — Rejected:** 주요 NOSTALGIA 모드
  맥락을 숨긴다.
- **여섯 모드-목표 버튼을 항상 표시 — Rejected:** 불필요한 control 밀도를 만든다.
- **모든 구간을 하나의 긴 문서에 쌓기 — Superseded:** 모바일은 구간 하나를 선택하고
  데스크톱은 인접 navigator를 노출한다.
- **모바일 필터 toggle을 모두 즉시 적용 — Superseded:** 모바일은 stage 후 명시적으로
  확정하고 데스크톱은 즉시 적용한다.
- **개인 클리어 상태, JUST, 노트 유형 비율 또는 MISS를 서열 필터로 사용 — Rejected:**
  승인된 서열 계획 질문에 기여하지 않는다.
- **밀도 높은 카드 형식 하나만 유지 — Rejected:** 빠른 탐색과 자세한 비교는 서로 다른
  사용자 요구다.
- **모든 모바일 카드에 두 열 사용 — 간단히 보기에서 Rejected:** 자세히 보기는 두 열,
  간단히 보기는 대표 너비에서 기본 세 열 및 선택적 네 열을 쓴다.
- **`도전 중`을 표시하거나 `진행 중`을 추론 — Rejected:** 승인된 도메인 규칙이 그
  상태를 정의하지 않는다.
- **카드에 상위 70곡 반영/미반영 표시 — Rejected:** 계산 메커니즘을 영구적인 소음으로
  노출한다.
- **서열 grid 안에서 기록 분석 확장 — Superseded:** 카드는 정확한 악곡 상세로 직접
  이동한다.
- **악곡 상세 전에 modal 열기 — Rejected:** 한 단계를 늘리고 목적지 정보를 중복한다.
- **필수 데이터를 hover에서만 제공 — Rejected:** touch와 keyboard도 같은 필수 정보를
  받아야 한다.
- **하나의 데스크톱 열 수 고정 — Rejected:** 카드 최소 너비와 container 공간이
  데스크톱 밀도를 결정한다.
- **각 서열 카드 안에서 직접 투표 — Rejected:** 빠른 탐색 목록을 과도하게 만들고
  정확한 악곡 상세 평가 Context를 우회합니다.
- **커뮤니티 중앙값으로 공식 구간 재정렬 — Rejected:** 투표는 참고 근거이며 명시적인
  관리자 검토와 일반 배치 이력이 필요합니다.

## 결정 기록

| ID      | 결정                                                                         | 상태       |
| ------- | ---------------------------------------------------------------------------- | ---------- |
| TIER-01 | 서열은 독립적인 플레이 계획 페이지 계열로 유지한다                           | `Approved` |
| TIER-02 | Basic/Recital을 항상 보이는 주요 모드 버튼으로 유지한다                      | `Approved` |
| TIER-03 | S/Full Combo/Pianist는 목표 selector 하나를 사용한다                         | `Approved` |
| TIER-04 | 부차적인 계산 안내 disclosure 하나를 유지한다                                | `Approved` |
| TIER-05 | 모바일은 구간 하나를 선택하고 데스크톱은 인접한 visible navigator를 사용한다 | `Approved` |
| TIER-06 | 진행 상태는 현재 모드, 목표, 확정 필터와 인증된 기록을 기준으로 한다         | `Approved` |
| TIER-07 | 필터는 난이도와 공식 레벨만 사용한다                                         | `Approved` |
| TIER-08 | 모바일은 필터를 stage하고 결과 action으로 확정하며 데스크톱은 즉시 적용한다  | `Approved` |
| TIER-09 | 간단히 보기가 기본이며 390px에서 세 열과 선택적 네 열 밀도를 사용한다        | `Approved` |
| TIER-10 | 자세히 보기는 390px에서 두 열과 승인된 정체성/지표 순서를 사용한다           | `Approved` |
| TIER-11 | 실제 S/FC/Pianist만 표시하고 추론한 도전 상태를 사용하지 않는다              | `Approved` |
| TIER-12 | 채보별 공식 Grd는 자세한 맥락이며 NosLog 기여도는 Basic Pianist에만 표시한다 | `Approved` |
| TIER-13 | 상위 70곡 반영 또는 계산 디버그 badge를 노출하지 않는다                      | `Rejected` |
| TIER-14 | 로그인 여부와 관계없이 카드 전체가 정확한 악곡 상세를 직접 연다              | `Approved` |
| TIER-15 | 뒤로가기는 계획 control, 구간, 보기, 밀도와 scroll 맥락을 복원한다           | `Approved` |
| TIER-16 | 필수 hover 전용 콘텐츠 또는 모바일 첫 tap 미리보기를 사용하지 않는다         | `Approved` |
| TIER-17 | 390px은 대표 캔버스이며 표준, breakpoint 또는 고정 너비가 아니다             | `Approved` |
| TIER-18 | 320 CSS px Reflow와 콘텐츠 기반 전환을 요구한다                              | `Approved` |
| TIER-19 | 데스크톱 카드 열 수는 하나의 고정 수가 아니라 container가 결정한다           | `Approved` |
| TIER-20 | 서열 모드와 목표는 서로 독립된 커뮤니티 투표 범위 여섯 개에 일대일 대응한다  | `Approved` |
| TIER-21 | 카드는 유입 모드·목표를 보존한 정확한 악곡 상세 서열·평가를 연다             | `Approved` |
| TIER-22 | 투표와 분포를 서열 카드에서 제외하고 정확한 악곡 상세가 기여를 소유한다      | `Approved` |
| TIER-23 | 커뮤니티 중앙값은 공개된 공식 서열 콘텐츠를 자동 대체·재정렬하지 않는다      | `Approved` |

## 전달 경계

Claude Design은 Foundation 승인 후 최종 타이포그래피, 색상, 간격, surface 계층,
아이콘, jacket overlay 처리, 최소 카드 너비와 정확한 전환 지점을 결정할 수 있다. 위의
결정과 인수 계약은 반드시 보존해야 한다. 이후 Codex 구현 세션은 Claude 결과를 이
기획서와 비교하고, 필수 상태를 제거하거나 도메인 의미를 바꾸거나 의무 modal을 만들거나
제품을 390px에 고정하거나 승인된 반응형 동작과 충돌한다면 가이드 또는 디자인 수정을
요청해야 한다.
또한 공식·커뮤니티 경계를 보존해야 합니다. 서열 카드 Inline 투표와 커뮤니티 기반
자동 재정렬을 사용하지 않고 서열·평가를 열 때 정확한 모드·목표 Context를 유지합니다.
