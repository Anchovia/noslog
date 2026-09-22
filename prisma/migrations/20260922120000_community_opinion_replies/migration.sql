-- AlterTable
ALTER TABLE "CommunityChartEvaluation" ADD COLUMN     "opinionTranslations" JSONB;

-- AlterTable
ALTER TABLE "CommunityOpinionReport" ADD COLUMN     "replyId" INTEGER;

-- CreateTable
CREATE TABLE "CommunityOpinionReply" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "translations" JSONB,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityOpinionReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityOpinionReplyLike" (
    "replyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityOpinionReplyLike_pkey" PRIMARY KEY ("replyId","userId")
);

-- CreateIndex
CREATE INDEX "CommunityOpinionReply_evaluationId_createdAt_idx" ON "CommunityOpinionReply"("evaluationId", "createdAt");

-- CreateIndex
CREATE INDEX "CommunityOpinionReply_userId_idx" ON "CommunityOpinionReply"("userId");

-- CreateIndex
CREATE INDEX "CommunityOpinionReplyLike_userId_idx" ON "CommunityOpinionReplyLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityOpinionReport_replyId_userId_key" ON "CommunityOpinionReport"("replyId", "userId");

-- AddForeignKey
ALTER TABLE "CommunityOpinionReport" ADD CONSTRAINT "CommunityOpinionReport_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "CommunityOpinionReply"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionReply" ADD CONSTRAINT "CommunityOpinionReply_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "CommunityChartEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionReply" ADD CONSTRAINT "CommunityOpinionReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionReplyLike" ADD CONSTRAINT "CommunityOpinionReplyLike_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "CommunityOpinionReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionReplyLike" ADD CONSTRAINT "CommunityOpinionReplyLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

