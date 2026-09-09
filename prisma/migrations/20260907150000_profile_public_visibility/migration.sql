-- Separate location-adjacent identity and activity visibility (Profile PROF-09).
ALTER TABLE "User"
ADD COLUMN "hide_preferred_arcade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "hide_play_activity" BOOLEAN NOT NULL DEFAULT false;
