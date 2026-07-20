ALTER TABLE "User"
ADD COLUMN "hide_nostalgia_name" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "hide_play_count" BOOLEAN NOT NULL DEFAULT false;
