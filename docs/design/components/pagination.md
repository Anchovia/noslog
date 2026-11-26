# 쪽 번호

`Pagination`

## 모양

- 항목 = 32 정사각(xsmall) · 숫자 사이 6 · `radius/full` · 글자 14/20 · 400 · `content/default`. 줄 안쪽은 위아래 24 · 좌우 16. 올림 · 누름 · 키 포커스에 면 `interaction/row` · 글자 `content/strong`(Spectrum 2 ActionButton quiet). 비활성 항목은 면 없이 글자 `content/disabled`.
- 지금 쪽 = 반전 면 `primary/default` + `primary/on-primary` 글자 + 700 · 선 없음(고른 칩과 같은 규칙). 지금 쪽은 올림 반응이 없다.

## 동작

- 현재 page 와 이동 콜백 또는 href 를 받는다. busy 는 새 이동을 막는다.
- 한 쪽뿐이면 기본으로 숨고, `showSingle` 일 때만 보인다.
- 한 쪽의 줄 수는 화면 문서가 정한다(순위표 20).

## 바뀐 기록

- [2026-11-26 공용 부품 4단계 — 크기 단계 · 역할 변수 · 모서리](../../decisions/2026-11-26-components-stage4.md)
- [2026-10-27 부품 · 자리마다 쓰는 토큰을 Adobe 것으로 바꿈](../../decisions/2026-10-27-spectrum-components.md)
- [2026-10-26 Geist 색 · 모서리 · 포커스 — 지금 쪽 색](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 모서리](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-24 컨트롤 높이](../../decisions/2026-10-24-conflict-choices.md)
- [2026-10-21 지금 쪽 표시](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-21)
- [2026-10-15 순위표 한 쪽 인원](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-15)
