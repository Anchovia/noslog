-- 2026-10-15 D7: 최근 플레이 · 동기화 정리 · 커뮤니티 평가 조회용 인덱스, 겹치는 인덱스 둘 정리.
-- TierList 두 줄은 스키마와 옛 마이그레이션 이름이 어긋나 있던 것(2026-07-22 목표 서열표)을 스키마에 맞춘다.

-- DropIndex
DROP INDEX "ChartPlayHistory_user_id_chart_id_source_play_time_idx";

-- DropIndex
DROP INDEX "TierBand_tier_list_id_value_idx";

-- DropIndex
DROP INDEX "TierList_mode_status_updated_at_idx";

-- CreateIndex
CREATE INDEX "ChartPlayHistory_user_id_source_play_time_id_idx" ON "ChartPlayHistory"("user_id", "source_play_time" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "ChartPlayHistory_first_sync_id_idx" ON "ChartPlayHistory"("first_sync_id");

-- CreateIndex
CREATE INDEX "CommunityChartEvaluation_userId_excluded_idx" ON "CommunityChartEvaluation"("userId", "excluded");

-- RenameIndex
ALTER INDEX "TierList_mode_goal_status_updatedAt_idx" RENAME TO "TierList_mode_goal_status_updated_at_idx";
