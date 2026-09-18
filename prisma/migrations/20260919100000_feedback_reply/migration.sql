-- 피드백 관리자 답변 · 제보한 사람이 읽은 때
ALTER TABLE "FeedbackReport" ADD COLUMN "reply" TEXT;
ALTER TABLE "FeedbackReport" ADD COLUMN "replied_at" TIMESTAMP(3);
ALTER TABLE "FeedbackReport" ADD COLUMN "reply_seen_at" TIMESTAMP(3);
