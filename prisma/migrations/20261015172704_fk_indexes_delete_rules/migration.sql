-- 2026-10-16 DB 재설계 P2 — 인덱스 없는 외래 키에 인덱스, 대시보드 · 동기화 목록용 인덱스 2개, 겹치거나 안 쓰는 인덱스 2개 정리,
-- 검정 · 빙고의 「이력이 있으면 삭제 금지」 를 DB 도 지키게 삭제 규칙을 Restrict 로(앱은 이미 같은 규칙으로 막는다).
-- 큰 표 두 개(ChartPlayHistory · ChartRecordSnapshot)의 chart_id 인덱스는 뒤의 CONCURRENTLY 단독 마이그레이션 두 개가 만든다.
-- 이 파일은 한 트랜잭션으로 돌아 외래 키를 지웠다 다시 거는 사이 빈틈이 없다. 나머지 표는 작아 잠금이 짧다.
SET lock_timeout = '5s';

-- DropForeignKey
ALTER TABLE "ExamAchievement" DROP CONSTRAINT "ExamAchievement_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "ExamSubmission" DROP CONSTRAINT "ExamSubmission_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "userBingoCellData" DROP CONSTRAINT "userBingoCellData_bingo_cell_id_fkey";

-- DropIndex
DROP INDEX "BingoCell_mission_type_idx";

-- DropIndex
DROP INDEX "contribution_points_user_id_idx";

-- CreateIndex
CREATE INDEX "ArcadeSlugAlias_arcadeId_idx" ON "ArcadeSlugAlias"("arcadeId");

-- CreateIndex
CREATE INDEX "Bingo_music_idx_idx" ON "Bingo"("music_idx");

-- CreateIndex
CREATE INDEX "ChartGoalVote_userId_idx" ON "ChartGoalVote"("userId");

-- CreateIndex
CREATE INDEX "ChartPattern_author_id_idx" ON "ChartPattern"("author_id");

-- CreateIndex
CREATE INDEX "CommunityEvent_reviewer_id_idx" ON "CommunityEvent"("reviewer_id");

-- CreateIndex
CREATE INDEX "CommunityOpinionReport_userId_idx" ON "CommunityOpinionReport"("userId");

-- CreateIndex
CREATE INDEX "CommunityOpinionReport_authorId_idx" ON "CommunityOpinionReport"("authorId");

-- CreateIndex
CREATE INDEX "DataSync_status_started_at_idx" ON "DataSync"("status", "started_at");

-- CreateIndex
CREATE INDEX "ExamSubmission_exam_id_idx" ON "ExamSubmission"("exam_id");

-- CreateIndex
CREATE INDEX "FeedbackReport_arcadeId_idx" ON "FeedbackReport"("arcadeId");

-- CreateIndex
CREATE INDEX "FeedbackReport_cabinetId_idx" ON "FeedbackReport"("cabinetId");

-- CreateIndex
CREATE INDEX "User_created_at_idx" ON "User"("created_at");

-- CreateIndex
CREATE INDEX "UserPinnedRecord_chart_id_idx" ON "UserPinnedRecord"("chart_id");

-- AddForeignKey
ALTER TABLE "userBingoCellData" ADD CONSTRAINT "userBingoCellData_bingo_cell_id_fkey" FOREIGN KEY ("bingo_cell_id") REFERENCES "BingoCell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamSubmission" ADD CONSTRAINT "ExamSubmission_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAchievement" ADD CONSTRAINT "ExamAchievement_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
