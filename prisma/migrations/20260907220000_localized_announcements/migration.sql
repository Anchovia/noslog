-- Add the public multilingual model without altering legacy administrator data.
-- Legacy notices remain stored; public eligibility requires all three translations.
CREATE TYPE "AnnouncementPlacement" AS ENUM ('ROUTINE', 'SERVICE_CRITICAL');
ALTER TABLE "Announcement"
  ADD COLUMN "public_slug" TEXT,
  ADD COLUMN "placement" "AnnouncementPlacement" NOT NULL DEFAULT 'ROUTINE',
  ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "active_from" TIMESTAMP(3),
  ADD COLUMN "expires_at" TIMESTAMP(3);
CREATE UNIQUE INDEX "Announcement_public_slug_key" ON "Announcement"("public_slug");
CREATE TABLE "AnnouncementTranslation" (
  "id" SERIAL NOT NULL,
  "announcement_id" INTEGER NOT NULL,
  "locale" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "modified_at" TIMESTAMP(3),
  CONSTRAINT "AnnouncementTranslation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AnnouncementTranslation_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AnnouncementTranslation_locale_check" CHECK ("locale" IN ('ko', 'ja', 'en'))
);
CREATE UNIQUE INDEX "AnnouncementTranslation_announcement_id_locale_key" ON "AnnouncementTranslation"("announcement_id", "locale");
