-- 유저 기여: 채보 정보 제안(BPM · 노트 수 · 길이 · 수록일) + 반영된 값의 출처를 제안에 잇는다(2026-09-23)
-- 테이블 · 칸 추가만, 기존 데이터 변경 없음

-- AlterTable
ALTER TABLE "chart_field_sources" ADD COLUMN     "proposal_id" INTEGER;

-- CreateTable
CREATE TABLE "chart_field_proposals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "previous_value" TEXT,
    "evidence_kind" TEXT NOT NULL,
    "evidence_url" TEXT,
    "evidence_note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reject_reason" TEXT,
    "reviewed_by_id" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_field_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chart_field_proposals_status_created_at_idx" ON "chart_field_proposals"("status", "created_at");

-- CreateIndex
CREATE INDEX "chart_field_proposals_user_id_created_at_idx" ON "chart_field_proposals"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "chart_field_proposals_chart_id_field_status_idx" ON "chart_field_proposals"("chart_id", "field", "status");

-- CreateIndex
CREATE INDEX "chart_field_proposals_reviewed_by_id_idx" ON "chart_field_proposals"("reviewed_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "chart_field_sources_proposal_id_key" ON "chart_field_sources"("proposal_id");

-- AddForeignKey
ALTER TABLE "chart_field_sources" ADD CONSTRAINT "chart_field_sources_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "chart_field_proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_field_proposals" ADD CONSTRAINT "chart_field_proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_field_proposals" ADD CONSTRAINT "chart_field_proposals_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_field_proposals" ADD CONSTRAINT "chart_field_proposals_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

