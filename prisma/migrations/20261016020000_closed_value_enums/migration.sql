-- 2026-10-16 DB 재설계 D4-C 1차 — 닫힌 값 목록 문자열 열을 enum 으로. 값 이름은 DB 에 쓰던 문자열 그대로.
-- 표가 모두 작아(가장 큰 것 수백 줄) 열 타입 변경의 표 재작성은 순간이다. 목록 밖 값이 있으면 캐스트가 실패해 배포가 멈춘다 —
-- 배포 전에 PR 의 확인 SQL 로 운영 값을 본다.
SET lock_timeout = '5s';

CREATE TYPE "UserRole" AS ENUM ('admin', 'user');
CREATE TYPE "LocaleCode" AS ENUM ('en', 'ja', 'ko');
CREATE TYPE "FeedbackCategory" AS ENUM ('bug', 'idea');
CREATE TYPE "FeedbackStatus" AS ENUM ('open', 'resolved');
CREATE TYPE "ArcadeReportType" AS ENUM ('address', 'condition', 'count', 'hours', 'other', 'price', 'unavailable');
CREATE TYPE "ProposalEvidenceKind" AS ENUM ('direct', 'official', 'video');
CREATE TYPE "ProposalStatus" AS ENUM ('applied', 'pending', 'rejected');
CREATE TYPE "ProposalRejectReason" AS ENUM ('duplicate', 'evidence', 'format', 'other', 'url');
CREATE TYPE "ChartDraftStatus" AS ENUM ('changes_requested', 'draft', 'published', 'submitted');
CREATE TYPE "ChartCommentKind" AS ENUM ('praise', 'problem', 'suggestion');
CREATE TYPE "ContributionKind" AS ENUM ('arcade_report', 'cabinet_check', 'chart', 'chart_comment', 'chart_field');
CREATE TYPE "MusicTranslationStatus" AS ENUM ('approved', 'draft');
CREATE TYPE "CatalogCandidateStatus" AS ENUM ('applied', 'pending', 'rejected');
CREATE TYPE "DataSyncStatus" AS ENUM ('completed', 'failed', 'processing');
CREATE TYPE "SyncScope" AS ENUM ('full', 'recent');
CREATE TYPE "PlayMode" AS ENUM ('basic', 'recital');
CREATE TYPE "TierListStatus" AS ENUM ('archived', 'draft', 'published');
CREATE TYPE "OpinionReportReason" AS ENUM ('abuse', 'other', 'sensitive', 'spam');
CREATE TYPE "GoalVoteAuditAction" AS ENUM ('create', 'delete', 'edit');
CREATE TYPE "BingoStatus" AS ENUM ('archived', 'draft', 'published');
CREATE TYPE "BingoMissionType" AS ENUM ('category', 'exam', 'music', 'record');
-- play_music · play_category 는 옛 더미 빙고 시드(lib/dummy/bingo.ts)가 쓰는 값
CREATE TYPE "BingoRuleType" AS ENUM ('full_combo', 'manual', 'play_category', 'play_count', 'play_music', 'rank', 'score');
CREATE TYPE "ExamMode" AS ENUM ('basic', 'event', 'recital');
CREATE TYPE "ExamScoringType" AS ENUM ('recital_point', 'score');
CREATE TYPE "ExamStatus" AS ENUM ('draft', 'published');
CREATE TYPE "ExamRequirementType" AS ENUM ('cumulative', 'single');
CREATE TYPE "ExamSubmissionStatus" AS ENUM ('approved', 'pending', 'rejected');

-- enum 이 같은 값을 지키므로 값 목록 CHECK 는 지운다. 투표 CHECK 는 목표 · 값 검사만 남긴다(목표는 아직 문자열 — 2차)
ALTER TABLE "FeedbackReport" DROP CONSTRAINT "FeedbackReport_arcade_type_check";
ALTER TABLE "AnnouncementTranslation" DROP CONSTRAINT "AnnouncementTranslation_locale_check";
ALTER TABLE "ArcadeLocalizedIdentity" DROP CONSTRAINT "ArcadeLocalizedIdentity_locale_check";
ALTER TABLE "UserRatingHistory" DROP CONSTRAINT "UserRatingHistory_mode_check";
ALTER TABLE "ChartGoalVote" DROP CONSTRAINT "ChartGoalVote_scope_value";

-- 문자열 비교로 저장된 부분 인덱스는 타입 변경 때 다시 만들 수 없어 지웠다가 같은 정의로 만든다(표가 작아 CONCURRENTLY 없이)
DROP INDEX "TierList_published_mode_goal_key";
DROP INDEX "DataSync_one_processing_per_user";
DROP INDEX "chart_field_proposals_one_pending";

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT, ALTER COLUMN "locale" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole", ALTER COLUMN "locale" TYPE "LocaleCode" USING "locale"::"LocaleCode";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user'::"UserRole", ALTER COLUMN "locale" SET DEFAULT 'ko'::"LocaleCode";
ALTER TABLE "FeedbackReport" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "FeedbackReport" ALTER COLUMN "category" TYPE "FeedbackCategory" USING "category"::"FeedbackCategory", ALTER COLUMN "status" TYPE "FeedbackStatus" USING "status"::"FeedbackStatus", ALTER COLUMN "arcadeReportType" TYPE "ArcadeReportType" USING "arcadeReportType"::"ArcadeReportType";
ALTER TABLE "FeedbackReport" ALTER COLUMN "status" SET DEFAULT 'open'::"FeedbackStatus";
ALTER TABLE "AnnouncementTranslation" ALTER COLUMN "locale" TYPE "LocaleCode" USING "locale"::"LocaleCode";
ALTER TABLE "PollTranslation" ALTER COLUMN "locale" TYPE "LocaleCode" USING "locale"::"LocaleCode";
ALTER TABLE "PollOptionTranslation" ALTER COLUMN "locale" TYPE "LocaleCode" USING "locale"::"LocaleCode";
ALTER TABLE "ArcadeLocalizedIdentity" ALTER COLUMN "locale" TYPE "LocaleCode" USING "locale"::"LocaleCode";
ALTER TABLE "chart_field_proposals" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "chart_field_proposals" ALTER COLUMN "evidence_kind" TYPE "ProposalEvidenceKind" USING "evidence_kind"::"ProposalEvidenceKind", ALTER COLUMN "status" TYPE "ProposalStatus" USING "status"::"ProposalStatus", ALTER COLUMN "reject_reason_code" TYPE "ProposalRejectReason" USING "reject_reason_code"::"ProposalRejectReason";
ALTER TABLE "chart_field_proposals" ALTER COLUMN "status" SET DEFAULT 'pending'::"ProposalStatus";
ALTER TABLE "chart_drafts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "chart_drafts" ALTER COLUMN "status" TYPE "ChartDraftStatus" USING "status"::"ChartDraftStatus";
ALTER TABLE "chart_drafts" ALTER COLUMN "status" SET DEFAULT 'draft'::"ChartDraftStatus";
ALTER TABLE "chart_comments" ALTER COLUMN "kind" DROP DEFAULT;
ALTER TABLE "chart_comments" ALTER COLUMN "kind" TYPE "ChartCommentKind" USING "kind"::"ChartCommentKind";
ALTER TABLE "chart_comments" ALTER COLUMN "kind" SET DEFAULT 'problem'::"ChartCommentKind";
ALTER TABLE "contribution_points" ALTER COLUMN "kind" TYPE "ContributionKind" USING "kind"::"ContributionKind";
ALTER TABLE "MusicTranslation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MusicTranslation" ALTER COLUMN "locale" TYPE "LocaleCode" USING "locale"::"LocaleCode", ALTER COLUMN "status" TYPE "MusicTranslationStatus" USING "status"::"MusicTranslationStatus";
ALTER TABLE "MusicTranslation" ALTER COLUMN "status" SET DEFAULT 'draft'::"MusicTranslationStatus";
ALTER TABLE "MusicCatalogCandidate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MusicCatalogCandidate" ALTER COLUMN "status" TYPE "CatalogCandidateStatus" USING "status"::"CatalogCandidateStatus";
ALTER TABLE "MusicCatalogCandidate" ALTER COLUMN "status" SET DEFAULT 'pending'::"CatalogCandidateStatus";
ALTER TABLE "DataSync" ALTER COLUMN "status" DROP DEFAULT, ALTER COLUMN "sync_scope" DROP DEFAULT;
ALTER TABLE "DataSync" ALTER COLUMN "status" TYPE "DataSyncStatus" USING "status"::"DataSyncStatus", ALTER COLUMN "sync_scope" TYPE "SyncScope" USING "sync_scope"::"SyncScope";
ALTER TABLE "DataSync" ALTER COLUMN "status" SET DEFAULT 'processing'::"DataSyncStatus", ALTER COLUMN "sync_scope" SET DEFAULT 'full'::"SyncScope";
ALTER TABLE "TierList" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TierList" ALTER COLUMN "mode" TYPE "PlayMode" USING "mode"::"PlayMode", ALTER COLUMN "status" TYPE "TierListStatus" USING "status"::"TierListStatus";
ALTER TABLE "TierList" ALTER COLUMN "status" SET DEFAULT 'draft'::"TierListStatus";
ALTER TABLE "CommunityOpinionReport" ALTER COLUMN "reason" TYPE "OpinionReportReason" USING "reason"::"OpinionReportReason";
ALTER TABLE "ChartGoalVote" ALTER COLUMN "mode" TYPE "PlayMode" USING "mode"::"PlayMode";
ALTER TABLE "ChartGoalVoteAudit" ALTER COLUMN "mode" TYPE "PlayMode" USING "mode"::"PlayMode", ALTER COLUMN "action" TYPE "GoalVoteAuditAction" USING "action"::"GoalVoteAuditAction";
ALTER TABLE "ChartGoalVoteReview" ALTER COLUMN "mode" TYPE "PlayMode" USING "mode"::"PlayMode";
ALTER TABLE "UserRatingHistory" ALTER COLUMN "mode" TYPE "PlayMode" USING "mode"::"PlayMode";
ALTER TABLE "Bingo" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Bingo" ALTER COLUMN "status" TYPE "BingoStatus" USING "status"::"BingoStatus";
ALTER TABLE "Bingo" ALTER COLUMN "status" SET DEFAULT 'draft'::"BingoStatus";
ALTER TABLE "BingoCell" ALTER COLUMN "mission_type" DROP DEFAULT, ALTER COLUMN "rule_type" DROP DEFAULT;
ALTER TABLE "BingoCell" ALTER COLUMN "mission_type" TYPE "BingoMissionType" USING "mission_type"::"BingoMissionType", ALTER COLUMN "rule_type" TYPE "BingoRuleType" USING "rule_type"::"BingoRuleType";
ALTER TABLE "BingoCell" ALTER COLUMN "mission_type" SET DEFAULT 'record'::"BingoMissionType", ALTER COLUMN "rule_type" SET DEFAULT 'manual'::"BingoRuleType";
ALTER TABLE "Exam" ALTER COLUMN "scoring_type" DROP DEFAULT, ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Exam" ALTER COLUMN "mode" TYPE "ExamMode" USING "mode"::"ExamMode", ALTER COLUMN "scoring_type" TYPE "ExamScoringType" USING "scoring_type"::"ExamScoringType", ALTER COLUMN "status" TYPE "ExamStatus" USING "status"::"ExamStatus";
ALTER TABLE "Exam" ALTER COLUMN "scoring_type" SET DEFAULT 'score'::"ExamScoringType", ALTER COLUMN "status" SET DEFAULT 'draft'::"ExamStatus";
ALTER TABLE "ExamStage" ALTER COLUMN "requirement_type" DROP DEFAULT;
ALTER TABLE "ExamStage" ALTER COLUMN "requirement_type" TYPE "ExamRequirementType" USING "requirement_type"::"ExamRequirementType";
ALTER TABLE "ExamStage" ALTER COLUMN "requirement_type" SET DEFAULT 'single'::"ExamRequirementType";
ALTER TABLE "ExamSubmission" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ExamSubmission" ALTER COLUMN "status" TYPE "ExamSubmissionStatus" USING "status"::"ExamSubmissionStatus";
ALTER TABLE "ExamSubmission" ALTER COLUMN "status" SET DEFAULT 'pending'::"ExamSubmissionStatus";
ALTER TABLE "PlayerRating" ALTER COLUMN "mode" TYPE "PlayMode" USING "mode"::"PlayMode";

ALTER TABLE "ChartGoalVote" ADD CONSTRAINT "ChartGoalVote_scope_value" CHECK (
    "goal" IN ('s', 'fc', '990k', 'pianist') AND
    "value" BETWEEN 1 AND 14.5 AND abs("value" * 10 - round("value" * 10)) < 0.00000001
);
CREATE UNIQUE INDEX "TierList_published_mode_goal_key" ON "TierList" ("mode", "goal") WHERE "status" = 'published' AND "goal" IS NOT NULL;
CREATE UNIQUE INDEX "DataSync_one_processing_per_user" ON "DataSync"("user_id") WHERE "status" = 'processing';
CREATE UNIQUE INDEX "chart_field_proposals_one_pending" ON "chart_field_proposals"("user_id", "chart_id", "field") WHERE "status" = 'pending';
