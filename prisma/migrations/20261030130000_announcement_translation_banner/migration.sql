BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
ALTER TABLE "announcement_translations" ADD COLUMN     "banner_url" TEXT;

COMMIT;
