# 로딩 표시 조사 (2026-09-19)

시안: [loading-states.html](loading-states.html). 이 문서는 시안의 근거만 모은다. 규칙 원본은 결정 뒤 [디자인 가이드](../../README.md)에 옮긴다.

## 1. 지금 NosLog

| 상황           | 지금                                                                                                                                                                  | 측정                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 사이트 안 이동 | 눌러도 이전 화면이 그대로, 표시 없음                                                                                                                                  | 운영 noslog.app, 홈에서 링크 클릭 → 주소가 바뀌기까지 악곡 0.86s · 랭킹 0.59s · 서열 0.51s · 빙고 0.65s · 오락실 0.66s · 검정 0.70s · 이벤트 0.25s(헤드리스 Chromium, 제한 없음) |
| 첫 진입        | 서버가 다 그릴 때까지 빈 화면 → 한 번에                                                                                                                               | 운영 악곡 상세 · 랭킹 첫 진입 load 약 3.0s                                                                                                                                       |
| `loading.tsx`  | 27개 화면 중 `profile/[id]` 한 곳                                                                                                                                     | 코드                                                                                                                                                                             |
| 화면 안 데이터 | 글자 한 줄: 「서열 데이터를 불러오는 중입니다.」 · 「지도를 불러오는 중입니다.」 · 「프로필을 불러오는 중입니다.」 · 「불러오는 중…」 · 「빙고를 불러오는 중입니다.」 | 운영 서열 · 오락실은 이동 뒤에도 글자만                                                                                                                                          |
| 스켈레톤       | `nl-skeleton`(면 `surface/sunken` · 모서리 4 · 펄스 `--nl-motion-loop-pulse` 1.6s): 악곡 상세 탭 · 의견 목록 · 설정 · 프로필 로딩 · `RecordListSkeleton`              | 코드                                                                                                                                                                             |

## 2. 디자인 가이드 7곳 (공식 문서를 렌더링해 읽음)

- **IBM Carbon** — https://carbondesignsystem.com/patterns/loading-pattern/ · /components/loading/usage/ · /components/inline-loading/usage/
    - 첫 페이지 로드 = 스켈레톤(움직임으로 「멈추지 않음」을 알림). 틀 · 데이터가 있는 부품(타일 · 표 · 카드)만. 토스트 · 메뉴 · 모달 · 로더는 스켈레톤으로 그리지 않음.
    - 스피너는 3초를 넘을 때. 로딩 표시를 여러 개 동시에 띄우지 않음. 인라인 로딩 완료 상태 1.5s.
- **Material 3** — https://m3.material.io/components/progress-indicators/guidelines · /components/loading-indicator/guidelines
    - 200ms 미만 표시 없음 · 200ms–5s loading indicator · 5s 초과 progress. 여러 항목은 표시 하나로 묶음. 선형은 페이지 · 카드 가장자리, 원형은 영역 가운데. 버튼 안 원형 가능.
- **Atlassian** — https://atlassian.design/components/skeleton/usage · /components/spinner/usage
    - 스켈레톤은 실제 내용과 크기 · 모양을 맞춤, shimmer 는 체감될 때만(짧은 로딩 · 조밀한 목록엔 피함). 스피너는 1초를 넘을 때, 한 페이지에 하나, 리듀스드 모션 예외(멈추면 멈춘 것처럼 보임).
- **GitHub Primer** — https://primer.style/product/ui-patterns/loading/ · /components/spinner/ · /components/skeleton-box/
    - 1초 미만 표시 없음 · 1–3s indeterminate · 3–10s determinate · 10s 초과 백그라운드. `delay` 옵션 'short' 300ms / 'long' 1000ms. 인접 표시는 하나로. 실패 = 메시지 + 재시도. `aria-busy`, 안내 한 번.
- **Apple HIG** — https://developer.apple.com/design/human-interface-guidelines/loading
    - 가능한 한 빨리 무언가를(빈 화면 대신 자리표시). 표시는 계속 움직임.
- **Fluent 2** — https://fluent2.microsoft.design/components/web/react/core/skeleton/usage · /spinner/usage · /progressbar/usage
    - 스켈레톤 1초 넘는 로딩, 구조를 모르면 스피너. 여러 스켈레톤 애니메이션 동기화. 탭처럼 고정된 부분은 스켈레톤으로 그리지 않음. 진행 막대는 애니메이션 한 바퀴를 마치고 전환.
- **Nielsen Norman Group** — https://www.nngroup.com/articles/response-times-3-important-limits/ · /articles/skeleton-screens/ · /articles/progress-indicators/
    - 0.1s 즉각 · 1s 흐름 유지 · 10s 주의 한계. 스켈레톤 = 10초 미만 전체 페이지, 스피너 = 한 모듈. 틀만 있는 스켈레톤 비권장. 펄스는 산만할 수 있음.

**3곳 이상 일치** — 아주 짧은 로딩은 표시 안 함 · 페이지 = 스켈레톤 / 부분 = 스피너 · 로딩 표시는 하나로 · 대상 가까이 · 레이아웃이 튀지 않게 · 버튼은 안/옆 스피너로 다시 못 누르게 · 무엇을 불러오는지 알리고 끝나면 알림.
**규칙 없음(미확인)** — 스켈레톤 안 스피너 허용 여부 · 최소 표시 시간.

## 3. 실서비스 15곳 실측

headless Chromium · CPU 4배 느리게 · 지연 400ms · 1280×800. 첫 로딩 + 사이트 안 이동 1회. 봇 차단 사이트는 우회하지 않고 대체(chess.com · tracker.gg · op.gg · coingecko · medium · reddit 등).

| 사이트                                                | 첫 로딩                                       | 스켈레톤 움직임                | 사이트 안 이동                                           |
| ----------------------------------------------------- | --------------------------------------------- | ------------------------------ | -------------------------------------------------------- |
| osu!                                                  | 서버 렌더 → 이미지 점진, 사진 자리 회색       | 없음                           | 노란 3px 위 막대 + 이전 화면 유지                        |
| GitHub                                                | 서버 렌더                                     | 이동 뒤 개수 자리 shimmer 1.5s | 파란 3px 위 막대 + 유지 → 새 화면의 개수 자리만 스켈레톤 |
| YouTube                                               | 머리 스켈레톤만                               | 정적                           | 빨간 2px 위 막대 + 유지                                  |
| Airbnb                                                | 최종 레이아웃과 같은 스켈레톤                 | 이동 때 pulse 1.3s             | 목록만 스켈레톤, 지도 유지                               |
| Twitch                                                | 머리 스켈레톤 + 가운데 스피너 → 카드 스켈레톤 | shimmer 2.0s(10회 뒤 멈춤)     | 본문 비우고 가운데 스피너 → 스켈레톤                     |
| Bluesky                                               | 스플래시 → 게시물 모양 스켈레톤               | 정적                           | 목록만 스켈레톤                                          |
| Sofascore                                             | 섹션 제목은 실제 글자, 행만 스켈레톤          | 정적                           | 미확인                                                   |
| Spotify                                               | 빈 화면                                       | 점 3개 1.32s                   | 본문 비우고 점 로더                                      |
| lichess · steamcharts · vlr.gg · huggingface · notion | 서버 렌더                                     | 없음                           | 표시 없이 이전 화면 유지                                 |
| letterboxd · anilist                                  | 서버 렌더 + 포스터 자리                       | 없음                           | 미확인                                                   |

- 스켈레톤 6곳(모두 최종 레이아웃 모양) · **스켈레톤 안 스피너 0곳** · 위 막대 3곳(모두 이동 때만, 이전 화면 유지) · 이전 화면을 흐리게 0곳.
- 스켈레톤 움직임: shimmer 1.5–2.0s 2곳 · pulse 1.3s 1곳 · 정적 3곳. 스피너 0.8–1.0s.
- 한계: 사이트마다 한 번씩만 쟀다. 네트워크 조건이 실제 사용자와 다르다.
