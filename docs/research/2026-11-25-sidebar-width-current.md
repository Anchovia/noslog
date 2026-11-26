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
