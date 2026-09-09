-- Keep legacy evaluation data and administrator-owned tier tables unchanged.
-- Legacy pattern axes and perceived_constant cannot be inferred as 2.0 votes.

-- CreateTable
CREATE TABLE "CommunityChartEvaluation" (
    "id" SERIAL NOT NULL,
    "chartId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stairs" INTEGER,
    "repetition" INTEGER,
    "polyrhythm" INTEGER,
    "offset" INTEGER,
    "chords" INTEGER,
    "opinion" TEXT,
    "opinionHidden" BOOLEAN NOT NULL DEFAULT false,
    "excluded" BOOLEAN NOT NULL DEFAULT false,
    "moderationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "opinionUpdatedAt" TIMESTAMP(3),

    CONSTRAINT "CommunityChartEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityOpinionHelpful" (
    "evaluationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityOpinionHelpful_pkey" PRIMARY KEY ("evaluationId","userId")
);

-- CreateTable
CREATE TABLE "CommunityOpinionReport" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "explanation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityOpinionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartGoalVote" (
    "id" SERIAL NOT NULL,
    "chartId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "excluded" BOOLEAN NOT NULL DEFAULT false,
    "auditReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartGoalVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartGoalVoteAudit" (
    "id" SERIAL NOT NULL,
    "chartId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousValue" DOUBLE PRECISION,
    "value" DOUBLE PRECISION,
    "evidence" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartGoalVoteAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartGoalVoteReview" (
    "id" SERIAL NOT NULL,
    "chartId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_review',
    "officialValue" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "mean" DOUBLE PRECISION NOT NULL,
    "median" DOUBLE PRECISION NOT NULL,
    "distribution" JSONB NOT NULL,
    "reviewReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartGoalVoteReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityChartEvaluation_chartId_excluded_opinionUpdatedAt_idx" ON "CommunityChartEvaluation"("chartId", "excluded", "opinionUpdatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityChartEvaluation_chartId_userId_key" ON "CommunityChartEvaluation"("chartId", "userId");

-- CreateIndex
CREATE INDEX "CommunityOpinionHelpful_userId_idx" ON "CommunityOpinionHelpful"("userId");

-- CreateIndex
CREATE INDEX "CommunityOpinionReport_status_createdAt_idx" ON "CommunityOpinionReport"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityOpinionReport_evaluationId_userId_key" ON "CommunityOpinionReport"("evaluationId", "userId");

-- CreateIndex
CREATE INDEX "ChartGoalVote_chartId_mode_goal_excluded_value_idx" ON "ChartGoalVote"("chartId", "mode", "goal", "excluded", "value");

-- CreateIndex
CREATE UNIQUE INDEX "ChartGoalVote_chartId_userId_mode_goal_key" ON "ChartGoalVote"("chartId", "userId", "mode", "goal");

-- CreateIndex
CREATE INDEX "ChartGoalVoteAudit_chartId_mode_goal_createdAt_idx" ON "ChartGoalVoteAudit"("chartId", "mode", "goal", "createdAt");

-- CreateIndex
CREATE INDEX "ChartGoalVoteAudit_userId_idx" ON "ChartGoalVoteAudit"("userId");

-- CreateIndex
CREATE INDEX "ChartGoalVoteReview_status_updatedAt_idx" ON "ChartGoalVoteReview"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChartGoalVoteReview_chartId_mode_goal_key" ON "ChartGoalVoteReview"("chartId", "mode", "goal");

-- AddForeignKey
ALTER TABLE "CommunityChartEvaluation" ADD CONSTRAINT "CommunityChartEvaluation_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityChartEvaluation" ADD CONSTRAINT "CommunityChartEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionHelpful" ADD CONSTRAINT "CommunityOpinionHelpful_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "CommunityChartEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionHelpful" ADD CONSTRAINT "CommunityOpinionHelpful_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionReport" ADD CONSTRAINT "CommunityOpinionReport_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "CommunityChartEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityOpinionReport" ADD CONSTRAINT "CommunityOpinionReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartGoalVote" ADD CONSTRAINT "ChartGoalVote_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartGoalVote" ADD CONSTRAINT "ChartGoalVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartGoalVoteAudit" ADD CONSTRAINT "ChartGoalVoteAudit_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartGoalVoteAudit" ADD CONSTRAINT "ChartGoalVoteAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartGoalVoteReview" ADD CONSTRAINT "ChartGoalVoteReview_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "MusicChart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CommunityChartEvaluation" ADD CONSTRAINT "CommunityChartEvaluation_rating_range" CHECK (
    ("stairs" IS NULL OR "stairs" BETWEEN 0 AND 4) AND
    ("repetition" IS NULL OR "repetition" BETWEEN 0 AND 4) AND
    ("polyrhythm" IS NULL OR "polyrhythm" BETWEEN 0 AND 4) AND
    ("offset" IS NULL OR "offset" BETWEEN 0 AND 4) AND
    ("chords" IS NULL OR "chords" BETWEEN 0 AND 4)
);
ALTER TABLE "ChartGoalVote" ADD CONSTRAINT "ChartGoalVote_scope_value" CHECK (
    "mode" IN ('basic', 'recital') AND "goal" IN ('s', 'fc', 'pianist') AND
    "value" BETWEEN 1 AND 14.5 AND abs("value" * 10 - round("value" * 10)) < 0.00000001
);
