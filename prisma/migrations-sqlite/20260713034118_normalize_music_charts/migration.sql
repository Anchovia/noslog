-- CreateTable
CREATE TABLE "MusicChart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "level_constant" REAL,
    "music_idx" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "MusicChart_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 기존 난이도 컬럼을 채보 행으로 이전한다.
INSERT INTO "MusicChart" ("difficulty", "level", "music_idx", "created_at", "updated_at")
SELECT 'Normal', "normal", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Music";
INSERT INTO "MusicChart" ("difficulty", "level", "music_idx", "created_at", "updated_at")
SELECT 'Hard', "hard", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Music";
INSERT INTO "MusicChart" ("difficulty", "level", "music_idx", "created_at", "updated_at")
SELECT 'Expert', "expert", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Music";
INSERT INTO "MusicChart" ("difficulty", "level", "music_idx", "created_at", "updated_at")
SELECT 'Real', "real", "index", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Music" WHERE "real" IS NOT NULL;

-- CreateTable
CREATE TABLE "ChartConstantHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "effective_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chart_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChartConstantHistory_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartEvaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "perceived_constant" REAL NOT NULL,
    "stairs" INTEGER NOT NULL,
    "chord" INTEGER NOT NULL,
    "trill" INTEGER NOT NULL,
    "glissando" INTEGER NOT NULL,
    "repetition" INTEGER NOT NULL,
    "comment" TEXT,
    "chart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ChartEvaluation_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartEvaluation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartEvaluationReaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "evaluation_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ChartEvaluationReaction_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "ChartEvaluation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartEvaluationReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BasicBestPlay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "besttime" TEXT NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,
    CONSTRAINT "BasicBestPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BasicBestPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BasicBestPlay_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BasicBestPlay" ("besttime", "created_at", "difficulty", "fc_type", "grade_basic", "id", "level", "max_combo", "music_idx", "rank", "score", "updated_at", "user_id", "chart_id") SELECT b."besttime", b."created_at", b."difficulty", b."fc_type", b."grade_basic", b."id", b."level", b."max_combo", b."music_idx", b."rank", b."score", b."updated_at", b."user_id", c."id" FROM "BasicBestPlay" b LEFT JOIN "MusicChart" c ON c."music_idx" = b."music_idx" AND c."difficulty" = b."difficulty";
DROP TABLE "BasicBestPlay";
ALTER TABLE "new_BasicBestPlay" RENAME TO "BasicBestPlay";
CREATE TABLE "new_PlayData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "play_count" INTEGER NOT NULL,
    "fullcombo_count" INTEGER NOT NULL,
    "pianistic_count" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "besttime" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,
    CONSTRAINT "PlayData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayData_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayData_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PlayData" ("besttime", "created_at", "difficulty", "fc_type", "fullcombo_count", "grade_basic", "grade_recital", "id", "level", "max_combo", "music_idx", "pianistic_count", "play_count", "rank", "score", "updated_at", "user_id", "chart_id") SELECT p."besttime", p."created_at", p."difficulty", p."fc_type", p."fullcombo_count", p."grade_basic", p."grade_recital", p."id", p."level", p."max_combo", p."music_idx", p."pianistic_count", p."play_count", p."rank", p."score", p."updated_at", p."user_id", c."id" FROM "PlayData" p LEFT JOIN "MusicChart" c ON c."music_idx" = p."music_idx" AND c."difficulty" = p."difficulty";
DROP TABLE "PlayData";
ALTER TABLE "new_PlayData" RENAME TO "PlayData";
CREATE TABLE "new_RecentPlay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "play_time" TEXT NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,
    CONSTRAINT "RecentPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecentPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecentPlay_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RecentPlay" ("created_at", "difficulty", "grade_basic", "id", "level", "max_combo", "music_idx", "play_time", "rank", "score", "updated_at", "user_id", "chart_id") SELECT r."created_at", r."difficulty", r."grade_basic", r."id", r."level", r."max_combo", r."music_idx", r."play_time", r."rank", r."score", r."updated_at", r."user_id", c."id" FROM "RecentPlay" r LEFT JOIN "MusicChart" c ON c."music_idx" = r."music_idx" AND c."difficulty" = r."difficulty";
DROP TABLE "RecentPlay";
ALTER TABLE "new_RecentPlay" RENAME TO "RecentPlay";
CREATE TABLE "new_RecitalBestPlay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "besttime" TEXT NOT NULL,
    "grade_recital" INTEGER NOT NULL,
    "fc_type" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    "chart_id" INTEGER,
    CONSTRAINT "RecitalBestPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecitalBestPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecitalBestPlay_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RecitalBestPlay" ("besttime", "created_at", "difficulty", "fc_type", "grade_recital", "id", "level", "max_combo", "music_idx", "rank", "score", "updated_at", "user_id", "chart_id") SELECT r."besttime", r."created_at", r."difficulty", r."fc_type", r."grade_recital", r."id", r."level", r."max_combo", r."music_idx", r."rank", r."score", r."updated_at", r."user_id", c."id" FROM "RecitalBestPlay" r LEFT JOIN "MusicChart" c ON c."music_idx" = r."music_idx" AND c."difficulty" = r."difficulty";
DROP TABLE "RecitalBestPlay";
ALTER TABLE "new_RecitalBestPlay" RENAME TO "RecitalBestPlay";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "MusicChart_level_idx" ON "MusicChart"("level");

-- CreateIndex
CREATE INDEX "MusicChart_level_constant_idx" ON "MusicChart"("level_constant");

-- CreateIndex
CREATE UNIQUE INDEX "MusicChart_music_idx_difficulty_key" ON "MusicChart"("music_idx", "difficulty");

-- CreateIndex
CREATE INDEX "ChartConstantHistory_chart_id_effective_at_idx" ON "ChartConstantHistory"("chart_id", "effective_at");

-- CreateIndex
CREATE INDEX "ChartEvaluation_chart_id_perceived_constant_idx" ON "ChartEvaluation"("chart_id", "perceived_constant");

-- CreateIndex
CREATE UNIQUE INDEX "ChartEvaluation_chart_id_user_id_key" ON "ChartEvaluation"("chart_id", "user_id");

-- CreateIndex
CREATE INDEX "ChartEvaluationReaction_evaluation_id_value_idx" ON "ChartEvaluationReaction"("evaluation_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "ChartEvaluationReaction_evaluation_id_user_id_key" ON "ChartEvaluationReaction"("evaluation_id", "user_id");
