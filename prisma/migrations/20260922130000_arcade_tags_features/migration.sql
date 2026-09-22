-- 기체 태그 · 특징(정해진 보기 3단계 + 기타 글), 오락실 시설 (2026-09-22)
ALTER TABLE "ArcadeCabinet"
    ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "key_weight" TEXT,
    ADD COLUMN "screen_lag" TEXT,
    ADD COLUMN "sound_volume" TEXT,
    ADD COLUMN "feature_note" TEXT;

ALTER TABLE "ArcadePublicDetails"
    ADD COLUMN "facilities" TEXT[] DEFAULT ARRAY[]::TEXT[];
