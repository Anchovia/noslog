-- CreateEnum
CREATE TYPE "AnnouncementCategory" AS ENUM ('UPDATE', 'MAINTENANCE', 'DATA', 'NOTICE');

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "category" "AnnouncementCategory" NOT NULL DEFAULT 'NOTICE';
