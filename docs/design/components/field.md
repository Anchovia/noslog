# 입력 · 셀렉트 · 검색

`Input` · `TextArea` · `Select` · `CompactSelect` · `SearchField` · `UnitInput` · `FormField` · `FileRow`

## 모양

- 입력 · 검색 · 단위 입력 · 마크다운 입력 · 스테퍼 · 파일 줄은 Spectrum 2 텍스트 필드다. 면 `surface/input` + 2px 실제 테두리 `border/input` · 모서리 `radius/control` · 높이 L. 검색칸만 Spectrum 2 SearchField 라 모서리 `radius/full` 이고, 높이는 모든 화면 · 모든 폭 크게(40)다. 화면 CSS 가 높이를 덮어쓰지 않는다.
- 올리면 테두리가 `border/input-hover` 로 밝아진다. 포커스는 커서가 들어가면 테두리가 `content/strong` 으로 바뀌는 것 하나다. 잘못된 칸은 빨간 경계를 지키고, 포커스는 바깥 흰 선 한 줄로 보인다. 바깥 선 · 파랑 링을 겹쳐 그리지 않는다([기초값 — 포커스](../foundations.md#포커스)).
- 셀렉트는 Spectrum 2 picker 다. 면 `surface/control` · 테두리 없음이고, 올림 · 누름 · 키 포커스 · 열림에 면 `surface/control-hover` · 글자 `content/strong` 이다. 꺾쇠는 글자색을 따르고, 고른 값이 없을 때만 `content/tertiary` 다.
- 입력 글자(입력칸 · 검색칸 · 단위 입력 · 마크다운 입력)는 모든 폭 `--nl-type-input-size`(16) · 400 · 줄 높이 `--nl-type-line-height-ui` 다. 16 보다 작으면 iOS Safari 가 포커스 때 화면을 확대한다. 입력 글자 크기는 이 토큰 하나만 고친다. 셀렉트 글자는 `nl-control`(14 · 400). 자리표시자 · 입력 아이콘은 `content/tertiary`.
- 칸 라벨은 `control`(14/400) · `content/subdued`. 칸 라벨 → 입력 · 값 4. 도움말 · 오류는 칸 아래 `nl-metadata--long`.
- 칸이 둘 이상 이어지면 칸 사이는 24 다. 공용 규칙이 맞추므로 화면 CSS 가 덮어쓰지 않는다.

## 칸 안 잉크

첫 · 마지막 잉크는 안쪽 12(검색칸 시작만 16), 잉크 사이는 8 이다. 안쪽은 테두리 2 를 뺀 값으로 둔다.

| 칸               | 잉크 위치                                         |
| ---------------- | ------------------------------------------------- |
| 입력칸 글자      | 왼쪽 12(10 + 경계 2)                              |
| 셀렉트           | 글자 왼쪽 12 · 꺾쇠 20 오른쪽 12                  |
| 검색             | 돋보기 20 왼쪽 16 → 글자                          |
| 범위 셀렉트 라벨 | 12 (바깥 4 + 버튼 8) · 꺾쇠 16                    |
| 지우기 ×         | 20, 오른쪽 12 (중심 22 = 셀렉트 꺾쇠와 같은 자리) |

검색창 안 범위 셀렉트는 올리거나 눌러도 면 · 글자색이 바뀌지 않는다. 키 포커스는 [포커스](../foundations.md#포커스) 선만 보인다. 지우기는 4px 안쪽 층이다. 면만 위아래 4 를 비운 32 정사각(모서리 `radius/small`)이고, 올림 · 누름 · 키 포커스에 안쪽 층이 `surface/control-hover`, 잉크가 `content/strong` 이다. 두 컨트롤 모두 누르는 높이는 검색창 그대로다.

## 변형

- 폼 `Select` 는 Radix(`value` · `onValueChange` · `options`, react-hook-form 은 `Controller`). 펼친 목록은 [목록 · 메뉴](./menu.md).
- `CompactSelect` — 줄 안 작은 셀렉트. 크기는 버튼과 같은 L · M(`size="sm"`)이고 기본은 면이 없다. `outlined` 는 picker 와 같은 면 `surface/control` · 선 없음이고 설정 줄 오른쪽(화면 설정 · 국가/지역)에서만 쓴다.
- 떠 있는 검색 `SearchField floating` — 지도 위 검색칸. 검색칸 모양(경계 · 원 끝 · 올림)은 그대로이고 떠 있는 창 그림자 `--nl-overlay-shadow` 만 더한다.
- 단위 붙은 입력칸 `UnitInput` — 입력칸과 같은 상자 안 오른쪽에 단위 글자(`nl-control` 흐림). 포커스는 상자 전체.
- 여러 줄 입력칸(`textarea`)은 최소 높이 96.
- 숫자 스테퍼는 [폼 컨트롤](./form-controls.md#숫자-스테퍼).

## 상태

| 상태                   | 모양                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| 비활성                 | 글자 `content/disabled`. 올림 경계 변화 없음                                                    |
| 잘못된 칸              | 경계 `feedback/destructive`(올림 · 포커스에도 그대로) + 칸 아래 오류 글(`feedback/destructive`) |
| 읽기 전용(보내는 중)   | 경계 투명 · 면 `surface/surface`. 올림 경계 변화 없음. 비활성처럼 흐리게 하지 않는다            |
| 확인 성공(`FormField`) | 오류와 같은 자리 한 줄, 글자 `feedback/success-marker`. 오류가 있으면 오류만 보인다             |

## 첨부

- 첨부 버튼은 보조 L(입력칸 역할). 붙이면 같은 높이의 파일 줄 `FileRow` 가 들어선다. 입력칸과 같은 면 · 2px 경계이고, 안은 썸네일(줄 높이 − 8) · 이름 · 크기 · 지우기 × 다.

## 동작

- 보내기 버튼은 늘 켜 두고, 비었거나 틀리면 칸 아래 오류로 알린다. 오류 검사는 칸을 벗어날 때.
- 자리표시자로 라벨을 대신하지 않는다. 라벨을 되풀이하는 자리표시자는 두지 않는다.

## 바뀐 기록

- [2026-10-29 입력 글자 크기 · 검색칸 높이를 한 곳에서](../../decisions/2026-10-29-input-text-16.md)
- [2026-10-28 전수 검수 — 검색 · 단위 입력 글자](../../decisions/2026-10-28-audit-fixes.md)
- [2026-10-27 부품 · 자리마다 쓰는 토큰을 Adobe 것으로 바꿈](../../decisions/2026-10-27-spectrum-components.md)
- [2026-10-27 가이드 다시 대조](../../decisions/2026-10-27-guide-audit-2.md)
- [2026-10-27 가이드 고를 곳 — `CompactSelect` 기본 모양 · 칸 라벨 굵기](../../decisions/2026-10-27-guide-choices.md)
- [2026-10-26 Geist 색 · 모서리 · 포커스 — 라벨 색 · 자리표시자 · 올림 경계 · 포커스](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 테두리 · 포커스 · 글자 크기 · 라벨 간격 · 칸 사이 간격](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-24 토큰 정리 — 무채색 · 포커스 · 덧붙인 접근성 정리](../../decisions/2026-10-24-token-cleanup.md)
- [2026-10-21 자리표시자 색 · 떠 있는 검색](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-21)
- [2026-09-18 피드백 창 — 보내기 버튼 상태 · 자리표시자 · 파일 줄](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-18)
- [2026-09-16 칸 안 잉크](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-16)
- [2026-09-14 입력 컨트롤 한 언어](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-14)
