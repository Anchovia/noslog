-- AlterTable
ALTER TABLE "chart_pattern_metrics" ADD COLUMN     "glissando_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tempo_changes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tenuto_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trill_count" INTEGER NOT NULL DEFAULT 0;
