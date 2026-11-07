# 데스크톱 악곡 목록 · 채보 뷰어 뼈대 실측

두 페이지의 대응 화면을 headless Playwright(폭 1440, 로그아웃)로 잰 기록이다. 확인 날짜는 모두 2026-11-02. 캡처는 `~/noslog-research/desktop-music/` 아래 `묶음/곳.jpg` 다.

「잰 값」 은 스크립트로 모은 글자 · 그림 상자의 좌우 끝과 aside · 표 · 미디어 크기이며 머리 · 고정 요소가 섞일 수 있다. 「눈으로 본 뼈대」 칸은 캡처를 직접 열어 적었고 이 칸이 정본이다. 「막힘」 은 캡차 · 로그인 벽 · 팝업 · 없는 쪽 · 지역 차단이라 세지 않는다.

줄 높이 실측(DOM): 멜론 85 · 벅스 71 · 스팀 72(사이 5) · 허깅페이스 62 · 오픈크리틱 95. Ultimate Guitar 41 · 캡처에서 쟀다. GOG 는 목록 · 격자 전환 단추가 결과 위 오른쪽에 있고 목록 줄 146 · 격자 3열이다(list/gog-grid.jpg · list/gog-list.jpg, 쿠키 창이 오른쪽 아래를 일부 가림). Amazon 1920 은 오류 쪽이 떠서 재지 못했다.

## 악곡 목록

표본 90건 · 세는 곳 53건

| 곳              | URL                                                                                                 | 잰 값                                                     | 눈으로 본 뼈대                           | 캡처                     |
| --------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------- | ------------------------ |
| osu             | https://osu.ppy.sh/beatmapsets                                                                      | 내용 240–1200                                             | 위 검색 · 2열 카드                       | list/osu.jpg             |
| beatsaver       | https://beatsaver.com/                                                                              | 내용 97–1353                                              | 위 필터 줄 · 2열 카드                    | list/beatsaver.jpg       |
| arcadesongs     | https://arcade-songs.zetaraku.dev/maimai/                                                           | 내용 332–1108                                             | 위 필터 판 · 표                          | list/arcadesongs.jpg     |
| spotify         | https://open.spotify.com/search/piano                                                               | 내용 23–1368 · aside 8+1424,1400+331 · 표 폭 593 · 열 1   | 왼쪽 앱 메뉴 · 결과 묶음                 | list/spotify.jpg         |
| applemusic      | https://music.apple.com/us/search?term=piano                                                        | 내용 20–1415                                              | 왼쪽 앱 메뉴 · 결과 묶음                 | list/applemusic.jpg      |
| ytmusic         | https://music.youtube.com/search?q=piano                                                            | 내용 80–1360                                              | 막힘 · 세지 않음                         | list/ytmusic.jpg         |
| bandcamp        | https://bandcamp.com/discover                                                                       | 내용 32–1424                                              | 막힘 · 세지 않음                         | list/bandcamp.jpg        |
| soundcloud      | https://soundcloud.com/search/sounds?q=piano                                                        |                                                           | 막힘 · 세지 않음                         | list/soundcloud.jpg      |
| discogs         | https://www.discogs.com/search/?q=piano&type=release                                                | 내용 272–1168                                             | 막힘 · 세지 않음                         | list/discogs.jpg         |
| musicbrainz     | https://musicbrainz.org/search?query=piano&type=release&method=indexed                              | 내용 16–1408 · 표 폭 1392 · 열 11                         | 필터 없음 · 전폭 표                      | list/musicbrainz.jpg     |
| lastfm          | https://www.last.fm/charts                                                                          | 내용 125–1305 · 표 폭 370 · 열 5 · 미디어 970×250         | 필터 없음 · 2열 순위                     | list/lastfm.jpg          |
| genius          | https://genius.com/search?q=piano                                                                   | 내용 370–1070                                             | 막힘 · 세지 않음                         | list/genius.jpg          |
| billboard       | https://www.billboard.com/charts/hot-100/                                                           | 내용 140–1430 · 미디어 400×225                            | 막힘 · 세지 않음                         | list/billboard.jpg       |
| melon           | https://www.melon.com/chart/index.htm                                                               | 내용 216–1224 · 표 폭 1008 · 열 12                        | 필터 없음 · 표 줄 85 · 폭 1008           | list/melon.jpg           |
| bugs            | https://music.bugs.co.kr/chart                                                                      | 내용 0–1436 · aside 498+298,1208+192 · 표 폭 1140 · 열 12 | 왼쪽 메뉴 · 표 줄 71                     | list/bugs.jpg            |
| genie           | https://www.genie.co.kr/chart/top200                                                                | 내용 250–1189 · 표 폭 710 · 열 11                         | 오른쪽 정보 · 표                         | list/genie.jpg           |
| aoty            | https://www.albumoftheyear.org/releases/                                                            | 내용 272–1168                                             | 막힘 · 세지 않음                         | list/aoty.jpg            |
| steam           | https://store.steampowered.com/search/?term=rhythm                                                  | 내용 120–1320                                             | 오른쪽 필터 310 · 면 줄 72 · 사이 5      | list/steam.jpg           |
| gog             | https://www.gog.com/en/games                                                                        | 내용 172–1268                                             | 왼쪽 필터 · 3열 격자                     | list/gog.jpg             |
| epic            | https://store.epicgames.com/en-US/browse                                                            | 내용 576–864                                              | 막힘 · 세지 않음                         | list/epic.jpg            |
| itch            | https://itch.io/games/tag-rhythm                                                                    | 내용 11–1420                                              | 왼쪽 필터 · 4열 격자                     | list/itch.jpg            |
| metacritic      | https://www.metacritic.com/browse/game/                                                             | 내용 72–1368 · aside 72+321 · 미디어 970×250              | 왼쪽 필터 · 면 줄                        | list/metacritic.jpg      |
| igdb            | https://www.igdb.com/games/recently_released                                                        | 내용 272–1168                                             | 막힘 · 세지 않음                         | list/igdb.jpg            |
| imdbsearch      | https://www.imdb.com/search/title/?title_type=feature                                               | 내용 560–880                                              | 막힘 · 세지 않음                         | list/imdbsearch.jpg      |
| imdbtop         | https://www.imdb.com/chart/top/                                                                     | 내용 560–880                                              | 막힘 · 세지 않음                         | list/imdbtop.jpg         |
| letterboxd      | https://letterboxd.com/films/popular/                                                               | 내용 245–1195                                             | 막힘 · 세지 않음                         | list/letterboxd.jpg      |
| tmdb            | https://www.themoviedb.org/movie                                                                    | 내용 60–1371                                              | 왼쪽 필터 · 5열 격자                     | list/tmdb.jpg            |
| rottentomatoes  | https://www.rottentomatoes.com/browse/movies_in_theaters/                                           | 내용 32–1260 · aside 910+345                              | 막힘 · 세지 않음                         | list/rottentomatoes.jpg  |
| justwatch       | https://www.justwatch.com/us/movies                                                                 | 내용 64–1434                                              | 위 칩 · 전폭 격자                        | list/justwatch.jpg       |
| trakt           | https://trakt.tv/movies/trending                                                                    | 내용 48–1433 · 미디어 1440×900                            | 막힘 · 세지 않음                         | list/trakt.jpg           |
| mal             | https://myanimelist.net/topanime.php                                                                | 내용 201–1239 · 표 폭 1038 · 열 5                         | 막힘 · 세지 않음                         | list/mal.jpg             |
| anilist         | https://anilist.co/search/anime                                                                     | 내용 180–1260                                             | 위 필터 줄 · 5열 격자                    | list/anilist.jpg         |
| goodreads       | https://www.goodreads.com/list/show/1.Best_Books_Ever                                               | 내용 248–1191 · 표 폭 625 · 열 4 · 미디어 970×250         | 오른쪽 광고 · 줄                         | list/goodreads.jpg       |
| amazon          | https://www.amazon.com/s?k=digital+piano                                                            | 내용 0–1424 · 미디어 561×315                              | 왼쪽 필터 · 4열 격자                     | list/amazon.jpg          |
| ebay            | https://www.ebay.com/sch/i.html?_nkw=digital+piano                                                  | 내용 20–1420                                              | 막힘 · 세지 않음                         | list/ebay.jpg            |
| bestbuy         | https://www.bestbuy.com/site/searchpage.jsp?st=digital+piano                                        | 내용 441–999                                              | 막힘 · 세지 않음                         | list/bestbuy.jpg         |
| airbnb          | https://www.airbnb.com/s/Seoul/homes                                                                | 내용 48–1386 · 미디어 658×684                             | 위 필터 · 격자 + 지도                    | list/airbnb.jpg          |
| booking         | https://www.booking.com/searchresults.html?ss=Seoul                                                 | 내용 173–1222 · 표 폭 281 · 열 7                          | 막힘 · 세지 않음                         | list/booking.jpg         |
| linkedinjobs    | https://www.linkedin.com/jobs/search?keywords=designer&location=Seoul                               | 내용 240–1200                                             | 막힘 · 세지 않음                         | list/linkedinjobs.jpg    |
| githubtrending  | https://github.com/trending                                                                         | 내용 230–1210                                             | 위 필터 · 선 줄                          | list/githubtrending.jpg  |
| npm             | https://www.npmjs.com/search?q=piano                                                                | 내용 272–1168                                             | 막힘 · 세지 않음                         | list/npm.jpg             |
| pypi            | https://pypi.org/search/?q=piano                                                                    | 내용 493–948                                              | 막힘 · 세지 않음                         | list/pypi.jpg            |
| huggingface     | https://huggingface.co/models                                                                       | 내용 96–1343                                              | 왼쪽 필터 · 선 줄 62                     | list/huggingface.jpg     |
| dockerhub       | https://hub.docker.com/search?q=nginx                                                               | 내용 64–1399                                              | 왼쪽 필터 · 3열 카드                     | list/dockerhub.jpg       |
| producthunt     | https://www.producthunt.com/categories/music                                                        | 내용 272–1168                                             | 막힘 · 세지 않음                         | list/producthunt.jpg     |
| unsplash        | https://unsplash.com/s/photos/piano                                                                 | 내용 420–1020                                             | 막힘 · 세지 않음                         | list/unsplash.jpg        |
| coursera        | https://www.coursera.org/search?query=music                                                         | 내용 26–1414                                              | 위 칩 · 4열 격자                         | list/coursera.jpg        |
| edx             | https://www.edx.org/search?q=music                                                                  | 내용 96–1344                                              | 위 칩 · 4열 격자                         | list/edx.jpg             |
| nike            | https://www.nike.com/w/mens-shoes-nik1zy7ok                                                         | 내용 48–1384                                              | 막힘 · 세지 않음                         | list/nike.jpg            |
| uniqlo          | https://www.uniqlo.com/us/en/men/tops                                                               | 내용 8–1432                                               | 막힘 · 세지 않음                         | list/uniqlo.jpg          |
| ikea            | https://www.ikea.com/us/en/cat/sofas-fu003/                                                         | 내용 28–1392 · aside 0+1440                               | 위 칩 · 3열 격자                         | list/ikea.jpg            |
| sweetwater      | https://www.sweetwater.com/c590--Digital_Pianos                                                     |                                                           | 막힘 · 세지 않음                         | list/sweetwater.jpg      |
| musescore       | https://musescore.com/sheetmusic                                                                    | 내용 264–1176                                             | 막힘 · 세지 않음                         | list/musescore.jpg       |
| ultimateguitar  | https://www.ultimate-guitar.com/explore                                                             | 내용 30–919 · 미디어 970×250                              | 왼쪽 필터 레일(화면 끝) · 표 · 선 줄 41  | list/ultimateguitar.jpg  |
| songsterr       | https://www.songsterr.com/                                                                          | 내용 118–948 · aside 90+1260,1065+360                     | 겹친 검색 목록                           | list/songsterr.jpg       |
| bgg             | https://boardgamegeek.com/browse/boardgame                                                          | 내용 272–1168                                             | 막힘 · 세지 않음                         | list/bgg.jpg             |
| musinsa         | https://www.musinsa.com/category/001                                                                | 내용 0–1440                                               | 위 분류 · 6열 격자                       | list/musinsa.jpg         |
| opgg            | https://op.gg/lol/champions                                                                         | 내용 180–1440 · aside 180+332 · 표 폭 740 · 열 8          | 위 필터 · 표                             | list/opgg.jpg            |
| googlefonts     | https://fonts.google.com/                                                                           | 내용 8–1268                                               | 왼쪽 필터 · 선 줄                        | list/googlefonts.jpg     |
| figmacommunity  | https://www.figma.com/community/ui-kits                                                             | 내용 112–1368                                             | 위 칩 · 4열 격자                         | list/figmacommunity.jpg  |
| notiontemplates | https://www.notion.com/templates                                                                    | 내용 86–1353 · aside 463+30,887+37,1317+37                | 위 메뉴 · 묶음                           | list/notiontemplates.jpg |
| shopifyapps     | https://apps.shopify.com/browse/all                                                                 | 내용 64–1357                                              | 위 메뉴 · 묶음                           | list/shopifyapps.jpg     |
| vsmarket        | https://marketplace.visualstudio.com/search?target=VSCode&category=All%20categories&sortBy=Installs | 내용 140–1300 · 표 폭 505 · 열 3                          | 위 필터 · 6열 격자                       | list/vsmarket.jpg        |
| chromewebstore  | https://chromewebstore.google.com/category/extensions                                               | 내용 34–1384                                              | 왼쪽 분류 · 격자                         | list/chromewebstore.jpg  |
| yes24           | https://www.yes24.com/product/category/bestseller?categoryNumber=001                                | 내용 120–1320                                             | 왼쪽 분류 · 줄                           | list/yes24.jpg           |
| kyobo           | https://product.kyobobook.co.kr/bestseller/online                                                   | 내용 120–1320                                             | 왼쪽 분류 · 줄                           | list/kyobo.jpg           |
| playstation     | https://store.playstation.com/en-us/category/05a2d027-cedc-4ac0-abeb-8fc26fec7180/1                 | 내용 80–1360                                              | 필터 버튼 · 6열 격자                     | list/playstation.jpg     |
| nintendo        | https://www.nintendo.com/us/store/games/                                                            | 내용 80–1404                                              | 막힘 · 세지 않음                         | list/nintendo.jpg        |
| xbox            | https://www.xbox.com/en-US/games/browse                                                             | 내용 153–1370                                             | 왼쪽 필터 · 4열 격자                     | list/xbox.jpg            |
| wikipedialist   | https://en.wikipedia.org/wiki/List_of_best-selling_music_artists                                    | 내용 48–1380 · 표 폭 912 · 열 7                           | 문서 3열 · 표                            | list/wikipedialist.jpg   |
| beatport        | https://www.beatport.com/genre/techno-peak-time-driving/6/top-100                                   | 내용 32–1165                                              | 왼쪽 메뉴 · 표(쿠키 띠가 아래 일부 가림) | list/beatport.jpg        |
| rawg            | https://rawg.io/games                                                                               | 내용 10–1400 · aside 40+200 · 미디어 267×150              | 왼쪽 메뉴 · 위 셀렉트 · 4열 격자         | list/rawg.jpg            |
| backloggd       | https://backloggd.com/games/lib/popular/                                                            | 내용 170–1420                                             | 위 정렬 · 6열 격자                       | list/backloggd.jpg       |
| modrinth        | https://modrinth.com/mods                                                                           | 내용 104–1336 · aside 104+300                             | 왼쪽 필터 · 면 줄                        | list/modrinth.jpg        |
| mangadex        | https://mangadex.org/titles                                                                         | 내용 584–856                                              | 막힘 · 세지 않음                         | list/mangadex.jpg        |
| openlibrary     | https://openlibrary.org/search?q=piano                                                              | 내용 211–1242 · aside 827+202                             | 오른쪽 필터 · 줄                         | list/openlibrary.jpg     |
| archivesearch   | https://archive.org/search?query=piano                                                              |                                                           | 막힘 · 세지 않음                         | list/archivesearch.jpg   |
| steamcharts     | https://steamcharts.com/top                                                                         | 내용 370–1070 · 표 폭 700 · 열 6 · 미디어 300×600         | 필터 없음 · 표                           | list/steamcharts.jpg     |
| aladin          | https://www.aladin.co.kr/shop/common/wbest.aspx?BranchType=1                                        | 내용 205–1386 · 표 폭 930 · 열 1                          | 왼쪽 분류 · 줄                           | list/aladin.jpg          |
| ridibooks       | https://ridibooks.com/bestsellers/general                                                           | 내용 165–1275                                             | 위 탭 · 줄                               | list/ridibooks.jpg       |
| hm              | https://www2.hm.com/en_us/men/products/view-all.html                                                | 내용 8–1432                                               | 막힘 · 세지 않음                         | list/hm.jpg              |
| target          | https://www.target.com/s?searchTerm=digital+piano                                                   | 내용 20–1420 · 미디어 300×250                             | 막힘 · 세지 않음                         | list/target.jpg          |
| crunchyroll     | https://www.crunchyroll.com/videos/popular                                                          | 내용 32–688                                               | 막힘 · 세지 않음                         | list/crunchyroll.jpg     |
| deezer          | https://www.deezer.com/en/search/piano                                                              | 내용 160–1280                                             | 막힘 · 세지 않음                         | list/deezer.jpg          |
| jetbrains       | https://plugins.jetbrains.com/search?orderBy=downloads&products=idea                                | 내용 104–1335                                             | 막힘 · 세지 않음                         | list/jetbrains.jpg       |
| wordpress       | https://wordpress.org/plugins/browse/popular/                                                       | 내용 140–1300                                             | 위 탭 · 2열 카드                         | list/wordpress.jpg       |
| cratesio        | https://crates.io/search?q=piano                                                                    | 내용 258–1182                                             | 위 정렬 · 면 줄                          | list/cratesio.jpg        |
| opencritic      | https://opencritic.com/browse/all                                                                   | 내용 250–615                                              | 위 셀렉트 · 표 줄 95                     | list/opencritic.jpg      |
| webtoon         | https://comic.naver.com/webtoon                                                                     | 내용 125–1410 · aside -340+2120 · 미디어 300×250          | 위 탭 · 격자                             | list/webtoon.jpg         |
| basketballref   | https://www.basketball-reference.com/players/j/                                                     | 내용 14–1426 · 표 폭 794 · 열 8                           | 막힘 · 세지 않음                         | list/basketballref.jpg   |

### 악곡 목록 결정

2026-11-02 사용자 선택이고 구현 전이다. 왼쪽 필터 + 보기 전환(GOG · Amazon) · 표준 폭 1152(내비와 좌우 맞춤) · 레일 274 · 결과 862 · 목록 보기 Steam 면 줄 72 · 사이 5 · 격자 4열(칸 203.5) · 촘촘 5열(칸 159.6) · 쪽 제목은 지금대로다. 처음 고른 결과 1122 는 같은 날 표준 폭으로 바꿨고, 그 폭의 사진과 CSS 는 `real/1412/` · `css/f1412.css` 에 남겼다.

근거 캡처와 지금 화면은 `~/noslog-research/desktop-music/decided/list/` 에 모았다. 고른 안을 그린 옛 시안 그림과 그 CSS 는 맡았던 세션이 삭제돼 찾지 못했다. 2026-11-02 사용자 지시로 남은 값만으로 다시 찍었다. 사진은 같은 폴더 `real/f-*.jpg`(폭 1440 · 1056 · 1920), CSS 는 `css/f.css`, 스크립트는 `tools/shot.mjs` 다. 지금 화면에서 잰 값은 레일 274 · 결과 1122 · 줄 72 · 사이 5 · 격자 칸 268.5 · 촘촘 칸 211.6 이고, 레일 사이 16 · 왼쪽 시작 14 는 근거 없이 지금 값과 남는 값을 쓴 것이다. 시안 https://claude.ai/artifact/3UQcwQun5EvQYKMrkBBq93 의 옛 판(판 8 이전)에 남아 있을 수 있다. 검색칸 자리 · 입력 폭 · 자켓 모양 · 레일과 결과 사이 간격 · 왼쪽 시작 위치는 기록에 없어 미확인이다. 다시 찍은 사진은 결정본이 아니다. 사용자가 같은 날 입력칸 길이와 자켓 디자인이 고른 시안과 다르다고 확인했다. 아래 CSS 는 사진을 찍은 값이고, 고른 시안의 CSS 가 아니다.

최신 결정은 위 줄의 값(줄 72 · 사이 5 · 레일 274 · 결과 862)이다. 2026-11-03 사용자 지시로 더한 자리: 검색칸은 결과 열 맨 위, 폭은 결과 열과 같다(1152 에서 862 · 1056 에서 718, 레일 쪽으로 넘지 않음). 레일은 제목 바로 아래에서 검색칸과 같은 높이로 시작한다. 결과 수 · 정렬 · 보기 전환은 한 줄이다. 결과 수가 왼쪽, 정렬은 보기 전환 바로 왼쪽이다. 부품 모양은 지금 그대로다. 사진 · CSS 는 `~/noslog-research/desktop-music/decided/list/user-1103/`. 2026-11-03 사용자 지시: 옛 가이드 · 10-29 결정 값(검색 전체 폭 · 줄 80)으로 덮지 않는다. 검색 · 정렬 · 보기 전환은 고른 GOG 를 2026-11-03 다시 쟀다(headless 1440, `~/noslog-research/desktop-music/list2/`): 검색 form 제목 줄 오른쪽 x732 폭 536 · 높이 40 · 모서리 20 · 글자 16, 제목 아래 구분선, 정렬 「Sort by: Bestselling (recently) ⌄」 상자 없는 글자 14(x1012–1205 · y217), 보기 전환 아이콘 단추 23 × 23 둘(x1222 · 1245, 면 없음). Amazon 은 쪽 안 검색칸 · 보기 전환이 없고 결과 수 줄 오른쪽 정렬 상자 단추(x1291 · 폭 129 · 높이 약 24)뿐이다. 자켓 비교용으로 캡처에서 잰 값은 GOG 검색 536 × 40(제목 줄 오른쪽) · 목록 그림 80 × 114(줄 146) · 격자 3열, Steam 검색 312 × 28(결과 막대 왼쪽) · 그림 186 × 70(줄 72, 붙음), 벅스 그림 50(줄 71), Apple Music 면 118 · 그림 90 · 여백 12, 앨범 격자 그림 204 · 모서리 7(DOM, `list/applemusic-albums.jpg`). 사진 · CSS · 스크립트는 `~/noslog-research/desktop-music/decided/list/compare/`.

정한 폭으로 찍을 때 입힌 CSS 전문이다.

```css
.noslog-ui .nl-discovery__rail {
    flex: 0 0 274px !important;
    width: 274px !important;
}
.noslog-ui .nl-discovery__results {
    flex: 1 1 0 !important;
    min-width: 0 !important;
}
.noslog-ui .nl-discovery__items:has(.nl-music-card--list) {
    gap: 5px !important;
}
.noslog-ui .nl-music-card--list {
    height: 72px !important;
    min-height: 72px !important;
}
.noslog-ui .nl-music-card--list .nl-jacket {
    width: 72px !important;
    height: 72px !important;
}
```

## 악곡 목록 다시 조사(2026-11-03)

2026-11-03 사용자 지시로 처음부터 다시 쟀다. headless 1440 × 900, 실제 서비스 시도 139곳 · 세는 곳 90곳(리듬게임 공식 · 팬 24 · 음악 23 · 게임 · 영상 23 · 커머스 · 앱 마켓 20). 캡차 · 로그인 벽 · 오류 쪽 · 광고가 목록을 가린 곳은 세지 않았다(Billboard 는 영상 광고가 목록을 가려 모음 사진을 열어 보고 뺐다). 캡처 · DOM 원본 · 스크립트는 `~/noslog-research/desktop-music-list-v2/`, 아래 캡처 경로는 그 폴더 기준이다.

| 칸        | 가장 많은 것                    | 다음            | 그 밖                                                                             |
| --------- | ------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| 필터 자리 | 결과 위 가로 줄(셀렉트 · 칩) 31 | 왼쪽 레일 21    | 탭 · 분류만 16 · 없음 9 · 「필터」 단추 → 서랍 8 · 오른쪽 레일 4 · 결과 아래 폼 1 |
| 검색칸    | 머리(전역)에만 50               | 결과 열 위 24   | 없음 9 · 제목 줄 오른쪽 3 · 필터 레일 안 3 · 미확인 1                             |
| 보기 전환 | 없음 80                         | 있음 10         |                                                                                   |
| 결과 수   | 없음 51                         | 결과 위 왼쪽 18 | 제목 옆 8 · 그 밖 13                                                              |
| 기본 보기 | 격자 41                         | 줄 목록 26      | 표 17 · 가로 선반 6                                                               |

리듬게임 24곳만 보면 결과 위 필터 상자가 12곳, 쪽 안 검색이 결과 열 위 14곳이다. 유명 서비스만 보면 왼쪽 레일(Xbox · Nintendo · GitHub · Hugging Face · IKEA · Nike · Best Buy · Google Fonts · Docker Hub 9곳)과 결과 위 줄(Apple Store · App Store · Chrome 웹 스토어 · KREAM · 무신사 · Spotify · JustWatch · Rotten Tomatoes 8곳)이 비슷하다. 로그인 화면(osu! 필터)과 「필터」 단추 안 서랍(PlayStation · 프로세카 · dxrating)은 열지 않아 미확인이다.

디자인 시스템 14곳(Carbon · Material 3 · Apple HIG · Atlassian · Fluent 2 · Spectrum · GOV.UK · MOJ · Ant · Primer · PatternFly · Cloudscape · EUI · Salesforce · Polaris, GOV.UK · MOJ 는 한 곳으로 셈, 한 곳이 여러 줄에 들 수 있음, 예시 그림에만 보인 곳은 세지 않음): 필터를 목록 바로 위 가로 줄에 두라는 곳 8(Carbon · Ant · Primer · PatternFly · Cloudscape · Atlassian · Polaris · Material 3), 옆 패널 4(Carbon · Ant · Material 3 · Salesforce), 단추로 여는 패널 5(Carbon · Polaris · Salesforce · Spectrum · Fluent 2), 필터 패널 지침 없음 1(Apple). 검색칸을 목록 바로 위에 두라는 곳 8. 결과 수를 표시하라고 쓴 곳 5(Carbon · Cloudscape · PatternFly · Polaris · Primer), 보기 전환 지침 3(Cloudscape · PatternFly · Primer). 정렬은 열 머리 정렬 10, 따로 둔 정렬 단추 3(Polaris · PatternFly · EUI). 원문 인용 · URL 은 `ds/results.json` · `ds/summary.tsv`.

| 곳                 | URL                                                                                                 | 필터                      | 검색칸                    | 정렬                                            | 보기 전환                   | 결과 수                    | 기본 보기 · 칸            | 캡처                              |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------- | ----------------------------------------------- | --------------------------- | -------------------------- | ------------------------- | --------------------------------- |
| maimai             | https://maimai.sega.jp/song/new/                                                                    | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 상자 x938 y635 w144 h48 +…               | 없음                        | 없음                       | 줄 목록: 한 줄… 1         | svc/rhythm/maimai.jpg             |
| chunithm           | https://chunithm.sega.jp/music/new/                                                                 | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 상자 x1008 y486 w164 h48 …               | 없음                        | 필터 상자 안               | 격자: 카드 2열 2          | svc/rhythm/chunithm.jpg           |
| ongeki             | https://ongeki.sega.jp/music/                                                                       | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 x503 y447 w399 h39 + 순서…               | 없음                        | 없음                       | 줄 목록: 한 줄… 1         | svc/rhythm/ongeki.jpg             |
| sdvx               | https://p.eagate.573.jp/game/sdvx/vii/music/index.html                                              | 결과 위 가로 줄           | 결과 열 위                | 없음                                            | 없음                        | 없음                       | 줄 목록: 한 줄… 1         | svc/rhythm/sdvx.jpg               |
| iidx               | https://p.eagate.573.jp/game/2dx/34/newsong/index.html                                              | 없음                      | 없음                      | 없음                                            | 없음                        | 없음                       | 줄 목록: 가운데… 1        | svc/rhythm/iidx.jpg               |
| nostalgia          | https://p.eagate.573.jp/game/nostalgia/op3/music/entrance.html                                      | 결과 위 가로 줄           | 없음                      | 없음                                            | 없음                        | 없음                       | 격자: 카드 2열 2          | svc/rhythm/nostalgia.jpg          |
| ddr                | https://p.eagate.573.jp/game/ddr/ddrworld/music/index.html                                          | 탭·분류 메뉴만            | 없음                      | 없음                                            | 없음                        | 없음                       | 줄 목록: 1열 … 1          | svc/rhythm/ddr.jpg                |
| jubeat             | https://p.eagate.573.jp/game/jubeat/beyond/music/index.html                                         | 탭·분류 메뉴만            | 없음                      | 없음                                            | 없음                        | 없음                       | 격자: 카드 2열… 2         | svc/rhythm/jubeat.jpg             |
| popn               | https://p.eagate.573.jp/game/popn/jamfizz/music/index.html                                          | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 2개(항목 指定なし + 昇順/降順) x66…      | 없음                        | 없음                       | 표: 표(열: 曲… 3          | svc/rhythm/popn.jpg               |
| taiko              | https://taiko.namco-ch.net/taiko/songlist/pops.php                                                  | 탭·분류 메뉴만            | 없음                      | 없음                                            | 없음                        | 없음                       | 표: 표(열: 曲… 5          | svc/rhythm/taiko.jpg              |
| groovecoaster      | https://groovecoaster.jp/music/index.html                                                           | 탭·분류 메뉴만            | 없음                      | 없음                                            | 없음                        | 없음                       | 격자: 재킷만 6… 6         | svc/rhythm/groovecoaster.jpg      |
| wacca              | https://wacca.marv.jp/music/                                                                        | 결과 위 가로 줄           | 결과 열 위                | 없음                                            | 없음                        | 없음                       | 줄 목록: 한 줄… 1         | svc/rhythm/wacca.jpg              |
| sekaibest          | https://sekai.best/music                                                                            | 「필터」 버튼→펼침        | 없음                      | 「필터」 버튼 안(미확인)                        | 있음                        | 없음                       | 격자: 카드 4열 4          | svc/rhythm/sekaibest.jpg          |
| bestdori           | https://bestdori.com/info/songs                                                                     | 「필터」 버튼→펼침        | 결과 열 위(아이콘 버튼만) | 없음(펼침 안 미확인)                            | 있음                        | 결과 위 왼쪽               | 줄 목록: 1열 … 1          | svc/rhythm/bestdori.jpg           |
| arcadesongs-maimai | https://arcade-songs.zetaraku.dev/maimai/                                                           | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 「Sort by」(떠 있는 라벨) 기본 D…        | 있음                        | 결과 위 가운데             | 격자: 보면 칸 … 9         | svc/rhythm/arcadesongs-maimai.jpg |
| osu                | https://osu.ppy.sh/beatmapsets                                                                      | 없음                      | 결과 열 위                | 없음(로그아웃)                                  | 없음                        | 없음                       | 격자: 가로형 카… 2        | svc/rhythm/osu.jpg                |
| beatsaver          | https://beatsaver.com/                                                                              | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 Relevance x1062 y123 w2…                 | 없음                        | 없음                       | 격자: 가로형 카… 2        | svc/rhythm/beatsaver.jpg          |
| arcaea-wiki        | https://wiki.arcaea.cn/%E6%9B%B2%E7%9B%AE%E5%88%97%E8%A1%A8                                         | 결과 위 가로 줄           | 결과 열 위                | 표 머리 정렬 화살표(⬍)                          | 없음(显示列 은 열 고르기)   | 필터 상자 안               | 표: 표(열: 封… 11         | svc/rhythm/arcaea-wiki.jpg        |
| chunirec           | https://db.chunirec.net/                                                                            | 없음                      | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 격자: 가로형 줄… 2        | svc/rhythm/chunirec.jpg           |
| dxrating           | https://dxrating.net/                                                                               | 「필터」 버튼→펼침        | 결과 열 위                | 「Filter / Sort」 버튼 안(미확인)               | 없음                        | 결과 위 가운데             | 줄 목록: 1열 … 1          | svc/rhythm/dxrating.jpg           |
| otogedb-maimai     | https://otoge-db.net/maimai/                                                                        | 오른쪽 레일               | 필터 레일 안              | 표 머리 정렬 화살표                             | 없음(カラムON/OFF 은 …      | 결과 위 왼쪽               | 표: 표(열: 曲… 12         | svc/rhythm/otogedb-maimai.jpg     |
| textage            | https://textage.cc/score/                                                                           | 결과 위 가로 줄           | 결과 열 위                | 표 머리 △▽ 글자 링크                            | 없음                        | 표 머리 안                 | 표: 표(열: S… 12          | svc/rhythm/textage.jpg            |
| beatleader         | https://beatleader.xyz/leaderboards                                                                 | 오른쪽 레일               | 필터 레일 안              | 레일 맨 위 「Sorting」 제목 + 셀렉트 R…         | 없음                        | 결과 아래                  | 격자: 카드 3열… 3         | svc/rhythm/beatleader.jpg         |
| quaver             | https://quavergame.com/mapsets                                                                      | 결과 위 가로 줄           | 결과 열 위                | 셀렉트 「SORT BY: Newest」 x140 …               | 있음                        | 결과 위 오른쪽             | 격자: 가로형 카… 2        | svc/rhythm/quaver.jpg             |
| musicbrainz        | https://musicbrainz.org/search?query=lofi&type=release                                              | 결과 아래 폼              | 전역 내비만               | 없음                                            | 없음                        | 결과 위 왼쪽               | 표 1                      | svc/music/musicbrainz.jpg         |
| spotify            | https://open.spotify.com/search/lofi/tracks                                                         | 결과 위 가로 줄(칩)       | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/spotify.jpg             |
| apple-music        | https://music.apple.com/us/search?term=lofi                                                         | 없음                      | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 유형별 선반(격자) Top R…  | svc/music/apple-music.jpg         |
| amazon-music       | https://music.amazon.com/search/lofi                                                                | 없음                      | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 유형별 선반(가로… 7.5 보… | svc/music/amazon-music.jpg        |
| bandcamp           | https://bandcamp.com/discover/electronic                                                            | 결과 위 가로 줄(칩)       | 결과 위(필터 줄 맨 위)    | 드롭다운 글자 「⇅ best-selling ⌄」 …            | 없음                        | 결과 아래                  | 격자 4                    | svc/music/bandcamp.jpg            |
| melon              | https://www.melon.com/chart/index.htm                                                               | 탭·분류 메뉴만            | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/melon.jpg               |
| bugs               | https://music.bugs.co.kr/chart                                                                      | 「필터」 버튼 → 팝오버    | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/bugs.jpg                |
| genie              | https://www.genie.co.kr/chart/top200                                                                | 탭·분류 메뉴만            | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/genie.jpg               |
| flo                | https://www.music-flo.com/browse                                                                    | 결과 위 가로 줄(칩)       | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/flo.jpg                 |
| vibe               | https://vibe.naver.com/chart/total                                                                  | 없음                      | 전역 내비만               | 없음                                            | 없음                        | 결과 위 왼쪽               | 표 1                      | svc/music/vibe.jpg                |
| beatport           | https://www.beatport.com/genre/techno-peak-time-driving/6/top-100                                   | 없음                      | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/beatport.jpg            |
| traxsource         | https://www.traxsource.com/search?term=lofi                                                         | 탭·분류 메뉴만            | 결과 위                   | 없음                                            | 없음                        | 탭 안                      | 줄 목록 1                 | svc/music/traxsource.jpg          |
| lastfm             | https://www.last.fm/tag/electronic/tracks                                                           | 탭·분류 메뉴만            | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/lastfm.jpg              |
| ultimate-guitar    | https://www.ultimate-guitar.com/explore                                                             | 왼쪽 레일                 | 전역 내비만               | 셀렉트 글자 「Today's most popula…              | 없음                        | 없음                       | 표 1                      | svc/music/ultimate-guitar.jpg     |
| songsterr          | https://www.songsterr.com/                                                                          | 결과 위 가로 줄(셀렉트)   | 제목 줄 오른쪽            | 없음                                            | 없음                        | 없음                       | 줄 목록 1                 | svc/music/songsterr.jpg           |
| shazam             | https://www.shazam.com/charts/top-200/world                                                         | 결과 위 가로 줄(칩)       | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 줄 목록 1                 | svc/music/shazam.jpg              |
| audiomack          | https://audiomack.com/search?q=lofi                                                                 | 결과 위 가로 줄(칩)       | 결과 위                   | 없음                                            | 없음                        | 없음                       | 유형별 선반 재생목록 …    | svc/music/audiomack.jpg           |
| hypem              | https://hypem.com/popular                                                                           | 탭·분류 메뉴만            | 전역 내비만               | 없음(머리 내비 Latest · Popular)                | 없음                        | 없음                       | 줄 목록 1                 | svc/music/hypem.jpg               |
| mixcloud           | https://www.mixcloud.com/genres/house/                                                              | 결과 위 가로 줄(셀렉트)   | 전역 내비만               | 칩 Chart · Popular · Latest …                   | 없음                        | 없음                       | 줄 목록(큰 줄)… Featu…    | svc/music/mixcloud.jpg            |
| jamendo            | https://www.jamendo.com/search?q=lofi                                                               | 없음                      | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 줄 목록 3열(A… 3          | svc/music/jamendo.jpg             |
| mora               | https://mora.jp/search/top?keyWord=lofi                                                             | 탭·분류 메뉴만            | 전역 내비만               | 글자 버튼 3개 「並べかえ：」 라벨 + リリース順… | 없음                        | 탭 안                      | 격자(앨범) + … 3          | svc/music/mora.jpg                |
| oricon             | https://www.oricon.co.jp/rank/js/d/2026-11-01/                                                      | 왼쪽 레일                 | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 줄 목록(카드 줄) 1        | svc/music/oricon.jpg              |
| kworb              | https://kworb.net/spotify/country/global_daily.html                                                 | 탭·분류 메뉴만            | 없음                      | 없음                                            | 없음                        | 없음                       | 표 1                      | svc/music/kworb.jpg               |
| steam              | https://store.steampowered.com/search/?term=rhythm                                                  | 오른쪽 레일               | 결과 열 위                | 결과 위 오른쪽, 셀렉트형 「Sort by」 라벨…      | 없음                        | 결과 위 왼쪽 「6,511 …     | 줄 목록 1                 | svc/games/steam.jpg               |
| gog                | https://www.gog.com/en/games                                                                        | 왼쪽 레일                 | 제목 줄 오른쪽            | 결과 위 오른쪽, 「Sort by:」 라벨 + 글…         | 있음, 정렬 오른쪽 아이콘 …  | 제목 옆 「PC games …       | 격자 3                    | svc/games/gog.jpg                 |
| psstore            | https://store.playstation.com/en-us/pages/browse                                                    | 「필터」 버튼 → 서랍 · …  | 전역 내비만               | 「Sort and Filter」 버튼 안(열지 않…            | 없음                        | 결과 위 왼쪽 「Showin…     | 격자 6                    | svc/games/psstore.jpg             |
| xbox               | https://www.xbox.com/en-US/games/browse                                                             | 왼쪽 레일                 | 전역 내비만               | 레일 맨 위 셀렉트 「Sort by Relevan…            | 없음                        | 제목 옆 「Browse al…       | 격자 4                    | svc/games/xbox.jpg                |
| itch               | https://itch.io/games                                                                               | 왼쪽 레일                 | 전역 내비만               | 제목 아래 탭(「Sort by」 라벨 + Popu…           | 없음                        | 제목 옆 「(1,795,40…       | 격자 4                    | svc/games/itch.jpg                |
| nintendo           | https://www.nintendo.com/us/search/#cat=gme&sort=df                                                 | 왼쪽 레일                 | 전역 내비만               | 결과 위 오른쪽 셀렉트 「Sort by: Feat…          | 없음                        | 결과 위 왼쪽 「Showin…     | 격자 4                    | svc/games/nintendo.jpg            |
| humble             | https://www.humblebundle.com/store/search?search=rhythm                                             | 결과 위 가로 줄(셀렉트 ·… | 결과 열 위                | 가로 줄 안 드롭다운 「SORT Bestselli…           | 없음                        | 제목 옆 「8 Results…       | 격자 4                    | svc/games/humble.jpg              |
| fanatical          | https://www.fanatical.com/en/search                                                                 | 왼쪽 레일                 | 전역 내비만               | 결과 위 오른쪽 셀렉트 「Top Sellers」(…         | 없음(「36 Results」…        | 결과 위 왼쪽 「Showin…     | 격자 3                    | svc/games/fanatical.jpg           |
| gmg                | https://www.greenmangaming.com/search/                                                              | 오른쪽 레일               | 전역 내비만               | 오른쪽 레일 맨 위 「SORT BY」 셀렉트, 기…       | 없음                        | 기타(탭 안 숫자) 「GAM…    | 격자 3                    | svc/games/gmg.jpg                 |
| metacritic         | https://www.metacritic.com/browse/game/                                                             | 왼쪽 레일                 | 전역 내비만               | 결과 위 오른쪽 셀렉트 「Metascore (Hi…          | 없음                        | 결과 위 왼쪽 「14,441…     | 줄 목록 1                 | svc/games/metacritic.jpg          |
| backloggd          | https://backloggd.com/games/lib/popular/                                                            | 「필터」 버튼 → 서랍 · …  | 전역 내비만               | 결과 위 오른쪽 글자 드롭다운 「Sort by P…       | 없음                        | 결과 위 왼쪽 「326,33…     | 격자 6                    | svc/games/backloggd.jpg           |
| hltb               | https://howlongtobeat.com/?q=rhythm                                                                 | 「필터」 버튼 → 서랍 · …  | 전역 내비만               | Search Options 안(미확인)                       | 없음                        | 결과 위 가운데 「We Fo…    | 격자 2                    | svc/games/hltb.jpg                |
| opencritic         | https://opencritic.com/browse/all                                                                   | 결과 위 가로 줄(셀렉트 ·… | 전역 내비만               | 가로 셀렉트 줄 4번째 「Sort: Score」(…          | 있음, 제목 줄 오른쪽 글자…  | 없음                       | 줄 목록 1                 | svc/games/opencritic.jpg          |
| tmdb               | https://www.themoviedb.org/movie                                                                    | 왼쪽 레일                 | 전역 내비만               | 왼쪽 레일 맨 위 접기 상자 「Sort」(기본값 …     | 있음, 제목 줄 오른쪽 글자…  | 없음                       | 격자 5                    | svc/games/tmdb.jpg                |
| justwatch          | https://www.justwatch.com/us/movies                                                                 | 결과 위 가로 줄(셀렉트 ·… | 전역 내비만               | 결과 수 옆 글자 드롭다운 「sorted by P…         | 없음                        | 결과 위 왼쪽 「164,16…     | 격자 7                    | svc/games/justwatch.jpg           |
| rt                 | https://www.rottentomatoes.com/browse/movies_at_home                                                | 결과 위 가로 줄(셀렉트 ·… | 전역 내비만               | 가로 칩 줄 첫 칩 「SORT」(기본값 글자 안 …      | 없음                        | 없음                       | 격자 6                    | svc/games/rt.jpg                  |
| trakt              | https://app.trakt.tv/discover                                                                       | 탭 · 분류 메뉴만          | 미확인                    | 없음                                            | 없음                        | 없음                       | 가로 줄 묶음 줄당 10…     | svc/games/trakt.jpg               |
| mal-top            | https://myanimelist.net/topanime.php                                                                | 탭 · 분류 메뉴만          | 전역 내비만               | 없음(순위표)                                    | 없음                        | 없음                       | 표 1                      | svc/games/mal-top.jpg             |
| anilist            | https://anilist.co/search/anime                                                                     | 결과 위 가로 줄(셀렉트 ·… | 결과 열 위                | 미확인(검색 전 화면에 없음)                     | 미확인(검색 전 화면에 없음) | 없음                       | 가로 줄 묶음 5            | svc/games/anilist.jpg             |
| netflix            | https://www.netflix.com/kr-en/browse/genre/34399                                                    | 없음                      | 없음                      | 없음                                            | 없음                        | 없음                       | 가로 줄 묶음 줄당 6 …     | svc/games/netflix.jpg             |
| kitsu              | https://kitsu.app/anime                                                                             | 왼쪽 레일                 | 결과 열 위                | 결과 위 왼쪽 글자 드롭다운 「Popularity…        | 없음                        | 없음                       | 격자 5                    | svc/games/kitsu.jpg               |
| mubi               | https://mubi.com/en/films                                                                           | 결과 위 가로 줄(셀렉트 ·… | 전역 내비만               | 결과 위 오른쪽 셀렉트 「Most Popular」…         | 없음                        | 없음                       | 격자 3                    | svc/games/mubi.jpg                |
| simkl              | https://simkl.com/movies/best-movies/most-watched/                                                  | 탭 · 분류 메뉴만          | 전역 내비만               | 없음(탭이 순서)                                 | 없음                        | 없음                       | 줄 목록 1                 | svc/games/simkl.jpg               |
| 11st               | https://search.11st.co.kr/pc/total-search?kwd=%ED%97%A4%EB%93%9C%ED%8F%B0&tabId=TOTAL_SEARCH        | 왼쪽 레일                 | 필터 레일 안              | 셀렉트 상자 「11번가 랭킹순」 결과 수 줄 오른…  | 있음 · 정렬 오른쪽 · 아…    | 결과 위 왼쪽 「검색결과 3… | 줄 목록 1                 | svc/commerce/11st.jpg             |
| 29cm               | https://www.29cm.co.kr/store/category/list?categoryLargeCode=272100100&page=1                       | 왼쪽 레일                 | 전역 내비만               | 셀렉트 상자 「추천순」 결과 위 줄 오른쪽 124…   | 없음                        | 필터 레일 안 단추 「168…   | 격자 4                    | svc/commerce/29cm.jpg             |
| applestore         | https://www.apple.com/shop/iphone/accessories/cases-protection                                      | 결과 위 가로 줄           | 전역 내비만               | 글자 링크 「Sort By: Featured ⌄」…              | 없음                        | 없음                       | 격자 3(첫 줄…             | svc/commerce/applestore.jpg       |
| appstore           | https://apps.apple.com/us/iphone/charts                                                             | 결과 위 가로 줄           | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 격자 5                    | svc/commerce/appstore.jpg         |
| bestbuy            | https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=headphones                              | 왼쪽 레일                 | 전역 내비만               | 셀렉트 상자 「Sort by:」 라벨 + 「Bes…          | 없음                        | 제목 옆 「"headphon…       | 격자 4                    | svc/commerce/bestbuy.jpg          |
| chromewebstore     | https://chromewebstore.google.com/category/extensions/productivity/tools                            | 결과 위 가로 줄           | 전역 내비만               | 셀렉트 상자(외곽선 라벨 「Sort by」) 「M…       | 없음                        | 없음                       | 격자 4                    | svc/commerce/chromewebstore.jpg   |
| dockerhub          | https://hub.docker.com/search?q=nginx                                                               | 왼쪽 레일                 | 전역 내비만               | 셀렉트 상자 「Best match」 1216,17…             | 없음                        | 결과 위 왼쪽 「1 - 30…     | 격자 3                    | svc/commerce/dockerhub.jpg        |
| figma              | https://www.figma.com/community/ui-kits?resource_type=files&editor_type=figma                       | 「필터」 버튼 → 서랍 · …  | 전역 내비만               | 글자 단추 「Sort: Popular」 1217,…              | 없음                        | 없음                       | 격자 4                    | svc/commerce/figma.jpg            |
| firefoxaddons      | https://addons.mozilla.org/en-US/firefox/search/?q=dark                                             | 왼쪽 레일                 | 전역 내비만               | 레일 안 셀렉트 상자 「Sort by」 라벨 + …        | 없음                        | 제목 옆(제목 자체) h1 …    | 줄 목록 1                 | svc/commerce/firefoxaddons.jpg    |
| githubsearch       | https://github.com/search?q=rhythm+game&type=repositories                                           | 왼쪽 레일                 | 전역 내비만               | 단추 「Sort by: Best match」 86…                | 없음                        | 결과 위 왼쪽 「7.3k r…     | 줄 목록 1                 | svc/commerce/githubsearch.jpg     |
| googlefonts        | https://fonts.google.com/                                                                           | 왼쪽 레일                 | 전역 내비만               | 검색칸 오른쪽에 붙은 셀렉트 「Sort by / …       | 있음 · Filters 줄 …         | 결과 위 왼쪽 「1,959 …     | 줄 목록 1                 | svc/commerce/googlefonts.jpg      |
| googleplay         | https://play.google.com/store/apps/category/MUSIC_AND_AUDIO                                         | 탭 · 분류 메뉴만          | 전역 내비만               | 없음(차트 칩이 대신)                            | 없음                        | 없음                       | 줄 목록 3(순위 …          | svc/commerce/googleplay.jpg       |
| huggingface        | https://huggingface.co/models                                                                       | 왼쪽 레일                 | 제목 줄 오른쪽            | 단추 「Sort: Trending」 1206,97…                | 없음                        | 제목 옆 「Models 3,…       | 줄 목록 1(2xl…            | svc/commerce/huggingface.jpg      |
| ikea               | https://www.ikea.com/us/en/cat/sofas-sectionals-fu003/                                              | 왼쪽 레일                 | 전역 내비만               | 레일 안 첫 접기 「Sort」 54,1172 24…            | 없음                        | 결과 위 왼쪽 「225 it…     | 격자 4                    | svc/commerce/ikea.jpg             |
| kream              | https://kream.co.kr/search?keyword=%EB%82%98%EC%9D%B4%ED%82%A4                                      | 결과 위 가로 줄           | 결과 열 위                | 글자 링크 「추천순 ⇅」 약 1266,409 · …          | 없음                        | 없음                       | 격자 5                    | svc/commerce/kream.jpg            |
| modrinth           | https://modrinth.com/discover/mods                                                                  | 왼쪽 레일                 | 결과 열 위                | 셀렉트 상자 「Sort by: Relevance」…             | 있음 · 정렬 줄 · 아이콘…    | 없음(쪽 번호에 3902 만)    | 줄 목록 1                 | svc/commerce/modrinth.jpg         |
| musinsa            | https://www.musinsa.com/category/001/goods?gf=A                                                     | 결과 위 가로 줄           | 전역 내비만               | 글자 링크 「무신사 추천순 ⌄」 약 1339,40…       | 없음                        | 결과 위 왼쪽 「348,99…     | 격자 6                    | svc/commerce/musinsa.jpg          |
| nike               | https://www.nike.com/w/mens-shoes-nik1zy7ok                                                         | 왼쪽 레일                 | 전역 내비만               | 글자 링크 「Sort By ⌄」 약 1307,18…             | 없음                        | 제목 옆 「Men's Sho…       | 격자 3                    | svc/commerce/nike.jpg             |
| shopifyapps        | https://apps.shopify.com/categories/marketing-and-conversion-marketing                              | 탭 · 분류 메뉴만          | 전역 내비만               | 없음                                            | 없음                        | 없음                       | 격자 4                    | svc/commerce/shopifyapps.jpg      |
| vsmarket           | https://marketplace.visualstudio.com/search?target=VSCode&category=All%20categories&sortBy=Installs | 결과 위 가로 줄           | 결과 열 위                | 글자 드롭다운 「Sort By: Installs」…            | 없음                        | 결과 위 왼쪽 「123796…     | 격자 6                    | svc/commerce/vsmarket.jpg         |

안별 실제 화면 사진 · CSS · 스크립트는 `mock/`(지금 · Hugging Face · Nintendo · KREAM · CHUNITHM 공식 · PlayStation Store). Nintendo 안의 항목 옆 곡 수는 개발 DB 에서 항목마다 눌러 잰 값이다.

## 쪽 제목 처리(2026-11-03)

악곡 목록 판 1(검색칸 자리)을 정한 뒤 사용자가 쪽 제목 「악곡」 한 줄 때문에 빈 곳이 많다고 해서, 위 90곳 캡처를 다시 하나씩 열어 쪽 제목을 어떻게 두는지 셌다(새로 찍지 않음, `results.json` 의 h1 값이 있으면 함께 봄). 원본은 `title/summary.tsv`, 디자인 시스템은 `title/ds.tsv` · `title/ds-text/`(경로는 `~/noslog-research/desktop-music-list-v2/` 기준).

| 제목 처리                                                     | 90곳 | 필터가 옆 레일인 25곳 | 검색칸이 결과 열 위인 20곳 |
| ------------------------------------------------------------- | ---- | --------------------- | -------------------------- |
| 보이는 제목 없음                                              | 25   | 9                     | 9                          |
| 제목이 내용 전폭 맨 위 한 줄(NosLog 지금)                     | 24   | 4                     | 8                          |
| 제목 줄에 검색칸 · 정렬 · 단추 등을 함께 둠                   | 19   | 3                     | 1                          |
| 제목이 결과 열 맨 위, 레일은 제목 높이부터                    | 10   | 6                     | 0                          |
| 배너 안 7 · 빵부스러기 · 작은 글만 3 · 제목이 레일 열 맨 위 2 | 12   | 3                     | 2                          |

디자인 시스템 20곳 시도 · 13곳 셈(미확인 4: SAP Fiori · Workday Canvas 403, Spectrum · Paste 문서 없음). 제목을 늘 두라는 곳 3(Polaris · PatternFly · Atlassian), 생략 · 대체를 허용하는 곳 5(Apple HIG 는 제목이 중복이면 비워 둠, GitLab Pajamas 는 맥락이 분명하면 h1 을 화면에서만 숨김, EUI 는 탭이 제목을 대신, Material 3 는 검색 앱 바가 제목을 대신, Carbon 은 제목 없는 쪽이면 빵부스러기 끝에 현재 쪽). 옆 필터 패널과 제목 위치 관계를 글로 정한 곳 0. 제목 같은 줄에 동작 단추를 둔다는 곳 10, 결과 수를 제목 옆에 둔다는 곳 1(Cloudscape). 제목 아래 간격 값은 Cloudscape 16 · PatternFly 24 두 곳.

2026-11-04 사용자가 판 1-2 안 1(Steam, 보이는 쪽 제목 없음)을 골랐다. 그 앞 판 1 은 검색칸을 결과 열 맨 위 · 결과 열 폭에 두는 11-03 결정본을 골랐다. 사진 · 코드는 `mock/t-steam.jpg` · `mock/shot-title.mjs`.

같은 날 목록 보기 자켓은 줄에 붙은 그림 72 · 카테고리 칸은 그림 위(지금 운영과 같음)로 골랐다. 사진 · 코드는 `~/noslog-research/desktop-music/decided/list/user-1103/` 의 `s-ja.jpg` · `shot-s.mjs`.

판단이 애매한 곳: jubeat · maimai · iidx(장식 판 안 제목, 전폭으로 셈), hypem · mora · ddr(옆 열이 필터가 아님), chromewebstore(왼쪽이 분류 메뉴, 제목 줄에 셀렉트 둘), textage · kworb · musinsa(작은 글 제목), arcaea-wiki(다시 찍은 캡처로 판정), ikea(레일이 y1166, `-full.jpg` 로 판정).

| 곳                 | 필터                       | 제목 처리              | 같은 줄에 든 것                                               | 제목 글자                              | 확인         |
| ------------------ | -------------------------- | ---------------------- | ------------------------------------------------------------- | -------------------------------------- | ------------ |
| maimai             | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음(제목 혼자 한 줄)                                         | 그림 글자 약 44px(눈) · DOM h2…        | DOM+눈       |
| chunithm           | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음(「MUSIC」 큰 글 + 「楽曲リスト」 두 줄)                  | h2 fs 18px(DOM, 「MUSIC」 …            | DOM+눈       |
| ongeki             | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음(뒤에 「MUSIC」 흐린 큰 글)                               | 「楽曲リスト」 눈 약 30px · DOM h…     | DOM+눈       |
| sdvx               | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 24px                             | 눈           |
| iidx               | 없음                       | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 30px(「楽曲データ」, 뒤 「/曲名… | 눈           |
| nostalgia          | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 22px(「MUSIC」) · DOM …          | 눈           |
| ddr                | 탭·분류 메뉴만             | 결과 열 맨 위          | 없음                                                          | 21.6px(DOM h1)                         | DOM+눈       |
| jubeat             | 탭·분류 메뉴만             | 전폭 맨 위 한 줄       | 없음                                                          | 50px(DOM h1)                           | DOM+눈       |
| popn               | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음                                                          | 그림 글자 눈 약 28px(「MUSIC」 장…     | 눈           |
| taiko              | 탭·분류 메뉴만             | 배너 안                | 없음                                                          | 배너 문구 눈 약 40px · DOM h2 …        | DOM+눈       |
| groovecoaster      | 탭·분류 메뉴만             | 같은 줄에 다른 것      | 오른쪽 끝 게임 로고                                           | 28px(DOM h2 「MUSIC収録楽曲」)         | DOM+눈       |
| wacca              | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음                                                          | 그림 글자 눈 약 55px · DOM h2 …        | DOM+눈       |
| sekaibest          | 「필터」 버튼→펼침         | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 21px(「Music」)                  | 눈+DOM(결과… |
| bestdori           | 「필터」 버튼→펼침         | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 24px(「Songs」)                  | 눈+DOM(결과… |
| arcadesongs-maimai | 결과 위 가로 줄            | 보이는 제목 없음       | -                                                             | -                                      | 눈+DOM(결과… |
| osu                | 없음                       | 전폭 맨 위 한 줄       | 없음(앞에 아이콘)                                             | 눈 약 19px                             | 눈+DOM       |
| beatsaver          | 결과 위 가로 줄            | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| arcaea-wiki        | 결과 위 가로 줄            | 같은 줄에 다른 것      | 오른쪽 끝 「移动版 · Switch」 보기 탭                         | 눈 약 28px(「曲目列表」)               | 눈           |
| chunirec           | 없음                       | 같은 줄에 다른 것      | 제목 바로 오른쪽 날짜 「2026/10/08」                          | 40px(DOM h1 「新曲」)                  | DOM          |
| dxrating           | 「필터」 버튼→펼침         | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| otogedb-maimai     | 오른쪽 레일                | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| textage            | 결과 위 가로 줄            | 빵부스러기 · 작은 글만 | -                                                             | 눈 약 13px 굵은 글(「beatmania…        | 눈+DOM(결과… |
| beatleader         | 오른쪽 레일                | 결과 열 맨 위          | 없음                                                          | 20px(DOM h1 「Maps」)                  | DOM          |
| quaver             | 결과 위 가로 줄            | 배너 안                | 없음                                                          | 60px(DOM h1 「Maps」)                  | DOM+눈       |
| musicbrainz        | 결과 아래 폼               | 전폭 맨 위 한 줄       | 없음                                                          | 18px(DOM h1 「Search resu…             | DOM+눈       |
| spotify            | 결과 위 가로 줄(칩)        | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| apple-music        | 없음                       | 보이는 제목 없음       | -                                                             | -                                      | 눈           |
| amazon-music       | 없음                       | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 22px(「Search results…           | 눈           |
| bandcamp           | 결과 위 가로 줄(칩)        | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| melon              | 탭·분류 메뉴만             | 같은 줄에 다른 것      | 제목 바로 오른쪽 도움말 「?」 아이콘                          | 눈 약 24px(「TOP100」)                 | 눈+DOM(결과… |
| bugs               | 「필터」 버튼 → 팝오버     | 같은 줄에 다른 것      | 제목 바로 오른쪽 「전체 장르 ▾」 고르기                       | 21px(DOM h1 「벅스차트」)              | DOM+눈       |
| genie              | 탭·분류 메뉴만             | 같은 줄에 다른 것      | 같은 줄 오른쪽 끝 빵부스러기 「홈 > 지니차트 > TOP200 …       | 눈 약 18px(「지니차트」)               | 눈+DOM(결과… |
| flo                | 결과 위 가로 줄(칩)        | 같은 줄에 다른 것      | 제목 오른쪽 작은 회색 「24시간 집계 (15시 기준)」, 오른쪽…    | 눈 약 22px(「FLO 전체 연령 차트」)     | 눈+DOM(결과… |
| vibe               | 없음                       | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 36px(「오늘 Top 100」) ·…        | 눈+DOM(결과… |
| beatport           | 없음                       | 같은 줄에 다른 것      | 제목 오른쪽 재생 · 목록 추가 · 더하기 아이콘 단추             | 30px(DOM h1 「Top 100」)               | DOM+눈       |
| traxsource         | 탭·분류 메뉴만             | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| lastfm             | 탭·분류 메뉴만             | 배너 안                | 배너 안 제목 아래 탭 줄(Overview · Artists · …                | 30px(DOM h1 「Electronic …             | DOM+눈       |
| ultimate-guitar    | 왼쪽 레일                  | 결과 열 맨 위          | 없음                                                          | 44px(DOM h1 「Explore cho…             | DOM+눈       |
| songsterr          | 결과 위 가로 줄(셀렉트)    | 같은 줄에 다른 것      | 제목 오른쪽 검색칸 「Search over a million ta…                | 30px(DOM h1 「Search tabs…             | DOM+눈       |
| shazam             | 결과 위 가로 줄(칩)        | 배너 안                | 머리 영역 안 제목 왼쪽 재생 단추 · 위 「GLOBAL」 작은 …       | 눈 약 50px(「Top 200」)                | 눈+DOM(결과… |
| audiomack          | 결과 위 가로 줄(칩)        | 배너 안                | 머리 상자 안 제목 아래 검색칸 · 분류 칩                       | 눈 약 24px(「Results Matchi…           | 눈+DOM       |
| hypem              | 탭·분류 메뉴만             | 결과 열 맨 위          | 머리 띠 안 제목 아래 탭(Highlights · Tracks ·…                | 25px(DOM h1 「Popular」)               | DOM+눈       |
| mixcloud           | 결과 위 가로 줄(셀렉트)    | 같은 줄에 다른 것      | 제목 왼쪽 재생 단추, 같은 줄 오른쪽 끝 「Share」 단추         | 32px(DOM h1 「House」)                 | DOM+눈       |
| jamendo            | 없음                       | 보이는 제목 없음       | -                                                             | -                                      | DOM          |
| mora               | 탭·분류 메뉴만             | 결과 열 맨 위          | 없음                                                          | 눈 약 20px(「"lofi" の検索結果」)      | 눈           |
| oricon             | 왼쪽 레일                  | 결과 열 맨 위          | 제목 아래 날짜 「2026年11月01日付」, 왼쪽 끝 「前日」 화…     | 20px(DOM h1 「デイリー シングルラン…   | DOM+눈       |
| kworb              | 탭·분류 메뉴만             | 빵부스러기 · 작은 글만 | 제목 줄 끝 「/ Totals」 링크                                  | 눈 약 16px 굵은 글(「Spotify D…        | 눈           |
| steam              | 오른쪽 레일                | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| gog                | 왼쪽 레일                  | 같은 줄에 다른 것      | 같은 줄 오른쪽 검색칸 「Search for games」, 제목 …            | 20px(DOM h1 「PC games / …             | DOM+눈       |
| psstore            | 「필터」 버튼 → 서랍 · 팝… | 전폭 맨 위 한 줄       | 없음                                                          | 눈 약 42px(「All games」) · …          | 눈+DOM       |
| xbox               | 왼쪽 레일                  | 제목이 레일 열 맨 위   | 없음(제목 글에 개수 「(17,941 games)」 포함)                  | 20px(DOM h1 「Browse all …             | DOM+눈       |
| itch               | 왼쪽 레일                  | 결과 열 맨 위          | 제목 안 「Games ⌄」 고르기 + 결과 수 「(1,795,40…             | 눈 약 22px(「Top」) · DOM h1…          | 눈+DOM       |
| nintendo           | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | DOM h1 숨김 28px(「Search N…           | DOM+눈       |
| humble             | 결과 위 가로 줄(셀렉트 · … | 전폭 맨 위 한 줄       | 없음(제목 자체가 결과 수 「8 Results」)                       | 26px(DOM h1)                           | DOM          |
| fanatical          | 왼쪽 레일                  | 전폭 맨 위 한 줄       | 없음                                                          | 32px(DOM h1 「Search Resu…             | DOM+눈       |
| gmg                | 오른쪽 레일                | 빵부스러기 · 작은 글만 | -                                                             | 눈 약 14px 대문자(「SEARCH RES…        | 눈+DOM       |
| metacritic         | 왼쪽 레일                  | 전폭 맨 위 한 줄       | 없음                                                          | 32px(DOM h1 「Best Games …             | DOM+눈       |
| backloggd          | 「필터」 버튼 → 서랍 · …   | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| hltb               | 「필터」 버튼 → 서랍 · …   | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| opencritic         | 결과 위 가로 줄(셀렉트 · … | 같은 줄에 다른 것      | 같은 줄 오른쪽 끝 「Switch to Card View」 보기 …              | 40px(DOM h1 「Best Games …             | DOM+눈       |
| tmdb               | 왼쪽 레일                  | 같은 줄에 다른 것      | 제목 바로 오른쪽 「⌄」 목록 고르기, 같은 줄 오른쪽 끝 「Li…   | 눈 약 20px(「Popular Movies…           | 눈           |
| justwatch          | 결과 위 가로 줄(셀렉트 · … | 같은 줄에 다른 것      | 같은 줄 오른쪽 끝 접기 「⌄」                                  | 20px(DOM h1 「Discover mo…             | DOM+눈       |
| rt                 | 결과 위 가로 줄(셀렉트 · … | 같은 줄에 다른 것      | 제목 바로 오른쪽 「AT HOME ⌄」 고르기                         | 26px(DOM h1 「Movies to S…             | DOM+눈       |
| trakt              | 탭 · 분류 메뉴만           | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| mal-top            | 탭 · 분류 메뉴만           | 전폭 맨 위 한 줄       | 없음                                                          | 16px(DOM h1 「Top Anime」,…            | DOM+눈       |
| anilist            | 결과 위 가로 줄(셀렉트 · … | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| netflix            | 없음                       | 배너 안                | 배너 안 제목 아래 설명 · 이메일 칸 · 「Join Now」 단…         | 48px(DOM h1 「Movies」)                | DOM+눈       |
| kitsu              | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| mubi               | 결과 위 가로 줄(셀렉트 · … | 같은 줄에 다른 것      | 같은 줄 오른쪽 끝 「CONTRIBUTE TO THE DATABA…                 | 32px(DOM h1 「FILM DATABA…             | DOM+눈       |
| simkl              | 탭 · 분류 메뉴만           | 같은 줄에 다른 것      | 같은 띠 안 오른쪽에 하위 메뉴 링크(GENRES · MY LIS…           | 눈 약 27px(「MOVIES」)                 | 눈+DOM(결과… |
| 11st               | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| 29cm               | 왼쪽 레일                  | 제목이 레일 열 맨 위   | 없음                                                          | 눈 약 20px(「남성의류」)               | DOM+눈       |
| applestore         | 결과 위 가로 줄            | 전폭 맨 위 한 줄       | 없음(위 작은 줄 「iPhone Accessories」 + 큰 줄…               | h1 34px(DOM) · 큰 줄 눈 약 5…          | DOM+눈       |
| appstore           | 결과 위 가로 줄            | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| bestbuy            | 왼쪽 레일                  | 결과 열 맨 위          | 제목 아래 「Search all categories」 링크                      | 눈 약 20px(「"headphones" i…           | DOM+눈       |
| chromewebstore     | 결과 위 가로 줄            | 결과 열 맨 위          | 같은 줄 오른쪽 「Filter by: All」 · 「Sort by…                | 32px(DOM h1 「Tools」)                 | DOM          |
| dockerhub          | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | -                                      | DOM          |
| figma              | 「필터」 버튼 → 서랍 · 팝… | 전폭 맨 위 한 줄       | 없음(위 빵부스러기, 아래 설명 한 줄)                          | 24px(DOM h1 「UI kits」)               | DOM+눈       |
| firefoxaddons      | 왼쪽 레일                  | 전폭 맨 위 한 줄       | 없음(제목 자체가 결과 수 문장)                                | 32px(DOM h1 「29,556 resu…             | DOM+눈       |
| githubsearch       | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | DOM h1 숨김 32px                       | DOM+눈       |
| googlefonts        | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | DOM h1 숨김 16px                       | DOM+눈       |
| googleplay         | 탭 · 분류 메뉴만           | 보이는 제목 없음       | -                                                             | -                                      | 눈           |
| huggingface        | 왼쪽 레일                  | 결과 열 맨 위          | 같은 줄에 결과 수 「3,207,653」 · 「Filter by …               | 18px(DOM h1 「Models」)                | DOM+눈       |
| ikea               | 왼쪽 레일                  | 전폭 맨 위 한 줄       | 없음                                                          | 40px(DOM h1 「Sofas & sec…             | DOM+눈(-f…   |
| kream              | 결과 위 가로 줄            | 보이는 제목 없음       | -                                                             | -                                      | DOM+눈       |
| modrinth           | 왼쪽 레일                  | 보이는 제목 없음       | -                                                             | -                                      | DOM          |
| musinsa            | 결과 위 가로 줄            | 같은 줄에 다른 것      | 제목 바로 오른쪽 「⌄」 분류 고르기, 같은 줄 오른쪽 끝 돋보기… | 눈 약 16px(「상의」)                   | 눈           |
| nike               | 왼쪽 레일                  | 같은 줄에 다른 것      | 같은 줄 오른쪽 끝 「Hide Filters」 · 「Sort By…               | 눈 약 24px(「Men's Shoes & …           | 눈+DOM       |
| shopifyapps        | 탭 · 분류 메뉴만           | 배너 안                | 머리 영역 안 작은 h1 아래 큰 홍보 문구 · 오른쪽 그림 · …      | h1 18px(DOM 「Marketing a…             | DOM+눈       |
| vsmarket           | 결과 위 가로 줄            | 보이는 제목 없음       | -                                                             | -                                      | DOM          |

## 필터 모양(2026-11-04)

악곡 목록 판 2(필터 자리)를 그리려고, 위 90곳 중 필터가 결과 위 가로 줄(31) · 옆 레일(왼쪽 21 · 오른쪽 4)인 56곳 캡처를 다시 열어 모양을 셌다(새로 찍지 않음). 원본은 `filter/summary.tsv`(경로는 `~/noslog-research/desktop-music-list-v2/` 기준).

| 자리            | 모양              | 수  | 곳                                                                                                       |
| --------------- | ----------------- | --- | -------------------------------------------------------------------------------------------------------- |
| 결과 위 가로 줄 | 라벨 셀렉트 줄    | 9   | nostalgia · popn · arcadesongs-maimai · humble · opencritic · anilist · mubi · chromewebstore · vsmarket |
| 결과 위 가로 줄 | 테두리 판 안 필터 | 7   | maimai · chunithm · ongeki · sdvx · arcaea-wiki · quaver · audiomack                                     |
| 결과 위 가로 줄 | 드롭다운 단추     | 5   | songsterr · justwatch · rt · applestore · kream                                                          |
| 결과 위 가로 줄 | 칩 다 펼침        | 5   | wacca · spotify · bandcamp · flo · shazam                                                                |
| 결과 위 가로 줄 | 그 밖             | 5   | beatsaver · textage · mixcloud · appstore · musinsa                                                      |
| 옆 레일         | 체크박스 목록     | 10  | steam(오) · gog · nintendo · gmg(오) · metacritic · 11st · 29cm · bestbuy · dockerhub · nike             |
| 옆 레일         | 링크 · 글자 목록  | 5   | ultimate-guitar · oricon · itch · githubsearch · modrinth                                                |
| 옆 레일         | 칩                | 3   | huggingface · beatleader(오) · kitsu                                                                     |
| 옆 레일         | 셀렉트 목록       | 2   | otogedb-maimai(오) · firefoxaddons                                                                       |
| 옆 레일         | 섞음              | 3   | tmdb · googlefonts · fanatical                                                                           |
| 옆 레일         | 접힌 상자만 보임  | 2   | xbox · ikea                                                                                              |

레일 폭은 150–461(DOM), 많은 곳이 256–336 이다. 접는 상자를 쓰는 레일은 16곳. 고른 필터 칩 줄은 첫 화면에서 확인된 곳이 없다(고른 상태가 아닌 캡처). 「모두 지우기」 는 레일에서 nintendo · googlefonts · 29cm · otogedb 4곳. 칸 안에서 여러 개 고르는 모양 · 고른 상태 표시는 캡처가 기본 상태라 미확인(maimai · chunithm · wacca · rt · applestore · kream 등).

| 곳                 | 필터 자리       | 모양                                                              | 칩 · 단추 높이                  | 레일 폭         | 그룹 모양                                                          |
| ------------------ | --------------- | ----------------------------------------------------------------- | ------------------------------- | --------------- | ------------------------------------------------------------------ |
| maimai             | 결과 위 가로 줄 | (d) 테두리 상자 안 필터 판: 분류 단추 8(4×2) + 검색칸 · …         | 분류 단추 약 64(눈) · 정렬 셀…  | -               | -                                                                  |
| chunithm           | 결과 위 가로 줄 | (d) 테두리 상자 안 필터 판: 분류 단추 10(5×2) + 검색칸 ·…         | 분류 단추 약 48(눈) · 정렬 셀…  | -               | -                                                                  |
| ongeki             | 결과 위 가로 줄 | (d) 검은 면 필터 판: 라벨 붙은 줄 3(カテゴリー選択 셀렉트 · キ…   | 셀렉트 39(DOM) · リセット 약…   | -               | -                                                                  |
| sdvx               | 결과 위 가로 줄 | (d) 검은 면 필터 판: 라벨 붙은 줄 3(カテゴリ 셀렉트 · キーワー…   | 셀렉트 23(DOM) · 단추 약 3…     | -               | -                                                                  |
| nostalgia          | 결과 위 가로 줄 | (c) 셀렉트 상자 하나: 「Music Category」 라벨(위) + …             | 24(DOM)                         | -               | -                                                                  |
| popn               | 결과 위 가로 줄 | (c) 라벨 붙은 셀렉트 세로 폼: バージョン · レベル · その他カテゴ… | 셀렉트 23(DOM) · 단추 약 2…     | -               | -                                                                  |
| wacca              | 결과 위 가로 줄 | (b) 칩 다 펼침: 「ジャンル」 라벨 탭 아래 분류 단추 6(한 줄 5…    | 칩 약 60(눈)                    | -               | -                                                                  |
| arcadesongs-maimai | 결과 위 가로 줄 | (c) 라벨 붙은 셀렉트 2열 격자(Material 밑줄 셀렉트): Ca…          | 셀렉트 42 · 32(DOM)             | -               | -                                                                  |
| beatsaver          | 결과 위 가로 줄 | (e) 섞인 한 줄: 「Filters ⌄」 드롭다운 단추(밑줄, 누르면 …        | Filters 약 44(눈, 아래 밑…      | -               | -                                                                  |
| arcaea-wiki        | 결과 위 가로 줄 | (d) 테두리 상자 안 필터 판: 위에 작은 라벨이 붙은 칸 — 搜索 검…   | 약 36(눈)                       | -               | -                                                                  |
| textage            | 결과 위 가로 줄 | (e) 표 모양 링크 판: 줄 머리(ALPHABET · VERSION ·…                | 링크 칸 약 19(눈)               | -               | -                                                                  |
| quaver             | 결과 위 가로 줄 | (d) 면 상자 안 필터 판: 검색칸 줄 + 아래 줄에 칩 3(RANKE…         | 칩 · 셀렉트 32(DOM)             | -               | -                                                                  |
| otogedb-maimai     | 오른쪽 레일     | 셀렉트 상자 목록(레일 맨 위 검색칸 + 그룹마다 셀렉트 상자 하나)   | 셀렉트 46(DOM)                  | 240(x1180, DOM… | 셀렉트 상자 13개(バージョン · ジャンル · DX/Std · BASIC…           |
| beatleader         | 오른쪽 레일     | 접는 상자 + 칩 섞음                                               | 접는 상자 약 50 · 칩 약 26(…    | 400(x1040, DOM… | 「Sorting」 제목 아래 정렬 셀렉트 + Descending 단추 →…             |
| spotify            | 결과 위 가로 줄 | (b) 칩 다 펼침: 유형 칩 8(All · Playlists · Gen…                  | 32(DOM)                         | -               | -                                                                  |
| bandcamp           | 결과 위 가로 줄 | (b) 칩 다 펼침 3줄(장르 · 하위 장르 · 형식) + 아래 드롭다운…      | 칩 약 36(눈)                    | -               | -                                                                  |
| flo                | 결과 위 가로 줄 | (b) 장르 글자 탭 줄(‹ › 넘김) + 아래 연령 칩 4(전체 연령 …        | 칩 약 28(눈)                    | -               | -                                                                  |
| ultimate-guitar    | 왼쪽 레일       | 링크 목록(항목 이름 + 오른쪽 개수) · 그룹마다 「Show All」        | 항목 줄 약 36(눈)               | 216(x18, DOM ·… | 링크 목록 그룹(Difficulty 4 · Tuning 5 + Show …                    |
| songsterr          | 결과 위 가로 줄 | (a) 드롭다운 단추 줄: 아이콘 + ⌄ 단추 3(악기 · 튜닝 · 난이…       | 약 24(눈)                       | -               | -                                                                  |
| shazam             | 결과 위 가로 줄 | (b) 칩 다 펼침 2(TOP 200 · VIRAL) + 드롭다운 칩 1…                | 약 36(눈)                       | -               | -                                                                  |
| audiomack          | 결과 위 가로 줄 | (d) 테두리 상자 안: 제목 「Results Matching "lofi…                | 약 36(눈)                       | -               | -                                                                  |
| mixcloud           | 결과 위 가로 줄 | (e) 칩 3(Chart · Popular · Latest, 정렬 역할)…                    | 칩 약 36(눈)                    | -               | -                                                                  |
| oricon             | 왼쪽 레일       | 링크 목록(나무 모양, +/- 로 펼침)                                 | 항목 줄 약 23(눈)               | 150(x230, 눈)   | 「音楽ランキング」 한 그룹 안에 분류 링크 약 20줄, 분류마다 + 로 … |
| steam              | 오른쪽 레일     | 체크박스 목록 + 슬라이더 + 접는 상자                              | 체크 줄 약 30 · 그룹 제목 띠 …  | 310(x1010, DOM… | 그룹 9: Narrow by Price(슬라이더 + 체크 2, 펼침) ·…                |
| gog                | 왼쪽 레일       | 접는 상자 + 체크박스 목록 + 가격 슬라이더                         | 체크 줄 약 37(눈)               | 274(x168, DOM)  | 맨 위 체크 2(GOOD OLD GAMES · Show only disc…                      |
| xbox               | 왼쪽 레일       | 접는 상자 목록(모두 처음 접힘)                                    | 접는 상자 32(DOM)               | 272(x153, DOM)  | 맨 위 「Sort by Relevance」 접는 상자 → 「Filters…                 |
| itch               | 왼쪽 레일       | 링크 목록(아이콘 + 글자) + 접는 그룹                              | 항목 줄 약 32(눈)               | 260(x0, DOM · … | 맨 위 「FILTER RESULTS」 → 그룹 Platform 7 · P…                    |
| nintendo           | 왼쪽 레일       | 접는 상자 + 체크박스 목록(개수 붙음)                              | 체크 상자 약 24 · 그룹 머리 줄… | 330(x29, DOM)   | 회색 면 레일 안 흰 판에 접는 그룹: Category(처음 펼침, 체크…       |
| humble             | 결과 위 가로 줄 | (c) 라벨 붙은 글자 드롭다운 줄: 「FILTER None ▾ · SO…             | 글자 줄 약 20(눈)               | -               | -                                                                  |
| fanatical          | 왼쪽 레일       | 접는 상자(+/−) + 칩 + 켜고 끄기                                   | 가격 칩 약 30 · 그룹 줄 약 5…   | 287(x146, DOM)  | On Sale 켜고 끄기 → Price(처음 펼침, 알약 칩 5가 여러 …            |
| gmg                | 오른쪽 레일     | 접는 상자 + 체크박스 목록(개수 배지) + 슬라이더 + 그룹 안 검색    | 체크 줄 약 26(눈)               | 287(x1012, DOM… | 회색 면 레일: SORT BY 셀렉트 → PRICE 슬라이더 · SALE…              |
| metacritic         | 왼쪽 레일       | 체크박스 목록 + 세그먼트 단추 + 입력칸 + 접는 그룹                | 세그먼트 · 입력칸 약 32 · 42…   | 313(x72, DOM)   | 「Filters」 → RELEASE YEAR(Single year/Yea…                        |
| opencritic         | 결과 위 가로 줄 | (c) 셀렉트 상자 줄: 위에 작은 라벨이 붙은 밑줄 셀렉트 4(Plat…     | 26(DOM)                         | -               | -                                                                  |
| tmdb               | 왼쪽 레일       | 접는 상자(카드) + 라디오 · 체크 · 날짜 입력 · 칩 · 슬라이더 …     | 접는 상자 머리 약 48 · 장르 칩… | 260(x55, DOM)   | 접는 상자 3: Sort(▸ 접힘) · Where to Watch(개수 …                  |
| justwatch          | 결과 위 가로 줄 | (a) 드롭다운 글자 단추 줄: 「FILTERS」 라벨 + Release…            | 글자 줄 약 20(눈)               | -               | -                                                                  |
| rt                 | 결과 위 가로 줄 | (a) 드롭다운 단추 줄(알약 모양): SORT ⌄ · GENRE ⌄ ·…              | 34(DOM, SORT 82×34)             | -               | -                                                                  |
| anilist            | 결과 위 가로 줄 | (c) 셀렉트 상자 줄: 위에 라벨이 붙은 칸 5(Search 검색칸 ·…        | 약 38(눈)                       | -               | -                                                                  |
| kitsu              | 왼쪽 레일       | 슬라이더 + 칩 + 아이콘 격자 + 링크 목록(체크 표시)                | 칩 약 26(눈) · 계절 줄 약 3…    | 238(x151, DOM)  | 늘 펼침, 구역 사이 1px 선: Year · Average Rating…                  |
| mubi               | 결과 위 가로 줄 | (c) 글자 셀렉트 줄: 「All genres ⌄ · All countr…                  | 30(DOM)                         | -               | -                                                                  |
| 11st               | 왼쪽 레일       | 둥근 체크 목록 + 접는 그룹 + 「더보기」                           | 체크 줄 약 31(눈)               | 185(x100, DOM … | 맨 위 퀵필터 둥근 체크 6(그룹 제목 없음) → 접는 그룹 배송혜택(⌄…   |
| 29cm               | 왼쪽 레일       | 분류 링크 목록 + 아래 「필터」 구역(체크박스 목록 · 색 점 2열 ·…  | 체크 줄 약 54(눈, 줄 사이 1p…   | 220(x50, DOM)   | 위: 「남성의류」 제목 + 두꺼운 선 아래 분류 링크 11 → 두꺼운 선…   |
| applestore         | 결과 위 가로 줄 | (a) 드롭다운 단추 줄(알약 모양): Accessory Type · C…              | 약 36(눈)                       | -               | -                                                                  |
| appstore           | 결과 위 가로 줄 | (e) 드롭다운 단추 1(「All Apps ⌄」, 고른 값이 단추 글자)…         | 드롭다운 약 28 · 세그먼트 약 3… | -               | -                                                                  |
| bestbuy            | 왼쪽 레일       | 체크박스 목록 + 링크 목록 + 「Show all」, 그룹 늘 펼침            | 체크 줄 약 32(눈)               | 336(x24, DOM)   | 1px 테두리 둥근 상자 하나 안에 그룹: Get it fast(체크 2…           |
| chromewebstore     | 결과 위 가로 줄 | (c) 셀렉트 상자 2: 외곽선 위에 걸친 라벨(「Filter by」 「…        | 40(DOM)                         | -               | -                                                                  |
| dockerhub          | 왼쪽 레일       | 접는 그룹 + 체크박스 목록 + 「Show more」                         | 체크 줄 약 42(눈)               | 256(x40, DOM)   | 「Filter by」 제목 → 접는 그룹 3(Products 체크 5 +…                |
| firefoxaddons      | 왼쪽 레일       | 셀렉트 상자 목록(라벨 위 + 회색 면 셀렉트)                        | 셀렉트 39(DOM)                  | 461(x61, DOM ·… | 흰 카드 「Filter results」 머리 → 셀렉트 3(Sort by…                |
| githubsearch       | 왼쪽 레일       | 링크 목록(아이콘 + 글자 + 오른쪽 개수 배지) · 언어 색 점 목록 …   | 항목 줄 약 32(눈)               | 296(x0, DOM · … | 「Filter by」 → 유형 링크 7(개수 배지) + More → La…                |
| googlefonts        | 왼쪽 레일       | 접는 그룹 + 셀렉트 상자 + 칩 격자(2열) + 슬라이더                 | 칩 약 32 · 셀렉트 약 48(눈)     | 320(x96, DOM ·… | 옅은 파란 면 서랍: Preview(입력칸 · 크기 셀렉트 · 슬라이더)…       |
| huggingface        | 왼쪽 레일       | 칩(아이콘 + 글자, 그룹마다 「+N」 더보기 칩) + 슬라이더 + 위 …    | 칩 약 28(눈)                    | 400(x89, DOM ·… | 위 탭(Main · Tasks · Libraries · Languages…                        |
| ikea               | 왼쪽 레일       | 접는 상자 목록(모두 처음 접힘) + 일부 그룹은 개수 + 체크박스 바로 | 그룹 줄 48(DOM)                 | 264(x48, DOM ·… | Sort · Type · Color · Number of seats · …                          |
| kream              | 결과 위 가로 줄 | (a) 드롭다운 단추 줄(알약 모양): 배송 · 카테고리 · 성별 · 색…     | 드롭다운 약 30 · 그림 칩 약 3…  | -               | -                                                                  |
| modrinth           | 왼쪽 레일       | 접는 상자(그룹마다 면 카드) + 그룹 안 검색칸 + 글자 목록 · 아이…  | 목록 줄 약 32(눈)               | 300(x99, DOM ·… | 면 카드 그룹: Game version(⌃ 펼침, 검색칸 + 버전 글자 …            |
| musinsa            | 결과 위 가로 줄 | (e) 여러 줄 섞음: 하위 분류 글자 탭 줄 · 라벨 붙은 링크 줄 3…     | 빠른 칩 · 드롭다운 약 30(눈)    | -               | -                                                                  |
| nike               | 왼쪽 레일       | 켜고 끄기 + 분류 링크 목록 + 체크박스 그룹(첫 화면 아래, 레일 자… | 링크 줄 약 32(눈)               | 194(x46, DOM)   | Pick Up Today 켜고 끄기 → 1px 선 → 분류 링크 약 20…                |
| vsmarket           | 결과 위 가로 줄 | (c) 라벨 붙은 글자 드롭다운: 「Target Platform: All…              | 글자 줄 19(DOM, Sort By…        | -               | -                                                                  |

## 필터 사이드바(2026-11-04)

사용자가 사이드바 모양 · 배치 · 안쪽 간격을 조사해 시안을 그리라고 해서, 사이드바가 있는 곳 50곳을 DOM 으로 쟀다(11-03 의 25곳은 쪽을 다시 열어 DOM 만, 새로 25곳은 캡처와 함께). 막힌 24곳(Cloudflare · 403 · 429 · 홈으로 넘어감 등)과 사이드바가 없는 4곳(edX · Coursera · JetBrains · Atlassian)은 세지 않았다. 원본은 `rail/summary.tsv`(43열) · `rail/results*.json`, 디자인 시스템은 `rail/ds.tsv` · `rail/ds-text/`(경로는 `~/noslog-research/desktop-music-list-v2/` 기준).

| 칸        | 값별 개수(50곳)                                                                    |
| --------- | ---------------------------------------------------------------------------------- |
| 쪽        | 왼쪽 46 · 오른쪽 4                                                                 |
| 폭        | 200 미만 6 · 200–249 9 · 250–299 16 · 300–349 15 · 350 이상 4, 중앙값 273          |
| 면        | 면 없음 24 · 면 색 상자 11 · 1px 테두리 상자 6 · 오른쪽 세로선 5 · 묶음마다 카드 4 |
| 묶음 구분 | 선 26 · 간격만 17 · 상자 · 띠 7                                                    |
| 접기      | 있음 24 · 없음 21 · 일부만 4 · 미확인 1                                            |
| 항목      | 체크박스 31 · 글자 링크 8 · 칩 3 · 셀렉트 · 입력칸 3 · 그 밖 5                     |
| 개수 표시 | 없음 30 · 글자 옆 11 · 오른쪽 끝 7 · 그 밖 2                                       |
| 붙어 있음 | 안 붙음 37 · sticky 11 · fixed 2                                                   |

안쪽 간격(최소 · 최빈 · 최대): 사이드바↔결과 10 · 24 · 79, 항목 피치 23.5 · 32 · 94, 체크박스 13 · 20 · 24, 상자→글자 5 · 8 · 16, 제목→첫 항목 0 · 10 · 35, 묶음 사이(선 없음) 8 · 16 · 54, 선 위 0 · 20 · 31, 선 아래 11 · 16 · 21.

디자인 시스템 19곳 시도 · 16곳 셈(미확인 SAP Fiori · Workday Canvas 403). 늘 열린 옆 필터 패널을 글로 다룬 곳은 Carbon · Ant · Salesforce · Material 3 · MOJ 5곳. 숫자는 Salesforce 패널 폭 240 · 320 · 400 · 640, Material 3 side sheet 최대 400 · 가장자리 16 · 안쪽 24. 패널과 결과 사이 간격 · 처음 접힘 · sticky 를 정한 곳은 없다. 모두 지우기 5곳(Carbon · PatternFly · Cloudscape · Garden · MOJ), 고른 칩은 필터 · 검색칸 아래 4곳.

| 곳              | 쪽 · 폭          | 면                                 | 묶음 구분              | 접기 · 처음                                  | 항목 · 체크                                  | 피치 · 상자→글자          | 제목→첫 항목 · 묶음 사이                        |
| --------------- | ---------------- | ---------------------------------- | ---------------------- | -------------------------------------------- | -------------------------------------------- | ------------------------- | ----------------------------------------------- |
| steam           | 오른쪽 310       | 사이드바 면 없음 · 묶음마다 머리 … | 상자(묶음마다 띠 + …   | 띠 눌러 접기(기호… · 2 펼침(가격 · 태그) …   | 체크박스(직접 그린 칸) · 약 13 · 모서리…     | 30 · 약 14(눈…            | 띠 아래 → 첫 줄… · 16(상자 아래 → 다음 띠 …     |
| gog             | 왼쪽 274         | 면 없음                            | 간격만                 | 없음(모두 펼침) · 모두 펼침                  | 체크박스 + 가격 슬라이더… · 16×16 · 모서…    | 37 · 9                    | 8 · 16                                          |
| nintendo        | 왼쪽 330         | 회색 면 rgb(239) 모서리 12…        | 선(1px rgb(21…         | ⌄ 접기 · 첫 묶음(Category)…                  | 체크박스 · 24×24 · 모서…                     | 40 · 16                   | 21 · 선 위 20 · 선 아래 20…                     |
| gmg             | 오른쪽 287       | 면 색 상자 rgb(73,74,79)…          | 선(hr 1px rgb…         | 없음 · 모두 펼침                             | 체크박스 + 가격 슬라이더 · 18×18 · 모서…     | 26 · 5                    | 11 · 선 위 10 · 선 아래 15                      |
| metacritic      | 왼쪽 313         | 면 없음                            | 선(1px, 묶음 위)       | ⌃ 접기 · 모두 펼침(캡처)                     | 체크박스 + 단추 둘(Si… · 24×24 · 모서…       | 32 · 8                    | 17(Platfor… · 선 위 28(마지막 항목 → …          |
| 11st            | 왼쪽 200         | 흰 면(쪽과 같음) + 오른쪽 세로선…  | 선(1px rgb(23…         | ⌃/⌄ 접기 · 배송혜택 접힘 · 할인/적…          | 동그란 체크(체크박스) ·… · 약 18 원(눈)      | 31 · 약 5(눈)             | 5 · 선 위 13 · 선 아래 17…                      |
| 29cm            | 왼쪽 220         | 면 없음 · 위 2px 검은 선(분류…     | 간격만(항목마다 아래 … | 없음 · 모두 펼침                             | 체크박스(오른쪽 끝) · … · 18×18 · 모서…      | 55(눈) … · 해당 없음(…    | 35 · 항목 아래 선 18 · 선 →…                    |
| bestbuy         | 왼쪽 336         | 1px 테두리 상자 rgb(228) …         | 선(1px rgb(22…         | 없음 · 모두 펼침                             | 체크박스 + 분류 링크 +… · 20×20 · 모서…      | 32 · 10                   | 16 · 선 위 24 · 선 아래 16                      |
| dockerhub       | 왼쪽 256         | 면 없음                            | 선(hr 1px rgb…         | 없음 · 모두 펼침                             | 체크박스 · 24×24(MUI …                       | 42 · 9                    | 6 · 선 위 20(Show more…                         |
| nike            | 왼쪽 192         | 흰 면(쪽과 같은 색) · 테두리 없…   | 선(1px rgb(22…         | ⌄ 접기 · 대부분 접힘(Collect…                | 체크박스 + 분류 링크 +… · 20×20 · 모서…      | 미확인(분류… · 6          | 22 · 선 → 다음 제목 12 · 제…                    |
| ultimate-guitar | 왼쪽 216         | 면 없음(감싼 칸 x10 w232 의…       | 간격만                 | 없음 · 모두 펼침                             | 글자 링크 + 오른쪽 개수 · 해당 없음          | 36 · 해당 없음            | 16 · 33(Show All → 다음…                        |
| oricon          | 왼쪽 150         | 면 없음                            | 간격만                 | 없음 · 모두 펼침                             | 글자 링크(굵게) + 아래… · 해당 없음          | 23.5 · 해당 없음          | 제목 상자 아래 →… · 19(마지막 링크 → 다음 제…   |
| itch            | 왼쪽 260         | 회색 면(화면 왼쪽 끝에 붙음, 11…   | 간격만                 | 제목 단추로 접기 · 대부분 펼침 · AI As…      | 글자 링크 · 해당 없음                        | 32 · 해당 없음            | 9(줄상자) · 제… · 23(마지막 링크 줄상자 → …     |
| githubsearch    | 왼쪽 296         | 면 없음 · 오른쪽 1px 세로선(1…     | 선(1px rgba(2…         | 없음 · 모두 펼침                             | 글자 링크(메뉴 줄) + … · 해당 없음           | 32 · 해당 없음            | 12(줄상자) · 선 위 14 · 선 아래 13              |
| modrinth        | 왼쪽 300         | 묶음마다 면 카드 rgb(248) 모…      | 상자(카드 사이 12)     | ⌄ 접기 · 펼침(DOM aria-ex…                   | 체크박스(직접 그린 칸) · 20×20 · 모서…       | 32 · 12                   | 23(제목 → 묶음… · 12(카드 사이)                 |
| huggingface     | 왼쪽 400         | 흰 면(쪽과 같음) + 오른쪽 1px…     | 간격만(Paramete…       | 없음 · 모두 펼침                             | 아이콘 붙은 칩 링크(한 … · 해당 없음         | 34 · 해당 없음            | 20(줄상자 → 첫… · 30                            |
| beatleader      | 오른쪽 400(보이… | 면 색 카드 rgb(26,26,26)…          | 상자(접는 상자마다 1…  | 접는 상자(Mapp… · 모두 접힘                  | 입력칸 · 아이콘 붙은 토… · 해당 없음         | 74(상자)… · 해당 없음     | 29(Sorting… · 24(상자 사이)                     |
| kitsu           | 왼쪽 240         | 면 색 rgb(51,37,50)(쪽보…          | 선(1px rgb(21…         | 없음 · 모두 펼침                             | 범위 슬라이더 · 등급 칩… · 해당 없음         | 해당 없음 · 해당 없음     | 3(제목 줄상자 →… · 선 위 15 · 선 아래 14        |
| otogedb-maimai  | 오른쪽 240       | 면 없음(안쪽 반투명 흰 면 rgba…    | 간격만(셀렉트 사이 1…  | 없음 · 해당 없음                             | 셀렉트 상자(높이 46, … · 해당 없음           | 61 · 해당 없음            | 해당 없음 · 15                                  |
| firefoxaddons   | 왼쪽 461         | 흰 카드(쪽 바탕 회색 rgb(233…      | 간격만                 | 「Filter re… · 펼침                          | 셀렉트 상자(높이 39, … · 해당 없음           | 68(라벨 … · 해당 없음     | 0(라벨 바로 아래… · 8                           |
| tmdb            | 왼쪽 260         | 카드 3개(Sort · Where t…           | 카드 사이 12 · 카…     | 카드 › 접기(ar… · Sort · Where t…            | 라디오 · 체크박스 · 날… · 16×16 · 체크…      | 26 · 8                    | 10 · 선 위 18 · 선 아래 18                      |
| googlefonts     | 왼쪽 320         | 면 색 rgb(248,250,253)…            | 선(Preview 와 …        | ⌃ 접기(aria-… · 대부분 펼침                  | 셀렉트 상자(면 색 · 모… · 해당 없음          | 40 · 해당 없음            | 26(셀렉트) · … · 54(마지막 칩 → 다음 묶음…      |
| fanatical       | 왼쪽 287         | 면 없음                            | 선(1px rgb(51…         | 제목 단추로 접기 · On Sale · Pric…           | 토글 · 가격 라디오(2열… · 미확인(라디오 칸 … | 38(가격 … · 미확인        | 20 · 선 위 20 · 선 아래 16…                     |
| xbox            | 왼쪽 272         | 면 없음                            | 간격만                 | ⌄ 접기 · 모두 접힘(aria-exp…                 | 미확인(모두 접힘 · 11… · 미확인              | 접힌 묶음 … · 미확인      | 미확인 · 20(접힌 제목 줄상자 사이)              |
| ikea            | 왼쪽 264         | 면 없음                            | 선(1px rgb(22…         | ⌄ 접기 · 모두 접힘(aria-exp…                 | 체크박스(오른쪽 끝, 접힌… · 24×24 · 모서…    | 접힌 묶음 … · 해당 없음(… | 미확인 · 선 → 제목 줄상자 12 · …                |
| booking         | 왼쪽 263         | 지도 상자 아래 흰 카드 + 1px …     | 선(hr 1px)             | 없음 · 모두 펼침                             | 체크박스 + 가격 슬라이더… · 20×20 · 모서…    | 30 · 8                    | 4 · 선 위 8 · 선 아래 12                        |
| freesound       | 왼쪽 300         | 면 없음                            | 선(1px rgba(1…         | 없음 · 모두 펼침                             | 글자 링크 + 오른쪽 개수… · 해당 없음         | 30 · 해당 없음            | 8(줄상자 → 첫 … · 선 위 21 · 선 아래 12         |
| envato          | 왼쪽 304         | 면 없음                            | 선(1px rgb(20…         | 없음 · 모두 펼침                             | 체크박스 · 24×24 · 모서…                     | 48 · 8                    | 8 · 선 위 28(Show More…                         |
| classcentral    | 왼쪽 316         | 흰 카드(쪽 바탕 rgb(247)) …        | 간격만                 | details 접기… · 모두 펼침                    | 체크박스 · 18×18 · 모서…                     | 30 · 8                    | 11 · 20                                         |
| unity           | 왼쪽 304         | 면 없음                            | 간격만                 | Categories… · 하위 분류 모두 접힘            | 체크박스(Sale) · 아… · 16×16 · 모서…         | 40(체크)… · 12            | 12 · 40(마지막 체크 줄 → 다음…                  |
| musicnotes      | 왼쪽 253         | 면 없음                            | 선(1px rgb(23…         | ⌃ 접기 · 모두 펼침(aria-exp…                 | 글자 링크 + 오른쪽 개수 · 해당 없음          | 36 · 해당 없음            | 21 · 선 위 17 · 선 아래 11                      |
| mslearn         | 왼쪽 360         | 면 없음                            | 선(묶음 목록 상자 아…  | 묶음은 접기 없음 … · 묶음 모두 펼침 · 하위 … | 체크박스(하위 목록은 ⌄ … · 20×20 · 모서…     | 28 · 8                    | 16(제목 → 묶음… · 선 아래 15(목록 상자 아래…    |
| tower           | 왼쪽 308         | 면 없음                            | 간격만                 | 없음 · 모두 펼침                             | 체크박스(브라우저 기본) … · 13×13 · 모서…    | 26 · 6                    | 9 · 19(항목 → 다음 제목) ·…                     |
| dlsite          | 왼쪽 180         | 1px 테두리 상자 + 맨 위 진한 …     | 상자(묶음마다 회색 띠… | ⌃ 접기 · 모두 펼침                           | 체크박스(회색 체크 표시) · 약 18 · 모서리…   | 24–29(… · 약 5(눈)        | 제목 띠 아래 → … · 미확인(띠가 바로 이어짐, 눈… |
| mercari         | 왼쪽 284(내용…   | 면 없음                            | 선(1px rgb(22…         | ⌄ 접기 · 모두 접힘(aria-exp…                 | 미확인(모두 접힘) · 미확인                   | 접힌 묶음 … · 미확인      | 미확인 · 제목 줄상자 → 선 15 · …                |
| booth           | 왼쪽 176         | 면 없음(쪽 바탕 rgb(241,24…        | 간격만                 | 없음 · 모두 펼침                             | 입력칸 · 셀렉트(높이 4… · 20×20 · 모서…      | 94(라벨 … · 9             | 4(라벨 → 입력칸… · 24(입력칸 아래 → 다음 라…    |
| agoda           | 왼쪽 263         | 면 없음                            | 선(1px rgba(9…         | 없음 · 모두 펼침                             | 체크박스 + 가격 슬라이더… · 20×20 · 모서…    | 32 · 8                    | 11 · 선 위 16 · 선 아래 14                      |
| rakuten         | 왼쪽 208         | 흰 면 + 오른쪽 1px 세로선 rg…      | 선(1px rgb(23…         | 없음 · 모두 펼침                             | 라디오(브라우저 기본) ·… · 13×13 원(브라…    | 26(라디오… · 8            | 12 · 선 위 12 · 선 아래 12                      |
| zappos          | 왼쪽 234         | 면 없음                            | 선(1px rgb(20…         | + 펼침 · 모두 접힘(aria-exp…                 | 미확인(접힘, 펼친 안에 … · 미확인            | 접힌 묶음 … · 미확인      | 미확인 · 제목 + 값 두 줄 아래 → …               |
| ghmarket        | 왼쪽 296         | 흰 면 + 오른쪽 1px 세로선 rg…      | 선(1px rgba(2…         | 단추로 접기(App… · Actions 만 펼침           | 글자 링크(분류) · 해당 없음                  | 32 · 해당 없음            | 13(Actions… · 선 → 다음 제목 14                 |
| artifacthub     | 왼쪽 300         | 흰 카드 + 1px 테두리 rgb(2…        | 간격만                 | 없음 · 모두 펼침                             | 체크박스 · 16×16 · 모서…                     | 32 · 8                    | 17 · 24                                         |
| terraform       | 왼쪽 336         | 흰 카드 + 1px 테두리 rgba(…        | 간격만                 | 없음 · 모두 펼침                             | 체크박스(Tier 는 이름… · 16×16 · 모서…       | 32(Cat… · 8               | 14(Tier) ·… · 미확인                            |
| dell            | 왼쪽 348         | 묶음마다 회색 면 카드 rgb(245…     | 상자(카드 사이 16)     | ⌃ 접기 · 대부분 펼침                         | 체크박스 + 분류 링크 · 미확인(DOM 은 …       | 34 · 미확인               | 20(카드 제목 →… · 16(카드 사이)                 |
| pubmed          | 왼쪽 260         | 면 없음                            | 간격만                 | Additional… · 모두 펼침 · Additi…            | 라디오 · 체크박스 + 연… · 약 18 · 모서리…    | 33(눈) · 약 12(눈…        | 약 18(눈) · 약 30(눈)                           |
| udemy           | 왼쪽 311         | 면 없음                            | 선(1px, 묶음 위)       | ⌃/⌄ 접기 · 위 2 묶음 펼침 · 나머…            | 라디오(별점) · 체크박스 · 16×16 · 체크…      | 38 · 8                    | 24 · 선 위 20(Show more…                        |
| tripcom         | 왼쪽 266         | 흰 카드 · 모서리 8(쪽 바탕 회색…   | 선(1px rgb(21…         | 미확인(aria-e… · 펼침                        | 체크박스(직접 그린 칸, … · 미확인            | 32 · 약 9–11…             | 7 · 선 위 0(마지막 항목 상자 …                  |
| kakaku          | 왼쪽 220         | 회색 면 rgb(245,244,244…           | 상자(묶음마다 진한 띠… | 없음 · 모두 펼침                             | 파란 글자 링크 + 개수 · 해당 없음            | 29 · 해당 없음            | 10(띠 아래 → … · 약 36(마지막 링크 → 다음…      |
| ubisoft         | 왼쪽 240         | 흰 카드(어두운 쪽 바탕 위)         | 선(1px rgb(21…         | 제목 단추로 접기(… · 대부분 펼침             | 체크박스(직접 그린 칸) … · 미확인            | 35 · 미확인(글자…         | 14 · 선 위 12 · 선 아래 17                      |
| eneba           | 왼쪽 220         | 보라 면 rgb(88,37,204)(…           | 선(1px rgb(70…         | 제목 단추(aria… · 펼침                       | 체크박스(직접 그린 칸) … · 미확인            | 34 · 미확인(글자…         | 11 · 선 위 약 31 · 선 아래 …                    |
| kyobo           | 왼쪽 176         | 면 없음 · 맨 위 1px 검은 선        | 선(1px rgb(23…         | ⌃ 접기 · 펼침(aria-expand…                   | 체크박스(회색 체크 칸) … · 약 20(눈)         | 34 · 약 8(글자…           | 16 · 선 위 20 · 선 아래 19                      |

## 다크 서비스 필터 자리(2026-11-05)

사용자가 사이드바를 다크 테마 서비스 기준으로 다시 조사하고, 사이드바를 쓰지 않는 쪽이 더 흔하면 그 시안도 가져오라고 했다. 11-04 의 50곳은 사이드바가 있는 곳만 골라 잰 표본이라, 이번에는 사이드바 유무와 상관없이 다크로 쓰는 목록 쪽을 네 묶음으로 찍었다(Playwright · colorScheme dark · 1440×900). 원본은 `dark/<묶음>/summary.tsv`(37열) · 캡처 · `raw/*.json`, 규칙은 `dark/BRIEF.md`(경로는 `~/noslog-research/desktop-music-list-v2/` 기준).

시도 185곳, 셈 117곳, 그중 다크 91곳. 막힌 곳(Cloudflare · 캡차 · 로그인 벽 · 오류 · 지역 차단 · 목록 아닌 쪽)은 세지 않았고 밝은 화면 26곳은 아래 숫자에서 뺐다.

| 묶음               | 다크 | 사이드바 씀 | 사이드바 없음 |
| ------------------ | ---- | ----------- | ------------- |
| 게임 스토어 · 모드 | 21   | 18          | 3             |
| 음악 · 영상 · 애니 | 18   | 2           | 16            |
| 리듬 · 게임 기록   | 31   | 7           | 24            |
| 마켓 · 디렉터리    | 21   | 11          | 10            |
| 합                 | 91   | 38          | 53            |

필터 자리별(다크 91곳, 두 자리를 같이 쓰면 양쪽에 셈): 왼쪽 사이드바 30 · 위 가로 줄(드롭다운 단추) 25 · 위 가로 줄(칩 · 토글) 17 · 위 펼침 판 11 · 탭만 10 · 필터 없음 9 · 오른쪽 사이드바 8 · 필터 단추 → 서랍 5 · 필터 단추 → 결과 위 판 3.

위 드롭다운 줄을 쓰는 다크 서비스: BeatSaver · Quaver · OTOGE DB · Etterna Online · Cytoid · Synthriderz · op.gg · u.gg · MetaTFT · genshin.gg · Blitz · Maxroll · TFTactics · LoLalytics · Beatport · JustWatch · AniList · Twitch · Audiomack · Framer · GitHub 마켓플레이스 · Fab · Modrinth · Eneba · mod.io · Game Jolt.

캡처를 직접 열어 확인한 곳: BeatSaver · Quaver · osu.direct · Cytoid · Etterna(곡 팩 쪽 `etterna-2.jpg`, 첫 캡처는 404) · sekai.best(닫힘 · 열림) · SDVX INDEX · Modrinth · AniList · Beatport. 나머지는 에이전트 DOM 값 그대로이고 열어 보지 않았다.

디자인 시스템 18곳(원본 `dark/ds/summary.tsv` · `dark/ds/text/`): 위 가로 줄만 권함 7(Atlassian · Primer · Polaris · PatternFly · EUI · Cloudscape · SAP Fiori) · 왼쪽 · 위 둘 다 2(Carbon · Ant) · 위 줄 + 옆 시트 1(Material 3) · 왼쪽 사이드바 2(GOV.UK MOJ · Red Hat) · 옆 패널 2(Salesforce · Workday) · 검색칸 안 · 옆만 3(Fluent 2 · Spectrum · Apple HIG) · 지침 없음 1(Base Web). Ant · PatternFly · Polaris · MOJ 는 필터 수와 가로 자리를 고르는 조건으로 적었다. 필터 문서 안에서 다크를 다룬 곳은 Red Hat 하나다.

레이아웃 · 그리드 가이드 18곳(디자인 시스템 16 + NN/g · Baymard, 원본 `dark/layout/summary.tsv` · `dark/layout/text/`): 12단이 7곳(Carbon 16 · Ant 24, 단 그리드를 쓰지 않는 곳 8), 4px 기본 단위 4곳 · 8px 3곳, 최대 폭은 998–1710 으로 갈리고 제한 없음이 6곳, 사이드바 폭은 200–400 에서 240–320 이 많다. 다크에서 가장 어두운 바탕은 #14–#16 회색이 4곳(Carbon · PatternFly · Ant · Fluent), 남색 기가 3곳(Primer · EUI · Fiori)이다. Baymard 는 쇼핑몰 표본에서 왼쪽 사이드바가 더 흔하고 가로 툴바가 24% 라고 적었다.

시안 판 「필터 자리」(2026-11-05): 서비스 실제 쪽에서 글 · 그림만 NosLog 곡 40개로 바꿔 찍었다(스크립트 `dark/mock/*.mjs`, 사진 `dark/mock/out/`). 안 1 Beatport(위 드롭다운 줄 + 곡 표, 추천) · 안 2 osu.direct(위 칩 줄 펼침) · 안 3 AniList(라벨 드롭다운 줄 + 격자) · 안 4 Modrinth(왼쪽 사이드바). 사용자 선택 대기.

## 다크 서비스 결과 줄(2026-11-06)

악곡 목록 한 줄(그림 · 제목 · 아티스트 · 난이도 숫자)의 모양을 다크 서비스에서 실측했다. headless 1440 · `colorScheme: dark`, DOM 으로 재고 캡처를 열어 확인했다. 원본은 `~/noslog-research/desktop-music-list-v2/row/`(`rhythm/` · `media/` · `etc/` · `ds/` 의 `summary.tsv` 와 캡처).

| 묶음                 | 시도 | counted | 다크 counted |
| -------------------- | ---- | ------- | ------------ |
| 리듬게임 · 게임 기록 | 42   | 24      | 24           |
| 음악 · 미디어        | 43쪽 | 18      | 13           |
| 일반 서비스          | 31   | 16      | 15           |
| 합계                 | 116  | 58      | 52           |

다크 52곳의 줄 구분은 면 24(줄무늬 7 포함) · 선 12 · 없음 9 · 면 + 선 8 이다. 음악 13쪽만 보면 없음 7 · 선 4 · 면 1 · 면 + 선 1 이다. 줄 높이는 리듬게임 가운데값 73.5, 음악은 54–56 이 6쪽으로 가장 많다.

디자인 시스템 8곳(문서 9개): 선이 기본인 곳은 M3 baseline · Carbon(Structured list · Data table) · Ant · Radix, 면은 M3 expressive · Carbon zebra(선택) · Apple macOS, 구분 없음이 기본인 곳은 Primer · Atlassian · Fluent 다. 줄 높이를 숫자로 적은 문서는 M3(56 · 72 · 88) · Carbon 두 문서뿐이고, 다크 전용 지침 글은 없다. Polaris 는 주소가 개요로 넘어가 세지 않았고 Spectrum 은 404 였다.

막힌 곳: Last.fm · RYM · Genius · Discogs · Qobuz · Letterboxd · CurseForge · Product Hunt · Nexus · HLTV · speedrun.com · tracker.gg(봇 확인 · 403), Kamaitachi · Trakt(로그인), YouTube Music · Amazon Music(가입 쪽으로 넘어감). 격자 · 큰 카드만 있는 쪽은 세지 않았다.

### 결과 줄 판

판의 안 네 개는 캡처를 열어 고르고, 첫 줄 칸 위치를 다시 DOM 으로 쟀다(`row/pick/m.mjs`). 사진은 NosLog 결정본에 자리 · 크기만 옮겨 찍었다(`row/pick/css/*.css` · `shot-row.mjs`).

| 안  | 서비스               | 줄                                        | 그림            | 칸                                            |
| --- | -------------------- | ----------------------------------------- | --------------- | --------------------------------------------- |
| 1   | Beatport Top 100     | 면 · 높이 56 · 사이 4 · 안쪽 4 · 모서리 4 | 48 · 그림↔글 8  | 글 14 · 오른쪽 칸 50 피치 70                  |
| 2   | Apple Music 차트     | 면 없음 · 위 선 1 · 높이 54               | 40(왼쪽 7)      | 제목 칸 403 · 아티스트 따로 칸 · 오른쪽 끝 53 |
| 3   | Spotify 플레이리스트 | 구분 없음 · 높이 56 · 좌우 16 · 올리면 면 | 40 · 그림↔글 12 | 제목 16 · 아티스트 14 · 오른쪽 끝 45          |
| 4   | OTOGE DB             | 줄무늬 + 위 선 1 · 높이 75                | 56(왼쪽 10)     | 제목 16 굵게 · 난이도 칸 63                   |

## 다크 서비스 난이도 칸(2026-11-06)

결과 줄은 같은 날 OTOGE DB 자리 · 크기로 정했다(사용자). 그 줄 오른쪽 난이도 숫자 4개의 모양만 다시 실측했다. headless 1440 · 2배 · `colorScheme: dark`. 원본은 `~/noslog-research/desktop-music-list-v2/level/`(`a/` · `b/` · `ds/` 의 `summary.tsv` 와 캡처).

| 묶음                                                                         | 시도 | counted | 다크 counted |
| ---------------------------------------------------------------------------- | ---- | ------- | ------------ |
| 리듬게임 곡 DB · 공식 곡 목록                                                | 52   | 21      | 12           |
| PC · 커뮤니티 리듬게임                                                       | 22   | 17      | 15           |
| 합계(두 묶음에 겹친 V-ARCHIVE · Sekai Viewer · Bestdori · Cytoid 를 한 번만) | 70   | 34      | 23           |

다크 23곳의 레벨 모양은 색 상자 7(OTOGE DB 3쪽 · V-ARCHIVE · chunirec · BeatLeader · SpinShare) · 칩 5(Sekai Viewer · SDVX INDEX · Cytoid · BeatSaver · Quaver) · 막대 3(taiko.wiki · osu! · osu.direct) · 글자만 2(jubeat 공식 · StepMania Online) · 원 2(Bestdori · ADOFAI.gg) · 아이콘 + 숫자 2(Etterna · Chorus Encore) · 테두리 상자 1(SDVX 공식) · 아이콘만 1(Synthriderz) 이다. 없는 난이도는 빈 자리 · 칸 없음 · 회색 칸 + 대시로 나뉘고, 한 곳에 모이지 않는다.

디자인 시스템 10곳(부품 12): 높이는 16–24(DOM), 모서리는 알약(Carbon · Primer · Fluent · M3 Badge)과 2–8 로 갈린다. 색은 대부분 면 + 글자, 테두리 + 글자는 Primer Label · M3 Chip 이다. 다크 지침 글은 Carbon · M3 · Atlassian Badge 3곳, 표 안 숫자 정렬 지침은 없다(Polaris 「표 칸에서는 base 크기」 한 문장뿐).

막힌 곳: Phigros · Rotaeno · Groove Coaster · Arcaea fandom · ongeki-score.net · ScoreSaber(403), rotaeno.wiki.gg(401), Kamaitachi(로그인), musedash.moe · pjsek.ai(목록이 뜨지 않음), Malody(500).

### 난이도 칸 판

| 안  | 서비스             | 모양                                                                                               |
| --- | ------------------ | -------------------------------------------------------------------------------------------------- |
| 1   | OTOGE DB(CHUNITHM) | 상자 55×48 · 모서리 5 · 난이도색 20% 면 · 숫자 17.6 굵게 · 사이 10 · 없는 난이도는 빈 자리         |
| 2   | V-ARCHIVE          | 상자 36×28 · 모서리 10 · 탁한 난이도색 면 · 숫자 16 굵게 · 피치 62 · 없는 난이도는 회색 상자 「-」 |
| 3   | Sekai Viewer       | 알약 높이 24 · 난이도색 꽉 찬 면 · 흰 숫자 13 · 피치 48 · 없는 난이도는 칩 없음                    |
| 4   | taiko.wiki         | 숫자 13 굵게 + 아래 30×5 난이도색 막대 · 칸 30 · 사이 5 · 없는 난이도는 빼고 오른쪽 맞춤           |

사진은 OTOGE 줄 결정본에 난이도 칸만 바꿔 찍었다(`level/pick/css/*.css` · `shot-lv.mjs`).

## 다크 서비스 도구 줄(2026-11-06)

악곡 목록 결과 위 도구 줄(결과 수 · 정렬 · 보기 전환)의 왼쪽→오른쪽 순서를 실측했다. 셋 가운데 둘 이상이 목록 위에 있는 곳만 셌다. headless 1440 · `colorScheme: dark`(다크가 없는 곳은 밝은 화면), DOM 으로 재고 캡처를 열어 확인했다. 원본은 `~/noslog-research/desktop-music-list-v2/toolbar/`(`a/` · `b/` · `ds/` 의 `summary.tsv` 와 캡처).

| 묶음                                     | 시도 | counted | 다크 counted |
| ---------------------------------------- | ---- | ------- | ------------ |
| 리듬게임 · 게임 · 영상 · 음악 · 모드     | 57   | 25      | 18           |
| 개발자 · 디자인 자산 · 커머스 · 카탈로그 | 60   | 20      | 8            |
| 합계                                     | 117  | 45      | 26           |

결과 수와 정렬이 둘 다 있는 38곳에서 결과 수 자리는 아래와 같다.

| 결과 수 자리                        | 곳 수 | 서비스                                                                                                                                                                                                      |
| ----------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 정렬보다 왼쪽(같은 줄 또는 자기 줄) | 28    | Backloggd · PS Store · osu.direct · Fanatical · mod.io · Steam · Steam Workshop · Nintendo · JustWatch · Thunderstore · GitHub · Docker Hub · VS Code · crates.io · pub.dev · RubyGems · 11번가 · 무신사 등 |
| 제목 옆 · 탭 글 안 · 가운데         | 8     | Xbox · itch.io · arcade-songs · Hugging Face · NuGet · Best Buy · Figma · 다나와                                                                                                                            |
| 정렬보다 오른쪽                     | 2     | Quaver · Synthriderz                                                                                                                                                                                        |

정렬은 45곳 가운데 34곳이 오른쪽(줄 끝 또는 보기 전환 바로 앞)이다. 보기 전환이 있는 곳은 대부분 정렬 바로 오른쪽 끝에 붙였다(GOG · AniList · Thunderstore · VNDB · Quaver · 11번가 · 라쿠텐). 결과 수 · 정렬 · 보기를 한 줄에 「결과 수 | 빈칸 | 정렬 · 보기」 로 둔 곳은 11번가다. 검색칸 · 정렬 · 보기를 한 줄에 두고 결과 수를 다음 줄 왼쪽에 둔 곳은 Thunderstore 다.

디자인 시스템 10곳: 글 지침이 있는 곳은 셋뿐이라 근거 약함. PatternFly 는 결과 수를 툴바 끝(오른쪽), Cloudscape 는 표 제목 옆, Polaris ResourceList 예시는 결과 수 왼쪽 · 정렬 오른쪽이다. Ant · Carbon · Atlassian 은 예시 배치만 있고 Primer · Fluent 2 · Material 3 · Spectrum 은 이 주제 지침이 없다.

막힌 곳: Epic · IGDB · SteamDB · Nexus Mods · CurseForge · ScoreSaber · Letterboxd · npm · PyPI · Pexels · ArtStation · Printables · Pixabay · Envato · Newegg · Product Hunt · Unsplash(봇 확인 · 캡차), Freepik · Iconfinder · Adobe Stock · Shutterstock · Etsy · eBay · Amazon · Uniqlo · 오늘의집 · 쿠팡 · Walmart · Target · G마켓 · 네이버쇼핑(403 · 오류 · 접속 제한), osu! 공식(로그인), MyAnimeList · Bandcamp · Chrome 웹 스토어(창에 가림), Metacritic · Humble · Crunchyroll · SoundCloud · 요도바시(쪽이 열리지 않음).

### 도구 줄 판

사진은 결정본(검색칸 48 →8→ 도구 줄 36, OTOGE 줄 · taiko.wiki 난이도 칸)에 자리만 옮겨 찍었다(`toolbar/pick/css/*.css` · `shot-tb.mjs`).

| 안   | 서비스                                                     | 배치                                                                                 |
| ---- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1    | 11번가(같은 순서: Backloggd · mod.io · GitHub · crates.io) | 결과 수 왼쪽 \| 빈칸 \| 정렬 상자 · 보기 전환(오른쪽 끝), 한 줄                      |
| 2    | Thunderstore                                               | 검색칸 · 정렬 · 보기 한 줄(같은 높이) / 다음 줄 왼쪽 결과 수 · 줄↔결과 수↔결과 각 24 |
| 지금 | Quaver(자리) · Modrinth(크기)                              | 정렬 상자 · 보기 전환 왼쪽 \| 빈칸 \| 결과 수 오른쪽 끝                              |

## 다크 서비스 격자 카드(2026-11-07)

악곡 목록 격자 보기 카드 한 장의 모양을 실측했다. 그림 + 글 카드가 2열 이상 격자로 놓인 목록만 셌다. headless 1440 · `colorScheme: dark`(다크가 없는 곳은 밝은 화면), DOM 으로 재고 캡처를 열어 확인했다. 원본은 `~/noslog-research/desktop-music-list-v2/grid/`(`a/` · `b/` · `ds/` 의 `summary.tsv` 와 캡처, 규칙은 `BRIEF.md`).

| 묶음                                      | 시도 | counted | 다크 counted |
| ----------------------------------------- | ---- | ------- | ------------ |
| 리듬게임 · 음악 · 영상 · 애니 · 게임      | 59   | 38      | 30           |
| 커머스 · 앱 마켓 · 디자인 자산 · 카탈로그 | 56   | 30      | 11           |
| 합계                                      | 115  | 68      | 41           |

| 항목             | 많은 순                                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 글 자리          | 그림 아래 57 · 그림 위 겹침 3(Cytoid · Quaver · BeatLeader) · 그림 옆 3 · 그 밖 5                                             |
| 카드 면(다크 41) | 있음 23 · 없음 16(Spotify · Deezer · YouTube · Kick 등, 그중 Spotify · Deezer · YouTube 는 올릴 때만 면) · 그림이 카드 전체 2 |
| 그림 비율        | 1:1 23(리듬게임 · 음악 · 콘솔 상점 · 커머스) · 16:9 13 · 4:3 5 · 세로형 11 · 그 밖                                            |
| 숫자 · 난이도    | 카드 맨 아래 줄 19 · 제목 아래 글 줄 21 · 제목 줄 오른쪽 13 · 그림 위 9 · 그림 바로 아래(제목 위) 4                           |
| 그림 위 배지     | 없음 43 · 왼쪽 위 13 · 오른쪽 위 10 · 아래 구석 7(한 곳에 여럿이면 겹쳐 셈)                                                   |
| 열 수            | 3열 22 · 4열 19 · 5열 10 · 2열 8 · 6열 6 · 7열 이상 3                                                                         |

리듬게임만 보면 난이도 자리가 갈린다. 그림 위 알약(Cytoid · Quaver · BeatLeader), 그림 바로 아래 아이콘 줄(Synthriderz · arcade-songs), 제목 아래 칩(BeatSaver · SpinShare), 카드 아래 칸(SDVX index · osu!), 격자에 난이도 없음(Sekai Viewer · Bestdori).

디자인 시스템 14쪽 가운데 카드 · 격자 지침이 있는 곳은 8곳이다(Material · Carbon · Fluent 2 · Polaris · Ant · Apple HIG · Primer · Cloudscape). M3 는 그림 위 글을 권하지 않고, Carbon Tile 은 그림자를 쓰지 않는다. 다크 예시는 Fluent · Ant · Cloudscape 3곳뿐이다. Atlassian 은 카드 부품이 없고 Spectrum 은 404 였다.

막힌 곳: Discogs · ScoreSaber · Epic · Nexus · CurseForge · Letterboxd · MangaDex · RAWG · Humble · Unsplash · Pexels · ArtStation · Creative Market · ThemeForest · Printables · 오늘의집 · Freepik · CodePen · Shadertoy · Etsy · eBay · Thingiverse(403 · 캡차 · 오류), Mercari · Crunchyroll · Disney+(목록이 뜨지 않음). 격자가 아닌 곳(Steam · Amazon · Beatport · Netflix 등)은 세지 않았다.

### 격자 카드 판

사진은 결정본(PF-E 사이드바 · 도구 줄 · 4열 / 촘촘 5열)에 카드 자리 · 크기만 옮겨 찍었다(`grid/pick/css/*.css` · `shot-g.mjs`). 색 · 글자 · 난이도 숫자 부품은 지금 그대로다. 그림 위 겹침(Cytoid 등)은 자켓을 넓게 잘라야 해서 지금보다 자켓이 덜 보이므로 안에서 뺐다.

| 안      | 서비스                                             | 카드                                                                                                   |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1(거둠) | Deezer(같은 무리 Spotify · Apple Music · Bandcamp) | 면 없음 · 칸 안쪽 9(그림 사이 18) · 그림 둥근 모서리 · 제목 · 아티스트 · 아래 줄 숫자 · 올리면 칸에 면 |
| 2       | Synthriderz                                        | 면 · 모서리 8 · 사이 14 · 그림 위에 붙음 · 그림 바로 아래 난이도 줄 · 제목 · 아티스트                  |
| 지금    | Thunderstore · GOG · mod.io 와 같은 무리           | 면 · 그림 위에 붙음 · 제목 · 아티스트 · 맨 아래 숫자 줄                                                |

## 다크 서비스 목록 ↔ 격자 전환(2026-11-07)

격자 카드 첫 판(위 「격자 카드 판」)은 사용자가 목록 보기와도, 옮긴 서비스와도 너무 다르다고 해서 거뒀다. 그래서 한 서비스 안에 목록과 격자 보기가 둘 다 있는 곳을 찾아, 같은 첫 항목이 두 보기에서 어떻게 생겼는지 나란히 찍었다. headless 1440 · `colorScheme: dark`, DOM 으로 재고 캡처를 열어 확인했다. 원본은 `~/noslog-research/desktop-music-list-v2/grid2/`(`a/` · `b/` · `ds/` 의 `summary.tsv` 와 캡처, 규칙은 `BRIEF.md`).

| 묶음                                 | 시도 | 전환 있음(counted) | 다크 counted |
| ------------------------------------ | ---- | ------------------ | ------------ |
| 리듬게임 · 음악 · 게임 · 애니        | 84   | 15                 | 13           |
| 커머스 · 개발자 · 디자인 자산 · 글꼴 | 110  | 16                 | 2            |
| 합계                                 | 194  | 31                 | 15           |

다크 counted 15곳은 Modrinth · Quaver · GOG · Thunderstore · VNDB · AniList · BeatLeader · Sekai Viewer · Bestdori · MangaUpdates · AnimeSchedule · aniSearch · Spotify · Google Fonts · OpenSea 다.

두 보기에서 같게 두는 것은 묶음마다 따로 셌다(묶음 b 는 제목 크기 · 굵기를 함께만 셈).

| 항목          | 리듬게임 · 음악 · 게임 · 애니(15)                                     | 커머스 · 개발자 · 글꼴(16)                                                      |
| ------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 제목          | 크기 · 굵기 같음 5 · 굵기만 같음 6 · 굵기 다름 2 · 격자에 제목 없음 2 | 크기 · 굵기 같음 7 · 다름 9                                                     |
| 숫자 · 난이도 | 같은 부품 8 · 모양 바뀜 1 · 격자에서 빠지거나 올릴 때만 5 · 없음 1    | 같은 부품 6 · 다름 5 · 미확인 2 · 없음 3                                        |
| 면            | 같은 면 5 · 둘 다 없음 4 · 다름 5 · 미확인 1                          | 같음 4 · 목록 선 · 무면 → 격자 면 카드 6 · 목록 면 → 격자 무면 2 · 둘 다 없음 4 |

격자 카드는 그림이 있는 29곳 가운데 23곳이 글을 그림 아래에 둔다(나머지는 그림 위 겹침 4 · 옆 1 · 평소 글 없음 1). 목록 오른쪽 열에 있던 숫자를 격자에서는 글 묶음 안이나 카드 맨 아래 줄로 옮긴다(다나와 · Staples · 롯데ON · 에누리 · Thomann · Overclockers · AbeBooks 7곳, Modrinth). Thunderstore 는 목록 줄의 부품(제목 18/700 · 작성자 · 분류 알약 · 숫자 줄 · 모서리 8)을 그대로 그림 아래에 쌓는다.

목록 결정의 출처는 따로 봤다. OTOGE DB 는 보기 전환이 없고 곡 표만 있다(줄 75 · 자켓 56 · 제목 16/700 · 난이도 상자). taiko.wiki 곡 찾기는 처음부터 2열 카드 격자인데 자켓이 없다(카드 525×90 · 면 · 모서리 5 · 안쪽 15 · 위에 장르 색 막대 36×7 · 제목 15/700 · 오른쪽 아래 숫자 13/700 + 색 막대 30×5). Modrinth 는 단추 하나로 목록 ↔ 격자를 바꾸고, 격자 카드는 같은 면 · 테두리 · 모서리 16 에 위 갤러리 그림, 숫자는 카드 맨 아래 줄로 옮긴다.

디자인 시스템 13곳 가운데 목록 ↔ 격자 지침이 있는 곳은 6곳이다. Cloudscape(표 ↔ 카드를 사용자 설정으로, 같은 설정 · 같은 동작), WinUI(ListView ↔ GridView 는 같은 기능에 표시만 다르게), PatternFly(카드 ↔ 표 전환은 토글 묶음), Material 3(폭에 따라 카드 ↔ 목록, 부품 고유 요소는 그대로), Apple HIG(레이아웃은 명시적 동작에만 바꿈), Ant Design(같은 renderItem 에 grid 만). Carbon · Fluent 2 · Primer 는 지침이 없다.

막힌 곳: Anime-Planet · MangaDex · Letterboxd · IMDb · CurseForge · Nexus · Discogs · SteamDB · VGMdb · Last.fm · Etsy · eBay · Newegg · npm · Amazon · Behance · Adobe Stock · 쿠팡 · G마켓(403 · 사람 확인), Jellyfin · Trakt(로그인), RAWG · Humble(오류). 전환이 없는 곳(osu! · Steam 창작마당 · Backloggd · Figma Community · Dribbble · VS Code Marketplace · Docker Hub · 무신사 등)은 세지 않았다.

## 채보 뷰어

사용자가 이 표를 폐기했다(2026-11-02). 근거로 쓰지 않고, 새 기록은 맨 아래 「채보 뷰어(다시 시작)」 에 있다.

표본 134건 · 세는 곳 53건

| 곳               | URL                                                                                                                                  | 잰 값                                                                  | 눈으로 본 뼈대                                     | 캡처                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------------------------------------- | --------------------------- |
| youtube          | https://www.youtube.com/watch?v=dQw4w9WgXcQ                                                                                          | 내용 16–1424 · aside 16+996,205+22 · 표 폭 478 · 열 3 · 미디어 996×560 | 무대 996 · 오른쪽 396 · 제목 · 의견 아래           | viewer/youtube.jpg          |
| vimeo            | https://vimeo.com/76979871                                                                                                           | 내용 25–647                                                            | 막힘 · 세지 않음                                   | viewer/vimeo.jpg            |
| twitch           | https://www.twitch.tv/riotgames                                                                                                      | 내용 4–1191 · aside 0+240 · 미디어 533×300                             | 왼쪽 목록 · 무대                                   | viewer/twitch.jpg           |
| bilibili         | https://www.bilibili.com/video/BV1GJ411x7h7                                                                                          | 내용 60–1380                                                           | 막힘 · 세지 않음                                   | viewer/bilibili.jpg         |
| niconico         | https://www.nicovideo.jp/watch/sm9                                                                                                   | 내용 24–1416 · 미디어 928×522                                          | 무대 928×522 · 오른쪽 440 · 입력 줄 무대 바로 아래 | viewer/niconico.jpg         |
| ted              | https://www.ted.com/talks/ken_robinson_do_schools_kill_creativity                                                                    | 내용 24–1360 · aside 64+776,840+536                                    | 무대 776 · 오른쪽 472                              | viewer/ted.jpg              |
| dailymotion      | https://www.dailymotion.com/video/x5e9eog                                                                                            | 내용 12–1403 · 미디어 699×393                                          | 막힘 · 세지 않음                                   | viewer/dailymotion.jpg      |
| archiveorg       | https://archive.org/details/BigBuckBunny_124                                                                                         | 내용 195–1362                                                          | 전폭 무대 · 아래 정보                              | viewer/archiveorg.jpg       |
| tubi             | https://tubitv.com/movies/100002706                                                                                                  | 내용 0–1440                                                            | 막힘 · 세지 않음                                   | viewer/tubi.jpg             |
| tiktok           | https://www.tiktok.com/@tiktok/video/7106594312292453675                                                                             | 내용 16–908 · 미디어 488×868                                           | 세로 무대 · 오른쪽 의견                            | viewer/tiktok.jpg           |
| soundcloud       | https://soundcloud.com/forss/flickermood                                                                                             |                                                                        | 막힘 · 세지 않음                                   | viewer/soundcloud.jpg       |
| bandcamp         | https://c418.bandcamp.com/track/sweden                                                                                               | 내용 248–1178 · 표 폭 376 · 열 2                                       | 막힘 · 세지 않음                                   | viewer/bandcamp.jpg         |
| applepodcasts    | https://podcasts.apple.com/us/podcast/the-daily/id1200361736                                                                         | 내용 20–1400                                                           | 막힘 · 세지 않음                                   | viewer/applepodcasts.jpg    |
| spotifyepisode   | https://open.spotify.com/show/2MAi0BvDc6GTFvKFPXnkCL                                                                                 | 내용 23–1368 · aside 8+1424,1400+331                                   | 막힘 · 세지 않음                                   | viewer/spotifyepisode.jpg   |
| songsterr        | https://www.songsterr.com/a/wsa/metallica-one-tab-s444                                                                               | 내용 118–948 · aside 1065+360                                          | 전폭 악보 · 아래 조작                              | viewer/songsterr.jpg        |
| ultimateguitar   | https://tabs.ultimate-guitar.com/tab/oasis/wonderwall-chords-39144                                                                   | 내용 18–1410                                                           | 왼쪽 메뉴 · 악보 · 오른쪽 코드                     | viewer/ultimateguitar.jpg   |
| musescore        | https://musescore.com/user/16006641/scores/4197961                                                                                   | 내용 264–1176                                                          | 막힘 · 세지 않음                                   | viewer/musescore.jpg        |
| soundslice       | https://www.soundslice.com/                                                                                                          | 내용 240–1187 · 미디어 274×487                                         | 막힘 · 세지 않음                                   | viewer/soundslice.jpg       |
| flat             | https://flat.io/explore                                                                                                              |                                                                        | 막힘 · 세지 않음                                   | viewer/flat.jpg             |
| imslp            | https://imslp.org/wiki/Moonlight_Sonata_(Beethoven,_Ludwig_van)                                                                      | 내용 150–1290                                                          | 막힘 · 세지 않음                                   | viewer/imslp.jpg            |
| chordify         | https://chordify.net/chords/rick-astley-never-gonna-give-you-up-official-video-rickastleyvevo                                        | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/chordify.jpg         |
| hooktheory       | https://www.hooktheory.com/theorytab/view/oasis/wonderwall                                                                           | 내용 50–1355 · aside 1092+280 · 표 폭 950 · 열 3 · 미디어 280×200      | 머리 · 플레이어 1000 · 오른쪽 수치 280             | viewer/hooktheory.jpg       |
| bitmidi          | https://bitmidi.com/fur-elise-mid                                                                                                    | 내용 352–1088 · 미디어 1005×270                                        | 막힘 · 세지 않음                                   | viewer/bitmidi.jpg          |
| onlinesequencer  | https://onlinesequencer.net/1000                                                                                                     | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/onlinesequencer.jpg  |
| sightread        | https://sightread.dev/play                                                                                                           | 내용 112–910 · 표 폭 510 · 열 4 · 미디어 894×406                       | 막힘 · 세지 않음                                   | viewer/sightread.jpg        |
| sekaiviewer      | https://sekai.best/music/1                                                                                                           | 내용 8–1053                                                            | 자켓 · 재생                                        | viewer/sekaiviewer.jpg      |
| sdvxin           | https://sdvx.in/                                                                                                                     | 내용 516–954 · 표 폭 270 · 열 9 · 미디어 728×106                       | 막힘 · 세지 않음                                   | viewer/sdvxin.jpg           |
| textage          | https://textage.cc/score/                                                                                                            | 내용 8–1432 · 표 폭 818 · 열 12                                        | 막힘 · 세지 않음                                   | viewer/textage.jpg          |
| arcviewer        | https://allpoland.github.io/ArcViewer/?id=25f                                                                                        | 미디어 1440×900                                                        | 막힘 · 세지 않음                                   | viewer/arcviewer.jpg        |
| beatsaver        | https://beatsaver.com/maps/25f                                                                                                       | 내용 72–1368 · 표 폭 856 · 열 7                                        | 막힘 · 세지 않음                                   | viewer/beatsaver.jpg        |
| osu              | https://osu.ppy.sh/beatmapsets/39804#osu/129891                                                                                      | 내용 253–1180 · 표 폭 245 · 열 3                                       | 머리 안 미리듣기                                   | viewer/osu.jpg              |
| cytoid           | https://cytoid.io/levels                                                                                                             | 내용 48–1392                                                           | 막힘 · 세지 않음                                   | viewer/cytoid.jpg           |
| bemuse           | https://bemuse.ninja/                                                                                                                | 내용 9–1431                                                            | 막힘 · 세지 않음                                   | viewer/bemuse.jpg           |
| lichessanalysis  | https://lichess.org/analysis                                                                                                         | 내용 0–59 · aside 14+350                                               | 보드 · 오른쪽 목록                                 | viewer/lichessanalysis.jpg  |
| lichesstv        | https://lichess.org/tv                                                                                                               | 내용 0–1372 · aside 14+346,14+336                                      | 왼쪽 346 · 보드 698 · 오른쪽                       | viewer/lichesstv.jpg        |
| chesscomanalysis | https://www.chess.com/analysis                                                                                                       | 내용 8–1090                                                            | 막힘 · 세지 않음                                   | viewer/chesscomanalysis.jpg |
| showdownreplay   | https://replay.pokemonshowdown.com/                                                                                                  | 내용 320–1120                                                          | 막힘 · 세지 않음                                   | viewer/showdownreplay.jpg   |
| shadertoy        | https://www.shadertoy.com/view/MdX3Rr                                                                                                | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/shadertoy.jpg        |
| sketchfab        | https://sketchfab.com/3d-models/the-great-drawing-room-feb9ad17e042418c8e759b81e3b2e5d7                                              | 내용 30–1310 · 미디어 895×501                                          | 뷰어 895 · 오른쪽 455                              | viewer/sketchfab.jpg        |
| scratch          | https://scratch.mit.edu/projects/10128407/                                                                                           | 내용 249–1176 · 미디어 480×360                                         | 무대 480 · 오른쪽 안내 · 아래 의견                 | viewer/scratch.jpg          |
| codepen          | https://codepen.io/ge1doot/pen/vRJyVG                                                                                                | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/codepen.jpg          |
| crazygames       | https://www.crazygames.com/game/slope                                                                                                | 내용 0–1424                                                            | 막힘 · 세지 않음                                   | viewer/crazygames.jpg       |
| newgrounds       | https://www.newgrounds.com/portal/view/59593                                                                                         | 내용 231–1205 · 미디어 550×400                                         | 무대 550 · 아래 2열                                | viewer/newgrounds.jpg       |
| itch             | https://maddymakesgames.itch.io/celeste-classic                                                                                      | 내용 420–1020                                                          | 막힘 · 세지 않음                                   | viewer/itch.jpg             |
| poki             | https://poki.com/en/g/subway-surfers                                                                                                 | 내용 68–1372 · 표 폭 1036 · 열 2 · 미디어 836×470                      | 가운데 게임 · 둘레 목록                            | viewer/poki.jpg             |
| openprocessing   | https://openprocessing.org/sketch/2060000                                                                                            | 내용 497–943                                                           | 막힘 · 세지 않음                                   | viewer/openprocessing.jpg   |
| khan             | https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:foundation-algebra/x2f8bb11595b61c86:intro-variables/v/what-is-a-variable | 내용 18–1423 · aside 0+1440 · 미디어 927×521                           | 막힘 · 세지 않음                                   | viewer/khan.jpg             |
| ocw              | https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/                   | 내용 42–1398 · 미디어 804×452                                          | 왼쪽 메뉴 · 영상 · 오른쪽                          | viewer/ocw.jpg              |
| wistia           | https://wistia.com/series/one-ten-one-hundred/episode/1                                                                              | 내용 176–1392                                                          | 막힘 · 세지 않음                                   | viewer/wistia.jpg           |
| navertv          | https://tv.naver.com/                                                                                                                | 내용 350–1090                                                          | 막힘 · 세지 않음                                   | viewer/navertv.jpg          |
| chzzk            | https://chzzk.naver.com/                                                                                                             | 내용 20–1420 · aside 0+240 · 미디어 780×439                            | 막힘 · 세지 않음                                   | viewer/chzzk.jpg            |
| soop             | https://www.sooplive.co.kr/                                                                                                          | 내용 20–1410 · 미디어 802×451                                          | 막힘 · 세지 않음                                   | viewer/soop.jpg             |
| kick             | https://kick.com/                                                                                                                    | 내용 8–1400 · aside 1040+360 · 미디어 732×412                          | 막힘 · 세지 않음                                   | viewer/kick.jpg             |
| genius           | https://genius.com/Queen-bohemian-rhapsody-lyrics                                                                                    | 내용 370–1070                                                          | 막힘 · 세지 않음                                   | viewer/genius.jpg           |
| desmos           | https://www.desmos.com/calculator                                                                                                    | aside 89+270 · 미디어 992×854                                          | 왼쪽 목록 · 캔버스                                 | viewer/desmos.jpg           |
| geogebra         | https://www.geogebra.org/m/xaYqyJTk                                                                                                  | 내용 112–1328                                                          | 막힘 · 세지 않음                                   | viewer/geogebra.jpg         |
| twitchvod        | https://www.twitch.tv/videos/2000000000                                                                                              | 내용 4–1040 · aside 0+240                                              | 막힘 · 세지 않음                                   | viewer/twitchvod.jpg        |
| kickchannel      | https://kick.com/xqc                                                                                                                 | 내용 8–1414                                                            | 무대 · 오른쪽 채팅 360                             | viewer/kickchannel.jpg      |
| chzzkcat         | https://chzzk.naver.com/video/1                                                                                                      | 내용 20–957 · aside 0+240                                              | 막힘 · 세지 않음                                   | viewer/chzzkcat.jpg         |
| soopvod          | https://vod.sooplive.co.kr/player/100000000                                                                                          | 내용 421–1408 · 미디어 1440×900                                        | 무대 · 오른쪽 목록                                 | viewer/soopvod.jpg          |
| bilibili2        | https://www.bilibili.com/video/BV1xx411c7mD                                                                                          | 내용 41–1399 · 미디어 978×550                                          | 무대 · 오른쪽 목록                                 | viewer/bilibili2.jpg        |
| odysee           | https://odysee.com/@veritasium:f/why-minds-can%27t-think-in-4d:1                                                                     | 내용 327–1098                                                          | 막힘 · 세지 않음                                   | viewer/odysee.jpg           |
| peertube         | https://framatube.org/w/9c9de5e8-0a1e-484a-b099-e80766180a6d                                                                         | 내용 32–1374 · 미디어 1054×594                                         | 왼쪽 메뉴 · 무대 · 아래 정보                       | viewer/peertube.jpg         |
| rumble           | https://rumble.com/videos                                                                                                            | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/rumble.jpg           |
| coursera         | https://www.coursera.org/learn/machine-learning/lecture/iYR2y/welcome-to-machine-learning                                            | 내용 470–970                                                           | 막힘 · 세지 않음                                   | viewer/coursera.jpg         |
| edx              | https://www.edx.org/learn/computer-programming/harvard-university-cs50-s-introduction-to-computer-science                            | 내용 96–1344                                                           | 막힘 · 세지 않음                                   | viewer/edx.jpg              |
| plutotv          | https://pluto.tv/us/on-demand/movies/                                                                                                | 내용 501–939                                                           | 막힘 · 세지 않음                                   | viewer/plutotv.jpg          |
| streamable       | https://streamable.com/moo                                                                                                           | 내용 168–1272                                                          | 가운데 무대                                        | viewer/streamable.jpg       |
| imgurvideo       | https://imgur.com/gallery/rick-astley-never-gonna-give-you-up-4k-remaster-WIsAtOo                                                    | 내용 40–1391 · 미디어 298×274                                          | 막힘 · 세지 않음                                   | viewer/imgurvideo.jpg       |
| mixcloud         | https://www.mixcloud.com/spartacus/party-time/                                                                                       | 내용 24–1392 · aside 1092+300                                          | 막힘 · 세지 않음                                   | viewer/mixcloud.jpg         |
| audiomack        | https://audiomack.com/song/lil-uzi-vert/xo-tour-llif3                                                                                | 내용 24–1392 · aside 24+328                                            | 왼쪽 메뉴 · 플레이어                               | viewer/audiomack.jpg        |
| lichessgame      | https://lichess.org/broadcast                                                                                                        | 내용 0–1320 · aside 70+189                                             | 막힘 · 세지 않음                                   | viewer/lichessgame.jpg      |
| chessgames       | https://www.chessgames.com/perl/chessgame?gid=1011478                                                                                | 내용 8–1432                                                            | 막힘 · 세지 않음                                   | viewer/chessgames.jpg       |
| ogs              | https://online-go.com/game/1                                                                                                         | 내용 1036–1434 · 표 폭 400 · 열 6                                      | 보드 · 오른쪽 판                                   | viewer/ogs.jpg              |
| gamejolt         | https://gamejolt.com/games/fnaf/11001                                                                                                | 내용 155–1285                                                          | 막힘 · 세지 않음                                   | viewer/gamejolt.jpg         |
| kongregate       | https://www.kongregate.com/games/ArmorGames/sugar-sugar                                                                              | 내용 12–1387 · aside 0+64                                              | 막힘 · 세지 않음                                   | viewer/kongregate.jpg       |
| armorgames       | https://armorgames.com/fancy-pants-adventure-world-3-game/553                                                                        | 내용 256–933 · 표 폭 70 · 열 2                                         | 막힘 · 세지 않음                                   | viewer/armorgames.jpg       |
| y8               | https://www.y8.com/games/fireboy_and_watergirl_the_forest_temple                                                                     | 내용 35–1405 · 미디어 300×150                                          | 막힘 · 세지 않음                                   | viewer/y8.jpg               |
| threejs          | https://threejs.org/examples/#webgl_animation_keyframes                                                                              | 내용 16–1424 · 미디어 1440×900                                         | 왼쪽 목록 · 전폭 캔버스                            | viewer/threejs.jpg          |
| observable       | https://observablehq.com/@d3/bar-chart-race                                                                                          | aside 0+1384,0+1384,1384+56 · 미디어 1384×6557                         | 문서 안 그래프                                     | viewer/observable.jpg       |
| phet             | https://phet.colorado.edu/en/simulations/wave-on-a-string                                                                            | 내용 50–1390                                                           | 무대 · 아래 탭                                     | viewer/phet.jpg             |
| geogebraclassic  | https://www.geogebra.org/classic                                                                                                     | 내용 0–1440 · 미디어 1052×626                                          | 왼쪽 목록 · 캔버스                                 | viewer/geogebraclassic.jpg  |
| echords          | https://www.e-chords.com/chords/oasis/wonderwall                                                                                     | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/echords.jpg          |
| chordie          | https://www.chordie.com/chord.pere/www.ultimate-guitar.com/tabs/o/oasis/wonderwall_crd.htm                                           | 내용 15–1155 · 미디어 1005×270                                         | 막힘 · 세지 않음                                   | viewer/chordie.jpg          |
| sdvxchunithm     | https://sdvx.in/chunithm/sort/13.htm                                                                                                 | 내용 485–955 · 표 폭 270 · 열 9 · 미디어 728×106                       | 막힘 · 세지 않음                                   | viewer/sdvxchunithm.jpg     |
| textagescore     | https://textage.cc/score/7/a_amuro.html?1AC00                                                                                        | 내용 12–1424 · 표 폭 3274 · 열 12                                      | 전폭 채보 다열                                     | viewer/textagescore.jpg     |
| flat2            | https://flat.io/explore                                                                                                              |                                                                        | 막힘 · 세지 않음                                   | viewer/flat2.jpg            |
| noteflight       | https://www.noteflight.com/                                                                                                          | 내용 183–1400                                                          | 막힘 · 세지 않음                                   | viewer/noteflight.jpg       |
| bsaberviewer     | https://skystudioapps.com/bs-viewer/?id=25f                                                                                          | 내용 76–1435 · 미디어 1440×900                                         | 전체 화면 뷰어                                     | viewer/bsaberviewer.jpg     |
| crazygames2      | https://www.crazygames.com/game/moto-x3m                                                                                             | 내용 0–1423 · 미디어 984×554                                           | 왼쪽 메뉴 · 무대 · 오른쪽 목록                     | viewer/crazygames2.jpg      |
| newgroundsaudio  | https://www.newgrounds.com/audio/listen/1                                                                                            | 내용 231–1205 · 미디어 632×128                                         | 막힘 · 세지 않음                                   | viewer/newgroundsaudio.jpg  |
| tedplayer        | https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator                                                       | 내용 24–1360 · aside 64+776,840+536                                    | 막힘 · 세지 않음                                   | viewer/tedplayer.jpg        |
| viki             | https://www.viki.com/tv/37350c-crash-landing-on-you                                                                                  | 내용 881–930                                                           | 막힘 · 세지 않음                                   | viewer/viki.jpg             |
| veoh             | https://www.veoh.com/                                                                                                                |                                                                        | 막힘 · 세지 않음                                   | viewer/veoh.jpg             |
| bitchute         | https://www.bitchute.com/                                                                                                            | 내용 190–1249                                                          | 막힘 · 세지 않음                                   | viewer/bitchute.jpg         |
| jamendo          | https://www.jamendo.com/track/1886257/                                                                                               | 내용 16–1408                                                           | 왼쪽 메뉴 · 머리 · 탭                              | viewer/jamendo.jpg          |
| hearthis         | https://hearthis.at/                                                                                                                 | 내용 23–1329 · aside 15+220                                            | 막힘 · 세지 않음                                   | viewer/hearthis.jpg         |
| musicnotes       | https://www.musicnotes.com/sheetmusic/mtd.asp?ppn=MN0041491                                                                          | 내용 272–1168                                                          | 막힘 · 세지 않음                                   | viewer/musicnotes.jpg       |
| 8notes           | https://www.8notes.com/scores/1110.asp                                                                                               | 내용 49–1350 · 미디어 950×1229                                         | 위 조작 · 악보                                     | viewer/8notes.jpg           |
| guitaretab       | https://www.guitaretab.com/o/oasis/                                                                                                  | 내용 186–1246 · 표 폭 400 · 열 3 · 미디어 300×250                      | 막힘 · 세지 않음                                   | viewer/guitaretab.jpg       |
| chessgameview    | https://www.chess.com/games/view/15752135                                                                                            | 내용 8–1424                                                            | 왼쪽 메뉴 · 보드 · 오른쪽                          | viewer/chessgameview.jpg    |
| lichesspractice  | https://lichess.org/practice                                                                                                         | 내용 0–1370 · aside 70+242                                             | 막힘 · 세지 않음                                   | viewer/lichesspractice.jpg  |
| lichessopening   | https://lichess.org/opening                                                                                                          | 내용 0–1320                                                            | 막힘 · 세지 않음                                   | viewer/lichessopening.jpg   |
| chesstempo       | https://chesstempo.com/game-database/                                                                                                | 내용 243–1197                                                          | 막힘 · 세지 않음                                   | viewer/chesstempo.jpg       |
| falstad          | https://www.falstad.com/circuit/circuitjs.html                                                                                       | 내용 1274–1440 · 표 폭 375 · 열 7 · 미디어 1274×830                    | 캔버스 · 오른쪽 조작                               | viewer/falstad.jpg          |
| p5editor         | https://editor.p5js.org/                                                                                                             | 내용 25–1440 · 미디어 706×718                                          | 막힘 · 세지 않음                                   | viewer/p5editor.jpg         |
| babylon          | https://playground.babylonjs.com/                                                                                                    | 내용 1261–1355 · 미디어 717×810                                        | 코드 · 캔버스                                      | viewer/babylon.jpg          |
| playcanvas       | https://playcanvas.com/project/1                                                                                                     | 내용 480–960 · 미디어 300×150                                          | 막힘 · 세지 않음                                   | viewer/playcanvas.jpg       |
| gltfviewer       | https://gltf-viewer.donmccurdy.com/                                                                                                  | 내용 502–1434                                                          | 막힘 · 세지 않음                                   | viewer/gltfviewer.jpg       |
| openstreetmap    | https://www.openstreetmap.org/                                                                                                       | 내용 16–1440                                                           | 막힘 · 세지 않음                                   | viewer/openstreetmap.jpg    |
| excalidraw       | https://excalidraw.com/                                                                                                              | 내용 570–870 · 미디어 1440×900                                         | 전체 캔버스                                        | viewer/excalidraw.jpg       |
| photopea         | https://www.photopea.com/                                                                                                            | 내용 29–1411 · 미디어 440×440                                          | 막힘 · 세지 않음                                   | viewer/photopea.jpg         |
| dailymotion2     | https://www.dailymotion.com/video/x7tgad0                                                                                            | 내용 12–1403 · 미디어 699×393                                          | 막힘 · 세지 않음                                   | viewer/dailymotion2.jpg     |
| cspan            | https://www.c-span.org/video/?c4932322/                                                                                              | 내용 0–1368 · 미디어 860×484                                           | 무대 · 오른쪽                                      | viewer/cspan.jpg            |
| arte             | https://www.arte.tv/en/videos/most-viewed/                                                                                           | 내용 32–1408                                                           | 막힘 · 세지 않음                                   | viewer/arte.jpg             |
| pbs              | https://www.pbs.org/video/                                                                                                           | 내용 0–1440                                                            | 막힘 · 세지 않음                                   | viewer/pbs.jpg              |
| tunein           | https://tunein.com/radio/BBC-World-Service-s24948/                                                                                   | 내용 0–1020                                                            | 막힘 · 세지 않음                                   | viewer/tunein.jpg           |
| beepbox          | https://www.beepbox.co/                                                                                                              | 내용 365–1075                                                          | 가운데 악보 · 오른쪽 조작                          | viewer/beepbox.jpg          |
| songmaker        | https://musiclab.chromeexperiments.com/Song-Maker/                                                                                   | 내용 0–1440 · 미디어 1440×590                                          | 전폭 격자 · 아래 조작                              | viewer/songmaker.jpg        |
| virtualpiano     | https://virtualpiano.net/                                                                                                            | 내용 26–1232 · aside 1262+158,26+352,1062+352                          | 막힘 · 세지 않음                                   | viewer/virtualpiano.jpg     |
| signalmidi       | https://signalmidi.app/edit                                                                                                          | 내용 64–1439 · 미디어 1440×422                                         | 전폭 피아노 롤 · 아래 조작                         | viewer/signalmidi.jpg       |
| wokwi            | https://wokwi.com/projects/305569599398609473                                                                                        |                                                                        | 코드 · 오른쪽 시뮬                                 | viewer/wokwi.jpg            |
| coolmath         | https://www.coolmathgames.com/0-run-3                                                                                                | 내용 240–1424 · 미디어 320×186                                         | 막힘 · 세지 않음                                   | viewer/coolmath.jpg         |
| silvergames      | https://www.silvergames.com/en/slope                                                                                                 | 내용 14–1426 · 미디어 1144×720                                         | 가운데 게임 · 둘레 목록                            | viewer/silvergames.jpg      |
| twoplayer        | https://www.twoplayergames.org/game/basket-random                                                                                    | 내용 245–1195 · 미디어 950×534                                         | 가운데 게임 · 아래 목록                            | viewer/twoplayer.jpg        |
| miniclip         | https://www.miniclip.com/games/8-ball-pool-multiplayer/en/                                                                           | 내용 32–1408 · 미디어 900×600                                          | 가운데 게임                                        | viewer/miniclip.jpg         |
| glslsandbox      | https://glslsandbox.com/e#109000.0                                                                                                   | 미디어 1440×900                                                        | 막힘 · 세지 않음                                   | viewer/glslsandbox.jpg      |
| chordu           | https://chordu.com/chords-tabs-wonderwall-oasis-id_bx1Bh8ZvH84                                                                       | 내용 10–454                                                            | 영상 · 오른쪽 코드 · 아래 다이어그램               | viewer/chordu.jpg           |
| tinkercad        | https://www.tinkercad.com/things/fyIHDVrlRcQ                                                                                         | 내용 420–1020                                                          | 막힘 · 세지 않음                                   | viewer/tinkercad.jpg        |
| tfplayground     | https://playground.tensorflow.org/                                                                                                   | 내용 85–1315 · 미디어 260×260                                          | 전체 캔버스 · 여러 열                              | viewer/tfplayground.jpg     |
| tsplayground     | https://www.typescriptlang.org/play                                                                                                  |                                                                        | 코드 · 오른쪽 결과                                 | viewer/tsplayground.jpg     |
| regex101         | https://regex101.com/                                                                                                                | 내용 8–1372 · aside 48+240,946+438 · 미디어 633×664                    | 왼쪽 · 가운데 · 오른쪽                             | viewer/regex101.jpg         |
| jsfiddle         | https://jsfiddle.net/                                                                                                                | 내용 10–1420 · aside 0+250                                             | 왼쪽 메뉴 · 2×2 칸                                 | viewer/jsfiddle.jpg         |
| wikipediavideo   | https://en.wikipedia.org/wiki/File:Big_Buck_Bunny_4K.webm                                                                            | 내용 48–1380 · 표 폭 912 · 열 2 · 미디어 800×450                       | 문서 안 재생기                                     | viewer/wikipediavideo.jpg   |

## 디자인 시스템

표본 32건 · 세는 곳 23건

| 곳                | URL                                                                                                           | 잰 값                                            | 눈으로 본 뼈대                                      | 캡처                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------- | ------------------------ |
| polaris-index     | https://polaris-react.shopify.com/patterns/resource-index-layout                                              | 내용 24–1420 · aside 0+284,1133+251              | 막힘 · 세지 않음                                    | ds/polaris-index.jpg     |
| polaris-detail    | https://polaris-react.shopify.com/patterns/resource-details-layout                                            | 내용 24–1420 · aside 0+284,1133+251              | 막힘 · 세지 않음                                    | ds/polaris-detail.jpg    |
| carbon-table      | https://carbondesignsystem.com/components/data-table/usage/                                                   | 내용 0–1408 · 표 폭 557 · 열 2 · 미디어 819×464  | Carbon Data table                                   | ds/carbon-table.jpg      |
| carbon-filter     | https://carbondesignsystem.com/patterns/filtering/                                                            | 내용 0–1408 · 표 폭 557 · 열 2                   | Carbon Filtering 패턴                               | ds/carbon-filter.jpg     |
| carbon-page       | https://carbondesignsystem.com/components/page-header/usage/                                                  | 내용 0–832 · 미디어 592×852                      | 막힘 · 세지 않음                                    | ds/carbon-page.jpg       |
| atlassian-table   | https://atlassian.design/components/dynamic-table                                                             | 내용 24–1385 · 표 폭 732 · 열 5                  | Atlassian Dynamic table                             | ds/atlassian-table.jpg   |
| m3-listdetail     | https://m3.material.io/foundations/layout/canonical-layouts/list-detail                                       | 내용 4–1432 · 표 폭 619 · 열 2 · 미디어 623×482  | Material 3 list-detail                              | ds/m3-listdetail.jpg     |
| m3-supporting     | https://m3.material.io/foundations/layout/canonical-layouts/supporting-pane                                   | 내용 4–1432 · 표 폭 940 · 열 3                   | Material 3 supporting pane                          | ds/m3-supporting.jpg     |
| spectrum-table    | https://spectrum.adobe.com/page/table/                                                                        | 내용 36–1144                                     | 막힘 · 세지 않음                                    | ds/spectrum-table.jpg    |
| fluent-table      | https://fluent2.microsoft.design/components/web/react/core/table/usage                                        | 내용 32–1120 · aside 32+260                      | 막힘 · 세지 않음                                    | ds/fluent-table.jpg      |
| primer-table      | https://primer.style/product/components/data-table/                                                           | 내용 8–1393 · aside 0+300 · 표 폭 694 · 열 5     | Primer DataTable                                    | ds/primer-table.jpg      |
| primer-layout     | https://primer.style/product/components/page-layout/                                                          | 내용 8–1400 · aside 0+300 · 표 폭 728 · 열 3     | Primer PageLayout                                   | ds/primer-layout.jpg     |
| ant-table         | https://ant.design/components/table                                                                           | 내용 4–1428 · 표 폭 928 · 열 1                   | Ant Table                                           | ds/ant-table.jpg         |
| ant-desc          | https://ant.design/components/descriptions                                                                    | 내용 4–1428 · 표 폭 928 · 열 1                   | Ant Descriptions                                    | ds/ant-desc.jpg          |
| cloudscape-table  | https://cloudscape.design/patterns/resource-management/view/table-view/                                       | 내용 20–1416 · 표 폭 741 · 열 3                  | Cloudscape Table view                               | ds/cloudscape-table.jpg  |
| cloudscape-detail | https://cloudscape.design/patterns/resource-management/details/                                               | 내용 20–1416 · 표 폭 791 · 열 4                  | Cloudscape Resource details                         | ds/cloudscape-detail.jpg |
| eui-datagrid      | https://eui.elastic.co/docs/components/tables/data-grid/                                                      | 내용 404–1078                                    | 막힘 · 세지 않음                                    | ds/eui-datagrid.jpg      |
| patternfly-filter | https://www.patternfly.org/patterns/filters/design-guidelines                                                 | 내용 24–1392 · 표 폭 1078 · 열 4                 | PatternFly Filters(안내 띠가 위를 일부 가림)        | ds/patternfly-filter.jpg |
| patternfly-detail | https://www.patternfly.org/patterns/primary-detail/design-guidelines                                          | 내용 24–1392                                     | PatternFly Primary-detail(안내 띠가 위를 일부 가림) | ds/patternfly-detail.jpg |
| fiori-object      | https://www.sap.com/design-system/fiori-design-web/v1-120/page-types/object-page/                             | 내용 8–1424                                      | 막힘 · 세지 않음                                    | ds/fiori-object.jpg      |
| fiori-list        | https://www.sap.com/design-system/fiori-design-web/v1-120/page-types/list-report-floorplan-sap-fiori-element/ | 내용 8–1424                                      | 막힘 · 세지 않음                                    | ds/fiori-list.jpg        |
| moj-filter        | https://design-patterns.service.justice.gov.uk/components/filter/                                             | 내용 0–1340 · 표 폭 980 · 열 2 · 미디어 978×952  | MoJ Filter                                          | ds/moj-filter.jpg        |
| govuk-layout      | https://design-system.service.gov.uk/styles/layout/                                                           | 내용 156–1182 · 미디어 809×335                   | GOV.UK Layout                                       | ds/govuk-layout.jpg      |
| baseweb-table     | https://baseweb.design/components/table-semantic/                                                             | 내용 272–1168 · 표 폭 476 · 열 3                 | Base Web Table                                      | ds/baseweb-table.jpg     |
| gestalt-table     | https://gestalt.pinterest.systems/web/table                                                                   | 내용 8–1206 · 표 폭 894 · 열 3 · 미디어 892×350  | Gestalt Table                                       | ds/gestalt-table.jpg     |
| apple-layout      | https://developer.apple.com/design/human-interface-guidelines/layout                                          | 내용 245–1411 · aside 470+740 · 표 폭 491 · 열 2 | Apple HIG Layout                                    | ds/apple-layout.jpg      |
| apple-video       | https://developer.apple.com/design/human-interface-guidelines/playing-video                                   | 내용 245–1411 · 표 폭 740 · 열 2                 | Apple HIG Playing video                             | ds/apple-video.jpg       |
| apple-splitview   | https://developer.apple.com/design/human-interface-guidelines/split-views                                     | 내용 245–1411 · 표 폭 740 · 열 2                 | Apple HIG Split views                               | ds/apple-splitview.jpg   |
| paste-table       | https://paste.twilio.design/components/data-grid                                                              | 내용 16–1328 · 표 폭 904 · 열 4                  | 막힘 · 세지 않음                                    | ds/paste-table.jpg       |
| clarity-datagrid  | https://clarity.design/documentation/datagrid                                                                 | 내용 0–1176 · 표 폭 898 · 열 1                   | Clarity Datagrid                                    | ds/clarity-datagrid.jpg  |
| geist-table       | https://vercel.com/geist/table                                                                                | 내용 135–1280 · aside 110+260 · 표 폭 812 · 열 3 | Geist Table                                         | ds/geist-table.jpg       |
| mantine-appshell  | https://mantine.dev/core/app-shell/                                                                           | 내용 16–1424 · 표 폭 822 · 열 2                  | Mantine AppShell                                    | ds/mantine-appshell.jpg  |

## 악곡 상세(다시 시작)

앞 조사는 사용자가 폐기했다. 실제 화면을 CSS 만 입혀 찍은 사진은 `~/noslog-research/desktop-music-detail/real/`, UI 좋은 서비스 캡처는 `~/noslog-research/desktop-music-detail/` 에 있다. 캡처는 모두 직접 열어 보고 머리가 보인 곳만 셌다.

### 머리 구조 표본

폭 1440, 로그인하지 않은 화면이다. 실제 서비스 43곳 · 디자인 시스템 5곳이다. 새 캡처는 `~/noslog-research/desktop-music-detail/head/` 에 있다.

| 머리 구조                             | 곳 수 | 어디                                                                                                                                                                |
| ------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 큰 그림 + 제목 · 메타 · 동작          | 16    | Apple Music · Spotify · Tidal · 멜론 · osu! · BeatSaver · TMDB · Goodreads · Metacritic · OpenCritic · Steam · GOG · Netflix · 교보문고 · 무신사 · IKEA             |
| 작은 그림 + 제목 줄, 탭, 내용 + 옆 열 | 14    | GitHub · Docker Hub · Raycast · crates.io · PyPI · Kaggle · Hugging Face · Notion · Vercel · MusicBrainz · TradingView · Yahoo Finance · Google Finance · Songsterr |
| 그림 · 이름 + 수치를 한 띠에, 아래 탭 | 7     | ESPN · Quaver · OpenDota · UFC · Fotmob · WhoScored · Basketball Reference                                                                                          |
| 그림 + 제목, 아래 전폭 수치 줄        | 3     | App Store · NHL · Chess.com(근거 약함)                                                                                                                              |
| 얇은 제목 줄 + 왼쪽 정보 열           | 3     | Coinbase · 네이버 증권 · 토스증권(근거 약함)                                                                                                                        |

디자인 시스템은 Primer PageHeader · Atlassian Page header · Ant Design Pro PageContainer · Elastic UI Page header · PatternFly Page 다. 모두 제목 줄 + 오른쪽 동작 + 아래 탭이다.

막혀서 세지 않은 31곳: NBA · AllMusic · Transfermarkt · Figma(접근 거부), Sofascore · Lichess · Discogs · Genius · Beatport · npm · Epic · Letterboxd · Product Hunt(캡차), Last.fm(접속 오류), Robinhood · 왓챠 · Rotten Tomatoes · Bandcamp · SoundCloud · Deezer · MyAnimeList · MLB · F1 · Premier League(팝업이 머리를 가림), VIBE(오류 창), Airbnb · KREAM · Amazon · PlayStation Store(없는 쪽), YouTube Music(브라우저 안내), Dribbble(상세가 아닌 목록). Disney+ · Duolingo · Apple Watch · Linear 캡처는 머리 비교에 맞지 않아 열지 않았고 세지 않았다.

### 머리 판 실제 화면

CSS 는 `addStyleTag` 로만 입혔다. 사진은 `~/noslog-research/desktop-music-detail/real/head/` 의 `안-short.jpg`(로그아웃 실제) · `안-long.jpg`(Grd 표시용 값) · `안-long-1056.jpg` · `안-long-1920.jpg` 다. 탭 줄 아래 끝은 폭 1440 에서 잰 값이다.

| 안         | 탭 줄 아래 끝 | 긴 제목         | 사진에서 본 것                                                   |
| ---------- | ------------- | --------------- | ---------------------------------------------------------------- |
| ESPN       | 369           | 두 줄로 다 보임 | 1056 은 라벨 줄바꿈을 막아야 들어간다                            |
| Quaver     | 344           | 끝 페이드       | 동작을 아래 줄에 두면 난이도 · 동작 · 탭이 뭉쳐서 위 줄로 올렸다 |
| Docker Hub | 308           | 한 줄로 다 보임 | 1056 에서 내용 두 열 + 옆 열이 빽빽하다                          |
| Coinbase   | 212           | 한 줄로 다 보임 | 난이도 네 칸이 왼쪽 열 안에서 빠듯하다                           |
| 멜론       | 454           | 한 줄로 다 보임 | 수치 글자가 가장 작다                                            |
| App Store  | 527           | 한 줄로 다 보임 | 수치 칸이 가장 크고 내용이 첫 화면 절반이다                      |

### 머리 위계 해결안

안 A 는 사이트 헤더와 띠가 같은 면이라 위계가 사라진다는 사용자 지적으로 그렸다. 사진 이름은 `a1` – `a4` 다. 모두 표준 폭 1152 이고 폭 1056 · 1920 도 찍었다.

| 해결안                 | 탭 줄 아래 끝 | 같은 모양                            |
| ---------------------- | ------------- | ------------------------------------ |
| 헤더와 띠 사이에 바탕  | 437           | 미확인                               |
| 1152 상자 하나         | 437           | Fotmob · Quaver(근거 약함)           |
| 머리 면 없음           | 412           | Chess.com · TradingView · Docker Hub |
| 전폭 띠 + 헤더 아래 선 | 370           | GitHub(근거 약함)                    |

### 머리 결정

Figma 에 옮겼다: 파일 NosLog-Design 의 쪽 「화면 · 악곡 상세」 노드 6:294, 부품은 「컴포넌트 · 악곡 상세」, 토큰은 「파운데이션 · 악곡 상세」 와 변수 묶음 「NosLog 토큰 · 악곡 상세」(다크 값만). 실제 화면과의 좌표 · 사진 대조는 `~/noslog-research/desktop-music-detail/decided/head/figma/cmp.jpg` 에 있다. Figma 에 Pretendard 가 없어 토큰 글꼴 목록의 Noto Sans KR 로 대신했고, 600 굵기가 없어 Bold 로 넣었다. 12.0 수치 색은 난이도로 계산되는 값이라 변수에 묶지 않았다.

2026-11-02 사용자 선택: 안 A(ESPN 선수 화면 구조) + 해결안 2(1152 상자 하나). 구현 전이고 코드는 고치지 않았다.

2026-11-05 사용자 선택: 세로 맞춤을 가운데에서 아래 끝으로 바꾼다(`.nl-music-entity { align-items: end }`). 가운데 맞춤이면 글자 열이 자켓 160 보다 높을 때 난이도 단추가 자켓 · 수치 상자 아래 끝보다 16 내려갔다(긴 제목 곡 자켓 아래 y356 · 단추 아래 y372). 아래 끝 맞춤이면 셋 다 y372 에 맞고, 남는 높이는 상자 위로 간다. 사진 `decided/head/a2-fix-long.jpg`, CSS `decided/head/css/a2-fix-align.css`.

사진은 `~/noslog-research/desktop-music-detail/decided/head/` 의 `a2-short.jpg`(로그아웃 실제) · `a2-long.jpg`(긴 제목 · Grd 표시용 값) · `a2-long-1056.jpg` · `a2-long-1920.jpg` 다. 같은 폴더 `css/` 에 입힌 CSS, `tools/` 에 찍은 스크립트가 있다.

| 자리      | 값                                                                                 |
| --------- | ---------------------------------------------------------------------------------- |
| 틀        | 표준 폭 1152(1056 에서 1008). 돌아가기는 상자 밖 위                                |
| 상자      | 면 `surface/surface` · 위 모서리 `radius/large` · 안쪽 24 24 16. 탭 줄까지 한 상자 |
| 열        | 자켓 160 · 글자 최소 407 · 수치 상자 최대 520 · 사이 24 · 줄 사이 12               |
| 글자 열   | 카테고리 · 제목 · 아티스트. 제목은 두 줄까지 줄바꿈 · 난이도는 같은 열 아래        |
| 수치 상자 | 그레이드 · 수치 다섯 칸 · 채보 보기                                                | 플레이 영상, 둘레 선 `border/divider` |
| 탭 줄     | 상자 안 위 선 `border/divider` · 왼쪽 붙임 · 사이 24 · 탭 줄 아래 끝 437(폭 1440)  |

입힌 CSS 전문이다. 시안 촬영용이라 `!important` 가 있고 구현 코드로 그대로 쓰지 않는다.

```css
.noslog-ui .nl-music-detail__layout {
    display: block !important;
}
.noslog-ui .nl-music-entity {
    position: relative !important;
    top: auto !important;
}
.noslog-ui .nl-music-entity__identity {
    flex-direction: row !important;
    align-items: flex-start !important;
}
.noslog-ui .nl-music-entity__identity > .nl-jacket {
    aspect-ratio: auto !important;
    flex: none;
}
.noslog-ui .nl-segments--wide-vertical {
    display: inline-grid !important;
    grid-auto-flow: column !important;
    grid-auto-columns: minmax(0, 1fr) !important;
    flex-direction: row !important;
    width: auto;
}
.noslog-ui .nl-segments--wide-vertical .nl-segments__item {
    justify-content: center !important;
    gap: 8px !important;
    padding-inline: 16px !important;
}
.noslog-ui .nl-stat-strip--wide-list {
    display: flex !important;
    flex-direction: row !important;
}
.noslog-ui .nl-stat-strip--wide-list .nl-stat-strip__cell {
    flex: 1 1 0 !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
}
.noslog-ui .nl-music-entity {
    display: grid !important;
    grid-template-columns: 160px minmax(407px, 1fr) minmax(0, 520px);
    grid-template-rows: 1fr auto;
    gap: 12px 24px !important;
    align-items: center;
}
.noslog-ui .nl-music-entity__identity {
    display: contents !important;
}
.noslog-ui .nl-music-entity__identity > .nl-jacket {
    grid-column: 1;
    grid-row: 1/3;
    width: 160px !important;
    height: 160px !important;
}
.noslog-ui .nl-music-entity__copy {
    grid-column: 2;
    grid-row: 1;
    min-height: 0 !important;
}
.noslog-ui .nl-music-entity__copy .nl-music-entity__title {
    white-space: normal !important;
    overflow: visible !important;
}
.noslog-ui .nl-music-entity__title.nl-fade-end {
    mask-image: none !important;
    -webkit-mask-image: none !important;
}
.noslog-ui .nl-difficulty-selector {
    grid-column: 2;
    grid-row: 2;
    width: max-content;
}
.noslog-ui .nl-stat-card {
    grid-column: 3;
    grid-row: 1/3;
    border: 1px solid var(--nl-border-divider);
    border-radius: var(--nl-radius-control) !important;
}
.noslog-ui .nl-stat-strip--wide-list .nl-stat-strip__cell {
    padding-inline: 4px !important;
}
.noslog-ui .nl-stat-strip--wide-list dt {
    white-space: nowrap;
}
.noslog-ui .nl-tabs--primary {
    justify-content: flex-start !important;
    display: flex !important;
    gap: 24px;
}
.noslog-ui .nl-tabs--primary .nl-tabs__item {
    flex: none !important;
    width: auto !important;
    padding-inline: 4px !important;
}
.noslog-ui .nl-area__panel {
    padding-top: 24px !important;
}
.noslog-ui .nl-music-entity {
    background: var(--nl-surface-surface);
    padding: 24px 24px 16px;
    border-radius: var(--nl-radius-large) var(--nl-radius-large) 0 0;
}
.noslog-ui .nl-tabs--primary {
    background: var(--nl-surface-surface);
    border-top: 1px solid var(--nl-border-divider);
    padding-inline: 24px;
    border-radius: 0 0 var(--nl-radius-large) var(--nl-radius-large);
}
```

### 머리 뒤 판

상자 안 수치 상자는 고른 그대로 둘레 선을 둔다. 고른 안을 다시 묻는 판(`s1` · `s2`)은 시안에서 뺐다. 개요 배치는 왼쪽 막대 | 오른쪽 384 채보 정보(`ovf`) · 반대(`ovq`) · 위 전폭 내 기록 + 아래 1 : 1(`ovt`) 세 안이다. 안에 쓴 CSS 는 `~/noslog-research/desktop-music-detail/css-all/` 에 있다. 선택 대기다.

### 결정 대기 판

악곡 목록 폭(`w1` · `w2`) · 검색칸(`s2` · `s3`) 사진은 `~/noslog-research/desktop-music/decided/list/real/`, CSS 는 같은 폴더 `css/` 에 있다. 개요 빈 자리(`ovf2`)는 `desktop-music-detail/css-all/`, 채보 뷰어 표준 폭(`yt1152`, 무대 790×444)은 `desktop-viewer/css-all/` 에 있다. GOG 검색칸 잰 값은 x732–1268, Steam 입력은 311 이다.

## 다크 서비스 악곡 상세 개요 배치(2026-11-07)

탭 아래 개요 구역에서 좁은 정보 열을 어디에 몇 폭으로 두는지 잰 기록이다. headless Playwright(1440×900, colorScheme dark)에서 `getBoundingClientRect` 로 쟀고 캡처는 하나씩 열어 맞는지 봤다. 11-05 탭 조사 18곳(`~/noslog-research/desktop-music-detail/v2/tabs/summary.tsv`)에 새로 22곳(`v2/ov/research/a` · `b` 의 `summary.tsv`)을 더해 실제 서비스 40곳을 셌다. 다크가 아닌 5곳(itch.io · PlayStation · TMDB · PCGamingWiki · Goodreads)은 자리만 세고 다크 수에서 뺐다. 재설계 기준 50곳에는 모자란다.

세지 않은 곳(18): ScoreSaber · IMDb · Rate Your Music · Discogs(release 쪽) · PSNProfiles · RetroAchievements · SteamDB · MobyGames · CurseForge · Nexus Mods · Epic Games Store · Dotabuff · HLTV · Mobalytics(모두 Cloudflare 등 보안 확인), Liquipedia(캡차), Transfermarkt(403), Letterboxd(Turnstile 창), IGDB(탭 아래 내용이 헤드리스에서 비어 있음). OTOGE DB · tracker.gg · Strava 는 11-05 조사에서 세지 않았다.

| 옆 열 자리  | 전체 40 | 다크 35 | 서비스(옆 열 폭 · 사이)                                                                                                                                                                                                                                                                                                                                                           |
| ----------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 오른쪽      | 19      | 16      | MusicBoard 389 · 32, Steam 406 · 14, OP.GG 332 · 8, Chess.com 300 · 24, Blitz 308(광고) · 16, Modrinth 300 · 24, Thunderstore 354 · 32, GitHub 272 · 40, Hugging Face 506 · 24, Docker Hub 448 · 16, GOG 424 · 48, Xbox 672(6 : 6) · 16, FotMob 416 · 16, Exophase 403 · 24, Speedrun 320 · 16, Serializd 364 · 30, 다크 아님 itch.io 367 · TMDB 260 · 30 · PCGamingWiki 300 · 40 |
| 왼쪽        | 9       | 8       | AniList 208 · 40, BeatSaver 440, Lichess 328 · 15(판 그림), Backloggd 262 · 16(포스터), MetaTFT 약 250, Sofascore 364 · 12, HowLongToBeat 250 · 12, MyAnimeList 226 · 8, 다크 아님 Goodreads 299 · 53                                                                                                                                                                             |
| 없음(한 열) | 10      | 9       | Quaver · Etterna · U.GG · Spotify · Apple Music · STRATZ · VNDB · Synthriderz · Trakt, 다크 아님 PlayStation                                                                                                                                                                                                                                                                      |
| 한 줄에 3칸 | 2       | 2       | osu!(본문 · 175 · 275, 사이 20) · ProtonDB(양옆 240)                                                                                                                                                                                                                                                                                                                              |

오른쪽 열 다크 16곳의 폭은 272–672, 가운데 값은 364–389 사이다. 사이는 8–48 로 흩어져 있다. 오른쪽 열에 키-값 정보 목록을 두는 곳은 Modrinth · Thunderstore · Docker Hub · GOG · GitHub · Exophase · Serializd 이고, 왼쪽 열은 표지 · 담기 단추가 많으며 정보 목록까지 왼쪽에 두는 곳은 AniList · MyAnimeList 다.

디자인 시스템은 20곳을 보고 19곳을 셌다(SAP Fiori 403). 옆 열을 분명히 권하는 곳 3 · 상황에 따라 9 · 지침 없음이나 한 열 7 이다. 비율을 적은 곳은 1/3 이 가장 많다(Polaris 2/3 + 1/3, GOV.UK 2/3 + 1/3, Salesforce 30 %, Material 70/30, Protocol 중간 폭 1/3). 고정 폭은 Primer 256–320(1012 이상 기본 296) · Material 360 · Atlassian 365 다. 키-값 목록을 쓰라고 적은 4곳(Cloudscape · PatternFly · Ant Design · Paste)은 그 목록을 옆 열이 아니라 본문 맨 위에 둔다. 원문 주소와 값은 `v2/ov/research/ds/summary.tsv` 에 있다.

### 개요 판

지금 개요는 568 + 568 반반이라 왼쪽 패턴 경향 아래가 빈다. 판에는 오른쪽 389 (MusicBoard) · 오른쪽 300 (Modrinth) · 왼쪽 208 (AniList) 세 안을 올린다. osu! 의 3칸은 2곳뿐이고 가운데 175 열에 로그아웃 「내 기록」 한 줄만 들어가 아래가 비어서 뺐다. 한 열 묶음은 서비스마다 모양이 달라(Quaver 는 정보 상자 안에서 다시 2열, VNDB 는 머리 안 정의 표) 한 곳을 그대로 옮길 대표가 없어 안으로 내지 않았다. CSS 와 사진은 `~/noslog-research/desktop-music-detail/v2/ov/` 에 있다.

2026-11-07 사용자 지적 「개요쪽도 프로필처럼 면 그리드」 로 네 구역을 프로필과 같은 상자(면 surface · 둥글기 8 · 안쪽 16 · 사이 16 · 머리 아래 24)에 담아 다시 찍었다(`ovb-*.jpg`, `css/_box.css`). 상자 안쪽 여백 때문에 AniList 208 안은 글 칸이 176 이 되어 해금 조건이 낱말 중간에서 끊겨 뺐고, 판에는 MusicBoard 389 · Modrinth 300 두 안만 남겼다.

### 개요 구성 요소(2026-11-07)

사용자 요청 「지금 상태에서 더 개선할 수 있는 방법 조사해서 시안」 으로 개요에 무엇을 두는지 셌다. 위 40곳 캡처를 다시 열어 구역을 적었고(`v2/ov/research/content/summary.tsv`), 리듬게임 · 음악 DB 24곳을 새로 재 19곳을 셌다(`v2/ov/research/c/summary.tsv`, 다크 13 · 라이트 5 · 판단 안 함 1). 세지 않은 곳은 Kamaitachi(hCaptcha) · iidx.org(곡 쪽 없음) · Arcaea 위키(Cloudflare · Anubis) · Last.fm(봇 차단) · Genius(Cloudflare) 다.

40곳에서 개요에 있는 구역:

| 구역                            | 곳 수 | 서비스                                                                                                                           |
| ------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------- |
| 정보 키-값 목록                 | 28    | 없는 곳 12: Etterna · OP.GG · U.GG · Chess.com · Lichess · Spotify · Apple Music · MetaTFT · Blitz · Trakt · ProtonDB · Speedrun |
| 인기 · 플레이 수치              | 28    | osu! · Quaver · Etterna · AniList · MusicBoard · GitHub 등                                                                       |
| 관련 항목                       | 21    | 버전 · 관계작 10 · 같은 만든이 4 · 비슷한 것 4 · 상대 3 · 하위 변형 2                                                            |
| 미디어                          | 19    | 미리듣기 7 · 영상 9 · 스크린샷 7                                                                                                 |
| 분포 · 추이 그래프              | 16    | 평점 분포 7 · 시간 추이 6 · 성과 분포 4                                                                                          |
| 다른 탭 미리보기(N개 + 더 보기) | 15    | Steam · OP.GG · STRATZ · AniList · Backloggd · MusicBoard · TMDB · Speedrun · Trakt · Serializd · GitHub 등                      |
| 리뷰 · 댓글                     | 9     | osu! · Steam · AniList · Backloggd · MusicBoard · TMDB · Trakt · PlayStation · ProtonDB                                          |
| 순위표                          | 7     | 전체 osu! 50 · BeatSaver 약 25 · Quaver · Etterna 25 · Speedrun, 상위 5 + 링크 OP.GG · STRATZ                                    |
| 내 기록 · 내 평가 자리          | 4     | Exophase · U.GG · MusicBoard · Goodreads(모두 로그아웃이라 모양 미확인)                                                          |
| 티어 · 난이도 변경 이력         | 0     | -                                                                                                                                |

리듬게임 · 음악 19곳에서 개요에 있는 구역: 곡 · 채보 정보 17 · 난이도 고르기 10 · 순위표 6(osu! 50 · Quaver 50 · 3icecream 약 50 · BeatLeader 10 + 쪽 · bokutachi 10 + 쪽 · mocha) · 관련 콘텐츠 7 · 플레이 수 · 기록 통계 6 · 댓글 5 · 짧은 미리보기 + 더 보기 5 · 채보 그림 4(sdvx.in · taiko.wiki · 3icecream · enchor) · 분포 그래프 3(chunirec 램프 · 랭크 원그래프와 레이팅별 평균 점수, osu! 실패 지점, mocha) · 패턴 표시 3(dxrating 패턴 태그 21개 · enchor · osu!) · 내 기록 자리 2(bokutachi Your PB · 3icecream Your Score) · 상수 · 서열 이력 1(dxrating 버전별 상수). 배치는 머리 아래 한 열이 13곳으로 가장 많고, 옆 열은 BeatLeader 432 · MusicBrainz 235 · Bandcamp 3열 셋뿐이다. 구역마다 상자 8 · 섞음 7 · 상자 없음 4 다.

리듬게임 쪽 구성이 NosLog 개요와 가장 가까운 곳은 bokutachi(곡 정보 상자 → 1위 기록 | 내 기록 두 카드 1 : 1 → 순위표 10줄 + 쪽 넘김, 전폭 한 열)와 dxrating(한 열 카드: 곡 → 난이도별 상수 · 패턴 태그 → 버전별 상수 변경 → 정보 → 의견 → 달성률 표)이다.

개요 구성 판은 안 C(안 1 아래 순위표 10줄, osu! · Quaver) · 안 A(한 열 · 1위 기록 | 내 기록 · 순위표 10줄, bokutachi) · 안 B(한 열 카드 쌓기, dxrating) 세 안이다. 순위표 · 의견은 랭킹(`?tab=ranking`) · 평가(`?tab=tier`) 탭 DOM 을 그대로 가져와 개요에 넣어 찍었다. 개발 DB 에서 기록이 가장 많은 채보는 Altale Real(11명), 의견은 많아야 채보당 1개라 Audite Nostalgia Real 로도 찍었다. CSS 와 사진은 `v2/ov/css/x-*.css` · `v2/ov/x/`, 찍은 코드는 `v2/ov/shot-x.mjs` 다.

### 채보 정보 표시 모양(2026-11-07)

사용자 지적 「채보 정보를 리스트로 쭉 보여주는 건 별로」 로, 위 캡처 57곳(c 19 · tabs 16 · a · b 22, 막힌 5곳과 probe 캡처 뺌)에서 정보를 어떤 모양으로 보여 주는지 셌다(`v2/ov/research/info/summary.tsv`). 라이트 9곳이 섞여 있고, 한 곳이 여러 모양을 쓰면 모양마다 셌다.

| 모양                    | 곳 수 | 대표                                                                                           |
| ----------------------- | ----- | ---------------------------------------------------------------------------------------------- |
| 제목 아래 메타 줄       | 26    | Spotify · Synthriderz · chunirec · TMDB                                                        |
| 라벨 위 · 값 아래       | 20    | MusicBoard Information(줄 75 · 라벨 14 굵게 · 값 14 흐리게) · AniList · Docker Hub             |
| 값 위 · 라벨 아래       | 5     | FotMob(2열 · 칸 약 200 · 값 16 · 라벨 14 흐리게) · MusicBoard 머리 수치 · GOG                  |
| 한 줄 칩 · 알약         | 22    | 값 칩 9(Quaver · Hugging Face · HowLongToBeat) · 태그 칩 13                                    |
| 아이콘 + 값             | 20    | osu! · Sofascore · BeatSaver · GitHub                                                          |
| 세로 키-값(지금 NosLog) | 19    | dxrating(노트 아래 종류별 들여 쓴 줄) · Thunderstore · Serializd                               |
| 가로 수치 표            | 15    | otoge-db(NOTES · TAP · HOLD · SLIDE · AIR 띠, 칸마다 라벨 12 위 · 숫자 14 아래) · U.GG · Blitz |
| 여러 열 키-값 격자      | 6     | FotMob · taiko.wiki · HowLongToBeat · GOG                                                      |

빠진 값은 글자(「N/A」 · 「-」 · 「Unknown」 · 「未確定」)로 쓰거나 비워 두고, 채우기는 「Add」(dxrating · Serializd) · 「Submit」(HowLongToBeat) · 맨 아래 「정보 신고」(otoge-db · VNDB) · 구역마다 Edit(MyAnimeList) 꼴이다. 채보 정보 판은 라벨 위 · 값 아래(MusicBoard) · 2열 값 위 · 라벨 아래(FotMob) · 노트 수 띠 + 짧은 목록(otoge-db) 세 안이다. 메타 줄 · 칩은 머리 자리 모양이라 개요 상자 안의 안으로 내지 않았다.

## 다크 서비스 채보별 내 기록(2026-11-07)

악곡 상세 「내 기록」 탭 재설계를 위해, 한 사람의 한 항목(채보 · 맵 · 모드 · 종목 · 시즌) 기록 화면을 잰 기록이다. headless Playwright(1440×900, colorScheme dark)로 찍었고, 캡처는 합본으로 모두 열어 봤다. 기록은 세 묶음이다. 리듬게임 · 기록 서비스는 `~/noslog-research/desktop-music-detail/v2/rec/research/a/summary.tsv`(63곳 시도), 개인 통계 전체 화면은 `b/summary.tsv`(44곳 시도), 추가분은 `c/summary.tsv`(26곳 시도)에 있다. 디자인 시스템은 `ds/summary.tsv` 다.

센 곳은 「한 사람 × 한 항목」 화면 23곳이다(a 16 · c 7).

- a: osu! · Bokutachi · BeatLeader · Chess.com · Etterna · OpenDota · TETR.IO · FIDE · WCA · Basketball-Reference · Steam(xPaw) · Typeracer · osu!track · ITL · Cubing China · AtCoder
- c: Lishogi · SC2 Pulse · AoE2 Companion(모달) · ESPN · OpenPowerlifting · Wavu Wank(필터) · MKWorld Lounge

여기에 한 항목이 아닌 개인 통계 전체 화면 10곳(b: Monkeytype · OP.GG · U.GG · Mobalytics · speedrun.com · LeetCode · therun.gg · FotMob · Smashrun · Trackmania.io)을 더하면 실제 서비스는 33곳이다. 다크는 a 9 · b 16(겹치는 곳 포함) · c 5 다. Bokutachi 는 유저 × 차트 전용 주소가 로그인 벽이라, 공개 PB 표의 줄을 펼친 화면으로 셌다.

세지 않은 곳:

- Cloudflare 등 보안 확인: Lichess · RetroAchievements · therun(a) · speedrun.com(a) · League of Graphs · SwimCloud · ScoreSaber · PSNProfiles · TrueAchievements · Plancke · Stratz · US Chess · athletic.net · Codeforces · rlstats · ongeki-score · steamhunters · completionist.me
- 봇 차단: Last.fm · Letterboxd · duome
- 로그인 벽: Kamaitachi · Strava · sendou.ink · 3icecream 개인 칸
- 404 · 오류 · 데이터 안 그려짐: Quaver · Trackmania.io(a) · Overwatch · Exophase · 2700chess · Etterna 점수 목록 · jstris · ChuniDB · pychess · piuscores · astats
- 한 항목 화면이 아님: SMX · KovaaK's · AccSaber · ereter · V-ARCHIVE 2쪽 · OGS · MetaTFT 등 21곳
- 캡처가 가려짐: TFT tactics.tools(광고 · 지연 로딩) · Transfermarkt(동의 창)

리듬게임 팬 사이트(V-ARCHIVE · ereter · GrooveStats · StatManiaX · 3icecream)는 공개된 개인 단위가 레벨 성과표나 곡 순위표까지라 한 곳도 세지 못했다.

한 항목 23곳의 구역(한 곳이 여러 모양을 쓰면 모양마다 셈):

| 구역            | 모양                      | 곳 수 | 서비스                                                                      |
| --------------- | ------------------------- | ----- | --------------------------------------------------------------------------- |
| 최고 기록       | 큰 숫자 · 히어로          | 5     | osu! · BeatLeader · TETR.IO · Chess.com · Lishogi                           |
|                 | 표 줄 · 라벨-값           | 11    | Bokutachi · Etterna · ITL · Typeracer · AtCoder · WCA · Cubing China 등     |
|                 | 따로 없음                 | 6     | OpenDota · FIDE · B-Ref · Steam · ESPN · Wavu                               |
| 누적 요약       | 큰 숫자 칸                | 2     | Chess.com(4칸) · OpenDota(3칸)                                              |
|                 | 라벨-값 · 숫자 한 줄      | 6     | ITL · Bokutachi · AtCoder · osu!track · Lishogi · MKWorld                   |
| 판정 · 세부     | 숫자 나열 · 표            | 8     | osu! · ITL · Bokutachi · Lishogi · AoE2 · ESPN · OpenPowerlifting · MKWorld |
|                 | 가로 막대                 | 2     | Etterna(판정 6개) · SC2 Pulse                                               |
|                 | 원 · 게이지               | 3     | osu!track · BeatLeader · OpenDota                                           |
| 시간 추이       | 선 · 점 · 면              | 10    | Chess.com · TETR.IO · FIDE · osu!track · AtCoder · OpenDota · Lishogi 등    |
| 한 판 안 그래프 | 정확도 · 편차 · 구간 속도 | 3     | BeatLeader · Etterna · Typeracer                                            |
| 이력            | 표                        | 14    | Bokutachi · TETR.IO · OpenDota · FIDE · ITL · WCA · ESPN · MKWorld 등       |
|                 | 같은 자리 탭 전환         | 2     | TETR.IO(TOP · RECENT · PROGRESSION) · AtCoder                               |
|                 | 줄 펼침                   | 1     | Bokutachi                                                                   |

「나 · 평균」 누적 막대는 23곳 어디에도 없다. 위에서 「요약 · 최고 → 그래프 → 목록」 순서인 곳은 TETR.IO · Chess.com · AtCoder · osu!track · OpenDota 이고, 머리 바로 아래가 추이 그래프인 곳은 Lishogi · SC2 Pulse · AoE2 다. 배치는 한 열 14 · 옆 열 + 본문 9 이다. 옆 열은 프로필(TETR.IO 300 · AtCoder 280 · FIDE 340)이나 같은 사람의 다른 모드 · 종목 목록(Chess.com 300 · Lishogi 243)이라 NosLog 의 머리 + 탭 자리에 해당한다. 구역을 상자로 감싼 곳은 yes 8 · mixed 9 · no 6 이고, 접기는 Bokutachi · BeatLeader · Chess.com(Show Detailed Stats) · OpenDota(HIDE) · B-Ref · Typeracer 6곳이다.

디자인 시스템은 18곳을 보고 14곳을 셌다(Spectrum · Fiori · Canvas · Base Web 은 지침 없음이나 403). 접기는 핵심 정보를 숨기지 말고 보조 내용만 접으라는 곳이 6곳(Cloudscape · GOV.UK · Ant Design · Fluent · Pajamas · Atlassian)이다. 상세 쪽은 한 열로 쌓는 곳(Cloudscape · GOV.UK · Polaris)과 주 열 2/3 + 보조 1/3(Salesforce · Polaris 상세 템플릿)으로 나뉜다. 한 지표의 시간 추이는 큰 숫자 대신 그래프로 쓰라는 곳은 Pajamas, 현재값 옆에 추세를 두라는 곳은 PatternFly · Salesforce 다.

### 내 기록 맨 위 판

프로필 구역 상자를 다섯 구역에 입힌 지금 화면과 함께, 맨 위 「최고 기록 · 누적 요약」 을 세 안으로 올린다. 아래 세 구역은 지금 그대로 둔다. 안 1 은 TETR.IO 40 LINES(큰 기록 · 달성 시점 · 오른쪽 전역 순위 · 2열 점선 목록, 누적을 한 상자에), 안 2 는 Chess.com 통계(제목 줄 오른쪽 큰 값 + 변화 · 추이 그래프 · 순위 줄 · 세로선 칸), 안 3 은 osu! 점수 쪽(큰 랭크 글자 · 큰 점수 · 세로 메타 · 판정 줄)이다. 값은 Chrome 로그인 상태에서 읽은 Altale Real 내 기록이고, 내 순위는 랭킹 탭의 7 / 11 이다. 안 2 의 그래프 점과 변화 값은 예시다(이 곡 최고 점수 이력이 1건). CSS 와 사진은 `v2/rec/css` · `v2/rec/shots`, 찍은 코드는 `v2/rec/shot-rec.mjs` · `build.mjs` 다.

## 채보 뷰어(다시 시작)

폭 1440, 로그인하지 않은 화면이다. 캡처는 `~/noslog-research/desktop-viewer/ref/` · `ref2/` · `ds/`, 실제 화면 사진은 `real/` 에 있다. 모두 직접 열어 보고 재생 구조가 보인 곳만 셌다. 실제 서비스 30곳 · 디자인 시스템 5곳이다.

| 구조                                  | 곳 수 | 어디                                                                                                           |
| ------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| 무대 + 오른쪽 열                      | 10    | YouTube · 니코니코 · TED · MIT OCW · Chess.com · Lichess TV · Lichess 분석 · Kick · Steam · TradingView 차트   |
| 무대 바탕 띠 또는 전체 창 + 아래 정보 | 9     | Internet Archive · PeerTube · Streamable · BeatSaver 뷰어 · Signal · Song Maker · BeepBox · Excalidraw · Windy |
| 왼쪽 패널 + 무대                      | 7     | Flat.io · Desmos · GeoGebra · Ultimate Guitar · three.js 예제 · Google Maps · Monaco                           |
| 위 제목 + 무대                        | 4     | HookTheory · Songsterr · 8notes · Wikimedia Commons                                                            |

디자인 시스템은 Apple HIG Playing video · Material 3 Supporting pane · Primer Layout · PatternFly Drawer · Fluent Layout 이다. 재생 화면을 직접 다룬 곳은 Apple 하나다.

막혀서 세지 않은 곳: Vimeo · Musescore · Masterclass · Shadertoy · CodePen · Chordify · Udemy · Arcaea 위키 · Pexels · Pixabay · Rumble · Crunchyroll · Flightradar24 · HLTV · Online Sequencer(캡차), Replit · OP.GG · Figma(접근 거부), Bilibili · 치지직 · Twitch · Odysee · Noteflight · Soundslice · Sketchfab · 네이버TV · Dailymotion · Tubi · BBC iPlayer · Viki · Apple TV(영상 없음 · 지역 · 로그인), Khan Academy · SoundCloud · Plex · TikTok · Wavve · ABEMA · Flowkey · Chess.com 분석 · Strava · NPR(팝업이 화면을 가림), chessgames.com(요청 제한). 찍었지만 재생 화면이 아니라 뺀 곳: Coursera · Loom · Linear · Descript · Spline · Bemuse · GeoGuessr · Laftel · TVING · TVer · NASA · Tudum · SOOP · Tenhou · sdvx.in · YouTube Music.

### 첫 화면 판 실제 화면

폭 1440 · 높이 900 이고 의견 네 줄은 표시용 값이다. 지금 무대는 1138×640(폭 1056 에서 1008)이다.

| 안               | 무대(1440) | 무대(1056) | 사진에서 본 것                                       |
| ---------------- | ---------- | ---------- | ---------------------------------------------------- |
| YouTube          | 1046×588   | 662        | 의견이 재생 옆, 제목 묶음이 첫 화면 끝에 걸린다      |
| Chess.com        | 1028×578   | 644        | 제목 · 의견이 첫 화면에 다 들어오고 무대 아래가 빈다 |
| Flat.io          | 1042×586   | 658        | 첫 화면에 다 들어오고 전체 악보와 패널이 높이를 쓴다 |
| Internet Archive | 1272×716   | 1008       | 무대가 가장 크고 의견은 스크롤해야 보인다            |
| HookTheory       | 1000×563   | 704        | 무대가 324 에서 시작해 재생 막대가 첫 화면 끝이다    |
