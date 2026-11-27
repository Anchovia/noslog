# 한 열 그릇 폭 실측(홈 검색칸 · 글 상세 배너)

2026-11-27, 공통 층 5단계 판 3. 헤드리스 Playwright, colorScheme dark, 폭 1920 · 1440 · 1280 · 1100(높이 1080), 로그아웃. 캡처는 `~/noslog-research/one-column-width-2026-11-27/shots/` (홈 `h-<곳>-<폭>.png` · 글 `a-<곳>-<폭>.png`), 원자료 json 은 같은 폴더의 home.json · art.json · ds.json · ds2.json. 캡처 contact sheet 를 열어 상자 위치를 눈으로 확인한 곳만 세었다.

## 결과 요약

- 홈 맨 위 검색칸 16곳: 가운데 좁은 칸 12곳(540에서 750), 왼쪽 정렬 1곳(Docker Hub 입력 810에 AI 단추까지 878), 띠 · 줄 안 입력칸 2곳(Can I use 559 · BeatSaver 964에 검색 단추), 머리 줄 왼쪽 1곳(당근 600). 검색칸 자체가 그릇 가득인 곳은 0곳이다. 머리 막대 안 검색칸 21곳은 참고(Ultimate Guitar 500 포함, 나머지는 자동 판정 상자 폭).
- 대표 그림이 있는 글 상세 15곳: 그림이 본문과 같은 폭 9곳, 본문보다 1.5배 이상 넓음 4곳(Google 블로그 · Discord · Shopify Engineering · Xbox Wire, Discord 본문 870은 쿠키 띠에 가려 json 값이라 미확인), 본문보다 좁음 1곳(카카오 테크), 창 가득 1곳(PlayStation Blog). 그림 없는 9곳 본문 폭은 688에서 896(Smashing 은 본문 중간 그림 909 만 있어 여기에 둠). 960 배너는 Blizzard 시안(사용자 결정 없음) 1곳이 근거다.
- 디자인 시스템 12곳 중 폭 값이 있는 8곳. 검색칸 폭을 정한 곳은 Material 3 하나(최소 360dp 최대 720dp). 글 안 그림을 본문보다 넓게 두라는 규칙은 어디에도 없고, 긴 글은 좁은 그리드 하나(Atlassian 864)로 둔다는 규칙만 있다.
- 당근 SEED: 레이아웃 최대 폭 720 · 1040 · 1280(검색 결과), Search Bar 부품은 모바일 화면 맨 위 부품이고 폭 규격 없음. 당근 웹 홈 검색칸 상자 600(1920 · 1440), 1280 이하 509.

## 홈 검색칸: 맨 위 가운데 또는 한 줄(1920 / 1440 / 1280 / 1100)

값은 보이는 둥근 칸 기준이다. Can I use · BeatSaver · PyPI 는 입력칸 폭(inputW), Ultimate Guitar · Docker Hub · crates.io 는 1920 캡처에서 잰 값(다른 폭 「-」), 나머지는 자동 판정 상자 폭을 캡처로 확인했다.

| 곳               | 주소                       | 상자 폭               |
| ---------------- | -------------------------- | --------------------- |
| google           | https://www.google.com/    | 584 / 584 / 584 / 584 |
| brave            | https://search.brave.com/  | 676 / 676 / 676 / 676 |
| wikipedia-portal | https://www.wikipedia.org/ | 540 / 540 / 540 / 540 |
| crates           | https://crates.io/         | 610 / - / - / -       |
| pypi             | https://pypi.org/          | 610 / 610 / 610 / 610 |
| rubygems         | https://rubygems.org/      | 672 / 672 / 672 / 672 |
| packagist        | https://packagist.org/     | 680 / 680 / 680 / 680 |
| nuget            | https://www.nuget.org/     | 750 / 750 / 750 / 617 |
| gopkg            | https://pkg.go.dev/        | 721 / 721 / 721 / 721 |
| setlistfm        | https://www.setlist.fm/    | 750 / 750 / 750 / 630 |
| naver            | https://www.naver.com/     | 708 / 708 / 708 / 708 |
| daum             | https://www.daum.net/      | 600 / 600 / 600 / 600 |
| docker           | https://hub.docker.com/    | 810 / - / - / -       |
| caniuse          | https://caniuse.com/       | 559 / 538 / 478 / 410 |
| beatsaver        | https://beatsaver.com/     | 966 / 966 / 831 / 696 |
| daangn           | https://www.daangn.com/kr/ | 600 / 600 / 509 / 509 |

## 홈 검색칸: 머리 막대 안(참고)

| 곳             | 주소                                                                                  | 상자 폭                |
| -------------- | ------------------------------------------------------------------------------------- | ---------------------- |
| youtube        | https://www.youtube.com/                                                              | 640 / 640 / 640 / 582  |
| steam          | https://store.steampowered.com/                                                       | 480 / 480 / 480 / 389  |
| gog            | https://www.gog.com/en/                                                               | 348 / 348 / 348 /      |
| twitch         | https://www.twitch.tv/                                                                | 356 / 356 / 356 / 356  |
| itch           | https://itch.io/                                                                      | 500 / 415 / 286 / 240  |
| bunjang        | https://m.bunjang.co.kr/                                                              | 500 / 500 / 500 / 500  |
| melon          | https://www.melon.com/                                                                | 300 / 300 / 300 / 300  |
| genie          | https://www.genie.co.kr/                                                              | 366 / 366 / 366 / 366  |
| aladin         | https://www.aladin.co.kr/home/welcome.aspx                                            | 580 / 580 / 580 / 580  |
| yes24          | https://www.yes24.com/Main/default.aspx                                               | 520 / 520 / 520 / 520  |
| amazon         | https://www.amazon.com/                                                               | 1179 / 739 / 587 / 407 |
| wikipedia-en   | https://en.wikipedia.org/wiki/Main_Page                                               | 1042 / 954 / 794 / 602 |
| wikipedia-ko   | https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8 | 1095 / 967 / 807 / 615 |
| ultimateguitar | https://www.ultimate-guitar.com/                                                      | 500 / - / - / -        |
| hexpm          | https://hex.pm/                                                                       | 420 / 420 / 420 / 416  |
| bandcamp       | https://bandcamp.com/                                                                 | 312 / 312 / 312 / 312  |
| namu           | https://namu.wiki/w/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4:%EB%8C%80%EB%AC%B8           | 272 / 272 / 272 / 272  |
| airbnb         | https://www.airbnb.com/                                                               | 214 / 214 / 214 / 214  |
| bugs           | https://music.bugs.co.kr/                                                             | 402 / 402 / 402 / 402  |
| songsterr      | https://www.songsterr.com/                                                            | 769 / 769 / 769 / 769  |
| vndb           | https://vndb.org/                                                                     | 158 / 158 / 158 / 158  |
| duckduckgo     | https://duckduckgo.com/                                                               | 694 / 694 / 643 / 535  |

## 글 상세: 대표 그림이 있는 곳(본문 폭, 그림 폭)

| 곳               | 주소                                                                                                                                                                | 본문 1920 | 그림 1920 | 1440 본문 / 그림 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | ---------------- |
| google-blog      | https://blog.google/innovation-and-ai/technology/ai/google-ai-updates-october-2026/                                                                                 | 636       | 1392      | 636 / 1392       |
| cloudflare-blog  | https://blog.cloudflare.com/search-for-agents/                                                                                                                      | 715       | 713       | 715 / 713        |
| discord-blog     | https://discord.com/blog/introducing-auto-clips                                                                                                                     | 870       | 1316      | 870 / 1200       |
| notion-blog      | https://www.notion.com/blog/research-on-the-shape-of-context-at-work                                                                                                | 700       | 700       | 700 / 700        |
| stripe-blog      | https://stripe.com/blog/custom-software-specialized-workflows-and-other-new-growth-paths-from-saas-platform-summit                                                  | 810       | 808       | 810 / 808        |
| shopify-eng      | https://shopify.engineering/secure-agentic-apps                                                                                                                     | 686       | 1420      | 606 / 1080       |
| tailwind-blog    | https://tailwindcss.com/blog/tailwind-is-joining-shopify                                                                                                            | 768       | 768       | 768 / 768        |
| svelte-blog      | https://svelte.dev/blog/ten-years-of-svelte                                                                                                                         | 760       | 760       | 760 / 760        |
| xbox-wire        | https://news.xbox.com/en-us/2026/11/23/grand-theft-auto-vi-xbox-cloud-and-remote-play/                                                                              | 676       | 1456      | 690 / 1310       |
| lostark-news     | https://www.playlostark.com/en-us/news/articles/echoes-of-thunder-release-notes                                                                                     | 700       | 740       | 700 / 740        |
| genshin-news     | https://genshin.hoyoverse.com/en/news/detail/167342                                                                                                                 | 720       | 720       | 720 / 720        |
| ffxiv-lodestone  | https://na.finalfantasyxiv.com/lodestone/topics/detail/07320affa7e0fcd9685afcbe54fbf55405b6d822/?utm_source=lodestone&utm_medium=pc_header&utm_campaign=na_7_5patch | 560       | 560       | 560 / 560        |
| kakao-tech       | https://tech.kakao.com/posts/850                                                                                                                                    | 768       | 688       | 768 / 688        |
| toss-tech        | https://toss.tech/article/bankbook_graphic                                                                                                                          | 700       | 700       | 700 / 700        |
| playstation-blog | https://blog.playstation.com/2026/11/25/playstation-plus-monthly-games-for-december-tony-hawks-pro-skater-34-dragon-ball-xenoverse-2-amnesia-the-bunker/            | 936       | 1920      | 920 / 1016       |

## 글 상세: 그림이 없는 곳(본문 폭)

| 곳          | 주소                                                                         | 본문 1920 | 그림      | 1440 본문 / 그림 |
| ----------- | ---------------------------------------------------------------------------- | --------- | --------- | ---------------- |
| smashing    | https://www.smashingmagazine.com/2026/11/online-smashingconf-ai-2027/        | 763       | 909       | 700 / 798        |
| vercel-blog | https://vercel.com/blog/introducing-audited-zdr-on-ai-gateway                | 688       | 그림 없음 | 684 / -          |
| nextjs-blog | https://nextjs.org/blog/how-were-using-ai-to-make-nextjs-more-secure         | 688       | 그림 없음 | 684 / -          |
| gog-news    | https://www.gog.com/en/news/release_awaken_astral_blade                      | 775       | 그림 없음 | 775 / -          |
| react-blog  | https://react.dev/blog/2026/09/09/react-19-3                                 | 896       | 그림 없음 | 896 / -          |
| vue-blog    | https://blog.vuejs.org/posts/vue-3-5                                         | 758       | 그림 없음 | 758 / -          |
| rust-blog   | https://blog.rust-lang.org/2026/11/16/enabling-parallel-frontend-on-nightly/ | 744       | 그림 없음 | 744 / -          |
| mdn-blog    | https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/         | 768       | 그림 없음 | 768 / -          |
| web-dev     | https://developer.chrome.com/blog/modern-web-guidance-v1                     | 854       | 그림 없음 | 854 / -          |

본문 폭은 90자 넘는 문단 중 가장 많이 나온 폭이다. 기존 기록 인용: Blizzard 뉴스 배너 960 · 본문 768(`2026-11-02-desktop-community.md`, 사용자 선택 시안), setlist.fm 검색 742 · Packagist 검색 680에 틀 1280(`2026-11-02-desktop-home-news.md`).

## 디자인 시스템

| 디자인 시스템       | 문서에 있는 값                                | 검색칸 폭             | 그림 폭   |
| ------------------- | --------------------------------------------- | --------------------- | --------- |
| 당근 SEED           | 레이아웃 최대 폭 720 · 1040 · 1280(검색 결과) | 규격 없음             | 규칙 없음 |
| Material 3          | 레이아웃 문서 404(미확인)                     | 최소 360dp 최대 720dp | 미확인    |
| Carbon              | 2x 그리드 최대 1584                           | 규격 없음             | 규칙 없음 |
| Atlassian           | 고정 넓음 1296 · 고정 좁음 864                | 규칙 없음             | 규칙 없음 |
| Bootstrap           | 540 · 720 · 960 · 1140 · 1320                 | 규칙 없음             | 규칙 없음 |
| Radix Themes        | 448 · 688 · 880 · 1136                        | 규칙 없음             | 규칙 없음 |
| GOV.UK              | 1020                                          | 규칙 없음             | 규칙 없음 |
| Chakra UI           | 1440                                          | 규칙 없음             | 규칙 없음 |
| Primer · Ant Design | 폭 px 값 없음(중단점만)                       | 규칙 없음             | 규칙 없음 |
| Mantine · Polaris   | 미확인(목록을 읽지 못함)                      | 미확인                | 미확인    |

## 막힌 곳 · 못 찾은 곳(세지 않음)

- 동의 팝업이 화면을 덮어 세지 않음: SoundCloud.
- 밝은 화면으로 찍힘(요청은 dark, 사이트가 따르지 않음): Google · PyPI · Packagist · 네이버 · YouTube · 번개장터 · 지니 · 벅스 · 멜론 · 알라딘 · 예스24 · Amazon · Wikipedia 영어와 한국어 · Airbnb · itch.io, 글 Google 블로그 · Notion · Stripe · Xbox Wire · 카카오 테크 · Chrome 개발자 블로그.
- 막힘(확인 화면 · 접근 거부): npm, Stack Overflow, Discogs, Genius, U.GG, Letterboxd, Fandom, Etsy, 쿠팡, 인프런, IMDb, OP.GG, OpenAI 소식, Fortnite 소식, Netflix Tech Blog, 우아한형제들 기술블로그, Minecraft 소식(연결 오류), 스포티파이 · 블리자드 · Pitchfork · 당근 소식(글 링크를 못 찾음).
- 검색칸을 못 찾았거나 판정하지 않음(미확인): GitHub, MDN 홈, Last.fm, Blitz, osu!, ScoreSaber, BeatLeader, Kamaitachi, BEMANIWiki, Hacker News, Internet Archive, Open Library, Hugging Face, 무신사, Vercel Docs, Tailwind Docs, Goodreads.
- 글 상세 중 목록 쪽으로 넘어가 글이 아닌 곳(세지 않음): GitHub 블로그, Mozilla, Figma, Linear, Anthropic, 라인, Bandcamp Daily, 롤, 발로란트, 토스 외 일부.
