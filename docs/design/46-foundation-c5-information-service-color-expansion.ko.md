# NosLog 2.0 C5 정보 서비스 컬러 조사 및 비파랑 확장

## 문서 관리

- 상태: `조사 및 specimen 검증 보존 — 문서 47 이후 SS-08을 NosLog identity
source로 선택; 확장 근거 보존`
- 기준 언어: 영문
- 영문 원문:
  [46-foundation-c5-information-service-color-expansion.md](./46-foundation-c5-information-service-color-expansion.md)
- 날짜: 2026-08-10
- 범위: 문서 `45`의 정확한 시스템 후보 10개를 보존하고, 정보 전달 서비스가
  역할별로 컬러를 배정하는 방식을 조사하며, 누락된 Dark 값을 만들지 않고
  비파랑 또는 역할 분리 레퍼런스 10개를 추가
- 입력: 문서 `32`–`45`, 아래 공식 지침, 2026-08-10에 기록한 현재 프로덕션
  페이지 브라우저 관찰
- 제외: 재착색 로고, 최종 identity/action 컴포넌트 별칭, 프로덕션 구현

이 문서는 문서 `45`의 후보 10개를 폐기하거나 대체하지 않는다. 해당 세트가
파랑에 수렴한 이유를 설명한 뒤, 파랑의 운영 안정성과 비파랑 아이덴티티 전략을
사용자가 비교할 수 있도록 근거를 확장한다.

## 분리해서 유지할 질문

이전 비교는 서로 다른 질문 세 개를 하나로 축소했다. 다음 질문은 반드시
분리해야 한다.

1. **읽기 필드:** 정보 페이지에서 가장 큰 면적을 차지하는 색은 무엇인가?
2. **상호작용:** 링크, 진행, 주요 액션을 전달하는 색은 무엇인가?
3. **아이덴티티:** 서비스를 기억하게 만드는 색은 무엇인가?

기억에 남는 로고 컬러가 있다는 이유만으로 완전한 NosLog 시그니처 후보가 되지
않는다. 반대로 흔한 상호작용 파랑이 자동으로 가장 좋은 아이덴티티 컬러인 것도
아니다.

## 고정 NosLog 계약

1. Adobe Spectrum S2는 승인된 모든 Dark/Light 표면, 전경, 경계 역할의 독점
   중립 프리미티브 소스로 유지된다.
2. Fluent는 승인된 `focus-visible` 소스로 유지된다. 아래 어떤 레퍼런스도
   포커스를 재착색하지 않는다.
3. 시그니처 컬러는 안정적이고 작은 아이덴티티 접점과, 온전한 소스 매핑이
   지원할 때만 드문 주요 액션 하나에 나타날 수 있다.
4. 일반 링크, 필터, 선택 행, 난이도, 모드, 손, 점수, 상태, 외부 브랜드,
   시각화 역할은 시그니처 컬러를 상속하지 않는다.
5. Dark 값, 전경, hover, pressed 상태가 없으면 없는 그대로 유지한다. 다른
   스케일이나 소스에서 추론하지 않는다.
6. `FCM-11`, `SIG-07`, 거부된 과도한 강조 예시는 계속 제외한다.

## 조사 방법

이 조사는 독립된 조직 또는 프로덕션 서비스 18개를 사용한다. 공공 서비스,
레퍼런스 및 표준 사이트, 뉴스 및 데이터 출판, 개발자 지식, 유지 관리 제품
시스템을 포함한다. 공식 디자인 지침을 우선한다. 현재 공개 토큰 권위를 찾지
못한 경우 해당 행을 명시적으로 프로덕션 관찰로 표시하고 직접 토큰 채택
대상에서 제외한다.

Financial Times, Reuters, The Guardian, Our World in Data는 2026-08-10에 로컬
브라우저에서 현재 계산 스타일을 확인했다. 이는 시각 및 역할 관찰일 뿐이며
비공개 상태를 조사하지 않았다. 해당 페이지의 정확한 관찰값은 공개된 재사용
토큰 계약으로 취급하지 않는다.

## 정보 전달 레퍼런스 매트릭스

| ID      | 소스 및 분류                                                                                                                                                                    | 큰 면적의 읽기 필드                                     | 아이덴티티 모델                                              | 표준 상호작용 또는 액션                                                    | 전이 가능한 발견                                                                               | 채택 한계                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `IS-01` | [Wikimedia Codex](https://doc.wikimedia.org/codex/latest/style-guide/colors.html) — 백과/레퍼런스                                                                               | 회색과 흰색 Foundation                                  | 주로 중립                                                    | 별도 상태 컬러와 분리된 progressive blue `#3366CC`                         | 중립 콘텐츠와 파란 진행 상호작용은 성숙한 레퍼런스 제품 기준선이다                             | Codex 토큰은 승인된 Spectrum 중립을 대체할 수 없다                             |
| `IS-02` | [W3C Design System](https://design-system.w3.org/settings/) — 표준/문서                                                                                                         | off-white/white와 `#111111` 텍스트                      | W3C blue `#005A9C`                                           | link blue `#005A9C`, yellow focus, 의미별 상태 컬러                        | 파랑이 기관 인식과 링크 예측 가능성을 함께 담당한다                                            | Light 전용 공개 매핑이며 포커스는 이미 Fluent 소유다                           |
| `IS-03` | [GOV.UK 컬러](https://design-system.service.gov.uk/styles/colour/) 및 [Button](https://design-system.service.gov.uk/components/button/) — 공공 서비스                           | 흰색과 근중립 표면                                      | brand blue `#1D70B8`                                         | link blue `#1A65A6`, 기본 업무 button green `#0F7A52`                      | 브랜드, 탐색, 거래 액션이 다른 색을 써도 신뢰를 잃지 않을 수 있다                              | 사이트 전체 Dark 매핑이 없고 green은 아이덴티티 근거가 아니다                  |
| `IS-04` | [NHS 컬러](https://service-manual.nhs.uk/design-system/styles/colour) 및 [Buttons](https://service-manual.nhs.uk/design-system/components/buttons) — 건강 정보/서비스           | dark text와 tinted neutral `#F0F4F5`                    | NHS blue `#005EB8`                                           | link blue `#005EB8`, primary action green `#007F3B`                        | 신뢰도가 높은 정보 서비스가 blue 소유권과 green 완료/액션을 분리한다                           | Light 전용이며 green은 성공도 소유하고 NosLog success/Normal과 충돌한다        |
| `IS-05` | [USWDS theme 컬러 토큰](https://designsystem.digital.gov/design-tokens/color/theme-tokens/) — 정부 서비스 시스템                                                                | 대개 neutral base가 지배적                              | 관리되는 역할 모델 안에서 프로젝트별                         | 기본 primary blue `#005EA2`, secondary red `#D83933`                       | 이름 있는 컬러군이 여러 개여도 중립 base가 지배할 수 있다                                      | USWDS는 사용자화 가능하며 NosLog용 단일 Dark 아이덴티티 세트를 공개하지 않는다 |
| `IS-06` | [Canada.ca 컬러](https://design.canada.ca/styles/colours.html) — 정부 정보                                                                                                      | 대부분 white `#FFFFFF`, dark-gray text `#333333`        | 정부 시그니처와 페이지 스타일을 분리                         | links `#284162`, main accent `#26374A`, red는 error 전용                   | 국가의 red가 정보 UI를 채울 필요는 없고 안정적인 dark blue가 탐색을 지원한다                   | Light 전용 지침이며 시그니처 액션 매핑이 아니다                                |
| `IS-07` | [UK Parliament 컬러](https://designsystem.parliament.uk/foundations/colour/) — 시민 정보                                                                                        | near-neutral `#EBE9E8`, white container, gray body text | deep purple `#373151`, 의회별 green/red                      | standard interaction blue `#3569CC`                                        | 강한 비파랑 아이덴티티와 관습적인 파란 상호작용이 공존할 수 있다                               | 완전한 Dark 시스템이 없고 House 컬러는 일반 시그니처가 아닌 도메인 소유다      |
| `IS-08` | [BBC GEL](https://bbc.github.io/gel/) 및 [Buttons and CTAs](https://bbc.github.io/gel/components/buttons-and-ctas/) — 뉴스/공영 미디어                                          | 서비스별 처리가 있는 콘텐츠 중심 중립 필드              | 전역 BBC 마크와 셸은 매우 무채색                             | GEL은 하나의 BBC 공통 액션 색 대신 각 서비스의 확립된 링크 컬러를 요구한다 | 정보 네트워크가 전역 아이덴티티를 무채색으로 유지하고 지역 서비스에 제한된 컬러를 맡길 수 있다 | GEL은 원칙/컴포넌트 근거이며 하나의 정확한 전 서비스 팔레트가 아니다           |
| `IS-09` | [Stack Overflow 브랜드 컬러](https://stackoverflow.design/brand/color) 및 [logo](https://stackoverflow.design/brand/logo) — Q&A/지식                                            | 제품 UI는 중립이며 테마 대응                            | Stack Orange `#FF5E00`, 선호 로고는 Off-Black 또는 Off-White | 제품 테마 토큰은 브랜드 컬러와 별도로 대응                                 | orange가 모든 링크나 control이 되지 않아도 기억에 남을 수 있다                                 | 브랜드 지침은 완전한 Light/Dark 액션 레시피가 아니다                           |
| `IS-10` | [Mozilla Protocol 브랜드 테마](https://protocol.mozilla.org/docs/fundamentals/brand-themes) 및 [color](https://protocol.mozilla.org/docs/fundamentals/color) — 문서/에디토리얼  | Mozilla 테마는 대부분 black/white                       | `#161616` / `#FAFAFA` 무채색 아이덴티티                      | 넓은 named color는 선택적 보조 재료                                        | 타이포그래피와 구성만으로 거의 유채색 없이 아이덴티티를 만들 수 있다                           | color 페이지는 Draft이며 선택 스와치는 하나의 시그니처 매핑이 아니다           |
| `IS-11` | [Ubuntu Vanilla 컬러](https://vanillaframework.io/docs/settings/color-settings) 및 [Buttons](https://vanillaframework.io/docs/patterns/buttons) — 제품 문서                     | 명시적 중립 팔레트                                      | Ubuntu orange `#E95420`                                      | link blue `#0066CC`, positive action 별도, brand button 폐기 예정          | routine interaction을 orange로 만들지 않기 때문에 orange 아이덴티티가 유지된다                 | 현재 완전한 orange 액션 매핑이 없고 deprecated brand button을 되살리면 안 된다 |
| `IS-12` | [GitLab Pajamas 컬러](https://design.gitlab.com/product-foundations/color/) 및 [design tokens](https://design.gitlab.com/product-foundations/design-tokens/) — 개발 플랫폼/문서 | Light/Dark 중립 UI                                      | purple은 명시적으로 GitLab과 연결되고 브랜드는 orange도 소유 | orange는 제품 의미에서 warning 전달                                        | 제품 시맨틱이 brand purple을 보호하면서 orange의 일반 accent화를 막는다                        | 다색 브랜드 시스템과 고정 brand color는 하나의 NosLog dual-theme 세트가 아니다 |
| `IS-13` | [Our World in Data](https://ourworldindata.org/) 및 [공식 Grapher 저장소](https://github.com/owid/owid-grapher) — 데이터 출판                                                   | 관찰된 white 필드와 dark blue text `#1D3D63`            | 절제된 wordmark/editorial identity                           | 밝은 blue `#1059E5`가 interaction에 나타나고 data color는 별도             | 데이터가 풍부한 출판사도 chart color가 의미를 담당하도록 셸을 blue-neutral로 유지한다          | 프로덕션 관찰일 뿐 재사용 가능한 시그니처 토큰 계약을 확인하지 못했다          |
| `IS-14` | [Reuters Agency](https://reutersagency.com/about/) — 뉴스/아카이브                                                                                                              | 관찰된 white, black, dark-gray 에디토리얼 필드          | black/white와 함께 제한된 orange `#AB3300`                   | orange가 모든 기사 콘텐츠를 재착색하지 않고 선택 링크와 CTA를 표시         | 따뜻한 아이덴티티 단서도 면적을 제한하면 밀도 높은 뉴스와 공존할 수 있다                       | 프로덕션 관찰이며 정확한 Light/Dark 토큰 권위가 공개되지 않았다                |
| `IS-15` | [Financial Times](https://www.ft.com/) — 금융 뉴스                                                                                                                              | 관찰된 warm paper `#FFF1E5`, text `#33302E`             | 페이지 필드 자체가 인식 가능한 아이덴티티 장치               | 관찰된 teal interaction `#0D7680`                                          | 아이덴티티가 action accent가 아닌 제한된 field color에서 나올 수 있다                          | Spectrum S2가 NosLog 표면을 이미 소유하므로 표면 후보가 아닌 참고 전용이다     |
| `IS-16` | [The Guardian](https://www.theguardian.com/international) — 뉴스                                                                                                                | 관찰된 white field, dark text `#121212`                 | dark navy `#052962`, yellow `#FFE500`, 섹션별 컬러           | 안정된 셸 아래 여러 에디토리얼 섹션 컬러 공존                              | 뉴스 계층이 읽기 필드를 컬러풀하게 만들지 않고 여러 제한된 분류 컬러를 쓸 수 있다              | 다중 accent 모델은 lean C5 signature gate와 충돌하며 직접 채택할 수 없다       |
| `IS-17` | [GitHub Primer 컬러 프리미티브](https://primer.style/product/primitives/color/) — 개발 지식/제품                                                                                | neutral Light/Dark shell                                | GitHub identity는 대체로 무채색                              | accent/progressive blue가 interaction 담당                                 | 익숙한 blue가 조밀한 기술 정보 제품에서 예측 가능성을 유지한다                                 | 정확한 일반 filled-action 상태는 문서 `45`에서 계속 불완전하다                 |
| `IS-18` | [IBM Carbon 컬러 토큰](https://carbondesignsystem.com/elements/color/tokens/) — 기업/data UI                                                                                    | neutral theme가 조밀한 콘텐츠 구성                      | IBM identity는 대부분 component surface와 분리               | primary action blue `#0F62FE`                                              | 하나의 명확한 파란 interaction family가 조밀한 분석 UI까지 확장된다                            | 강한 IBM 연상과 높은 salience는 NosLog 위험으로 남는다                         |

## 측정된 수렴

다음 수치는 이 조사 표본만 설명하며 보편적인 웹 통계가 아니다.

1. **중립 면적이 지배한다.** 18개 중 17개가 주요 읽기 필드를 중립 또는
   근중립으로 유지한다. warm paper 필드를 아이덴티티로 사용하는 Financial
   Times가 분명한 예외다.
2. **파랑은 가장 안전한 상호작용 관습이다.** Wikimedia, W3C, GOV.UK, NHS,
   USWDS, Canada.ca, UK Parliament, Our World in Data, GitHub Primer, IBM Carbon
   10개가 standard link, progressive, primary-interaction family로 blue를
   명시적으로 공개하거나 현재 사용한다.
3. **비파랑 아이덴티티는 흔하지만 제한적이다.** UK Parliament, Ubuntu,
   Stack Overflow, GitLab, Reuters, Financial Times, The Guardian은 대부분의
   읽기 콘텐츠를 중립으로 유지하며 인식 가능한 비파랑 장치를 보여준다.
4. **공공 서비스의 green은 일반 아이덴티티가 아닌 업무/액션 의미다.** GOV.UK와
   NHS 모두 blue brand/link 소유권을 유지하며 green primary button을 쓴다.
5. **기억에 남는 색이 모든 역할을 소유할 필요는 없다.** 가장 강한 비파랑
   레퍼런스는 아이덴티티를 link, feedback, data, ordinary UI와 분리한다.

이는 사용자의 직감을 뒷받침한다. 파랑은 정보 제품에서 가장 덜 놀라운 운영
선택이다. 그렇다고 파랑이 반드시 NosLog 아이덴티티 컬러여야 한다는 증거는
아니다. routine interface를 중립으로 유지하고 누락된 테마 동작을 만들지
않는다면 절제된 비파랑 아이덴티티도 안정적일 수 있다.

## 추가된 비파랑 또는 역할 분리 레퍼런스 10개

다음 레퍼런스는 문서 `45`의 정확한 시스템 10개를 대체하지 않고 그 옆에
추가된다.

| ID      | 표시할 소스 역할                       | 정확한 공개값 또는 관찰값                                                               | 비교로 확인할 수 있는 것                                                        | 게이트 상태                                                  |
| ------- | -------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `NB-01` | Material 3 baseline purple primary     | Light `primary #6750A4 / onPrimary #FFFFFF`, Dark `primary #D0BCFF / onPrimary #381E72` | 실제 비파랑 테마 대응 기본 쌍이 존재한다                                        | `정확한 dual default role; hover/pressed action gate 불완전` |
| `NB-02` | UK Parliament 아이덴티티/상호작용 분리 | brand `#373151`, standard interaction `#3569CC`                                         | purple이 identity, blue가 predictable interaction을 소유할 수 있다              | `아이덴티티 참고 전용; 완전한 Dark 매핑 없음`                |
| `NB-03` | GitLab 브랜드 계열                     | purple `#7759C2`, orange `#FC6D26`, product brand-status background `#E1D8F9`           | brand color를 warning 및 routine UI에서 시맨틱하게 격리할 수 있다               | `참고 전용; 하나의 single-color dual set가 아님`             |
| `NB-04` | Ubuntu 아이덴티티/상호작용 분리        | brand orange `#E95420`, link blue `#0066CC`                                             | orange identity가 orange link/button을 요구하지 않는다                          | `아이덴티티 참고 전용; orange brand button deprecated`       |
| `NB-05` | Stack Overflow 아이덴티티              | Stack Orange `#FF5E00`, 선호 mark Off-Black `#201C1D` / Off-White `#F0EFEE`             | vivid orange는 제한적으로 유지하면서 mark는 무채색일 수 있다                    | `아이덴티티 참고 전용`                                       |
| `NB-06` | Reuters 프로덕션 아이덴티티            | white/black 에디토리얼 필드와 관찰된 orange `#AB3300`                                   | 따뜻한 아이덴티티 단서가 면적을 제한하면 밀도 높은 뉴스 옆에서 유지된다         | `프로덕션 관찰 전용`                                         |
| `NB-07` | GOV.UK 업무 액션                       | brand `#1D70B8`, link `#1A65A6`, button `#0F7A52`                                       | blue가 정보 탐색을 담당하며 green이 드문 transaction을 명확히 할 수 있다        | `액션 역할 참고 전용; Dark set 없음`                         |
| `NB-08` | NHS 업무 액션                          | brand/link `#005EB8`, button `#007F3B`                                                  | 신뢰도 높은 두 번째 서비스도 blue-information/green-action 분리를 반복한다      | `액션 역할 참고 전용; Dark set 없음`                         |
| `NB-09` | Financial Times 에디토리얼 필드        | page `#FFF1E5`, text `#33302E`, interaction `#0D7680`                                   | field color가 action accent가 아닌 identity가 될 수 있다                        | `참고 전용; Spectrum neutral surface 고정`                   |
| `NB-10` | Mozilla 무채색 아이덴티티              | Mozilla Black `#161616`, Mozilla White `#FAFAFA`                                        | chromatic master 없이 typography, mark, composition이 identity를 담당할 수 있다 | `무채색 대조군; color 페이지 Draft`                          |

조사한 추가 근거 중 정확한 Light/Dark `primary`와 `on-primary` 쌍을 공개한
소스는 Material 3 하나뿐이다. 그러나 web hover/pressed state-layer 동작을
온전히 해석하지 않았으므로 아직 드문 액션 게이트에는 들어가지 않는다. 나머지
9개는 역할 및 아트 디렉션 질문에만 답한다. 누락된 Dark 또는 state 값은
specimen에서 누락된 그대로 표시한다.

## 계열별 NosLog tradeoff

### Blue

- 예측 가능한 정보 탐색과 전문적인 액션 근거가 가장 강하다.
- 학습 비용이 가장 낮지만 enterprise template과 구별되지 않거나 일반적으로
  보일 위험이 가장 크다.
- 기존 문서 `45`가 소스 수준 비교용 정확한 시스템 10개를 제공한다.

### Purple

- Material 3의 정확한 dual default pair, UK Parliament의 절제된 시민
  아이덴티티, GitLab의 브랜드 소유가 근거다.
- Discord, Twitch, Real, 기존 NosLog 보라 도메인 또는 외부 브랜드 역할과
  충돌할 위험이 있다.

### Orange

- Ubuntu, Stack Overflow, GitLab, Reuters가 절제된 identity 근거를 제공한다.
- blue보다 구별성이 강하지만 Hard, warning, score, right-hand 영역과
  충돌한다. 추가 orange 소스 중 완전한 NosLog-ready Light/Dark action
  레시피를 제공하는 곳은 없다.

### Green

- 드문 primary transaction에 대한 강한 공공 서비스 근거가 있다.
- success와 Normal이 이미 소유하므로 NosLog 아이덴티티 적합성은 약하다.
  조사한 예시는 Light 전용이며 정보 탐색에는 blue를 유지한다.

### Warm pink paper / teal interaction

- Financial Times는 매우 인식 가능한 editorial field가 안정적일 수 있음을
  증명한다.
- Spectrum S2 중립이 이미 승인되었고 Recital/pink 및 chart/teal 소유권과
  충돌하므로 NosLog가 해당 surface 모델을 복사할 수 없다.

### Achromatic

- Mozilla와 Polaris는 semantic collision이 가장 낮고 mark, typography,
  rhythm, composition에 가장 의존한다.
- 유효한 대조군이지만 그 자체로 chromatic signature 요구에 답하지 않는다.

## 브라우저 검증

확장 specimen을 2026-08-10에 인앱 테스트 브라우저에서 검증했다. 이 검증은
표시와 회귀 동작만 확인하며 소스, 컬러 계열, semantic assignment를 승인하지
않는다.

| 대상          | 결과                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `1440 × 1000` | 보존한 정확한 시스템 카드 10개와 추가 역할 레퍼런스 카드 10개가 가로 overflow 없이 2열로 표시된다.                                         |
| `320 × 900`   | 두 카드 그룹이 가로 overflow 없이 `289px` 콘텐츠 1열로 reflow되며 모든 이미지가 로드된다.                                                  |
| 기존 컨트롤   | `Blue 7개`가 정확한 시스템 세트만 7개로 필터링하고 역할 레퍼런스 10개는 그대로 둔다. 비교 고정/해제도 live selection tray를 계속 갱신한다. |
| 타깃 크기     | 모든 필터와 비교 컨트롤이 두 검증 폭에서 최소 `44px` 높이를 유지한다.                                                                      |
| 런타임        | specimen은 정확한 후보 10개, 레퍼런스 10개, 표시 소스 20개를 보고하며 콘솔 경고와 오류가 없다.                                             |

## 검토한 조사 경로와 결과

이 조사 자체는 어떤 컬러 계열도 승인하지 않았다. 다음 경로를 제시했다.

1. 문서 `45`의 정확한 blue system 하나 이상을 실제 NosLog 콘텐츠 시험으로
   진행한다.
2. `NB-01`–`NB-06` 중 비파랑 **아이덴티티 방향**을 진행해 어떤 action color도
   제안하기 전에 온전한 Dark/state 소스를 추가 조사한다.
3. Polaris/Mozilla 무채색 대조군을 유지한다.
4. 동일한 실측 NosLog 맥락에서 blue system 하나, non-blue identity 방향 하나,
   achromatic control 하나를 비교한다.

`NB-07`, `NB-08`은 아이덴티티 후보가 아닌 액션 역할 근거다. `NB-09`는
에디토리얼 표면 근거이며 승인된 Spectrum neutral system을 대체할 수 없다.

2026-08-10 사용자는 `SS-08` Radix Colors Indigo와 `SS-09` Shopify Polaris를
[문서 `47`](./47-foundation-c5-finalist-noslog-context-comparison.ko.md)의 동일 실제
콘텐츠 비교로 진행했다. 이는 어느 source도 선택하거나 위의 확장 근거를 폐기하지
않고 비교 gate를 진행한다.

문서 `47` 비교 후 사용자는 2026-08-10 온전한 `SS-08` Radix Colors Indigo를
NosLog identity source로 선택했다. 비파랑, 역할 분리, 무채색 근거는 계속 보존하지만
현재 identity 방향이 아니다.

## 결정 로그

| ID       | 항목                                                                                       | 상태                                            |
| -------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `ISC-01` | 정확한 시스템 후보 10개와 기존 검증을 모두 보존한다.                                       | `Required`                                      |
| `ISC-02` | 컬러 비교 전에 reading field, standard interaction, identity를 분리한다.                   | `Research rule`                                 |
| `ISC-03` | 정보 서비스 18개 조사와 측정된 표본 수를 기록한다.                                         | `Research complete`                             |
| `ISC-04` | 누락된 Dark/state 값을 완성하지 않고 비파랑 또는 역할 분리 레퍼런스 10개를 추가한다.       | `조사 및 specimen 검증 완료; 사용자 검토 대기`  |
| `ISC-05` | blue를 자동 승인된 아이덴티티 컬러가 아니라 관찰된 가장 안전한 상호작용 관습으로 취급한다. | `Observed`                                      |
| `ISC-06` | 실측 NosLog 콘텐츠로 진행할 blue, non-blue identity, achromatic 방향을 선택한다.           | `SS-08 및 SS-09를 문서 47에서 실측; SS-08 선택` |
| `ISC-07` | 확장 근거를 보존하면서 온전한 SS-08 Radix Colors Indigo를 identity source로 채택한다.      | `Approved — 2026-08-10`                         |

## 출처

- [Android Developers: Dynamic Color 토큰 예시](https://developer.android.com/develop/ui/views/theming/dynamic-colors)
- [BBC GEL](https://bbc.github.io/gel/)
- [Canada.ca 컬러](https://design.canada.ca/styles/colours.html)
- [Financial Times](https://www.ft.com/)
- [GitLab Pajamas 컬러](https://design.gitlab.com/product-foundations/color/)
- [GOV.UK 컬러](https://design-system.service.gov.uk/styles/colour/)
- [IBM Carbon 컬러 토큰](https://carbondesignsystem.com/elements/color/tokens/)
- [Mozilla Protocol 브랜드 테마](https://protocol.mozilla.org/docs/fundamentals/brand-themes)
- [NHS 컬러](https://service-manual.nhs.uk/design-system/styles/colour)
- [Our World in Data](https://ourworldindata.org/)
- [Reuters Agency](https://reutersagency.com/about/)
- [Stack Overflow 브랜드 컬러](https://stackoverflow.design/brand/color)
- [The Guardian](https://www.theguardian.com/international)
- [UK Parliament 컬러](https://designsystem.parliament.uk/foundations/colour/)
- [Ubuntu Vanilla 컬러](https://vanillaframework.io/docs/settings/color-settings)
- [USWDS theme 컬러 토큰](https://designsystem.digital.gov/design-tokens/color/theme-tokens/)
- [W3C Design System 설정](https://design-system.w3.org/settings/)
- [Wikimedia Codex 컬러](https://doc.wikimedia.org/codex/latest/style-guide/colors.html)
