# B2 사이드바 폭 · 사이드 메뉴 지금 쪽 표시 실측 기록 (2026-11-25)

잰 방법: headless Playwright, 폭 1920, colorScheme dark, 페이지마다 wait-capacity.sh, 브라우저 하나에 페이지 하나. 로그인 · 저장 · 동의를 누르지 않음. 로그인 뒤 설정 화면은 보지 않았고 문서 · 메뉴 사이드로 대신함(설정 사이드는 로그인 뒤라 공개 쪽에서 못 봄).
원자료와 캡처는 리포 밖 공유 노트 폴더 `common-layer/stage4/B/B2-rows/`(real/measure.json · real/measure2.json · real/classified.json · shots/side-이름.png · shots/act-이름.png)에 있다. 캡처 시트를 직접 열어 분류를 확인함.

## 실제 서비스 37곳(다크)

칸 폭 = 사이드 열 전체 폭, 줄 폭 = 링크 줄들의 가로 범위. 칸 폭 분포는 Prisma · MongoDB(열이 두 겹) · Angular · Svelte 를 뺀 33곳.

| 서비스      | 지금 쪽 표시   | 칸 폭  | 줄 폭  | 캡처                                           |
| ----------- | -------------- | ------ | ------ | ---------------------------------------------- |
| astro       | 면             | 299    | 263    | `side-astro.png` · `act-astro.png`             |
| clerk       | 면             | 282    | 266    | `side-clerk.png` · `act-clerk.png`             |
| cloudflare  | 면             | 300    | 267    | `side-cloudflare.png`                          |
| msft-learn  | 면             | 295    | 271    | `side-msft-learn.png` · `act-msft-learn.png`   |
| nextjs      | 면             | 300    | 264    | `side-nextjs.png` · `act-nextjs.png`           |
| prisma      | 면             | 452    | 220    | `side-prisma.png` · `act-prisma.png`           |
| resend      | 면             | 264    | 240    | `side-resend.png` · `act-resend.png`           |
| shadcn      | 면             | 288    | 103    | `side-shadcn.png` · `act-shadcn.png`           |
| tauri       | 면             | 284    | 235    | `side-tauri.png` · `act-tauri.png`             |
| vercel-docs | 면             | 300    | 272    | `side-vercel-docs.png` · `act-vercel-docs.png` |
| anthropic   | 면             | 264    | 247    | `side-anthropic.png`                           |
| fastapi     | 면             | 266    | 244    | `side-fastapi.png` · `act-fastapi.png`         |
| bootstrap   | 면             | 212    | 143    | `side-bootstrap.png` · `act-bootstrap.png`     |
| railway     | 면             | 300    | 275    | `side-railway.png` · `act-railway.png`         |
| react       | 면             | 336    | 316    | `side-react.png` · `act-react.png`             |
| twilio      | 면             | 240    | 200    | `side-twilio.png` · `act-twilio.png`           |
| mongodb     | 면             | 426    | 426    | `side-mongodb.png` · `act-mongodb.png`         |
| zed         | 면             | 280    | 247    | `side-zed.png` · `act-zed.png`                 |
| huggingface | 면             | 300    | 259    | `side-huggingface.png`                         |
| github-docs | 면 + 왼쪽 막대 | 326    | 285    | `side-github-docs.png` · `act-github-docs.png` |
| gitlab      | 면 + 왼쪽 막대 | 272    | 256    | `side-gitlab.png` · `act-gitlab.png`           |
| shopify-dev | 면 + 왼쪽 막대 | 284    | 244    | `side-shopify-dev.png` · `act-shopify-dev.png` |
| mui         | 면 + 왼쪽 막대 | 300    | 279    | `side-mui.png` · `act-mui.png`                 |
| mdn         | 면 + 왼쪽 막대 | 297    | 233    | `side-mdn.png`                                 |
| angular     | 왼쪽 막대만    | 미측정 | 미측정 | `side-angular.png`                             |
| tailwind    | 왼쪽 막대만    | 240    | 231    | `side-tailwind.png` · `act-tailwind.png`       |
| typescript  | 왼쪽 막대만    | 256    | 264    | `side-typescript.png` · `act-typescript.png`   |
| bun         | 왼쪽 막대만    | 288    | 231    | `side-bun.png` · `act-bun.png`                 |
| laravel     | 왼쪽 막대만    | 288    | 288    | `side-laravel.png` · `act-laravel.png`         |
| terraform   | 윤곽선         | 320    | 288    | `side-terraform.png` · `act-terraform.png`     |
| supabase    | 글자만         | 345    | 264    | `side-supabase.png` · `act-supabase.png`       |
| vite        | 글자만         | 272    | 208    | `side-vite.png` · `act-vite.png`               |
| discord-dev | 글자만         | 319    | 259    | `side-discord-dev.png` · `act-discord-dev.png` |
| rustbook    | 글자만         | 300    | 280    | `side-rustbook.png` · `act-rustbook.png`       |
| svelte      | 글자만         | 미측정 | 미측정 | `side-svelte.png`                              |
| linear-docs | 글자만         | 280    | 251    | `side-linear-docs.png` · `act-linear-docs.png` |
| nodejs      | 글자만         | 234    | 234    | `side-nodejs.png` · `act-nodejs.png`           |

분포(칸 폭 34곳): 248 이하 4 · 249~280 8 · 281~299 9 · 300 이상 12. 240±8 안 3곳(Twilio 240 · Tailwind 240 · Node.js 234), 272±8 안 7곳(GitLab 272 · Vite 272 · Resend 264 · Anthropic 264 · FastAPI 266 · Zed 280 · Linear 280).
지금 쪽 표시(37곳): 면 19 · 면 + 왼쪽 막대 5 · 왼쪽 막대만 5 · 윤곽선 1 · 글자만 7 · 반전 면 0. 면 19곳 가운데 무채 면 11, 색 틴트 면 8.

## 디자인 시스템 6곳

| 이름                          | 폭                    | 지금 쪽 표시                               | 출처                                                                |
| ----------------------------- | --------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| SEED side-navigation          | 240(접으면 56)        | 면(bg-transparent-selected, 항목 44 · r10) | 스타일 시트 recipes/side-navigation.css 의 width 240 · data-current |
| Material 3 navigation drawer  | 360(활성 표시 폭 336) | 면(활성 알약)                              | m3.material.io 규격 쪽 「Container width 360dp」                    |
| Ant Design Layout Sider       | 200(기본값)           | 면(다크 itemSelectedBg)                    | ant.design/components/layout API 표 width 200, menu 토큰 표         |
| IBM Carbon UI shell 왼쪽 패널 | 256(16rem)            | 면 + 선택 테두리                           | 규격 쪽 width 256 / 16, 토큰 표 Selected · Selected border          |
| Fluent 2 Nav                  | 260                   | 막대 + 굵은 글자(면 없음)                  | 사용 쪽 「260 pixels wide」, 규격 그림(캡처 열어 확인)              |
| Primer NavList                | 폭 미확인             | 면 + 왼쪽 막대                             | primer.style 쪽 실제 NavList 그림(캡처 열어 확인)                   |

폭을 확인한 디자인 시스템은 5곳(SEED · Material 3 · Ant Design · Carbon · Fluent 2), 지금 쪽 표시를 확인한 곳은 6곳.

## 세지 않은 곳

- 라이트 화면: Stripe · Django · Kubernetes · Grafana · Notion · npm · Redis · Slack · 카카오 개발자 · 토스페이먼츠 · PostHog · Flutter · Wikipedia(다크 요청에도 라이트로 나옴)
- 캡차 · 접속 막힘: Discord 지원 · OpenAI · NCloud · Spotify 지원 · Figma 도움말(사이드 없음)
- 사이드를 찾지 못함: Docker · PostgreSQL · Python 문서(현재 쪽 표시 없음) · Drizzle · Netlify · Obsidian · Cursor · TanStack · Radix
- 캡처에 지금 쪽 줄이 없거나 팝업이 덮음: Vue(안내 말풍선이 덮음) · Sentry · Remix
- 확인 못 함: MUI Drawer 폭, Atlassian · Polaris 규격(쪽이 비어 열림)

## 5단계 판 1 추가 실측: 사이드 폭 후보와 본문 옆 자리 (2026-11-27)

잰 방법은 위와 같다(headless Playwright, 폭 1920, dark, wait-capacity.sh, 브라우저 하나에 페이지 하나). 위 표의 서비스는 칸 폭을 다시 재지 않고 그 값을 썼고, 사이드 오른쪽 끝에서 본문 첫 문단 왼쪽 끝까지(사이)와 본문 글 폭만 새로 쟀다. 사이는 본문 그릇의 바깥 여백을 포함하므로 열 사이 간격 값이 아니다. 새 서비스 11곳은 칸 폭부터 쟀다.
원자료와 캡처는 공유 노트 폴더 `common-layer/stage5/board-1/`(measure3.json · all-valid.json · shots/m3-이름.png)에 있다. 캡처 시트를 직접 열어 사이드가 보이는지, 다크인지 확인한 곳만 세었다.

### 새로 센 서비스 11곳

| 서비스          | 칸 폭 | 사이 | 본문 글 폭 |
| --------------- | ----- | ---- | ---------- |
| Nuxt            | 259   | 미측 | 미측       |
| Docusaurus      | 300   | 166  | 958        |
| Material MkDocs | 257   | 32   | 757        |
| Render          | 280   | 33   | 1558       |
| DigitalOcean    | 240   | 48   | 1376       |
| Gitea           | 284   | 230  | 832        |
| Elixir HexDocs  | 300   | 396  | 829        |
| Mintlify        | 224   | 412  | 648        |
| Convex          | 270   | 30   | 770        |
| StackBlitz      | 308   | 236  | 820        |
| Neon            | 312   | 미측 | 미측       |

세지 않은 곳: Fly.io(404 쪽이 열림) · Jest · Tailscale · Home Assistant · Stripe(라이트), Playwright · Vitest(Docusaurus · Vite 와 같은 틀이라 따로 세지 않음), Hugo · PlanetScale(사이드를 찾지 못함).

### 사이드 폭 분포(서비스 46곳 = 위 표 35곳 + 새 11곳)

248 이하 6 · 249~280 12 · 281~299 10 · 300 정확히 9 · 301 이상 9. 240 은 Twilio · Tailwind · DigitalOcean 3곳, 272 는 GitLab · Vite 2곳(264~270 인 곳 4), 288 은 Bun · Laravel · shadcn 3곳, 300 은 Next.js · Vercel · Cloudflare · Railway · Hugging Face · MUI · Rust Book · Docusaurus · Elixir 9곳.
사이드와 본문 글을 한 묶음으로 가운데 두고 남는 자리를 양옆에 두는 곳(사이 24~62): Bootstrap 212 · MkDocs 257 · FastAPI 266 · Vite 272 · Bun 288 · Next.js 300 6곳(표본이 작아 참고만), 폭 중앙값 269. 본문 글 폭이 측정된 35곳의 중앙값은 731(480~1558).

### 긴 메뉴 한 줄 검사(Pretendard JP 14, 줄 안쪽 16 · 아이콘 있는 줄은 24 더 뺌, 굵은 글자 기준)

설정 메뉴(ko · en · ja 전부)와 동기화 두 줄은 네 폭 모두 한 줄. 처리방침 영어 「13. Children under 14 and automated decisions」(308)는 300 폭에서도 못 들어간다(필요한 칸 폭 340). 240 은 영어 「2. Purposes, items and retention」 · 「8. Your rights and how to use them」 · 「14. Privacy officer and remedies」 · 개발자 문서 「5. Revocation and change notices」도 두 줄이 된다. 272 이상은 13절 하나만 두 줄. ko · ja 는 네 폭 모두 한 줄.

## 당근 실제 사이드바 (2026-11-27)

질문: 당근은 사이드바를 어디에 어떤 수치로 쓰는가. 잰 방법은 위와 같다(headless Playwright, 폭 1920 · 1440 · 1056 · 390, colorScheme dark, wait-capacity.sh, 브라우저 하나에 페이지 하나, 로그인 · 계정 화면은 열지 않음). 원자료 `common-layer/stage5/board-1/`(daangn.json · daangn-realty.json · seed-css.json · seed-sidenav.txt · fit2.json, 캡처 shots/dg-\* · seed-doc-\*).

### 공개 쪽 조사: 18곳 가운데 사이드바 있는 곳은 1곳

| 쪽                                                                                             | 결과                                                   |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| realty.daangn.com(당근부동산, www.daangn.com/kr/realty/ 가 여기로 이동)                        | 왼쪽 사이드바 있음(SEED side-navigation), 다크 #16171b |
| www.daangn.com/kr/ · /kr/buy-sell/ · /kr/cars/ · jobs.daangn.com                               | 사이드바 없음(위 머리 + 본문)                          |
| www.daangn.com/policy/terms · privacy-policy.daangn.com · cs.kr.karrotmarket.com 고객센터      | 사이드바 없음(고객센터는 다크 #212124)                 |
| business.daangn.com · about.daangn.com · careers.daangn.com(채용 · 콘텐츠) · seed-design.io 홈 | 사이드바 없음(라이트로 열림)                           |
| seed-design.io/components/\*(SEED 문서 사이트)                                                 | 문서 쪽 왼쪽 메뉴 있음(아래 별도 행)                   |
| medium.com/daangn(기술 블로그)                                                                 | 접속 막힘(Cloudflare 확인 쪽), 세지 않음               |
| /kr/groups/ · /kr/pay/ · /policy/community · business.daangn.com/ads                           | 404, 세지 않음                                         |

### 잰 값

| 항목                 | 당근부동산(실제 구현, 1920)                                                                                                              | SEED side-navigation 규격(문서 쪽 실제 부품)              | SEED 문서 사이트 자체 왼쪽 메뉴           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| 폭                   | 180(`!w-[180px]` 로 SEED 기본 240 을 덮음). 1440 · 1056 도 180, 390 에서는 숨김                                                          | 240, 접으면 56                                            | 칸 424(가운데 그릇), 링크 줄 216          |
| 놓임                 | 화면 왼쪽 끝 고정, 높이 가득, 위 머리 64(로고)                                                                                           | 부품 기본은 흐름 안, 높이 100%                            | 본문 x424 폭 1112                         |
| 줄                   | 높이 44 · 안쪽 0 8 · 모서리 10 · 아이콘 20 + 사이 12(아이콘은 겹쳐 놓고 라벨이 왼쪽 32를 비움) · 줄 폭 163(180 − 안쪽 8×2 − 오른쪽 선 1) | 높이 44 · 안쪽 0 8 · 모서리 10 · 사이 12                  | 높이 40 · 안쪽 0 8 · 폭 216               |
| 글자                 | 라벨 14/19, 굵기 500, 글자색 #dcdee3(지금 쪽은 #f3f4f5). 16/24 는 줄 버튼이 물려받은 값이라 메뉴 글자가 아님                             | 라벨 14/19, 굵기 500, 라벨 안쪽 6 6 6 32, nowrap + 말줄임 | 14, 굵기 400                              |
| 지금 쪽 표시         | 면 rgba(255,255,255,.09), 막대 없음, 굵기는 같은 500                                                                                     | 규격 데모는 면                                            | 면 rgba(255,255,255,.09), 굵기 400 그대로 |
| 면 · 선              | 바탕 #16171b 와 같음(transparent tone) + 오른쪽 선 1px rgba(255,255,255,.09)                                                             | tone neutral(회색 면 + 안쪽 오른쪽 선) 또는 transparent   | 면 없음                                   |
| 사이드바 ↔ 본문 사이 | 0(본문 패널이 x180 에서 바로 시작, 선 1px)                                                                                               | 해당 없음                                                 | 칸 424 안 링크 끝에서 본문까지 사이 있음  |
| 접힘                 | 접기 버튼 없음. 1056 이상 펼침, 390 숨김                                                                                                 | 규격: lg 펼침(수동 접기), md 자동 접힘, sm 숨김 + Drawer  | 해당 없음                                 |
| 메뉴                 | 4개(부동산 홈 · 살아본후기 · 채팅 · 나의 부동산) + 로그인 단추 + 「공인중개사로 가입하기」                                               | 헤더 · 트리거 · 콘텐츠 · 푸터 구성                        | 40여 개                                   |

캡처: `shots/dg-realty-review-1920.png`(당근부동산) · `shots/dg-realty-map-1920.png` · `shots/dg-realty-review-390.png` · `shots/seed-doc-sidenav.png`(SEED 문서) · `shots/seed-doc-1920.png`(문서 사이트 왼쪽 메뉴). 당근부동산 사이드바는 직접 연 캡처로 확인했고, 값은 computed style 이다.

### SEED 문서가 말하는 240 의 용도

문서(seed-design.io/components/side-navigation, 2026-08-17 갱신)는 용도를 「서비스의 최상위 메뉴 간 이동을 돕고 앱의 전체 구조를 탐색할 수 있게 하는 컴포넌트」 로 적는다. 구성은 Header(서비스 이름 · 프로필 · 계정 전환) · Trigger(접기) · Content(그룹 · 메뉴 항목 · 하위 항목 2단계) · Footer(가이드북 · 지원센터 같은 보조 링크). 예시는 「당근서비스 · SEED 프로필 · 메뉴」 이고 어드민 · 비즈니스 도구라는 말은 없다. 폭 240 은 문서 글에 없고 스타일시트 규칙(`.seed-side-navigation__root { width: 240px }`, 접힘 56)에서 읽었다. 즉 240 은 서비스 전체 구조를 담는 최상위 사이드바 부품의 기본값이고, 설정 · 문서 같은 쪽 안 보조 메뉴를 위한 값으로 적혀 있지 않다. 문서 지침: 라벨이 길면 말줄임 대신 자동 줄바꿈으로 전체 명칭을 보인다. 다만 스타일시트의 라벨은 white-space nowrap 과 text-overflow ellipsis 이고 근거 규칙은 seed-css.json 의 .seed-side-navigation-menu-item__root · __label 이다. 40 은 접기 트리거의 min-height 다.

### 긴 메뉴 다시 잼(Pretendard JP, 처리방침 · 개발자 문서 · 동기화 · 설정 ko · en · ja 53개)

- SEED 규격대로(240, 라벨 14/500, 안쪽 8, 줄 안쪽 8, 라벨 안쪽 왼쪽 32 · 오른쪽 6이라 글자 영역 170): 53개 가운데 12개가 한 줄에 들어가지 않는다(영어 6 · 한국어 2 · 일본어 4). 아이콘 없는 줄처럼 왼쪽을 6으로 줄여 196으로 재도 7개다. 같은 SEED 규격 방식(글자 영역 = 폭 − 32 − 38)으로 240 은 12개, 지금 코드 276 은 글자 영역 206이라 3개(처리방침 영어 8절 · 13절, 개발자 문서 영어 5절). NosLog 줄 방식(14/400 · 영역 208)으로 재면 276 은 1개(처리방침 영어 13절). 이전 기록의 「3개 + 굵은 줄 2개」 는 NosLog 줄 방식(14/400 · 활성 700, 글자 영역 208)으로 잰 값이고 이 방식에서는 그대로다.
- 당근부동산 실제 값(180, 라벨 14/500, 글자 영역 109)을 NosLog 메뉴에 대면 25개가 꺾인다(이전 기록의 23개는 줄 버튼 글자 16으로 잘못 잰 값). 당근부동산 메뉴는 짧은 한국어 4개라 꺾이지 않는다. 같은 방식으로 잰 지금 코드 276 은 3개이므로 240(12개) · 180(25개) 모두 지금보다 늘어난다.

## 폭이 바뀔 때 (2026-11-27)

질문: 사이드바 폭을 고정하는가, 본문을 우선하는가. 같은 서비스 46곳을 폭 1920 · 1440 · 1280 · 1100 으로 바꿔 다크로 다시 쟀다(headless Playwright, wait-capacity.sh, 브라우저 하나에 페이지 하나, 같은 페이지에서 폭만 바꿈). 원자료와 표는 공유 노트 폴더 `common-layer/stage5/board-1/`(resize.json · RESIZE.md · resize-table.json · shots/rz-\*). 사이드 칸은 후보를 자동으로 고른 값이라 Prisma(1920 452 = 268 + 바깥 열 184)와 MongoDB(1920 426 = 161 + 265 두 겹)는 1920 값에 바깥 여백이나 겹이 들어 있다. 사이드 폭 CSS 값은 CDP 로 읽은 스타일시트 원문이다.

### 분류

- 비율(열을 분수로 나눔) 4곳: Bootstrap(`grid-template-columns: 1fr 5fr`, 컨테이너 max-width 1320), Laravel(`repeat(12, minmax(0,1fr))`, 컨테이너 1400), Nuxt(`repeat(10, minmax(0,1fr))`, 컨테이너 1440), MDN(`minmax(15rem,1fr) 2rem minmax(0,48rem) 2rem minmax(15rem,1fr)`, 사이드 열은 남는 자리를 받고 최소 240, 본문은 최대 768).
- px · rem 고정 33곳, 구간마다 px 가 바뀌는 곳 8곳(Microsoft Learn · Prisma · Anthropic · FastAPI · MongoDB · Hugging Face · StackBlitz · Material for MkDocs), px 로 지정했지만 flex 로 줄어드는 곳 1곳(Supabase, `lg:w-[420px]` 인데 실제 345 → 304).
- 1920 에서 줄일 때 처음 바뀌는 쪽: 본문 23 · 바깥 여백 8 · 사이드 + 본문 4 · 사이드 2 · 바깥 여백 + 본문 1 · 바깥 여백 + 사이드 + 본문 2 · 오른쪽 남는 자리(본문이 상한 폭에 걸림) 2(Zed 690 · Rust Book 750) · 본문 폭 측정 못 함 4(shadcn · Vercel · React · Tailwind, 사이드와 바깥 여백은 그대로).
- 1100 에서 사이드가 숨는 곳 5곳(FastAPI · Material for MkDocs · Twilio · Shopify Dev · MUI, Shopify · MUI 는 1280 이하 · 1100 에서).

### 곳마다

| 서비스              | 종류             | 사이드 1920/1440/1280/1100 | 왼쪽 x          | 본문 최대 폭        | 먼저 줄어드는 쪽                                   | 사이드 CSS 값(스타일시트 원문)                                                                                 |
| ------------------- | ---------------- | -------------------------- | --------------- | ------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Astro               | px 고정          | 284/284/284/284            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: 100% ∣ @(width >= 50rem) width: var(--sl-sidebar-width)                                                 |
| Clerk               | px 고정          | 282/282/282/282            | 5/5/5/5         | 1024px              | 본문(1440 → 1280)                                  | min-width: calc(var(--spacing) * 0) ∣ flex: auto; flex-grow: 1; flex-shrink: 1; flex-basis: auto               |
| Cloudflare          | px 고정          | 300/300/300/300            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: var(--nb-sidebar-width) ∣ flex-shrink: 0                                                                |
| Microsoft Learn     | px 단계          | 295/250/250/250            | 24/24/24/24     | 글 폭 688 에서 멈춤 | 사이드 + 본문(1920 → 1440)                         | width: 100%!important; width: 100% !important                                                                  |
| Next.js             | px 고정          | 300/300/300/300            | 236/0/0/0       | 780px               | 바깥 여백(1920 → 1440)                             | max-width: 1448px ∣ --fd-sidebar-width: 0px ∣ --fd-sidebar-width: 300px                                        |
| Prisma              | px 단계          | 452/268/268/268            | 0/0/0/0         | 없음                | 사이드 + 본문(1920 → 1440)                         | --fd-sidebar-width: 0px ∣ @(min-width: 874px) --fd-sidebar-width: 268px                                        |
| Resend              | px 고정          | 264/264/264/264            | 0/0/0/0         | 글 폭 576 에서 멈춤 | 본문(1920 → 1440)                                  | width: var(--sidebar-width,16.5rem)                                                                            |
| shadcn/ui           | px 고정          | 288/288/288/288            | 8/8/8/8         | 없음                | 미측정 또는 본문 상한                              | width: var(--sidebar-width) ∣ --sidebar-menu-width: calc(var(--spacing) * 56)                                  |
| Tauri               | px 고정          | 284/284/284/284            | 0/0/0/0         | 글 폭 720 에서 멈춤 | 본문(1920 → 1440)                                  | width: 100% ∣ @(width >= 50rem) width: var(--sl-sidebar-width)                                                 |
| Vercel Docs         | px 고정          | 300/300/300/300            | 0/0/0/0         | 없음                | 미측정 또는 본문 상한                              | @(min-width: 961px) width: 300px                                                                               |
| Anthropic Docs      | px 단계          | 264/264/264/224            | 0/0/0/0         | 글 폭 832 에서 멈춤 | 본문(1920 → 1440)                                  | @all width: calc(var(--spacing) * 56) ∣ @all flex: none; flex-grow: 0; flex-shrink: 0; flex-basis: auto ∣ @all |
| FastAPI             | px 단계          | 266/242/242/242            | 282/103/23/-242 | 없음                | 바깥 여백 + 사이드 + 본문(1920 → 1440) · 숨김 1100 | flex-shrink: 0; width: 12.1rem                                                                                 |
| Bootstrap           | 비율             | 212/212/205/175            | 320/80/20/20    | 글 폭 805 에서 멈춤 | 바깥 여백(1920 → 1440)                             | width: 100% ∣ @(min-width: 1400px) max-width: 1320px ∣ @(min-width: 992px) grid-template-columns: 1fr 5fr      |
| Railway             | px 고정          | 300/300/300/300            | 0/0/0/0         | 1152px              | 본문(1920 → 1440)                                  | @(min-width: 48rem) width: var(--width-sidebar) ∣ @(min-width: 48rem) flex-shrink: 0 ∣ @(min-width: 48rem)     |
| React               | px 고정          | 336/336/336/336            | 0/0/0/0         | 없음                | 미측정 또는 본문 상한                              | width: 100% ∣ @(min-width: 1024px) max-width: 21rem ∣ @(min-width: 1024px) flex-grow: 1                        |
| Twilio              | px 고정          | 240/240/240/240            | 0/0/0/-240      | 없음                | 본문(1920 → 1440) · 숨김 1100                      | width: 100% ∣ @screen and (min-width: 768px) width: 15rem                                                      |
| MongoDB             | px 단계          | 426/290/290/290            | 0/0/0/0         | 775px               | 사이드(1920 → 1440)                                |                                                                                                                |
| Zed                 | px 고정          | 280/280/280/280            | 0/0/0/0         | 690px               | 미측정 또는 본문 상한                              | width: var(--sidebar-width); flex-shrink: 0                                                                    |
| Hugging Face        | px 단계          | 300/270/270/270            | 0/0/0/0         | 없음                | 사이드(1920 → 1440)                                | width: 100% ∣ flex: auto; flex-grow: 1; flex-shrink: 1; flex-basis: auto ∣ @(width >= 64rem) width: 270px      |
| GitHub Docs         | px 고정          | 326/326/326/326            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | @(min-width: 1012px) width: 326px                                                                              |
| GitLab              | px 고정          | 272/272/272/272            | 252/20/20/20    | 없음                | 바깥 여백(1920 → 1440)                             | width: var(--column-left-wide-width)                                                                           |
| Shopify Dev         | px 고정          | 284/284/숨김/숨김          | 0/0/숨김/숨김   | 없음                | 본문(1920 → 1440) · 숨김 1280·1100                 | @screen and (width >= 640px)                                                                                   |
| MUI                 | px 고정          | 300/300/300/숨김           | 0/0/0/숨김      | 없음                | 본문(1920 → 1440) · 숨김 1100                      | @(min-width: 1200px) flex-shrink: 0; width: var(--MuiDocs-navDrawer-width)                                     |
| MDN                 | 비율             | 297/297/256/256            | 240/0/0/0       | 없음                | 바깥 여백(1920 → 1440)                             | grid-template-columns: var(--layout-2-sidebars)                                                                |
| Tailwind CSS        | px 고정          | 240/240/240/240            | 24/24/24/24     | 없음                | 미측정 또는 본문 상한                              |                                                                                                                |
| TypeScript          | px 고정          | 256/256/256/256            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | min-width: 16rem                                                                                               |
| Bun                 | px 고정          | 288/288/288/288            | 153/0/0/0       | 768px               | 바깥 여백 + 본문(1920 → 1440)                      | width: min(20rem,85vw); width: min(20rem, 85vw) ∣ @(min-width: 768px) width: 16rem ∣ @(min-width: 768px) flex- |
| Laravel             | 비율             | 288/288/258/249            | 325/85/65/17    | 없음                | 바깥 여백(1920 → 1440)                             | grid-template-columns: repeat(12,minmax(0,1fr)); grid-template-columns: repeat(12, minmax(0px, 1fr))           |
| Terraform           | px 고정          | 320/320/320/320            | 0/0/0/0         | 1000px              | 본문(1920 → 1440)                                  | flex-shrink: 0; width: 100% ∣ width: 342px ∣ @(min-width: 924px) width: var(--dev-dot-sidebar-width)           |
| Supabase            | px 지정 + 줄어듦 | 345/325/316/304            | 0/0/0/0         | 없음                | 사이드 + 본문(1920 → 1440)                         | @(min-width: 64rem) width: 420px                                                                               |
| Vite                | px 고정          | 272/272/272/272            | 241/1/17/17     | 글 폭 688 에서 멈춤 | 바깥 여백(1920 → 1440)                             | width: calc(100vw - 64px); max-width: 320px; width: calc(-64px + 100vw) ∣ @(width >= 1024px) width: var(--vp-s |
| Discord Developers  | px 고정          | 319/319/319/319            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: var(--sidebar-width,19rem)                                                                              |
| Rust Book           | px 고정          | 300/300/300/300            | 0/0/0/0         | 750px               | 미측정 또는 본문 상한                              | width: var(--sidebar-width)                                                                                    |
| Linear Docs         | px 고정          | 280/280/280/280            | 0/0/0/0         | 100%                | 본문(1440 → 1280)                                  | width: 280px                                                                                                   |
| Node.js             | px 고정          | 234/234/234/234            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: 234px                                                                                                   |
| Nuxt                | 비율             | 259/259/227/191            | 256/16/16/16    | 없음                | 바깥 여백(1920 → 1440)                             | @(width >= 64rem) grid-template-columns: repeat(10,minmax(0,1fr)); grid-template-columns: repeat(10, minmax(0p |
| Docusaurus          | px 고정          | 300/300/300/300            | 0/0/0/0         | calc(100% - 300px)  | 본문(1920 → 1440)                                  | @(width >= 997px) width: var(--doc-sidebar-width)                                                              |
| Material for MkDocs | px 단계          | 257/234/234/242            | 293/114/34/-242 | 없음                | 바깥 여백 + 사이드 + 본문(1920 → 1440) · 숨김 1100 | flex-shrink: 0; width: 12.1rem                                                                                 |
| Render              | px 고정          | 280/280/280/280            | 1/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: 100% ∣ @(min-width: 1024px) width: auto ∣ @(min-width: 1024px)                                          |
| DigitalOcean        | px 고정          | 240/240/240/240            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: var(--left-nav-width); max-width: var(--left-nav-width)                                                 |
| Gitea               | px 고정          | 284/284/284/284            | 0/0/0/0         | 없음                | 본문(1920 → 1440)                                  | width: 100% ∣ @(width >= 50rem) width: var(--sl-sidebar-width)                                                 |
| Elixir HexDocs      | px 고정          | 300/300/300/300            | 0/0/0/0         | 글 폭 829 에서 멈춤 | 본문(1920 → 1440)                                  | width: var(--sidebarWidth); min-width: var(--sidebarMinWidth); max-width: 50vw                                 |
| Mintlify            | px 고정          | 224/224/224/224            | 0/0/0/0         | 글 폭 648 에서 멈춤 | 본문(1920 → 1440)                                  | width: var(--sidebar-width,14rem)                                                                              |
| Convex              | px 고정          | 270/270/270/270            | 0/0/0/0         | calc(100% - 270px)  | 본문(1920 → 1440)                                  | @(width >= 997px) width: var(--doc-sidebar-width)                                                              |
| StackBlitz          | px 단계          | 308/272/272/272            | 0/0/0/0         | 없음                | 사이드 + 본문(1920 → 1440)                         | --vp-sidebar-width: 308px; width: var(--vp-sidebar-width)!important; width: var(--vp-sidebar-width) !important |
| Neon                | px 고정          | 312/312/312/312            | 64/32/32/32     | 없음                | 바깥 여백(1920 → 1440)                             | width: 312px ∣ flex-shrink: 0                                                                                  |

### 디자인 시스템 5곳

5곳 모두 사이드 폭은 고정 값이고(SEED 240 · Material 3 360 · Ant 기본 200 · Carbon 256 · Fluent 260) 비율로 정하는 규칙이 없다. 본문 우선은 구간마다 사이드를 접거나 드로어로 바꿔 자리를 확보하는 방식이다: SEED 는 lg 펼침 · md 접힘 · sm 드로어(https://seed-design.io/components/side-navigation), Material 3 는 medium 이하에서 modal 드로어이고 expanded navigation rail 을 권장(https://m3.material.io/components/navigation-drawer/guidelines), Ant 는 breakpoint 아래에서 collapsedWidth(기본 80)로 접힘(https://ant.design/components/layout), Fluent 2 는 기본 260 이고 화면 640 에서 overlay 드로어(https://fluent2.microsoft.design/components/web/react/core/nav/usage), Carbon 은 폭이 바뀔 때 규칙이 문서에 없음(미확인, https://www.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/specifications). 본문 최소 폭을 정한 문서는 5곳 모두 없다.

### 지금 코드와 SearXNG 방식(사이드 272 고정)

지금 코드(`calc((100% - 3 * 16px) / 4)` + `minmax(0, 768px)`, 열 사이 24)는 안쪽이 1152 로 멈추는 폭 1200 이상에서 사이드 276, 1100(안쪽 1052)에서 251, 1056(안쪽 1008)에서 240 이다. 고정 272 방식은 1920 · 1440 · 1280 에서 본문 768, 1100 에서 본문 756, 1056 에서 본문 712 다. 1200 이상에서는 두 방식이 4px 차이뿐이다.

같은 SEED 규격 방식(글자 영역 = 폭 − 32 − 38, 53개 메뉴)으로 폭마다 한 줄에 안 들어가는 수는 240 이 12개, 251(지금 코드 1/4 방식의 1100)이 8개, 272 가 6개, 276 이 3개다. 지금 코드 1/4 방식은 1088 이상에서 본문 768 을 지키고(1100 에서 사이드 251 · 본문 768), 1056 에서는 사이드 240 · 본문 744 다. 272 고정은 1056 에서 본문 712, 1100 에서 756, 1112 이상에서 768 이다. 실측 46곳 중 사이드 폭을 px 로 정하는 곳이 41곳(한 값 33 · 구간마다 다른 값 8)이고 비율은 4곳이다. 디자인 시스템 5곳은 모두 고정 폭이다.
