-- 채보 정보의 변속과 노트 종류 수. 다른 표의 수 칸과 같은 Prisma 기본형(Int)에 맞춘다.
-- squawk-ignore-file prefer-bigint-over-int
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
ALTER TABLE "chart_pattern_metrics" ADD COLUMN     "glissando_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tempo_changes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tenuto_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trill_count" INTEGER NOT NULL DEFAULT 0;

COMMIT;
