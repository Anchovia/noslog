# NosLog 2.0 C5 Feedback, Domain 및 Data Color 레퍼런스 조사

## 문서 관리

- 상태: `13A FS-BN 승인; 13B domain 및 13C data-color Gate 대기`
- 정본 언어: English
- 영문 정본:
  [53-foundation-c5-feedback-domain-data-color-reference-research.md](./53-foundation-c5-feedback-domain-data-color-reference-research.md)
- 날짜: 2026-08-10
- Controlled 시각 비교:
  [문서 54](./54-foundation-c5-feedback-status-source-visual-comparison.ko.md) 및
  [interactive artifact](./specimens/c5-feedback-status-source-comparison.html)
- `13B` 자격 조사:
  [문서 55](./55-foundation-c5-nostalgia-domain-color-eligibility-research.ko.md)
- 범위: universal feedback/status color, NOSTALGIA domain color ownership,
  data-visualization color ownership 및 이들 사이 collision contract를 조사하는
  작업 묶음 `13`
- 입력: 승인 문서 `24`, `26`, `32`, `34`–`52`; 현재 NosLog token 및 component
  근거; 독립적인 공식 접근성·design-system·production-service·domain 출처 17개
- 제외: 정확한 domain 또는 data 값 승인, 승인된 `FS-BN` role boundary를 넘는 component
  anatomy, iconography와 motion, production 구현 및 최종 high-fidelity page

이 문서는 완료된 작업 묶음을 다시 열지 않고 고정 작업 묶음 `13`을 시작한다. 조사 근거와
승인된 `13A` 결과를 기록한다. 아래에 포함됐다는 이유만으로 source나 값이 승인되지는
않으며 universal feedback/status color에는 명시적인 `FS-BN` 승인 기록만 권위가 있다.

## 고정된 상위 권위

다음 결정은 그대로 고정된다.

1. Adobe Spectrum S2는 Dark/Light neutral primitive의 독점 출처다.
2. 일반 container, link, filter, selection 및 domain label은 기본적으로 neutral이다.
3. `SS-08` Radix Colors Indigo는 identity를 소유하며 generic feedback, domain 또는
   data를 소유하지 않는다.
4. 드문 filled primary action은 승인된 무채색 `RPA-A` mapping을 사용한다.
5. Focus는 승인된 Fluent 기반 focus mapping이 독립적으로 소유한다.
6. Feedback, domain 및 data color는 semantic ownership이 분리되며 의미가 충돌할 수
   있는 모든 곳에서 보이는 비색상 단서가 필요하다.
7. 공개된 source 값은 그 source가 소유하는 role family 단위로 그대로 채택해야 한다.
   Tailwind color, 보간한 step 및 출처 없는 hybrid는 권위가 아니다.
8. 과도하게 색을 사용한 `FCM-11`과 `SIG-07` 예시는 계속 `Rejected`이며 근거나
   target으로 사용할 수 없다.

## 이 작업 묶음에 승인 Gate가 세 개인 이유

하나의 palette가 NosLog의 모든 chromatic role을 안전하게 소유할 수는 없다.

| Gate  | Owner                     | 포함 의미                                                            | 분리해야 하는 이유                                                                                          |
| ----- | ------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `13A` | Universal feedback/status | information, success, warning, danger/error, destructive consequence | 이 의미는 모든 page와 component에서 일관돼야 한다.                                                          |
| `13B` | NOSTALGIA domain          | 왼손/오른손, difficulty, mode, rank, achievement, score band, genre  | 이 의미는 generic UI 관습이 아니라 게임과 NosLog task에서 나온다.                                           |
| `13C` | Comparison-local data     | categorical, sequential, diverging, threshold, selection, grid, axis | Series hue는 chart나 comparison 안에서만 data를 식별하며 UI 또는 domain 의미를 우연히 물려받아서는 안 된다. |

한 Gate의 승인이 다른 Gate를 승인하지 않는다. 작업 묶음 `13`은 세 Gate가 모두 승인되고
collision test를 통과한 뒤에만 완료된다.

## 현재 NosLog migration audit

현재 application은 기능 근거이지 NosLog 2.0 palette 권위가 아니다. Audit에서 다음
role과 collision을 확인했다.

| 현재 근거                       | 현재 사용                                         | Migration 발견 사항                                                                                                 |
| ------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--success`                     | 성공한 sync, admin health, positive state         | 유용한 semantic role은 존재하지만 현재 Tailwind와 유사한 green 값에는 승인된 provenance가 없다.                     |
| `--danger`                      | error, destructive 의미 및 `FAST` judgment        | Generic error와 rhythm judgment가 하나의 hue를 공유하므로 owner가 모호하다.                                         |
| `--score`                       | score 강조 및 sync health의 warning/attention     | Domain score와 generic warning이 하나의 hue를 공유하므로 status 변경이 score 강조처럼 보일 수 있다.                 |
| `--chart`                       | 일부 맥락의 chart series, link 및 `SLOW` judgment | Data, interaction 및 rhythm judgment가 안정적으로 분리되지 않았다.                                                  |
| difficulty color                | Normal, Hard, Expert, Real badge와 text           | Role은 유지해야 하지만 일반 list/grid label이 보이는 color를 자동으로 사용할 자격은 없다.                           |
| Basic/Recital                   | mode label과 control                              | Mode는 domain 의미이며 success, warning 또는 identity ownership을 암묵적으로 재사용할 수 없다.                      |
| rank, achievement, score band   | status처럼 보이는 badge와 metric                  | 이들은 universal success/warning state가 아니라 domain 결과다. Text, order, icon 또는 shape도 의미를 전달해야 한다. |
| genre color                     | category 표현                                     | Category color는 선택 사항이며 scanning 이점을 입증해야 한다. Neutral genre label이 기본이다.                       |
| Canvas/WebGL 및 literal utility | renderer와 분리된 component styling               | Hard-coded 값은 guide role 승인 후 후속 구현 mapping이 필요하다.                                                    |

이 audit 때문에 기존 literal이나 CSS variable이 2.0에 자동 승계되지는 않는다.

## 조사 방법과 finalist 자격

시각적으로 비슷한 swatch가 아니라 동등한 role로 source를 비교했다. Universal-feedback
finalist는 다음을 제공해야 한다.

1. 유지 관리되는 공식 guidance 또는 공식 token artifact
2. 완전한 information, success/positive, warning/notice 및 danger/negative set
3. 명시적인 Light와 Dark 동작
4. foreground/icon과 subtle surface treatment 또는 body text를 의도적으로 neutral로
   유지하는 정확한 component recipe
5. NosLog 전용 step을 발명하지 않고 set을 채택할 수 있는 충분한 공개 mapping
6. 이미 승인된 NosLog Spectrum surface에서 가능한 contrast 및 non-color-cue contract

유용한 원칙 source는 finalist 자격에 실패해도 규칙에 근거를 제공할 수 있다. Archived
또는 deprecated source는 주 채택 권위가 될 수 없다.

## 17개 출처 비교

|   # | 공식 출처                                                                                                                                                                                                                                                                      | 이전 가능한 근거                                                                                                                                                      | NosLog 적용성                                                                                 | 한계 또는 Gate 결과                                                                                                           |
| --: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
|   1 | [W3C WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html), [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | Color는 보이는 유일한 전달 수단이 될 수 없고 dynamic status는 programmatically determinable해야 하며 error는 text로 설명해야 한다.                                    | 세 Gate 모두와 후속 ARIA/live-region contract를 지배한다.                                     | 값이나 art direction을 고르지 않는다.                                                                                         |
|   2 | [Adobe Spectrum S2 tokens](https://opensource.adobe.com/spectrum-design-data/tokens/) 및 [semantic variants](https://opensource.adobe.com/spectrum-design-data/registry/variants/)                                                                                             | Informative, positive, notice, negative semantic family를 Light/Dark visual 및 background alias와 함께 공개한다.                                                      | 승인된 neutral source와 provenance가 가장 자연스럽게 이어지고 완전한 네 role 어휘를 제공한다. | 공개된 visual color가 일반 text color인 것은 아니므로 정확한 component contrast를 검증해야 한다.                              |
|   3 | [Atlassian color foundations](https://atlassian.design/foundations/color/)                                                                                                                                                                                                     | Light/Dark theme의 information, success, warning, danger text, icon, border 및 background token을 분리해 공개한다.                                                    | 완전한 role coverage와 직접적인 semantic aliasing으로 강한 `13A` finalist다.                  | Atlassian neutral 및 brand system은 이미 승인된 NosLog ownership을 대체할 수 없다.                                            |
|   4 | [Microsoft Fluent 2 color](https://fluent2.microsoft.design/color) 및 [Web alias tokens](https://fluent2.microsoft.design/color-tokens/)                                                                                                                                       | Semantic color를 feedback, status 또는 urgency에 제한하고 다른 indicator를 동반하게 하며 exact success, warning, danger alias는 mode에 따라 달라진다.                 | Semantic restraint와 text/background role 분리의 강한 모델이다.                               | 추출한 Fluent Web status alias에는 대칭적인 information family가 없어 완전한 NosLog set을 채택하려면 추가 mapping이 필요하다. |
|   5 | [IBM Carbon notifications](https://carbondesignsystem.com/components/notification/style/)                                                                                                                                                                                      | Low-contrast notification은 semantic icon/border와 subtle background를 결합하고 high-contrast variant는 inverse neutral text/background와 semantic marker를 사용한다. | 읽을 수 있는 status content의 body text 전체를 chromatic하게 만들 필요가 없음을 보여 준다.    | Finalist 비교 전 정확한 현행 theme 값과 low/high recipe를 version pin해야 한다.                                               |
|   6 | [SAP Fiori semantic colors](https://experience.sap.com/fiori-design-web/explore_category/look-feel-wording/)                                                                                                                                                                   | Neutral, positive, critical, negative, information을 분리하고 status color는 decoration이 아닌 의미에 사용하며 text와 함께 둔다.                                      | 조밀한 record와 status가 많은 정보 UI에 특히 관련성이 높다.                                   | Business value-state 어휘가 game-domain 결과를 직접 정의하지 않는다.                                                          |
|   7 | [GitHub Primer color usage](https://primer.style/product/getting-started/foundations/color-usage/)                                                                                                                                                                             | Success, attention, danger 및 다른 semantic role에 foreground, muted background/border, emphasis token을 분리한다.                                                    | 절제되고 role-specific한 status treatment와 neutral ordinary content를 지지한다.              | `information`은 대칭적인 네 status family가 아니라 accent로 표현된다.                                                         |
|   8 | [GitLab Pajamas UI color](https://design.gitlab.com/product-foundations/color/)                                                                                                                                                                                                | UI와 data-visualization palette를 분리하고 Dark UI에서는 color를 덜 사용하며 semantic hue에 다른 feedback을 결합한다.                                                 | 세 owner 모델과 절제된 Dark treatment의 직접 근거다.                                          | 하나의 universal status-component recipe보다 ramp를 더 직접적으로 공개한다.                                                   |
|   9 | [PatternFly tokens](https://www.patternfly.org/tokens/all-patternfly-tokens/) 및 [Alert guidance](https://www.patternfly.org/components/alert/design-guidelines/)                                                                                                              | Success, warning, danger, information 및 Dark mode에 별도 text, icon, border, general status alias가 있다.                                                            | 완전한 semantic architecture와 enterprise-density 근거다.                                     | 매우 넓은 token set은 NosLog의 lean alias layer보다 무거우며 채택 subset을 임의로 만들면 안 된다.                             |
|  10 | [USWDS state color tokens](https://designsystem.digital.gov/design-tokens/color/state-tokens/)                                                                                                                                                                                 | 여러 grade를 가진 role 기반 info, error, warning, success, emergency 및 disabled family를 공개한다.                                                                   | Role naming과 accessible alert 사용에 강한 공공서비스 근거다.                                 | Default system이 Light-first이며 intact adoption에 적합한 paired Dark status recipe가 없다.                                   |
|  11 | [Wikimedia Codex colors](https://doc.wikimedia.org/codex/latest/design-tokens/color.html) 및 [accessibility](https://doc.wikimedia.org/codex/latest/style-guide/accessibility.html)                                                                                            | Semantic error, warning, success, notice role이 Light/Dark mode를 지원하며 color가 유일한 전달 수단이 되지 않는다.                                                    | 다국어의 조밀한 정보 서비스와 관련성이 높다.                                                  | `notice`가 neutral이며 NosLog의 colored information 요구와 대칭적이지 않다.                                                   |
|  12 | [Material 3 ColorScheme](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme)                                                                                                                                                                | Light/Dark scheme에서 `error`, `onError`, `errorContainer`, `onErrorContainer` 같은 semantic role pair를 사용한다.                                                    | Content/container pairing과 불변 role name에 강한 근거다.                                     | Error만 first-class status family이며 success, warning, information은 custom role이 필요하다.                                 |
|  13 | [Ant Design color](https://ant.design/docs/spec/colors) 및 [theme tokens](https://ant.design/docs/react/customize-theme/)                                                                                                                                                      | Functional color는 안정적인 success, error, warning 및 link 의미에 쓰이고 UI color는 절제해야 한다.                                                                   | Functional-color discipline과 component alias 폭에 유용한 production 근거다.                  | Brand, interaction, information이 blue를 공유할 수 있어 그대로 복사하면 이미 분리한 NosLog ownership을 다시 열게 된다.        |
|  14 | [GOV.UK colour](https://design-system.service.gov.uk/styles/colour/)                                                                                                                                                                                                           | Functional error와 success variable을 설계된 맥락에만 사용하며 focus, brand, surface color를 분리한다.                                                                | Role-ownership discipline과 content-first service의 강한 선례다.                              | 네 status set과 paired Dark theme가 완전하지 않다.                                                                            |
|  15 | [NHS colour](https://service-manual.nhs.uk/design-system/styles/colour) 및 [notification banners](https://service-manual.nhs.uk/design-system/components/notification-banners)                                                                                                 | Context-specific error/success token을 data용 palette color와 분리하고 banner가 status 이름을 표시해 color를 중복 단서로 만든다.                                      | Generic status variable을 chart/domain color로 재사용하지 않는 강한 근거다.                   | 네 status Dark/Light set이 완전하지 않고 NHS brand 맥락은 이전할 수 없다.                                                     |
|  16 | [Shopify Polaris tokens](https://github.com/Shopify/polaris-tokens)                                                                                                                                                                                                            | 역사적으로 semantic하고 component-oriented한 product color token을 제공한다.                                                                                          | 이전 비교와 사용자의 시각적 reference provenance로 유지한다.                                  | 저장소가 스스로 `LEGACY`라고 표시하고 deprecated됐으므로 현재 주 채택 권위로는 부적격이다.                                    |
|  17 | [NOSTALGIA 공식 제품 가이드](https://www.konami.com/arcadegames/products/am_nostalgia/)                                                                                                                                                                                        | 파란 note는 왼손, 빨간 note는 오른손을 안내한다.                                                                                                                      | 명시적인 left/right role을 `13B` 아래 보존하는 직접 domain 권위다.                            | Marketing/game guidance는 접근 가능한 web 값, 다른 domain role 또는 UI status color를 정의하지 않는다.                        |

하나의 system에 속한 여러 page를 별도 독립 reference로 세지 않고도 넓은 system coverage를
확보했다.

## 출처 간 수렴

조사는 다음 여섯 pattern으로 안정화됐다.

1. Universal feedback은 decorative palette가 아니라 semantic role family다.
2. Text/icon, subtle background, border 및 solid/on-solid role은 서로 다르다.
3. Light와 Dark 값은 의도적으로 mapping해야 하며 inversion이나 공통 hex 하나로 충분하지 않다.
4. Semantic status에는 항상 중복된 보이는 단서와 올바른 programmatic state가 있다.
5. Domain 또는 industry color의 의미가 generic status와 다르면 별도로 유지한다.
6. Data visualization은 남는 UI color가 아니라 data type으로 선택한 별도 palette를 소유한다.

일반 status body text를 chromatic하게 해야 하는지에는 유의미한 차이가 있다. Spectrum은
semantic visual을 강조하고 Atlassian은 semantic text를 공개하며 Carbon은 subtle semantic과
inverse-neutral notification recipe를 모두 제공한다. Controlled specimen에서는 고립된
swatch 네 개가 아니라 동등한 component recipe를 비교해야 한다.

## 정확한 `13A` source 추출

다음 값은 현재 공식 공개 artifact에서 추출했다. Table은 source 근거로 유지하며 아래와
문서 `54`에 기록된 명시적인 `FS-BN` mapping을 통해서만 값이 승인된 alias가 된다.

### `FS-A` — Adobe Spectrum S2 semantic visual + subtle background

| Role        | Light visual             | Light subtle background  | Dark visual              | Dark subtle background   |
| ----------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| Information | `#4B75FF` (`blue-800`)   | `#E5F0FE` (`blue-200`)   | `#5681FF` (`blue-900`)   | `#0C2175` (`blue-300`)   |
| Positive    | `#079355` (`green-800`)  | `#D7F7E1` (`green-200`)  | `#099D59` (`green-900`)  | `#003326` (`green-300`)  |
| Notice      | `#D45B00` (`orange-800`) | `#FFECCF` (`orange-200`) | `#E06400` (`orange-900`) | `#501B00` (`orange-300`) |
| Negative    | `#F03823` (`red-800`)    | `#FFEBE8` (`red-200`)    | `#FC432E` (`red-900`)    | `#571107` (`red-300`)    |

필수 검증: 어떤 값이 visual/icon role인지, 각 Spectrum surface에서 message text가 승인된
neutral foreground를 유지해야 하는지 확인한다.

### `FS-B` — Atlassian semantic text, icon 및 background

| Role        | Light text / icon / background    | Dark text / icon / background     |
| ----------- | --------------------------------- | --------------------------------- |
| Information | `#1558BC` / `#357DE8` / `#E9F2FE` | `#8FB8F6` / `#4688EC` / `#1C2B42` |
| Success     | `#4C6B1F` / `#6A9A23` / `#EFFFD6` | `#B3DF72` / `#82B536` / `#28311B` |
| Warning     | `#9E4C00` / `#E06C00` / `#FFF5DB` | `#FBC828` / `#FBC828` / `#3A2C1F` |
| Danger      | `#AE2E24` / `#C9372C` / `#FFECEB` | `#FD9891` / `#F15B50` / `#42221F` |

필수 검증: Atlassian neutral, elevation 또는 brand color를 가져오지 않고 이 semantic
color를 승인된 NosLog Spectrum surface에서 검증한다.

### `FS-C` — IBM Carbon notification recipe

Carbon은 `@carbon/themes@11.78.0`에 version pin했다. White는 info
`#0043CE/#EDF5FF`, success `#24A148/#DEFBE6`, warning `#F1C21B/#FCF4D6`, error
`#DA1E28/#FFF1F1` support/background pair를 사용한다. Dark `g100`은 공통 neutral
notification background `#262626`과 support info `#4589FF`, success `#42BE65`, warning
`#F1C21B`, error `#FA4D56`을 사용한다. 문서 `54`가 exact extraction, controlled
specimen 및 Light warning pair의 측정 한계를 기록한다.

### 비교 전용 근거 — Microsoft Fluent Web

추출한 Fluent Light/Dark success, warning, danger text/background alias는 완전하고 공개돼
있지만 동등한 Web status group에 대칭적인 information family가 없다. 중요한 architecture
근거로는 유지하되 현재 intact한 네 role 채택 후보 자격은 없다.

## 승인된 `13A` 결과

| Candidate                                                     | 최종 상태               | 이유                                                                                                                                                                                                   |
| ------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FS-BN` Atlassian semantic color + neutral message typography | `Approved — 2026-08-10` | Atlassian의 정확한 Light/Dark semantic background와 marker를 보존하고 조밀한 message title/body copy를 승인된 Spectrum neutral owner에 배정하며 field validation에는 Atlassian danger text를 유지한다. |
| `FS-A` Adobe Spectrum S2                                      | `Not selected`          | 안정적인 contrast 근거는 보존하지만 사용자는 Atlassian의 semantic color 성격을 선호했다.                                                                                                               |
| `FS-B` Atlassian                                              | `Superseded by FS-BN`   | 정확한 chromatic role은 `FS-BN` source로 유지하지만 colored message title은 승인된 neutral message typography로 의도적으로 교체했다.                                                                   |
| `FS-C` IBM Carbon                                             | `Not selected`          | Neutral-typography 절제 원칙은 `FS-BN`에 참고했지만 Carbon color 값은 승인된 mapping에 들어가지 않는다.                                                                                                |

이 role split은 출처 없는 palette hybrid가 아니다. Atlassian만 승인된 feedback chromatic을
소유하고 이미 승인된 Spectrum S2 source가 neutral text를 계속 소유한다. 문서 `54`가 정확한
값, 측정, component boundary 및 명시적인 사용자 승인을 기록한다.

## 제안된 `13B` domain ownership inventory

이 inventory는 필요한 의미를 보존하지만 보이는 color 자격은 승인하지 않는다.

| Domain family       | 필요한 semantic role               | 승인 전 기본 표현                                                      | 아직 필요한 근거                                                                                   |
| ------------------- | ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Hand                | `hand-left`, `hand-right`          | 명시적인 `L`/`R` 또는 번역된 label과 position/shape; color는 보조 가능 | Info/danger와 충돌하지 않으면서 공식 blue/red 의미에서 접근 가능한 값을 도출할 수 있는지 검증한다. |
| Difficulty          | `normal`, `hard`, `expert`, `real` | Text label과 level이 우선이며 일반 card는 neutral 유지                 | Color를 허용하기 전에 공식 game 근거와 실제 list/detail scanning task를 비교한다.                  |
| Mode                | `basic`, `recital`                 | Text 또는 icon+text이며 neutral selector가 기본                        | Persistent color가 mode 인지를 개선하는지 입증한다.                                                |
| Rank 및 achievement | 순서가 있는 rank/achievement state | Name, symbol 및 order가 의미 전달                                      | Achievement를 universal success와 분리하고 artwork ownership을 검증한다.                           |
| Score band          | threshold 또는 grade 결과          | Numeric score와 이름 붙은 band가 의미 전달                             | Threshold truth를 정의하고 warning/status collision을 피한다.                                      |
| Genre               | category identity                  | Neutral label                                                          | Color 추가 전 측정 가능한 scan 또는 comparison 이점을 보여 준다.                                   |

기존 1.x 값은 migration 근거일 뿐이다. 정확한 `13B` 후보는 `13A` 해결 후 별도의 폭넓은
공식/domain 조사와 사용자 승인이 필요하다.

## 제안된 `13C` data ownership model

Data color는 visualization 또는 comparison에 local하며 같은 hex가 다른 곳에 보인다는
이유만으로 global 의미가 되지 않는다.

| Data family      | 의도된 사용                                       | 필요한 비색상 지원                                                                             |
| ---------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Single-series    | 하나의 measure 또는 trend                         | direct label, value, axis 또는 tooltip; selection은 별도 state cue 사용                        |
| Categorical      | 순서 없는 독립 series                             | direct label 또는 legend, 안정된 순서, 필요 시 marker/line-style option                        |
| Sequential       | low-to-high magnitude                             | ordered legend, numeric label, lightness progression, missing-data treatment                   |
| Diverging        | 의미 있는 midpoint 양쪽 방향                      | 명시적인 midpoint와 direction label; data가 그 의미를 소유하지 않으면 good/bad를 암시하지 않음 |
| Semantic data    | 실제로 good/critical/bad를 뜻하는 threshold state | Status text 또는 symbol과 threshold 정의; generic red/green만 사용하지 않음                    |
| Structural chart | grid, axis, reference, selection, hover           | 별도 data 의미가 없으면 승인된 neutral/interaction role 사용                                   |

Carbon, GitLab Pajamas, SAP Fiori 및 Atlassian은 chart role, data type, surface 및 accessibility를
분리하므로 주요 `13C` 원칙 source다. 아직 exact data palette shortlist는 없다.

## 검증할 collision contract

1. Hue 이름이 ownership을 정하지 않으며 semantic token과 context가 정한다.
2. Universal `danger`는 danger가 실제 의미가 아닌 한 `FAST`, difficulty, rank loss 또는
   빨간 data series를 표현할 수 없다.
3. Universal `warning`은 score 강조나 generic yellow category를 표현할 수 없다.
4. Universal `information`과 identity Indigo가 모두 blue 계열이어도 component anatomy,
   label 및 context로 구분돼야 한다.
5. Left/right hand color에는 항상 보이는 label, icon, position 또는 shape cue가 있다.
6. Rank, achievement, difficulty 및 mode는 항상 명시적인 이름을 유지한다.
7. Data series는 맥락에 맞게 direct label, legend, marker, pattern/line style, boundary 또는
   spacing을 사용하며 인접 mark를 지각할 수 있어야 한다.
8. Dynamic feedback은 urgency와 interaction에 따라 올바른 `role=status`, `role=alert`,
   `aria-live`, form description 또는 동등한 semantics를 사용한다.
9. 어떤 Gate도 승인하기 전에 forced-colors/high-contrast와 대표적인 color-vision-deficiency
   검사를 반드시 수행한다.

## Decision log

| ID       | Entry                                                                                                                                | Status                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `FDD-01` | 현재 Tailwind와 유사한 literal 및 CSS variable을 2.0 palette 권위가 아닌 migration 근거로 취급한다.                                  | `Observed`                                      |
| `FDD-02` | 비색상 단서와 함께 feedback, domain 및 data ownership을 분리한 기존 승인을 보존한다.                                                 | `Approved upstream`                             |
| `FDD-03` | 작업 묶음 `13`을 별도 `13A`, `13B`, `13C` 승인 Gate로 해결한다.                                                                      | `Proposed`                                      |
| `FDD-04` | `FS-A` Spectrum S2와 `FS-B` Atlassian을 controlled feedback specimen으로 올리고 `FS-C` Carbon은 exact extraction 후에만 참가시킨다.  | `Completed evidence`                            |
| `FDD-05` | 대표 NosLog task가 visible color의 comprehension 개선을 입증할 때까지 일반 domain label을 neutral로 유지한다.                        | `Approved restraint rule에서 나온 Proposed`     |
| `FDD-06` | UI status 및 domain color와 독립적으로 data type과 local comparison semantics에 따라 data color를 고른다.                            | `Proposed`                                      |
| `FDD-07` | 세 owner 중 어디에도 Tailwind palette default, 남는 hue, generated ramp 또는 출처 없는 hybrid를 사용하지 않는다.                     | `Governing provenance에 따라 Rejected approach` |
| `FDD-08` | Deprecated된 legacy Shopify Polaris token repository를 새 채택 결정의 주 source에서 제외한다.                                        | `Observed limitation`                           |
| `FDD-09` | 정확한 Atlassian feedback chromatic, 승인된 Spectrum neutral message typography 및 Atlassian danger field text의 `FS-BN`을 승인한다. | `Approved — 2026-08-10`                         |

## Controlled 검토 artifact

문서 `54`와 interactive artifact가 실제 content를 사용하는 controlled `13A` NosLog
feedback 비교를 제공한다.

- sync success 및 partial-failure summary
- form validation error와 field association
- non-blocking information notice
- error는 아니지만 주의가 필요한 warning
- destructive confirmation consequence
- compact inline status, page-level notice 및 toast/live-region 사례
- 승인된 Spectrum surface 위의 Light와 Dark appearance
- `320px`, `390px` 및 desktop width
- color-disabled, forced-colors 및 대표 color-vision-deficiency view
- 측정된 text, icon, boundary 및 adjacent-color contrast

Artifact는 `FS-A`, original `FS-B` 및 version pin된 `FS-C`를 비교 근거로 보존하고
`FS-BN`을 승인된 `13A` 결과로 기록한다. 작업 묶음 `13`은 이제 별도 `13B`
NOSTALGIA-domain color Gate로 진행하며 `13C`는 그 뒤까지 대기한다.
문서 `55`는 정확한 domain 값을 승인하지 않고 첫 `13B` role 자격 비교를 기록한다.
