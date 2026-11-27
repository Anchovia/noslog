# 왼쪽 레일 폭 — 악곡 목록 필터 · 서열표 급 칸 · 검정 레일 (2026-11-27)

물음: 악곡 목록 필터 · 서열표 급 칸 · 검정 레일이 함께 쓰는 왼쪽 레일을 몇 px 로 할까. 공통 층 5단계 판 2의 재료다. 추천은 판에 있고 이 기록에는 쓰지 않는다.

이미 있는 기록은 다시 재지 않았다: [악곡 데스크톱 조사(2026-11-02)](./2026-11-02-desktop-music.md)는 왼쪽 레일이 있는 곳을 세었지만 레일 폭 px 는 재지 않았다. [사이드바 폭(2026-11-25)](./2026-11-25-sidebar-width-current.md)는 문서 사이드를 쟀고 필터 레일은 아니다. 이 기록은 필터 · 분류 레일 폭을 새로 쟀다.

## 방법

- headless Playwright(Chromium), 다크 색 구성표, 폭 1920 기준에 1440 · 1280 · 1100, 로그아웃. 아무것도 누르지 않았다.
- 레일 요소를 DOM 으로 잡아(조작 3개 이상 · 폭 150–520 · 높이 280 이상 · 쪽 왼쪽) 가로 폭을 폭마다 쟀다. 잡지 못한 곳은 레일 맨 위 글(예 「Filter by」)로 잡았다. 1920 에서 레일에 빨간 테두리를 그려 캡처를 시트로 직접 열어 레일이 맞는 곳만 셌다.
- 세지 않은 곳: 막힘(403 · 429 · 캡차) 65곳, 레일이 필터가 아니거나 못 찾았거나 쿠키 창 · 팝업이 가린 59곳(쿠키 창이 가린 Nike · Chocolatey · Thomann, 팝업이 겹친 Yes24, 오버레이 서랍인 instant-gaming, 사이트 메뉴인 Rawg · Ansible Galaxy · VNDB, 404 쪽 Andertons, 테두리를 확인 못 한 Ultimate Guitar 포함). 측정 시도는 같은 사이트 다른 주소를 빼고 156곳이다.
- 한계: 레일과 결과 사이 간격은 레일 안 여백이 섞여 믿을 수 없어 싣지 않았다(미확인). 쪽 하나씩만 봤고 로그인 뒤 화면은 보지 않았다.
- 원자료와 캡처는 리포 밖 공유 노트 폴더 `common-layer/stage5/board-2/`(rail-valid.json · rail-N.json · rail2-N.json · shots/r-이름.png)에 있다.

## 실제 서비스 32곳

칸은 레일 요소의 가로 폭(px). 「숨김·없음」 은 그 폭에서 레일이 화면에 없다. 다크를 받지 않는 사이트는 밝은 화면으로 쟀다.

| 서비스                                     | 1920 | 1440 | 1280 | 1100      | 주소                                                                   |
| ------------------------------------------ | ---- | ---- | ---- | --------- | ---------------------------------------------------------------------- |
| 교보문고                                   | 176  | 176  | 176  | 176       | product.kyobobook.co.kr/bestseller/online?period=001                   |
| pub.dev                                    | 200  | 200  | 200  | 200       | pub.dev/packages                                                       |
| Rakuten                                    | 207  | 207  | 207  | 207       | search.rakuten.co.jp/search/mall/%E3%83%94%E3%82%A2%E3%83%8E/          |
| 29CM                                       | 220  | 220  | 220  | 220       | www.29cm.co.kr/store/category/list?categoryLargeCode=272100100&page=1  |
| Eneba                                      | 220  | 220  | 220  | 220       | www.eneba.com/store/all                                                |
| 가격.com                                   | 220  | 220  | 220  | 220       | kakaku.com/pc/note-pc/itemlist.aspx                                    |
| 마켓컬리                                   | 220  | 220  | 220  | 220       | www.kurly.com/collections/market-best                                  |
| Docker Hub                                 | 224  | 224  | 224  | 224       | hub.docker.com/search?q=nginx&type=image                               |
| 알라딘 (테두리 230 · CSS .browse-left 200) | 230  | 230  | 230  | 230       | www.aladin.co.kr/shop/wbrowse.aspx?BrowseTarget=List&ViewRowsCount=25& |
| Zappos                                     | 234  | 234  | 234  | 234       | www.zappos.com/men-sneakers-athletic-shoes                             |
| Artifact Hub                               | 242  | 242  | 177  | 177       | artifacthub.io/packages/search?sort=relevance&page=1                   |
| 당근알바 검색 (1100 에서 168)              | 242  | 242  | 242  | 168       | jobs.daangn.com/s?regionId=211&referrer=daangn_web&referrer_context=da |
| TMDB                                       | 260  | 260  | 260  | 260       | www.themoviedb.org/movie                                               |
| itch.io                                    | 260  | 260  | 260  | 260       | itch.io/games/tag-rhythm                                               |
| Xbox                                       | 272  | 272  | 272  | 272       | www.xbox.com/en-US/games/browse                                        |
| GOG                                        | 274  | 274  | 274  | 255       | www.gog.com/en/games                                                   |
| GitHub 검색                                | 280  | 280  | 280  | 280       | github.com/search?q=rhythm+game&type=repositories                      |
| Grafana 플러그인                           | 280  | 280  | 280  | 280       | grafana.com/grafana/plugins/all-plugins/                               |
| NuGet                                      | 285  | 285  | 285  | 235       | www.nuget.org/packages?q=json                                          |
| Amazon                                     | 291  | 274  | 242  | 260       | www.amazon.com/s?k=digital+piano                                       |
| Modrinth                                   | 300  | 300  | 300  | 300       | modrinth.com/mods                                                      |
| Thunderstore                               | 302  | 302  | 302  | 302       | thunderstore.io/package/                                               |
| Terraform Registry                         | 303  | 303  | 255  | 207       | registry.terraform.io/browse/providers                                 |
| Zenodo                                     | 309  | 316  | 316  | 숨김·없음 | www.zenodo.org/search?q=rhythm                                         |
| GamersGate                                 | 310  | 310  | 310  | 310       | www.gamersgate.com/games/                                              |
| Google Fonts                               | 320  | 320  | 320  | 320       | fonts.google.com/                                                      |
| Metacritic                                 | 321  | 321  | 301  | 숨김·없음 | www.metacritic.com/browse/game/                                        |
| Nintendo                                   | 330  | 330  | 330  | 330       | www.nintendo.com/us/search/#cat=gme&sort=df                            |
| Fanatical                                  | 339  | 287  | 287  | 323       | www.fanatical.com/en/search                                            |
| Best Buy                                   | 351  | 336  | 296  | 275       | www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=headphones&intl=no |
| Hugging Face                               | 434  | 400  | 395  | 382       | huggingface.co/models                                                  |
| Firefox 부가기능                           | 461  | 461  | 431  | 368       | addons.mozilla.org/en-US/firefox/search/?q=dark                        |

분포(1920): 239 이하 10곳 · 240–259 2곳 · 260–279 4곳 · 280–299 4곳 · 300–319 5곳 · 320–339 4곳 · 340 이상 3곳. 모든 폭에서 같은 값(고정) 20곳 · 1280 이상은 같고 1100 에서 달라짐 3곳 · 폭마다 다름 9곳. CSS 비율이 확인된 곳은 Fanatical(25%, 뷰포트 1200 이상)과 Zenodo(25%, 1920 이상은 18.75%)이다.

## 디자인 시스템 6곳 (필터 전용 레일 폭 규격은 0곳)

| DS         | 읽은 값                                                                                                                                                                                                                                                                                                                                                                                                   | 출처                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 당근 SEED  | 필터 레일 규격 없음. 당근 공개 웹 18곳 중 목록 화면 4곳(중고거래 · 중고차 · 알바 · 부동산)을 열어 보니 필터 왼쪽 레일은 당근알바 검색 1곳(242, 1100 에서 168), 중고거래 · 중고차는 「필터」 단추와 오른쪽 인기 검색, 부동산은 사이트 메뉴 사이드. Side Panel 480 · 720 · 960(오버레이). 레이아웃 12열 · gutter 24 · 최대 폭 1040(기본) · 1280(커머스 검색). 안쪽 1152 에서 3칸은 270. Side Navigation 240 | seed-design.io/llms/components/side-panel.txt · foundations/layout.txt           |
| IBM Carbon | UI shell 왼쪽 패널 256(내비). 필터 패턴은 왼쪽 세로 배치만 말하고 폭 없음                                                                                                                                                                                                                                                                                                                                 | carbondesignsystem.com/components/UI-shell-left-panel/style · patterns/filtering |
| Material 3 | Side sheet 최대 폭 400dp                                                                                                                                                                                                                                                                                                                                                                                  | m3.material.io/components/side-sheets/specs                                      |
| Atlassian  | SideNav 기본 320(최소 240), Panel 기본 365(오른쪽)                                                                                                                                                                                                                                                                                                                                                        | atlassian.design/components/navigation-system/layout                             |
| Ant Design | Layout Sider 기본 200                                                                                                                                                                                                                                                                                                                                                                                     | ant.design/components/layout                                                     |
| GOV.UK     | 격자 one-quarter 25%(필터 패턴 문서는 404, 필터에 쓰는 폭은 미확인)                                                                                                                                                                                                                                                                                                                                       | design-system.service.gov.uk/styles/layout                                       |

읽었지만 값을 못 찾은 곳: Primer PageLayout(예시값만) · Fluent 2 Drawer(small · medium · large 이름만) · PatternFly · Salesforce Lightning · Polaris(필터가 위 줄).

## NosLog 레일 지금 값과 긴 글자

- 지금 코드: 악곡 · 서열표 · 검정 세 화면 모두 열 격자 1/4 식 `calc((100% - 3 * 16px) / 4)` 이다. 개발 서버(localhost:3000, 폭 1920)에서 레일 x 384 · 폭 276, 악곡 결과 열 x 684 · 폭 852(사이 24)로 쟀다(ko · en · ja 모두 같다).
- Figma 결정본 사본(stage-base 02-악곡-목록 사본 1640:302): 그림 픽셀로 잰 레일 300 · 사이 12 · 결과 840. INVENTORY 메타데이터 값은 300 · 24 · 828 이고 사본 그림과 사이가 12 다르다. Figma 파일은 읽지 못해(세션 만들기 거절) 다시 확인하지 못했다.
- 레일 폭만 240 · 260 · 272 · 276 · 288 · 300 · 320 으로 바꿔 모든 글줄이 한 줄인지 쟀다. 악곡 필터 17줄 · 서열표 56줄 · 검정 Basic 10줄 · 검정 Event 8줄(ko · en · ja)이 모든 폭에서 꺾이지 않았다. 폭 200 · 220 · 230 · 240 도 재 보았다. 일본어 악곡 필터 「自分の記録」 만 200 · 220 에서 두 줄이 되고 230 부터는 모두 한 줄이다. 가장 긴 줄은 악곡 「로그인하고 고르기」 · 서열표 「Normal / Hard / Expert」 · 검정 「Virtuosity 2024 RECITAL」. 로그인 뒤에만 보이는 「내 기록」 세부 항목은 못 쟀다.
