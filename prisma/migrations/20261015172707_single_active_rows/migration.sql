-- 2026-10-16 DB 재설계 P2 — 코드에만 있던 「하나만」 규칙을 DB 도 지킨다. 운영 중복 0 확인(운영 확인 SQL P10, 2026-10-16).
-- 표가 작아(동기화 76 · 제안 수 건 · Grd 이력 52행) 한 트랜잭션으로 만든다.
SET lock_timeout = '5s';

-- 사람당 하루 한 줄(schema.prisma @@unique([user_id, besttime]))
DROP INDEX "UserBestGrade_user_id_besttime_idx";
CREATE UNIQUE INDEX "UserBestGrade_user_id_besttime_key" ON "UserBestGrade"("user_id", "besttime");

-- 스키마 밖 부분 유일 인덱스 2개 — Prisma 6 은 WHERE 가 있는 인덱스를 스키마로 쓰지 못한다(#6974, v7.4 프리뷰).
-- 이름 · 정의는 schema.prisma 주석에, 존재는 tests/schema-objects-database.test.ts 가 확인한다
-- 사람당 처리 중 동기화 하나 — 시작 코드는 오래된 처리 중을 실패로 바꾼 뒤 새 줄을 만든다(같은 트랜잭션)
CREATE UNIQUE INDEX "DataSync_one_processing_per_user" ON "DataSync"("user_id") WHERE "status" = 'processing';
-- 같은 사람 · 채보 · 칸의 대기 중 제안 하나 — 다시 내면 대기 중인 것의 값을 바꾼다
CREATE UNIQUE INDEX "chart_field_proposals_one_pending" ON "chart_field_proposals"("user_id", "chart_id", "field") WHERE "status" = 'pending';
