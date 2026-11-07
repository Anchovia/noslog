# Pixi 를 eval 없이 띄우기 · 활성 grant 마이그레이션 트랜잭션

- 상태: 유효
- 날짜: 2026-11-02
- 분야: 기능
- 고른 사람: 사용자(재점검 높음 항목 수정 지시, 정할 값이 없는 항목)

## 맥락

운영 빌드 CSP 는 2026-10-29 부터 `unsafe-eval` 을 막는다. Pixi 8 이 초기화에서 오류를 내 낙하형 뷰어와 채보 에디터 캔버스가 비었다. 개발 서버는 eval 을 허용해 드러나지 않았다. `20261102120000_oauth_grant_one_active` 는 `BEGIN;` · `COMMIT;` 이 없어 CI lint 가 실패했다.

## 결정

- CSP 는 그대로 두고 `lib/chart-pattern/loadPixi.ts` 가 `pixi.js/unsafe-eval` 을 먼저 불러온다.
- 마이그레이션을 트랜잭션으로 감싸고 시간 제한을 둔다. 인덱스는 `CONCURRENTLY` 없이 UPDATE 와 한 번에 되돌아가게 한다.
- 이미 적용한 개발 DB 는 `_prisma_migrations` 체크섬만 새 파일 값으로 맞췄다. 운영에는 아직 적용되지 않았다.

## 고르지 않은 안

- CSP 에 `unsafe-eval` 추가: 저장형 XSS 를 막는 층이 약해진다
- 새 마이그레이션 파일로 나누기: 운영에 적용 전이라 고칠 수 있고, 나누면 실패 파일이 CI 에 남는다

## 바뀌는 곳

- 코드: `lib/chart-pattern/loadPixi.ts` · `lib/chart-pattern/pixi-unsafe-eval.d.ts` · `components/chart-pattern/fallingChartViewer.tsx` · `components/admin/chart-pattern/pixiNoteEditor.tsx` · `prisma/migrations/20261102120000_oauth_grant_one_active/migration.sql`
