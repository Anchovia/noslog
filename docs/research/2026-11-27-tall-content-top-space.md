# 인증 · 복구 화면이 창보다 높을 때 위 여백

2026-11-27. 5단계 판 4(공통 층 공용 레이아웃). 질문은 「상하 가운데 묶음이 창보다 높아지면 위에서 얼마 떨어뜨려 시작하나」 다. 인증(동의 · 온보딩 면 550, 로그인 358)과 복구(점검 · 404 · 오류) 두 무리로 나눠 쟀다. 원자료와 캡처는 `~/noslog-research/tall-content-top-space-2026-11-27/`(`low-all.json` · `curated.json` · `daangn-faces.json` · `ds-measured.json` · `shots/`), 스크립트는 세션 공유 폴더 `common-layer/stage5/board-4/scripts/` 에 있다.

## 방법

- headless Playwright, colorScheme dark, 폭 1440 에서 높이 900 · 800 · 700 · 640 · 560 · 480 으로 줄였고 폭 1280 은 900 · 560 만 쟀다(1056 미만은 판 6 몫이라 안 쟀다). 로그인 없이 열리는 화면만 열었다.
- 「묶음」 은 머리 · 푸터 · 고정 띠를 뺀 본문에서 가장 큰 글자 · 입력칸 · 단추가 든 덩어리(앞뒤 간격 120 이내)로 잡았다. 위 = 묶음 맨 위 y, 아래 = 문서 끝 − 묶음 아래 끝. 다크를 받지 않는 사이트는 밝은 화면으로 쟀다.
- 방식 판정: 900 · 480 의 위가 같으면 「위 고정」, 560 · 480 이 같고 900 이 더 크면 「가운데 후 바닥」, 480 에서도 줄어들면 「가운데」(묶음이 창보다 낮아 바닥에 닿지 않음).
- 캡처에 빨간 줄(묶음 위 · 아래)을 그려 직접 열어 확인한 곳만 셌다. 쿠키 창 · 봇 확인 · 로그인 벽 · 머리 메뉴가 묶음에 섞인 곳 · 모달 위에 뜬 곳은 뺐다.
- 측정 시도 URL 165개(인증 45 · 404 69 · 오류 51), 센 곳 49 화면(인증 15 · 복구 34)과 당근 2곳.

## 표본 수

| 구분                                | 곳 수                     | 비고                                                                                                            |
| ----------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 인증(로그인 · 가입) 실제 서비스     | 13곳(15 화면)             | 같은 서비스의 로그인 · 가입은 한 곳으로 센다                                                                    |
| 복구(404 · 오류 · 점검) 실제 서비스 | 36곳(34 + 당근 2)         | Next.js 500 템플릿 8곳(Next.js · Resend · Neon · Prisma · Tailwind CSS · Warp · Cursor · Clerk)은 같은 규칙이다 |
| 두 무리에 모두 든 곳                | 2곳                       | Google · GitHub. 중복을 빼면 47곳                                                                               |
| 디자인 시스템                       | 6곳                       | 규칙 값이 있는 곳 5(Bootstrap · MUI · Ant Design · GOV.UK · USWDS), 당근 SEED 는 규격 없음                      |
| 못 센 것                            | 116(165 중 센 49 화면 밖) | 403 · 봇 확인 · 쿠키 · 모달 · 머리 섞임 · 화면 없음                                                             |

점검 화면은 살아 있는 점검 쪽이 드물어 GitLab 503 한 곳만 셌다. 동의 화면은 로그인 없이 열리는 실제 서비스가 없어(공개 데모는 가입 후에만 열린다) 미확인이고, 같은 면 틀을 쓰는 가입 화면(Vercel 가입 · Kakao 가입)으로 대신 쟀다.

## 인증 무리(로그인 · 가입) 낮은 창 실측

| 서비스           | 주소                                               | 높이 900 위 | 560 위 | 480 위 | 560 아래 | 방식           | 위 끝 기준                        | 캡처(shots/)             |
| ---------------- | -------------------------------------------------- | ----------- | ------ | ------ | -------- | -------------- | --------------------------------- | ------------------------ |
| Google 로그인    | https://accounts.google.com/signin                 | 217         | 48     | 48     | 112      | 가운데 후 바닥 | 카드 위                           | auth_Google_560.png      |
| Microsoft 로그인 | https://login.live.com/                            | 208         | 40     | 40     | 96       | 가운데 후 바닥 | 카드 위                           | auth_Microsoft_560.png   |
| Vercel 로그인    | https://vercel.com/login                           | 154         | 64     | 64     | 617      | 가운데 후 바닥 | 제목 위(머리 띠 64 에 닿음)       | auth_Vercel_560.png      |
| Vercel 가입      | https://vercel.com/signup                          | 200         | 200    | 200    | 153      | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Vercel_가입_560.png |
| GitHub 로그인    | https://github.com/login                           | 46          | 46     | 46     | 66       | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_GitHub_560.png      |
| Discord 로그인   | https://discord.com/login                          | 243         | 73     | 33     | 73       | 가운데 후 바닥 | 카드 위(로고 줄은 왼쪽 위 모서리) | auth_Discord_560.png     |
| Linear 로그인    | https://linear.app/login                           | 258         | 88     | 48     | 75       | 가운데 후 바닥 | 묶음 위(로고 포함)                | auth_Linear_560.png      |
| Supabase 로그인  | https://supabase.com/dashboard/sign-in             | 64          | 64     | 64     | 64       | 위 고정        | 왼쪽 열 위(로고 포함, 분할 화면)  | auth_Supabase_560.png    |
| Atlassian 로그인 | https://id.atlassian.com/login                     | 82          | 82     | 82     | 147      | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Atlassian_560.png   |
| Twitch 로그인    | https://www.twitch.tv/login                        | 16          | 16     | 16     | 157      | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Twitch_560.png      |
| Twitch 가입      | https://www.twitch.tv/signup                       | 16          | 16     | 16     | 161      | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Twitch_가입_560.png |
| Kakao 가입       | https://accounts.kakao.com/weblogin/create_account | 210         | 118    | 118    | 108      | 가운데 후 바닥 | 카드 위                           | auth_Kakao_가입_560.png  |
| Naver 로그인     | https://nid.naver.com/nidlogin.login               | 200         | 200    | 200    | 239      | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Naver_560.png       |
| Shopify 로그인   | https://accounts.shopify.com/lookup                | 264         | 264    | 264    | 132      | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Shopify_560.png     |
| niconico 로그인  | https://account.nicovideo.jp/login                 | 32          | 32     | 32     | 78       | 위 고정        | 첫 글자 · 로고 · 입력칸 덩어리 위 | auth_Niconico_560.png    |

읽는 법: 위는 모두 px. 「위 끝 기준」 열이 카드 · 제목 · 왼쪽 열이라고 적힌 9곳(가운데 후 바닥 · 줄어드는 곳)은 카드 · 제목 묶음 위로 다시 쟀고 320 높이까지 캡처(`shots/f2_*`)로 확인했다. 나머지 행은 스크립트가 잡은 덩어리(첫 글자 · 로고 · 입력칸) 위다. 「가운데 후 바닥」 6곳의 바닥값은 Google 카드 48 · Linear 묶음 48 · Microsoft 카드 40 · Vercel 로그인 제목 64(머리 띠 64 에 그대로 닿음) · Kakao 가입 카드 118 이고 Discord 카드는 560 에서 73 · 480 에서 33 · 400 이하에서 0 으로 바닥 없이 창 맨 위에 닿는다(로고 줄 48 은 왼쪽 위 모서리). 처음 기록한 Discord 48 · Google 84 · Microsoft 80 · Supabase 96 은 로고 줄 · 첫 글자 기준이라 고쳤다. 「위 고정」 9곳은 위에서 16 · 32 · 46 · 64(Supabase, 왼쪽 열 분할 화면) · 82 · 200 · 264 에 놓인다. 실제 규칙(computed 스타일 사슬): Microsoft 안쪽 위아래 40 + 40, Linear 바깥 위 48 · 아래 88, Google 카드 위 48(바깥 패딩), Discord 폼 안쪽 위아래 32. Apple 로그인(위 58)은 머리 메뉴 바로 아래 쪽 머리 줄이고 면이 로딩 그림이라 뺐다.

## 복구 무리(404 · 오류 · 점검) 낮은 창 실측

| 서비스            | 주소                                                         | 높이 900 위 | 560 위 | 480 위 | 560 아래 | 방식                                  | 위 끝 기준                        | 캡처(shots/)                  |
| ----------------- | ------------------------------------------------------------ | ----------- | ------ | ------ | -------- | ------------------------------------- | --------------------------------- | ----------------------------- |
| Spotify 404       | https://open.spotify.com/this-page-does-not-exist-noslog     | 383         | 213    | 153    | 299      | 가운데(320 에서도 줄어듦)             | 제목 위                           | nf_Spotify_560.png            |
| Reddit 404        | https://www.reddit.com/this-page-does-not-exist-noslog       | 364         | 194    | 154    | 270      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Reddit_560.png             |
| Next.js 500       | https://nextjs.org/500                                       | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Nextjs_500_560.png        |
| Resend 500        | https://resend.com/500                                       | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Resend_500_560.png        |
| Neon 500          | https://neon.com/500                                         | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Neon_500_560.png          |
| Prisma 500        | https://www.prisma.io/500                                    | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Prisma_500_560.png        |
| Tailwind CSS 500  | https://tailwindcss.com/500                                  | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Tailwind_500_560.png      |
| Warp 500          | https://www.warp.dev/500                                     | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Warp_500_560.png          |
| Cursor 500        | https://cursor.com/500                                       | 424         | 254    | 214    | 258      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Cursor_500_560.png        |
| Clerk 500         | https://clerk.com/500                                        | 346         | 176    | 136    | 208      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Clerk_500_560.png         |
| Heroku 500        | https://www.herokucdn.com/error-pages/application-error.html | 356         | 186    | 146    | 190      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Heroku_500_560.png        |
| Coinbase 502      | https://www.coinbase.com/500                                 | 255         | 85     | 45     | 84       | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Coinbase_502_560.png      |
| Railway 404       | https://railway.com/this-page-does-not-exist-noslog          | 334         | 164    | 124    | 164      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Railway_560.png            |
| Svelte 404        | https://svelte.dev/this-page-does-not-exist-noslog           | 368         | 198    | 158    | 198      | 가운데(480 에서도 줄어듦)             | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Svelte_560.png             |
| GitLab 503 점검   | https://gitlab.com/503.html                                  | 24          | 24     | 24     | 86       | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_GitLab_503_560.png        |
| Dribbble 500      | https://dribbble.com/500.html                                | 190         | 127    | 127    | 537      | 가운데 후 바닥                        | 제목 위(로고 줄 아래)             | err_Dribbble_500_560.png      |
| OpenStreetMap 500 | https://www.openstreetmap.org/500.html                       | 32          | 32     | 32     | 272      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_OpenStreetMap_500_560.png |
| Dropbox 404       | https://www.dropbox.com/this-page-does-not-exist-noslog      | 40          | 40     | 40     | 48       | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Dropbox_560.png            |
| GitHub 400        | https://github.com/%                                         | 50          | 50     | 50     | 306      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_GitHub_400_560.png        |
| Google 400        | https://www.google.com/url?q=%                               | 217         | 217    | 217    | 257      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Google_400_560.png        |
| Airbnb 404        | https://www.airbnb.com/this-page-does-not-exist-noslog       | 109         | 109    | 109    | 64       | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Airbnb_560.png             |
| Apple 404         | https://www.apple.com/this-page-does-not-exist-noslog        | 136         | 136    | 136    | 767      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Apple_560.png              |
| Medium 404        | https://medium.com/p/0000000000000                           | 117         | 117    | 117    | 308      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Medium_560.png             |
| Cookpad 500       | https://cookpad.com/500.html                                 | 58          | 58     | 58     | 285      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Cookpad_500_560.png       |
| CrowdWorks 500    | https://crowdworks.jp/500.html                               | 18          | 18     | 18     | 40       | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_CrowdWorks_500_560.png    |
| Redmine 500       | https://www.redmine.org/500.html                             | 20          | 20     | 20     | 371      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Redmine_500_560.png       |
| Wantedly 403      | https://www.wantedly.com/500.html                            | 8           | 8      | 8      | 515      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Wantedly_500_560.png      |
| Basecamp 500      | https://basecamp.com/500.html                                | 89          | 89     | 89     | 211      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Basecamp_500_560.png      |
| Kickstarter 500   | https://www.kickstarter.com/500.html                         | 85          | 85     | 85     | 48       | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Kickstarter_500_560.png   |
| Bandcamp 404      | https://bandcamp.com/this-page-does-not-exist-noslog         | 51          | 51     | 51     | 458      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Bandcamp_560.png           |
| Letterboxd 404    | https://letterboxd.com/film/this-page-does-not-exist-noslog/ | 30          | 30     | 30     | 408      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Letterboxd_560.png         |
| V-ARCHIVE 404     | https://v-archive.net/this-page-does-not-exist-noslog        | 32          | 32     | 32     | 264      | 위 고정                               | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_VARCHIVE_560.png           |
| 토스 404          | https://toss.im/this-page-does-not-exist-noslog              | 209         | 39     | -1     | 684      | 가운데(480 에서도 줄어듦) · 위가 잘림 | 첫 글자 · 로고 · 입력칸 덩어리 위 | nf_Toss_560.png               |
| Mastodon 500      | https://mastodon.social/500.html                             | 136         | -34    | -74    | 85       | 가운데(480 에서도 줄어듦) · 위가 잘림 | 첫 글자 · 로고 · 입력칸 덩어리 위 | err_Mastodon_500_560.png      |

읽는 법: 복구 화면은 묶음이 작아(대개 50–180) 480 에서도 창에 들어간다. 「가운데」 14곳은 바닥에 닿지 않는다(Spotify 는 320 에서도 줄어든다. 처음 기록한 Spotify 16 은 모서리 아이콘이었다). 바닥이 드러난 곳은 Dribbble 500(제목 위 127, 처음 기록한 32 는 로고 줄)과 당근부동산 404(24, 아래 당근 항목) 두 곳이다. 「위 고정」 17곳은 24(GitLab 503) · 32(OpenStreetMap · V-ARCHIVE) · 40(Dropbox) · 50(GitHub 400) 같은 값에 위에서 놓인다. 위가 잘린 곳은 2곳이다: 토스 404 는 480 에서 −1(큰 그림이 든 묶음), Mastodon 500 은 560 에서 −34 · 480 에서 −74(가운데만 쓰고 바닥이 없는 큰 그림 묶음).

### 당근(SEED 쓰임)

- 당근부동산 404(realty.daangn.com): 가운데 후 바닥. 묶음(제목 · 설명 · 「홈으로 가기」) 높이 167, 위 269(900) · 189(700) · 133(560) · 101(480) · 37(320) · 24(240, 쪽이 스크롤). 캡처 `shots/daangn-realty-404_560.png`.
- 당근비즈니스 404(business.daangn.com/ads): 위 고정 364(머리 56 아래), 높이 240 · 480 · 900 모두 같다.
- www.daangn.com/kr/ 404 · jobs.daangn.com 404: 머리 메뉴가 묶음에 섞여 값을 못 잡았다(캡처상 머리 아래 가운데). 미확인.
- 당근 로그인(www.daangn.com/kr/login/): 404 로 열려 공개 로그인 화면을 못 봤다. 미확인.
- SEED 에는 인증 틀 · 오류 쪽 위 여백 규격이 없다. `ResultSection` 은 부품 안쪽 값만 가진다. 「SEED 규격 없음 · 당근 쓰임은 부동산 404 의 바닥 24 한 곳」.

## 디자인 시스템

| DS                    | 값                                                                                        | 출처                                      |
| --------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| Bootstrap 로그인 예제 | body `padding-block` 24 + `.form-signin` padding 16 = 바닥 40, 가운데(`body` flex center) | 실측 computed, 높이 560 위 64 · 480 위 40 |
| MUI 로그인 템플릿     | 바깥 Stack `padding` 32(`min-height:100%`)                                                | 실측 computed                             |
| Ant Design Result     | `padding: 48px 32px`                                                                      | 실측 computed(`.ant-result`)              |
| GOV.UK Design System  | `govuk-main-wrapper` 위아래 40(태블릿 이상), 쪽 안내 20                                   | govuk-frontend CSS                        |
| USWDS                 | `usa-section` 위아래 64(데스크톱, 모바일 32)                                              | uswds CSS                                 |
| 당근 SEED             | 규격 없음                                                                                 | seed-design.io 문서 · `ResultSection`     |

Carbon · Polaris · Atlassian · Primer · M3 · Spectrum 은 인증 틀 · 오류 쪽 위 여백 규칙을 문서에서 못 찾아 미확인이다.

## 기초값과의 대조

- 간격 눈금은 0 · 2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 이다. 48 · 64 는 간격에 쓰지 않는다([기초값 — 간격](../design/foundations.md#간격)). 80 · 84 · 96 도 눈금 밖이다.
- 역할 값: 구역 사이 40(`--nl-space-section`), 머리 띠 아래 → 쪽 제목 32(`--nl-space-header-title`), 쪽 아래 끝 56(`--nl-page-bottom`).
- 같은 가이드 159행이 「인증 · 온보딩 위 48 · 복구 화면 위 64 도 5단계에서 정한다」 로 적어 두었다. 두 값은 눈금 밖이라 눈금에 넣을지도 같이 정해야 한다.

## 56 근처(위 고정 · 가운데 후 바닥, ±2)

인증 실측에는 없다. Apple 로그인 58 은 위 쪽 머리 줄이라 뺐고 Notion 로그인은 560 에서 56 이지만 480 에서 48 로 계속 줄어 바닥이 아니다. 복구 쪽은 Cookpad 500 이 위 고정 58 이다(캡처 `shots/err_Cookpad_500_560.png`). 56 을 쓰는 DS 는 조사한 6곳에 없다.

## 아래 여백

560 에서 위와 아래는 Google 48 · 112, Microsoft 40 · 96, Linear 88 · 75 처럼 서비스마다 같지 않아 위와 같은 값이라는 근거가 없다.
