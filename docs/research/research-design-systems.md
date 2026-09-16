# 입력칸 · 셀렉트 · 검색창 · 버튼 — 디자인 시스템 22곳 조사 (다크 테마 중심)

조사일 2026-09-14 · 읽기 전용 웹 조사 · 프로젝트 파일 변경 없음

## 표기

| 표시    | 뜻                                                                                                                 |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| **[V]** | 1차 출처(공식 소스 코드·토큰 파일·공식 문서)에서 직접 확인한 값                                                    |
| **[L]** | 공식 문서 사이트를 실제 브라우저에서 열어 `getComputedStyle` 로 잰 값 (다크 모드 상태)                             |
| **[D]** | 확인한 공식 수식·토큰 참조에서 내가 계산하거나 해석한 값 (예: `oklch` → hex, `getSolidColor(#000, 8)` → `#141414`) |
| **[S]** | 2차 출처(검색 결과 요약·서드파티)만 있는 값 — 확정값으로 쓰지 말 것                                                |
| **[N]** | 찾지 못함                                                                                                          |

대비는 WCAG 상대 휘도 공식으로 직접 계산했다(스크립트: `scratchpad/contrast.js`). 반투명 값은 바로 아래 면에 합성한 뒤 계산했다.

비교 기준 — **지금 NosLog**: 면 = 페이지와 같은 색(#0B0B10) · 1px `#8A8A8A` 경계 · radius 4 · 높이 44 · 네이티브 `<select>` + 꺾쇠.

---

## 1. 시스템별 기록

### 1.1 Material Design 3 (Google)

- **형태**: filled(면 + 아래 줄 표시자)와 outlined(사방 1px 경계) 두 가지 [V]. 공식 기본값은 정해져 있지 않음 [N] — M3 는 "둘 다 1급" 으로 취급
- **크기**: 컨테이너 높이 56 [S — M2/M3 문서 검색 요약, 토큰 파일에 height 토큰 없음]. 모서리 `corner-extra-small` = 4 [V 토큰 참조] — filled 는 위쪽 두 모서리만(`corner-extra-small-top`), outlined 는 네 모서리
- **Filled 다크** (baseline 다크 배색 hex 는 [S]):
    - 면 `surface-container-highest` #36343B, 페이지 `surface` #141218
    - 아래 표시자: 평상시 1px `on-surface-variant` #CAC4D0, 마우스 올림 1px `on-surface` + 상태 레이어, 포커스 **2px `primary`** #D0BCFF [V 토큰]
    - 비활성: 면 `on-surface` 4% · 표시자 38% [V]
- **Outlined 다크**:
    - 경계 1px `outline` #938F99, 마우스 올림 1px `on-surface`, 포커스 **2px `primary`** — 두께가 1→2 로 바뀐다 [V 토큰]
    - 비활성 경계 `on-surface` 12% [V]
- **placeholder**: `on-surface-variant` [V]
- **라벨**: 떠오르는(floating) 라벨 — 칸 안에 있다가 입력하면 위 경계로 올라감. 보조 글·오류 글은 칸 아래(`body-small`) [V 토큰]
- **메뉴(셀렉트 목록)** [V 토큰]:
    - 면 `surface-container` · radius 4 · 그림자 `level2`
    - 선택 항목 = `secondary-container` **배경 강조**(체크 표시 없음)
    - 항목 높이는 토큰에 없음 [N]
- **검색창**: search bar = **알약(`corner-full`)** · 높이 56 · 면 `surface-container-high` [V 토큰]
- **버튼**: filled button 높이 **40** · `corner-full`(알약) · `primary` 면 [V]
    - 입력칸 56 과 높이가 **다르다**
- **출처**: material-web `tokens/versions/v0_192/_md-comp-{filled,outlined}-text-field.scss`, `_md-comp-menu.scss`, `_md-comp-search-bar.scss`, `_md-comp-filled-button.scss` (github.com/material-components/material-web)

### 1.2 IBM Carbon (g90/g100 다크 테마)

- **형태**: **filled + 아래 경계** — 면 `$field` + `border-block-end: 1px solid $border-strong` [V]. 변형은 기본형과 fluid(라벨이 칸 안에 들어간 큰 형태)
- **크기**:
    - 높이 sm 32 / **md 40(기본)** / lg 48 [V — dropdown 소스에 명시, text input 도 같은 layout 크기 토큰 사용]
    - radius **0**. v12 플래그에서 `$border-radius-04` 로 바뀔 예정인 코드가 이미 들어 있다 [V]
- **g100 다크 값** [V — `@carbon/themes` generated `_themes.scss`]:
    - 페이지 `background` #161616 · 면 `field-01` #262626(layer-01 위에서는 `field-02` #393939)
    - 마우스 올림 면 `field-hover-01` #333333 — **면 색이 바뀐다**
    - 아래 경계 `border-strong-01` #6f6f6f → 면 대비 **3.01:1**, 페이지 대비 3.60 [D]
    - 포커스: `outline: 2px solid $focus(#ffffff); outline-offset: -2px` — **안쪽 2px 흰 테두리** [V]
    - placeholder `rgba(244,244,244,0.4)`(합성 #787878, 면 대비 3.43) [V/D]
    - 도움말 `#a8a8a8` · 비활성 글자 `rgba(244,244,244,.25)` · 비활성 경계 `rgba(141,141,141,.5)` [V]
    - 오류: `outline: 2px solid $support-error(#fa4d56); offset -2px` [V]
    - 읽기 전용: 면 투명 + 아래 경계 `border-subtle` [V]
- **다크 지침**: "필드는 그 필드가 놓인 배경 위의 한 레이어" — `field-0N` 은 같은 번호의 `layer-0N`·`border-strong-0N` 과 짝을 이룬다. 즉 **다크에서는 필드가 놓인 면보다 한 단계 밝아진다** [S — 검색 결과에 인용된 carbondesignsystem.com 색 문서]
- **라벨**: 칸 위. 도움말·오류는 칸 아래 [S]
- **드롭다운** [V — `_dropdown.scss`]:
    - 닫힌 트리거 = 입력칸과 **같은 모양**(`$field` 면 + 아래 경계, 마우스 올림 `$field-hover`). 꺾쇠는 오른쪽에서 16px
    - 목록 면 `$layer` + box-shadow, 최대 높이 = 항목 5.5개
    - 항목 높이 = 필드 크기(40/32). 마우스 올림 `$layer-hover`
    - 선택 = `$layer-selected`(g100 #393939) **배경 + 체크 표시 둘 다**. 항목 사이 구분선 `$border-subtle`
- **검색**: 입력칸과 같은 면. 돋보기 앞 · 지우기(×) 뒤 [N — 소스 미확인, 일반 지식]
- **버튼**:
    - 기본 크기 **lg(48)** [V — `_button.scss` `$default: 'lg'`] — 입력칸 기본 40 과 다름. 다만 크기 이름(sm/md/lg)이 서로 맞춰져 있어 같은 크기끼리는 높이가 같다
    - radius 0
    - g100 색: primary #0f62fe · secondary #6f6f6f · tertiary 경계 #ffffff [S — 검색 결과(인터랙티브 토큰)]
    - 버튼 포커스 = 안쪽 box-shadow 에 `$focus` + `$focus-inset` 이중 [V]
- **출처**:
    - carbon `packages/styles/scss/components/text-input/_text-input.scss`
    - carbon `.../utilities/_focus-outline.scss`
    - carbon `.../components/dropdown/_dropdown.scss`
    - carbon `.../components/button/_button.scss`
    - unpkg `@carbon/themes/scss/generated/_themes.scss`

### 1.3 Adobe Spectrum 2

- **형태**: **outlined**. text field 는 면 + 1px 경계, **Picker(셀렉트)는 면이 한 단계 더 밝다** [V]
- **크기** [V — `@spectrum-css/tokens`]:
    - 높이 `component-height-100` = **32**(medium, 기본) · 75 = 24 · 200 = 40 · 300 = 48
    - 좌우 여백 `field-edge-to-text-100` = 12
    - radius `corner-radius-100` = **8**
    - 경계 `border-width-100` = 1px
- **다크 값** [V — spectrum-css `textfield/themes/spectrum-two.css`, `@spectrum-css/tokens dark-vars.css`]:
    - text field 면 `gray-25` = **#111111** (다크 pasteboard 색과 같음 = 페이지와 동색)
    - 경계 `gray-500` #6d6d6d(면 대비 **3.65:1** [D]) → 마우스 올림 `gray-600` **#8a8a8a** → 포커스 `gray-800` #dbdbdb → 포커스+올림 `gray-900` #f2f2f2
    - 키보드 포커스: 경계 `gray-800` + 별도 포커스 표시자 **두께 2px · 간격 2px**(바깥 링) [V]
    - 비활성 경계 `gray-300` #393939 · 면 `gray-25`
    - 오류 경계 = `negative-border-color-default` [V 참조, hex N]
    - 참고: NosLog 의 현재 경계 #8A8A8A 는 S2 의 **마우스 올림 경계색**과 같은 값이고, 캔버스 #111111 은 S2 필드 면과 같은 값이다
- **Picker 다크** [V — `picker/themes/spectrum-two.css`]:
    - 면 `gray-100` #2c2c2c → 올림·누름·키보드 포커스 `gray-200` #323232 — **면이 바뀐다**
    - 경계 `gray-500` → `gray-600`(올림) → `gray-700`(누름) → `gray-900`(키보드 포커스)
    - → **셀렉트 트리거는 입력칸과 모양이 다르다**(면이 더 밝은 버튼형)
- **검색**: textfield 를 감싼 컴포넌트. 돋보기 아이콘 20(`workflow-icon-size-100`) 앞, 지우기 버튼 뒤(절대 배치). quiet 변형은 radius 0 [V]. S2 기본 검색 radius 값 자체는 변수 참조라 [N]
- **라벨**: 위(측면 배치 옵션도 있음) [S]
- **버튼**: S2 버튼 모양·높이는 이번 조사에서 [N]
- **출처**: github.com/adobe/spectrum-css `components/{textfield,picker,search}`, unpkg `@spectrum-css/tokens/dist/css/{global,medium,dark}-vars.css`
    - 주의: 이 토큰 패키지가 S2 값 세트라는 것은 spectrum-css main 브랜치가 S2 테마 파일을 갖고 있다는 점에서 추론한 것이다 [D]

### 1.4 GitHub Primer (dark)

- **형태**: **outlined**. 변형 prop 은 폐기됐고 `contrast` 옵션(더 어두운 inset 면)만 있다 [V]
- **크기** [V]:
    - 높이 small 28 / **medium 32** / large 40
    - 좌우 여백 8~12(`control-medium-paddingInline-normal` 12)
    - radius `borderRadius-medium` = **6**
    - 경계 1px(`borderWidth-thin`)
- **다크 값** [V — `@primer/primitives dark.css`, `TextInputWrapper.module.css`]:
    - 면 `bgColor-default` **#0d1117 = 페이지와 같은 색**
    - 경계 `control-borderColor-rest` #3d444d — 면 대비 **1.92:1**(3:1 미달) [D]
    - 포커스: `border-color: accent-emphasis` + **`outline: 2px solid accent-emphasis; outline-offset: -1px`**
        - = 경계 1px + 안쪽으로 겹친 2px 링. dark `focus-outlineColor` #1f6feb, 면 대비 4.08
    - placeholder `fgColor-muted` #9198a1(6.50:1)
    - 비활성: 면 `control-bgColor-disabled` #212830 · 글자 #656c76 · 그림자 없음
    - 오류: 경계 + 2px 링 `control-borderColor-danger` #da3633 · 성공 = 경계만 success 색
    - contrast 모드: 면 `bgColor-inset` **#010409(페이지보다 어둡다)**
- **라벨**: 칸 위(FormControl.Label). 캡션·검증 메시지는 칸 아래 [V]
- **셀렉트**: 네이티브 `<select>` 를 **TextInput 과 같은 모양**으로 스타일, 꺾쇠 포함 · 크기 3단 · contrast · 검증 상태 [V 문서]
    - 목록형 선택은 ActionMenu/SelectPanel(오버레이) [V 문서]
    - 오버레이: 면 `overlay-bgColor` #010409 · 경계 #3d444d · `shadow-floating-small` = `0 0 0 1px #3d444d, 0 6px 12px -3px #01040966, 0 6px 18px 0 #01040966` [V]
    - 선택 표시는 체크 표시 [N — 일반 지식]
- **검색**: TextInput 에 leadingVisual(돋보기) + trailingAction(지우기 버튼, 라벨 없는 아이콘 권장) [V 문서]
- **버튼** [V]:
    - default = 면 `button-default-bgColor-rest` **#212830**(페이지보다 밝음) + 경계 #3d444d
    - primary = #238636 초록 + 흰 글자
    - 높이 = 같은 control 크기 토큰(32 등) → **입력칸과 높이 일치** · radius 6
- **출처**: primer.style/product/components/{text-input,select}, github.com/primer/react `TextInputWrapper.module.css`·`ButtonBase.module.css`, unpkg `@primer/primitives/dist/css/functional/{themes/dark,size/size,size/border,size/radius}.css`

### 1.5 Microsoft Fluent 2

- **형태**: appearance 4종 — **`outline`(기본)** / `underline` / `filled-darker` / `filled-lighter` [V]
    - outline 은 사방 1px 이지만 **아래 경계만 더 진한 색**(`colorNeutralStrokeAccessible`)
- **크기** [V]:
    - 최소 높이 small 24 / **medium 32** / large 40
    - 좌우 여백 `spacingHorizontalMNudge`(10) 등
    - radius `borderRadiusMedium` = **4** · underline 은 0
- **다크 값** [V — `packages/tokens/src/alias/darkColor.ts`]:
    - outline 면 `colorNeutralBackground1` #292929
    - 경계: 옆·위 `colorNeutralStroke1` #666666(면 대비 **2.53**), 아래 `colorNeutralStrokeAccessible` **#adadad(6.48)**
        - = 식별 단서는 아래 경계가 담당 [D]
    - 마우스 올림: 경계 #757575 / 아래 #bdbdbd
    - 포커스: 아래에 **2px `colorCompoundBrandStroke` #2899f5** 바가 `scaleX(0→1)` 로 펼쳐짐(모션 줄이기 설정 존중) — 경계 전체가 아니라 **아래 바만** [V]
    - placeholder `colorNeutralForeground4` #999999(5.11)
    - 비활성 경계 `colorNeutralStrokeDisabled` #424242
    - 오류 `colorPaletteRedBorder2`(hex N)
    - filled-darker 면 `colorNeutralBackground3` #141414 · filled-lighter 면 #292929
- **라벨**: 별도 Label 컴포넌트, 칸 위 [S]
- **셀렉트(Dropdown)** [V — react-combobox 소스]:
    - 트리거 = **입력칸과 같은 appearance 4종 · 같은 경계·아래 포커스 바**. 꺾쇠(expandIcon)는 grid 끝 열
    - listbox: 면 `colorNeutralBackground1` #292929 · 안쪽 여백 4 · 항목 간격 2
    - 옵션: radius 4 · 마우스 올림 `colorNeutralBackground1Hover` #3d3d3d · 누름 Pressed
    - **선택 = 체크 표시만(배경 변화 없음)**. 체크는 왼쪽
    - 키보드 활성 항목 = 2px `colorStrokeFocus2`(#ffffff) 경계
    - listbox 의 radius·그림자는 이 스타일 파일에 없음 [N]
- **검색**: SearchBox 컴포넌트(입력칸 + 돋보기 + 지우기) [N — 소스 미확인]
- **버튼** [V — `useButtonStyles.styles.ts`]:
    - 기본(secondary) = 면 `colorNeutralBackground1` + 경계 `colorNeutralStroke1`
    - primary = `colorBrandBackground` + 흰 글자
    - radius 4 · 포커스 = `0 0 0 1px colorStrokeFocus2 inset`(흰색)
    - 높이는 min-height 대신 여백으로 결정 [V] — 중간 크기가 32 로 입력칸과 맞춰져 있다는 것은 [N]
- **출처**: github.com/microsoft/fluentui `react-input/.../useInputStyles.styles.ts`, `react-combobox/.../{Dropdown,Listbox,Option}/use*Styles.styles.ts`, `react-button/.../useButtonStyles.styles.ts`, `packages/tokens/src/{alias/darkColor.ts,global/borderRadius.ts}`

### 1.6 Atlassian Design System (dark)

- **형태**: appearance `standard`(기본, 면+경계) / `subtle`(평상시 면·경계 없음, 올림 시 드러남) / `none` [V — `@atlaskit/textfield` 소스]
- **크기**:
    - radius `radius.medium` = **6** · 경계 1px [V — compiled css 폴백값]
    - compact 여백 위아래 2 / 좌 6 [V]
    - 높이 값은 [N]
- **다크 값** [V — `@atlaskit/tokens atlassian-dark`]:
    - 페이지 `surface` #1F1F21 · 면 `background.input` **#242528(페이지보다 약간 밝음, 1.07:1)**
    - 경계 `border.input` **#7E8188** — 면 대비 **3.93:1**
    - 마우스 올림: **면 변경** `background.input.hovered` #2B2C2F
    - 포커스: **경계 색 변경** `border.focused` #8FB8F6(7.56:1)
    - 오류: `border.danger` #F15B50 을 `inset 0 0 0 1px` 로 한 번 더(경계 2px 효과) [V]
    - 비활성 면 `background.disabled` #E3E4F21F · placeholder `text.subtlest` #96999E(5.36)
    - 일반 장식 경계 `border` 는 #E3E4F21F(12% 알파) — **입력 경계만 불투명 중간 회색**
- **오버레이** [V 토큰]:
    - `surface.overlay` #2B2C2F
    - `shadow.overlay` = `0 0 0 1px #BDBDBD1F, 0 8px 12px #0104045C, 0 0 1px 1px #01040480` — **다크에서 그림자 안에 1px 밝은 링 포함**
    - 선택 면 `background.selected` #1C2B42 · 선택 경계 #669DF1
- **라벨·검색·버튼·셀렉트 세부**: 문서 페이지가 JS 렌더라 가져오지 못함 [N]. 브라우저 측정은 다른 세션과 창이 겹쳐 폐기
- **출처**: unpkg `@atlaskit/tokens/dist/esm/artifacts/themes/atlassian-dark.js`, `@atlaskit/textfield/dist/es2019/text-field.{js,compiled.css}`

### 1.7 Shopify Polaris

- **형태**: outlined. `borderless` 변형, `slim` 크기 [V]
- **값(라이트)** [V]:
    - 면 `input-bg-surface` #FDFDFD
    - 경계 `border-width-0165` = **0.66px** · `input-border` #8A8A8A · 위 경계만 `#898f94` 고정
    - radius `border-radius-200` = **8**
    - 여백 `space-150 space-300`(6/12)
    - slim 최소 높이 28 · borderless 최소 높이 32
    - 포커스 **`outline: 2px solid border-focus(#005BD3); outline-offset: 1px`(바깥 링 + 1px 간격)**
    - 오류 = 면을 critical 틴트로 + 경계 critical
- **다크**: `.p-theme-dark-experimental` 블록은 있으나 **입력 토큰을 재정의하지 않음** — 사실상 다크 입력칸 없음 [V]
- **출처**: github.com/Shopify/polaris `polaris-react/src/components/TextField/TextField.module.css`, unpkg `@shopify/polaris-tokens/dist/css/styles.css`
    - polaris-react.shopify.com 은 shopify.dev 로 이전됨

### 1.8 Radix Themes

- **형태**: variant `surface`(기본, 면+안쪽 1px 경계) / `classic`(그림자 입체) / `soft`(액센트 틴트 면, 경계 0) [V]
- **크기** [V]:
    - 높이 size1 **24** / size2 **32(기본)** / size3 **40**(`--space-5/6/7`)
    - 여백 `space-2 − 경계` 등
    - radius size1·2 = `radius-2` **4**, size3 = `radius-3` 6 (radius 설정 medium 기준, full 설정 시 알약)
- **다크 값** [V]:
    - surface 면 `--color-surface` = **`rgba(0,0,0,0.25)` — 페이지보다 어둡게 파인 면**
    - 경계 `inset 0 0 0 1px var(--gray-a7)` = **#ffffff3b(흰색 23%)** → 합성 #454545, 면 대비 2.03 [D]
    - 포커스 **`outline: 2px solid var(--focus-8); outline-offset: -1px`** (경계와 겹치는 안쪽 2px 링, 액센트 8단계)
    - placeholder `gray-a10` #ffffff72
    - soft: 면 `accent-a3`, 포커스 `accent-8`, placeholder `accent-12` 60%
    - 오류 스타일은 CSS 에 없음 [V — 없음 확인]
- **Select** [V — `select.css`]:
    - 트리거 = **입력칸과 같은 크기·variant**(surface 는 `gray-a7` 안쪽 경계, 올림 시 `gray-a8`)
    - 콘텐츠 그림자 `--shadow-5`
    - 항목 높이 24/32 · 체크 표시기는 **왼쪽**
    - 강조(키보드·올림) 항목 = solid 이면 **`accent-9` 꽉 찬 액센트 면**, soft 이면 `accent-a4`
    - 콘텐츠 면은 panel 토큰(다크 `--color-panel-solid` = `gray-2` #191919 — 셀렉트 연결은 [D])
- **버튼**: size2 = 32 로 입력칸과 같은 space 토큰 [D]
- **출처**: github.com/radix-ui/themes `src/components/{text-field,select}.css`, `src/styles/tokens/{color,radius,space}.css`, unpkg `@radix-ui/colors/gray-dark{,-alpha}.css`

### 1.9 shadcn/ui (new-york v4, dark)

- **형태**: outlined, 변형 없음 [V]
- **크기** [V]:
    - 높이 `h-9` = **36** · 여백 `px-3` = 12
    - radius `rounded-md` — 다크에서 `--radius` 0.625rem 기준 **8** [D]
    - 경계 1px · `shadow-xs`
- **다크 값** [V — 소스 + 테마 문서]:
    - 페이지 `--background` oklch(0.145) ≈ #0a0a0a
    - 면 `dark:bg-input/30` = 흰색 15% × 30% = **흰색 4.5%**(≈#151515) — **페이지보다 약간 밝다**
    - 경계 `--input` = **oklch(1 0 0 / 15%)**(합성 #383838, 면 대비 1.56) [D]
    - 포커스 **`border-ring` + `ring-[3px] ring-ring/50`** — 경계 색 변경 + **3px 바깥 반투명 링**(`--ring` oklch(0.556) ≈ #737373 의 50%)
    - placeholder `muted-foreground` oklch(0.708) ≈ #a1a1a1
    - 비활성 = opacity 50%
    - 오류 = `border-destructive` + `ring-destructive/40`(다크)
- **Select** [V]:
    - 트리거 = **입력칸과 같은 클래스**(같은 면·경계·링) + 다크 올림 `bg-input/50` · 높이 36(sm 32) · 꺾쇠 16 오른쪽 · placeholder 흐림
    - 콘텐츠 = `bg-popover`(oklch 0.205 ≈ #171717) + 1px `border`(흰 10%) + `rounded-md` + `shadow-md`
    - 항목 = `py-1.5 pl-2 pr-8` · `rounded-sm` · **올림·키보드 = `bg-accent`(oklch 0.269 ≈ #262626) 배경 강조**
    - 선택 = **오른쪽 체크 표시**(`absolute right-2`, 14) — 배경 강조 + 체크 둘 다
- **검색**: 전용 없음(Command 컴포넌트 입력) [N]
- **버튼** [V]:
    - 높이 기본 **36**(sm 32 · lg 40 · icon 36) = **입력칸과 같음** · `rounded-md`
    - default = `bg-primary`(oklch 0.922 ≈ #e5e5e5 거의 흰색) 어두운 글자
    - outline = 다크 `border-input bg-input/30` → **입력칸과 같은 면·경계**
    - secondary `bg-secondary`(≈#262626) · ghost 는 올림 시만 `accent/50`
    - 포커스는 입력칸과 같은 3px 링
- **출처**: github.com/shadcn-ui/ui `apps/v4/registry/new-york-v4/ui/{input,select,button}.tsx`, ui.shadcn.com/docs/theming

### 1.10 Vercel Geist — 실측 [L] (vercel.com/geist, `dark-theme` 클래스, 페이지 #000000)

- **형태**: outlined(경계는 box-shadow 1px 링) [L]
- **크기** [L]:
    - 높이 small **32** / default **36** / large **40**
    - 여백 0 12 · 글자 14(large 16)
    - radius **6**(small·default) / **8**(large)
- **다크 값** [L]:
    - 면 **#0a0a0a(페이지 #000 보다 약간 밝음)**
    - 경계 `box-shadow: 0 0 0 1px rgba(255,255,255,0.14)`(합성 #2c2c2c, 면 대비 1.42)
    - placeholder #8f8f8f(6.12) · 글자 #ffffff · 비활성 면 #1a1a1a
    - 마우스 클릭 포커스 시 링 변화 없음(키보드 포커스는 측정 못함) [L/N]
- **Select** [L]:
    - 네이티브 `<select>` `appearance:none` · **입력칸과 완전히 같은 면·링·radius·높이**(32/36/40)
    - 꺾쇠 14px, 오른쪽 12 · 오른쪽 여백 36 · 앞 아이콘 있으면 왼쪽 여백 40
    - 목록은 OS 네이티브
- **검색**: `SearchInput` — Esc 로 비움, `cmdk` 옵션이면 ⌘K 표시가 입력 시 Esc 로 바뀜 [V 문서]
- **버튼** [L]:
    - 높이 **32/36/40 = 입력칸과 정확히 같음** · radius 6/6/8
    - primary = 면 #ededed + 글자 #0a0a0a(반전)
    - secondary = 면 #0a0a0a + `0 0 0 1px #2e2e2e`(**입력칸과 같은 면**)
    - tertiary = 투명
    - error #d93036 · warning #ff990a · 글자 14/500
- **라벨**: `label` prop, 칸 위 [V 문서]
- **출처**: vercel.com/geist/{input,select,button} 실측

### 1.11 Ant Design (v5/v6, dark algorithm)

- **형태**: `outlined`(**기본**) / `filled` / `borderless` / `underlined`(5.24+) [V — `useVariants.ts`: `?? 'outlined'`]
    - 문서 요약에 "filled 기본" 이라고 나온 것은 오독이다 — 소스로 확인했다
- **크기**:
    - 높이 small 24 / **middle 32** / large 40 [V 문서]
    - 좌우 여백 `paddingSM − lineWidth` = 11 [V/D]
    - radius **6**(SM 4) · 경계 1px [V]
- **다크 값**:
    - 규칙 [V — `themes/dark/colors.ts`]: `colorBgBase #000`, `colorBgContainer = getSolidColor(base, 8)`, `colorBorder = getSolidColor(base, 26)`, `colorBgElevated = …12`, `colorFillTertiary = rgba(#fff, 0.08)`, `colorFillSecondary = …0.12`
    - 계산하면 면 **#141414** · 경계 **#424242**(면 대비 1.83) · 떠 있는 면 #1f1f1f [D]
    - outlined [V]: 올림 = **경계 색 변경** `colorPrimaryHover` · 포커스 = 경계 `colorPrimary` + **`0 0 0 2px controlOutline` 바깥 링**(`controlOutline = colorPrimaryBg` 를 면 위에 합성) + 면 `activeBg`
    - filled [V]: 면 `colorFillTertiary`(흰 8%) · 경계 투명 · 올림 면 `colorFillSecondary`(흰 12%) · 포커스 = 경계 `colorPrimary` + 면 `activeBg`(컨테이너 색)
    - underlined [V]: 아래 경계만 · 포커스 아래 경계 primary
    - 오류 [V]: outlined 경계 `colorError` / filled 면 `colorErrorBg`
    - 다크 primary hex(#1668dc 등)는 [N — 알고리즘 산출값, 확인 못함]
- **Select** [V — `select/style/token.ts`]:
    - 트리거 = 입력칸과 같은 variant 체계, 면 `colorBgContainer`
    - 드롭다운 면 `colorBgElevated`
    - 옵션 높이 = `controlHeight`(32)
    - 활성(올림) = `controlItemBgHover` = `colorFillTertiary`
    - **선택 = `controlItemBgActive`(=colorPrimaryBg) 배경 + 굵기 `fontWeightStrong`** — 단일 선택에 체크 없음
- **검색**: `Input.Search` — 뒤에 검색 버튼 addon [N — 일반 지식]
- **버튼**: `controlHeight` 32 · radius 6 = **입력칸과 같음** [D]
- **출처**: github.com/ant-design/ant-design `components/{input,select}/style/{token,variants}.ts`, `components/form/hooks/useVariants.ts`, `components/theme/{themes/dark/colors.ts,util/alias.ts}`, ant.design/components/input

### 1.12 Mantine (v7+ master)

- **형태**: `default`(면+경계, 기본) / `filled`(면만) / `unstyled` [V]
- **크기** [V]:
    - 높이 xs 30 / **sm 36(기본)** / md 42 / lg 50 / xl 60
    - radius `defaultRadius: 'md'` = **8** (master 소스 기준 — 이전 버전은 달랐을 수 있음)
- **다크 값** [V — `Input.module.css`, `default-colors.ts`]:
    - default 면 `dark-6` **#2e2e2e** · 경계 `dark-4` #424242(면 대비 **1.35**)
    - filled 면 `dark-5` #3b3b3b, 경계 없음
    - 앱 배경 `dark-7` #242424 [D]
    - 포커스 = **경계 색만** `primary-color-filled`(다크 shade 8 = blue-8 #1971c2, 면 대비 2.70) — 링 없음
    - 오류 = 경계+글자 error 색 · 비활성 opacity .6
- **Combobox(Select 목록)** [V]:
    - 드롭다운 면 `dark-6` #2e2e2e + 경계 `dark-4` · radius 기본 · 안쪽 여백 4
    - 옵션 올림 `dark-7` #242424(더 어둡게)
    - **선택 = primary 꽉 찬 면 + 흰 글자**
    - 체크 아이콘 0.8em 이 기본 opacity .4 → 선택 시 1
- **버튼**: 높이 30/36/42/50/60 = **입력칸과 같은 표** [V]
- **출처**: github.com/mantinedev/mantine `packages/@mantine/core/src/components/{Input,Combobox,Popover,Button}/*.module.css`, `core/MantineProvider/default-{theme,colors}.ts`

### 1.13 Chakra UI v3

- **형태**: `outline`(기본) / `subtle`(면+투명 경계) / `flushed`(아래 줄만, radius 0, 좌우 여백 0) [V]
- **크기**:
    - md **40(기본)** · lg 44 · xl 48 · xs/sm 32/36 [V — h 토큰 10 = 2.5rem]
    - radius `l2` = `radii.sm`(4 — sm 값은 [D])
- **다크 값** [V — semantic tokens]:
    - outline 면 **투명** · 경계 `border` = `gray.800` #27272a(검은 페이지 대비 1.41)
    - 포커스 = **`focusVisibleRing: inside`** — 안쪽 링, 색 `colorPalette.focusRing`(gray = `gray.400` #a1a1aa)
    - subtle 면 `bg.muted` = `gray.900` #18181b
    - 페이지 `bg` = black
- **Select**: 트리거 outline/subtle(1px) · 꺾쇠는 끝(`insetEnd:0`) · 콘텐츠 = `bg.panel`(다크 `gray.950` #111111) + radius l2 + `shadow md` · 항목 강조 `bg.emphasized/60` · 체크 표시는 레시피에 없음(구현이 결정) [V]
- **버튼**: 기본 variant `solid` · md 높이 **40** = 입력칸과 같음 · radius l2 [V]
- **출처**: github.com/chakra-ui/chakra-ui `packages/react/src/theme/{recipes/{input,select,button}.ts,semantic-tokens/{colors,radii}.ts,tokens/colors.ts}`

### 1.14 GOV.UK Design System

- **형태**: outlined, 굵은 경계 [V]
- **값** [V]:
    - 높이 **40** · 여백 5(`govuk-spacing(1)`)
    - 경계 **2px** `input-border` = 검정(#0b0c0c — hex 는 GOV.UK 팔레트 [D]) · radius **0**
- **포커스** [V]:
    - `outline: 3px solid focus(노랑 #ffdd00); outline-offset: 0` + `box-shadow: inset 0 0 0 2px input-border`
    - = 노란 3px 바깥 테두리 + 안쪽 검정 2px 추가(경계가 사실상 4px 로 두꺼워짐)
- **오류**: 경계 빨강(포커스 시 검정으로 복귀) · 비활성 opacity .5
- **다크 모드 없음** [V — 색 설정에 단일 라이트 배색만]
- **라벨**: 위 · 힌트는 라벨 아래 · 오류 메시지는 칸 위 [N — 일반 지식]
- **출처**: github.com/alphagov/govuk-frontend `src/govuk/components/input/_mixin.scss`, `helpers/_focused.scss`, `settings/{_measurements,_colours-functional}.scss`

### 1.15 Base Web (Uber)

- **형태**: **filled** — 면 `inputFill` + 2px 경계. 평상시 다크 경계색 = 면색이라 경계가 안 보인다 [V]
- **크기** [V]:
    - 경계 **2px** 사방
    - radius `inputBorderRadius` **8**(mini 4)
    - 좌우 여백 `scale550`
- **다크 값** [V/D — `dark-theme/color-{component,semantic}-tokens.ts`, `tokens/color-primitive-tokens.ts`]:
    - 면 `backgroundSecondary` = `gray100Dark` **#292929**
    - 경계 `borderOpaque` = `gray100Dark` **#292929(면과 동색)**
    - 포커스 = **면이 `backgroundPrimary` 로 바뀌고 + 경계가 `borderSelected`(primaryA)** — 다크에서 면은 검정·경계는 흰색으로 추정 [D]
    - placeholder `contentTertiary` = `gray700Dark` #ABABAB
    - 오류: 면 `inputFillError`(=backgroundPrimary) + 경계 `inputBorderError`
- **메뉴**: 면 `backgroundPrimary` · 올림 `backgroundSecondary` #292929 [V]
- **버튼** [V]:
    - primary = `backgroundInversePrimary`(`gray800Dark` #C4C4C4 — 반전 계열)
    - secondary = `backgroundSecondary` #292929(**입력칸과 같은 면**)
    - tertiary 투명 · radius 8(입력칸과 같음)
- **출처**: github.com/uber/baseweb `src/input/styled-components.ts`, `src/themes/{dark-theme/*,shared/borders.ts}`, `src/tokens/color-primitive-tokens.ts`

### 1.16 Twilio Paste

- **형태**: outlined — 경계를 box-shadow 로 그림(`shadowBorder`) [V]
- **다크 값** [V — `@twilio-paste/design-tokens` dark]:
    - 면 `colorBackgroundWeakest` #0d131c = **페이지(`colorBackgroundBody`)와 같은 색**
    - 경계 `0 0 0 1px #606b85`(면 대비 **3.50**)
    - 올림 `shadowBorderPrimary` 1px #006dfa(파랑)
    - 누름 `shadowBorderPrimaryStronger`
    - 포커스 `shadowFocusShadowBorder` = **`0 0 0 4px #606b85, 0 0 0 1px #606b85`**(다크: 4px 회색 바깥 링 / 라이트: `rgba(2,99,224,.7)` 파랑 4px)
    - 오류 `shadowBorderError` · 비활성 면 `colorBackground` #18253c + `shadowBorderWeak`
    - radius `borderRadius30` = **8**
- **셀렉트**: 같은 FauxInput + `InputChevronWrapper` → **입력칸과 같은 모양 + 꺾쇠** [V 파일 구조]
- **높이**: [N]
- **출처**: github.com/twilio-labs/paste `packages/paste-core/components/input-box/src/FauxInput/DefaultFauxInput.tsx`, unpkg `@twilio-paste/design-tokens/dist/{themes/dark/,}tokens.custom-properties.css`
    - paste.twilio.design 는 GitHub 로 리다이렉트된다(문서 사이트 운영 상태 불명)

### 1.17 Elastic EUI (Borealis 테마)

- **형태**: outlined(1px) — 예전 EUI 의 "면 + 아래 파란 줄" 스타일이 아니다 [V]
- **크기**:
    - 높이 `size.xxl` / compressed `size.xl` = 40 / 32 (EUI 크기 척도 16 기준 [D])
    - radius `border.radius.small` = 0.25 × 16 = **4** [V/D]
- **다크 값** [V/D — `_forms.ts`, `_colors_dark.ts`, `_primitive_colors.ts`]:
    - 면 `backgroundBasePlain` = shade145 **#0b1628(페이지 plain 과 같은 색)**
    - 경계 `borderBasePlain` = shade100 #485975(면 대비 **2.55**)
    - 포커스 = **`outline` 굵은 두께(2px)** `borderStrongPrimary` = primary60 #61a2ff(7.00)
    - 오류 경계 `borderStrongDanger`(danger60) · 비활성 면 shade130 #1d2a3e
    - placeholder `textDisabled` shade80 #6a7fa0(4.45)
    - prepend 면 shade125 #243147
    - Windows 고대비 모드에서는 SVG 밑줄로 대체
- **출처**: github.com/elastic/eui `packages/eui/src/components/form/form.styles.ts`, `packages/eui-theme-borealis/src/variables/{_forms,_borders,colors/_colors_dark,colors/_primitive_colors}.ts`

### 1.18 Nord Health Design System

- **형태**: outlined · 크기 s/m(기본)/l [V 문서]
- **값**:
    - 면 `--n-input-background = --n-color-surface` · 경계 `--n-color-border-strong` · radius `--n-border-radius-s` [V 문서]
    - 다크 [V — `@nordhealth/themes nord-dark.css`]: surface **#1d2025** · background #22252b(**필드가 페이지보다 약간 어둡다**) · border-strong #3d434d(1.64) · accent #2a469d · 글자 #dedfe1 · 약한 글자 #8f949e
    - radius 값·높이 [N]
- **출처**: nordhealth.design/components/input, unpkg `@nordhealth/themes/lib/nord-dark.css`

### 1.19 Workday Canvas

- **형태**: outlined 1px [V — canvas-kit 소스]
- **값**:
    - 경계 `border.input.default`(slate-a500) → 올림 `…hover`(slate-a700)
    - 포커스 = 경계 brand focus 색 + `inset 0 0 0 1px`(2px 효과) + `2px solid transparent` outline(고대비 대비용)
    - 오류 = critical 경계 + 2px inset · 경고(caution) 상태 별도
    - radius `shape.x1` = 4 [D — base unit 4] · 높이 `legacy.size.md`(40 로 추정 [D])
- **다크**: 시스템 토큰에 다크 값 없음, 어두운 면용 `inverse` 변형만 [V]
- **출처**: github.com/Workday/canvas-kit `modules/react/text-input/lib/TextInput.tsx`, unpkg `@workday/canvas-tokens-web/css/system/_variables.css`
    - canvas.workday.com 은 403 이라 문서 미확인

### 1.20 Salesforce Lightning (SLDS)

- **형태**: outlined — `$color-border-input` 1px(`$border-width-thin`) + `$color-background-input` [V 소스 변수명]
- **포커스**: 경계 색 변경 + `inset 0 0 0 1px` + `$shadow-button-focus`(바깥 번짐) [V 구조]
- **값**: 통용 값(경계 #c9c9c9, radius .25rem, line-height 1.875rem, 포커스 `0 0 3px #0176d3`)은 **2차 출처로도 확인하지 못함** [N]
- **다크**: SLDS 2(Cosmos 테마)가 다크 모드를 지원하지만, 컴포넌트 단위 styling hook 은 아직 미지원 [S — Trailhead·Salesforce 블로그]
- **출처**: github.com/salesforce-ux/design-system `ui/components/input/base/_index.scss`

### 1.21 Apple HIG

- **text field** [V]:
    - placeholder 는 사라지므로 **별도 라벨을 둔다**
    - iOS/iPadOS 는 끝에 지우기 버튼
    - 입력 양에 맞춘 폭 · 적절한 시점에 검증
- **pop-up button** [V]:
    - 서로 배타적인 옵션 목록에 쓴다(동작 목록은 pull-down)
    - 버튼이 **현재 선택값을 보여 준다**
    - 고르면 메뉴가 닫히고 버튼 내용이 갱신된다
- **크기·색**: 픽셀 값 없음, 다크 모드는 시스템 색에 위임 [N]. 메뉴의 선택 항목 체크 표시는 플랫폼 동작이지만 가져온 HIG 본문에는 없었다 [N]
- **출처**: developer.apple.com/design/human-interface-guidelines/{text-fields,pop-up-buttons} (JSON 데이터 경로)

### 1.22 Stripe Elements · Linear

- **Stripe Appearance API** [V]:
    - 테마는 `stripe` / `night` / `flat` 세 개
    - 기본 예시 `borderRadius: '4px'`, `colorBackground #ffffff`, `spacingUnit 2px`
    - `.Input` 에 `:hover/:focus/:disabled` 규칙
    - **"모바일 입력칸 글자 16px 이상"** 권장
    - `night` 테마 색 값은 문서에 없음 [N]
- **Linear**: 공개 디자인 시스템 문서 없음 [N]

---

## 2. 종합

### 2.1 비교표 (다크 기준. 괄호 안 대비 = 경계 : 필드 면)

| 시스템          | 기본 형태                       | 기본 높이    | radius            | 다크 필드 면 (페이지 대비)              | 다크 경계                                             | 포커스                                     |
| --------------- | ------------------------------- | ------------ | ----------------- | --------------------------------------- | ----------------------------------------------------- | ------------------------------------------ |
| **NosLog 지금** | outlined                        | 44           | 4                 | #0B0B10 = 페이지                        | 1px #8A8A8A (5.69)                                    | —                                          |
| Material 3      | filled/outlined (기본 없음)     | 56 [S]       | 4 (filled 위쪽만) | filled #36343B 밝음 / outlined 페이지색 | outlined 1px #938F99 (5.87) · filled 아래 1px #CAC4D0 | 경계·아래 줄이 **2px primary** 로 두꺼워짐 |
| Carbon g100     | **filled + 아래 경계**          | 40           | 0                 | #262626 (페이지 #161616보다 밝음)       | 아래만 1px #6f6f6f (3.01)                             | 안쪽 2px 흰 outline                        |
| Spectrum 2      | outlined (Picker 는 더 밝은 면) | 32           | 8                 | #111111 = 페이지                        | 1px #6d6d6d (3.65)                                    | 경계 #dbdbdb + 키보드 시 2px 링·간격 2     |
| Primer          | outlined                        | 32           | 6                 | #0d1117 = 페이지                        | 1px #3d444d (1.92)                                    | 경계 + 2px 링 offset −1 (#1f6feb)          |
| Fluent 2        | outline (아래만 진함)           | 32           | 4                 | #292929 밝음                            | 1px #666666 (2.53) + 아래 #adadad (6.48)              | 아래 **2px 브랜드 바**                     |
| Atlassian       | standard                        | [N]          | 6                 | #242528 (페이지 #1F1F21보다 밝음)       | 1px #7E8188 (3.93)                                    | 경계 색 변경 #8FB8F6                       |
| Polaris         | outlined (라이트만)             | 32 (slim 28) | 8                 | 다크 없음                               | 0.66px #8A8A8A                                        | 바깥 2px 링 offset 1                       |
| Radix Themes    | surface                         | 32           | 4                 | rgba(0,0,0,.25) **페이지보다 어두움**   | 안쪽 1px 흰 23% (2.03)                                | 2px 액센트 outline offset −1               |
| shadcn/ui       | outlined                        | 36           | 8 [D]             | 흰 4.5% 밝음                            | 1px 흰 15% (1.56)                                     | 경계 색 변경 + **3px 바깥 반투명 링**      |
| Geist [L]       | outlined                        | 36           | 6 (lg 8)          | #0a0a0a (페이지 #000보다 밝음)          | 1px 흰 14% 링 (1.42)                                  | 측정 못함                                  |
| Ant Design      | outlined                        | 32           | 6                 | #141414 [D]                             | 1px #424242 [D] (1.83)                                | 경계 primary + 2px 바깥 링                 |
| Mantine         | default                         | 36           | 8                 | #2e2e2e 밝음                            | 1px #424242 (1.35)                                    | 경계 색만 primary                          |
| Chakra v3       | outline                         | 40           | 4 [D]             | 투명                                    | 1px #27272a (1.41)                                    | 안쪽 링 (#a1a1aa)                          |
| GOV.UK          | outlined 2px                    | 40           | 0                 | 다크 없음                               | 2px 검정                                              | 노랑 3px 바깥 + 안쪽 2px                   |
| Base Web        | **filled**                      | [N]          | 8                 | #292929 밝음                            | 2px 면과 같은 색 (안 보임)                            | 면 → 검정, 경계 → primaryA                 |
| Twilio Paste    | outlined (shadow)               | [N]          | 8                 | #0d131c = 페이지                        | 1px #606b85 (3.50)                                    | 4px 회색 바깥 링 + 1px                     |
| EUI Borealis    | outlined                        | 40 [D]       | 4                 | #0b1628 = 페이지                        | 1px #485975 (2.55)                                    | 2px outline #61a2ff                        |
| Nord            | outlined                        | [N]          | [N]               | #1d2025 **페이지보다 약간 어두움**      | #3d434d (1.64)                                        | [N]                                        |
| Canvas          | outlined                        | 40 [D]       | 4 [D]             | 다크 없음                               | 1px slate                                             | 경계 + inset 1px                           |
| SLDS            | outlined                        | [N]          | [N]               | [N]                                     | 1px (값 N)                                            | 경계 + inset 1px + 바깥 번짐               |

### 2.2 기본 형태 집계 (Apple·Stripe·Linear 제외, 19곳)

- **Outlined(사방 경계) 기본: 16곳** — Spectrum 2, Primer, Fluent 2(아래만 더 진한 변형), Atlassian, Polaris, Radix, shadcn, Geist, Ant, Mantine, Chakra, GOV.UK, Paste, EUI, Nord, Canvas, SLDS
    - SLDS 를 포함하면 17
- **Filled + 아래 경계 기본: 1곳** — Carbon
- **Filled(경계 안 보임) 기본: 1곳** — Base Web
- **기본 지정 없음(filled·outlined 병행): 1곳** — Material 3
- **Underline 전용 기본: 0곳** — 변형으로만 제공: Fluent `underline`, Ant `underlined`, Chakra `flushed`
- **Soft(틴트 면·경계 없음) 기본: 0곳** — 변형으로만 제공: Radix `soft`, Chakra `subtle`, Ant `filled`, Mantine `filled`
- **해석**: "경계 있는 칸" 이 압도적 다수다. filled 계열은 Carbon·Base Web·M3 처럼 **면 대비를 체계적으로 설계한 시스템**에서만 기본값이다. 대부분의 웹 시스템은 filled 를 **보조 변형**으로 둔다

### 2.3 다크 모드에서 반복되는 패턴

**1. 필드 면 = 페이지와 같거나 한 단계 밝게 — 세 갈래**

- **(a) 한 단계 밝게 (8곳)** — Carbon(+1 레이어), Fluent, Atlassian, Mantine, Base Web, M3 filled, shadcn(흰 4.5%), Geist(#0a0a0a on #000)
    - 밝기 차이는 대부분 **1.06~1.2:1** 로 아주 작다. 면 차이만으로는 칸을 알아보게 하지 않는다
- **(b) 페이지와 같은 색 (6곳)** — Primer, Spectrum 2, Paste, EUI, M3 outlined, Chakra(투명)
- **(c) 페이지보다 어둡게 파임 (3곳)** — Radix surface(`rgba(0,0,0,.25)`), Primer `contrast` 모드(#010409), Nord
- 요약: **"다크에서는 필드를 약간 밝게"** 가 가장 흔하지만 규범은 아니다. Carbon 만 문서로 "필드는 한 단계 위 레이어" 라고 명시한다 [S]

**2. 경계는 두 부류로 갈린다**

- **흰색 알파(12~23%) 계열** — shadcn 15%, Geist 14%, Radix 23%
    - 합성하면 #2c2c2c~#454545 · **대비 1.4~2.0:1 로 WCAG 1.4.11(3:1) 미달**
    - 이 시스템들은 면 차이·placeholder·라벨이 칸을 알린다는 해석(W3C Understanding 1.4.11: "보이는 내용이 있으면 경계는 필수 아님")에 기대거나, 단순히 지키지 않는다
- **불투명 중간 회색 계열** — Atlassian #7E8188(3.93), Spectrum 2 #6d6d6d(3.65), Paste #606b85(3.50), Carbon #6f6f6f(3.01, 아래만), Fluent 아래 #adadad(6.48), M3 #938F99(5.87)
    - = **3:1 을 넘기는 쪽**
- Primer #3d444d(1.92) · Mantine · Ant · Chakra · Nord 의 짙은 회색은 3:1 미달
- 흥미로운 점: **Atlassian 은 장식 경계는 12% 알파, 입력 경계만 불투명 3.9:1** 로 역할을 나눴다. Fluent 는 옆 경계는 2.5:1 로 흐리게 두고 **아래 한 변만 6.5:1** 로 식별 단서를 몰았다. 둘 다 "3:1 은 지키되 칸이 무겁지 않게" 하는 방법이다
- NosLog 지금(#8A8A8A, 5.69:1)은 조사한 시스템 가운데 **경계가 가장 밝은 편**이다. M3 outlined(5.87)와 비슷하고 Spectrum 2 는 이 색을 **마우스 올림 상태**에 쓴다. "와이어프레임 같다" 는 인상은 여기서 온다 — 면이 페이지와 같고 경계만 밝게 서 있기 때문이다

**3. 포커스 방식 — 네 갈래**

- **안쪽 링 / 경계 두께 증가 (7곳)** — Carbon(2px 흰 inset), Primer(2px offset −1), Radix(2px offset −1), M3(1→2px), Chakra(inside ring), Canvas·Atlassian 오류(inset 1px 추가), EUI(2px outline)
    - 크기·배치가 변하지 않는다
- **경계 색만 변경 (2곳)** — Atlassian, Mantine
- **바깥 링 (5곳)** — shadcn(3px 반투명), Ant(2px), Polaris(2px + 간격 1), Paste(4px), GOV.UK(3px 노랑), Spectrum 2 키보드 포커스(2px + 간격 2)
- **아래 바만 (1곳)** — Fluent(2px 브랜드 바)
- 다크의 포커스 색:
    - 무채색 흰색 계열 — Carbon #fff, Spectrum #dbdbdb, Fluent 목록 항목 #fff, Chakra gray #a1a1aa
    - 브랜드 파랑 — 나머지 대부분
    - 브랜드 색이 없는 무채색 제품은 흰색·밝은 회색 포커스가 선례다(Carbon g100, Spectrum 2)

**4. 마우스 올림**

- 경계 색 변경 — Spectrum, Fluent, Ant, Primer 버튼
- **면 색 변경** — Carbon(`field-hover`), Atlassian(`input.hovered`), shadcn 셀렉트(`input/50`), Ant filled, Spectrum Picker

### 2.4 radius 분포 (기본 크기 입력칸)

| radius | 시스템                                                        |
| ------ | ------------------------------------------------------------- |
| 0      | Carbon(v12 에서 변경 예정), GOV.UK                            |
| 4      | M3, Fluent, Radix(size 1·2), Chakra, EUI, Canvas              |
| 6      | Primer, Atlassian, Ant, Geist                                 |
| 8      | Spectrum 2, Polaris, shadcn, Mantine(master), Base Web, Paste |
| 알약   | 입력칸 기본값으로는 0곳 — **검색창**에서만: M3 search bar     |

- 최근 개편(Spectrum 2, Paste, Polaris, shadcn v4, Atlassian 3→6)은 **6~8 쪽으로 이동**했다
- 4 는 M3·Fluent 같은 오래된 체계에 남아 있다

### 2.5 셀렉트 패턴

- **닫힌 트리거 = 입력칸과 같은 모양 (10곳 이상)** — Carbon, Primer, Fluent, Radix, shadcn, Geist, Ant, Chakra, Paste, Mantine
    - **예외: Spectrum 2 Picker** — 면을 gray-100 으로 밝혀 버튼처럼 보이게 한다
- 꺾쇠는 전부 **오른쪽 끝**
    - Geist 14px · 끝에서 12
    - shadcn 16px
    - Carbon 끝에서 16
- **열린 목록의 선택 표시** — 세 갈래
    - **체크 표시만** — Fluent(왼쪽), Radix(왼쪽 체크 + 강조 면은 키보드 위치용), Mantine(체크 + 선택 면)
    - **배경 강조 + 체크 둘 다** — Carbon(`layer-selected` + 체크), shadcn(올림 `accent` + 오른쪽 체크)
    - **배경 강조만** — M3(`secondary-container`), Ant(`colorPrimaryBg` + 굵은 글자)
- **목록 면**
    - 다크에서 페이지보다 밝은 떠 있는 면 — shadcn #171717, Atlassian #2B2C2F, Ant #1f1f1f, Chakra #111, Mantine #2e2e2e
    - 경계 — 1px(shadcn 흰 10%, Mantine dark-4, Primer #3d444d) 또는 그림자 안 1px 링(Atlassian, Primer)
    - radius — 4~8
    - 그림자 — 다크에서도 유지(shadcn `shadow-md`, Radix `shadow-5`, Atlassian 3겹)
- **항목 높이** — Carbon·Ant 는 필드 높이와 같게(40/32), shadcn 은 `py-1.5`(≈32), Radix 24/32

### 2.6 검색창

- 전부 **입력칸을 재사용**하고 앞에 돋보기, 뒤에 지우기(×) 버튼(Primer trailingAction, Spectrum clear, Carbon, Fluent SearchBox, Apple iOS)
- **알약 모양은 M3 search bar(56 · corner-full) 하나** — 나머지는 입력칸과 같은 radius
- Geist: Esc 로 비움 + ⌘K 힌트

### 2.7 버튼과 입력칸 높이

- **같은 높이 (8곳)** — Primer 32, shadcn 36, Geist 32/36/40, Ant 32, Mantine 30~60 같은 표, Chakra 40, Radix 32, Base Web(radius 도 같음)
- **다른 높이** — M3(필드 56 vs 버튼 40), Carbon 기본값(필드 40 vs 버튼 lg 48 — 크기 이름은 맞춰져 있음)
- **보조 버튼 = 입력칸과 같은 면 (4곳)** — shadcn outline(`bg-input/30` + `border-input`), Geist secondary(#0a0a0a + 1px 링), Base Web secondary(#292929), Primer default(#212830)
    - 입력칸과 보조 버튼이 한 언어로 묶인다
- **주 버튼 = 흑백 반전** — 무채색 다크 시스템(shadcn #e5e5e5, Geist #ededed, Base Web #C4C4C4)
    - NosLog 의 현재 `primary/default` #DBDBDB 와 같은 방향이다

### 2.8 다크 필드에 대한 명시 지침

- **W3C Understanding 1.4.11** [V]
    - 보이는 내용(텍스트·충분히 대비되는 아이콘)이 있으면 입력 영역의 경계선 자체는 필수가 아니다
    - 컨트롤을 알아보거나 상태(포커스 포함)를 알리는 데 **필요한** 시각 정보는 인접 색과 **3:1** 이 필요하다
- **Carbon** — 필드는 놓인 면 위의 레이어이며 `field-0N`·`border-strong-0N` 을 레이어 번호로 짝짓는다 [S]
- **Stripe** — 모바일 입력칸 글자 16px 이상 [V]
- **Apple** — placeholder 만으로 라벨을 대신하지 말 것 [V]

### 2.9 방향 선택지 (근거가 있는 조합만)

1. **Outlined 유지 + 경계 톤다운 + 면 한 단계** (Atlassian·Spectrum 2·Paste 계열)
    - 면을 페이지보다 한 단계 밝게(예: 기존 `surface/surface`)
    - 경계를 3:1 을 막 넘는 불투명 회색으로 낮춤(Spectrum `#6d6d6d` 3.65 · Atlassian `#7E8188` 3.93 수준)
    - 올림 = 면 변경, 포커스 = 기존 FOCUS-1B(경계 색 교체)
    - 문서 24 의 `border/strong`(입력 경계, 3:1) 결정과 충돌이 가장 적다
2. **Filled + 아래 경계** (Carbon 계열)
    - 밝은 면 + 아래 1px 만 3:1, 포커스 = 안쪽 2px 흰 outline
    - 가장 "디자인된" 인상이지만, FOCUS-1B(1px INSIDE 경계 하나) 규칙과 포커스 두께가 다르다
3. **Fluent 식 혼합**
    - 옆·위는 흐린 경계(장식), **아래 한 변만 3:1 이상**
    - 3:1 을 지키면서 칸이 가벼워진다
4. **Filled 무경계** (Base Web·Radix soft·Ant filled)
    - 경계가 없으면 면 대비 1.1~1.4 로 1.4.11 을 **텍스트·아이콘 단서로만** 충족해야 한다
    - 문서 24 「입력 컨트롤 경계」 결정(`border/default` 미달 → `border/strong`)을 되돌리는 셈이라 **사용자 결정 사안**이다

---

## 3. 확인하지 못한 것

- Atlassian 입력 높이·라벨·셀렉트 — 문서가 JS 렌더라 못 가져왔다. 브라우저 측정은 공유 창이 다른 사이트로 넘어가 폐기
- SLDS 실제 값 · Nord radius·높이 · Paste 높이 · Base Web 높이 · Spectrum 2 버튼·검색 radius
- Geist 키보드 포커스 모양 · M3 공식 스펙 페이지(JS 렌더, 56 은 2차 출처)
- Ant 다크 primary hex · Canvas 문서(403) · Stripe `night` 값 · Linear
