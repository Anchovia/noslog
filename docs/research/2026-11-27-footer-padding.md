# 푸터 위아래 안쪽 — 짧은 푸터 실측 (2026-11-27)

물음: 푸터 면의 위아래 안쪽을 몇 px 로 할까(지금 코드 16 · Figma 결정본 48 · 당근 기준선 48). 공통 층 5단계 판 5의 재료다. 추천은 판에 있고 이 기록에는 값만 남긴다.

이미 있는 기록은 다시 재지 않았다: [spacing-scale 2026-11-17](./2026-11-17-spacing-scale.md)의 「푸터 위 padding」 열(8곳을 아래 표로 인용). 아래 안쪽은 기록에 없어 미확인이다.

## 방법

- headless Playwright(Chromium), 다크 색 구성표, 폭 1920 과 1440, 로그아웃, 아무것도 누르지 않음. 끝까지 스크롤해 게으른 푸터를 띄웠다.
- 푸터 요소는 `footer` · `role=contentinfo` · 클래스에 footer 가 든 요소 가운데 쪽 맨 아래에 붙은 가장 큰 것으로 잡고, 없으면 「© · 이용약관 · 개인정보 · Privacy」 글이 든 맨 아래 상자로 잡았다. 당근은 폭 280 이상 `footer` 로 따로 잡았다.
- 잰 값: 푸터 높이, 계산값 padding, 글 줄 수(글 상자 가로줄 수), 푸터 요소 캡처의 「글 위 · 아래 거리」(요소 이미지에서 가로 픽셀이 두 곳 넘게 바뀌는 첫 · 마지막 줄까지, 글 잉크 기준이라 padding 보다 3–5 큼).
- 센 곳: 글 상자 기준 거리와 이미지 기준 거리가 위 · 아래 모두 6 이내로 맞는 곳. 안 맞는 곳(GitLab · Discord · Wikipedia · Naver · Kakao · Bandcamp · eslint · Go · Mantine 등)은 푸터 요소가 면과 달라 세지 않았다. 푸터가 아닌 요소를 잡은 Toss(높이 22) · 클리앙(위 309, 큰 빈 영역) · Supabase(위 2)와 당근 쪽 안의 개인정보처리방침 · SEED 문서 배너도 뺐다.
- 막힘 403 16곳(뽐뿌 · OP.GG · thisisgame · 리디 · Stack Overflow · IGDB · Fandom · VGMDB · RYM · BGG · Dotabuff · GameFAQs · 오늘의집 · 원티드 · 우아한형제들 · PCGamingWiki)과 푸터를 못 찾은 곳(Toss · Reddit · Stripe · Prisma · Next.js · Hacker News · Lobsters · BeatSaver · ScoreSaber 등)은 세지 않았다.
- 한계: 쪽 하나씩만 봤다. 캡처는 뷰포트 아래쪽(`shots/이름-1920.png`)이라 푸터가 일부 겹쳐 보일 수 있다. 면이 쪽 바탕과 같은 푸터는 「padding 없음」 인 곳이 많고 거리는 안쪽 상자가 만든다.
- 원자료와 캡처는 리포 밖 공유 노트 폴더 `common-layer/stage5/board-5/`(all-footers.json · daangn-footers.json · ds-footers.json · valid-services.json · shots/)에 있다. 스크립트는 `scripts/measure3.cjs` · `scripts/daangn.cjs` · `scripts/ds.cjs`.

## 실제 서비스 새로 잰 22곳

글 위 거리 순. 줄 1–2줄은 짧은 푸터(osu! · BeatLeader · Hono · shadcn/ui · IsThereAnyDeal · GitHub), 3줄 이상은 사이트 지도형이다. 폭 1440 에서 푸터 높이는 Node.js(185 → 205)만 달랐다.

| 서비스            | 푸터 높이 | 글 위 / 아래 거리 | padding 위 / 아래 | 줄 수 | 주소                                     | 캡처                      |
| ----------------- | --------- | ----------------- | ----------------- | ----- | ---------------------------------------- | ------------------------- |
| 지니뮤직          | 213       | 11 / 44           | 없음              | 5     | www.genie.co.kr/                         | `genie-1920.png`          |
| osu!              | 50        | 11 / 11           | 10 / 5            | 2     | osu.ppy.sh/rankings/osu/performance      | `osu-1920.png`            |
| 멜론              | 204       | 18 / 54           | 없음              | 4     | www.melon.com/                           | `melon-1920.png`          |
| 넥슨              | 259       | 18 / 23           | 없음              | 4     | www.nexon.com/main/ko                    | `nexon-1920.png`          |
| BeatLeader        | 50        | 19 / 19           | 없음              | 1     | beatleader.com/                          | `beatleader-1920.png`     |
| Node.js           | 185       | 21 / 29           | 20 / 20           | 4     | nodejs.org/en                            | `nodejs-1920.png`         |
| Python.org        | 661       | 29 / 20           | 없음              | 20    | www.python.org/                          | `python-1920.png`         |
| ProtonDB          | 189       | 34 / 50           | 16 / 32           | 4     | www.protondb.com/                        | `protondb-1920.png`       |
| Hono              | 113       | 39 / 36           | 32 / 32           | 2     | hono.dev/                                | `hono-1920.png`           |
| Steam             | 262       | 41 / 43           | 40 / 40           | 9     | store.steampowered.com/charts/mostplayed | `steam-1920.png`          |
| Rust              | 481       | 42 / 35           | 30 / 30           | 9     | www.rust-lang.org/                       | `rust-1920.png`           |
| shadcn/ui         | 96        | 44 / 38           | 없음              | 1     | ui.shadcn.com/                           | `shadcn-1920.png`         |
| IsThereAnyDeal    | 190       | 46 / 71           | 15 / 70           | 2     | isthereanydeal.com/                      | `isthereanydeal-1920.png` |
| 프로그래머스      | 424       | 48 / 50           | 없음              | 12    | programmers.co.kr/                       | `programmers-1920.png`    |
| GitHub            | 114       | 49 / 42           | 48 / 40           | 1     | github.com/trending                      | `github-1920.png`         |
| Astro             | 430       | 50 / 45           | 없음              | 11    | astro.build/                             | `astro-1920.png`          |
| Linear            | 524       | 57 / 59           | 없음              | 11    | linear.app/                              | `linear-1920.png`         |
| Vercel            | 846       | 57 / 44           | 40 / 40           | 23    | vercel.com/templates                     | `vercel-1920.png`         |
| 카카오 테크블로그 | 447       | 60 / 58           | 없음              | 10    | tech.kakao.com/                          | `kakaoTech-1920.png`      |
| TanStack          | 541       | 65 / 73           | 없음              | 11    | tanstack.com/query/latest                | `tanstack-1920.png`       |
| Bun               | 385       | 66 / 27           | 없음              | 11    | bun.sh/                                  | `bun-1920.png`            |
| pnpm              | 448       | 66 / 68           | 64 / 64           | 8     | pnpm.io/                                 | `pnpm-1920.png`           |

글 위 거리 분포: 24 이하 6곳 · 25–39 3곳 · 40–47 4곳 · 48–55 3곳 · 56–79 6곳. 11 부터 66 까지 퍼져 몰린 값이 없다. 짧은 푸터 6곳은 11 · 19 · 39 · 44 · 46 · 49.

## 당근 푸터 쪽마다

판 1 에서 본 당근 쪽(`board-1/daangn.json`)의 푸터를 같은 법으로 다시 쟀다. 폭 1920, padding 위아래는 1440 에서도 같다.

| 쪽               | 주소                           | 푸터 높이 | padding 위 / 아래 | 글 위 / 아래 거리         | 캡처                        |
| ---------------- | ------------------------------ | --------- | ----------------- | ------------------------- | --------------------------- |
| 당근 홈          | www.daangn.com/kr/             | 1020      | 48 / 48(.cl0mu0)  | 0 / 48(바탕이 그라데이션) | `dg-당근_홈-1920.png`       |
| 당근 중고거래    | www.daangn.com/kr/buy-sell/    | 761       | 48 / 48           | 48 / 48                   | `dg-당근_중고거래-1920.png` |
| 당근 중고차      | www.daangn.com/kr/cars/        | 761       | 48 / 48           | 48 / 48                   | `dg-당근_중고차-1920.png`   |
| 당근 알바        | jobs.daangn.com/               | 232       | 24 / 40           | 24 / 44                   | `dg-당근_알바-1920.png`     |
| 당근 부동산      | realty.daangn.com/             | 107       | 20 / 20           | 24 / 24                   | `dg-당근_부동산-1920.png`   |
| 당근 비즈니스    | business.daangn.com/           | 297       | 64 / 64           | 67 / 69                   | `dg-당근_비즈니스-1920.png` |
| 어바웃 당근      | about.daangn.com/              | 286       | 70 / 96           | 75 / 99                   | `dg-어바웃_당근-1920.png`   |
| 당근 고객센터    | cs.kr.karrotmarket.com/wv/faqs | 385       | 40 / 40           | 43 / 44                   | `dg-당근_고객센터-1920.png` |
| SEED 문서 사이트 | seed-design.io/                | 993       | 48 / 48           | 0 / 48(바탕이 그라데이션) | `dg-SEED_문서-1920.png`     |

당근 모임 쪽은 푸터를 못 찾아 세지 않았다. 결론: 48 은 www.daangn.com 세 쪽과 SEED 문서 사이트만이고 쪽마다 같지 않다. SEED Footer 문서(`seed-design.io/llms/components/footer.txt`)에는 px 규격이 없다. 구성 블록 · 조합 4종(비즈프로필 · 당근비즈니스 · 어바웃당근 · 당근닷컴) · 반응형 줄 바꿈만 있다.

## 기록에서 인용한 위 안쪽 8곳

[2026-11-17-spacing-scale](./2026-11-17-spacing-scale.md) 「푸터 위 padding」: 토스증권 32 · 치지직 25 · OP.GG 96 · Tracker.gg 32 · Wikipedia 12 · 토스피드 50 · 카카오페이지 35 · 리디 41. 아래 안쪽은 미확인.

## 디자인 시스템 7곳

| 디자인 시스템            | 주소                                        | 값                                                               | 위 / 아래 |
| ------------------------ | ------------------------------------------- | ---------------------------------------------------------------- | --------- |
| SEED Footer              | seed-design.io/docs/components/footer       | px 규격 없음, 조합 그림만                                        | 없음      |
| Ant Design Layout.Footer | ant.design/components/layout                | padding 24 50                                                    | 24 / 24   |
| GOV.UK Footer            | design-system.service.gov.uk                | padding 40 0 25(디자인 시스템 사이트의 같은 .govuk-footer, 1440) | 40 / 25   |
| USWDS footer             | designsystem.digital.gov/components/footer/ | 보조 구역 padding 20 0                                           | 20 / 20   |
| Bulma .footer            | bulma.io/documentation/layout/footer/       | padding 48 24 96                                                 | 48 / 96   |
| DaisyUI footer           | daisyui.com/components/footer/              | p-10                                                             | 40 / 40   |
| Bootstrap 푸터 예시      | getbootstrap.com/docs/5.3/examples/footers/ | py-3(예시 템플릿)                                                | 16 / 16   |

푸터 부품 문서가 없는 곳: Carbon · Atlassian · Material 3 · Spectrum(부품 주소 404), Primer(푸터 부품 페이지 비어 있음), Polaris · Fluent 2(문서 사이트 자체 푸터뿐).

## 표본 수

실제 서비스 31곳(새로 잰 23곳 = 당근 1곳 + 위 22곳, 기록 인용 8곳은 위 안쪽만), 디자인 시스템 7곳(px 값 있는 6곳). 짧은 푸터(1–2줄)는 6곳이라 짧은 푸터만 따로 보면 근거 약함.
