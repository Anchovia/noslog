-- AlterTable
ALTER TABLE "User" ADD COLUMN "nostalgia_name" TEXT;
ALTER TABLE "User" ADD COLUMN "sync_token_version" INTEGER NOT NULL DEFAULT 0;
