# NosLog 2.0 Foundation Typography 및 Layout Candidate

## 문서 관리

- 상태: `진행 중 — 하위·상위 Type scale, 하위 Line-height, Weight 및 Tracking 축 승인, 나머지 Composite·Layout 값 미확정`
- 조사일: 2026-08-04
- 마지막 결정 갱신일: 2026-08-04
- 원본 언어: 영어
- 영어 원본:
  [26-foundation-typography-layout-candidates.md](./26-foundation-typography-layout-candidates.md)
- 범위: NosLog 2.0 Foundation v0.1의 Batch B 물리 Typography, Metric
  typography, Spacing, Grid, Container, Density 및 Target geometry candidate
- 입력: 승인된 문서 `01`–`25`, 현재 저장소 Typography 근거, 유지 관리되는
  Design system과 Standard, Rhythm-game domain product 및 2026-08-04의 명시적
  사용자 승인
- 이번 결정에서 제외: 상위 Line-height 및 반응형 동작, 승인된 Size·Weight 사용
  경계를 넘어서는 Role-to-step 배정, Metric-display Composite, Spacing, Grid,
  Container, Component 치수, Color, Material treatment, 최종 Figma style,
  Production screen 및 Application 구현

이 문서는 Batch B에서 결정한 제한된 항목을 기록합니다. Decision log 항목이
`Approved`인 경우에만 해당 값이 권위 있는 요구사항이 됩니다. 미확정 값, 외부
Reference 값 및 현재 Code 값은 NosLog 요구사항이 아니라 근거로 남습니다.

## 관련 문서

- [Foundation v0.1 조사 브리프](./24-foundation-v0.1-research-brief.ko.md)
- [Foundation Semantic role map](./25-foundation-semantic-role-map.ko.md)
- [Cross-cutting Reference Matrix](./22-cross-cutting-reference-matrix.ko.md)
- [Specialized pattern 및 예외 Register](./23-specialized-pattern-exception-register.ko.md)
- [공유 Discovery 페이지 브리프](./04-shared-discovery-page-brief.ko.md)
- [Music Detail 페이지 브리프](./05-music-detail-page-brief.ko.md)
- [Global Rankings 페이지 브리프](./08-global-rankings-page-brief.ko.md)

## 승인 방식

- 제한된 Material decision을 한 번에 하나씩 조사하고 논의합니다.
- 관찰 사실과 제안 및 승인된 요구사항을 구분하여 기록합니다.
- 물리 Size, 하위 Line-height, Weight 및 Tracking 축 승인에서 상위 Line-height,
  반응형 동작, Metric composite, 정확한 Composite-role mapping 또는 Layout 승인을
  추론하지 않습니다.
- 향후 Composite style은 Foundation v0.1 승격 전에 승인된 `S1`–`S6` 다국어
  및 반응형 Specimen으로 검증합니다.
- 영어 원본과 한국어 Companion을 같은 작업에서 갱신합니다.

## 현재 NosLog 근거

현재 Application은 기능 및 사용성 Baseline이며 미래 시각 권위가 아닙니다.
현재 Utility는 Batch B가 방지해야 하는 Typography 분산을 보여줍니다.

| 현재 Utility      | 현재 값                              | 관찰된 사용 횟수 | 해석                                                                             |
| ----------------- | ------------------------------------ | ---------------: | -------------------------------------------------------------------------------- |
| `text-body`       | `14px`, 여유 있는 행간, Medium 굵기  |               41 | 승인된 Body token이 아니라 다시 검증할 현재 값                                   |
| `text-body-muted` | `14px`, 여유 있는 행간, Regular 굵기 |               60 | 현재 Color와 Role이 결합되어 있으며 분리해야 함                                  |
| `text-caption`    | `12px`                               |              294 | 작은 Supporting type이 이미 광범위하므로 승인된 `metadata`로 자동 승격할 수 없음 |
| `text-micro`      | `10px`                               |               95 | 승인된 공용 사용자 표시용 하한과 충돌하며 기본 후속 Role이 없음                  |
| `text-label`      | `14px`                               |               71 | Compact control candidate를 지지하지만 굵기나 행간을 승인하지 않음               |
| `text-input`      | `16px`                               |               32 | 읽을 수 있는 Input content를 지지하지만 모든 Control label을 결정하지 않음       |

핵심 문제는 `14px`의 존재가 아닙니다. Tiny text의 광범위한 사용과 Reading,
Compact interface 및 Tertiary supporting content 사이의 강제 가능한 경계가
없다는 점입니다.

`app/admin/**`을 제외한 사용자용 Source를 조사한 결과 `font-semibold`는
`153`회, `font-bold`는 `102`회, `font-extrabold`는 `12`회, `font-black`은
`7`회인 반면 `font-normal`은 `6`회, `font-medium`은 `4`회였습니다. 이는 실제
Rendered element 수가 아니라 Raw utility 등장 횟수이지만, 현재는 강조 굵기가
사실상 기본값이 되었음을 보여줍니다. 승인된 2.0 Weight vocabulary는 현재 사용
비율을 유지하지 말고 이 Hierarchy를 뒤집어야 합니다.

같은 사용자용 Source 조사에서 명시적 Tracking utility는 Header wordmark의
`tracking-normal`과 회전된 `10px` Bingo-board 장식의 `tracking-wide` 두 개만
확인됐습니다. 후자는 장식용이고 승인된 Type 하한보다도 작으므로 공유 Positive
tracking token의 근거가 될 수 없습니다. 따라서 현재 Application에는 보존해야
할 안정적인 Role-level tracking system이 없습니다.

## 집중 조사 수렴점

하위 Core 결정은 독립된 Standard, 유지 관리되는 System, Production reference
및 Domain product 15개 이상을 비교했습니다. 정확한 값은 Task와 Platform에
따라 다르지만 다음 Pattern은 안정적으로 수렴합니다.

| 근거 그룹                                                                                                                                            | 전이 가능한 발견                                                                                                   | NosLog 적용                                                        | 한계                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                                                                             | 기본 Component body는 `14/20`, Long-form body는 `16/24`, Small body는 제한적으로 쓰는 `12/16`임                    | Reading, Compact UI 및 Supporting step 구분을 지지함               | Atlassian density와 Font metric은 NosLog 값이 아님              |
| [Carbon Type set](https://carbondesignsystem.com/elements/typography/type-sets/)                                                                     | Productive UI는 `14px` Base, Expressive reading은 `16px`, `12px`는 Label과 Helper text로 제한됨                    | 하나의 Universal base가 아닌 Semantic hybrid를 지지함              | IBM의 Dual-set 구현은 NosLog Template가 아님                    |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                                                                   | Platform ramp가 Semantic hierarchy를 유지하고 Mobile body style을 Web product text보다 작게 압축하지 않음          | Mobile 전용 Type 축소 회피를 지지함                                | Native point는 CSS pixel에 직접 대응하지 않음                   |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)                                                            | Composite semantic style과 Relative unit이 임의 Local styling을 방지함                                             | Role 기반 Authoring과 이후 `rem` Mapping을 지지함                  | NosLog 값을 선택하지 않음                                       |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                                                                          | 대부분의 Running text는 유효 크기 최소 `16px`를 사용하며 작은 Text는 특수한 짧은 용도로 제한함                     | 읽기 쉬운 일반 Body와 제한된 Support type을 지지함                 | Government reading 기본값은 고밀도 Ranking보다 여유로움         |
| [GOV.UK Type scale](https://design-system.service.gov.uk/styles/type-scale/)                                                                         | 절제되고 읽기 쉬운 Body style은 Compact microcopy가 아니라 `19px`와 `16px`를 사용함                                | 일반 Reading을 하한에 정상화하지 않아야 함을 확인함                | Public-service content는 고밀도 Music archive가 아님            |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                                                                | Product base는 `14px`이며 Display 외 System은 선택한 물리 Scale을 약 3~5개로 절제해야 함                           | 작은 공유 Physical core를 지지함                                   | 정확한 Logarithmic ramp는 선택하지 않음                         |
| [GitLab Type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/)                                                         | `12px`는 Meta/Small-label, `14px`는 Body 및 Input-label이고 더 큰 Role은 관리된 Step을 사용함                      | 제한된 하한과 Compact product step을 지지함                        | GitLab에는 NosLog가 선택하지 않은 `13px` Step이 있음            |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                                                                      | `14px`는 기본 Control 크기, `12px`는 예외적 Small text, `16px`는 읽기 쉬운 Large text임                            | `12px`를 기본으로 삼지 않으면서 Compact control을 지원함           | Enterprise control과 전용 Font가 다름                           |
| [Adobe Spectrum Typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/)                                               | CJK Body 크기는 Mobile에서 작아지는 대신 커짐                                                                      | Width 전반에서 하위 Core를 유지하고 CJK 가독성을 시험하도록 지지함 | Spectrum Mobile scale은 NosLog Specimen 없이 복사하기에 너무 큼 |
| [Shopify Polaris Typography token](https://polaris-react.shopify.com/design/typography/typography-tokens)                                            | Primitive size가 Semantic text token으로 구성됨                                                                    | 승인된 12개 Role 뒤에 제한된 Physical scale을 두는 구조를 지지함   | Commerce semantic은 NosLog Role mapping을 결정하지 않음         |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                                                         | 읽기 쉬운 Text, 절제된 굵기, 확장 가능한 Hierarchy 및 적은 Typeface가 모든 항목을 작은 크기에 맞추는 것보다 중요함 | 읽기 쉬운 Body와 Mobile 축소 금지를 지지함                         | Native point-size 지침은 Web에 방향성 근거로만 사용함           |
| [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) 및 [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Text는 `200%` 확대를 견디고 필수 Content는 `320 CSS px`에서 Reflow해야 함                                          | Type 축소가 아니라 반응형 Composition을 Fit 전략으로 만듦          | WCAG는 숫자 최소값을 규정하지 않음                              |
| [Tailwind Font size](https://tailwindcss.com/docs/font-size)                                                                                         | 현재 Stack은 이미 `12`, `14`, `16px` 상대 구현 Step을 제공함                                                       | 이후 구현 Mapping을 단순화함                                       | Tailwind 기본값은 Design 근거가 아니라 구현 편의임              |
| [Pretendard](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md)                                              | Pretendard JP는 승인된 다국어 Family를 제공하며 실제 혼합 문자 Content로 시험해야 함                               | 하나의 Family 안에서 하위 Core를 유지함                            | Project 설명은 NosLog Browser 검증을 대체하지 않음              |
| [osu! Beatmap listing](https://osu.ppy.sh/beatmapsets) 및 [V-ARCHIVE](https://v-archive.net/)                                                        | Rhythm-game Discovery 및 Record product는 Compact identity, Difficulty 및 Metric layer가 필요함                    | 읽기 쉬운 Body와 함께 Compact product step이 필요함을 확인함       | 공개 Token이 없어 시각 값은 복사하지 않음                       |

출처가 `14px`과 `16px` 사이에서 다른 이유는 Task가 다르기 때문입니다. 고밀도
Product control은 보통 `14px`, 실제 Reading은 보통 `16px` 이상을 사용하고,
`12px`는 일관되게 Supporting 또는 예외 역할입니다. 이 차이는 하나의 Universal
base가 아니라 Semantic 3단계 하위 Core를 지지합니다.

## 승인된 하위 Type Core

### 물리 Step

승인된 하위 물리 Size core는 다음과 같습니다.

| Step                            | 승인된 경계                                                                                                                   | 아직 승인하지 않은 내용                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `12px`(기본 Root에서 `0.75rem`) | 공용 사용자 표시용 최하위 Step이며 짧고 실제로 Tertiary인 Metadata, Caption 또는 동등한 Supporting content에만 사용할 수 있음 | `metadata` 또는 `entity-companion` Role에 자동 배정하지 않으며 행간, 굵기 및 Tracking은 미확정 |
| `14px`(`0.875rem`)              | Specimen에서 가독성이 확인된 Control, 고밀도 Result와 Row 및 대부분의 Secondary information을 위한 Compact product-UI Step    | Universal body 크기가 아니며 아직 어떤 Role mapping도 자동으로 승인하지 않음                   |
| `16px`(`1rem`)                  | 일반 Reading/Body Step이며 공유 하위 Core의 상위 Step                                                                         | 모든 Entity title, Control, Ranking row 또는 Metric에 `16px`를 강제하지 않음                   |

### 사용 제약

- 일반 공용 HTML 사용자 표시용 Typography는 `12px` 미만으로 결정할 수
  없습니다.
- `12px`가 Primary action, Primary search result identity, 필수 Comparison
  value 또는 긴 설명 Copy를 담당하면 안 됩니다.
- Semantic role의 일반 이름이 작아 보인다는 이유로 Step을 자동 상속하지
  않습니다. `metadata`와 `entity-companion`은 중요도, 언어 또는 Composition이
  요구하면 `12px`보다 크게 결정될 수 있습니다.
- `14px`는 Compact product step이며 모든 Body copy를 압축할 권한이 아닙니다.
- `16px`는 일반 Reading step이며 모든 고밀도 Row를 확대할 권한이 아닙니다.
- `12/14/16px` 하위 Core는 Compact 및 Wide viewport에서 숫자상 안정적으로
  유지합니다. 단순히 Fit을 위해 Mobile이나 Desktop에서 Role 크기를 줄이면
  안 됩니다.
- 향후 반응형 변화는 별도 논의와 Specimen 검증을 거친 승인된 상위 Title 또는
  Display role에만 적용할 수 있습니다.
- Production 구현은 Relative unit을 사용하고 Browser text scaling을
  보존해야 합니다. 위 `rem` Mapping은 기본 `16px` Root를 전제로 하며 Root
  크기를 줄여 우회하면 안 됩니다.
- Canvas와 WebGL text는 계속 문서 `23`의 명시적 예외 절차를 따라야 합니다.
  이번 하위 Core 결정은 Renderer 자동 예외를 만들지 않습니다.

### 승인된 하위 Line-height 축

승인된 하위 Line-height primitive와 기본 Pairing은 다음과 같습니다.

| Font size | 기본 Line height   | 상대 Pairing | 의도한 경계                                                        |
| --------- | ------------------ | ------------ | ------------------------------------------------------------------ |
| `12px`    | `16px` (`1rem`)    | `12/16`      | 짧고 실제로 Tertiary인 Supporting text에만 사용                    |
| `14px`    | `20px` (`1.25rem`) | `14/20`      | Compact product UI, Control, 고밀도 Result 및 짧은 Supporting copy |
| `16px`    | `24px` (`1.5rem`)  | `16/24`      | 일반 Body, Wrapping 설명 및 Reading text                           |

따라서 공유 하위 Line-height primitive 축은 `16/20/24px`입니다. 위 Pairing은
기본 Composite 하위 Style이며, Local에서 임의의 Font-size와 Line-height 조합을
선택할 수 있다는 뜻이 아닙니다.

#### Line-height 제약

- `12/16`과 `14/20`을 긴 Reading text에 사용하면 안 됩니다. 일반적인 여러 줄
  Body copy는 `16/24`를 기본으로 합니다.
- Component target height는 Line height로 결정하지 않습니다. Button, Input,
  Row 및 다른 Control은 Text leading을 압축하지 않고 나중에 승인할 Container
  size와 Padding을 통해 Target geometry를 충족해야 합니다.
- Local component를 더 조밀하게 만들기 위해 `18px`, `21px` 또는 `22px`
  Line-height primitive를 추가하면 안 됩니다. 추후 Compact heading이나 Metric
  style은 먼저 승인된 `16px`, `20px`, `24px` Line height가 해당 Semantic role을
  담당할 수 있는지 시험해야 하며, 새 Primitive에는 문서화된 예외와 사용자
  승인이 필요합니다.
- 이 값은 Compact 및 Wide viewport에서 안정적으로 유지합니다. 반응형 Fit은
  Mobile 전용 Leading 압축이 아니라 Reflow, Hierarchy 및 Content behavior로
  해결합니다.
- WCAG Text Spacing override 시험에서 사용자가 Line spacing을 Font size의 최소
  `1.5`배로 늘려도 Content와 기능이 유지되는지 확인해야 합니다. 작성된
  `12/16`과 `14/20` Style도 이 요구를 면제받지 않습니다.
- Pretendard JP를 사용한 한국어, 일본어, 영어, 혼합 Script, 긴 제목 및 Wrapping
  Body specimen에서 `390px`, `320 CSS px`까지의 폭, 대표 Wide width로 이
  Pairing을 검증해야 합니다. 실패하면 문서화되지 않은 Local value를 추가하지
  말고 Foundation v0.1 승격 전에 이번 결정을 Supersede해야 합니다.

### 승인된 공유 Weight vocabulary

승인된 공유 Weight primitive는 다음과 같습니다.

| Token      | 숫자 값 | 사용 경계                                                                                       |
| ---------- | ------- | ----------------------------------------------------------------------------------------------- |
| `regular`  | `400`   | Body, 설명, Metadata 및 기타 일반 Reading 또는 Supporting content의 기본값                      |
| `medium`   | `500`   | 추후 Composite role에서 승인된 Interactive label, Input 및 Control text, Interface icon 옆 Text |
| `semibold` | `600`   | Entity identity, Section title, Compact heading 및 통제된 Strong emphasis                       |
| `bold`     | `700`   | Page title, 주요 Metric 및 드문 최상위 강조에만 사용                                            |

#### Weight 제약

- 공유 사용자 표시용 Typography는 `100`–`300` 또는 `800`–`900`을 사용하면
  안 됩니다.
- Pretendard JP의 Variable-font 지원은 `450`, `550`, `650` 같은 임의 중간값을
  허용하지 않습니다. 공유 Style에는 승인된 네 Named primitive만 사용할 수
  있습니다.
- System 전체의 예상 사용 빈도는 `regular > medium > semibold > bold`입니다.
  이는 고정 Quota가 아닌 Hierarchy 규칙이며 각 Component마다 독립적으로
  강제하지 않고 대표 Page family 전체에서 검사해야 합니다.
- 일반 Button, Card, Row, Badge 및 Label을 기본적으로 Bold 처리하면 안 됩니다.
- Weight만으로 선택, Interactivity, Success, Warning, Danger, Disabled state
  또는 Heading semantics를 전달하면 안 됩니다. Structure, Size, Position,
  Text, Accessible semantics 및 추후 승인할 Color 또는 Shape cue가 완전한 의미를
  함께 전달해야 합니다.
- Weight 값은 Compact 및 Wide viewport에서 안정적으로 유지합니다. 반응형 Fit을
  위해 Text를 더 가볍거나 무겁게 만들면 안 됩니다.
- 열두 Semantic role 각각의 정확한 Weight 배정은 Composite style 검토 전까지
  미확정입니다. 위 경계는 오용을 막지만 모든 Entity title을 `600`, 모든 Page
  title을 `700`으로 자동 지정하지 않습니다.
- Pretendard JP와 모든 Production fallback은 한국어, 일본어, 영어, 혼합 Script,
  숫자, Small size, Dark surface 및 Bold Text 또는 동등한 Accessibility 동작으로
  검증해야 합니다. Browser가 합성한 Weight가 승인된 전달 Face를 조용히
  대체하면 안 됩니다.

## 승인된 공용 Tracking 동작

### Tracking 집중 조사

Tracking 검토에서는 Typeface 지침, 접근성·CSS 표준, CJK 조판 요구사항, 유지
관리되는 Design system, 구현 Utility 및 현재 NosLog 근거를 비교했습니다.
Generic tight/wide scale을 가져오는 방향은 지지되지 않습니다.

| 독립 출처                                                                                                    | 전이 가능한 발견                                                                                                | NosLog 적용                                                                               | 한계                                                                           |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Pretendard](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/docs/en/README.md)      | 이 Family는 추가 Scaling, Letter-spacing 또는 Optical adjustment 없이 가독성을 확보하도록 명시적으로 설계됨     | 승인된 Family가 피하도록 설계된 문제를 다시 보정하지 않고 Typeface의 자연 간격에서 시작함 | Production delivery와 Fallback은 여전히 Specimen 검증이 필요함                 |
| [W3C CSS Fonts 4](https://www.w3.org/TR/css-fonts-4/#font-kerning-prop)                                      | Kerning은 Typeface-aware glyph-pair 조정이며 명시적 Letter spacing은 Kerning 뒤에 추가됨                        | 올바른 Kerning을 보존하고 Generic tracking 값과 혼동하지 않음                             | 명세는 동작을 정의하지만 NosLog Art direction은 선택하지 않음                  |
| [W3C WCAG 2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)                   | 사용자가 Letter spacing을 최소 `0.12em`까지 늘려도 Content나 기능을 잃지 않아야 함                              | 모든 Composite style과 Component가 사용자 Spacing override를 견뎌야 함                    | 작성 기본값이 아니라 Override 허용 요구사항임                                  |
| [W3C KLReq](https://www.w3.org/TR/klreq/)                                                                    | 한글 조판에는 언어별 Character-frame 및 Inter-character 동작이 있음                                             | Latin에서 유래한 Wide/Tight 보정을 적용하지 않고 실제 한국어·혼합 Script content를 검증함 | Product token이 아니라 조판 요구사항을 설명함                                  |
| [W3C JLReq](https://www.w3.org/TR/jlreq/)                                                                    | 일본어 간격은 Character class, 문장부호, Line adjustment 및 일본어·서구 문자 전환에 따라 달라짐                 | 하나의 수제 Tracking 보정은 일본어 Layout 동작을 대체하기에 지나치게 거침                 | Print와 세로쓰기 요구는 관련 부분만 전이함                                     |
| [W3C CSS Text 4](https://www.w3.org/TR/css-text-4/)                                                          | Script-aware Inter-script, 문장부호 및 Justification 동작은 작성자가 적용하는 Tracking과 별개임                 | Script layout을 Letter spacing으로 흉내 내지 않고 표준과 Font에 맡김                      | 일부 새 Property는 아직 Browser 지원이 고르지 않음                             |
| [MDN `letter-spacing`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/letter-spacing) | Tracking은 자연 간격에 추가되고 가독성은 Font별로 다르며 큰 양수·음수 값은 Text를 읽지 못하게 할 수 있음        | Pretendard JP, Fallback, Size 및 Script 전체에 안전한 Universal correction 값은 없음      | CSS 동작을 설명하지만 Product style을 선택하지 않음                            |
| [Carbon Type set](https://carbondesignsystem.com/elements/typography/type-sets/)                             | Carbon은 `.32px`, `.16px`, `0px`처럼 Role과 IBM Plex에 결합된 값을 사용함                                       | 관리된 Tracking은 타당할 수 있지만 Carbon 값을 Font 및 Composite style에서 분리할 수 없음 | IBM Plex metric과 Dual type set은 NosLog와 다름                                |
| [Material 3 in Compose](https://developer.android.com/develop/ui/compose/designsystems/material3)            | Material은 Roboto 전용 Type-scale role마다 다른 Tracking을 사용함                                               | Nonzero tracking은 Universal product utility가 아니라 시험된 Font/Style composite에 속함  | Android `sp`와 Roboto 값은 Pretendard JP Web UI로 전이할 수 없음               |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                 | System이 Point size별 Tracking을 동적으로 조정하며 해당 System-font metric을 Mockup에서 재현할 때만 보정을 권함 | SF Pro의 Optical-size table을 Custom web family로 복사하지 않음                           | Native system-font 동작은 Pretendard JP token 출처가 아님                      |
| [USWDS Letterspacing](https://designsystem.digital.gov/design-tokens/typesetting/letterspacing/)             | USWDS는 제한된 음수·양수 값을 제공하고 Typography 지침은 더 큰 Text에 Tight spacing을 제한적으로 사용함         | 관리된 Scale의 타당성은 보여주지만 NosLog Foundation v0.1의 필요성은 입증하지 않음        | Government display typography와 Font가 다름                                    |
| [Adobe Spectrum Typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/)       | Spectrum은 Font·Role·Script-aware Composite typography data 안에 Tracking을 포함함                              | Tracking을 전체 Pretendard JP composite 일부로만 시험해야 함을 뒷받침함                   | Adobe Clean 및 CJK system은 NosLog Family가 아님                               |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                                     | 공개 Product style은 Local tracking 선택을 허용하기보다 최적화된 Semantic composite를 노출함                    | 작성자가 승인된 Composite role을 사용하게 하고 Page-level tuning을 피함                   | 공개 개요에는 직접 전이할 Tracking 값이 없음                                   |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)                    | Primer는 Opinionated semantic shorthand style을 권장하고 Local property로 Typography를 재구성하는 것을 피함     | Raw tracking utility 대신 하나의 관리되는 Default를 지지함                                | GitHub Font stack과 Content가 다름                                             |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                        | Ant의 공개 Foundation은 Family, Base size, Scale/Line height, Weight 및 Color를 중심으로 절제를 강조함          | Typography system을 완성하기 위해 Tracking이 반드시 필요한 것은 아님                      | 개요의 생략이 어떤 Component도 간격을 조정하지 않는다는 증거는 아님            |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                              | SAP는 Font glyph design과 호환 Metric으로 가독성과 Fit을 해결함                                                 | 일상적 수동 보정보다 승인된 Family metric을 우선함                                        | SAP 72와 Enterprise control은 다름                                             |
| [Tailwind Letter spacing](https://tailwindcss.com/docs/letter-spacing)                                       | Stack은 구현 기능으로 Tight, Normal, Wide 및 임의 Utility를 제공함                                              | 사용 가능한 Utility를 승인된 NosLog Design token으로 오해하면 안 됨                       | Tailwind는 값을 적용하는 법을 설명하지만 NosLog가 필요로 하는 때는 정하지 않음 |
| 현재 NosLog Source                                                                                           | 사용자용 Source에는 일반 `tracking-normal` 한 번과 장식용 `tracking-wide` 한 번만 존재함                        | 여러 공용 Tracking primitive를 요구하는 일관된 현재 System이나 Migration 의존성이 없음    | 정적 Source 등장은 Rendered-element 수가 아님                                  |

수렴하는 원칙은 Tracking이 언제나 무의미하다는 것이 아닙니다. Tracking은 Font,
Size, Role 및 때로 Script에 종속됩니다. Pretendard JP 자체의 설계 설명은 Foundation
v0.1에서 보정을 추가할 가장 강한 이유를 없애고, NosLog의 3개 언어와 혼합 Script
요구는 보정의 비용과 위험을 높입니다.

### 후보 비교

| 후보                                                     | 이점                                                                                             | 비용과 위험                                                                                                           | 추천                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `A` — 모든 공용 UI Role에 자연/기본 간격 사용            | 가장 작은 Rule set이며 Pretendard JP metric을 존중하고 한국어·일본어·영어·혼합 Text에서 안정적임 | Hierarchy를 장식적 Tight/Wide가 아니라 승인된 Size, Weight, Color 및 Composition으로 만들어야 함                      | `Approved`                 |
| `B` — 공용 Compact/Default/Wide Tracking primitive       | Title, Body 및 Small label 사이에 추가 대비를 만들 수 있음                                       | Specimen이 필요를 증명하기 전에 값을 추가하고 다른 Font의 Carbon/Material 선택을 반복하며 Local utility 사용을 부추김 | `v0.1에서는 추천하지 않음` |
| `C` — 한국어·일본어·영어·혼합 Script에 서로 다른 값 사용 | 이론상 각 Script를 세밀하게 조정할 수 있음                                                       | 줄바꿈과 Localization layout을 불안정하게 만들고 QA를 늘리며 Script-aware Typography를 광범위한 Tracking으로 대체함   | `초기 전략으로 거부`       |

### 후보 A의 승인된 제약

- 공유 HTML UI Role은 Typeface의 자연 간격을 사용합니다. Figma specimen은 추가
  Tracking `0%`, Production CSS는 Positive 또는 Negative design token 대신
  `letter-spacing: normal`을 사용합니다.
- `font-kerning: normal`로 올바른 Pair kerning을 유지합니다. 추가 Tracking이 0인
  상태를 Kerning 또는 OpenType 언어 동작을 끄는 방식으로 구현하면 안 됩니다.
- Page 또는 Component 작성자에게 공유 `tight`, `wide` 또는 임의 Tracking
  primitive를 노출하지 않습니다. 일반 공유 UI에서 `tracking-tight`,
  `tracking-wide`, `-0.01em`, `0.02em` 같은 Local utility 사용을 금지합니다.
- Compact/Wide viewport와 한국어·일본어·영어·혼합 Script·숫자 Content 전반에서
  이 규칙을 안정적으로 유지합니다. 한 줄에 맞추기 위해 Tracking을 바꾸지
  않습니다.
- `NOSTALGIA` 같은 공식 대문자 Content는 올바른 명칭이므로 대문자로 유지하지만
  자동 추가 Tracking을 적용하지 않고 CSS `text-transform`으로 만들지 않습니다.
- Wordmark artwork, 미래의 드문 Display treatment, Canvas/WebGL renderer text
  또는 입증된 Fallback-font mismatch는 명시적으로 문서화된 예외를 요청할 수
  있습니다. 이 결정으로 승인되는 예외는 없으며 예외에는 다국어 Specimen과
  사용자 승인이 필요합니다.
- 사용자 Style이 WCAG 2.2 Text Spacing에 따라 Letter spacing을 최소 `0.12em`로
  늘려도 Component의 Content와 Operation을 모두 유지해야 합니다. 이 Override를
  `!important`로 막으면 안 됩니다.
- Pretendard JP와 승인된 Fallback stack은 `320px`, `390px`, 중간 Width 및 Wide
  viewport에서 계속 비교해야 합니다. 자연 간격이 검증된 Composite role에서
  실패하면 문서화되지 않은 Local correction을 추가하지 않고 해당 Role을 다시
  논의합니다.

### 대표 Specimen에 대한 영향

- `S1` Music discovery는 Control과 고밀도 Supporting row에 Compact step을
  사용하면서 실제 설명에는 읽기 쉬운 Step을 유지할 수 있습니다. 정확한 Title
  및 Companion-title mapping은 열어 둡니다.
- `S2` Music Detail은 읽기 쉬운 Body를 유지하면서 모든 Judgement, Difficulty
  및 History row를 같은 크기로 강제하지 않을 수 있습니다.
- `S3` Global Rankings는 `10px` Microcopy로 돌아가지 않고 Composition과
  Compact product step을 통해 Density를 유지할 수 있습니다.

이는 시험할 결과이며 최종 Role assignment나 Page layout이 아닙니다.

## 승인된 상위 Type scale

### 상위 Scale 집중 조사

이번 검토에서는 유지 관리되는 독립 System 및 표준 15개와 현재 NosLog Code
근거를 비교했습니다. 어떤 System이 제공하는 가장 큰 Scale도 요구사항으로
간주하지 않았습니다. 대신 일반 Product heading, Page identity, 강한 Metric 또는
Title, 실제로 드문 Display moment를 구분하면서 Local size 분산을 다시 만들지
않는 최소 집합이 무엇인지 비교했습니다.

| 독립 출처                                                                                                                                            | 전이 가능한 발견                                                                                                                                 | NosLog 적용                                                                           | 한계                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Atlassian App type scale](https://atlassian.design/foundations/typography/product-typefaces-and-scale)                                              | 4의 배수로 반올림한 Minor-third ramp를 사용하고 일반 상위 Product role은 `20px`, `24px` 부근에, 더 큰 Title은 그 위에 둠                         | 일회성 값이 아니라 4 단위에 맞춘 절제된 Product ramp를 지지함                         | Atlassian Font metric과 Role name은 NosLog 값이 아님             |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                                                                   | Web role이 훨씬 큰 Display 전까지 `20`, `24`, `28`, `32`, `40px` 순으로 진행됨                                                                   | Compact title, Page title, Dominant title, 드문 Large title의 기능 구간을 확인함      | NosLog에는 Fluent의 모든 중간 Step이 필요하지 않음               |
| [Primer Typography](https://primer.style/product/primitives/typography/)                                                                             | 현재 Product composite가 `20px` Title medium, `32px` Title large, `40px` Display를 사용함                                                        | 인접한 상위 Size를 생략해도 Product hierarchy를 유지할 수 있음을 보여줌               | GitHub Content와 Mona Sans metric이 다름                         |
| [USWDS Font token](https://designsystem.digital.gov/design-tokens/typesetting/font/)                                                                 | 9단계 Theme ramp에는 `24`, `32`, `40px`이 포함되고 `20`, `28px`은 더 넓은 System ramp에만 남아 있음                                              | 더 큰 물리 가능성 집합에서 작은 Theme-facing subset을 선별하는 방향을 지지함          | Government content는 NosLog role을 선택하지 않음                 |
| [GOV.UK Type scale](https://design-system.service.gov.uk/styles/type-scale/)                                                                         | 새 Component는 기존 Scale에 맞춰야 하며 일반 Heading point는 임의 Local value를 만들지 않고 반응형으로 변함                                      | 관리되는 Scale point와 추후 명시적 반응형 Composite를 지지함                          | `19/24/36/48px` Content-service ramp는 의도적으로 더 Editorial함 |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                                                                                | Display를 제외한 System에서 선택하는 Font size를 대략 3~5개로 제한하고 불필요한 Style 낭비를 피하도록 권함                                       | 작은 상위 Core와 예외적 Display treatment를 직접 지지함                               | 정확한 Project별 선택은 Product에 맡김                           |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                                                                      | 일반 `12/14/16px` Size 위의 Product heading에 `20`, `24`, `36px`을 사용함                                                                        | 승인된 하위 Core 위의 드문 Product-heading 진행을 확인함                              | SAP 72와 Enterprise layout은 Pretendard JP 및 NosLog와 다름      |
| [Material 3 Type scale](https://developer.android.com/develop/ui/compose/designsystems/material3)                                                    | `22px` Title, `24/28/32px` Headline, `36px+` Display role을 분리함                                                                               | 중간 강조 Title, 중요한 Heading 또는 Numeral, Display를 분리하는 방향을 지지함        | 13개 Style의 전체 Android ramp는 복사하기에 너무 넓음            |
| [GitLab Type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals)                                                          | `18–20`, `21–25`, `24–30`, `28–36px` 부근의 관리되는 Dynamic range를 사용하고 가장 큰 Display는 Page당 하나로 제한함                             | 절제된 일반 Hierarchy와 별도로 Gate를 둔 Display role을 지지함                        | Fluid range와 GitLab Sans는 직접적인 NosLog token이 아님         |
| [Adobe Spectrum Heading](https://spectrum.adobe.com/page/heading/) 및 [Platform scale](https://spectrum.adobe.com/page/platform-scale/)              | Application heading과 더 큰 Content heading을 구분하고 Platform-scale 검증을 요구함                                                              | 일반 Product title은 절제하고 드문 Display는 대표 Width에서 시험하는 방향을 지지함    | 공개 T-shirt name은 Pretendard JP Pixel value를 제공하지 않음    |
| [Shopify Polaris Font token](https://polaris-react.shopify.com/tokens/font)                                                                          | `20`, `24`, `30`, `32`, `36`, `40px` 등 많은 Primitive를 제공한 뒤 선택한 값만 Semantic composite에 Mapping함                                    | 사용 가능한 Primitive가 자동으로 Page 작성자 선택지가 되어서는 안 됨을 확인함         | Commerce composite는 NosLog hierarchy를 결정하지 않음            |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                                                         | 안정적인 상대 Hierarchy, 최소 Typeface 변형 및 사용자 Text 확대를 견디는 Layout을 권함                                                           | Fit을 위해 상위 Role을 줄이는 대신 Hierarchy와 Reflow를 검증하는 방향을 지지함        | Native point size와 Dynamic Type은 Web에 방향성만 제공함         |
| [Carbon Type set](https://carbondesignsystem.com/elements/typography/type-sets/)                                                                     | Productive product heading은 고정하고 Fluid expressive scale은 필요한 Context에만 예약함                                                         | 고정된 일반 Product step과 별도 검토하는 Expressive/Display 동작을 지지함             | NosLog는 Carbon의 완전한 두 Type set을 복사하지 않음             |
| [LINE Messenger Typography](https://designsystem.line.me/LDSM/foundation/typography-ex-en)                                                           | 동아시아 Product title은 `19`, `23`, `24` 부근에 모이고 `12` 미만 Size를 권하지 않음                                                             | 절제된 Mobile product title을 지지하고 부풀린 기본 Page heading을 피하는 근거가 됨    | Messenger content와 Native point sizing은 Responsive web과 다름  |
| [W3C Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) 및 [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | 필수 Text는 `200%` 확대와 `320 CSS px` Reflow를 견뎌야 함                                                                                        | 상위 Role은 임의 Size 축소가 아니라 반응형 Composition으로 검증해야 함                | WCAG는 상위 숫자 Ramp를 규정하지 않음                            |
| 현재 NosLog Source                                                                                                                                   | 기존 사용자용 Utility가 `18px` Wordmark, `20px` Title, `24px` Display, `36px` Score display를 사용하고 직접 상위 Size utility도 밖에 분산돼 있음 | 관리되는 상위 Primitive의 실제 필요는 보여주지만 보존해야 할 일관된 현재 Scale은 없음 | 현재 값은 사용성 근거이지 2.0 Visual authority가 아님            |

수렴하는 Pattern은 숫자가 완전히 같다는 것이 아니라 기능 구간이 같다는
것입니다. Product title은 `20–24px` 부근에 모이고, `32px`은 Dominant title이나
Metric을 고정하며, `36–40px`은 Display 또는 예외적 강조로 다뤄집니다.
`18/20px`, `28/32px`, `36/40px`을 모두 제공하는 System은 훨씬 넓은 Product
family를 지원하기 때문입니다. NosLog에는 아직 이 인접 Pair가 서로 다른 공유
의미를 만든다는 근거가 없습니다.

### 후보 비교

| 후보                                                         | 이점                                                                                                                      | 비용과 위험                                                                                         | 추천                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------- |
| `A` — 일반 상위 Core `20/24/32px` + Gate를 둔 `40px` Display | Compact-title, Page-identity, Dominant, 드문 Display 구간을 구분하고 4 Pixel 단위에 맞으며 전체 물리 Scale을 7개로 유지함 | `40px`이 일반 Page-title 우회로가 되지 않도록 엄격한 Role mapping이 필요함                          | `Approved`                 |
| `B` — `20/24/32px`만 사용                                    | 가능한 가장 작은 상위 Scale이며 분산을 강하게 막음                                                                        | 승인된 `display` role이 일반 Dominant metric 또는 Title과 최대 Size를 공유하여 예외적 의미가 약해짐 | `가능하지만 추천하지 않음` |
| `C` — `18/20/24/28/32/40px`                                  | 다양한 Page context를 세밀하게 조절할 수 있음                                                                             | 모호한 인접 선택을 다시 만들고 다국어·반응형 QA를 늘리며 현재의 Page별 Type size 분산 경로를 재현함 | `추천하지 않음`            |

### 후보 A의 승인된 경계

- 일반 상위 물리 Core는 `20px`, `24px`, `32px`입니다. 따라서 전체 공유 물리
  Ramp는 아래 Gate Display step을 제외하고 `12/14/16/20/24/32px`입니다.
- `20px`은 Compact section, Component 및 Entity-title composite 후보가 될 수
  있습니다. 세 Role 모두에 자동 배정하는 것은 아닙니다.
- `24px`은 주 Page identity와 우선순위가 높은 Section 또는 Entity identity
  후보가 될 수 있습니다. 모든 Semantic `h1`의 Visual style이 자동으로 되는
  것은 아닙니다.
- `32px`은 Dominant short title 또는 Major metric 후보가 될 수 있습니다. 일반
  Card, Dialog 또는 Section heading이 되면 안 됩니다.
- `40px`은 Routine title 선택에 포함되지 않는 Gate display primitive입니다.
  `display` 또는 `metric-display` role만 후보가 될 수 있으며 어느 Mapping도 별도
  Specimen 검토와 승인이 필요합니다.
- `18px`, `28px`, `36px`은 Foundation v0.1 공유 Primitive가 아닙니다. 검증된
  다국어 Specimen에서 빠진 Semantic distinction을 입증해야만 제안할 수 있습니다.
- 이 Scale은 영구 불변이 아니라 절제되고 수정 가능한 구조입니다. 대표 다국어·
  반응형 Specimen에서 승인된 Step으로 필요한 Semantic distinction을 표현할 수
  없음이 입증된 뒤에만 새 공유 Size를 제안할 수 있습니다. Page 또는 Component
  작성자가 미리 Local size를 추가하면 안 됩니다.
- 물리 Size 승인은 해당 Line height, Weight, Responsive substitution, 정확한 Role
  mapping, 최대 Line count, Truncation 또는 Metric 동작을 승인하지 않습니다.
  이는 이후의 제한된 결정으로 남습니다.
- Font-size primitive `20px`과 이미 승인된 Line-height primitive `20px`은 서로
  다른 Token namespace이며 Figma나 Code에서 혼동하면 안 됩니다.
- 단순히 Fit을 위해 Mobile에서 상위 Role을 축소하면 안 됩니다. 향후 `32px` 또는
  `40px` Composite의 반응형 변화는 한국어·일본어·영어·혼합 Script, `320px`,
  `390px`, 중간 Width 및 Wide specimen을 거친 해당 Composite 결정에서 승인해야
  합니다.

## 선택하지 않은 대안

| 대안                                                              | 상태       | 이유                                                                                                                                |
| ----------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `14px`을 Universal body 및 Interface base로 사용                  | `Rejected` | Reading과 CJK content를 압축하는 현재 경향을 반복하고 광범위한 Small text를 막는 명확한 경계를 만들지 못함                          |
| 모든 일반 Body, Result, Control 및 고밀도 Row에 `16px` 사용       | `Rejected` | Reading은 보호하지만 Ranking, Discovery result 및 Professional-tool surface를 불필요하게 확대함                                     |
| Density를 보존하기 위해 더 작은 Mobile scale 사용                 | `Rejected` | Mobile-first 가독성, CJK 근거 및 Reflow와 Content hierarchy로 Fit을 해결한다는 승인된 전략과 충돌함                                 |
| 서로 무관한 별도 Mobile 및 Desktop 하위 Scale 사용                | `Rejected` | 공유 Role 의미를 불안정하게 만들고 Page 및 Breakpoint별 Typography 분산을 다시 만들 위험이 있음                                     |
| Reading Pairing과 함께 별도 Compact `14/18`, `16/22` Pairing 추가 | `Rejected` | Carbon은 타당한 이중 System을 보여주지만 NosLog specimen이 필요성을 입증하기 전에 초기 하위 Line-height 축을 3개에서 5개로 늘림     |
| `12/18`, `14/21`, `16/24`의 Universal `1.5` 비율 적용             | `Rejected` | 긴 Reading은 보호하지만 짧은 Tertiary 및 Product-interface text를 불필요하게 느슨하게 만들고 System 밖 `18px`, `21px` Step을 추가함 |
| `400`과 `700`만 사용                                              | `Rejected` | 단순하지만 일반 Reading, Interactive control, Entity identity 및 최상위 강조 사이의 차이가 너무 큼                                  |
| `400`, `500`, `700` 사용                                          | `Rejected` | 절제된 Control은 지원하지만 Compact heading과 Entity identity가 약한 Medium과 무거운 Bold 중 하나를 선택하게 함                     |
| `400`, `600`, `700` 사용                                          | `Rejected` | 강한 Hierarchy는 지원하지만 절제된 Interactive step이 없고 현재 Semibold 과용을 유지할 위험이 있음                                  |
| 모든 Pretendard JP Weight 또는 임의 Variable 값 노출              | `Rejected` | Font 기능은 Semantic 필요가 아니며 통제되지 않은 Page별 강조를 다시 만듦                                                            |
| Carbon, Material, Apple 또는 USWDS Tracking 값 가져오기           | `Rejected` | 해당 값은 다른 Font, Platform, Size 및 Composite role에 결합되어 있음                                                               |
| 일반 UI에 Generic `tight`, `normal`, `wide` Utility 공개          | `Rejected` | NosLog Specimen이 Semantic 필요를 입증하기 전에 통제되지 않은 Local styling 축을 만듦                                               |
| 초기 전략으로 Locale 또는 Viewport별 Tracking 조정                | `Rejected` | 줄바꿈과 QA 변형을 늘리고 안정적인 Localized composition과 충돌함                                                                   |
| 초기 공유 Ramp에 `18px`, `28px`, `36px`을 미리 추가               | `Rejected` | 대표 Specimen에서 빠진 Semantic distinction을 입증하기 전에 인접 Step이 작성자 선택과 검증 비용을 늘림                              |
| `40px`을 일반 Page, Card, Dialog 또는 Section title에 허용        | `Rejected` | 승인된 드문 Display 경계를 무너뜨리고 Page별 강조 분산을 다시 만듦                                                                  |

## 결정 기록

| ID       | 결정                                                                                                                                         | 상태                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `FTL-01` | 위 Role 경계와 반응형 제약을 포함하여 `12px`, `14px`, `16px`을 공유 하위 물리 Type core로 사용함                                             | `Approved`                           |
| `FTL-02` | 위 검증 제약을 조건으로 `16px`, `20px`, `24px`을 하위 Line-height primitive로 사용하고 `12/16`, `14/20`, `16/24`를 기본으로 함               | `Approved`                           |
| `FTL-03` | 위 Semantic, 사용 빈도, 반응형 및 검증 제약과 함께 `400`, `500`, `600`, `700`만 공유 Weight primitive로 사용함                               | `Approved`                           |
| `FTL-04` | 모든 공용 UI Role에 자연/기본 간격을 사용하고 Kerning을 유지하며 공유 양수·음수 Tracking token을 노출하지 않고 드문 예외를 명시적으로 관리함 | `Approved`                           |
| `FTL-05` | `20px`, `24px`, `32px`을 일반 상위 Core로 사용하고 `40px`은 별도 승인된 Display 또는 Metric-display composite에만 Gate를 두어 사용함         | `Approved`                           |
| `FTL-06` | 상위 Line-height pairing 및 반응형 동작을 선택함                                                                                             | `Observed need — 아직 제안하지 않음` |
| `FTL-07` | Metric role을 포함한 12개 Semantic role을 완전한 Composite style에 Mapping함                                                                 | `Observed need — 아직 제안하지 않음` |
| `FTL-08` | Spacing, Grid, Container, Density 및 Target geometry 값을 선택함                                                                             | `Observed need — 아직 제안하지 않음` |

## 다음 승인 Gate

다음 제한된 결정은 승인된 일반 상위 Core `20/24/32px`과 Gate를 둔 `40px`
Display step의 상위 Line-height 축 및 기본 Pairing입니다. 다음 Gate에서도 12개
Semantic role을 조용히 배정하거나 반응형 대체를 승인하면 안 됩니다.
