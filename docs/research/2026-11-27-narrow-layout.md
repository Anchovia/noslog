# 좁은 폭 · 중간 폭 배치 실측 기록 (2026-11-27, 판 6)

잰 방법: headless Playwright, colorScheme dark, 폭 390(iPhone UA · 터치) · 768 · 1024. 동의창은 「거부」 계열 버튼만 눌렀고 로그인 · 저장 · 제출은 하지 않음. 원자료와 캡처는 리포 밖 공유 노트 폴더 `common-layer/stage5/board-6/`(nav6a.json · help6a.json · doctree6a.json · open6a.json · rep6a.json · subbar.json · filter6b.json · filter6b2.json · rep6b.json · daangn6b.json · shots/ · sheets/ · scripts/)에 있다. 캡처 시트를 직접 열어 분류했다.

판 6a 와 6b 는 따로 센다. 지금 코드와 NosLog 지금 캡처(localhost:3000, 읽기만)는 `shots/now-*.png`. Figma 지금 화면 모바일 360 프레임은 읽지 않았다(미확인).

## 6a 사이드바 틀 네 화면

### 문서 사이트 31곳(문서 메뉴를 390에서 열어 모양을 확인, 패널 15 · 서랍 13 · 그 밖 3)

| 서비스         | URL                                                                   | 문서 메뉴 모양              | 열림 캡처                           |
| -------------- | --------------------------------------------------------------------- | --------------------------- | ----------------------------------- |
| react          | https://react.dev/learn/thinking-in-react                             | 폭 가득 패널                | shots/dt-react-0.png                |
| supabase       | https://supabase.com/docs/guides/database/overview                    | 폭 가득 패널                | shots/dt-supabase-3.png             |
| sentry         | https://docs.sentry.io/product/                                       | 폭 가득 패널                | shots/dt-sentry-0.png               |
| shadcn         | https://ui.shadcn.com/docs                                            | 폭 가득 패널                | shots/dt-shadcn-0.png               |
| expo           | https://docs.expo.dev/get-started/introduction/                       | 폭 가득 패널                | shots/dt-expo-1.png                 |
| astro          | https://docs.astro.build/en/getting-started/                          | 폭 가득 패널                | shots/dt-astro-2.png                |
| linear-docs    | https://linear.app/docs/start-guide                                   | 폭 가득 패널                | shots/dt-linear-docs-1.png          |
| terraform      | https://developer.hashicorp.com/terraform/intro                       | 막대 아래 카드 펼침         | shots/n-terraform-390-open.png      |
| bootstrap      | https://getbootstrap.com/docs/5.3/getting-started/introduction/       | 폭 가득 패널                | shots/n-bootstrap-390-open.png      |
| netlify        | https://docs.netlify.com/welcome/                                     | 폭 가득 패널                | shots/n-netlify-390-open.png        |
| railway        | https://docs.railway.com/overview/about-railway                       | 폭 가득 패널                | shots/n-railway-390-open.png        |
| resend         | https://resend.com/docs/introduction                                  | 왼쪽 서랍(막대 트리거)      | shots/n-resend-390-open.png         |
| clerk          | https://clerk.com/docs/quickstarts/nextjs                             | 폭 가득 패널                | shots/n-clerk-390-open.png          |
| neon           | https://neon.com/docs/introduction                                    | 폭 가득 패널                | shots/n-neon-390-open.png           |
| deno           | https://docs.deno.com/runtime/fundamentals/typescript/                | 폭 가득 패널                | shots/n-deno-390-open.png           |
| render         | https://render.com/docs                                               | 폭 가득 패널                | shots/n-render-390-open.png         |
| gitea          | https://docs.gitea.com/                                               | 폭 가득 패널                | shots/n-gitea-390-open.png          |
| vite           | https://vite.dev/guide/                                               | 왼쪽 서랍                   | shots/a6-vite-menu.png              |
| vitest         | https://vitest.dev/guide/                                             | 왼쪽 서랍                   | shots/a6-vitest-menu.png            |
| stackblitz     | https://developer.stackblitz.com/guides/user-guide/what-is-stackblitz | 왼쪽 서랍                   | shots/a6-stackblitz-menu.png        |
| mintlify       | https://mintlify.com/docs/quickstart                                  | 왼쪽 서랍                   | shots/a6-mintlify-menu.png          |
| docusaurus     | https://docusaurus.io/docs                                            | 왼쪽 서랍                   | shots/n-docusaurus-390-open.png     |
| playwright     | https://playwright.dev/docs/intro                                     | 왼쪽 서랍                   | shots/n-playwright-390-open.png     |
| convex         | https://docs.convex.dev/home                                          | 왼쪽 서랍                   | shots/n-convex-390-open.png         |
| zed            | https://zed.dev/docs/getting-started                                  | 왼쪽 서랍                   | shots/n-zed-390-open.png            |
| elixir-hexdocs | https://hexdocs.pm/phoenix/overview.html                              | 왼쪽 서랍                   | shots/n-elixir-hexdocs-390-open.png |
| anthropic      | https://docs.anthropic.com/en/docs/welcome                            | 왼쪽 서랍                   | shots/n-anthropic-390-open.png      |
| vercel-docs    | https://vercel.com/docs/projects                                      | 왼쪽 서랍                   | shots/n-vercel-docs-390-open.png    |
| vue            | https://vuejs.org/guide/essentials/application.html                   | 작은 창                     | shots/n-vue-390-open.png            |
| mui            | https://mui.com/material-ui/getting-started/                          | 왼쪽 서랍                   | shots/n-mui-390-open.png            |
| nuxt           | https://nuxt.com/docs/getting-started/introduction                    | 왼쪽에 붙은 창(막대 트리거) | shots/a6-nuxt-menu.png              |

실측 값: Vite 막대 48 · 서랍 320 · 줄 32/16px, Vitest 막대 48 · 서랍 320, StackBlitz 막대 48 · 서랍 308 · 줄 35/13px, Mintlify 막대 56 · 줄 36/16px(서랍 폭은 캡처상 330 안팎, 미측정), Docusaurus · Playwright · Convex 서랍 324 · 줄 32/16px · 바깥 rgba(0,0,0,.6), shadcn 패널 위 58 · React 패널 위 64.

### 도움말 센터 5곳(목록 쪽에서 들어가기, 설정 화면 자체는 로그인 뒤라 미확인)

| 서비스        | URL                               | 캡처                          |
| ------------- | --------------------------------- | ----------------------------- |
| steam-support | https://help.steampowered.com/en/ | shots/h-steam-support-390.png |
| slack-help    | https://slack.com/help            | shots/h-slack-help-390.png    |
| uber-help     | https://help.uber.com/riders      | shots/h-uber-help-390.png     |
| dropbox-help  | https://help.dropbox.com/         | shots/h-dropbox-help-390.png  |
| airbnb-help   | https://www.airbnb.com/help       | shots/h-airbnb-help-390.png   |

### 세지 않은 곳(39곳)

- 동의창이나 쿠키 창이 가림: twilio · mongodb · digitalocean
- 라이트로 나옴: posthog · flutter · stripe-docs · home-assistant · jest · tailscale · tailwind
- 404 쪽: discord-dev · planetscale · flyio
- 사이트 메뉴만 열려 문서 메뉴가 없음: mdn · nextjs · bun · hugo · msft-learn
- 열림 상태를 못 잡았거나 구분이 애매: huggingface · fastapi · rustbook · drizzle · obsidian · typescript · laravel · svelte · radix · remix · tanstack · mkdocs-material · gitlab · angular · cursor · shopify-dev · nodejs 등
- 접힘 줄만 확인(안 D 표본 6곳, 문서 메뉴 분류와 따로 셈): github-docs · cloudflare · docusaurus · bootstrap · tauri · gitea. github-docs · cloudflare · tauri 는 문서 메뉴를 못 봐 접힘 줄로만 셈. mintlify · resend 는 서랍을 여는 막대이고 prisma 는 쿠키 창이 가려 접힘 줄 표본에서 뺌
- 막대 트리거 7곳: vite · vitest · stackblitz · mintlify · resend · nuxt · terraform
- 도움말 센터 19곳은 라이트 · 캡차 · 열림 없음으로 세지 않음(netflix · apple · google · spotify · notion · mozilla · microsoft · github-support · zoom · figma · twitch · youtube · discord · shopify · stripe · vercel · cloudflare · atlassian · linear). 안 C 5곳 중 slack · uber · dropbox · airbnb 는 라이트로 나옴

### 디자인 시스템(문서에 값 · 규칙이 있는 곳 5곳)

- SEED: Bottom Sheet · Chip Tabs · Tabs · Side Panel 문서 있음, Side Navigation 은 폐기(Deprecated Blocks), 문서 메뉴 전용 부품 없음
- Material 3: Navigation drawer 비권장 → 확장 navigation rail
- Apple HIG: 사이드바는 가로 세로 공간이 많이 필요해 좁으면 탭 막대 같은 더 작은 컨트롤
- Atlassian: 768 미만 겹쳐 뜨는 사이드 내비 최대 폭 320px 또는 화면의 90%, 앱 막대 기본 높이 48
- Chakra UI: Drawer 가 mdDown 구간에서 배치를 바꾸는 예
- 열었지만 모바일 값 없음(미확인): Carbon · Fluent 2 · Ant Design · Primer · Mantine · Paste · GOV.UK · Polaris(비어 열림)

캡처: `shots/ds-*.png`, 문서 글 `ds-*.txt`.

## 6b 왼쪽 레일 화면(악곡 필터 · 서열표 구간 · 검정 급)

### 실제 서비스 32곳(열림 상태까지 캡처 확인, 다크 18 · 라이트로 나온 14는 꼴만 셈)

전체 화면은 위 띠 없이 헤더까지 덮고 위 모서리가 직각인 것, 시트는 위에 띠가 남고 위 모서리가 둥근 것, 서랍은 폭이 화면 일부이고 옆이 어둡게 남는 것으로 셌다.

#### 전체 화면 필터창(8)

| 서비스      | URL                                                                     | 색     | 캡처                              |
| ----------- | ----------------------------------------------------------------------- | ------ | --------------------------------- |
| hf-models   | https://huggingface.co/models                                           | 다크   | shots/f2-hf-models-390-open.png   |
| hf-datasets | https://huggingface.co/datasets                                         | 다크   | shots/f2-hf-datasets-390-open.png |
| kickstarter | https://www.kickstarter.com/discover/advanced?category_id=14&sort=magic | 라이트 | shots/f2-kickstarter-390-open.png |
| musescore   | https://musescore.com/sheetmusic?text=love                              | 라이트 | shots/f-musescore-390-open.png    |
| amazon      | https://www.amazon.com/s?k=headphones                                   | 라이트 | shots/f2-amazon-390-open.png      |
| 29cm        | https://search.29cm.co.kr/?keyword=%EC%9E%90%EC%BC%93                   | 라이트 | shots/f2-29cm-390-open.png        |
| metacritic  | https://www.metacritic.com/browse/game/                                 | 라이트 | shots/f-metacritic-390-open.png   |
| kaggle      | https://www.kaggle.com/datasets                                         | 라이트 | shots/f2-kaggle-390-open.png      |

#### 아래 시트(4, 위 띠가 남고 위 모서리가 둥긂. 에누리는 칩 줄과 시트를 함께 씀)

| 서비스            | URL                                        | 색     | 캡처                                   |
| ----------------- | ------------------------------------------ | ------ | -------------------------------------- |
| daangn-fleamarket | https://www.daangn.com/kr/search/buy-sell/ | 다크   | shots/f-daangn-fleamarket-390-open.png |
| musinsa           | https://www.musinsa.com/category/001       | 라이트 | shots/f-musinsa-390-open.png           |
| airbnb            | https://www.airbnb.com/s/Seoul/homes       | 라이트 | shots/f-airbnb-390-open.png            |
| dribbble          | https://dribbble.com/shots/popular         | 라이트 | shots/f-dribbble-390-open.png          |

#### 위 가로 칩 줄(7)

| 서비스         | URL                                                                  | 색     | 캡처                                 |
| -------------- | -------------------------------------------------------------------- | ------ | ------------------------------------ |
| enuri          | https://www.enuri.com/search.jsp?keyword=%EB%85%B8%ED%8A%B8%EB%B6%81 | 다크   | shots/f2-enuri-390-open.png          |
| daangn-jobs    | https://jobs.daangn.com/s?regionId=211                               | 다크   | shots/f-daangn-jobs-390.png          |
| bandsintown    | https://www.bandsintown.com/choose-dates/genre/all-genres            | 라이트 | shots/f2-bandsintown-390.png         |
| sketchfab      | https://sketchfab.com/search?q=car&type=models                       | 라이트 | shots/f2-sketchfab-390.png           |
| protondb       | https://www.protondb.com/explore                                     | 다크   | shots/f2-protondb-390.png            |
| tmdb           | https://www.themoviedb.org/movie                                     | 다크   | shots/f-tmdb-390.png                 |
| youtube-search | https://www.youtube.com/results?search_query=lofi                    | 다크   | shots/f2-youtube-search-390-open.png |

#### 목록 위 접힘 펼침(6, 접힘 줄이 보이는 곳 기준)

| 서비스    | URL                                                  | 색   | 캡처                           |
| --------- | ---------------------------------------------------- | ---- | ------------------------------ |
| steam     | https://store.steampowered.com/search/?category1=998 | 다크 | shots/f-steam-390-open.png     |
| beatsaver | https://beatsaver.com/search                         | 다크 | shots/f-beatsaver-390-open.png |
| setlistfm | https://www.setlist.fm/search?query=radiohead        | 다크 | shots/f2-setlistfm-390.png     |
| kitsu     | https://kitsu.app/anime                              | 다크 | shots/f2-kitsu-390.png         |
| giantbomb | https://www.giantbomb.com/games/                     | 다크 | shots/f2-giantbomb-390.png     |
| gumroad   | https://gumroad.com/discover?query=music             | 다크 | shots/f2-gumroad-390.png       |

#### 그 밖 서랍 · 드롭다운 · 탭(7)

| 서비스        | URL                                                                                          | 색     | 캡처                                |
| ------------- | -------------------------------------------------------------------------------------------- | ------ | ----------------------------------- |
| github-search | https://github.com/search?q=music&type=repositories                                          | 다크   | shots/f2-github-search-390-open.png |
| npm           | https://www.npmjs.com/search?q=react                                                         | 라이트 | shots/f2-npm-390-open.png           |
| crates        | https://crates.io/search?q=serde                                                             | 다크   | shots/f2-cratesio-390.png           |
| twitch-dir    | https://www.twitch.tv/directory/all                                                          | 다크   | shots/f2-twitch-dir-390.png         |
| mixcloud      | https://www.mixcloud.com/discover/electronic/                                                | 다크   | shots/f-mixcloud-390.png            |
| itch-games    | https://itch.io/games                                                                        | 라이트 | shots/f2-itch-games-390-open.png    |
| oliveyoung    | https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=%EC%84%A0%ED%81%AC%EB%A6%BC | 라이트 | shots/f2-oliveyoung-390-open.png    |

실측 값(당근 중고거래 필터, 390): 시트 위 64 · 높이 780 · 위 모서리 24 · 면 rgb(29,32,37) · 머리 70 · 제목 22px · 아래 68 · 버튼 높이 40(초기화 · 적용하기). 768 · 1024: 가운데 창 폭 480(안쪽 폭 432) · 모서리 24. 무신사 시트 y84 · 높이 760. Hugging Face 맨 아래 버튼 38. 에누리 시트: 아래에 「이 조건으로 보기」.

### 세지 않은 곳

캡차 · 접속 막힘: Bandcamp · Discogs · Epic · BGG · Letterboxd · IMDb · Last.fm · Etsy · eBay · ASOS · Target · B&H · Best Buy · IGDB · MobyGames · Printables · Product Hunt · Unsplash · Yelp · 네이버 쇼핑 · reddit · Zalando · Reverb · Musicbrainz 일부 등. 동의창이나 쿠키 창이 가림: GOG · Nexus Mods · HowLongToBeat · 멜론 · 벅스 · IKEA · Rotten Tomatoes · RAWG. 필터 UI 없음: Booking · Docker Hub. 필터를 못 찾음: OSU · Genius · Songkick · Trakt · AniList · Crunchyroll 등.

### 디자인 시스템 5곳

- SEED: Bottom Sheet · Chip Tabs(카테고리나 필터) · Chip · Action Sheet 문서 있음
- Apple HIG Sheets: large detent 기본, medium detent 를 더하면 두 높이에서 멈춤, 조절 가능한 시트에 grabber, 길고 여러 단계인 흐름은 전체 화면을 고려
- Material 3 Bottom sheets: 모달(scrim)과 표준이 같은 규격, 창 폭 640dp 넘으면 위 · 옆 여백 56dp, Side sheets 도 있음
- Carbon: Filtering 패턴(범주와 필터 항목 구조), Tabs 스크롤 버튼
- Chakra UI: Drawer 가 mdDown 구간에서 배치를 바꾸는 예
- 값 없음(미확인): Polaris(비어 열림) · Atlassian · Ant · Primer · Fluent
