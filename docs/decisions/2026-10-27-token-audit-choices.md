# 토큰 전수 점검 — 배너 흐림 · 무대 뒤 자켓 빼기 · 뒤로 링크 높이 토큰

- 상태: 유효
- 날짜: 2026-10-27
- 분야: 디자인 · 기초값
- 고른 사람: 사용자(시안 추천대로)

## 맥락

코드 전체에서 토큰 밖 값 · 인라인 스타일을 찾다가 가이드끼리 부딪히는 곳 세 곳이 나왔다. 홈 이벤트 배너 글자 층 흐림 12 와 채보 무대 뒤 자켓 흐림 · 원형 빛은 화면 문서에 있었지만 [AI 티 확인](../ai-check.md) 1번(글로우 · 유리 효과 없음)과 맞지 않았다. 뒤로 링크 높이 44 는 채보 뷰어 계산식이 쓰는데 기초값 높이 표와 토큰에 없었다.

## 결정

1. 홈 이벤트 배너 글자 자리는 `surface/media-scrim` 판(위 32 번짐)만 둔다. 흐림은 없다.
2. 채보 낙하형 무대 뒤는 `stage/canvas` 한 색이다. 흐린 자켓과 원형 빛은 없다.
3. 뒤로 링크 누르는 높이는 `--nl-back-link-height`(모든 폭 44)다. 채보 뷰어 무대 폭 계산도 이 토큰을 뺀다.

## 고르지 않은 안

- 배너 흐림 유지 — ai-check 예외 목록에 한 줄을 더해야 하고, 판만으로도 글자 대비는 같다.
- 무대 뒤 자켓 · 원형 빛 유지 — 같은 이유. ai-check(10-24)가 무대 결정(09-26)보다 나중의 사용자 결정이다.
- 뒤로 링크를 `--nl-control-height`(40 · 32)로 — 모든 상세 화면 제목이 올라가고 넓은 폭은 누르는 자리가 12 줄어 지금보다 나빠진다.

## 근거

- 세 판 모두 두 NosLog 문서의 규칙 중 고르는 질문이라 외부 서비스는 재지 않았다.
- 판 1 · 2 는 「사용자의 최신 결정이 먼저」 순서(`AGENTS.md`)로 추천했다.

## 바뀌는 곳

- 문서: [기초값](../design/foundations.md) 「높이」, [홈](../design/pages/home.md), [채보 뷰어](../design/pages/chart-viewer.md)
- 코드: `app/styles/tokens.css` · `app/styles/layout.css` · `app/styles/home.css` · `app/styles/chartViewer.css` · `components/chart-pattern/fallingChartViewer.tsx`
- 테스트: `tests/ai-tells.test.ts` 허용 목록 세 줄 뺌 · `e2e/noslog-v2-events.spec.ts` 흐림 기대값
