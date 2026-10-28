-- 2026-10-28 패턴 경향 계산값 — 공개 채보에서 계산한 채보별 원점수 표 하나(기존 표는 바꾸지 않음).
-- 앞 마이그레이션과 같은 이유로 오프라인 비교(prisma migrate diff)로 만들었다.
-- 새 표의 열 타입은 다른 표와 같은 Prisma 기본형(Int · autoincrement · DateTime)에 맞춘다.
-- squawk-ignore-file prefer-bigint-over-int, prefer-identity, prefer-timestamp-tz
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- CreateTable
CREATE TABLE "chart_pattern_metrics" (
    "chart_id" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "published_revision" INTEGER NOT NULL,
    "stairs" DOUBLE PRECISION NOT NULL,
    "repetition" DOUBLE PRECISION NOT NULL,
    "polyrhythm" DOUBLE PRECISION NOT NULL,
    "offset" DOUBLE PRECISION NOT NULL,
    "chords" DOUBLE PRECISION,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chart_pattern_metrics_pkey" PRIMARY KEY ("chart_id")
);

-- AddForeignKey
ALTER TABLE "chart_pattern_metrics" ADD CONSTRAINT "chart_pattern_metrics_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "music_charts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
