-- DropIndex
DROP INDEX "Exam_status_starts_at_ends_at_idx";

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "starts_at";
ALTER TABLE "Exam" DROP COLUMN "ends_at";

-- CreateIndex
CREATE INDEX "Exam_status_idx" ON "Exam"("status");
