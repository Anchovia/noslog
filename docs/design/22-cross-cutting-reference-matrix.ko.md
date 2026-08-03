# NosLog 2.0 교차 영역 레퍼런스 매트릭스

## 문서 관리

- 상태: `승인된 교차 영역 원칙 및 근거 기준선 — 값은 후속 Foundation 문서에서 관리`
- 조사일: 2026-08-03
- 마지막 결정 갱신일: 2026-08-04
- 정본 언어: 영어
- 영어 정본:
  [22-cross-cutting-reference-matrix.md](./22-cross-cutting-reference-matrix.md)
- 범위: NosLog 2.0 제품 계층, 시각 파운데이션, 반응형 시스템, 다국어
  타이포그래피, 상호작용 상태, 모션, 데이터 시각화를 위한 교차 영역 근거
- 입력: 문서 `01`–`21`의 승인된 제품 감사, 정보 구조, 페이지 브리프,
  일관성 감사; 현재의 주요 표준; 공식 디자인 시스템; 현행 프로덕션 제품;
  리듬게임 도메인 레퍼런스
- 제외: 최종 폰트, 색상, 토큰 값, 브레이크포인트, 컴포넌트 스타일,
  하이파이 화면, 애플리케이션 구현

이 문서만으로 최종 시각 값이나 하이파이 디자인을 선택하지 않는다. 근거를
분류하고 수렴점과 불일치를 기록하며, 이제 사용자와 승인한 10개 교차 영역
원칙을 포함한다. 이 원칙은 값을 미리 승인하지 않으면서 다음 파운데이션 조사와
표본 단계를 지배한다.

후속 문서 `25`는 Pretendard JP와 공용 사용자 표시용 `12px` 하한을 승인합니다.
아래의 과거 해석 경계는 당시 `PR-05`가 무엇을 선택하지 않았는지 보여주는
근거이며 이후 결정을 다시 열지 않습니다.

## 관련 문서

- [현재 제품 감사](./01-current-product-audit.ko.md)
- [정보 구조](./02-information-architecture.ko.md)
- [디자인 가이드 일관성 감사](./21-design-guide-consistency-audit.ko.md)
- [특수 패턴 및 예외 등록부](./23-specialized-pattern-exception-register.ko.md)

## 조사 방법

### 근거 역할

레퍼런스는 서로 바꿔 쓸 수 없다. 각 출처는 합리적으로 뒷받침할 수 있는
역할에만 사용한다.

| 역할 | 근거 분류                                      | 올바른 사용                                                              | 잘못된 사용                                            |
| ---- | ---------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------ |
| `A`  | 규범 표준과 권위 있는 접근성·국제화 지침       | 타협할 수 없는 접근성, 시맨틱, 언어, 리플로우, 사용자 선호 요구사항      | 시각 아트 디렉션 또는 NosLog 도메인 의미               |
| `B`  | 유지 관리되는 공식 디자인 시스템과 플랫폼 지침 | 검증된 파운데이션 모델, 토큰 역할, 반응형 패턴, 상호작용 구조, 구현 제약 | 브랜드 값, 정확한 브레이크포인트, 컴포넌트 스타일 복사 |
| `C`  | 현재 운영 중인 프로덕션 서비스                 | 정보 밀도, 계층, 콘텐츠 리듬, 적응 방식, 실사용 절충 관찰                | 하나의 라이브 페이지를 보편 표준으로 취급              |
| `D`  | 공식 게임 자료와 리듬게임 제품                 | 도메인 용어, 점수 관계, 자켓·채보 정체성, 비교 과업, 아케이드 맥락 확립  | 다른 게임의 메커니즘, 라벨, 시각 표면 이식             |
| `E`  | 편집 디자인과 아트 디렉션 레퍼런스             | 비례, 타이포그래피 대비, 페이싱, 구성, 이미지, 브랜드 표현 연구          | 접근성, 내비게이션 동작, 고밀도 제품 상호작용 결정     |

### 독립성과 포화 규칙

1. 현지화 사본, 미러, 검색 결과 페이지, 같은 규칙을 되풀이하는 여러 URL은
   독립 근거로 세지 않는다.
2. 표준과 프로덕션 사례는 서로 다른 이유로 같은 원칙을 뒷받침할 수 있다.
   빈도를 증명으로 취급하지 않고 두 역할을 모두 기록한다.
3. 기존 문서 `01`–`21`에는 200개가 넘는 도메인에서 가져온 수백 개의 인용
   URL이 있다. 이 매트릭스는 여러 페이지 패밀리 또는 향후 파운데이션 결정에
   영향을 주는 출처만 추린다.
4. 앞으로의 중요 결정은 여전히 독립적이고 관련성 있는 출처를 최소 12개,
   신뢰할 만한 근거가 더 있을 경우 15개 이상 비교해야 한다. 이 매트릭스는
   재사용 가능한 출발 자료이지 면제 조건이 아니다.
5. 현재의 마케팅·제품 페이지는 조사일 기준으로 검토했으며 변경될 수 있다.
   이후 표본을 확정하기 전에 관찰한 시각 동작을 다시 확인해야 한다.
6. 레거시 NOSTORY Figma는 지배 근거에서 의도적으로 제외했다. 루트
   `AGENTS.md` 제약 아래에서 역사적 근거로만 남는다.

## 조사 범위 요약

| 클러스터                       | 핵심 질문                                                                                          | 근거 조합          | 이 단계의 결과                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| 접근성과 국제화                | 무엇이 지각 가능하고, 조작 가능하고, 이해 가능하고, 견고하며, 언어적으로 올바르게 유지돼야 하는가? | `A`, `B` 보조      | 제약을 식별함. 정확한 시각 처리는 열어 둠                      |
| 반응형 레이아웃과 밀도         | 하나의 제품이 `320 CSS px`부터 넓은 분석 레이아웃까지 어떻게 적응해야 하는가?                      | `A`, `B`, `C`      | 콘텐츠 중심 적응은 수렴함. 브레이크포인트 값은 열어 둠         |
| 타이포그래피와 계층            | 한국어, 일본어, 영어, 제목, 수치, 고밀도 메타데이터가 어떻게 공존해야 하는가?                      | `A`, `B`, `C`, `E` | 시맨틱 역할과 시험 방법은 수렴함. 서체와 스케일은 열어 둠      |
| 다크 색상, 표면, 상태          | NosLog를 어떻게 어둡고, 읽기 쉽고, 계층적이며, 시맨틱하게 일관되게 만들 것인가?                    | `A`, `B`, `C`      | 역할 기반 중립 레이어는 수렴함. 팔레트 값은 열어 둠            |
| 간격, 엘리베이션, 아이콘, 모션 | 리듬, 그룹화, 깊이, 행동 인식, 변화를 어떻게 표현할 것인가?                                        | `A`, `B`, `E`      | 목적 중심 시스템은 수렴함. 기본 단위와 표현은 열어 둠          |
| 데이터 시각화와 고밀도 비교    | 점수 이력, 분포, 랭킹, 레이더 프로필, 채보 콘텐츠를 어떻게 비교할 것인가?                          | `A`, `B`, `C`, `D` | 중복 인코딩과 과업별 형식은 수렴함. 차트별 처리는 열어 둠      |
| 리듬게임 도메인과 아트 디렉션  | 다른 서비스나 레거시 표면을 복사하지 않고 무엇을 NosLog답게 만들 것인가?                           | `C`, `D`, `E`      | 도메인 진실성과 절제된 표현은 수렴함. 최종 시각 언어는 열어 둠 |

## 매트릭스 A — 접근성과 국제화

| 출처                                                                                                                                 | 역할 | 전이 가능한 근거                                                                                              | NosLog 적용성과 한계                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                            | `A`  | 대비, 리플로우, 크기 조절, 포커스, 타깃 크기, 키보드 접근, 드래그 대안, 상태, 입력 동작의 AA 기준을 정의한다. | 모든 공개·인증 화면을 지배한다. NosLog 스타일은 정하지 않는다.                                             |
| [WAI: Designing for Web Accessibility](https://www.w3.org/WAI/tips/designing/)                                                       | `A`  | 구조, 라벨, 대비, 대안, 예측 가능한 상호작용, 이해 가능한 피드백을 디자인 과정에 통합한다.                    | 접근성을 코드 단계로 미루지 않고 표본과 브리프에서 확인하게 한다.                                          |
| [WCAG: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)                                                              | `A`  | 두 차원이 본질적인 경우를 제외하면 정의된 줌 대응 폭에서 2차원 스크롤 없이 콘텐츠가 리플로우돼야 한다.        | 승인된 `320 CSS px` 계약을 지지하면서, 본질적인 2차원 채보·에디터 영역은 경계 안에서 유지한다.             |
| [WCAG: Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)                                                  | `A`  | 사용자가 행간, 문단, 단어, 자간을 조절해도 콘텐츠나 기능이 깨지지 않아야 한다.                                | 긴 한국어·일본어·영어 라벨을 잘리는 고정 높이 셸에 의존할 수 없다.                                         |
| [WCAG: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)                                        | `A`  | 일반 텍스트는 최소 `4.5:1`, 조건을 만족하는 큰 텍스트는 `3:1`이 필요하다.                                     | 다크 표면, 캡션, 메타데이터, 차트 라벨, 비활성 문구에 적용한다. 팔레트가 아니라 최저선이다.                |
| [WCAG: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                        | `A`  | 상호작용 경계, 포커스 표시, 본질적인 그래픽 객체에는 충분한 대비가 필요하다.                                  | 손 구분 테두리, 차트 선, 선택 상태, 입력 윤곽, 데이터 마크를 독립적으로 검증해야 한다.                     |
| [WCAG: Content on Hover or Focus](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html)                        | `A`  | 추가 hover/focus 콘텐츠는 필요한 경우 닫을 수 있고, hover할 수 있고, 유지되며, 키보드로 접근 가능해야 한다.   | 승인된 데스크톱 기록 미리보기를 지배한다. 터치에서 hover를 재현해야 한다는 뜻은 아니다.                    |
| [WCAG: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)                                  | `A`  | 포인터 타깃은 최소 유효 영역 또는 정당한 간격·시맨틱 예외가 필요하다.                                         | 리듬게임 데이터를 시각적으로 조밀하게 유지해도 조작 타깃은 사용 가능해야 한다.                             |
| [WCAG: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)                    | `A`  | 상호작용으로 발생하는 비필수 모션이 전정기관 불편을 일으킬 수 있으면 비활성 방법이 필요하다.                  | 모션 토큰은 필요한 상태 변화와 표현적 움직임을 구분해야 한다.                                              |
| [WAI-ARIA APG: Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)                                    | `A`  | 복합 컨트롤은 예측 가능한 포커스, 보이는 포커스, 키보드 조작, 명확한 비활성 동작이 필요하다.                  | 범위 선택기, 필터, 메뉴, 탭, 뷰어, 다이얼로그, 에디터 컨트롤에 적용한다. 정확한 컴포넌트는 열어 둔다.      |
| [한국어 텍스트 레이아웃 및 타이포그래피 요구사항](https://www.w3.org/TR/klreq/)                                                      | `A`  | 한국어 조판에는 고유한 줄바꿈, 문장부호, 간격, 혼합 문자 요구사항이 있다.                                     | 한국어를 번역 문자열만 넣은 라틴 텍스트처럼 다루지 않게 한다. 실제 한글 콘텐츠 표본이 필요하다.            |
| [일본어 조판 요구사항](https://www.w3.org/TR/jlreq/)                                                                                 | `A`  | 일본어 조판에는 적절한 줄바꿈, 문장부호 처리, 가나, 라틴 혼합, 루비를 고려한 결정이 필요하다.                 | 원문 제목과 공식 읽기에 관련된다. NosLog는 가로 UI이므로 인쇄·세로쓰기 규칙은 선택적으로 전이한다.         |
| [CSS Text Module Level 3](https://www.w3.org/TR/css-text-3/)                                                                         | `A`  | 언어별 줄바꿈, 단어 경계, 공백, 정렬, 양끝 맞춤 동작을 정의한다.                                              | 명시적 언어 태그와 `line-break`/`word-break` 시험을 지지한다. 제목 말줄임 정책까지 단독으로 정하지 않는다. |
| [Unicode LDML](https://www.unicode.org/reports/tr35/)                                                                                | `A`  | 로케일 데이터는 식별자, 날짜, 숫자, 정렬, 표시명, 줄바꿈 선호를 지배한다.                                     | 한국어·일본어·영어 점수·날짜 형식은 로케일에 맞추되 게임 용어와 식별자는 안정적으로 유지한다.              |
| [W3C: 번역 페이지로 사용자 안내](https://www.w3.org/International/questions/qa-site-conneg)                                          | `A`  | 브라우저 언어 협상은 초기 힌트이며, 명시적 언어 선택을 제공하고 기억해야 한다.                                | 승인된 로케일 경로와 공개 설정을 지지하며 자동 감지를 되돌릴 수 없게 만들지 않는다.                        |
| [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) | `B`  | 확립된 미디어 기능으로 사용자의 비필수 모션 축소·대체 요청을 감지한다.                                        | 모션 파운데이션의 구현 수단을 제공한다. 브라우저 지원이 어떤 NosLog 모션이 필수인지는 정하지 않는다.       |

### 매트릭스 A 종합

- 접근성은 최종 감사 계층이 아니라 타이포그래피, 레이아웃, 상태, 모션,
  차트, 콘텐츠의 구조적 입력이다.
- NosLog는 캡션, 타깃, 차트 선, 포커스 표시를 지각하기 어려운 수준으로
  줄여서 조밀함을 해결할 수 없다.
- 한국어, 일본어, 영어는 하나의 고정 상자에 넣는 세 문자열이 아니라 서로
  다른 조판 시스템으로 시험해야 한다.
- 채보 뷰어와 미래 에디터는 정말로 2차원인 작업 영역을 유지할 수 있지만,
  주변 컨트롤, 설명, 내비게이션은 여전히 리플로우돼야 한다.

### `PR-09` 집중 접근성 검토

집중 검토는 규범 표준, 유지 관리되는 디자인 시스템, 프로덕션 지침,
Canvas/WebGL 플랫폼, 저작 도구 지침, 접근 가능한 게임 지침, 평가 실무에 걸친
관련 문서 30개 이상을 비교했다. 아래 표는 NosLog 결정을 실질적으로 바꾸거나
경계를 정한 출처를 남긴다. 신뢰할 만한 출처를 더 추가해도 수렴점이 더 이상
달라지지 않는 시점에 검토를 중단했다.

| 초점                                        | 대표 근거                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 전이 가능한 수렴점과 한계                                                                                                                                                                                                                                                                              |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 규범 기준선과 복합 상호작용                 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [WCAG 2.2 신규 기준](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/), [WAI 접근성 원칙](https://www.w3.org/WAI/fundamentals/accessibility-principles/), [APG Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/), [APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/), [APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [APG Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [WCAG Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)                                                                                                                                                                                                     | WCAG 2.2 AA를 디자인·출시 목표로 삼는다. 네이티브 의미론을 우선하고 custom composite에는 완전한 키보드, focus, name, role, value, state, announcement 모델이 필요하다. APG는 구현 지침이지 상호작용 계약 없이 role만 붙일 권한이 아니다.                                                               |
| 유지 관리되는 디자인 시스템과 프로덕션 실무 | [Atlassian Accessibility](https://www.atlassian.com/accessibility), [Atlassian 디자인 지침](https://design-system-docs-proxy.services.atlassian.com/foundations/accessibility), [USWDS Accessibility](https://designsystem.digital.gov/documentation/accessibility/), [Carbon Accessibility](https://carbondesignsystem.com/guidelines/accessibility/overview/), [Fluent 2 Accessibility](https://fluent2.microsoft.design/accessibility), [Primer Accessibility](https://primer.style/accessibility/foundations/), [Shopify Polaris Accessibility](https://polaris-react.shopify.com/foundations/accessibility), [Adobe Spectrum Principles](https://spectrum.adobe.com/page/principles/)                                                                                                     | 접근 가능한 컴포넌트는 기준선이지 조합된 화면이나 전체 과업의 접근성을 증명하지 않는다. 디자인 handoff에는 읽기·focus 순서, 이름, 상태, 키보드 동작, 비색상 단서, 반응형 동작을 주석으로 남겨야 한다. 브랜드 스타일은 이 계약을 덮어쓰지 않는다.                                                       |
| Canvas와 WebGL                              | [MDN `canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas), [WHATWG Canvas](https://html.spec.whatwg.org/multipage/canvas.html), [PixiJS Accessibility](https://pixijs.download/dev/docs/accessibility.html)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 그려진 pixel은 자동으로 시맨틱 객체를 노출하지 않는다. 안정적인 설명, 컨트롤, 구조화된 근거, 동등한 과업 경로를 의도적으로 설계해야 한다. DOM overlay는 선택된 객체를 보조할 수 있지만 완전한 접근성 전략이 아니며 관리되지 않는 Tab 정지 수백 개를 만들면 안 된다.                                    |
| 저작 도구, 드래그, 크기 조절                | [ATAG 개요](https://www.w3.org/WAI/standards-guidelines/atag/), [SAP Accessibility Design Tools](https://sap.github.io/accessibility-design-tools/doc/Accessibility_Design_Tools_Second_Edition.pdf), [WCAG Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 미래 사용자 에디터는 그 자체로 조작 가능해야 하며 콘텐츠 저작자를 지원해야 한다. 드래그 전용 생성, 선택, 이동, 크기 조절, 경로 편집, 패널 크기 조절에는 실행 취소, 피드백, 복구가 있는 단일 포인터·키보드 대안이 필요하다.                                                                             |
| 전문 시각·공간 제품                         | [Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines), [XAG Input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107), [XAG Redundant Cues](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103), [XAG Motion](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117), [GOV.UK 기본 접근성 검사](https://www.gov.uk/government/publications/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one/doing-a-basic-accessibility-check-if-you-cant-do-a-detailed-one), [Minnesota 접근 가능한 대화형 지도](https://mn.gov/mnit/assets/Accessibility%20Guide%20for%20Interactive%20Web%20Maps_tcm38-403564.pdf) | 전문 시각 표현이 과업의 대상일 때는 유지할 수 있지만 핵심 정보와 행동에는 중복 채널과 동등한 경로가 필요하다. 목록은 지도를 완전히 보완할 수 있고, 안정적인 채보 요약과 구조화된 전체 악보는 모든 시각 frame을 읽는 척하지 않으면서 motion을 보완할 수 있다.                                           |
| 평가와 출시 근거                            | [W3C 웹 접근성 평가](https://www.w3.org/WAI/test-evaluate/), [W3C 평가 도구 선택](https://www.w3.org/WAI/test-evaluate/tools/selecting/), [W3C 적합성: 전체 페이지와 완전한 프로세스](https://www.w3.org/WAI/WCAG20/Understanding/conformance.html), [Playwright 접근성 테스트](https://playwright.dev/docs/next/accessibility-testing), [Deque 자동 접근성 커버리지](https://www.deque.com/automated-accessibility-coverage-report/)                                                                                                                                                                                                                                                                                                                                                          | 자동 검사는 가치 있는 결함 유형을 찾지만 접근성이나 완전한 적합성을 확립할 수 없다. 대표적인 완전한 과업에는 자동 검사와 함께 숙련된 키보드, screen reader, 확대, 텍스트 간격, 대비 모드, motion 선호, touch, browser 평가가 필요하다. 가이드는 목표를 정하지만 그 평가 전에 적합성을 주장하지 않는다. |

현재 NosLog 근거도 같은 경계를 뒷받침한다. 렌더링된 홈은 현재 건너뛰기
link와 식별 가능한 banner, navigation, main, footer landmark를 노출한다. 현재
관리자 채보 미리보기에는 중첩된 `main` landmark가 있고 tab/Canvas 계약은
아직 승인된 최종 뷰어 계약이 아니다. 노트 에디터는 포인터 중심
`role="application"` 영역을 노출하지만, 현재 코드와 브라우저 근거에서는 노트
생성, 선택, 이동, 크기 조절, 삭제에 동등한 키보드 편집이 검증되지 않았다.
이는 차후 2.0 작업을 위한 관찰된 구현 gap이며 이 가이드 단계에서 renderer를
재설계할 권한이 아니다. [현재 제품 감사](./01-current-product-audit.ko.md),
[채보 뷰어 브리프](./07-chart-viewer-page-brief.ko.md),
[오락실 탐색 브리프](./12-arcade-discovery-page-brief.ko.md),
[채보 에디터 기여 브리프](./20-chart-editor-contribution-page-brief.ko.md)를
참고한다.

## 매트릭스 B — 반응형 레이아웃, 그리드, 밀도

| 출처                                                                                                                | 역할 | 전이 가능한 근거                                                                                                             | NosLog 적용성과 한계                                                                                          |
| ------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)                                   | `B`  | 모바일 우선 변형과 컨테이너 쿼리로 실제 뷰포트 또는 부모 공간에 맞춰 적응하며 기본 브레이크포인트는 변경 가능하다.           | 프로젝트 스택에 맞는다. Tailwind 기본값은 구현 편의이지 승인된 NosLog 브레이크포인트가 아니다.                |
| [Tailwind CSS: Grid Template Columns](https://tailwindcss.com/docs/grid-template-columns)                           | `B`  | 시맨틱 순서를 바꾸지 않고 열 수, span, intrinsic sizing을 바꿀 수 있다.                                                      | 홈 링크, 악곡 그리드, 랭킹, 프로필 모듈에 유용하다. 열 수는 실제 콘텐츠 시험이 필요하다.                      |
| [MDN: CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | `B`  | 컴포넌트가 기기 폭을 추정하는 대신 자신에게 배정된 컨테이너에 적응할 수 있다.                                                | 같은 악곡 카드, 지표, 컨트롤이 다른 페이지 구성에 나타날 때 중요하다.                                         |
| [CSS Containment Level 3](https://www.w3.org/TR/css-contain-3/)                                                     | `A`  | 컨테이너 크기·스타일 쿼리와 containment 영향을 정의한다.                                                                     | 표준 근거를 제공한다. intrinsic sizing이나 overlay를 깨는 containment는 피해야 한다.                          |
| [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout)                           | `B`  | 화면, 방향, 크기 조절 창, 텍스트 크기, 로케일, safe area에 자연스럽게 적응하면서도 알아볼 수 있어야 한다.                    | 폭이 달라도 하나의 일관된 제품을 지지한다. Apple 플랫폼 치수는 웹 토큰이 아니다.                              |
| [Fluent 2: Layout](https://fluent2.microsoft.design/layout)                                                         | `B`  | 간격은 관계를 표현하며 그리드는 고정·유동·혼합일 수 있고, reflow·resize·reposition·show/hide는 다른 전략이다.                | 콘텐츠 중심 적응과 의도적인 데스크톱 공간을 지지한다. 브레이크포인트 범위는 비교 자료일 뿐이다.               |
| [Primer: Layout](https://primer.style/product/getting-started/foundations/layout/)                                  | `B`  | 복잡한 제품에는 집중되고 차분한 레이아웃과 세밀한 반응형 시나리오가 필요하며 `320px`은 지원 하한이지 디자인 캔버스가 아니다. | NosLog의 고밀도 웹 제품 요구와 가깝다. Primer 폭과 패딩 값은 가져오지 않는다.                                 |
| [Carbon: 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/)                                        | `B`  | 그리드는 여러 밀도와 표현 맥락을 지원하며 글자, 컴포넌트, 페이지 영역을 정렬한다.                                            | 체계적 정렬에 유용하다. Carbon의 엔터프라이즈 구성은 NosLog 템플릿이 아니다.                                  |
| [USWDS: Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/)                                       | `B`  | 모바일 우선 그리드는 컨테이너, 행, 열, 거터, 최대 폭 결정을 분리한다.                                                        | 명시적 레이아웃 구조와 가변 페이지 폭을 지지한다. 기본 12열/1024px을 자동 채택하지 않는다.                    |
| [GOV.UK: Layout](https://design-system.service.gov.uk/styles/layout/)                                               | `B`  | 작은 화면 단일 열에서 시작하고 읽기 폭을 제한하며 콘텐츠가 필요할 때만 넓힌다.                                               | 정책·온보딩 콘텐츠의 가독성을 지지한다. 고밀도 채보, 랭킹, 에디터는 다른 데스크톱 폭이 정당하다.              |
| [GOV.UK: Spacing](https://design-system.service.gov.uk/styles/spacing/)                                             | `B`  | 작은 간격은 안정적으로 유지하고 큰 섹션 간격은 화면 크기에 반응할 수 있다.                                                   | 조밀한 컨트롤과 큰 데스크톱 리듬의 비교에 유용하다. `5px` 스케일은 하나의 보편 base를 가정하지 말라는 근거다. |
| [Atlassian: Spacing](https://atlassian.design/foundations/spacing)                                                  | `B`  | 제한된 스케일이 리듬과 그룹을 만들지만 시각적 보정은 필요할 수 있다.                                                         | 토큰과 문서화된 예외를 지지한다. `8px` base는 `4px`·`5px` 시스템과 생산적으로 충돌하며 아직 선택하지 않는다.  |
| [Atlassian: Elevation](https://atlassian.design/foundations/elevation/)                                             | `B`  | 평면, raised, overlay 레이어는 의도적이어야 하며 다크 환경에서는 그림자만 약하므로 표면 변화가 필요하다.                     | 다크 카드, 메뉴, 다이얼로그, 뷰어 컨트롤에 관련된다. raised 카드 남용은 노이즈를 만든다.                      |
| [Bootstrap: Grid](https://getbootstrap.com/docs/5.3/layout/grid/)                                                   | `B`  | 널리 배포된 반응형 시스템은 사전 정의 브레이크포인트, 컨테이너, 거터의 유용성과 한계를 보여준다.                             | 비교 기준으로만 쓴다. NosLog가 스택을 바꾸거나 Bootstrap 값을 상속하지 않는다.                                |
| [Radix Themes: Layout](https://www.radix-ui.com/themes/docs/overview/layout)                                        | `B`  | 레이아웃 primitive는 접근 가능한 컴포넌트 주변에 예측 가능한 flex, grid, section, container, spacing 동작을 제공한다.        | 현 Radix 기반 스택과 관련된다. 테마 미학은 NosLog 시각 방향이 아니다.                                         |
| [web.dev: Responsive Design](https://web.dev/learn/design/)                                                         | `B`  | 반응형 작업은 미디어 쿼리뿐 아니라 콘텐츠, 타이포그래피, 입력 방식, 이미지, 레이아웃, 사용자 선호를 포함한다.                | 중간 폭에서 터치, 키보드, 포인터, 로케일, reduced motion 시험을 지지한다.                                     |

### 매트릭스 B 종합

- `390px`은 승인된 대표 검토 캔버스이지 고정 애플리케이션 폭이나
  브레이크포인트가 아니다.
- 반응형 동작은 컴포넌트·페이지 패밀리별로 `reflow`, `resize`,
  `reposition`, `progressive disclosure`, 본질적인 제한 overflow 중 무엇인지
  선언해야 한다.
- 데스크톱은 확대한 모바일 페이지가 아니다. 승인된 페이지 브리프의 과업에
  따라 비교, 스캔, 채보 보기, 에디터 생산성을 향상해야 한다.
- 그리드는 콘텐츠를 정렬하지만 정보 우선순위를 정하지 않는다. 읽기 페이지,
  탐색 그리드, 랭킹 표, 채보 뷰어는 하나의 간격·정렬 시스템 안에서 서로 다른
  컨테이너 전략을 사용할 수 있다.

## 매트릭스 C — 타이포그래피, 색상, 표면, 아이콘, 모션

| 출처                                                                                              | 역할 | 전이 가능한 근거                                                                                                         | NosLog 적용성과 한계                                                                                                 |
| ------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [Carbon: Typography](https://carbondesignsystem.com/elements/typography/overview/)                | `B`  | 시맨틱 역할과 계층을 유지하면서 생산적 과업 타이포그래피와 표현적 편집 타이포그래피를 구분한다.                          | 절제된 고밀도 UI와 제한된 표현적 순간을 함께 지원한다. IBM Plex와 Carbon 크기는 선택하지 않는다.                     |
| [Carbon: Color](https://carbondesignsystem.com/elements/color/overview/)                          | `B`  | 중립 레이어가 지배하며 시맨틱 토큰이 raw hex 대신 텍스트, 표면, 테두리, 포커스, 상태, 상호작용을 설명한다.               | NosLog 다크 표면과 손·상태 분리에 강한 모델이다. Carbon 팔레트를 복사하지 않는다.                                    |
| [Carbon: Motion](https://carbondesignsystem.com/elements/motion/overview/)                        | `B`  | 모션에는 일관된 easing·duration 역할이 필요하며 계층, 연속성, 원인을 명확히 해야 한다.                                   | 간결한 모션 어휘를 지지한다. 풍부한 브랜드 모션은 별도 근거와 축소 대안이 필요하다.                                  |
| [Fluent 2: Typography](https://fluent2.microsoft.design/typography)                               | `B`  | 시맨틱 타입 램프와 신뢰할 수 있는 시스템 fallback이 플랫폼 간 계층을 만들고 문장형 표기와 baseline 정렬이 스캔을 돕는다. | UI와 수치 혼합에 유용하다. Fluent 서체와 라틴 중심 예시는 CJK 검증이 필요하다.                                       |
| [Fluent 2: Color](https://fluent2.microsoft.design/color)                                         | `B`  | 중립, 브랜드, 공용, 시맨틱 색은 역할이 다르며 상태는 색상만 의존할 수 없고 다크 팔레트에는 역할별 이동이 필요하다.       | 절제된 브랜드 사용과 명시적 상태 채널을 지지한다. Microsoft 브랜드 역할은 NosLog 역할이 아니다.                      |
| [Fluent 2: Motion](https://fluent2.microsoft.design/motion)                                       | `B`  | 모션은 일관된 매개변수로 관계, 내비게이션, 진입, 이탈, 피드백을 전달한다.                                                | 메뉴, disclosure, 결과 교체, 집중형 뷰어 컨트롤에 유용하다. 값은 아직 승인하지 않는다.                               |
| [Apple HIG: Typography](https://developer.apple.com/design/human-interface-guidelines/typography) | `B`  | 가독성, 확장 가능한 텍스트 스타일, 적은 서체 수, 절제된 weight, 계층 유지, 확대 시험이 핵심이다.                         | 조밀하지만 읽기 쉬운 타입 시스템을 지지한다. 네이티브 point와 Dynamic Type API는 웹 CSS에 직접 대응하지 않는다.      |
| [Apple HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color)           | `B`  | 색상은 일관되게 소통하고 맥락에 적응하며 중복 의미를 피하고 유일한 상태 채널이 되어서는 안 된다.                         | 시맨틱 손·상태 색을 라벨, 아이콘, 형태, 위치와 함께 쓰게 한다. Apple 시스템 팔레트를 복사하지 않는다.                |
| [Apple HIG: Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)   | `B`  | 다크 외형은 단순 반전이 아니며 전경, 이미지, 사용자 색상, 대비, elevated 표면을 별도로 다뤄야 한다.                      | 승인된 다크 방향과 직접 관련된다. NosLog는 Apple 외형 모델을 그대로 따르지 않고 dark-first일 수 있다.                |
| [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)         | `B`  | 모션은 콘텐츠를 가리거나 불편을 일으키지 않으면서 피드백과 공간 연속성을 제공해야 한다.                                  | 기능적 채보·뷰어 모션과 절제된 셸 모션을 지지한다. 네이티브 전환은 웹 처방이 아니다.                                 |
| [Atlassian: Typography](https://atlassian.design/foundations/typography)                          | `B`  | 타이포그래피 토큰은 크기, 행간, weight, 간격, 색, 수치 강조를 조율하고 상대 단위는 사용자 확대를 지원한다.               | 점수·지표 역할과 고밀도 라벨 분리에 유용하다. 가장 작은 제품 크기는 NosLog 가독성 시험이 필요하다.                   |
| [Atlassian: Iconography](https://atlassian.design/foundations/iconography)                        | `B`  | 아이콘은 인식 가능한 은유, 일관된 기하, 읽을 수 있는 기본 크기, 목적 있는 사용, 불명확할 때 텍스트 지원이 필요하다.      | 장식 아이콘을 줄이고 낯선 채보·모드·기여 행동에 라벨을 붙이게 한다. 정확한 stroke/style은 열어 둔다.                 |
| [Atlassian: Motion](https://atlassian.design/foundations/motion)                                  | `B`  | 시맨틱 모션 토큰은 raw duration 대신 의도를 설명하며 명료성이 장식보다 우선한다.                                         | 향후 코드/Figma 매핑을 지지한다. 시스템이 발전 중이므로 단독 권위로 쓸 수 없다.                                      |
| [Primer: Foundations](https://primer.style/product/getting-started/foundations/)                  | `B`  | 색상, 콘텐츠, 아이콘, 레이아웃, 반응형, 타이포그래피가 하나의 제품 파운데이션으로 작동한다.                              | 고밀도 데이터 웹 제품에 강한 비교다. GitHub 시각 정체성은 NosLog 목표가 아니다.                                      |
| [USWDS: Typography](https://designsystem.digital.gov/components/typography/)                      | `B`  | 대부분의 본문에는 편안한 기본 크기, 절제된 작은 글자, 한쪽 정렬, 의미 있는 행간, 여백 기반 그룹화가 유리하다.            | 정책·설명 콘텐츠를 읽기 쉽게 한다. 전문 점수 메타데이터는 대비와 짧은 길이가 검증될 때만 더 작을 수 있다.            |
| [GOV.UK: Type Scale](https://design-system.service.gov.uk/styles/type-scale/)                     | `B`  | 검증된 타입 스케일은 폭 전반에서 글자 크기, 행간, 상대 단위, 수직 리듬을 조율한다.                                       | 스케일 규율을 보여준다. 서체, 정확한 값, 공공 서비스 어조는 전이하지 않는다.                                         |
| [GOV.UK: Colour](https://design-system.service.gov.uk/styles/colour/)                             | `B`  | 기능 색 이름은 hex 복사보다 예측 가능한 의미와 접근성을 더 잘 유지한다.                                                  | 시맨틱 토큰과 일관된 상태 사용을 지지한다. GOV.UK의 밝은 시각 정체성은 적용하지 않는다.                              |
| [Material 3: Typography](https://m3.material.io/styles/typography/overview)                       | `B`  | 역할 기반 display, headline, title, body, label 패밀리가 컴포넌트 전반의 계층을 조율한다.                                | 비교용 분류로 유용하다. 현 공식 사이트는 JavaScript가 필요하며 Material 스케일을 채택하지 않는다.                    |
| [Material 3: Color](https://m3.material.io/styles/color/overview)                                 | `B`  | tonal 역할이 외형 맥락에 따라 표면, 컨테이너, 콘텐츠, 윤곽, accent, 상태를 분리한다.                                     | 다크 tonal 레이어 모델에 유용하다. dynamic color와 Material 컴포넌트 표현은 범위 밖이다.                             |
| [Adobe Spectrum: Foundations](https://spectrum.adobe.com/page/typography/)                        | `B`  | Spectrum은 고밀도 크로스 플랫폼 도구를 위해 타이포그래피, 색상, 레이아웃, 모션을 조율한다.                               | 에디터·제품 비교에 유용하다. 현 사이트가 JavaScript 의존이므로 접근 불가능한 시각 예시만으로 규칙을 승인하지 않는다. |
| [Figma: UI Design Principles](https://www.figma.com/resource-library/ui-design-principles/)       | `B`  | 계층, 점진적 공개, 일관성, 대비, 근접성, 접근성, 정렬이 함께 인지 부담을 줄인다.                                         | NosLog 표본의 평가 언어를 제공한다. 토큰 사양이나 도메인 출처는 아니다.                                              |
| [Google Noto](https://fonts.google.com/noto)                                                      | `B`  | 조율된 글로벌 서체 패밀리가 폭넓은 문자 지원과 호환되는 다국어 질감을 목표로 한다.                                       | 한국어·일본어·라틴 지원 후보군으로 유용하다. 실제 서체, 로딩 비용, metric, 브랜드 적합성은 열어 둔다.                |

### 매트릭스 C 종합

- 파운데이션 시스템은 고립된 값을 hardcode하기보다 역할에 이름을 붙인다.
  NosLog는 결국 Figma와 코드 사이에서 같은 시맨틱 역할을 매핑해야 한다.
- 고밀도 과업 UI와 표현적 편집 순간은 공존할 수 있지만, 표현이 통제되지 않은
  두 번째 타입·색상 시스템을 만들면 안 된다.
- 다크 레이어링은 중립 표면 단계, 테두리, 선택적 그림자로 수렴한다. 그림자만
  사용해서는 충분하지 않다.
- 색상이 손, 난이도, 랭크, 성공, 선택, 상호작용을 동시에 뜻하면 안 된다.
  향후 팔레트에는 충돌 정책이 필요하다.
- 타입 스케일을 승격하기 전에 실제 긴 NOSTALGIA 제목, 긴 아티스트명,
  일본어 읽기, 한국어 번역, 영어 라벨, tabular score, 사용자 텍스트 확대를
  함께 검증해야 한다.

## 매트릭스 D — 데이터 시각화와 고밀도 비교

| 출처                                                                                                                                  | 역할 | 전이 가능한 근거                                                                                                               | NosLog 적용성과 한계                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| [USWDS: Data Visualizations](https://designsystem.digital.gov/components/data-visualizations/)                                        | `B`  | 익숙한 형식을 우선하고, 하나의 중심 아이디어를 전달하며, 맥락을 유지하고, 색상을 단순화하고, 접근 가능한 대안·설명을 제공한다. | 성장 차트, 점수 분포, 랭킹 요약, 오락실 상태를 지배한다. 도메인에 익숙한 레이더를 금지하지 않는다.                 |
| [Carbon: Data-visualization Color Palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)                        | `B`  | 범주형, 순차형, 발산형, 경고 데이터에는 서로 다른 팔레트 논리가 필요하며 이웃 mark를 의도적으로 분리해야 한다.                 | 분포, 이력, 커뮤니티 레이더에 관련된다. Carbon 팔레트 값은 가져오지 않는다.                                        |
| [Tableau: Visual Best Practices](https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm)                       | `B`  | 계층, 중립 중심 색상, 제한된 accent, 기기별 구성, 일관된 인코딩이 분석을 향상한다.                                             | 중요한 지표 우선과 절제된 주목 색을 지지한다. 대시보드 밀도를 통째로 복사하지 않는다.                              |
| [Tableau: Accessible Views](https://help.tableau.com/current/pro/desktop/en-us/accessibility_best_practice.htm)                       | `B`  | 색상은 라벨, 형태, 크기, 위치, 선 처리로 보강해야 하며 기반 데이터와 키보드 접근이 중요하다.                                   | 점수 이력, 랭크 구간, 손 색상, 레이더 축에 적용한다. 텍스트·데이터 대안을 제공해야 한다.                           |
| [Observable: Crafting Data Colors](https://observablehq.com/blog/crafting-data-colors)                                                | `B`  | 팔레트는 작은 mark에서도 지각적으로 분리되고 색각 시험, 소통 가능한 이름, 라이트·다크 시험을 거쳐야 한다.                      | 가는 차트 선과 커뮤니티 축에 유용하다. 한 제품의 팔레트 사례이지 표준은 아니다.                                    |
| [Highcharts: Accessibility](https://www.highcharts.com/docs/accessibility/accessibility-module)                                       | `B`  | 대화형 차트는 키보드 내비게이션, 스크린리더 설명, sonification, 데이터 표 대안을 제공할 수 있다.                               | 향후 차트 라이브러리 구현 비교에 유용하다. 현 WebGL 뷰어는 시맨틱과 성능 요구가 다르다.                            |
| [Apache ECharts: ARIA](https://echarts.apache.org/handbook/en/best-practices/aria/)                                                   | `B`  | 자동 설명과 decal 패턴이 색상과 시각 mark를 보완할 수 있다.                                                                    | 텍스트 요약과 비색상 구분을 지지한다. 자동 문장도 정확한 NosLog 용어가 필요하다.                                   |
| [Vega: Accessibility](https://vega.github.io/vega/docs/config/#accessibility-properties)                                              | `B`  | 시각화 grammar는 차트 사양 안에 접근 가능한 설명, 역할, 상호작용 메타데이터를 넣을 수 있다.                                    | 구현 매핑에 유용하다. NosLog는 Vega를 선택하지 않았다.                                                             |
| [Microsoft Power BI: Accessibility](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-accessibility-creating-reports) | `B`  | 탭 순서, 제목, 대체 텍스트, 색 대비, marker, 읽을 수 있는 데이터가 분석 보고서 접근성을 돕는다.                                | 고밀도 데스크톱 표면의 작성된 읽기 순서와 비색상 신호를 지지한다. 엔터프라이즈 보고서 관습은 아트 디렉션이 아니다. |
| [WCAG: Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)                                         | `A`  | 본질적인 mark와 상태 경계는 인접 색과 대비돼야 한다.                                                                           | 보기 좋은 swatch만으로 차트 팔레트를 승인할 수 없다. 선, 채움, grid, 라벨, focus 조합을 측정한 표본이 필요하다.    |
| [SDVX.org: Effect Radar](https://www.sdvx.org/en/compendium/effect-radar)                                                             | `D`  | 안정적인 다축 fingerprint는 채보 요구를 학습된 리듬게임 약어로 전달할 수 있다.                                                 | 승인된 NOSTALGIA 전용 커뮤니티 레이더 개념을 지지한다. SOUND VOLTEX 축과 값은 복사할 수 없다.                      |
| [공식 SOUND VOLTEX: Skill Analyzer](https://p.eagate.573.jp/game/sdvx/vii/howto/skill.html)                                           | `D`  | 리듬게임 분석은 일반 차트만이 아니라 구조화된 모드, 코스, 스킬, 결과 맥락을 사용한다.                                          | 도메인이 전문적 고밀도 시각을 수용함을 확인한다. 접근 가능한 대안을 무효화하지 않는다.                             |
| [osu!: Beatmap Information](https://osu.ppy.sh/wiki/en/Beatmap_information)                                                           | `D`  | 선택 채보 사실, 랭킹, 개인 위치, 상세 점수 맥락이 안정된 beatmap 정체성 아래 공존한다.                                         | 안정된 채보 맥락과 점진적 상세를 지지한다. osu! 메커니즘과 카드 디자인은 전이하지 않는다.                          |
| [Tachi](https://tachi.ac/)                                                                                                            | `D`  | 세션, 목표, 베스트 지표, 폴더, 이력 비교는 서로 다른 분석 과업이다.                                                            | 요약, 탐색, 상세 근거를 하나의 과밀 대시보드가 아니라 분리하게 한다.                                               |

### 매트릭스 D 종합

- 가장 접근 가능한 기본 차트가 항상 도메인 효율이 가장 높은 차트는 아니다.
  승인된 과업에 맞으면 학습된 레이더 fingerprint를 유지할 수 있지만, 형태나
  색상만 의존하지 않고 라벨, 정확한 값, 키보드·포커스 동작, 텍스트 요약,
  데이터 대안을 추가해야 한다.
- 장식 색보다 위치와 정렬된 숫자가 비교를 우선적으로 전달해야 한다.
- 데이터 색 역할은 전역 행동, 오류, 손, 난이도 역할과 분리하거나 안전한
  재사용을 명시적으로 문서화해야 한다.
- 모바일은 비교를 요약하거나 순차화할 수 있지만 사용자의 과업이나 결과를
  설명하는 지표를 조용히 제거하면 안 된다.

## 매트릭스 E — 리듬게임 도메인과 제품 비교

| 출처                                                                                                    | 역할 | 전이 가능한 근거                                                                           | NosLog 적용성과 한계                                                                            |
| ------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [공식 NOSTALGIA Op.3](https://www.konami.com/arcadegames/products/am_nostalgia_op3/)                    | `D`  | 대상 게임의 피아노 정체성, 공식 명칭, 아케이드 맥락, 표현 자료를 확립한다.                 | 도메인 충실성과 attribution을 지배하며 NosLog 레이아웃·브랜딩은 정하지 않는다.                  |
| [공식 NOSTALGIA: How to Play](https://p.eagate.573.jp/game/nostalgia/op3/howto/entrance.html)           | `D`  | 모드, 난이도, 노트 동작, 손 상호작용, 플레이 흐름을 확립한다.                              | 일반 리듬게임 추정을 막는다. 아케이드 순서를 웹 내비게이션에 복사하지 않는다.                   |
| [공식 NOSTALGIA: Play Data](https://p.eagate.573.jp/game/nostalgia/op3/playdata/entrance.html)          | `D`  | Best Score, 판정 상세, 이력, Play count, Full Combo, Perfect, 채보별 기록 관계를 확립한다. | 사실적 기록 계층을 정의한다. 인증된 공식 UI는 공개 디자인 템플릿이 아니다.                      |
| [Taiko.wiki](https://taiko.wiki/?lang=en)                                                               | `D`  | 팬 서비스에서 직접 도메인 목적지, 악곡 탐색, 공지, 다국어 접근을 결합한다.                 | 구조 비교와 밀도 반례에 유용하다. Taiko 용어와 상시 컨트롤은 전이하지 않는다.                   |
| [Taiko.wiki: Song Search](https://taiko.wiki/song?lang=en)                                              | `D`  | 악곡 중심 탐색 안에 제목, 아티스트, 장르, 레벨, 채보 필터를 함께 둔다.                     | 공용 악곡·채보 탐색 맥락을 지지한다. 정확한 컨트롤 양은 채택하지 않는다.                        |
| [V-ARCHIVE](https://v-archive.net/)                                                                     | `D`  | 한국 리듬게임 아카이브가 기록 관리, 티어, 검색, 프로필, 반응형 내비게이션을 결합한다.      | 강한 지역·도메인 비교다. DJMAX 버튼 모드, 티어, 표면 스타일은 다르다.                           |
| [V-ARCHIVE: Tier Guide](https://v-archive.net/info/manual/tier)                                         | `D`  | 티어, 최고 성과 근거, 성장 이력, 정확한 점수 논리를 연결되지만 구분된 계층으로 설명한다.   | 투명한 파생 NosLog Rating과 티어 이력을 지지한다. 공식은 NosLog를 정의할 수 없다.               |
| [Tachi](https://tachi.ac/)                                                                              | `D`  | 모듈형 tracker가 점수 수집, 분석, 세션, 목표, 프로필 근거, 연동을 분리한다.                | 일관된 페이지 패밀리와 이력 보존을 지지한다. 다중 게임 범위는 더 넓다.                          |
| [osu!: Ranking](https://osu.ppy.sh/wiki/en/Ranking)                                                     | `D`  | 전역 performance 랭킹과 beatmap별 점수 랭킹은 서로 다른 비교 모집단이다.                   | 명확한 scope 라벨과 선택 채보 랭킹을 지지한다. osu! PP는 Grd나 NosLog Rating과 다르다.          |
| [osu!: Beatmap Information](https://osu.ppy.sh/wiki/en/Beatmap_information)                             | `D`  | 악곡 정체성, 난이도 맥락, 채보 사실, 랭킹, 개인 점수가 함께 연결된다.                      | 악곡·채보 계층과 집중된 상세를 지지한다. 게임 다운로드 행동은 범위 밖이다.                      |
| [ScoreSaber](https://scoresaber.com/)                                                                   | `D`  | 사용자·맵 랭킹이 순위, 정체성, performance 값, 정확도, 채보 맥락을 우선한다.               | 조밀한 랭킹 근거에 유용하다. Beat Saber PP와 anti-cheat 맥락은 다르다.                          |
| [ScoreSaber Ranking System](https://wiki.scoresaber.com/ranking-system.html)                            | `D`  | 설명되지 않은 숫자 대신 가중 performance, 전역 순위, 국가 순위를 설명한다.                 | 투명한 파생 지표와 프로필 비교를 지지한다. 알고리즘은 재사용하지 않는다.                        |
| [BeatLeader](https://beatleader.com/)                                                                   | `D`  | 랭킹, 점수 상세, replay, 맵 요구, 사용자 성장을 결합한다.                                  | 요약 뒤의 풍부한 근거를 지지한다. replay와 custom map 시스템은 NosLog 범위를 넘는다.            |
| [ArcadeStat](https://arcadestat.app/en/)                                                                | `D`  | 아케이드 기록 서비스가 게임, 기록, 티어, 투표, 프로필 기능을 하나의 셸에서 제공한다.       | 아케이드 내비게이션과 성과 검증 투표에 유용하다. 충돌하는 자동 집계 규칙은 거부한다.            |
| [KONAMI IIDX: Play Screen and Filters](https://p.eagate.573.jp/game/2dx/33/howto/play/game_screen.html) | `D`  | 목표 중심 선택은 레벨, 결과 상태, grade, MISS 수 조건을 포함할 수 있다.                    | 의미 있는 개인 refinement를 지지하면서 IIDX lamp 분류를 복사하면 안 된다는 점도 확인한다.       |
| [SOUND VOLTEX: News](https://p.eagate.573.jp/game/sdvx/vii/news/index.html)                             | `D`  | 전용 공식 아카이브가 시간순 게임 업데이트를 플레이 화면과 분리한다.                        | NosLog 공지 계층과 공식 출처 분리를 지지한다. 홍보 어조와 이미지는 NosLog 편집 스타일이 아니다. |

### 매트릭스 E 종합

- 악곡, 채보, 모드, 난이도, 개인 기록, 랭킹, 서열, 커뮤니티 평가는 연결되지만
  서로 바꿀 수 없는 엔티티다.
- 자켓은 안정된 악곡 정체성 앵커이며 정사각형을 유지한다. 계층이나 점진적
  공개 없이 모든 기록과 상태를 동시에 담을 수 없다.
- 비교 대상을 안정적으로 유지하고 값을 정렬하면 전문 사용자는 고밀도 근거를
  수용한다. scope, provenance, 우선순위가 불명확한 밀도는 여전히 노이즈다.
- NosLog의 고유 가치는 일반 리듬게임 스킨이 아니라 NOSTALGIA 기록, 서열,
  아카이브, 공식 채보 기여, 낙하형·전체 채보 뷰어의 조합이다.

## 매트릭스 F — 편집 디자인과 아트 디렉션 레퍼런스

이 출처들은 동작에 대한 권위가 의도적으로 낮다. 비례, 리듬, 계층, 이미지,
표현을 관찰하는 대상으로만 사용한다.

| 출처                                                                                                                  | 역할 | 전이 가능한 근거                                                                                             | NosLog 적용성과 한계                                                                            |
| --------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [Plus X](https://dx.plusx.kr/)                                                                                        | `E`  | 강한 한국어 타이포그래피, 프로젝트 중심 페이싱, 통제된 대비, 성긴 섹션과 이미지 중심 섹션의 전환을 보여준다. | 계층과 편집 리듬에 유용하다. 포트폴리오의 spectacle과 모션이 과업 속도를 압도하면 안 된다.      |
| [MUSINSA Updates](https://updates.musinsa.com/)                                                                       | `E`  | 한국어 편집 계층이 조밀한 메타데이터, 강한 제목, 이미지, 반복 콘텐츠 시스템을 다룬다.                        | 한국어 글자 비례와 스캔에 유용하다. 커머스·패션 콘텐츠는 도메인 구조가 아니다.                  |
| [MUSINSA Newsroom: Store BI](https://newsroom.musinsa.com/newsroom-menu/2025-1022)                                    | `E`  | 규율 있는 시스템으로 글로벌, 리테일, 디지털, 편집 맥락 전반에서 브랜드를 알아볼 수 있게 유지할 수 있다.      | 하나의 로고를 넘어선 일관된 NosLog 정체성을 지지한다. MUSINSA 브랜드 자산은 복사하지 않는다.    |
| [TURN.STUDIO — Creative Agency Website](https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO) | `E`  | 대형 타이포그래피, 비대칭, 이미지 시퀀싱, 다크·라이트 대비, 반응형 구성을 탐색한다.                          | 표현적 표본과 페이싱에 유용하다. concept·portfolio 레퍼런스이지 검증된 제품 동작이 아니다.      |
| [Linear](https://linear.app/)                                                                                         | `C`  | 다크 제품·마케팅 시스템이 조용한 중립색, 정밀한 타입 계층, 통제된 accent, 고밀도 제품 근거를 함께 사용한다.  | 편집 표현과 생산적 밀도를 잇는 데 유용하다. 단색 tech 정체성은 NosLog 정체성이 아니다.          |
| [Vercel](https://vercel.com/)                                                                                         | `C`  | 강한 그리드, 높은 대비, 절제된 그래픽 언어, 모듈형 콘텐츠가 확장 가능한 인식 체계를 만든다.                  | 정렬과 절제에 유용하다. 흑백 브랜드를 모방해 NosLog를 만들 수 없다.                             |
| [Stripe](https://stripe.com/)                                                                                         | `C`  | 복잡한 인프라를 계층, 색상, 다이어그램, 제품 이미지, 점진적 설명 섹션으로 나눈다.                            | 복잡한 연동·기여 흐름 설명에 유용하다. 마케팅 밀도와 gradient를 기본값으로 쓰지 않는다.         |
| [Arc](https://arc.net/)                                                                                               | `C`  | 모든 기능을 컨트롤로 노출하지 않고도 타이포그래피, 색상, 이미지, 모션으로 제품 개성을 표현한다.              | 절제된 컨트롤과 고유한 표현을 지지한다. 브라우저 소비자 마케팅은 아카이브 패턴이 아니다.        |
| [Raycast](https://www.raycast.com/)                                                                                   | `C`  | 다크 표면, 명령 중심 계층, 조밀한 제품 이미지, 절제된 accent가 공존한다.                                     | 다크 UI 레이어와 집중 행동에 유용하다. command palette 모델은 NosLog 내비게이션이 아니다.       |
| [Pitch](https://pitch.com/)                                                                                           | `C`  | 편집 스토리텔링, 모듈형 예시, 제품 시연이 하나의 시각 언어 안에서 서로 다른 밀도를 사용한다.                 | 가이드·PDF 페이싱과 설명 모듈에 유용하다. 프레젠테이션 워크플로는 전이하지 않는다.              |
| [Framer](https://www.framer.com/)                                                                                     | `C`  | 반응형 마케팅 구성이 유연한 type, grid, card, 실시간 제품 예시를 보여준다.                                   | 적응과 표본 제시에 유용하다. template 시장의 시각 유행은 제품 사용성 근거가 아니다.             |
| [Aesop](https://www.aesop.com/)                                                                                       | `C`  | 절제된 색, 측정된 타이포그래피, 여백, 이미지, 편집 어조로 과도한 컨트롤 없이 강한 정체성을 만든다.           | 고밀도 리듬게임 레퍼런스의 균형추로 유용하다. 낮은 정보 밀도가 랭킹·채보 도구를 지배할 수 없다. |

### 매트릭스 F 종합

- NosLog는 상시 컨트롤이나 장식 카드 추가 없이도 비례, 타이포그래피, 자켓
  이미지, 리듬, 목적 있는 모션으로 표현적일 수 있다.
- 편집 레퍼런스는 홈, 공지, 온보딩, 가이드 예시, 정보 단계 사이 전환에 가장
  유용하다. 필터, 설정, 랭킹, 기록 상세, 뷰어, 에디터는 제품 파운데이션이
  계속 지배한다.
- 다크 시각 방향은 pure black, neon glow, 반투명 카드, 일반적인 gaming
  aesthetic과 동의어가 아니다.
- 최종 Claude Design은 승인된 제약 안에서 구성을 탐색할 수 있지만, 아트
  디렉션 레퍼런스를 근거로 제품 동작을 발명하거나 상태를 제거하면 안 된다.

## 출처 간 수렴점

아래 결과는 독립적인 근거 분류에서 강하게 지지된다. 조사 결과이며 아직
승인된 NosLog 디자인 원칙은 아니다.

| ID        | 수렴 결과                                                                                                                   | 근거 분류          | 다음에 시험할 의미                                                                               |
| --------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `CONV-01` | 모든 항목을 버튼이나 카드로 만들지 않고 크기, weight, 간격, 위치, 대비, disclosure로 정보 우선순위를 보여줘야 한다.         | `A`, `B`, `C`, `E` | 하나의 명백한 주 과업과 조용한 보조 utility가 있는 표본을 만든다.                                |
| `CONV-02` | 반응형 시스템은 기기 라벨만이 아니라 콘텐츠, 컨테이너, 언어, 입력, 사용자 선호에 반응해야 한다.                             | `A`, `B`, `C`      | `320`, `390`, 중간 폭, 데스크톱에서 관찰한 실패점으로 컴포넌트 전환을 정한다.                    |
| `CONV-03` | 타이포그래피, 간격, 그리드, 색상, 표면, 아이콘, 모션 역할을 함께 디자인하고 시험해야 한다.                                  | `B`, `C`, `E`      | 대표 NosLog 콘텐츠 없이 고립된 팔레트나 타입 스케일을 승인하지 않는다.                           |
| `CONV-04` | 다크 인터페이스에는 중립색 중심의 계층 표면, 측정된 대비, 절제된 목적성 accent가 필요하다.                                  | `A`, `B`, `C`      | 하나의 다크 표본에서 표면 단계, 테두리, focus, 텍스트, 손 색, 시맨틱 상태, 자켓을 함께 시험한다. |
| `CONV-05` | 색상만으로 상태나 비교를 전달하면 안 된다.                                                                                  | `A`, `B`, `D`      | 색상과 라벨, 아이콘, 형태, 위치, 테두리 처리, 숫자 값을 함께 쓴다.                               |
| `CONV-06` | scope가 안정되고 값이 정렬되며 계층이 명확하고 점진적 상세가 결과 이유를 숨기지 않을 때 고밀도 전문 데이터는 사용 가능하다. | `B`, `C`, `D`      | 동시 컨트롤을 줄이면서 비교 가능한 점수와 채보 맥락을 보존한다.                                  |
| `CONV-07` | 모션은 인과, 연속성, focus, 피드백을 명확히 하는 계층이며 장식 모션은 종속적이고 축소 가능해야 한다.                        | `A`, `B`, `C`      | 값보다 의도 기반 모션 역할과 reduced-motion 대체를 먼저 만든다.                                  |
| `CONV-08` | 다국어 품질에는 실제 문자 콘텐츠, 언어별 줄바꿈, 확장 가능한 컨테이너, 로케일별 형식이 필요하다.                            | `A`, `B`, `D`      | 세 로케일에서 실제 긴 제목, 읽기, 번역, 라벨, 날짜, 숫자를 시험한다.                             |
| `CONV-09` | 도메인에 익숙한 전문 시각화는 전문가 과업에서 일반적 단순화보다 뛰어날 수 있지만 접근 가능한 중복 표현이 필요하다.          | `A`, `B`, `D`      | 정확한 값, 라벨, 요약, 대안을 포함해 승인된 레이더·뷰어 개념을 유지한다.                         |
| `CONV-10` | 브랜드 표현은 레퍼런스 표면 효과 복사가 아니라 일관된 시스템과 콘텐츠에서 나와야 한다.                                      | `B`, `C`, `D`, `E` | 같은 콘텐츠와 기능 제약으로 여러 NosLog 전용 구성을 탐색한다.                                    |

## 열어 둬야 하는 근거 충돌

| ID        | 충돌                                                                                                 | 아직 결론을 승인하지 않는 이유                                                                                     | 필요한 다음 근거                                                                |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `OPEN-01` | 성숙한 시스템의 간격 base가 `4px`, `5px`, `8px`, hybrid scale로 다르다.                              | 유행하는 base 복사보다 일관성이 중요하며 CJK metric과 고밀도 뷰어·에디터 컨트롤에는 optical need가 다르다.         | 그룹과 터치 타깃을 측정한 대표 컴포넌트·페이지 fragment.                        |
| `OPEN-02` | 작은 생산적 글자 범위가 시스템마다 대략 `12px`–`16px`로 다르며 `12px`는 이제 승인된 NosLog 하한이다. | 어떤 Role이 `12px` 또는 그보다 크게 결정되는지는 서체 Metric, 굵기, 대비, 문자, 행 길이와 과업이 정한다.           | 텍스트 확대를 포함한 Pretendard JP 한국어·일본어·영어·Tabular score Specimen.   |
| `OPEN-03` | 시스템마다 브레이크포인트, 최대 폭, 열 수가 다르다.                                                  | 각 값은 자기 콘텐츠와 플랫폼을 반영한다.                                                                           | `320`, `390`, 중간 폭, 넓은 비교 레이아웃의 NosLog 콘텐츠 실패 관찰.            |
| `OPEN-04` | 다크 elevation에 표면 밝기 변화, 테두리, 그림자, 투명도 또는 조합을 쓴다.                            | 자켓 이미지, WebGL 콘텐츠, 브라우저 합성, 대비 때문에 같은 처리가 다르게 작동할 수 있다.                           | 카드, 메뉴, 다이얼로그, sticky control, viewer chrome을 포함한 표면 stack 표본. |
| `OPEN-05` | 제품 시스템은 절제된 타이포그래피를 선호하고 편집 레퍼런스는 표현적 스케일과 구성을 쓴다.            | NosLog에는 과업 속도와 고유 정체성이 모두 필요하지만 페이지 패밀리마다 강도가 다르다.                              | 홈, 탐색, 랭킹, 뷰어 fragment에 적용한 productive·expressive type-set 후보.     |
| `OPEN-06` | 일반 차트는 보편 이해를 높이고 학습된 레이더 profile은 리듬게임 전문가 인식을 높인다.                | 승인된 커뮤니티 레이더는 도메인 가치가 있으나 형태·색상만으로는 접근 불가하며 작은 모바일 렌더링이 실패할 수 있다. | 레이더, 정확한 값 목록, 텍스트 요약, focus 순서, `320px` 비교 표본.             |
| `OPEN-07` | 고밀도 데스크톱은 비교를 높이지만 열 추가만 하면 읽기와 키보드 순서를 조각낼 수 있다.                | 페이지 패밀리마다 비교 과업과 시맨틱 순서가 다르다.                                                                | 모바일 계층 검증 후 페이지 패밀리별 데스크톱 적응 규칙.                         |
| `OPEN-08` | 표현적 모션은 정체성을 강화하지만 편안함, 성능, 뷰어 focus에 영향을 준다.                            | WebGL 뷰어에는 이미 의미 있는 모션이 있으므로 주변 UI 모션의 주의 예산이 낮다.                                     | 모션 인벤토리, 의도 분류, 성능 제약, reduced-motion 대안.                       |

## 레퍼런스가 바꿀 수 없는 NosLog 제약

다음 사실과 승인은 문서 `01`–`21`과 NOSTALGIA 도메인에서 왔다. 인기 있는
레퍼런스가 이를 대체할 수 없다.

1. 모바일은 아케이드 현장 중심의 주요 맥락이며, 데스크톱은 필수 분석,
   뷰어, 미래 에디터 환경으로 남는다.
2. 제품은 한국어, 일본어, 영어를 지원하며 일본어 원문 악곡 제목과 승인된
   번역·읽기 제목 동작을 유지한다.
3. Basic과 Recital은 서로 다른 모드다. Normal, Hard, Expert, 선택적 Real은
   일반 태그가 아니라 채보 난이도다.
4. 왼손·오른손 채보 색 의미, 자켓 정체성, 점수·랭크 의미, 판정 상세, 서열,
   Bingo, Exam, NOSTALGIA 공식 grade는 승인된 도메인 의미를 유지해야 한다.
5. 낙하형·전체 채보 WebGL 뷰어는 집중형 NosLog 기능이다. 디자인 가이드는
   진입, chrome, 상태, 전체화면 동작을 재설계할 수 있지만 렌더링 모델을
   조용히 교체하면 안 된다.
6. 미래 사용자 에디터는 draft, immutable submission, 검토, 관리자 공개를
   통해 하나의 canonical 공식 채보에 기여한다. 공개 alternate-chart catalog가
   아니다.
7. 승인된 다크 방향은 유지하지만 레거시 NOSTORY 표면 스타일은 권위가 아니다.
8. 시각적 단순화를 위해 검증된 페이지 기능과 상태를 제거할 수 없다. 승인된
   브리프 아래에서만 우선순위를 바꾸거나 점진적으로 공개할 수 있다.

## 디자인 원칙 검토

다음 원칙은 매트릭스에서 도출했으며 하나씩 검토한다. 각 행의 상태가
권위 있는 현재 상태다. 해결되지 않은 원칙은 사용자가 명시적으로 승인,
수정 또는 거부할 때까지 `Proposed`로 유지한다.

| ID      | 후보                                               | 실무 의미                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 상태       |
| ------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `PR-01` | **공통 체계 안에서 주 과업을 우선한다**            | 전역 타이포그래피, 간격, 그리드, 컴포넌트 역할과 페이지 패밀리 템플릿을 일관되게 유지한다. 승인된 각 페이지 브리프의 콘텐츠를 공통 역할에 매핑하여 목적, 주 행동, scope, 결과를 분명히 한다. 검증된 기능은 보존하고 보조 정보는 위계화하며 같은 의미의 요소에 페이지별 임의 크기를 만들지 않는다.                                                                                                                                                                           | `Approved` |
| `PR-02` | **익숙한 패턴 안에서 도메인 진실성을 지킨다**      | 내비게이션, 검색, 메뉴, 다이얼로그에는 익숙한 웹 패턴을 사용하되 NOSTALGIA의 모드, 기록, 서열, 코스, 채보 동작의 정확한 의미를 유지한다.                                                                                                                                                                                                                                                                                                                                    | `Approved` |
| `PR-03` | **기본 화면은 간결하게, 결과의 이유는 명확하게**   | 기본 화면에는 과업 수행에 필요한 정보를 우선 제공한다. 보조 분석과 설명은 점진적으로 공개하되 현재 scope, 선택, 상태, 결과를 이해하는 데 필요한 원인은 보이게 유지한다.                                                                                                                                                                                                                                                                                                     | `Approved` |
| `PR-04` | **다크를 시각적 기준점으로, 색은 역할로 사용한다** | NosLog 대표 아트 디렉션을 다크에서 먼저 정립하되 System, Dark, Light가 완전한 시맨틱 역할, 대비, 상태, 차트, 이미지, focus 처리를 제공한다. 중립 표면이 기본 계층을 담당하고 색, elevation, glow, motion은 명시된 브랜드·상호작용·상태·데이터·표현 역할에만 사용하며 색만으로 의미를 전달하지 않는다.                                                                                                                                                                       | `Approved` |
| `PR-05` | **하나의 의미 체계 안에서 언어별로 검증한다**      | 한국어, 일본어, 영어, 원문 제목, 읽기·번역, 아티스트명, 점수, 메타데이터를 공통 시맨틱 역할에 매핑한다. 같은 역할은 같은 정보 우선순위를 뜻하며 반드시 같은 서체나 명목상 pixel metric을 뜻하지 않는다. 대표 콘텐츠로 각 script의 fallback, 줄바꿈, 확대 및 시각적 균형을 검증한다.                                                                                                                                                                                         | `Approved` |
| `PR-06` | **같은 과업을 가용 공간에 맞게 재구성한다**        | 모바일 우선으로 디자인하고 모든 폭에서 의미, 주 과업 동등성, 상태, 시맨틱·focus 순서를 보존한다. 기기 이름이 아니라 실제 콘텐츠와 컨테이너 제약으로 전환을 선택한다. `390px`은 대표 검토 캔버스이고 `320 CSS px`은 reflow 계약이며, Wide Layout은 추가 공간을 비교·분석·보기·편집에 의도적으로 사용해야 한다.                                                                                                                                                               | `Approved` |
| `PR-07` | **정렬과 근거를 통한 비교**                        | 비교 전에 scope, 분모, 단위, 기간, 순서, scale을 정렬하고 과업에 맞는 차트·표·목록을 선택한다. 모든 시각화를 정확한 구조화 근거와 연결하며 색이나 포인터 전용 상호작용이 핵심 의미를 단독으로 전달하지 않게 한다.                                                                                                                                                                                                                                                           | `Approved` |
| `PR-08` | **절제된 계층, 콘텐츠 중심 정체성**                | 주 행동과 고빈도 행동은 즉시 사용할 수 있게 유지하고 보조·맥락적 행동만 점진적으로 공개한다. 홈은 악곡·채보 검색과 직접 목적지를 우선하고, 악곡 탐색·상세는 보조 Control보다 악곡 정체성을 우선하며, 랭킹·서열·기록 분석은 Artwork보다 비교 가능한 Performance 근거를 우선하고, Viewer chrome은 채보보다 하위로 둔다. 장식적인 상시 Control 대신 조율된 Content, Typography, 비례, 공간 Rhythm, Surface, Iconography, Voice 및 목적 있는 Motion으로 NosLog 정체성을 만든다. | `Approved` |
| `PR-09` | **구조 단계부터 접근 가능**                        | WCAG 2.2 AA, 시맨틱 구조, 키보드와 focus, 타깃 geometry, 대비와 비색상 단서, reflow와 확대, 텍스트 간격, 언어, reduced motion, 상태·복구, 동등한 과업 경로를 디자인 입력으로 취급한다. 네이티브 의미론을 우선하고 모든 custom composite와 본질적인 2차원 예외의 상호작용·대안·시험 계약을 문서화한다. 접근성은 별도 축소 제품이나 pixel 단위의 동일한 표현이 아니라 정보와 과업 동등성을 뜻한다.                                                                            | `Approved` |
| `PR-10` | **우연한 drift가 아닌 문서화된 예외**              | 공통 시스템이 실질적 손실 없이 지원할 수 없는 검증된 과업 또는 도메인 필요에만 특수 계약이나 경계가 있는 예외를 등록한다. 달리 적용하는 규칙, 가장 작은 범위, 금지된 확장, 동등한 경로 또는 Fallback, 교차 영역 영향, 검증, 소유자 및 재검토 Trigger를 명시한다. 도메인 불변조건, 정상 반응형 적응, 범위 연기 및 구현 부채는 예외 등록부에 넣지 않는다.                                                                                                                     | `Approved` |

### `PR-04`~`PR-06`의 승인 해석 경계

집중 비교에는 외부 색상·테마 출처 15개, 다국어 타이포그래피 출처 13개,
반응형 레이아웃 출처 14개와 현재 NosLog 코드, 브라우저 근거, 승인된 페이지
브리프를 함께 사용했다. 신뢰할 수 있는 자료를 추가해도 아래 수렴점이 실질적으로
달라지지 않았다. 유보된 값은 대표 파운데이션 표본으로 검증할 `OPEN-01`~`OPEN-05`
작업으로 남는다. 이번 승인은 그 값을 조용히 선택하지 않는다.

| ID      | 이번 승인이 요구하는 것                                                                                                                                                                                                                                                                   | 이번 승인이 선택하지 않는 것                                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PR-04` | 다크는 대표 아트 디렉션 기준점으로 유지하고 이미 승인된 System/Dark/Light 모델은 역할이 동등한 완전한 테마를 제공한다. 중립 layer가 일반 계층을 담당하며 브랜드, 상호작용, 상태, 손, 난이도, 랭크, 데이터 색상 소유권을 명시해야 한다. 의미가 필요한 색에는 색 외의 중복 표현을 제공한다. | 시그니처 hue, 팔레트 값, 자동 라이트 테마 반전, 표면 단계, 테두리 처리, shadow/elevation 방식, glow 강도, 차트 팔레트 또는 모션 값.                      |
| `PR-05` | 하나의 시맨틱 역할 map이 한국어·일본어·영어의 정보 우선순위를 보존한다. 실제 대표 콘텐츠로 script별 metric, fallback, 줄바꿈, 텍스트 확대, 원문 제목·읽기·번역 동작, 긴 아티스트명, tabular score를 검증한다.                                                                             | 서체, fallback stack, type scale, 명목상 크기, 굵기, 행간, tracking, 잘림 기준 또는 모든 script가 같은 숫자 metric을 사용해야 한다는 가정.               |
| `PR-06` | 모바일은 유일한 환경이 아니라 주요 디자인 맥락이다. 컴포넌트가 reflow, resize, reposition 또는 점진적 공개될 때 의미, 주 행동, 상태, 사용 가능성을 유지한다. 데스크톱은 현재 모바일 셸을 유지하거나 확대하지 않고 관련 비교·분석·뷰어·에디터 작업을 개선해야 한다.                        | 고정 앱 폭, 프레임워크 기본 breakpoint, 보편 열 수, container 최대 폭, gutter, 간격 값 또는 공간이 좁다는 이유만으로 과업 핵심 기능을 숨길 수 있는 권한. |

### `PR-07`~`PR-08`의 승인 해석 경계

`PR-07` 집중 검토는 독립적인 표준, 공공 디자인 시스템, 프로덕션 시각화 도구,
리듬게임 제품, 연구 그룹 18개 이상을 비교했다. `PR-08` 검토는 독립적인
컨트롤 시스템, disclosure 패턴, 프로덕션 서비스, 정체성 레퍼런스 17개 이상을
비교했다. 신뢰할 수 있는 자료를 추가해도 아래의 실질적인 수렴점이 더 이상
달라지지 않았다.

| 초점                    | 대표 근거                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 전이 가능한 수렴점과 한계                                                                                                                                                                                                                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 비교와 접근성           | [W3C 색상 사용](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [W3C 비텍스트 대비](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [CFPB 데이터 시각화 지침](https://cfpb.github.io/design-system/guidelines/data-visualization-guidelines), [NSW 차트와 그래프](https://designsystem.nsw.gov.au/docs/content/methods/charts-and-graphs.html), [ONS 데이터 시각화](https://service-manual.ons.gov.uk/data-visualisation), [USWDS 데이터 시각화](https://designsystem.digital.gov/components/data-visualizations/)                                                                                                                                                                                                                                     | 비교 질문에서 시작하고 scope와 맥락을 보존하며 과업에 맞는 익숙한 형식을 사용한다. 색은 위치, 라벨, 형태, 패턴 또는 다른 단서로 보강한다. 데이터 표는 정확한 값을 제공할 수 있지만 유효한 차트의 시각적 서사를 그 자체로 대체하지는 않는다.                                                                                                                           |
| 프로덕션 시각화         | [Apple HIG Charts](https://developer.apple.com/design/human-interface-guidelines/charts), [Microsoft Power BI 디자인 지침](https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips), [Tableau 시각 모범 사례](https://help.tableau.com/current/pro/desktop/en-us/visual_best_practices.htm), [Datawrapper 접근성](https://academy.datawrapper.de/article/206-how-we-make-sure-our-charts-maps-and-tables-are-accessible), [Carbon 차트 유형](https://carbondesignsystem.com/data-visualization/chart-types/), [Observable Plot 접근성](https://observablehq.com/plot/features/accessibility), [Highcharts 접근성](https://www.highcharts.com/docs/accessibility/accessibility-module), [Vega-Lite Scale](https://vega.github.io/vega-lite/docs/scale.html) | 안정된 축, 순서, 단위, scale이 비교를 돕는다. 제목, 요약, 라벨, 키보드 접근, 구조화 상세가 시각 패턴을 근거와 연결한다. 도구별 스타일과 라이브러리는 NosLog 요구사항이 되지 않는다.                                                                                                                                                                                   |
| 레이더와 도메인 비교    | [IBM Research: Off the Radar](https://research.ibm.com/publications/off-the-radar-comparative-evaluation-of-radial-visualization-solutions-for-composite-indicators), [Applied Ergonomics 레이더 연구](https://www.sciencedirect.com/science/article/pii/S0003687023000340), [레이더·막대 비교 연구](https://pmc.ncbi.nlm.nih.gov/articles/PMC6428189/), [osu! Ranking](https://osu.ppy.sh/wiki/en/Ranking), [Tachi](https://tachi.ac/)                                                                                                                                                                                                                                                                                                                                                     | 레이더는 다중 계열에서 정확한 값을 추출하는 데 약하지만 학습된 단일 profile fingerprint로는 사용할 수 있다. NosLog는 고정 순서·고정 scale·5축의 단일 커뮤니티 레이더와 정확한 구조화 값을 유지할 수 있다. 이를 겹친 leaderboard나 정밀 순위 비교 대체물로 바꾸면 안 된다. NOSTALGIA 점수 구간은 일반적인 동일 구간으로 정규화하지 않고 승인된 도메인 의미를 유지한다. |
| 행동 계층과 disclosure  | [Carbon Button](https://carbondesignsystem.com/components/button/usage/), [Fluent Button](https://fluent2.microsoft.design/components/web/react/core/button/usage), [Primer Button](https://primer.style/product/components/button/), [Atlassian Button](https://atlassian.design/components/button/), [USWDS Button](https://designsystem.digital.gov/components/button/), [GOV.UK Button](https://design-system.service.gov.uk/components/button/), [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [Salt Menu Button](https://www.saltdesignsystem.com/salt/patterns/menu-button)                                                                                                                                                               | 강한 강조 행동은 드물게 사용하고 관련 보조 행동은 낮은 강조, 메뉴 또는 맥락적 disclosure를 사용할 수 있다. 이 원칙은 NosLog의 모든 페이지에 주 버튼 하나를 강제하거나, 고빈도 행동을 숨기거나, 내비게이션 링크를 행동 버튼으로 바꾸거나, Basic/Recital처럼 승인된 동등한 모드 선택을 합치지 않는다.                                                                   |
| 콘텐츠 중심 제품 정체성 | [Figma UI 디자인 원칙](https://www.figma.com/resource-library/ui-design-principles/), [Spotify: Reimagining Design Systems](https://spotify.design/article/reimagining-design-systems-at-spotify), [Material 브랜드와 정체성](https://design.google/library/staying-true-to-your-identity-material-branding), [IBM Design Language](https://www.ibm.com/design/language/), [Plus X](https://dx.plusx.kr/), [TURN.STUDIO](https://www.behance.net/gallery/252216015/Creative-Agency-Website-TURNSTUDIO), [osu! 악곡 목록](https://osu.ppy.sh/beatmapsets)                                                                                                                                                                                                                                    | 차분한 공통 파운데이션은 음악 자켓과 도메인 콘텐츠가 색과 개성의 많은 부분을 담당하게 할 수 있다. 정체성은 모든 표면의 로고·glow·accent·raised button이 아니라 조율된 체계에서 나와야 한다. 편집형 레퍼런스는 비례와 흐름에만 사용하며 제품 동작을 결정하지 않는다.                                                                                                   |

| ID      | 이번 승인이 요구하는 것                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 이번 승인이 선택하거나 허용하지 않는 것                                                                                                                                                                                                                                                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PR-07` | 결과를 설명하는 비교 scope, 분모, 단위, 기간, 순서, scale을 명시하거나 보존한다. 사용자의 질문에 맞는 차트·표·목록을 사용하고 핵심 비교값은 보이게 유지한다. 전체 정확한 값은 포인터 전용 tooltip이 아니라 라벨, 요약 또는 명시적 disclosure를 통해 구조적으로 접근할 수 있어야 한다. 상태와 데이터에는 중복 인코딩을 사용한다. 승인된 단일 계열 5축 커뮤니티 레이더, 정확한 랭킹 모집단, NOSTALGIA 점수 구간, 선택 지표 하나의 성장 추이를 보존한다.                                                                                                                                                                                                                                                                                        | 차트 라이브러리, 시각 치수, 축 처리, grid 밀도, 팔레트, 라벨 위치, tooltip 구조, sonification 방식 또는 정확한 값 disclosure 컴포넌트. 모든 차트를 표로 교체하거나, 근거를 hover에 숨기거나, 같은 지표를 장식 차트에 중복하거나, 승인된 레이더를 제거하거나, 여러 레이더 profile을 겹치거나, 도메인 점수 구간을 일반 구간으로 바꾸는 것을 허용하지 않는다.                       |
| `PR-08` | 주 행동과 고빈도 행동은 보이고 사용할 수 있게 유지한다. scent와 복귀가 명확할 때만 보조·맥락적 행동을 낮추거나 그룹화하거나 disclosure한다. 내비게이션에는 링크를 유지하고 도메인이 요구하는 명시적 동등 선택을 보존한다. 홈은 악곡·채보 검색과 직접 목적지에 첫 과업 우선순위를 둔다. 악곡 탐색·상세는 필요한 검색·선택 Control을 계속 사용할 수 있게 하면서 악곡 정체성에 콘텐츠 우선순위를 둔다. 랭킹·서열·기록 분석은 자켓 강조보다 정렬된 비교 근거에 콘텐츠 우선순위를 둔다. Viewer chrome은 WebGL 채보보다 두드러지면 안 된다. 비교적 차분한 공용 과업 Shell은 적절한 곳에서 자켓과 NOSTALGIA 콘텐츠가 표현을 주도하게 하며 고밀도 Form·설정·Editor Control은 더 차분하게 유지한다. Motion에는 목적과 reduced-motion 처리가 필요하다. | 시그니처 hue, 서체, type scale, artwork 처리, 표면 방식, 아이콘 스타일, 버튼 수, 메뉴 구조, 모션 duration 또는 페이지 패밀리 표현 강도 값. 화면마다 주 버튼 하나를 기계적으로 강제하거나, 승인된 고빈도 컨트롤을 숨기거나, 버튼을 장식으로 쓰거나, 여러 표면에 행동을 중복하거나, 모든 카드를 raised·accented 처리하거나, NosLog를 개성 없는 중립 유틸리티 UI로 축소하지 않는다. |

### `PR-09`의 승인 해석 경계

집중 검토는 관련 출처 30개 이상과 현재 NosLog 문서, 코드, 렌더링된 브라우저
구조를 비교했다. 사용자는 2026-08-03에 다음 접근성 계약을 승인했다.

| 범위                       | 이번 승인이 요구하는 것                                                                                                                                                                                                                                                                                                                                                                                                   | 이번 승인이 선택하거나 허용하지 않는 것                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 기준선과 범위              | 완전한 공개·인증 과업의 프로덕션 디자인·출시 목표로 WCAG 2.2 AA를 사용한다. 페이지 브리프부터 handoff와 검증까지 시맨틱, 읽기·focus 순서, 이름, 키보드 동작, 타깃 geometry, 대비, 비색상 단서, reflow, 확대, 텍스트 간격, 언어, motion 선호, 상태, 오류, 복구를 적용한다.                                                                                                                                                 | 구현과 평가 전의 현시점 WCAG 적합성 주장, 완전한 AAA 적합성, 정확한 파운데이션 값·컴포넌트 스타일, 최종 browser·보조기술 지원 matrix.                                                                         |
| 네이티브와 custom 상호작용 | 네이티브 HTML 컨트롤과 landmark를 우선한다. custom tab, menu, dialog, grid, slider, Canvas composite, `role="application"`이 정당할 때 완전한 키보드, focus, name, role, value, state, disabled, announcement, exit 동작을 명시한다.                                                                                                                                                                                      | ARIA role, 접근 가능한 컴포넌트 library, Canvas overlay, 자동 scan이 그 자체로 충분하다고 취급하는 것. `role="application"`은 명시적인 에디터 상호작용 모델을 생략하는 지름길이 아니다.                       |
| 정보와 과업 동등성         | 키보드, touch, pointer, screen reader, 확대, 고대비, reduced motion 사용에서 동일한 핵심 정보, 결정, 과업 완료를 보존한다. 주 표면이 본질적으로 공간적이거나 animation일 때 동등한 구조화 표현은 시각적으로 다를 수 있다.                                                                                                                                                                                                 | 별도의 축소된 “접근성 버전”, 승인된 도메인 시각화 제거, 모든 modality가 pixel 단위로 같거나 frame 단위로 같은 감각 표현을 받아야 한다는 요구.                                                                 |
| 채보 뷰어                  | 낙하형과 전체 악보 renderer를 유지한다. 안정적인 채보 정체성·요약, 조작 가능한 transport·seek 컨트롤, 구조화된 전체 악보·열 설명, 보이는 정확한 시간, 비색상 손 단서, autoplay 금지, pause/stop을 제공한다. 떨어지는 모든 노트를 읽거나 접근 가능한 설명을 매 frame 다시 쓰지 않는다. Reduced motion은 채보 timing 의미를 바꾸거나 view 전환을 강제하지 않고 비필수 shell motion을 제거한다.                              | WebGL을 text-only 뷰어로 교체, reduced-motion 사용자를 전체 악보 mode로 강제, 연속 재생 시간 announcement, 렌더링된 모든 노트를 독립 Tab 정지로 만드는 것.                                                    |
| 데이터 시각화와 지도       | 과업에 답하는 승인된 차트, 점수 구간, 레이더, 지도를 유지한다. 정확한 구조화 값, 요약, scope, label, 중복 상태 인코딩을 제공한다. 오락실 결과 목록은 지도에서 사용할 수 있는 모든 오락실과 행동을 노출해야 한다.                                                                                                                                                                                                          | 모든 차트를 table로 교체, hover·색·marker 모양·크기·motion을 유일한 의미로 사용, 오락실 과업 완료에 지도 상호작용을 요구하는 것.                                                                              |
| 채보 에디터와 공간 컨트롤  | 포인터 효율적인 편집을 유지하면서 키보드로 동등한 생성, 선택, 이동, 폭, 길이, 경로점 조절, 삭제, undo/redo, 속성 편집, 피드백을 추가한다. 관리되는 에디터 focus 모델과 동기화된 구조화 속성 경로를 사용해 관리되지 않는 Tab 정지 수백 개를 피한다. Splitter와 resize handle은 current/min/max 의미, 보이는 focus, 키보드 증분, pointer 대안을 요구한다.                                                                   | 기본적으로 모든 노트를 별도 Tab 정지로 노출, 드래그 전용 편집·크기 조절, 방향 뒤에 compact 복구·export·submission을 막는 것, 이 가이드 단계에서 Pixi rendering model을 재설계하는 것.                         |
| 검증과 handoff             | 시맨틱 구조, 읽기·focus 순서, 접근 가능한 이름·설명, 키보드 모델, live-region 동작, 타깃 geometry, 대비·비색상 단서, reflow, 텍스트 확장, 언어, motion, 상태, 복구를 주석으로 남긴다. 대표적인 완전한 과업을 자동 검사와 함께 키보드 전용, screen reader, `200%` 확대, `320 CSS px`, 텍스트 간격, 고대비/forced-colors, reduced-motion, touch, browser 검사로 검증한다. 가능한 경우 장애 사용자를 평가 테스트에 포함한다. | lint, axe, unit test, 시각 검토만으로 접근성을 증명하는 것, 컴포넌트 library나 하나의 정적 route 상태만 시험하는 것, 해당되는 긴·빈·오류·disabled·permission·destructive 상태 없이 가이드 예시를 승인하는 것. |

### `PR-10`의 승인 해석 경계

집중 검토는 독립 출처 12개를 넘고 15개 이후에도 유지 관리되는 디자인 시스템,
기여·생명주기 지침, 결정 기록 방법, 접근성 표준, 특수 Rendering Platform 및
Third-party 연동 근거를 조사했다. 추가로 신뢰할 수 있는 출처가 등록 승인, 격리,
Fallback, 생명주기 또는 검증 Model을 더는 바꾸지 않았다. 사용자는 2026-08-03에
다음 거버넌스 계약을 승인했다.

| 범위        | 이번 승인이 요구하는 것                                                                                                                                                        | 이번 승인이 선택하거나 허용하지 않는 것                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 분류        | 무엇이든 등록하기 전에 도메인 불변조건, 정상 적응, 특수 계약, 경계가 있는 예외, 임시 예외, 범위·Future Work 및 구현 부채를 구분한다.                                           | 모든 NOSTALGIA 규칙, 반응형 Variant, 연기한 기능 또는 현행 Code 한계를 예외라고 부르는 것.                                                             |
| 등록 승인   | 검증된 필요, 이름 붙인 지배 편차, 공통 시스템이 불충분하다는 근거, 가장 작은 정확한 경계, 동등한 경로 또는 Fallback, 교차 영역 영향, 검증, 생명주기 및 거절한 대안을 요구한다. | 시각 취향, Legacy Code, 일정 압박, 구현 편의, 스크린샷 하나, Framework 기본값, Browser Brand 가정 또는 Third-party 한계를 충분한 정당화로 취급하는 것. |
| 권한        | Claude Design과 미래 Codex 세션은 기록을 제안할 수 있지만 사용자·NosLog 유지관리자만 승인할 수 있다. 실질적인 변경은 승인 기록을 조용히 다시 쓰지 않고 대체한다.               | 후속 디자이너나 구현 Agent가 사용자 검토 없이 예외를 확장하거나 전역으로 승격하거나 충돌을 해결하는 것.                                                |
| 생명주기    | 영구 특수 계약은 Trigger 기반으로 재검토한다. 모든 임시 예외에 제거 Milestone과 대체 경로를 요구한다. 두 번째 페이지 Family가 로컬 패턴을 요구하면 재검토한다.                 | 안정적인 도메인 계약의 임의 만료, 기한이 지난 임시 예외의 자동 영구화 또는 반복 사용 뒤 자동 승격.                                                     |
| 최초 등록부 | 집중형 뷰어 셸, 로컬 전체 채보 2D 영역, 에디터 공간 작업 영역, WebGL 낙하형 Renderer, 단일 계열 5축 커뮤니티 레이더 및 보조 공식 X 위젯을 `SP-01`–`SP-06`으로 지배한다.        | 이미 승인된 제품 결정을 다시 열거나, 동작을 관련 없는 페이지로 옮기거나, 현행 구현 실패를 승인된 Variant로 취급하는 것.                                |

완전한 기록 Schema, 근거, 최초 여섯 항목, 명시적 비등록 항목 및 후속 Handoff
규칙은 [특수 패턴 및 예외 등록부](./23-specialized-pattern-exception-register.ko.md)를
정본으로 따른다.

## Foundation v0.1 진입 Gate

10개 교차 영역 원칙과 지켜야 할 제품 계층은 승인됐다. 파운데이션 조사는 시작할
수 있지만 각각의 집중 근거, 사용자 결정 및 대표 표본 검증 없이 어떤 Token, 값,
컴포넌트 Anatomy 또는 하이파이 처리도 승인되지 않는다.

1. 값을 선택하기 전에 foundation v0.1 조사 브리프를 만든다.
    - 다국어 타이포그래피와 metric 타이포그래피
    - 중립 다크 레이어, 시맨틱 색, 손·난이도·데이터 충돌 정책
    - 간격, 그리드, 컨테이너, 밀도
    - 테두리, radius, elevation, material 처리
    - 아이콘 역할과 라벨
    - reduced-motion 동작을 포함한 기능적·표현적 모션
    - 데이터 시각화 구조와 접근 가능한 대안
2. 고립된 swatch 대신 실제 콘텐츠가 있는 대표 fragment에 후보를 적용한다.
   공용 탐색, 악곡 상세·기록 비교, 랭킹, 채보 뷰어, 조밀한 편집형 홈·공지
   fragment를 포함한다.
3. 토큰이나 컴포넌트를 `Approved`로 승격하기 전에 `320`, 대표 `390`, 중간
   전환 폭, 데스크톱 비교 레이아웃을 검증한다.

## 결정 로그

| ID        | 항목                                                                                                                       | 근거와 이유                                                                                                                                                                                                                                                                                                                                                                                                                      | 상태       |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `REF-D01` | 모든 레퍼런스를 동등하게 취급하지 않고 역할별 근거 분류와 한계를 사용한다.                                                 | 시각 레퍼런스가 접근성이나 도메인 진실성을 덮어쓰지 못하게 하면서 아트 디렉션의 정당한 역할은 보존한다. 근거 역할 모델 `A`–`E`.                                                                                                                                                                                                                                                                                                  | `Approved` |
| `REF-D02` | 이 매트릭스를 교차 영역 출처 풀로 취급하며 집중된 12~15개 출처 결정 조사를 대신하지 않는다.                                | 승인된 조사 방법은 집중된 각 주요 결정마다 관련 근거가 포화될 것을 요구한다.                                                                                                                                                                                                                                                                                                                                                     | `Approved` |
| `REF-D03` | 승인된 페이지 브리프와 NOSTALGIA 의미를 레퍼런스가 바꿀 수 없는 제약으로 유지한다.                                         | 문서 `01`–`21`과 지배적인 제품 제약에서 관찰됐다.                                                                                                                                                                                                                                                                                                                                                                                | `Observed` |
| `REF-D04` | 이 단계에서 서체, 팔레트 값, 간격 base, 그리드 폭, 브레이크포인트, radius, elevation, 아이콘, 모션 값을 선택하지 않는다.   | `OPEN-01`–`OPEN-08`은 값을 정하기 전에 대표 표본과 집중 근거가 필요하다.                                                                                                                                                                                                                                                                                                                                                         | `Observed` |
| `REF-D05` | foundation v0.1을 작성하기 전에 10개 원칙 후보를 사용자 검토로 가져간다.                                                   | 디자인 가이드 워크플로와 승인 게이트가 요구하며 이제 10개 후보 모두 집중 검토와 명시적 사용자 결정을 받았다.                                                                                                                                                                                                                                                                                                                     | `Approved` |
| `PR-01`   | 페이지마다 별도 크기와 강조 체계를 만드는 대신 각 페이지의 주 과업을 하나의 공통 계층에 매핑하여 우선한다.                 | `/ko`, `/ko/music`, `/ko/rankings` 브라우저 검증에서 `1440px` viewport에도 `390px` 콘텐츠 셸이 유지되고, 외곽 패딩이 조금씩 다르며, 승인된 교차 페이지 시맨틱 역할 맵 없이 컨트롤 높이가 `22px`부터 `80px`까지 사용되는 것을 확인했다. 공통 역할은 필요한 페이지 패밀리 차이는 보존하면서 우연한 drift를 막는다. `CONV-01`, `CONV-03`, 매트릭스 B와 C.                                                                           | `Approved` |
| `PR-02`   | 익숙한 웹 상호작용 패턴을 사용하되 NOSTALGIA 엔티티와 용어를 일반화하거나 대체하지 않는다.                                 | 익숙한 패턴은 상호작용 학습 부담을 줄이고 도메인 정확성은 잘못된 그룹과 오해를 부르는 필터를 막는다. `CONV-06`, `CONV-09`, 매트릭스 E.                                                                                                                                                                                                                                                                                           | `Approved` |
| `PR-03`   | 기본 화면은 간결하게 유지하되 각 결과를 설명하는 scope, 선택, 상태 또는 값을 보존한다.                                     | 탐색 속도와 이해 가능성을 함께 지키며 보조 분석은 점진적으로 제공한다. `CONV-01`, `CONV-06`, 매트릭스 A와 D.                                                                                                                                                                                                                                                                                                                     | `Approved` |
| `PR-04`   | 다크를 대표 시각 기준점으로 삼고 색과 효과를 문서화된 역할에 할당하며 System, Dark, Light에서 완전한 동작을 지원한다.      | 15개 출처 집중 검토는 시맨틱 역할, 중립 표면 계층, appearance 간 대비, 중복 상태 표현으로 수렴했다. 설정 결정 `SET-08`과 `SET-09`는 이미 기기 단위 System/Dark/Light를 요구하고 다크 보편 기본값을 대체했으므로 다크 전용 지원과 단순 팔레트 반전을 거절했다. 정확한 시각 값은 유보한다. 매트릭스 A와 C.                                                                                                                         | `Approved` |
| `PR-05`   | 모든 지원 언어에서 하나의 시맨틱 타이포그래피 계층을 보존하되 각 script의 실제 조판을 검증한다.                            | 13개 출처 집중 검토는 역할 기반 계층, 실제 언어 표본, 언어 인식 줄바꿈, 확장 가능한 텍스트, locale 인식 형식으로 수렴했다. 하나의 동일한 명목 metric은 한국어·일본어·Latin 차이를 무시하고 언어별 독립 체계는 계층 drift를 허용한다. 서체와 scale 값은 유보한다. 매트릭스 A와 C.                                                                                                                                                 | `Approved` |
| `PR-06`   | Compact와 Wide Layout에서 실제 콘텐츠·컨테이너 제약으로 재구성하며 같은 과업과 의미를 보존한다.                            | 14개 출처 집중 검토는 서로 다른 grid·breakpoint 값에도 모바일 우선 reflow, 콘텐츠 기반 전환, 시맨틱·source 순서 보존, 의도적인 Wide Layout 사용으로 수렴했다. Wide Viewport에서 현재 고정 `390px` 셸 유지와 단순 모바일 확대를 거절하며 정확한 breakpoint·container 값은 유보한다. 매트릭스 B와 승인된 기기 전략.                                                                                                                | `Approved` |
| `PR-07`   | 비교 프레임을 정렬하고 모든 시각화를 정확한 근거와 연결한다.                                                               | 집중 검토는 과업에 맞는 형식, 안정된 scope·분모·단위·기간·순서·scale, 포인터 전용 상호작용 밖의 핵심 값, 구조화된 정확한 상세, 중복 인코딩으로 수렴했다. 레이더 연구는 일반 효용에서 엇갈리지만 승인된 경계를 지지한다. 학습된 5축 단일 profile은 패턴 인식을 도울 수 있지만 다중 계열이나 정밀 비교에는 부적합하다. 기존의 정확한 랭킹 모집단, 점수 구간, 단일 커뮤니티 레이더를 보존한다. 매트릭스 A, D, E.                    | `Approved` |
| `PR-08`   | 행동 계층으로 컨트롤을 절제하고 콘텐츠와 구성으로 NosLog 정체성을 만든다.                                                  | 성숙한 시스템은 제한된 강조, 보이는 고빈도 행동, 보조 행동의 맥락적 disclosure로 수렴한다. 음악·콘텐츠 제품은 자켓, 타이포그래피, 비례, 리듬, material, 문체와 목적 있는 모션이 정체성을 전달할 수 있음을 보여준다. 차분한 셸과 제한된 표현 순간의 조합은 상시 컨트롤 과밀과 개성 없는 유틸리티 표면을 함께 피한다. 정확한 시각 값과 컴포넌트 구조는 유보한다. 매트릭스 B, C, E, F.                                              | `Approved` |
| `PR-09`   | 접근성을 구조 입력으로 만들고 표준·전문 NosLog 표면 전반에서 동등한 정보와 과업 완료를 보존한다.                           | 표준, 시스템, 플랫폼 출처, 평가 레퍼런스 30개 이상의 집중 검토는 WCAG 2.2 AA 목표, 네이티브 의미론 우선, 완전한 custom-composite 계약, modality 독립 과업 경로, 경계가 있는 2차원 예외, 자동·숙련 수동 검증의 조합으로 수렴했다. 이는 승인된 WebGL 뷰어, 데이터 시각화, 지도, 포인터 효율적인 에디터를 보존하면서 과업에 필요한 구조화된 근거와 키보드 또는 목록 대안을 요구한다. 매트릭스 A와 승인된 뷰어·오락실·에디터 브리프. | `Approved` |
| `PR-10`   | 우연한 drift를 허용하지 않고 문서화된 목적, 제한된 범위, Fallback, 검증, 소유권 및 재검토를 통해서만 특수 동작을 등록한다. | 디자인 시스템 기여·생명주기 Model, ADR 거버넌스, WCAG 예외 경계, WebGL 복구 및 X Embed·개인정보 근거의 집중 검토는 구분 없는 하나의 예외 목록이 아니라 분류된 등록부로 수렴했다. 사용자는 사용자 전용 승인 권한, 영구 계약의 Trigger 기반 검토, 임시 예외의 제거 Milestone 및 `SP-01`–`SP-06` 최초 등록부를 승인했다.                                                                                                            | `Approved` |

## 단계 승인 체크리스트

- [x] 사용자가 근거 역할 모델을 승인하거나 수정한다.
- [x] 사용자가 매트릭스를 최종 시각 방향으로 취급하지 않으면서 디자인 원칙
      결정을 시작하기에 충분히 폭넓은지 확인한다.
- [x] 제안된 모든 원칙을 개별적으로 승인, 수정, 거부하거나 열어 둔다.
- [x] 영어·한국어 문서의 실질 내용이 동기화돼 있다.
- [x] 이 조사 초안만으로 파운데이션 값이나 하이파이 디자인을 승인된 것으로
      취급하지 않는다.
