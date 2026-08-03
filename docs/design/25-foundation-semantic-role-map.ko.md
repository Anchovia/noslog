# NosLog 2.0 Foundation Semantic Role Map

## 문서 관리

- 상태: `승인된 Semantic-role 구조 — 물리 값 미확정`
- 승인일: 2026-08-03
- 원본 언어: 영어
- 영어 원본:
  [25-foundation-semantic-role-map.md](./25-foundation-semantic-role-map.md)
- 범위: NosLog 2.0 Foundation v0.1의 공유 Typography 역할 구조, 역할 사용법,
  Alias, Metric 동작, 다국어 제약, 예외 관리, 현재 Code 이관 Map 및 Batch B
  진입 기준
- 입력: 승인된 문서 `01`–`24`, 현재 저장소 Typography utility, 문서 `24`에
  기록된 현재 Browser 근거, 아래 Reference 비교 및 2026-08-03의 명시적 사용자
  승인
- 제외: 최종 글꼴 Family, 글꼴 크기, 행간, 굵기, 자간, 반응형 Type 동작,
  Color, Spacing, Grid, Component 치수, 최종 Figma style, Production screen 및
  Application 구현

이 문서는 각 공유 Typography 역할의 의미와 관리 방식을 승인합니다. 어떤
역할의 물리적 외형도 승인하지 않습니다. 여기에 역할 이름이 있다는 이유로
임의 크기를 선택하거나 현재 구현 값을 재사용해서는 안 됩니다.

## 관련 문서

- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Cross-cutting Reference Matrix](./22-cross-cutting-reference-matrix.ko.md)
- [Design-guide 일관성 감사](./21-design-guide-consistency-audit.ko.md)
- [공유 Discovery 페이지 브리프](./04-shared-discovery-page-brief.ko.md)
- [Music Detail 페이지 브리프](./05-music-detail-page-brief.ko.md)
- [Chart Viewer 페이지 브리프](./07-chart-viewer-page-brief.ko.md)
- [Global Rankings 페이지 브리프](./08-global-rankings-page-brief.ko.md)
- [Profile 페이지 브리프](./09-profile-page-brief.ko.md)
- [공유 Shell 및 Navigation 브리프](./15-shared-shell-navigation-brief.ko.md)
- [Chart Editor 및 기여 페이지 브리프](./20-chart-editor-contribution-page-brief.ko.md)

## 목적

현재 NosLog는 Semantic utility와 수많은 Local size 결정을 함께 사용합니다.
2.0 Foundation은 음악 정체성, 다국어 제목, 고밀도 기록, 정확한 Metric, System
control, Viewer 및 미래 사용자용 Editor를 지원하면서도 같은 분산이 다시
생기지 않게 해야 합니다.

따라서 승인된 모델은 네 가지 관심사를 분리합니다.

1. **Primitive**는 미래의 물리적 글꼴 값을 보관합니다.
2. **Composite style**은 Primitive를 제한된 수의 시험된 물리 Treatment로
   결합합니다.
3. **Semantic role**은 텍스트가 존재하는 이유를 설명하며 필수 Authoring
   API가 됩니다.
4. **Component alias**는 새 물리 값을 만들지 않고 기존 Semantic role에
   Domain 또는 Component 이름을 부여합니다.

이 문서에서는 Semantic role과 Alias 관리 모델만 승인합니다. Primitive와
Composite 값은 Batch B 결정으로 남습니다.

## 조사 수렴점

비교는 독립된 Standard, 유지 관리되는 System, Production product 및 Domain
reference 15개 이상을 포함했습니다. 출처들은 정확한 크기, Family, Scale 및
Platform density에는 동의하지 않습니다. 다음 전이 가능한 원칙에는
수렴합니다.

- 원시 숫자 크기가 아니라 목적에 따라 텍스트 이름을 짓고 적용합니다.
- Semantic role이 구체적이어도 물리 Scale은 절제합니다.
- Page 전체에서 공유 역할을 사용하고 관리되는 Alias로만 특수화합니다.
- Display treatment는 드문 고강도 순간에만 사용합니다.
- Metric 강조를 Heading 및 Body copy와 구분합니다.
- 작은 텍스트는 제한적으로 사용하며 일반 Control 또는 읽기 기본값으로
  삼지 않습니다.
- 시각 Styling과 별개로 Semantic heading 구조를 보존합니다.
- 알파벳 Sample이 아니라 실제 Content, Language, Width, Zoom 및 Spacing을
  시험합니다.
- 시각 검증 후 상대적이고 확장 가능한 구현 값을 사용합니다.
- 한국어·일본어·영어마다 별도의 정보 계층을 만들지 않고 Reflow를
  허용합니다.

NosLog에는 일반 System이 정의하지 않는 Domain 제약이 추가됩니다. 원문 Music
제목은 Primary identity로 유지되고, 활성화된 번역 제목 또는 일본어 읽기는
그 위에 더 낮은 시각적 중요도로 나타납니다. Performance 값은 안정적으로
숫자를 비교할 수 있어야 하며 BPM, 시간, 마디, 난이도, 손, Grd 및 Rating은
정확한 NOSTALGIA 의미를 유지합니다.

## 승인된 구조

### Layer 1 — Primitive 값

미래 Primitive에는 글꼴 Family, 굵기, Size step, Line-height step, Tracking 및
OpenType 기능이 포함될 수 있습니다. 이름과 값은 이 문서에서 승인하지
않습니다. Product 작성자와 Downstream designer는 Page content에 Primitive를
직접 적용하면 안 됩니다.

### Layer 2 — Composite 물리 Style

미래 Composite style은 Primitive 값을 시험된 Treatment로 결합합니다. 여러
Semantic role이 의도적으로 같은 Composite style을 가리킬 수 있습니다.
따라서 Semantic role이 12개라고 해서 서로 다른 글꼴 크기 12개가 필요한 것은
아닙니다.

Composite style은 Batch B specimen이 실제 NosLog content에서 동작함을
입증한 뒤에만 승인합니다. 그 전까지 현재 App 또는 외부 Design system에
보이는 어떤 크기·굵기·행간도 권위 있는 값이 아닙니다.

### Layer 3 — 공유 Semantic role

다음 12개 역할을 공유 Role inventory로 승인합니다.

| 역할               | 의미                                                                         | 대표 NosLog 사용                                                                         | 필수 제약                                                                                          |
| ------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `display`          | 의도적인 고강도 순간 하나를 만드는 드문 표현형 텍스트                        | 이후 Specimen이 정당화하는 제한된 Home identity 또는 예외적인 Editorial lead             | 기본 Page heading, Card title, Metric 또는 Empty state treatment로 사용하지 않음                   |
| `page-title`       | 현재 Page 또는 집중 Task를 식별하는 Primary heading                          | Music, Rankings, Tier list, Profile, Viewer, Settings                                    | 하나의 명확한 Page-level identity를 제공하고 시각 Style이 올바른 Heading semantics를 대체하지 않음 |
| `section-title`    | Page 안의 주요 영역 Heading                                                  | Recent plays, Community evaluation, Performance history                                  | 임의 Card 장식이 아니라 실제 Content boundary를 표현함                                             |
| `component-title`  | 제한된 Component 또는 일시 Layer 내부 Heading                                | Dialog, Drawer, Panel, 묶인 Result module                                                | Page와 상위 Section보다 하위 계층을 유지함                                                         |
| `entity-title`     | Domain object의 Primary identity                                             | 원문 Music title, Username, Arcade name, Exam name                                       | Canonical object identity를 보존하고 실제 긴 Content를 지원함                                      |
| `entity-companion` | Entity title과 짝을 이루는 선택적 Supporting identity                        | 승인된 한국어·영어 Music title 또는 일본어 읽기                                          | 원문 위에 올 수 있지만 시각적으로 하위이며 원문을 대체하지 않음                                    |
| `body`             | 기본 읽기 Content와 일반 System message                                      | 설명, 안내, 공지 본문, Empty/Error message                                               | 여러 줄 읽기와 Text resizing에서 편안함을 유지함                                                   |
| `body-secondary`   | 보조 설명 또는 Secondary identity                                            | Artist, 간결한 보조 설명, Contextual note                                                | 낮은 중요도 때문에 Task-critical meaning의 유일한 위치가 되면 안 됨                                |
| `control`          | Interaction을 이름 짓거나 그 안에 포함되는 Visible text                      | Button, Tab, Filter, Menu item, Input value 또는 Label                                   | Control 및 Icon과 정렬되고 읽을 수 있으며 Localization 가능해야 함                                 |
| `metadata`         | 간결한 Secondary fact 또는 짧은 Status descriptor                            | Date, Category, Level context, Timestamp, Badge text, Chart axis 또는 Measure annotation | Body copy나 일반 Control을 대신하지 않으며 작은 Treatment는 예외적으로 유지함                      |
| `metric-display`   | 한 지역에서 우세한 Quantitative result 하나                                  | Best score, Official Grd, NosLog Rating, 기타 승인된 Summary metric                      | Page heading처럼 가장하지 않으면서 값을 강조하고 Label과 Unit을 잃지 않음                          |
| `metric-value`     | Row, Group, Control 또는 Visualization 안에서 비교 가능한 Quantitative value | Rank value, Score row, BPM, Time, Measure, Play count, Judgement value                   | 안정적인 숫자 정렬을 사용하고 명시적 Context, Unit 및 Scope를 보존함                               |

### Layer 4 — Component alias

Alias는 Mapping 명확성을 높이지만 독립 Style을 만들지 않습니다. 다음 초기
Alias를 승인합니다.

| Alias 또는 Content                                    | Mapping                          | 비고                                                                                  |
| ----------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| Header wordmark                                       | 제한된 Brand-component alias     | Brand-specific treatment를 가질 수 있지만 일반 Type-scale step을 만들지 않음          |
| Artist                                                | `body-secondary`                 | 새 Type role이 아니라 Composition으로 짝지은 Title group과 분리함                     |
| Button, Tab, Filter, Menu, Field label, Field value   | `control`                        | Component variant는 Layout 또는 State를 바꿀 수 있으나 Local typography를 만들지 않음 |
| Badge 및 짧은 Status                                  | `metadata` 또는 `control`        | Interactive badge는 `control`, Descriptive badge는 `metadata` 사용                    |
| Metric label 및 Unit                                  | `metadata` 또는 `body-secondary` | 값은 Metric role을 사용하고 Context는 읽을 수 있고 명시적으로 유지함                  |
| Chart axis, Tick, Legend label, Measure number        | `metadata`                       | Hover에만 의존하지 않고 정확한 값을 사용할 수 있어야 함                               |
| Viewer time, BPM, Time signature, Measure value       | `metric-value`                   | Renderer 배치가 특수해도 숫자 Treatment는 공유함                                      |
| Empty, Loading, Error, Permission 및 Recovery message | `body` 또는 `body-secondary`     | State 의미는 독립 Font size가 아니라 Content와 Semantic state에서 옴                  |
| Code, JSON 또는 Technical identifier                  | 제한된 Technical alias           | Monospace는 일반 Metric이 아니라 실제 Technical text에만 평가 가능함                  |

## Product family별 역할 적용

### 공유 Shell 및 Home

- NosLog wordmark는 제한된 Brand alias를 사용합니다.
- 각 Page destination과 More-panel action은 `control`을 사용합니다.
- Page 또는 Home identity는 이후 검증된 Specimen이 드문 `display` 순간 하나의
  필요를 입증하지 않는 한 `page-title`을 사용합니다.
- Announcement title은 실제 Container에 맞는 Title role을 사용합니다. Date는
  `metadata`, Announcement body는 `body`를 사용합니다.
- Empty, Maintenance 및 Recovery message는 주의를 끌기 위해 Display
  typography가 되지 않습니다.

### Music discovery 및 Music Detail

- 활성화된 번역 제목 또는 일본어 읽기: `entity-companion`.
- 원문 Music title: `entity-title`.
- Artist: `body-secondary`.
- Category, Difficulty context, Level, Release data 및 Date: `metadata`. 단,
  Interactive selector는 `control`을 사용합니다.
- Best score 또는 그 지역의 다른 지배적 Result: `metric-display`.
- Score row, Judgement value, Percentage, Rank, Combo 및 Play count:
  읽을 수 있는 Context label과 함께 `metric-value`.
- 기존 Page brief의 Line count, Wrapping, Hover, Mobile disclosure 및
  Accessibility 규칙이 계속 권위 있습니다. 이 Map은 해당 결정을 다시 열지
  않습니다.

### Rankings, Tier list 및 Profile

- Username, Tier target 및 기타 Canonical object name은 `entity-title`을
  사용합니다.
- Country, Exam, Mode, Difficulty, Achievement 및 Status fact는 Interactive
  control이 아닌 경우 일반적으로 `metadata`를 사용합니다.
- Official Grd, NosLog Rating, Score, Rank, Distribution band 및 Play count는
  적합한 Metric role을 사용합니다.
- Metric value는 Label, Mode, Population, Unit 또는 Scope와 계속 짝지어야
  합니다. 크기만으로 Official Grd와 NosLog Rating을 구분하면 안 됩니다.
- 고밀도 Row에서 Spacing, Position, Weight 및 Label이 승인된 계층을
  보존한다면 여러 Semantic role이 같은 Physical composite style을 공유할 수
  있습니다.

### Chart Viewer 및 Chart Editor

- 집중된 Music identity는 `entity-companion` → `entity-title` 계층을
  유지합니다.
- Transport, Mode, Metronome, Strict-performance, Tool, Property 및 Submission
  label은 `control`을 사용합니다.
- Time, BPM, Time signature, Measure number, Lane value, Offset, Width 및 숫자형
  Property value는 `metric-value` 또는 그와 짝지은 `metadata` label을
  사용합니다.
- Canvas/WebGL geometry는 Renderer-specific placement를 요구할 수 있지만
  별도 Page-wide scale을 허가하지 않습니다.
- Canvas 또는 WebGL text가 공유 Token을 직접 사용할 수 없다면 Renderer
  alias가 어떤 공유 Role을 나타내는지 문서화하고 실제 Render size와 Display
  area에서 검증해야 합니다.

## 다국어 계약

한국어·일본어·영어는 같은 12개 Semantic role과 같은 Content priority를
사용합니다. Locale은 Font fallback, Glyph metric, Line height, Wrapping,
Punctuation 및 차지하는 공간에 영향을 줄 수 있지만 별도 Semantic hierarchy를
만들지는 않습니다.

필수 동작:

- Content 언어가 Page와 다르면 올바른 Language를 Markup합니다.
- 모든 Locale에서 원문 Music title을 `entity-title`로 보존합니다.
- 활성화 시 Localized title 또는 일본어 읽기를 원문 위에
  `entity-companion`으로 배치하되 미래의 검증된 Composite system에서 더
  작거나 다른 방식으로 낮은 중요도를 유지합니다.
- 실제 Record로 Hangul, Kana, Kanji, Latin, Numeral, Punctuation, Symbol 및 긴
  Classical title 혼합을 시험합니다.
- 고정 Card height를 유지하려고 필수 Content를 Clipping하지 않고 Role
  container가 늘어나거나 Recompose되도록 합니다.
- 한국어·일본어 계층의 유일한 구분으로 Italic 또는 All caps에 의존하지
  않습니다.
- Text resizing과 Spacing adjustment에서 Semantic order와 유용한 Content를
  보존합니다.
- Font swap이 승인된 계층 또는 Control을 깨지 않도록 Fallback metric과 느린
  Font loading을 평가합니다.

## Metric 및 숫자 계약

`metric-display`와 `metric-value`는 Semantic metric role이며 장식적인 Display
face 사용 허가가 아닙니다.

승인된 동작:

- Digit width 변화가 비교 또는 Layout을 방해하는 곳에서 Tabular figures를
  사용합니다.
- 의미 있는 Precision을 없애는 축약 대신 현재 Domain value를 유지합니다.
- 승인된 Content contract에 따라 Separator, Decimal, Percentage, Sign, Unit,
  Rank symbol, Time punctuation, BPM 및 Time signature를 보존합니다.
- Local comparison region 안에서 비교 가능한 값을 일관되게 정렬합니다.
- Label, Unit, Denominator, Mode 또는 Scope를 보이게 하거나 Programmatic하게
  연결합니다.
- 기본적으로 Metric에는 숫자 기능을 갖춘 일반 언어 Typography를 사용합니다.

일반 Score, Rank, Time, BPM, Grd, Rating, Play count 또는 Judgement value에
Monospaced typography를 사용하는 것은 승인하지 않습니다. 고정 Character
width가 의미 있는 실제 Code, JSON, Exported technical data 또는 Identifier에만
제한된 Candidate로 남습니다.

## 필수 사용 및 예외 관리

### 기본 규칙

모든 일반 텍스트 요소는 승인된 Semantic role 중 하나를 사용해야 합니다.
Downstream Figma 작업과 Production 구현은 Mockup에서 더 강조하거나 맞춰야
해 보인다는 이유만으로 Page-specific font size, Weight, Line height, Tracking
또는 Font family를 추가하면 안 됩니다.

다음은 유효한 예외 사유가 아닙니다.

- 제목이 깁니다.
- Viewport가 좁습니다.
- Card 높이가 제한됩니다.
- Designer가 더 많은 변화를 원합니다.
- 외부 Reference가 다른 크기를 사용합니다.
- 일회성 State가 충분히 강조되지 않아 보입니다.
- 기존 임의 값을 유지하는 것이 편리합니다.

이 경우에는 먼저 승인된 Role, Wrapping, Reflow, Composition, Spacing,
Progressive disclosure 또는 Component layout으로 해결해야 합니다.

### Alias와 예외의 차이

**Alias**는 기존 Semantic role에 Component-specific 이름을 부여하고 같은
승인된 Composite style로 해석됩니다. 새 시각 값이 필요하지 않습니다.

**예외**는 승인된 Composite style 밖에서 하나 이상의 물리 값을 바꿉니다.
다음 조건을 모두 충족할 때만 허용됩니다.

1. 정확한 Product 또는 Renderer 필요를 문서화합니다.
2. 모든 기존 Role을 시험하고 해당 필요에 실패함을 확인합니다.
3. 예외를 이름이 있는 Component 또는 Specialized contract로 제한합니다.
4. 적용 가능한 경우 한국어·일본어·영어, `320 CSS px`, 대표 Mobile, Desktop,
   Zoom, Contrast 및 Text-spacing 영향을 시험합니다.
5. Fallback과 Implementation mapping을 문서화합니다.
6. Parallel page hierarchy를 만들지 않습니다.
7. 사용자가 예외와 범위를 명시적으로 승인합니다.

서로 관계없는 여러 Component에서 같은 필요가 반복되면 공유 Role map 수정이
필요하다는 근거입니다. 반복 Local exception으로 복사하면 안 됩니다.

### 처음 인식된 제한 후보

다음 영역은 제한된 Alias 또는 이후 예외 검토를 정당화할 수 있지만 물리적
예외는 아직 승인하지 않았습니다.

- NosLog wordmark;
- 실제 Code, JSON 또는 Technical export text;
- Rasterization 또는 Projection이 검증된 가독성 제약을 만드는 Canvas/WebGL
  renderer label;
- 통합 Specimen에서 검증된 드문 `display` 순간.

## 현재 Code 이관 Map

현재 Utility는 Inventory 근거만 제공합니다. 현재 값은 자동으로 이어지지
않습니다.

| 현재 Utility 또는 Pattern                 | Foundation 목적지                                                    | 이관 규칙                                                        |
| ----------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `text-display`                            | `display`                                                            | 모든 사용처를 다시 평가하고 드문 승인 순간만 유지함              |
| `text-score-display`                      | `metric-display`                                                     | Score-specific 이름을 공유 Metric role로 교체함                  |
| `text-title`                              | `page-title`, `section-title`, `component-title` 또는 `entity-title` | 하나의 모호한 Title style을 유지하지 않고 의미로 분류함          |
| `text-wordmark`                           | Header wordmark alias                                                | Brand component로 제한함                                         |
| `text-section`                            | `section-title` 또는 `component-title`                               | 실제 Document hierarchy에 따라 선택함                            |
| `text-body`                               | `body`                                                               | 물리 값을 다시 검증해야 함                                       |
| `text-body-muted`                         | `body-secondary`                                                     | Muted color는 모든 Supporting text 사용에 내재하지 않음          |
| `text-label` 및 `text-input`              | `control`                                                            | Component anatomy와 State는 달라질 수 있으나 Typography는 공유함 |
| `text-caption`                            | `metadata`                                                           | Content가 실제로 Secondary이고 Compact한지 확인함                |
| `text-badge`                              | `metadata` 또는 `control`                                            | Descriptive 동작과 Interactive 동작에 따라 선택함                |
| `text-micro` 및 직접 `10px` 값            | 기본 후속 Role 없음                                                  | 감사 후 제거하며 유지할 경우 예외 절차가 필요함                  |
| Local `text-xs`, `text-sm` 또는 임의 Size | Semantic role로 분류                                                 | 현재 원시 크기를 미래 Semantic token으로 번역하지 않음           |

## 접근성 및 반응형 요구사항

- 선택한 시각 Role과 관계없이 Semantic heading order와 Accessible name을
  올바르게 유지합니다.
- Browser zoom과 최소 `200%` Text resizing에서 필수 Content 또는 Operation을
  잃지 않습니다.
- `320 CSS px` Reflow target에서 일반 텍스트는 Document-level 2D scrolling을
  요구하지 않습니다. 특수 2D Viewer 또는 Editor content는 승인된 제한 계약을
  따릅니다.
- 사용자 Text-spacing 조정이 Text를 Overlap, Clip 또는 Hide하지 않습니다.
- 작은 Metadata는 승인된 모든 Appearance에서 적용 가능한 Text contrast를
  충족합니다. Disabled-state 예외를 Active supporting text에 재사용하면 안
  됩니다.
- Weight, Color 및 Size를 함께 사용할 수 있지만 필수 구분이 Color 또는 Font
  size에만 의존하면 안 됩니다.
- 긴 Label, Title, Name 및 Translated content는 유용한 유일한 Version을
  Truncation으로 없애기 전에 Wrap하거나 의도적으로 Layout을 Recompose합니다.
- Touch target geometry는 Component foundation이 관리합니다. Type을 줄인다고
  더 작은 Target을 허가하지 않습니다.

## Batch B 진입 및 검증

Role 구조는 물리 Candidate 작업을 시작할 준비가 되었습니다. Batch B는
분리된 Type swatch를 승인하지 않고 Font, Metric typography, Size, Line
height, Weight, Tracking, Spacing, Layout, Container, Density 및 Target
geometry를 함께 비교해야 합니다.

승인된 최소 Specimen은 다음과 같습니다.

| Specimen                      | 필수 Role stress                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `S1` Music discovery          | `entity-companion`, 긴 `entity-title`, Artist, Metadata, Control, 고밀도 Level, Empty 및 Loading state |
| `S2` Music Detail             | Page·Section hierarchy, 지배적·Inline metric, Chart label, 긴 다국어 Identity                          |
| `S3` Global Rankings          | 반복 Identity, Rank·Metric 정렬, Country·Exam metadata, Pagination 및 Selector                         |
| `S4` Chart Viewer             | 집중 Identity, Transport control, BPM·Time·Measure data, Renderer label 및 Full-sheet annotation       |
| `S5` Home                     | 절제된 Page identity, Search control, Destination, Notice, Editorial content, Recovery state           |
| `S6` 사용자용 Editor fragment | 고밀도 Tool label, Property value, Timing data, Panel resizing, Validation 및 Submission state         |

물리 Type 값을 승인하기 전에 실제 한국어·일본어·영어·혼합 문자·긴
Content·고밀도·Empty·Error·Disabled·Permission·Destructive fixture를
`320px`, `390px`, 중간 Width, `1280px`, `1440px` 및 Text resize·Spacing
조건에서 비교해야 합니다.

## Reference Matrix

| 독립 출처                                                                                                                               | 전이 가능한 원칙                                                                                        | NosLog 적용                                                                  | 한계                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                           | Contrast, Resize, Reflow 및 Text-spacing 요구사항이 모든 Role을 제약함                                  | 가독성과 Reflow를 차단 조건으로 사용함                                       | Typeface 또는 계층 값을 선택하지 않음                        |
| [W3C KLReq](https://www.w3.org/TR/klreq/) 및 [JLReq](https://www.w3.org/TR/jlreq/)                                                      | 한국어·일본어 Composition, Punctuation, Mixed-script 및 Line breaking은 Latin 기본값과 다름             | 실제 Hangul, Kana, Kanji, Latin, Numeral 및 Punctuation specimen을 요구함    | Print 및 Vertical-writing 세부는 관련 부분만 전이함          |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                                                                | Heading, Body, Metric 및 Code style이 조정된 Semantic token을 사용함                                    | 별도 Metric role과 절제된 Small body 사용을 지지함                           | Enterprise 값은 NosLog 값이 아님                             |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                                                      | Semantic type ramp가 Platform 간 Scannable hierarchy를 만듦                                             | Platform-aware 시험을 포함한 공유 Role을 지지함                              | 정확한 Ramp와 Segoe identity는 전이하지 않음                 |
| [Carbon Type strategies](https://carbondesignsystem.com/elements/typography/style-strategies/)                                          | Productive·Expressive moment가 Task에 맞고 한 영역 안에서 일관되어야 함                                 | Page-specific scale 없이 드문 Display 사용과 고밀도 Task typography를 지지함 | IBM의 두 Type set은 NosLog template가 아님                   |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)                                               | Semantic markup, rem token, 절제된 계층 및 읽기 쉬운 Alignment가 고밀도 Web product에서 동작함          | Semantic-role authoring과 이후 상대 값을 지지함                              | GitHub content와 Brand는 다름                                |
| [Adobe Spectrum International Design](https://spectrum.adobe.com/page/international-design/)                                            | CJK script는 의미를 유지하면서 다른 Metric과 Emphasis 동작이 필요할 수 있음                             | Latin-only 치환이 아니라 다국어 Composition을 요구함                         | Adobe platform scale은 NosLog 값을 결정하지 않음             |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                                            | Text style이 계층을 전달하고 더 큰 Accessibility size에 적응해야 함                                     | Role 일관성, Reflow 및 작은 Thin text 회피를 지지함                          | Native point size와 System font는 Web token이 아님           |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                                                             | 편안한 Body text, 절제된 Small text, Measure, Line height 및 Tabular numerals가 가독성을 지원함         | Compact metadata 제한과 Metric 정렬을 지지함                                 | Government reading 기본값은 고밀도 Score view와 다름         |
| [GOV.UK Typography](https://design-system.service.gov.uk/styles/typography/)                                                            | 제한된 Content-first hierarchy가 불일치를 줄임                                                          | Local visual invention 대신 필수 공유 Role을 지지함                          | Public-service tone과 Size는 NosLog identity를 정의하지 않음 |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                                                   | 물리 Scale을 제한하고 Primary, Secondary, Title 및 Display 사용을 체계적으로 계획함                     | 많은 Semantic role이 적은 Physical style을 가리키는 구조를 지지함            | 14px Base와 정확한 Scale은 승인되지 않음                     |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                                                         | Page, Object, List, Form, Table, Chart 및 KPI context가 관리된 Style을 공유하고 Small text는 예외임     | Entity, Control, Metadata 및 Metric 구분을 지지함                            | Enterprise control과 Proprietary font는 전이하지 않음        |
| [GitLab Design tokens](https://design.gitlab.com/product-foundations/design-tokens/)                                                    | Semantic token name이 Tool 간 Intent를 Codify함                                                         | Alias와 미래 Figma·Code mapping을 지지함                                     | NosLog Role priority를 정의하지 않음                         |
| [Figma UI design principles](https://www.figma.com/resource-library/ui-design-principles/)                                              | Hierarchy, Contrast, Proximity, Consistency 및 Progressive disclosure가 사용자 우선순위를 반영해야 함   | 경쟁하는 Text를 찾기 위한 Specimen review 언어를 제공함                      | Token specification이 아님                                   |
| [Shopify Polaris Typography tokens](https://polaris-react.shopify.com/design/typography/typography-tokens)                              | Primitive value가 Semantic text token을 구성할 수 있음                                                  | 승인된 Layered architecture를 지지함                                         | Commerce role은 Music 또는 Score hierarchy를 결정하지 않음   |
| [Pretendard](https://github.com/orioncactus/pretendard)                                                                                 | Variable cross-platform family가 한국어, Latin 및 일본어 인식 Variant와 실용적 Web delivery를 지원함    | 실제 Content 비교를 위한 Incumbent candidate로 유지함                        | Project claim과 Incumbency는 최종 Font 승인이 아님           |
| [osu! Beatmap information](https://osu.ppy.sh/wiki/en/Beatmap_information) 및 [Taiko.wiki Song search](https://taiko.wiki/song?lang=en) | Rhythm-game discovery가 Song identity, Difficulty, Metadata 및 비교 가능한 Performance context를 보존함 | Compact domain surface에 Entity 및 Metric role이 필요함을 확인함             | Terminology, Hierarchy 및 Visual styling을 복사할 수 없음    |

## 거부된 대안

| 대안                                                      | 결정       | 이유                                                                   |
| --------------------------------------------------------- | ---------- | ---------------------------------------------------------------------- |
| Page마다 자체 Type scale 제공                             | `Rejected` | 현재 불일치를 재현하고 Page 간 계층을 약화함                           |
| Raw size name을 Page-authoring API로 사용                 | `Rejected` | 작성자가 Content meaning 대신 Appearance를 선택하게 됨                 |
| 12개 Role에 독립 Physical size 12개 생성                  | `Rejected` | Semantic specificity는 Visual-style proliferation을 요구하지 않음      |
| `micro`를 일반 공유 UI role로 유지                        | `Rejected` | 읽기 어려울 정도로 작은 Metadata와 Control을 정상화함                  |
| 모든 Score 및 Timing value에 Monospace 사용               | `Rejected` | Tabular figure가 일반 Domain data를 Code처럼 만들지 않고 정렬을 제공함 |
| 모든 Component label을 새 Typography token으로 승격       | `Rejected` | 관리되는 Alias가 Parallel scale 없이 Mapping 명확성을 제공함           |
| Text가 맞지 않을 때 Local exception 허용                  | `Rejected` | Fit 문제는 먼저 Content와 Responsive composition으로 해결해야 함       |
| 현재 Pretendard 또는 현재 Utility 값을 승인된 것으로 취급 | `Rejected` | Incumbent 근거는 통합 다국어·반응형 Candidate 시험을 통과해야 함       |

## 결정 기록

| ID       | 결정                                                                                                          | 상태       |
| -------- | ------------------------------------------------------------------------------------------------------------- | ---------- |
| `FSR-01` | 이 문서의 공유 Semantic role 12개를 사용함                                                                    | `Approved` |
| `FSR-02` | Batch B 통합 Specimen 검토 전까지 모든 물리 Type 값을 미확정으로 유지함                                       | `Approved` |
| `FSR-03` | 일반 Text에 승인된 Role 사용을 의무화하고 모든 물리 예외를 명시적으로 관리함                                  | `Approved` |
| `FSR-04` | `display`를 드물게 유지하고 기본 Page, Card, Metric 또는 State style로 사용하지 않음                          | `Approved` |
| `FSR-05` | 전역 일반 UI `micro` role을 유지하지 않음                                                                     | `Approved` |
| `FSR-06` | 비교 Metric에 Tabular figures를 사용하고 일반 Domain value에 Monospace를 사용하지 않음                        | `Approved` |
| `FSR-07` | 활성화된 Localized/read title을 원문 Music title 위에 두되 시각적으로 하위로 유지함                           | `Approved` |
| `FSR-08` | Wordmark, Artist, Control, Badge, Chart label 및 Renderer data를 새 공유 Scale이 아닌 관리되는 Alias로 취급함 | `Approved` |
| `FSR-09` | 최종 Font를 선택하지 않고 Pretendard를 Incumbent candidate로 유지함                                           | `Approved` |

## 완료 체크리스트

- [x] 문서 `24`에 Gate 0 승인을 기록했습니다.
- [x] 독립된 근거 출처 15개 이상을 비교했습니다.
- [x] 공유 Semantic role 12개를 승인했습니다.
- [x] Alias와 물리 예외 관리 방식을 승인했습니다.
- [x] 다국어 Title hierarchy와 Metric 동작을 Mapping했습니다.
- [x] 현재 Typography utility 값을 그대로 이어가지 않고 Mapping했습니다.
- [x] 영어 원본과 한국어 Companion을 함께 작성했습니다.
- [ ] Batch B에서 Font family와 Fallback 후보 값을 비교합니다.
- [ ] Physical size, Line height, Weight, Tracking 및 Responsive behavior를
      비교합니다.
- [ ] 통합 `S1`–`S6` Specimen을 사용자와 검토합니다.
- [ ] 승인된 물리 값을 Foundation v0.1로 승격합니다.
