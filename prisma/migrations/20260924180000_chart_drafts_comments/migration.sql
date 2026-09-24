-- 유저 기여 3단계(2026-09-24): 유저별 채보 초안 · 채보 시각 댓글 · 공개 채보의 실제 작성자
-- 테이블 · 칸 추가만, 기존 데이터 변경 없음

-- AlterTable
ALTER TABLE "ChartPattern" ADD COLUMN     "author_id" INTEGER;

-- CreateTable
CREATE TABLE "chart_drafts" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "base_revision" INTEGER,
    "submitted_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_comments" (
    "id" SERIAL NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "draft_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "time_ms" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "resolved_by_id" INTEGER,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chart_drafts_status_submitted_at_idx" ON "chart_drafts"("status", "submitted_at");

-- CreateIndex
CREATE INDEX "chart_drafts_chart_id_idx" ON "chart_drafts"("chart_id");

-- CreateIndex
CREATE INDEX "chart_drafts_reviewed_by_id_idx" ON "chart_drafts"("reviewed_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "chart_drafts_user_id_chart_id_key" ON "chart_drafts"("user_id", "chart_id");

-- CreateIndex
CREATE INDEX "chart_comments_chart_id_draft_id_time_ms_idx" ON "chart_comments"("chart_id", "draft_id", "time_ms");

-- CreateIndex
CREATE INDEX "chart_comments_draft_id_idx" ON "chart_comments"("draft_id");

-- CreateIndex
CREATE INDEX "chart_comments_user_id_created_at_idx" ON "chart_comments"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "chart_comments_resolved_by_id_idx" ON "chart_comments"("resolved_by_id");

-- AddForeignKey
ALTER TABLE "chart_drafts" ADD CONSTRAINT "chart_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_drafts" ADD CONSTRAINT "chart_drafts_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_drafts" ADD CONSTRAINT "chart_drafts_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_comments" ADD CONSTRAINT "chart_comments_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_comments" ADD CONSTRAINT "chart_comments_draft_id_fkey" FOREIGN KEY ("draft_id") REFERENCES "chart_drafts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_comments" ADD CONSTRAINT "chart_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_comments" ADD CONSTRAINT "chart_comments_resolved_by_id_fkey" FOREIGN KEY ("resolved_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartPattern" ADD CONSTRAINT "ChartPattern_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

