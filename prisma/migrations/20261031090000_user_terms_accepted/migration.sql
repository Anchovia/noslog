-- 이용약관 동의 시각. 약관이 생기기 전에 가입한 사람은 비워(NULL) 둔다.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "terms_accepted_at" TIMESTAMP(3);

COMMIT;
