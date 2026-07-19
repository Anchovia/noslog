ALTER TABLE "User" ADD COLUMN "profile_completed_at" TIMESTAMP(3);

UPDATE "User"
SET "profile_completed_at" = CURRENT_TIMESTAMP
WHERE "username" IS NOT NULL;
