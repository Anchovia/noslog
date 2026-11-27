# 「더 보기 · 모두 보기」 단추 꼴 — 가운데 글자 단추 대 폭 가득 (2026-11-28)

물음: 오락실 시설 「n개 모두 보기」 · 오락실 게임 「게임 더보기」 · 프로필 기록 「더 보기」 세 곳을 한 꼴로 묶을 때 가운데 글자 단추로 할지 폭 가득 고스트로 할지. 공통 층 4단계 판 g4 의 재료다. 추천은 판에 있고 이 기록에는 쓰지 않는다.

이미 있는 기록: [프로필 조사 2026-11-02 「긴 글 더 보기」](./2026-11-02-desktop-profile.md)는 글 잘림의 「더 보기」(글줄 끝 글자 링크 · 페이드 + 단추 · 모달)를 세었다. 목록을 이어 붙이는 「더 보기」 단추의 폭 · 꼴은 없어 이번에 새로 쟀다.

## 방법

- headless Playwright(Chromium) 다크 색 구성표, 폭 1440, 로그아웃. 서비스 목록 쪽 약 180곳을 열어 7번 아래로 굴리고, 「Load more · Show more · View more · See more · 더보기 · 전체 보기」 꼴 글자가 든 `button` · `a` 를 DOM 으로 잡아 크기 · 모서리 · 면 · 선 · 글자를 쟀다.
- 후보 42곳과 4곳을 다시 열어 단추 둘레를 캡처하고 직접 열어 보았다. 구역 제목 줄 오른쪽 「모두 보기 ›」 링크(CNET · GameRant · How-To Geek · MakeUseOf · ScreenRant · TheGamer · PC Gamer · Eater 등) · 바닥글 링크 · 로그인 창이 가린 곳(LinkedIn) · 캡처에 단추가 없는 곳(Goodreads · osu! · Steam 후기 · Gymshark · TechCrunch)은 세지 않았다.
- 한계: 목록 한 번 이어 붙인 뒤 모양(로딩 중 · 끝)은 보지 않았다. 아무것도 누르지 않았다.

## 실제 서비스 30곳

값은 단추 요소의 px 다. 「폭」 은 목록 · 묶음 폭 대비다. 다크를 받지 않는 사이트는 밝은 화면으로 쟀다.

폭 가득(단추 폭이 목록 폭과 같음) 4곳

| 서비스             | 단추       | 높이 | 모서리 | 면 · 선   | 글자   |
| ------------------ | ---------- | ---- | ------ | --------- | ------ |
| TMDB 영화 목록     | Load More  | 50   | 0      | 면 채움   | 16/600 |
| Android Authority  | Load more  | 50   | 2      | 면 채움   | 16/600 |
| GitHub 주제 쪽     | Load more… | 34   | 6      | 1px 선    | 12/600 |
| 당근 동네생활 카드 | 더보기 〉  | 55   | 0      | 위 1px 선 | 16/400 |

가운데에 글 폭만큼 놓인 면 · 선 단추 9곳

| 서비스          | 단추             | 폭 × 높이 | 모서리       | 면 · 선        |
| --------------- | ---------------- | --------- | ------------ | -------------- |
| Ars Technica    | LOAD MORE        | 224 × 36  | 2            | 2px 선         |
| Discord 블로그  | Load More        | 130 × 46  | 12           | 흰 면 + 1px 선 |
| Vercel 블로그   | Show more posts  | 150 × 36  | 끝까지 둥긂  | 어두운 면      |
| Rotten Tomatoes | LOAD MORE        | 106 × 40  | 4            | 파란 면        |
| Stripe 블로그   | View all posts › | 138 × 33  | 16.5(끝까지) | 어두운 면      |
| The Verge       | MORE STORIES     | 135 × 40  | 1            | 1px 선         |
| GamesRadar      | VIEW ALL VIDEOS  | 450 × 60  | 끝까지 둥긂  | 선             |
| Hostelworld     | View more →      | 157 × 48  | 끝까지 둥긂  | 선             |
| VG247           | SEE MORE REVIEWS | 246 × 50  | 0            | 선(왼쪽 정렬)  |

목록 안 작은 알약 3곳: Pinterest 「See more」 103 × 48(모서리 16 · 회색 면 · 12/400) · 치지직 「더보기」 67 × 25(모서리 13 · 1px 선 · 12/700, 사이드 목록) · Steam 상점 「See More」 90 × 26(모서리 2 · 옅은 면 · 14).

면 없는 글자 링크 7곳: Hacker News 「More」(13) · OKKY 「더 보기」(14/500, 오른쪽) · Polygon 「MORE ↓」(16/700) · Wanderlog 「See more reviews」(가운데 굵은 글) · Tving 「더보기」(14.85) · 네이버 웹툰 「더보기」(15/500) · 라프텔 「더보기」(13.4/700).

레일 안 접는 목록의 글자 단추 7곳: Docker Hub 「Show more」(103 × 28 · 12.25/500) · Metacritic 「Show More」(14/700) · Modrinth 「Show more」(266 × 28) · Kick 「Show More」(88 × 32 · 모서리 8 · 14/600) · SOOP 「See More」 · Artifact Hub 「Show more...」(14/400) · GOG 「Show all tags」(88 × 32 · 14).

## 합계

- 목록을 잇는 단추 형태: 폭 가득 4 · 가운데 글 폭 면 · 선 단추 9 · 작은 알약 3 · 면 없는 글자 링크 7 · 레일 안 글자 단추 7. 가운데 둔 단추(면 · 선 · 알약) 12곳 대 폭 가득 4곳.
- 모서리: 가운데 단추 12곳 중 끝까지 둥긂(알약) 5 · 0–6 5 · 12–16 2. 폭 가득 4곳은 0–6.
- 높이: 가운데 단추 25–60(가운데값 40), 폭 가득 34–55.

## 디자인 시스템

공식 문서를 열어 읽었다. 단추 값이 있는 곳은 3곳이다.

- Ant Design List `loadMore` 데모: 가운데 보조 버튼, 높이 32 · 모서리 6 · 1px 선 · 폭 글 폭(122).
- Mantine Spoiler: `showLabel="Show more"`, 면 없는 글자 단추(높이 24).
- Atlassian Pagination 예시: 「SHOW MORE」 줄 높이 32 · 폭 658(카드 폭 가득) · 아래 모서리 4.
- Carbon Loading 패턴: 「Load more」 항목으로 일부만 보이는 목록을 늘린다는 원문, 단추 값은 없음.
- Spectrum ListView · CardView: `onLoadMore` 무한 스크롤, 단추 규격 없음.
- GOV.UK Details: 「더 보기」 를 쪽 이동으로 오해해 누르지 않는 사람이 있다는 원문.
- 열었으나 규격 없음(미확인): Material 3 · Polaris · Primer · SEED · Fluent · Chakra · Cloudscape · PatternFly · USWDS. NN/g 글은 404.

원자료와 캡처는 리포 밖 공유 노트 폴더 `common-layer/stage5/stage4-left/g4-heading/data/` 에 있다.
