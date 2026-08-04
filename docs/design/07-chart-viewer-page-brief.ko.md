# NosLog 2.0 채보 뷰어 페이지 기획서

## 문서 관리

- 상태: `Approved`
- 결정 상태: `집중형 뷰어 핵심 계약 승인: 진입 및 복귀, 공개 및 관리자 정체성,
낙하형과 전체 채보 모드, URL 및 재생 상태, 컨트롤, 전체 화면, 기능 감지 기반
Fallback, 실패 복구, 반응형 구성, 접근성, 다국어 및 브라우저 승인 기준`
- 근거 상태: `저장소 조사, 현재 브라우저 근거, 승인된 정보 구조, 승인된 악곡 상세
계약, 인용한 음악 Player 및 리듬게임 비교 사례, Rendering Platform 문서,
반응형 지침, 접근성 표준 및 사용자 승인 결정 기록`
- 작성 시작일: 2026-08-02
- 최종 결정 갱신일: 2026-08-03
- 기준 언어: 영어
- 영어 기준 문서:
  [07-chart-viewer-page-brief.md](./07-chart-viewer-page-brief.md)
- 상위 정보 구조:
  [02-information-architecture.ko.md](./02-information-architecture.ko.md)
- 상위 진입 및 복귀 계약:
  [05-music-detail-page-brief.ko.md](./05-music-detail-page-brief.ko.md)
- Recital 강약 Future Work:
  [11-exam-page-brief.ko.md#future-work-recital-채보-작성-및-보기](./11-exam-page-brief.ko.md#future-work-recital-채보-작성-및-보기)
- 범위: 공개된 NosLog 채보 하나를 위한 다국어 공개 집중형 뷰어와, 명시한 경우의
  동등한 관리자 미리보기 Shell
- 제외 범위: PixiJS Renderer 또는 채보 Timing Engine 재작성, 채보 Editor 재설계,
  최종 Foundation Token, 최종 하이파이 구성 및 이번 디자인 가이드 세션에서의
  프로덕션 구현

승인된 2.0 Renderer와 채보 데이터 계약은 Basic 전용입니다. 강한·약한 건반 압력을
나타내는 Recital 파란색·빨간색 배경 강약은 별도로 승인된 Future Work이며 Claude
Design과 구현은 현재 뷰어가 이미 해당 강약을 기록·Render하는 것처럼 표현하면 안 됩니다.

## 결정 상태 표기

- **Observed:** 저장소, 현재 브라우저 근거 또는 승인된 상위 산출물에서 확인된 사실.
- **Approved:** 사용자가 명시적으로 동의했으며 하위 디자인에 구속력을 갖는 결정.
- **Proposed:** 근거를 갖췄으나 사용자 승인을 기다리는 방향.
- **Open:** 추가 조사, 검증 또는 사용자 결정이 필요한 항목.
- **Rejected:** 검토했으나 명시적으로 채택하지 않은 항목.
- **Superseded:** 이후 승인된 방향으로 대체된 항목.

이 기획서는 승인된 채보 뷰어 페이지 동작, 정보 계층, Fallback 및 반응형 계약의
기준 문서다. 정확한 타이포그래피, 색상, 간격, 반경, 아이콘 형태, 컨트롤 치수,
Renderer 최대 너비 및 최종 콘텐츠 기반 전환값은 Foundation과 이후 Claude Design
작업에 남긴다. 이후 결정은 표현을 다듬을 수 있지만 승인된 제품 계약을 제거하거나
다르게 해석해서는 안 된다.

## 목적

채보 뷰어는 하나의 핵심 질문에 답한다.

> 이 정확한 NOSTALGIA 채보의 노트는 어떻게 움직이고, 어떤 Timing과 손 배정을
> 갖는가?

이는 채보 읽기와 재생에 집중한 작업 공간이다. 플레이 가능한 점수 게임, 두 번째 악곡
상세 페이지, Editor, 일반 Media Player 또는 별도의 채보 Catalog가 아니다. 사용자는
낙하형 Animation을 확인하고, 4마디 열 단위의 전체 채보를 살펴보고, 선택적으로 로컬
음원을 맞춘 다음 자신의 위치를 잃지 않고 정확한 악곡 Context로 돌아갈 수 있다.

## 주요 사용 맥락과 성공 조건

- **Approved upstream:** 뷰어는 하나의 악곡과 선택 난이도에 속하는 하위 목적지다.
  공용 탐색에서 채보 범위를 선택한 경우에도 접근할 수 있으나, 탐색은 진입 전에 정확한
  공개 난이도를 결정해야 한다.
- **Approved:** 오락실 플레이 전후의 모바일 사용이 주요 Context다. 데스크톱도
  필수이며 채보 확인에 추가 너비와 높이를 의도적으로 사용한다.
- **Approved:** 사용자가 낙하형 또는 전체 채보에서 노트 Timing, 경로, 손, 건반 동작을
  이해하고 정확한 악곡 및 난이도 Context로 복귀하면 방문이 성공한다.
- **Approved:** 공개 뷰어는 인증을 요구하지 않는다. 비로그인 사용자가 채보 오류 제보
  Action을 의도적으로 시작할 때만 인증을 요구한다.
- **Approved:** 사용자가 선택한 음원은 브라우저 로컬에만 남고 NosLog Server에
  Upload 또는 저장되거나, 제보에 첨부되거나, 파일 이름으로 노출되지 않는다.
- **Approved:** 현재 시각 Styling과 고정 Pixel Geometry는 감사 근거일 뿐 NosLog 2.0
  시각 기준이 아니다.

## 현행 제품 근거

### 관찰한 Route와 공개 데이터

- 공개 Route는 `/[locale]/music/[index]/[difficulty]/pattern`에서 하나의 악곡 Index와
  대소문자를 구분하지 않는 난이도를 결정한다.
- Server는 `publishedRevision`이 null이 아니며 유효한 `publishedContent` 문서인 경우만
  노출한다. 현재는 없거나 비공개이거나 Schema가 유효하지 않은 콘텐츠가 Not Found가
  된다.
- 공개 Payload는 원문 제목, 아티스트, 난이도, 공식 레벨, 재킷, 노트 수, 재생 시간
  및 공개 Revision을 포함한다.
- 현재 명시적 복귀 Target은 같은 Locale의 동일 악곡과 난이도다. 승인된 상위 계약은
  알려진 출처 콘텐츠 영역이 있으면 그 영역도 복원하도록 요구한다.
- 관리자 미리보기는 같은 Viewer Component를 사용하되, 공개 Snapshot이 아니라
  미리보기 정체성과 저장 Revision을 사용한다.

### 관찰한 보기 및 재생 구현

- `ChartSheetViewer`가 로컬 `falling | sheet` 모드를 소유한다. 현재 기본값은 낙하형이며
  선택 상태를 URL에 노출하지 않는다.
- 현재 Safari User Agent 검사는 Renderer 초기화를 시도하기 전에 전체 채보를 강제하고
  낙하형을 비활성화한다.
- 낙하형에서 다른 보기로 전환하면 `FallingChartViewer`가 Unmount된다. 따라서 현재
  시간, 선택한 로컬 음원, 재생 속도 및 메트로놈 활성 상태가 Reset된다.
- 메트로놈 음량과 엄밀한 연주는 별도로 브라우저 Local Storage에 저장된다.
- 낙하형 재생은 재생/일시정지, 재시작, 탐색과 시간, 로컬 음원, 노트 속도,
  메트로놈과 음량 및 엄밀한 연주를 제공한다.
- 현재는 전체 화면 Control, Player 범위 Keyboard Shortcut 계약, Shortcut 도움말 또는
  Renderer 초기화 오류 Surface가 없다.
- 현재 Rendering Canvas는 `role="img"`를 사용하고 재생 시간에 따라 접근 가능한 이름을
  바꾼다. 전체 채보는 Focus 가능한 가로 Scroll 영역과 4마디 열마다 하나의 Canvas
  Image를 제공한다.

### 보존해야 할 관찰된 채보 의미

- 채보는 `28` Lane으로 구성되며 왼손과 오른손 안내를 구분한다.
- 일반 및 테누토 노트는 노트 폭과 지속 시간을 사용하고, 글리산도는 경로를 따르며,
  트릴은 저장된 간격으로 승인된 두 Lane을 번갈아 사용하고 채보에 간격이 없을 때만
  승인된 기본 간격을 사용한다.
- 엄밀한 연주는 기본값이 아닌 선택 기능이다. 일반 및 테누토는 대표 Lane 하나만
  밝히며, 짝수 폭은 왼손 노트에서 오른쪽 쪽, 오른손 노트에서 왼쪽 쪽으로 치우친
  Lane을 선택한다. 글리산도는 전체 경로 폭을 계속 밝히고, 트릴은 승인된 두 대표
  Lane을 계속 번갈아 누른다.
- 전체 채보는 Timing Point에서 실제 마디를 계산하고, 마지막으로 보이는 4마디 열을
  완성하며, 마디 번호와 BPM 또는 박자표 변경을 표시한다.
- 이는 보존할 제품 및 도메인 동작이다. 이 페이지 기획서는 재생 수학이나 Canvas
  Drawing Style을 다시 논의하지 않는다.

### 관찰한 반응형 및 브라우저 근거

- `390×844`에서 현행 낙하형 Renderer는 문서 단위 가로 Overflow 없이 Reflow하지만,
  Transport와 보조 Control은 초기 Viewport 아래에서 시작한다.
- `320×720`에서 Renderer 너비는 올바르게 줄어들지만 Control Group이 줄바꿈되며,
  사용자는 필수 재생 Action을 찾기 위해 Scroll해야 한다.
- `1440×900`에서 충분한 가로 공간이 있어도 현행 Renderer가 가용 높이를 거의 모두
  차지해 주요 재생 Control이 Viewport 끝이나 아래에 놓인다.
- `390px`에서 전체 채보는 올바르게 가로 Scroll이 필요하다. 고유 콘텐츠 너비가
  Viewport보다 훨씬 넓다. `1440px`에서는 문서 단위 가로 Overflow 없이 여러 열이
  맞는다.
- 현재 뷰어는 일반 Application Shell 위에 Mount되므로 `main` Landmark가 두 개다.
- 현행 Tab은 `tablist`, `tab`, `aria-selected`를 노출하지만 Tab과 `tabpanel`을 연결하지
  않고 승인된 수동 Keyboard 활성화 모델도 구현하지 않는다.
- 테스트한 In-app Browser는 Fullscreen API를 노출하지 않았다. 이는 유효한 기능 상태며
  페이지 실패 이유가 아니다.
- 테스트한 공개 관리자 미리보기에서 Browser Console 오류는 발견되지 않았다. Runtime
  실패 경로는 반증된 것이 아니라 아직 구현되지 않았다.

## 승인된 범위와 불변 조건

- **낙하형**과 **전체 채보** 두 의미 보기를 유지한다.
- 이 페이지 기획서에서 승인된 PixiJS 낙하형 Renderer, 피아노, 노트 Ribbon, 노트 종류
  동작 또는 전체 채보 Drawing Engine을 재작성, 교체 또는 시각적으로 재설계하지 않는다.
- 해당 Renderer 주변의 집중형 Shell, 진입 및 복귀, 보기 상태, Control 계층, 전체 화면,
  반응형 크기, 의미 구조 및 복구를 개선한다.
- 점수, 판정 입력, 플레이 가능한 게임 결과, 외부 채보 또는 Server 음원을 추가하지
  않는다.
- 집중형 뷰어 안에 일반 NosLog Header, 더보기 Panel, Footer 또는 지속 전역
  내비게이션을 추가하지 않는다.
- 전체 채보를 낙하형 전체 화면 Variant로 바꾸거나 두 Renderer를 하나의 모호한 모드로
  합치지 않는다.

## 진입, Deep Link 및 복귀 계약

### 진입

- 악곡 상세는 유효한 NosLog 공개 채보가 있을 때만 선택 난이도의 뷰어를 연다.
- 홈과 더보기의 채보 뷰어 진입은 공용 탐색을 채보 범위로 연다. 사용자는 이 Route에
  들어오기 전에 공개 난이도를 선택한다.
- 공유 또는 직접 뷰어 URL은 유효한 경우 Locale, 악곡 Index, 난이도 및 요청 보기를
  결정해야 한다.
- 필요한 Renderer 기능이 초기화되면 기본 보기는 낙하형이다. 전체 채보는 별도 Catalog
  목적지가 아니라 결정적인 Fallback이다.

### 복귀

- 집중형 Header에 명시적인 뒤로가기 Action 하나를 제공한다.
- 진입에 알려진 악곡 상세 출처가 있으면 뒤로가기는 정확한 Locale, 악곡, 난이도,
  콘텐츠 영역, 유효한 영역 상태 및 실용적인 Scroll Context를 복원한다.
- Browser Back과 보이는 뒤로가기 Action은 서로 경쟁하는 두 복귀 모델을 만들지 않고
  같은 결과를 제공해야 한다.
- 출처 상태가 없는 직접 또는 공유 뷰어 진입은 선택 난이도의 기본 채보 정보 영역으로
  돌아간다. 이전 개인 영역을 추측해서는 안 된다.
- 뷰어를 떠나면 재생을 일시정지한다. 악곡 상세로 복귀할 때 음원이나 Animation을
  자동으로 시작하지 않는다.

## 승인된 집중형 Shell 계층

하나의 의미 `main`과 다음 모바일 우선 Source 순서를 사용한다.

1. 명시적인 뒤로가기 Action과 간결한 채보 정체성
2. 낙하형과 전체 채보 보기 Tab
3. 유용한 경우에만 보이는 활성 보기 도움말 또는 상태
4. 손 범례와 간결한 채보 요약
5. 활성 Renderer 또는 해당 영역 상태
6. 낙하형에서 Renderer에 붙은 핵심 Transport
7. 낙하형 빠른 Control과 상세 설정 진입
8. 낮은 강조의 채보 오류 제보 Action

넓은 Layout은 채보 정체성, Tab, Renderer 및 Control을 다르게 정렬할 수 있으나 이 의미
순서와 같은 집중 과업을 보존해야 한다. Shell을 두 번째 악곡 상세 Dashboard로 만들지
않는다.

## 집중형 Header 및 채보 오류 제보

### 공개 정체성

방향 파악에 필요한 정보만 보여준다.

- 뒤로가기
- 원문 악곡 제목
- 아티스트
- 난이도와 공식 레벨
- 노트 수와 채보 재생 시간
- 낮은 강조의 채보 오류 제보 Action 하나

공개 Revision을 일반적으로 보이는 Metadata로 노출하지 않는다. 집중형 Header에 재킷,
카테고리, 랭킹, 개인 기록, 서열 배치 또는 플레이 영상 Action을 추가하지 않는다.

### 관리자 미리보기 정체성

- **관리자 초안 미리보기** 정체성을 명확하게 보인다.
- 미리보기에서는 운영상 의미가 있으므로 저장 Revision을 표시한다.
- 관리자 미리보기가 이미 공개된 채보처럼 보이게 만들지 않는다.
- 미리보기가 대표성을 유지하도록 그 외에는 같은 Viewer 동작과 반응형 계약을 보존한다.

### 채보 오류 제보

- 두 번째 제보 System을 만들지 않고 기존 피드백·오류 제보 Dialog를 재사용한다.
- 채보 정체성, 난이도, 활성 보기, 현재 재생 시간, Snapshot 또는 저장 Revision, Page URL,
  존재하는 경우 Renderer 또는 전체 화면 실패 분류를 자동으로 첨부한다.
- 로컬 음원 File, File Byte, File 이름, 로컬 Path, Browser Media Metadata 또는 다른
  비공개 브라우저 선택값을 절대로 첨부하지 않는다.
- 비로그인 사용자가 Action을 실행하면 승인된 간결한 로그인 필요 흐름과 뷰어로 정확히
  돌아오는 안전한 복귀를 제공한다.
- 재생 Control과 경쟁하지 않으면서 두 보기 모두에서 Action을 사용할 수 있게 한다.

## 보기 전환, URL 상태 및 복원

- 낙하형과 전체 채보를 연결된 Tab 및 Panel을 가진 접근 가능한 Tab Set으로 구현한다.
- 낙하형 초기화와 보기 교체에는 의미 있는 지연이 생길 수 있으므로 수동 Keyboard
  활성화를 사용한다. 화살표 Key로 Focus를 이동하고 Enter 또는 Space로 활성화한다.
- 공유 가능한 `view=falling|sheet` 상태를 Encode한다. 일반 Tab 변경에서는 현재 History
  Entry를 교체해 반복 비교가 Browser Back을 모든 보기 전환으로 채우지 않게 한다.
- 유효하지 않거나 생략된 보기 값은 기능 초기화 성공을 전제로 낙하형으로 결정한다.
- 보기 전환은 재생을 일시정지하지만 현재 시간, 선택한 로컬 음원, 노트 속도,
  메트로놈 상태와 음량, 엄밀한 연주 및 다른 유효한 Viewer Session 설정을 보존한다.
- 전체 채보에서 낙하형으로 돌아오면 보존된 위치를 일시정지 상태로 복원한다. 자동으로
  재생하지 않는다.
- 전체 화면 진입 및 종료는 같은 상태를 보존하며 Route History를 만들지 않는다.
- Reload는 공유 가능한 보기 선택과 저장된 사용자 설정을 복원할 수 있다. Browser가
  더 이상 권한을 주지 않는 로컬 음원 File까지 복원할 필요는 없다.

## 낙하형 뷰어 계약

### Renderer

- 승인된 투영 28 Lane 피아노, 판정선, 노트 Ribbon, 손 색상, 노트 종류 경로 및 반응형
  시각 두께 Logic을 유지한다.
- 실제 가용 Inline 및 Block 공간으로 Renderer 크기를 정한다. 너비 전용 Breakpoint
  하나를 사용하거나 넓은 Desktop 전체로 장면을 무한히 늘리지 않는다.
- Loading, 전체 화면 전환 또는 Resize 중에도 안정적인 Drawing Surface를 유지한다.
- Tab 가시성 상실, Renderer Context 상실, Route 이탈 및 보기 전환 시 일시정지한다.
  새로운 사용자 Action 없이 재생을 재개하지 않는다.

### 항상 보이는 핵심 Transport

다음 Control을 Renderer 바로 아래에 시각적으로 붙여 유지한다.

1. 재생/일시정지
2. 재시작
3. 탐색 Slider
4. 현재 및 전체 시간
5. 지원되는 경우 전체 화면 진입 또는 종료
6. 재생 설정 진입

핵심 Transport는 일반 및 전체 화면 모드에서 계속 보인다. 감상용 Video Overlay처럼
자동으로 숨기지 않으며, 피아노, 판정선, 노트 또는 Keyboard Focus 요소를 가려서는 안
된다.

### 빠른 Control

다음 고빈도 Control은 상세 설정을 열지 않고 바로 사용할 수 있게 한다.

- 노트 속도
- 메트로놈 켜기/끄기

제약된 너비에서 핵심 Transport 주변으로 Reflow할 수 있으나 의미와 상태를 즉시 알아볼
수 있어야 한다.

### 상세 설정

다음을 하나의 재생 설정 Surface에 둔다.

- 브라우저 로컬 음원 선택 및 교체
- 메트로놈 음량
- 엄밀한 연주 켜기/끄기
- Keyboard Shortcut 도움말

Compact Layout에서는 사용자가 여는 제약된 설정 Panel을 사용한다. 넓은 Layout에서는
연결된 Popover 또는 작은 인접 Panel을 사용한다. 닫으면 Focus를 설정 Trigger로
돌려보내고 값을 Reset하지 않는다.

### 로컬 음원

- 음원 없는 재생을 완전히 지원한다.
- 음원 선택은 명시적인 사용자 Action이며 그 자체로 재생을 시작하지 않는다.
- 선택한 File은 브라우저 Memory에만 남고 NosLog로 전송되지 않는다.
- 교체 또는 Decode 실패는 설정 안에 표시하되 채보 단독 재생은 계속 사용할 수 있다.
- Route를 떠날 때 Object URL과 Media Resource를 적절히 해제한다.

### Player 범위 Keyboard Shortcut

집중형 뷰어가 활성 상태일 때 다음 승인 Set을 사용한다.

| Key          | Action                                     |
| ------------ | ------------------------------------------ |
| `Space`      | 재생 또는 일시정지                         |
| `Home`       | 처음부터 재시작                            |
| `ArrowLeft`  | `5`초 뒤로 탐색                            |
| `ArrowRight` | `5`초 앞으로 탐색                          |
| `F`          | 지원되는 경우 전체 화면 진입 또는 종료     |
| `Escape`     | 전체 화면 종료 또는 열린 하위 Surface 닫기 |
| `?`          | Keyboard Shortcut 도움말 열기              |

- Focus가 Input, Textarea, Select, Content-editable 요소, Range Slider 또는 해당 Key를
  소유하는 다른 Control 안에 있을 때 Shortcut을 가로채지 않는다.
- Shortcut을 Action을 수행하는 유일한 방법으로 만들지 않는다.
- Shortcut 도움말은 다국어 Command 이름과 정확한 Key를 노출한다.

## 전체 화면 계약

- 전체 화면은 낙하형 Player Unit, 즉 Renderer와 필수 Control에만 적용한다. Page Shell
  전체나 전체 채보를 전체 화면으로 만들지 않는다.
- 진입 및 종료 중 현재 시간, 로컬 음원, 재생 상태, 속도, 메트로놈 설정 및 엄밀한 연주를
  보존한다.
- 판정선이나 피아노 위에 겹치지 않는 전용 하단 영역에 Transport를 유지한다.
- 필수 Control을 계속 보이며 비활동 뒤 자동으로 숨기지 않는다.
- 명시적인 종료 Control을 제공하고 Browser 관례에 따라 `Escape`를 지원한다.
- 가로 방향을 요청하거나 강제하지 않는다. 세로와 가로 모두 조작 가능하며 사용자의
  운영체제 방향 잠금을 존중한다.
- Fullscreen API를 사용할 수 없으면 Control을 생략한다. 고장난 기능처럼 보이는 비활성
  Button을 보여주지 않는다.
- 전체 화면 요청이 거절되면 현재 뷰어를 계속 사용할 수 있게 유지하고 시작 Control
  가까이에 간결한 상태 하나를 노출한다. Reset하거나 다른 곳으로 이동하지 않는다.

## 전체 채보 계약

- 실제 BPM과 박자표 계산 및 논리 열마다 정확히 실제 4마디를 유지한다.
- 노트가 더 뒤로 늘어날 때 현행 승인된 Timing 규칙에 따라 마지막으로 보이는 열을
  완성한다.
- 마디 번호, BPM 및 박자표 변경, 간결한 열 범위, Lane Grid, 노트 종류, 손 색상 및
  왼손/오른손 Text 범례를 유지한다.
- 열이나 Timing 변경을 식별하는 데 도움이 되지 않는 중복 또는 장식 Timing 문구는
  제거한다.
- 채보를 실제 2차원 콘텐츠로 취급한다. 가로 Scroll은 라벨이 있는 전체 채보 영역
  안에서만 허용하며 Page 단위로 만들지 않는다.
- Compact 너비에서는 한 열을 읽을 수 있게 유지하고 가로로 뒤 열을 탐색하게 한다. 열
  시작점에 선택적인 `proximity` Snap을 사용하되 Mandatory Snap을 사용하거나 정밀한
  자유 Scroll을 막지 않는다.
- 넓은 Layout에서는 맞는 만큼의 완전하고 읽을 수 있는 열을 보여준다. 긴 곡 전체를
  노트, Border 또는 Timing Label이 읽히지 않을 때까지 축소하지 않는다.
- 기본 Touch, Trackpad, Mouse-wheel/Shift 및 Keyboard Scroll을 조작할 수 있게 한다.
  작은 이전/다음 Target을 유일한 내비게이션으로 Scroll을 대체하지 않는다.
- Scroll 영역에 접근 가능한 이름을 준다. 각 열에는 Canvas Pixel을 읽지 않아도 되는
  구조화된 시작·종료 정보와 4마디 범위를 제공한다.

## 브라우저 기능 및 Rendering Fallback

- Safari와 다른 지원 Browser에서 낙하형을 시도한다. Safari User Agent 일괄 차단을
  제거한다.
- Browser Brand나 User Agent 문자열이 아니라 필요한 기능 가용성과 실제 PixiJS/WebGL
  초기화로 기능을 결정한다.
- PixiJS WebGL을 승인된 프로덕션 Renderer로 유지한다. 이 기획서는 WebGPU 전환이나
  실험적인 Canvas Fallback을 요구하지 않는다.
- 비동기 Application 초기화, Renderer 생성 실패, `webglcontextlost`, 안전한 경우의
  복원 및 복구 불가능한 Context 상실을 처리한다.
- 초기화 또는 복구 불가능한 Rendering 실패 시 다음 순서를 따른다.
    1. 재생 일시정지
    2. 가능한 경우 현재 시간과 설정 보존
    3. 전체 채보 활성화
    4. 간결한 Viewer 범위 실패 메시지 하나 표시
    5. 다시 시도 Action 하나 제공
- 다시 시도는 낙하형 Renderer만 대상으로 한다. 악곡 정체성, 보기 설정, 로컬 음원
  선택 또는 전체 채보 Scroll Context를 불필요하게 Reset해서는 안 된다.
- 전체 화면을 사용할 수 없어도 전체 채보는 기능적인 Fallback으로 남는다.
- 일반 UI에 WebGL 오류 Code, Stack Trace, GPU 이름 또는 Browser 교체를 요구하는 일반
  안내를 노출하지 않는다.

## Loading, 빈 상태, 오류, 권한 및 비활성 상태

- **Renderer 확인/Loading:** 중립적이고 안정적인 Viewer Surface와 간결한 Loading
  상태를 유지한다. Geometry를 움직이지 않고 준비 전까지 Renderer 의존 Control을
  비활성화한다.
- **노트 없음:** 정체성과 Tab을 유지한 다음 활성 콘텐츠 영역에 **표시할 노트가
  없습니다**와 동등한 간결한 다국어 상태를 보여준다.
- **낙하형 초기화 실패:** 전체 채보를 활성화하고 간결한 실패와 다시 시도를 제공하며
  사용할 수 있는 상태를 보존한다.
- **Runtime Context 상실:** 일시정지하고 안전한 복원을 시도하며, 불가능하면 같은 전체
  채보 Fallback을 사용한다. 멈춘 Renderer와 재생 시간을 계속 진행하지 않는다.
- **로컬 음원 실패:** 채보 단독 재생을 계속 사용할 수 있게 하고 로컬 음원 설정 가까이에
  오류를 보여준다.
- **전체 화면 미지원:** 전체 화면 진입을 생략한다.
- **전체 화면 요청 실패:** 현재 보기에 남고 Action 가까이에 간결한 상태를 표시한다.
- **비공개, 유효하지 않음, 제거 또는 오래된 직접 Link:** 집중형 다국어 부재 상태
  **공개된 채보가 없습니다**와 동등한 문구 및 정확한 악곡 난이도로 돌아가는 Action
  하나를 사용한다. 그 아래로 일반 Shell을 노출하지 않는다.
- **제보 비로그인:** 공개 뷰어를 보존하고 제보 Action에만 로그인 필요를 보여준다.
  채보를 교체하거나 가리지 않는다.
- **제보 제출 실패:** 입력한 제보 Text와 첨부 Metadata를 보존하고 범위가 제한된 다시
  시도를 보여주며 재생은 독립적으로 계속 사용할 수 있게 한다.
- **관리자 저장 전 변경:** 미리보기는 저장 Revision을 계속 식별한다. Editor 전용 저장
  전 변경 처리는 Editor 계약에 속한다.

어떤 상태도 음원 Upload, 기술 진단 Code 입력 또는 Browser 교체를 주요 복구로 권하지
않는다.

## 반응형 계약

### Compact Layout

- `390px`은 대표 모바일 검토 Canvas일 뿐 고정 Application 너비, 표준, Breakpoint 또는
  최소값이 아니다.
- `320 CSS px`와 중간 Compact 너비에서 완전한 Reflow를 확인한다.
- `390×844`와 `320×720`에서 간결한 채보 정체성, 보기 전환, Renderer 및 핵심 Transport를
  초기 집중 구성에서 사용할 수 있어야 하며, 재생을 찾기 위해 Renderer 아래를 Scroll할
  필요가 없어야 한다.
- Renderer 또는 핵심 Transport를 사용할 수 없을 정도로 줄이기 전에 보조 Header 설명을
  압축하거나 점진적으로 공개한다.
- Browser Chrome과 Safe-area Inset을 고려해 남은 보이는 Block 공간을 Renderer에
  사용한다. 고정 `100vh` 가정만 의존하지 않는다.
- 붙은 Transport는 판정선이나 피아노 위를 가리지 않고 Layout 공간을 차지한다.
- 상세 설정은 사용자가 제어하는 Surface로 Player 위에 열릴 수 있으나 Renderer를
  지속적으로 줄이거나 Keyboard Focus를 가려서는 안 된다.

### 넓은 Layout

- 가용 너비와 높이를 함께 사용한다. 일반 Desktop 높이의 초기 Viewport에 채보 정체성과
  핵심 Transport가 맞는 가장 큰 읽을 수 있는 Renderer를 선택한다.
- 28 Lane 장면을 넓은 Monitor 전체로 무한히 늘리지 않는다. 높이 및 Geometry 제약을
  가진 Player를 중앙 배치하고 남은 공간을 의도적으로 사용한다.
- `1280×720`과 `1440×900`에서 Renderer와 핵심 Transport를 초기 세로 Scroll 없이 모두
  볼 수 있어야 한다.
- 전체 채보는 여러 완전한 열을 보여줄 수 있고 추가 열을 위한 로컬 가로 Overflow를
  유지할 수 있다.
- 정확한 Renderer 최대 너비, Compact Control 치수 및 전환 Threshold는 이 기획서의
  임의값이 아니라 Foundation Specimen 측정으로 정한다.

### 방향과 2차원 예외

- 회전을 강제하거나 기기 회전 Gate를 표시하지 않고 세로와 가로를 지원한다.
- 전체 채보 Chart 영역만 정당한 2차원 Reflow 예외를 받는다. Header, Tab, 상태, 설정,
  Transport 및 제보 Action은 정상적으로 Reflow해야 한다.
- Sticky 또는 붙은 Control이 Focus 요소를 완전히 가리지 않게 한다. 필요한 경우 적절한
  Scroll Padding과 Panel 크기를 사용한다.

## 접근성 계약

- 집중형 뷰어에 정확히 하나의 `main` Landmark를 Rendering한다.
- 올바른 라벨이 있는 Tab List 하나, Tab 두 개 및 연결된 Tab Panel 두 개와 승인된 수동
  활성화 모델을 사용한다.
- 낙하형 Renderer와 Custom Transport를 하나의 Player로 의미 있게 Group한다.
- 가능한 경우 Native Button과 Native Range Input을 사용한다. Slider 최소, 최대, 현재값
  및 다국어로 읽을 수 있는 시간을 노출한다.
- 아이콘 전용 Control마다 Play/Pause 및 전체 화면 진입/종료처럼 상태에 따라 바뀌는
  접근 가능한 이름을 제공한다.
- 모든 반응형 Variant에서 보이는 Focus Indicator와 승인된 WCAG Target Size 및 Target
  Spacing 동작 이상을 제공한다.
- Canvas 설명을 안정적으로 유지한다. Animation Frame마다 Image의 접근 가능한 이름을
  다시 쓰거나 재생 시간을 계속 안내하지 않는다.
- 현재 및 전체 시간은 보이는 Text와 Seek Slider로 노출한다. 사용자 요청 상태 변화와
  간결한 오류만 적절한 Polite Status 영역으로 안내한다.
- `28` Lane, 노트 수, 재생 시간 및 왼손·오른손 안내 의미의 구조화된 Text 요약을
  제공한다.
- 낙하하는 모든 노트를 실시간으로 읽으려 하지 않는다. 전체 채보의 구조화된 열 설명과
  채보 요약이 비시각적 개요를 제공한다.
- 손을 Text와 색상으로 구분한다. Cyan/Red 색상에만 의존하지 않는다.
- 전체 채보에 Keyboard Focus 가능한 라벨 Scroll 영역과 의미 있는 열별 접근 Text를
  제공한다.
- Route 진입, 보기 복귀, 전체 화면 종료 또는 Renderer 복구에서 음원이나 Animation을
  자동 재생하지 않는다.
- `prefers-reduced-motion`이 전체 채보를 강제하거나 핵심 채보 시각화를 제거하지 않는다.
  채보 Timing 의미를 바꾸지 않으면서 필수적이지 않은 Shell Motion과 Transition을
  줄인다.
- 설정 Panel, Shortcut 도움말, 오류 제보 및 실패 메시지는 Modal 여부에 맞는 초기
  Focus, Focus Containment, `Escape`, 닫기 및 Trigger Focus 복귀를 관리한다.
- Browser `200%` Zoom과 `320 CSS px` Reflow에서 Label, Control 및 동작을 보존한다.

## 다국어 및 콘텐츠

- Label, 오류 메시지, 설정 또는 제목 Metadata에 고정 너비를 가정하지 않고 한국어,
  일본어 및 영어를 지원한다.
- 원문 악곡 제목을 집중형 뷰어에서 보이는 유일한 악곡 제목으로 보존합니다.
  번역·읽기 제목 Disclosure는 악곡 상세가 담당합니다.
- 긴 제목은 집중형 Header 안에서 줄바꿈할 수 있다. 유일하게 보이는 제목을 잘라내거나
  뒤로가기와 핵심 재생 Control을 밀어내지 않는다.
- 번역이 게임 또는 데이터 Mapping을 약화하는 경우 `Basic`, `Recital`, 난이도명, `Lv`,
  `BPM`, `Full Combo`, `Pianist`, `NosLog` 같은 도메인 용어를 보존한다.
- Machine Value를 보존하면서 시간, 노트 수 및 수치 설정을 Locale에 맞는 보이는 Text로
  Format한다.
- 상태 문구를 간결하게 유지한다. 승인된 의미는 다음과 같다.

| 의미                     | 필수 간결 콘텐츠                                          |
| ------------------------ | --------------------------------------------------------- |
| 빈 채보                  | 표시할 노트가 없음                                        |
| 없거나 비공개인 Snapshot | 공개된 채보가 없음                                        |
| 낙하형 실패              | 낙하형을 표시할 수 없으며 전체 채보는 계속 사용할 수 있음 |
| 전체 화면 실패           | 전체 화면을 열 수 없으며 현재 뷰어는 계속 사용할 수 있음  |
| 로컬 음원 실패           | 로컬 음원을 사용할 수 없으며 채보 단독 재생은 계속 가능함 |

최종 한국어, 일본어 및 영어 Microcopy는 공용 콘텐츠 및 다국어 단계에서 함께 검토한다.
문구를 줄일 수 있으나 서로 다른 의미를 합치거나 기술 설명을 추가해서는 안 된다.

## Runtime 상태 계약

다음을 서로 다른 상태 영역으로 취급한다.

| 상태                       | URL | Viewer Session | 지속 Browser 설정 | Server |
| -------------------------- | --- | -------------- | ----------------- | ------ |
| 악곡, 난이도, Locale       | Yes | Yes            | No                | Source |
| 낙하형 또는 전체 채보      | Yes | Yes            | No                | No     |
| 현재 재생 시간             | No  | Yes            | No                | No     |
| 재생/일시정지              | No  | Yes            | No                | No     |
| 로컬 음원 Object           | No  | Yes            | No                | Never  |
| 노트 속도                  | No  | Yes            | No                | No     |
| 메트로놈 활성              | No  | Yes            | No                | No     |
| 메트로놈 음량              | No  | Yes            | Yes               | No     |
| 엄밀한 연주                | No  | Yes            | Yes               | No     |
| 전체 화면                  | No  | Yes            | No                | No     |
| 전체 채보 로컬 Scroll 위치 | No  | Yes            | No                | No     |
| Renderer 기능/오류         | No  | Yes            | No                | No     |

- 일시적인 재생, 전체 화면, 로컬 File 또는 오류 상태를 공유 URL에 넣지 않는다.
- 로컬 File 정체성을 저장하거나 전송하지 않는다.
- 보기 변경은 History를 교체하고, 진입과 복귀는 실제 History Event로 유지한다.
- 위 계약에 따라 Renderer Resize, 보기 전환, 전체 화면 및 안전한 다시 시도에서 Session
  상태를 보존한다.

## 구현 Mapping

이 Mapping은 이후 구현 세션을 안내하며 현재 디자인 가이드 세션에서 Code 변경을
허용하지 않는다.

- 현행 공개 Route와 공개 Snapshot Schema 검증을 보존한다.
- 고정 Overlay 관계를 진짜 집중형 Route Shell로 교체해 `main` Landmark가 하나만 있고
  일반 Header/Footer가 없게 한다.
- `ChartSheetViewer`에 검증된 `view` Query 상태, 연결된 수동 Tab, Session 단위 Viewer
  상태 및 출처 인식 복귀를 추가한다.
- `FallingChartViewer`의 Renderer와 재생 수학은 유지하되, Unmount, 전체 화면 및
  Fallback을 넘어 보존해야 하는 상태는 Viewer Session 소유자로 올린다.
- 비동기 PixiJS 초기화, WebGL 기능 실패, Context 상실, 다시 시도 및 전체 채보
  Fallback을 다루는 Renderer Lifecycle Boundary를 추가한다.
- `lib/browserSupport.ts`의 Safari User Agent Gate를 기능 및 실제 초기화 검사로
  교체한다.
- 낙하형 Player Unit에만 Fullscreen API 기능 감지를 추가한다.
- 승인된 재생 동작을 바꾸지 않고 Control을 핵심 Transport, 빠른 Control 및 상세
  설정으로 Refactor한다.
- 로컬 음원은 Browser Memory에 유지하고 Feedback Payload, Logging, Analytics 및
  Persistence에서 제외한다.
- Canvas의 접근 가능한 설명을 안정화하고 채보 요약, 현재 시간 및 전체 채보 열을 DOM
  Text로 노출한다.
- `getMeasurePanels(..., 4, { completeLastPanel: true })` 동작과 승인된 BPM/박자표 Marker를
  유지한다.
- 일반 Application Shell을 드러내는 대신 오래되거나 비공개인 직접 Link를 위한 Route
  단위 집중형 부재 처리를 추가한다.
- 공개/관리자 정체성, 보기 URL 상태, 복원, 전체 화면, 기능 실패, Context 상실, 로컬
  음원, 반응형 Geometry, 접근성 및 제보 Privacy Test를 확장한다.

## 대표 Fixture

검증에는 다음을 포함해야 한다.

- 일반 공개 채보, 밀집 채보, 희소 채보 및 노트가 0개인 채보
- Normal, Hard, Expert 및 Real과 긴 재생 시간 및 짧은 재생 시간
- 홀수·짝수 폭 및 양손을 가진 일반, 테누토, 글리산도 및 트릴 노트
- 여러 BPM 및 박자표 변경과 완전한 4마디 열 하나로 완성되는 부분 마지막 Group
- 낙하형 Loading, 성공, 초기화 실패, Context 상실, 성공한 다시 시도 및 반복 실패
- 전체 화면 지원, 미지원, 거절, 진입, 종료 및 Resize
- 음원 없음, 유효한 로컬 음원, Decode 실패, 교체 및 Route 이탈
- 메트로놈 끄기/켜기, 음량 극값, 노트 속도 극값 및 엄밀한 연주 끄기/켜기
- 0이 아닌 시간에서 낙하형→전체 채보 및 전체 채보→낙하형 전환
- 공개 뷰어, 관리자 초안 미리보기, 비로그인 제보 진입, 성공한 제보 및 실패한 제보
- 직접 공유 URL, 악곡 상세 진입, Browser Back, 명시적 뒤로가기 및 기본값이 아닌 악곡
  상세 콘텐츠 영역으로 복귀
- 긴 일본어 원문 제목, 아티스트 없음 및 번역·읽기 제목 검색 뒤 악곡 상세를 거쳐
  뷰어에 진입하는 경우
- `320×720`, `360px`, `390×844`, Compact 가로, Tablet 세로/가로, `1280×720`,
  `1440×900` 및 더 넓은 Desktop Viewport
- Keyboard 전용, `200%` Zoom, Reduced Motion, Screen Reader Smoke, Touch 및 Pointer

## 브라우저 승인 계약

- 집중형 Route는 `main` 하나를 Rendering하며 일반 NosLog Header, Footer 또는 문서 단위
  가로 Overflow를 만들지 않는다.
- `320×720`과 `390×844`에서 재생을 찾기 위해 Renderer 아래를 탐색할 필요 없이 정체성,
  보기 선택, Renderer 및 핵심 Transport를 조작할 수 있다.
- `1280×720`과 `1440×900`에서 Renderer와 핵심 Transport가 초기 Viewport에 맞고, 전체
  너비를 채우기 위해 장면을 늘리지 않는다.
- 전체 채보만 로컬 2차원 Scroll 예외다. Compact Layout에서 한 열을 읽을 수 있고 넓을
  때 여러 완전한 열을 표시할 수 있다.
- Tab 화살표 이동, 수동 활성화, Focus 관계, URL 교체 및 Panel 의미가 세 언어에서
  작동한다.
- 보기 전환, 전체 화면 진입/종료, Renderer Resize, Fallback 및 다시 시도는 승인된
  Session 상태를 보존하고 복귀 시 자동 재생하지 않는다.
- 핵심 Transport, 빠른 Control, 상세 설정 및 Shortcut을 Touch, Pointer 및 Keyboard로
  조작할 수 있다. Player Shortcut이 Control의 Key를 가로채지 않는다.
- Safari에서 실제 낙하형 초기화를 시도한다. Browser Brand만으로 전체 채보를 강제하지
  않는다.
- 전체 화면 미지원 및 요청 거절은 Route 실패가 아니라 Progressive Enhancement
  상태다.
- Renderer 초기화 실패 및 복구 불가능한 Context 상실은 재생을 일시정지하고 전체
  채보를 활성화하며 간결한 상태와 정확한 다시 시도를 제공한다.
- 로컬 음원이 Network Request, 제보 Payload, 지속 Server 상태, Log 또는 보이는 오류
  진단에 나타나지 않는다.
- 공개와 관리자 미리보기 정체성을 구분하며 공개 Revision을 일반 Metadata로 보이지
  않는다.
- 긴 한국어, 일본어 및 영어 콘텐츠가 Control을 자르거나 Renderer를 승인된 사용 가능
  Geometry 아래로 줄이지 않고 줄바꿈한다.
- Browser Zoom, Keyboard Focus, Range Slider Value, Focus 복귀, Target Size, 색상에
  의존하지 않는 손 의미 및 비-Live Canvas 설명이 승인된 접근성 계약을 만족한다.
- Desktop Chrome, Safari, Firefox, Edge와 Mobile Safari 및 Chrome을 검증한다. 가능한
  경우 주요 Mobile Engine마다 실제 Touch Device Smoke Test를 하나 이상 수행한다.

## 레퍼런스 Matrix

결정 Set은 하나의 Player, 리듬게임, Browser 또는 Framework를 Template으로 취급하지
않고 폭넓은 비교를 사용한다.

| 출처                                                                                                                          | 전용할 수 있는 발견                                                                                            | NosLog 적용                                                         | 한계                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [현행 공개 Route](<../../app/(nevigation)/music/[index]/[difficulty]/pattern/page.tsx>)                                       | 선택한 공개 채보 하나를 Rendering 전에 Schema 검증한다.                                                        | 정확한 채보 정체성과 공개 Snapshot 경계를 보존한다.                 | 현행 Not Found와 보이는 Revision 표현은 완전한 2.0 상태 계약이 아니다.    |
| [현행 Viewer Shell](../../components/chart-pattern/chartSheetViewer.tsx)                                                      | 낙하형, 전체 채보, 4마디 Panel, 범례 및 가로 채보 Scroll이 이미 존재한다.                                      | 검증된 기능을 보존하면서 Shell, 상태 및 의미 구조를 교체한다.       | 현행 고정 Geometry와 UA Fallback은 Migration 근거일 뿐이다.               |
| [현행 낙하형 Viewer](../../components/chart-pattern/fallingChartViewer.tsx)                                                   | 재생, 로컬 음원, 속도, 메트로놈, 엄밀한 연주, 피아노 및 PixiJS Drawing이 구현돼 있다.                          | Renderer 재작성을 명시적으로 범위에서 제외한다.                     | 현재 Local Component 소유권은 Unmount 시 상태를 잃는다.                   |
| [현행 Browser 지원](../../lib/browserSupport.ts)                                                                              | Safari를 UA 정규식으로 식별하고 전체 채보를 강제한다.                                                          | 기능 감지로 교체할 정확한 구현을 식별한다.                          | Safari가 WebGL을 초기화할 수 없음을 증명하지 않는다.                      |
| [승인된 IA](./02-information-architecture.ko.md)                                                                              | 채보 뷰어는 낙하형, 전체 채보, 전체 화면 및 신뢰할 수 있는 복귀를 가진 집중형 하위 목적지다.                   | 페이지 역할을 정하고 전역 내비게이션을 제거한다.                    | Control 계층이나 실패 복구를 정하지 않는다.                               |
| [승인된 악곡 상세 기획서](./05-music-detail-page-brief.ko.md)                                                                 | 채보 보기는 정확한 선택 난이도를 열고 복귀는 알려진 상세 Context를 복원한다.                                   | 진입, 비활성 사용 가능 여부 및 복귀 의미를 정한다.                  | 상세 Layout이 집중형 Player를 지배하지 않는다.                            |
| [W3C APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                               | Tab에는 연결된 Role, 상태, Keyboard 이동 및 예측 가능한 활성화가 필요하다.                                     | 수동 낙하형/전체 채보 Tab을 지원한다.                               | APG는 Renderer Fallback을 결정하지 않는다.                                |
| [W3C APG: Slider](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)                                                           | Slider에는 Keyboard 동작과 이해할 수 있는 Value 의미가 필요하다.                                               | 탐색 및 음량 Control을 지배한다.                                    | Touch 보조 기술 Test가 여전히 필요하다.                                   |
| [W3C APG: Keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                  | Focus는 Composite Control 안에서 보이고 예측 가능하게 움직여야 한다.                                           | Tab, 설정, Dialog 및 복원에 적용한다.                               | 정확한 Shortcut 선택은 제품 결정으로 남는다.                              |
| [W3C WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                   | 콘텐츠는 320 CSS px에서 작동해야 하며 실제 Diagram과 Game은 로컬 2차원 예외를 사용할 수 있다.                  | 가로 Scroll을 전체 채보로 제한한다.                                 | 채보 열 너비를 정하지 않는다.                                             |
| [W3C WCAG: Orientation](https://www.w3.org/WAI/WCAG21/Understanding/orientation)                                              | 필수적인 경우가 아니면 한 기기 방향을 요구하면 안 된다.                                                        | 강제 가로 방향과 회전 Gate를 거절한다.                              | 피아노가 예외 가능 사례로 언급되지만 NosLog는 양쪽 방향을 지원할 수 있다. |
| [W3C WCAG: Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)                        | 작성자가 배치한 Sticky 콘텐츠가 Focus Control을 완전히 가리면 안 된다.                                         | 붙은 Transport와 설정 Panel을 제약한다.                             | 정확한 Scroll Padding은 구현 Test가 필요하다.                             |
| [W3C WCAG: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)                                      | Compact Control도 충분한 Target Size 또는 간격이 필요하다.                                                     | 밀집 Transport와 Mobile 설정을 제약한다.                            | Foundation이 더 강한 NosLog Target Token을 정한다.                        |
| [W3C WCAG: Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content)                                    | 비-Text 시각 정보에는 동등한 목적 또는 설명이 필요하다.                                                        | 안정적인 Canvas 요약과 구조화한 전체 채보 Text를 요구한다.          | 모든 Animation Frame의 실시간 안내를 요구하지 않는다.                     |
| [W3C WCAG: Status Messages](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)                                 | 중요한 상태는 Focus를 옮기지 않고 안내할 수 있다.                                                              | 간결한 Renderer, 전체 화면 및 제보 상태를 지원한다.                 | 과도한 안내는 여전히 피해야 한다.                                         |
| [MDN: Fullscreen API guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)                            | 전체 화면은 사용자 시작, 기능 의존, 비동기이며 거절될 수 있다.                                                 | 낙하형 Unit 주변의 Progressive Enhancement로 만든다.                | Browser 및 Embedding Policy가 다르다.                                     |
| [MDN: Screen Orientation lock](https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock)                       | 방향 잠금에는 기능 및 전체 화면 제약이 있다.                                                                   | 회전을 강제하지 않는 방향을 지원한다.                               | NosLog가 호출할 필요 없는 API를 설명한다.                                 |
| [MDN: UA sniffing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent)                  | 기능 감지가 Browser 이름 가정보다 신뢰할 수 있다.                                                              | Safari 일괄 차단을 교체한다.                                        | 실제 Pixi 초기화는 여전히 Test해야 한다.                                  |
| [MDN: WebGL context lost](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event)          | WebGL Context는 상실될 수 있으며 의도적인 복구 동작이 필요하다.                                                | 일시정지, Fallback 및 다시 시도를 정한다.                           | 성공적인 복원은 Renderer와 기기에 따라 다르다.                            |
| [MDN: CSS scroll snap](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Basic_concepts)                    | `proximity`는 정렬을 도울 수 있지만 Mandatory Snap은 큰 콘텐츠 일부를 접근하지 못하게 할 수 있다.              | 전체 채보 탐색을 가두지 않는 선택적 열 시작 보조를 지원한다.        | 실제 Touch와 Trackpad 동작 Test가 필요하다.                               |
| [MDN: Viewport lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length)                             | Dynamic Viewport Unit은 Browser UI를 반영하지만 Scroll 중 Resize와 성능 영향을 만들 수 있다.                   | 고정 `100vh` 하나 대신 보이는 영역과 Safe Inset Test를 요구한다.    | 최종 크기 Algorithm을 정하지 않는다.                                      |
| [PixiJS: Renderers](https://pixijs.com/8.x/guides/components/renderers)                                                       | PixiJS 8은 WebGL을 권장하며 WebGPU는 성숙 중이다.                                                              | 현행 WebGL Renderer를 2.0에 보존한다.                               | Renderer 문서는 제품 Fallback 문구를 정하지 않는다.                       |
| [PixiJS: Application](https://pixijs.com/8.x/guides/components/application)                                                   | Application 초기화는 비동기이며 구성할 수 있다.                                                                | Control 활성화 전 실제 초기화 Boundary를 요구한다.                  | NosLog가 Teardown과 복구를 계속 소유한다.                                 |
| [WebKit: Safari 15 features](https://webkit.org/blog/11989/new-webkit-features-in-safari-15/)                                 | Safari는 WebGL 자체가 범주적으로 없는 것이 아니라 WebGL2 기능을 지원한다.                                      | Browser Brand 전용 제외를 반박한다.                                 | Device/GPU 실패는 여전히 생길 수 있다.                                    |
| [web.dev: Progressively enhance your PWA](https://web.dev/articles/progressively-enhance-your-pwa)                            | Enhancement를 사용할 수 없어도 핵심 기능을 사용할 수 있어야 한다.                                              | 낙하형이나 전체 화면 없이도 전체 채보를 사용할 수 있게 한다.        | PWA 설치 지침은 채택하지 않는다.                                          |
| [Soundslice Player 개요](https://www.soundslice.com/help/en/player/basic/99/overview/)                                        | Browser 음악 연습 Player는 기기 전반에서 악보, 재생, Tempo, 음원 및 시각 악기를 결합한다.                      | 통합된 채보 확인과 연습 Control을 확인한다.                         | 일반 악보는 NOSTALGIA 28 Lane 채보가 아니다.                              |
| [Soundslice 기능](https://www.soundslice.com/features/)                                                                       | 전체 화면, Shortcut, 메트로놈, 시각 Keyboard, 구성 가능한 Layout 및 다기기 사용이 집중 연습을 지원한다.        | 전체 화면과 보이는 연습 Control 및 설정을 지원한다.                 | 기능 폭이 새 NosLog 기능 추가를 허가하지 않는다.                          |
| [Soundslice: 악보 크기 변경](https://www.soundslice.com/help/en/player/basic/101/resizing-notation/)                          | Fit과 Zoom은 하나의 고정 Canvas를 가정하지 않고 가용 화면에 반응한다.                                          | 영역 기반 Renderer 및 읽을 수 있는 전체 채보 크기를 지원한다.       | NosLog는 일반 악보를 재조판하지 않는다.                                   |
| [Flat: Playback](https://help.flat.io/en/music-notation-software/playback/)                                                   | Playback Control은 악보 읽기 과업과 붙어 있다.                                                                 | Page Footer가 아니라 Renderer에 Transport를 붙이는 방향을 지원한다. | Flat의 악보 및 Editor Workflow는 다르다.                                  |
| [BBC GEL: Video controls](https://bbc.github.io/gel/components/video-controls/)                                               | Custom Player에는 명확한 Play/Pause, 견고한 Range Input, 반응형 Control Layout 및 접근 가능한 이름이 필요하다. | 핵심 Transport와 반응형 Flex 동작의 근거가 된다.                    | NosLog는 Video Player가 아니며 연습 Control을 계속 보인다.                |
| [YouTube: Screen-reader 지원](https://support.google.com/youtube/answer/189278?hl=en)                                         | Player Control과 Shortcut에는 이름, Focus 및 예측 가능한 Keyboard 동작이 필요하다.                             | 발견 가능한 Player 범위 Command를 지원한다.                         | 감상 Video Auto-hide 동작은 채택하지 않는다.                              |
| [Vimeo: Player Keyboard Shortcut](https://help.vimeo.com/hc/en-us/articles/12425998125073-What-are-player-keyboard-shortcuts) | 문서화한 Shortcut Set은 숙련된 재생 Control을 개선한다.                                                        | Shortcut 도움말과 보이는 동등 Action을 지원한다.                    | Vimeo Command가 NosLog Key를 정하지 않는다.                               |
| [osu! Keyboard Shortcut](https://osu.ppy.sh/wiki/en/Client/Keyboard_shortcuts)                                                | 리듬게임 사용자는 명시적이고 문서화된 Context 인식 Shortcut에서 도움을 받는다.                                 | 간결한 Player 범위 Set을 지원한다.                                  | osu! Gameplay 및 Editor Command는 범위 밖이다.                            |

### 근거 수렴

- 접근성 및 반응형 출처는 하나의 의미 과업 계층, 보이고 예측 가능한 Control,
  `320 CSS px` Reflow 및 실제 2차원 콘텐츠를 위한 Page 단위가 아닌 로컬 Scroll 예외에
  수렴한다.
- 음악 Player 및 악보 Viewer 레퍼런스는 악보, 재생, Tempo, 시각 악기, 설정 및 전체
  화면을 하나의 집중 연습 Context 안에 유지하는 데 수렴한다. Renderer 아래로 주요
  Transport를 숨기는 방향을 지지하지 않는다.
- Browser 및 Renderer 문서는 Browser Brand 차단이 아니라 비동기 기능 검사,
  Progressive Enhancement 및 명시적 Context 상실 복구에 수렴한다.
- Scroll 지침은 선택적인 Proximity 정렬을 지원하지만 콘텐츠 항목이 Scrollport보다 클
  때 Mandatory Snap을 경고한다.
- 외부 출처는 NOSTALGIA의 28 Lane, 손 의미, 4마디 전체 채보, 엄밀한 연주, 노트 폭 해석
  또는 트릴 동작을 정의하지 않는다. 이는 검증된 NosLog 채보 Logic과 명시적인 사용자
  결정에서 나온다.

## 거절되거나 대체된 대안

- **페이지 재설계 중 PixiJS/WebGL Renderer 재작성 — Rejected:** 현행 Renderer와 채보
  수학은 기능 Baseline으로 유지한다.
- **일반 NosLog Header와 Footer 유지 — Rejected:** 뷰어는 명시적 복귀 하나를 가진
  집중형 Shell을 사용한다.
- **뷰어를 또 하나의 악곡 상세 Panel로 취급 — Rejected:** 공유도 가능한 집중형 하위
  목적지다.
- **독립적인 채보 Catalog 추가 — Rejected:** 채보 범위의 공용 탐색이 정확한 공개
  난이도를 결정한다.
- **UA 문자열로 Safari를 전체 채보에 강제 — Superseded:** 낙하형을 시도하고 기능 또는
  초기화 실패 뒤에만 Fallback한다.
- **지금 WebGPU 또는 실험적 Canvas Fallback으로 Migration — Rejected:** WebGL과 전체
  채보가 승인된 프로덕션 전략이다.
- **Page 전체 또는 전체 채보를 전체 화면으로 전환 — Rejected:** 전체 화면은 낙하형
  Player Unit에만 적용한다.
- **전체 화면에서 가로 방향 강제 — Rejected:** 두 방향을 모두 조작 가능하게 한다.
- **필수 전체 화면 Control 자동 숨김 — Rejected:** 연습 재생은 지속적인 빠른 접근과
  예측 가능한 Focus가 필요하다.
- **모든 Control을 하나의 지속 Row에 배치 — Rejected:** 핵심 Transport, 빠른 Control 및
  상세 설정은 빈도와 계층이 다르다.
- **노트 속도 또는 메트로놈을 설정 안으로 이동 — Rejected:** 둘 다 빠른 Control로
  유지한다.
- **로컬 음원 저장 또는 제보 첨부 — Rejected:** 비공개 Browser 상태로 유지한다.
- **진입, 복귀, 복구 또는 전체 화면 종료 때 자동 재생 — Rejected:** 명시적인 사용자
  Action 뒤에만 재개한다.
- **Mandatory 전체 채보 Snap 사용 — Rejected:** Proximity 보조가 자유로운 확인을
  보존한다.
- **긴 전체 채보를 한 Viewport로 축소 — Rejected:** 읽을 수 있는 열과 로컬 Scroll을
  우선한다.
- **Canvas 시간 또는 모든 노트를 계속 안내 — Rejected:** 안정적인 요약과 사용자 요청
  상태가 보조 기술 Noise를 피한다.
- **공개 Revision Metadata 노출 — Superseded:** Revision은 관리자 미리보기와 첨부 진단
  Context에서만 보인다.
- **기술 오류 노출 또는 Browser 교체 요구 — Rejected:** 간결한 범위 복구와 전체
  채보를 계속 제공한다.

## 결정 Log

| ID      | 결정                                                                                    | 상태       |
| ------- | --------------------------------------------------------------------------------------- | ---------- |
| VIEW-01 | 채보 뷰어는 정확한 악곡 난이도의 집중형 하위 목적지로 유지                              | `Approved` |
| VIEW-02 | 두 번째 Catalog 없이 공용 탐색의 채보 범위를 통해 진입 가능                             | `Approved` |
| VIEW-03 | 일반 Header, Footer 또는 전역 내비게이션 없이 집중형 `main` 하나 사용                   | `Approved` |
| VIEW-04 | 낙하형과 전체 채보를 별도의 접근 가능한 Tab으로 보존                                    | `Approved` |
| VIEW-05 | 공유 가능한 보기 상태를 Encode하고 일반 Tab 변경에서 History 교체                       | `Approved` |
| VIEW-06 | 보기 전환은 일시정지하되 시간, 로컬 음원 및 Viewer 설정 보존                            | `Approved` |
| VIEW-07 | 현행 Renderer와 채보 수학을 재설계 범위에서 제외                                        | `Approved` |
| VIEW-08 | 핵심 Transport를 항상 보이게 하고 낙하형 Renderer 아래에 부착                           | `Approved` |
| VIEW-09 | 노트 속도와 메트로놈을 빠른 Control로 유지                                              | `Approved` |
| VIEW-10 | 로컬 음원, 메트로놈 음량, 엄밀한 연주 및 Shortcut을 상세 설정에 배치                    | `Approved` |
| VIEW-11 | 승인된 Player 범위 Space, Home, 화살표, F, Escape 및 ? Shortcut 사용                    | `Approved` |
| VIEW-12 | 전체 화면을 낙하형 Renderer와 필수 Control에만 적용                                     | `Approved` |
| VIEW-13 | 기기 방향을 강제하거나 필수 전체 화면 Control을 자동으로 숨기지 않음                    | `Approved` |
| VIEW-14 | 미지원 시 전체 화면 진입을 생략하고 요청 실패를 로컬에서 처리                           | `Approved` |
| VIEW-15 | Safari에서 낙하형을 시도하고 UA 제외가 아닌 기능/초기화 근거 사용                       | `Approved` |
| VIEW-16 | 낙하형 실패 시 일시정지하고 간결한 상태 및 다시 시도와 함께 전체 채보로 Fallback        | `Approved` |
| VIEW-17 | 전체 채보 열마다 실제 4마디와 Timing 변경 Context를 보존                                | `Approved` |
| VIEW-18 | 전체 채보 가로 Scroll을 라벨 영역 안으로 제한                                           | `Approved` |
| VIEW-19 | 선택적 Proximity 열 Snap을 사용하고 Mandatory Snap 거절                                 | `Approved` |
| VIEW-20 | 공개 Header는 보이는 Revision을 제외하고 관리자 미리보기는 정체성과 저장 Revision 유지  | `Approved` |
| VIEW-21 | 음원 없는 자동 진단 Context와 함께 채보 오류 제보 재사용                                | `Approved` |
| VIEW-22 | 비로그인 제보는 공개 뷰어를 교체하지 않고 로그인 요구                                   | `Approved` |
| VIEW-23 | 간결하고 구분되는 Loading, 빈 상태, Rendering, 전체 화면, 음원 및 오래된 Link 상태 사용 | `Approved` |
| VIEW-24 | Live Frame 안내 없이 안정적인 Canvas 설명과 구조화된 전체 채보 Text 사용                | `Approved` |
| VIEW-25 | 손 안내를 Text와 색상으로 구분                                                          | `Approved` |
| VIEW-26 | `390px`은 대표값이며 320 CSS px Reflow와 중간 너비 검증 요구                            | `Approved` |
| VIEW-27 | Compact 및 일반 Desktop 높이의 초기 집중 구성에 Renderer와 핵심 Transport 유지          | `Approved` |
| VIEW-28 | 낙하형을 가용 너비와 높이로 크기 조절하고 Desktop에서 무한히 늘리지 않음                | `Approved` |
| VIEW-29 | 출처 인식 악곡 상세 복귀를 정확히 보존하고 직접 진입은 채보 정보로 복귀                 | `Approved` |
| VIEW-30 | 로컬 음원을 Browser 전용으로 유지하고 저장, Log, 제보 및 Server 전송에서 제외           | `Approved` |
| VIEW-31 | 2.0 뷰어는 Basic 전용이며 Recital 강·약 강약은 연결된 Future Work 계약으로 유지         | `Approved` |

## 인계 경계

Claude Design은 Foundation 승인 뒤 최종 타이포그래피, 색상, 간격, Surface 계층,
Iconography, Control 형태, 설정 Panel 처리, 정확한 Renderer 최대 너비 및 콘텐츠 기반
전환점을 결정할 수 있다. 위의 모든 결정과 승인 요구사항을 보존해야 하며, 별도로 승인된
가이드 Revision 없이 채보 Renderer를 새로운 시각 System으로 다시 그려서는 안 된다.

이후 Codex 구현 세션은 Claude 결과물을 이 기획서와 비교해야 한다. 결과물이 전역
내비게이션을 도입하거나, 주요 Control을 숨기거나, 방향을 강제하거나, 상태를 잃거나,
음원을 Upload하거나, Safari를 이름으로 차단하거나, 전체 채보 Fallback을 제거하거나,
정확한 복귀 경로를 약화하거나, 승인된 접근성 및 반응형 동작과 충돌하면 가이드 또는
디자인 Revision을 요청해야 한다.
