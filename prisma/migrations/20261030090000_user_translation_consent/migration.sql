-- 번역 동의 시각. 비어 있으면 그 사람의 의견 · 답글을 Gemini 로 보내지 않는다. 기존 사람은 모두 비워(NULL) 둔다.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- AlterTable
-- 다른 표의 시각 칸과 같은 Prisma 기본형(DateTime)에 맞춘다
-- squawk-ignore prefer-timestamp-tz
ALTER TABLE "users" ADD COLUMN     "translation_consent_at" TIMESTAMP(3);

COMMIT;
