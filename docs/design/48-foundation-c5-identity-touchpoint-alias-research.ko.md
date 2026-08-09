# NosLog 2.0 C5 Identity Touchpoint Alias 조사

## 문서 관리

- 상태: `조사 완료; 후보 specimen 범위 제안; identity touchpoint alias 미승인`
- canonical 언어: 영어
- 영어 canonical:
  [48-foundation-c5-identity-touchpoint-alias-research.md](./48-foundation-c5-identity-touchpoint-alias-research.md)
- 날짜: 2026-08-10
- 범위: 승인된 NosLog shell variant 전반에서 승인된 `SS-08` Radix Colors
  Indigo 소스를 받을 수 있는 제한된 서비스 identity touchpoint 결정
- 입력: 문서 `15`, `25`, `32`–`47`, 현재 shell 및 metadata 코드, 아래에
  나열한 독립적인 공식 레퍼런스 15개
- 제외: 드문 primary action 적격성, 최종 NosLog 로고 도형, 최종 header
  치수, radius 승인, 완성 페이지 디자인, 애플리케이션 구현

문서 `47`은 Radix Colors Indigo를 NosLog의 유일한 signature identity
소스로 승인했다. 그러나 비교용 구조로 사용한 세로 identity rail, 컬러
wordmark, mark container 또는 다른 component alias는 승인하지 않았다. 이
문서는 `FCM-11`, `SIG-07` 또는 다른 과도한 accent 예시를 재사용하지 않고
별도 alias gate를 연다.

## 결정 경계

이 조사는 한 가지 질문에 답한다.

> 승인된 Radix Indigo identity 색상을 어디에 허용해야 NosLog가 shell
> variant 전반에서 인식 가능하면서도 일상 콘텐츠, 내비게이션, action을
> brand color로 바꾸지 않을 수 있는가?

Radix가 채워진 primary action을 색칠해야 하는지는 묻지 않는다. 이는 문서
`47`에 기록된 별도의 pending gate로 남는다.

## 고정 승인 계약

1. Adobe Spectrum S2는 Light/Dark 중립 surface, foreground, boundary의
   유일한 소스로 유지한다.
2. signature identity 소스는 온전한 `SS-08` Radix mapping으로 유지한다.
   기본 identity 값은 두 appearance 모두 `#3E63DD`다.
3. Fluent `FI-C`는 focus-visible의 유일한 소스로 유지한다. identity
   treatment가 focus를 대체하거나 다시 색칠하지 않는다.
4. 일반 link, filter, navigation, selected row, difficulty, mode, hand,
   score, feedback, external-brand, visualization 역할은 identity 소스와
   독립적으로 유지한다.
5. 보이는 서비스명은 `NosLog`로 유지하며 legacy `NOSTORY` 이름은 현재
   identity 선택지가 아니다.
6. identity alias는 `320 CSS px`에서 읽을 수 있어야 하고 account 및
   navigation control을 혼잡하게 만들지 않으며 더 넓은 고정 shell을
   요구해서는 안 된다.
7. mark treatment가 새로운 radius, outline, shadow, gradient 또는 logo
   drawing을 암묵적으로 승인할 수 없다. 이 세부 사항들은 별도 Foundation
   결정으로 남는다.

## 승인된 Shell 및 현재 제품 근거

| 맥락                      | 승인된 identity 요구사항                                                               | 현재 구현 근거                                                                     | Alias 함의                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 일반 public shell         | 왼쪽 정렬 NosLog identity가 locale별 Home에 연결                                       | `components/layout/header.tsx`가 텍스트 `NosLog` wordmark를 렌더링                 | 좁은 너비에서 Login/profile 및 하나의 navigation trigger와 공존해야 함      |
| 최소 authentication shell | NosLog identity가 Home에 연결되며 profile 또는 global destination panel은 없음         | Login은 현재 원형 outline `N`과 별도의 `NosLog` heading을 렌더링                   | 현재 원과 outline은 migration 근거이며 승인된 treatment가 아님              |
| 집중 chart-viewer shell   | 집중 shell이 return 및 music/chart identity를 우선하면서도 서비스 identity는 이용 가능 | 일반 header는 의도적으로 없음                                                      | identity alias가 viewer 내부의 지속적인 컬러 일반 header가 되어서는 안 됨   |
| system-recovery shell     | NosLog identity, 상태 의미, 이용 가능한 최선의 recovery action                         | 완전한 2.0 visual treatment는 아직 없음                                            | identity는 navigation 또는 primary action에 의존하지 않고 작동해야 함       |
| metadata 및 app asset     | 작은 export 크기에서도 인식 가능한 NosLog asset                                        | `lib/metadata/brandImage.tsx`와 `noslog-mark-96.png`가 현재 monochrome 근거를 제공 | header alias는 export asset과 함께 검증해야 하지만 자동으로 재정의하지 않음 |

승인된 typography map은 이미 header wordmark를 제한된 brand-component
alias로 분류한다. Page title과 entity title은 일반 semantic typography로
유지하며 identity color를 상속하지 않는다.

## 조사 방법

비교에는 독립적인 공식 소스 15개를 사용한다. 관련 없는 palette swatch가
아니라 다음과 같은 동일 identity 역할을 비교한다.

- 색상이 mark, wordmark, mark field 또는 전체 shell 중 어디를 차지하는지;
- product name이 native neutral text로 유지되는지;
- Light와 Dark에서 색상을 유지하거나 inverse asset으로 전환하는지;
- brand color가 일상 interaction으로도 확장되는지;
- 해당 pattern이 NosLog의 네 shell variant로 이전 가능한지.

소스가 완전한 Light/Dark identity 규칙을 게시하지 않은 경우 누락된 동작은
그대로 누락으로 유지하며 추론하지 않는다.

## Identity Touchpoint 레퍼런스 매트릭스

| ID       | 공식 소스                                                                                                                                                            | Identity 배치 및 appearance 동작                                                                                                                                | 일상 UI와의 분리                                                                  | 이전 가능한 NosLog 원칙                                                                        | 한계                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `ITR-01` | [GOV.UK Header](https://design-system.service.gov.uk/components/header/)                                                                                             | 흰 GOV.UK logotype이 모든 GOV.UK 서비스 페이지에 필수인 지속적인 brand-blue masthead에 배치됨                                                                   | Service navigation은 masthead 계약 아래 또는 옆의 별도 component                  | 전체 chromatic shell은 강한 출처 및 신뢰 인식을 만들 수 있음                                   | 넓은 면적의 정부 masthead이며 동등한 게시 NosLog Dark pair가 없고 승인된 절제 예산에 비해 색상 면적이 지나침 |
| `ITR-02` | [NHS Header](https://service-manual.nhs.uk/design-system/components/header)                                                                                          | 흰 NHS logo field와 service name이 파란 header에 배치되며 선택적인 흰 header variant도 명시적으로 지원                                                          | Search, account, navigation은 logo 장식이 아니라 이름 붙은 header element로 유지  | fielded white mark는 견고하고 compact하며 full header field는 의도적인 system-level 선택       | 의료 서비스 ownership과 Light 중심 header 규칙은 전체 Indigo NosLog shell을 정당화하지 않음                  |
| `ITR-03` | [Government of Canada Signature](https://design.canada.ca/common-design-patterns/signature.html)                                                                     | 고정된 빨간 국기 symbol 뒤에 흰 header 위 검정 이중 언어 text가 오며 국기 색상은 변경 금지                                                                      | Page link와 action은 signature red를 상속하지 않음                                | 변경 불가능한 identity color를 작은 symbol에 집중하고 wordmark는 neutral로 유지                | 게시 signature는 Light-only이며 보호되는 정부 asset이지 dual-theme component recipe가 아님                   |
| `ITR-04` | [USWDS Header](https://designsystem.digital.gov/components/header/)                                                                                                  | Header는 text 또는 image logo를 허용하며 basic에서 extended configuration까지 확장                                                                              | Header 구조와 navigation은 필수 logo color와 독립적으로 관리                      | Identity form은 안정적으로 유지하면서 navigation 밀도는 적응 가능                              | USWDS는 의도적으로 themeable하며 하나의 NosLog-ready identity 배치 색상을 제공하지 않음                      |
| `ITR-05` | [BBC GEL Global Navigation](https://bbc.github.io/gel/components/global-navigation/)                                                                                 | BBC logo는 `currentColor`를 쓰는 inline SVG라 foreground와 forced-color 맥락을 따름                                                                             | Global navigation, account, search는 별도 semantic control로 유지                 | achromatic/inverse mark는 mode 전반에서 인식성과 복원력이 높을 수 있음                         | neutral control을 지원할 뿐 승인된 Indigo 소스 사용 근거가 아님                                              |
| `ITR-06` | [IBM Carbon UI Shell Header](https://carbondesignsystem.com/components/UI-shell-header/style/)                                                                       | Header background, product name, icon, boundary가 semantic theme token을 사용하고 product name은 `text-primary`를 유지                                          | IBM core blue는 필수 product-name 색상이 아니라 primary-action family             | Product shell은 이름을 neutral로 유지하면서 안정적인 배치와 type으로 identity를 보호할 수 있음 | IBM shell 밀도와 action-blue ownership은 NosLog에 이전되지 않음                                              |
| `ITR-07` | [GitHub Primer Theme Reference](https://primer.style/product/getting-started/react/theme-reference/)                                                                 | Product header는 Light와 Dark scheme에서 dark neutral background와 white 또는 near-white logo token을 사용                                                      | Blue interaction과 status family는 logo와 분리                                    | neutral shell과 inverse mark는 밀도 높은 기술 콘텐츠에서 인식을 유지할 수 있음                 | achromatic control이며 Radix Indigo identity를 사용하지 않음                                                 |
| `ITR-08` | [Atlassian Logos](https://atlassian.design/foundations/logos)                                                                                                        | Property logo는 흰 바탕에서 blue mark와 neutral name을 사용하고 dark에서는 모두 흰색이 됨; app logo는 top navigation에서 native text와 결합된 colored tile 사용 | Product tile은 관리되는 asset이며 임의로 추가하는 container가 아님                | colored-mark lockup과 fielded-mark-plus-native-name 모두 확립된 product-shell model            | Atlassian 고유 tile geometry, radius, inverse 규칙은 NosLog 값으로 복사할 수 없음                            |
| `ITR-09` | [Fluent 2 Color](https://fluent2.microsoft.design/color)                                                                                                             | Brand, shared, neutral palette는 별도 기능을 가지며 neutral은 mode 전반의 surface, text, layout을 기반으로 함                                                   | Brand color는 neutral 구조의 보편적 대체물이 아님                                 | 전체 shell을 다시 색칠하지 말고 identity, neutral, semantic ownership을 명시적으로 분리        | Fluent는 하나의 의무 logo 배치보다 역할 분리를 설명함                                                        |
| `ITR-10` | [Adobe Spectrum Using Color](https://spectrum.adobe.com/page/using-color/)                                                                                           | Static color token은 대비가 안전한 black 또는 white foreground와 함께 background로 쓸 때 theme 전반에서 동일한 값을 유지                                        | Theme color와 static field color는 서로 다른 계약                                 | white monochrome mark가 들어간 고정 Indigo field는 Light와 Dark에서 기술적으로 일관됨          | Spectrum static-color 규칙은 NosLog mark shape 또는 field geometry를 승인하지 않음                           |
| `ITR-11` | [Ubuntu Brand](https://design.ubuntu.com/brand) 및 [Colour Palette](https://design.ubuntu.com/brand/colour-palette)                                                  | Orange는 인식 가능한 brand color이며 white와 black brandmark option이 적용 유연성을 제공하고 가이드는 색상 양을 명시적으로 통제                                 | Orange는 neutral 및 supporting color가 구성을 담당하는 동안 highlight로 작동 가능 | 선명한 identity 소스도 mark 또는 작은 highlight에 제한 가능                                    | Ubuntu는 완전한 NosLog-ready dual-theme header alias를 게시하지 않음                                         |
| `ITR-12` | [GitLab Core Logo](https://design.gitlab.com/brand-logo/core-logo/)                                                                                                  | 기본은 고정 full-color logomark와 wordmark이며 white 또는 charcoal one-color variant는 제한적 대안                                                              | 가이드는 recoloring, stroke, effect, 임의 재배치를 금지                           | 승인된 identity asset과 variant를 자유로운 색상 target이 아니라 관리되는 단위로 취급           | GitLab 다색 asset 및 인지도 규칙은 단일 Indigo recipe가 아님                                                 |
| `ITR-13` | [Stack Overflow Logo](https://stackoverflow.design/brand/logo)                                                                                                       | 선호 logo는 Off-Black이며 접근성상 필요할 때 Off-White를 쓰고 Stack Orange는 더 넓은 identity ownership으로 유지                                                | Brand가 선명한 색상을 소유해도 core identifier는 achromatic일 수 있음             | Signature color를 logo에 강제하기보다 wordmark 가독성을 우선할 수 있음                         | 지속적인 Indigo touchpoint가 아니라 achromatic control을 지원                                                |
| `ITR-14` | [Mozilla Protocol Brand Themes](https://protocol.mozilla.org/docs/fundamentals/brand-themes)                                                                         | Mozilla identity는 의도적으로 대부분 black과 white이며 Firefox가 더 다채로운 sibling theme                                                                      | 다채로운 supporting palette가 parent service identity가 될 필요 없음              | Typography, mark, composition이 매우 작은 chromatic area로 identity를 담당 가능                | 승인 Radix 소스를 사용하지 않으며 Protocol color guidance 일부는 draft                                       |
| `ITR-15` | [Shopify Polaris Color](https://polaris-react.shopify.com/design/colors) 및 [Palettes and Roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles) | Admin은 의도적으로 monochromatic이며 inverse color가 top bar를 구성하고 brand color는 의도된 primary action에 예약                                              | 장식적 color를 거부하고 특수 navigation color는 component에 제한                  | Neutral shell은 강력한 control이며 identity가 semantic color를 소모하지 않게 함                | Polaris는 chromatic service-mark alias를 세우기보다 action에 brand color를 할당                              |

## 교차 레퍼런스 발견사항

1. **전체 chromatic header는 이 집합에서 의도적인 소수 pattern이다.**
   GOV.UK와 NHS는 제도적 출처를 확립하기 위해 이를 사용하지만, NosLog의
   승인된 절제 signature 예산과 충돌하는 넓고 지속적인 color area도
   수용한다.
2. **가장 직접적으로 이전 가능한 chromatic pattern은 제한된 mark다.**
   Canada, Atlassian, Ubuntu, GitLab은 주변 text와 control이 각자 역할을
   유지하는 동안 관리되는 symbol 또는 logo unit에 인식을 집중한다.
3. **monochrome mark가 들어간 colored field는 확립된 제품 pattern이다.**
   Atlassian app tile과 NHS mark가 이 구성을 보여주며 Spectrum의 static-color
   규칙은 고정 field가 theme 전반에서 안정적으로 유지되는 방법을 설명한다.
4. **Neutral 또는 inverse identity도 성숙한 방식이다.** BBC, Carbon,
   GitHub Primer, Stack Overflow, Mozilla, Polaris는 chromatic wordmark를 쓰지
   않고도 mark, 배치, typography, shell 일관성이 identity를 담당할 수 있음을
   보여준다.
5. **검토한 소스 중 얇고 독립적인 color rail을 주 서비스 identity pattern으로
   삼는 곳은 없다.** 문서 `47`의 rail은 유용한 비교 구조였지만 최종 alias의
   provenance로는 약하며 generic decoration으로 보일 수 있다.
6. **레퍼런스는 signature color를 모든 shell control에 확장하는 것을
   뒷받침하지 않는다.** 강한 색상을 쓰는 system도 logo, navigation, action,
   semantic feedback을 별도로 관리한다.

## 정확한 NosLog 대비 근거

다음 측정은 승인된 Radix default `#3E63DD`와 승인된 Spectrum S2 neutral
surface를 사용한다. 비율은 소수점 둘째 자리로 반올림했다.

| 조합                             |     비율 | Alias 결과                                                         |
| -------------------------------- | -------: | ------------------------------------------------------------------ |
| Indigo / Light canvas `#FFFFFF`  | `5.21:1` | 일반 text AA 및 non-text 대비 통과                                 |
| Indigo / Light surface `#F8F8F8` | `4.90:1` | 일반 text AA 및 non-text 대비 통과                                 |
| Indigo / Light sunken `#E9E9E9`  | `4.29:1` | non-text 대비는 통과하지만 일반 text AA 미통과                     |
| Indigo / Dark canvas `#111111`   | `3.63:1` | non-text 대비는 통과하지만 일반 text AA 미통과                     |
| Indigo / Dark surface `#1B1B1B`  | `3.31:1` | non-text 대비는 통과하지만 일반 text AA 미통과                     |
| Indigo / Dark raised `#222222`   | `3.06:1` | `3:1` non-text 기준을 근소하게 통과                                |
| White `#FFFFFF` / Indigo         | `5.21:1` | Indigo field 내부의 white monochrome mark 또는 일반 크기 text 지원 |
| Black `#000000` / Indigo         | `4.03:1` | non-text 대비는 통과하지만 일반 text AA 미통과                     |

이 결과는 승인된 Indigo default를 Dark의 보편적 작은 wordmark foreground로
쓰는 방식을 제외한다. 승인된 neutral surface 위 Indigo graphical mark 또는
Indigo field 안의 white monochrome mark는 지원한다. 색상이 Home link를
식별하는 유일한 단서가 되어서는 안 된다.

## 후보 Alias 묶음

아래 모든 묶음은 `Proposed`, `Control` 또는 `Do not advance`다. 승인된 것은
없다.

| ID      | Alias 묶음                                                                                                                                                            | 레퍼런스 provenance                                                      | 강점                                                                                             | 위험                                                                                                                     | Gate 상태                                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `ITA-A` | **Indigo mark + appearance별 neutral wordmark.** Compact graphical NosLog mark에만 `#3E63DD`를 적용하고 `NosLog`는 appearance에 맞는 승인 neutral foreground로 렌더링 | Canada signature, Atlassian property/app lockup, Ubuntu, GitLab          | 지속 chromatic area가 가장 작음; 모든 승인 neutral surface에서 mark가 보임; wordmark 가독성 유지 | 현재 미승인 white outline 없이 작동하는 mark drawing 필요; Dark raised 대비는 `3.06:1`에 불과                            | `Visual comparison 제안`                                       |
| `ITA-B` | **고정 Indigo mark field + white monochrome mark + appearance별 neutral wordmark.** 두 appearance에서 field를 `#3E63DD`로 유지하고 outline 없는 white mark 배치       | Atlassian app tile, NHS fielded mark, Spectrum static-color guidance     | 강한 theme 연속성; white-on-Indigo `5.21:1`; compact asset을 auth와 recovery 맥락으로 이전 가능  | Field geometry와 radius가 새 결정; generic app-tile 인상을 피해야 함; 현재 circle을 다른 container 안에 중첩해서는 안 됨 | `Visual comparison 제안`                                       |
| `ITA-C` | **Achromatic identity control.** Mark와 wordmark를 neutral/inverse로 유지하고 shell identity에는 Indigo를 두지 않음                                                   | BBC, Carbon, GitHub Primer, Stack Overflow, Mozilla, Polaris             | 충돌이 가장 적고 콘텐츠 절제가 강함; 색상이 실제로 필요한지 검증                                 | Shell에서 승인 identity 소스를 가시적으로 사용하지 않아 맥락 간 색상 인식이 약해질 수 있음                               | `Visual comparison control`                                    |
| `ITA-D` | **white identity와 control이 있는 전체 Indigo header field.**                                                                                                         | GOV.UK 및 NHS                                                            | 즉각적인 출처 단서가 가장 강하고 white foreground가 견고                                         | 넓고 지속적인 color area가 문서 `32`–`33`과 충돌하고 jacket 및 chart 콘텐츠와 경쟁하며 과도한 accent shell을 재현할 위험 | `절제 color 결정을 재개하지 않는 한 진행하지 않음`             |
| `ITA-E` | **Field 없는 Indigo wordmark text.**                                                                                                                                  | 일반 colored-lockup 관행이지만 검토한 Dark system과 강하게 일치하지 않음 | Geometry 변경이 최소                                                                             | 모든 승인 Dark surface와 Light sunken에서 일반 text AA 실패; identity 가독성이 크기에 종속                               | `진행하지 않음`                                                |
| `ITA-F` | **얇은 Indigo rail 또는 full-width header edge.** 문서 `47` 비교 단서를 유일한 chromatic identity element로 유지                                                      | 이전 NosLog specimen만 해당; 이 조사에서 강하게 반복되는 소스 없음       | Color area가 매우 작고 logo-field 결정을 요구하지 않음                                           | 직접 provenance가 약하고 시각적으로 generic하며 identity가 아니라 decoration 또는 selection으로 읽힐 수 있음             | `기본안으로 진행하지 않고 historical comparison 근거로만 보존` |

## 제안하는 Visual Comparison Gate

근거는 또 다른 넓은 color gallery가 아니라 작은 다음 specimen 하나를
뒷받침한다. 사용자가 범위를 승인하면 동일 콘텐츠로 `ITA-A`, `ITA-B`,
achromatic control `ITA-C`를 다음 네 fragment에서 비교한다.

1. `390px` 및 `320 CSS px`의 일반 compact header;
2. 최소 authentication shell identity;
3. 일반 header가 없는 집중 chart-viewer return/identity 영역;
4. system-recovery identity 및 message 영역.

비교는 후보가 field를 필요로 하지 않는 부분에서 mark silhouette, wordmark
typography, layout, neutral token, focus, 콘텐츠를 동일하게 유지해야 한다.
최종 mark geometry가 승인되지 않았으므로 specimen은 명확히 provisional로
표시한 monochrome silhouette 하나를 사용하며 이를 최종 NosLog logo로
제시해서는 안 된다.

필수 확인사항:

- 별도로 trigger되는 승인 keyboard focus indicator를 제외하고 Dark mark
  주변에 white outline이 없어야 함;
- candidate color를 쓰는 일반 action, link, selected control, page title이
  없어야 함;
- `320 CSS px`에서 horizontal overflow 또는 control crowding이 없어야 함;
- 색상을 이용할 수 없거나 forced colors가 활성화된 경우에도 identity를
  인식할 수 있어야 함;
- colored mark가 Home 또는 현재 상태의 유일한 단서가 되어서는 안 됨;
- chart-viewer fragment는 content-led로 유지하고 일반 컬러 site header를
  추가해서는 안 됨.

## 조사 결과 및 권고

`ITA-A`, `ITA-B`, `ITA-C`를 동일한 측정 visual specimen으로 진행하는 것을
권고한다. 비교를 통해 NosLog가 container 없는 Indigo mark, field가 있는
Indigo mark, 또는 chromatic shell mark 없음 중 무엇을 필요로 하는지 결정해야
한다. 사용자가 해당 rejected 또는 근거가 약한 방향을 명시적으로 다시 열지
않는 한 전체 Indigo header, 컬러 wordmark, 얇은 rail은 진행하지 않는다.

이는 다음 비교를 위한 권고일 뿐이다. Identity alias, mark shape 또는
애플리케이션 변경을 승인하지 않는다.

## 결정 로그

| ID       | 항목                                                                                             | 상태                                       |
| -------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `ITA-01` | 별도 component-alias gate를 열면서 `SS-08` Radix Colors Indigo를 유일한 identity 소스로 유지     | `Required`                                 |
| `ITA-02` | 동일한 배치와 appearance 동작 기준으로 독립적인 공식 identity 및 shell 레퍼런스를 15개 이상 비교 | `조사 완료 — 2026-08-10`                   |
| `ITA-03` | 문서 `47`의 세로 rail을 승인된 identity alias가 아니라 비교 구조로 취급                          | `Observed; 최종 상태 사용자 검토 대기`     |
| `ITA-04` | `ITA-A`, `ITA-B`, `ITA-C`를 네 맥락 visual specimen 하나로 진행                                  | `Proposed; 사용자 승인 대기`               |
| `ITA-05` | 전체 Indigo header field 승인                                                                    | `제안하지 않음; 절제 color 원칙 재개 필요` |
| `ITA-06` | Indigo 작은 text wordmark 승인                                                                   | `제안하지 않음; 측정된 Dark 대비 실패`     |
| `ITA-07` | 드문 primary-action 적격성 결정                                                                  | `별도 gate pending; 범위 밖`               |

## 출처

- [Adobe Spectrum: Using color](https://spectrum.adobe.com/page/using-color/)
- [Atlassian: Logos](https://atlassian.design/foundations/logos)
- [BBC GEL: Global Navigation](https://bbc.github.io/gel/components/global-navigation/)
- [Canada.ca: Government of Canada signature](https://design.canada.ca/common-design-patterns/signature.html)
- [GitHub Primer: Theme Reference](https://primer.style/product/getting-started/react/theme-reference/)
- [GitLab Pajamas: Core logo](https://design.gitlab.com/brand-logo/core-logo/)
- [GOV.UK: Header](https://design-system.service.gov.uk/components/header/)
- [IBM Carbon: UI shell header style](https://carbondesignsystem.com/components/UI-shell-header/style/)
- [Microsoft Fluent 2: Color](https://fluent2.microsoft.design/color)
- [Mozilla Protocol: Brand themes](https://protocol.mozilla.org/docs/fundamentals/brand-themes)
- [NHS: Header](https://service-manual.nhs.uk/design-system/components/header)
- [Shopify Polaris: Color](https://polaris-react.shopify.com/design/colors)
- [Shopify Polaris: Palettes and roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles)
- [Stack Overflow: Logo](https://stackoverflow.design/brand/logo)
- [Ubuntu: Brand](https://design.ubuntu.com/brand)
- [Ubuntu: Colour palette](https://design.ubuntu.com/brand/colour-palette)
- [USWDS: Header](https://designsystem.digital.gov/components/header/)
