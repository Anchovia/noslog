# NosLog 2.0 C5 Neutral Foreground 레퍼런스 비교

## 문서 제어

- 상태: `조사 완료; 문서 37에서 초기 F-A specimen 측정 — 승인된 foreground
mapping 없음`
- 정본 언어: 영어
- 영어 정본:
  [36-foundation-c5-neutral-foreground-reference-comparison.md](./36-foundation-c5-neutral-foreground-reference-comparison.md)
- 시작일: 2026-08-08
- 범위: `C5M-04`를 결정하기 전에 저명한 design system의 foreground hierarchy를
  비교하고, 승인된 Adobe Spectrum S2 neutral primitive source 및 `M-A` surface와
  호환되는 온전한 mapping을 식별
- 입력: 승인된 문서 `25`, `32`, `33`, `35`; 문서 `34`의 잠정 foreground 가설;
  현재 공식 design-system 출처; WCAG 2.2; 모든 승인된 `M-A` surface에 대한 측정
  contrast
- 제외: 어떤 foreground token의 승인, boundary 및 focus mapping,
  signature/feedback/domain/data-visualization chromatic color, component styling,
  high-fidelity page design 및 application implementation

이 조사는 `C5M-04` 전에 발견한 절차상 공백을 수정한다. 이전 foreground 표는
Spectrum 기반의 잠정 가설이었으며 폭넓은 레퍼런스 비교가 아니었다. Surface mapping
문서나 validation specimen에 나타났다는 이유만으로 권위가 되어서는 안 된다.

## 관련 문서

- [Foundation semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Foundation color and material candidates](./32-foundation-color-material-candidates.ko.md)
- [Signature color research](./33-foundation-signature-color-research.ko.md)
- [C5 Spectrum S2 semantic mapping](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [C5 Spectrum surface validation](./35-foundation-c5-spectrum-surface-validation.ko.md)
- [C5 foreground specimen 검증](./37-foundation-c5-foreground-specimen-validation.ko.md)

## 권위 및 비교 규칙

1. Adobe Spectrum S2는 `FCM-12`에 따라 exact Dark/Light neutral primitive의 승인된
   유일한 source로 유지된다. 이 비교는 그 결정을 조용히 다시 열지 않는다.
2. Tailwind CSS는 이 비교에서 color reference가 아니다. Tailwind palette, starter
   theme 및 utility default는 NosLog Foundation value에 대한 권위가 없다.
3. 각 system은 semantic-role 수준에서 비교한다. 일반 readable content,
   lower-prominence content, interactive emphasis, disabled content, theme behavior,
   text/icon/boundary ownership 분리가 기준이다.
4. 외부 system은 role architecture를 검증하거나 반박할 수 있다. 그 값은 Spectrum
   값과 혼합할 수 없다. 다른 system의 exact mapping을 채택하려면 `FCM-12`를
   명시적으로 다시 열고 하나의 유지보수되는 system으로 source를 교체해야 한다.
5. System 간 role name을 자동으로 동일하다고 보지 않는다. 특히 Material 3의
   `tertiary`는 chromatic color-scheme role이지 neutral text 3단계가 아니다.
6. Disabled content는 재사용 가능한 low-emphasis reading color가 아니라 state로
   평가한다. 필수 정보는 disabled treatment에 의존할 수 없다.

## 조사 질문

1. 유지보수되는 system 전반에서 어떤 neutral foreground role이 수렴하는가?
2. 저명한 system이 별도의 세 번째 neutral reading level을 요구하는가?
3. Lower-prominence interactive label은 hover, pressed, selected에서 어떻게 변하는가?
4. Generic stronger neutral이 heading에 적합한가, 아니면 stronger value는 interaction
   state에 예약되는가?
5. Source를 혼합하거나 값을 발명하지 않고 NosLog가 채택할 수 있는 완전한 mapping은
   무엇인가?

## 공식 레퍼런스 매트릭스

서로 독립적인 공식 출처 16개를 검토했다. 15개는 유지보수되는 design system 또는
production design authority이고, WCAG 2.2는 평가 권위다.

|   # | 공식 system/source                                                                                                                                                                | 관찰된 foreground model                                                                                                                                                                                                                                        | NosLog에 이전할 원칙                                                                                                                                                              | 적용 한계                                                                                                                                                     |
| --: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | [Adobe Spectrum S2 color aliases](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/)                                                                        | `neutral-content` default는 `gray-800`, hover/down은 `gray-900`을 사용한다. `neutral-subdued-content`는 `gray-700`을 사용하며 hover/down/selected에서 `gray-800`로 강해진다. Disabled content는 `gray-400`을 사용한다. 모두 exact Light/Dark 값을 공개한다.    | 이미 승인된 primitive source 내부에서 완전한 semantic/value mapping을 제공한다. 새로운 gray 없이 일반 content, subdued content, interaction state 및 disabled content를 분리한다. | 별도의 세 번째 neutral reading role은 공개하지 않는다. Spectrum component alias에도 NosLog ownership rule이 필요하다.                                         |
|   2 | [IBM Carbon color tokens](https://carbondesignsystem.com/elements/color/tokens/)                                                                                                  | `text-primary`, `text-secondary`, `text-helper`, `text-disabled`가 분리된다. White theme은 각각 Gray 100 `#161616`, Gray 70 `#525252`, Gray 60 `#6f6f6f`, Gray 100 at 25%에 매핑한다.                                                                          | Primary, secondary, helper, disabled 책임을 명시적으로 둘 수 있음을 확인한다. Secondary interactive content는 hover에서 primary로 강해진다.                                       | Carbon helper 단계와 alpha-disabled recipe는 Carbon theme 소속이므로 Spectrum에 끼워 넣을 수 없다.                                                            |
|   3 | [GitHub Primer color primitives](https://www.primer.style/product/primitives/color/) 및 [theme architecture](https://www.primer.style/product/primitives/)                        | Functional foreground는 `fgColor-default`, `fgColor-muted`, `fgColor-disabled`를 제공하며 현재 Light page에서는 `#1f2328`, `#59636e`, `#818b98`로 해석된다. Light, Dark, dimmed, high-contrast, color-vision theme file에서도 같은 functional name을 유지한다. | Lean default/muted/disabled set이 큰 production service에 충분할 수 있으며 token name은 theme-invariant여야 함을 확인한다.                                                        | 공개 value page는 한 번에 active theme 하나만 보여준다. Primer 값과 추가 accessibility theme은 Spectrum-compatible input이 아니다.                            |
|   4 | [Microsoft Fluent 2 alias tokens](https://fluent2.microsoft.design/color-tokens2/)                                                                                                | Light/Dark에 대해 neutral foreground 4단계와 disabled를 공개한다. Foreground 2는 hover/pressed/selected에서 1로, foreground 3은 2로 강해진다.                                                                                                                  | Interactive hierarchy를 전역 “emphasis gray”가 아니라 semantic state alias로 encoding해야 한다는 강한 근거다.                                                                     | 4단계 hierarchy는 증명된 NosLog 필요보다 넓고 Fluent ramp를 사용한다.                                                                                         |
|   5 | [Atlassian color guidance](https://atlassian.design/foundations/color-new/)                                                                                                       | Text를 default, subtle, subtlest emphasis로 나누고 inverse 및 disabled/state token을 별도로 둔다. Semantic token은 Light/Dark theme에서 서로 다른 값에 매핑된다.                                                                                               | Low prominence가 semantic role이며 component author가 theme value를 수동 mapping하면 안 됨을 확인한다.                                                                            | Atlassian의 넓은 emphasis vocabulary와 alpha neutral은 자사 product에 최적화되어 있다. Static overview는 exact Spectrum-equivalent mapping을 제공하지 않는다. |
|   6 | [GitLab Pajamas type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/)                                                                              | 현재 role은 heading/strong, default, subtle, disabled다. 기존 secondary는 subtle로, 기존 tertiary는 disabled로 deprecated되었다. Light/Dark primitive pair를 공개한다.                                                                                         | Token name이 의미보다 오래 남을 수 있으며 세 번째 `tertiary` reading color가 자동으로 필요한 것은 아님을 보여준다. Disabled는 disabled 전용이어야 한다.                           | Pajamas는 호환성을 위해 이전 tertiary name을 disabled에 매핑한다. 이는 readable NosLog tertiary copy에 disabled color를 써도 된다는 뜻이 아니다.              |
|   7 | [Shopify Polaris color tokens](https://polaris-react.shopify.com/design/colors/color-tokens) 및 [current values](https://polaris-react.shopify.com/tokens/color)                  | Semantic text token에는 default, secondary, disabled, on-fill 및 state별 role이 있다. 현재 표는 default `#303030`, secondary `#616161`, disabled `#b5b5b5`로 해석된다.                                                                                         | Element-specific text token과 dedicated disabled value를 확인하며, 임의의 opacity disabled treatment를 금지한다.                                                                  | 현재 공개 값은 Shopify Admin의 Light scheme이며 그대로 이식 가능한 dual-appearance mapping을 이루지 않는다.                                                   |
|   8 | [PatternFly colors](https://www.patternfly.org/foundations-and-styles/colors/) 및 [token architecture](https://www.patternfly.org/foundations-and-styles/design-tokens/overview/) | Regular text, subtle text, regular icon, link 및 disabled/status content에 별도 semantic token이 있다. Palette, base, semantic token layer가 분리된다.                                                                                                         | Text/icon ownership 분리와 palette 직접 접근 대신 semantic token에 기반한 lean regular/subtle hierarchy를 지지한다.                                                               | PatternFly의 Red Hat palette와 component contract는 Spectrum primitive 결정 아래에서 후보가 아니다.                                                           |
|   9 | [Ant Design theme tokens](https://5x.ant.design/docs/react/customize-theme/)                                                                                                      | 기본 Light theme은 default `rgba(0,0,0,.88)`, secondary `.65`, tertiary `.45`, disabled/quaternary `.25`를 제공한다. 각 단계 설명을 특정 content role에 연결한다.                                                                                              | 별도의 descriptive 3단계가 numbered palette에서 추정된 것이 아니라 의도적으로 존재하는 production system 사례다.                                                                  | 합성된 Light-theme alpha 값이다. 이를 이식하면 opaque Spectrum ownership을 위반하며 여기서는 완전한 Dark/Light source도 제공하지 않는다.                      |
|  10 | [Material 3 `ColorScheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)                                                                 | `onSurface`는 surface 위의 text/icon을 소유하며 `onSurfaceVariant`는 더 낮은 emphasis의 surface content role을 제공한다. Boundary는 `outline`/`outlineVariant`를 사용한다.                                                                                     | Foreground/background pair와 content/boundary role 분리를 강화한다.                                                                                                               | Material의 `tertiary`/`onTertiary`는 chromatic scheme semantics이지 neutral text rank 3이 아니다. Dynamic scheme은 exact fixed NosLog value가 아니다.         |
|  11 | [SAP Fiori design tokens](https://experience.sap.com/fiori-design-web/design-tokens/)                                                                                             | Reference token은 직접 사용하지 않으며 안정적인 base/component token이 theme 전반에서 1:1로 매핑된다. `sapTextColor`가 high-level text authority다.                                                                                                            | Primitive, semantic role, component alias를 분리하고 theme 전반에서 안정적으로 유지해야 한다는 강한 governance 근거다.                                                            | 공개 overview는 완전한 비교 가능한 neutral foreground value table을 노출하지 않아 transplant 후보가 아니라 architecture만 검증한다.                           |
|  12 | [Elastic EUI color tokens](https://eui.elastic.co/v116.2.0/docs/getting-started/theming/tokens/colors/)                                                                           | `textHeading`, `textParagraph`, `textSubdued`, disabled text role을 분리하고 color mode가 바뀌어도 key는 유지한다. 현재 Light page에서는 `#111c2c`, `#1d2a3e`, `#516381` 및 전용 disabled token으로 해석된다.                                                  | Heading emphasis가 semantic role일 수 있으며 general palette color보다 text-specific variant를 선호해야 함을 확인한다.                                                            | EUI의 blue-influenced neutral system과 exact mode value는 Spectrum과 혼합할 수 없고, 별도 heading value는 아직 검증된 NosLog 필요가 아니다.                   |
|  13 | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)                                                                                                              | Functional Light color에는 text `#0b0c0c`와 secondary text `#484949`가 있으며 service는 local color 대신 유지보수되는 palette를 사용하도록 지시받는다.                                                                                                         | 절제된 2단계 readable text hierarchy와 upstream maintenance의 신뢰도 높은 근거다.                                                                                                 | GOV.UK는 필요한 일반 Dark appearance를 제공하지 않으므로 architecture 근거로만 쓴다.                                                                          |
|  14 | [VA Design System color tokens](https://design.va.gov/foundation/design-tokens/color)                                                                                             | Default text는 semantic `ink #1b1b1b`, `base-dark #565c65`는 secondary text/icon 용도다. 더 밝은 base step은 border와 disabled element를 담당한다. Primitive token 직접 사용을 명시적으로 금지한다.                                                            | Production government service의 semantic default/secondary ownership과 primitive 직접 사용 금지를 확인한다.                                                                       | Web system은 주로 Light이며 cool-gray USWDS-derived value는 Spectrum과 호환되지 않는다.                                                                       |
|  15 | [Salesforce Lightning styling hooks guidance](https://developer.salesforce.com/blogs/2023/06/preparing-your-app-for-the-lightning-design-system-color-update)                     | Salesforce는 시각적으로 비슷한 raw neutral 대신 context-specific semantic hook을 사용하고 contrast 수정도 중앙 hook에 반영하라고 안내한다.                                                                                                                     | Nearest-color 선택보다 semantic context를 지지하며 upstream 수정이 stable alias를 통해 전달되어야 함을 강화한다.                                                                  | 완전한 foreground mapping 채택안이 아니라 implementation governance를 검증하는 출처다.                                                                        |
|  16 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/)                                                                                                                                         | 일반 text는 `4.5:1`, large text는 `3:1`을 요구한다. Inactive control은 minimum text 및 non-text contrast 기준에서 예외다.                                                                                                                                      | 실제 text/surface pair 각각의 minimum measurement gate를 정하고 disabled content가 필수 reading을 담당할 수 없는 이유를 설명한다.                                                 | WCAG는 결과를 평가할 뿐 hierarchy, palette 또는 product role name을 선택하지 않는다.                                                                          |

## 수렴 및 차이

### 강한 수렴

1. 직접 비교 가능한 모든 production system은 component author가 raw gray를 고르게
   하지 않고 semantic token을 통해 foreground를 routing한다.
2. Default readable role과 lower-prominence readable role은 거의 보편적이다.
3. Disabled content는 별도 ownership을 갖는다. Secondary, subtle, tertiary,
   placeholder 또는 decorative copy의 동의어가 아니다.
4. Light/Dark system은 appearance에 따라 값을 바꾸면서 semantic name을 유지한다.
5. 같은 primitive로 해석되는 경우가 있어도 text, icon, boundary, surface는 별도
   token responsibility다.
6. Interactive low-prominence content는 hover, pressed, selected에서 강해지는 경우가
   일반적이다. Carbon, Fluent 2, Spectrum S2가 모두 이를 명시적으로 encoding한다.

### 중요한 차이

1. 별도의 세 번째 neutral reading level은 보편적이지 않다. Fluent와 Ant는 이를
   공개하고 Carbon에는 helper text가 있다. Spectrum, Primer, Material surface
   content, PatternFly, GOV.UK, VA는 더 lean한 general hierarchy를 사용한다. GitLab은
   이전 third-level name을 명시적으로 deprecated했다.
2. GitLab이나 Elastic은 heading emphasis에 stronger color를 쓸 수 있지만 Spectrum의
   `gray-900` alias는 interactive state로 공개되어 있다. Generic heading color로
   재사용하면 더 이상 exact Spectrum semantic adoption이 아니다.
3. Disabled recipe는 opaque value와 alpha 방식으로 갈린다. 공통 contract는 disabled
   의미이지 이식 가능한 formula가 아니다.
4. 완전한 Light/Dark mapping이 없는 system은 role architecture를 검증할 수 있지만
   승인된 NosLog source requirement를 온전히 만족할 수 없다.

## Exact Spectrum-compatible 후보

### `F-A` — 현재 Spectrum S2 foreground alias를 그대로 채택

| NosLog semantic ownership                       | Spectrum S2 alias                                                |     Light |      Dark | Contract                                                                                               |
| ----------------------------------------------- | ---------------------------------------------------------------- | --------: | --------: | ------------------------------------------------------------------------------------------------------ |
| default text 및 primary icon                    | `neutral-content-color-default` → `gray-800`                     | `#292929` | `#dbdbdb` | 별도 semantic 필요가 나중 specimen에서 증명되지 않는 한 일반 heading을 포함한 default readable content |
| subdued text 및 secondary icon                  | `neutral-subdued-content-color-default` → `gray-700`             | `#505050` | `#afafaf` | Readable metadata, label, helper copy 및 lower-prominence icon                                         |
| default interactive hover/down/focus content    | `neutral-content-color-hover/down/focus` → `gray-900`            | `#131313` | `#f2f2f2` | State alias 전용이며 global heading이나 “extra-bold text” token이 아님                                 |
| subdued interactive hover/down/selected content | `neutral-subdued-content-color-hover/down/selected` → `gray-800` | `#292929` | `#dbdbdb` | Subdued control을 일반 content 단계로 강화                                                             |
| disabled text 및 disabled icon                  | `disabled-content-color` → `gray-400`                            | `#c6c6c6` | `#444444` | 실제로 사용할 수 없고 비필수인 content 전용. 필수 instruction 또는 state explanation에는 사용 금지     |

Role 결과:

- `text-primary`와 `icon-primary`는 default-content token을 alias할 수 있다.
- `text-secondary`, `text-tertiary`, `icon-secondary`, metadata, helper alias는 처음에는
  subdued content를 공유할 수 있다. 별도 semantic name은 허용되지만, 모든 role을
  다르게 보이게 하려고 새 값을 만들지는 않는다.
- Typographic scale, weight, position, spacing, disclosure가 secondary metadata,
  tertiary metadata, helper copy의 차이를 만든다.
- 대표 content가 하나의 shared subdued value로 승인된 hierarchy를 지킬 수 없음을
  증명하면 실패를 기록하고 mapping을 다시 연다. `gray-600`을 삽입하거나 다른
  system의 3단계를 국소적으로 빌리지 않는다.
- `gray-900`은 이전 generic “emphasized/heading” 제안에서 제거하고 published Spectrum
  interactive alias가 state를 소유하는 경우에만 유지한다.

### `F-B` — 전체 neutral source를 다른 system으로 교체

Carbon, Fluent 2, GitLab, Primer 또는 다른 유지보수되는 system은 `FCM-12`를 다시
여는 경우에만 intact replacement로 평가할 수 있다. 이 경우 Spectrum surface와 값을
혼합하지 않고 primitive value와 semantic alias를 함께 교체한다.

검토한 근거 어디에서도 현재 승인 source를 다시 열 만큼 Spectrum S2의 실패가
확인되지 않았다. 따라서 다음 specimen에는 `F-B`를 권장하지 않는다.

## 승인된 `M-A` Surface와의 측정 호환성

Exact sRGB contrast를 Light/Dark `canvas`, `surface`, `sunken`, `raised`, opaque
`overlay`에 대해 계산했다. Scrim 위에 직접 놓인 text는 유효하지 않으므로 제외했다.

| Spectrum content value       | Minimum Light | Minimum Dark | 결과                                                                              |
| ---------------------------- | ------------: | -----------: | --------------------------------------------------------------------------------- |
| `gray-900` interactive state |     `15.30:1` |    `14.21:1` | 강한 readable state color                                                         |
| `gray-800` default           |     `11.98:1` |    `11.49:1` | 강한 default reading contrast                                                     |
| `gray-700` subdued           |      `6.64:1` |     `7.25:1` | 모든 `M-A` surface에서 normal-text 기준 통과                                      |
| `gray-600` unowned candidate |      `4.02:1` |     `4.61:1` | Light `sunken`의 normal text에 실패하며 universal third reading level로 사용 불가 |
| `gray-400` disabled          |      `1.41:1` |     `1.63:1` | Disabled/nonessential content 전용                                                |

Contrast 충족만으로 hierarchy가 승인되지는 않는다. Alias는 content의 semantic
responsibility와 실제 component state에도 맞아야 한다.

## 사용자 검토 권고

`F-A`를 아직 승인하지 않고 dedicated foreground specimen으로 진행할 것을 권고한다.

근거:

1. 승인된 Spectrum primitive source와 local palette를 합성하지 않고 저명하고
   유지보수되는 design system을 채택한다는 목표를 모두 보존하는 유일한 완전한 exact
   Light/Dark mapping이다.
2. 폭넓은 비교가 default/subdued/disabled 구조와 interaction-state 강화 pattern을
   지지한다.
3. 검증되지 않은 local interpretation을 확장하지 않고 이전 generic `gray-900`
   emphasis 제안을 수정한다.
4. Token name을 채우기 위해 세 번째 gray를 발명하지 않는다. 별도의 세 번째 readable
   value는 실제 NosLog content가 실패를 입증하고 사용자가 mapping 재검토를 승인한
   뒤에만 사용할 수 있다.

이 권고는 다음 guide specimen을 만들고 측정할 권한만 제안한다. `C5M-04`나
production token 승인이 아니다.

## 필수 Foreground Specimen Gate

`C5M-04`를 승인하기 전에 specimen은 다음을 보여야 한다.

1. Light/Dark의 모든 실제 `M-A` surface 위에서 default, subdued, disabled text와
   primary/secondary/disabled icon;
2. Color를 유일한 state cue로 쓰지 않으면서 rest, hover, pressed, focus, selected를
   거치는 default 및 subdued interactive label;
3. 실제 NosLog content를 사용한 heading, body copy, metadata, helper copy, timestamp,
   score/rank numeral, table header, empty/error copy 및 unavailable control;
4. 긴 mixed-script title과 긴 이름을 포함한 한국어, 일본어, 영어;
5. `320px`, `390px`, 관련 intermediate width, desktop density 및 200% zoom;
6. Forced-colors/high-contrast behavior와 keyboard focus ownership;
7. 필수 정보가 disabled content를 사용하지 않고 어떤 content도 scrim 위에 직접 놓이지
   않는다는 명시적 확인;
8. Nominal canvas contrast 하나가 아닌 실제 foreground/surface pair 각각의 measured
   adjacency table.

실패가 발생하면 deviation을 제안하기 전에 기록해야 한다. 첫 correction path는 local
gray 교체가 아니라 semantic ownership, typography, placement 또는 component
composition이다.

## 의사결정 로그

| ID       | 항목                                                                                                                                                      | 상태                               |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `C5F-01` | Tailwind palette/default-theme value를 C5 foreground design authority 밖으로 둔다.                                                                        | `Approved governance — 2026-08-08` |
| `C5F-02` | 16-source 비교는 raw gray 선택 대신 semantic default, lower-prominence, disabled ownership에 수렴한다.                                                    | `Observed`                         |
| `C5F-03` | 별도의 세 번째 neutral reading value는 cross-system requirement가 아니다.                                                                                 | `Observed`                         |
| `C5F-04` | Spectrum `gray-900`은 interactive content-state alias이며 generic heading/emphasis token의 근거가 아니다.                                                 | `Observed correction`              |
| `C5F-05` | 현재 Spectrum S2 foreground alias를 `F-A`로 그대로 사용하고 secondary와 tertiary semantic alias는 처음에 subdued content를 공유한다.                      | `Proposed — 사용자 검토 필요`      |
| `C5F-06` | `gray-600`은 Light `sunken`의 normal-text contrast에 실패하고 현재 Spectrum content alias ownership도 없으므로 universal tertiary text에 사용하지 않는다. | `Proposed — 사용자 검토 필요`      |
| `C5F-07` | 측정된 NosLog content가 material Spectrum failure를 확립할 때만 `FCM-12`를 다시 연다. 다른 system은 source와 혼합하지 않고 교체해야 한다.                 | `Proposed governance`              |
| `C5F-08` | `C5M-04` 결정 전에 필수 foreground specimen 및 adjacency record를 만든다.                                                                                 | `문서 37의 초기 근거`              |
