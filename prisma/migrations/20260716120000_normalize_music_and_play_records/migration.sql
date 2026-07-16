-- MusicChart를 채보 레벨의 단일 원본으로 사용하기 전에 누락된 채보를 보충함
INSERT INTO "MusicChart" (
    "difficulty",
    "level",
    "music_idx",
    "created_at",
    "updated_at"
)
SELECT 'Normal', "normal", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Music"
ON CONFLICT ("music_idx", "difficulty") DO NOTHING;

INSERT INTO "MusicChart" (
    "difficulty",
    "level",
    "music_idx",
    "created_at",
    "updated_at"
)
SELECT 'Hard', "hard", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Music"
ON CONFLICT ("music_idx", "difficulty") DO NOTHING;

INSERT INTO "MusicChart" (
    "difficulty",
    "level",
    "music_idx",
    "created_at",
    "updated_at"
)
SELECT 'Expert', "expert", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Music"
ON CONFLICT ("music_idx", "difficulty") DO NOTHING;

INSERT INTO "MusicChart" (
    "difficulty",
    "level",
    "music_idx",
    "created_at",
    "updated_at"
)
SELECT 'Real', "real", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Music"
WHERE "real" IS NOT NULL
ON CONFLICT ("music_idx", "difficulty") DO NOTHING;

-- 과거 데이터 중 chart_id가 비어 있는 현재 기록을 정규화된 채보와 연결함
UPDATE "PlayData" AS play
SET "chart_id" = chart."id"
FROM "MusicChart" AS chart
WHERE play."chart_id" IS NULL
  AND play."music_idx" = chart."music_idx"
  AND LOWER(play."difficulty") = LOWER(chart."difficulty");

-- 동일 사용자·채보의 중복 현재 기록은 최신 행 하나만 유지함
WITH ranked_records AS (
    SELECT
        "id",
        ROW_NUMBER() OVER (
            PARTITION BY "user_id", "chart_id"
            ORDER BY "updated_at" DESC, "score" DESC, "id" DESC
        ) AS row_number
    FROM "PlayData"
    WHERE "chart_id" IS NOT NULL
)
DELETE FROM "PlayData"
WHERE "id" IN (
    SELECT "id"
    FROM ranked_records
    WHERE row_number > 1
);

-- Grd는 모든 테이블에서 공식 원시 단위(표시값 x 100)로 통일함
UPDATE "UserBestGrade"
SET
    "grade_basic" = "grade_basic" * 100,
    "grade_recital" = "grade_recital" * 100;

-- 조회 패턴에 맞는 제약조건과 인덱스를 추가함
CREATE UNIQUE INDEX "PlayData_user_id_chart_id_key"
ON "PlayData"("user_id", "chart_id");

CREATE INDEX "PlayData_chart_id_score_user_id_idx"
ON "PlayData"("chart_id", "score", "user_id");

CREATE INDEX "PlayData_user_id_grade_basic_idx"
ON "PlayData"("user_id", "grade_basic");

CREATE INDEX "PlayData_user_id_grade_recital_idx"
ON "PlayData"("user_id", "grade_recital");

CREATE INDEX "UserBestGrade_user_id_besttime_idx"
ON "UserBestGrade"("user_id", "besttime");

CREATE INDEX "User_grade_basic_id_idx"
ON "User"("grade_basic", "id");

CREATE INDEX "User_grade_recital_id_idx"
ON "User"("grade_recital", "id");

CREATE INDEX "User_country_grade_basic_id_idx"
ON "User"("country", "grade_basic", "id");

CREATE INDEX "User_country_grade_recital_id_idx"
ON "User"("country", "grade_recital", "id");

-- 현재 기록과 플레이 이력으로 대체된 파생 복제 테이블을 제거함
DROP TABLE "RecentPlay";
DROP TABLE "BasicBestPlay";
DROP TABLE "RecitalBestPlay";

-- Music에는 악곡 메타데이터만 남기고 채보 레벨은 MusicChart에서 관리함
ALTER TABLE "Music"
    DROP COLUMN "sheet_len",
    DROP COLUMN "difficulty_levels",
    DROP COLUMN "difficulty_name",
    DROP COLUMN "normal",
    DROP COLUMN "hard",
    DROP COLUMN "expert",
    DROP COLUMN "real";
