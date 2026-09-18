-- CreateEnum
CREATE TYPE "CommunityEventStatus" AS ENUM ('DRAFT', 'PENDING', 'CHANGES_REQUESTED', 'PUBLISHED', 'REJECTED');

-- CreateTable
CREATE TABLE "CommunityEvent" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "status" "CommunityEventStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "banner_url" TEXT,
    "published_title" TEXT,
    "published_content" TEXT,
    "published_starts_at" TIMESTAMP(3),
    "published_ends_at" TIMESTAMP(3),
    "published_banner_url" TEXT,
    "published_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "review_note" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewer_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityEvent_status_submitted_at_idx" ON "CommunityEvent"("status", "submitted_at");

-- CreateIndex
CREATE INDEX "CommunityEvent_author_id_updated_at_idx" ON "CommunityEvent"("author_id", "updated_at");

-- CreateIndex
CREATE INDEX "CommunityEvent_published_starts_at_idx" ON "CommunityEvent"("published_starts_at");

-- AddForeignKey
ALTER TABLE "CommunityEvent" ADD CONSTRAINT "CommunityEvent_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityEvent" ADD CONSTRAINT "CommunityEvent_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
