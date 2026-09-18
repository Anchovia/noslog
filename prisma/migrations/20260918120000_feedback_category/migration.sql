-- 피드백 제보 종류(오류 제보 · 제안 의견). 이전 제보와 오락실 제보는 비어 있다
ALTER TABLE "FeedbackReport" ADD COLUMN "category" TEXT;
