# 버튼

`Button` · `ActionButton` · `ButtonLink` · `IconButton` — `components/ui/button.tsx` 외

## 쓰는 곳

- 저장 · 보내기 · 창 열기 같은 동작. 화면 이동은 링크 모양이면 링크, 버튼 모양이면 `ButtonLink`.
- `ButtonLink` 는 기존 버튼 클래스(`foundationButtonClass`)를 그대로 쓴다. 일반 이동은 `IntentLink`, OAuth · 외부 주소 · 북마클릿은 `plain`(네이티브 `a`).

## 쓰지 않는 곳

- 글 안 이동 — 링크.
- 누르는 즉시 켜고 끄기 — [스위치](./form-controls.md).

## 변형

| 변형   | 면 · 글자                                                                               | 쓰는 곳                                   |
| ------ | --------------------------------------------------------------------------------------- | ----------------------------------------- |
| 주     | `primary/default` · `on-primary`                                                        | 한 영역의 주 동작                         |
| 보조   | `surface/control` 면 · 선 없음 · `content/default`                                      | 나머지 동작                               |
| 고스트 | 면 없음 · `content/strong` · medium                                                     | 줄 안 보조 · 제목 줄의 동작 · 정렬 트리거 |
| 위험   | `variant="danger"` · `feedback/destructive-surface` · `on-destructive` (채운 빨강 하나) | 되돌릴 수 없는 일을 확정하는 버튼         |

- 누르는 것은 면으로 구분한다. 밝은 면(주) › 어두운 면(보조) › 글자만(고스트).
- 모양은 Spectrum 2 Button(주 = primary fill · 보조 = secondary fill · 위험 = negative)과 ActionButton quiet(고스트)이다. 모서리는 모든 변형 `radius/control`, 글자는 `nl-control` 크기에 bold(`--nl-type-weight-strong`)다.
- 보조 · 고스트는 올리면 면 `surface/control-hover` · 글자 `content/strong` 이다. 누르면 원근 안에서 2px 들어간다([기초값 — 올림 · 누름](../foundations.md#올림--누름)).
- 면 없는 누르는 것(헤더 로그인 · ≡ · 쪽 번호 · 스테퍼 버튼 · 검색칸 안 버튼 · 좋아요 · 답글 토글 · 미디어 위 버튼)도 고스트와 같은 ActionButton quiet 올림을 쓴다. 모서리는 그 요소 것이다.
- 위험 버튼은 확인 창 안의 마지막(확정) 버튼에만 쓴다. 그 창을 여는 버튼 · 신고 버튼은 보조다. 빨간 테두리 · 빨간 글자 모양은 쓰지 않는다.

## 크기

- 기본 `size="md"` = 주 · 보조 · 위험은 `--nl-control-height-large`(Spectrum 2 Button L, 모든 폭), 고스트 · 아이콘 버튼은 `--nl-control-height` · 작게 `size="sm"` = `--nl-control-height-compact` · 크게 `size="lg"` = `--nl-control-height-large`. 같은 줄은 한 단계([기초값 — 높이](../foundations.md#높이)).
- 좌우 안쪽은 모든 크기에서 제 높이 ÷ 2(기본 · 크게 `--nl-control-height-large`, 작게 `--nl-control-height-compact`)이고, 경계 1 을 뺀다. 고스트만 좌우 12 − 1 이다. 위아래 여백 없이 높이로 맞춘다.
- 아이콘 ↔ 글자 사이는 6(`calc(var(--nl-spacing-4) + var(--nl-spacing-2))`)이다.
- 페이지에서 크기를 덮어쓰지 않는다. 칸이 좁으면 열 수를 줄인다(주 동작 한 줄 + 보조 두 열).
- 넓은 폭에서 한 줄을 다 쓰는 자리의 주 버튼은 내용 폭 · 왼쪽(데이터 동기화 로그아웃 「로그인」). 폰 · 좁은 열 안은 폭 가득.
- 버튼 줄 `nl-button-row` — 버튼 하나면 폭 가득, 둘이면 같은 폭 둘(사이 8).

## 상태

- 올림 = 주 `primary/hover`, 보조 · 고스트 `surface/control-hover` + `content/strong`, 위험 `feedback/destructive-hover`. 누름 · 키 포커스도 같은 색이고 누름 전용 색은 없다.
- 누름 = `perspective(max(제 높이, 24px)) translate3d(0, 0, -2px)`(Spectrum 2 pressScale, 즉시). 폭 ÷ 3 은 CSS 로 읽지 못해 견주지 않는다.
- 비활성 = 흐린 면 `surface/control` + 흐린 글자 `content/disabled`. 고스트는 면 없이 글자만 흐리다. 바쁘지 않은 `aria-disabled` 버튼 링크도 같다. 올림 · 누름은 걸리지 않는다.
- 포커스 = 흰 2 선 한 줄 · 간격 0.
- 바쁨 — `ActionButton busy`: 스피너 16 + 진행형 라벨, 다시 누를 수 없다. 비활성처럼 흐리게 하지 않는다.
- 잠김 — 로그인이 필요한 동작은 `data-locked`. 비활성과 같은 모양이고 이유를 보여 준다.
- 복사 성공은 누른 버튼 글자가 2초 「복사됨」 으로 바뀐다. 체크 표시 · 상자 없이 글자만, 알림은 화면 읽기로.

## 아이콘 버튼

- `IconButton` = 공용 버튼 `size="icon"` — 컨트롤 높이 정사각 · 안쪽 0 · 기본 고스트(모서리 `radius/control`). `variant` 로 `secondary` · `primary` 도 쓰고, 모서리는 같다. `label` 필수(아이콘은 `aria-hidden`).
- 작은 줄에서는 `size="compact"`(공용 버튼 `size="icon-sm"`, 정사각 `--nl-control-height-compact`).
- 주 · 보조 버튼과 같은 큰 줄에서는 공용 버튼 `size="icon-lg"`(정사각 `--nl-control-height-large`)로 옆 버튼과 높이를 맞춘다. 오락실 상세 「길찾기」 옆 하트 · 연필이 이것이다.
- 아이콘 20. 전체 화면 창 머리의 닫기만 24.
- 패딩이 있는 칸의 첫 · 마지막 자식이면 `(컨트롤 높이 − 20) / 2` 만큼 밖으로 당겨 아이콘 잉크를 패딩 선에 맞춘다.
- 사진 위 넘김 · 지도 범례처럼 미디어 위 버튼만 자기 모양을 쓴다.

## 문구

- 동작 이름으로 쓴다(「기록 삭제」 · 「투표 저장」). 「확인」 · 「OK」 만 쓰지 않는다.
- 진행형 라벨은 같은 동작의 진행형(「저장 중」).

## 하지 않는 것

- 누를 때 크기 줄이기.
- 페이지 CSS 로 높이 · 여백 · 모서리 덮어쓰기.
- 빨간 테두리 · 빨간 글자 버튼, 옅은 색 면 버튼.

## 바뀐 기록

- [2026-10-28 전수 검수 고른 자리 — 합격 인증 로그아웃 링크](../../decisions/2026-10-28-audit-choices.md)
- [2026-10-28 전수 검수 — 큰 줄 아이콘 버튼 · 좌우 안쪽](../../decisions/2026-10-28-audit-fixes.md)
- [2026-10-27 운영보다 나빠진 자리 — 버튼 모서리 · 높이 · 고스트 글자](../../decisions/2026-10-27-production-regression-fixes.md)
- [2026-10-27 부품 · 자리마다 쓰는 토큰을 Adobe 것으로 바꿈](../../decisions/2026-10-27-spectrum-components.md)
- [2026-10-26 Geist 색 · 모서리 · 포커스 — 보조 버튼 면 · 선](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 높이 단계 · 좌우 안쪽 · 굵기 · 비활성 모양 · 위험 버튼](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-24 토큰 정리 — 무채색 · 포커스 · 덧붙인 접근성 정리](../../decisions/2026-10-24-token-cleanup.md)
- [2026-10-24 채운 빨강 쓰는 곳 · 복사됨 표시](../../decisions/2026-10-24-conflict-choices.md)
- [2026-10-01 위험 버튼](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-01)
- [2026-09-30 보조 버튼 면 · 떠 있는 면 위 선 · 넓은 폭 주 버튼 폭](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-30)
- [2026-09-15 높이 단계](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-15)
