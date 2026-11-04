# Vercel Web Analytics 추가 · 처리방침 2026-11-11 판

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자

## 맥락

관리자 대시보드의 방문 통계에는 유입 경로 · 지역 · 기기가 없고 합계도 90일 뒤 지운다. Vercel Pro 를 쓰고 있어 Web Analytics 를 바로 붙일 수 있다.
지금 처리방침은 행태 분석 도구를 쓰지 않고 방문을 하루 합계로만 센다고 적고 있어, 켜기 전에 고쳐야 한다.

## 결정

- 관리자 대시보드는 그대로 두고 Web Analytics 를 함께 쓴다. 로그인 여부 · API · 가입 · 동기화 지표는 Vercel 에 없다.
- 운영 배포에서 서울 기준 2026-11-11 부터 수집한다. 미리보기 · 개발과 운영자 계정, 관리자 셸은 수집하지 않는다.
- 주소는 라우트 패턴으로 바꿔 보내고 검색 조건을 뺀다. 방문 통계 목록에 없는 경로는 보내지 않는다.
- 처리방침은 새 시행판으로 낸다. 시행 7일 전 공지 규칙에 따라 시행일은 2026-11-11 이고, 2026-11-06 판은 이전 버전으로 보관한다.
- 방문 분석 데이터의 저장 국가는 Vercel 공개 문서에서 찾지 못해 방침에 그대로 적는다. 요약의 서울 저장 문구는 서비스 데이터로 좁힌다.

## 고르지 않은 안

- 2026-11-06 판을 고쳐 쓰기 — 이미 낸 판의 내용이 시행 전에 바뀌고 7일 전 공지를 지키지 못한다
- 방문 통계를 Vercel 로 옮기고 대시보드 지표 지우기 — 사용자가 고르지 않았고 Vercel 에 없는 지표가 사라진다

## 근거

- Vercel 공식 문서: [요금](https://vercel.com/docs/analytics/limits-and-pricing)(Pro 1,000건당 $0.03 · 보고 기간 12개월), [개인정보 · 수집 항목](https://vercel.com/docs/analytics/privacy-policy)(쿠키 없음 · 식별값 24시간 폐기)
- 변호사 검토가 아니며 방침의 「법률 검토 대기」 상자는 그대로 둔다.

## 바뀌는 곳

- 문서: `docs/design/pages/privacy.md` 바뀐 기록
- 코드: `components/layout/web-analytics.tsx` · `app-shell.tsx` · `app/(site)/layout.tsx` · `lib/analytics.ts` · `features/privacy/content/policyCopy.json` · `versions/2026-11-06.json` · `privacy-content.ts` · `tests/privacy-history.test.ts`
