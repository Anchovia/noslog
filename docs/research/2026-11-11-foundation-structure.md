# 파운데이션 구성 조사 — 토큰 층 · 파일 나누기 · 공용 클래스 (2026-11-11)

토큰(`tokens.css`)과 공용 스타일(`foundation-*.css`)을 정리하기 전에 잰 것이다. 앞 절은 NosLog 지금 상태, 뒤 절은 공개 디자인 시스템과 실제 서비스의 구성이다. 추천은 적지 않고 잰 값만 둔다.

## 방법

- NosLog 지금 상태: 커밋 a679a55c 의 작업 폴더를 스크립트로 훑었다. CSS 는 postcss 로 규칙을 풀고, 쓰는 곳은 추적 파일 가운데 `.css` · `.ts` · `.tsx` · `.mjs` 전체(스토리 · 테스트 포함)에서 낱말 단위로 찾았다. 문자열 조합으로 만드는 이름(`--nl-type-size-${step}` · `nl-level--${difficulty}` 같은 33곳)은 조합하는 코드를 열어 실제 값을 확인했다.
- 「참조 0」 은 선언 말고는 어디에도 이름이 나오지 않는다는 뜻이다. 주석 · 문서(md)는 쓰는 곳으로 세지 않았다.
- 디자인 시스템: 공식 문서와 GitHub 저장소의 파일 트리 · 파일 내용을 직접 열었다.
- 실제 서비스: 갈래 A 는 headless Playwright(다크 · 1440×900)로 공개 쪽의 스타일시트를 받아 쟀고, 갈래 B 는 소스가 공개된 서비스의 스타일 폴더를 열었다. 원자료는 `~/noslog-research/2026-11-11-foundation-structure/` 에 있다.

## NosLog 지금 상태

### 크기

| 대상                                     | 값                                                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `app/styles/tokens.css`                  | 557줄. 토큰 선언 1–355행 · 479–557행, 글자 클래스 규칙 18개 356–507행                                                            |
| 토큰 이름(`--nl-*`)                      | 256개. `tokens.css` 안 216개, 밖(공용 5파일 · 화면 21파일)에서만 선언하는 부품 · 화면 범위 변수 40개                             |
| 다른 토큰만 가리키는 토큰(`var()` 한 개) | 56개(`tokens.css` 안 23개)                                                                                                       |
| `foundation-*.css`                       | 10파일 3,492줄                                                                                                                   |
| 화면 · 기능 CSS                          | 29파일 11,894줄(`tailwind-theme.css` 79줄 · 글꼴 파일 제외)                                                                      |
| 클래스 이름                              | 전체 1,213개. 공용 파일(`foundation-*` · `tokens.css`)에 있는 것 228개                                                           |
| `@layer`                                 | 2곳(`globals.css:62` base · `tokens.css:394` components). 나머지 규칙은 모두 레이어 밖이고 `globals.css` 의 import 순서로 정한다 |

### 안 쓰는 것

| 항목                           | 위치                      | 근거                                                                                         |
| ------------------------------ | ------------------------- | -------------------------------------------------------------------------------------------- |
| `--nl-interaction-hover`       | `tokens.css:117` · `:292` | 참조 0. 가이드 색 표는 「관리자 수치 칸 올림에만 남아 있다」 고 적지만 `admin.css` 에도 없다 |
| `--nl-type-line-height-detail` | `tokens.css:264` · `:275` | CSS · TSX 참조 0. `tests/design-token-values.test.ts:66` 의 이름 목록에만 있다               |
| `--nl-type-size-25`            | `tokens.css:29`           | 참조 0. 조합 코드(`tier-export-image.ts`)는 12 · 14 · 20 만 부른다                           |
| `--nl-type-size-28`            | `tokens.css:30`           | 참조 0                                                                                       |
| `--nl-type-size-36`            | `tokens.css:32`           | 참조 0                                                                                       |
| `--nl-type-line-height-36`     | `tokens.css:44`           | 참조 0. 조합 코드는 16 · 20 · 28 만 부른다                                                   |
| `--nl-type-line-height-38`     | `tokens.css:45`           | 참조 0                                                                                       |
| `--nl-type-line-height-42`     | `tokens.css:47`           | 참조 0                                                                                       |

- 처음 훑을 때 참조 0 으로 나왔지만 조합 코드가 쓰는 것: `--nl-difficulty-normal` · `-real`(`discovery-filters.tsx:386`), `--nl-type-weight-heading`(`tier-export-image.ts` 의 `weight("heading")`).
- 공용 클래스 228개 가운데 참조 0 은 없다. 변형 클래스(`nl-button--ghost` · `nl-status--quiet` · `nl-dialog--large` · `nl-avatar--profile` 등)는 부품이 prop 값으로 조합하고, 그 값을 넘기는 곳이 모두 있다.
- Tailwind 별칭(`tailwind-theme.css`) 72개 가운데 유틸리티로 쓰는 곳이 0 인 것 18개: 색 `nl-control-hover` · `nl-input-surface` · `nl-strong` · `nl-tertiary` · `nl-row` · `nl-input-hover` · `nl-focus` · `nl-destructive` · `nl-on-destructive`, 간격 `nl-0` · `nl-2` · `nl-section`, 글꼴 `nl-sans`, 층 `nl-above` · `nl-bottom-bar` · `nl-fullscreen-dialog`, 그림자 `nl-card`, 곡선 `nl-exit`. 가이드는 카드 그림자를 `shadow-nl-card` 로 쓰라고 적지만 쓰는 곳은 0 이다(CSS 가 `var(--nl-card-shadow)` 를 직접 읽는다). Tailwind 는 쓰지 않는 별칭의 CSS 를 만들지 않는다.

### 겹치는 것

| 항목                              | 위치                                                                                   | 근거                                                                                                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nl-body` 와 `nl-body-secondary`  | `tokens.css:407` · `:422`                                                              | 선언 5개가 같다. 쓰는 파일 24 · 121                                                                                                                                  |
| 순위 지역 토큰 4개                | `global-rankings.css:5–8` · `ranking.css:112–115`                                      | `--nl-rank-1` · `-2` · `-3` · `--nl-ranking-inset` 을 같은 값으로 두 번 선언                                                                                         |
| 넓힌 면 `::before`                | `sync.css:124–152` · `admin.css:248–290` · `:424–466` · `:523–560` · `profile.css:443` | 동기화 줄은 `nl-bleed-row` 와 선언이 같고 포커스 선 규칙만 없다. 관리자 3곳은 좌우 값 · 모서리 · 위아래 끝이 다르다                                                  |
| 세로 쌓기(flex 세로 + gap + 폭 0) | 간격 4 · 8 · 12 · 16 · 24 · 구역 간격 순서로 9 · 8 · 10 · 13 · 4 · 11곳                | 선언 4개가 같은 규칙 55곳. 그 가운데 공용 클래스는 `nl-stack`(쓰는 파일 8) · `nl-field` · `nl-radio-group` · `nl-area` 넷이다                                        |
| 가로 줄(flex + 가운데 + gap 8)    | 9곳                                                                                    | 공용 `nl-inline`(쓰는 파일 2)과 같은 선언                                                                                                                            |
| 말줄임(한 줄 · 넘치면 …)          | 9곳                                                                                    | 선언 4개가 같다. 공용 클래스 없음                                                                                                                                    |
| 같은 값 색 토큰                   | `tokens.css`                                                                           | 14묶음 42개. `#3278be` 5개(차트) · `#444444` 4개 · `#dbdbdb` 4개 · `#fff` 6개 · `#111111` 3개 · `#323232` 3개 · 가림막 검정 60% 3개(표기가 달라 묶음에는 2개로 셌다) |

- 선언이 4개 이상 같은 규칙 묶음은 모두 44개다. 위 표 밖의 묶음은 2–5곳짜리 줄 맞춤 · 목록 초기화다.
- 화면 CSS 가 공용 클래스를 선택자에 넣은 규칙은 56개다. `search.css` 28개와 `global-rankings.css` 11개는 그 파일이 부품 본체를 들고 있어서이고(아래 「구성」), 덮어쓰기는 `profile.css` 4 · `music-detail.css` 4 · `layout.css` 4 · `settings.css` 2 · `musecat.css` 1 · `privacy.css` 1 · `tiers.css` 1 이다.

### 구성

| 항목                                | 근거                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 토큰 파일에 규칙이 있다             | `tokens.css:356–507` 이 글자 클래스 13종 · 태그 글자 · 변형 2개다                                                                                                                                                                                                                                                                                       |
| 토큰 층                             | 기본값(색 단계) 층이 없다. 역할 토큰이 색 값을 직접 든다(주석에 Spectrum 2 단계 이름). 간격 · 글자 크기 · 줄 높이만 숫자 눈금 토큰이 있고 역할 토큰 13개가 그것을 가리킨다                                                                                                                                                                              |
| 부품 · 화면 범위 변수의 이름        | 40개가 전역 토큰과 같은 `--nl-` 접두사다(`--nl-dialog-width` · `--nl-range-accent` · `--nl-pattern-level-0` · `--nl-layout-max` 등). 이름만으로 전역인지 가릴 수 없다                                                                                                                                                                                   |
| 부품 하나가 여러 공용 파일에        | 규칙 2개 이상이 다른 파일에 있는 부품: `nl-image-share`(parts 23 · dialog 4 · motion 1), `nl-unit-input`(parts 8 · form 3), `nl-markdown-editor`(editor 12 · form 1), `nl-action-group`(data 7 · base 1), `nl-sort-menu`(filters.css 17 · navigation 3), `nl-selection-list`(filters.css 18 · form 15), `nl-select-option`(search.css 6 · navigation 2) |
| 공용 부품 CSS 가 `foundation-` 밖에 | `search.css`(SearchField · CompactSelect, 쓰는 곳 `components/ui`), `filters.css`(칩 · 정렬 메뉴 · 고르기 목록), `data-charts.css`(LineChart), `entity.css` · `player-identity.css` · `layout.css`                                                                                                                                                      |
| 공용 파일 안 한 기능 전용           | `foundation-data.css` 의 `nl-my-best` · `nl-grade-progress`(쓰는 곳 `features/music` 뿐), `foundation-motion.css` 의 `nl-arcade-result` · `nl-player-row` · `nl-achievement-card-popover` · `nl-destinations`, `foundation-forced-colors.css` 의 `nl-step-bar`(`components/admin`)                                                                      |
| 가로지르는 파일                     | `foundation-forced-colors.css` 규칙 26개(부품 13개), `foundation-motion.css` 규칙 14개(부품 13개). 동작 줄이기는 `tokens.css:536–549` 한 곳                                                                                                                                                                                                             |
| 옛 파일 이름 주석                   | `foundation.css` 가 13곳에 남았다(`globals.css` · `admin.css` · `announcements.css` · `filters.css` · `profile.css` · `search.css` · `tokens.css` 와 `components/ui` 6파일)                                                                                                                                                                             |
| `foundation-base.css:1` 주석        | 「Viewer/editor and administrative routes never enter this scope」 라고 적지만 `admin.css` 의 선택자 158곳이 `.noslog-ui` 아래다                                                                                                                                                                                                                        |
| 가이드와 다른 곳                    | `interaction/hover` 쓰는 곳(위), `shadow-nl-card`(위), 「화면 CSS 에 넓힌 면을 다시 쓰지 않는다」 와 동기화 · 관리자 · 프로필 규칙, 줄 높이 역할 토큰 목록에 `-detail` 없음                                                                                                                                                                             |
| 쓰는 방식 세 가지                   | 화면 블록 클래스(BEM, CSS 29파일), 공용 도우미 클래스(`nl-stack` 등), Tailwind `nl` 별칭 유틸(실행 코드 TSX 에 1,682번)이 함께 쓰인다                                                                                                                                                                                                                   |

## 디자인 시스템 28곳 · 방법론 문서 7개

확인한 사람: 조사 에이전트. Primer(`src/tokens` 의 base · functional · component 폴더) · Carbon(`packages/styles/scss/components` 91개) · Codex(`application.json` · `components.json` · `themes`) 세 곳은 저장소를 다시 열어 대조했다. 열지 못해 세지 않은 곳은 Vercel Geist · LINE · toss · Nathan Curtis 글(HTTP 403)이다.

확인 날짜 2026-11-11. 저장소 기본 브랜치의 파일 트리(`gh api …/git/trees`)와 파일 내용을 직접 열어 확인한 것만 적는다. 못 본 칸은 「미확인」.
칸 번호: 1 토큰 층 · 2 이름 규칙 · 3 토큰 파일 나누기 · 4 부품 CSS 파일 나누기 · 5 글자 스타일 자리 · 6 캐스케이드 순서 · 7 부품 범위 변수 · 8 forced-colors · reduced-motion 자리 · 9 폐기 토큰 관리 · 10 유틸리티 층 · 11 쓰는 서비스.

### 디자인 시스템

#### GitHub Primer (primitives · css · react)

- URL: https://github.com/primer/primitives · https://github.com/primer/css · https://github.com/primer/react · https://primer.style 확인 날짜 2026-11-11
- 1 토큰 층: 3층. `src/tokens/base/` · `src/tokens/functional/` · `src/tokens/component/`. `DESIGN_TOKENS_GUIDE.md` 의 Core Rule 은 「Only use semantic tokens」(기본값 직접 사용 금지). 부품 토큰의 Figma 그룹 이름은 `component (internal)`.
- 2 이름 규칙: 접두사 없음. 속성이 앞에 온다 `--{property}-{role}-{variant}`, 부품은 `--{component}-{variant}-{property}-{state}`. 예 `--bgColor-default` · `--fgColor-onEmphasis` · `--button-default-fgColor-rest` · `--control-medium-paddingInline-normal` · `--text-body-shorthand-medium`. 상태는 맨 끝(`rest` · `hover` · `disabled`), 크기는 낱말(`small` · `medium` · `large`).
- 3 토큰 파일: 층 → 종류 → 파일. `src/tokens/base/color/light/light.json5` · `src/tokens/functional/color/bgColor.json5` · `src/tokens/functional/size/radius.json5` · `src/tokens/component/button.json5`(부품마다 한 파일, 28개). 배포 CSS 도 같은 꼴 `dist/css/functional/themes/light.css` · `dist/css/base/size/size.css` · `dist/css/functional/spacing/space.css`.
- 4 부품 CSS: primer/react 는 부품 코드 옆 CSS Modules(`packages/react/src/Button/ButtonBase.module.css`, `.module.css` 209개). primer/css(옛 Sass)는 묶음 폴더 `src/buttons/{button,button-group,misc}.scss` · `src/forms/` · `src/navigation/` · `src/layout/`.
- 5 글자 스타일: 토큰에 둔다. `src/tokens/functional/typography/typography.json5` 에 `$type: 'typography'` 조합 토큰 → CSS `font` 줄임값 `--text-body-shorthand-medium`. primer/css 는 유틸리티 클래스(`src/utilities/typography.scss` 의 `.h1`…)도 둔다.
- 6 캐스케이드: primer/css 는 import 순서만(`src/index.scss`: color-modes → primitives → core → product → marketing, core 안에서 「Utilities always go last so that they can override components」). primer/react 는 `:where()` 로 특이성을 0,1,0 에 맞추고, `@layer primer.base, primer.theme, primer.icons, primer.components, primer.utilities` 는 ADR-021 · 022 단계(승인 · 도입 모두 진행 중 표시, 코드에서는 실험 부품 1파일만 사용).
- 7 부품 범위 값: 전역 토큰 패키지의 부품 층(`src/tokens/component/button.json5` → `--button-default-bgColor-rest`). 부품 CSS 파일 안에서 따로 선언하는 변수는 적다.
- 8 접근성 · 움직임: 각 부품 파일 안. `@media (forced-colors: active)` 가 `Button/ButtonBase.module.css` · `Radio/Radio.module.css` · `Checkbox/Checkbox.module.css` 등 14파일, `prefers-reduced-motion` 은 `Dialog/Dialog.module.css` 등 부품 파일. 모아 둔 파일 없음. 고대비는 따로 테마 파일(`light-high-contrast.css`).
- 9 폐기: 토큰에 `$deprecated: '{대체 토큰}'` 필드(`src/tokens/component/focus.json5`), 지운 토큰 목록 `src/tokens/removed.json`, stylelint `@primer/stylelint-config`(primer/react · primer/css 의 `package.json`). 삭제 주기는 미확인.
- 10 유틸리티: primer/css 에 있음(`src/utilities/{margin,padding,flexbox,typography,colors,…}.scss`, 마지막에 import, `!important`). primer/react 에는 없음.
- 11 쓰는 서비스: GitHub(저장소 소유자 · 문서 primer.style).

#### Shopify Polaris (polaris-tokens · polaris-react)

- URL: https://github.com/Shopify/polaris · https://polaris-react.shopify.com 확인 날짜 2026-11-11 (README: React 라이브러리는 deprecated, 새 Polaris 는 shopify.dev 의 웹 컴포넌트 — 그쪽 소스는 미확인)
- 1 토큰 층: CSS 변수로는 역할 1층만 나온다. 팔레트(`polaris-tokens/src/colors.ts` 의 `gray[15]` 등)는 TS 안에서만 쓰이고(`'color-bg-fill-brand': {value: colors.gray[15]}`) CSS 변수로 내보내지 않음. 역할 색 파일 안에 「Specialty and component」 색(`color-radio-button-bg-surface-disabled`)이 같이 있음. 부품 층은 부품 CSS 의 `--pc-*`.
- 2 이름 규칙: 전역 `--p-`, 부품 안 `--pc-`. `--p-{종류}-{역할}-{변형}-{상태}`. 예 `--p-color-bg-fill-brand-hover` · `--p-space-050` · `--p-color-text-disabled`. 크기는 숫자 눈금(`050` · `100` · `400`), 글자는 `heading-3xl` · `body-md`. 부품 변수 상태는 밑줄 `--pc-button-bg_hover`.
- 3 토큰 파일: 종류별 TS 파일 + 테마별 파일. `polaris-tokens/src/themes/base/{color,space,font,text,motion,shadow,border,breakpoints,height,width,zIndex}.ts`, 테마 `themes/{light,dark,light-high-contrast,light-mobile}.ts`. 배포 CSS 는 한 파일 `@shopify/polaris-tokens/dist/css/styles.css`.
- 4 부품 CSS: 부품 코드 옆 CSS Modules `polaris-react/src/components/Button/Button.module.css`. 전역 리셋은 `polaris-react/src/components/AppProvider/global.css` 한 파일. 공용 믹스인은 가운데 폴더 `polaris-react/postcss-mixins/*.css|js`.
- 5 글자 스타일: 토큰 파일에 조합별 낱값(`themes/base/text.ts` 의 `text-heading-3xl-font-family` · `-font-size` · `-font-weight` · `-font-line-height`), 적용은 `Text` 부품(`components/Text/Text.module.css`). 글자 클래스 없음.
- 6 캐스케이드: `@layer` 0건(코드 검색). CSS Modules + import 순서.
- 7 부품 범위 값: 부품 파일에 둔다. `Button.module.css` 맨 위 `--pc-button-bg` · `--pc-button-bg_hover` · `--pc-button-color_disabled`.
- 8 접근성 · 움직임: 각 부품 파일. `-ms-high-contrast` / `forced-colors` 가 부품 CSS 24파일, `prefers-reduced-motion` 은 `Tooltip/components/TooltipOverlay/TooltipOverlay.module.css` · `Scrollable.tsx`. 모아 둔 파일 없음.
- 9 폐기: `stylelint-polaris` 패키지(문서 `polaris.shopify.com/content/tools/stylelint-polaris/rules/*-custom-property-disallowed-list.mdx` · `legacy-*`), `polaris-migrator` 코드모드(부품 CSS 주석 「generated by polaris-migrator」). 삭제 주기 미확인.
- 10 유틸리티: 클래스 없음. 레이아웃 부품(`Box` · `InlineStack` · `BlockStack`)과 postcss 믹스인으로 대신함.
- 11 쓰는 서비스: Shopify admin(README).

#### IBM Carbon

- URL: https://github.com/carbon-design-system/carbon (`packages/styles` · `colors` · `themes` · `type` · `layout` · `motion`) · https://carbondesignsystem.com 확인 날짜 2026-11-11
- 1 토큰 층: 3층. 기본값 `@carbon/colors`(`$blue-60`) · `@carbon/layout`(`$spacing-05`) · `@carbon/motion`, 역할 `@carbon/themes`(`$background` · `$layer-01` · `$text-primary`, 테마 white · g10 · g90 · g100), 부품 `packages/styles/scss/components/button/_tokens.scss`(`$button-primary`). 기본값 패키지도 npm 으로 공개돼 직접 import 할 수 있음.
- 2 이름 규칙: CSS 변수 접두사 `--cds-`, 클래스 `.cds--`(BEM: `.cds--btn--primary`). 역할 먼저 + 두 자리 번호. 예 `--cds-layer-01` · `--cds-text-primary` · `--cds-button-primary-hover` · `$spacing-05`. 상태는 끝(`-hover` · `-active` · `-selected`), 크기 · 단계는 번호(`01`–`13`).
- 3 토큰 파일: 종류별 패키지(`packages/colors` · `layout` · `type` · `motion` · `themes`) + styles 패키지의 종류별 진입 파일 `packages/styles/scss/{_colors,_spacing,_motion,_theme,_themes,_breakpoint,_layer,_zone}.scss`.
- 4 부품 CSS: 가운데 폴더, 부품마다 폴더. `packages/styles/scss/components/button/{_index,_button,_mixins,_tokens,_vars,_radius}.scss`. React 코드(`packages/react`)와 다른 패키지.
- 5 글자 스타일: 토큰 파일과 따로, 전용 패키지 + 믹스인. `packages/type/src/styles.ts`(`bodyShort01` · `heading01` 조합 객체) · `packages/type/scss/_styles.scss` · `packages/styles/scss/type/_index.scss` 의 `type-style()` 믹스인을 부품 Sass 가 부른다.
- 6 캐스케이드: CSS `@layer` 0건(코드 검색). Sass `@use` 순서. (`_layer.scss` 는 캐스케이드 층이 아니라 면 겹침 단계 `.cds--layer-one`.)
- 7 부품 범위 값: 부품 폴더에 둔다(`components/button/_tokens.scss` · `_vars.scss`). 전역 테마 파일과 분리.
- 8 접근성 · 움직임: 믹스인은 한 파일(`packages/styles/scss/utilities/_high-contrast-mode.scss` 의 `@mixin high-contrast-mode` = `-ms-high-contrast` + `forced-colors`), 부르는 곳은 각 부품 파일(44파일). `prefers-reduced-motion` 도 각 부품 파일(`components/accordion/_accordion.scss` · `dialog/_dialog.scss`…)이고 `config/stylelint-config-carbon/plugins/a11y.js` 가 검사.
- 9 폐기: 소스 주석 표시(`packages/themes/src/v10/g10.ts` 의 「Deprecated ☠️」, `index.ts` 「Layout (deprecated)」), 옛 판 토큰은 `packages/themes/src/v10/` · `packages/styles/scss/compat/` 로 따로 유지. 삭제 주기 미확인.
- 10 유틸리티: 클래스 층은 없고 믹스인 폴더 `packages/styles/scss/utilities/{_visually-hidden,_focus-outline,_text-truncate,_z-index,…}.scss`.
- 11 쓰는 서비스: IBM 제품(공식 문서의 「IBM's open source design system for products and digital experiences」).

#### Material 3 (material-web)

- URL: https://github.com/material-components/material-web · https://m3.material.io 확인 날짜 2026-11-11 (README: 유지보수 모드)
- 1 토큰 층: 3층. `md.ref`(기본값: `tokens/_md-ref-palette.scss` · `_md-ref-typeface.scss`) · `md.sys`(역할: `_md-sys-color.scss` · `_md-sys-typescale.scss` · `_md-sys-shape.scss` · `_md-sys-motion.scss` · `_md-sys-elevation.scss` · `_md-sys-state.scss`) · `md.comp`(부품: `tokens/_md-comp-filled-button.scss`). 테마를 바꿀 때 여는 것은 `--md-sys-*` 와 `--md-ref-typeface-*`, 부품 변수.
- 2 이름 규칙: 접두사 `--md-` + 층(`ref` · `sys`) + 종류. 예 `--md-sys-color-primary` · `--md-sys-typescale-body-medium-size` · `--md-filled-button-container-color`(부품 변수는 `comp` 없이 부품 이름). 부품 토큰은 상태가 앞 `hover-state-layer-color` · `disabled-container-opacity`, 크기는 `small` · `medium` · `large`.
- 3 토큰 파일: 층 + 종류 + 부품마다 파일, 한 폴더. `tokens/_md-sys-color.scss` · `tokens/_md-comp-checkbox.scss`, 판별 원본 `tokens/versions/latest/sass/…`.
- 4 부품 CSS: 부품 코드 옆(부품 폴더 안 `internal/`). `button/internal/{_shared,_filled-button,_elevation,_icon}.scss` + `button/filled-button.ts`.
- 5 글자 스타일: 토큰은 `tokens/_md-sys-typescale.scss`(낱값 `body-medium-font` · `-size` · `-line-height`), 클래스는 따로 `typography/md-typescale-styles.scss`(`typescale.styles()` 믹스인으로 `.md-typescale-*` 생성).
- 6 캐스케이드: 부품 shadow DOM 안에서 `@layer styles, hcm;`(`switch/internal/_switch.scss` · `field/internal/_label.scss` 등 45파일). 전역 층은 없음.
- 7 부품 범위 값: 부품마다 토큰 파일(`tokens/_md-comp-*.scss`) → 부품 CSS 안에서는 비공개 변수 `--_container-height` · `--_label-text-size` 로 받아 씀.
- 8 접근성 · 움직임: 각 부품 옆. `fab/internal/forced-colors-styles.scss` · `slider/internal/forced-colors-styles.scss` 처럼 부품 폴더 안 전용 파일 또는 `@layer hcm` 블록(scss 35파일). `prefers-reduced-motion` 은 `focus/internal/_focus-ring.scss` · `slider/internal/_slider.scss` 등 부품 파일.
- 9 폐기: 미확인(토큰 파일에 deprecated 표시 못 찾음. 판 폴더 `tokens/versions/v0_192/` 로 고정).
- 10 유틸리티: 없음(글자 클래스 `md-typescale-*` 만).
- 11 쓰는 서비스: 미확인(문서는 「Google's open-source design system」 이라고만).

#### Microsoft Fluent 2 (fluentui v9 · `@fluentui/tokens`)

- URL: https://github.com/microsoft/fluentui (`packages/tokens` · `packages/react-components`) · https://fluent2.microsoft.design 확인 날짜 2026-11-11
- 1 토큰 층: 2층. `packages/tokens/src/global/`(기본값: `colors.ts` · `spacings.ts` · `borderRadius.ts` · `durations.ts` · `curves.ts` · `fonts.ts`) · `packages/tokens/src/alias/`(역할: `lightColor.ts` · `darkColor.ts` · `highContrastColor.ts`). 부품 토큰 층은 저장소에서 못 찾음(부품 스타일 파일이 alias 토큰을 직접 씀). 내보내는 `tokens` 객체에는 alias 색 + global 크기 · 간격이 함께 들어 있음.
- 2 이름 규칙: 접두사 없음, camelCase. `{종류}{역할}{번호}{상태}`. 예 `--colorNeutralForeground1` · `--colorNeutralBackground1Hover` · `--spacingHorizontalM` · `--borderRadiusMedium`. 상태는 끝(`Hover` · `Pressed` · `Selected`), 크기는 낱말 · 글자 단계는 `Base300`.
- 3 토큰 파일: 층 폴더 → 종류별 파일, 테마 조립은 `packages/tokens/src/themes/web/{lightTheme,darkTheme}.ts` · `themes/teams/*`. CSS 변수 이름 목록은 한 파일 `packages/tokens/src/tokens.ts`.
- 4 부품 CSS: CSS 파일 없음(Griffel CSS-in-JS). 부품 코드 옆 `packages/react-components/react-button/library/src/components/Button/useButtonStyles.styles.ts`(부품마다 패키지 하나).
- 5 글자 스타일: 토큰 패키지 안 `packages/tokens/src/global/typographyStyles.ts`(`body1` · `body1Strong` · `title3` 조합 객체), 부품 스타일이 펼쳐 씀.
- 6 캐스케이드: CSS-in-JS 의 원자 클래스 삽입 순서. `@layer` 는 Button 스타일 파일에서 0건.
- 7 부품 범위 값: 부품 스타일 파일 안 상수(`useButtonStyles.styles.ts` 의 `buttonSpacingMedium`). 전역 토큰 파일에 두지 않음.
- 8 접근성 · 움직임: 각 부품 스타일 파일(`'@media (forced-colors: active)'` 가 `useButtonStyles.styles.ts` · `useCompoundButtonStyles.styles.ts` 등). 움직임은 `react-motion` 패키지의 `useIsReducedMotion.ts` 한 곳 + 부품별 미디어 쿼리. 고대비는 테마로도 있음(`alias/highContrastColor.ts`).
- 9 폐기: 미확인(tokens 패키지에서 deprecated 표시 못 찾음).
- 10 유틸리티: 없음.
- 11 쓰는 서비스: Microsoft 365 · Office · Edge(README 「Used By」 표).

#### Adobe Spectrum (spectrum-css · spectrum-design-data 의 tokens)

- URL: https://github.com/adobe/spectrum-css · https://github.com/adobe/spectrum-design-data (`packages/tokens/src`, 옛 이름 spectrum-tokens) · https://spectrum.adobe.com 확인 날짜 2026-11-11
- 1 토큰 층: 3층. 전역 팔레트(`color-palette.json`) · 별칭(`semantic-color-palette.json` · `color-aliases.json` · `layout.json` · `typography.json`) · 부품(`layout-component.json` 과 부품별 `button.json` · `checkbox.json`…). CSS 쪽은 부품 파일이 `--spectrum-button-*` 를 전역 토큰에 잇고, 바깥에서 덮는 값은 `--mod-button-*`.
- 2 이름 규칙: 접두사 `--spectrum-`, 덮어쓰기 `--mod-`, 고대비 `--highcontrast-`. `{맥락}-{속성}-{상태 또는 번호}`. 예 `--spectrum-accent-background-color-default` · `--spectrum-component-height-100` · `--spectrum-button-content-color-hover` · `--mod-button-content-color-default`. 상태는 끝(`default` · `hover` · `down` · `key-focus`), 크기는 번호(`75` · `100` · `200`), 클래스는 `.spectrum-Button--sizeM`.
- 3 토큰 파일: 원본은 종류 + 부품별 JSON(`packages/tokens/src/color-aliases.json` · `button.json`). spectrum-css 는 Style Dictionary(`tokens/style-dictionary.config.js`)로 CSS 를 만들고 손으로 더한 값은 `tokens/custom/{global,light,dark,medium,large}-vars.css`(색 모드 · 크기 배율별).
- 4 부품 CSS: 부품마다 패키지 + 파일 하나. `components/button/index.css`, 테마 차이는 `components/button/themes/{spectrum,spectrum-two,express}.css`. 부품 폴더 71개. 공용 조각은 `components/commons/{basebutton,overlay}.css`.
- 5 글자 스타일: 토큰은 `typography.json`(낱값), 클래스는 부품 `components/typography/index.css`(`.spectrum-Heading--sizeM` · `.spectrum-Body` · `.spectrum-Detail`).
- 6 캐스케이드: `@layer` 0건(`components` · `tokens`). 부품이 독립 패키지라 import 순서도 정해 두지 않고, 덮어쓰기는 `--mod-*` 변수로.
- 7 부품 범위 값: 부품 파일 맨 위(`components/button/index.css` 의 `--spectrum-button-sized-height` · `--spectrum-button-content-color-default`). 전역 토큰 파일과 분리.
- 8 접근성 · 움직임: 각 부품 파일. `@media (forced-colors: active)` 가 `components/*/index.css` 65파일(안에서 `--highcontrast-*` 변수 설정), `prefers-reduced-motion` 은 `components/coachindicator/index.css` 1파일. 모아 둔 파일 없음.
- 9 폐기: 토큰 JSON 에 `"deprecated": true` · `"deprecated_comment": "Replaced with …"` · `"renamed": "…"`(`color-aliases.json`), CSS 주석 `/* @deprecated … */`, stylelint 플러그인 `@spectrum-tools/stylelint-no-unused-custom-properties` · `no-unknown-custom-properties` · `no-missing-var`(`stylelint.config.js`). README: lightest · darkest 색 모드는 14.x 에서 폐기. 삭제 주기는 미확인.
- 10 유틸리티: 없음.
- 11 쓰는 서비스: Adobe 제품(spectrum.adobe.com, 서비스 이름 목록은 미확인).

#### Salesforce Lightning Design System (design-system 저장소 2.28.1 · 스타일링 훅)

- URL: https://github.com/salesforce-ux/design-system · https://www.lightningdesignsystem.com 확인 날짜 2026-11-11 (공개 저장소는 SLDS 1 계열 Sass. SLDS 2 전용 소스 저장소는 미확인)
- 1 토큰 층: 저장소 기준 기본값 `design-tokens/primitive/*.yml` + 묶음별 별칭(`design-tokens/extensions/ui-force/{background-color,border-color,…}.yml` · `design-tokens/themes/`) + 부품 토큰(`ui/components/buttons/tokens/{border-color,border-radius}.yml`) 3층. CSS 변수(스타일링 훅)는 전역 `--slds-g-*` 와 부품 `--slds-c-*`.
- 2 이름 규칙: 훅 `--slds-{g|c}-{부품}-{종류}-{속성}`. 예 `--slds-c-button-color-background` · `--slds-c-button-spacing-block-start` · `--slds-c-button-color-border`(옛 이름 `--sds-c-…` · `--slds-c-button-spacing-blockstart` 를 `var()` 대체값으로 겹쳐 둠). 클래스는 `.slds-button_brand`(BEM, 밑줄 변형), Sass 토큰 크기는 `$spacing-xx-small`.
- 3 토큰 파일: 층 폴더 → 종류별 YAML(`design-tokens/primitive/…yml` · `design-tokens/extensions/ui-force/background-color.yml`), 폼 팩터별 `design-tokens/form-factor-{small,medium,large}.yml`. 훅은 생성물 한 파일 `design-tokens/dist/slds-hooks.custom-props`.
- 4 부품 CSS: 가운데 폴더, 부품마다 폴더 → 변형마다 하위 폴더. `ui/components/buttons/{base,stateful,dual-stateful,kinetics,mixins}/_index.scss`(`ui/components` 아래 1,183파일).
- 5 글자 스타일: 유틸리티 클래스 층(`ui/utilities/text/` · `ui/utilities/heading/`)과 `ui/shared/_typography.scss`. 토큰 파일에는 낱값만(`design-tokens/force-font-commons.yml`).
- 6 캐스케이드: `@layer` 0건. import 순서(`ui/index.scss`: 훅 변수 → init → normalize → core → touch → components → kinetics → utilities → print).
- 7 부품 범위 값: 부품 폴더(`ui/components/buttons/tokens/*.yml`)와 부품 Sass 안 `var(--slds-c-button-…, 대체값)`. 전역 파일과 분리.
- 8 접근성 · 움직임: `prefers-reduced-motion` 은 움직임 전용 파일에 모음(`ui/dependencies/_kinetics.scss` · `ui/components/*/kinetics/_index.scss`). forced-colors / high-contrast 규칙은 `ui/` Sass 에서 못 찾음.
- 9 폐기: 부품마다 `_deprecate.scss` 파일 + `@include deprecate('4.0.0', 'Use spacing utilities instead')` 믹스인(지울 판 번호 · 대체 안내), 주석 `@deprecated`, 토큰 폴더 `design-tokens/extensions/ui-force/deprecated/`, 옛 훅 이름을 `var()` 대체값으로 유지. 검사 도구는 별도 저장소(salesforce-ux/slds-linter — 내용 미확인).
- 10 유틸리티: 있음. `ui/utilities/{alignment,borders,grid,margin,padding,sizing,text,truncate,visibility,…}/` 176파일, 마지막에 import.
- 11 쓰는 서비스: Salesforce Lightning(공식 문서 이름).

#### Wikimedia Codex

- URL: https://github.com/wikimedia/design-codex (`packages/codex-design-tokens` · `packages/codex`) · https://doc.wikimedia.org/codex 확인 날짜 2026-11-11
- 1 토큰 층: 3층. option(`src/themes/wikimedia-ui.json` — 「the complete universe of possible token values」) · decision(`src/application.json` — 「semantic」, 부품이 기대는 층) · component(`src/components.json` — 「should only reference tokens found in application.json」). 이름과 규칙은 `packages/codex-design-tokens/src/README.md`.
- 2 이름 규칙: 토큰에 접두사 없음, CSS 속성 이름이 앞에 온다. 예 `@color-progressive--hover` · `@color-neutral` · `--color-base`. 상태는 `--hover` · `--active`(이중 하이픈). 클래스 · 믹스인은 `cdx-` 접두사(`.cdx-button` · `.cdx-mixin-body-text()`).
- 3 토큰 파일: 층별 JSON 3개 + 모드별 덮어쓰기(`src/modes/{dark,small,large,x-large}.json`). 종류별로 나누지 않음.
- 4 부품 CSS: 부품 코드 안. Vue 단일 파일 부품의 `<style lang="less">`(`packages/codex/src/components/button/Button.vue`), 여러 부품이 함께 쓰는 것은 `packages/codex/src/themes/mixins/{button,binary-input,select,common}.less`.
- 5 글자 스타일: 믹스인 파일(`packages/codex/src/themes/mixins/public/typography.less` 의 `.cdx-mixin-body-text()` · `.cdx-mixin-caption()`). 토큰 파일에는 낱값.
- 6 캐스케이드: `@layer` 미사용(부품 Less 에서 못 찾음). 부품별 스타일 + Less `@import (reference)`.
- 7 부품 범위 값: 전역 토큰 패키지의 `components.json`. 부품 파일은 Less 변수(`@color-progressive`)를 그대로 씀.
- 8 접근성 · 움직임: `forced-colors` 0파일(`packages/codex/src`), `prefers-reduced-motion` 도 못 찾음.
- 9 폐기: 토큰 JSON 의 `"deprecated": "Use `color-subtle` instead. …"` 필드(대체 안내 포함, `application.json` 8곳 · `themes/wikimedia-ui.json` 37곳). 삭제 주기 미확인.
- 10 유틸리티: 클래스 없음. 공개 믹스인 `packages/codex/src/themes/mixins/public/{link,css-icon,typography,button-layout-flush}.less`.
- 11 쓰는 서비스: Wikipedia 등 Wikimedia 프로젝트(MediaWiki — 공식 문서).

#### GOV.UK Frontend

- URL: https://github.com/alphagov/govuk-frontend (`packages/govuk-frontend/src/govuk`) · https://design-system.service.gov.uk · https://frontend.design-system.service.gov.uk 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + 부품 설정. 팔레트(`settings/_colours-palette--internal.scss`, 파일 이름에 internal — `govuk-colour("green")` 함수로만 읽음) · 기능 색(`settings/_colours-functional.scss` 의 `brand` · `text` · `template-background` → CSS 변수는 `custom-properties/_functional-colours.scss`) · 부품 설정 변수(`components/button/_settings.scss` 의 `$govuk-button-background-colour`).
- 2 이름 규칙: 접두사 `govuk-`(Sass 변수 `$govuk-`, 클래스 `.govuk-`, 영국 철자 colour). 예 `$govuk-button-background-colour` · `$govuk-inverse-button-text-colour` · `govuk-functional-colour(text)` · 덮어쓰기 클래스 `.govuk-!-…`. BEM(`.govuk-button--secondary`).
- 3 토큰 파일: 종류별 설정 파일, 한 폴더. `settings/{_colours-palette--internal,_colours-functional,_colours-organisations,_spacing,_measurements,_media-queries,_typography-…,_links}.scss` + `custom-properties/{_functional-colours,_breakpoints}.scss`.
- 4 부품 CSS: 부품마다 폴더, 부품 코드(템플릿 · JS) 옆. `components/button/{_index.scss,_mixin.scss,_settings.scss,button.mjs,template.njk}`. 부품 밖 공용은 `core/` · `objects/`.
- 5 글자 스타일: 설정(글자 눈금 맵 `settings/_typography-*.scss`) + 믹스인(`helpers/_typography.scss` 의 `govuk-font`) + 클래스(`core/_typography.scss` 의 제목 · 본문 클래스, `overrides/_typography.scss`). 세 곳으로 나뉨.
- 6 캐스케이드: `@layer` 0건. ITCSS 식 폴더 순서를 `index.scss` 가 고정 — base(settings · tools · helpers) → core → objects → components → utilities → overrides.
- 7 부품 범위 값: 부품 폴더의 `_settings.scss`(Sass 변수, `!default`). 전역 설정 폴더와 분리.
- 8 접근성 · 움직임: `forced-colors` 는 각 부품 파일(8파일: `components/{accordion,checkboxes,footer,header,radios,skip-link,tag,warning-text}/_mixin.scss`). `prefers-reduced-motion` 은 Sass 소스에서 못 찾음.
- 9 폐기: SassDoc `/// @deprecated` + 컴파일 경고(`helpers/_typography.scss`: 「The `govuk-text-colour` mixin is deprecated. Use … instead.」, `helpers/_colour.scss`: 「we'll remove it in the next major version」), 경고 끄기 설정 `$govuk-suppressed-warnings`(`settings/_warnings--internal.scss`), 옛 색 `settings/_colours-legacy-functional.scss`. 삭제는 다음 메이저 판.
- 10 유틸리티: 2층으로 있음. `utilities/{_clearfix,_visually-hidden}.scss` 와 맨 끝 `overrides/{_display,_spacing,_text-align,_typography,_width}.scss`.
- 11 쓰는 서비스: GOV.UK(영국 정부 서비스 — 공식 문서).

#### USWDS (U.S. Web Design System)

- URL: https://github.com/uswds/uswds (`packages/`) · https://designsystem.digital.gov 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + 부품 설정. 시스템 토큰(`packages/uswds-core/src/styles/tokens/{color,font,units}/`, 색 38파일) · 테마 토큰(`settings/_settings-color.scss` 의 `$theme-color-primary-family: "blue"` · `$theme-color-base-ink: "gray-90"`) · 부품 설정(`settings/_settings-components.scss` 의 `$theme-button-font-family`). 문서가 시스템 토큰도 쓰게 열어 둠(`color("blue-60v")` 꼴 — 함수는 `functions/color/`).
- 2 이름 규칙: Sass 설정 `$theme-{종류}-{역할}-{단계}`, 값은 토큰 문자열. 예 `$theme-color-primary-family` · `$theme-color-base-ink` · `color("primary")` · 시스템 색 `"gray-90"`(계열-명도 등급). 클래스 `.usa-button--outline`(BEM), 유틸리티는 `.margin-top-2` 꼴.
- 3 토큰 파일: 종류별. 시스템 `tokens/color/*.scss` · `tokens/font/` · `tokens/units/`, 테마 설정 `settings/_settings-{color,spacing,typography,components,general,utilities}.scss`.
- 4 부품 CSS: 부품마다 패키지. `packages/usa-button/src/styles/{_index,_usa-button}.scss`(66개), 묶음 진입 파일 `packages/uswds/_index.scss` 가 `@forward` 로 나열.
- 5 글자 스타일: 믹스인(`packages/uswds-core/src/styles/mixins/typography/headings.scss` 의 `typeset-h1` · `typeset()`)과 따로 패키지 `packages/uswds-typography`. 토큰 폴더에는 낱값만.
- 6 캐스케이드: `@layer` 0건. `@forward` 순서(`uswds-global` → `uswds-helpers` → `uswds-typography` → 부품들 → 유틸리티).
- 7 부품 범위 값: 전역 설정의 부품 파일 한 곳(`settings/_settings-components.scss`) + 부품 Sass 안 지역 변수(`$button-stroke`).
- 8 접근성 · 움직임: `forced-colors` 는 각 부품 파일(19파일, 예 `usa-button/src/styles/_usa-button.scss`), 고대비 테두리 값은 `variables/border-high-contrast.scss`. `prefers-reduced-motion` 은 `usa-nav/src/styles/_usa-nav.scss` 와 `mixins/utilities/_transition.scss`.
- 9 폐기: 한 파일에 모음 `packages/uswds-core/src/styles/_deprecated.scss`(옛 변수를 새 기능에 이어 주는 자리라고 주석에 적음). 삭제 주기 미확인.
- 10 유틸리티: 있음. 패키지 `packages/uswds-utilities`(`rules/` 59파일) + 같은 이름 믹스인(`mixins/utilities/` 50파일), 설정 `_settings-utilities.scss`.
- 11 쓰는 서비스: 미국 연방 정부 사이트(공식 문서 — 사이트 이름 목록은 미확인).

#### Radix Themes

- URL: https://github.com/radix-ui/themes (`packages/radix-ui-themes/src`) · https://www.radix-ui.com/themes 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + 부품 변수. 색 눈금(`styles/tokens/colors/red.css` 등 31계열, `--red-9`) · 역할 별칭(`styles/tokens/color.css` 의 `--color-background` · `--color-panel-solid` · `--color-surface`, 테마가 고른 `--accent-9` · `--gray-1`). 눈금 변수도 문서에서 그대로 쓰게 열어 둠.
- 2 이름 규칙: 변수에 접두사 없음, 클래스는 `rt-`. `{종류}-{번호}`. 예 `--font-size-3` · `--space-5` · `--accent-a11` · `--color-panel-solid`. 크기는 번호(1–9), 상태는 변수 이름이 아니라 선택자(`:where([data-disabled])`), 클래스 `.rt-variant-ghost` · `.rt-r-size-2`.
- 3 토큰 파일: 종류별, 한 폴더. `styles/tokens/{base,color,typography,space,radius,shadow,scaling,cursor,layout}.css` + `styles/tokens/colors/<계열>.css`.
- 4 부품 CSS: 가운데 한 폴더에 부품마다 파일(부품 TSX 와 같은 폴더). `components/button.css` + `button.tsx`, 공용 뼈대 `components/_internal/base-button.css`(CSS 54파일). 묶음 진입 `components/index.css`.
- 5 글자 스타일: 토큰은 낱값(`styles/tokens/typography.css` 의 `--font-size-3` · `--line-height-3` · `--letter-spacing-3`), 조합은 부품 `components/text.css` · `heading.css`(`.rt-Text` + 크기 클래스).
- 6 캐스케이드: 소스에 `@layer` 0건. import 순서(`styles/index.css`: breakpoints → tokens → components → utilities)와 `:where()` 로 특이성을 낮춤. `components/index.css` 주석이 순서 이유를 적음(「Import Text before other components as it's commonly extended」).
- 7 부품 범위 값: 부품 파일 안(`_internal/base-button.css` 의 `--base-button-height` · `--base-button-classic-active-padding-top`).
- 8 접근성 · 움직임: `forced-colors` 0파일. `prefers-reduced-motion` 은 `components/animations.css`(키프레임 모음) · `_internal/base-dialog.css` · `tooltip.css`.
- 9 폐기: 미확인(스타일 소스에서 deprecated 표시 못 찾음).
- 10 유틸리티: 있음. `styles/utilities/{margin,padding,gap,display,width,…}.css` 52파일, 마지막에 import(레이아웃 props 가 쓰는 `rt-r-*` 클래스).
- 11 쓰는 서비스: 미확인.

#### shadcn/ui (v4 앱 · new-york-v4 레지스트리)

- URL: https://github.com/shadcn-ui/ui (`apps/v4`) · https://ui.shadcn.com 확인 날짜 2026-11-11
- 1 토큰 층: 역할 1층 + Tailwind 연결. `:root` / `.dark` 에 역할 변수(`--primary` · `--primary-foreground` · `--sidebar-primary`)를 두고 `@theme inline { --color-primary: var(--primary); }` 로 Tailwind 유틸리티에 잇는다. 기본값 층은 Tailwind 기본 팔레트(`--chart-1: var(--color-blue-300)` 처럼 직접 참조). 부품 토큰 층 없음.
- 2 이름 규칙: 접두사 없음. `--{역할}` + 짝 `-foreground`. 예 `--primary` · `--primary-foreground` · `--sidebar-primary` · `--radius` → `--radius-md: calc(var(--radius) * 0.8)`. 상태 이름 토큰 없음(상태는 Tailwind 변형 `hover:` · `disabled:`), 크기는 `sm` · `md` · `lg` · `xl`.
- 3 토큰 파일: 한 파일. `apps/v4/app/globals.css`(`@import "tailwindcss"` → `@custom-variant` → `@theme inline` → `:root` → `.dark` → `@layer base` → `@layer components`).
- 4 부품 CSS: 부품 CSS 파일 없음. Tailwind 클래스를 부품 TSX 안 `cva()` 에 적는다(`apps/v4/registry/new-york-v4/ui/button.tsx`). 새 스타일 묶음은 스타일마다 CSS 한 파일에 전 부품을 `@apply` 로(`apps/v4/registry/styles/style-vega.css` 의 `.cn-accordion-item`…).
- 5 글자 스타일: 토큰 · 클래스 없음. 부품 안 Tailwind 유틸리티(`text-sm font-medium`).
- 6 캐스케이드: Tailwind 의 `@layer base` · `@layer components`(globals.css 186 · 282 · 458행) + Tailwind 기본 층 순서.
- 7 부품 범위 값: 전역 파일에 둔다(`--sidebar-*` · `--chart-*` 가 `globals.css` 의 `:root`).
- 8 접근성 · 움직임: 미확인(전용 파일 없음. 부품 클래스에 `motion-reduce:` 변형을 쓰는지 세지 않음).
- 9 폐기: 미확인(`apps/v4/app/legacy-themes.css` 라는 옛 테마 파일이 따로 있음).
- 10 유틸리티: Tailwind 자체가 유틸리티 층.
- 11 쓰는 서비스: 미확인.

#### Open Props

- URL: https://github.com/argyleink/open-props (`src/`) · https://open-props.style 확인 날짜 2026-11-11
- 1 토큰 층: 기본값 1층(`--size-3` · `--indigo-7` · `--font-size-3`). 역할 층은 선택 사항인 `src/extra/theme.light.css` · `theme.dark.css`(`--link: var(--indigo-7)` · `--surface-3`) · `brand.css` 로 따로 줌. 기본값을 직접 쓰는 것이 기본 사용법.
- 2 이름 규칙: 접두사 없음(빌드 옵션으로 붙일 수 있는지는 미확인). `--{종류}-{번호}`. 예 `--size-3` · `--font-size-fluid-0` · `--indigo-7` · `--size-000`. 크기는 번호, 상태 없음.
- 3 토큰 파일: 종류별 파일, 한 폴더. `src/props.{sizes,fonts,colors,easing,animations,borders,shadows,gradients,aspects,media,…}.css` + 색 계열별 `src/props.indigo.css`, 묶음 `src/index.css`.
- 4 부품 CSS: 부품이 거의 없음. 선택 사항 `src/extra/{normalize,buttons,transitions,utilities}.css`(묶음 파일).
- 5 글자 스타일: 낱값만(`src/props.fonts.css`). 조합 없음.
- 6 캐스케이드: `@layer` 0건. `:where(html)` 로 특이성 0.
- 7 부품 범위 값: 부품 파일 안 비공개 변수(`src/extra/buttons.css` 의 `--_accent` · `--_text` · `--_size` · `--_bg-light`).
- 8 접근성 · 움직임: 미디어 쿼리 이름을 한 파일에 모음(`src/props.media.css`: `@custom-media --motionOK (prefers-reduced-motion: no-preference)` · `--motionNotOK`), 쓰는 곳은 각 파일(`@media (--motionOK)` — `extra/buttons.css` · `normalize.src.css` · `transitions.css`). forced-colors 0건.
- 9 폐기: 미확인.
- 10 유틸리티: 선택 사항 `src/extra/utilities.css`.
- 11 쓰는 서비스: 미확인.

#### Bootstrap (main = 6.0.0-alpha.1, 비교용 v5.3.8)

- URL: https://github.com/twbs/bootstrap (`scss/`) · https://getbootstrap.com 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + 부품 변수. Sass 팔레트(`scss/_colors.scss`) · 테마(`scss/_theme.scss` 의 `$theme-colors` · `$theme-bgs` · `$theme-fgs` → `scss/_root.scss` 가 `:root` 변수로) · 부품 변수(`--btn-*`). v5.3.8 은 `_variables.scss` · `_variables-dark.scss` · `_maps.scss` · `_root.scss`. 팔레트 변수도 `:root` 에 나와 직접 쓸 수 있음.
- 2 이름 규칙: v5 는 `--bs-` 접두사(`--bs-btn-padding-x`, Sass `--#{$prefix}btn-…`). main(v6 알파) 소스는 `--btn-padding-x` · `--btn-color: var(--fg-body)` · `--body-font-size` 로 접두사 없이 적혀 있음. `{부품}-{상태}-{속성}`(v5 `--bs-btn-hover-bg`), 크기는 `sm` · `lg`, 축은 `x` · `y`.
- 3 토큰 파일: v5 한 파일(`scss/_variables.scss`) + 다크(`_variables-dark.scss`). v6 알파는 `_config.scss` · `_colors.scss` · `_theme.scss` · `_root.scss` 로 나눔.
- 4 부품 CSS: 가운데 폴더에 부품마다 파일. `scss/_accordion.scss` · `scss/_card.scss` · `scss/_dialog.scss`, 일부는 묶음 폴더 `scss/forms/`(17파일) · `scss/buttons/{_button,_button-group,_close}.scss` · `scss/content/` · `scss/layout/`.
- 5 글자 스타일: v5 는 `scss/_type.scss`(제목 · `.display-*` · `.lead` 클래스)와 `_reboot.scss`. v6 알파는 `scss/content/{_reboot,_prose}.scss`. 토큰 파일에는 낱값.
- 6 캐스케이드: v6 알파가 `@layer` 도입 — `scss/_root.scss`: `@layer colors, config, root, reboot, layout, content, forms, components, custom, helpers, utilities;`(63파일이 층 안에 씀: components 31 · forms 12 · helpers 10 · content 5). v5.3.8 은 `@import` 순서만(functions → variables → variables-dark → maps → mixins → utilities → 부품들 → helpers → utilities/api).
- 7 부품 범위 값: 부품 파일에 둔다(`scss/buttons/_button.scss` 의 `--btn-gap` · `--btn-min-height` · `--btn-padding-x`, v5 `scss/_buttons.scss` 의 `--#{$prefix}btn-padding-x`).
- 8 접근성 · 움직임: `prefers-reduced-motion` 은 믹스인 한 곳(`scss/mixins/_transition.scss`) + 각 부품 파일(`_accordion` · `_carousel` · `_progress` · `_spinner` · `_transitions` · `content/_reboot`). `forced-colors` 0건.
- 9 폐기: `scss/mixins/_deprecate.scss` 믹스인 + 설정 `$enable-deprecation-messages: true`(`scss/_config.scss`). 삭제 주기 미확인.
- 10 유틸리티: 있음. `scss/_utilities.scss`(유틸리티 맵) + `scss/utilities/_api.scss`(생성기), 맨 끝 층 `utilities`. 그 앞에 `scss/helpers/`(11파일) 층이 따로 있음.
- 11 쓰는 서비스: 미확인.

#### Ant Design (6.7.0)

- URL: https://github.com/ant-design/ant-design (`components/theme` · `components/<부품>/style`) · https://ant.design 확인 날짜 2026-11-11
- 1 토큰 층: 4층. Seed(`components/theme/interface/seeds.ts` 의 `colorPrimary`) → Map(`interface/maps/{colors,font,size,style}.ts`, 알고리즘이 계산) → Alias(`interface/alias.ts` 의 `colorTextDisabled` · `colorTextHeading`) → Component(`components/button/style/token.ts` 의 `ComponentToken`). `useToken()` 이 모든 층을 준다.
- 2 이름 규칙: camelCase, `{종류}{역할}{변형}`. 예 `colorPrimary` · `colorTextDisabled` · `fontSizeHeading1` · `screenXXXLMin`. 크기는 `SM` · `LG` · `XL` 접미, 상태는 끝(`Hover` · `Active` · `Disabled`). CSS 변수 모드의 접두사는 미확인.
- 3 토큰 파일: 층별 인터페이스 파일 + 테마(알고리즘)별 폴더. `components/theme/interface/{seeds,alias,components}.ts` · `interface/maps/*.ts` · `components/theme/themes/{default,dark,compact}/` · `themes/seed.ts`.
- 4 부품 CSS: CSS 파일 없음(CSS-in-JS). 부품 폴더 안 `components/button/style/{index,token,variant,group,compact}.ts`. 공용은 `components/style/{index.tsx,reset.css,motion/*.ts}`.
- 5 글자 스타일: 토큰(Map 층 `interface/maps/font.ts` 의 `fontSizeHeading1` · `lineHeightHeading1`) + Typography 부품. 글자 클래스 없음.
- 6 캐스케이드: CSS-in-JS 삽입 순서. `@layer` 는 선택 사항(`components/theme/util/useResetIconStyle.ts` 에 `layer` 설정 — 층 이름은 미확인).
- 7 부품 범위 값: 부품 폴더의 `style/token.ts`(`ComponentToken` + `prepareComponentToken`). 전역 인터페이스 `interface/components.ts` 가 부품 토큰 형을 모아 줌.
- 8 접근성 · 움직임: 움직임은 공용 폴더 `components/style/motion/{fade,slide,zoom,collapse,move}.ts` 에 모음. `prefers-reduced-motion` / `forced-colors` 는 일부 부품(`border-beam/style/index.ts`)에서만 보임.
- 9 폐기: 인터페이스 주석 `@deprecated`(`interface/alias.ts` 의 `controlTmpOutline`, `presetColors.ts`). 삭제 주기 미확인.
- 10 유틸리티: 없음.
- 11 쓰는 서비스: 미확인(README 에서 서비스 이름 못 찾음).

#### Mantine

- URL: https://github.com/mantinedev/mantine (`packages/@mantine/core/src`) · https://mantine.dev 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + 부품 변수. 테마 객체(`core/MantineProvider/default-theme.ts` 의 `colors` · `fontSizes` · `spacing` · `headings`)가 `--mantine-color-blue-6` 같은 기본값과 `--mantine-primary-color-filled-hover` · `--mantine-color-text` 같은 역할 변수를 만든다(`MantineCssVariables/default-css-variables-resolver.ts`). 기본값 변수도 그대로 쓰게 열어 둠.
- 2 이름 규칙: 전역 `--mantine-`, 부품 변수는 부품 이름. 예 `--mantine-z-index-modal` · `--mantine-primary-color-light-hover` · `--button-height-sm` · `--button-height-compact-xs`. 크기 `xs`–`xl`, 상태는 끝(`-hover`).
- 3 토큰 파일: TS 테마 객체 한 파일(`default-theme.ts`) → 런타임에 CSS 변수 생성. 정적 전역 CSS 는 `core/MantineProvider/{global,baseline}.css`.
- 4 부품 CSS: 부품 코드 옆 CSS Modules. `components/Button/{Button.tsx,Button.module.css}`. 배포는 합친 `@mantine/core/styles.css` 와 부품별 파일(문서 `apps/mantine.dev/src/pages/styles/css-files-list.mdx`).
- 5 글자 스타일: 테마 객체의 `headings`(크기 · 줄 높이 · 굵기) + `Title` · `Text` 부품. 글자 클래스 없음.
- 6 캐스케이드: 기본은 층 없음. `@layer mantine` 으로 감싼 `@mantine/core/styles.layer.css` 를 따로 배포(문서 `mantine-styles.mdx`: 「same styles … but wrapped in the `@layer mantine` directive」).
- 7 부품 범위 값: 부품 파일 안(`Button.module.css` 맨 위 `--button-height-xs: 30px` …).
- 8 접근성 · 움직임: 움직임은 전역 한 파일(`core/MantineProvider/global.css`: `[data-respect-reduced-motion] @media (prefers-reduced-motion: reduce) [data-reduce-motion]`). `forced-colors` 는 일부 부품 파일(`components/Indicator/Indicator.module.css`).
- 9 폐기: 미확인(`MantineCssVariables/v8-css-variables-resolver.ts` 라는 옛 판 호환 파일이 있음).
- 10 유틸리티: 클래스 층 없음(스타일 props).
- 11 쓰는 서비스: 미확인.

#### Chakra UI (v3)

- URL: https://github.com/chakra-ui/chakra-ui (`packages/react/src/theme` · `styled-system`) · https://chakra-ui.com 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + recipe. `theme/tokens/*.ts`(기본값) · `theme/semantic-tokens/{colors,radii,shadows}.ts`(역할: `bg.DEFAULT` · `bg.subtle`) · 부품은 토큰이 아니라 recipe(`theme/recipes/button.ts`). 기본값 토큰도 스타일 props 로 직접 쓸 수 있음.
- 2 이름 규칙: CSS 변수 접두사 `--chakra-`(`system.ts` 의 `cssVarsPrefix = "chakra"`), 점 경로. 예 `bg.subtle` · `colorPalette` · `textStyle: "sm"`. 크기 `2xs`–`2xl`, 상태는 토큰 이름이 아니라 조건(`_hover`).
- 3 토큰 파일: 종류별 파일, 층별 폴더. `theme/tokens/{colors,spacing,sizes,radius,font-sizes,line-heights,durations,easings,z-indices,…}.ts`(18파일) · `theme/semantic-tokens/`(3파일).
- 4 부품 CSS: CSS 파일 없음. 가운데 폴더에 부품마다 recipe 파일 `theme/recipes/button.ts`(부품 TSX 와 다른 폴더).
- 5 글자 스타일: 따로 파일. `theme/text-styles.ts`(`defineTextStyles`: `xs` = fontSize + lineHeight), 같은 급으로 `layer-styles.ts` · `motion-styles.ts`. recipe 가 `textStyle: "sm"` 으로 부름.
- 6 캐스케이드: `@layer reset, base, tokens, recipes;`(`styled-system/layers.ts` 의 `defaultLayers` · `layerOrder`), `disableLayers` 설정으로 끌 수 있음.
- 7 부품 범위 값: recipe 파일 안. 전역 토큰 파일에 두지 않음.
- 8 접근성 · 움직임: 조건 이름을 한 파일에 정의(`packages/react/src/preset-base.ts`: `motionReduce` · `motionSafe` · `highContrast: "@media (forced-colors: active)"`), 쓰는 곳은 각 recipe.
- 9 폐기: 미확인(토큰 폴더에서 deprecated 표시 못 찾음).
- 10 유틸리티: 클래스 층 없음(스타일 props 가 원자 클래스를 만든다).
- 11 쓰는 서비스: 미확인.

#### Uber Base Web

- URL: https://github.com/uber/baseweb (`src/tokens` · `src/themes`) · https://baseweb.design 확인 날짜 2026-11-11 (README: 유지보수 제한 상태)
- 1 토큰 층: 4층. primitive(`src/tokens/color-primitive-tokens.ts`) → foundation(`src/themes/light-theme/color-foundation-tokens.ts` 의 `primaryA` · `primaryB`) → semantic(`color-semantic-tokens.ts` 의 `backgroundPrimary: foundation.primaryB`) → component(`color-component-tokens.ts` 의 `buttonPrimaryFill`). 부품 토큰이 primitive 를 직접 읽는 줄도 있음(`buttonPrimaryHover: primitiveLightColors.gray900`).
- 2 이름 규칙: camelCase, 접두사 없음. 예 `backgroundPrimary` · `contentPrimary` · `buttonPrimaryFill` · `buttonPrimaryHover`. 글자는 `LabelMedium` · `font450`.
- 3 토큰 파일: 층별 파일 × 테마별 폴더. `src/themes/{light-theme,dark-theme}/color-{foundation,semantic,component}-tokens.ts` + 테마 공통 `src/themes/shared/{typography,sizing,animation,borders,lighting,breakpoints,grid}.ts`.
- 4 부품 CSS: CSS 파일 없음(Styletron). 부품 폴더 안 `src/button/styled-components.ts`.
- 5 글자 스타일: 테마 공통 파일 `src/themes/shared/typography.ts`(`font450` 조합 → `LabelMedium` 역할 이름).
- 6 캐스케이드: CSS-in-JS 원자 클래스. `@layer` 미사용(미확인 — 검색 안 함).
- 7 부품 범위 값: 전역 테마의 부품 토큰 파일(`color-component-tokens.ts`).
- 8 접근성 · 움직임: 미확인.
- 9 폐기: 소스 주석 `// Deprecated`(`dark-theme/color-component-tokens.ts` 여러 묶음). 삭제 주기 미확인.
- 10 유틸리티: 없음.
- 11 쓰는 서비스: Uber(저장소 소유자 · 「mirroring our internal development」).

#### Pinterest Gestalt

- URL: https://github.com/pinterest/gestalt (`packages/gestalt-design-tokens` · `packages/gestalt` · `packages/stylelint-plugin-gestalt`) · https://gestalt.pinterest.systems 확인 날짜 2026-11-11
- 1 토큰 층: 3층. 파일 이름이 층을 말함 — `tokens/classic/base-color.json` · `sema-color-light.json` · `comp-web-color-light.json`. 부품 CSS 가 base 계열 변수(`--rounding-600` · `--font-size-100` · `--color-transparent`)도 직접 씀.
- 2 이름 규칙: 층 접두사 `--sema-` · `--comp-` · (base 는 접두사 없는 것이 보임). `--{층}-{종류}-{역할}-{변형}-{상태}`. 예 `--sema-color-border-focus-inner-default` · `--sema-color-hover-text-default` · `--rounding-600` · `--font-size-100`. 크기는 100 단위 번호.
- 3 토큰 파일: 층 + 종류 + 색 모드별 JSON, 테마별 폴더. `tokens/classic/{base-color,base-font,base-space,base-rounding,sema-color-light,sema-color-dark,comp-web-color-light,comp-web-font,…}.json`(19) · `tokens/vr-theme/`(32) · `tokens/vr-theme-web-mapping/`(16). Style Dictionary 빌드(`src/build.js` · `src/platforms/{web,ios,android}.js`).
- 4 부품 CSS: 가운데 한 폴더에 부품마다 CSS Modules 파일(TSX 와 같은 폴더, 폴더 구분 없음). `packages/gestalt/src/Button.css` + `Button.tsx`.
- 5 글자 스타일: 원자 클래스 파일 `packages/gestalt/src/Typography.css`(`.fontSize100` · `.antialiased`) 을 부품이 `composes` 로 가져감. `Text.css` · `TextUI.css` · `TextCompact.css` 도 있음.
- 6 캐스케이드: `@layer` 못 찾음. CSS Modules `composes`(`Button.css`: `composes: borderBox minWidth60 from "./Layout.css"`).
- 7 부품 범위 값: 전역 토큰의 comp 층(`comp-web-*.json`).
- 8 접근성 · 움직임: `forced-colors` 0파일. `prefers-reduced-motion` 은 `Switch.css` · `utils/tapScaleAnimation.css` 와 훅 `useReducedMotion.ts`.
- 9 폐기: stylelint 플러그인 `packages/stylelint-plugin-gestalt`(규칙 `no-invalid-design-tokens`). 토큰의 deprecated 표시는 미확인.
- 10 유틸리티: 내부용 원자 CSS Modules 파일이 있음(`Layout.css` · `Borders.css` · `Whitespace.css` · `boxWhitespace.css` · `Typography.css` · `Focus.css`) — 밖으로는 `Box` · `Flex` 부품 props 로만 노출.
- 11 쓰는 서비스: Pinterest(README 「Gestalt is Pinterest's design system」).

#### Twilio Paste

- URL: https://github.com/twilio-labs/paste (`packages/paste-design-tokens` · `packages/paste-core`) · https://paste.twilio.design 확인 날짜 2026-11-11
- 1 토큰 층: 2층. `tokens/aliases/*.yml`(팔레트 `palette-blue-10: "#ebf4ff"`, 빌드 안에서만 쓰는 별칭) · `tokens/global/*.yml`(역할 `color-background-strong: {!palette-gray-20}`). 부품 토큰 층 없음. 밖으로 나가는 것은 global 층.
- 2 이름 규칙: `{css 속성 종류}-{역할}-{강도}`, 부품에서는 camelCase 키. 예 `color-background-strong` · `color-background-stronger` · `colorBackgroundPrimary` · `colorTextInverse`. 강도는 `weak` · `strong` · `stronger`, 간격은 번호(`space-40` 꼴 — 파일 `global/spacing.yml`).
- 3 토큰 파일: 층 폴더 → CSS 속성 종류별 YAML. `tokens/global/{background-color,border-color,text-color,spacing,font-size,line-height,box-shadow,z-index,…}.yml` + 테마별 폴더 `tokens/themes/{twilio,twilio-dark,dark,evergreen,sendgrid}/`.
- 4 부품 CSS: CSS 파일 없음(스타일 props). 부품마다 패키지 `packages/paste-core/components/button/src/{PrimaryButton.tsx,styles.ts}`.
- 5 글자 스타일: 부품(`components/heading/src/Heading.tsx` · `paragraph/src/Paragraph.tsx`)이 낱값 토큰을 조합. 조합 토큰 없음.
- 6 캐스케이드: CSS-in-JS. `@layer` 미확인.
- 7 부품 범위 값: 부품 코드 안 스타일 객체(`PrimaryButton.tsx` 의 `backgroundColor: "colorBackgroundPrimary"`).
- 8 접근성 · 움직임: 미확인.
- 9 폐기: 이름에 `deprecated-` 를 붙인 별칭(`global/box-shadow.yml` 의 `{!deprecated-shadow-elevation-30}`). 삭제 주기 미확인.
- 10 유틸리티: 없음(`Box` · `Text` 기본 부품 props).
- 11 쓰는 서비스: Twilio · SendGrid(테마 폴더 이름 `themes/twilio` · `themes/sendgrid`).

#### Elastic EUI

- URL: https://github.com/elastic/eui (`packages/eui` · `packages/eui-theme-common` · `packages/eui-theme-borealis`) · https://eui.elastic.co 확인 날짜 2026-11-11
- 1 토큰 층: 3층(색). `packages/eui-theme-borealis/src/variables/colors/_primitive_colors.ts` → `_semantic_colors.ts`(`SEMANTIC_COLORS.primary90`) → 테마 색 `_colors_light.ts`(`primary` · `textParagraph` · `backgroundBasePlain`). 부품 값은 `variables/_components.ts` · `_buttons.ts` · `_forms.ts`. 앱은 `useEuiTheme()` 의 테마 색 층을 씀(primitive 를 여는지는 미확인).
- 2 이름 규칙: JS 객체 키 camelCase, `{속성}{역할}{변형}`. 예 `textParagraph` · `backgroundBasePlain` · `borderBaseFloating`. 유틸리티 클래스 `.eui-*`, 크기 `xs`–`xxl`(파일 `variables/_size.ts`).
- 3 토큰 파일: 테마 패키지 → 종류별 파일. `eui-theme-borealis/src/variables/{_borders,_typography,_size,_shadows,_animation,_levels,_states,_breakpoint}.ts` + `variables/colors/{_colors_light,_colors_dark,_colors_severity,_colors_vis_light,…}.ts`. 옛 Sass 변수도 같은 이름 `.scss` 로 나란히 유지.
- 4 부품 CSS: CSS 파일 없음(Emotion). 부품 코드 옆 `*.styles.ts`(`packages/eui/src/components/button/button_display/_button_display.styles.ts`). 공용은 `packages/eui/src/global_styling/{mixins,functions,variables,reset,utility}/`.
- 5 글자 스타일: 토큰 `variables/_typography.ts`(눈금 · 굵기) + 함수 · 믹스인 `global_styling/functions/typography.ts` · `mixins/_typography.ts`, 적용은 `EuiText` · `EuiTitle` 부품.
- 6 캐스케이드: CSS-in-JS 삽입 순서(전역 리셋 `global_styling/reset/global_styles.tsx`). `@layer` 미확인.
- 7 부품 범위 값: 테마 패키지의 부품 파일(`variables/_components.ts` · `_buttons.ts` · `_forms.ts`) — 전역 쪽에 둠.
- 8 접근성 · 움직임: 도우미를 한 파일에 모으고 각 부품 스타일이 부름. `global_styling/functions/high_contrast.ts`(`highContrastModeStyles` · `preventForcedColors`), 움직임 `global_styling/variables/animations.ts` · `mixins/_helpers.ts`. 고대비용 색 파일도 따로 있음(`_colors_severity_hcm.ts` · `_colors_vis_hcm.ts`).
- 9 폐기: JSDoc `@deprecated - use `textPrimary` instead`(`eui-theme-common/src/global_styling/variables/colors.ts` · `borders.ts`, 대체 안내 포함). 삭제 주기 미확인.
- 10 유틸리티: 있음. `global_styling/utility/utility.tsx`(`.eui-*` 클래스).
- 11 쓰는 서비스: Elastic 제품 · Kibana(README).

#### Grafana UI

- URL: https://github.com/grafana/grafana (`packages/grafana-data/src/themes` · `packages/grafana-ui/src`) · https://developers.grafana.com/ui 확인 날짜 2026-11-11
- 1 토큰 층: 2층 + 부품. 팔레트(`packages/grafana-data/src/themes/palette.ts`) → 테마 객체(`createColors.ts` 의 `colors.text.primary` · `colors.primary.main`, `createSpacing.ts` · `createShape.ts` · `createTypography.ts`) + 부품 값(`createComponents.ts` 의 `components.input` · `components.height` · `components.panel`). 부품 코드는 테마 객체만 읽음.
- 2 이름 규칙: JS 객체 점 경로. 예 `theme.colors.text.primary` · `theme.spacing(1)`(함수, 8px 격자 배수) · `theme.typography.bodySmall` · `theme.transitions.handleMotion('no-preference', 'reduce')`.
- 3 토큰 파일: 종류별 생성 함수 파일. `themes/{createColors,createSpacing,createShape,createShadows,createTypography,createTransitions,createComponents,breakpoints,zIndex}.ts` → `createTheme.ts` 가 합침.
- 4 부품 CSS: CSS 파일 없음(Emotion). 부품 파일 안 `getStyles`(`packages/grafana-ui/src/components/Button/Button.tsx`). 전역 스타일은 주제별 파일 `packages/grafana-ui/src/themes/GlobalStyles/{elements,forms,card,page,fonts,accessibility,utilityClasses,…}.ts`.
- 5 글자 스타일: 테마 객체의 조합(`createTypography.ts` 의 `h1`…`bodySmall` — `buildVariant`), 부품 `Text`.
- 6 캐스케이드: CSS-in-JS. `@layer` 미확인.
- 7 부품 범위 값: 전역 테마의 `createComponents.ts` + 부품 파일 안 계산값(`paddingMinusBorder`).
- 8 접근성 · 움직임: 움직임 도우미 한 곳(`createTransitions.ts` 의 `handleMotion`) + 각 부품에서 호출(`Button.tsx` 283행). forced-colors 미확인.
- 9 폐기: 타입 주석 `@deprecated use `mainEmphasis` instead` · 「Will be removed in a future version」(`themes/types.ts`), 옛 판 호환 `createV1Theme.ts`.
- 10 유틸리티: 있음(전역 스타일 안 `GlobalStyles/utilityClasses.ts` 의 `.width-N` · `.max-width-N`, `accessibility.ts` 의 `.sr-only`).
- 11 쓰는 서비스: Grafana(같은 저장소).

#### Kiwi.com Orbit

- URL: https://github.com/kiwicom/orbit (`packages/orbit-design-tokens` · `orbit-components` · `orbit-tailwind-preset`) · https://orbit.kiwi 확인 날짜 2026-11-11
- 1 토큰 층: 3층. 폴더 이름 `dictionary/definitions/foundation/`(16파일: `palette/blue.json` · `borderRadius.json`) · `global/`(17) · `component/`(47: `button-link/button-link-critical.json`). 부품 토큰이 foundation 을 직접 가리킴(`"value": "{foundation.palette.red.light-hover}"`).
- 2 이름 규칙: `{부품}-{변형}-{속성}-{상태}`. 예 Tailwind 클래스 `bg-button-primary-background-hover` · 토큰 경로 `component.button-link.critical.background-active` · `foundation.palette.red.light-hover`. 상태는 끝(`-hover` · `-active` · `-focus`).
- 3 토큰 파일: 층 폴더 → 종류 또는 부품 → JSON(Style Dictionary, `dictionary/build.ts`). 출력에 `deprecated-tokens.json` 이 따로 있음.
- 4 부품 CSS: CSS 파일 없음. 부품 TSX 안 Tailwind 클래스(`packages/orbit-components/src/Button/index.tsx`), 토큰은 Tailwind preset 으로(`orbit-tailwind-preset/src/{foundation/cssVarsFoundation.ts,getComponentLevelTokens.ts}`).
- 5 글자 스타일: 부품 토큰(`definitions/component/heading/` 4파일 · `text/`) + `Heading` · `Text` 부품.
- 6 캐스케이드: Tailwind 층 순서. 따로 정한 `@layer` 미확인.
- 7 부품 범위 값: 전역 토큰 패키지의 component 층.
- 8 접근성 · 움직임: 미확인(`hooks/useMediaQuery` 에 reduced-motion 판별만 확인).
- 9 폐기: 빌드가 폐기 토큰을 걸러 따로 냄(`dictionary/build.ts` 의 `isDeprecated` · `isNotDeprecated` → `deprecated-tokens.json`). 삭제 주기 미확인.
- 10 유틸리티: Tailwind 유틸리티.
- 11 쓰는 서비스: Kiwi.com(README).

#### 당근 SEED Design (daangn/seed-design, V3 · rootage)

- URL: https://github.com/daangn/seed-design (`packages/rootage` · `packages/css` · `packages/react`) · https://seed-design.io 확인 날짜 2026-11-11
- 1 토큰 층: 3층. `packages/rootage/color.yaml` 안에 팔레트(`$color.palette.gray-100`, 테마별 값)와 역할(`$color.fg.neutral` · `$color.bg.layer-default`)이 같이 있고, 부품 명세는 `packages/rootage/components/action-button.yaml`(`kind: ComponentSpec`, 슬롯 · 속성 · 변형별 값). 팔레트 변수도 CSS 로 나옴(`--seed-color-palette-gray-100`).
- 2 이름 규칙: 접두사 `--seed-`, 클래스 `.seed-`. `--seed-{종류}-{분류}-{역할}-{상태}`. 예 `--seed-color-bg-layer-default-pressed` · `--seed-color-palette-gray-100` · `--seed-color-fg-neutral`. 상태는 끝(`-pressed`), 눈금은 100 단위.
- 3 토큰 파일: 종류별 YAML, 한 폴더. `packages/rootage/{color,dimension,duration,font-size,font-weight,line-height,radius,gradient,…}.yaml` + `collections.yaml`. 생성물 `packages/css/vars/{color/bg,color/fg,radius,shadow,…}.mjs` 와 `base.css`.
- 4 부품 CSS: 가운데 폴더에 부품마다 파일(생성물). `packages/css/recipes/action-button.css` + 같은 내용의 층 판 `action-button.layered.css`, 합친 `all.css` · `all.layered.css`. React 코드(`packages/react`)와 다른 패키지.
- 5 글자 스타일: 부품 recipe(`packages/css/recipes/text.css`) + 낱값 토큰(`font-size.yaml` · `line-height.yaml` · `font-weight.yaml`).
- 6 캐스케이드: 층 판을 따로 배포. `@layer seed-base`(`base.layered.css`) · `@layer seed-components`(`recipes/*.layered.css`). 층 없는 판도 같이 줌.
- 7 부품 범위 값: 전역 토큰 저장소의 부품 명세(`rootage/components/*.yaml`) → recipe CSS 안 지역 변수(`--seed-box-padding-top`).
- 8 접근성 · 움직임: `prefers-reduced-motion: reduce` 가 `base.css` 에 2곳(전역). forced-colors 는 `base.css` 에 없음. 부품별은 미확인.
- 9 폐기: 토큰 설명에 `@deprecated` + 대체 토큰 + 지울 판(「`$color.fg.on-neutral-solid` 을 사용하세요. 이 토큰은 @seed-design/css@4.0.0 … 에서 제거될 예정입니다」, `color.yaml` 465 · 627 · 632행). V2→V3 이전 도구 `tools/figma-v3-migration`.
- 10 유틸리티: 미확인.
- 11 쓰는 서비스: 당근(저장소 소유자 daangn).

#### SmartHR UI

- URL: https://github.com/kufu/smarthr-ui (`packages/smarthr-ui/src`) · https://smarthr.design 확인 날짜 2026-11-11
- 1 토큰 층: 2층. 기본값 `src/themes/createColor.ts`(`GREY_5` · `MAIN` · `TEXT_LINK` 대문자 상수) → Tailwind preset 의 역할 이름(`src/smarthr-ui-preset.ts`: `colors.main` · `main-darken` · `link` · `danger` · `outline`). preset 주석이 「色トークン周りの整理が必要(일부는 primitive 에만 있음)」 이라고 적음. 부품 토큰 층 없음.
- 2 이름 규칙: Tailwind 클래스 접두사 `shr-`. 예 `shr-inline-flex` · `shr-cursor-pointer` · 색 키 `main-darken` · `warning-yellow-darken`. 상태는 `-darken` 접미 + Tailwind 변형.
- 3 토큰 파일: 종류별 생성 함수 파일(`src/themes/{createColor,createFontSize,createLeading,createSpacing,createRadius,createShadow,createBorder,createBreakpoint,createInteraction,createTheme}.ts`) + Tailwind preset 한 파일.
- 4 부품 CSS: CSS 파일 없음. 부품 폴더 안 `tailwind-variants`(`src/components/Button/style.ts` 의 `tv({…'shr-box-border'…})`). 전역 CSS 는 `src/styles/index.css`(`@tailwind base; components; utilities;`).
- 5 글자 스타일: preset 의 `fontSize` · `lineHeight` 눈금 + `Text` · `Heading` 부품. 조합 클래스는 미확인.
- 6 캐스케이드: Tailwind v3 층(`@tailwind base → components → utilities`), preset 플러그인이 `addBase` · `addComponents` 로 넣음.
- 7 부품 범위 값: 부품 `style.ts` 안.
- 8 접근성 · 움직임: preset 한 파일에 모음(`smarthr-ui-preset.ts`: `addComponents({'@media (forced-colors: active)': …})` 2곳 + `addVariant('forced-colors', '@media (forced-colors: active)')` 변형을 만들어 각 부품에서 `forced-colors:` 접두로 씀).
- 9 폐기: 미확인.
- 10 유틸리티: Tailwind 유틸리티(`shr-` 접두사).
- 11 쓰는 서비스: SmartHR(저장소 소유자 kufu = SmartHR).

#### GitLab Pajamas (gitlab-ui)

- URL: https://gitlab.com/gitlab-org/gitlab-ui (`src/tokens` · `src/scss` · `src/components`) · https://design.gitlab.com 확인 날짜 2026-11-11
- 1 토큰 층: 3층. 폴더 이름 `src/tokens/constant/`(`color.tokens.json` · `color.alpha.tokens.json` · `line_height.tokens.json`) · `src/tokens/semantic/`(`action` · `background` · `border` · `control` · `feedback` · `focus-ring` · `icon` · `shadow` · `status` · `text`) · `src/tokens/contextual/`(부품: `button.tokens.json` · `alert` · `badge` · `tabs` 등 22파일). 옛 색 눈금은 `src/tokens/deprecated/` 로 옮겨 둠.
- 2 이름 규칙: 접두사 `--gl-`, 클래스 · 유틸리티 `gl-`. `--gl-{부품}-{변형}-{속성}-{상태}`. 예 `--gl-button-default-primary-background-color-default` · `--gl-button-default-primary-foreground-color-default`, 유틸리티 `gl-px-4` · `gl-rounded-base`. 상태는 끝(`-default` · `-hover` …).
- 3 토큰 파일: 층 폴더 → 주제(역할 묶음 또는 부품)별 `*.tokens.json`(DTCG 꼴 `$value` · `$type`, 값에 `default` / `dark` 모드). 빌드 출력 `src/tokens/build/{css,scss,js,json,tailwind,figma,docs}/`.
- 4 부품 CSS: 부품 코드 옆에 부품마다 파일. `src/components/base/button/{button.vue,button.scss,button.md,button.stories.js}`, 묶음 진입 `src/scss/components.scss`.
- 5 글자 스타일: 토큰과 따로 Sass 파일. `src/scss/typescale/` · `src/scss/typography.scss`.
- 6 캐스케이드: import 순서(`src/scss/gitlab_ui.scss`: bootstrap → bootstrap_vue → tokens → functions → variables → mixins → typescale → body → typography → components). 유틸리티는 Tailwind(`src/scss/tailwind.css` 의 `@tailwind base; components; utilities;`). CSS `@layer` 직접 선언은 못 찾음.
- 7 부품 범위 값: 전역 토큰의 contextual 층(`src/tokens/contextual/button.tokens.json`) → 부품 Sass 가 `var(--gl-button-…)` 로 읽음.
- 8 접근성 · 움직임: 미확인.
- 9 폐기: 토큰 필드 `"deprecated": true` + 전용 폴더 `src/tokens/deprecated/*.tokens.json` + stylelint 규칙 `stylelint/no_gl_depreacted_design_tokens.js`. 삭제 주기 미확인.
- 10 유틸리티: Tailwind 유틸리티(`gl-` 접두사, `tailwind.defaults.js`), 부품 Sass 도 `@apply gl-inline-flex` 로 씀.
- 11 쓰는 서비스: GitLab(저장소 소유자 gitlab-org).

#### Atlassian Design System (`@atlaskit/tokens` 20.11.0)

- URL: https://unpkg.com/browse/@atlaskit/tokens@20.11.0/ (npm 배포물. 소스 저장소는 Bitbucket — 열어 보지 않음) · https://atlassian.design 확인 날짜 2026-11-11
- 1 토큰 층: 2층. 팔레트(`dist/esm/artifacts/palettes-raw/{palette,spacing-scale,typography-palette,shape-palette,motion-palette}.js`, 토큰 원본 값이 `"Lime100"` 처럼 팔레트 이름) → 디자인 토큰(`--ds-*`). 팔레트는 CSS 변수로 나오지 않음(테마 파일에는 `--ds-*` 만). 부품 토큰 층은 패키지에 없음.
- 2 이름 규칙: 접두사 `--ds-`, 점 경로 `color.background.accent.lime.subtlest` → `--ds-background-accent-lime-subtlest`(색은 `color` 를 뺌). 상태는 끝(`-hovered` · `-pressed`), 강도 `subtlest` · `subtle` · `bold` · `bolder`, 간격은 번호 `--ds-space-025` · `--ds-space-050`. 예 `--ds-background-information` · `--ds-background-discovery-bold-pressed` · `--ds-font-heading-large`.
- 3 토큰 파일: 테마(색 모드 · 종류)별 파일. `artifacts/themes/{atlassian-light,atlassian-dark,atlassian-light-increased-contrast,atlassian-spacing,atlassian-typography,atlassian-shape,atlassian-motion}.js`, 원본 경로는 `schema/themes/atlassian-light/color/accent.tsx`(테마 → 종류 → 묶음).
- 4 부품 CSS: 미확인(이 패키지 밖).
- 5 글자 스타일: 토큰으로 둔다. `atlassian-typography` 테마의 `font` 줄임값 `--ds-font-heading-large: normal 653 1.5rem/1.75rem "Atlassian Sans", …`.
- 6 캐스케이드: 미확인.
- 7 부품 범위 값: 미확인.
- 8 접근성 · 움직임: 고대비는 테마로(`atlassian-light-increased-contrast.js` · `atlassian-dark-increased-contrast.js`). 부품 쪽 규칙은 미확인.
- 9 폐기: 토큰마다 `"state"`(이번 판은 942개 모두 `active`) · `"introduced": "1.6.0"` · `replacement` 속성, 생성 파일 `artifacts/replacement-mapping.js`(주석: 「Mark the old token's 'state' as deprecated → Add a 'replacement' attribute → … ESLint and other tools will now use this to automate replacing tokens」), 코드모드 `codemods/css-to-design-tokens` · `codemods/theme-to-design-tokens`. 삭제 주기는 미확인.
- 10 유틸리티: 미확인.
- 11 쓰는 서비스: Atlassian 제품(atlassian.design — 제품 이름 목록은 미확인).

#### Nordhealth Nord (`@nordhealth/tokens` 9.0.6 · `@nordhealth/css` 5.3.2)

- URL: https://unpkg.com/browse/@nordhealth/tokens@9.0.6/lib/ · https://unpkg.com/browse/@nordhealth/css@5.3.2/lib/ (npm 배포물. 소스 저장소는 공개 트리를 못 받음) · https://nordhealth.design 확인 날짜 2026-11-11
- 1 토큰 층: CSS 변수로는 역할 1층(`--n-color-text` · `--n-color-surface` · `--n-color-status-danger` · `--n-color-border-info`). 팔레트 변수는 배포 파일에서 못 찾음. 부품 층은 미확인.
- 2 이름 규칙: 접두사 `--n-`. `--n-{종류}-{역할}-{변형}`. 예 `--n-color-text-link` · `--n-color-status-warning` · `--n-size-icon-xs`. 크기 `xs` · `s` · `m` · `l`.
- 3 토큰 파일: 공통 한 파일 + 테마(브랜드 × 색 모드 × 고대비)별 색 파일. `lib/tokens.custom-properties.css` · `lib/color-{nord,nord-dark,nord-high-contrast,nord-dark-high-contrast,vet,vet-dark,…}.custom-properties.css`.
- 4 부품 CSS: 웹 컴포넌트 패키지(별도) — 미확인. CSS 프레임워크 쪽은 묶음 파일 `lib/tailwind/{base/reset.css,base/fonts.css,components/typeset.css,components/dl.css,utilities/forms.css,utilities/custom.css,utilities/container.css}`.
- 5 글자 스타일: 따로 파일 `lib/tailwind/components/typeset.css`.
- 6 캐스케이드: `@layer theme, base, components, utilities;`(`lib/tailwind/main.css`), Tailwind 를 `layer(theme) prefix(n)` 으로 import.
- 7 부품 범위 값: 미확인.
- 8 접근성 · 움직임: `nord.css` 에 `prefers-reduced-motion:reduce` 1곳(전역). 고대비는 테마 파일(`color-nord-high-contrast…`).
- 9 폐기: 미확인.
- 10 유틸리티: 있음(Tailwind 유틸리티 `n` 접두사 + `lib/tailwind/utilities/*.css`).
- 11 쓰는 서비스: 미확인.

#### 열지 못해 세지 않은 곳

- Vercel Geist · LINE Design System · toss: 이번 조사에서 공개 소스를 열어 보지 않았다. 미확인(집계에 넣지 않음).

### 방법론 문서

#### W3C DTCG — Design Tokens Format Module 2025.10

- URL: https://www.designtokens.org/tr/drafts/format/ 확인 날짜 2026-11-11 (Draft Community Group Report, W3C 표준 아님. 앞 100,000자만 읽음)
- 파일: 확장자 `.tokens` · `.tokens.json`, 미디어 타입 `application/design-tokens+json`.
- 이름: 대소문자 구분, `$` 로 시작하면 안 되고 `{` `}` `.` 을 쓸 수 없음. 그룹은 임의이며 도구는 그룹에서 종류 · 목적을 짐작하면 안 됨(「SHOULD NOT」).
- 참조: `{group.token}`(토큰 전체) 와 JSON Pointer `$ref`. 연쇄 참조 가능, 순환 불가.
- `$type`: color · dimension · fontFamily · fontWeight · duration · cubicBezier · number + 조합형 strokeStyle · border · transition · shadow · gradient · typography.
- 폐기: `$deprecated` — `true` / 설명 문자열 / `false`. 그룹에 붙이면 아래 토큰에 내려감.
- 그 밖: `$description`, `$extensions`(도구별 키, 역도메인 표기 권장), 그룹 상속 `$extends`.
- 층(primitive · semantic · component)과 파일 나누기: 읽은 범위에 규정 없음. 테마 · 모드 · resolver 는 읽은 범위에서 미확인.

#### MDN — `@layer`

- URL: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer 확인 날짜 2026-11-11
- 순서: 처음 선언한 층이 가장 낮고 마지막 층이 가장 높다. 순서가 정해지면 층 사이에서는 특이성 · 등장 순서를 보지 않는다. 같은 이름을 다시 쓰면 그 층에 덧붙고 순서는 그대로.
- 층 밖 스타일: 층에 넣지 않은 일반 선언이 모든 층보다 우선한다. `!important` 는 순서가 뒤집힌다(층 안 important 가 층 밖 important 보다 우선, 앞 층이 뒤 층보다 우선).
- 문법: 선언문 `@layer theme, layout, utilities;`, 중첩 `@layer framework.layout {…}`, 이름 없는 층, `@import "theme.css" layer(utilities);`.
- 지원: Baseline Widely available, 2022년 3월부터.

#### Tailwind CSS v4 — `@theme` · 층 (문서 + 소스 4.3.5)

- URL: https://tailwindcss.com/docs/theme · https://tailwindcss.com/docs/adding-custom-styles · https://github.com/tailwindlabs/tailwindcss (`packages/tailwindcss/index.css` · `theme.css`) 확인 날짜 2026-11-11
- 층 순서: `packages/tailwindcss/index.css` 가 `@layer theme, base, components, utilities;` 를 선언하고 `theme.css` 를 `layer(theme)`, `preflight.css` 를 `layer(base)`, `utilities.css` 를 `layer(utilities)` 로 import.
- `@theme` 와 `:root`: 문서 — 「Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes.」 `@theme` 은 최상위에만 쓸 수 있음.
- 이름공간: `--color-*` · `--font-*` · `--text-*` · `--font-weight-*` · `--spacing-*` · `--breakpoint-*` · `--container-*` · `--radius-*` · `--shadow-*` · `--ease-*` · `--animate-*` · `--tracking-*` · `--leading-*` 등. 글자 크기는 짝 변수 `--text-sm` + `--text-sm--line-height`(`theme.css` 349–350행). 이름공간 비우기 `--color-*: initial`.
- 변형: `@theme inline`(다른 변수를 가리키는 값), `@theme static`(안 쓰는 변수도 모두 출력 — 기본은 쓴 변수만 출력).
- 나누기: 문서 — 테마 변수를 「their own CSS file」 로 떼어 여러 프로젝트가 import.
- 부품 클래스: 문서 — 「Use the `components` layer for any more complicated classes … that you'd still like to be able to override with utility classes」(`card` · `btn` · `badge`), 서드파티 부품 스타일도 이 층. 새 유틸리티는 `@utility`(자동으로 utilities 층), 변형은 `@custom-variant`.

#### CUBE CSS

- URL: https://cube.fyi/ · https://piccalil.li/blog/cube-css/ 확인 날짜 2026-11-11
- 뜻: Composition · Utility · Block · Exception. 「The cascade and inheritance are embraced, not avoided.」
- Composition: 배치와 간격의 뼈대(예 `.flow`). Utility: 「a CSS class that does one job and does that job well」. Block: 카드 · 버튼 같은 부품(CSS 는 작게). Exception: 부품의 변형 · 상태를 데이터 속성으로(`.card[data-state='reversed']`).
- 토큰: 값은 CSS 밖(예 JSON)에 두고 빌드가 `.bg-primary` · `.color-primary` 같은 유틸리티 클래스를 만든다.
- 묶기: class 속성 안에서 `[ card ] [ section box ] [ bg-base color-primary ]` 순서(블록 → 다른 블록 → 유틸리티).
- 파일 · 폴더 구조: 읽은 글에는 권장 없음. 전역 스타일로 대부분을 먼저 끝낸다고 적음.

#### ITCSS (Harry Roberts) — xfive 정리 글

- URL: https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/ 확인 날짜 2026-11-11 (원저자 글이 아니라 2차 정리 글)
- 층 순서 7개: Settings(글꼴 · 색 정의) → Tools(믹스인 · 함수) → Generic(리셋 · normalize · box-sizing, 「the first layer which generates actual CSS」) → Elements(맨 HTML 요소) → Objects(꾸밈 없는 패턴 클래스) → Components(UI 부품) → Utilities(앞 층을 덮는 도우미).
- 원칙: 출력 CSS 가 낮은 특이성에서 높은 특이성으로, 넓은 범위에서 좁은 범위로, 일반에서 명시로 흐른다. Settings · Tools 는 CSS 를 내지 않는다.
- 파일: 층마다 하위 폴더를 두고 순서대로 import, 부품마다 파일 하나(React · Vue 는 부품 폴더에 같이). 이름은 BEMIT 접두사(`.c-user` · `.o-media`).

#### Style Dictionary

- URL: https://styledictionary.com/info/tokens/ 확인 날짜 2026-11-11
- 파일: 「You can organize your design token files in any way」. `source` · `include` 의 모든 파일을 깊은 병합하고, 폴더 · 파일 구조는 토큰 객체 구조에 영향을 주지 않는다. 소스끼리 겹치면 경고.
- 구조: Category / Type / Item 은 「not required」(예시 하나일 뿐).
- 참조: `{size.font.medium}`. 값이 아닌 노드를 가리키면 결과가 틀어진다고 경고.
- 메타: `value` 필수, 선택 `comment` · `themeable` · `name` · `attributes`. `deprecated` 는 내장 속성이 아니고 직접 넣을 수 있다고만 함. 부품 토큰 지침은 이 쪽에 없음.
- DTCG: `$value` · `$type` · `$description` 도 받지만 한 인스턴스에서 두 형식을 섞을 수 없음.

#### Brad Frost — Creating Themeable Design Systems (2018-04-02)

- URL: https://bradfrost.com/blog/post/creating-themeable-design-systems/ 확인 날짜 2026-11-11
- 3단: Tier 1 Brand definitions(`--color-brand-starbucks-green` · `--font-family-primary`, UI 자리에 묶지 않음) → Tier 2 High-level application variables(`--primary-action-background-color` · `--border-color-subtle` · `--font-family-heading`) → Tier 3 Component-specific variables(`--button-background-color` · `--button-border-width`, 각 부품의 partial 에 둔다).
- 테마: Tier 2 값을 다른 브랜드 값으로 바꾸면 그것을 쓰는 부품이 모두 바뀐다. Tier 3 는 「aren't likely to change once they're put in place」.
- 단서: 여러 단은 「may be overkill for some systems」, 얇게 시작해 나중에 단을 더하라고 적음.

#### Nathan Curtis — Naming Tokens in Design Systems

- URL: https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676 확인 날짜 2026-11-11 — HTTP 403 으로 열지 못함. 미확인(집계에 넣지 않음).

### 집계

디자인 시스템 28곳(분모 28), 방법론 문서 7개(분모 7)를 따로 센다. 열지 못한 Geist · LINE · toss · Nathan Curtis 글은 넣지 않았다. 한 곳이 두 방식을 같이 쓰면 주된 쪽에 세고 괄호에 적었다. 「미확인」 은 그 칸을 열어 보지 못했거나 근거를 못 찾은 곳이다.

#### 디자인 시스템 (분모 28)

| 칸                    | 방식                                                     | 곳 수 | 곳                                                                                                                                                                                                                                                                                                                                                      |
| --------------------- | -------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 토큰 층             | 3층 이상(기본값 · 역할 · 부품이 토큰 원본에 있음)        | 13    | Primer · Carbon · Material · Spectrum · SLDS · Codex · Gestalt · EUI · Orbit · SEED · GitLab · Ant Design(4층) · Base Web(4층)                                                                                                                                                                                                                          |
|                       | 2층(기본값 · 역할)                                       | 12    | Polaris · Fluent · GOV.UK · USWDS · Radix · Bootstrap · Mantine · Chakra · Paste · Grafana · SmartHR · Atlassian                                                                                                                                                                                                                                        |
|                       | 1층                                                      | 3     | shadcn/ui(역할) · Nord(역할) · Open Props(기본값)                                                                                                                                                                                                                                                                                                       |
| 1 기본값 층 직접 사용 | 막거나 내보내지 않음                                     | 7     | Primer(규칙) · Polaris(비노출) · Atlassian(비노출) · Nord(비노출) · Paste(빌드 내부 별칭) · GOV.UK(파일 이름 internal, 함수로 읽음) · Codex(부품은 decision 층에 기댐)                                                                                                                                                                                  |
|                       | 열어 둠(변수가 그대로 나오거나 부품이 직접 씀)           | 12    | Carbon · USWDS · Radix · shadcn/ui · Open Props · Bootstrap · Mantine · Chakra · Base Web · Gestalt · Orbit · SEED                                                                                                                                                                                                                                      |
|                       | 미확인                                                   | 9     | Material · Fluent · Spectrum · SLDS · Ant Design · EUI · Grafana · SmartHR · GitLab                                                                                                                                                                                                                                                                     |
| 2 접두사              | CSS 변수 · 클래스에 접두사 있음                          | 14    | Polaris `--p-` · Carbon `--cds-` · Material `--md-` · Spectrum `--spectrum-` · SLDS `--slds-` · GOV.UK `govuk-` · Bootstrap v5 `--bs-` · Mantine `--mantine-` · Chakra `--chakra-` · SEED `--seed-` · GitLab `--gl-` · Atlassian `--ds-` · Nord `--n-` · Gestalt(층 접두사 `--sema-` · `--comp-`)                                                       |
|                       | CSS 변수에 접두사 없음                                   | 6     | Primer · Fluent · Codex · Radix · shadcn/ui · Open Props                                                                                                                                                                                                                                                                                                |
|                       | CSS 변수가 아닌 JS · Sass 이름(해당 없음 또는 미확인)    | 8     | USWDS · Ant Design · Base Web · Paste · EUI · Grafana · Orbit · SmartHR                                                                                                                                                                                                                                                                                 |
| 2 상태 표기           | 이름 끝에 상태                                           | 12    | Primer · Polaris · Carbon · Fluent · Spectrum · Codex · Ant Design · Mantine · Orbit · SEED · GitLab · Atlassian                                                                                                                                                                                                                                        |
|                       | 이름 앞 · 가운데에 상태                                  | 3     | Material · Bootstrap v5 · Gestalt                                                                                                                                                                                                                                                                                                                       |
|                       | 이름에 상태 없음(선택자 · 변형으로)                      | 4     | Radix · shadcn/ui · Chakra · SmartHR                                                                                                                                                                                                                                                                                                                    |
|                       | 미확인                                                   | 9     | SLDS · GOV.UK · USWDS · Open Props · Base Web · Paste · EUI · Grafana · Nord                                                                                                                                                                                                                                                                            |
| 2 크기 표기           | 번호 눈금                                                | 9     | Polaris · Carbon · Spectrum · Radix · Open Props · Gestalt · SEED · Atlassian · Fluent(글자 `Base300`)                                                                                                                                                                                                                                                  |
|                       | 낱말(xs–xl · small–large)                                | 9     | Primer · Material · SLDS · Bootstrap · Mantine · Chakra · shadcn/ui · EUI · Nord                                                                                                                                                                                                                                                                        |
|                       | 미확인                                                   | 10    | 나머지                                                                                                                                                                                                                                                                                                                                                  |
| 3 토큰 파일           | 층 폴더(파일) → 종류별                                   | 11    | Primer · Material · Fluent · SLDS · Gestalt · Paste · Orbit · GitLab · Base Web · Chakra · Ant Design                                                                                                                                                                                                                                                   |
|                       | 종류별 파일(층 폴더 없음)                                | 12    | Polaris · Carbon · GOV.UK · USWDS · Radix · Open Props · Spectrum · EUI · Grafana · SEED · SmartHR · Bootstrap(v6 알파, v5 는 한 파일)                                                                                                                                                                                                                  |
|                       | 층별 파일 3개                                            | 1     | Codex                                                                                                                                                                                                                                                                                                                                                   |
|                       | 한 파일                                                  | 2     | shadcn/ui · Mantine                                                                                                                                                                                                                                                                                                                                     |
|                       | 테마별 파일                                              | 2     | Atlassian · Nord                                                                                                                                                                                                                                                                                                                                        |
| 4 부품 스타일         | 부품 코드 옆 CSS(부품마다 파일)                          | 9     | Primer React · Polaris · Material · Mantine · GOV.UK · GitLab · Codex(SFC 안) · Gestalt(한 폴더) · Radix(한 폴더)                                                                                                                                                                                                                                       |
|                       | 가운데 스타일 폴더 · 패키지에 부품마다 파일(코드와 분리) | 6     | Carbon · Spectrum · SLDS · USWDS · Bootstrap · SEED                                                                                                                                                                                                                                                                                                     |
|                       | CSS 파일 없음 — 부품 옆 CSS-in-JS                        | 6     | Fluent · Ant Design · Base Web · EUI · Grafana · Paste                                                                                                                                                                                                                                                                                                  |
|                       | CSS 파일 없음 — 가운데 recipe 폴더                       | 1     | Chakra                                                                                                                                                                                                                                                                                                                                                  |
|                       | CSS 파일 없음 — 부품 안 Tailwind 클래스                  | 3     | shadcn/ui · Orbit · SmartHR                                                                                                                                                                                                                                                                                                                             |
|                       | 묶음(forms · navigation…) 파일이 주된 방식               | 0     | (일부만: primer/css 옛 Sass · Bootstrap `forms/` `buttons/` · Open Props `extra/`)                                                                                                                                                                                                                                                                      |
|                       | 해당 없음 · 미확인                                       | 3     | Open Props(부품 거의 없음) · Atlassian · Nord                                                                                                                                                                                                                                                                                                           |
| 5 글자 스타일         | 조합을 토큰 · 테마 객체에                                | 9     | Primer · Polaris · Fluent · Ant Design · Mantine · Base Web · Grafana · Orbit · Atlassian                                                                                                                                                                                                                                                               |
|                       | 토큰은 낱값, 조합은 따로 클래스 · 믹스인 · 전용 파일     | 15    | Carbon · Material · Spectrum · SLDS · Codex · GOV.UK · USWDS · Radix · Bootstrap · Chakra · Gestalt · EUI · SEED · GitLab · Nord                                                                                                                                                                                                                        |
|                       | 조합 없음(부품 · 유틸리티에서 바로)                      | 3     | shadcn/ui · Open Props · Paste                                                                                                                                                                                                                                                                                                                          |
|                       | 미확인                                                   | 1     | SmartHR                                                                                                                                                                                                                                                                                                                                                 |
|                       | 토큰 파일 안에 글자 클래스를 같이 둠                     | 0     | —                                                                                                                                                                                                                                                                                                                                                       |
| 6 캐스케이드          | 자체 `@layer` 순서 선언                                  | 3     | Bootstrap v6 알파(11층) · Chakra(reset, base, tokens, recipes) · Nord(theme, base, components, utilities)                                                                                                                                                                                                                                               |
|                       | Tailwind 층에 얹음                                       | 2     | shadcn/ui · SmartHR                                                                                                                                                                                                                                                                                                                                     |
|                       | 층 판을 선택 사항으로 따로 배포                          | 3     | Mantine(`@layer mantine`) · SEED(`seed-base` · `seed-components`) · Ant Design(설정)                                                                                                                                                                                                                                                                    |
|                       | 부품 내부에서만 `@layer`                                 | 1     | Material(`styles, hcm`)                                                                                                                                                                                                                                                                                                                                 |
|                       | 도입 결정 문서 단계                                      | 1     | Primer React(`primer.base, theme, icons, components, utilities`)                                                                                                                                                                                                                                                                                        |
|                       | `@layer` 없이 import 순서 · `:where()` · 변수            | 11    | Polaris · Carbon · Spectrum · SLDS · Codex · GOV.UK · USWDS · Radix · Open Props · Gestalt · GitLab                                                                                                                                                                                                                                                     |
|                       | CSS-in-JS 삽입 순서 또는 미확인                          | 7     | Fluent · Base Web · Paste · EUI · Grafana · Orbit · Atlassian                                                                                                                                                                                                                                                                                           |
| 7 부품 범위 값        | 부품 파일 · 부품 폴더에                                  | 14    | Polaris · Carbon · Spectrum · SLDS · GOV.UK · Radix · Open Props · Bootstrap · Ant Design · Mantine · Fluent · Chakra · Paste · SmartHR                                                                                                                                                                                                                 |
|                       | 전역 토큰 원본(부품 층 · 전역 파일)에                    | 12    | Primer · Material · Codex · USWDS · shadcn/ui · Base Web · Gestalt · EUI · Grafana · Orbit · SEED · GitLab                                                                                                                                                                                                                                              |
|                       | 미확인                                                   | 2     | Atlassian · Nord                                                                                                                                                                                                                                                                                                                                        |
| 8 접근성 · 움직임     | 각 부품 파일에(모은 파일 없음)                           | 9     | Primer · Polaris · Material · Fluent · Spectrum · GOV.UK · USWDS · Radix · Gestalt                                                                                                                                                                                                                                                                      |
|                       | 믹스인 · 조건 이름은 한 곳, 쓰는 것은 각 부품            | 7     | Carbon · Bootstrap · Chakra · EUI · Grafana · Open Props · SmartHR                                                                                                                                                                                                                                                                                      |
|                       | 전역 파일에 규칙을 모음                                  | 4     | Mantine(`global.css`) · SLDS(kinetics 파일) · SEED(`base.css`) · Nord(`nord.css`)                                                                                                                                                                                                                                                                       |
|                       | 미확인 · 규칙 못 찾음                                    | 8     | Codex · shadcn/ui · Ant Design · Base Web · Paste · Orbit · GitLab · Atlassian                                                                                                                                                                                                                                                                          |
|                       | (겹침) 고대비를 테마 · 색 파일로 따로 둠                 | 6     | Primer · Polaris · Fluent · EUI · Atlassian · Nord                                                                                                                                                                                                                                                                                                      |
| 9 폐기 관리           | 토큰 자료에 deprecated 필드 · 표시                       | 8     | Primer · Spectrum · Codex · Paste · Orbit · SEED · GitLab · Atlassian                                                                                                                                                                                                                                                                                   |
|                       | 코드 주석 · JSDoc `@deprecated`                          | 5     | Carbon · Ant Design · Base Web · EUI · Grafana                                                                                                                                                                                                                                                                                                          |
|                       | Sass 믹스인 · 경고 · 폐기 파일                           | 4     | SLDS · GOV.UK · USWDS · Bootstrap                                                                                                                                                                                                                                                                                                                       |
|                       | 검사 도구만 확인                                         | 2     | Polaris · Gestalt                                                                                                                                                                                                                                                                                                                                       |
|                       | 미확인                                                   | 9     | Material · Fluent · Radix · shadcn/ui · Open Props · Mantine · Chakra · SmartHR · Nord                                                                                                                                                                                                                                                                  |
|                       | (겹침) stylelint · ESLint · 코드모드 확인                | 7     | Primer · Polaris · Carbon · Spectrum · Gestalt · GitLab · Atlassian                                                                                                                                                                                                                                                                                     |
|                       | (겹침) 폐기 · 옛 판을 전용 폴더 · 파일로 격리            | 7     | Primer(`removed.json`) · Carbon · SLDS · GOV.UK · USWDS · Orbit · GitLab                                                                                                                                                                                                                                                                                |
|                       | (겹침) 지울 판을 적음                                    | 3     | SLDS(`deprecate('4.0.0', …)`) · GOV.UK(다음 메이저) · SEED(4.0.0)                                                                                                                                                                                                                                                                                       |
| 10 유틸리티 층        | 자체 유틸리티 클래스 층                                  | 9     | Primer(primer/css) · SLDS · GOV.UK · USWDS · Radix · Bootstrap · EUI · Grafana · Open Props(선택)                                                                                                                                                                                                                                                       |
|                       | Tailwind 유틸리티                                        | 5     | shadcn/ui · Orbit · SmartHR · GitLab · Nord                                                                                                                                                                                                                                                                                                             |
|                       | 없음(부품 props · 믹스인으로)                            | 12    | Polaris · Carbon · Material · Fluent · Spectrum · Codex · Ant Design · Mantine · Chakra · Base Web · Gestalt · Paste                                                                                                                                                                                                                                    |
|                       | 미확인                                                   | 2     | SEED · Atlassian                                                                                                                                                                                                                                                                                                                                        |
| 11 쓰는 서비스        | 공식 문서 · 저장소에서 확인                              | 19    | Primer(GitHub) · Polaris(Shopify admin) · Carbon(IBM) · Fluent(Microsoft 365 · Office · Edge) · Spectrum(Adobe) · SLDS(Salesforce) · Codex(Wikimedia) · GOV.UK · USWDS(미 연방 사이트) · Base Web(Uber) · Gestalt(Pinterest) · Paste(Twilio · SendGrid) · EUI(Elastic · Kibana) · Grafana · Orbit(Kiwi.com) · SEED(당근) · SmartHR · GitLab · Atlassian |
|                       | 미확인                                                   | 9     | Material · Radix · shadcn/ui · Open Props · Bootstrap · Ant Design · Mantine · Chakra · Nord                                                                                                                                                                                                                                                            |

#### 방법론 문서 (분모 7, 따로 셈)

| 주제              | 방식                                  | 문서 수 | 문서                                                                                                                                                                                     |
| ----------------- | ------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 토큰 층           | 3단을 명시                            | 1       | Brad Frost(brand → application → component, 부품 변수는 부품 partial 에)                                                                                                                 |
|                   | 층을 규정하지 않음(구조 자유)         | 2       | DTCG(그룹은 임의) · Style Dictionary(CTI 는 필수 아님)                                                                                                                                   |
|                   | 다루지 않음                           | 4       | MDN · Tailwind · CUBE · ITCSS                                                                                                                                                            |
| 캐스케이드 순서   | 순서 있는 층을 명시                   | 3       | ITCSS(Settings → Tools → Generic → Elements → Objects → Components → Utilities) · Tailwind(`theme, base, components, utilities`) · MDN(`@layer` 규칙: 뒤 층 우선, 층 밖 스타일이 최우선) |
|                   | 역할 묶음만 정의(파일 순서 규정 없음) | 1       | CUBE(Composition · Utility · Block · Exception)                                                                                                                                          |
|                   | 다루지 않음                           | 3       | DTCG · Style Dictionary · Brad Frost                                                                                                                                                     |
| 유틸리티가 마지막 | 명시                                  | 2       | ITCSS · Tailwind                                                                                                                                                                         |
| 부품마다 파일     | 명시                                  | 2       | ITCSS(부품마다 파일) · Brad Frost(부품 partial)                                                                                                                                          |
| 토큰 파일 나누기  | 자유 · 병합                           | 1       | Style Dictionary                                                                                                                                                                         |
|                   | 테마 변수를 별도 CSS 파일로           | 1       | Tailwind                                                                                                                                                                                 |
|                   | 규정 없음 · 다루지 않음               | 5       | DTCG · MDN · CUBE · ITCSS · Brad Frost                                                                                                                                                   |
| 글자 조합         | 조합 토큰 형식 있음                   | 1       | DTCG(`typography` 조합형)                                                                                                                                                                |
|                   | 크기 + 줄 높이 짝 변수                | 1       | Tailwind(`--text-sm--line-height`)                                                                                                                                                       |
|                   | 다루지 않음                           | 5       | 나머지                                                                                                                                                                                   |
| 폐기 표시         | 형식에 있음                           | 1       | DTCG(`$deprecated`: true · 문자열 · false)                                                                                                                                               |
|                   | 내장 아님(직접 넣음)                  | 1       | Style Dictionary                                                                                                                                                                         |
|                   | 다루지 않음                           | 5       | 나머지                                                                                                                                                                                   |
| 미확인            | 열지 못함                             | 1       | Nathan Curtis(HTTP 403) — 분모 밖                                                                                                                                                        |

## 실제 서비스 — 운영 사이트 43곳 · 공개 소스 20곳

확인한 사람: 조사 에이전트. 운영 사이트 10곳(GitHub · GitLab · Lichess · osu! · 당근 · velog · Mastodon · Linear · Wikipedia · DEV)은 원자료 JSON 의 변수 수 · `@layer` 수 · 안 읽는 변수 수를 집계와 대조했고, 공개 소스는 GitLab `framework/` 58개 · osu-web `resources/css/bem` · Zulip `tools/find-unused-css` 를 다시 열었다. 막혀서 세지 않은 곳은 X(HTTP 403) · Stack Overflow(Cloudflare 확인 벽)다.

확인 날짜 2026-11-11. 디자인 시스템 문서가 아니라 운영 중인 제품을 본 기록이다. 추천은 쓰지 않고 본 사실만 적는다.

- 갈래 A(운영 사이트 실측): 연 곳 45 · 확인 43 · 막힘 2. 원자료 `~/noslog-research/2026-11-11-foundation-structure/a/<id>.json`, 캡처는 이 폴더의 `shots/<id>.png`.
- 갈래 B(공개 소스): 확인 20. 원자료 `~/noslog-research/2026-11-11-foundation-structure/b/<owner>_<repo>.tree.json`(GitHub git/trees 응답).
- 합계 63곳. 두 갈래에 모두 있는 서비스 11곳(GitLab · Mastodon · Lichess · osu! · DEV/Forem · Wikipedia/Vector · Cal.com · Supabase · PostHog · Sentry · velog)을 한 번만 세면 52곳.

### 갈래 A 재는 법과 한계

- headless Playwright chromium, `colorScheme: 'dark'`, 1440×900, 로그인 없이 공개 쪽 한 장. 폼 · 버튼은 누르지 않았다. 스크립트는 이 폴더의 `measure.mjs`, 기록 생성은 `gen.cjs`.
- `document.styleSheets` · `adoptedStyleSheets` · shadow root 의 시트를 모으고, 교차 출처라 규칙을 못 읽는 시트는 같은 주소를 받아 글로 읽었다(받기 실패 0건).
- 「숫자 단계 · 역할 · 부품 이름」 개수는 변수 이름을 정규식으로 가른 수다. 숫자 단계 = 색 낱말 + 끝 숫자(`--gray-500`), 부품 = 이름에 button · header · modal · card … 가 든 것, 역할 = 그 밖에 bg · text · border · primary … 가 든 것. 이름만 본 분류라 틀린 것이 섞인다.
- 「안 읽는 변수」 는 그 쪽 한 장이 받은 CSS 안에서 `var(--이름)` 으로 한 번도 읽히지 않은 선언 수다. 다른 쪽 CSS · JS · 인라인 style 에서 읽는 것은 안 잡힌다.
- 클래스 방식은 DOM 의 class 쓰임을 자동 분류한 수와 예를 눈으로 보고 정했다. 자동 분류 수(해시 · 유틸리티 · BEM · 기타)는 참고값이다.
- 소개(마케팅) 쪽만 열린 곳은 곳마다 「한계」 줄에 적었다. 로그인 뒤 제품 화면은 보지 않았다.

### 갈래 A — 운영 사이트 실측

#### GitHub (A 실측)

- URL https://github.com/facebook/react → https://github.com/react/react · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/github.json
- 1 변수: 2403개. 접두사 brand 786 · display 285 · base 212 · label 145 · control 71 · button 68 · color 64 · prettylights 42. 예 `--ansi-cyan` `--display-cyan-scale-4` `--label-blue-bgColor-rest` `--buttonCounter-invisible-bgColor-rest` `--base-duration-0` `--h1-size` `--brand-color-error-muted` `--base-color-scale-blue-7` `--brand-Label-color-purple-red-start` `--brand-CarouselPagination-arrowButton-inactive-fgColor`
- 2 층: 숫자 단계 이름 360개(`--contribution-default-bgColor-0` `--contribution-default-bgColor-1` `--contribution-default-bgColor-2`) · 역할 이름 965개(`--bgColor-success-emphasis` `--control-checked-bgColor-active` `--control-checked-bgColor-hover`) · 부품 이름 749개(`--button-outline-bgColor-active` `--button-primary-bgColor-active` `--button-primary-bgColor-disabled`). 역할 → 숫자 단계 var() 109개: `--brand-color-success-fg: var(--base-color-scale-green-6)` · `--brand-color-success-emphasis: var(--base-color-scale-green-5)`
- 3 다크 전환: `[data-color-mode="auto|dark|light"]` + html `data-light-theme` · `data-dark-theme` + `prefers-color-scheme` 115회
- 4 @layer: 14회. `@layer primer-css-base, primer-react, primer-brand-legacy, primer-brand, recipes;` `@layer primer-css-base {}` `@layer primer-react {}` `@layer primer.components.IssueLabel {}` `@layer primer-brand {}`
- 5 안 읽는 변수: 712/2403개(예 `--buttonCounter-outline-fgColor-rest` `--contribution-default-bgColor-0` `--contribution-default-bgColor-1`)
- 6 클래스: 섞임 — CSS Modules 해시(`prc-*-CPva9` · `Primer_Brand__*___B2ueX`) + 공용(`octicon-`) + 유틸리티. 자동 분류 쓰임 수 해시 703 · 유틸리티 308 · BEM 345 · 기타 1210. 예 `octicon` `Primer_Brand__Text-module__Text--100___B2ueX` `heading-element` `Primer_Brand__Button-module__Button--label___qrkyz` `octicon-repo-forked` `octicon-alert` `prc-TopicTag-TopicTagGroup-CPva9` `header-wrapper` `featuredFirst__OqdLZv` `bottomBorder__38-D2c`
- 7 스타일시트: 31개(link 28 · style 2 · adopted 0 · shadow 1). `assets/light-0011b1fed09cb294.css` `assets/light_high_contrast-267ab2e12d3b7ade.css` `assets/dark-37b5e41810563d82.css` `assets/dark_high_contrast-d69295870cb5f203.css` `assets/primer-primitives-bd624c4ec96b42e9.css` `assets/primer-2aeb1babdc762f70.css` …

#### GitLab (A 실측)

- URL https://gitlab.com/gitlab-org/gitlab · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/gitlab.json
- 1 변수: 1433개. 접두사 gl 1134 · data 55 · tw 47 · ci 20 · gray 14 · t 13 · blue 12 · purple 12. 예 `--performance-bar-height` `--gl-color-data-blue-200` `--gl-spacing-scale-8` `--brand-orange-01` `--gl-badge-warning-text-color-active` `--gl-nav-item-selected-background-color-default` `--gl-feedback-info-background-color` `--gl-badge-muted-background-color-hover` `--gl-action-strong-neutral-foreground-color-hover` `--gl-button-confirm-tertiary-border-color-hover`
- 2 층: 숫자 단계 이름 240개(`--user-contribution-graph-cell-level-0` `--user-contribution-graph-cell-level-1` `--user-contribution-graph-cell-level-2`) · 역할 이름 281개(`--application-bar-right` `--ci-icon-success-background-color` `--ci-icon-success-text-color`) · 부품 이름 472개(`--performance-bar-height` `--system-header-height` `--header-height`). 역할 → 숫자 단계 var() 146개: `--ci-icon-success-background-color: var(--gl-color-green-100)` · `--ci-icon-success-text-color: var(--gl-color-green-700)`
- 3 다크 전환: html `class="… gl-dark"` · `.dark`(242회) · `.gl-dark`(177회)
- 4 @layer: 0회
- 5 안 읽는 변수: 358/1433개(예 `--blue` `--indigo` `--purple`)
- 6 클래스: 유틸리티 — 접두사 붙은 유틸리티 `gl-*` + 화면 클래스(`tree-*`). 자동 분류 쓰임 수 해시 234 · 유틸리티 400 · BEM 173 · 기타 4790. 예 `gl-relative` `tree-commit` `gl-m-0` `stat-link` `project-stat-value` `gl-outline-none` `container-fluid` `commit-row-message` `active:gl-focus` `super-sidebar-animatable`
- 7 스타일시트: 28개(link 16 · style 12 · adopted 0 · shadow 0). `assets/application-fd318e83c7d10bddae915b384e4fa8024e64a0108443c6ec466` `assets/application_dark-fb6b9becbf9a9a8c7c973dd4f774106100accf2bd967ae` `page_bundles/project-eb5d70e8f994133b3e1289ba1dd825fc58c4fe02d917a77ee` `page_bundles/tree-58b76d142272822cde4bef9294ffe19796450435314131d59d38` `page_bundles/commit_description-9e7efe20f0cef17d0606edabfad0418e9eb224` `page_bundles/projects-43c5a8fe926047b35e16e4e41c17452653e7cf4bab584020` …

#### Linear (A 실측)

- URL https://linear.app/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/linear.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 740개. 접두사 sx 163 · color 59 · tweet 41 · title 37 · editor 25 · font 24 · text 24 · ease 18. 예 `--edge-glow-tint` `--gridlines-left` `--agent-card-border` `--svh` `--title-6-letter-spacing` `--color-bg-level-3` `--sx-1gm0lru` `--sx-1hz3utq` `--changelog-line-width` `--h1-line-height`
- 2 층: 숫자 단계 이름 53개(`--layer-3` `--layer-2` `--layer-1`) · 역할 이름 137개(`--icon-replacement-color` `--kbd-bg` `--kbd-text`) · 부품 이름 94개(`--button-corner-radius` `--button-height` `--button-icon-size`). 역할 → 숫자 단계 var() 3개: `--editor-surface-background: var(--sx-1ubxoo9)` · `--normal-border: var(--gray4)`
- 3 다크 전환: html `data-theme="dark"` · `[data-theme="light"]`(30회)
- 4 @layer: 89회. `@layer reset, base, app.base;` `@layer reset, base, app.base, web.reset, web.fonts, web.base;` `@layer web.utils {}` `@layer reset, base, app.base, web.reset, web.fonts;` `@layer web.base {}` `@layer web.utils;`
- 5 안 읽는 변수: 248/740개(예 `--description` `--transition-duration` `--moreHitArea-size`)
- 6 클래스: 해시 — CSS Modules(`fFDhtq_dot`) + `sx-*`. 자동 분류 쓰임 수 해시 1461 · 유틸리티 152 · BEM 0 · 기타 3143. 예 `fFDhtq_dot` `_5k-xcq_titleText` `sx-87ps6o` `sx-1iffjtl` `sx-19mdvtv` `lmPTvT` `S36ykG_size-large` `new` `grid-dot-1-1-upDown` `grid-dot-4-3-pong`
- 7 스타일시트: 68개(link 64 · style 3 · adopted 1 · shadow 0). `css/Tpxbzi3N.css` `css/2AMbo6gs.css` `css/pcGZUK31.css` `css/Du1RuT2M.css` `css/DM5BVKTu.css` `css/Bl8l9ltc.css` …

#### Vercel (A 실측)

- URL https://vercel.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/vercel.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 256개. 접두사 tw 107 · animate 39 · text 34 · color 21 · font 10 · container 9 · tracking 6 · spacing 5. 예 `--value` `--tw-gradient-via` `--tw-numeric-fraction` `--tw-drop-shadow` `--tw-enter-translate-x` `--color-zinc-900` `--text-3xl` `--leading-relaxed` `--color-background-100` `--animate-slide-in`
- 2 층: 숫자 단계 이름 18개(`--color-red-50` `--color-yellow-500` `--color-indigo-600`) · 역할 이름 47개(`--tw-border-spacing-x` `--tw-border-spacing-y` `--tw-border-style`) · 부품 이름 5개(`--animate-accordion-down` `--animate-accordion-up` `--animate-fadeInTooltip`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--animate-fadeOutPopover: fadeOut var(--ds-motion-popover-timing) var(--ds-motion-popover-duration)`)
- 3 다크 전환: `.dark-theme`(771회) · `[data-theme="dark"]`(61회)
- 4 @layer: 8회. `@layer {}` `@layer properties {}` `@layer theme {}` `@layer base {}` `@layer components {}` `@layer utilities {}`
- 5 안 읽는 변수: 17/256개(예 `--tw-scale-z` `--tw-font-weight` `--tw-tracking`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 5 · 유틸리티 6005 · BEM 0 · 기타 298. 예 `flex` `group-hover:underline` `disabled:![--themed-border:_var(--ds-gray-400)]` `[--x-padding:14px]` `group-focus-visible:!text-gray-1000` `dark-theme:before:bg-[oklch(from_var(--ds-gray-200)_0.27_c_h)]` `after:transition-colors` `peer-focus-visible:shadow-[var(--ds-focus-ring)]` `ease-linear` `data-[scrolled]:bg-background-200`
- 7 스타일시트: 5개(link 3 · style 2 · adopted 0 · shadow 0). `chunks/2faepiyu01509.css` `chunks/2m6ryhmuamlt5.css` `chunks/3u82rwmj_1n8p.css`

#### Stripe Docs (A 실측)

- URL https://docs.stripe.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/stripe-docs.json
- 1 변수: 1718개. 접두사 s 721 · sail 336 · jybopzu 213 · xy 37 · code 4 · safe 4 · content 3 · z 3. 예 `--sail-color-black-rgb` `--sail-color-purple-700` `--filename-scrollbar-height` `--jybopzu-color-info800` `--mkuc60` `--u7pgeo` `--s-1pxcz58` `--s-1rsg6td` `--lqlo87` `--s-16ewvzx`
- 2 층: 숫자 단계 이름 273개(`--sail-color-gray-50` `--sail-color-gray-100` `--sail-color-gray-200`) · 역할 이름 164개(`--sail-color-background` `--sail-color-background-white` `--sail-color-background-gray`) · 부품 이름 34개(`--sail-color-text-selected` `--sail-modal-gutter` `--sail-modal-gutter-mobile`). 역할 → 숫자 단계 var() 27개: `--sail-color-background-gray: var(--sail-color-gray-500)` · `--sail-color-background-blue: var(--sail-color-blue-500)`
- 3 다크 전환: 정규식에 잡힌 선택자 없음
- 4 @layer: 0회
- 5 안 읽는 변수: 746/1718개(예 `--sail-color-gray-0-rgb` `--sail-color-gray-150-rgb` `--sail-color-gray-950-rgb`)
- 6 클래스: 섞임 — 원자 `as-48` + 부품 이름(`KeyValueRow` · `Margin-left--12`). 자동 분류 쓰임 수 해시 42 · 유틸리티 0 · BEM 320 · 기타 2897. 예 `⚙` `KeyValueRow` `as-48` `as-7f` `Heading` `as-23` `List` `Margin-left--12` `Sidebar--hidden` `⚙9qvec7`
- 7 스타일시트: 13개(link 3 · style 10 · adopted 0 · shadow 0). `assets/sail.205757ec34a2cc4626b9.css` `assets/docs.d5f771f440c9f78dc941.css` `assets/frontend.3211cb7d03488d7385c2.css`

#### Notion (A 실측)

- URL https://www.notion.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/notion.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 1864개. 접두사 tatami 1038 · typography 207 · box 55 · scroll 45 · hero 39 · logo 29 · graphic 17 · pachinko 16. 예 `--direction` `--tatami-color-campaigns-agents-launch-yellow` `--tatami-z-index-header` `--tatami-typography-mono-900-bold-font` `--typography-global-quote-font-feature-settings-computed` `--tatami-color-background-surface-accent-muted-active` `--tatami-typography-card-title-feature-font-feature-settings` `--graphic-border-radius-xl` `--entity-noticon-size` `--logo-wall-marquee-speed-per-item`
- 2 층: 숫자 단계 이름 124개(`--tatami-color-gray-100` `--tatami-color-gray-200` `--tatami-color-gray-300`) · 역할 이름 316개(`--tatami-border-radius-0` `--tatami-border-radius-200` `--tatami-border-radius-300`) · 부품 이름 508개(`--tatami-color-campaigns-dev-platform-dos-blue` `--tatami-color-campaigns-dev-platform-dos-black` `--tatami-color-campaigns-dev-platform-dos-neon`). 역할 → 숫자 단계 var() 67개: `--tatami-border-width-1: var(--tatami-dimension-thickness-1)` · `--link-underline-offset: var(--em-ratio-0-1)`
- 3 다크 전환: 층 이름 `dark` · `palette-dark`(`@layer base, dark, palette, palette-dark`) + `prefers-color-scheme` 1회
- 4 @layer: 92회. `@layer properties;` `@layer front-tokens {}` `@layer base, dark, palette, palette-dark;` `@layer normalize {}` `@layer tw-base, base-components, markdown-renderer, nds-tokens, front-ui-normalize;` `@layer front-ui-utilities {}`
- 5 안 읽는 변수: 309/1864개(예 `--tatami-dimension-offset-0` `--tatami-font-family-emoji` `--tatami-font-line-height-450`)
- 6 클래스: 해시 — CSS Modules(`Db2fhq_semanticTypography`). 자동 분류 쓰임 수 해시 32 · 유틸리티 160 · BEM 0 · 기타 1430. 예 `Db2fhq_semanticTypography` `_7Hu80a_icon` `items-center` `xvimDq_bentoImagePicture` `_6FCNga_theme` `XB4X_a_cardLogo` `XtHI1q_accentIllustration` `HWB10a_links` `KlQGRG_heroGrid` `t-AqdW_media`
- 7 스타일시트: 26개(link 22 · style 2 · adopted 0 · shadow 2). `chunks/3q5tuzywmw2_f.css` `chunks/111vb9k015u3c.css` `chunks/3en3k_71-lppn.css` `chunks/23eku4f__kjxs.css` `chunks/2wswy-iv3_tb4.css` `chunks/2hjqisdqxolmw.css` …

#### Figma (A 실측)

- URL https://www.figma.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/figma.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음 · 쿠키 배너가 뜬 채로 잼(누르지 않음).
- 1 변수: 131개. 접두사 fig 91 · f 20 · global 9 · slide 6 · font 2 · seat 2 · media 1. 예 `--font-figma-sans` `--f-gutter` `--fig-typography-lh-normal` `--fig-typography-variation-wght-bolder` `--fig-typography-size-button` `--fig-space-40` `--fig-elevation-1` `--fig-theme-btn-primary-fg` `--fig-theme-border-hover` `--slide-cols-6`
- 2 층: 숫자 단계 이름 8개(`--fig-animation-180` `--fig-animation-250` `--fig-animation-400`) · 역할 이름 26개(`--global-cursor-text` `--f-max-content-width` `--fig-grid-max-content-width`) · 부품 이름 35개(`--global-statsig-overlay` `--global-scrollbar-width` `--fig-typography-size-button`). 역할 → 숫자 단계 var() 0개
- 3 다크 전환: `[data-theme="dark"]` 2회
- 4 @layer: 0회
- 5 안 읽는 변수: 38/131개(예 `--global-statsig-overlay` `--global-cursor-grab` `--global-cursor-grabbing`)
- 6 클래스: 해시 — `fig-1czkxn0`. 자동 분류 쓰임 수 해시 813 · 유틸리티 0 · BEM 0 · 기타 221. 예 `fig-1czkxn0` `fig-1siyav2` `fig-ducv57` `fig-1gg9t03` `fig-mo7tmb` `fig-1ryue9u` `fig-1id9bz1` `fig-1djhndo` `fig-zv2znl` `fig-1fdm5cd`
- 7 스타일시트: 15개(link 1 · style 4 · adopted 0 · shadow 10). `css/617e0bc399c83bea.css`

#### Discord (A 실측)

- URL https://discord.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/discord.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 4412개. 접두사 opacity 550 · yellow 253 · red 253 · orange 253 · green 253 · blue 252 · teal 252 · blurple 201. 예 `--w-backdrop-animation` `--illo-yellow-10-hsl` `--control-overlay-secondary-icon-active` `--neutral-35-hsl` `--blurple-56` `--red-new-76-hsl` `--yellow-new-97` `--opacity-64-hsl` `--opacity-white-48` `--brand-860-hsl`
- 2 층: 숫자 단계 이름 1285개(`--pinc-2` `--bg-animated-gradient-background-indigo-1` `--bg-animated-gradient-background-indigo-2`) · 역할 이름 647개(`--application-subscription-end` `--application-subscription-end-hsl` `--application-subscription-start`) · 부품 이름 507개(`--dark-button-hover` `--button-hover` `--navy-blue`). 역할 → 숫자 단계 var() 196개: `--app-frame-background: color-mix(in oklab,var(--neutral-78) 100%,var(--custom-theme-base-color,#000) va` · `--background-accent: color-mix(in oklab,var(--primary-530) 100%,var(--custom-theme-base-color,#000) v`
- 3 다크 전환: 마케팅 쪽에서 전환 선택자 못 봄(`.new-dark-button` 같은 구역 클래스만)
- 4 @layer: 0회
- 5 안 읽는 변수: 2138/4412개(예 `--always-white` `--mobile-nav-radius` `--application-subscription-end`)
- 6 클래스: 낱말 — Webflow 클래스(`w-nav-brand` · `is-hero`), 마케팅 쪽. 자동 분류 쓰임 수 해시 46 · 유틸리티 270 · BEM 59 · 기타 1148. 예 `is_2025` `nav_dd_list` `image-robot` `w-nav-brand` `p-footer` `w-mod-ix` `is-blog` `is-hero` `buttonWhite-1M-wED` `div-block-witch`
- 7 스타일시트: 21개(link 2 · style 19 · adopted 0 · shadow 0). `css/discord-2022.shared.68e478347.min.css` `3a756378428a770f27e63b63edc9fd6cc02fda3a/styles.css`

#### Slack (A 실측)

- URL https://slack.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/slack.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 20개. 접두사 mask 5 · font 3 · swiper 3 · article 2 · sidebar 2 · bck 1 · scrollbar 1 · attachment 1. 예 `--article-theme-primary` `--font-family-heading` `--font-family-monospace` `--scrollbar-width` `--mask-image-content` `--mask-image-scrollbar` `--sidebar-color` `--attachment-color` `--swiper-theme-color` `--swiper-navigation-size`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 4개(`--article-theme-primary` `--article-theme-secondary` `--mask-image-content`) · 부품 이름 7개(`--scrollbar-width` `--mask-image-scrollbar` `--mask-size-scrollbar`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--mask-size-scrollbar: var(--scrollbar-width) 100%`)
- 3 다크 전환: 전환 선택자 못 봄(구역 클래스 `.t-dark-bg` 만)
- 4 @layer: 0회
- 5 안 읽는 변수: 2/20개(예 `--article-theme-secondary` `--swiper-preloader-color`)
- 6 클래스: 접두사 · BEM — `c-nav-2026__leaf-item` · `s-card-copy`. 자동 분류 쓰임 수 해시 236 · 유틸리티 7 · BEM 1144 · 기타 855. 예 `c-nav-2026__leaf-item` `s-card-copy` `c-nav-2026__card` `c-nav-2026__body` `swiper-wrapper` `c-accordion-carousel__content` `c-locale-new-menu__col` `c-video-control` `c-skip-link` `c-nav__back`
- 7 스타일시트: 9개(link 8 · style 1 · adopted 0 · shadow 0). `bv1-13-br/rollup-style-spacesuit.a029c2f45963c328.min.css` `bv1-13-br/rollup-style-product-uis-custom.4c221f0db7ec90f6.min.css` `bv1-13-br/marketing-style-page-index-2025.0897b391f4f793e3.min.css` `bv1-13-br/legacy-style-libs-swiper.5fac27f383e63eb5.min.css` `bv1-13-br/marketing-style-page-expanded-nav-es.b2ec11f2ef46e0d1.min.cs` `bv1-13-br/marketing-style-component-bento-box-sticky-toc.bec013b00d3d7` …

#### Spotify (A 실측)

- URL https://open.spotify.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/spotify.json
- 1 변수: 342개. 접두사 encore 137 · os 31 · shelf 12 · background 10 · text 8 · context 7 · essential 7 · carousel 7. 예 `--left-sidebar-width` `--os-track-border-radius` `--cinema-media-distance-from-top` `--essential-subdued` `--encore-graphic-size-informative-base` `--encore-short-2` `--animation-ease` `--encore-text-size` `--radial-color-to` `--carousel-shelf-min-items`
- 2 층: 숫자 단계 이름 6개(`--encore-shortest-1` `--encore-shortest-2` `--encore-shortest-3`) · 역할 이름 93개(`--content-spacing` `--content-max-width` `--background-noise`) · 부품 이름 90개(`--left-sidebar-width` `--left-sidebar-grid-area-z-index` `--onboarding-search-grid-area-z-index`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--onboarding-search-grid-area-z-index: calc(var(--above-everything-grid-area-z-index) + 1)`)
- 3 다크 전환: html `class="encore-dark-theme …"`
- 4 @layer: 4회. `@layer {}` `@layer reset {}` `@layer fonts {}` `@layer encore {}`
- 5 안 읽는 변수: 26/342개(예 `--cinema-mode-right-sidebar-open` `--__workaround_property__` `--tracklist-compact-mode`)
- 6 클래스: 섞임 — 공용 `e-*` · `encore-*` + 해시(`tUMQUAjcqP9HiKrGGsPD`). 자동 분류 쓰임 수 해시 45 · 유틸리티 20 · BEM 893 · 기타 3704. 예 `e-101040-text` `tUMQUAjcqP9HiKrGGsPD` `I367wl7ObtnECqhgsNVA` `os-scrollbar` `e-101040-legacy-list-row` `links-group` `e-101040-button-tertiary--small` `fullscreen` `wk0RNS94VA7q0Pp4Y55Z` `HE9YEs5kM8WqAv4MjJi0`
- 7 스타일시트: 21개(link 16 · style 5 · adopted 0 · shadow 0). `web-player/web-player.7848a69e.css` `web-player/dwp-feedback-bar.12de9935.css` `web-player/xpui-routes-your-library-x.b46ae7b3.css` `web-player/6222.35186845.css` `web-player/dwp-now-playing-bar.df0127f7.css` `web-player/dwp-top-bar.13366b41.css` …

#### Twitch (A 실측)

- URL https://www.twitch.tv/directory · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/twitch.json
- 1 변수: 1013개. 접두사 color 782 · space 28 · shadow 21 · gradient 18 · font 17 · button 17 · input 16 · border 15. 예 `--border-width-default` `--color-twitch-purple-8` `--color-yellow-8` `--font-weight-semibold` `--color-text-link-visited` `--color-background-button-overlay-primary-active` `--color-text-interactable-overlay-selected` `--color-background-button-icon-primary-active` `--color-border-alert` `--color-social-reddit`
- 2 층: 숫자 단계 이름 225개(`--color-twitch-purple-1` `--color-twitch-purple-2` `--color-twitch-purple-3`) · 역할 이름 212개(`--border-width-default` `--border-width-drop-zone` `--border-width-marked`) · 부품 이름 412개(`--border-width-button` `--border-width-checkbox` `--border-width-selectable`). 역할 → 숫자 단계 var() 123개: `--color-deprecated-brand-muted-ice: var(--color-blue-14)` · `--color-deprecated-brand-muted-cupcake: var(--color-magenta-12)`
- 3 다크 전환: `.tw-root--theme-dark` · `.tw-root--theme-light`
- 4 @layer: 0회
- 5 안 읽는 변수: 699/1013개(예 `--border-width-button` `--border-width-checkbox` `--border-width-drop-zone`)
- 6 클래스: 해시 — styled-components(`Layout-sc-1xcs6mc-0` · `jVFDMB`) + `tw-*`. 자동 분류 쓰임 수 해시 1860 · 유틸리티 4 · BEM 216 · 기타 2297. 예 `Layout-sc-1xcs6mc-0` `game-card` `jVFDMB` `dUHnPJ` `bEULQi` `fPdFux` `iEOZEd` `feRHcJ` `eVbqsX` `top-nav__search-container`
- 7 스타일시트: 11개(link 10 · style 1 · adopted 0 · shadow 0). `assets/pages.browse.components.browse-root-page-66bc8bc9902244cb4d41.c` `assets/pages.browse.components.browse-directory-1cd5cadfb66235d9bca7.c` `assets/features.consent.components.cmp-api-d8d2c950d7843b0e3e4b.css` `assets/features.dmca-strike-banner-78fb4ea7d850e210d96c.css` `assets/features.verify-email-585bdce47055613e2daf.css` `assets/features.auth.components.account-checkup-manager-74e822828d4689` …

#### YouTube (A 실측)

- URL https://www.youtube.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/youtube.json
- 1 변수: 1871개. 접두사 yt 1074 · ytd 253 · paper 141 · ytw 87 · premium 11 · iron 11 · live 10 · card 8. 예 `--t3a480c2f814ef19c` `--ytd-rich-grid-shelf-margin` `--yt-live-chat-new-moderator-color` `--yt-button-padding` `--ytd-margin-25x` `--yt-sys-typography-typestack--display-s-default--font-size` `--yt-ref-typography-values--action-xs-size` `--yt-sys-color-baseline--outline` `--yt-sys-color-baseline--overlay-filled-state-layer` `--ytd-notice-renderer-content-margin`
- 2 층: 숫자 단계 이름 119개(`--tc5e0863356bf5767` `--td340014d093b0821` `--tf8c80baf678711b8`) · 역할 이름 362개(`--yt-attributed-string-link-hover-color` `--premium-yt-spec-base-background` `--premium-yt-spec-raised-background`) · 부품 이름 586개(`--tab8059236063cadb` `--ytd-rich-grid-items-per-row` `--ytd-rich-grid-slim-items-per-row`). 역할 → 숫자 단계 var() 15개: `--premium-yt-spec-base-background: var(--t3e41d7b17b187f69)` · `--premium-yt-spec-raised-background: var(--t518e925f61bdcb91)`
- 3 다크 전환: 정규식에 잡힌 선택자 없음
- 4 @layer: 0회
- 5 안 읽는 변수: 793/1871개(예 `--t3a480c2f814ef19c` `--t77e217518bcd986b` `--tc5e0863356bf5767`)
- 6 클래스: 접두사 · BEM — 커스텀 엘리먼트 이름(`style-scope ytd-*` · `ytp-*`). 자동 분류 쓰임 수 해시 12 · 유틸리티 42 · BEM 0 · 기타 2232. 예 `style-scope` `video-skeleton` `ytd-channel-legal-info-renderer` `ytd-refresh` `js-httpswwwyoutubecomsdesktopa2c91c03jsbinschedulervflsetschedulerjs` `contribYtLightShapeStaticWashLight` `ytp-exp-ppp-update` `ytp-unmute-shrink` `ytp-paid-content-overlay-icon` `ytp-featured-product-affiliate-disclaimer-when-promotion-text-enabled`
- 7 스타일시트: 17개(link 8 · style 9 · adopted 0 · shadow 0). `/css2` `cssbin/www-main-desktop-home-page-skeleton.css` `cssbin/www-onepick.css` `br=1/rs=AGKMywFbHZQy2Q6SYsS0oBRJQkE0JmdfPQ` `/css` `a5c2aafe/www-player.css` …

#### Reddit (A 실측)

- URL https://www.reddit.com/r/programming/ → https://www.reddit.com/r/programming/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/reddit.json
- 1 변수: 791개. 접두사 color 388 · font 112 · tw 54 · button 25 · size 17 · spacer 16 · shreddit 15 · line 12. 예 `--bottom-sheet-expanded-height` `--rem11` `--font-button-xs-kerning` `--color-button-tertiary-text-activated` `--font-title-3-weight` `--color-downvote-plain-disabled` `--color-neutral-content-disabled` `--color-tags-neutral-background` `--color-tooltip-bg-primary` `--page-y-padding`
- 2 층: 숫자 단계 이름 39개(`--rem360` `--rem320` `--rem192`) · 역할 이름 229개(`--color-secondary-background` `--hover-curve` `--unhover-curve`) · 부품 이름 272개(`--color-input-secondary` `--color-input-secondary-hover` `--color-input-plain`). 역할 → 숫자 단계 var() 3개: `--color-ui-canvas: var(--color-tone-5)` · `--color-divider-default: var(--color-tone-5)`
- 3 다크 전환: html `class="theme-beta theme-dark"` + `prefers-color-scheme` 7회
- 4 @layer: 0회
- 5 안 읽는 변수: 206/791개(예 `--bottom-sheet-max-width` `--color-input-plain` `--subreddit-header-title-display`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 6 · 유틸리티 15243 · BEM 198 · 기타 3618. 예 `flex` `a` `hovercard-body` `rounded-2` `group-[:not(:defined)]/dropdown:hidden` `grid-cols-[1fr_min-content]` `w-[20px]` `min-w-[28px]` `me-xs` `hover:bg-secondary-background-hover`
- 7 스타일시트: 78개(link 10 · style 25 · adopted 0 · shadow 43). `shreddit/styles-css-V1-bk7ZH.css` `gsi/style` `shreddit/hui-grid-client-css-DatJbO4p.css` `shreddit/subreddit-right-rail-client-css-2LPEa8Al.css` `shreddit/credit-bar-client-css-DZBV42vI.css` `shreddit/action-bar-client-css-Bux5jrvN.css` …

#### X (A 실측)

- URL https://x.com/github · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/x.json
- 막힘: HTTP 403, 빈 쪽. 세지 않음.

#### Bluesky (A 실측)

- URL https://bsky.app/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/bluesky.json
- 1 변수: 54개. 접두사 toast 9 · rc 6 · normal 5 · success 3 · info 3 · warning 3 · error 3 · lift 2. 예 `--text` `--rc-drag-handle-bg-colour` `--toast-icon-margin-end` `--toast-close-button-start` `--gray3` `--gray8` `--border-radius` `--normal-bg` `--success-text` `--warning-border`
- 2 층: 숫자 단계 이름 12개(`--gray1` `--gray2` `--gray3`) · 역할 이름 24개(`--text` `--background` `--backgroundLight`) · 부품 이름 9개(`--toast-icon-margin-start` `--toast-icon-margin-end` `--toast-svg-margin-start`). 역할 → 숫자 단계 var() 2개: `--normal-border: var(--gray4)` · `--normal-text: var(--gray12)`
- 3 다크 전환: `.theme--dark` · html `class="theme--dim"`
- 4 @layer: 0회
- 5 안 읽는 변수: 5/54개(예 `--gray6` `--gray7` `--gray8`)
- 6 클래스: 해시 — react-native-web 의 `css-*` · `r-*`. 자동 분류 쓰임 수 해시 4841 · 유틸리티 0 · BEM 1 · 기타 0. 예 `css-g5y9jx` `css-146c3p1` `r-1udh08x` `r-dnmrzs` `r-1hfyk0a` `r-1m04atk` `r-8akbws` `r-u8s1d` `r-zchlnj` `r-ipm5af`
- 7 스타일시트: 10개(link 2 · style 8 · adopted 0 · shadow 0). `css/style-94e56ab66ad45dc782a29deac0731bdb.css` `css/ReactCrop-718bc6539c6403aeb01b0d6a1cd7748f.css`

#### Mastodon(mastodon.social) (A 실측)

- URL https://mastodon.social/explore · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/mastodon.json
- 1 변수: 316개. 접두사 color 158 · space 13 · fs 10 · base 10 · border 7 · account 7 · radius 6 · link 6. 예 `--color-white` `--color-lime-700` `--color-cyan-500` `--border-thin` `--fs-20` `--color-text-inverted` `--color-bg-brand-softest` `--color-graph-warning-fill` `--account-name-color` `--bg-hover-opacity`
- 2 층: 숫자 단계 이름 91개(`--color-grey-50` `--color-grey-100` `--color-grey-200`) · 역할 이름 106개(`--border-thin` `--border-default` `--border-thick`) · 부품 이름 24개(`--border-input` `--overlay-strength-secondary` `--color-bg-overlay`). 역할 → 숫자 단계 var() 22개: `--base-color-bg: var(--color-indigo-900)` · `--base-color-bg-desktop: var(--color-indigo-950)`
- 3 다크 전환: `[data-color-scheme="dark"]` · html `data-contrast="default"`
- 4 @layer: 0회
- 5 안 읽는 변수: 38/316개(예 `--color-grey-50` `--color-grey-500` `--color-grey-800`)
- 6 클래스: 접두사 · BEM — BEM(`account__avatar`) + CSS Modules(`_comp_button__md`). 자동 분류 쓰임 수 해시 2 · 유틸리티 7 · BEM 219 · 기타 70. 예 `focusable` `sr-only` `account__avatar` `_comp_button__md` `_comp_status_header__accountWrapper` `_comp_status__contentWrapper` `custom-scrollbars` `_comp_skip_links_skip_links__listItem` `_navigation_panel_redesign_header__serverName` `_comp_lockup__wrapper`
- 7 스타일시트: 26개(link 26 · style 0 · adopted 0 · shadow 0). `themes/default-D9FslCOX.css` `assets/inert-1no54Nn4.css` `css/custom-e3b0c442.css` `assets/ImmutablePropTypes-DUdjGJjy.css` `assets/handled_link-CEY116X9.css` `assets/redesign-D0nJgNAt.css` …

#### Lichess (A 실측)

- URL https://lichess.org/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/lichess.json
- 1 변수: 130개. 접두사 c 100 · (없음) 28 · lightningcss 2. 예 `---site-hue` `--c-bg-variation` `--c-metal-bottom` `--c-fancy` `--c-over` `--c-warn` `--c-brilliant` `--c-patron-8` `---block-gap` `---cols`
- 2 층: 숫자 단계 이름 10개(`--c-patron-1` `--c-patron-2` `--c-patron-3`) · 역할 이름 42개(`--c-bg` `--c-bg-box` `--c-bg-high`) · 부품 이름 10개(`--c-page-input` `--c-bg-header-dropdown` `--c-bg-input`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--c-page-input: var(--c-bg)`)
- 3 다크 전환: html `class="dark"` · `.light`(62회)
- 4 @layer: 0회
- 5 안 읽는 변수: 38/130개(예 `--c-page-input` `--c-bg-mid` `--c-bg-variation`)
- 6 클래스: 낱말 — 낱말 + BEM(`daily-feed__update`). 자동 분류 쓰임 수 해시 11 · 유틸리티 0 · BEM 149 · 기타 335. 예 `white` `ublog-post-card--link` `daily-feed__update` `lobby__support-link` `name` `little` `coords-in` `site-icon` `button-empty` `lobby__spotlights`
- 7 스타일시트: 5개(link 3 · style 2 · adopted 0 · shadow 0). `css/lib.theme.all.bbb92c50.css` `css/site.ca64f37f.css` `css/lobby.bd3aa567.css`

#### Chess.com (A 실측)

- URL https://www.chess.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/chesscom.json
- 1 변수: 860개. 접두사 color 378 · theme 175 · cc 66 · motion 29 · fallback 16 · space 11 · icon 9 · app 9. 예 `--linkBoxShadow` `--min-height` `--color-gold-75` `--color-red-400` `--color-text-default` `--color-classification-brilliant` `--icon-40` `--globalColorNeutral50` `--theme-sound-set-id` `--theme-sound-set-wav-premove`
- 2 층: 숫자 단계 이름 192개(`--cc-square-position-1` `--cc-square-position-2` `--color-aqua-25`) · 역할 이름 236개(`--linkBoxShadow` `--linkHoverBackground` `--cc-bg-color`) · 부품 이름 116개(`--cc-button-secondary-enabled-start` `--cc-button-secondary-enabled-end` `--cc-button-secondary-hovered-start`). 역할 → 숫자 단계 var() 149개: `--cc-bg-color: linear-gradient(180deg, var(--color-green-300) 0%, var(--color-green-400) 100%)` · `--cc-bg-color-hover: linear-gradient(180deg, color-mix(in srgb, var(--color-green-200), transparent 5`
- 3 다크 전환: `.dark-mode`(152회) · html `data-color-mode="dark"`
- 4 @layer: 0회
- 5 안 읽는 변수: 374/860개(예 `--chip-color-bg` `--cc-loader-border-color` `--color-aqua-75`)
- 6 클래스: 접두사 · BEM — `cc-` 공용 + 화면 이름 클래스(`landing-` · `sidebar-`). 자동 분류 쓰임 수 해시 52 · 유틸리티 0 · BEM 0 · 기타 686. 예 `cc-icon-size-24` `sidebar-link-text` `navigation-footer-platform-component` `landing-page-feature-inner-wrapper` `cc-button-one-line` `cc-user-block-default` `landing-page-content-card-meta-date` `sidebar-auth-icon` `cc-button-xx-large` `base-layout`
- 7 스타일시트: 26개(link 25 · style 1 · adopted 0 · shadow 0). `vite/design-system-global-styles.Dr6NI9cW8v.css` `vite/main-global-styles.DDRjgUiMEQ.css` `2026.11.5/navigation-logged-out-global-styles.HBnLJ7dK8H.css` `2026.11.5/shared.DO_T7DKtPD.css` `2026.11.5/navigation-logged-out.css` `vite/global-global-styles.D10t7xPVfa.css` …

#### osu! (A 실측)

- URL https://osu.ppy.sh/rankings/osu/performance → https://osu.ppy.sh/rankings/osu/global/performance · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/osu.json
- 1 변수: 455개. 접두사 hsl 54 · bg 51 · beatmapset 22 · colour 15 · input 11 · avatar 11 · label 10 · forum 8. 예 `--bg-default-0` `--level-tier-iron` `--row-background-color` `--menu-bg` `--label-display` `--input-border-base-colour` `--outer-gutter` `--options-bg` `--gap-inner` `--hsl-b5`
- 2 층: 숫자 단계 이름 55개(`--bg-default-0` `--bg-default-1` `--bg-default-2`) · 역할 이름 128개(`--font-content` `--beatmapset-graveyard-bg-hsl` `--beatmapset-wip-bg-hsl`) · 부품 이름 91개(`--navbar-height` `--z-index--nav-bar-mobile` `--header-pinned-animation-duration`). 역할 → 숫자 단계 var() 33개: `--beatmapset-wip-bg-hsl: var(--hsl-darkorange-1)` · `--beatmapset-pending-bg-hsl: var(--hsl-orange-1)`
- 3 다크 전환: 전환 선택자 0(다크 한 벌)
- 4 @layer: 0회
- 5 안 읽는 변수: 75/455개(예 `--bg-default-1` `--bg-default-2` `--bg-default-3`)
- 6 클래스: 접두사 · BEM — BEM(`ranking-page-table__column`) + `u-*` · `js-*`. 자동 분류 쓰임 수 해시 73 · 유틸리티 734 · BEM 1928 · 기타 944. 예 `ranking-page-table__column` `nav2-locale-item` `header-nav-mobile__item` `fa-fw` `js-user-link` `game-mode` `t-section` `avatar--full-rounded` `js-nav-button--item` `js-login-form`
- 7 스타일시트: 2개(link 1 · style 1 · adopted 0 · shadow 0). `css/app.c28c04fe.css`

#### Steam Community (A 실측)

- URL https://steamcommunity.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/steam.json
- 1 변수: 656개. 접두사 color 448 · heading 27 · gpBackground 14 · gpColor 11 · text 11 · spacing 10 · line 10 · letter 10. 예 `--gpSystemLightestGrey` `--gpShadow-Large` `--color-mauve-5` `--color-tomato-10` `--color-purple-3` `--color-cyan-8` `--color-brown-1` `--color-lime-6` `--color-text-yellow-title` `--letter-spacing-5`
- 2 층: 숫자 단계 이름 410개(`--GradientColor1` `--GradientColor2` `--color-greyneutral-1`) · 역할 이름 83개(`--gpGradient-StoreBackground` `--gpGradient-LibraryBackground` `--gpBackground-LightSofter`) · 부품 이름 14개(`--gpNavWidth` `--gpPaymentsNavWidth` `--gpDselectWidth`). 역할 → 숫자 단계 var() 12개: `--background: var(--color-accent-8)` · `--hover-background: var(--color-accent-10)`
- 3 다크 전환: 전환 선택자 못 봄(다크 한 벌)
- 4 @layer: 2회. `@layer reset {}`
- 5 안 읽는 변수: 99/656개(예 `--gpSystemLightestGrey` `--gpSystemLighterGrey` `--gpSystemLightGrey`)
- 6 클래스: 낱말 — 밑줄 낱말(`apphub_CardRatingButtons`). 자동 분류 쓰임 수 해시 23 · 유틸리티 0 · BEM 0 · 기타 1404. 예 `ellipsis` `reward_btn_icon` `submenuitem` `apphub_CardRatingButtons` `appHubShortcut_Title` `gradient` `btn_green_white_innerfade` `shadow_content` `with_header` `responsive_header`
- 7 스타일시트: 18개(link 18 · style 0 · adopted 0 · shadow 0). `css/motiva_sans.css` `css/buttons.css` `css/shared_global.css` `css/globalv2.css` `css/apphub.css` `skin_1/modalContent.css` …

#### Atlassian (A 실측)

- URL https://www.atlassian.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/atlassian.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 606개. 접두사 ds 492 · local 21 · cm 8 · icon 6 · tag 5 · gc 5 · border 4 · checkbox 4. 예 `--atlassian-recommended-system-fonts` `--local-background-checked-hover` `--ds-background-accent-lime-subtlest` `--ds-background-accent-teal-subtlest` `--ds-background-disabled` `--ds-background-discovery-hovered` `--ds-text-accent-red-bolder` `--ds-interaction-hovered` `--ds-chart-teal-boldest-hovered` `--ds-surface-pressed`
- 2 층: 숫자 단계 이름 8개(`--ds-chart-categorical-1` `--ds-chart-categorical-2` `--ds-chart-categorical-3`) · 역할 이름 422개(`--bxp-charlie-text-font-family` `--content-columns` `--ds-elevation-surface-current`) · 부품 이름 61개(`--badge-background-color` `--badge-background-color-pressed` `--tag-border-token`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--badge-background-color-pressed: var(--ds-background-discovery-pressed, #e3bdfa)`)
- 3 다크 전환: `[data-color-mode="dark"]` · html `data-theme="dark:dark light:light …"`
- 4 @layer: 0회
- 5 안 읽는 변수: 133/606개(예 `--local-border-focus` `--webkit-appearance` `--thumb-bg`)
- 6 클래스: 해시 — 원자 해시 `_1e0c1txw`. 자동 분류 쓰임 수 해시 26228 · 유틸리티 23 · BEM 1 · 기타 1004. 예 `_1e0c1txw` `_y4ti1q91` `_1libidpf` `_exxm1wqb` `_o5721q9c` `_4him1rov` `_1pwoz4z1` `_xtwz4jg8` `_1hr21178` `_wpaiqslr`
- 7 스타일시트: 11개(link 4 · style 7 · adopted 0 · shadow 0). `v6/atlassian-fonts.css` `assets/atlaskit-tokens_light.css` `assets/atlaskit-tokens_spacing.css` `assets/atlaskit-tokens_typography.css`

#### Shopify (A 실측)

- URL https://www.shopify.com/ → https://www.shopify.com/kr · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/shopify.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 367개. 접두사 text 99 · color 80 · tw 67 · font 27 · uc 9 · space 9 · spacing 8 · line 8. 예 `--cc-spin` `--tw-ring-shadow` `--color-yellow-500` `--leading-relaxed` `--line-height-t3` `--color-component-header-level1-border` `--text-t8--font-weight` `--animate-mc-spin` `--breakpoint-lg` `--color-component-button-secondary-border-active`
- 2 층: 숫자 단계 이름 18개(`--color-orange-500` `--color-yellow-500` `--color-green-500`) · 역할 이름 119개(`--tw-border-style` `--tw-outline-style` `--tw-content`) · 부품 이름 58개(`--header-height` `--color-component-header-level1-border` `--text-button-size`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--color-component-header-level1-border: var(--color-shade-200)`)
- 3 다크 전환: `[data-mode="dark"]`(24회)
- 4 @layer: 6회. `@layer properties {}` `@layer theme {}` `@layer base {}` `@layer components {}` `@layer utilities {}`
- 5 안 읽는 변수: 90/367개(예 `--tw-translate-z` `--tw-scale-z` `--tw-gradient-via`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 56 · 유틸리티 7393 · BEM 4 · 기타 290. 예 `flex` `focus-visible:outline` `tracking-[calc(0.28*var(--uc-unit-text))]` `lg:basis-full` `before:h-1.5` `max-lg:opacity-0` `sm:row-start-[span_2]` `left-full` `grid-rows-[1fr]` `lg:gap-x-1`
- 7 스타일시트: 2개(link 0 · style 2 · adopted 0 · shadow 0).

#### Airbnb (A 실측)

- URL https://www.airbnb.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/airbnb.json
- 1 변수: 2277개. 접두사 palette 720 · dls 128 · edge 112 · typography 104 · card 76 · motion 58 · gallery 44 · elevation 42. 예 `--amplify-colors-brand-primary-10` `--material-backgrounds-thin-backdrop-filter` `--palette-text-on-banner-action` `--typography-special-display-medium_48_54-letter-spacing` `--icon_size` `--photo-tour-header-padding-inline` `--screen_overscroll-behavior` `--action-header_padding-inline` `--search-feed_max-width` `--palette-border-secondary-outline-pressed-dark`
- 2 층: 숫자 단계 이름 141개(`--amplify-colors-brand-primary-10` `--amplify-colors-brand-primary-20` `--amplify-colors-brand-primary-40`) · 역할 이름 828개(`--amplify-colors-background-primary` `--amplify-colors-background-secondary` `--amplify-colors-font-primary`) · 부품 이름 635개(`--amplify-components-button-primary-background-color` `--amplify-components-button-primary-hover-background-color` `--amplify-components-button-primary-focus-background-color`). 역할 → 숫자 단계 var() 13개: `--dls-textarea-placeholder-color: var(--palette-grey500)` · `--pricing-guest-secondary-line-color: var(--palette-grey700)`
- 3 다크 전환: `[data-color-scheme="dark"]`
- 4 @layer: 0회
- 5 안 읽는 변수: 386/2277개(예 `--amplify-colors-brand-primary-10` `--amplify-colors-brand-primary-20` `--amplify-colors-brand-primary-40`)
- 6 클래스: 해시 — 원자 해시 `atm_*`. 자동 분류 쓰임 수 해시 19791 · 유틸리티 0 · BEM 97 · 기타 5256. 예 `dir` `atm_c8_18p4cis` `atm_26_zp0x24_csw3t1` `atm_e2_eeehkc` `atm_tk_1ssbidh_vmtskl` `atm_f3_idpfg4_vmtskl` `t9b3cd8` `atm_jr_1h6ojuz` `atm_mj_1bomifl` `atm_2d_9yka83_1rqz0hn`
- 7 스타일시트: 7개(link 1 · style 6 · adopted 0 · shadow 0). `entrypoints/client.513cac778e.css`

#### Booking.com (A 실측)

- URL https://www.booking.com/ → https://www.booking.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/booking.json
- 한계: HTTP 202 뒤 본문이 뜸.
- 1 변수: 388개. 접두사 bui 346 · shell 7 · vip 4 · search 4 · padding 2 · content 2 · web 2 · image 2. 예 `--bui_mixin_position` `--bui_button_large_margin_block_start` `--bui_grid_column_offset` `--bui-tab-end-mask-offset` `--bui_color_highlighted_alt` `--bui_color_accent_background_dynamic` `--bui_color_brand_genius_primary_background` `--bui_animation_appear_duration` `--bui_font_strong_2_font-size` `--bui_font_headline_3_font-weight`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 120개(`--bui_action_bar_container_background` `--bui_action_bar_container_border_block_start` `--bui_action_bar_container_before_content`) · 부품 이름 59개(`--bui_accordion_--vertical-spacing` `--bui_button_inline_padding_extra` `--loading-label-display`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--bui_accordion_--vertical-spacing: calc(var(--bui_accordion_spaced_--vertical-spacing--s) * var(--bui_spacing_1x))`)
- 3 다크 전환: `[data-bui-theme=traveller-dark]`
- 4 @layer: 0회
- 5 안 읽는 변수: 37/388개(예 `--bui_sheet_container_radius` `--bui_sheet_container_radius_rtl` `--bui_z_index_above_sheet_container`)
- 6 클래스: 해시 — `f6e3a11b0d` 꼴 + 일부 `Header_root--variant-*`. 자동 분류 쓰임 수 해시 11 · 유틸리티 0 · BEM 134 · 기타 8729. 예 `f6e3a11b0d` `d8df6227ee` `shell__stack-item` `TravellerFooter_inline-links-list-item` `a02f80a493` `ebb06f44e2` `acb3638563` `fab9d44163` `b96c49a28c` `ed9ccd0229`
- 7 스타일시트: 40개(link 38 · style 2 · adopted 0 · shadow 0). `css/client.af8eaa37.css` `css/b65e71e5.b92866d6.chunk.css` `css/12888182.428e2156.chunk.css` `css/ba07265b.a6efccda.chunk.css` `css/31b24ea7.7433a648.chunk.css` `css/95c8ee1c.ced06587.chunk.css` …

#### Medium (A 실측)

- URL https://medium.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/medium.json
- 1 변수: 82개. 접두사 color 77 · reach 2 · invert 1 · blend 1 · verified 1. 예 `--invert-in-dark-mode` `--color-bg-neutral-elevated-inverted` `--color-bg-error-primary-hover` `--color-fg-neutral-secondary` `--color-fg-social-linkedin` `--color-border-accent-primary` `--color-chart-utility-yellow-primary` `--color-status-in-review-background` `--color-story-footer-placeholder-light-grey` `--color-syntax-variable`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 59개(`--color-bg-neutral-primary` `--color-bg-neutral-secondary` `--color-bg-neutral-tertiary`) · 부품 이름 9개(`--color-story-footer-bg-subtle` `--color-story-footer-bg-contrast` `--color-story-footer-fg-subtle`). 역할 → 숫자 단계 var() 0개
- 3 다크 전환: `[data-color-scheme="dark"]` + `light-dark()` 79회
- 4 @layer: 0회
- 5 안 읽는 변수: 59/82개(예 `--invert-in-dark-mode` `--blend-in-dark-mode` `--color-bg-neutral-secondary`)
- 6 클래스: 해시 — 두 글자 원자(`be` · `bo`). 자동 분류 쓰임 수 해시 0 · 유틸리티 0 · BEM 0 · 기타 713. 예 `be` `bo` `f` `ca` `cn` `cy` `am` `ab` `an` `dc`
- 7 스타일시트: 15개(link 1 · style 14 · adopted 0 · shadow 0). `css/unbound.css`

#### DEV(dev.to) (A 실측)

- URL https://dev.to/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/devto.json
- 1 변수: 507개. 접두사 button 30 · brand 24 · btn 23 · accent 18 · link 15 · reaction 13 · base 13 · modal 13. 예 `--gif-bg` `--bg-inverted-hover` `--radius-2xl` `--grey-700` `--base-80` `--button-primary-bg-hover` `--tag-onboarding-bg` `--link-branded-color-hover` `--selected-range-color` `--text-color`
- 2 층: 숫자 단계 이름 64개(`--grey-50` `--grey-100` `--grey-200`) · 역할 이름 163개(`--gif-bg` `--bg` `--bg-hover`) · 부품 이름 168개(`--gif-btn-z-index` `--preview-header` `--preview-form`). 역할 → 숫자 단계 var() 60개: `--accent-brand-lighter-rgb: var(--indigo-500)` · `--accent-brand-rgb: var(--indigo-600)`
- 3 다크 전환: `.dark-theme`(48회) + `prefers-color-scheme` 2회
- 4 @layer: 0회
- 5 안 읽는 변수: 66/507개(예 `--depth-dots` `--radius-3xl` `--opacity-25`)
- 6 클래스: 접두사 · BEM — `crayons-*` BEM + 유틸리티(`fs-xs` · `ml-auto`). 자동 분류 쓰임 수 해시 26 · 유틸리티 728 · BEM 1045 · 기타 1079. 예 `crayons-btn` `fs-xs` `m:hidden` `-ml-1` `crayons-story__details` `crayons-avatar--l` `subscription-icon` `B` `ml-auto` `footer__nav-links`
- 7 스타일시트: 12개(link 6 · style 6 · adopted 0 · shadow 0). `assets/minimal-7159cf3bbf06a194ecd4289552407874be2a6ab3d6d0218346363b7` `assets/views-f0fe4fb47d419abc949a43abed35604ea7ac9f258085b0368e4841033` `assets/crayons-08ce12ab8de9d434694954ab91d00f01cfec7749cb4753f53208a49`

#### Stack Overflow (A 실측)

- URL https://stackoverflow.com/questions · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/stackoverflow.json
- 막힘: HTTP 403, Cloudflare 「Performing security verification」 벽. 세지 않음.

#### Wikipedia (A 실측)

- URL https://en.wikipedia.org/wiki/CSS · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/wikipedia.json
- 1 변수: 213개. 접두사 color 62 · background 56 · border 45 · box 10 · opacity 6 · image 4 · pointer 3 · cite 2. 예 `--cite-backlink-separator` `--color-progressive--focus` `--color-icon-progressive` `--box-shadow-color-inverted` `--background-color-progressive--focus` `--background-color-content-removed` `--opacity-icon-base--selected` `--border-color-destructive--focus` `--border-color-divider` `--border-color-input-binary--focus`
- 2 층: 숫자 단계 이름 5개(`--y1` `--y2` `--y3`) · 역할 이름 153개(`--cite-backlink-separator` `--color-base--hover` `--color-neutral`) · 부품 이름 16개(`--filter-invert-primary-button-icon` `--box-shadow-color-progressive-selected` `--box-shadow-color-progressive-selected--hover`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--border-color-input--hover: var(--border-color-interactive)`)
- 3 다크 전환: `.skin-theme-clientpref-night`(167회) + `prefers-color-scheme` 20회
- 4 @layer: 0회
- 5 안 읽는 변수: 84/213개(예 `--inline-controls-bar-height` `--color-error--active` `--color-warning`)
- 6 클래스: 접두사 · BEM — `mw-*` · `vector-*` · `cdx-button--size-large`. 자동 분류 쓰임 수 해시 213 · 유틸리티 0 · BEM 181 · 기타 4718. 예 `p` `nd` `vector-toc-level-1` `mw-collapsible-toggle-default` `autocollapse` `cdx-search-input__end-button` `cdx-button--size-large` `mw-header` `vector-main-menu-container` `interwiki-de`
- 7 스타일시트: 25개(link 2 · style 23 · adopted 0 · shadow 0). `w/load.php`

#### 네이버 (A 실측)

- URL https://www.naver.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/naver.json
- 1 변수: 1605개. 접두사 core 882 · color 413 · typography 71 · sizes 57 · layout 48 · spacing 38 · atcp 21 · preset 15. 예 `--atcp-sys-color-0` `--color-primary-stroke-default` `--color-extended-effect-gradation-thumbnail-2` `--core-color-light-orange-red-500` `--core-color-light-pale-navy-900` `--core-color-dark-yellow-green-800` `--core-color-dark-pale-teal-1200` `--core-color-gradation-violet-2` `--core-elevation-offset-y-0` `--typography-line-height-detail-x-small`
- 2 층: 숫자 단계 이름 850개(`--atcp-sys-color-0` `--atcp-sys-color-100` `--atcp-sys-color-200`) · 역할 이름 258개(`--atcp-sys-color-bg-elevatedSurface` `--atcp-sys-color-bg-surface` `--atcp-sys-color-bg-background`) · 부품 이름 51개(`--atcp-sys-color-searchGreen` `--sizes-tablet` `--sizes-breakpoint-tablet`). 역할 → 숫자 단계 var() 153개: `--color-neutral-background-default: var(--core-color-light-gray-0)` · `--color-neutral-background-disabled: var(--core-color-alpha-black-4)`
- 3 다크 전환: `[data-theme=greenDark]`(388회) · `[data-dark=true]`(73회)
- 4 @layer: 0회
- 5 안 읽는 변수: 1097/1605개(예 `--atcp-sys-color-0` `--atcp-sys-color-100` `--atcp-sys-color-bg-elevatedSurface`)
- 6 클래스: 낱말 — 밑줄 낱말(`kwd_dsc`) + CSS Modules 일부. 자동 분류 쓰임 수 해시 288 · 유틸리티 0 · BEM 209 · 기타 369. 예 `blind` `opt_item` `common_em` `kwd_dsc` `HighlightedColumnView-module__tag_ad___IFSkX` `top_inner` `type_motion_n` `kwd_none` `_alert_passage` `type_blog`
- 7 스타일시트: 2개(link 2 · style 0 · adopted 0 · shadow 0). `css/sp_autocomplete_261015.css` `css/main.4ea4a5b1.css`

#### 토스 (A 실측)

- URL https://toss.im/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/toss.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 409개. 접두사 pc 257 · (없음) 103 · f185tr8 1 · f185tr9 1 · kniz28d 1 · o21g3c0 1 · o21g3c1 1 · o21g3cc 1. 예 `--pc-component-height-16` `--pc-component-height-18_font-size-10_vertical-padding` `--pc-component-height-22_button-round-regular-horizontal-padding` `--pc-component-height-32_wide-horizontal-padding` `--pc-component-height-34_button-square-regular-horizontal-padding` `--pc-component-height-48_icon-square-narrow-horizontal-padding` `--pc-font-size-19_line-height` `--_17qxf1d5` `--o21g3c0` `--_8dn640a`
- 2 층: 숫자 단계 이름 62개(`--_1wpyqd31` `--_1wpyqd30` `--_1wpyqd32`) · 역할 이름 86개(`--pc-component-height-16_border-radius` `--pc-component-height-16_icon-square-narrow-horizontal-padding` `--pc-component-height-16_icon-square-regular-horizontal-padding`) · 부품 이름 62개(`--pc-component-height-16_button-round-narrow-horizontal-padding` `--pc-component-height-16_button-round-regular-horizontal-padding` `--pc-component-height-16_button-square-narrow-horizontal-padding`). 역할 → 숫자 단계 var() 0개
- 3 다크 전환: 부품 단위 `[data-tds-desktop-button-mode=dark]`
- 4 @layer: 4회. `@layer pieveg0;` `@layer pieveg0 {}` `@layer fpwrvz0;` `@layer fpwrvz0 {}`
- 5 안 읽는 변수: 205/409개(예 `--pc-component-height-16_narrow-horizontal-padding` `--pc-component-height-16_regular-horizontal-padding` `--pc-component-height-16_wide-horizontal-padding`)
- 6 클래스: 해시 — `_1wyxn1o`. 자동 분류 쓰임 수 해시 119 · 유틸리티 0 · BEM 0 · 기타 10. 예 `_1wyxn1o` `hero-word` `hero-line` `__variable_ce03bb` `_1wyxn15` `_1wyxn1a` `_1wyxn1q` `_1wyxn1n` `_1dl9ag85` `_1us5cvn8`
- 7 스타일시트: 16개(link 16 · style 0 · adopted 0 · shadow 0). `css/1d35c7dd06268106.css` `css/dc4e45eab00cb7ef.css` `css/8400b256ced96b1d.css` `css/808f86985e0c0117.css` `css/14183d0b7b1fdaff.css` `css/ba1f911792440c0b.css` …

#### 카카오(다음) (A 실측)

- URL https://www.daum.net/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/kakao.json
- 1 변수: 140개. 접두사 bg 59 · text 26 · icon 22 · border 12 · thumb 6 · divider 4 · swiper 3 · indicator 2. 예 `--bg-slot-48` `--bg-story-alpha-16-hovered` `--bg-thumb-1` `--bg-point-red` `--bg-comm-feed` `--text-black-100` `--divider-4` `--border-red-8` `--icon-red` `--popup-shadow`
- 2 층: 숫자 단계 이름 65개(`--bg-slot-48` `--bg-sport-alpha-16` `--bg-sport-alpha-8`) · 역할 이름 60개(`--bg-blue-gray` `--bg-hovered` `--bg-blue-alpha-16-hovered`) · 부품 이름 7개(`--bg-snackbar` `--bg-btn-gray` `--bg-btn-neutral`). 역할 → 숫자 단계 var() 0개
- 3 다크 전환: `[data-darktheme=true]`(131회)
- 4 @layer: 0회
- 5 안 읽는 변수: 59/140개(예 `--bg-surface` `--bg-snackbar` `--bg-on-sheet-FontSize`)
- 6 클래스: 낱말 — 밑줄 낱말(`txt_page` · `info_trendrank`). 자동 분류 쓰임 수 해시 115 · 유틸리티 0 · BEM 0 · 기타 3159. 예 `screen_out` `thumb_cp` `universal-player-container` `txt_page` `swiper-backface-hidden` `info_trendrank` `img_daumlogo` `inner-body` `board_sports` `ico_environment`
- 7 스타일시트: 10개(link 3 · style 7 · adopted 0 · shadow 0). `pretendard/pretendard-dynamic-subset.min.css` `20261104_140008/common.css` `lib/swiper-js.min.css`

#### 당근 (A 실측)

- URL https://www.daangn.com/kr/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/daangn.json
- 1 변수: 887개. 접두사 seed 579 · carotene 234 · (없음) 18 · z 4 · badge 4 · tag 4 · content 3 · side 3. 예 `--tw-content` `--carotene-z-index-modal` `--carotene-color-palette-green-300` `--seed-box-padding-x-sm` `--seed-box-margin-left` `--seed-grid-columns-md` `--seed-line-height-t9` `--seed-color-palette-green-1000` `--seed-color-bg-neutral-weak-pressed` `--seed-exit-translate-y`
- 2 층: 숫자 단계 이름 212개(`--carotene-color-palette-static-black-alpha-500` `--carotene-color-palette-static-white-alpha-200` `--carotene-color-bg-warmth-l1`) · 역할 이름 197개(`--tw-content` `--carotene-border-width-1` `--carotene-timing-function-linear`) · 부품 이름 66개(`--carotene-uniform-height-small` `--carotene-uniform-height-medium` `--carotene-uniform-height-large`). 역할 → 숫자 단계 var() 112개: `--carotene-color-bg-brand-solid-hover: var(--carotene-color-palette-carrot-500)` · `--carotene-color-bg-brand-solid-pressed: var(--carotene-color-palette-carrot-500)`
- 3 다크 전환: `[data-seed-color-mode]` · `[data-carotene-color-mode="dark"]` + `prefers-color-scheme` 11회
- 4 @layer: 0회
- 5 안 읽는 변수: 100/887개(예 `--tw-content` `--carotene-color-palette-static-black` `--carotene-timing-function-linear`)
- 6 클래스: 해시 — `_1wm6syag` 꼴 + 공용 `seed-*`. 자동 분류 쓰임 수 해시 573 · 유틸리티 0 · BEM 510 · 기타 214. 예 `seed-text` `_1wm6syag` `_1grysqkb` `_62nozy5` `_1wm6sya5` `poveor7` `_1th0gui5` `_14zt99l2` `_1d7lpfk2` `seed-text-input__value--variant_outline`
- 7 스타일시트: 3개(link 3 · style 0 · adopted 0 · shadow 0). `_remix/global-DB_WFVbM.css` `_remix/style-D0WW6zXa.css` `v5.17.0/maplibre-gl.css`

#### LINE (A 실측)

- URL https://line.me/ja/ → https://www.line.me/ja/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/line.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 3개. 접두사 swiper 3. 예 `--swiper-theme-color` `--swiper-preloader-color` `--swiper-navigation-size`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 0개 · 부품 이름 1개(`--swiper-navigation-size`). 역할 → 숫자 단계 var() 0개
- 3 다크 전환: 전환 선택자 0
- 4 @layer: 0회
- 5 안 읽는 변수: 0/3개
- 6 클래스: 낱말 — camelCase 낱말(`mainTitle`). 자동 분류 쓰임 수 해시 0 · 유틸리티 1 · BEM 0 · 기타 1047. 예 `image-wrapper` `product` `appStoreIcon` `content` `current` `mvDownloadIcon` `txtArea` `X` `mainTitle` `mvList`
- 7 스타일시트: 2개(link 2 · style 0 · adopted 0 · shadow 0). `css/index.min.css` `swiper@11/swiper-bundle.min.css`

#### Mercari (A 실측)

- URL https://jp.mercari.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/mercari.json
- 1 변수: 751개. 접두사 alias 103 · custom 16 · mer 12 · component 10 · gradient 9 · rc 6 · grid 5 · code 4. 예 `--mer-navigation-top-start-width` `--alias-color-text-link-highlight` `--hfqtkC` `--buNELN` `--fKKEWk` `--cEfBGr` `--gsOSYp` `--jzKrvS` `--eplxeO` `--llHqJT`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 117개(`--mer-z-index-action-sheet` `--alias-color-background-primary-highlight` `--alias-color-background-primary-default`) · 부품 이름 51개(`--mer-navigation-top-start-width` `--mer-z-index-menu` `--mer-z-index-navigation-top`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--custom-button-hover-color: var(--custom-button-color)`)
- 3 다크 전환: `.dark-theme` · `.light-theme` + `prefers-color-scheme` 4회
- 4 @layer: 0회
- 5 안 읽는 변수: 23/751개(예 `--custom-button-disabled-border-color` `--alias-color-background-tertiary-active` `--alias-color-background-accent-active`)
- 6 클래스: 해시 — styled-components(`sc-ba564a51-5` · `dpfntZ`). 자동 분류 쓰임 수 해시 185 · 유틸리티 0 · BEM 0 · 기타 1606. 예 `dpfntZ` `jlRqbR` `sc-ba564a51-5` `MsMCV` `hbXOBg` `diDVEa` `gEytOP` `hzEIZr` `iypQQH` `fWrcDF`
- 7 스타일시트: 6개(link 5 · style 1 · adopted 0 · shadow 0). `css/d44740eb8efb1500.css` `css/6d86842ac1ce029b.css` `css/c8273eb36c7c6153.css` `css/81556e35bb496ce4.css` `css/870c12c8c84a96f2.css`

#### pixiv (A 실측)

- URL https://www.pixiv.net/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/pixiv.json
- 1 변수: 463개. 접두사 charcoal 231 · tailwind 170 · tw 56 · pixiv 3 · columns 1 · novel 1 · street 1. 예 `--columns` `--charcoal-space-16` `--charcoal-color-text-on-primary-default` `--charcoal-color-icon-on-primary-press` `--charcoal-color-container-neutral-press` `--charcoal-text-ellipsis-line-limit` `--tw-backdrop-invert` `--tailwind-color-link2--press` `--tailwind-color-surface8--outline` `--tailwind-gradient-call-to-action-top`
- 2 층: 숫자 단계 이름 24개(`--charcoal-color-border-focus-1` `--charcoal-color-text-press-text1` `--charcoal-color-text-hover-text1`) · 역할 이름 332개(`--charcoal-border-width-m` `--charcoal-border-width-focus-2` `--charcoal-border-width-focus-1`) · 부품 이름 18개(`--charcoal-color-border-selected` `--charcoal-color-background-overlay` `--charcoal-tag-item-color`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--charcoal-color-border-selected: var(--charcoal-brand)`)
- 3 다크 전환: `[data-theme=dark]` + `prefers-color-scheme` 2회
- 4 @layer: 0회
- 5 안 읽는 변수: 288/463개(예 `--novel-thumbnail-columns` `--charcoal-border-width-focus-2` `--charcoal-border-width-focus-1`)
- 6 클래스: 해시 — CSS Modules(`FooterBar_languageItem__Jz_JR`) + styled-components. 자동 분류 쓰임 수 해시 39 · 유틸리티 0 · BEM 40 · 기타 6. 예 `FooterBar_languageItem__Jz_JR` `SignupCard_snsLoginForm__swkcO` `FooterBar_footerContentItem__jJ3OB` `sc-5584a319-0` `iQxypv` `sc-1157f13c-0` `cvSJxs` `BackgroundSlideshow_slide__oNNnJ` `BackgroundSlideshow_userInfo__B_Ap6` `BackgroundSlideshow_illustTitle__Le95u`
- 7 스타일시트: 4개(link 2 · style 2 · adopted 0 · shadow 0). `css/765dec18adbf503f.css` `css/a8c3eb60054e45a9.css`

#### niconico (A 실측)

- URL https://www.nicovideo.jp/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/nicovideo.json
- 1 변수: 0개. 접두사 없음. 예 없음
- 2 층: 숫자 단계 이름 0개 · 역할 이름 0개 · 부품 이름 0개. 역할 → 숫자 단계 var() 0개
- 3 다크 전환: 전환 선택자 못 봄
- 4 @layer: 0회
- 5 안 읽는 변수: 0/0개
- 6 클래스: 접두사 · BEM — 부품 이름 접두사(`ContentsDigestFrame-description` · `NC-*`). 자동 분류 쓰임 수 해시 25 · 유틸리티 0 · BEM 0 · 기타 1564. 예 `SkeletonLine` `EnjoyContainer-banner` `ContentsDigestFrame-description` `StageRecommendVideoCard-sensitive` `StageRecommendLiveCard-ownerText` `NicoAdContainer-cardMetaPoint` `TextListFrame-errorMessage` `common-header-cdesjj` `NC-Tooltip-template` `CrossSearch-arrowIcon`
- 7 스타일시트: 5개(link 1 · style 4 · adopted 0 · shadow 0). `bundle/pages_index_TopPage.css`

#### Cloudflare (A 실측)

- URL https://www.cloudflare.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/cloudflare.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 458개. 접두사 color 198 · tw 127 · type 45 · text 34 · font 8 · container 8 · radius 7 · blur 6. 예 `--fade-left-n` `--tw-mask-bottom-to-position` `--tw-sepia` `--text-color-kumo-link` `--text-xs--line-height` `--color-amber-700` `--color-pink-100` `--text-5xl--line-height` `--color-background-content` `--color-sidebar-accent`
- 2 층: 숫자 단계 이름 126개(`--color-blue-400` `--color-blue-800` `--color-orange-650`) · 역할 이름 74개(`--tw-border-spacing-x` `--tw-border-spacing-y` `--tw-border-style`) · 부품 이름 24개(`--text-color-kumo-badge-teal-subtle` `--text-color-kumo-badge-neutral-subtle` `--text-color-kumo-badge-inverted`). 역할 → 숫자 단계 var() 18개: `--text-color-kumo-default: light-dark(var(--color-neutral-900,oklch(21% .006 285.885)),var(--color-neutral-` · `--text-color-kumo-inverse: light-dark(var(--color-neutral-100,oklch(97% 0 0)),var(--color-neutral-900,oklch`
- 3 다크 전환: `.dark`(266회) + `light-dark()` 297회
- 4 @layer: 5회. `@layer properties {}` `@layer base {}` `@layer utilities {}`
- 5 안 읽는 변수: 26/458개(예 `--tw-translate-z` `--tw-font-weight` `--tw-tracking`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 23 · 유틸리티 11296 · BEM 25 · 기타 592. 예 `flex` `tracking-[-0.04em]` `after:opacity-0` `group-hover:text-foreground-100/80` `fade-in` `col-span-2` `lg:hidden` `t-icon` `animate-presence` `hover:z-50`
- 7 스타일시트: 23개(link 4 · style 17 · adopted 0 · shadow 2). `_astro/_separator.CtrAARtM.css` `_astro/index.Cm-titPL.css` `_astro/index.CN3UJUeJ.css` `_astro/DomainSearchApp.W_8IODvl.css`

#### Supabase (A 실측)

- URL https://supabase.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/supabase.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 507개. 접두사 color 228 · tw 127 · ch 28 · text 24 · animate 24 · container 11 · font 9 · radius 8. 예 `--ch-title-bar-height` `--tw-shadow-alpha` `--tw-backdrop-sepia` `--color-white` `--tracking-widest` `--color-amber-700` `--color-gray-900` `--color-pink-1100` `--color-violet-100` `--animate-panel-slide-left-out`
- 2 층: 숫자 단계 이름 222개(`--color-emerald-50` `--color-emerald-200` `--color-emerald-300`) · 역할 이름 48개(`--tw-content` `--tw-border-style` `--tw-outline-style`) · 부품 이름 10개(`--animate-accordion-down` `--animate-accordion-up` `--animate-overlay-show`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--animate-overlay-show: overlayContentShow .3s var(--ease-enter)`)
- 3 다크 전환: `[data-theme*="dark"]`(269회) · `.dark`(129회)
- 4 @layer: 5회. `@layer properties {}` `@layer theme {}` `@layer base {}` `@layer components {}` `@layer utilities {}`
- 5 안 읽는 변수: 57/507개(예 `--ch-0` `--ch-1` `--ch-2`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 18 · 유틸리티 5608 · BEM 0 · 기타 660. 예 `flex` `flex-1` `-top-1` `bg-surface-200` `opacity-20` `bg-[linear-gradient(to_bottom,hsl(var(--colors-white)/0.015),hsl(var(--colors-black)/0.01))]` `focus-visible:text-primary` `lg:px-8` `py-6!` `-mx-2`
- 7 스타일시트: 6개(link 4 · style 2 · adopted 0 · shadow 0). `css/59e930fbc05db89a.css` `css/534bdb499b315e5d.css` `css/1e2dd839c4c40d56.css` `css/8c75fe765d459215.css`

#### Sentry (A 실측)

- URL https://sentry.io/welcome/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/sentry.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 215개. 접두사 tw 76 · color 60 · text 30 · container 9 · font 7 · breakpoint 5 · leading 5 · radius 5. 예 `--b` `--tw-gradient-to` `--tw-ring-shadow` `--tw-backdrop-blur` `--color-red-800` `--color-gray-500` `--container-7xl` `--text-7xl` `--blur-sm` `--color-dk-purple`
- 2 층: 숫자 단계 이름 38개(`--color-red-50` `--color-red-200` `--color-red-300`) · 역할 이름 38개(`--tw-border-style` `--tw-outline-style` `--tw-content`) · 부품 이름 0개. 역할 → 숫자 단계 var() 0개
- 3 다크 전환: html `class="dark"` · `.dark-mode`(103회)
- 4 @layer: 5회. `@layer properties {}` `@layer theme {}` `@layer base {}` `@layer components;` `@layer utilities {}`
- 5 안 읽는 변수: 14/215개(예 `--tw-font-weight` `--tw-tracking` `--tw-inset-shadow-color`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 26 · 유틸리티 5873 · BEM 0 · 기타 1308. 예 `flex` `code-language` `pl-4` `overflow-x-clip` `rounded-[0.6625rem]` `xl:pt-0` `lg:flex-1` `mb-0` `snap-x` `py-2`
- 7 스타일시트: 11개(link 3 · style 8 · adopted 0 · shadow 0). `_astro/Layout.D5T144M3.css` `_astro/AnimatedLogoGrid.Drn3FiRC.css` `_astro/MarketoForm.BX_9vJpz.css`

#### PostHog (A 실측)

- URL https://posthog.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/posthog.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 100개. 접두사 tw 99 · breakpoint 1. 예 `--tw-border-spacing-x` `--tw-pan-y` `--tw-numeric-fraction` `--tw-brightness` `--tw-backdrop-contrast` `--tw-contain-style` `--tw-prose-quotes` `--tw-prose-invert-body` `--tw-prose-invert-captions` `--tw-text-opacity`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 16개(`--tw-border-spacing-x` `--tw-border-spacing-y` `--tw-content`) · 부품 이름 0개. 역할 → 숫자 단계 var() 0개
- 3 다크 전환: `.dark`(734회)
- 4 @layer: 2회. `@layer base, components, not-prose, utilities;`
- 5 안 읽는 변수: 8/100개(예 `--tw-pan-x` `--tw-pan-y` `--tw-pinch-zoom`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 73 · 유틸리티 8597 · BEM 0 · 기타 845. 예 `flex` `-translate-y-1/2` `focus-visible:outline-2` `text-black` `size-10` `gap-[1.6cqw]` `gap-px` `h-[731.5px]` `from-[color-mix(in_srgb,rgb(var(--bg))_0%,transparent)]` `md:size-6`
- 7 스타일시트: 5개(link 0 · style 5 · adopted 0 · shadow 0).

#### Tailwind CSS (A 실측)

- URL https://tailwindcss.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/tailwind.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 547개. 접두사 color 288 · tw 123 · text 31 · font 13 · container 13 · prose 11 · radius 8 · shadow 7. 예 `--tw-border-spacing-x` `--tw-mask-left-from-color` `--tw-drop-shadow-size` `--color-yellow-300` `--color-cyan-200` `--color-purple-100` `--color-gray-50` `--color-mauve-950` `--container-7xl` `--radius-4xl`
- 2 층: 숫자 단계 이름 275개(`--color-red-50` `--color-red-100` `--color-red-200`) · 역할 이름 45개(`--tw-border-spacing-x` `--tw-border-spacing-y` `--tw-border-style`) · 부품 이름 2개(`--tw-scrollbar-thumb` `--tw-scrollbar-track`). 역할 → 숫자 단계 var() 5개: `--prose-link-color: var(--color-gray-950)` · `--prose-link-underline-color: var(--color-sky-400)`
- 3 다크 전환: `.dark`(1,885회) + `prefers-color-scheme` 367회
- 4 @layer: 5회. `@layer properties {}` `@layer theme {}` `@layer base {}` `@layer components {}` `@layer utilities {}`
- 5 안 읽는 변수: 125/547개(예 `--tw-font-weight` `--tw-tracking` `--tw-opacity`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 10 · 유틸리티 7289 · BEM 4 · 기타 269. 예 `relative` `font-semibold` `border-gray-950` `text-black/20` `bg-white/15` `*:bg-white/10!` `duration-300` `sm:p-0` `snap-end` `fill-gray-400`
- 7 스타일시트: 2개(link 2 · style 0 · adopted 0 · shadow 0). `chunks/017r-ibrf-le-.css` `chunks/0n9_1tq74i09x.css`

#### Raycast (A 실측)

- URL https://www.raycast.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/raycast.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 137개. 접두사 color 26 · spacing 17 · grey 10 · rounding 9 · font 7 · chat 6 · container 4 · navbar 4. 예 `--font-inter` `--rounding-xxl` `--spacing-8` `--grey-600` `--background` `--color-fg` `--color-button-bg` `--color-step-4` `--card-radius` `--window-background`
- 2 층: 숫자 단계 이름 24개(`--grey-50` `--grey-100` `--grey-200`) · 역할 이름 12개(`--bg-opacity` `--background-opacity` `--background`) · 부품 이름 11개(`--navbar-width` `--color-button-bg` `--color-button-bg-hover`). 역할 → 숫자 단계 var() 2개: `--background: var(--grey-900)` · `--color-bg: var(--grey-900)`
- 3 다크 전환: 전환 선택자 못 봄(다크 한 벌)
- 4 @layer: 0회
- 5 안 읽는 변수: 35/137개(예 `--rounding-xxl` `--spacing-11` `--Base-Black`)
- 6 클래스: 해시 — CSS Modules(`h8MSgW_key`). 자동 분류 쓰임 수 해시 178 · 유틸리티 0 · BEM 51 · 기타 2206. 예 `h8MSgW_key` `Jy8ojW_placeholder` `V1XIQW_label` `nhiC3q_groupHead` `_8DiDuG_item` `EQy08a_legacyLink` `h8MSgW_isNotSafari` `H3BVAa_fadeInUpStagger` `pbCala_swatchCard` `_3Yq4tG_reel`
- 7 스타일시트: 11개(link 11 · style 0 · adopted 0 · shadow 0). `chunks/3aypw-ogam2_b.css` `chunks/40pxy-iuzzjrk.css` `chunks/1ye0rwkz2_15e.css` `chunks/41oq_se-c6a7s.css` `chunks/4571gnc3co4xl.css` `chunks/39divz567d6ak.css` …

#### Cal.com (A 실측)

- URL https://cal.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/calcom.json
- 한계: 소개(마케팅) 쪽이라 로그인 뒤 제품 화면의 CSS 와 다를 수 있음.
- 1 변수: 382개. 접두사 color 135 · tw 119 · text 22 · font 13 · container 10 · animate 8 · ease 6 · shadow 6. 예 `--font-cal-sans` `--tw-mask-bottom` `--tw-ring-offset-color` `--tw-enter-translate-y` `--color-green-800` `--color-violet-800` `--container-xs` `--tracking-wide` `--color-hp-ink` `--ease-hp-fly`
- 2 층: 숫자 단계 이름 96개(`--color-red-300` `--color-red-400` `--color-red-500`) · 역할 이름 49개(`--tw-border-spacing-x` `--tw-border-spacing-y` `--tw-border-style`) · 부품 이름 5개(`--color-hp-field` `--color-hp-chip` `--color-hp-slot-selected`). 역할 → 숫자 단계 var() 0개
- 3 다크 전환: `.dark`(563회) · html `style="color-scheme: dark"`
- 4 @layer: 5회. `@layer properties {}` `@layer theme {}` `@layer base {}` `@layer components {}` `@layer utilities {}`
- 5 안 읽는 변수: 84/382개(예 `--tw-translate-z` `--tw-scale-z` `--tw-gradient-via`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 33 · 유틸리티 15420 · BEM 1 · 기타 935. 예 `items-center` `text-[14px]` `gap-3.5` `transition-[box-shadow,background-color]` `content-start` `before:content-['']` `mt-12` `max-tablet:col-auto` `lucide-layout-grid` `bg-[rgba(244,244,244,0.72)]`
- 7 스타일시트: 2개(link 2 · style 0 · adopted 0 · shadow 0). `chunks/3i6fbvove-rsx.css` `chunks/0t6ztr7hlqvah.css`

#### velog (A 실측)

- URL https://velog.io/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/velog.json
- 1 변수: 127개. 접두사 toastify 31 · prism 14 · bg 13 · background 3 · element 2 · card 1 · spacer 1 · width 1. 예 `--card-count` `--teal5` `--gray7` `--red9` `--accent-invert` `--bg-element3` `--text4` `--prism-selection-bg` `--toastify-color-light` `--toastify-toast-background`
- 2 층: 숫자 단계 이름 64개(`--teal0` `--teal1` `--teal2`) · 역할 이름 15개(`--border-radius-md` `--background-base` `--background-invert`) · 부품 이름 37개(`--card-count` `--overlay` `--bg-tag`). 역할 → 숫자 단계 var() 0개 (부품 → 변수 예 `--toastify-icon-color-info: var(--toastify-color-info)`)
- 3 다크 전환: `[data-theme=dark]`
- 4 @layer: 0회
- 5 안 읽는 변수: 49/127개(예 `--element-height-md` `--element-height-sm` `--border-radius-md`)
- 6 클래스: 해시 — CSS Modules(`PostCard_userInfo__Cu1X5`). 자동 분류 쓰임 수 해시 567 · 유틸리티 0 · BEM 184 · 기타 6. 예 `VLink_block__Uwj4P` `PostCard_descriptionWrapper__UQSKA` `PostCard_userInfo__Cu1X5` `PostCard_clamp___2g_C` `responsive_mainHeaderResponsive__S6XhY` `Header_block__wbdml` `Header_right__IaiY4` `RoundButton_notBorder__O_IqR` `HomeTab_left__o1RQE` `HomeTab_indicator__wQ03f`
- 7 스타일시트: 6개(link 6 · style 0 · adopted 0 · shadow 0). `css/a5acc784576aa746.css` `css/932282bb8fa235ed.css` `css/1defe484c0d0b9ce.css` `css/71c09e90927d33b3.css` `css/2e845662d117ae7d.css` `dist/katex.min.css`

#### note (A 실측)

- URL https://note.com/ · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/a/note.json
- 1 변수: 57개. 접두사 tw 57. 예 `--tw-content` `--tw-rotate` `--tw-pan-x` `--tw-gradient-via-position` `--tw-numeric-spacing` `--tw-ring-color` `--tw-blur` `--tw-invert` `--tw-backdrop-brightness` `--tw-backdrop-opacity`
- 2 층: 숫자 단계 이름 0개 · 역할 이름 5개(`--tw-content` `--tw-border-spacing-x` `--tw-border-spacing-y`) · 부품 이름 0개. 역할 → 숫자 단계 var() 0개
- 3 다크 전환: html `class="theme-auto"` · `.dark` · `.theme-dark` + `prefers-color-scheme` 3회
- 4 @layer: 0회
- 5 안 읽는 변수: 7/57개(예 `--tw-border-spacing-x` `--tw-border-spacing-y` `--tw-pan-x`)
- 6 클래스: 유틸리티 — Tailwind 식. 자동 분류 쓰임 수 해시 45 · 유틸리티 11532 · BEM 1 · 기타 589. 예 `flex` `motion-reduce:scale-100` `flex-col` `bg-surface-normal` `w-36` `-inset-x-2` `group-hover/inline-list:md:opacity-100` `group` `grid-cols-[1fr,auto]` `p-3`
- 7 스타일시트: 4개(link 4 · style 0 · adopted 0 · shadow 0). `css/8195c0d57830d9e1.css` `css/fc1a10cec848c2d4.css` `css/b62167c06f4e98ac.css` `css/56bc419904299170.css`

### 갈래 B — 공개 소스

저장소 20곳을 세 묶음으로 나눠 트리와 raw 파일을 열어 적었다. 코드 검색 API 가 분당 제한에 걸린 곳은 스타일 파일을 받아 grep 했고 그 범위를 6칸에 적었다. 받은 파일은 이 폴더의 `b1src/` · `b3/` 등에 있다.

#### Mastodon (B 소스)

- URL https://github.com/mastodon/mastodon (main) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/mastodon_mastodon.tree.json
- 1 토큰 파일: 종류별 + 테마별 여러 파일. `app/javascript/styles/mastodon/tokens/` 아래 `index.scss` · `_border.scss` · `_shape.scss` · `_type.scss` · `theme/_palette.scss` · `theme/_dark.scss` · `theme/_light.scss` · `theme/_utils.scss` (8개). 파일마다 믹스인으로 CSS 변수를 내고 `index.scss` 가 `html { @include palette.palette; @include border.border-widths; … @include type.font-size; }`, `[data-color-scheme='dark'], html:not([data-color-scheme]) { @include dark.base-indigo; @include dark.tokens; }` 로 붙인다. SCSS 변수는 `styles/mastodon/_variables.scss` 15줄(중단점 · 언어 목록 · 블러 필터)만.
- 2 공용 스타일 나누기: 두 방식이 함께 있다. 옛 전역은 가운데 폴더 `app/javascript/styles/mastodon/` 의 묶음 파일 20개(`components.scss` 8,389줄 · `forms.scss` 1,577줄 · `tables.scss` · `modal.scss` · `lists.scss` …). 새 부품은 부품 코드 옆 CSS Modules 53개(`app/javascript/mastodon/components/button/styles.module.scss` · `components/badge/styles.module.scss` · `components/form_fields/toggle.module.scss`).
- 3 화면 전용: 기능 폴더 옆 CSS Modules 47개(`app/javascript/mastodon/features/about/styles.module.scss` · `features/account_timeline/styles.module.scss`). 공용은 `mastodon/components/`, 화면은 `mastodon/features/` 로 가른다. 옛 전역 쪽은 같은 폴더에 `about.scss` · `admin.scss`(2,647줄) · `dashboard.scss` 로 섞여 있다.
- 4 import 순서 · @layer: `app/javascript/styles/application.scss` 그대로 — `mastodon/variables` → `mastodon/mixins` → `fonts/roboto` · `fonts/roboto-mono` · `fonts/inter` · `fonts/cal-sans-ui` → `mastodon/reset` → `mastodon/tokens` → `mastodon/basics` → `branding` → `containers` → `lists` → `widgets` → `forms` → `accounts` → `components` → `polls` → `modal` → `emoji_picker` → `about` → `tables` → `admin` → `dashboard` → `rtl` → `rich_text` (모두 `@use`). `@layer` 는 받은 142개 파일에서 0건.
- 5 글자 스타일: 값(크기 · 줄 높이 · 자간)은 토큰 파일 `tokens/_type.scss` 의 `--fs-11 … --fs-26` · `--lh-tighter/tight/normal` · `--ls-*`. 조합은 `styles/mastodon/_mixins.scss` 의 믹스인 11개(`type-heading-lg` · `type-heading-md` · `type-heading-sm` · `type-body-lg` · `type-body-strong` · `type-body` · `type-body-compact` · `type-label` · `type-meta` · `type-caption` · `type-micro`).
- 6 접근성 규칙: 흩어 둔다(스타일 파일 142개 전부 grep). `prefers-reduced-motion` 4개 파일(모두 부품 · 기능 옆 모듈, 코드 검색 API 결과와 같음), `forced-colors` 8개 파일(`components.scss` 9건 · 나머지 부품 모듈 1건씩), `prefers-contrast` 0건. 고대비는 따로 테마 파일이 아니라 속성 `data-contrast='high'` + 믹스인 `high-contrast`(`tokens/theme/_utils.scss`) · `high-contrast-outline`(`_mixins.scss`)로 토큰 파일과 부품 11개 파일에서 덮어쓴다. 움직임 줄이기는 사용자 설정 클래스 `reduce-motion` / `no-reduce-motion` 도 4개 파일에서 쓴다.
- 7 검사 도구: `stylelint.config.js` — `extends: ['stylelint-config-standard-scss']`, `reportNeedlessDisables: true`, `custom-property-pattern`. 안 쓰는 변수 · 선택자를 찾는 규칙은 없다. purgecss · knip 설정은 트리에서 못 찾음.

#### Discourse (B 소스)

- URL https://github.com/discourse/discourse (main) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/discourse_discourse.tree.json
- 1 토큰 파일: 종류별 여러 파일. `app/assets/stylesheets/common/tokens.scss`(68줄, 뜻 토큰 `--token-color-text-default: var(--primary-900);`) · `common/font-variables.scss`(36줄, `--font-up-1` · `--line-height-*`) · `color_definitions.scss`(165줄, SCSS 색 변수를 CSS 변수로 옮김 `--primary: #{$primary};`, 「compiled to CSS separately from the rest of the app」) · `common/foundation/variables.scss`(229줄, SCSS 변수 `$small-width: 800px !default;`, 「injected into every theme CSS file」) · `common/foundation/colors.scss` · `color_transformations.scss`. 테마별 파일은 코어에 없고 색 묶음은 DB 색 구성표에서 주입한다(파일로는 미확인).
- 2 공용 스타일 나누기: 가운데 폴더 `app/assets/stylesheets/common/`(307개) 아래 부품마다 파일. 묶음 폴더 `components/`(100) · `form-kit/`(36) · `select-kit/`(26) · `modal/`(9) · `ui-kit/`(8) · `float-kit/`(7) · `foundation/`(7). 예 `common/components/buttons.scss` · `common/form-kit/_checkbox-group.scss` · `common/ui-kit/d-tabs.scss`. 폴더마다 `_index.scss` 가 파일을 하나씩 import 한다.
- 3 화면 전용: `common/base/`(76개: `topic.scss` · `user.scss` · `search.scss` · `login.scss` · `sidebar-*.scss` …)가 화면 · 기능별 파일, `common/components/` 가 부품이다. 관리자는 `app/assets/stylesheets/admin/`(55개, 진입 `admin.scss`), 플러그인은 `plugins/<이름>/assets/stylesheets/`(chat 117개 등), 설치 마법사 `wizard.scss` 는 따로 진입 파일.
- 4 import 순서 · @layer: `app/assets/stylesheets/common.scss` 그대로 — `common/font-variables` → `common/tokens` → `vendor/normalize` → `vendor/normalize-ext` → `vendor/pikaday` → `common/whcm` → `common/foundation/helpers` → `common/foundation/base` → `common/form-kit/_index` → `float-kit/_index` → `select-kit/_index` → `ui-kit/_index` → `components/_index` → `modal/_index` → `input_tip` → `topic-entrance` → `printer-friendly` → `common/base/_index` → `d-editor` → `software-update-prompt` → `topic-timeline` → `loading-slider` → `rich-editor` → `login/_index` → `post-action-feedback` → `toolbar-popup-menu-options` → `nested-view` → `upcoming-changes/_index` (모두 `@import`). `@layer` 는 받은 723개 파일에서 0건.
- 5 글자 스타일: 변수 파일 `common/font-variables.scss` 한 곳에 크기 단계와 줄 높이만(`--font-up-6 … --font-down-6`, `--line-height-small/medium/large`). 크기 · 굵기 · 줄 높이를 묶은 조합 믹스인은 `common/foundation/mixins.scss` 의 믹스인 23개 이름에서 못 찾음.
- 6 접근성 규칙: 모으는 파일과 흩어진 것이 함께 있다(723개 파일 grep). 강제 색은 `common/whcm.scss`(「Overrides for Windows High Contrast Mode」)에 모으되 파일 머리에 「Some @media (forced-colors: active) {} styles have also been used inside mixins in: common/components/buttons.scss」 라고 적혀 있고, `forced-colors` 는 7개 파일(코어 6). 고대비 색 구성표용 `app/assets/stylesheets/wcag.scss`(「Overrides for WCAG color schemes only」)가 따로 있다. `prefers-reduced-motion` 은 61개 파일(코어 34)에 부품 옆으로 흩어져 있다. `prefers-contrast` 0건.
- 7 검사 도구: `stylelint.config.mjs` — `extends: ["@discourse/lint-configs/stylelint"]` + 직접 만든 규칙 4개(`stylelint-rules/` 폴더): `discourse/no-renamed-variables`(전체 켬) · `discourse/uc-classes-in-where`(전체 켬) · `discourse/no-core-color-variables` · `discourse/require-design-tokens`(둘은 `**/sidebar*.scss` 에만 켬, `color` · `background-color` · `border-color` · `font-weight` · `border-radius` 에 `--token-*` 강제). 안 쓰는 CSS · 변수를 찾는 규칙 · purgecss · knip 은 트리에서 못 찾음(공유 설정 `@discourse/lint-configs` 안은 미확인).

#### GitLab (B 소스)

- URL https://github.com/gitlabhq/gitlabhq (master, `app/assets/stylesheets` 아래만 봄) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/gitlabhq_gitlabhq.stylesheets.tree.json (전체 트리 gitlabhq_gitlabhq.tree.json 은 잘림)
- 1 토큰 파일: 토큰 정본은 이 저장소 밖 패키지 `@gitlab/ui` 다. `framework/variables.scss` 첫 줄이 `@import '@gitlab/ui/src/tokens/build/scss/tokens';` `@import '@gitlab/ui/src/scss/variables';` 이고 그 아래 앱 전용 SCSS 변수(`$grid-size: 8px;` `$super-sidebar-width: 15rem;` …, 391줄). 다크는 테마별 파일 `color_modes/_dark.scss`(`@import '@gitlab/ui/src/tokens/build/scss/tokens.dark';`). 앱 전용 CSS 변수는 `root.scss` 한 파일(247줄, `--header-height` 같은 레이아웃 값). Tailwind 설정 `config/tailwind.config.js` 는 `presets: [tailwindDefaults]`(`@gitlab/ui/tailwind.defaults`). 패키지 안 파일 구성은 미확인.
- 2 공용 스타일 나누기: 가운데 폴더 `framework/`(58개)에 묶음 파일(`framework/buttons.scss` · `framework/forms.scss` · `framework/dropdowns.scss` · `framework/tables.scss`), `components/`(28개: `components/avatar.scss` · `components/detail_page.scss`, 진입 파일 주석 「Component specific styles, will be moved to gitlab-ui」), `layouts/`(4개). 공용 부품 본체는 `@gitlab/ui/src/scss/gitlab_ui_no_utils` 를 import 한다. `.vue` 안 스타일은 이 트리 범위 밖이라 미확인.
- 3 화면 전용: `page_bundles/`(79개 파일 · 폴더, `page_bundles/boards.scss` · `page_bundles/merge_requests.scss` — 화면마다 따로 빌드되는 묶음)와 옛 `pages/`(8개, `_page_specific_files.scss` 가 import). 진입 파일 주석 그대로: 「If you need to add or modify UI component that is common for many pages … make changes in the framework/ directory. If you need to add unique style that should affect only one page - use pages/ directory.」
- 4 import 순서 · @layer: `application.scss` → `_application_base.scss` 그대로 — `@gitlab/at.js/dist/css/jquery.atwho` → `dropzone/dist/basic` → `root` → `framework` → `page_specific_files` → `components/index` → `layouts/index` → `vendors/index` → `behaviors` → `application_ee` → `application_jh` → `print`. `framework.scss` 안은 `framework/variables` → `framework/variables_overrides` → `framework/mixins` → `@gitlab/ui/src/scss/gitlab_ui_no_utils` → `@gitlab/duo-ui/src/scss/components` → `bootstrap_migration` → `framework/layout` → … 부품 묶음 50여 개 → `@include make-container-grid-columns;`. 유틸리티는 따로 `tailwind.css`(`@tailwind base; @tailwind components; @tailwind utilities;`). 다크 진입은 `application_dark.scss`: `color_modes/dark` → `application_base` → `application_dark_overrides`. `@layer` 는 받은 233개 파일에서 0건.
- 5 글자 스타일: 따로 파일 `framework/typography.scss`(1,215줄) — 대부분 `.md` 마크다운 본문 규칙이고 `.page-title` · `h1–h4` · `.monospace` 같은 클래스. 조합 믹스인은 이 파일에 없다. 글자 토큰 · 유틸리티는 `@gitlab/ui` 쪽(미확인).
- 6 접근성 규칙: 흩어 둔다(233개 파일 grep). `prefers-reduced-motion` 10개 파일(`framework/super_sidebar.scss` 7건 · `framework/animations.scss` · `page_bundles/settings.scss` …), `forced-colors` 6개 파일(`components/focus_carousel.scss` · `framework/layout.scss` …), `prefers-contrast` 0건. 고대비 전용 파일은 이 폴더에서 못 찾음. `disable_animations.scss` 는 한 파일로 모든 transition · animation 을 끄지만 주석이 「Keep transition enabled where it would otherwise break specs」 라 테스트용이다.
- 7 검사 도구: `.stylelintrc` — `extends: ["@gitlab/stylelint-config"]` + 직접 만든 플러그인 5개(`tooling/stylelint/`): `gitlab/no-gl-class` · `gitlab/split-apply` · `gitlab/no-sass-class-concat` · `gitlab/no-js-class` · `gitlab/no-has`. 안 쓰는 CSS 를 찾는 규칙은 없다. 사용자 스크립트 `scripts/frontend/check_page_bundle_mixins_css_for_sideeffects.js`(`page_bundles/_mixins_and_variables_and_functions` 가 CSS 를 내지 않는지 검사) · `scripts/frontend/clean_css_assets.mjs`. 유틸리티는 Tailwind 3.4 의 `content` 경로로 쓰는 것만 만든다. purgecss · knip 설정은 전체 트리(잘림)에서 못 찾음.

#### Lichess (lila) (B 소스)

- URL https://github.com/lichess-org/lila (master) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/lichess-org_lila.tree.json
- 1 토큰 파일: 테마별 파일 + 종류별 SCSS 파일. 색 CSS 변수는 `ui/lib/css/theme/_theme.default.scss` · `_theme.light.scss` · `_theme.transp.default.scss` · `_theme.transp.light.scss`(`:root { --c-bg: hsl(var(---site-hue) 7% 14%); … }`), `ui/lib/css/build/lib.theme.all.scss` 가 넷을 묶어 따로 빌드한다. 빌드 스크립트 `ui/.build/src/sass.ts` 가 테마 파일의 색 변수마다 `$c-<이름>: var(--c-<이름>)` 을 `theme/gen/_wrap.scss` 로 만들어 준다(생성물이라 트리에 없음). 색 밖의 값은 `ui/lib/css/abstract/_variables.scss`(`$transition-duration: 150ms;` `$small: 800px;`) · `_z-index.scss` · `_media-queries.scss` · `layout/_vars.scss`.
- 2 공용 스타일 나누기: 가운데 폴더 `ui/lib/css/`(147개) 아래 부품마다 파일. `component/`(57개: `_button.scss` · `_dialog.scss` · `_pagination.scss`) · `form/`(11개: `_check.scss` · `_range.scss`) · `header/`(6) · `chat/` · `ceval/` · `base/`(8) · `layout/`(4) · `abstract/`(15, 출력 없는 변수 · 믹스인 · extends).
- 3 화면 전용: 기능 패키지마다 `ui/<기능>/css/`(31개 패키지 536개 파일: `ui/analyse/css` 86 · `ui/tournament/css` 33 · `ui/lobby/css` 22; `ui/bits/css` 131 은 작은 화면 모음). 패키지 안 `css/build/*.scss` 가 진입 파일(전체 148개)이고 파일 이름이 묶음 이름이다(`ui/lobby/css/build/lobby.scss`). 공용은 `ui/lib/`, 화면은 `ui/<기능>/` 로 가른다.
- 4 import 순서 · @layer: 사이트 공통 진입 `ui/site/css/build/site.scss` = `lib/css/abstract/all` → `lib/css/page/lichess`. `abstract/_all.scss`: `theme` → `functions` → `z-index` → `variables` → `media-queries` → `licon` → `uniboard` → `dir` → `mixins` → `extends` → `flex` → `box` → `fluid-size`. `page/_lichess.scss`: `base/elements` → `base/form` → `base/typography` → `base/data-icon` → `base/unread` → `base/util` → `base/scrollbar` → `base/ltr` → `layout/vars` → `layout/base` → `layout/page-menu` → `theme/board/chessground` → `header/header` → `components`(부품 15개) → `@include theme-style;`. 화면 진입 예 `lobby.scss`: `lib/css/plugin`(= `abstract/all`) → 필요한 `lib/css/form/range` · `component/now-playing` … 를 골라 import → `../lobby`. `@layer` 는 받은 681개 파일에서 0건.
- 5 글자 스타일: 기본 요소는 따로 파일 `ui/lib/css/base/_typography.scss`(`html { @extend %base-font-fallback; @include fluid-size('font-size', 12px, 14px); }` · `h1 { @include fluid-size('font-size', 19px, 38px); }`). 글꼴 조합은 `ui/lib/css/abstract/_extends.scss` 의 placeholder(`%base-font` · `%roboto { font-family: Roboto, sans-serif; font-weight: 300; }` · `%chess-font` · `%page-font`). 글꼴 파일 선언은 `theme/_font-face.scss`.
- 6 접근성 규칙: 흩어 둔다(681개 파일 grep). `prefers-reduced-motion` 8개 파일(`ui/lib/css/base/_elements.scss` · `component/_bar-glider.scss` · `game/_clock.scss` · `ui/tutor/css/_waiting.scss` …, 1건씩). `forced-colors` 0건 · `prefers-contrast` 0건. 고대비 전용 테마 파일은 트리에서 못 찾음. 화면 낭독기용 `#blind-mode` 는 `ui/lib/css/component/_blind-mode.scss` · `ui/bits/css/_blind.scss` 에 따로 있다.
- 7 검사 도구: `.stylelintrc.json` — `"extends": "stylelint-config-standard-scss"`, `"plugins": ["stylelint-scss"]`, 규칙은 표기법 중심(`color-function-notation: modern` · `media-feature-range-notation: prefix` …). 안 쓰는 CSS · 변수를 찾는 규칙은 없다. `package.json` 의 `"lint:style": "stylelint \"ui/**/*.scss\""`. purgecss · knip 설정은 트리에서 못 찾음.

#### osu! (osu-web) (B 소스)

- URL https://github.com/ppy/osu-web (master) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/ppy_osu-web.tree.json
- 1 토큰 파일: 종류별 Less 변수 파일. `resources/css/variables.less`(316줄: 글꼴 · 중단점 · 치수 · `@font-size--*`) · `resources/css/colors.less`(212줄: `@purple: #8866ee;` 같은 팔레트와 `@osu-colour-h1: hsl(var(--hsl-h1));`) · `resources/css/bootstrap-variables.less`(62줄). CSS 변수 선언은 `layout.less`(57줄) · `colors.less`(8줄) · `bbcode.less` · `sections.less` 에 나뉘어 있다. 테마별 파일은 없다.
- 2 공용 스타일 나누기: 가운데 폴더 `resources/css/bem/` 에 BEM 블록마다 파일 하나(465개, 폴더 구분 없이 평평함; `bem/bootstrap/` 3개만 하위 폴더). 예 `bem/avatar.less` · `bem/audio-player.less` · `bem/account-edit.less`. 색인 `bem-index.less`(471줄)는 스크립트 `bin/make_bem_index.sh` 가 `find bem/ -name '*.less'` 로 만들어 낸다. 믹스인은 `functions.less`(374줄), 유틸리티 클래스는 `utilities.less`(`.u-ellipsis-overflow` · `.u-hidden` …).
- 3 화면 전용: 공용과 가르는 폴더가 없다. 부품 블록과 화면 블록이 같은 `bem/` 에 이름으로만 섞여 있다(`bem/admin-contest.less` · `bem/artist.less` · `bem/avatar.less`). 따로 진입 파일을 갖는 것은 API 문서용 `entrypoints/docs.less` 하나.
- 4 import 순서 · @layer: `resources/css/entrypoints/app.less` → `resources/css/app.less` 그대로 — fontawesome(`fontawesome` · `solid` · `regular` · `brands`) → `inter-ui/inter.css` → `bootstrap/less/bootstrap` → `bootstrap-overrides` → qtip2 · photoswipe css → `photoswipe-overrides` → `jquery-ui/slider` · `jquery-ui/theme` → `functions` → `venera` → `torus` → `base` → `keyframes` → `layout` → `bbcode` → `sections` → `spinner` → `icons` → `utilities` → `bem-index` → `bootstrap-variables` → `colors` → `variables`. 주석 그대로: 「Variables are imported last. Less has the rule "Last Defined Wins".」 `@layer` 는 받은 490개 파일에서 0건.
- 5 글자 스타일: 변수 파일 `variables.less` 에 글꼴 묶음(`@font-default` · `@font-content` · `@font-grade`)과 크기 19단계(`@font-size--tiny: 8px;` … `@font-size--extra-large: 70px;`). 조합은 `functions.less` 의 믹스인 `.content-font() { font-family: …; line-height: 1.35; }` · `.default-font()` 둘뿐. 글꼴 파일 선언은 `torus.less` · `venera.less`.
- 6 접근성 규칙: `prefers-reduced-motion` · `forced-colors` · `prefers-contrast` 모두 받은 490개 파일에서 0건. 고대비 전용 파일은 트리에서 못 찾음.
- 7 검사 도구: stylelint 설정은 트리에서 못 찾음. CSS 에 닿는 검사는 prettier 뿐이다 — `.prettierignore` 가 `/*` 뒤 `!/resources/css` 로 CSS 폴더만 대상으로 두고 `.github/workflows/lint.yml` 이 `yarn pretty`(`prettier --check .`)를 돌린다. `yarn lint` 는 eslint 로 js · ts 만. purgecss · knip 은 트리에서 못 찾음.

#### Forem (dev.to) (B 소스)

- URL https://github.com/forem/forem (main) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/forem_forem.tree.json
- 1 토큰 파일: 종류별 + 테마별. `app/assets/stylesheets/config/_variables.scss`(203줄, `:root` 에 크기 · 간격 `--su-1: 0.25rem;` · 반경 `--radius` · 글꼴 `--ff-*` · 글자 크기 `--fs-*` · 줄 높이 `--lh-*`) · `config/_colors.css`(416줄, `--base-100` · `--accent-brand` …) · 다크 테마 `themes/dark.css`(414줄, `:root { color-scheme: dark; --theme-secondary-color: …`). `config/_import.scss`(199줄)는 유틸리티 클래스를 만들 SCSS 맵(`$colors` · `$breakpoints` · `$spacing-units`), `config/_generator.scss`(499줄)가 그 맵으로 클래스를 만든다. 옛 SCSS 색 변수는 `variables.scss`(30줄).
- 2 공용 스타일 나누기: 가운데 폴더 `app/assets/stylesheets/components/` 에 부품 묶음마다 파일(39개: `components/buttons.scss` · `components/forms.scss` · `components/modals.scss`). 기본은 `base/` 6개(`reset` · `main` · `helpers` · `icons` · `layout` · `typography`). Preact 부품(`app/javascript/crayons/`) 옆에는 스토리북용 scss 3개뿐이고 부품 스타일은 가운데 폴더에 있다.
- 3 화면 전용: `app/assets/stylesheets/views/`(17개: `views/article.scss` · `views/profile.scss` · `views/dashboard.scss`, 진입 `views.scss`)가 새 화면 스타일. 옛 화면 파일은 폴더 없이 최상위에 39개(`articles.scss` · `settings.scss` · `onboarding.scss`, 진입 `minimal.scss`). 글 안 임베드는 `ltags/`(32개), 관리자는 `admin.scss`.
- 4 import 순서 · @layer: `crayons.scss` 그대로 — `config/variables` → `config/colors` → `base/reset` → `base/main` → `base/helpers` → `base/icons` → `base/layout` → `base/typography` → `components/autocomplete` … `components/drawer-navigation`(부품 37줄) → `config/generator`(유틸리티 클래스 생성) → `badge_details` → `badges`. `views.scss` 는 `views/article` … 17줄, `minimal.scss` 는 `variables` → `fundamentals` → `scaffolds` → 옛 화면 파일들. `@layer` 는 받은 145개 파일에서 0건.
- 5 글자 스타일: 값은 변수 파일 `config/_variables.scss`(`--fs-2xs … --fs-5xl` · `--lh-tight` · `--lh-base` · `--ff-sans-serif`). 본문 조합은 따로 파일 `base/typography.scss`(612줄, `.text-styles` 클래스와 `--content-font-size: var(--fs-l);`). 크기 · 굵기 유틸리티 클래스는 `config/_generator.scss` 가 만든다.
- 6 접근성 규칙: `prefers-reduced-motion` 3개 파일(`base/reset.scss` 1건 — 전역 리셋 안에서 `*, ::before, ::after { animation-duration: 1ms !important; … scroll-behavior: auto !important; }` 로 한 번에 끔, `views/comments.scss` · `ltags/SlidesTag.scss`). `forced-colors` · `prefers-contrast` 0건(145개 파일 grep). 고대비 전용 파일은 트리에서 못 찾음(테마 파일은 `themes/dark.css` 하나).
- 7 검사 도구: stylelint 설정은 트리에서 못 찾음. CSS 에 닿는 것은 `.lintstagedrc.js` 의 `'*.scss': ['prettier --write']` 뿐이고, `package.json` 의 `lint:frontend` 는 eslint 로 js · jsx 만 본다. `postcss.config.js` 는 `postcss-import` · `postcss-flexbugs-fixes` · `postcss-preset-env` 뿐. purgecss · knip 은 트리에서 못 찾음.

#### Ghost 관리자 (apps/admin + apps/shade) (B 소스)

- URL https://github.com/TryGhost/Ghost (main) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/TryGhost_Ghost.tree.json · 지시의 `ghost/admin` 폴더는 지금 트리에 없다(`ghost/` 아래는 `bin` · `content` · `core` · `scripts` · `test` · `types`). 관리자 앱은 `apps/admin`, 디자인 시스템은 `apps/shade`.
- 1 토큰 파일: Tailwind 4 의 CSS `@theme` 이 정본이고 두 파일로 나뉜다. `apps/shade/tailwind.theme.css`(514줄: `@custom-variant dark (&:is(.dark *):not(.light *));` · `@theme { --breakpoint-sm: 480px; … --color-* … --font-* … --text-* }` · `@theme inline { … }` · keyframes) = 기초값, `apps/shade/theme-variables.css`(634줄: `:root, [data-admin7-design] { --background: var(--color-white); --foreground: …; --surface-page: … }` 와 `.dark [data-admin7-design] { … }`) = 뜻 변수 + 다크. `apps/shade/tokens.css`(3줄)는 둘만 묶은 진입 파일(「Token-only CSS entrypoint (no preflight or utility layers).」). 앱 쪽 `apps/admin/src/index.css` 에도 `@theme { }` · `@theme inline { }` 블록이 있다. `tailwind.config` 파일은 `apps/shade` · `apps/admin` 에 없다.
- 2 공용 스타일 나누기: 부품 CSS 파일이 없다. `apps/shade` 의 CSS 는 7개(`styles.css` 393줄 · `preflight.css` 422줄 · `tailwind.theme.css` · `theme-variables.css` · `tokens.css` · `styles-published.css` · `.storybook/storybook.css`)뿐이고 부품은 `apps/shade/src/components/ui/`(146개 파일, ts 20 · tsx 126: `accordion.tsx` · `action-list.tsx` · `alert-dialog.tsx`) · `primitives/`(14) · `patterns/`(34) · `layout/`(4) · `page-templates/`(7) 의 tsx 안에서 Tailwind 클래스로 쓴다.
- 3 화면 전용: `apps/admin/src/` 아래 기능 폴더(`members` · `posts` · `settings` · `analytics` · `tags` … 28개)의 tsx. 화면용 CSS 파일은 `apps/admin/src/` 에 5개(`index.css` 678줄 · `element-styles.css` 254줄 · `pintura.css` · `settings/custom-fonts.css` · `assets/fonts/inter-admin/fonts.css`). 공용은 `apps/shade`, 화면은 `apps/admin` 으로 패키지 단위로 가른다.
- 4 import 순서 · @layer: `apps/admin/src/index.css` 그대로 — `@source "../../shade/src/**/*.{ts,tsx}";` · `@source "../../activitypub/src/**/*.{ts,tsx}";` · `@source "../../admin-x-framework/src/**/*.{ts,tsx}";` · `@source …kg-unsplash-selector…` → `@import './element-styles.css';` → `@import '@tryghost/shade/styles.css';` → `./assets/fonts/inter-admin/fonts.css` → `./pintura.css` → `@utility …` · `@theme { }`. `apps/shade/styles.css`: `tailwindcss/theme.css` → `./preflight.css` → `tailwindcss/utilities.css` → `tw-animate-css` → `./tailwind.theme.css` → `./theme-variables.css` → `@layer base { … }`. 직접 쓴 `@layer` 는 `styles.css` 9줄의 `base` 한 곳뿐(나머지 층은 Tailwind import 가 만든다).
- 5 글자 스타일: 토큰 파일 `apps/shade/tailwind.theme.css` 의 `@theme` 안 — `--font-body` · `--font-heading` · `--font-weight-title: 540;` · `--tracking-*` · `--text-2xs: 1rem; … --text-6xl: 5.8rem;` · `--text-5xl--line-height: 1.15;`(크기와 줄 높이를 한 쌍으로). 따로 글자 파일 · 믹스인은 없다. 문서는 `apps/shade/src/docs/tokens/typography.stories.tsx`.
- 6 접근성 규칙: `prefers-reduced-motion` 은 `apps/admin/src/index.css` 5건 · `apps/shade/styles.css` 2건(저장소 전체 CSS 56개 중 3개 파일). 움직임을 쓰는 규칙 바로 아래에 붙여 둔다(`.large-title-header-title { transition: none; }`). `forced-colors` · `prefers-contrast` 0건. 고대비 전용 파일은 트리에서 못 찾음. tsx 안 Tailwind `motion-reduce:` 클래스는 CSS 파일만 받아서 미확인.
- 7 검사 도구: 저장소 뿌리 `knip.json`(knip 6, `package.json` 의 `"knip": "knip"` · `"knip:fix"`)이 안 쓰는 파일 · 내보내기 · 의존성을 본다(CSS 선택자는 대상이 아님). stylelint 는 `koenig/koenig-lexical/.stylelintrc.json` 하나뿐이고 규칙은 `"at-rule-disallowed-list": ["apply"]`; `apps/shade` · `apps/admin` 에는 stylelint 설정이 없다. 두 앱의 `eslint.config.js` 는 공유 설정 `@internal/cfg-eslint-react` 에 `tailwindCssPath` 를 넘긴다(그 안의 Tailwind 규칙은 미확인). 유틸리티는 Tailwind 4 `@source` 경로에서 쓰인 것만 만든다. purgecss 는 트리에서 못 찾음.

#### Wikipedia Vector 2022 스킨 (B 소스)

- URL https://github.com/wikimedia/mediawiki-skins-Vector (master, 트리 sha ed226095) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/wikimedia_mediawiki-skins-Vector.tree.json
- 1 토큰 파일: 정본은 리포 밖 Codex 디자인 토큰(MediaWiki core 가 제공). 리포 안은 종류가 아니라 역할로 3개 — `resources/mediawiki.less/vector-2022/mediawiki.skin.variables.less`(`@import 'mediawiki.skin.codex-design-tokens/theme-wikimedia-ui.less';` 뒤 덮어쓰기), `resources/skins.vector.styles/variables.less`(스킨 전용 Less 변수, 첫 줄 `@import 'mediawiki.skin.variables.less';`), `resources/skins.vector.styles/CSSCustomProperties.less`(테마별 CSS 변수 내보내기: `:root, .skin-invert, .notheme { .cdx-mode-light(); }` · `html.skin-theme-clientpref-night { color-scheme: dark; .cdx-mode-dark(); }`). 옛 스킨은 `resources/skins.vector.styles.legacy/variables.less` 따로.
- 2 공용 스타일 나누기: 가운데 폴더에 부품마다 파일. `resources/skins.vector.styles/components/` 23개(Button.less · Dropdown.less · SearchBox.less), 옛 스킨 `resources/skins.vector.styles.legacy/components/` 11개. 스타일 파일 전체 93개(less 79 · css 14, 그중 `skinStyles/jquery.ui` css 14).
- 3 화면 전용: 페이지 폴더 없음. 배치는 `resources/skins.vector.styles/layouts/`(screen · grid · print · toc/pinned · toc/unpinned 5개), 다른 모듈 · 확장 위에 덮는 스타일은 `skinStyles/`(12개 + vector/ 2개, 예 `skinStyles/mediawiki.action.edit.less`), JS 로 뜨는 기능은 `resources/skins.vector.js/*.less` 5개(stickyHeader.less · tableOfContents.less). 등록은 `skin.json`.
- 4 import 순서 · @layer: `resources/skins.vector.styles/skin.less` — `variables.less` → `mixins.less` → `@media screen {` layouts/screen · layouts/grid · layouts/toc/pinned · layouts/toc/unpinned → normalize → typography → links → components 22개(Dropdown … BottomDock) `}` → `@media all {` components/Logo `}` → `@media print {` print · layouts/print `}`. `skin.json` 은 `CSSCustomProperties.less` 를 `skin.less` 앞에 싣는다. `@layer` 안 씀(매체별 `@media` 블록 안 import).
- 5 글자 스타일: 크기 · 줄 높이 값은 `variables.less`(`@font-size-heading-1: 1.8em;` · `@line-height-base: 1.6;`), 요소에 입히는 규칙은 따로 파일 `resources/skins.vector.styles/typography.less`(머리 주석 「Common typography rules (Vector 2022)」). 글꼴 스택은 Codex 토큰.
- 6 접근성 규칙: 코드 검색 결과 `prefers-reduced-motion` 1건(`resources/skins.vector.js/tableOfContents.js`, JS), `forced-colors` 0건, `prefers-contrast` 0건. jquery.ui 를 뺀 less 전부를 열어 grep 해도 0건. 모으는 파일 · high-contrast 전용 파일 없음.
- 7 검사 도구: `.stylelintrc.json` — `"extends": ["stylelint-config-wikimedia/support-modern", "stylelint-config-wikimedia/mediawiki"]`, `"reportNeedlessDisables": true`, 규칙은 `selector-max-specificity: "1,4,2"` 와 끄기 4개(`no-descending-specificity: null` 등). 안 쓰는 CSS · 변수 규칙은 설정에 없음. purgecss · knip 트리에서 못 찾음. `package.json` `"lint:styles": "stylelint --cache \"**/*.{less,css}\""`.

#### Cal.com (B 소스)

- URL https://github.com/calcom/cal.com (main, 트리 sha 3030d88a) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/calcom_cal.com.tree.json
- 1 토큰 파일: CSS 한 파일 `packages/config/theme/tokens.css`(470줄, Tailwind 4 CSS 설정). 한 파일 안에 `@theme inline {`(16줄, `--text-color-emphasis: var(--cal-text-emphasis);` 꼴로 Tailwind 이름에 연결) → `:root, :host {`(밝은 값, `--cal-bg: hsla(0, 0%, 100%, 1);`) → `.dark {`(369줄). 첫 줄 주석 「This file is used in webapp as well as inside shadow DOM of embed elements.」. 새 부품 묶음 coss-ui 는 토큰을 따로 `packages/coss-ui/src/styles/globals.css`(`@theme inline {` → `:root {` → `.dark {`)에 둔다. `tailwind.config` 는 트리에 없음.
- 2 공용 스타일 나누기: 부품 CSS 파일이 거의 없고 스타일은 tsx 안 Tailwind 클래스. `packages/ui/components/` tsx 139개(폴더마다 부품, `packages/ui/components/button/Button.tsx`), `packages/coss-ui/src/components/` tsx 50개(`button.tsx` · `badge.tsx`). 부품 옆 css 는 2개뿐(`packages/ui/components/editor/stylesEditor.css` · `packages/ui/components/form/date-range-picker/styles.css`). 스타일 파일 전체 20개(css).
- 3 화면 전용: 전용 CSS 폴더 없음. 기능 옆 파일 `packages/features/calendars/weeklyview/styles/styles.css` 1개, 앱 전역 `apps/web/styles/`(globals.css · raqb.css 2개), 임베드 `packages/embeds/embed-core/src/`(embed.css · loader.css · styles.css).
- 4 import 순서 · @layer: `apps/web/styles/globals.css`(424줄) — `@import "tailwindcss";` → `@import "../../../packages/config/theme/shared-sources.css";`(`@source` 9줄) → `…/config/theme/tokens.css` → `…/coss-ui/src/styles/globals.css` → `./raqb.css` → 본문에 요소 규칙(`::selection` · `body`) → `@layer utilities {`(86줄) → `@utility stack-y-*`(119줄) → `@layer base {`(130줄) → `@layer components {`(153 · 164줄) → `@layer utilities {`(309줄). 층 이름은 Tailwind 의 base · components · utilities.
- 5 글자 스타일: 타이포 조합 파일 · 믹스인 트리에서 못 찾음. `tokens.css` 에는 글꼴 변수만(`--font-sans: var(--font-sans);` · `--font-cal: var(--font-cal);`), `@font-face` 는 `packages/ui/styles/shared-globals.css`(13줄). 크기 · 굵기는 부품 tsx 의 Tailwind 클래스(조합 정의 위치 미확인).
- 6 접근성 규칙: GitHub 코드 검색이 이 리포에서 0건만 돌려줌(있는 낱말 `tw-animate-css` 도 0건이라 검색 불가로 봄). 표본 11개 파일을 열어 grep — 손으로 쓴 `apps/web/styles/globals.css` · `packages/config/theme/tokens.css` · `packages/coss-ui/src/styles/globals.css` · 부품 tsx 5개 · 기능 css 3개 모두 0건. `packages/platform/atoms/globals.css`(11,935줄, 첫 줄 `/*! tailwindcss v4.1.15`, 빌드 산출물)에만 `forced-colors` 3건 · `motion-reduce` 유틸리티 1건. 모으는 파일 · high-contrast 파일 트리에서 못 찾음. 표본 한계: tsx 전체는 미확인.
- 7 검사 도구: stylelint · purgecss · knip 트리에서 못 찾음. `biome.json`(`@biomejs/biome` 2.3.10) — `"css": { "parser": { "tailwindDirectives": true } }`, 클래스 관련 규칙은 `useSortedClasses`(warn)뿐, 안 쓰는 CSS · 변수 규칙은 설정에서 못 찾음. 안 쓰는 클래스는 Tailwind 가 `@source` 로 훑은 것만 만든다.

#### Supabase (B 소스)

- URL https://github.com/supabase/supabase (master, 트리 sha c8aad267) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/supabase_supabase.tree.json
- 1 토큰 파일: 종류별 · 테마별 여러 CSS 파일(Tailwind 4 CSS 설정, `packages/config/tailwind.config.css` 가 묶음). 색 원시값 `packages/ui/build/css/source/global.css`(141줄, `--colors-black: 0deg 0% 0%;`) · 의미 색 `source/semantic.css`(324줄) · 옛 이름 별칭 `source/compat.css`(68줄) · 테마별 `themes/dark.css`(`[data-theme='dark'], .dark {`) · `themes/light.css`, 그리고 `packages/config/css/` 8개 — colors.css(429줄) · theme.css(385줄, `@theme inline { --color-background: var(--background);`) · charts.css · animations.css · shadows.css · utilities.css · variants.css · base.css.
- 2 공용 스타일 나누기: 부품 스타일은 tsx 안 Tailwind 클래스(`packages/ui/src/components/` tsx 138개, CSS 는 2개 `LogoLoader/loading-anim.module.css` · `shadcn/ui/popover.module.css`). 공용 CSS 는 가운데 폴더 `packages/config/` 에 종류 묶음으로(위 8개 + `typography.css` · `inline-code.css` · `code-hike.css` · `tailwind-plugins/hit-area.css`). `packages/ui-patterns/src/` 는 부품 옆 css 5개(`Toc/toc-menu.css` · `ShimmeringLoader/index.css` · `Notch/notch.css`). 스타일 파일 전체 142개(css 133 · scss 9, examples 포함).
- 3 화면 전용: 앱마다 `apps/<앱>/styles/`. Studio 는 `apps/studio/styles/` 12개가 기능 · 외부 부품 이름 파일(`storage.css` · `grid.css` · `reactflow.css` · `monaco.css` · `stripe.css` · `ui.css`), 기능 폴더 옆은 2개(`apps/studio/components/interfaces/Integrations/GraphQL/graphiql.module.css`). www 는 부품 옆 `*.module.css`(`apps/www/components/Hero/hero.module.css`) + `apps/www/styles/`(5개).
- 4 import 순서 · @layer: 공용 `packages/config/tailwind.config.css` — `tailwindcss` → `@plugin` typography · forms → `tw-animate-css` → `../ui/build/css/source/global.css` → `semantic.css` → `compat.css` → `themes/dark.css` → `themes/light.css` → `./unset-tw-colors.css` → `./css/colors.css` → `theme.css` → `charts.css` → `animations.css` → `utilities.css` → `shadows.css` → `tailwind-plugins/hit-area.css` → `variants.css` → `base.css` → `@config './typography.config.js'`. 주석 「Define the semantic system first, then override its core inputs per theme. This order is significant」. 앱 `apps/studio/styles/globals.css`(438줄) — `config/tailwind.config.css` → `config/inline-code.css` → `config/typography.css` → `@source` 4줄 → `@theme inline` · `@theme` → `@layer base {`(156 · 183줄). 나머지 11개 css 는 `apps/studio/pages/_app.tsx` · `routes/__root.tsx` 에서 JS import(code → globals → graphiql-base → grid → …, 알파벳순). 층 이름은 Tailwind 의 base 만 확인.
- 5 글자 스타일: 따로 파일 `packages/config/typography.css` — Tailwind `@utility` 로 조합 이름을 만든다(`@utility heading-title { @apply scroll-m-20 text-2xl tracking-tight; }` · `heading-section` · `heading-meta` · `text-default`). 글꼴 변수는 `packages/config/css/theme.css`(`--font-sans` · `--font-mono`), prose 는 `packages/config/typography.config.js`.
- 6 접근성 규칙: 모으는 파일 없음, 흩어 둠. 코드 검색 `prefers-reduced-motion` 24건(css 9 · tsx/ts 12 등: `packages/config/css/utilities.css` · `apps/studio/styles/reactflow.css` · `packages/ui-patterns/src/ShimmeringLoader/index.css` · `packages/ui-patterns/src/Toc/toc-menu.css` …), `forced-colors` 2건(`packages/config/css/shadows.css` · `packages/ui/src/components/shadcn/ui/scroll-area.tsx`), `prefers-contrast` 0건. high-contrast 전용 파일 없음. 대비는 `source/semantic.css` 의 변수 하나(`--contrast`, 주석 「Global contrast knob, 0 to 1」)를 테마 파일이 덮어쓴다.
- 7 검사 도구: stylelint · purgecss 트리에서 못 찾음. `knip.jsonc`(knip 6) + `.github/workflows/studio-knip.yml`(`pnpm knip --workspace apps/studio --no-progress --reporter symbols --reporter github-actions`) — 안 쓰는 파일 · 의존성만 검사(`"exclude": ["types", "exports"]`), CSS 변수 · 클래스 검사는 설정에서 못 찾음.

#### PostHog (B 소스)

- URL https://github.com/PostHog/posthog (master, frontend/src 트리 sha a84f4d30 · 전체 트리는 잘림) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/PostHog_posthog.frontend-src.tree.json (+ PostHog_posthog.tree.json)
- 1 토큰 파일: CSS 변수는 한 파일 `frontend/src/styles/base.scss`(2,249줄) 안에 밝은 값 `:root, :host {`(8줄, `--color-red-50: oklch(0.971 0.013 17.38deg);`)과 `[theme='dark'] {`(974줄)를 함께 둔다. SCSS 변수 파일 `frontend/src/styles/vars.scss` 는 5줄, 분기점뿐(`$sm: 576px;` … `$xxl: 1600px;`). Tailwind 쪽은 `common/tailwind/tailwind.css`(162줄, `@config "./tailwind.config.js";` + `@theme {`)와 `common/tailwind/tailwind.config.js`. 새 부품 묶음 quill 토큰은 `node_modules/@posthog/quill/dist/tokens.scoped.css` 로 들여온다.
- 2 공용 스타일 나누기: 부품 코드 옆에 부품마다 scss. `frontend/src/lib/lemon-ui/` scss 44개(`LemonButton/LemonButton.scss` · `LemonBadge/LemonBadge.scss` · `LemonBanner/LemonBanner.scss`), `frontend/src/lib/components/` scss 51개. 가운데 폴더 `frontend/src/styles/` 는 전역용 10개(base · fonts · global · lemon-skin · mixins · quill-bridge · utilities-legacy · vars .scss + css 2개). frontend/src 스타일 파일 전체 200개(scss 196 · css 4).
- 3 화면 전용: `frontend/src/scenes/<화면>/` 안 코드 옆 scss 72개(`scenes/session-recordings/player/` 6개 · `scenes/billing/` 5개, 예 `scenes/dashboard/DashboardItems.scss`). 공용은 `lib/`(lemon-ui · components · ui), 화면은 `scenes/`, 그 밖 `layout/` · `queries/` · `toolbar/` 합 14개.
- 4 import 순서 · @layer: `frontend/src/styles/index.tsx` — `import '@posthog/tailwind/tailwind.css'` → `import './global.scss'`(주석 「global.scss must load AFTER tailwind so our base styles win the cascade」). `global.scss`(16줄) — `base` → `fonts` → quill `tokens.scoped.css` → `base.scoped.css` → `primitives.css` → `quill-bridge` → `lemon-skin`. `base.scss` — `vars` → `mixins` → `utilities-legacy`(「TODO: Remove all legacy utilities」) → 변수 → `@layer components {`(1198줄, 기본 테두리색) → `@layer base {`(1208줄, 안에서 `react-toastify` import). 부품 · 화면 scss 는 각 tsx 가 import. 층 이름은 Tailwind 의 base · components.
- 5 글자 스타일: 따로 파일 없음. 글꼴 변수(`--font-sans` · `--font-title` · `--font-button` · `--font-mono`, 668–679줄)와 `body` · `h1`–`h5` 규칙(1292 · 1366줄~)이 `base.scss` 안. 크기 토큰 추가분은 `common/tailwind/tailwind.css` `@theme`(`--text-xxs: 0.625rem;`). `mixins.scss` 의 믹스인은 `@mixin screen($breakpoint)` 하나. `@font-face` 는 `styles/fonts.scss`(검사 `styles/fonts.test.ts`).
- 6 접근성 규칙: 모으는 파일 없음, 부품 · 화면 옆에 흩어 둠. 코드 검색(path:frontend/src) `prefers-reduced-motion` 31건 — `lib/lemon-ui/LemonDrawer/LemonDrawer.scss` · `lib/lemon-ui/LemonSkeleton/LemonSkeleton.scss` · `scenes/dashboard/DashboardItems.scss` · `styles/base.scss`(1건) · tsx/ts 여러 개. `common/tailwind/tailwind.css` 는 `@utility animate-fade-in` 등 4개 안에 `@media (prefers-reduced-motion: reduce)` 를 넣었다. `forced-colors` 0건 · `prefers-contrast` 0건. high-contrast 전용 파일 없음.
- 7 검사 도구: `.stylelintrc.js` — `extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order']`, `plugins: ['stylelint-order']`, 이름 규칙(`selector-class-pattern` 「Block__Element--Modifier」 · `keyframes-name-pattern` · `scss/dollar-variable-pattern`) · `order/order`. 안 쓰는 CSS · 변수 규칙은 설정에 없음. 실행 `package.json` `"lint:css": "stylelint \"(frontend|products)/**/*.{css,scss}\" --ignore-pattern \"products/desktop/**\""`. knip 은 `products/desktop/knip.json` 만(프런트 본체용은 잘린 트리에서 못 찾음). purgecss 못 찾음.

#### Sentry (B 소스)

- URL https://github.com/getsentry/sentry (master, 트리 sha b946db8a) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/getsentry_sentry.tree.json
- 1 토큰 파일: 정본은 JS(TS) 객체, CSS 변수 파일 아님. 종류별 3개 `static/packages/scraps/src/tokens/` — color.tsx(3,312줄) · size.tsx(375줄) · typography.tsx(91줄), 첫 줄 모두 「AUTOGENERATED BY @DESIGN-ENGINEERING / DO NOT EDIT THIS FILE MANUALLY」. 테마별 파일 `static/packages/scraps/src/theme/light.tsx` · `dark.tsx`(각 2,052줄, 자동 생성, `primary: color.white,`)와 묶는 `theme.tsx`(860줄, `lightTheme` · `darkTheme` · zIndex · motion). Emotion `theme` 으로 부품에 전달. 옛 LESS 변수는 `static/less/variables.less` · `palette.less`.
- 2 공용 스타일 나누기: 부품 코드 옆(CSS-in-JS, Emotion). `static/packages/scraps/src/<부품>/` 폴더마다 tsx(form 30 · compactSelect 26 · layout 19 · button 11 파일), 스타일은 같은 폴더 `styles.tsx`(`button/styles.tsx` · `text/styles.tsx`) 또는 부품 tsx 안 `styled`. `static/app/components/core/`(203파일)도 같은 꼴. 스타일시트 파일은 전체 36개(less 34 · css 2)뿐이고 그중 21개가 `static/less/includes/bootstrap/`.
- 3 화면 전용: `static/app/views/`(tsx 4,041개) 안 각 tsx 의 `styled` — 화면 전용 스타일 폴더 없음. 옛 LESS 는 한 폴더에 「Page specific」 2개(`static/less/auth.less` · `group-detail.less`). 전역 CSS-in-JS 는 `static/app/styles/`(global.tsx · animations.tsx · text.tsx · pulsingIndicator.tsx).
- 4 import 순서 · @layer: `static/less/sentry.less` — `variables.less` → `base.less` → 「Vendor components」 `includes/bootstrap.less` → 「Shared components」 `shared/alerts.less` · `shared/forms.less` → 「App components」 `shared-components.less` · `layout.less` · `fonts.less` · `misc.less` → 「Page specific」 `auth.less` · `group-detail.less`. `@layer` 안 씀. 새 코드는 진입 파일 없이 `static/app/styles/global.tsx` 의 `GlobalStyles`(Emotion `Global`)가 전역 규칙.
- 5 글자 스타일: 값은 `static/packages/scraps/src/tokens/typography.tsx`(`font.size.xs: '11px'`), 조합은 부품으로 — `static/packages/scraps/src/text/`(text.tsx · heading.tsx · prose.tsx · styles.tsx 의 `getFontSize` · `getLineHeight`). 옛 `static/app/styles/text.tsx` 는 「@deprecated Use `Text` from `@sentry/scraps/text` instead.」.
- 6 접근성 규칙: 전역 한 곳 + 부품 옆. `static/app/styles/global.tsx` 267줄 `@media (prefers-reduced-motion) { *, ::before, ::after { animation-duration: 0ms !important; …` 로 전체를 끄고, 부품 tsx 에도 있다. 코드 검색(path:static) `prefers-reduced-motion` 17건(`static/packages/scraps/src/spinner/spinner.tsx` · `statusIndicator/statusIndicator.tsx` · `toggleCard/toggleCard.tsx` · `static/less/shared-components.less` …), `forced-colors` 1건(lint 규칙 파일, 스타일 아님), `prefers-contrast` 0건. high-contrast 전용 파일 없음.
- 7 검사 도구: `stylelint.config.js` → `stylelint.base.js`(`customSyntax: 'postcss-styled-syntax'`, `extends: ['stylelint-config-recommended']`, `property-disallowed-list: ['grid-gap']`, 끄기 7개) — 안 쓰는 CSS · 변수 규칙 없음. `knip.config.ts`(`"knip": "knip"`) — 안 쓰는 파일 · export 검사, `project` 에 `static/**/*.{js,ts,tsx,mdx,less}` 를 넣되 `ignoreFiles: ['static/**/*.less']`. 직접 만든 lint 규칙 `static/oxlint/eslintPluginScraps/src/rules/` 14개(`useSemanticToken` 「`{{property}}` cannot use token `{{tokenPath}}`」 · `noTokenImport` 「Do not import scraps tokens directly - prefer using theme tokens.」 · `preferPrimitives`). purgecss 못 찾음.

#### Grafana (B 소스)

- URL https://github.com/grafana/grafana (main, 트리 sha 0f632f65) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/grafana_grafana.tree.json
- 1 토큰 파일: 정본은 JS(TS) 테마 객체, 종류별 만들기 함수 파일. `packages/grafana-data/src/themes/` — createColors.ts · createSpacing.ts · createShape.ts · createTypography.ts · createShadows.ts · createComponents.ts · createTransitions.ts · breakpoints.ts · zIndex.ts · palette.ts 를 `createTheme.ts` 가 묶는다(`const colors = createColors(colorsInput); const shape = createShape(shapeInput); …`). 테마별 값은 `themeDefinitions/*.json` 18개(`visual_refresh_dark.json` · `tritanopia_light.json` · `deut_prot_dark.json`). 옛 SCSS 변수는 생성물(`scripts/cli/generateSassVariableFiles.ts` + `scripts/cli/themeTemplates/_variables*.scss.tmpl.ts` 3개, 트리에 `variables.generated` 파일 자체는 없음).
- 2 공용 스타일 나누기: 부품 코드 옆(CSS-in-JS, Emotion). `packages/grafana-ui/src/components/` 부품 폴더 112개, 스타일은 부품 tsx 안 `getStyles` 함수(`Button/Button.tsx` 248줄 `export const getButtonStyles = (props: StyleProps) => {` · `Select/getSelectStyles.ts` · `Combobox/getComboboxStyles.ts`). 전역 규칙만 가운데 폴더 `packages/grafana-ui/src/themes/GlobalStyles/` 에 주제별 21개(elements.ts · forms.ts · card.ts · utilityClasses.ts). 스타일시트 파일은 전체 13개(css 10 · scss 3).
- 3 화면 전용: `public/app/features/<기능>/`(기능 폴더 60개, tsx 3,144개) 안 각 tsx 의 Emotion 스타일 — 화면 전용 스타일 폴더 없음. 공용은 `packages/grafana-ui`, 화면은 `public/app/features`. 전역 묶음 안에 화면 이름 파일도 있음(`GlobalStyles/dashboardGrid.ts` · `alerting.ts` · `queryEditor.ts`).
- 4 import 순서 · @layer: 옛 SCSS 진입 `public/sass/grafana.dark.scss` 는 3줄 — `@import 'variables.generated';` → `@import 'variables.dark.generated';` → `@import 'angular';`(light 도 같은 꼴). `_angular.scss`(2,587줄) 머리 주석 「these styles are only used by angular components/pages / once angular is disabled, this file can be deleted」. 새 전역은 `GlobalStyles/GlobalStyles.tsx` 의 배열 순서 — accessibility → alerting → code → dashDiff → dashboardGrid → elements → filterTable → fonts → forms → jsonFormatter → card → markdown → page → queryEditor → skeleton → slate → uPlot → utilityClasses → legacySelect → hacks. `@layer` 안 씀.
- 5 글자 스타일: 테마 객체 안 `packages/grafana-data/src/themes/createTypography.ts` — 조합(variant)을 함수로 만든다(`h1: buildVariant(typographyInput.h1, fontFamily, fontWeightRegular, 28, 32, -0.25),` · `bodySmall: buildVariant(…, 12, 18, 0.15),`). 쓰는 쪽은 부품 `packages/grafana-ui/src/components/Text/`. `@font-face` 는 `GlobalStyles/fonts.ts`.
- 6 접근성 규칙: 도우미 함수 한 곳 + 부품 옆. 줄인 움직임은 `createTransitions.ts` 의 `handleMotion`(``return `@media ${props.map((prop) => `(prefers-reduced-motion: ${prop})`).join(',')}`;``)을 부품이 부르고, lint 규칙 `packages/grafana-eslint-rules/rules/no-unreduced-motion.cjs`(README 「Avoid direct use of `animation*` or `transition*` properties.」)가 강제. 코드 검색(리포 전체) `prefers-reduced-motion` 14건 · `forced-colors` 8건(`packages/grafana-ui/src/themes/mixins.ts` 의 초점 테두리 믹스인 + 부품 7개: Switch.tsx · MenuItem.tsx · RadioButton.tsx …) · `prefers-contrast` 2건(getSelectStyles.ts · getComboboxStyles.ts). `GlobalStyles/accessibility.ts` 는 `.sr-only` 뿐. high-contrast 전용 스타일 파일 없음(색각 테마는 `themeDefinitions/deut_prot_*.json` · `tritanopia_*.json`).
- 7 검사 도구: `stylelint.config.js` — `extends: ['stylelint-config-sass-guidelines']` + 끄기 20여 개, `declaration-block-no-duplicate-properties`. 안 쓰는 CSS · 변수 규칙 없음(`package.json` 의 `lint` 는 eslint 만, stylelint 스크립트 못 찾음). `knip.config.ts`(`"knip": "… knip --no-config-hints"`, knip ^6.14.2) — 안 쓰는 파일 · export. 직접 만든 eslint 규칙 `packages/grafana-eslint-rules/rules/` 12개(`no-border-radius-literal` · `no-invalid-css-properties` · `theme-token-usage` 「Used to find all instances of `theme` tokens being used in the codebase and emit the counts as metrics.」, 실행 `"themes:usage"`). purgecss 못 찾음.

#### Element Web (B 소스)

- URL https://github.com/element-hq/element-web (develop, 트리 sha b9ce553d) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/element-hq_element-web.tree.json · 지시의 `res/css` 는 지금 `apps/web/res/css`
- 1 토큰 파일: 테마별 파일. `apps/web/res/themes/<테마>/css/` — light/_light.pcss(356줄, SCSS 변수 168개 · CSS 변수 1개) · dark/_dark.pcss(297줄, `$primary-content: var(--cpd-color-text-primary);`) · light-high-contrast/_light-high-contrast.pcss(220줄) · legacy-light · legacy-dark · light-custom · dark-custom. 어두운 · 고대비 테마는 `_light.pcss` 를 먼저 싣고 자기 파일로 덮어쓴다. 원시 토큰은 리포 밖 패키지(`@vector-im/compound-design-tokens/assets/web/css/compound-design-tokens.css`, `--cpd-*`). 글자 크기 변수는 따로 `apps/web/res/css/_font-sizes.pcss`(49줄, `$font-12px: 0.75rem;`), 앱 공통 CSS 변수는 `_common.pcss` 의 `:root`(`--transition-short: 0.1s;`).
- 2 공용 스타일 나누기: 가운데 폴더에 부품마다 파일, React 폴더 구조를 그대로 비춘다. `apps/web/res/css/` — views/ 264개(dialogs 58 · rooms 49 · settings 44 · elements 38 …, 예 `views/elements/_ToggleSwitch.pcss`) · components/ 49개(`components/views/beacon/_BeaconStatus.pcss`) · structures/ 38개(`structures/_ContextualMenu.pcss`) · compound/ 2개. 새 공용 부품 패키지는 부품 옆 CSS Modules — `packages/shared-components/src/` css 101개(`audio/PlayPauseButton/PlayPauseButton.module.css`). 스타일 파일 전체 485개(pcss 376 · css 109).
- 3 화면 전용: 공용과 가르는 폴더 이름은 `structures/`(화면 틀 · 큰 구조, `structures/_RoomView.pcss`)와 `views/<영역>/`(rooms · settings · dialogs · auth …). 공용 낱개 부품은 `views/elements/`. 모두 같은 `apps/web/res/css/` 아래.
- 4 import 순서 · @layer: 테마 진입 `apps/web/res/themes/light/css/light.pcss` — 첫 줄 `@layer compound-tokens, compound-web, shared-components, app-web;` → `_font-sizes.pcss` → `_fonts.pcss` → `_light.pcss` → `_mods.pcss` → `_components.pcss` → highlight.js · github-markdown css, 모두 `layer(app-web)`. dark.pcss 는 `_light.pcss` 뒤에 `_dark.pcss` 한 줄이 더 있다. `apps/web/res/css/_index.pcss` — `@layer normalize, compound-legacy, compound-tokens, compound-web, shared-components, app-web;` → maplibre(app-web) → compound-design-tokens(`layer(compound-tokens)`) → compound-web(`layer(compound-web)`) → shared-components css. `_components.pcss`(356줄)는 「autogenerated by rethemendex.sh」 — `find . -iname _\*.pcss | … | LC_ALL=C sort` 로 알파벳순: `_animations` → `_common` → `_font-sizes` → components/ 49 → compound/ 2 → structures/ 37 → views/ 264.
- 5 글자 스타일: 조합은 리포 밖 Compound 토큰의 `font` 단축 변수를 쓴다(`font: var(--cpd-font-body-md-regular);` · `.mx_Heading_h1 { font: var(--cpd-font-heading-xl-semibold); }`). 리포 안은 크기 변수 파일 `apps/web/res/css/_font-sizes.pcss`(주석 「Compound equivalent: --cpd-font-size-body-xs」), 제목 클래스 `apps/web/res/css/views/typography/_Heading.pcss` 1개, `@font-face` 는 `themes/light/css/_fonts.pcss`. 믹스인(`@define-mixin`)은 `_common.pcss` 에 있으나 글자용은 못 찾음.
- 6 접근성 규칙: 줄인 움직임은 공통 파일 두 곳에 모으고(`_common.pcss` 79줄 `@media (prefers-reduced-motion) { :root { --transition-short: 0; --transition-standard: 0; } }`, `_animations.pcss` 63줄 「Override all keyframes in reduced-motion」) 일부만 부품 옆. 코드 검색(리포 전체) `prefers-reduced-motion` 7건(위 2개 + `views/elements/_ImageView.pcss` + shared-components module.css 2개 + ts 2개), `forced-colors` 1건(`views/rooms/_VoiceRecordComposerTile.pcss`), `prefers-contrast` 3건(모두 ts: `apps/web/src/settings/watchers/ThemeWatcher.ts` 45줄 `matchMedia("(prefers-contrast: more)")` 로 테마를 바꿈). high-contrast 전용 테마 파일 있음: `apps/web/res/themes/light-high-contrast/css/light-high-contrast.pcss` + `_light-high-contrast.pcss`.
- 7 검사 도구: `apps/web/.stylelintrc.cjs` — `extends: ["stylelint-config-standard"]`, `plugins: ["stylelint-scss", "stylelint-value-no-unknown-custom-properties"]`, `csstools/value-no-unknown-custom-properties`(정의 안 된 CSS 변수 사용을 막음, `importFrom` 에 `_common.pcss` · `_light.pcss` · Compound css 4개 등). 안 쓰는 CSS 는 도구 없이 찾아 바꾸기 — 주석 「Disable `&_kind`-style selectors while our unused CSS approach is "Find & Replace All" rather than a CI thing」(`selector-nested-pattern`). 실행 `"lint:style": "stylelint \"res/**/*.pcss\""`. `knip.ts`(knip 6.43.0, `"lint:knip": "knip --no-tag-hints && knip --strict …"`) — project 에 `pcss` 포함(안 쓰는 파일). 사용자 스크립트 `scripts/find-unused-settings.ts` 는 설정 항목용(CSS 아님). purgecss 못 찾음.

#### Zulip (B 소스)

- URL https://github.com/zulip/zulip (main) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/zulip_zulip.tree.json
- 1 토큰 파일: 앱은 한 파일 `web/styles/app_variables.css`(3,371줄, `:root {` 안에 팔레트 `--grey-0: #f7f8fc;` 부터 역할 변수까지). 다크는 같은 파일에서 `light-dark(` 567회 + 끝의 `%dark-theme { … }` 를 `:root.dark-theme { @extend %dark-theme; }` 로 붙임. 마케팅 쪽은 따로 `web/styles/portico/portico_variables.css`(41줄). 분기점 값은 JS `web/src/css_variables.ts` 를 postcss-simple-vars 로 주입(`web/postcss.config.js`).
- 2 공용 스타일 나누기: 가운데 폴더 `web/styles/` 한 곳에 css 68개(앱 44 · portico 24), 부품 코드 옆 파일 없음. 묶음 파일과 부품 파일이 섞임 — `web/styles/components.css`(133줄) · `web/styles/app_components.css`(1,457줄) · `web/styles/buttons.css` · `web/styles/inputs.css` · `web/styles/banners.css` · `web/styles/modal.css`.
- 3 화면 전용: 같은 `web/styles/` 에 기능 이름 파일로 나란히(`settings.css` · `compose.css` · `left_sidebar.css` · `recent_view.css` · `inbox.css`), 공용과 가르는 하위 폴더 없음. 폴더로 가른 것은 로그인 밖 · 마케팅 쪽 `web/styles/portico/` 하나.
- 4 import 순서 · @layer: CSS 진입 파일 없이 JS 번들이 순서를 정함. `web/src/bundles/common.ts`(글꼴 → `alerts.css` · `blueslip.css` · `modal.css` · `progress_bar.css` · `pygments.css`) 다음 `web/src/bundles/app.ts`: 서드파티(tippy · katex · flatpickr · `bootstrap.app.css`) → `typeahead.css` → `app_variables.css` → `tooltips.css` → `buttons.css` → `inputs.css` → `banners.css` → `components.css` → `app_components.css` → `rendered_markdown.css` → `zulip.css` → 기능 파일들(`message_view_header.css` … `recent_view.css`) → `dark_theme.css` → `user_status.css` · `widgets.css` · `print.css` · `inbox.css` · `color_picker.css` · `animate.css`. `@layer` 는 `web/styles` 68개에서 0회.
- 5 글자 스타일: 따로 파일 없음. `app_variables.css` 안 변수(`--base-font-size-px: 14px;` · `--base-line-height-unitless: 1.214;` · `--font-weight-sidebar-heading: 600;` · `--font-size-sidebar-action-heading: 1.0625em;`)로, 부품 이름이 붙은 낱개 변수.
- 6 접근성 규칙: 모은 파일 없음. 코드 검색 `prefers-reduced-motion` 2파일(`web/styles/zulip.css` 2곳 · `web/styles/app_components.css` 1곳, 쓰는 자리 옆), `forced-colors` 0건, `prefers-contrast` · `high-contrast` 는 받은 68개 grep 0건. high-contrast 전용 파일 없음.
- 7 검사 도구: `stylelint.config.js`(`stylelint-config-standard` + `stylelint-high-performance-animation`; 규칙 `color-no-hex: true` · `color-named: "never"` · `function-disallowed-list: ["rgb"]` · `declaration-property-value-disallowed-list` — 안 쓰는 선택자 · 변수 규칙은 없음). 사용자 스크립트 `tools/find-unused-css`(`web/styles/zulip.css` 의 id · class 이름을 `git grep` 해 다른 파일에 없으면 출력, 주석 "Hackish tool"). purgecss · knip 은 트리에서 못 찾음.

#### Plausible Analytics (B 소스)

- URL https://github.com/plausible/analytics (master) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/plausible_analytics.tree.json
- 1 토큰 파일: 따로 토큰 파일 없음. Tailwind 4 의 `@theme { … }` 블록이 진입 파일 `assets/css/app.css` 230–286줄에 있음(`--color-gray-50: var(--color-zinc-50);` · `--color-gray-750: rgb(50 50 54);` · `--default-ring-width: 2px;`). 주석 "Color aliases from tailwind.config.js", tailwind.config 파일은 트리에 없음. 다크는 `@custom-variant dark (&:where(.dark, .dark *));` + 클래스 안 `dark:`.
- 2 공용 스타일 나누기: css 는 가운데 폴더 `assets/css/` 에 5개뿐(`app.css` 452줄 · `flatpickr-colors.css` 252 · `modal.css` 53 · `loader.css` 50 · `tooltip.css` 44). 버튼 · 입력 공용 클래스(`.btn-base` · `.btn-theme-primary` · `.input-base`)는 `app.css` 의 `@layer components { … }` 안에 `@apply` 로. 나머지 부품은 Tailwind 클래스를 쓴 코드 파일(`assets/js/dashboard/components/` 26개 · `lib/plausible_web/components/` 24개).
- 3 화면 전용: 화면 전용 css 파일 · 폴더 없음(트리 전체 css 5개). 화면 스타일은 템플릿 · 컴포넌트 안 Tailwind 클래스.
- 4 import 순서 · @layer: `assets/css/app.css` — `@import 'tailwindcss' source(none);` → `@import 'flatpickr/dist/flatpickr.min.css' layer(components);` → `./modal.css` → `./loader.css` → `./tooltip.css` → `./flatpickr-colors.css`(모두 `layer(components)`) → `@plugin "@tailwindcss/forms";` → `@source` 4줄 → `@layer base { … }` → `@layer components { … }` 2번 → `@utility` → `@theme` → `@media print` → `@custom-variant` 들. `@layer` 씀, 층 이름 `base` · `components`(Tailwind 기본 층).
- 5 글자 스타일: 따로 두는 곳 없음. `app.css` 의 `.btn-base` 가 `text-sm font-medium` 을 `@apply` 하는 식으로 Tailwind 유틸리티 그대로. `@theme` 에 글자 변수 없음.
- 6 접근성 규칙: `assets/css/` 5개 grep 에서 `prefers-reduced-motion` · `forced-colors` · `prefers-contrast` · `high-contrast` · `motion-reduce` 모두 0건. 포커스 링은 `app.css` `@layer base` 의 `*:focus-visible { @apply ring-2 ring-indigo-500 ring-offset-2 … }` 한 곳. js · heex 안 클래스는 미확인(코드 검색 제한).
- 7 검사 도구: `assets/.stylelintrc.json`(`stylelint-config-standard`; `import-notation` · `at-rule-no-unknown`(Tailwind at-rule 무시) · `at-rule-empty-line-before` · `no-descending-specificity: null`), 스크립트 `"stylelint": "stylelint css/**"`. 안 쓰는 CSS 검사 규칙 · purgecss · knip 은 트리에서 못 찾음(쓰는 클래스 고르기는 Tailwind `@source` 4줄).

#### Outline (B 소스)

- URL https://github.com/outline/outline (main) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/outline_outline.tree.json
- 1 토큰 파일: css · scss 파일 0개. 토큰 정본은 JS 테마 객체 한 파일 `shared/styles/theme.ts`(297줄) — `const defaultColors: Colors = { almostBlack: "#111319", … }` · `spacing = { sidebarWidth: 260, … }` · `buildBaseTheme` 에 `fontFamily` · `fontWeightRegular: 400`, 같은 파일에 `buildLightTheme` · `buildDarkTheme` · `buildPitchBlackTheme`. z-index 는 `shared/styles/depths.ts`, 분기점은 `shared/styles/breakpoint.ts`. styled-components `ThemeProvider` 로 주입(`app/components/Theme.tsx`).
- 2 공용 스타일 나누기: 부품 코드 옆(같은 tsx 안 styled-components). `app/components/` 343파일 · `shared/components/` 19파일, 예 `app/components/Button.tsx`(`const RealButton = styled(ActionButton)…`) · `app/components/Heading.ts` · `shared/components/Text.tsx`. 공용 믹스인은 `shared/styles/index.ts`(`ellipsis` · `s` · `hideScrollbars` · `borderRadius` · `hairline` · `extraArea` · `truncateMultiline`)와 `app/styles/index.ts` · `app/styles/animations.ts`(keyframes).
- 3 화면 전용: `app/scenes/`(188파일, 그 가운데 `app/scenes/<화면>/components/` 아래 124파일)에 화면 코드와 스타일이 함께. 공용은 `app/components/` · `shared/components/`, 화면은 `app/scenes/`.
- 4 import 순서 · @layer: CSS 진입 파일 없음. `shared/styles/globals.ts` 의 `createGlobalStyle` 한 덩어리: `${normalize}`(`shared/styles/normalize.ts`) → `* { box-sizing }` → `html { --line-height-body: 1.5; --font-size-body: 16px; }` → body · 글꼴 → `a` → `h1`–`h6` → `:focus-visible` → `:root` safe-area 변수 → `@media (prefers-reduced-motion: reduce)` → 에디터 전역 클래스 → `@media print`. `app/components/Theme.tsx` 가 `<ThemeProvider>` 안에서 `<GlobalStyles />` 를 먼저 그림. `@layer` 는 연 파일에서 0회.
- 5 글자 스타일: 부품으로. `shared/components/Text.tsx` 의 `fontSizes = { xlarge: 26, large: 18, medium: 16, small: 14, xsmall: 13 }` + `textSizeStyles()` 믹스인과 `size` · `weight` · `type` props. 제목 크기는 `globals.ts` 에 직접(`h1 { font-size: 36px; }` … `h5 { font-size: 16px; }`), 글꼴 · 굵기 값은 `theme.ts`.
- 6 접근성 규칙: 코드 검색 `prefers-reduced-motion` 1파일 — 전역 `shared/styles/globals.ts` 한 곳(`*, *::before, *::after { animation-duration: 0.01ms !important; … }`). `forced-colors` 0건. `prefers-contrast` 0건(코드 검색). high-contrast 전용 파일은 트리에서 못 찾음.
- 7 검사 도구: stylelint 없음. `.oxlintrc.json`(루트 · app · server · shared)에 `no-unused-vars: "error"` 등 JS 규칙만, 스크립트 `"lint": "oxlint --type-aware app server shared plugins"`. CSS 전용 검사 · purgecss · knip 은 트리에서 못 찾음.

#### Excalidraw (B 소스)

- URL https://github.com/excalidraw/excalidraw (master) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/excalidraw_excalidraw.tree.json
- 1 토큰 파일: 종류별 두 파일. SCSS 변수 · 믹스인은 `packages/excalidraw/css/variables.module.scss`(252줄, `$color-red-1: #ffe3e3;` … 과 `@mixin outlineButtonStyles` 등), CSS 변수는 `packages/excalidraw/css/theme.scss`(279줄, `.excalidraw { --button-gray-1: #{$color-gray-2}; --color-surface-high: #f1f0ff; … }`). 다크는 같은 `theme.scss` 안 `&.theme--dark { … }`(184줄부터). z-index 변수(`--zIndex-canvas: 1;` …)와 `--ui-font` 는 `packages/excalidraw/css/styles.scss` 의 `:root`.
- 2 공용 스타일 나누기: 부품마다 파일을 부품 코드 옆에. `packages/excalidraw/components/` 아래 scss 72개(예 `packages/excalidraw/components/Button.scss` · `Avatar.scss` · `Card.scss` · `TopPicksDnD/TopPicksDnD.scss`), 각 파일이 `@use "../css/theme" as *;` 로 시작. 가운데 폴더 `packages/excalidraw/css/` 에는 4개(`app.scss` 37줄 · `styles.scss` 1,082줄 · `theme.scss` · `variables.module.scss`).
- 3 화면 전용: 화면 구분이 없는 단일 에디터. 패키지(라이브러리) 스타일은 `packages/excalidraw/`, 호스팅 앱 전용은 `excalidraw-app/`(scss 4개: `excalidraw-app/index.scss` 158줄 · `components/AppSidebar.scss` · `collab/` 1 · `share/` 1)로 가름.
- 4 import 순서 · @layer: JS 진입 `packages/excalidraw/index.tsx` 가 `import "./css/app.scss";` → `import "./css/styles.scss";` → `import "./fonts/fonts.css";` 순서. `styles.scss` 는 `@use "./variables.module" as *;` → `@use "./theme";` → `:root { z-index 변수 }` → 전역 `.excalidraw` 규칙. `theme.scss` 는 `@use "sass:color";` → `@use "./variables.module" as *;` → `@forward "./variables.module";`. 부품 scss 는 각 tsx 가 import. `@layer` 는 packages · excalidraw-app 의 css · scss 83개에서 0회.
- 5 글자 스타일: 따로 파일 · 타이포 믹스인 없음. 글꼴 변수 `--ui-font` 가 `styles.scss` 42줄(과 `components/Tooltip.scss` 5줄에 한 번 더), 글자 크기는 부품 파일과 믹스인 안에 직접(`variables.module.scss` 의 `font-size: 0.75rem;`). 글꼴 선언은 `packages/excalidraw/fonts/fonts.css`.
- 6 접근성 규칙: 모은 파일 없음, 부품 옆. 받은 83개 grep 에서 `prefers-reduced-motion` 2파일(`packages/excalidraw/components/FileDropOverlay.scss` · `packages/excalidraw/components/TopPicksDnD/TopPicksDnD.scss`), `forced-colors` · `prefers-contrast` 0건. `high-contrast` 는 `CursorHint.scss` 주석 1건뿐(미디어 쿼리 아님). 전용 파일 없음. `.visually-hidden` 은 `css/app.scss`. tsx 안 인라인 스타일은 미확인.
- 7 검사 도구: stylelint · purgecss · knip 설정은 트리에서 못 찾음. `package.json` 검사 스크립트는 `test:code`(eslint) · `test:other`(prettier) · `test:typecheck`(tsc) · `test:app`(vitest)로 CSS 전용 항목 없음.

#### Penpot (B 소스)

- URL https://github.com/penpot/penpot (develop) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/penpot_penpot.tree.json
- 1 토큰 파일: 종류별 여러 파일이 두 벌. 새 디자인 시스템 `frontend/src/app/main/ui/ds/` 에 `colors.scss`(150줄, `$mint-150: #7efff5;` 팔레트 + `:global(.light) { --color-accent-primary: #{$purple-700}; … }` · `:global(.default) { … }` 테마 둘이 한 파일) · `spacing.scss`(`--sp-xxs`) · `typography.scss` · `z-index.scss` · `elevations.scss` · `_sizes.scss` · `_borders.scss`. 옛 것은 `frontend/resources/styles/common/refactor/` 에 `color-defs.scss`(59줄) · `design-tokens.scss`(400줄, `.light, .default { --button-foreground-hover: var(--color-accent-primary); … }`) · `spacing.scss` · `fonts.scss` · `borders.scss` · `shadows.scss` · `opacity.scss` · `z-index.scss`, 테마별 파일 `themes/default-theme.scss` · `themes/light-theme.scss`.
- 2 공용 스타일 나누기: 부품마다 파일을 부품 코드 옆에, 묶음 폴더로 가름. `frontend/src/app/main/ui/ds/` scss 51개(예 `ds/buttons/button.scss` 옆에 `button.cljs` · `button.stories.jsx`, `ds/controls/input.scss`, `ds/notifications/toast.scss`; 폴더 buttons · controls · foundations · layout · notifications · product · tooltip · utilities). 옛 공용 부품은 `frontend/src/app/main/ui/components/` scss 16개(`button_link.scss` 등). 전역 묶음은 `frontend/resources/styles/` 27개.
- 3 화면 전용: 기능 폴더에 cljs 옆 scss(CSS Modules 로 컴파일). `frontend/src/app/main/ui/workspace/` 117개 · `inspect/` 25 · `releases/` 22 · `dashboard/` 21(`dashboard/sidebar.cljs` + `sidebar.scss`) · `settings/` 13. 공용은 `ui/ds/` · `ui/components/`, 화면은 `ui/<기능>/`. `frontend/src/app` 아래 scss 합계 304.
- 4 import 순서 · @layer: 진입 `frontend/resources/styles/main-default.scss` — `@forward "common/dependencies/reset";` → `"common/refactor/color-defs"` → `"common/dependencies/fonts"` → `"common/dependencies/animations"` → `"common/dependencies/highlight"` → `"common/dependencies/storybook"` → `"common/refactor/themes"` → `"common/refactor/design-tokens"` → `"common/base"` → `"main/partials/texts"`. 빌드 스크립트 `frontend/scripts/_helpers.js` 의 `compileSassAll` 이 `main-default.scss` 다음 `[...oldComponentsFiles, ...dsFiles, ...appFiles]` 순서로 파일마다 `{ modules: true }` 컴파일. `@layer` 는 받은 78개(resources/styles 27 + ds 51)에서 0회.
- 5 글자 스타일: 따로 파일 + 믹스인. `frontend/src/app/main/ui/ds/typography.scss`(139줄)에 `@mixin _font-style-display { font-family … font-weight … line-height … font-size: $_fs-36; }` 같은 조합과 `@mixin use-typography($typography-name)`, 부품은 `@include use-typography("headline-small");`. 클래스 판은 `ds/foundations/typography/text.scss` · `heading.scss`(`.display-typography { @include t.use-typography("display"); }`). 옛 크기 변수는 `resources/styles/common/refactor/fonts.scss`(`$fs-12` · `$fw400`).
- 6 접근성 규칙: 코드 검색 `prefers-reduced-motion` 0건 · `forced-colors` 0건 · `prefers-contrast` 0건(저장소 전체). `high-contrast` 는 받은 78개 grep 0건, 전용 파일은 트리에서 못 찾음. 포커스 믹스인은 한 파일 `frontend/resources/styles/common/refactor/focus.scss`(`@mixin focus-type($type)` · `focus-primary` · `focus-secondary`).
- 7 검사 도구: `frontend/stylelint.config.mjs`(`stylelint-config-standard-scss` + `stylelint-scss` · `stylelint-plugin-logical-css`; `selector-max-specificity: "1,2,1"` · `selector-max-compound-selectors: 3` · `selector-max-type: 1` · `color-named: "never"` · `declaration-property-unit-allowed-list`(`font-size` 는 rem · lh) · `font-weight-notation: "numeric"`), 스크립트 `"lint:scss": "pnpm exec stylelint '{src,resources}/**/*.scss'"`. 안 쓰는 선택자 · 변수 규칙, purgecss · knip 은 트리에서 못 찾음.

#### velog (velog-client) (B 소스)

- URL https://github.com/velopert/velog-client (master) · 확인 날짜 2026-11-11 · 원자료 ~/noslog-research/2026-11-11-foundation-structure/b/velopert_velog-client.tree.json
- 1 토큰 파일: JS 객체가 정본, 종류별 여러 파일 `src/lib/styles/`(9개). 테마 색은 `themes.ts`(175줄) 한 파일에 light · dark 두 세트(`bg_page1` · `text1` · `border1` · `primary1` …)를 두고 `buildCssVariables` 가 `--bg-page1: …;` CSS 변수 문자열로 바꿈, 부품은 `themedPalette.text1`(= `var(--text1)`)로 씀. 원색 팔레트 `palette.ts`(`teal0: '#F3FFFB'` …), 분기점 `media.ts`, z-index `zIndexes.ts`, 전환 `transitions.ts`.
- 2 공용 스타일 나누기: 부품 코드 옆(같은 tsx 안 styled-components). `src/components/` 243파일, 공용은 `src/components/common/`(51파일, tsx 49개; 예 `src/components/common/Button.tsx` 의 `const ButtonBlock = styled.button…`). 공용 css 조각은 `src/lib/styles/utils.ts`(`ellipsis`) · `postStyles.ts` · `prismThemes.ts`. css 파일은 트리 전체 6개(`src/App.css` · `src/index.css` · `src/typography.css` · `src/components/common/atom-one-dark.css` · `atom-one-light.css` · `src/lib/jazzbar/Jazzbar.css`).
- 3 화면 전용: 화면 전용 스타일 폴더 없음. 기능 폴더 `src/components/<기능>/`(write 49 · post 36 · velog 28 · base 16 · setting 12 · home 11 …)의 tsx 안에 스타일이 함께, 라우트는 `src/pages/`(29파일), 연결 코드는 `src/containers/`. 공용은 `components/common`.
- 4 import 순서 · @layer: `src/index.tsx` 가 css 로는 `import './typography.css';`(Fira Mono `@font-face`)만 import. 전역 스타일은 `src/GlobalStyles.ts` 의 `createGlobalStyle`(53줄): `body`(글꼴 · `color: ${themedPalette.text1}`) → `* { box-sizing: inherit }` → `code` → `input, button, textarea` → `html, body, #root` → `body { ${themes.light} }` → `@media (prefers-color-scheme: dark) { body { ${themes.dark} } }` → `body[data-theme='light']` → `body[data-theme='dark']`. 쓰는 곳은 `src/containers/base/Core.tsx`(코드 검색). `@layer` 는 받은 파일에서 0회.
- 5 글자 스타일: 타이포 조합을 두는 파일 없음. 글꼴은 `GlobalStyles.ts` 의 `body { font-family: … }` 에 직접, `src/typography.css` 는 `@font-face` 선언만, `src/lib/styles/utils.ts` 의 `customFont` 는 주석만 든 빈 조각. 크기 · 굵기는 부품마다 직접(`Button.tsx` 의 `font-weight: bold;`).
- 6 접근성 규칙: 받은 파일(css 6 · `GlobalStyles.ts` · `src/lib/styles` 9 · `Button.tsx`) grep 에서 `prefers-reduced-motion` 1건 — `src/App.css` 10줄 `@media (prefers-reduced-motion: no-preference)`(`.App-logo` 규칙, 이 파일을 import 하는 곳은 `src/index.tsx` · `src/App.tsx` 에서 못 찾음), `forced-colors` · `prefers-contrast` · `high-contrast` 0건. 나머지 tsx 안 styled-components 는 미확인(코드 검색 제한으로 못 돌림). 전용 파일은 트리에서 못 찾음.
- 7 검사 도구: stylelint · purgecss · knip 설정은 트리에서 못 찾음. `package.json` 에 `eslintConfig`(`react-app` 확장)와 `.prettierrc` 만.

### 집계

갈래 A 와 B 는 따로 센다. 같은 곳이 여러 방식에 들 수 있는 칸(3 다크 · 6 접근성 고대비 · 7 검사)은 합이 분모를 넘는다.

#### 갈래 A — 운영 사이트 실측

분모 43곳(연 곳 45 · 막힘 2: X · Stack Overflow). 아래 수는 한 쪽이 받은 CSS 만 본 것이다.

| 칸 · 방식                                                              | 곳 수 | 곳                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 변수 1,000개 이상                                                    | 9     | GitHub · GitLab · Stripe Docs · Notion · Discord · Twitch · YouTube · Airbnb · 네이버                                                                                                                                                                                                                           |
| 1 변수 300–999개                                                       | 19    | Linear · Spotify · Reddit · Mastodon(mastodon.social) · Chess.com · osu! · Steam Community · Atlassian · Shopify · Booking.com · DEV(dev.to) · 토스 · 당근 · Mercari · pixiv · Cloudflare · Supabase · Tailwind CSS · Cal.com                                                                                   |
| 1 변수 100–299개                                                       | 9     | Vercel · Figma · Lichess · Wikipedia · 카카오(다음) · Sentry · PostHog · Raycast · velog                                                                                                                                                                                                                        |
| 1 변수 1–99개                                                          | 5     | Slack · Bluesky · Medium · LINE · note                                                                                                                                                                                                                                                                          |
| 1 변수 0개                                                             | 1     | niconico                                                                                                                                                                                                                                                                                                        |
| 2 숫자 단계 · 역할 · 부품 이름이 모두 10개 이상                        | 25    | GitHub · GitLab · Linear · Stripe Docs · Notion · Discord · Twitch · YouTube · Reddit · Mastodon(mastodon.social) · Lichess · Chess.com · osu! · Steam Community · Shopify · Airbnb · DEV(dev.to) · 네이버 · 토스 · 당근 · pixiv · Cloudflare · Supabase · Raycast · velog                                      |
| 2 숫자 단계 + 역할만 10개 이상(부품 10개 미만)                         | 6     | Vercel · Bluesky · 카카오(다음) · Sentry · Tailwind CSS · Cal.com                                                                                                                                                                                                                                               |
| 2 역할 10개 이상, 숫자 단계 10개 미만                                  | 8     | Figma · Spotify · Atlassian · Booking.com · Medium · Wikipedia · Mercari · PostHog                                                                                                                                                                                                                              |
| 2 그 밖(역할 10개 미만)                                                | 4     | Slack · LINE · niconico · note                                                                                                                                                                                                                                                                                  |
| 2 역할 변수가 숫자 단계 변수를 var() 로 가리킴(1개 이상)               | 21    | GitHub · GitLab · Linear · Stripe Docs · Notion · Discord · Twitch · YouTube · Reddit · Bluesky · Mastodon(mastodon.social) · Chess.com · osu! · Steam Community · Airbnb · DEV(dev.to) · 네이버 · 당근 · Cloudflare · Tailwind CSS · Raycast                                                                   |
| 2 부품 이름 변수 50개 이상                                             | 20    | GitHub · GitLab · Linear · Notion · Discord · Spotify · Twitch · YouTube · Reddit · Chess.com · osu! · Atlassian · Shopify · Airbnb · Booking.com · DEV(dev.to) · 네이버 · 토스 · 당근 · Mercari                                                                                                                |
| 3 다크: 속성 선택자(`[data-theme]` · `[data-color-mode]` 등)           | 17    | GitHub · Linear · Vercel · Figma · Mastodon(mastodon.social) · Atlassian · Shopify · Airbnb · Booking.com · Medium · 네이버 · 토스 · 카카오(다음) · 당근 · pixiv · Supabase · velog                                                                                                                             |
| 3 다크: 클래스(`.dark` · `.dark-theme` 등)                             | 18    | GitLab · Vercel · Spotify · Twitch · Reddit · Bluesky · Lichess · Chess.com · DEV(dev.to) · Wikipedia · Mercari · Cloudflare · Supabase · Sentry · PostHog · Tailwind CSS · Cal.com · note                                                                                                                      |
| 3 다크: `prefers-color-scheme` 함께 씀(2회 이상)                       | 9     | GitHub · Reddit · DEV(dev.to) · Wikipedia · 당근 · Mercari · pixiv · Tailwind CSS · note                                                                                                                                                                                                                        |
| 3 다크: `light-dark()` 씀                                              | 2     | Medium · Cloudflare                                                                                                                                                                                                                                                                                             |
| 3 다크: 층 이름으로                                                    | 1     | Notion                                                                                                                                                                                                                                                                                                          |
| 3 다크: 전환 선택자 못 봄(한 벌이거나 마케팅 쪽)                       | 7     | Discord · Slack · osu! · Steam Community · LINE · niconico · Raycast                                                                                                                                                                                                                                            |
| 3 다크: 미확인                                                         | 2     | Stripe Docs · YouTube                                                                                                                                                                                                                                                                                           |
| 4 @layer 씀                                                            | 14    | GitHub · Linear · Vercel · Notion · Spotify · Steam Community · Shopify · 토스 · Cloudflare · Supabase · Sentry · PostHog · Tailwind CSS · Cal.com                                                                                                                                                              |
| 4 그중 Tailwind 층(properties · theme · base · components · utilities) | 8     | Vercel · Shopify · Cloudflare · Supabase · Sentry · PostHog · Tailwind CSS · Cal.com                                                                                                                                                                                                                            |
| 4 그중 직접 이름 붙인 층                                               | 6     | GitHub · Linear · Notion · Spotify · Steam Community · 토스                                                                                                                                                                                                                                                     |
| 4 @layer 0회                                                           | 29    | GitLab · Stripe Docs · Figma · Discord · Slack · Twitch · YouTube · Reddit · Bluesky · Mastodon(mastodon.social) · Lichess · Chess.com · osu! · Atlassian · Airbnb · Booking.com · Medium · DEV(dev.to) · Wikipedia · 네이버 · 카카오(다음) · 당근 · LINE · Mercari · pixiv · niconico · Raycast · velog · note |
| 5 안 읽는 변수 40% 이상                                                | 10    | Stripe Docs · Discord · Twitch · YouTube · Chess.com · Medium · 네이버 · 토스 · 카카오(다음) · pixiv                                                                                                                                                                                                            |
| 5 안 읽는 변수 20–39%                                                  | 13    | GitHub · GitLab · Linear · Figma · Reddit · Lichess · Atlassian · Shopify · Wikipedia · Tailwind CSS · Raycast · Cal.com · velog                                                                                                                                                                                |
| 5 안 읽는 변수 20% 미만                                                | 19    | Vercel · Notion · Slack · Spotify · Bluesky · Mastodon(mastodon.social) · osu! · Steam Community · Airbnb · Booking.com · DEV(dev.to) · 당근 · LINE · Mercari · Cloudflare · Supabase · Sentry · PostHog · note                                                                                                 |
| 5 변수 없음                                                            | 1     | niconico                                                                                                                                                                                                                                                                                                        |
| 6 클래스: 해시                                                         | 15    | Linear · Notion · Figma · Twitch · Bluesky · Atlassian · Airbnb · Booking.com · Medium · 토스 · 당근 · Mercari · pixiv · Raycast · velog                                                                                                                                                                        |
| 6 클래스: 유틸리티                                                     | 11    | GitLab · Vercel · Reddit · Shopify · Cloudflare · Supabase · Sentry · PostHog · Tailwind CSS · Cal.com · note                                                                                                                                                                                                   |
| 6 클래스: 접두사 · BEM                                                 | 8     | Slack · YouTube · Mastodon(mastodon.social) · Chess.com · osu! · DEV(dev.to) · Wikipedia · niconico                                                                                                                                                                                                             |
| 6 클래스: 낱말                                                         | 6     | Discord · Lichess · Steam Community · 네이버 · 카카오(다음) · LINE                                                                                                                                                                                                                                              |
| 6 클래스: 섞임                                                         | 3     | GitHub · Stripe Docs · Spotify                                                                                                                                                                                                                                                                                  |
| 7 스타일시트 1–5개                                                     | 13    | Vercel · Lichess · osu! · Shopify · 네이버 · 당근 · LINE · pixiv · niconico · PostHog · Tailwind CSS · Cal.com · note                                                                                                                                                                                           |
| 7 스타일시트 6–15개                                                    | 15    | Stripe Docs · Figma · Slack · Twitch · Bluesky · Atlassian · Airbnb · Medium · DEV(dev.to) · 카카오(다음) · Mercari · Supabase · Sentry · Raycast · velog                                                                                                                                                       |
| 7 스타일시트 16–30개                                                   | 11    | GitLab · Notion · Discord · Spotify · YouTube · Mastodon(mastodon.social) · Chess.com · Steam Community · Wikipedia · 토스 · Cloudflare                                                                                                                                                                         |
| 7 스타일시트 31개 이상                                                 | 4     | GitHub · Linear · Reddit · Booking.com                                                                                                                                                                                                                                                                          |

가운데값: 변수 455개 · 안 읽는 변수 비율 23% · 스타일시트 11개.

#### 갈래 B — 공개 소스

분모 20곳(막힘 0). 칸 안에서 「미확인」 인 곳은 그 줄에 적었다.

| 칸 · 방식                                                              | 곳 수 | 곳                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 토큰: CSS 한 파일                                                    | 4     | Zulip(`web/styles/app_variables.css`) · PostHog(`frontend/src/styles/base.scss`) · Cal.com(`packages/config/theme/tokens.css`) · Plausible(`assets/css/app.css` 의 `@theme`)                                                                                     |
| 1 토큰: 종류별 · 테마별 여러 파일                                      | 10    | Mastodon · Discourse · Lichess · osu! · Forem · Ghost · Supabase · Penpot · Element Web · Excalidraw                                                                                                                                                             |
| 1 토큰: 정본은 리포 밖 패키지, 리포 안은 변수 파일                     | 2     | GitLab(`@gitlab/ui`) · Wikipedia Vector(Codex)                                                                                                                                                                                                                   |
| 1 토큰: JS · TS 테마 객체                                              | 4     | Sentry · Grafana · Outline · velog                                                                                                                                                                                                                               |
| 2 공용: 가운데 폴더에 부품마다 파일                                    | 5     | Discourse · Lichess · osu!(BEM 블록마다) · Wikipedia Vector · Element Web                                                                                                                                                                                        |
| 2 공용: 가운데 폴더에 묶음 파일(buttons · forms …)                     | 3     | GitLab(`framework/` 58개) · Forem(`components/` 39개) · Zulip(묶음 · 부품 섞임)                                                                                                                                                                                  |
| 2 공용: 부품 코드 옆 CSS · SCSS 파일                                   | 3     | PostHog · Excalidraw · Penpot                                                                                                                                                                                                                                    |
| 2 공용: 부품 코드 옆 CSS-in-JS                                         | 4     | Sentry · Grafana · Outline · velog                                                                                                                                                                                                                               |
| 2 공용: 부품 CSS 없이 tsx 안 Tailwind 클래스                           | 4     | Ghost · Cal.com · Supabase · Plausible(공용 클래스는 `app.css` 의 `@layer components`)                                                                                                                                                                           |
| 2 공용: 두 방식이 함께(옛 묶음 파일 + 새 부품 옆 CSS Modules)          | 1     | Mastodon                                                                                                                                                                                                                                                         |
| 3 화면 전용: 스타일 폴더 안에서 이름으로 가름                          | 7     | GitLab(`page_bundles/` · `pages/`) · Forem(`views/`) · Discourse(`common/base/` · `admin/` · 플러그인) · Element Web(`structures/` · `views/<영역>/`) · Lichess(`ui/<기능>/css/`) · Supabase(`apps/<앱>/styles/`) · Wikipedia Vector(`layouts/` · `skinStyles/`) |
| 3 화면 전용: 기능 폴더의 코드 옆                                       | 8     | Mastodon(`features/`) · PostHog(`scenes/`) · Sentry(`views/`) · Grafana(`features/`) · Outline(`scenes/`) · Excalidraw(`excalidraw-app/`) · Penpot · velog(`components/<기능>`)                                                                                  |
| 3 화면 전용: 가르는 폴더 없음                                          | 5     | osu! · Zulip(`portico/` 만 따로) · Plausible · Cal.com · Ghost                                                                                                                                                                                                   |
| 4 순서: 변수 · 토큰이 맨 앞(프레임워크 import 바로 뒤 포함)            | 12    | Mastodon · Discourse · Lichess · Forem · Wikipedia Vector · Sentry(옛 less) · Grafana(옛 scss) · Element Web · Excalidraw · Cal.com · Supabase · PostHog                                                                                                         |
| 4 순서: 리셋 · 외부 CSS 가 먼저, 변수는 그 뒤                          | 4     | GitLab(vendor → root → framework → page_specific → components) · Penpot(reset → color-defs → …) · Ghost(preflight → utilities → 토큰) · Plausible(tailwind → 부품 css → 층)                                                                                      |
| 4 순서: 변수를 맨 끝에 import                                          | 1     | osu!(Less, 주석 「Variables are imported last」)                                                                                                                                                                                                                 |
| 4 순서: CSS 진입 파일 없음(JS 가 순서를 정함)                          | 3     | Zulip(`web/src/bundles/app.ts`) · Outline · velog(`createGlobalStyle`)                                                                                                                                                                                           |
| 4 @layer: 직접 이름 붙인 층                                            | 1     | Element Web(`compound-tokens, compound-web, shared-components, app-web`)                                                                                                                                                                                         |
| 4 @layer: Tailwind 층(base · components · utilities)만                 | 5     | Ghost · Cal.com · Supabase · PostHog · Plausible                                                                                                                                                                                                                 |
| 4 @layer: 안 씀                                                        | 14    | Mastodon · Discourse · GitLab · Lichess · osu! · Forem · Wikipedia Vector · Sentry · Grafana · Zulip · Outline · Excalidraw · Penpot · velog                                                                                                                     |
| 5 글자 조합: 믹스인 · placeholder                                      | 5     | Mastodon(`_mixins.scss`) · Discourse(`foundation/` 믹스인) · Lichess(`_extends.scss`) · osu!(`functions.less`) · Penpot(`ds/typography.scss`)                                                                                                                    |
| 5 글자 조합: 따로 파일(typography.*)                                   | 4     | GitLab · Forem · Wikipedia Vector · Supabase(`@utility heading-title` …)                                                                                                                                                                                         |
| 5 글자 조합: 토큰 · 기본 파일 안                                       | 3     | PostHog(`base.scss`) · Ghost(`tailwind.theme.css`) · Zulip(`app_variables.css`)                                                                                                                                                                                  |
| 5 글자 조합: 부품(Text · Heading) · 테마 객체 variant                  | 3     | Sentry · Grafana · Outline                                                                                                                                                                                                                                       |
| 5 글자 조합: 리포 밖 토큰의 `font` 단축 변수                           | 1     | Element Web                                                                                                                                                                                                                                                      |
| 5 글자 조합: 두는 곳 없음                                              | 4     | Cal.com · Plausible · Excalidraw · velog                                                                                                                                                                                                                         |
| 6 접근성: 줄인 움직임을 전역 한 곳에서 처리(일부는 부품 옆에도)        | 5     | Forem(`base/reset.scss`) · Sentry(`styles/global.tsx`) · Outline(`globals.ts`) · Element Web(`_common.pcss` · `_animations.pcss`) · Grafana(`handleMotion` 도우미 + eslint 규칙)                                                                                 |
| 6 접근성: 부품 옆에 흩어 둠                                            | 9     | Mastodon · Discourse · GitLab · Lichess · Ghost · Supabase · PostHog · Zulip · Excalidraw                                                                                                                                                                        |
| 6 접근성: 미디어 쿼리 0건                                              | 4     | osu! · Wikipedia Vector(less) · Plausible(css 5개) · Penpot                                                                                                                                                                                                      |
| 6 접근성: 미확인(표본만 봄)                                            | 2     | Cal.com · velog                                                                                                                                                                                                                                                  |
| 6 접근성: 고대비 · 강제 색 전용 파일 또는 테마 있음                    | 3     | Discourse(`whcm.scss` · `wcag.scss`) · Element Web(고대비 테마) · Mastodon(`data-contrast='high'` 믹스인)                                                                                                                                                        |
| 7 검사: stylelint 설정 있음                                            | 13    | Mastodon · Discourse · GitLab · Lichess · Wikipedia Vector · PostHog · Sentry · Grafana · Element Web · Zulip · Plausible · Penpot · Ghost(koenig 하위 패키지만)                                                                                                 |
| 7 검사: stylelint 없음                                                 | 7     | osu!(prettier) · Forem(prettier) · Cal.com(biome) · Supabase · Outline(oxlint) · Excalidraw · velog                                                                                                                                                              |
| 7 검사: 안 쓰는 CSS 를 찾는 도구                                       | 1     | Zulip(`tools/find-unused-css` 스크립트)                                                                                                                                                                                                                          |
| 7 검사: 정의 안 된 CSS 변수 사용을 막는 규칙                           | 1     | Element Web(`csstools/value-no-unknown-custom-properties`)                                                                                                                                                                                                       |
| 7 검사: 토큰 사용을 강제하는 직접 만든 lint 규칙                       | 2     | Discourse(`discourse/require-design-tokens`, sidebar 파일에만 켬) · Sentry(`useSemanticToken` · `noTokenImport`)                                                                                                                                                 |
| 7 검사: knip(안 쓰는 파일 · 내보내기 · 의존성, CSS 선택자는 대상 아님) | 3     | Ghost · Supabase · Sentry                                                                                                                                                                                                                                        |
| 7 검사: purgecss · uncss 설정                                          | 0     | 없음(20곳 트리에서 못 찾음. Tailwind 를 쓰는 5곳은 Tailwind 가 쓰인 클래스만 생성)                                                                                                                                                                               |

## 파일 · 폴더 이름 (2026-11-11 구현 세션 추가)

판 8 · 9 · 10 의 파일 이름을 정하려고 저장소 41곳의 파일 목록을 GitHub API(`git/trees/HEAD?recursive=1`)로 받아 토큰을 종류별 파일로 나눈 곳의 실제 이름을 폴더째 열어 확인했다. 종류별 파일이 확인된 곳은 디자인 시스템 16곳 · 공개 서비스 9곳이다. 나머지 16곳은 한 파일이거나 CSS-in-JS 라 세지 않았다. PostHog 는 목록이 잘려 `packages/quill` 만 봤다.

### 곳마다 토큰 파일 한 벌

| 곳                         | 토큰 폴더                            | 파일(확장자 뺌)                                                                                                           |
| -------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Primer primitives (GitHub) | `src/tokens/base` · `functional`     | color · typography · size(z-index 포함) · motion · border · shadow · spacing                                              |
| Polaris (Shopify)          | `polaris-tokens/src/themes/base`     | color · font · text · space · border · shadow · motion · zIndex · height · width · breakpoints                            |
| Carbon (IBM)               | `packages/styles/scss`               | colors · spacing · layout · layer · motion · border-radius · breakpoint                                                   |
| Spectrum (Adobe)           | `packages/tokens/src`                | color-palette · semantic-color-palette · color-aliases · layout · typography · icons                                      |
| Radix Themes               | `src/styles/tokens`                  | base · color · typography · space · radius · shadow · layout · cursor · scaling                                           |
| EUI (Elastic)              | `src/global_styling/variables`       | colors · typography · size · borders · shadow · animations · levels · breakpoint · states                                 |
| Chakra UI                  | `src/theme/tokens`                   | colors · fonts · font-sizes · line-heights · spacing · sizes · radius · z-indices · animations · durations · easings      |
| Fluent (Microsoft)         | `packages/tokens/src/global`         | colors · colorPalette · fonts · typographyStyles · spacings · borderRadius · strokeWidths · durations · curves            |
| Material Web               | `tokens`                             | md-sys-color · md-sys-typescale · md-sys-shape · md-sys-motion · md-sys-elevation · md-sys-state                          |
| Open Props                 | `src`                                | props.colors · props.fonts · props.sizes · props.borders · props.shadows · props.animations · props.easing · props.zindex |
| GOV.UK Frontend            | `src/govuk/settings`                 | colours-palette · colours-functional · typography-font · spacing · measurements · media-queries                           |
| USWDS                      | `uswds-core/src/styles/tokens`       | color/ · font/ · units/ 폴더                                                                                              |
| SLDS (Salesforce)          | 스타일링 훅 `src/props`              | colors · palettes · font · spacing · sizing · radius · shadow                                                             |
| Orbit (Kiwi.com)           | `definitions/global`                 | typography · space · borderRadius · elevations · duration · z-indexes · breakpoints                                       |
| SEED (당근)                | `packages/rootage`                   | color · dimension · radius · font-size · duration · shadow                                                                |
| Bootstrap                  | `scss`                               | colors · transitions · theme · root                                                                                       |
| PostHog                    | `packages/quill/packages/tokens/src` | colors · typography · spacing · border-radius · shadow                                                                    |
| Supabase                   | `packages/config/css`                | colors · shadows · animations · base · utilities · theme                                                                  |
| Penpot                     | `frontend/src/app/main/ui/ds`        | colors · typography · spacing · sizes · borders · elevations · z-index                                                    |
| Mastodon                   | `styles/mastodon/tokens`             | type · border · shape                                                                                                     |
| Discourse                  | `stylesheets/common/foundation`      | colors · variables · base · helpers · mixins                                                                              |
| Forem                      | `stylesheets/config` · `base`        | colors · variables / typography · layout · reset · helpers                                                                |
| osu!                       | `resources/css`                      | colors · variables · layout · base · utilities                                                                            |
| Wikipedia Vector           | `resources/skins.vector.styles`      | variables · typography · normalize                                                                                        |
| Sentry (옛 less)           | `static/less`                        | palette · fonts · layout                                                                                                  |

### 이름 집계 (디자인 시스템 16 · 서비스 9, 따로 셈)

| 종류          | 이름                          | 디자인 시스템 | 서비스 |
| ------------- | ----------------------------- | ------------- | ------ |
| 색            | `colors`                      | 7             | 6      |
|               | `color`                       | 6             | 0      |
|               | `palette` · `colours`         | 3             | 1      |
| 글자          | `typography`                  | 6             | 3      |
|               | `fonts` · `font`              | 6             | 1      |
|               | `type` · `typescale`          | 1             | 1      |
| 간격          | `spacing` · `space` 파일 따로 | 7             | 2      |
| 크기          | `size` · `sizes` · `sizing`   | 5             | 1      |
| 모서리 · 선   | 모서리 · 테두리 파일 따로     | 9             | 3      |
| 층            | z-index 파일 따로             | 5             | 1      |
| 움직임        | `motion`                      | 4             | 0      |
|               | `animations`                  | 3             | 1      |
|               | `duration(s)`                 | 4             | 0      |
| 그림자        | `shadow(s)` 파일 따로         | 6             | 2      |
|               | `elevation(s)`                | 2             | 1      |
| 토큰 폴더     | `tokens`                      | 10            | 2      |
|               | `variables`                   | 1             | 5      |
| 기본값 파일   | `base`                        | 4             | 4      |
|               | `reset`                       | 2             | 2      |
| 도우미 클래스 | `utilities`                   | 7             | 3      |
|               | `helpers`                     | 3             | 2      |

- 간격 · 모서리 · 층 · 그림자를 한 파일에 모은 곳은 Spectrum(`layout`) · SEED(`dimension`) 둘이다. 나머지는 종류마다 파일을 따로 둔다.
- 조사 세션 시안의 예시 이름 `color` · `type` · `size` · `motion` 가운데 `color` · `size` · `motion` 은 Primer primitives 의 `base` 폴더 이름과 같다. `type` 은 Mastodon 한 곳이다.
- 부품 폴더 이름은 `components` 가 15곳 이상(Radix · Carbon · Spectrum CSS · SLDS · GOV.UK · Polaris · Mantine · Discourse · Forem · Mastodon · Vector · Penpot · Excalidraw · Element · Supabase), 단수 `component` 는 Lichess 한 곳이다.
