# 역사로만 남은 `docs/archive/` 지우기

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 구조
- 고른 사람: 사용자(추천대로)

## 맥락

[문서 체계 재정비](./2026-10-24-docs-structure.md) 5번으로 9월 감사 기록 · 다른 리포 비교 · 로딩 시안을 `docs/archive/` 에 옮겼다. `AGENTS.md` 는 감사 문서와 옛 비교를 폐기로 정해 읽지도 인용하지도 않게 했으므로, 남겨 두면 에이전트가 잘못 읽을 위험만 있었다.

## 결정

`docs/archive/` 를 지운다. 옛 내용은 git 기록에만 남는다. 결정 기록 보관 파일(`docs/decisions/archive/`)은 가이드 「바뀐 기록」 이 링크하므로 그대로 둔다.

## 고르지 않은 안

- 그대로 두기 — 폐기로 정한 문서가 리포에 남아 검색에 걸린다.

## 근거

- `AGENTS.md` 「무엇을 기준으로 하나」 의 폐기 목록(감사 문서 · 옛 비교).
- 링크하던 곳은 `docs/ui/README.md` 한 줄과 `AGENTS.md` 한 줄뿐이었다.

## 바뀌는 곳

- 문서: `docs/archive/` 삭제(`code-style-audit.md` · `frontend-comparison.md` · `design-drafts-loading/`) · `docs/ui/README.md` 보관 문서 링크 · `AGENTS.md` 되살리기 금지 줄 · 결정 색인.
