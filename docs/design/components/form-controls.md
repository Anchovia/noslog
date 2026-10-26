# 폼 컨트롤

`Checkbox` · `RadioGroup` · `RangeSlider` · `Switch` · `ScalePicker` · `Stepper`

## 체크박스

- 16 · `radius/small` · 면 `surface/input` · 테두리 `--nl-stroke-strong` `border/input` · 체크 12 · 선 3. 체크하면 `primary/default` 면 · 테두리 + `on-primary` 체크.
- 저장 버튼이 있는 폼의 켜기 · 끄기에 쓴다. 보이는 라벨 필수.

## 라디오

- 원 16 · 테두리 2 `border/input`(체크박스와 같음) → 고르면 `primary/default` 링 + 점 8. 올림 변화 없음. 규칙은 `foundation.css` 에 있다.
- 라디오 줄 = 컨트롤 높이 · 줄 사이 0.
- 선택지가 적고 늘지 않을 곳은 라디오(신고 사유 4개), 늘어날 곳은 셀렉트.
- 묶음 오류는 묶음 아래 한 줄(`FormField` 오류와 같은 모양).
- 창 · 온보딩 폼의 묶음 제목은 칸 라벨 모양(`labelStyle="field"`, 라벨 → 선택지 4). 설정 구역의 묶음 제목은 `nl-component-title`.

## 슬라이더

- 높이 24 · 트랙 4 `border/divider`(양끝 12 안쪽) · 채운 점 20(누르는 자리 24).
- 고른 구간 색은 기본 `primary/default`. `RangeSlider accent` 로 바꿀 수 있다(악곡 레벨 범위의 난이도 색).
- 올림 · 끌기 변화는 없다. 포커스는 [공용 포커스](../foundations.md#포커스).
- 아주 작은 척도(0–4 같은)에는 쓰지 않는다 — 숫자 척도.

## 스위치

- 누르는 즉시 적용되는 켜고 끄기에만. 저장 버튼이 있는 폼 안은 체크박스.
- 트랙 40 × 20 · 모서리 원.
- 꺼짐 = `border/default` 트랙 · 켜짐 = `primary/default` 트랙.
- 손잡이 = 16 · 안쪽 2. 꺼짐 `switch-thumb` · 켜짐 `on-primary`. 움직임 표에 없어 손잡이는 즉시 옮긴다.
- 라벨은 `<label htmlFor>` 로 이어 줄 글자를 눌러도 켜고 끈다.

## 숫자 척도

`ScalePicker` — 0~4 같은 짧은 척도. 슬라이더 대신 쓴다.

- 숫자 버튼 한 줄 = 컨트롤 M 정사각 · `radius/control` · 1px `border/divider` · 숫자 `nl-control` 흐림.
- 고른 값 = `surface/control` 면 · 선 없음 + `content/default` 600.
- 값을 고른 줄의 나머지 숫자 = `content/subdued` · 1px `border/divider`. 빈 줄은 그대로.
- 사이 8(375 미만 4). 양끝 말 라벨은 두지 않는다.
- 같은 값을 다시 누르면 해제. 라디오 묶음 동작(방향키 이동 · 고른 값만 탭 순서).

## 숫자 스테퍼

`Stepper` — 작은 정수(대수).

- − · 값(+ 단위) · + 한 줄. 높이 컨트롤 L · 입력칸 선 · `radius/control` · 버튼 정사각 · 값 칸 최소 64.
- 값 글자는 `nl-body`(고정폭 숫자 아님).

## 바뀐 기록

- [2026-10-26 Geist 색 · 모서리 · 포커스 — 체크박스 · 라디오 경계 입력 선 · 스위치 · 고른 숫자](../../decisions/2026-10-26-geist-color-radius.md)
- [2026-10-25 체계 묶음 — 체크박스 · 라디오 16 · 경계 border/input · 스위치 40 × 20](../../decisions/2026-10-25-design-system-cluster.md)
- [2026-10-24 토큰 정리 — 무채색 shadcn/ui · 포커스 한 겹 · 덧붙인 접근성 정리](../../decisions/2026-10-24-token-cleanup.md)
- [2026-10-21 꺼진 스위치 · 스테퍼](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-21)
- [2026-10-01 스위치](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-01)
- [2026-09-17 숫자 척도 · 나머지 숫자 흐림](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-17)
- [2026-09-12 슬라이더 · 라디오 · 체크박스 모양](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-12)
