# 데스크톱 랭킹 · 서열표 뼈대 실측

랭킹 · 서열표의 대응 화면을 headless Playwright(폭 1440, 로그아웃)로 잰 기록이다. 캡처는 `~/noslog-research/desktop-rankings/` 아래 표의 경로에 있다. 판정은 캡처를 직접 열어 본 결과이고, 본문 · 옆 칸은 스크립트 값이라 머리 · 광고가 섞일 수 있어 아래 「직접 확인한 값」 이 우선이다.

## 표본

| 화면   | 실제 서비스 | 디자인 시스템 | 막혀서 뺀 곳 |
| ------ | ----------- | ------------- | ------------ |
| 랭킹   | 52          | 17            | 44           |
| 서열표 | 51          | 15            | 30           |

## 직접 확인한 값

폭 1440 캡처를 열어 읽은 값이다. 폭 변화는 표에 적은 곳만 쟀다.

| 곳                    | 뼈대                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| osu! rankings         | 틀 x220–1220, 표 x270–1170(1056 · 1920 에서도 900), 10열, 줄 32 + 틈 3, 쪽 번호 위아래                |
| OP.GG Leaderboards    | x180–1260(1920 에서 1080, 1056 에서 화면 전체), 7열, 줄 41, 필터 줄 48 →8→ 표 머리 32, 사이드 칸 없음 |
| Chess.com Leaderboard | 왼쪽 사이트 메뉴 170, 표 x279–1007, 7열, 줄 56, 아바타 40                                             |
| BeatLeader            | 목록 x106–982, 오른쪽 필터 칸 x1008–1360, 줄 40                                                       |
| Steam 차트            | 왼쪽 메뉴, 표 x221–1219, 줄 64                                                                        |
| Tracker.gg Valorant   | 표 x25–1091, 오른쪽 칸 x1116–1416, 줄 56                                                              |
| genshin.gg Tier List  | x220–1220(1056 에서 952), 왼쪽 칸 92, 9열 칸 99 · 그림 60, 줄 간격 132                                |
| TFT Academy           | x145–1295, 왼쪽 칸 110 →12→ 줄 상자, 줄 사이 16                                                       |
| Pokémon DB 목록       | 안쪽 x142–1298(1920 에서 1156, 1056 에서 992 · 7열 131), 8열 칸 134, 줄 간격 188, 머리 위 바로가기 줄 |
| itch.io               | 왼쪽 레일 x0–260, 내용 x280–1420, 4열 277                                                             |
| GOG                   | 레일 x168–442, 격자 x454–1268, 3열 255                                                                |
| Backloggd             | 격자 x161–1279, 6열 186, 왼쪽 칸 없음                                                                 |

사이드 칸 수(직접 확인)

- 랭킹 52곳: 없음 28 · 왼쪽 13(사이트 메뉴 4 포함) · 오른쪽 11. 사이드 칸 없이 640 가운데에 둔 곳 0.
- 서열표 51곳: 없음 34 · 왼쪽 필터 7 · 왼쪽 메뉴 6 · 오른쪽 4. 서열표 서비스 13곳 중 필터 레일 0. 왼쪽 구간 칸은 genshin.gg · TFT Academy · Blitz 3곳.

## 랭킹

| 종류          | 곳                       | URL                                                                                  | 확인 날짜  | 판정                                     | 본문(자동 측정)        | 옆 칸 | 캡처                            |
| ------------- | ------------------------ | ------------------------------------------------------------------------------------ | ---------- | ---------------------------------------- | ---------------------- | ----- | ------------------------------- |
| 디자인 시스템 | Ant Design Table         | https://ant.design/components/table/                                                 | 2026-11-02 | 확인                                     | table x373 w878 칸None | -     | rankings/ds-ant.png             |
| 디자인 시스템 | Atlassian Dynamic table  | https://atlassian.design/components/dynamic-table/examples                           | 2026-11-02 | 확인                                     | grid x405 w756 칸2     | L350  | rankings/ds-atlassian.png       |
| 디자인 시스템 | Carbon Data table        | https://carbondesignsystem.com/components/data-table/usage/                          | 2026-11-02 | 확인                                     | rows x0 w256 칸1       | R247  | rankings/ds-carbon.png          |
| 디자인 시스템 | Cloudscape Table         | https://cloudscape.design/components/table/                                          | 2026-11-02 | 확인                                     | table x716 w773 칸5    | L280  | rankings/ds-cloudscape.png      |
| 디자인 시스템 | Elastic EUI Tables       | https://eui.elastic.co/docs/components/tables/                                       | 2026-11-02 | 확인                                     | grid x12 w1006 칸2     | -     | rankings/ds-eui.png             |
| 디자인 시스템 | Fluent Table             | https://fluent2.microsoft.design/components/web/react/core/table/usage               | 2026-11-02 | 막힘: 불러오기 실패                      | -                      | -     | rankings/ds-fluent.png          |
| 디자인 시스템 | Geist Table              | https://vercel.com/geist/table                                                       | 2026-11-02 | 확인                                     | rows x135 w219 칸1     | -     | rankings/ds-geist.png           |
| 디자인 시스템 | Gestalt Table            | https://gestalt.pinterest.systems/web/table                                          | 2026-11-02 | 확인                                     | grid x333 w872 칸3     | -     | rankings/ds-gestalt.png         |
| 디자인 시스템 | GOV.UK Table             | https://design-system.service.gov.uk/components/table/                               | 2026-11-02 | 확인                                     | rows x170 w245 칸1     | -     | rankings/ds-gov.png             |
| 디자인 시스템 | Salesforce Data Tables   | https://www.lightningdesignsystem.com/components/data-tables/                        | 2026-11-02 | 확인                                     | table x416 w848 칸None | -     | rankings/ds-lightning.png       |
| 디자인 시스템 | Mantine Table            | https://mantine.dev/core/table/                                                      | 2026-11-02 | 확인                                     | table x303 w776 칸4    | -     | rankings/ds-mantine.png         |
| 디자인 시스템 | Material 3 Lists         | https://m3.material.io/components/lists/guidelines                                   | 2026-11-02 | 확인                                     | rows x204 w1032 칸1    | R156  | rankings/ds-material.png        |
| 디자인 시스템 | MUI Table                | https://mui.com/material-ui/react-table/                                             | 2026-11-02 | 확인                                     | table x385 w780 칸2    | L300  | rankings/ds-mui.png             |
| 디자인 시스템 | PatternFly Table         | https://www.patternfly.org/components/table/                                         | 2026-11-02 | 확인                                     | table x314 w1078 칸4   | -     | rankings/ds-patternfly.png      |
| 디자인 시스템 | Polaris Index table      | https://polaris-react.shopify.com/components/tables/index-table                      | 2026-11-02 | 막힘: 불러오기 실패                      | -                      | -     | rankings/ds-polaris.png         |
| 디자인 시스템 | Primer DataTable         | https://primer.style/product/components/data-table/                                  | 2026-11-02 | 확인                                     | rows x375 w710 칸1     | -     | rankings/ds-primer.png          |
| 디자인 시스템 | Radix Themes Table       | https://www.radix-ui.com/themes/docs/components/table                                | 2026-11-02 | 확인                                     | rows x12 w266 칸1      | R250  | rankings/ds-radix.png           |
| 디자인 시스템 | shadcn Data Table        | https://ui.shadcn.com/docs/components/data-table                                     | 2026-11-02 | 확인                                     | rows x449 w591 칸1     | -     | rankings/ds-shadcn.png          |
| 디자인 시스템 | Spectrum Table           | https://spectrum.adobe.com/page/table/                                               | 2026-11-02 | 막힘: 없는 쪽                            | -                      | -     | rankings/ds-spectrum.png        |
| 디자인 시스템 | USWDS Table              | https://designsystem.digital.gov/components/table/                                   | 2026-11-02 | 확인                                     | table x312 w812 칸3    | -     | rankings/ds-uswds.png           |
| 서비스        | Amazon Best Sellers      | https://www.amazon.com/gp/bestsellers                                                | 2026-11-02 | 확인                                     | rows x14 w201 칸1      | L420  | rankings/amazonbest.png         |
| 서비스        | App Store Charts         | https://apps.apple.com/us/charts/iphone                                              | 2026-11-02 | 확인                                     | grid x260 w1180 칸5    | L260  | rankings/applecharts.png        |
| 서비스        | Artificial Analysis      | https://artificialanalysis.ai/leaderboards/models                                    | 2026-11-02 | 확인                                     | table x21 w1398 칸8    | -     | rankings/artificial.png         |
| 서비스        | AtCoder                  | https://atcoder.jp/ranking                                                           | 2026-11-02 | 확인                                     | table x269 w901 칸7    | -     | rankings/atcoder.png            |
| 서비스        | ATP Rankings             | https://www.atptour.com/en/rankings/singles                                          | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/atp.png                |
| 서비스        | BBC Sport Table          | https://www.bbc.com/sport/football/premier-league/table                              | 2026-11-02 | 확인                                     | table x96 w1248 칸10   | -     | rankings/bbcsport.png           |
| 서비스        | Basketball Reference     | https://www.basketball-reference.com/leaders/pts_career.html                         | 2026-11-02 | 확인                                     | table x262 w240 칸3    | -     | rankings/bbref.png              |
| 서비스        | BeatLeader               | https://beatleader.com/ranking/1                                                     | 2026-11-02 | 확인                                     | rows x106 w876 칸1     | R352  | rankings/beatleader.png         |
| 서비스        | BoardGameGeek            | https://boardgamegeek.com/browse/boardgame                                           | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/bgg.png                |
| 서비스        | Billboard Hot 100        | https://www.billboard.com/charts/hot-100/                                            | 2026-11-02 | 막힘: 영상 · 광고에 표가 안 보임         | -                      | -     | rankings/billboard.png          |
| 서비스        | Chess.com                | https://www.chess.com/leaderboard/live                                               | 2026-11-02 | 확인                                     | table x279 w728 칸8    | L170  | rankings/chesscom.png           |
| 서비스        | CoinMarketCap            | https://coinmarketcap.com/                                                           | 2026-11-02 | 확인                                     | table x16 w1408 칸12   | -     | rankings/cmc.png                |
| 서비스        | Codeforces               | https://codeforces.com/ratings                                                       | 2026-11-02 | 확인                                     | table x137 w872 칸None | -     | rankings/codeforces.png         |
| 서비스        | CoinGecko                | https://www.coingecko.com/                                                           | 2026-11-02 | 확인                                     | table x15 w1362 칸14   | -     | rankings/coingecko.png          |
| 서비스        | CompaniesMarketCap       | https://companiesmarketcap.com/                                                      | 2026-11-02 | 막힘: 불러오기 실패                      | -                      | -     | rankings/companiesmarketcap.png |
| 서비스        | DAK.GG                   | https://dak.gg/er/leaderboard                                                        | 2026-11-02 | 막힘: 첫 화면에 표 없음                  | -                      | -     | rankings/dakgg.png              |
| 서비스        | DB-Engines               | https://db-engines.com/en/ranking                                                    | 2026-11-02 | 확인                                     | table x82 w1276 칸None | -     | rankings/dbengines.png          |
| 서비스        | Dotabuff                 | https://www.dotabuff.com/players/leaderboard                                         | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/dotabuff.png           |
| 서비스        | ESPN Standings           | https://www.espn.com/nba/standings                                                   | 2026-11-02 | 확인                                     | table x124 w184 칸1    | -     | rankings/espn.png               |
| 서비스        | EtternaOnline            | https://etternaonline.com/leaderboards                                               | 2026-11-02 | 확인                                     | table x165 w1110 칸10  | -     | rankings/etterna.png            |
| 서비스        | Formula 1                | https://www.formula1.com/en/results/2025/drivers                                     | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/f1.png                 |
| 서비스        | FACEIT                   | https://www.faceit.com/en/cs2/ranking                                                | 2026-11-02 | 막힘: 404                                | -                      | -     | rankings/faceit.png             |
| 서비스        | FIBA Ranking             | https://www.fiba.basketball/en/ranking/men                                           | 2026-11-02 | 확인                                     | table x225 w638 칸5    | -     | rankings/fiba.png               |
| 서비스        | FIDE Ratings             | https://ratings.fide.com/toplist.phtml                                               | 2026-11-02 | 막힘: 404                                | -                      | -     | rankings/fide.png               |
| 서비스        | FIFA Ranking             | https://inside.fifa.com/fifa-world-ranking/men                                       | 2026-11-02 | 막힘: 머리 그림 · 쿠키 창에 표가 안 보임 | -                      | -     | rankings/fifa.png               |
| 서비스        | Forbes Billionaires      | https://www.forbes.com/real-time-billionaires/                                       | 2026-11-02 | 막힘: 접근 제한                          | -                      | -     | rankings/forbes.png             |
| 서비스        | Fortnite Tracker         | https://fortnitetracker.com/events/powerrankings                                     | 2026-11-02 | 확인                                     | table x25 w1066 칸5    | R300  | rankings/fortnitetracker.png    |
| 서비스        | FotMob                   | https://www.fotmob.com/leagues/47/table/premier-league                               | 2026-11-02 | 확인                                     | rows x81 w1254 칸1     | -     | rankings/fotmob.png             |
| 서비스        | Genie 차트               | https://www.genie.co.kr/chart/top200                                                 | 2026-11-02 | 확인                                     | table x250 w710 칸11   | -     | rankings/genie.png              |
| 서비스        | GitHub Trending          | https://github.com/trending                                                          | 2026-11-02 | 확인                                     | rows x231 w978 칸1     | -     | rankings/githubtrending.png     |
| 서비스        | Gitstar Ranking          | https://gitstar-ranking.com/users                                                    | 2026-11-02 | 확인                                     | rows x150 w555 칸1     | -     | rankings/gitstar.png            |
| 서비스        | Hearthstone Leaderboards | https://hearthstone.blizzard.com/en-us/community/leaderboards                        | 2026-11-02 | 막힘: 첫 화면에 표 없음                  | -                      | -     | rankings/hearthstone.png        |
| 서비스        | Hugging Face Models      | https://huggingface.co/models?sort=likes                                             | 2026-11-02 | 확인                                     | rows x520 w824 칸1     | -     | rankings/hf.png                 |
| 서비스        | HLTV                     | https://www.hltv.org/ranking/teams                                                   | 2026-11-02 | 확인                                     | rows x409 w638 칸1     | L160  | rankings/hltv.png               |
| 서비스        | IMDb Top 250             | https://www.imdb.com/chart/top/                                                      | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/imdb.png               |
| 서비스        | Kaggle                   | https://www.kaggle.com/rankings                                                      | 2026-11-02 | 확인                                     | table x304 w1088 칸6   | L257  | rankings/kaggle.png             |
| 서비스        | Kamaitachi               | https://kamai.tokyo/games/iidx/SP/leaderboards                                       | 2026-11-02 | 막힘: 불러오기 실패                      | -                      | -     | rankings/kamai.png              |
| 서비스        | Kworb                    | https://kworb.net/spotify/country/global_daily.html                                  | 2026-11-02 | 확인                                     | table x8 w940 칸11     | -     | rankings/kworb.png              |
| 서비스        | Last.fm Charts           | https://www.last.fm/charts                                                           | 2026-11-02 | 확인                                     | table x135 w370 칸5    | R400  | rankings/lastfm.png             |
| 서비스        | League of Graphs         | https://www.leagueofgraphs.com/rankings/summoners                                    | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/leagueofgraphs.png     |
| 서비스        | LeetCode                 | https://leetcode.com/contest/globalranking/                                          | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/leetcode.png           |
| 서비스        | Lichess                  | https://lichess.org/player/top/200/blitz                                             | 2026-11-02 | 막힘: 404                                | -                      | -     | rankings/lichess.png            |
| 서비스        | LMArena                  | https://lmarena.ai/leaderboard                                                       | 2026-11-02 | 확인                                     | grid x272 w1136 칸8    | L240  | rankings/lmarena.png            |
| 서비스        | MyAnimeList Top          | https://myanimelist.net/topanime.php                                                 | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/mal.png                |
| 서비스        | maple.gg                 | https://maple.gg/rank/total                                                          | 2026-11-02 | 확인                                     | table x180 w1080 칸4   | -     | rankings/maplegg.png            |
| 서비스        | Melon 차트               | https://www.melon.com/chart/index.htm                                                | 2026-11-02 | 확인                                     | table x216 w1008 칸12  | -     | rankings/melon.png              |
| 서비스        | MLB Standings            | https://www.mlb.com/standings                                                        | 2026-11-02 | 막힘: 알림 창                            | -                      | -     | rankings/mlb.png                |
| 서비스        | Monkeytype               | https://monkeytype.com/leaderboards                                                  | 2026-11-02 | 확인                                     | table x336 w1040 칸9   | -     | rankings/monkeytype.png         |
| 서비스        | Naver 스포츠 기록        | https://m.sports.naver.com/kbaseball/record/index                                    | 2026-11-02 | 막힘: 첫 화면에 표 없음                  | -                      | -     | rankings/naversports.png        |
| 서비스        | NBA Stats                | https://www.nba.com/stats/leaders                                                    | 2026-11-02 | 막힘: 접근 거부                          | -                      | -     | rankings/nba.png                |
| 서비스        | NFL Standings            | https://www.nfl.com/standings/league/2026/REG                                        | 2026-11-02 | 확인                                     | table x96 w1248 칸17   | -     | rankings/nfl.png                |
| 서비스        | NHL Standings            | https://www.nhl.com/standings                                                        | 2026-11-02 | 확인                                     | table x96 w1248 칸18   | -     | rankings/nhl.png                |
| 서비스        | Numbeo                   | https://www.numbeo.com/cost-of-living/rankings_current.jsp                           | 2026-11-02 | 확인                                     | table x95 w1250 칸8    | -     | rankings/numbeo.png             |
| 서비스        | OpenDota                 | https://www.opendota.com/players                                                     | 2026-11-02 | 확인                                     | table x121 w590 칸5    | -     | rankings/opendota.png           |
| 서비스        | OP.GG                    | https://op.gg/lol/leaderboards/tier                                                  | 2026-11-02 | 확인                                     | table x180 w1080 칸7   | -     | rankings/opgg.png               |
| 서비스        | OSRS Hiscores            | https://secure.runescape.com/m=hiscore_oldschool/overall                             | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/osrs.png               |
| 서비스        | osu!                     | https://osu.ppy.sh/rankings/osu/performance                                          | 2026-11-02 | 확인                                     | table x270 w900 칸10   | -     | rankings/osu.png                |
| 서비스        | Overwatch Rankings       | https://overwatch.blizzard.com/en-us/rankings/                                       | 2026-11-02 | 막힘: 404                                | -                      | -     | rankings/overwatch.png          |
| 서비스        | OWGR                     | https://www.owgr.com/current-world-ranking                                           | 2026-11-02 | 확인                                     | table x12 w1416 칸11   | -     | rankings/owgr.png               |
| 서비스        | PGA Tour                 | https://www.pgatour.com/fedexcup                                                     | 2026-11-02 | 확인                                     | table x74 w996 칸4     | R240  | rankings/pga.png                |
| 서비스        | Premier League           | https://www.premierleague.com/en/tables                                              | 2026-11-02 | 확인                                     | table x16 w1408 칸12   | R354  | rankings/premier.png            |
| 서비스        | Product Hunt             | https://www.producthunt.com/leaderboard/daily/2026/11/1                              | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/producthunt.png        |
| 서비스        | QS Rankings              | https://www.topuniversities.com/world-university-rankings                            | 2026-11-02 | 막힘: 불러오기 실패                      | -                      | -     | rankings/qs.png                 |
| 서비스        | Raider.IO                | https://raider.io/mythic-plus-character-rankings/season-tww-3/world/all/all          | 2026-11-02 | 확인                                     | table x17 w1090 칸5    | R300  | rankings/raiderio.png           |
| 서비스        | Reddit Communities       | https://www.reddit.com/best/communities/1/                                           | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/reddit.png             |
| 서비스        | Rocket League Tracker    | https://rocketleague.tracker.network/rocket-league/leaderboards/playlist/all/default | 2026-11-02 | 막힘: 500                                | -                      | -     | rankings/rocketleague.png       |
| 서비스        | RoyaleAPI                | https://royaleapi.com/players/leaderboard                                            | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/royaleapi.png          |
| 서비스        | ScoreSaber               | https://scoresaber.com/rankings                                                      | 2026-11-02 | 확인                                     | table x311 w1094 칸6   | L275  | rankings/scoresaber.png         |
| 서비스        | Shazam Charts            | https://www.shazam.com/charts/top-200/world                                          | 2026-11-02 | 확인                                     | rows x50 w536 칸1      | -     | rankings/shazam.png             |
| 서비스        | Similarweb Top Sites     | https://www.similarweb.com/top-websites/                                             | 2026-11-02 | 확인                                     | table x144 w1152 칸7   | -     | rankings/similarweb.png         |
| 서비스        | Social Blade             | https://socialblade.com/youtube/top/100                                              | 2026-11-02 | 확인                                     | table x90 w1260 칸5    | -     | rankings/socialblade.png        |
| 서비스        | Sofascore                | https://www.sofascore.com/tournament/football/england/premier-league/17              | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/sofascore.png          |
| 서비스        | solved.ac                | https://solved.ac/ranking/tier                                                       | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/solvedac.png           |
| 서비스        | Speedrun.com             | https://www.speedrun.com/smb1                                                        | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/speedrun.png           |
| 서비스        | Speedtest Global Index   | https://www.speedtest.net/global-index                                               | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/speedtest.png          |
| 서비스        | Stack Overflow Users     | https://stackoverflow.com/users                                                      | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/stackoverflow.png      |
| 서비스        | Steam Charts             | https://store.steampowered.com/charts/mostplayed                                     | 2026-11-02 | 확인                                     | table x221 w998 칸5    | -     | rankings/steamcharts.png        |
| 서비스        | SteamDB                  | https://steamdb.info/charts/                                                         | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/steamdb.png            |
| 서비스        | TIOBE Index              | https://www.tiobe.com/tiobe-index/                                                   | 2026-11-02 | 막힘: 글이 먼저라 표가 첫 화면에 없음    | -                      | -     | rankings/tiobe.png              |
| 서비스        | Tracker.gg Valorant      | https://tracker.gg/valorant/leaderboards/ranked/all/default                          | 2026-11-02 | 확인                                     | table x25 w1066 칸7    | R300  | rankings/trackergg.png          |
| 서비스        | Transfermarkt            | https://www.transfermarkt.com/spieler-statistik/wertvollstespieler/marktwertetop     | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/transfermarkt.png      |
| 서비스        | TwitchTracker            | https://twitchtracker.com/channels/ranking                                           | 2026-11-02 | 확인                                     | table x150 w1140 칸11  | -     | rankings/twitchtracker.png      |
| 서비스        | UEFA Rankings            | https://www.uefa.com/nationalassociations/uefarankings/country/                      | 2026-11-02 | 확인                                     | table x49 w1342 칸9    | -     | rankings/uefa.png               |
| 서비스        | UFC Rankings             | https://www.ufc.com/rankings                                                         | 2026-11-02 | 막힘: 403                                | -                      | -     | rankings/ufc.png                |
| 서비스        | U.GG                     | https://u.gg/leaderboards/ranking                                                    | 2026-11-02 | 확인                                     | table x244 w1016 칸7   | -     | rankings/ugg.png                |
| 서비스        | VLR.gg                   | https://www.vlr.gg/rankings                                                          | 2026-11-02 | 확인                                     | table x162 w548 칸None | -     | rankings/vlr.png                |
| 서비스        | Warcraft Logs            | https://www.warcraftlogs.com/zone/rankings/44                                        | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/wcl.png                |
| 서비스        | Wise Old Man             | https://wiseoldman.net/leaderboards                                                  | 2026-11-02 | 막힘: 캡차                               | -                      | -     | rankings/wiseoldman.png         |
| 서비스        | World Athletics          | https://worldathletics.org/world-rankings/overall-ranking/men                        | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/worldathletics.png     |
| 서비스        | Worldometer              | https://www.worldometers.info/world-population/population-by-country/                | 2026-11-02 | 확인                                     | table x168 w1117 칸12  | -     | rankings/worldometer.png        |
| 서비스        | WTA Rankings             | https://www.wtatennis.com/rankings/singles                                           | 2026-11-02 | 막힘: 쿠키 창                            | -                      | -     | rankings/wta.png                |
| 서비스        | Yahoo Finance            | https://finance.yahoo.com/most-active/                                               | 2026-11-02 | 확인                                     | table x185 w1045 칸12  | L160  | rankings/yahoo.png              |
| 서비스        | YouTube Charts           | https://charts.youtube.com/charts/TopSongs/global/weekly                             | 2026-11-02 | 확인                                     | -                      | -     | rankings/youtubecharts.png      |

## 서열표

| 종류          | 곳                     | URL                                                                         | 확인 날짜  | 판정                                 | 본문(자동 측정)        | 옆 칸 | 캡처                       |
| ------------- | ---------------------- | --------------------------------------------------------------------------- | ---------- | ------------------------------------ | ---------------------- | ----- | -------------------------- |
| 디자인 시스템 | Ant Design Card        | https://ant.design/components/card/                                         | 2026-11-02 | 확인                                 | table x349 w927 칸4    | -     | tiers/ds-c-ant.png         |
| 디자인 시스템 | Apple HIG Collections  | https://developer.apple.com/design/human-interface-guidelines/collections   | 2026-11-02 | 확인                                 | rows x470 w740 칸1     | L200  | tiers/ds-c-apple.png       |
| 디자인 시스템 | Atlassian Page layout  | https://atlassian.design/components/page-layout                             | 2026-11-02 | 확인                                 | rows x405 w756 칸1     | -     | tiers/ds-c-atlassian.png   |
| 디자인 시스템 | Carbon Filtering       | https://carbondesignsystem.com/patterns/filtering/                          | 2026-11-02 | 확인                                 | table x310 w557 칸2    | -     | tiers/ds-c-carbon.png      |
| 디자인 시스템 | Clarity Card           | https://clarity.design/documentation/card                                   | 2026-11-02 | 확인                                 | rows x0 w240 칸1       | -     | tiers/ds-c-clarity.png     |
| 디자인 시스템 | Cloudscape Cards       | https://cloudscape.design/components/cards/                                 | 2026-11-02 | 확인                                 | grid x339 w1000000 칸8 | -     | tiers/ds-c-cloudscape.png  |
| 디자인 시스템 | Cloudscape Card view   | https://cloudscape.design/patterns/resource-management/view/card-view/      | 2026-11-02 | 확인                                 | grid x305 w947 칸5     | -     | tiers/ds-c-cloudscape2.png |
| 디자인 시스템 | Fluent Card            | https://fluent2.microsoft.design/components/web/react/core/card/usage       | 2026-11-02 | 확인                                 | rows x32 w259 칸1      | -     | tiers/ds-c-fluent.png      |
| 디자인 시스템 | Gestalt Masonry        | https://gestalt.pinterest.systems/web/masonry                               | 2026-11-02 | 확인                                 | grid x333 w842 칸5     | -     | tiers/ds-c-gestalt.png     |
| 디자인 시스템 | Material 3 Feed layout | https://m3.material.io/foundations/layout/canonical-layouts/feed            | 2026-11-02 | 확인                                 | rows x204 w1032 칸1    | R156  | tiers/ds-c-material.png    |
| 디자인 시스템 | MOJ Filter a list      | https://design-patterns.service.justice.gov.uk/patterns/filter-a-list/      | 2026-11-02 | 확인                                 | rows x300 w1100 칸1    | L300  | tiers/ds-c-moj.png         |
| 디자인 시스템 | MUI Grid               | https://mui.com/material-ui/react-grid/                                     | 2026-11-02 | 확인                                 | rows x360 w778 칸1     | L300  | tiers/ds-c-mui.png         |
| 디자인 시스템 | PatternFly Card view   | https://www.patternfly.org/patterns/card-view/                              | 2026-11-02 | 확인                                 | rows x40 w238 칸1      | -     | tiers/ds-c-patternfly.png  |
| 디자인 시스템 | PatternFly Filters     | https://www.patternfly.org/patterns/filters/                                | 2026-11-02 | 확인                                 | table x314 w1078 칸7   | L290  | tiers/ds-c-patternfly2.png |
| 디자인 시스템 | Polaris Filters        | https://polaris-react.shopify.com/components/selection-and-input/filters    | 2026-11-02 | 막힘: 불러오기 실패                  | -                      | -     | tiers/ds-c-polaris.png     |
| 디자인 시스템 | Primer Layout          | https://primer.style/product/getting-started/foundations/layout/            | 2026-11-02 | 확인                                 | rows x366 w728 칸1     | L300  | tiers/ds-c-primer.png      |
| 디자인 시스템 | Spectrum Cards         | https://spectrum.adobe.com/page/cards/                                      | 2026-11-02 | 막힘: 없는 쪽                        | -                      | -     | tiers/ds-c-spectrum.png    |
| 서비스        | adidas                 | https://www.adidas.com/us/men-shoes                                         | 2026-11-02 | 막힘: 접근 거부                      | -                      | -     | tiers/adidas.png           |
| 서비스        | Amazon                 | https://www.amazon.com/s?k=headphones                                       | 2026-11-02 | 확인                                 | rows x298 w1130 칸1    | L420  | tiers/amazon.png           |
| 서비스        | AniChart               | https://anichart.net/Fall-2026                                              | 2026-11-02 | 확인                                 | grid x14 w1411 칸3     | -     | tiers/anichart.png         |
| 서비스        | AniList                | https://anilist.co/search/anime/top-100                                     | 2026-11-02 | 확인                                 | grid x180 w1080 칸5    | -     | tiers/anilist.png          |
| 서비스        | Album of the Year      | https://www.albumoftheyear.org/ratings/6-highest-rated/all/                 | 2026-11-02 | 막힘: 캡차                           | -                      | -     | tiers/aoty.png             |
| 서비스        | Apple Music New        | https://music.apple.com/us/new                                              | 2026-11-02 | 확인                                 | grid x0 w1440 칸5      | -     | tiers/applemusic.png       |
| 서비스        | arcade-songs           | https://arcade-songs.zetaraku.dev/maimai/                                   | 2026-11-02 | 확인                                 | grid x32 w1376 칸9     | -     | tiers/arcadesongs.png      |
| 서비스        | Backloggd              | https://backloggd.com/games/lib/popular/                                    | 2026-11-02 | 확인                                 | grid x161 w1118 칸6    | L250  | tiers/backloggd.png        |
| 서비스        | Bandcamp Discover      | https://bandcamp.com/discover                                               | 2026-11-02 | 확인                                 | grid x139 w2519 칸27   | -     | tiers/bandcamp.png         |
| 서비스        | BeatSaver              | https://beatsaver.com/                                                      | 2026-11-02 | 확인                                 | grid x72 w1296 칸2     | -     | tiers/beatsaver.png        |
| 서비스        | Best Buy               | https://www.bestbuy.com/site/all-laptops/pc-laptops/pcmcat138500050001.c    | 2026-11-02 | 막힘: 나라 선택                      | -                      | -     | tiers/bestbuy.png          |
| 서비스        | Board Game Arena       | https://boardgamearena.com/gamelist                                         | 2026-11-02 | 확인                                 | grid x0 w1440 칸25     | -     | tiers/bga.png              |
| 서비스        | Blitz.gg               | https://blitz.gg/lol/tierlist                                               | 2026-11-02 | 확인                                 | grid x165 w921 칸6     | R308  | tiers/blitz.png            |
| 서비스        | CHUNITHM 公式          | https://chunithm.sega.jp/song/                                              | 2026-11-02 | 막힘: 404                            | -                      | -     | tiers/chunithm.png         |
| 서비스        | Crunchyroll            | https://www.crunchyroll.com/videos/popular                                  | 2026-11-02 | 막힘: 불러오는 중 · 쿠키 창          | -                      | -     | tiers/crunchyroll.png      |
| 서비스        | Discogs                | https://www.discogs.com/search/?type=master&layout=big                      | 2026-11-02 | 막힘: 캡차                           | -                      | -     | tiers/discogs.png          |
| 서비스        | Dotabuff Heroes        | https://www.dotabuff.com/heroes                                             | 2026-11-02 | 확인                                 | table x125 w781 칸7    | -     | tiers/dotabuff-t.png       |
| 서비스        | Dribbble               | https://dribbble.com/shots/popular                                          | 2026-11-02 | 확인                                 | grid x-287 w3744 칸16  | -     | tiers/dribbble.png         |
| 서비스        | EDHREC                 | https://edhrec.com/commanders                                               | 2026-11-02 | 확인                                 | grid x6 w1128 칸3      | -     | tiers/edhrec.png           |
| 서비스        | Epic Games Store       | https://store.epicgames.com/en-US/browse                                    | 2026-11-02 | 막힘: 캡차                           | -                      | -     | tiers/epic.png             |
| 서비스        | ereter IIDX            | https://ereter.net/iidxsongs/analytics/combined/                            | 2026-11-02 | 확인                                 | table x460 w795 칸8    | L275  | tiers/ereter.png           |
| 서비스        | Etsy                   | https://www.etsy.com/search?q=poster                                        | 2026-11-02 | 막힘: 접근 제한                      | -                      | -     | tiers/etsy.png             |
| 서비스        | Figma Community        | https://www.figma.com/community/ui-kits                                     | 2026-11-02 | 확인                                 | grid x112 w8545 칸80   | -     | tiers/figma.png            |
| 서비스        | Game8 Tier List        | https://game8.co/games/Genshin-Impact/archives/297465                       | 2026-11-02 | 확인                                 | table x300 w728 칸None | -     | tiers/game8.png            |
| 서비스        | genshin.gg Tier List   | https://genshin.gg/tier-list/                                               | 2026-11-02 | 확인                                 | grid x313 w906 칸9     | -     | tiers/genshingg.png        |
| 서비스        | GOG                    | https://www.gog.com/en/games                                                | 2026-11-02 | 확인                                 | grid x454 w814 칸3     | L274  | tiers/gog.png              |
| 서비스        | Goodreads Shelf        | https://www.goodreads.com/shelf/show/fantasy                                | 2026-11-02 | 확인                                 | rows x240 w643 칸1     | -     | tiers/goodreads.png        |
| 서비스        | HowLongToBeat          | https://howlongtobeat.com/?q=                                               | 2026-11-02 | 막힘: 쿠키 창                        | -                      | -     | tiers/hltb.png             |
| 서비스        | H&M                    | https://www2.hm.com/en_us/men/products/t-shirts-tanks.html                  | 2026-11-02 | 막힘: 접근 거부                      | -                      | -     | tiers/hm.png               |
| 서비스        | HSReplay               | https://hsreplay.net/decks/                                                 | 2026-11-02 | 확인                                 | rows x330 w1080 칸1    | L300  | tiers/hsreplay.png         |
| 서비스        | Humble Store           | https://www.humblebundle.com/store                                          | 2026-11-02 | 막힘: 쿠키 창                        | -                      | -     | tiers/humble.png           |
| 서비스        | Icy Veins              | https://www.icy-veins.com/wow/mythic-tier-list                              | 2026-11-02 | 막힘: 없는 쪽                        | -                      | -     | tiers/icyveins.png         |
| 서비스        | IKEA                   | https://www.ikea.com/us/en/cat/chairs-20202/                                | 2026-11-02 | 확인                                 | grid x28 w1384 칸4     | -     | tiers/ikea.png             |
| 서비스        | IMDb Search            | https://www.imdb.com/search/title/?title_type=feature&sort=user_rating,desc | 2026-11-02 | 막힘: 캡차                           | -                      | -     | tiers/imdb-t.png           |
| 서비스        | itch.io                | https://itch.io/games                                                       | 2026-11-02 | 확인                                 | grid x280 w1140 칸4    | L260  | tiers/itch.png             |
| 서비스        | JustWatch              | https://www.justwatch.com/us/movies                                         | 2026-11-02 | 확인                                 | grid x64 w1312 칸358   | -     | tiers/justwatch.png        |
| 서비스        | KREAM                  | https://kream.co.kr/search                                                  | 2026-11-02 | 확인                                 | grid x80 w1280 칸5     | -     | tiers/kream.png            |
| 서비스        | LEGO                   | https://www.lego.com/en-us/themes/star-wars                                 | 2026-11-02 | 막힘: 연령 창                        | -                      | -     | tiers/lego.png             |
| 서비스        | Letterboxd             | https://letterboxd.com/films/popular/this/week/                             | 2026-11-02 | 막힘: 캡차                           | -                      | -     | tiers/letterboxd.png       |
| 서비스        | Limitless TCG          | https://limitlesstcg.com/decks                                              | 2026-11-02 | 확인                                 | table x80 w1280 칸None | -     | tiers/limitless.png        |
| 서비스        | Lolalytics             | https://lolalytics.com/lol/tierlist/                                        | 2026-11-02 | 확인                                 | rows x201 w1038 칸1    | -     | tiers/lolalytics.png       |
| 서비스        | maimai DX 公式         | https://maimai.sega.jp/song/                                                | 2026-11-02 | 확인                                 | rows x260 w920 칸1     | -     | tiers/maimai.png           |
| 서비스        | MyAnimeList Seasonal   | https://myanimelist.net/anime/season                                        | 2026-11-02 | 막힘: 쿠키 창                        | -                      | -     | tiers/malseason.png        |
| 서비스        | Maxroll Tier List      | https://maxroll.gg/d4/tierlists/endgame-tier-list                           | 2026-11-02 | 막힘: 쿠키 창                        | -                      | -     | tiers/maxroll.png          |
| 서비스        | Metacritic             | https://www.metacritic.com/browse/game/                                     | 2026-11-02 | 확인                                 | rows x397 w971 칸1     | L321  | tiers/metacritic.png       |
| 서비스        | MetaTFT                | https://www.metatft.com/comps                                               | 2026-11-02 | 확인                                 | rows x165 w1110 칸1    | -     | tiers/metatft.png          |
| 서비스        | Mobalytics TFT         | https://mobalytics.gg/tft/tier-list                                         | 2026-11-02 | 확인                                 | grid x143 w975 칸9     | -     | tiers/mobalytics.png       |
| 서비스        | Moxfield               | https://www.moxfield.com/decks/public                                       | 2026-11-02 | 확인                                 | rows x51 w1143 칸1     | -     | tiers/moxfield.png         |
| 서비스        | 무신사                 | https://www.musinsa.com/category/001                                        | 2026-11-02 | 확인                                 | grid x45 w1395 칸16    | -     | tiers/musinsa.png          |
| 서비스        | MyDramaList            | https://mydramalist.com/shows/top                                           | 2026-11-02 | 확인                                 | rows x168 w728 칸1     | -     | tiers/mydramalist.png      |
| 서비스        | Netflix Genre          | https://www.netflix.com/browse/genre/34399                                  | 2026-11-02 | 막힘: 가입 유도 화면                 | -                      | -     | tiers/netflix.png          |
| 서비스        | Nike                   | https://www.nike.com/w/mens-shoes-nik1zy7ok                                 | 2026-11-02 | 막힘: 쿠키 창                        | -                      | -     | tiers/nike.png             |
| 서비스        | Nintendo Store         | https://www.nintendo.com/us/store/games/                                    | 2026-11-02 | 확인                                 | grid x359 w1052 칸4    | L330  | tiers/nintendo.png         |
| 서비스        | O.N.G.E.K.I. 公式      | https://ongeki.sega.jp/music/                                               | 2026-11-02 | 확인                                 | rows x0 w1440 칸1      | -     | tiers/ongeki.png           |
| 서비스        | OP.GG Champions        | https://op.gg/lol/champions                                                 | 2026-11-02 | 확인                                 | grid x188 w316 칸6     | -     | tiers/opgg-t.png           |
| 서비스        | osu! Beatmaps          | https://osu.ppy.sh/beatmapsets                                              | 2026-11-02 | 확인                                 | rows x235 w970 칸1     | -     | tiers/osu-beatmaps.png     |
| 서비스        | Pexels                 | https://www.pexels.com/search/nature/                                       | 2026-11-02 | 확인                                 | grid x191 w1219 칸18   | -     | tiers/pexels.png           |
| 서비스        | Pokémon DB             | https://pokemondb.net/pokedex/national                                      | 2026-11-02 | 확인                                 | grid x142 w1156 칸8    | -     | tiers/pokemondb.png        |
| 서비스        | Pokémon Pokédex        | https://www.pokemon.com/us/pokedex                                          | 2026-11-02 | 막힘: 접근 거부                      | -                      | -     | tiers/pokemonofficial.png  |
| 서비스        | Prydwen Star Rail      | https://www.prydwen.gg/star-rail/tier-list                                  | 2026-11-02 | 확인                                 | rows x300 w1090 칸1    | -     | tiers/prydwen.png          |
| 서비스        | PlayStation Store      | https://store.playstation.com/en-us/pages/browse                            | 2026-11-02 | 확인                                 | grid x72 w1296 칸6     | -     | tiers/psstore.png          |
| 서비스        | Rivals Meta            | https://rivalsmeta.com/characters                                           | 2026-11-02 | 확인                                 | table x186 w1068 칸7   | -     | tiers/rivalsmeta.png       |
| 서비스        | Scryfall               | https://scryfall.com/search?q=set%3Afdn&order=cmc                           | 2026-11-02 | 확인                                 | grid x220 w1000 칸4    | -     | tiers/scryfall.png         |
| 서비스        | SDVX.in                | https://sdvx.in/sort/sort_20.htm                                            | 2026-11-02 | 막힘: 영상 화면                      | -                      | -     | tiers/sdvxin.png           |
| 서비스        | Smogon Dex             | https://www.smogon.com/dex/sv/formats/ou/                                   | 2026-11-02 | 확인                                 | rows x130 w854 칸1     | -     | tiers/smogon.png           |
| 서비스        | Steam Search           | https://store.steampowered.com/search/?filter=topsellers                    | 2026-11-02 | 확인                                 | rows x120 w876 칸1     | -     | tiers/steamsearch.png      |
| 서비스        | Stella BMS 難易度表    | https://stellabms.xyz/st/table.html                                         | 2026-11-02 | 막힘: BeMusicSeeker 표 불러오기 대기 | -                      | -     | tiers/stella.png           |
| 서비스        | STRATZ                 | https://stratz.com/heroes                                                   | 2026-11-02 | 막힘: 토큰 한도 창                   | -                      | -     | tiers/stratz.png           |
| 서비스        | 太鼓の達人 公式        | https://taiko.namco-ch.net/taiko/songlist/                                  | 2026-11-02 | 확인                                 | table x220 w1000 칸3   | -     | tiers/taiko.png            |
| 서비스        | TFT Academy            | https://tftacademy.com/tierlist/comps                                       | 2026-11-02 | 확인                                 | rows x270 w1022 칸1    | -     | tiers/tftacademy.png       |
| 서비스        | TierMaker              | https://tiermaker.com/categories/video-games/                               | 2026-11-02 | 막힘: 불러오기 실패                  | -                      | -     | tiers/tiermaker.png        |
| 서비스        | TMDB                   | https://www.themoviedb.org/movie                                            | 2026-11-02 | 확인                                 | grid x60 w1320 칸10    | -     | tiers/tmdb.png             |
| 서비스        | Trakt                  | https://trakt.tv/shows/trending                                             | 2026-11-02 | 막힘: 불러오는 중                    | -                      | -     | tiers/trakt.png            |
| 서비스        | Tubi                   | https://tubitv.com/category/most_popular                                    | 2026-11-02 | 막힘: 지역 제한                      | -                      | -     | tiers/tubi.png             |
| 서비스        | U.GG Tier List         | https://u.gg/lol/tier-list                                                  | 2026-11-02 | 확인                                 | table x244 w1016 칸9   | -     | tiers/ugg-t.png            |
| 서비스        | UNIQLO                 | https://www.uniqlo.com/us/en/men/tops/t-shirts                              | 2026-11-02 | 막힘: 접근 거부                      | -                      | -     | tiers/uniqlo.png           |
| 서비스        | Unsplash               | https://unsplash.com/t/nature                                               | 2026-11-02 | 막힘: 캡차                           | -                      | -     | tiers/unsplash.png         |
| 서비스        | Untapped Marvel Snap   | https://snap.untapped.gg/en/meta/tier-list                                  | 2026-11-02 | 확인                                 | rows x90 w1310 칸1     | -     | tiers/untapped.png         |
| 서비스        | Xbox Games             | https://www.xbox.com/en-US/games/browse                                     | 2026-11-02 | 확인                                 | grid x504 w783 칸4     | L272  | tiers/xbox.png             |

## 랭킹 폭을 실제 화면에 입혀 잼

`localhost:3000/ko/rankings` 에 폭 값만 입혀 찍었다. 코드는 바꾸지 않았고, 줄은 개발 DB 1명을 복제했다. 캡처는 `w768/` 아래에 있다.

| 값  | 폭 1056 | 폭 1440 | 폭 1920 | 가로 넘침 |
| --- | ------- | ------- | ------- | --------- |
| 640 | x208    | x400    | x640    | 없음      |
| 768 | x144    | x336    | x576    | 없음      |

## 서열표 틀을 실제 화면에 입혀 잼

`localhost:3000/ko/tiers` 에 악곡 목록 결정과 같은 값(표준 폭 1152 · 레일 274 · 격자 사이 12)을 입혀 찍었다. 캡처는 `t-real/f-*.png`, 입힌 코드는 `_scripts/t3.cjs` 다.

| 폭   | 틀          | 결과 | 5열 카드 | 4열 카드 | 결과 열 위 검색 560 |
| ---- | ----------- | ---- | -------- | -------- | ------------------- |
| 1056 | x24 · 1008  | 718  | 134      | 미측정   | 문서 폭 1090, 넘침  |
| 1440 | x144 · 1152 | 862  | 163      | 207      | 넘침 없음           |
| 1920 | x384 · 1152 | 862  | 163      | 미측정   | 넘침 없음           |

## 서열표 격자 열 수 다시 잼 (2026-11-04)

앞 표의 「칸」 은 자동 측정이라 열 수로 쓰지 않는다. 사용자 지적(「다른 서비스는 5열보다 훨씬 많은 열을 쓴다」)으로 서열 · 티어 화면의 첫 줄 칸 수 · 그림 크기 · 사이를 다시 쟀다(1440, 로그아웃). 1차 45곳 · 2차 39곳을 열었고, 아래는 캡처를 직접 열어 센 곳만 적는다. 캡처는 `~/noslog-research/desktop-rankings/cols/`, 자동값 전체는 같은 폴더 `results.jsonl`.

| 곳                                         | URL                                       | 한 줄 칸 | 그림  | 칸 폭 · 사이 | 폭이 바뀌면                  | 캡처                      |
| ------------------------------------------ | ----------------------------------------- | -------- | ----- | ------------ | ---------------------------- | ------------------------- |
| V-Archive 서열표(DJMAX)                    | https://v-archive.net/grade/4             | 11       | 90    | 102 · 12     | 자켓 90 고정, 1056 에서 10칸 | cols/v-archive-grade4.png |
| arcade-songs(maimai · CHUNITHM · オンゲキ) | https://arcade-songs.zetaraku.dev/maimai/ | 9        | 100   | 148 · 48     | 미확인                       | cols/arcade-maimai.png    |
| genshin.gg 티어 리스트                     | https://genshin.gg/tier-list/             | 9        | 60    | 약 99        | 1056 · 1920 모두 9칸         | cols/genshin-gg.png       |
| unite-db 티어 리스트                       | https://unite-db.com/tier-list/pokemon    | 9        | 76    | 약 101 · 25  | 1056 · 1920 모두 9칸         | cols/unite-db.png         |
| TFT Academy 티어 리스트                    | https://tftacademy.com/tierlist/comps     | 9        | 약 72 | 90           | 미확인                       | cols/tftacademy.png       |
| wuthering.gg 티어 리스트                   | https://wuthering.gg/tier-list            | 5        | 70    | 약 196       | 미확인(아이콘 옆 역할 표시)  | cols/wuthering-gg.png     |

- 세지 않음: prydwen 5곳(Cloudflare 확인 화면) · Pocket Tactics(광고, 표가 화면 아래) · Game8(표가 화면 아래) · 자동값만 있는 나머지 곳.
- NosLog 지금: 격자 `auto-fill` 최소 약 111 · 사이 16 이라 결과 860 에서 6칸(카드 약 130), 718 에서 5칸.
- 서열 · 티어 화면은 칸 약 90–100 에 한 줄 9칸 안팎이 많다(확인 6곳 중 5곳). NosLog 와 같은 리듬게임 서열표인 V-Archive 는 자켓 90 · 사이 12 고정이다.

## 가이드 · 설계 방법 (2026-11-05)

사용자 지시(「가이드 · 그리드 가이드 · 디자인 가이드 · 설계 방법을 찾아보지 않고 NosLog 에 맞춘다」)로, 서열표 · 랭킹의 고르지 않은 부분을 다시 짜기 전에 찾은 근거다. 원문을 직접 읽지 못한 곳은 「요약 출처」 로 적는다.

| 출처                                                                                                                                                     | 내용                                                                                                                                                                  | 확인      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Baymard 「Horizontal filtering & sorting」 https://baymard.com/blog/horizontal-filtering-sorting-design                                                  | 가로 필터 줄은 필터 종류가 적을 때만 맞다. 한 줄에 다 안 들어가면 더 보려고 눌러야 하고 개관이 어렵다. 대신 사이드바를 없애 썸네일을 키우거나 한 열을 더 넣을 수 있다 | 요약 출처 |
| Shopify 「Storefront filtering UX」 https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering/storefront-filtering-ux | 가로 줄은 한 번에 필터 5개 미만인 곳에 맞다                                                                                                                           | 요약 출처 |
| Material 3 canonical layouts · window size classes https://developer.android.com/codelabs/adaptive-material-guidance                                     | expanded(840+) 2칸, large(1200+) 2칸, extra-large 2–3칸. 칸 수는 폭에 따라 바뀌고 고정 크기에 묶지 않는다                                                             | 요약 출처 |
| Carbon 2x Grid https://carbondesignsystem.com/elements/2x-grid/overview/                                                                                 | 16칸 · 사이 32 · 최대 1584, 폭 단계 672 · 1056 · 1312 · 1584                                                                                                          | 요약 출처 |
| SAP Fiori flexible grid · bslib column layout · Frontend Masters                                                                                         | 카드 격자는 최소 폭을 정하고 칸 수는 자동(auto-fill · minmax). 고정 칸 수는 중간 폭에서 카드가 너무 좁아진다                                                          | 요약 출처 |

- 서열표 필터는 지금 구간 · 난이도 · 공식 레벨 · Real 레벨로 4종류 이상이고 선택지가 많다. 위 근거로는 사이드바가 맞고, 가로 줄(V-Archive)로 옮기면 필터를 드롭다운으로 접어야 한다.

## 서열표 구간 머리 · 줄 틀 (2026-11-05)

1440 폭 캡처를 열어 보고 계산값을 쟀다. 실제 서비스 6곳, 근거 약함.

| 서비스       | 구간 칸                                                         | 내용 칸                                                                           | 구간 사이 |
| ------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------- |
| V-Archive    | 칸 없음. 위 띠 37, 서열 색 20% 면, 왼쪽 막대 5, 숫자 20/28 굵게 | 띠 아래 8, 격자 아래 12                                                           | 4         |
| genshin.gg   | 92, 서열 색 면, 21 굵게 어두운 글자                             | 바깥 상자 하나, 줄 사이 선 1, 안쪽 7.5                                            | 0(선)     |
| unite-db     | 75, 서열 색 면, 20.8 어두운 글자, 둥글기 왼쪽만 5               | 구간마다 상자                                                                     | 15        |
| wuthering.gg | 95, 서열 색 면, 25.6 굵게 어두운 글자, 둥글기 왼쪽만 5          | 구간마다 면 상자, 둥글기 5, 안쪽 16                                               | 10        |
| Blitz        | 127, 안쪽 위 24 · 옆 12, 등급 방패 그림, 서열 색 그라데이션 면  | 서열 색 8% 면, 둥글기 16, 안쪽 12, 칸 사이 8                                      | 12        |
| TFT Academy  | 110 네모, 서열 색 그라데이션 면, 글자 하나                      | 서열 색 테두리 3, 둥글기 28(안 24), 안쪽 12 · 24, 안은 서열 색이 위에서 옅게 비침 | 16        |

## 서열표 제목 줄 (2026-11-05)

서열 · 티어 서비스 49곳의 1440 캡처(`cols/`) 머리를 열어 봤다. 보안 확인 · 오류 · 로딩 · 기사 머리에 막힌 14곳(arcaea fandom · Bestdori · CHUNITHM 공식 · DDR 공식 · DDR sanbai · METAsrc · MuseDash.moe · OP.GG · Overbuff · pjsekai.moe · RoyaleAPI · tracker.gg · Pocket Gamer · Pocket Tactics)은 세지 않아 실제 서비스 35곳이다. 디자인 시스템은 5곳(Primer · Atlassian · Elastic UI · PatternFly · Polaris)을 읽었고 Carbon · GitLab · Ant Design Pro 는 문서를 열지 못해 미확인이다.

- 제목 자체가 고르기 목록인 곳: 35곳 중 DXRating 1곳(가운데 버전 그림 ⌄). 디자인 시스템 5곳 문서에는 없다.
- 제목 아래 탭 · 단추로 목록을 고르는 곳: Blitz · TFT Academy · V-Archive · Rivals Meta. Primer · Elastic UI 도 탭을 제목 아래에 둔다.
- 업데이트 날짜를 제목 줄에 두는 곳: Blitz · MetaTFT · Marvel Snap Zone · Game8 · unite-db · TFT Academy · Dexerto.

| 서비스      | 제목                                       | 목록 고르기                                                   | 업데이트 · 동작                                                                          |
| ----------- | ------------------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Blitz       | 위 경로 12/16, 제목 24/32 굵게             | 머리 아래 24, 탭 높이 40 · 글자 16 · 고른 탭 밑 막대 24       | 글줄 14/19 굵기 600 흐림(위 4), 오른쪽 끝 단추 32×32 · 둥글기 8 · 회색 15% 면(링크 복사) |
| V-Archive   | 가운데 24/32 굵게(위아래 8), 상자 안 36/40 | 그림 단추 130×64 · 사이 8 · 둥글기 8, 고르지 않으면 흐림      | 없음. 위에 접히는 원본 안내 줄                                                           |
| unite-db    | 왼쪽 24/24 굵게, 오른쪽 검색칸             | 다음 줄(위 15) 고르기 목록 150×33 · 둥글기 5                  | 업데이트 글자 16, 범례 면 단추 높이 33 · 안쪽 7.5 · 15                                   |
| TFT Academy | 큰 제목 96/96(Druk XCond)                  | 밑줄 탭 높이 32 · 안쪽 4 · 20 · 밑줄 2, 오른쪽 알약 고르기 36 | 위 알약 36 · 테두리 2 · 칸 사이 선 2(Patch, Last Updated)                                |

## 서열표 제목 줄 오른쪽 (2026-11-06)

같은 35곳에서 제목 줄 오른쪽(또는 제목 바로 아래)에 둔 것. 다크(`colorScheme: dark`)로 다시 쟀다. 실제 서비스 6곳이라 근거 약함.

| 서비스       | 놓은 것                                  | 값                                                                           |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------- |
| unite-db     | 검색칸                                   | 300×42, 제목 줄 오른쪽                                                       |
| TFT Academy  | 검색 · 고르기 알약                       | 알약 36 · 테두리 2, 탭 줄 오른쪽                                             |
| MetaTFT      | 정보 상자(Last Updated · Comps Analyzed) | 240×46 · 면 · 둥글기 4 · 안쪽 5 · 10, 12/18, 이름 왼쪽 보통 · 값 오른쪽 굵게 |
| Blitz        | 링크 복사 아이콘 단추                    | 32×32 · 둥글기 8 · 회색 15% 면 · 안쪽 4                                      |
| genshin.gg   | 제목 아래 알약 줄(기준 · 버전 · 만들기)  | 높이 40 · 테두리 1 · 둥글기 5 · 14/21 · 사이 10, 제목 묶음 아래 20           |
| wuthering.gg | 제목 아래 줄(공유 · 만들기 단추)         | 154×39 · 둥글기 5 · 안쪽 10 · 16 · 15/600, 아이콘 사이 5                     |

비어 있는 곳: V-Archive · Game8 · Marvel Snap Zone · Rivals Meta 등 나머지. 게임 버전 · 패치 · 「내 티어표 만들기」 는 NosLog 에 해당 데이터 · 기능이 없다.

## 서열표 머리 동작 · 빈 자리 (2026-11-06)

서열 · 티어 · 순위 · 차트 서비스 머리를 1440 · 다크로 맨 위에서 다시 찍었다(앞의 `cols/` 는 격자 위치로 스크롤한 캡처라 머리가 빠져 있었다). 실제 서비스 55곳을 셌고, 막힌 곳(mobalytics · u.gg · op.gg · prydwen · dotabuff · stratz · hsreplay · tiermaker · IMDb · Letterboxd 등)은 세지 않았다. 다크가 없는 12곳(Billboard · Melon · Bugs · Genie · ORICON 등)은 밝게 찍혔다. 캡처 · 실측 원본은 `~/noslog-research/desktop-rankings/hdr/`(shots · hdr.jsonl · measure.jsonl). 디자인 시스템 9곳.

- 공유 · 저장 같은 동작이 머리에 있는 곳은 18/55다. 모양별로는 아이콘만 6(Blitz · arcade-songs · Billboard · ORICON · Netflix · Spotify), 아이콘+글자 9(Game8 · wuthering.gg · Mobile Matters · Dexerto · Melon · Bugs · Genie · VIBE · Google Trends), 글자만 2(genshin.gg · YES24), ⋯ 만 1(Apple Music)이다.
- ⋯ 메뉴를 둔 곳은 3곳(Spotify · Apple Music · VIBE)이다. 셋 다 동작이 많은 음악 서비스이고 공유를 ⋯ 안에 둔다.
- 이미지로 저장하는 단추는 0곳이다.
- 제목 줄 가운데에 따로 무언가를 놓은 곳은 0곳이다. 빈 가로를 채우는 방식은 두 가지였다. 설명 글을 본문 폭까지 늘린 곳(Blitz · MetaTFT · Kaiden · Game8 · ptcgpocket)과, 제목 아래 줄 오른쪽에 동작을 둔 곳(Billboard · VIBE · Netflix)이다.

| 서비스    | 자리                   | 동작 · 모양                               | 값                                                                           | 캡처                       |
| --------- | ---------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- | -------------------------- |
| Blitz     | 제목 줄 오른쪽 끝      | 링크 복사, 아이콘만                       | 32×32 · 둥글기 8 · 회색 15% 면 · 아이콘 24, 누르면 「Copied!」 말풍선 · 체크 | shots/blitz-lol.png        |
| Billboard | 제목 아래 날짜 줄 끝   | 달력 · 안내 · 공유, 아이콘만              | 면 단추 48×40 · 사이 12 · 아이콘 24, 날짜 상자 241×33 테두리 1               | shots/billboard2-title.png |
| VIBE      | 메타 아래 30           | 전체재생 · 랜덤재생 아이콘+글자, 나머지 ⋯ | 134×42 · 둥글기 4 · 사이 10, ⋯ 원 42 · 사이 14                               | shots/vibe.png             |
| Spotify   | 메타 아래 줄           | 재생 · 셔플 · 저장 아이콘만, 공유는 ⋯ 안  | 재생 원 56, 나머지 32 · 사이 24                                              | shots/spotify-top50.png    |
| wuthering | 제목 아래 줄 왼쪽 · 끝 | 공유 아이콘+글자 · 만들기 글자            | 154×39 · 둥글기 5 · 15/600, 누르면 「Link Copied!」                          | shots/wuthering-gg.png     |
| genshin   | 제목 아래 줄 오른쪽    | 만들기 글자                               | 300×40 · 둥글기 5                                                            | shots/genshin-gg.png       |

디자인 시스템(9곳, 모두 문서를 읽음 · Spectrum 은 가이드가 404 라 구현 문서로 대신함):

- Material 3 앱 바: 동작은 1–2개, 뒤쪽 아이콘은 2개까지, 넘침 메뉴는 되도록 피한다. 아이콘 단추는 흔한 동작에만 쓴다.
- Apple HIG 툴바: 기호를 먼저 쓰되 기호로 나타내기 어려운 동작은 글자로. More 메뉴는 덜 중요한 동작용이다.
- Primer PageHeader: 경로 → 제목 줄(동작) → 설명 → 탭 순서다. 아이콘만 단추는 툴팁 · 접근성 이름이 꼭 있어야 한다.
- Atlassian · Polaris: 제목 오른쪽에 글자 단추를 둔다. Polaris 는 동작이 많으면 드롭다운으로 묶는다.
- Carbon · Fluent 2 · Spectrum: 넘침은 덜 쓰는 동작이나 자리가 모자랄 때만 쓴다. 아이콘만 단추에는 툴팁을 단다.
- NN/g: 흔한 아이콘에도 글자를 붙인다. 동작이 한두 개면 ⋯ 메뉴를 만들지 않는다.

미확인: Spectrum 가이드 원문 · Carbon 페이지 머리 · Atlassian 개수 한도. 게임 서열 사이트가 많이 막혀서 동작을 꺼낸 예가 음악 차트 쪽에 몰려 있다(근거 치우침).

## 서열표 머리 검색칸 · 아이콘 맞춤 (2026-11-06)

머리에 검색칸과 아이콘 동작 단추가 함께 있는 실제 서비스 27곳을 1440 · 다크로 맨 위에서 찍어 쟀다(그 밖에 제목 + 검색 + 글자 단추만 있는 5곳은 참고). 막힌 곳(npm · Discogs · RateYourMusic · ScoreSaber · Mobalytics · Letterboxd · MyAnimeList · BoardGameGeek · speedrun.com · Civitai · Behance · PyPI)은 세지 않았다. 캡처 · 실측 원본은 `~/noslog-research/desktop-rankings/align/`. 이 중 9곳만 페이지 · 구역 머리이고(GitHub · GitLab · Hugging Face · Blitz · Steam · AniList · RivalsMeta · MetaTFT · BeatSaver), 나머지는 사이트 맨 위 막대라 근거로 약하다.

- 같은 줄 22곳, 위아래 5곳(GitHub 페이지 · Steam · op.gg · BeatSaver · Beatport).
- 같은 줄 22곳은 모두 세로 중심 차이가 1px 이하였다. 15곳은 아이콘 높이를 검색칸과 같게 맞췄다(GitLab · Blitz 필터 줄 · AniList · RivalsMeta · YouTube · Spotify · shadcn · Next.js · MUI · Ant Design · JSR · Grafana · Melon · pkg.go.dev · itch).
- 위아래 5곳도 아이콘을 아래 줄 글자나 컨트롤 줄의 중심에 맞췄다. GitHub 저장소 목록은 개수 글자(14/21)와 아이콘 32 의 중심이 같다.
- 검색칸 아래에 높이가 다른 아이콘을 오른쪽 끝만 맞춰 쌓은 곳은 없었다.
- 맞춘 아이콘 높이는 32 가 8곳으로 가장 많았다(GitHub · GitLab · shadcn · Next.js · MUI · Ant Design · Twitch · Beatport). 아이콘끼리 사이는 묶음형이 0–2, 따로 선 것이 8(MUI · GitLab · RivalsMeta · Twitch)이다.

| 서비스     | 검색칸      | 아이콘                               | 배치 · 맞춤                            | 캡처                     |
| ---------- | ----------- | ------------------------------------ | -------------------------------------- | ------------------------ |
| GitLab MR  | 895×32      | 32×32 · 둥글기 8 · 회색 면, 사이 8   | 같은 줄, 높이 같음, 중심 같음          | align/gitlab-mrs.png     |
| HF Models  | 224×28 알약 | 글자 단추 30                         | 제목 18/28 과 한 줄, 중심 같음         | align/hf-models.png      |
| GitHub     | 1136×32     | 보기 전환 32×32 둘, 사이 1           | 위아래, 아이콘은 개수 글자와 중심 같음 | align/gh-orgrepos.png    |
| AniList    | 170×38      | 필터 38×38 · 둥글기 6 · 칸과 같은 면 | 같은 줄, 높이 같음                     | align/anilist-search.png |
| RivalsMeta | 191×39      | 역할 43×39 · 둥글기 5, 사이 8        | 같은 줄, 높이 같음                     | align/rivalsmeta.png     |
| shadcn/ui  | 256×32      | 32 면 없음                           | 같은 줄, 높이 같음(맨 위 막대)         | align/shadcn.png         |

디자인 시스템:

- Primer: 컨트롤 크기 24 · 28 · 32 · 40 · 48 을 단추 · 입력칸 · 고르기에 함께 쓰고, 관련 컨트롤에 같은 크기를 쓰라고 한다. PageHeader 는 동작을 제목 줄 박스 가운데에 세운다.
- Carbon: 32 입력칸엔 small 단추, 40 입력칸엔 medium 단추를 짝짓고, 한 묶음에 크기를 섞지 말라고 한다.
- Ant Design: controlHeight 32 를 단추와 입력칸이 함께 쓴다(LG 40 · SM 24).
- Atlassian: 동작은 제목 오른쪽, 검색 · 필터는 아래 막대. Fluent 2 는 Button · SearchBox 가 같은 크기 단계(px 미확인). Apple HIG 는 검색칸을 도구 막대 뒤쪽에 둔다.
- 미확인: Spectrum · GitLab Pajamas.

## 서열표 레일 안 필터 모양 (2026-11-06)

필터 레일이 있는 실제 서비스 68곳을 1440 · `colorScheme:'dark'` 로 찍었다. 막힌 12곳(Epic · Amazon · eBay · Newegg · Nexus Mods · CurseForge · Discogs · Expedia · PyPI · Best Buy · B&H · SoundCloud)과 레일이 없는 4곳(Humble · Coursera · Udemy · Vercel Templates)을 빼고 52곳을 셌고, 그중 다크는 34곳이다. 캡처 · 실측 원본은 `~/noslog-research/desktop-rankings/rail/`(`<id>-rail.png` 레일 전체, `<id>-picked.png` 하나 누른 뒤). 대표 8곳(Docker Hub · GOG · Microsoft Learn · Steam · Eneba · SDVX INDEX · GitHub 검색 · Ultimate Guitar)과 GMG · mod.io · Fab · Obsidian 은 캡처를 열어 값을 확인했다.

- 조작은 체크박스 32곳이 가장 많고, 셀렉트 16 · 링크 목록 16 · 슬라이더 12 · 칩 10 · 최소/최대 칸 9 순이다.
- 그룹 사이는 선 24 · 여백 14 · 그룹마다 상자 · 띠 12. 그룹 제목 오른쪽은 접기 꺾쇠 28 · 없음 17.
- 체크 줄 간격은 가운데값 34(27곳, 30–38 사이 17곳), 체크 상자는 20 이 8곳으로 가장 많다.
- 개수가 있는 22곳 중 오른쪽 정렬 13 · 이름 뒤 9, 다크만 보면 9 대 4. 개수 글자는 이름보다 옅게 칠하는 곳이 많다.
- 순서 있는 값은 슬라이더 11 · 최소/최대 칸 9 로 범위 고르기가 많다. 떨어진 값 여럿을 고르는 칩 · 체크는 6곳뿐이다.
- 고른 필터 모음은 결과 위 칩 11 · 레일 맨 위 칩 5 · 없음 13(29곳 확인, 23곳 미확인).

| 묶음                              | 곳(셈 / 다크) | 대표 · 값                                                                                                 | 캡처                       |
| --------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| A 펼친 그룹 + 체크 목록, 선 구분  | 18 / 8        | Docker Hub: 레일 256 · 제목 16/500 + 오른쪽 꺾쇠 · 선 1px · 체크 20 · 줄 42 · 5개 뒤 「Show more」        | rail/dockerhub-rail.png    |
| B 그룹마다 상자 · 띠 + 체크, 개수 | 7 / 5         | Steam: 레일 310 · 그룹마다 1px 상자 · 제목 띠 12/400 · 체크 16 · 줄 30 · 개수는 이름 뒤 기울임 50%        | rail/steam-rail.png        |
| C 칩 · 알약                       | 5 / 4         | SDVX INDEX: 레벨 칩 82×32 알약 2열 · 정수 묶음 「(ALL)」 전폭 · 1px 선 · 개수 없음                        | rail/sdvxindex-rail.png    |
| D 목록 + 오른쪽 개수              | 12 / 11       | GitHub 검색: 줄 32 · 글자 14 · 개수 알약 배지 12/600 높이 20 · 제목 12/600 회색 · 선 구분 · 언어 앞 색 점 | rail/githubsearch-rail.png |

- 짧은 값(3–6개)은 체크 목록이 가장 많다(GOG · Docker · MS Learn · Codecademy · Steam · Apple · Eneba). 칩은 SDVX INDEX · Google Fonts · BeatLeader · Hugging Face · TMDB.
- 묶음과 세부 값을 함께 고르는 칩은 SDVX INDEX 하나다(근거 약함).

디자인 시스템 10곳(Carbon · Polaris · PatternFly · Cloudscape · Primer · Material 3 · Spectrum · Fluent 2 · Ant Design · Atlassian):

- 필터에 체크박스를 권하는 곳 5(Carbon · Polaris · PatternFly · Cloudscape · Primer). 칩은 고른 값을 보여 주는 데 쓰는 곳 5, 체크박스 대신 권하는 곳은 M3 filter chip 하나다.
- 수 기준: Cloudscape 는 체크 7개를 넘으면 multiselect, 16개를 넘으면 그룹으로 나눈다(원문 확인). Fluent 7개 · PatternFly 5개 · Polaris 20개는 미확인.
- 선택지 옆 개수는 Primer CounterLabel 하나만 다룬다. 전체 지우기는 4곳, 그룹마다 지우기는 2곳(Carbon · PatternFly).
- M3 filter chip 은 높이 32dp · 둥글기 8dp · 사이 8dp(원문 확인).

미확인: Spectrum 지침 원문(막힘). 고른 필터 모음 · 모두 지우기는 필터 하나만 눌러 봐서 20곳 넘게 미확인이다. Eneba 「Game」 · Steam 「English」 는 기본 선택이 든 채로 찍혔다.

## 서열표 정렬 줄 모양 (2026-11-07)

자켓 · 포스터 · 카드 격자 바로 위 도구 줄을 1440 · `colorScheme:'dark'` 로 74곳 찍었다. 막힌 18곳(캡차 · 봇 확인 12 · 429 · 522 · 로딩 멈춤 · DNS · 잘못된 주소)과 구조가 맞지 않는 21곳(줄 목록 · 필터만 · 캐러셀 등)을 빼고 35곳을 셌고, 그중 다크는 25곳이다. 캡처 · `summary.tsv` · 디자인 시스템 원문은 `~/noslog-research/desktop-rankings/toolbar/`. V-ARCHIVE · Backloggd · LiveChart 캡처는 직접 열어 값을 확인했다.

| 항목            | 개수(35곳 중)                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------- |
| 정렬 자리       | 오른쪽 21(Backloggd · GOG · AniList · BeatSaver · LiveChart 등) · 왼쪽 12(V-ARCHIVE · Dribbble 등) |
| 정렬 모양       | 글자 드롭다운 13 · 상자 드롭다운 10 · 패널 안 4 · 아이콘 3 · 세그먼트 2 · 칩 1 · 없음 2            |
| 「정렬」 라벨   | 붙음 14곳(Backloggd 「Sort by」 · GOG · LiveChart 「Sort:」 등)                                    |
| 이름 보이기     | V-ARCHIVE 한 곳(토글 단추 82×39 · 체크 아이콘 + 「이름 on/off」 두 줄 · 켜짐 = 밝은 면 · 맨 왼쪽)  |
| 카드 표시 설정  | 10곳(메뉴 · 팝오버 안 LiveChart · VNDB, 밀도 세그먼트 Simple Icons, 크기 슬라이더 SteamGridDB 등)  |
| 카드 위 값 고름 | VNDB · LiveChart 2곳. V-ARCHIVE 는 로그아웃 화면에 없어 미확인                                     |
| 결과 수         | 14곳                                                                                               |

- V-ARCHIVE 서열표: 면 띠 55 · 모서리 10 · 안쪽 16, 이름 on/off 82×39 →12→ 정렬 상자 96×36(면 채움 · 모서리 8 · 14 · 라벨 없음), 오른쪽에 레벨 · DLC 필터.
- Backloggd: 왼쪽 결과 수 「327,113 Games」 14 · 오른쪽 「Apply Filters」 →20→ 「Sort by」 라벨 + 정렬 아이콘 + 값 글자 드롭다운, 줄 24 · 아래 8.
- 디자인 시스템 8곳(Material 3 · Carbon · Fluent 2 · Atlassian · Primer · Cloudscape · Polaris · React Spectrum)은 모두 즉시 적용되는 켜고 끄기에는 스위치, 저장 단계가 있으면 체크박스를 쓰라고 한다. Carbon 은 표 도구 줄 높이를 줄 높이와 맞추고 동작을 다섯 개까지 둔다. Cloudscape 는 카드 표시 설정을 단추로 여는 창에 모은다. Spectrum 스위치 쪽은 막힘.

미확인: hltb 「Search Options」 안 · AniChart · GameTora 설정 안 · V-ARCHIVE 로그인 뒤 화면.

### 이름 보이기 켜고 끄기 단추 (2026-11-07)

카드 · 자켓 격자에서 카드 아래 이름을 보이고 숨기는 설정을 찾아 125곳을 1440 · 다크로 시도했다(아이콘 39 · 리듬 24 · 캐릭터 격자 22 · 카드 12 등). 막힌 곳은 27곳(로그인 벽 4 · 봇 확인 · 캡차 · 403 · 429 11 · 404 8 · DNS 2 · 빈 화면 1 · 시간 초과 1)이다. 실제로 있는 곳은 3곳뿐이라 근거 약함이다. 캡처 · `summary.tsv` 는 `~/noslog-research/desktop-rankings/toggle/`. 세 곳 캡처는 직접 열어 확인했다.

| 서비스               | 모양                     | 크기 · 글자                                 | 켜짐 / 꺼짐                          | 자리              |
| -------------------- | ------------------------ | ------------------------------------------- | ------------------------------------ | ----------------- |
| V-ARCHIVE 서열표     | 토글 단추(아이콘 + 글자) | 82×39 · 「이름」 14/700 + 「on/off」 10/600 | 밝은 면 · 체크 / 어두운 면 · 빈 네모 | 도구 줄 맨 왼쪽   |
| Aceship 공개모집     | 토글 단추(글자만)        | 57×31 · 「Name」 14/400 · 모서리 0          | 파란 면 / 회색 면                    | 필터 패널 아래 줄 |
| Fortnite.GG 코스메틱 | 체크박스 + 라벨          | 체크 20 · 「Show name」 16/400              | 노란 면 체크 / 빈 칸                 | 톱니 팝오버 안    |

- 이름 숨기기를 격자 크기 · 보기 전환에 묶은 곳(Iconify · Pictogrammers · IconPark)은 세지 않았다.
- Apple HIG 는 목록 밖에서는 스위치 대신 토글처럼 동작하는 단추를 쓰고, macOS 툴바에 스위치 · 체크박스를 두지 말라고 한다. Material 3 icon button(toggle)은 XS 32 · S 40 · M 56dp, segmented button 은 높이 40dp. Carbon toggle small 32×16. Primer ToggleSwitch small 48×24(소스 CSS).
- 표시 스위치를 쓴 다른 서비스: Fab 「Content preferences」 창(스위치 40×24 왼쪽 · 라벨 오른쪽), Lucide 레일(라벨 위 · 스위치 40×22 아래).

## 랭킹 머리 (2026-11-07)

순위표 위 머리(쪽 제목 · 모드 · 지표 · 지역)를 1440 · 다크로 57곳 59쪽 시도했다. 막힌 16곳(로그인 벽 4 · 캡차 3 · 403 5 · 404 4)과 조작이 하나뿐이거나 표가 여럿인 9곳을 빼고 34곳을 셌고, 그중 다크는 18곳이다. 캡처 · `summary.tsv` · 디자인 시스템 원문은 `~/noslog-research/desktop-rankings/rhead/`. osu! · Quaver · Chess.com 캡처는 직접 열어 값을 확인했다.

| 항목         | 개수(34곳 중)                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| 줄 배치      | 제목 → 탭 줄 → 필터 줄 14 · 제목 아래 조작 한 줄 8 · 사이드 목록 6 · 탭과 필터 한 줄 4 · 라벨 + 조작 표 2             |
| 2개짜리 전환 | 12개 중 세그먼트 7 · 폴더 탭 2 · 밑줄 탭 1 · 큰 탭 1 · 사이드 목록 1                                                  |
| 지역         | 22개 중 드롭다운 17 · 칩 2 · 세그먼트 1 · 단추 1 · 옆 칸 패널 1                                                       |
| 쪽 제목      | 있음 30 · 없음 4                                                                                                      |
| 좁은 한 열   | 900 이하 순위표: OSRS 324 · HLTV 638 · 지니 710 · Chess.com 728 · ATP 804 · Billboard 840 · Codeforces 872 · osu! 900 |

- osu! rankings: 제목 줄 「rankings」 20/400 · 오른쪽 모드 아이콘 4 → 종류 밑줄 탭 높이 48 → 「COUNTRY」 라벨 + 전폭 드롭다운 900×29 → 「Sort by」 세그먼트 2칸(92×25 · 12/600) →12→ 순위표.
- Quaver: 제목 60/700 가운데 → 표 상자 안 맨 위 한 줄, 왼쪽 면 탭 3 + 「COUNTRIES ⌄」(높이 32 · 13/600 · 붙음) · 오른쪽 모드 세그먼트 4K · 7K →8→ 순위표.
- Chess.com: 제목 28/700 →24→ 큰 드롭다운 둘(364×64 · 사이 1)이 표 폭을 반씩 채움 →24→ 순위표.
- 디자인 시스템 9곳 확인(Apple HIG · Material 3 tabs · segmented button · Carbon tabs · content switcher · Fluent 2 · Primer 둘 · Atlassian). 세그먼트는 2–5개에 맞고 큰 화면에서 전폭으로 늘리지 말라(M3), 동시에 봐야 하는 정보는 탭으로 나누지 말라(Atlassian), 좁은 화면에서는 탭 대신 드롭다운(Fluent 2). Polaris · Fluent ToggleButton 은 미확인.

### 랭킹 내 순위 (2026-11-07)

「내 순위」 는 로그인 뒤에만 보여서 공식 저장소 코드 · 공식 도움말 · 공식 스크린샷으로 확인했다. 38곳을 시도해 9곳을 셌고, 로그아웃 공개 화면에서 「내 순위」 자리가 보인 곳은 0곳이라 근거 약함이다. 자료 · `summary.tsv` 는 `~/noslog-research/desktop-rankings/myrank/`(코드 출처 URL 에 커밋 고정).

| 자리                   | 곳                                                             |
| ---------------------- | -------------------------------------------------------------- |
| 순위표 위 고정 줄      | osu! 웹 · Discourse · Monkeytype · BeatLeader(내가 더 높을 때) |
| 순위표 아래 고정 줄    | osu! 클라이언트 · BeatLeader(내가 더 낮을 때)                  |
| 「내 위치로」 단추     | Monkeytype · Lichess                                           |
| 제자리 강조만          | Duolingo · Apple Game Center                                   |
| 옆 칸 카드 · 머리 요약 | Chess.com · Strava                                             |

- 모양은 행과 같은 꼴 한 줄 5 · 카드 2 · 아이콘 단추 1 · 면 상자 글줄 1. 담긴 것은 순위 9 · 값 9 · 아바타 5 · 「You」 3 · 전체 수 2 · 상위 % 2.
- BeatLeader: 내 행을 표 줄과 같은 부품으로, 내 순위가 이 쪽보다 높으면 위 · 낮으면 아래에 2rem 띄워 붙인다. Monkeytype: 로그인하면 제목과 표 사이에 높이 72 상자가 늘 있고 쪽 단추 옆에 내 쪽 단추. Discourse: 열 이름 줄 아래에 「You」 줄(고정 아님). Lichess: 내 쪽이 아닐 때만 과녁 단추.
- 디자인 시스템 7곳: M2 는 선택 행에 면 색, Atlassian 은 highlightedRowIndex 로 강조하되 강조만으로 뜻을 전하지 말라, Polaris tone · Fluent appearance 는 행 면 색. Cloudscape 는 고정 열만, Primer 는 지침 없음.
- 막힘: LeetCode · RoyaleAPI · Fortnite Tracker · ScoreSaber(캡차), AtCoder · HackerRank · Strava(로그인 벽).

### 랭킹 순위표 줄 (2026-11-07)

플레이어 순위표의 머리 줄 · 줄을 1440 · 다크로 62곳 63주소 시도해 47곳을 셌고, 다크는 24곳이다. 캡처 · `summary.tsv` 는 `~/noslog-research/desktop-rankings/rrow/`. Chess.com · AccSaber · OP.GG · Lichess · Monkeytype · Etterna 캡처는 직접 열어 확인했다.

| 항목        | 개수(47곳 중)                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------- |
| 줄 높이     | 40 미만 16 · 40–47 6 · 48–55 10 · 56 이상 15                                                  |
| 줄 구분     | 구분선 19 · 줄무늬 10 · 둘 다 5 · 면 카드 줄 7 · 없음 6                                       |
| 1–3위 표시  | 없음 34 · 색 면 배지 3(BeatLeader · Chess.com · maple.gg) · 색 글자 1(AccSaber) · 아이콘 2 등 |
| 아바타      | 있음 23 · 없음 24                                                                             |
| 마우스 올림 | 없음 31 · 면 15 · 글자색 1                                                                    |
| 줄 링크     | 이름만 36 · 줄 전체 9 · 없음 2                                                                |

- Chess.com(폭 728): 머리 줄 48 · 줄 56 · 홀수 줄 흰색 2% · 순위 칸 48 오른쪽, 1–3위 색 면 네모 배지(숫자 22/800) · 4위부터 「#4」 16/600 · 아바타 40 네모 · 이름 14/600 → 국기 · 값 14/600 오른쪽 · 줄 전체 링크.
- AccSaber: 머리 줄 35 · 12/600 대문자 · 줄 48 · 홀짝 면 · 순위 칸 80 오른쪽 「#1」 14/700, 1–3위 금 · 은 · 동 글자 · 아바타 32 둥근 8 · 이름 14/500 → 클랜 배지 → 국기 · 값 14/600 오른쪽 · 줄 전체 링크.
- OP.GG: 머리 줄 32 · 줄 41 · 칸 면 위 1px 선 · 순위 칸 40 왼쪽 12/400 · 아바타 32 원형 · 이름 12/700 · 값 왼쪽.
- 디자인 시스템: M2 기본 줄 52dp · 숫자 오른쪽 정렬(M2 · Cloudscape · Primer), Carbon 줄 크기 24 · 32 · 40(기본) · 48 · 64 · 줄무늬는 가로 읽기를 돕는다, Atlassian 은 강조 줄에 뜻을 맡기지 말라. Fluent DataGrid 미확인.
- 막힘: cytoid · malody · deeplol · warcraftlogs(404), HLTV · League of Graphs · tracker.gg(403), STRATZ(캡차), PIU(로그인 벽).

### 랭킹 쪽 넘기기 (2026-11-07)

플레이어 순위표의 쪽 넘기기를 1440 · 다크로 75곳 시도해 37곳을 셌고, 다크는 19곳이다. 첫 쪽과 가운데 쪽을 함께 찍었다. 캡처 · `summary.tsv` 는 `~/noslog-research/desktop-rankings/rpage/`. osu! · AccSaber · Chess.com · BeatLeader 캡처는 직접 열어 확인했다.

| 항목 | 개수(37곳 중)                                                                                                      |
| ---- | ------------------------------------------------------------------------------------------------------------------ |
| 방식 | 쪽 번호 20 · 쪽 번호와 입력 · 쪽당 줄 수 5 · 이전 · 다음만 7 · 무한 스크롤 2 · 더 보기 2 · 범위 select 1           |
| 자리 | 아래 가운데 11 · 아래 오른쪽 8 · 위 · 아래 둘 다 7(가운데 4) · 아래 양 끝 4 · 아래 왼쪽 2 · 위만 2 · 옆 1 · 없음 2 |

- osu!: 순위표 위 · 아래 가운데, 번호 알약 높이 23 · 지금 쪽은 면 색 알약 + 600, 「PREV」 · 「NEXT」 글자 알약 67×23, 1쪽 「1 2 3 … 200」 · 3쪽 「1 2 3 4 5 … 200」(처음 · 지금±2 · 끝).
- AccSaber: 위 · 아래 가운데, 32×32 · 모서리 3 · 지금 쪽 면 색 + 600, 끝 번호 없이 「1 2 …」 · 처음 « · 끝 » 아이콘, 순위표와 사이 24.
- Chess.com: 아래 오른쪽, 24×24 12/600 · 지금 쪽 흰색 40% 면, 「‹ 1 2 3 4 … › Last」, 왼쪽 끝 「Top」(맨 위로) 단추.
- BeatLeader: 아래 왼쪽, 범위 글 「1 - 50 / 328531」 뒤에 번호, 지금 쪽 파란 면.
- 디자인 시스템 8곳 확인. GOV.UK 는 무한 스크롤을 쓰지 말라(키보드 사용자 문제)와 쪽 번호를 `<title>` 에 넣으라, Atlassian 은 일정 수를 넘으면 줄임표로 자르고 작은 화면은 줄임표 포함 7개까지, Cloudscape 는 9쪽을 넘으면 쪽 이동 입력을 고려하고 첫 · 끝 쪽에서 이전 · 다음을 끈다, Carbon 은 표 바닥에 붙인다, M2 는 표 바로 위나 아래에 둔다. Primer 는 이전 · 다음 · 번호 · 줄임표 구성만. Polaris · Fluent · M3 는 쪽 넘기기 문서를 찾지 못해 미확인.
- 막힘: League of Graphs · HLTV(403), STRATZ(캡차), cytoid · malody · warcraftlogs · deeplol(404), Pump It Up(로그인 벽).

### 랭킹 플레이어 검색 (2026-11-07)

순위표 쪽에 플레이어 검색이 있는지를 1440 · 다크로 88곳 시도해 60곳을 셌고, 다크는 29곳이다. 캡처 · `summary.tsv` · 디자인 시스템 원문(`ds.md`)은 `~/noslog-research/desktop-rankings/rsearch/`. AccSaber · Blitz · BeatLeader · OP.GG · Etterna · PGA 캡처는 직접 열어 확인했다.

| 항목                     | 개수                                                                                                        |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 검색 (60곳 중)           | 순위표 쪽 검색칸 19 · 사이트 머리 전역 검색만 30 · 없음 11                                                  |
| 순위표 쪽 자리 (19곳 중) | 필터 줄 11 · 표 위 단독 줄 4 · 옆 칸 3 · 접힌 필터 패널 1. 그중 3곳은 돋보기 단추를 누르면 그 자리에서 펼침 |
| 동작 (19곳 중)           | 입력 즉시 표를 거름 9 · Enter 뒤 거름 3 · 프로필로 이동 2 · 자동완성 목록 1 · 미확인 4                      |

- 순위표 쪽 검색 19곳 중 다크는 BeatLeader · AccSaber · Etterna · OP.GG · U.GG · Blitz · tactics.tools 7곳이다. 칸은 높이 36–40 · 폭 185–300 이 많다.
- AccSaber: 지표 탭 줄 오른쪽, 185×39 · 모서리 3 · 테두리 1 · 왼쪽 돋보기 · 14/400 「Search players...」, 그 오른쪽 국가 드롭다운. 입력 즉시 거르고 위 「131,871 players ranked」 수가 바뀐다.
- Blitz: 필터 줄 왼쪽 첫 칸 202×36 · 모서리 8 · 아이콘 없음 · 13/500, 오른쪽에 시즌 · 지역 드롭다운. 입력 즉시 거름.
- BeatLeader: 오른쪽 Filters 패널 맨 위 314×50, 입력 즉시 거르고 주소에 `?search=`.
- OP.GG: 표 위 띠 오른쪽 끝 240×40, 입력하면 칸 아래 자동완성 목록(표는 그대로).
- PGA · WTA · CodinGame: 필터 줄의 돋보기 단추를 누르면 그 자리에서 칸이 펼쳐짐.
- 디자인 시스템 7곳: Carbon 은 표 툴바에 검색을 두고 아이콘 단추로 펼칠 수 있다, GitLab Pajamas 는 단순 거르기를 오른쪽 위 폭 제한으로, Cloudscape 는 결과 수를 칸 옆에, PatternFly 는 내용 바로 위, Material 3 · Fluent 2 는 입력 중 제안 목록. GOV.UK 검색 패턴 쪽은 404, Polaris 는 미확인.
- 막힘 28곳: 캡차 10(League of Graphs · RoyaleAPI · Wise Old Man · Fortnite Tracker · STRATZ 등), 404 6(chunirec · V-Archive · cytoid 등), 로그인 벽 2(Kamaitachi · Pump It Up), 그 밖 순위표가 아니거나 뜨지 않음.

### 랭킹 정렬 기준 전환 모양 (2026-11-07)

순위표 위에서 순위를 매기는 지표를 바꾸는 조작을 1440 · 다크로 79곳 시도해 31곳을 셌고, 다크는 17곳이다(지표 전환이 없거나 중복 22 · 막힘 26 은 세지 않음). 캡처 · `summary.tsv` · 디자인 시스템 원문(`ds.md`)은 `~/noslog-research/desktop-rankings/rsort/`. osu! · Quaver · AccSaber · OSS Insight · Codewars · YouTube Charts 캡처는 직접 열어 확인했다.

| 항목               | 개수(31곳 중)                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 조작 종류          | 표 머리 정렬 14 · 드롭다운 5 · 밑줄 탭 4 · 세그먼트 3 · 면 탭 2 · 글자 탭 1 · 라벨 + 펼침 판 1 · 세로 아이콘 단추 1 |
| 라벨 글            | 있음 5(osu! 「정렬 기준」 · Steam Ladder · Social Blade · WCA · PvPoke) · 없음 26                                   |
| 고른 표시(겹쳐 셈) | 정렬 화살표 12 · 면 10 · 글자색 9 · 밑줄 6 · 굵기 5 · 그 밖 5                                                       |

- 표 머리 정렬 14곳(Etterna · ScoreSaber · Blitz · AtCoder · ESPN · VLR 등)은 지표마다 열을 두고 열 머리를 눌러 정렬한다. Etterna 는 머리 줄 56 · 16/700 · 칸마다 ⬍ 아이콘, 정렬된 칸은 ▾. Blitz 는 머리 줄 36 · 11/700 · 고른 칸 밝은 글자 + ▾.
- 세그먼트 3곳: osu! 는 「정렬 기준」 라벨 + 트랙 없는 칸 2개(86×25 · 75×25 · 고른 칸 면 · 모서리 4 · 12/600), NosLog 지금 모양과 거의 같다. Quaver 는 트랙 453×32 · 모서리 6 안에 고른 칸 색 면. OSS Insight 의 기간 세그먼트는 254×38 · 트랙 면 + 테두리 1 · 모서리 6 · 안쪽 2 · 고른 칸 흰색 10% 면 · 13/500.
- 밑줄 탭 4곳: AccSaber 는 448×38 · 묶음 밑선 1 · 14/500 → 고른 칸 600 + 밑줄 3(범주마다 색). OSS Insight 는 15/400 · 밑줄 2 흰색 · 칸 앞 아이콘.
- 드롭다운 5곳: YouTube Charts 는 테두리 알약 86×32 · 모서리 18 · 14/400 · 단추 글이 고른 이름. BeatLeader 는 면 단추 80×29 · 모서리 4 · 앞 아이콘 + ▾.
- 디자인 시스템 8곳: M3 segmented 40 · 2–5칸, Carbon content switcher 32 · 40 · 48 · 칸 폭 같게, Primer 32 · 28 · 트랙 위 손잡이 면, Radix 24 · 32 · 40, shadcn Tabs 36 · 트랙 면 · 안쪽 3. HIG 는 글 라벨 세그먼트에 앞 설명 글이 필요 없다고 하고, Fluent 2 는 좁은 화면에서 드롭다운, Atlassian 은 한 표의 데이터 거르기를 탭으로 나누지 말라고 한다.
- 막힘: 403 · Cloudflare 9(SteamDB · League of Graphs · RoyaleAPI 등), 캡차 5(tracker.gg · Warcraft Logs · IMDb · STRATZ 등), 404 2, 로그인 벽 1(Spotify), 점검 2, 시간 초과 6.
