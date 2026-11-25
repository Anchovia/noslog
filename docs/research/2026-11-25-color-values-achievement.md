# 색 값 재료 — 업적 금속 단계 · FC · 장르 여섯 (2026-11-25)

공통 층 3단계 색 파운데이션 값 단계 V3 재료다. 추천 · 판단은 적지 않는다. 판 재료 정리본(후보 꼴 · 곳 수 · 표 전체)은 세션 공유 폴더 `common-layer/stage3/color/values/v3-achievement/RESEARCH.md` 에 있고, 이 파일은 곳마다 원문 기록이다.

## 취합 대조 (2026-11-25, 취합 세션)

- Spotify 둘러보기 타일: 캡처 `caps/spotify-browse.png` 픽셀이 표 값과 같다(Music #dc148c · Pop #477d95 · R&B #ba5d07 · Latin #0d73ec · Country #d84000 · Sleep #1e3264).
- 고침, A06 FC: ScoreSaber FC 알약은 캡처 `caps/scoresaber-profile-fc.png` 에서 보이지 않는다. 점수 줄이 쿠키 알림 창 아래에 가려 있다. 그래서 FC 값 `rgb(22,162,73)` 은 계산값으로만 남기고, 캡처로 확인한 FC 실측은 0곳이다(BRIEF: 팝업에 막힌 캡처는 세지 않음).
- 표본 미달: 업적 25곳(국내 3) · FC 0곳(캡처 기준) · 장르 6색 한 벌 0곳이라 30곳 · 국내 15곳 목표에 못 미친다. 이 사실은 master 에 보고했다.

## 방법

- 다크 값은 headless Playwright Chromium 1.61(colorScheme dark · 권한 없음 · 로그인 없음 · 1440×900)의 `getComputedStyle` 계산값이다. 열기 전에 `~/noslog-research/wait-capacity.sh` 로 차례를 기다렸다.
- 디자인 시스템 값은 unpkg 에서 받은 패키지 파일을 글자로만 읽었다(실행하지 않음): `@carbon/themes` 11.37 · `@carbon/colors` 11.27 · `@primer/primitives` 9.0.3 · `@atlaskit/tokens` 2.0.0 · `@radix-ui/colors` 3.0.0 · `@adobe/spectrum-tokens` 13.0.0.
- 당근 SEED 3.2.1 다크 팔레트 71칸(gray 11 + 6갈래 × 10, `daangn-tokens.md` 1-1 · 1-2)에서 ΔE2000 최근접을 계산했다. 같은 계산으로 기존 기록의 ΔE(Discourse 동 7.0 · 은 5.0 · 금 9.6, GitHub 동 면 7.2 · 은 2.2 · 금 8.6)가 같게 나옴을 확인했다. 대비는 WCAG 2 상대 휘도.
- 기존 기록에서 가져온 것(다시 재지 않음): [등급 · 구간 색 기능별](./2026-11-21-color-feature-grade.md)의 P16 업적 16곳과 티어 사다리 줄(Blitz · Tracker.gg · DEEPLOL · JUNGOL · osu! · AccSaber · Codewars · 당근), [색 규칙 물음 근거](./2026-11-24-color-rules19.md)의 G(게임 공식 색) · K(종류색).

## 센 곳

- 업적 단계: 다크 실제 서비스 25곳(P16 16곳 + Blitz · Tracker.gg · DEEPLOL · JUNGOL · AccSaber · osu! · Codewars · BeatLeader · 당근), 국내 3곳. 디자인 시스템 14곳(금속 뜻 토큰 0곳).
- FC: 색 값을 읽은 곳 ScoreSaber 1곳. 노스しるべ 위키는 색 낱말만(hex 없음).
- 장르: 6색 한 벌을 쓰는 곳 0곳. 장르 타일 색 Spotify 1곳, 종류 칩 5색 ScoreSaber · BeatSaver · BeatLeader 3곳, 무채 단색 칩 Twitch · 라프텔 · Steam · TVING 4곳(국내 2곳). 디자인 시스템 5곳(Atlassian · Primer · Carbon · Radix · Spectrum).
- 목표(실제 서비스 30곳 · 국내 15곳)에 모자란다. 이유는 아래 막힘과 장르를 색으로 칠하는 서비스의 부재. 근거 약함.

## 이번에 새로 잰 곳

### ScoreSaber 프로필 (FC 표시)

- URL: https://scoresaber.com/u/76561198988695829 · 2026-11-25 · 해외 · 다크(시스템 다크)
- 점수 줄의 「FC」 알약(65×29): 테두리 1px `rgb(22,162,73)` #16a249 · 글자 같은 색 · 면 `oklab(0.624 -0.145 0.087 / 0.1)`. 줄 안 작은 「FC」 는 클래스 `text-score-combo-full` 로 같은 초록. 같은 목록의 pp 알약은 남보라 테두리, 정확도 알약은 노랑 테두리.
- 대비 #000 6.30 · #16171b 5.37 · #2b2e35 4.08. SEED 최근접 green-700 `#22b27f` ΔE 9.8.

### Spotify 둘러보기 (장르 타일)

- URL: https://open.spotify.com/search · 2026-11-25 · 해외 · 다크(html `rgb(18,18,18)`)
- 「Browse all」 타일 231×130, 면 색 + 흰 글자. 70개 안팎 중 24개의 면: Music `rgb(220,20,140)` · Podcasts `rgb(0,100,80)` · Pop `rgb(71,125,149)` · Hip-Hop `rgb(71,125,149)` · R&B `rgb(186,93,7)` · Rock `rgb(0,100,80)` · Latin `rgb(13,115,236)` · Jazz `rgb(141,103,171)` · Classical `rgb(125,75,50)` · Metal `rgb(233,20,41)` · Country `rgb(216,64,0)` · Anime `rgb(13,115,236)` · Gaming `rgb(232,17,91)` · K-pop `rgb(230,30,50)` · Indie `rgb(233,20,41)` · Folk & Acoustic `rgb(188,89,0)` · Blues `rgb(13,115,236)` · Reggae `rgb(0,100,80)` · Funk & Disco `rgb(175,40,150)` · Ambient `rgb(20,138,8)` · Chill `rgb(176,98,57)` · Sleep `rgb(30,50,100)` · Decades `rgb(165,103,82)` · Dance/Electronic `rgb(71,125,149)`.
- 24개에서 서로 다른 면 17색. 장르끼리 색을 나눠 쓴다(Pop · Hip-Hop · Dance/Electronic 이 같은 값).
- 캡처: 세션 폴더 `caps/spotify-browse.png`.

### 라프텔 태그검색 · Twitch 분류 · Steam 인기 태그 · TVING 홈 (무채 칩)

- 라프텔 https://laftel.net/finder · 국내 · 다크: body `rgb(18,18,18)` · 태그 칩 면 `rgb(50,50,50)` · 글자 `rgb(247,247,247)`(「무삭제」 「더빙」). 「ONLY」 칩만 브랜드 보라 `rgb(129,107,255)`.
- Twitch https://www.twitch.tv/directory · 해외 · 다크: body `rgb(14,14,16)` · 분류 태그(FPS · Shooter 등) 면 `rgba(83,83,95,.38)` · 글자 `rgb(239,239,241)`.
- Steam https://store.steampowered.com/tag/browse · 해외 · 다크: body `rgb(27,40,56)` · 태그 424개 면 `rgba(0,0,0,.2)` · 글자 `rgb(159,187,203)`.
- TVING https://www.tving.com/ · 국내 · 다크: body `rgb(0,0,0)` · 「더빙」 「자막」 라벨 칩 면 `rgba(25,25,25,.9)` · 글자 `#fff`.
- 네 곳 모두 장르 · 분류 이름이 색으로 갈리지 않는다. 캡처: `caps/laftel-finder.png` · `twitch-directory.png` · `steam-tags.png` · `tving-home.png`.

### 디자인 시스템 5곳의 「뜻 없는 색」 갈래

- Atlassian(atlassian-dark): `color.background.accent.<갈래>.subtler` · `color.text.accent.<갈래>` 10갈래(red · orange · yellow · lime · green · teal · blue · purple · magenta · gray). 토큰 설명에 「Use for red backgrounds when there is no meaning tied to the color, such as colored tags」. 예: red 면 `#5d1f1a` · 글자 `#fd9891`.
- Primer(dark): `--label-<갈래>-bgColor-rest` · `-fgColor-rest` 19갈래(green · orange · purple · red · yellow · gray · auburn · brown · lemon · olive · lime · pine · teal · cyan · indigo · blue · plum · pink · coral). 글자 모두 #2b2e35 위 5.04–5.24.
- Carbon(g100): tag 배경 = 70단 · 글자 = 20단, 10갈래(red · magenta · purple · blue · cyan · teal · green · gray · cool-gray · warm-gray). 글자 대 면 5.81–5.97.
- Radix Colors(dark): 갈래마다 12단. 3단 옅은 면 · 9단 단색 면 · 11단 글자. 이름 있는 `gold`(9단 `#978365` · 11단 `#cbb99f`) · `bronze`(`#a18072` · `#d4b3a5`) 갈래가 있다.
- Adobe Spectrum(dark): `<갈래>-background-color-default` badge 면 19갈래, 위 글자 흰색. 흰 대비 2.35–5.17.
- SEED: 유채색 갈래 6개(carrot · blue · red · green · yellow · purple). 700단 #2b2e35 위 4.63–5.02.
- 금속 · 업적 뜻 토큰은 위 5곳과 기존 기록 9곳(Fluent · Material 3 · Ant Design · Chakra · Mantine · Polaris · SEED · TDS · EUI) 모두 0곳.

## 막힘 · 세지 않음

- 403 · 확인 창 · 캡차 · UA 거부: OP.GG 한국어 랭킹 · U.GG · Lichess · Stack Overflow · PSNProfiles · TrueAchievements · Tracker.gg · LOAWA · Speedrun.com · HackerRank · RetroAchievements · CurseForge · HLTV · OP.GG 발로란트 · Ridibooks · Tidal · Beatport · Kitsu · Letterboxd · RYM · TETR.IO · Arcaea 위키 · Bandcamp · Last.fm · BeatLeader 첫 화면(30초 안에 안 열림). 우회하지 않았다.
- 접속 불가 · 404: TMI 넥슨(주소 안 풀림) · 벅스 · 바이브. 본문 막힘: 치지직 · SOOP · 왓챠 · 웨이브 · 카카오웹툰.
- 라이트로만 열림(꼴만): 멜론 · 지니 · FLO · 문피아 · 네이버 시리즈 · 카카오페이지 · V-ARCHIVE · itch.io · AniList · 3icecream · iidx.me. 로그인 뒤 화면은 보지 않았다.
- 캡처 접촉 시트: 세션 폴더 `caps/contact-genre-*.png` · `contact-fc-0.png`.

## 근거 약함 · 미확인

- 업적 금속 꼴은 곳 수 1–9. 위 두 단의 단계 수와 이름이 서비스마다 다르다. Exophase · Game Jolt · Quaver 값은 그림 주색 표본이고 TETR.IO 는 hex 없음.
- FC 색을 hex 로 읽은 곳 1곳. 리듬게임 전적 서비스의 FC · AP · 램프 색은 미확인(3icecream · iidx.me · SDVX 보관소 · GrooveStats · Kamaitachi · 전일 아카이브 · V-ARCHIVE 는 라이트 · 로그인 · 404).
- 장르 6색 한 벌 서비스 0곳. Spotify 타일은 장르별 고유색이 아니다.

## 보충 실측 (2026-11-25, 보충 세션)

결과: 세 자리 모두 기준을 채우지 못했다. 새로 세어 넣을 한 벌이 업적 0곳 · FC 0곳 · 장르 6색 0곳이다. 이유는 아래에 곳마다 적었다. 이 절의 곳은 위 0절 표본 수에 더하지 않는다.

방법: headless Playwright(permissions [] · colorScheme dark · 1440×900 · 열기 전 wait-capacity · 브라우저 하나에 쪽 하나), 쿠키 창은 「거부」 계열 버튼만 눌렀다. 캡처는 세션 폴더 `caps/more/`(접촉 시트 `contact-domestic.png` · `contact-domestic-rank.png` · `contact-fc-genre.png`). 곳마다 한 벌 · 계산값 열은 값이 있는 곳이 없어 비워 둔다.

### 국내(업적 · 티어 · 랭크)

| 곳                                         | 열림                                                                   | 바탕(계산값)                   | 티어 · 등급 표시                                                                                                 | 세는가     |
| ------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| DAK.GG 발로란트                            | 열림 · 다크                                                            | body `rgb(25,29,44)`           | 순위표 티어가 그림(이미지). 글자색 티어 없음                                                                     | 안 셈      |
| DAK.GG 이터널 리턴 · 롤체지지 · 메이플지지 | 열림 · 머리만 다크, 본문 흰색(`rgb(250,250,250)` · `rgb(255,255,255)`) | 본문이 라이트라 다크 값이 아님 | 티어 글자 `rgb(0,0,0)`, 그림이 주                                                                                | 안 셈      |
| DAK.GG 배틀그라운드                        | 열림 · 본문 `rgb(234,234,234)`                                         | 라이트                         | 티어 없음                                                                                                        | 안 셈      |
| FOW.LOL                                    | 열림 · body `rgb(34,34,34)`                                            | 다크(순위 쪽)                  | 광고 · 이벤트 배너가 첫 화면을 덮음. 티어는 그림. 글자색 티어 0                                                  | 안 셈      |
| LOL.PS                                     | 열림 · body `rgb(16,19,28)`                                            | 다크                           | 순위표 티어가 그림, 승률 띠만 초록 `rgb(0,166,118)` · 회색 `rgb(130,139,149)`(티어 아님). 첫 화면에 안내 창이 뜸 | 안 셈      |
| STOVE 스토어                               | 열림 · body `rgb(25,25,25)`                                            | 다크                           | 업적 · 등급 화면은 로그인 뒤. 공개 화면에 단계 색 없음                                                           | 안 셈      |
| 포로페서(해외 · 한국어 아님)               | 열림 · 본문 라이트                                                     | 라이트                         | 해당 없음                                                                                                        | 안 셈      |
| DEEPLOL · 정올 · 당근                      | 이미 위 표에 있음                                                      |                                |                                                                                                                  | 다시 안 잼 |

막힘(헤드리스에서 확인 창 · 403 · 주소 안 풀림): solved.ac(Cloudflare 확인 창) · XDX.GG(403) · TFT.OP.GG(403) · sa.dak.gg(주소 안 풀림). 라이트로만 열림: 던담 · 인벤 · 메이플지지 본문. 로그인 뒤 화면(업적 · 프로필)은 보지 않았다.

사실 하나: 국내 게임 전적 서비스(DAK.GG · 롤체지지 · FOW · LOL.PS)는 티어를 단계별 그림(이미지)으로 보이고 글자 · 면에 티어색을 칠하지 않는다. 그래서 값을 읽을 CSS 색이 없다. 이번에 연 국내 9곳 중 다크이면서 단계색이 CSS 값으로 있는 곳은 0곳이다.

### FC · AP · 램프

| 곳                              | 열림                                       | 읽은 것                                                                                                                                                        | 세는가                         |
| ------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| osu! 순위 표(해외)              | 열림 · 다크 녹색 테마 body `rgb(35,42,34)` | SS · S · A 머리 글자 `rgb(145,163,143)`. 등급 글자에 색 없음, 숫자 열도 같은 회색                                                                              | 안 셈(FC 표시 아님)            |
| mdmc.moe(Muse Dash 채보 사이트) | 열림 · body `rgb(43,41,52)`                | 칩: easy `rgb(109,253,100)`(면 같은 색 20%) · hard `rgb(0,255,255)` · master `rgb(232,0,194)` · RANKED 면 `rgb(232,0,194)` 흰 글자. 난이도 칩이고 FC 표시 아님 | 안 셈(게임 난이도 색, 대상 밖) |
| Sekai Viewer(해외)              | 열림 · 다크                                | 공개 화면에 클리어 · FC 표시 없음(프로필 로그인 뒤)                                                                                                            | 안 셈                          |
| Kamaitachi                      | 로그인 창만 열림                           | 기록 화면은 로그인 뒤                                                                                                                                          | 안 셈                          |
| Bestdori                        | 열림 · 라이트                              |                                                                                                                                                                | 안 셈                          |
| V-ARCHIVE                       | 라이트                                     | 위 0절과 같음                                                                                                                                                  | 안 셈                          |

FC · AP · 램프 색을 캡처로 확인한 곳은 이번에도 0곳이다. 공개(로그인 없는) 화면에서 FC 표시를 보이는 곳은 기록 보관 사이트 쪽이 로그인 뒤에 있다.

### 장르

| 곳                                                     | 열림                                                | 읽은 것                                                      | 세는가      |
| ------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| Apple Music 둘러보기(한국어)                           | 열림 · 다크                                         | 첫 화면은 「새로운 음악」 카드(앨범 그림). 장르 색 타일 없음 | 안 셈       |
| SoundCloud 디스커버                                    | 빈 화면(동의 창 아래, 목록 안 뜸)                   |                                                              | 안 셈       |
| MyAnimeList 장르 쪽                                    | 개인정보 동의 창이 가림                             |                                                              | 안 셈(팝업) |
| GOG 장르 필터                                          | 열림 · 다크                                         | 장르가 글자 목록(색 없음)                                    | 안 셈       |
| TMDB 장르 쪽                                           | 열림 · 헤더 어두운 파랑 `rgb(3,37,65)`, 본문 라이트 |                                                              | 안 셈       |
| Genie · 벅스 · 바이브 · FLO                            | 라이트 · 404 · 접속 불가                            | 위 0절과 같음                                                | 안 셈       |
| 네이버웹툰 · 카카오페이지                              | 라이트                                              | 장르 라벨은 글자                                             | 안 셈       |
| Amazon Music 장르 · Deezer 채널 · YouTube Music 분위기 | 본문이 비었거나 404 · 「지원 중단 브라우저」 안내   |                                                              | 안 셈       |
| AniList · Kitsu · Epic · Ridi                          | 라이트 · 403 · 캡차                                 |                                                              | 안 셈       |

장르 6색 한 벌을 쓰는 곳은 이번에도 0곳이다.

### 게임 원본 장르 책 색

2026-11-25. NOSTALGIA 게임 안 장르 화면에서 읽은 값이다(서비스가 아니라 게임 원본, 위 표와 별개). 방법: 공개 YouTube 플레이 영상 2개(Op.3 아케이드, 720p)에서 장르 선택 프레임을 뽑아 영역 중앙값을 읽었다. 캡처 · 원자료 · 영역 표시 확대본은 세션 공유 폴더 `…/values/board-base/game/genre-measure/`(`MEASURE.md` · `caps/` · `raw/`)에 있고 커밋하지 않는다. 추천은 쓰지 않는다.

- 장르 이름: 게임 화면은 곡 책 선반 아홉 권(ALL MUSIC · NOSTALGIA · BEMANI · 검색 · CLASSIC AND JAZZ · POPS · ANIME · VARIETY · TREND)이고, 검색 화면 Category 칸에 장르 색 타일이 있다(Story · Org · BEMANI · CL/Jz · Pops · Anime · Var · Trend). NosLog 여섯(pops · anime · bm · org · var · cljz)은 게임 이름과 같고 CL/Jz 는 한 장르다. 게임에는 TREND · ALL MUSIC · Story 가 더 있다. RemyWiki 곡 목록 머리글 이름과도 맞는다(머리 면은 모두 같은 `#ffd99f` 라 색 근거 아님).
- 출처: 영상 CR https://www.youtube.com/watch?v=LA8tivJUDag (CRAZYDOX, 66–70초) · 영상 WG https://www.youtube.com/watch?v=gI9DzN3D6hw (WGC, 3분 30초 + 38–46초). 버전은 Op.3 만(Op.2 · FORTE 화면은 못 찾음).

장르 색 타일(검색 화면 Category 칸, 그림 질감 위 영역 중앙값, 두 영상 최대 채널 차 16, Trend 만 25):

| 장르 키     | 타일 면 CR · WG       | 갈래               | 일치    |
| ----------- | --------------------- | ------------------ | ------- |
| pops        | `#c28465` · `#ce8668` | 살구 · 연한 주황   | 일치    |
| anime       | `#763169` · `#823a73` | 보라               | 일치    |
| bm          | `#4e6381` · `#4c6389` | 남청               | 일치    |
| org         | `#8d481f` · `#9d4b1e` | 구릿빛 주황 · 갈색 | 일치    |
| var         | `#a77822` · `#ad7627` | 짙은 금 · 호박     | 일치    |
| cljz        | `#3e8d32` · `#3d8232` | 초록               | 일치    |
| Trend(없음) | `#900b01` · `#a91703` | 빨강               | 차이 큼 |

책 선반 표지: POPS · ANIME · BEMANI · VARIETY · CLASSIC AND JAZZ 다섯 권은 표지 면이 같은 청록(CR `#335249` · `#335248` · `#34544a` · `#345249` · `#33534a`, WG `#37514f` · `#3a5255` · `#355354` · `#34524f` · `#35514f`)이라 장르 색이 아니고, 장르 구분은 책 위 반원 문양(POPS `#cb9e7a` · ANIME `#bc8ba2` · BEMANI `#6896a7` · VARIETY `#a8864c` · CLASSIC AND JAZZ `#a1a26d`, CR 값)과 이름이다. NOSTALGIA 책은 회갈색 `#908672`, ALL MUSIC 은 갈색 `#513b23`, TREND 는 붉은 주황 `#883224`.

지금 토큰과의 사실 대조: `--nl-category-var` 는 초록 계열, `--nl-category-cljz` 는 금색 계열인데 게임 타일은 Var 가 금 · 호박, CL/Jz 가 초록이다. 나머지 네 장르는 갈래가 같다.

미확인 · 근거 약함: 공식 사이트 · 공식 X 이미지 0(e-amusement 소개는 셸뿐, 하위 주소 404, X 로그인 벽), 독립 출처는 영상 2개뿐, YouTube 재압축 때문에 값이 ±16 흔들리고 타일은 단색이 아님, 「名声」 글자색의 장르 변화는 화면을 못 찾음.

### 끝 기준 점검

- A01–A05 업적: 서비스 25곳(국내 3) 그대로. 보충으로 더한 곳 0. 막힌 이유: 국내 게임 전적 사이트가 티어를 이미지로 보임 · 다크 테마가 머리 쪽뿐 · 확인 창.
- A06 FC: 캡처로 확인한 곳 0 그대로. 막힌 이유: 공개 화면에 FC 표시 없음(로그인 뒤) · 라이트 · 확인 창.
- A07 장르: 6색 한 벌 0곳 그대로. 막힌 이유: 장르를 색으로 칠하는 공개 서비스를 못 찾음.
- 이 세션에서 연 곳: 주소 약 50곳(국내 22곳 안팎). 위 표에 곳마다 적었다. 더 늘리려면 로그인 뒤 화면 · 앱 · 공식 디자인 문서가 필요해 AGENTS.md 의 로그인 규칙 때문에 하지 않았다.

### 보충 실측 취합 대조 (2026-11-25, 취합 세션)

- 새로 센 곳이 0곳이라 숫자 고침은 없다. 열었지만 세지 않은 곳(DAK.GG · FOW.LOL · LOL.PS · osu! 순위표 · mdmc.moe 등)의 까닭이 표마다 적혀 있고, 세지 않은 판단(그림 티어 · 라이트 본문 · FC 표시 아님)에 동의한다.
- 판에 「근거 약함」 으로 갈 자리: A01–A05(국내 3) · A06(캡처 확인 0) · A07(6색 한 벌 0).
