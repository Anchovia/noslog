# 누를 때 들어가는 모양 없앰

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(지시)

## 맥락

[Spectrum 2 부품](./2026-10-27-spectrum-components.md) 1 · 11 에서 버튼과 홈 이동 칸은 누르면 Spectrum 2 pressScale 대로 `perspective(max(제 높이, 24px)) translate3d(0, 0, -2px)` 로 들어가게 했다. 화면에서는 작아졌다 커지는 효과로 보였고, 사용자가 모두 지우라고 했다.

## 결정

1. 누를 때 모양 · 크기 · 위치가 바뀌지 않는다. 버튼(모든 변형 · 크기) · 홈 이동 칸 · 북마클릿 창 버튼 모두 같다.
2. 누름은 올림과 같은 색만 바뀌는 기존 규칙을 그대로 둔다.

## 바뀌는 곳

- 문서: `docs/design/foundations.md` 「올림 · 누름」 · 「움직임」, `docs/design/components/button.md` 「모양」 · 「상태」
- 코드: `app/styles/foundation.css`(`.nl-button` 누름 규칙 넷) · `app/styles/home.css`(`.nl-home-tile:active`) · `lib/bookmarklet.ts`(창 버튼 누름)
