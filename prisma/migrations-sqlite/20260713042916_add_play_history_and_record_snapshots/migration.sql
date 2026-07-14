-- CreateTable
CREATE TABLE "DataSync" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "received_plays" INTEGER NOT NULL DEFAULT 0,
    "inserted_plays" INTEGER NOT NULL DEFAULT 0,
    "changed_records" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "user_id" INTEGER NOT NULL,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    CONSTRAINT "DataSync_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartPlayHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL,
    "max_combo" INTEGER NOT NULL,
    "rank" TEXT NOT NULL,
    "grade_basic" INTEGER NOT NULL,
    "source_play_time" TEXT NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_sync_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChartPlayHistory_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartPlayHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartPlayHistory_first_sync_id_fkey" FOREIGN KEY ("first_sync_id") REFERENCES "DataSync" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChartRecordSnapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level" INTEGER NOT NULL,
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
    "chart_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sync_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChartRecordSnapshot_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartRecordSnapshot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChartRecordSnapshot_sync_id_fkey" FOREIGN KEY ("sync_id") REFERENCES "DataSync" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Seed one completed sync per user from the records that existed before this migration.
INSERT INTO "DataSync" (
    "status",
    "received_plays",
    "inserted_plays",
    "changed_records",
    "user_id",
    "completed_at"
)
SELECT
    'completed',
    (SELECT COUNT(*) FROM "RecentPlay" rp WHERE rp."user_id" = u."id"),
    (SELECT COUNT(*) FROM "RecentPlay" rp WHERE rp."user_id" = u."id"),
    (SELECT COUNT(*) FROM "PlayData" pd WHERE pd."user_id" = u."id"),
    u."id",
    CURRENT_TIMESTAMP
FROM "User" u
WHERE EXISTS (SELECT 1 FROM "RecentPlay" rp WHERE rp."user_id" = u."id")
   OR EXISTS (SELECT 1 FROM "PlayData" pd WHERE pd."user_id" = u."id");

-- Preserve the currently stored recent plays as the beginning of the long-term history.
INSERT INTO "ChartPlayHistory" (
    "score",
    "max_combo",
    "rank",
    "grade_basic",
    "source_play_time",
    "chart_id",
    "user_id",
    "first_sync_id",
    "created_at"
)
SELECT
    rp."score",
    rp."max_combo",
    rp."rank",
    rp."grade_basic",
    rp."play_time",
    rp."chart_id",
    rp."user_id",
    ds."id",
    rp."created_at"
FROM "RecentPlay" rp
JOIN "DataSync" ds ON ds."user_id" = rp."user_id"
WHERE rp."chart_id" IS NOT NULL;

-- Store the current aggregate record as each chart's initial snapshot.
INSERT INTO "ChartRecordSnapshot" (
    "level",
    "score",
    "rank",
    "fc_type",
    "play_count",
    "fullcombo_count",
    "pianistic_count",
    "max_combo",
    "grade_basic",
    "grade_recital",
    "besttime",
    "chart_id",
    "user_id",
    "sync_id",
    "created_at"
)
SELECT
    pd."level",
    pd."score",
    pd."rank",
    pd."fc_type",
    pd."play_count",
    pd."fullcombo_count",
    pd."pianistic_count",
    pd."max_combo",
    pd."grade_basic",
    pd."grade_recital",
    pd."besttime",
    pd."chart_id",
    pd."user_id",
    ds."id",
    pd."created_at"
FROM "PlayData" pd
JOIN "DataSync" ds ON ds."user_id" = pd."user_id"
WHERE pd."chart_id" IS NOT NULL;

-- CreateIndex
CREATE INDEX "DataSync_user_id_started_at_idx" ON "DataSync"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "ChartPlayHistory_user_id_chart_id_source_play_time_idx" ON "ChartPlayHistory"("user_id", "chart_id", "source_play_time");

-- CreateIndex
CREATE UNIQUE INDEX "ChartPlayHistory_user_id_chart_id_source_play_time_score_max_combo_rank_key" ON "ChartPlayHistory"("user_id", "chart_id", "source_play_time", "score", "max_combo", "rank");

-- CreateIndex
CREATE INDEX "ChartRecordSnapshot_user_id_chart_id_created_at_idx" ON "ChartRecordSnapshot"("user_id", "chart_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ChartRecordSnapshot_sync_id_chart_id_key" ON "ChartRecordSnapshot"("sync_id", "chart_id");
