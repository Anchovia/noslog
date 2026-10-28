# 업적 38개 추가 — 곡 묶음 · 계절 · 연주 · 커뮤니티

- 상태: 유효
- 날짜: 2026-10-28
- 분야: 기능
- 고른 사람: 사용자(추천대로)

## 맥락

업적이 16개뿐이고 실력 · 수집 수치에 몰려 있었다. 사용자가 계절 곡 · BEMANI 밈 · 작곡가 같은 여러 주제의 업적을 더하자고 했다.
다른 서비스 74곳을 조사해 후보 65개를 시안으로 냈고, 사용자가 추천 38개와 판 2 A · 판 3 A · 판 4 B 를 골랐다.

## 결정

1. 업적 38개를 더한다. 곡 묶음 28개(작곡가 · NOSTALGIA 이야기 · BEMANI · 곡 주제), 계절 7개, 실력 2개(한 곡의 모든 난이도 · Lv.1 부터 이어진 레벨), 커뮤니티 1개(오래 의견이 없던 채보에 쓴 의견).
2. 곡 묶음 · 계절 업적은 정해 둔 곡 목록에서 S 이상(아무 난이도)을 받은 곡 수로 판정한다. 계절 업적도 언제든 얻는다(판 2 A).
3. 단계는 곡 수로 나눈다(판 3 A). 10곡 이상 I–V, 5–9곡 I–III, 2–4곡 금 III 하나, 한 곡은 S → 풀콤보 → Pianist.
4. 분류 칩에 「곡 묶음」 · 「계절」 을 더한다(판 4 B). 점수 비공개 프로필에서는 실력 · 수집처럼 남에게 보이지 않는다.
5. 이름은 언어마다 그 커뮤니티가 실제로 쓰는 말로 짓는다. 직역하지 않는다.

규칙은 [기능 규칙 › 업적](../design/product-rules.md#업적)에 있다.

## 고르지 않은 안

- 계절에 올린 기록만 세기(판 2 B · C) — 플레이 시각이 북마클릿 동기화 뒤 기록에만 있고, 그 계절에 플레이를 부른다.
- 다 채우면 하나(판 3 B) · 판정으로 올리기(판 3 C) — 지금 카테고리 업적과 단계 방식이 달라진다.
- 지금 네 분류에 넣기(판 4 A) — 「수집」 에 업적 35개가 몰린다.
- 후보 중 27개는 이번에 넣지 않았다. 시안에 남겨 두고 더 조사한다.

## 근거

- [업적 추가 조사](../research/2026-10-28-achievement-ideas.md) — 다른 서비스 74곳(리듬게임 44 · 다른 서비스 30), 이름은 한국어 글 10,369개 · 일본어 5ch 글 12,290개 · 영어 검색 결과 약 880건.

## 바뀌는 곳

- 문서: [기능 규칙](../design/product-rules.md) 업적 절 · [업적 화면](../design/pages/achievements.md) 상태 · 목록 줄
- 개인정보처리방침 2026-10-28 판: 점수 비공개일 때 보이지 않는 업적에 곡 묶음 · 계절을 더함(`features/privacy/content/policyCopy.json`)
- 코드: `features/achievements/{achievement-song-sets.ts,achievement-definitions.ts,server/achievement-service.ts,components/achievement-hex.tsx,components/use-achievement-text.ts,components/achievements-page.tsx}` · `lib/i18n/message-catalogs/{ko,en,ja}.ts`
- 테스트: `tests/achievement-definitions.test.ts` · `tests/achievement-metrics-database.test.ts` · `e2e/noslog-v2-profile.spec.ts`
