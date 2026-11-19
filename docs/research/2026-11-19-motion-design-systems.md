# 움직임 — 디자인 시스템 11곳 공식 모션 지침 (2026-11-19)

공통 층 3단계 움직임 판의 근거 조사다. 디자인 시스템이 정한 시간 단계 · 곡선 · 자리별 값 · 동작 줄이기 지침을 모은다. 추천은 쓰지 않는다. 실제 서비스 실측은 다른 세션 넷이 따로 센다(이 파일은 0곳).

표본: 디자인 시스템 11곳(Material 3 · Apple HIG · IBM Carbon · Microsoft Fluent 2 · Adobe Spectrum 2 · 당근 SEED · 토스 TDS · GitHub Primer · Atlassian · Ant Design · Shopify Polaris). 공식 문서와 공식 소스(GitHub 원본 · npm 꾸러미)를 2026-11-19 에 curl 로 읽었고, Material 3 문서만 headless Playwright 로 본문을 받았다. 숫자는 시스템마다 한두 개씩 원본 파일을 다시 받아 대조했다(아래 「대조한 값」).

먼저 읽은 기록: 당근 CSS 변수 값(시간 8 · 이징 7 · 눌림 크기)은 공유 메모 `common-layer/stage3/daangn-tokens.md` 1-21 · 1-22 절에 있어 다시 재지 않았다. 이 파일의 SEED 절은 그 토큰을 문서가 어디에 쓰라고 하는지와 컴포넌트 정의값만 더한다. [토스트 자리 10곳](./2026-11-11-toast-position.md)은 자리만 다뤄 움직임 값은 겹치지 않는다.

원자료(시스템마다 출처 파일:줄 · 원문 발췌)는 `~/noslog-research/motion-ds-2026-11-19/<시스템>.md` 에 있다. 자리 × 시스템 표는 공유 메모 `common-layer/stage3/motion/mo-ds/DS.md`.

## 한눈에

| 곳         | 시간 단계            | 곡선 이름                                      | 스프링           | 문서에 자리별 값 | 상태                                                                |
| ---------- | -------------------- | ---------------------------------------------- | ---------------- | ---------------- | ------------------------------------------------------------------- |
| Material 3 | 16단계 50–1000ms     | 표준 · 강조 × 들어옴 · 나감                    | 있음(지금 체계)  | 일부             | easing · duration 은 「no longer maintained」, 스프링으로 바뀌는 중 |
| Apple HIG  | 없음                 | 없음(Core Animation 4개)                       | SwiftUI 기본값   | 없음             | 글 지침만                                                           |
| IBM Carbon | 6단계 70–700ms       | productive · expressive × 표준 · 들어옴 · 나감 | 없음             | 있음             | 안정                                                                |
| Fluent 2   | 8단계 50–500ms       | 가속 · 감속 · 양쪽 각 강약                     | 없음             | 없음(소스만)     | 문서에 숫자 없음                                                    |
| Spectrum 2 | 없음                 | 이름만(값 없음)                                | 없음             | 없음(구현만)     | 「still being developed」                                           |
| 당근 SEED  | 6단계 50–300ms       | 표준 · 들어옴 · 나감 · 강조 들어옴 · 강조 나감 | 없음             | 컴포넌트 정의에  | 안정                                                                |
| 토스 TDS   | 없음                 | bezier 5개(용도 없음)                          | 프리셋 8개       | 없음             | 공개 문서에 모션 기초값 없음, 값은 npm 꾸러미                       |
| Primer     | 역할 4단계 100–500ms | hover · enter · exit · move · linear           | 없음             | 토큰 설명에      | 토큰과 구현이 다름                                                  |
| Atlassian  | 8단계 0–600ms        | out.bold · inout.bold · in/out.practical 등    | experimental 1개 | 있음(의미 토큰)  | Early Access, 기능 플래그 뒤                                        |
| Ant Design | 3단계 100–300ms      | 8개(용도 없음)                                 | 없음             | 없음(소스만)     | 안정                                                                |
| Polaris    | 12단계 0–5000ms      | ease · in · out · in-out · linear              | 없음             | 없음(구현만)     | 문서는 shopify.dev 로 넘어감, React 리포 보관                       |

다크 모드와 모션을 함께 말한 곳: 11곳 중 0곳(모두 「언급 없음」).

## 곳마다

### Google Material 3

출처: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs · …/applying-easing-and-duration · …/overview/how-it-works · …/overview/specs · …/transitions/transition-patterns · …/transitions/applying-transitions, `@material/web@2.5.0` `tokens/versions/latest/sass/_md-sys-motion.scss`, Compose `MotionTokens.kt` · `StandardMotionTokens.kt` · `ExpressiveMotionTokens.kt`, MDC-Android.

- 시간: short1–4 50 · 100 · 150 · 200, medium1–4 250 · 300 · 350 · 400, long1–4 450 · 500 · 550 · 600, extra-long1–4 700 · 800 · 900 · 1000ms. short 는 「small utility-focused transitions」, extra-long 은 사용자 입력 없는 배경 전환.
- 곡선: standard (0.2, 0, 0, 1) · standard.decelerate (0, 0, 0, 1) · standard.accelerate (0.3, 0, 1, 1) · emphasized.decelerate (0.05, 0.7, 0.1, 1) · emphasized.accelerate (0.3, 0, 0.8, 0.15). emphasized 는 Android 2구간 경로이고 CSS 는 「N/A (Use Standard as a fallback)」. material-web 컴포넌트 안은 (0.3, 0, 0, 1)을 써서 토큰과 다르다.
- 권장 짝(Applying 표): Emphasized 500 · 강조 들어옴 400 · 강조 나감 200 · Standard 300 · 표준 들어옴 250 · 표준 나감 200ms. 「The Emphasized easing set is recommended for most transitions」.
- 스프링(2025-05 부터 지금 체계): expressive · standard × fast · default · slow × spatial · effects. 웹용 변환표가 있다. 예: standard fast spatial (0.27, 1.06, 0.18, 1) 350ms, fast effects (0.31, 0.94, 0.34, 1) 150ms, default effects 200ms, slow effects 300ms.
- 자리(material-web 구현): 상태 층 hover 15ms linear · 물결 퍼짐 450ms · 메뉴 열기 500ms 닫기 150ms · 대화상자 열기 500ms(본체 −50px 에서) 닫기 150ms · 탭 표시 이동 250ms · 막대 진행 확정 250ms. 스낵바(MDC-Android) slide 250ms, fade 150/75ms. 눌림 축소 · 아코디언 · 그래프는 없음.
- 문서 지침: 바텀시트는 페이드하지 말 것, 화면 안 등장은 가장자리에서 먼 쪽으로 펼침, 「Scale and z-axis motion is avoided」(Android). 표시 지연: 200ms 미만 표시 없음, 200ms–5초 로딩 표시, 5초 넘으면 진행 표시(progress-indicators guidelines).
- 원칙: 작은 영역 짧게 · 큰 영역 길게, 나감 · 닫힘 · 접힘은 짧게(들어옴 500 / 나감 200 예).
- 동작 줄이기: 「Use subtle fades instead of intense sliding or scaling animations」, 시차 · 모양 바뀜 끄기. 구현은 포커스 링 끄기, 탭 표시를 이동 대신 투명도로.
- 못 연 것: bottom sheet · dialog · tabs 부품 지침 쪽(대기 스크립트에서 부하로 멈춤). 이 자리는 모션 문서와 구현값으로만 채웠다.

### Apple Human Interface Guidelines

출처: https://developer.apple.com/design/human-interface-guidelines/motion · …/accessibility · …/loading · …/progress-indicators · …/dark-mode(JSON 꼴로 받음), SwiftUI · Core Animation 개발자 문서.

- HIG 에 시간 단계 · 곡선 역할 · 자리별 숫자 없음.
- 개발자 문서 기본값: SwiftUI easeIn/easeOut/easeInOut/linear 0.35초, `Animation.default` = spring(response 0.55, dampingFraction 1.0), `spring(duration:bounce:)` 0.5초 · bounce 0. Core Animation `default` (0.25, 0.1, 0.25, 1) 「matches that of most system animations」, easeIn (0.42, 0, 1, 1), easeOut (0, 0, 0.58, 1), easeInEaseOut (0.42, 0, 0.58, 1).
- 글 지침: 자주 일어나는 상호작용에 움직임을 더하지 않기, 피드백 애니메이션은 짧고 정확하게, 움직임을 취소할 수 있게. 진행 표시는 계속 움직이고 원형에서 막대로 바꾸지 않기. 로딩은 「Show something as soon as possible」.
- 동작 줄이기(Accessibility › Cognitive): 자동 · 반복 애니메이션 줄이기, 스프링 튕김 줄이기, z축 깊이 변화 피하기, x · y · z 이동 전환을 페이드로 바꾸기, 흐림 안팎 애니메이션 피하기.

### IBM Carbon

출처: https://carbondesignsystem.com/elements/motion/overview/ · …/choreography/ · …/code/, `packages/motion/tokens/motion.tokens.json` · `surfaces.tokens.json`(carbon main 3987785f0c), 컴포넌트 SCSS.

- 시간: fast-01 70(버튼 · 토글) · fast-02 110(페이드) · moderate-01 150(작은 펼침, 「Default transition speed.」) · moderate-02 240(펼침 · 시스템 알림 · 토스트) · slow-01 400(큰 펼침 · 중요한 알림) · slow-02 700ms(배경 어둡게).
- 곡선: productive 표준 (0.2, 0, 0.38, 0.9) · 들어옴 (0, 0, 0.38, 0.9) · 나감 (0.2, 0, 1, 0.9), expressive 표준 (0.4, 0.14, 0.3, 1) · 들어옴 (0, 0, 0.3, 1) · 나감 (0.4, 0.14, 1, 1). expressive 는 「occasional, important moments」. 튐 · 늘어남 · 급정지 곡선 금지.
- 자리(구현): 버튼 색 70ms 들어옴 productive · 메뉴 항목 70ms · 토글 70ms · 대화상자 배경과 본체 240ms(본체 −24px 에서), 열 때 들어옴 expressive · 닫을 때 나감 expressive(시간 같음) · 탭은 밑줄이 미끄러지지 않고 색만 70ms · 아코디언 패널 110ms · 스켈레톤 3000ms · 스피너 690ms linear · 진행 막대 확정 110ms. 표면 레시피(feature flag): 팝오버 110ms scale 0.96 → 1, 펼침 150ms.
- 원칙: 이동 거리 · 크기가 클수록 길게, 사이드 패널처럼 가까이 머무는 것은 나갈 때도 표준 곡선, 표 내용 20ms 간격 · 전체 500ms 안. 로더는 3초 넘을 때.
- 동작 줄이기: 문서는 「Always provide alternatives for interface state transitions」. 구현은 줄이기면 transition · animation 을 끈다.

### Microsoft Fluent 2

출처: https://fluent2.microsoft.design/motion (숫자 없음), `@fluentui/tokens` `global/durations.ts` · `curves.ts`, react-motion 컴포넌트(microsoft/fluentui master feab6ba63b).

- 시간: ultraFast 50 · faster 100 · fast 150 · normal 200 · gentle 250 · slow 300 · slower 400 · ultraSlow 500ms. 단계별 쓰임 설명 없음.
- 곡선: accelerateMax (0.9, 0.1, 1, 0.2) · accelerateMid (1, 0, 1, 1) · accelerateMin (0.8, 0, 0.78, 1) · decelerateMax (0.1, 0.9, 0.2, 1) · decelerateMid (0, 0, 0, 1) · decelerateMin (0.33, 0, 0.1, 1) · easyEaseMax (0.8, 0, 0.2, 1) · easyEase (0.33, 0, 0.67, 1) · linear.
- 자리(소스): 버튼 색 100ms easyEase · 스위치 200ms · 메뉴 · 팝오버 들어옴만 400ms decelerateMid + 10px, 나감 없음 · 대화상자 scale 0.85 에서 250ms(들어옴 decelerateMid, 나감 accelerateMin), 배경 250ms · 토스트 크기 200ms 다음 투명도 400ms · 드로어 크기별 250/300/400/500ms · 탭 밑줄 이동 300ms decelerateMax · 아코디언 200ms easyEaseMax · 스켈레톤 3s · 스피너 1.5s · 툴팁 열림 · 닫힘 지연 250ms.
- 원칙: 큰 요소에 시간을 더 주기, 최상위 화면 이동은 빠른 페이드, 대부분 차례 등장(stagger) 선호.
- 동작 줄이기: WCAG 처럼 「no motion」 설정 넣기. 구현 기본은 시간을 1ms 로 줄임, 불확정 진행 막대는 이동 대신 투명도 맥박.

### Adobe Spectrum 2

출처: https://spectrum.adobe.com/foundations/behavior/motion, adobe/spectrum-design-data `registry/easing-curves.json` · `motion-roles.json`, `@adobe/spectrum-tokens` 15.8.0, adobe/react-spectrum S2 구현(7e229ef6).

- 문서 머리 「Motion in Spectrum 2 is still being developed.」 디자인 토큰에 시간 · 곡선 없음. 레지스트리는 이름만(standard · decelerate · accelerate 등, 「provisional」).
- 구현 기본: transition 150ms, default (0.45, 0, 0.4, 1), in(나감) (0.5, 0, 1, 1), out(들어옴) (0, 0, 0.4, 1). 곡선 정의 위에 `// TODO`.
- 문서 지침: 버튼은 누를 때 줄어든다(구현은 원근 −2px). 화살표 버튼 hover 직선 움직임은 아껴 씀.
- 자리(구현): 팝오버 · 툴팁 200ms + 4px, 나갈 때만 in 곡선 · 대화상자 배경 들어옴 250 / 나감 130ms, 본체 20px 에서 250 / 130ms(160ms 지연) · 토스트 400ms · 탭 표시 200ms out · 스켈레톤 2000ms · 진행 막대 1000ms. 토스트 자동 닫힘 최소 5000ms.
- 동작 줄이기: 큰 면 움직임은 시스템 설정을 따르라. 구현은 탭 표시 · 펼침 끄기, 토스트는 미끄러짐 대신 페이드.

### 당근 SEED

출처: https://seed-design.io/foundations/motion · …/foundations/feedback · …/foundations/feedback/scale · …/foundations/inclusive-design, daangn/seed-design dev 6c1fa1fcb1 `packages/rootage/duration.yaml` · `timing-function.yaml` · `components/*.yaml`(106개).

- 시간 d1–d6 값은 공유 메모 daangn-tokens.md 와 같다(50–300ms). 문서에 단계별 용도 문장은 없고 두 가지만 정한다: 「마이크로 모션은 0.2초 이하」, 누름 색 전환과 축소가 둘 다 d3 150ms.
- 곡선 용도(motion.mdx): easing = 버튼 클릭 · 입력창 포커스 같은 기능적 마이크로 모션, enter · exit = 다이얼로그 · 시트가 나타나고 사라지는 매크로 모션, expressive = 특히 강조할 들어옴 · 나감.
- 자리(컴포넌트 정의): 메뉴 · 팝오버 · Select 들어옴 150 / 나감 100ms, 투명도 0 + scale 0.95 에서 · 대화상자 본문 200 / 100ms, 들어옴 enter-expressive 로 scale 1.3 에서, 배경막 100 / 100ms · 바텀시트 300 / 200ms 밀어 올림(enter-expressive / exit) · 사이드 패널 300 / 300ms · 스낵바 150 / 100ms scale 0.8 에서, 표시 4000ms · 탭 표시 200ms easing · 아코디언 300ms · 스위치 색 50ms 손잡이 150ms · 입력칸 테두리 100ms · 스켈레톤 1.5s · 진행 원 무한 1.2s. hover 값 · 진행 막대 · 표시 지연 · 그래프 없음.
- 눌림 축소: 세로 2px 거리로 정의, basis = max(높이, 폭÷4, 24), 배율 = (basis−2)/basis. 넓은 요소에 고정 배율을 쓰면 가로 이동이 커져서 쓰지 않는다. 색이 이미 상태를 나타내는 Switch · 탭은 축소만. s95/97/98 토큰은 지울 예정(yaml 주석).
- 동작 줄이기: 줄이면 축소 배율 1, 색 전환은 남겨 눌림을 알림. 2초 넘는 애니메이션은 되도록 쓰지 않음(포괄적 디자인 문서). 대화상자 · 시트 들어옴이 줄이기에서 꺼지는지는 미확인.

### 토스 TDS

출처: https://tossmini-docs.toss.im/tds-mobile/ · …/tds-react-native/ 아래 114쪽, https://developers-apps-in-toss.toss.im/ 246쪽, https://toss.tech/article/interaction · https://toss.tech/article/toss-design-system, npm `@toss/tds-easings@0.0.1` · `@toss/tds-mobile@2.5.1`.

- 공개 문서에 모션 기초값 없음(Foundation 은 Colors · Typography). 값은 공개 npm 꾸러미 소스에서만 나온다. 용도 설명 없음.
- 곡선: linear · ease (0.6, 0, 0, 0.6) · out (0.25, 0.1, 0.25, 1) · expo (0.16, 1, 0.3, 1) · back (0.34, 1.56, 0.64, 1). ease 값은 이름과 어긋나 보이지만 소스 그대로 옮김.
- 스프링 프리셋(stiffness / damping): rapid 1000/55 · quick 800/55 · medium 270/25 · small 480/50 · basic 200/30 · bounce 300/15 · large 100/15 · slow 70/20. 프리셋 시간(rapid 약 0.2초 · quick 약 0.35초 등)은 원자료 세션이 꾸러미 계산식을 옮겨 계산한 값이라 꾸러미에 적힌 숫자가 아니다.
- toss.tech: easing 은 bezier 와 spring 두 종류, 「bezier.expo, spring.quick 처럼」 이름 붙인 토큰. 숫자는 글 안 이미지에만 있다.
- 문서 자리: 토스트 표시 3000ms(버튼 있으면 5000ms) · 바텀시트 슬라이드 업 켜고 끄기 · 툴팁 · 체크박스 `motionVariant` weak/strong · 로더 `delay`(RN, 예시 700ms, 깜빡임 막기).
- 번들에서 본 값(압축 코드라 컴포넌트 귀속은 짐작): 대화상자 opacity 0 · scale 0.8 에서 quick, 닫힘 rapid · 터치 축소 scale 0.96(rapid), 놓으면 1(quick).
- 동작 줄이기: 웹 문서 지침 없음. RN ListRow `preferReducedMotion` 하나.

### GitHub Primer

출처: primer/primitives @ 47736486 `src/tokens/base/motion/timing.json5` · `easing.json5` · `functional/motion/motion.json5`, https://primer.style/accessibility/design-guidance/motion-and-animation, https://primer.style/product/ui-patterns/loading, primer/react @ 24ce6b2.

- 역할 시간: micro 100(hover · 포커스 링 · 색) · short 200(펼침 · 토글) · medium 300(모달 · 드롭다운 들어오고 나감) · long 500ms(큰 레이아웃 이동, 드물게). 「MUST keep UI interactions ≤300ms.」 「NEVER exceed 500ms for UI interactions.」
- 곡선: ease (0.25, 0.1, 0.25, 1) = hover · easeOut (0.3, 0.8, 0.6, 1) = enter, 「RECOMMENDED default.」 · easeIn (0.7, 0.1, 0.75, 0.9) = exit · easeInOut (0.6, 0, 0.2, 1) = move · linear.
- 전환 묶음: hover 100ms ease · stateChange 200ms easeInOut · enter 300ms easeOut · exit 200ms easeIn(「Shorter than enter to feel snappy.」).
- 구현은 토큰과 다르다: 버튼 색 80ms (0.65, 0, 0.35, 1) · 오버레이 · 대화상자 200ms (0.33, 1, 0.68, 1), 대화상자 본체 scale 0.5 에서 · 시트 250ms · 툴팁 0.1s, 열림 지연 50/400/1200ms · 탭(UnderlineNav) 표시 움직임 없음 · 스켈레톤 · 스피너 1000ms. 토스트 부품 없음.
- 표시 지연(loading 문서): 1초 미만은 로딩 표시를 보이지 않음, 1–3초 불확정, 3–10초 가능하면 확정, 10초 넘으면 확정 + 배경 작업. Spinner `delay` short 300 · long 1000ms.
- 동작 줄이기: CSS 는 `prefers-reduced-motion: no-preference` 안에만 움직임을 둠, 5초 넘는 애니메이션은 멈추거나 제어 제공, 1초에 3번 넘게 번쩍이지 않음. 로딩 표시는 줄이기 사용자에게도 끄지 않고 은은하게.

### Atlassian

출처: https://atlassian.design/foundations/motion · …/foundations/motion/applying-motion · …/components/motion/about, npm `@atlaskit/tokens` 20.14.0 `artifacts/themes/atlassian-motion.js`, `@atlaskit/motion` 10.0.2.

- 상태: 「Motion in Early Access」, 색과 따로 켜는 `motion` 테마(라이트 · 다크에 같은 값).
- 시간: instant 0 · xxshort 50(목록 hover) · xshort 100(은은한 눌림 · 팝업 나감) · short 150(hover · 눌림 · 팝업 들어옴) · medium 200(모달 · 플래그 나감) · long 250(모달 · 플래그 들어옴) · xlong 400(페이지 전환 · 패널) · xxlong 600ms(온보딩 · 전체 화면 오버레이). 범위: 상호작용 50–150ms, 전환 150–400ms.
- 곡선: out.bold (0, 0.4, 0, 1) · inout.bold (0.4, 0, 0, 1) · in.practical (0.6, 0, 0.8, 0.6) · out.practical (0.4, 1, 0.6, 1) · out.expo (0.16, 1, 0.3, 1) · out.quart (0.25, 1, 0.5, 1) · spring(linear() 꼴, experimental, 아바타 hover 같은 작은 요소).
- 의미 토큰: 버튼 hover · 눌림 150ms out.practical · 목록 hover 50ms · 팝업 들어옴 8px + 페이드 150ms, 나감 4px 100ms · 모달 scale 95 → 100% 250ms inout.bold, 나감 200ms in.practical · 플래그 들어옴 250ms out.bold, 나감 200ms · 패널 200ms out.expo · 탭 표시 8px + 페이드 150ms. 문서 표의 Dropdown 곡선(out.bold)과 토큰 `popup.enter`(out.practical)가 다르다.
- 원칙: 큰 요소는 길게, 하루 수십 번 쓰는 경험은 150ms 아래로, 「Make exit motion faster than entrances」(들어옴보다 50 또는 100ms 짧게), transform · opacity 위주.
- 동작 줄이기: 지금은 켜지면 모션을 끄고 즉시 바꿈. 번쩍임 · 큰 면을 쓸고 가는 움직임 금지.

### Ant Design

출처: ant-design master ee8db77 `components/theme/themes/seed.ts` · `shared/genCommonMapToken.ts` · 컴포넌트 스타일, https://ant.design/docs/spec/motion, ant-motion `language/speed.md`.

- 시간: motionDurationFast 100 · Mid 200 · Slow 300ms(motionUnit 0.1초 × 1 · 2 · 3). 작은 · 중간 · 큰 요소(패널).
- 곡선: EaseOutCirc (0.08, 0.82, 0.17, 1) · EaseInOutCirc (0.78, 0.14, 0.15, 0.86) · EaseOut (0.215, 0.61, 0.355, 1) · EaseInOut (0.645, 0.045, 0.355, 1) · EaseOutBack (0.12, 0.4, 0.29, 1.46) · EaseInBack (0.71, −0.46, 0.88, 0.6) · EaseInQuint (0.755, 0.05, 0.855, 0.06) · EaseOutQuint (0.23, 1, 0.32, 1). 역할 이름 · 용도 설명 없음.
- 자리(소스): 버튼 색 200ms EaseInOut · 누름은 물결(box-shadow 퍼짐), 축소 없음 · 드롭다운 200ms scaleY 0.8 에서 · 팝오버 200ms scale 0.8 에서 · 툴팁 100ms · 모달 300ms scale 0.2 에서, 마스크 200ms · 메시지 100ms, 표시 3초 · 알림 200ms, 4.5초 · 드로어 300ms · 탭 ink bar 300ms · 펼침 200ms · 스켈레톤 1.4s · Spin `delay`(ms) 「prevent flush」.
- 원칙: 사라지는 애니메이션은 더 빠르게, 목록 항목 사이 지연 없이 한꺼번에.
- 동작 줄이기: 디자인 문서 언급 없음. 코드는 줄이기에서 transition · animation 끔, 전역 `motion: false` 면 시간 0.

### Shopify Polaris

출처: polaris.shopify.com 모션 쪽은 https://shopify.dev/docs/api/polaris 로 넘어감. 보관 리포 Shopify/polaris-react-archive(3f7954ae42) `polaris-tokens/src/themes/base/motion.ts` · `polaris.shopify.com/content/design/motion/*.mdx`, npm `@shopify/polaris-tokens` 9.4.2.

- 시간: 0 · 50 · 100 · 150 · 200 · 250 · 300 · 350 · 400 · 450 · 500 · 5000ms. 용도 설명 없음.
- 곡선: ease (0.25, 0.1, 0.25, 1) 「A great default for any user interaction.」 · ease-in (0.42, 0, 1, 1) 아껴 씀 · ease-out (0.19, 0.91, 0.38, 1) 아껴 씀 · ease-in-out (0.42, 0, 0.58, 1) 시스템이 일으킨 전환 기본 · linear 스피너.
- 자리(구현): 버튼 누름은 전환 없이 inset 그림자 · 팝오버 100ms −5px 에서 · 툴팁 50ms(지연 100ms) · 모달 200ms 200px 아래에서 · 토스트 들어옴 400ms ease-out, 나감 200ms ease-in, 표시 5000ms(버튼 있으면 10000ms) · 시트 300ms · 펼침 150ms · 스켈레톤 정지 · 스피너 500ms. 탭 표시 움직임 없음.
- 원칙: Purposeful · Responsive(「The scale of the motion should match the scale of the action performed.」) · Snappy, 화면 전체를 한꺼번에 움직이지 않기.
- 동작 줄이기: 문서 지침 없음. 구현은 툴팁만 끔.

## 여러 곳에 걸친 것

자리별 값은 공유 메모 DS.md 표에 있다. 여기에는 문서(지침 · 토큰 설명)가 말한 것만 센다. 구현값만 있는 곳은 세지 않는다.

| 지침                                          | 말한 곳                                                                                  | 수                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------- |
| 나감이 들어옴보다 짧다                        | Material 3 · Primer · Atlassian · Ant Design                                             | 4 (근거 약함)          |
| 크거나 멀리 가는 것은 길게                    | Material 3 · Carbon · Fluent 2 · Atlassian · Ant Design · Polaris · SEED(매크로 > 0.2초) | 7                      |
| 자주 일어나는 상호작용은 짧게 · 움직임 줄이기 | Apple · Atlassian · Carbon(점검표)                                                       | 3 (근거 약함)          |
| 줄이기 설정에서 끄거나 페이드로 바꾸기        | Material 3 · Apple · Carbon · Fluent 2 · Spectrum 2 · SEED · Primer · Atlassian          | 8                      |
| 로딩 표시를 늦게 보이기                       | Material 3(200ms) · Primer(1초) · Carbon(3초) · Ant Design(prop) · TDS(prop)             | 5, 기준 값은 서로 다름 |
| 튐 · 넘침 곡선 금지 또는 아껴 씀              | Carbon · Material 3(흔한 전환)                                                           | 2 (근거 약함)          |
| 다크 모드와 모션                              | 없음                                                                                     | 0                      |

## 대조한 값

원자료 세션이 낸 숫자 중 아래를 원본 파일을 다시 받아 맞는 것을 확인했다(2026-11-19).

- Carbon `motion.tokens.json` 시간 6개 · 곡선 6개.
- Fluent `curves.ts` 9개, `DialogSurfaceMotion.ts`(0.85 · gentle · decelerateMid · accelerateMin).
- Primer `motion.json5` 역할 시간 참조 · 규칙 문장.
- Atlassian `atlassian-motion.js` 시간 8개 · 곡선 7개 · 모달 들어옴 · 나감.
- Material `_md-sys-motion.scss` short1 · medium1 · long1 · 곡선 4개 · `$easing-emphasized: $easing-standard`.
- Ant Design `seed.ts` 곡선 8개 · motionUnit.
- SEED `dialog.yaml`(enterScale 1.3 · d4 · d2) · `snackbar.yaml`.
- TDS `@toss/tds-easings` bezier 이름 · 스프링 이름 순서.
- Polaris 9.4.2 CSS 곡선 4개 · 시간 3개.
- 대조하지 않은 것: Apple 개발자 문서 기본값, Spectrum 2 구현값, 각 시스템 컴포넌트 구현값 대부분(원자료 파일의 줄 번호만 있음).
