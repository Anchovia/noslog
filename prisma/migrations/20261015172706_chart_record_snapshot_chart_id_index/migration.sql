-- 큰 표라 쓰기를 막지 않게 CONCURRENTLY 로 만든다. Prisma 6.19 는 파일 하나를 한 트랜잭션으로 보내므로 이 문장 하나만 둔다(2026-10-16 실측).
-- 실패해 INVALID 인덱스가 남으면 DROP INDEX CONCURRENTLY "ChartRecordSnapshot_chart_id_idx"; 뒤 다시 적용한다.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ChartRecordSnapshot_chart_id_idx" ON "ChartRecordSnapshot"("chart_id");
