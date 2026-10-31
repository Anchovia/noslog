# 태그

`nl-tag` (관리자용 `Badge` 도 같음) · 상태 태그 `nl-tag--status` · 상태 점 `StatusDot` · 개수 배지 `nl-filter-count` · 새 소식 점 `nl-unread-dot`

## 기본 태그

- 높이 20 · `radius/full`(알약) · 좌우 8 · 글자 `nl-tag-label`. 이름 · 값 글줄 안에서도 줄을 늘리지 않는다. 페이지 CSS 가 태그 높이 · 여백을 덮어쓰지 않는다.
- 면 `surface/tag` · 글자 `content/on-tag` · 테두리 없음.
- 분류 · 표시에는 색을 쓰지 않는다(공지 분류 · 미션 종류 · 기여 라벨).
- 한 줄에 태그는 하나. 누르지 않는 라벨은 이 하나만 쓴다.
- 링크인 태그(프로필 「기여 Lv.N」)는 올림 · 누름 · 키 포커스에 강조형 `--strong` 과 같은 반전(면 `primary/default` · 글자 `primary/on-primary`)이 된다. 안의 흐린 접두 글자도 같은 글자색을 따른다.
- 강조형 `--strong` = 반전(주 버튼과 같은 면 `primary/default` · 글자 `primary/on-primary`). 한 줄에 하나까지.
- 관리자 `Badge` 의 변형은 기본 하나와 상태 셋(success · danger · score = 경고)이다. 모양이 같은 변형(outline · basic · recital)은 기본으로 합친다.

## 상태 태그

`nl-tag--status` + `data-tone`

- 면 `surface/surface` + 1px `border/default` 에 글자만 알림 표시색이다. 기본 태그 면(`surface/tag`) 위에서는 상태 글자가 4.5 : 1 에 못 미쳐 면을 바꾼다. 면 색을 상태마다 만들지 않고, 태그 글자가 늘 상태 이름을 말한다.
- 색 = `feedback/success-marker`(진행 중 · 공개 · 해결 · New) · `info-marker`(예정 · 수정 요청) · `warning-marker`(검토 대기 · 검토 중) · `feedback/destructive`(반려). 중립(종료 · 임시저장)은 기본 글자색.

## 카테고리 변형

악곡 상세 머리(자켓 밖). 크기는 태그 그대로, 면은 `surface/surface` · 글자는 카테고리 색 · 경계 없음. 자켓 위 판과 같은 색이라 목록 카드와 이어진다.

## 상태 점

`StatusDot` — 원 8 · 알림 표시색(성공 · 경고 · 위험 · 정보) · `empty` 는 빈 원(경계 `border/ring`). 늘 상태 글자와 함께 쓴다.

## 개수 배지

`nl-filter-count` — 「필터」 트리거 안 적용 그룹 수. 개수 전용이라 태그와 다른 모양이다: 원 20 · 글자 `nl-metadata`. 트리거 안에서는 면 `primary/default` · 글자 `primary/on-primary` · 굵기 600(트리거 면 `surface/control` 과 같은 색이면 원이 안 보인다). 아이콘 트리거에서는 오른쪽 위 모서리에 4 걸치고 둘레에 2px `surface/canvas` 링을 둔다([결정](../../decisions/2026-10-31-filter-count-inverted-badge.md)). 점수 핀의 「+N」 은 면 `surface/control` + 1px `border/divider` 그대로.

## 새 소식 점

`nl-unread-dot` — 점 8 · `feedback/destructive`. 아직 보지 않은 결과가 있을 때 메뉴 줄 · 탭 글자 · 구역 제목 뒤에. 접근 이름 「새 답변」 처럼 뜻을 붙인다. 열면 본 것으로 표시한다.

## 바뀐 기록

- [2026-10-29 링크인 태그의 올림](../../decisions/2026-10-29-tag-link-hover.md)
- [2026-10-27 부품 · 자리마다 쓰는 토큰을 Adobe 것으로 바꿈](../../decisions/2026-10-27-spectrum-components.md)
- [2026-10-27 가이드 다시 대조](../../decisions/2026-10-27-guide-audit-2.md)
- [2026-10-27 운영자 태그 「Admin」 없앰](../../decisions/2026-10-27-admin-tag-removal.md)
- [2026-10-27 가이드 고를 곳 — 반전 태그 색 · `Badge` 변형 합침](../../decisions/2026-10-27-guide-choices.md)
- [2026-10-26 Geist 색 · 모서리 · 포커스 — 배지 면 · 알약 · 상태 태그는 카드 면 + 둘레 선](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 태그 높이 · 글줄 안 태그 변형 없앰](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-24 토큰 정리 — 무채색 shadcn/ui · 포커스 한 겹 · 덧붙인 접근성 정리](../../decisions/2026-10-24-token-cleanup.md)
- [2026-10-24 상태 태그 글자색 · 점 규칙 정리](../../decisions/2026-10-24-conflict-choices.md)
- [2026-10-15 태그 글자 표 · 글줄 안 태그](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-15)
- [2026-09-25 운영자 태그 「Admin」](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-25)
- [2026-09-23 태그 재설계](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-23)
- [2026-09-18 카테고리 변형](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-18)
