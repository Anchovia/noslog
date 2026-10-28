# 판정 이름

`JudgementMarker` — `components/ui/judgement-marker.tsx` 의 `judgementLabels`

- 표기는 늘 `◆JUST · JUST · GOOD · NEAR · MISS`(대문자).
- 빙고 문구 안 용어는 `BingoTermHelp` 가 대소문자 무관으로 찾아 이 표기로 보여 준다.
- 판정 색은 `judgement/*`. 색 표시는 원 8.
- 악곡 상세(판정 분석 · 최근 판정 추이 · 최근 플레이)는 NEAR 를 보여 주지 않는다 — 게임에서 거의 켜지 않는 옵션이다. 합계 · 비율 계산에는 넣는다.

## 바뀐 기록

- [2026-09-18 악곡 상세 NEAR 제외](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-18)
- [2026-09-14 판정 이름 표기](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-14)
