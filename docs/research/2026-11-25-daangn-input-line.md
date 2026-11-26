# 당근 입력칸 둘레 실측 — 당근 웹 · SEED 문서 · 앱 스크린샷 (2026-11-25)

방법: headless Playwright(Chromium), `colorScheme: dark`, ko-KR, 1440×900(상태 캡처는 2배), 권한 없음, 로그인 · 입력 · 제출 없음. 요소의 `getComputedStyle`(border · outline · box-shadow · background-color, `::after`)과 바로 뒤 바탕색을 읽고, 잘라 찍은 캡처를 열어 픽셀(canvas `getImageData`)로 값과 맞는지 확인했다. SEED 토큰 값 color-stroke-neutral-weak #393d46 은 비교용이고 근거로 세지 않았다. 캡처 · 원자료(`caps/` · `raw/`)는 세션 공유 폴더 `…/values/board-base/game/input-line-measure/` 에 있고 커밋하지 않는다. 사실만 적고 추천은 쓰지 않는다. 대비는 WCAG 2 비, #000000 · #16171b · #2b2e35 위(요청 기준 #16171b · #2b2e35, #000 은 당근 바탕이라 덧붙임).

## 결과 요약

- 당근 웹(daangn.com) 다크: 입력칸 선은 `box-shadow: 0 0 0 1px #393d46 inset` 단색(알파 아님). 면은 칠하지 않고(transparent) 바로 뒤 카드 면 #16171b 이 그대로 보인다. 구조는 「선만」(면 위 선 1px).
- #393d46 은 토큰 문서의 값과 같다. 당근 웹에서 입력칸 선이 흐린 정도는 #16171b 위 1.65 · #2b2e35 위 1.25.
- 포커스: 선은 그대로 두고 `::after` 에 2px 실선 #f3f4f5(안쪽 모서리, 둘레). hover 는 변화 없음.
- 헤더 검색칸은 다른 꼴: 선 없는 면 #1d2025(바탕 #000 위 1.29) + `0 1px 4px rgba(0,0,0,.5)` 그림자, 포커스는 2px #f3f4f5 링(box-shadow 바깥 번짐).
- SEED 문서 사이트 다크의 입력칸은 같은 구조(선만, inset 1px)인데 색이 알파 `rgba(208,222,255,.275)` 라서 #16171b 면 위에서 #494e5a(캡처 픽셀 #484d59)로 더 밝다. #000 위에서는 정확히 #393d46. 즉 당근 웹은 알파를 #000 위 값 #393d46 으로 굳힌 단색을 쓴다.
- 앱 스크린샷(앱스토어 홍보 이미지, 라이트): 검색칸은 면 #f3f4f5(부동산) 또는 흰 면 + 그림자(동네지도), 둘레 선 없음. 칩 둘레 1px 연회색. 다크 앱 화면은 공개 이미지에 없음(미확인).

## 1. 당근 웹 daangn.com (https://www.daangn.com/kr/)

확인 2026-11-25 03:35 KST · prefers-color-scheme: dark 일 때 body `#000000`, `color-scheme: light dark`(시스템 설정을 따름, 라이트도 열림) · 캡처 `caps/daangn-home-dark.png` · 원자료 `raw/daangn-home-dark.json` · `raw/daangn-seed-input-dark-states.json`

### 1-1. 「누구 탐지」 입력칸(생활서비스 견적 카드 안)

선택자 `.seed-text-input__root`(자식 `input.seed-text-input__value`). 크기 328×40, 모서리 8px. 캡처 `caps/daangn-seed-input-dark-{default,hover,focus-programmatic,focus-keyboard}.png`.

| 상태          | 선(root box-shadow)             | `::after`(2px 실선 둘레)       | 면(background)           | 바로 뒤 바탕  |
| ------------- | ------------------------------- | ------------------------------ | ------------------------ | ------------- |
| 기본          | `0 0 0 1px inset` rgb(57,61,70) | border-color 투명(rgba 0)      | transparent(칠하지 않음) | rgb(22,23,27) |
| 올림(hover)   | 같음                            | 같음(변화 없음)                | 같음                     | 같음          |
| 포커스        | 같음(그대로)                    | border-color rgb(243,244,245)  | 같음                     | 같음          |
| 오류 · 비활성 | 이 화면에 없음                  | 미확인(SEED 문서에서는 아래 2) | 미확인                   |               |

픽셀 확인(캡처 2배, 704×128): 기본 상단선 y=24–25 = `#393d46`, 내부 = `#16171b`; 포커스 상단선 y=24–27 = `#f3f4f5`(2px), 안쪽 = `#16171b`. 캡처를 직접 열어 둥근 선 1px 어두운 회색 + 돋보기 아이콘 입력칸임을 확인.

대비: 선 #393d46 → #000 위 1.93 · #16171b 위 1.65 · #2b2e35 위 1.25. 포커스 #f3f4f5 → 19.07 · 16.26 · 12.34.

### 1-2. 헤더 검색칸(「검색어를 입력하세요」)

선택자 `form:has(input[type=search])`(알약, 526×24 입력을 600×57 form 이 감쌈). 캡처 `caps/daangn-search-dark-*.png`.

| 상태   | form box-shadow                                          | 면            | 바탕       |
| ------ | -------------------------------------------------------- | ------------- | ---------- |
| 기본   | `rgba(0,0,0,.5) 0 1px 4px 0`                             | rgb(29,32,37) | rgb(0,0,0) |
| 올림   | 같음                                                     | 같음          | 같음       |
| 포커스 | `rgb(243,244,245) 0 0 0 2px`, `rgba(0,0,0,.5) 0 1px 4px` | 같음          | 같음       |

테두리 · outline 0. 픽셀: 면 `#1d2025`, 기본 상단 바깥 `#000000`, 포커스 링 y=20–23 = `#f3f4f5`. 면 #1d2025 와 바탕 #000 의 대비 1.29. 구조는 「면 + 그림자」(선 없음).

### 1-3. 하단 언어 `select`

쓰는 래퍼 `border: 1px solid rgb(57,61,70)`(`#393d46`), 안쪽 select 면 rgb(59,59,59)(브라우저 기본). 캡처 `caps/daangn-select-dark.png`(전체 화면). 같은 선 색.

### 1-4. 라이트(참고, 같은 쪽 `colorScheme: light`)

body rgb(243,244,245). 「누구 탐지」 입력칸 `0 0 0 1px inset rgb(220,222,227)`(`#dcdee3`), 면 없음. 검색칸 면 흰색 + `rgba(0,0,0,.08) 0 1px 4px`. 원자료 `raw/daangn-home-light.json`.

## 2. SEED 공식 문서 (https://seed-design.io/react/components/…)

확인 2026-11-25 03:38 KST. 다크 전환: 사이트가 시스템 설정을 따라 `colorScheme: dark` 만으로 다크(body rgb(23,23,23), `color-scheme: dark`). 예시 칸 바탕은 카드 rgb(22,23,27). TextField 쪽 주소는 `text-field-input`(text-field 는 404).

### 2-1. TextField 입력(text-field-input) · 캡처 `caps/seed-docs-textinput-dark-*.png`, `caps/seed-textfield-dark.png` · 원자료 `raw/seed-docs-textinput-dark-states.json`

선택자 `.seed-text-input__root--variant_outline` + `input.seed-text-input__value`. 모서리 12px(large, 높이 52).

| 상태               | 선(box-shadow)                            | `::after` 2px              | 면(root bg)                                  |
| ------------------ | ----------------------------------------- | -------------------------- | -------------------------------------------- |
| 기본               | `rgba(208,222,255,.275) 0 0 0 1px inset`  | 투명                       | transparent                                  |
| 올림               | 같음                                      | 같음(변화 없음)            | 같음                                         |
| 포커스             | 같음                                      | rgb(243,244,245) `#f3f4f5` | 같음                                         |
| 오류(aria-invalid) | 같음                                      | rgb(255,110,96) `#ff6e60`  | 같음                                         |
| 비활성(disabled)   | 같음                                      | 투명(오류면 `#ff6e60`)     | rgb(43,46,53) `#2b2e35`, 글자 rgb(91,96,106) |
| 읽기 전용          | 같음                                      | 투명                       | rgb(43,46,53)                                |
| underline 변형     | `rgba(208,222,255,.275) 0 -1px 0 0 inset` | 없음(0px)                  | transparent                                  |

픽셀: 기본 상단선 = `#484d59`(면 #16171b 위 알파 합성, 계산 #494e5a), 포커스 상단 = `#f3f4f5` 2px. 같은 알파를 #000 위에 합성하면 `#393d46`, #2b2e35 위에서는 `#585e6d`.

대비(합성한 선 색): #494e5a → #000 2.52 · #16171b 2.15 · #2b2e35 1.63(바탕 위 대신 면 #16171b 위 2.15). 비활성 면 #2b2e35 → #16171b 위 1.32.

### 2-2. Checkbox · Radio(checkbox · radio-group) · 캡처 `caps/seed-docs-checkbox-dark.png` · `caps/seed-docs-radio-dark.png`

| 부품 · 상태                 | 선                                         | 면                                | 모서리 · 크기 |
| --------------------------- | ------------------------------------------ | --------------------------------- | ------------- |
| Checkbox 꺼짐               | `border: 1px solid rgba(208,222,255,.275)` | transparent                       | 4px · 24      |
| Checkbox 켜짐(neutral)      | 없음(0)                                    | rgb(243,244,245) + 흰 체크        | 4px · 24      |
| Checkbox 켜짐(brand)        | 없음                                       | rgb(255,102,0)                    | 4px · 24      |
| Checkbox 비활성(꺼짐/켜짐)  | 꺼짐은 같은 1px 알파 선, 켜짐은 없음       | rgb(43,46,53) `#2b2e35`           | 4px · 24      |
| Radio 꺼짐                  | `border: 1px solid rgba(208,222,255,.275)` | transparent                       | 둥근 · 24/20  |
| Radio 켜짐(neutral · brand) | 없음                                       | rgb(243,244,245) · rgb(255,102,0) | 둥근 · 24/20  |
| Radio 비활성                | 같은 1px 알파 선                           | rgb(43,46,53)                     | 둥근 · 24     |

원자료 `raw/seed-docs-checkbox-dark.json` · `raw/seed-docs-radio-dark.json`. 꺼진 칸은 「선만」, 켜진 칸은 선 없이 면으로 바뀌며, 비활성은 면 #2b2e35 + 선.

## 3. 앱 공개 스크린샷(앱스토어 KR, 앱 26.47.0)

주소: `https://itunes.apple.com/lookup?id=1018769995&country=kr` 의 `screenshotUrls` 8장(1242×2208, `.../1242x2208bb.png`로 받음). 확인 2026-11-25 03:41 KST. 캡처 `caps/appstore-daangn-1..8.png`. 모두 라이트 홍보 이미지이며 다크 앱 화면은 없음(미확인). 열어 본 것: 1 · 4 · 6.

- 4번(동네지도 검색칸 「근처 업체 찾기」): 알약 면 `#ffffff`, 둘레 선 없음, 가장자리 바깥으로 그림자(x=216 `#f3f1f0` → x=228 `#e5e2df` → x=229 `#ffffff`, 위 y=744 `#e9e6e3`). 구조 면 + 그림자.
- 6번(당근부동산 검색칸 「강남구 근처」, 좌표 x230–860 · y840–930): 면 `#f3f4f5`, 선 없음(x=228 `#ffffff` → x=230 `#f3f4f5`). 같은 이미지의 칩(「매물 종류」 등) 둘레는 1px 연회색(약 `#efefef`, 축소로 번짐), 면 `#ffffff`.
- 입력칸에 선만 있는 꼴(웹의 「누구 탐지」와 같은)은 이 8장에서 못 찾음.

## 판정

- 구조: 당근 웹 텍스트 입력은 「선만」(면 없음, 카드 면이 비침, 선 1px #393d46 inset). 검색칸은 「면 + 그림자」(선 없음). 「면을 깔고 선을 흐리게 덧대는」 꼴은 웹 입력에서 못 봤다. 면을 칠하는 것은 비활성 · 읽기 전용(#2b2e35, SEED 문서)뿐.
- 토큰 `#393d46` 과 같은가: 당근 웹 입력칸 선은 같다(단색 rgb(57,61,70)). SEED 문서 사이트는 알파 .275 라서 #16171b 면 위에서 #494e5a 로 달라 보인다.
- 한계: 오류 · 비활성 상태는 당근 웹 공개 화면에 없어 SEED 문서 값으로만 적었다. 당근 앱의 실제 다크 입력칸은 미확인.

## 4. 부품별 둘레 추가 실측 · 레시피 (2026-11-26)

방법은 위와 같다(headless Playwright, `colorScheme: dark`, ko-KR, 1440×900, 로그인 · 입력 · 제출 없음). 당근 웹 홈 · 중고거래 · 알바 · 부동산 화면의 요소 전부에서 border · outline · box-shadow 가 있는 것을 모아 값으로 읽고, 잘라 찍은 캡처를 열어 맞춰 봤다. SEED 레시피는 `@seed-design/css` 3.4.1 의 `recipes/*.css`(다크 그림자 토큰 s1 `0 1px 4px #00000080` · s3 `0 4px 16px #000c`). 캡처 · 원자료는 세션 공유 폴더(`stage4/D/line-caps/`)에 있다.

| 부품                                  | 당근 웹 실측(다크)                                                                                                                                                                                                                      | SEED 레시피                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 칩(알바 · 부동산)                     | `label.seed-chip__root--variant_outlineStrong · outlineWeak`, 36 · 모서리 full · `inset 0 0 0 1px rgba(255,255,255,.09)` · 면 transparent · 올림 면 `rgba(255,255,255,.05)` · 고른 면 `rgba(240,240,243,.086)`(선 그대로, 글자 #f3f4f5) | `chip.css:104`(outlineStrong 선), `:58`(solid 는 선 없음, 고른 칸 solid 면)        |
| 선 없는 칩 · 필터 열기 단추(중고거래) | `a/button.seed-action-button` 면 #2b2e35 또는 #1d2025 · 선 없음 · 모서리 full 또는 8 · 필터 36                                                                                                                                          | `action-button.css` neutralWeak(선 없음)                                           |
| 검은 알약 탭 줄(중고거래)             | `nav` 면 #16171b · `0 1px 1px rgba(0,0,0,.05)` · 선 없음 · 고른 탭 면 #f3f4f5                                                                                                                                                           | `chip-tabs.css:84-88`                                                              |
| 외곽선 버튼(부동산 로그인)            | `1px solid rgba(255,255,255,.09)` · 면 transparent · 모서리 8                                                                                                                                                                           | `action-button.css:194-197`(brandOutline · neutralOutline 1px stroke-neutral-weak) |
| 체크 꺼짐(알바)                       | 20×20 · 모서리 4 · `1px solid #393d46` · 면 없음                                                                                                                                                                                        | `checkmark.css:29-31` · 켜짐은 선 없음(`:34`)                                      |
| 셀렉트 래퍼(하단 언어)                | `1px solid #393d46` · 모서리 8 · 높이 40                                                                                                                                                                                                | `select-trigger.css:13`(`inset 0 0 0 1px stroke-neutral-weak`), 오류 2px           |
| 카드(홈 · 중고거래)                   | 면 #16171b · `0 1px 1px rgba(0,0,0,.05)` · 선 없음 · 모서리 16 · 카드 밑 「더보기」 줄 위쪽만 `1px rgba(255,255,255,.05)`                                                                                                               | 카드 레시피 없음                                                                   |
| 원형 쪽 번호 · 아이콘 버튼(중고거래)  | 32×32 · 면 #2b2e35 또는 카드 면 + `0 1px 1px rgba(0,0,0,.05)` · 선 없음                                                                                                                                                                 | `pagination-page-item.css` border none                                             |
| 목록 썸네일 틀(부동산)                | `1px solid rgba(255,255,255,.05)` · 모서리 8                                                                                                                                                                                            | —                                                                                  |
| 옆 메뉴 가름선(부동산)                | 오른쪽만 `1px rgba(255,255,255,.09)`                                                                                                                                                                                                    | —                                                                                  |
| 지도 컨트롤(부동산)                   | `1px solid #393d46` · 모서리 6 · 면 #16171b                                                                                                                                                                                             | —                                                                                  |

레시피 쪽(웹에서 안 열린 부품): 스테퍼 `quantity-picker.css:7` 뭉치 `inset 0 0 0 1px stroke-neutral-weak` · 첨부 칸 `attachment-input-trigger.css:13` 같은 선 · 라디오 `radiomark.css:9-10` 1px stroke-neutral-weak, 켜짐 선 없음 · 고르는 칸 `segmented-control.css:1-25` 그릇 면 neutral-weak-alpha 선 없음, 고른 알약만 `inset 0 0 0 1px stroke-neutral-muted` · 탭 `tabs.css:21-23` 줄 아래 `inset 0 -1px stroke-neutral-muted` · 고른 탭 `:56` 2px 아래줄 · 배지 `badge.css:107-108` outline 변형만 1px, 기본은 면 · 메뉴 `menu.css:8-9` · 팝오버 `popover.css:12-14` 면 layer-floating + 그림자 s3, 선 없음 · 대화상자 `alert-dialog.css:32` · `dialog.css:51` 면 floating, 선 · 그림자 없음(바닥 줄에만 안쪽 위 선 `dialog.css:143`) · 토스트 `snackbar.css:7` 반전 면, 선 · 그림자 없음.

한계: 칩 고른 상태는 알바 화면에서 한 번 눌러 읽었고(글을 보내지 않는 필터 칩), 중고거래 카드 · 쪽 번호의 올림 · 눌림은 안 잼. 라이트 · 앱 다크는 미확인.
