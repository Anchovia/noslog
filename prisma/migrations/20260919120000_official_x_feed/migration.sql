-- No external fetch or production seed: the authenticated sync initializes the row.
CREATE TABLE "OfficialXFeed" (
    "id" TEXT NOT NULL,
    "content" JSONB,
    "last_attempt_at" TIMESTAMP(3),
    "last_success_at" TIMESTAMP(3),
    CONSTRAINT "OfficialXFeed_pkey" PRIMARY KEY ("id")
);
