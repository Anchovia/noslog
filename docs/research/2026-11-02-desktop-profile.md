# 프로필 탭 데스크톱 뼈대 실측

프로필 개요 · 기록 · 통계 · 활동 · 업적 탭의 넓은 폭 뼈대(폭 · 열 구성 · 사이드바 · 표 열)를 고르려고 잰 값이다. 확인 날짜는 모두 2026-11-02, 창 폭 1440 × 900, 로그인 없는 headless Playwright 기본 설정이다. 캡처는 `~/noslog-research/desktop-profile/` 에 있다.

- 내용 폭은 머리글 · 푸터를 뺀 글자의 왼쪽 끝부터 오른쪽 끝까지 잰 값이다.
- 열은 나란히 놓인 큰 묶음(폭 120 · 높이 240 이상) 가운데 넓이가 가장 큰 묶음의 폭이다. 값이 없으면 자동 측정이 찾지 못한 것이다.
- 「막힘」 은 HTTP 400 이상 · 캡차 · 로그인 벽 · 글자가 거의 없는 화면이고 세지 않는다.

## 곳별 측정

| 서비스                 | 탭            | URL                                                                                                                   | HTTP               | 내용 폭 | 열             | 캡처    |
| ---------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------ | ------- | -------------- | ------- |
| osu!                   | 개요          | https://osu.ppy.sh/users/2                                                                                            | 200                | 888     | null           | 0.jpg   |
| osu!                   | 기록          | https://osu.ppy.sh/users/124493/osu#top_ranks                                                                         | 200                | 900     | [890,310,319]  | 1.jpg   |
| osu!                   | 업적          | https://osu.ppy.sh/users/124493/osu#medals                                                                            | 200                | 900     | [890,310,319]  | 2.jpg   |
| BeatLeader             | 개요          | https://beatleader.com/u/76561198980531722                                                                            | 200                | 710     | null           | 4.jpg   |
| Quaver                 | 개요          | https://quavergame.com/user/1                                                                                         | 200                | 1144    | [1440,1216]    | 6.jpg   |
| ScoreSaber             | 개요          | https://scoresaber.com/u/76561198980531722                                                                            | 403                | 막힘    |                | 3.jpg   |
| TETR.IO Stats          | 개요          | https://ch.tetr.io/u/czsmall0402                                                                                      | 403                | 막힘    |                | 9.jpg   |
| Monkeytype             | 개요          | https://monkeytype.com/profile/miodec                                                                                 | 200                | 1257    | null           | 8.jpg   |
| Chess.com              | 통계          | https://www.chess.com/stats/overview/hikaru                                                                           | 200                | 956     | [170,1270]     | 11.jpg  |
| Chess.com              | 개요          | https://www.chess.com/member/hikaru                                                                                   | 200                | 1051    | [170,1270]     | 10.jpg  |
| Chess.com              | 기록          | https://www.chess.com/games/archive/hikaru                                                                            | 200                | 964     | [170,1270]     | 12.jpg  |
| Lichess                | 개요          | https://lichess.org/@/DrNykterstein                                                                                   | 403                | 막힘    |                | 13.jpg  |
| OP.GG                  | 통계          | https://op.gg/lol/summoners/kr/Hide%20on%20bush-KR1/champions                                                         | 403                | 막힘    |                | 17.jpg  |
| OP.GG                  | 개요          | https://op.gg/lol/summoners/kr/Hide%20on%20bush-KR1                                                                   | 403                | 막힘    |                | 16.jpg  |
| Lichess                | 기록          | https://lichess.org/@/DrNykterstein/all                                                                               | 200                | 456     | null           | 14.jpg  |
| Tracker.gg             | 개요          | https://tracker.gg/valorant/profile/riot/TenZ%23000/overview                                                          | 403                | 막힘    |                | 20.jpg  |
| U.GG                   | 개요          | https://u.gg/lol/profile/kr1/hide%20on%20bush-kr1/overview                                                            | 403                | 막힘    |                | 18.jpg  |
| Lichess                | 통계          | https://lichess.org/@/DrNykterstein/perf/blitz                                                                        | 403                | 막힘    |                | 15.jpg  |
| Dotabuff               | 개요          | https://www.dotabuff.com/players/105248644                                                                            | 403                | 막힘    |                | 26.jpg  |
| Dotabuff               | 기록          | https://www.dotabuff.com/players/105248644/matches                                                                    | 403                | 막힘    |                | 27.jpg  |
| OpenDota               | 통계          | https://www.opendota.com/players/105248644/heroes                                                                     | 200                | 1317    | null           | 23.jpg  |
| HLTV                   | 개요          | https://www.hltv.org/player/11893/zywoo                                                                               | 403                | 막힘    |                | 28.jpg  |
| Speedrun.com           | 기록          | https://www.speedrun.com/users/cheese?view=runs                                                                       | 403                | 막힘    |                | 35.jpg  |
| FACEIT                 | 개요          | https://www.faceit.com/en/players/s1mple                                                                              | 403                | 막힘    |                | 31.jpg  |
| Speedrun.com           | 개요          | https://www.speedrun.com/users/cheese                                                                                 | 403                | 막힘    |                | 34.jpg  |
| Warcraft Logs          | 개요          | https://www.warcraftlogs.com/character/us/illidan/maximum                                                             | 403                | 막힘    |                | 33.jpg  |
| Liquipedia             | 개요          | https://liquipedia.net/valorant/TenZ                                                                                  | 403                | 막힘    |                | 30.jpg  |
| Backloggd              | 기록          | https://backloggd.com/u/cole/games/                                                                                   | 200                | 막힘    |                | 39.jpg  |
| Backloggd              | 개요          | https://backloggd.com/u/cole/                                                                                         | 200                | 막힘    |                | 38.jpg  |
| Loawa                  | 개요          | https://loawa.com/char/%EB%B2%A0%EB%A5%B4%EC%84%B8%EB%A5%B4%ED%82%A4                                                  | 403                | 막힘    |                | 37.jpg  |
| Steam                  | 개요          | https://steamcommunity.com/id/gabelogannewell                                                                         | 200                | 169     | null           | 40.jpg  |
| Maple.GG               | 개요          | https://maple.gg/u/%EC%95%84%EB%8D%B8                                                                                 | 200                | 1056    | [1440,1120]    | 36.jpg  |
| PSNProfiles            | 개요          | https://psnprofiles.com/Hakoom                                                                                        | 403                | 막힘    |                | 43.jpg  |
| PSNProfiles            | 업적          | https://psnprofiles.com/trophies/1-resident-evil-4                                                                    | 403                | 막힘    |                | 44.jpg  |
| TrueAchievements       | 개요          | https://www.trueachievements.com/gamer/Stallion83                                                                     | 403                | 막힘    |                | 45.jpg  |
| Exophase               | 개요          | https://www.exophase.com/user/Hakoom/                                                                                 | 403                | 막힘    |                | 47.jpg  |
| Exophase               | 업적          | https://www.exophase.com/game/fortnite-xbox/achievements/                                                             | 403                | 막힘    |                | 48.jpg  |
| TrueAchievements       | 업적          | https://www.trueachievements.com/gamer/Stallion83/achievements                                                        | 403                | 막힘    |                | 46.jpg  |
| Steam                  | 업적          | https://steamcommunity.com/id/gabelogannewell/badges                                                                  | 200                | 169     | null           | 42.jpg  |
| Steam                  | 업적          | https://steamcommunity.com/stats/730/achievements                                                                     | 200                | 1168    | [280,1440]     | 41.jpg  |
| Duolingo               | 개요          | https://www.duolingo.com/profile/luis                                                                                 | 200                | 막힘    |                | 53.jpg  |
| RetroAchievements      | 개요          | https://retroachievements.org/user/Scott                                                                              | 403                | 막힘    |                | 49.jpg  |
| RetroAchievements      | 업적          | https://retroachievements.org/game/1                                                                                  | 403                | 막힘    |                | 50.jpg  |
| Xbox Achievements      | 업적          | https://www.xboxachievements.com/game/halo-infinite/achievements/                                                     | 403                | 막힘    |                | 52.jpg  |
| RetroAchievements      | 통계          | https://retroachievements.org/user/Scott/progress                                                                     | 403                | 막힘    |                | 51.jpg  |
| GitLab                 | 활동          | https://gitlab.com/users/sytses/activity                                                                              | 200                | 1097    | [232,1192]     | 59.jpg  |
| GitLab                 | 개요          | https://gitlab.com/sytses                                                                                             | 200                | 1129    | [232,1192]     | 58.jpg  |
| Stack Overflow         | 업적          | https://stackoverflow.com/users/22656/jon-skeet?tab=badges                                                            | 403                | 막힘    |                | 61.jpg  |
| Stack Overflow         | 개요          | https://stackoverflow.com/users/22656/jon-skeet                                                                       | 403                | 막힘    |                | 60.jpg  |
| Stack Overflow         | 활동          | https://stackoverflow.com/users/22656/jon-skeet?tab=topactivity                                                       | 403                | 막힘    |                | 62.jpg  |
| Stack Overflow         | 기록          | https://stackoverflow.com/users/22656/jon-skeet?tab=answers                                                           | 403                | 막힘    |                | 63.jpg  |
| LeetCode               | 개요          | https://leetcode.com/u/lee215/                                                                                        | 403                | 막힘    |                | 64.jpg  |
| Codeforces             | 기록          | https://codeforces.com/contests/with/tourist                                                                          | 403                | 막힘    |                | 66.jpg  |
| AtCoder                | 개요          | https://atcoder.jp/users/tourist                                                                                      | 200                | 1236    | [280,840]      | 68.jpg  |
| Codeforces             | 통계          | https://codeforces.com/submissions/tourist                                                                            | 403                | 막힘    |                | 67.jpg  |
| AtCoder                | 기록          | https://atcoder.jp/users/tourist/history                                                                              | 200                | 1225    | null           | 69.jpg  |
| Codewars               | 업적          | https://www.codewars.com/users/g964/badges                                                                            | 200                | 986     | null           | 72.jpg  |
| Codewars               | 통계          | https://www.codewars.com/users/g964/stats                                                                             | 200                | 850     | null           | 71.jpg  |
| Codewars               | 개요          | https://www.codewars.com/users/g964                                                                                   | 200                | 850     | null           | 70.jpg  |
| Kaggle                 | 개요          | https://www.kaggle.com/anokas                                                                                         | 200                | 1404    | [798,266]      | 73.jpg  |
| Kaggle                 | 기록          | https://www.kaggle.com/anokas/competitions                                                                            | 200                | 1404    | [798,266]      | 74.jpg  |
| Hugging Face           | 개요          | https://huggingface.co/thomwolf                                                                                       | 200                | 1236    | [294,930]      | 78.jpg  |
| Exercism               | 개요          | https://exercism.org/profiles/ErikSchierboom                                                                          | 200                | 1337    | [650,600]      | 80.jpg  |
| npm                    | 개요          | https://www.npmjs.com/~sindresorhus                                                                                   | 403                | 막힘    |                | 79.jpg  |
| Exercism               | 업적          | https://exercism.org/profiles/ErikSchierboom/badges                                                                   | 200                | 1286    | null           | 81.jpg  |
| HackerRank             | 개요          | https://www.hackerrank.com/profile/tourist                                                                            | 403                | 막힘    |                | 82.jpg  |
| solved.ac              | 개요          | https://solved.ac/profile/koosaga                                                                                     | 403                | 막힘    |                | 75.jpg  |
| solved.ac              | 업적          | https://solved.ac/profile/koosaga/badges                                                                              | 403                | 막힘    |                | 76.jpg  |
| V-ARCHIVE              | 개요          | https://v-archive.net/archive/carol                                                                                   | 404                | 막힘    |                | 7.jpg   |
| OpenDota               | 기록          | https://www.opendota.com/players/105248644/matches                                                                    | 200                | 1317    | null           | 22.jpg  |
| OpenDota               | 개요          | https://www.opendota.com/players/105248644                                                                            | 200                | 1317    | null           | 21.jpg  |
| Etterna Online         | 개요          | https://etternaonline.com/users/Mina                                                                                  | 404                | 막힘    |                | 5.jpg   |
| OpenDota               | 활동          | https://www.opendota.com/players/105248644/activity                                                                   | 200                | 1317    | null           | 24.jpg  |
| OpenDota               | 기록          | https://www.opendota.com/players/105248644/records                                                                    | 200                | 1317    | null           | 25.jpg  |
| FOW.KR                 | 개요          | https://fow.kr/find/hide%20on%20bush                                                                                  | 200                | 976     | null           | 19.jpg  |
| VLR.gg                 | 개요          | https://www.vlr.gg/player/9/tenz                                                                                      | 200                | 1168    | [796,320]      | 29.jpg  |
| Raider.IO              | 개요          | https://raider.io/characters/us/illidan/Maximum                                                                       | 200                | 1310    | [1090,300]     | 32.jpg  |
| GitHub                 | 개요          | https://github.com/torvalds                                                                                           | 200                | 1144    | [296,896]      | 54.jpg  |
| GitHub                 | 활동          | https://github.com/sindresorhus                                                                                       | 200                | 1168    | [296,896]      | 55.jpg  |
| GitHub                 | 기록          | https://github.com/torvalds?tab=repositories                                                                          | 200                | 1183    | [296,896]      | 56.jpg  |
| GitHub                 | 업적          | https://github.com/sindresorhus?tab=achievements                                                                      | 404                | 막힘    |                | 57.jpg  |
| Codeforces             | 개요          | https://codeforces.com/profile/tourist                                                                                | 안 염(같은 곳 403) | 막힘    |                | -       |
| Baekjoon               | 개요          | https://www.acmicpc.net/user/koosaga                                                                                  | 404                | 막힘    |                | 77.jpg  |
| Khan Academy           | 업적          | https://www.khanacademy.org/profile/sal/                                                                              | 200                | 1261    | [251,837]      | 83.jpg  |
| Velog                  | 개요          | https://velog.io/@velopert                                                                                            | 200                | 984     | [184,768]      | 84.jpg  |
| Last.fm                | 개요          | https://www.last.fm/user/RJ                                                                                           | 200                | 1267    | [800,400]      | 85.jpg  |
| Last.fm                | 기록          | https://www.last.fm/user/RJ/library                                                                                   | 200                | 1267    | [800,400]      | 86.jpg  |
| Last.fm                | 통계          | https://www.last.fm/user/RJ/library/artists                                                                           | 200                | 1267    | [800,400]      | 87.jpg  |
| Last.fm                | 활동          | https://www.last.fm/user/RJ/listening-report/week                                                                     | 200                | 1287    | [383,383,383]  | 88.jpg  |
| Letterboxd             | 개요          | https://letterboxd.com/dave/                                                                                          | 403                | 막힘    |                | 89.jpg  |
| Letterboxd             | 기록          | https://letterboxd.com/dave/films/diary/                                                                              | 안 염(같은 곳 403) | 막힘    |                | -       |
| Letterboxd             | 통계          | https://letterboxd.com/dave/stats/                                                                                    | 안 염(같은 곳 403) | 막힘    |                | -       |
| Trakt                  | 개요          | https://trakt.tv/users/justin                                                                                         | 403                | 막힘    |                | 92.jpg  |
| Trakt                  | 기록          | https://trakt.tv/users/justin/history                                                                                 | 안 염(같은 곳 403) | 막힘    |                | -       |
| AniList                | 개요          | https://anilist.co/user/Josh/                                                                                         | 200                | 1030    | null           | 94.jpg  |
| AniList                | 통계          | https://anilist.co/user/Josh/stats/anime/overview                                                                     | 200                | 1030    | null           | 95.jpg  |
| AniList                | 기록          | https://anilist.co/user/Josh/animelist                                                                                | 200                | 1030    | null           | 96.jpg  |
| MyAnimeList            | 개요          | https://myanimelist.net/profile/Xinil                                                                                 | 200                | 1042    | [234,808]      | 97.jpg  |
| MyAnimeList            | 기록          | https://myanimelist.net/animelist/Xinil                                                                               | 200                | 992     | null           | 98.jpg  |
| Goodreads              | 개요          | https://www.goodreads.com/user/show/1-otis-chandler                                                                   | 403                | 막힘    |                | 99.jpg  |
| Discogs                | 개요          | https://www.discogs.com/user/rodneyfool                                                                               | 403                | 막힘    |                | 100.jpg |
| Untappd                | 개요          | https://untappd.com/user/gregavola                                                                                    | 200                | 1053    | null           | -       |
| Untappd                | 업적          | https://untappd.com/user/gregavola/badges                                                                             | 200                | 막힘    |                | 102.jpg |
| Untappd                | 기록          | https://untappd.com/user/gregavola/beers                                                                              | 200                | 막힘    |                | 103.jpg |
| IMDb                   | 개요          | https://www.imdb.com/user/ur0000001/                                                                                  | 403                | 막힘    |                | 104.jpg |
| Rate Your Music        | 개요          | https://rateyourmusic.com/~sharifi                                                                                    | 403                | 막힘    |                | 105.jpg |
| ESPN                   | 개요          | https://www.espn.com/nba/player/_/id/1966/lebron-james                                                                | 200                | 1188    | [220,660,300]  | 106.jpg |
| ESPN                   | 통계          | https://www.espn.com/nba/player/stats/_/id/1966/lebron-james                                                          | 200                | 1192    | [900,300]      | 107.jpg |
| ESPN                   | 기록          | https://www.espn.com/nba/player/gamelog/_/id/1966/lebron-james                                                        | 200                | 1192    | [900,300]      | 108.jpg |
| Basketball Reference   | 개요          | https://www.basketball-reference.com/players/j/jamesle01.html                                                         | 200                | 1430    | [912,503]      | 109.jpg |
| NBA.com                | 개요          | https://www.nba.com/player/2544/lebron-james                                                                          | 403                | 막힘    |                | 110.jpg |
| NBA.com                | 통계          | https://www.nba.com/stats/player/2544                                                                                 | 안 염(같은 곳 403) | 막힘    |                | -       |
| FotMob                 | 개요          | https://www.fotmob.com/players/30981/lionel-messi                                                                     | 200                | 1236    | [848,416]      | 112.jpg |
| Sofascore              | 개요          | https://www.sofascore.com/player/lionel-messi/12994                                                                   | 200                | 1428    | [1104,312]     | 113.jpg |
| Transfermarkt          | 개요          | https://www.transfermarkt.com/lionel-messi/profil/spieler/28003                                                       | 403                | 막힘    |                | 114.jpg |
| FBref                  | 개요          | https://fbref.com/en/players/d70ce98e/Lionel-Messi                                                                    | 403                | 막힘    |                | 115.jpg |
| UFC                    | 개요          | https://www.ufc.com/athlete/jon-jones                                                                                 | 200                | 1290    | [595,595]      | 116.jpg |
| ATP Tour               | 개요          | https://www.atptour.com/en/players/novak-djokovic/d643/overview                                                       | 403                | 막힘    |                | 117.jpg |
| Formula 1              | 개요          | https://www.formula1.com/en/drivers/max-verstappen                                                                    | 200                | 1344    | [660,660]      | 118.jpg |
| Strava                 | 개요          | https://www.strava.com/athletes/1                                                                                     | 404                | 막힘    |                | 119.jpg |
| Komoot                 | 개요          | https://www.komoot.com/user/1                                                                                         | 200                | 1166    | [400,888]      | 120.jpg |
| parkrun                | 기록          | https://www.parkrun.org.uk/parkrunner/1/all/                                                                          | 405                | 막힘    |                | 121.jpg |
| YouTube                | 개요          | https://www.youtube.com/@mkbhd                                                                                        | 200                | 1405    | [240,1200]     | 122.jpg |
| Twitch                 | 개요          | https://www.twitch.tv/shroud/about                                                                                    | 200                | 1042    | [340,340]      | 123.jpg |
| Reddit                 | 개요          | https://www.reddit.com/user/spez/                                                                                     | 200                | 막힘    |                | 124.jpg |
| TikTok                 | 개요          | https://www.tiktok.com/@khaby.lame                                                                                    | 200                | 563     | [240,1200]     | 125.jpg |
| Medium                 | 개요          | https://medium.com/@ev                                                                                                | 403                | 막힘    |                | 126.jpg |
| DEV                    | 개요          | https://dev.to/ben                                                                                                    | 200                | 959     | [325,651]      | 127.jpg |
| Product Hunt           | 개요          | https://www.producthunt.com/@rrhoover                                                                                 | 403                | 막힘    |                | 128.jpg |
| Dribbble               | 개요          | https://dribbble.com/simplebits                                                                                       | 200                | 1265    | [636,600]      | 129.jpg |
| Behance                | 개요          | https://www.behance.net/gallery                                                                                       | 400                | 막힘    |                | 130.jpg |
| SoundCloud             | 개요          | https://soundcloud.com/flume                                                                                          | 200                | 1241    | [880,360]      | 131.jpg |
| Mastodon               | 개요          | https://mastodon.social/@Gargron                                                                                      | 200                | 620     | [320,600,320]  | 132.jpg |
| Bluesky                | 개요          | https://bsky.app/profile/jay.bsky.team                                                                                | 200                | 885     | [600,575]      | 133.jpg |
| Pinterest              | 개요          | https://www.pinterest.com/pinterest/                                                                                  | 200                | 1353    | [576,640]      | 134.jpg |
| Tumblr                 | 개요          | https://staff.tumblr.com/                                                                                             | 403                | 막힘    |                | 135.jpg |
| SAP Fiori              | 디자인 시스템 | https://www.sap.com/design-system/fiori-design-web/v1-136/foundations/best-practices/floorplans/object-page-floorplan | 403                | 막힘    |                | 136.jpg |
| Primer                 | 디자인 시스템 | https://primer.style/product/components/page-layout/                                                                  | 200                | 1402    | [300,800,280]  | 137.jpg |
| Polaris                | 디자인 시스템 | https://polaris-react.shopify.com/patterns/resource-details-layout                                                    | 200                | 767     | [284,1140]     | 138.jpg |
| Ant Design Pro         | 디자인 시스템 | https://preview.pro.ant.design/account/center/                                                                        | 200                | 1311    | [329,799]      | 139.jpg |
| Ant Design             | 디자인 시스템 | https://ant.design/docs/spec/layout                                                                                   | 200                | 1388    | [300,1140]     | 140.jpg |
| Material 3             | 디자인 시스템 | https://m3.material.io/foundations/layout/canonical-layouts/overview                                                  | 404                | 막힘    |                | 141.jpg |
| Carbon                 | 디자인 시스템 | https://carbondesignsystem.com/guidelines/2x-grid/overview/                                                           | 200                | 1101    | [247,804]      | 142.jpg |
| Atlassian              | 디자인 시스템 | https://atlassian.design/foundations/grid-beta/applying-grid                                                          | 200                | 753     | [756,184]      | 143.jpg |
| Spectrum 2             | 디자인 시스템 | https://spectrum.adobe.com/page/responsive-grid/                                                                      | 200                | 994     | [473,473]      | 144.jpg |
| Fluent 2               | 디자인 시스템 | https://fluent2.microsoft.design/layout                                                                               | 200                | 1087    | [260,1056]     | 145.jpg |
| PatternFly             | 디자인 시스템 | https://www.patternfly.org/foundations-and-styles/layouts/                                                            | 404                | 막힘    |                | 146.jpg |
| Salesforce Lightning   | 디자인 시스템 | https://www.lightningdesignsystem.com/guidelines/layout/                                                              | 200                | 848     | [424,424]      | 147.jpg |
| Elastic EUI            | 디자인 시스템 | https://eui.elastic.co/docs/templates/page-template/                                                                  | 404                | 막힘    |                | 148.jpg |
| GOV.UK                 | 디자인 시스템 | https://design-system.service.gov.uk/styles/layout/                                                                   | 200                | 1431    | [260,840]      | 149.jpg |
| Geist                  | 디자인 시스템 | https://vercel.com/geist/grid                                                                                         | 200                | 1132    | [960,260]      | 150.jpg |
| Tailwind Plus          | 디자인 시스템 | https://tailwindcss.com/plus/ui-blocks/application-ui/page-examples/detail-screens                                    | 200                | 막힘    |                | 151.jpg |
| Bootstrap              | 디자인 시스템 | https://getbootstrap.com/docs/5.3/layout/containers/                                                                  | 200                | 1028    | [212,1040]     | 152.jpg |
| Mantine                | 디자인 시스템 | https://ui.mantine.dev/category/app-shell/                                                                            | 404                | 막힘    |                | 153.jpg |
| MUI                    | 디자인 시스템 | https://mui.com/material-ui/getting-started/templates/                                                                | 200                | 1029    | [300,1140]     | 154.jpg |
| Radix Themes           | 디자인 시스템 | https://www.radix-ui.com/themes/docs/components/container                                                             | 200                | 1143    | null           | 155.jpg |
| shadcn/ui              | 디자인 시스템 | https://ui.shadcn.com/blocks                                                                                          | 200                | 1279    | null           | 156.jpg |
| Apple HIG              | 디자인 시스템 | https://developer.apple.com/design/human-interface-guidelines/layout                                                  | 200                | 914     | [200,780]      | 157.jpg |
| TMDB                   | 개요          | https://www.themoviedb.org/u/travisbell                                                                               | 200                | 1403    | null           | 158.jpg |
| TMDB                   | 통계          | https://www.themoviedb.org/u/travisbell/stats                                                                         | 404                | 막힘    |                | 159.jpg |
| Kitsu                  | 개요          | https://kitsu.app/users/josh                                                                                          | 403                | 막힘    |                | 160.jpg |
| Bangumi                | 개요          | https://bgm.tv/user/sai                                                                                               | 200                | 1268    | [817,350]      | 161.jpg |
| VNDB                   | 개요          | https://vndb.org/u2                                                                                                   | 200                | 1198    | null           | 162.jpg |
| BoardGameGeek          | 개요          | https://boardgamegeek.com/user/Aldie                                                                                  | 403                | 막힘    |                | 163.jpg |
| Bandcamp               | 개요          | https://bandcamp.com/andrewjw                                                                                         | 200                | 막힘    |                | 164.jpg |
| Hacker News            | 개요          | https://news.ycombinator.com/user?id=pg                                                                               | 200                | 81      | null           | 165.jpg |
| CodePen                | 개요          | https://codepen.io/chriscoyier                                                                                        | 403                | 막힘    |                | 166.jpg |
| Unsplash               | 통계          | https://unsplash.com/@anniespratt/stats                                                                               | 403                | 막힘    |                | 167.jpg |
| Unsplash               | 개요          | https://unsplash.com/@anniespratt                                                                                     | 안 염(같은 곳 403) | 막힘    |                | -       |
| Flickr                 | 개요          | https://www.flickr.com/people/flickr/                                                                                 | 200                | 1351    | null           | 169.jpg |
| DeviantArt             | 개요          | https://www.deviantart.com/wlop                                                                                       | 200                | 1320    | [660,600]      | 170.jpg |
| ArtStation             | 개요          | https://www.artstation.com/wlop                                                                                       | 403                | 막힘    |                | 171.jpg |
| itch.io                | 개요          | https://itch.io/profile/leafo                                                                                         | 200                | 1138    | null           | 172.jpg |
| Modrinth               | 개요          | https://modrinth.com/user/Prospector                                                                                  | 200                | 1249    | [908,300]      | 173.jpg |
| NameMC                 | 개요          | https://namemc.com/profile/Notch                                                                                      | 403                | 막힘    |                | 174.jpg |
| Roblox                 | 개요          | https://www.roblox.com/users/1/profile                                                                                | 200                | 1055    | null           | 175.jpg |
| MLB.com                | 개요          | https://www.mlb.com/player/shohei-ohtani-660271                                                                       | 200                | 1292    | [406,406,406]  | 176.jpg |
| MLB.com                | 통계          | https://www.mlb.com/player/shohei-ohtani-660271?stats=career-r-hitting-mlb                                            | 200                | 1292    | [406,406,406]  | 177.jpg |
| Baseball Savant        | 통계          | https://baseballsavant.mlb.com/savant-player/shohei-ohtani-660271                                                     | 200                | 1252    | [412,412,412]  | 178.jpg |
| NFL.com                | 개요          | https://www.nfl.com/players/patrick-mahomes/                                                                          | 200                | 1395    | [208,832,208]  | 179.jpg |
| NFL.com                | 통계          | https://www.nfl.com/players/patrick-mahomes/stats/                                                                    | 200                | 1300    | null           | 180.jpg |
| NHL.com                | 개요          | https://www.nhl.com/player/connor-mcdavid-8478402                                                                     | 200                | 1272    | [884,300]      | 181.jpg |
| PGA Tour               | 개요          | https://www.pgatour.com/player/46046/scottie-scheffler                                                                | 403                | 막힘    |                | 182.jpg |
| Premier League         | 개요          | https://www.premierleague.com/en/players/118748/mohamed-salah/overview                                                | 200                | 1391    | [469,939]      | 183.jpg |
| Cricinfo               | 개요          | https://www.espncricinfo.com/cricketers/virat-kohli-253802                                                            | 403                | 막힘    |                | 184.jpg |
| Pro Football Reference | 통계          | https://www.pro-football-reference.com/players/M/MahoPa00.htm                                                         | 403                | 막힘    |                | 185.jpg |
| Hockey Reference       | 통계          | https://www.hockey-reference.com/players/m/mcdavco01.html                                                             | 200                | 1428    | [912,503]      | 186.jpg |
| WhoScored              | 개요          | https://www.whoscored.com/Players/11119/Show/Lionel-Messi                                                             | 403                | 막힘    |                | 187.jpg |
| Understat              | 통계          | https://understat.com/player/2097                                                                                     | -                  | 막힘    |                | -       |
| DeepLoL                | 개요          | https://www.deeplol.gg/summoner/KR/Hide%20on%20bush-KR1                                                               | 200                | 1027    | [159,1112,159] | 189.jpg |
| LoLCHESS               | 개요          | https://lolchess.gg/profile/kr/hide%20on%20bush-kr1                                                                   | 200                | 1065    | [320,560,180]  | 190.jpg |
| DAK.GG                 | 개요          | https://dak.gg/er/players/Hide                                                                                        | 200                | 1031    | [328,740]      | 191.jpg |
| Mobalytics             | 개요          | https://mobalytics.gg/lol/profile/kr/hide%20on%20bush-kr1/overview                                                    | 403                | 막힘    |                | 192.jpg |
| Steam Hunters          | 업적          | https://steamhunters.com/apps/730/achievements                                                                        | 403                | 막힘    |                | 193.jpg |
| TrueSteamAchievements  | 업적          | https://truesteamachievements.com/game/Counter-Strike-2/achievements                                                  | 403                | 막힘    |                | 194.jpg |
| Completionist.me       | 업적          | https://completionist.me/steam/app/730/achievements                                                                   | 403                | 막힘    |                | 195.jpg |
| Hypixel Stats          | 개요          | https://plancke.io/hypixel/player/stats/Technoblade                                                                   | 403                | 막힘    |                | 196.jpg |
| HowLongToBeat          | 개요          | https://howlongtobeat.com/user/Hltb                                                                                   | 403                | 막힘    |                | 197.jpg |
| Hardcover              | 개요          | https://hardcover.app/@adam                                                                                           | 403                | 막힘    |                | 198.jpg |
| Microsoft Learn        | 업적          | https://learn.microsoft.com/en-us/users/satyanadella/achievements                                                     | 200                | 650     | [500,700]      | 199.jpg |
| Wikipedia              | 업적          | https://en.wikipedia.org/wiki/Wikipedia:Barnstars                                                                     | 200                | 912     | [196,912]      | 200.jpg |
| Stack Exchange         | 업적          | https://meta.stackexchange.com/help/badges                                                                            | 403                | 막힘    |                | 201.jpg |
| Mixcloud               | 개요          | https://www.mixcloud.com/Dimensions/                                                                                  | 200                | 1353    | [320,976]      | 202.jpg |
| Substack               | 개요          | https://substack.com/@platformer                                                                                      | 200                | 1336    | [568,568]      | 203.jpg |
| Replit                 | 개요          | https://replit.com/@amasad                                                                                            | 403                | 막힘    |                | 204.jpg |
| Observable             | 개요          | https://observablehq.com/@mbostock                                                                                    | 200                | 1342    | [256,1184]     | 205.jpg |
| TradingView            | 개요          | https://www.tradingview.com/u/TradingView/                                                                            | 200                | 1360    | null           | 206.jpg |
| Wakatime               | 활동          | https://wakatime.com/@wakatime                                                                                        | 404                | 막힘    |                | 207.jpg |
| osu!                   | 업적          | https://osu.ppy.sh/users/124493/osu?full=1#medals                                                                     | 200                | 900     | [608,309,280]  | 208.jpg |
| Steam                  | 업적          | https://steamcommunity.com/stats/440/achievements                                                                     | 200                | 1168    | null           | 209.jpg |
| Steam                  | 업적          | https://steamcommunity.com/id/robinwalker/badges                                                                      | 200                | 940     | null           | 210.jpg |
| Chess.com              | 업적          | https://www.chess.com/member/hikaru/awards                                                                            | 200                | 940     | [170,1270]     | 211.jpg |
| GitHub                 | 업적          | https://github.com/torvalds?tab=achievements                                                                          | 200                | 958     | [296,896]      | 212.jpg |
| DEV                    | 업적          | https://dev.to/badges                                                                                                 | 200                | 1192    | null           | 213.jpg |
| TMDB                   | 업적          | https://www.themoviedb.org/u/travisbell/badges                                                                        | 200                | 1287    | null           | 214.jpg |
| Kongregate             | 업적          | https://www.kongregate.com/accounts/jimgreer/badges                                                                   | 200                | 893     | null           | 215.jpg |
| Credly                 | 업적          | https://www.credly.com/organizations/ibm/badges                                                                       | 200                | 1083    | [700,200]      | 216.jpg |
| AniList                | 개요          | https://anilist.co/user/AniList/                                                                                      | 200                | 1225    | [428,572]      | 217.jpg |
| AniList                | 통계          | https://anilist.co/user/AniList/stats/anime/overview                                                                  | 200                | 1225    | null           | 218.jpg |
| AniList                | 기록          | https://anilist.co/user/AniList/animelist                                                                             | 200                | 1225    | null           | 219.jpg |
| AniList                | 업적          | https://anilist.co/user/AniList/favorites                                                                             | 200                | 1225    | null           | 220.jpg |
| ListenBrainz           | 활동          | https://listenbrainz.org/user/mr_monkey/                                                                              | 200                | 1400    | [190,1250]     | 221.jpg |
| ListenBrainz           | 통계          | https://listenbrainz.org/user/mr_monkey/stats/                                                                        | 200                | 1398    | [190,1250]     | 222.jpg |
| Codeberg               | 활동          | https://codeberg.org/fnetX                                                                                            | 200                | 1241    | [327,981]      | 223.jpg |
| Gitea                  | 활동          | https://gitea.com/lunny                                                                                               | 200                | 1245    | [327,981]      | 224.jpg |
| GitHub                 | 활동          | https://github.com/torvalds?tab=overview&from=2026-01-01                                                              | 200                | 1144    | [296,896]      | 225.jpg |
| Hugging Face           | 활동          | https://huggingface.co/thomwolf/activity/all                                                                          | 200                | 1234    | [294,930]      | 226.jpg |
| Exercism               | 활동          | https://exercism.org/profiles/ErikSchierboom/contributions                                                            | 200                | 1342    | null           | 227.jpg |
| TMDB                   | 기록          | https://www.themoviedb.org/u/travisbell/ratings                                                                       | 401                | 막힘    |                | 228.jpg |
| VNDB                   | 기록          | https://vndb.org/u2/ulist                                                                                             | 200                | 963     | null           | 229.jpg |
| Bangumi                | 기록          | https://bgm.tv/anime/list/sai                                                                                         | 200                | 1268    | [817,350]      | 230.jpg |
| Basketball Reference   | 기록          | https://www.basketball-reference.com/players/j/jamesle01/gamelog/2024                                                 | 200                | 1411    | [912,503]      | 231.jpg |
| MLB.com                | 기록          | https://www.mlb.com/player/shohei-ohtani-660271?stats=gamelogs-r-hitting-mlb                                          | 200                | 1292    | [406,406,406]  | 232.jpg |
| Mantine                | 디자인 시스템 | https://mantine.dev/core/container/                                                                                   | 200                | 1118    | [220,1188]     | 233.jpg |
| Chakra UI              | 디자인 시스템 | https://chakra-ui.com/docs/components/container                                                                       | 200                | 1338    | [256,876,256]  | 234.jpg |
| Base Web               | 디자인 시스템 | https://baseweb.design/components/layout-grid/                                                                        | 200                | 592     | [256,640]      | 235.jpg |

## 눈으로 확인한 뼈대

위 표의 값은 자동 측정이다. 아래는 캡처를 직접 열어 나눈 결과이고 시안의 수는 이 표를 쓴다. 괄호는 측정한 열 폭이다.

표본은 실제 서비스 54곳 · 디자인 시스템 17곳이다.

| 탭   | 모양                                         | 곳                                                                                                                                                                                                                                                                                         |
| ---- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 개요 | 전폭 머리 + 탭 + 주열 \| 오른쪽 옆열 (14곳)  | Chess.com · VLR.gg(796 \| 320) · OpenDota · ESPN(220 \| 660 \| 300) · GitLab · Last.fm(800 \| 400) · FotMob(848 \| 416) · Bangumi(817 \| 350) · SoundCloud(880 \| 360) · Kaggle(798 \| 266) · NHL.com(884 \| 300) · Modrinth(908 \| 300) · DeviantArt(660 \| 600) · Sofascore(1104 \| 312) |
| 개요 | 전폭 머리 + 탭 + 왼쪽 옆열 \| 주열 (4곳)     | DAK.GG(328 \| 740) · DeepLoL · Maple.GG · DEV(325 \| 651)                                                                                                                                                                                                                                  |
| 개요 | 왼쪽 고정 프로필 열 + 오른쪽 탭 · 내용 (6곳) | GitHub(296 \| 896) · Hugging Face(294 \| 930) · AtCoder(280 \| 840) · Observable(256 \| 1184) · Codeberg(327 \| 981) · Gitea(327 \| 981)                                                                                                                                                   |
| 개요 | 전폭 머리 + 탭 + 한 열 쌓기 (17곳)           | osu! · Quaver · Exercism · YouTube · TMDB · MLB.com · NFL.com · UFC · TradingView · Pinterest · Roblox · Flickr · itch.io · Codewars · BeatLeader · LoLCHESS · Monkeytype                                                                                                                  |
| 개요 | 해당 없음(피드 · 문서형) (8곳)               | Twitch · Mastodon · Bluesky · Substack · Velog · Hacker News · VNDB · Basketball Reference                                                                                                                                                                                                 |
| 기록 | 전폭 표 한 열 (6곳)                          | OpenDota(1198, 행 43) · AtCoder · MLB.com gamelog(1224, 행 49) · VNDB · Exercism · Chess.com                                                                                                                                                                                               |
| 기록 | 표 + 옆열 (4곳)                              | Last.fm(800 \| 400, 행 50) · Bangumi(817 \| 350) · ESPN(900 \| 300, 행 28–33) · Basketball Reference                                                                                                                                                                                       |
| 기록 | 왼쪽 프로필 열 + 목록 (4곳)                  | GitHub · Gitea · Kaggle · Hugging Face                                                                                                                                                                                                                                                     |
| 통계 | 같은 폭 3칸 줄 (3곳)                         | Baseball Savant(412 × 3) · ListenBrainz · Last.fm 리포트(383 × 3)                                                                                                                                                                                                                          |
| 통계 | 주 \| 옆 (3곳)                               | ESPN(900 \| 300) · Last.fm(800 \| 400) · Hockey Reference                                                                                                                                                                                                                                  |
| 통계 | 전폭 표 쌓기 (3곳)                           | OpenDota · NFL.com(행 40) · Chess.com                                                                                                                                                                                                                                                      |
| 통계 | 2칸 균등 (2곳)                               | Codewars · Exercism(650 \| 600)                                                                                                                                                                                                                                                            |
| 활동 | 달력 · 목록 전폭 (3곳)                       | OpenDota · Exercism · Last.fm 리포트                                                                                                                                                                                                                                                       |
| 활동 | 왼쪽 프로필 열 + 달력 · 타임라인 (2곳)       | GitHub · Hugging Face                                                                                                                                                                                                                                                                      |
| 활동 | 주열 \| 오른쪽 옆열 (2곳)                    | GitLab · ListenBrainz                                                                                                                                                                                                                                                                      |
| 업적 | 아이콘 + 이름 격자 (6곳)                     | Exercism(4칸) · TMDB(4칸) · Chess.com(4칸) · GitHub(3칸) · Kongregate(3칸) · DEV(5칸)                                                                                                                                                                                                      |
| 업적 | 한 열 목록 (1곳)                             | Steam(배지 940, 줄 79)                                                                                                                                                                                                                                                                     |

탭 아래부터 첫 내용까지는 DAK.GG 20 · Kaggle 41 이다. 구역 사이는 [공통 층 실측](./2026-11-02-desktop-foundation.md)의 자동 측정값을 썼다.

디자인 시스템 17곳: Primer · Ant Design · Ant Design Pro · Carbon · Atlassian · Fluent 2 · Salesforce Lightning · GOV.UK · Geist · Bootstrap · MUI · Radix Themes · shadcn/ui · Apple HIG · Mantine · Chakra UI · Base Web. 프로필 화면 예를 둔 곳은 Ant Design Pro Account Center(329 \| 799) 하나이고 나머지는 격자 · 컨테이너 문서다. Spectrum 2 와 Polaris 는 주소가 다른 쪽으로 넘어가 세지 않았다.

## 캡처를 열어 보고 뺀 곳

표에 HTTP 200 으로 적혔어도 아래는 세지 않았다.

| 곳                                                                                              | 이유                                                    |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Raider.IO                                                                                       | 캐릭터를 찾지 못한 오류 창                              |
| FOW.KR                                                                                          | 검색 결과 목록으로 넘어가 프로필이 아님                 |
| Steam 프로필 · 배지(42)                                                                         | 비공개 프로필. 업적 · 다른 사용자 배지 화면은 셈        |
| AniList                                                                                         | Josh 는 404, AniList 계정은 빈 화면                     |
| MyAnimeList · Formula 1 · Komoot · Premier League · Dribbble · Mixcloud · Khan Academy · Credly | 동의 창 · 안내 창이 화면을 가림                         |
| TikTok                                                                                          | 퍼즐 캡차                                               |
| Lichess                                                                                         | 로그인 벽 · 403                                         |
| Microsoft Learn                                                                                 | 프로필 없음                                             |
| Wikipedia                                                                                       | 업적 화면이 아니라 문서                                 |
| osu! 메달                                                                                       | 한 쪽 안의 구역이라 3000 · 7000 높이 안에 들어오지 않음 |

## 2열 화면의 구역 담기

이미 찍은 캡처를 다시 열어 나눴다. 새로 접속하지 않았다. 대상은 개요 탭에서 2열인 24곳이다. 24곳 모두 두 열이 따로 쌓이고 줄을 맞추지 않는다.

| 모양                            | 곳                                                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 구역마다 상자, 제목 안쪽 (10곳) | Chess.com · ESPN · FotMob · Sofascore · NHL.com · Modrinth · DAK.GG · DeepLoL · Maple.GG · DEV                                             |
| 구역마다 상자, 제목 바깥 (1곳)  | VLR.gg                                                                                                                                     |
| 상자 없음 (13곳)                | OpenDota · GitLab · Last.fm · Bangumi · SoundCloud · Kaggle · DeviantArt · GitHub · Hugging Face · AtCoder · Observable · Codeberg · Gitea |

기록 · 전적 · 스포츠 서비스 10곳만 보면 상자 9곳(VLR.gg 포함), 상자 없음 1곳(OpenDota)이다.

## 머리와 탭

찍어 둔 개요 캡처 48곳의 윗부분을 눈으로 나누고, 8곳은 값을 다시 쟀다(`~/noslog-research/desktop-profile/head-measure.json`). 커버 이미지를 쓰는 곳도 수치 자리만 보고 나눴다. NosLog 에는 커버 데이터가 없다.

| 항목      | 모양                         | 곳                                                                                                                                             |
| --------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 수치 자리 | 머리 오른쪽 (3곳, 근거 약함) | Quaver · ESPN · itch.io                                                                                                                        |
| 수치 자리 | 이름 아래 가로 (9곳)         | OpenDota · Last.fm · TradingView · Mastodon · Bluesky · Flickr · Roblox · DeviantArt · Pinterest                                               |
| 수치 자리 | 탭 위나 아래 별도 줄 (6곳)   | Chess.com · osu! · TMDB · NHL.com · Basketball Reference · BeatLeader                                                                          |
| 수치 자리 | 왼쪽 세로 열 (6곳)           | GitHub · Hugging Face · Observable · Gitea · Codeberg · AtCoder                                                                                |
| 탭        | 왼쪽 붙임 (14곳)             | GitHub · YouTube · ESPN · OpenDota · Chess.com · Exercism · TradingView · DeviantArt · Flickr · Last.fm · Kaggle · NHL.com · Mastodon · DAK.GG |
| 탭        | 오른쪽 붙임 (2곳)            | Quaver · MLB.com                                                                                                                               |
| 탭        | 가운데 (2곳)                 | TMDB · Velog                                                                                                                                   |
| 탭        | 전폭 균등 (2곳)              | Bluesky · Substack                                                                                                                             |
| 모드 전환 | 탭 줄 끝 세그먼트 (1곳)      | Quaver 4K · 7K                                                                                                                                 |
| 모드 전환 | 머리 오른쪽 위 (1곳)         | osu!                                                                                                                                           |
| 모드 전환 | 머리 안 셀렉트 (2곳)         | DAK.GG · LoLCHESS                                                                                                                              |

| 곳          | 그림   | 이름 글자 | 탭 줄 높이 · 글자  |
| ----------- | ------ | --------- | ------------------ |
| Quaver      | 100    | 미확인    | 48(항목 32) · 12.8 |
| OpenDota    | 124    | 28        | 48 · 12            |
| Exercism    | 128    | 31        | 61 · 18            |
| TradingView | 168    | 36        | 36 · 20            |
| Last.fm     | 170    | 30        | 미확인             |
| ESPN        | 220    | 32        | 44 · 14            |
| GitHub      | 296    | 32        | 항목 30 · 14       |
| Chess.com   | 미확인 | 22        | 48 · 14            |

## 머리의 계정 · 게임 이름

38곳을 한 곳씩 열어 머리 안 계정 링크와 이름을 쟀다. 원본은 `~/noslog-research/desktop-profile/id/id.jsonl`, 캡처는 같은 폴더다. Steam · Quaver · itch.io 는 실제로 올리거나 눌러 봤다.

| 항목             | 모양                            | 곳                                                                                                                                |
| ---------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 계정             | 아이콘만 (10곳)                 | Quaver 32 · TradingView 28 · Exercism 48 · Velog 32 · Monkeytype 30 · DEV 32 · BeatLeader 32 · OpenDota 30 · DeepLoL 28 · TMDB 38 |
| 계정             | 아이콘 + 값 글자 (9곳)          | itch.io · Kaggle · Hugging Face · Bangumi · VLR.gg · GitLab · Chess.com · AtCoder · Flickr                                        |
| 게임 이름 · 핸들 | 이름 아래 둘째 줄 (9곳)         | GitHub · Exercism · Mastodon · Bluesky · YouTube · Chess.com · Roblox · Substack · Bangumi                                        |
| 게임 이름 · 핸들 | 이름 옆 같은 줄 (1곳)           | VLR.gg                                                                                                                            |
| 게임 이름 · 핸들 | 이름 옆 ⌄ 를 눌러 작은 창 (1곳) | Steam 「This user has also played as」                                                                                            |
| 게임 이름 · 핸들 | 배지 줄 칩 (1곳)                | Quaver                                                                                                                            |

- 이름 글자에 밑줄이 있는 곳은 이름을 잰 곳 중 0곳이다. 이름을 눌러 모달을 여는 곳은 찾지 못했다.
- Quaver 아이콘은 링크이고(Discord 는 `discord.com/users/번호`) 올리면 서비스 이름만 보인다. itch.io 의 Discord 도 같은 주소로 간다.
- osu! 는 이름 안에 「formerly known as」 글이 있으나 올려서 여는 모습은 찍지 못했다(미확인).
- 디자인 시스템: Atlassian IconButton 은 모든 아이콘 버튼에 이름을 요구한다. Material · Carbon · Primer · Ant · Apple 도움말 문서에 아이콘 · 도구 설명 안내가 있다. Polaris 는 연결이 끊겨 미확인이다.

## 옆열에 두는 내용

찍어 둔 캡처를 다시 열어 나눴다. 새로 접속하지 않았다.

| 옆열 내용                                       | 곳                                                                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 보조(배지 · 링크 · 소식 · 순위표 · 광고) (10곳) | Chess.com · Last.fm · ESPN · Kaggle · VLR.gg · Modrinth · NHL.com · GitLab · SoundCloud · DeviantArt |
| 통계 (2곳)                                      | Bangumi · FotMob                                                                                     |
| 첫 줄만 나누고 아래는 전폭 (3곳, 근거 약함)     | Quaver(384 \| 784) · Baseball Savant(412 × 3) · ListenBrainz                                         |

옆열을 NosLog 에 옮기면 옆열 높이가 주열의 절반쯤이라 아래가 빈다(실제 화면 재배치 캡처를 눈으로 잼: 주열 1,584 · 옆열 약 750). 시안에서 옆열 안은 뺐다.

## 상자 간격 곳별

구역 상자를 스크립트로 찾아 쟀다. 세로는 위아래 상자 사이, 가로는 나란한 상자 사이, 안쪽은 상자 왼쪽에서 첫 글자까지, 탭 아래는 탭 항목 아래 끝에서 다음 상자까지의 가장 흔한 값이다. 표 맨 아래 「확인」 절이 캡처로 대조한 결과다.

| 곳           | 상자 수 | 세로 | 가로 | 안쪽 | 탭 아래 |
| ------------ | ------- | ---- | ---- | ---- | ------- |
| Quaver       | 10      | 16   | 16   | 20   | 84      |
| osu!         | 1       | -    | -    | 50   | 0       |
| Chess.com    | 8       | 24   | 24   | 12   | 292     |
| ESPN         | 13      | 8    | 20   | 16   | 120     |
| FotMob       | 8       | 16   | 16   | 25   | -       |
| Sofascore    | 0       | -    | -    | -    | -       |
| NHL.com      | 1       | -    | -    | 24   | 250     |
| MLB.com      | 1       | -    | -    | 30   | 0       |
| NFL.com      | 51      | -    | 24   | 16   | -       |
| Modrinth     | 17      | 12   | 24   | 129  | 17      |
| DAK.GG       | 20      | 4    | 12   | 20   | 20      |
| DeepLoL      | 22      | 10   | 12   | 18   | 48      |
| LoLCHESS     | 8       | 0    | 10   | 13   | 21      |
| Maple.GG     | 13      | 24   | 20   | 16   | -       |
| DEV          | 11      | 16   | 16   | 16   | -       |
| VLR.gg       | 1       | -    | -    | 42   | -       |
| OpenDota     | 4       | 0    | 15   | 1    | 166     |
| BeatLeader   | 4       | 18   | -    | 8    | -       |
| Codewars     | 3       | 16   | -    | 44   | 8       |
| Exercism     | 5       | -    | 16   | 24   | 211     |
| GitHub       | 6       | 16   | 16   | 17   | 66      |
| Kaggle       | 4       | -    | 24   | 17   | 107     |
| TMDB         | 8       | -    | 13   | 11   | 207     |
| Steam 업적   | 28      | 0    | -    | 86   | -       |
| Steam 배지   | 15      | 31   | -    | 14   | -       |
| AtCoder      | 1       | -    | -    | 40   | -       |
| Last.fm      | 6       | 12   | -    | 21   | -       |
| SoundCloud   | 1       | -    | -    | -    | -       |
| DeviantArt   | 14      | 8    | 8    | 33   | 79      |
| TradingView  | 0       | -    | -    | -    | -       |
| Hugging Face | 13      | 20   | 20   | 16   | -       |
| GitLab       | 1       | -    | -    | -65  | -       |
| Bangumi      | 16      | 15   | 10   | 20   | -       |

## 고정 항목 자리

10곳을 열어 고정 · 대표 제목의 위치를 쟀다(`~/noslog-research/desktop-profile/pin/`). osu! 는 Scores 구역 안 Pinned Scores 바로 아래 Best Performance(캡처 osu.jpg, 직접 확인). GitHub Pinned 높이 165(첫 내용) · DEV Pinned 628 · Mastodon Featured 481 · Hugging Face pinned 1287. Steam · Bluesky · YouTube · Modrinth · GitLab 은 스크립트로 찾지 못함(미확인).
| YouTube | 56 | - | 3 | 16 | 408 |
| Twitch | 4 | - | 0 | 12 | - |
| Roblox | 1 | - | - | - | - |
| itch.io | 1 | - | - | 41 | - |
| Mastodon | 1 | - | - | 1 | - |
| Bluesky | 11 | 1 | - | 13 | 0 |
| Velog | 0 | - | - | - | - |
| Baseball Savant | 3 | - | 10 | 12 | - |
| ListenBrainz | 9 | 70 | 30 | 21 | - |
| Kongregate | 22 | 16 | 16 | 69 | - |
| Observable | 45 | 66 | 16 | 32 | - |
| Codeberg | 2 | - | 37 | 12 | 15 |
| Gitea | 1 | - | - | 35 | - |
| Mixcloud | 1 | - | - | 16 | - |
| Substack | 3 | - | - | 12 | 268 |
| Flickr | 14 | 4 | 4 | 8 | 20 |
| UFC | 65 | 30 | 34 | 20 | - |

## 업적 격자의 칸 구분

업적 탭 격자의 칸 수와 칸을 나누는 방식이다. 값은 창 1440 스크립트 측정이고 모양은 캡처를 열어 확인했다.

| 곳         | 칸 수  | 칸 폭  | 간격(가로 · 세로) | 칸 구분                       | 테마   |
| ---------- | ------ | ------ | ----------------- | ----------------------------- | ------ |
| Kongregate | 3      | 320    | 16 · 16           | 면 + 테두리 1, 둥글기 12      | 다크   |
| Discourse  | 3      | 349    | 16 · 16           | 테두리 1, 둥글기 8            | 라이트 |
| Credly     | 3      | 354    | 24 · 24           | 테두리 1, 둥글기 16           | 라이트 |
| GitHub     | 3      | 미측정 | 미측정            | 테두리(캡처)                  | 라이트 |
| TMDB       | 4      | 미측정 | 미측정            | 면(캡처)                      | 라이트 |
| Exercism   | 4      | 317    | 36 · 32           | 없음                          | 라이트 |
| Chess.com  | 4      | 미측정 | 미측정            | 칸 없음, 구역 상자 안 큰 그림 | 다크   |
| DEV        | 5      | 212    | 24 · 24           | 없음                          | 라이트 |
| osu!       | 8 이상 | 84     | 10                | 없음, 육각 그림만             | 다크   |

Rust Users 는 Discourse 와 같은 엔진이라 따로 세지 않는다. 뺀 곳: FFXIV Collect(소개 화면만 보임) · MyAnimeList(동의 창) · TryHackMe(프로필 안 작은 줄) · Microsoft Learn(프로필 없음) · LeetCode · HackerRank · BoardGameGeek · light.gg(막힘).

## 고정 기록의 자켓 카드

그림 위에 글자를 얹는 카드의 값이다. 창 1440 스크립트 측정이고 모양은 캡처를 열어 확인했다.

| 곳                | 구현                                                        | 크기     |
| ----------------- | ----------------------------------------------------------- | -------- |
| App Store Today   | 0deg 그라데이션, 22% 불투명 · 41.76% 60% · 50% 투명         | 684×534  |
| Tidal             | blur 20 · saturate 1.8 · 검정 55% 막대                      | 1200×168 |
| Tidal 앨범 머리   | 선명한 자켓 + 같은 그림을 흐린 바탕(값 미측정)              | 미측정   |
| Spotify 앨범 머리 | 자켓 + 그림에서 뽑은 색 바탕(값 미측정)                     | 미측정   |
| osu! 비트맵 카드  | 그림 왼쪽, 90deg 불투명에서 80% 로                          | 375×100  |
| Apple Music       | 옆 막대에 saturate 2.2 · blur 16 · 어두운 면 60%(카드 아님) | 260×826  |

뺀 곳: Crunchyroll · Letterboxd(확인 화면) · YouTube Music(브라우저 안내).

## 통계 탭의 전폭 그래프 + 2칸

전폭 그래프 아래를 어떻게 나누는지 다시 쟀다. 창 1440 스크립트 값이고 모양은 캡처를 열어 확인했다.

| 곳               | 그래프 아래         | 칸 폭     |
| ---------------- | ------------------- | --------- |
| Umami            | 2칸 두 줄           | 570 · 570 |
| GoatCounter      | 2칸 세 줄           | 656 · 656 |
| Plausible        | 2칸 두 줄 + 전폭    | 미측정    |
| Simple Analytics | 4칸                 | 261       |
| Steam Charts     | 전폭 표             | 없음      |
| OpenDota 추세    | 그래프만            | 없음      |
| ListenBrainz     | 그래프 2 : 1 뒤 3칸 | 833 · 417 |

표본 7곳은 대부분 웹 통계 서비스이고 게임 기록 서비스는 Steam Charts · OpenDota 뿐이다. 뺀 곳: WakaTime · stats.fm · AniList · Fathom(없는 쪽) · Letterboxd · Tracker.gg(막힘) · Monkeytype(동의 창 · 짧은 칸) · Last.fm 리포트(그래프 없는 3칸).

## 리듬게임 기록 서비스의 통계

22곳을 열어 캡처를 직접 확인했다. 통계가 보인 곳만 적는다.

| 곳         | 통계                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------- |
| osu!Skills | Stamina · Tenacity · Agility · Accuracy · Precision · Reaction · Memory 값 + 세계 · 국가 순위 |
| BeatLeader | Rank & PP · Maps Graphs · Acc history · Skill triangle 탭, 세계 · 국가 · 기기별 순위          |
| osu!daily  | 「Among the 35.313% best players」, 레벨 · PP · 순위 · 정확도 · 등급 수                       |
| osu!track  | 시간 · 일 · 주 · 월당 pp · 순위 · 점수 증가, 플레이당 평균, 베스트 산점도                     |
| V-Archive  | 버튼별 티어, Max Combo · Perfect · Over 99.9% · 99.5% · 99% · 97% · Clear 최고 난이도         |
| Quaver     | 순위 · 총 점수 · 정확도 · 플레이 수, 순위 추이 · 판정 내역 탭                                 |
| Osekai     | 메달 · 희귀도 · 배지 랭킹                                                                     |

뺀 곳: Kamaitachi · Malody(로그인 벽) · ScoreSaber · TETR.IO(막힘) · Etterna · Sanbai · chunirec · ereter(없는 쪽) · SkillAttack · Gitadora · Diving Fish(열리지 않음) · Sekai Viewer · Rhythia · arcade-songs(플레이어 통계 없음).

NosLog 에 있는 값: 채보별 패턴 수치 `chart_pattern_metrics` · 판당 FAST/SLOW · 기록별 노트 종류 비율. 노트 종류별 성공률은 2026-09 결정으로 뺐다.

## Mania Tracker 스킬 레이팅

사용자가 준 캡처로 확인했다. 머리에 총점 · 세계 · 국가 순위, 왼쪽에 6축 원형 그래프, 오른쪽에 축별 막대 · 수치 · 상위 %, 아래에 기준 설명 줄이 있다. 첫 화면(`https://mania-tracker.com/`)만 직접 열었고 프로필 화면은 열지 못했다.

Mania Tracker 스킬 탭을 `https://mania-tracker.com/player/Kalkai` 에서 직접 열어 쟀다. 구역은 880×450, 안쪽 16, 둥글기 12, 그래프는 260×190 이다. 머리 오른쪽은 REGULAR ~ · LN ~ 티어 그림과 이력 단추로 채운다. 프로필 위쪽에는 Key Split · Most Used Mod · Median BPM · PP Range 4칸과 Newest · Oldest Top Play 2칸이 있다.

## 패턴 실력 구역의 빈 자리

원형 그래프 옆 막대 목록이 그래프보다 짧을 때 빈 자리를 어떻게 하는지 찾았다. 2026-11-03 headless 로 열었다.

- Mania Tracker 스킬 탭(위 절의 직접 실측 캡처): 그래프 260×190 옆 막대 6줄이 그래프 위 끝(Chordstream)부터 아래 끝(Delay)까지 줄 간격 약 30 으로 고르게 퍼져 있어 위아래 빈 자리가 없다.
- FotMob 선수 페이지 `https://www.fotmob.com/players/30981/lionel-messi`: Player traits 는 옆 열의 원형 그래프 하나뿐이다. 막대 목록 없이 축 이름 옆에 백분율을 쓰고, 상자를 그래프 크기에 맞춘다.
- Sofascore · Futbin · Mobalytics: 봇 차단 화면이라 세지 않았다.
- FMInside 선수 페이지 · BeatLeader 프로필: 원형 그래프가 없다. EtternaOnline 사용자 주소는 404 였다.

원형 그래프 + 막대 목록을 같이 쓰는 곳은 Mania Tracker 1곳뿐이라 근거가 약하다.

## 머리 안 표식 줄

머리에서 단계 명판 · 기여 라벨 · 고른 업적 배지 · 마지막 플레이를 어디에 어떤 모양으로 두는지 찾았다. 2026-11-05 headless 로 61곳을 열었고(Duolingo 는 주소를 바꿔 두 번), 캡처를 한 장씩 열어 나눴다. 원본은 `~/noslog-research/desktop-profile/p1-head-badges/`(`raw.jsonl` · `shots/`)다.

- 센 곳(33곳): Steam · osu! · Chess.com · GitHub · Twitch · Kaggle · AtCoder · Exercism · DEV · Hugging Face · Goodreads · xboxgamertag · Quaver · TETR.IO · Monkeytype · TypeRacer · DAK.GG · u.gg · MyAnimeList · Bangumi · Mastodon · Bluesky · YouTube · Trakt · Codewars · Roblox · LeetCode · OP.GG · bilibili · GitLab · Kongregate · HackerRank · TryHackMe.
- 막힘(28곳): Lichess · Codeforces · RetroAchievements · ScoreSaber · Discogs · Speedrun.com · PSNProfiles · FACEIT · Letterboxd · TrueAchievements · Stack Overflow · Medium · Newgrounds(봇 차단) · Reddit · Last.fm(사람 확인) · Duolingo · Strava · AniList · EtternaOnline · freeCodeCamp · WakaTime(404) · Kamaitachi · Habitica · Geocaching(로그인) · Untappd(촬영 시간 초과) · Tracker.gg(불러오는 중) · Exophase · BeatLeader(빈 프로필).

| 항목             | 모양                                 | 곳                                                                                                                                                                               |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 등급 · 역할 표식 | 이름 옆 같은 줄 작은 알약 · 칩 (8곳) | osu! 후원 · 그룹 알약 · Hugging Face PRO · MyAnimeList Founder · Exercism 명성 알약 + 트랙 그림 3 · DEV 아이콘 2 · Chess.com 멤버십 그림 · LeetCode 그림 1 · TypeRacer 메달 그림 |
| 등급 · 역할 표식 | 이름 앞 칭호 칩 (2곳, 근거 약함)     | Chess.com GM · Codewars 1 kyu                                                                                                                                                    |
| 등급 · 역할 표식 | 이름 위 작은 칩 (3곳, 근거 약함)     | DAK.GG Lv. · OP.GG Pro · AtCoder 등급 글자(King)                                                                                                                                 |
| 등급 · 역할 표식 | 이름 아래 줄 알약 (3곳, 근거 약함)   | Quaver(클랜 · Donator) · Monkeytype Developer · TypeRacer MODERATOR                                                                                                              |
| 등급 · 역할 표식 | 아바타에 겹침 (4곳)                  | Kaggle 등급색 테두리 · u.gg 레벨 · OP.GG 레벨 · Trakt DIRECTOR                                                                                                                   |
| 등급 · 역할 표식 | 머리 오른쪽 따로 (4곳)               | Steam 레벨 원 + 대표 배지 상자 · osu! 레벨 육각 + 막대 · Exercism 역할 테두리 알약 · Kongregate LEVEL 타일                                                                       |
| 업적 배지        | 머리 안 그림 줄 (4곳)                | Exercism 오른쪽 위 5개 + 「44 badges collected · See all」 · Quaver 탭 줄 아래 4개 · DEV 머리 상자 안 12개 + 「Show all 77 badges」 · TETR.IO 아바타 아래 큰 3개                 |
| 업적 배지        | 머리 옆 열 · 아래 상자 (5곳)         | Steam 옆 열 Badges 17 + 4개 · LeetCode Badges 3 상자 · TypeRacer 머리 아래 Badges 구역 · HackerRank Badges 상자 · TryHackMe 왼쪽 열 Badges 상자                                  |
| 업적 배지        | 단추로만 (1곳)                       | Codewars 「View Profile Badges」                                                                                                                                                 |
| 마지막 접속      | 이름 근처 메타 글줄 (5곳)            | osu! 「Last seen」 · Chess.com 「Last Online」 · Kaggle 「last seen」 · Codewars 「Last Seen:」 · Kongregate 「Latest Activity: Played 게임 (날짜)」                             |
| 마지막 접속      | 다른 구역 목록 (4곳)                 | Quaver 통계 목록 · MyAnimeList 왼쪽 정보 목록 · AtCoder 대회 표 「Last Competed」 · Steam 옆 열 「Currently Offline」                                                            |
| 표식 없음        | 이름 · 핸들 · 수치만 (9곳)           | GitHub · Twitch · Mastodon · Bluesky · YouTube · Roblox · bilibili · xboxgamertag · GitLab                                                                                       |

- 인증 체크 하나만 이름 옆에 두는 곳(Twitch · Bluesky · YouTube · Roblox · bilibili)은 「표식 없음」 으로 셌다.
- 한 곳이 여러 항목에 들어간다(osu! 는 알약 · 레벨 육각 · 메타 글줄).

디자인 시스템 문서 8곳을 같은 날 열었다(원문 `~/noslog-research/desktop-profile/p1-head-badges/docs/`). 7곳을 셌고 Polaris 는 다른 쪽이 열려 미확인이다.

- Fluent 2 Badge: 꾸미는 대상 「위나 가까이」 둔다. 「위에 겹침」 과 「옆에 둠」 두 예를 든다.
- Carbon Tag: 둘레 글이나 부품과 세로 가운데를 맞춘다. 여러 개를 묶을 때 사이를 8px 로 권한다.
- Primer Label: 문맥 메타데이터(상태 · 분류)를 글에 붙이는 부품이다.
- Atlassian Lozenge: 대상을 이해 · 처리하는 데 영향을 주는 속성을 짧게 보여 준다. 대문자 · 제목식 표기를 쓰지 않는다.
- GOV.UK Tag: 상태가 여러 가지일 때 그 상태를 보여 준다.
- Ant Tag: 표시와 분류에 쓴다.
- Material 3 Badges: 탐색 항목 · 아이콘의 알림 수 · 상태용이라 이름 옆 표식과는 쓰임이 다르다.

네 항목을 모두 담는 곳 5곳(osu! · Chess.com · Exercism · Quaver · Kongregate)을 실제 쪽 DOM 에서 글 · 그림만 바꿔 찍었고, 시안 판에는 Kongregate 를 뺀 4곳을 올렸다(`~/noslog-research/desktop-profile/p1-head-badges/mock/`). TETR.IO 는 이름 옆에 명판 자리가 없어 뺐다.

## 고정 기록 소감의 잘림 · 전체 보기

카드에 넣은 사용자 글(리뷰 · 댓글 · 소개)이 길 때 잘림을 어떻게 표시하고 전체를 어떻게 보여 주는지 찾았다. 2026-11-06 headless 다크(colorScheme dark)로 69곳을 열었고, 한 자리를 하나로 세어 31곳 34자리를 셌다(YouTube 3자리 · Steam 2자리). 원본은 `~/noslog-research/desktop-profile/p2-pin-quote/`(`raw.jsonl` 의 `"pass":"judged"` 줄 · `shots/`)다. 캡처는 패턴마다 한 장 이상 열어 보았다.

| 잘림 표시 · 전체 보기                     | 수             | 곳                                                                                        |
| ----------------------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| 「…」 + 더 보기 글자 · 그 자리 펼침       | 4 (+ 미확인 2) | YouTube 댓글 · MyAnimeList · Chrome Web Store · Bandcamp 소개 / 미확인 Douban · Backloggd |
| 페이드 + 더 보기 단추 · 그 자리 펼침      | 4              | Goodreads · Steam 상점 리뷰 · Hardcover · Genius                                          |
| 표시 없이 끊김 + Show more · 그 자리 펼침 | 1 (근거 약함)  | Coursera                                                                                  |
| 「…」 · 페이드 + 더 보기 · 모달           | 4              | App Store(페이드) · Metacritic · Airbnb · YouTube 채널 소개                               |
| 글자 없이 카드 누름 · 모달                | 2 (근거 약함)  | Steam 커뮤니티 리뷰(페이드) · Spotify 아티스트 소개                                       |
| 「…」 + 더 보기 · 상세 쪽 이동            | 3 (근거 약함)  | Last.fm · LinkedIn 활동 카드 · YouTube 대표 영상                                          |
| 「…」만 · 카드 누름 · 상세 쪽 이동        | 5              | AniList 리뷰 · 왓챠피디아 · Velog · Modrinth · Lichess 블로그                             |
| 「…」만 · 카드 누름 · 옆 패널             | 1 (근거 약함)  | Trakt                                                                                     |
| 한 줄 「…」 + title 툴팁                  | 2 (근거 약함)  | itch.io · Twitch                                                                          |
| 자르지 않음                               | 4              | GitHub 고정 저장소 · Bluesky · HowLongToBeat · Firefox Add-ons(뒤 둘은 짧은 표본뿐)       |
| 전체 보기 미확인                          | 2              | SoundCloud(로그인 모달) · Strava                                                          |

- 잘림 표시는 「…」 22 · 페이드 7 · 표시 없음 1 · 자르지 않음 4 이다. 전체 보기는 그 자리 펼침 9 · 상세 쪽 8 · 모달 6 · 옆 패널 1 · title 2 · 미확인 4 다.
- 펼친 뒤 접기 글자(Show less · less)를 두는 곳은 YouTube · Chrome Web Store · Coursera · Hardcover · Bandcamp 다. Steam 상점 · Goodreads 는 단추가 사라진다.
- 더 보기 글자는 13–16px 이고 본문색이나 회색이 많다. 파란 링크색은 App Store · Chrome Web Store · Coursera 세 곳이다.
- 카드 폭이 NosLog 고정 카드(362)에 가까운 곳은 LinkedIn 360 · Lichess 348 · 왓챠피디아 324 · Velog 320 이고 넷 다 「…」 로 자르고 상세 쪽으로 보낸다.
- 막힘: Cloudflare 확인 쪽 14곳(Letterboxd 3쪽 · RateYourMusic · Discogs · Medium · Product Hunt · BoardGameGeek · Grouvee · Stack Overflow · AOTY · npm · Epic Games Store), 사람 확인 · 캡차 3곳(Reddit · IMDb · Bilibili), 403 빈 쪽 3곳(Yelp · TripAdvisor · X), 그 밖에 VS Code Marketplace · Threads · Untappd · Tumblr · Vimeo · Amazon · Vivino · Mastodon(캡처 실패).
- 사용자 글이 잘린 자리가 없거나 사용자 글이 아니라 뺀 곳: osu! · Instagram · JetBrains · Serializd · GOG · Google Play · Rotten Tomatoes · OpenCritic · Kaggle · Hugging Face · Docker Hub · Spotify 플레이리스트 · Apple Music · Apple Podcasts · Twitch 카테고리 · AniList 작품 · HowLongToBeat 게임 요약.
- 다크: 기본 다크 6곳, 시스템 따라감 7곳, 다크로 열렸지만 라이트로 바꿔도 그대로 5곳, 라이트만 11곳이다. 잘림 · 더 보기의 다크 전용 지침은 찾지 못했다(미확인).

디자인 시스템 12곳과 가이드 4곳의 원문을 같은 날 받았다(`docs/*.txt`). Polaris · Spectrum text-field · Workday Canvas · SAP Fiori 는 빈 쪽 · 404 · 403 이라 미확인이다.

- 잘림은 「…」 로, 짧은 한 줄에는 툴팁을 붙인다: Carbon · PatternFly · Gestalt · Maersk · Primer Truncate · Spectrum WC.
- 툴팁만으로는 키보드 · 터치 사용자가 못 읽으니 중요한 글을 툴팁에만 두지 않는다: Primer 접근성 · Atlassian Tooltip · Fluent 2 Tooltip · NN/g · WCAG 1.4.13.
- 긴 글은 「Show more」 단추로 펼치고 필요하면 「Show less」 를 둔다. Carbon 은 스크롤 · 그라데이션 · 페이드보다 단추를 권한다. Ant Design Typography(expandable) · Primer(펼침 단추나 모달) · Material 3 Cards(카드 높이를 늘림)도 같다.
- 사용자 글은 되도록 자르지 않고, 잘라야 하면 줄 수를 정한다: Atlassian Text. 나머지를 볼 따로 된 화면이 없으면 자르지 않는다: Apple HIG Typography. 글자 수 한도를 미리 알린다: Primer.
- Baymard 는 목록에서 마지막 줄을 흐리게 하는 것을 보조 표시로 권한다. GOV.UK Details 는 「더 보기」 를 다른 쪽 이동으로 여겨 안 누르는 사람이 있다고 하고, Snook 은 몇 단어만 숨기지 말고 같은 쪽 펼침인지 이동인지 알리라고 한다.

NosLog 쪽 사실: 소감은 80자까지(`PINNED_COMMENT_MAX`)이고, 카드 전체가 악곡 상세 링크라 소감 전체를 따로 보여 주는 쪽이 없다. 지금 운영 CSS 는 자르지 않는다.

시안 판에는 Figma 결정본 고정 기록 카드(9:155)를 그대로 옮겨 그리고, 소감 줄만 4곳(YouTube 댓글 · Hardcover · App Store · GitHub 고정 저장소)의 방식과 값으로 바꿨다(`~/noslog-research/desktop-profile/p2-pin-quote/mock-v2/`). 처음에는 서비스 쪽 DOM 에 소감을 넣어 찍었으나(`mock/`) 카드 자체를 바꾸는 것처럼 보여 바꿨다. 80자 소감은 Hardcover 원래 기준(3줄) · App Store(5줄) · YouTube(4줄)로는 362 폭에서 잘리지 않는다.

## 활동 탭 요약 머리 · 더할 요소

2026-11-06 다크 1440 으로 71곳을 열어(쪽 75번) 32곳을 셌다. 결과는 `~/noslog-research/desktop-profile/p16-activity/`(`raw.jsonl` · `classified.json` · `shots/` · `docs/`)에 있다. 막힌 39곳은 세지 않았다: Cloudflare 확인 19곳(LeetCode · Codeforces · solved.ac · Lichess · Letterboxd 등), 봇 차단 5곳(HackerRank · Last.fm 등), 로그인 벽 3곳(Habitica · Kamaitachi · Geocaching), 404 등 7곳(Duolingo · Strava · 백준 등), 렌더 실패 2곳(AniList · BeatLeader), 그 밖 3곳. 대표 캡처 17장을 직접 열어 수를 맞췄다. Monkeytype 은 쿠키 창이 화면을 덮어 세지 않았다.

| 달력 위 요약 머리       | 수            | 곳                                                                                                         |
| ----------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| 제목만, 숫자 없음       | 9             | Kaggle · CodeChef · Luogu · osu! · Code::Stats · AtCoder Problems(Heatmap 탭) · Gitee · Pixela · Shikimori |
| 숫자 칸 줄              | 9             | 달력 카드에 붙은 곳은 TryHackMe · daily.dev 2곳, 나머지 7곳은 프로필 머리                                  |
| 합계 문장, 달력 위      | 3 (근거 약함) | GitHub · OpenStreetMap · ListenBrainz(달력 없이 합계만)                                                    |
| 합계 문장, 달력 아래    | 3 (근거 약함) | GitLab · Codeberg · Gitea(Codeberg 와 Gitea 는 같은 계열 코드)                                             |
| 달력 아래 여러 값 한 줄 | 2 (근거 약함) | Gitee(최근 1년 · 최장 연속 · 최근) · Pixela(합계 · 최대 · 최소 · 평균)                                     |
| 옆 열 키-값 목록        | 3 (근거 약함) | Quaver · osu!track · MyAnimeList                                                                           |
| 달력 · 활동 머리 없음   | 5             | AtCoder(공식) · Codewars · Hugging Face · Qiita · Steam(연 계정)                                           |

| 더할 요소           | 수                          | 곳                                                                                                                        |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 최근 활동 목록      | 13                          | GitHub · GitLab · Codeberg · Gitea · Gitee · Quaver · osu! · Chess.com 등                                                 |
| 달 이름 · 요일 이름 | 열어 본 달력 10곳 중 10 · 9 | GitHub · OpenStreetMap · Codeberg · Gitee · GitLab · Kaggle · CodeChef · AtCoder Problems · daily.dev · Pixela(요일 없음) |
| 적게 · 많이 범례    | 7                           | GitHub · GitLab · Codeberg · Gitea · Gitee · daily.dev · Pixela. 범례 없음 4곳                                            |
| 연도 · 기간 고르기  | 5                           | GitHub(연도 목록) · Gitee(드롭다운) · TryHackMe(‹ 2026 ›) · CodeChef(기간) · ListenBrainz(탭)                             |
| 연속 기록 표시      | 5                           | AtCoder Problems · TryHackMe · daily.dev(칸) · Chess.com(옆 열 줄) · Gitee(아래 한 줄)                                    |
| 기간별 막대 · 선    | 6                           | osu!(월별 플레이 선) · Shikimori · Code::Stats · Quaver · Chess.com · ListenBrainz                                        |
| 가장 많이 한 날     | 3 (근거 약함)               | Code::Stats · osu!track · TypeRacer                                                                                       |

- 주 단위 달력 12곳(GitHub · GitLab · Codeberg · Gitea · Gitee · OpenStreetMap · CodeChef · AtCoder Problems · Kaggle · Pixela · Luogu · daily.dev)을 다시 열어 보니 달 이름은 12곳 모두, 요일 이름은 11곳이 둔다. 요일 이름이 없는 곳은 Pixela 뿐이다. 요일은 월 · 수 · 금 셋이 7곳, 다른 셋이 2곳(Gitee · CodeChef), 일곱 개 모두가 2곳(Kaggle · Luogu)이다. Code::Stats 는 월×일 격자라 뺐다.
- 요일별 분포 · 가장 많이 한 요일은 센 곳에 없었다.
- TryHackMe 는 데이터가 없어 달력 본체가 빈 상태 문구로만 보였다(미확인). LeetCode · Steam Recent Activity · Monkeytype 활동 달력도 미확인이다.
- 다크: 시스템 따라감 8곳, 기본 다크 · 다크만 7곳, 나머지는 라이트로만 렌더됐다.

디자인 시스템 9곳과 가이드 5곳의 원문을 받았다(`docs/*.txt`). 숫자 칸 부품은 Ant Statistic · Chakra Stat · EUI Stat · GitLab Pajamas Single stat 에 있고, Pajamas 는 같은 주제 지표를 나란히 둘 때만 쓰라고 한다. 키-값 목록은 Cloudscape · GOV.UK Summary list. 범례는 갈린다: Pajamas 는 히트맵에 네모 칩 범례를 두고, Primer · Carbon 은 묶음이 하나면 범례를 빼라고 하며, GOV.UK Analysis Function 은 시계열에 달력 히트맵을 권하면서 범례는 피하라고 한다. PatternFly · SAP Fiori · Pajamas 히트맵 쪽은 404 · 403 이라 미확인이다.

NosLog 쪽 사실: 활동 데이터는 최근 53주 날짜별 플레이 수와 네 요약값(최근 1년 · 이번 달 · 현재 연속 · 최장 연속)이고, 플레이 기록은 북마클릿 연동 뒤부터다. 운영 코드에는 6단계 칸 색 범례가 있지만 Figma 결정본(11:2681)에는 없다.

시안 판 P16A(요약 머리: Gitee · GitHub · Kaggle)와 P16B(더할 요소: GitHub 달 · 요일 · 범례, Gitee 연도 고르기, osu! 월별 선, Code::Stats 하루 기록)는 Figma 활동 구역을 같은 값으로 다시 만들어 그 부분만 바꿔 찍었다(`~/noslog-research/desktop-profile/p16-activity/mock/`).

## 기록 탭 검색

2026-11-07 다크 1440 으로 「한 사람의 기록 · 점수 · 소장 목록」 화면을 84곳 열어 42곳을 셌다(사이트 전체 검색창은 세지 않음). 결과는 `~/noslog-research/desktop-profile/p7-records-search/`(`raw.jsonl` · `classified.json` · `shots/` · `docs/`)에 있다. 막힌 곳은 세지 않았다: Cloudflare 확인 22곳(ScoreSaber · Codeforces · Trakt · Last.fm 등), 403 · 과부하 4곳, 로그인 벽 4곳(Kamaitachi · Steam 게임 목록 · Untappd · Lichess), 빈 목록 · 404 · 접속 오류 · 렌더 실패 등. V-Archive · chunirec · 3icecream 은 공개 사용자 주소를 찾지 못해 미확인이다. 대표 캡처 7장(GitHub · Bokutachi · Etterna · BeatLeader 닫힘/열림 · osu! · AtCoder)을 직접 열어 수를 맞췄다.

| 검색칸 자리                             | 수            | 곳                                                                                                 |
| --------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| 검색 없음                               | 17            | osu! · Quaver · Akatsuki · Ripple · BeatSaver · GitLab · SoundCloud · ListenBrainz · Codewars 등   |
| 아이콘만, 눌러야 열림                   | 6             | YouTube 채널 · MyAnimeList · Letterboxd · Chess.com(탭 줄 끝) · BeatLeader(정렬 줄) · Hugging Face |
| 목록 위 줄 오른쪽                       | 5             | Etterna Online · Quay · AtCoder · AtCoder Problems · Gitee                                         |
| 정렬 · 드롭다운과 같은 줄, 남은 폭 채움 | 4 (근거 약함) | GitHub 저장소 탭 · Gitea · Codeberg(같은 계열) · Exercism                                          |
| 목록 위 따로 한 줄 전폭                 | 4 (근거 약함) | Bokutachi · Shikimori · Backloggery · Kaggle                                                       |
| 목록 위 따로 한 줄 일부 폭              | 3 (근거 약함) | Open Library · Docker Hub · VNDB                                                                   |
| 표 상자 안 위 줄 왼쪽                   | 1 (근거 약함) | OGS                                                                                                |

- 그 밖 2곳: OpenDota 는 검색칸 대신 거르기 격자 안 Hero 고르기, TypeRacer 는 조건 폼만 둔다.
- 동작(23곳): 칠 때마다 거름 12 · Enter 나 단추 7 · 미확인 4. 주소에 쿼리가 남는 곳 12. 지우기(×)는 3곳뿐이다(BeatLeader · Hugging Face · Chess.com). 함께 두는 거르기(드롭다운 · 칩 · 탭)는 21곳에 있다.
- 결과 없음 문구는 「No matching results found.」(Gitea) · 「No scores.」(BeatLeader) · 「No results found」 + 「Clear filters」(Kaggle) 처럼 무엇이 없는지만 말하는 짧은 문장이다. Etterna 는 문구 없이 빈 표 머리만 남는다.

디자인 시스템 10곳의 원문을 받았다(`docs/*.txt`, 검색창 일반 지침은 [디자인 시스템 22곳](./research-design-systems.md) 에 있어 다시 조사하지 않음). Carbon 은 표 툴바 검색을 닫힌형(아이콘)과 열린형(표 제목 아래 왼쪽, 동작 단추까지 늘림)으로 나눈다. PatternFly 는 기본을 칠 때마다 거르기로, 데이터가 커 성능이 걱정될 때만 Enter 방식을 권하고, Pajamas 도 두 방식을 둔다. Cloudscape 는 보이는 줄이 아니라 전체 모음을 거르고 결과 수를 칸 옆에 두라고 한다. NN/g 는 결과가 1초 안에 나오면 즉시 거르기를 권한다. Atlassian Dynamic table · Baymard 는 목록 검색 지침이 없었다.

NosLog 쪽 사실: 기록 표는 20줄씩 「더 보기」 로 불러온다. 가이드 프로필 문서와 `profile-records.tsx` 에 「기록 탭에 검색칸 · 필터 · 설명 줄을 두지 않는다」(2026-09-26) 가 있고, 2026-11-02 사용자가 「여기도 검색이 들어가면 좋지 않을까」 라고 물어 판을 열었다. 공용 검색칸(`components/ui/search-field.tsx`)은 높이 40 이고, 자리표시 「곡 이름으로 기록 찾기」 는 고정 기록 고르기에서 이미 쓴다.

시안 판 P7 은 Figma 기록 상자(11:2312)의 위 줄만 다시 그리고 표는 Figma 그림을 그대로 붙여 찍었다(`~/noslog-research/desktop-profile/p7-records-search/` 와 시안 스크래치). 안은 검색 없음(osu!) · 같은 줄 오른쪽(Etterna) · 같은 줄 채움(GitHub) · 아래 한 줄 전폭(Bokutachi) · 아이콘(BeatLeader) 다섯이다.

## 업적 리스트 줄

2026-11-07 다크 1440 으로 업적 · 배지 · 트로피 화면을 84곳 열어 31곳을 셌다. 결과는 `~/noslog-research/desktop-profile/p12-achievement-row/`(`raw.jsonl` · `classified.json` · `shots/` · `docs/`)에 있다. Cloudflare · 403 · 로그인 벽 · 오류 43곳(SteamHunters · TrueAchievements · PSNProfiles · RetroAchievements · Exophase · Stack Overflow · LeetCode · gw2efficiency · Duolingo 등)과 업적 화면이 없는 10곳은 세지 않았다. 대표 캡처 4장(Steam · seelie.me · stardb.gg · FFXIV Collect)을 직접 열어 수를 맞췄다.

| 줄 구성                      | 수                                                 | 곳                                                                                                                                              |
| ---------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 격자만                       | 16                                                 | osu! · Quaver · Chess.com · GitHub · Khan Academy · Discourse · Exercism · TMDB · Kongregate 등                                                 |
| 한 줄에 업적 하나            | 15                                                 | Steam · Roblox · CodeChef · Cytoid · 원신 트래커 4곳 · stardb.gg · wuwatracker · Game Jolt · PSNine · MetaGamerScore · Stratege · FFXIV Collect |
| 줄 안 진행 막대              | 0 (미확인)                                         | 개인 진행이 보일 곳은 모두 로그인 벽 · Cloudflare                                                                                               |
| 희귀도(비율 · 인원)          | 5 (근거 약함)                                      | stardb.gg · PSNine · FFXIV Collect(오른쪽) · Roblox · Stratege(이름 아래)                                                                       |
| 단계: 묶음 안 단계마다 줄    | 4 (근거 약함, 같은 게임 데이터)                    | paimon.moe · seelie.me · Genshin Center(다음 단계 흐림) · Project Amber                                                                         |
| 단계: 단계마다 따로 줄(목록) | 3 (근거 약함)                                      | MetaGamerScore · FFXIV Collect · Cytoid                                                                                                         |
| 못 딴 것                     | 딴 것만 10 · 체크칸 5 · 흐림 4 · 흑백 2 · 자물쇠 2 | Steam 흑백 그림 · Chess.com · TryHackMe 자물쇠 · Game Jolt 물음표                                                                               |

- 펼침 ⌄ 로 단계를 여는 곳과 한 줄에 단계 점 · 별을 두는 곳은 센 곳에 없었다. 달성일은 Steam 배지 · TMDB 두 곳에서 설명 아래에만 확인했다.
- 줄 높이는 51(FFXIV)–174(Roblox), 구분선 · 표 4곳 · 면 카드 8곳 · 여백 2곳이다.

디자인 시스템 · 가이드 12곳의 원문을 받았다(`docs/*.txt`). M3 · HIG Lists 는 그림을 앞쪽 끝에 두고 보조 글을 1–3줄로 둔다. Carbon · Pajamas · Primer 진행 막대는 값을 글로 함께 보이고 좁은 곳은 얇게 쓴다. HIG Game Center 는 이름 · 설명을 2줄까지로 하고 진행형 업적은 진행을 보이게 하며, Steamworks 는 안 딴 그림을 흑백으로 권한다.

NosLog 쪽 사실: 지금 리스트 줄은 육각 44 · 이름 · 조건과 달성일(못 딴 것은 진행 숫자와 막대) · ⌄ 단계 사다리이고, 단계는 I–V 다섯이다. 단계마다 달성 인원(`recipients`)과 문구 「{count}명 달성」 이 이미 있고 지금은 사다리 안에만 보인다.

시안 판 P12 는 지금 줄 · 오른쪽 열 달성 인원(Steam) · 단계마다 따로 줄(FFXIV Collect) · 묶음 안 다음 단계 흐림(seelie.me) 넷을 같은 NosLog 값으로 그렸다(`~/noslog-research/desktop-profile/p12-achievement-row/mock/`).

## 업적 촘촘한 격자 · 정보 카드

2026-11-07 다크 1440 으로 업적 · 배지 그림 격자를 약 79곳 열어 31곳을 셌다. 곳마다 격자 · 칸에 올린 뒤 · 누른 뒤를 찍었다. 결과는 `~/noslog-research/desktop-profile/p14-dense-grid/`(`raw.jsonl` · `classified.json` · `shots/` · `docs/`)에 있다. 막힌 38곳(Cloudflare · 403 · 로그인 벽 · 404)과 격자가 아닌 12곳은 세지 않았고, 12곳은 다크를 줘도 라이트로 그려졌다. 대표 캡처 4장(osu! · Chess.com · Quaver · osekai)을 직접 열어 수를 맞췄다.

| 정보가 뜨는 방식         | 수            | 곳                                                                                          |
| ------------------------ | ------------- | ------------------------------------------------------------------------------------------- |
| 올리면 자체 툴팁         | 16            | 이름만 9(osekai · Quaver · Steam · Kaggle 등) · 긴 내용 7(osu! · GitHub · Fedora Badges 등) |
| 올리면 브라우저 title 만 | 7             | Chess.com · Khan Academy · DEV · Kongregate · Credly · OGS · CheckiO                        |
| 누르면 다른 쪽으로 이동  | 11            | Discourse · Credly · OGS · Steam · Holopin · Fedora 등                                      |
| 누르면 모달              | 6             | Chess.com · GitHub · DEV · Kaggle · Newgrounds · Game Jolt(폭 448–792)                      |
| 누르면 옆 패널           | 2 (근거 약함) | osekai · Pokédex Tracker                                                                    |
| 누르면 칸에 붙는 카드    | 0             |                                                                                             |

- 툴팁 자리는 칸 위 10 · 아래 4 · 옆 1 · 겹침 1, 칸과의 간격은 0–20 이다. 툴팁 안에 달성일을 두는 곳은 osu! · GitHub · GameBanana, 인원 · 희귀도는 osu! · GameBanana · Fedora 다.
- 그림만 있는 격자는 16곳, 칸 48–79 가 대부분이고 간격 0–16, 줄당 칸 수는 가득 찬 곳에서 10–15 다. 못 딴 것은 딴 것만 보이기 18곳 · 자물쇠 3 · 흑백 2 · 흐림 1 이다.

디자인 시스템 · 가이드 15곳(새로 받은 원문은 `docs/`, Atlassian Tooltip · NN/g · WCAG 1.4.13 · GOV.UK 는 p2 조사 원문을 씀). Carbon 은 올림 툴팁에 누를 것을 넣지 말고 누름이면 toggletip 을 쓰라고 하고, HIG 는 팝오버를 누르면 띄우고 바깥 누름으로 닫으라고 한다. NN/g 는 올림 툴팁은 터치에서 못 쓴다고 하고, WCAG 1.4.13 은 올림으로 뜬 내용을 닫을 수 있고 그 위로 옮겨도 남아야 한다고 한다. M3 plain 툴팁 · HIG help tag 는 짧은 글만, Carbon toggletip 은 최대 288 이다.

NosLog 쪽 사실: 지금 촘촘한 격자는 육각 44 를 한 줄 20개 두고, 칸을 누르면 칸 위 8 에 정보 카드(240, 분류 · 그림 · 이름 · 조건 · 달성 인원 · 달성일)를 띄운다(Figma 32:1375). 공용 대화 상자는 small 440 · medium 600 · large 768 이고 툴팁 공용 부품은 없다.

시안 판 P14 는 지금(누르면 칸 위 카드) · 올리면 칸 위 카드(osu!) · 올리면 이름 · 조건만(Quaver) · 누르면 모달(Chess.com) 넷을 그렸다(`~/noslog-research/desktop-profile/p14-dense-grid/mock/`).

## 보기 전환 단추 그림

2026-11-07 다크 1440 으로 보기 전환 단추가 있는 화면을 157쪽(서비스 약 154곳) 열어 31곳을 셌다. 결과는 `~/noslog-research/desktop-profile/p15-view-icons/`(`raw.jsonl` · `classified.json` · `shots/` · `docs/`)에 있다. 막힌 58곳(Cloudflare · 403 등), 보기 단추가 없는 68곳, 로그인이 필요한 곳(Dropbox · Notion · Spotify 보관함 · Steam 라이브러리 등)은 세지 않았고, 20곳은 라이트로만 그려졌다. 대표 캡처 4장(OpenSea · EDHREC · Font Awesome · ニコニコ)을 직접 열어 수를 맞췄다.

| 항목                           | 수                                                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 단계 수                        | 2단계 23 · 3단계 5 · 4단계 2 · 5단계 1                                                                            |
| 목록 그림(27곳)                | 줄 + 점(Lucide `list`) 15 · 네모 + 줄(`layout-list`) 6 · 줄만 4 · `rows-2` 2                                      |
| 격자 그림(크기 단계 없음 24곳) | 네모 4개(`layout-grid`) 15 · 3×2(`grid-3x2`) 4 · 3×3(`grid-3x3`) 2 · 점 9개 2                                     |
| 큰 · 작은 격자를 함께 쓰는 곳  | 4 (근거 약함): OpenSea · EDHREC · Font Awesome · Pictogrammers. 큰 격자 2×2 3곳 · 3×2 1곳, 작은 격자 3×3 4곳 모두 |
| 목록 · 큰 격자 · 작은 격자     | 1 (근거 약함): Font Awesome(Cheatsheet `list` · Roomy `layout-grid` · Compact `grid-3x3`)                         |
| 단추 모양                      | 따로 14 · 세그먼트 10 · 드롭다운 3 · 한 단추 돌림 3 · 라디오 1                                                    |

- 켜짐 표시는 그림 색만 8 · 면 6 · 테두리 4 다. 단추는 32×32 · 그림 16–24 가 많다.
- Lucide 를 그대로 쓰는 곳은 VNDB(`list` · `rows-2` · `layout-grid`) · Modrinth 다.

아이콘 세트 9곳(Material Symbols · Lucide · Carbon · Fluent · Spectrum · Octicons · Atlassian · Polaris · SF Symbols, `docs/icon-sets-extract.tsv`)에는 목록 · 큰 격자 · 작은 격자에 어떤 그림을 쓰라는 지침이 없고 이름만 있다(Material `view_list` · `grid_view` · `view_module` · `view_comfy`, SF Symbols `list.bullet` · `square.grid.2x2` · `square.grid.3x3`, Carbon `list` · `grid` · `thumbnail--2`).

NosLog 쪽 사실: 악곡 목록(`features/music/components/discovery-page.tsx`)은 목록 · 격자 · 촘촘한 격자를 이미 `list` · `layout-grid` · `grid-3x3` 로 쓴다. 업적은 운영 코드에 `list` · `grid-3x3` 두 개이고, 데스크톱 결정(세 단계)의 가운데 그림은 임시 `layout-grid` 였다.

시안 판 P15 는 Font Awesome 그대로(`list` · `layout-grid` · `grid-3x3`)와 OpenSea 그대로(`rows-2` · `grid-2x2` · `grid-3x3`) 둘을 공용 세그먼트에 넣어 그렸다(`~/noslog-research/desktop-profile/p15-view-icons/mock/`).
