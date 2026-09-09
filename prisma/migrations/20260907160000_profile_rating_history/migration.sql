CREATE TABLE "UserRatingHistory" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "sync_id" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "observed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRatingHistory_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "UserRatingHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRatingHistory_sync_id_fkey" FOREIGN KEY ("sync_id") REFERENCES "DataSync"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRatingHistory_mode_check" CHECK ("mode" IN ('basic', 'recital')),
    CONSTRAINT "UserRatingHistory_rating_check" CHECK ("rating" >= 0 AND "rating" <= 10000)
);
CREATE UNIQUE INDEX "UserRatingHistory_sync_id_mode_key" ON "UserRatingHistory"("sync_id", "mode");
CREATE INDEX "UserRatingHistory_user_id_mode_observed_at_idx" ON "UserRatingHistory"("user_id", "mode", "observed_at");
