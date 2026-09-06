ALTER TABLE "CommunityOpinionReport" ADD COLUMN "authorId" INTEGER;
ALTER TABLE "CommunityOpinionReport" ADD COLUMN "opinionSnapshot" TEXT;
UPDATE "CommunityOpinionReport" AS report
SET "authorId" = evaluation."userId", "opinionSnapshot" = COALESCE(evaluation."opinion", '')
FROM "CommunityChartEvaluation" AS evaluation
WHERE evaluation."id" = report."evaluationId";
ALTER TABLE "CommunityOpinionReport" ALTER COLUMN "authorId" SET NOT NULL;
ALTER TABLE "CommunityOpinionReport" ALTER COLUMN "opinionSnapshot" SET NOT NULL;
ALTER TABLE "CommunityOpinionReport" ALTER COLUMN "evaluationId" DROP NOT NULL;
ALTER TABLE "CommunityOpinionReport" DROP CONSTRAINT "CommunityOpinionReport_evaluationId_fkey";
ALTER TABLE "CommunityOpinionReport" ADD CONSTRAINT "CommunityOpinionReport_evaluationId_fkey"
FOREIGN KEY ("evaluationId") REFERENCES "CommunityChartEvaluation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CommunityOpinionReport" ADD CONSTRAINT "CommunityOpinionReport_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
