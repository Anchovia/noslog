# 긴 목록 · 검색의 요청 수 — 실제 서비스 36곳

2026-11-17. 관리자 통계에서 `/api/tier-browser` 호출이 다른 API 보다 훨씬 많아, 서열표처럼 긴(묶인) 목록과 검색을 다른 서비스가 요청 몇 번으로 처리하는지 쟀다. 디자인 시스템은 해당이 없어 세지 않았다(0곳).

방법: headless Chromium(1440 × 900 · 다크 · ko-KR)으로 쪽을 열고, 끝까지(최대 32,000px) 스크롤하고, 검색칸에 「ab」 를 한 글자씩 넣은 뒤 Enter 를 눌렀다. 단계마다 XHR · fetch · 문서 이동을 세고 광고 · 분석 요청은 뺐다. 로그인은 하지 않았다. 캡처 · 원자료 · 스크립트는 `~/noslog-research/2026-11-17-list-requests/`(`shots/` · `sheet-0–3.jpg` · `out1.json` · `out2.json`).

## NosLog 지금 (개발 서버 · 로그아웃 · 곡이 있는 구간 15개 · 2,159곡)

| 동작                | 요청 수                                  |
| ------------------- | ---------------------------------------- |
| 열자마자            | 3                                        |
| 끝까지 스크롤       | 14(구간마다 1)                           |
| 검색 한 번          | 16(개요 1 + 구간 15), 이어서 한 번 더 14 |
| 로그인(코드로 계산) | 구간 호출이 두 배(공개 본문 + 내 기록)   |
| 전체 구간 응답 합계 | 683,742B, gzip 153,538B                  |

## 목록을 받는 방식 (33곳)

| 방식                                   | 곳 수 | 곳(스크롤 때 데이터 요청 수)                                                                                                                                                                                                                                                                                             |
| -------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 처음에 전부 받고 스크롤 때 요청 없음   | 22    | 3icecream 난이도표 · taiko.wiki 서열표 · iidx-sp12 · zasa DP 난이도표 · ereter · LoLalytics · LOL.PS · DEEPLOL · FOW.LOL · tactics.tools · 롤체지지 · Smogon · Pokémon DB · Schale DB · 네이버웹툰 요일전체 · 멜론 TOP100 · 벅스 차트 · arcade-songs maimai · arcade-songs CHUNITHM · DXRating · OTOGE DB · Sekai Viewer |
| 스크롤마다 다음 쪽을 요청              | 6     | osu! 비트맵 목록 11 · BeatSaver 11 · Chorus Encore 3 · Bandori Party 18 · Steam 검색 8 · YouTube 검색 결과 12                                                                                                                                                                                                            |
| 쪽 번호로 이동                         | 5     | Quaver · Metacritic · GitHub 저장소 검색 · Maple.GG 랭킹 · 지니 TOP200                                                                                                                                                                                                                                                   |
| 묶음(구간)마다 따로 요청 — NosLog 방식 | 0     | 없음                                                                                                                                                                                                                                                                                                                     |

- 서열표와 가장 가까운 묶음 표 5곳(3icecream · taiko.wiki 서열표 · iidx-sp12 · zasa · ereter)은 모두 처음에 전부 받는다. 3icecream 은 문서 안에, taiko.wiki 는 문서 안에, iidx-sp12 는 `songs.json` 하나, arcade-songs 는 `data.json` 하나, OTOGE DB 는 `music-ex.json` 하나, DXRating 은 `dxdata` 하나다.
- 스크롤마다 요청하는 6곳은 곡 · 영상이 수만 건 넘는 목록이다.

## 검색 (19곳)

| 방식                                | 곳 수 | 곳                                                                                                                                                                                                                                                 |
| ----------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 받아 둔 목록을 브라우저에서 거름(0) | 9     | 3icecream · DEEPLOL · FOW.LOL · Smogon · Schale DB · arcade-songs maimai · arcade-songs CHUNITHM · DXRating · OTOGE DB                                                                                                                             |
| 서버에 검색어마다 1–2회             | 10    | taiko.wiki 곡 검색 1 · Quaver 1 · Chorus Encore 1 · BeatSaver 2 · ChuniDB(추천어 1 + 결과 쪽 1) · Bandori Party(쪽 이동 1 + 1) · Steam(추천어 1 + 결과 쪽 1) · YouTube(추천어 1–2 + 결과 1) · Metacritic(추천어 1 + 결과 1) · Twitch 태그 검색 1–2 |
| 검색어마다 묶음 수만큼 요청         | 0     | 없음                                                                                                                                                                                                                                               |

머리의 사이트 검색만 있고 목록 안 검색이 아닌 곳(LoLalytics · LOL.PS · 롤체지지 · Maple.GG · 멜론 · 벅스 · 지니 · 네이버웹툰 · Pokémon DB)은 세지 않았다. osu! 는 검색에 로그인이 필요해 미확인, tactics.tools 는 입력이 목록에 닿지 않아 미확인.

## 내 기록을 받는 방식

미확인. 로그인이 필요해 재지 않았다. Tachi API 문서(`docs.tachi.ac/api/…`)는 세 주소 모두 404 였다.

## 세지 않은 곳

- 확인 화면 · 오류에 막힘: npm · ongeki-score · ScoreSaber · speedrun.com · U.GG · METAsrc · Mobalytics · Product Hunt(Cloudflare 확인 화면) · OP.GG(CloudFront 오류) · IMDb(403) · EtternaOnline(502) · BMS 발광 난이도표(시간 초과).
- 로그인 벽: Kamaitachi.
- 목록이 안 보임: Bestdori(환영 창이 덮음) · CPI(첫 화면만) · Stella BMS(「Load table」 버튼만) · V-ARCHIVE(목록 주소를 못 찾음) · sdvx.in(글이 거의 없어 판단 못 함) · MyAnimeList(검색 입력 실패).

## 요약

- 검색 한 번에 묶음 수만큼 요청하는 곳은 19곳 중 0곳이다. 0회(9곳)이거나 1–2회(10곳)다.
- 묶음마다 따로 요청해 목록을 채우는 곳은 33곳 중 0곳이다. 22곳이 처음에 전부 받고, 6곳이 스크롤마다 다음 쪽을 받는다.
- 곡 수가 NosLog 와 비슷한 리듬 게임 표 · 곡 DB(3icecream · taiko.wiki · iidx-sp12 · arcade-songs · DXRating · OTOGE DB)는 전부 「한 번에 받고 브라우저에서 거르기」 다.
- 내 기록을 한 번에 받는지 묶음마다 받는지는 미확인이다.
