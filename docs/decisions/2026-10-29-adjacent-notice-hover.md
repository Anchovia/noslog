# 공지 이전 · 다음 칸의 올림

- 상태: 유효
- 날짜: 2026-10-29
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(추천대로 — 판 9 안 A)

## 맥락

공지 상세 아래 「이전 · 다음 공지」 두 칸은 news.md 가 모양(면 `surface/surface` · 모서리 `radius/control` · 안쪽 12)만 정했고 올림을 정하지 않았다.
지금은 올리면 면 위에 `interaction/row` 가 겹쳐 밝아지고, 누름 · 키 포커스도 같다([2026-10-28 전수 검수](./2026-10-28-audit-fixes.md) 22번).

## 결정

1. 지금 모양을 그대로 둔다. 목록 항목 카드(공지 상세 이전 · 다음 공지)는 올림 · 누름 · 키 포커스 때 면 위에 `interaction/row` 를 겹친다. 제목 밑줄은 없다.
2. 기초값 올림 표에 이 줄을 더한다. 코드는 바꾸지 않는다.

## 고르지 않은 안

- B 무채색 테두리(Astro Starlight · Mintlify).
- C 글자 · 아이콘 색만(Vercel · Vue · Django · Cloudflare · Nextra · Geist Pagination).
- D 변화 없음(Next.js · TanStack · 브런치 · 카카오 기술 블로그 · Pro Git · velog) — 기초값 「모두 반응한다」 에 예외가 필요하다.

## 근거

- 실제 서비스 31곳(대부분 개발 문서 · 기술 블로그): 면 변화 5(React 문서 · Read the Docs · Expo · NHN Meetup · Minimal Mistakes), 변화 없음 6, 글자 색 5, 무채색 테두리 2. 칸이 없거나 막힌 22곳은 세지 않음.
- 디자인 시스템 5곳 중 면 변화 4(GOV.UK Pagination 블록 · Primer · Atlassian · Carbon). 옮긴 대표는 GOV.UK(제목 밑줄 없이 면만)다.

## 바뀌는 곳

- 문서: `docs/design/foundations.md` 「올림 · 누름」 표
- 코드: 바뀌지 않음(지금 동작이 결정과 같다)
