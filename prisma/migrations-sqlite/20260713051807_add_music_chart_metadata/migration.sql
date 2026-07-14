-- AlterTable
ALTER TABLE "MusicChart" ADD COLUMN "bpm_max" INTEGER;
ALTER TABLE "MusicChart" ADD COLUMN "bpm_min" INTEGER;
ALTER TABLE "MusicChart" ADD COLUMN "chart_preview_url" TEXT;
ALTER TABLE "MusicChart" ADD COLUMN "duration_seconds" INTEGER;
ALTER TABLE "MusicChart" ADD COLUMN "note_count" INTEGER;
ALTER TABLE "MusicChart" ADD COLUMN "play_video_url" TEXT;
ALTER TABLE "MusicChart" ADD COLUMN "released_at" DATETIME;
ALTER TABLE "MusicChart" ADD COLUMN "unlock_condition" TEXT;
