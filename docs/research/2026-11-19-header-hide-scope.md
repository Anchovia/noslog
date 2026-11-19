# 스크롤할 때 헤더를 숨기는 범위 — 실제 서비스 · 디자인 시스템

헤더 숨김 움직임 값(숨음 300ms exit-expressive · 나타남 300ms enter-expressive)은 이미 정해졌다. 이 기록은 「어느 쪽 · 어느 폭에서 숨기는가」 만 잰다.

## 재는 법

- 2026-11-19, headless Playwright(Chromium), colorScheme dark, permissions 없음, 페이지 열기 전 `~/noslog-research/wait-capacity.sh`, 브라우저 하나에 페이지 하나.
- 폭 세 가지: 폰 390(iPhone 13 에뮬레이션, 모바일 UA) · 태블릿 768(iPad Mini 에뮬레이션) · PC 1440×900.
- 곳마다 목록 쪽과 상세 쪽을 연다. 상세 쪽 URL 은 목록 쪽 링크에서 첫 번째를 고른다.
- 헤더 찾기: 맨 위(top 4px 안)에 붙은 폭 80% 넘는 fixed · sticky 요소 중 가장 큰 것. 없으면 화면 맨 위 가운데 점에서 위로 올라가며 맨 위에 붙은 가장 큰 요소(같이 올라가는 헤더).
- 스크롤: 휠 12px 씩 25번(0 → 300) 하며 헤더 transform · 위치를 기록하고, 100px 씩 12번 더 내려 1,500 근처에서 잰 뒤, 휠 −12px 씩 16번 올리며 다시 잰다.
- 판정: 깊이 내려간 뒤에도 헤더가 다 보이면 「고정」, 일부만 보이면 「일부 고정」, 안 보이다가 조금 올리면 다시 보이면 「숨김」, 헤더가 문서 흐름에 있어 그냥 위로 사라지면 「같이 올라감」. 헤더 밖의 다른 띠(탭 · 필터)가 맨 위에 붙어 있으면 따로 적는다.
- 숨기 시작 y 는 휠 12px 단위라 ±12px, 「나타남」 은 올리기 시작해 처음 헤더가 움직인 거리다.
- 원자료 JSON · 캡처: `~/noslog-research/header-hide-2026-11-19/`(`<곳>_<list|detail>_<폭>.json`, `shots/<곳>_<쪽>_<폭>_0.png · _1deep.png · _2up.png`).

## 곳마다

### 당근

- 목록 <https://www.daangn.com/kr/search/buy-sell/>: 폰 390 같이 올라감 / 태블릿 768 고정 / PC 1440 일부 고정(sticky top −40, 133 중 93)
- 상세 <https://www.daangn.com/kr/community/%ED%98%BC%EC%88%A0%ED%95%A0%EB%A7%8C%ED%95%9C-%EB%A7%9B%EC%A7%91%EC%9E%88%EB%82%98%E>: 폰 390 숨김, y 108 부근에서 숨기 시작 · 위로 12px 안에 나타남 / 태블릿 768 숨김, y 108 부근에서 숨기 시작 · 위로 12px 안에 나타남 / PC 1440 고정

### 네이버 뉴스

- 목록 <https://news.naver.com/main/ranking/popularDay.naver>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://n.news.naver.com/article/277/0005845102?ntype=RANKING>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정

### 다음 뉴스

- 목록 <https://news.daum.net/>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://v.daum.net/v/20261119170745745>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정

### 나무위키

- 목록 <https://namu.wiki/w/%EB%B6%84%EB%A5%98:%EB%A6%AC%EB%93%AC%20%EA%B2%8C%EC%9E%84>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://namu.wiki/w/DJMAX%20Portable>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 디시인사이드

- 목록 <https://gall.dcinside.com/board/lists/?id=rhythmgame>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://gall.dcinside.com/board/view/?id=rhythmgame&no=11292034&page=1>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 루리웹

- 목록 <https://bbs.ruliweb.com/community/board/300143>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://bbs.ruliweb.com/community/board/300143/read/77448461>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 인벤

- 목록 <https://www.inven.co.kr/board/webzine/2097>: 폰 390 같이 올라감 · 게시판 탭 줄 고정 / 태블릿 768 같이 올라감 · 게시판 탭 줄 고정 / PC 1440 일부 고정(214 중 65)
- 상세 <https://www.inven.co.kr/board/webzine/2097/2754104>: 폰 390 같이 올라감 · 게시판 탭 줄 고정 / 태블릿 768 같이 올라감 · 게시판 탭 줄 고정 / PC 1440 일부 고정(214 중 65)

### 클리앙

- 목록 <https://www.clien.net/service/board/park>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://www.clien.net/service/board/park/19295454?od=T31&po=0&category=0&groupCd=>: 폰 390 같이 올라감 · 글 도구 줄이 내릴 때만 붙음 / 태블릿 768 같이 올라감 · 글 도구 줄이 내릴 때만 붙음 / PC 1440 같이 올라감

### 더쿠

- 목록 <https://theqoo.net/hot>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 막힘(403)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 에펨코리아

- 목록 <https://www.fmkorea.com/best>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://www.fmkorea.com/10500678569>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 아카라이브

- 목록 <https://arca.live/b/rhythmgame>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 막힘(403)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 무신사

- 목록 <https://www.musinsa.com/main/musinsa/ranking?gf=A&storeCode=musinsa&sectionId=200&contentsId=&categoryCode=000&ageBand=A>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정
- 상세 <https://www.musinsa.com/products/7540639>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 막힘(403)

### 29CM

- 목록 <https://www.29cm.co.kr/best-items>: 폰 390 막힘(404) / 태블릿 768 막힘(404) / PC 1440 막힘(404)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 올리브영

- 목록 <https://www.oliveyoung.co.kr/store/main/getBestList.do>: 폰 390 머리 숨김(y 120 부근, 위로 24px 안에 나타남) · 메뉴 줄(gnb) 고정 / 태블릿 768 머리 숨김(y 120 부근, 위로 36px 안에 나타남) · 메뉴 줄(gnb) 고정 / PC 1440 막힘(403)
- 상세 <https://m.oliveyoung.co.kr/m/goods/getGoodsDetail.do?goodsNo=A000000177984>: 폰 390 숨김, y 60 부근에서 숨기 시작 · 위로 36px 안에 나타남 / 태블릿 768 숨김, y 48 부근에서 숨기 시작 · 위로 36px 안에 나타남 / PC 1440 막힘(403)

### KREAM

- 목록 <https://kream.co.kr/search?shop_category_id=34>: 폰 390 막힘(스크롤 안 됨) / 태블릿 768 고정 / PC 1440 막힘(500)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 지그재그

- 목록 <https://zigzag.kr/categories/-1>: 폰 390 머리 숨김(올리면 나타남) · 카테고리 탭 줄 고정 / 태블릿 768 머리 숨김(올리면 나타남) · 카테고리 탭 줄 고정 / PC 1440 막힘(스크롤 안 됨)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 오늘의집

- 목록 <https://ohou.se/store>: 폰 390 막힘(403) / 태블릿 768 막힘(403) / PC 1440 막힘(403)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 멜론

- 목록 <https://www.melon.com/chart/index.htm>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://www.melon.com/album/detail.htm?albumId=13744621>: 폰 390 고정 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 지니

- 목록 <https://www.genie.co.kr/chart/top200>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### 벅스

- 목록 <https://music.bugs.co.kr/chart>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정
- 상세 <https://music.bugs.co.kr/track/33972776?wl_ref=list_tr_08_chart>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 고정

### YouTube

- 목록 <https://www.youtube.com/results?search_query=nostalgia+konami>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정
- 상세 <https://www.youtube.com/watch?v=5wDpGrf-fCk>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정

### Reddit

- 목록 <https://www.reddit.com/r/rhythmgames/>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 막힘(스크롤 안 됨)
- 상세 <https://www.reddit.com/r/rhythmgames/comments/1xnd6ex/were_working_on_a_rhythm_game_where_everything/>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 막힘(스크롤 안 됨)

### velog

- 목록 <https://velog.io/trending>: 폰 390 숨김(FloatingHeader, 올리면 머리 · 탭 함께 나타남) / 태블릿 768 숨김(FloatingHeader, 올리면 머리 · 탭 함께 나타남) / PC 1440 숨김(FloatingHeader, 올리면 머리 · 탭 함께 나타남)
- 상세 <https://velog.io/@harudle/%EC%84%9C%EB%A5%98-100%EA%B0%9C-%EA%B4%91%ED%83%88%ED%95%98%EA%B3%A0-%EC%9D%B8%EC%8A%A4%ED%83%>: 폰 390 숨김(FloatingHeader, 올리면 나타남) / 태블릿 768 숨김(FloatingHeader, 올리면 나타남) / PC 1440 숨김(FloatingHeader, 올리면 나타남)

### 브런치

- 목록 <https://brunch.co.kr/>: 폰 390 고정 / 태블릿 768 미확인(헤더를 못 잡음) / PC 1440 미확인(헤더를 못 잡음)
- 상세 <https://brunch.co.kr/@brunch/433>: 폰 390 고정 / 태블릿 768 고정(80 → 60 으로 줄어든 채) / PC 1440 고정(80 → 60 으로 줄어든 채)

### 티스토리

- 목록 <https://www.tistory.com/>: 폰 390 같이 올라감 · 분류 칩 줄 고정 / 태블릿 768 고정 / PC 1440 고정
- 상세 <https://notice.tistory.com/2707>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### OP.GG

- 목록 <https://op.gg/ko/lol/leaderboards/tier>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 막힘(403)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### DAK.GG

- 목록 <https://dak.gg/er/leaderboard>: 폰 390 막힘(앱 설치 팝업) / 태블릿 768 막힘(앱 설치 팝업) / PC 1440 같이 올라감
- 상세 <https://dak.gg/er/players/Preme>: 폰 390 막힘(앱 설치 팝업) / 태블릿 768 막힘(앱 설치 팝업) / PC 1440 같이 올라감

### maple.gg

- 목록 <https://maple.gg/ranks/total>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://maple.gg/u/%EC%98%A4%EC%A7%80%ED%99%98>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 로스트아크

- 목록 <https://lostark.game.onstove.com/Community/Free/List>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정(스크롤하면 header--scrolled 로 fixed 80)
- 상세 <https://lostark.game.onstove.com/Community/Free/Views/14640348?page=1&searchtype=0&searchtext=&ordertype=latest&category>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정(스크롤하면 header--scrolled 로 fixed 80)

### osu!

- 목록 <https://osu.ppy.sh/rankings/osu/global/performance>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정(위 띠 50 만 남음)
- 상세 <https://osu.ppy.sh/users/7562902/osu>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정(위 띠 50 만 남음)

### Lichess

- 목록 <https://lichess.org/player>: 폰 390 숨김, y 12 부근에서 숨기 시작 · 위로 24px 안에 나타남 / 태블릿 768 숨김, y 12 부근에서 숨기 시작 · 위로 24px 안에 나타남 / PC 1440 막힘(403)
- 상세 <https://lichess.org/@/DrNykterstein>: 폰 390 막힘(403) / 태블릿 768 막힘(403) / PC 1440 막힘(403)

### Chess.com

- 목록 <https://www.chess.com/leaderboard/live>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 미확인(헤더를 못 잡음)
- 상세 <https://www.chess.com/member/hikaru>: 폰 390 고정 · 프로필 탭 줄도 붙음 / 태블릿 768 고정 · 프로필 탭 줄도 붙음 / PC 1440 미확인(헤더를 못 잡음)

### Tracker.gg

- 목록 <https://tracker.gg/valorant/leaderboards/ranked/all/default>: 폰 390 고정(맨 위 알림 띠 32 만 올라가고 머리 띠 40 고정) / 태블릿 768 고정(맨 위 알림 띠 32 만 올라가고 머리 띠 40 고정) / PC 1440 막힘(403)
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### Steam

- 목록 <https://store.steampowered.com/charts/topselling/KR>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 같이 올라감

### GitHub

- 목록 <https://github.com/trending>: 폰 390 같이 올라감 · Explore 탭 줄 고정 / 태블릿 768 같이 올라감 · Explore 탭 줄 고정 / PC 1440 같이 올라감 · Explore 탭 줄 고정
- 상세 <https://github.com/features/copilot>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 왓챠피디아

- 목록 <https://pedia.watcha.com/ko>: 폰 390 막힘(앱 설치 팝업) / 태블릿 768 고정 / PC 1440 고정
- 상세 <https://pedia.watcha.com/ko/contents/tP8aD5N>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정

### 네이버 웹툰

- 목록 <https://comic.naver.com/webtoon>: 폰 390 막힘(앱 설치 팝업) / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세 <https://comic.naver.com/webtoon/list?titleId=856260>: 폰 390 막힘(앱 설치 팝업) / 태블릿 768 같이 올라감 / PC 1440 같이 올라감

### 네이버 스포츠

- 목록 <https://m.sports.naver.com/kbaseball/index>: 폰 390 같이 올라감 / 태블릿 768 같이 올라감 / PC 1440 같이 올라감
- 상세: 안 잼(상세 링크를 찾지 못했거나 링크 쪽이 막힘)

### Twitch

- 목록 <https://www.twitch.tv/directory>: 폰 390 고정 / 태블릿 768 고정 / PC 1440 고정
- 상세 <https://www.twitch.tv/directory/category/grand-theft-auto-vi>: 폰 390 같이 올라감 · 카테고리 제목 줄 고정 / 태블릿 768 같이 올라감 · 카테고리 제목 줄 고정 / PC 1440 고정

## 묶음(폰 390 기준, 목록 · 상세)

표본: 실제 서비스 39곳을 열었고 29CM(404) · 오늘의집(403)은 모든 쪽이 막혀 뺐다. DAK.GG 는 폰 · 태블릿이 앱 설치 팝업에 막혀 PC 만 셌다. 폰으로 묶은 곳은 36곳이다. 태블릿 768 은 당근 목록(폰 같이 올라감 · 태블릿 고정) 말고는 폰과 같은 묶음이다.

| 묶음                                                      | 곳                                                                                                                        | 수            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 목록 · 상세 모두 숨김(내리면 숨고 조금 올리면 나타남)     | 올리브영(폰 · 태블릿), velog(PC 까지), Lichess(목록만 잼), 지그재그(목록만 잼, 카테고리 탭 줄은 남김)                     | 4 · 근거 약함 |
| 상세만 숨김, 목록은 폰에서 같이 올라감 · 태블릿 이상 고정 | 당근                                                                                                                      | 1 · 근거 약함 |
| 늘 고정                                                   | 브런치, Chess.com, KREAM, 로스트아크, 무신사, osu!, Reddit, Tracker.gg, 왓챠피디아, YouTube, 더쿠                         | 11            |
| 같이 올라감(고정하지 않음)                                | 아카라이브, 클리앙, 디시인사이드, 에펨코리아, 지니, maple.gg, 나무위키, 네이버 스포츠, 네이버 웹툰(태블릿), OP.GG, 루리웹 | 11            |
| 머리는 같이 올라가고 탭 · 칩 줄만 고정                    | GitHub, 인벤, 티스토리(목록)                                                                                              | 3 · 근거 약함 |
| 목록은 같이 올라가고 상세는 고정                          | 네이버 뉴스, 다음 뉴스, 멜론, Steam                                                                                       | 4 · 근거 약함 |
| 그 밖에 섞임                                              | 벅스(목록 고정 · 상세 같이 올라감), Twitch(목록 고정 · 상세는 카테고리 제목 줄만 고정)                                    | 2             |

- PC 1440: 숨기는 곳은 velog 하나다. 당근 상세는 992 이상에서 숨김을 끈다. 나머지는 고정 또는 같이 올라감이다.
- 숨기는 곳의 숨기 시작 지점은 당근 y 108 부근(헤더 60), 올리브영 y 48–120 부근(헤더 48), Lichess y 12 부근이고, 다시 나타나는 데 필요한 올림은 12–36px 이다(휠 12px 단위).
- 탭 · 필터 줄: velog 는 탭 줄이 머리와 함께 숨고 함께 나타난다. 지그재그 · 올리브영은 머리만 숨고 탭 줄은 남는다. 인벤 · GitHub · 티스토리는 머리가 없어지고 탭 줄만 붙는다.

## 디자인 시스템

11곳의 공식 문서를 읽었다(원문 정리: 공유 메모 `common-layer/stage3/motion/hdr-hide/ds.md`).

| 곳                                                     | 숨김                                              | 기본                                                 | 폭 지침                   |
| ------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------- | ------------------------- |
| Material 3 App bars                                    | 선택 기능(늘 남기거나 숨겼다 보이거나 둘 다 허용) | 미확인                                               | 미확인                    |
| Android Compose TopAppBarScrollBehavior · AppBarLayout | enterAlways · exitUntilCollapsed · pinned 중 고름 | 동작을 넘기지 않으면 반응 없음                       | 미확인                    |
| Flutter SliverAppBar                                   | floating · snap · pinned                          | 셋 다 false(내용과 함께 올라가고 맨 위에서만 돌아옴) | 미확인                    |
| Apple HIG · UIKit                                      | hidesBarsOnSwipe 선택                             | false(숨기지 않음), 큰 제목은 접힘                   | 탭 바 최소화는 iPhone 만  |
| Ionic Header                                           | 숨김 없음(큰 제목 접힘 · 페이드, iOS 모드)        | 없음                                                 | 미확인                    |
| IBM Carbon UI shell header                             | 숨김 언급 없음                                    | 늘 있음(persistent)                                  | 좁은 폭은 링크를 햄버거로 |
| 당근 SEED Top Navigation                               | 숨김 없음                                         | 스크롤해도 늘 위에 고정                              | 미확인                    |
| Fluent 2 · Shopify Polaris · Atlassian · 토스 TDS      | 미확인                                            | 미확인                                               | 미확인                    |

숨김을 지원하는 네 곳(M3 · Android · Flutter · Apple)은 모두 선택 기능이고, 고정을 기본으로 적은 곳은 당근 SEED · Carbon 두 곳이다. 폭별 지침은 Apple 한 곳뿐이라 근거 약함.

## 지금 NosLog

- 일반 셸에서 폭 1055 이하일 때 모든 쪽이 숨김 대상이다. 헤더 높이(56)만큼 내려간 뒤 4px 넘게 내리면 숨고, 4px 넘게 올리거나 맨 위 8px 안이면 나타난다. 1056 이상과 ≡ 메뉴를 연 동안은 숨기지 않는다(`components/layout/app-header.tsx:48 · 110–139`, `app/styles/layout.css:100–107`).
- 오락실은 1055 이하에서 쪽 높이를 화면 높이(100dvh − 헤더)에 고정하고 목록 시트 안에서 스크롤한다(`app/styles/arcades.css:579–588`). 창이 스크롤되지 않아 헤더 숨김이 실제로 일어나지 않는다.
