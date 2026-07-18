-- 삭제된 승인 제출이 남긴 고아 합격 이력을 정리함
DELETE FROM "ExamAchievement"
WHERE "submission_id" IS NULL;

-- 합격 이력은 승인 제출과 항상 함께 존재하도록 관계를 강화함
ALTER TABLE "ExamAchievement"
DROP CONSTRAINT "ExamAchievement_submission_id_fkey";

ALTER TABLE "ExamAchievement"
ALTER COLUMN "submission_id" SET NOT NULL;

ALTER TABLE "ExamAchievement"
ADD CONSTRAINT "ExamAchievement_submission_id_fkey"
FOREIGN KEY ("submission_id") REFERENCES "ExamSubmission"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
