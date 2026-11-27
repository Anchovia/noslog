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
- 모양은 Spectrum 2 Button(주 = primary fill · 보조 = secondary fill · 위험 = negative)과 ActionButton quiet(고스트)이다. 모서리는 small 이 `radius/control`, large 가 `radius/field` 이고, 글자는 모든 변형 14/20 · 500 이다([기초값 — 글자](../foundations.md#글자)의 버튼).
- 보조는 올리면 면 `surface/control-hover` · 글자 `content/strong`, 고스트는 면 `interaction/row` · 글자 `content/strong` 이다. 누름도 같은 색이다([기초값 — 올림 · 누름](../foundations.md#올림--누름)).
- 면 없는 누르는 것(헤더 로그인 · ≡ · 쪽 번호 · 스테퍼 버튼 · 검색칸 안 버튼 · 좋아요 · 답글 토글 · 미디어 위 버튼)도 고스트와 같은 ActionButton quiet 올림을 쓴다. 모서리는 그 요소 것이다.
- 위험 버튼은 확인 창 안의 마지막(확정) 버튼에만 쓴다. 그 창을 여는 버튼 · 신고 버튼은 보조다. 빨간 테두리 · 빨간 글자 모양은 쓰지 않는다.

## 크기

- 높이는 [기초값 — 높이](../foundations.md#높이)의 다섯 값 가운데 기본 컨트롤 32 와 혼자 주 버튼 48 두 가지다. 폭에 따라 줄지 않는다.
- 기본 — 보조 · 위험 · 고스트 버튼과, 한 줄에 보조 버튼과 놓인 주 버튼(대화상자 「취소 · 삭제」 · 온보딩 「이전 · 다음」). 높이 32 · 안쪽 8 14 · 글자와 아이콘 사이 4 · 아이콘 14.
- 혼자 주 버튼 — 짝 없이 혼자 놓인 주 버튼(인증 · 온보딩 · 동의 면 아래 「다음」 · 「연결하기」 · 「계정 설정 완료」, Discord 로그인). 높이 48 · 안쪽 14 20 · 사이 8 · 아이콘 22 · 면은 반전 면 그대로.
- 버튼은 기본이 32 이고 크기 수식어는 `nl-button--xsmall`(32) · `nl-button--large`(48) 이며, 값은 `--nl-button-height` · `--nl-button-padding-inline` · `--nl-button-gap` · `--nl-button-radius` 가 크기 수식어마다 단계 값을 가리킨다([기초값 — 부품 변수](../foundations.md#부품-변수)).
- 페이지에서 크기를 덮어쓰지 않는다. 칸이 좁으면 열 수를 줄인다(주 동작 한 줄 + 보조 두 열).
- 넓은 폭에서 한 줄을 다 쓰는 자리의 주 버튼은 내용 폭 · 왼쪽(데이터 동기화 「다시 동기화」). 폰 · 좁은 열 안은 폭 가득.
- 목록을 이어 붙이는 「더 보기」(오락실 게임 · 프로필 최근 플레이 · 기록)는 목록 아래 가운데에 놓인 보조 버튼이다. 높이 32 · 폭은 글자만큼, 폭 가득으로 늘이지 않는다.
- 버튼 줄 `nl-button-row` — 버튼 하나면 폭 가득, 둘이면 같은 폭 둘(사이 8).

## 상태

- 올림 = 주 `primary/hover`, 보조 `surface/control-hover` + `content/strong`, 고스트 `interaction/row` + `content/strong`. 위험은 올림이 없고 누름(`:active`)만 `feedback/destructive-hover` 다. 다른 변형의 누름 · 키 포커스는 올림과 같은 색이고 누름 전용 색은 없다.
- 누름 = 올림과 같은 색 + 누름 축소([기초값 — 움직임 ②](../foundations.md#움직임)).
- 비활성 = 흐린 면 `surface/control` + 흐린 글자 `content/disabled`. 고스트는 면 없이 글자만 흐리다. 바쁘지 않은 `aria-disabled` 버튼 링크도 같다. 올림 · 누름은 걸리지 않는다.
- 포커스 = 흰 2 선 한 줄 · 간격 0.
- 바쁨 — `ActionButton busy`: 스피너 16 + 진행형 라벨, 다시 누를 수 없다. 비활성처럼 흐리게 하지 않는다. 올림 · 누름은 걸리지 않고 평소 면 그대로다. 키 포커스는 다른 버튼과 같다.
- 잠김 — 로그인이 필요한 동작은 `data-locked`. 비활성과 같은 모양이고 이유를 보여 준다.
- 복사 성공은 누른 버튼 글자가 2초 「복사됨」 으로 바뀐다. 체크 표시 · 상자 없이 글자만, 알림은 화면 읽기로.

## 아이콘 버튼

- `IconButton` — 32 정사각 · 안쪽 8 · 아이콘 16 · 모서리 `radius/full` · 기본 고스트. `variant` 로 `secondary` · `primary` 도 쓰고, 모서리는 같다. `label` 필수(아이콘은 `aria-hidden`).
- 면이 있는 아이콘 버튼은 옆 셀렉트와 같은 갈래다(바탕 위 `surface/elevated`, 상자 안 `surface/control`). 크기가 한 단계라 보조 · 주 버튼 옆에서도 높이가 같다.
- 전체 화면 창 머리의 닫기만 아이콘 24.
- 패딩이 있는 칸의 첫 · 마지막 자식이면 `(32 − 16) / 2` 만큼 밖으로 당겨 아이콘 잉크를 패딩 선에 맞춘다.
- 사진 위 넘김 · 지도 범례처럼 미디어 위 버튼만 자기 모양을 쓴다.

## 문구

- 동작 이름으로 쓴다(「기록 삭제」 · 「투표 저장」). 「확인」 · 「OK」 만 쓰지 않는다.
- 진행형 라벨은 같은 동작의 진행형(「저장 중」).

## 하지 않는 것

- 누를 때 크기 줄이기.
- 페이지 CSS 로 높이 · 여백 · 모서리 덮어쓰기.
- 빨간 테두리 · 빨간 글자 버튼, 옅은 색 면 버튼.

## 바뀐 기록

- [2026-11-28 공통 층 4단계 왼쪽 미정 줄 반영](../../decisions/2026-11-28-common-layer-stage4-left.md)
- [2026-11-26 컨트롤 크기를 다섯 단계로](../../decisions/2026-11-26-control-size-five-steps.md)
- [2026-11-26 공용 부품 4단계 — 크기 단계 · 역할 변수 · 모서리](../../decisions/2026-11-26-components-stage4.md)
- [2026-11-19 움직임 판 남은 칸과 반영](../../decisions/2026-11-19-motion-apply.md)
- [2026-10-29 바쁨 버튼의 올림](../../decisions/2026-10-29-busy-button-hover.md)
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
