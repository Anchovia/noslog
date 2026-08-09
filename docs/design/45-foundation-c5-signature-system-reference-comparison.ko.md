# NosLog 2.0 C5 시그니처 시스템 레퍼런스 비교

## 문서 관리

- 상태: `기존 시스템 10개 비교 보존 — 문서 47 이후 SS-08을 NosLog identity
source로 선택; action 및 component alias 대기`
- 기준 언어: 영문
- 영문 원문:
  [45-foundation-c5-signature-system-reference-comparison.md](./45-foundation-c5-signature-system-reference-comparison.md)
- 날짜: 2026-08-10
- 범위: 승인된 NosLog 중립 및 절제 사용 계약 안에서 유지 관리되는 디자인
  시스템 10개의 시그니처 또는 주요 액션 컬러 매핑 비교
- 입력: 문서 `32`–`44`, 공식 디자인 지침, 아래에 기록한 버전 고정
  1차 제공자 토큰 패키지
- 제외: 로고 재착색, 피드백/도메인/데이터 시각화 색, 최종 identity/action
  컴포넌트 별칭, 프로덕션 구현

이 문서는 임의로 만든 색상 계열 비교를 대체한다. NosLog를 위해 파랑, 보라,
무채색 값을 새로 만들지 않는다. 모든 후보는 하나의 소스가 공개한 Light/Dark
역할과 상태 매핑을 보간이나 시스템 간 혼합 없이 보존한다. 사용자는 이 표만으로
완성 팔레트를 승인하는 것이 아니라, 어떤 소스 동작을 NosLog 실측 표본 단계로
진행할 가치가 있는지 선택한다.

후보 10개와 기존 검증은 그대로 유지한다. 문서 `46`은 이 세트 옆에 정보 서비스
18개 조사와 비파랑 또는 역할 분리 레퍼런스 10개를 추가한다. 아래 후보를
제거하거나 다시 쓰거나 조용히 실격시키지 않는다.

2026-08-10 사용자는 `SS-08` Radix Colors Indigo와 `SS-09` Shopify Polaris를
문서 `47`의 동일 실제 콘텐츠 비교로 진행했다. 진행은 source 선택이 아니며 나머지
후보 8개와 이 원래 근거도 계속 보존한다.

해당 실측 후 사용자는 2026-08-10 온전한 `SS-08` Radix Colors Indigo를 NosLog
identity source로 선택했다. 나머지 9개 system은 비교 근거로 계속 보존하지만 현재
identity source가 아니다.

## 관련 문서

- [Foundation 컬러 및 재질 후보](./32-foundation-color-material-candidates.ko.md)
- [시그니처 컬러 조사 및 광범위 레퍼런스 매트릭스](./33-foundation-signature-color-research.ko.md)
- [승인된 Spectrum S2 시맨틱 매핑](./34-foundation-c5-spectrum-semantic-mapping.ko.md)
- [승인된 Fluent 포커스 검증](./44-foundation-c5-fluent-focus-specimen-validation.ko.md)
- [정보 서비스 컬러 조사 및 비파랑 확장](./46-foundation-c5-information-service-color-expansion.ko.md)
- [최종 후보 실제 콘텐츠 비교](./47-foundation-c5-finalist-noslog-context-comparison.ko.md)
- [정확한 시스템 인터랙티브 비교](./specimens/c5-signature-system-comparison.html)

## 고정 비교 계약

1. Adobe Spectrum S2는 문서 `34`–`41`에서 승인된 모든 중립 표면, 전경,
   경계, 중립 상호작용 값을 계속 소유한다.
2. Fluent `colorStrokeFocus2`는 문서 `44`에서 승인된 `focus-visible` 색과
   지오메트리를 계속 소유한다. 후보가 포커스를 재착색하지 않는다.
3. 후보 색은 작은 아이덴티티 단서와, 소스가 적합하고 완전한 레시피를
   공개한 경우에만 드문 채움 주요 액션 하나에 나타난다.
4. 일반 링크, 필터, 선택 행, 카드, 컨테이너, 난이도, 모드, 손, 점수, 랭크,
   피드백, 외부 브랜드, 시각화 역할은 중립을 유지하거나 별도 도메인 소유권을
   유지한다.
5. 한 소스의 Light 세트와 Dark 세트는 분리할 수 없다. 예를 들어 Atlassian
   Light와 Spectrum Dark를 결합하거나, 다른 소스의 흰색이 더 익숙해 보인다는
   이유로 Dark 전경을 교체할 수 없다.
6. 상태 근거가 없으면 없는 그대로 표시한다. 임의로 더 어두운 스와치를
   추가하지 않는다.
7. `FCM-11`, `SIG-07`, 모든 과도한 강조 예시는 계속 `Rejected`이며 이
   비교의 입력이 아니다.

## 근거 범위

문서 `33`은 이미 접근성, 브랜드 소유권, 음악 제품, 리듬게임 맥락, 적응형
Light/Dark 동작에 걸쳐 독립된 조직 또는 표준 16개와 현재 NosLog 근거를
비교한다. 이번 단계는 정확한 값을 가진 유지 관리 제품 시스템 10개를 추가한다.
패키지와 문서 URL의 중복을 독립 레퍼런스로 세지 않아도 결합 근거는 요구된
12개 기준을 넘는다.

아래 값은 2026-08-09에 공식 패키지 릴리스에서 해석했다. 패키지 파일은 재현
가능한 근거이며 저장소 의존성이 아니다.

| 후보                           | 공식 권위                                                                                                                                                                  | 근거 릴리스                                 | 비교한 공개 역할                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| `SS-01` Adobe Spectrum S2      | [컬러 별칭](https://opensource.adobe.com/spectrum-design-data/tokens/color-aliases/), [컬러 사용](https://spectrum.adobe.com/page/using-color/)                            | `@adobe/spectrum-tokens@14.15.0`            | 기본 파란 강조 계열의 `accent-background-color-*`          |
| `SS-02` Microsoft Fluent 2 Web | [컬러 토큰](https://fluent2.microsoft.design/color-tokens2/)                                                                                                               | `@fluentui/tokens@1.0.0-alpha.23`           | `colorBrandBackground*` 및 `colorNeutralForegroundOnBrand` |
| `SS-03` IBM Carbon             | [컬러 토큰](https://carbondesignsystem.com/elements/color/tokens/), [Button](https://carbondesignsystem.com/components/button/usage/)                                      | `@carbon/themes@11.78.0`                    | 주요 Button 배경과 on-color 텍스트                         |
| `SS-04` GitHub Primer          | [컬러 프리미티브](https://primer.style/product/primitives/color/), [테마 레퍼런스](https://primer.style/product/getting-started/react/theme-reference/)                    | `@primer/primitives@11.10.0`                | `bgColor-accent-emphasis`와 `fgColor-onEmphasis`           |
| `SS-05` Atlassian              | [컬러 Foundation](https://atlassian.design/foundations/color-new/), [토큰](https://atlassian.design/foundations/tokens/design-tokens/)                                     | `@atlaskit/tokens@16.5.0`                   | `color.background.brand.bold*`와 `color.text.inverse`      |
| `SS-06` PatternFly 6           | [컬러](https://www.patternfly.org/foundations/colors), [Button](https://www.patternfly.org/components/button/)                                                             | `@patternfly/patternfly@6.6.1`              | 전역 brand 및 on-brand 토큰으로 매핑된 주요 Button         |
| `SS-07` SAP Horizon            | [테마](https://www.sap.com/design-system/fiori-design-web/foundations/styles/colors/theming)                                                                               | `@sap-theming/theming-base-content@11.36.5` | 강조 Button 기본, hover, active, 텍스트 역할               |
| `SS-08` Radix Colors Indigo    | [스케일 이해](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale), [Indigo](https://www.radix-ui.com/colors/docs/palette-composition/scales) | `@radix-ui/colors@3.0.0`                    | 문서상 solid 기본 및 hover 용도인 Indigo `9`, `10` 단계    |
| `SS-09` Shopify Polaris        | [컬러 토큰](https://polaris-react.shopify.com/tokens/color)                                                                                                                | `@shopify/polaris-tokens@9.4.2`             | `color-bg-fill-brand*`와 `color-text-brand-on-bg-fill`     |
| `SS-10` MUI 기본값             | [팔레트](https://mui.com/material-ui/customization/palette/), [Button](https://mui.com/material-ui/react-button/)                                                          | `@mui/material@9.3.1`                       | 기본 primary 팔레트와 contained Button hover 매핑          |

## 정확한 Light/Dark 세트

16진수는 읽기 쉽도록 대문자로만 정규화했고 sRGB 값은 변경하지 않았다.
상위 색 매핑이 별도 pressed 채움을 공개하지 않은 경우 “Pressed”를 생략한다.
가까운 스케일 단계로 추론해서는 안 된다.

| 후보                 | Light 기본 / hover / pressed           | Light on-color              | Dark 기본 / hover / pressed            | Dark on-color                                | 기본 흰색/검정 텍스트 대비 |
| -------------------- | -------------------------------------- | --------------------------- | -------------------------------------- | -------------------------------------------- | -------------------------: |
| `SS-01` Adobe        | `#3B63FB` / `#274DEA` / `#274DEA`      | `#FFFFFF`                   | `#4069FD` / `#345BF8` / `#345BF8`      | `#FFFFFF`                                    |            `4.81` / `4.51` |
| `SS-02` Fluent       | `#0F6CBD` / `#115EA3` / `#0C3B5E`      | `#FFFFFF`                   | `#115EA3` / `#0F6CBD` / `#0C3B5E`      | `#FFFFFF`                                    |            `5.38` / `6.66` |
| `SS-03` Carbon       | `#0F62FE` / `#0050E6` / `#002D9C`      | `#FFFFFF`                   | `#0F62FE` / `#0050E6` / `#002D9C`      | `#FFFFFF`                                    |            `5.00` / `5.00` |
| `SS-04` Primer       | `#0969DA` / 해당 역할에 미공개 / —     | `#FFFFFF`                   | `#1F6FEB` / 해당 역할에 미공개 / —     | `#FFFFFF`                                    |            `5.19` / `4.63` |
| `SS-05` Atlassian    | `#1868DB` / `#1558BC` / `#144794`      | `#FFFFFF`                   | `#669DF1` / `#8FB8F6` / `#ADCBFB`      | `#1F1F21`                                    |            `5.20` / `6.00` |
| `SS-06` PatternFly   | `#0066CC` / `#004D99` / 별도 채움 없음 | `#FFFFFF`                   | `#92C5F9` / `#B9DAFC` / 별도 채움 없음 | `#1F1F1F`                                    |            `5.57` / `9.09` |
| `SS-07` SAP          | `#0070F2` / `#0064D9` / `#FFFFFF`      | `#FFFFFF`; active `#0064D9` | `#0070F2` / `#0064D9` / `#213131`      | `#FFFFFF`; hover `#F5F6F7`; active `#4DB1FF` |            `4.57` / `4.57` |
| `SS-08` Radix Indigo | `#3E63DD` / `#3358D4` / 별도 채움 없음 | `#FFFFFF`                   | `#3E63DD` / `#5472E4` / 별도 채움 없음 | `#FFFFFF`                                    |            `5.21` / `5.21` |
| `SS-09` Polaris      | `#303030` / `#1A1A1A` / `#1A1A1A`      | `#FFFFFF`                   | `#FFFFFF` / `#F3F3F3` / `#F7F7F7`      | `#303030`                                    |          `13.20` / `13.20` |
| `SS-10` MUI          | `#1976D2` / `#1565C0` / 별도 채움 없음 | `#FFFFFF`                   | `#90CAF9` / `#42A5F5` / 별도 채움 없음 | `rgba(0,0,0,.87)`                            |    `4.60` / `10.03` 합성값 |

대비율은 WCAG 상대 휘도를 사용해 공개된 기본 on-color와 공개된 기본 채움을
측정했다. 표시된 쌍의 일반 텍스트 가능성만 확인한다. 색상 계열, 상태 순서,
아이덴티티 구별성, 포커스 동작, 모든 가능한 컴포넌트 조합을 승인하지 않는다.

## 공통 패턴과 중요한 차이

### 강한 수렴

- 유채색 후보 9개가 파랑에서 인디고 범위에 있다. 8개는 일반적인 파랑이며
  Radix Indigo만 blue-violet 경계에 있다. 이 수렴은 파랑이 안정적인 전문
  액션 컬러라는 근거이지, NosLog에서 독특할 것이라는 근거가 아니다.
- 모든 소스는 대비 또는 시각적 무게 모델이 요구할 때 Light와 Dark 사이에서
  채움, 전경 또는 둘 다 변경한다. Carbon, SAP, Radix가 우연히 같은 기본
  16진수를 유지해도 문자 그대로 같은 16진수 구조가 지배적이지 않다.
- 완전한 채움 액션 쌍은 모두 기본 상태에서 `4.5:1`을 넘는다. 따라서 접근성이
  이 기본 쌍들 사이에서 승자를 고르지는 않는다.

### 의미 있는 불일치

- Atlassian, PatternFly, Polaris, MUI는 Dark 테마에서 밝은 채움과 어두운
  전경 쪽으로 반전한다. Adobe와 Primer는 흰색 텍스트를 유지하며 비교적 작게
  밝아진다. Fluent는 Dark에서 더 어두운 파랑으로 바뀐다. Carbon, SAP,
  Radix는 테마 간 같은 기본 16진수를 유지한다.
- Polaris는 의도적으로 무채색이다. 완전한 테마 대응 브랜드 채움을 공개하면서
  현재 단색 아이덴티티 방향도 유지하는 유일한 후보다.
- Primer의 accent-emphasis 역할은 유효한 아이덴티티 근거지만 완전한 일반
  채움 액션 상태군은 아니다. 진행하면 아이덴티티 시험만 허용된다. 적합한
  온전한 Primer 컴포넌트 매핑을 찾고 별도로 승인할 때까지 드문 액션은 중립을
  유지한다.
- SAP active 상태는 단순히 더 어두운 pressed 색이 아니라 구조적 반전이다.
  스와치 하나로 축소하면 상위 시스템을 잘못 표현한다.

## NosLog 적용성과 위험

| 후보                 | 전이 가능한 강점                                                                | NosLog 고유 위험 또는 한계                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `SS-01` Adobe        | 승인된 중립 소스의 구성과 이미 정렬되며 작고 정확한 상태군을 제공               | accent 채택은 중립 소스와 별도 승인이다. 아이덴티티 배치를 매우 절제하지 않으면 전체 Foundation이 한 벤더를 복사한 것처럼 보일 수 있다 |
| `SS-02` Fluent       | 명확한 상태 반전과 강한 일반 텍스트 대비를 가진 보수적인 단색 파랑              | 일반적인 기업 상호작용 파랑 및 현재 이전/Toss 계열 파랑과 가깝고 기억성이 약할 수 있다                                                 |
| `SS-03` Carbon       | 테마 값이 같은 안정적이고 눈에 잘 띄는 주요 액션                                | IBM/기술 제품 파랑으로 매우 익숙하고 게임 아트 옆에서 시각적으로 클 수 있다                                                            |
| `SS-04` Primer       | 절제된 Dark/Light 변화의 익숙한 프로덕션 accent                                 | 일반 액션 레시피로 불완전하다. GitHub 연상과 일반 웹 제품 성격이 강하다                                                                |
| `SS-05` Atlassian    | 가장 명시적인 테마 대비 반전과 완전한 3상태 매핑                                | Dark의 밝은 cyan-blue 채움이 NosLog 왼손/차트 cyan과 경쟁하고 Dark에서 시각적으로 무거워진다                                           |
| `SS-06` PatternFly   | 높은 Dark 테마 가독성과 온전한 컴포넌트 매핑                                    | 매우 옅은 Dark 채움은 면적 무게가 가장 커서 조용한 콘텐츠 중심 셸을 지배할 수 있다                                                     |
| `SS-07` SAP          | 완전하게 정의된 active 반전이 있는 보수적 기업 파랑                             | 고정 기본 파랑이 일반적이고 active 반전은 NosLog에 필요한 것보다 구조적 동작이 많을 수 있다                                            |
| `SS-08` Radix Indigo | blue-violet로 움직이는 유일한 비교 유채색 세트이며 현재 스택과 맞는 스케일 의미 | Discord, Real, Twitch, 현재 보라 도메인 영역에 가까우며 스케일 자체가 NosLog 브랜드는 아니다                                           |
| `SS-09` Polaris      | 무채색, 전문적, 가장 강한 대비, 도메인 색과 가장 적은 충돌                      | 유채색 시그니처를 만들지 않는다. 아이덴티티는 마크, 타이포그래피, 비례, 배치에서 나와야 한다                                           |
| `SS-10` MUI          | 매우 잘 알려진 기본 구현 패턴과 명확한 적응형 전경                              | “스타터 템플릿” 익숙함이 가장 크다. 채택하면 사용자가 피하려는 일반적인 Material 외형을 직접 재현한다                                  |

## 기존 정확한 시스템 브라우저 검증 — 2026-08-09

Codex 인앱 브라우저에서 로컬 specimen 서버로 interactive artifact를 렌더링했다.
이 검증은 비교 fixture를 증명하며 어떤 후보의 NosLog 적합성을 증명하지 않는다.

| 검사            | 관찰 결과                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 넓은 비교       | `1440 × 1000`에서 후보 카드 `10`개와 Light/Dark panel `20`개가 가로 overflow 및 mark image 누락 없이 렌더링됐다.                                                |
| compact reflow  | `320 × 900`에서 콘텐츠 폭은 `320px`, 후보 카드는 `304px`였고 후보 grid와 Light/Dark pair가 모두 한 열로 접혔으며 가로 overflow는 0이었다.                       |
| touch target    | `320px`에서 표시된 모든 `button`과 `a` target 높이가 최소 `44px`였다.                                                                                           |
| 기본 텍스트 쌍  | 공개된 기본 fill/on-color 쌍 `20`개가 모두 `4.5:1`을 충족했고 fixture failure는 0이었다.                                                                        |
| 공개 hover 연결 | Adobe Light의 pointer hover가 공개 alias와 같은 `#274DEA` (`rgb(39,77,234)`)로 렌더링됐다. 다른 후보 상태 값도 사용자 비교용 정확한 source swatch로 표시된다.   |
| 선택 control    | 후보 2개를 중립 `#717171` 경계와 명시적 check text로 동시에 표시할 수 있었고 artifact는 “아직 승인 아님” 메시지를 유지했다.                                     |
| 필터 control    | `Indigo 1개` 활성화 후 `SS-08 Radix Colors Indigo`만 보였으며 `aria-pressed`가 해당 필터로 이동했다.                                                            |
| focus-visible   | 키보드 활성화에서 승인된 zero-gap pseudo-boundary가 나타났다. Light 검정, Dark 흰색, `2px` border, `inset: -2px`이며 rest에는 지속되는 authored outline이 없다. |
| runtime 무결성  | 시험 흐름 중 console error/warning 검사 결과 항목이 없었다.                                                                                                     |

Fixture에는 `forced-colors: active`의 `Highlight` fallback이 있지만 이번 단계에서
native forced-colors runtime은 모사하지 않았다. 후보별 색각 시뮬레이션, 실제 jacket/
domain 충돌, localization stress, `200%` text는 사용자 선택 후 다음 측정 context
round에 남는다.

이 표는 기존 시스템 10개 영역을 기록한다. 추가된 정보 서비스 및 비파랑
레퍼런스 영역은 문서 `46`에서 별도로 검증하고 기록한다.

## 선택 결과

1. 온전한 `SS-08` Radix Colors Indigo가 승인된 NosLog identity source다.
2. 정확한 공개 Light/Dark mapping은 분리할 수 없는 하나의 source set으로 유지하며
   보간, hue 이동 또는 system 간 state 교체를 허용하지 않는다.
3. 나머지 9개 후보는 비교 근거로 보존하며 현재 identity source가 아니다.
4. Identity touchpoint alias, filled-action eligibility, 최종 component alias는 이후
   승인 gate로 남는다.
5. 승인 mapping이 이후 NosLog 콘텐츠, semantic 분리 또는 접근성 요구에서 실패하면
   값을 몰래 바꾸지 않고 결정을 다시 연다.

## 결정 로그

| ID       | 항목                                                                                                     | 상태                                          |
| -------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `SSC-01` | 임의의 H0/H1/H2/H3 비교 방식을 정확하고 버전이 고정된 유지 관리 시스템 매핑으로 교체한다.                | `Proposed`                                    |
| `SSC-02` | 고정 Spectrum S2 중립, 중립 일반 상호작용, Fluent 포커스에서 시스템 10개를 비교한다.                     | `Research complete`                           |
| `SSC-03` | 각 후보의 Light/Dark, hover/pressed, on-color 매핑을 분리할 수 없는 하나의 소스 세트로 보존한다.         | `Approved source-integrity rule — 2026-08-10` |
| `SSC-04` | 적합하고 완전한 상위 액션 매핑을 별도로 찾을 때까지 Primer를 아이덴티티 전용 근거로 취급한다.            | `Observed`                                    |
| `SSC-05` | 기본 텍스트 대비 통과를 소스 승인으로 취급하지 않는다.                                                   | `Required evaluation rule`                    |
| `SSC-06` | 선택된 정확한 소스 시스템을 NosLog 맥락 실측 표본 단계로 진행한다.                                       | `SS-08 및 SS-09 실측; SS-08 선택`             |
| `SSC-07` | 정보 서비스 및 비파랑 역할 근거를 문서 `46`에서 옆에 추가하는 동안 이 시스템 10개 세트를 보존한다.       | `Observed`                                    |
| `SSC-08` | 다른 후보를 폐기하지 않고 SS-08과 SS-09를 동일한 실제 NosLog 콘텐츠로 비교한다.                          | `문서 47에서 완료 — 2026-08-10`               |
| `SSC-09` | component alias를 승인하지 않은 채 온전한 SS-08 Radix Colors Indigo를 NosLog identity source로 선택한다. | `Approved — 2026-08-10`                       |
