# 쪽 머리 묶음 아래 끝에서 첫 구역 위까지 (2026-11-27)

공통 층 5단계 판 5-A 재료다. 앞 기록 [쪽 머리](./2026-11-25-page-head.md) · [간격 눈금](./2026-11-17-spacing-scale.md)의 머리 띠에서 쪽 제목까지(32) 는 다시 재지 않았다. 이번에 새로 잰 것은 상세 쪽 머리 묶음(머리 상자와 머리 안 탭 줄) 아래 끝에서 첫 구역 위까지다.

확인 2026-11-27, PC 1920 × 1080, `colorScheme: 'dark'`, 로그아웃, headless Playwright. 값은 계산값으로, 머리 묶음 아래 끝(탭 줄이 있으면 탭 줄 상자 아래, 없으면 마지막 머리 요소 아래)에서 첫 구역(상자가 있으면 상자 위, 없으면 첫 제목 줄 위)까지다. 캡처는 공유 메모 `common-layer/stage5/board-5A/shots/m-<곳>.png`(머리 끝 선과 첫 구역 선을 그림), 원자료 `json/points-result.json`, 스크립트 `scripts/measure3.cjs` · `points.json`.

## 실제 서비스 30곳 (탭 있는 20 · 없는 10)

| 번호 | 서비스                       | 값  | 잰 두 점                                                 | 비고                                                   | 캡처                    |
| ---- | ---------------------------- | --- | -------------------------------------------------------- | ------------------------------------------------------ | ----------------------- |
| 1    | Kick xQc 채널                | 24  | 탭 줄 아래 끝부터 「스트리밍 동영상」 제목 줄 위까지     |                                                        | `m-kick.png`            |
| 2    | Thunderstore Valheim 모드 쪽 | 24  | 탭 줄 아래 끝부터 첫 그림 위까지                         |                                                        | `m-thunderstore.png`    |
| 3    | GitHub 조직 vercel           | 25  | 탭 줄 아래 끝부터 「Pinned」 제목 줄 위까지              |                                                        | `m-github-org.png`      |
| 4    | Modrinth Sodium 프로젝트     | 25  | 탭 줄 아래 끝부터 설명 상자 위까지                       | 사용자 쪽은 탭 없음 45(구분선 있음)                    | `m-modrinth.png`        |
| 5    | Twitch Monstercat 정보       | 26  | 탭 줄 아래 끝부터 「정보」 제목 줄 위까지                | 사용자 쪽 26, 카테고리 쪽은 필터 줄이 끼어 35          | `m-twitch.png`          |
| 6    | Quaver 사용자 1              | 28  | 머리 상자(배지 줄) 아래 끝부터 통계 상자 위까지          | 탭이 머리 상자 안                                      | `m-quaver.png`          |
| 7    | SteamGridDB 게임 쪽          | 28  | 탭 줄 아래 끝부터 「Top Grids」 제목 줄 위까지           |                                                        | `m-steamgriddb.png`     |
| 8    | Lolalytics Ahri 빌드         | 31  | 탭 줄 아래 끝부터 첫 막대 상자 위까지                    |                                                        | `m-lolalytics.png`      |
| 9    | Docker Hub nginx             | 33  | 탭 줄 아래 끝부터 첫 상자 위까지                         | 제목 줄 위는 58, 상자 위 33(상자 위 399 − 탭 아래 366) | `m-dockerhub.png`       |
| 10   | GameBanana 모드 쪽           | 34  | 탭 줄 아래 끝부터 「Credits」 제목 줄 위까지             |                                                        | `m-gamebanana.png`      |
| 11   | OpenDota 플레이어 쪽         | 36  | 탭 줄 아래 끝부터 필터 칸 줄 위까지                      |                                                        | `m-opendota.png`        |
| 12   | Tidal 아티스트 쪽            | 40  | 탭 줄 아래 끝부터 「Top Tracks」 제목 줄 위까지          |                                                        | `m-tidal.png`           |
| 13   | Hugging Face 모델 쪽         | 41  | 탭 줄 아래 끝부터 본문 제목 줄 위까지                    | 데이터셋 쪽은 25                                       | `m-huggingface.png`     |
| 14   | Audius 아티스트 쪽           | 46  | 탭 줄 아래 끝부터 첫 트랙 상자 위까지                    |                                                        | `m-audius.png`          |
| 15   | JSR 패키지 쪽                | 57  | 탭 줄 아래 끝부터 본문 첫 줄 위까지                      | 오른쪽 열 첫 칸은 35                                   | `m-jsr.png`             |
| 16   | Mastodon 프로필              | 16  | 탭 줄 아래 끝부터 필터 줄 위까지                         |                                                        | `m-mastodon2.png`       |
| 17   | 카카오웹툰 작품 쪽           | 16  | 탭 줄 아래 끝부터 「첫 화 보기」 단추 위까지             |                                                        | `m-kakaowebtoon.png`    |
| 18   | Obsidian 플러그인 쪽         | 21  | 탭 알약 아래 끝부터 상자 위까지                          |                                                        | `m-obsidian-plugin.png` |
| 19   | ProtonDB 게임 쪽             | 21  | 탭 줄 아래 끝부터 목록 도구 줄 위까지                    |                                                        | `m-protondb.png`        |
| 20   | Bluesky 프로필               | 9   | 탭 줄 아래 끝부터 첫 글 위까지                           | 타임라인 글이라 구역이 아님, 근거에서 약하게 봄        | `m-bluesky2.png`        |
| 21   | MDN CSS 속성 쪽              | 20  | 호환 상자 아래 끝부터 첫 문단 위까지                     |                                                        | `m-mdn.png`             |
| 22   | lib.rs 크레이트 쪽           | 21  | 단추 줄 아래 끝부터 첫 정보 줄 위까지                    |                                                        | `m-lib-rs.png`          |
| 23   | Lutris 게임 쪽               | 22  | 제목 아래 줄 끝부터 첫 그림 위까지                       |                                                        | `m-lutris.png`          |
| 24   | Vercel 템플릿 템플릿 쪽      | 32  | 단추 줄 아래 끝부터 그림 상자 위까지                     |                                                        | `m-vercel-template.png` |
| 25   | RAWG 게임 쪽                 | 32  | 단추 줄 아래 끝부터 「About」 제목 줄 위까지             |                                                        | `m-rawg.png`            |
| 26   | Spotify 아티스트 쪽          | 32  | 재생 줄 아래 끝부터 「인기」 제목 줄 위까지              | 재생 줄 높이 56                                        | `m-spotify-artist.png`  |
| 27   | BeatLeader 플레이어 쪽       | 31  | 머리 상자 아래 끝부터 통계 상자 위까지                   |                                                        | `m-beatleader2.png`     |
| 28   | ScoreSaber 플레이어 쪽       | 38  | 순위 요약 아래 끝부터 그래프 상자 위까지                 |                                                        | `m-scoresaber2.png`     |
| 29   | Apple Music 아티스트 쪽      | 35  | 재생 줄 아래 끝부터 「Featured Playlist」 제목 줄 위까지 |                                                        | `m-apple-music.png`     |
| 30   | Zed 확장 쪽                  | 110 | 제목 줄 아래 끝부터 「Details」 제목 줄 위까지           | 마케팅 꼴 쪽이라 값이 큼                               | `m-zed-ext.png`         |

## 묶어 보기 (값 ±2, 한 서비스는 한 번)

- 16: 2곳(탭 2) Mastodon · 카카오웹툰
- 20: 5곳(탭 2) Obsidian · ProtonDB · MDN · lib.rs · Lutris
- 24: 5곳(탭 5) Kick · Thunderstore · GitHub · Modrinth · Twitch
- 32: 7곳(탭 3) Lolalytics · Docker Hub · GameBanana · Vercel 템플릿 · RAWG · Spotify · BeatLeader
- 40: 3곳(탭 2) Tidal · Hugging Face · ScoreSaber
- 눈금 밖: 8곳(탭 6) Quaver · SteamGridDB · OpenDota · Audius · JSR · Bluesky · Apple Music · Zed

탭 있는 20곳에서는 24 가 5곳으로 가장 많고, 전체 30곳에서는 32 가 7곳으로 가장 많다. 40 은 3곳(탭 2)이라 근거 약함.

## 디자인 시스템 9곳 (이 자리 값을 문서에 둔 곳 0곳)

| 체계               | 연 문서                                            | 내용                                                                                                        |
| ------------------ | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 당근 SEED          | Layout 문서(seed-design.io/docs/foundation/layout) | 거터 24 · 마진 32만 있고 쪽 머리 아래 간격은 SEED 규격 없음                                                 |
| GitHub Primer      | PageHeader · PageLayout 문서                       | 머리 아래 간격 값이 문서에 없음. PageLayout 영역 사이 24(2026-11-17 기록 인용)                              |
| IBM Carbon         | Spacing 토큰 문서(페이지 머리 패턴 주소는 404)     | 토큰 단계만 있고 규격 없음, 머리 패턴은 미확인                                                              |
| Atlassian          | Page header · Spacing 문서                         | 토큰 0 · 80 단계만 있고 머리에서 구역까지 규격 없음                                                         |
| Shopify Polaris    | Page 문서                                          | 쪽 안에서 열린 문서가 컴포넌트 본문이 아니어서 미확인                                                       |
| GOV.UK             | Spacing 문서                                       | 단계 표만 있고 머리 아래 규격 없음. 본문에서 H2 까지 40(2026-11-17 기록 인용)                               |
| Material 3         | Spacing 문서                                       | 묶음 · 주목 · 표현 원칙만 있고 값 없음                                                                      |
| Microsoft Fluent 2 | Layout 문서                                        | 원칙과 크기 단계만 있고 머리 규격 없음. 쪽 예시 탭에서 내용까지 48(2026-11-17 기록 인용, 이번에 다시 안 봄) |
| Ant Design         | Layout 규격 문서                                   | 8 배수 격자만 있고 값 규격 없음                                                                             |

당근 공개 웹(board-1 daangn.json)은 이번에 재지 않았다.

## 세지 않은 곳

확인 창이나 접근 차단, 밝은 화면, 동의 창이 가린 곳, 쪽이 없는 곳, 머리와 첫 구역이 갈리지 않는 곳의 이름은 판(아티팩트 `판 5-A 쪽 머리 아래 간격`) 맨 아래 「세지 않은 곳」에 있다. 이 기록에서 값이 흔들려 뺀 곳은 Chess.com(광고 자리가 비어 168), Raycast(탭 아래 구분선 때문에 63 과 33 두 값), osu!(탭이 상자 안), Hugging Face 사용자(머리 면 경계가 모호해 93)다.

## 한계

- Figma 결정본 파일은 읽기 권한이 없어 create_session 이 거절됐다. 「지금」 칸은 공유 폴더 `stage-base` 캡처 10 · 04 를 쓴다. 이 캡처에서 읽은 값은 악곡 상세 24, 프로필 14픽셀(0.945배)이고 인벤토리 메타데이터는 두 화면 모두 40이라 서로 다르다.
- Docker Hub 는 코드 계산으로 상자 위 33(제목 줄 위는 58)이고, Spotify 는 캡처에 선이 그려지지 않아 숫자만 확인했다(재생 줄 상자 아래 576, 제목 줄 위 608).
- 양쪽 점은 쪽마다 눈으로 고른 지점에서 요소를 찾았다. 자동 판정이 아니다.
