# 제목 아래 개수 · 설명 글줄을 뺀다

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 디자인 · 화면(악곡 목록 · 빙고 · 검정 · 랭킹)
- 고른 사람: 사용자(사용자 지시)

## 맥락

좁은 폭에서 페이지 제목 바로 아래에 보조 글줄이 붙어 있었다. 악곡 「579곡」 · 채보 「4개」 · 빙고 「44개」 는 개수, 검정은 「공식 검정의 응시 조건·과제곡을 확인하고 합격을 인증합니다.」 라는 설명이었다. 사용자가 네 줄을 모두 쓸데없다고 했다. 랭킹 제목도 「유저 랭킹」 이 아니라 「랭킹」 이다.

## 결정

1. 악곡 목록 · 채보 보기의 좁은 폭 개수 글줄을 뺀다. 672 이상의 결과 줄 개수는 그대로다.
2. 빙고 목록의 좁은 폭 개수 글줄을 뺀다. 672 이상 결과 줄 개수는 그대로다.
3. 검정의 제목 아래 설명 한 줄을 뺀다. 같은 문장은 페이지 메타 설명으로만 남는다.
4. 랭킹 페이지 제목은 세 언어 모두 「랭킹」(ランキング · Rankings)이다.
5. 악곡 목록에서 필터를 적용하거나 오류 뒤 다시 불러오면, 좁은 폭에서는 사라진 개수 글줄 대신 결과 영역으로 포커스가 간다. 넓은 폭은 결과 줄 개수 글줄 그대로다.

## 고르지 않은 안

- 개수를 검색줄 옆 · 결과 줄로 옮기기 — 사용자가 옮기지 말고 없애라고 했다.
- 검정 설명을 짧게 줄이기 — 화면이 이미 말하는 것이라 줄이지 않고 뺐다([AI 티 확인](../ai-check.md) 7번).

## 근거

사용자 지시다. 캡처 네 장(악곡 · 채보 · 빙고 · 검정, 390 폭)을 보고 자리마다 지목했다. 실제 서비스 조사는 하지 않았다.

## 바뀌는 곳

- 문서: [악곡 목록 · 채보 보기](../design/pages/music-list.md) · [빙고](../design/pages/bingo.md) · [검정](../design/pages/exams.md) · [랭킹](../design/pages/rankings.md) · [디자인 가이드 색인](../design/README.md)
- 코드: `features/music/components/discovery-page.tsx` · `features/bingos/components/bingo-catalog-page.tsx` · `features/exams/components/exam-dashboard.tsx` · `lib/i18n/message-catalogs/{ko,ja,en}.ts`
- 테스트: `e2e/helpers.ts` · `e2e/public-navigation.spec.ts` · `e2e/noslog-v2-discovery.spec.ts`
