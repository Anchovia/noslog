# 검정 목록 그릇 폭 실측(타일 격자 목록 쪽)

2026-11-27, 공통 층 5단계 판 5-E. 헤드리스 Playwright, colorScheme dark, 폭 1920 · 1440 · 1280(높이 1080), 로그아웃. 캡처와 원자료는 공유 노트 폴더 `common-layer/stage5/board-5E/`(shots · json). 격자 위치로 스크롤한 캡처(`<곳>-grid1920.png`)를 열어 격자가 있는 곳만 세었고, 첫 화면 캡처(`<곳>-1920.png`)와 폭 1440 캡처(`<곳>-1440.png`)가 같이 있다.

## 결과 요약

- 다크 화면으로 찍혀 격자를 확인한 서비스 32곳. 분류 기준: 1920 · 1440 · 1280 세 폭에서 타일 폭 차이가 12 이하면 「그대로」, 칸 수가 하나라도 바뀌면 「바뀜」. 칸 수 그대로 + 타일 폭 바뀜 = 그릇 먼저 10곳, 타일 폭 그대로 + 칸 수 바뀜 = 타일 먼저 2곳(Dota 2 · BeatLeader), 둘 다 바뀜 = 섞임 8곳, 둘 다 그대로 = 구분 안 됨 12곳. 1044 · 164 나 1152 · 6열 · 182 를 그대로 쓰는 곳은 없다.
- 정확히 1152인 곳은 LIFE4 트라이얼(3열 368 사이 24, 그릇 1200 안쪽 1152) 하나이고 세 폭 모두 같아 분류는 구분 안 됨이다. 6열 이상은 Deezer 채널(6열 251 사이 17 → 1440에서 171)과 Twitch 카테고리(9열 182 → 1440에서 6열 194 → 1280에서 5열 200, 사이 0)뿐이다.
- 1920에서 5열은 Kick(304 사이 16, 섞임) · Chzzk(317 사이 14, 섞임) · Dota 2(225 사이 19, 타일 먼저)이고 폭이 줄 때 5열이 되는 곳은 Twitch · Deezer다. 7열 이상은 다크 화면에서 쓰는 곳이 없다(Pokémon DB 8열은 밝은 화면만).
- 쪽 제목 왼쪽 끝과 격자 왼쪽 끝이 20 이내로 맞는 곳은 Framer · Scrimba · Twitch · Duolingo · Humble · MyAnimeList 등이다. 나머지는 제목이 없거나 가운데 정렬이거나 사이드바가 있어 미확인.
- 당근 SEED(https://seed-design.io/docs/foundation/layout): 레이아웃 최대 폭 720 · 1040(기본) · 1280(커머스 검색 결과), 12 컬럼 · 거터 24 · 여백 32, 중앙 고정. 타일 폭 · 칸 수 SEED 규격 없음. 당근 웹 홈 타일 4열 141×94 사이 12(600 상자 안).
- 디자인 시스템 6곳 + 프레임워크 2곳. DS: 당근 SEED(위), Carbon 2x Grid 최대 1584(큰 폭 1056 · 1312, 16컬럼, 전체 거터 32), Ant Design 24컬럼(Row gutter 16 + 8n 권장, 최대 폭 값 없음), Primer 구간 large 1012 · xlarge 1280 · xxlarge 1400 · 내용 영역 최대 폭 xlarge 1280(안쪽 여백 24 포함), Atlassian 12컬럼 데스크톱 거터 16 · 여백 32(모바일 · 태블릿 거터 12), Material 3 창 크기 구간 큰 1200–1599dp · 아주 큰 1600dp 이상(최대 폭 값 없음). 프레임워크: Bootstrap 5.3 container-xl 1140 · container-xxl 1320 · 거터 24, Tailwind max-w-6xl 1152 · max-w-7xl 1280. Polaris · Spectrum 문서는 못 읽었고 Fluent 는 12컬럼 설명만 있어 미확인.

## 실제 서비스 32곳(칸 · 타일 폭 · 사이 · 격자 폭)

| 곳                    | 주소                                           | 1920            | 1440            | 1280            | 분류       |
| --------------------- | ---------------------------------------------- | --------------- | --------------- | --------------- | ---------- |
| astro-themes          | https://astro.build/themes/                    | 3열·400·40·1280 | 3열·400·40·1280 | 3열·384·40·1232 | 그릇 먼저  |
| cytoid                | https://cytoid.io/levels                       | 3열·459·32·1440 | 3열·427·32·1344 | 3열·373·32·1184 | 그릇 먼저  |
| huggingface-spaces    | https://huggingface.co/spaces                  | 4열·364·16·1504 | 4열·300·16·1248 | 4열·296·16·1233 | 그릇 먼저  |
| nuxt-templates        | https://nuxt.com/templates                     | 4열·320·32·1376 | 4열·320·32·1376 | 4열·280·32·1216 | 그릇 먼저  |
| render-templates      | https://render.com/templates                   | 3열·409·40·1308 | 3열·300·40·980  | 3열·263·40·870  | 그릇 먼저  |
| tailwind-showcase     | https://tailwindcss.com/showcase               | 4열·354·40·1536 | 4열·310·40·1360 | 4열·270·40·1200 | 그릇 먼저  |
| v0-community          | https://v0.app/community                       | 3열·437·24·1360 | 3열·437·24·1360 | 3열·387·24·1208 | 그릇 먼저  |
| valorant-agents       | https://playvalorant.com/en-us/agents/         | 4열·352·32·1504 | 4열·312·32·1344 | 4열·272·32·1184 | 그릇 먼저  |
| vercel-integrations   | https://vercel.com/marketplace                 | 4열·332·24·1400 | 4열·330·24·1392 | 4열·290·24·1232 | 그릇 먼저  |
| vercel-templates      | https://vercel.com/templates                   | 3열·451·24·1400 | 3열·448·24·1392 | 3열·395·24·1232 | 그릇 먼저  |
| duolingo              | https://www.duolingo.com/courses               | 4열·200·22·866  | 4열·200·22·866  | 4열·200·22·866  | 구분 안 됨 |
| etterna               | https://etternaonline.com/packs                | 3열·380·0·1140  | 3열·380·0·1140  | 3열·380·0·1140  | 구분 안 됨 |
| github-skills         | https://skills.github.com/                     | 3열·373·48·1216 | 3열·373·48·1216 | 3열·373·48·1216 | 구분 안 됨 |
| gog-games             | https://www.gog.com/en/games                   | 3열·255·24·814  | 3열·255·24·814  | 3열·255·24·814  | 구분 안 됨 |
| humble-bundle         | https://www.humblebundle.com/store             | 4열·280·32·1216 | 4열·280·32·1216 | 4열·280·32·1216 | 구분 안 됨 |
| life4                 | https://life4ddr.com/trials/                   | 3열·368·24·1152 | 3열·368·24·1152 | 3열·368·24·1152 | 구분 안 됨 |
| myanimelist           | https://myanimelist.net/anime/season           | 3열·336·15·1038 | 3열·336·15·1038 | 3열·336·15·1038 | 구분 안 됨 |
| newgrounds            | https://www.newgrounds.com/games               | 3열·314·6·954   | 3열·314·6·954   | 3열·314·6·954   | 구분 안 됨 |
| quaver                | https://quavergame.com/mapsets                 | 2열·574·12·1160 | 2열·574·12·1160 | 2열·574·12·1160 | 구분 안 됨 |
| raycast-store         | https://www.raycast.com/store                  | 2열·558·24·1140 | 2열·558·24·1140 | 2열·558·24·1140 | 구분 안 됨 |
| sanity-exchange       | https://www.sanity.io/exchange/type=templates/ | 3열·400·24·1248 | 3열·400·24·1248 | 3열·395·24·1232 | 구분 안 됨 |
| supabase-integrations | https://supabase.com/partners/integrations     | 3열·260·16·812  | 3열·260·16·812  | 3열·260·16·812  | 구분 안 됨 |
| chzzk                 | https://chzzk.naver.com/lives                  | 5열·317·14·1640 | 3열·377·14·1160 | 3열·324·14·1000 | 섞임       |
| deezer                | https://www.deezer.com/en/channels/explore     | 6열·251·17·1583 | 6열·171·17·1103 | 5열·176·16·943  | 섞임       |
| framer-templates      | https://www.framer.com/marketplace/templates/  | 4열·285·20·1200 | 4열·285·20·1200 | 3열·368·20·1145 | 섞임       |
| github-marketplace    | https://github.com/marketplace                 | 3열·400·16·1232 | 2열·540·16·1096 | 2열·460·16·936  | 섞임       |
| kick-browse           | https://kick.com/categories                    | 5열·304·16·1584 | 4열·264·16·1104 | 4열·224·16·944  | 섞임       |
| railway-templates     | https://railway.com/templates                  | 4열·310·16·1288 | 4열·310·16·1288 | 3열·403·16·1240 | 섞임       |
| scrimba               | https://scrimba.com/learn                      | 3열·360·20·1120 | 3열·360·20·1120 | 2열·484·20·988  | 섞임       |
| twitch-cats           | https://www.twitch.tv/directory                | 9열·182·0·1642  | 6열·194·0·1162  | 5열·200·0·1002  | 섞임       |
| beatleader            | https://beatleader.xyz/leaderboards            | 3열·288·32·928  | 3열·288·32·928  | 2열·288·32·608  | 타일 먼저  |
| dota-heroes           | https://www.dota2.com/heroes                   | 5열·225·19·1200 | 5열·225·19·1200 | 4열·225·19·956  | 타일 먼저  |

## 세지 않은 곳

- 밝은 화면으로만 찍혀 참고만(LoL 챔피언 1504 · Overwatch 영웅 6열 207 사이 32 1400 · Nomad Coders 3열 379 사이 40 1216 · 프로그래머스 868 · Codecademy 936 · Typing.com 760 · itch.io 6열 261 1616 · Kaggle 4열 282 1200 · Pokémon DB 8열 134 사이 12 1156 · Udacity 816 · Scratch 922 · Xbox 944 · Nintendo 1078 · Coursera 1388 · W3Schools 1064 · Exercism): 값은 grid.json · grid2.json · grid4.json.
- 막힘(Cloudflare 403 · 접근 거부 · 로그인 벽): TypingClub · LeetCode · 인프런 · TrueAchievements · PSNProfiles · Exophase · RetroAchievements · Letterboxd · Lichess · Crunchyroll · Epic · Speedrun.com · IGDB · Codepen · Unsplash · Fandom.
- 격자를 못 찾음: Khan Academy · freeCodeCamp · Brilliant · osu! · BeatSaver · Genshin · Steam 태그 · Roblox · Plex · Modrinth.
- 빈 화면 · 격자 아님 · 밝음으로 뺌: Docker Hub · Prisma · Obsidian 플러그인.

## 사실 대조

- Figma 읽기가 편집 권한 오류(create_session)로 막혀 `stage-base/29-검정-상세.png` · `30-검정-목록.png` 사본 캡처로 대신 봤다. Figma 29는 왼쪽 레일 없이 급 칩 줄 + 본문 768 | 오른쪽 레일 360, Figma 30은 레일 없이 타일 6열(164 · 사이 12 = 1044). 코드는 `app/styles/exams.css` 1056 이상에서 왼쪽 급 레일(전체 폭의 1/4)이다.
