-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "kakao_id" BIGINT,
    "avatar" TEXT,
    "play_count" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "index" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_kana" TEXT NOT NULL,
    "artist" TEXT,
    "category" TEXT NOT NULL,
    "category_short" TEXT NOT NULL,
    "description" TEXT,
    "background" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecentPlay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "difficulty" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "play_time" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    "music_idx" TEXT NOT NULL,
    CONSTRAINT "RecentPlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RecentPlay_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayData" (
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
    CONSTRAINT "PlayData_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlayData_music_idx_fkey" FOREIGN KEY ("music_idx") REFERENCES "Music" ("index") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_kakao_id_key" ON "User"("kakao_id");

-- CreateIndex
CREATE UNIQUE INDEX "Music_index_key" ON "Music"("index");
