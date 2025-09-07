/*
  Warnings:

  - You are about to drop the column `score_a_plus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `score_b` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `score_b_plus` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "kakao_id" BIGINT,
    "avatar" TEXT,
    "country" TEXT,
    "rank" INTEGER,
    "rank_country" INTEGER,
    "play_count" INTEGER,
    "score_p" INTEGER,
    "score_s" INTEGER,
    "score_a2" INTEGER,
    "score_a" INTEGER,
    "score_b2" INTEGER,
    "grade_basic" INTEGER,
    "grade_recital" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "country", "created_at", "grade_basic", "grade_recital", "id", "kakao_id", "play_count", "rank", "rank_country", "score_a", "score_p", "updated_at", "username") SELECT "avatar", "country", "created_at", "grade_basic", "grade_recital", "id", "kakao_id", "play_count", "rank", "rank_country", "score_a", "score_p", "updated_at", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_kakao_id_key" ON "User"("kakao_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
