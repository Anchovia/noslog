# 흐린 막대 조각 · 못 얻은 업적 테두리는 입력 경계 색

- 상태: 일부 대체됨(2 못 얻은 업적 테두리) → [2026-10-27 부품 토큰 Spectrum 2](./2026-10-27-spectrum-components.md)
- 날짜: 2026-10-27
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(시안 추천대로)

## 맥락

[가이드 고를 곳](./2026-10-27-guide-choices.md) 6번으로 경계 토큰을 면에 쓰던 자리를 `surface/control` 로 바꿨더니 두 자리가 카드 면 위에서 거의 보이지 않았다. 프로필 레벨별 달성의 「고른 칸 밖」 조각은 「안 함」 조각과 같은 색이 됐고, 못 얻은 업적 육각 테두리는 카드 면과 대비 1.15 : 1 이 됐다.

## 결정

1. 프로필 레벨별 달성에서 등급을 고르면 나머지 등급 조각은 `border/input`(흰 14%)이다. 「안 함」 조각은 `surface/control` 그대로라 둘이 갈린다.
2. 못 얻은 업적 육각 테두리는 `border/input` 이다. 이 자리는 면이 아니라 테두리 선이다.

## 고르지 않은 안

- `surface/control-hover` #1f1f1f — 「안 함」 #1a1a1a 와 거의 같아 보인다.
- `border/default` #2e2e2e(업적 테두리) — 밝기는 비슷하나 입력칸 테두리와 같은 선 색이 이전 모습이다.
- 지금 값 `surface/control` 그대로.

## 근거

- 카드 면 #0a0a0a 위 대비: `surface/control` 1.15 : 1, `border/input`(≈#2c2c2c) 1.4 : 1, `surface/control-hover` 1.2 : 1.
- 두 자리 모두 10-26 까지 운영하던 값이다.

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md) 색 표 `border/input` 쓰는 곳, [프로필](../design/pages/profile.md)
- 코드: `features/profile/components/profile-levels.tsx` · `app/styles/achievements.css`
