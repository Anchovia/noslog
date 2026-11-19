# 겹침 움직임 — 대화상자 · 토스트 · 바텀시트 · 사이드 패널 실측

조사일 2026-11-19. 공통 층 3단계 움직임 판(판 3 「당근에 없거나 방식이 다른 자리」)의 재료다. 실제 서비스만 센다(디자인 시스템은 따로 센다).

## 재는 법

- headless Chromium(Playwright), colorScheme dark, ko-KR. 데스크톱 1440×900, 모바일 390×844(iPhone UA · 터치).
- 쪽을 열고 버튼을 누르기 직전부터 1.4초 동안 프레임마다(약 16ms) 겹침 후보(대화상자 role · aria-modal · 고정 위치 요소 · 이름에 modal · toast · sheet · drawer · overlay 등)의 계산된 `opacity` · `transform` · 위치 · 크기를 적고, 같은 동안 `document.getAnimations()` 로 잡힌 CSS transition · CSS animation · Web Animations 의 시간 · 곡선 · 키프레임을 적었다. 닫힘도 같은 방법으로 따로 쟀다.
- CSS 출처는 겹침 요소에 걸린 규칙의 선택자와 스타일시트 주소다. 교차 출처라 읽지 못한 시트는 「시트 막힘」 으로 적었다.
- 곳마다 영상(webm)과 누른 순간부터 0.05초 간격 12장 프레임 띠를 남겼다. 경로는 `~/noslog-research/motion-overlay-2026-11-19/` 아래 `video/<곳>.webm` · `frames/<곳>-<경우>-<open|close>.jpg` · 원자료 `json/<곳>.json`. 커밋하지 않는다.
- 로그인 벽 · 캡차 · 팝업에 막혀 겹침을 열지 못한 곳은 세지 않고 막혔다고 적었다.
- 표기: 「떠오름 8px」 은 아래에서 위로 8px, 「크기 .95→1」 은 transform scale, 시간은 ms, 곡선은 CSS 값 그대로.

## 같은 방식끼리 묶음

센 곳은 실제 서비스 39곳(국내 28 · 해외 11)이다. 막혀서 세지 않은 곳은 쿠팡플레이 · 쿠팡 · 오늘의집(Akamai 차단)과 리디(Cloudflare 확인 화면)이다. 카카오페이지 · 멜론은 겹침을 열지 못해 세지 않았다. 한 곳이 여러 자리에 들어갈 수 있다. 값은 아래 「곳마다 기록」 과 원자료 json 에 있다. 디자인 시스템은 세지 않았다.

### 대화상자 · 알림 대화상자 (19곳)

| 방식                         | 곳 수 | 서비스(열림 값 · 닫힘 값)                                                                                                                                                                                  |
| ---------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 움직임 없음(즉시)            | 9     | 업비트 · 원티드(앱 설치) · 29CM(로그인) · 왓챠(로그인) · 티빙(검색) · FLO(로그인) · Twitch(로그인 · 가입) · 직방(로그인, 닫힘 미확인) · 여기어때(검색 조건, 닫힘만 페이드 200ms)                           |
| 상자는 즉시, 가림막만 페이드 | 1     | YouTube 공유(가림막 0→.3, 200ms ease)                                                                                                                                                                      |
| 페이드만                     | 2     | 브런치 로그인(층 페이드 200ms, 곡선 미확인) · 웨이브 홍보(닫힘만 잼, 300ms ease)                                                                                                                           |
| 페이드 + 크기                | 2     | 토스증권 검색(.96→1, opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1), 닫힘 160ms) · Netflix 작품 소개(.88→1 533ms, opacity 100ms 지연 100ms, 가림막 250ms, cubic-bezier(0.32, 0.94, 0.6, 1), 닫힘은 거꾸로) |
| 페이드 + 위에서 내려옴       | 2     | GitHub 검색(-8px→0, 200ms cubic-bezier(0.3, 0.8, 0.6, 1), 닫힘 즉시) · 카카오뱅크 검색 판(-30px→0, 350ms ease)                                                                                             |
| 페이드 + 아래에서 떠오름     | 1     | Spotify 로그인 권유(20px, 400ms ease-in-out, 150ms 지연, 닫힘 즉시)                                                                                                                                        |
| 아래에서 튀어 오름           | 1     | 벨로그 로그인(translateY 400px · scale .75 → -16px → 0, 400ms, 닫힘 200ms 아래로)                                                                                                                          |
| 화면 전체 층 즉시            | 1     | 네이버 모바일 검색 층(안쪽 뒤로 단추만 크기 .5→1 300ms)                                                                                                                                                    |

- 지금 NosLog 방식(페이드 + 8px 떠오름)과 같은 꼴은 Spotify 1곳(거리 20px)이다. 근거 약함.
- 당근 방식(크기로 나타남)과 같은 꼴은 토스증권 · Netflix 2곳이다. 근거 약함.
- 실측한 당근 웹에서는 대화상자를 열지 못했다(모바일 「검색창 열기」 단추 disabled).

### 토스트 · 스낵바 (3곳, 근거 약함)

| 방식                     | 서비스                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| 아래에서 떠오름 + 페이드 | 무신사 링크 복사(스프링, 480ms, JS) · YouTube 링크 복사(500ms ease) |
| 움직임 없음              | Spotify 링크 복사(notistack)                                        |

- 나머지 곳은 로그인 없이 토스트를 띄울 동작이 없었다. 네이버 웹툰 「복사」 는 토스트가 아닌 같은 자리 알림 카드(즉시, 저절로 사라지지 않음)라 세지 않았다.
- 당근은 스낵바 자리 규칙(`.seed-snackbar-region` bottom transition `--seed-duration-d4`)만 봤고 등장 움직임은 미확인이다.

### 바텀시트 (12곳)

| 방식                                  | 곳 수 | 서비스(열림 · 닫힘)                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 아래에서 올라옴, CSS                  | 5     | 당근(translate 100%→0 300ms cubic-bezier(0.03, 0.4, 0.1, 1) · 닫힘 200ms cubic-bezier(0.35, 0, 1, 1), 가림막 rgba(0,0,0,.455) 페이드 300 · 200ms) · 야놀자(300ms ease-out 또는 280ms cubic-bezier(0.4, 0, 0.2, 1) + 가림막 페이드 · 닫힘 300ms 아래로 + 페이드 210ms ease-in) · 티빙(약 280ms 감속 · 닫힘 200ms ease-out 페이드 + 내려감) · 카카오웹툰(닫힘만 잼, 200ms ease-in-out, 가림막 200ms ease-out) · 지그재그(약 200ms · 닫힘 100ms linear 페이드 + 이동) |
| 아래에서 올라옴, JS 구동(곡선 미확인) | 4     | 무신사(약 413ms) · 29CM(약 563ms) · 번개장터(약 560 · 334ms, 닫힘 즉시) · KREAM 필터(약 461ms, 스크롤로 올림)                                                                                                                                                                                                                                                                                                                                                      |
| 움직임 없음                           | 4     | YouTube 모바일 공유 · 치지직 액션 시트 · 웨이브 앱 유도(닫힘만 잼) · KREAM 정렬(영상 대조 못 함, 미확인)                                                                                                                                                                                                                                                                                                                                                           |

- KREAM 은 두 줄에 모두 들어 있다. 위 표의 곳 수는 13이고, 곳으로 세면 12곳이다(야놀자 · 당근은 시트 두 개가 같은 값).

### 사이드 패널 · 드로어 · 전체 화면 메뉴 (22곳)

| 방식                                 | 곳 수 | 서비스(열림 · 닫힘)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 옆에서 밀려옴                        | 12    | YouTube 가이드(왼쪽, 200ms ease · 같음) · SOOP(왼쪽 -230px, 200ms ease-out · 같음, 가림막 즉시) · 브런치(왼쪽, 300ms ease-out) · 로스트아크(왼쪽 폭 300, 300ms ease · 같음) · Steam(왼쪽 폭 280, 500ms ease · 같음) · 메이플스토리(왼쪽 폭 440, 500ms cubic-bezier(0.23, 1, 0.32, 1), 가림막 0→.7) · 카카오뱅크(오른쪽 100%, 400ms ease-in-out · 같음) · Discord(오른쪽, 약 330 · 270ms JS) · KREAM(오른쪽, 150ms ease-in-out) · 지그재그 필터(오른쪽, 240ms · 닫힘 즉시) · 여기어때(오른쪽 + 페이드 200ms ease-out · 닫힘 300ms ease-out) · 네이버 지도 왼쪽 패널(translateX -100% + 폭 390→0, 400ms cubic-bezier(0.215, 0.61, 0.355, 1)) |
| 제자리 페이드                        | 2     | 토스 전체 메뉴(400ms, 끝에서 넘는 스프링꼴 linear()) · Linear(180ms ease · 같음)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 위에서 내려옴 + 페이드(떠 있는 카드) | 1     | 티빙 햄버거(150ms cubic-bezier(0, 0, 0.2, 1) · 같음)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 움직임 없음                          | 8     | GitHub 모바일 · Vercel · 카카오맵(가림막 rgba(0,0,0,.35)) · 원티드 · 왓챠 · 치지직 · 배달의민족 · 원티드 검색 층                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

- 원티드는 메뉴와 검색 층을 따로 적었다. 곳으로 세면 움직임 없음은 7곳이다.

## 곳마다 기록

### 당근 — 모바일 (https://www.daangn.com/kr/buy-sell/)

- 확인 2026-11-19 · 영상 `video/daangn-m2.webm` · 프레임 `frames/daangn-m2-filter-open.jpg` · `frames/daangn-m2-region-open.jpg` · 원자료 `json/daangn-m2.json`
- 바텀시트 열림(「필터」 · 지역 「서울특별시 중구 신당동」 두 곳 같음): 아래에서 올라옴 `translate3d(0, 100%, 0)`→`0`, 300ms cubic-bezier(0.03, 0.4, 0.1, 1), 시트 자체 페이드 없음. 출처 CSS animation `drawer-slide-from-bottom` · `.seed-bottom-sheet__content--skipAnimation_false { animation-duration: var(--seed-duration-d6); animation-timing-function: var(--seed-timing-function-enter-expressive) }`(SEED 디자인 시스템).
- 바텀시트 닫힘(Escape): `none`→`translate3d(0, 100%, 0)`, 200ms cubic-bezier(0.35, 0, 1, 1). 출처 CSS animation `drawer-slide-to-bottom`.
- 가림막: rgba(0, 0, 0, 0.455), 열림 opacity 0→1 300ms cubic-bezier(0, 0, 0.15, 1)(`fade-in`), 닫힘 1→0 200ms cubic-bezier(0.35, 0, 1, 1)(`fade-out`). 시트와 같이 시작한다.
- 시트 모서리 위 두 곳 `--seed-radius-r6`, 면 rgb(29, 32, 37). 필터 시트 높이 780px(위 64px 남김), 지역 시트 633px.
- 토스트: 못 엶(공개 쪽에 띄울 동작 없음). 스낵바 자리 `.seed-snackbar-region` 의 `bottom` transition 이 `--seed-duration-d4` 로 걸려 있는 것만 규칙으로 봤다. 등장 움직임은 미확인.
- 대화상자: 못 엶(모바일 「검색창 열기」 aria-haspopup=dialog 단추가 /kr/buy-sell/ 에서 disabled · aria-hidden, /kr/ 에서는 누를 수 있는 단추를 찾지 못함).
- 「전체 서비스 메뉴」 드롭다운은 메뉴라 세지 않았다(앞서 잼: fade + translateY -8px 150ms).
- 참고: 도구의 프레임 띠가 실제 누른 순간보다 0.5초쯤 늦게 잘려, 영상에서 누르기 1초 앞부터 다시 뽑아 시트가 아래에서 올라오고 내려가는 것을 눈으로 확인했다.

### 토스 — 모바일 · 데스크톱 (https://toss.im)

- 확인 2026-11-19 · 영상 `video/toss-m.webm` · `video/toss.webm` · 원자료 `json/toss-m.json` · `json/toss.json`
- 모바일 전체 화면 메뉴(「메뉴 열기」, 화면을 덮는 패널) 열림: 옆에서 밀려오지 않고 제자리 페이드. 패널 opacity 0→1, 400ms, 곡선 `linear(0, 0.0235 2.56%, … 1.0151 59%, … 1)`(끝에서 1.015 까지 넘었다 돌아오는 스프링꼴). 밑 화면은 흐려진다(영상에서 뒤 사진이 번지며 흰 면으로 덮임). 메뉴 글자는 줄마다 opacity 0→1 200ms cubic-bezier(0.6, 0, 0, 0.6), 줄마다 지연 0 · 200ms 로 차례로 나타남. 출처 Web Animations(JS), 시트 막힘 19개라 CSS 규칙 미확인.
- 모바일 메뉴 닫힘(「메뉴 닫기」): opacity 1→0, 400ms 같은 linear() 곡선, 움직임 없음.
- 데스크톱 「앱 다운로드」: 단추 아래 QR 상자(role=dialog, 폭 170px쯤, 화면을 덮지 않음)가 opacity 0→1 400ms cubic-bezier(0.6, 0, 0, 0.6) 로 나타나고, Escape 로 1→0 100ms cubic-bezier(0.34, 1.56, 0.64, 1). 화면을 덮지 않는 팝오버라 대화상자로 세지 않았다.
- 대화상자 · 토스트 · 바텀시트: 못 엶(공개 홈에 여는 동작 없음, 「서비스」 · 「비즈니스」 는 메뉴라 세지 않음).

### 토스증권 — 데스크톱 (https://www.tossinvest.com)

- 확인 2026-11-19 · 영상 `video/tossinvest.webm` · 프레임 `frames/tossinvest-search-open.jpg` · `frames/tossinvest-watchlogin-open-end.png` · 원자료 `json/tossinvest.json`
- 검색 대화상자 열림(머리 「/ 를 눌러 검색하세요」, role=dialog 640×600, 화면 위쪽 가운데, 뒤를 어둡게 덮음): 크기 .96→1 과 opacity 0→1 함께. opacity 200ms cubic-bezier(0.25, 0.1, 0.25, 1), 크기는 JS 구동으로 약 340ms 걸려 끝남(곡선 미확인), 안쪽 내용은 opacity 0→1 600ms 스프링꼴 `linear(…)`. 가림막 opacity 0→1 200ms 같은 곡선. 출처 Web Animations(JS), 시트 막힘 3개. 누른 뒤 열리기까지 약 2.2초 걸렸다(검색 코드를 불러오는 시간으로 보임, 움직임 시간에 넣지 않음).
- 검색 대화상자 닫힘(Escape): opacity 1→0 160ms cubic-bezier(0.25, 0.1, 0.25, 1), 크기 1→.96, 가림막도 160ms 로 같이 사라짐.
- 로그인 상자(목록 「관심종목설정하기」 하트): QR 로그인 상자(role=dialog 240×255)가 누른 자리 옆에 뜨고 가림막 없음. 열림 크기 .98→1 + opacity 0→1, 약 200ms(JS 구동, 곡선 미확인). 닫힘 opacity 1→0 100ms cubic-bezier(0.16, 1, 0.3, 1), 크기 1→.98. 화면을 덮지 않는 상자라 대화상자 수에는 넣지 않고 참고로 적는다.
- 토스트 · 바텀시트 · 사이드 패널: 못 엶(로그인 없이 띄울 동작 없음). 「지금 뜨는 산업」 은 이름으로 찾지 못해 못 엶.
- 참고: 시세 칸이 값이 바뀔 때 배경색이 2000ms 동안 빠지는 움직임이 계속 잡혀 겹침 기록에서 뺐다.

### 무신사 — 모바일 (https://www.musinsa.com/category/001/goods?gf=A)

- 확인 2026-11-19 · 영상 `video/musinsa-m.webm` · `video/musinsa-m2.webm` · 프레임 `frames/musinsa-m-share-open.jpg` · `frames/musinsa-m2-price-open.jpg` · `frames/musinsa-m2-copylink-open.jpg` · 원자료 `json/musinsa-m.json` · `json/musinsa-m2.json`
- 필터 바텀시트(「가격」 칩) 열림: 높이 760px 시트가 아래에서 올라옴 translateY 759.6px→0, 약 413ms(첫 변화부터 끝까지), 끝에 느리게 붙는 감속 곡선, 시트 페이드 없음. 요소 `div.motion` 의 transform 만 프레임마다 바뀌고 CSS transition · animation 이 없어 JS 구동, 곡선 미확인. 시트는 Radix `[role=dialog]`. 시트 위 84px 를 남긴다.
- 필터 바텀시트 닫힘(가림막 누름): 누른 뒤 약 100ms 뒤 시작, translateY 0→759.6px 약 384ms, JS 구동.
- 필터 가림막: rgba(0, 0, 0, 0.6), 요소 opacity 변화가 잡히지 않음(시트와 같은 프레임에 나타남).
- 공유 바텀시트(목록 왼쪽 아래 공유 단추) 열림: 높이 230px 시트 translateY 230px→0 약 394ms(1px 안까지), 페이드 없음. JS 구동(`section._sheet`), 곡선 미확인.
- 공유 가림막: 검정 opacity 0→0.6, Web Animations 400ms linear 에 표본 키프레임(스프링을 표본으로 굽힌 꼴)으로 시트와 같이 시작.
- 공유 바텀시트 닫힘(가림막 누름): translateY 0→230px 약 380ms, 가림막 0.6→0 Web Animations 400ms linear(표본 키프레임).
- 토스트(공유 시트 「링크복사」 → 「링크가 복사되었습니다.」): 하단 탭 위 스낵바(면 rgb(42, 42, 42), 폭 358 · 높이 36). 아래에서 떠오름 36px→0 + opacity 0→1, Web Animations 480ms linear(표본 키프레임), 끝에 약 1.5px 넘쳤다 돌아오는 스프링. 약 2.5초 머문 뒤 아래로 36px 내려가며 페이드 아웃(약 170ms 넘게, 끝 미확인). 공유 시트가 내려가는 것과 같이 시작한다.
- 대화상자 · 사이드 패널: 못 엶(「무신사 추천순」 은 드롭다운 메뉴라 세지 않음, 사이드 드로어 단추 없음).
- 규칙: 스타일시트 8개 교차 출처라 읽지 못함(시트 막힘).

### 왓챠 — 모바일 (https://watcha.com)

- 확인 2026-11-19 · 영상 `video/watcha-m.webm` · 프레임 `frames/watcha-m-drawer-open.jpg` · `frames/watcha-m-login-open.jpg` · `frames/watcha-m-login-close.jpg`
- 사이드 패널(햄버거 메뉴) 열림: 화면 전체를 덮는 `div.nhrZI[role=dialog]` 가 누른 뒤 첫 측정 프레임(120ms)에 opacity 1 · transform 없음으로 바로 나타난다. 미끄러짐 · 페이드 없음(띠에서도 다음 프레임에 완성). CSS transition · animation 잡히지 않음.
- 사이드 패널 닫힘: 닫기(X)를 누르면 다음 프레임에 사라진다. 움직임 없음.
- 대화상자(로그인 필요, 상세 쪽 「구매하기」): `#modal-root>div.dbv15` 가림막(0,0 390×844)과 위쪽 가운데 상자가 69ms 프레임에 opacity 1 로 바로 나타난다. 가림막 · 상자 모두 transition · animation 없음. Escape 로는 닫히지 않는다.
- 대화상자 닫힘: X · 가림막 클릭 모두 다음 프레임에 사라진다. 움직임 없음.
- 데스크톱: 로그아웃 상태 첫 화면에 콘텐츠가 없고 「소식함」 은 드롭다운 팝오버(크기 .8 상태로 보임)라 세지 않았다.
- 토스트 · 바텀시트: 못 엶(로그아웃 상태 상세 쪽 「더보기」 는 보이지 않는 상태라 누르지 못함, 공유 단추 없음).
- 시트 막힘: CSS 76–78개 시트가 교차 출처라 규칙은 미확인. 위 값은 계산값과 프레임 띠.

### GitHub — 데스크톱 · 모바일 (https://github.com/vercel/next.js)

- 확인 2026-11-19 · 영상 `video/github-s.webm` · `video/github-m.webm` · 프레임 `frames/github-s-search-open.jpg` · `frames/github-m-nav-open.jpg`
- 검색 대화상자 열림(데스크톱, `/` 키와 위 막대 검색 단추 둘 다 같음): 화면 위쪽 머리 자리에 붙어 열리고, 위에서 내려옴 translateY -8px→0 과 opacity 0→1, 200ms cubic-bezier(0.3, 0.8, 0.6, 1). 출처 CSS animation `quickSearchPanelIn` · `.Panel__NcXYLC[role=dialog]`.
- 검색 대화상자 가림막: opacity 0→1, 200ms cubic-bezier(0.33, 1, 0.68, 1). 출처 CSS animation `prc-Dialog-dialog-backdrop-appear` · `.prc-Dialog-Backdrop`(Primer).
- 검색 대화상자 닫힘(Escape): 움직임 없이 바로 사라짐(닫힘 1.4초 동안 잡힌 animation · transition 0, 프레임 띠 첫 장부터 닫힌 화면).
- 모바일 사이드 메뉴(머리 오른쪽 햄버거): 화면 전체를 덮는 메뉴가 움직임 없이 바로 나타남(누른 뒤 첫 프레임에 opacity 1 · 위치 그대로, animation · transition 0). 닫힘도 바로 사라짐.
- 모바일 검색 대화상자: 못 엶(검색 단추가 보이지 않는 상태라 클릭 시간 초과).
- 「Go to file」 은 입력칸 아래 목록이라 메뉴로 보고 세지 않음. 토스트 · 바텀시트: 로그인 없이 여는 자리 못 찾음.

### YouTube — 데스크톱 (https://www.youtube.com/watch?v=jNQXAC9IVRw)

- 확인 2026-11-19 · 영상 `video/youtube.webm` · 프레임 `frames/youtube-share-open.jpg` · `frames/youtube-copytoast-open.jpg` · `frames/youtube-guide-open.jpg`
- 다크 요청(colorScheme dark)에도 로그아웃 상태 화면은 밝은 테마로 열렸다.
- 공유 대화상자 열림: 누른 뒤 약 640ms 에 불러오기 원(spinner)이 든 상자가 움직임 없이 나타나고, 내용이 차면서 높이 313→337px 로 바로 늘어남. 대화상자 자체의 opacity · transform 변화 없음.
- 공유 대화상자 가림막: `tp-yt-iron-overlay-backdrop` opacity 0→0.3, 200ms ease(CSS transition `opacity`). 닫힘 0.3→0, 200ms ease.
- 공유 대화상자 닫힘(Escape): 상자는 움직임 없이 바로 사라지고 가림막만 200ms 동안 옅어짐.
- 토스트(공유 → 복사): 아래에서 올라옴 translateY(100%)→0 과 opacity 0→1, 500ms ease. 출처 CSS animation `snackbar-slide-in-from-bottom` · `snackbar-container .ytSnackbarContainerOpened`. 자리는 화면 왼쪽 아래(y 870px 부근, 높이 64px). 사라짐은 측정 시간(2.2초) 안에 오지 않아 미확인.
- 가이드 드로어(보기 쪽 햄버거, 1440 폭에서도 겹침 드로어): 왼쪽에서 밀려옴 translate3d(-100%,0,0)→0, 200ms ease(CSS transition `transform` · `tp-yt-app-drawer #contentContainer`). 가림막 `#scrim` opacity 0→1 200ms ease.
- 가이드 드로어 닫힘(Escape): translate 0→-100%, 200ms ease, 가림막 1→0 200ms ease. 열림과 같은 값.

### 업비트 — 데스크톱 (https://upbit.com)

- 확인 2026-11-19 · 영상 `video/upbit.webm` · 원자료 `json/upbit.json`
- 대화상자 열림(홈 자산맵 「자산맵 기준 안내」, `#modal > div.css-w2xwom` 흰 면 410×600, 화면 가운데, 회색 가림막): 움직임 없음. 누른 뒤 첫 프레임(16ms)에 다 그려진 채 나타나고 opacity · transform 변화 없음. 쪽을 열면 뜨는 이벤트 팝업 자리를 그대로 바꿔 끼운다.
- 대화상자 닫힘(Escape): 움직임 없음. 다음 프레임에 사라지고 뒤의 이벤트 팝업이 다시 보인다. 영상 띠에서 중간 프레임 없이 바뀌는 것을 확인했다.
- 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다(colorScheme dark 걸었음).
- 토스트 · 바텀시트 · 사이드 패널: 못 엶(로그인 없이 띄울 동작 없음, 모바일 첫 화면은 앱 안내 쪽이라 햄버거 없음). 「전체화면」 단추는 자산맵 전체 화면 보기라 겹침이 아니어서 세지 않았다. 쪽을 열 때 뜨는 이벤트 팝업의 닫기 단추는 찾지 못해 못 잼.

### 29CM — 모바일 (https://www.29cm.co.kr)

- 확인 2026-11-19 · 영상 `video/29cm-m2.webm` · `video/29cm-m3.webm` · 프레임 `frames/29cm-m2-like-open.jpg` · `frames/29cm-m3-buy-open.jpg` · 원자료 `json/29cm-m2.json` · `json/29cm-m3.json`
- 대화상자 열림(홈 상품 좋아요 단추 → 「로그인이 필요해요.」 취소 · 로그인 하기 두 단추): 움직임 없음. 가림막과 상자가 한 프레임에 나타나고 opacity · transform 변화가 잡히지 않았다(`#ruler_alert-dialog`, 상자 폭 350 · 높이 181, 둥근 모서리 8).
- 대화상자 닫힘(「취소」): 움직임 없음. 영상 20fps 로 한 프레임 만에 사라짐을 확인했다.
- 옵션 바텀시트 열림(상품 쪽 「구매하기」): 높이 162px 시트 translateY 162px→0, 약 563ms(첫 변화부터 끝까지), 앞 100ms 에 대부분 움직이고 긴 꼬리로 붙는 감속, 페이드 없음. CSS transition · animation 이 없어 JS 구동, 곡선 미확인(`#ruler_bottom-sheet`).
- 옵션 바텀시트 닫힘(가림막 누름): translateY 0→162px 약 567ms, 처음 빠르고 끝이 느린 감속, JS 구동.
- 가림막: rgba(0, 0, 0, 0.58), opacity 변화 없이 시트와 같은 프레임에 나타남.
- 참고: 상품 쪽을 열면 Braze 앱 안 메시지(신규 회원 쿠폰 시트, `.ab-iam-root`)가 먼저 떠서 지우고 쟀다. 이 메시지의 닫힘은 CSS transition opacity 1→0 500ms ease(Braze SDK)였다. 서비스 자체 부품이 아니라 세지 않았다.
- 토스트: 못 엶(좋아요는 로그인 대화상자로 막힘).
- 사이드 패널: 못 엶(하단 「카테고리」 · 「검색」 은 쪽 이동).
- 규칙: 스타일시트 4–6개 교차 출처라 읽지 못함(시트 막힘).

### Twitch — 데스크톱 (https://www.twitch.tv/directory)

- 확인 2026-11-19 · 영상 `video/twitch.webm` · 프레임 `frames/twitch-login-open.jpg` · `frames/twitch-login-close.jpg`
- 로그인 대화상자 열림(위 막대 「로그인」): 가림막과 상자 틀이 움직임 없이 바로 나타남(누른 뒤 약 100ms 첫 프레임에 opacity 1, transform 없음). 상자 안은 불러오기 원(CSS animation opacity 0→1, 150ms ease, 지연 300ms)이 먼저 뜨고 약 200ms 에 입력 폼으로 바뀌며 높이 24→495px 로 바로 늘어남. 출처 react-modal(`ReactModal__Overlay.modal__backdrop` · `ReactModal__Content`), 상자 자체 transition 규칙 없음.
- 로그인 대화상자 닫힘(Escape): 움직임 없이 바로 사라짐(닫힘 animation · transition 0, 프레임 띠 5번째 장에서 한 번에 바뀜).
- 가입 대화상자 열림: 로그인과 같은 방식(가림막 · 틀 바로 나타남, 약 590ms 에 내용이 차며 높이 바로 바뀜). 닫기 단추는 클릭 시간 초과로 닫힘 못 잼.
- 토스트 · 사이드 패널: 로그인 없이 여는 자리 못 찾음. 모바일 안 잼.

### Spotify — 데스크톱 (https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT)

- 확인 2026-11-19 · 영상 `video/spotify.webm` · 프레임 `frames/spotify-playmodal-open.jpg` · `frames/spotify-playmodal-open-end.png` · `frames/spotify-copytoast-open-end.png`
- 로그인 권유 대화상자 열림(로그아웃 상태에서 곡 재생 단추): 바탕 겹(가림막 포함) opacity 0→1, 200ms ease(CSS animation, `div.dialog[role=presentation]`). 안쪽 상자는 150ms 뒤 떠오름 translateY(20px)→none 과 opacity 0→1, 400ms ease-in-out(CSS animation). 상자 바탕색이 rgb(155,240,225)→rgb(16,128,160) 로 500ms ease transition(앨범 색 추출).
- 로그인 권유 대화상자 닫힘(Escape): 움직임 없이 바로 사라짐(영상 프레임 한 장 사이에 바뀜, 닫힘 animation 0).
- 토스트(더보기 메뉴 → 공유 → 곡 링크 복사): 「링크가 클립보드에 복사됨」 흰 상자가 화면 아래 가운데(y 750px, 높이 48px)에 움직임 없이 바로 나타남(누른 뒤 첫 프레임에 opacity 1, transform 변화 없음). notistack(`notistack-Snackbar`). 사라짐은 측정 시간 2.5초 안에 오지 않아 미확인.
- 오른쪽 패널: 로그아웃 상태에서 여는 단추 못 찾음(시도 안 함 · 미확인). 쿠키 배너는 하단 고정 띠로 열려 있었고 누르지 않음.

### 티빙 — 데스크톱 · 모바일 (https://www.tving.com)

- 확인 2026-11-19 · 영상 `video/tving.webm` · `video/tving-m.webm` · `video/tving-m2.webm` · 프레임 `frames/tving-search-open.jpg` · `frames/tving-m-promo-close.jpg` · `frames/tving-m2-drawer-open.jpg`
- 검색 대화상자 열림(데스크톱, 머리 「찾기」 `aria-haspopup=dialog`): 화면 전체를 덮는 `div.tvl-search-host.tvl-search--layer>dialog.tvl-search__sheet`(0,0 1440×900)가 누른 뒤 207ms 프레임에 opacity 1 · transform 없음으로 바로 나타난다. 이 요소에 transition · animation 없음. 안의 인기 검색어 글자만 translateY(100%)→0 600ms linear 로 굴러 올라온다(목록 장식).
- 검색 대화상자 닫힘(Escape): 다음 프레임에 사라지고 머리가 돌아온다. 움직임 없음.
- 바텀시트 열림(모바일, 첫 화면에 저절로 뜨는 이용권 홍보 시트 `div.fixed.inset-0>div[role=dialog]`): 아래에서 올라옴 translateY 423px→0, 약 280ms 감속 곡선(열린 뒤 측정을 시작해 처음 일부는 못 봄, 곡선 이름 미확인), 시트 opacity 는 1 그대로라 페이드 없음. 가림막은 이미 어두운 상태.
- 바텀시트 닫힘(X): CSS animation `drawer-slide-down-fade` 200ms, 키프레임 곡선 ease-out, opacity 1→0 과 translateY(0)→translateY(100%) 를 함께. 가림막 `div.fixed.inset-0` 은 CSS animation `fade-out` 200ms ease-out opacity 1→0.
- 사이드 패널(모바일 햄버거 「메뉴 열기」 `aria-haspopup=dialog`) 열림: 오른쪽 위 떠 있는 둥근 패널 `dialog.tvl-drawer`(폭 18.08rem, transform-origin right top, backdrop-filter blur)가 CSS transition `opacity, transform` 150ms cubic-bezier(0, 0, 0.2, 1) 로 opacity 0→1 · translateY(-20px)→0(위에서 내려옴). 출처 `.tvl-root .tvl-drawer`(`/mono/_next/static/css/3a1f2ea535ebb4b6.css`). 화면 옆에서 밀려오는 드로어가 아니라 떠 있는 카드 꼴이다.
- 사이드 패널 닫힘(Escape): 같은 transition 150ms cubic-bezier(0, 0, 0.2, 1), opacity 1→0 · translateY 0→-20px.
- 데스크톱 「게스트 프로필」 은 드롭다운 메뉴(닫힘 opacity 1→0 · translateY -10px 200ms ease)라 세지 않았다.
- 토스트: 못 엶(로그아웃 상태 첫 화면에 공유 단추 없음).

### 카카오뱅크 — 데스크톱 · 모바일 (https://www.kakaobank.com)

- 확인 2026-11-19 · 영상 `video/kakaobank.webm` · `video/kakaobank-m.webm` · 원자료 `json/kakaobank.json` · `json/kakaobank-m.json`
- 데스크톱 검색 판 열림(머리 「검색 열기」, 머리 아래로 내려오는 흰 검색 판 `#hdSearchArea`, 뒤를 덮는 `.hd-search-bg`): 검색 상자가 위에서 내려옴 translateY(-30px)→0 과 opacity 0→1, 350ms ease. 판 전체와 뒤 가림막은 opacity 0→1 350ms ease. 영상에서 뒤 화면이 흐려지며 어두워지는 것을 확인. 출처 CSS transition(시트 막힘 6개라 규칙 원문 미확인, 계산값).
- 데스크톱 검색 판 닫힘(Escape): 열림을 거꾸로, translateY 0→-30px · opacity 1→0, 350ms ease.
- 모바일 메뉴 드로어 열림(「모바일 메뉴 열기」): 흰 전폭 패널(390×694)과 뒤 면(`.mobile-dim`)이 오른쪽에서 밀려옴 translateX(100%)→0, 400ms ease-in-out, 페이드 없음. 햄버거 줄은 350ms ease 로 X 로 돈다(rotate 45deg). 출처 CSS transition `transform` · `#mobile-nav-menu.mobile-open`.
- 모바일 메뉴 드로어 닫힘(같은 단추): translateX 0→100%, 400ms ease-in-out.
- 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다.
- 대화상자 · 토스트 · 바텀시트: 못 엶(공개 쪽에 여는 동작 없음).

### Linear — 모바일 (https://linear.app)

- 확인 2026-11-19 · 영상 `video/linear-m.webm` · 프레임 `frames/linear-m-menu-open.jpg` · `frames/linear-m-menu-close.jpg`
- 모바일 메뉴(머리 오른쪽 단추, `role=dialog`) 열림: 머리 아래(y 65px)부터 화면 끝까지 덮는 면이 페이드 opacity 0→1, 180ms ease. 이동 · 크기 변화 없음. 출처 CSS animation `TZTsQG_mobileMenuIn` · `.TZTsQG_mobileMenuContent`.
- 모바일 메뉴 닫힘(Escape): opacity 1→0, 180ms ease. 출처 CSS animation `TZTsQG_mobileMenuOut`. 열림과 같은 시간.
- 단추 아이콘(햄버거→X)은 막대 transform 160ms cubic-bezier(0.25, 0.46, 0.45, 0.94) transition.
- 데스크톱: 첫 화면의 「Search workspace」 는 제품 시연 그림 안 단추라 눌러도 겹침이 열리지 않음(못 엶). 로그인 · 가입은 다른 쪽으로 옮겨 가는 링크.

### 웨이브 — 데스크톱 · 모바일 (https://www.wavve.com)

- 확인 2026-11-19 · 영상 `video/wavve.webm` · `video/wavve-m.webm` · 프레임 `frames/wavve-promo-close.jpg` · `frames/wavve-m-appsheet-close.jpg`
- 대화상자 열림(데스크톱, 첫 화면에 저절로 뜨는 홍보 팝업 `div.popup-back>section.popup.main-notice-popup`): 쪽을 열 때 떠서 열림은 못 쟀다.
- 대화상자 닫힘(X): Vue 전환 `notice-popup-leave-active` 로 가림막 겸 바깥 상자 `div.popup-back`(0,0 1440×900)이 CSS transition `opacity` 300ms ease, 1→0. 안의 팝업 상자는 크기 · 위치가 그대로이고 바깥과 함께 흐려진다(이동 · 크기 없음). 시트는 읽혔지만 규칙은 잡히지 않아 계산값 기준. 데스크톱 띠는 부하로 영상이 밀려 닫힌 뒤 화면만 찍혀 눈으로는 확인 못 함(측정 프레임 기준).
- 검색(데스크톱 머리 「검색」): 겹침이 아니라 머리 안 검색칸이 CSS transition `width` 200ms ease-out 0→360px 로 펼쳐진다. 겹침으로 세지 않았다.
- 바텀시트 닫힘(모바일, 첫 화면에 뜨는 앱 유도 시트 「모바일 웹으로 보기」): 누른 뒤 다음 프레임에 사라진다. transition · animation 없음, 띠에서도 첫 장부터 닫힌 화면.
- 바텀시트 열림: 쪽을 열 때 떠서 못 쟀다.
- 막힘: 모바일 웹은 시트를 닫으면 로그인 유도 쪽이고 「웨이브 로그인」 은 쪽 이동이라 다른 겹침을 못 엶. 토스트 · 사이드 패널 못 엶(데스크톱 「프로필」 은 드롭다운).

### KREAM — 모바일 (https://kream.co.kr/search?shop_category_id=34)

- 확인 2026-11-19 · 영상 `video/kream-m2.webm` · `video/kream-m3.webm` · 프레임 `frames/kream-m2-color-open.jpg` · `frames/kream-m2-menu-open-end.png` · `frames/kream-m2-sort-open-end.png` · 원자료 `json/kream-m2.json` · `json/kream-m3.json`
- 첫 화면에 앱 설치 권유 시트(「모바일 웹으로 보기」)가 떠서 닫고 쟀다. 이 시트 닫힘은 같은 컨텍스트에서 다시 뜨지 않아 재지 못했다.
- 필터 바텀시트(「색상」) 열림: 높이 800px 시트가 아래에서 올라옴 y 844→44, 약 461ms(첫 변화부터 끝까지), 끝이 느린 감속, 시트 페이드 없음. 시트는 `transform: none` 이고 겹침 층 안의 스크롤로 올라오는 꼴(`.bottom-sheet__container { scroll-snap-align: end; transition: none; position: relative }`, `@media (width <= 768px)`, Vue). 같은 시트 규칙에 `transition: transform 0.23s ease-out; transform: translateY(100%)` 판도 있지만 이번 측정에서는 스크롤 판이 쓰였다. 곡선은 JS · 스크롤 구동이라 미확인.
- 필터 바텀시트 닫힘(가림막 누름): y 44→840, 약 413ms, 처음 느리다가 빨라지고 끝이 느린 꼴.
- 필터 가림막: rgba(34, 34, 34, 0.5) 면, 요소 opacity 0→1 이 시트 위치와 함께 바뀜(열림 약 461ms, 닫힘 1→0 약 413ms).
- 정렬 시트(「인기순」, 위 237px 를 남긴 높이 607px 목록): 열림 움직임 없음. 가림막과 시트가 한 프레임에 나타나고 opacity · transform 변화가 잡히지 않았다(`div.layer.sm`). 닫힘(가림막 누름)도 변화가 잡히지 않았다. 영상 대조는 프레임 띠가 어긋나 미확인.
- 사이드 패널 열림(검색 위 「카테고리」 단추 → 전체 화면 카테고리 드로어): 오른쪽에서 밀려옴 `translate(100%)`→`translate(0px)`, CSS transition transform 150ms ease-in-out(Vue `drawer-enter-active`), 페이드 없음, 가림막 없음. 측정 프레임으로는 첫 변화부터 끝까지 약 126ms.
- 사이드 패널 닫힘: 못 잼(Escape 로 닫히지 않고, 왼쪽 위 화살표는 홈으로 쪽 이동).
- 토스트 · 대화상자: 못 엶(관심 상품 저장은 로그인 필요).

### 쿠팡플레이 — 막힘 (https://www.coupangplay.com)

- 확인 2026-11-19 · 캡처 `frames/probe-coupangplay.com.png` · `frames/probe-coupangplay.com-m.png`
- 막힘: 데스크톱 · 모바일 모두 Akamai 「Access Denied」 쪽(봇 차단)만 떠서 겹침을 열지 못했다. 세지 않는다.

### 네이버 — 모바일 · 데스크톱 (https://m.naver.com · https://www.naver.com)

- 확인 2026-11-19 · 영상 `video/naver-m.webm` · `video/naver.webm` · 원자료 `json/naver-m.json` · `json/naver.json`
- 모바일 검색 화면 열림(검색 단추 `#MM_SEARCH_FOCUS_BTN`, 화면 전체를 덮는 검색 층): 층 자체는 움직임 없이 한 프레임에 바뀐다(영상 띠 0.1초 간격에서 중간 프레임 없음). 안쪽만 움직인다. 뒤로 단추 크기 .5→1 과 opacity 0→1, 300ms cubic-bezier(0.22, 0.61, 0.36, 1), 지연 100ms. 입력칸 opacity 0→1 400ms ease. 출처 CSS transition(시트 막힘 3개).
- 모바일 검색 화면 닫힘(뒤로 단추): 층은 한 프레임에 사라진다. 입력칸 opacity 1→0 100ms ease, 검색 막대 `#sch` opacity 1→0 100ms cubic-bezier(0.215, 0.61, 0.355, 1), 뒤로 단추 크기 1→.5 300ms(지연 100ms). 고정 머리 `#HEADER` 는 translate(0, -100%) 400ms linear 로 위로 숨는다.
- 데스크톱 「확장 영역」(머리 단추, aria-haspopup=menu, 420×740 판): 움직임 없이 첫 프레임에 나타나고 같은 단추로 닫으면 바로 사라진다. 메뉴 판이라 사이드 패널 수에는 넣지 않고 참고로 적는다.
- 모바일 「확장 영역」 은 다른 쪽으로 넘어가는 링크라 겹침이 아니어서 세지 않았다.
- 대화상자 · 토스트 · 바텀시트: 못 엶(로그인 없이 여는 동작 없음). 렌즈 · 알림 · 음성 단추는 권한 지시에 따라 누르지 않았다.
- 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다.

### 오늘의집 — 막힘 (https://ohou.se)

- 확인 2026-11-19 · 프레임 `frames/probe-ohou.se-m.png` · `frames/probe-ohou.se.png`
- 막힘: 봇 차단. 모바일(/store/category) · 데스크톱(/) 모두 Akamai 「Access Denied」 쪽만 떠서 겹침을 열지 못했다. 세지 않는다.

### Discord — 모바일 (https://discord.com)

- 확인 2026-11-19 · 영상 `video/discord-m.webm` · `video/discord-m2.webm` · 프레임 `frames/discord-m-burger-open.jpg` · `frames/discord-m2-burger-close.jpg`
- 쿠키 배너는 「모두 거부」 를 누르고 쟀다.
- 사이드 메뉴 열림(머리 오른쪽 「Menu」): 화면 전체를 덮는 면이 오른쪽에서 밀려옴 translateX 378px→0, 약 330ms(누른 뒤 41→374ms). 곡선은 처음이 빠르고 끝이 느린 감속형(JS 구동, Webflow 상호작용, CSS 규칙 0, 곡선 미확인). 같은 면의 opacity 는 0→1 로 141→474ms 동안 거의 일정하게 오름. 뒤 화면은 흐려지며(blur) 어두워짐(프레임 띠).
- 사이드 메뉴 닫힘(면 안 X 단추): 면이 오른쪽으로 나감 translateX 0→390px 과 opacity 1→0, 약 270ms(38→272ms) 감속형. 바깥 겹(`nav_burger_list`)은 238→488ms 동안 opacity 1→0 로 일정하게 옅어짐. JS 구동, 곡선 미확인.
- Escape 로는 닫히지 않음(닫힘 1.4초 동안 변화 0, 띠 12장 모두 열린 화면).
- 대화상자 · 토스트 · 바텀시트: 공개 쪽에서 여는 자리 못 찾음.

### Steam — 모바일 (https://store.steampowered.com)

- 확인 2026-11-19 · 영상 `video/steam-m.webm` · 프레임 `frames/steam-m-menu-open.jpg`(부하로 영상 시점이 밀려 띠는 이미 열린 화면, 값은 쪽 안 측정값)
- 사이드 메뉴 열림(왼쪽 위 로고 단추 `#responsive_menu_logo`): 폭 280px 패널이 왼쪽에서 밀려옴 left -280px→0, 500ms ease. 출처 CSS transition `left` · `.responsive_page_menu_ctn.mainmenu`.
- 가림막: `.responsive_page_content_overlay` opacity 0→1, 500ms ease.
- 사이드 메뉴 닫힘(가림막 클릭): left 0→-280px, 500ms ease, 가림막 opacity 1→0 500ms ease(visibility 도 500ms 뒤 hidden). 열림과 같은 값.
- 데스크톱: 첫 화면에서 대화상자를 여는 단추 못 찾음(언어 선택은 드롭다운). 데스크톱 첫 탐색 한 번은 60초 안에 열리지 않음(네트워크 끊김 중).

### Vercel — 모바일 (https://vercel.com)

- 확인 2026-11-19 · 영상 `video/vercel-m.webm` · 프레임 `frames/vercel-m-menu-open.jpg`(부하로 영상 시점이 밀려 띠로는 시점 대조 못 함)
- 모바일 메뉴 열림(「Open menu」, `role=dialog`): 머리 아래(y 64px)부터 화면 끝까지 덮는 면이 움직임 없이 바로 나타남(누른 뒤 약 106ms 첫 프레임에 opacity 1, transform 없음). 안의 링크만 visibility transition 150ms cubic-bezier(0.4, 0, 0.2, 1).
- 모바일 메뉴 닫힘(Escape): 움직임 없이 바로 사라짐(닫힘 1.4초 동안 겹침 변화 0). 링크 visibility 150ms 같은 곡선.
- 데스크톱: 첫 화면 단추는 Products · Resources 드롭다운뿐이라 메뉴로 보고 세지 않음. 대화상자 · 토스트 못 엶.

### 네이버 지도 — 데스크톱 (https://map.naver.com)

- 확인 2026-11-19 · 영상 `video/navermap.webm` · 프레임 `frames/navermap-save-open-end.png` · 원자료 `json/navermap.json`
- 왼쪽 패널 접기(「패널 접기」, 폭 390px 패널): 패널이 왼쪽으로 밀려 나감 `none`→`translateX(-100%)`, 400ms cubic-bezier(0.215, 0.61, 0.355, 1). 같은 동안 패널 자리 폭이 390px→0 으로 줄어(CSS animation, 같은 곡선 400ms) 지도가 그만큼 넓어진다. 페이드 없음. 출처 CSS transition `transform` · styled-components `StyledPanelContainer`, 폭은 CSS animation `StyledPanelLayout`.
- 왼쪽 패널 펼치기(「패널 펼치기」): translateX(-100%)→0, 폭 0→390px, 400ms 같은 곡선.
- 저장 확인 상자(장소 카드 「저장」, `<dialog>` 230×157 「저장하기 위해서는 로그인이 필요합니다.」): 누른 단추 옆에 가림막 없이 첫 프레임에 나타남, 움직임 없음. Escape 로 닫히는 움직임은 잡히지 않음. 화면을 덮지 않는 상자라 대화상자 수에는 넣지 않고 참고로 적는다.
- 「오류신고」: 눌러도 겹침 변화가 잡히지 않아 못 엶.
- 쪽을 열면 오른쪽 아래 광고 팝업이 떠 있다(여는 움직임은 쪽을 여는 동안이라 못 잼).
- 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다. 현재 위치 단추는 권한 지시에 따라 누르지 않았다.

### Netflix — 데스크톱 · 모바일 (https://www.netflix.com/kr/)

- 확인 2026-11-19 · 영상 `video/netflix.webm` · `video/netflix-m.webm` · 프레임 `frames/netflix-title-open-end.png` · `frames/netflix-m-title-open.jpg`
- 작품 소개 대화상자 열림(로그아웃 첫 쪽 「지금 뜨는 콘텐츠」 포스터, `role=dialog`): 상자가 크기 .88→1(533ms, 지연 4ms)과 opacity 0→1(100ms, 지연 100ms)로 커지며 나타남. 곡선 모두 cubic-bezier(0.32, 0.94, 0.6, 1). 출처 CSS transition `transform` · `opacity`(emotion 클래스).
- 가림막(상자를 감싼 바탕 겹): opacity 0→1, 250ms, 지연 67ms, cubic-bezier(0.32, 0.94, 0.6, 1).
- 대화상자 닫힘(Escape): 열림을 거꾸로 같은 값. 크기 1→.88 533ms, 상자 opacity 1→0 100ms 지연 100ms, 가림막 1→0 250ms 지연 67ms, 곡선 같음.
- 모바일(390폭)도 같은 대화상자 · 같은 값(가운데 상자, 바텀시트 아님). 상자 높이만 372px.
- 누른 포스터는 크기 1→1.05, 200ms ease-in-out transition.
- 토스트 · 사이드 패널: 공개 쪽에서 여는 자리 없음(로그인 단추는 다른 쪽으로 옮겨 가는 링크).

### 치지직 — 모바일 (https://chzzk.naver.com)

- 확인 2026-11-19 · 영상 `video/chzzk-m.webm` · 프레임 `frames/chzzk-m-menu-open.jpg` · `frames/chzzk-m-menu-close.jpg` · `frames/chzzk-m-more-open.jpg` · `frames/chzzk-m-more-close.jpg`
- 사이드 패널 열림(머리 「메뉴」 `#menu-button`): 오른쪽 붙은 패널 `#menu-layer`(폭 약 320px, 왼쪽 약 70px 비움)과 가림막 `div._dimmed_vt39l_2`(0,0 390×844)가 누른 뒤 67ms 프레임에 opacity 1 · transform 없음으로 바로 나타난다. 옆에서 밀려오기 · 페이드 없음. 띠에서도 둘째 장부터 완성된 패널. body 에 `body_scroll_lock`.
- 사이드 패널 닫힘(X): 다음 프레임에 사라진다. 움직임 없음. Escape 로는 닫히지 않는다.
- 바텀시트 열림(방송 카드 「더보기」 `aria-haspopup=true`): 아래 붙은 액션 시트(공유하기 · 취소)와 가림막 `div._dimmed_lqyf1_1` 이 53ms 프레임에 opacity 1 로 바로 나타난다. 올라옴 · 페이드 없음.
- 바텀시트 닫힘(가림막 클릭): 다음 프레임에 사라진다. 움직임 없음.
- 검색(머리 「검색」): 화면 전체 `div#search-layer._is_active_1y89h_11`(0,0 390×844)이 55ms 프레임에 opacity 1 로 바로 나타난다. 움직임 없음. 닫힘은 Escape 가 먹지 않아 못 쟀다.
- CSS 시트 2개가 교차 출처라 막힘, 읽힌 시트에 겹침 transition · animation 규칙 없음.
- 토스트: 못 엶(「공유하기」 는 네이버 공유 플러그인 `naver-splugin` 단추라 누르기 실패).
- 데스크톱: 「로그인」 은 네이버 로그인 쪽 이동이고 다른 겹침 단추를 찾지 못해 재지 않았다.

### 카카오맵 — 데스크톱 (https://map.kakao.com)

- 확인 2026-11-19 · 영상 `video/kakaomap.webm` · 원자료 `json/kakaomap.json`
- 왼쪽 메뉴 드로어 열림(「더보기 메뉴 열기」, 왼쪽 끝 흰 패널 + 전면 가림막 `div.dimmed_snb` rgba(0, 0, 0, 0.35)): 움직임 없음. 패널과 가림막이 한 프레임에 나타나고 opacity · transform 변화 없음. 영상 띠 0.1초 간격에서 중간 프레임 없음.
- 왼쪽 메뉴 드로어 닫힘(가림막 클릭, Escape 는 닫히지 않음): 움직임 없음, 한 프레임에 사라짐.
- 「오류신고」 · 「집 주소를 등록하세요.」: 눌러도 겹침 변화가 잡히지 않아 못 엶(새 창 · 다른 쪽으로 가는 링크로 보임).
- 토스트 · 바텀시트: 못 엶. 현위치 단추는 권한 지시에 따라 누르지 않았다.
- 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다. 시트 막힘 6개.

### 번개장터 — 모바일 (https://m.bunjang.co.kr/categories/310)

- 확인 2026-11-19 · 영상 `video/bunjang-m.webm` · `video/bunjang-m2.webm` · 프레임 `frames/bunjang-m2-sort-open.jpg` · `frames/bunjang-m2-filter-open.jpg` · `frames/bunjang-m-sort-open-end.png` · `frames/bunjang-m-filter-open-end.png` · 원자료 `json/bunjang-m.json` · `json/bunjang-m2.json`
- 첫 화면에 앱 권유 바텀시트(「괜찮아요, 모바일 웹에서 볼게요.」)가 떠서 닫고 쟀다. 이 시트의 닫힘은 변화가 잡히지 않았다.
- 정렬 바텀시트(「최신순」, 높이 422px) 열림: 아래에서 올라옴 translateY 844px→0(시트 높이가 아니라 화면 높이만큼 아래에서 시작), 약 560ms(첫 변화부터 끝까지), 앞이 빠르고 긴 꼬리로 붙는 감속, 페이드 없음. CSS transition · animation 이 없어 JS 구동, 곡선 미확인(`bun-ui` `BottomSheet_bottomSheetRecipe`).
- 정렬 가림막: 검정 opacity 0→0.5, Web Animations 300ms ease-in-out(`.bun-ui-bottom-sheet-dim`), 시트와 같이 시작.
- 정렬 바텀시트 닫힘(가림막 누름): 움직임 없음. 시트와 가림막이 한 프레임에 사라짐을 영상 20fps 로 확인했다.
- 상세필터(「내 조건 설정」) 전체 화면 시트 열림: 높이 844px 판이 아래에서 올라옴 translateY 844px→0, 약 334ms, 시작이 빠르고 끝으로 갈수록 느려지는 감속, 페이드 없음, JS 구동.
- 상세필터 닫힘(오른쪽 위 닫기 X): 움직임 없음. 한 프레임에 사라짐을 영상으로 확인했다.
- 사이드 패널: 못 엶(왼쪽 위 햄버거는 전체 메뉴 쪽으로 이동, 움직임 없음).
- 대화상자 · 토스트: 못 엶(「찜하기」 는 로그인 쪽으로 이동).
- 규칙: 겹침 요소의 transition · animation CSS 규칙 0개(시트 막힘 없음).

### 원티드 — 모바일 (https://www.wanted.co.kr)

- 확인 2026-11-19 · 영상 `video/wanted-m.webm` · 원자료 `json/wanted-m.json`
- 앱 설치 대화상자(쪽을 열면 뜨는 가운데 흰 상자 + 회색 가림막) 닫힘(「닫기」): 움직임 없음. 상자와 가림막이 한 프레임에 사라진다(영상 띠 0.1초 간격에서 중간 프레임 없음). 여는 움직임은 쪽을 여는 동안이라 못 잼.
- 검색 대화상자 열림(머리 「검색」, aria-haspopup=dialog, `#nav_searchbar` 전체 화면 390×844 흰 면): 움직임 없음, 한 프레임에 나타남. Escape 닫힘도 한 프레임에 사라짐.
- 전체 메뉴 패널 열림(머리 「더보기」 햄버거, `aside` 아래 전폭 패널 390×789): 움직임 없음, 한 프레임에 나타남. Escape 로는 닫히지 않아 닫힘 미확인.
- 북마크 단추는 로그인 쪽으로 넘어가 겹침이 아니어서 세지 않았다. 데스크톱은 탐색에서 누를 단추가 잡히지 않아 재지 않았다.
- 오른쪽 아래 상담 단추(Zendesk)는 opacity 0→1 200ms ease-in, 지연 500ms 로 나타난다(겹침 아님, 참고).
- 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다. 토스트 · 바텀시트: 못 엶.

### 지그재그 — 모바일 (https://zigzag.kr/categories/-1)

- 확인 2026-11-19 · 영상 `video/zigzag-m.webm` · `video/zigzag-m2.webm` · 프레임 `frames/zigzag-m-sort-open.jpg` · `frames/zigzag-m-sort-open-end.png` · `frames/zigzag-m-color-open-end.png` · 원자료 `json/zigzag-m.json` · `json/zigzag-m2.json`
- 정렬 바텀시트(「직잭추천순」, 높이 440px, `[role=alertdialog]`) 열림: 아래에서 올라옴 translateY 440px→0, 약 200ms(첫 변화부터 끝까지), 거의 일정한 속도로 오다가 끝에서 감속. 시트 opacity 는 첫 프레임에 0→1 로 바로 바뀌어 페이드로 보이지 않는다. 시트 이동은 CSS transition · animation 이 잡히지 않아 JS 구동, 곡선 미확인(ZDS 4 `zds4_1hwvhk0`).
- 정렬 바텀시트 닫힘(가림막 누름): translateY 0→약 380px(일정한 속도) + opacity 1→0, Web Animations 100ms linear. 약 100ms 에 끝난다.
- 정렬 가림막: rgba(0, 0, 0, 0.5) 면, CSS transition opacity 0→1 100ms linear, 닫힘 1→0 100ms linear.
- 필터 패널(「색상」 칩 → 전체 화면 「필터」): 오른쪽에서 밀려옴 `translateX(100%)`→`translateX(0px)`, CSS animation 0.24s(키프레임 곡선 ease), 페이드 없음, 가림막 없음. 들어온 뒤 내용은 불러오는 표시 다음에 나타난다(영상).
- 필터 패널 닫힘(왼쪽 위 뒤로): 움직임 없음. 영상 20fps 로 한 프레임 만에 목록으로 바뀜을 확인했다.
- 맨 위 「상의 ⌄」 는 펼침 메뉴(grid-template-rows 280ms ease, 가림막 opacity 0→1 CSS transition 280ms ease)라 세지 않았다.
- 대화상자 · 토스트: 시도하지 않음.
- 규칙: 스타일시트 1개 교차 출처라 읽지 못함.

### SOOP — 모바일 (https://www.sooplive.co.kr, 모바일 웹은 다크 설정을 따르지 않고 밝은 화면)

- 확인 2026-11-19 · 영상 `video/soop-m.webm` · 프레임 `frames/soop-m-allmenu-open.jpg` · `frames/soop-m-allmenu2-close.jpg`
- 사이드 패널 열림(머리 「전체메뉴」 `a.menu`): 왼쪽에서 밀려옴. `div.sidemenu`(폭 230px, 높이 844)에 CSS transition `left` -230px→0 과 `transform` translate3d(-100%,0,0)→translate3d(0,0,0) 를 함께 200ms ease-out(계산된 이동량 -230→0, 76–276ms). 패널 opacity 는 1 그대로라 페이드 없음. 띠에서도 왼쪽에서 들어오는 것이 보인다.
- 가림막: `div#lightbox`(0,0 390×844)가 73ms 프레임에 opacity 1 로 바로 나타난다(페이드 없음). body 에 `menu_on`. 메뉴 단추 줄 세 개가 화살표로 바뀌는 아이콘 transition 200ms ease-out(rotateZ -360deg)도 함께.
- 사이드 패널 닫힘(머리 단추 다시 누름): 같은 transition 200ms ease-out, left 0→-230px · translate3d 0→-100%. 가림막은 바로 사라진다. 가림막 클릭으로는 닫히지 않는다.
- 데스크톱(https://www.sooplive.co.kr): 「전체메뉴」 · 「설정」 은 머리 아래 드롭다운(`div.allMenuList` · `div.loginUserMenu`, 움직임 없이 바로 나타남)이라 세지 않았고, 「로그인」 은 로그인 쪽 이동. 공용 모듈 `.__soopui__LayerStack-module__dimmed___x59Kx { animation: 0.3s ease-in-out __soopui__LayerStack-module__fadeIn }` 규칙은 쪽에 있으나 여는 자리를 찾지 못해 미확인.
- 대화상자 · 토스트 · 바텀시트: 못 엶(모바일 「후원 및 아이템」 · 「검색」 은 쪽 이동, 「알림」 은 권한 금지 지시로 누르지 않음).
- CSS 시트 4개 교차 출처로 막힘.

### 로스트아크 — 모바일 (https://lostark.game.onstove.com)

- 확인 2026-11-19 · 영상 `video/lostark-m.webm` · `video/lostark-m2.webm` · 프레임 `frames/lostark-m-nav-open.jpg` · `frames/lostark-m2-nav-close.jpg`
- 사이드 메뉴 열림(「네비게이션 열기」): 폭 300px 패널이 왼쪽에서 밀려옴 translate(-300px)→0, 300ms ease. 패널을 감싼 겹(`nav#expand-nav`, 화면 전체)은 opacity 0→1, 300ms ease. 출처 CSS transition `transform` · `.nav__wrapper`, `opacity` · `.nav--active`.
- 사이드 메뉴 닫힘(패널 안 닫기 단추): translate 0→-300px, 300ms ease, 바깥 겹 opacity 1→0 300ms ease. 열림과 같은 값.
- Escape 로는 닫히지 않음(닫힘 1.4초 동안 변화 0).
- 데스크톱: 로그인 · 회원가입은 STOVE 쪽으로 옮겨 가고, 「게임시작」 은 런처 실행 단추라 누르지 않음. 공유 단추(페이스북 · 트위터 · 카카오톡)는 새 창이라 세지 않음.

### 메이플스토리(넥슨 공통 머리) — 데스크톱 (https://maplestory.nexon.com)

- 확인 2026-11-19 · 영상 `video/maple.webm` · `video/maple2.webm` · 프레임 `frames/maple-allmenu-open-end.png` · `frames/maple2-allmenu-open.jpg`
- 전체 메뉴 드로어 열림(머리 왼쪽 「메뉴」, 넥슨 공통 GNB `#gnbAllLayer`): 폭 440px 패널이 왼쪽에서 밀려옴 translate3d(-100%,0,0)→0 과 opacity 0→1, 500ms cubic-bezier(0.23, 1, 0.32, 1). 출처 CSS transition `transform` · `opacity`.
- 가림막 `.gnbDimmedLayer`: opacity 0→0.7, 500ms cubic-bezier(0.23, 1, 0.32, 1).
- 전체 메뉴 드로어 닫힘(패널 X): translate 0→-100% 와 opacity 1→0, 500ms cubic-bezier(0.23, 1, 0.32, 1)(열림과 같은 값). 가림막은 닫힘 때 transition 이 잡히지 않음(바로 사라진 것으로 보이나 미확인).
- 패널 안 링크는 visibility transition 150ms linear.
- 모바일: 탐색에서 누를 단추가 잡히지 않아 안 잼. 넥슨 로그인은 다른 쪽으로 옮겨 감.

### YouTube — 모바일 (https://m.youtube.com/watch?v=jNQXAC9IVRw)

- 확인 2026-11-19 · 영상 `video/youtube-m.webm` · 프레임 `frames/youtube-m-share-open.jpg` · `frames/youtube-m-share-open-end.png`
- 공유 바텀시트 열림(보기 쪽 공유 단추, `bottom-sheet-container[role=dialog]`): 누른 뒤 약 916ms(내용을 불러온 뒤)에 시트(y 466px, 높이 354px)와 가림막(`ytw-scrim`)이 움직임 없이 바로 나타남. 첫 프레임부터 opacity 1 · 제자리, animation · transition 0. 끌기 손잡이(drag line)가 위에 있음.
- 공유 바텀시트 닫힘(가림막 탭): 움직임 없이 바로 사라짐(닫힘 animation · transition 0).
- 더보기(⋮) 바텀시트: 못 엶(관련 영상 목록의 메뉴 단추 선택자가 맞지 않아 클릭 시간 초과).

### 야놀자(NOL) — 모바일 (https://www.yanolja.com/)

- 확인 2026-11-19 · 영상 `video/yanolja-m.webm` · 프레임 `frames/yanolja-m-category-open.jpg` · `frames/yanolja-m-banners-open.jpg` · `frames/yanolja-m-category-open-end.png` · 원자료 `json/yanolja-m.json`
- 세 겹침 모두 react-modal(`.ReactModalPortal`) 위에서 CSS animation 으로 움직인다. 겉 판(`div.fixed`)이 페이드, 안의 `[role=dialog]` 가 이동한다.
- 전체 화면 카테고리 시트(하단 탭 「카테고리」) 열림: 아래에서 올라옴 translateY(100%)→0, CSS animation `modalSlideUpFromBottom` 300ms(키프레임 곡선 ease-out). 같이 겉 판 opacity 0→1 `fadeIn` 280ms cubic-bezier(0.4, 0, 0.2, 1). 하단 탭 막대는 시트 위에 그대로 남는다.
- 카테고리 시트 닫힘(Escape): translateY 0→100% `modalSlideDownToBottom` 300ms(ease-out) + 겉 판 opacity 1→0 `fadeOut` 210ms(ease-in). 페이드가 끝나는 약 205ms 에 통째로 사라져 이동은 끝까지 가지 않는다.
- 배너 전체보기 시트(배너 「1 / 15 +」) 열림: 높이 844px 판이 아래에서 올라옴 translateY(100%)→0, CSS animation `slideUp` 280ms cubic-bezier(0.4, 0, 0.2, 1), 겉 판 `fadeIn` 280ms cubic-bezier(0.4, 0, 0.2, 1). 닫힘은 Escape 로 닫히지 않아 못 잼.
- 앱 권유 대화상자(첫 화면 아래쪽 떠 있는 카드, 「오늘은 웹으로 볼게요」) 닫힘: 가림막과 카드가 함께 opacity 1→0, CSS animation `fadeOut` 210ms(ease-in), 이동 없음. 열림은 쪽을 열 때 떠서 재지 못했다.
- 토스트 · 사이드 패널: 못 엶(찜은 시도하지 않음, 옆에서 나오는 드로어 없음).
- 규칙: 스타일시트 9개 교차 출처라 읽지 못함. 위 이름 · 시간은 Web Animations 로 잡힌 값이다.

### 카카오웹툰 — 데스크톱 (https://webtoon.kakao.com)

- 확인 2026-11-19 · 영상 `video/kakaowebtoon.webm` · 프레임 `frames/kakaowebtoon-promo-close.jpg`(부하로 영상이 밀려 닫힌 뒤만 찍힘, 값은 측정 프레임 기준)
- 바텀시트 열림(첫 화면에 저절로 뜨는 「카카오페이지로 통합하기」 react-modal 시트 `div.AlertModal__Content[role=dialog]`, 폭 전체 · 높이 503): 쪽을 열 때 떠서 열림은 못 쟀다.
- 바텀시트 닫힘(「닫기」): 시트가 CSS transition `transform` 200ms ease-in-out 으로 translateY(0)→translateY(100%)(아래로 내려감, 87–237ms 사이 0→약 400px). 시트 자체 opacity 는 1 그대로. 가림막 `div.ReactModal__Overlay` 는 CSS transition `opacity` 200ms ease-out 1→0. react-modal 의 `--after-open` · `--before-close` 클래스 전환. 시트 1개가 교차 출처로 막혀 규칙 원문은 미확인.
- 닫힌 직후 254ms 에 화면 아래쪽 작은 고정 상자 `div.rounded-8.fixed`(y 562, 높이 30)가 opacity 1 로 바로 나타났다. 무엇인지는 미확인.
- 막힘 · 못 엶: 데스크톱 머리의 메뉴 · 검색 · 선물 단추는 모두 쪽 이동이라 겹침이 아니다. 대화상자 · 토스트 · 사이드 패널 못 엶.

### 벨로그 — 데스크톱 · 모바일 (https://velog.io)

- 확인 2026-11-19 · 영상 `video/velog.webm` · `video/velog-m.webm` · 원자료 `json/velog.json` · `json/velog-m.json`
- 로그인 대화상자 열림(머리 「로그인」, 데스크톱 606×530 가운데 · 모바일 390×844 전체 화면): 아래에서 튀어 오름. CSS animation `pop-in-from-bottom` 400ms, 키프레임 0% opacity 0 · translateY(400px) scale(0.75) → 75% opacity 1 · translateY(-16px) scale(1) → 100% translateY(0), 구간마다 ease-in-out. 위로 16px 넘었다가 내려앉는다. 데스크톱 · 모바일 같음. 영상 띠에서 아래에서 올라오며 커지는 것을 확인.
- 가림막: rgba(250, 250, 250, 0.85)(밝은 면), CSS animation `fade-in` opacity 0→1 250ms ease.
- 로그인 대화상자 닫힘(닫기 X, Escape 로는 닫히지 않음): CSS animation `pop-out-to-Bottom` 200ms ease-in-out, opacity 1→0 · translateY(0) scale(1) → translateY(400px) scale(0.75). 가림막 `fade-out` 1→0 250ms ease. 데스크톱 · 모바일 같음.
- 출처 CSS Modules 키프레임(`keyframes_pop-in-from-bottom__OB5io` 등), 시트 막힘 5개.
- 토스트 · 바텀시트 · 사이드 패널: 못 엶(로그인 없이 띄울 동작 없음). 사이트가 colorScheme dark 를 따르지 않아 밝은 화면으로 찍혔다.

### 브런치 — 데스크톱 (https://brunch.co.kr)

- 확인 2026-11-19 · 영상 `video/brunch.webm` · 원자료 `json/brunch.json`
- 왼쪽 메뉴 드로어 열림(머리 「메뉴」, 폭 260px쯤 `#wrapSideMenu`): 왼쪽에서 밀려옴 translate(-100%)→0, 300ms ease-out, 페이드 없음. 가림막 없음(영상에서 본문이 그대로 보임). 출처 CSS transition `transform` · `#wrapSideMenu.open`.
- 왼쪽 메뉴 드로어 닫힘(Escape): translate(0)→(-100%), 300ms ease-out.
- 로그인 대화상자 열림(머리 「시작하기」, 1000×610 흰 상자 + 가림막 rgba(0, 0, 0, 0.3)): 가림막과 상자를 감싼 층 `.login_modal` 전체가 opacity 0→1, 200ms. 크기 · 위치 변화 없음. 키프레임 표본(0 · .23 · .42 · .58 · .70 · .80 · .875 · .93 · .96 · .98 · 1)으로 보아 감속 곡선(Svelte transition, 정확한 함수 미확인).
- 로그인 대화상자 닫힘(Escape): opacity 1→0, 200ms, 열림을 거꾸로 한 표본.
- 검색 층 열림(머리 「검색」, aria-haspopup=dialog, 전체 화면 흰 면): 움직임 없음, 한 프레임에 나타남. Escape 닫힘은 잡히지 않아 미확인.
- 토스트 · 바텀시트: 못 엶. 시트 막힘 10개. 사이트가 다크 모드를 따르지 않아 밝은 화면으로 찍혔다.

### 카카오페이지 — 못 엶 (https://page.kakao.com)

- 확인 2026-11-19 · 영상 `video/kakaopage.webm` · `video/kakaopage-m.webm` · 캡처 `frames/kakaopage-search-open-end.png` · `frames/probe-page.kakao.com-m.png`
- 데스크톱 · 모바일 모두 colorScheme dark 에서도 밝은 화면.
- 못 엶: 데스크톱 「검색」 은 머리 안 검색칸(겹침 없음), 「보관함」 · 「내 정보」 는 로그인 쪽 이동. 모바일 검색 아이콘은 겹침 요소 변화 없음, 「선물함」 · 작품 상세 진입은 누르기 실패. 대화상자 · 토스트 · 바텀시트 · 사이드 패널을 열지 못해 세지 않는다.

### 리디 — 데스크톱 · 모바일 (https://ridibooks.com)

- 확인 2026-11-19 · 원자료 `json/ridi-m.json`
- 막힘: 데스크톱은 Cloudflare 확인 화면에 막혀 쪽이 열리지 않았다(`frames/probe-ridibooks.com.png`).
- 못 엶: 모바일은 쪽이 열렸지만 겹침을 여는 단추가 없었다. 「전체 카테고리」 는 눌러지지 않았다(클릭 대기 시간 초과). 로그인은 다른 쪽으로 가는 링크라 겹침이 아니다.
- 세지 않음.

### 여기어때 — 모바일 (https://www.yeogi.com/, goodchoice.kr 는 503)

- 확인 2026-11-19 · 영상 `video/yeogi-m.webm` · `video/yeogi-m2.webm` · 프레임 `frames/yeogi-m2-menu-open.jpg` · `frames/yeogi-m-menu-open-end.png` · `frames/yeogi-m-guests-open-end.png` · 원자료 `json/yeogi-m.json` · `json/yeogi-m2.json`
- 맡은 주소 https://www.goodchoice.kr 는 「503 Service Temporarily Unavailable」 이라 바뀐 주소 yeogi.com 에서 쟀다.
- 사이드 패널 열림(오른쪽 위 「메뉴 열기」 → 화면 폭 전체 메뉴): 오른쪽에서 밀려옴 translateX 390px→0 + opacity 0→1. opacity 는 Web Animations 200ms ease-out, 이동은 측정 프레임으로 약 245ms(transform 은 JS 구동, 곡선 미확인), 끝이 느린 감속.
- 사이드 패널 가림막: rgba(0, 0, 0, 0.4) 면, opacity 0→1 Web Animations 300ms ease-out(전체 메뉴라 대부분 가려진다).
- 사이드 패널 닫힘(왼쪽 위 X): translateX 0→390px + opacity 1→0, Web Animations 300ms ease-out(패널 · 가림막 둘 다), 약 323ms 에 끝남. Escape 로는 닫히지 않았다.
- 검색 조건 대화상자(「인원 2」 · 날짜 단추 → 전체 화면 `[role=dialog]`) 열림: 움직임 없음. 한 프레임에 나타나고 opacity · transform 변화가 잡히지 않았다.
- 검색 조건 대화상자 닫힘(X · Escape 둘 다): 안쪽 전체 면 opacity 1→0, Web Animations 200ms ease-out, 이동 없음.
- 대화상자 아이콘은 나타날 때 CSS animation `yf-svg-icon-fade-in` 150ms(ease-out)로 페이드된다.
- 토스트 · 바텀시트: 못 엶(찜은 시도하지 않음, 첫 화면에 바텀시트 단추 없음).
- 규칙: 스타일시트 9개 교차 출처라 읽지 못함.

### 배달의민족 — 모바일 (https://www.baemin.com/)

- 확인 2026-11-19 · 영상 `video/baemin-m.webm` · 프레임 `frames/baemin-m-menu-open.jpg` · `frames/baemin-m-menu-open-end.png` · 원자료 `json/baemin-m.json`
- 웹은 앱 소개 쪽 하나라 겹침 자리가 메뉴 하나뿐이다.
- 메뉴 패널 열림(오른쪽 위 햄버거 → 위쪽 폭 전체 높이 330px 패널, 아래는 투명 덮개 rgba(0, 0, 0, 0)): 움직임 없음. 패널과 덮개가 한 프레임에 나타나고 opacity · transform 변화가 잡히지 않았다(`MobileMenu-styles__MobileMenuOverlay`).
- 메뉴 패널 닫힘(X): 움직임 없음. 측정 동안 패널 요소의 변화 없이 사라졌다.
- 대화상자 · 토스트 · 바텀시트: 못 엶(「Get the App」 은 겹침 없이 앱 내려받기로 이어짐, 다른 단추 없음).
- 규칙: 스타일시트 2개 교차 출처라 읽지 못함.

### 쿠팡 — 막힘 (https://www.coupang.com)

- 확인 2026-11-19 · 프레임 `frames/probe-coupang.com-m.png`
- 막힘: 봇 차단. 모바일 첫 쪽에서 Akamai 「Access Denied」 쪽만 떠서 겹침을 열지 못했다. 세지 않는다.

### FLO — 데스크톱 (https://www.music-flo.com, colorScheme dark 에서도 밝은 화면)

- 확인 2026-11-19 · 영상 `video/flo.webm` · `video/flo2.webm` · 프레임 `frames/flo2-confirm-open.jpg` · `frames/flo2-confirm-close.jpg` · `frames/flo-multisearch-open-end.png`(부하로 영상이 밀려 띠는 열린 뒤 · 닫힌 뒤만 찍힘, 값은 측정 프레임 기준)
- 확인창 열림(로그아웃 상태 「여러 곡 한 번에 찾기」 → 「로그인이 필요한 서비스입니다」 취소 · 확인): 가림막 겸 바깥 `div.popup_container`(0,0 1440×900)와 가운데 상자 `div.popup_w.common-alert`(400×180, translate(-50%,-50%) 가운데 맞춤)가 누른 뒤 59ms 프레임에 opacity 1 · 크기 변화 없이 바로 나타난다. transition · animation 잡히지 않음.
- 확인창 닫힘(「취소」): 다음 프레임에 사라진다. 움직임 없음.
- 대화상자 닫힘(첫 화면에 저절로 뜨는 홍보 팝업 「닫기」): 겹침 요소 변화가 잡히지 않고 사라진다(움직임 없음으로 보이나 띠로는 확인 못 함). 열림은 쪽을 열 때라 못 쟀다.
- 사이드 패널(재생 막대 오른쪽 재생목록 단추): 눌러도 겹침 요소 변화 없음, 미확인.
- 토스트: 못 엶(첫 화면 재생 단추는 미리듣기 재생만 시작, 「전체듣기」 는 누르기 실패).
- CSS 시트 10개 교차 출처로 막힘.

### 멜론 — 못 엶 (https://www.melon.com · https://m2.melon.com)

- 확인 2026-11-19 · 캡처 `frames/probe-melon.com.png` · `frames/probe-m2.melon.com-m.png` · 영상 `video/melon-m.webm`
- 데스크톱은 colorScheme dark 에서도 밝은 화면이고, 머리 「검색」 · 「로그인」 외 겹침 단추를 찾지 못했다.
- 모바일은 첫 화면이 화면 전체 요금제 홍보 쪽이고 「닫기」 를 누르면 쪽이 바뀌어(측정 스크립트가 끊김) 겹침으로 잴 수 없었다.
- 대화상자 · 토스트 · 바텀시트 · 사이드 패널을 열지 못해 세지 않는다.

### 직방 — 데스크톱 (https://www.zigbang.com/home/oneroom/map)

- 확인 2026-11-19 · 영상 `video/zigbang2.webm` · 프레임 `frames/zigbang-jena-open-end.png` · `frames/zigbang2-jena-open.jpg` · `frames/probe-zigbang.com-m.png` · 원자료 `json/zigbang.json` · `json/zigbang2.json`
- 모바일(390)은 「앱 설치하기」 카드만 있는 쪽이라 데스크톱 지도 쪽에서 쟀다.
- 대화상자 열림(위 「AI중개사 제나」 → 「로그인하고 이용해보세요!」 폭 340 상자, 가림막 위 가운데): 움직임 없음. 가림막과 상자가 한 프레임에 나타나고 opacity · transform 변화가 잡히지 않았다(react-native-web `[role=dialog]`). 영상 20fps 로 한 프레임 만에 바뀜을 확인했다.
- 대화상자 닫힘: 못 잼(Escape · 가림막 누름으로 닫히지 않음, 상자 안 단추는 「로그인 하기」 하나뿐이라 누르지 않음).
- 오른쪽 목록에서 매물을 누르면 상세가 같은 열 안에서 바뀔 뿐 겹침이 아니라 세지 않았다. 위 「거래유형 · 가격」 등은 펼침 메뉴라 세지 않았다.
- 토스트 · 바텀시트 · 사이드 패널: 못 엶.
- 규칙: 스타일시트 2개 교차 출처라 읽지 못함.

### 네이버 웹툰 — 데스크톱 (https://comic.naver.com/webtoon, colorScheme dark 에서도 밝은 화면)

- 확인 2026-11-19 · 영상 `video/naverwebtoon.webm` · `video/naverwebtoon2.webm` · 캡처 `frames/naverwebtoon-share-open-end.png` · `frames/naverwebtoon2-copy-open-end.png`
- 공유 대화상자 열림(작품 쪽 「공유하기」, 네이버 공유 플러그인 `div._ly_spi>div._spi_release_ly._spi_card_ly`, 단추 아래 붙은 카드 350×306 · 닫기 X): 누른 뒤 149–152ms 프레임에 opacity 1 · transform 없음으로 바로 나타난다. 가림막 없음. transition · animation 잡히지 않음.
- 공유 대화상자 닫힘(X): 다음 프레임에 사라진다. 움직임 없음.
- 복사 알림(카드 안 「복사」): 토스트가 아니라 같은 자리의 알림 카드 `div._spi_ly_copyurl_ok`(「주소가 복사되었습니다」 · 「닫기」, 높이 158)로 바뀐다. 53ms 프레임에 opacity 1 로 바로 나타나고 3.5초 동안 저절로 사라지지 않는다.
- 막힘 · 못 엶: 머리 「검색」 은 검색칸 포커스만(겹침 없음), 「CREATOR'S」 와 「관심」 은 쪽 이동. 모바일(https://comic.naver.com, 모바일 UA)은 첫 화면에 링크만 있어 겹침 단추를 찾지 못했다. 바텀시트 · 사이드 패널 못 엶.
- CSS 시트 3개 교차 출처로 막힘.
