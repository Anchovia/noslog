CREATE TABLE "FeedbackReport" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "FeedbackReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FeedbackReport_status_created_at_idx" ON "FeedbackReport"("status", "created_at");
CREATE INDEX "FeedbackReport_user_id_created_at_idx" ON "FeedbackReport"("user_id", "created_at");

ALTER TABLE "FeedbackReport"
ADD CONSTRAINT "FeedbackReport_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
