# 상자 · 두 칸 구역 · 구역 띠 — 두 칸 비율과 넓은 칸 자리 · 옆 열 구역 구분 · 쪽 구역의 면 (2026-11-27)

공통 층 5단계 판 5-C 재료. 질문은 셋이다. 1152 안 두 칸 구역의 비율과 넓은 칸 위치, 구역 띠 8(구역 사이를 검정 면 8로 끊는 꼴)을 오락실 밖에서도 쓸지, 쪽에 놓인 구역을 늘 면 상자로 감쌀지. 추천은 판에서 규칙 · 위계로 적었고 이 기록은 잰 값만 둔다.

## 한눈에

| 질문                      | 잰 곳                                      | 값 묶음                                                                          | 근거              |
| ------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------- | ----------------- |
| 두 칸 비율 · 넓은 칸 자리 | 실제 서비스 35곳 · 42쪽, 디자인 시스템 6곳 | 넓은 칸 왼쪽 36쪽(비 1.41–3.89, 1.8–2.1 구간 8쪽) · 좁은 칸 왼쪽 4쪽 · 1 : 1 2쪽 | 서비스 30곳 채움  |
| 옆 열 구역 구분           | 15쪽                                       | 상자 따로 6 · 선 1 3 · 간격만 6 · 면 띠 0                                        | 선 1 은 근거 약함 |
| 쪽 구역의 면              | 35곳 눈 판정 + 2026-11-02 기록 24곳 인용   | 구역마다 상자 10 · 옆 열 · 일부만 상자 8 · 면 없음 17                            | 30곳 채움         |

## 방법

- 2026-11-27, headless Playwright(Chromium), colorScheme dark, 1920 × 1080, en-US, 로그아웃. 브라우저마다 `~/noslog-research/wait-capacity.sh` 를 먼저 불렀다. 동의 · 로그인 단추는 누르지 않았다.
- 두 칸 줄은 쪽 맨 위 2600 안에서 높이 260 이상 · 폭 240 이상인 두 상자가 나란히 놓인 가장 넓은 짝을 DOM 으로 쟀다(상자 겉 폭). 후보마다 겹침 그림을 직접 열어 진짜 쪽 구조인 곳만 남겼다. 밝은 화면으로만 찍힌 곳 · 동의 창이 본문을 가린 곳 · 비공개 · 로딩만 찍힌 곳은 세지 않았다.
- 작업 파일: 공유 노트 `common-layer/stage5/board-5C/` 의 `scripts/`(`run.cjs` · `cols.cjs` · `cols2.cjs`) · `out/` · `out2/` · `out3/` · `evidence.json` · `shots/` · `sheets/`.
- 후보 약 295쪽(처음 약 90 · 이전 프로필 조사 49 · 새 후보 약 150 · 당근 4)을 열어 위 42쪽이 남았다. 막힘(403 · 캡차 · 접근 거부) 35 · 밝은 화면 16.
- 「지금」 칸은 Figma 결정본 사본 캡처다(파일 읽기 권한 없음).

## 두 칸 비율 · 넓은 칸 자리 (42쪽)

| 서비스 · 쪽           | 왼 \| 오른  | 비   | 넓은 칸      | 쪽 주소                                                                                                                                                                                               |
| --------------------- | ----------- | ---- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BeatLeader 프로필     | 1040 \| 400 | 2.60 | 넓은 칸 왼쪽 | https://beatleader.xyz/u/76561198059961776                                                                                                                                                            |
| Chess.com 프로필      | 728 \| 300  | 2.43 | 넓은 칸 왼쪽 | https://www.chess.com/member/hikaru                                                                                                                                                                   |
| 당근 홈               | 600 \| 360  | 1.67 | 넓은 칸 왼쪽 | https://www.daangn.com/kr/                                                                                                                                                                            |
| 당근 알바 상세        | 714 \| 382  | 1.87 | 넓은 칸 왼쪽 | https://jobs.daangn.com/job-posts/28%EC%9D%BC-%EA%B8%B0%EC%97%85%EC%9D%B4%EC%82%AC-%EC%9D%B8%EC%9B%90-%EB%AA%A8%EC%A7%91%ED%95%A9%EB%8B%88%EB%8B%A4-%EB%8B%B9%EC%9D%BC%EC%A7%80%EA%B8%89-oejma7ufgbod |
| 당근 중고차 상세      | 642 \| 642  | 1.00 | 1:1          | https://www.daangn.com/kr/cars/a6-3%EC%84%B8%EB%8C%80-2-0-tfsi-ve8ep36pvuha/                                                                                                                          |
| Docker Hub 이미지     | 1232 \| 608 | 2.03 | 넓은 칸 왼쪽 | https://hub.docker.com/_/nginx                                                                                                                                                                        |
| GitHub 저장소         | 952 \| 328  | 2.90 | 넓은 칸 왼쪽 | https://github.com/facebook/react                                                                                                                                                                     |
| Gitea 조직            | 899 \| 409  | 2.20 | 넓은 칸 왼쪽 | https://gitea.com/gitea                                                                                                                                                                               |
| GitHub 프로필         | 296 \| 896  | 3.03 | 좁은 칸 왼쪽 | https://github.com/torvalds                                                                                                                                                                           |
| Hugging Face 조직     | 434 \| 1046 | 2.41 | 좁은 칸 왼쪽 | https://huggingface.co/meta-llama                                                                                                                                                                     |
| Bangumi 프로필        | 817 \| 350  | 2.33 | 넓은 칸 왼쪽 | https://bgm.tv/user/sai                                                                                                                                                                               |
| Modrinth 프로필       | 908 \| 300  | 3.03 | 넓은 칸 왼쪽 | https://modrinth.com/user/Prospector                                                                                                                                                                  |
| DeviantArt 프로필     | 1140 \| 600 | 1.90 | 넓은 칸 왼쪽 | https://www.deviantart.com/wlop                                                                                                                                                                       |
| Quaver 프로필         | 384 \| 784  | 2.04 | 좁은 칸 왼쪽 | https://quavergame.com/user/1                                                                                                                                                                         |
| Steam 상점 상세       | 824 \| 375  | 2.20 | 넓은 칸 왼쪽 | https://store.steampowered.com/app/1245620/                                                                                                                                                           |
| umami 대시보드        | 630 \| 630  | 1.00 | 1:1          | https://eu.umami.is/share/LGazGOecbDtaIwDr/umami.is                                                                                                                                                   |
| Codeberg 조직         | 899 \| 409  | 2.20 | 넓은 칸 왼쪽 | https://codeberg.org/forgejo                                                                                                                                                                          |
| Bluesky 프로필        | 602 \| 330  | 1.82 | 넓은 칸 왼쪽 | https://bsky.app/profile/bsky.app                                                                                                                                                                     |
| GOG 상세              | 624 \| 424  | 1.47 | 넓은 칸 왼쪽 | https://www.gog.com/en/game/the_witcher_3_wild_hunt                                                                                                                                                   |
| Grafana 대시보드      | 991 \| 492  | 2.01 | 넓은 칸 왼쪽 | https://play.grafana.org/d/000000003/graphite-templated-nested?orgId=1                                                                                                                                |
| OpenDota 프로필       | 765 \| 420  | 1.82 | 넓은 칸 왼쪽 | https://www.opendota.com/players/105248644                                                                                                                                                            |
| crates.io 상세        | 647 \| 250  | 2.59 | 넓은 칸 왼쪽 | https://crates.io/crates/serde                                                                                                                                                                        |
| GitHub 이슈           | 872 \| 320  | 2.73 | 넓은 칸 왼쪽 | https://github.com/facebook/react/issues/10000                                                                                                                                                        |
| GitHub 조직           | 960 \| 320  | 3.00 | 넓은 칸 왼쪽 | https://github.com/vercel                                                                                                                                                                             |
| Hugging Face 데이터셋 | 995 \| 384  | 2.59 | 넓은 칸 왼쪽 | https://huggingface.co/datasets/openai/gsm8k                                                                                                                                                          |
| Hugging Face 모델     | 867 \| 613  | 1.41 | 넓은 칸 왼쪽 | https://huggingface.co/meta-llama/Llama-3.1-8B                                                                                                                                                        |
| itch.io 상세          | 593 \| 367  | 1.62 | 넓은 칸 왼쪽 | https://tobyfox.itch.io/deltarune                                                                                                                                                                     |
| Kick 채널             | 1324 \| 340 | 3.89 | 넓은 칸 왼쪽 | https://kick.com/xqc                                                                                                                                                                                  |
| MDN 문서              | 768 \| 297  | 2.59 | 넓은 칸 왼쪽 | https://developer.mozilla.org/en-US/docs/Web/CSS/grid                                                                                                                                                 |
| osu! 비트맵           | 625 \| 275  | 2.27 | 넓은 칸 왼쪽 | https://osu.ppy.sh/beatmapsets/1                                                                                                                                                                      |
| 나무위키 문서         | 1032 \| 320 | 3.23 | 넓은 칸 왼쪽 | https://namu.wiki/w/%EC%97%98%EB%93%A0%20%EB%A7%81                                                                                                                                                    |
| Obsidian 플러그인     | 719 \| 353  | 2.04 | 넓은 칸 왼쪽 | https://obsidian.md/plugins?id=dataview                                                                                                                                                               |
| pkg.go.dev 문서       | 1184 \| 336 | 3.52 | 넓은 칸 왼쪽 | https://pkg.go.dev/net/http                                                                                                                                                                           |
| Tailwind CSS 문서     | 696 \| 288  | 2.42 | 넓은 칸 왼쪽 | https://tailwindcss.com/docs/grid-template-columns                                                                                                                                                    |
| setlist.fm 아티스트   | 780 \| 390  | 2.00 | 넓은 칸 왼쪽 | https://www.setlist.fm/setlists/radiohead-3bd6bc5c.html                                                                                                                                               |
| 치지직 방송           | 1327 \| 353 | 3.76 | 넓은 칸 왼쪽 | https://chzzk.naver.com/live/f722959d1b8e651bd56209b343932c01                                                                                                                                         |
| Hex.pm 패키지         | 855 \| 373  | 2.29 | 넓은 칸 왼쪽 | https://hex.pm/packages/phoenix                                                                                                                                                                       |
| JSR 패키지            | 803 \| 341  | 2.35 | 넓은 칸 왼쪽 | https://jsr.io/@std/path                                                                                                                                                                              |
| Lemmy 커뮤니티        | 990 \| 330  | 3.00 | 넓은 칸 왼쪽 | https://lemmy.ml/                                                                                                                                                                                     |
| Open VSX 확장         | 950 \| 290  | 3.28 | 넓은 칸 왼쪽 | https://open-vsx.org/extension/esbenp/prettier-vscode                                                                                                                                                 |
| Thunderstore 모드     | 1128 \| 354 | 3.19 | 넓은 칸 왼쪽 | https://thunderstore.io/c/lethal-company/p/BepInEx/BepInExPack/                                                                                                                                       |
| RubyGems 젬           | 288 \| 912  | 3.17 | 좁은 칸 왼쪽 | https://rubygems.org/gems/rails                                                                                                                                                                       |

- NosLog 744 | 384 는 비 1.94, 564 | 564 는 1.00 이다.
- 비 구간(넓은 칸 왼쪽 36쪽): 1.4–1.8 4쪽 · 1.8–2.1 8쪽 · 2.1–2.7 13쪽 · 2.7 이상 11쪽.
- Kick · 치지직은 영상 | 채팅 줄이다.

## 옆 열 구역 구분 (15쪽)

- 상자 따로(면 또는 테두리): Docker Hub 16 · Modrinth 프로필 16 · BeatLeader 18 · 당근 홈 24 · Hex.pm 24 · Thunderstore 16.
- 선 1: GitHub 저장소 · Gitea · Codeberg.
- 간격만: GitHub 프로필 61 · Hugging Face 36 · 76 · 당근 알바 16 · JSR 20 · Open VSX 16 · RubyGems 16.
- 면 띠로 가른 다크 서비스: 찾지 못함. Grafana 패널 사이 8 은 대시보드 패널 간격이다.

## 쪽 구역의 면 (눈 판정)

- 구역마다 상자: BeatLeader · Chess.com · Quaver · umami · Grafana · OpenDota · Modrinth · osu! 비트맵 · Bangumi · 당근 홈(10곳).
- 옆 열 · 일부만 상자: Docker Hub · GitHub · Gitea · Codeberg · Steam 상점 · Hex.pm · Thunderstore · Lemmy(8곳).
- 면 없음: Hugging Face · crates.io · itch.io · MDN · pkg.go.dev · Tailwind · 나무위키 · GOG · DeviantArt · Bluesky · Kick · 치지직 · Obsidian · setlist.fm · JSR · Open VSX · RubyGems(17곳).
- 앞 기록 인용: [2026-11-02 프로필 데스크톱](./2026-11-02-desktop-profile.md) 「2열 화면의 구역 담기」 24곳(구역마다 상자 11 · 상자 없음 13).

## 디자인 시스템 (6곳 열어 봄)

| 시스템     | 확인한 것                                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 당근 SEED  | 레이아웃 12컬럼 · gutter 24 · column span 으로 중요도에 따라 폭을 정함(비율 규격 없음). Divider thickness 0 또는 1(면 띠 규격 없음). 카드 문서 없음 |
| Material 3 | supporting pane 주 영역 대략 3분의 2 · 나머지 보조. 카드는 간격 · 제목 · 구분선으로 되면 억지로 카드에 넣지 않는다                                  |
| GOV.UK     | two-thirds                                                                                                                                          | one-third 열 · 요약 카드는 목록마다 따로 카드와 제목 |
| Atlassian  | 그리드 안에서는 컨테이너만 열에 맞추고 안쪽은 space 토큰. 평평한 카드는 elevation.surface 에 테두리                                                 |
| Ant Design | 24분할 · gutter 16 + 8n · Divider · Card                                                                                                            |
| Carbon     | 패딩 16 · 타일 문서는 404                                                                                                                           |

Primer(PageLayout 시간 초과) · Polaris(Layout 문서가 다른 쪽으로 열림)는 미확인.

## 막힘 · 세지 않은 곳

- 막힘: op.gg · u.gg · Lichess · Letterboxd · Codeforces · LeetCode · HackerRank · Speedrun · IGDB · IMDb · TMDB · Trakt · npm · Genius · 솔브드 · Last.fm · Backloggd · Product Hunt · Figma · 리디 · 왓챠 외.
- 밝은 화면: ESPN Basketball · Bugs · DEV · Kaggle · Inflearn · Packagist · Open Collective · Grafana 플러그인 · Metacritic · Our World in Data · Melon · StackShare · PyPI · Wikipedia · YouTube · Roblox · 네이버 지도 · MapleGG · AtCoder.
- 동의 창이 가림: Deezer · Komoot · Mixcloud · Premier League · SoundCloud. 비공개: Steam 프로필. 로딩만: GitLab 저장소.
