# 사진 뷰어

`PhotoViewer` — 사진을 크게 보는 자리. 대화상자가 아니라 모든 폭에서 화면을 채운다.

## 모양

- 바탕 `surface/canvas`(새 색 없음) · 사진 `contain` · 시스템 영역은 safe-area 로 피한다. 층은 전체 화면 층(`--nl-layer-fullscreen`)이다.
- 조작부는 사진 위 어두운 판(카운터와 같은 문법, `surface/media-scrim` · `content/on-media`).
    - 닫기 24 오른쪽 위 8.
    - ‹ › 컨트롤 높이 정사각 · 좌우 8 · 세로 가운데(폰 포함).
    - 아래 칸 「N / M」 `nl-metadata` →8→ 썸네일 줄(컨트롤 높이 · 4 : 3 · `radius/small` · 사이 8 · 고른 것은 `border/ring` 2 테두리 · 안 고른 것은 `--nl-disabled-opacity`, 넘치면 가로 스크롤).
- 격자 단계는 두지 않는다.

## 동작

- Esc · 닫기 · 뒤로 가기로 닫힌다(`useOverlayHistory`, 주소는 그대로). 닫으면 눌렀던 사진으로 포커스가 돌아온다.
- 키보드 ← → 로 넘긴다. 밀어 넘김만 두지 않는다(‹ › 를 늘 둔다).
- 어느 사진을 눌러도 그 사진으로 바로 열린다.
- 나타날 때 · 사라질 때 움직임은 대화상자와 같다([기초값 — 움직임 ④](../foundations.md#움직임)).

## 바뀐 기록

- [2026-10-27 가이드 다시 대조](../../decisions/2026-10-27-guide-audit-2.md)

- [2026-10-27 가이드 고를 곳 — 뷰어 층 · 안 고른 썸네일 표시](../../decisions/2026-10-27-guide-choices.md)
- [2026-10-26 Geist 색 · 모서리 · 포커스 — 썸네일 모서리](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-09-23 오락실 사진 뷰어 모양](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-23)
