# 컨트롤 크기 단계 — 한 곳 안에서 몇 단계 높이를 쓰나 (2026-11-26)

물음: 한 서비스 · 한 디자인 시스템 안에서 버튼 · 아이콘 버튼 · 칩 · 셀렉트 · 검색칸 · 입력칸 · 탭 · 메뉴 항목 · 체크 줄 · 쪽 번호가 몇 단계 높이를 쓰고, 같은 용법이 같은 높이인가. 컨트롤 크기 단계를 줄이는 판(4단계 반영 D)의 재료다. 추천은 쓰지 않는다.

이미 있는 기록은 다시 재지 않았다: [컨트롤 높이 실측(2026-09-15, 서비스 59 · DS 20)](./research-control-heights.md) · [혼자 놓인 주 버튼 · 검색칸(2026-11-25)](./2026-11-25-lone-control-height.md) · [디자인 시스템 22곳](./research-design-systems.md). 이 기록은 그 위에 「한 곳 안 단계 수」 와 「용법 짝이 같은 높이인가」 를 새로 센 것이다.

## 방법

- headless Chromium(Playwright), 다크 색 구성표, ko-KR, 폭 1440 × 900, 로그아웃, 쪽 하나(검색 결과 · 목록 · 홈). 기다림 4.5초. 아무것도 누르지 않았다.
- 보이는 요소를 용법별로 모았다: 버튼(글자 있음) · 아이콘 버튼(글자 없음, 정사각에 가까움) · 입력칸 · 검색칸(`type=search` · 이름이나 안내 글에 search · 검색) · 셀렉트 · 탭(`role=tab`) · 칩(class 에 chip · pill) · 메뉴 항목 · 체크 줄(label 안 checkbox · radio) · 쪽 번호(class 에 pagination · pager). 칸 높이는 입력칸 · 검색칸이 겉 상자(테두리 · 면이 있는 위 두 단계 부모)를 따로 쟀다.
- 높이 24–64 만 단계로 센다. 용법마다 가장 많은 높이(최빈)를 그 용법의 높이로 보고, ±1 은 한 높이로 묶는다. 「단계 수」 = 한 곳의 용법별 최빈 높이가 서로 다른 값의 수.
- 표본 인정: 컨트롤이 세 종류 이상 잡힌 곳. 403 · 400 · 차단 · 컨트롤 두 종류 이하는 세지 않고 「제외」 에 적었다. 같은 곳 다른 쪽(GitHub 검색 · 이슈)은 한 곳으로 센다.
- 한계: 쪽 하나씩이라 마케팅 CTA 가 버튼에 섞이고, 앱 안 화면(설정 · 대시보드)은 로그인 벽이라 못 연다. 그래서 「단계 수」 는 아래쪽 한계로 읽는다(실제는 같거나 더 많음). 원자료는 `~/` 밖 스크래치패드의 `size/raw.json`(리포 밖).

## 서비스 표본 48곳(국내 8 · 해외 40)

칸은 용법별 최빈 높이(px). 국내는 알라딘 · 교보문고 · 지니 · 네이버 검색 · 네이버 웹툰 · 다음 · 당근 · 번개장터.

| 곳                  | 쪽                     | 단계 수 | 단계                   | 용법별 최빈 높이                                                     |
| ------------------- | ---------------------- | ------- | ---------------------- | -------------------------------------------------------------------- |
| Steam               | store.steampowered.com | 2       | 28 · 34                | 버튼 28 · 아이콘 버튼 34 · 입력칸 27 · 검색칸 34                     |
| GitHub              | github.com             | 2       | 28 · 32                | 버튼 28 · 아이콘 버튼 32 · 쪽 번호 32                                |
| YouTube             | www.youtube.com        | 2       | 32 · 40                | 버튼 40 · 아이콘 버튼 40 · 검색칸 40 · 탭 32                         |
| Spotify             | open.spotify.com       | 2       | 32 · 48                | 버튼 32 · 아이콘 버튼 48 · 검색칸 48 · 칩 32 · 메뉴 항목 32          |
| Twitch              | www.twitch.tv          | 2       | 32 · 36                | 버튼 32 · 아이콘 버튼 32 · 검색칸 36 · 셀렉트 32 · 탭 32             |
| Wikipedia           | ko.wikipedia.org       | 1       | 32                     | 버튼 32 · 검색칸 32                                                  |
| Hugging Face        | huggingface.co         | 1       | 28                     | 버튼 28 · 검색칸 28                                                  |
| Docker Hub          | hub.docker.com         | 2       | 28 · 32                | 버튼 28 · 아이콘 버튼 28 · 쪽 번호 32                                |
| Dribbble            | dribbble.com           | 2       | 34 · 54                | 버튼 35 · 아이콘 버튼 34 · 검색칸 54 · 셀렉트 54                     |
| SoundCloud          | soundcloud.com         | 3       | 32 · 36 · 40           | 버튼 32 · 아이콘 버튼 40 · 입력칸 36 · 검색칸 36                     |
| Booking             | www.booking.com        | 3       | 36 · 44 · 48           | 버튼 44 · 아이콘 버튼 48 · 입력칸 36 · 메뉴 항목 44                  |
| Airbnb              | www.airbnb.co.kr       | 3       | 30 · 36 · 40           | 버튼 30 · 아이콘 버튼 40 · 탭 36                                     |
| Google Play         | play.google.com        | 1       | 48                     | 아이콘 버튼 48 · 검색칸 48 · 셀렉트 48                               |
| 네이버 검색         | search.naver.com       | 3       | 30 · 36 · 41           | 버튼 36 · 아이콘 버튼 36 · 검색칸 30 · 탭 41 · 체크 줄 29            |
| 알라딘              | www.aladin.co.kr       | 2       | 24 · 50                | 버튼 24 · 입력칸 24 · 검색칸 50                                      |
| Vercel              | vercel.com             | 3       | 24 · 32 · 36           | 버튼 32 · 아이콘 버튼 24 · 검색칸 36                                 |
| 교보문고            | search.kyobobook.co.kr | 3       | 24 · 44 · 48           | 버튼 24 · 아이콘 버튼 48 · 입력칸 44 · 검색칸 44 · 셀렉트 44 · 칩 24 |
| Linear              | linear.app             | 1       | 28                     | 버튼 28 · 아이콘 버튼 28 · 칩 28                                     |
| 지니                | www.genie.co.kr        | 3       | 24 · 28 · 38           | 버튼 24 · 검색칸 38 · 쪽 번호 28                                     |
| Notion              | www.notion.so          | 3       | 28 · 33 · 44           | 버튼 44 · 아이콘 버튼 28 · 검색칸 33                                 |
| Pinterest           | www.pinterest.com      | 3       | 32 · 48 · 52           | 버튼 52 · 아이콘 버튼 32 · 검색칸 48                                 |
| GitLab              | gitlab.com             | 3       | 24 · 32 · 50           | 버튼 32 · 아이콘 버튼 32 · 검색칸 24 · 탭 50 · 쪽 번호 32            |
| Kaggle              | www.kaggle.com         | 3       | 24 · 28 · 53           | 버튼 24 · 아이콘 버튼 28 · 검색칸 53                                 |
| TED                 | www.ted.com            | 4       | 24 · 44 · 46 · 48      | 버튼 44 · 아이콘 버튼 44 · 입력칸 46 · 검색칸 48 · 체크 줄 24        |
| Coursera            | www.coursera.org       | 2       | 36 · 48                | 버튼 36 · 아이콘 버튼 36 · 검색칸 48                                 |
| crates.io           | crates.io              | 2       | 29 · 31                | 버튼 29 · 검색칸 29 · 쪽 번호 31                                     |
| 당근                | www.daangn.com         | 2       | 32 · 57                | 버튼 32 · 아이콘 버튼 32 · 검색칸 57                                 |
| Amazon              | www.amazon.com         | 3       | 24 · 40 · 48           | 버튼 24 · 아이콘 버튼 48 · 검색칸 40 · 체크 줄 24                    |
| 네이버 웹툰         | comic.naver.com        | 3       | 37 · 39 · 56           | 버튼 39 · 아이콘 버튼 56 · 검색칸 37                                 |
| Bing                | www.bing.com           | 3       | 32 · 40 · 48           | 버튼 32 · 아이콘 버튼 40 · 검색칸 48                                 |
| DuckDuckGo          | duckduckgo.com         | 3       | 32 · 34 · 48           | 버튼 34 · 아이콘 버튼 32 · 검색칸 48                                 |
| IKEA                | www.ikea.com           | 3       | 40 · 42 · 48           | 버튼 48 · 아이콘 버튼 42 · 검색칸 48 · 체크 줄 40                    |
| 다음                | search.daum.net        | 3       | 51 · 54 · 56           | 버튼 51 · 아이콘 버튼 54 · 검색칸 56                                 |
| GOG                 | www.gog.com            | 5       | 32 · 34 · 36 · 40 · 44 | 버튼 36 · 입력칸 34 · 검색칸 44 · 탭 40 · 쪽 번호 32                 |
| itch.io             | itch.io                | 2       | 30 · 36                | 버튼 36 · 아이콘 버튼 30 · 입력칸 30 · 검색칸 30                     |
| Khan Academy        | www.khanacademy.org    | 3       | 24 · 38 · 40           | 버튼 38 · 아이콘 버튼 24 · 검색칸 40                                 |
| React docs          | react.dev              | 1       | 40                     | 버튼 40 · 아이콘 버튼 40 · 검색칸 40                                 |
| Next.js docs        | nextjs.org             | 2       | 32 · 36                | 버튼 32 · 아이콘 버튼 36 · 입력칸 32                                 |
| Supabase            | supabase.com           | 3       | 24 · 44 · 50           | 버튼 50 · 아이콘 버튼 24 · 탭 44                                     |
| MusicBrainz         | musicbrainz.org        | 2       | 25 · 29                | 버튼 29 · 아이콘 버튼 25 · 검색칸 25 · 셀렉트 25                     |
| Nike                | www.nike.com           | 3       | 26 · 36 · 48           | 버튼 48 · 아이콘 버튼 36 · 검색칸 36 · 메뉴 항목 26                  |
| 번개장터            | m.bunjang.co.kr        | 2       | 42 · 52                | 버튼 43 · 아이콘 버튼 52 · 검색칸 42                                 |
| Hacker News Algolia | hn.algolia.com         | 3       | 24 · 26 · 59           | 검색칸 59 · 셀렉트 26 · 쪽 번호 24                                   |
| Packagist           | packagist.org          | 3       | 31 · 34 · 37           | 아이콘 버튼 31 · 검색칸 34 · 쪽 번호 37                              |
| Open Library        | openlibrary.org        | 2       | 32 · 47                | 버튼 32 · 아이콘 버튼 32 · 검색칸 47                                 |
| Flickr              | www.flickr.com         | 3       | 24 · 34 · 40           | 버튼 34 · 검색칸 40 · 체크 줄 24                                     |
| Mixcloud            | www.mixcloud.com       | 4       | 27 · 32 · 36 · 54      | 버튼 27 · 아이콘 버튼 36 · 입력칸 54 · 검색칸 32                     |
| Apple Music         | music.apple.com        | 3       | 30 · 34 · 38           | 버튼 34 · 아이콘 버튼 30 · 검색칸 38                                 |

### 집계

- 단계 수: 1단계 5곳 · 2단계 16곳 · 3단계 24곳 · 4단계 2곳 · 5단계 1곳, 중앙값 3, 평균 2.5, 최대 5. 여덟 단계를 쓰는 곳은 없다(쪽 하나 기준 하한).

| 용법 짝            | 둘 다 잰 곳 | 같은 높이(±1) | ±4 안 | 읽기      |
| ------------------ | ----------- | ------------- | ----- | --------- |
| 버튼 · 아이콘 버튼 | 38          | 12            | 20    |           |
| 버튼 · 검색칸      | 38          | 7             | 16    |           |
| 입력칸 · 검색칸    | 8           | 3             | 4     | 근거 약함 |
| 버튼 · 입력칸      | 10          | 3             | 6     |           |
| 검색칸 · 셀렉트    | 6           | 4             | 5     | 근거 약함 |
| 버튼 · 셀렉트      | 4           | 1             | 2     | 근거 약함 |
| 버튼 · 탭          | 7           | 1             | 2     | 근거 약함 |
| 버튼 · 칩          | 3           | 3             | 3     | 근거 약함 |

용법별 최빈 높이(곳 수):

- 버튼(45곳, 중앙 32): 32 10곳 · 28 5곳 · 24 5곳 · 36 4곳
- 아이콘 버튼(40곳, 중앙 35): 32 7곳 · 40 5곳 · 48 5곳 · 36 5곳
- 검색칸(41곳, 중앙 40): 48 8곳 · 40 5곳 · 36 4곳 · 34 2곳
- 입력칸(10곳, 중앙 35): 36 2곳 · 27 1곳 · 24 1곳 · 44 1곳
- 셀렉트(6곳, 중앙 38): 32 1곳 · 54 1곳 · 48 1곳 · 44 1곳 — 근거 약함
- 탭(7곳, 중앙 40): 32 2곳 · 36 1곳 · 41 1곳 · 50 1곳 — 근거 약함
- 칩(3곳, 중앙 28): 32 1곳 · 24 1곳 · 28 1곳 — 근거 약함
- 메뉴 항목(3곳, 중앙 32): 32 1곳 · 44 1곳 · 26 1곳 — 근거 약함
- 체크 줄(5곳, 중앙 24): 24 3곳 · 29 1곳 · 40 1곳 — 근거 약함
- 쪽 번호(8곳, 중앙 32): 32 4곳 · 28 1곳 · 31 1곳 · 24 1곳 — 근거 약함

### 제외한 곳

| 곳             | 이유                  |
| -------------- | --------------------- |
| Stack Overflow | 차단(403)             |
| npm            | 차단(403)             |
| 무신사         | 컨트롤 부족(1종)(200) |
| 29CM           | 컨트롤 부족(2종)(200) |
| Product Hunt   | 차단(403)             |
| Letterboxd     | 차단(403)             |
| IMDb           | 차단(403)             |
| Last.fm        | 컨트롤 부족(0종)(200) |
| Goodreads      | 컨트롤 부족(0종)(202) |
| Bandcamp       | 컨트롤 부족(2종)(200) |
| Discogs        | 차단(403)             |
| MDN            | 컨트롤 부족(1종)(200) |
| 카카오맵       | 컨트롤 부족(2종)(200) |
| 멜론           | 컨트롤 부족(2종)(200) |
| 네이버 지도    | 컨트롤 부족(2종)(200) |
| 나무위키       | 컨트롤 부족(2종)(200) |
| 예스24         | 컨트롤 부족(2종)(200) |
| Figma 커뮤니티 | 차단(403)             |
| Trello         | 컨트롤 부족(2종)(200) |
| Canva          | 차단(403)             |
| Etsy           | 차단(403)             |
| Stripe         | 컨트롤 부족(2종)(200) |
| eBay           | 차단(403)             |
| Behance        | 차단(400)             |
| CodePen        | 차단(403)             |
| Udemy          | 차단(403)             |
| PyPI           | 컨트롤 부족(2종)(200) |
| Thingiverse    | 차단(403)             |
| Reddit         | 컨트롤 부족(1종)(200) |
| Discord        | 컨트롤 부족(2종)(200) |
| Slack          | 컨트롤 부족(2종)(200) |
| 배달의민족     | 컨트롤 부족(2종)(200) |
| 쿠팡           | 차단(403)             |
| 토스           | 컨트롤 부족(1종)(200) |
| Yelp           | 차단(403)             |
| Genius         | 차단(403)             |
| Tailwind docs  | 컨트롤 부족(2종)(200) |
| Zillow         | 차단(403)             |
| TripAdvisor    | 차단(403)             |
| Expedia        | 컨트롤 부족(0종)(429) |
| ASOS           | 차단(403)             |
| Uniqlo         | 차단(403)             |
| 오늘의집       | 차단(403)             |
| 올리브영       | 차단(403)             |
| 11번가         | 차단(403)             |
| Wikipedia EN   | 컨트롤 부족(2종)(200) |
| Archive.org    | 컨트롤 부족(0종)(200) |
| Unsplash       | 차단(403)             |
| Pexels         | 차단(403)             |
| Vimeo          | 차단(403)             |
| Zalando        | 데이터 없음(ok)       |
| Deezer         | 컨트롤 부족(1종)(200) |
| Tidal          | 차단(403)             |

## 디자인 시스템 표본

「문서」 는 공식 문서의 크기 토큰 · 규격 표를 이번에 읽은 값, 「예시 실측」 은 공식 문서 쪽 예시 칸을 같은 방법으로 잰 값(이번 실측 · 앞선 기록), 「앞선 기록」 은 위 세 기록의 값을 그대로 옮긴 것.

| 시스템                    | 단계 이름 · 높이                                                                                                                       | 같은 단계 이름이 여러 부품에 쓰이는가                                                    | 출처                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------- |
| GitHub Primer             | xsmall 24 · small 28 · medium 32 · large 40 · xlarge 48(`--control-*-size`)                                                            | 예. 버튼 · 세그먼트가 같은 `control-size`(예시 실측 버튼 28 · 32 · 40, 세그먼트 28 · 32) | 문서(@primer/primitives size.css) · 예시 실측 |
| IBM Carbon                | 버튼 xs 24 · sm 32 · md 40 · lg 48 · xl 64 · 2xl 80(일곱 단계)                                                                         | 문서가 한 묶음에 다른 크기를 섞지 말라고 적음. 검색 예시 실측 32 · 48                    | 문서(button 크기 표) · 예시 실측              |
| Material 3                | 검색 막대 56 · 입력칸 56 · 탭 48(아이콘 + 글자 64) · 메뉴 항목 48                                                                      | 부품마다 규격이 따로 있고 한 눈금 이름이 없음                                            | 문서(specs 표)                                |
| Ant Design                | small 24 · 기본 32 · large 40                                                                                                          | 예. 버튼 24/32/40 · 셀렉트 24/32 · 세그먼트 24/32 · 쪽 번호 24/32/40이 같은 세 값        | 예시 실측 · 앞선 기록                         |
| Bootstrap                 | sm 31 · 기본 38 · lg 48                                                                                                                | 예. 버튼 31/38/48 · 입력칸 31/38/48 · 셀렉트 31/38/48                                    | 예시 실측                                     |
| Chakra UI                 | 예시 실측 32 · 36 · 40 · 44 · 48(size xs–2xl)                                                                                          | 버튼 · 입력이 같은 size 이름. 입력 32/40/44                                              | 예시 실측                                     |
| Mantine                   | 예시 실측 28 · 36 · 42 · 56(size xs–xl, compact 는 높이를 줄임)                                                                        | 버튼 · 세그먼트 · 입력이 같은 size. 입력 36                                              | 문서 · 예시 실측                              |
| shadcn/ui                 | 예시 실측 24 · 28 · 32 · 36(버튼 xs–lg)                                                                                                | 부분. 입력 32, 셀렉트 28/32, 탭 25~29                                                    | 예시 실측                                     |
| Radix Themes              | size 1 · 2 · 3 · 4(버튼 20/24 · 32 · 40 · 48)                                                                                          | 한 `size` 가 버튼 · 입력 · 셀렉트에 닿음. 입력 예시 30/32/38                             | 앞선 기록 · 예시 실측                         |
| Vercel Geist              | 예시 실측 24 · 32 · 36 · 40 · 48                                                                                                       | 버튼 · 입력이 같은 눈금. 입력 32/36/40                                                   | 예시 실측                                     |
| Atlassian                 | 예시 실측 탭 28 · 32, 입력 36 · 40, 버튼 compact · default 이름                                                                        | 부분. 버튼 · 탭 32, 입력 36                                                              | 예시 실측                                     |
| Adobe Spectrum            | size S · M · L · XL(문서 prop), 예시 실측 M 32                                                                                         | 한 `size` 가 모든 부품에 닿음. 나머지 px 미확인                                          | 문서 · 예시 실측                              |
| Shopify Polaris           | 예시 실측 28 · 입력 32(앞선 기록은 slim 28 · medium 36)                                                                                | 미확인(기본 단계 값)                                                                     | 앞선 기록 · 예시 실측                         |
| 당근 SEED                 | action-button xsmall 32 · small 36 · medium 40 · large 52, 칩 36, 입력 medium 40, 검색 44, 탭 small 40, 체크 줄 32, 메뉴 항목 small 40 | 부품마다 레시피가 따로(검색 44 · 체크 32 · 메뉴 40)                                      | 앞선 기록(daangn-tokens)                      |
| 토스 TDS                  | 버튼 small 32 · medium 38 · large 48 · xlarge 56                                                                                       | 입력 · 검색은 미확인                                                                     | 앞선 기록                                     |
| Fluent 2                  | 예시 실측 버튼 28, 문서 기본 32                                                                                                        | 미확인                                                                                   | 앞선 기록 · 예시 실측                         |
| Base Web · USWDS · GOV.UK | Base Web 36 · 48 · 52, USWDS 40 · 52, GOV.UK 38 · 40                                                                                   | Base Web 은 같은 size 이름, 나머지는 한두 단계                                           | 앞선 기록                                     |

표본: 디자인 시스템 19곳. 크기 px 표를 문서에서 읽은 곳은 Carbon · Material 3 · Primer(primitives 토큰) 세 곳과 SEED(패키지 레시피)이고, Spectrum 은 문서에서 크기 이름만 읽고 px 는 예시 실측이며 Mantine 은 패키지 CSS 에서 px 를 읽었다. 나머지 Ant · Bootstrap · Chakra · shadcn · Radix · Geist · Atlassian · Polaris · Fluent 는 예시 실측, TDS · Base Web · USWDS · GOV.UK 는 앞선 기록이다.

### 읽은 것

- 디자인 시스템은 크기 단계를 3–7개 두고(Ant · Bootstrap 3, Primer 5, Carbon 7), 확인된 곳(Primer · Ant · Bootstrap · Chakra · Mantine · Geist · Radix)은 한 단계 이름이 버튼 · 입력칸 · 셀렉트 · 세그먼트 · 쪽 번호에 같이 닿는다. Material 3 · SEED 는 부품마다 규격이 따로다(검색 · 입력 56 또는 44, 탭 · 메뉴 48 또는 40).
- 단계 사이 간격은 8(24 · 32 · 40 · 48)이 다수이고 Bootstrap 31 · 38 · 48 만 다르다.
- 서비스는 쪽 하나에서 용법별 최빈 높이를 2–3개로 쓰는 곳이 48곳 중 40곳(83%)이고 4단계 2곳 · 5단계 1곳이다. 여덟 단계는 없다. 이 값은 쪽 하나 기준이라 실제 단계 수의 아래쪽이다.
- 버튼과 아이콘 버튼이 같은 높이(±1)인 곳은 38곳 중 12곳, ±4 안은 20곳이다. 버튼과 검색칸은 같은 높이 7곳 · ±4 안 16곳으로 검색칸이 버튼보다 큰 곳이 많다(검색 최빈 48 8곳 · 40 5곳, 버튼 최빈 32 10곳). 입력칸 · 검색칸 · 셀렉트끼리는 표본이 1–8곳이라 근거 약함.
- 앞선 기록(서비스 59곳)에서 버튼 최빈은 28–40이 가장 많았고 이번 쪽 단위 실측과 방향이 같다.

## 막힘 · 미확인

- 서비스 쪽 안 화면(필터 · 설정 · 대시보드)은 로그인 벽이라 못 열었다. 칩 · 메뉴 항목 · 셀렉트는 표본이 3–6곳이라 근거 약함.
- 토스 · 폴라리스 · Fluent · Spectrum 의 입력칸 · 검색칸 · 탭 높이는 미확인. Primer 입력은 예시 실측 30(안쪽 칸)이라 겉 상자 값은 미확인.
- 같은 서비스의 폰 폭은 이번에 안 쟀다(앞선 기록에 폰 390 있음).

## 공식 문서에서 읽은 값과 쪽(곳마다)

2026-11-26 headless 크롬으로 연 쪽의 본문 글을 읽은 값이다. 「출처에 없음」 은 그 쪽에 높이 px 가 없었다는 뜻이다.

### IBM Carbon(carbondesignsystem.com, 크기 표가 부품마다 있음)

| 부품          | 쪽                                   | 읽은 값(px)                                                                                                         |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 버튼          | components/button/style 「Size」     | xs 24 · sm 32 · md 40 · lg(productive) 48 · lg(expressive) 48 · xl 64 · 2xl 80. 「한 묶음에 다른 크기를 섞지 말라」 |
| 텍스트 입력   | components/text-input/style 「Size」 | xs 24 · sm 32 · md 40 · lg 48(유동 입력은 64)                                                                       |
| 검색          | components/search/style 「Size」     | xs 24 · sm 32 · md 40 · lg 48. 「한 레이아웃에서 같은 크기를 쓴다」                                                 |
| 드롭다운      | components/dropdown/style 「Size」   | 칸 · 메뉴 항목 모두 xs 24 · sm 32 · md 40 · lg 48                                                                   |
| 탭            | components/tabs/style 「Size」       | 줄 탭 sm 32 · md 40 · lg 48(글자 탭은 sm · md만), 칸 탭 sm 32 · md 40 · lg 48                                       |
| 콘텐츠 스위처 | components/content-switcher/style    | sm 32 · md 40 · lg 48                                                                                               |
| 쪽 번호       | components/pagination/style          | 컨테이너 · 아이콘 버튼 xs 24 · sm 32 · md 40 · lg 48(구조는 숫자 줄이 아니라 쪽 선택 + 이전 · 다음)                 |
| 메뉴          | components/menu/style                | 메뉴 항목 xs 24 · sm 32 · md 40 · lg 48                                                                             |
| 태그          | components/tag/style                 | sm 18 · md 24 · lg 32                                                                                               |
| 아코디언      | components/accordion/style           | 머리 sm 32 · md 40 · lg 48                                                                                          |
| 숫자 입력     | components/number-input/style        | 기본 칸 40                                                                                                          |
| UI 셸 머리    | components/UI-shell-header/style     | 높이 48                                                                                                             |
| 토글          | components/toggle/style              | 기본 높이 24                                                                                                        |
| 체크 상자     | components/checkbox/style            | 상자 16(줄 높이는 출처에 없음)                                                                                      |

출처에 없음: 아이콘 전용 버튼 크기 표 · 체크 줄 높이 · 파일 업로더 · 돌아가기 링크 · 배지 · 아바타.

### 당근 SEED(리포 `daangn-tokens.md` 1-25 부품 recipe 값, SEED 패키지 CSS 레시피를 옮긴 것)

action-button xsmall 32 · small 36 · medium 40(기본) · large 52 / toggle-button xsmall 32 · small 36 / text-input medium 40 · large 52(기본) / search-input 44 / tabs small 40(기본) · medium 44 / chip-tabs medium 36 · large 40 / chip small 32 · medium 36(기본) · large 40 / segmented-control 칸 최소 34 / checkbox medium 32(기본) · large 36 / switch 16 · 24 · 32 / checkmark medium 20 · large 24. 출처에 없음: 셀렉트 · 쪽 번호 · 메뉴 항목 높이(안쪽 값으로만 정해짐) · 접기 · 헤더. 기본 변형끼리 크기가 달라(버튼 40 · 입력 52 · 검색 44 · 탭 40 · 칩 36 · 체크 32) 줄이지 못한다.

### Material 3(m3.material.io 각 부품 specs 쪽)

텍스트 필드 컨테이너 56dp · 검색 막대 56dp · 탭 48dp(아이콘 + 글자 64dp) · 메뉴 목록 항목 48dp · 칩 32dp · 세그먼트 버튼 40dp(밀도로 한 단계씩 줄임) · 체크 상자 18dp(상태 층 40 · 목표 48) · 스위치 높이 32dp · 아이콘 버튼 목표 48dp · 대화상자 머리 56dp. 출처에 없음: 버튼 크기별 dp(표를 못 읽음) · 쪽 번호 · 셀렉트. 부품마다 값이 하나뿐이고 눈금 이름이 없다.

### GitHub Primer(primer.style, 크기 이름은 부품 쪽, px 는 primitives)

`--control-xsmall-size` 24 · `small` 28 · `medium` 32 · `large` 40 · `xlarge` 48(@primer/primitives size.css). 부품 쪽이 크기 이름만 적음: Button 「Medium(기본) 대부분 · Small 촘촘 · Large 강조에 아껴서」, IconButton size, TextInput · Select 「공간에 맞춰 크기」, SegmentedControl small · medium, ActionList 항목 small · medium · large. 출처에 없음: 탭(UnderlineNav) · 칩 · 체크 줄 · 쪽 번호 · 검색칸 높이.

### Mantine(@mantine/core 7.17.8 `styles.css`, unpkg 패키지 CSS, rem × 16)

버튼 xs 30 · sm 36(기본) · md 42 · lg 50 · xl 60, compact 22 · 26 · 30 · 34 · 40 / 입력(TextInput · Select · NumberInput) xs 30 · sm 36(기본) · md 42 · lg 50 · xl 60 / ActionIcon xs 18 · sm 22 · md 28(기본) · lg 34 · xl 44, 입력 크기에 맞춘 값(`ai-size-input`) 30 · 36 · 42 · 50 · 60 / 칩 xs 23 · sm 28(기본) · md 32 · lg 36 · xl 40 / 쪽 번호 칸 xs 22 · sm 26 · md 32(기본) · lg 38 · xl 44 / 체크 상자 16 · 20 · 24 · 30 · 36 / 스위치 높이 16 · 20(기본) · 24 · 30 · 36. 한 `size` 이름이 버튼 · 입력 · 셀렉트 · 칩 · 쪽 번호에 같이 닿는다. 출처에 없음: 탭 · 세그먼트 컨트롤 · 메뉴 항목 · 아코디언 높이(안쪽 값으로만 정해짐).

### 읽은 값 보강(2026-11-26 판 고침, 부품이 있는 줄은 문서 값으로 읽음)

- Carbon 데이터 표 쪽 「Size」: 줄 높이 xs 24 · sm 32 · md 40 · lg 48 · xl 64. 파일 업로더 쪽: sm 32 · md 40 · lg 48. 슬라이더 쪽: 손잡이 14(조작 높이 표 없음).
- SEED `@seed-design/css` 3.4.1 `recipes/*.css`(unpkg): select-trigger large 52 · medium 40 / input-button large 52 · medium 40 / pagination-page-item 40 / quantity-picker small 36 · medium 40 / badge medium 20 · large 24 / avatar 20 · 24 · 36 · 42 · 48 · 56 / side-navigation-menu-item 44 / app-bar 56 · 아이콘 버튼 44 · 글자 버튼 44 / action-button 아이콘 전용 min-width xsmall 32 · small 36 · medium 40 · large 52 / segmented-control root 안쪽 4 · 칸 최소 34 / menu-item · select-item small 안쪽 10 + 글줄 19, medium 안쪽 12 + 글줄 22 / accordion medium 안쪽 16 + 제목 줄 22 / list-item 안쪽 12 + 제목 줄 22 / slider 조작 높이 26 · 트랙 4 · 손잡이 20. 출처에 없음: 숫자 척도 · 작은 고르는 칸 · 고르기 행.
- Mantine 문서 데모 실측(mantine.dev/core/…): SegmentedControl 그릇 35.7 · 칸 27.7(기본 sm) / Tabs 줄 36 / Accordion control 48.8 / Slider 조작 16 · 트랙 8 · 손잡이 16 / Avatar md 38 / Badge md 20. 패키지 CSS: Menu 항목 안쪽 (xs ÷ 1.5) 10 · 12 + sm 글자 줄 1.55 → 약 35, Avatar xs 16 · sm 26 · md 38 · lg 56 · xl 84, Badge xs 16 · sm 18 · md 20 · lg 26 · xl 32.

### 읽지 못한 곳

Spectrum 2(react-spectrum.adobe.com/s2/…)는 부품 쪽 주소가 홈으로 넘어가 크기 표를 못 읽었다. Fluent 2 · Atlassian 문서 쪽에는 높이 px 표가 없었다(이름 compact · default · spacious 만).

### 판에서 쓰는 체계

혼자 놓인 주 버튼 52 이상의 큰 단계가 문서에 있는 체계만 쓴다. Carbon(xl 64) · SEED(large 52) · Mantine(xl 60)이 그렇고, Primer(large 40 · xlarge 48) · Material 3(버튼 dp 를 못 읽음) · Spectrum 2 · Fluent 2 · Atlassian(px 표 없음)은 못 썼다.
