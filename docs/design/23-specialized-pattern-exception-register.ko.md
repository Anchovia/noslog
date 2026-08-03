# NosLog 2.0 특수 패턴 및 예외 등록부

## 문서 관리

- 상태: `승인된 거버넌스 등록부 — 최초 항목 2026-08-03 승인`
- 승인일: 2026-08-03
- 정본 언어: 영어
- 영어 정본:
  [23-specialized-pattern-exception-register.md](./23-specialized-pattern-exception-register.md)
- 범위: 공통 디자인, 접근성, 상호작용, Rendering 또는 연동 규칙을 달리
  적용하는 NosLog 특수 패턴의 거버넌스와 최초 승인 기록
- 입력: 승인된 페이지 브리프, 일관성 감사, 교차 영역 레퍼런스 매트릭스,
  현재 제품 근거, 집중 예외 거버넌스 조사 및 사용자의 명시적 승인
- 제외: 최종 시각 값, 하이파이 Layout, 애플리케이션 구현, 일반적인 반응형
  Variant, 그대로 유지하는 NOSTALGIA 의미, 출시 범위 연기 및 구현 부채

이 등록부는 모든 도메인 규칙이나 반응형 변화를 예외로 만들지 않으면서 특수
동작을 명시한다. 승인된 페이지 브리프와 함께 후속 Claude Design과 미래 Codex
구현을 지배한다. 페이지 브리프를 대체하거나 승인된 경계를 넘어 새 동작을
허가하지 않는다.

## 관련 문서

- [교차 영역 레퍼런스 매트릭스](./22-cross-cutting-reference-matrix.ko.md)
- [채보 뷰어 페이지 브리프](./07-chart-viewer-page-brief.ko.md)
- [채보 에디터 및 기여 페이지 브리프](./20-chart-editor-contribution-page-brief.ko.md)
- [악곡 상세 페이지 브리프](./05-music-detail-page-brief.ko.md)
- [홈 페이지 브리프](./03-home-page-brief.ko.md)
- [디자인 가이드 일관성 감사](./21-design-guide-consistency-audit.ko.md)

## 분류 모델

| 분류                       | 의미                                                                                                                                                     | 등록부 처리                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 도메인 불변조건            | Basic/Recital, 점수 구간, 4마디 채보 열, 공식 용어처럼 모든 올바른 디자인이 보존해야 하는 NOSTALGIA 또는 승인된 제품 의미                                | 지배하는 페이지 브리프와 결정 로그에 유지한다. 특정 표현이 교차 영역 규칙까지 달리 적용하지 않는 한 예외라고 부르지 않는다. |
| 정상 적응                  | Compact Modal과 Wide Popover, Hover·Focus 향상과 Touch 직접 이동, Compact 목록 우선과 Wide 목록·지도 같이 공간이나 기능에 맞춰 같은 과업을 재구성하는 것 | 반응형, 기능 감지 및 컴포넌트 규칙으로 지배한다. 예외로 등록하지 않는다.                                                    |
| 특수 계약                  | 승인된 과업이나 도메인 의미를 보존하기 위해 공통 규칙을 의도적으로 달리 적용하거나 좁히는 영구적인 NosLog 고유 패턴                                      | 목적, 변경 규칙, 정확한 경계, 동등한 경로 또는 Fallback, 검증 및 재검토 Trigger를 등록한다. 임의 만료일은 필요하지 않다.    |
| 경계가 있는 예외           | 제거하면 정보 또는 과업 완료가 실질적으로 손상되고 필요한 영역보다 넓어질 수 없는 교차 영역 요구의 로컬 예외                                             | 엄격한 격리 경계로 등록하고 주변의 모든 콘텐츠는 정상 규칙을 따르게 한다.                                                   |
| 임시 예외                  | 문서화된 대체안을 제공하는 동안에만 받아들이는 기간 제한 편차                                                                                            | 소유자, 제거 Milestone, 대체 계획 및 차단성 재검토 Trigger를 요구한다. 최초 등록부에는 승인된 임시 예외가 없다.             |
| 범위 경계 또는 Future Work | Recital 강약 Rendering이나 실시간 공동 편집처럼 2.0 출시에서 의도적으로 제외한 작업                                                                      | 페이지 브리프와 Future Work에서 추적한다. 예외가 아니다.                                                                    |
| 구현 부채                  | 고정 `390px` Wide Screen 셸, 중첩 `main` Landmark 또는 숨겨진 `0 × 0` X iframe처럼 승인된 지침과 충돌하는 현행 동작                                      | 감사와 구현 Backlog에서 추적한다. 이 등록부로 정당화해서는 안 된다.                                                         |

## 등록 승인 Gate

제안된 항목은 `Approved`가 되기 전에 아래의 해당 조건을 모두 충족해야 한다.

1. **검증된 필요:** 공통 규칙으로 충분히 지원할 수 없는 승인된 사용자 과업,
   도메인 의미 또는 안전 요구를 식별한다.
2. **명시한 편차:** 달리 적용하는 정확한 공통 원칙, 패턴 또는 Platform 규칙을
   식별한다. 공통 시스템을 따르는 기능은 예외가 아니다.
3. **불충분 근거:** 정상 구성, 설정 또는 기존 컴포넌트가 실질적 손실 없이
   필요를 해결하지 못하는 이유를 설명한다.
4. **가장 작은 경계:** 정확한 Route, 컴포넌트, 영역, Mode, 상태 및 사용자를
   명시한다. 예외가 주변 UI로 조용히 확산되면 안 된다.
5. **동등한 완료:** 필요한 정보와 과업을 보존하는 Fallback, 구조화 표현 또는
   대체 상호작용을 정의한다.
6. **교차 영역 영향:** 접근성, Keyboard·Focus, 반응형, 한국어·일본어·영어,
   개인정보, 성능, 데이터 및 복구 영향을 기록한다.
7. **검증 계약:** 대표 콘텐츠, 상태, Viewport, 입력 방식, Browser 및 실패
   Simulation을 명시한다.
8. **생명주기:** 유지관리자, 재검토 Trigger, 의존성, 거절한 대안 및 대체 기록을
   명시한다.

시각 취향, Legacy 구현, 일정 압박, 구현 편의, 스크린샷 하나, Framework 기본값,
Browser Brand 가정 또는 Third-party 도구 한계만으로는 충분한 이유가 아니다.

## 권한과 생명주기

- NosLog 유지관리자이자 사용자가 모든 항목의 최종 승인자다.
- Claude Design과 미래 Codex 세션은 `Proposed` 기록을 만들 수 있지만 사용자의
  명시적 승인 없이 `Approved`로 승격할 수 없다.
- 유효한 상태는 `Proposed`, `Approved`, `Rejected`, `Superseded`, `Retired`다.
- 승인 기록의 의미를 조용히 다시 쓰지 않는다. 실질적인 변경은 새 결정 또는
  명확히 이름 붙인 Revision을 사용하고 이전 기록을 `Superseded`로 표시한다.
- 영구적인 특수 계약에는 임의의 달력 만료일을 두지 않는다. 이름 붙인 Trigger가
  발생할 때 재검토한다.
- 임시 예외는 승인할 때 제거 Milestone과 대체 경로를 요구한다. 해결 없이
  Milestone이 지나면 사용자 재검토로 돌아가며 예외가 영구화되지 않는다.
- 반복 사용이 예외를 자동으로 공용 컴포넌트로 승격시키지 않는다. 두 번째 페이지
  Family 사용은 로컬 유지, 재사용 특수 패턴 승격 또는 공통 시스템으로 재설계할지
  검토하는 Trigger다.

## 필수 기록 Schema

새 기록은 모두 다음을 포함해야 한다.

- ID, 제목, 분류, 상태, 승인일 및 소유자
- 검증된 사용자 필요와 달리 적용하는 지배 규칙
- 정확한 범위 안과 범위 밖 경계
- 승인 동작과 금지된 확장
- 공통 패턴이 불충분한 이유
- 동등한 과업 경로, 구조화 근거 및 실패 복구
- 접근성, 반응형, 다국어, 개인정보, 성능 및 데이터 영향
- 검증 Matrix와 수용 근거
- 의존성, 거절한 대안 및 알려진 한계
- 재검토 Trigger, 임시일 때 제거 Milestone 및 대체 이력

## 승인 등록부

### `SP-01` 집중형 채보 뷰어 셸

- 분류: `특수 계약`
- 상태: `Approved`
- 소유자: `NosLog 유지관리자`
- 지배 편차: 공용 사용자 셸은 일반적으로 전역 내비게이션, 계정 접근 및 Footer
  목적지를 보존한다.
- 필요: 공개 채보 재생과 검토에는 중단되지 않는 안정적인 채보 Context와 선택한
  악곡·난이도로 돌아가는 명시적 경로가 필요하다.
- 범위 안: 승인된 채보 뷰어 브리프의 집중형 낙하형 뷰어, 전체 채보 뷰어 및 뷰어
  전용 전체 화면 상태
- 범위 밖: 악곡 상세, 탐색, 랭킹, 에디터, 일반 콘텐츠 페이지 또는 필수 뷰어
  종료, 정체성, 제보, 상태 및 복구 Control 제거
- 승인 동작: 일반 NosLog Header, 더보기 Panel 및 Footer를 생략하고 채보 정체성,
  명시적 복귀, 보기 선택, Transport, 설정, 상태 및 페이지 단위 `main` Landmark
  하나를 가진 집중형 셸을 제공한다.
- Fallback과 복구: 직접 Link, Renderer 실패, 전체 화면 거절, 없는 채보 및 종료가
  채보 뷰어 브리프에 따라 알려진 악곡·난이도 Context를 보존하거나 복구해야 한다.
- 검증: Keyboard·Pointer 종료, Browser Back, 직접 Link 진입, Focus 순서, `main`
  하나, `320`, 대표 `390`, 중간 너비, `1280×720`, `1440×900`
- 재검토 Trigger: 뷰어가 아닌 두 번째 페이지가 집중형 셸을 요구하거나, 전역
  내비게이션이 실질적으로 바뀌거나, 종료·복구 검증이 실패할 때
- 지배 브리프: [채보 뷰어](./07-chart-viewer-page-brief.ko.md)

### `SP-02` 전체 채보 로컬 2차원 Chart 영역

- 분류: `경계가 있는 예외`
- 상태: `Approved`
- 소유자: `NosLog 유지관리자`
- 지배 편차: `PR-06`과 `PR-09`는 일반적으로 페이지 단위 2차원 Scroll 없이
  콘텐츠와 Control이 `320 CSS px`에서 Reflow할 것을 요구한다.
- 필요: 채보 열을 일반 단일 열 문서처럼 분할하면 Lane, 시간, 마디, 노트 경로 및
  손 관계의 의미가 사라진다.
- 범위 안: 라벨이 있는 전체 채보 Chart 영역과 읽을 수 있는 완전한 4마디 열만
- 범위 밖: 뷰어 Header, Tab, 상태, 설정, Transport, 제보 Action, 열 설명 또는
  주변 Page 콘텐츠
- 승인 동작: 가로 탐색을 채보 영역 안에 격리하고 Compact 너비에서 읽을 수 있는
  완전한 한 열, Wide 너비에서 맞는 만큼의 완전한 열, Native Touch, Trackpad,
  Mouse 및 Keyboard Scroll을 보존한다.
- 동등한 경로: 영역에 접근 가능한 이름을 주고 Canvas Pixel을 읽지 않아도 되는
  구조화된 열 시작·종료 시간과 4마디 설명을 제공한다.
- 검증: `320 CSS px`, 대표 `390px`, 중간 너비, Desktop, 해당하는 경우
  `200%`·`400%` 확대, Keyboard Scroll, Touch Scroll, Focus 가시성 및 관련 없는
  페이지 콘텐츠에 Overflow가 없는지 확인
- 재검토 Trigger: 채보에 공간 관계가 더는 필요하지 않거나, 시맨틱 비2D 표현이 과업
  동등성을 달성하거나, 예외가 Container 밖으로 빠져나갈 때
- 지배 브리프: [채보 뷰어](./07-chart-viewer-page-brief.ko.md)

### `SP-03` 채보 에디터 공간 작업 영역과 조절 가능한 도구

- 분류: `경계가 있는 예외 및 특수 계약`
- 상태: `Approved`
- 소유자: `NosLog 유지관리자`
- 지배 편차: 일반 문서 콘텐츠는 선형으로 Reflow하며 일반 Panel은 지속적인 2차원
  시간·음높이 작업 영역을 요구하지 않는다.
- 필요: 정밀한 노트 배치, 폭, 길이, 경로, Timing, 선택, Preview 및 속성 편집은
  안정적인 공간 관계에 의존한다.
- 범위 안: 에디터 시간·음높이 Canvas와 승인된 좌·우·하단 Dock, 접기, 내부 Scroll
  및 크기 조절 도구 영역
- 범위 밖: 페이지 셸, 기여 Workflow, 알림, Revision 이력, Export, 제출 및 복구
  Control. 이들은 모두 계속 Reflow하고 사용할 수 있어야 한다.
- 승인 동작: 검증된 최소·최대 치수 안에서 경계 내부 2D Scroll과 조절 가능 Panel을
  허용하며 크기 조절 중 선택, 재생 시간, 작업 위치 및 도구 Context를 보존한다.
- 동등한 경로: Drag 의존 편집과 크기 조절은 모두 승인된 Keyboard 또는 명시적인
  비 Drag 경로, 구조화 속성, 보이는 Focus 및 Reset을 요구한다.
- 검증: Compact 세로·가로, 중간 너비, Wide Desktop, Keyboard 전용 생성·편집,
  단일 Pointer 대안, Splitter 한계, 확대, Focus 보존, Export, 복구 및 제출 가용성
- 재검토 Trigger: 에디터 Control이 외부에서 재사용되거나, 필수 Action이 Drag
  전용으로 남거나, Compact Layout이 복구·Export·제출을 막을 때
- 지배 브리프: [채보 에디터 및 기여](./20-chart-editor-contribution-page-brief.ko.md)

### `SP-04` 구조화 Fallback을 가진 PixiJS/WebGL 낙하형 Renderer

- 분류: `특수 계약`
- 상태: `Approved`
- 소유자: `NosLog 유지관리자`
- 지배 편차: 일반 콘텐츠와 Control은 Native 또는 시맨틱 DOM 우선 Rendering을
  사용하며 Canvas/WebGL Pixel은 객체를 자동으로 노출하지 않는다.
- 필요: 낙하 노트, 궤적, 판정선, 손 및 피아노 관계는 NosLog의 핵심 채보 보기
  기능이며 승인된 보기 Model을 교체하지 않고 일반 문서 Layout으로 재현할 수 없다.
- 범위 안: 낙하형 채보 Renderer와 밀접하게 연결된 재생 Surface만
- 범위 밖: Transport 시맨틱, 설정, 오류, 구조화 채보 요약, 전체 채보 Fallback 및
  주변 셸
- 승인 동작: 낙하형에 PixiJS/WebGL을 유지하고 Browser Brand가 아니라 기능 감지와
  실제 초기화로 가용성을 정하며 렌더링된 모든 노트를 관리되지 않는 Tab 정지 또는
  연속 Announcement로 만들지 않는다.
- Fallback과 복구: 초기화 또는 복구 불가능한 Context 실패 시 일시정지하고 가능한
  경우 시간과 설정을 보존하며 전체 채보를 활성화하고 범위가 제한된 간결한 오류
  하나와 Renderer 재시도 하나를 제공한다. 안전한 Context 복원 뒤 무효화된 Resource를
  다시 생성한다.
- 동등한 경로: 안정적인 채보 정체성과 요약, 정확한 시간, 조작 가능한 Transport,
  비색상 손 단서 및 구조화된 전체 채보·열 근거를 노출한다.
- 검증: 초기화 실패, `webglcontextlost`, 안전한 복원, 복구 불가능한 상실, 재시도,
  Safari와 다른 지원 Browser, 음원 없는 재생, Reduced Motion, Keyboard Control 및
  상태 보존
- 재검토 Trigger: Renderer 기술이 바뀌거나, Fallback 동등성이 실패하거나, Browser
  지원이 실질적으로 바뀌거나, 접근성 검증에서 누락된 과업 경로가 발견될 때
- 지배 브리프: [채보 뷰어](./07-chart-viewer-page-brief.ko.md)

### `SP-05` 단일 계열 5축 커뮤니티 패턴 레이더

- 분류: `특수 계약`
- 상태: `Approved`
- 소유자: `NosLog 유지관리자`
- 지배 편차: 일반 비교 지침은 정확한 다중 값 비교에 익숙한 Cartesian 형식을
  선호하고 모양만으로 해석하는 것을 경고한다.
- 필요: 안정적인 하나의 리듬게임 패턴 Fingerprint는 선택 채보의 커뮤니티 평가
  경향을 빠르게 인식하게 하며 정확한 비교는 별도로 계속 제공한다.
- 범위 안: 승인된 고정 순서·고정 Scale의 계단, 연타, 폴리리듬, 즈레, 동치에 대한
  선택 채보 커뮤니티 집계만
- 범위 밖: 사용자 Profile, 랭킹, 점수 이력, 다중 채보 비교, 개인 Overlay, 여러
  Radar 계열 또는 커뮤니티 Radar 축으로서 글리산도
- 승인 동작: 계열 하나만 사용하고 5축 순서와 Scale을 안정적으로 유지하며 같은 값을
  두 번째 막대 Chart로 중복하지 않고 모양이나 색을 정확한 근거로 취급하지 않는다.
- 동등한 경로: 다국어 축 이름, 구조화된 정확한 값, 평가 인원, 집계 상태 및 간결한
  Text 해석을 시각화와 연결한다.
- 검증: 1·2명 집계 중, 3명 이상 집계, 빈 상태·오류, `320`, 대표 `390`, Desktop,
  Keyboard·Screen Reader 읽기 순서, 고대비, 비색상 단서 및 세 Locale
- 재검토 Trigger: 5축 분류가 바뀌거나, 다른 과업에 Radar를 요구하거나, 중첩 계열을
  제안하거나, 검증에서 모양이 승인된 인식 과업을 돕지 않고 방해할 때
- 지배 브리프: [악곡 상세](./05-music-detail-page-brief.ko.md)

### `SP-06` 보조 공식 X 위젯

- 분류: `외부 Runtime 특수 계약`
- 상태: `Approved`
- 소유자: `NosLog 유지관리자`
- 지배 편차: 핵심 NosLog 콘텐츠는 일반적으로 Third-party Runtime이 Page·Browser
  데이터를 받지 않아도 통제되고 다국어화되며 시험 가능하고 사용할 수 있다.
- 필요: NOSTALGIA는 공식 X 계정으로 공식 소식을 발행하며 원문 게시물은 사용자가
  빠르게 발견해야 하는 권위 있는 Source다.
- 범위 안: 핵심 검색, 목적지, 연동 및 NosLog 공지 뒤의 홈 공식 소식 Section에서 X
  공식 Embed 방식으로 승인된 최신 공식 원문 게시물 표시
- 범위 밖: 핵심 내비게이션, 검색, 데이터 연동, 서비스 Alert, NosLog 작성 공지,
  유료 API 우회, Scraping, 중복 Embed 또는 원문 게시물의 번역본 표현
- 승인 동작: Widget을 보조 콘텐츠로 취급하고 핵심 콘텐츠 뒤에 불러오며 원문 언어를
  보존하고 주변 Label을 다국어화하며 승인된 개인정보 브리프와 일관되게 Third-party
  개인정보 동작을 공개하거나 처리한다.
- Fallback과 복구: 공식 NOSTALGIA 계정으로 가는 안정적인 다국어 Link를 유지한다.
  Script가 느리거나 차단되거나 사용할 수 없거나 사용 불가능한 크기로 Rendering될 때
  무기한 Skeleton, 깨진 빈 Frame 또는 차단된 핵심 과업을 남기지 않는다.
- 검증: Script 차단, 추적 방지, 느린 응답, Offline, 보호되거나 사용할 수 없는
  콘텐츠, `0 × 0` iframe, 세 Locale, Compact·Wide Layout 및 핵심 홈 과업 가용성
- 재검토 Trigger: X가 Embed 가용성이나 데이터 수집을 바꾸거나, 공식 소식 Source가
  바뀌거나, Widget이 사용할 수 있는 콘텐츠를 안정적으로 표시하지 못하거나,
  개인정보 정책 요구가 바뀔 때
- 지배 브리프: [홈](./03-home-page-brief.ko.md) 및
  [개인정보·데이터 관행](./18-privacy-data-practices-page-brief.ko.md)

## 명시적 비등록 항목

다음 승인·관찰 항목을 예외로 전환하면 안 된다.

| 항목                                                                                                                             | 올바른 처리                          |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Basic/Recital, 난이도, Rank, 점수 구간, 판정, 손, 빙고, 검정, 공식 Grade 및 4마디 의미                                           | 관련 페이지 브리프의 도메인 불변조건 |
| Compact Modal과 Wide Popover, Pointer Hover·Focus Preview와 Touch 이동, Compact 목록 우선과 Wide 목록·지도                       | 정상 반응형 또는 기능 적응           |
| 2.0 이후 관리자 재설계, Recital 뷰어·에디터 강약 및 실시간 공동 편집                                                             | 범위 경계 또는 Future Work           |
| 현행 Wide Screen 고정 `390px` 셸, 중첩된 채보 Preview `main`, 불완전한 Custom Composite Keyboard 동작 및 숨겨진 `0 × 0` X iframe | 제거하거나 수정할 구현 부채          |

## 집중 레퍼런스 수렴

집중 검토는 독립 출처 최소 12개 요구를 넘고 15개 이후에도 조사를 이어가, 추가
출처가 분류, 승인, 격리, Fallback, 생명주기 또는 검증 Model을 더는 실질적으로
바꾸지 않을 때까지 진행했다.

| 근거 그룹               | 대표 출처                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 적용 가능한 결론                                                                                                                                                             | 한계                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 기여와 등록 승인        | [GOV.UK 제안 과정](https://design-system.service.gov.uk/community/propose-a-component-or-pattern/), [GOV.UK 기여 기준](https://design-system.service.gov.uk/community/contribution-criteria/), [USWDS 성숙도 모델](https://designsystem.digital.gov/maturity-model/), [Carbon 컴포넌트 체크리스트](https://carbondesignsystem.com/contributing/component-checklist/), [NHS 패턴](https://service-manual.nhs.uk/design-system/patterns), [PatternFly 컴포넌트 그룹](https://www.patternfly.org/component-groups/about-component-groups/) | 검증된 필요, 고유성, 대표 사용, 일관성, 범용성, 접근성 및 근거부터 확인한다. 제품 특화 작업은 공통 파운데이션을 계속 사용하면서도 공용 Library 밖에 남을 수 있다.            | 대규모 다중 팀 시스템에는 NosLog에 없는 역할이 있다. 사용자가 단일 최종 승인자로 남는다. |
| 상태와 생명주기         | [Primer 컴포넌트 생명주기](https://primer.style/contribute/component-lifecycle/), [Atlassian Release 단계](https://atlassian.design/release-phases), [Atlassian 기여](https://atlassian.design/resources/contribution), [Spectrum 원칙](https://spectrum.adobe.com/page/principles/)                                                                                                                                                                                                                                                    | 상태, Version, 시험, 문서, 반응형 동작, 접근성, Production 근거, 폐기 및 Migration이 성숙도를 보이게 한다.                                                                   | NosLog에는 기업 Release 관료제나 안정적인 도메인 계약의 달력 만료가 필요하지 않다.       |
| 결정 기록               | [MADR](https://adr.github.io/madr/), [AWS ADR 과정](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html), [Google Cloud ADR 개요](https://docs.cloud.google.com/architecture/architecture-decision-records)                                                                                                                                                                                                                                                                        | Context, 대안, 결정, 결과, 상태 및 이력을 기록하고 실질적인 결정은 조용히 바꾸지 않고 대체한다.                                                                              | Architecture Template에는 NosLog 디자인·접근성·제품 전용 Field를 추가해야 한다.          |
| 경계가 있는 접근성 예외 | [W3C Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [W3C Orientation](https://www.w3.org/WAI/WCAG21/Understanding/orientation), [W3C Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)                                                                                                                                                                                                                                                                                        | 실제 공간 예외는 필요한 영역에만 적용한다. 주변 콘텐츠는 계속 Reflow하며 양쪽 방향이 작동하면 방향을 강제하지 않고 Drag 상호작용은 진짜 필수가 아니면 비 Drag 대안을 가진다. | WCAG는 최소 적합성 경계를 정하며 NosLog Layout이나 시각 Styling을 정하지 않는다.         |
| 특수 Runtime            | [MDN WebGL Context 복원](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event), [MDN Context 상실 감지](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isContextLost), [X 공식 Embed](https://help.x.com/en/using-x/embed-x-feed), [X for Websites 개인정보](https://help.x.com/en/x-for-websites-ads-info-and-privacy)                                                                                                                                                | GPU와 Third-party Runtime은 실패하거나 외부 데이터를 수집할 수 있다. 생명주기 복구, 기능 Fallback, 개인정보 처리 및 실패 격리가 계약에 포함된다.                             | Platform 문서는 NosLog 문구, 시각 처리 또는 제품 우선순위를 정하지 않는다.               |

## 결정 로그

| ID        | 결정                                                                                | 근거                                                                                                                                                    | 상태       |
| --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `EXC-D01` | 모든 도메인 규칙을 예외로 취급하지 않고 하나의 특수 패턴 및 예외 등록부를 사용한다. | 지배받는 편차를 도메인 진실, 정상 적응, 범위 경계 및 구현 부채와 분리한다.                                                                              | `Approved` |
| `EXC-D02` | 영구 특수 계약은 임의 만료 없이 Trigger 기반으로 재검토한다.                        | 안정적인 도메인 필요는 날짜로 만료되면 안 되지만 범위, 근거, 기술, 접근성 또는 재사용이 바뀌면 다시 검토해야 한다.                                      | `Approved` |
| `EXC-D03` | 임시 예외는 제거 Milestone과 대체 경로를 요구한다.                                  | 단기 구현 한계가 제품 규칙으로 조용히 영구화되는 것을 막는다.                                                                                           | `Approved` |
| `EXC-D04` | 사용자·NosLog 유지관리자만 예외를 승인하고 후속 AI는 제안만 할 수 있다.             | Claude Design과 미래 Codex 단계 전반에서 승인된 디자인 결정 권한을 보존한다.                                                                            | `Approved` |
| `EXC-D05` | `SP-01`부터 `SP-06`까지 최초 승인 특수 계약과 경계가 있는 예외로 등록한다.          | 각 항목은 이미 승인된 사용자 필요와 페이지 브리프 계약을 가지며 등록부는 제품 결정을 다시 열지 않고 격리, Fallback, 검증 및 재검토 거버넌스를 추가한다. | `Approved` |

## 후속 Handoff 계약

- Claude Design은 범위 안의 각 특수 계약과 Fallback, 상태 및 경계를 표현해야
  한다. 승인된 규칙 안에서만 시각 구성을 다듬을 수 있다.
- Claude Design은 새 `Proposed` 기록과 승인 없이 특수 패턴을 다른 페이지 Family로
  복사하거나 로컬 예외를 전역 컴포넌트로 만들면 안 된다.
- 미래 Codex 구현은 각 기록을 Code, 가능한 자동 검사, Browser 수용 기준 및 수동
  접근성 검증에 Mapping해야 한다.
- 승인된 페이지 브리프, 이 등록부 및 후속 디자인이 충돌하면 사용자 검토를 위해
  디자인 또는 구현을 중단해야 하며 조용히 해석해서는 안 된다.
- 현행 구현 부채가 겉으로 승인 예외와 비슷해도 계속 부채로 남는다.

## 승인 체크리스트

- [x] 사용자가 분류 모델과 거버넌스 접근을 승인했다.
- [x] 사용자가 `SP-01`부터 `SP-06`까지 승인했다.
- [x] 영구·임시 생명주기 규칙이 명시돼 있다.
- [x] 사용자 전용 승인 권한이 명시돼 있다.
- [x] 정상 적응, 범위 경계 및 구현 부채가 제외돼 있다.
- [x] 영어 정본과 한국어 동반 문서가 같은 실질 요구사항을 포함한다.
- [ ] 파운데이션 값, 컴포넌트 Anatomy 및 하이파이 처리는 이후 승인 단계로 남는다.
