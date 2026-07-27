ALTER TABLE "ExamSubmission"
ALTER COLUMN "proof_image_url" DROP NOT NULL;

ALTER TABLE "UserBestGrade"
DROP CONSTRAINT "UserBestGrade_user_id_fkey";

ALTER TABLE "UserBestGrade"
ADD CONSTRAINT "UserBestGrade_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayData"
DROP CONSTRAINT "PlayData_user_id_fkey";

ALTER TABLE "PlayData"
ADD CONSTRAINT "PlayData_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
