# 셀렉트 목록 · 버튼 · 검색창 — 다크 테마 추가 조사 (2026-09-14)

`research-design-systems.md`·`research-sites.md` 의 빈칸을 채운 조사. 읽기 전용 웹 조사(WebSearch·WebFetch로 공식 소스·토큰 파일을 읽음) · 브라우저 실측 없음 · 프로젝트 파일 변경 없음.

## 표기

| 표시    | 뜻                                               |
| ------- | ------------------------------------------------ |
| **[V]** | 1차 출처(소스 코드·토큰 파일·공식 문서)에서 확인 |
| **[D]** | 확인한 값으로 계산한 값                          |
| **[S]** | 2차 출처만 있음 — 확정값으로 쓰지 말 것          |
| **[N]** | 못 찾음                                          |

**먼저 알아 둘 점**

- WebFetch 는 원문을 요약 모델을 거쳐 돌려준다. 그래서 [V] 값도 옮기다 틀렸을 가능성이 조금 남는다. Carbon 버튼 색은 처음에 잘못 읽힌 값이 나와 다른 파일로 다시 확인했다.
- Discord · Spotify Encore · Twitch · Linear 는 공개 소스가 없어 거의 [S] 또는 [N].

---

## A. 열린 셀렉트 · 드롭다운 패널

### A1. GitHub Primer (ActionMenu / ActionList, 다크)

출처: primer/react `ActionList/ActionList.module.css`·`Item.tsx`, `postcss-preset-primer/src/mixins/activeIndicatorLine.css`, unpkg `@primer/primitives/dist/css/functional/{themes/dark,size/size,size/radius}.css`

| 항목               | 값                                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 패널 배경          | `--overlay-bgColor` #010409 [V]                                                                                               |
| 패널 경계·그림자   | `shadow-floating-small` = `0 0 0 1px #3d444d, 0 6px 12px -3px #01040966, 0 6px 18px 0 #01040966` — 경계는 그림자의 1px 링 [V] |
| 패널 radius        | 6px [V]                                                                                                                       |
| 트리거와의 간격    | 4px [V]                                                                                                                       |
| 목록 안쪽 여백     | inset 변형 위아래 8 · 항목 좌우 margin 8 [V]                                                                                  |
| 항목 여백 · 높이   | 세로 6 · 가로 8 → 6 + 20 + 6 = **32** [D] (control-medium 32 [V])                                                             |
| 항목 radius        | 6px [V]                                                                                                                       |
| 마우스 올림 / 누름 | #656c7633 / #656c7640 [V]                                                                                                     |
| 선택 표시          | 배경 #656c7633 + semibold + 체크 [V]                                                                                          |
| 체크 위치          | **왼쪽** [V]                                                                                                                  |
| 키보드 강조        | active-descendant = 선택과 같은 면 · focus-visible = 왼쪽 강조 막대(폭 4 · #1f6feb · radius 6) [V]                            |
| 구분선             | 1px #3d444db3 [V]                                                                                                             |

### A2. Radix Themes Select (다크)

출처: radix-ui/themes `components/select.css`·`_internal/base-menu.css`, `styles/tokens/{space,radius,shadow,color}.css`, unpkg `@radix-ui/colors/gray-dark.css`

| 항목           | 값                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| 패널 배경      | `--color-panel-solid` = gray-2 #191919 [V]                                                               |
| 그림자·경계    | `--shadow-5` = `0 0 0 1px gray-a6, 0 12px 60px black-a5, 0 12px 32px -16px black-a7` — 경계는 1px 링 [V] |
| 패널 radius    | size1 6 · size2 8 [D]                                                                                    |
| 패널 안쪽 여백 | size1 4 · size2 8 [V/D]                                                                                  |
| 항목 높이      | size1 **24** · size2 **32** [V/D]                                                                        |
| 항목 radius    | size1 3 · size2 4 [D]                                                                                    |
| 항목 여백      | 좌우 모두 체크 칸 폭(대칭) [V]                                                                           |
| 강조           | solid = `accent-9` 채움 · soft = `accent-a4` — 마우스·키보드 공통 [V]                                    |
| 체크 위치      | **왼쪽** (`position:absolute; left:0`) [V]                                                               |
| 구분선         | 1px gray-a6 [V]                                                                                          |
| 그룹 라벨      | 높이 = 항목 높이 · 들여쓰기 = 체크 칸 폭 · 색 gray-a10 [V]                                               |
| 폭             | `min-width: var(--radix-select-trigger-width)` [V]                                                       |

### A3. shadcn/ui Select (new-york-v4, 다크)

출처: shadcn-ui/ui `apps/v4/registry/new-york-v4/ui/select.tsx`, `apps/v4/app/globals.css`, tailwindcss `theme.css`

| 항목          | 값                                                               |
| ------------- | ---------------------------------------------------------------- |
| 패널          | `rounded-md border bg-popover shadow-md` · 최소 폭 8rem [V]      |
| 배경·경계     | popover oklch(0.205 0 0) · border 흰 10% [V]                     |
| 그림자        | `0 4px 6px -1px rgb(0 0 0/.1), 0 2px 4px -2px rgb(0 0 0/.1)` [V] |
| 패널 radius   | ≈ 8 [D]                                                          |
| 항목          | `rounded-sm py-1.5 pr-8 pl-2 text-sm` → **32** [D]               |
| 강조          | `focus:bg-accent` (oklch 0.371) — 마우스·키보드 같은 면 [V]      |
| 체크 위치     | **오른쪽** (`absolute right-2`, 14px) [V]                        |
| 라벨 · 구분선 | `px-2 py-1.5 text-xs muted` · `h-px bg-border` [V]               |
| 열리는 위치   | 기본 `item-aligned` — 선택 항목이 트리거 위에 겹쳐 열림 [V]      |
| 트리거        | 36 (sm 32) · 다크 `bg-input/30`, 올림 `/50` [V]                  |

### A4. IBM Carbon Dropdown / ListBox (g100)

출처: carbon `packages/styles/scss/components/list-box/_list-box.scss`, unpkg `@carbon/themes`, `@carbon/layout/scss/generated/_size.scss`

| 항목             | 값                                          |
| ---------------- | ------------------------------------------- |
| 패널 배경        | layer-01 #262626 [V]                        |
| radius           | 0 (v12 플래그에서만 radius) [S]             |
| 최대 높이        | 항목 × 5.5 [V]                              |
| 항목 높이        | sm 32 · md 40 · lg 48 [V]                   |
| 항목 사이 구분선 | 위 경계 #525252 [V]                         |
| 마우스 올림      | #333333 [V]                                 |
| 선택 표시        | 면 #393939 + 체크 **오른쪽**(끝에서 16) [V] |
| 키보드 강조      | focus-outline 믹스인, #ffffff [V]           |
| 트리거와의 간격  | 4px (v12 플래그) [V]                        |

### A5. Adobe Spectrum 2 Picker / Menu (다크)

출처: adobe/react-spectrum `packages/@react-spectrum/s2/src/{Picker,ComboBox,Menu,Popover}.tsx`, `s2/style/spectrum-theme.ts`, unpkg `@spectrum-css/tokens/dist/css/dark-vars.css`

| 항목            | 값                                                  |
| --------------- | --------------------------------------------------- |
| 패널 배경       | layer-2 = gray-75 #222222 [V]                       |
| 패널 경계       | 1px gray-200 #323232 [V]                            |
| 패널 radius     | **10** [V]                                          |
| 트리거와의 간격 | S·M 6 · L 7 · XL 8 [V]                              |
| 폭              | 폭·최소 폭 = 트리거 폭 · 최대 320 · 안쪽 여백 8 [V] |
| 항목 높이       | M 기준 **32** [D]                                   |
| 키보드 강조     | focus-visible 면 gray-100 #2c2c2c [V]               |
| 체크 위치       | **왼쪽** [V]                                        |
| 구분선          | 2px, 위아래 합 12 [V]                               |
| 누름            | `pressScale()` 크기 축소 있음 [V]                   |

### A6. Fluent 2 Listbox / Option (web 다크)

출처: microsoft/fluentui `react-combobox/library/src/components/{Option,Listbox,Combobox}/use*Styles.styles.ts`, `packages/tokens/src/{alias/darkColor.ts,global/borderRadius.ts,global/spacings.ts}`

| 항목               | 값                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------ |
| 패널               | 배경 #292929 · 경계 1px 투명(고대비용) · radius 4 · shadow16 · 최대 80vh · 안쪽 여백 4 [V] |
| 항목 사이 간격     | rowGap 2 [V]                                                                               |
| 항목               | 여백 6 8 · 14/20 → **32** [D] · radius 4 [V]                                               |
| 마우스 올림 / 누름 | #3d3d3d / #1f1f1f [V]                                                                      |
| 키보드 강조        | `::after` 2px #ffffff, 안쪽 −2px [V]                                                       |
| 체크 위치          | **왼쪽**, 선택 전에는 visibility:hidden [V]                                                |
| 트리거 높이        | 24 · 32 · 40 · radius 4 [V]                                                                |

### A7. Atlassian Select (react-select 기반, 다크)

출처: unpkg `@atlaskit/react-select/dist/es2019/components/{option,menu,control,group-heading}.compiled.css`, `@atlaskit/tokens/.../atlassian-dark.js`

| 항목      | 값                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------ |
| 패널      | 배경 #2B2C2F · radius 8 · `shadow-overlay`(1px 밝은 링 포함) · 간격 8 · 폭 100% [V]                    |
| 항목 여백 | 6 12 → 32 [D]                                                                                          |
| 선택 표시 | 면 #1C2B42 + 글자 #669DF1 + **왼쪽 안쪽 2px 막대** [V]                                                 |
| 그룹 제목 | 12/16 bold #A9ABAF · 좌우 12 [V]                                                                       |
| 컨트롤    | 최소 40 (compact 32) · radius 6 · 1px #7E8188 · 면 #242528 · 올림 #2B2C2F · focus 안쪽 1px #8FB8F6 [V] |

### A8. Mantine Combobox / Select (다크)

출처: mantinedev/mantine `@mantine/core/src/components/{Combobox,Select,Popover}/*`, `core/MantineProvider/default-colors.ts`

| 항목        | 값                                                         |
| ----------- | ---------------------------------------------------------- |
| 패널        | #2e2e2e · 1px #424242 · 그림자 기본 none · 안쪽 여백 4 [V] |
| 항목 여백   | sm(기본) 6/10 → ≈ 34 [D]                                   |
| 마우스 올림 | #242424 [V]                                                |
| 선택 표시   | primary 채움 + 흰 글자 [V]                                 |
| 체크        | 기본 켜짐 · **왼쪽** [V]                                   |
| 폭          | 트리거 폭 [V]                                              |

### A9. Chakra UI v3 Select (다크)

출처: chakra-ui `packages/react/src/theme/{recipes/select.ts,semantic-tokens/{colors,radii}.ts,tokens/{radius,colors}.ts}`

| 항목      | 값                                                     |
| --------- | ------------------------------------------------------ |
| 패널      | #111111 · radius 4 · shadow md · 최대 384 · 여백 4 [V] |
| 항목(md)  | **32** [D] · radius 2 [V]                              |
| 강조      | `bg.emphasized/60` [V]                                 |
| 체크 위치 | **오른쪽** (space-between) [V]                         |
| 트리거    | 기본 md **40** · outline [V]                           |

### A10. Ant Design Select (다크 알고리즘)

출처: ant-design `components/select/style/{dropdown,token}.ts`, `components/theme/themes/{seed,shared/genRadius,dark/colors}.ts`

| 항목      | 값                                                              |
| --------- | --------------------------------------------------------------- |
| 패널      | ≈ #1f1f1f [D] · radius 8 [D] · boxShadowSecondary [V]           |
| 항목      | 높이 **32** [V] · 여백 ≈ 5 12 [D] · radius 4 [D]                |
| 강조      | 흰 8% [D] — 마우스·키보드 공통                                  |
| 선택 표시 | 면 (다크 blue-1 #111a2c) + 굵게 [V] · 단일 선택은 체크 없음 [S] |
| 폭        | 최소 폭 = 셀렉트 폭 [V]                                         |

### A11. Material 3 Menu

출처: androidx `compose/material3/.../tokens/{MenuTokens,ShapeTokens}.kt`, material-web `tokens/_md-comp-menu.scss`

| 항목             | 값                                                                    |
| ---------------- | --------------------------------------------------------------------- |
| 패널             | SurfaceContainer · Level2 · radius 4 · 위아래 8 [V]                   |
| 항목 높이        | 48dp [S]                                                              |
| 선택 표시        | SecondaryContainer 면(폭 전체) [V]                                    |
| Expressive(2025) | 더 둥근 모서리 · 선택 면이 폭 전체가 아님 · 구분선 대신 간격 묶음 [S] |

### A12. Base Web Menu

출처: uber/baseweb `src/menu/styled-components.tsx`, `src/themes/shared/{borders,sizing,typography}.ts`

| 항목      | 값                                         |
| --------- | ------------------------------------------ |
| 패널      | shadow600 · 위아래 8 좌우 0 · radius 8 [V] |
| 항목      | 8 16 + 14/20 → **36** [D]                  |
| 선택 표시 | 글자색만 [V]                               |

### A13. Arco Design Select

출처: arco-design `components/Select/style/token.less`, `components/style/theme/global.less`

- 패널 경계 `color-fill-3` · 그림자 `0 4px 10px rgba(0,0,0,.1)` · 위아래 4 [V]
- 항목 **36** · 좌우 12 · 선택 = 글자색 + weight 500, 면은 그대로 [V]
- 트리거 32 [V] · 다크 hex·radius px [N]

### A14. 그 밖

- **Headless UI Listbox 문서 예시** [V]: 패널 폭 = 버튼 폭 · 체크 **왼쪽** · 강조 `data-focus:bg-*`
- **Apple HIG 팝업 버튼** [V]: 상호 배타 선택지의 평면 목록, 버튼이 현재 선택을 보여 줌. 체크 위치와 「현재 항목을 버튼 위치에 맞춰 여는」 동작은 HIG 본문에 없음 [N]
- **Vercel Geist**: Select = 네이티브 `<select>` [V] · 치수·색 [N]
- **Discord**: 데스크톱 드롭다운, iOS·Android 는 팝업 시트 [V] · 값 [N]
- **Linear · Spotify Encore · Park UI · Naver · Kakao · Toss(TDS)**: 공개 소스 없음 [N]

### A 종합

**선택 표시** (한 시스템이 여러 방식을 함께 쓰기도 함)

| 방식                | 수    | 시스템                                                         |
| ------------------- | ----- | -------------------------------------------------------------- |
| 체크 왼쪽           | **6** | Radix · Primer · Fluent 2 · Spectrum 2 · Mantine · Headless UI |
| 체크 오른쪽         | **3** | shadcn · Chakra v3 · Carbon (+ Ant 다중 선택 [S])              |
| 면 채움             | 5     | Primer · Carbon · Ant · M3 · Atlassian                         |
| 왼쪽 강조 막대      | 2     | Atlassian(선택) · Primer(focus)                                |
| 굵기                | 3     | Primer · Ant · Arco                                            |
| 글자색만            | 3     | Base Web · Arco · Atlassian                                    |
| 체크 없이 면·굵기만 | 2     | Ant 단일 선택 · M3                                             |

**패널 radius**: 0 Carbon · 4 Fluent·Chakra·M3 · 6 Primer · **8 Radix·shadcn·Atlassian·Ant·Base Web(5곳)** · 10 Spectrum 2

**항목 높이**: 24 Radix size1 · **32 Radix·Primer·shadcn·Fluent·Spectrum 2·Atlassian·Ant·Chakra(8곳)** · ≈34 Mantine · 36 Arco·Base Web · 40/48 Carbon · 48 M3 [S]

**키보드 강조**: 마우스와 같은 면 — shadcn·Radix·Chakra·Ant / 따로 — Fluent 2(안쪽 2px 흰 테두리)·Primer(막대)·Carbon(외곽선)

**패널 폭 = 트리거 폭**: Radix(최소) · Spectrum 2 · Mantine · Ant(최소) · Headless UI · Atlassian(100%)

**트리거와의 간격**: Primer 4 · Carbon 4 · Spectrum 2 6–8 · Atlassian 8 · shadcn 은 트리거 위에 겹쳐 엶

---

## B. 다크 테마 버튼

| 시스템             | 높이                                      | radius                                      | 주 버튼                                           | 보조 버튼                                                              | focus                                         |
| ------------------ | ----------------------------------------- | ------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| Primer [V]         | S 28 · **M 32** · L 40                    | 6                                           | #238636 / 올림 #29903b / 누름 #2e9a40             | **채움 + 경계** #212830 + #3d444d · 올림 #262c36                       | 2px 외곽선 #1f6feb                            |
| shadcn v4 [V]      | **36** (sm 32 · lg 40)                    | ≈ 8 [D]                                     | oklch(.922) 반전, 올림 90%                        | secondary = **채움** oklch(.269) · outline = 경계 + 다크 `bg-input/30` | 3px 링 50% + 경계 ring 색                     |
| Radix Themes [V/D] | 24 / **32** / 40 / 48                     | size2 4 [D]                                 | accent-9 → 10                                     | soft(채움) · surface(안쪽 경계) · outline(투명)                        | 2px focus-8, offset 2                         |
| Carbon g100 [V]    | 기본 **lg 48** (sm 32 · md 40)            | 0 [S]                                       | #0f62fe / #0050e6 / #002d9c                       | secondary = **채움** #6f6f6f · tertiary = 흰 경계 아웃라인             | 경계 + 안쪽 box-shadow                        |
| Spectrum 2 [V/D]   | XS 20 · S 24 · **M 32** · L 40 · XL 48    | **알약**                                    | accent fill · primary fill = neutral              | secondary fill = **채움** gray-100 **#2c2c2c** · outline = 2px 경계    | focus-ring 외곽선 · 누름 크기 축소 있음       |
| Fluent 2 [V/D]     | S ≈ 24 · **M 32** · L ≈ 40                | 4                                           | brand                                             | **채움 + 경계** #292929 + 1px #666666                                  | 1px #fff + 안쪽 1px = 안쪽 2px 흰색           |
| Atlassian [V]      | **32** · compact 24                       | 4 또는 6 [N]                                | #669DF1 / 올림 #8FB8F6                            | 반투명 채움 [S]                                                        | [N]                                           |
| Mantine [V]        | xs 30 · **sm 36** · md 42 · lg 50 · xl 60 | 기본 radius                                 | filled                                            | 다크 값 [N]                                                            | [N]                                           |
| Chakra v3 [V]      | **md 40**                                 | 4                                           | solid                                             | subtle(채움) · surface · outline(경계)                                 | 바깥 링                                       |
| Ant [V/D]          | **32**                                    | 6                                           | #1677ff                                           | **채움 + 경계** #141414 + #424242 [D]                                  | —                                             |
| Material 3 [V]     | **40dp**                                  | round = 알약 · square 12 · 누르면 8 로 변형 | filled                                            | [N]                                                                    | —                                             |
| Base Web [V]       | [N]                                       | 8 (mini 4)                                  | —                                                 | —                                                                      | —                                             |
| Geist              | [N]                                       | 6 [S]                                       | 변형 default·secondary·tertiary·error·warning [V] | —                                                                      | 두 겹 링 `0 0 0 2px 배경, 0 0 0 4px 파랑` [S] |
| Spotify Encore     | ≈ 48 [S]                                  | 알약 [S]                                    | —                                                 | —                                                                      | —                                             |
| Twitch Core UI     | [N]                                       | 버튼 알약 · 입력 6 · 카드 4 [S]             | —                                                 | —                                                                      | —                                             |

### B 종합

**기본 보조 버튼 형태**

| 형태                    | 수  | 시스템                                                                             |
| ----------------------- | --- | ---------------------------------------------------------------------------------- |
| 중립 면 채움, 경계 없음 | 4   | shadcn secondary · Spectrum 2 secondary · Carbon secondary · Chakra subtle         |
| 중립 면 채움 + 1px 경계 | 4   | Primer default · Fluent secondary · Ant default · shadcn outline(다크 반투명 채움) |
| 투명 + 경계(아웃라인)   | 4   | Carbon tertiary · Spectrum 2 outline · Chakra outline · Radix outline·surface      |

→ 다크 기본 보조 버튼은 **채움 계열이 8곳**. 투명 아웃라인은 대체로 3순위 변형으로 둔다.

**버튼 높이 = 입력 높이**: 같음 **9곳** (Primer · Mantine · Ant · shadcn · Chakra · Fluent · Spectrum 2 · Radix · Paste) / 다름 3곳 (Carbon 48:40 · M3 40:56 · Atlassian 32:40)

**버튼 radius**: 0 Carbon · 4 Fluent·Chakra·Radix · 6 Primer·Ant·Geist · 8 shadcn·Base Web · 알약 Spectrum 2·M3·Spotify·Twitch

**누를 때 크기 축소**: Spectrum 2(`pressScale`) · M3(모양 변형)만 확인. 나머지는 색 단계만.

---

## C. 이전 조사의 빈칸

| 항목                        | 결과                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spectrum 2 버튼 높이        | XS 20 · S 24 · **M 32** · L 40 · XL 48 [V]                                                                                                                                   |
| Spectrum 2 버튼 radius      | 알약(높이의 절반) [V] → M 16 [D]                                                                                                                                             |
| Spectrum 2 검색창 radius    | FieldGroup `borderRadius: 'full'` — **알약** [V]                                                                                                                             |
| Spectrum 2 일반 입력 radius | `round(8 × 1.125^n)`: S ≈ 7 · M 8 · L 9 · XL 10 [D]                                                                                                                          |
| Spectrum 2 입력 경계        | 2px gray-300(#393939) · 면 gray-25(#111111) · focus gray-900(#f2f2f2) [V] — 이전 조사(spectrum-css 1px #6d6d6d)와 다름. React S2 와 spectrum-css 의 차이로 보이나 확인 못 함 |
| Atlassian 텍스트 필드 높이  | **40** [D] (compact 32) · 셀렉트 컨트롤 최소 40 [V] 와 일치                                                                                                                  |
| Material 3 텍스트 필드 높이 | **56dp** · radius 4 · 경계 1 · focus 경계 2 [V] (`OutlinedTextFieldTokens.kt`)                                                                                               |
| Twilio Paste 입력 높이      | 8 + 20 + 8 = **36** [D] · radius 4 [V]                                                                                                                                       |
| Base Web 입력 높이          | mini 32 · compact 36 · **기본 48** · large 60 [D] · focus 외곽선 3px [V]                                                                                                     |
| Geist 키보드 focus 링       | 1차 출처 없음 [N] · 2차: 두 겹 링 [S]                                                                                                                                        |

---

## D. 검색창

| 시스템                 | 모양                            | 높이                    | 앞 아이콘      | 지우기 버튼                     |
| ---------------------- | ------------------------------- | ----------------------- | -------------- | ------------------------------- |
| Spectrum 2             | **알약** [V]                    | 입력과 같음 [D]         | 한 줄 높이 [V] | 필드 크기를 따름 [V]            |
| Material 3 search bar  | **알약** [V]                    | 56 = 텍스트 필드 56 [V] | [N]            | [N]                             |
| Carbon                 | 입력과 같음 · 아래 경계 1px [V] | 기본 md 40 [V]          | 16 [V]         | **필드 높이 정사각**(40×40) [V] |
| Fluent 2 SearchBox     | 입력과 같음(4) [D]              | 입력과 같음 [D]         | [N]            | 아이콘 16 · 20 · 24 [V]         |
| Primer                 | TextInput 6 [D]                 | 32 [V]                  | [N]            | 안쪽 액션 24 (S 20 · L 28) [V]  |
| Geist                  | `rounded` 속성 가능 [V]         | [N]                     | [N]            | Esc 로 지움 · ⌘K 표시 [V]       |
| Spotify 웹             | 알약 [S]                        | [N]                     | [N]            | [N]                             |
| Ant · Mantine · Chakra | 입력과 같은 radius [S]          | —                       | —              | —                               |

---

## 확인하지 못한 것

- Geist 버튼·입력·메뉴 px 값과 focus 링 1차 출처
- Linear · Discord · Spotify Encore · Twitch Core UI · Naver · Kakao · Toss(TDS) — 공개 소스 없음
- Park UI 셀렉트 레시피(404) · Arco 다크 hex·radius px
- Atlassian 버튼 radius(4 인지 6 인지) · default 버튼 토큰 · 포커스 링
- Mantine default 버튼 다크 값 · `data-combobox-selected` 공식 설명
- Material 3 메뉴 항목 48dp 1차 토큰 · Expressive 메뉴 수치 · outlined·tonal 버튼
- Apple HIG 체크 위치 · 「현재 항목을 버튼 위치에 맞춰 여는」 동작
- Radix Select 콘텐츠 기본 변형(solid/soft)
- shadcn `rounded-md`/`rounded-sm` px 매핑(계산값)
- Spectrum 2 다크 hex 는 `@spectrum-css/tokens` 기준 — React S2 테마와 같은 버전인지 미확인
