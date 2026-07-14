-- CreateTable
CREATE TABLE "TierList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "level_label" TEXT,
    "description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TierBand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" REAL NOT NULL,
    "position" INTEGER NOT NULL,
    "tier_list_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "TierBand_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TierEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "tier_list_id" INTEGER NOT NULL,
    "tier_band_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "TierEntry_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TierEntry_tier_band_id_fkey" FOREIGN KEY ("tier_band_id") REFERENCES "TierBand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TierEntry_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TierPlacementHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "band_value" REAL,
    "effective_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tier_list_id" INTEGER NOT NULL,
    "chart_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TierPlacementHistory_tier_list_id_fkey" FOREIGN KEY ("tier_list_id") REFERENCES "TierList" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TierPlacementHistory_chart_id_fkey" FOREIGN KEY ("chart_id") REFERENCES "MusicChart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TierList_slug_key" ON "TierList"("slug");

-- CreateIndex
CREATE INDEX "TierList_mode_status_idx" ON "TierList"("mode", "status");

-- CreateIndex
CREATE INDEX "TierList_is_featured_updated_at_idx" ON "TierList"("is_featured", "updated_at");

-- CreateIndex
CREATE INDEX "TierBand_tier_list_id_value_idx" ON "TierBand"("tier_list_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "TierBand_tier_list_id_value_key" ON "TierBand"("tier_list_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "TierBand_tier_list_id_position_key" ON "TierBand"("tier_list_id", "position");

-- CreateIndex
CREATE INDEX "TierEntry_tier_list_id_tier_band_id_idx" ON "TierEntry"("tier_list_id", "tier_band_id");

-- CreateIndex
CREATE INDEX "TierEntry_chart_id_idx" ON "TierEntry"("chart_id");

-- CreateIndex
CREATE UNIQUE INDEX "TierEntry_tier_list_id_chart_id_key" ON "TierEntry"("tier_list_id", "chart_id");

-- CreateIndex
CREATE UNIQUE INDEX "TierEntry_tier_band_id_position_key" ON "TierEntry"("tier_band_id", "position");

-- CreateIndex
CREATE INDEX "TierPlacementHistory_tier_list_id_chart_id_effective_at_idx" ON "TierPlacementHistory"("tier_list_id", "chart_id", "effective_at");

-- CreateIndex
CREATE INDEX "TierPlacementHistory_chart_id_effective_at_idx" ON "TierPlacementHistory"("chart_id", "effective_at");
