-- AlterTable
ALTER TABLE "Arcade"
ADD COLUMN "machine_count" INTEGER,
ADD COLUMN "price_info" TEXT,
ADD COLUMN "business_hours" TEXT,
ADD COLUMN "machine_status" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN "status_note" TEXT,
ADD COLUMN "notes" TEXT;
