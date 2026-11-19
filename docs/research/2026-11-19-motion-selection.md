# 고름 표시 · 펼침 · 체크 · 툴팁 움직임 — 실제 서비스 실측 (2026-11-19)

공통 층 3단계 움직임 판 3(당근에 없거나 방식이 다른 자리)의 재료다. 탭 · 칩 · 세그먼트의 고름 표시가 즉시 바뀌는지 미끄러지는지, 구역 펼침 · 접힘에 높이 움직임이 있는지, 체크박스 · 토글이 바뀔 때와 툴팁이 나타날 때 시간 · 곡선이 어떤지 실제 서비스에서 센다. 추천은 쓰지 않는다. 디자인 시스템은 세지 않는다(다른 세션 몫).

먼저 읽은 기록: [조사 기록 목록](./README.md)에 움직임 기록은 없다. 당근 값은 공유 메모 `common-layer/stage3/daangn-tokens.md`(탭 밑줄 `left, width .2s cubic-bezier(.35,0,.35,1)` · 세그먼트 알약 `transform .2s` · 스위치 손잡이 `transform .15s` · 체크 `background-color .15s`)에 있어 다시 재지 않는다.

## 재는 법

- headless Chromium(Playwright 1.61), 1440×900, `colorScheme: dark`, 한국어. 페이지마다 `~/noslog-research/wait-capacity.sh` 를 거쳐 브라우저 하나에 페이지 하나.
- 누르기 전에 대상 묶음 안 모든 요소와 `::before` · `::after` 의 계산된 `transition-*` · `animation-*` 와 그 값을 낸 CSS 규칙(시트 주소 · 선택자)을 읽는다.
- 누른 순간부터 1.2초(툴팁은 올린 순간부터 1.8초) 동안 매 프레임(약 16ms) 위치 · 폭 · 높이 · transform · opacity · 색을 적는다. 값이 세 번 이상 바뀌면 「움직임」, 한 번에 바뀌면 「즉시」. 시간은 누른 때부터 움직임이 처음 보인 때 · 50% · 90% 지점 · 끝난 때다.
- CSS 전환이 없는데 프레임마다 값이 바뀌면 스크립트(스프링 등)가 움직인 것으로 적는다.
- 원자료: `~/noslog-research/motion-selection-2026-11-19/` 의 `json/<곳>.json`(선언값 · 규칙 · 프레임 값), `video/<곳>.webm`(전체 녹화), `shot/<곳>-<자리>-before|after.png`, `css/<곳>/`(받은 CSS 원문).
- 캡차 · 로그인 벽 · 팝업에 막힌 곳, 자리가 없는 곳은 그 자리를 세지 않는다.

## 묶음

센 곳은 실제 서비스 34곳(국내 20 · 해외 14)이다. 한 서비스가 여러 자리에 들어갈 수 있다. 자리마다 곳 수가 3곳 안팎이면 「근거 약함」.

### 탭 · 칩 · 세그먼트 고름 표시 (19곳)

| 방식                                | 곳                                                                                                                            | 값                                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 즉시 바뀜(위치 · 색 모두 한 프레임) | OP.GG · 치지직 · 네이버 웹툰 · 네이버 · 다음 · 인프런 · Steam · 놀 · 블라인드 · 업비트 · 마켓컬리 · 예스24 · Vercel 문서 (13) | 없음                                                                                                       |
| 위치는 즉시, 글자 · 배경색만 바뀜   | 원티드 · Disney+ · Battle.net (3, 근거 약함)                                                                                  | `.3s ease` · `.3s ease-in`(원티드), `color .18s linear`(Disney+), `.2s cubic-bezier(0,0,.2,1)`(Battle.net) |
| 밑줄이 미끄러짐                     | 토스증권 · Twitch (2, 근거 약함)                                                                                              | 스크립트 스프링 약 0.7–0.8s(토스증권), `transform .2s ease` 실측 약 215ms(Twitch)                          |
| 알약이 미끄러짐                     | Figma (1, 근거 약함)                                                                                                          | 약 430ms, `left` 를 바꾸고 `transform` 으로 되돌아오는 방식                                                |

### 구역 펼침 · 접힘 (15곳)

| 방식                          | 곳                                                                                          | 값                                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 높이 즉시(아이콘만 돌기도 함) | 치지직 · 네이버 웹툰 · 네이버 · Steam(`details`) · 멜론 · SOOP · Figma · 알라딘 · OP.GG (9) | 화살표만 `.3s ease`(알라딘) · `.15s cubic-bezier(.4,0,.2,1)`(OP.GG)                                                                                                  |
| 높이가 움직임                 | Netflix · Apple · Stripe · Disney+ · Reddit · Steam 검색(거르기 접기) (6)                   | `.25s cubic-bezier(.32,.94,.6,1)` · `.4s ease-in-out` · `.3s cubic-bezier(.65,0,.35,1)` · `max-height .18s cubic-bezier(.4,0,.2,1)` · `.222s ease` · 스크립트 약 .2s |

높이가 움직인 6곳 중 5곳은 자주 묻는 질문 · 규칙 같은 질문 목록이고, 목록을 더 불러오는 「더보기」 는 모두 즉시였다.

### 체크박스 · 스위치 (8곳, 근거 약함)

| 방식                      | 곳                                                                | 값                                                                                                        |
| ------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 즉시                      | 지니 · 벅스 · Steam 검색 (3)                                      | 없음                                                                                                      |
| 체크 상자 색만 바뀜       | 교보문고 (1)                                                      | `all .2s cubic-bezier(0,0,.2,1)`                                                                          |
| 두 칸 전환 단추 색이 바뀜 | 메이플스토리 (1)                                                  | `background .3s ease`                                                                                     |
| 스위치 손잡이가 미끄러짐  | Linear · YouTube 자동재생 · 리그 오브 레전드(Osano 쿠키 위젯) (3) | `transform .4s cubic-bezier(.16,1,.3,1)` · `::after .2s cubic-bezier(.05,0,0,1)`(선언값) · `.3s ease-out` |

### 툴팁 나타남 (6곳, 근거 약함)

| 곳                       | 올린 뒤 붙는 때 | opacity 0 → 1 | 위치 이동 |
| ------------------------ | --------------- | ------------- | --------- |
| OP.GG(react-tooltip)     | 25–31ms         | 약 150ms      | 없음      |
| YouTube 플레이어         | 114ms           | 208 → 403ms   | 없음      |
| GitHub(Primer TooltipV2) | 622ms           | 약 76ms       | 없음      |
| GitHub(Primer Brand)     | 323ms           | 약 194ms      | 없음      |
| Steam 게임 정보 카드     | 326ms           | 약 183ms      | 없음      |
| Twitch 머리 띠           | 373ms           | 약 82ms       | 없음      |

Stripe 펼침 안 툴팁은 선언만 봤다(`opacity .25s ease`). 6곳 모두 opacity 만 바뀌었고 크기 · 위치 움직임은 없었다.

## 곳마다

캡처 · 영상 경로는 `~/noslog-research/motion-selection-2026-11-19/` 아래 상대 경로다. 「다크 미지원」 은 `prefers-color-scheme: dark` 에도 밝은 화면이 나온 곳이다(움직임 값은 그대로 센다).

### 토스증권 — https://www.tossinvest.com/

- 탭(실시간 차트 → 지금 뜨는 산업): 밑줄 막대가 새 탭 아래로 미끄러진다. 막대(`div.tw1n-kztokqr`)에는 CSS 전환이 없고 스크립트가 `transform` · `width` 를 프레임마다 바꾼다. 누른 뒤 115ms 에 움직이기 시작해 폭은 795ms, 위치는 945ms 에 멈춘다(스프링형 꼬리). 탭 글자색은 `color .15s ease`(`_next/static/css/1e2f1f42eb8aa04f.css` `.tw1n-kztokq2e`).
- 캡처 `shot/tossinvest-tab0-before|after.png` · 영상 `video/tossinvest.webm`.

### Twitch — https://www.twitch.tv/directory

- 탭(카테고리 → 생방송 채널, `role=tab`): 밑줄이 미끄러진다. 새 탭 아래에 밑줄을 새로 붙이고 옛 자리만큼 `translateX(-84px) scaleX(.756)` 에서 시작해 `none` 으로 돌아오는 방식이다. 선언 `transform .2s ease`(`div.ScActiveIndicator`). 실측 113ms → 328ms(약 215ms), 50% 194ms · 90% 261ms. 글자색은 즉시.
- 왼쪽 탐색 접기(`측면 탐색 접기`): 아이콘 `transform .25s ease` 선언, 프레임 변화 없음(이번 실측에서는 움직임 못 봄).
- 캡처 `shot/twitch-tab0-*.png` · 영상 `video/twitch.webm`.

### OP.GG — https://op.gg/ko/lol/champions

- 라인 세그먼트(모든 챔피언 → 탑, `aria-selected`): 배경 · 테두리 · 아이콘 색 모두 즉시.
- 「더 보기」: 목록은 즉시 늘고 화살표만 돈다. `svg transform .15s cubic-bezier(.4,0,.2,1)`, 실측 22–172ms.
- 툴팁(react-tooltip): 올리고 25–31ms 에 붙고 opacity 0 → 1 이 약 150ms(25 → 174ms, 31 → 196ms). 위치 이동 없음.
- 캡처 `shot/opgg-*.png` · 영상 `video/opgg.webm`.

### 치지직 — https://chzzk.naver.com/

- 카테고리 칩(`role=tab`): 고른 칩 배경 흰색 ↔ 반투명이 즉시 바뀐다(513ms 에 한 번에).
- 구역 「더보기」(`aria-expanded`): 구역 높이 394 → 1048px 이 한 프레임에 바뀐다. 높이 움직임 없음.
- 캡처 `shot/chzzk-*.png` · 영상 `video/chzzk.webm`.

### 네이버 웹툰 — https://comic.naver.com/webtoon

- 정렬 탭(인기순 → 업데이트순, `role=tab`): 글자색(초록 ↔ 회색) 즉시.
- 회차 목록 「미리보기」 펼침(`aria-expanded`): 455px → 즉시. 높이 움직임 없음.
- 캡처 `shot/webtoon-*.png` · 영상 `video/webtoon.webm`.

### 네이버 — https://www.naver.com/ (다크 미지원)

- 뉴스 탭(언론사편집 ↔ 추천, `role=tab`): 글자색 즉시.
- 피드 「펼쳐보기」: 영역 높이 1076 → 1747px 즉시.
- 캡처 `shot/naver-*.png` · 영상 `video/naver.webm`.

### 다음 — https://www.daum.net/

- 카테고리 칩(뉴스 → 스포츠, `role=tab`): 고른 칩 배경 · 글자색 즉시.
- 캡처 `shot/daum-*.png` · 영상 `video/daum.webm`.

### 인프런 — https://www.inflearn.com/courses

- 정렬 탭(추천순 → 인기순, Mantine): 글자색 즉시.
- 캡처 `shot/inflearn-*.png` · 영상 `video/inflearn.webm`.

### 원티드 — https://www.wanted.co.kr/wdlist

- 태그 칩(`aria-selected`): 배경 · 글자 · 그림자 `background-color, color, box-shadow .3s ease`(인라인 `.montage-1dn70d3`), 실측 119 → 384ms.
- 정렬 세그먼트(최신순): 흰 알약 배경 · 그림자는 즉시 옮겨 가고 글자색만 `color .3s ease-in`(`.SortFilter_SortFilter__list__item__text`), 실측 100 → 384ms.
- 캡처 `shot/wanted-*.png` · 영상 `video/wanted.webm`.

### Steam — https://store.steampowered.com/

- 홈 탭(Popular New Releases → Top Sellers, `role=tab`): 고른 탭 높이 · 배경 즉시.
- 접근성 기능 `details`(게임 상세 패널): 26 → 176px 즉시.
- 캡처 `shot/steam-*.png` · 영상 `video/steam.webm`.

### 놀(야놀자) — https://nol.yanolja.com/ (다크 미지원)

- 카테고리 칩(뮤지컬 → 콘서트, `role=tab`): 검정 ↔ 회색 배경 · 글자색 즉시. 지역 칩(강원 → 제주)도 같다.
- 캡처 `shot/yanolja-*.png` · 영상 `video/yanolja.webm`.

### 블라인드 — https://www.teamblind.com/kr/ (다크 미지원)

- 위 탭(채널): 글자색 즉시.
- 캡처 `shot/blind-*.png` · 영상 `video/blind.webm`.

### 업비트 — https://upbit.com/exchange (다크 미지원)

- 주문 탭(매수 → 매도): 글자색 · 밑줄색 · 높이 즉시.
- 캡처 `shot/upbit-*.png` · 영상 `video/upbit.webm`.

### Disney+ — https://www.disneyplus.com/ko-kr

- 요금 세그먼트(디즈니+ ↔ 번들 할인, `role=tab`): 흰 알약(`div.absolute.top-[5px]`)은 한 프레임에 81.8px 옮겨 간다(즉시). 글자색만 `color .18s linear`, 실측 45–91 → 194–204ms.
- 자주 묻는 질문(`details`): 높이가 움직인다. `max-height .18s cubic-bezier(.4,0,.2,1)`, 실측 42 → 208–226ms.
- 캡처 `shot/disney-*.png` · 영상 `video/disney.webm`.

### Netflix — https://www.netflix.com/kr/

- 자주 묻는 질문(`aria-expanded`): 높이가 움직인다. 내용 칸 `all .25s cubic-bezier(.32,.94,.6,1)`, 0 → 171px 이 123 → 410ms(90% 221ms). 더하기 아이콘은 `transform .25s` 로 45° 돈다. 질문 칸 배경 `background-color .25s`.
- 캡처 `shot/netflix-*.png` · 영상 `video/netflix.webm`.

### Apple — https://www.apple.com/kr/apple-one/

- 자주 묻는 질문(`aria-expanded`): 높이가 움직인다. `div.transition-container` `height .4s ease-in-out`, 0 → 72px 이 314 → 609ms. 더하기 아이콘 `transform .3s ease-out` 45°.
- 캡처 `shot/apple-*.png` · 영상 `video/apple.webm`.

### Stripe — https://stripe.com/pricing

- 기능 묶음 펼침(`aria-expanded`): 높이가 움직인다. `PricingProductFeatureGroup__content` `height .3s cubic-bezier(.65,0,.35,1)`, 0 → 448px 이 371 → 621ms. 화살표 `::before` `transform .35s cubic-bezier(0,.53,.32,1)`.
- 펼침 안 툴팁(`PortalTooltipItem__tooltip`): `opacity .25s ease` + 애니메이션 `PortalTooltipItemFadeIn .25s ease`.
- 캡처 `shot/stripe-*.png` · 영상 `video/stripe.webm`.

### Linear — https://linear.app/pricing

- 연간 결제 토글(스위치): 손잡이 `transform .4s cubic-bezier(.16,1,.3,1)`, 실측 26–73 → 410–448ms(90% 143–148ms, 빨리 가서 천천히 멈춤). 바탕색 `background-color .15s ease`.
- 캡처 `shot/linear-*.png` · 영상 `video/linear.webm`.

### Figma — https://www.figma.com/ko-kr/pricing/

- 기능 비교 세그먼트(모든 기능 ↔ 주요 기능, `role=switch`): 알약이 미끄러진다. `left` 는 한 번에 바꾸고 `transform` 으로 옛 자리에서 되돌아오는 방식, 138 → 571ms(90% 404ms).
- 기능 설명 펼침(`aria-expanded`): 48 → 105px 즉시.
- 캡처 `shot/figma-*.png` · 영상 `video/figma.webm`.

### 리그 오브 레전드 — https://www.leagueoflegends.com/ko-kr/

- 쿠키 설정 스위치(Osano 위젯, 제3자 부품): 손잡이 `transform, left .3s ease-out`, 바탕 `background-color .2s ease-out`. 실측 손잡이 115–147 → 395–431ms.
- 캡처 `shot/lol-*.png` · 영상 `video/lol.webm`.

### 메이플스토리 — https://maplestory.nexon.com/Home/Main (다크 미지원, 다크 전환 단추 있음)

- 머리 띠 라이트/다크 전환 단추(두 칸 세그먼트): 바탕 `background .3s ease`, 아이콘 `fill .3s ease`. 실측 634 → 917ms.
- 캡처 `shot/maple-*.png` · 영상 `video/maple.webm`.

### 지니 — https://www.genie.co.kr/chart/top200 (다크 미지원)

- 곡 선택 체크박스: 줄 배경 · 「n곡 선택」 즉시. 체크 표시 자체도 즉시(브라우저 기본 모양에 가까움).
- 캡처 `shot/genie-*.png` · 영상 `video/genie.webm`.

### 벅스 — https://music.bugs.co.kr/chart (다크 미지원)

- 곡 선택 체크박스: 줄 배경 즉시.
- 캡처 `shot/bugs-*.png` · 영상 `video/bugs.webm`.

### 멜론 — https://www.melon.com/chart/index.htm (다크 미지원)

- 매거진 「리스트접기」: 132 → 39px 즉시. 위 탭은 쪽을 새로 열어 세지 않음.
- 캡처 `shot/melon-*.png` · 영상 `video/melon.webm`.

### SOOP — https://www.sooplive.com/

- 구역 「더보기」: 321 → 741px 즉시.
- 캡처 `shot/soop-*.png` · 영상 `video/soop.webm`.

### YouTube — https://www.youtube.com/watch?v=jNQXAC9IVRw

- 플레이어 툴팁(음소거 단추): 올리고 114ms 에 붙고 opacity 0 → 1 이 208 → 403ms. 볼륨 막대가 함께 `width .2s cubic-bezier(.4,0,1,1)` 로 열린다.
- 캡처 `shot/ytwatch-*.png` · 영상 `video/ytwatch.webm`.

### GitHub — https://github.com/vercel/next.js

- 툴팁(Primer TooltipV2, 검사 상태 단추): 올리고 622ms 에 붙고 opacity 가 680 → 756ms. 다른 툴팁(Primer Brand)은 323ms 에 붙고 342 → 536ms.
- 캡처 `shot/ghrepo-*.png` · 영상 `video/ghrepo.webm`.

### Steam 검색 — https://store.steampowered.com/search/

- 왼쪽 거르기 묶음 접기(Narrow by Price · Narrow by tag): 높이가 움직인다. 160 → 25px 이 43 → 233ms(222 → 25px 은 22 → 224ms). CSS 전환 선언이 없어 스크립트(jQuery 접기로 보임)가 높이를 바꾼다.
- 거르기 체크 줄(Verified · Playable): 체크 · 글자색 · 배경 즉시.
- 게임 줄에 올렸을 때 뜨는 정보 카드(`div.hover.game_hover`): 326ms 에 붙고 opacity 0 → 1 이 342 → 525ms.
- 캡처 `shot/steamsearch-*.png` · 영상 `video/steamsearch.webm`.

### Vercel 문서 — https://vercel.com/docs/getting-started-with-vercel

- 코드 탭(pnpm → yarn, `role=tab`): 밑줄색 · 글자색 즉시. 단추에 `all .15s cubic-bezier(.4,0,.2,1)` 선언이 있지만 고름 표시는 한 프레임에 바뀐다.
- 캡처 `shot/vercdocs-*.png` · 영상 `video/vercdocs.webm`.

### 마켓컬리 — https://www.kurly.com/main (다크 미지원)

- 위 탭(마켓컬리 → 뷰티컬리): 글자색(보라 ↔ 회색) 즉시.
- 캡처 `shot/kurly-*.png` · 영상 `video/kurly.webm`.

### 예스24 — https://www.yes24.com/main/default.aspx (다크 미지원)

- 구역 탭(베스트셀러 1~5위 → 6~10위, 화제의 책 → 외국도서): 글자색 · 폭 즉시.
- 캡처 `shot/yes24-*.png` · 영상 `video/yes24.webm`.

### 알라딘 — https://www.aladin.co.kr/home/welcome.aspx (다크 미지원)

- 이벤트 「꼭 읽어주세요」 펼침(`aria-expanded`): 22 → 158px 즉시. 화살표만 `::after all .3s ease` 로 뒤집힌다.
- 캡처 `shot/aladin-*.png` · 영상 `video/aladin.webm`.

### 교보문고 — https://store.kyobobook.co.kr/bestseller/online/daily (다크 미지원)

- 「전체선택」 체크박스: 상자 배경 흰색 → 남색, 테두리색이 `all .2s cubic-bezier(0,0,.2,1)` 로 바뀐다. 실측 67 → 227–244ms.
- 캡처 `shot/kyobo-*.png` · 영상 `video/kyobo.webm`.

### Battle.net 상점 — https://kr.shop.battle.net/ko-kr

- 상단 소개 탭(`blz-tab-control`, `role=tab`): 고른 탭 글자 흰색 ↔ 48% 흰색이 프레임마다 바뀐다(11단계). 슬라이드 묶음 선언 `color, background-color, border, filter .2s cubic-bezier(0,0,.2,1)`. 밑줄 막대는 없다.
- 캡처 `shot/battlenet-*.png` · 영상 `video/battlenet.webm`.

### Reddit — https://www.reddit.com/r/korea/

- 게시판 규칙 펼침(`details`): 높이가 움직인다. `faceplate-auto-height-animator` `height .222s ease`, 0 → 252px 이 52 → 269ms(0 → 189px 은 25 → 242ms). 내용 `opacity .222s ease`, 화살표 `transform .22s ease-in-out` 180°.
- 캡처 `shot/reddit-*.png` · 영상 `video/reddit.webm`.

### YouTube 자동재생 스위치 — https://www.youtube.com/watch?v=jNQXAC9IVRw

- 플레이어 자동재생 스위치: 손잡이 `::after` `all .2s cubic-bezier(.05,0,0,1)`, 바탕 `div.ytp-autonav-toggle-button` `all .08s cubic-bezier(.4,0,1,1)`(선언값). 프레임 실측은 단추 배경만 72 → 221ms 로 잡혔다(가상 요소 위치는 계산값에 드러나지 않음).
- 캡처 `shot/ytwatch2-*.png` · 영상 `video/ytwatch2.webm`.

### Twitch 툴팁 — https://www.twitch.tv/

- 머리 띠 단추 툴팁(검색 단추): 올리고 373ms 에 붙고 opacity 가 373 → 455ms. 툴팁 틀 `ScTransitionBase` 가 `.1s` · `.15s ease` 를 쓴다.
- 캡처 `shot/twitchtv-*.png` · 영상 `video/twitchtv.webm`.

### 막혀서 세지 않은 곳

- 오늘의집(Access Denied) · 빗썸(HTTP2 오류) · 사람인(쪽 열기 시간 초과).
- 자리를 찾지 못했거나 누른 뒤 쪽이 바뀐 곳: 왓챠 · 리디 · 카카오페이지 · 토스 · 29CM · 쿠팡플레이 · 배민 · Discord · Kick · Crunchyroll · Letterboxd · PlayStation Store · 에펨코리아 · 위버스 · 여기어때 · 11번가 · G마켓 · 잡코리아 · Spotify(웹 플레이어 · 프리미엄) · Xbox · 다나와(누른 뒤 값 변화 없음) · 무신사 · 웨이브 · 티빙 · 카카오뱅크 · 밀리의서재 · 뱅크샐러드 · 카카오 · 인벤 · 클래스101 · 네이버 증권 · NOSTALGIA 공식(e-amusement).
