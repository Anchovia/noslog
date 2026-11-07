-- 올리면 이전 로그인 쿠키가 무효가 되는 세션 버전. 기존 쿠키는 0 으로 보므로 적용만으로는 아무도 로그아웃되지 않는다.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
-- 다른 표의 버전 칸(sync_token_version)과 같은 Prisma 기본형(Int)에 맞춘다
-- squawk-ignore prefer-bigint-over-int
ALTER TABLE "users" ADD COLUMN     "session_version" INTEGER NOT NULL DEFAULT 0;

COMMIT;
