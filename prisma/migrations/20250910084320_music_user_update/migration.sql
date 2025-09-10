/*
  Warnings:

  - Added the required column `difficulty_levels` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Bookmark" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "music_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bookmark_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "index" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_kana" TEXT NOT NULL,
    "artist" TEXT,
    "category" TEXT NOT NULL,
    "category_short" TEXT NOT NULL,
    "description" TEXT,
    "background" TEXT,
    "sheet_len" INTEGER NOT NULL,
    "difficulty_levels" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Music" ("artist", "background", "category", "category_short", "created_at", "description", "id", "index", "sheet_len", "title", "title_kana", "updated_at") SELECT "artist", "background", "category", "category_short", "created_at", "description", "id", "index", "sheet_len", "title", "title_kana", "updated_at" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_index_key" ON "Music"("index");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "kakao_id" BIGINT,
    "avatar" TEXT,
    "country" TEXT NOT NULL DEFAULT 'ko-KR',
    "rank_basic" INTEGER,
    "rank_recital" INTEGER,
    "rank_basic_country" INTEGER,
    "rank_recital_country" INTEGER,
    "play_count" INTEGER,
    "score_p" INTEGER,
    "score_s" INTEGER,
    "score_a2" INTEGER,
    "score_a" INTEGER,
    "score_b2" INTEGER,
    "role" TEXT NOT NULL DEFAULT 'user',
    "grade_basic" INTEGER,
    "grade_recital" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "country", "created_at", "grade_basic", "grade_recital", "id", "kakao_id", "play_count", "rank_basic", "rank_basic_country", "rank_recital", "rank_recital_country", "score_a", "score_a2", "score_b2", "score_p", "score_s", "updated_at", "username") SELECT "avatar", coalesce("country", 'ko-KR') AS "country", "created_at", "grade_basic", "grade_recital", "id", "kakao_id", "play_count", "rank_basic", "rank_basic_country", "rank_recital", "rank_recital_country", "score_a", "score_a2", "score_b2", "score_p", "score_s", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_kakao_id_key" ON "User"("kakao_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_music_id_key" ON "Bookmark"("user_id", "music_id");
