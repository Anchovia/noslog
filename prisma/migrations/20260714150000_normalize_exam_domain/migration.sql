PRAGMA foreign_keys=OFF;

-- CreateTable
CREATE TABLE "new_Exam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "short_label" TEXT NOT NULL,
    "scoring_type" TEXT NOT NULL DEFAULT 'score',
    "grade" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fee_nos" INTEGER NOT NULL DEFAULT 0,
    "required_grade" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

INSERT INTO "new_Exam" (
    "id", "slug", "mode", "short_label", "scoring_type", "grade",
    "title", "description", "fee_nos", "required_grade", "status",
    "created_at", "updated_at"
)
SELECT
    "id", "slug", "mode",
    CASE
        WHEN "mode" = 'event' THEN "title"
        ELSE CAST("grade" AS TEXT) || '급'
    END,
    CASE WHEN "mode" = 'recital' THEN 'recital_point' ELSE 'score' END,
    "grade", "title", "description", "fee_nos",
    COALESCE("required_grade", 0), "status", "created_at", "updated_at"
FROM "Exam";

-- CreateTable
CREATE TABLE "new_ExamStage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "label" TEXT,
    "requirement_type" TEXT NOT NULL DEFAULT 'single',
    "required_value" REAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ExamStage_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamStage_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_ExamStage" (
    "id", "position", "label", "requirement_type", "required_value",
    "exam_id", "music_idx", "created_at", "updated_at"
)
SELECT
    s."id", s."position", s."label",
    CASE
        WHEN s."requirement_type" = 'single_score' THEN 'single'
        ELSE 'cumulative'
    END,
    CAST(s."required_score" AS REAL), s."exam_id", c."music_idx",
    s."created_at", s."updated_at"
FROM "ExamStage" s
JOIN "MusicChart" c ON c."id" = s."chart_id";

-- CreateTable
CREATE TABLE "ExamStageChart" (
    "stage_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    PRIMARY KEY ("stage_id", "chart_id"),
    CONSTRAINT "ExamStageChart_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "ExamStage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamStageChart_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "ExamStageChart" ("stage_id", "chart_id")
SELECT "id", "chart_id" FROM "ExamStage";

-- CreateTable
CREATE TABLE "ExamReward" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "exam_id" INTEGER NOT NULL,
    "music_idx" TEXT,
    CONSTRAINT "ExamReward_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamReward_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "ExamReward" ("position", "type", "label", "exam_id", "music_idx")
SELECT 1, e."reward_type", e."reward_label", e."id", m."index"
FROM "Exam" e
LEFT JOIN "Music" m
    ON e."reward_type" = 'music_unlock' AND m."title" = e."reward_label"
WHERE e."reward_label" IS NOT NULL;

DROP TABLE "ExamStage";
DROP TABLE "Exam";
ALTER TABLE "new_Exam" RENAME TO "Exam";
ALTER TABLE "new_ExamStage" RENAME TO "ExamStage";

CREATE UNIQUE INDEX "Exam_slug_key" ON "Exam"("slug");
CREATE UNIQUE INDEX "Exam_mode_grade_key" ON "Exam"("mode", "grade");
CREATE INDEX "Exam_status_idx" ON "Exam"("status");
CREATE UNIQUE INDEX "ExamStage_exam_id_position_key" ON "ExamStage"("exam_id", "position");
CREATE INDEX "ExamStage_music_idx_idx" ON "ExamStage"("music_idx");
CREATE INDEX "ExamStageChart_chart_id_idx" ON "ExamStageChart"("chart_id");
CREATE UNIQUE INDEX "ExamReward_exam_id_position_key" ON "ExamReward"("exam_id", "position");
CREATE INDEX "ExamReward_music_idx_idx" ON "ExamReward"("music_idx");

PRAGMA foreign_keys=ON;
