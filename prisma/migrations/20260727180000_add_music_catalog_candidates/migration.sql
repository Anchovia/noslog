-- CreateTable
CREATE TABLE "MusicCatalogCandidate" (
    "id" SERIAL NOT NULL,
    "music_index" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "before_snapshot" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "seen_count" INTEGER NOT NULL DEFAULT 1,
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "applied_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MusicCatalogCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MusicCatalogCandidate_music_index_fingerprint_key"
ON "MusicCatalogCandidate"("music_index", "fingerprint");

-- CreateIndex
CREATE INDEX "MusicCatalogCandidate_status_last_seen_at_idx"
ON "MusicCatalogCandidate"("status", "last_seen_at");
