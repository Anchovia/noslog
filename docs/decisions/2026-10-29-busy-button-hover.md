# 바쁨 버튼의 올림

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 부품
- 고른 사람: 사용자(추천대로 — 판 6 안 A)

## 맥락

바쁨 버튼(`ActionButton busy`, `aria-busy="true"`)은 다시 누를 수 없는데, 올리면 주 버튼은 `primary/hover` 로, 보조 · 고스트는 `surface/control-hover` 로 밝아지고 누르면 그 색이 됐다.
button.md 는 바쁘지 않은 `aria-disabled` 버튼 링크만 「올림 · 누름은 걸리지 않는다」 고 정했고 바쁨일 때는 정하지 않았다.

## 결정

1. 바쁨 버튼은 올림 · 누름에 면 · 글자가 바뀌지 않는다. 주 · 보조 · 고스트 · 위험 모두 같다.
2. 키 포커스는 다른 버튼과 같은 모양을 지킨다. 바쁨은 비활성처럼 흐리게 하지 않는 기존 규칙도 그대로다.

## 고르지 않은 안

- B 지금처럼 올림 면이 바뀜(Primer · Ant Design · GitHub Topics 「Load more」).

## 근거

- 디자인 시스템 12곳 중 10곳이 바쁨 동안 올림 없음(Spectrum 2 · Fluent 2 · Carbon · Atlassian · Geist · Chakra · MUI · Mantine · shadcn · Radix Themes), 2곳이 올림 있음(Primer · Ant Design).
- 실제 서비스는 공개 화면에서 제출 없이 바쁨을 재현할 수 있는 곳이 1곳뿐이라 근거 약함.

## 바뀌는 곳

- 문서: `docs/design/components/button.md` 「상태」
- 코드: `app/styles/foundation.css`(`.nl-button` 올림 · 누름 규칙에서 `aria-busy` 제외)
