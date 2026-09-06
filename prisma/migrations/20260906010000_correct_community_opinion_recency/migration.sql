ALTER TABLE "CommunityChartEvaluation" ADD COLUMN "opinionCreatedAt" TIMESTAMP(3);
UPDATE "CommunityChartEvaluation"
SET "opinionCreatedAt" = "createdAt"
WHERE "opinion" IS NOT NULL;

ALTER TABLE "ChartGoalVoteReview" ALTER COLUMN "mean" DROP NOT NULL;
ALTER TABLE "ChartGoalVoteReview" ALTER COLUMN "median" DROP NOT NULL;
