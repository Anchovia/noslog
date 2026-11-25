# 밝은 테마 둘 곳 — 정보 · 기록 · 랭킹 · 게임 서비스 43곳 · 디자인 시스템 10곳 실측

2026-11-24. 공통 층 3단계 색 파운데이션의 「밝은 테마를 어떻게 둘지」 판 재료다. 지금 NosLog 는 다크만 켜져 있고 밝은 값 64/103 은 shadcn 기본 값만 있다. 여기에는 잰 값과 곳 수만 둔다. 추천 · 판단은 적지 않았다.

## 재는 법

- headless Playwright 1.61.1(Chromium), 1440×900, `locale: ko-KR`, `permissions: []`, 로그인 없음. 같은 주소를 `colorScheme: 'dark'` 와 `'light'` 로 한 번씩 열고(2 × 68쪽), 열기 전마다 `~/noslog-research/wait-capacity.sh`, 브라우저 하나에 페이지 하나. 첫 화면에서 3.5초 기다린 뒤 읽었다.
- 읽은 것: html `color-scheme` 계산값 · `meta color-scheme` · `meta theme-color` · 화면 중앙 요소의 바탕 · 3배 높이 안 보이는 요소의 채도 높은 색(글자 · 면 · 테두리 상위 6개) · 전환 자리 후보(aria-label · 클래스 · 글자에 다크 · 라이트 · 테마 · 외관 · theme 가 든 요소와 그 위치).
- 판정은 화면 밝기(캡처 평균 0–255)와 캡처 육안으로 했다. 두 선호에서 바탕이 크게 다르면 「시스템 따름」, 둘 다 같으면 「고정」. 캡처는 86장 전부 격자판(`sheet0.png` · `sheet1.png` · `sheet2.png`)으로 열어 대조했다. 개별 캡처를 하나씩 확대해 본 것은 아니다.
- 전환 자리는 첫 화면 DOM에서 찾은 것만 적었다. 메뉴 · 설정 안에 숨은 전환 자리는 열지 않았다(「첫 화면에 없음(미확인)」). 로그인 뒤 설정은 보지 않았다.
- 이미 센 것: [지도 핀 색](./2026-11-20-color-map-pin.md)의 지도 서비스 36곳(국내 20 · 해외 16)이 같은 방식으로 사이트 다크를 따르는지 쟀다. 국내 20곳 중 19곳은 라이트만, 1곳(뮤즈캣)만 시스템 다크를 따랐다. 지도 서비스라 이 물음의 표본(정보 · 기록 · 랭킹 · 게임)과 달라 아래 센 수에 넣지 않았다. [다크 서비스 값 한 벌](./2026-11-12-dark-service-sets.md) 81곳은 다크 테마를 공식으로 내놓은 서비스만 모은 표본이라 라이트만 · 다크 고정 비율을 세는 데 쓸 수 없고, 수에 넣지 않았다.
- 캡처 · 원자료: 공유 메모 폴더 `common-layer/stage3/color/rules5/r5-light-theme/`(`caps/<이름>-dark.jpg` · `<이름>-light.jpg`, `results.json`, `ds-results.json`). 커밋하지 않는다.

## 센 곳(실제 서비스)

68곳을 열어 43곳을 판정했고 25곳은 막혀서 세지 않았다. 국내 22곳 · 해외 21곳.

| 꼴                        | 뜻                                                                                 | 국내 | 해외 | 합  |
| ------------------------- | ---------------------------------------------------------------------------------- | ---- | ---- | --- |
| ① 다크만                  | 두 선호 모두 다크, 라이트 값 없음                                                  | 2    | 8    | 10  |
| ② 라이트만                | 두 선호 모두 라이트, 전환 자리 첫 화면에 없음(미확인)                              | 10   | 5    | 15  |
| ③ 라이트 기본 + 전환 자리 | 두 선호 모두 라이트로 열리고 첫 화면에 다크 전환 자리가 있음(시스템은 따르지 않음) | 6    | 2    | 8   |
| ④ 시스템 따름             | 선호에 따라 바탕이 바뀜                                                            | 4    | 6    | 10  |

- ②와 ③은 첫 화면 DOM에서 전환 자리를 찾았는지만 다르다. ②에도 메뉴 안에 전환이 있을 수 있다.
- ③ 가운데 전환을 켜면 시스템 선호를 따르는 선택지가 있는지는 열어 보지 않아 미확인이다.
- 기본값(처음 열었을 때): ①은 다크 10곳, ②와 ③은 라이트 23곳, ④는 시스템 10곳.
- 도메인별: 리듬게임 기록 7곳은 다크만 3(osu! · Quaver · BeatSaver), 시스템 따름 2(ScoreSaber · sekai.best), 라이트 기본 + 전환 1(V-ARCHIVE), 라이트만 1(chunirec). 게임 전적 · 공식 랭킹 국내 5곳은 다크만 2(DAK.GG · DEEP LOL), 라이트 기본 + 전환 1(던담), 라이트만 2(FOW.KR · 메이플스토리 랭킹). 시세 · 스포츠 · 차트 국내(네이버 증권 · 네이버 스포츠 · 멜론 · 지니)는 라이트 기본 + 전환 1(네이버 증권), 라이트만 3.
- 근거 약함: 국내 ①은 2곳뿐, 해외 ③은 2곳뿐이다.

## 밝은 테마에서 게임 색 · 상태색 · 강조색이 바뀌는지(실측)

④ 시스템 따름 10곳 가운데 채도 높은 색 표본이 잡힌 8곳의 다크 → 라이트 값이다. 표본은 화면 첫 3배 높이의 글자 · 면 · 테두리라 게임 등급 색을 따로 가린 것이 아니다. 왓챠피디아 · MDN은 표본 0이라 미확인.

| 서비스                    | 바뀌는 색                                                                                                      | 그대로인 색                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Sofascore                 | 초록 `#39b57a` → `#15b168`, 빨강 `#e73b3b` → `#cb1818`, 주황 `#e35c47` → `#c7361f`, 강조 `#7a84ff` → `#374df5` | 없음(모두 바뀜)                                                     |
| FotMob                    | 초록 `#61df6e` → `#00985f`                                                                                     | 없음                                                                |
| 당근                      | 경고 `#ff6e60` → `#fa342c`                                                                                     | 브랜드 `#ff6600`                                                    |
| 나무위키                  | 링크 · 강조 `#ec9f19` → `#0275d8`                                                                              | 초록 `#009900` · 빨강 `#ff0000`                                     |
| Twitch                    | 보라 `#bf94ff` → `#5c16c5`                                                                                     | 빨강 `#eb0400` · 분홍 `#ff75e6`                                     |
| sekai.best                | 보조 `#29b6f6` → `#0288d1`                                                                                     | 주색 `#298a7b` · `#f50057`                                          |
| 다음                      | 보라 `#b078ff` → `#9148f7`                                                                                     | 주색 `#ff4e33` · 파랑 `#1e84ff` · 초록 `#00b56d`                    |
| ScoreSaber(리듬게임 기록) | 없음                                                                                                           | 노랑 `#facc15` · `#5048e5` · `#59b0f4` · `#ff6347` · `#bf2a42` 모두 |

- 상태색(초록 · 빨강 · 주황)은 3곳(Sofascore · FotMob · 당근 경고)이 라이트에서 다른 값으로 둔다. 브랜드색 · 일부 빨강은 5곳이 그대로 둔다. 리듬게임 기록 사이트로는 ScoreSaber 1곳뿐이라 「순위 · 등급 색을 라이트에서 그대로 두는지」는 근거 약함이다.
- 라이트 값을 갖는 ③ 8곳은 라이트 값만 열려 이 비교가 안 된다(다크 값 미확인).

## 디자인 시스템 10곳(공식 지침 · 토큰)

| 시스템          | 밝은 · 어두운 한 벌                                                                                                                                                                                                                                                                   | 다크 전용 허용                                                                                                           | 상태색 · 고정색                                                                                                                       | 출처                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 당근 SEED 3.2.1 | 색 토큰 227개가 밝은 블록과 어두운 블록 둘 다 있다. 팔레트 색(회색 21 · 색상 60) · 배너 10 · 매너온도 20은 값이 모두 다르고, 같은 값인 것은 70개(고정 흰 · 검 23 · 글자 22개 중 19 · 면 45개 중 14 · 선 16개 중 14, 대부분 팔레트 참조가 같은 것). 색 이름 하나가 두 모드 값을 가진다 | `data-seed-color-mode` 가 `system`(기본) · `light-only` · `dark-only` 세 값. 다크만 · 라이트만 모드를 공식 속성으로 지원 | 경고 글자 `red-700` 이 라이트 `#fa342c`, 다크 `#ff6e60`. 브랜드 글자는 라이트에서 `carrot-600`(`#f60`), 다크에서 `carrot-700` 을 참조 | `@seed-design/css@3.2.1/base.css` 439–470 · 583–812 · 813–1042행 |
| Material 3      | 역할마다 라이트 · 다크 두 값. 「고정(fixed)」 역할은 두 테마에서 같은 톤을 유지                                                                                                                                                                                                       | 다크 전용 허용 여부 문구 미확인                                                                                          | 오류 색은 동적 색에서도 정적이며 「라이트 · 다크 테마에 적응」                                                                        | m3.material.io/styles/color/roles                                |
| Primer(GitHub)  | 「라이트 · 다크 두 모드, 아홉 테마」. 기능 토큰은 모드에 따라 값이 자동으로 바뀜. 회색 눈금은 라이트 · 다크 두 벌이고 방향이 뒤집혀 있어 기능 토큰이 공유됨                                                                                                                           | 다크 전용 허용 문구 미확인                                                                                               | 기본 토큰은 모드를 따르지 않으니 쓰지 말라고 함                                                                                       | primer.style/product/getting-started/foundations/color-usage     |
| Radix Colors    | 색마다 밝은 눈금 · 어두운 눈금 한 벌. 어두운 눈금은 `.dark` 클래스에 적용                                                                                                                                                                                                             | 미확인                                                                                                                   | 앱 바탕을 모드마다 다른 눈금에 매핑하는 가변 별칭을 안내                                                                              | radix-ui.com/colors/docs/overview/usage · palette-composition    |
| Atlassian       | 「토큰 하나가 두 테마(라이트 · 다크)에서 다른 값」, 중립 눈금도 라이트용 · 다크용 두 벌                                                                                                                                                                                               | 미확인                                                                                                                   | 토큰을 쓰면 모드별 값을 직접 매핑할 필요 없음                                                                                         | atlassian.design/foundations/color                               |
| Spectrum(Adobe) | 배경 층을 라이트 · 다크에서 같은 위계로 번역하는 구조, 지원 테마마다 대비를 확인하라고 함                                                                                                                                                                                             | 미확인                                                                                                                   | 색 함수로 Spectrum 색을 바꾸지 말라고 함                                                                                              | spectrum.adobe.com/page/color-system                             |
| Carbon(IBM)     | 네 테마(White · Gray 10 · Gray 90 · Gray 100). 토큰 이름 · 역할은 테마가 바뀌어도 같고 값만 바뀜. 쌓임 규칙은 라이트 · 다크가 다름                                                                                                                                                    | 기본은 White, 다른 테마를 기본으로 설정하는 방법을 제공                                                                  | 역할은 테마 사이에 바뀌지 않는다고 명시                                                                                               | carbondesignsystem.com/building-blocks/foundations/themes        |
| Apple HIG       | 라이트 · 다크 · 자동 세 가지. 앱 전용 모양 설정은 피하라고 함                                                                                                                                                                                                                         | 「드물게 다크만 쓰는 것을 고려」(예: Stocks 앱은 다크만)                                                                 | 시스템 색은 라이트 · 다크 두 벌, 다크는 반전이 아님                                                                                   | developer.apple.com/design/human-interface-guidelines/dark-mode  |
| Fluent 2        | 모드마다 공유 팔레트 값이 이동                                                                                                                                                                                                                                                        | 미확인                                                                                                                   | 다크에서 공유 팔레트의 채도 · 밝기를 바꿔 눈 피로를 줄인다고 함                                                                       | fluent2.microsoft.design/color                                   |
| Ant Design      | 기본 알고리즘 · 다크 알고리즘 · 컴팩트 알고리즘을 ConfigProvider 에서 고름                                                                                                                                                                                                            | 미확인                                                                                                                   | 알고리즘이 색을 파생                                                                                                                  | ant.design/docs/react/customize-theme                            |

- 10곳 모두 밝은 · 어두운 값을 같은 역할 이름 아래 한 벌로 둔다. 다크만 · 라이트만을 문서에 명시한 곳은 2곳(SEED 모드 속성, Apple HIG 「드물게」)이다.
- 이름은 같고 값만 다른 방식이 공통이고, 팔레트 눈금 방향을 뒤집는 곳은 Primer · SEED(회색 눈금).
- 못 읽은 곳(세지 않음): GOV.UK(밝은 · 어두운 문구 없음), Salesforce Lightning(테마 가능 열만 있음), Shopify Polaris(본문 비어 있음), Toss TDS(본문 비어 있음), Chakra(404).

## 곳마다

꼴 번호는 위 표(① 다크만 · ② 라이트만 · ③ 라이트 기본 + 전환 자리 · ④ 시스템 따름). 화면 밝기는 캡처 평균(0 검정 · 255 흰색).

| 서비스                 | 구분 | 성격                           | 꼴  | 화면 밝기 다크 / 라이트(0–255) | 전환 자리                                                                           | 밝은 테마에서 색                                                                                               | 캡처                                                       |
| ---------------------- | ---- | ------------------------------ | --- | ------------------------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 당근                   | 국내 | 생활                           | ④   | 25 / 242                       | 첫 화면에 없음(미확인). html color-scheme `light dark`                              | 경고 `#ff6e60`(다크) → `#fa342c`(라이트), 브랜드 `#ff6600` 같음                                                | `caps/daangn-dark.jpg` · `caps/daangn-light.jpg`           |
| 다음                   | 국내 | 포털                           | ④   | 40 / 238                       | 헤더 아이콘 `sch_darkmode`                                                          | `#ff4e33` 같음, 보라 `#b078ff` → `#9148f7`                                                                     | `caps/daum-dark.jpg` · `caps/daum-light.jpg`               |
| 나무위키               | 국내 | 정보 위키                      | ④   | 34 / 232                       | 첫 화면에 없음(미확인). theme-color `#2e3033` → `#00a69c`                           | 링크 · 강조 `#ec9f19` → `#0275d8`, `#009900` · `#ff0000` 같음                                                  | `caps/namuwiki-dark.jpg` · `caps/namuwiki-light.jpg`       |
| 왓챠피디아             | 국내 | 정보 · 평점                    | ④   | 57 / 148                       | 첫 화면에 없음(미확인). 유채색 표본 0                                               | 미확인                                                                                                         | `caps/watchapedia-dark.jpg` · `caps/watchapedia-light.jpg` |
| DAK.GG                 | 국내 | 게임 전적                      | ①   | 45 / 52                        | 없음(html color-scheme dark)                                                        | 해당 없음                                                                                                      | `caps/dakgg-dark.jpg` · `caps/dakgg-light.jpg`             |
| DEEP LOL               | 국내 | 게임 전적                      | ①   | 40 / 40                        | 없음                                                                                | 해당 없음                                                                                                      | `caps/deeplol-dark.jpg` · `caps/deeplol-light.jpg`         |
| V-ARCHIVE              | 국내 | 리듬게임 기록(DJMAX)           | ③   | 229 / 229                      | 헤더 「다크모드 토글」                                                              | 라이트 값만 있어 해당 없음                                                                                     | `caps/v-archive-dark.jpg` · `caps/v-archive-light.jpg`     |
| 던담                   | 국내 | 게임 전적                      | ③   | 235 / 235                      | 헤더 `darkmode-button`, 말풍선 「라이트모드상태입니다. 클릭시 다크모드로 바뀝니다」 | 라이트 값만 있어 해당 없음                                                                                     | `caps/dundam-dark.jpg` · `caps/dundam-light.jpg`           |
| 클리앙                 | 국내 | 커뮤니티                       | ③   | 227 / 227                      | 헤더 「테마설정」                                                                   | 라이트 값만 있어 해당 없음                                                                                     | `caps/clien-dark.jpg` · `caps/clien-light.jpg`             |
| 네이버 증권            | 국내 | 시세 · 기록                    | ③   | 242 / 242                      | 헤더 「테마 모드 변경」                                                             | 해당 없음                                                                                                      | `caps/navfin-dark.jpg` · `caps/navfin-light.jpg`           |
| 루리웹                 | 국내 | 게임 커뮤니티                  | ③   | 158 / 192                      | 헤더 「다크 모드」                                                                  | 해당 없음                                                                                                      | `caps/ruliweb-dark.jpg` · `caps/ruliweb-light.jpg`         |
| 위키백과 한국어        | 국내 | 정보 위키                      | ③   | 246 / 246                      | 헤더 「외관」 메뉴                                                                  | 해당 없음                                                                                                      | `caps/kowiki-dark.jpg` · `caps/kowiki-light.jpg`           |
| 에펨코리아             | 국내 | 커뮤니티                       | ②   | 244 / 244                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/fmkorea-dark.jpg` · `caps/fmkorea-light.jpg`         |
| FOW.KR                 | 국내 | 게임 전적                      | ②   | 140 / 140                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/fowkr-dark.jpg` · `caps/fowkr-light.jpg`             |
| 지니 차트              | 국내 | 음악 차트                      | ②   | 243 / 242                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/genie-dark.jpg` · `caps/genie-light.jpg`             |
| 인벤                   | 국내 | 게임 커뮤니티                  | ②   | 144 / 147                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/inven-dark.jpg` · `caps/inven-light.jpg`             |
| 멜론 차트              | 국내 | 음악 차트                      | ②   | 250 / 250                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/melon-dark.jpg` · `caps/melon-light.jpg`             |
| 네이버                 | 국내 | 포털                           | ②   | 228 / 218                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/naver-dark.jpg` · `caps/naver-light.jpg`             |
| 네이버 스포츠          | 국내 | 스포츠 기록                    | ②   | 237 / 237                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/navsports-dark.jpg` · `caps/navsports-light.jpg`     |
| 네이버 웹툰            | 국내 | 콘텐츠                         | ②   | 182 / 180                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/navwebtoon-dark.jpg` · `caps/navwebtoon-light.jpg`   |
| 메이플스토리 공식 랭킹 | 국내 | 게임 공식 랭킹                 | ②   | 221 / 204                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/maple-rank-dark.jpg` · `caps/maple-rank-light.jpg`   |
| 토스(소개 쪽)          | 국내 | 금융                           | ②   | 163 / 159                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/toss-dark.jpg` · `caps/toss-light.jpg`               |
| ScoreSaber             | 해외 | 리듬게임 기록(Beat Saber)      | ④   | 31 / 78                        | 첫 화면에 없음(미확인). 사이드바만 밝아지고 본문은 어두운 채(캡처 확인)             | 순위 · 노랑 `#facc15` · `#5048e5` · `#59b0f4` · `#ff6347` · `#bf2a42` 모두 같음                                | `caps/scoresaber-dark.jpg` · `caps/scoresaber-light.jpg`   |
| sekai.best             | 해외 | 리듬게임 정보(프로젝트 세카이) | ④   | 37 / 233                       | 첫 화면에 없음(미확인)                                                              | 보조색 `#29b6f6` → `#0288d1`, 주색 `#298a7b` 같음                                                              | `caps/sekai-best-dark.jpg` · `caps/sekai-best-light.jpg`   |
| FotMob                 | 해외 | 스포츠 기록                    | ④   | 28 / 242                       | 첫 화면에 없음(미확인)                                                              | 초록 `#61df6e` → `#00985f`                                                                                     | `caps/fotmob-dark.jpg` · `caps/fotmob-light.jpg`           |
| Sofascore              | 해외 | 스포츠 기록                    | ④   | 26 / 224                       | 첫 화면에 없음(미확인)                                                              | 초록 `#39b57a` → `#15b168`, 빨강 `#e73b3b` → `#cb1818`, 주황 `#e35c47` → `#c7361f`, 강조 `#7a84ff` → `#374df5` | `caps/sofascore-dark.jpg` · `caps/sofascore-light.jpg`     |
| Twitch                 | 해외 | 스트리밍                       | ④   | 61 / 172                       | 첫 화면에 없음(미확인)                                                              | 보라 `#bf94ff` → `#5c16c5`, 빨강 `#eb0400` 같음                                                                | `caps/twitch-dark.jpg` · `caps/twitch-light.jpg`           |
| MDN                    | 해외 | 문서                           | ④   | 53 / 89                        | 첫 화면에 없음(미확인). 유채색 표본 0                                               | 미확인                                                                                                         | `caps/mdn-dark.jpg` · `caps/mdn-light.jpg`                 |
| osu!                   | 해외 | 리듬게임 기록                  | ①   | 48 / 48                        | 없음                                                                                | 해당 없음                                                                                                      | `caps/osu-dark.jpg` · `caps/osu-light.jpg`                 |
| Quaver                 | 해외 | 리듬게임 기록                  | ①   | 43 / 43                        | 없음(html color-scheme dark)                                                        | 해당 없음                                                                                                      | `caps/quaver-dark.jpg` · `caps/quaver-light.jpg`           |
| BeatSaver              | 해외 | 리듬게임 차트                  | ①   | 68 / 64                        | 없음                                                                                | 해당 없음                                                                                                      | `caps/beatsaver-dark.jpg` · `caps/beatsaver-light.jpg`     |
| Chess.com              | 해외 | 랭킹                           | ①   | 51 / 51                        | 없음(리더보드 쪽, 로그인 전)                                                        | 해당 없음                                                                                                      | `caps/chesscom-dark.jpg` · `caps/chesscom-light.jpg`       |
| Discord(소개 쪽)       | 해외 | 제품                           | ①   | 67 / 67                        | 없음                                                                                | 해당 없음                                                                                                      | `caps/discord-dark.jpg` · `caps/discord-light.jpg`         |
| Linear(소개 쪽)        | 해외 | 제품                           | ①   | 20 / 21                        | 푸터 `themeSwitcher` 클래스는 있으나 두 선호 모두 다크로 열림                       | 해당 없음                                                                                                      | `caps/linear-dark.jpg` · `caps/linear-light.jpg`           |
| Spotify 웹 플레이어    | 해외 | 음악                           | ①   | 38 / 38                        | 없음                                                                                | 해당 없음                                                                                                      | `caps/spotify-dark.jpg` · `caps/spotify-light.jpg`         |
| Steam 스토어           | 해외 | 게임                           | ①   | 71 / 49                        | 없음                                                                                | 해당 없음                                                                                                      | `caps/steam-dark.jpg` · `caps/steam-light.jpg`             |
| AniList                | 해외 | 기록                           | ③   | 235 / 235                      | 본문 안 `theme-preview default · dark · contrast` 세 개                             | 해당 없음                                                                                                      | `caps/anilist-dark.jpg` · `caps/anilist-light.jpg`         |
| Wikipedia 영어         | 해외 | 정보 위키                      | ③   | 231 / 231                      | 헤더 「Appearance」 메뉴                                                            | 해당 없음                                                                                                      | `caps/enwiki-dark.jpg` · `caps/enwiki-light.jpg`           |
| chunirec               | 해외 | 리듬게임 기록(CHUNITHM)        | ②   | 251 / 251                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/chunirec-dark.jpg` · `caps/chunirec-light.jpg`       |
| GitHub(로그인 전)      | 해외 | 개발                           | ②   | 244 / 244                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/github-dark.jpg` · `caps/github-light.jpg`           |
| Hacker News            | 해외 | 정보                           | ②   | 237 / 237                      | 없음                                                                                | 해당 없음                                                                                                      | `caps/hn-dark.jpg` · `caps/hn-light.jpg`                   |
| Strava(로그인 전)      | 해외 | 기록                           | ②   | 141 / 141                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/strava-dark.jpg` · `caps/strava-light.jpg`           |
| YouTube(로그인 전)     | 해외 | 영상                           | ②   | 252 / 252                      | 첫 화면에 없음(미확인)                                                              | 해당 없음                                                                                                      | `caps/youtube-dark.jpg` · `caps/youtube-light.jpg`         |

## 막힘 · 판정 보류(세지 않음)

- DJMAX 인벤: 도메인 해석 실패
- arca.live DJMAX: Cloudflare 확인 화면
- Letterboxd: Cloudflare 확인 화면
- Lichess: Cloudflare 확인 화면
- 로아와: Cloudflare 확인 화면
- 리디: Cloudflare 확인 화면
- solved.ac: Cloudflare 확인 화면
- Speedrun.com: Cloudflare 확인 화면
- Stack Overflow: Cloudflare 확인 화면
- Tracker.gg: Cloudflare 확인 화면
- Last.fm: 캡차
- Reddit: 네트워크 보안 차단 화면
- Kamaitachi(Tachi): 로그인 창만 열림
- Genius: 차단 화면
- IMDb: 403
- 키노라이츠: 403
- OP.GG: 오류 화면
- 더쿠: 차단 화면
- SteamDB: 오류 화면
- 백준: 404
- MyAnimeList: 동의 창이 덮음
- 무신사: 캡처가 모바일 틀이라 판정 보류
- sdvx.in: 배경이 이미지라 판정 보류
- maple.gg: 머리는 어둡고 본문 바탕 `#f5f5f5`로 갈려 판정 보류
- Rotten Tomatoes: 동의 창이 덮고 머리 이미지가 어두워 판정 보류

## 한계

- 로그인 전 첫 화면만 봤다. 로그인 뒤 설정 안 전환 자리 · 저장된 선택 · 기기 선호가 아닌 서버 기본은 보지 않았다.
- 같은 서비스도 쪽마다 다를 수 있다(소개 쪽만 본 곳은 곳 이름에 적었다).
- 화면 밝기 평균은 보조이고, 판정의 기준은 캡처 육안 대조다.
- 전환 자리는 첫 화면 DOM에서만 찾았다. 「첫 화면에 없음」은 없다는 뜻이 아니다.
