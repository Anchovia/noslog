-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BingoCell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "challenge" TEXT NOT NULL,
    "category_short" TEXT,
    "music_idx" TEXT,
    "level" TEXT,
    "isReal" BOOLEAN NOT NULL DEFAULT false,
    "bingo_id" INTEGER NOT NULL,
    CONSTRAINT "BingoCell_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BingoCell_bingo_id_fkey" FOREIGN KEY ("bingo_id") REFERENCES "Bingo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BingoCell" ("bingo_id", "category_short", "challenge", "id", "level", "music_idx", "position") SELECT "bingo_id", "category_short", "challenge", "id", "level", "music_idx", "position" FROM "BingoCell";
DROP TABLE "BingoCell";
ALTER TABLE "new_BingoCell" RENAME TO "BingoCell";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
