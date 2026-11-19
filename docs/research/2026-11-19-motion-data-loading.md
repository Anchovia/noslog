# 그래프 · 로딩 움직임 — 실제 서비스 실측

2026-11-19. 공통 층 3단계 움직임 판 3(당근에 없는 자리) 재료. 그래프 나타남 · 값 바뀜, 스켈레톤, 스피너, 위쪽 진행 막대, 로딩 표시를 띄우기 전 지연을 실제 서비스에서 잰다. 디자인 시스템은 세지 않는다(다른 세션 몫).

## 재는 법

- headless Playwright 1.61(Chromium), 1440×900, `colorScheme: dark`, `locale: ko-KR`. 페이지마다 브라우저 하나.
- 첫 로드는 지연 200ms · 4Mbps, 사이트 안 링크 누름은 지연 1200ms · 1.5Mbps 로 느리게 해 로딩 표시를 잡는다.
- 페이지 안에서 25ms 마다 `document.getAnimations()` 를 읽어 CSS 애니메이션 · 전환 · Web Animations 의 시간 · 반복 · 곡선 · 키프레임 · 처음 보인 시각을 남긴다. JS 로 매 프레임 속성을 바꾸는 그래프(SVG `d` · `width` 등)는 `MutationObserver` 로 바뀐 횟수 · 첫 · 끝 시각을 남긴다.
- 스타일시트를 받아 이름에 skeleton · shimmer · pulse · spin · progress 등이 든 `@keyframes` 와 그것을 쓰는 규칙 줄을 그대로 옮긴다(아래 「CSS」 칸).
- 캡처 · 영상: `~/noslog-research/motion-data-loading-2026-11-19/<곳>/` (`load-300.png` … `click-4000.png`, `video.webm`, `result.json`). 커밋하지 않는다.
- 지연(띄우기 전 기다림)은 누른 시각과 로딩 표시가 처음 보인 시각의 차로 잰다. 전체 새로 고침이 된 곳은 시계가 다시 시작해 지연을 잴 수 없어 「미확인」.
- 캡차 · 로그인 벽 · 동의 창에 막힌 곳은 세지 않고 막혔다고 적는다.

## 곳마다

### GitHub (github.com/vercel/next.js)

- 스켈레톤(파일 목록 · 사이드바): `.Skeleton::after` 물결. CSS `animation:1s -999999s infinite skeleton-loading`, `linear-gradient(75deg, …)` 폭 300% 를 옮김. 곡선 `ease`. Primer React `prc-Skeleton-shimmer` 도 1000ms `ease` 무한(`mask-image` 75deg 물결). 실측 첫 로드 4.5s 에 보이고 약 1.2–1.4s 뒤 사라짐.
- 스피너: `.anim-rotate{animation:1s linear infinite}` · `.Toast--spinner` 1s linear(CSS, 실측 화면에는 안 나옴).
- 진행 막대: Turbo 가 있으나 고른 링크(로고)가 전체 새로 고침이라 이번에 막대는 못 잡음 → 「미확인」.
- 그래프 값: `.anim-grow-x{animation-duration:.3s; timing:ease; delay:.5s}`(진행 막대가 0 에서 자람, CSS).

### 네이버 메인 (www.naver.com)

- 데이터 로딩 표시 · 그래프 없음(첫 로드에 스켈레톤 · 스피너 미검출). 새로 고침 버튼 아이콘만 `spin .7s ease-in-out forwards`(CSS). 사이트 안 이동 링크를 못 골라 누름 단계 없음.

### Npay 증권 모바일 (m.stock.naver.com 삼성전자)

- 스켈레톤: `SkeletonCard · SkeletonListText · SkeletonListImage` 모두 1200ms `linear` 무한, 키프레임 불투명 1 → 0.5 → 1(깜빡임). 누른 뒤 1.3s 에 보여 약 4–5s 유지(지연망).
- 로딩 표시: 점 셋이 옮겨 다니는 `Loading_move1…6` 1500ms `ease-in-out` 무한, `LoadingBasic` 막대 1.5s `linear` 무한(CSS).
- 그래프: canvas 차트, 움직임 미검출.

### Npay 증권 PC (finance.naver.com → stock.naver.com)

- 스켈레톤: 모듈마다 `*_skeleton-pulse` 1.2s `linear` 무한 불투명 1 → 0.5 → 1, 사라질 때 `transition: opacity .6s linear`(CSS 줄 `animation:1.2s linear infinite l2dgYq_skeleton-pulse`).
- 미니 차트: 드러날 때 `opacity` 300ms `ease-in-out`.
- 값 바뀜: 52주 게이지 현재가 점(`gauge-wrapper > current-price-indicator`)이 JS 로 `left` 를 0.36% → 끝값까지 약 2.1s 에 걸쳐 230번 바꿈(감속).
- 스피너: Toastify `.65s linear infinite`(CSS, 화면엔 안 나옴).

### 네이버 날씨 (weather.naver.com)

- 그래프: 일출 · 미세먼지 막대 `width 0 → 139.5px` · `transform rotate` 전환 2000ms `cubic-bezier(0.215, 0.61, 0.355, 1)`(easeOutCubic). d3 7.8.1 있음.
- 스켈레톤: `common_loading::before` 물결 `background-position 100% → -100%` 2000ms `ease` 무한.

### 다음 금융 (finance.daum.net 삼성전자)

- 막대 드러남: `.rk-bar{animation:.55s cubic-bezier(.22,.9,.3,1) both rkGrow; transform-origin:0}`(가로 막대가 왼쪽부터), `.rpc-bar{.5s ease-out both rpcGrow; transform-origin:bottom}`, `dc-grow .55s cubic-bezier(.22,.9,.3,1)`.
- 선 드러남: `.cdl-ma{stroke-dasharray:10000; animation:1.2s cubic-bezier(.22,.7,.2,1) both chDraw}`.
- 점 깜빡임: `dayPulse 1.6s ease-out infinite`(실시간 표시).
- 스켈레톤 · 스피너 미검출.

### 토스 (toss.im)

- 데이터 로딩 표시 · 그래프 움직임 미검출(누름 단계 포함).

### 토스증권 (tossinvest.com 삼성전자)

- 스피너: SVG 자체 회전 1800ms `linear` + 원 `stroke-dashoffset 180 → 45 → …` 1800ms `ease-in-out`(길이가 늘었다 줄었다 하는 머티리얼식). 첫 로드 0.9s 에 보임.
- 스켈레톤: 물결 `background-position 150% → -50%` 1200ms `linear` 무한.
- 그래프: TradingView 차트(canvas) · 거래량 막대 `rect height` 는 실시간 값 변경만(사이 움직임 없음).

### 빗썸 (bithumb.com 거래 화면)

- 막힘: headless 접속에 `ERR_HTTP2_PROTOCOL_ERROR`. 세지 않음.

### 멜론 차트 (melon.com/chart)

- 로딩 표시 · 그래프 움직임 없음(정적 서버 렌더, 누름 단계도 전체 새로 고침).

### 지니 차트 (genie.co.kr/chart/top200)

- 그래프: 순위 변화 SVG 선 그래프가 JS 로 `path d` 를 649번 바꾸며 약 2.6s 에 걸쳐 그려짐(라이브러리 전역 이름 미노출). 스켈레톤 · 스피너 없음.

### 치지직 (chzzk.naver.com)

- 목록 자리 깜빡임: `_pulse` 500ms `ease-out` 무한, 불투명 0.3 → 1(한 방향, 되돌아올 때 끊김).
- 스피너(플레이어): `pzp-loading-indicator` 1.4s `ease-in-out` 회전, 좋아요 · 나중에 보기 진행 아이콘 1.5s `linear` 회전(CSS).

### SOOP (sooplive.co.kr)

- 띄우기 전 지연: 플레이어 로딩 표시 `player_spinnerDelay` 가 `animation-delay: 3000ms` 뒤 200ms `ease` 로 나타남(3초 안에 끝나면 안 보임).
- 스피너: `loading-spinner > i` 막대 12개가 불투명 1 → 0 을 1200ms `linear` 로 차례로(iOS 식 살 스피너). 디자인 시스템 CSS 에 `CircleSpinner 1s linear` · `CircleProgressIndicator 2s linear`.
- 스켈레톤: `Skeleton-module__skeleton-loading 1.5s infinite ease-in-out`(CSS).

### 네이버웹툰 (comic.naver.com)

- 스피너: `Preloader` `0.8s linear infinite`, 새로 고침 아이콘 `0.6s ease-in-out` 한 번(CSS). 실측 화면엔 로딩 표시 안 나옴.
- 스켈레톤: 글쓰기 스티커 `skeleton-shimmer`(CSS).

### 인프런 (inflearn.com)

- 스켈레톤: Mantine `Skeleton::after` 1500ms `linear` 무한, 불투명 0.4 → 1 → 0.4(깜빡임). 사라질 때 `opacity` 전환 50ms `ease`.
- 스피너: Mantine `Loader::after` 회전 1200ms `linear`(사이트 안 이동 뒤 나타남).

### velog (velog.io)

- 스켈레톤: `keyframes_shining` 1000ms `ease-in-out` 무한, 불투명 0.5 → 1 → 0.5.
- 스피너: `SpinnerBlock_sk-chase` 2.5s `linear` + 점 2s `ease-in-out`(점 따라 돌기), Toastify `.65s linear`(CSS).

### 무신사 (musinsa.com)

- 스켈레톤: `UIRecommendSkeleton` `pulse` 1000ms `cubic-bezier(0.33, 0, 0.67, 1)` 무한, 불투명 1 → 0.5 → 1. Tailwind 기본 `animate-pulse 2s cubic-bezier(.4,0,.6,1)` 도 있음.
- 스피너: `animate-spin .75s linear infinite`(CSS).
- 진행 막대: `animate-fillProgress 5s linear`(배너 넘김 표시, CSS).

### 29CM (29cm.co.kr)

- CSS 만: `.skeleton{animation:skeleton 1.44s ease-out infinite}`, `ruler-spinner 1.6s ease-in-out`(선 길이 바뀌는 스피너), Tailwind `pulse 2s`. 실측 화면엔 로딩 표시 안 잡힘. 마이페이지는 로그인 벽이라 누름 단계 세지 않음.

### 원티드 (wanted.co.kr)

- 스켈레톤: `EmptySmallJobCard` · `TagSkeleton` 2000ms `ease-in-out` 무한, 불투명 0.5 → 1 → 0.5. 사이트 안 이동 뒤 1.5s 에 보임(지연망).

### 오늘의집 (ohou.se)

- 막힘: headless 접속에 「Access Denied」. 세지 않음.

### TVING (tving.com)

- 위쪽 진행 막대: NProgress. 누른 뒤 344ms 에 처음 보임(지연망 1200ms, 라이브러리 지연 설정 없음 · 처리 시간 포함). 막대는 `transform: translate3d(-100% → -70% …)` 전환 200ms `ease` 로 3.2s 동안 8번 조금씩 차오르고, 끝나면 `#nprogress` 불투명 1 → 0 을 200ms `linear`. 함께 쓰는 스피너 `nprogress-spinner 400ms linear`(CSS).
- 스켈레톤: Tailwind `pulse` 2000ms `cubic-bezier(0.4, 0, 0.6, 1)`.
- 스피너: SweetAlert2 `swal2-rotate-loading 1.5s linear`(CSS).

### 왓챠피디아 (pedia.watcha.com)

- 스켈레톤: `white-skeleton` 배경색 2000ms `ease-in-out` 무한(색이 밝아졌다 어두워짐).
- 스피너: `_rotation 1s infinite linear`(CSS). 이미지 드러남 `opacity` 420ms `ease`.

### DEEPLOL (deeplol.gg 소환사 전적)

- 그래프: Highcharts 컨테이너 1개. 축 눈금 · 격자선이 약 1.7s 동안 1,400번 넘게 바뀜(JS 그리기, 라이브러리 기본 움직임).
- 로딩 표시: 화살표 `blink` 1000ms `ease` 무한, 불투명 0.1 → 1 → 0.1.

### 롤체지지 (lolchess.gg/meta)

- 스켈레톤: `react-loading-skeleton` 물결 `::after translateX(-100% → 100%)` 1500ms `ease-in-out` 무한. 첫 로드 0.7s 에 보임.
- 스피너: Font Awesome `fa-spin 2s linear` · `fa-pulse 1s steps(8)`, Toastify `.65s linear`(CSS).

### OP.GG (op.gg 소환사 전적)

- 위쪽 진행 막대: NProgress. 누른 뒤 168ms 에 처음 보임. `transform` 전환 100ms `ease` 로 3.1s 동안 33번 차오르고, 끝나면 불투명 1 → 0 을 100ms `linear`.
- 스켈레톤: Tailwind `animate-pulse` 2000ms `cubic-bezier(0.4, 0, 0.6, 1)`, 불투명 1 → 0.5 → 1.
- 스피너: Tailwind `animate-spin` 1000ms `linear`(작은 것), 2000ms `linear`(큰 원).
- 그래프: recharts 1개 있으나 이번 측정에서 움직임 미검출.

### FOW.LOL (fow.lol 소환사 전적)

- 그래프: Chart.js 4.4.2 와 Highcharts 4.1.4 를 함께 씀. 페이지의 `Chart.defaults.animation` = `{"duration":1000,"easing":"easeOutQuart"}`(실행 중 값을 직접 읽음). Highcharts 는 전역 기본 움직임 값을 바꾸지 않음(`plotOptions.series.animation` 없음, 라이브러리 기본값).
- 스켈레톤 · 스피너 · 진행 막대 없음(서버 렌더).

### 메이플지지 (maple.gg)

- 스켈레톤: `react-loading-skeleton` 물결 1500ms `ease-in-out` 무한(롤체지지와 같은 회사 · 같은 부품). 첫 로드 0.6s 에 보이고 2.4s 유지.

### 로아와 (loawa.com)

- 스피너: lucide `loader-circle` 아이콘 Tailwind `animate-spin` 1000ms `linear`. 버튼 자리 `animate-pulse` 2000ms `cubic-bezier(0.4, 0, 0.6, 1)`. 고른 링크가 로그인 화면이라 누름 단계는 세지 않음.

### 던담 (dundam.xyz)

- 로딩 표시 · 그래프 움직임 미검출(첫 화면 정적). CSS 에 `swiper-preloader-spin 1s linear` 만.

### V-ARCHIVE (v-archive.net, DJMAX 기록)

- 스피너: 원 `animate-spin` 1000ms `linear` + 「불러오는 중」 글자 `animate-pulse` 2000ms `cubic-bezier(0.4, 0, 0.6, 1)`. 홈 카드 안은 「공지사항을 불러오는 중입니다…」 글자만 둔다(캡처 `load-1200.png`, 다크 설정에도 밝은 화면). 스켈레톤 없음.
- 막대 드러남: `.compare-bar-fill{transform-origin:0; animation:compare-bar-grow .68s cubic-bezier(.2,.8,.2,1) both}`(왼쪽부터 자람, CSS).

### 닥지지 (dak.gg/er)

- 로딩 표시 미검출. CSS 에 `Gambit_spin .8s linear` · Toastify `.65s linear` 스피너만.

### osu! (osu.ppy.sh/users/2)

- 위쪽 진행 막대: Turbo `turbo-progress-bar`. 누른 뒤 96ms 에 `width: 10%` 로 나타나 300ms 마다 조금씩(10 → 10.7 → 11.3 → 11.9 → 12.7%) 차오르고, 새 화면이 오면 `width: 100%` 뒤 `opacity` 150ms(지연 150ms) 로 사라짐. 전환 곡선 `width 300ms ease-out`, `opacity 150ms ease-in`. 실행 중 `Turbo.session.progressBarDelay` 값은 0(라이브러리 기본 500ms 를 바꿔 둠).
- 스피너: 지연 불러오기 자리 `la-ball-clip-rotate` 750ms `linear`. CSS 에 `donut-rotate 1s cubic-bezier(.4,0,.22,1)`, `fa-spin 2s linear`.
- 그래프: 순위 변화 선 그래프(SVG) 는 움직임 없이 바로 그려짐.

### 업비트 (upbit.com 거래 화면)

- 스켈레톤: `wave` 1500ms `ease-in-out` 무한, **`animation-delay: 500ms`** 뒤 시작(불투명 · 배경색이 함께 바뀜). 사이트 안 이동 뒤 0.26s 에 자리 표시.
- 스피너: `#spinner .75s linear`, `loadingIcon 1.4s linear`(CSS).
- 그래프: TradingView(canvas) + Highcharts 2개. Highcharts 글자 위치만 바뀌고 계열 드러남 움직임은 미검출.

### 카카오페이지 (page.kakao.com)

- 스피너: 사이트 안 이동 때 화면 가운데 이미지 `animate-spin` 800ms `linear`(누른 뒤 1.3s 에 보임). CSS 에 `loadingSpin 1.5s linear`. 스켈레톤 없음.

### lichess (lichess.org)

- 막힘: 「잠시만 기다리십시오…」 확인 화면. 세지 않음.

### Steam Charts (steamcharts.com/app/730)

- 그래프 드러남: Highcharts 2.0.4 가 `clipPath rect width` 를 0 → 끝까지 약 1000ms 에 78번 넓혀 선을 왼쪽부터 드러냄. 잰 값(ms, px) 0:0 · 102:19 · 206:73 · 309:155 · 414:260 · 518:373 · 622:485 · 725:580 — 처음 느리고 가운데 일정, 끝 느림(Highcharts 기본 `swing`). 바닥선 · 축은 그대로.

### Chess.com (chess.com/member/hikaru)

- 스켈레톤: 글 썸네일 `::after` 물결 `translate(-100% → 100%)` 1500ms `ease`.
- 로딩 표시: 네모 6개가 옮겨 다니는 `cc-loader` 800ms `cubic-bezier(0.7, 0.2, 0, 0.8)` 무한. CSS 에 원 스피너(`cc-loader-border`).
- 그래프: Highcharts 컨테이너 4개, 이번 측정에서 드러남 움직임 미검출(로드 뒤 화면 밖).

### Tracker.gg (tracker.gg/valorant)

- 스켈레톤: `loading-indicator` 물결 `background-position 100% → 0` 1500ms `linear` 무한, `background-size: 200%`.
- 진행 막대 · 스피너: CSS 에 `#nprogress .spinner-icon .4s linear` · `animate-loading-bar 1.5s linear` · `animate-spin 2s linear`. 이번 누름(로고 → 홈)에서 막대는 못 잡음.

### TETR.IO 기록 (ch.tetr.io/u/czsmall0402)

- 로딩 표시: 화면 전체 로더 `#loader_anim{animation:3s LoaderSpin ease-out infinite}`(테트로미노 칸이 `box-shadow` 로 옮겨 다님). 첫 로드 · 사이트 안 이동 모두. 스켈레톤 없음.

### Twitch (twitch.tv)

- 띄우기 전 지연: 첫 셸 로더 `shell-display` 가 `animation-delay: 300ms` 뒤 100ms `linear` 로 나타남. 스피너 `tw-loading-spinner` 도 `delay 300ms` 뒤 150ms `ease` 페이드인. 자리 표시 물결도 `delay 300ms`.
- 스피너: 원 회전 1000ms `linear`.
- 스켈레톤: `ScPlaceholderFill::before` 물결 `translateX(-100% → 100%)` 2000ms `ease-out`, 10번 되풀이 뒤 멈춤.

### Steam 최다 플레이 (store.steampowered.com/charts/mostplayed)

- 스켈레톤: 물결 `background-position-x: -250px → …` 2000ms `linear` 무한.
- 로딩 표시: 사이트 안 이동 때 `LoadingThrobber` 막대 셋이 `scaleY` 로 출렁임 1000ms `ease-in-out` 무한.

### YouTube (youtube.com)

- 위쪽 진행 막대: `yt-page-navigation-progress`. 누른 뒤 78ms 에 나타나 `transform: scaleX(0 → 0.12 → 0.24 → 0.36 …)` 로 1.27s 동안 77번 차오름. 한 걸음 전환은 `transform` 80ms `ease`. 새 화면은 View Transition 250ms `ease` 로 바뀜.
- 스켈레톤 · 스피너: 이번 측정에서 미검출.

### Linear (linear.app)

- 로딩 표시: 점 격자 로더 `grid-dot-*-upDown` 2800ms `steps(1)` 무한(점이 한 칸씩 켜졌다 꺼짐, 불투명 0.3 ↔ 1). 소개 화면 안 예시 UI.

### Vercel (vercel.com)

- 로딩 표시 미검출. CSS 에 글자 물결 `animate-thinking-loader`(`background-size: 300%` 글자 그라데이션)만.

### Discord (discord.com)

- 로딩 표시 미검출(소개 화면). CSS 에 `spinner-wandering-cubes 1.8s ease-in-out` · `spinner-chasing-dots 2s linear` · 라이트박스 `.8s linear`.

### CoinGecko (coingecko.com 비트코인)

- 그래프 로딩: 차트 위 `gecko-loading-overlay` 가 데이터가 오면 `opacity 1 → 0` 300ms `ease` 로 사라짐. 실시간 가격 글자 `opacity` 300ms `cubic-bezier(0.4, 0, 0.2, 1)`. Highcharts 4개, 계열 드러남 움직임은 이번 측정에서 미검출.
- 스켈레톤: `gecko-skeleton{animation:tw-pulse 2s cubic-bezier(.4,0,.6,1) infinite}`(깜빡임), AI 영역 `gm-skeleton-shimmer 1.5s ease-in-out`(물결).
- 스피너: Font Awesome `fa-spin` 2000ms `linear`.

### Spotify 웹 플레이어 (open.spotify.com)

- 스켈레톤: 제목 · 카드 자리 `::after` 물결 `translate(-100% → 100%)` 2000ms `ease` 무한.
- 스피너: 점 셋 `circle` 1320ms(키프레임 `cubic-bezier(1, 0, 0.7, 1)`, 불투명 · 크기), `progress-circle-indeterminate 1s linear`(CSS).

### 다음 메인 (www.daum.net) · 프로그래머스 (programmers.co.kr)

- 두 곳 모두 로딩 표시 · 그래프 움직임 미검출.

### TradingView (tradingview.com/symbols/BTCUSD)

- 측정 실패: 240초 안에 페이지 로드가 끝나지 않아 결과 없음. 세지 않음.

## 세지 않은 곳

빗썸(HTTP2 오류) · 오늘의집(Access Denied) · lichess(확인 화면) · TradingView(시간 초과). 로그인 화면으로 간 누름 단계(29CM · 로아와)는 그 단계만 세지 않았다.

## 방식별 묶음

실측한 실제 서비스 45곳(막힌 4곳 제외). 디자인 시스템은 세지 않았다. 「화면」 은 실측 화면에서 움직임이 잡힌 곳, 「CSS」 는 스타일시트 규칙만 본 곳이다. 지금 NosLog 값은 [기초값 — 움직임](../design/foundations.md#움직임).

### 스켈레톤

| 방식                   | 시간 · 곡선                                                                       | 화면에서 잡힌 곳                               |
| ---------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------- |
| 깜빡임(불투명)         | 2000ms `cubic-bezier(0.4, 0, 0.6, 1)`, 1 → 0.5 → 1 (Tailwind 기본)                | TVING · OP.GG · 로아와 · CoinGecko (4)         |
| 깜빡임(불투명)         | 2000ms `ease-in-out`, 0.5 → 1 → 0.5 · 배경색                                      | 원티드 · 왓챠피디아 (2)                        |
| 깜빡임(불투명)         | 1200ms `linear`, 1 → 0.5 → 1                                                      | Npay 증권 모바일 · Npay 증권 PC (2, 같은 회사) |
| 깜빡임(불투명)         | 1500ms `linear` 0.4 → 1 → 0.4 / 1500ms `ease-in-out` 지연 500ms                   | 인프런 / 업비트 (각 1)                         |
| 깜빡임(불투명)         | 1000ms `ease-in-out` · 1000ms `cubic-bezier(0.33, 0, 0.67, 1)` · 500ms `ease-out` | velog · 무신사 · 치지직 (각 1)                 |
| 물결(밝은 띠가 지나감) | 1500ms `ease-in-out` · `ease`                                                     | 롤체지지 · 메이플지지 · Chess.com (3)          |
| 물결                   | 2000ms `linear` · `ease` · `ease-out`(10번 뒤 멈춤)                               | 네이버 날씨 · Steam · Spotify · Twitch (4)     |
| 물결                   | 1000–1500ms `linear` · `ease`                                                     | GitHub · 토스증권 · Tracker.gg (3)             |

깜빡임 13곳 · 물결 10곳. 깜빡임은 2000ms 가 6곳으로 가장 많고, 물결은 1500ms 와 2000ms 가 각 4곳 안팎이다. 지금 NosLog(1600ms `ease-in-out` 깜빡임, 1 → 0.5)와 같은 값은 없다.

### 스피너 한 바퀴

| 시간      | 곡선                                  | 화면에서 잡힌 곳                                 |
| --------- | ------------------------------------- | ------------------------------------------------ |
| 750–800ms | `linear`                              | osu! · 카카오페이지 (2)                          |
| 1000ms    | `linear`                              | OP.GG(작은 것) · 로아와 · V-ARCHIVE · Twitch (4) |
| 1200ms    | `linear`                              | 인프런 · SOOP(살 12개 차례 흐림) (2)             |
| 1800ms    | 회전 `linear` + 호 길이 `ease-in-out` | 토스증권 (1)                                     |
| 2000ms    | `linear`                              | OP.GG(큰 원) · CoinGecko (2)                     |

CSS 에만 있는 것: Toastify 650ms `linear`(Npay 증권 · velog · 롤체지지 · 닥지지 · Tracker.gg), 750ms(무신사 · 업비트), 800ms(네이버웹툰 · 닥지지 · Discord), 1000ms(GitHub · 왓챠피디아), 2000ms(Font Awesome, 롤체지지 · osu!). 회전 곡선은 거의 모두 `linear` 이고, 예외는 치지직 플레이어 1400ms `ease-in-out` · osu! 사진 뷰어 1000ms `cubic-bezier(.4,0,.22,1)` 둘(CSS). 1000ms 가 가장 많다. 지금 NosLog 800ms `linear` 와 같은 곳은 osu!(750) · 카카오페이지(800) 둘.

### 위쪽 진행 막대 (근거 약함, 4곳)

| 곳      | 라이브러리                          | 누른 뒤 처음 보인 때 | 차오름                                         | 끝                                  |
| ------- | ----------------------------------- | -------------------- | ---------------------------------------------- | ----------------------------------- |
| YouTube | 자체(`yt-page-navigation-progress`) | 78ms                 | `scaleX` 걸음마다 80ms `ease`, 1.27s 에 77걸음 | View Transition 250ms               |
| osu!    | Turbo                               | 96ms(지연 설정 0)    | 10% 에서 시작, 300ms `ease-out` 걸음           | 100% 뒤 `opacity` 150ms(지연 150ms) |
| OP.GG   | NProgress                           | 168ms                | 100ms `ease` 걸음, 3.1s 에 33걸음              | `opacity` 100ms `linear`            |
| TVING   | NProgress                           | 344ms                | 200ms `ease` 걸음, 3.2s 에 8걸음               | `opacity` 200ms `linear`            |

네 곳 모두 일정 시간 동안 차오르는 방식이 아니라 몇백 ms 마다 조금씩 늘리는 걸음 방식이다. 처음 보인 때는 처리 시간을 포함한 값이라 라이브러리 지연 설정과 같지 않다(지연 1200ms 망).

### 로딩 표시를 띄우기 전 지연 (근거 약함, 3곳)

| 곳     | 대상                                 | 지연                     |
| ------ | ------------------------------------ | ------------------------ |
| Twitch | 첫 셸 로더 · 스피너 · 자리 표시 물결 | `animation-delay` 300ms  |
| 업비트 | 스켈레톤 물결                        | `animation-delay` 500ms  |
| SOOP   | 플레이어 로딩 표시                   | `animation-delay` 3000ms |

진행 막대 네 곳은 지연 설정이 보이지 않는다(osu! 는 Turbo 기본 500ms 를 0 으로 바꿔 둠). 나머지 곳은 지연 값을 찾지 못했다(미확인).

### 그래프 나타남 · 값 바뀜

| 방식                            | 시간 · 곡선                                                                | 곳                           |
| ------------------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| 막대가 왼쪽(아래)부터 자람, CSS | 500–680ms, 감속 `cubic-bezier(.22,.9,.3,1)` · `(.2,.8,.2,1)` · `ease-out`  | 다음 금융 · V-ARCHIVE (2)    |
| 선이 왼쪽부터 드러남            | 1000ms Highcharts `swing` / 1200ms `cubic-bezier(.22,.7,.2,1)` stroke-dash | Steam Charts · 다음 금융 (2) |
| 라이브러리 기본                 | Chart.js 1000ms `easeOutQuart` / Highcharts 약 1.7s                        | FOW · DEEPLOL (2)            |
| 긴 드러남                       | 2000ms `cubic-bezier(0.215, 0.61, 0.355, 1)` / JS 약 2.6s                  | 네이버 날씨 · 지니 (2)       |
| 값 바뀜이 옮겨 감               | JS 약 2.1s 감속(게이지 점)                                                 | Npay 증권 PC (1)             |
| 움직임 없이 바로                | 실시간 값 · 선 그래프 즉시                                                 | 토스증권 · 업비트 · osu! (3) |

드러남이 있는 곳 8곳 · 바로 그리는 곳 3곳. 같은 막대 값이 바뀔 때 옮겨 가는 것을 잡은 곳은 Npay 증권 PC 하나뿐이라 「값 바뀜」 은 근거 약함이다. 드러남 시간은 500ms 대(CSS 막대) 와 1000ms 대(차트 라이브러리) 로 나뉜다. 지금 NosLog 는 드러남 800ms · 값 바뀜 300ms.
