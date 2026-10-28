# 면 카드 · 아이콘 정보 줄

`SurfaceCard` · `IconRow` · `IconRows` · 끝 페이드 `nl-fade-end`

## 면 카드

카드는 Spectrum 2 Card 의 두 종류만 쓴다. 둘 다 둘레 없음 · 그림자 `--nl-card-shadow`(emphasized) · 모서리 `radius/large` 이다.

| 종류           | 면                 | 쓰는 곳                                                                                       |
| -------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| primary 카드   | `surface/elevated` | `SurfaceCard`, 한 덩어리로 누르는 카드(홈 이벤트 · 오락실 결과 카드)                          |
| secondary 카드 | `surface/surface`  | 누르지 않는 묶음 상자(과제곡 · 합격까지 · 빙고 미션 · 상세 판 · 동기화 안내 단계 · 정보 상자) |

- `SurfaceCard` 는 안쪽 16 · 안 사이 8 이고, 안의 항목 이름(`nl-entity-title`)은 14 bold(title S · `content/strong`)다.
- 누르는 카드는 올림 · 키 포커스에 그림자가 `--nl-overlay-shadow` 로 바뀐다. 고른 카드는 안쪽 2 `content/strong` 선 + `--nl-overlay-shadow` 다.
- 악곡 카드 · 홈 이동 칸 · 홈 공식 소식 카드는 위 두 종류가 아니라 한 단계 면이다. 면 `surface/surface` · 둘레 · 그림자 없음 · 모서리 `radius/control` 이고, 올림이 있는 것(홈 이동 칸)은 `surface/control-hover` 다.
- 따로 누르거나 한 덩어리로 읽어야 하는 것에만 쓴다. 순위 · 기록 목록 줄은 카드로 만들지 않고 구분선 줄로 둔다. 카드 안에 카드를 넣지 않는다.

## 아이콘 정보 줄

`IconRow` · `IconRows` — 장소 정보(주소 · 영업시간 · 링크 · 전화).

- 아이콘 20 흐림 →12→ 본문 `nl-body`(+ 보조 `nl-body-secondary` 흐림).
- 끝 동작(고스트 M 「복사」 · 펼치기 · 바깥 링크)은 첫 줄 가운데에.
- 줄 최소 컨트롤 높이 · 위아래 12 · 줄 사이 구분선.
- 대화상자 정보 창의 이름 · 값 표(`nl-info-rows`)와 다르다.

## 끝 페이드

`nl-fade-end` — 한 줄로 자른 글자의 오른쪽 32 를 흐리게(말줄임표 대신). 눌러서 전체를 볼 수 있는 곳에서만 쓴다.

## 바뀐 기록

- [2026-10-27 운영보다 나빠진 자리 — 악곡 카드 · 홈 이동 칸 · 공식 소식 면](../../decisions/2026-10-27-production-regression-fixes.md)
- [2026-10-27 부품 · 자리마다 쓰는 토큰을 Adobe 것으로 바꿈](../../decisions/2026-10-27-spectrum-components.md)
- [2026-10-26 Geist 색 · 모서리 · 포커스 — 면 · 둘레 · 모서리](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 면 카드 테두리 · 면 · 모서리 · 안쪽](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-21 뮤즈캣 시안에서 나온 공용 부품](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-21)
- [2026-09-17 끝 페이드](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-17)
