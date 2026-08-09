# NosLog 2.0 Foundation 컬러 및 Material 후보

## 문서 관리

- 상태: `조사 완료 — C1–C4 역할 구조, Spectrum S2의 정확한 neutral mapping,
Fluent focus, SS-08 Radix Indigo identity source 승인; 정확한 material 치수와
component alias 대기`
- 원본 언어: 영어
- 영문 원본:
  [32-foundation-color-material-candidates.md](./32-foundation-color-material-candidates.md)
- 시작일: 2026-08-08
- 범위: 중립 표면, 텍스트, 인터랙션, 포커스, 상태, 도메인 컬러 소유권,
  테두리, radius, elevation, scrim, Dark/Light/System 동작을 위한 Foundation
  v0.1 외관 구조
- 입력: 승인된 문서 `01`–`31`, 현재 저장소 컬러 구현, `390 × 844`의 현재
  `/ko` 브라우저 근거, 아래의 집중 레퍼런스 매트릭스
- 제외: feedback 및 데이터 시각화 컬러, 정확한 radius와 shadow 치수, 최종
  identity/action component alias와 스타일, 일러스트레이션, 아이콘 문법, 모션,
  Figma 프로덕션 화면, 애플리케이션 구현

이 문서는 근거, 후보 구조, 트레이드오프, 제안된 결정 묶음을 기록한다. 사용자가
명시적으로 승인하기 전까지 `Proposed`로 표시된 내용은 승인된 NosLog 2.0 시각
규칙이 아니다.

## 관련 문서

- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation 시맨틱 역할 맵](./25-foundation-semantic-role-map.ko.md)
- [Foundation 타이포 및 레이아웃 후보](./26-foundation-typography-layout-candidates.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 Fluent focus 검증](./44-foundation-c5-fluent-focus-specimen-validation.ko.md)
- [C5 정확한 signature system 비교](./45-foundation-c5-signature-system-reference-comparison.ko.md)
- [S1 탐색 검증](./27-foundation-s1-discovery-structural-validation.ko.md)
- [S2 악곡 상세 검증](./28-foundation-s2-music-detail-structural-validation.ko.md)
- [S3 랭킹 검증](./29-foundation-s3-global-rankings-structural-validation.ko.md)
- [S4 채보 뷰어 검증](./30-foundation-s4-chart-viewer-structural-validation.ko.md)
- [S5 홈 검증](./31-foundation-s5-home-structural-validation.ko.md)
- [교차 레퍼런스 매트릭스](./22-cross-cutting-reference-matrix.ko.md)
- [설정 및 계정 브리프](./16-settings-account-page-brief.ko.md)
- [시그니처 컬러 조사](./33-foundation-signature-color-research.ko.md)

## 승인 경계

다음 계약은 이미 이 작업을 지배하며 여기서 다시 논의하지 않는다.

- Dark는 대표 NosLog 아트 디렉션 기준이며, System, Dark, Light는 모두 완전하게
  지원되는 외관 선택지다.
- 신규 사용자는 System이 기본이며, 기존의 명시적 Dark 또는 Light 선택은
  마이그레이션되고 기기 로컬에 유지된다.
- 색상만으로 상태, 랭크, 난이도, 손, 모드 또는 데이터를 전달할 수 없다.
- 재킷 아트, 악곡 정체성, 점수, NOSTALGIA 의미가 표현성을 가질 수 있으며,
  브랜드 색상이 모든 표면을 지배할 필요는 없다.
- S1–S5에서 승인된 구조 결정은 안정적으로 유지한다. 외관은 그 구조를 지원해야
  하며 암묵적으로 다시 설계해서는 안 된다.
- WCAG 2.2 AA가 프로덕션 기준이다. 대비는 단독 swatch가 아니라 실제 인접 표면과
  상태에서 검증한다.

## 현재 NosLog 근거

### 브라우저 관찰

2026-08-08에 로그인된 현재 홈을 `390 × 844`에서 확인했다. 이는 마이그레이션
근거이며 2.0 외관의 권위가 아니다.

- 페이지는 `#0b0b10`을 사용하고, sticky header, footer, 공지, 이동 카드, 공식 소식
  영역 대부분이 동일한 `#121218` 표면을 사용한다.
- 따라서 평면 카드의 계층은 주로 간격, 작은 명도 차이, 간헐적인 테두리에 의존한다.
  반복되는 카드 대부분에는 구분된 시맨틱 레이어가 없다.
- 주요 액션과 포커스 표현은 식별 가능한 NosLog 액션 accent가 아니라 거의 흰색이다.
- 홈에서는 아직 콘텐츠 아트를 통제된 로컬 표현 수단으로 사용하지 않는다.
- 차분한 중립 shell은 재사용할 수 있는 근거다. 명시적인 표면, 인터랙션, 도메인
  소유권의 부재는 재사용할 규칙이 아니다.

### 저장소 관찰

`app/globals.css`는 현재 background, surface, text, interaction, status, chart,
score, rank, difficulty, Basic/Recital, genre, Discord 역할에 Dark와 Light 값을
정의한다. 이 목록은 유용한 마이그레이션 seed지만 소유권 모델은 완전하지 않다.

- Dark 중립 역할은 `bg`, `surface`, `surface-muted`, `divider`, `border`다.
- 하나의 `interactive` 색상이 주요 filled action에도 쓰이며, Dark의 `focus`는 같은
  거의 흰색 값을 공유한다.
- 상태는 현재 `success`, `danger`만 있으며 warning과 information 계열이 없다.
- rank, difficulty, mode, genre, 일반 chart, score, hand 색상이 충돌 정책 없이 한
  화면에 공존할 수 있다.
- Canvas/WebGL, 프로필 카드 렌더링, bookmarklet UI, 에디터 유틸리티에는 여전히
  하드코딩 색상 또는 직접 Tailwind palette utility가 있다.
- 현재 source scan에서 시맨틱 토큰 사용 외에 핵심 중립색과 도메인 색상의 리터럴
  중복이 발견됐다. 이는 primitive → semantic → component alias 매핑이 필요하다는
  근거이며, 그 정확한 값을 보존할 허가는 아니다.

### 현재 대비 측정

다음 비율은 현재 sRGB 값으로 계산했다. 지정된 조합만 설명하며 해당 값을
승인하지 않는다.

| 조합                          | 현재 비율 | 해석                                            |
| ----------------------------- | --------: | ----------------------------------------------- |
| Dark 기본 텍스트 / 페이지     | `17.57:1` | 강한 텍스트 대비                                |
| Dark 보조 텍스트 / 페이지     |  `7.58:1` | 강한 텍스트 대비                                |
| Dark 비활성 텍스트 / 페이지   |  `3.48:1` | 비본질적이며 실제 비활성인 경우에만 사용        |
| Dark surface / 페이지         |  `1.05:1` | 단독으로 필수 그룹화를 전달하기에는 너무 미묘함 |
| Dark muted surface / surface  |  `1.08:1` | 단독으로 필수 상태를 전달하기에는 너무 미묘함   |
| Dark divider / surface        |  `1.16:1` | 다른 단서가 없다면 장식적 구분에만 사용         |
| Dark border / surface         |  `1.32:1` | 단독으로 필수 control 경계를 식별할 수 없음     |
| Light 기본 텍스트 / 페이지    | `15.02:1` | 강한 텍스트 대비                                |
| Light 보조 텍스트 / surface   |  `7.11:1` | 강한 텍스트 대비                                |
| Light 비활성 텍스트 / surface |  `3.04:1` | 비본질적이며 실제 비활성인 경우에만 사용        |

낮은 중립색 간 대비가 자동으로 실패인 것은 아니다. 장식적 카드 경계는 항상
`3:1`일 필요가 없다. 다만 control, 상태, 포커스 표시 또는 의미 있는 그래픽을
식별하는 유일한 정보일 때는 실패가 된다.

## 집중 레퍼런스 매트릭스

비교에는 독립적인 열일곱 개 source group을 사용했다. 일부 group은 두 개 이상의
페이지를 포함하지만, source 수를 부풀리지 않도록 각 행을 한 번만 계산했다.

| Source group                                                                                                                                                                                                          | 전이 가능한 근거                                                                                                                                                              | NosLog 적용                                                                                               | 한계                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | 일반 텍스트는 `4.5:1`, 의미 있는 컴포넌트/그래픽 단서는 `3:1`이 필요하며 색조만으로 의미를 전달할 수 없다.                                                                    | 텍스트, control, focus, difficulty, hand, rank, mode, chart, status 검증을 지배한다.                      | 아트 디렉션이나 palette 값을 선택해 주지 않는다.                                 |
| [Apple Color](https://developer.apple.com/design/human-interface-guidelines/color), [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)                                              | 시맨틱 adaptive color, 분리된 base/elevated dark background, 비반전 외관 값이 계층을 보존한다.                                                                                | 완전한 System/Dark/Light 동작과 Dark에서 더 밝아지는 전경 레이어를 뒷받침한다.                            | Apple native material과 component style은 웹의 권위가 아니다.                    |
| [Material 3 theme and brand](https://developer.android.com/codelabs/m3-design-theming)                                                                                                                                | 역할 기반 `surface`/`on-surface`와 container pair가 목적을 raw swatch와 분리한다.                                                                                             | foreground/background pair와 순서 있는 surface container를 뒷받침한다.                                    | Material 기본 색조와 표현적 컴포넌트 스타일은 채택하지 않는다.                   |
| [Fluent 2 design tokens](https://fluent2.microsoft.design/design-tokens), [Elevation](https://fluent2.microsoft.design/elevation)                                                                                     | global primitive가 semantic alias에 매핑되고 theme가 light, dark, high contrast, brand를 포괄하며 elevation은 통제된 시스템이다.                                              | primitive → semantic → component alias와 명시적 elevation 역할을 뒷받침한다.                              | Fluent shadow ramp는 NosLog가 필요로 하는 것보다 크다.                           |
| [Atlassian elevation](https://atlassian.design/foundations/elevation), [Border](https://atlassian.design/foundations/border)                                                                                          | sunken, default, raised, overlay surface는 의도가 다르며 Dark에서는 shadow가 약해져 surface color를 사용하고 border width와 color를 상태별로 결합한다.                        | page, viewer/editor well, flat region, movable/raised content, overlay, selected, focus 역할에 잘 맞는다. | enterprise board 예시는 NosLog의 밀도나 시각 톤을 결정하지 않는다.               |
| [Carbon color](https://carbondesignsystem.com/elements/color/overview/)                                                                                                                                               | neutral gray가 지배하고 미묘한 명도 차이가 콘텐츠를 조직하며 theme가 바뀌어도 role name은 유지되고 값만 바뀐다.                                                               | 조용한 shell, 제한적 accent, 변하지 않는 semantic token을 뒷받침한다.                                     | Carbon의 정확한 blue accent와 alternating layer는 채택하지 않는다.               |
| [Adobe Spectrum color system](https://spectrum.adobe.com/page/color-system/), [Object styles](https://spectrum.adobe.com/page/object-styles/)                                                                         | 색상은 제한적이고 의도적이며 status에는 text/icon 지원이 필요하고 대부분의 component는 shadow보다 contrast/overlay를 사용하며 shadow는 일시적 dismissible content에 제한된다. | 절제된 status, 제한된 shadow, content-first hierarchy를 뒷받침한다.                                       | creative-tool 밀도와 semantic assignment는 NosLog 값을 정하지 않는다.            |
| [Radix Colors use cases](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale), [Aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)                                        | background, interaction state, border, solid fill, text에 분리된 단계가 있고 alias는 component별 raw name 없이 Light/Dark를 재매핑한다.                                       | 현재 Radix stack과 state ramp 설계에 매우 직접적으로 적용된다.                                            | APCA 주장은 NosLog의 WCAG 2.2 AA 인수 테스트를 대체하지 않는다.                  |
| [Shopify Polaris color tokens](https://polaris-react.shopify.com/design/colors/color-tokens)                                                                                                                          | semantic name은 element, role, prominence, state를 조합한다.                                                                                                                  | component에서 hue name이 아닌 `background/action/subtle/hover`식 소유권을 뒷받침한다.                     | commerce task와 현재 Polaris packaging은 NosLog 시각을 지배하지 않는다.          |
| [GitHub Primer color usage](https://www.primer.style/product/getting-started/foundations/color-usage/)                                                                                                                | Light/Dark neutral scale이 기능적 role을 공유하고 background, border, text, state role에 측정 가능한 대비 책임이 있다.                                                        | multi-theme token 안정성, subdued/emphasis 변형, 대비 조정을 뒷받침한다.                                  | GitHub의 조밀한 개발자 UI는 구조 비교일 뿐이다.                                  |
| [USWDS theme color tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/), [Using color](https://designsystem.digital.gov/design-tokens/color/overview/)                                         | theme token은 system color에 매핑되고 대비는 swatch 속성이 아니라 관계로 평가된다.                                                                                            | 자동 pair test와 명시적 foreground/background contract를 뒷받침한다.                                      | 정부 브랜딩 비율과 정확한 palette는 적용되지 않는다.                             |
| [GOV.UK focus states](https://design-system.service.gov.uk/get-started/focus-states/)                                                                                                                                 | 두 색상으로 충분한 두께를 가진 focus treatment는 여러 surface 위에서도 보일 수 있다.                                                                                          | brand/action color와 독립되고 모든 surface에서 검증되는 focus role을 뒷받침한다.                          | yellow/black 표현은 근거이며 NosLog에 요구되는 외관이 아니다.                    |
| [VA Design System color](https://design.va.gov/foundation/design-tokens/color)                                                                                                                                        | primitive, semantic, component token이 분리되며 action과 feedback은 on-light/on-dark role을 제공한다.                                                                         | 맥락별 foreground를 뒷받침하고 component alias를 실제 예외로 제한한다.                                    | 공공 서비스 palette와 component 범위는 NosLog 정체성과 무관하다.                 |
| [Spotify design](https://spotify.design/article/better-in-black-rethinking-our-most-important-buttons), [Web player](https://webplayer.byspotify.com/)                                                                | 어둡고 콘텐츠 중심인 음악 제품은 shell을 절제하면서 art와 하나의 기능적 accent에 정체성을 맡길 수 있고 button 변경은 접근성 검증을 거친다.                                    | `PR-08`, 즉 jacket/content expression과 제한적 action accent를 뒷받침한다.                                | Spotify는 playback-first이며 항상 dark다. NosLog는 Light와 분석 task도 지원한다. |
| [NOSTALGIA 공식 제품 가이드](https://www.konami.com/arcadegames/products/am_nostalgia/)                                                                                                                               | 공식적으로 파란 노트는 왼손, 빨간 노트는 오른손을 안내한다.                                                                                                                   | 왼손/오른손 의미를 generic action/status color가 아닌 domain color로 보존한다.                            | 공식 marketing 표현은 웹 접근성이나 layout 표준이 아니다.                        |
| 현재 NosLog 브라우저 근거                                                                                                                                                                                             | neutral shell은 차분하지만 단일 surface와 거의 흰색인 interaction 표현은 material 및 brand 구분이 약하다.                                                                     | migration baseline, real content, state stress case를 제공한다.                                           | 현재 UI는 2.0 시각 권위가 아니다.                                                |
| 현재 NosLog 코드 및 승인 브리프                                                                                                                                                                                       | 기존 token은 많은 domain role을 포괄하고 완전한 System/Dark/Light는 이미 승인됐으며 hard-coded renderer/utility value는 drift를 보여준다.                                     | 구현 매핑과 전체 domain collision 목록을 제공한다.                                                        | 기존 값과 이름을 자동 보존하지 않는다.                                           |

## 조사 수렴점

출처들은 정확한 중립 값, 색조, radius, shadow 깊이에 대해서는 서로 다르지만 다음의
전이 가능한 규칙에는 수렴한다.

1. 컴포넌트는 semantic role을 사용하고 theme는 그 role을 appearance별 값에
   매핑한다.
2. Dark는 Light의 수치 반전이 아니다. shadow만으로는 약하기 때문에 통제된
   surface value 변화로 Dark의 깊이를 표현해야 한다.
3. neutral surface가 지배하고 saturated color는 action, status, domain meaning,
   data 또는 제한적 표현에만 사용한다.
4. foreground, background, border, interaction-state color는 검증되는 pair다.
5. focus는 기능적 접근성 신호이며 모든 지원 surface, image edge, appearance에서
   보여야 한다.
6. status와 domain color에는 항상 text, icon, shape, position, pattern 또는 다른
   비색상 단서가 함께한다.
7. 그룹화된 모든 block이 raised card는 아니다. whitespace, flat region, divider,
   border도 유효한 그룹화 도구다.
8. shadow는 일시적 stacking, movement, overlap, scroll boundary에 가장 타당하며
   모든 card의 기본 장식이 아니다.
9. 목적 이름을 가진 작은 radius 어휘가 페이지별 corner value보다 관리하기 쉽다.
   full rounding은 특수 control/indicator shape이며 universal container style이 아니다.
10. 대비는 Dark, Light, System 전환, `200%` 텍스트, forced colors/high contrast,
    밝고 어두운 artwork를 포함한 실제 상태와 조합에서 검증한다.

## 불일치와 한계

- 시스템마다 surface level 수가 다르다. Apple은 간결한 base/elevated 구분,
  Atlassian은 sunken/default/raised/overlay, Material은 더 큰 container 범위를
  사용한다. NosLog는 검증된 page, viewer/editor, card, menu, dialog 요구를
  충족하는 가장 작은 목록을 골라야 한다.
- 시스템마다 shadow 강조 정도가 다르다. Fluent는 넓은 ramp를 제공하지만
  Spectrum은 주로 일시적 surface를 위해 하나의 shadow를 제한적으로 사용한다.
  NosLog의 어둡고 조밀하며 콘텐츠 중심인 방향은 절제를 지지하지만 정확한 level은
  specimen 검증이 필요하다.
- 음악 제품은 content-led color를 보여주지만 jacket에서 추출한 background tint는
  대비를 불안정하게 하고 밝은 flash를 만들 수 있다. 이는 기본 Foundation 규칙이
  아니라 선택적이고 로컬한 방식으로 남긴다.
- brand accent는 selected state에도 쓰일 수 있지만 동일한 accent가 artwork,
  domain color, filled control에 있을 때 focus가 사라져서는 안 된다.
- domain hue가 status hue와 비슷할 수 있다. token 분리만으로는 부족하며 의미가
  함께 등장할 때 label과 다른 단서가 모호함을 막아야 한다.

## 후보 구조

### 후보 C1 — 중립 표면 모델

| 안                   | 모델                                                        | 장점                                                                              | 위험                                                                                                          |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `C1-A` 최소          | `canvas`, `surface`, `overlay`, `scrim`                     | 차분하고 간결함                                                                   | 로컬 예외 없이 viewer/editor well을 이름 붙이거나 flat grouped content와 실제 raised content를 구분할 수 없음 |
| `C1-B` 목적 완결     | `canvas`, `surface`, `sunken`, `raised`, `overlay`, `scrim` | 검증된 NosLog 공간 역할을 모두 포괄하며 목적이 명확한 채 값은 서로 가까울 수 있음 | 일반 card가 모두 raised가 되지 않도록 엄격한 규칙이 필요함                                                    |
| `C1-C` 큰 tonal ramp | 여러 numbered container와 C1-B의 모든 역할                  | 세밀한 theming                                                                    | 자의적인 로컬 선택을 유도하고 v0.1 요구를 초과함                                                              |

**제안 추천:** `C1-B`. 현재 page canvas, flat group, chart viewer/editor well,
움직이거나 강조되는 raised content, menu/dialog, modal scrim을 하나의 `surface`
token에 과부하시키지 않고 포괄하는 가장 작은 모델이다.

제안된 사용 경계:

- `canvas`: page와 shell 기준면
- `surface`: flat grouped content와 표준 component background
- `sunken`: 시각적으로 안쪽으로 물러나는 경계가 있는 visualization, editor,
  code/data 또는 media well
- `raised`: 우선순위, movement 또는 overlap 때문에 실제로 `surface`보다 위에 있는
  content
- `overlay`: menu, popover, tooltip, sheet, dialog 및 기타 일시적 상위 layer
- `scrim`: modality/background suppression 전용이며 content surface로 사용하지 않음

### 후보 C2 — Accent와 focus 소유권

| 안                   | 모델                                                                                                                                                                           | 장점                                                   | 위험                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `C2-A` 통합          | 하나의 accent가 primary action, link, selected, focus를 모두 소유                                                                                                              | 작은 어휘                                              | focus가 accent fill, artwork, domain hue에서 사라질 수 있고 brand와 접근성이 결합됨 |
| `C2-B` focus 분리    | 별도로 통제되는 signature/accent family는 승인된 identity 또는 드문 action emphasis에만 사용할 수 있고 neutral interaction이 기본이며, 전용 focus pair가 keyboard focus를 소유 | 안정적인 focus, 절제된 색상 사용, 향후 쉬운 brand 조정 | 모든 interaction을 자동으로 다시 칠하는 대신 component별 명시적 governance가 필요함 |
| `C2-C` 무채색 action | 거의 흰색/검정 action, color는 domain/status에만 사용                                                                                                                          | 매우 절제됨                                            | NosLog action 정체성이 약하고 selected-state affordance가 제한됨                    |

**승인된 해석:** `C2-B`는 가능한 signature/accent family를 keyboard focus와
분리한다. 이 family를 모든 primary action, link, selected state 또는 interactive
control에 칠해야 한다는 뜻이 아니다. neutral treatment가 기본이다. component는
identity 또는 정말로 주된 action 역할이 별도로 입증되고 승인된 경우에만 signature
family를 사용할 수 있다. accent는 success, danger, hand, difficulty, rank, score
또는 chart series를 소유할 수 없다. focus는 독립적으로 검증하며 하나의 outline이
모든 surface에서 보이지 않을 때 두 색상 treatment를 사용할 수 있다.

### 제안된 시맨틱 컬러 계열

이는 값 목록이 아니라 역할 목록이다.

| 계열                       | 제안 역할                                                                                                                                 | 경계                                                                                                                                                                                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Neutral surface            | `canvas`, `surface`, `sunken`, `raised`, `overlay`, `scrim`                                                                               | 공간/material 관계에만 사용                                                                                                                                                                                                                    |
| Neutral foreground         | `text-primary`, `text-secondary`, `text-tertiary`, `text-disabled`, `icon-primary`, `icon-secondary`, `on-accent`, `on-status`, `inverse` | disabled를 보조 설명문 대신 사용하지 않음                                                                                                                                                                                                      |
| Neutral boundary           | `divider`, `border-subtle`, `border-default`, `border-strong`                                                                             | 필수 control은 장식적 저대비 divider에 의존할 수 없음                                                                                                                                                                                          |
| Signature/accent 사용 후보 | `accent-solid`, `accent-solid-hover`, `accent-solid-pressed`, `accent-text`, `accent-border` 등의 후보 역할                               | token은 사용할 수 있는 treatment를 설명할 뿐 자동 확산을 뜻하지 않는다. 별도 승인된 identity touchpoint와 드문 primary-action emphasis에만 제한하며 일반 link, filter, selection, container, difficulty label은 기본적으로 neutral을 유지한다. |
| Focus                      | `focus-outer`, 선택적 `focus-inner`                                                                                                       | keyboard focus 전용이며 selected/error와 독립                                                                                                                                                                                                  |
| Feedback                   | `info`, `success`, `warning`, `danger` 각각 `foreground`, `surface`, `border`, 선택적 `solid`, `on-solid`                                 | 항상 text/icon 및 올바른 ARIA/state semantics와 함께 사용                                                                                                                                                                                      |
| Domain                     | `hand-left`, `hand-right`, 네 난이도, `mode-basic`, `mode-recital`, rank/achievement role, score emphasis                                 | NOSTALGIA 의미를 보존하며 component intent로 재사용하지 않음                                                                                                                                                                                   |
| Data                       | sequential, diverging, categorical, threshold, grid, axis, selection role                                                                 | 값은 Batch D로 미루며 domain/status color를 암묵적으로 재사용하지 않음                                                                                                                                                                         |
| External brand             | `discord` 및 이후 승인되는 외부 brand role                                                                                                | 외부 정체성이 필요한 곳에만 사용                                                                                                                                                                                                               |

### 후보 C3 — 도메인 충돌 정책

**제안 정책:** 색조 정체성보다 semantic ownership을 우선한다.

- 왼손/오른손은 공식 NOSTALGIA 의미에 따른 label이 있는 cyan/red 계열 domain
  role로 유지한다. 이는 `info`/`danger`가 아니다.
- difficulty, mode, rank, achievement, score, genre, status, chart role은 나중에
  승인되는 값이 가까운 색조를 공유하더라도 서로 다른 semantic name을 갖는다.
- 한 component 또는 chart에 두 의미가 함께 나타날 때 visible abbreviation, label,
  icon, pattern, position, line style 또는 shape로 색상을 보완한다.
- 현재 코드가 정의했다는 이유만으로 genre color가 필요하다고 가정하지 않는다.
  효용과 충돌 비용은 이후 집중 결정에서 검토한다.
- data series는 쓰지 않은 임의의 domain color를 가져갈 수 없다. Batch D는 Batch C
  ownership 승인 뒤 접근 가능한 visualization palette를 구성해야 한다.

### 후보 C4 — Border, radius, elevation 모델

#### Border 제안

- `1px`를 기본 structural border/divider primitive로 제안한다.
- `2px`는 측정된 대비와 면적이 요구할 때 selected, focused 또는 강한 강조 경계를
  위한 후보로 제한한다.
- border visibility와 width는 semantic state에 맞게 결합해야 하며 width만 또는
  hue만으로 selection/focus/error를 전달할 수 없다.
- CSS pixel 미만 hairline은 shared v0.1 token으로 두지 않는다.

정확한 primitive는 specimen으로 확인할 때까지 미승인 상태다.

#### Radius 대안

| 안                         | 모델                                                                  | 장점                                                     | 위험                                                   |
| -------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| `R-A` 하나의 radius + full | 하나의 표준 container radius와 full rounding                          | 매우 간결함                                              | nested control, card, large overlay를 구분하지 못함    |
| `R-B` 세 목적 role + full  | `radius-control`, `radius-container`, `radius-overlay`, `radius-full` | 작지만 표현력이 있고 nesting과 material hierarchy를 지원 | 정확한 값과 component mapping에 specimen 검토가 필요함 |
| `R-C` 넓은 size ramp       | 다섯 개 이상의 corner size와 full                                     | 유연함                                                   | 자의적인 페이지별 styling을 재현하고 정체성을 약화함   |

**제안 추천:** `R-B`, 정확한 값은 미룬다. 의도적으로 full이 아닌 한 child control은
포함하는 surface radius보다 시각적으로 커서는 안 된다. full rounding은 circular
control, avatar/status dot, compact chip, shape에 문서화된 목적이 있는 control에만
사용한다.

#### Elevation 제안

- flat `canvas`, `surface`, `sunken`은 기본 shadow 없이 value, spacing, border를
  사용한다.
- `raised`는 실제 lift, movement, overlap 또는 emphasis가 있을 때만 절제된 shadow를
  사용할 수 있다.
- `overlay`는 surface value와 boundary 및 shadow를 사용하며, Dark에서는 shadow만
  의존할 수 없다.
- `scrim`은 modality를 나타내지만 focus trapping, dialog semantics, Escape/close
  behavior 또는 background inertness를 대체하지 않는다.
- scroll-boundary shadow는 별도의 방향성 affordance이며 일반 elevation level이 아니다.
- viewer와 editor renderer는 내부 visual depth를 정의할 수 있지만 주변 shell은
  여전히 이 shared role에 매핑한다.

## 외관 계약

- `System`은 운영체제 preference를 따르며 현재 task state를 잃지 않고 preference
  변경에 반응한다.
- 명시적인 `Dark`와 `Light`는 현재 기기에서 System을 override한다.
- semantic token name과 component 작성 방식은 appearance 간 동일하게 유지하며,
  매핑되는 값과 appearance별 asset만 바뀐다.
- Dark layer는 일반적으로 높아질수록 밝아진다. Light 계층은 surface, border,
  절제된 shadow를 사용할 수 있으며 Dark의 직접 반전이 아니다.
- text, icon, control, focus, status, domain, visualization, image edge, overlay
  대비는 두 appearance에서 각각 검증한다.
- 브라우저 `forced-colors`와 high-contrast 동작은 boundary, focus, selection,
  status를 보존해야 한다. 장식적 shadow와 background tint에 의존하지 않는다.
- jacket과 avatar asset은 그 경계가 component 이해 또는 조작에 필요할 때만 edge
  treatment를 사용한다.

## 승인된 C5 Neutral Primitive Source

사용자는 2026-08-08
[Adobe Spectrum S2 grayscale token data](https://opensource.adobe.com/spectrum-design-data/tokens/color-palette/)를
NosLog 2.0 Dark/Light neutral foundation의 지배적인 primitive source로 승인했다.
검토에서는 IBM Carbon, GitHub Primer, Adobe
Spectrum S2, Microsoft Fluent 2, Atlassian, SAP Fiori Horizon, Radix Slate,
Material 3, Ant Design, Red Hat PatternFly의 열 개 production system을 동일한 C5
role 순서와 Dark/Light 구조로 비교했다. 현재 NosLog 값은 연속성 후보가 아니라
거부된 migration evidence로 유지했고 과도하게 accent를 적용한 `FCM-11`/`SIG-07`
specimen은 제외했다.

승인 범위는 다음과 같이 정확히 제한한다.

1. 공개된 Spectrum S2 grayscale 값을 Dark와 Light 모두의 유일한 neutral
   primitive source로 사용한다.
2. source 값을 정확히 보존한다. Tailwind 색상으로 대체하거나 현재 custom Dark
   값과 TDS 기반 Light 값을 섞거나 role을 더 “NosLog답게” 보이게 하려는 로컬
   hue shift를 도입하지 않는다.
3. neutral primitive source만 채택하며 Adobe component styling, spacing,
   typography, accent color, brand 표현, radius, shadow 또는 page composition은
   채택하지 않는다.
4. appearance 간 변하지 않는 primitive → semantic → component-alias 구조로 이
   primitive를 승인된 NosLog role에 매핑한다. 정확한 role 배정은 측정한 대표
   specimen을 검토하기 전까지 `Proposed`다.
5. source primitive를 직접 매핑해서 contrast, state 구분, artwork 인접성 또는
   forced-colors 요구를 충족할 수 없다면 primitive를 조용히 수정하지 않는다.
   충돌을 보고하고 mapping 또는 source 결정을 다시 연다.

### 승인된 source primitive

다음 값은 공개된 Spectrum S2 grayscale data에서 그대로 가져왔다. source ramp에
포함되는 값은 `Approved`이며 각 행을 NosLog semantic role에 배정하는 결정은 아직
대기 상태다.

| Spectrum S2 primitive | Light     | Dark      |
| --------------------- | --------- | --------- |
| `gray-25`             | `#ffffff` | `#111111` |
| `gray-50`             | `#f8f8f8` | `#1b1b1b` |
| `gray-75`             | `#f3f3f3` | `#222222` |
| `gray-100`            | `#e9e9e9` | `#2c2c2c` |
| `gray-200`            | `#e1e1e1` | `#323232` |
| `gray-300`            | `#dadada` | `#393939` |
| `gray-400`            | `#c6c6c6` | `#444444` |
| `gray-500`            | `#8f8f8f` | `#6d6d6d` |
| `gray-600`            | `#717171` | `#8a8a8a` |
| `gray-700`            | `#505050` | `#afafaf` |
| `gray-800`            | `#292929` | `#dbdbdb` |
| `gray-900`            | `#131313` | `#f2f2f2` |
| `gray-1000`           | `#000000` | `#ffffff` |

이 source 승인은 C5를 진행시켰지만 완료하지는 않았다. 이후 문서 `34`–`44`가
정확한 `M-A` surface, `F-A` foreground, `NB-A` boundary, `NI-A` interaction 및
`FI-C` focus mapping을 배정하고 검증했다. 시그니처 컬러, feedback 및 visualization
컬러, 정확한 material 치수, component alias와 애플리케이션 구현은 별도 Gate로 남는다.

## 승인된 절제 컬러 예산

사용자는 2026-08-08 과도하게 accent를 적용한 specimen을 거부한 뒤 다음 경계를
승인했다. 이 결정은 signature family가 모든 link, selected state, filter 또는
primary처럼 보이는 control에 자동 배정된다고 읽힐 수 있는 이전 문구를 대체한다.

1. shared UI는 압도적으로 neutral이어야 한다. color를 고려하기 전에 typography,
   spacing, alignment, value, 얇은 boundary로 일반 계층을 만든다.
2. 일반 container에는 signature color fill, tint 또는 border를 사용하지 않는다.
3. 적용된 filter는 neutral을 유지하며 colored container 대신 copy, checkmark,
   count, weight 또는 structure로 상태를 전달한다.
4. selection은 기본적으로 neutral을 유지하며 checkmark, border weight, type weight,
   position 또는 다른 비색상 단서를 사용한다. tint가 있는 selected container는
   기본 pattern이 아니다.
5. difficulty 및 다른 domain color는 일반 list, grid, filter 또는 navigation text에
   자동으로 표시하지 않는다. 보이는 domain-color 사용은 각각 별도 결정에서 실제
   탐색 또는 이해 이점을 입증해야 한다.
6. 향후 signature color는 우선 안정적인 identity touchpoint에 제한한다. 드문 진짜
   primary action은 해당 사용을 neutral treatment와 비교하고 별도로 승인한 뒤에만
   사용할 수 있다.
7. 한 viewport에서 서로 경쟁하는 accent가 반복되면 더 강한 brand 표현이 아니라
   validation 실패다.
8. signature family를 부족한 hierarchy, 불명확한 grouping 또는 약한 affordance를
   보완하는 지름길로 사용하지 않는다.

## 필수 후보 specimen

swatch만으로는 어떤 palette 값도 승인할 수 없다. 이후 시각 specimen에는 다음이
포함되어야 한다.

1. 밝고 어둡고 채도가 높은 jacket과 누락 jacket이 있는 S1 list/grid 결과
2. best score, rank, FC/Pianist, judgement, trend, partial/empty state가 있는 S2
3. 조밀한 ranking row, current-user selection, tie, disabled/ineligible state,
   pagination이 있는 S3
4. hand cue, renderer boundary, control, error, fullscreen, local-audio state가 있는
   S4 낙하형/전체 악보 viewer
5. search preview, destination collection, service notice, routine news, official
   news, empty/error state, N mark가 있는 S5 Home
6. 하나의 통제된 비교 안에서 flat content, sunken well, raised content,
   menu/popover, dialog, scrim, scroll boundary
7. default, hover, pressed, selected, focus-visible, disabled, loading, info,
   success, warning, danger state
8. `320`, `390`, intermediate, wide content region에서 기본 및 `200%` text의 한국어,
   일본어, 영어
9. Dark, Light, System 전환, forced colors/high contrast, 대표적인 색각 이상 simulation
10. 자동 contrast-pair report와 수동 시각 및 keyboard 검토

## 결정 묶음

| Batch | 결정                                                                               | 현재 상태                                                                              |
| ----- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `C1`  | 중립 표면 목록과 목적                                                              | `Approved — C1-B`                                                                      |
| `C2`  | 절제된 signature/accent 사용 후보와 독립 focus 소유권                              | `Approved — C2-B는 분리만 의미하며 neutral interaction이 기본`                         |
| `C3`  | feedback/domain/data 충돌 정책                                                     | `Approved — semantic ownership 및 비색상 단서`                                         |
| `C4`  | border, radius, elevation, scrim 구조                                              | `역할 구조 승인 — 정확한 값은 C5 대기`                                                 |
| `C5`  | 절제된 컬러 사용 경계, 측정된 specimen을 통한 정확한 Dark/Light 값과 시그니처 색조 | `Neutral/focus mapping과 SS-08 identity source 승인; material 및 component alias 대기` |
| `C6`  | 통합 S1–S5 외관 검증과 Foundation 승격                                             | `C5에 의해 차단`                                                                       |

한 batch의 승인이 다른 batch를 승인하지 않는다. 정확한 값은 그 값이 구현할 역할
구조가 승인되기 전에는 선택할 수 없다.

## 결정 로그

| ID       | 항목                                                                                                                                                                        | 상태                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `FCM-01` | 현재 neutral shell과 token inventory를 2.0 palette가 아니라 migration evidence로 취급한다.                                                                                  | `Observed`                                                                                    |
| `FCM-02` | 완전한 System/Dark/Light 지원과 Dark를 대표 art-direction 기준으로 유지한다.                                                                                                | `Approved upstream`                                                                           |
| `FCM-03` | appearance 간 invariant semantic name을 갖는 primitive → semantic → component-alias 구조를 사용한다.                                                                        | `Proposed`                                                                                    |
| `FCM-04` | 목적 완결형 C1-B neutral surface inventory를 채택한다.                                                                                                                      | `Approved — 2026-08-08`                                                                       |
| `FCM-05` | 일반 interaction에 색을 요구하지 않으면서 C2-B를 통해 가능한 signature/accent 소유권을 focus와 분리한다.                                                                    | `Approved; clarified — 2026-08-08`                                                            |
| `FCM-06` | NOSTALGIA domain color를 분리된 role로 보존하고 비색상 단서와 collision 검토를 요구한다.                                                                                    | `Approved — 2026-08-08`                                                                       |
| `FCM-07` | 정확한 값을 미룬 채 R-B의 세 목적 radius role과 full rounding을 사용한다.                                                                                                   | `Approved — 2026-08-08`                                                                       |
| `FCM-08` | 기본 flat content에서 shadow를 제거하고 타당한 raised, overlay, scroll-boundary 관계에만 제한한다.                                                                          | `Approved — 2026-08-08`                                                                       |
| `FCM-09` | 승인된 role specimen이 나올 때까지 semantic role mapping, signature hue, visualization color를 미루며 FCM-12는 neutral primitive source만 해결한다.                         | `일부 Superseded; signature는 문서 47에서 해결; visualization 및 material 잔여 범위 Proposed` |
| `FCM-10` | container, link, filter, selection 및 일반 domain label은 neutral treatment를 기본으로 하고 signature color는 우선 identity와 별도 승인된 드문 primary action에만 제한한다. | `Approved — 2026-08-08`                                                                       |
| `FCM-11` | selected container, filter state, link 및 여러 경쟁 요소에 accent를 칠한 과도한 signature-color 비교를 거부한다. 이는 guide 또는 production authority가 아니다.             | `Rejected — 2026-08-08`                                                                       |
| `FCM-12` | 공개된 Adobe Spectrum S2 grayscale 값을 유일한 Dark/Light neutral primitive source로 채택하며 이 source 승인 자체는 semantic mapping을 승인하지 않는다.                     | `Approved — 2026-08-08; mapping은 이후 문서 34–44에서 승인`                                   |
| `FCM-13` | 온전한 `SS-08` Radix Colors Indigo를 NosLog identity source로 채택하며 정확한 identity/action component alias와 rare-action eligibility는 이후 gate로 유지한다.             | `Approved — 2026-08-10`                                                                       |

## 승인된 1차 검토 — 2026-08-08

사용자는 인터랙티브 역할 specimen을 검토한 뒤 다음을 승인했다.

1. `C1-B`: `canvas`, `surface`, `sunken`, `raised`, `overlay`, `scrim`을 사용하고
   실제 깊이 관계가 없는 일반 card는 평면 `surface`로 유지한다.
2. `C2-B`: 아직 색조를 선택하지 않은 signature/accent family를 keyboard focus와
   semantic하게 분리하며, 정확히 어디에 사용할지는 이 검토 시점에 미결정으로 둔다.
3. 모든 card를 장식하는 대신 타당한 `raised`, `overlay`, scroll-boundary 관계에만
   shadow를 사용한다.

이 승인은 역할 소유권만 확정한다. specimen의 임시 색상, geometry, radius,
border 값, shadow 값, typography, page composition은 승인된 production styling이
아니다. 시그니처 색조, 정확한 중립 값, radius 값, border/shadow 치수는 의도적으로
미결정 상태로 남는다.

## 승인된 2차 검토 — 2026-08-08

사용자는 나머지 C3 및 C4 구조 추천을 승인했다.

1. hand, difficulty, mode, rank, achievement, score, feedback, 이후 data color를
   서로 다른 semantic ownership으로 보존하고 의미가 충돌할 수 있는 곳에는 보이는
   비색상 단서를 함께 사용한다.
2. `1px`를 기본 structural border/divider primitive로 사용하고, 측정된 상태가
   필요로 할 때 selected, focused 또는 강한 강조 경계에만 `2px`를 사용하며,
   CSS pixel 미만의 shared hairline token은 만들지 않는다.
3. R-B의 `radius-control`, `radius-container`, `radius-overlay`, `radius-full`
   역할을 사용하고 정확한 값은 측정 specimen까지 미룬다.

1차 검토와 합쳐 C1–C4 역할 구조를 완료한다. 시그니처 색조, neutral palette,
정확한 Dark/Light 값, border color, radius dimension, shadow dimension,
visualization palette를 승인한 것은 아니다. 해당 결정은 C5 조사와 specimen 검토로
이동한다.

## 승인된 3차 검토 — 절제된 컬러 사용 — 2026-08-08

사용자는 이후 비교 specimen이 selected-chart container, filter state, link,
difficulty text 및 다른 반복 요소 전반에 candidate accent를 퍼뜨렸기 때문에 이를
거부했다. 해당 specimen은 과거의 `Rejected` 근거일 뿐이며 Claude Design이나 구현이
시각 source로 사용해서는 안 된다.

대체 결정은 위의 **승인된 절제 컬러 예산**이다. 이제 C2-B는 signature/accent와
focus의 분리를 뜻하며 모든 interaction state에 자동으로 color ownership을 준다는
뜻이 아니다. 정확한 neutral 값, canonical master color의 존재 및 색조, 드문
primary-action 예외는 새 검토에서 다룰 C5 질문으로 남는다. 이 checkpoint에서는
어떤 color specimen도 승인되지 않았다.

## 승인된 4차 검토 — Spectrum S2 Neutral Source — 2026-08-08

neutral color가 interface 대부분을 차지하므로 더 넓은 비교가 필요하다는 사용자 요청에
따라 동일한 C5 role 순서로 열 개 production system의 Dark/Light source를 검토했다.
사용자는 Adobe Spectrum S2를 선택하고 `FCM-12`에 기록된 범위를 명시적으로
승인했다. 공개된 grayscale primitive 값을 정확히 보존하고 Adobe의 component
language나 다른 visual-system 결정을 가져오지 않은 채 NosLog semantic role에
매핑한다.

이는 master neutral primitive source와 그 공개 값의 승인이다. 비교 중 표시한
임시 role mapping이나 signature, focus, feedback, domain, data visualization,
border, shadow, radius 또는 component 값의 승인이 아니다. 해당 항목은 서로 분리된
측정 결정으로 남는다.
