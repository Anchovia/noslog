# 흰 면 요소의 키보드 포커스 — 다크 실제 서비스 · 디자인 시스템 실측 (2026-11-21)

공통 층 3단계 색 판(강조색 · 포커스)의 재료다. 강조 면을 흰 #f3f4f5 로 정하자 기존 포커스 규칙(흰 2px 한 줄)이 흰 면 부품 위에서 면과 같은 색이 되어 보이지 않게 됐다. 그래서 질문 하나만 쟀다. 다크 테마에서 면이 흰색 · 밝은 회색인 버튼 · 칩 · 세그먼트 고른 칸 · 고른 쪽 번호에 키보드 포커스가 오면, 실제 서비스는 포커스를 어떻게 보이게 하는가. 어느 꼴이 좋다는 판단은 적지 않는다.

일반 요소의 포커스 33곳은 [강조색 · 링크 · 포커스](./2026-11-20-color-accent.md)에 있다. 이번에는 흰 면 요소만 골라 다시 쟀다(겹치는 곳도 흰 면 요소로 다시 잼).

## 방법

- headless Playwright(Chromium), `colorScheme: 'dark'`, `permissions: []`, 1920×1080, 2배 캡처(`deviceScaleFactor: 2`). 쪽마다 열기 전 `~/noslog-research/wait-capacity.sh`, 브라우저 하나에 쪽 하나.
- 흰 면 요소 찾기: 누를 수 있는 요소(버튼 · 링크 · 탭 · 고른 칸) 가운데 계산된 배경이 밝은 무채색(밝기 0.62 이상, 채도 0.16 이하, 불투명 85% 이상)이고 바로 뒤 바탕이 어두운(밝기 0.25 이하) 것. 쿠키 · 동의 창 버튼은 뺐다. 국내는 사진 위 버튼을 놓치지 않으려고 바탕 조건 없이 한 번 더 돌린 뒤(`raw5/` · `shots5/`) 캡처로 바탕이 어두운지 직접 가렸다. oklch · lab 색은 캔버스로 sRGB 로 바꿔 읽었다.
- 포커스 주기: 쪽 빈 곳을 눌러 초점을 비운 뒤 Tab 을 최대 160번 눌러 그 요소에 닿으면 잰다(`how: Tab n`). 닿지 못한 요소는 키를 한 번 누른 뒤 `focus()` 로 주고 `:focus-visible` 이 참인지 확인했다(`how: focus()`).
- 잰 값: 포커스 전후의 `outline` · `outline-offset` · `box-shadow` · `border` · 배경, 면 요소 · 부모 · 첫 자식 · `::before` · `::after` 의 그림자 · 테두리. 포커스 전후 캡처를 둘 다 남기고 직접 열어 보이는지 확인했다. 계산값이 바뀌어도 캡처에서 안 보이면 「표시 없음」.
- 원자료 · 캡처 · 스크립트: 공유 메모 폴더 `local_eb1ae001-…/color/focus-on-white/`(`raw/<곳>-0.json`, `shots/<곳>-0-w<n>-before.png` · `-focus.png`, `scripts/run.mjs` · `agg.py`).

## 곳마다 (실제 서비스)

면 · 바탕은 포커스 전 계산값. 「간격」 은 링과 면 사이(outline-offset, 그림자 링은 바탕색으로 칠한 띠 두께). 캡처는 `shots/` 아래 파일 이름.

### 해외

| 곳           | 흰 요소(자리)                     | 면 / 바탕         | 포커스 표시(계산값)                                                                      | 꼴                    | 캡처                         |
| ------------ | --------------------------------- | ----------------- | ---------------------------------------------------------------------------------------- | --------------------- | ---------------------------- |
| Vercel       | 「Deploy now」 · 「Sign Up」 버튼 | #ededed / #000    | 그림자 `0 0 0 2px #0a0a0a, 0 0 0 4px #52a8ff` — 어두운 띠 2 + 파랑 2                     | 다. 어두운 띠 + 색    | `vercel-0-w1-focus.png`      |
| Cal.com      | 「Sign up with Google」 버튼      | #e5e5e5 / #0f0f0f | 그림자 `0 0 0 1px #0f0f0f, 0 0 0 3px #737373` — 바탕색 띠 1 + 회색 2                     | 다. 어두운 띠 + 색    | `calcom-0-w1-focus.png`      |
| Linear       | 「Sign up」 버튼                  | #e5e5e6 / #08090a | outline 1px #5e69d1(브랜드 남보라), 간격 2                                               | 가. 색 링 + 간격      | `linear-0-w0-focus.png`      |
| Discord      | 「Log In」 버튼                   | #fff / #1a2081    | outline 2px #5865f2(브랜드 보라), 간격 4                                                 | 가. 색 링 + 간격      | `discord-0-w0-focus.png`     |
| Neon         | 「Sign up」 버튼                  | #fff / #000       | outline 2px #38a57d(브랜드 초록), 간격 2                                                 | 가. 색 링 + 간격      | `neon-0-w0-focus.png`        |
| Perplexity   | 음성 모드 원형 버튼               | #dbdee3 / #15171b | outline 2px #4e99a3(브랜드 청록), 간격 2                                                 | 가. 색 링 + 간격      | `perplexity-0-w0-focus.png`  |
| Apple Music  | 「로그인」 버튼                   | #fff / #262628    | 그림자 `0 0 0 4px #0a84ff99` — 붙은 파랑 4                                               | 나. 붙은 색 링        | `applemusic-0-w0-focus.png`  |
| PlanetScale  | 고른 탭 「Vitess」                | #fff / #111       | 그림자 `0 0 0 3px #1e9de7` — 붙은 파랑 3                                                 | 나. 붙은 색 링        | `planetscale-0-w0-focus.png` |
| Cursor       | 「Download for macOS」 버튼       | #edecec / #14120b | outline 2px #edecec(면과 같은 색), 간격 3(다른 버튼 2)                                   | 라. 같은 흰 링 + 간격 | `cursor-0-w1-focus.png`      |
| Raycast      | 「Download」 버튼                 | #e6e6e6 / #07080a | 그림자에 붙은 `0 0 0 2px #f4f4f4` + 흐린 흰 후광 14px — 면이 2px 커진 것처럼 보임        | 마. 거의 안 보임      | `raycast-0-w0-focus.png`     |
| Spotify      | 「Log in」 버튼                   | #fff / #000       | 브라우저 기본 고리(auto, #99c8ff), 간격 0                                                | 바. 브라우저 기본     | `spotify-0-w0-focus.png`     |
| Twitch       | 「Sign Up」 버튼                  | #fff / #451093    | 브라우저 기본 고리(auto, #99c8ff) + 흰 후광 6px, 면 #fff → #ffffffe6                     | 바. 브라우저 기본     | `twitch-0-w0-focus.png`      |
| Hugging Face | 「Getting started」 버튼          | #fff / #0b0f19    | 브라우저 기본 고리(auto, #99c8ff), 간격 1                                                | 바. 브라우저 기본     | `huggingface-0-w0-focus.png` |
| Framer       | 「Sign up」 버튼                  | #fff / #000       | 브라우저 기본 고리(auto, #005fcc), 간격 1                                                | 바. 브라우저 기본     | `framer-0-w0-focus.png`      |
| v0           | 「View Details」 버튼             | #ededed / #000    | 그림자 `0 0 0 1px #0a0a0a, 0 0 0 3px #52a9ff`, 면 #ededed → #a1a1a1                      | 다. 어두운 띠 + 색    | `v0-0-w1-focus.png`          |
| Astro        | 「Get Started」 버튼              | #fff / #060913    | outline 2px #e8c4f9(옅은 보라), 간격 2                                                   | 가. 색 링 + 간격      | `astro-0-w0-focus.png`       |
| Spline       | 「Start building」 버튼           | #eee / #000       | outline 1px #8eb2f2, 간격 3                                                              | 가. 색 링 + 간격      | `spline-0-w0-focus.png`      |
| Grok         | 「Sign up」 버튼                  | #e6e5e3 / #1e1d1d | outline 1px #1084fe(80%), 간격 0                                                         | 나. 붙은 색 링        | `xai-0-w0-focus.png`         |
| Nuxt         | 「Explore all modules」 버튼      | #fff / #0a0a0a    | outline 3px #ffffff40(흰 25%), 간격 0 — 붙은 회색 띠로 보임                              | 나. 붙은 색 링        | `nuxt-0-w6-focus.png`        |
| Rive         | 「GET STARTED」 버튼              | #fff / #000       | 브라우저 기본 고리(auto, #005fcc), 간격 1, 면 #fff → #dfe0e3                             | 바. 브라우저 기본     | `rive-0-w0-focus.png`        |
| Upstash      | 고른 메뉴 「Caching」             | #fff / #000       | 브라우저 기본 고리(auto, #005fcc), 간격 0                                                | 바. 브라우저 기본     | `upstash-0-w0-focus.png`     |
| Bun          | 「Install」 버튼                  | #eaeae8 / #0d0a0c | 계산값은 outline 2px #ff2e97 간격 2 인데 캡처에 안 보임(버튼 모양을 잘라 낸 탓으로 보임) | 사. 표시 없음         | `bun-0-w0-focus.png`         |

세지 않은 곳: GitLab(쿠키 창이 버튼을 가림, 계산값은 흰 2px 간격 2 + 면이 투명으로 바뀜 — 미확인), Riot Games(잡힌 흰 버튼이 쿠키 설정 창 「Save」), Threads(로그인 창이 덮음), Mobbin(쿠키 창 「Accept」), PlayStation(포커스 때 면이 회색으로 바뀌고 회색 띠가 생기지만 계산값으로 원인을 못 읽음 — 미확인), Epic · X · ChatGPT · OpenAI · TIDAL · Midjourney · Netflix · MUBI · Lovable · Replit · HBO Max · Tesla · Crunchyroll · Reddit(403 · 503 · 차단). 흰 면 요소가 공개 쪽에 없던 곳: GitHub · Supabase · Resend · Clerk · Railway · Warp · Zed · Tailwind CSS · Prisma · ElevenLabs · Runway · Anthropic · Apple TV · Bolt · Windsurf · Sentry · Deno · Kick · Nothing · Arc · Mistral AI · Ollama · Obsidian · Superhuman · Fly.io · Turso · YouTube · Blizzard · Xbox · NVIDIA · Ubisoft.

### 국내

| 곳     | 흰 요소(자리)                                                                             | 면 / 바탕                          | 포커스 표시(계산값)                                                                            | 꼴                | 캡처                                                                               |
| ------ | ----------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| 당근   | 위 탐색 고른 칩 「중고거래」 · 「현재 위치」 버튼 · 부동산 지도 세그먼트 고른 칸 「매물」 | #f3f4f5 / #16171b · #000           | outline 2px #1e82eb, 칩 간격 1 · 버튼 간격 2 · 지도 세그먼트 간격 −2(안쪽)                     | 가. 색 링 + 간격  | `daangn-0-w0-focus.png` · `daangn-0-w1-focus.png` · `daangn-realty-0-w0-focus.png` |
| STOVE  | GNB 「로그인」 버튼(에픽세븐 쪽도 같은 GNB)                                               | #ebebeb / #292929                  | 그림자 `inset 0 0 0 1px #fff` — 면보다 조금 밝은 안쪽 1px                                      | 마. 거의 안 보임  | `stove-0-w1-focus.png` · `epicseven-0-w0-focus.png`                                |
| 티빙   | 라이브 「로그인하고 시청하기」 버튼                                                       | #fff / #000                        | 브라우저 기본 고리(auto, #005fcc), 간격 0. 첫 화면 광고 버튼 「광고 정보 더보기」 는 표시 없음 | 바. 브라우저 기본 | `tving-live-0-w0-focus.png` · `tving-0-w1-focus.png`                               |
| 무신사 | 어두운 구역의 고른 칩 「전체」                                                            | #fff / #000                        | 브라우저 기본 고리(auto, #005fcc), 간격 0                                                      | 바. 브라우저 기본 | `musinsa-0-w0-focus.png`                                                           |
| 치지직 | 카테고리 고른 탭 「전체」 · 홈 고른 칩                                                    | #dfe2ea · #fff / #141517 · #2e2e2e | 바뀌는 값 없음                                                                                 | 사. 표시 없음     | `chzzk-0-w0-focus.png` · `chzzk-home-0-w0-focus.png`                               |
| 라프텔 | 배너 「보러가기」 버튼                                                                    | #fff / #323232                     | 바뀌는 값 없음(`focus()` 로 줌, `:focus-visible` 참)                                           | 사. 표시 없음     | `laftel-0-w0-focus.png`                                                            |
| 뤼튼   | 「로그인」 버튼                                                                           | #fff / #1e1e1e                     | 바뀌는 값 없음                                                                                 | 사. 표시 없음     | `wrtn-0-w0-focus.png`                                                              |

국내는 다크 쪽 110여 곳(국내 OTT · 음악 · 금융 · 게임 · 자동차 · 엔터 · 기술 블로그)을 열었지만 어두운 바탕 위 흰 면 요소가 공개 쪽에 있는 곳은 위 7곳뿐이었다. 많은 곳이 다크를 따르지 않고 밝게 떴고(토스 · 카카오뱅크 · 넥슨 · 엔씨 · 기아 · 삼성 등, 흰 요소가 밝은 바탕 위라 세지 않음), 다크인 곳(토스증권 · 웨이브 · 왓챠 · 바이브 · 카카오페이지 등)은 고른 칸 · 주 버튼이 유채색이나 회색 면이었다. 세지 않은 곳: 카카오웹툰(통합 팝업이 가림), 밀리의서재 · 엔씨소프트(잡힌 요소가 포커스 캡처와 어긋남), 쿠팡플레이 · 크래프톤 · OP.GG · 야놀자 · 리디 · KREAM · 빗썸 · 하이브(403 · 500 · 연결 오류), 지니 · SOOP · 네이버웹툰 · 로스트아크 · 서머너즈 워 · SK텔레콤 · D2(흰 요소가 밝은 쪽).

## 디자인 시스템

흰 · 밝은 solid 버튼이나 고른 칸이 있는 곳만 셌다. 문서 쪽을 같은 방법으로 렌더해 쟀고(캡처 있음), Carbon 은 렌더가 안 돼 공개 CSS 소스만 읽었다.

| 시스템       | 흰 요소                                                                              | 면 / 바탕                 | 포커스 표시                                                                                                               | 꼴                                     | 출처                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| SEED(당근)   | action-button neutralSolid · chip-tabs 고른 칩 · chip solid 고름 · segmented-control | #f3f4f5 / #16171b         | outline 2px `stroke-focus-ring` #1e82eb, 간격 2(탭 · 지우기 버튼만 −2)                                                    | 가. 색 링 + 간격                       | `daangn-tokens.md` 648 · 920 · 954 · 973줄, 렌더 `ds-seed-0-w0-focus.png` · `ds-seed-1-w0-focus.png`                                         |
| Radix Themes | Button(solid · classic, 고대비 solid 면 gray-12)                                     | #edeef0 / #111113         | outline 2px `--focus-8`(렌더값 #435db1), 간격 2. soft · ghost · 세그먼트 칸은 간격 −1                                     | 가. 색 링 + 간격                       | `@radix-ui/themes@3.2.1/styles.css` `.rt-BaseButton:where(.rt-variant-solid):where(:focus-visible)`, 렌더 `ds-radix-0-w1-focus.png`          |
| Spectrum 2   | 고른 토글(「Bold」) · static-white 버튼                                              | #dbdbdb→#f2f2f2 / #1b1b1b | 보통: outline 2px 파랑 #4069fd 간격 2. 색 바탕 위 static-white: outline 2px #fff 간격 2                                   | 가. 색 링 + 간격 (static-white 는 라.) | 렌더 `ds-spectrum-0-w1-focus.png` · `-w3-focus.png`, `@spectrum-css/button` `--spectrum-static-white-focus-indicator-color`                  |
| Geist        | Button 기본(흰 면)                                                                   | #ededed / #0a0a0a         | 그림자 `0 0 0 2px #0a0a0a, 0 0 0 4px #52a8ff`                                                                             | 다. 어두운 띠 + 색                     | 렌더 `ds-geist-0-w0-focus.png`(vercel.com/geist/button)                                                                                      |
| HeroUI       | 흰 solid 버튼                                                                        | #fff / #18181b            | 그림자 `0 0 0 2px #060607, 0 0 0 4px #0485f7`                                                                             | 다. 어두운 띠 + 색                     | 렌더 `ds-heroui-0-w0-focus.png`                                                                                                              |
| shadcn/ui    | Button default(다크 primary 흰 면)                                                   | #e5e5e5 / #0a0a0a         | 테두리 → `--ring` #737373, 그림자 `0 0 0 3px` ring 50%(#74747480) — 붙은 회색 반투명 3                                    | 나. 붙은 색 링                         | `new-york-v4/ui/button.tsx` `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50`, 렌더 `ds-shadcn-0-w1-focus.png` |
| Carbon(g100) | Content switcher 고른 칸(`layer-selected-inverse` #f4f4f4)                           | #f4f4f4 / #161616         | `inset 0 0 0 2px $focus`(#fff) + `inset 0 0 0 3px $focus-inset`(#161616) — 흰 면 위에서는 안쪽 2px 흰 띠 다음 1px 검은 선 | 사. 안쪽 두 색 선                      | `@carbon/styles@1.70.0/css/styles.css` `.cds--content-switcher-btn:focus`, `.cds--g100` 변수(렌더 안 함)                                     |

세지 않은 곳: Primer(문서 쪽에서 흰 · 밝은 solid 부품을 찾지 못함 — 고른 세그먼트도 다크에서 회색), Atlassian · Montage · Bezier · Toss TDS(다크 흰 solid 부품 미확인).

## 꼴별 셈

실제 서비스 29곳(국내 7 · 해외 22), 디자인 시스템 7곳. 한 곳에 꼴이 둘이면 주 버튼 쪽으로 셌다(당근은 칩 · 버튼 · 지도 세그먼트 모두 가).

| 꼴                                              | 서비스 (국내) | 서비스                                                                    | DS                                                      |
| ----------------------------------------------- | ------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| 가. 면과 다른 색 링 + 바깥 간격(1–4px)          | 7 (1)         | 당근 / Linear · Discord · Neon · Perplexity · Astro · Spline              | 3 SEED · Radix · Spectrum 2                             |
| 나. 면과 다른 색 링, 간격 없이 붙음             | 4 (0)         | Apple Music · PlanetScale · Grok · Nuxt                                   | 1 shadcn/ui                                             |
| 다. 바탕색 띠 + 색 링(두 겹 그림자)             | 3 (0)         | Vercel · Cal.com · v0                                                     | 2 Geist · HeroUI                                        |
| 라. 면과 같은 흰 링 + 바깥 간격                 | 1 (0)         | Cursor                                                                    | 0 (Spectrum 2 static-white 버튼이 색 바탕 위에서 이 꼴) |
| 마. 거의 안 보임(같은 색 붙은 링 · 안쪽 흰 1px) | 2 (1)         | STOVE / Raycast                                                           | 0                                                       |
| 바. 브라우저 기본 고리                          | 8 (2)         | 티빙 · 무신사 / Spotify · Twitch · Hugging Face · Framer · Rive · Upstash | 0                                                       |
| 사. 표시 없음                                   | 4 (3)         | 치지직 · 라프텔 · 뤼튼 / Bun                                              | 0                                                       |
| 안쪽 두 색 선(흰 2 + 검정 1, inset)             | 0             | —                                                                         | 1 Carbon                                                |

- 가 · 나 · 다 의 링 색(서비스 14): 파랑 계열 7(당근 · Apple Music · PlanetScale · Grok · Vercel · v0 · Spline), 브랜드색 5(Linear · Discord · Neon · Perplexity · Astro), 회색 · 흰 알파 2(Cal.com · Nuxt). DS 6 곳은 모두 파랑 계열이고 shadcn 만 회색.
- 링 두께(서비스 14): 1px 3(Linear · Spline · Grok) · 2px 8 · 3px 2(PlanetScale · Nuxt) · 4px 1(Apple Music). 다 의 바탕색 띠는 1px(Cal.com · v0) · 2px(Vercel). 바깥 간격(가 · 라): 1 · 2 · 3 · 4px, 가장 많은 값 2px(5곳).
- 흰 링을 면에 붙여(간격 0) 그린 곳은 없었다. 흰 링을 쓴 곳은 Cursor(간격 2–3)와 Spectrum 2 static-white(색 바탕, 간격 2) 둘이고 둘 다 간격을 띄웠다.
- 바깥 간격 없이 안쪽(−2)에 그린 흰 면 요소는 당근 지도 세그먼트 고른 칸 하나(파랑 #1e82eb).

## 근거 약함 · 미확인

- 국내 7곳뿐이다(목표 15). 국내 다크 쪽에서 흰 면 요소 자체가 드물었다. 국내만 보면 모든 꼴이 근거 약함이고, 직접 그린 링은 당근 하나다.
- 실제 서비스 합계 29곳(목표 30에 1곳 모자람).
- 근거 약함: 다(서비스 3), 라(1), 마(2). 나(4)도 3곳 안팎.
- 미확인: GitLab(쿠키 창), PlayStation(원인 계산값 없음), Bun 의 계산값과 캡처가 다른 이유, Carbon 렌더 캡처(소스만 읽음), Primer · Atlassian · Montage · Bezier · Toss TDS 의 흰 solid 부품 포커스.
