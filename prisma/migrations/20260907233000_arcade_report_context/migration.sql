-- AlterTable
ALTER TABLE "FeedbackReport" ADD COLUMN     "arcadeId" INTEGER,
ADD COLUMN     "arcadeReportType" TEXT,
ADD COLUMN     "cabinetId" INTEGER,
ADD COLUMN     "submissionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackReport_user_id_submissionId_key" ON "FeedbackReport"("user_id", "submissionId");

-- AddForeignKey
ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_arcadeId_fkey" FOREIGN KEY ("arcadeId") REFERENCES "Arcade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "ArcadeCabinet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_arcade_type_check" CHECK ("arcadeReportType" IS NULL OR "arcadeReportType" IN ('unavailable','condition','count','price','hours','address','other'));

