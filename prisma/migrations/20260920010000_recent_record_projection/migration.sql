BEGIN;

-- Existing PlayData rows are authoritative full imports. Preserve all values.
ALTER TABLE "User" ADD COLUMN "last_full_record_at" TIMESTAMP(3);
ALTER TABLE "ChartPlayHistory" ADD COLUMN "record_applied" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "ChartPlayHistory_user_id_record_applied_idx" ON "ChartPlayHistory"("user_id", "record_applied");
ALTER TABLE "PlayData" ALTER COLUMN "grade_recital" DROP NOT NULL;
ALTER TABLE "ChartRecordSnapshot" ALTER COLUMN "grade_recital" DROP NOT NULL;
ALTER TABLE "UserBestGrade" ALTER COLUMN "grade_recital" DROP NOT NULL;

-- Do not replay pre-migration history into official lifetime counts.
UPDATE "User" u SET "last_full_record_at" = p.latest
FROM (SELECT user_id, MAX(updated_at) AS latest FROM "PlayData" GROUP BY user_id) p
WHERE u.id = p.user_id;

COMMIT;
