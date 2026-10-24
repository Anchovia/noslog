# 폼 컨트롤

`Checkbox` · `RadioGroup` · `RangeSlider` · `Switch` · `ScalePicker` · `Stepper`

## 체크박스

- 20 · `radius/control` · 테두리 `--nl-stroke-strong` `border/ring` · 체크 선 2.
- 저장 버튼이 있는 폼의 켜기 · 끄기에 쓴다. 보이는 라벨 필수.

## 라디오

- 원 20 · 테두리 2 → 고르면 `primary/default` 링 + 점 8. 올림 변화 없음.
- 라디오 줄 = 컨트롤 높이 · 줄 사이 0.
- 선택지가 적고 늘지 않을 곳은 라디오(신고 사유 4개), 늘어날 곳은 셀렉트.
- 묶음 오류는 묶음 아래 한 줄(`FormField` 오류와 같은 모양).
- 창 · 온보딩 폼의 묶음 제목은 칸 라벨 모양(`labelStyle="field"`, 라벨 → 선택지 8). 설정 구역의 묶음 제목은 `nl-component-title`.

## 슬라이더

- 높이 24 · 트랙 4 `border/divider`(양끝 12 안쪽) · 채운 점 20(누르는 자리 24).
- 올림 · 끌기 변화는 없다. 포커스는 [공용 포커스](../foundations.md#포커스).
- 아주 작은 척도(0–4 같은)에는 쓰지 않는다 — 숫자 척도.

## 스위치

- 누르는 즉시 적용되는 켜고 끄기에만. 저장 버튼이 있는 폼 안은 체크박스.
- 트랙 높이 24(아이콘 L) · 폭 24 + 16 · 모서리 원.
- 꺼짐 = `surface/control` 면 + 안쪽 1px `border/input` · 켜짐 = `primary/default` 면.
- 손잡이 = 16 · 안쪽 4. 꺼짐 `content/subdued` · 켜짐 `on-primary`. 움직임 표에 없어 손잡이는 즉시 옮긴다.
- 라벨은 `<label htmlFor>` 로 이어 줄 글자를 눌러도 켜고 끈다.

## 숫자 척도

`ScalePicker` — 0~4 같은 짧은 척도. 슬라이더 대신 쓴다.

- 숫자 버튼 한 줄 = 컨트롤 M 정사각 · `radius/field` · 1px `border/divider` · 숫자 `nl-control` 흐림.
- 고른 값 = `primary/default` 면 + `on-primary` 600.
- 값을 고른 줄의 나머지 숫자 = `content/subdued` · 1px `border/divider`. 빈 줄은 그대로.
- 사이 8(375 미만 4). 양끝 말 라벨은 두지 않는다.
- 같은 값을 다시 누르면 해제. 라디오 묶음 동작(방향키 이동 · 고른 값만 탭 순서).

## 숫자 스테퍼

`Stepper` — 작은 정수(대수).

- − · 값(+ 단위) · + 한 줄. 높이 컨트롤 L · 입력칸 선 · `radius/field` · 버튼 정사각 · 값 칸 최소 64.
- 값 글자는 `nl-body`(고정폭 숫자 아님).

## 바뀐 기록

- [2026-10-21 꺼진 스위치 · 스테퍼](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-21)
- [2026-10-01 스위치](../../decisions/archive/2026-09-10_2026-10-23.md#2026-10-01)
- [2026-09-17 숫자 척도 · 나머지 숫자 흐림](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-17)
- [2026-09-12 슬라이더 · 라디오 · 체크박스 모양](../../decisions/archive/2026-09-10_2026-10-23.md#2026-09-12)
