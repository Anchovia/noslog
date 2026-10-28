# 부품 · 글자 · 간격 체계 묶음 조사 (2026-10-25)

[결정](../decisions/2026-10-25-design-system-cluster.md)의 근거 원문이다.

## 방법

- 출처 하나를 한 벌(부품 크기 · 폰 크기 · 글자 단계 · 간격 · 레이아웃)로 적었다. 디자인 시스템은 공식 문서와 npm 토큰 원본, 구현 라이브러리는 기본 테마 소스, 실제 사이트는 headless Playwright(Chromium)로 1280 · 390 폭을 쟀다.
- 폰 크기: 사이트는 390 폭 실측, 라이브러리는 문서에 폰 · 터치 크기가 따로 있으면 그 값, 폭에 따라 바꾸지 않으면 데스크톱 값과 같게 적었다(61곳 중 43곳).
- 기본 컨트롤 높이(32 이하 · 36 · 40 · 44 · 48 이상)와 본문 크기(13 이하 · 14 · 16 · 17 이상)가 같은 출처끼리 묶고, 묶음 안에서 칸마다 1위를 셌다. 묶음 안에서 동률이거나 흩어진 칸은 105곳 전체 수로 갈랐다.
- 원자료(출처별 JSON · 캡처)는 세션 임시 폴더에 있고 리포에는 없다. 캡처는 에이전트가 사이트별로 열어 엉뚱한 요소 · 팝업에 가린 값을 미확인으로 바꿨고, 사이트 일부(GitHub · 당근 · Stripe · 네이버 · Linear · OP.GG · 토스 · Steam · 카카오 · Cal.com)는 직접 열어 대조했다.
- 칸 이름: btnH 버튼 기본 높이 · btnSm 작은 높이 · inH 입력 높이 · inFont 입력 글자 · phoneBtnH 폰 버튼 · labelW 라벨 굵기 · hW 제목 굵기 · base 간격 단위 · marginM 폰 가장자리 여백.

## 출처

- 디자인 시스템 27곳: Ant Design v5, Apple Human Interface Guidelines, Atlassian Design System, Skyscanner Backpack, Uber Base Web, IBM Carbon, Elastic EUI, Microsoft Fluent 2, Vercel Geist, Pinterest Gestalt, GOV.UK Design System, Material Design 3, 원티드 Montage, Kiwi.com Orbit, GitLab Pajamas, Twilio Paste, Red Hat PatternFly, Shopify Polaris, GitHub Primer, Radix Themes, 당근 SEED Design, Salesforce Lightning Design System, SmartHR Design System, Adobe Spectrum 2, 토스 TDS (TDS Mobile 공개 문서), U.S. Web Design System, Workday Canvas
- 구현 34곳: Arco Design (React), Blueprint v6, Bootstrap 5.3.8, Bulma 1.0.4, Tailwind Catalyst, Chakra UI v3, daisyUI v5, Element Plus, Evergreen (Segment), Flowbite, Fomantic-UI (default 테마), Foundation for Sites 6.9.0, Grommet, HeroUI v3, Ionic Framework, Kendo UI (Default theme), Mantine v8, MUI Material UI v7, Naive UI, Nuxt UI v3 (3.3.7), Park UI (Panda preset), Pico CSS v2, Preline UI, PrimeReact (Aura 테마), Quasar, React Aria Components (Tailwind starter), Semi Design, shadcn/ui (new-york v4), TDesign (tdesign-vue-next 1.20.10), Tremor (Tremor Raw), UIkit 3, Vant 4, Vuetify 3, Web Awesome 3.14.0 (default theme)
- 사이트 44곳: 11번가 (쿠팡 대신), Airbnb, Amazon, Apple, Atlassian Jira 소개, Booking.com, Cal.com, Chess.com 리더보드, Clerk, 당근 중고거래, Discord, Dropbox, Duolingo, Figma, GitHub, Hacker News (Stack Overflow 대신), Hugging Face 모델 목록 (Letterboxd 대신), 카카오, Lichess 플레이어, Linear, MDN Web Docs, Medium, Microsoft, 무신사, 네이버, Netflix, Notion, OP.GG 랭킹, osu! 랭킹 · 비트맵 목록, Reddit, Resend, Shopify, Slack, Speedrun.com 게임 목록, Spotify, Steam, Stripe, Supabase, 토스, Twitch, Vercel, 원티드 채용 목록, Wikipedia, YouTube
- 세지 않은 곳 4곳: Google(캡차) · Etsy(403) · Pinterest(로그인 창) · Letterboxd(캡차). 쿠팡 · Stack Overflow 는 막혀 11번가 · Hacker News 로 바꿨다.

## 기본 컨트롤 높이 × 본문 크기

| 컨트롤 \\ 본문 | ≤13 | 14  | 16  | 17+ |
| -------------- | --- | --- | --- | --- |
| ≤32            | 6   | 16  | 4   | –   |
| 36             | –   | 7   | 9   | 1   |
| 40             | 3   | 5   | 15  | 2   |
| 44             | –   | 3   | 5   | –   |
| 48+            | 2   | 5   | 6   | 6   |

두 값을 모두 아는 곳 95곳.

## 큰 묶음

### 컨트롤 ≤32 · 본문 14 — 16곳

- 속한 곳: Ant Design v5, Arco Design (React), Atlassian Design System, Blueprint v6, Element Plus, Evergreen (Segment), Microsoft Fluent 2, Hugging Face 모델 목록 (Letterboxd 대신), 카카오, Kendo UI (Default theme), GitLab Pajamas, GitHub Primer, Semi Design, Steam, TDesign (tdesign-vue-next 1.20.10), Twitch
- 1위 값과 가장 많이 맞는 체계: Microsoft Fluent 2(21/23) · Semi Design(20/25) · Ant Design v5(19/27)
- 칸별 1위(수/표본): btnH 32 12/16 · btnSm 24 9/12 · inH 32 9/15 · radius 4 5/16 · btnWeight 400 8/16 · inFont 14 12/15 · phoneBtnH 32 10/13 · body 14 16/16 · bodyLh 20 6/14 · small 12 15/16 · label 14 12/16 · labelW 400 9/16 · h1 32 4/13 · h2 28 4/13 · h3 24 4/14 · hW 600 8/14 · base 4 8/10 · marginM 16 3/7 · labelGap 4 4/12 · fieldGap 24 4/11 · inlineGap 8 6/11

### 컨트롤 40 · 본문 16 — 14곳

- 속한 곳: Bootstrap 5.3.8, Bulma 1.0.4, Chakra UI v3, daisyUI v5, Foundation for Sites 6.9.0, Pinterest Gestalt, HeroUI v3, Material Design 3, 원티드 Montage, Park UI (Panda preset), 당근 SEED Design, Tremor (Tremor Raw), UIkit 3, Workday Canvas
- 1위 값과 가장 많이 맞는 체계: Chakra UI v3(19/24) · Material Design 3(18/26) · Park UI (Panda preset)(18/25)
- 칸별 1위(수/표본): btnH 40 11/14 · btnSm 32 5/13 · inH 40 8/14 · radius pill 4/14 · btnWeight 500 6/14 · inFont 16 9/14 · phoneBtnH 40 11/14 · body 16 14/14 · bodyLh 24 12/13 · small 12 6/13 · label 14 10/14 · labelW 500 6/14 · h1 32 2/10 · h2 28 3/9 · h3 24 4/10 · hW 400 3/10 · base 4 9/13 · marginM 16 5/10 · labelGap 8 4/13 · fieldGap 16 5/8 · inlineGap 8 5/8

### 컨트롤 36 · 본문 16 — 9곳

- 속한 곳: Skyscanner Backpack, Cal.com, 당근 중고거래, Mantine v8, MUI Material UI v7, React Aria Components (Tailwind starter), shadcn/ui (new-york v4), 토스, Vuetify 3
- 1위 값과 가장 많이 맞는 체계: shadcn/ui (new-york v4)(20/34) · Skyscanner Backpack(17/29) · Vuetify 3(17/28)
- 칸별 1위(수/표본): btnH 36 8/9 · btnSm 28 1/4 · inH 36 4/7 · radius 8 4/9 · btnWeight 500 4/9 · inFont 14 3/7 · phoneBtnH 36 6/8 · body 16 9/9 · bodyLh 24 5/9 · small 12 5/9 · label 14 5/9 · labelW 500 6/9 · h1 96 2/8 · h2 48 2/8 · h3 24 2/7 · hW 700 4/8 · base 4 3/5 · marginM 16 7/8 · labelGap 4 2/4 · fieldGap 0 2/5 · inlineGap 8 4/7

### 컨트롤 36 · 본문 14 — 7곳

- 속한 곳: Fomantic-UI (default 테마), Vercel Geist, Naive UI, Twilio Paste, Red Hat PatternFly, PrimeReact (Aura 테마), Quasar
- 1위 값과 가장 많이 맞는 체계: Vercel Geist(20/30) · Twilio Paste(18/28) · Red Hat PatternFly(14/29)
- 칸별 1위(수/표본): btnH 36 4/7 · btnSm 28 3/7 · inH 36 2/7 · radius 3 2/7 · btnWeight 500 3/7 · inFont 14 7/7 · phoneBtnH 36 4/7 · body 14 7/7 · bodyLh 21 3/7 · small 12 4/5 · label 14 6/7 · labelW 500 3/7 · h1 32 2/6 · h2 24 3/6 · h3 18 3/6 · hW 600 3/6 · base 4 3/4 · marginM 24 2/3 · labelGap 4 2/4 · fieldGap 24 2/4 · inlineGap 12 2/4

## 폰 크기

- 폰 크기를 따로 두거나 390 에서 잰 곳: 폰 입력 32곳 중 40 이상 26곳(40 = 6 · 44 = 5 · 32 = 2), 폰 버튼 49곳 중 40 이상 30곳(32 = 7 · 40 = 7).
- 폰 작은 버튼: 14곳 중 32 = 3 · 36 = 3(동률).
- 폰 제목(사이트 위주): h1 32 = 7곳 · 24 = 4곳, h2 24 = 6곳 · 16 = 5곳. 폰 본문은 16 = 18곳 · 14 = 8곳 · 12 = 8곳.

## 한계

- 실제 사이트는 대부분 공개 첫 화면(마케팅)이라 제목 · 버튼이 크다. 그래서 사이트 대부분은 큰 묶음 밖으로 흩어졌고 묶음 A · B 는 디자인 시스템 · 라이브러리 위주다.
- 사이트에서는 폼을 내지 않아 오류 · 비활성 · 토스트 · 폼 칸 사이는 거의 재지 못했다.
- h1–h4 이름이 없는 체계는 단계 순서나 쓰임으로 맞췄다(Geist · Spectrum 2 · Workday · Polaris · Radix · Pajamas · M3).
- 묶음 A 의 제목 크기(h1 32 · h2 28)는 13곳 중 4곳씩이고, 헤더 · 구역 사이 · 카드 격자는 표본이 적거나 흩어졌다.
- Apple HIG · 토스 TDS 는 공개 문서에 수치가 적어 대부분 미확인이다.
