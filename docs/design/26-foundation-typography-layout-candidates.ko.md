# NosLog 2.0 Foundation Typography 및 Layout Candidate

> **대체 공지 — 2026-08-10:** 미래 통합 `S1`–`S6` 검증 또는 fine-pointer
> viewer/editor adaptation을 적은 문구는 역사적 기록이며 실행 대상이 아닙니다.
> `S1`–`S5` 구조 작업은 완료됐고 `S6`은 취소됐으며 기존 viewer와 editor 전체를 그대로
> 보존합니다. 현재 범위는
> [문서 57](./57-noslog-2.0-authoritative-remaining-work-audit.ko.md)을 따릅니다.

## 문서 관리

- 상태: `Typography·Layout 계약 승인 — 오래된 통합 S6 검증 대체됨, 최종 일반 UI 회귀는 문서 57이 지배`
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
- 이번 결정에서 제외: 최대 Line count, Wrapping 및 Truncation 정책, 승인된
  Control height와 Target 계약 이외의
  Component 치수, Color, Material treatment, 최종 Figma style, Production screen
  및 Application 구현

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
- Responsive 동작은 `FTL-09`의 제한된 `page-title` substitution으로만
  적용합니다. 승인된 물리 축과 정확한 Semantic composite mapping에서 다른
  Substitution, Line-count 정책, Truncation, Component geometry 또는 Layout이
  승인되었다고 추론하지 않습니다.
- 승인된 Composite style은 Foundation v0.1 승격 전에 `S1`–`S6` 다국어 및
  반응형 Specimen으로 검증합니다.
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

| Step                            | 승인된 경계                                                                                                                   | 이 문서 뒤에서 기록한 승인 Role 해석                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `12px`(기본 Root에서 `0.75rem`) | 공용 사용자 표시용 최하위 Step이며 짧고 실제로 Tertiary인 Metadata, Caption 또는 동등한 Supporting content에만 사용할 수 있음 | `metadata`는 `12/16 · 400`, `entity-companion`은 이 하한을 사용하지 않음 |
| `14px`(`0.875rem`)              | Specimen에서 가독성이 확인된 Control, 고밀도 Result와 Row 및 대부분의 Secondary information을 위한 Compact product-UI Step    | 승인된 `14/20 · 400` 및 `14/20 · 500` Composite를 지원함                 |
| `16px`(`1rem`)                  | 일반 Reading/Body Step이며 공유 하위 Core의 상위 Step                                                                         | 승인된 `16/24 · 400` 및 `16/24 · 600` Composite를 지원함                 |

### 사용 제약

- 일반 공용 HTML 사용자 표시용 Typography는 `12px` 미만으로 결정할 수
  없습니다.
- `12px`가 Primary action, Primary search result identity, 필수 Comparison
  value 또는 긴 설명 Copy를 담당하면 안 됩니다.
- Page 또는 Component 작성자는 Role 이름이 작아 보인다는 이유로 Step을 고르지
  않습니다. 승인된 Composite map은 `metadata`를 `12px`, `entity-companion`을
  `14px`로 해석하며 변경에는 명시적 예외 절차가 필요합니다.
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
- 정확한 Role-to-weight 배정은 아래 Semantic composite Section에서
  승인했습니다. 위 빈도 및 오용 경계는 계속 전체 System에 적용되며 Local Weight
  변경을 허용하지 않습니다.
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
  사용하면서 실제 설명에는 읽기 쉬운 Step을 유지할 수 있습니다. 원문 제목만
  표시하며 `entity-companion`은 악곡 상세 Popover에만 사용합니다.
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
- `20px`은 승인된 `section-title` Composite로 해석됩니다. Component와 일반
  Entity title은 `16px`을 사용하며 작성자가 Local에서 승격할 수 없습니다.
- `24px`은 Focused-entity 우선순위 규칙을 포함한 `page-title`로 해석됩니다.
  Semantic HTML Heading level을 자동 결정하지 않습니다.
- `32px`은 `metric-display`로 해석됩니다. 일반 Title, Card, Dialog 또는 Section
  heading이 되면 안 됩니다.
- `40px`은 Routine title 선택에 포함되지 않는 Gate display primitive입니다.
  `display` 또는 `metric-display` role만 후보가 될 수 있으며 어느 Mapping도 별도
  Specimen 검토와 승인이 필요합니다.
- `18px`, `28px`, `36px`은 Foundation v0.1 공유 Primitive가 아닙니다. 검증된
  다국어 Specimen에서 빠진 Semantic distinction을 입증해야만 제안할 수 있습니다.
- 이 Scale은 영구 불변이 아니라 절제되고 수정 가능한 구조입니다. 대표 다국어·
  반응형 Specimen에서 승인된 Step으로 필요한 Semantic distinction을 표현할 수
  없음이 입증된 뒤에만 새 공유 Size를 제안할 수 있습니다. Page 또는 Component
  작성자가 미리 Local size를 추가하면 안 됩니다.
- 물리 Size 승인만으로 해당 Line height, Weight, Responsive substitution, 정확한
  Role mapping, 최대 Line count, Truncation 또는 Metric 동작을 승인한 것은
  아닙니다. 아래 후속 Section은 기본 상위 Size-to-line-height Pairing, 정확한
  Semantic mapping 및 하나의 `page-title` Substitution을 명시된 경계 안에서
  승인하며, 그곳에서 명시적으로 승인하지 않은 사항은 계속 미확정입니다.
- Font-size primitive `20px`과 이미 승인된 Line-height primitive `20px`은 서로
  다른 Token namespace이며 Figma나 Code에서 혼동하면 안 됩니다.
- 단순히 Fit을 위해 Mobile에서 상위 Role을 축소하면 안 됩니다. 후속 `FTL-09`에서
  승인한 `page-title` Substitution을 제외한 `32px` 또는 `40px` Composite의 추가
  반응형 변화는 한국어·일본어·영어·혼합 Script, `320px`, `390px`, 중간 Width 및
  Wide specimen을 거친 해당 Composite 결정에서 승인해야 합니다.

## 승인된 상위 Line-height 축

### 상위 Line-height 집중 조사

이번 검토는 독립적으로 유지 관리되는 Design system 15개와 W3C 접근성 및
한국어·일본어 조판 지침을 비교했습니다. 작성자가 지정하는 Heading leading과
사용자 Spacing override를 견뎌야 한다는 WCAG 요구사항을 분리해 평가했습니다.
Typeface, Platform 및 Density는 서로 다르지만 Title size가 커질수록 상대 Leading을
점진적으로 조이고, 줄바꿈 가능성이 있는 작은 Heading에는 여유를 남긴다는 방향은
수렴했습니다.

| 독립 출처                                                                                                   | 전이 가능한 발견                                                                                        | NosLog 적용                                                                  | 한계                                                                        |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Tailwind CSS Font size](https://tailwindcss.com/docs/font-size)                                            | 현재 Stack이 기본적으로 `20/28`, `24/32`를 Pairing함                                                    | 줄바꿈 가능성이 가장 높은 두 상위 Size에 구현 친화적인 후보를 제공함         | Tailwind 기본값은 편의값이지 Design authority가 아님                        |
| [Material 3 Typography](https://developer.android.com/develop/ui/compose/designsystems/material3)           | Headline style에 `24/32`, `32/40`을 사용하고 Size가 커질수록 상대 Leading을 줄임                        | 제안한 진행의 중간 구간을 직접 지지함                                        | Roboto와 Native `sp` 값은 Pretendard JP CSS token이 아님                    |
| [Fluent 2 Typography](https://fluent2.microsoft.design/typography)                                          | Web title에 `20/26`, `24/32`, `32/40`, `40/52`가 포함됨                                                 | 안정적인 기능 구간을 확인하면서 최대 Display leading은 Product별임을 보여줌  | Segoe UI metric과 Fluent의 `40/52`가 NosLog Display density를 결정하지 않음 |
| [Carbon Type set](https://carbondesignsystem.com/elements/typography/type-sets/)                            | Product heading에 `20/28`, `32/40`이 포함되고 더 큰 Expressive role은 더 조여짐                         | `20px` 줄바꿈 여유와 더 조밀한 Dominant heading을 지지함                     | IBM Plex 및 Carbon의 Productive/Expressive 분리를 복사하지 않음             |
| [Atlassian Product type scale](https://atlassian.design/foundations/typography/product-typefaces-and-scale) | Heading leading을 약 `1.2`로 잡고 4 Pixel rhythm에 맞춰 반올림함                                        | 드물고 짧은 Display의 `40/48`과 4 Pixel 정렬을 지지함                        | 모든 작은 다국어 Title에 `1.2`를 적용하면 너무 조밀함                       |
| [GOV.UK Type scale](https://design-system.service.gov.uk/styles/type-scale/)                                | `24/30`, `36/40` 같은 검증된 Size/Line-height Pair와 명시적 반응형 동작을 사용함                        | Title leading은 Local choice가 아니라 관리되는 Composite임을 확인함          | Font, 공공 서비스 Reading context 및 5 Pixel rhythm이 다름                  |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                                 | 한두 줄 이하 Heading에 대략 `1–1.35`를 권함                                                             | Title이 커지고 짧아질수록 상대 Leading을 줄이는 방향을 지지함                | Pretendard JP 값이 아니라 범위를 제공함                                     |
| [Primer Typography primitive](https://primer.style/product/primitives/typography/)                          | Size와 Line height를 Semantic shorthand token으로 결합하고 Medium title에 Display보다 더 많은 여유를 둠 | Composite 관리와 Content별 Density를 지지함                                  | 현재 Primer Title 비율을 NosLog에 복사하기에는 더 여유로움                  |
| [Shopify Polaris Text](https://polaris-react.shopify.com/components/typography/text)                        | Responsive heading variant가 미리 정한 Size와 Line-height token을 Mapping함                             | Page별 임의 Pairing을 막는 방향을 지지함                                     | Commerce role과 Token 값은 NosLog Semantic을 결정하지 않음                  |
| [Ant Design Font system](https://ant.design/docs/spec/font/)                                                | Size와 Line height를 하나의 질서 있는 System으로 다루고 비 Display Size를 3~5개로 제한하도록 권함       | Generic tight/normal utility가 아니라 작은 승인 축을 지지함                  | 공개 Page는 모든 상위 숫자 Pair를 Text로 노출하지 않음                      |
| [GitLab Type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals)                 | Dynamic heading size를 관리하고 약 `1.25`의 Heading line-height token을 노출함                          | `32/40`과 Responsive 동작을 고정 기본 Pairing에서 분리하는 방향을 지지함     | GitLab Sans와 Fluid scale은 직접적인 NosLog Mapping이 아님                  |
| [Adobe Spectrum Typography data](https://opensource.adobe.com/spectrum-design-data/tokens/typography/)      | 조정된 Font-size와 Line-height Scale set을 유지하고 Platform 차이를 검증함                              | 명시적 Primitive namespace와 후속 Specimen 검증을 지지함                     | Adobe Clean metric 및 Spectrum의 더 큰 Mobile scale이 다름                  |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)                | 기본 Title style은 Size가 커질수록 상대적으로 조밀해지고 세 줄 이상에는 Tight leading을 피하도록 함     | 점진적 비율과 Line-count 경계를 지지함                                       | Native point size와 Dynamic Type은 Responsive web에 방향성만 제공함         |
| [LINE Global Typography](https://designsystem.line.me/LDSG/foundation/typography-en)                        | 더 조밀한 Title style과 읽기 쉬운 Text style을 분리하고 일본어를 포함한 Language pack을 제공함          | 실제 동아시아 Script에서 같은 Pairing을 검증하는 방향을 지지함               | 공개 Token은 Pretendard JP 측정값을 제공하지 않음                           |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                             | Title을 관리되는 UI role로 취급하고 언어 Fallback과 Truncation을 명시적으로 고려함                      | Latin 전용 예시가 아니라 실제 Localized title 검증을 지지함                  | SAP 72 metric과 Enterprise control이 다름                                   |
| [WCAG Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)                          | 사용자가 Line height를 Font size의 최소 `1.5`배로 Override해도 Content나 기능 손실이 없어야 함          | 작성 Heading을 기본 `1.5`로 만들지 않고도 견고한 Container와 Reflow를 요구함 | 기본 Heading scale이 아니라 Override 생존 기준임                            |
| [W3C KLReq](https://www.w3.org/TR/klreq/) 및 [JLReq](https://www.w3.org/TR/jlreq/)                          | 한글, Kana, Kanji, Latin 혼합, 문장 부호 및 Line composition은 Script-aware 검증이 필요함               | 승격 전에 실제 한국어·일본어·혼합 Script Specimen을 요구함                   | 인쇄 및 세로쓰기 내용은 관련 있는 부분만 전이함                             |

숫자상 수렴은 `20/28`, `24/32`, `32/40`에서 가장 강합니다. Gate를 둔 `40px`
Display step은 System별로 약 `1.2–1.3` 범위지만, 해당 Step을 드물고 짧게
유지한다는 승인 요구사항에 따라 실제 Pretendard JP Specimen 검증을 조건으로 더
조밀한 `40/48` 기본값이 적합합니다.

### 후보 비교

| 후보                              | Pairing                            | 이점                                                                                                                   | 비용과 위험                                                                                | 추천       |
| --------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| `A` — 점진적으로 조여지는 상위 축 | `20/28`, `24/32`, `32/40`, `40/48` | `20–24px`의 줄바꿈 가능한 다국어 Title을 보호한 뒤 Dominant와 드문 Display를 점진적으로 조이고 4 Pixel rhythm을 유지함 | `40px` Gate와 Line-count 경계를 계속 엄격히 적용해야 함                                    | `Approved` |
| `B` — 조밀한 작은 Heading         | `20/24`, `24/28`, `32/40`, `40/48` | 한 줄 UI Heading을 Compact하게 만듦                                                                                    | `20/24`, `24/28`은 긴 일본어 Music title과 혼합 Script identity가 줄바꿈될 때 너무 조밀함  | `Rejected` |
| `C` — 여유로운 Display            | `20/28`, `24/32`, `32/40`, `40/52` | 여러 줄 Editorial display에 더 많은 여유를 줌                                                                          | `52px` Primitive를 추가하고 입증된 NosLog 필요 없이 승인된 짧고 드문 Display 경계를 약화함 | `Rejected` |

### 승인된 Pairing과 경계

| Font size | 기본 Line height   | 상대 Pairing       | 의도한 경계                                                                        |
| --------- | ------------------ | ------------------ | ---------------------------------------------------------------------------------- |
| `20px`    | `28px` (`1.75rem`) | `20/28` (`1.4`)    | 한국어·일본어·영어 또는 혼합 Script에서 줄바꿈될 수 있는 Compact·Entity-title 후보 |
| `24px`    | `32px` (`2rem`)    | `24/32` (`1.333…`) | 통제된 두 번째 줄이 필요할 수 있는 주 Identity 후보                                |
| `32px`    | `40px` (`2.5rem`)  | `32/40` (`1.25`)   | Dominant short title 또는 Major-metric 후보                                        |
| `40px`    | `48px` (`3rem`)    | `40/48` (`1.2`)    | Gate를 둔 드물고 짧은 Display 또는 Metric-display 후보만 해당                      |

따라서 전체 공유 Line-height primitive 축은
`16/20/24/28/32/40/48px`입니다. 이는 기본 Pairing이며 임의의 Font-size와
Line-height 조합을 위한 공개 Menu가 아닙니다.

- `20/28`, `24/32`는 정당하게 두 줄이 될 수 있는 Title을 보호합니다. 무제한 Line
  count나 최종 Wrap/Truncation 정책을 승인하지는 않습니다.
- `32/40`, `40/48`은 짧은 Dominant content용입니다. 세 줄 이상이 필요한
  Specimen은 Hierarchy에 맞는다는 이유만으로 조밀한 상위 Style을 유지하면 안 되며
  Content priority, Width, Size, Role 또는 Composition을 다시 검토해야 합니다.
- `36px`, `44px`, `52px`은 Foundation v0.1 공유 Line-height primitive가
  아닙니다. 새 값은 대표 다국어·반응형 근거와 명시적 사용자 승인이 필요하며 Page
  또는 Component 작성자가 Local leading을 추가하면 안 됩니다.
- Pairing은 상대 구현 단위를 사용하고 Browser text scaling을 보존해야 합니다.
  Pixel 표기는 Design target을 문서화할 뿐입니다.
- 후속 Semantic composite 결정에서 Role, Weight 및 Metric 동작을 배정했습니다.
  최대 Line count, Truncation 규칙 및 승인된 `page-title` Step 이외의 Responsive
  size substitution은 여전히 미확정입니다.
- Mobile 전용 Line-height 압축은 승인하지 않습니다. `FTL-09`가 유일하게 승인된
  Responsive role substitution이며 추가 Substitution은 후속 제한된 결정이
  필요합니다.
- Pretendard JP Specimen은 원문 일본어 Music title, 악곡 상세 Popover 안의
  Localized/read title, 긴
  Artist credit, 한국어·영어 Page identity, Tabular metric 및 혼합 문장 부호를
  `320px`, `390px`, 중간 Width, Wide layout, `200%` Text 확대 및 WCAG Text
  Spacing override에서 검증한 뒤 Foundation으로 승격해야 합니다.

## 승인된 Semantic Composite Map

### Role mapping 집중 조사

정확한 Mapping 검토에서는 독립적인 공식 또는 유지 관리 System 16개를
비교했습니다. 각 System은 Font, Platform 및 명명 체계가 다르므로 표면 Token을
복사하지 않았습니다. 안정적으로 전이 가능한 Pattern은 Semantic role 수가 물리
Composite 수보다 많을 수 있고, 일반 Product hierarchy는 절제된 Size ramp와
Weight를 결합하며, Metric에는 목적에 맞는 숫자 동작이 필요하고, 시각적 Heading
treatment는 문서 Semantics와 독립적으로 유지된다는 점입니다.

| 독립 출처                                                                                         | 전이 가능한 발견                                                                                     | NosLog 적용                                                                                     | 한계                                                              |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [Material 3 typography](https://developer.android.com/develop/ui/compose/designsystems/material3) | 전체 Type scale은 선택 사항이며 Product theme은 필요한 Style만 유지할 수 있음                        | NosLog의 12개 의미에 12개의 독립 물리 Style이 필요하지 않음                                     | Native `sp`, Roboto 및 Material role 이름은 NosLog 값이 아님      |
| [Fluent 2 typography](https://fluent2.microsoft.design/typography)                                | 공용 Body size는 모든 용도마다 새 Size를 만들기보다 Weight와 Hierarchy 변화를 사용함                 | `body`, `control`, Identity 및 Supporting role이 Composite를 공유하는 근거                      | Segoe UI Metric과 Fluent Platform ramp는 직접 전이되지 않음       |
| [Carbon type sets](https://carbondesignsystem.com/elements/typography/type-sets/)                 | Productive와 Expressive style은 여러 Semantic context에서 조율된 물리 값을 재사용함                  | 드문 Display treatment를 포함한 간결한 물리 어휘의 근거                                         | IBM Plex와 Carbon의 Productive/Expressive 구분을 복사하지 않음    |
| [Atlassian Typography](https://atlassian.design/foundations/typography/)                          | 제한된 System을 재사용하면서 Body, Heading 및 Metric 용도를 구분함                                   | Metric을 Heading으로 취급하지 않고 별도 역할로 두는 근거                                        | Atlassian Density와 Font metric은 NosLog 값이 아님                |
| [Primer Typography](https://primer.style/product/getting-started/foundations/typography/)         | Composite token과 Semantic markup이 임의 Local 선택을 방지함                                         | 고정 Role-to-composite mapping과 Semantic heading 독립성의 근거                                 | GitHub Content hierarchy는 NosLog Page template이 아님            |
| [GitLab type fundamentals](https://design.gitlab.com/product-foundations/type-fundamentals/)      | Body와 Label hierarchy는 Size를 공유하고 관리된 Weight 및 Context로 구분할 수 있음                   | 새 Size 없이 `14/20` Regular와 Medium 변형을 사용하는 근거                                      | GitLab에는 NosLog가 의도적으로 제외한 물리 Step이 있음            |
| [Ant Design Font](https://ant.design/docs/spec/font/)                                             | 일반 Product interface는 사용 중인 Size 수를 대략 3~5개 정도로 절제해야 함                           | Role별 Style 증식보다 승인된 7개 Pairing으로 구성한 9개 Composite의 근거                        | Logarithmic scale과 `14px` Base를 복사하지 않음                   |
| [USWDS Typography](https://designsystem.digital.gov/components/typography/)                       | 읽기 가능한 Body, 절제된 Small text 및 Tabular number는 서로 다른 작업을 해결함                      | `16/24` Body, 예외적인 `12/16` Metadata 및 Tabular metric의 근거                                | 정부 Reading 기본값은 고밀도 Score surface보다 여유로움           |
| [GOV.UK Typography](https://design-system.service.gov.uk/styles/typography/)                      | 작은 Content-first hierarchy와 Semantic HTML은 서로 구분되는 관심사임                                | 시각적 Title마다 같은 HTML Heading level을 강제하지 않으면서 Visual-role 일관성을 유지하는 근거 | 공공 서비스 Tone과 Responsive 값은 NosLog Styling을 결정하지 않음 |
| [SAP Fiori Typography](https://experience.sap.com/fiori-design-web/typography/)                   | Object, List, Control, Chart 및 KPI Context가 관리된 Style을 공유하고 KPI 값은 Label과 Unit을 유지함 | 하나의 절제된 System 안에서 Entity, Control, Metadata 및 Metric을 구분하는 근거                 | Enterprise Control density와 SAP 72 Metric은 다름                 |
| [Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography)      | Text style은 Hierarchy를 전달하며 더 큰 접근성 Size는 Composition 변경을 요구함                      | Local 축소가 아니라 안정적인 Role 의미와 후속 Responsive/Accessibility Gate의 근거              | Native Dynamic Type은 CSS Composite에 직접 Mapping되지 않음       |
| [일본 디지털청 Design System Typography](https://design.digital.go.jp/foundations/typography/)    | 일본어 Body/UI Text는 가독성을 우선하며 작은 Text를 제한하고 Heading Semantic을 구조적으로 유지함    | `16/24` 일반 Reading, 절제된 `14/20` 및 실제 일본어 Specimen 검증의 근거                        | 해당 Font family와 정부 Content는 NosLog Identity를 결정하지 않음 |
| [LINE Design System typography](https://designsystem.line.me/LDSG/foundation/typography-en)       | Script metric을 고려하면서 일본어와 기타 언어 Pack 전반에 일관된 Role family를 제공함                | 한국어·일본어·영어·혼합 Script Content에 하나의 Semantic map을 쓰는 근거                        | LINE의 정확한 공개 Token은 Pretendard JP 측정값이 아님            |
| [Radix Themes typography](https://www.radix-ui.com/themes/docs/theme/typography)                  | 간결한 Size scale을 Weight 및 Semantic component API와 결합함                                        | Page-local 값 노출보다 작은 물리 Ramp를 조합하는 근거                                           | Radix 기본값은 구현 선택지이지 NosLog Design 근거가 아님          |
| [Tailwind CSS font size](https://tailwindcss.com/docs/font-size)                                  | Size와 Line height를 Pairing하고 상대 단위의 재사용 Token으로 구현할 수 있음                         | 승인된 Composite를 Code에 결정론적으로 Mapping하는 근거                                         | Framework 기본값은 Design authority가 아니라 편의 기능임          |
| [VA Design System typography](https://design.va.gov/foundation/typography)                        | 시각적 Typography style과 접근 가능한 Heading level은 연관되지만 서로 대체할 수 없음                 | 올바른 문서 Outline을 유지하면서 `page-title` 또는 다른 Composite를 적용하는 근거               | 공공 서비스 Content와 Font는 NosLog Role priority를 결정하지 않음 |

가장 강한 수렴은 숫자가 아니라 구조에 있습니다. 작성에는 Semantic name을 사용하고,
적은 수의 완전한 물리 Treatment를 재사용하며, Weight는 관리된 Composite의 일부로만
사용하고, 비교 숫자는 Tabular로 유지하며, 올바른 HTML Heading 순서는 시각 Style과
독립적으로 보존합니다. 아래 승인된 NosLog 값은 어느 한 출처를 복사한 것이 아니라,
이미 승인된 물리 축과 사용자가 검토한 Product hierarchy를 결합한 결과입니다.

### 승인된 Role-to-composite mapping

모든 공용 Role은 다음의 완전한 기본 Composite로 해석됩니다. 전체에 자연/기본
Tracking과 Kerning 유지가 적용됩니다.

| Semantic role      | 승인된 기본 Composite | 숫자 기능       | 관리 경계                                                                                           |
| ------------------ | --------------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| `display`          | `40/48 · 700`         | Proportional    | 드물고 짧으며 별도 정당화된 표현 순간에만 사용, 자동 Page 배정 없음                                 |
| `page-title`       | `24/32 · 700`         | Proportional    | Compact/기본 Page 또는 Focused-task identity, 승인된 Wide substitution은 아래에서 별도 관리         |
| `section-title`    | `20/28 · 600`         | Proportional    | 장식적 Card label이 아니라 실제 주요 Content 경계                                                   |
| `component-title`  | `16/24 · 600`         | Proportional    | 해당 Section에 종속되는 Dialog, Drawer, Panel 또는 Grouped-module identity                          |
| `entity-title`     | `16/24 · 600`         | Proportional    | 일반 List/Card Entity identity, Focused-page Entity identity는 아래 우선순위 규칙을 따름            |
| `entity-companion` | `14/20 · 400`         | Proportional    | 악곡 상세 Popover의 선택적 Localized/read identity, 계속 보이는 Canonical title보다 종속적이어야 함 |
| `body`             | `16/24 · 400`         | Proportional    | 일반 Reading, 설명 및 System message                                                                |
| `body-secondary`   | `14/20 · 400`         | Proportional    | Supporting identity 또는 간결한 Context text, Task-critical 의미의 유일한 전달자가 될 수 없음       |
| `control`          | `14/20 · 500`         | Proportional    | 보이는 Action 또는 Choice label, 입력 및 선택된 Field value는 아래 우선순위 규칙을 따름             |
| `metadata`         | `12/16 · 400`         | Proportional    | 짧고 진정으로 3차적인 Fact 또는 Annotation만                                                        |
| `metric-display`   | `32/40 · 700`         | Tabular figures | 명시적인 Label, Unit 및 Scope를 갖는 하나의 국소적 지배 승인 정량 결과                              |
| `metric-value`     | `14/20 · 500`         | Tabular figures | Row, Group, Control 또는 Visualization의 비교 정량 값, Context 없는 무표식 숫자가 될 수 없음        |

12개 Role은 의도적으로 다음 9개 물리 Composite를 공유합니다.

1. `40/48 · 700`;
2. `32/40 · 700`;
3. `24/32 · 700`;
4. `20/28 · 600`;
5. `16/24 · 600`;
6. `16/24 · 400`;
7. `14/20 · 500`;
8. `14/20 · 400`; 그리고
9. `12/16 · 400`.

이는 관리되는 Composite style이며 Size, Leading 및 Weight를 독립적으로 고르는
메뉴가 아닙니다. Page 또는 Component 작성자는 물리 조합이 아니라 Semantic role
또는 승인된 Alias를 선택합니다.

### 승인된 우선순위 및 Alias 규칙

1. **Focused entity identity:** Domain entity가 Focused page 또는 Task의
   Identity이면 보이는 Primary heading은 Entity의 Semantic 의미와 Canonical name을
   유지하면서 `page-title` Role을 사용합니다. Compact/기본 Composition에서는
   `24/32 · 700`으로 해석되고 Wide Composition이 활성화되면 아래의 승인된
   Substitution을 따릅니다. 예시는 Music
   Detail의 원문 Music title, Profile의 Username, 그리고 해당 Entity가 Page를
   소유하는 경우의 주요 Arcade 또는 Exam identity입니다. 같은 Entity가 일반
   List나 Card에 있으면 `entity-title` `16/24 · 600`을 사용합니다. 이는 관리된
   우선순위 규칙이며 13번째 Role이나 새 물리 Style이 아닙니다.
2. **Action label과 Field value:** Button, Tab, Filter, Menu item, Field label처럼
   Action 또는 사용 가능한 Choice를 명명하는 Text는 `control` `14/20 · 500`을
   사용합니다. 사용자가 입력한 값이나 Text 성격의 Field 안에 표시된 선택 값은
   기존 `body` Composite `16/24 · 400`을 사용합니다. 이는 Content 가독성을
   보존하며 별도 Input-value style을 만들지 않습니다.
3. **Metric 숫자:** `metric-display`와 `metric-value`는 비교 가능한 숫자에 Tabular
   figures를 활성화합니다. 다른 Role은 기본적으로 Proportional을 유지하며 Date나
   가끔 등장하는 숫자를 포함한다는 이유만으로 Tabular figures를 상속하지 않습니다.
4. **Display Gate:** 물리 `40/48 · 700` Composite는 존재하지만 `display`는 여전히
   드물고 자동 Page-family 배정이 없습니다. Production surface에서 사용하기 전에
   Normative specimen과 명시적 승인이 필요합니다.
5. **Semantic outline:** 시각 Composite 선택은 필요한 HTML Heading level을
   변경하지 않습니다. Entity에 `page-title` Treatment를 적용할 수 있지만 문서
   Outline과 Accessible name은 실제 Page 구조에 맞게 유지해야 합니다.

### 승인된 Responsive `page-title` substitution

Responsive 비교는 고밀도 Product system, 단계형 상위 Scale, Fluid expressive
scale, 다국어 System, 접근성 Standard 및 반응형 구현을 아우르는 다음 18개의
독립적이고 공식 또는 유지 관리되는 출처를 포함했습니다.
[Carbon](https://carbondesignsystem.com/elements/typography/type-sets/),
[Material 3](https://developer.android.com/develop/ui/compose/designsystems/material3),
[Atlassian](https://atlassian.design/foundations/typography),
[GOV.UK](https://design-system.service.gov.uk/styles/type-scale/),
[Primer](https://primer.style/product/css-utilities/typography/),
[USWDS](https://designsystem.digital.gov/components/typography/),
[GitLab Pajamas](https://design.gitlab.com/product-foundations/type-fundamentals/),
[일본 디지털청](https://design.digital.go.jp/dads/foundations/typography/),
[LINE](https://designsystem.line.me/LDSG/foundation/typography-en),
[Adobe Spectrum](https://spectrum.adobe.com/page/platform-scale/),
[Ant Design](https://ant.design/docs/spec/font/),
[Fluent 2](https://fluent2.microsoft.design/typography),
[SAP Fiori](https://experience.sap.com/fiori-design-web/typography/),
[Apple](https://developer.apple.com/design/human-interface-guidelines/typography),
[VA Design System](https://design.va.gov/foundation/typography),
[WCAG](https://www.w3.org/TR/WCAG21/),
[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp), 그리고
[Tailwind CSS](https://tailwindcss.com/docs/responsive-design)입니다.

출처들은 Wide viewport에서 모든 Role을 확대하는 방향을 지지하지 않습니다.
고밀도 Product system은 기능 Text를 안정적으로 유지하는 경우가 많으며, Size를
바꾸는 System도 일반적으로 상위 Hierarchy에만 변화를 제한합니다. Fluid 보간은
주로 Expressive 또는 Editorial context에 집중됩니다. NosLog는 하위 Scale을 다시
열거나 임의 중간값을 만들지 않으면서 의도적인 Desktop composition에서 더 강한
Page identity가 필요합니다. 따라서 하나의 단계형 Substitution만 승인합니다.

| Semantic role 또는 Group             | Compact/기본 Composition | Content-driven Wide composition | 숫자 기능       |
| ------------------------------------ | ------------------------ | ------------------------------- | --------------- |
| `page-title`                         | `24/32 · 700`            | `32/40 · 700`                   | Proportional    |
| `display`                            | `40/48 · 700`            | 변경 없음                       | Proportional    |
| `metric-display`                     | `32/40 · 700`            | 변경 없음                       | Tabular figures |
| `section-title` 및 모든 하위 UI Role | 승인된 기본 Composite    | 변경 없음                       | Role 기본값     |

Substitution은 다음과 같이 관리합니다.

1. `24/32 · 700`은 Mobile-first 및 Compact/기본 `page-title` Treatment로
   유지합니다.
2. Page가 승인된 Content-driven Wide composition에 진입하면 해당 Page의 모든
   일반 `page-title`은 `32/40 · 700`을 사용합니다. Page 작성자는 취향에 따라
   적용 여부를 고를 수 없으며 Focused entity도 같은 규칙을 상속합니다.
3. 정확한 전환 임계점은 `FTL-08`에서 사용 가능한 Title 영역과 주변 Layout
   제약을 기준으로 선택합니다. Device 이름에서 추론하거나 Framework
   Breakpoint를 복사하거나 Desktop browser라는 이유만으로 적용하면 안 됩니다.
4. 전환은 단계형입니다. Viewport-fluid `clamp()` 보간, 중간 Font size,
   Locale별 Size 또는 Page-local Responsive 값은 승인하지 않습니다.
5. `display`, `metric-display` 및 `page-title` 아래의 모든 Role은 Layout 폭과
   관계없이 승인된 Composite를 유지합니다. Wide 공간은 전역 Type 확대가 아니라
   비교, 분석, Column 및 Composition에 사용합니다.
6. Wide variant는 승인된 `32/40 · 700` 물리 Size, Leading 및 Weight primitive를
   Proportional figures와 함께 재사용합니다. 작성자가 직접 고를 수 있는 일반적인
   10번째 Style이 아니라 관리되는 `page-title` Responsive variant입니다.
7. Responsive composition은 접근성 확대를 대체하지 않습니다. 상대 단위,
   `200%` Text resize, `320 CSS px` Reflow, Text-spacing override 및 한국어,
   일본어, 영어, 혼합 Script 검증은 계속 필수입니다.

### 이번 Mapping과 Substitution으로 승인되지 않은 경계

이번 결정은 다음을 승인하지 않습니다.

- 승인된 `page-title` Substitution의 정확한 Viewport 또는 Container 임계점;
- `page-title` 이외 Role의 Responsive substitution 및 `metric-display` 또는
  `display`의 Wide-screen 확대;
- Fluid 보간 또는 임의 중간 Typography 값;
- 최대 Line count, Wrapping priority 또는 Truncation 동작;
- Component height, Padding, Target geometry 또는 주변 Spacing;
- Color, Opacity, Material, Alignment 또는 최종 Layout;
- 자동 `display` 배치; 또는
- 여기에 기록된 Semantic role identifier를 넘어서는 최종 Figma/Token 명명.

이 값들은 별도 Gate로 남으며 Foundation v0.1 승격 전에 통합 다국어 Specimen으로
검증해야 합니다.

### 승인된 Spacing primitive와 Role 경계

Spacing 비교는 Product system, Responsive grid, 다국어 Service, 공공 System,
Platform guidance, 접근성 Standard 및 현재 구현을 아우르는 다음 17개의 독립적이고
공식 또는 유지 관리되는 출처를 포함했습니다.
[Material 3](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Carbon](https://carbondesignsystem.com/elements/spacing/overview/),
[Atlassian](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Primer](https://www.primer.style/product/primitives/),
[SAP Fiori](https://experience.sap.com/fiori-design-web/spacing/),
[Fluent 2](https://fluent2.microsoft.design/layout),
[Adobe Spectrum](https://spectrum.adobe.com/page/spacing/),
[Ant Design](https://ant.design/docs/spec/layout/),
[일본 디지털청](https://design.digital.go.jp/dads/foundations/spacing/),
[USWDS](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK](https://design-system.service.gov.uk/styles/spacing/),
[LINE](https://designsystem.line.me/LDSG/foundation/layout-en/),
[Apple](https://developer.apple.com/design/human-interface-guidelines/layout),
[WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum),
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
그리고 [Tailwind CSS](https://tailwindcss.com/docs/responsive-design)입니다.

System마다 공개하는 값의 수와 대상 Platform의 Density는 다르지만 `4px` Fine unit,
`8px` Working rhythm, Compact component를 위한 `12px` 부근의 절제된 중간 Step 및
제한된 Sequence에서 고르는 큰 Gap으로 수렴합니다. LINE은 `4px` Rhythm의 예외로
`2px`을 명시하고, Spectrum은 같은 Small sequence를 제공하며, Primer는 일반적인
Stack gap을 `8px`, `16px`, `24px`에 집중합니다. 따라서 NosLog는 모든 큰 Editorial
또는 Platform 값을 가져오지 않고 간결한 Product-spacing 어휘를 채택합니다.

| Primitive 값 | 승인된 Role 경계                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `0px`        | 의도적으로 간격을 두지 않음                                                                     |
| `2px`        | Icon, Badge 또는 전문 Visualization 내부의 광학 보정 전용이며 일반 Layout spacing으로 사용 금지 |
| `4px`        | 내부적으로 분리하면 안 되는 Detail                                                              |
| `8px`        | Inline peer 및 밀접하게 관련된 Control                                                          |
| `12px`       | Compact component inset 및 고밀도 Control group                                                 |
| `16px`       | 기본 Component inset 및 관련 Content block                                                      |
| `24px`       | Subsection 분리                                                                                 |
| `32px`       | Section 분리                                                                                    |
| `48px`       | 주요 Page region 분리                                                                           |
| `64px`       | 기존 Component 또는 Section 관계로 Hierarchy를 표현할 수 없을 때만 쓰는 드문 큰 Page boundary   |

Primitive는 다음과 같이 관리합니다.

1. Product 작성자는 시각적 취향으로 Primitive를 고르지 않고 Semantic spacing role을
   사용합니다. 최종 Token 이름은 Grid, Container, Density 및 Target geometry 승인 후
   배정합니다.
2. `2px`은 일반 `gap`, Padding, Margin, Page layout 또는 Control layout에서 사용할 수
   없습니다. Alignment로 같은 결과를 만들 수 없는 문서화된 광학 보정이나 전문 Renderer
   geometry에만 존재합니다.
3. `40px`, `80px`, `96px`은 Foundation v0.1 공유 Spacing primitive가 아닙니다. 새
   인접값이나 큰 값은 대표 Specimen에서 승인된 관계로 필요한 Hierarchy를 표현할 수
   없음을 입증한 뒤에만 추가할 수 있습니다.
4. `gap-[13px]` 또는 `margin-top: 18px` 같은 임의 Application spacing은 허용하지
   않습니다. Domain visualization은 의미가 Application layout rhythm이 아닌
   Geometry에 실제로 의존할 때 측정된 예외를 등록할 수 있습니다.
5. 큰 간격도 실제 관계를 전달해야 합니다. Page 작성자는 성긴 Composition을 고급스럽게
   보이게 하려는 이유만으로 `48px` 또는 `64px`을 사용할 수 없습니다.
6. 이번 승인은 Primitive 축과 Role 경계만 선택합니다. Page margin, Grid gutter,
   Container padding, Responsive section step, Control height, Hit area 또는 Wide
   `page-title` 임계점은 아직 배정하지 않습니다.

### 승인된 Compact Page-grid geometry

Compact 비교에서 하나의 보편적인 업계 Column 수가 발견되지는 않았습니다. LINE은
`375px`에서 4열을, Atlassian은 `320px`부터 `479px`까지 2열을 사용하지만 두 System은
독립적으로 `16px` Inline margin과 `12px` Gutter를 사용합니다. Fluent도
`320–479px`을 가장 작은 Responsive 검증 범위로 다루며, WCAG Reflow는 일반적인
양방향 Scroll 금지 Test 폭으로 `320 CSS px`을 설정합니다. NosLog에는 `390px`을 고정
Shell로 만들지 않으면서 Single-column reading, 정사각형 Jacket 2열 Discovery 및
중첩된 3개 Quick navigation이 필요합니다. 4개 논리 열이 가장 적은 Page-level 작성자
변형으로 이 Span을 제공합니다.

| Compact geometry 항목 | 승인된 값 또는 동작                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| 검증 범위             | `320–479 CSS px`; Compact Test 계약이며 `480px`에서 자동 전환한다는 뜻이 아님                            |
| 대표 Canvas           | `390px`; 고정 Application 폭, 최소 폭 또는 보편 Breakpoint가 아님                                        |
| Inline Page margin    | 최소 `16px`; Full-width surface가 Safe area에 닿으면 `max(16px, env(safe-area-inset-left/right))`로 보호 |
| 논리 Column           | 4개의 동일한 Fluid column                                                                                |
| Column gutter         | `12px`                                                                                                   |
| 일반 Page content     | 4개 Column 전체를 Span                                                                                   |
| Jacket 2열 Grid       | 각 항목이 2개 Column을 Span하며, 승인된 Card pattern이 `1:1` Jacket을 요구할 때 항목을 정사각형으로 유지 |
| Quick 3열 Group       | Group은 Page 4열 전체를 Span하고 자체 3개 항목 내부 Layout을 만들며 Page grid를 왜곡하지 않음            |
| 가로 Overflow         | 일반 Page에서 금지하며 의미에 의존하는 2차원 Content만 문서화된 Contained overflow 경로를 사용할 수 있음 |

측정된 Geometry는 다음과 같습니다.

| Viewport | Content 폭 | 논리 Column 하나 | 2-Column 항목 |
| -------- | ---------- | ---------------- | ------------- |
| `320px`  | `288px`    | `63px`           | `138px`       |
| `390px`  | `358px`    | `80.5px`         | `173px`       |
| `479px`  | `447px`    | `102.75px`       | `217.5px`     |

Compact Grid는 다음과 같이 관리합니다.

1. 4개 Column은 Alignment 계약이며 모든 Wrapper가 CSS Grid를 사용하거나 Phone에 4개
   독립 Content column을 보여야 한다는 뜻이 아닙니다.
2. Page background, Divider, Header surface 및 그 밖의 승인된 Full-bleed treatment는
   Viewport edge에 닿을 수 있지만 일반 Content는 Safe `16px` Page margin에 맞춥니다.
3. Page margin은 `320 CSS px`에서 `16px` 아래로 줄지 않습니다. Content는 Margin을
   침식하거나 Typography와 Target을 축소하지 않고 Reflow, Wrap, Stack 또는 승인된
   Progressive disclosure를 사용해야 합니다.
4. Component inset은 Page margin과 별개입니다. Card나 Control은 Page grid 위에 있다는
   이유만으로 `16px` Padding을 상속하지 않으며, 추후 Semantic component role에 따라
   승인된 Inset을 선택합니다.
5. 상한 `479px`은 `480px`을 Viewport breakpoint로 승인하지 않습니다. 이후
   Composition은 측정된 Content 또는 Container 실패 지점에서만 바뀝니다.
6. Chart viewer, Sheet renderer, Chart, Map 및 Editor는 Domain 의미에 실제로 필요하고
   접근 가능한 Summary 또는 대체 Operation을 계속 제공할 때만 Contained 2차원 동작을
   예외로 등록할 수 있습니다.
7. 승인된 Geometry는 `320px`, `390px`, `479px` Width-switching 예시로 검토했습니다.
   최종 Foundation 승격에는 여전히 통합 `S1`–`S6` 다국어 Specimen 및 Zoom/Text-spacing
   검사가 필요합니다.

### 승인된 Container class와 Medium/Wide Grid model

Container 비교는 Compact geometry와 같은 폭넓은 근거를 사용했습니다. 여기에는
[Material 3 canonical layout](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Carbon Grid](https://carbondesignsystem.com/elements/2x-grid/overview/),
[Atlassian Grid](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Fluent 2 Layout](https://fluent2.microsoft.design/layout),
[Adobe Spectrum](https://spectrum.adobe.com/page/responsive-grid/),
[Ant Design Layout](https://ant.design/docs/spec/layout/),
[Japan Digital Agency](https://design.digital.go.jp/dads/foundations/layout/),
[USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK Width Container](https://design-system.service.gov.uk/styles/layout/#page-wrappers),
[LINE Layout](https://designsystem.line.me/LDSG/foundation/layout-en/),
[Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout),
[Primer Breakpoint](https://primer.style/product/primitives/breakpoints/),
[Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design),
[MDN Container Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)와 현재 NosLog
Page family 요구사항이 포함됩니다. 근거는 하나의 Universal maximum width보다 제한된
Reading/Application 영역, 의도적으로 더 넓은 분석 Surface 및 Fluid professional
workspace에 수렴합니다.

Container class와 Grid tier는 서로 다른 계약입니다. Container class는 Product task가
사용할 수 있는 가로 공간의 범위를 설명하고, Grid tier는 현재 사용 가능한 공간 안에서
공유 Alignment를 제공합니다. Route는 주 과업에 따라 기본 Class를 선택하며, Nested
region은 Content 역할이 달라질 때 더 좁은 Class를 사용할 수 있습니다. Page는 단지
Composition을 균형 있어 보이게 하려고 임의의 Local maximum width를 만들 수 없습니다.

| Container class | 승인된 최대 폭과 내부 Measure                                        | 기본 Product role 및 대표 Page family                                  |
| --------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `reading`       | Shell 최대 `768px`, 연속 Prose는 다시 `68ex`로 제한                  | Guide, Policy, Onboarding 설명 및 Settings/Help Reading region         |
| `standard`      | 최대 `1280px`                                                        | Home, Music discovery, Tiers, Bingo 및 Exams                           |
| `wide`          | 최대 `1440px`                                                        | Music-detail 분석, Rankings, Profile 및 Arcade discovery/detail        |
| `workspace`     | 고정 Maximum 없음, 승인된 Page margin 및 Safe-area 계약 안에서 Fluid | Chart Viewer, Chart Editor 및 의미상 필요한 Professional visualization |

공유 Page-alignment model은 다음과 같습니다.

| Grid tier    | 논리 Column | Gutter | 최소 Inline page margin | 승인 경계                                                                                                       |
| ------------ | ----------- | ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| Compact      | 4           | `12px` | Safe-aware `16px`       | `672 CSS px` 미만의 Page-layout Query container에서 활성화하며 `320–479 CSS px` Compact 검증 계약을 계속 요구함 |
| Intermediate | 8           | `16px` | Safe-aware `24px`       | `672 CSS px` Page-layout Query container에서 활성화하고 `1056 CSS px` 미만까지 유지함                           |
| Wide         | 12          | `16px` | Safe-aware `32px`       | `1056 CSS px` Page-layout Query container에서 활성화함                                                          |

#### 승인된 측정 전환 임계점

임계점 검토는 다음 16개의 독립적인 공식 또는 유지 관리 출처를 비교했습니다.
[WCAG Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html),
[MDN Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries),
[Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design),
[Atlassian Grid](https://atlassian.design/foundations/grid-beta/applying-grid/),
[Material 3 canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview),
[Fluent 2 Layout](https://fluent2.microsoft.design/layout),
[Carbon Grid](https://carbondesignsystem.com/elements/2x-grid/overview/),
[Primer breakpoints](https://primer.style/product/primitives/breakpoints/),
[Shopify Polaris breakpoints](https://polaris-react.shopify.com/tokens/breakpoints),
[GitLab Pajamas Layout](https://design.gitlab.com/product-foundations/layout/),
[SAP Fiori Flexible Grid](https://experience.sap.com/fiori-design-web/flexible-grid/),
[USWDS Layout Grid](https://designsystem.digital.gov/utilities/layout-grid/),
[GOV.UK Layout](https://design-system.service.gov.uk/styles/layout/),
[Singapore Government Design System Responsive Grid](https://www.designsystem.tech.gov.sg/foundations/layout/responsive-grid),
[Japan Digital Agency Layout](https://design.digital.go.jp/dads/foundations/layout/),
[Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout)입니다.

각 System은 유의미한 Intermediate 전환을 대략 `600–768px`, Wide 전환을 대략
`992–1056px`에 모으지만 정확한 값에는 동의하지 않습니다. Page alignment는 안정된
Tier를 사용할 수 있고 Nested component는 자기 Container의 실제 가용 공간에서
재구성한다는 원칙에 수렴합니다. 따라서 Framework 숫자는 비교 근거로 남으며 NosLog
값을 선택한 이유가 되지 않습니다.

`320`, `390`, `479`, `600`, `768`, `900`, `1024`, `1280`, `1440 CSS px`에서
현재 Browser를 검사한 결과, 구현된 Home, Music discovery, Rankings 및 Music Detail
사용자 Shell은 `479px`부터 약 `390px`에서 확장을 멈춥니다. Page title과 내부
Composition도 Wide viewport에서 사실상 바뀌지 않습니다. 이는 2.0 Layout 권위가
아니라 관찰된 실패 근거입니다. 현재 Breakpoint로는 사용할 수 있는 전환 임계점을
도출할 수 없습니다.

NosLog에서 승인한 Margin과 Gutter를 적용하면 다음 진입 Geometry가 나옵니다.

| 진입 Canvas         | 계산                         | 논리 Track 폭 |
| ------------------- | ---------------------------- | ------------- |
| `320px`, 4 Column   | `(320 − 2×16 − 3×12) ÷ 4`    | `63px`        |
| `672px`, 8 Column   | `(672 − 2×24 − 7×16) ÷ 8`    | `64px`        |
| `1056px`, 12 Column | `(1056 − 2×32 − 11×16) ÷ 12` | `68px`        |

결과인 `63→64→68px` Track 연속성이 두 임계점의 NosLog 고유 측정 근거입니다.
승인 계약은 다음과 같습니다.

1. `672 CSS px` 미만의 Page-layout Query container는 4-Column Alignment model을
   사용합니다.
2. `672 CSS px`부터 `1055 CSS px`까지는 8-Column Alignment model을 사용합니다.
3. `1056 CSS px` 이상에서는 12-Column Alignment model을 사용합니다.
4. Query 대상은 Device 이름이 아니라 내부 Page margin을 적용하기 전의 사용 가능한
   Page-layout canvas입니다. 제한된 Workspace main region 또는 관리되는 다른 Nested
   layout은 실제 Display나 Browser 폭이 아니라 자체 가용 Inline size를 Query합니다.
5. 이 값은 공유 Page alignment만 전환합니다. Card count, Row anatomy, Pane count,
   Filter arrangement 또는 Component shape를 자동으로 바꾸지 않습니다. Component는
   별도로 측정한 Content-failure 지점을 사용하고 Nested 상태에서는 Container query를
   사용해야 합니다.
6. `reading` Container는 최대 `768px`이므로 Browser가 넓다는 이유만으로 12-Column
   Reading surface가 되지 않습니다.
7. Browser zoom과 Window tiling으로 Query-container가 줄면 정보나 기능 손실 없이
   더 낮은 Tier로 돌아갈 수 있습니다.

#### 승인된 Wide `page-title` 활성화

기본 `page-title`은 Proportional `24/32 · 700`을 유지합니다. 다음 조건을 모두
만족할 때만 Proportional `32/40 · 700`으로 단계 전환합니다.

1. 소유 Page-layout Query container가 `1056 CSS px` 이상인 12-Column Tier에 있음
2. Title text region이 12개 Alignment track 중 최소 8개를 차지하거나, 다른 관리되는
   Title region에서 측정된 Inline 공간이 최소 `640 CSS px`임
3. Title이 `reading` Composition 안에 있지 않음

12-Column 진입 Canvas에서 8개 Track과 7개 Gutter는 약 `656px`을 제공하여 측정된
Title-space 조건을 만족합니다. 6개 Track으로 줄어든 Title region은 약 `488px`만
제공하므로 Wide browser에서도 기본 `24/32 · 700` Composite를 유지합니다. Focused
Music 및 다른 Entity title도 같은 규칙을 상속합니다. 긴 제목은 줄바꿈할 수 있으며,
이번 결정은 최대 Line count, Truncation 또는 한 줄 요구사항을 정하지 않습니다.

Repository의
[NOSTALGIA Music source data](../../prisma/data/nosdata-musics.json)에는 원문 제목 약
54자, 일본어 읽기 49자, Artist 67자까지 존재합니다. 따라서 통합 Specimen은 짧은
Placeholder heading이 아니라 실제 긴 Latin, 한국어 및 일본어 Identity를 포함해야
합니다.

임계점 검증은 `320`, 대표 `390`, `479`, `480`, `768`, `1024`, `1280`, `1440 CSS px`
외에 `671/672/673`, `1055/1056/1057 CSS px`을 포함해야 합니다. 또한 Browser `200%`
Zoom, 한국어·일본어·영어 긴 Content, Safe area 및 Workspace panel 변경을 다룹니다.
하나의 `390px` Canvas나 Desktop viewport 하나를 통과하는 것은 계약 검증이 아닙니다.

Container와 Grid model은 다음 규칙을 따릅니다.

1. Maximum width는 고정 Canvas가 아니라 상한입니다. 모든 Class는 Maximum 아래에서
   Fluid하게 동작하고 승인된 작은 폭 Page margin과 Reflow 규칙을 보존해야 합니다.
2. `reading`은 Shell과 별도로 연속 Prose를 제한합니다. Form, Summary 및 Contextual
   control은 `768px` Shell을 사용할 수 있지만 Paragraph는 `68ex` 이하를 유지하며,
   Desktop 공간을 채우기 위해 Prose를 늘리지 않습니다.
3. `standard`는 일반 Discovery 및 Task completion의 기본 Application container입니다.
   모든 Section을 3열로 만들거나 모든 Child component가 `1280px` 전체를 채워야 한다는
   뜻이 아닙니다.
4. `wide`는 동시 비교, 분석, Ranking context, Map 또는 Profile evidence가 실질적으로
   이득을 얻는 Task에만 사용합니다. 일반 Page를 시각적으로 확대하는 Prestige variant가
   아닙니다.
5. `workspace`는 Domain canvas와 조절 가능한 Tool에 가용 폭을 사용합니다. 고정 Maximum이
   없더라도 일반 Text, Control 또는 Inspector가 제한 없이 늘어날 수 없으며 해당
   Subregion은 별도의 Reading 또는 Component 제약을 유지합니다.
6. Wide viewport에서 `reading` Region은 8-Column 내부 Alignment를 유지할 수 있고
   `standard`, `wide`, `workspace` Composition은 12-Column Page model을 사용할 수
   있습니다. Compact width에서는 모든 일반 Page content가 승인된 4-Column Alignment
   계약으로 돌아갑니다.
7. Grid column은 보이는 Card, Panel 또는 Content column 개수를 강제하지 않는
   Alignment track입니다. Collection column 수는 승인된 Minimum item width, Content
   length 및 Task 요구사항을 따릅니다.
8. 승인된 `672px` 및 `1056px` 전환은 Page-layout Query container에 구현하고 위의
   인접 경계 폭에서 검증해야 합니다. Framework breakpoint, Device label 또는 예시
   Comparison canvas는 해당 검사를 대체하지 않습니다.
9. 승인된 Wide `page-title` Substitution에는 12-Column Tier와 위에서 측정한
   Title-region 조건이 모두 필요합니다. Container 이름이나 Desktop browser 감지만으로는
   부족합니다.
10. 이번 승인은 Component padding, Panel ratio, Card count, Sidebar 존재 여부,
    Resizable-tool 치수, Target size 또는 최종 Screen composition을 정하지 않습니다.

### 승인된 Density 및 Target geometry 계약

Density와 Target 비교는 공식 접근성 기준, Platform 지침, Product system, 고밀도
Professional interface, Rhythm-game discovery 및 현재 NosLog 근거를 다뤘습니다. 주요
출처에는
[WCAG 2.2 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum),
[WCAG Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced),
[Apple Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility),
[Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons),
[Android View Accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views),
[Android Mobile Accessibility](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility),
[Fluent 2 Layout](https://fluent2.microsoft.design/layout),
[일본 디지털청 Button](https://design.digital.go.jp/dads/components/button/),
[일본 디지털청 Button Accessibility](https://design.digital.go.jp/dads/components/button/accessibility/),
[USWDS Search Accessibility Tests](https://designsystem.digital.gov/components/search/accessibility-tests/),
[Adobe Spectrum Platform Scale](https://spectrum.adobe.com/page/platform-scale/),
[Adobe Spectrum Button](https://spectrum.adobe.com/page/button/),
[Carbon Button Style](https://carbondesignsystem.com/components/button/style/),
[Carbon Button Usage](https://carbondesignsystem.com/components/button/usage/),
[Primer Size Primitives](https://primer.style/product/primitives/size/),
[Ant Design Theme Tokens](https://ant.design/docs/react/customize-theme/),
[SAP Fiori Content Density](https://experience.sap.com/fiori-design-web/cozy-compact/),
[osu! Beatmap Filter 지침](https://osu.ppy.sh/wiki/en/Beatmap/Genre_and_language) 및
[V-ARCHIVE 서열표 안내](https://v-archive.net/info/manual/grade)가 포함됩니다.

표준은 적합성 하한과 편안한 조작 Target을 구분합니다. WCAG는 정의된 예외와 함께
`24 × 24 CSS px` Level AA 최소값과 `44 × 44 CSS px` 강화 Target을 정합니다. Apple,
Android, Fluent, 일본 디지털청 및 USWDS는 Touch 중심 상호작용에서 `44–48px`에
수렴합니다. Spectrum은 보이는 Control geometry와 Cursor·Touch hit area를 명시적으로
분리합니다. Carbon, Primer, Ant Design 및 SAP는 임의의 Local height 연속 범위를
노출하지 않고 `32px`, `40px`, `44–48px` Control이 Compact, 일반 및 Touch 중심
Product context를 지원할 수 있음을 각각 보여줍니다.

현재 NosLog 근거는 전역 확대 규칙보다 제한된 계약이 필요함을 확인합니다. 공용
[`Button`](../../components/ui/Button.tsx)은 이미 `32px`, `40px`, `48px`을 사용하지만
Route-local Control은 `24px`, `28px`, `36px`, `44px` Height를 반복합니다. Browser
검사에서는 같은 사용자 Shell 안에 `32px`, `40px`, `44px` Control과 함께 Music
discovery의 정렬 및 보기 Target이 약 `22px`로 측정됐습니다. 이 수치는 승인된 2.0
Geometry가 아니라 현재 Product 관찰값입니다. Rhythm-game Reference는 고밀도 Filter와
비교 Surface 필요성을 확인하지만, 전체 Public interface를 축소하거나 해당 시각 처리를
전이할 근거는 아닙니다.

#### 공유 Visible control-height Step

| Step          | 보이는 높이 | 승인된 사용 경계                                                                                                                                         |
| ------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Compact`     | `32px`      | 명시적으로 승인된 고밀도 Data region, Rankings 비교, Viewer toolbar 또는 Editor workspace의 반복 Control. 일반 Touch-first Page 기본값으로 사용하지 않음 |
| `Standard`    | `40px`      | 일반 Public 및 Authenticated application Control의 기본 보이는 높이                                                                                      |
| `Comfortable` | `48px`      | 두드러지는 Mobile action, Search와 기타 고빈도 Touch control 및 중요한 순차·확정·파괴적·오류 민감 Interaction                                            |

이 Label은 최종 구현 Token 이름이 아니라 Foundation role 이름입니다. 이후 구현 Mapping은
Code 관례에 맞는 이름을 사용할 수 있지만 세 값과 Role 경계를 보존해야 합니다.

#### Effective target 계약

1. `44px`은 네 번째 공유 Visible control-height token이 아니라 유효 Interaction target
   계약입니다. 보이는 `40px` Control은 일반적으로 최소 `44 × 44px` Effective target을
   차지하거나 제공해야 합니다.
2. 작성된 Interactive target은 문서화된 WCAG 예외가 실제로 적용되는 경우를 제외하고
   WCAG `24 × 24 CSS px` Level AA 하한보다 작을 수 없습니다. Spacing 예외를 작은 반복
   Control을 유지하는 일반 수단으로 사용할 수 없습니다.
3. 일반 Public 및 Authenticated control은 최소 `44 × 44px` Effective target을
   사용합니다. Composition이 허용할 때 두드러지고 고빈도이며 순차적이거나 파괴적이고
   오류에 민감한 Touch action에는 보이는 크기와 Effective target 모두 `48px`을
   선호합니다.
4. Coarse pointer 또는 Touch 조작에 노출되는 보이는 `32px` Compact control은 Layout
   spacing, Wrapper 또는 겹치지 않는 Hit-area 확장을 통해 최소 `44 × 44px`에 도달해야
   합니다. 확장된 Target은 겹치거나 인접 Action을 모호하게 만들 수 없습니다.
5. 전문 Viewer 또는 Editor workspace는 관리된 Fine-pointer 예외로만 `32 × 32px`
   Effective target을 사용할 수 있습니다. 해당 Region은 계속 WCAG 최소값과 Target
   spacing 계약을 충족하고, 보이는 Keyboard focus와 동등한 Keyboard 또는 대체 조작을
   제공하며, Coarse-pointer 사용 시 `44px` Target 또는 Standard/Comfortable 표현으로
   전환해야 합니다.
6. Fine-pointer 예외는 Primary, Destructive, 되돌리기 어렵거나 고빈도 순차 및
   Safety-critical action에 금지합니다. Viewport width만으로 Fine pointer가 있다고
   판단할 수 없습니다.
7. 보이는 Label typography는 승인된 Semantic `control-label` Role을 따릅니다. 한 Row의
   Wrap을 막기 위해 더 작은 Target이나 Type size를 도입할 수 없으며, Composition이
   Reflow, Grouping 또는 Secondary control disclosure를 사용해야 합니다.

#### Density 관리

1. Density는 임의의 Page-local 선호가 아니라 Product task와 제한된 Region에 따라
   배정합니다. 별도로 문서화된 Hierarchy가 다른 처리를 요구하지 않는 한 하나의 Group에
   있는 Peer control은 하나의 Visible-height step을 사용합니다.
2. Mobile-first는 보이는 모든 Control이 `48px`이라는 뜻이 아닙니다. 일반 Control은
   시각적으로 `40px`, Compact control은 `32px`을 유지할 수 있지만 Effective touch
   target과 Spacing 계약을 보존해야 합니다.
3. Foundation v0.1은 전역 사용자 Density preference를 제공하지 않습니다. 실제 Content
   task를 바꾸는 승인된 View-specific 표현 선택은 유지할 수 있지만, 제한 없는
   Application-wide Compact switch가 될 수 없습니다.
4. `24px`, `28px`, `36px`, `44px`은 공유 Visible control-height step이 아닙니다.
   `44px`은 Target geometry에 속합니다. 현재 `28px`, `36px` Editor control은 이후
   사용자용 Editor Mapping이 `32/40/48px`을 채택하거나 측정된 전문 예외를 등록할
   때까지 구현 근거로 남습니다.
5. 이번 결정은 현재 Application을 Redesign하거나 즉시 Migration하지 않습니다. 이후
   Claude Design 작업과 별도 NosLog 2.0 구현 Session의 권위 있는 Geometry를 정합니다.

#### 검증 계약

- 세 Visible step과 Effective target을 `320px`, 대표 `390px`, 측정된 Intermediate
  width 및 Wide desktop composition의 통합 `S1`–`S6` 한국어, 일본어, 영어 및 혼합
  Script specimen에서 검증합니다.
- 보이는 Button bound만 보고 사용성을 추론하지 말고 Target rectangle을 검사합니다.
  확장된 Target이 겹치지 않고 인접 Action이 Zoom과 Text-spacing override에서도 구분되는지
  확인합니다.
- Keyboard order, 보이는 Focus, Coarse 및 Fine pointer, Hybrid input 및 `200%` Text
  resize를 Test합니다. Pointer media query만으로 물리 Device가 하나의 Input method만
  지원한다고 입증할 수 없습니다.
- 현재 `22–48px` 범위는 Migration 근거로 취급합니다. Foundation 승격 전 대표
  Discovery, Ranking, Viewer 및 Editor composition이 고빈도 Action을 숨기거나 일반
  Page에 2차원 Overflow를 만들지 않고 승인된 계약을 사용할 수 있음을 입증해야 합니다.

## 선택하지 않은 대안

| 대안                                                              | 상태       | 이유                                                                                                                                                               |
| ----------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `14px`을 Universal body 및 Interface base로 사용                  | `Rejected` | Reading과 CJK content를 압축하는 현재 경향을 반복하고 광범위한 Small text를 막는 명확한 경계를 만들지 못함                                                         |
| 모든 일반 Body, Result, Control 및 고밀도 Row에 `16px` 사용       | `Rejected` | Reading은 보호하지만 Ranking, Discovery result 및 Professional-tool surface를 불필요하게 확대함                                                                    |
| Density를 보존하기 위해 더 작은 Mobile scale 사용                 | `Rejected` | Mobile-first 가독성, CJK 근거 및 Reflow와 Content hierarchy로 Fit을 해결한다는 승인된 전략과 충돌함                                                                |
| 서로 무관한 별도 Mobile 및 Desktop 하위 Scale 사용                | `Rejected` | 공유 Role 의미를 불안정하게 만들고 Page 및 Breakpoint별 Typography 분산을 다시 만들 위험이 있음                                                                    |
| Reading Pairing과 함께 별도 Compact `14/18`, `16/22` Pairing 추가 | `Rejected` | Carbon은 타당한 이중 System을 보여주지만 NosLog specimen이 필요성을 입증하기 전에 초기 하위 Line-height 축을 3개에서 5개로 늘림                                    |
| `12/18`, `14/21`, `16/24`의 Universal `1.5` 비율 적용             | `Rejected` | 긴 Reading은 보호하지만 짧은 Tertiary 및 Product-interface text를 불필요하게 느슨하게 만들고 System 밖 `18px`, `21px` Step을 추가함                                |
| `400`과 `700`만 사용                                              | `Rejected` | 단순하지만 일반 Reading, Interactive control, Entity identity 및 최상위 강조 사이의 차이가 너무 큼                                                                 |
| `400`, `500`, `700` 사용                                          | `Rejected` | 절제된 Control은 지원하지만 Compact heading과 Entity identity가 약한 Medium과 무거운 Bold 중 하나를 선택하게 함                                                    |
| `400`, `600`, `700` 사용                                          | `Rejected` | 강한 Hierarchy는 지원하지만 절제된 Interactive step이 없고 현재 Semibold 과용을 유지할 위험이 있음                                                                 |
| 모든 Pretendard JP Weight 또는 임의 Variable 값 노출              | `Rejected` | Font 기능은 Semantic 필요가 아니며 통제되지 않은 Page별 강조를 다시 만듦                                                                                           |
| Carbon, Material, Apple 또는 USWDS Tracking 값 가져오기           | `Rejected` | 해당 값은 다른 Font, Platform, Size 및 Composite role에 결합되어 있음                                                                                              |
| 일반 UI에 Generic `tight`, `normal`, `wide` Utility 공개          | `Rejected` | NosLog Specimen이 Semantic 필요를 입증하기 전에 통제되지 않은 Local styling 축을 만듦                                                                              |
| 초기 전략으로 Locale 또는 Viewport별 Tracking 조정                | `Rejected` | 줄바꿈과 QA 변형을 늘리고 안정적인 Localized composition과 충돌함                                                                                                  |
| 초기 공유 Ramp에 `18px`, `28px`, `36px`을 미리 추가               | `Rejected` | 대표 Specimen에서 빠진 Semantic distinction을 입증하기 전에 인접 Step이 작성자 선택과 검증 비용을 늘림                                                             |
| `40px`을 일반 Page, Card, Dialog 또는 Section title에 허용        | `Rejected` | 승인된 드문 Display 경계를 무너뜨리고 Page별 강조 분산을 다시 만듦                                                                                                 |
| 조밀한 상위 Pairing `20/24`, `24/28` 사용                         | `Rejected` | 짧은 한 줄 UI Label에는 맞지만 긴 일본어 Music title이나 혼합 Script identity의 줄바꿈을 보호하지 못함                                                             |
| Gate를 둔 `40px` Display에 기본 `52px` Leading 추가               | `Rejected` | NosLog가 승인하지 않은 여러 줄 Editorial display 동작을 가정하고 Specimen 근거 없이 Primitive를 하나 더 추가함                                                     |
| 각 Semantic role에 독립 물리 Composite 부여                       | `Rejected` | Semantic 정밀도를 시각 다양성으로 오해하며 Foundation이 막으려는 Local-style 분산을 다시 만듦                                                                      |
| `page-title`에 기본 `32/40 · 700` 사용                            | `Rejected` | Compact 화면에서 일반 Page identity를 과장하고 주요 정량 결과에 필요한 지배 Step을 소비함                                                                          |
| 모든 Composition에서 `page-title`을 `24/32 · 700`으로 유지        | `Rejected` | 일관성은 극대화하지만 NosLog가 의도적인 Wide Desktop workspace로 재구성될 때 Page identity가 너무 약해질 수 있음                                                   |
| `page-title`을 `24px`과 `32px` 사이에서 Fluid 보간                | `Rejected` | 승인되지 않은 중간값, 지속적인 다국어 줄바꿈 변화 및 Product-task 이득 없는 더 넓은 QA 범위를 만듦                                                                 |
| Wide 화면에서 Body, Metadata, Control 또는 반복 Entity title 확대 | `Rejected` | Desktop 공간을 비교와 분석 대신 전역 확대에 사용하고 고밀도 Product hierarchy를 불안정하게 만듦                                                                    |
| 모든 `entity-title`에 `20/28 · 600` 사용                          | `Rejected` | 반복되는 Discovery, Ranking 및 Archive surface를 과도하게 확대하며 Focused entity에는 이미 관리된 `page-title` 우선순위가 있음                                     |
| `entity-companion`을 `12/16 · 400`으로 축소                       | `Rejected` | Localized/read identity는 3차 Metadata가 아니라 유용한 Popover Content이며 한국어·일본어·영어·혼합 Script 사례에서 읽을 수 있어야 함                               |
| Action label과 입력 Field value에 하나의 Composite 사용           | `Rejected` | 두 작업은 다르며 Compact Medium label은 Interaction을 알리고 입력·선택 Content는 일반 가독성 Body treatment가 적합함                                               |
| 주요 Metric에 `40/48 · 700` 사용                                  | `Rejected` | 드문 표현 Display 순간과 `metric-display` `32/40 · 700`이 제공하는 제한된 정량 Hierarchy 사이의 경계를 무너뜨림                                                    |
| Metric value를 Heading role로 Styling                             | `Rejected` | Metric에는 문서 Heading semantic이 아니라 Tabular alignment, 명시적 Label과 Unit 및 안정적 비교 동작이 필요함                                                      |
| Spectrum, Fluent 또는 Marketing system의 전체 Large ramp 공개     | `Rejected` | NosLog는 고밀도 Product surface이므로 대표 Composition이 빠진 관계를 입증하기 전에 `40/80/96px` 선택지를 추가하면 Local 작성자 재량이 커짐                         |
| `4px` 또는 `12px` 없는 엄격한 `8px` Scale 사용                    | `Rejected` | 유용한 Compact CJK 및 Control 관계를 제거하고 광학 또는 고밀도 Component 요구를 임의 예외로 밀어냄                                                                 |
| `2px`을 일반 Layout step으로 취급                                 | `Rejected` | 감지하기 어려운 Hierarchy 차이를 만들고 현재의 Page-local Micro-spacing 난립을 다시 만듦                                                                           |
| Compact Page margin을 `12px` 또는 Viewport 비율로 축소            | `Rejected` | 작은 폭 이득이 안정적인 Edge rhythm과 Safe-area 동작을 약화하며 NosLog는 Margin 침식이 아니라 Reflow로 Fit을 해결해야 함                                           |
| Compact Gutter에 기본 `16px` 사용                                 | `Rejected` | 가능하지만 수렴하는 `12px` Gutter보다 강한 Hierarchy 이득 없이 정사각형 Card와 CJK Control의 유용한 폭을 포기함                                                    |
| Compact 4-Column 계약을 4개의 보이는 Content column으로 취급      | `Rejected` | Alignment system을 Content density로 오해하며 좁은 화면에 읽기 어려운 반복 Region을 만듦                                                                           |
| `480px`을 자동 다음 Composition breakpoint로 설정                 | `Rejected` | Reference 범위는 검증 근거이지 NosLog Content가 해당 Viewport 폭에서 재구성되어야 한다는 증거가 아님                                                               |
| 모든 NosLog Page에 하나의 Maximum width 사용                      | `Rejected` | Reading, Discovery, Comparison, Mapping 및 Chart-editing task는 가로 공간 요구가 실질적으로 다름                                                                   |
| 모든 Desktop Page를 Maximum 없이 확장                             | `Rejected` | Prose measure와 관계 명확성을 해치고 현재의 늘어난 Mobile column 문제를 다시 만듦                                                                                  |
| 각 Page가 임의의 Local maximum width를 선택하도록 허용            | `Rejected` | 관리되는 재사용 System 대신 불일치 Keyline과 Page별 Layout 분산을 다시 만듦                                                                                        |
| `768px`, `1280px`, `1440px`을 고정 Canvas로 취급                  | `Rejected` | 해당 값은 상한이며 Fixed canvas는 Mobile-first Reflow, Intermediate width, Safe area 및 Zoom과 충돌함                                                              |
| Framework breakpoint를 4→8열과 8→12열 전환으로 복사               | `Rejected` | Framework 기본값은 NosLog의 다국어 Content, Control 또는 Domain visualization이 재구성을 필요로 하는 지점을 입증하지 못함                                          |
| NosLog Geometry 없이 관습적인 `640px`, `1024px` 값 사용           | `Rejected` | 유효한 Reference 군집이지만 측정한 `672px`, `1056px` 진입만큼 승인된 Page margin, Gutter 및 논리 Track geometry를 일관되게 보존하지 못함                           |
| 공유 Grid 전환을 `768px`, `1280px`까지 지연                       | `Rejected` | 유용한 Intermediate·Comparison 공간을 사용하지 못하고 각 전환 전에 논리 Track을 불균형하게 크게 만듦                                                               |
| 모든 Component를 공유 Page-grid 임계점에서 재구성                 | `Rejected` | Page alignment와 Component anatomy는 서로 다른 제약을 해결함. Nested card, Filter, Pane 및 Tool은 자체적으로 측정한 Container 실패에 반응해야 함                   |
| Browser 폭 또는 Container class만으로 Wide `page-title` 활성화    | `Rejected` | Action, Media, Side pane, Zoom 또는 Window tiling 때문에 Wide browser에서도 Title region이 좁을 수 있으므로 승인된 측정 공간이 필요함                              |
| 단순히 Standard page를 넓어 보이게 하려고 `workspace` 사용        | `Rejected` | 무제한 Class는 의미상 필요한 Canvas, Visualization 및 조절 가능 Tool task로만 정당화됨                                                                             |
| 모든 Control에 하나의 Universal `48px` Visible height 사용        | `Rejected` | Touch 조작은 보호하지만 고밀도 비교와 Professional-tool region을 불필요하게 확대함. 모든 Visible control을 같게 만들지 않고 Target 계약으로 Touch를 보호할 수 있음 |
| 현재의 모든 `22–48px` Local control height 유지                   | `Rejected` | 우연한 Page별 분산을 유지하고 작은 Target을 남기며 재사용 Component Mapping을 방해함                                                                               |
| `44px`을 네 번째 공유 Visible control height로 추가               | `Rejected` | Touch-target geometry와 시각 Component hierarchy를 혼동하고 별도 Product role 없이 작성자 선택을 늘림                                                              |
| Compact density를 Mobile 기본값으로 사용                          | `Rejected` | Reflow와 Hierarchy가 아니라 작은 Control로 Fit을 해결하는 현재 경향을 반복하며 Touch 조작을 약화함                                                                 |
| Foundation v0.1에 제한 없는 전역 Density preference 제공          | `Rejected` | 제품 전반의 사용자 필요가 확립되기 전에 Responsive, Localization, Accessibility 및 QA state를 늘림                                                                 |
| 인접 Compact control 주변의 보이지 않는 Hit area 겹침 허용        | `Rejected` | 각 명목 Rectangle이 충분히 크더라도 모호한 Activation을 만듦                                                                                                       |
| Viewport width를 Mouse 또는 Touch input의 증거로 취급             | `Rejected` | Hybrid device를 지원하지 못하고 사용 가능한 Layout 공간과 실제 Input capability를 혼동함                                                                           |

## 결정 기록

| ID        | 결정                                                                                                                                                                                                                                                                                                                                      | 상태       |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `FTL-01`  | 위 Role 경계와 반응형 제약을 포함하여 `12px`, `14px`, `16px`을 공유 하위 물리 Type core로 사용함                                                                                                                                                                                                                                          | `Approved` |
| `FTL-02`  | 위 검증 제약을 조건으로 `16px`, `20px`, `24px`을 하위 Line-height primitive로 사용하고 `12/16`, `14/20`, `16/24`를 기본으로 함                                                                                                                                                                                                            | `Approved` |
| `FTL-03`  | 위 Semantic, 사용 빈도, 반응형 및 검증 제약과 함께 `400`, `500`, `600`, `700`만 공유 Weight primitive로 사용함                                                                                                                                                                                                                            | `Approved` |
| `FTL-04`  | 모든 공용 UI Role에 자연/기본 간격을 사용하고 Kerning을 유지하며 공유 양수·음수 Tracking token을 노출하지 않고 드문 예외를 명시적으로 관리함                                                                                                                                                                                              | `Approved` |
| `FTL-05`  | `20px`, `24px`, `32px`을 일반 상위 Core로 사용하고 `40px`은 별도 승인 Composite로 제한하며 최종 Map에서는 `display`에만 배정함                                                                                                                                                                                                            | `Approved` |
| `FTL-06`  | 위 경계와 함께 `28px`, `32px`, `40px`, `48px`을 상위 Line-height primitive로 사용하고 `20/28`, `24/32`, `32/40`, `40/48`을 기본으로 함                                                                                                                                                                                                    | `Approved` |
| `FTL-07`  | 12개 Semantic role을 위 9개 승인 Composite에 Mapping하고 Focused-entity 및 Field-value 우선순위, Metric Tabular figures 및 Display Gate를 적용함                                                                                                                                                                                          | `Approved` |
| `FTL-08`  | Spacing, Grid, Container, Density, Target geometry 및 측정된 Responsive-transition 값을 선택함                                                                                                                                                                                                                                            | `Approved` |
| `FTL-08A` | `0/2/4/8/12/16/24/32/48/64px`을 제한된 Spacing primitive 축으로 사용하고 `2px`을 관리된 광학 또는 전문 Visualization 보정에만 두며 Semantic role을 요구하고 임의 공유 Application spacing을 금지함                                                                                                                                        | `Approved` |
| `FTL-08B` | `16px` Safe-aware Inline page margin, 4개의 동일한 논리 Column 및 `12px` Gutter와 함께 Compact `320–479 CSS px` 검증 계약을 사용하고 일반적인 가로 Overflow 없는 Reflow를 유지하며 `480px` 전환 Breakpoint를 추론하지 않음                                                                                                                | `Approved` |
| `FTL-08C` | 각각 `768px`, `1280px`, `1440px`, Fluid maximum 동작을 갖는 `reading`, `standard`, `wide`, `workspace` Container class를 사용하고, `12/16/16px` Gutter와 `16/24/32px` Safe-aware margin을 갖는 4/8/12-Column Compact/Intermediate/Wide Alignment model을 사용함                                                                           | `Approved` |
| `FTL-08D` | `32/40/48px`을 제한된 Compact/Standard/Comfortable Visible control-height step으로 사용하고, `44px`을 네 번째 Visible step이 아니라 일반 Effective target 계약으로 취급하며, `32px` Effective target은 관리된 Fine-pointer Viewer/Editor 예외로만 허용하고 제한 없는 전역 Density preference를 제공하지 않음                              | `Approved` |
| `FTL-08E` | Page-layout Query container가 `672 CSS px`이면 공유 8-Column Alignment, `1056 CSS px`이면 12-Column Alignment를 활성화하고, Component 재구성은 별도로 측정한 Container 실패를 따르며, Wide `page-title`은 12-Column Tier에서 Text region이 최소 8개 Track을 차지하거나 `640 CSS px` 이상일 때만 활성화하고 `reading` Composition은 제외함 | `Approved` |
| `FTL-09`  | 다른 모든 Role은 폭에 따라 고정하고 `page-title`만 `FTL-08E`의 12-Column 및 측정 Title-region 조건에서 `24/32 · 700`에서 Proportional `32/40 · 700`으로 단계 전환하며 Fluid 보간을 금지함                                                                                                                                                 | `Approved` |

## 다음 승인 Gate

다음 제한된 Gate는 승인된 Typography 및 Layout 계약을 통합 `S1`–`S6` 다국어
Specimen에서 검증하는 것입니다. 인접 전환 폭, `320 CSS px` Reflow, `200%` Zoom,
Safe area, 실제 긴 Content, Control target 및 Workspace-panel 변경을 포함합니다.
이 Gate를 통과하면서 Component별 Failure point를 다듬을 수 있지만 `FTL-08E`를
조용히 변경하거나 최대 Line count, Truncation, Color, Material, Panel ratio 또는
최종 Component layout을 승인할 수 없습니다. 충돌이 생기면 Foundation v0.1 승격
전에 명시적 수정 결정으로 사용자에게 되돌려야 합니다.
