-- 기존 난이도별 서열표는 보관하고 목표별 통합 서열표를 추가한다.
ALTER TABLE "TierList" ADD COLUMN "goal" TEXT;

UPDATE "TierList"
SET "status" = 'archived', "updated_at" = CURRENT_TIMESTAMP
WHERE "status" = 'published';

INSERT INTO "TierList" (
    "slug",
    "title",
    "mode",
    "goal",
    "description",
    "status",
    "created_at",
    "updated_at"
)
VALUES
    ('basic-s', 'Basic S 서열표', 'basic', 's', 'Basic 모드에서 S 달성을 목표로 하는 통합 서열표', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('basic-fc', 'Basic Full Combo 서열표', 'basic', 'fc', 'Basic 모드에서 Full Combo 달성을 목표로 하는 통합 서열표', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('basic-pianist', 'Basic Pianist 서열표', 'basic', 'pianist', 'Basic 모드에서 Pianist 달성을 목표로 하는 통합 서열표', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('recital-s', 'Recital S 서열표', 'recital', 's', 'Recital 모드에서 S 달성을 목표로 하는 통합 서열표', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('recital-fc', 'Recital Full Combo 서열표', 'recital', 'fc', 'Recital 모드에서 Full Combo 달성을 목표로 하는 통합 서열표', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('recital-pianist', 'Recital Pianist 서열표', 'recital', 'pianist', 'Recital 모드에서 Pianist 달성을 목표로 하는 통합 서열표', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

WITH target_lists AS (
    SELECT "id"
    FROM "TierList"
    WHERE "goal" IN ('s', 'fc', 'pianist')
      AND "mode" IN ('basic', 'recital')
), constants AS (
    SELECT DISTINCT "level_constant" AS "value"
    FROM "MusicChart"
    WHERE "level_constant" IS NOT NULL
), positioned_bands AS (
    SELECT
        target_lists."id" AS "tier_list_id",
        constants."value",
        ROW_NUMBER() OVER (
            PARTITION BY target_lists."id"
            ORDER BY constants."value" DESC
        )::INTEGER AS "position"
    FROM target_lists
    CROSS JOIN constants
)
INSERT INTO "TierBand" (
    "value",
    "position",
    "tier_list_id",
    "created_at",
    "updated_at"
)
SELECT
    "value",
    "position",
    "tier_list_id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM positioned_bands;

WITH positioned_entries AS (
    SELECT
        tier_list."id" AS "tier_list_id",
        tier_band."id" AS "tier_band_id",
        chart."id" AS "chart_id",
        ROW_NUMBER() OVER (
            PARTITION BY tier_band."id"
            ORDER BY
                COALESCE(NULLIF(music."title_kana", ''), music."title"),
                music."title",
                music."index",
                chart."difficulty"
        )::INTEGER AS "position"
    FROM "TierList" tier_list
    JOIN "MusicChart" chart
      ON chart."level_constant" IS NOT NULL
    JOIN "Music" music
      ON music."index" = chart."music_idx"
    JOIN "TierBand" tier_band
      ON tier_band."tier_list_id" = tier_list."id"
     AND tier_band."value" = chart."level_constant"
    WHERE tier_list."goal" IN ('s', 'fc', 'pianist')
      AND tier_list."mode" IN ('basic', 'recital')
)
INSERT INTO "TierEntry" (
    "position",
    "tier_list_id",
    "tier_band_id",
    "chart_id",
    "created_at",
    "updated_at"
)
SELECT
    "position",
    "tier_list_id",
    "tier_band_id",
    "chart_id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM positioned_entries;

INSERT INTO "TierPlacementHistory" (
    "band_value",
    "tier_list_id",
    "chart_id",
    "effective_at",
    "created_at"
)
SELECT
    tier_band."value",
    tier_entry."tier_list_id",
    tier_entry."chart_id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "TierEntry" tier_entry
JOIN "TierBand" tier_band
  ON tier_band."id" = tier_entry."tier_band_id"
JOIN "TierList" tier_list
  ON tier_list."id" = tier_entry."tier_list_id"
WHERE tier_list."goal" IN ('s', 'fc', 'pianist')
  AND tier_list."mode" IN ('basic', 'recital');

CREATE UNIQUE INDEX "TierList_published_mode_goal_key"
ON "TierList" ("mode", "goal")
WHERE "status" = 'published' AND "goal" IS NOT NULL;

DROP INDEX IF EXISTS "TierList_mode_status_updatedAt_idx";
CREATE INDEX "TierList_mode_goal_status_updatedAt_idx"
ON "TierList" ("mode", "goal", "status", "updated_at");
