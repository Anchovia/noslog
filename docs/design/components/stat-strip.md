# 수치 띠

`StatStrip` — 핵심 숫자 몇 개(최대 5)를 한 줄에

## 모양

- 칸 = 값(`nl-entity-title` 조합 16/24 · 600) 위, 라벨(`nl-metadata` 흐림) 아래. 값 뒤 보조 단위(`unit`, 순위 「/ 1,234」 · 「판」)는 `nl-body-secondary` 흐림 · 사이 4 · 기준선 맞춤.
- 칸 면 `surface/surface` · 칸 안쪽 위아래 12 · 좌우 8 · 칸 최소 64 · 칸 사이 1px `border/divider`(gap + divider 바탕이라 좁아서 줄바꿈해도 선이 맞음) · 상자 모서리 `radius/control`.
- 큰 숫자(32) 대신 이것을 쓴다. 새 글자 단계를 만들지 않는다.
- 넓은 폭 세로 목록 변형 `nl-stat-strip--wide-list` — 칸 = 컨트롤 높이 · 라벨 왼쪽 · 값 오른쪽 · 안쪽 12.

## 값이 없을 때

- 값이 없는 칸은 만들지 않는다(「—」 칸 없음). 예외는 악곡 머리 「공식 레벨」 칸 하나 — 값이 없으면 흐린 「—」.
- 새 값을 받는 중(`pending`)이면 이전 값을 그대로 두고 값 · 그레이드 숫자 · 진행 막대를 `content/subdued` 으로.

## 값 색 `tone`

값 색을 받는 칸은 `nl-toned` + `data-tone`.

| 값           | 색                                                                                                                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 순위         | 순위표와 같음 — 1 · 2 · 3 = `exam/tier-top` · `high` · `mid`, 그 밖 `content/subdued`                                                                                                               |
| 점수         | 점수 목표 색 `--nl-score-goal-*` — 950k 이상 S 노랑 · 990k 이상 살구 · 100만 Pianist 분홍(FC 무시)                                                                                                  |
| Grd · 레이팅 | 구간 색 `--nl-grade-band-1…5`(기준값 `GRADE_BAND_CUTS`) — 6,000 아래 기본 · 6,000 판정 NEAR 파랑 · 6,500 GOOD 하늘 · 7,000 S 노랑 · 7,500 990k 살구 · 8,000 Pianist 분홍. 두 모드 · 두 값 같은 기준 |
| 등급         | S 노랑 · P 분홍 · A+ · A · B 는 별칭 `--nl-score-grade-*`(A+ = `difficulty/text-expert` · A = `difficulty/expert` · B = `local-data/single`, 막대 색에만)                                           |
| 최대 콤보    | FC(fc_type 2 이상 · Pianist)면 `achievement/full-combo` 초록                                                                                                                                        |

- 단계가 이어지는 값(서열 값)은 `tone` 대신 항목 `color` 로 값 글자색을 직접 준다.
- 같은 Grd · 레이팅 숫자는 어디서나 같은 색이다(보이는 숫자 기준). 프로필 머리 수치 상자 · 유저 랭킹 값 · 성장 추이 요약 줄(시작 · 현재) · 공유 카드(이미지라 `STAT_TONE_DARK_HEX` 다크 값, 테스트가 토큰과 대조).

## 위 칸

`StatStrip header` — 이 수치를 보는 사람의 값 한 줄(악곡 머리 「내 최고 기록」)을 같은 상자 위 칸에 둔다. 위 칸 · 수치 띠 · 아래 칸 사이는 수치 띠와 같은 gap 1 + divider 선, 상자 전체 모서리 `radius/control`(`nl-stat-card`). 위 칸 안 모양은 그 화면 문서가 정한다.

## 아래 동작 줄

`StatStrip footer` + `nl-action-group` — 수치 띠에 딸린 이동 링크 2–3개를 같은 상자 아래 칸에 둔다.

- 칸 = 같은 폭 · 사이 1px 선(수치 띠와 같은 gap + divider) · 컨트롤 L 높이 · `surface/surface` 면.
- 글자 `nl-emphasis-label` `content/default` + 끝 › 16 `content/subdued`(사이 4) — › 가 누를 곳 표시.
- 올림 `interaction/row`.
- 없는 동작도 칸은 두고 글자 · › 를 `content/disabled` 로 둔다. 반응은 없다.

## 바뀐 기록

- [2026-10-27 부품 · 자리마다 쓰는 토큰을 Adobe 것으로 바꿈](../../decisions/2026-10-27-spectrum-components.md)
- [2026-10-27 가이드 다시 대조](../../decisions/2026-10-27-guide-audit-2.md)

- [2026-10-26 Geist 색 · 모서리 · 포커스](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 모서리 · 값 글자 조합](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-24 토큰 정리 — 무채색 · 포커스 · 덧붙인 접근성 정리](../../decisions/2026-10-24-token-cleanup.md)
- [2026-10-01 수치 띠 칸 위아래 안쪽](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-01)
- [2026-09-26 등급 색](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-26)
- [2026-09-19 Grd 구간 색](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-19)
- [2026-09-17 수치 띠 값 색 · 아래 동작 줄](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-17)
- [2026-09-16 수치 표시 모양](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-16)
