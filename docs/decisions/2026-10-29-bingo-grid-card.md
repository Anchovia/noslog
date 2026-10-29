# 빙고 격자 카드를 악곡 격자 카드와 같게

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 화면(빙고)
- 고른 사람: 사용자(사용자 지시)

## 맥락

빙고 목록 격자 카드는 면 없는 그림 카드(자켓 + 아래 이름 · 상태, 올림은 제목 밑줄)였고, 미니 판은 `surface/media-scrim` 위 흰 칸이었다.
같은 자켓 격자인 악곡 목록 격자 카드는 한 단계 면 카드라 두 목록의 카드가 서로 달라 보였다.

## 결정

1. 빙고 격자 카드는 악곡 격자 카드와 같은 카드다(면 · 모서리 · 안쪽 12 · 올림 · 자켓 위 모서리). 코드도 같은 클래스(`nl-music-card--grid`)를 쓴다.
2. 자켓 위 미니 판은 자켓 카테고리 판과 같은 면 `surface/surface` 이고, 채운 칸은 `content/default` 다.

## 고르지 않은 안

- 면 없는 그림 카드 그대로 — 사용자가 악곡 격자와 같은 모양을 지시했다.

## 근거

- 사용자 지시(악곡 목록 격자 카드와 빙고 격자 카드 캡처 대조).

## 바뀌는 곳

- 문서: `docs/design/pages/bingo.md` 「보기」, `docs/design/foundations.md` 올림 표
- 코드: `features/bingos/components/bingo-catalog-card.tsx`, `app/styles/bingos.css`
