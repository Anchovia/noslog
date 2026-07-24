-- 목표별 서열표의 편집 범위를 1.0~14.5, 0.1 간격으로 완성한다.
UPDATE "TierBand" tier_band
SET "position" = -1000000 - tier_band."id"
FROM "TierList" tier_list
WHERE tier_list."id" = tier_band."tier_list_id"
  AND tier_list."goal" IN ('s', 'fc', 'pianist')
  AND tier_list."mode" IN ('basic', 'recital');

WITH target_lists AS (
    SELECT "id"
    FROM "TierList"
    WHERE "goal" IN ('s', 'fc', 'pianist')
      AND "mode" IN ('basic', 'recital')
), missing_bands AS (
    SELECT
        target_lists."id" AS "tier_list_id",
        level_value."unit" / 10.0 AS "value",
        ROW_NUMBER() OVER (
            PARTITION BY target_lists."id"
            ORDER BY level_value."unit" DESC
        )::INTEGER AS "temporary_position"
    FROM target_lists
    CROSS JOIN generate_series(10, 145) AS level_value("unit")
    WHERE NOT EXISTS (
        SELECT 1
        FROM "TierBand" existing_band
        WHERE existing_band."tier_list_id" = target_lists."id"
          AND ROUND(existing_band."value"::NUMERIC, 1) = level_value."unit" / 10.0
    )
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
    -2000000 - "temporary_position",
    "tier_list_id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM missing_bands;

WITH positioned_bands AS (
    SELECT
        tier_band."id",
        ROW_NUMBER() OVER (
            PARTITION BY tier_band."tier_list_id"
            ORDER BY tier_band."value" DESC
        )::INTEGER AS "position"
    FROM "TierBand" tier_band
    JOIN "TierList" tier_list
      ON tier_list."id" = tier_band."tier_list_id"
    WHERE tier_list."goal" IN ('s', 'fc', 'pianist')
      AND tier_list."mode" IN ('basic', 'recital')
)
UPDATE "TierBand" tier_band
SET
    "position" = positioned_bands."position",
    "updated_at" = CURRENT_TIMESTAMP
FROM positioned_bands
WHERE positioned_bands."id" = tier_band."id";
