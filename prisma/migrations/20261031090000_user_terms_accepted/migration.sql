-- 이용약관 동의 시각. 약관이 생기기 전에 가입한 사람은 비워(NULL) 둔다.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
-- 다른 표의 시각 칸과 같은 Prisma 기본형(DateTime)에 맞춘다
-- squawk-ignore prefer-timestamp-tz
ALTER TABLE "users" ADD COLUMN     "terms_accepted_at" TIMESTAMP(3);

COMMIT;
