-- 최근 플레이 최신순을 played_at 으로(2026-10-16 P4). 쓰기를 막지 않게 CONCURRENTLY, Prisma 6.19 는 파일 하나를 한 트랜잭션으로 보내므로 이 문장 하나만 둔다.
-- 실패해 INVALID 인덱스가 남으면 DROP INDEX CONCURRENTLY "ChartPlayHistory_user_id_played_at_id_idx"; 뒤 다시 적용한다.
CREATE INDEX CONCURRENTLY IF NOT EXISTS "ChartPlayHistory_user_id_played_at_id_idx" ON "ChartPlayHistory"("user_id", "played_at" DESC, "id" DESC);
