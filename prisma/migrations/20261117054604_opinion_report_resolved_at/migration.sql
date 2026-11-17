-- 신고를 처리 완료로 바꾼 시각. 보관 6개월을 updated_at 대신 이 칸에서 센다(updated_at 은 글쓴이가 글을 지울 때도 바뀐다).
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
-- 다른 표의 시각 칸과 같은 Prisma 기본형(DateTime)에 맞춘다
-- squawk-ignore prefer-timestamp-tz
ALTER TABLE "community_opinion_reports" ADD COLUMN     "resolved_at" TIMESTAMP(3);

-- 이미 처리한 신고는 지금까지 보관 기간을 세던 updated_at 을 처리 시각으로 옮긴다
UPDATE "community_opinion_reports" SET "resolved_at" = "updated_at" WHERE "status" = 'resolved';

COMMIT;
