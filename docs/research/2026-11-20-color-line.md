# 선 — 다크 실제 서비스 34곳 · 디자인 시스템 6곳 실측 (2026-11-20)

공통 층 3단계 색 판의 둘째 묶음(선) 재료다. 대조표 4-2 의 네 줄(`border/divider` · `border/row` · `border/elevated` · `border/input-hover`)에 맞춰 다크 화면에서 구분선 값(흰 알파인지 단색인지), 목록 · 표 줄을 선으로 나누는지, 떠 있는 창에 둘레 선이 있는지, 입력칸을 올렸을 때 경계가 바뀌는지를 쟀다. 어느 꼴이 좋다는 판단은 적지 않는다.

## 방법

- headless Playwright(chromium), `colorScheme: 'dark'`, 뷰포트 1920×1080, `permissions: []`. 페이지를 열기 전마다 `~/noslog-research/wait-capacity.sh` 를 거쳤고 브라우저 하나에서 페이지 하나씩 열었다. 로그인 · 제출 · 동의 누르기는 하지 않았다.
- 선: 보이는 요소마다 네 변의 `border-*-width · style · color` 계산값과 `box-shadow` 가운데 `0 0 0 0.5–1.5px` 고리를 모아 색 · 두께별로 셌다. 대비는 선 색을 그 요소 부모의 실제 면 위에 합성한 뒤 WCAG 2 비로 계산했다.
- 목록 줄: 폭 400px 넘는 같은 태그 형제가 5개 이상 세로로 쌓인 묶음을 찾아 줄 사이 간격, 줄의 위 · 아래 선, 줄 안 폭 60% 넘는 자식의 선, 줄 면 색을 읽었다. 자동 판정이라 캡처를 열어 고쳤다.
- 떠 있는 창: `aria-haspopup` · `aria-expanded=false` 버튼(최대 3개, 링크는 누르지 않음)을 눌러 새로 뜬 `role=menu · listbox · dialog` 또는 새 요소의 면 · 테두리 · 그림자를 읽고 잘라 찍었다. 캡처를 열어 메뉴가 아닌 것이 잡힌 2건(치지직 첫 캡처 · 티빙 첫 캡처)은 셈에서 뺐다.
- 입력칸 올림: 첫 보이는 입력칸(또는 그 테두리를 그리는 부모 3단계 안)의 테두리 · 그림자 · 면을 올리기 전과 400ms 뒤에 읽어 비교했다.
- 같은 날 [글자색](./2026-11-20-color-text.md) 이 잰 다크 쪽 목록을 그대로 썼다. 새로 연 쪽 43곳 가운데 밝게 뜬 6곳(velog 소개 · SOOP · YouTube · 네이버 모바일 · 카카오페이지 · 멜론)과 막힌 3곳(OP.GG 403 · 쿠팡플레이 403 · 빗썸 HTTP2 오류)은 셈에서 뺐다. 네이버페이는 로그인 쪽(다크)으로 넘어가 그 쪽을 쟀다.
- [다크 서비스 값 한 벌](./2026-11-12-dark-service-sets.md) · 공유 메모 `common-layer/stage2/docs/sites/*.md` 의 「선 구분선」 「그림자 드롭다운 · 메뉴」 줄은 이번에 다시 잰 곳 대조에 쓰고, 이번에 못 연 떠 있는 창 세 곳(GitHub · Vercel · Binance)만 그 기록에서 옮겼다.
- 원자료 · 캡처 · 스크립트: 공유 메모 폴더 `common-layer/stage3/color/color-line-accent/`(`raw/<곳>-0.json` · `shots/<곳>-0.jpg` 첫 화면 · `shots/<곳>-0-menu<n>.jpg` 떠 있는 창 · `scripts/probe.js · run.mjs · summ.py · agg.py`). 곳마다 요약 `agg.json`.
- 한계: 공개 쪽만 봤다. 토스트는 띄울 방법이 없어 서비스 쪽은 모두 미확인이다. 떠 있는 창은 연 곳이 17곳이라 30곳에 못 미친다.

## 당근 SEED 3.2.1 같은 쓰임 토큰

정본 `common-layer/stage3/daangn-tokens.md`(줄 번호는 그 파일 기준).

| 토큰                      | 값        | 쓰이는 곳                                                                  | 출처                    | #000 위 | #16171b 위 |
| ------------------------- | --------- | -------------------------------------------------------------------------- | ----------------------- | ------- | ---------- |
| `stroke-neutral-muted`    | #ffffff17 | 탭 목록 아래선(inset 0 -1px) · 메뉴 묶음 사이 · 외곽 칩 · 외곽 버튼 테두리 | 238 · 882 · 932 · 988줄 | 1.17    | 1.28       |
| `stroke-neutral-subtle`   | #ffffff0d | 기준선 상자 머리 아래선 · image-frame                                      | 240줄                   | 1.08    | 1.14       |
| `stroke-neutral-weak`     | #393d46   | text-input outline inset 1px · 기준선 푸터 선                              | 241 · 753줄             | 1.93    | 1.65       |
| `stroke-neutral-contrast` | #f3f4f5   | 입력칸 포커스 2px · 고른 칩 고리                                           | 237 · 755 · 1002줄      | 19.07   | 16.26      |

- 구분선 쪽은 흰 알파 둘(17 · 0d), 입력 경계만 단색(#393d46)이다.
- `list-item__root` 는 `border: none`(1128줄). 목록 줄은 선 없이 패딩 · 올림 면 `bg-transparent-pressed` #ffffff0d 로 나눈다.
- dialog · alert-dialog(1170 · 1198줄)는 면 #1d2025 만, menu · popover · select 는 그림자 `shadow-s3` `0 4px 16px #000c` 만 있고 둘레 선이 없다.
- text-input 에 올림 규칙이 없다. 포커스 때만 `::after` 2px #f3f4f5.
- 실제 daangn.com 은 규격과 갈린다. 「더보기」 메뉴(`div[role=menu]`, 면 #1d2025)에 `0 0 0 1px #ffffff17` 고리 + `0 1px 4px #00000080` 그림자가 있다(`shots/daangn-0-menu0.jpg`). 검색칸은 테두리 없이 면 #1d2025 + 그림자 `0 1px 4px #00000080` 이고 올려도 바뀌지 않았다.

## 디자인 시스템

공식 토큰 · 부품 CSS 를 읽은 곳 6곳. 토스 TDS(선 토큰 문서 없음) · Apple HIG(값 없음) · Shopify Polaris(다크 덮어쓰기 없음)는 뺐다.

| 시스템          | 구분선                                                                    | 목록 · 표 줄                                                             | 떠 있는 창 둘레                                                                               | 입력칸 올림                                                                                           | 출처                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 당근 SEED 3.2.1 | 흰 알파 #ffffff17 · #ffffff0d                                             | 선 없음(간격 · 올림 면), 선 있는 줄은 `menu-sheet-item` 하나             | 없음(면 · 그림자만, snackbar 는 밝은 면)                                                      | 바뀌지 않음, 기본 inset 1px #393d46                                                                   | 위 표                                                                                                                                                   |
| GitHub Primer   | 단색 `borderColor-default` #3d444d, muted #3d444db3                       | 기본 선 없음. ActionList `data-dividers=true` 면 1px `borderColor-muted` | 있음. floating 그림자 첫 겹 `0 0 0 1px #3d444d`, 토스트 `inset 0 0 0 1px borderColor-default` | 바뀌지 않음(TextInputWrapper 에 :hover 규칙 없음), 기본 #3d444d                                       | primitives@10 dark.css · @primer/react 38.45.0 `ActionList-64885d7a.css` · `TextInputWrapper-b2f7f9fa.css` · `stage2/docs/github-primer.md` 9 · 30–32줄 |
| Vercel Geist    | 단색 gray-400 #2e2e2e 기본, 바탕이 비치는 자리만 gray-alpha-400 #ffffff24 | 미확인                                                                   | 있음. menu `0 0 0 1px #ffffff25, …`, modal 첫 겹도 테두리                                     | 바뀜. `0 0 0 1px` #ffffff24 → 올림 #ffffff3d                                                          | `stage2/docs/vercel-geist.md` 9 · 10 · 30 · 31 · 45줄                                                                                                   |
| 원티드 Montage  | 알파 `line-neutral-tertiary` #70737C38                                    | 미확인                                                                   | 메뉴만 테두리 1px #333438, modal · toast 는 없음                                              | 바뀌지 않음, 기본 inset 1px #70737C47                                                                 | `stage2/docs/wanted-montage.md` 9 · 10 · 30–32 · 56줄                                                                                                   |
| 채널톡 Bezier   | 흰 알파 `border-neutral` #ffffff1f, 탭 아래선 #ffffff14                   | 선 없음(ListItem 올림 면 #ffffff14)                                      | 선 대신 모든 elevation 에 `inset 0 0 2px #ffffff1f`                                           | 경계 그대로, 면만 #242426 → #1d1d20                                                                   | `stage2/docs/channel-bezier.md` 9 · 26 · 28 · 30–33줄                                                                                                   |
| Atlassian       | 알파 `color.border` #A6C5E229                                             | 미확인                                                                   | 있음. `shadow.overlay` 첫 겹 `0 0 0 1px #39424a`                                              | 면 `background.input` #22272B → `.hovered` #282E33. 경계 `border.input` #738496 의 올림 변화는 미확인 | `common-layer/stage3/color/color-status/ds-src/atl-dark.js`                                                                                             |

DS 셈: 구분선 흰 알파 4(SEED · Montage · Bezier · Atlassian) · 단색 2(Primer · Geist). 목록 줄 선 없음 3(SEED · Primer 기본 · Bezier) · 미확인 3. 떠 있는 창 둘레 있음 3(Primer · Geist · Atlassian) · 메뉴만 1(Montage) · 없음 1(SEED) · 안쪽 번진 빛 1(Bezier). 입력 올림 바뀌지 않음 3(SEED · Primer · Montage) · 경계가 밝아짐 1(Geist) · 면만 바뀜 2(Bezier · Atlassian).

## 실제 서비스

34곳(국내 16 · 해외 18). 구분선 칸은 쪽에서 가로로 넓게 그은 선(머리 · 푸터 · 구역 · 목록) 가운데 가장 많이 쓴 값과 그 위 면, 대비다. 칸 · 버튼 테두리만 있는 곳은 「구분선 없음」 으로 적었다. 「—」 는 그 쪽에 해당 부품이 없어 미확인.

| 곳           | 쪽                                 | 구분선 (면 · 대비)                                                      | 목록 · 표 줄                                     | 떠 있는 창                                                                  | 입력칸 올림                                              |
| ------------ | ---------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------- |
| 당근         | daangn.com/kr/buy-sell · community | 알파 #ffffff0d(#16171b · 1.14), 칸 테두리 단색 #393d46(#000 · 1.93)     | 동네생활 글 목록: 선 없음, 간격 16               | 메뉴 고리 `0 0 0 1px #ffffff17` + 그림자                                    | 바뀌지 않음                                              |
| 토스증권     | tossinvest.com · /screener         | 알파 #d9d9ff1c(#101013 · 1.27), 칸은 `inset 0 0 0 0.5px #dadfe90a` 고리 | 종목 표: 선 · 간격 없음, 줄 44 · 40              | 갈림: 설명 창 고리 `0 0 0 1px #dedeff30`, 검색 대화상자는 선 없음(그림자만) | —                                                        |
| 치지직       | chzzk.naver.com/category           | 단색 #2e3033 · 푸터 #202224(#141517 · 1.38 · 1.14)                      | 카드 격자라 줄 없음                              | 미확인(잡힌 것이 메뉴가 아님)                                               | 바뀌지 않음(검색칸 1px #2e3033)                          |
| 네이버페이   | nid.naver.com 로그인               | 알파 #ffffff1a(#1f1f1f · 1.35), 입력 밑줄 단색 #505050                  | —                                                | 언어 메뉴 테두리 1px #ffffff26 + 그림자                                     | 바뀌지 않음(포커스 때 밑줄 #03c75a)                      |
| 바이브       | vibe.naver.com/chart/total         | 알파 #ffffff0d · #ffffff1a(#000 · 1.08 · 1.2)                           | 순위표: 선 없음, 줄 66                           | 옵션 메뉴 면 #222222, 선 · 그림자 없음                                      | 바뀌지 않음                                              |
| 카카오웹툰   | webtoon.kakao.com/ranking          | 구분선 없음(테두리 0개)                                                 | 카드 격자                                        | —                                                                           | —                                                        |
| 나무위키     | namu.wiki 문서                     | 단색 #383b40 · #444(#1c1d1f · 1.5)                                      | 표: 칸 테두리 1px #383b40                        | —                                                                           | 바뀌지 않음                                              |
| 티빙         | tving.com/help/notice              | 단색 #191919 · #2e2e2e · #212121(#000 · 1.19–1.55)                      | 공지 표: 칸 아래선 1px #191919                   | 브랜드 메뉴 테두리 1px #4f4f4f + 그림자                                     | —                                                        |
| 라프텔       | laftel.net/finder                  | 구분선 없음(테두리 0개)                                                 | 카드 격자                                        | —                                                                           | —                                                        |
| 다음         | news.daum.net                      | 알파 #ffffff14 · #ffffff0a(#1c1e21 · 1.26)                              | 기사 목록: 줄 아래선 1px #ffffff14               | —                                                                           | —                                                        |
| 왓챠         | pedia.watcha.com                   | 구분선 없음(버튼 테두리 #ffffff33 만)                                   | 카드 격자                                        | —                                                                           | —                                                        |
| 레진         | lezhin.com/ko/ranking              | 탭 줄 단색 #222225(#111115 · 1.19), 카드 테두리 알파 #ffffff1a          | 카드 격자                                        | 검색 판 면 #111115, 선 없음, 그림자 `0 6px 20px #00000033`                  | —                                                        |
| 클래스101    | class101.net/ko                    | 알파 #fafafa0f(#141414 · 1.16)                                          | 질문 목록 5줄: 선 없음                           | —                                                                           | —                                                        |
| DAK.GG       | dak.gg                             | 단색 #363944(#27282e · 1.28)                                            | 옆 목록 줄 아래선 #363944                        | —                                                                           | —                                                        |
| STOVE 스토어 | store.onstove.com/ko               | 알파 #ffffff1a(#000 · 1.2)                                              | 카드 격자                                        | —                                                                           | 바뀌지 않음                                              |
| 아이온2      | aion2.plaync.com 공지              | 알파 #ffffff14 · #ffffff1f(#171717 · 1.24)                              | 공지 목록: 줄 아래선 1px #ffffff14               | —                                                                           | 바뀌지 않음                                              |
| Linear       | linear.app/changelog               | 알파 #ffffff0d(#08090a · 1.09), 푸터 단색 #23252a                       | 변경 기록 목록: 선 없음, 간격 8                  | 메뉴 테두리 1px #ffffff14 + 그림자                                          | —                                                        |
| Vercel       | vercel.com/docs                    | 알파 #ffffff24(#000 · 1.35), 버튼 단색 #2e2e2e                          | 문서라 줄 목록 없음                              | 2단계 기록: menu `0 0 0 1px #ffffff25 …`                                    | 바뀌지 않음                                              |
| GitHub       | github.com/facebook/react/issues   | 단색 #3d444d(#0d1117 · 1.92) · #3d444db3(1.52)                          | 이슈 목록: 줄 위선 1px #3d444db3                 | 2단계 기록: `0 0 0 1px #3d444d` + 그림자                                    | 바뀌지 않음                                              |
| Raycast      | raycast.com/store                  | 알파 #ffffff0f(#07080a · 1.12), 검색 단색 #2f3031                       | 카드 격자                                        | —                                                                           | 바뀜: 테두리 #ffffff0d → #ffffff40                       |
| Spotify      | open.spotify.com/playlist          | 알파 #ffffff1a(#121212 · 1.3, 표 머리 아래)                             | 곡 표: 선 없음, 줄 56                            | 메뉴 면 #282828, 선 없음, 그림자                                            | 바뀜: 면 #1f1f1f → #2a2a2a + `inset 0 0 0 1px #ffffff1a` |
| Twitch       | twitch.tv/directory                | 알파 #53535f8c(#2e2e35 · 1.36)                                          | 카드 격자                                        | 메뉴 면 #323239, 선 없음, 그림자                                            | 바뀜: `inset 1px #dedee3f2` → `inset 2px #dedee38c`      |
| Supabase     | supabase.com/blog                  | 미확인(oklch 값이라 셈 못 함)                                           | 글 목록: 선 없음                                 | 메뉴 테두리 1px oklch(0.95 … / 0.075) + 그림자                              | 바뀌지 않음                                              |
| Steam        | store.steampowered.com/charts      | 단색 #2f3138 · #2e3033(#171a21 · 1.34)                                  | 순위표: 줄마다 면 + 간격 3                       | 언어 메뉴 면 #3d4450, 선 없음, 그림자 `0 0 12px #000`                       | 바뀜: 테두리 #ffffff24 → #1aa0ff63                       |
| osu!         | osu.ppy.sh/rankings                | 미확인(잡힌 테두리가 불러오기 원뿐)                                     | 순위표: 줄마다 면 + 간격 3                       | —                                                                           | —                                                        |
| Chess.com    | chess.com/leaderboard/live         | 알파 #ffffff1a(#262522 · 1.36)                                          | 순위표: 줄무늬(#ffffff05 번갈아)                 | —                                                                           | —                                                        |
| MDN          | developer.mozilla.org              | 단색 #51565d(#18191b · 2.38)                                            | 표: 칸 테두리 #51565d + 줄무늬 #212426 · #18191b | 메뉴 테두리 1px #51565d, 그림자 없음                                        | 바뀌지 않음                                              |
| Mastodon     | mastodon.social/explore            | 구분선 없음(테두리 0개)                                                 | —                                                | 메뉴 테두리 1px #d1c7ff33 + 그림자                                          | 바뀌지 않음                                              |
| Hugging Face | huggingface.co/models              | 단색 #141c2e(#0b0f19 · 1.13)                                            | 카드 격자                                        | 검색 대화상자 · 메뉴 테두리 1px #141c2e 계열 + 그림자                       | —                                                        |
| GitLab 문서  | docs.gitlab.com                    | 단색 #3a383d · #4d4b4e(#18171d · 1.54)                                  | 문서라 줄 목록 없음                              | —                                                                           | —                                                        |
| Apple Music  | music.apple.com/kr                 | 알파 #ffffff0d(#1f1f1f · 1.15, 옆 막대)                                 | 카드 격자                                        | —                                                                           | —                                                        |
| Disney+      | disneyplus.com/ko-kr               | 알파 #b7b8bd33(#040714 · 1.41)                                          | 요금 표: 줄 아래선 1px #b7b8bd33                 | —                                                                           | —                                                        |
| Binance      | binance.com/en/markets             | 단색 #333b47(#181a20 · 1.54)                                            | 시세 표: 선 없음, 줄 64                          | 2단계 기록: 면 #1e2329 · `inset 0 0 2px #ffffff33` + 그림자                 | —                                                        |
| Discord      | discord.com/servers                | 알파 #97979f1f(1.12)                                                    | 카드 격자                                        | —                                                                           | 바뀜: 면 흰 12% → 20%                                    |

캡처: `shots/<곳>-0.jpg`, 떠 있는 창 `shots/<곳>-0-menu<n>.jpg`(당근 0 · 토스 1의 1 · 네이버페이 0 · 바이브 1 · 레진 0 · 티빙 1 · Linear 0 · Spotify 0 · Twitch 0 · Supabase 0 · Steam 0 · MDN 0 · Mastodon 0 · Hugging Face 0 · 토스 0의 0).

## 묶음 — 판 재료

### 구분선 값

| 꼴                          | 곳 수 (국내 · 해외) | 서비스                                                                                                                                                                  | DS                                  |
| --------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 가. 흰 알파 한두 값(5–14%)  | 17 (8 · 9)          | 당근 · 토스증권 · 네이버페이 · 바이브 · 다음 · 클래스101 · STOVE · 아이온2 / Linear · Vercel · Raycast · Spotify · Twitch · Chess.com · Apple Music · Disney+ · Discord | SEED · Montage · Bezier · Atlassian |
| 나. 단색 회색               | 11 (5 · 6)          | 치지직 · 나무위키 · 티빙 · 레진 · DAK.GG / GitHub · Steam · MDN · Hugging Face · GitLab · Binance                                                                       | Primer · Geist                      |
| 다. 가로 구분선을 긋지 않음 | 4 (3 · 1)           | 카카오웹툰 · 라프텔 · 왓챠 / Mastodon                                                                                                                                   | 0                                   |

- 알파 값은 #ffffff0d(5%) · 0f · 14(8%) · 1a(10%) · 1f · 24(14%) 에 모였다. 당근 SEED 는 17(9%) · 0d(5%) 두 값이다.
- 대비는 꼴과 상관없이 1.08–1.55 에 모였고 2 를 넘는 곳은 MDN(2.38) · 칸 테두리 나무위키(#868686 2px 4.63) 뿐이다.
- 미확인 2(Supabase · osu!).

### 목록 · 표 줄 나누기 (줄 목록이 있는 19곳)

| 꼴                        | 곳 수 (국내 · 해외) | 서비스                                                                                           | DS                          |
| ------------------------- | ------------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| 가. 줄마다 1px 선         | 8 (5 · 3)           | 다음 · 아이온2 · 티빙 · 나무위키(표) · DAK.GG(옆 목록) / GitHub · Disney+ · MDN(표, 줄무늬 함께) | Primer(켜는 옵션)           |
| 나. 선 없이 높이 · 간격만 | 8 (4 · 4)           | 토스증권 · 바이브 · 당근(간격 16) · 클래스101 / Spotify · Binance · Supabase · Linear(간격 8)    | SEED · Primer 기본 · Bezier |
| 다. 줄마다 면 + 틈        | 2 (0 · 2)           | Steam · osu!                                                                                     | 0                           |
| 라. 줄무늬                | 1 (0 · 1)           | Chess.com(MDN 표도 겹침)                                                                         | 0                           |

- 다 · 라 는 근거 약함(1–2곳).
- 순위표만 보면 선 없음 3(토스 종목 · 바이브 차트 · Binance 시세) · 줄 면 2(Steam · osu!) · 줄무늬 1(Chess.com) · 선 0. 국내 순위표에서 줄 선을 쓴 곳은 이번 표본에 없다.

### 떠 있는 창 둘레 (연 곳 17)

| 꼴                                                | 곳 수 (국내 · 해외) | 서비스                                                                                                                                                                                                    | DS                                           |
| ------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 가. 1px 선(테두리 또는 `0 0 0 1px` 고리) + 그림자 | 10 (4 · 6)          | 당근(고리 #ffffff17) · 토스증권 설명 창(고리 #dedeff30) · 네이버페이(#ffffff26) · 티빙(#4f4f4f) / Linear(#ffffff14) · Supabase · Hugging Face · Mastodon(#d1c7ff33) · GitHub(#3d444d) · Vercel(#ffffff25) | Primer · Geist · Atlassian · Montage(메뉴만) |
| 나. 선 없이 면 + 그림자                           | 6 (3 · 3)           | 레진 · 바이브(그림자도 없음) · 토스증권 검색 대화상자 / Spotify · Twitch · Steam                                                                                                                          | SEED                                         |
| 다. 1px 선만, 그림자 없음                         | 1 (0 · 1)           | MDN                                                                                                                                                                                                       | 0                                            |
| 라. 안쪽 번진 빛                                  | 1 (0 · 1)           | Binance(`inset 0 0 2px #ffffff33`)                                                                                                                                                                        | Bezier                                       |

- 토스증권은 창마다 갈려 가 · 나 둘 다에 넣었다(합 18).
- 연 곳이 17이라 30곳에 못 미친다. 묶음 전체가 근거 약함 쪽이다. 다 · 라 는 1곳씩이라 근거 약함.
- 당근 규격(SEED)은 나, 실제 daangn.com 메뉴는 가 로 갈린다.
- 토스트 둘레: 서비스 미확인(띄우지 못함). DS 는 Primer 만 있음, SEED · Montage 없음, Bezier 안쪽 빛.

### 입력칸 올림 (입력칸이 있고 잰 곳 17)

| 꼴                           | 곳 수 (국내 · 해외) | 서비스                                                                                                         | DS                      |
| ---------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 가. 바뀌지 않음              | 12 (7 · 5)          | 당근 · 치지직 · 네이버페이 · 바이브 · 나무위키 · STOVE · 아이온2 / Vercel · GitHub · Supabase · MDN · Mastodon | SEED · Primer · Montage |
| 나. 경계가 밝아지거나 굵어짐 | 3 (0 · 3)           | Raycast(#ffffff0d → #ffffff40) · Twitch(1px → 2px) · Steam(→ 파랑 #1aa0ff63)                                   | Geist                   |
| 다. 면이 밝아짐              | 2 (0 · 2)           | Spotify(+ 1px 고리가 생김) · Discord                                                                           | Bezier · Atlassian      |

- 국내 16곳 가운데 입력칸을 올려 무엇이 바뀌는 곳은 0이다. 나 · 다 는 근거 약함(2–3곳).
- 입력칸이 없거나 못 잰 곳 17은 미확인.

## 근거 약함 · 미확인 모음

- 근거 약함: 목록 다 · 라, 떠 있는 창 전체(17곳) · 그 안 다 · 라, 입력 올림 나 · 다.
- 미확인: 토스트 둘레(서비스 전부), 구분선 Supabase · osu!, 치지직 메뉴(잡힌 것이 메뉴가 아님), 입력칸 없는 17곳의 올림, DS 목록 줄 Geist · Montage · Atlassian, Atlassian 입력 경계 올림.
