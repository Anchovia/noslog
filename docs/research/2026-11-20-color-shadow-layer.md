# 그림자 · 쌓임 층 — 떠 있는 판 · 가림막 · z-index (2026-11-20)

색 파운데이션 3단계 「그림자 · 쌓임」 판의 재료 조사다. 판단 · 추천은 하지 않는다. 묶음 1은 다크 화면에서 떠 있는 것(메뉴 · 셀렉트 목록 · 대화상자 · 토스트 · 툴팁 · 고정 머리)을 그림자로 띄우는지, 더 밝은 면이나 둘레 선으로 띄우는지, 가림막 색과 투명도, 카드 · 구역 상자에 그림자를 쓰는지를 적는다. 묶음 2는 z-index 를 토큰으로 두는지와 단계 이름 · 값 · 순서를 적고, NosLog `app/styles/tokens/levels.css` 12역할과 짝짓는다.

## 방법

- headless Playwright(chromium) 1440×900, `colorScheme: 'dark'`, `permissions: []`, `locale: ko-KR`. 페이지마다 `~/noslog-research/wait-capacity.sh` 를 거쳐 브라우저 하나에 페이지 하나씩 열었다. 로그인 · 제출 · 동의 창 누르기는 하지 않았다.
- 곳마다 주소 하나를 열고 아래를 차례로 했다.
    - 머리: 맨 위에 붙은 폭 80% 넘는 `fixed` · `sticky` · `header` 요소의 z-index · 면 · 그림자 · 아래 선 · backdrop-filter. 900px 내린 뒤 한 번 더 읽었다(내리면 그림자가 생기는지).
    - 열어 보기: 첫 화면에 보이는 `aria-haspopup` · `aria-expanded=false` · `combobox` · `summary` 와 「더보기 · 메뉴 · 언어 · 정렬 · 필터 · 공유」 같은 이름의 버튼을 7개까지 눌렀다. 아이콘 버튼 · `data-tooltip` 요소 6개는 올려 보았다(툴팁). 「로그인 · 공유」 버튼은 2개까지 눌러 대화상자를 띄웠다(입력은 하지 않음). 누른 뒤 새로 보인 떠 있는 요소에서 면 · 선 · 그림자가 있는 가장 바깥 판을 골라 읽었다. 주소가 바뀌면(이동 링크) 그 곳은 세지 않고 다시 열었다.
    - 가림막: 누른 뒤 새로 보인 화면 90% 넘는 반투명 요소의 색 · 불투명도 · z-index.
    - 상자 그림자 셈: 화면 3배 높이 안에서 폭 140 · 높이 80 넘고 바탕과 다른 면이나 선이나 그림자가 있는 상자를 「그림자 있음(drop) · 링만(ring, 흐림 0 · 어긋남 0) · 없음」 으로 셌다.
    - 스타일시트: 내려받은 CSS 와 `<style>` 에서 이름에 z-index · elevation · shadow · overlay · dim · scrim · backdrop 이 든 사용자 정의 속성과, 떠 있는 부품 이름(header · menu · dropdown · popover · tooltip · modal · dialog · toast · sheet · overlay 등)이 든 선택자의 z-index 를 모았다(「규칙」 표시, 화면에서 연 값과 구별).
- 값은 `getComputedStyle` 계산값이다. 「면」 은 판의 바탕색을 뒤 바탕 위에 합성한 값, 「대비」 는 판 면과 그 뒤 바탕 사이의 WCAG 비다(면 높이 차를 수로 보려는 것이고 글자 대비가 아니다).
- 스크립트 · 원자료 · 캡처: 공유 메모 `common-layer/stage3/color/color-shadow-layer/`(`probe.js` · `run.mjs` · `services.json` · `raw/<곳>.json` · `shots/<곳>-page.jpg` · `shots/<곳>-<m|t|d><번호>.png`). 디자인 시스템 원본은 `color-shadow-layer/ds-src/`. 주소 목록은 [글자색 단계](./2026-11-20-color-text.md) 조사가 다크로 열린다고 확인한 목록을 그대로 썼다.
- 옛 기록: [다크 서비스 값 한 벌](./2026-11-12-dark-service-sets.md) 점검표 3 · 29–34칸(오버레이 · 그림자 카드 · 드롭다운 · 모달 · 토스트 · backdrop-filter)은 메뉴 · 대화상자를 열지 않고 변수 이름으로 짐작한 칸이 대부분이라, 이번에 화면에서 연 값만 「화면」 으로 세고 옛 칸은 「옛 기록 · 변수」 로 따로 적었다. 디자인 시스템 칸은 옛 기록 값을 원본 파일로 다시 대조해 썼다.

## 당근 SEED 3.2.1 (정본 `common-layer/stage3/daangn-tokens.md`)

- 그림자 토큰 셋: `shadow-s1` 0 1px 4px #00000080 (304행) · `shadow-s2` 0 2px 10px #000000ad (305) · `shadow-s3` 0 4px 16px #000c (306).
- 부품 규격에서 그림자를 쓰는 판: 메뉴 `.menu__content` 면 `bg-layer-floating` #1d2025 · 모서리 20 · `shadow-s3` (1244행), popover · select · floating-action-button 도 s3. 대화상자 `.dialog__content` 는 면 #1d2025 · 모서리 20, 그림자 없음 (1170). alert-dialog · menu-sheet · bottom-sheet 도 그림자 없음 (1198 · 1301). 스낵바 · 도움말 창(help-bubble)도 그림자 없음.
- 가림막: `bg-overlay` #00000074 (209행, 검정 45%) · `bg-overlay-muted` #0000002c (210, 17%). dialog · alert-dialog · menu-sheet · bottom-sheet backdrop 이 `bg-overlay` (1167 · 1197 · 1300).
- 쌓임: z-index 토큰 없음. 부품 변수만 있다. dialog · alert-dialog · menu-sheet · bottom-sheet · side-panel 2 (1166 · 1196 · 1299), menu · popover · select 99999 (1243), snackbar-region 2147483647 (1235), help-bubble 99, 붙는 탭 목록 1 (906 · 941).
- 실제 당근 화면(이번 실측, `daangn`): 「전체 서비스 메뉴 더보기」 메뉴는 면 #1d2025 · 모서리 16 · 그림자 `rgba(255,255,255,.09) 0 0 0 1px, rgba(0,0,0,.5) 0 1px 4px`(흰 9% 링 + s1 꼴) · z 300. 필터 · 지역 대화상자는 SEED `seed-content-dialog` 면 #1d2025 · 모서리 20 · 그림자 없음 · 가림막 #000000 46% · z 402. 화면 CSS 에 carotene 쌓임 변수 `--carotene-z-index-sticky 200` · `-modal 300` · `-notification 400` 이 있다. 구역 상자는 29개 중 2개만 그림자(0 1px 1px #0000000d).

## 디자인 시스템 — 묶음 1 그림자 · 면 높이 · 가림막 (13곳)

다크 공식 값이다. 「떠 있는 면」 은 메뉴 · 대화상자에 쓰는 면 토큰, 괄호는 쪽 바탕과의 대비. 원본은 `color-shadow-layer/ds-src/` 의 파일 이름.

| 곳              | 다크에서 띄우는 방법                           | 메뉴 · 팝오버                                                                                                                                    | 대화상자                                                       | 토스트 · 툴팁                                                 | 카드                                                                            | 가림막                                      | 원본                                                                                                          |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 당근 SEED       | 밝은 면 + 그림자(메뉴만)                       | 면 #1d2025(#000 위 1.29) + s3 0 4px 16px #000c, 선 없음                                                                                          | 면 #1d2025, 그림자 없음                                        | 스낵바 · 도움말 창 그림자 없음                                | 카드 부품 없음                                                                  | #000 45%                                    | 위 절                                                                                                         |
| GitHub Primer   | 그림자 + 1px 링(그림자 첫 겹)                  | floating-small `0 0 0 1px #3d444d, 0 6px 12px -3px #01040966, 0 6px 18px #01040966`, 면 overlay-bgColor = bgColor-muted #151b23(#0d1117 위 1.09) | floating-large `0 0 0 1px #3d444d, 0 24px 48px #010409`        | 토스트 inset 1px 선 + floating-legacy                         | resting-small `0 1px 1px #01040999, 0 1px 3px #01040999`                        | #212830 40%                                 | primer-dark.css                                                                                               |
| Atlassian       | 밝은 면 + 그림자 + 1px 링                      | surface.overlay #2b2c2f(#1f1f21 위 1.18) + shadow.overlay `0 0 0 1px #BDBDBD1F, 0 8px 12px #0104045C, 0 0 1px 1px #01040480`                     | 같음(overlay)                                                  | 같음(overlay)                                                 | surface.raised #242528 + shadow.raised `0 1px 1px #01040480, 0 0 1px #01040480` | blanket #101214 60%                         | atlaskit-dark.js                                                                                              |
| IBM Carbon g100 | 밝은 면(layer 단계), 그림자는 떠 있는 것만     | layer01 #262626 · layer02 #393939 · layer03 #525252(#161616 위 1.20 · 1.57), 그림자 색 토큰 `shadow` rgba(0,0,0,.8)                              | 같은 층 규칙                                                   | 미확인                                                        | 그림자 없이 layer 면                                                            | overlay rgba(0,0,0,.6)                      | carbon-g100.js 1719 · 1782–1786 · 1819–1820행                                                                 |
| Material 3      | 밝은 면(surface-container 단계) + 높이 그림자  | 메뉴 surface-container #211f26(#141218 위 1.14) · elevation level2(3dp) · 모서리 4                                                               | surface-container-high #2b2930(1.29) · level3(6dp) · 모서리 28 | 미확인                                                        | level 0–5 = 0 · 1 · 3 · 6 · 8 · 12dp                                            | scrim #000 · 대화상자 막 불투명도 32%       | m3-elev.scss · m3-color.scss · m3-menu.scss · m3-dialog.scss · md dialog `_dialog.scss` 78행                  |
| MUI             | 그림자 그대로 + 흰 덮개(높이마다 밝게)         | Popover 높이 8 → 흰 11.9% 덮개                                                                                                                   | Dialog 높이 24 → 흰 16.5%                                      | Snackbar 높이 6(흰 10.8%) · Tooltip 회색 700 92%, 그림자 없음 | Paper 높이 1 → 흰 5.1%                                                          | Backdrop rgba(0,0,0,.5)                     | mui-Paper.js 107행 · getOverlayAlpha.js · mui-Popover/Dialog/SnackbarContent/Tooltip/Backdrop.js              |
| Spectrum 2      | 그림자 3겹(다크에서 진하게) + elevated 면      | drop-shadow-elevated `0 4px 12px` ambient .24 · `0 2px 6px` transition .12 · `0 0 2px` key .36                                                   | 미확인(부품 대조 안 함)                                        | 미확인                                                        | emphasized `0 2px 8px .24, 0 1px 4px .12, 0 0 1px .24`                          | overlay #000 · 불투명도 .6                  | spectrum-color.json                                                                                           |
| Fluent 2        | 그림자만(면은 바탕과 같은 Background1 #292929) | MenuPopover shadow16 `0 0 2px rgba(0,0,0,.24), 0 8px 16px rgba(0,0,0,.28)`                                                                       | DialogSurface shadow64 `0 0 8px .24, 0 32px 64px .28`          | Toast shadow8 · Tooltip shadow(값 규칙 미대조)                | 미확인                                                                          | colorBackgroundOverlay 검정 50%             | fluent-shadows.js · fluent-darkcolor.js 179–184행 · fluent-menu.js · fluent-dialog.js · fluent-react-toast.js |
| Chakra UI v3    | 검정 64% 그림자 + 안쪽 1px 밝은 선             | md `0 4px 8px black/64, 0 0 1px inset gray.300/30`                                                                                               | lg 이상 같은 꼴(부품 대조 안 함)                               | 미확인                                                        | xs `0 1px 1px black/64, 0 0 1px inset gray.300/20`                              | 미확인                                      | chakra-shadows.js                                                                                             |
| 채널톡 Bezier   | 밝은 면 단계 + 옅은 그림자 + 안쪽 흰 12% 선    | Select surface-highest #313135 + elevation-3 `0 4px 12px black 8%, 0 0 2px 1px black 5%, inset 0 0 2px white 12%`                                | Modal surface-higher #29292d + elevation-4                     | Toast elevation-3 · 면 #29292d                                | 미확인                                                                          | dim-absolute-black #0006(40%) · heavy #0009 | bezier-beta.css · 옛 기록 「채널톡 Bezier」                                                                   |
| Vercel Geist    | 1px 링 + 그림자                                | menu `0 0 0 1px #ffffff25, 0 1px 1px #00000005, 0 4px 8px -4px #0000000a, 0 16px 24px -8px #0000000f, 0 0 0 1px bg200` · 모서리 12               | modal 같은 꼴 · 0 24px 32px -8px                               | 미확인                                                        | base = 1px 링 `#ffffff25`                                                       | background-200 · 불투명도 .8                | 옛 기록 「Vercel Geist」 29–31칸                                                                              |
| 원티드 Montage  | 밝은 면 + 옅은 그림자, 대화상자는 그림자 없음  | 면 #212225 · 선 1px #333438 · normal small                                                                                                       | 면 #212225 · 그림자 없음 · 모서리 24                           | 토스트 그림자 없음 · blur(32px) 반투명                        | normal 단계 라이트와 같은 값                                                    | #171719 74%                                 | 옛 기록 「원티드 Montage」                                                                                    |
| Shopify Polaris | 다크는 카드 겉 bevel(안쪽 1px 밝은 선)만 바꿈  | 미확인(다크 덮어쓰기 없음)                                                                                                                       | 다크 덮어쓰기 없음                                             | 다크 덮어쓰기 없음                                            | bevel-100 inset 흰 8–16% 선                                                     | rgba(0,0,0,.5)                              | polaris-dark.js 129행 · 옛 기록                                                                               |

- 토스 TDS 는 그림자 토큰이 없고 가림막만 있다(`adaptiveDimmedBackground` rgba(0,0,0,.56), 옛 기록). Bootstrap 5.3 은 다크 변수 파일(`_variables-dark.scss`)에서 그림자를 바꾸지 않는다(`box-shadow` 0 .5rem 1rem rgba(0,0,0,.15) 그대로, `$dropdown-dark-box-shadow: null`). 둘은 표에서 뺐다.
- 면 높이 대비(바탕 → 떠 있는 면): SEED 1.29 · M3 메뉴 1.14 · 대화상자 1.29 · Carbon 1.20 / 1.57 · Atlassian 1.18 · Bezier(surface #1d1d20 → higher #29292d · highest #313135) 1.16 · 1.30 · Primer 1.09.

## 디자인 시스템 — 묶음 2 쌓임 층 (13곳)

z-index 를 토큰(또는 공개 상수)으로 두는지와 단계 값이다. 낮은 것부터 적었다.

| 곳                                 | 토큰으로 두나                                                                         | 단계(이름 값)                                                                                                                                                                   | 순서에서 볼 점                                                  | 원본                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| 당근 SEED                          | 아니오. 부품 변수만                                                                   | 붙는 탭 1 · dialog · sheet · side-panel 2 · help-bubble 99 · menu · popover · select 99999 · snackbar-region 2147483647                                                         | 메뉴가 대화상자보다 위, 토스트가 맨 위. 머리 단계 없음          | daangn-tokens.md 906 · 1166 · 1235 · 1243행      |
| 당근 화면 CSS(carotene)            | 예(변수)                                                                              | sticky 200 · modal 300 · notification 400                                                                                                                                       | 세 단계뿐                                                       | 이번 실측 `daangn` cssVars                       |
| Atlassian                          | 예(`layers` 상수)                                                                     | card 100 · navigation 200 · dialog 300 · layer 400 · blanket 500 · modal 510 · flag 600 · spotlight 700 · tooltip 9999                                                          | 가림막(blanket)과 모달이 따로, 알림(flag)이 모달 위, 툴팁 맨 위 | atlaskit-layers.js                               |
| IBM Carbon                         | 예(Sass 맵)                                                                           | hidden −1 · footer 5000 · overlay 6000 · floating 6000 · header 8000 · modal 9000 · dropdown 9100                                                                               | 머리가 떠 있는 판보다 위, 드롭다운이 모달 위(모달 안 드롭다운)  | carbon-z.scss                                    |
| Shopify Polaris                    | 예(토큰 z-index-0–12)                                                                 | 0 auto · 1 100 · 2 400 · 3 510 · 4 512 · 5 513 · 6 514 · 7 515 · 8 516 · 9 517 · 10 518 · 11 519 · 12 520                                                                       | 번호만 있고 쓰임 이름 없음                                      | polaris-z.js                                     |
| MUI                                | 예(테마 zIndex)                                                                       | mobileStepper 1000 · fab 1050 · speedDial 1050 · appBar 1100 · drawer 1200 · modal 1300 · snackbar 1400 · tooltip 1500                                                          | 메뉴 · 팝오버는 modal 층(1300)을 같이 씀                        | mui-zindex.js                                    |
| Bootstrap 5.3                      | 예(Sass 변수)                                                                         | dropdown 1000 · sticky 1020 · fixed 1030 · offcanvas-backdrop 1040 · offcanvas 1045 · modal-backdrop 1050 · modal 1055 · popover 1070 · tooltip 1080 · toast 1090               | 드롭다운이 붙는 머리보다 아래, 가림막과 판이 따로               | bootstrap-vars.scss 1132–1143행                  |
| Chakra UI v3                       | 예(토큰)                                                                              | hide −1 · base 0 · docked 10 · dropdown 1000 · sticky 1100 · banner 1200 · overlay 1300 · modal 1400 · popover 1500 · skipNav 1600 · toast 1700 · tooltip 1800 · max 2147483647 | 팝오버가 모달 위, 가림막과 모달이 따로                          | chakra-z.js                                      |
| 채널톡 Bezier                      | 예(토큰 layer-z-index)                                                                | hidden −1 · base 0 · floating 1 · overlay 1000 · modal 1100 · toast 1200 · tooltip 1300 · important 2000                                                                        | 일곱 단계, 머리 단계 없음                                       | bezier-beta.css                                  |
| Ant Design 5                       | 바탕값만(zIndexBase 0 · zIndexPopupBase 1000)                                         | 부품이 1000 위에 더함                                                                                                                                                           | 단계 이름 없음                                                  | antd-seed.js 63–65행                             |
| Material 3 · Spectrum 2 · Fluent 2 | 아니오                                                                                | z-index 토큰 없음(높이는 그림자 · 면 단계로만)                                                                                                                                  |                                                                 | m3-elev.scss · spectrum-color.json · fluent 토큰 |
| GitHub Primer                      | 화면 CSS 에 `--zIndex-modal` · `--zIndex-tooltip` 이 쓰이나 값 정의는 못 찾음(미확인) | 미확인                                                                                                                                                                          |                                                                 | 이번 실측 `github` zHist                         |

- 13곳 가운데 이름 붙은 쌓임 단계를 공개한 곳은 Atlassian · Carbon · MUI · Bootstrap · Chakra · Bezier 6곳이다(Polaris 는 번호만, 당근 화면 CSS 는 세 단계).
    - 맨 위: 툴팁 Atlassian(9999) · MUI(1500, 토스트 1400 위) · Chakra(1800, max 뺌) · Bezier(1300, important 뺌). 토스트 Bootstrap(1090, 툴팁 1080 위). 드롭다운 Carbon(9100).
    - 가림막을 판과 다른 단계로 둔 곳: Atlassian(blanket 500 · modal 510) · Bootstrap(1050 · 1055) · Chakra(overlay 1300 · modal 1400) 3곳. MUI · Bezier · Carbon 은 한 단계.
    - 머리: 메뉴 · 드롭다운보다 위에 둔 곳 Bootstrap(sticky 1020 · fixed 1030 > dropdown 1000) · Chakra(sticky 1100 > dropdown 1000) · Carbon(header 8000 > floating 6000). 아래에 둔 곳 Atlassian(navigation 200 < dialog 300) · MUI(appBar 1100 < modal 1300, 메뉴도 modal 층). 대화상자보다 위에 둔 곳은 없다.

## NosLog `levels.css` 12역할과 같은 쓰임 (값은 비교용)

NosLog 쪽 「쓰는 곳」 은 `--nl-layer-*` 를 부르는 파일이다(2026-11-20 리포 grep). 디자인 시스템 칸은 같은 쓰임의 단계 이름과 값, 없으면 「없음」.

| NosLog 역할 · 값                                             | 쓰는 곳                            | 당근 SEED                          | Atlassian      | Carbon        | MUI                           | Bootstrap                 | Chakra                    | Bezier                |
| ------------------------------------------------------------ | ---------------------------------- | ---------------------------------- | -------------- | ------------- | ----------------------------- | ------------------------- | ------------------------- | --------------------- |
| `above` 1                                                    | 부품 안쪽 쌓기(15곳)               | 붙는 탭 1 · ::before −1            | 없음           | 없음          | 없음                          | z-index 단계 맵 1 · 2 · 3 | base 0                    | floating 1            |
| `sticky` 10                                                  | 서열표 · 관리자 · 표 머리          | 붙는 탭 목록 1                     | 없음           | 없음          | 없음                          | sticky 1020               | sticky 1100               | 없음                  |
| `search-preview` 30                                          | 홈 검색 미리보기                   | menu 99999                         | layer 400      | floating 6000 | modal 1300(Popover)           | dropdown 1000             | dropdown 1000             | overlay 1000          |
| `bottom-bar` 40                                              | 오락실 · 관리자 아래 막대          | 없음                               | 없음           | footer 5000   | mobileStepper 1000 · fab 1050 | fixed 1030                | docked 10                 | 없음                  |
| `header` 50                                                  | 헤더                               | 없음(화면 CSS carotene sticky 200) | navigation 200 | header 8000   | appBar 1100                   | fixed 1030                | sticky 1100 · banner 1200 | 없음                  |
| `progress` 60                                                | 쪽 진행 막대                       | 없음                               | 없음           | 없음          | 없음                          | 없음                      | 없음                      | 없음                  |
| `popover` 70                                                 | 팝오버 · 필터 · 용어 도움말 · 지도 | popover 99999 · help-bubble 99     | layer 400      | floating 6000 | modal 1300                    | popover 1070              | popover 1500              | overlay 1000          |
| `overlay` 80                                                 | 대화상자 가림막                    | dialog 2(판과 같음)                | blanket 500    | overlay 6000  | modal 1300(판과 같음)         | modal-backdrop 1050       | overlay 1300              | 없음(판과 같은 modal) |
| `dialog` 81                                                  | 대화상자                           | dialog 2                           | modal 510      | modal 9000    | modal 1300                    | modal 1055                | modal 1400                | modal 1100            |
| `select` 90                                                  | 셀렉트 목록 · 메뉴                 | select · menu 99999                | layer 400      | dropdown 9100 | modal 1300(Menu = Popover)    | dropdown 1000             | dropdown 1000             | overlay 1000          |
| `fullscreen` 100                                             | 사진 보기 · 채보 전체 화면 · ≡ 창  | side-panel 2                       | spotlight 700  | 없음          | drawer 1200                   | offcanvas 1045            | 없음                      | 없음                  |
| `fullscreen-dialog` 110                                      | 전체 화면 위 대화상자              | dialog 2 + `--layer-index` 더하기  | 없음           | 없음          | 없음                          | 없음                      | 없음                      | 없음                  |
| 토스트(NosLog 층 없음, 토스트 판은 `--nl-overlay-shadow` 만) | 알림 토스트                        | snackbar-region 2147483647         | flag 600       | 없음          | snackbar 1400                 | toast 1090                | toast 1700                | toast 1200            |
| 툴팁(NosLog 층 없음)                                         | —                                  | help-bubble 99                     | tooltip 9999   | 없음          | tooltip 1500                  | tooltip 1080              | tooltip 1800              | tooltip 1300          |

- 셀렉트 · 메뉴를 대화상자보다 위에 둔 곳: NosLog(90 > 81) · 당근(99999 > 2) · Carbon(9100 > 9000). 아래에 둔 곳: Atlassian · Bootstrap · Chakra · Bezier. MUI 는 같은 층(나중에 연 것이 위).
- 진행 막대 · 검색 미리보기처럼 화면 한 곳만 쓰는 단계를 따로 둔 디자인 시스템은 없다.
- 부품 코드를 대조하지 않고 단계 이름으로만 맞춘 칸: Atlassian `layer` · Carbon `floating` · `overlay` · `footer` · Bezier `overlay` · Chakra `docked` · `banner`. 나머지는 원본 파일의 부품 이름 그대로다.

## 실제 서비스 — 셈

- 다크로 열린 곳 36곳(국내 16 · 해외 20)을 셌다. 국내: 당근 · 치지직 · 카카오웹툰 · 나무위키 · 토스증권 · 티빙 · 라프텔 · 다음 · 네이버 로그인(`naver-pay` 주소가 네이버 로그인 쪽으로 열림) · 왓챠 · 레진 · 클래스101 · 웨이브 · DAK.GG · STOVE · 아이온2. 해외: Linear · Vercel · GitHub · Raycast · Spotify · Twitch · Reddit · Steam · osu! · Chess.com · Lichess · MDN · Mastodon · Hugging Face · GitLab · Apple Music · Disney+ · Letterboxd · Epic Games Store · Binance.
- 셈에서 뺀 곳: 밝게 열린 곳 17곳(검은사막 · 클리앙 · 쿠팡플레이 · Discord · GeekNews · 인벤 · 로스트아크 · 메이플스토리 · 네이버 모바일 · OKKY · OP.GG · PUBG · SOOP · Supabase · velog · 바이브 · YouTube), 오류 1곳(빗썸), Cloudflare 확인 쪽에 막힌 2곳(아카라이브 · 리디).
- 떠 있는 판을 실제로 연 곳은 36곳 중 23곳(국내 11 · 해외 12)이다. 나머지 13곳(국내 5: 카카오웹툰 · 나무위키 · 왓챠 · 웨이브 · 아이온2, 해외 8: Raycast · Reddit · osu! · Lichess · GitLab · Disney+ · Letterboxd · Epic)은 첫 화면에 여는 버튼이 없거나 누르면 쪽이 바뀌었다. 판 캡처 58장은 모음 이미지(`color-shadow-layer/sheet-0.jpg`–`sheet-4.jpg`)로 직접 열어 보았고, 판이 아닌 것(Apple Music 넘김 단추)은 뺐다.

## 실제 서비스 — 묶음 1 떠 있는 판 (연 곳 23곳)

「띄우는 방법」 은 면 대비 1.08 넘으면 「밝은 면」, 둘레 선이 있으면 「선」, 흐림이 있는 바깥 그림자가 있으면 「그림자」, 흐림 · 어긋남 없는 1px 그림자는 「링」 이다.

| 곳            | 판                      | 면(뒤 바탕, 대비)                          | 선 · 링                    | 그림자                                            | 모서리 | z            |
| ------------- | ----------------------- | ------------------------------------------ | -------------------------- | ------------------------------------------------- | ------ | ------------ |
| 당근          | 메뉴                    | #1d2025 (#000, 1.29)                       | 링 흰 9%                   | 0 1px 4px 검정 50%                                | 16     | 300          |
| 당근          | 대화상자(필터)          | #1d2025 (#000, 1.29)                       | 없음                       | 없음                                              | 20     | 402          |
| 다음          | 화면 설정 판            | #2c2e33 (#131416, 1.36)                    | 없음                       | 0 4px 32px 검정 16%                               | 28     | 9999         |
| 토스증권      | 검색 판                 | #202025 (#17171c, 1.10)                    | 없음                       | 0 12px 28px −4px 12% · 0 8px 56px −4px 10%        | 16     | 미지정       |
| 토스증권      | 대화상자(로그인)        | #2c2c35 (#17171c, 1.29)                    | 링 rgba(222,222,255,.19)   | 0 10px 40px 15% 외 3겹                            | 16     | 미지정       |
| STOVE         | 카테고리 판             | #292929 (#191919, 1.21)                    | 없음                       | 0 12px 28px 검정 20%                              | 20     | 9999         |
| 네이버 로그인 | 언어 목록               | #2d2d2d (#1f1f1f, 1.20)                    | 선 1px 흰 15%              | 0 0 6px 4% · 0 3px 6px 10%                        | 8      | auto         |
| 치지직        | 툴팁 · 미리보기         | #2e3033 · #1c1d1f (1.22 · 1.08)            | 없음                       | 0 2px 2px 30% · 0 2px 6px 2px 20%                 | 6      | 9999–10000   |
| 티빙          | 프로필 메뉴             | #000 (#000, 1)                             | 선 1px 흰 15%              | 0 10px 20px 검정 50%                              | 16     | 200          |
| 티빙          | 찾기 판                 | #262626 (#191919, 1.16)                    | 없음                       | 없음                                              | 4      | 150          |
| 레진          | 검색 판                 | #111115 (같은 면)                          | 없음                       | 0 6px 20px 검정 20%                               | 12     | 1050         |
| 클래스101     | 카테고리 판             | 반투명 + blur(75px)                        | 선 1px 흰 6% · 위쪽 흰 22% | 0 1px 3px 30% · 0 6px 12px 35% · 0 14px 28px 45%  | 8      | 0            |
| DAK.GG        | 언어 목록               | #27282e (1.08)                             | 선 1px 흰 10%              | 없음                                              | 4      | 100          |
| 라프텔        | 장르 대화상자           | 화면 값 #121212(쪽과 같음, 캡처는 회색 판) | 없음                       | 없음                                              | 4      | 11           |
| GitHub        | 검색 대화상자           | #010409 (#151a21, 1.18 어둡게)             | 링 #3d444d                 | floating-small                                    | 12     | 100          |
| GitHub        | 머리 메뉴 · 툴팁        | 쪽과 같음 · #010409                        | 선 #191f1b · #3d444d       | 없음                                              | 0 · 6  | 99 · 1000    |
| Linear        | 머리 메뉴 · 툴팁        | 쪽과 같음 #08090a                          | 선 흰 8% · #23252a         | 0 8px 32px #08090a · 0 7px 32px 35%               | 14 · 8 | 10000 · 1100 |
| Vercel        | 쪽 메뉴                 | #0a0a0a (#000, 1.06)                       | 링 흰 14.5%                | 0 1px 1px 2% · 0 4px 8px −4px 4% · 0 16px 24px 6% | 12     | 2001         |
| Spotify       | 툴팁                    | #282828 (#121212, 1.27)                    | 없음                       | 0 16px 24px 30% · 0 6px 8px 20%                   | 4      | 9999         |
| Twitch        | 메뉴 · 정렬 목록        | #323239 · #18181b (1.52 · 1.09)            | 없음                       | 0 4px 8px 60% · 0 0 4px 40%                       | 6 · 4  | 5000         |
| Twitch        | 대화상자(로그인)        | #18181b (가림막 위)                        | 없음                       | 없음                                              | 0      | 5000         |
| Steam         | 언어 목록               | #3d4450 (#171d25, 1.73)                    | 없음                       | 0 0 12px 검정                                     | 0      | auto         |
| Binance       | 셀렉트 · 팝오버         | #202630 · #333b47 (1.16 · 1.54)            | 선 #333b47 · 안쪽 흰 20%   | −2px 0 14px 40% · 0 0 6px 20%                     | 12 · 8 | 0 · 1400     |
| Chess.com     | 언어 대화상자           | #262421 (#302e2b, 1.14 어둡게)             | 안쪽 링 흰 10%             | 0 8px 24px 65%                                    | 10     | auto         |
| Apple Music   | 재생 목록 판 · 대화상자 | #232324 · #1d1d1f (1.05 · 1.02)            | 없음                       | 0 10px 40px 20% · 0 10px 10px 20%                 | 0 · 10 | 9900 · 10001 |
| Hugging Face  | 검색 판 · 메뉴          | 쪽과 같음 #0b0f19                          | 선 1px                     | 0 10px 20px 4% 외(검색만)                         | 12     | 40 · 20      |
| Mastodon      | 메뉴                    | #15151e                                    | 선 연보라 20%              | 연보라 20% 0 0 2px · 8% 0 4px 8px                 | 16     | 2147483647   |
| MDN           | 머리 메뉴               | 쪽과 같음                                  | 선 1px #51565d             | 없음                                              | 0      | 100          |

- 꼴로 묶으면(연 곳 23곳, 한 곳이 여러 판이면 메뉴 판 기준):
    - 밝은 면 + 그림자: 당근 · 다음 · 토스증권 · STOVE · 네이버 로그인 · 치지직 · Spotify · Twitch · Steam · Binance · Apple Music 11곳(국내 6). 이 가운데 링 · 선을 더한 곳은 당근(흰 9% 링) · 네이버 로그인(흰 15% 선) · Binance(선 + 안쪽 흰 20%) 3곳.
    - 같은 면(대비 1.08 아래, 또는 더 어둡게) + 선 · 링 + 그림자: Linear · Vercel · 티빙(프로필) · 클래스101 · Hugging Face · Mastodon · Chess.com(어둡게, 대화상자) 7곳(국내 2). GitHub 검색 대화상자도 이 꼴(어둡게 + 링 + 그림자)이다.
    - 같은 면 + 그림자만: 레진 1곳.
    - 선만, 그림자 없음: MDN · DAK.GG · GitHub 머리 메뉴 3곳(근거 약함).
    - 연 판이 대화상자뿐이고 그림자 없음: 라프텔 1곳.
- 대화상자를 연 곳 6곳 가운데 그림자 없는 곳: 당근 · Twitch · 라프텔 3곳, 있는 곳: 토스증권 · Apple Music · Chess.com 3곳(근거 약함).
- 툴팁을 연 곳 5곳(치지직 · Spotify · Linear · GitHub · Binance)은 모두 판 면이 쪽보다 밝거나(치지직 · Spotify · Binance) 선이 있다(Linear · GitHub).

## 실제 서비스 — 가림막 · 머리 · 상자

- 가림막(화면에서 연 값) 6곳: 당근 #000 46% · Apple Music #000 48% · 티빙 #000 50% · 라프텔 #000 70% · Twitch #000 85% · GitHub #212830 40%. 6곳 모두 검정(또는 검정에 가까운 회색) 반투명이고 흐림(backdrop-filter)은 0곳. 스타일시트 변수로만 읽은 곳: 다음 `--bg-dim-overlay-32` · `-48` · 왓챠 `--z-index-modal-dim` 이름만(색 미확인).
- 머리: 맨 위 고정 · 붙음 머리를 찾은 다크 곳 19곳 가운데 처음부터 그림자가 있는 곳은 왓챠(검정 8% 1px) 1곳, 내리면 그림자가 생기는 곳은 다음(흰 8% 0 6px 12px · 면 #1c1e21 로 바뀜) 1곳. 나머지 17곳은 그림자 없음. 머리 z 는 auto(DAK.GG · 네이버 로그인) · 2 · 4 · 10 · 51 · 75 · 99 · 100 · 110 · 200 · 509 · 999 · 1001 · 1100 · 1750 · 10000 · 9999999 로 흩어져 있다.
- 구역 상자 · 카드에 그림자가 있는 곳: 36곳 중 9곳. Apple Music(상자 32개 모두, 5겹 검정 1–3%) · 다음(25개 중 10, 0 0 4px 검정 4%) · 당근(29개 중 2, 0 1px 1px 검정 5%) · 토스증권(5개 중 2, 링 3) · 클래스101 · Spotify · Epic · Letterboxd · osu!(각 1개). Raycast 는 13개 모두 링(흐림 없는 1px)만. 나머지 26곳은 그림자 0. 그림자가 있는 9곳을 알파로 나누면 5% 이하(다크 바탕에서 거의 안 보임) Apple Music · 다음 · 당근 3곳, 10–50% 토스증권(0 2px 16px −4px 18%) · Spotify(0 4px 60px 50%) · osu!(0 1px 3px 25%) · Letterboxd(0 8px 16px 15%) · Epic(0 32px 16px 10%) 5곳(모두 상자 1–2개뿐), 색 그림자 클래스101(주황 14%) 1곳.

## 실제 서비스 — 묶음 2 쌓임 변수 · 계산값

| 곳              | 변수(단계 이름 값, 낮은 것부터)                                                                                                                           | 화면 계산값(머리 · 메뉴 · 대화상자 · 토스트) |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 당근(carotene)  | sticky 200 · modal 300 · notification 400, SEED 부품 변수 dialog · sheet 2 · menu · select 99999 · snackbar 2147483647                                    | 메뉴 300 · 대화상자 402                      |
| STOVE(STDS)     | base 0 · docked 10 · dropdown 500 · tooltip 600 · sticky 1000 · overlay 2000 · modal 2500 · toast 3000                                                    | 머리 1001 · 판 9999                          |
| 왓챠            | page-loading 10 · sticky-header 20 · header-bar 50 · nav 51 · modal-back-screen · modal-dim 100 · global-loading 102 · toast-container 103 · dropdown 400 | 머리 51                                      |
| Binance         | mask 10 · menu 1000 · header 1001 · dropdown 1200 · modal 1200 · backTop 1225 · calendar 1250 · mobilePop 1275 · notification 1300 · alert 1350           | 머리 999 · 팝오버 1400                       |
| Apple Music     | default 1 · bubbles 50 · gpu 1001 · web-chrome 9901 · contextual-menus 9951 · modal 10001                                                                 | 판 9900 · 대화상자 10001                     |
| Spotify(encore) | top-bar 1 · 사이드 4 · dialog 1050 · popover 1060 · skiplink 9999                                                                                         | 툴팁 9999                                    |
| Disney+         | offcanvas 1045 · backdrop 1050 · modal 1055 · popover 1070 · tooltip 1080 · toast 1090 · dropdown 1000(Bootstrap 값 그대로)                               | 연 판 없음                                   |
| GitHub          | base-zIndex 0–600(100 간격) · zIndex-behind −1 · `--zIndex-modal` · `-tooltip`(값 미확인)                                                                 | 머리 99 · 검색 대화상자 100 · 툴팁 1000      |
| GitLab          | gl-zindex 0 · 1 · 2 · 3 · 4 · 200 · 9999, 토스트 1100                                                                                                     | 머리 4                                       |
| Letterboxd      | backdrop 4950 · modal · dialog 5000                                                                                                                       | 머리 1100                                    |
| MDN             | sidebar-mobile 90 · sticky-header 100                                                                                                                     | 머리 메뉴 100                                |

- 화면 CSS 에 이름 붙은 쌓임 변수가 있는 곳 11곳(국내 3: 당근 · STOVE · 왓챠).
- 토스트 z(규칙): 당근 2147483647 · 다음 10000 · 웨이브 3000 · STOVE 3000 · 카카오웹툰 300 · Twitch 5010 · 레진 1101 · GitLab 1100 · Linear 999999999 · 왓챠 103 · 아이온2 20. 11곳 가운데 머리보다 토스트가 낮은 곳은 없었다(머리 값을 같이 읽은 곳 기준).

## 판 재료 — 후보 꼴

추천하지 않는다. 곳 수와 근거 정도만 적는다.

### 묶음 1 떠 있는 판

- 꼴 A 「밝은 면 + 그림자, 선 없음」: 실제 11곳 중 8곳(다음 · 토스증권 메뉴 · STOVE · 치지직 · Spotify · Twitch · Steam · Apple Music, 국내 4) · 디자인 시스템 당근 SEED(메뉴) · Material 3 · MUI · Carbon(면 + 그림자 색). 면 대비 1.10–1.73, 그림자 0 4–16px 20–60px 검정 16–100%.
- 꼴 B 「밝은 면 + 그림자 + 흰 반투명 1px 링 · 선」: 당근 화면(흰 9% 링) · 네이버 로그인(흰 15% 선) · Binance · 토스증권 대화상자(rgba(222,222,255,.19)) 4곳(국내 3) · 디자인 시스템 Atlassian(#BDBDBD 12% 링) · Bezier(안쪽 흰 12%) · Chakra(안쪽 회색 30%) · Polaris(카드 bevel). 근거 약함(실제 4곳).
- 꼴 C 「쪽과 같은 면 + 선(또는 링) + 그림자」: Linear · Vercel · 티빙 · 클래스101 · Hugging Face · Mastodon · Chess.com 7곳(국내 2, GitHub 검색 대화상자도 같은 꼴) · 디자인 시스템 Primer · Geist.
- 꼴 D 「대화상자는 그림자 없이 밝은 면 + 가림막」: 당근 · Twitch · 라프텔 3곳(근거 약함) · 디자인 시스템 당근 SEED · Montage. 반대로 대화상자에도 그림자: 토스증권 · Apple Music · Chess.com 3곳 · Primer · Atlassian · Fluent · MUI · M3.

### 묶음 1 가림막

- 검정 반투명 하나: 실제 6곳 모두(40–85%, 가운데 값 48–50%) · 디자인 시스템 12곳(SEED 45 · M3 32 · Carbon 60 · MUI 50 · Spectrum 60 · Fluent 50 · Atlassian 60(#101214) · Primer 40(#212830) · Bezier 40 · Montage 74(#171719) · TDS 56 · Polaris 50). 흐림을 더한 곳은 실제 · 디자인 시스템 모두 0곳.

### 묶음 1 카드 · 구역 상자

- 그림자 없음: 실제 36곳 중 27곳. 디자인 시스템 Carbon(층 면) · Fluent · Montage(라이트와 같은 값이라 다크에서 안 보임).
- 아주 옅은 그림자(알파 5% 이하): 당근 · 다음 · Apple Music 3곳(국내 2, 근거 약함). 디자인 시스템 당근 화면 기준선(0 1px 1px 5%).
- 보이는 그림자(10% 넘음): 토스증권 · Spotify · osu! · Letterboxd · Epic 5곳(곳마다 상자 1–2개) · 디자인 시스템 Primer resting · Atlassian raised · Chakra xs(검정 64%).

### 묶음 2 쌓임

- 꼴 1 「이름 붙은 쌓임 토큰 한 벌」: 디자인 시스템 6곳(Atlassian · Carbon · MUI · Bootstrap · Chakra · Bezier) · 실제 화면 변수 11곳(STOVE · 왓챠 · 당근 carotene · Binance · Apple Music · Spotify · Disney+ · GitHub · GitLab · Letterboxd · MDN).
- 꼴 2 「토큰 없이 부품마다 값」: 당근 SEED · Material 3 · Spectrum · Fluent · Ant Design(바탕값만). 실제 화면은 변수가 없는 25곳이 이 꼴이다(값은 2–9999999 로 흩어짐).
- 순서에서 갈리는 자리 둘: 셀렉트 · 메뉴를 대화상자 위에 둘지(위: 당근 SEED · Carbon · NosLog 지금 / 아래: Atlassian · Bootstrap · Chakra · Bezier · STOVE(dropdown 500 < modal 2500) / 같음: Binance(dropdown = modal 1200)), 머리를 드롭다운 위에 둘지(위: Bootstrap · Chakra · Carbon · STOVE(sticky 1000 > dropdown 500) / 아래: Atlassian · MUI · Binance(header 1001 < dropdown 1200) · 왓챠(header 50 < dropdown 400)).

## 미확인 · 한계

- 토스트를 화면에 띄운 곳은 0곳이다(토스트는 동작을 해야 뜬다). 토스트 그림자 · 면은 디자인 시스템 값과 스타일시트 규칙만 있다.
- 바닥 시트(폰)는 재지 않았다(1440 폭만 열었다). 디자인 시스템 값은 당근 SEED(bottom-sheet · menu-sheet 그림자 없음, 면 #1d2025)만 있다.
- 첫 화면에서 판을 못 연 다크 곳 14곳(국내 7: 카카오웹툰 · 나무위키 · 왓챠 · 웨이브 · 아이온2 등)은 판 값이 미확인이다. 맞춤 선택자로 한 번 더 눌렀지만 치지직 · 네이버 로그인 · DAK.GG 만 열렸다.
- 면 대비는 판의 바탕색 한 겹으로 쟀다. 반투명 + 흐림(클래스101)은 대비를 내지 못했다. 라프텔 대화상자는 계산값이 쪽과 같은 #121212 로 나왔으나 캡처는 회색 판이라 안쪽 요소 면을 못 잡은 것이다(미확인).
- GitHub `--zIndex-modal` · `--zIndex-tooltip` 값, Fluent 툴팁 · 팝오버 그림자 값, Spectrum 부품별 그림자, M3 · Spectrum 토스트는 미확인이다.

## 곳마다 실측

곳마다 머리 · 연 판 · 가림막 · 상자 셈 · 스타일시트 변수다(자동 기록, 판이 아닌 것은 눈 확인 뒤 뺐다). 캡처는 `color-shadow-layer/shots/`.

### 아이온2(엔씨) (`aion2`)

- 주소 https://aion2.plaync.com/ko-kr/board/notice/list · 바탕 #171717 · 캡처 `shots/aion2-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 쌓임 규칙(앞 6개): `body.ncc-dimmed #nc-cnb .ncc-dimmed.is-active-title-submenu { z-index: 9100023 }` · `#nc-cnb .ncc-header { z-index: 9100024 }` · `#nc-cnb .ncc-gnb-wrap__right { z-index: 9100030 }` · `#nc-cnb div.gnbNtWrapFrnd { z-index: 997 }` · `#dimmed .modal { z-index: 10000 }` · `#nc-cnb .ncc-dropdown { z-index: 999 }`

### Apple Music (`apple-music`)

- 주소 https://music.apple.com/kr/browse · 바탕 #1f1f1f · 캡처 `shots/apple-music-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「재생 대기 목록」: `div#uid-1.side-panel.svelte-11oiv1i[role=complementary]` 면 #232324 (뒤 #1f1f1f 대비 1.05) · 선 none · 모서리 0px · 그림자 rgba(0, 0, 0, 0.2) 0px 10px 40px 0px · z(바깥) 9900 · backdrop saturate(2.2) blur(16px) · 띄우는 방법 그림자 · 캡처 `apple-music-m1.png`
- 연 판 dialog 「로그인」: `div.ck-placeholder-modal__modal` 면 #1d1d1f (뒤 #1f1f1f 대비 1.02) · 선 none · 모서리 10px · 그림자 rgba(0, 0, 0, 0.2) 0px 10px 10px 0px · z(바깥) 10001 · backdrop none · 띄우는 방법 그림자 · 캡처 `apple-music-d12.png`
- 가림막(dialog 「로그인」): #000000/48 · z 10001 · backdrop none
- 상자 셈: 그림자 32 · 링만 0 · 없음 0 · 많이 쓴 그림자 rgba(0, 0, 0, 0.01) 0px 1px 1px 0px, rgba(0, 0, 0, 0.01) 0px 2px 2px 0px, rgba(0, 0, 0, 0.02) 0px 4px 4px 0px, rgba(0, 0, 0, 0.03) 0px 8px 8px 0px, rgba(0, 0, 0(32)
- 쌓임 변수(규칙): `--z-unset` unset · `--z-default` 1 · `--z-bubbles` 50 · `--z-gpu` 1001 · `--z-web-chrome` 9901 · `--z-contextual-menus` 9951 · `--z-modal` 10001 · `--ctxmenu-z-index` var(--z-contextual-menus) · `--ctxmenu-scrim-z-index` calc(var(--z-contextual-menus) - 1) · `--ctxmenu-z-index-override` calc(var(--z-modal) + 5) · `--ctxmenu-scrim-z-index-override` calc(var(--z-modal) + 4)
- 그림자 변수(규칙, 앞 6개): `--dialogShadowColor` #00000040 · `--dropdownActiveOutlineColorShadow` #06c9 · `--radiosityShadowColor` #0000001a · `--segmentedControlSelectedShadow1` #0000001f · `--segmentedControlSelectedShadow2` #0000000a · `--glassMaterialShadowColor` #0000001a
- 가림막 변수(규칙, 앞 4개): `--lockupChinScrim` #0003 · `--modalScrimColor` #00000073 · `--trackLockupArtworkOverlay` #3333334d · `--nowPlayingBackdropBG` #878787
- 쌓임 규칙(앞 6개): `.menuicon.svelte-1w0n6ba.svelte-1w0n6ba { z-index: var(--z-default) }` · `.menuicon-bread.svelte-1w0n6ba.svelte-1w0n6ba { z-index: var(--z-default) }` · `.menuicon-bread-crust.svelte-1w0n6ba.svelte-1w0n6ba { z-index: var(--z-default) }` · `.header.svelte-1wse9zo { z-index: var(--z-web-chrome) }` · `.header.svelte-1wse9zo { z-index: calc(var(--z-web-chrome) }` · `.side-panel.svelte-11oiv1i .side-panel-header-wrapper.svelte-11oiv1i { z-index: calc(var(--z-default) }`

### Binance (`binance`)

- 주소 https://www.binance.com/ko/markets/overview · 바탕 #181a20 · 캡처 `shots/binance-page.jpg`
- 머리: `div#__APP_HEADER` sticky · z 999 · 면 투명 · 그림자 없음 · 아래 선 0px #eaecef · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판 menu 「Select an option 24h」: `div.bn-bubble-content` 면 #202630 (뒤 #29313d 대비 1.16) · 선 1px #333b47 · 모서리 12px · 그림자 rgba(0, 0, 0, 0.4) -2px 0px 14px 0px, rgba(0, 0, 0, 0.2) 0px 0px 6px 0px, rgba(255, 255, 255, 0.2) 0px 0px 2px 0px inset · z(바깥) 0 · backdrop none · 띄우는 방법 밝은 면 · 선 · 그림자 · 캡처 `binance-m1.png`
- 연 판 tip 「」: `div.bn-bubble-content` 면 #333b47 (뒤 #181a20 대비 1.54) · 선 none · 모서리 8px · 그림자 없음 · z(바깥) 999 · backdrop none · 띄우는 방법 밝은 면 · 캡처 `binance-t2.png`
- 연 판 tip 「」: `div.bn-bubble-content` 면 #333b47 (뒤 #181a20 대비 1.54) · 선 none · 모서리 8px · 그림자 rgba(0, 0, 0, 0.4) -2px 0px 14px 0px, rgba(0, 0, 0, 0.2) 0px 0px 6px 0px, rgba(255, 255, 255, 0.2) 0px 0px 2px 0px inset · z(바깥) 1400 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `binance-t3.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 4
- 쌓임 변수(규칙): `--zindex-mask` 10 · `--zindex-menu` 1000 · `--zindex-header` 1001 · `--zindex-dropdown` 1200 · `--zindex-modal` 1200 · `--zindex-backTop` 1225 · `--zindex-calendar` 1250 · `--zindex-mobilePop` 1275 · `--zindex-notification` 1300 · `--zindex-alert` 1350 · `--zindex-tooltip` 1400 · `--zindex-coachmark` 1400 · `--zindex-drawer` 9999
- 그림자 변수(규칙, 앞 6개): `--header-dropdown-shadow` inset 0px 0px 0px 1px rgba(0, 0, 0, 0.08), 0px 8px 4px 0px rgba(24, 26, 32, 0.08) · `--tw-ring-offset-shadow` 0 0 transparent · `--tw-ring-shadow` 0 0 transparent · `--tw-shadow` 0 0 transparent · `--tw-shadow-colored` 0 0 transparent · `--tw-drop-shadow`
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` · `--tw-backdrop-brightness` · `--tw-backdrop-contrast` · `--tw-backdrop-grayscale`
- 쌓임 규칙(앞 6개): `._CWC .deposit-drawer-video-modal { z-index: 10000 }` · `._CWC.bn-tooltips-trans.combine-trade-dropdown-wrap { z-index: calc(var(--zindex-drawer) }` · `._CWC .bn-mask.bn-modal.tc-modal { z-index: calc(var(--zindex-drawer) }` · `._CWC [data-token-conversion-modal] .bn-layer-notifies { z-index: calc(var(--zindex-drawer) }` · `._CWC .header-more-layer { z-index: 1300 }` · `._CWC .header-menu-subgrid,._CWC .header-menu-sublist,._CWC .header-menu-subgridsmall { z-index: 1300; box-sha`

### Chess.com (`chesscom`)

- 주소 https://www.chess.com/leaderboard/live · 바탕 #302e2b · 캡처 `shots/chesscom-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「Change Language English」: `div.cc-modal-dialog` 면 #262421 (뒤 #302e2b 대비 1.14) · 선 none · 모서리 10px · 그림자 rgba(0, 0, 0, 0.65) 0px 8px 24px 0px, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset · z(바깥) auto · backdrop none · 띄우는 방법 밝은 면 · 그림자+링 · 캡처 `chesscom-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 2
- 그림자 변수(규칙, 앞 6개): `--linkBoxShadow` 0 .5rem 0 0 #c7c6c5, 0 0 0 .1rem rgba(49, 46, 43, .06) · `--cc-bg-box-shadow` inset 0 .1rem 0 0 color-mix(in srgb, var(--color-green-200), transparent 60%), inset 0 -.1 · `--cc-bg-box-shadow-hover` inset 0 .1rem 0 0 color-mix(in srgb, var(--color-green-100), transparent 60%), inset 0 .2r · `--buttonTextShadow` var(--color-transparent-black-20) · `--textShadow` var(--elevation-foreground) · `--box-shadow-1` var(--color-gold-50)
- 가림막 변수(규칙, 앞 4개): `--color-bg-overlay` var(--color-transparent-black-77) · `--color-bg-overlay-board` color-mix(in srgb, var(--color-gray-200) 65%, tran · `--color-bg-overlay-subtle` var(--color-transparent-black-50) · `--globalOverlayBackground` var(--color-gray-100)
- 쌓임 규칙(앞 6개): `.cc-tooltip-component { z-index: 9999 }` · `.cc-modal-close-component { z-index: 10 }` · `.cc-tooltip-component { z-index: 9999 }` · `.cc-tooltip-component { z-index: 9999 }` · `.cc-tooltip-component { z-index: 9999 }` · `:where(#sidebar-main-menu).sidebar-container { z-index: 9000 }`

### 치지직 (`chzzk`)

- 주소 https://chzzk.naver.com/ · 바탕 #141517 · 캡처 `shots/chzzk-page.jpg`
- 머리: `header#header._container_1cyju_1` sticky · z 10000 · 면 #141517 · 그림자 없음 · 아래 선 0px #ffffff · backdrop none · 내린 뒤 그림자 없음 · 면 #141517
- 연 판 tip 「메뉴 확장」: `span._label_vgt54_588._label_bottom_vgt54_609` 면 #2e3033 (뒤 #202123 대비 1.22) · 선 none · 모서리 6px · 그림자 rgba(0, 0, 0, 0.3) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 2px 6px 2px · z(바깥) 10000 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `chzzk-t6.png`
- 연 판 tip 「a[href^='/live/']」: `div._tooltip_inner_3vlej_326` 면 #1c1d1f (뒤 #141517 대비 1.08) · 선 none · 모서리 6px · 그림자 rgba(0, 0, 0, 0.3) 0px 2px 2px 0px, rgba(0, 0, 0, 0.2) 0px 2px 6px 2px · z(바깥) 9999 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `chzzk-t7.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 20
- 쌓임 변수(규칙): `--yarl__portal_zindex` 20000
- 그림자 변수(규칙, 앞 6개): `--sem-color-shadow-base` #0003 · `--sem-color-shadow-strong` #0000004d · `--sem-elevation-blur-1` 1px · `--sem-elevation-blur-2` 2px · `--sem-elevation-blur-3` 3px · `--sem-elevation-blur-4` 4px
- 가림막 변수(규칙, 앞 4개): `--pzp--use-layer-backdrop-filter` 1){@supports ((-webkit-backdrop-filter:var(--pzp-l · `--dim-opacity-start` 0 · `--dim-opacity-end` .4 · `--sem-color-surface-function-banner-dimmer-only-light` #1415178c
- 쌓임 규칙(앞 6개): `.pzp-pc-header .pzp-pc-channel-profile:hover { z-index: 100 }` · `.pzp-pc .pzp-pc__toast { z-index: 100 }` · `.pzp-pc .pzp-pc__ai-content-tooltip { z-index: 10 }` · `.pzp-pc:not(.pzp-pc--dialog):not(.pzp-pc--upnext) .pzp-pc__volume-feedback { z-index: var(--pzp-layout-feedbac` · `.pzp-pc:not(.pzp-pc--dialog):not(.pzp-pc--upnext) .pzp-pc__playback-rate-feedback { z-index: var(--pzp-layout-` · `.pzp-pc .pzp-pc__info-tooltip { z-index: 10 }`

### 클래스101 (`class101`)

- 주소 https://class101.net/ko · 바탕 #141414 · 캡처 `shots/class101-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「카테고리」: `div.vbr-1gu9ny3` 면 투명 (뒤 #141414 대비 None) · 선 1px #fafafa/6 · 모서리 8px · 그림자 rgba(255, 255, 255, 0.22) 0px -1px 2px -1px, rgba(255, 255, 255, 0.03) 0px 0px 0px 1px, rgba(0, 0, 0, 0.3) 0px 1px 3px 0px, rgba(0, 0, 0, 0.35) 0px 6px 12px -2px, rgba(0, 0, 0, 0.45) 0px 14px 28px -6px · z(바깥) 0 · backdrop blur(75px) · 띄우는 방법 선 · 그림자+링 · 캡처 `class101-m1.png`
- 상자 셈: 그림자 1 · 링만 0 · 없음 1 · 많이 쓴 그림자 rgba(255, 93, 0, 0.14) 4px 8px 9px 0px(1)
- 그림자 변수(규칙, 앞 6개): `--tw-shadow` 0 0 #0000 · `--tw-shadow-color` initial · `--tw-shadow-alpha` 100% · `--tw-inset-shadow` 0 0 #0000 · `--tw-inset-shadow-color` initial · `--tw-inset-shadow-alpha` 100%
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` initial · `--tw-backdrop-brightness` initial · `--tw-backdrop-contrast` initial · `--tw-backdrop-grayscale` initial

### 당근 (`daangn`)

- 주소 https://www.daangn.com/kr/buy-sell/ · 바탕 #000000 · 캡처 `shots/daangn-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「전체 서비스 메뉴 더보기」: `div#radix-:R18m5f5H1:._1lmz0pk0.mqgr7k2[role=menu]` 면 #1d2025 (뒤 #000000 대비 1.29) · 선 none · 모서리 16px · 그림자 rgba(255, 255, 255, 0.09) 0px 0px 0px 1px, rgba(0, 0, 0, 0.5) 0px 1px 4px 0px · z(바깥) 300 · backdrop none · 띄우는 방법 밝은 면 · 그림자+링 · 캡처 `daangn-m1.png`
- 연 판 menu 「필터 필터」: `div.seed-content-dialog__content.seed-content-dialog__conten` 면 #1d2025 (뒤 #000000 대비 1.29) · 선 none · 모서리 20px · 그림자 없음 · z(바깥) 402 · backdrop none · 띄우는 방법 밝은 면 · 캡처 `daangn-m2.png`
- 가림막(menu 「필터 필터」): #000000/46 · z 402 · backdrop none
- 가림막(menu 「지역 선택: 서울특별시 중구 신당동 」): #000000/46 · z 402 · backdrop none
- 상자 셈: 그림자 2 · 링만 0 · 없음 27 · 많이 쓴 그림자 rgba(0, 0, 0, 0.05) 0px 1px 1px 0px(2)
- 쌓임 변수(규칙): `--carotene-z-index-sticky` 200 · `--carotene-z-index-modal` 300 · `--carotene-z-index-notification` 400 · `--seed-box-z-index` initial · `--sheet-z-index` 2 · `--z-index-dim` calc(var(--z-index-base) + 0) · `--z-index-layer` calc(var(--z-index-base) + 2) · `--z-index-edge` calc(var(--z-index-base) + 4) · `--z-index-app-bar` calc(var(--z-index-base) + 7) · `--dialog-z-index` 2 · `--popover-z-index` 99 · `--menu-z-index` 99999 · `--select-z-index` 99999 · `--side-panel-z-index` 2
- 그림자 변수(규칙, 앞 6개): `--seed-box-box-shadow` initial · `--seed-shadow-s1` 0px 1px 4px 0px #00000014 · `--seed-shadow-s2` 0px 2px 10px 0px #0000001a · `--seed-shadow-s3` 0px 4px 16px 0px #0000001f · `--carotene-shadow-default` 0px 2px 12px 0px rgba(0, 0, 0, .1)
- 가림막 변수(규칙, 앞 4개): `--carotene-color-bg-overlay-muted` var(--carotene-color-palette-static-black-alpha-20 · `--carotene-color-bg-overlay` var(--carotene-color-palette-static-black-alpha-50 · `--seed-color-bg-overlay` var(--seed-color-palette-static-black-alpha-700) · `--seed-color-bg-overlay-muted` var(--seed-color-palette-static-black-alpha-500)
- 쌓임 규칙(앞 6개): `.sprinkles_zIndex_modal__1byufe81k { z-index: var(--carotene-z-index-modal) }` · `.seed-content-dialog__positioner { z-index: calc(var(--dialog-z-index) }` · `.seed-content-dialog__backdrop { z-index: calc(var(--dialog-z-index) }` · `.seed-content-dialog__content { z-index: calc(var(--dialog-z-index) }` · `.seed-dialog__positioner { z-index: calc(var(--dialog-z-index) }` · `.seed-dialog__backdrop { z-index: calc(var(--dialog-z-index) }`

### DAK.GG (`dakgg`)

- 주소 https://dak.gg/ · 바탕 #161618 · 캡처 `shots/dakgg-page.jpg`
- 머리: `header.GNB__Root-sc-40e01ac7-0.Debhx` static · z auto · 면 투명 · 그림자 없음 · 아래 선 0px #e5e7eb · backdrop none · 내린 뒤 머리 안 보임
- 연 판 menu 「header button」: `ul.dropdown-list.isOpen` 면 #27282e (뒤 #212227 대비 1.08) · 선 1px #ffffff/10 · 모서리 4px · 그림자 없음 · z(바깥) 100 · backdrop none · 띄우는 방법 밝은 면 · 선 · 캡처 `dakgg-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 1
- 그림자 변수(규칙, 앞 6개): `--card-shadow` 0px 10px 20px -5px black · `--tw-ring-offset-shadow` 0 0 #0000 · `--tw-ring-shadow` 0 0 #0000 · `--tw-shadow` 0 0 #0000 · `--tw-shadow-colored` 0 0 #0000 · `--tw-drop-shadow`
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` · `--tw-backdrop-brightness` · `--tw-backdrop-contrast` · `--tw-backdrop-grayscale`
- 쌓임 규칙(앞 6개): `.m-tooltip { z-index: 300 }` · `.b-dropdown-service-list { z-index: 1010 }` · `.rn-header .rn-nav-wrapper .rn-nav .rn-service-selector .rn-service-list { z-index: 10 }` · `.rn-header .rn-nav-wrapper .rn-nav .rn-locale-selector .rn-locale-list { z-index: 10 }` · `.rc-tooltip { z-index: 1070 }`

### 다음 (`daum`)

- 주소 https://news.daum.net/ · 바탕 #131416 · 캡처 `shots/daum-page.jpg`
- 머리: `header.doc-header.section_header` relative · z 110 · 면 투명 · 그림자 없음 · 아래 선 0px #ffffff · backdrop none · 내린 뒤 그림자 rgba(255, 255, 255, 0.08) 0px 6px 12px 0px · 면 #1c1e21
- 연 판 menu 「홈 화면 설정」: `div.layer_viewsetting` 면 #2c2e33 (뒤 #131416 대비 1.36) · 선 none · 모서리 28px · 그림자 rgba(0, 0, 0, 0.16) 0px 4px 32px 0px · z(바깥) 9999 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `daum-m1.png`
- 상자 셈: 그림자 10 · 링만 0 · 없음 15 · 많이 쓴 그림자 rgba(0, 0, 0, 0.04) 0px 0px 4px 0px(10)
- 가림막 변수(규칙, 앞 4개): `--bg-dim-overlay-48` rgba(0,0,0,.48) · `--bg-dim-overlay-32` rgba(0,0,0,.32)
- 쌓임 규칙(앞 6개): `#modoo .wrap_help .layer_tooltip { z-index: 10; box-shadow: 0px 4px 32px rgba(0,0,0,0.16) }` · `/* header */
#modoo .doc-header { z-index: 110 }` · `/* header(섹션) - 플로팅 */
#modoo.fixed_gnb .head_section .inner_gnb { z-index: 999; box-shadow: 0px 6px 12px rgba` · `/* header(공통) - box_feature 다음에 위치할 경우 */
#modoo .box_feature + .head_section { z-index: 110 }` · `/* Toast */
#modoo .toast_modoo { z-index: 10000 }`

### Disney+ (`disneyplus`)

- 주소 https://www.disneyplus.com/ko-kr · 바탕 #040714 · 캡처 `shots/disneyplus-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 20
- 쌓임 변수(규칙): `--disney-dropdown-zindex` 1000 · `--disney-toast-zindex` 1090 · `--disney-modal-zindex` 1055 · `--disney-backdrop-zindex` 1050 · `--disney-tooltip-zindex` 1080 · `--disney-popover-zindex` 1070 · `--disney-offcanvas-zindex` 1045
- 그림자 변수(규칙, 앞 6개): `--tw-ring-offset-shadow` 0 0 #0000 · `--tw-ring-shadow` 0 0 #0000 · `--tw-shadow` 0 0 #0000 · `--tw-shadow-colored` 0 0 #0000 · `--tw-drop-shadow` · `--tw-shadow-color` #e9ebf0
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` · `--tw-backdrop-brightness` · `--tw-backdrop-contrast` · `--tw-backdrop-grayscale`
- 쌓임 규칙(앞 6개): `.z-header { z-index: 45 }` · `.z-modal,.z-toast { z-index: 50 }` · `.valid-tooltip { z-index: 5 }` · `.invalid-tooltip { z-index: 5 }` · `.dropdown-menu { z-index: var(--disney-dropdown-zindex); box-shadow: 0 0.5rem 1rem #00000026 }` · `.toast-container { z-index: var(--disney-toast-zindex) }`

### Epic Games Store (`epic`)

- 주소 https://store.epicgames.com/ko/browse · 바탕 #101014 · 캡처 `shots/epic-page.jpg` · 막힘? 잠시만 기다리십시오… 한 단계가 더 남았습니다 계속하려면 보안 검사를 완료해주세요 세션 ID: a5d4ed9b4e970847 IP 주소: 203.229.98.236
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 1 · 링만 0 · 없음 0 · 많이 쓴 그림자 rgba(0, 0, 0, 0.1) 0px 32px 16px 0px(1)

### GitHub (`github`)

- 주소 https://github.com/facebook/react/issues · 바탕 #0d1117 · 캡처 `shots/github-page.jpg`
- 머리: `header.root__q6pgdo.HeaderMktg[role=banner]` relative · z 99 · 면 #000000 · 그림자 없음 · 아래 선 0px #ffffff · backdrop none · 내린 뒤 머리 안 보임
- 연 판 menu 「Products」: `div#_R_nd_.Dropdown__mIjZVL` 면 #000000 (뒤 #000000 대비 1) · 선 1px #191f1b · 모서리 0px · 그림자 없음 · z(바깥) 99 · backdrop none · 띄우는 방법 선 · 캡처 `github-m1.png`
- 연 판 menu 「Search or jump to, type 」: `div.Panel__NcXYLC.alignEnd__cMV0Ck[role=dialog]` 면 #010409 (뒤 #151a21 대비 1.18) · 선 none · 모서리 12px · 그림자 rgb(61, 68, 77) 0px 0px 0px 1px, rgba(1, 4, 9, 0.4) 0px 6px 12px -3px, rgba(1, 4, 9, 0.4) 0px 6px 18px 0px · z(바깥) 100 · backdrop none · 띄우는 방법 밝은 면 · 그림자+링 · 캡처 `github-m5.png`
- 가림막(menu 「Search or jump to, t」): #212830/40 · z 100 · backdrop none
- 연 판 tip 「1 linked pull request re」: `div.Popover-message.Popover-message--large` 면 #010409 (뒤 #0d1117 대비 1.09) · 선 1px #3d444d · 모서리 6px · 그림자 없음 · z(바깥) 1000 · backdrop none · 띄우는 방법 밝은 면 · 선 · 캡처 `github-t7.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 1
- 쌓임 변수(규칙): `--artifacts-panel-z-index` 4 · `--artifacts-overlay-z-index` 5 · `--base-zIndex-0` 0 · `--base-zIndex-100` 100 · `--base-zIndex-200` 200 · `--base-zIndex-300` 300 · `--base-zIndex-400` 400 · `--base-zIndex-500` 500 · `--base-zIndex-600` 600 · `--zIndex-behind` -1 · `--zIndex-default` 0 · `--zIndex-dropdown` 200 · `--zIndex-modal` 400 · `--zIndex-overlay` 300
- 그림자 변수(규칙, 앞 6개): `--button-danger-shadow-selected` inset 0 1px 0 0 #43001133 · `--button-outline-shadow-selected` inset 0 1px 0 0 #021a4a33 · `--button-primary-shadow-selected` inset 0 1px 0 0 #00230b4d · `--shadow-resting-medium` 0 1px 1px 0 #25292e1a, 0 3px 6px 0 #25292e1f · `--avatar-shadow` 0 0 0 2px #fffc · `--button-default-shadow-resting` 0 1px 0 0 #0104090a
- 가림막 변수(규칙, 앞 4개): `--overlay-backdrop-bgColor` #393f4666 · `--overlay-bgColor` #fff · `--overlay-borderColor` var(--borderColor-default) · `--brand-color-canvas-overlay` var(--base-color-scale-white-0)
- 쌓임 규칙(앞 6개): `.root__q6pgdo.root__q6pgdo[data-marketing-header] { z-index: 99 }` · `.menu__2EHTkB { z-index: 100 }` · `.Primer_Brand__ActionMenu-module__ActionMenu__menu___BEldF { z-index: 100; box-shadow: 0 100px 80px #00000003,` · `.Primer_Brand__FeatureComparisonTable-module__FeatureComparisonTable--stickyHeaders___Vg9gu .Primer_Brand__Fea` · `.Primer_Brand__SubNav-module__SubNav__overflow-menu___A8m3D { z-index: 10; box-shadow: none }` · `.Primer_Brand__SubNav-module__SubNav__anchor-menu-outer-container___Mt06f { z-index: 91 }`

### GitLab (`gitlab`)

- 주소 https://docs.gitlab.com/user/project/issues/ · 바탕 #18171d · 캡처 `shots/gitlab-page.jpg`
- 머리: `div.header-wrapper.gl-w-full` fixed · z 4 · 면 #18171d · 그림자 없음 · 아래 선 0px #ecebea · backdrop none · 내린 뒤 그림자 없음 · 면 #18171d
- 연 판: 없음(누른 것 12개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 쌓임 변수(규칙): `--gl-zindex-0` 0 · `--gl-zindex-1` 1 · `--gl-zindex-2` 2 · `--gl-zindex-3` 3 · `--gl-zindex-4` 4 · `--gl-zindex-200` 200 · `--gl-zindex-9999` 9999
- 그림자 변수(규칙, 앞 6개): `--tw-ring-offset-shadow` 0 0 #0000 · `--tw-ring-shadow` 0 0 #0000 · `--tw-shadow` 0 0 #0000 · `--tw-shadow-colored` 0 0 #0000 · `--tw-drop-shadow` · `--get-support-card-hover-shadow` rgba(36, 34, 66, .25)
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` · `--tw-backdrop-brightness` · `--tw-backdrop-contrast` · `--tw-backdrop-grayscale`
- 쌓임 규칙(앞 6개): `.gl-breadcrumb-overflow-menu { z-index: 10; box-shadow: 0 2px 4px #0000001a }` · `.valid-tooltip { z-index: 5 }` · `.invalid-tooltip { z-index: 5 }` · `.dropdown-menu { z-index: 1000 }` · `.modal { z-index: 1050 }` · `.modal-backdrop { z-index: 1040 }`

### Hugging Face (`huggingface`)

- 주소 https://huggingface.co/models · 바탕 #0b0f19 · 캡처 `shots/huggingface-page.jpg`
- 머리: `header.border-b.border-gray-100` static · z auto · 면 투명 · 그림자 없음 · 아래 선 1px #141c2e · backdrop none · 내린 뒤 머리 안 보임
- 연 판 menu 「Search models, datasets,」: `dialog.shadow-alternate.z-40` 면 #0b0f19 (뒤 #0b0f19 대비 1) · 선 1px oklab(0.278 -0.00750866 -0.0321344 / 0.6) · 모서리 12px · 그림자 rgba(0, 0, 0, 0.04) 0px 10px 20px 0px, rgba(0, 0, 0, 0.04) 0px 2px 6px 0px, rgba(0, 0, 0, 0.04) 0px 0px 1px 0px · z(바깥) 40 · backdrop none · 띄우는 방법 선 · 그림자 · 캡처 `huggingface-m1.png`
- 연 판 menu 「」: `div.absolute.top-full` 면 #0b0f19 (뒤 #0b0f19 대비 1) · 선 1px #141c2e · 모서리 12px · 그림자 rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px · z(바깥) 20 · backdrop none · 띄우는 방법 선 · 그림자 · 캡처 `huggingface-m2.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--tw-shadow` 0 0 #0000 · `--tw-shadow-color` initial · `--tw-shadow-alpha` 100% · `--tw-inset-shadow` 0 0 #0000 · `--tw-inset-shadow-color` initial · `--tw-inset-shadow-alpha` 100%
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` initial · `--tw-backdrop-brightness` initial · `--tw-backdrop-contrast` initial · `--tw-backdrop-grayscale` initial
- 쌓임 규칙(앞 6개): `.tooltip { z-index: 50; box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-`

### 카카오웹툰 (`kakaowebtoon`)

- 주소 https://webtoon.kakao.com/ranking · 바탕 #121212 · 캡처 `shots/kakaowebtoon-page.jpg`
- 머리: `div.translate-y-0.transition-transform` fixed · z 100 · 면 투명 · 그림자 없음 · 아래 선 0px #000000 · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판: 없음(누른 것 2개, 이동 1개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--tw-ring-offset-shadow` 0 0 #0000 · `--tw-ring-shadow` 0 0 #0000 · `--tw-shadow` 0 0 #0000 · `--tw-shadow-colored` 0 0 #0000 · `--tw-drop-shadow` var(--tw-empty,/_!_/ /_!_/) · `--tw-shadow-color` rgba(var(--any-black),0.2)
- 쌓임 규칙(앞 6개): `.z-toastMinus1 { z-index: 299 }` · `.z-modalPlus1 { z-index: 201 }` · `.z-toast { z-index: 300 }` · `.z-modal { z-index: 200 }`

### 라프텔 (`laftel`)

- 주소 https://laftel.net/finder · 바탕 #121212 · 캡처 `shots/laftel-page.jpg`
- 머리: `div.AppHeader__HeaderBlock-sc-9d31e126-0.iyffvu` fixed · z 10 · 면 투명 · 그림자 없음 · 아래 선 0px #f7f7f7 · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판 menu 「더 보기」: `div.FilterModal__Block-sc-7d0d733f-1.kPiUOB` 면 #121212 (뒤 #121212 대비 1) · 선 none · 모서리 4px · 그림자 없음 · z(바깥) 11 · backdrop none · 띄우는 방법 없음 · 캡처 `laftel-m1.png`
- 가림막(menu 「더 보기」): #000000/70 · z 10 · backdrop none
- 가림막(menu 「더 보기」): #000000/70 · z 10 · backdrop none
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--drop-shadow` · `--antd-wave-shadow-color` #1890ff
- 가림막 변수(규칙, 앞 4개): `--backdrop-blur` · `--backdrop-brightness` · `--backdrop-contrast` · `--backdrop-grayscale`
- 쌓임 규칙(앞 6개): `.ant-select-dropdown { z-index: 1050; box-shadow: 0 2px 8px rgba(0,0,0,.15) }` · `.ant-menu-submenu-popup { z-index: 1050 }` · `.ant-tooltip { z-index: 1060 }` · `.ant-dropdown { z-index: 1050 }` · `.ant-dropdown:before { z-index: -9999 }` · `.ant-dropdown-menu-submenu-popup { z-index: 1050 }`

### Letterboxd (`letterboxd`)

- 주소 https://letterboxd.com/films/popular/ · 바탕 #14181c · 캡처 `shots/letterboxd-page.jpg`
- 머리: `header#header.site-header.js-site-header` relative · z 1100 · 면 투명 · 그림자 없음 · 아래 선 0px #99aabb · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 1 · 링만 0 · 없음 0 · 많이 쓴 그림자 rgba(0, 0, 0, 0.15) 0px 8px 16px 0px(1)
- 쌓임 변수(규칙): `--modal-zindex` 5000 · `--backdrop-zindex` 4950 · `--dialog-z-index` 5000
- 그림자 변수(규칙, 앞 6개): `--box-shadow-tint-rgb` 0,17,34 · `--box-shadow-radius` .3125rem · `--box-shadow-alpha` 1 · `--modal-box-shadow` 0 2px 4px #00000026 · `--theme-control-shadow-color-alpha` .25 · `--theme-control-shadow-color` #000
- 가림막 변수(규칙, 앞 4개): `--backdrop-zindex` 4950 · `--backdrop-bg` #14181ce6 · `--backdrop-opacity` 1 · `--backdrop-aspect-ratio` 16 / 9
- 쌓임 규칙(앞 6개): `.modal { z-index: var(--modal-zindex); box-shadow: 0 2px 4px #00000026 }` · `.modal-backdrop { z-index: var(--backdrop-zindex) }` · `.share-tooltip { z-index: 10010 }` · `.action-menu:not(.-flat) { z-index: 10010; box-shadow: 0 0 .625rem rgb(from var(--theme-control-shadow-color) ` · `.dropdown-menu { z-index: 10010; box-shadow: 0 0 var(--box-shadow-radius) var(--box-shadow-color) }` · `html div.smenu-menu,html ul.smenu-menu { z-index: 10010 }`

### 레진 (`lezhin`)

- 주소 https://www.lezhin.com/ko/ranking · 바탕 #111115 · 캡처 `shots/lezhin-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「」: `div.lzPopper.[box-shadow:0_6px_20px_0_rgba(0,_0,_0,_0.2)]` 면 #111115 (뒤 #111115 대비 1) · 선 none · 모서리 12px · 그림자 rgba(0, 0, 0, 0.2) 0px 6px 20px 0px · z(바깥) 1050 · backdrop none · 띄우는 방법 그림자 · 캡처 `lezhin-m1.png`
- 연 판 menu 「메뉴」: `div.lzPopper.[box-shadow:0_6px_20px_0_rgba(0,_0,_0,_0.2)]` 면 #111115 (뒤 #111115 대비 1) · 선 1px #ffffff/10 · 모서리 8px · 그림자 rgba(0, 0, 0, 0.2) 0px 6px 20px 0px · z(바깥) 1050 · backdrop none · 띄우는 방법 선 · 그림자 · 캡처 `lezhin-m2.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 63
- 그림자 변수(규칙, 앞 6개): `--shadow-drop-shadow-1` rgba(17,17,21,.06) · `--shadow-drop-shadow-2` rgba(17,17,21,.08) · `--shadow-drop-shadow-3` rgba(17,17,21,.25) · `--shadow-drop-shadow-4` rgba(17,17,21,.3) · `--shadow-drop-shadow-5` rgba(17,17,21,.5) · `--shadow-hero-banner` rgba(17,17,21,.06)
- 가림막 변수(규칙, 앞 4개): `--bg-overlay-bold` rgba(17,17,21,.85) · `--bg-overlay-strong` rgba(17,17,21,.55) · `--bg-overlay-soft` rgba(17,17,21,.4) · `--bg-overlay-subtle` rgba(17,17,21,.25)
- 쌓임 규칙(앞 6개): `.snackbar__container__nAdas { z-index: 1101 }` · `.fullSizeModal__backDrop__mduKp { z-index: 1050 }` · `.fullSizeModal__modalBody__V2a__ { z-index: 1050; box-shadow: 0 1px 2px 0 rgba(0,0,0,.38) }` · `.modal__9ARNN { z-index: 1050; box-shadow: 0 1px 2px 0 rgba(0,0,0,.38) }` · `.modal__backDrop__6vGu7 { z-index: 1050 }` · `.wordle__hint-tooltip___XMZu { z-index: 10 }`

### Lichess (`lichess`)

- 주소 https://lichess.org/player · 바탕 #000000 · 캡처 `shots/lichess-page.jpg` · 막힘? 잠시만 기다리십시오… lichess.org 보안 확인 수행 중 이 웹 사이트는 보안 서비스를 사용하여 악의적인 봇으로부터 보호합니다. 이 페이지는 웹 사이트에서 사용자가 봇이 아님을 확인하는 동안에만 표시됩니다.
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 0

### Linear (`linear`)

- 주소 https://linear.app/changelog · 바탕 #08090a · 캡처 `shots/linear-page.jpg`
- 머리: `header.TZTsQG_header.TZTsQG_header` fixed · z 100 · 면 투명 · 그림자 없음 · 아래 선 1px #ffffff/8 · backdrop blur(20px) · 내린 뒤 그림자 없음 · 면 투명
- 연 판 menu 「Product」: `nav#base-ui-_r_k_.TZTsQG_popup.Fzcv4W_hideScrollbars` 면 #08090a (뒤 #08090a 대비 1) · 선 1px #ffffff/8 · 모서리 14px · 그림자 rgb(8, 9, 10) 0px 8px 32px 0px · z(바깥) 10000 · backdrop blur(32px) · 띄우는 방법 선 · 그림자 · 캡처 `linear-m1.png`
- 연 판 tip 「Subscribe to updates」: `div._6QN9Vq_content` 면 #08090a (뒤 #08090a 대비 1) · 선 1px #23252a · 모서리 8px · 그림자 rgba(0, 0, 0, 0.35) 0px 7px 32px 0px · z(바깥) 1100 · backdrop none · 띄우는 방법 선 · 그림자 · 캡처 `linear-t3.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--shadow-none` 0px 0px 0px transparent · `--shadow-tiny` var(--shadow-none) · `--shadow-low` var(--shadow-none) · `--shadow-medium` var(--shadow-none) · `--shadow-high` var(--shadow-none) · `--shadow-stack-low` 0px 8px 2px 0px #0000, 0px 5px 2px 0px #00000003, 0px 3px 2px 0px #0000000a, 0px 1px 1px 0
- 가림막 변수(규칙, 앞 4개): `--layer-dialog-overlay` 699 · `--layer-overlay` 500 · `--color-selection-dim` color-mix(in lch, var(--color-brand-bg), transpare · `--color-overlay-dim-rgb` 255, 255, 255
- 쌓임 규칙(앞 6개): `.TBAOqq_toastWrapper { z-index: var(--layer-toasts) }` · `layer reset, base, app.base;
.wOrUyW_dialog { z-index: var(--layer-dialog); box-shadow: 0 4px 40px #0000001a,0` · `.TZTsQG_header { z-index: var(--layer-header) }` · `.TZTsQG_mobileMenuContent { z-index: var(--layer-dialog) }` · `.qM9FAa_mentionDropdown { z-index: var(--layer-context-menu); box-shadow: var(--shadow-high) }` · `[data-sonner-toaster] { z-index: 999999999 }`

### Mastodon (`mastodon`)

- 주소 https://mastodon.social/explore · 바탕 #07060e · 캡처 `shots/mastodon-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「9」: `div#_r_9a_-list._comp_menu__fullWidthCard._comp_menu__card[r` 면 #15151e (뒤 #15151e 대비 1) · 선 1px color(srgb 0.819608 0.780392 1 / 0.2) · 모서리 16px · 그림자 color(srgb 0.819608 0.780392 1 / 0.2) 0px 0px 2px 0px, color(srgb 0.819608 0.780392 1 / 0.08) 0px 4px 8px 0px · z(바깥) 2147483647 · backdrop none · 띄우는 방법 선 · 그림자 · 캡처 `mastodon-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--shadow-strength-primary` 80% · `--color-shadow-primary` rgb(from var(--color-black) r g b/var(--shadow-strength-primary)) · `--dropdown-shadow` 0 20px 25px -5px var(--color-shadow-primary), 0 8px 10px -6px var(--color-shadow-primary) · `--overlay-icon-shadow` drop-shadow(0 0 8px var(--color-shadow-primary)) · `--color-shadow` #181820
- 가림막 변수(규칙, 앞 4개): `--color-text-on-overlay` var(--base-color-fg) · `--overlay-strength-secondary` 4% · `--color-bg-overlay` rgb(from var(--color-black) r g b/50%) · `--overlay-icon-shadow` drop-shadow(0 0 8px var(--color-shadow-primary))
- 쌓임 규칙(앞 6개): `body>[data-popover-placement] { z-index: 9999 }` · `.dropdown-menu { z-index: 9999; box-shadow: var(--dropdown-shadow) }` · `.modal-root__container .privacy-dropdown__dropdown { z-index: 9999 }` · `.modal-root { z-index: 9998 }` · `.modal-root__container { z-index: 9999 }` · `.media-modal__buttons { z-index: 100 }`

### MDN (`mdn`)

- 주소 https://developer.mozilla.org/en-US/docs/Web/CSS/color · 바탕 #18191b · 캡처 `shots/mdn-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「HTML」: `div#uid_264402bft98.menu__panel` 면 #18191b (뒤 #18191b 대비 1) · 선 1px #51565d · 모서리 0px · 그림자 없음 · z(바깥) 100 · backdrop none · 띄우는 방법 선 · 캡처 `mdn-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 쌓임 변수(규칙): `--z-index-sticky-header` 100 · `--z-index-sidebar-mobile` 90
- 쌓임 규칙(앞 6개): `/*# sourceMappingURL=styles-navigation.c3ebf384e65df345.css.map*/
.a11y-menu { z-index: 1000 }` · `.page-layout__header { z-index: var(--z-index-sticky-header) }`

### 나무위키 (`namuwiki`)

- 주소 https://namu.wiki/w/%EB%A6%AC%EB%93%AC%20%EA%B2%8C%EC%9E%84 · 바탕 #000000 · 캡처 `shots/namuwiki-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판: 없음(누른 것 2개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 3
- 그림자 변수(규칙, 앞 6개): `--focus-box-shadow-style` var(--focus-outline-color) 0 0 0 0.2rem
- 쌓임 규칙(앞 6개): `.G2hUrd0V[data-tooltip]:before { z-index: 509; box-shadow: 0 5px 8px -3px rgba(0,0,0,.165) }` · `.G2hUrd0V[data-tooltip]:before { z-index: 509; box-shadow: 0 5px 8px -3px rgba(0,0,0,.165) }` · `.G2hUrd0V[data-tooltip]:before { z-index: 509; box-shadow: 0 5px 8px -3px rgba(0,0,0,.165) }`

### 네이버페이 (`naver-pay`)

- 주소 https://pay.naver.com/ · 바탕 #1f1f1f · 캡처 `shots/naver-pay-page.jpg`
- 머리: `header#header.header[role=banner]` static · z auto · 면 투명 · 그림자 없음 · 아래 선 0px #000000 · backdrop none · 내린 뒤 머리 안 보임
- 연 판 menu 「button.btn_lang, button[」: `ul.language_list` 면 #2d2d2d (뒤 #1f1f1f 대비 1.2) · 선 1px #ffffff/15 · 모서리 8px · 그림자 rgba(0, 0, 0, 0.04) 0px 0px 6px 0px, rgba(0, 0, 0, 0.1) 0px 3px 6px 0px · z(바깥) auto · backdrop none · 띄우는 방법 밝은 면 · 선 · 그림자 · 캡처 `naver-pay-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 1
- 그림자 변수(규칙, 앞 6개): `--core-elevation-blur-6` 6px · `--core-elevation-offset-x-0` 0px · `--core-elevation-offset-y-0` 0px · `--core-elevation-offset-y-3` 3px · `--core-elevation-spread-0` 0px · `--core-elevation-opacity-4` #0000000a

### osu! (`osu`)

- 주소 https://osu.ppy.sh/rankings/osu/performance · 바탕 #171c17 · 캡처 `shots/osu-page.jpg`
- 머리: `div.js-pinned-header.hidden-xs` fixed · z 509 · 면 투명 · 그림자 없음 · 아래 선 0px #ffffff · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 1 · 링만 0 · 없음 0 · 많이 쓴 그림자 rgba(0, 0, 0, 0.25) 0px 1px 3px 0px(1)
- 쌓임 변수(규칙): `--z-index--nav-bar-mobile` 509
- 가림막 변수(규칙, 앞 4개): `--overlay-colour` rgba(0,0,0,.75)
- 쌓임 규칙(앞 6개): `.pswp__share-modal { z-index: 1600 }` · `.pswp__share-tooltip { z-index: 1620; box-shadow: 0 2px 5px rgba(0,0,0,.25) }` · `.dropdown-menu { z-index: 1000; box-shadow: 0 6px 12px rgba(0,0,0,.175) }` · `.dropdown-backdrop { z-index: 990 }` · `.modal { z-index: 1050 }` · `.modal-backdrop { z-index: 1040 }`

### Raycast (`raycast`)

- 주소 https://www.raycast.com/store · 바탕 #07080a · 캡처 `shots/raycast-page.jpg`
- 머리: `div#navbar.pSp8Ga_container` fixed · z 2 · 면 투명 · 그림자 없음 · 아래 선 0px #ffffff · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 13 · 없음 0
- 쌓임 규칙(앞 6개): `.iX2sxG_modal { z-index: 10; box-shadow: 0 6px 24px 6px #000 }` · `.w1Bx1W_tooltip.w1Bx1W_tooltip { z-index: 100 }` · `.U7IOvG_tooltip { z-index: 10 }`

### Reddit (`reddit`)

- 주소 https://www.reddit.com/r/programming/ · 바탕 #121213 · 캡처 `shots/reddit-page.jpg` · 막힘? You've been blocked by network security. If you think you've been blocked by mistake, file a ticket below and we'll loo
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--elevation-xs` 0 0.0625rem 0.125rem 0 #00000040 · `--elevation-sm` 0 0.0625rem 0.25rem 0 #00000026,0 0.25rem 0.25rem 0 #00000026 · `--elevation-md` 0 0.25rem 0.5rem 0 #0000001a,0 0.375rem 0.75rem 0 #00000040 · `--elevation-lg` 0 0.75rem 0.75rem 0 #00000026,0 1rem 2rem 0 #00000040 · `--elevation-focus-ring` 0 0 0 0.25rem var(--color-global-alienblue) · `--boxshadow-modal` 0px 2px 15px rgba(26, 26, 27, 0.3)
- 가림막 변수(규칙, 앞 4개): `--color-scrim` #1a1a1b4d · `--color-button-overlay-focus` #ffffff1a · `--color-button-overlay-active` #00000014 · `--color-scrim-strong` #000000cc

### Spotify (`spotify`)

- 주소 https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF · 바탕 #121212 · 캡처 `shots/spotify-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 tip 「검색하기」: `div.BZtenCo63gr6Pz1mZxrC` 면 #282828 (뒤 #121212 대비 1.27) · 선 none · 모서리 4px · 그림자 rgba(0, 0, 0, 0.3) 0px 16px 24px 0px, rgba(0, 0, 0, 0.2) 0px 6px 8px 0px · z(바깥) 9999 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `spotify-t2.png`
- 상자 셈: 그림자 1 · 링만 0 · 없음 3 · 많이 쓴 그림자 rgba(0, 0, 0, 0.5) 0px 4px 60px 0px(1)
- 쌓임 변수(규칙): `--left-sidebar-grid-area-z-index` 4 · `--above-everything-except-now-playing-bar-z-index` 5 · `--now-playing-bar-grid-area-z-index` calc(var(--above-everything-except-now-playing-bar-z-index) + 1) · `--above-everything-grid-area-z-index` 7 · `--onboarding-search-grid-area-z-index` calc(var(--above-everything-grid-area-z-index) + 1) · `--encore-z-index-popover` 1060 · `--encore-z-index-skiplink` 9999 · `--encore-z-index-dialog` 1050 · `--top-bar-z-index` 1 · `--watch-feed-z-index` 6
- 그림자 변수(규칙, 앞 6개): `--add-account-dialog-shadow` 0 4px 40px #0000004d · `--replies-toggle-author-shadow-color` var(--background-base) · `--encore-overlay-box-shadow` 0 4px 12px 0 #0000004d · `--encore-overlay-drop-shadow` 0 4px 6px #0000004d · `--encore-focus-box-shadow` 0 3px 0 0 · `--encore-box-shadow-color` var(--essential-subdued)
- 가림막 변수(규칙, 앞 4개): `--encore-overlay-box-shadow` 0 4px 12px 0 #0000004d · `--encore-overlay-drop-shadow` 0 4px 6px #0000004d · `--encore-overlay-trigger-display` block · `--encore-overlay-trigger-corner-offset` 17px
- 쌓임 규칙(앞 6개): `.dialog { z-index: 104 }` · `.menu-button { z-index: 1051 }` · `.header-wrapper { z-index: 1020 }` · `.e-101111-dialog { z-index: var(--encore-z-index-dialog) }` · `.e-101111-app__banner-header { z-index: 1030 }` · `.e-101111-dialog-full-screen { z-index: var(--encore-z-index-dialog) }`

### Steam (`steam`)

- 주소 https://store.steampowered.com/charts/mostplayed · 바탕 #0f1924 · 캡처 `shots/steam-page.jpg`
- 머리: `header._7urhuKLYiUk-` static · z auto · 면 #171d25 · 그림자 없음 · 아래 선 0px #acb2b8 · backdrop none · 내린 뒤 머리 안 보임
- 연 판 menu 「언어」: `div.h2hJmhz41JY-._6SYP6u3KmrY-` 면 #3d4450 (뒤 #171d25 대비 1.73) · 선 none · 모서리 0px · 그림자 rgb(0, 0, 0) 0px 0px 12px 0px · z(바깥) auto · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `steam-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--basebuttons-grey-label-shadow` 2px 2px 15px #00000080 · `--box-shadow-elevation--1` 2px 2px 4px 0px #00000040 inset · `--box-shadow-elevation-0` none · `--box-shadow-elevation-1` 2px 2px 4px #00000040 · `--box-shadow-elevation-2` 5px 5px 6px #00000040 · `--gpShadow-Small` 0px 2px 2px 0px #0000003d
- 쌓임 규칙(앞 6개): `.GreenEnvelopeMenu,.l39SV-qhMqE- { z-index: 1600; box-shadow: 0 10px 32px #000000ab }`

### STOVE 스토어 (`stove`)

- 주소 https://store.onstove.com/ko/ · 바탕 #191919 · 캡처 `shots/stove-page.jpg`
- 머리: `div.top-0.pointer-events-auto` sticky · z 1001 · 면 투명 · 그림자 없음 · 아래 선 0px #ffffff · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판 menu 「카테고리」: `div.uid_store_pc_category_list_container.flex` 면 #292929 (뒤 #191919 대비 1.21) · 선 none · 모서리 20px · 그림자 rgba(0, 0, 0, 0.2) 0px 12px 28px 0px · z(바깥) 9999 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `stove-m1.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 2
- 쌓임 변수(규칙): `--stds-glob-z-index-base` 0 · `--stds-glob-z-index-docked` 10 · `--stds-glob-z-index-dropdown` 500 · `--stds-glob-z-index-tooltip` 600 · `--stds-glob-z-index-sticky` 1000 · `--stds-glob-z-index-overlay` 2000 · `--stds-glob-z-index-modal` 2500 · `--stds-glob-z-index-toast` 3000
- 그림자 변수(규칙, 앞 6개): `--tw-ring-offset-shadow` 0 0 #0000 · `--tw-ring-shadow` 0 0 #0000 · `--tw-shadow` 0 0 #0000 · `--tw-shadow-colored` 0 0 #0000 · `--stds-sem-color-surface-elevation-1` var(--stds-glob-color-white) · `--stds-sem-color-surface-elevation-2` var(--stds-glob-color-gray20)
- 가림막 변수(규칙, 앞 4개): `--stds-glob-z-index-overlay` 2000 · `--tw-backdrop-blur` blur(64px) · `--header-overlay` #3333334d · `--tw-backdrop-brightness`
- 쌓임 규칙(앞 6개): `.stds-dialog { z-index: 2500 }` · `.stds-dialog-overlay { z-index: 2000 }` · `.stds-dialog-panel { z-index: 2500; box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 ` · `.z-dropdown { z-index: 500 }` · `.z-modal { z-index: 2500 }` · `.z-toast { z-index: 3000 }`

### 토스증권 (`toss`)

- 주소 https://www.tossinvest.com/ · 바탕 #17171c · 캡처 `shots/toss-page.jpg`
- 머리: `div.tw1n-1jzztjt1.tw1n-1jzztjt0` fixed · z 9999999 · 면 투명 · 그림자 없음 · 아래 선 0px #c3c3c6 · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판 menu 「/
  를 눌러 검색하세요」: `div#radix-_R_aaaqudi6_.tw1n-gduhvu0.tw1n-zz9mqe1[role=dialog` 면 #202025 (뒤 #17171c 대비 1.1) · 선 none · 모서리 16px · 그림자 rgba(0, 0, 0, 0.12) 0px 12px 28px -4px, rgba(0, 0, 0, 0.1) 0px 8px 56px -4px · z(바깥) auto · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `toss-m1.png`
- 연 판 dialog 「로그인하고 이유 보기」: `div#radix-_r_1n6_.tw1n-gduhvu0.tw1n-1guc9ct4[role=dialog]` 면 #2c2c35 (뒤 #17171c 대비 1.29) · 선 none · 모서리 16px · 그림자 rgba(222, 222, 255, 0.19) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 10px 40px 0px, rgba(0, 0, 0, 0.12) 0px 20px 50px 0px, rgba(0, 0, 0, 0.12) 2px 70px 80px 0px · z(바깥) auto · backdrop none · 띄우는 방법 밝은 면 · 그림자+링 · 캡처 `toss-d7.png`
- 상자 셈: 그림자 2 · 링만 3 · 없음 0 · 많이 쓴 그림자 rgba(0, 0, 0, 0.24) 0px 0px 0px 0.75px inset, rgba(214, 224, 239, 0.09) 0px 0px 0px 0.75px, rgba(0, 0, 0, 0.08) 0px 0px 0.5px 0px, rgba(0, 0, 0, 0.04) 0px 1px 1(1)
- 쌓임 변수(규칙): `--contexify-zIndex` 666
- 그림자 변수(규칙, 앞 6개): `--wts-adaptive-shadowMedium00` rgba(2,32,71,0.05) · `--wts-adaptive-shadowMedium01` rgba(2,32,71,0.05) · `--wts-adaptive-shadowMedium02` rgba(0,23,51,0.02) · `--wts-adaptive-shadowLarge00` rgba(2,32,71,0.05) · `--wts-adaptive-shadowLarge01` rgba(2,32,71,0.05) · `--wts-adaptive-shadowLarge02` rgba(0,23,51,0.02)
- 가림막 변수(규칙, 앞 4개): `--tw-semantic-color-bg-overlayDim` rgba(0,0,0,0.2) · `--tw-semantic-color-bg-overlay300` var(--tw-adaptive-color-grey50) · `--tw-semantic-color-bg-overlay400` #FFFFFF
- 쌓임 규칙(앞 6개): `body:has(._4x34jz0)>div:has([role=dialog][data-state=open],[role=alertdialog][data-state=open]) { z-index: 100` · `body:has(._4x34jz0) [data-radix-popper-content-wrapper]:has([data-datepicker-in-modal]) { z-index: 10006!impor` · `body:has(._4x34jz0) [data-radix-popper-content-wrapper]:has([data-fullscreen-tooltip]) { z-index: 10004!import` · `body:has(._4x34jz0)>div:has([role=dialog][data-state=open],[role=alertdialog][data-state=open]) { z-index: 100` · `body:has(._4x34jz0) [data-radix-popper-content-wrapper]:has([data-datepicker-in-modal]) { z-index: 10006!impor` · `body:has(._4x34jz0) [data-radix-popper-content-wrapper]:has([data-fullscreen-tooltip]) { z-index: 10004!import`

### 티빙 (`tving`)

- 주소 https://www.tving.com/help/notice · 바탕 #000000 · 캡처 `shots/tving-page.jpg`
- 머리: `header.tvl-root.tvl-gnb` fixed · z 200 · 면 투명 · 그림자 없음 · 아래 선 0px #4f4f4f · backdrop none · 내린 뒤 그림자 없음 · 면 투명
- 연 판 menu 「찾기」: `div.live-item-wrapper.item__thumb-new-tving-item` 면 #262626 (뒤 #191919 대비 1.16) · 선 none · 모서리 4px · 그림자 없음 · z(바깥) 150 · backdrop none · 띄우는 방법 밝은 면 · 캡처 `tving-m1.png`
- 가림막(menu 「찾기」): #000000/50 · z 150 · backdrop none
- 연 판 tip 「게스트 프로필」: `div.tvl-guest-menu` 면 #000000 (뒤 #000000 대비 1) · 선 1px #ffffff/15 · 모서리 16px · 그림자 rgba(0, 0, 0, 0.5) 0px 10px 20px 0px · z(바깥) 200 · backdrop none · 띄우는 방법 선 · 그림자 · 캡처 `tving-t3.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 그림자 변수(규칙, 앞 6개): `--tw-ring-offset-shadow` 0 0 #0000 · `--tw-ring-shadow` 0 0 #0000 · `--tw-shadow` 0 0 #0000 · `--tw-shadow-colored` 0 0 #0000 · `--tw-drop-shadow`
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` · `--tw-backdrop-brightness` · `--tw-backdrop-contrast` · `--tw-backdrop-grayscale`
- 쌓임 규칙(앞 6개): `.main_gnb { z-index: 200 }` · `.tvl-root.tvl-gnb { z-index: var(--tving-gnb-z-index,200) }`

### Twitch (`twitch`)

- 주소 https://www.twitch.tv/directory · 바탕 #0e0e10 · 캡처 `shots/twitch-page.jpg`
- 머리: 맨 위에 붙은 넓은 머리 요소 못 찾음
- 연 판 menu 「옵션 더 보기」: `div.Layout-sc-1xcs6mc-0.egfniL` 면 #323239 (뒤 #0e0e10 대비 1.52) · 선 none · 모서리 6px · 그림자 rgba(0, 0, 0, 0.6) 0px 4px 8px 0px, rgba(0, 0, 0, 0.4) 0px 0px 4px 0px · z(바깥) 5000 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `twitch-m1.png`
- 연 판 menu 「추천」: `ul#browse-sort-drop-down-list.Layout-sc-1xcs6mc-0.gLqvzy[rol` 면 #18181b (뒤 #0e0e10 대비 1.09) · 선 none · 모서리 4px · 그림자 rgba(0, 0, 0, 0.6) 0px 4px 8px 0px, rgba(0, 0, 0, 0.4) 0px 0px 4px 0px · z(바깥) 5000 · backdrop none · 띄우는 방법 밝은 면 · 그림자 · 캡처 `twitch-m5.png`
- 연 판 dialog 「로그인」: `div.Layout-sc-1xcs6mc-0.gUJjOO` 면 #18181b (뒤 #020202 대비 1.17) · 선 none · 모서리 0px · 그림자 없음 · z(바깥) 5000 · backdrop none · 띄우는 방법 밝은 면 · 캡처 `twitch-d6.png`
- 가림막(dialog 「로그인」): #000000/85 · z 5000 · backdrop none
- 상자 셈: 그림자 0 · 링만 0 · 없음 0
- 쌓임 규칙(앞 6개): `.snackbar-list__container { z-index: 5010 }` · `.modal__backdrop { z-index: 5000 }` · `.snackbar-list__container { z-index: 5010 }` · `.modal__backdrop { z-index: 5000 }` · `.emote-grid-section__header-title { z-index: 20 }` · `.snackbar-list__container { z-index: 5010 }`

### Vercel (`vercel`)

- 주소 https://vercel.com/docs/getting-started-with-vercel · 바탕 #000000 · 캡처 `shots/vercel-page.jpg`
- 머리: `header#marketing-header.peer.sticky` sticky · z 75 · 면 투명 · 그림자 없음 · 아래 선 0px #1f1f1f · backdrop none · 내린 뒤 그림자 rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.14) 0px 1px 0px 0px · 면 #000000
- 연 판 menu 「Build」: `div#nav-panel-products.invisible.data-[open]:visible` 면 #000000 (뒤 #000000 대비 1) · 선 none · 모서리 0px · 그림자 rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.13) 0px 1px 0px 0px · z(바깥) 75 · backdrop none · 띄우는 방법 그림자 · 캡처 `vercel-m1.png`
- 연 판 menu 「Open page actions」: `ul#menu-_R_l2linpfjebr9kiivb_.data-[state='closed']:animate-` 면 #0a0a0a (뒤 #000000 대비 1.06) · 선 none · 모서리 12px · 그림자 rgba(255, 255, 255, 0.145) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px -4px, rgba(0, 0, 0, 0.06) 0px 16px 24px -8px, rgb(0, 0, 0) 0px 0px 0px 1px · z(바깥) 2001 · backdrop none · 띄우는 방법 그림자+링 · 캡처 `vercel-m3.png`
- 상자 셈: 그림자 0 · 링만 0 · 없음 1
- 쌓임 변수(규칙): `--header-zindex` 75
- 그림자 변수(규칙, 앞 6개): `--tw-shadow` 0 0 #0000 · `--tw-shadow-color` initial · `--tw-shadow-alpha` 100% · `--tw-inset-shadow` 0 0 #0000 · `--tw-inset-shadow-color` initial · `--tw-inset-shadow-alpha` 100%
- 가림막 변수(규칙, 앞 4개): `--tw-backdrop-blur` initial · `--tw-backdrop-brightness` initial · `--tw-backdrop-contrast` initial · `--tw-backdrop-grayscale` initial
- 쌓임 규칙(앞 6개): `.fides-modal-container { z-index: 9999 }` · `.z-\(--header-zindex\) { z-index: var(--header-zindex) }` · `.z-\[calc\(var\(--ds-z-modal\)\+1\)\] { z-index: calc(var(--ds-z-modal) }` · `.z-\[calc\(var\(--ds-z-tooltip\)-1\)\] { z-index: calc(var(--ds-z-tooltip) }` · `.z-\[calc\(var\(--header-zindex\)-1\)\] { z-index: calc(var(--header-zindex) }` · `.z-\[calc\(var\(--header-zindex\)_\+_2\)\] { z-index: calc(var(--header-zindex) }`

### 왓챠 (`watcha`)

- 주소 https://pedia.watcha.com/ko-KR · 바탕 #000000 · 캡처 `shots/watcha-page.jpg`
- 머리: `header._header_jeexp_1` fixed · z 51 · 면 #000000 · 그림자 rgba(0, 0, 0, 0.08) 0px 1px 0px 0px · 아래 선 0px #ffffff · backdrop none · 내린 뒤 그림자 rgba(0, 0, 0, 0.08) 0px 1px 0px 0px · 면 #000000
- 연 판: 없음(누른 것 0개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 1
- 쌓임 변수(규칙): `--z-index-page-loading` 10 · `--z-index-sticky-header` 20 · `--z-index-scroll-arrow-button` 20 · `--z-index-header-bar` 50 · `--z-index-nav` 51 · `--z-index-modal-back-screen` 100 · `--z-index-modal-dim` 100 · `--z-index-global-loading` 102 · `--z-index-toast-container` 103 · `--z-index-dropdown` 400 · `--z-index-error-page` 1000 · `--z-index-legacy-modal-back-screen` 1050
- 가림막 변수(규칙, 앞 4개): `--color-player-dim` rgb(0, 0, 0, .6) · `--z-index-modal-dim` 100 · `--color-dim` rgba(0, 0, 0, .45)
- 쌓임 규칙(앞 6개): `._dropDownWrapper_1stem_7 { z-index: 10 }` · `._moreDropDown_ftabv_116 { z-index: var(--z-index-dropdown) }` · `._header_17ipw_1 { z-index: var(--z-index-header-bar) }` · `._dropdownContent_2jvag_31 { z-index: var(--z-index-dropdown) }` · `._header_jeexp_1,._mobileHeader_jeexp_2 { z-index: var(--z-index-nav) }` · `._autocompleteDropdown_jeexp_171 { z-index: 100; box-shadow: 0 4px 12px #0000001a }`

### 웨이브 (`wavve`)

- 주소 https://www.wavve.com/ · 바탕 #1b1b1b · 캡처 `shots/wavve-page.jpg`
- 머리: `header.header-container[role=banner]` sticky · z 1750 · 면 #1b1b1b · 그림자 없음 · 아래 선 0px #a5a5a5 · backdrop none · 내린 뒤 그림자 없음 · 면 #1b1b1b
- 연 판: 없음(누른 것 2개, 이동 0개)
- 상자 셈: 그림자 0 · 링만 0 · 없음 33
- 쌓임 규칙(앞 6개): `#snackbar[data-v-864de0f1] { z-index: 3000 }` · `.layer-popup-view .modal[data-v-6b3c9917] { z-index: 2000 }` · `.dialog[data-v-b0755219] { z-index: 10001 }` · `.dialog[data-v-dfb54273] { z-index: 10001 }` · `.toast[data-v-bd749106] { z-index: 3000 }` · `.header { z-index: 1750 }`

## 2차 실측 — 붙은 것 · 창 · 쌓임 · 한 서비스 안의 층 원리 (2026-11-21)

「그림자 · 쌓임」 판의 층 규칙(놓인 것 · 붙은 것 · 창 · 떠 있는 것)을 실측과 맞대 보려고 빈칸만 더 쟀다. 판단 · 추천은 판에 둔다. 스크립트 `color-shadow-layer/probe2.js` · `run2.mjs`, 원자료 `raw2/<곳>.json`, 캡처 `shots2/<곳>-scrolled.jpg` · `<곳>-dlg<번호>.jpg`. 1차와 같은 조건(headless chromium 1440×900 · 다크 · 권한 없음 · `wait-capacity.sh` · 브라우저 하나에 페이지 하나씩)이다.

- 붙은 것: 스크롤 전에 화면 가운데 맨 위(y 30) · 맨 아래 띠를 표시하고 900px 내린 뒤에도 같은 자리에 남았는지로 가렸다. 남은 띠의 면 · 그림자(바깥, 알파 2% 넘음) · 아래 선 · 흐림을 읽고, 캡처 36장 모음을 직접 열어 판정을 고쳤다(자동 판정이 띠를 놓친 곳 7곳: class101 · lezhin · mdn · steam · aion2 · bns · epic7). 표 머리는 `th` · `[role=columnheader]` 의 sticky 조상을 읽었다.
- 창: 로그인 · 공유 · 설정 · 언어 · 검색 버튼을 4개까지 눌러 `aria-modal` · `role=dialog` · `dialog[open]` 이나 화면 90% 넘는 가림막이 뜬 경우만 셌다. 열지 못한 곳은 스타일시트에서 이름에 modal · dialog 가 든 선택자의 box-shadow · border, backdrop · dim · overlay 선택자의 바탕색을 「규칙」 으로 따로 적었다.
- 쌓임: 스타일시트에서 header · menu(dropdown · popover · select · listbox) · modal(dialog) · toast(snackbar · notification) 선택자의 z-index 최댓값을 모았다. 이름이 겹치는 엉뚱한 선택자(예: 영상 플레이어 광고 창)가 섞여 이 값만으로는 판정하지 않고, 1차 기록의 이름 붙은 쌓임 변수 11곳과 디자인 시스템 원본으로 「대화상자 안에서 연 셀렉트 · 메뉴가 대화상자 위로 뜨는가」 를 가렸다.
- 1차 다크 36곳에 국내 다크 사이트 10곳을 더 열었다(크래프톤 · 펄어비스 · 엔씨소프트 · 던전앤파이터 · FC 온라인 · FLO · 데브시스터즈 · 에픽세븐 · 블레이드앤소울 · 넥슨). 다크로 열린 곳은 던전앤파이터 · 에픽세븐 · 블레이드앤소울 · FC 온라인 · 넥슨 5곳이고 FC 온라인 · 넥슨은 첫 화면 팝업에 막혀 붙은 것을 세지 않았다. 나머지 5곳은 밝게 열리거나(펄어비스 · 엔씨소프트 · FLO · 데브시스터즈) 403(크래프톤)이라 뺐다.

### 붙은 것 — 스크롤 뒤 맨 위 띠 (다크 30곳, 국내 17)

| 꼴                         | 곳 수     | 곳                                                                                |
| -------------------------- | --------- | --------------------------------------------------------------------------------- |
| 같은 면, 선 · 그림자 없음  | 8(국내 7) | Binance · 치지직 · 카카오웹툰 · STOVE 스토어 · 티빙 · 당근 · 클래스101 · 레진     |
| 같은 면 + 1px 선           | 6(국내 3) | 라프텔 · Vercel · 왓챠 · GitLab · MDN · 토스증권                                  |
| 같은 면 + 1px 선 + 흐림    | 2(국내 0) | Linear · Raycast                                                                  |
| 다른 면(띠 색이 쪽과 다름) | 7(국내 4) | Spotify · osu! · Steam · 아이온2(엔씨) · 블레이드앤소울 · 에픽세븐 · 던전앤파이터 |
| 면 + 그림자                | 2(국내 1) | 다음 · Twitch                                                                     |
| 붙지 않음                  | 5(국내 2) | DAK.GG · 나무위키 · Disney+ · GitHub · Hugging Face                               |

- 붙은 띠가 있는 25곳 가운데 그림자를 쓴 곳은 다음 · Twitch 2곳이다(다음은 흰 8% 번짐). 1px 선을 box-shadow 로 그린 라프텔 · Vercel · 왓챠는 「선」 으로 셌다.
- 아래 막대: 맨 아래에 붙은 띠는 쿠키 동의 · 가입 권유 배너뿐이었다(Spotify · GitLab · Apple Music · Twitch · Chess.com · class101). 기능 막대로 셀 곳이 없어 미확인이다.
- 붙은 표 머리: Spotify(면 + 선) · 토스증권(선 · 그림자 없음) 2곳만 찾았다. 근거 약함.
- 디자인 시스템 5곳: 당근 SEED app-bar 는 그림자 · 아래 선 없음, 붙는 탭 목록은 면 `bg-layer-default` + 안쪽 아래 선 `stroke-neutral-muted` #ffffff17(daangn-tokens.json `tabs`). IBM Carbon UI Shell 머리는 면 `$background`(쪽과 같음) + `border-block-end: 1px solid $border-subtle`, 그림자 없음(`ds-src/carbon-header.scss` 37–39행). GitHub Primer 머리는 면 `--header-bgColor` #151b23f2 + 구분선 `--header-borderColor-divider` #656c76(`primer-dark.css` 506–507행). MUI AppBar 는 기본 elevation 4 그림자(`mui-AppBar.js` 180행). Bootstrap 5.3 navbar 는 그림자 · 선 변수 없음, sticky z 1020(`bootstrap-vars.scss` 1134행). 그림자를 쓰는 곳은 MUI 1곳.

### 창 — 대화상자 (화면에서 연 11곳, 국내 3)

| 곳                 | 판 면      | 둘레                       | 그림자                    | 가림막               | 출처                   |
| ------------------ | ---------- | -------------------------- | ------------------------- | -------------------- | ---------------------- |
| 당근               | #1d2025    | 없음                       | 없음                      | #000 46%             | 1차                    |
| 라프텔             | #121212    | 없음                       | 없음                      | #000 70%             | 1차                    |
| 토스증권           | #2c2c35    | 고리 rgba(222,222,255,.19) | 0 10px 40px 15% 외        | 미확인               | 1차                    |
| Twitch             | #18181b    | 없음                       | 없음                      | #000 85%             | `twitch-dlg1.jpg`      |
| Vercel(검색)       | #0a0a0a    | 없음                       | 없음                      | 없음                 | `vercel-dlg1.jpg`      |
| Apple Music        | #1d1d1f    | 없음                       | 0 10px 10px 20%           | #000 48%             | `apple-music-dlg1.jpg` |
| GitHub(검색)       | #010409    | 고리 #3d444d               | floating-small            | #212830 40%          | `github-dlg1.jpg`      |
| Hugging Face(검색) | #0b0f19    | 1px 선                     | 0 10px 20px 4% 외         | 없음                 | `huggingface-dlg1.jpg` |
| Linear(검색)       | #0f1011    | 1px 흰 5%                  | 0 4px 40px 10% 외 여러 겹 | #000 85%             | `linear-dlg1.jpg`      |
| Chess.com          | #262421    | 안쪽 고리 흰 10%           | 0 8px 24px 65%            | 미확인               | 1차                    |
| Raycast(검색)      | 판 못 잡음 | 미확인                     | 미확인                    | #000 80% + 흐림 10px | `raycast-dlg1.jpg`     |

- 그림자 없음 4곳(당근 · 라프텔 · Twitch · Vercel) · 그림자 있음 6곳(토스증권 · Apple Music · GitHub · Hugging Face · Linear · Chess.com) · 판 못 잡음 1곳. 국내는 3곳뿐이라 근거 약함.
- 가림막을 읽은 7곳은 모두 검정(GitHub 만 #212830) 40–85%, 흐림을 더한 곳은 Raycast 1곳.
- 규칙으로만 읽은 곳(열지 못함): 대화상자 선택자에 그림자를 둔 곳 Binance · Chess.com · Disney+ · 에픽세븐 · 라프텔(ant-modal 0 4px 12px 15%) · Letterboxd · 레진 · 나무위키(다크 0 20px 60px 40%) · osu! · STOVE(0 4px 10px 10%) · 왓챠 · Reddit, 둘레 선을 둔 곳 GitLab · osu!. 가림막 규칙은 다음 80% · 40% · 레진 70% · STOVE 60% · 웨이브 70% · 에픽세븐 80% · 블레이드앤소울 72% · Spotify 70% · Vercel 70% · Hugging Face 80% · 왓챠 40% · 나무위키 50% · 네이버페이 40%. 규칙에는 프레임워크 기본값이 섞여 화면 값과 따로 둔다.
- 디자인 시스템(1차 표): 그림자 없음 당근 SEED · 원티드 Montage 2곳, 그림자 있음 Primer(floating-large) · Atlassian(overlay) · Material 3(level3) · MUI(24) · Fluent 2(shadow64) 5곳.

### 쌓임 — 대화상자 안에서 연 셀렉트 · 메뉴, 토스트 (이름 붙은 쌓임 값 13곳, 국내 7)

| 곳                    | 메뉴 · 셀렉트                | 대화상자             | 토스트                | 대화상자 안 셀렉트        |
| --------------------- | ---------------------------- | -------------------- | --------------------- | ------------------------- |
| 당근 SEED 부품 변수   | menu · select 99999          | dialog 2             | snackbar-region 최대  | 위                        |
| 당근 실제 웹          | 메뉴 300(화면)               | 대화상자 402(화면)   | 미확인                | 아래                      |
| 왓챠                  | dropdown 400                 | modal-dim 100        | toast-container 103   | 위                        |
| 라프텔(ant)           | ant-select-dropdown 1050     | ant-modal 1000(기본) | ant-notification 1010 | 위                        |
| 레진                  | lzPopperContent 1050         | modal backDrop 1050  | snackbar 1101         | 같은 단계(문서 순서)      |
| 토스증권              | radix popper 10006           | dialog 10006         | 미확인                | 같은 단계(문서 순서)      |
| STOVE(STDS)           | dropdown 500                 | modal 2500           | toast 3000            | 아래                      |
| 카카오웹툰            | 미확인                       | z-modalPlus1 201     | z-toast 300           | 미확인                    |
| Spotify(encore)       | popover 1060                 | dialog 1050          | 미확인                | 위                        |
| Disney+(Bootstrap 값) | popover 1070 · dropdown 1000 | modal 1055           | toast 1090            | 팝오버 위 · 드롭다운 아래 |
| osu!(Bootstrap 3 값)  | popover 1060                 | modal 1050           | 미확인                | 위                        |
| Binance               | dropdown 1200                | modal 1200           | notification 1300     | 같은 단계(문서 순서)      |
| Apple Music           | contextual-menus 9951        | modal 10001          | 미확인                | 아래                      |
| Mastodon              | popover 9999                 | modal 9999           | notification 9999     | 같은 단계(문서 순서)      |

- 대화상자 안에서 연 셀렉트 · 메뉴가 대화상자 위로 오는 곳(위 또는 같은 단계에서 나중에 연 것이 위): 당근 SEED · 왓챠 · 라프텔 · 레진 · 토스증권 · Spotify · Disney+(팝오버) · osu! · Binance · Mastodon 10곳. 아래에 두는 곳: 당근 실제 웹 · STOVE · Apple Music 3곳. 화면에서 대화상자 안 셀렉트를 실제로 연 것이 아니라 변수 · 규칙 값으로 가렸다.
- 토스트가 대화상자보다 위인 곳: 당근 SEED · STOVE · 카카오웹툰 · 레진 · Binance · Disney+ · Twitch(snackbar 5010 > modal 5000) 7곳. 아래인 곳은 찾지 못했다.
- 디자인 시스템(1차 표): 셀렉트 · 메뉴를 대화상자 위 당근 SEED · Carbon, 같은 단계 MUI, 팝오버만 위 Bootstrap · Chakra, 아래 Atlassian · Bezier.

### 한 서비스 안의 층 원리 (층마다 한 줄)

| 곳          | 붙은 것                | 떠 있는 것                           | 창                                   | 원리                              |
| ----------- | ---------------------- | ------------------------------------ | ------------------------------------ | --------------------------------- |
| 당근        | 같은 면, 아무것도 없음 | 면 #1d2025 + 흰 9% 고리 + 0 1px 4px  | 면 + 가림막 46%, 그림자 없음         | 떠 있는 것만 그림자               |
| 라프텔      | 1px 선                 | 같은 면 판, 그림자 없음              | 가림막 70%, 그림자 없음              | 그림자 안 씀, 선 · 가림막으로     |
| 티빙        | 같은 면, 아무것도 없음 | 프로필 메뉴 선 + 그림자 · 찾기 판 면 | 가림막 50%(규칙 90%)                 | 떠 있는 것만 그림자               |
| STOVE       | 같은 면, 아무것도 없음 | 면 + 0 12px 28px 20%                 | 규칙: 가림막 60% + 판 0 4px 10px 10% | 떠 있는 것 · 창에 그림자          |
| 토스증권    | 면 + 1px 선            | 면 + 그림자                          | 고리 + 그림자                        | 붙은 것은 선, 위로 뜬 것은 그림자 |
| 치지직      | 같은 면, 아무것도 없음 | 툴팁 면 + 그림자                     | 미확인                               | 떠 있는 것만 그림자               |
| 다음        | 면 + 흰 번짐           | 면 + 0 4px 32px 16%                  | 규칙: 가림막 40–80%                  | 붙은 것 · 떠 있는 것 모두 번짐    |
| Twitch      | 면 + 그림자            | 면 + 0 4px 8px 60%                   | 면 + 가림막 85%, 그림자 없음         | 창만 그림자 없음                  |
| Linear      | 선 + 흐림              | 선 + 그림자                          | 선 + 그림자 + 가림막 85%             | 모든 층 선, 뜬 층 그림자          |
| Vercel      | 1px 선                 | 고리 + 여러 겹 그림자                | 검색 창 그림자 없음                  | 붙은 것 선, 메뉴만 그림자         |
| GitHub      | 붙지 않음              | 머리 메뉴 선 · 검색 창 고리 + 그림자 | 고리 + 그림자 + 가림막 40%           | 선 + 그림자                       |
| Spotify     | 다른 면                | 툴팁 면 + 그림자                     | 규칙: 가림막 70%                     | 떠 있는 것만 그림자               |
| Apple Music | 레일 구조              | 판 면 + 그림자                       | 면 + 그림자 + 가림막 48%             | 뜬 층 모두 그림자                 |

- 붙은 것에 그림자를 쓰지 않고 떠 있는 것에 그림자를 쓰는 곳이 13곳 중 9곳(당근 · 티빙 · STOVE · 토스증권 · 치지직 · Linear · Vercel · GitHub · Spotify)이다. 창은 그림자 없음(당근 · 라프텔 · Twitch · Vercel)과 있음(토스증권 · Linear · GitHub · Apple Music · STOVE 규칙)으로 갈린다.

### 곳마다 2차 실측

- Binance (`binance`, 해외) · 주소 https://www.binance.com/ko/markets/overview · 쪽 바탕 #181a20 · 캡처 `shots2/binance-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음. 계산값 div sticky · 면 #181a20(쪽 #181a20, 1) · 그림자 없음 · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): header 10000 · menu 1300 · modal 999999
- 치지직 (`chzzk`, 국내) · 주소 https://chzzk.naver.com/ · 쪽 바탕 #141517 · 캡처 `shots2/chzzk-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음. 계산값 header._container_1cyju_1 sticky · 면 #141517(쪽 #141517, 1) · 그림자 없음 · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): toast 100 · header 10000 · modal 20000 · dim 20001 · menu 1
- 카카오웹툰 (`kakaowebtoon`, 국내) · 주소 https://webtoon.kakao.com/ranking · 쪽 바탕 #121212 · 캡처 `shots2/kakaowebtoon-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음. 계산값 div.translate-y-0 fixed · 면 #121212(쪽 #121212, 1) · 그림자 없음 · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): modal 201 · toast 300
- STOVE 스토어 (`stove`, 국내) · 주소 https://store.onstove.com/ko/ · 쪽 바탕 #191919 · 캡처 `shots2/stove-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음. 계산값 div.pointer-events-none absolute · 면 #191919(쪽 #191919, 1) · 그림자 없음 · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): toast 3000 · menu 500 · modal 2500 · dim 2000 · header 10000
- 티빙 (`tving`, 국내) · 주소 https://www.tving.com/help/notice · 쪽 바탕 #000000 · 캡처 `shots2/tving-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음. 계산값 header.tvl-root fixed · 면 None(쪽 #000000, 1) · 그림자 없음 · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 10 · header 200 · dim 100 · toast 999
- 당근 (`daangn`, 국내) · 주소 https://www.daangn.com/kr/buy-sell/ · 쪽 바탕 #000000 · 캡처 `shots2/daangn-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음(검색칸만 붙음). 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): modal 1 · menu 0 · header -1
- 클래스101 (`class101`, 국내) · 주소 https://class101.net/ko · 쪽 바탕 #141414 · 캡처 `shots2/class101-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): 없음
- 레진 (`lezhin`, 국내) · 주소 https://www.lezhin.com/ko/ranking · 쪽 바탕 #111115 · 캡처 `shots2/lezhin-scrolled.jpg`
    - 붙은 것: 같은 면 · 선 · 그림자 없음(탭 줄이 붙음). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): toast 1101 · modal 1050 · dim 1050 · menu 1050 · header 1000
- 라프텔 (`laftel`, 국내) · 주소 https://laftel.net/finder · 쪽 바탕 #121212 · 캡처 `shots2/laftel-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 선(box-shadow 0 1px 0 #323232). 계산값 div.AppHeader__HeaderBlock-sc-9d31 fixed · 면 #121212(쪽 #121212, 1) · 그림자 rgb(50, 50, 50) 0px 1px 0px 0px · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 1050 · modal 99999 · toast 1010
- Vercel (`vercel`, 해외) · 주소 https://vercel.com/docs/getting-started-with-vercel · 쪽 바탕 #000000 · 캡처 `shots2/vercel-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 선(box-shadow 0 1px 0 흰 14%). 계산값 header.peer sticky · 면 #000000(쪽 #000000, 1) · 그림자 rgba(255, 255, 255, 0.14) 0px 1px 0px 0px · 아래 선 없음 · 흐림 none
    - 연 대화상자: 「Search Doc」 판 #0a0a0a 둘레 none 그림자 rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0 · 가림막 없음
    - 갈래별 z-index 최댓값(규칙): modal 9999 · menu 1000
- 왓챠 (`watcha`, 국내) · 주소 https://pedia.watcha.com/ko-KR · 쪽 바탕 #000000 · 캡처 `shots2/watcha-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 선(box-shadow 0 1px 0 검정 8%, 다크에서 안 보임). 계산값 header._header_jeexp_1 fixed · 면 #000000(쪽 #000000, 1) · 그림자 rgba(0, 0, 0, 0.08) 0px 1px 0px 0px · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): dim 8 · menu 100
- GitLab (`gitlab`, 해외) · 주소 https://docs.gitlab.com/user/project/issues/ · 쪽 바탕 #18171d · 캡처 `shots2/gitlab-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 선(캡처, 스크롤 안 됨). 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 9998 · dim 1040 · modal 2201 · header 850 · toast 1100
- MDN (`mdn`, 해외) · 주소 https://developer.mozilla.org/en-US/docs/Web/CSS/color · 쪽 바탕 #18191b · 캡처 `shots2/mdn-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 선(캡처). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 1000 · header 1
- 토스증권 (`toss`, 국내) · 주소 https://www.tossinvest.com/ · 쪽 바탕 #17171c · 캡처 `shots2/toss-scrolled.jpg`
    - 붙은 것: 면 #101013 + 1px 선(스크롤 안 됨). 계산값 div.t647dy3 static · 면 #101013(쪽 #17171c, 1.06) · 그림자 없음 · 아래 선 1px #c3c3c6 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): modal 10006 · menu 10006 · dim 10005
- Linear (`linear`, 해외) · 주소 https://linear.app/changelog · 쪽 바탕 #08090a · 캡처 `shots2/linear-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 흰 8% 선 + 흐림 20px. 계산값 header.TZTsQG_header fixed · 면 None(쪽 #08090a, 1) · 그림자 없음 · 아래 선 1px #ffffff/8 · 흐림 blur(20px)
    - 연 대화상자: 「Search…」 판 #0f1011 둘레 1px #ffffff/5 그림자 rgba(0, 0, 0, 0.1) 0px 4px 40px 0px, rgb · 가림막 #000000/85
    - 갈래별 z-index 최댓값(규칙): dim 2 · menu -1 · header 1 · toast 1
- Raycast (`raycast`, 해외) · 주소 https://www.raycast.com/store · 쪽 바탕 #07080a · 캡처 `shots2/raycast-scrolled.jpg`
    - 붙은 것: 같은 면 + 1px 흰 6% 선 + 흐림 5px. 계산값 div.pSp8Ga_container fixed · 면 None(쪽 #07080a, 1) · 그림자 없음 · 아래 선 1px #ffffff/6 · 흐림 blur(5px)
    - 연 대화상자: 「Search...」 판 못 잡음 · 가림막 #000000/80
    - 갈래별 z-index 최댓값(규칙): modal 10 · dim 105 · header 2 · menu 10 · toast 2
- Spotify (`spotify`, 해외) · 주소 https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF · 쪽 바탕 #121212 · 캡처 `shots2/spotify-scrolled.jpg`
    - 붙은 것: 다른 면 #000(쪽 #121212). 계산값 div.EmXZMILXH0bP7U461Va6 relative · 면 #000000(쪽 #121212, 1.12) · 그림자 없음 · 아래 선 없음 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): modal 104 · dim 1040 · menu 1051 · header 1030 · toast 101
- osu! (`osu`, 해외) · 주소 https://osu.ppy.sh/rankings/osu/performance · 쪽 바탕 #171c17 · 캡처 `shots2/osu-scrolled.jpg`
    - 붙은 것: 다른 면(브랜드 초록 띠). 계산값 div.js-pinned-header fixed · 면 #131313(쪽 #171c17, 1.08) · 그림자 없음 · 아래 선 1px #73ff66 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): modal 1600 · menu 1060 · dim 9998 · header 1030 · toast 1
- Steam (`steam`, 해외) · 주소 https://store.steampowered.com/charts/mostplayed · 쪽 바탕 #0f1924 · 캡처 `shots2/steam-scrolled.jpg`
    - 붙은 것: 다른 면(파랑 띠, 캡처). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 1600 · modal 1
- 아이온2(엔씨) (`aion2`, 국내) · 주소 https://aion2.plaync.com/ko-kr/board/notice/list · 쪽 바탕 #171717 · 캡처 `shots2/aion2-scrolled.jpg`
    - 붙은 것: 다른 면(캡처). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): dim 9900025 · menu 9100023 · header 9100030 · modal 9100013 · toast 20
- 블레이드앤소울 (`bns`, 국내) · 주소 https://bns.plaync.com/ · 쪽 바탕 #ebebeb · 캡처 `shots2/bns-scrolled.jpg`
    - 붙은 것: 다른 면(캡처). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): toast 20 · modal 9999999 · dim 9900025 · menu 9100023 · header 9100030
- 에픽세븐 (`epic7`, 국내) · 주소 https://epic7.onstove.com/ko · 쪽 바탕 #ffffff · 캡처 `shots2/epic7-scrolled.jpg`
    - 붙은 것: 다른 면 #000 띠(캡처). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): header 2500 · menu 100 · dim 10000 · modal 10000 · toast -1000
- 던전앤파이터 (`dnf`, 국내) · 주소 https://df.nexon.com/ · 쪽 바탕 #03070b · 캡처 `shots2/dnf-scrolled.jpg`
    - 붙은 것: 다른 면 #3f4554 + 1px 선 #1d2127. 계산값 div.login_bar fixed · 면 #3f4554(쪽 #03070b, 2.11) · 그림자 없음 · 아래 선 1px #1d2127 · 흐림 none
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 900 · header 900
- 다음 (`daum`, 국내) · 주소 https://news.daum.net/ · 쪽 바탕 #131416 · 캡처 `shots2/daum-scrolled.jpg`
    - 붙은 것: 다른 면 #1c1e21 + 그림자 흰 8% 0 6px 12px(1차 기록). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): dim 10000 · menu 30 · header 999 · toast 10000
- Twitch (`twitch`, 해외) · 주소 https://www.twitch.tv/directory · 쪽 바탕 #0e0e10 · 캡처 `shots2/twitch-scrolled.jpg`
    - 붙은 것: 다른 면 #18181b + 그림자 0 1px 2px 검정 90%. 계산값 div.Layout-sc-1xcs6mc-0 relative · 면 #451093(쪽 #0e0e10, 1.61) · 그림자 rgba(0, 0, 0, 0.9) 0px 1px 2px 0px, rgba(0, 0, 0, 0.9) 0px 0px 2px 0px · 아래 선 없음 · 흐림 none
    - 연 대화상자: 「로그인」 판 #18181b 둘레 none 그림자 none · 가림막 #000000/85
    - 갈래별 z-index 최댓값(규칙): toast 5010 · modal 5000 · dim 5001 · menu 10 · header 20
- DAK.GG (`dakgg`, 국내) · 주소 https://dak.gg/ · 쪽 바탕 #161618 · 캡처 `shots2/dakgg-scrolled.jpg`
    - 붙은 것: 붙지 않음(스크롤하면 사라짐). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): header 10 · menu 1100
- 나무위키 (`namuwiki`, 국내) · 주소 https://namu.wiki/w/%EB%A6%AC%EB%93%AC%20%EA%B2%8C%EC%9E%84 · 쪽 바탕 #000000 · 캡처 `shots2/namuwiki-scrolled.jpg`
    - 붙은 것: 붙지 않음. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 10000
- Disney+ (`disneyplus`, 해외) · 주소 https://www.disneyplus.com/ko-kr · 쪽 바탕 #040714 · 캡처 `shots2/disneyplus-scrolled.jpg`
    - 붙은 것: 붙지 않음. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): header 45 · modal 50 · toast 101 · menu 100 · dim 9999
- GitHub (`github`, 해외) · 주소 https://github.com/facebook/react/issues · 쪽 바탕 #0d1117 · 캡처 `shots2/github-scrolled.jpg`
    - 붙은 것: 붙지 않음(이슈 쪽). 스크롤 뒤 자리를 떠남
    - 연 대화상자: 「Search or 」 판 #010409 둘레 none 그림자 rgb(61, 68, 77) 0px 0px 0px 1px, rgba(1, · 가림막 #212830/40
    - 갈래별 z-index 최댓값(규칙): dim 9999 · header 9998 · menu 9998 · modal 999 · toast 999
- Hugging Face (`huggingface`, 해외) · 주소 https://huggingface.co/models · 쪽 바탕 #0b0f19 · 캡처 `shots2/huggingface-scrolled.jpg`
    - 붙은 것: 붙지 않음. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 「Search mod」 판 #0b0f19 둘레 1px oklab(0.278 -0.00750866 -0.0321344 / 0.6) 그림자 rgba(0, 0, 0, 0.04) 0px 10px 20px 0px, r · 가림막 없음
    - 갈래별 z-index 최댓값(규칙): header 1
- Apple Music (`apple-music`, 해외) · 주소 https://music.apple.com/kr/browse · 쪽 바탕 #1f1f1f · 캡처 `shots2/apple-music-scrolled.jpg`
    - 붙은 것: 왼쪽 레일 구조라 맨 위 띠 없음. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 「로그인」 판 #1d1d1f 둘레 none 그림자 rgba(0, 0, 0, 0.2) 0px 10px 10px 0px · 가림막 #000000/48
    - 갈래별 z-index 최댓값(규칙): modal 1 · dim 4 · menu 1000 · header 4
- Chess.com (`chesscom`, 해외) · 주소 https://www.chess.com/leaderboard/live · 쪽 바탕 #302e2b · 캡처 `shots2/chesscom-scrolled.jpg`
    - 붙은 것: 왼쪽 레일 구조. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): menu 10000 · modal 10 · dim 9999
- Mastodon (`mastodon`, 해외) · 주소 https://mastodon.social/explore · 쪽 바탕 #07060e · 캡처 `shots2/mastodon-scrolled.jpg`
    - 붙은 것: 왼쪽 레일 구조. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): header 10 · menu 9999 · dim 1 · modal 9999 · toast 9999
- Lichess (`lichess`, 해외) · 주소 https://lichess.org/player · 쪽 바탕 #000000 · 캡처 `shots2/lichess-scrolled.jpg`
    - 붙은 것: 스크롤 안 됨. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): 없음
- Epic Games Store (`epic`, 해외) · 주소 https://store.epicgames.com/ko/browse · 쪽 바탕 #101014 · 캡처 `shots2/epic-scrolled.jpg`
    - 붙은 것: 빈 화면. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): 없음
- Letterboxd (`letterboxd`, 해외) · 주소 https://letterboxd.com/films/popular/ · 쪽 바탕 #14181c · 캡처 `shots2/letterboxd-scrolled.jpg`
    - 붙은 것: 빈 화면. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): dim 9999 · menu 99999 · header 1240 · toast 2
- Reddit (`reddit`, 해외) · 주소 https://www.reddit.com/r/programming/ · 쪽 바탕 #121213 · 캡처 `shots2/reddit-scrolled.jpg`
    - 붙은 것: 봇 확인 화면. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): 없음
- 웨이브 (`wavve`, 국내) · 주소 https://www.wavve.com/ · 쪽 바탕 #1b1b1b · 캡처 `shots2/wavve-scrolled.jpg`
    - 붙은 것: 첫 화면 팝업. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): toast 3000 · modal 10001 · menu 1000 · header 10000 · dim 0
- 네이버페이 (`naver-pay`, 국내) · 주소 https://pay.naver.com/ · 쪽 바탕 #1f1f1f · 캡처 `shots2/naver-pay-scrolled.jpg`
    - 붙은 것: 로그인 쪽. 스크롤 뒤 자리를 떠남
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): dim 110
- FC 온라인 (`fconline`, 국내) · 주소 https://fconline.nexon.com/main/index · 쪽 바탕 #ffffff · 캡처 `shots2/fconline-scrolled.jpg`
    - 붙은 것: 팝업. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): dim 100 · toast -1000 · header 9999999 · menu 2000 · modal 60003
- 넥슨 (`nexon`, 국내) · 주소 https://www.nexon.com/ · 쪽 바탕 #ffffff · 캡처 `shots2/nexon-scrolled.jpg`
    - 붙은 것: 팝업. 띠를 못 잡음
    - 연 대화상자: 없음
    - 갈래별 z-index 최댓값(규칙): toast 45 · header 9999999 · dim 1001 · menu 2300 · modal 2201
