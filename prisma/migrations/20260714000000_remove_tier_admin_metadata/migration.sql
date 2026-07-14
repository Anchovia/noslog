-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TierList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_TierList" ("created_at", "description", "id", "mode", "slug", "status", "title", "updated_at") SELECT "created_at", "description", "id", "mode", "slug", "status", "title", "updated_at" FROM "TierList";
DROP TABLE "TierList";
ALTER TABLE "new_TierList" RENAME TO "TierList";
CREATE UNIQUE INDEX "TierList_slug_key" ON "TierList"("slug");
CREATE INDEX "TierList_mode_status_updated_at_idx" ON "TierList"("mode", "status", "updated_at");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
