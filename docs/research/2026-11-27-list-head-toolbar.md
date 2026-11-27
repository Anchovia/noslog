# 목록 머리 · 도구 줄 — 실제 서비스 30곳 · 디자인 시스템 7곳 (2026-11-27)

물음: 목록 쪽에서 제목 줄 → 탭 → 칩 → 결과 줄 → 목록 사이 세로 거리를 몇으로 두고, 결과 수 · 정렬 · 보기 전환 줄을 어떤 꼴로 두나(5단계 판 5-B). 같은 주제의 옛 기록이 없어 새 파일로 만들었다.

## 방법

- headless Chromium(Playwright), 다크 색 구성표, en-US, 폭 1920 × 1080, 로그아웃, 쪽 하나(목록 · 검색 결과). 5.5초 기다린 뒤 측정했고 아무것도 누르지 않았다.
- 서비스 약 140곳 후보를 열어 다크 색 구성표를 따르고 목록 머리가 보이는 곳 30곳을 셌다. 거리는 요소의 글자 · 입력칸 anchor 로 제목 · 첫 줄 · 마지막 조작 줄 · 첫 목록 항목 상자를 잡아 빈 세로 거리를 쟀고, 측정 상자를 캡처에 겹쳐 눈으로 확인한 값만 적었다. 못 잡았거나 확인하지 못한 칸은 「미확인」, 줄이 없는 칸은 「-」.
- 캡처는 `~/noslog-research/list-head-toolbar-2026-11-27/` 에 있다(측정 상자가 겹쳐 그려진 b- 캡처 포함).
- 「지금」 칸은 Figma 결정본 노드 읽기가 편집 권한 오류로 막혀 공통 층 사본 캡처(stage-base)로 대신했다.

## 서비스 30곳

거리 값이 있는 곳은 16곳이고 나머지 14곳은 꼴만 캡처로 분류했다. 한 서비스의 여러 쪽(GitHub 검색 · 이슈, Steam 스토어 · 워크숍, osu! 비트맵 · 랭킹)은 한 곳으로 센다. 확인 날짜는 모두 2026-11-27이다.

| 서비스 · 쪽                  | URL                                                       | 제목 → 첫 줄   | 줄 → 줄                       | 마지막 줄 → 목록       | 결과 수 자리                                | 도구 줄 꼴                                   | 캡처                     |
| ---------------------------- | --------------------------------------------------------- | -------------- | ----------------------------- | ---------------------- | ------------------------------------------- | -------------------------------------------- | ------------------------ |
| 치지직 전체 방송             | https://chzzk.naver.com/lives                             | 22             | 26                            | 31                     | 없음(분류 묶음마다 방송 수)                 | 맨 줄(태그 검색 왼쪽 · 정렬 글자 오른쪽)     | b-chzzk-lives.png        |
| crates.io 검색               | https://crates.io/search?q=rhythm                         | 36             | -                             | 18                     | 왼쪽(전체 중 1–10)                          | 맨 줄(수 왼쪽 · 정렬 오른쪽)                 | b-crates-search.png      |
| 당근 중고거래 검색           | https://www.daangn.com/kr/search/buy-sell/?q=keyboard     | 12             | -                             | 미확인                 | 제목 문장 안(검색 결과)                     | 칩 줄 한 줄(필터 · 지역 · 현재 위치)         | b-daangn-buy.png         |
| Docker Hub 검색              | https://hub.docker.com/search?q=nginx                     | -              | -                             | 미확인                 | 왼쪽(결과 수)                               | 맨 줄(수 왼쪽 · 정렬 오른쪽)                 | dockerhub.png            |
| Gitea 탐색                   | https://gitea.com/explore/repos                           | -              | 미확인                        | 미확인                 | 없음                                        | 맨 줄(검색 · 필터 · 정렬)                    | gitea-explore.png        |
| GitHub 검색 · 이슈           | https://github.com/search?q=rhythm+game&type=repositories | -              | -                             | 18(검색) · 14(이슈)    | 왼쪽(검색) · 면 띠 안(이슈 Open · Closed)   | 맨 줄(검색) · 면 띠(이슈)                    | b-github-search.png      |
| GitLab 프로젝트 탐색         | https://gitlab.com/explore/projects                       | 29             | 38                            | 미확인                 | 없음                                        | 맨 줄(검색 · 정렬)                           | b-gitlab-explore.png     |
| Hugging Face 모델 · 데이터셋 | https://huggingface.co/models                             | 제목과 같은 줄 | -                             | 25                     | 제목 옆                                     | 맨 줄(제목 · 수 · 필터 · 정렬이 한 줄)       | b-huggingface-models.png |
| Kick 둘러보기                | https://kick.com/browse                                   | 미확인         | 미확인                        | 미확인                 | 없음                                        | 맨 줄(필터 왼쪽 · 정렬 오른쪽)               | kick.png                 |
| MDN 검색                     | https://developer.mozilla.org/en-US/search?q=css          | -              | -                             | 미확인                 | 왼쪽 위 줄(Found n documents)               | 수만 있는 맨 줄                              | mdn-search.png           |
| Modrinth 모드                | https://modrinth.com/discover/mods                        | -              | 41 · 28                       | 20                     | 없음                                        | 맨 줄(정렬 · 보기 왼쪽 · 쪽 번호 오른쪽)     | b-modrinth.png           |
| osu! 비트맵 · 랭킹           | https://osu.ppy.sh/beatmapsets                            | 미확인         | 미확인                        | 미확인                 | 없음                                        | 면 상자 안 검색 · 필터(비트맵) · 맨 줄(랭킹) | osu-beatmaps.png         |
| RAWG 게임                    | https://rawg.io/games                                     | 미확인         | 미확인                        | 미확인                 | 없음                                        | 맨 줄(셀렉트 왼쪽 · 표시 옵션 오른쪽)        | rawg.png                 |
| Steam 검색 · 워크숍          | https://store.steampowered.com/search/?term=rhythm        | -              | 13(정렬 → 수) · 21(수 → 검색) | 5(스토어) · 19(워크숍) | 정렬 줄 아래 따로 줄(스토어) · 왼쪽(워크숍) | 맨 줄                                        | b-steam-search.png       |
| TMDB 영화                    | https://www.themoviedb.org/movie                          | 18             | 6                             | 미확인                 | 없음                                        | 칩 두 줄(왼쪽 필터 레일)                     | b-tmdb-movies.png        |
| Twitch 둘러보기              | https://www.twitch.tv/directory                           | 미확인         | 미확인                        | 미확인                 | 없음                                        | 맨 줄(태그 검색 왼쪽 · 정렬 오른쪽)          | twitch-directory.png     |
| Vercel 템플릿                | https://vercel.com/templates                              | 제목과 같은 줄 | -                             | 미확인                 | 없음                                        | 제목 줄 오른쪽 검색 · 필터                   | vercel-templates.png     |
| Game Jolt 게임               | https://gamejolt.com/games                                | -              | 15(탭 → 필터)                 | 31                     | 없음                                        | 면 띠(필터 줄)                               | b-gamejolt.png           |
| CoinMarketCap                | https://coinmarketcap.com/                                | 미확인         | 미확인                        | 미확인                 | 없음                                        | 맨 줄(필터 · 열 설정 오른쪽)                 | coinmarketcap.png        |
| MS Learn 검색                | https://learn.microsoft.com/en-us/search/?terms=css       | -              | 42(탭 → 수)                   | 24                     | 왼쪽(n results for)                         | 수만 있는 맨 줄                              | b-mslearn-search.png     |
| Newgrounds 게임              | https://www.newgrounds.com/games                          | 19             | 23                            | 20                     | 없음                                        | 면 상자 안(탭 · 필터 줄)                     | b-newgrounds.png         |
| 라프텔 태그 검색             | https://laftel.net/finder                                 | 47             | -                             | 27                     | 왼쪽(총 n개의 작품)                         | 맨 줄(수 왼쪽 · 정렬 오른쪽)                 | b-laftel.png             |
| Hex.pm 패키지                | https://hex.pm/packages?search=rhythm                     | 미확인         | 미확인                        | 미확인                 | 없음                                        | 왼쪽 필터 패널                               | hexpm.png                |
| Framer 템플릿                | https://www.framer.com/marketplace/templates/             | -              | -                             | 29                     | 없음                                        | 맨 줄(탭 왼쪽 · 필터 오른쪽)                 | b-framer-templates.png   |
| BeatLeader 맵                | https://beatleader.com/leaderboards                       | 미확인         | 미확인                        | 미확인                 | 없음                                        | 오른쪽 패널(정렬 · 필터)                     | beatleader.png           |
| JSR 패키지                   | https://jsr.io/packages                                   | -              | -                             | 15(제목 상자 → 첫 줄)  | 없음                                        | 도구 줄 없음                                 | b-jsr.png                |
| Bangumi 애니                 | https://bgm.tv/anime/browser                              | 미확인         | 미확인                        | 미확인                 | 없음                                        | 맨 줄(정렬 글자 줄)                          | bgm-tv.png               |
| Supabase 블로그              | https://supabase.com/blog                                 | -              | -                             | 37                     | 없음                                        | 맨 줄(칩 왼쪽 · 검색 · 보기 전환 오른쪽)     | b-supabase-blog.png      |
| Godot 에셋                   | https://godotengine.org/asset-library/asset               | 미확인         | 미확인                        | 미확인                 | 없음                                        | 왼쪽 필터                                    | godot-assets.png         |
| VNDB                         | https://vndb.org/v?q=rhythm                               | 미확인         | 미확인                        | 미확인                 | 면 상자 안(19 results)                      | 면 상자 안                                   | vndb.png                 |

## 칸마다 따로 잰 값(거리 값이 있는 16곳)

세 칸은 서로 다른 거리라 한 분포로 섞지 않는다. 한 서비스가 칸마다 하나씩 값을 가지므로 칸별 개수의 합은 서비스 수 16보다 크다. 안 근거로 센 것은 눈금 값과 정확히 같은 값뿐이다(13 · 14 · 15 같은 가까운 값은 세지 않는다).

| 칸                     | 서비스 · 정확한 값(px)                                                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 제목 → 첫 줄(7곳)      | 당근 12 · TMDB 18 · Newgrounds 19 · 치지직 22 · GitLab 29 · crates.io 36 · 라프텔 47                                                                                                                                      |
| 줄 → 줄(10값)          | TMDB 6 · Steam 스토어 13 · Game Jolt 15 · Steam 워크숍 21 · Newgrounds 23 · 치지직 26 · Modrinth 28 · GitLab 38 · Modrinth 41 · MS Learn 42                                                                               |
| 마지막 줄 → 목록(15곳) | Steam 스토어 5 · GitHub 이슈 14 · JSR 15 · crates.io 18 · GitHub 검색 18 · Steam 워크숍 19 · Modrinth 20 · Newgrounds 20 · MS Learn 24 · Hugging Face 25 · 라프텔 27 · Framer 29 · 치지직 31 · Game Jolt 31 · Supabase 37 |

- 눈금 값과 정확히 같은 곳: 12 = 당근 1곳, 16 = 0곳(쓰는 곳 없음), 20 = Modrinth · Newgrounds 2곳, 24 = MS Learn 1곳. 세 칸 모두 같은 값을 쓰는 서비스는 없다.
- 결과 수는 서비스 30곳 중 10곳(당근 · crates.io · Docker Hub · GitHub · Hugging Face · 라프텔 · Steam · MDN · MS Learn · VNDB)에 있고 20곳에는 없다. 10곳 중 당근은 제목 문장 안, 8곳은 면 없는 줄, VNDB 1곳은 면 상자 안이다.
- 수와 정렬이 같은 맨 줄: crates.io · Docker Hub · GitHub 검색 · 라프텔 · Steam 워크숍 · Hugging Face 6곳. 수 따로 두 줄은 Steam 스토어 1곳(그 줄은 면 띠 안)이고 MS Learn · MDN은 정렬 없이 수만 있는 줄이다. 면 띠를 쓰는 곳은 Game Jolt · Newgrounds · GitHub 이슈 · VNDB 4곳이다.

## 디자인 시스템 7곳(열어 본 곳)

| 디자인 시스템                | URL                                                                                            | 읽은 것                         | 값                                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 당근 SEED                    | https://seed-design.io/llms.txt                                                                | components · patterns llms 문서 | 목록 머리 · 도구 줄 · 결과 수 규격 없음(Chip · Tabs · Search Bar · Segmented Control · Table Pagination 부품만) |
| Carbon 데이터 표             | https://carbondesignsystem.com/components/data-table/usage/                                    | Usage · Style                   | 툴바는 표에 붙고 높이는 행 높이와 맞춘다(작은 툴바 ↔ 작은 행, 큰 툴바 ↔ 큰 행)                                  |
| PatternFly 툴바              | https://www.patternfly.org/components/toolbar/design-guidelines                                | Design guidelines               | 항목 · 묶음 사이 md 간격, 일괄 선택 맨 앞, 쪽 번호가 없으면 항목 수를 툴바 맨 끝                                |
| Material 3                   | https://m3.material.io/components/chips/specs · https://m3.material.io/components/search/specs | Chips · Search specs            | 칩 높이 32dp · 칩 사이 8dp, 검색 바 높이 56dp, 결과는 검색 바 아래 목록                                         |
| Atlassian 동적 표            | https://atlassian.design/components/dynamic-table/usage                                        | Usage                           | 정렬 · 쪽 번호는 표 안, 목록 머리 간격 규격 없음                                                                |
| Shopify Polaris IndexFilters | https://polaris-react.shopify.com/components/selection-and-input/index-filters                 | -                               | 본문이 스크립트로 그려져 읽지 못함, 미확인                                                                      |
| GitHub Primer 필터링 패턴    | https://primer.style/product/ui-patterns/filtering/                                            | -                               | 본문이 비어 읽지 못함, 미확인                                                                                   |

## 막혀서 세지 않은 곳

- 접근 거부 · 캡차 · 오류: Backloggd, Bandcamp, PyPI, Last.fm, Discogs, Letterboxd, npm, Stack Overflow, Product Hunt, Epic Games, Crunchyroll, Speedrun.com, Kitsu, ArtStation, MobyGames, GameFAQs, PCGamingWiki, IGDB, Nexus Mods, CurseForge, Lichess, Genius, Fandom, VGMdb, BoardGameGeek, HowLongToBeat, IMDb, Trakt, OP.GG, Reddit, CoinGecko, Deezer.
- 동의 팝업이 쪽을 덮음: MyAnimeList, Audiomack, SoundCloud, GOG, Kakao 웹툰, Songsterr.
- 밝은 화면으로만 찍힘: Airbnb, Aladin, AniList, Bugs, Booking, Coursera, Danawa, Daum, DCInside, Dribbble, Genie, Hacker News Algolia, IKEA, Inven, itch.io, Kaggle, Kyobo, Melon, MusicBrainz, 네이버 검색 · 뉴스 · 웹툰, Nike, Open Library, Packagist, Pixiv, Ruliweb, Wikipedia, YouTube, OpenCritic, Metacritic, Flo, VIBE, Roblox, TradingView, Docs.rs, Unity Asset Store, VS Code Marketplace, Snapcraft, dev.to.
- 목록 머리가 아니거나 제목이 없어 못 잼: Flathub, Sekai.best, Homebrew, Tailwind 블로그, Linear 변경 기록.

## 한계

- 서비스 곳 수는 다크 색 구성표를 따르는 곳만 센 탓에 공개 서비스 일부(국내 포털 · 쇼핑)가 빠졌다.
- 거리 값이 없는 14곳은 꼴만 분류했다.
- 당근 공개 웹은 중고거래 검색 한 쪽만 쟀다(제목 → 필터 칩 12).
- Figma 결정본 노드(1646:1040 · 1657:3190 · 1640:347)는 읽기가 막혀 직접 재지 못했다.
