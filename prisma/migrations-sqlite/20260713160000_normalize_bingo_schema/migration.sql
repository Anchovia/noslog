-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Bingo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "nos" INTEGER NOT NULL,
    "line" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "starts_at" DATETIME,
    "ends_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "music_idx" TEXT NOT NULL,
    CONSTRAINT "Bingo_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Bingo" (
    "id",
    "nos",
    "line",
    "status",
    "created_at",
    "updated_at",
    "music_idx"
)
SELECT
    "id",
    "nos",
    "line",
    'published',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    "music_idx"
FROM "Bingo";

DROP TABLE "Bingo";
ALTER TABLE "new_Bingo" RENAME TO "Bingo";
CREATE INDEX "Bingo_status_starts_at_ends_at_idx" ON "Bingo"("status", "starts_at", "ends_at");

CREATE TABLE "new_BingoCell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "challenge" TEXT NOT NULL,
    "mission_type" TEXT NOT NULL DEFAULT 'record',
    "rule_type" TEXT NOT NULL DEFAULT 'manual',
    "rule_config" JSONB,
    "category_short" TEXT,
    "target_difficulty" TEXT,
    "target_level" INTEGER,
    "music_idx" TEXT,
    "bingo_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "BingoCell_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BingoCell_bingo_id_fkey" FOREIGN KEY ("bingo_id") REFERENCES "Bingo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_BingoCell" (
    "id",
    "position",
    "challenge",
    "mission_type",
    "rule_type",
    "category_short",
    "target_difficulty",
    "target_level",
    "music_idx",
    "bingo_id",
    "created_at",
    "updated_at"
)
SELECT
    "id",
    "position",
    "challenge",
    CASE
        WHEN "music_idx" IS NOT NULL THEN 'music'
        WHEN "category_short" IS NOT NULL THEN 'category'
        ELSE 'record'
    END,
    CASE
        WHEN "music_idx" IS NOT NULL THEN 'play_music'
        WHEN "category_short" IS NOT NULL THEN 'play_category'
        ELSE 'manual'
    END,
    "category_short",
    CASE WHEN "isReal" = true THEN 'real' ELSE NULL END,
    CASE
        WHEN "level" GLOB '[0-9]*' THEN CAST("level" AS INTEGER)
        ELSE NULL
    END,
    "music_idx",
    "bingo_id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "BingoCell";

DROP TABLE "BingoCell";
ALTER TABLE "new_BingoCell" RENAME TO "BingoCell";
CREATE INDEX "BingoCell_mission_type_idx" ON "BingoCell"("mission_type");
CREATE INDEX "BingoCell_music_idx_idx" ON "BingoCell"("music_idx");
CREATE UNIQUE INDEX "BingoCell_bingo_id_position_key" ON "BingoCell"("bingo_id", "position");

CREATE TABLE "new_userBingoCellData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completion_source" TEXT NOT NULL DEFAULT 'manual',
    "completed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bingo_cell_id" INTEGER NOT NULL,
    CONSTRAINT "userBingoCellData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "userBingoCellData_bingo_cell_id_fkey" FOREIGN KEY ("bingo_cell_id") REFERENCES "BingoCell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_userBingoCellData" (
    "id",
    "isCompleted",
    "completion_source",
    "completed_at",
    "created_at",
    "updated_at",
    "user_id",
    "bingo_cell_id"
)
SELECT
    MIN("id"),
    MAX("isCompleted"),
    'manual',
    CASE WHEN MAX("isCompleted") = true THEN CURRENT_TIMESTAMP ELSE NULL END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    "user_id",
    "bingo_cell_id"
FROM "userBingoCellData"
GROUP BY "user_id", "bingo_cell_id";

DROP TABLE "userBingoCellData";
ALTER TABLE "new_userBingoCellData" RENAME TO "userBingoCellData";
CREATE INDEX "userBingoCellData_bingo_cell_id_idx" ON "userBingoCellData"("bingo_cell_id");
CREATE UNIQUE INDEX "userBingoCellData_user_id_bingo_cell_id_key" ON "userBingoCellData"("user_id", "bingo_cell_id");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
