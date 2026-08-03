# NosLog 2.0 파운데이션 v0.1 조사 브리프

## 문서 관리

- 상태: `제안된 조사 프로토콜 — 사용자 승인 대기`
- 조사일: 2026-08-03
- 원본 언어: 영어
- 영어 원본:
  [24-foundation-v0.1-research-brief.md](./24-foundation-v0.1-research-brief.md)
- 범위: 첫 NosLog 2.0 시각 파운데이션 값을 선택하기 전에 필요한 조사 질문,
  후보 구조, 대표 콘텐츠, specimen 집합, 평가 방법 및 승인 Gate
- 입력: 승인된 문서 `01`–`23`, 현재 저장소 token과 component, 현재 로컬
  브라우저 근거, 현행 표준, 유지 관리되는 디자인 시스템 및 문서 `22`의 명시적
  Foundation 진입 Gate
- 제외: 최종 글꼴, Palette 값, 간격 단위, Grid, Breakpoint, Radius, Shadow,
  Icon 스타일, Motion 시간, Chart 스타일, Component anatomy, High-fidelity
  화면, Figma Production 화면 및 Application 구현

이 브리프는 시각 시스템을 승인하지 않습니다. 후보를 어떻게 조사하고,
결합하고, 시험하고, 비교하고, 사용자 결정 대상으로 올릴지를 정의합니다.
현재 값, Reference 값, Tailwind 기본값 또는 후보는 이 문서에 등장했다는
이유만으로 권위 있는 값이 되지 않습니다.

## 관련 문서

- [현재 제품 감사](./01-current-product-audit.ko.md)
- [교차 영역 레퍼런스 매트릭스](./22-cross-cutting-reference-matrix.ko.md)
- [특수 패턴 및 예외 등록부](./23-specialized-pattern-exception-register.ko.md)
- [공유 탐색 페이지 브리프](./04-shared-discovery-page-brief.ko.md)
- [악곡 상세 페이지 브리프](./05-music-detail-page-brief.ko.md)
- [채보 뷰어 페이지 브리프](./07-chart-viewer-page-brief.ko.md)
- [전역 랭킹 페이지 브리프](./08-global-rankings-page-brief.ko.md)
- [공유 Shell 및 내비게이션 브리프](./15-shared-shell-navigation-brief.ko.md)
- [채보 에디터 및 기여 페이지 브리프](./20-chart-editor-contribution-page-brief.ko.md)

## 목적과 성공 조건

Foundation v0.1은 보기 좋은 specimen 하나를 성급하게 NosLog 시스템으로
확정하지 않으면서 이후 Claude Design 작업을 정밀하게 만들어야 합니다. 다음을
충족할 때 이 조사 단계가 성공합니다.

1. 제안된 모든 값이 명명된 Semantic role과 검증된 NosLog 필요에 답한다.
2. Typography, Color, Spacing, Layout, Surface, Iconography, Motion 및 Data
   visualization을 서로 분리된 Style board가 아니라 하나의 구성으로 평가한다.
3. 후보가 실제 한국어·일본어·영어, Metric, 긴 콘텐츠, 고밀도, Empty, Error,
   Disabled, Permission 및 Destructive 예시를 통과한다.
4. Compact와 Wide Layout이 의도적으로 재구성되면서 같은 과업과 의미를
   보존한다.
5. Dark, Light, System 선호, High contrast, Zoom, Text spacing 및 Reduced
   motion을 디자인 이후의 보정이 아니라 디자인 입력으로 취급한다.
6. 사용자가 근거가 있는 제한된 대안을 비교하고 각 중대한 결정을 명시적으로
   승인, 거부 또는 수정할 수 있다.
7. 승인된 값을 이후 Figma Variable과 Code token에 모호함 없이 Mapping할 수
   있다.

## 지배 제약

조사는 다음 승인 계약을 다시 열거나 조용히 약화할 수 없습니다.

| 지배 결정                                       | 파운데이션에 미치는 결과                                                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `PR-01` 공유 계층                               | 모든 페이지는 주 과업과 보조 콘텐츠를 공유 Semantic role에 Mapping합니다. 페이지별 우선순위가 페이지별 Type scale을 만들지 않습니다. |
| `PR-02` 익숙한 상호작용, 정확한 Domain 언어     | Foundation Styling은 상호작용을 명확하게 만들 수 있지만 NOSTALGIA Entity를 개명, 병합 또는 일반화할 수 없습니다.                     |
| `PR-03` 필요한 문맥을 보존한 간결한 기본 화면   | 결과를 설명하는 범위나 값을 숨기는 대신 계층과 점진적 공개로 밀도를 낮춥니다.                                                        |
| `PR-04` 완전한 Appearance 동작을 갖춘 Dark 기준 | Dark는 대표 Art direction 기준이지만 System, Dark, Light는 완전한 Semantic parity가 필요합니다.                                      |
| `PR-05` 하나의 Semantic 다국어 계층             | 한국어, 일본어, 영어는 Role을 공유하지만 문자 체계를 인식한 조판과 실제 콘텐츠 시험이 필요합니다.                                    |
| `PR-06` 반응형 재구성을 통한 과업 동등성        | `390px`은 대표 Canvas이지 Application 폭이 아닙니다. `320 CSS px` Reflow와 의도적인 Wide Layout이 필수입니다.                        |
| `PR-07` 안정적인 비교와 정확한 근거             | Chart와 고밀도 비교는 Unit, Denominator, Scope, Order 및 구조화된 정확한 값을 보존합니다.                                            |
| `PR-08` 콘텐츠 주도 정체성                      | Jacket art, 악곡, Score 및 NOSTALGIA 의미가 개성을 전달할 수 있으며 Brand color와 Effect가 모든 Surface를 지배할 필요가 없습니다.    |
| `PR-09` 처음부터 통합된 접근성                  | Semantic structure, Focus, Target geometry, Contrast, 비색상 단서, Reflow, Language 및 Motion 선호가 후보 평가에 참여합니다.         |
| `PR-10` 관리되는 특수화                         | `SP-01`–`SP-06`은 제한된 범위를 유지합니다. Renderer나 Editor 필요가 무관한 공유 Pattern으로 벗어날 수 없습니다.                     |

## 조사 방법

### 근거 역할

문서 `22`에서 정한 근거 Class를 사용합니다.

- `A`: 규범적 접근성 및 국제화 지침
- `B`: 유지 관리되는 디자인 시스템 및 Platform 지침
- `C`: 현재 Production 제품
- `D`: 공식 게임 자료 및 Rhythm game Domain 제품
- `E`: Editorial 및 Art direction Reference

어떤 Class도 다른 Class를 대체하지 않습니다. WCAG는 Art direction을 고르지
않고, Behance는 Target geometry를 정하지 않으며, Rhythm game 사이트는
NOSTALGIA 의미론을 다시 정의하지 않고, 디자인 시스템 기본값은 NosLog
Token이 되지 않습니다.

### 집중 비교와 포화

- 중대한 각 Decision batch는 독립적이고 관련성 높은 출처를 최소 12개
  비교하며, 신뢰할 수 있는 추가 출처가 Pattern, Risk 또는 Exception을 계속
  바꾼다면 15개 이상을 권장합니다.
- 한 조직의 여러 페이지는 하나의 출처를 깊게 만들 수 있지만 독립 출처 수를
  부풀리지 않습니다.
- 검색 결과 페이지, Mirror, 번역 사본 및 약한 Listicle은 세지 않습니다.
- 신뢰할 수 있는 출처를 더 추가해도 대안, 제약 또는 탈락 조건이 실질적으로
  달라지지 않을 때만 조사를 멈춥니다.
- 유지하는 각 출처에는 전이 가능한 원칙, NosLog 적용성 및 한계를 기록합니다.

### 승인 규율

관찰한 사실은 즉시 기록할 수 있습니다. 대안과 추천은 사용자가 명시적으로
결정할 때까지 `Proposed`로 남습니다. 조사 방법 승인은 어떤 후보 값의 승인도
아닙니다. 한 Decision batch 승인이 다음 Batch 승인을 의미하지 않습니다.

## 현재 구현 기준선

### 저장소 관찰

현재 구현은 기존 콘텐츠와 불일치의 근거이며 NosLog 2.0의 시각 권위가
아닙니다.

| 영역               | 관찰한 구현                                                                                                                                                             | 조사에 주는 의미                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 글꼴               | `app/layout.tsx`가 `next/font/local`로 로컬 `PretendardVariable.woff2`를 불러오며 Weight `45 920`, `swap`을 사용합니다.                                                 | Pretendard는 현행 후보이며 귀중한 Production 근거를 제공합니다. 최종 선택으로 자동 확정되지는 않습니다.                          |
| Type role          | `app/globals.css`는 Display, Score display, Title, Wordmark, Section, Body, Muted body, Label, Caption, Micro, Badge, Input Utility를 정의합니다.                       | Semantic role 발상은 재사용할 수 있지만 현재 값과 이름은 실제 콘텐츠 검증이 필요합니다.                                          |
| 현재 Type 사용     | 넓은 `app` + `components` Scan에서 `text-sm` 164회, `text-xs` 149회, 명시적 `10px` 11회와 여러 다른 직접 크기를 확인했습니다.                                           | Token utility와 많은 로컬 선택이 공존합니다. 빈도는 Debt를 설명하지만 미래 Scale을 선택하지 않습니다.                            |
| Color              | Dark·Light CSS Variable이 Neutral surface, Text, Interaction, State, Rank, Difficulty, Basic/Recital, Genre 및 Discord를 다룹니다.                                      | Role inventory는 유용하지만 Ownership·Collision 규칙은 불완전하고 각 Appearance를 검증해야 합니다.                               |
| Theme 동작         | CSS에는 Dark·Light 값이 있으나 초기 Root script는 현재 명시적 `light` 또는 Fallback `dark`만 결정합니다.                                                                | 승인된 System/Dark/Light 계약은 현재 동작에 아직 완전히 표현되지 않았습니다. Foundation 조사가 세 가지 모두를 명시해야 합니다.   |
| Spacing과 Density  | Code는 `gap-1`부터 `gap-4`, 여러 Half step, 직접 Padding/Margin 값, `h-8`부터 `h-12` 이상까지 Control 높이를 반복 사용합니다.                                           | 반복은 유용한 Cluster를 암시하지만 Count만으로 승인된 Spacing, Density 또는 Target scale을 추론할 수 없습니다.                   |
| Radius와 Elevation | `0.5rem` Card radius가 있으나 넓은 Scan에서는 `rounded-md` 233회, `rounded-card` 196회, `rounded-full` 66회, 다른 Radius와 여러 Shadow level을 확인했습니다.            | Surface vocabulary는 일부 Token화됐지만 목적에 따라 관리되지 않습니다. 후보 작업은 자의적인 Depth와 Corner 사용을 줄여야 합니다. |
| Icon               | `lucide-react`가 주요 Code dependency이며 Rank image, Flag, Jacket image 및 Custom Canvas/WebGL mark가 함께 있습니다.                                                   | Domain art나 Renderer graphic을 같은 Icon set으로 강제하지 않으면서 일관된 기능 Icon grammar를 시험합니다.                       |
| Motion             | 제품은 많은 로컬 Color, Opacity, Transform transition과 Spinner·Renderer animation을 사용합니다. 완전한 Semantic motion 및 Reduced-motion token 모델은 보이지 않습니다. | 시간과 Easing을 고르기 전에 기능 Feedback, Spatial continuity, Loading 및 Expressive motion을 구분합니다.                        |
| Visualization      | Recharts가 Line, Radar, Bar 등의 Chart를 그리고 PixiJS가 낙하형 Viewer와 Editor를 그립니다.                                                                             | Chart anatomy와 Renderer styling은 승인된 특수 계약을 존중하면서 의미론을 공유해야 합니다.                                       |
| Layout             | 사용자용 Navigation shell은 `max-w-97.5`(`390px`)를 사용합니다. 일부 내부 페이지는 더 큰 Maximum width를 선언하지만 Outer shell이 해당 공간 사용을 막습니다.            | 기존 Shell은 검증된 구현 Gap이지 새 Desktop container가 아닙니다.                                                                |

위 Raw count는 사용자용과 관리자 Code를 모두 포함하며 현재 편차의 폭만
보여주기 위해 사용합니다. 관리자 화면은 공유 Primitive 또는 미래 사용자용
Editor 요구가 근거를 필요로 하는 경우를 제외하고 광범위한 2.0 재설계 범위
밖에 있습니다.

### 브라우저 관찰

로그인한 로컬 제품을 2026-08-03에 확인했습니다. 다음은 현재 동작만
설명합니다.

| Route와 Viewport                  | 관찰 근거                                                                                                                                                            | 드러난 Foundation 질문                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/ko`, `390 × 844`                | Home은 Compact header, Notice, 중앙 Identity, Search, 목적지 Block 6개, 연동 Guide, Feedback, 공식 소식 및 Footer를 하나의 좁은 읽기 흐름으로 사용합니다.            | 유지 항목 모두에 같은 비중을 주지 않으면서 공유 Compact rhythm을 정합니다.                                               |
| `/ko`, `1440 × 900`               | 같은 약 `390px` 열이 광범위한 빈 공간과 함께 중앙에 남습니다.                                                                                                        | Mobile card를 단순히 키우지 않으면서 의도적인 Wide composition과 Reading width를 정합니다.                               |
| `/ko/music`, `390 × 844`          | 고밀도 List row에 Jacket, 긴 일본어·Latin 제목, Artist, Category 및 난이도 값 4개가 있습니다. Text truncation과 작은 Control은 이미 유용한 Stress case를 제공합니다. | 다국어 제목 Metric, 고밀도 Row rhythm, Difficulty color ownership, Target geometry 및 List/Grid adaptation을 검증합니다. |
| `/ko/music`, `1440 × 900`         | 좁은 List가 Wide space를 탐색·비교 개선에 사용하지 않고 중앙에 남습니다.                                                                                             | 과업 필요에서 출발해 Bounded container, List proportion 및 Desktop enhancement를 정합니다.                               |
| `/ko/rankings`, `390 × 844`       | 지속적으로 보이는 Selector group 3개, 현재 사용자 Summary, Flag, Rank 및 Metric 중심 Row가 List 위에 쌓입니다.                                                       | Selector hierarchy, Target size, Metric typography, 비색상 State 및 고밀도 Row comparison을 함께 시험합니다.             |
| `/ko/music/.../real`, `390 × 844` | Music Detail은 Title, Artist, Level constant, Difficulty·Section navigation, Score metric, Chart, Judgement detail 및 Recent play를 결합합니다.                      | Page hierarchy, Score typography, Localization, Data visualization 및 Progressive disclosure를 한 구성에서 시험합니다.   |

현재 제품은 이미 실제 긴 제목, 혼합 문자, Jacket Empty state, Score, Rank 및
고밀도 Filter를 제공합니다. 이 Fixture는 Specimen에 재사용하되 현재 Layout과
Style은 재사용하지 않습니다.

## 파운데이션 의존 모델

어떤 Foundation track도 혼자 승인하지 않습니다. 다음 의존성이 모든 후보
검토에서 보여야 합니다.

| Track                     | 의존 대상                                                                  | 분리해 결정할 때 흔한 실패                                                                         |
| ------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Typography                | Content, Language, Width, Spacing, Contrast, Metric alignment              | Latin에서 균형 있어 보이는 Scale이 한국어·일본어 Wrapping이나 Score row에서 실패합니다.            |
| Color                     | Surface, Type weight, Border, State, Chart, Appearance mode                | Palette가 Swatch에서는 통과하지만 작은 Metadata, Focus, Difficulty 또는 Chart mark에서 실패합니다. |
| Spacing과 Grid            | Type metric, Target, Content length, Density, Wide-task model              | 정돈된 Spacing scale이 Control을 자르거나 Desktop을 늘어난 Mobile 열로 만듭니다.                   |
| Border, Radius, Elevation | Color layer, Interaction state, Grouping, Overlay behavior                 | 모든 Block이 Raised card가 되어 계층이 시끄러워집니다.                                             |
| Icon                      | Label policy, Target size, Stroke contrast, Locale-independent recognition | 작고 Label 없는 Icon이 모호하거나 Rank·Domain image와 불일치합니다.                                |
| Motion                    | State change, Focus, Renderer timing, Reduced-motion contract              | 장식이 상태를 가리거나 Reduced motion이 채보 의미를 우연히 바꿉니다.                               |
| Data visualization        | Exact value, Type, Color ownership, Container size, Interaction            | Chart가 아름답지만 비교할 수 없고 Hover 의존적이거나 접근 불가능해집니다.                          |

## 조사 Track

### F1. 다국어 및 Metric Typography

#### 질문

1. NosLog 실제 밀도에서 어떤 Font 또는 Locale-aware stack이 한국어, 일본어,
   Latin, Numeral, Punctuation 및 Symbol 조판을 가장 잘 제공하는가?
2. 한 Family/Variable family가 Body, Control, Title, Metric 필요를 충족하는가,
   아니면 엄격히 제한된 Metric/Display companion이 정당한가?
3. 페이지별 Scale을 만들지 않으면서 필요한 공유 Semantic role은 무엇인가?
4. Title reading/translation, 원문 제목, Artist, Score, Rank, Tabular value,
   Caption 및 Legal copy가 순서와 가독성을 어떻게 보존하는가?
5. 어떤 Line-height, Weight, Tracking, Wrapping, Truncation, Numeral 및 Fallback
   동작이 세 Locale, Text spacing 및 `200%` Text enlargement를 통과하는가?
6. 어떤 Font loading·Fallback metric 전략이 허용하기 어려운 Layout shift를
   막는가?

#### 필수 후보 근거

- Incumbent Pretendard 후보와 Glyph coverage, License, Web delivery, 언어
  형태, Metric 및 Performance로 정당화된 신뢰할 수 있는 대안
- 같은 Semantic role을 사용하는 한국어, 일본어, 영어, 혼합 문자 및 Metric
  Specimen
- Alphabet sample만이 아니라 실제 긴 악곡 제목과 Artist
- Tabular alignment, Separator, Decimal, Sign, Rank, BPM, Time signature,
  Measure number 및 정확한 Time을 포함한 Score·Time 예시
- Fallback 및 느린 Font loading 비교

#### 후보 탈락 조건

- Locale별 독립 Semantic hierarchy가 필요함
- 필수 일본어·한국어 Glyph나 Symbol이 예측 불가능하게 Fallback됨
- 작은 Metadata가 매우 얇은 Weight 또는 낮은 Contrast에 의존함
- 긴 Title이나 Control이 Fixed-height clipping을 요구함
- Metric 강조가 읽기 계층을 왜곡함
- Production 사용을 지원할 Performance/License가 없음

### F2. Appearance, Color role 및 Collision 정책

#### 질문

1. Page, Grouped content, Sunken workspace, Raised content, Overlay 및 Scrim에
   몇 개의 Neutral background·Surface role이 필요한가?
2. Text, Icon, Border, Focus, Interaction, Success, Warning, Danger,
   Information, Disabled, Selected 및 Loading color를 어떤 Semantic role이
   소유하는가?
3. NOSTALGIA Hand, Difficulty, Basic/Recital, Rank, Score band, Genre 및 Data
   series color가 Action·Status와 충돌하지 않게 하는가?
4. 어떤 Role이 Color를 강하게 사용할 수 있고 어떤 Role은 Neutral 또는
   Content-led로 남아야 하는가?
5. System, Dark, Light가 단순 반전 없이 동일한 의미를 보존하는가?
6. 모든 State, Hand, Difficulty 및 Chart distinction에 어떤 비색상 단서가
   함께하는가?

#### 제안된 Ownership layer

다음 모델은 조사 가설이며 승인된 Palette가 아닙니다.

1. Neutral 및 Surface role
2. Text, Icon, Border, Focus 및 Interaction role
3. 보편적 Semantic status role
4. Hand, Difficulty, Mode 같은 안정적인 NOSTALGIA entity role
5. 비교 영역에 한정된 Data-series role
6. 다른 의미를 획득하지 않는 곳에서만 사용하는 Content/Brand accent

모든 후보는 같은 Appearance가 허용되는 곳, 금지되는 곳, 중복 Label, Shape,
Pattern, Icon 또는 Value가 필요한 곳을 보여주는 Collision table을 제공해야
합니다.

#### 후보 탈락 조건

- 한 Hue가 중복 설명 없이 Status와 Difficulty를 모두 뜻함
- Secondary text, Border, Focus 또는 필수 Chart mark가 적용 Contrast를 통과하지 못함
- Dark elevation이 보이지 않는 Shadow에 의존함
- Light appearance가 Dark screenshot의 반전에 불과함
- Jacket art나 Score state가 주변 가독성을 무너뜨림
- Color 지각 없이는 비교를 이해할 수 없음

### F3. Spacing, Grid, Container 및 Density

#### 질문

1. Optical correction을 막지 않으면서 일관된 Grouping을 만드는 가장 작은
   유용한 Spacing set은 무엇인가?
2. Inline item, Control group, Card content, Section 및 Page region에 어떤
   Gap이 속하는가?
3. 어떤 Compact·Comfortable density mode가 실제로 필요하며 어디에 필요한가?
4. Reading, Discovery list, Detail analysis, Rankings, Viewer/Editor workspace 및
   Overlay를 어떤 Container class가 지원하는가?
5. 측정한 어느 Content width에서 List, Grid, Pane, Selector 또는 Chart
   구성을 변경해야 하는가?
6. `320 CSS px`와 Zoom에서 Padding과 Target geometry가 어떻게 사용 가능하게
   남는가?

#### 필수 후보 근거

- 자의적 숫자 목록이 아닌 Spacing-role map
- 같은 실제 콘텐츠 Fragment의 Compact·Wide version
- 가장 긴 현지화 Label과 검증된 Type으로 측정한 Transition point
- Wide space가 비교·분석을 개선하는 예시와 Text를 의도적으로 제한하는 예시
- Pointer target 및 Focus clearance overlay

#### 후보 탈락 조건

- `390px`이 고정 Application width 또는 Universal breakpoint가 됨
- Desktop이 Mobile column을 단순히 확대하거나 중앙에 둠
- 모든 페이지가 독립 Outer padding, Grid 및 Section rhythm을 발명함
- 작은 Text나 빽빽한 Target으로 Density를 만듦
- 일반 페이지에 2차원 Scroll이 필요함

### F4. Border, Radius, Elevation 및 Material treatment

#### 질문

1. 어떤 Boundary가 Whitespace, Divider, Border, Surface shift 또는 실제
   Elevation을 사용해야 하는가?
2. 몇 개의 Radius 및 Border-weight role이 필요한가?
3. 어떤 요소가 Flat, Sunken, Raised, Overlay, Movable, Focused, Selected 또는
   Interactive인가?
4. Dark·Light appearance에서 과도한 Shadow 없이 Layering을 어떻게 전달하는가?
5. Jacket art, Chart, Menu, Dialog, Popover 및 Focused viewer control이 하나의
   Material model 안에 어떻게 놓이는가?

#### 필수 후보 근거

- 일반 Content card 1개, Grouped flat region 1개, Input/control group 1개,
  Overlay 1개, Dialog 1개, Scroll boundary 1개 및 Viewer control surface 1개
- Dark/Light Layering과 Interaction state 나란히 비교
- 모든 Shadow와 Rounded container에 대한 명시적 근거

#### 후보 탈락 조건

- Raised card가 기본 Grouping 장치가 됨
- Radius가 구조가 아니라 장식이 됨
- Shadow가 유일한 Dark-mode layer 단서임
- Overlay를 Page content와 구분할 수 없음
- Border를 반복 중첩해 Content hierarchy를 전달함

### F5. Iconography 및 Graphic role

#### 질문

1. 어떤 Action이 Text label, Icon+label, Icon-only 또는 Icon 없음이 필요한가?
2. 현재 Lucide base가 일반 Web action에 일관된 Stroke, Optical size 및
   Metaphor system을 제공할 수 있는가?
3. 어떤 Domain graphic이 분리돼야 하는가: Rank image, Flag, Jacket, Hand cue,
   Difficulty identifier, Chart note 및 NosLog mark
4. Compact control에서 어떤 Size, Stroke, Container, Contrast 및
   Disabled/Focus 동작이 읽히는가?
5. 낯선 Icon은 어떻게 현지화하고 보조 기술용 이름을 제공하는가?

#### 후보 탈락 조건

- Icon-only action이 낯선 Metaphor에 의존함
- Decorative icon이 악곡 Art나 Data와 경쟁함
- 의도한 크기에서 Stroke contrast가 사라짐
- Country, Rank, Difficulty 또는 State를 Label 없는 Image로만 전달함
- 한 Icon이 Page family마다 의미가 바뀜

### F6. 기능적·표현적 Motion

#### 질문

1. 어떤 Motion이 Loading, State change, Spatial continuity, Direct manipulation,
   Attention 또는 Expressive identity를 전달하는가?
2. 어떤 Transition이 공유 Semantic duration/easing role을 사용할 수 있는가?
3. 어떤 Motion이 낙하형 채보의 Timing 의미에 필수이며 어떤 Shell motion은
   선택적인가?
4. Reduced motion에서 무엇을 제거, 단축, Fade 또는 즉시 전환하는가?
5. Animation이 없을 때 Loading과 Completion을 어떻게 전달하는가?

#### 필수 후보 근거

- Duration scale보다 먼저 만드는 Motion-purpose inventory
- Menu, Dialog, Filter/result update, Skeleton/progress, List change, Chart shell 및
  Editor panel adjustment의 기본·Reduced-motion 예시
- Renderer timing과 일반 Interface motion의 명시적 분리

#### 후보 탈락 조건

- 제품을 고급스럽게 보이게 한다는 이유만으로 Motion을 추가함
- Reduced motion이 State information을 없애거나 채보 Timing 의미를 바꿈
- 자동 이동 콘텐츠가 읽기나 오락실 사용과 경쟁함
- Focus와 Content가 예측하지 못하게 움직임
- Loading이 Animation에만 의존함

### F7. Data visualization anatomy 및 접근 가능한 대안

#### 질문

1. 어떤 Chart form이 Comparison, Trend, Distribution, Relationship, Pattern
   fingerprint 또는 Geographic exploration 질문에 가장 잘 답하는가?
2. 어떤 Title, Scope, Unit, Denominator, Scale, Axis, Legend, Direct label, Exact
   value, Count, Time range 및 Source가 필요한가?
3. 어떤 Value가 Hover 없이 보이고 어떤 Value를 점진적으로 공개할 수 있는가?
4. Chart color가 Difficulty, Hand, Rank 및 Status color와 어떻게 공존하는가?
5. 어떤 Structured summary 또는 Table/List가 정확한 근거와 과업 동등성을
   제공하는가?
6. Narrow container, High contrast, Reduced motion 및 Locale expansion이
   의미를 바꾸지 않으면서 Chart composition을 어떻게 바꾸는가?

#### 필수 후보 근거

- Music score trend, Rank distribution, Score band, 승인된 5축 Community radar
  1개 및 Arcade map/list 관계
- Empty, Aggregating, Partial, Error 및 Stale-data state
- Keyboard/Focus order 및 Screen-reader reading sequence
- Pointer-only tooltip 밖의 Exact-value representation

#### 후보 탈락 조건

- 분석 질문이 아니라 외형 때문에 Chart form을 선택함
- 비교 가능한 View 사이에서 Scope, Scale, Order, Unit 또는 Denominator가 바뀜
- 같은 Data를 여러 Chart form으로 장식적으로 중복함
- Hover 또는 Color가 유일한 정확한 근거 경로임
- 특수 Renderer pattern을 승인 범위 밖으로 일반화함

## 대표 Specimen 집합

첫 후보는 완전한 High-fidelity Page suite가 아니라 연결된 Fragment로
시험합니다.

| ID   | 필수 Fragment                                                                                                                       | Foundation Stress                                                                                      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `S1` | 공유 탐색 Search, Mode selector, Preview/Result row, Filter, List/Grid switch, Empty/Loading/Error                                  | 다국어 Input, Compact target, Dense card, Title/Artist length, Difficulty role, Progressive disclosure |
| `S2` | Music Detail identity와 선택된 Chart, Best score, Judgement summary, Trend 및 Recent play                                           | Page hierarchy, Metric typography, Tab/Selector, Chart anatomy, Rank/Status color, Empty/Partial data  |
| `S3` | Global Rankings selector, Current-user summary, Dense ranking row 및 Pagination                                                     | 반복 비교, Flag, Metric alignment, Selection, High density, Narrow/Wide composition                    |
| `S4` | Focused Chart Viewer identity, View switch, Renderer frame boundary, Transport/Settings, Error fallback 및 Full-sheet column region | Specialized shell, Dark layering, Small control, Exact time, Hand cue, Motion, 제한된 2D exception     |
| `S5` | Compact Home search/destination과 NosLog Notice 1개 및 보조 Official-news block                                                     | Editorial rhythm, Content-led identity, 동일 Card 비중 없는 계층, Third-party fallback                 |
| `S6` | 크기 조절 가능한 Tool region과 Structured property path가 있는 사용자용 Chart contribution/editor shell fragment                    | Dense professional-tool geometry, Icon label, Focus, Splitter, Wide use, Compact recovery              |

`S1`–`S5`는 문서 `22`의 최소 진입 집합입니다. 승인된 미래 사용자용 Editor가
일반 Content page로 검증할 수 없는 Foundation 요구를 드러내므로 `S6`를
제안합니다. 이는 이 단계에서 Editor 재설계나 Final screen suite를 승인하지
않습니다.

## 대표 콘텐츠 Suite

### 언어와 문자열

- 한국어 Interface label, Notice, Error, Date 및 긴 설명 Copy
- 일본어 원문 악곡 제목, Kana reading, Punctuation, Bracket, Middle dot, Latin
  혼합 및 긴 Artist credit
- 영어 Translation, Long label, Account/Privacy copy 및 혼합 Proper noun
- Translation 없음, Reading 없음 및 Fallback-language 동작
- 필요한 곳의 Unbroken identifier, Number, Path, URL 및 Technical term

### 악곡 및 Metric fixture

- 현재 Catalog의 짧고 매우 긴 Title·Artist name
- Jacket 있음, Jacket 없음 및 Edge color가 밝거나 어두운 Artwork
- Normal/Hard/Expert/Real, Basic/Recital, Left/Right hand, Rank, FC, Pianist,
  Score band, BPM/Time signature, Measure 및 Exact time
- Empty/Unplayed부터 Dense comparison까지의 Score, Signed delta, Percentage,
  Count, Date 및 Loading placeholder

### State fixture

- Default, 적용 가능한 Hover, Focus-visible, Pressed, Selected, Disabled,
  Unavailable, Loading, Empty, Partial, Stale, Success, Warning, Error, Permission,
  Offline, Destructive confirmation 및 Recovery
- Signed-out, Linked data 없는 Signed-in, Sparse data가 있는 Signed-in, Dense
  veteran data 및 Private-field omission

## 반응형 및 접근성 검증 매트릭스

| 차원          | 승인 전 필수 확인                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Compact width | `320 CSS px` Reflow, 대표 `390px`, Content pressure가 구성을 바꾸는 지점에서 측정한 Intermediate width 최소 1개             |
| Wide width    | `1280 × 720`, `1440 × 900` 및 Viewport 가정만이 아닌 Content-container 확인                                                 |
| Zoom과 Text   | 적용 가능한 경우 Browser zoom `400%`, Text enlargement `200%`, WCAG text-spacing override 및 잘리는 Fixed-height text 없음  |
| Input         | Touch, Mouse, Trackpad, Keyboard-only, Visible focus 및 Primary information/action의 Pointer-hover 의존 없음                |
| Appearance    | System, Dark, Light, 지원되는 High-contrast/Forced-colors, Jacket/Art 극단값 및 Color-only meaning 없음                     |
| Motion        | 기본·Reduced-motion 동작, Animation 없이도 Loading과 State change를 이해 가능                                               |
| Language      | 한국어, 일본어, 영어, Language-of-parts, Locale-aware number/date, Script-aware wrapping·punctuation                        |
| State         | Long, Dense, Empty, Loading, Error, Disabled, Permission, Destructive, Recovery 및 적용 가능한 Third-party·Renderer failure |
| Semantics     | Reading·Focus order, Landmark, Name, Role, Value, Status announcement 및 Structured chart evidence                          |

정확한 Intermediate transition width는 Tailwind, Device list 또는 현재 Code에서
복사하는 입력값이 아니라 Specimen 측정의 결과입니다.

## 후보 평가 Rubric

점수만으로 후보를 승인할 수 없습니다. 점수는 근거를 정리하고 Tradeoff를
드러내며 최종 결정은 사용자가 합니다.

| 기준                                 | 가중치 | 필요한 근거                                                                         |
| ------------------------------------ | -----: | ----------------------------------------------------------------------------------- |
| 과업 및 계층 명료성                  |     20 | 모든 Fragment에서 Primary task와 Selected context를 즉시 식별할 수 있음             |
| 다국어 가독성과 Metric 정밀도        |     15 | 실제 KO/JA/EN·Number specimen, Wrap/Truncation 기록, Fallback 동작                  |
| 접근성 및 State 견고성               |     20 | Contrast, Target, Focus, Reflow, Text spacing, Reduced motion, Semantic·비색상 확인 |
| 반응형 재구성과 Density              |     15 | `320`, `390`, 측정 Transition, `1280`, `1440`, Container 근거                       |
| Page family 간 일관성                |     10 | 공유 Role이 Discovery, Detail, Rankings, Home, Viewer 및 Editor fragment에서 작동   |
| Domain 충실도와 Visualization 정확성 |     10 | NOSTALGIA 의미론, 정확한 Comparison frame, Hand/Difficulty/Data collision 기록      |
| Performance 및 구현 가능성           |      5 | Font payload, Token mapping, Browser support, Renderer/Chart 제약                   |
| Content-led NosLog 정체성            |      5 | Reference surface를 복사하지 않는 고유하지만 절제된 구성                            |

WCAG 2.2 AA Target 제약, 필수 과업 완료, NOSTALGIA 의미, Localization,
Structured exact evidence 또는 승인된 Specialized-contract boundary 실패는 숫자
점수와 무관하게 Blocking failure입니다.

## 제안된 Decision batch 및 Approval gate

다음 순서는 결합된 변수를 함께 유지하면서 각 논의를 명시적으로 결정할 만큼
작게 만들기 때문에 제안합니다.

### Gate 0 — 이 조사 프로토콜 승인

Track, Source, Specimen 집합, Content suite, Rubric, Decision batch 및 관리자
범위를 승인하거나 수정합니다. 이 Gate에서는 어떤 후보 값도 선택하지 않습니다.

### Batch A — Semantic role 및 Incumbent baseline

- Typography, Spacing, Color, Surface, Icon, Motion 및 Visualization anatomy의
  공유 Semantic role inventory를 승인합니다.
- Pretendard가 최종 글꼴로 가정되지 않는 Incumbent candidate로 남을지
  결정합니다.
- 후보 비교에 사용할 Test fixture와 Current-code mapping을 승인합니다.

### Batch B — 구조 후보

- Typography, Metric typography, Spacing, Grid, Container, Density 및 Target
  geometry를 함께 비교합니다.
- 먼저 `S1`, `S2`, `S3`에 후보를 적용합니다.
- 승격 전에 사용자가 구조 방향을 선택, 수정 또는 거부합니다.

### Batch C — Appearance 및 Material 후보

- System, Dark, Light에서 Neutral layer, Semantic color ownership, Collision
  policy, Border, Radius, Elevation 및 Focus/Interaction state를 비교합니다.
- 분리된 Swatch가 아니라 승인된 구조 구성에 적용합니다.
- 사용자가 Appearance 방향을 선택, 수정 또는 거부합니다.

### Batch D — Icon, Motion 및 Visualization 후보

- Icon grammar·Label policy, Semantic motion·Reduced motion 및 Chart anatomy/Data
  color를 비교합니다.
- `S4`, `S5`, 제안된 `S6`을 검증한 뒤 `S1`–`S3`의 Drift를 다시 확인합니다.
- 사용자가 각 Sub-part를 선택, 수정 또는 거부하며 묶음 승인을 추론하지 않습니다.

### Gate 4 — 통합 Foundation v0.1 검증

- 전체 Responsive, Language, State 및 Accessibility matrix를 다시 실행합니다.
- 거부한 대안과 알려진 한계를 기록합니다.
- 그 후에만 승인된 Token, Specimen, Mapping 및 Guidance를 Foundation v0.1로
  승격하고 필요한 Figma Guide artifact를 준비합니다.

## Gate 0 이후 제안된 편집 가능 산출물

빈 Placeholder를 만들지 않습니다. 해당 Decision batch가 시작될 때 각
Artifact를 추가합니다.

1. `25-foundation-semantic-role-map.md` 및 `.ko.md`
2. `26-foundation-typography-layout-candidates.md` 및 `.ko.md`
3. `27-foundation-color-material-candidates.md` 및 `.ko.md`
4. `28-foundation-icon-motion-visualization-candidates.md` 및 `.ko.md`
5. 통합 승인 후 `29-foundation-v0.1-specification.md` 및 `.ko.md`
6. 작성된 후보 값과 비교 필요가 시각 검증을 정당화할 때만 Figma Variable 및
   주석 Guide specimen
7. 편집 가능한 Milestone이 안정되고 사용자가 언어 Packaging을 결정한 후에만
   Versioned PDF

번호는 제안된 작업 순서이며 승인된 작업에 다른 Grouping이 더 적합하면 바꿀 수
있습니다.

## 집중 레퍼런스 매트릭스

초기 브리프 검토는 15개가 넘는 독립 조직 또는 표준 Community를 포괄합니다.
한 시스템의 여러 페이지는 독립 투표를 늘리지 않고 하나의 출처를 깊게
다룹니다.

| 출처                                                                                                                                                                                                                                                            | 역할 | 전이 가능한 기여                                                                                                                      | NosLog에서의 한계                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                                                                                                       | `A`  | Contrast, Reflow, Resize, Text spacing, Focus, Target size, Keyboard, Dragging, Motion, Status 및 Semantics가 모든 후보를 제약합니다. | 시각 정체성이나 Token 값을 고르지 않습니다.                                                |
| [W3C 한글 조판 요구사항](https://www.w3.org/International/klreq/) 및 [일본어 조판 요구사항](https://www.w3.org/TR/jlreq/)                                                                                                                                       | `A`  | 문자 체계별 Wrapping, Punctuation, Mixed-script 및 Line composition 요구                                                              | 인쇄·세로쓰기 지침은 가로형 Web UI에 관련 있는 부분만 전이합니다.                          |
| [DTCG Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)                                                                                                                                                      | `B`  | Platform-independent Name, Type, Description, Alias, Group 및 미래 Figma/Code 교환                                                    | Community Group 보고서는 Format을 정의하며 NosLog 의미나 값을 정하지 않습니다.             |
| [Atlassian Foundations](https://atlassian.design/foundations), [Token](https://atlassian.design/foundations/tokens/design-tokens), [Elevation](https://atlassian.design/foundations/elevation/)                                                                 | `B`  | Semantic token name, 조율된 Type/Spacing/Color, 절제된 Elevation 및 Dark surface shift                                                | Enterprise density와 정확한 값은 전이할 수 없습니다.                                       |
| [Fluent 2 Design Tokens](https://fluent2.microsoft.design/design-tokens)                                                                                                                                                                                        | `B`  | Global-to-alias layer, Theme-aware semantic role 및 조율된 Type, Radius, Stroke, Animation                                            | Microsoft Brand·Platform 기본값은 NosLog 방향이 아닙니다.                                  |
| [Material 3 Canonical layout](https://m3.material.io/foundations/layout/canonical-examples/overview)                                                                                                                                                            | `B`  | Layout이 Phone canvas 하나를 확대하지 않고 사용 가능 공간과 Task pattern에 맞게 적응합니다.                                           | Android 중심 Canonical form은 출발점이지 NosLog Template이 아닙니다.                       |
| [Carbon Color](https://carbondesignsystem.com/elements/color/overview/) 및 [Chart anatomy](https://carbondesignsystem.com/data-visualization/chart-anatomy/)                                                                                                    | `B`  | Dark/Light color role, Interaction state, 정확한 Chart anatomy, Direct label, Axis, Legend 및 접근 가능한 Detail                      | IBM Surface·Chart styling을 복사할 수 없으며 일부 Chart 지침은 작업 중입니다.              |
| [USWDS Design Tokens](https://designsystem.digital.gov/design-tokens/), [Font token](https://designsystem.digital.gov/design-tokens/typesetting/font/), [Layout grid](https://designsystem.digital.gov/utilities/layout-grid/)                                  | `B`  | 제한된 Token palette, Font normalization, 읽기 좋은 Measure, User font-size 존중 및 설정 가능한 Container                             | 정부 콘텐츠 기본값과 정확한 Scale은 NosLog 값이 아닙니다.                                  |
| [Primer Primitives](https://github.com/primer/primitives) 및 [Typography](https://primer.style/product/getting-started/foundations/typography/)                                                                                                                 | `B`  | 고밀도 Web product에서 Light/Dark/High-contrast variant, Spacing, Typography, Viewport 및 Motion용 Functional token                   | GitHub Workflow와 정체성은 음악·Rhythm game archive와 다릅니다.                            |
| [Shopify Polaris Typography Tokens](https://polaris-react.shopify.com/design/typography/typography-tokens)                                                                                                                                                      | `B`  | Primitive font scale을 Semantic text token과 재사용 Variant로 합성                                                                    | Commerce administration 필요는 NosLog Content hierarchy를 정하지 않습니다.                 |
| [Adobe Spectrum](https://spectrum.adobe.com/) 및 [Spectrum 2](https://s2.spectrum.adobe.com/)                                                                                                                                                                   | `B`  | Casual·Professional tool을 모두 위한 Contextual·Cohesive foundation, Accessibility, Icon, Scale 및 Cross-platform flexibility         | Adobe Expressive language와 Proprietary product 필요는 시각 목표가 아닙니다.               |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography) 및 [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)                                                                    | `B`  | 계층으로서 Type style, Scalable text, 읽을 수 있는 Custom type, Redundant cue, Control comfort 및 Reduced motion                      | Native Apple Point size와 Platform material은 Web token을 정하지 않습니다.                 |
| [Tailwind 반응형 디자인과 Container query](https://tailwindcss.com/docs/responsive-design)                                                                                                                                                                      | `B`  | Mobile-first 구현, 설정 가능한 Breakpoint 및 Parent space에 의한 Component adaptation이 현재 Stack과 맞습니다.                        | 기본 Breakpoint·Container size는 구현 편의이지 근거 기반 NosLog 값이 아닙니다.             |
| [MDN `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) 및 [Font metric override](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/ascent-override) | `B`  | Motion preference와 Fallback metric control을 위한 구체적 Web mechanism                                                               | Browser support를 확인해야 하며 Mechanism은 제품 의미를 정하지 않습니다.                   |
| [web.dev Font best practices](https://web.dev/articles/font-best-practices)                                                                                                                                                                                     | `B`  | Font loading, Fallback, Variable font, Payload 및 Layout-shift 근거                                                                   | Performance 지침은 미감이나 문자 품질을 고르지 않습니다.                                   |
| [Pretendard 공식 문서](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md)                                                                                                                                               | `B`  | 현행 한국어/Latin/일본어 인식 Variable-font 기능, License, Family variant 및 추천 Fallback stack                                      | Project claim은 NosLog 실제 일본어·혼합 문자로 시험해야 하며 Incumbency는 승인이 아닙니다. |
| [Figma UI 디자인 원칙](https://www.figma.com/resource-library/ui-design-principles/)                                                                                                                                                                            | `B`  | Hierarchy, Contrast, Consistency, Proximity, Alignment 및 Progressive disclosure가 Specimen 검토 언어를 제공합니다.                   | Token specification이나 Domain authority가 아닙니다.                                       |
| [GOV.UK Typography](https://design-system.service.gov.uk/styles/typography/)                                                                                                                                                                                    | `B`  | Content-first 가독 계층, 절제된 Style 및 접근 가능한 Web default                                                                      | Public-service reading task는 고밀도 Score analysis와 다릅니다.                            |
| [Singapore Government Design System Responsive grid](https://www.designsystem.tech.gov.sg/foundations/layout/responsive-grid)                                                                                                                                   | `B`  | Compact·Wide layout에서 의도적인 Column, Margin 및 Gutter 변화                                                                        | 정확한 4/8/12 Grid와 Container 값은 NosLog 값이 아닙니다.                                  |
| [NICE Design System Layout](https://design-system.nice.org.uk/foundations/layout/)                                                                                                                                                                              | `B`  | Mobile-first Fluid span과 전체 폭의 균일한 확대 대신 Bounded content 사용                                                             | Health-information measure와 Tone은 Rhythm-game product template이 아닙니다.               |
| [Dell Design System Grid](https://www.delldesignsystem.com/foundations/grid)                                                                                                                                                                                    | `B`  | Responsive margin, Body width 및 Column이 사용 가능한 공간에 따라 바뀝니다.                                                           | Hardware-commerce content와 정확한 Breakpoint는 NosLog Layout을 정하지 않습니다.           |
| [Spotify: Reimagining Design Systems](https://spotify.design/article/reimagining-design-systems-at-spotify)                                                                                                                                                     | `C`  | 대형 음악 제품이 Contextual expression·Contribution을 허용하면서 Foundation을 공유할 수 있습니다.                                     | Spotify 규모, Team 및 Listening behavior는 집중형 Community archive와 다릅니다.            |
| [Lucide](https://lucide.dev/guide/)                                                                                                                                                                                                                             | `B`  | 현재 Open-source icon base는 일관된 Stroke system, Tree-shakable implementation 및 Accessible labelling 책임을 제공합니다.            | Generic set은 NOSTALGIA Domain graphic을 대체하거나 모든 Metaphor를 증명할 수 없습니다.    |

### 초기 수렴점

Reference 집합은 값 이름보다 Semantic token, 제한되고 목적 있는 Scale, 실제
Content validation, 조율된 Foundation, Responsive container, 접근 가능한
Appearance mode, 절제된 Elevation, 명시적 Icon/Motion role 및 구조화된 정확한
Visualization 근거에 수렴합니다. 정확한 Type size, Spacing base, Grid, Radius,
Color expression 및 Motion character에는 의견이 다릅니다. 이 차이는 유용한
후보 차원이며 아직 열려 있습니다.

검토는 조사 프로토콜을 제안하기에 충분한 폭에 도달했습니다. 통합 후보
Specimen을 아직 제작·비교하지 않았으므로 값 선택의 포화에는 도달하지
않았습니다.

## 제안된 결정 기록

| ID       | 항목                                                                                                                              | 상태       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `FBR-01` | 시각 값을 선택하지 않으면서 이 문서로 Foundation v0.1 조사를 관리합니다.                                                          | `Proposed` |
| `FBR-02` | 실제 콘텐츠와 연결된 Specimen으로 결합된 7개 Track을 평가합니다.                                                                  | `Proposed` |
| `FBR-03` | Pretendard를 자동 최종 글꼴이 아니라 Incumbent candidate로 취급합니다.                                                            | `Proposed` |
| `FBR-04` | 광범위한 관리자 화면을 2.0 Foundation specimen 범위 밖에 두되 공유 Primitive와 승인된 미래 사용자용 Editor fragment를 시험합니다. | `Proposed` |
| `FBR-05` | `S1`–`S5`를 최소 Specimen 집합으로 사용하고 Professional editor 제약을 위해 `S6`을 추가합니다.                                    | `Proposed` |
| `FBR-06` | 프로토콜, 구조, Appearance/Material, Icon/Motion/Visualization 및 통합 검증의 명시적 Gate로 후보를 검토합니다.                    | `Proposed` |
| `FBR-07` | 작성된 후보 값과 비교 필요가 정당화할 때만 Figma Guide artifact를 만들고 이번 세션에서 Final production screen을 만들지 않습니다. | `Proposed` |

## 후보 작업 전 필요한 사용자 결정

1. 7개 조사 Track, Specimen 집합, Content suite, Validation matrix 및 Candidate
   rubric을 승인하거나 수정합니다.
2. Pretendard가 최종 선택을 전제하지 않는 Incumbent candidate로 남아야 하는지
   결정합니다.
3. 관리자 관리 화면은 제외하면서 제안된 `S6` 사용자용 Editor fragment를
   Foundation v0.1 검증에 포함할지 결정합니다.
4. 제안된 Decision-batch 순서와 Editable-artifact 계획을 승인하거나
   수정합니다.

이 네 항목을 해결하기 전에는 Foundation 후보 값을 작성하지 않습니다.

## 단계 체크리스트

- [x] Root 프로젝트 지침과 저장소 기준선을 다시 읽었습니다.
- [x] 현재 Token, Font loading, Layout shell, Component variation, Chart stack 및
      Motion 사용을 검사했습니다.
- [x] 현재 로컬 Home, Music discovery, Rankings 및 Music Detail을 대표
      Compact/Wide viewport에서 확인했습니다.
- [x] 독립적이고 공식 또는 유지 관리되는 근거 출처 15개 이상을 비교했습니다.
- [x] 영어 원본과 한국어 Companion을 함께 작성했습니다.
- [ ] 사용자가 조사 프로토콜을 승인하거나 수정합니다.
- [ ] 승인 후에만 Semantic-role 및 Candidate 작업을 시작합니다.
